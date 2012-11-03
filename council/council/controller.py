# -*- coding: utf-8 -*-
from tori.common               import get_logger
from tori.decorator.controller import renderer

from council.common.handler import Controller

@renderer('council.view')
class Home(Controller):
    def get(self):
        self.render('index.html', js_module_name='Index')