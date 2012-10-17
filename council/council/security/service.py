from imagination.decorator.validator import restrict_type
from tori.common import Enigma

from council.security.model import User

class AccessPass(object):
    def __init__(self, id, name, alias, email):
        self._id    = id
        self._name  = name
        self._alias = alias
        self._email = email

class AbstractService(object):
    def __init__(self, database_repository):
        self._database_repository = database_repository

class PasswordService(object):
    @staticmethod
    def generate(password, salt):
        return Enigma.instance().hash(password, salt)

class AccessControl(AbstractService):
    def authenticate(self, session_controller, key, password, provider=None):
        db = self._database_repository

        user = db\
            .query(User)\
            .filter(User.email == key)\
            .first()

        if not user:
            return None

        challenging_password = PasswordService.generate(password, user.salt)

        if user.password != challenging_password:
            return None

        return AccessPass(user.id, user.name, user.alias, user.email)

class RegistrationService(AbstractService):
    def register(self):
        pass