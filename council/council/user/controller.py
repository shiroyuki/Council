from council.common.handler     import Controller
from council.security.entity    import Credential, Provider
from council.security.exception import ControllerException
from council.user.entity        import User

class RegistrationHandler(Controller):
    def get(self):
        self.finish('Hello, world!')

    def post(self):
        session     = self.open_unsupervised_db_session()
        providers   = session.collection(Provider)
        credentials = session.collection(Credential)
        
        self.finish('ABC')