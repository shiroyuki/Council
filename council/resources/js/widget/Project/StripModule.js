/*global define,$ */
define(
    'Widget/Project/ListModule',
    [
        'Shiroyuki/Async/Request',
        'Shiroyuki/Event/Target',
        'Shiroyuki/Helper/TemplateLoader'
    ],
    function (Request, Extension, TemplateLoader) {
        'use strict';

        var Module = function (context) {
            Extension.init(this);

            this.initiated      = false;
            this.context        = context;
            this.templateLoader = new TemplateLoader(this.context);
            this.listUrl        = '/api/projects/';
            this.deleteBaseUrl  = '/api/projects/';

            this.addEventListener('update', this.onUpdate, this);

            this.context.on('click', 'a.options', this.onOptionsClick);
            this.context.on('click', 'a.edit', $.proxy(this.onEditClick, this));
            this.context.on('click', 'a.delete', $.proxy(this.onDeleteClick, this));
        };

        $.extend(Module.prototype, Extension.prototype, {
            //...
        });

        return Module;
    }
);