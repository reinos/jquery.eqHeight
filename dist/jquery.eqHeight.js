/*
 * jquery.eqheight - v1.3.0
 * Take the pain of eqHeight away
 * https://github.com/reinos/jquery.eqHeight
 *
 * Made by Rein de Vries
 * Under MIT License
 */
(function($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "eqHeight",
        defaults = {
            columnSelector: "",
            onReady: function() {},
            onResize: function() {},
            breakPoint: null
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

            //hook into this event
            $.event.trigger({
                type: "eqHeight.onReady",
                message: "eqHeight is ready",
                target: $elem,
                time: new Date()
            });

        }, 100);

        //responsive... do it with the resize
        $(window).resize(function() {
            obj.equalizer();
            // call the onResize function
            if (typeof obj.options.onResize === "function") {
                obj.options.onResize();
            }

            //hook into this event
            $.event.trigger({
                type: "eqHeight.onResize",
                message: "eqHeight detect a resize",
                target: $elem,
                time: new Date()
            });
        });
    };

    Plugin.prototype.equalizer = function() {
        var obj = this;

        //set the height to auto
        obj.columns.height("auto");

        //did we hit the breakpoint, stop here
        if (typeof obj.options.breakPoint === "number" && $(window).width() <= obj.options.breakPoint) {
            return;
        }

        //get the first height
        var rowTopValue = obj.columns.first().offset().top;

        var paddingTop, paddingBottom, totalPadding = 0;

        //loop over all the elements
        obj.columns.each(function() {
            //set the var for the height
            var currentTop;

            //get  the current top
            currentTop = $(this).offset().top;

            //Check the height of the element versus the document
            //is the height different, we can concluded that the element is not in row
            if (currentTop !== rowTopValue) {
                obj.equalizeMarkedColumns(totalPadding);
                rowTopValue = $(this).offset().top;
                totalPadding = 0;
            }

            //Get the paddings
            paddingTop = parseInt($(this).css("padding-top").replace("px", ""));
            paddingBottom = parseInt($(this).css("padding-bottom").replace("px", ""));

            //get the total height of the paddings
            if(totalPadding < (paddingTop + paddingBottom)) {
                totalPadding = paddingTop + paddingBottom;
            }
            
            //add a padding class if needed
            if (paddingTop > 0 || paddingBottom > 0) {
             $(this).addClass("eqHeightPadding");
            }

            //mark the div with a class
            $(this).addClass("eqHeight_row");
        });

        //lets eqHeight all the marked columns
        obj.equalizeMarkedColumns(totalPadding);
        
        //remove the class markerd indicator
        $(".eqHeightPadding").removeClass("eqHeightPadding");
        $(".eqHeight_row").removeClass("eqHeight_row");
    };

    //eqHeight the marked columns
    Plugin.prototype.equalizeMarkedColumns = function(totalPadding) {
        var obj = this;
        
        totalPadding = totalPadding || 0;

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
        obj.markedColumns.each(function() {
            if($(this).hasClass("eqHeightPadding")) {
                $(this).height(maxColHeight);
            } else {
                $(this).height(maxColHeight + totalPadding);
            }
        });
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options, options_optional) {
        return this.each(function() {
            new Plugin(this, options, options_optional);
        });
    };

    //tartget data elements
   $("[data-eqheight-column]").each(function(){

        var column = "."+$(this).data("eqheight-column");
        var breakPoint = $(this).data("eqheight-break-point") !== undefined ?  $(this).data("eqheight-break-point") : null;

        $(this).eqHeight(column, {
            breakPoint : breakPoint
        });
   });

})(jQuery, window, document);