/*global $, document, console */
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
    'Shiroyuki/Event/Target',
    [],
    function () {
        'use strict';

        var Target = function () {};

        Target.init = function (reference) {
            reference.eventTargetIdentifier = null;
        };

        Target.prototype.debug                 = false;
        Target.prototype.registeredIdentifiers = [];

        $.extend(Target.prototype, {
            getIdentifier: function () {
                if (this.eventTargetIdentifier === null) {
                    this.eventTargetIdentifier = (new Date()).getTime();

                    while (Target.prototype.registeredIdentifiers.indexOf(this.eventTargetIdentifier) >= 0) {
                        this.eventTargetIdentifier = (new Date()).getTime();
                    }

                    Target.prototype.registeredIdentifiers.push(this.eventTargetIdentifier);
                }

                return this.eventTargetIdentifier;
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

                var event     = document.createEvent('CustomEvent'),
                    eventName = this.getFullEventKind(kind);

                if (Target.debug) {
                    console.log(eventName);
                }

                event.initCustomEvent(eventName, false, false, data);

                document.dispatchEvent(event);

                if (kind === 'form.create.activate') {
                    //throw 'form.create.activate';
                }
            }
        });

        return Target;
    }
);