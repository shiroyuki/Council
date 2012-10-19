# -*- coding: utf-8 -*-
from tori.common               import get_logger
from tori.decorator.controller import renderer

from council.common.controller import Controller
from council.graph.model       import Membership
from council.user.model        import User

@renderer('council.view')
class Home(Controller):
    def get(self):
        authenticated_user = self.authenticated

        if not authenticated_user:
            return self.redirect('/login')

        self.render(
            'index.html',
            user=authenticated_user
        )

@renderer('council.view')
class Login(Controller):
    def get(self):
        if self.authenticated:
            return self.redirect('/')

        self.render('login.html')

@renderer('council.view')
class Mock(Controller):
    logger = get_logger('%s.Mock' % (__name__))

    def get(self):
        repository  = self.component('council.rdb')
        user        = repository.get(User, 1)
        memberships = repository.query(Membership).filter(Membership.user == user).all()

        self.render(
            'mock.html',
            current_user = user,
            memberships  = memberships
        )