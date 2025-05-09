from app.dbhandlers.user_handler import UserHandler

class UserService:
    def __init__(self):
        self.user_handler = UserHandler()

    def create_user(self, email: str):
        return self.user_handler.create_user(email)

            