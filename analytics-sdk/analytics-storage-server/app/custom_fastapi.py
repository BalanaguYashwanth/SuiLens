from fastapi import FastAPI

class CustmFastAPI(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        from app.services.event_service import EventService
        from app.dbhandlers.event_handler import EventHandler
        
        self.event_service = EventService()
        self.event_handler = EventHandler()