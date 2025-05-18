from fastapi import APIRouter, Request, Depends
from typing import Dict
from app.middleware.auth_middleware import get_user_from_token

from app.utils.app_utils import get_app

package_router = APIRouter(prefix="/package", tags=["package_router"])

@package_router.post("/create")
async def create_package(request: Request, user_data: Dict = Depends(get_user_from_token)):
    body = await request.json()
    app = get_app()

    email = user_data["email"]
    package_id = body["packageAddress"]
    module_name = body["packageName"]

    try:
        package = app.package_service.create_package(email, package_id, module_name)
        return {
            "success": True,
            "package": {
                "id": package.package_id,
                "module": package.module_name
            }
        }
    except Exception as e:
        return {"success": False, "message": str(e)}

@package_router.get("/get")
async def get_packages_by_user(user_data: Dict = Depends(get_user_from_token)):
    app = get_app()
    email = user_data["email"]

    try:
        packages = app.package_service.get_packages_by_user(email)
        return {
            "success": True,
            "packages": [{
                "package_address": p.package_id,
                "package_name": p.module_name
            } for p in packages]
        }
    except Exception as e:
        return {"success": False, "message": str(e)}