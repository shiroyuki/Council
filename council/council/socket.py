from tori.socket.rpc import Interface

# Should be in the security bundle
class Authentication(Interface):
    def open(self):
        self.broadcast(u'Someone just joined in!')

    def message(self, message):
        return message

    def close(self):
        self.broadcast(u'Someone just exited!')