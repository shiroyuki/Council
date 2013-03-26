# -*- encoding: utf-8 -*-
from tornado.auth import GoogleMixin
from tornado.web  import asynchronous, HTTPError

from council.common.handler     import Controller
from council.security.entity    import Credential, Provider
from council.security.exception import ControllerException
from council.user.entity        import User

class RegistrationHandler(Controller):
    def open_unsupervised_db_session(self):
        return self.component('entity_manager').open_session(supervised=False)

    def post(self):
        session     = self.open_unsupervised_db_session()
        providers   = session.collection(Provider)
        credentials = session.collection(Credential)

class LogoutHandler(Controller):
    def get(self):
        self.session.set('user', None)

        self.redirect('/')

class BaseLoginHandler(Controller):
    def get_provider_name(self):
        raise NotImplement()

    def handle_authentication_response(self, data):
        if not data:
            self.redirect('/login/{}/e401'.format(self.get_provider_name()))

            return

        is_new      = False
        session     = self.open_unsupervised_db_session()
        providers   = session.collection(Provider)
        credentials = session.collection(Credential)
        provider    = providers.filter_one({'name': self.get_provider_name()})

        if not provider:
            raise RuntimeError('The provider "{}" is not defined.'.format(self.get_provider_name()))

        credential = credentials.filter_one({
            'login':    data['email'],
            'provider': provider.id
        })

        if not credential:
            credential = credentials.new(
                login    = data['email'],
                provider = provider.id,
                user     = None,
                hash     = None,
                salt     = None
            )

            credentials.post(credential)
            
            is_new = True

        access_pass = {
            'id':    credential.id,
            'login': credential.login
        }

        self.session.set('user', access_pass)

        self.redirect('/registration' if is_new else '/')

class MockHandler(BaseLoginHandler):
    def get_provider_name(self):
        return 'Dev'
    
    def get_email(self, alias):
        return '{}@council.com'.format(alias)

    def get(self, alias):
        data = {
            'email': self.get_email(alias)
        }

        self.handle_authentication_response(data)

class GoogleHandler(BaseLoginHandler, GoogleMixin):
    @asynchronous
    def get(self):
        if self.get_argument("openid.mode", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))

            return

        self.authenticate_redirect()

    def get_provider_name(self):
        return 'Google'

    def _on_auth(self, data):
        # Sample structure of "user"
        # --------------------------
        # {
        #   'first_name': u'Koichi',
        #   'claimed_id': u'https://www.google.com/accounts/o8/id?id=abcdef',
        #   'name': u'Koichi Nakayama',
        #   'locale': u'en',
        #   'last_name': u'Nakayama',
        #   'email': u'koichi@nakayama.jp'
        # }

        self.handle_authentication_response(data)