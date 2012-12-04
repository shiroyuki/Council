define(
    'UI/Core',
    [
        'Shiroyuki/Event/Target',
        'Shiroyuki/Async/Form'
    ],
    function (
        EventTarget,
        Form
    ) {
        'use strict';

        var Core = function ($context) {
            EventTarget.init(this);

            var i, l, levelName, $form, form;

            this.context = $context;
            this.forms   = {};

            for (i = 0, l = this.levels.length; i < l; i++) {
                levelName = this.levels[i];
                $form     = this.context.find('form.form.' + levelName);

                if ($form.length) {
                    form = new Form($form);

                    this.forms[levelName] = form;
                }
            }

            this.addEventListener('form.create.activate', this.onCreateFormActivate, this);
            this.addEventListener('form.create.deactivate', this.onCreateFormDeactivate, this);
        };

        $.extend(Core.prototype, EventTarget.prototype, {
            // Access level
            current_level: 1, // default to 'project'
            levels: ['user', 'project', 'achievement'],

            getLevelLabel: function (level) {
                return this.levels[level || this.current_level];
            },

            getFormByLevel: function (level) {
                return this.forms[this.getLevelLabel()];
            },

            onCreateFormActivate: function (event) {
                this.dispatchEvent('form.' + this.getLevelLabel() + '.create.activate');
            },

            onCreateFormDeactivate: function (event) {
                this.dispatchEvent('form.' + this.getLevelLabel() + '.create.deactivate');
            }
        });

        return Core;
    }
)