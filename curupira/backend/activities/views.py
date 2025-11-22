from core.API.api_requester import APIRequester
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Activity, Category
from .serializers import ActivitySerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.select_related("category").all()
    serializer_class = ActivitySerializer
    
    def get_queryset(self):
        return Activity.objects.select_related("category").all()


@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_emission(request):
    activity_id = request.data.get("activityId")
    duration = request.data.get("duration")

    if not activity_id or not duration:
        return Response(
            {"error": "Parâmetros 'activityId' e 'duration' são obrigatórios."},
            status=status.HTTP_400_BAD_REQUEST
        )

    api = APIRequester()
    payload = {
        "emission_factor": {
            "activity_id": activity_id,
            "data_version": "^21"
        },
        "parameters": {
            "time": duration,
            "time_unit": "m"
        }
    }

    data = api.fetch(payload)
    
    if "error" in data:
        return Response({"error": data["error"]}, status=status.HTTP_502_BAD_GATEWAY)

    value = data.get("co2e")
    unit = data.get("co2e_unit")

    if value is None or unit is None:
        return Response({"error": "Resposta inesperada da API Climatiq."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(
        {
            "value": value,
            "unit": unit
        },
        status=status.HTTP_200_OK
    )
