import pytest
from pytest_bdd import given, when, then, scenario
from rest_framework.test import APIClient
from django.urls import reverse
from unittest.mock import patch


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def contexto():
    return {}


@pytest.mark.django_db
@scenario('../features/calculate-emission.feature', 'User request correctly an emission value')
def test_user_request_emission_calculation():
    pass


@given("user accessed the service")
def user_accessed_service(client, contexto):
    contexto["client"] = client
    return contexto


@when("he fills the activity name and interval")
def fills_activity_data(contexto):
    contexto["payload"] = {
        "activityId": "electricity-energy_source_grid_mix",
        "duration": 60,
    }
    return contexto


@then("he should receive the emission")
def should_receive_emission(contexto):
    with patch("activities.views.APIRequester.fetch") as mock_fetch:
        mock_fetch.return_value = {
            "co2e": 1.23,
            "co2e_unit": "kg",
        }

        client = contexto["client"]
        payload = contexto["payload"]

        url = reverse("calculate-emission")
        response = client.post(url, payload, format="json")

        assert response.status_code == 200
        data = response.json()

        assert "value" in data
        assert "unit" in data
        assert data["value"] == 1.23
        assert data["unit"] == "kg"
