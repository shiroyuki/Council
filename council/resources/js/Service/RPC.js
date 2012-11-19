/*global location:true */
define(
    'Service/RPC',
    ['Shiroyuki/Sync/WSRPC'],
    function (WSRPC) {
        'use strict';

        var domainAndPort = String(location.href).replace(/^http:\/\//, '').replace(/\/[\w\d]*$/, '');

        return new WSRPC(['ws://', domainAndPort, '/socket/service'].join(''));
    }
);