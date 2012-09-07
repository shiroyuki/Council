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

        function FormEvent(form, originalEvent) {
            'use strict';

            this.form     = form;
            this.original = originalEvent;
        }

        $.extend(FormEvent.prototype, {
            form:     null,
            original: null
        });

        function Form($form, preventDefault) {
            'use strict';

            preventDefault = preventDefault || true;

            var self = this,
                eventOrigin,
                handlers = {
                    onSubmit: function (event) {
                        if (preventDefault) {
                            event.preventDefault();
                        }

                        var eventData = new FormEvent(self, event);

                        self.dispatchEvent('submit.before', this, eventData);
                        self.dispatchEvent('submit.execute', this, eventData);
                        self.dispatchEvent('submit.done', this, eventData);
                    },
                    onChange: function (event) {
                        event.preventDefault();

                        var eventData = new FormEvent(self, event);

                        self.dispatchEvent('change', this, eventData);
                    },
                    onReset: function (event) {
                        if ($(this).attr('disabled') !== undefined) {
                            return;
                        }

                        var eventData = new FormEvent(self, event);

                        self.dispatchEvent('reset', this, eventData);
                        setTimeout(function () {
                            self.dispatchEvent('change', this, eventData);
                        }, 100);
                    }
                };

            this.$form = $form;

            this.$form
                .on('submit', handlers.onSubmit);

            this.$form
                .find('input[type="text"], input[type="password"], textarea')
                .on('keyup', handlers.onChange);

            this.$form
                .find('select')
                .on('change', handlers.onChange);

            this.$form
                .find('button[type="reset"]')
                .on('click', handlers.onReset);

            //this.$form.find('input[type="te, select, textarea')
        }

        $.extend(Form.prototype, Extension.prototype, {
            getElement: function () {
                return this.$form;
            }
        });

        return Form;
    }
);