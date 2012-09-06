from tornado.auth    import GoogleMixin
from tornado.web     import asynchronous, HTTPError

from tori.controller import Controller

class GoogleHandler(Controller, GoogleMixin):
    @asynchronous
    def get(self):
        if self.get_argument("openid.mode", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))
            return
        self.authenticate_redirect()

    def _on_auth(self, user):
        if not user:
            #raise HTTPError(500, "Google auth failed")
            self.redirect('/')
        # Save the user with, e.g., set_secure_cookie()

        self.session('user', user)