/*global define,$ */
define(
    'Widget/Project/SaveModule',
    ['Shiroyuki/Event/Extension'],
    function (Extension) {
        'use strict';

        var Module = function (form) {
            Extension.init(this);

            this.form = form;

            this.form.addEventListener('success', this.onFormSubmitSuccess, this);
        };

        $.extend(Module.prototype, Extension.prototype, {
            onFormSubmitSuccess: function (event) {
                alert('Done');
            }
        });

        return Module;
    }
);