from sqlalchemy     import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from tori.db.entity import Entity
from tori.db.odm.document import document, Document

from council.user.model import User

class Provider(Entity):
    __tablename__ = 'providers'

    id   = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)

    def __unicode__(self):
        return u'%s' % self.name

class Credential(Entity):
    __tablename__ = 'credentials'

    id          = Column(Integer, primary_key=True)
    hash        = Column(String)
    login       = Column(String(50), nullable=False)
    salt        = Column(String)
    provider_id = Column(Integer, ForeignKey('%s.id' % Provider.__tablename__))
    user_id     = Column(Integer, ForeignKey('%s.id' % User.__tablename__))

    provider = relationship('Provider', primaryjoin='Credential.provider_id == Provider.id')
    user     = relationship('User', uselist=False, primaryjoin='Credential.user_id == User.id')

    def __unicode__(self):
        return u'%s/%s' % (self.provider.name, self.login)

@document
class Log(object):
    def __init__(self, kind, content, _id=None):
        self.id      = _id
        self.kind    = kind
        self.content = content