from fastapi import Request
from src.errors.api_error import ApiError

async def validate_request(request: Request, required_fields: list):
    body = await request.json()
    missing_fields = [field for field in required_fields if field not in body]
    if missing_fields:
        raise ApiError(400, f"Missing fields: {', '.join(missing_fields)}")