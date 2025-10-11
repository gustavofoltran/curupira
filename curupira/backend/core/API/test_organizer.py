from .data_organizer import DataOrganizer

class ExampleDataOrganizer(DataOrganizer):
    def __init__(self):
        payload = {
            "emission_factor": {
                "activity_id": "electricity-supply_grid-source_residual_mix",
                "data_version": "^21"
            },
            "parameters": {
                "energy": 4200,
                "energy_unit": "kWh"
            }
        }
        super().__init__(payload)

    def process_data(self, data):
        # Retorna apenas co2e e co2e_unit
        return {
            "co2e": data.get("co2e"),
            "co2e_unit": data.get("co2e_unit")
        }