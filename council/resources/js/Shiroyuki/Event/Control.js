/**
 * Global Event Control
 *
 * This is a prototype of Passerine project.
 *
 * License: MIT License
 *
 * @copyright 2012 Juti Noppornpitak
 * @author Juti Noppornpitak <jnopporn@shiroyuki.com>
 * @extends Shiroyuki/Event/Extension
 */
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