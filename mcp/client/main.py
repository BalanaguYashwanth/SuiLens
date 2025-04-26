from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.mcp import router
from services.mcp_service import mcp_client

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def on_startup():
    await mcp_client.initialize()

@app.on_event("shutdown")
async def on_shutdown():
    await mcp_client.cleanup()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

