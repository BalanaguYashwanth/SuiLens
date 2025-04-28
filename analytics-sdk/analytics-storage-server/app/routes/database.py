from fastapi import APIRouter, Request
from app.utils.app_utils import get_app

database_router = APIRouter(prefix="/database", tags=["database"])

@database_router.post("/create")
async def handle_create(request: Request):
    body = await request.json()
    app = get_app()
    
    await app.db_service.create_database_and_table(body['dbName'], body['tableName'])
    return {"success": True, "message": "Database and table ready"}

@database_router.post("/insert")
async def handle_insert(request: Request):
    body = await request.json()
    app = get_app()

    await app.db_service.insert_data(body['dbName'], body['tableName'], body['data'])
    return {"success": True, "message": "Data inserted"}

@database_router.put("/update")
async def handle_update(request: Request):
    body = await request.json()
    app = get_app()

    await app.db_service.update_data(body['dbName'], body['tableName'], body['data'])
    return {"success": True, "message": "Data updated"}

@database_router.delete("/delete")
async def handle_delete(request: Request):
    body = await request.json()
    app = get_app()

    await app.db_service.delete_data(body['dbName'], body['tableName'])
    return {"success": True, "message": "Table deleted"}
