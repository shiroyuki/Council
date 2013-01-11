# -*- coding: utf-8 -*-
from logging import WARNING

from tori.application import Application
from tori.common      import LoggerFactory

import fixtures

LoggerFactory.instance().set_default_level(WARNING)

application = Application('config/app.xml')

# Load data fixtures if necessary
#fixtures.auto_load()
fixtures.auto_load_mongodb()

# Start up the service.
application.start()
