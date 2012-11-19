define(
    'Shiroyuki/Async/Request',
    [
        'jquery',
        'Shiroyuki/Event/Extension'
    ],
    function ($, EventExtension) {
        'use strict';

        var Request = function (url) {
            this.url    = url;
            this.data   = null;
            this.method = 'GET';
        };

        $.extend(Request.prototype, EventExtension.prototype, {
            setMethod: function (method) {
                this.method = method.toUpperCase();
            },

            setUrl: function (url) {
                this.url = url;
            },

            setData: function (data) {
                this.data = data;
            },

            send: function (params) {
                this.dispatch(
                    'sending',
                    {
                        data:   this.data,
                        method: this.method
                    }
                );

                $.ajax(this.url, {
                    data:    this.data,
                    success: $.proxy(this.onSuccessfulRequest, this),
                    error:   $.proxy(this.onFailedRequest, this),
                    type:    this.method
                });

                this.dispatch(
                    'sent',
                    {
                        data:   this.data,
                        method: this.method
                    }
                );
            },

            onSuccessfulRequest: function (response, textStatus, jqXHR) {
                this.dispatchEvent(
                    'success',
                    {
                        jqXHR:      jqXHR,
                        response:   response,
                        textStatus: textStatus
                    }
                );

                this.dispatchEvent('done');
            },

            onFailedRequest: function (jqXHR, errorThrown, exception) {
                this.dispatchEvent(
                    'error',
                    {
                        jqXHR:       jqXHR,
                        errorThrown: errorThrown,
                        exception:   exception
                    }
                );

                this.dispatchEvent('done');
            }
        });

        return Request;
    }
);