define(
    'Shiroyuki/Event/Extension',
    ['jquery'],
    function ($) {
        'use strict';

        function EventControl() {}

        $.extend(EventControl.prototype, {
            identifier: null,
            getIdentifier: function () {
                if (this.identifier === null) {
                    var d = new Date();

                    this.identifier = d.getTime();
                }

                return this.identifier;
            },
            getFullEventKind: function (kind) {
                return [this.getIdentifier(), kind].join('.');
            },
            addEventListener: function (kind, listener) {
                document.addEventListener(this.getFullEventKind(kind), listener);
            },
            dispatchEvent: function (kind, eventTarget, data) {
                data = data || {};

                data.eventTarget = eventTarget;

                var e = document.createEvent('CustomEvent');
                e.initCustomEvent(this.getFullEventKind(kind), false, true, data);

                document.dispatchEvent(e);
            }
        });

        return EventControl;
    }
);