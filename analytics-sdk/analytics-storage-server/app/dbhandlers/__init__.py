from app.custom_fastapi import CustmFastAPI

from app.dbhandlers.event_handler import EventHandler 
from app.dbhandlers.api_url_handler import ApiUrlHandler

def init_handlers(app: 'CustmFastAPI'):
    """Initialize handlers in the app state."""
    app.event_handler = EventHandler()
    app.api_url_handler = ApiUrlHandler()
  