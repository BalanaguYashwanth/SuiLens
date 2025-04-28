from app.custom_fastapi import CustmFastAPI

def init_services(app: CustmFastAPI):
    """Initialize services in the app state."""
    from app.services.event_service import EventService
 
    app.event_service = EventService()