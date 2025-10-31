from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Activity(models.Model):
    category = models.ForeignKey(Category, related_name="activities", on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    activity_id = models.CharField(max_length=200, unique=True)
    unit_type = models.CharField(max_length=50)
    unit = models.CharField(max_length=50)
    source = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.category.name})"
    
