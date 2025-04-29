import sqlite3
from pathlib import Path

def get_db_connection(db: str) -> sqlite3.Connection:
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

        return sqlite3.connect(str(db_path))
    except Exception as e:
        print(f"Connection error details: {e}")
        raise