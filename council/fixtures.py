# -*- coding: utf-8 -*-

from tori.centre     import services
from tori.db.fixture import Fixture
from council.security.entity import Provider

def auto_load():
    dataset = [
        (
            Provider,
            {
                'dev': { '_id': 1, 'name': 'Dev' },
                'google': { '_id': 2, 'name': 'Google' }
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