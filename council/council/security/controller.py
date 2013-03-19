from tornado.auth import GoogleMixin
from tornado.web  import asynchronous, HTTPError

from council.common.handler     import Controller
from council.security.entity    import Credential, Provider
from council.security.exception import ControllerException

class LogoutHandler(Controller):
    def get(self):
        self.session.set('user', None)

        self.redirect('/')

class BaseLoginHandler(Controller):
    def open_unsupervised_db_session(self):
        return self.component('entity_manager').open_session(supervised=False)

    def get_provider_name(self):
        raise NotImplement()

    def handle_authentication_response(self, data):
        if not data:
            self.redirect('/login/{}/e401'.format(self.get_provider_name()))

            return

        session     = self.open_unsupervised_db_session()
        providers   = session.collection(Provider)
        credentials = session.collection(Credential)
        provider    = providers.filter_one({'name': self.get_provider_name()})

        if not provider:
            raise RuntimeError('The provider is not defined.')

        credential = credentials.filter_one({
            'name':     data['name'],
            'login':    data['email'],
            'provider': provider.id
        })

        if not credential:
            credential = credentials.new(
                name     = data['name'],
                login    = data['email'],
                provider = provider.id,
                user     = None,
                hash     = None,
                salt     = None
            )

            credentials.post(credential)

        access_pass = {
            'id':    credential.id,
            'name':  credential.name,
            'alias': credential.alias,
            'login': credential.login
        }

        self.session.set('user', access_pass)

        self.redirect('/')

class MockHandler(BaseLoginHandler):
    def get_provider_name(self):
        return 'Dev'

    def get(self):
        user = {
            'first_name': u'Koichi',
            'claimed_id': u'https://www.google.com/accounts/o8/id?id=abcdef',
            'name': u'Koichi Nakayama',
            'locale': u'en',
            'last_name': u'Nakayama',
            'email': u'koichi@nakayama.jp'
        }

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