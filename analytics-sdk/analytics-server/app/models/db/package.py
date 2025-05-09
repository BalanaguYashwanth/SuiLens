from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.db.base import Base

class PackageModel(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    package_id = Column(String, nullable=False, unique=True)
    module_name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("UserModel", back_populates="packages")