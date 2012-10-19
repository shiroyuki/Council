require(
    [
        'jquery'
    ],
    function ($) {
        'use strict';

        var domainAndPort = String(location.href).replace(/^http:\/\//, '').replace(/\/.*$/, ''),
            ws = new WebSocket(['ws://', domainAndPort, '/login/socket'].join(''));

        ws.onopen = function() {
           ws.send("Hello, world");
        };
        ws.onmessage = function (evt) {
           alert(evt.data);
        };
    }
);