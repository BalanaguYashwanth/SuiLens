from fastapi import Request
from src.services.database_service import create_database_and_table, insert_data, update_data, delete_data

async def handle_create(request: Request):
    body = await request.json()
    await create_database_and_table(body['dbName'], body['tableName'])
    return {"success": True, "message": "Database and table ready"}

async def handle_insert(request: Request):
    body = await request.json()
    await insert_data(body['dbName'], body['tableName'], body['data'])
    return {"success": True, "message": "Data inserted"}

async def handle_update(request: Request):
    body = await request.json()
    await update_data(body['dbName'], body['tableName'], body['data'])
    return {"success": True, "message": "Data updated"}

async def handle_delete(request: Request):
    body = await request.json()
    await delete_data(body['dbName'], body['tableName'])
    return {"success": True, "message": "Table deleted"}