# -*- coding: utf-8 -*-

from tori.centre     import services
from tori.db.fixture import Fixture
from council.security.entity import Provider, Role

def auto_load():
    dataset = [
        (
            Role,
            {
                'admin': { 'name': 'Administrator', 'alias': 'admin' },
                'user': { 'name': 'User', 'alias': 'user' }
            }
        ),
        (
            Provider,
            {
                'dev': { 'name': 'Developer Mode', 'alias': 'dev' },
                'google': { 'name': 'Google', 'alias': 'google' }
            }
        )
    ]

    manager = services.get('entity_manager')
    session = manager.open_session(supervised=False)

    for entity_class, fixtures in dataset:
        repository = session.collection(entity_class)

        for alias in fixtures:
            criteria = fixtures[alias]
            entity   = repository.filter_one(criteria)

            if entity:
                continue

            entity = repository.new(**criteria)

            repository.post(entity)
        # endfor
    # endfor