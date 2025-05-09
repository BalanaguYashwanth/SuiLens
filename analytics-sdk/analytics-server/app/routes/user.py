from fastapi import APIRouter, Depends, Request, Response, HTTPException
from typing import Dict

from app.utils.app_utils import get_app
from app.middleware.auth_middleware import get_user_from_token, set_auth_cookie, decode_token 

user_router = APIRouter(prefix="/user", tags=["user_router"])

@user_router.post("/authenticate")
async def authenticate_user(request: Request, response: Response):
    body = await request.json()
    token = body.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token required")
    
    payload = decode_token(token)
    await set_auth_cookie(response, token)
    return {"success": True, "email": payload.get("email")}

@user_router.post("/create")
async def create_user(user_data: Dict = Depends(get_user_from_token)):
    app = get_app()

    email = user_data["email"]

    try:
        user = app.user_service.create_user(email)
        return {"success": True, "user": {"email": user.email}}
    except Exception as e:
        return {"success": False, "message": str(e)}