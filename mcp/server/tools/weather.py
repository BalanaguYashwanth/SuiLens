import os
import httpx
import smtplib
import logging
import sqlite3
from typing import Any
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv('.env')

# mcp_server = FastMCP("Weather")
# Constants
NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = "weather-app/1.0"

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='email_client.log'
)

# Email configuration
EMAIL_CONFIG = {
    "email": os.getenv("EMAIL_ADDRESS"),
    "password": os.getenv("EMAIL_APP_PASSWORD"),
    "imap_server": os.getenv("IMAP_SERVER", "imap.gmail.com"),
    "smtp_server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
    "smtp_port": int(os.getenv("SMTP_PORT", "587"))
}

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

async def send_email_async(
    to_addresses: list[str],
    subject: str,
    content: str,
    cc_addresses: list[str] | None = None
) -> None:
    """Asynchronously send an email."""
    try:

        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG["email"]
        msg['To'] = ', '.join(to_addresses)
        if cc_addresses:
            msg['Cc'] = ', '.join(cc_addresses)
        msg['Subject'] = subject
        
        # Add body
        msg.attach(MIMEText(content, 'plain', 'utf-8'))
        
        # Connect to SMTP server and send email
        def send_sync():
            with smtplib.SMTP(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"]) as server:
                server.set_debuglevel(1)  # Enable debug output
                logging.debug(f"Connecting to {EMAIL_CONFIG['smtp_server']}:{EMAIL_CONFIG['smtp_port']}")
                
                # Start TLS
                logging.debug("Starting TLS")
                server.starttls()
                
                # Login
                logging.debug(f"Logging in as {EMAIL_CONFIG['email']}")
                server.login(EMAIL_CONFIG["email"], EMAIL_CONFIG["password"])
                
                # Send email
                all_recipients = to_addresses + (cc_addresses or [])
                logging.debug(f"Sending email to: {all_recipients}")
                result = server.send_message(msg, EMAIL_CONFIG["email"], all_recipients)
                
                if result:
                    # send_message returns a dict of failed recipients
                    raise Exception(f"Failed to send to some recipients: {result}")
                
                logging.debug("Email sent successfully")

        send_sync()
        return f"successfully sent {msg['To']}"
    except Exception as e:
        logging.error(f"Error in send_email_async: {str(e)}")
        raise