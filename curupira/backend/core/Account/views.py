from account.models import SearchHistory, User
from django.core.paginator import EmptyPage, Paginator
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .jwt_utils import create_jwt_token, decode_jwt_token
from .serializers import (LoginSerializer, RegisterSerializer,
                          SearchHistorySerializer, UserSerializer)


@api_view(["POST"])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"id": user.id, "username": user.username, "email": user.email},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    token = create_jwt_token(user.id, exp_hours=1)
    user.last_access = timezone.now()
    user.save(update_fields=["last_access"])  # update last access timestamp

    return Response({"token": token, "expires_in": 3600})


@api_view(["GET"])
def me(request):
    jwt_token = request.headers.get("Authorization")
    if not jwt_token or not jwt_token.startswith("Bearer "):
        return Response(
            {"detail": "Token de autenticação necessário"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        jwt_token = jwt_token.split(" ", 1)[1]
        payload = decode_jwt_token(jwt_token)
        user_id = payload.get("user_id")
        user = User.objects.filter(id=user_id).first()

        if not user:
            return Response(
                {"detail": "Usuário não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UserSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"detail": f"Erro ao buscar usuário: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(['GET'])
def user_search_history(request):
    # Verificar autenticação via JWT
    jwt_token = request.headers.get('Authorization')
    if not jwt_token or not jwt_token.startswith('Bearer '):
        return Response({"detail": "Token de autenticação necessário"}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        jwt_token = jwt_token.split(' ', 1)[1]
        payload = decode_jwt_token(jwt_token)
        user_id = payload.get('user_id')
        user = User.objects.filter(id=user_id).first()
        
        if not user:
            return Response({"detail": "Usuário não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Obter parâmetros de paginação da query string
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)
        
        # Validar parâmetros
        try:
            page = int(page)
            page_size = int(page_size)
        except ValueError:
            return Response(
                {"detail": "page e page_size devem ser números inteiros"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Limitar o tamanho limite da página para evitar sobrecarga
        if page_size > 100:
            page_size = 100
        if page_size < 1:
            page_size = 1
        
        # Buscar o histórico do usuário ordenado do mais recente para o mais antigo
        search_history = SearchHistory.objects.filter(user=user).order_by('-search_time')
        
        # Aplicar paginação
        paginator = Paginator(search_history, page_size)
        
        try:
            history_page = paginator.page(page)
        except EmptyPage:
            return Response(
                {"detail": f"Página {page} não existe. Total de páginas: {paginator.num_pages}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Serializar os dados
        serializer = SearchHistorySerializer(history_page, many=True)
        
        # Montar resposta com metadados de paginação
        response_data = {
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page,
            "page_size": page_size,
            "next_page": history_page.next_page_number() if history_page.has_next() else None,
            "previous_page": history_page.previous_page_number() if history_page.has_previous() else None,
            "results": serializer.data
        }
        
        return Response(response_data)
        
    except Exception as e:
        return Response(
            {"detail": f"Erro ao buscar histórico: {str(e)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )