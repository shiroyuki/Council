import json
from tornado.web import HTTPError
from tori.db.common import Serializer
from council.common.handler import RestController
from council.graph.document import Project

class ProjectController(RestController):
    def __init__(self, *args, **kwargs):
        RestController.__init__(self, *args, **kwargs)
        self.__collection     = None
        self.__data_converter = None

    @property
    def collection(self):
        ''' Project Collection

            :rtype: tori.db.odm.collection.Collection
        '''
        if not self.__collection:
            session = self.open_session()

            self.__collection = session.collection(Project)

        return self.__collection

    @property
    def data_converter(self):
        ''' Data-to-array Converter

            :rtype: tori.data.serializer.ArraySerializer
        '''
        if not self.__data_converter:
            self.__data_converter = Serializer()

        return self.__data_converter

    def get_data(self):
        raw_data = {
            'name': self.get_argument('name')
        }

        raw_data['description'] = self.get_argument('description', convert_object_id_to_str=None)
        raw_data['public']      = int(self.get_argument('public', 0))

        return raw_data

    def respond_with_entity(self, entity):
        self.set_header('content-type', 'application/json')
        self.write(self.data_converter.encode(entity, convert_object_id_to_str=True))

    def retrieve(self, id):
        project = self.collection.get(id)

        if not project:
            self.set_status(404)
            return

        self.respond_with_entity(project)

    def create(self):
        data = self.get_request_data()

        data['leader'] = self.authenticated.id

        if self.collection.filter_one({'name': data['name'], 'leader': data['leader']}):
            raise HTTPError(403)

        project = self.collection.new(**data)

        self.collection.post(project)

        self.respond_with_entity(project)

    def list(self):
        projects = []

        for project in self.collection.filter():
            projects.append(self.data_converter.encode(project, convert_object_id_to_str=True))

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

        self.collection.put(project)

        self.respond_with_entity(project)

    def remove(self, id):
        project = self.collection.get(id)

        if not project:
            self.set_status(404)
            return

        self.collection.delete(project.id)

        self.respond_with_entity(project)
