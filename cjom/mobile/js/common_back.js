/*
 ** Common for Onmart Plugin
 ** NAMESPACE cjom.pub
 */
(function ($, win, doc, undefined) {
    "use strict";

    var __CJOM_SPACE;

    if ("undefined" === typeof win.cjom) {
        win.cjom = {};
    }

    __CJOM_SPACE = win.cjom.pub;

    /* Local Variables */
    var UTIL = {};

    /* UTIL */
    (function () {
        /***
         * get Unique String
         */
        UTIL.uuid = (function () {
            var _uuid = 0;
            return function (prefix) {
                var id = ++_uuid;
                prefix = prefix ? prefix : "";
                return prefix + id;
            };
        })();

        /***
         * 전달된 부모엘리먼트 하위에 focus가능한 엘리먼트 반환
         * @param parentElement
         * @returns {[*,*]}
         */
        UTIL.findFocusEl = function (parentElement) {
            var _basket = [];

            $(parentElement)
                .find("*")
                .each(function (i, val) {
                    if (
                        val.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim) &&
                        parseInt(val.getAttribute("tabIndex")) !== -1
                    ) {
                        _basket.push(val);
                    }
                    if (
                        val.getAttribute("tabIndex") !== null &&
                        parseInt(val.getAttribute("tabIndex")) >= 0 &&
                        val.getAttribute("tabIndex", 2) !== 32768
                    ) {
                        _basket.push(val);
                    }
                });

            return [_basket[0], _basket[_basket.length - 1]];
        };

        $.fn.scrollEnd = function (callback, timeout) {
            $(this).scroll(function () {
                var $this = $(this);
                if ($this.data("scrollTimeout")) {
                    clearTimeout($this.data("scrollTimeout"));
                }
                $this.data("scrollTimeout", setTimeout(callback, timeout));
            });
        };
    })();

    /* Plugin - Toggle  */
    (function ($, win, doc, undefined) {
        var pluginName = "toggle";

        var defaults = {
            mode: "static", // static, slide, fade
            event: "click", // 'focusin'
            speed: 300,
            easing: "swing",
            anchorEl: '[data-js="toggle__anchor"]',
            panelEl: '[data-js="toggle__panel"]',
            onChangeBeforeText: null,
            onChangeAfterText: null,
            activeClassName: "is-active",
            onChangeBefore: null,
            onChangeAfter: null,
            selectedText: "Selected",
            firstOpen: false,
            isOpened: false
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.flag = false;
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;
                plugin.buildCache();
                plugin.bindEvents();
            },
            destroy: function () {
                var plugin = this;

                plugin.flag = false;
                plugin.$element.removeData("plugin_" + plugin._name);
                plugin.unbindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$wrap = $(plugin.element);
                plugin.$anchor = plugin.$wrap.find(plugin.options.anchorEl);
                plugin.$panel = plugin.$wrap.find(plugin.options.panelEl);

                if (!plugin.options.firstOpen) {
                    plugin.$panel.attr("aria-expended", false).hide();
                } else {
                    this.flag = true;
                }

                plugin.options.isOpened && plugin.toggle();
            },
            bindEvents: function () {
                var plugin = this;
                var eventName = (function () {
                    var events = plugin.options.event;

                    if (events === "focusin") {
                        return "focusin." + plugin._name + " mouseenter." + plugin._name;
                    } else if (events === "click") {
                        return "click." + plugin._name + " keydown." + plugin._name;
                    }
                    return events + "." + plugin._name;
                })();

                plugin.$anchor.on(eventName, function (e) {
                    e.stopPropagation();
                    var $this = $(this);

                    var key = e.which || e.keyCode;

                    if (
                        e.type === "click" ||
                        e.type === "focusin" ||
                        key === 13 ||
                        key === 32
                    ) {
                        plugin.idx = $(this).data("index");
                        plugin.toggle();
                        e.preventDefault();
                    }
                });

                plugin.$wrap.on("hide." + plugin._name, function (e) {
                    plugin.hide();
                });
            },
            unbindEvents: function () {
                var plugin = this;

                plugin.$anchor.off("." + plugin._name);
                plugin.$wrap.off("." + plugin._name);
            },
            beforeChange: function ($anchor, $panel) {
                var plugin = this,
                    onChangeBefore = plugin.options.onChangeBefore;

                if (typeof onChangeBefore === "function") {
                    onChangeBefore.apply(plugin.element, [plugin, $anchor, $panel]);
                }
            },
            afterChange: function ($anchor, $panel) {
                var plugin = this,
                    onChangeAfter = plugin.options.onChangeAfter;

                if (typeof onChangeAfter === "function") {
                    onChangeAfter.apply(plugin.element, [plugin, $anchor, $panel]);
                }

                $panel.find(".slick-initialized").length &&
                    $panel.find(".slick-initialized").slick("setPosition");
            },
            toggle: function () {
                var plugin = this;

                plugin.flag === false ? plugin.show() : plugin.hide();
            },
            show: function () {
                var plugin = this;

                plugin.flag = true;

                plugin.beforeChange(plugin.$anchor, plugin.$panel);

                if (plugin.options.onChangeAfterText !== null) {
                    plugin.$anchor.text(plugin.options.onChangeAfterText);
                }

                plugin.$anchor.addClass(plugin.options.activeClassName);

                if (plugin.options.mode === "fade") {
                    plugin.$panel
                        .stop()
                        .fadeIn(plugin.options.speed, plugin.options.easing, function () {
                            plugin.afterChange(plugin.$anchor, plugin.$panel);
                        });
                } else if (plugin.options.mode === "slide") {
                    plugin.$panel
                        .stop()
                        .slideDown(plugin.options.speed, plugin.options.easing, function () {
                            plugin.afterChange(plugin.$anchor, plugin.$panel);
                        });
                } else {
                    plugin.$panel.stop().show();
                    plugin.afterChange(plugin.$anchor, plugin.$panel);
                }
                plugin.$panel.attr("aria-expended", true);
            },
            hide: function () {
                var plugin = this;

                plugin.flag = false;

                if (plugin.options.onChangeBeforeText !== null) {
                    plugin.$anchor.text(plugin.options.onChangeBeforeText);
                }

                plugin.$anchor.removeClass(plugin.options.activeClassName);

                if (plugin.options.mode === "fade") {
                    plugin.$panel
                        .stop()
                        .fadeOut(plugin.options.speed, plugin.options.easing);
                } else if (plugin.options.mode === "slide") {
                    plugin.$panel
                        .stop()
                        .slideUp(plugin.options.speed, plugin.options.easing);
                } else {
                    plugin.$panel.stop().hide();
                }
                plugin.$panel.attr("aria-expended", false);
            },
            reInit: function () {
                var plugin = this;

                plugin.flag = false;

                plugin.unbindEvents();
                plugin.init();
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=toggle]").toggle();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Tab */
    (function ($, win, doc, undefined) {
        var pluginName = "tab";

        var defaults = {
            mode: "static", // static, slide, fade
            event: "click", // 'focusin'
            speed: 300,
            easing: "swing",
            listEl: '[data-js="tab__list"]',
            anchorEl: '[data-js="tab__anchor"]',
            panelEl: '[data-js="tab__panel"]',
            activeClassName: "is-active",
            disabledClassName: "is-disabled",
            withScroll: false,
            isInitActive: true,
            initIndex: 0,
            onChangeBefore: null,
            onChangeAfter: null,
            selectedText: "Selected"
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.flag = false;
            this.initialized = false;
            this.idx = 0;
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;
                plugin.buildCache();
                plugin.bindEvents();
                if (plugin.options.isInitActive) {
                    plugin.$anchor
                        .eq(plugin.options.initIndex)
                        .trigger(plugin.options.event);
                }
                plugin.initialized = true;
            },

            destroy: function () {
                var plugin = this;
                plugin.unbindEvents();
                plugin.$list.removeAttr("role");
                plugin.$anchor
                    .removeAttr("style role")
                    .removeClass(plugin.options.activeClassName);
                plugin.$panel
                    .removeAttr("style role aria-labelledby")
                    .removeClass(plugin.options.activeClassName);
                plugin.flag = false;
            },

            buildCache: function () {
                var plugin = this;
                var tabsId = [];

                plugin.$wrap = $(plugin.element);
                plugin.$anchor = plugin.$wrap.find(plugin.options.anchorEl);
                plugin.$panel = plugin.$wrap.find(plugin.options.panelEl);

                plugin.$list = (function () {
                    var byOption = plugin.$wrap.find(plugin.options.listEl);
                    var replace = plugin.$wrap.children("ul, ol");

                    return byOption.length ? byOption : replace;
                })();
                plugin.$list.attr("role", "tablist");

                plugin.$anchor.each(function (index) {
                    var $this = $(this);
                    var _id = $this.attr("id")
                        ? $this.attr("id")
                        : UTIL.uuid("js-" + pluginName + "-");
                    var tagName = $this.get(0).tagName.toLowerCase();
                    var isFocusable = false;

                    if (tagName === "a" || tagName === "button") {
                        isFocusable = true;
                    }

                    $this
                        .data(plugin._name + "_target", plugin.$panel.eq(index))
                        .data("index", index)
                        .attr({
                            id: _id,
                            role: "tab",
                            tabindex: isFocusable ? "" : 0
                        });

                    tabsId.push(_id);
                });

                plugin.$panel.each(function (index) {
                    $(this).attr({
                        "aria-labelledby": tabsId[index],
                        role: "tabpanel",
                        tabindex: 0
                    });
                });
            },

            bindEvents: function () {
                var plugin = this;
                var eventName = (function () {
                    var events = plugin.options.event;

                    if (events === "focusin") {
                        return "focusin." + plugin._name + " mouseenter." + plugin._name;
                    } else if (events === "click") {
                        return "click." + plugin._name + " keydown." + plugin._name;
                    }
                    return events + "." + plugin._name;
                })();

                plugin.$anchor.on(eventName, function (e) {
                    e.stopPropagation();
                    var $this = $(this);
                    if (
                        $this.hasClass(plugin.options.activeClassName) ||
                        $this.hasClass(plugin.options.disabledClassName) ||
                        plugin.flag
                    ) {
                        return false;
                    }

                    var key = e.which;

                    if (
                        e.type === "click" ||
                        e.type === "focusin" ||
                        key === 13 ||
                        key === 32
                    ) {
                        plugin.idx = $(this).data("index");
                        plugin.hide(this);
                        plugin.show(this);
                        e.preventDefault();
                    }
                });

                plugin.$wrap.on("go." + plugin._name, function (ev, index, withScroll) {
                    plugin.$anchor.eq(index).trigger(plugin.options.event);
                    if (withScroll) {
                        $("html, body")
                            .stop()
                            .animate(
                                {
                                    scrollTop: plugin.$wrap.offset().top
                                },
                                plugin.options.speed
                            );
                    }
                });
            },

            unbindEvents: function () {
                var plugin = this;
                plugin.$anchor
                    .off("." + plugin._name)
                    .removeData(plugin._name + "_target");
                plugin.$wrap.off("." + plugin._name);
            },

            beforeChange: function ($anchor, $panel) {
                var plugin = this,
                    onChangeBefore = plugin.options.onChangeBefore;

                if (typeof onChangeBefore === "function") {
                    onChangeBefore.apply(plugin.element, [plugin, $anchor, $panel]);
                }
            },

            afterChange: function ($anchor, $panel) {
                var plugin = this,
                    onChangeAfter = plugin.options.onChangeAfter;

                if (typeof onChangeAfter === "function") {
                    onChangeAfter.apply(plugin.element, [plugin, $anchor, $panel]);
                }
                $("body").trigger("TAB_CHANGE", [plugin, plugin.$wrap]);

                $panel.find(".slick-initialized").length &&
                    $panel.find(".slick-initialized").slick("setPosition");
            },

            show: function (_target) {
                var plugin = this,
                    $anchor = $(_target);

                var $panel = $anchor
                    .addClass(plugin.options.activeClassName)
                    .attr({
                        "aria-selected": true,
                        title: plugin.options.selectedText
                    })
                    .data(plugin._name + "_target")
                    .addClass(plugin.options.activeClassName);

                plugin.flag = true;
                plugin.beforeChange($anchor, $panel);

                if (plugin.options.mode === "fade") {
                    $panel
                        .stop()
                        .fadeIn(plugin.options.speed, plugin.options.easing, function () {
                            plugin.flag = false;
                            plugin.afterChange($anchor, $panel);
                        });
                } else if (plugin.options.mode === "slide") {
                    $panel
                        .stop()
                        .slideDown(plugin.options.speed, plugin.options.easing, function () {
                            plugin.flag = false;
                            plugin.afterChange($anchor, $panel);
                        });
                } else {
                    $panel.stop().show();
                    plugin.flag = false;
                    plugin.afterChange($anchor, $panel);
                }
                if (plugin.options.withScroll && plugin.initialized) {
                    $("html, body")
                        .stop()
                        .animate(
                            {
                                scrollTop: plugin.$wrap.offset().top
                            },
                            plugin.options.speed
                        );
                }
            },

            hide: function (_except) {
                var plugin = this;

                plugin.$anchor.not(_except).each(function () {
                    var $panel = $(this)
                        .removeClass(plugin.options.activeClassName)
                        .attr({
                            "aria-selected": false,
                            title: ""
                        })
                        .data(plugin._name + "_target")
                        .removeClass(plugin.options.activeClassName);

                    if (plugin.options.mode === "fade") {
                        $panel.stop().fadeOut(plugin.options.speed, plugin.options.easing);
                    } else if (plugin.options.mode === "slide") {
                        $panel.stop().slideUp(plugin.options.speed, plugin.options.easing);
                    } else {
                        $panel.stop().hide();
                    }
                });
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $.fn[pluginName].options = {
            go: function (elem, index) {
                elem.trigger("go", index);
            }
        };

        $(function () {
            $("[data-js=tab]").tab();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Accordion */
    (function ($, win, doc, undefined) {
        var pluginName = "accordion";

        var defaults = {
            mode: "static", // static, slide
            speed: 200,
            easing: "linear",
            itemEl: '[data-js="accordion__item"]',
            anchorEl: '[data-js="accordion__anchor"]',
            panelEl: '[data-js="accordion__panel"]',
            activeClassName: "is-active",
            isInitActive: true,
            initIndex: 1,
            autoFold: true,
            onBeforeChange: null,
            onAfterChange: null,
            expandedText: "collapse",
            collapsedText: "expand",
            autoScroll: false,
            autoScrollTop: 0,
            noneClick: false
        };

        function Plugin(element, options) {
            var plugin = this;

            plugin.element = element;
            plugin._name = pluginName;
            plugin._defaults = defaults;
            plugin.options = $.extend({}, plugin._defaults, options);
            plugin.flag = false;
            plugin.initialized = false;
            plugin.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;
                plugin.buildCache();
                plugin.bindEvents();
                plugin.$panel.hide();
                if (plugin.options.isInitActive) {
                    plugin._open(plugin.$anchor.eq(plugin.options.initIndex));
                }
                plugin.initialized = true;
            },

            destroy: function () {
                var plugin = this;
                plugin.unbindEvents();
                plugin.$header
                    .removeAttr("style")
                    .removeClass(plugin.options.activeClassName);
                plugin.$panel
                    .removeAttr("style")
                    .removeClass(plugin.options.activeClassName);
                plugin.flag = false;
                plugin.removeAria();
            },

            buildCache: function () {
                var plugin = this;

                plugin.$wrap = $(plugin.element).attr("role", "presentation");
                plugin.$header = plugin.$wrap.find(plugin.options.itemEl);
                plugin.$anchor = plugin.$wrap.find(plugin.options.anchorEl);
                plugin.$panel = plugin.$wrap.find(plugin.options.panelEl);
                plugin.removeAria();
                plugin.setAria();
            },

            bindEvents: function () {
                var plugin = this;

                if (!plugin.options.noneClick) {
                    plugin.$wrap.on(
                        "click" + "." + plugin._name,
                        plugin.options.anchorEl,
                        function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                            if (plugin.flag) {
                                return false;
                            }
                            plugin.toggle($(this));
                        }
                    );
                }

                plugin.$anchor.on("open." + plugin._name, function () {
                    plugin._open($(this));
                });

                plugin.$anchor.on("close." + plugin._name, function () {
                    plugin._close($(this));
                });
            },

            unbindEvents: function () {
                var plugin = this;
                plugin.$wrap.off("." + plugin._name);
                plugin.$header.off("." + plugin._name);
            },

            beforeChange: function ($activeItemEl) {
                var plugin = this,
                    onBeforeChange = plugin.options.onBeforeChange;

                if (typeof onBeforeChange === "function") {
                    onBeforeChange.apply(plugin.element, [plugin, $activeItemEl]);
                }
            },

            afterChange: function ($activeItemEl) {
                var plugin = this,
                    onAfterChange = plugin.options.onAfterChange;

                if (typeof onAfterChange === "function") {
                    onAfterChange.apply(plugin.element, [plugin, $activeItemEl]);
                }
            },

            toggle: function ($targetAnchor) {
                var plugin = this;

                plugin.flag = true;
                plugin.beforeChange($targetAnchor);

                if (
                    $targetAnchor
                        .closest(plugin.options.itemEl)
                        .hasClass(plugin.options.activeClassName)
                ) {
                    plugin._close($targetAnchor);
                } else {
                    plugin._open($targetAnchor);
                }
            },

            _open: function ($targetAnchor) {
                var plugin = this;
                var $targetItem = $targetAnchor.closest(plugin.options.itemEl),
                    $targetPanel = $("#" + $targetAnchor.attr("aria-controls"));

                if (plugin.initialized && plugin.options.mode === "slide") {
                    $targetPanel
                        .stop()
                        .slideDown(plugin.options.speed, plugin.options.easing, function () {
                            plugin.flag = false;
                            if (plugin.options.autoScroll) {
                                $("html, body")
                                    .stop()
                                    .animate(
                                        {
                                            scrollTop:
                                                $targetAnchor.offset().top -
                                                plugin.options.autoScrollTop
                                        },
                                        100
                                    );
                            }
                        });
                } else {
                    $targetPanel.stop().show();
                    plugin.flag = false;
                }

                $targetItem.addClass(plugin.options.activeClassName);
                $targetAnchor
                    .addClass(plugin.options.activeClassName)
                    .data(plugin._name + "_isOpen", true);
                $targetPanel.addClass(plugin.options.activeClassName);

                plugin._changeStatus($targetAnchor, true);

                if (plugin.options.autoFold) {
                    plugin.$anchor.not($targetAnchor).each(function () {
                        plugin._close($(this));
                    });
                }
            },

            _close: function ($targetAnchor) {
                var plugin = this;
                var $targetItem = $targetAnchor.closest(plugin.options.itemEl),
                    $targetPanel = $("#" + $targetAnchor.attr("aria-controls"));

                if (!$targetItem.length) return false;

                if (plugin.options.mode === "slide") {
                    $targetPanel
                        .stop()
                        .slideUp(plugin.options.speed, plugin.options.easing, function () {
                            plugin.flag = false;
                        });
                } else {
                    $targetPanel.stop().hide();
                    plugin.flag = false;
                }

                $targetAnchor
                    .removeClass(plugin.options.activeClassName)
                    .data(plugin._name + "_isOpen", false);
                $targetItem.removeClass(plugin.options.activeClassName);
                $targetPanel.removeClass(plugin.options.activeClassName);

                plugin._changeStatus($targetAnchor, false);
            },

            _changeStatus: function ($anchor, isOpen) {
                var plugin = this;
                $anchor.attr({
                    "aria-expanded": isOpen,
                    title: isOpen
                        ? plugin.options.expandedText
                        : plugin.options.collapsedText
                });
            },

            setAria: function () {
                var plugin = this;
                var tabsId = [];

                plugin.$anchor.each(function (index) {
                    var $this = $(this);
                    var _id = $this.attr("id")
                        ? $this.attr("id")
                        : UTIL.uuid("js-" + pluginName + "-");

                    $this
                        .data(plugin._name + "_target", plugin.$panel.eq(index))
                        .data("index", index)
                        .data("title", $.trim($this.text()))
                        .attr({
                            id: _id,
                            "aria-expanded": false,
                            "aria-controls": _id + "-panel",
                            title: plugin.options.collapsedText
                        });

                    tabsId.push(_id);
                });

                plugin.$panel.each(function (index) {
                    $(this)
                        .attr({
                            id: tabsId[index] + "-panel",
                            "aria-labelledby": tabsId[index],
                            role: "region"
                        })
                        .hide();
                });
            },

            removeAria: function () {
                var plugin = this;

                plugin.$anchor.each(function (index) {
                    var $this = $(this);

                    $this
                        .data(plugin._name + "_target", "")
                        .data("index", "")
                        .data("title", "")
                        .removeAttr("id aria-expanded aria-controls title");
                });

                plugin.$panel.each(function (index) {
                    $(this)
                        .removeAttr("id aria-labelledby role")
                        .hide();
                });
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if ($.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName).destroy();
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                } else {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };
        // accordion 제어
        function accor_opened(){
            $(".accor_opened").addClass('is-active');
            $(".accor_opened .accordion__top").addClass('is-active');
            $(".accor_opened .accordion__panel").addClass('is-active');
            $(".accor_opened .accordion__panel").css('display','block');
        }
        $(function () {
            $("[data-js=accordion]").accordion();
            accor_opened();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Checkbox */
    (function ($, win, doc, undefined) {
        var pluginName = "checkBox";

        var defaults = {
            allCheckCtrl: false, //true
            firstCheck: false, //true
            defaultChecked: false,
            checkboxEl: '[data-js="checkbox__input"]',
            hiddenEl: '[data-js="checkbox__hidden"]',
            allEl: '[data-js="checkbox__all"]',
            allSectionEl: "[data-js=checkbox__all-ctrl__section]"
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.uuid = UTIL.uuid(pluginName);
            this.allChecked = false;
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$checkbox = plugin.$element.find(plugin.options.checkboxEl);
                plugin.$checkboxDisabeld = plugin.$element
                    .find(plugin.options.checkboxEl)
                    .not("[aria-disabled=true]");
                plugin.$hidden = plugin.$element.find(plugin.options.hiddenEl);
                plugin.$allCheckbox = plugin.$element.find(plugin.options.allEl);
                plugin.$allCtrl = plugin.$element.find("[data-js=checkbox__all-ctrl]");

                if (plugin.options.firstCheck) {
                    plugin.$hidden.attr({
                        checked: "checked",
                        tabindex: -1
                    });
                } else {
                    plugin.$hidden.attr("tabindex", -1);
                }

                plugin.$allCheckbox.attr({
                    "aria-checked": plugin.options.firstCheck,
                    "aria-controls": "",
                    tabindex: 0
                });

                var checkboxId = "";

                plugin.$allCheckbox.each(function () {
                    plugin.initialSetting($(this));
                });

                plugin.$checkbox.each(function (idx) {
                    var $this = $(this);

                    if (plugin.options.allCheckCtrl) {
                        var _id = $this.attr("id")
                            ? $this.attr("id")
                            : UTIL.uuid("js-" + pluginName + "-");
                        $this.attr("id", _id);
                        idx > 0 ? (checkboxId += " " + _id) : (checkboxId += _id);
                    }

                    plugin.initialSetting($this);
                });

                plugin.initialSetting(plugin.$allCtrl);

                if (plugin.options.allCheckCtrl && plugin.options.defaultChecked) {
                    plugin.checked(plugin.$allCheckbox.not("[aria-disabled=true]"));
                    plugin.checked(plugin.$checkboxDisabeld);
                }

                plugin.$allCheckbox.attr("aria-controls", checkboxId);
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$checkbox.on(
                    "click." + plugin._name + " keydown." + plugin._name,
                    function (e) {
                        var keyCode = e.keyCode || e.which;
                        if (e.type === "click" || keyCode === 32) {
                            e.stopPropagation();
                            e.preventDefault();

                            if ($(this).attr("aria-disabled")) return false;
                            plugin.toggle($(this));
                        }
                    }
                );

                plugin.$allCheckbox.on(
                    "click." + plugin._name + " keydown." + plugin._name,
                    function (e) {
                        var keyCode = e.keyCode || e.which;
                        if (e.type === "click" || keyCode === 32) {
                            e.stopPropagation();
                            e.preventDefault();

                            if ($(this).attr("aria-disabled")) return false;
                            plugin.allCheck($(this));
                        }
                    }
                );

                plugin.$allCtrl.on(
                    "click." + plugin._name + "keydown." + plugin._name,
                    function (e) {
                        var $this = $(this);
                        var keyCode = e.keyCode || e.which;
                        var $allSection = $this.closest(plugin.options.allSectionEl);
                        if ($this.attr('aria-disabled')) return false;
                        if (e.type === "click" || keyCode === 32) {
                            e.stopPropagation();
                            e.preventDefault();

                            if ($this.attr("aria-checked") === "false") {
                                // plugin.checked($this, true)

                                $this.find(plugin.options.hiddenEl).prop("checked", true);
                                $this.attr("aria-checked", true);

                                if ($allSection.length) {
                                    $allSection.find(plugin.options.allEl).each(function () {
                                        if ($(this).attr("aria-checked") === "false") {
                                            plugin.allCheckAlone($(this), "noEvent");
                                        }
                                    });
                                } else {
                                    $(plugin.options.allEl).each(function () {
                                        if ($(this).attr("aria-checked") === "false") {
                                            plugin.allCheckAlone($(this), "noEvent");
                                        }
                                    });
                                }
                            } else if ($this.attr("aria-checked") === "true") {
                                // plugin.unchecked($this, true)

                                $this.find(plugin.options.hiddenEl).prop("checked", false);
                                $this.attr("aria-checked", false);

                                if ($allSection.length) {
                                    $allSection.find(plugin.options.allEl).each(function () {
                                        if ($(this).attr("aria-checked") === "true") {
                                            plugin.allCheckAlone($(this), "noEvent");
                                        }
                                    });
                                } else {
                                    $(plugin.options.allEl).each(function () {
                                        if ($(this).attr("aria-checked") === "true") {
                                            plugin.allCheckAlone($(this), "noEvent");
                                        }
                                    });
                                }
                            }

                            $this.find(plugin.options.hiddenEl).trigger("onChange");
                        }
                    }
                );

                plugin.$checkbox.on("checked." + plugin._name, function (e) {
                    plugin.checked($(this), true);
                });

                plugin.$checkbox.on("unchecked." + plugin._name, function (e) {
                    plugin.unchecked($(this), true);
                });
            },
            unbindEvents: function () {
                var plugin = this;

                plugin.$checkbox.off("." + plugin._name);

                if (plugin.$allCheckbox) plugin.$allCheckbox.off("." + plugin._name);
                if (plugin.$allCtrl) plugin.$allCtrl.off("." + plugin._name);
            },
            toggle: function ($this) {
                var plugin = this;

                if ($this.find(plugin.options.hiddenEl).prop("checked")) {
                    plugin.unchecked($this, true);
                } else {
                    plugin.checked($this, true);
                }

                plugin.stateChecking($this);


            },
            checked: function ($this, changeEvent) {
                var plugin = this;
                if (changeEvent) {
                    $this
                        .find(plugin.options.hiddenEl)
                        .prop("checked", true)
                        .change();
                } else {
                    $this.find(plugin.options.hiddenEl).prop("checked", true);
                }
                $this.attr("aria-checked", true);
            },
            unchecked: function ($this, changeEvent) {
                var plugin = this;
                if (changeEvent) {
                    $this
                        .find(plugin.options.hiddenEl)
                        .prop("checked", false)
                        .change();
                } else {
                    $this.find(plugin.options.hiddenEl).prop("checked", false);
                }
                $this.attr("aria-checked", false);
            },
            allCheckAlone: function ($target, checkEvent) {
                var plugin = this;
                var _checkEvent = checkEvent === "noEvent" ? false : true;
                var $wrap = $target.closest(plugin.options.allSectionEl);
                var $checkboxList = $wrap
                    .find(plugin.options.checkboxEl)
                    .not("[aria-disabled=true]");

                if ($target.find(plugin.options.hiddenEl).prop("checked")) {
                    plugin.unchecked($target, _checkEvent);
                    plugin.unchecked($checkboxList, false);
                    if (
                        $wrap.find("[data-js=checkbox__all-ctrl]").attr("aria-checked") ===
                        "true"
                    ) {
                        plugin.unchecked($wrap.find("[data-js=checkbox__all-ctrl]"), false);
                    }
                } else {
                    plugin.checked($target, _checkEvent);
                    plugin.checked($checkboxList, false);
                }

                plugin.allChecking($target);

                $target.find(plugin.options.hiddenEl).trigger("onChange");
            },
            allCheck: function ($this) {
                var plugin = this;
                var $wrap = $this.closest(plugin.options.allSectionEl);

                if ($this.find(plugin.options.hiddenEl).prop("checked")) {
                    plugin.unchecked($this, true);
                    plugin.unchecked(plugin.$checkboxDisabeld, false);
                    if (
                        $wrap.find("[data-js=checkbox__all-ctrl]").attr("aria-checked") ===
                        "true"
                    ) {
                        plugin.unchecked($wrap.find("[data-js=checkbox__all-ctrl]"), false);
                    }
                } else {
                    plugin.checked($this, true);
                    plugin.checked(plugin.$checkboxDisabeld, false);
                }

                plugin.allChecking($this);

                $this.find(plugin.options.hiddenEl).trigger("onChange");
            },
            allChecking: function ($this) {
                var plugin = this;
                var checkBasket = [];
                var $allSection = $this.closest(plugin.options.allSectionEl);

                $allSection.find(plugin.options.allEl).each(function () {
                    if ($(this).attr("aria-checked") === "true") {
                        checkBasket.push(true);
                    } else {
                        checkBasket.push(false);
                    }
                });

                if (checkBasket.indexOf(false) === -1) {
                    plugin.checked(
                        $allSection.find("[data-js=checkbox__all-ctrl]"),
                        false
                    );
                }
            },
            stateChecking: function ($this) {
                /* 2019-07-05 check callback 추가// */
                var plugin = this;
                var $wrap = $this.closest(plugin.options.allSectionEl);
                var $totalCtrl = $wrap.find("[data-js=checkbox__all-ctrl]");
                var $hiddenEl = $this.find(plugin.options.hiddenEl);

                // 전체선택 2depth (플랜트)
                var checkBoxLeng = plugin.$checkboxDisabeld.length,
                    checkLeng = plugin.$checkbox
                        .find(plugin.options.hiddenEl + ":checked")
                        .not(":disabled").length;

                if (checkBoxLeng === checkLeng) {
                    plugin.allChecked = true;
                    plugin.checked(plugin.$allCheckbox, false);
                } else {
                    plugin.allChecked = false;
                    plugin.unchecked(plugin.$allCheckbox, false);
                }

                // 전체선택 1depth (최상위)
                var allLeng = $wrap
                    .find(plugin.options.allEl)
                    .find(plugin.options.hiddenEl + ":checked")
                    .not(":disabled").length;
                var totalLeng = $wrap.find(plugin.options.allEl).length;

                if (allLeng === totalLeng) {
                    plugin.checked($totalCtrl, false);
                } else {
                    plugin.unchecked($totalCtrl, false);
                }
                $hiddenEl.trigger("onChange2");
                /* //2019-07-05 check callback 추가 */
            },
            initialSetting: function ($target) {
                var plugin = this;

                var $hiddenEl = $target.find(plugin.options.hiddenEl);

                if ($target.attr("aria-disabled") === "true") {
                    $target
                        .attr({
                            tabindex: ""
                        })
                        .removeAttr("aria-checked")
                        .find(plugin.options.hiddenEl)
                        .attr("disabled", true);
                } else {
                    if ($hiddenEl.attr("checked") === "checked") {
                        $target.attr({
                            "aria-checked": true,
                            tabindex: 0
                        });
                    } else {
                        $target.attr({
                            "aria-checked": plugin.options.firstCheck,
                            tabindex: 0
                        });
                    }
                }

                if ($target.closest(".module-cart__li").length) {
                    var $title = $target
                        .closest(".module-cart__li")
                        .find(".module-cart__title");
                    var matchId = $title.attr("id")
                        ? $title.attr("id")
                        : UTIL.uuid("js-" + pluginName + "-");

                    $target.attr("aria-labelledby", matchId);
                    $title.attr("id", matchId);
                }
            },
            removeSetting: function () {
                var plugin = this;

                plugin.$allCheckbox.removeAttr("tabindex aria-checked data-index");
                plugin.$checkbox.removeAttr("tabindex aria-checked data-index");
            },
            destroy: function () {
                var plugin = this;

                plugin.unbindEvents();
                plugin.removeSetting();
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if ($.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName).destroy();
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                } else {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };
        $(function () {
            $("[data-js=checkbox]").checkBox();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Radio */
    (function ($, win, doc, undefined) {
        var pluginName = "radio";

        var defaults = {
            radioTitle: '[data-js="radio__title"]',
            radioEl: '[data-js="radio__input"]',
            hiddenEl: '[data-js="radio__hidden"]',
            labelEl: '[data-js="radio__label"]',
            initIndex: null,
            activeClassName: "is-active"
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;
                plugin.$element = $(plugin.element);
                plugin.$radioTitle = plugin.$element.find(plugin.options.radioTitle);
                plugin.$radio = plugin.$element.find(plugin.options.radioEl);
                plugin.$hidden = plugin.$element.find(plugin.options.hiddenEl);
                plugin.$label = plugin.$element.find(plugin.options.labelEl);

                plugin.initialSetting();
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$radio.on("click." + plugin._name + " keydown." + plugin._name, function (e) {
                    var $this = $(this);
                    var keyCode = e.keyCode || e.which;
                    var idx = parseInt($this.data("index"));

                    if ($(this).attr("aria-disabled")) return false;

                    if (e.type === "click" || keyCode === 32) {
                        plugin.checked($this);
                        plugin.defaultEventKill(e);
                    } else if (keyCode === 37 || keyCode === 38) {
                        if (idx === 0 && $this.attr("aria-checked") === "true") {
                            plugin.checked(
                                plugin.$element.find(
                                    "[data-index=" + (plugin.$radio.length - 1) + "]"
                                )
                            );
                        } else {
                            plugin.checked(
                                plugin.$element.find("[data-index=" + (idx - 1) + "]")
                            );
                        }

                        plugin.defaultEventKill(e);
                    } else if (keyCode === 39 || keyCode === 40) {
                        if (
                            idx === plugin.$radio.length - 1 &&
                            $this.attr("aria-checked") === "true"
                        ) {
                            plugin.checked(plugin.$radio.eq(0));
                        } else {
                            plugin.checked(plugin.$radio.eq(idx + 1));
                        }
                        plugin.defaultEventKill(e);
                    } else if (keyCode === 9 && e.shiftKey) {
                        if (plugin.options.radioFirst) {
                            e.preventDefault()
                            $('[data-js=modal__close]').focus();
                        }
                    }
                });

                plugin.$radio.on("checked." + plugin._name, function (e) {
                    var $this = $(this);
                    plugin.checked($this);
                });
            },
            unbindEvents: function () {
                var plugin = this;

                plugin.$radio.off("." + plugin._name);
            },
            checked: function ($self) {
                var plugin = this;

                if ($self.data("target")) {
                    $($self.data("target")).addClass(plugin.options.activeClassName);
                    $(plugin.$radio).each(function () {
                        $($(this).not($self).data("target")).removeClass(plugin.options.activeClassName);
                    });
                }

                $self
                    .attr({
                        "tabindex": 0,
                        "aria-checked": true
                    })
                    .focus()
                    .find(plugin.options.hiddenEl)
                    .prop("checked", true)
                    .change();

                plugin.$radio.not($self).each(function () {
                    $(this)
                        .removeAttr('tabindex')
                        .attr({
                            "aria-checked": false
                        })
                        .find(plugin.options.hiddenEl)
                        .prop("checked", false);
                });
            },
            initialSetting: function () {
                var plugin = this;

                var uuid = UTIL.uuid(plugin._name);

                plugin.$radio.each(function (idx) {
                    var $this = $(this);

                    if ($this.attr("aria-disabled") === "true") {
                        $this
                            .find(plugin.options.hiddenEl)
                            .attr({
                                tabindex: -1,
                                disabled: "disabled"
                            });
                    } else {
                        if (
                            $this.find(plugin.options.hiddenEl).attr("checked") === "checked"
                        ) {
                            $this.attr({
                                "aria-checked": true,
                                tabindex: 0,
                                "data-index": idx
                            });
                            $this
                                .find(plugin.options.hiddenEl)
                                .attr({
                                    checked: true,
                                    tabindex: -1
                                });
                        } else {
                            $this.attr({
                                "aria-checked": false,
                                tabindex: $this.index() === 0 ? 0 : -1,
                                "data-index": idx
                            });
                            $this.find(plugin.options.hiddenEl).attr({
                                checked: false,
                                tabindex: -1
                            });
                        }
                    }

                    if (idx == plugin.options.initIndex) {
                        plugin.checked($this);
                    }
                });
                plugin.$element.attr("aria-labelledby", uuid);
                plugin.$radioTitle.attr("id", uuid);
            },
            removeSetting: function () {
                var plugin = this;

                plugin.$radio.each(function (idx) {
                    var $this = $(this);

                    $this.removeAttr("aria-checked tabindex data-index");
                    $this
                        .find(plugin.options.hiddenEl)
                        .removeAttr("aria-checked tabindex");
                });
                plugin.$element.removeAttr("aria-labelledby");
                plugin.$radioTitle.removeAttr("id");
            },
            defaultEventKill: function (e) {
                e.stopPropagation();
                e.preventDefault();
            },
            destroy: function () {
                var plugin = this;
                plugin.removeSetting();
                plugin.unbindEvents();
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if ($.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName).destroy();
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                } else {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=radio]").radio();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Number Counting */
    (function ($, win, doc, undefined) {
        var pluginName = "numberCounting";

        var defaults = {
            input: "[data-js=numberCounting__input]",
            minusEl: "[data-js=numberCounting__minus]",
            plusEl: "[data-js=numberCounting__plus]",
            countingVal: 1
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$input = plugin.$element.find(plugin.options.input);
                plugin.$minus = plugin.$element.find(plugin.options.minusEl);
                plugin.$plus = plugin.$element.find(plugin.options.plusEl);

                plugin.$plus
                    .find(".blind")
                    .text("상품수량 " + plugin.options.countingVal + "개 추가");
                plugin.$minus
                    .find(".blind")
                    .text("상품수량 " + plugin.options.countingVal + "개 제거");
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$minus.on("click." + pluginName, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    plugin.down();
                });
                plugin.$plus.on("click." + pluginName, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    plugin.up();
                });
            },
            up: function () {
                var plugin = this;

                var prevVal = plugin.$input.val();
                var currentVal = parseInt(prevVal);
                plugin.$input.val(currentVal + plugin.options.countingVal);
            },
            down: function () {
                var plugin = this;

                var prevVal = plugin.$input.val();
                var currentVal = parseInt(prevVal);

                if (prevVal > 0) {
                    plugin.$input.val(currentVal - plugin.options.countingVal);
                }
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=numberCounting]").numberCounting();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Carousel */
    (function ($, win, doc, undefined) {
        var pluginName = "carousel";

        var defaults = {};

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.idx = 0;
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$inner = plugin.$element.find(".carousel__inner");
                plugin.$slide = plugin.$element.find(".carousel__item");
                // var dots = document.getElementsByClassName("dot");
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$element.find(".carousel__next").on("click", function () {
                    plugin.indexCounting(1);
                });
                plugin.$element.find(".carousel__prev").on("click", function () {
                    plugin.indexCounting(-1);
                });
            },
            indexCounting: function (idx) {
                var plugin = this;

                plugin.showSlide((plugin.idx += idx));
            },
            showSlide: function (idx) {
                var plugin = this;

                if (idx > plugin.$slide.length - 1) {
                    plugin.idx = 0;
                }
                if (idx < 0) {
                    plugin.idx = plugin.$slide.length - 1;
                }

                plugin.$inner.animate(
                    {
                        marginLeft: -(plugin.$slide.width() * plugin.idx)
                    },
                    300
                );
            },
            currentSlide: function (idx) {
                var plugin = this;

                plugin.showSlide((plugin.idx = idx));
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            // $('[data-js=carousel]').carousel();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Floating */
    (function ($, win, doc, undefined) {
        var pluginName = "floating";

        var defaults = {
            position: "top",
            top: 0,
            row: false,
            targetParent: "[data-js=floating__target-parent]",
            target: "[data-js=floating__target]",
            category: "[data-js=floating__category]",
            toggle: "[data-js=floating__category-toggle]",
            focusAnchor: "[data-js=floating__focus-anchor]",
            focusTarget: "[data-js=floating__focus-target]",
            dropdownButton: "[data-js=floating__dropdown-anchor]",
            dropdownList: "[data-js=floating__dropdown-list]",
            dropdownItem: "[data-js=floating__dropdown-li]",
            dropdownAnchor: "[data-js=floating__dropdown-link]",
            dropdownTitle: "[data-js=floating__dropdown-title]",
            activeClassName: "is-active",
            perceive: false
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.categoryWidth = 0;
            this.flag = false;
            this.dropdownFlag = false;
            this.dropdownMode = true;
            this.status = false;
            this.targetElm = [];
            this.targetOffsetTop = [];
            this.lastScrollTop = 0;
            this.didScroll = null;
            this.delta = 5;
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();

                plugin.options.perceive && plugin.setIntervalScroll();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$targetParent = plugin.$element.find(
                    plugin.options.targetParent
                );
                plugin.$target = plugin.$element.find(plugin.options.target);
                plugin.$category = plugin.$element.find(plugin.options.category);
                plugin.$focusAnchor = plugin.$element.find(plugin.options.focusAnchor);
                plugin.$focusTarget = plugin.$element.find(plugin.options.focusTarget);
                plugin.$dropdownButton = plugin.$element.find(
                    plugin.options.dropdownButton
                );
                plugin.$dropdownList = plugin.$element.find(
                    plugin.options.dropdownList
                );
                plugin.$dropdownItem = plugin.$element.find(
                    plugin.options.dropdownItem
                );
                plugin.$dropdownAnchor = plugin.$element.find(
                    plugin.options.dropdownAnchor
                );
                plugin.$dropdownTitle = $(plugin.options.dropdownTitle);
                plugin.$win = $(win);
                plugin.$doc = $(doc);
                plugin.$body = $('body');

                plugin.$dropdownFocusEl = UTIL.findFocusEl(plugin.$dropdownList);
                plugin.$dropdownAnchorLast = $(plugin.$dropdownFocusEl[1]);

                plugin.targetHeight = 0;

                plugin.$dropdownAnchor.each(function () {
                    $(this).hasClass('is-active') && plugin.replaceText(this);
                })

                plugin.top =
                    plugin.options.sectionInFloating === "single"
                        ? plugin.$element.offset().top + plugin.$target.outerHeight()
                        : plugin.$element.offset().top;

                plugin.bottom =
                    plugin.options.sectionInFloating === "single"
                        ? plugin.top +
                        (plugin.$element.outerHeight() - plugin.$target.outerHeight())
                        : plugin.top + (plugin.$element.outerHeight() - plugin.options.top);

                $(plugin.options.target).each(function (idx) {
                    var $this = $(this);

                    var options = $this.closest("[data-js=floating]").data("options");
                    if (typeof options === "object") {
                        if (options.dropdown) {
                            plugin.targetHeight += 45;
                        } else {
                            plugin.targetHeight += $this.outerHeight();
                        }
                    } else {
                        plugin.targetHeight += $this.outerHeight();
                    }
                });

                plugin.$focusAnchor.each(function (idx) {
                    var $this = $(this);

                    $this
                        .data(plugin._name + "_target", plugin.$focusTarget.eq(idx))
                        .data("index", idx);
                });
                plugin.$focusTarget.each(function (idx) {
                    $(this).attr({
                        tabindex: 0,
                        "data-index": idx
                    });
                });

                if (plugin.$dropdownItem.length == 1) {
                    plugin.$dropdownItem.css("width", "100%");
                    plugin.$dropdownButton.addClass("alone");
                    plugin.dropdownMode = false;
                }
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$win.on("scroll." + plugin._name, function (e) {
                    var scrTop = $(this).scrollTop();

                    if (plugin.options.perceive) {
                        plugin.didScroll = true;
                    }

                    if (plugin.options.sectionInFloating) {
                        plugin.sectionFloating(scrTop);
                    } else {
                        plugin.toggle("floating");
                        plugin.targetSwitch(scrTop);
                    }
                });

                plugin.$win.on("click." + pluginName, function (e) {
                    if (plugin.dropdownFlag) {
                        if (
                            !plugin.$target.is(e.target) &&
                            plugin.$target.has(e.target).length === 0
                        ) {
                            plugin.close();
                        }
                    }
                });

                plugin.$dropdownButton.on(
                    "click." + pluginName + " keydown." + pluginName,
                    function (e) {
                        var key = e.keyCode || e.which;
                        if (!plugin.dropdownMode) return;
                        if (e.shiftKey && key == 9) {
                            e.preventDefault();
                            plugin.$dropdownAnchorLast.focus();
                        } else if (e.type == "click" || key == 13) {
                            e.preventDefault();
                            plugin.toggle("dropdown");
                        }
                    }
                );

                plugin.$dropdownAnchorLast.on("keydown." + pluginName, function (e) {
                    var key = e.keyCode || e.which;

                    if (!plugin.dropdownFlag) return;

                    if (!e.shiftKey) {
                        if (key == 9 || key == 40) {
                            e.preventDefault();
                            plugin.$dropdownButton.focus();
                        }
                    }
                });

                // 섹션 이동
                plugin.$focusAnchor.on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var $this = $(this);
                    plugin.targetFoucs($this, $this.attr("href"));
                });

                plugin.$element.find('a').not(plugin.options.focusAnchor).on('click', function () {
                    // plugin.close(true);
                    plugin.removeBodyScroll(true);
                })
            },
            sectionFloating: function (scrTop) {
                var plugin = this;

                if (scrTop > plugin.bottom) {
                    plugin.unFloating();

                    plugin.$element.css({
                        position: "relative"
                    });

                    plugin.$target.css({
                        position: "absolute",
                        bottom: "0",
                        top: "auto",
                        width: "100%"
                    });
                } else if (scrTop >= plugin.top) {
                    plugin.$element.css({
                        position: ""
                    });

                    plugin.$target.css({
                        position: "",
                        bottom: "",
                        width: ""
                    });
                    plugin.floating();
                } else if (scrTop <= plugin.top) {
                    plugin.unFloating();
                }
            },
            toggle: function (toggleCase) {
                var plugin = this;
                if (toggleCase === "floating") {
                    if (plugin.getOffsetTop() < plugin.getScrollTop()) {
                        plugin.floating();
                    } else {
                        plugin.unFloating();
                    }
                } else if (toggleCase === "dropdown") {
                    plugin.status ? plugin.close() : plugin.open();
                }
            },
            floating: function () {
                var plugin = this;

                if (plugin.flag) return;

                plugin.$targetParent.css("height", plugin.$target.outerHeight());
                plugin.$target.addClass("is-floating").css("top", plugin.options.top);
                plugin.$category.addClass("section__dropdown");
                plugin.targerHeight = plugin.$category.outerHeight();
                plugin.$dropdownList.hide();
                plugin.flag = true;
                plugin.$dropdownButton.text()

                plugin.setAria();
            },
            unFloating: function () {
                var plugin = this;

                if (!plugin.flag) return;
                plugin.$dropdownList.show();
                if (!plugin.options.sectionInFloating)
                    plugin.$targetParent.css("height", "");
                plugin.$target.removeClass("is-floating").css("top", "");
                plugin.$category.removeClass("section__dropdown");
                plugin.removeDropdown(false);
                plugin.flag = false;
                plugin.status = false;
                plugin.dropdownFlag = false;

                plugin.removeAria();
                plugin.removePerceiveScroll();
            },
            getScrollTop: function () {
                var plugin = this;

                var scrollTop = plugin.$doc.scrollTop();

                return scrollTop;
            },
            getOffsetTop: function (target) {
                var plugin = this;
                if (target) {
                    return $(target).offset().top;
                } else if (plugin.options.position === "bottom") {
                    return (
                        plugin.$targetParent.offset().top +
                        plugin.$targetParent.height() -
                        plugin.options.top
                    );
                } else if (plugin.options.position === "middle") {
                    return (
                        plugin.$targetParent.offset().top +
                        plugin.$targetParent.height() / 2 -
                        plugin.options.top
                    );
                } else {
                    return plugin.$targetParent.offset().top - plugin.options.top;
                }
            },
            targetFoucs: function ($self, target) {
                var plugin = this;

                var $anchor = $self;
                var flag = false;

                plugin.close();

                $("html, body")
                    .stop()
                    .animate(
                        {
                            scrollTop: plugin.getOffsetTop(target) - plugin.targetHeight
                        },
                        300,
                        function () {
                            var relatedScrTop = $(win).scrollTop();
                            $(target).focus();
                            $(win).scrollTop(relatedScrTop);

                            if (!flag && $(target).hasClass("is-modal")) {
                                $(".cookit__anchor").trigger("click");
                                flag = true;
                            }
                        }
                    );
            },
            targetSwitch: function (scrollTop) {
                var plugin = this;

                $.each(plugin.$focusTarget, function (idx) {
                    var $this = $(this);
                    var result =
                        Math.floor($this.offset().top) - (plugin.targetHeight + 1);

                    if ($this.next().length) {
                        if (result <= scrollTop && $this.next().offset().top > scrollTop) {
                            plugin.activeClassCtrl($(plugin.$focusAnchor[idx]));
                        }
                    } else {
                        if (result <= scrollTop) {
                            plugin.activeClassCtrl($(plugin.$focusAnchor[idx]));
                        }
                    }
                });
            },
            activeClassCtrl: function ($self) {
                var plugin = this;

                plugin.$focusAnchor
                    .not($self)
                    .removeClass(plugin.options.activeClassName);
                $self.addClass(plugin.options.activeClassName);
                plugin.$dropdownButton.text($self.text());
            },
            open: function () {
                var plugin = this;

                if (plugin.dropdownFlag == true) return;

                plugin.dropdownFlag = true;

                plugin.$dropdownButton.attr("aria-expended", true);
                plugin.$dropdownList.slideDown(200);
                plugin.setDropdown();
                plugin.$body.data('scrollTop', plugin.$win.scrollTop())
                plugin.$body
                    .addClass('is-opened')
                    .css('top', -plugin.$body.data('scrollTop'))
                    .data('top', plugin.$body.data('scrollTop'));
            },
            close: function (anchorFlag) {
                var plugin = this;

                if (plugin.dropdownFlag == false) return;

                plugin.dropdownFlag = false;

                plugin.$dropdownButton.attr("aria-expended", false).focus();
                plugin.$dropdownList.slideUp(200);
                plugin.removeDropdown();
                plugin.removeBodyScroll();
            },
            removeBodyScroll: function (anchorFlag) {
                var plugin = this;
                plugin.$body.removeClass('is-opened');
                plugin.$body.css('top', '');

                !anchorFlag && plugin.$win.scrollTop(plugin.$body.data('scrollTop'));
                anchorFlag && plugin.$win.scrollTop(0);
                plugin.$win.trigger('scroll');
            },
            setDropdown: function () {
                var plugin = this;

                plugin.status = true;
                plugin.$category.addClass("section__dropdown--opened");
                plugin.$dropdownButton.addClass("is-opened");
            },
            removeDropdown: function () {
                var plugin = this;

                plugin.status = false;
                plugin.$category.removeClass("section__dropdown--opened");
                plugin.$dropdownButton.removeClass("is-opened");
            },
            setAria: function () {
                var plugin = this;

                plugin.$dropdownTitle.attr({
                    id: pluginName + "_title"
                });

                plugin.$dropdownButton.attr({
                    id: pluginName + "_btn",
                    "aria-labelledby": pluginName + "_title " + pluginName + "_btn",
                    "aria-haspopup": "listbox",
                    "aria-expended": false
                });
                plugin.$dropdownList.attr({
                    id: pluginName + "_btn",
                    role: "listbox",
                    "aria-labelledby": pluginName + "_title"
                });
                plugin.$dropdownItem.attr("role", "option");
            },
            removeAria: function () {
                var plugin = this;

                plugin.$dropdownButton.removeAttr(
                    "id aria-labelledby aria-haspopup aria-expended"
                );
                plugin.$dropdownList.removeAttr("id role aria-labelledby");
                plugin.$dropdownItem.removeAttr("role");
            },
            setIntervalScroll: function () {
                var plugin = this;

                setInterval(function () {
                    if (plugin.didScroll) {
                        plugin.perceiveScroll();
                        plugin.didScroll = false;
                    }
                }, 250);
            },
            perceiveScroll: function () {
                var plugin = this;
                var _scrollTop = $(win).scrollTop();

                if (Math.abs(plugin.lastScrollTop - _scrollTop) <= plugin.delta) return;

                if (_scrollTop > plugin.lastScrollTop && _scrollTop > 50) {
                    plugin.$target.removeClass("up");
                    plugin.removePerceiveScroll();
                    // down
                } else {
                    if (
                        _scrollTop + $(window).height() < $(document).height() &&
                        _scrollTop > 50
                    ) {
                        // up
                        plugin.$target.addClass("up");
                        plugin.setPerceiveScroll();
                    }
                }
                plugin.lastScrollTop = _scrollTop;
            },
            setPerceiveScroll: function () {
                var plugin = this;
                var headerHeight = 0;

                plugin.$target.each(function () {
                    headerHeight += $(this).outerHeight();
                });

                $('[data-js="floating__target"]')
                    .not(plugin.$target)
                    .css({
                        transform: "translate(0," + headerHeight + "px)"
                    });
            },
            removePerceiveScroll: function () {
                var plugin = this;

                $('[data-js="floating__target"]').each(function () {
                    $(this).css({
                        transform: ""
                    });
                });
            },
            replaceText: function (target) {
                var plugin = this;

                if (!target) return false;
                plugin.$dropdownButton.text($(target).text())
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=floating]").floating();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Sticky */
    (function ($, win, doc, undefined) {
        var pluginName = "sticky";

        var defaults = {
            position: "top",
            top: 0,
            defaultHeight: 45,
            section: "[data-js=sticky__section]",
            target: "[data-js=sticky__target]",
            targetParent: "[data-js=sticky__target-parent]",
            state: "[data-js=sticky__state]",
            stateList: "[data-js=sticky__state-list]",
            stateAnchor: "[data-js=sticky__state-anchor]",
            stateTop: "[data-js=sticky__top]",
            activeClassName: "is-floating",
            anchorActiveClassName: "is-active",
            title: "[data-js=sticky__title]"
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.stickyFlag = false;
            this.dropdownFlag = false;
            this.currentScrtop = 0;
            this.floatingHeight = 0;
            this.stickyHeight = 0;
            this._beforeBasket = [];
            this._afterBasket = [];
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$wrap = $(plugin.element);
                plugin.$section = plugin.$wrap.find(plugin.options.section);
                plugin.$target = plugin.$wrap.find(plugin.options.target);
                plugin.$targetParent = plugin.$wrap.find(plugin.options.targetParent);
                plugin.$state = plugin.$wrap.find(plugin.options.state);
                plugin.$stateList = plugin.$wrap.find(plugin.options.stateList);
                plugin.$stateAnchor = plugin.$wrap.find(plugin.options.stateAnchor);
                plugin.$stateTop = plugin.$wrap.find(plugin.options.stateTop);
                plugin.$title = plugin.$wrap.find(plugin.options.title);

                plugin.findFocusElements = UTIL.findFocusEl(plugin.$stateList);
                plugin.$stateListFirst = $(plugin.findFocusElements[0]);
                plugin.$stateListLast = $(plugin.findFocusElements[1]);

                plugin.$win = $(win);
                plugin.$body = $("html, body");

                plugin.$stateAnchor.each(function () {
                    plugin._beforeBasket.push($.trim($(this).text()));
                });

                plugin._beforeBasket.forEach(function (text) {
                    plugin._afterBasket.push(plugin.$title.text() + "-" + text);
                });

                plugin.stickyHeight =
                    plugin.$target.outerHeight() > 0
                        ? plugin.$target.outerHeight()
                        : plugin.options.defaultHeight;
                plugin.getfloatingHeight();
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$win.on("scroll." + plugin._name, function () {
                    plugin.currentScrtop = $(this).scrollTop();
                    plugin.getfloatingHeight();
                    plugin.toggle();
                    plugin.targetFocus();
                });

                plugin.$win.on("click." + pluginName, function (e) {
                    if (plugin.dropdownFlag) {
                        if (
                            !plugin.$target.is(e.target) &&
                            plugin.$target.has(e.target).length === 0
                        ) {
                            plugin.dropdownFlag = false;
                            plugin.$state.removeClass("is-open");
                        }
                    }
                });

                plugin.$state.on(
                    "click." + plugin._name + " keydown." + plugin._name,
                    function (e) {
                        var key = e.keyCode || e.which;

                        if (e.shiftKey && key == 9) {
                            e.preventDefault();
                            plugin.$stateListLast.focus();
                        } else if (e.type == "click" || key == 13) {
                            e.preventDefault();
                            plugin.toggle("dropdown");
                        }
                    }
                );

                plugin.$stateAnchor.on("click." + plugin._name, function (e) {
                    e.preventDefault();

                    plugin.moveFocus($(this));
                    plugin.dropdownFlag = false;
                    plugin.$state.removeClass("is-open");
                });

                plugin.$stateListLast.on("keydown." + plugin._name, function (e) {
                    var key = e.keyCode || e.which;
                    if (!plugin.dropdownFlag) return;
                    if (!e.shiftKey) {
                        if (key == 9 || key == 40) {
                            e.preventDefault();
                            plugin.$state.focus();
                        }
                    }
                });

                plugin.$stateTop.on("click." + plugin._name, function (e) {
                    e.preventDefault();

                    plugin.moveFocus($(this));
                });
            },
            toggle: function (type) {
                var plugin = this;

                var sectionTop =
                    plugin.getOffsetTop(plugin.$targetParent) - plugin.floatingHeight;
                var sectionBottom =
                    plugin.getOffsetTop(plugin.$wrap) +
                    plugin.$wrap.outerHeight() -
                    (plugin.floatingHeight + plugin.stickyHeight);
                if (type == "dropdown") {
                    plugin.dropdownFlag ? plugin.close() : plugin.open();
                } else {
                    if (
                        plugin.currentScrtop >= sectionTop &&
                        plugin.currentScrtop <= sectionBottom
                    ) {
                        plugin.fixed();
                    } else {
                        plugin.unFixed();
                    }
                }
            },
            fixed: function () {
                var plugin = this;

                if (plugin.stickyFlag) return;

                plugin.stickyFlag = true;
                plugin.setAria();
                plugin.$targetParent.css("height", plugin.$targetParent.height());
                plugin.$target.addClass(plugin.options.activeClassName).css({
                    top: 95,
                    "z-index": 99
                });
            },
            unFixed: function () {
                var plugin = this;

                if (!plugin.stickyFlag) return;
                plugin.stickyFlag = false;
                plugin.removeAria();
                plugin.$targetParent.css("height", "");
                plugin.dropdownFlag = false;
                plugin.$target.removeClass(plugin.options.activeClassName).css({
                    top: "",
                    "z-index": ""
                });
            },
            open: function () {
                var plugin = this;
                plugin.dropdownFlag = true;
                plugin.$state
                    .addClass("is-open")
                    .attr("aria-expended", plugin.dropdownFlag);
            },
            close: function () {
                var plugin = this;
                plugin.dropdownFlag = false;
                plugin.$state
                    .removeClass("is-open")
                    .attr("aria-expended", plugin.dropdownFlag);
            },
            targetFocus: function () {
                var plugin = this;

                $.each(plugin.$section, function (idx) {
                    var $this = $(this);
                    var result =
                        Math.floor($this.offset().top) -
                        (plugin.floatingHeight + plugin.stickyHeight);

                    if ($this.next().length) {
                        if (
                            result <= plugin.currentScrtop &&
                            $this.next().offset().top > plugin.currentScrtop
                        ) {
                            plugin.activeClass($(plugin.$stateAnchor[idx]));
                        }
                    } else {
                        if (result <= plugin.currentScrtop) {
                            plugin.activeClass($(plugin.$stateAnchor[idx]));
                        }
                    }
                });
            },
            getOffsetTop: function (target) {
                return target.offset().top;
            },
            getfloatingHeight: function () {
                var plugin = this;

                plugin.floatingHeight = 0;

                $.each($("[data-js=floating__target]"), function () {
                    var $this = $(this);
                    plugin.floatingHeight +=
                        $this.outerHeight() > 50 ? 45 : $this.outerHeight();
                });
            },
            moveFocus: function ($target) {
                var plugin = this;
                var $focusTarget = $($target.attr("href"));
                plugin.$body.stop().animate(
                    {
                        scrollTop:
                            $focusTarget.offset().top -
                            (plugin.floatingHeight + plugin.stickyHeight)
                    },
                    200,
                    function () {
                        $focusTarget.attr("tabindex", 0).focus();

                        setTimeout(function () {
                            plugin.$win.scrollTop(
                                $focusTarget.offset().top -
                                ($target.data("js") === "sticky__top" ? 125 : 140)
                            );
                        });
                    }
                );
            },
            activeClass: function ($this) {
                var plugin = this;

                plugin.$stateAnchor
                    .not($this)
                    .removeClass(plugin.options.anchorActiveClassName);
                $this.addClass(plugin.options.anchorActiveClassName);
                plugin.$state.text($this.text());
            },
            setAria: function () {
                var plugin = this;

                plugin.$title.attr({
                    id: pluginName + "_title"
                });

                plugin.$state.attr({
                    id: pluginName + "_btn",
                    "aria-labelledby": pluginName + "_title " + pluginName + "_btn",
                    "aria-haspopup": "listbox",
                    "aria-expended": false
                });
                plugin.$stateList.attr({
                    id: pluginName + "_btn",
                    role: "listbox",
                    "aria-labelledby": pluginName + "_title"
                });
                $.each(plugin.$stateAnchor, function (idx) {
                    $(this)
                        .text(plugin._afterBasket[idx])
                        .attr("role", "option");
                });
            },
            removeAria: function () {
                var plugin = this;

                plugin.$title.removeAttr("id");

                plugin.$state.removeAttr(
                    "id aria-labelledby aria-haspopup aria-expended"
                );
                plugin.$stateList.removeAttr("id role aria-labelledby");
                $.each(plugin.$stateAnchor, function (idx) {
                    $(this)
                        .text(plugin._beforeBasket[idx])
                        .removeAttr("role");
                });
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=sticky]").sticky();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Tooltip */
    (function ($, win, doc, undefined) {
        var pluginName = "tooltip";

        var defaults = {
            button: "[data-js=tooltip__button]",
            panel: "[data-js=tooltip__panel]",
            direction: "bottom"
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.flag = false;
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$button = plugin.$element.find(plugin.options.button);
                plugin.$panel =
                    plugin.options.type !== "sticky"
                        ? plugin.$element
                            .find(plugin.options.panel)
                            .appendTo("body")
                            .attr("tabindex", 0)
                        : plugin.$element.find(plugin.options.panel);
                plugin.$win = $(win);
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$button.on("click." + plugin._name, function (e) {
                    e.preventDefault();

                    plugin.toggle();
                });
                plugin.$win.on("click." + plugin._name, function (e) {
                    if (plugin.flag) {
                        if (
                            !plugin.$element.is(e.target) &&
                            plugin.$element.has(e.target).length === 0
                        ) {
                            plugin.close();
                        }
                    }
                });

                var focusElement = UTIL.findFocusEl(plugin.$panel);

                var focusFirst = $(focusElement[0]);
                var focusLast = $(focusElement[1]);

                focusFirst.on("keydown." + plugin._name, function (e) {
                    var keyCode = e.keyCode || e.which;
                    if (e.shiftKey && keyCode === 9) {
                        e.preventDefault();
                        focusLast.focus();
                    }
                });

                focusLast.on("keydown." + plugin._name, function (e) {
                    var keyCode = e.keyCode || e.which;
                    if (keyCode == 9 && !e.shiftKey) {
                        e.preventDefault();
                        focusFirst.focus();
                    }
                });
            },
            toggle: function () {
                var plugin = this;

                plugin.flag ? plugin.close() : plugin.open();
            },
            open: function () {
                var plugin = this;
                plugin.flag = true;

                plugin.$element.addClass("is-active");
                plugin.$button.addClass("is-active");

                var buttonOffset = plugin.$button.offset();
                var buttonWidth = plugin.$button.outerWidth();
                var buttonHeight = plugin.$button.outerHeight();

                var buttonTop;
                var buttonLeft = Math.floor(buttonOffset.left) + buttonWidth / 2;
                var winWidth = $(win).width();
                var panelWidth = plugin.$panel.outerWidth();
                var panelHeight = plugin.$panel.outerHeight();

                if (plugin.options.direction === "bottom") {
                    if (plugin.options.type === "sticky") {
                        buttonTop = buttonHeight;
                    } else {
                        buttonTop = Math.floor(buttonOffset.top) + 20;
                    }
                } else if (plugin.options.direction === "top") {
                    if (plugin.options.type === "sticky") {
                        buttonTop = Math.floor(buttonOffset.top) - (panelHeight + 10);
                    } else {
                        buttonTop = Math.floor(buttonOffset.top) - (panelHeight + 10);
                    }
                }

                if (buttonLeft + panelWidth / 2 > winWidth) {
                    plugin.$panel
                        .css({
                            top: buttonTop,
                            left:
                                winWidth - panelWidth - 15 < 30
                                    ? 15
                                    : winWidth - panelWidth - 15,
                            display: "block",
                            position: plugin.$panel.is('.tooltip__pannel--sticky') ? "fixed" : ""
                        })
                        .focus();
                } else {
                    plugin.$panel
                        .css({
                            top: buttonTop,
                            left:
                                buttonLeft - panelWidth / 2 < 30
                                    ? 15
                                    : buttonLeft - panelWidth / 2,
                            display: "block",
                            position: plugin.$panel.is('.tooltip__pannel--sticky') ? "fixed" : ""
                        })
                        .focus();
                }
            },
            close: function () {
                var plugin = this;

                plugin.flag = false;

                plugin.$element.removeClass("is-active");
                plugin.$panel.css({
                    top: "",
                    left: "",
                    display: ""
                });
                plugin.$button.removeClass("is-active").focus();
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=tooltip]").tooltip();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Swiper */
    (function ($, win, doc, undefined) {
        var pluginName = "swiper";

        var defaults = {
            wrap: "[data-js=swiper__wrapper]",
            item: "[data-js=swiper__item]"
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this._basket = [];
            this._secondBasket = [];
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.initSwiper();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$wrap = plugin.$element.find(plugin.options.wrap);
                plugin.$item = plugin.$element.find(plugin.options.item);
            },
            initSwiper: function () {
                var plugin = this;
                plugin.swiper = new Swiper(plugin.$element, $.extend({}, {
                    slidesPerView: "auto",
                    centeredSlides: true,
                    spaceBetween: 0,
                    loop: true,
                    on: {
                        init: function () {
                            plugin.setAccessibility();
                        },
                        slideChange: function () {
                            plugin.setAccessibility();
                        }
                    }
                }, plugin.options));
            },
            setAccessibility: function () {
                var plugin = this;

                var focusElements = plugin.getFocusElements([
                    ".swiper-slide-duplicate",
                    ".swiper-slide-duplicate *"
                ]); // array or string

                if (focusElements.length > 0) {
                    for (var i = 0; i <= focusElements.length; i++) {
                        $(focusElements[i]).attr({
                            "aria-hidden": true,
                            tabindex: -1
                        });
                    }
                }
            },
            getFocusElements: function (element) {
                var plugin = this;

                if ($.isArray(element)) {
                    for (var i = 0; i <= element.length; i++) {
                        plugin.findFocusElements(element[i]);
                    }
                } else if (typeof element === "string") {
                    plugin.findFocusElements(element);
                }

                return plugin._basket;
            },
            findFocusElements: function (element) {
                var plugin = this;

                plugin.$element.find(element).each(function (i, val) {
                    if (
                        val.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim) &&
                        parseInt(val.getAttribute("tabIndex")) !== -1
                    ) {
                        plugin._basket.push(val);
                    }
                });

                return plugin._basket;
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=swiper]").swiper();
        });
    })(jQuery, window, document, undefined);

    /* Plugin - Form Control */
    (function ($, win, doc, undefined) {
        var pluginName = "formCtrl";

        var defaults = {
            input: "[data-js=form-ctrl__input]",
            textarea: "[data-js=form-ctrl__textarea]",
            delete: "[data-js=form-ctrl__delete]",
            count: "[data-js=form-ctrl__count]",
            countCurrent: "[data-js=form-ctrl__count-current]",
            countTotal: "[data-js=form-ctrl__count-total]",
            activeClassName: "is-active",
            autoHeight: false //true
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;
                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;
                plugin.$element = $(plugin.element);
                plugin.$input = plugin.$element.find(plugin.options.input);
                plugin.$textarea = plugin.$element.find(plugin.options.textarea);
                plugin.$delete = plugin.$element.find(plugin.options.delete);
                plugin.$count = plugin.$element.find(plugin.options.count);
                plugin.$countCurrunt = plugin.$element.find(
                    plugin.options.countCurrent
                );
                plugin.$countTotal = plugin.$element.find(plugin.options.countTotal);
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$input
                    .on("keyup." + pluginName, function (e) {
                        plugin.toggle(this);
                    })
                    .keyup();

                plugin.$delete.on("click." + pluginName, function (e) {
                    e.preventDefault();
                    plugin.delete();
                });

                plugin.$textarea
                    .on("keyup." + pluginName + " input." + pluginName, function (e) {
                        plugin.count(e);

                        if (plugin.options.autoHeight) {
                            plugin.resize();
                        }
                    })
                    .keyup();
            },
            toggle: function (self) {
                var plugin = this;
                var $self = $(self);

                $self.val().length > 0 ? plugin.show() : plugin.hide();
            },
            show: function () {
                var plugin = this;

                if (plugin.$input.attr("class").indexOf("search") != -1) {
                    $(".search__util-button-box").hide();
                }
                plugin.$delete.addClass(plugin.options.activeClassName);
            },
            hide: function () {
                var plugin = this;

                plugin.$delete.removeClass(plugin.options.activeClassName);
                if (plugin.$input.attr("class").indexOf("search") != -1) {
                    $(".search__util-button-box").show();
                }
            },
            delete: function () {
                var plugin = this;
                plugin.$input.val("").focus();
                plugin.hide();
            },
            count: function (e) {
                var plugin = this;
                var maxLength = plugin.$countTotal.text() || 500;
                var curruntLength = plugin.$textarea.val().length;

                if (curruntLength <= maxLength) {
                    plugin.$countCurrunt.text(curruntLength);
                } else {
                    plugin.$textarea.val(plugin.$textarea.val().slice(0, maxLength));
                    plugin.$countCurrunt.text(plugin.$countTotal.text());
                }
            },
            resize: function () {
                var plugin = this;
                var paddingTop = plugin.$textarea.css("padding-top").replace("px", "");
                var paddingBtm = plugin.$textarea
                    .css("padding-bottom")
                    .replace("px", "");
                plugin.$textarea
                    .css({
                        height: "auto",
                        overflow: "hidden"
                    })
                    .height(plugin.$textarea[0].scrollHeight - paddingTop - paddingBtm);
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=form-ctrl]").formCtrl();
        });
    })(jQuery, window, document, undefined);

    /*
    Plugin - Modal
    *
    * Modal Open
    $('[data-js=modal]').trigger('open', $(uniqId)); Uniq ID
    * Modal Close
    * $('[data-js=modal]').trigger('close', $(uniqId)); Uniq ID
    *
    */
    (function ($, win, doc, undefined) {
        var pluginName = "modal";

        var defaults = {
            modal: "[data-js=modal__element]",
            modalContainer: "[data-js=modal__container]",
            close: "[data-js=modal__close]",
            button: "[data-js=modal__button]",
            datepickerSubmit: "[data-js=modal__datepicker-submit]",
            activeClassName: "is-open"
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.appendModal();
            this.init();
            this.open = $.proxy(this.open, this);
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;
                plugin.buildCache();
                plugin.bindEvents();
            },
            appendModal: function () {
                var plugin = this;

                $("#wrap")
                    .find(plugin.options.modal)
                    .each(function () {
                        $("[data-js=modal]").append($(this));
                    });
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$modal = plugin.$element.find(plugin.options.modal);
                plugin.$close = $(plugin.options.close);
                plugin.$win = $(win);
                plugin.$html = $("html");
                plugin.$body = $("html, body");
                plugin.$wrap = $("#wrap");
                plugin._basket = [];
                plugin._scrollBasket = [];
                plugin.$focusEl = null;

                plugin.$modal.attr("tabindex", 0);
                plugin.winOuterHeight = plugin.$win.outerHeight();
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$element.on("open." + pluginName, function (e, target) {
                    plugin.open(target);
                });

                plugin.$element.on("close." + pluginName, function (e, target) {
                    plugin.close(target);
                });

                $(doc).on("click." + pluginName, plugin.options.close, function (e) {
                    e.preventDefault();
                    var target = $(this).closest(plugin.options.modal);

                    plugin.close(target);

                    if ($(target).hasClass("modal-datepicker")) {
                        $(target).trigger("onCloseDatepicker");
                    }
                });

                $(doc).on("click." + pluginName, plugin.options.button, function (e) {
                    e.preventDefault();

                    plugin.open($($(this).data("modal-target")));
                    plugin.$focusEl = $(this);
                });
                $(doc).on(
                    "click." + plugin._name,
                    plugin.options.datepickerSubmit,
                    function (e) {
                        e.preventDefault();
                        var $target = $($(this).closest(plugin.options.modal));

                        plugin.close($(this).closest(plugin.options.modal));

                        if ($target.hasClass("modal-datepicker")) {
                            $target.trigger("onSubmitDatepicker");
                        }
                    }
                );
            },
            afterBindEvents: function (focusElementFirst, focusElementLast) {
                var plugin = this;
                focusElementFirst.on("keydown." + pluginName, function (e) {
                    var keyCode = e.keyCode || e.which;

                    if (e.shiftKey && keyCode === 9) {
                        e.preventDefault();
                        focusElementLast.focus();
                    }
                });

                focusElementLast.on("keydown." + pluginName, function (e) {
                    var keyCode = e.keyCode || e.which;

                    if (keyCode == 9 && !e.shiftKey) {
                        if (focusElementFirst.attr('role') === "radio") {
                            e.preventDefault()
                            plugin.$modal.find('[data-js=radio__input]:not([tabindex=-1])').focus();
                        } else {
                            e.preventDefault();
                            focusElementFirst.focus();
                        }
                    }
                });
            },
            getScrollTop: function () {
                var plugin = this;

                return plugin.$win.scrollTop();
            },
            setScrollTop: function (val) {
                var plugin = this;
                var $target = $("#" + plugin._basket[plugin._basket.length - 2]);

                if (plugin._basket.length <= 1) {
                    plugin.$html.addClass(plugin.options.activeClassName);
                    plugin.$wrap.scrollTop(val);
                } else {
                    $target.scrollTop(val);
                }
                plugin.setStyles($target);
            },
            removeScrollTop: function (val) {
                var plugin = this;
                var $target = $("#" + plugin._basket[plugin._basket.length - 1]);
                if (plugin._basket.length <= 1) {
                    plugin.$html.removeClass(plugin.options.activeClassName);
                    plugin.$body.scrollTop(val);
                } else {
                    $target.scrollTop(val);
                }
                plugin.removeStyles($target);
            },
            open: function (target) {
                if (target === undefined || $(target).hasClass('is-open')) return;
                var plugin = this;
                var $target = $(target);
                var targetId = $target.attr("id");
                               
                if(targetId == 'mainKv'){
                    $('.open-event-coupon').css('display','none');
                }
                var _focusElements = UTIL.findFocusEl(plugin.$modal);

                plugin.afterBindEvents($(_focusElements[0]), $(_focusElements[1]));

                plugin.getScrollTop();

                plugin._basket.push(targetId);
                plugin._scrollBasket.push(plugin.getScrollTop());

                plugin.setScrollTop(
                    plugin._scrollBasket[plugin._scrollBasket.length - 1]
                );

                $target
                    .addClass(plugin.options.activeClassName)
                    .css("z-index", 300 + plugin._basket.indexOf(targetId))
                    .attr({
                        role: "dialog",
                        "aria-modal": true
                    })
                    .focus()
                    .find(".slick-initialized").length &&
                    $target.find(".slick-initialized").slick("setPosition");

                if ($target.find('.modal__contents--iframe').length) {
                    $target.find('.modal__contents--iframe').css({
                        'height': plugin.$win.outerHeight() - 50,
                        'min-height': plugin.$win.outerHeight() - 50
                    });
                } else if (!$target.hasClass('modal--mini') && !$target.hasClass('modal--alert')) {
                    if ($target.find('.modal__header-fixed').length) {
                        $target.find('.modal__contents, .modal__contents--with-btn').css('min-height', plugin.$win.outerHeight());
                        plugin.$win.on('resize', function () {
                            $target.find('.modal__contents, .modal__contents--with-btn').css('min-height', $(this).outerHeight());
                        }).on('scroll', function () {
                            $target.find('.modal__contents, .modal__contents--with-btn').css('min-height', $(this).outerHeight());
                        })
                    } else {
                        $target.find('.modal__contents, .modal__contents--with-btn').css('min-height', plugin.winOuterHeight - 50);
                        plugin.$win.on('resize', function () {
                            $target.find('.modal__contents, .modal__contents--with-btn').css('min-height', $(this).outerHeight() - 50);
                        }).on('scroll', function () {
                            $target.find('.modal__contents, .modal__contents--with-btn').css('min-height', $(this).outerHeight() - 50);
                        })
                    }
                }
                $(window).scrollTop(0);
            },
            close: function (target, focusEl) {
                var plugin = this;
                var $target = $(target);
                var targetId = $target.attr("id");
                
                if(targetId == 'mainKv'){
                    $('.open-event-coupon').css('display','inline');
                }

                $target.removeClass(plugin.options.activeClassName);
                plugin.removeScrollTop(
                    plugin._scrollBasket[plugin._scrollBasket.length - 1]
                );
                plugin._basket.splice(plugin._basket.length - 1);
                plugin._scrollBasket.splice(plugin._scrollBasket.length - 1);

                if (plugin.$focusEl !== null) {
                    plugin.$focusEl.focus();
                }

                focusEl && $(focusEl).focus();
            },
            removeStyles: function ($target) {
                $target.css({
                    position: "",
                    overflow: "",
                    top: "",
                    left: "",
                    right: "",
                    bottom: "",
                    "z-index": ""
                });
            },
            setStyles: function ($target) {
                $target.css({
                    position: "fixed",
                    overflow: "hidden",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                });
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=modal]").modal();
        });
    })(jQuery, window, document, undefined);

    /*
     **Plugin - VideoCtrl
     */
    (function ($, win, doc, undefined) {
        var pluginName = "videoCtrl";

        var defaults = {
            videoEl: "[data-js=video-ctrl__video]",
            coverEl: "[data-js=video-ctrl__cover]",
            buttonEl: "[data-js=video-ctrl__play-button]",
            scroll: false
        };

        function Plugin(element, options) {
            this.element = element;
            this._name = pluginName;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.videoOffset = 0;
            this.flag = false;
            this.init();
        }
        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
                plugin.$video = plugin.$element.find(plugin.options.videoEl).hide();
                plugin.$cover = plugin.$element.find(plugin.options.coverEl);
                plugin.$coverImg = plugin.$cover.find("img");
                plugin.$button = plugin.$element.find(plugin.options.buttonEl);
                plugin.$win = $(win);
                plugin.$element.closest('.video-box').css('padding-bottom', 0);
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$button.on("click." + plugin._name, function (e) {
                    e.preventDefault();
                    plugin.toggle(plugin.$video[0]);
                });

                if (plugin.options.scroll) {
                    plugin.$win.on({
                        scroll: function () {
                            var scrTop = $(this).scrollTop();
                            var scrBtm = plugin.$win.height() + scrTop;
                            var currentOffset =
                                plugin.videoOffset + plugin.$video.outerHeight() / 2;

                            if (
                                plugin.videoOffset > 0 &&
                                scrBtm > currentOffset &&
                                scrTop < currentOffset
                            ) {
                                var playPromise = plugin.$video[0].play();

                                if (playPromise !== undefined) {
                                    playPromise
                                        .then(function () {
                                            if (plugin.flag) return;
                                            plugin.flag = true;
                                            plugin.$video[0].play();
                                            plugin.$cover.hide();
                                            plugin.$element.closest(".video-box").addClass("is-play");
                                        })
                                        .catch(function (error) {
                                            alert(error);
                                        });
                                }
                            } else {
                                if (!plugin.flag) return;
                                plugin.flag = false;
                                plugin.$video[0].pause();
                                plugin.$cover.show();
                                plugin.$element.closest(".video-box").removeClass("is-play");
                            }
                        },
                        load: function () {
                            plugin.getVideoOffset();
                        },
                        resize: function () {
                            plugin.getVideoOffset();
                        }
                    });
                }
            },
            toggle: function (video) {
                var plugin = this;
                if (video.paused) {
                    video.play();
                    plugin.$cover.hide();
                    plugin.$element.closest(".video-box").addClass("is-play");
                } else {
                    video.pause();
                    plugin.$element.closest(".video-box").removeClass("is-play");
                }
            },
            getVideoOffset: function () {
                var plugin = this;
                plugin.videoOffset = plugin.$element.offset().top;
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("[data-js=video-ctrl__mp4]").videoCtrl();
        });
    })(jQuery, window, document, undefined);

    /*
     ** Plugin - Resize Select
     */
    (function ($, win, doc, undefined) {
        var pluginName = "resizeselect";
        var arrowWidth = 0;

        function Plugin(element, options) {
            this.element = element;
            this._options = options;
            this._name = pluginName;
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
                plugin.resize();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$select = $(plugin.element);
            },
            bindEvents: function () {
                var plugin = this;
                plugin.$select.on("change", function () {
                    plugin.resize();
                });
            },
            resize: function () {
                var plugin = this;

                var text = plugin.$select.find("option:selected").text();
                var $fake = $("<span>")
                    .html(text)
                    .css({
                        "font-size": plugin.$select.css("font-size"),
                        visibility: "hidden"
                    });
                $fake.appendTo("body");
                plugin.$select.width($fake.width());
                $fake.remove();
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        // run by default
        $(function () {
            $("[data-js=resize-select]").resizeselect();
        });
    })(jQuery, window, document, undefined);

    /*
     ** Plugin - moduleToggle
     ** 상품모듈 이미지형, 리스트형 컨트롤
     */
    (function ($, win, doc, undefined) {
        var pluginName = "moduleToggle";

        var defaults = {
            stateButton: ".module-filter__sorting-product",
            productList: ".module-product",
            listClassName: "module-product--list",
            columnClassName: "module-product--column",
            buttonActiveClassName: "module-filter__sorting-product--thumb",
            thumbText: "썸네일형 보기",
            listText: "리스트형 보기"
        };

        function Plugin(element, options) {
            var plugin = this;

            plugin.$element = $(element);
            plugin.options = $.extend({}, defaults, options);
            plugin.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;

                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;
                plugin.$stateButton = plugin.$element.find(plugin.options.stateButton);
                plugin.$productList = plugin.$element.find(plugin.options.productList);

                plugin.flag = plugin.$stateButton.hasClass(
                    plugin.options.buttonActiveClassName
                )
                    ? true
                    : false;
                plugin.columnFlag = plugin.$productList.hasClass(
                    plugin.options.columnClassName
                )
                    ? true
                    : false;
                plugin.listFlag =
                    plugin.$productList.find("li").length > 0 ? true : false;
            },
            bindEvents: function () {
                var plugin = this;

                plugin.$stateButton.on("click", function (e) {
                    e.preventDefault();
                    if (!plugin.listFlag) return false;
                    plugin.toggle();
                });
            },
            toggle: function () {
                var plugin = this;
                if (plugin.flag) {
                    plugin.flag = false;
                    plugin.$stateButton
                        .removeClass(plugin.options.buttonActiveClassName)
                        .find(".blind")
                        .text(plugin.options.listText);
                    plugin.columnFlag &&
                        plugin.$productList.addClass(plugin.options.columnClassName);
                    plugin.$productList.removeClass(plugin.options.listClassName);
                } else {
                    plugin.flag = true;
                    plugin.$stateButton
                        .addClass(plugin.options.buttonActiveClassName)
                        .find(".blind")
                        .text(plugin.options.thumbText);
                    plugin.columnFlag &&
                        plugin.$productList.removeClass(plugin.options.columnClassName);
                    plugin.$productList.addClass(plugin.options.listClassName);
                }
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $(".module-container").moduleToggle();
        });
    })(jQuery, window, document, undefined);

    /*
     ** Plugin - Override Slick
     ** 슬릭 Default 설정 변경
     */
    (function ($, win, doc, undefined) {
        var pluginName = "overrideSlick";

        var defaults = {};

        function Plugin(element, options) {
            this.element = element;
            this._defaults = defaults;
            this.options = $.extend({}, this._defaults, options);
            this.init();
        }

        $.extend(Plugin.prototype, {
            init: function () {
                var plugin = this;
                plugin.buildCache();
                plugin.bindEvents();
            },
            buildCache: function () {
                var plugin = this;

                plugin.$element = $(plugin.element);
            },
            bindEvents: function () {
                var plugin = this;

                var initEvent = "init." + plugin._name,
                    refreshEvent = "refresh." + plugin._name,
                    beforeEvent = "beforeChange." + plugin._name,
                    breakpointEvent = "breakpoint." + plugin._name,
                    afterEvent = "afterChange." + plugin._name,
                    setPositionEvent = "setPosition." + plugin._name,
                    destroyEvent = "destroy." + plugin._name,
                    lazyLoadError = "lazyLoadError." + plugin._name;

                plugin.$element.on({
                    [initEvent]: function (e, slick) {
                        plugin.setCount(slick);
                        plugin.setTabindex(slick);
                    },
                    [setPositionEvent]: function (e, slick) {
                        plugin.removeTabindex(slick);
                        plugin.setTabindex(slick);
                    },
                    [refreshEvent]: function (e, slick) {
                        //refresh
                    },
                    [beforeEvent]: function (e, slick) {
                        //before
                        plugin.setTabindex(slick);
                    },
                    [afterEvent]: function (e, slick, currentSlide) {
                        plugin.removeTabindex(slick);
                        plugin.changeCount(slick, currentSlide);
                        $('.slick-slide').find('[data-js=checkbox__hidden]').attr("tabindex", -1);
                    },
                    [destroyEvent]: function (e, slick) {
                        //destroy
                    },
                    [lazyLoadError]: function (e, slick, image, imageSource) {
                        plugin.lazyLoadError(image);
                    }
                });
            },
            removeTabindex: function (slick) {
                // Dots tabindex 제거
                var _slick = slick;

                if (_slick.$dots) {
                    var $dots = _slick.$dots.find("button");

                    $dots.each(function () {
                        $(this).removeAttr("tabindex");
                    });
                }
            },
            setTabindex: function (slick) {
                var _slick = slick;

                $('.slick-slide').find('[data-js=checkbox__hidden]').attr("tabindex", -1);
                // $('.slick-slide').not('.slick-current').find('.inventory-box').hide();
                // $('.slick-current').find('.inventory-box').show();

            },
            setCount: function (slick) {
                // Slide number counting
                var _options = slick.options;

                var $slick = slick.$slider.closest("[data-js=slick]");
                var $statusTotal = $slick.find("[data-js=slick__status-total]");

                if (_options.status) {
                    $statusTotal.text(slick.$slides.length);
                }
                if ($(slick.target).find(".video-box").length) {
                    $(slick.target)
                        .find(".video-box")
                        .each(function () {
                            $(this).height($(slick.target).height());
                        });
                }
            },
            changeCount: function (slick, currentSlide) {
                // Slide number counting
                var _options = slick.options;
                var $slick = slick.$slider.closest("[data-js=slick]");
                var $statusCurrent = $slick.find("[data-js=slick__status-current]");

                if (_options.status) {
                    $statusCurrent.text(currentSlide + 1);
                }
            },
            lazyLoadError: function (image) {
                $(image).attr({
                    src: "/cjom/mobile/images/common/no-image2.png",
                    alt: "이미지가 없습니다."
                });
            }
        });

        $.fn[pluginName] = function (options) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(
                        this,
                        "plugin_" + pluginName,
                        new Plugin(this, options || $(this).data("options"))
                    );
                }
            });
        };

        $(function () {
            $("body").overrideSlick();
        });
    })(jQuery, window, document, undefined);

    /* Slick */
    $(function () {
        if ($(".brand-list__anchor--all").length) {
            $(window).resize(function () {
                setHeight();
            });

            setHeight();

            function setHeight() {
                $(".brand-list__logo--all").css({
                    height: $(".brand-list__anchor--all").width(),
                    "line-height": $(".brand-list__anchor--all").width() + "px"
                });
            }
        }
    });

    // scrollx-positioning
    $(function () {
        if ($("[data-js=scrollx-positioning]").length > 0) {
            $(win).load(function () {
                $("[data-js=scrollx-positioning]").each(function () {
                    var $wrap = $(this);

                    var opt = {
                        tablemode: false, // table mode
                        minimum: 0 // minimum item length
                    };

                    opt = $.extend({}, opt, $wrap.data("options"));

                    var $item = $wrap.find("[data-js=scrollx-positioning__item]");
                    var item_length = $item.length;

                    if (opt.minimum > item_length) {
                        $wrap.addClass("is-loaded");
                        return true;
                    }

                    if ($wrap.length === 1 && item_length > 0) {
                        var total_width = 0;
                        var lp = Number(
                            $item
                                .eq(0)
                                .css("padding-left")
                                .replace("px", "")
                        ); // first item padding-left

                        $item.each(function () {
                            // all items width
                            total_width += $(this).outerWidth();
                        });

                        var $target = $item.filter(".is-active");

                        if ($target.length == 0) {
                            $target = $item.find(".is-active");
                            if ($target.length > 0)
                                $target.closest("[data-js=scrollx-positioning__item]").eq(0);
                        } else {
                            $target = $target.eq(0);
                        }

                        if ($target.length > 0) {
                            var l =
                                $target.position().left +
                                Number($target.css("padding-left").replace("px", "")) +
                                Number($target.css("margin-left").replace("px", ""));
                            $wrap.scrollLeft(l - lp); // scrollLeft
                        }

                        if (opt.tablemode) {
                            //table mode
                            var screen_width = 0;
                            var fn_tablemodechange = function () {
                                screen_width = $(win).width();
                                if (total_width > screen_width) {
                                    // scroll
                                    $wrap.removeClass("is-tablemode");
                                    $item.css("width", "");
                                } else {
                                    // table
                                    $wrap.addClass("is-tablemode");
                                    $item.css("width", screen_width / item_length + "px");
                                }
                            };

                            fn_tablemodechange();
                            $(win).on("resize", fn_tablemodechange);
                        }

                        $wrap.addClass("is-loaded");
                    }
                });
            });
        }
    });

    /* Youtube Control */
    $(function () {
        var tag = document.createElement("script");

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // check IOS
        var isIOS =
            navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
        var youtubeReady = false;

        window.onYouTubeIframeAPIReady = function () {
            youtubeReady = true;
            cjom.youtubeComponent();
        };

        cjom.youtubeComponent = function () {
            if (!youtubeReady) return;

            $("[data-js=video-ctrl]").each(function () {
                var _ = $(this);
                var options = $(this).data("options");
                var $youtube = _.find("[data-js=video-ctrl__youtube]");
                var $youtubePlayer = _.find("[data-js=video-ctrl__youtube-player]");
                var $youtubeCover = _.find("[data-js=video-ctrl__cover]");
                var $youtubePlayButton = _.find("[data-js=video-ctrl__play-button]");
                $youtubePlayer.attr("id", UTIL.uuid("youtubePlayer-"));
                var elementOffset = 0;
                var iframe;

                var player = new YT.Player($youtubePlayer.attr("id"), {
                    playerVars: {
                        autoplay: 0,
                        controls: 1,
                        autohide: 1,
                        wmode: "opaque",
                        allowfullscreen: "allowfullscreen",
                        playsinline: 1,
                        modestbranding: 1
                    },
                    videoId: options.videoId,
                    host: "https://www.youtube.com",
                    origin: "https://www.youtube.com",
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });

                function play() {
                    _.removeClass("is-pause");
                    _.addClass("is-play");
                    // $youtubeCover.hide();
                    player.playVideo();
                }

                function stop() {
                    _.removeClass("is-play");
                    _.removeClass("is-pause");
                    // $youtubeCover.show();

                    player.stopVideo();
                }

                function pause() {
                    _.removeClass("is-play");
                    _.addClass("is-pause");
                    player.pauseVideo();
                }

                function fullscreen() {
                    var requestFullScreen =
                        iframe.requestFullScreen ||
                        iframe.mozRequestFullScreen ||
                        iframe.webkitRequestFullScreen;

                    if (requestFullScreen) {
                        requestFullScreen.bind(iframe)();
                    }
                }

                function onPlayerStateChange(event) {
                    if (event.data === 0) {
                        //ENDED
                        $youtubeCover.removeClass("is-play");
                        // $youtubeCover.removeClass('is-buffering');
                    } else if (event.data === 1) {
                        //PLAYING
                        // console.log('PLAYING');
                        // $youtubeCover.removeClass('is-buffering');
                    } else if (event.data === 2) {
                        //PAUSED
                        // console.log('PAUSED');
                    } else if (event.data === 3) {
                        //BUFFERING
                        // console.log('BUFFERING');
                        // $youtubeCover.addClass('is-buffering');
                    } else if (event.data === 5) {
                        //CUED
                        // console.log('CUED');
                    }
                }

                function fullscreenChangeHandler() {
                    var isFullScreen =
                        document.mozFullScreen ||
                        document.webkitIsFullScreen ||
                        document.msFullscreenElement != null;

                    if (!isFullScreen) {
                        stop();
                    }
                }

                function getVideoOffset() {
                    elementOffset = Math.floor(_.offset().top);
                }

                function onPlayerReady() {
                    iframe = $youtube.find("iframe")[0];

                    _.on("stop.youtube", stop);

                    // if(!isIOS) {
                    // 	iframe.addEventListener('fullscreenchange', fullscreenChangeHandler);
                    // 	iframe.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
                    // 	iframe.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
                    // 	iframe.addEventListener('MSFullscreenChange', fullscreenChangeHandler);
                    // }

                    $youtubePlayButton.on("click", function (e) {
                        // if(isIOS) stop();
                        // if(!isIOS) fullscreen();
                        e.preventDefault();
                        $(this).closest(".video-box__cover-box").css('display','none'); // 2019-07-03 수정
                        if (_.hasClass("is-play") && !_.hasClass("is-pause")) {
                            pause();
                        } else {
                            play();
                        }
                    });
                    if (options.scrollPlay) {
                        $(window).on({
                            scroll: function () {
                                var $this = $(this);
                                var scrTop = $(window).scrollTop();
                                var scrBtm = $(window).height() + scrTop;
                                var currentOffset = elementOffset + _.outerHeight() / 2;

                                if (Math.floor(currentOffset - elementOffset) < 100) {
                                    $(window).trigger("resize");
                                }

                                if (
                                    elementOffset > 0 &&
                                    scrBtm > currentOffset &&
                                    scrTop < currentOffset
                                ) {
                                    play();
                                } else {
                                    pause();
                                }
                            },
                            load: function () {
                                getVideoOffset();
                            },
                            resize: function () {
                                getVideoOffset();
                            },
                            orientationchange: function (e) {
                                $(window).trigger("scroll");
                            }
                        });
                    }

                    $youtubeCover.addClass("is-loaded");
                }
            });
        };
    });

    // todo : 삭제 예정
    var queryString = function () {
        var a = window.location.search.substr(1).split("&");
        if (a == "") return;
        var b = {};
        for (var i = 0; i < a.length; i++) {
            var p = a[i].split("=");
            //console.log(p)
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    };

    // todo : 삭제 예정
    $(function () {
        if (!queryString()) return;
        var pram = queryString();
        if (pram["modal"]) {
            $("[data-js=modal]").trigger("open", $("#" + pram["modal"]));
        }
        if (pram["tab"]) {
            var parm2 = pram["tab"].split(",");
            var target = parm2[0];
            var idx = parm2[1];
            $("#" + target).trigger("go", idx);
        }
    });

    function viewSwiper(idx) {
        $("[data-list-swper] .swiper-container").each(function () {
            var reviewSwiper = new Swiper($(this), {
                pagination: {
                    el: ".swiper-pagination",
                    type: "fraction"
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }
            });
            reviewSwiper.slideTo(idx, 0);
            stopSwiper(reviewSwiper);
        });
    }
    viewSwiper(0);

    function stopSwiper(obj) {
        $("[data-list-btn]").each(function () {
            $(this)
                .off("click.listBtn")
                .on("click.listBtn", function () {
                    $(this)
                        .closest("[data-list-swper]")
                        .addClass("photo-list");
                    $(this)
                        .closest(".modal__contents")
                        .addClass("modal__contents--black");
                    obj.destroy(true, true);
                });
        });
        startSwiper();
    }

    function startSwiper() {
        $("[data-list-swper]").each(function () {
            $(this)
                .find("li")
                .off("click.listLi")
                .on("click.listLi", function () {
                    var idx = $(this).index();
                    $(this)
                        .closest("[data-list-swper]")
                        .removeClass("photo-list");
                    $(this)
                        .closest(".modal__contents")
                        .addClass("modal__contents--black");
                    viewSwiper(idx);
                });
        });
    }

    // slick with video
    $(function () {
        $("[data-js=slick-with-video]").each(function (e) {
            var $wrap = $(this);
            var $slick = $wrap.find("[data-js=slick__track]");

            if ($slick.length) {
                var beforeSlide = 0; // before slide index

                $slick
                    .on("beforeChange", function (event, slick, currentSlide, nextSlide) {
                        if (currentSlide != nextSlide) {
                            // subtitles
                            beforeSlide = currentSlide;

                            var $currentSub = $wrap.find(
                                slick.$slides
                                    .eq(currentSlide)
                                    .find("[data-subtitles]")
                                    .attr("data-subtitles")
                            );

                            if ($currentSub.length) {
                                $currentSub.hide();

                                var $toggle__anchor = $currentSub.find(
                                    "[data-js=toggle__anchor]"
                                );
                                if ($toggle__anchor.hasClass("is-active"))
                                    $toggle__anchor.trigger("click");
                            }
                            //
                        }
                    })
                    .on("afterChange", function (event, slick, currentSlide) {
                        if (currentSlide != beforeSlide) {
                            var $before = slick.$slides.eq(beforeSlide);
                            // youtube stop
                            $before.find("[data-js=video-ctrl]").trigger("stop.youtube");
                            //

                            // mp4 stop
                            $before.find("[data-js=video-ctrl__mp4]").each(function () {
                                var $target = $(this);
                                var videoTag = $target
                                    .find("[data-js=video-ctrl__video]")
                                    .get(0);
                                videoTag.pause();
                                videoTag.currentTime = 0;
                                $target.find("[data-js=video-ctrl__cover]").show();
                            });
                            //

                            // subtitles
                            var $currentSub = $wrap.find(
                                slick.$slides
                                    .eq(currentSlide)
                                    .find("[data-subtitles]")
                                    .attr("data-subtitles")
                            );
                            if ($currentSub.length) $currentSub.show();
                            //
                        }
                    });
            }
        });
    });

    /*
     ** cjom.lazyLoad
     ** Lazy Load
     */
    cjom.lazyLoad = function () {
        $("*[data-src]").Lazy({
            beforeLoad: function (element) { },
            afterLoad: function (element) { },
            onError: function (element) {
                element.attr({
                    src: "/cjom/mobile/images/common/no-image2.png",
                    alt: "이미지가 없습니다."
                });
            },
            onFinishedAll: function () { },
            effect: "fadeIn"
        });
    };

    /*
     ** cjom.lineClamp
     ** 2줄 이상시 climp (작성한 상품평)
     */
    cjom.lineClamp = (function () {
        var CLIMP_CONTROL = "line-clamp";
        var flag = true;

        function toggle(anchor, panel) {
            flag ? open(anchor, panel) : close(anchor, panel);
        }

        function open(anchor, panel) {
            panel.removeClass(CLIMP_CONTROL);
            anchor.text("접기");
            flag = false;
        }

        function close(anchor, panel) {
            panel.addClass(CLIMP_CONTROL);
            anchor.text("더보기");
            flag = true;
        }

        return {
            init: function () {
                this.bindEvents();
            },
            bindEvents: function () {
                var _ = this;

                $(document).on("click", "[data-js=climp__anchor]", function (e) {
                    e.preventDefault();
                    _.toggle(this);
                });
            },
            toggle: function (self) {
                var _ = this;
                flag ? _.open(self) : _.close(self);
            },
            open: function (self) {
                var $self = $(self),
                    panel = $self.parent("[data-js=climp]");

                flag = false;
                panel.removeClass(CLIMP_CONTROL);
                $self.text("접기");
            },
            close: function (self) {
                var $self = $(self),
                    panel = $self.parent("[data-js=climp]");

                flag = true;
                panel.addClass(CLIMP_CONTROL);
                $self.text("더보기");
            }
        };
    })();

    /*
     ** cjom.appToggle
     ** 앱설정 토글 버튼
     */
    cjom.appToggle = (function () {
        var buttonText = "[data-js=app-toggle-button__text]";

        return {
            init: function () {
                this.bindEvents();
            },
            bindEvents: function () {
                var _ = this;

                $("[data-js=app-toggle-button]").on("click.appToggle", function (e) {
                    e.preventDefault();
                    _.toggle(this);
                });
            },
            toggle: function (self) {
                var $self = $(self);
                var _options = $self.data("options");

                if ($self.hasClass("is-active")) {
                    $self.removeClass("is-active");
                    $(buttonText).text(_options.defaultText);
                } else {
                    $self.addClass("is-active");
                    $(buttonText).text(_options.changeText);
                }
            }
        };
    })();

    /*
     **cjom.allMenuCtrl
     **전체메뉴 컨트롤
     */
    cjom.allMenuCtrl = (function () {
        return {
            init: function () {
                this.bindEvents();
                this.scrollValue = 0;
            },
            bindEvents: function () {
                var _ = this;

                $(document).on("click", "[data-js=all-menus__ctrl]", function (e) {
                    e.preventDefault();
                    _.toggle(this);
                });
            },
            toggle: function (self) {
                var _ = this;
                var $self = $(self);

                $self.attr("class").indexOf("close") === -1 ? _.open() : _.close();
            },
            open: function () {
                var _ = this;
                _.scrollValue = $(win).scrollTop();
                $('[data-js="all-menus"]')
                    .addClass("is-active")
                    .attr("tabindex", 0)
                    .one(
                        "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                        function () {
                            $("html").addClass("is-open");
                        }
                    );
            },
            close: function () {
                var _ = this;
                $('[data-js="all-menus"]')
                    .removeClass("is-active")
                    .attr("tabindex", -1);
                $("html").removeClass("is-open");
                $(win).scrollTop(_.scrollValue);
            }
        };
    })();

    /*
     ** cjom.datePicker
     ** 캘린더
     */
    cjom.datePicker = function () {
        if ($("[data-js=datepicker]")) {
            $("[data-js=datepicker]").each(function () {
                var $this = $(this);
                var customOptions =
                    $this.data("options") || $this.data("datepicker-options");
                var disabledDate = $this.data("disabled-date") || null;

                var defaultOptions = {
                    dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
                    monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                    showMonthAfterYear: true,
                    dateFormat: "yy-mm-dd",
                    yearSuffix: ".",
                    showOtherMonths: false,
                    defaultDate: "01-01-1985",
                    beforeShowDay: function (date) {
                        if (disabledDate !== null) {
                            var string = jQuery.datepicker.formatDate("yy-mm-dd", date);
                            return [disabledDate.indexOf(string) == -1];
                        }
                    }
                };
                if (customOptions && customOptions.setDate) {
                    $this
                        .datepicker($.extend({}, defaultOptions, customOptions))
                        .datepicker("setDate", customOptions.setDate);
                } else {
                    $this.datepicker($.extend({}, defaultOptions, customOptions));
                }
            });
        }

        if ($("[data-js=modalDatepicker]")) {
            $("[data-js=modalDatepicker]").each(function () {
                var $this = $(this);
                var $modal = $($this.data("modal-id"));
                var customOptions = $this.data("datepicker-options");

                var defaultOptions = {
                    autoCloseCancel: true,
                    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
                    dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
                    monthNames: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
                    showMonthAfterYear: true,
                    dateFormat: "yy-mm-dd",
                    yearSuffix: ".",
                    showOtherMonths: false,
                    beforeShowDay: function (date) {
                        var disabledDate = $(this).data("disabled-date") || null;
                        if (disabledDate !== null) {
                            var string = jQuery.datepicker.formatDate("yy-mm-dd", date);
                            return [disabledDate.indexOf(string) == -1];
                        }
                    },
                    onClose: function () {
                        $("[data-js=modal]").trigger("close", $modal);
                    }
                };

                if (customOptions && customOptions.setDate) {
                    $this
                        .datepicker($.extend({}, defaultOptions, customOptions))
                        .datepicker("setDate", customOptions.setDate);
                } else {
                    $this.datepicker($.extend({}, defaultOptions, customOptions));
                }
            });
        }

        // datepicker 출고일 변경팝업 커스터마이징
        $("[data-js=modal-datepicker]").on("click", function () {
            var $this = $(this);
            var $modal = $($this.data("modal-id"));
            var datepicker = "[data-js=modalDatepicker]";
            var prevDate = $this.val();
            var defaultDatepickerOptions = $modal
                .find(datepicker)
                .data("datepicker-options");

            if (defaultDatepickerOptions) {
                $modal
                    .find(datepicker)
                    .datepicker("setDate", defaultDatepickerOptions.setDate);
            } else {
                $modal.find(datepicker).datepicker("setDate", prevDate);
            }

            var disabledDateTemp = $modal.find(datepicker).attr("data-disabled-date");
            $modal.find(datepicker).datepicker("option", "beforeShowDay", function (date) {
                if (disabledDateTemp !== null) {
                    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                    return [disabledDateTemp.indexOf(string) == -1];
                }
            });

            $("[data-js=modal]").trigger("open", $modal);

            $modal
                .off("onCloseDatepicker")
                .on("onCloseDatepicker", function () {
                    $modal.datepicker("setDate", prevDate);
                })
                .off("onSubmitDatepicker")
                .on("onSubmitDatepicker", function () {
                    $this.val($(datepicker).val());
                });
        });
    };

    /*
     ** cjom.inputNumberMaxlength
     ** input[type=number] maxlength 체크
     */
    cjom.inputNumberMaxlength = (function () {
        return {
            init: function () {
                this.bindEvents();
            },
            bindEvents: function () {
                var _ = this;

                $("input[type=number]").on("keydown", function () {
                    var maxLength = $(this).attr("maxlength");
                    var value = $(this).val();
                    if (value.length >= maxLength - 1) {
                        $(this).val(value.slice(0, maxLength - 1));
                    }
                });
            }
        };
    })();

    /*
     ** cjom.glider
     ** Glider plugin Initialized
     */
    cjom.glider = (function () {
        var defaults = {
            draggable: false,
            slidesToScroll: 1,
            slidesToShow: 1
        };
        // 메인 BEST - RESPONSIVE OPTIONS
        var bestResponsive = {
            responsive: [
                {
                    breakpoint: 400,
                    settings: {
                        slidesToShow: " 3.43"
                    }
                }
            ]
        };


        $(function () {
            $("[data-js=carousel]").on('glider-slide-visible', function () {
                $(this).find('.glider-dot').attr('tabindex', -1)
            })
        })

        return {
            init: function () {
                var _ = this;

                $("[data-js=carousel]").each(function () {
                    var _this = this;
                    var $this = $(this);

                    var options = $.extend(
                        {},
                        defaults,
                        $this.data("options"),
                        $this.hasClass("best") ? bestResponsive : {}
                    );

                    if (!$.data(this, "glider")) {
                        $.data(
                            this,
                            "glider",
                            new Glider(
                                _this.querySelector("[data-js=carousel__track]"),
                                options,
                                _this
                            )
                        );
                    }
                });
            },
            refresh: function (target) {
                var $target = $(target);

                // $target.data("glider").refresh();
            }
        };
    })();

    /*
     ** cjom.slick
     ** Plugin slick initialized
     */
    cjom.slick = function () {
        $("[data-js=slick]").each(function () {
            var $this = $(this);
            var $track = $this.find("[data-js=slick__track]");
            var options = $this.data("options");

            if (!$track.data("initialized")) {
                $track.data("initialized", true);
                $track.slick(
                    $.extend({}, {
                        SwipeToSlide: true,
                        focusOnSelect: true,
                        speed: 150,
                        touchThreshold: 100,
                    }, options)
                );
            }
        });
    };

    $(function () {
        if ($("*[data-src]").length) {
            cjom.lazyLoad(); // Lazy Load
        }
        cjom.datePicker(); // DatePicker
        cjom.lineClamp.init(); //작성한 상품평 2줄 이상시 climp
        cjom.appToggle.init(); // 앱설정 토글 버튼
        cjom.allMenuCtrl.init(); // 전체메뉴 컨트롤 Init
        cjom.inputNumberMaxlength.init(); // input type=number maxlength 체크
        cjom.glider.init();
        cjom.addColumn.init();
        cjom.slick();
    });

    /*
        ETC SCRIPTS
        이것저것...
    */
    $(function () {
        // CJ 포인트 다운로드 메시지 close
        $(document).on("click", ".my-benefit__point-message-close", function () {
            $(this)
                .parent(".my-benefit__point-message-box")
                .hide();
        });

        // 주문서 배송지 확인 플로팅 close
        $(document).on("click", ".floating__close", function () {
            var floatingParents = $(this).parent("div");
            if (floatingParents.hasClass("is-opened")) {
                floatingParents.removeClass("is-opened");
            }
        });
    });

    // stickyToggle
    $.fn.stickyToggle = function (v) {
        var $target = $(this);
        var $body = $('body');
        var $win = $(window);
        var activeClass = 'is-opened';
        var flag = v;

        if (!$target.length) return false;

        if (flag === undefined) {
            flag = $target.is(":visible") ? false : true;
        }

        if (flag) {
            // $target.slideDown();
            $target.show();
            $target.addClass(activeClass);
            if (!$body.hasClass(activeClass) && $target.hasClass('sticky-product')) {
                $body.data('scrollTop', $win.scrollTop())
                $body.css('top', -$body.data('scrollTop')).data('top', $body.data('scrollTop'));
                $body.addClass(activeClass);
            }
        } else {
            // $target.slideUp();
            $target.hide();
            $target.removeClass(activeClass);

            if ($('.sticky-product.is-opened').length === 0 && $target.hasClass('sticky-product')) {
                $body.removeClass(activeClass).css('top', '');
                $win.scrollTop($body.data('scrollTop'));
            }
        }

        return $target;
    };

    $(function () {
        if ($('img[usemap]').length) {
            $('img[usemap]').rwdImageMaps();
        }
    });

    cjom.toastPop = function (val) {
        val = typeof val === "undefined" ? "<strong>장바구니</strong>에 상품이 담겼습니다!" : val;
        var speed = 3000;
        $(".toggle-alert").remove();
        var $alertWrap = $("#contents").append("<div class='toggle-alert'>" + val + "</div>").find(".toggle-alert");
        setTimeout(function () {
            $alertWrap.addClass("is-active");
        }, 1);
        setTimeout(function () {
            $alertWrap.removeClass("is-active");
        }, speed);
        setTimeout(function () {
            $alertWrap.remove();
        }, speed + 300);
    };

    cjom.openEvent = (function () {
        var $win = $(window);
        var winWidth = $win.width();
        var bodyHeight = $('body').height();
        $('.open-event-coupon').each(function () {
            var randomTop = Math.floor(Math.random() * bodyHeight);
            var randomLeft = Math.floor(Math.random() * winWidth);
            $(this).css({
                top: (randomTop + 80) > bodyHeight ? bodyHeight - 80 : randomTop,
                left: (randomLeft + 80) > winWidth ? winWidth - 80 : randomLeft,
            }).show();
        })
    });

    $(function () {
        $("[data-close-tooltop]").each(function () {
            var $btn = $(this).find("button");
            $btn.off("click.tooltipClose").on("click.tooltipClose", function () {
                $(this)
                    .closest("[data-close-tooltop]")
                    .hide();
            });
        });
        cjom.openEvent();

    });


    $(function () {
        $("#video-ctrl").on("click", function () {
            var $this = $(this);

            if ($("#videoTest")[0].paused) {
                $("#videoTest")[0].play();
            } else {
                $("#videoTest")[0].pause();
            }
        });
    });

    $(function () {
        //상품 정보 이미지 더 보기 버튼

        $(doc).on("click", "[data-product-more]", function (e) {
            var $this = $(this);
            e.preventDefault();

            $($this.data("product-more")).removeAttr("style");
            $this.hide();
        });
    });

    cjom.addColumn = (function () {
        var defaults = {
            element: "[data-js=add-column]",
            list: "[data-js=add-column__list]",
            item: "[data-js=add-column__item]",
            button: "[data-js=add-column__button]",
            delete: "[data-js=add-column__delete]"
        };

        return {
            init: function () {
                var _ = this;

                _.bindEvents();
            },
            bindEvents: function () {
                var _ = this;

                $(doc).on("click", defaults.button, function (e) {
                    e.preventDefault();

                    _.addColumn($(this));
                });

                $(doc).on("click", defaults.delete, function (e) {
                    e.preventDefault();

                    _.removeColumn($(this));
                });
            },
            addColumn: function ($self) {
                $self
                    .closest(defaults.element)
                    .find(defaults.item)
                    .not(".is-active")
                    .eq(0)
                    .addClass("is-active");
            },
            removeColumn: function ($self) {
                $self
                    .closest(defaults.item)
                    .removeClass("is-active")
                    .appendTo(defaults.list)
                    .find("input[type=text]")
                    .val("");
            }
        };
    })();

    $(function () {
        $('.sticky-product__list').css({ maxHeight: 218 });
        $('.sticky-product__content').css({ overflow: 'hidden', position: 'relative', display: 'block', width: 'auto', height: 'auto' });

        var focusTarget = 'input[type=text], input[type=tel], input[type=search], input[type=number], input[type=password], input[type=email], textarea';

        if (/Android/i.test(navigator.userAgent)) {
            $(document)
                .on('focusin', focusTarget, function () {
                    var $this = $(this);

                    if (!$this.hasClass('search__input') && !$this.attr('data-js') === 'modal-datepicker') {
                        var currentScrollTop = $this.offset().top - 50;

                        $(window).scrollTop(currentScrollTop);
                    }
                })
                .on('focusout', focusTarget, function () {
                    // $('.modal__btn-box, [data-js=fixedButtonCtrl]').show();
                    //  
                })
        }

        var $fixedMenu = $('.fixed-menu__top').not('.fixed-menu__top--single');

        $(window).scroll(function () {
            $(this).scrollTop() > 0 ? $fixedMenu.css('display', 'block') : $fixedMenu.css('display', 'none');
        })
    })
})(jQuery, window, document, undefined);
