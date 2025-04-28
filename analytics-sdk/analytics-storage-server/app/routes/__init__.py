from app.custom_fastapi import CustmFastAPI

from app.routes.event import event_router
from app.routes.api_url import api_url_router

def init_routes(app: CustmFastAPI):
    app.include_router(event_router)
    app.include_router(api_url_router)