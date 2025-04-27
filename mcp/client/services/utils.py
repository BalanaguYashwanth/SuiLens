import re

def check_is_valid_llm_response(response):
    if isinstance(response.content, list) and len(response.content) > 0 and hasattr(response.content[0], 'text'):
        raw_text = response.content[0].text  # Extract the text from the first item
    else:
        raw_text = "" 
    cleaned_text = re.split(r'\(Explanation:', raw_text)[0].strip()
    return cleaned_text
