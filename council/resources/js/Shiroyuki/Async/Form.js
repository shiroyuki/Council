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
        'jquery',
        'Shiroyuki/Event/Extension',
        'Shiroyuki/Async/Request'
    ],
    function ($, Extension, Request) {
        'use strict';

        function Form($form, isAsynchronous) {
            this.$form          = $form;
            this.isAsynchronous = isAsynchronous || true;
            this.block          = false;
            this.inputSelector  = 'input, textarea, select';

            this.$form
                .on('submit', $.proxy(this.onSubmit, this));

            this.$form
                .find('button[type="reset"]')
                .on('click', $.proxy(this.onReset, this));
        }

        $.extend(Form.prototype, Extension.prototype, {
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

            setBlock: function (block) {
                this.block = block;
            },

            onSubmit: function (event) {
                if (this.isAsynchronous) {
                    event.preventDefault();
                }

                if (this.isDisabled()) {
                    return this.dispatchEvent('disabled');
                }

                this.dispatchEvent('before', {form: this});

                if (!this.isAsynchronous) {
                    return;
                }

                if (this.block) {
                    return this.dispatchEvent('block', {form: this});
                }

                this.dispatchEvent('submit');
            },

            onReset: function (event) {
                if (this.isDisabled()) {
                    return this.dispatchEvent('disabled');
                }

                this.dispatchEvent('reset');
            }
        });

        return Form;
    }
);