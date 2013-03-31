define(
    'Widget/CouncilSearchForm',
    [
        'jquery',
        'Shiroyuki/Form',
        'Shiroyuki/Event/Target'
    ],
    function ($, Form, EventExtension) {
        'use strict';

        function SearchForm($form) {
            'use strict';

            var self = this,
                targetContainerSelector = $form.attr('data-target-container');

            if (targetContainerSelector === undefined) {
                throw 'shiroyuki.form.search_form.undefined_target_container';
            }

            this.$targetContainer = $(targetContainerSelector);

            if (this.$targetContainer.length === 0) {
                throw 'shiroyuki.form.search_form.no_target_container';
            }

            this.form = new Form($form);
            this.form.addEventListener('change', function (e) {
                'use strict';

                var event    = e.detail.original,
                    $form    = e.detail.form.getElement(),
                    $target  = $(e.detail.eventTarget),
                    query    = $.trim($form.find('input').val().replace(/"/, '&quot;')),
                    criteria = [':not([data-search-facet^="', query,'"])'].join(''),
                    extraButtonSelector = 'button.new',
                    $targets, $omittedTargets;

                if (event.altKey || event.ctrlKey) {
                    return;
                }

                switch (event.keyCode) {
                    case 13:
                        return;

                    case 27:
                        query = '';

                        $form.find('input').val(query);

                        self.dispatchEvent('abort', self.form);
                }

                $targets = self.$targetContainer.children();

                $targets.removeClass('omitted');

                if (query.length === 0) {
                    $form.find(extraButtonSelector).hide();
                    $form.find('button').attr('disabled', 'disabled');
                    return;
                }

                $omittedTargets = $targets.filter(criteria);

                $omittedTargets.addClass('omitted');

                if ($omittedTargets.length === $targets.length) {
                    $form.find(extraButtonSelector).show();
                } else {
                    $form.find(extraButtonSelector).hide();
                }

                $form.find('button').removeAttr('disabled');
            });
        }

        $.extend(SearchForm.prototype, EventExtension.prototype, {
            form: null,
            $targetContainer: null
        });

        return SearchForm;
    }
);