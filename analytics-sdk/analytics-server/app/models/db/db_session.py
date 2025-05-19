from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)