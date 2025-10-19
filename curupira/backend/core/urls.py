from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from activities.views import list_categories, activities_by_category
from core.views import activity_emission, test_api_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path('api/categories/', list_categories, name='list_categories'),
    path('api/categories/<int:category_id>/activities/', activities_by_category, name='activities_by_category'),
    path("api/activity_emission/", activity_emission, name="activity_emission"),
    path("api/test/", test_api_view, name="test_api_view"),
]
