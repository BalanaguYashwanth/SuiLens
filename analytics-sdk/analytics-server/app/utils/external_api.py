import httpx

SUI_RPC_URL = "https://sui-testnet.public.blastapi.io"

def get_payload(module, params):
    return {
        "jsonrpc": "2.0",
        "id": 1,
        "method": module,
        "params": params
    }

async def fetch_sui_api(module, params):
    payload = get_payload(module, params=params)
    headers = {
            "Content-Type": "application/json"
        }
    async with httpx.AsyncClient() as client:
            response = await client.post(SUI_RPC_URL, json=payload, headers=headers)
            return response.json()