from fastapi import Request, HTTPException, Response
from typing import Dict, Optional
import jwt
from jwt.exceptions import InvalidTokenError

async def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="auth_token",
        value=token,
        httponly=True,
        secure=True, 
        samesite="lax",
        max_age=3600  # 1 hour expiration
    )

def decode_token(token: str) -> Dict[str, Optional[str]]:
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return {"email": payload.get("email")}
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_user_from_token(request: Request) -> Dict[str, Optional[str]]:
    token = request.cookies.get("auth_token")
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    return decode_token(token)