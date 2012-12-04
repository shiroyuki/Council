define(
    'Shiroyuki/Async/Request',
    [
        'Shiroyuki/Event/Target'
    ],
    function (Extension) {
        'use strict';

        var Request = function (url, method, data) {
            Extension.init(this);

            this.url    = url;
            this.data   = data || {};
            this.method = method || 'GET';
            this.responseType = null;
        };

        $.extend(Request.prototype, Extension.prototype, {
            setMethod: function (method) {
                this.method = method.toUpperCase();
            },

            setUrl: function (url) {
                this.url = url;
            },

            setData: function (data) {
                this.data = data;
            },

            setResponseType: function (responseType) {
                this.responseType = responseType;
            },

            send: function (params) {
                var self = this,
                    params = {
                        url:    this.url,
                        data:   this.data,
                        method: this.method
                    };

                this.dispatchEvent('sending', params);

                $.ajax({
                    url:      this.url,
                    data:     this.data,
                    success:  $.proxy(this.onSuccessfulRequest, this),
                    error:    $.proxy(this.onFailedRequest, this),
                    type:     this.method,
                    dataType: this.responseType,
                    headers:  {
                        'Cache-Control': 'no-cache',
                        'If-None-Match': 'no-cache'
                    }
                });

                this.dispatchEvent('sent', params);
            },

            onSuccessfulRequest: function (response, textStatus, jqXHR) {
                this.dispatchEvent('done', this);

                this.dispatchEvent(
                    'success',
                    {
                        jqXHR:      jqXHR,
                        response:   response,
                        textStatus: textStatus
                    }
                );
            },

            onFailedRequest: function (jqXHR, errorThrown, exception) {
                this.dispatchEvent('done', this);

                this.dispatchEvent(
                    'error',
                    {
                        jqXHR:       jqXHR,
                        errorThrown: errorThrown,
                        exception:   exception
                    }
                );
            }
        });

        return Request;
    }
);