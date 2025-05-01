from fastapi import APIRouter
from typing import Dict

from app.utils.app_utils import get_app
from app.middleware.auth_middleware import get_user_from_token 

analytics_router = APIRouter(prefix="/analytics", tags=["analytics_router"])

@analytics_router.get("")
async def fetch_analytics(package_address: str, batch_size: str = 10):
    app = get_app()
    try:
        response = await app.analytics_service.get_analytics(package_address, batch_size)
        return {"success": True, "analytics": response}
    except Exception as e:
        return {"success": False, "message": str(e)}