import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.models.db.project import ProjectModel
from app.models.db.user import UserModel
from app.utils.api_error import ApiError
from app.config import DATABASE_URL

class ProjectHandler:
    def __init__(self):
        self.engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20, echo=True)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_db_connection(self) -> Session:
        return self.SessionLocal()

    def create_project(self, email: str, project_name: str, project_description: str):
        db_session = self.get_db_connection()
        try:
            user = db_session.query(UserModel).filter(UserModel.email == email).first()
            if not user:
                raise ApiError(404, "User not found")

            project_id = f"{project_name.lower().replace(' ', '')}-{uuid.uuid4().hex[:6]}"

            new_project = ProjectModel(
                user_id=user.id,
                project_name=project_name,
                project_description=project_description,
                project_id=project_id
            )
            db_session.add(new_project)
            db_session.commit()
            db_session.refresh(new_project)
            return new_project
        except Exception as e:
            db_session.rollback()
            raise ApiError(500, "Failed to create project")
        finally:
            db_session.close()

    def get_projects_by_user(self, email: str):
        db_session = self.get_db_connection()
        try:
            user = db_session.query(UserModel).filter(UserModel.email == email).first()
            if not user:
                raise ApiError(404, "User not found")
            
            projects = db_session.query(ProjectModel).filter(ProjectModel.user_id == user.id).all()
            if not projects:
                raise ApiError(404, "No projects found for this user")
            return projects
        finally:
            db_session.close()