from fastapi import APIRouter, Request, Depends
from typing import Dict
from app.middleware.auth_middleware import get_user_from_token

from app.utils.app_utils import get_app

project_router = APIRouter(prefix="/project", tags=["project_router"])

@project_router.post("/create")
async def create_project(request: Request,  user_data: Dict = Depends(get_user_from_token)):
    body = await request.json()
    app = get_app()

    email = user_data["email"]
    project_name = body["projectName"]
    project_description = body["projectDescription"]

    try:
        project = app.project_service.create_project(email, project_name, project_description)
        return {"success": True, "project_id": project.project_id}
    except Exception as e:
        return {"success": False, "message": str(e)}

@project_router.get("/get")
async def get_projects_by_user(user_data: Dict = Depends(get_user_from_token)):
    app = get_app()
    email = user_data["email"]

    try:
        projects = app.project_service.get_projects_by_user(email)
        return {"success": True, "projects": [{"name": project.project_name, "description": project.project_description, "id": project.project_id} for project in projects]}
    except Exception as e:
        return {"success": False, "message": str(e)}