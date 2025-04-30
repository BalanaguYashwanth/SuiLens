from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.models.db.package import PackageModel
from app.models.db.project import ProjectModel
from app.utils.api_error import ApiError
from app.config import DATABASE_URL

class PackageHandler:
    def __init__(self):
        self.engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20, echo=True)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_db_connection(self) -> Session:
        return self.SessionLocal()

    def create_package(self, project_id: str, package_id: str, module_name: str):
        db_session = self.get_db_connection()
        try:
            project = db_session.query(ProjectModel).filter(ProjectModel.project_id == project_id).first()
            if not project:
                raise ApiError(404, "Project not found")

            new_package = PackageModel(
                package_id=package_id,
                module_name=module_name,
                project_id=project.id
            )
            db_session.add(new_package)
            db_session.commit()
            db_session.refresh(new_package)
            return new_package
        except Exception as e:
            db_session.rollback()
            raise ApiError(500, f"Failed to create package: {str(e)}")
        finally:
            db_session.close()

    def get_packages_by_project(self, project_id: str):
        db_session = self.get_db_connection()
        try:
            project = db_session.query(ProjectModel).filter(ProjectModel.project_id == project_id).first()
            if not project:
                raise ApiError(404, "Project not found")
            
            packages = db_session.query(PackageModel).filter(PackageModel.project_id == project.id).all()
            if not packages:
                raise ApiError(404, "No packages found for this project")
            return packages
        except Exception as e:
            raise ApiError(500, f"Failed to get packages: {str(e)}")
        finally:
            db_session.close()