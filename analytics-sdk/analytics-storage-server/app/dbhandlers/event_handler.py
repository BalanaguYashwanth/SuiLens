import time

from app.utils.db_connection import get_db_connection
from app.utils.api_error import ApiError

class EventHandler:
    def __init__(self):
        pass

    async def check_and_create_table(db: str, table_name: str):
        conn = None
        try:
            conn = get_db_connection(db)
            cursor = conn.cursor()

            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
            row = cursor.fetchone()

            if not row:
                create_table_query = f"CREATE TABLE {table_name} (id INTEGER PRIMARY KEY)"
                cursor.execute(create_table_query)

            conn.commit()
            time.sleep(0.05)

        except Exception as e:
            print("Check and create table error:", e)
            raise ApiError(500, "Table creation failed")

        finally:
            if conn:
                conn.close()
                time.sleep(0.05)

    async def insert_data(db: str, table_name: str, data: dict):
        conn = None
        try:
            conn = get_db_connection(db)
            cursor = conn.cursor()

            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table_name,))
            row = cursor.fetchone()

            if not row:
                columns = ", ".join([f"{key} TEXT" for key in data["data"].keys()])
                create_table_query = f"CREATE TABLE {table_name} ({columns})"
                cursor.execute(create_table_query)
            else:
                cursor.execute(f"PRAGMA table_info({table_name})")
                existing_columns_info = cursor.fetchall()
                existing_columns = [col[1] for col in existing_columns_info] 

                for key in data["data"].keys():
                    if key not in existing_columns:
                        alter_query = f"ALTER TABLE {table_name} ADD COLUMN {key} TEXT"
                        cursor.execute(alter_query)

            columns = data["data"].keys()
            placeholders = ", ".join(["?" for _ in columns])
            values = tuple(data["data"].values())

            insert_query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
            cursor.execute(insert_query, values)

            conn.commit()
            time.sleep(0.05) 

        except Exception as e:
            print("Insert error:", e)
            raise ApiError(500, "Insert failed")

        finally:
            if conn:
                conn.close()
                time.sleep(0.05)


    async def update_data(db: str, table_name: str, data: dict):
        conn = None
        try:
            conn = get_db_connection(db)
            cursor = conn.cursor()

            if 'id' not in data:
                raise ApiError(400, "ID is required for update")

            id_value = data['id']

            update_columns = {k: v for k, v in data.items() if k != 'id'}

            if not update_columns:
                raise ApiError(400, "No fields to update")

            set_clause = ", ".join([f"{key} = ?" for key in update_columns.keys()])
            values = list(update_columns.values())
            values.append(id_value) 

            update_query = f"UPDATE {table_name} SET {set_clause} WHERE id = ?"
            cursor.execute(update_query, values)

            if cursor.rowcount == 0:
                raise ApiError(404, "Record not found")

            conn.commit()
            time.sleep(0.05) 

        except ApiError:
            raise

        except Exception as e:
            print("Update error:", e)
            raise ApiError(500, "Update failed")

        finally:
            if conn:
                conn.close()
                time.sleep(0.05) 

    async def delete_data(db: str, table_name: str, data_id: str = None):
        conn = None
        try:
            conn = get_db_connection(db)
            cursor = conn.cursor()

            if data_id:
                cursor.execute(f"DELETE FROM {table_name} WHERE id = ?", (data_id,))
                if cursor.rowcount == 0:
                    raise ApiError(404, "Record not found")
            else:
                cursor.execute(f"DROP TABLE IF EXISTS {table_name}")

            conn.commit()
            time.sleep(0.05) 

        except Exception as e:
            print("Delete error:", e)
            raise ApiError(500, "Delete failed")

        finally:
            if conn:
                conn.close()
                time.sleep(0.05) 