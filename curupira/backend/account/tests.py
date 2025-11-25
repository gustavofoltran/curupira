from django.test import TestCase, Client
from account.models import User
import jwt
from django.conf import settings

class AccountAPITest(TestCase):
    def setUp(self):
        self.client = Client()

    def test_register_and_login(self):
        # Teste de registro
        reg = self.client.post('/api/account/register/', {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com'
        }, content_type='application/json')
        self.assertEqual(reg.status_code, 201)
        self.assertTrue(User.objects.filter(username='testuser').exists())

        # Teste de login
        login = self.client.post('/api/account/login/', {
            'username': 'testuser',
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
        reg = self.client.post('/api/account/register/', {
            'username': 'testuser2',
            'password': 'testpass456',
            'email': 'test2@example.com'
        }, content_type='application/json')
        self.assertEqual(reg.status_code, 201)

        # Tenta login com senha errada
        login_wrong_pass = self.client.post('/api/account/login/', {
            'username': 'testuser2',
            'password': 'wrongpass'
        }, content_type='application/json')
        self.assertEqual(login_wrong_pass.status_code, 401)
        self.assertEqual(login_wrong_pass.json(), {"detail": "Invalid credentials"})

        # Tenta login com username errado
        login_wrong_user = self.client.post('/api/account/login/', {
            'username': 'nouser',
            'password': 'testpass456'
        }, content_type='application/json')
        self.assertEqual(login_wrong_user.status_code, 401)
        self.assertEqual(login_wrong_pass.json(), {"detail": "Invalid credentials"})
