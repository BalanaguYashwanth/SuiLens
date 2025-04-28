from app.custom_fastapi import CustmFastAPI

from app.routes.database import database_router

def init_routes(app: CustmFastAPI):
    app.include_router(database_router)