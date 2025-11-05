from rest_framework import serializers
from .models import Activity, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="activity_id", read_only=True)
    category = CategorySerializer(read_only=True)
    unitType = serializers.CharField(source="unit_type")

    class Meta:
        model = Activity
        fields = [
            "id",
            "name",
            "category",
            "unitType",
            "unit",
            "source",
            "region",
            "notes",
        ]
