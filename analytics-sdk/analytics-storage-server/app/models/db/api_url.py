from sqlalchemy import Column, Integer, Text, DateTime
from sqlalchemy.sql import func
from app.models.db.base import Base

class ApiUrlModel(Base):
    __tablename__ = "api_urls"

    id = Column(Integer, primary_key=True, autoincrement=True)
    api_url = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())