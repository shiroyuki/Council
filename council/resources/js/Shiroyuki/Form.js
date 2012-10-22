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
    'Shiroyuki/Form',
    ['jquery', 'Shiroyuki/Event/Extension'],
    function ($, Extension) {
        'use strict';

        function Form($form, preventDefault) {
            'use strict';

            this.$form = $form;

            this.$form
                .on('submit', $.proxy(this.onSubmit, this));

            this.$form
                .find('button[type="reset"]')
                .on('click', $.proxy(this.onReset, this));

            //this.$form.find('input[type="te, select, textarea')
        }

        $.extend(Form.prototype, Extension.prototype, {
            getElement: function () {
                return this.$form;
            },
            isDisabled: function () {
                return this.$form.attr('disabled') !== undefined;
            },
            onSubmit: function (event) {
                event.preventDefault();

                if (this.isDisabled()) {
                    return;
                }

                self.dispatchEvent('submit.before', eventData);
                self.dispatchEvent('submit.execute', eventData);
                self.dispatchEvent('submit.done', eventData);
            },
            onReset: function (event) {
                if (this.isDisabled()) {
                    return;
                }

                self.dispatchEvent('reset', eventData);
            }
        });

        return Form;
    }
);