from django.urls import path
from .views import register, login

urlpatterns = [
    path("register/", register, name="account-register"),
    path("login/", login, name="account-login"),
]
