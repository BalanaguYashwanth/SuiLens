from fastapi import APIRouter, Request
from services import mcp_client

router = APIRouter()

@router.get("/")
def status():
    return {"status": "working"}

@router.post("/chat")
async def chat_api(request: Request):
    body = await request.json()
    query = body.get("query")
    db_name = body.get("db")
    if not query:
        return {"error": "Query is required"}
    try:
        response = await mcp_client.process_query(query, db_name)
        return {"response": response}
    except Exception as e:
        return {"error": str(e)}
