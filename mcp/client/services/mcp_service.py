from typing import Optional
from contextlib import AsyncExitStack
from mcp import ClientSession
from mcp.client.sse import sse_client

import json
from .api import get_llm_response

class MCPClient:
    def __init__(self, server_url: str):
        self.session: Optional[ClientSession] = None
        self.exit_stack = AsyncExitStack()
        self.server_url = server_url
        self.resources_resp = None
        self.tools_resp = []

    async def initialize(self):
        if not (self.server_url.startswith("http://") or self.server_url.startswith("https://")):
            raise ValueError("Server URL must start with http:// or https://")

        sse_transport = await self.exit_stack.enter_async_context(sse_client(f"{self.server_url}/sse"))
        read_stream, write_stream = sse_transport
        self.session = await self.exit_stack.enter_async_context(ClientSession(read_stream, write_stream))
        await self.session.initialize()
        self.resources_resp = await self.session.list_resources() # list_resource_templates() for dynamic
        self.tools_resp = await self.session.list_tools()

    async def process_query(self, query: str, db_name) -> str:
        if not self.session:
            raise RuntimeError("Session is not initialized. Call initialize() first.")

        tools = [
            {
                "name": t.name,
                "description": t.description,
                "input_schema": t.inputSchema
            }
            for t in self.tools_resp.tools
        ]

        resources = [
            {
                "name": resource.name,
                "uri":  str(resource.uri),
                "description": resource.description,
                "mimeType": resource.mimeType
            }
            for resource in self.resources_resp.resources
        ]
        schema_response = await self.session.read_resource(f"schema://db//{db_name}")


        schema_resource = schema_response.contents[0].text

        # Combine the resource message and user query into a single content
        combined_content = f"""
                Here are the available schema & resources: DB name is {db_name} and
                \n\n {json.dumps({'schema_resource': schema_resource, 'other_resources': resources})}
                \n\nUser Query: {query}

                IMPORTANT INSTRUCTIONS:
                
                1. For the query, identify ALL tasks requested by the user.
                2. For EACH task, use the appropriate tool from available tools:
                    For example -
                    - Weather information, use the get_alerts tool
                    - Database queries, use the read_query tool with a valid SQL query
                        - If user query has direct sql query then directly pass into available tools to execute
                3. You MUST use separate tool calls for separate tasks, completing ALL requested tasks.
                4. If there is any email related query then explicity keep email tools at the end in output array (giving last priority to execute in call tools)
                5. Before answering, explain your reasoning step-by-step in tags.
                """
        # Prepare the message to send
        messages = [
            {"role": "user", "content": combined_content}
        ]

        response = get_llm_response(
                messages=messages, 
                tools=tools
            )

        if not response:
            return None
        
        final_text = {}
        sql_output = str([])
        index = 1
        for content in response.content:

            if content.type == "text":
                final_text['text'+ str(index)] = content.text
                index = index + 1

            elif content.type == "tool_use":

                if content.name == 'send_email_async':
                    content.input['content'] = f"{sql_output} \n \n {final_text}"

                tool_name = content.name
                tool_args = content.input

                call_tool_result = await self.session.call_tool(tool_name, tool_args)

                # Assuming call_tool_result.content is the structure you showed
                # Extract the actual text from the TextContent object
                call_tool_response_contents = call_tool_result.content

                if tool_name in ['read_query']:
                    # Extract just the 'text' content
                    final_text['sql'] = [json.loads(content.text) for content in call_tool_response_contents]
                    sql_output = final_text['sql']
                elif tool_name in ['read_user_token_balances']:
                    call_tool_result = await self.session.call_tool(tool_name, tool_args)
                    call_tool_response_contents = call_tool_result.content
                    output = [json.loads(content.text) for content in call_tool_response_contents]
                    final_text['sui_read_balances'] = output
                else:
                    final_text['text'+ str(index)] = call_tool_result.content

            index = index + 1


        return final_text

    async def cleanup(self):
        await self.exit_stack.aclose()

# Initialize MCP Client
mcp_client = MCPClient(server_url="http://localhost:8050")
