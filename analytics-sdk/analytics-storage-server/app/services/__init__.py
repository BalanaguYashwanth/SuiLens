from app.custom_fastapi import CustmFastAPI

def init_services(app: CustmFastAPI):
    """Initialize services in the app state."""
    from app.services.event_service import EventService
    from app.services.api_url_service import ApiUrlService
 
    app.event_service = EventService()
    app.api_url_service = ApiUrlService()