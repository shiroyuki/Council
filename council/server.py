# -*- coding: utf-8 -*-

from tori.application import Application
from tori.centre      import services
from tori.db.fixture  import Fixture

application = Application('config/app.xml')

fixture = Fixture()

fixture.set(
    'council.graph.model.Council',
    {
        'shiroyuki': {
            'name': u'シロユキスタジオー'
        },
        'symfony': {
            'name':    'Symfony',
            'tagline': 'PHP Web Framework'
        },
        'pyconjp2012': {
            'name': 'PyCon JP 2012'
        },
        'instaclick-dev': {
            'name': 'Instaclick Developers'
        }
    }
)
fixture.set(
    'council.graph.model.Membership',
    {
        'shiroyuki.shiroyuki': {
            'council':  'proxy/council.graph.model.Council/shiroyuki',
            'isActive': True,
            'user':     'proxy/council.user.model.User/shiroyuki'
        },
        'shiroyuki.symfony': {
            'council':  'proxy/council.graph.model.Council/symfony',
            'isActive': True,
            'user':     'proxy/council.user.model.User/shiroyuki'
        },
        'shiroyuki.pyconjp2012': {
            'council':  'proxy/council.graph.model.Council/pyconjp2012',
            'isActive': True,
            'user':     'proxy/council.user.model.User/shiroyuki'
        },
        'shiroyuki.instaclick-dev': {
            'council':  'proxy/council.graph.model.Council/instaclick-dev',
            'isActive': True,
            'user':     'proxy/council.user.model.User/shiroyuki'
        }
    }
)
fixture.set(
    'council.user.model.User', {
        'shiroyuki': {
            'name':  'Juti Noppornpitak',
            'email': 'jnopporn@shiroyuki.com'
        }
    }
)
fixture.set(
    'council.security.model.Credential',
    {
        'shiroyuki': {
            'login':    'shiroyuki@gmail.com',
            'user':     'proxy/council.user.model.User/shiroyuki',
            'provider': 'proxy/council.security.model.Provider/local'
        }
    }
)
fixture.set(
    'council.security.model.Provider',
    {
        'local': { 'name': 'Local' }
    }
)

fixture.load()
application.start()