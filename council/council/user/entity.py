from hashlib import md5
from tori.db.entity import entity

@entity('council_user_entity')
class User(object):
    def __init__(self, name, alias, email, active=False):
        self.name   = name
        self.alias  = alias
        self.email  = email
        self.active = active