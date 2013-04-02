/*global $, define */
/**
 * Asynchronous Form
 *
 * This is a prototype of Passerine project.
 *
 * License: MIT License
 *
 * @copyright 2012 Juti Noppornpitak
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 * @extends Shiroyuki/Event/Target
 */
define(
    'Shiroyuki/Async/Form',
    [
        'Shiroyuki/Event/Target',
        'Shiroyuki/Async/Request'
    ],
    function (EventTarget, Request) {
        'use strict';

        var Form = function ($form, options) {
            EventTarget.init(this);

            this.$form = $form;
            
            this.inputSelector = 'input, textarea, select';
            this.contentType   = this.$form.attr('enctype') || null;

            this.options = options || {isAsynchronous: true, autoDisable: true};
            
            if (options !== undefined) {
                this.options.isAsynchronous = options.isAsynchronous || true;
                this.options.autoDisable    = options.autoDisable || true;
            }

            this.$form
                .on('submit', $.proxy(this.onSubmit, this));

            this.$form
                .find('button[type="reset"]')
                .on('click', $.proxy(this.onReset, this));
        };

        $.extend(Form.prototype, EventTarget.prototype, {
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
                var $inputList = this.$form.find(this.inputSelector),
                    dataMap   = {},
                    $input,
                    value;

                $inputList.each(function (index) {
                    $input = $(this);

                    value = $input.val();

                    if ($input.is(':checkbox') && !$input.is(':checked')) {
                        value = null;
                    }

                    dataMap[$input.attr('name')] = value;
                });

                return dataMap;
            },

            setData: function (dataMap) {
                var $inputList = this.$form.find(this.inputSelector),
                    $input,
                    inputName,
                    value;

                $inputList.each(function (index) {
                    $input    = $(this);
                    inputName = $input.attr('name');

                    if (!dataMap.hasOwnProperty(inputName)) {
                        return true;
                    }

                    value = dataMap[inputName];

                    if ($input.is(':checkbox')) {
                        value = Array.isArray(value) ? value : [value];
                    }

                    $input.val(value);

                    return true;
                });
            },

            enable: function () {
                var $inputList = this.$form.find(this.inputSelector),
                    $input;

                $inputList.each(function (index) {
                    $input = $(this);
                    $input.attr('disabled', false);
                });
            },

            disable: function () {
                var $inputList = this.$form.find(this.inputSelector),
                    $input;

                $inputList.each(function (index) {
                    $input = $(this);
                    $input.attr('disabled', true);
                });
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

                if (this.options.isAsynchronous) {
                    event.preventDefault();
                }

                if (userData.preventDefault) {
                    return;
                }

                request = new Request(
                    this.$form.attr('action'),
                    this.$form.attr('method'),
                    this.getData(),
                    this.contentType
                );

                request.addEventListener('success', this.onSuccess, this);
                request.addEventListener('error', this.onError, this);
                request.addEventListener('done', this.onDone, this);

                if (this.options.autoDisable) {
                    this.disable();
                }

                request.send();
            },

            onSuccess: function (event) {
                this.dispatchEvent('success', event.detail);
            },

            onError: function (event) {
                this.dispatchEvent('error', event.detail);
            },

            onDone: function (event) {
                this.enable();
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