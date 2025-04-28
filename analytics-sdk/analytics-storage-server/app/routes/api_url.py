from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session

from app.utils.db_connection import get_db_connection
from app.services.api_url_service import ApiUrlService
from app.utils.api_error import ApiError

api_url_router = APIRouter(prefix="/api-url", tags=["api_url_router"])

@api_url_router.get("/get")
async def get_api_url(request: Request, db: Session = Depends(get_db_connection)):
    app = request.app
    api_url_service = ApiUrlService()

    try:
        api_url = await api_url_service.get_api_url(db)
        return {"success": True, "api_url": api_url}
    except ApiError as e:
        return {"success": False, "message": str(e)}