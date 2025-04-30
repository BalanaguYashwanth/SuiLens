from app.dbhandlers.project_handler import ProjectHandler

class ProjectService:
    def __init__(self):
        self.project_handler = ProjectHandler()

    def create_project(self, email: str, project_name: str, project_description: str):
        return self.project_handler.create_project(email, project_name, project_description)

    def get_projects_by_user(self, email: str):
        return self.project_handler.get_projects_by_user(email)