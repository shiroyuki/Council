from tornado.web import HTTPError
from tori.controller import Controller     as BaseController
from tori.controller import RestController as BaseRestController
from tori.socket.rpc import Interface      as BaseInterface
from council.security.entity import Credential
from council.user.entity     import User

class Controller(BaseController):
    def __init__(self, *args, **kwargs):
        BaseController.__init__(self, *args, **kwargs)

        self.__session = None
        self.__current_user = None

    @property
    def authenticated(self):
        ''':rtype: council.security.document.Credential'''
        access_pass = self.session.get('user')

        if not access_pass:
            self.__current_user = None
        elif not self.__current_user:
            session = self.open_session()

            self.__current_user = session.collection(User).get(access_pass['id'])

        return self.__current_user

    def open_session(self):
        if not self.__session:
            self.__session = self.component('entity_manager').open_session(supervised=False)

        return self.__session

    def render_template(self, template_name, **contexts):
        contexts['council'] = {
            'user': self.authenticated
        }

        return BaseController.render_template(self, template_name, **contexts)

    def respond_with_error(self, status):
        raise HTTPError(status)

class RestController(BaseRestController):
    @property
    def authenticated(self):
        return self.session.get('user')

class WSRPCInterface(BaseInterface):
    @property
    def authenticated(self):
        return self.session.get('user')