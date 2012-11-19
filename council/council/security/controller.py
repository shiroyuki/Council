from tornado.auth    import GoogleMixin
from tornado.web     import asynchronous, HTTPError

from council.common.handler import Controller
from council.security.model import Credential, Provider

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

class GoogleHandler(Controller, GoogleMixin):
    _providers = {}

    @asynchronous
    def get(self):
        if self.get_argument("openid.mode", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))

            return

        self.authenticate_redirect()

    def _on_auth(self, user):
        if not user:
            #raise HTTPError(500, "Google auth failed")
            self.redirect('/login/google/e403')

            return

        if 'google' not in self._providers:
            rdb = self.rdb()

            provider = rdb.query(Provider).filter(name='Google').first()
            

        self.session.set('user', user)

        self.redirect('/')

    def rdb(self):
        '''
        :rtype: tori.db.service.DatabaseRepository
        :return: the entity of the relational database repository
        '''
        return self.component('council.rdb')