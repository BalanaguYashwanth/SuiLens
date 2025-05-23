import os
import re
from dotenv import load_dotenv
from anthropic import Anthropic
from .utils import check_is_valid_llm_response

load_dotenv()

anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def fetch_llm_response(messages, tools):
    raw_response = anthropic.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        messages=messages,
        tools=tools,
        tool_choice={"type": "any"},
    )

    return raw_response
