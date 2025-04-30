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
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)

    project = relationship("ProjectModel", back_populates="packages")