from tori.db.entity import entity

@entity('council_graph_project')
class Project(object):
    def __init__(self, name, leader, description='', public=False):
        self.name        = name
        self.description = description
        self.public      = public
        self.leader      = leader
