/**
 * Asynchronous Form
 *
 * This is a prototype of Passerine project.
 *
 * License: MIT License
 *
 * @copyright 2012 Juti Noppornpitak
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 * @extends Shiroyuki/Event/Extension
 */
define(
    'Shiroyuki/Async/Form',
    [
        'Shiroyuki/Event/Extension',
        'Shiroyuki/Async/Request'
    ],
    function (Extension, Request) {
        'use strict';

        var Form = function ($form, isAsynchronous) {
            Extension.init(this);

            this.$form          = $form;
            this.isAsynchronous = isAsynchronous || true;
            this.inputSelector  = 'input, textarea, select';

            this.$form
                .on('submit', $.proxy(this.onSubmit, this));

            this.$form
                .find('button[type="reset"]')
                .on('click', $.proxy(this.onReset, this));
        };

        $.extend(Form.prototype, Extension.prototype, {
            getMethod: function () {
                return this.$form.attr('method');
            },

            setMethod: function (method) {
                this.$form.attr('method', method);

                return this;
            },

            setUrl: function (url) {
                this.$form.attr('action', url);

                return this;
            },

            getElement: function () {
                return this.$form;
            },

            getData: function () {
                var inputList = this.$form.find(this.inputSelector),
                    //dataKeyValuePairList = [], // it is a 2D array to allow multiple data on a single key (array parameter)
                    dataMap = {},
                    inputElement;

                inputList.each(function (index) {
                    inputElement = $(this);

                    dataMap[inputElement.attr('name')] = inputElement.val();
                });

                return dataMap;
            },

            isDisabled: function () {
                var disabled = this.$form.attr('disabled') || false;

                return disabled
                    && [true, 'disabled'].indexOf(disabled) >= 0;
            },

            onSubmit: function (event) {
                var request,
                    userData = {
                    preventDefault: false,
                    form: this
                };

                if (this.isDisabled()) {
                    return this.dispatchEvent('disable', this);
                }

                this.dispatchEvent('submit', userData);

                if (this.isAsynchronous) {
                    event.preventDefault();
                }

                if (userData.preventDefault) {
                    return;
                }

                request = new Request(this.$form.attr('action'), this.$form.attr('method'), this.getData());

                request.addEventListener('success', this.onSuccess, this);
                request.addEventListener('error', this.onError, this);
                request.addEventListener('done', this.onDone, this);

                request.send();
            },

            onSuccess: function (event) {
                this.dispatchEvent('success', event.detail);
            },

            onError: function (event) {
                this.dispatchEvent('error', event.detail);
            },

            onDone: function (event) {
                this.dispatchEvent('done', {});
            },

            onReset: function (event) {
                if (this.isDisabled()) {
                    return this.dispatchEvent('disable', this);
                }

                this.dispatchEvent('reset', this);
            }
        });

        return Form;
    }
);