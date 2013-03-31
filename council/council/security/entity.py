from hashlib import md5

from tori.db.entity import entity
from tori.db.mapper import link, AssociationType, CascadingType
from council.user.entity import User

@entity('council_security_role')
class Role(object):
    """ Constructor

        :param name: name
        :type  name: str
        :param alias: alias
        :type  alias: str
    """
    def __init__(self, name, alias):
        self.name  = name
        self.alias = alias

@entity('council_security_provider')
class Provider(object):
    """ Constructor

        :param name: name
        :type  name: str
        :param alias: alias
        :type  alias: str
    """
    def __init__(self, name, alias):
        self.name = name
        self.alias = alias

@link(mapped_by='provider', target=Provider, association=AssociationType.MANY_TO_ONE, read_only=True)
@link(mapped_by='role_list', target=Role, association=AssociationType.MANY_TO_MANY, read_only=True)
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
        :param role_list: the list of roles
        :type  role_list: list
        :param active: active
        :type  active: bool
    """
    def __init__(self, user, provider, login, hash, salt, role_list, active=True):
        self.login = login
        self.hash  = hash
        self.salt  = salt
        self.user  = user
        self.active    = active
        self.provider  = provider
        self.role_list = role_list
