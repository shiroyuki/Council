

from sqlalchemy       import Column, ForeignKey, Integer, String
from sqlalchemy.types import Boolean, Text
from sqlalchemy.orm   import relationship

from tori.db.entity import Entity

from council.user.model import User

class Council(Entity):
    __tablename__ = 'councils'

    id          = Column(Integer, primary_key=True)
    name        = Column(String(120), nullable=False)
    tagline     = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    isActive    = Column(Boolean, default=True)
    isPublic    = Column(Boolean, default=True)

    @property
    def normalized_name(self):
        return unicode(self.name).lower()

class Membership(Entity):
    __tablename__ = 'memberships'

    id          = Column(Integer, primary_key=True)
    council_id  = Column(Integer, ForeignKey('%s.id' % Council.__tablename__))
    isActive    = Column(Boolean, default=True)
    inCommittee = Column(Boolean, default=False)
    isLeader    = Column(Boolean, default=False)
    isSuspended = Column(Boolean, default=False)
    user_id     = Column(Integer, ForeignKey('%s.id' % User.__tablename__))

    council = relationship(
        'Council',
        uselist=False,
        primaryjoin='Membership.council_id == Council.id'
    )

    user = relationship(
        'User',
        uselist=False,
        primaryjoin='Membership.user_id == User.id'
    )