from rest_framework import serializers

from .models import Activity, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ActivitySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False
    )
    unitType = serializers.CharField(source="unit_type")

    class Meta:
        model = Activity
        fields = [
            "id",
            "name",
            "category",
            "category_id",
            "activity_id",
            "unitType",
            "unit",
            "source",
            "region",
            "notes",
        ]
        read_only_fields = ["id", "category"]
