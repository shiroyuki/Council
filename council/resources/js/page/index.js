require(
    [
        'jquery',
        'widget/council-search'
    ],
    function ($, WidgetCouncilSearch) {
        function hideFooter() {
            var $target = $('footer');
            $target.css('bottom', $target.outerHeight() * -1);
        }

        setTimeout(hideFooter, 5000);

        $('.councils .list').on(
            'click',
            '.council',
            function (e) {
                $(this).parent().toggleClass('focused');
                $(this).toggleClass('target');
            }
        );


    }
);