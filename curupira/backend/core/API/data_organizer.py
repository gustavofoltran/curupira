from abc import ABC, abstractmethod
from .api_requester import APIRequester

class DataOrganizer(ABC):
    def __init__(self, payload: dict = None):
        self.payload = payload or {}

    def get_data(self):
        requester = APIRequester()
        data = requester.fetch(self.payload)
        return self.process_data(data)

    @abstractmethod
    def process_data(self, data):
        pass