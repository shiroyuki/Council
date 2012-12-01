/*global define,$ */
define(
    'Widget/Project/ListModule',
    [
        'Shiroyuki/Async/Request',
        'Shiroyuki/Event/Extension',
        'Shiroyuki/Helper/TemplateLoader'
    ],
    function (Request, Extension, TemplateLoader) {
        'use strict';

        var Module = function (context) {
            Extension.init(this);

            this.context        = context;
            this.templateLoader = new TemplateLoader(this.context);

            this.update();
        };

        $.extend(Module.prototype, Extension.prototype, {
            update: function () {
                var request = new Request('/api/projects/');

                request.setResponseType('json');
                request.addEventListener('success', this.onUpdateSuccess, this);

                request.send();
            },

            onUpdateSuccess: function (event) {
                var i, l, project, projects, template, url;

                projects = event.detail.response;

                for (i = 0, l = projects.length; i < l; i += 1) {
                    template = this.templateLoader.loadBlock('list-item');
                    project  = projects[i];
                    url      = template.children('a').attr('data-href').replace(/\{id\}/, project.id);

                    template.attr('href', url);

                    template.find('.name').html(project.name);
                    template.find('.description').html(project.description);

                    this.context
                        .children('ul')
                        .append(template);
                }
            }
        });

        return Module;
    }
);