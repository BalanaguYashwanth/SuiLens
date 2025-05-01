from fastapi import FastAPI

class CustmFastAPI(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        from app.services.analytics_service import AnalyticsService
        from app.services.event_service import EventService
        from app.services.api_url_service import ApiUrlService
        from app.services.user_service import UserService
        from app.services.project_service import ProjectService
        from app.services.package_service import PackageService
        from app.dbhandlers.event_handler import EventHandler
        from app.dbhandlers.api_url_handler import ApiUrlHandler
        from app.dbhandlers.user_handler import UserHandler
        from app.dbhandlers.project_handler import ProjectHandler
        from app.dbhandlers.package_handler import PackageHandler
        
        self.analytics_service = AnalyticsService()
        self.event_service = EventService()
        self.api_url_service = ApiUrlService()
        self.user_service = UserService()
        self.project_service = ProjectService()
        self.package_service = PackageService()
        self.event_handler = EventHandler()
        self.api_url_handler = ApiUrlHandler()
        self.user_handler = UserHandler()
        self.project_handler = ProjectHandler()
        self.package_handler = PackageHandler()