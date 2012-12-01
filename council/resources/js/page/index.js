/*global $, define */
define(
    'Page/Index',
    [
        'Service/RPC',
        'Shiroyuki/Async/Form',
        'Widget/Project/ListModule',
        'Widget/Project/SaveModule'
    ],
    function (
        rpc,
        Form,
        ProjectListModule,
        ProjectSaveModule
    ) {
        'use strict';

        var Page = function ($context) {
            var i, l, levelName, $form, form;

            // Prevent highlighting.
            $context.on('mousedown', 'a.btn, nav a', function (event) { event.preventDefault(); });

            this.forms   = {};

            for (i = 0, l = this.levels.length; i < l; i++) {
                levelName = this.levels[i];
                $form     = $context.find('form.form.' + levelName);

                if ($form.length) {
                    form = new Form($form);

                    this.forms[levelName] = form;
                }
            }

            // Navigation
            this.createFormTrigger = $context.find('.form-trigger.new');

            this.createFormTrigger.on('click', $.proxy(this.onCreateFormTrigger, this));

            // Project Modules
            this.projectListModule = new ProjectListModule($context.find('.widget.project.list'));
            this.projectSaveModule = new ProjectSaveModule(this.forms.project);
        };

        $.extend(Page.prototype, {
            // Access level
            current_level: 1, // default to 'project'
            levels: ['user', 'project', 'achievement'],

            getFormByLevel: function (level) {
                return this.forms[this.levels[level || this.current_level]];
            },

            onCreateFormTrigger: function (event) {
                event.preventDefault();

                var $anchor = $(event.currentTarget).parent(),
                    methodName = $anchor.hasClass('active') ? 'removeClass' : 'addClass';

                $anchor.toggleClass('active');

                this.getFormByLevel()
                    .getElement()
                    [methodName]('visible');
            }
        });

        return Page;
    }
);
