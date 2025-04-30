from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.models.db.api_url import ApiUrlModel
from app.utils.api_error import ApiError
from app.config import DATABASE_URL

class ApiUrlHandler:
    def __init__(self):
        self.engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20, echo=True)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_db_connection(self) -> Session:
        return self.SessionLocal()

    async def get_api_url(self):
        db_session = self.get_db_connection()

        try:
            api_url_entry = db_session.query(ApiUrlModel).first()
            if not api_url_entry:
                raise ApiError(404, "API URL not found in database")

            return api_url_entry.api_url

        except Exception as e:
            print("Get API URL error:", e)
            raise ApiError(500, "Failed to fetch API URL")
        finally:
            db_session.close()
