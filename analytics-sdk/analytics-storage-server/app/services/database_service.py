from app.dbhandlers.database_handler import DatabaseHandler

class DatabaseService:
    def __init__(self):
        self.db_handler = DatabaseHandler()

    async def create_database_and_table(self, db_name: str, table_name: str):
        await self.db_handler.check_and_create_table(db_name, table_name)

    async def insert_table(self, db_name: str, table_name: str, data: dict):
        await self.db_handler.insert_data(db_name, table_name, data)

    async def update_table(self, db_name: str, table_name: str, data: dict):
        await self.db_handler.update_data(db_name, table_name, data)

    async def delete_table(self, db_name: str, table_name: str, data: dict):
        await self.db_handler.delete_data(db_name, table_name, data)