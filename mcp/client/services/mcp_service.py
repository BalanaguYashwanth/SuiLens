from typing import Optional
from anthropic import Anthropic
from contextlib import AsyncExitStack
from mcp import ClientSession
from mcp.client.sse import sse_client

class MCPClient:
    def __init__(self, server_url: str):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.anthropic = Anthropic(api_key="")
        self.server_url = server_url

    async def initialize(self):
        if not self.server_url.startswith("http://") and not self.server_url.startswith("https://"):
            raise ValueError("Server URL must start with http:// or https://")

        sse_transport = await self.exit_stack.enter_async_context(sse_client(f"{self.server_url}/sse"))
        read_stream, write_stream = sse_transport
        self.session = await self.exit_stack.enter_async_context(ClientSession(read_stream, write_stream))
        await self.session.initialize()

    async def process_query(self, query: str) -> str:
        messages = [{"role": "user", "content": query}]
        
        tools_resp = await self.session.list_tools()
        tools = [{
            "name": t.name,
            "description": t.description,
            "input_schema": t.inputSchema
        } for t in tools_resp.tools]

        response = self.anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            messages=messages,
            tools=tools,
        )

        final_text = []

        for content in response.content:
            if content.type == "text":
                final_text.append(content.text)
            elif content.type == "tool_use":
                result = await self.session.call_tool(content.name, content.input)
                final_text.append(f"[Calling tool {content.name} with args {content.input}]")

                if hasattr(content, "text") and content.text:
                    messages.append({"role": "assistant", "content": content.text})
                messages.append({"role": "user", "content": result.content})

                response = self.anthropic.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1000,
                    messages=messages,
                )

                final_text.append(response.content[0].text)

        return "\n".join(final_text)

    async def cleanup(self):
        await self.exit_stack.aclose()

# Initialize it here with your server URL
mcp_client = MCPClient(server_url="http://localhost:8050")  # <- or whatever your URL is
