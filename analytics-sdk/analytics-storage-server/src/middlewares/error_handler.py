from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from src.errors.api_error import ApiError

class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        try:
            response = await call_next(request)
            return response
        except ApiError as ae:
            return JSONResponse(
                status_code=ae.status_code,
                content={"success": False, "message": ae.message}
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"success": False, "message": "Internal Server Error"}
            )