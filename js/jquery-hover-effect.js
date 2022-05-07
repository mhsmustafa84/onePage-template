(function ($, undefined) {
    /*
     * HoverDir object.
     */
    $.HoverDir = function (options, element) {
        this.$el = $(element);

        this._init(options);
    };

    $.HoverDir.defaults = {
        hoverDelay: 0,
        reverse: false,
    };

    $.HoverDir.prototype = {
        _init: function (options) {
            this.options = $.extend(true, {}, $.HoverDir.defaults, options);

            // load the events
            this._loadEvents();
        },
        _loadEvents: function () {
            var _self = this;

            this.$el.on(
                'mouseenter.hoverdir, mouseleave.hoverdir',
                function (event) {
                    var $el = $(this),
                        evType = event.type,
                        $hoverElem = $el.find('article'),
                        direction = _self._getDir($el, {
                            x: event.pageX,
                            y: event.pageY,
                        }),
                        hoverClasses = _self._getClasses(direction);

                    $hoverElem.removeClass();

                    if (evType === 'mouseenter') {
                        $hoverElem.hide().addClass(hoverClasses.from);

                        clearTimeout(_self.tmhover);

                        _self.tmhover = setTimeout(function () {
                            $hoverElem.show(0, function () {
                                $(this)
                                    .addClass('da-animate')
                                    .addClass(hoverClasses.to);
                            });
                        }, _self.options.hoverDelay);
                    } else {
                        $hoverElem.addClass('da-animate');

                        clearTimeout(_self.tmhover);

                        $hoverElem.addClass(hoverClasses.from);
                    }
                }
            );
        },
        _getDir: function ($el, coordinates) {
            /** the width and height of the current div **/
            var w = $el.width(),
                h = $el.height(),
                x =
                    (coordinates.x - $el.offset().left - w / 2) *
                    (w > h ? h / w : 1),
                y =
                    (coordinates.y - $el.offset().top - h / 2) *
                    (h > w ? w / h : 1),
                direction =
                    Math.round(
                        (Math.atan2(y, x) * (180 / Math.PI) + 180) / 90 + 3
                    ) % 4;

            return direction;
        },
        _getClasses: function (direction) {
            var fromClass, toClass;

            switch (direction) {
                case 0:
                    // from top
                    !this.options.reverse
                        ? (fromClass = 'da-slideFromTop')
                        : (fromClass = 'da-slideFromBottom');
                    toClass = 'da-slideTop';
                    break;
                case 1:
                    // from right
                    !this.options.reverse
                        ? (fromClass = 'da-slideFromRight')
                        : (fromClass = 'da-slideFromLeft');
                    toClass = 'da-slideLeft';
                    break;
                case 2:
                    // from bottom
                    !this.options.reverse
                        ? (fromClass = 'da-slideFromBottom')
                        : (fromClass = 'da-slideFromTop');
                    toClass = 'da-slideTop';
                    break;
                case 3:
                    // from left
                    !this.options.reverse
                        ? (fromClass = 'da-slideFromLeft')
                        : (fromClass = 'da-slideFromRight');
                    toClass = 'da-slideLeft';
                    break;
            }

            return { from: fromClass, to: toClass };
        },
    };

    var logError = function (message) {
        if (this.console) {
            console.error(message);
        }
    };

    $.fn.hoverdir = function (options) {
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
                var instance = $.data(this, 'hoverdir');

                if (!instance) {
                    logError(
                        'cannot call methods on hoverdir prior to initialization; ' +
                            "attempted to call method '" +
                            options +
                            "'"
                    );
                    return;
                }

                if (
                    !$.isFunction(instance[options]) ||
                    options.charAt(0) === '_'
                ) {
                    logError(
                        "no such method '" + options + "' for hoverdir instance"
                    );
                    return;
                }

                instance[options].apply(instance, args);
            });
        } else {
            this.each(function () {
                var instance = $.data(this, 'hoverdir');
                if (!instance) {
                    $.data(this, 'hoverdir', new $.HoverDir(options, this));
                }
            });
        }

        return this;
    };
})(jQuery);
