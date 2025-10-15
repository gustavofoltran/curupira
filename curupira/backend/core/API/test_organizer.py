from .data_organizer import DataOrganizer

class ExampleDataOrganizer(DataOrganizer):
    def __init__(self):
        payload = {
            "emission_factor": {
                "activity_id": "chemicals-type_fertilisers_containing_npk",
                "source": "CBAM",
                "region": "EG",
                "data_version": "26"
            },
            "parameters": {
                "weight": 698.0,
                "weight_unit": "kg"
            }
        }
        super().__init__(payload)

    def process_data(self, data):
        # Retorna apenas co2e e co2e_unit
        return data