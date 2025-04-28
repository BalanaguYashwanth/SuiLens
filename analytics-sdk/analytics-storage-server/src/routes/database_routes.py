from fastapi import APIRouter, Request
from src.controllers import database_controller
from src.middlewares.validate_request import validate_request

router = APIRouter(prefix="/api")

@router.post("/create")
async def create(request: Request):
    await validate_request(request, ['dbName', 'tableName'])
    return await database_controller.handle_create(request)

@router.post("/insert")
async def insert(request: Request):
    await validate_request(request, ['dbName', 'tableName', 'data'])
    return await database_controller.handle_insert(request)

@router.put("/update")
async def update(request: Request):
    await validate_request(request, ['dbName', 'tableName', 'data'])
    return await database_controller.handle_update(request)

@router.delete("/delete")
async def delete(request: Request):
    await validate_request(request, ['dbName', 'tableName'])
    return await database_controller.handle_delete(request)