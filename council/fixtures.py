# -*- coding: utf-8 -*-

from tori.centre      import services
from tori.db.fixture  import Fixture

def auto_load():
    repository = services.get('council.rdb')
    fixture    = Fixture(repository)

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

def auto_load_mongodb():
    dataset = {
        'council.collection.security.Provider': {
            #'local': { '_id': 1, 'name': 'Local' },
            'google': { '_id': 2, 'name': 'Google' }
        }
    }

    for service_id in dataset:
        repository = services.get(service_id)
        ''' :type repository: tori.db.odm.collection.Collection '''

        for alias in dataset[service_id]:
            criteria = dataset[service_id][alias]

            entity = repository.filter_one(**criteria)

            if not entity:
                entity = repository.new_document(**criteria)

                repository.post(entity)

            pass
