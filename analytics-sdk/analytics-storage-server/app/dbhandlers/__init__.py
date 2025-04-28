from app.custom_fastapi import CustmFastAPI

from app.dbhandlers.database_handler import DatabaseHandler

def init_handlers(app: 'CustmFastAPI'):
    """Initialize handlers in the app state."""
    app.database_handler = DatabaseHandler()
  