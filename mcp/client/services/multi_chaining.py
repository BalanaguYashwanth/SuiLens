import json

async def multi_chaining(index, final_text, contents, session):

    sql_output = final_text.get('sql') or None

    for content in contents:
        if content.type == "text":
            final_text['text'+ str(index)] = content.text
            index = index + 1

        elif content.type == "tool_use":
            if content.name == 'send_email_async':
                content.input['content'] = f"{sql_output} \n \n {final_text}"

            tool_name = content.name
            tool_args = content.input

            call_tool_result = await session.call_tool(tool_name, tool_args)
            call_tool_response_contents = call_tool_result.content
            final_text['text'+ str(index)] = call_tool_response_contents

            if (not sql_output) and tool_name in ['read_query']:
                final_text['sql'] = [json.loads(content.text) for content in call_tool_response_contents]
                return final_text, index

            elif tool_name in ['read_user_token_balances']:
                call_tool_result = await session.call_tool(tool_name, tool_args)
                call_tool_response_contents = call_tool_result.content
                output = [json.loads(content.text) for content in call_tool_response_contents]
                final_text['sui_read_balances'] = output
            else:
                final_text['text'+ str(index)] = call_tool_result.content

        index = index + 1

    return final_text, index