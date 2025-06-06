from datetime import datetime, timezone
from collections import defaultdict
from multiprocessing import Pool, cpu_count
from app.utils.external_api import fetch_sui_api

class AnalyticsService:
    def __init__(self):
        self.package_address = None
        self.batch_size = 0
        self.timeline = defaultdict(self.default_timeline)  # Use a class method for default value

    def default_timeline(self):
        return defaultdict(int)  # This will be used as the default factory function

    def process_entry(self, entry):
        result = []
        try:
            timestamp_ms = int(entry.get("timestampMs"))
            dt = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)  # Correct timezone
            date_str = dt.strftime("%Y-%m-%d")  # Format date
            transactions = entry["transaction"]["data"]["transaction"].get("transactions", [])

            for tx in transactions:
                move_call = tx.get("MoveCall")
                if move_call and "function" in move_call:
                    fn_name = move_call["function"]
                    result.append((fn_name, date_str))  # Append function name with date
        except Exception as e:
            print(f"Error processing entry: {e}")  # Log any exceptions
        return result

    def get_daily_function_timeline(self, data):
        # Use Pool to process entries in parallel
        with Pool(processes=cpu_count()) as pool:
            results = pool.map(self.process_entry, data)

        # Update the timeline (no need to create new timeline)
        for fn_calls in results:
            for fn_name, date_str in fn_calls:
                self.timeline[fn_name][date_str] += 1

        return self.timeline

    async def get_function_analytics(self, total_txs):
        params = [
            total_txs,
            {
                "showInput": True,
                "showRawInput": False,
                "showEffects": True,
                "showEvents": True,
                "showObjectChanges": False,
                "showBalanceChanges": False,
                "showRawEffects": False
            }
        ]
        
        try:
            raw_response = await fetch_sui_api('sui_multiGetTransactionBlocks', params)
            
            if 'result' not in raw_response:
                print("Error: 'result' not found in the API response.")
                return self.timeline

            results = raw_response['result']
            if isinstance(results, list):
                timeline = self.get_daily_function_timeline(results)
                return timeline
            else:
                print("Error: Invalid data structure in 'result'.")
                return self.timeline
        except Exception as e:
            print(f"Error fetching function analytics: {e}")
            return self.timeline

    async def get_transactions(self, index, cursor=None):
        if index >= self.batch_size:
            return

        params = [
            {
                "filter": {
                    "InputObject": self.package_address
                }
            }
        ]
        if cursor:
            params[0]['cursor'] = cursor

        try:
            raw_response = await fetch_sui_api("suix_queryTransactionBlocks", params)
            print('==raw_response--=', raw_response)
            if 'result' not in raw_response:
                print("Error: 'result' not found in the API response.")
                return

            response = raw_response['result']
            print('==response--=', response)
            raw_digests_dict = response.get("data", [])

            if not raw_digests_dict:
                print("Error: No data found in the 'data' field of the response.")
                return

            digests = [tx["digest"] for tx in raw_digests_dict if "digest" in tx]

            # Update the global timeline with the newly fetched digests
            await self.get_function_analytics(digests)

            # If there is a next page, continue fetching
            if response.get('hasNextPage') and response.get('nextCursor'):
                await self.get_transactions(index + 1, response['nextCursor'])
        except Exception as e:
            print(f"Error fetching transactions: {e}")

    async def get_analytics(self, package_address, batch_size):
        self.package_address = package_address
        self.batch_size = int(batch_size)
        # Start fetching transactions and update timeline
        await self.get_transactions(0)
        # Return the final updated timeline
        return self.timeline
