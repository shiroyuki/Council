define(
    'Shiroyuki/Sync/Socket',
    [
        'jquery',
        'Shiroyuki/Event/Extension'
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
                 * @type integer
                 */
                reconnectionMaxAttempts: 10,
                /**
                 * The delay between the failed reconnection and the new one
                 * described in miliseconds.
                 *
                 * @type integer
                 */
                reconnectionDelay: 1000
            },
            init: function (endpoint, options) {
                this.options = options || {};

                $.each(this.defaultOptions, function (name, defaultValue) {
                    if (this.options.hasOwnProperty(name)) {
                        this.options[name] = options[name] || defaultValue;
                    }
                });

                this.connected = false;
                this.endpoint  = endpoint;
                this.socket    = this.connect();

                this.socket.addEventListener('open', $.proxy(this.onOpen, this));
                this.socket.addEventListener('message', $.proxy(this.onMessage, this));
                this.socket.addEventListener('close', $.proxy(this.onClose, this));
            },

            connect: function () {
                this.socket = new WebSocket(endpoint);
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
                this.socket.send(message)
            }
        });

        return Socket;
    }
);