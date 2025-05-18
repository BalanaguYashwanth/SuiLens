from app.dbhandlers.package_handler import PackageHandler

class PackageService:
    def __init__(self):
        self.package_handler = PackageHandler()

    def create_package(self, email: str, package_id: str, module_name: str):
        return self.package_handler.create_package(email, package_id, module_name)

    def get_packages_by_user(self, email: str):
        return self.package_handler.get_packages_by_user(email)