import json
from tornado.web import HTTPError
from tori.controller import Controller     as BaseController
from tori.controller import RestController as BaseRestController
from tori.socket.rpc import Interface      as BaseInterface
from council.security.entity import Credential
from council.user.entity     import User

class Mixin(object):
    def __init__(self):
        self.__db_session   = None
        self.__current_user = None

    def get_request_data(self):
        return json.loads(self.request.body)

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
        if not self.__db_session:
            self.__db_session = self.component('entity_manager').open_session(supervised=False)

        return self.__db_session

class Controller(BaseController, Mixin):
    def __init__(self, *args, **kwargs):
        BaseController.__init__(self, *args, **kwargs)
        super(Mixin, self).__init__()

    def render_template(self, template_name, **contexts):
        contexts['council'] = {
            'user': self.authenticated
        }

        return BaseController.render_template(self, template_name, **contexts)

    def respond_with_error(self, status):
        raise HTTPError(status)

class RestController(BaseRestController, Mixin):
    def __init__(self, *args, **kwargs):
        BaseRestController.__init__(self, *args, **kwargs)
        super(Mixin, self).__init__()

class WSRPCInterface(BaseInterface):
    @property
    def authenticated(self):
        return self.session.get('user')