from django.contrib import admin
from .models import Category, Activity

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "unit_type", "unit", "region")
    search_fields = ("name", "activity_id", "category__name")
    list_filter = ("category", "unit_type", "region")
