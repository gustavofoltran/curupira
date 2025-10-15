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
        
        # Criar mapa de parâmetros baseado no unit_type possíveis
        unit = activity.unit
        params_map = {
            "Energy":      {"energy": value1, "energy_unit": unit},
            "Volume":      {"volume": value1, "volume_unit": unit},
            "Passenger Over Distance": {"passengers": value1, "distance": value2, "distance_unit": unit},
            "Distance":    {"distance": value1, "distance_unit": unit},
            "Weight Over Distance": {"weight": value1, "weight_unit": unit, "distance": value2, "distance_unit": unit},
            "Weight":      {"weight": value1, "weight_unit": unit},
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

        super().__init__(payload)

    def process_data(self, data):
        return data