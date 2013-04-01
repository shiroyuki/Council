/*global define */
define(
    'Page/Me',
    [
        'jquery',
        'Shiroyuki/Event/Distributor',
        'Shiroyuki/Async/Form'
    ],
    function ($, Distributor, Form) {
        'use strict';
        var Page = function ($context) {
            Distributor.init(this);

            this.context = $context;
            this.userUpdateForm = new Form(this.context.find('form'));
            
            this.context.find('.credential [class*="option-"]').on('click', $.proxy(this.onCredentialActiveUpdate, this));
        };

        $.extend(Page.prototype, Distributor.prototype, {
            updateCredentialList: function () {
                $.ajax({
                    url: '/my/credentials',
                    dataType: 'json',
                    success: $.proxy(function (response) {
                        var i, l, c, e;
                        for (i = 0, l = response.length; i < l; i++) {
                            c = response[i];
                            e = this.context.find('.credential[data-guid=' + c.id + ']')

                            e.attr('data-active', c.active ? '1' : '0');
                        }
                    }, this)
                });
            },
            onCredentialActiveUpdate: function (e) {
                var self = $(e.currentTarget),
                    type = 'put',
                    url  = self.closest('.credential').attr('data-api'),
                    data = {},
                    do_enable  = self.hasClass('option-enable'),
                    do_disable = self.hasClass('option-disable'),
                    do_revoke  = self.hasClass('option-revoke');

                e.preventDefault();

                switch (true) {
                case do_enable:
                    data.active = true;
                    break;
                case do_disable:
                    data.active = false;
                    break;
                case do_revoke:
                    type = 'delete';
                    break;
                }

                $.ajax({
                    url: url,
                    type: type,
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    success: $.proxy(function (response) {
                        this.updateCredentialList();
                    }, this)
                });
            }
        });

        return Page;
    }
);