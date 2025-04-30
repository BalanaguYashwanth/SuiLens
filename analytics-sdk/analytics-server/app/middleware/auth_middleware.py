from fastapi import Request, HTTPException
import jwt
from jwt.exceptions import InvalidTokenError
from typing import Dict

async def get_user_from_token(request: Request) -> Dict[str, str]:
    token = request.cookies.get("auth_token")
    
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return {
            "email": payload.get("email"),
            "name": payload.get("name")
        }
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")