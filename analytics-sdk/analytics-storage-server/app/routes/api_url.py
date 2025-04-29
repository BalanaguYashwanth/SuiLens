from fastapi import APIRouter

from app.utils.app_utils import get_app
from app.utils.api_error import ApiError

api_url_router = APIRouter(prefix="/api-url", tags=["api_url_router"])

@api_url_router.get("/get")
async def get_api_url():
    app = get_app()

    try:
        api_url = await app.api_url_service.get_api_url()
        return {"success": True, "api_url": api_url}
    except ApiError as e:
        return {"success": False, "message": str(e)}