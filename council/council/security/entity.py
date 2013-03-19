from hashlib import md5

from tori.db.entity import entity
from tori.db.mapper import link, AssociationType, CascadingType
from council.user.entity import User

@entity('council_security_provider')
class Provider(object):
    """ Constructor

        :param name: the name of the provider
        :type name:  str
    """
    def __init__(self, name):

        self.name = name

@link(mapped_by='provider', target=Provider, association=AssociationType.MANY_TO_ONE, read_only=True)
@link(mapped_by='user', target=User, association=AssociationType.MANY_TO_ONE, cascading=[CascadingType.PERSIST, CascadingType.REFRESH])
@entity('council_security_credential')
class Credential(object):
    """ Constructor

        :param user:  user
        :type  user:  council.user.entity.User
        :param login: login credential (email)
        :type  login: str
        :param hash:  password hash
        :type  hash:  str
        :param salt:  password salt
        :type  salt:  str
        :param provider: authentication provider
        :type  provider: council.security.entity.Provider
    """
    def __init__(self, user, provider, login, hash, salt):
        self.login    = login
        self.hash     = hash
        self.salt     = salt
        self.provider = provider
        self.user     = user
