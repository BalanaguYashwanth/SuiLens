from app.custom_fastapi import CustmFastAPI

def init_services(app: CustmFastAPI):
    """Initialize services in the app state."""
    from app.services.event_service import EventService
    from app.services.api_url_service import ApiUrlService
    from app.services.user_service import UserService
    from app.services.package_service import PackageService
 
    app.event_service = EventService()
    app.api_url_service = ApiUrlService()
    app.user_service = UserService()
    app.package_service = PackageService()