/*global define, $ */
define(
    'UI/Control',
    ['Shiroyuki/Event/Target'],
    function (EventTarget) {
        'use strict';

        var Control = function ($context) {
            EventTarget.init(this);

            this.context           = $context;
            this.createFormTrigger = this.context.find('.form-trigger.new');

            this.createFormTrigger.on('click', $.proxy(this.onCreateFormTrigger, this));

            this.addEventListener('main.trigger.create.activate', this.onMainCreateButtonActivate, this);
            this.addEventListener('main.trigger.create.deactivate', this.onMainCreateButtonDeactivate, this);
        };

        $.extend(Control.prototype, EventTarget.prototype, {
            setMainButtonActivation: function ($target, active) {
                var $anchorContainer = $target.parent(),
                    methodName       = active ? 'addClass' : 'removeClass';

                if (active === undefined) {
                    methodName = 'toggleClass';
                }

                $anchorContainer[methodName]('active');
            },

            onMainCreateButtonActivate: function (event) {
                this.setMainButtonActivation(this.createFormTrigger, true);
            },

            onMainCreateButtonDeactivate: function (event) {
                this.setMainButtonActivation(this.createFormTrigger, false);
            },

            onCreateFormTrigger: function (event) {
                var $anchor = $(event.currentTarget);

                event.preventDefault();

                this.setMainButtonActivation($anchor);

                this.dispatchEvent('form.create.' + ($anchor.parent().hasClass('active') ? 'activate' : 'deactivate'));
            }
        });

        return Control;
    }
);