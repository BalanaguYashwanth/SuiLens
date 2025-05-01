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
    output = []
    try:
        for address in address_list:
            payload = get_payload("suix_getAllCoins", params=[address])
            headers = {
                "Content-Type": "application/json"
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(SUI_RPC_URL, json=payload, headers=headers)
                user_balance_response = response.json()
                if user_balance_response.get('result'):
                    balance = user_balance_response['result']['data']
                    for b in balance:
                        output.append(b)
        return output  
    except Exception as e:
        return f'Error executing {str(e)}'