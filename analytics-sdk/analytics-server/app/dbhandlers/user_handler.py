from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.models.db.user import UserModel
from app.utils.api_error import ApiError
from app.config import DATABASE_URL

class UserHandler:
    def __init__(self):
        self.engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20, echo=True)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_db_connection(self) -> Session:
        return self.SessionLocal()

    def create_user(self, email: str, name: str):
        db_session = self.get_db_connection()
        try:
            new_user = UserModel(email=email, name=name)
            db_session.add(new_user)
            db_session.commit()
            return new_user
        except Exception as e:
            db_session.rollback()
            print(f"Error while creating user: {e}")
            raise ApiError(500, f"Failed to create user: {str(e)}") 
        finally:
            db_session.close()