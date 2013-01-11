/*global define,$ */
define(
    'Shiroyuki/Async/RestAPI',
    [
        'Shiroyuki/Async/Request',
        'Shiroyuki/Event/Target'
    ],
    function (Request, EventTarget) {
        'use strict';

        var RestController = function (baseUrl) {
            EventTarget.init(this);

            this.getBaseUrl = function () {
                return baseUrl;
            };

            this.setBaseUrl = function (baseUrl) {
                baseUrl = baseUrl + (baseUrl.match(/\/$/) ? '' : '/');
            };
        };

        $.extend(RestController.prototype, EventTarget.prototype, {
            remove: function (id) {
                this.makeRequest('delete', id)
                    .send();
            },

            get: function (id) {
                this.makeRequest('get', id)
                    .send();
            },

            filter: function (criteria) {
                this.makeRequest('get', null, criteria || {}, 'filter')
                    .send();
            },

            post: function (data) {
                this.makeRequest('post', null, data)
                    .send();
            },

            put: function (id, data) {
                this.makeRequest('put', id, data)
                    .send();
            },

            makeRequest: function (method, id, data, eventPrefix) {
                id = id || '';
                eventPrefix = (eventPrefix || method).toLowerCase();

                var self = this,
                    request = new Request(this.getBaseUrl() + id, method, data);

                function onSuccess(event) {
                    self.dispatchEvent(eventPrefix + '.success', event.detail);
                }

                function onError(event) {
                    self.dispatchEvent(eventPrefix + '.error', event.detail);
                }

                request.setResponseType('json');

                request.addEventListener('success', onSuccess, this);
                request.addEventListener('error', onError, this);

                return request;
            }
        });

        return RestController;
    }
);