from fastapi import APIRouter, Request
from app.utils.app_utils import get_app

event_router = APIRouter(prefix="/event", tags=["event_router"])

@event_router.post("/create")
async def handle_create(request: Request):
    body = await request.json()
    app = get_app()
    
    await app.event_service.create_database_and_table(body['dbName'], body['tableName'])
    return {"success": True, "message": "Database and table ready"}

@event_router.post("/insert")
async def handle_insert(request: Request):
    body = await request.json()
    app = get_app()

    await app.event_service.insert_table(body['dbName'], body['tableName'], body['data'])
    return {"success": True, "message": "Data inserted"}

@event_router.put("/update")
async def handle_update(request: Request):
    body = await request.json()
    app = get_app()

    await app.event_service.update_table(body['dbName'], body['tableName'], body['data'])
    return {"success": True, "message": "Data updated"}

@event_router.delete("/delete")
async def handle_delete(request: Request):
    body = await request.json()
    app = get_app()

    await app.event_service.delete_table(body['dbName'], body['tableName'])
    return {"success": True, "message": "Table deleted"}
