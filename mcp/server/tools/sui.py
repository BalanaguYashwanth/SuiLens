import httpx

SUI_RPC_URL = "https://sui-testnet.public.blastapi.io/"

def get_payload(method, params):
    return {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    }


async def read_user_token_balances(address_list: list[str]):
    try:
        payload = get_payload("suix_getAllCoins", params=address_list)
        headers = {
            "Content-Type": "application/json"
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(SUI_RPC_URL, json=payload, headers=headers)
            return response.json()
    except Exception as e:
        return f'Error executing {str(e)}'