# -*- encoding: utf-8 -*-
from tornado.auth import GoogleMixin
from tornado.web  import asynchronous, HTTPError

from council.common.handler     import Controller
from council.security.entity    import Credential, Provider, Role
from council.security.exception import ControllerException
from council.user.entity        import User

class CredentialActivationHandler(Controller):
    def put(self, id):
        session     = self.open_session()
        credentials = session.collection(Credential)
        credential  = credentials.get(id)
        is_active   = self.get_argument('active', None)
        
        if not credential:
            raise HTTPError(404)
        
        credential.active = is_active.lower() == 'true' if is_active != None else True
        
        self.set_status(200)

##### Deauthentication #####

class LogoutHandler(Controller):
    def get(self):
        self.session.set('user', None)

        self.redirect('/')

##### Authentication #####

class BaseLoginHandler(Controller):
    MODE_AUTH = 'auth' # for normal authentication
    MODE_LINK = 'link' # to link more account to the current session
    MODE_REAUTH = 'reauth' # to confirm authenticaticity of the session owner

    @property
    def mode(self):
        return self.get_argument('mode', self.MODE_AUTH)

    def get_provider_name(self):
        raise NotImplement()

    def get_success_route_for_normal_login(self):
        return '/'

    def get_success_route_for_first_login(self):
        return '/me'

    def get_route_authentication_error(self):
        return '/login/{}/e401'.format(self.get_provider_name())

    def handle_authentication_response(self, data):
        if not data:
            return self.redirect(self.get_route_authentication_error())

        session     = self.open_session()
        providers   = session.collection(Provider)
        credentials = session.collection(Credential)
        roles       = session.collection(Role)
        users       = session.collection(User)
        provider    = providers.filter_one({'alias': self.get_provider_name()})

        if not provider:
            raise RuntimeError('The provider "{}" is not defined.'.format(self.get_provider_name()))

        credential = credentials.filter_one({
            'login':    data['email'],
            'provider': provider.id
        })

        if self.mode == self.MODE_AUTH:
            user = users.new(name='', alias='', email=data['email'])

            if not credential:
                role = roles.filter_one({'alias': 'user' if len(users) else 'admin'})

                credential = credentials.new(
                    login = data['email'],
                    user  = user,
                    hash  = None,
                    salt  = None,
                    provider  = provider.id,
                    role_list = [role]
                )

                credentials.post(credential)

            # Create an access pass
            access_pass = {
                'id':       credential.user.id,
                'login':    credential.login,
                'provider': provider.id
            }

            self.session.set('user', access_pass)

        elif self.mode == self.MODE_LINK:
            user = self.authenticated

            if credential:
                raise HTTPError(403)

            role = roles.filter_one({'alias': 'user'})

            credential = credentials.new(
                login = data['email'],
                user  = user,
                hash  = None,
                salt  = None,
                provider  = provider.id,
                role_list = [role]
            )

            credentials.post(credential)

        if not credential:
            raise RuntimeError('The credential is not created.')

        if self.mode == self.MODE_LINK:
            return self.redirect(self.get_success_route_for_first_login())

        self.redirect(
            self.get_success_route_for_normal_login()\
                if credential.user.active\
                else self.get_success_route_for_first_login()
        )

class MockHandler(BaseLoginHandler):
    def get_provider_name(self):
        return 'dev'

    def get_email(self, alias):
        return '{}@council.com'.format(alias)

    def get(self, alias):
        data = {
            'email': alias if '@' in alias else self.get_email(alias)
        }

        self.handle_authentication_response(data)

class GoogleHandler(BaseLoginHandler, GoogleMixin):
    @asynchronous
    def get(self):
        if self.mode == self.MODE_AUTH and self.authenticated:
            return self.redirect(self.get_success_route_for_normal_login())
        elif self.get_argument("openid.mode", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))

            return

        self.authenticate_redirect()

    def get_provider_name(self):
        return 'google'

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