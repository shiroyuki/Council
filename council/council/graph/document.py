from tori.db.document import document

@document('graph_project')
class Project(object):
    def __init__(self, name, leader, description='', public=False, _id=None):
        self._id         = _id
        self.name        = name
        self.description = description
        self.public      = public
        self.leader      = leader
