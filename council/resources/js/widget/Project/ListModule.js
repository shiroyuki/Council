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
            onOptionsClick: function (event) {
                $(this).closest('li').toggleClass('more-options');
            },

            onUpdate: function (event) {
                this.synchronise();
            },

            synchronise: function () {
                var request = new Request(this.listUrl);

                request.setResponseType('json');
                request.addEventListener('success', this.onUpdateSuccess, this);
                request.addEventListener('error', this.onUpdateError, this);

                request.send();
            },

            remove: function (id) {
                var request = new Request(this.deleteBaseUrl + id, 'delete');

                request.setResponseType('json');
                request.addEventListener('success', this.onDeleteSuccess, this);

                request.send();
            },

            onDeleteSuccess: function (event) {
                this.synchronise();
            },

            retrieveIdFromClickTarget: function (target) {
                return $(target).closest('[data-guid]').attr('data-guid');
            },

            onDeleteClick: function (event) {
                event.preventDefault();

                this.remove(this.retrieveIdFromClickTarget(event.currentTarget));
            },

            onEditClick: function (event) {
                event.preventDefault();

                this.dispatchEvent('edit', {id: this.retrieveIdFromClickTarget(event.currentTarget)});
            },

            onUpdateError: function (event) {
                console.log(event.detail);
            },

            onUpdateSuccess: function (event) {
                var i,
                    l,
                    projects = event.detail.response;

                console.log(projects);

                this.context
                    .find('li[data-guid]')
                    .addClass('syncing')
                    .removeClass('new');

                for (i = 0, l = projects.length; i < l; i += 1) {
                    this.addOrUpdateListItem(projects[i]);
                }

                this.context
                    .find('li[data-guid].syncing')
                    .remove();

                this.initiated = true;
            },

            addOrUpdateListItem: function (project) {
                var $node   = this.context.find('li[data-guid="' + project.id + '"]'),
                    hasNode = $node.length === 0;

                if (hasNode) {
                    $node = this.createNode(project);
                }

                this.synchroniseNode(project, $node);

                if (hasNode) {
                    this.context
                        .children('ul')
                        .append($node);
                }
            },

            createNode: function (project) {
                var $node           = this.templateLoader.loadBlock('list-item'),
                    $retrivalAnchor = $node.children('a.retrieve'),
                    url             = $retrivalAnchor.attr('data-href').replace(/\{id\}/, project.id);

                $node.attr('data-guid', project.id);

                $retrivalAnchor.attr('href', url);

                if (this.initiated) {
                    $node.addClass('new');
                }

                return $node;
            },

            synchroniseNode: function (project, $node) {
                $node.find('.name').html(project.name);
                $node.find('.description').html(project.description);

                $node.removeClass('syncing no-description');

                if (!project.description || project.description.length === 0) {
                    $node.addClass('no-description');
                }
            }
        });

        return Module;
    }
);