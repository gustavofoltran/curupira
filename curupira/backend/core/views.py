<<<<<<< HEAD
from django.http import JsonResponse
from backend.core.API.test_organizer import ExampleDataOrganizer
=======
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from core.API.test_organizer import ExampleDataOrganizer
from core.API.activity_organizer import ActivitiyOrganizer
>>>>>>> dev

@api_view(['GET'])
def test_api_view(request):
    organizer = ExampleDataOrganizer()
    return Response(organizer.get_data())

@api_view(['GET'])
def activity_emission(request):
    try:
        activity_id = request.GET.get('id')
        value1 = request.GET.get('value1')
        value2 = request.GET.get('value2')
        organizer = ActivitiyOrganizer(activity_id, value1, value2)
        return Response(organizer.get_data())
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)