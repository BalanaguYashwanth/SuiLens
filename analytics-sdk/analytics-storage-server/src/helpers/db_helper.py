import sqlite3
import os
import time
from pathlib import Path
from src.errors.api_error import ApiError

def get_db_connection(db: str) -> sqlite3.Connection:
    try:
        base_dir = Path(__file__).resolve().parent.parent
        db_dir = base_dir / "db"

        db_dir.mkdir(exist_ok=True, parents=True)

        db_path = db_dir / f"{db}.sqlite"
        print(f"Attempting to connect to database at: {db_path}")
        print(f"Does path exist: {db_path.exists()}")
        print(f"Is parent directory writable: {os.access(db_dir, os.W_OK)}")

        if not db_path.exists():
            try:
                with open(db_path, 'w') as f:
                    pass
                print("Successfully created empty file")
            except Exception as e:
                print(f"Failed to create file: {e}")

        return sqlite3.connect(str(db_path))
    except Exception as e:
        print(f"Connection error details: {e}")
        raise

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
        print(f"Columns for insert: {columns}")
        placeholders = ", ".join(["?" for _ in columns])
        values = tuple(data["data"].values())

        insert_query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
        print(f"Insert Query: {insert_query}")
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
            print(f"Deleted record with id {data_id}")
        else:
            cursor.execute(f"DROP TABLE IF EXISTS {table_name}")
            print(f"Dropped table {table_name}")

        conn.commit()
        time.sleep(0.05) 

    except Exception as e:
        print("Delete error:", e)
        raise ApiError(500, "Delete failed")

    finally:
        if conn:
            conn.close()
            time.sleep(0.05) 
