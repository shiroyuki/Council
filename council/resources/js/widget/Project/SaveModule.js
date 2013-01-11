/*global define,$ */
define(
    'Widget/Project/SaveModule',
    [
        'Shiroyuki/Event/Target',
        'Shiroyuki/Async/Request',
        'Service/API/Project'
    ],
    function (EventTarget, Request, ProjectRepository) {
        'use strict';

        var Module = function (form) {
            EventTarget.init(this);

            this.form = form;

            this.form.addEventListener('success', this.onFormSubmitSuccess, this);
            this.form.addEventListener('reset', this.onFormCancel, this);

            ProjectRepository.addEventListener('get.success', this.onRetrieveSuccess, this);

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

                return ProjectRepository.getBaseUrl() + id;
            },

            onCreatePrompt: function (event) {
                this.showForm();

                this.form.setUrl(this.getUrl());
                this.form.setMethod('post');

                this.form.setData({});
            },

            onEditPrompt: function (event) {
                ProjectRepository.get(event.detail.id);
            },

            onDeactivate: function (event) {
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