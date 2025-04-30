from fastapi import APIRouter, Request, Depends
from typing import Dict

from app.utils.app_utils import get_app
from app.middleware.auth_middleware import get_user_from_token 

user_router = APIRouter(prefix="/user", tags=["user_router"])

@user_router.post("/create")
async def create_user(request: Request, user_data: Dict = Depends(get_user_from_token)):
    app = get_app()

    email = user_data["email"]
    name = user_data["name"]

    try:
        user = app.user_service.create_user(email, name)
        return {"success": True, "user": {"email": user.email, "name": user.name}}
    except Exception as e:
        return {"success": False, "message": str(e)}