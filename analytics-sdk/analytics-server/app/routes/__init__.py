from app.custom_fastapi import CustmFastAPI

from app.routes.event import event_router
from app.routes.api_url import api_url_router
from app.routes.user import user_router
from app.routes.package import package_router
from app.routes.analytics import analytics_router

def init_routes(app: CustmFastAPI):
    app.include_router(analytics_router)
    app.include_router(event_router)
    app.include_router(api_url_router)
    app.include_router(user_router)
    app.include_router(package_router)