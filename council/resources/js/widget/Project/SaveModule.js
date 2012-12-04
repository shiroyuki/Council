/*global define,$ */
define(
    'Widget/Project/SaveModule',
    [
        'Shiroyuki/Event/Target',
        'Shiroyuki/Async/Request'
    ],
    function (EventTarget, Request) {
        'use strict';

        var Module = function (form) {
            EventTarget.init(this);

            this.form    = form;
            this.baseUri = '/api/projects/';

            this.form.addEventListener('success', this.onFormSubmitSuccess, this);
            this.form.addEventListener('reset', this.onFormCancel, this);

            this.addEventListener('edit.prompt', this.onEditPrompt, this);
            this.addEventListener('create.prompt', this.onCreatePrompt, this);
            this.addEventListener('deactivate', this.onDeactivate, this);
        };

        $.extend(Module.prototype, EventTarget.prototype, {
            hideForm: function () {
                this.form.getElement().removeClass('visible');
            },

            showForm: function () {
                this.form.getElement().addClass('visible');
            },

            getUrl: function (id) {
                id = id || '';

                return this.baseUri + id;
            },

            onCreatePrompt: function (event) {
                this.showForm();

                this.form.setUrl(this.getUrl());
                this.form.setMethod('post');

                this.form.setData({});
            },

            onEditPrompt: function (event) {
                var request = new Request(this.getUrl(event.detail.id));

                request.setResponseType('json');
                request.addEventListener('success', this.onRetrieveSuccess, this);

                request.send();
            },

            onDeactivate: function (event) {
                this.onDeactivate
            },

            onRetrieveSuccess: function (event) {
                var entity = event.detail.response;

                this.showForm();

                this.form.setUrl(this.getUrl(entity.id));
                this.form.setMethod('put');

                this.form.setData(entity);
            },

            onFormSubmitSuccess: function (event) {
                this.hideForm();

                this.form.setUrl(this.getUrl());
                this.form.setMethod('post');

                this.dispatchEvent('save.success', event.detail);
            },

            onFormCancel: function (event) {
                this.hideForm();

                this.dispatchEvent('cancel', event.detail);
            }
        });

        return Module;
    }
);