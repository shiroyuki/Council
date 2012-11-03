# -*- coding: utf-8 -*-
from logging import WARNING

from tori.application import Application
from tori.common      import LoggerFactory

from council.security.model import Log
import fixtures

LoggerFactory.instance().set_default_level(WARNING)

application = Application('config/app.xml')

# Load data fixtures if necessary
fixtures.auto_load()

# Start up the service.
application.start()