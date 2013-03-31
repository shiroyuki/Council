# -*- coding: utf-8 -*-
from tori.decorator.controller import renderer
from council.common.handler import Controller
from fixtures import auto_load as load_fixtures

@renderer('council.view')
class UI(Controller):
    def get(self):
        self.render('page/admin/developer/ui.html')

class Reset(Controller):
    def get(self):
        session = self.open_session()

        for collection_name in session.db.collection_names():
            session.db[collection_name].remove()

        load_fixtures()

        self.redirect('/admin/developer')