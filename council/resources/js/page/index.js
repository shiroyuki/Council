define(
    'Page/Index',
    [
        'jquery',
        'Shiroyuki/Async/Form',
        'Service/RPC'
    ],
    function ($, Form, rpc) {
        'use strict';

        var Page = function () {
            this.context = $('#r');
            this.loginForm = new Form(this.context.find('form.login'));

            this.loginForm.getElement().addClass('form-inline');
            this.loginForm.addEventListener('before', this.onLoginFormValidation);
            this.loginForm.addEventListener('submit', this.onLoginFormSubmit);

            rpc.addEventListener('open', this.onOpen);
            rpc.addEventListener('close', this.onClose);
        };

        $.extend(Page.prototype, {
            onOpen: function (event) {
                console.log('connected');
            },

            onClose: function (event) {
                console.log('disconnected');
            },

            onLoginFormValidation: function (event) {
                //console.log(event);
                console.log(event.detail.form.getData());
            },

            onLoginFormSubmit: function (event) {
                //console.log(event);
            }
        });

        return Page;
    }
);