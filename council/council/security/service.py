from imagination.decorator.validator import restrict_type

from tori.centre            import services
from council.security.model import User

class AccessControl(object):
    #@restrict_type(User)
    def know(user):
        es = services.get('council.db.security.user')