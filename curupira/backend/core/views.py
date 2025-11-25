from django.http import JsonResponse
from core.API.test_organizer import ExampleDataOrganizer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.API.test_organizer import ExampleDataOrganizer
from core.API.activity_organizer import ActivitiyOrganizer
from account.models import User, SearchHistory
from core.Account.jwt_utils import decode_jwt_token

@api_view(['GET'])
def test_api_view(request):
    organizer = ExampleDataOrganizer()
    return Response(organizer.get_data())

@api_view(['GET'])
def activity_emission(request):
    user = None
    jwt_token = request.headers.get('Authorization')
    if jwt_token and jwt_token.startswith('Bearer '):
        jwt_token = jwt_token.split(' ', 1)[1]
        try:
            payload = decode_jwt_token(jwt_token)
            user_id = payload.get('user_id')
            user = User.objects.filter(id=user_id).first()
        except Exception:
            user = None

    try:
        activity_id = request.GET.get('id')
        value1 = request.GET.get('value1')
        value2 = request.GET.get('value2')
        organizer = ActivitiyOrganizer(activity_id, value1, value2)
        result = organizer.get_data()
        # Só registra se usuário autenticado, resposta válida e não erro
        if user and isinstance(result, dict) and 'error' not in result:
            SearchHistory.objects.create(
                user=user,
                activity_id=activity_id,
                value1=float(value1) if value1 is not None else None,
                value2=float(value2) if value2 is not None else None,
                response=result
            )
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)