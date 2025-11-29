from django.urls import path
from .views import register, login, user_search_history

urlpatterns = [
    path("register/", register, name="account-register"),
    path("login/", login, name="account-login"),
    path("search_history/", user_search_history, name="user-search-history"),
]
