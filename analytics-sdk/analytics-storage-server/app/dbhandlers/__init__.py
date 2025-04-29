from app.custom_fastapi import CustmFastAPI

from app.dbhandlers.event_handler import EventHandler 
from app.dbhandlers.api_url_handler import ApiUrlHandler
from app.dbhandlers.user_handler import UserHandler
from app.dbhandlers.project_handler import ProjectHandler


def init_handlers(app: 'CustmFastAPI'):
    """Initialize handlers in the app state."""
    app.event_handler = EventHandler()
    app.api_url_handler = ApiUrlHandler()
    app.user_handler = UserHandler()
    app.project_handler = ProjectHandler()
  