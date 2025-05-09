from app.custom_fastapi import CustmFastAPI

from app.dbhandlers.event_handler import EventHandler 
from app.dbhandlers.api_url_handler import ApiUrlHandler
from app.dbhandlers.user_handler import UserHandler
from app.dbhandlers.package_handler import PackageHandler

def init_handlers(app: 'CustmFastAPI'):
    """Initialize handlers in the app state."""
    app.event_handler = EventHandler()
    app.api_url_handler = ApiUrlHandler()
    app.user_handler = UserHandler()
    app.package_handler = PackageHandler()