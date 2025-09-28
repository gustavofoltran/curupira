import time
import requests

API_URL = "https://api.climatiq.io/data/v1/estimate"
API_KEY = "W6PWHWFVXS0C7725X0A35M7F8G"

class APIRequester:
    def __init__(self, api_url=API_URL, api_key=API_KEY):
        self.api_url = api_url
        self.api_key = api_key

    def fetch(self, payload: dict):
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        start_time = time.time()
        while True:
            try:
                response = requests.post(self.api_url, json=payload, headers=headers, timeout=2)
                response.raise_for_status()
                return response.json()
            except requests.RequestException:
                if time.time() - start_time > 2:
                    return {"error": "API request failed after retries."}
                time.sleep(0.5)