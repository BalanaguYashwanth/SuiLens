from typing import Optional
from contextlib import AsyncExitStack
from mcp import ClientSession
from mcp.client.sse import sse_client
from .multi_chaining import multi_chaining

import json
from .api import fetch_llm_response

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

    async def get_latest_llm_response(self, tools, prompt):
        messages = [
            {"role": "user", "content": prompt}
        ]

        response = fetch_llm_response(
                messages=messages, 
                tools=tools
            )

        return response

    def get_tools_resources(self, tool_reps, resource_reps):
        tools = [
            {
                "name": t.name,
                "description": t.description,
                "input_schema": t.inputSchema
            }
            for t in tool_reps
        ]

        resources = [
            {
                "name": resource.name,
                "uri":  str(resource.uri),
                "description": resource.description,
                "mimeType": resource.mimeType
            }
            for resource in resource_reps
        ]
        return tools, resources

    def get_sql_prompt(self, query, schema_resource, db_name, resources):
        return f"""
                Here are the available schema & resources: DB name is {db_name} and
                \n\n {json.dumps({'schema_resource': schema_resource, 'other_resources': resources})}
                \n\nUser Query: {query}

                IMPORTANT INSTRUCTIONS:
                1. This query is running for sqlite db, based on it give me result
                1. If the database name or any table mentioned in the user query does not exist in the schema, then don't call any sql related tools.
                2. If table exists in schema then For the query, identify ALL tasks requested by the user.
                3. For EACH task, use the appropriate tool from available tools:
                    For example -
                    - Weather information, use the get_alerts tool
                    - Database queries, use the read_query tool with a valid SQL query
                        - If user query has direct sql query then directly pass into available tools to execute, don't maniplate that query
                4. Give sql tools more top and highest priority keep at the top of output tool call array
                5. You MUST use separate tool calls for separate tasks, completing ALL requested tasks.
                6. If there is any email related query then explicity keep email tools at the end in output array (giving last priority to execute in call tools)
                7. Before answering, explain your reasoning step-by-step in tags.
                """

    async def process_query(self, query: str, db_name) -> str:
        if not self.session:
            raise RuntimeError("Session is not initialized. Call initialize() first.")
        tools, resources = self.get_tools_resources(
                tool_reps = self.tools_resp.tools, 
                resource_reps=self.resources_resp.resources
            )
    
        schema_response = await self.session.read_resource(f"schema://db//{db_name}")
        schema_resource = schema_response.contents[0].text
        sql_prompt = self.get_sql_prompt(query, schema_resource, db_name, resources)

        response = await self.get_latest_llm_response(tools, prompt=sql_prompt)
        if not response:
            return None
        
        final_text = {}
        index = 1
        final_response, latest_index = await multi_chaining(index, final_text, contents=response.content, session=self.session)
        #TODO - Seperate move below if condition to seperate arr
        if final_response['sql'] or len(final_response['sql']):
            json_str = json.dumps(final_text['sql'])
            tools_prompt = f"""
                            here is the user query {query}

                            IMPORTANT INSTRUCTIONS:
                                1. DATA is already fetched SQL tools, suggest other tools now
                                2. You MUST use required tools as per user query prompt strictly and separate tool calls for separate tasks, completing ALL requested tasks.
                                3. Don't call all unnecessary tools strictly, for example if user prompt mentioned read user balance or read balance then only call those tools or else not needed strictly repeating it
                                4. If there is any email related query mentioned in user query prompt then only explicity keep email tools at the end in output array (giving last priority to execute in call tools)
                                5. Before answering, explain your reasoning step-by-step in tags.

                                more context -                            
                                  Alread fetched latest data from user sql query - {json_str}
                                based on available data, please suggest other tools other than sql tools 
                            """

            response = await self.get_latest_llm_response(tools, prompt=tools_prompt)
            if not response:
                return None
            final_response = await multi_chaining(latest_index, final_response, contents=response.content, session=self.session)
            
        return final_response

    async def cleanup(self):
        await self.exit_stack.aclose()

# Initialize MCP Client
mcp_client = MCPClient(server_url="http://localhost:8050")
