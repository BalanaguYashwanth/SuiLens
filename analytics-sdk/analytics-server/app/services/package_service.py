from app.dbhandlers.package_handler import PackageHandler

class PackageService:
    def __init__(self):
        self.package_handler = PackageHandler()

    def create_package(self, project_id: str, package_id: str, module_name: str):
        return self.package_handler.create_package(project_id, package_id, module_name)

    def get_packages_by_project(self, project_id: str):
        return self.package_handler.get_packages_by_project(project_id)