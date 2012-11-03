from tori.centre     import services
from tori.controller import Controller as BaseController
from tori.socket.rpc import Interface as BaseInterface

class Controller(BaseController):
    @property
    def authenticated(self):
        return self.session.get('user')

class WSRPCInterface(BaseInterface):
    @property
    def authenticated(self):
        return self.session.get('user')