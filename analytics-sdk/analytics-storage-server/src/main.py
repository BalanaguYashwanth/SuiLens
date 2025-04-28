from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.database_routes import router as database_router
from src.middlewares.error_handler import ErrorHandlerMiddleware

app = FastAPI()

app.add_middleware(ErrorHandlerMiddleware)

app.include_router(database_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)