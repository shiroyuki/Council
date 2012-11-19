# -*- coding: utf-8 -*-
from tori.decorator.controller import renderer

from council.common.handler import Controller
from council.security.service import AccessPass

@renderer('council.view')
class Home(Controller):
    def get(self):
        user = self.authenticated

        print AccessPass(name=user['name'], email=user['email'])

        self.render('index.html', js_module_name='Index')