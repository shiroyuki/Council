# -*- coding: utf-8 -*-

from tori.centre      import services
from tori.db.fixture  import Fixture

def auto_load():
    repository = services.get('council.rdb')
    fixture    = Fixture(repository)

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
            'local': { 'id': 1, 'name': 'Local' },
            'google': { 'id': 2, 'name': 'Google' }
        }
    )

    try:
        if repository.reflect():
            fixture.load()
    except:
        pass