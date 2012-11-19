from council.common.handler import WSRPCInterface

# Should be in the security bundle
class ServiceAPI(WSRPCInterface):
    def open(self):
        self.broadcast(u'Someone just joined in!')

    def message(self, message):
        return message

    def _on_close(self):
        self.broadcast(u'Someone just exited!')