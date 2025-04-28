from app.custom_fastapi import CustmFastAPI

def init_services(app: CustmFastAPI):
    """Initialize services in the app state."""
    from app.services.database_service import DatabaseService
 
    app.database_service = DatabaseService()