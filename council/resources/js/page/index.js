define(
    'Page/Index',
    [
        'jquery',
        'Service/RPC'
    ],
    function ($, rpc) {
        'use strict';

        var $context = $('#r'),
            $formLogin = $context.find('form.login');

        $context.attr('data-mode', 'init');
        $formLogin.addClass('form-inline');

        rpc.broadcast('Haha');
    }
);