import json

from tornado.web import HTTPError

from council.common.handler import RestController
from council.graph.document import Project

class ProjectController(RestController):
    __collection = None

    @property
    def collection(self):
        '''
        Project Collection

        :rtype: tori.db.odm.collection.Collection
        '''
        if not self.__collection:
            self.__collection = collection = self.component('council.collection.security.Project')

        return self.__collection

    def create(self):
        raw_data = {'name': self.get_argument('name')}

        try:
            raw_data['description'] = self.get_argument('description')
        except HTTPError:
            pass

        project = Project(**raw_data)

        self.collection.post(project)

    def list(self):
        projects = []

        for project in self.collection.filter():
            projects.append(project.to_dict())

        self.set_header('content-type', 'application/json')
        self.write(json.dumps(projects))
