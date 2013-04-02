/*global define */
define(
    'Shiroyuki/Helper/TemplateLoader',
    ['jquery'],
    function ($) {
        'use strict';

        var TemplateLoader = function ($context, cache) {
            this.context    = $context;
            this.cache      = cache || true;
            this.rawDataMap = {};
            this.blockMap   = {};
        };

        $.extend(TemplateLoader.prototype, {
            loadRawData: function (templateName) {
                var rawData;

                if (this.cache && this.rawDataMap.hasOwnProperty(templateName)) {
                    return this.rawDataMap[templateName];
                }

                rawData = $.trim(this.context.find(['[data-template="', templateName, '"]'].join('')).html());

                if (this.cache) {
                    this.rawDataMap[templateName] = rawData;
                }

                return rawData;
            },

            loadBlock: function (templateName) {
                var $block;

                if (this.cache && this.blockMap.hasOwnProperty(templateName)) {
                    return this.blockMap[templateName].clone();
                }

                $block = $(this.loadRawData(templateName));

                if (this.cache) {
                    this.blockMap[templateName] = $block;
                }

                return $block.clone();
            }
        });

        return TemplateLoader;
    }
)