from app.dbhandlers.api_url_handler import ApiUrlHandler

class ApiUrlService:
    def __init__(self):
        self.api_url_handler = ApiUrlHandler()

    async def get_api_url(self):
        return await self.api_url_handler.get_api_url()