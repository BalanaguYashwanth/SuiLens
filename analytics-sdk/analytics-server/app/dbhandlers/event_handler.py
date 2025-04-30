from typing import List, Dict, Any
from app.utils.db_connection import get_db_connection
from app.utils.api_error import ApiError

class EventHandler:
    def __init__(self):
        pass

    async def check_and_create_table(self, db: str, table_name: str):
        try:
            with get_db_connection(db) as conn:
                cursor = conn.cursor()

                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
                row = cursor.fetchone()

                if not row:
                    create_table_query = f"CREATE TABLE {table_name} (primary_id INTEGER PRIMARY KEY AUTOINCREMENT)"
                    cursor.execute(create_table_query)

                conn.commit()

        except Exception as e:
            print("Check and create table error:", e)
            raise ApiError(500, "Table creation failed")

    async def insert_data(self, db: str, table_name: str, data: dict):
        try:
            with get_db_connection(db) as conn:
                cursor = conn.cursor()

                [first_row] = data.get('data', []) or [{}]

                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
                row = cursor.fetchone()

                if not row:
                    columns = ", ".join([f"{key} TEXT" for key in first_row.keys()])
                    create_table_query = f"CREATE TABLE {table_name} (primary_id INTEGER PRIMARY KEY AUTOINCREMENT, {columns})"
                    cursor.execute(create_table_query)
                else:
                    cursor.execute(f"PRAGMA table_info({table_name})")
                    existing_columns_info = cursor.fetchall()
                    existing_columns = [col[1] for col in existing_columns_info] 

                    for key in first_row.keys():
                        if key not in existing_columns:
                            alter_query = f"ALTER TABLE {table_name} ADD COLUMN {key} TEXT"
                            cursor.execute(alter_query)

                for record in data["data"]:
                    columns = record.keys()
                    placeholders = ", ".join(["?" for _ in columns])
                    values = tuple(record.values())

                    insert_query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
                    cursor.execute(insert_query, values)

                conn.commit()

        except Exception as e:
            print("Insert error:", e)
            raise ApiError(500, "Insert failed")


    async def update_data(self, db: str, table_name: str, data: dict):
        try:
            if not data or len(data) < 2:
                raise ApiError(400, "At least one match field and one field to update are required")
            
            with get_db_connection(db) as conn:
                cursor = conn.cursor()

                items = list(data.items())
                condition_key, condition_value = items[0]
                update_fields = dict(items[1:])

                set_clause = ", ".join([f"{key} = ?" for key in update_fields])
                values = list(update_fields.values())
                values.append(condition_value)

                update_query = f"UPDATE {table_name} SET {set_clause} WHERE {condition_key} = ?"
                cursor.execute(update_query, values)

                if cursor.rowcount == 0:
                    raise ApiError(404, "Record not found")

                conn.commit()

        except ApiError:
            raise

        except Exception as e:
            print("Update error:", e)
            raise ApiError(500, "Update failed")

    async def delete_data(self, db: str, table_name: str, data: dict = None):
        try:
            with get_db_connection(db) as conn:
                cursor = conn.cursor()

                if data:
                    where_clause = " AND ".join([f"{key} = ?" for key in data])
                    values = list(data.values())
                    cursor.execute(f"DELETE FROM {table_name} WHERE {where_clause}", values)

                    if cursor.rowcount == 0:
                        raise ApiError(404, "No matching record found to delete")
                else:
                    cursor.execute(f"DROP TABLE IF EXISTS {table_name}")

                conn.commit()

        except Exception as e:
            print("Delete error:", e)
            raise ApiError(500, "Delete failed")
        

    async def get_database_schema(self, db: str) -> List[Dict[str, Any]]:
        try:
            with get_db_connection(db) as conn:
                cursor = conn.cursor()
                
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
                tables = cursor.fetchall()
                
                schema = []
                
                for table in tables:
                    table_name = table[0]
                    if table_name == "sqlite_sequence":
                        continue 
                        
                    cursor.execute(f"PRAGMA table_info({table_name})")
                    columns_info = cursor.fetchall()
                    
                    columns = []
                    for col in columns_info:
                        columns.append({
                            "name": col[1],  
                            "type": col[2],   
                            "nullable": not col[3],  
                            "primaryKey": col[5] == 1 
                        })
                    
                    schema.append({
                        "name": table_name,
                        "columns": columns
                    })
                
                return schema
                
        except Exception as e:
            print("Schema retrieval error:", e)
            raise ApiError(500, "Failed to retrieve database schema")