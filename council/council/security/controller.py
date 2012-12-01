from tornado.auth    import GoogleMixin
from tornado.web     import asynchronous, HTTPError

from council.common.handler     import Controller
from council.security.document  import AccessPass
from council.security.exception import ControllerException

class LogoutHandler(Controller):
    def get(self):
        self.session.set('user', None)

        self.redirect('/')

class LocalHandler(Controller):
    def post(self):
        key      = self.get_argument('key')
        password = self.get_argument('password')

        if self.authenticated:
            return self.redirect('/')

        access_pass = self\
            .component('council.security.service.authentication')\
            .authenticate(key, password)

        if not access_pass:
            return self.redirect('/login')

        self.session.set('user', access_pass)

class MockHandler(Controller):
    def get(self):

        credentials = self.component('council.collection.security.Credential')
        ''' :type credentials: tori.db.odm.collection.Collection '''

        providers = self.component('council.collection.security.Provider')
        ''' :type providers: tori.db.odm.collection.Collection '''

        provider = providers.filter_one(name='Google')

        user = {
            'first_name': u'Koichi',
            'claimed_id': u'https://www.google.com/accounts/o8/id?id=abcdef',
            'name': u'Koichi Nakayama',
            'locale': u'en',
            'last_name': u'Nakayama',
            'email': u'koichi@nakayama.jp'
        }

        credential = credentials.filter_one(
            name       = user['name'],
            login      = user['email'],
            provider   = provider.id
        )

        if not credential:
            credential = credentials.new_document(
                name       = user['name'],
                login      = user['email'],
                provider   = provider.id,
                user       = None,
                hash       = None,
                salt       = None
            )

            credentials.post(credential)

        access_pass = AccessPass(credential.id, credential.name, credential.alias, credential.login)

        self.session.set('user', access_pass)

        self.redirect('/')

class GoogleHandler(Controller, GoogleMixin):
    @asynchronous
    def get(self):
        if self.get_argument("openid.mode", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))

            return

        self.authenticate_redirect()

    def _on_auth(self, user):
        credentials = self.component('council.collection.security.Credential')
        ''' :type credentials: tori.db.odm.collection.Collection '''

        providers = self.component('council.collection.security.Provider')
        ''' :type providers: tori.db.odm.collection.Collection '''

        if not user:
            self.redirect('/login/google/e403')

            return

        provider = providers.filter_one(name='Google')

        if not provider:
            raise ControllerException('The provider is not defined.')

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

        credential = credentials.filter_one(
            name       = user['name'],
            login      = user['email'],
            provider   = provider.id
        )

        if not credential:
            credential = credentials.new_document(
                name       = user['name'],
                login      = user['email'],
                provider   = provider.id,
                user       = None,
                hash       = None,
                salt       = None
            )

            credentials.post(credential)

        access_pass = AccessPass(credential.id, credential.name, credential.alias, credential.login)

        self.session.set('user', access_pass)

        self.redirect('/')