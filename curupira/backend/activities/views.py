#from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Activity

@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all().values('id', 'name')
    return Response(list(categories))

@api_view(['GET'])
def activities_by_category(request, category_id):
    activities = Activity.objects.filter(category_id=category_id).values(
        'id', 'name', 'activity_id', 'unit_type', 'unit', 'source', 'region', 'notes'
    )
    return Response(list(activities))
