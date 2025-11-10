from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r"activities", ActivityViewSet, basename="activity")
router.register(r"categories", CategoryViewSet, basename="category")

urlpatterns = [
    path('', include(router.urls)),
]
