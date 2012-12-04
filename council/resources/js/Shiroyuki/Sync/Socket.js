/*global define:true, WebSocket:true */
define(
    'Shiroyuki/Sync/Socket',
    [
        'jquery',
        'Shiroyuki/Event/Target'
    ],
    function ($, Extension) {
        'use strict';

        var Socket = function (endpoint, options) {
            this.init(endpoint, options);
        };

        $.extend(Socket.prototype, Extension.prototype, {
            defaultOptions: {
                /**
                 * The flag to tell the socket to reconnect when the connection is closed.
                 *
                 * @type boolean
                 */
                reconnectionEnabled: true,
                /**
                 * The number of attempts to reconnect back to the server before
                 * giving up the socket.
                 *
                 * If the limit is set to zero (0),
                 *
                 * @type int
                 */
                reconnectionMaxAttempts: 10,
                /**
                 * The delay between the failed reconnection and the new one
                 * described in milliseconds.
                 *
                 * @type int
                 */
                reconnectionDelay: 1000
            },
            init: function (endpoint, options) {
                var self = this;
                this.options = options || {};

                $.each(this.defaultOptions, function (name, defaultValue) {
                    if (self.options.hasOwnProperty(name)) {
                        self.options[name] = options[name] || defaultValue;
                    }
                });

                this.connected = false;
                this.endpoint  = endpoint;

                this.connect();

                this.socket.addEventListener('open', $.proxy(this.onOpen, this));
                this.socket.addEventListener('message', $.proxy(this.onMessage, this));
                this.socket.addEventListener('close', $.proxy(this.onClose, this));
            },

            connect: function () {
                this.socket = new WebSocket(this.endpoint);
            },

            onOpen: function (event) {
                this.connected = true;

                this.dispatchEvent('open');
            },

            onMessage: function (event) {
                this.dispatchEvent('message', event.data);
            },

            onClose: function (event) {
                this.connected = false;

                this.dispatchEvent('close');
            },

            send: function (message) {
                this.socket.send(message);
            }
        });

        return Socket;
    }
);