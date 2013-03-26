# -*- coding: utf-8 -*-
from logging import DEBUG, INFO, WARNING

from tori.application import Application
from tori.common      import LoggerFactory

import fixtures

LoggerFactory.instance().set_default_level(INFO)

application = Application('config/app.xml')

# Load data fixtures if necessary
fixtures.auto_load()

# Start up the service.
application.start()
