define(
    'Service/RPC',
    ['Shiroyuki/Sync/WSRPC'],
    function (WSRPC) {
        return new WSRPC('/socket/service');
    }
);