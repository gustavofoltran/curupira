from django.contrib import admin
from .models import User, SearchHistory

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "created_at", "last_access")
    search_fields = ("username", "email")
    list_filter = ("created_at", "last_access")
    readonly_fields = ("created_at", "last_access")

@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "activity_id", "search_time", "value1", "value2")
    search_fields = ("user__username", "activity_id")
    list_filter = ("search_time",)
    readonly_fields = ("search_time", "response")
