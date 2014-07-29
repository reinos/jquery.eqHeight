/**
 * based on (https://github.com/jsliang/eqHeight.coffee)
 *
 * eqheight.js
 */
(function($, window, document, undefined) {

    // Create the defaults once
    // heights - http://www.texelate.co.uk/blog/jquery-whats-the-difference-between-height-innerheight-and-outerheight/
    var pluginName = "eqHeight",
        defaults = {
            accountForPadding: false, // true , false
            columnSelector: "",
            onReady: function() {},
            onResize: function() {},
            break_point: null
        };

    // The actual plugin constructor
    function Plugin(element, options, options_optional) {
        this.element = element;

        //if the options var is a string, just put this as the column_selector
        if (typeof(options) === "string") {
            var columnSelector = options;
            options = {};
            options.columnSelector = columnSelector;
        }

        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options, options_optional);

        //set some defaults
        this._defaults = defaults;
        this._name = pluginName;

        //init the plugin
        this.init();
    }

    //init the plugin
    Plugin.prototype.init = function() {
        var $elem = $(this.element),
            obj = this;

        //get the elements
        obj.columns = $elem.find(obj.options.columnSelector);

        //nothing found, we get the first set of children
        if (obj.columns.length === 0) {
            obj.columns = $elem.children(obj.options.columnSelector);
        }

        //still no luck, return
        if (obj.columns.length === 0) {
            return;
        }

        //start ewualizing
        //obj.equalizer();

        //start after 100ms, so we are sure everything is loaded
        setTimeout(function() {
            obj.equalizer();
            // call the onReady function
            if (typeof obj.options.onReady === "function") {
                obj.options.onReady();
            }
        }, 100);

        //responsive... do it with the resize
        $(window).resize(function() {
            obj.equalizer();
            // call the onResize function
            if (typeof obj.options.onResize === "function") {
                obj.options.onResize();
            }
        });
    };

    Plugin.prototype.equalizer = function() {
        var obj = this;

        //set the height to auto
        obj.columns.height("auto");

        //did we hit the breakpoint, stop here
        if (typeof obj.options.break_point === "number" && $(window).width() <= obj.options.break_point) {
            return;
        }

        //get the first height
        var rowTopValue = obj.columns.first().offset().top;

        var paddingTop, paddingBottom;

        //loop over all the elements
        obj.columns.each(function() {
            //set the var for the height
            var currentTop;

            //get  the current top
            currentTop = $(this).offset().top;

            //Check the height of the element versus the document
            //is the height different, we can concluded that the element is not in row
            if (currentTop !== rowTopValue) {
                obj.equalizeMarkedColumns();
                rowTopValue = $(this).offset().top;
            }

            //do we need to take care of paddings?
            if (obj.options.accountForPadding) {
                //mark the element which need to be reparsed due the padding
                paddingTop = parseInt($(this).css("padding-top").replace("px", ""));
                paddingBottom = parseInt($(this).css("padding-bottom").replace("px", ""));

                //set the paddingTop
                if (paddingTop > 0 || paddingBottom > 0) {
                    $(this).addClass("eqHeightPadding");
                }
            }

            //mark the div with a class
            $(this).addClass("eqHeight_row");
        });

        //lets eqHeight all the marked columns
        obj.equalizeMarkedColumns();

        //lets do the padding calculation
        obj.equalizePaddings();
    };

    //eqHeight the marked columns
    Plugin.prototype.equalizeMarkedColumns = function() {
        var obj = this;

        //get the markerd element
        obj.markedColumns = $(".eqHeight_row");

        //default height
        var maxColHeight = 0;

        //loop over the marked columns
        obj.markedColumns.each(function() {

            //calculate the heighest value
            maxColHeight = Math.max($(this).height(), maxColHeight);

        });

        //set the height
        obj.markedColumns.height(maxColHeight);

        //remove the class markerd indicator
        $(".eqHeight_row").removeClass("eqHeight_row");
    };

    //eqHeight the paddings
    Plugin.prototype.equalizePaddings = function() {
        var $elem = $(this.element),
            obj = this;

        //do we need to proceed?
        if (obj.options.accountForPadding && $elem.find(".eqHeightPadding").length) {

            var maxColHeight = 0;

            //lets get the height we need
            $elem.find(".eqHeightPadding").each(function() {
                maxColHeight = Math.max($(this).innerHeight(), maxColHeight);
            });

            //reset the height to the padding
            if (maxColHeight > 0) {
                obj.markedColumns.each(function() {
                    //do not set the height of an padding elem
                    if (!$(this).hasClass("eqHeightPadding")) {
                        $(this).height(maxColHeight);
                    }
                });
            }
        }

        //remove the class markerd indicator
        $(".eqHeightPadding").removeClass("eqHeightPadding");
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options, options_optional) {
        return this.each(function() {
            new Plugin(this, options, options_optional);
        });
    };

})(jQuery, window, document);