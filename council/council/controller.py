# -*- coding: utf-8 -*-
from tori.decorator.controller import renderer
from council.common.handler import Controller

@renderer('council.view')
class Home(Controller):
    def get(self):
        if not self.authenticated:
            return self.redirect('/login')

        self.render('index.html', js_module_name='Index')

@renderer('council.view')
class Login(Controller):
    def get(self):
        if self.authenticated:
            return self.redirect('/')

        self.render('login.html', js_module_name='Login')