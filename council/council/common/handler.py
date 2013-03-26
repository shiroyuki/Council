from tori.controller import Controller     as BaseController
from tori.controller import RestController as BaseRestController
from tori.socket.rpc import Interface      as BaseInterface
from council.security.entity import Credential
from council.user.entity     import User

class Controller(BaseController):
    def __init__(self, *args, **kwargs):
        BaseController.__init__(self, *args, **kwargs)

        self.__session = None

    @property
    def authenticated(self):
        ''':rtype: council.security.document.Credential'''
        return self.session.get('user')

    def open_unsupervised_db_session(self):
        if not self.__session:
            self.__session = self.component('entity_manager').open_session(supervised=False)

        return self.__session

    def render_template(self, template_name, **contexts):
        contexts['council'] = {
            'user': self.authenticated
        }

        return BaseController.render_template(self, template_name, **contexts)

class RestController(BaseRestController):
    @property
    def authenticated(self):
        return self.session.get('user')

class WSRPCInterface(BaseInterface):
    @property
    def authenticated(self):
        return self.session.get('user')