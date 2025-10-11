import json
from django.core.management.base import BaseCommand
from activities.models import Category, Activity

class Command(BaseCommand):
    help = "Import activities from JSON file"

    def add_arguments(self, parser):
        parser.add_argument("json_file", type=str)

    def handle(self, *args, **kwargs):
        json_file = kwargs["json_file"]
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        for cat in data["activitiesCatalog"]:
            category, _ = Category.objects.get_or_create(name=cat["category"])
            for act in cat["activities"]:
                Activity.objects.update_or_create(
                    activity_id=act["activity_id"],
                    defaults={
                        "category": category,
                        "name": act["name"],
                        "unit_type": act["unit_type"],
                        "unit": act["unit"],
                        "source": act.get("source", ""),
                        "region": act.get("region", ""),
                        "notes": act.get("notes", ""),
                    }
                )
        self.stdout.write(self.style.SUCCESS("Activities imported successfully!"))
