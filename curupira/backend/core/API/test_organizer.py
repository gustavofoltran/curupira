from .data_organizer import DataOrganizer

class ExampleDataOrganizer(DataOrganizer):
    def __init__(self):
        payload = {
            "emission_factor": {
                "activity_id": "fuel-type_natural_gas-fuel_use_stationary",
                "source": "EPA",
                "region": "US",
                "data_version": "26"
            },
            "parameters": {
                "energy": 56,
                "energy_unit": "MMBTU"
            }
        }
        super().__init__(payload)

    def process_data(self, data):
        # Retorna apenas co2e e co2e_unit
        return data