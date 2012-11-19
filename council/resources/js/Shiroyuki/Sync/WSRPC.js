/*global define:true */
/**
 * Web Socket Remote Procedure Call for Tori Framework 2.x
 */
define(
    'Shiroyuki/Sync/WSRPC',
    [
        'jquery', 'Shiroyuki/Sync/Socket'
    ],
    function ($, Socket) {
        'use strict';

        var WSRPC = function (endpoint) {
            this.init(endpoint);
            this.uid = 0;
        };

        $.extend(WSRPC.prototype, Socket.prototype, {
            composeCommand: function (method, data, service) {
                service = service || null;

                var returnee = {
                    id:      ++this.uid,
                    method:  method,
                    data:    data,
                    service: service
                };

                return returnee;
            },

            broadcast: function (message, scopes) {
                scopes = scopes || [];

                this.call(
                    null,
                    'broadcast',
                    {
                        message: message,
                        scopes:  scopes
                    }
                );
            },

            call: function (service, method, data) {
                this.send(JSON.stringify(this.composeCommand(
                    method, data, service
                )));
            },

            /**
             * Override the event handler
             */
            onMessage: function (event) {
                var userData,
                    kind = 'response';

                try {
                    userData = JSON.parse(event.data);
                } catch (exception) {
                    userData = {
                        exception: exception,
                        original:  event.data
                    };

                    kind = 'error';
                }

                this.dispatchEvent(kind, userData);
            },
        });

        return WSRPC;
    }
);