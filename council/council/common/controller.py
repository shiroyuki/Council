from tori.centre     import services
from tori.controller import Controller as BaseController

class Controller(BaseController):
    @property
    def authenticated(self):
        return self.session.get('user')