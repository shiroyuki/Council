require(
    [
        'jquery',
        'Widget/CouncilSearchForm'
    ],
    function ($, WidgetCouncilSearchForm) {
        'use strict';

        function hideFooter() {
            var $target = $('footer');
            $target.css('bottom', $target.outerHeight() * -1);
        }

        var widgetCouncilSearchForm = new WidgetCouncilSearchForm($('form[action="#council/query"]'));

        widgetCouncilSearchForm.addEventListener('abort', function (event) {
            'use strict';

            var target = event.detail.target;

            target.getElement().prev().toggleClass('activated');
        });

        $('[rel=tooltip]').tooltip();

        $('menu.primary a.base.search').on('click', function (event) {
            event.preventDefault();

            var $self = $(this);

            $self.toggleClass('activated');
        });

        setTimeout(hideFooter, 5000);
    }
);