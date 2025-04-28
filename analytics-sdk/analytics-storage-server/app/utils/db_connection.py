import sqlite3
import os
from pathlib import Path

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