/*global define */
define(
    'Page/Login',
    [
        'jquery',
        'Shiroyuki/Event/Distributor',
        'Shiroyuki/Event/Target'
    ],
    function ($, Distributor, EventTarget) {
        'use strict';
        var Page = function ($context) {
            Distributor.init(this);

            EventTarget.debug = false;
        };

        $.extend(Page.prototype, Distributor.prototype);

        return Page;
    }
);