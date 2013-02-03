//Utility
if(typeof Object.create !== 'function') {
    Object.create = function( obj ) {
        function F() {};
        F.prototype = obj;
        return new F();
    }
}

(function($, window, document, undefined){

    var timeout;

    var FlashBulb = {
        init: function(elements, options, callback) {
            var self = this;
            self.elems = elements;
            self.callback = callback;
            self.timeout = null;
            self.options = $.extend({}, $.fn.flashBulb.options, options);
        }, // end of init

        show: function() {
            var self = this;

            if(self.elems.length > 0) {
                var i = 0;
                self.elems.append('<div class="flash"></div>');
                $('.flash').css({
                    'background-color': self.options.background,
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px',
                    'width': '100%',
                    'height': '100%'
                }); // end flash.css;
                process();
            }

            function process() {
                if(i < self.elems.length) {
                    var $element = $(self.elems[i]);
                    var flashBulb = $element.children('.flash');
                    $element.show(1, function() {
                        flashBulb.animate({
                            opacity: 0
                        }, self.options.fadeSpeed, function() {
                            flashBulb.remove();
                        });
                    }); // end show
                    timeout = setTimeout(process, self.options.interval);
                }
                else if($.isFunction(self.callback)) {
                    var callbackInterval = self.options.fadeSpeed - self.options.interval > 0
                                            ?self.options.fadeSpeed
                                            : self.options.interval;
                    timeout = setTimeout(function() { 
                        return self.callback.call(self.elems);
                    }, callbackInterval);
                }
                i++;
            }

            return self.elems;
        }, // end of show

        hide: function() {
            var self = this;

            if(self.elems.length > 0) {
                var i = self.elems.length;
                self.elems.append('<div class="flash"></div>');
                $('.flash').css({
                    'background-color': self.options.background,
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px',
                    'width': '100%',
                    'height': '100%',
                    'opacity': 0
                }); // end flash.css
                process();
            }

            function process() {
                i--;
                if(i >= 0) {
                    var $element = $(self.elems[i]);
                    var $flash = $element.children('.flash');
                    $flash.animate({
                        'opacity': 100
                    }, self.options.initialFlash, function() {
                        $element.animate({
                            'opacity': 0
                        }, self.options.fadeSpeed, function() {
                            $element.hide().css('opacity', 100);
                        });
                    });
                    timeout = setTimeout(process, self.options.interval);
                } else if ($.isFunction(self.callback)) {
                    var callbackInterval = self.options.fadeSpeed - self.options.interval > 0
                                            ?self.options.fadeSpeed
                                            : self.options.interval;
                    timeout = setTimeout(function() { 
                        return self.callback.call(self.elems);
                    }, callbackInterval);
                }
            }

            return self.elems;
        } // end of hide
    };

    $.fn.flashBulb = function(typeOrOptions, callback) {
        var method = (typeof typeOrOptions == 'string') ? typeOrOptions : typeOrOptions.method || $.fn.flashBulb.options.method;
        if(method == 'kill') {
            clearTimeout(timeout);
            return this;
        }

        if(method !== 'kill'|| flashBulb == undefined) {
            var flashBulb = Object.create(FlashBulb);
            flashBulb.init(this, typeOrOptions, callback);
        }



        if(method == 'show') {
            return flashBulb.show();
        } else if(method == 'hide') {
            return flashBulb.hide();
        } else {
            $.error('Method '+method+' does not exists on jQuery.flash');
        }
    }

    $.fn.flashBulb.options = {
        method: 'show',
        initialFlash: 30,
        fadeSpeed: 600,
        interval: 200,
        background: 'white',
    }
})(jQuery, window, document);