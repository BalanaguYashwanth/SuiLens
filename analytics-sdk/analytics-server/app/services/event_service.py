from typing import List, Dict, Any
from app.dbhandlers.event_handler import EventHandler

class EventService:
    def __init__(self):
        self.event_handler = EventHandler()

    async def create_table(self, db_name: str, table_name: str):
        await self.event_handler.check_and_create_table(db_name, table_name)

    async def insert_table(self, db_name: str, table_name: str, data: dict):
        await self.event_handler.insert_data(db_name, table_name, data)

    async def update_table(self, db_name: str, table_name: str, data: dict):
        await self.event_handler.update_data(db_name, table_name, data)

    async def delete_table(self, db_name: str, table_name: str, data: dict):
        await self.event_handler.delete_data(db_name, table_name, data)

    async def get_database_schema(self, db_name: str) -> List[Dict[str, Any]]:
        return await self.event_handler.get_database_schema(db_name)