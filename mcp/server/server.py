from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
from handlers import MCPServer
load_dotenv('.env')

mcp = FastMCP(
            name="weather",
            host="0.0.0.0",
            port=8050,
            timeout=30
        )

if __name__ == "__main__":
    server = MCPServer(mcp)
    server.run(transport_type="sse")  # choose "stdio" or "sse"
