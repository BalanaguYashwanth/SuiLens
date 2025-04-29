import sqlite3
from pathlib import Path

async def read_query(db: str,query: str) -> str:
    """Execute a SELECT query on the SQLite database and return results."""
    try:
        project_root = Path(__file__).resolve().parents[3]  # `/suilens/`
        db_dir = project_root / "db"
        db_dir.mkdir(exist_ok=True, parents=True)  # ensure db folder exists
        db_path = db_dir / f"{db}.sqlite"
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        results = conn.execute(query).fetchall()

        if not results:
            return "No results found."

        output = []
        for row in results:
            output.append(", ".join(f"{k}: {row[k]}" for k in row.keys()))

        return output

    except Exception as e:
        return f"Error executing query: {str(e)}"

def get_db_schema(name) -> list:
    # Define the db directory
    project_root = Path(__file__).resolve().parents[3]  # `/suilens/`
    db_dir = project_root / "db"
    db_dir.mkdir(exist_ok=True, parents=True)  # ensure db folder exists
    db_path = db_dir / f"{name}.sqlite"

    # Connect using full path
    conn = sqlite3.connect(str(db_path))
    rows = conn.execute("SELECT name, sql FROM sqlite_master WHERE type='table'").fetchall()
    return [{"name": row[0], "schema": row[1]} for row in rows if row[1]]
