from sqlalchemy.orm import Session

from app.models.db.db_session import SessionLocal
from app.models.db.user import UserModel
from app.utils.api_error import ApiError

class UserHandler:
    def get_db_connection(self) -> Session:
        return SessionLocal()

    def create_user(self, email: str):
        db_session = self.get_db_connection()
        try:
            new_user = UserModel(email=email)
            db_session.add(new_user)
            db_session.commit()
            return new_user
        except Exception as e:
            db_session.rollback()
            print(f"Error while creating user: {e}")
            raise ApiError(500, f"Failed to create user: {str(e)}") 
        finally:
            db_session.close()