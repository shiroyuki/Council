# -*- coding: utf-8 -*-

from tori.application import Application
from tori.centre import services

from council.security.model import Log
import fixtures

application = Application('config/app.xml')


# Load data fixtures if necessary
fixtures.auto_load()

# Start up the service.
application.start()