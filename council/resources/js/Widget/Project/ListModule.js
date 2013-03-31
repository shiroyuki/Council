/*global define,$ */
define(
    'Widget/Project/ListModule',
    [
        'Shiroyuki/Async/Request',
        'Shiroyuki/Event/Target',
        'Shiroyuki/Helper/TemplateLoader',
        'Service/API/Project'
    ],
    function (Request, Extension, TemplateLoader, ProjectRepository) {
        'use strict';

        var Module = function (context) {
            Extension.init(this);

            this.initiated      = false;
            this.context        = context;
            this.templateLoader = new TemplateLoader(this.context);

            this.cacheRepository = {};

            this.addEventListener('update', this.onUpdate, this);
            this.addEventListener('retrieve', this.onRetrieve, this);

            ProjectRepository.addEventListener('filter.success', this.onUpdateSuccess, this);
            ProjectRepository.addEventListener('filter.error', this.onUpdateError, this);
            ProjectRepository.addEventListener('delete.success', this.onDeleteSuccess, this);

            this.context.on('click', 'a.options', this.onOptionsClick);
            this.context.on('click', 'a.edit', $.proxy(this.onEditClick, this));
            this.context.on('click', 'a.delete', $.proxy(this.onDeleteClick, this));

            this.context.on('click', 'a.retrieve', $.proxy(this.onRetrieveClick, this));
        };

        $.extend(Module.prototype, Extension.prototype, {
            onRetrieveClick: function (event) {
                var $node = $(event.currentTarget).closest('li[data-guid]'),
                    node,
                    id = $node.attr('data-guid');

                event.preventDefault();
            },

            onOptionsClick: function (event) {
                $(this).closest('li').toggleClass('more-options');
            },

            onUpdate: function (event) {
                this.synchronise();
            },

            synchronise: function () {
                ProjectRepository.filter();
            },

            remove: function (id) {
                ProjectRepository.remove(id);
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
                // console.log(event.detail);
            },

            onUpdateSuccess: function (event) {
                var i,
                    l,
                    project,
                    projects = event.detail.response;

                this.context
                    .find('li[data-guid]')
                    .addClass('syncing')
                    .removeClass('new');

                for (i = 0, l = projects.length; i < l; i += 1) {
                    project = projects[i];

                    this.cacheRepository[project.id] = project;

                    this.addOrUpdateListItem(project);

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
                var $node = this.templateLoader.loadBlock('list-item');

                $node.attr('data-guid', project.id);

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