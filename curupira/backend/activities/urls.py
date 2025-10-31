from django.urls import path, include
from rest_framework.routers import DefaultRouter
from activities.views import calculate_emission
from .views import ActivityViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r"activities", ActivityViewSet, basename="activity")
router.register(r"categories", CategoryViewSet, basename="category")

urlpatterns = [
    path('calculate-emission/', calculate_emission, name='calculate-emission'),
    path('', include(router.urls)),
]
