require(
    [
        'jquery',
        'Shiroyuki/Async/WSRPC'
    ],
    function ($, RPC) {
        'use strict';

        var domainAndPort = String(location.href).replace(/^http:\/\//, '').replace(/\/.*$/, ''),
            ws = new RPC(['ws://', domainAndPort, '/login/socket'].join(''));

        ws.addEventListener('open', $.proxy(function() { this.call(null, 'message', {message: 'connection established'}); }, ws));
        ws.addEventListener('response', function(event) { console.log(event.detail.result); });
    }
);