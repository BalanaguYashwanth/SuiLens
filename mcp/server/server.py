import sys
import asyncio
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
from mcp.server.sse import SseServerTransport
from starlette.applications import Starlette
from starlette.routing import Route, Mount
# from tools import register_tools
from tools.weather import get_alerts
from tools.weather import read_query
from tools.weather import get_db_schema
# from tools.sql import sql_tools
import mcp.types as types
import uvicorn

load_dotenv('.env')


class MCPServer:
    def __init__(self):
        self.mcp = FastMCP(
            name="weather",
            host="0.0.0.0",
            port=8050,
            timeout=30
        )

    def register_list_tools(self):
        self.mcp.tool()(get_alerts)
        self.mcp.tool()(read_query)

    def register_resources(self) -> None:
       self.mcp.resource("schema://db//{name}")(get_db_schema)

    def create_starlette_app(self):
        self.register_list_tools()
        self.register_resources()

        transport = SseServerTransport("/mcp/messages/")

        async def handle_sse(request):
            async with transport.connect_sse(
                request.scope, request.receive, request._send
            ) as streams:
                await self.mcp._mcp_server.run(
                    streams[0],
                    streams[1],
                    self.mcp._mcp_server.create_initialization_options()
                )

        return Starlette(
            debug=True,
            routes=[
                Route("/sse", endpoint=handle_sse),
                Mount("/mcp/messages/", app=transport.handle_post_message)
            ]
        )

    def run(self, transport_type="sse"):
        if transport_type == "stdio":
            self.mcp.run(transport="stdio")
        else:
            app = self.create_starlette_app()
            uvicorn.run(app, host="0.0.0.0", port=8050, log_level="debug")


if __name__ == "__main__":
    server = MCPServer()
    server.run(transport_type="sse")  # choose "stdio" or "sse"
