from fastapi import FastAPI

class CustmFastAPI(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        from app.services.database_service import DatabaseService
        from app.dbhandlers.database_handler import DatabaseHandler
        
        self.database_service = DatabaseService()
        self.database_handler = DatabaseHandler()