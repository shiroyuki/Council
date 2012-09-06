from hashlib import md5

from sqlalchemy import Column, Integer, String

from tori.db.entity import Entity

class User(Entity):
    __tablename__ = 'users'

    id    = Column(Integer, primary_key=True)
    name  = Column(String(50), nullable=False)
    alias = Column(String(30))
    email = Column(String(100), index=True)

    def gravatar(self, size=None):
        url = 'http://www.gravatar.com/avatar/%s' % md5(self.email.lower()).hexdigest()

        if size:
            url = '%s?s=%d' % (url, size)

        return url

    def __unicode__(self):
        return u'%s' % self.name