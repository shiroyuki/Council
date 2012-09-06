# -*- coding: utf-8 -*-
from tori.common               import getLogger
from tori.controller           import Controller
from tori.decorator.controller import renderer

from council.graph.model import Membership
from council.user.model  import User

@renderer('council.view')
class Home(Controller):
    def get(self):
        if not self.session('user'):
            return self.redirect('/login')

        user = self.session('user')

        print user and user.keys() or '-----'

        self.render(
            'index.html',
            user=user
        )

@renderer('council.view')
class Mock(Controller):
    logger = getLogger('%s.Mock' % (__name__))

    def get(self):
        repository  = self.component('council.db')
        user        = repository.get(User, 1)
        memberships = repository.query(Membership).filter(Membership.user == user).all()

        self.render(
            'mock.html',
            current_user = user,
            memberships  = memberships
        )