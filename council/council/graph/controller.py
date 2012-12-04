import json

from tornado.web import HTTPError

from tori.data.converter import ArrayConverter

from council.common.handler import RestController
from council.graph.document import Project

class ProjectController(RestController):
    __collection     = None
    __data_converter = None

    @property
    def collection(self):
        '''Project Collection

        :rtype: tori.db.odm.collection.Collection
        '''
        if not self.__collection:
            self.__collection = collection = self.component('council.collection.security.Project')

        return self.__collection

    @property
    def data_converter(self):
        '''Data-to-array Converter

        :rtype: tori.data.converter.ArrayConverter
        '''
        if not self.__data_converter:
            self.__data_converter = ArrayConverter()
            self.__data_converter.set_max_depth(10)

        return self.__data_converter

    def get_data(self):
        raw_data = {
            'name': self.get_argument('name')
        }

        try:
            raw_data['description'] = self.get_argument('description')
        except HTTPError:
            pass

        try:
            raw_data['public'] = int(self.get_argument('public'))
        except HTTPError:
            raw_data['public'] = 0

        return raw_data

    def respond_with_entity(self, entity):
        self.set_header('content-type', 'application/json')
        self.write(self.data_converter.convert(entity))

    def retrieve(self, id):
        project = self.collection.get(id)

        if not project:
            self.set_status(404)
            return

        self.respond_with_entity(project)

    def create(self):
        raw_data = self.get_data()

        raw_data['leader'] = self.authenticated.id

        if self.collection.filter_one(name = raw_data['name']):
            self.set_status(403)
            return

        project = Project(**raw_data)

        self.collection.post(project)

        self.respond_with_entity(project)

    def list(self):
        projects = []

        for project in self.collection.filter():
            projects.append(self.data_converter.convert(project))

        self.set_header('content-type', 'application/json')
        self.write(json.dumps(projects))

    def update(self, id):
        raw_data = self.get_data()

        project = self.collection.get(id)

        if not project:
            self.set_status(404)
            return

        for key in raw_data:
            project.__setattr__(key, raw_data[key])

        print(project.to_dict())

        self.collection.put(project)

        self.respond_with_entity(project)

    def remove(self, id):
        project = self.collection.get(id)

        if not project:
            self.set_status(404)
            return

        self.collection.delete(project.id)

        self.respond_with_entity(project)
