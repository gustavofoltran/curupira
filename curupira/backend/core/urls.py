from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from core.views import activity_emission, test_api_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("activities.urls")),
    path("api/account/", include("core.Account.urls")),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("api/activity_emission/", activity_emission, name="activity_emission"),
    path("api/test/", test_api_view, name="test_api_view"),
]
