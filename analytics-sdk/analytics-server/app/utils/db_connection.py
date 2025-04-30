import sqlite3
from typing import Generator
from pathlib import Path
from contextlib import contextmanager 

@contextmanager
def get_db_connection(db: str) -> Generator[sqlite3.Connection, None, None]:
    conn = None
    try:
        db_dir = (Path(__file__).resolve().parents[3].parent / "db")
        db_dir.mkdir(exist_ok=True, parents=True)

        db_path = db_dir / f"{db}.sqlite"
        
        if not db_path.exists():
            try:
                with open(db_path, 'w') as f:
                    pass
                print("Successfully created empty file")
            except Exception as e:
                print(f"Failed to create file: {e}")

        conn = sqlite3.connect(str(db_path))
        yield conn
    except Exception as e:
        print(f"Connection error details: {e}")
        raise
    finally:
        if conn:
            conn.close()