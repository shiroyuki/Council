define(
    'widget/council-search',
    ['jquery', 'Shiroyuki/Form'],
    function ($, Form) {
        var $form = $('form[action="#council/query"]'),
            $list = $form.next(),
            f     = new Form($form);

        f.addEventListener('change', function (e) {
            'use strict';

            var event    = e.detail.original,
                $form    = e.detail.container,
                $target  = $(e.detail.eventTarget),
                query    = $.trim($form.find('input').val().replace(/"/, '&quot;')),
                selector = [':not([data-search-facet^="', query,'"])'].join(''),
                $councils, $omittedCouncils;

            if (event.altKey || event.ctrlKey) {
                return;
            }

            switch (event.keyCode) {
                case 13: return;
            }

            $councils = $list.children();

            $councils.removeClass('omitted');

            if (query.length === 0) {
                $form.find('button.new').hide();
                return;
            }

            $omittedCouncils = $councils.filter(selector);

            $omittedCouncils.addClass('omitted');

            if ($omittedCouncils.length === $councils.length) {
                $form.find('button.new').show();
            } else {
                $form.find('button.new').hide();
            }
        });
    }
);