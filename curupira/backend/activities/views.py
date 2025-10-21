from rest_framework import viewsets
from .models import Activity, Category
from .serializers import ActivitySerializer, CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.select_related("category").all()
    serializer_class = ActivitySerializer
