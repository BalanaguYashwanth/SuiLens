from sqlalchemy.orm import Session

from app.models.db.db_session import SessionLocal
from app.models.db.api_url import ApiUrlModel
from app.utils.api_error import ApiError

class ApiUrlHandler:
    def get_db_connection(self) -> Session:
        return SessionLocal()

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
