import mcp.types as types

async def sql_tools() -> list[types.Tool]:
    """List available tools"""
    return [
        types.Tool(
            name="read_query",
            description="Execute a SELECT query on the SQLite database",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "SELECT SQL query to execute"},
                },
                "required": ["query"],
            },
        ),
        types.Tool(
            name="write_query",
            description="Execute an INSERT, UPDATE, or DELETE query on the SQLite database",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "SQL query to execute"},
                },
                "required": ["query"],
            },
        ),
        types.Tool(
            name="create_table",
            description="Create a new table in the SQLite database",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "CREATE TABLE SQL statement"},
                },
                "required": ["query"],
            },
        ),
        types.Tool(
            name="list_tables",
            description="List all tables in the SQLite database",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        types.Tool(
            name="describe_table",
            description="Get the schema information for a specific table",
            inputSchema={
                "type": "object",
                "properties": {
                    "table_name": {"type": "string", "description": "Name of the table to describe"},
                },
                "required": ["table_name"],
            },
        ),
        types.Tool(
            name="append_insight",
            description="Add a business insight to the memo",
            inputSchema={
                "type": "object",
                "properties": {
                    "insight": {"type": "string", "description": "Business insight discovered from data analysis"},
                },
                "required": ["insight"],
            },
        ),
    ]
