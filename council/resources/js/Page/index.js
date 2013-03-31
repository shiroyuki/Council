/*global $, define */
define(
    'Page/Index',
    [
        'Service/RPC',
        'Shiroyuki/Event/Distributor',
        'Shiroyuki/Event/Target',
        'Shiroyuki/Async/Form',
        'UI/Core',
        'UI/Control',
        'Widget/Project/ListModule',
        'Widget/Project/SaveModule'
    ],
    function (
        rpc,
        Distributor,
        EventTarget,
        Form,
        UICore,
        UIControl,
        ProjectListModule,
        ProjectSaveModule
    ) {
        'use strict';

        var Page = function ($context) {
            Distributor.init(this);

            EventTarget.debug = false;

            // Prevent highlighting.
            $context.on('mousedown', 'a.btn, nav a, .commands a', function (event) { event.preventDefault(); });

            this.core = new UICore($context);

            // Navigation
            this.uiControl = new UIControl($context.find('nav.control.main'));

            // Project Modules
            this.projectListModule = new ProjectListModule($context.find('.widget.project.list'));
            this.projectSaveModule = new ProjectSaveModule(this.core.forms.project);

            // Event Relay Map
            this.relayWhen(this.projectListModule, 'edit', this.projectSaveModule, 'edit.prompt');

            this.relayWhen(this.projectSaveModule, 'save.success', this.projectListModule, 'update')
                .then(this.core, 'form.create.deactivate')
                .then(this.uiControl, 'main.trigger.create.deactivate');

            this.relayWhen(this.projectSaveModule, 'cancel', this.uiControl, 'main.trigger.create.deactivate');

            this.relayWhen(this.core, 'form.project.create.activate', this.projectSaveModule, 'create.prompt');
            this.relayWhen(this.core, 'form.project.create.deactivate', this.projectSaveModule, 'deactivate');

            this.relayWhen(this.uiControl, 'form.create.activate', this.core, 'form.create.activate');

            this.relayWhen(this.uiControl, 'form.create.deactivate', this.core, 'form.create.deactivate');

            // Startup operations
            this.projectListModule.dispatchEvent('update');
        };

        $.extend(Page.prototype, Distributor.prototype);

        return Page;
    }
);
