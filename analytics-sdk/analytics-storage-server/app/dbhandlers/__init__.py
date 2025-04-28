from app.custom_fastapi import CustmFastAPI

from app.dbhandlers.event_handler import EventHandler 

def init_handlers(app: 'CustmFastAPI'):
    """Initialize handlers in the app state."""
    app.event_handler = EventHandler()
  