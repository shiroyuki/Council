/*global define */
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
    'Shiroyuki/Event/Distributor',
    ['jquery'],
    function ($) {
        'use strict';

        var Distributor = function () {};

        Distributor.init = function (reference) {
            reference.lastSource    = null;
            reference.lastEventType = null;
        };

        $.extend(Distributor.prototype, {
            relayWhen: function (source, sourceEventType, destination, destinationEventType) {
                if (typeof source === 'string') {
                    source = this[source] || null;
                }

                this.lastSource    = source;
                this.lastEventType = sourceEventType;

                return this.then(destination, destinationEventType);
            },

            then: function (destination, destinationEventType) {
                if (typeof destination === 'string') {
                    destination = this[destination] || null;
                }

                if (!this.lastSource || !destination) {
                    return;
                }

                function callback(event) {
                    destination.dispatchEvent(destinationEventType, event.detail);
                }

                this.lastSource.addEventListener(this.lastEventType, callback, this);

                return this;
            }
        });

        return Distributor;
    }
);