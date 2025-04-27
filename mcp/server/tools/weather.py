import httpx
import sqlite3
import mcp.types as types
from mcp.server.fastmcp import FastMCP
from typing import Any

# mcp_server = FastMCP("Weather")
# Constants
NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = "weather-app/1.0"

async def make_nws_request(url: str) -> dict[str, Any] | None:
    """Make a request to the NWS API with proper error handling."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None



def format_alert(feature: dict) -> str:
    """Format an alert feature into a readable string."""
    props = feature["properties"]
    return f"""
Event: {props.get('event', 'Unknown')}
Area: {props.get('areaDesc', 'Unknown')}
Severity: {props.get('severity', 'Unknown')}
Description: {props.get('description', 'No description available')}
Instructions: {props.get('instruction', 'No specific instructions provided')}
"""

async def get_alerts(state: str) -> str:
    """Get weather alerts for a US state.

    Args:
        state: Two-letter US state code (e.g. CA, NY)
    """
    url = f"{NWS_API_BASE}/alerts/active/area/{state}"
    data = await make_nws_request(url)

    if not data or "features" not in data:
        return "Unable to fetch alerts or no alerts found."

    if not data["features"]:
        return "No active alerts for this state."

    alerts = [format_alert(feature) for feature in data["features"]]
    return "\n---\n".join(alerts)

async def read_query(db: str,query: str) -> str:
    """Execute a SELECT query on the SQLite database and return results."""
    try:
        conn = sqlite3.connect(f"{db}.sqlite")
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
    conn = sqlite3.connect(f"{name}.sqlite")
    rows = conn.execute("SELECT name, sql FROM sqlite_master WHERE type='table'").fetchall()
    return [{"name": row[0], "schema": row[1]} for row in rows if row[1]]
    # return [{"name": 'nft1111'}]