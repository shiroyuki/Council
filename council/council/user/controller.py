from tori.decorator.controller  import renderer
from council.common.handler     import Controller
from council.security.entity    import Credential, Provider
from council.security.exception import ControllerException
from council.user.entity        import User

@renderer('council.view')
class MeHandler(Controller):
    def get(self):
        user = self.authenticated

        if not user:
            self.redirect('/')

        session     = self.open_session()
        credentials = session.collection(Credential)
        providers   = session.collection(Provider)

        self.render(
            'me.html',
            js_module_name='Me',
            connected_id_list=credentials.filter({'user': user.id}),
            provider_list=providers.filter(),
            provider_icon_map={
                'google': 'google-plus'
            }
        )

    def post(self):
        user = self.authenticated

        if not user:
            self.respond_with_error(403)

        user.name  = self.get_argument('name')
        user.alias = self.get_argument('alias')
        user.email = self.get_argument('email')
        user.active = True

        session = self.open_session()
        users   = session.collection(User)

        users.put(user)

        self.redirect('/me')