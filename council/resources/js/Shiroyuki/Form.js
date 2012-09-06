define(
    'Shiroyuki/Form',
    ['jquery', 'Shiroyuki/Event/Extension'],
    function ($, Extension) {
        'use strict';
        function Form($form, alwaysDelegate, preventDefault) {
            alwaysDelegate = alwaysDelegate || false;
            preventDefault = preventDefault || true;

            var self = this, eventOrigin;

            function onSubmit(event) {
                if (preventDefault) {
                    event.preventDefault();
                }

                var eventData = { container: self.getElement(), original: event };

                self.dispatchEvent('submit.before', this, eventData);
                self.dispatchEvent('submit.execute', this, eventData);
                self.dispatchEvent('submit.done', this, eventData);
            }

            function onChange(event) {
                var eventData = { container: self.getElement(), original: event };

                self.dispatchEvent('change', this, eventData);
            }

            this.$form = $form;

            if (alwaysDelegate) {
                eventOrigin = this.$form.parent();

                eventOrigin.on('submit', 'form', onSubmit);
                eventOrigin.on('keyup', 'form input[type="text"], form input[type="password"], form textarea', onChange);
                eventOrigin.on('change', 'form input:not([type="text"], input[type="password"]), form select', onChange);
            } else {
                this.$form.on('submit', onSubmit);
                this.$form.find('input[type="text"], input[type="password"], textarea').on('keyup', onChange);
                this.$form.find('input:not([type="text"], input[type="password"]), select, textarea').on('change', onChange);
            }
        }

        $.extend(Form.prototype, Extension.prototype, {
            getElement: function () {
                return this.$form;
            }
        });

        return Form;
    }
);