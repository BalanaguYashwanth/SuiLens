from app.custom_fastapi import CustmFastAPI
from app.models.db.base import Base
from app.models.db.db_session import engine

def create_app() -> 'CustmFastAPI':
    from app.custom_fastapi import CustmFastAPI
    from app.routes import init_routes
    from app.services import init_services
    from app.dbhandlers import init_handlers
    
    app = CustmFastAPI()

    init_handlers(app)
    init_services(app)
    init_routes(app)

    @app.on_event("startup")
    async def on_startup():
        Base.metadata.create_all(bind=engine)

    return app