from fastapi import APIRouter, Request

from app.utils.app_utils import get_app

user_router = APIRouter(prefix="/user", tags=["user_router"])

@user_router.post("/create")
async def create_user(request: Request):
    body = await request.json()
    app = get_app()

    email = body["email"]
    name = body["name"]

    try:
        user = app.user_service.create_user(email, name)
        return {"success": True, "user": {"email": user.email, "name": user.name}}
    except Exception as e:
        return {"success": False, "message": str(e)}