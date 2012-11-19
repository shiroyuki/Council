from tori.controller import Controller as BaseController
from tori.socket.rpc import Interface as BaseInterface

class Controller(BaseController):
    @property
    def authenticated(self):
        return self.session.get('user')

    def render_template(self, template_name, **contexts):
        contexts['council'] = {
            'authenticated_user': self.authenticated
        }

        return BaseController.render_template(self, template_name, **contexts)

class WSRPCInterface(BaseInterface):
    @property
    def authenticated(self):
        return self.session.get('user')