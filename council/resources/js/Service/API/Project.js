/*global define,$ */
define(
    'Service/API/Project',
    ['Shiroyuki/Async/RestAPI'],
    function (RestAPI) {
        'use strict';

        return new RestAPI('/api/projects/');
    }
);