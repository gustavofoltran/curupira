from django.test import TestCase, Client
from account.models import SearchHistory, User
from activities.models import Activity, Category
import jwt
from django.conf import settings

class AccountAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        
        # Setup básico para criar atividades (necessário para o histórico)
        self.category = Category.objects.create(name="Energia")
        self.activity = Activity.objects.create(
            category=self.category,
            name="Diesel (Maquinário Agrícola/Industrial)",
            activity_id="fuel-type_diesel-fuel_use_mobile_locomotives",
            unit_type="Volume",
            unit="gallon_us",
            source="EPA",
            region="US",
            notes="Fator de base para queima de diesel em maquinário móvel como tratores e equipamentos de construção"
        )

    def test_register_and_login(self):
        # Teste de registro
        reg = self.client.post('/api/register/', {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com'
        }, content_type='application/json')
        self.assertEqual(reg.status_code, 201)
        self.assertTrue(User.objects.filter(username='testuser').exists())

        # Teste de login
        login = self.client.post('/api/login/', {
            'email': 'test@example.com',
            'password': 'testpass123'
        }, content_type='application/json')
        self.assertEqual(login.status_code, 200)
        data = login.json()
        self.assertIn('token', data)
        self.assertEqual(data['expires_in'], 3600)

        # Teste de JWT válido
        token = data['token']
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        self.assertEqual(payload['user_id'], User.objects.get(username='testuser').id)

    def test_login_invalid_credentials(self):
        # Registra um usuário válido
        reg = self.client.post('/api/register/', {
            'username': 'testuser2',
            'password': 'testpass456',
            'email': 'test2@example.com'
        }, content_type='application/json')
        self.assertEqual(reg.status_code, 201)

        # Tenta login com senha errada
        login_wrong_pass = self.client.post('/api/login/', {
            'email': 'test2@example.com',
            'password': 'wrongpass'
        }, content_type='application/json')
        self.assertEqual(login_wrong_pass.status_code, 401)
        self.assertEqual(login_wrong_pass.json(), {"detail": "Invalid credentials"})

        # Tenta login com email errado
        login_wrong_user = self.client.post('/api/login/', {
            'email': 'nouser@example.com',
            'password': 'testpass456'
        }, content_type='application/json')
        self.assertEqual(login_wrong_user.status_code, 401)
        self.assertEqual(login_wrong_pass.json(), {"detail": "Invalid credentials"})

    def test_register_duplicate_user(self):
        # Cria dados de usuário duplicados
        user_data = {
            'username': 'dupuser',
            'password': 'password123',
            'email': 'dup@example.com'
        }
        
        # Primeiro registro: Sucesso (201)
        response1 = self.client.post('/api/register/', user_data, content_type='application/json')
        self.assertEqual(response1.status_code, 201)
        
        # Segundo registro: Falha (400)
        response2 = self.client.post('/api/register/', user_data, content_type='application/json')
        self.assertEqual(response2.status_code, 400)

    def test_search_history_created_on_activity_emission(self):
        # Registra e faz login do usuário
        reg = self.client.post('/api/register/', {
            'username': 'searchuser',
            'password': 'searchpass',
            'email': 'search@example.com'
        }, content_type='application/json')
        self.assertEqual(reg.status_code, 201)
        login = self.client.post('/api/login/', {
            'email': 'search@example.com',
            'password': 'searchpass'
        }, content_type='application/json')
        self.assertEqual(login.status_code, 200)
        token = login.json()['token']
        auth_header = f'Bearer {token}'

        # Chama o endpoint de emissão com JWT
        response = self.client.get(
            f'/api/activity_emission/?id={self.activity.id}&value1=698',
            HTTP_AUTHORIZATION=auth_header
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Verifica se o SearchHistory foi criado
        user = User.objects.get(username='searchuser')
        history = SearchHistory.objects.filter(user=user, activity_id=self.activity.id, value1=698).first()
        self.assertIsNotNone(history)
        self.assertEqual(history.activity_id, self.activity.id)
        self.assertEqual(history.value1, 698)
        self.assertEqual(history.value2, None)
        self.assertEqual(history.response, data)

    def test_user_search_history_pagination_and_retrieval(self):
        # Registra e faz login do usuário
        reg = self.client.post('/api/register/', {
            'username': 'historyuser',
            'password': 'historypass',
            'email': 'history@example.com'
        }, content_type='application/json')
        self.assertEqual(reg.status_code, 201)
        login = self.client.post('/api/login/', {
            'email': 'history@example.com',
            'password': 'historypass'
        }, content_type='application/json')
        self.assertEqual(login.status_code, 200)
        token = login.json()['token']
        auth_header = f'Bearer {token}'
        
        user = User.objects.get(username='historyuser')

        # Popular o banco com 25 entradas de histórico
        # Como a ordenação é '-search_time', então o último criado (24) deve aparecer primeiro.
        for i in range(25):
            SearchHistory.objects.create(
                user=user,
                activity_id=self.activity.id,
                value1=100 + i,
                response={"result": i}
            )

        # Teste da Página 1 (Default size=10), deve conter 10 itens
        res_p1 = self.client.get('/api/search_history/?page=1&page_size=10', 
                                 HTTP_AUTHORIZATION=auth_header)
        self.assertEqual(res_p1.status_code, 200)
        data_p1 = res_p1.json()
        
        self.assertEqual(data_p1['count'], 25)
        self.assertEqual(len(data_p1['results']), 10)
        self.assertEqual(data_p1['current_page'], 1)
        self.assertIsNotNone(data_p1['next_page'])    # Deve haver próxima página

        # Teste da Página 3 (Última página)
        # Com 25 itens e páginas de 10, a página 3 deve ter 5 itens
        res_p3 = self.client.get('/api/search_history/?page=3&page_size=10', 
                                 HTTP_AUTHORIZATION=auth_header)
        self.assertEqual(res_p3.status_code, 200)
        data_p3 = res_p3.json()
        
        self.assertEqual(len(data_p3['results']), 5)
        self.assertIsNone(data_p3['next_page']) # Não deve haver página 4

        # Teste do limite de Page Size (Max 100)
        # Solicitamos 150, mas a view deve limitar internamente a 100
        # Como temos apenas 25 itens, ele deve retornar todos os 25 e não dar erro.
        res_large = self.client.get('/api/search_history/?page_size=150', 
                                    HTTP_AUTHORIZATION=auth_header)
        self.assertEqual(res_large.status_code, 200)
        data_large = res_large.json()
        self.assertEqual(len(data_large['results']), 25)
        # Verifica se o metadado 'page_size' na resposta reflete o cap de 100 (lógica da view)
        self.assertEqual(data_large['page_size'], 100)
    
    def test_user_search_history_invalid_parameters(self):
        # Registra e faz login do usuário
        reg = self.client.post('/api/register/', {
            'username': 'badparamuser',
            'password': 'badparampass',
            'email': 'badparam@example.com'
        }, content_type='application/json')
        self.assertEqual(reg.status_code, 201)
        login = self.client.post('/api/login/', {
            'email': 'badparam@example.com',
            'password': 'badparampass'
        }, content_type='application/json')
        self.assertEqual(login.status_code, 200)
        token = login.json()['token']
        auth_header = f'Bearer {token}'

        # Caso 1: Page não é número
        res_nan = self.client.get('/api/search_history/?page=abc', HTTP_AUTHORIZATION=auth_header)
        self.assertEqual(res_nan.status_code, 400)
        self.assertIn("page e page_size devem ser números", res_nan.json()['detail'])

        # Caso 2: Página inexistente (EmptyPage)
        user = User.objects.get(username='badparamuser')
        SearchHistory.objects.create(user=user, activity_id=self.activity.id, value1=10, response={"test": 123})
        res_empty = self.client.get('/api/search_history/?page=99', HTTP_AUTHORIZATION=auth_header)
        self.assertEqual(res_empty.status_code, 404)
        self.assertIn("Página 99 não existe", res_empty.json()['detail'])

    def test_access_history_without_token(self):
        # Acesso sem token deve ser negado
        response = self.client.get('/api/search_history/')
        self.assertEqual(response.status_code, 401)
        
        # Acesso com token mal formatado
        response_bad_header = self.client.get('/api/search_history/', HTTP_AUTHORIZATION='TokenRuim')
        self.assertEqual(response_bad_header.status_code, 401)