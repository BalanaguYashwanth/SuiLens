import os
import sqlite3
from src.errors.api_error import ApiError
from src.helpers.db_helper import check_and_create_table, insert_data, update_data, delete_data

DB_DIR = os.path.join(os.path.dirname(__file__), '..', 'db')

if not os.path.exists(DB_DIR):
    os.makedirs(DB_DIR)

def get_db(db_name):
    db_path = os.path.join(DB_DIR, f"{db_name}.sqlite")
    return sqlite3.connect(db_path)

async def create_database_and_table(db_name, table_name):
    db = get_db(db_name)
    try:
        await check_and_create_table(db_name, table_name)
    except Exception:
        raise ApiError(500, "Failed to create table")
    finally:
        db.close()

async def insert_data_service(db_name, table_name, data):
    db = get_db(db_name)
    try:
        await insert_data(db, table_name, data)
    except Exception:
        raise ApiError(500, "Insert failed")
    finally:
        db.close()

async def update_data_service(db_name, table_name, data):
    db = get_db(db_name)
    try:
        await update_data(db, table_name, data)
    except Exception:
        raise ApiError(500, "Update failed")
    finally:
        db.close()

async def delete_data_service(db_name, table_name, data_id):
    db = get_db(db_name)
    try:
        await delete_data(db, table_name, data_id)
    except Exception:
        raise ApiError(500, "Delete failed")
    finally:
        db.close()