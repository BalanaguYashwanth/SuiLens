import os
import re
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def get_llm_response(messages, tools):
    response = anthropic.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1000,
        messages=messages,
        tools=tools,
    )
    # Assuming the text is inside response.content[0].text
    raw_text = response.content[0].text if response.content else ""

    # Clean the text by removing everything after "(Explanation:"
    cleaned_text = re.split(r'\(Explanation:', raw_text)[0].strip()

    if cleaned_text == 'None' or (not cleaned_text) :
        return None

    return response
