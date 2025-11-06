from django.http import JsonResponse
from backend.core.API.test_organizer import ExampleDataOrganizer

def test_api_view(request):
    organizer = ExampleDataOrganizer()
    result = organizer.get_data()
    return JsonResponse(result)