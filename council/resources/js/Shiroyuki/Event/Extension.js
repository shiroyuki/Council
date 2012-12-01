/*global document */
/**
 * Event-driven Class Extension
 *
 * This is a prototype of Passerine project.
 *
 * License: MIT License
 *
 * @copyright 2012 Juti Noppornpitak
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 */
define(
    'Shiroyuki/Event/Extension',
    [],
    function () {
        'use strict';

        var Extension = function () {};

        Extension.init = function (reference) {
            reference.__eventIdentifier = null;
        };

        $.extend(Extension.prototype, {
            Extension: function (reference) {
                reference.__eventIdentifier = null;
            },

            getIdentifier: function () {
                if (this.__eventIdentifier === null) {
                    var d = new Date();

                    this.__eventIdentifier = d.getTime();
                }

                return this.__eventIdentifier;
            },

            getFullEventKind: function (kind) {
                return [this.getIdentifier(), kind].join('.');
            },

            addEventListener: function (kind, listener, scope) {
                scope = scope || this;

                document.addEventListener(this.getFullEventKind(kind), $.proxy(listener, scope), true);
            },

            dispatchEvent: function (kind, data) {
                data = data || {};

                var e = document.createEvent('CustomEvent');

                e.initCustomEvent(this.getFullEventKind(kind), false, false, data);

                document.dispatchEvent(e);
            }
        });

        return Extension;
    }
);