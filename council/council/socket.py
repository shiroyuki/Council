from tornado.websocket import WebSocketHandler

# Should be in the security bundle
class Authentication(WebSocketHandler):
    def on_message(self, message):
        self.write_message(u'OK')