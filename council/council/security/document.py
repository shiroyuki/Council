from hashlib import md5

from tori.db.odm.document import document, Document

class AccessPass(object):
    def __init__(self, id, name, alias, email):
        self._id    = id
        self._name  = name
        self._alias = alias
        self._email = email

    @property
    def id(self):
        return self._id

    @property
    def name(self):
        return self._name

    @property
    def email(self):
        return self._email

    @property
    def alias(self):
        return self._alias

    @property
    def gravatar(self, size=None):
        url = 'http://www.gravatar.com/avatar/%s' % md5(self.email.lower()).hexdigest()

        if size:
            url = '%s?s=%d' % (url, size)

        return url

    def to_array(self):
        return {
            'id':    self._id,
            'name':  self._name,
            'alias': self._alias,
            'email': self._email
        }

@document
class Provider(object):
    def __init__(self, name, _id):
        '''
        Constructor

        :param name: the name of the provider
        :type name:  str
        '''

        self._id  = _id
        self.name = name

@document
class Credential(Document):
    def __init__(self, login, hash, salt, provider, user, **attributes):
        '''
        Constructor

        :param login:      login credential
         :type login:      str
        :param hash:       password hash
         :type hash:       str
        :param salt:       password salt
         :type hash:       str
        :param provider:   authentication provider
         :type provider:   int
        :param user:       user
         :type user:       int
        :param attributes: the additional parameters
         :type attributes: dict
        :return:
        '''

        Document.__init__(self, **attributes)

        self.login    = login
        self.hash     = hash
        self.salt     = salt
        self.provider = provider
        self.user     = user

        if 'alias' not in attributes:
            self.alias = None