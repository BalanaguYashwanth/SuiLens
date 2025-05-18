from sqlalchemy.orm import Session

from app.models.db.db_session import SessionLocal
from app.models.db.package import PackageModel
from app.models.db.user import UserModel
from app.utils.api_error import ApiError

class PackageHandler:
    def get_db_connection(self) -> Session:
        return SessionLocal()

    def create_package(self, email: str, package_id: str, module_name: str):
        db_session = self.get_db_connection()
        try:
            user = db_session.query(UserModel).filter(UserModel.email == email).first()
            if not user:
                raise ApiError(404, "User not found")

            new_package = PackageModel(
                package_id=package_id,
                module_name=module_name,
                user_id=user.id,
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

    def get_packages_by_user(self, email: str):
        db_session = self.get_db_connection()
        try:
            user = db_session.query(UserModel).filter(UserModel.email == email).first()
            if not user:
                raise ApiError(404, "User not found")
            
            packages = db_session.query(PackageModel).filter(PackageModel.user_id == user.id).all()
            if not packages:
                raise ApiError(404, "No packages found for this user")
            return packages
        except Exception as e:
            raise ApiError(500, f"Failed to get packages: {str(e)}")
        finally:
            db_session.close()