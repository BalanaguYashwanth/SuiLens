from fastapi import APIRouter, Request

from app.utils.app_utils import get_app

package_router = APIRouter(prefix="/package", tags=["package_router"])

@package_router.post("/create")
async def create_package(request: Request):
    body = await request.json()
    app = get_app()

    project_id = body["projectId"]
    package_id = body["packageId"]
    module_name = body["moduleName"]

    try:
        package = app.package_service.create_package(project_id, package_id, module_name)
        return {
            "success": True,
            "package": {
                "id": package.package_id,
                "module": package.module_name
            }
        }
    except Exception as e:
        return {"success": False, "message": str(e)}

@package_router.get("/get/{project_id}")
async def get_packages_by_project(project_id: str):
    app = get_app()

    try:
        packages = app.package_service.get_packages_by_project(project_id)
        return {
            "success": True,
            "packages": [{
                "id": p.package_id,
                "module": p.module_name,
                "createdAt": p.created_at.isoformat()
            } for p in packages]
        }
    except Exception as e:
        return {"success": False, "message": str(e)}