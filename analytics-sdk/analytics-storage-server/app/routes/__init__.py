from app.custom_fastapi import CustmFastAPI

from app.routes.event import event_router

def init_routes(app: CustmFastAPI):
    app.include_router(event_router)