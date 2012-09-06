define(
    'Shiroyuki/Event/Control',
    ['Shiroyuki/Event/Extension'],
    function (EventExtension) {
        'use strict';

        var control = new EventExtension();

        control.identifier = 'global';

        return control;
    }
);