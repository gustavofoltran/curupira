from activities.models import Activity
from .data_organizer import DataOrganizer

class ActivitiyOrganizer(DataOrganizer):
    def __init__(self, id, value1, value2):
        # Busca a atividade no banco de dados
        try:
            if id is None:
                raise ValueError("id é obrigatório.")
            activity = Activity.objects.get(id=id)
        except Activity.DoesNotExist:
            raise ValueError(f"Activity with id '{id}' not found.")

        # Converte value1 e value2 para valores numéricos
        try:
            if value1 is None:
                raise ValueError("value1 é obrigatório.")
            value1 = float(value1)
            value2 = float(value2) if value2 is not None else 0
        except (TypeError, ValueError):
            raise ValueError("value1 e value2 devem ser valores numéricos.")

        # Divide unit em unit1 e unit2 se houver "/"
        if "/" in activity.unit:
            unit1, unit2 = activity.unit.split("/", 1)
            unit1 = unit1.strip()
            unit2 = unit2.strip()
        else:
            unit1 = activity.unit.strip()
            unit2 = None

        # Criar mapa de parâmetros baseado no unit_type possíveis
        params_map = {
            "Energy":      {"energy": value1, "energy_unit": unit1},
            "Volume":      {"volume": value1, "volume_unit": unit1},
            "Passenger Over Distance": {"passengers": int(value1), "distance": value2, "distance_unit": unit2},
            "Distance":    {"distance": value1, "distance_unit": unit1},
            "Weight Over Distance": {
                "weight": value1,
                "weight_unit": unit1,
                "distance": value2,
                "distance_unit": unit2
            },
            "Weight":      {"weight": value1, "weight_unit": unit1},
        }

        # Monta o payload
        if activity.unit_type not in params_map:
            raise ValueError(f"Unrecognized unit_type: '{activity.unit_type}' for activity id '{id}'")

        payload = {
            "emission_factor": {
                "activity_id": activity.activity_id,
                "source": activity.source,
                "region": activity.region,
                "data_version": "26"
            },
            "parameters": params_map[activity.unit_type]
        }

        print("Payload criado:", payload)

        super().__init__(payload)

    def process_data(self, data):
        return data