define(
    'Shiroyuki/Async/Socket',
    [
        'jquery',
        'Shiroyuki/Event/Extension'
    ],
    function ($, Extension) {
        'use strict';

        var Socket = function (endpoint) {
            this.init(endpoint);
        };

        $.extend(Socket.prototype, Extension.prototype, {
            init: function (endpoint) {
                this.endpoint = endpoint;
                this.socket   = new WebSocket(endpoint);

                this.socket.addEventListener('open', $.proxy(this.onOpen, this));
                this.socket.addEventListener('message', $.proxy(this.onMessage, this));
                this.socket.addEventListener('close', $.proxy(this.onClose, this));
            },

            onOpen: function (event) {
                this.dispatchEvent('open');
            },

            onMessage: function (event) {
                this.dispatchEvent('message', event.data);
            },

            onClose: function (event) {
                this.dispatchEvent('close');
            },

            send: function (message) {
                this.socket.send(message)
            }
        });

        return Socket;
    }
);