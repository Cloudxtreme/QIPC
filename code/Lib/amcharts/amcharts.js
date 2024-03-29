if (!AmCharts) var AmCharts = {};
AmCharts.themes = {};
AmCharts.inheriting = {};
AmCharts.Class = function(a) {
    var b = function() {
        arguments[0] !== AmCharts.inheriting && (this.events = {}, this.construct.apply(this, arguments))
    };
    a.inherits ? (b.prototype = new a.inherits(AmCharts.inheriting), b.base = a.inherits.prototype, delete a.inherits) : (b.prototype.createEvents = function() {
        for (var a = 0, b = arguments.length; a < b; a++) this.events[arguments[a]] = []
    }, b.prototype.listenTo = function(a, b, c) {
        a.events[b].push({
            handler: c,
            scope: this
        })
    }, b.prototype.addListener = function(a, b, c) {
        this.events[a].push({
            handler: b,
            scope: c
        })
    }, b.prototype.removeListener = function(a, b, c) {
        a = a.events[b];
        for (b = a.length - 1; 0 <= b; b--) a[b].handler === c && a.splice(b, 1)
    }, b.prototype.fire = function(a, b) {
        for (var c = this.events[a], g = 0, h = c.length; g < h; g++) {
            var k = c[g];
            k.handler.call(k.scope, b)
        }
    });
    for (var c in a) b.prototype[c] = a[c];
    return b
};
AmCharts.charts = [];
AmCharts.addChart = function(a) {
    AmCharts.charts.push(a)
};
AmCharts.removeChart = function(a) {
    for (var b = AmCharts.charts, c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1)
};
AmCharts.IEversion = 0;
AmCharts.isModern = !0;
AmCharts.navigator = navigator.userAgent.toLowerCase(); - 1 != AmCharts.navigator.indexOf("msie") && (AmCharts.IEversion = parseInt(AmCharts.navigator.split("msie")[1]), document.documentMode && (AmCharts.IEversion = Number(document.documentMode)), 9 > AmCharts.IEversion && (AmCharts.isModern = !1));
AmCharts.dx = 0;
AmCharts.dy = 0;
if (document.addEventListener || window.opera) AmCharts.isNN = !0, AmCharts.isIE = !1, AmCharts.dx = 0.5, AmCharts.dy = 0.5;
document.attachEvent && (AmCharts.isNN = !1, AmCharts.isIE = !0, AmCharts.isModern || (AmCharts.dx = 0, AmCharts.dy = 0));
window.chrome && (AmCharts.chrome = !0);
AmCharts.handleResize = function() {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var c = a[b];
        c && c.div && c.handleResize()
    }
};
AmCharts.handleMouseUp = function(a) {
    for (var b = AmCharts.charts, c = 0; c < b.length; c++) {
        var d = b[c];
        d && d.handleReleaseOutside(a)
    }
};
AmCharts.handleMouseMove = function(a) {
    for (var b = AmCharts.charts, c = 0; c < b.length; c++) {
        var d = b[c];
        d && d.handleMouseMove(a)
    }
};
AmCharts.resetMouseOver = function() {
    for (var a = AmCharts.charts, b = 0; b < a.length; b++) {
        var c = a[b];
        c && (c.mouseIsOver = !1)
    }
};
AmCharts.onReadyArray = [];
AmCharts.ready = function(a) {
    AmCharts.onReadyArray.push(a)
};
AmCharts.handleLoad = function() {
    AmCharts.isReady = !0;
    for (var a = AmCharts.onReadyArray, b = 0; b < a.length; b++)(0, a[b])()
};
AmCharts.useUTC = !1;
AmCharts.updateRate = 40;
AmCharts.uid = 0;
AmCharts.getUniqueId = function() {
    AmCharts.uid++;
    return "AmChartsEl-" + AmCharts.uid
};
AmCharts.isNN && (document.addEventListener("mousemove", AmCharts.handleMouseMove, !0), window.addEventListener("resize", AmCharts.handleResize, !0), document.addEventListener("mouseup", AmCharts.handleMouseUp, !0), window.addEventListener("load", AmCharts.handleLoad, !0));
AmCharts.isIE && (document.attachEvent("onmousemove", AmCharts.handleMouseMove), window.attachEvent("onresize", AmCharts.handleResize), document.attachEvent("onmouseup", AmCharts.handleMouseUp), window.attachEvent("onload", AmCharts.handleLoad));
AmCharts.clear = function() {
    var a = AmCharts.charts;
    if (a) for (var b = 0; b < a.length; b++) a[b].clear();
    AmCharts.charts = null;
    AmCharts.isNN && (document.removeEventListener("mousemove", AmCharts.handleMouseMove, !0), window.removeEventListener("resize", AmCharts.handleResize, !0), document.removeEventListener("mouseup", AmCharts.handleMouseUp, !0), window.removeEventListener("load", AmCharts.handleLoad, !0));
    AmCharts.isIE && (document.detachEvent("onmousemove", AmCharts.handleMouseMove), window.detachEvent("onresize", AmCharts.handleResize), document.detachEvent("onmouseup", AmCharts.handleMouseUp), window.detachEvent("onload", AmCharts.handleLoad))
};
AmCharts.makeChart = function(a, b) {
    var c = b.type,
        d = b.theme;
    AmCharts.isString(d) && (d = AmCharts.themes[d], b.theme = d);
    var f;
    switch (c) {
        case "serial":
            f = new AmCharts.AmSerialChart(d);
            break;
        case "xy":
            f = new AmCharts.AmXYChart(d);
            break;
        case "pie":
            f = new AmCharts.AmPieChart(d);
            break;
        case "radar":
            f = new AmCharts.AmRadarChart(d);
            break;
        case "gauge":
            f = new AmCharts.AmAngularGauge(d);
            break;
        case "funnel":
            f = new AmCharts.AmFunnelChart(d);
            break;
        case "map":
            f = new AmCharts.AmMap(d);
            break;
        case "stock":
            f = new AmCharts.AmStockChart(d)
    }
    AmCharts.extend(f, b);
    AmCharts.isReady ? f.write(a) : AmCharts.ready(function() {
        f.write(a)
    });
    return f
};
AmCharts.toBoolean = function(a, b) {
    if (void 0 === a) return b;
    switch (String(a).toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return !0;
        case "false":
        case "no":
        case "0":
        case null:
            return !1;
        default:
            return Boolean(a)
    }
};
AmCharts.removeFromArray = function(a, b) {
    var c;
    for (c = a.length - 1; 0 <= c; c--) a[c] == b && a.splice(c, 1)
};
AmCharts.getDecimals = function(a) {
    var b = 0;
    isNaN(a) || (a = String(a), -1 != a.indexOf("e-") ? b = Number(a.split("-")[1]) : -1 != a.indexOf(".") && (b = a.split(".")[1].length));
    return b
};
AmCharts.getStyle = function(a, b) {
    var c = "";
    document.defaultView && document.defaultView.getComputedStyle ? c = document.defaultView.getComputedStyle(a, "").getPropertyValue(b) : a.currentStyle && (b = b.replace(/\-(\w)/g, function(a, b) {
        return b.toUpperCase()
    }), c = a.currentStyle[b]);
    return c
};
AmCharts.removePx = function(a) {
    return Number(a.substring(0, a.length - 2))
};
AmCharts.getURL = function(a, b) {
    if (a) if ("_self" != b && b) if ("_top" == b && window.top) window.top.location.href = a;
    else if ("_parent" == b && window.parent) window.parent.location.href = a;
    else {
        var c = document.getElementsByName(b)[0];
        c ? c.src = a : window.open(a)
    } else window.location.href = a
};
AmCharts.ifArray = function(a) {
    return a && 0 < a.length ? !0 : !1
};
AmCharts.callMethod = function(a, b) {
    var c;
    for (c = 0; c < b.length; c++) {
        var d = b[c];
        if (d) {
            if (d[a]) d[a]();
            var f = d.length;
            if (0 < f) {
                var e;
                for (e = 0; e < f; e++) {
                    var g = d[e];
                    if (g && g[a]) g[a]()
                }
            }
        }
    }
};
AmCharts.toNumber = function(a) {
    return "number" == typeof a ? a : Number(String(a).replace(/[^0-9\-.]+/g, ""))
};
AmCharts.toColor = function(a) {
    if ("" !== a && void 0 !== a) if (-1 != a.indexOf(",")) {
        a = a.split(",");
        var b;
        for (b = 0; b < a.length; b++) {
            var c = a[b].substring(a[b].length - 6, a[b].length);
            a[b] = "#" + c
        }
    } else a = a.substring(a.length - 6, a.length), a = "#" + a;
    return a
};
AmCharts.toCoordinate = function(a, b, c) {
    var d;
    void 0 !== a && (a = String(a), c && c < b && (b = c), d = Number(a), -1 != a.indexOf("!") && (d = b - Number(a.substr(1))), -1 != a.indexOf("%") && (d = b * Number(a.substr(0, a.length - 1)) / 100));
    return d
};
AmCharts.fitToBounds = function(a, b, c) {
    a < b && (a = b);
    a > c && (a = c);
    return a
};
AmCharts.isDefined = function(a) {
    return void 0 === a ? !1 : !0
};
AmCharts.stripNumbers = function(a) {
    return a.replace(/[0-9]+/g, "")
};
AmCharts.roundTo = function(a, b) {
    if (0 > b) return a;
    var c = Math.pow(10, b);
    return Math.round(a * c) / c
};
AmCharts.toFixed = function(a, b) {
    var c = String(Math.round(a * Math.pow(10, b)));
    if (0 < b) {
        var d = c.length;
        if (d < b) {
            var f;
            for (f = 0; f < b - d; f++) c = "0" + c
        }
        d = c.substring(0, c.length - b);
        "" === d && (d = 0);
        return d + "." + c.substring(c.length - b, c.length)
    }
    return String(c)
};
AmCharts.formatDuration = function(a, b, c, d, f, e) {
    var g = AmCharts.intervals,
        h = e.decimalSeparator;
    if (a >= g[b].contains) {
        var k = a - Math.floor(a / g[b].contains) * g[b].contains;
        "ss" == b && (k = AmCharts.formatNumber(k, e), 1 == k.split(h)[0].length && (k = "0" + k));
        ("mm" == b || "hh" == b) && 10 > k && (k = "0" + k);
        c = k + "" + d[b] + "" + c;
        a = Math.floor(a / g[b].contains);
        b = g[b].nextInterval;
        return AmCharts.formatDuration(a, b, c, d, f, e)
    }
    "ss" == b && (a = AmCharts.formatNumber(a, e), 1 == a.split(h)[0].length && (a = "0" + a));
    ("mm" == b || "hh" == b) && 10 > a && (a = "0" + a);
    c = a + "" + d[b] + "" + c;
    if (g[f].count > g[b].count) for (a = g[b].count; a < g[f].count; a++) b = g[b].nextInterval, "ss" == b || "mm" == b || "hh" == b ? c = "00" + d[b] + "" + c : "DD" == b && (c = "0" + d[b] + "" + c);
    ":" == c.charAt(c.length - 1) && (c = c.substring(0, c.length - 1));
    return c
};
AmCharts.formatNumber = function(a, b, c, d, f) {
    a = AmCharts.roundTo(a, b.precision);
    isNaN(c) && (c = b.precision);
    var e = b.decimalSeparator;
    b = b.thousandsSeparator;
    var g;
    g = 0 > a ? "-" : "";
    a = Math.abs(a);
    var h = String(a),
        k = !1; - 1 != h.indexOf("e") && (k = !0);
    0 <= c && !k && (h = AmCharts.toFixed(a, c));
    var l = "";
    if (k) l = h;
    else {
        var h = h.split("."),
            k = String(h[0]),
            m;
        for (m = k.length; 0 <= m; m -= 3) l = m != k.length ? 0 !== m ? k.substring(m - 3, m) + b + l : k.substring(m - 3, m) + l : k.substring(m - 3, m);
        void 0 !== h[1] && (l = l + e + h[1]);
        void 0 !== c && 0 < c && "0" != l && (l = AmCharts.addZeroes(l, e, c))
    }
    l = g + l;
    "" === g && !0 === d && 0 !== a && (l = "+" + l);
    !0 === f && (l += "%");
    return l
};
AmCharts.addZeroes = function(a, b, c) {
    a = a.split(b);
    void 0 === a[1] && 0 < c && (a[1] = "0");
    return a[1].length < c ? (a[1] += "0", AmCharts.addZeroes(a[0] + b + a[1], b, c)) : void 0 !== a[1] ? a[0] + b + a[1] : a[0]
};
AmCharts.scientificToNormal = function(a) {
    var b;
    a = String(a).split("e");
    var c;
    if ("-" == a[1].substr(0, 1)) {
        b = "0.";
        for (c = 0; c < Math.abs(Number(a[1])) - 1; c++) b += "0";
        b += a[0].split(".").join("")
    } else {
        var d = 0;
        b = a[0].split(".");
        b[1] && (d = b[1].length);
        b = a[0].split(".").join("");
        for (c = 0; c < Math.abs(Number(a[1])) - d; c++) b += "0"
    }
    return b
};
AmCharts.toScientific = function(a, b) {
    if (0 === a) return "0";
    var c = Math.floor(Math.log(Math.abs(a)) * Math.LOG10E);
    Math.pow(10, c);
    mantissa = String(mantissa).split(".").join(b);
    return String(mantissa) + "e" + c
};
AmCharts.randomColor = function() {
    return "#" + ("00000" + (16777216 * Math.random() << 0).toString(16)).substr(-6)
};
AmCharts.hitTest = function(a, b, c) {
    var d = !1,
        f = a.x,
        e = a.x + a.width,
        g = a.y,
        h = a.y + a.height,
        k = AmCharts.isInRectangle;
    d || (d = k(f, g, b));
    d || (d = k(f, h, b));
    d || (d = k(e, g, b));
    d || (d = k(e, h, b));
    d || !0 === c || (d = AmCharts.hitTest(b, a, !0));
    return d
};
AmCharts.isInRectangle = function(a, b, c) {
    return a >= c.x - 5 && a <= c.x + c.width + 5 && b >= c.y - 5 && b <= c.y + c.height + 5 ? !0 : !1
};
AmCharts.isPercents = function(a) {
    if (-1 != String(a).indexOf("%")) return !0
};
AmCharts.findPosX = function(a) {
    var b = a,
        c = a.offsetLeft;
    if (a.offsetParent) {
        for (; a = a.offsetParent;) c += a.offsetLeft;
        for (;
            (b = b.parentNode) && b != document.body;) c -= b.scrollLeft || 0
    }
    return c
};
AmCharts.findPosY = function(a) {
    var b = a,
        c = a.offsetTop;
    if (a.offsetParent) {
        for (; a = a.offsetParent;) c += a.offsetTop;
        for (;
            (b = b.parentNode) && b != document.body;) c -= b.scrollTop || 0
    }
    return c
};
AmCharts.findIfFixed = function(a) {
    if (a.offsetParent) for (; a = a.offsetParent;) if ("fixed" == AmCharts.getStyle(a, "position")) return !0;
    return !1
};
AmCharts.findIfAuto = function(a) {
    return a.style && "auto" == AmCharts.getStyle(a, "overflow") ? !0 : a.parentNode ? AmCharts.findIfAuto(a.parentNode) : !1
};
AmCharts.findScrollLeft = function(a, b) {
    a.scrollLeft && (b += a.scrollLeft);
    return a.parentNode ? AmCharts.findScrollLeft(a.parentNode, b) : b
};
AmCharts.findScrollTop = function(a, b) {
    a.scrollTop && (b += a.scrollTop);
    return a.parentNode ? AmCharts.findScrollTop(a.parentNode, b) : b
};
AmCharts.formatValue = function(a, b, c, d, f, e, g, h) {
    if (b) {
        void 0 === f && (f = "");
        var k;
        for (k = 0; k < c.length; k++) {
            var l = c[k],
                m = b[l];
            void 0 !== m && (m = e ? AmCharts.addPrefix(m, h, g, d) : AmCharts.formatNumber(m, d), a = a.replace(RegExp("\\[\\[" + f + "" + l + "\\]\\]", "g"), m))
        }
    }
    return a
};
AmCharts.formatDataContextValue = function(a, b) {
    if (a) {
        var c = a.match(/\[\[.*?\]\]/g),
            d;
        for (d = 0; d < c.length; d++) {
            var f = c[d],
                f = f.substr(2, f.length - 4);
            void 0 !== b[f] && (a = a.replace(RegExp("\\[\\[" + f + "\\]\\]", "g"), b[f]))
        }
    }
    return a
};
AmCharts.massReplace = function(a, b) {
    for (var c in b) if (b.hasOwnProperty(c)) {
        var d = b[c];
        void 0 === d && (d = "");
        a = a.replace(c, d)
    }
    return a
};
AmCharts.cleanFromEmpty = function(a) {
    return a.replace(/\[\[[^\]]*\]\]/g, "")
};
AmCharts.addPrefix = function(a, b, c, d, f) {
    var e = AmCharts.formatNumber(a, d),
        g = "",
        h, k, l;
    if (0 === a) return "0";
    0 > a && (g = "-");
    a = Math.abs(a);
    if (1 < a) for (h = b.length - 1; - 1 < h; h--) {
        if (a >= b[h].number && (k = a / b[h].number, l = Number(d.precision), 1 > l && (l = 1), c = AmCharts.roundTo(k, l), l = AmCharts.formatNumber(c, {
            precision: -1,
            decimalSeparator: d.decimalSeparator,
            thousandsSeparator: d.thousandsSeparator
        }), !f || k == c)) {
            e = g + "" + l + "" + b[h].prefix;
            break
        }
    } else for (h = 0; h < c.length; h++) if (a <= c[h].number) {
        k = a / c[h].number;
        l = Math.abs(Math.round(Math.log(k) * Math.LOG10E));
        k = AmCharts.roundTo(k, l);
        e = g + "" + k + "" + c[h].prefix;
        break
    }
    return e
};
AmCharts.remove = function(a) {
    a && a.remove()
};
AmCharts.recommended = function() {
    var a = "js";
    document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") || swfobject && swfobject.hasFlashPlayerVersion("8") && (a = "flash");
    return a
};
AmCharts.getEffect = function(a) {
    ">" == a && (a = "easeOutSine");
    "<" == a && (a = "easeInSine");
    "elastic" == a && (a = "easeOutElastic");
    return a
};
AmCharts.getObjById = function(a, b) {
    var c, d;
    for (d = 0; d < a.length; d++) {
        var f = a[d];
        f.id == b && (c = f)
    }
    return c
};
AmCharts.applyTheme = function(a, b, c) {
    b || (b = AmCharts.theme);
    b && b[c] && AmCharts.extend(a, b[c])
};
AmCharts.isString = function(a) {
    return "string" == typeof a ? !0 : !1
};
AmCharts.extend = function(a, b, c) {
    for (var d in b) c ? a.hasOwnProperty(d) || (a[d] = b[d]) : a[d] = b[d];
    return a
};
AmCharts.copyProperties = function(a, b) {
    for (var c in a) a.hasOwnProperty(c) && "events" != c && void 0 !== a[c] && "function" != typeof a[c] && (b[c] = a[c])
};
AmCharts.processObject = function(a, b, c) {
    !1 === a instanceof b && (a = AmCharts.extend(new b(c), a));
    return a
};
AmCharts.fixNewLines = function(a) {
    var b = RegExp("\\n", "g");
    a && (a = a.replace(b, "<br />"));
    return a
};
AmCharts.fixBrakes = function(a) {
    if (AmCharts.isModern) {
        var b = RegExp("<br>", "g");
        a && (a = a.replace(b, "\n"))
    } else a = AmCharts.fixNewLines(a);
    return a
};
AmCharts.deleteObject = function(a, b) {
    if (a) {
        if (void 0 === b || null === b) b = 20;
        if (0 !== b) if ("[object Array]" === Object.prototype.toString.call(a)) for (var c = 0; c < a.length; c++) AmCharts.deleteObject(a[c], b - 1), a[c] = null;
        else try {
                for (c in a) a[c] && ("object" == typeof a[c] && AmCharts.deleteObject(a[c], b - 1), "function" != typeof a[c] && (a[c] = null))
            } catch (d) {}
    }
};
AmCharts.bounce = function(a, b, c, d, f) {
    return (b /= f) < 1 / 2.75 ? 7.5625 * d * b * b + c : b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + c : b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + c
};
AmCharts.easeInSine = function(a, b, c, d, f) {
    return -d * Math.cos(b / f * (Math.PI / 2)) + d + c
};
AmCharts.easeOutSine = function(a, b, c, d, f) {
    return d * Math.sin(b / f * (Math.PI / 2)) + c
};
AmCharts.easeOutElastic = function(a, b, c, d, f) {
    a = 1.70158;
    var e = 0,
        g = d;
    if (0 === b) return c;
    if (1 == (b /= f)) return c + d;
    e || (e = 0.3 * f);
    g < Math.abs(d) ? (g = d, a = e / 4) : a = e / (2 * Math.PI) * Math.asin(d / g);
    return g * Math.pow(2, -10 * b) * Math.sin(2 * (b * f - a) * Math.PI / e) + d + c
};
AmCharts.AxisBase = AmCharts.Class({
    construct: function(a) {
        this.viY = this.viX = this.y = this.x = this.dy = this.dx = 0;
        this.axisThickness = 1;
        this.axisColor = "#000000";
        this.axisAlpha = 1;
        this.gridCount = this.tickLength = 5;
        this.gridAlpha = 0.15;
        this.gridThickness = 1;
        this.gridColor = "#000000";
        this.dashLength = 0;
        this.labelFrequency = 1;
        this.showLastLabel = this.showFirstLabel = !0;
        this.fillColor = "#FFFFFF";
        this.fillAlpha = 0;
        this.labelsEnabled = !0;
        this.labelRotation = 0;
        this.autoGridCount = !0;
        this.valueRollOverColor = "#CC0000";
        this.offset = 0;
        this.guides = [];
        this.visible = !0;
        this.counter = 0;
        this.guides = [];
        this.ignoreAxisWidth = this.inside = !1;
        this.minGap = 75;
        this.titleBold = !0;
        this.minorGridEnabled = !1;
        this.minorGridAlpha = 0.07;
        AmCharts.applyTheme(this, a, "AxisBase")
    },
    zoom: function(a, b) {
        this.start = a;
        this.end = b;
        this.dataChanged = !0;
        this.draw()
    },
    fixAxisPosition: function() {
        var a = this.position;
        "H" == this.orientation ? ("left" == a && (a = "bottom"), "right" == a && (a = "top")) : ("bottom" == a && (a = "left"), "top" == a && (a = "right"));
        this.position = a
    },
    draw: function() {
        var a = this.chart;
        void 0 === this.titleColor && (this.titleColor = a.color);
        isNaN(this.titleFontSize) && (this.titleFontSize = a.fontSize + 1);
        this.allLabels = [];
        this.counter = 0;
        this.destroy();
        this.fixAxisPosition();
        this.labels = [];
        var b = a.container,
            c = b.set();
        a.gridSet.push(c);
        this.set = c;
        b = b.set();
        a.axesLabelsSet.push(b);
        this.labelsSet = b;
        this.axisLine = new this.axisRenderer(this);
        this.autoGridCount && ("V" == this.orientation ? (a = this.height / 35, 3 > a && (a = 3)) : a = this.width / this.minGap, this.gridCount = Math.max(a, 1));
        this.axisWidth = this.axisLine.axisWidth;
        this.addTitle()
    },
    setOrientation: function(a) {
        this.orientation = a ? "H" : "V"
    },
    addTitle: function() {
        var a = this.title;
        if (a) {
            var b = this.chart;
            this.titleLabel = AmCharts.text(b.container, a, this.titleColor, b.fontFamily, this.titleFontSize, "middle", this.titleBold)
        }
    },
    positionTitle: function() {
        var a = this.titleLabel;
        if (a) {
            var b, c, d = this.labelsSet,
                f = {};
            0 < d.length() ? f = d.getBBox() : (f.x = 0, f.y = 0, f.width = this.viW, f.height = this.viH);
            d.push(a);
            var d = f.x,
                e = f.y;
            AmCharts.VML && (this.rotate ? d -= this.x : e -= this.y);
            var g = f.width,
                f = f.height,
                h = this.viW,
                k = this.viH;
            a.getBBox();
            var l = 0,
                m = this.titleFontSize / 2,
                n = this.inside;
            switch (this.position) {
                case "top":
                    b = h / 2;
                    c = e - 10 - m;
                    break;
                case "bottom":
                    b = h / 2;
                    c = e + f + 10 + m;
                    break;
                case "left":
                    b = d - 10 - m;
                    n && (b -= 5);
                    c = k / 2;
                    l = -90;
                    break;
                case "right":
                    b = d + g + 10 + m - 3, n && (b += 7), c = k / 2, l = -90
            }
            this.marginsChanged ? (a.translate(b, c), this.tx = b, this.ty = c) : a.translate(this.tx, this.ty);
            this.marginsChanged = !1;
            0 !== l && a.rotate(l)
        }
    },
    pushAxisItem: function(a, b) {
        var c = a.graphics();
        0 < c.length() && (b ? this.labelsSet.push(c) : this.set.push(c));
        (c = a.getLabel()) && this.labelsSet.push(c)
    },
    addGuide: function(a) {
        this.guides.push(a)
    },
    removeGuide: function(a) {
        var b = this.guides,
            c;
        for (c = 0; c < b.length; c++) b[c] == a && b.splice(c, 1)
    },
    handleGuideOver: function(a) {
        clearTimeout(this.chart.hoverInt);
        var b = a.graphics.getBBox(),
            c = b.x + b.width / 2,
            b = b.y + b.height / 2,
            d = a.fillColor;
        void 0 === d && (d = a.lineColor);
        this.chart.showBalloon(a.balloonText, d, !0, c, b)
    },
    handleGuideOut: function(a) {
        this.chart.hideBalloon()
    },
    addEventListeners: function(a, b) {
        var c = this;
        a.mouseover(function() {
            c.handleGuideOver(b)
        });
        a.mouseout(function() {
            c.handleGuideOut(b)
        })
    },
    getBBox: function() {
        var a = this.labelsSet.getBBox();
        AmCharts.VML || (a = {
            x: a.x + this.x,
            y: a.y + this.y,
            width: a.width,
            height: a.height
        });
        return a
    },
    destroy: function() {
        AmCharts.remove(this.set);
        AmCharts.remove(this.labelsSet);
        var a = this.axisLine;
        a && AmCharts.remove(a.set);
        AmCharts.remove(this.grid0)
    }
});
AmCharts.ValueAxis = AmCharts.Class({
    inherits: AmCharts.AxisBase,
    construct: function(a) {
        this.createEvents("axisChanged", "logarithmicAxisFailed", "axisSelfZoomed", "axisZoomed");
        AmCharts.ValueAxis.base.construct.call(this, a);
        this.dataChanged = !0;
        this.gridCount = 8;
        this.stackType = "none";
        this.position = "left";
        this.unitPosition = "right";
        this.recalculateToPercents = this.includeHidden = this.includeGuidesInMinMax = this.integersOnly = !1;
        this.durationUnits = {
            DD: "d. ",
            hh: ":",
            mm: ":",
            ss: ""
        };
        this.scrollbar = !1;
        this.baseValue = 0;
        this.radarCategoriesEnabled = !0;
        this.gridType = "polygons";
        this.useScientificNotation = !1;
        this.axisTitleOffset = 10;
        this.minMaxMultiplier = 1;
        AmCharts.applyTheme(this, a, "ValueAxis")
    },
    updateData: function() {
        0 >= this.gridCount && (this.gridCount = 1);
        this.totals = [];
        this.data = this.chart.chartData;
        var a = this.chart;
        "xy" != a.chartType && (this.stackGraphs("smoothedLine"), this.stackGraphs("line"), this.stackGraphs("column"), this.stackGraphs("step"));
        this.recalculateToPercents && this.recalculate();
        this.synchronizationMultiplier && this.synchronizeWith ? (AmCharts.isString(this.synchronizeWith) && (this.synchronizeWith = a.getValueAxisById(this.synchronizeWith)), this.synchronizeWith && (this.synchronizeWithAxis(this.synchronizeWith), this.foundGraphs = !0)) : (this.foundGraphs = !1, this.getMinMax())
    },
    draw: function() {
        AmCharts.ValueAxis.base.draw.call(this);
        var a = this.chart,
            b = this.set;
        "duration" == this.type && (this.duration = "ss");
        !0 === this.dataChanged && (this.updateData(), this.dataChanged = !1);
        if (this.logarithmic && (0 >= this.getMin(0, this.data.length - 1) || 0 >= this.minimum)) this.fire("logarithmicAxisFailed", {
            type: "logarithmicAxisFailed",
            chart: a
        });
        else {
            this.grid0 = null;
            var c, d, f = a.dx,
                e = a.dy,
                g = !1,
                h = this.logarithmic,
                k = a.chartType;
            if (isNaN(this.min) || isNaN(this.max) || !this.foundGraphs || Infinity == this.min || -Infinity == this.max) g = !0;
            else {
                var l = this.labelFrequency,
                    m = this.showFirstLabel,
                    n = this.showLastLabel,
                    p = 1,
                    q = 0,
                    t = Math.round((this.max - this.min) / this.step) + 1,
                    r;
                !0 === h ? (r = Math.log(this.max) * Math.LOG10E - Math.log(this.minReal) * Math.LOG10E, this.stepWidth = this.axisWidth / r, 2 < r && (t = Math.ceil(Math.log(this.max) * Math.LOG10E) + 1, q = Math.round(Math.log(this.minReal) * Math.LOG10E), t > this.gridCount && (p = Math.ceil(t / this.gridCount)))) : this.stepWidth = this.axisWidth / (this.max - this.min);
                var s = 0;
                1 > this.step && -1 < this.step && (s = AmCharts.getDecimals(this.step));
                this.integersOnly && (s = 0);
                s > this.maxDecCount && (s = this.maxDecCount);
                var w = this.precision;
                isNaN(w) || (s = w);
                this.max = AmCharts.roundTo(this.max, this.maxDecCount);
                this.min = AmCharts.roundTo(this.min, this.maxDecCount);
                var v = {};
                v.precision = s;
                v.decimalSeparator = a.numberFormatter.decimalSeparator;
                v.thousandsSeparator = a.numberFormatter.thousandsSeparator;
                this.numberFormatter = v;
                var u, A = this.guides,
                    F = A.length;
                if (0 < F) {
                    c = this.fillAlpha;
                    for (d = this.fillAlpha = 0; d < F; d++) {
                        var y = A[d],
                            z = NaN,
                            H = y.above;
                        isNaN(y.toValue) || (z = this.getCoordinate(y.toValue), u = new this.axisItemRenderer(this, z, "", !0, NaN, NaN, y), this.pushAxisItem(u, H));
                        var I = NaN;
                        isNaN(y.value) || (I = this.getCoordinate(y.value), u = new this.axisItemRenderer(this, I, y.label, !0, NaN, (z - I) / 2, y), this.pushAxisItem(u, H));
                        isNaN(z - I) || (u = new this.guideFillRenderer(this, I, z, y), this.pushAxisItem(u, H), u = u.graphics(), y.graphics = u, y.balloonText && this.addEventListeners(u, y))
                    }
                    this.fillAlpha = c
                }
                A = !1;
                for (d = q; d < t; d += p) F = AmCharts.roundTo(this.step * d + this.min, s), -1 != String(F).indexOf("e") && (A = !0, String(F).split("e"));
                this.duration && (this.maxInterval = AmCharts.getMaxInterval(this.max, this.duration));
                var s = this.step,
                    B, F = this.minorGridAlpha;
                this.minorGridEnabled && (B = this.getMinorGridStep(s, this.stepWidth * s));
                for (d = q; d < t; d += p) if (q = s * d + this.min, q = AmCharts.roundTo(q, this.maxDecCount + 1), !this.integersOnly || Math.round(q) == q) if (isNaN(w) || Number(AmCharts.toFixed(q, w)) == q) {
                    !0 === h && (0 === q && (q = this.minReal), 2 < r && (q = Math.pow(10, d)), A = -1 != String(q).indexOf("e") ? !0 : !1);
                    this.useScientificNotation && (A = !0);
                    this.usePrefixes && (A = !1);
                    A ? (u = -1 == String(q).indexOf("e") ? q.toExponential(15) : String(q), c = u.split("e"), u = Number(c[0]), c = Number(c[1]), u = AmCharts.roundTo(u, 14), 10 == u && (u = 1, c += 1), u = u + "e" + c, 0 === q && (u = "0"), 1 == q && (u = "1")) : (h && (u = String(q).split("."), v.precision = u[1] ? u[1].length : -1), u = this.usePrefixes ? AmCharts.addPrefix(q, a.prefixesOfBigNumbers, a.prefixesOfSmallNumbers, v, !0) : AmCharts.formatNumber(q, v, v.precision));
                    this.duration && (u = AmCharts.formatDuration(q, this.duration, "", this.durationUnits, this.maxInterval, v));
                    this.recalculateToPercents ? u += "%" : (c = this.unit) && (u = "left" == this.unitPosition ? c + u : u + c);
                    Math.round(d / l) != d / l && (u = void 0);
                    if (0 === d && !m || d == t - 1 && !n) u = " ";
                    c = this.getCoordinate(q);
                    this.labelFunction && (u = this.labelFunction(q, u, this));
                    u = new this.axisItemRenderer(this, c, u);
                    this.pushAxisItem(u);
                    if (q == this.baseValue && "radar" != k) {
                        var W, P, H = this.viW,
                            z = this.viH;
                        u = this.viX;
                        y = this.viY;
                        "H" == this.orientation ? 0 <= c && c <= H + 1 && (W = [c, c, c + f], P = [z, 0, e]) : 0 <= c && c <= z + 1 && (W = [0, H, H + f], P = [c, c, c + e]);
                        W && (c = AmCharts.fitToBounds(2 * this.gridAlpha, 0, 1), c = AmCharts.line(a.container, W, P, this.gridColor, c, 1, this.dashLength), c.translate(u, y), this.grid0 = c, a.axesSet.push(c), c.toBack())
                    }
                    if (!isNaN(B) && 0 < F && d < t - 1) {
                        u = this.gridAlpha;
                        this.gridAlpha = this.minorGridAlpha;
                        for (c = 1; c < s / B; c++) y = this.getCoordinate(q + B * c), y = new this.axisItemRenderer(this, y, "", !1, 0, 0, !1, !1, 0, !0), this.pushAxisItem(y);
                        this.gridAlpha = u
                    }
                }
                d = this.baseValue;
                this.min > this.baseValue && this.max > this.baseValue && (d = this.min);
                this.min < this.baseValue && this.max < this.baseValue && (d = this.max);
                h && d < this.minReal && (d = this.minReal);
                this.baseCoord = this.getCoordinate(d);
                a = {
                    type: "axisChanged",
                    target: this,
                    chart: a
                };
                a.min = h ? this.minReal : this.min;
                a.max = this.max;
                this.fire("axisChanged", a);
                this.axisCreated = !0
            }
            h = this.axisLine.set;
            a = this.labelsSet;
            this.positionTitle();
            "radar" != k ? (k = this.viX, d = this.viY, b.translate(k, d), a.translate(k, d)) : h.toFront();
            !this.visible || g ? (b.hide(), h.hide(), a.hide()) : (b.show(), h.show(), a.show())
        }
    },
    getMinorGridStep: function(a, b) {
        var c = [5, 4, 2];
        60 > b && c.shift();
        for (var d = Math.floor(Math.log(Math.abs(a)) * Math.LOG10E), f = 0; f < c.length; f++) {
            var e = a / c[f],
                g = Math.floor(Math.log(Math.abs(e)) * Math.LOG10E);
            if (!(0 < Math.abs(d - g))) if (1 > a) {
                if (g = Math.pow(10, -g) * e, g == Math.round(g)) return e
            } else if (e == Math.round(e)) return e
        }
    },
    stackGraphs: function(a) {
        var b = this.stackType;
        "stacked" == b && (b = "regular");
        "line" == b && (b = "none");
        "100% stacked" == b && (b = "100%");
        this.stackType = b;
        var c = [],
            d = [],
            f = [],
            e = [],
            g, h = this.chart.graphs,
            k, l, m, n, p = this.baseValue,
            q = !1;
        if ("line" == a || "step" == a || "smoothedLine" == a) q = !0;
        if (q && ("regular" == b || "100%" == b)) for (n = 0; n < h.length; n++) m = h[n], m.hidden || (l = m.type, m.chart == this.chart && m.valueAxis == this && a == l && m.stackable && (k && (m.stackGraph = k), k = m));
        for (k = this.start; k <= this.end; k++) {
            var t = 0;
            for (n = 0; n < h.length; n++) if (m = h[n], !m.hidden && (l = m.type, m.chart == this.chart && m.valueAxis == this && a == l && m.stackable && (l = this.data[k].axes[this.id].graphs[m.id], g = l.values.value, !isNaN(g)))) {
                var r = AmCharts.getDecimals(g);
                t < r && (t = r);
                isNaN(e[k]) ? e[k] = Math.abs(g) : e[k] += Math.abs(g);
                e[k] = AmCharts.roundTo(e[k], t);
                m = m.fillToGraph;
                q && m && (m = this.data[k].axes[this.id].graphs[m.id]) && (l.values.open = m.values.value);
                "regular" == b && (q && (isNaN(c[k]) ? (c[k] = g, l.values.close = g, l.values.open = this.baseValue) : (isNaN(g) ? l.values.close = c[k] : l.values.close = g + c[k], l.values.open = c[k], c[k] = l.values.close)), "column" != a || isNaN(g) || (l.values.close = g, 0 > g ? (l.values.close = g, isNaN(d[k]) ? l.values.open = p : (l.values.close += d[k], l.values.open = d[k]), d[k] = l.values.close) : (l.values.close = g, isNaN(f[k]) ? l.values.open = p : (l.values.close += f[k], l.values.open = f[k]), f[k] = l.values.close)))
            }
        }
        for (k = this.start; k <= this.end; k++) for (n = 0; n < h.length; n++) m = h[n], m.hidden || (l = m.type, m.chart == this.chart && m.valueAxis == this && a == l && m.stackable && (l = this.data[k].axes[this.id].graphs[m.id], g = l.values.value, isNaN(g) || (c = g / e[k] * 100, l.values.percents = c, l.values.total = e[k], "100%" == b && (isNaN(d[k]) && (d[k] = 0), isNaN(f[k]) && (f[k] = 0), 0 > c ? (l.values.close = AmCharts.fitToBounds(c + d[k], -100, 100), l.values.open = d[k], d[k] = l.values.close) : (l.values.close = AmCharts.fitToBounds(c + f[k], -100, 100), l.values.open = f[k], f[k] = l.values.close)))))
    },
    recalculate: function() {
        var a = this.chart.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            if (c.valueAxis == this) {
                var d = "value";
                if ("candlestick" == c.type || "ohlc" == c.type) d = "open";
                var f, e, g = this.end + 2,
                    g = AmCharts.fitToBounds(this.end + 1, 0, this.data.length - 1),
                    h = this.start;
                0 < h && h--;
                var k;
                e = this.start;
                c.compareFromStart && (e = 0);
                for (k = e; k <= g && (e = this.data[k].axes[this.id].graphs[c.id], f = e.values[d], isNaN(f)); k++);
                for (d = h; d <= g; d++) {
                    e = this.data[d].axes[this.id].graphs[c.id];
                    e.percents = {};
                    var h = e.values,
                        l;
                    for (l in h) e.percents[l] = "percents" != l ? h[l] / f * 100 - 100 : h[l]
                }
            }
        }
    },
    getMinMax: function() {
        var a = !1,
            b = this.chart,
            c = b.graphs,
            d;
        for (d = 0; d < c.length; d++) {
            var f = c[d].type;
            ("line" == f || "step" == f || "smoothedLine" == f) && this.expandMinMax && (a = !0)
        }
        a && (0 < this.start && this.start--, this.end < this.data.length - 1 && this.end++);
        "serial" == b.chartType && (!0 !== b.categoryAxis.parseDates || a || this.end < this.data.length - 1 && this.end++);
        a = this.minMaxMultiplier;
        this.min = this.getMin(this.start, this.end);
        this.max = this.getMax();
        a = (this.max - this.min) * (a - 1);
        this.min -= a;
        this.max += a;
        a = this.guides.length;
        if (this.includeGuidesInMinMax && 0 < a) for (b = 0; b < a; b++) c = this.guides[b], c.toValue < this.min && (this.min = c.toValue), c.value < this.min && (this.min = c.value), c.toValue > this.max && (this.max = c.toValue), c.value > this.max && (this.max = c.value);
        isNaN(this.minimum) || (this.min = this.minimum);
        isNaN(this.maximum) || (this.max = this.maximum);
        this.min > this.max && (a = this.max, this.max = this.min, this.min = a);
        isNaN(this.minTemp) || (this.min = this.minTemp);
        isNaN(this.maxTemp) || (this.max = this.maxTemp);
        this.minReal = this.min;
        this.maxReal = this.max;
        0 === this.min && 0 === this.max && (this.max = 9);
        this.min > this.max && (this.min = this.max - 1);
        a = this.min;
        b = this.max;
        c = this.max - this.min;
        d = 0 === c ? Math.pow(10, Math.floor(Math.log(Math.abs(this.max)) * Math.LOG10E)) / 10 : Math.pow(10, Math.floor(Math.log(Math.abs(c)) * Math.LOG10E)) / 10;
        isNaN(this.maximum) && isNaN(this.maxTemp) && (this.max = Math.ceil(this.max / d) * d + d);
        isNaN(this.minimum) && isNaN(this.minTemp) && (this.min = Math.floor(this.min / d) * d - d);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        "100%" == this.stackType && (this.min = 0 > this.min ? -100 : 0, this.max = 0 > this.max ? 0 : 100);
        c = this.max - this.min;
        d = Math.pow(10, Math.floor(Math.log(Math.abs(c)) * Math.LOG10E)) / 10;
        this.step = Math.ceil(c / this.gridCount / d) * d;
        c = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E));
        c = this.fixStepE(c);
        d = Math.ceil(this.step / c);
        5 < d && (d = 10);
        5 >= d && 2 < d && (d = 5);
        this.step = Math.ceil(this.step / (c * d)) * c * d;
        1 > c ? (this.maxDecCount = Math.abs(Math.log(Math.abs(c)) * Math.LOG10E), this.maxDecCount = Math.round(this.maxDecCount), this.step = AmCharts.roundTo(this.step, this.maxDecCount + 1)) : this.maxDecCount = 0;
        this.min = this.step * Math.floor(this.min / this.step);
        this.max = this.step * Math.ceil(this.max / this.step);
        0 > this.min && 0 <= a && (this.min = 0);
        0 < this.max && 0 >= b && (this.max = 0);
        1 < this.minReal && 1 < this.max - this.minReal && (this.minReal = Math.floor(this.minReal));
        c = Math.pow(10, Math.floor(Math.log(Math.abs(this.minReal)) * Math.LOG10E));
        0 === this.min && (this.minReal = c);
        0 === this.min && 1 < this.minReal && (this.minReal = 1);
        0 < this.min && 0 < this.minReal - this.step && (this.minReal = this.min + this.step < this.minReal ? this.min + this.step : this.min);
        c = Math.log(b) * Math.LOG10E - Math.log(a) * Math.LOG10E;
        this.logarithmic && (2 < c ? (this.minReal = this.min = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)), this.max = Math.pow(10, Math.ceil(Math.log(Math.abs(b)) * Math.LOG10E))) : (b = Math.pow(10, Math.floor(Math.log(Math.abs(this.min)) * Math.LOG10E)) / 10, a = Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E)) / 10, b < a && (this.minReal = this.min = 10 * a)))
    },
    fixStepE: function(a) {
        a = a.toExponential(0).split("e");
        var b = Number(a[1]);
        9 == Number(a[0]) && b++;
        return this.generateNumber(1, b)
    },
    generateNumber: function(a, b) {
        var c = "",
            d;
        d = 0 > b ? Math.abs(b) - 1 : Math.abs(b);
        var f;
        for (f = 0; f < d; f++) c += "0";
        return 0 > b ? Number("0." + c + String(a)) : Number(String(a) + c)
    },
    getMin: function(a, b) {
        var c, d;
        for (d = a; d <= b; d++) {
            var f = this.data[d].axes[this.id].graphs,
                e;
            for (e in f) if (f.hasOwnProperty(e)) {
                var g = this.chart.getGraphById(e);
                if (g.includeInMinMax && (!g.hidden || this.includeHidden)) {
                    isNaN(c) && (c = Infinity);
                    this.foundGraphs = !0;
                    g = f[e].values;
                    this.recalculateToPercents && (g = f[e].percents);
                    var h;
                    if (this.minMaxField) h = g[this.minMaxField], h < c && (c = h);
                    else for (var k in g) g.hasOwnProperty(k) && "percents" != k && "total" != k && (h = g[k], h < c && (c = h))
                }
            }
        }
        return c
    },
    getMax: function() {
        var a, b;
        for (b = this.start; b <= this.end; b++) {
            var c = this.data[b].axes[this.id].graphs,
                d;
            for (d in c) if (c.hasOwnProperty(d)) {
                var f = this.chart.getGraphById(d);
                if (f.includeInMinMax && (!f.hidden || this.includeHidden)) {
                    isNaN(a) && (a = -Infinity);
                    this.foundGraphs = !0;
                    f = c[d].values;
                    this.recalculateToPercents && (f = c[d].percents);
                    var e;
                    if (this.minMaxField) e = f[this.minMaxField], e > a && (a = e);
                    else for (var g in f) f.hasOwnProperty(g) && "percents" != g && "total" != g && (e = f[g], e > a && (a = e))
                }
            }
        }
        return a
    },
    dispatchZoomEvent: function(a, b) {
        var c = {
            type: "axisZoomed",
            startValue: a,
            endValue: b,
            target: this,
            chart: this.chart
        };
        this.fire(c.type, c)
    },
    zoomToValues: function(a, b) {
        if (b < a) {
            var c = b;
            b = a;
            a = c
        }
        a < this.min && (a = this.min);
        b > this.max && (b = this.max);
        c = {
            type: "axisSelfZoomed"
        };
        c.chart = this.chart;
        c.valueAxis = this;
        c.multiplier = this.axisWidth / Math.abs(this.getCoordinate(b) - this.getCoordinate(a));
        c.position = "V" == this.orientation ? this.reversed ? this.getCoordinate(a) : this.getCoordinate(b) : this.reversed ? this.getCoordinate(b) : this.getCoordinate(a);
        this.fire(c.type, c)
    },
    coordinateToValue: function(a) {
        if (isNaN(a)) return NaN;
        var b = this.axisWidth,
            c = this.stepWidth,
            d = this.reversed,
            f = this.rotate,
            e = this.min,
            g = this.minReal;
        return !0 === this.logarithmic ? Math.pow(10, (f ? !0 === d ? (b - a) / c : a / c : !0 === d ? a / c : (b - a) / c) + Math.log(g) * Math.LOG10E) : !0 === d ? f ? e - (a - b) / c : a / c + e : f ? a / c + e : e - (a - b) / c
    },
    getCoordinate: function(a) {
        if (isNaN(a)) return NaN;
        var b = this.rotate,
            c = this.reversed,
            d = this.axisWidth,
            f = this.stepWidth,
            e = this.min,
            g = this.minReal;
        !0 === this.logarithmic ? (a = Math.log(a) * Math.LOG10E - Math.log(g) * Math.LOG10E, b = b ? !0 === c ? d - f * a : f * a : !0 === c ? f * a : d - f * a) : b = !0 === c ? b ? d - f * (a - e) : f * (a - e) : b ? f * (a - e) : d - f * (a - e);
        b = this.rotate ? b + (this.x - this.viX) : b + (this.y - this.viY);
        return Math.round(b)
    },
    synchronizeWithAxis: function(a) {
        this.synchronizeWith = a;
        this.removeListener(this.synchronizeWith, "axisChanged", this.handleSynchronization);
        this.listenTo(this.synchronizeWith, "axisChanged", this.handleSynchronization)
    },
    handleSynchronization: function(a) {
        var b = this.synchronizeWith;
        a = b.min;
        var c = b.max,
            b = b.step,
            d = this.synchronizationMultiplier;
        d && (this.min = a * d, this.max = c * d, this.step = b * d, a = Math.pow(10, Math.floor(Math.log(Math.abs(this.step)) * Math.LOG10E)), a = Math.abs(Math.log(Math.abs(a)) * Math.LOG10E), this.maxDecCount = a = Math.round(a), this.draw())
    }
});
AmCharts.RecAxis = AmCharts.Class({
    construct: function(a) {
        var b = a.chart,
            c = a.axisThickness,
            d = a.axisColor,
            f = a.axisAlpha,
            e = a.offset,
            g = a.dx,
            h = a.dy,
            k = a.viX,
            l = a.viY,
            m = a.viH,
            n = a.viW,
            p = b.container;
        "H" == a.orientation ? (d = AmCharts.line(p, [0, n], [0, 0], d, f, c), this.axisWidth = a.width, "bottom" == a.position ? (a = c / 2 + e + m + l - 1, c = k) : (a = -c / 2 - e + l + h, c = g + k)) : (this.axisWidth = a.height, "right" == a.position ? (d = AmCharts.line(p, [0, 0, -g], [0, m, m - h], d, f, c), a = l + h, c = c / 2 + e + g + n + k - 1) : (d = AmCharts.line(p, [0, 0], [0, m], d, f, c), a = l, c = -c / 2 - e + k));
        d.translate(c, a);
        b.axesSet.push(d);
        this.set = d
    }
});
AmCharts.RecItem = AmCharts.Class({
    construct: function(a, b, c, d, f, e, g, h, k, l) {
        b = Math.round(b);
        void 0 == c && (c = "");
        k || (k = 0);
        void 0 == d && (d = !0);
        var m = a.chart.fontFamily,
            n = a.fontSize;
        void 0 == n && (n = a.chart.fontSize);
        var p = a.color;
        void 0 == p && (p = a.chart.color);
        var q = a.chart.container,
            t = q.set();
        this.set = t;
        var r = a.axisThickness,
            s = a.axisColor,
            w = a.axisAlpha,
            v = a.tickLength,
            u = a.gridAlpha,
            A = a.gridThickness,
            F = a.gridColor,
            y = a.dashLength,
            z = a.fillColor,
            H = a.fillAlpha,
            I = a.labelsEnabled,
            B = a.labelRotation,
            W = a.counter,
            P = a.inside,
            da = a.dx,
            X = a.dy,
            Fa = a.orientation,
            ea = a.position,
            $ = a.previousCoord,
            L = a.viH,
            V = a.viW,
            oa = a.offset,
            Y, Z;
        g ? (I = !0, isNaN(g.tickLength) || (v = g.tickLength), void 0 != g.lineColor && (F = g.lineColor), void 0 != g.color && (p = g.color), isNaN(g.lineAlpha) || (u = g.lineAlpha), isNaN(g.dashLength) || (y = g.dashLength), isNaN(g.lineThickness) || (A = g.lineThickness), !0 === g.inside && (P = !0), isNaN(g.labelRotation) || (B = g.labelRotation), isNaN(g.fontSize) || (n = g.fontSize), g.position && (ea = g.position)) : "" === c && (v = 0);
        Z = "start";
        f && (Z = "middle");
        var aa = B * Math.PI / 180,
            ha, G = 0,
            C = 0,
            ia = 0,
            Q = ha = 0;
        "V" == Fa && (B = 0);
        var x;
        I && (x = AmCharts.text(q, c, p, m, n, Z, h), Q = x.getBBox().width);
        if ("H" == Fa) {
            if (0 <= b && b <= V + 1 && (0 < v && 0 < w && b + k <= V + 1 && (Y = AmCharts.line(q, [b + k, b + k], [0, v], s, w, A), t.push(Y)), 0 < u && (Z = AmCharts.line(q, [b, b + da, b + da], [L, L + X, X], F, u, A, y), t.push(Z))), C = 0, G = b, g && 90 == B && (G -= n), !1 === d ? (Z = "start", C = "bottom" == ea ? P ? C + v : C - v : P ? C - v : C + v, G += 3, f && (G += f / 2, Z = "middle"), 0 < B && (Z = "middle")) : Z = "middle", 1 == W && 0 < H && !g && !l && $ < V && (d = AmCharts.fitToBounds(b, 0, V), $ = AmCharts.fitToBounds($, 0, V), ha = d - $, 0 < ha && (fill = AmCharts.rect(q, ha, a.height, z, H), fill.translate(d - ha + da, X), t.push(fill))), "bottom" == ea ? (C += L + n / 2 + oa, P ? 0 < B ? (C = L - Q / 2 * Math.sin(aa) - v - 3, G += Q / 2 * Math.cos(aa)) : 0 > B ? (C -= v + n + 3 + 3 - Q / 2 * Math.sin(aa), G -= Q / 2 * Math.cos(aa)) : C -= v + n + 3 + 3 : 0 < B ? (C = L + Q / 2 * Math.sin(aa) + v + 3, G -= Q / 2 * Math.cos(aa)) : 0 > B ? (C = L + v + 3 - Q / 2 * Math.sin(aa) + 2, G += Q / 2 * Math.cos(aa)) : C += v + r + 3 + 3) : (C += X + n / 2 - oa, G += da, P ? 0 < B ? (C = Q / 2 * Math.sin(aa) + v + 3, G -= Q / 2 * Math.cos(aa)) : C += v + 3 : 0 < B ? (C = -(Q / 2) * Math.sin(aa) - v - 6, G += Q / 2 * Math.cos(aa)) : C -= v + n + 3 + r + 3), "bottom" == ea ? ha = (P ? L - v - 1 : L + r - 1) + oa : (ia = da, ha = (P ? X : X - v - r + 1) - oa), e && (G += e), X = G, 0 < B && (X += Q / 2 * Math.cos(aa)), x && (ea = 0, P && (ea = Q / 2 * Math.cos(aa)), X + ea > V + 2 || 0 > X)) x.remove(), x = null
        } else {
            0 <= b && b <= L + 1 && (0 < v && 0 < w && b + k <= L + 1 && (Y = AmCharts.line(q, [0, v], [b + k, b + k], s, w, A), t.push(Y)), 0 < u && (Z = AmCharts.line(q, [0, da, V + da], [b, b + X, b + X], F, u, A, y), t.push(Z)));
            Z = "end";
            if (!0 === P && "left" == ea || !1 === P && "right" == ea) Z = "start";
            C = b - n / 2;
            1 == W && 0 < H && !g && !l && (d = AmCharts.fitToBounds(b, 0, L), $ = AmCharts.fitToBounds($, 0, L), aa = d - $, fill = AmCharts.polygon(q, [0, a.width, a.width, 0], [0, 0, aa, aa], z, H), fill.translate(da, d - aa + X), t.push(fill));
            C += n / 2;
            "right" == ea ? (G += da + V + oa, C += X, P ? (G -= v + 4, e || (C -= n / 2 + 3)) : (G += v + 4 + r, C -= 2)) : P ? (G += v + 4 - oa, e || (C -= n / 2 + 3), g && (G += da, C += X)) : (G += -v - r - 4 - 2 - oa, C -= 2);
            Y && ("right" == ea ? (ia += da + oa + V, ha += X, ia = P ? ia - r : ia + r) : (ia -= oa, P || (ia -= v + r)));
            e && (C += e);
            P = -3;
            "right" == ea && (P += X);
            x && (C > L + 1 || C < P) && (x.remove(), x = null)
        }
        Y && Y.translate(ia, ha);
        !1 === a.visible && (Y && Y.remove(), x && (x.remove(), x = null));
        x && (x.attr({
            "text-anchor": Z
        }), x.translate(G, C), 0 !== B && x.rotate(-B, a.chart.backgroundColor), a.allLabels.push(x), " " != c && (this.label = x));
        l || (a.counter = 0 === W ? 1 : 0, a.previousCoord = b);
        0 === this.set.node.childNodes.length && this.set.remove()
    },
    graphics: function() {
        return this.set
    },
    getLabel: function() {
        return this.label
    }
});
AmCharts.RecFill = AmCharts.Class({
    construct: function(a, b, c, d) {
        var f = a.dx,
            e = a.dy,
            g = a.orientation,
            h = 0;
        if (c < b) {
            var k = b;
            b = c;
            c = k
        }
        var l = d.fillAlpha;
        isNaN(l) && (l = 0);
        k = a.chart.container;
        d = d.fillColor;
        "V" == g ? (b = AmCharts.fitToBounds(b, 0, a.viH), c = AmCharts.fitToBounds(c, 0, a.viH)) : (b = AmCharts.fitToBounds(b, 0, a.viW), c = AmCharts.fitToBounds(c, 0, a.viW));
        c -= b;
        isNaN(c) && (c = 4, h = 2, l = 0);
        0 > c && "object" == typeof d && (d = d.join(",").split(",").reverse());
        "V" == g ? (a = AmCharts.rect(k, a.width, c, d, l), a.translate(f, b - h + e)) : (a = AmCharts.rect(k, c, a.height, d, l), a.translate(b - h + f, e));
        this.set = k.set([a])
    },
    graphics: function() {
        return this.set
    },
    getLabel: function() {}
});
AmCharts.AmChart = AmCharts.Class({
    construct: function(a) {
        this.theme = a;
        this.version = "3.3.2";
        AmCharts.addChart(this);
        this.createEvents("dataUpdated", "init", "rendered", "drawn");
        this.height = this.width = "100%";
        this.dataChanged = !0;
        this.chartCreated = !1;
        this.previousWidth = this.previousHeight = 0;
        this.backgroundColor = "#FFFFFF";
        this.borderAlpha = this.backgroundAlpha = 0;
        this.color = this.borderColor = "#000000";
        this.fontFamily = "Verdana";
        this.fontSize = 11;
        this.usePrefixes = !1;
        this.numberFormatter = {
            precision: -1,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.percentFormatter = {
            precision: 2,
            decimalSeparator: ".",
            thousandsSeparator: ","
        };
        this.labels = [];
        this.allLabels = [];
        this.titles = [];
        this.marginRight = this.marginLeft = this.autoMarginOffset = 0;
        this.timeOuts = [];
        var b = document.createElement("div"),
            c = b.style;
        c.overflow = "hidden";
        c.position = "relative";
        c.textAlign = "left";
        this.chartDiv = b;
        b = document.createElement("div");
        c = b.style;
        c.overflow = "hidden";
        c.position = "relative";
        c.textAlign = "left";
        this.legendDiv = b;
        this.titleHeight = 0;
        this.hideBalloonTime = 150;
        this.handDrawScatter = 2;
        this.handDrawThickness = 1;
        this.prefixesOfBigNumbers = [{
            number: 1E3,
            prefix: "k"
        }, {
            number: 1E6,
            prefix: "M"
        }, {
            number: 1E9,
            prefix: "G"
        }, {
            number: 1E12,
            prefix: "T"
        }, {
            number: 1E15,
            prefix: "P"
        }, {
            number: 1E18,
            prefix: "E"
        }, {
            number: 1E21,
            prefix: "Z"
        }, {
            number: 1E24,
            prefix: "Y"
        }];
        this.prefixesOfSmallNumbers = [{
            number: 1E-24,
            prefix: "y"
        }, {
            number: 1E-21,
            prefix: "z"
        }, {
            number: 1E-18,
            prefix: "a"
        }, {
            number: 1E-15,
            prefix: "f"
        }, {
            number: 1E-12,
            prefix: "p"
        }, {
            number: 1E-9,
            prefix: "n"
        }, {
            number: 1E-6,
            prefix: "\u03bc"
        }, {
            number: 0.001,
            prefix: "m"
        }];
        this.panEventsEnabled = !1;
        AmCharts.bezierX = 3;
        AmCharts.bezierY = 6;
        this.product = "amcharts";
        this.animations = [];
        this.balloon = new AmCharts.AmBalloon(this.theme);
        this.balloon.chart = this;
        this.type = this.chartType;
        AmCharts.applyTheme(this, a, "AmChart")
    },
    drawChart: function() {
        this.drawBackground();
        this.redrawLabels();
        this.drawTitles()
    },
    drawBackground: function() {
        AmCharts.remove(this.background);
        var a = this.container,
            b = this.backgroundColor,
            c = this.backgroundAlpha,
            d = this.set;
        AmCharts.isModern || 0 !== c || (c = 0.001);
        var f = this.updateWidth();
        this.realWidth = f;
        var e = this.updateHeight();
        this.realHeight = e;
        this.background = b = AmCharts.polygon(a, [0, f - 1, f - 1, 0], [0, 0, e - 1, e - 1], b, c, 1, this.borderColor, this.borderAlpha);
        d.push(b);
        if (b = this.backgroundImage) this.path && (b = this.path + b), this.bgImg = a = a.image(b, 0, 0, f, e), d.push(a)
    },
    drawTitles: function() {
        var a = this.titles;
        if (AmCharts.ifArray(a)) {
            var b = 20,
                c;
            for (c = 0; c < a.length; c++) {
                var d = a[c],
                    f = d.color;
                void 0 === f && (f = this.color);
                var e = d.size;
                isNaN(d.alpha);
                var g = this.marginLeft,
                    f = AmCharts.text(this.container, d.text, f, this.fontFamily, e);
                f.translate(g + (this.realWidth - this.marginRight - g) / 2, b);
                g = !0;
                void 0 !== d.bold && (g = d.bold);
                g && f.attr({
                    "font-weight": "bold"
                });
                b += e + 6;
                this.freeLabelsSet.push(f)
            }
        }
    },
    write: function(a) {
        a = "object" != typeof a ? document.getElementById(a) : a;
        a.innerHTML = "";
        this.div = a;
        a.style.overflow = "hidden";
        a.style.textAlign = "left";
        var b = this.chartDiv,
            c = this.legendDiv,
            d = this.legend,
            f = c.style,
            e = b.style;
        this.measure();
        var g, h = document.createElement("div");
        g = h.style;
        g.position = "relative";
        this.containerDiv = h;
        a.appendChild(h);
        var k = this.exportConfig;
        k && AmCharts.AmExport && !this.AmExport && (this.AmExport = new AmCharts.AmExport(this, k));
        if (d) switch (d = this.addLegend(d, d.divId), d.position) {
            case "bottom":
                h.appendChild(b);
                h.appendChild(c);
                break;
            case "top":
                h.appendChild(c);
                h.appendChild(b);
                break;
            case "absolute":
                g.width = a.style.width;
                g.height = a.style.height;
                f.position = "absolute";
                e.position = "absolute";
                void 0 !== d.left && (f.left = d.left + "px");
                void 0 !== d.right && (f.right = d.right + "px");
                void 0 !== d.top && (f.top = d.top + "px");
                void 0 !== d.bottom && (f.bottom = d.bottom + "px");
                d.marginLeft = 0;
                d.marginRight = 0;
                h.appendChild(b);
                h.appendChild(c);
                break;
            case "right":
                g.width = a.style.width;
                g.height = a.style.height;
                f.position = "relative";
                e.position = "absolute";
                h.appendChild(b);
                h.appendChild(c);
                break;
            case "left":
                g.width = a.style.width;
                g.height = a.style.height;
                f.position = "absolute";
                e.position = "relative";
                h.appendChild(b);
                h.appendChild(c);
                break;
            case "outside":
                h.appendChild(b)
        } else h.appendChild(b);
        this.listenersAdded || (this.addListeners(), this.listenersAdded = !0);
        this.initChart()
    },
    createLabelsSet: function() {
        AmCharts.remove(this.labelsSet);
        this.labelsSet = this.container.set();
        this.freeLabelsSet.push(this.labelsSet)
    },
    initChart: function() {
        this.divIsFixed = AmCharts.findIfFixed(this.chartDiv);
        this.previousHeight = this.divRealHeight;
        this.previousWidth = this.divRealWidth;
        this.destroy();
        this.startInterval();
        var a = 0;
        document.attachEvent && !window.opera && (a = 1);
        this.dmouseX = this.dmouseY = 0;
        var b = document.getElementsByTagName("html")[0];
        b && window.getComputedStyle && (b = window.getComputedStyle(b, null)) && (this.dmouseY = AmCharts.removePx(b.getPropertyValue("margin-top")), this.dmouseX = AmCharts.removePx(b.getPropertyValue("margin-left")));
        this.mouseMode = a;
        a = new AmCharts.AmDraw(this.chartDiv, this.realWidth, this.realHeight, this);
        a.handDrawn = this.handDrawn;
        a.handDrawScatter = this.handDrawScatter;
        a.handDrawThickness = this.handDrawThickness;
        this.container = a;
        if (AmCharts.VML || AmCharts.SVG) a = this.container, this.set = a.set(), this.gridSet = a.set(), this.graphsBehindSet = a.set(), this.bulletBehindSet = a.set(), this.columnSet = a.set(), this.graphsSet = a.set(), this.trendLinesSet = a.set(), this.axesLabelsSet = a.set(), this.axesSet = a.set(), this.cursorSet = a.set(), this.scrollbarsSet = a.set(), this.bulletSet = a.set(), this.freeLabelsSet = a.set(), this.balloonsSet = a.set(), this.balloonsSet.setAttr("id", "balloons"), this.zoomButtonSet = a.set(), this.linkSet = a.set(), this.brrr(), this.renderFix()
    },
    measure: function() {
        var a = this.div,
            b = this.chartDiv,
            c = a.offsetWidth,
            d = a.offsetHeight,
            f = this.container;
        a.clientHeight && (c = a.clientWidth, d = a.clientHeight);
        var e = AmCharts.removePx(AmCharts.getStyle(a, "padding-left")),
            g = AmCharts.removePx(AmCharts.getStyle(a, "padding-right")),
            h = AmCharts.removePx(AmCharts.getStyle(a, "padding-top")),
            k = AmCharts.removePx(AmCharts.getStyle(a, "padding-bottom"));
        isNaN(e) || (c -= e);
        isNaN(g) || (c -= g);
        isNaN(h) || (d -= h);
        isNaN(k) || (d -= k);
        e = a.style;
        a = e.width;
        e = e.height; - 1 != a.indexOf("px") && (c = AmCharts.removePx(a)); - 1 != e.indexOf("px") && (d = AmCharts.removePx(e));
        a = AmCharts.toCoordinate(this.width, c);
        e = AmCharts.toCoordinate(this.height, d);
        this.balloon = AmCharts.processObject(this.balloon, AmCharts.AmBalloon, this.theme);
        this.balloon.chart = this;
        if (a != this.previousWidth || e != this.previousHeight) b.style.width = a + "px", b.style.height = e + "px", f && f.setSize(a, e), this.balloon.setBounds(2, 2, a - 2, e);
        this.realWidth = a;
        this.realHeight = e;
        this.divRealWidth = c;
        this.divRealHeight = d
    },
    destroy: function() {
        this.chartDiv.innerHTML = "";
        this.clearTimeOuts();
        this.interval && clearInterval(this.interval);
        this.interval = NaN
    },
    clearTimeOuts: function() {
        var a = this.timeOuts;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) clearTimeout(a[b])
        }
        this.timeOuts = []
    },
    clear: function(a) {
        AmCharts.callMethod("clear", [this.chartScrollbar, this.scrollbarV, this.scrollbarH, this.chartCursor]);
        this.chartCursor = this.scrollbarH = this.scrollbarV = this.chartScrollbar = null;
        this.clearTimeOuts();
        this.container && (this.container.remove(this.chartDiv), this.container.remove(this.legendDiv));
        a || AmCharts.removeChart(this)
    },
    setMouseCursor: function(a) {
        "auto" == a && AmCharts.isNN && (a = "default");
        this.chartDiv.style.cursor = a;
        this.legendDiv.style.cursor = a
    },
    redrawLabels: function() {
        this.labels = [];
        var a = this.allLabels;
        this.createLabelsSet();
        var b;
        for (b = 0; b < a.length; b++) this.drawLabel(a[b])
    },
    drawLabel: function(a) {
        if (this.container) {
            var b = a.y,
                c = a.text,
                d = a.align,
                f = a.size,
                e = a.color,
                g = a.rotation,
                h = a.alpha,
                k = a.bold,
                l = AmCharts.toCoordinate(a.x, this.realWidth),
                b = AmCharts.toCoordinate(b, this.realHeight);
            l || (l = 0);
            b || (b = 0);
            void 0 === e && (e = this.color);
            isNaN(f) && (f = this.fontSize);
            d || (d = "start");
            "left" == d && (d = "start");
            "right" == d && (d = "end");
            "center" == d && (d = "middle", g ? b = this.realHeight - b + b / 2 : l = this.realWidth / 2 - l);
            void 0 === h && (h = 1);
            void 0 === g && (g = 0);
            b += f / 2;
            c = AmCharts.text(this.container, c, e, this.fontFamily, f, d, k, h);
            c.translate(l, b);
            0 !== g && c.rotate(g);
            a.url && (c.setAttr("cursor", "pointer"), c.click(function() {
                AmCharts.getURL(a.url)
            }));
            this.labelsSet.push(c);
            this.labels.push(c)
        }
    },
    addLabel: function(a, b, c, d, f, e, g, h, k, l) {
        a = {
            x: a,
            y: b,
            text: c,
            align: d,
            size: f,
            color: e,
            alpha: h,
            rotation: g,
            bold: k,
            url: l
        };
        this.container && this.drawLabel(a);
        this.allLabels.push(a)
    },
    clearLabels: function() {
        var a = this.labels,
            b;
        for (b = a.length - 1; 0 <= b; b--) a[b].remove();
        this.labels = [];
        this.allLabels = []
    },
    updateHeight: function() {
        var a = this.divRealHeight,
            b = this.legend;
        if (b) {
            var c = this.legendDiv.offsetHeight,
                b = b.position;
            if ("top" == b || "bottom" == b) {
                a -= c;
                if (0 > a || isNaN(a)) a = 0;
                this.chartDiv.style.height = a + "px"
            }
        }
        return a
    },
    updateWidth: function() {
        var a = this.divRealWidth,
            b = this.divRealHeight,
            c = this.legend;
        if (c) {
            var d = this.legendDiv,
                f = d.offsetWidth,
                e = d.offsetHeight,
                d = d.style,
                g = this.chartDiv.style,
                c = c.position;
            if ("right" == c || "left" == c) {
                a -= f;
                if (0 > a || isNaN(a)) a = 0;
                g.width = a + "px";
                "left" == c ? g.left = f + "px" : d.left = a + "px";
                d.top = (b - e) / 2 + "px"
            }
        }
        return a
    },
    getTitleHeight: function() {
        var a = 0,
            b = this.titles;
        if (0 < b.length) {
            var a = 15,
                c;
            for (c = 0; c < b.length; c++) a += b[c].size + 6
        }
        return a
    },
    addTitle: function(a, b, c, d, f) {
        isNaN(b) && (b = this.fontSize + 2);
        a = {
            text: a,
            size: b,
            color: c,
            alpha: d,
            bold: f
        };
        this.titles.push(a);
        return a
    },
    addMouseWheel: function() {
        var a = this;
        window.addEventListener && (window.addEventListener("DOMMouseScroll", function(b) {
            a.handleWheel.call(a, b)
        }, !1), document.addEventListener("mousewheel", function(b) {
            a.handleWheel.call(a, b)
        }, !1))
    },
    handleWheel: function(a) {
        if (this.mouseIsOver) {
            var b = 0;
            a || (a = window.event);
            a.wheelDelta ? b = a.wheelDelta / 120 : a.detail && (b = -a.detail / 3);
            b && this.handleWheelReal(b);
            a.preventDefault && a.preventDefault();
            a.returnValue = !1
        }
    },
    handleWheelReal: function(a) {},
    addListeners: function() {
        var a = this,
            b = a.chartDiv;
        document.addEventListener ? (a.panEventsEnabled && "ontouchstart" in document.documentElement && (b.addEventListener("touchstart", function(b) {
            a.handleTouchMove.call(a, b);
            a.handleTouchStart.call(a, b)
        }, !0), b.addEventListener("touchmove", function(b) {
            a.handleTouchMove.call(a, b)
        }, !0), b.addEventListener("touchend", function(b) {
            a.handleTouchEnd.call(a, b)
        }, !0)), b.addEventListener("mousedown", function(b) {
            a.handleMouseDown.call(a, b)
        }, !0), b.addEventListener("mouseover", function(b) {
            a.handleMouseOver.call(a, b)
        }, !0), b.addEventListener("mouseout", function(b) {
            a.handleMouseOut.call(a, b)
        }, !0)) : (b.attachEvent("onmousedown", function(b) {
            a.handleMouseDown.call(a, b)
        }), b.attachEvent("onmouseover", function(b) {
            a.handleMouseOver.call(a, b)
        }), b.attachEvent("onmouseout", function(b) {
            a.handleMouseOut.call(a, b)
        }))
    },
    dispDUpd: function() {
        var a;
        this.dispatchDataUpdated && (this.dispatchDataUpdated = !1, a = "dataUpdated", this.fire(a, {
            type: a,
            chart: this
        }));
        this.chartCreated || (a = "init", this.fire(a, {
            type: a,
            chart: this
        }));
        this.chartRendered || (a = "rendered", this.fire(a, {
            type: a,
            chart: this
        }), this.chartRendered = !0);
        a = "drawn";
        this.fire(a, {
            type: a,
            chart: this
        })
    },
    brrr: function() {
        var a = this.product,
            b = a + ".com",
            c = window.location.hostname.split("."),
            d;
        2 <= c.length && (d = c[c.length - 2] + "." + c[c.length - 1]);
        AmCharts.remove(this.bbset);
        if (d == b) {
            var b = b + "/?utm_source=swf&utm_medium=demo&utm_campaign=jsDemo" + a,
                f = "chart by ",
                c = 145;
            "ammap" == a && (f = "tool by ", c = 125);
            d = AmCharts.rect(this.container, c, 20, "#FFFFFF", 1);
            f = AmCharts.text(this.container, f + a + ".com", "#000000", "Verdana", 11, "start");
            f.translate(7, 9);
            d = this.container.set([d, f]);
            "ammap" == a && d.translate(this.realWidth - c, 0);
            this.bbset = d;
            this.linkSet.push(d);
            d.setAttr("cursor", "pointer");
            d.click(function() {
                window.location.href = "http://" + b
            });
            for (a = 0; a < d.length; a++) d[a].attr({
                cursor: "pointer"
            })
        }
    },
    validateSize: function() {
        var a = this;
        a.measure();
        var b = a.legend;
        if ((a.realWidth != a.previousWidth || a.realHeight != a.previousHeight) && 0 < a.realWidth && 0 < a.realHeight) {
            a.sizeChanged = !0;
            if (b) {
                clearTimeout(a.legendInitTO);
                var c = setTimeout(function() {
                    b.invalidateSize()
                }, 100);
                a.timeOuts.push(c);
                a.legendInitTO = c
            }
            a.marginsUpdated = "xy" != a.chartType ? !1 : !0;
            clearTimeout(a.initTO);
            c = setTimeout(function() {
                a.initChart()
            }, 150);
            a.timeOuts.push(c);
            a.initTO = c
        }
        a.renderFix();
        b && b.renderFix()
    },
    invalidateSize: function() {
        this.previousHeight = this.previousWidth = NaN;
        this.invalidateSizeReal()
    },
    invalidateSizeReal: function() {
        var a = this;
        a.marginsUpdated = !1;
        clearTimeout(a.validateTO);
        var b = setTimeout(function() {
            a.validateSize()
        }, 5);
        a.timeOuts.push(b);
        a.validateTO = b
    },
    validateData: function(a) {
        this.chartCreated && (this.dataChanged = !0, this.marginsUpdated = "xy" != this.chartType ? !1 : !0, this.initChart(a))
    },
    validateNow: function() {
        this.chartRendered = this.listenersAdded = !1;
        this.write(this.div)
    },
    showItem: function(a) {
        a.hidden = !1;
        this.initChart()
    },
    hideItem: function(a) {
        a.hidden = !0;
        this.initChart()
    },
    hideBalloon: function() {
        var a = this;
        clearInterval(a.hoverInt);
        clearTimeout(a.balloonTO);
        a.hoverInt = setTimeout(function() {
            a.hideBalloonReal.call(a)
        }, a.hideBalloonTime)
    },
    cleanChart: function() {},
    hideBalloonReal: function() {
        var a = this.balloon;
        a && a.hide()
    },
    showBalloon: function(a, b, c, d, f) {
        var e = this;
        clearTimeout(e.balloonTO);
        clearInterval(e.hoverInt);
        e.balloonTO = setTimeout(function() {
            e.showBalloonReal.call(e, a, b, c, d, f)
        }, 1)
    },
    showBalloonReal: function(a, b, c, d, f) {
        this.handleMouseMove();
        var e = this.balloon;
        e.enabled && (e.followCursor(!1), e.changeColor(b), !c || e.fixedPosition ? (e.setPosition(d, f), e.followCursor(!1)) : e.followCursor(!0), a && e.showBalloon(a))
    },
    handleTouchMove: function(a) {
        this.hideBalloon();
        var b = this.chartDiv;
        a.touches && (a = a.touches.item(0), this.mouseX = a.pageX - AmCharts.findPosX(b), this.mouseY = a.pageY - AmCharts.findPosY(b))
    },
    handleMouseOver: function(a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0
    },
    handleMouseOut: function(a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !1
    },
    handleMouseMove: function(a) {
        if (this.mouseIsOver) {
            var b = this.chartDiv;
            a || (a = window.event);
            var c, d;
            if (a) {
                this.posX = AmCharts.findPosX(b);
                this.posY = AmCharts.findPosY(b);
                switch (this.mouseMode) {
                    case 1:
                        c = a.clientX - this.posX;
                        d = a.clientY - this.posY;
                        if (!this.divIsFixed) {
                            var b = document.body,
                                f, e;
                            b && (f = b.scrollLeft, y1 = b.scrollTop);
                            if (b = document.documentElement) e = b.scrollLeft, y2 = b.scrollTop;
                            f = Math.max(f, e);
                            e = Math.max(y1, y2);
                            c += f;
                            d += e
                        }
                        break;
                    case 0:
                        this.divIsFixed ? (c = a.clientX - this.posX, d = a.clientY - this.posY) : (c = a.pageX - this.posX, d = a.pageY - this.posY)
                }
                a.touches && (a = a.touches.item(0), c = a.pageX - this.posX, d = a.pageY - this.posY);
                this.mouseX = c - this.dmouseX;
                this.mouseY = d - this.dmouseY
            }
        }
    },
    handleTouchStart: function(a) {
        this.handleMouseDown(a)
    },
    handleTouchEnd: function(a) {
        AmCharts.resetMouseOver();
        this.handleReleaseOutside(a)
    },
    handleReleaseOutside: function(a) {},
    handleMouseDown: function(a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0;
        a && a.preventDefault && a.preventDefault()
    },
    addLegend: function(a, b) {
        a = AmCharts.processObject(a, AmCharts.AmLegend, this.theme);
        a.divId = b;
        var c;
        c = "object" != typeof b ? document.getElementById(b) : b;
        this.legend = a;
        a.chart = this;
        c ? (a.div = c, a.position = "outside", a.autoMargins = !1) : a.div = this.legendDiv;
        c = this.handleLegendEvent;
        this.listenTo(a, "showItem", c);
        this.listenTo(a, "hideItem", c);
        this.listenTo(a, "clickMarker", c);
        this.listenTo(a, "rollOverItem", c);
        this.listenTo(a, "rollOutItem", c);
        this.listenTo(a, "rollOverMarker", c);
        this.listenTo(a, "rollOutMarker", c);
        this.listenTo(a, "clickLabel", c);
        return a
    },
    removeLegend: function() {
        this.legend = void 0;
        this.legendDiv.innerHTML = ""
    },
    handleResize: function() {
        (AmCharts.isPercents(this.width) || AmCharts.isPercents(this.height)) && this.invalidateSizeReal();
        this.renderFix()
    },
    renderFix: function() {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    },
    getSVG: function() {
        if (AmCharts.hasSVG) return this.container
    },
    animate: function(a, b, c, d, f, e, g) {
        a["an_" + b] && AmCharts.removeFromArray(this.animations, a["an_" + b]);
        c = {
            obj: a,
            frame: 0,
            attribute: b,
            from: c,
            to: d,
            time: f,
            effect: e,
            suffix: g
        };
        a["an_" + b] = c;
        this.animations.push(c);
        return c
    },
    setLegendData: function(a) {
        var b = this.legend;
        b && b.setData(a)
    },
    startInterval: function() {
        var a = this;
        clearInterval(a.interval);
        a.interval = setInterval(function() {
            a.updateAnimations.call(a)
        }, AmCharts.updateRate)
    },
    stopAnim: function(a) {
        AmCharts.removeFromArray(this.animations, a)
    },
    updateAnimations: function() {
        var a;
        this.container && this.container.update();
        for (a = this.animations.length - 1; 0 <= a; a--) {
            var b = this.animations[a],
                c = 1E3 * b.time / AmCharts.updateRate,
                d = b.frame + 1,
                f = b.obj,
                e = b.attribute;
            if (d <= c) {
                b.frame++;
                var g = Number(b.from),
                    h = Number(b.to) - g,
                    c = AmCharts[b.effect](0, d, g, h, c);
                0 === h ? this.animations.splice(a, 1) : f.node.style[e] = c + b.suffix
            } else f.node.style[e] = Number(b.to) + b.suffix, this.animations.splice(a, 1)
        }
    }
});
AmCharts.Slice = AmCharts.Class({
    construct: function() {}
});
AmCharts.SerialDataItem = AmCharts.Class({
    construct: function() {}
});
AmCharts.GraphDataItem = AmCharts.Class({
    construct: function() {}
});
AmCharts.Guide = AmCharts.Class({
    construct: function() {}
});
AmCharts.AmGraph = AmCharts.Class({
    construct: function(a) {
        this.className = "AmGraph";
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem", "clickGraph");
        this.type = "line";
        this.stackable = !0;
        this.columnCount = 1;
        this.columnIndex = 0;
        this.centerCustomBullets = this.showBalloon = !0;
        this.maxBulletSize = 50;
        this.minBulletSize = 0;
        this.balloonText = "[[value]]";
        this.hidden = this.scrollbar = this.animationPlayed = !1;
        this.pointPosition = "middle";
        this.depthCount = 1;
        this.includeInMinMax = !0;
        this.negativeBase = 0;
        this.visibleInLegend = !0;
        this.showAllValueLabels = !1;
        this.showBalloonAt = "close";
        this.lineThickness = 1;
        this.dashLength = 0;
        this.connect = !0;
        this.lineAlpha = 1;
        this.bullet = "none";
        this.bulletBorderThickness = 2;
        this.bulletBorderAlpha = 0;
        this.bulletAlpha = 1;
        this.bulletSize = 8;
        this.hideBulletsCount = this.bulletOffset = 0;
        this.labelPosition = "top";
        this.cornerRadiusTop = 0;
        this.cursorBulletAlpha = 1;
        this.gradientOrientation = "vertical";
        this.dy = this.dx = 0;
        this.periodValue = "";
        this.clustered = !0;
        this.periodSpan = 1;
        this.y = this.x = 0;
        AmCharts.applyTheme(this, a, "AmGraph")
    },
    draw: function() {
        var a = this.chart,
            b = a.container;
        this.container = b;
        this.destroy();
        var c = b.set(),
            d = b.set();
        this.behindColumns ? (a.graphsBehindSet.push(c), a.bulletBehindSet.push(d)) : (a.graphsSet.push(c), a.bulletSet.push(d));
        var f = this.bulletAxis;
        AmCharts.isString(f) && (this.bulletAxis = a.getValueAxisById(f));
        this.bulletSet = d;
        this.scrollbar || (f = a.marginLeftReal, a = a.marginTopReal, c.translate(f, a), d.translate(f, a));
        b = b.set();
        AmCharts.remove(this.columnsSet);
        c.push(b);
        this.set = c;
        this.columnsSet = b;
        this.columnsArray = [];
        this.ownColumns = [];
        this.allBullets = [];
        this.animationArray = [];
        AmCharts.ifArray(this.data) && (c = !1, "xy" == this.chartType ? this.xAxis.axisCreated && this.yAxis.axisCreated && (c = !0) : this.valueAxis.axisCreated && (c = !0), !this.hidden && c && this.createGraph())
    },
    createGraph: function() {
        var a = this,
            b = a.chart;
        "inside" == a.labelPosition && "column" != a.type && (a.labelPosition = "bottom");
        a.startAlpha = b.startAlpha;
        a.seqAn = b.sequencedAnimation;
        a.baseCoord = a.valueAxis.baseCoord;
        a.fillColors || (a.fillColors = a.lineColor);
        void 0 === a.fillAlphas && (a.fillAlphas = 0);
        void 0 === a.bulletColor && (a.bulletColor = a.lineColor, a.bulletColorNegative = a.negativeLineColor);
        void 0 === a.bulletAlpha && (a.bulletAlpha = a.lineAlpha);
        clearTimeout(a.playedTO);
        if (!isNaN(a.valueAxis.min) && !isNaN(a.valueAxis.max)) {
            switch (a.chartType) {
                case "serial":
                    a.createSerialGraph();
                    "candlestick" == a.type && 1 > a.valueAxis.minMaxMultiplier && a.positiveClip(a.set);
                    break;
                case "radar":
                    a.createRadarGraph();
                    break;
                case "xy":
                    a.createXYGraph(), a.positiveClip(a.set)
            }
            a.playedTO = setTimeout(function() {
                a.setAnimationPlayed.call(a)
            }, 500 * a.chart.startDuration)
        }
    },
    setAnimationPlayed: function() {
        this.animationPlayed = !0
    },
    createXYGraph: function() {
        var a = [],
            b = [],
            c = this.xAxis,
            d = this.yAxis;
        this.pmh = d.viH + 1;
        this.pmw = c.viW + 1;
        this.pmy = this.pmx = 0;
        var f;
        for (f = this.start; f <= this.end; f++) {
            var e = this.data[f].axes[c.id].graphs[this.id],
                g = e.values,
                h = g.x,
                k = g.y,
                g = c.getCoordinate(h),
                l = d.getCoordinate(k);
            !isNaN(h) && !isNaN(k) && (a.push(g), b.push(l), (h = this.createBullet(e, g, l, f)) || (h = 0), k = this.labelText) && (e = this.createLabel(e, g, l, k), this.allBullets.push(e), this.positionLabel(g, l, e, this.labelPosition, h))
        }
        this.drawLineGraph(a, b);
        this.launchAnimation()
    },
    createRadarGraph: function() {
        var a = this.valueAxis.stackType,
            b = [],
            c = [],
            d, f, e;
        for (e = this.start; e <= this.end; e++) {
            var g = this.data[e].axes[this.valueAxis.id].graphs[this.id],
                h;
            h = "none" == a || "3d" == a ? g.values.value : g.values.close;
            if (isNaN(h)) this.drawLineGraph(b, c), b = [], c = [];
            else {
                var k = this.y - (this.valueAxis.getCoordinate(h) - this.height),
                    l = 180 - 360 / (this.end - this.start + 1) * e;
                h = k * Math.sin(l / 180 * Math.PI);
                k *= Math.cos(l / 180 * Math.PI);
                b.push(h);
                c.push(k);
                (l = this.createBullet(g, h, k, e)) || (l = 0);
                var m = this.labelText;
                m && (g = this.createLabel(g, h, k, m), this.allBullets.push(g), this.positionLabel(h, k, g, this.labelPosition, l));
                isNaN(d) && (d = h);
                isNaN(f) && (f = k)
            }
        }
        b.push(d);
        c.push(f);
        this.drawLineGraph(b, c);
        this.launchAnimation()
    },
    positionLabel: function(a, b, c, d, f) {
        var e = c.getBBox();
        switch (d) {
            case "left":
                a -= (e.width + f) / 2 + 2;
                break;
            case "top":
                b -= (f + e.height) / 2 + 1;
                break;
            case "right":
                a += (e.width + f) / 2 + 2;
                break;
            case "bottom":
                b += (f + e.height) / 2 + 1
        }
        c.translate(a, b)
    },
    getGradRotation: function() {
        var a = 270;
        "horizontal" == this.gradientOrientation && (a = 0);
        return this.gradientRotation = a
    },
    createSerialGraph: function() {
        this.dashLengthSwitched = this.fillColorsSwitched = this.lineColorSwitched = void 0;
        var a = this.chart,
            b = this.id,
            c = this.index,
            d = this.data,
            f = this.chart.container,
            e = this.valueAxis,
            g = this.type,
            h = this.columnWidthReal;
        isNaN(this.columnWidth) || (h = this.columnWidth);
        isNaN(h) && (h = 0.8);
        var k = this.width,
            l = this.height,
            m = this.y,
            n = this.rotate,
            p = this.columnCount,
            q = AmCharts.toCoordinate(this.cornerRadiusTop, h / 2),
            t = this.connect,
            r = [],
            s = [],
            w, v, u, A, F = this.chart.graphs.length,
            y, z = this.dx / this.depthCount,
            H = this.dy / this.depthCount,
            I = e.stackType,
            B = this.labelPosition,
            W = this.start,
            P = this.end,
            da = this.scrollbar,
            X = this.categoryAxis,
            Fa = this.baseCoord,
            ea = this.negativeBase,
            $ = this.columnIndex,
            L = this.lineThickness,
            V = this.lineAlpha,
            oa = this.lineColor,
            Y = this.dashLength,
            Z = this.set,
            aa = B,
            ha = this.getGradRotation(),
            G = this.chart.columnSpacing,
            C = X.cellWidth,
            ia = (C * h - p) / p;
        G > ia && (G = ia);
        var Q, x, Ta, Za = l + 1,
            $a = k + 1,
            Ua = 0,
            ab = 0,
            bb, cb, Va, Wa, Jb = this.fillColors,
            Ja = this.negativeFillColors,
            Aa = this.negativeLineColor,
            Ka = this.fillAlphas,
            La = this.negativeFillAlphas;
        "object" == typeof Ka && (Ka = Ka[0]);
        "object" == typeof La && (La = La[0]);
        var Xa = e.getCoordinate(e.min);
        e.logarithmic && (Xa = e.getCoordinate(e.minReal));
        this.minCoord = Xa;
        this.resetBullet && (this.bullet = "none");
        if (!da && ("line" == g || "smoothedLine" == g || "step" == g) && (1 == d.length && "step" != g && "none" == this.bullet && (this.bullet = "round", this.resetBullet = !0), Ja || void 0 != Aa)) {
            var Ga = ea;
            Ga > e.max && (Ga = e.max);
            Ga < e.min && (Ga = e.min);
            e.logarithmic && (Ga = e.minReal);
            var wa = e.getCoordinate(Ga),
                ub = e.getCoordinate(e.max);
            n ? (Za = l, $a = Math.abs(ub - wa), bb = l, cb = Math.abs(Xa - wa), Wa = ab = 0, e.reversed ? (Ua = 0, Va = wa) : (Ua = wa, Va = 0)) : ($a = k, Za = Math.abs(ub - wa), cb = k, bb = Math.abs(Xa - wa), Va = Ua = 0, e.reversed ? (Wa = m, ab = wa) : Wa = wa + 1)
        }
        var xa = Math.round;
        this.pmx = xa(Ua);
        this.pmy = xa(ab);
        this.pmh = xa(Za);
        this.pmw = xa($a);
        this.nmx = xa(Va);
        this.nmy = xa(Wa);
        this.nmh = xa(bb);
        this.nmw = xa(cb);
        AmCharts.isModern || (this.nmy = this.nmx = 0, this.nmh = this.height);
        h = "column" == g ? (C * h - G * (p - 1)) / p : C * h;
        1 > h && (h = 1);
        var J;
        if ("line" == g || "step" == g || "smoothedLine" == g) {
            if (0 < W) {
                for (J = W - 1; - 1 < J; J--) if (Q = d[J], x = Q.axes[e.id].graphs[b], Ta = x.values.value, !isNaN(Ta)) {
                    W = J;
                    break
                }
                if (this.lineColorField) for (J = W; - 1 < J; J--) if (Q = d[J], x = Q.axes[e.id].graphs[b], x.lineColor) {
                    this.bulletColorSwitched = this.lineColorSwitched = x.lineColor;
                    break
                }
                if (this.fillColorsField) for (J = W; - 1 < J; J--) if (Q = d[J], x = Q.axes[e.id].graphs[b], x.fillColors) {
                    this.fillColorsSwitched = x.fillColors;
                    break
                }
                if (this.dashLengthField) for (J = W; - 1 < J; J--) if (Q = d[J], x = Q.axes[e.id].graphs[b], !isNaN(x.dashLength)) {
                    this.dashLengthSwitched = x.dashLength;
                    break
                }
            }
            if (P < d.length - 1) for (J = P + 1; J < d.length; J++) if (Q = d[J], x = Q.axes[e.id].graphs[b], Ta = x.values.value, !isNaN(Ta)) {
                P = J;
                break
            }
        }
        P < d.length - 1 && P++;
        var T = [],
            U = [],
            Ma = !1;
        if ("line" == g || "step" == g || "smoothedLine" == g) if (this.stackable && "regular" == I || "100%" == I || this.fillToGraph) Ma = !0;
        var vb = this.noStepRisers;
        for (J = W; J <= P; J++) {
            Q = d[J];
            x = Q.axes[e.id].graphs[b];
            x.index = J;
            var M, N, K, ba, ma = NaN,
                E = NaN,
                D = NaN,
                R = NaN,
                O = NaN,
                Na = NaN,
                Ba = NaN,
                Oa = NaN,
                Ca = NaN,
                ca = NaN,
                ga = NaN,
                pa = NaN,
                qa = NaN,
                S = NaN,
                db = NaN,
                eb = NaN,
                ja = NaN,
                na = void 0,
                ya = Jb,
                Pa = Ka,
                ra = oa,
                ka, sa, fb = this.pattern;
            void 0 != x.pattern && (fb = x.pattern);
            void 0 != x.color && (ya = x.color);
            x.fillColors && (ya = x.fillColors);
            isNaN(x.alpha) || (Pa = x.alpha);
            isNaN(x.dashLength) || (Y = x.dashLength);
            var ta = x.values;
            e.recalculateToPercents && (ta = x.percents);
            if (ta) {
                S = this.stackable && "none" != I && "3d" != I ? ta.close : ta.value;
                if ("candlestick" == g || "ohlc" == g) S = ta.close, eb = ta.low, Ba = e.getCoordinate(eb), db = ta.high, Ca = e.getCoordinate(db);
                ja = ta.open;
                D = e.getCoordinate(S);
                isNaN(ja) || (O = e.getCoordinate(ja));
                if (!da) switch (this.showBalloonAt) {
                    case "close":
                        x.y = D;
                        break;
                    case "open":
                        x.y = O;
                        break;
                    case "high":
                        x.y = Ca;
                        break;
                    case "low":
                        x.y = Ba
                }
                var ma = Q.x[X.id],
                    gb = this.periodSpan - 1,
                    la = Math.floor(C / 2) + gb * Math.floor(C / 2),
                    za = la;
                "start" == this.pointPosition && (ma -= C / 2, la = 0, za = Math.floor(C) + gb * Math.floor(C));
                "end" == this.pointPosition && (ma += C / 2, la = Math.floor(C) + gb * Math.floor(C), za = 0);
                if (vb) {
                    var hb = this.columnWidth;
                    isNaN(hb) || (la *= hb, za *= hb)
                }
                da || (x.x = ma); - 1E5 > ma && (ma = -1E5);
                ma > k + 1E5 && (ma = k + 1E5);
                n ? (E = D, R = O, O = D = ma, isNaN(ja) && !this.fillToGraph && (R = Fa), Na = Ba, Oa = Ca) : (R = E = ma, isNaN(ja) && !this.fillToGraph && (O = Fa));
                S < ja && (x.isNegative = !0, Ja && (ya = Ja), La && (Pa = La), void 0 != Aa && (ra = Aa));
                switch (g) {
                    case "line":
                        isNaN(S) ? t || (this.drawLineGraph(r, s, T, U), r = [], s = [], T = [], U = []) : (x.isNegative = S < ea ? !0 : !1, r.push(E), s.push(D), ca = E, ga = D, pa = E, qa = D, !Ma || isNaN(O) || isNaN(R) || (T.push(R), U.push(O)), void 0 == x.lineColor && void 0 == x.fillColors && isNaN(x.dashLength) || (this.drawLineGraph(r, s, T, U), r = [E], s = [D], T = [], U = [], this.lineColorSwitched = x.lineColor, this.fillColorsSwitched = x.fillColors, this.dashLengthSwitched = x.dashLength));
                        break;
                    case "smoothedLine":
                        isNaN(S) ? t || (this.drawSmoothedGraph(r, s, T, U), r = [], s = [], T = [], U = []) : (x.isNegative = S < ea ? !0 : !1, r.push(E), s.push(D), ca = E, ga = D, pa = E, qa = D, !Ma || isNaN(O) || isNaN(R) || (T.push(R), U.push(O)), void 0 == x.lineColor && void 0 == x.fillColors && isNaN(x.dashLength) || (this.drawSmoothedGraph(r, s, T, U), r = [E], s = [D], T = [], U = [], this.lineColorSwitched = x.lineColor, this.fillColorsSwitched = x.fillColors, this.dashLengthSwitched = x.dashLength));
                        break;
                    case "step":
                        isNaN(S) ? t || (w = v = NaN, this.drawLineGraph(r, s, T, U), r = [], s = [], T = [], U = []) : (x.isNegative = S < ea ? !0 : !1, void 0 == x.lineColor && void 0 == x.fillColors && isNaN(x.dashLength) || (this.drawLineGraph(r, s, T, U), r = [], s = [], T = [], U = [], this.lineColorSwitched = x.lineColor, this.fillColorsSwitched = x.fillColors, this.dashLengthSwitched = x.dashLength), n ? (isNaN(w) || (r.push(w), s.push(D - la)), s.push(D - la), r.push(E), s.push(D + za), r.push(E), !Ma || isNaN(O) || isNaN(R) || (T.push(u), U.push(O - la), T.push(R), U.push(O - la), T.push(R), U.push(O + za))) : (isNaN(v) || (s.push(v), r.push(w), s.push(v), r.push(E - la)), r.push(E - la), s.push(D), r.push(E + za), s.push(D), !Ma || isNaN(O) || isNaN(R) || (T.push(R - la), U.push(A), T.push(R - la), U.push(O), T.push(R + za), U.push(O))), w = E, v = D, u = R, A = O, ca = E, ga = D, pa = E, qa = D, vb && (w = v = NaN, this.drawLineGraph(r, s, T, U), r = [], s = [], T = [], U = []));
                        break;
                    case "column":
                        ka = ra;
                        void 0 != x.lineColor && (ka = x.lineColor);
                        if (!isNaN(S)) {
                            S < ea ? (x.isNegative = !0, Ja && (ya = Ja), void 0 != Aa && (ka = Aa)) : x.isNegative = !1;
                            var wb = e.min,
                                xb = e.max;
                            if (!(S < wb && ja < wb || S > xb && ja > xb)) if (n) {
                                "3d" == I ? (N = D - 0.5 * (h + G) + G / 2 + H * $, M = R + z * $) : (N = D - (p / 2 - $) * (h + G) + G / 2, M = R);
                                K = h;
                                ca = E;
                                ga = N + h / 2;
                                pa = E;
                                qa = N + h / 2;
                                N + K > l && (K = l - N);
                                0 > N && (K += N, N = 0);
                                ba = E - R;
                                var Kb = M;
                                M = AmCharts.fitToBounds(M, 0, k);
                                ba += Kb - M;
                                ba = AmCharts.fitToBounds(ba, -M, k - M + z * $);
                                if (N < l && 0 < K && (na = new AmCharts.Cuboid(f, ba, K, z - a.d3x, H - a.d3y, ya, Pa, L, ka, V, ha, q, n, Y, fb), "bottom" != B && "inside" != B && "middle" != B)) if (B = e.reversed ? "left" : "right", 0 > S) B = e.reversed ? "right" : "left";
                                else if ("regular" == I || "100%" == I) ca += this.dx
                            } else {
                                "3d" == I ? (M = E - 0.5 * (h + G) + G / 2 + z * $, N = O + H * $) : (M = E - (p / 2 - $) * (h + G) + G / 2, N = O);
                                K = h;
                                ca = M + h / 2;
                                ga = D;
                                pa = M + h / 2;
                                qa = D;
                                M + K > k + $ * z && (K = k - M + $ * z);
                                0 > M && (K += M, M = 0);
                                ba = D - O;
                                var Lb = N;
                                N = AmCharts.fitToBounds(N, this.dy, l);
                                ba += Lb - N;
                                ba = AmCharts.fitToBounds(ba, -N + H * $, l - N);
                                if (M < k + $ * z && 0 < K) if (na = new AmCharts.Cuboid(f, K, ba, z - a.d3x, H - a.d3y, ya, Pa, L, ka, this.lineAlpha, ha, q, n, Y, fb), 0 > S && "middle" != B && "inside" != B) B = "bottom";
                                else if (B = aa, "regular" == I || "100%" == I) ga += this.dy
                            }
                            if (na && (sa = na.set, sa.translate(M, N), this.columnsSet.push(sa), (x.url || this.showHandOnHover) && sa.setAttr("cursor", "pointer"), !da)) {
                                "none" == I && (y = n ? (this.end + 1 - J) * F - c : F * J + c);
                                "3d" == I && (n ? (y = (F - c) * (this.end + 1 - J), ca += z * this.columnIndex, pa += z * this.columnIndex, x.y += z * this.columnIndex) : (y = (F - c) * (J + 1), ca += 3, ga += H * this.columnIndex + 7, qa += H * this.columnIndex, x.y += H * this.columnIndex));
                                if ("regular" == I || "100%" == I)"inside" != B && (B = "middle"), y = n ? 0 < ta.value ? (this.end + 1 - J) * F + c : (this.end + 1 - J) * F - c : 0 < ta.value ? F * J + c : F * J - c;
                                this.columnsArray.push({
                                    column: na,
                                    depth: y
                                });
                                x.x = n ? N + K / 2 : M + K / 2;
                                this.ownColumns.push(na);
                                this.animateColumns(na, J, E, R, D, O);
                                this.addListeners(sa, x)
                            }
                        }
                        break;
                    case "candlestick":
                        if (!isNaN(ja) && !isNaN(S)) {
                            var Ya, ib;
                            ka = ra;
                            void 0 != x.lineColor && (ka = x.lineColor);
                            if (n) {
                                if (N = D - h / 2, M = R, K = h, N + K > l && (K = l - N), 0 > N && (K += N, N = 0), N < l && 0 < K) {
                                    var jb, kb;
                                    S > ja ? (jb = [E, Oa], kb = [R, Na]) : (jb = [R, Oa], kb = [E, Na]);
                                    !isNaN(Oa) && !isNaN(Na) && D < l && 0 < D && (Ya = AmCharts.line(f, jb, [D, D], ka, V, L), ib = AmCharts.line(f, kb, [D, D], ka, V, L));
                                    ba = E - R;
                                    na = new AmCharts.Cuboid(f, ba, K, z, H, ya, Ka, L, ka, V, ha, q, n, Y)
                                }
                            } else if (M = E - h / 2, N = O + L / 2, K = h, M + K > k && (K = k - M), 0 > M && (K += M, M = 0), ba = D - O, M < k && 0 < K) {
                                var na = new AmCharts.Cuboid(f, K, ba, z, H, ya, Pa, L, ka, V, ha, q, n, Y),
                                    lb, mb;
                                S > ja ? (lb = [D, Ca], mb = [O, Ba]) : (lb = [O, Ca], mb = [D, Ba]);
                                !isNaN(Ca) && !isNaN(Ba) && E < k && 0 < E && (Ya = AmCharts.line(f, [E, E], lb, ka, V, L), ib = AmCharts.line(f, [E, E], mb, ka, V, L))
                            }
                            na && (sa = na.set, Z.push(sa), sa.translate(M, N - L / 2), (x.url || this.showHandOnHover) && sa.setAttr("cursor", "pointer"), Ya && (Z.push(Ya), Z.push(ib)), ca = E, ga = D, pa = E, qa = D, da || (x.x = n ? N + K / 2 : M + K / 2, this.animateColumns(na, J, E, R, D, O), this.addListeners(sa, x)))
                        }
                        break;
                    case "ohlc":
                        if (!(isNaN(ja) || isNaN(db) || isNaN(eb) || isNaN(S))) {
                            S < ja && (x.isNegative = !0, void 0 != Aa && (ra = Aa));
                            var nb, ob, pb;
                            if (n) {
                                var qb = D - h / 2,
                                    qb = AmCharts.fitToBounds(qb, 0, l),
                                    yb = AmCharts.fitToBounds(D, 0, l),
                                    rb = D + h / 2,
                                    rb = AmCharts.fitToBounds(rb, 0, l);
                                ob = AmCharts.line(f, [R, R], [qb, yb], ra, V, L, Y);
                                0 < D && D < l && (nb = AmCharts.line(f, [Na, Oa], [D, D], ra, V, L, Y));
                                pb = AmCharts.line(f, [E, E], [yb, rb], ra, V, L, Y)
                            } else {
                                var sb = E - h / 2,
                                    sb = AmCharts.fitToBounds(sb, 0, k),
                                    zb = AmCharts.fitToBounds(E, 0, k),
                                    tb = E + h / 2,
                                    tb = AmCharts.fitToBounds(tb, 0, k);
                                ob = AmCharts.line(f, [sb, zb], [O, O], ra, V, L, Y);
                                0 < E && E < k && (nb = AmCharts.line(f, [E, E], [Ba, Ca], ra, V, L, Y));
                                pb = AmCharts.line(f, [zb, tb], [D, D], ra, V, L, Y)
                            }
                            Z.push(ob);
                            Z.push(nb);
                            Z.push(pb);
                            ca = E;
                            ga = D;
                            pa = E;
                            qa = D
                        }
                }
                if (!da && !isNaN(S)) {
                    var Ab = this.hideBulletsCount;
                    if (this.end - this.start <= Ab || 0 === Ab) {
                        var Da = this.createBullet(x, pa, qa, J);
                        Da || (Da = 0);
                        var Bb = this.labelText;
                        if (Bb) {
                            var fa = this.createLabel(x, 0, 0, Bb),
                                ua = 0,
                                va = 0,
                                Cb = fa.getBBox(),
                                Ha = Cb.width,
                                Ea = Cb.height;
                            switch (B) {
                                case "left":
                                    ua = -(Ha / 2 + Da / 2 + 3);
                                    break;
                                case "top":
                                    va = -(Ea / 2 + Da / 2 + 3);
                                    break;
                                case "right":
                                    ua = Da / 2 + 2 + Ha / 2;
                                    break;
                                case "bottom":
                                    n && "column" == g ? (ca = Fa, 0 > S ? (ua = -6, fa.attr({
                                        "text-anchor": "end"
                                    })) : (ua = 6, fa.attr({
                                        "text-anchor": "start"
                                    }))) : (va = Da / 2 + Ea / 2, fa.x = -(Ha / 2 + 2));
                                    break;
                                case "middle":
                                    "column" == g && (n ? (va = -(Ea / 2) + this.fontSize / 2, ua = -(E - R) / 2 - z, 0 > ba && (ua += z), Math.abs(E - R) < Ha && !this.showAllValueLabels && (fa.remove(), fa = null)) : (va = -(D - O) / 2, 0 > ba && (va -= H), Math.abs(D - O) < Ea && !this.showAllValueLabels && (fa.remove(), fa = null)));
                                    break;
                                case "inside":
                                    n ? (va = -(Ea / 2) + this.fontSize / 2, ua = 0 > ba ? Ha : -Ha) : va = 0 > ba ? Ea : -Ea
                            }
                            if (fa) {
                                if (isNaN(ga) || isNaN(ca)) fa.remove(), fa = null;
                                else if (ca += ua, ga += va, fa.translate(ca, ga), n) {
                                    if (0 > ga || ga > l) fa.remove(), fa = null
                                } else {
                                    var Db = 0;
                                    "3d" == I && (Db = z * $);
                                    if (0 > ca || ca > k + Db) fa.remove(), fa = null
                                }
                                fa && this.allBullets.push(fa)
                            }
                        }
                        if ("regular" == I || "100%" == I) {
                            var Eb = e.totalText;
                            if (Eb) {
                                var Ia = this.createLabel(x, 0, 0, Eb, e.totalTextColor);
                                this.allBullets.push(Ia);
                                var Fb = Ia.getBBox(),
                                    Gb = Fb.width,
                                    Hb = Fb.height,
                                    Qa, Ra, Ib = e.totals[J];
                                Ib && Ib.remove();
                                var Sa = 0;
                                "column" != g && (Sa = Da);
                                n ? (Ra = D, Qa = 0 > S ? E - Gb / 2 - 2 - Sa : E + Gb / 2 + 3 + Sa) : (Qa = E, Ra = 0 > S ? D + Hb / 2 + Sa : D - Hb / 2 - 3 - Sa);
                                Ia.translate(Qa, Ra);
                                e.totals[J] = Ia;
                                n ? (0 > Ra || Ra > l) && Ia.remove() : (0 > Qa || Qa > k) && Ia.remove()
                            }
                        }
                    }
                }
            }
        }
        if ("line" == g || "step" == g || "smoothedLine" == g)"smoothedLine" == g ? this.drawSmoothedGraph(r, s, T, U) : this.drawLineGraph(r, s, T, U), da || this.launchAnimation();
        this.bulletsHidden && this.hideBullets()
    },
    animateColumns: function(a, b, c, d, f, e) {
        var g = this;
        c = g.chart.startDuration;
        0 < c && !g.animationPlayed && (g.seqAn ? (a.set.hide(), g.animationArray.push(a), a = setTimeout(function() {
            g.animate.call(g)
        }, c / (g.end - g.start + 1) * (b - g.start) * 1E3), g.timeOuts.push(a)) : g.animate(a))
    },
    createLabel: function(a, b, c, d, f) {
        var e = this.chart,
            g = a.labelColor;
        g || (g = this.color);
        g || (g = e.color);
        f && (g = f);
        f = this.fontSize;
        void 0 === f && (this.fontSize = f = e.fontSize);
        a = e.formatString(d, a, this);
        a = AmCharts.cleanFromEmpty(a);
        e = AmCharts.text(this.container, a, g, e.fontFamily, f);
        e.translate(b, c);
        this.bulletSet.push(e);
        return e
    },
    positiveClip: function(a) {
        a.clipRect(this.pmx, this.pmy, this.pmw, this.pmh)
    },
    negativeClip: function(a) {
        a.clipRect(this.nmx, this.nmy, this.nmw, this.nmh)
    },
    drawLineGraph: function(a, b, c, d) {
        var f = this;
        if (1 < a.length) {
            var e = f.set,
                g = f.container,
                h = g.set(),
                k = g.set();
            e.push(k);
            e.push(h);
            var l = f.lineAlpha,
                m = f.lineThickness,
                e = f.fillAlphas,
                n = f.lineColor,
                p = f.negativeLineAlpha;
            isNaN(p) && (p = l);
            var q = f.lineColorSwitched;
            q && (n = q);
            var q = f.fillColors,
                t = f.fillColorsSwitched;
            t && (q = t);
            var r = f.dashLength;
            (t = f.dashLengthSwitched) && (r = t);
            var t = f.negativeLineColor,
                s = f.negativeFillColors,
                w = f.negativeFillAlphas,
                v = f.baseCoord;
            0 !== f.negativeBase && (v = f.valueAxis.getCoordinate(f.negativeBase));
            l = AmCharts.line(g, a, b, n, l, m, r, !1, !0);
            h.push(l);
            h.click(function() {
                f.handleGraphClick()
            });
            void 0 !== t && (m = AmCharts.line(g, a, b, t, p, m, r, !1, !0), k.push(m));
            if (0 < e || 0 < w) if (m = a.join(";").split(";"), p = b.join(";").split(";"), "serial" == f.chartType && (0 < c.length ? (c.reverse(), d.reverse(), m = a.concat(c), p = b.concat(d)) : f.rotate ? (p.push(p[p.length - 1]), m.push(v), p.push(p[0]), m.push(v), p.push(p[0]), m.push(m[0])) : (m.push(m[m.length - 1]), p.push(v), m.push(m[0]), p.push(v), m.push(a[0]), p.push(p[0]))), a = f.gradientRotation, 0 < e && (b = AmCharts.polygon(g, m, p, q, e, 1, "#000", 0, a), b.pattern(f.pattern), h.push(b)), s || void 0 !== t) isNaN(w) && (w = e), s || (s = t), g = AmCharts.polygon(g, m, p, s, w, 1, "#000", 0, a), g.pattern(f.pattern), k.push(g), k.click(function() {
                f.handleGraphClick()
            });
            f.applyMask(k, h)
        }
    },
    applyMask: function(a, b) {
        var c = a.length();
        "serial" != this.chartType || this.scrollbar || (this.positiveClip(b), 0 < c && this.negativeClip(a))
    },
    drawSmoothedGraph: function(a, b, c, d) {
        if (1 < a.length) {
            var f = this.set,
                e = this.container,
                g = e.set(),
                h = e.set();
            f.push(h);
            f.push(g);
            var k = this.lineAlpha,
                l = this.lineThickness,
                f = this.dashLength,
                m = this.fillAlphas,
                n = this.lineColor,
                p = this.fillColors,
                q = this.negativeLineColor,
                t = this.negativeFillColors,
                r = this.negativeFillAlphas,
                s = this.baseCoord,
                w = this.lineColorSwitched;
            w && (n = w);
            (w = this.fillColorsSwitched) && (p = w);
            w = this.negativeLineAlpha;
            isNaN(w) && (w = k);
            k = new AmCharts.Bezier(e, a, b, n, k, l, p, 0, f);
            g.push(k.path);
            void 0 !== q && (l = new AmCharts.Bezier(e, a, b, q, w, l, p, 0, f), h.push(l.path));
            0 < m && (k = a.join(";").split(";"), n = b.join(";").split(";"), l = "", 0 < c.length ? (c.push("M"), d.push("M"), c.reverse(), d.reverse(), k = a.concat(c), n = b.concat(d)) : (this.rotate ? (l += " L" + s + "," + b[b.length - 1], l += " L" + s + "," + b[0]) : (l += " L" + a[a.length - 1] + "," + s, l += " L" + a[0] + "," + s), l += " L" + a[0] + "," + b[0]), c = new AmCharts.Bezier(e, k, n, NaN, 0, 0, p, m, f, l), c.path.pattern(this.pattern), g.push(c.path), t || void 0 !== q) && (r || (r = m), t || (t = q), a = new AmCharts.Bezier(e, a, b, NaN, 0, 0, t, r, f, l), a.path.pattern(this.pattern), h.push(a.path));
            this.applyMask(h, g)
        }
    },
    launchAnimation: function() {
        var a = this,
            b = a.chart.startDuration;
        if (0 < b && !a.animationPlayed) {
            var c = a.set,
                d = a.bulletSet;
            AmCharts.VML || (c.attr({
                opacity: a.startAlpha
            }), d.attr({
                opacity: a.startAlpha
            }));
            c.hide();
            d.hide();
            a.seqAn ? (b = setTimeout(function() {
                a.animateGraphs.call(a)
            }, a.index * b * 1E3), a.timeOuts.push(b)) : a.animateGraphs()
        }
    },
    animateGraphs: function() {
        var a = this.chart,
            b = this.set,
            c = this.bulletSet,
            d = this.x,
            f = this.y;
        b.show();
        c.show();
        var e = a.startDuration,
            a = a.startEffect;
        b && (this.rotate ? (b.translate(-1E3, f), c.translate(-1E3, f)) : (b.translate(d, -1E3), c.translate(d, -1E3)), b.animate({
            opacity: 1,
            translate: d + "," + f
        }, e, a), c.animate({
            opacity: 1,
            translate: d + "," + f
        }, e, a))
    },
    animate: function(a) {
        var b = this.chart,
            c = this.animationArray;
        !a && 0 < c.length && (a = c[0], c.shift());
        c = AmCharts[AmCharts.getEffect(b.startEffect)];
        b = b.startDuration;
        a && (this.rotate ? a.animateWidth(b, c) : a.animateHeight(b, c), a.set.show())
    },
    legendKeyColor: function() {
        var a = this.legendColor,
            b = this.lineAlpha;
        void 0 === a && (a = this.lineColor, 0 === b && (b = this.fillColors) && (a = "object" == typeof b ? b[0] : b));
        return a
    },
    legendKeyAlpha: function() {
        var a = this.legendAlpha;
        void 0 === a && (a = this.lineAlpha, 0 === a && this.fillAlphas && (a = this.fillAlphas), 0 === a && (a = this.bulletAlpha), 0 === a && (a = 1));
        return a
    },
    createBullet: function(a, b, c, d) {
        d = this.container;
        var f = this.bulletOffset,
            e = this.bulletSize;
        isNaN(a.bulletSize) || (e = a.bulletSize);
        var g = a.values.value;
        isNaN(this.maxValue) || isNaN(g) || (e = g / this.maxValue * this.maxBulletSize);
        var h = e;
        this.bulletAxis && (e = a.values.error, isNaN(e) || (g = e), e = this.bulletAxis.stepWidth * g);
        e < this.minBulletSize && (e = this.minBulletSize);
        this.rotate ? b += f : c -= f;
        var k, l = this.bulletColor;
        a.lineColor && (this.bulletColorSwitched = a.lineColor);
        this.bulletColorSwitched && (l = this.bulletColorSwitched);
        a.isNegative && void 0 !== this.bulletColorNegative && (l = this.bulletColorNegative);
        void 0 !== a.color && (l = a.color);
        f = this.bullet;
        a.bullet && (f = a.bullet);
        var g = this.bulletBorderThickness,
            m = this.bulletBorderColor,
            n = this.bulletBorderAlpha,
            p = this.bulletAlpha;
        m || (m = l);
        var q = a.alpha;
        isNaN(q) || (p = q);
        if ("none" != this.bullet || a.bullet) k = AmCharts.bullet(d, f, e, l, p, g, m, n, h);
        if (this.customBullet || a.customBullet) h = this.customBullet, a.customBullet && (h = a.customBullet), h && (k && k.remove(), "function" == typeof h ? (k = new h, k.chart = this.chart, a.bulletConfig && (k.availableSpace = c, k.graph = this, a.bulletConfig.minCoord = this.minCoord - c, k.bulletConfig = a.bulletConfig), k.write(d), k = k.set) : (this.chart.path && (h = this.chart.path + h), k = d.set(), d = d.image(h, 0, 0, e, e), k.push(d), this.centerCustomBullets && d.translate(-e / 2, -e / 2)));
        k && ((a.url || this.showHandOnHover) && k.setAttr("cursor", "pointer"), "serial" == this.chartType && (0 > b - 0 || b - 0 > this.width || c < -e / 2 || c - 0 > this.height) && (k.remove(), k = null), k && (this.bulletSet.push(k), k.translate(b, c), this.addListeners(k, a), this.allBullets.push(k)), a.bx = b, a.by = c);
        a.bulletGraphics = k;
        return e
    },
    showBullets: function() {
        var a = this.allBullets,
            b;
        this.bulletsHidden = !1;
        for (b = 0; b < a.length; b++) a[b].show()
    },
    hideBullets: function() {
        var a = this.allBullets,
            b;
        this.bulletsHidden = !0;
        for (b = 0; b < a.length; b++) a[b].hide()
    },
    addListeners: function(a, b) {
        var c = this;
        a.mouseover(function(a) {
            c.handleRollOver(b, a)
        }).mouseout(function(a) {
                c.handleRollOut(b, a)
            }).touchend(function(a) {
                c.handleRollOver(b, a);
                c.chart.panEventsEnabled && c.handleClick(b, a)
            }).touchstart(function(a) {
                c.handleRollOver(b, a)
            }).click(function(a) {
                c.handleClick(b, a)
            }).dblclick(function(a) {
                c.handleDoubleClick(b, a)
            }).contextmenu(function(a) {
                c.handleRightClick(b, a)
            })
    },
    handleRollOver: function(a, b) {
        if (a) {
            var c = this.chart,
                d = {
                    type: "rollOverGraphItem",
                    item: a,
                    index: a.index,
                    graph: this,
                    target: this,
                    chart: this.chart,
                    event: b
                };
            this.fire("rollOverGraphItem", d);
            c.fire("rollOverGraphItem", d);
            clearTimeout(c.hoverInt);
            d = this.showBalloon;
            c.chartCursor && "serial" == this.chartType && (d = !1, !c.chartCursor.valueBalloonsEnabled && this.showBalloon && (d = !0));
            if (d) {
                var d = c.formatString(this.balloonText, a, a.graph),
                    f = this.balloonFunction;
                f && (d = f(a, a.graph));
                d = AmCharts.cleanFromEmpty(d);
                f = c.getBalloonColor(this, a);
                c.balloon.showBullet = !1;
                c.balloon.pointerOrientation = "V";
                var e = a.x,
                    g = a.y;
                c.rotate && (e = a.y, g = a.x);
                c.showBalloon(d, f, !0, e + c.marginLeftReal, g + c.marginTopReal)
            }
        }
    },
    handleRollOut: function(a, b) {
        this.chart.hideBalloon();
        if (a) {
            var c = {
                type: "rollOutGraphItem",
                item: a,
                index: a.index,
                graph: this,
                target: this,
                chart: this.chart,
                event: b
            };
            this.fire("rollOutGraphItem", c);
            this.chart.fire("rollOutGraphItem", c)
        }
    },
    handleClick: function(a, b) {
        if (a) {
            var c = {
                type: "clickGraphItem",
                item: a,
                index: a.index,
                graph: this,
                target: this,
                chart: this.chart,
                event: b
            };
            this.fire("clickGraphItem", c);
            this.chart.fire("clickGraphItem", c);
            AmCharts.getURL(a.url, this.urlTarget)
        }
        this.handleGraphClick()
    },
    handleGraphClick: function() {
        var a = {
            type: "clickGraph",
            graph: this,
            target: this,
            chart: this.chart
        };
        this.fire("clickGraph", a);
        this.chart.fire("clickGraph", a)
    },
    handleRightClick: function(a, b) {
        if (a) {
            var c = {
                type: "rightClickGraphItem",
                item: a,
                index: a.index,
                graph: this,
                target: this,
                chart: this.chart,
                event: b
            };
            this.fire("rightClickGraphItem", c);
            this.chart.fire("rightClickGraphItem", c)
        }
    },
    handleDoubleClick: function(a, b) {
        if (a) {
            var c = {
                type: "doubleClickGraphItem",
                item: a,
                index: a.index,
                graph: this,
                target: this,
                chart: this.chart,
                event: b
            };
            this.fire("doubleClickGraphItem", c);
            this.chart.fire("doubleClickGraphItem", c)
        }
    },
    zoom: function(a, b) {
        this.start = a;
        this.end = b;
        this.draw()
    },
    changeOpacity: function(a) {
        var b = this.set;
        b && b.setAttr("opacity", a);
        if (b = this.ownColumns) {
            var c;
            for (c = 0; c < b.length; c++) {
                var d = b[c].set;
                d && d.setAttr("opacity", a)
            }
        }(b = this.bulletSet) && b.setAttr("opacity", a)
    },
    destroy: function() {
        AmCharts.remove(this.set);
        AmCharts.remove(this.bulletSet);
        var a = this.timeOuts;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) clearTimeout(a[b])
        }
        this.timeOuts = []
    }
});
AmCharts.ChartCursor = AmCharts.Class({
    construct: function(a) {
        this.createEvents("changed", "zoomed", "onHideCursor", "draw", "selected");
        this.className = "ChartCursor";
        this.enabled = !0;
        this.cursorAlpha = 1;
        this.selectionAlpha = 0.2;
        this.cursorColor = "#CC0000";
        this.categoryBalloonAlpha = 1;
        this.color = "#FFFFFF";
        this.type = "cursor";
        this.zoomed = !1;
        this.zoomable = !0;
        this.pan = !1;
        this.categoryBalloonDateFormat = "MMM DD, YYYY";
        this.categoryBalloonEnabled = this.valueBalloonsEnabled = !0;
        this.rolledOver = !1;
        this.cursorPosition = "middle";
        this.bulletsEnabled = this.skipZoomDispatch = !1;
        this.bulletSize = 8;
        this.selectWithoutZooming = this.oneBalloonOnly = !1;
        this.graphBulletSize = 1.7;
        this.animationDuration = 0.3;
        AmCharts.applyTheme(this, a, "ChartCursor")
    },
    draw: function() {
        var a = this;
        a.destroy();
        var b = a.chart,
            c = b.container;
        a.rotate = b.rotate;
        a.container = c;
        c = c.set();
        c.translate(a.x, a.y);
        a.set = c;
        b.cursorSet.push(c);
        c = new AmCharts.AmBalloon;
        c.chart = b;
        a.categoryBalloon = c;
        AmCharts.copyProperties(b.balloon, c);
        c.cornerRadius = 0;
        c.shadowAlpha = 0;
        c.borderThickness = 1;
        c.borderAlpha = 1;
        c.showBullet = !1;
        var d = a.categoryBalloonColor;
        void 0 === d && (d = a.cursorColor);
        c.fillColor = d;
        c.fillAlpha = a.categoryBalloonAlpha;
        c.borderColor = d;
        c.color = a.color;
        a.rotate && (c.pointerOrientation = "H");
        a.prevX = [];
        a.prevY = [];
        a.prevTX = [];
        a.prevTY = [];
        if (a.valueBalloonsEnabled) for (c = 0; c < b.graphs.length; c++) d = new AmCharts.AmBalloon, d.chart = b, AmCharts.copyProperties(b.balloon, d), b.graphs[c].valueBalloon = d;
        "cursor" == a.type ? a.createCursor() : a.createCrosshair();
        a.interval = setInterval(function() {
            a.detectMovement.call(a)
        }, 40)
    },
    updateData: function() {
        var a = this.chart;
        this.data = a.chartData;
        this.firstTime = a.firstTime;
        this.lastTime = a.lastTime
    },
    createCursor: function() {
        var a = this.chart,
            b = this.cursorAlpha,
            c = a.categoryAxis,
            d = c.position,
            f = c.inside,
            e = c.axisThickness,
            g = this.categoryBalloon,
            h, k, l = a.dx,
            m = a.dy,
            n = this.x,
            p = this.y,
            q = this.width,
            t = this.height,
            a = a.rotate,
            r = c.tickLength;
        g.pointerWidth = r;
        a ? (h = [0, q, q + l], k = [0, 0, m]) : (h = [l, 0, 0], k = [m, 0, t]);
        this.line = b = AmCharts.line(this.container, h, k, this.cursorColor, b, 1);
        this.set.push(b);
        a ? (f && (g.pointerWidth = 0), "right" == d ? f ? g.setBounds(n, p + m, n + q + l, p + t + m) : g.setBounds(n + q + l + e, p + m, n + q + 1E3, p + t + m) : f ? g.setBounds(n, p, q + n, t + p) : g.setBounds(-1E3, -1E3, n - r - e, p + t + 15)) : (g.maxWidth = q, c.parseDates && (r = 0, g.pointerWidth = 0), "top" == d ? f ? g.setBounds(n + l, p + m, q + l + n, t + p) : g.setBounds(n + l, -1E3, q + l + n, p + m - r - e) : f ? g.setBounds(n, p, q + n, t + p - r) : g.setBounds(n, p + t + r + e - 1, n + q, p + t + r + e));
        this.hideCursor()
    },
    createCrosshair: function() {
        var a = this.cursorAlpha,
            b = this.container,
            c = AmCharts.line(b, [0, 0], [0, this.height], this.cursorColor, a, 1),
            a = AmCharts.line(b, [0, this.width], [0, 0], this.cursorColor, a, 1);
        this.set.push(c);
        this.set.push(a);
        this.vLine = c;
        this.hLine = a;
        this.hideCursor()
    },
    detectMovement: function() {
        var a = this.chart;
        if (a.mouseIsOver) {
            var b = a.mouseX - this.x,
                c = a.mouseY - this.y;
            0 < b && b < this.width && 0 < c && c < this.height ? (this.drawing ? this.rolledOver || a.setMouseCursor("crosshair") : this.pan && (this.rolledOver || a.setMouseCursor("move")), this.rolledOver = !0, this.setPosition()) : this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
        } else this.rolledOver && (this.handleMouseOut(), this.rolledOver = !1)
    },
    getMousePosition: function() {
        var a, b = this.width,
            c = this.height;
        a = this.chart;
        this.rotate ? (a = a.mouseY - this.y, 0 > a && (a = 0), a > c && (a = c)) : (a = a.mouseX - this.x, 0 > a && (a = 0), a > b && (a = b));
        return a
    },
    updateCrosshair: function() {
        var a = this.chart,
            b = a.mouseX - this.x,
            c = a.mouseY - this.y,
            d = this.vLine,
            f = this.hLine,
            b = AmCharts.fitToBounds(b, 0, this.width),
            c = AmCharts.fitToBounds(c, 0, this.height);
        0 < this.cursorAlpha && (d.show(), f.show(), d.translate(b, 0), f.translate(0, c));
        this.zooming && (a.hideXScrollbar && (b = NaN), a.hideYScrollbar && (c = NaN), this.updateSelectionSize(b, c));
        a.mouseIsOver || this.zooming || this.hideCursor()
    },
    updateSelectionSize: function(a, b) {
        AmCharts.remove(this.selection);
        var c = this.selectionPosX,
            d = this.selectionPosY,
            f = 0,
            e = 0,
            g = this.width,
            h = this.height;
        isNaN(a) || (c > a && (f = a, g = c - a), c < a && (f = c, g = a - c), c == a && (f = a, g = 0));
        isNaN(b) || (d > b && (e = b, h = d - b), d < b && (e = d, h = b - d), d == b && (e = b, h = 0));
        0 < g && 0 < h && (c = AmCharts.rect(this.container, g, h, this.cursorColor, this.selectionAlpha), c.translate(f + this.x, e + this.y), this.selection = c)
    },
    arrangeBalloons: function() {
        var a = this.valueBalloons,
            b = this.x,
            c = this.y,
            d = this.height + c;
        a.sort(this.compareY);
        var f;
        for (f = 0; f < a.length; f++) {
            var e = a[f].balloon;
            e.setBounds(b, c, b + this.width, d);
            e.prevX = this.prevX[f];
            e.prevY = this.prevY[f];
            e.prevTX = this.prevTX[f];
            e.prevTY = this.prevTY[f];
            e.draw();
            d = e.yPos - 3
        }
        this.arrangeBalloons2()
    },
    compareY: function(a, b) {
        return a.yy < b.yy ? 1 : -1
    },
    arrangeBalloons2: function() {
        var a = this.valueBalloons;
        a.reverse();
        var b, c = this.x,
            d, f, e = a.length;
        for (f = 0; f < e; f++) {
            var g = a[f].balloon;
            b = g.bottom;
            var h = g.bottom - g.yPos,
                k = e - f - 1;
            0 < f && b - h < d + 3 && (g.setBounds(c, d + 3, c + this.width, d + h + 3), g.prevX = this.prevX[k], g.prevY = this.prevY[k], g.prevTX = this.prevTX[k], g.prevTY = this.prevTY[k], g.draw());
            g.set && g.set.show();
            this.prevX[k] = g.prevX;
            this.prevY[k] = g.prevY;
            this.prevTX[k] = g.prevTX;
            this.prevTY[k] = g.prevTY;
            d = g.bottom
        }
    },
    showBullets: function() {
        AmCharts.remove(this.allBullets);
        var a = this.container,
            b = a.set();
        this.set.push(b);
        this.set.show();
        this.allBullets = b;
        var b = this.chart.graphs,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            if (!d.hidden && d.balloonText) {
                var f = this.data[this.index].axes[d.valueAxis.id].graphs[d.id],
                    e = f.y;
                if (!isNaN(e)) {
                    var g, h;
                    g = f.x;
                    this.rotate ? (h = e, e = g) : h = g;
                    d = AmCharts.circle(a, this.bulletSize / 2, this.chart.getBalloonColor(d, f, !0), d.cursorBulletAlpha);
                    d.translate(h, e);
                    this.allBullets.push(d)
                }
            }
        }
    },
    destroy: function() {
        this.clear();
        AmCharts.remove(this.selection);
        this.selection = null;
        var a = this.categoryBalloon;
        a && a.destroy();
        this.destroyValueBalloons();
        AmCharts.remove(this.set)
    },
    clear: function() {
        clearInterval(this.interval)
    },
    destroyValueBalloons: function() {
        var a = this.valueBalloons;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) a[b].balloon.hide()
        }
    },
    zoom: function(a, b, c, d) {
        var f = this.chart;
        this.destroyValueBalloons();
        this.zooming = !1;
        var e;
        this.rotate ? this.selectionPosY = e = f.mouseY : this.selectionPosX = e = f.mouseX;
        this.start = a;
        this.end = b;
        this.startTime = c;
        this.endTime = d;
        this.zoomed = !0;
        var g = f.categoryAxis,
            f = this.rotate;
        e = this.width;
        var h = this.height;
        g.parseDates && !g.equalSpacing ? (a = d - c + g.minDuration(), a = f ? h / a : e / a) : a = f ? h / (b - a) : e / (b - a);
        this.stepWidth = a;
        this.tempVal = this.valueBalloonsEnabled;
        this.valueBalloonsEnabled = !1;
        this.setPosition();
        this.valueBalloonsEnabled = this.tempVal;
        this.hideCursor()
    },
    hideObj: function(a) {
        a && a.hide()
    },
    hideCursor: function(a) {
        void 0 === a && (a = !0);
        this.hideObj(this.set);
        this.hideObj(this.categoryBalloon);
        this.hideObj(this.line);
        this.hideObj(this.vLine);
        this.hideObj(this.hLine);
        this.hideObj(this.allBullets);
        this.destroyValueBalloons();
        this.selectWithoutZooming || AmCharts.remove(this.selection);
        this.previousIndex = NaN;
        a && this.fire("onHideCursor", {
            type: "onHideCursor",
            chart: this.chart,
            target: this
        });
        this.drawing || this.chart.setMouseCursor("auto");
        this.normalizeBulletSize()
    },
    setPosition: function(a, b) {
        void 0 === b && (b = !0);
        if ("cursor" == this.type) {
            if (AmCharts.ifArray(this.data)) {
                isNaN(a) && (a = this.getMousePosition());
                if ((a != this.previousMousePosition || !0 === this.zoomed || this.oneBalloonOnly) && !isNaN(a)) {
                    var c = this.chart.categoryAxis.xToIndex(a);
                    if (c != this.previousIndex || this.zoomed || "mouse" == this.cursorPosition || this.oneBalloonOnly) this.updateCursor(c, b), this.zoomed = !1
                }
                this.previousMousePosition = a
            }
        } else this.updateCrosshair()
    },
    normalizeBulletSize: function() {
        var a = this.resizedBullets;
        if (a) for (var b = 0; b < a.length; b++) {
            var c = a[b],
                d = c.bulletGraphics;
            d && d.translate(c.bx, c.by, 1)
        }
    },
    updateCursor: function(a, b) {
        var c = this.chart,
            d = c.mouseX - this.x,
            f = c.mouseY - this.y;
        this.drawingNow && (AmCharts.remove(this.drawingLine), this.drawingLine = AmCharts.line(this.container, [this.x + this.drawStartX, this.x + d], [this.y + this.drawStartY, this.y + f], this.cursorColor, 1, 1));
        if (this.enabled) {
            void 0 === b && (b = !0);
            this.index = a;
            var e = c.categoryAxis,
                g = c.dx,
                h = c.dy,
                k = this.x,
                l = this.y,
                m = this.width,
                n = this.height,
                p = this.data[a];
            if (p) {
                var q = p.x[e.id],
                    t = c.rotate,
                    r = e.inside,
                    s = this.stepWidth,
                    w = this.categoryBalloon,
                    v = this.firstTime,
                    u = this.lastTime,
                    A = this.cursorPosition,
                    F = e.position,
                    y = this.zooming,
                    z = this.panning,
                    H = c.graphs,
                    I = e.axisThickness;
                if (c.mouseIsOver || y || z || this.forceShow) if (this.forceShow = !1, z) {
                    var g = this.panClickPos,
                        c = this.panClickEndTime,
                        y = this.panClickStartTime,
                        B = this.panClickEnd,
                        k = this.panClickStart,
                        d = (t ? g - f : g - d) / s;
                    if (!e.parseDates || e.equalSpacing) d = Math.round(d);
                    0 !== d && (g = {
                        type: "zoomed",
                        target: this
                    }, g.chart = this.chart, e.parseDates && !e.equalSpacing ? (c + d > u && (d = u - c), y + d < v && (d = v - y), g.start = y + d, g.end = c + d, this.fire(g.type, g)) : B + d >= this.data.length || 0 > k + d || (g.start = k + d, g.end = B + d, this.fire(g.type, g)))
                } else {
                    "start" == A && (q -= e.cellWidth / 2);
                    "mouse" == A && c.mouseIsOver && (q = t ? f - 2 : d - 2);
                    if (t) {
                        if (0 > q) if (y) q = 0;
                        else {
                            this.hideCursor();
                            return
                        }
                        if (q > n + 1) if (y) q = n + 1;
                        else {
                            this.hideCursor();
                            return
                        }
                    } else {
                        if (0 > q) if (y) q = 0;
                        else {
                            this.hideCursor();
                            return
                        }
                        if (q > m) if (y) q = m;
                        else {
                            this.hideCursor();
                            return
                        }
                    }
                    0 < this.cursorAlpha && (v = this.line, t ? (u = 0, s = q + h) : (u = q, s = 0), A = this.animationDuration, 0 < A && !this.zooming ? isNaN(this.previousX) ? v.translate(u, s) : (v.translate(this.previousX, this.previousY), v.animate({
                        translate: u + "," + s
                    }, A, "easeOutSine")) : v.translate(u, s), this.previousX = u, this.previousY = s, v.show());
                    this.linePos = t ? q + h : q;
                    y && (t ? this.updateSelectionSize(NaN, q) : this.updateSelectionSize(q, NaN));
                    s = !0;
                    y && (s = !1);
                    this.categoryBalloonEnabled && s ? (t ? (r && ("right" == F ? w.setBounds(k, l + h, k + m + g, l + q + h) : w.setBounds(k, l + h, k + m + g, l + q)), "right" == F ? r ? w.setPosition(k + m + g, l + q + h) : w.setPosition(k + m + g + I, l + q + h) : r ? w.setPosition(k, l + q) : w.setPosition(k - I, l + q)) : "top" == F ? r ? w.setPosition(k + q + g, l + h) : w.setPosition(k + q + g, l + h - I + 1) : r ? w.setPosition(k + q, l + n) : w.setPosition(k + q, l + n + I - 1), (v = this.categoryBalloonFunction) ? w.showBalloon(v(p.category)) : e.parseDates ? (e = AmCharts.formatDate(p.category, this.categoryBalloonDateFormat), -1 != e.indexOf("fff") && (e = AmCharts.formatMilliseconds(e, p.category)), w.showBalloon(e)) : w.showBalloon(p.category)) : w.hide();
                    H && this.bulletsEnabled && this.showBullets();
                    if (this.oneBalloonOnly) {
                        h = Infinity;
                        for (u = 0; u < H.length; u++) e = H[u], e.showBalloon && !e.hidden && e.balloonText && (w = p.axes[e.valueAxis.id].graphs[e.id], v = w.y, isNaN(v) || (t ? Math.abs(d - v) < h && (h = Math.abs(d - v), B = e) : Math.abs(f - v) < h && (h = Math.abs(f - v), B = e)));
                        this.mostCloseGraph && (B = this.mostCloseGraph)
                    }
                    if (a != this.previousIndex || B != this.previousMostCloseGraph) if (this.normalizeBulletSize(), this.destroyValueBalloons(), this.resizedBullets = [], H && this.valueBalloonsEnabled && s && c.balloon.enabled) {
                        this.valueBalloons = h = [];
                        for (u = 0; u < H.length; u++) if (e = H[u], (!this.oneBalloonOnly || e == B) && e.showBalloon && !e.hidden && e.balloonText) {
                            w = p.axes[e.valueAxis.id].graphs[e.id];
                            v = w.y;
                            if (this.showNextAvalable && isNaN(v) && a + 1 < this.data.length) for (q = a + 1; q < this.data.length; q++) if (r = this.data[q]) if (w = r.axes[e.valueAxis.id].graphs[e.id], v = w.y, !isNaN(v)) break;
                            if (!isNaN(v)) {
                                r = w.x;
                                s = !0;
                                if (t) {
                                    if (q = v, 0 > r || r > n) s = !1
                                } else if (q = r, r = v, 0 > q || q > m + g) s = !1;
                                s && (1 != this.graphBulletSize && AmCharts.isModern && (s = w.bulletGraphics) && (s.getBBox(), s.translate(w.bx, w.by, this.graphBulletSize), this.resizedBullets.push(w)), s = e.valueBalloon, F = c.getBalloonColor(e, w), s.setBounds(k, l, k + m, l + n), s.pointerOrientation = "H", s.changeColor(F), void 0 !== e.balloonAlpha && (s.fillAlpha = e.balloonAlpha), void 0 !== e.balloonTextColor && (s.color = e.balloonTextColor), s.setPosition(q + k, r + l), q = c.formatString(e.balloonText, w, e), (r = e.balloonFunction) && (q = r(w, e)), "" !== q && (t ? s.showBalloon(q) : (s.text = q, s.show = !0)), !t && s.set && s.set.hide(), h.push({
                                    yy: v,
                                    balloon: s
                                }))
                            }
                        }
                        t || this.arrangeBalloons()
                    }
                    b ? (g = {
                        type: "changed"
                    }, g.index = a, g.target = this, g.chart = this.chart, g.zooming = y, g.mostCloseGraph = B, g.position = t ? f : d, g.target = this, c.fire("changed", g), this.fire("changed", g), this.skipZoomDispatch = !1) : (this.skipZoomDispatch = !0, c.updateLegendValues(a));
                    this.previousIndex = a;
                    this.previousMostCloseGraph = B
                }
            }
        } else this.hideCursor()
    },
    enableDrawing: function(a) {
        this.enabled = !a;
        this.hideCursor();
        this.rolledOver = !1;
        this.drawing = a
    },
    isZooming: function(a) {
        a && a != this.zooming && this.handleMouseDown("fake");
        a || a == this.zooming || this.handleMouseUp()
    },
    handleMouseOut: function() {
        if (this.enabled) if (this.zooming) this.setPosition();
        else {
            this.index = void 0;
            var a = {
                type: "changed",
                index: void 0,
                target: this
            };
            a.chart = this.chart;
            this.fire("changed", a);
            this.hideCursor()
        }
    },
    handleReleaseOutside: function() {
        this.handleMouseUp()
    },
    handleMouseUp: function() {
        var a = this.chart,
            b = this.data,
            c;
        if (a) {
            var d = a.mouseX - this.x,
                f = a.mouseY - this.y;
            if (this.drawingNow) {
                this.drawingNow = !1;
                AmCharts.remove(this.drawingLine);
                c = this.drawStartX;
                var e = this.drawStartY;
                if (2 < Math.abs(c - d) || 2 < Math.abs(e - f)) c = {
                    type: "draw",
                    target: this,
                    chart: a,
                    initialX: c,
                    initialY: e,
                    finalX: d,
                    finalY: f
                }, this.fire(c.type, c)
            }
            if (this.enabled && 0 < b.length) {
                if (this.pan) this.rolledOver = !1;
                else if (this.zoomable && this.zooming) {
                    c = this.selectWithoutZooming ? {
                        type: "selected"
                    } : {
                        type: "zoomed"
                    };
                    c.target = this;
                    c.chart = a;
                    if ("cursor" == this.type) this.rotate ? this.selectionPosY = f : this.selectionPosX = f = d, 2 > Math.abs(f - this.initialMouse) && this.fromIndex == this.index || (this.index < this.fromIndex ? (c.end = this.fromIndex, c.start = this.index) : (c.end = this.index, c.start = this.fromIndex), f = a.categoryAxis, f.parseDates && !f.equalSpacing && (c.start = b[c.start].time, c.end = a.getEndTime(b[c.end].time)), this.skipZoomDispatch || this.fire(c.type, c));
                    else {
                        var g = this.initialMouseX,
                            h = this.initialMouseY;
                        3 > Math.abs(d - g) && 3 > Math.abs(f - h) || (b = Math.min(g, d), e = Math.min(h, f), d = Math.abs(g - d), f = Math.abs(h - f), a.hideXScrollbar && (b = 0, d = this.width), a.hideYScrollbar && (e = 0, f = this.height), c.selectionHeight = f, c.selectionWidth = d, c.selectionY = e, c.selectionX = b, this.skipZoomDispatch || this.fire(c.type, c))
                    }
                    this.selectWithoutZooming || AmCharts.remove(this.selection)
                }
                this.panning = this.zooming = this.skipZoomDispatch = !1
            }
        }
    },
    showCursorAt: function(a) {
        var b = this.chart.categoryAxis;
        a = b.parseDates ? b.dateToCoordinate(a) : b.categoryToCoordinate(a);
        this.previousMousePosition = NaN;
        this.forceShow = !0;
        this.setPosition(a, !1)
    },
    handleMouseDown: function(a) {
        if (this.zoomable || this.pan || this.drawing) {
            var b = this.rotate,
                c = this.chart,
                d = c.mouseX - this.x,
                f = c.mouseY - this.y;
            if (0 < d && d < this.width && 0 < f && f < this.height || "fake" == a) this.setPosition(), this.selectWithoutZooming && AmCharts.remove(this.selection), this.drawing ? (this.drawStartY = f, this.drawStartX = d, this.drawingNow = !0) : this.pan ? (this.zoomable = !1, c.setMouseCursor("move"), this.panning = !0, this.panClickPos = b ? f : d, this.panClickStart = this.start, this.panClickEnd = this.end, this.panClickStartTime = this.startTime, this.panClickEndTime = this.endTime) : this.zoomable && ("cursor" == this.type ? (this.fromIndex = this.index, b ? (this.initialMouse = f, this.selectionPosY = this.linePos) : (this.initialMouse = d, this.selectionPosX = this.linePos)) : (this.initialMouseX = d, this.initialMouseY = f, this.selectionPosX = d, this.selectionPosY = f), this.zooming = !0)
        }
    }
});
AmCharts.SimpleChartScrollbar = AmCharts.Class({
    construct: function(a) {
        this.createEvents("zoomed");
        this.backgroundColor = "#D4D4D4";
        this.backgroundAlpha = 1;
        this.selectedBackgroundColor = "#EFEFEF";
        this.scrollDuration = this.selectedBackgroundAlpha = 1;
        this.resizeEnabled = !0;
        this.hideResizeGrips = !1;
        this.scrollbarHeight = 20;
        this.updateOnReleaseOnly = !1;
        9 > document.documentMode && (this.updateOnReleaseOnly = !0);
        this.dragIconWidth = 18;
        this.dragIconHeight = 25;
        AmCharts.applyTheme(this, a, "SimpleChartScrollbar")
    },
    draw: function() {
        var a = this;
        a.destroy();
        a.interval = setInterval(function() {
            a.updateScrollbar.call(a)
        }, 40);
        var b = a.chart.container,
            c = a.rotate,
            d = a.chart,
            f = b.set();
        a.set = f;
        d.scrollbarsSet.push(f);
        var e, g;
        c ? (e = a.scrollbarHeight, g = d.plotAreaHeight) : (g = a.scrollbarHeight, e = d.plotAreaWidth);
        a.width = e;
        if ((a.height = g) && e) {
            var h = AmCharts.rect(b, e, g, a.backgroundColor, a.backgroundAlpha, 1, a.backgroundColor, a.backgroundAlpha);
            a.bg = h;
            f.push(h);
            h = AmCharts.rect(b, e, g, "#000", 0.005);
            f.push(h);
            a.invisibleBg = h;
            h.click(function() {
                a.handleBgClick()
            }).mouseover(function() {
                    a.handleMouseOver()
                }).mouseout(function() {
                    a.handleMouseOut()
                }).touchend(function() {
                    a.handleBgClick()
                });
            h = AmCharts.rect(b, e, g, a.selectedBackgroundColor, a.selectedBackgroundAlpha);
            a.selectedBG = h;
            f.push(h);
            e = AmCharts.rect(b, e, g, "#000", 0.005);
            a.dragger = e;
            f.push(e);
            e.mousedown(function(b) {
                a.handleDragStart(b)
            }).mouseup(function() {
                    a.handleDragStop()
                }).mouseover(function() {
                    a.handleDraggerOver()
                }).mouseout(function() {
                    a.handleMouseOut()
                }).touchstart(function(b) {
                    a.handleDragStart(b)
                }).touchend(function() {
                    a.handleDragStop()
                });
            e = d.pathToImages;
            c ? (h = e + "dragIconH.gif", e = a.dragIconWidth, c = a.dragIconHeight) : (h = e + "dragIcon.gif", c = a.dragIconWidth, e = a.dragIconHeight);
            g = b.image(h, 0, 0, c, e);
            var h = b.image(h, 0, 0, c, e),
                k = 10,
                l = 20;
            d.panEventsEnabled && (k = 25, l = a.scrollbarHeight);
            var m = AmCharts.rect(b, k, l, "#000", 0.005),
                n = AmCharts.rect(b, k, l, "#000", 0.005);
            n.translate(-(k - c) / 2, -(l - e) / 2);
            m.translate(-(k - c) / 2, -(l - e) / 2);
            c = b.set([g, n]);
            b = b.set([h, m]);
            a.iconLeft = c;
            f.push(a.iconLeft);
            a.iconRight = b;
            f.push(b);
            c.mousedown(function() {
                a.leftDragStart()
            }).mouseup(function() {
                    a.leftDragStop()
                }).mouseover(function() {
                    a.iconRollOver()
                }).mouseout(function() {
                    a.iconRollOut()
                }).touchstart(function(b) {
                    a.leftDragStart()
                }).touchend(function() {
                    a.leftDragStop()
                });
            b.mousedown(function() {
                a.rightDragStart()
            }).mouseup(function() {
                    a.rightDragStop()
                }).mouseover(function() {
                    a.iconRollOver()
                }).mouseout(function() {
                    a.iconRollOut()
                }).touchstart(function(b) {
                    a.rightDragStart()
                }).touchend(function() {
                    a.rightDragStop()
                });
            AmCharts.ifArray(d.chartData) ? f.show() : f.hide();
            a.hideDragIcons();
            a.clipDragger(!1)
        }
        f.translate(a.x, a.y)
    },
    updateScrollbarSize: function(a, b) {
        var c = this.dragger,
            d, f, e, g;
        this.rotate ? (d = 0, f = a, e = this.width + 1, g = b - a, c.setAttr("height", b - a), c.setAttr("y", f)) : (d = a, f = 0, e = b - a, g = this.height + 1, c.setAttr("width", b - a), c.setAttr("x", d));
        this.clipAndUpdate(d, f, e, g)
    },
    updateScrollbar: function() {
        var a, b = !1,
            c, d, f = this.x,
            e = this.y,
            g = this.dragger,
            h = this.getDBox();
        c = h.x + f;
        d = h.y + e;
        var k = h.width,
            h = h.height,
            l = this.rotate,
            m = this.chart,
            n = this.width,
            p = this.height,
            q = m.mouseX,
            t = m.mouseY;
        a = this.initialMouse;
        m.mouseIsOver && (this.dragging && (m = this.initialCoord, l ? (a = m + (t - a), 0 > a && (a = 0), m = p - h, a > m && (a = m), g.setAttr("y", a)) : (a = m + (q - a), 0 > a && (a = 0), m = n - k, a > m && (a = m), g.setAttr("x", a))), this.resizingRight && (l ? (a = t - d, a + d > p + e && (a = p - d + e), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 === a && (a = 0.1), g.setAttr("height", a))) : (a = q - c, a + c > n + f && (a = n - c + f), 0 > a ? (this.resizingRight = !1, b = this.resizingLeft = !0) : (0 === a && (a = 0.1), g.setAttr("width", a)))), this.resizingLeft && (l ? (c = d, d = t, d < e && (d = e), d > p + e && (d = p + e), a = !0 === b ? c - d : h + c - d, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, g.setAttr("y", c + h - e)) : (0 === a && (a = 0.1), g.setAttr("y", d - e), g.setAttr("height", a))) : (d = q, d < f && (d = f), d > n + f && (d = n + f), a = !0 === b ? c - d : k + c - d, 0 > a ? (this.resizingRight = !0, this.resizingLeft = !1, g.setAttr("x", c + k - f)) : (0 === a && (a = 0.1), g.setAttr("x", d - f), g.setAttr("width", a)))), this.clipDragger(!0))
    },
    clipDragger: function(a) {
        var b = this.getDBox();
        if (b) {
            var c = b.x,
                d = b.y,
                f = b.width,
                b = b.height,
                e = !1;
            if (this.rotate) {
                if (c = 0, f = this.width + 1, this.clipY != d || this.clipH != b) e = !0
            } else if (d = 0, b = this.height + 1, this.clipX != c || this.clipW != f) e = !0;
            e && (this.clipAndUpdate(c, d, f, b), a && (this.updateOnReleaseOnly || this.dispatchScrollbarEvent()))
        }
    },
    maskGraphs: function() {},
    clipAndUpdate: function(a, b, c, d) {
        this.clipX = a;
        this.clipY = b;
        this.clipW = c;
        this.clipH = d;
        this.selectedBG.clipRect(a, b, c, d);
        this.updateDragIconPositions();
        this.maskGraphs(a, b, c, d)
    },
    dispatchScrollbarEvent: function() {
        if (this.skipEvent) this.skipEvent = !1;
        else {
            var a = this.chart;
            a.hideBalloon();
            var b = this.getDBox(),
                c = b.x,
                d = b.y,
                f = b.width,
                b = b.height;
            this.rotate ? (c = d, f = this.height / b) : f = this.width / f;
            a = {
                type: "zoomed",
                position: c,
                chart: a,
                target: this,
                multiplier: f
            };
            this.fire(a.type, a)
        }
    },
    updateDragIconPositions: function() {
        var a = this.getDBox(),
            b = a.x,
            c = a.y,
            d = this.iconLeft,
            f = this.iconRight,
            e, g, h = this.scrollbarHeight;
        this.rotate ? (e = this.dragIconWidth, g = this.dragIconHeight, d.translate((h - g) / 2, c - e / 2), f.translate((h - g) / 2, c + a.height - e / 2)) : (e = this.dragIconHeight, g = this.dragIconWidth, d.translate(b - g / 2, (h - e) / 2), f.translate(b + -g / 2 + a.width, (h - e) / 2))
    },
    showDragIcons: function() {
        this.resizeEnabled && (this.iconLeft.show(), this.iconRight.show())
    },
    hideDragIcons: function() {
        this.resizingLeft || this.resizingRight || this.dragging || (this.hideResizeGrips && (this.iconLeft.hide(), this.iconRight.hide()), this.removeCursors())
    },
    removeCursors: function() {
        this.chart.setMouseCursor("auto")
    },
    relativeZoom: function(a, b) {
        this.dragger.stop();
        this.multiplier = a;
        this.position = b;
        this.updateScrollbarSize(b, this.rotate ? b + this.height / a : b + this.width / a)
    },
    destroy: function() {
        this.clear();
        AmCharts.remove(this.set)
    },
    clear: function() {
        clearInterval(this.interval)
    },
    handleDragStart: function() {
        var a = this.chart;
        this.dragger.stop();
        this.removeCursors();
        this.dragging = !0;
        var b = this.getDBox();
        this.rotate ? (this.initialCoord = b.y, this.initialMouse = a.mouseY) : (this.initialCoord = b.x, this.initialMouse = a.mouseX)
    },
    handleDragStop: function() {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent());
        this.dragging = !1;
        this.mouseIsOver && this.removeCursors();
        this.updateScrollbar()
    },
    handleDraggerOver: function() {
        this.handleMouseOver()
    },
    leftDragStart: function() {
        this.dragger.stop();
        this.resizingLeft = !0
    },
    leftDragStop: function() {
        this.resizingLeft = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    rightDragStart: function() {
        this.dragger.stop();
        this.resizingRight = !0
    },
    rightDragStop: function() {
        this.resizingRight = !1;
        this.mouseIsOver || this.removeCursors();
        this.updateOnRelease()
    },
    iconRollOut: function() {
        this.removeCursors()
    },
    iconRollOver: function() {
        this.rotate ? this.chart.setMouseCursor("n-resize") : this.chart.setMouseCursor("e-resize");
        this.handleMouseOver()
    },
    getDBox: function() {
        if (this.dragger) return this.dragger.getBBox()
    },
    handleBgClick: function() {
        if (!this.resizingRight && !this.resizingLeft) {
            this.zooming = !0;
            var a, b, c = this.scrollDuration,
                d = this.dragger;
            a = this.getDBox();
            var f = a.height,
                e = a.width;
            b = this.chart;
            var g = this.y,
                h = this.x,
                k = this.rotate;
            k ? (a = "y", b = b.mouseY - f / 2 - g, b = AmCharts.fitToBounds(b, 0, this.height - f)) : (a = "x", b = b.mouseX - e / 2 - h, b = AmCharts.fitToBounds(b, 0, this.width - e));
            this.updateOnReleaseOnly ? (this.skipEvent = !1, d.setAttr(a, b), this.dispatchScrollbarEvent(), this.clipDragger()) : (b = Math.round(b), k ? d.animate({
                y: b
            }, c, ">") : d.animate({
                x: b
            }, c, ">"))
        }
    },
    updateOnRelease: function() {
        this.updateOnReleaseOnly && (this.updateScrollbar(), this.skipEvent = !1, this.dispatchScrollbarEvent())
    },
    handleReleaseOutside: function() {
        if (this.set) {
            if (this.resizingLeft || this.resizingRight || this.dragging) this.updateOnRelease(), this.removeCursors();
            this.mouseIsOver = this.dragging = this.resizingRight = this.resizingLeft = !1;
            this.hideDragIcons();
            this.updateScrollbar()
        }
    },
    handleMouseOver: function() {
        this.mouseIsOver = !0;
        this.showDragIcons()
    },
    handleMouseOut: function() {
        this.mouseIsOver = !1;
        this.hideDragIcons()
    }
});
AmCharts.ChartScrollbar = AmCharts.Class({
    inherits: AmCharts.SimpleChartScrollbar,
    construct: function(a) {
        AmCharts.ChartScrollbar.base.construct.call(this, a);
        this.graphLineColor = "#BBBBBB";
        this.graphLineAlpha = 0;
        this.graphFillColor = "#BBBBBB";
        this.graphFillAlpha = 1;
        this.selectedGraphLineColor = "#888888";
        this.selectedGraphLineAlpha = 0;
        this.selectedGraphFillColor = "#888888";
        this.selectedGraphFillAlpha = 1;
        this.gridCount = 0;
        this.gridColor = "#FFFFFF";
        this.gridAlpha = 0.7;
        this.skipEvent = this.autoGridCount = !1;
        this.color = "#FFFFFF";
        this.scrollbarCreated = !1;
        AmCharts.applyTheme(this, a, "ChartScrollbar")
    },
    init: function() {
        var a = this.categoryAxis,
            b = this.chart;
        a || (this.categoryAxis = a = new AmCharts.CategoryAxis);
        a.chart = b;
        a.id = "scrollbar";
        a.dateFormats = b.categoryAxis.dateFormats;
        a.boldPeriodBeginning = b.categoryAxis.boldPeriodBeginning;
        a.axisItemRenderer = AmCharts.RecItem;
        a.axisRenderer = AmCharts.RecAxis;
        a.guideFillRenderer = AmCharts.RecFill;
        a.inside = !0;
        a.fontSize = this.fontSize;
        a.tickLength = 0;
        a.axisAlpha = 0;
        AmCharts.isString(this.graph) && (this.graph = AmCharts.getObjById(b.graphs, this.graph));
        if (a = this.graph) {
            var c = this.valueAxis;
            c || (this.valueAxis = c = new AmCharts.ValueAxis, c.visible = !1, c.scrollbar = !0, c.axisItemRenderer = AmCharts.RecItem, c.axisRenderer = AmCharts.RecAxis, c.guideFillRenderer = AmCharts.RecFill, c.labelsEnabled = !1, c.chart = b);
            b = this.unselectedGraph;
            b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.unselectedGraph = b, b.negativeBase = a.negativeBase, b.noStepRisers = a.noStepRisers);
            b = this.selectedGraph;
            b || (b = new AmCharts.AmGraph, b.scrollbar = !0, this.selectedGraph = b, b.negativeBase = a.negativeBase, b.noStepRisers = a.noStepRisers)
        }
        this.scrollbarCreated = !0
    },
    draw: function() {
        var a = this;
        AmCharts.ChartScrollbar.base.draw.call(a);
        a.scrollbarCreated || a.init();
        var b = a.chart,
            c = b.chartData,
            d = a.categoryAxis,
            f = a.rotate,
            e = a.x,
            g = a.y,
            h = a.width,
            k = a.height,
            l = b.categoryAxis,
            m = a.set;
        d.setOrientation(!f);
        d.parseDates = l.parseDates;
        d.rotate = f;
        d.equalSpacing = l.equalSpacing;
        d.minPeriod = l.minPeriod;
        d.startOnAxis = l.startOnAxis;
        d.viW = h;
        d.viH = k;
        d.width = h;
        d.height = k;
        d.gridCount = a.gridCount;
        d.gridColor = a.gridColor;
        d.gridAlpha = a.gridAlpha;
        d.color = a.color;
        d.tickLength = 0;
        d.axisAlpha = 0;
        d.autoGridCount = a.autoGridCount;
        d.parseDates && !d.equalSpacing && d.timeZoom(b.firstTime, b.lastTime);
        d.zoom(0, c.length - 1);
        if (l = a.graph) {
            var n = a.valueAxis,
                p = l.valueAxis;
            n.id = p.id;
            n.rotate = f;
            n.setOrientation(f);
            n.width = h;
            n.height = k;
            n.viW = h;
            n.viH = k;
            n.dataProvider = c;
            n.reversed = p.reversed;
            n.logarithmic = p.logarithmic;
            n.gridAlpha = 0;
            n.axisAlpha = 0;
            m.push(n.set);
            f ? (n.y = g, n.x = 0) : (n.x = e, n.y = 0);
            var e = Infinity,
                g = -Infinity,
                q;
            for (q = 0; q < c.length; q++) {
                var t = c[q].axes[p.id].graphs[l.id].values,
                    r;
                for (r in t) if (t.hasOwnProperty(r) && "percents" != r && "total" != r) {
                    var s = t[r];
                    s < e && (e = s);
                    s > g && (g = s)
                }
            }
            Infinity != e && (n.minimum = e); - Infinity != g && (n.maximum = g + 0.1 * (g - e));
            e == g && (n.minimum -= 1, n.maximum += 1);
            void 0 !== a.minimum && (n.minimum = a.minimum);
            void 0 !== a.maximum && (n.maximum = a.maximum);
            n.zoom(0, c.length - 1);
            r = a.unselectedGraph;
            r.id = l.id;
            r.rotate = f;
            r.chart = b;
            r.chartType = b.chartType;
            r.data = c;
            r.valueAxis = n;
            r.chart = l.chart;
            r.categoryAxis = a.categoryAxis;
            r.periodSpan = l.periodSpan;
            r.valueField = l.valueField;
            r.openField = l.openField;
            r.closeField = l.closeField;
            r.highField = l.highField;
            r.lowField = l.lowField;
            r.lineAlpha = a.graphLineAlpha;
            r.lineColor = a.graphLineColor;
            r.fillAlphas = a.graphFillAlpha;
            r.fillColors = a.graphFillColor;
            r.connect = l.connect;
            r.hidden = l.hidden;
            r.width = h;
            r.height = k;
            p = a.selectedGraph;
            p.id = l.id;
            p.rotate = f;
            p.chart = b;
            p.chartType = b.chartType;
            p.data = c;
            p.valueAxis = n;
            p.chart = l.chart;
            p.categoryAxis = d;
            p.periodSpan = l.periodSpan;
            p.valueField = l.valueField;
            p.openField = l.openField;
            p.closeField = l.closeField;
            p.highField = l.highField;
            p.lowField = l.lowField;
            p.lineAlpha = a.selectedGraphLineAlpha;
            p.lineColor = a.selectedGraphLineColor;
            p.fillAlphas = a.selectedGraphFillAlpha;
            p.fillColors = a.selectedGraphFillColor;
            p.connect = l.connect;
            p.hidden = l.hidden;
            p.width = h;
            p.height = k;
            b = a.graphType;
            b || (b = l.type);
            r.type = b;
            p.type = b;
            c = c.length - 1;
            r.zoom(0, c);
            p.zoom(0, c);
            p.set.click(function() {
                a.handleBackgroundClick()
            }).mouseover(function() {
                    a.handleMouseOver()
                }).mouseout(function() {
                    a.handleMouseOut()
                });
            r.set.click(function() {
                a.handleBackgroundClick()
            }).mouseover(function() {
                    a.handleMouseOver()
                }).mouseout(function() {
                    a.handleMouseOut()
                });
            m.push(r.set);
            m.push(p.set)
        }
        m.push(d.set);
        m.push(d.labelsSet);
        a.bg.toBack();
        a.invisibleBg.toFront();
        a.dragger.toFront();
        a.iconLeft.toFront();
        a.iconRight.toFront()
    },
    timeZoom: function(a, b) {
        this.startTime = a;
        this.endTime = b;
        this.timeDifference = b - a;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    zoom: function(a, b) {
        this.start = a;
        this.end = b;
        this.skipEvent = !0;
        this.zoomScrollbar()
    },
    dispatchScrollbarEvent: function() {
        if (this.skipEvent) this.skipEvent = !1;
        else {
            var a = this.chart.chartData,
                b, c, d = this.dragger.getBBox();
            b = d.x;
            c = d.y;
            var f = d.width,
                e = d.height,
                d = this.chart;
            this.rotate ? (b = c, c = e) : c = f;
            f = {
                type: "zoomed",
                target: this
            };
            f.chart = d;
            var e = this.categoryAxis,
                g = this.stepWidth;
            if (e.parseDates && !e.equalSpacing) {
                if (a = d.firstTime, e.minDuration(), d = Math.round(b / g) + a, a = this.dragging ? d + this.timeDifference : Math.round((b + c) / g) + a, d > a && (d = a), d != this.startTime || a != this.endTime) this.startTime = d, this.endTime = a, f.start = d, f.end = a, f.startDate = new Date(d), f.endDate = new Date(a), this.fire(f.type, f)
            } else if (e.startOnAxis || (b += g / 2), c -= this.stepWidth / 2, d = e.xToIndex(b), b = e.xToIndex(b + c), d != this.start || this.end != b) e.startOnAxis && (this.resizingRight && d == b && b++, this.resizingLeft && d == b && (0 < d ? d-- : b = 1)), this.start = d, this.end = this.dragging ? this.start + this.difference : b, f.start = this.start, f.end = this.end, e.parseDates && (a[this.start] && (f.startDate = new Date(a[this.start].time)), a[this.end] && (f.endDate = new Date(a[this.end].time))), this.fire(f.type, f)
        }
    },
    zoomScrollbar: function() {
        var a, b;
        a = this.chart;
        var c = a.chartData,
            d = this.categoryAxis;
        d.parseDates && !d.equalSpacing ? (c = d.stepWidth, d = a.firstTime, a = c * (this.startTime - d), b = c * (this.endTime - d)) : (a = c[this.start].x[d.id], b = c[this.end].x[d.id], c = d.stepWidth, d.startOnAxis || (d = c / 2, a -= d, b += d));
        this.stepWidth = c;
        this.updateScrollbarSize(a, b)
    },
    maskGraphs: function(a, b, c, d) {
        var f = this.selectedGraph;
        f && f.set.clipRect(a, b, c, d)
    },
    handleDragStart: function() {
        AmCharts.ChartScrollbar.base.handleDragStart.call(this);
        this.difference = this.end - this.start;
        this.timeDifference = this.endTime - this.startTime;
        0 > this.timeDifference && (this.timeDifference = 0)
    },
    handleBackgroundClick: function() {
        AmCharts.ChartScrollbar.base.handleBackgroundClick.call(this);
        this.dragging || (this.difference = this.end - this.start, this.timeDifference = this.endTime - this.startTime, 0 > this.timeDifference && (this.timeDifference = 0))
    }
});
AmCharts.AmBalloon = AmCharts.Class({
    construct: function(a) {
        this.enabled = !0;
        this.fillColor = "#FFFFFF";
        this.fillAlpha = 0.8;
        this.borderThickness = 2;
        this.borderColor = "#FFFFFF";
        this.borderAlpha = 1;
        this.cornerRadius = 0;
        this.maximumWidth = 220;
        this.horizontalPadding = 8;
        this.verticalPadding = 4;
        this.pointerWidth = 6;
        this.pointerOrientation = "V";
        this.color = "#000000";
        this.adjustBorderColor = !0;
        this.show = this.follow = this.showBullet = !1;
        this.bulletSize = 3;
        this.shadowAlpha = 0.4;
        this.shadowColor = "#000000";
        this.fadeOutDuration = this.animationDuration = 0.3;
        this.fixedPosition = !1;
        this.offsetY = 6;
        this.offsetX = 1;
        AmCharts.isModern || (this.offsetY *= 1.5);
        AmCharts.applyTheme(this, a, "AmBalloon")
    },
    draw: function() {
        var a = this.pointToX,
            b = this.pointToY;
        this.deltaSignX = this.deltaSignY = 1;
        var c = this.chart;
        AmCharts.VML && (this.fadeOutDuration = 0);
        this.xAnim && c.stopAnim(this.xAnim);
        this.yAnim && c.stopAnim(this.yAnim);
        if (!isNaN(a)) {
            var d = this.follow,
                f = c.container,
                e = this.set;
            AmCharts.remove(e);
            this.removeDiv();
            this.set = e = f.set();
            c.balloonsSet.push(e);
            if (this.show) {
                var g = this.l,
                    h = this.t,
                    k = this.r,
                    l = this.b,
                    m = this.balloonColor,
                    n = this.fillColor,
                    p = this.borderColor,
                    q = n;
                void 0 != m && (this.adjustBorderColor ? q = p = m : n = m);
                var t = this.horizontalPadding,
                    r = this.verticalPadding,
                    s = this.pointerWidth,
                    w = this.pointerOrientation,
                    v = this.cornerRadius,
                    u = c.fontFamily,
                    A = this.fontSize;
                void 0 == A && (A = c.fontSize);
                var m = document.createElement("div"),
                    F = m.style;
                F.position = "absolute";
                m.innerHTML = '<div style="max-width:' + this.maxWidth + "px; font-size:" + A + "px; color:" + this.color + "; font-family:" + u + '">' + this.text + "</div>";
                c.chartDiv.appendChild(m);
                this.textDiv = m;
                A = m.offsetWidth;
                u = m.offsetHeight;
                m.clientHeight && (A = m.clientWidth, u = m.clientHeight);
                var u = u + 2 * r,
                    y = A + 2 * t;
                window.opera && (u += 2);
                var z, H = !1;
                z = this.offsetY;
                c.handDrawn && (z += c.handDrawScatter + 2);
                "H" != w ? (A = a - y / 2, b < h + u + 10 && "down" != w ? (H = !0, d && (b += z), z = b + s, this.deltaSignY = -1) : (d && (b -= z), z = b - u - s, this.deltaSignY = 1)) : (2 * s > u && (s = u / 2), z = b - u / 2, a < g + (k - g) / 2 ? (A = a + s, this.deltaSignX = -1) : (A = a - y - s, this.deltaSignX = 1));
                z + u >= l && (z = l - u);
                z < h && (z = h);
                A < g && (A = g);
                A + y > k && (A = k - y);
                var h = z + r,
                    l = A + t,
                    r = this.shadowAlpha,
                    I = this.shadowColor,
                    t = this.borderThickness,
                    B = this.bulletSize,
                    W;
                0 < v || 0 === s ? (0 < r && (a = AmCharts.rect(f, y, u, n, 0, t + 1, I, r, this.cornerRadius), AmCharts.isModern ? a.translate(1, 1) : a.translate(4, 4), e.push(a)), n = AmCharts.rect(f, y, u, n, this.fillAlpha, t, p, this.borderAlpha, this.cornerRadius), this.showBullet && (W = AmCharts.circle(f, B, q, this.fillAlpha), e.push(W))) : (q = [], v = [], "H" != w ? (g = a - A, g > y - s && (g = y - s), g < s && (g = s), q = [0, g - s, a - A, g + s, y, y, 0, 0], v = H ? [0, 0, b - z, 0, 0, u, u, 0] : [u, u, b - z, u, u, 0, 0, u]) : (q = b - z, q > u - s && (q = u - s), q < s && (q = s), v = [0, q - s, b - z, q + s, u, u, 0, 0], q = a < g + (k - g) / 2 ? [0, 0, A < a ? 0 : a - A, 0, 0, y, y, 0] : [y, y, A + y > a ? y : a - A, y, y, 0, 0, y]), 0 < r && (a = AmCharts.polygon(f, q, v, n, 0, t, I, r), a.translate(1, 1), e.push(a)), n = AmCharts.polygon(f, q, v, n, this.fillAlpha, t, p, this.borderAlpha));
                this.bg = n;
                e.push(n);
                n.toFront();
                f = 1 * this.deltaSignX;
                F.left = l + "px";
                F.top = h + "px";
                e.translate(A - f, z);
                n = n.getBBox();
                this.bottom = z + u + 1;
                this.yPos = n.y + z;
                W && W.translate(this.pointToX - A + f, b - z);
                b = this.animationDuration;
                0 < this.animationDuration && !d && !isNaN(this.prevX) && (e.translate(this.prevX, this.prevY), e.animate({
                    translate: A - f + "," + z
                }, b, "easeOutSine"), m && (F.left = this.prevTX + "px", F.top = this.prevTY + "px", this.xAnim = c.animate({
                    node: m
                }, "left", this.prevTX, l, b, "easeOutSine", "px"), this.yAnim = c.animate({
                    node: m
                }, "top", this.prevTY, h, b, "easeOutSine", "px")));
                this.prevX = A - f;
                this.prevY = z;
                this.prevTX = l;
                this.prevTY = h
            }
        }
    },
    followMouse: function() {
        if (this.follow && this.show) {
            var a = this.chart.mouseX - this.offsetX * this.deltaSignX,
                b = this.chart.mouseY;
            this.pointToX = a;
            this.pointToY = b;
            if (a != this.previousX || b != this.previousY) if (this.previousX = a, this.previousY = b, 0 === this.cornerRadius) this.draw();
            else {
                var c = this.set;
                if (c) {
                    var d = c.getBBox(),
                        a = a - d.width / 2,
                        f = b - d.height - 10;
                    a < this.l && (a = this.l);
                    a > this.r - d.width && (a = this.r - d.width);
                    f < this.t && (f = b + 10);
                    c.translate(a, f);
                    b = this.textDiv.style;
                    b.left = a + this.horizontalPadding + "px";
                    b.top = f + this.verticalPadding + "px"
                }
            }
        }
    },
    changeColor: function(a) {
        this.balloonColor = a
    },
    setBounds: function(a, b, c, d) {
        this.l = a;
        this.t = b;
        this.r = c;
        this.b = d;
        this.destroyTO && clearTimeout(this.destroyTO)
    },
    showBalloon: function(a) {
        this.text = a;
        this.show = !0;
        this.destroyTO && clearTimeout(this.destroyTO);
        a = this.chart;
        this.fadeAnim1 && a.stopAnim(this.fadeAnim1);
        this.fadeAnim2 && a.stopAnim(this.fadeAnim2);
        this.draw()
    },
    hide: function() {
        var a = this,
            b = a.fadeOutDuration,
            c = a.chart;
        if (0 < b) {
            a.destroyTO = setTimeout(function() {
                a.destroy.call(a)
            }, 1E3 * b);
            a.follow = !1;
            a.show = !1;
            var d = a.set;
            d && (d.setAttr("opacity", a.fillAlpha), a.fadeAnim1 = d.animate({
                opacity: 0
            }, b, "easeInSine"));
            a.textDiv && (a.fadeAnim2 = c.animate({
                node: a.textDiv
            }, "opacity", 1, 0, b, "easeInSine", ""))
        } else a.show = !1, a.follow = !1, a.destroy()
    },
    setPosition: function(a, b, c) {
        this.pointToX = a;
        this.pointToY = b;
        c && (a == this.previousX && b == this.previousY || this.draw());
        this.previousX = a;
        this.previousY = b
    },
    followCursor: function(a) {
        var b = this;
        (b.follow = a) ? (b.pShowBullet = b.showBullet, b.showBullet = !1) : void 0 !== b.pShowBullet && (b.showBullet = b.pShowBullet);
        clearInterval(b.interval);
        var c = b.chart.mouseX,
            d = b.chart.mouseY;
        !isNaN(c) && a && (b.pointToX = c - b.offsetX * b.deltaSignX, b.pointToY = d, b.followMouse(), b.interval = setInterval(function() {
            b.followMouse.call(b)
        }, 40))
    },
    removeDiv: function() {
        if (this.textDiv) {
            var a = this.textDiv.parentNode;
            a && a.removeChild(this.textDiv)
        }
    },
    destroy: function() {
        clearInterval(this.interval);
        AmCharts.remove(this.set);
        this.removeDiv();
        this.set = null
    }
});
AmCharts.AmCoordinateChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function(a) {
        AmCharts.AmCoordinateChart.base.construct.call(this, a);
        this.theme = a;
        this.createEvents("rollOverGraphItem", "rollOutGraphItem", "clickGraphItem", "doubleClickGraphItem", "rightClickGraphItem", "clickGraph");
        this.plotAreaFillColors = "#FFFFFF";
        this.plotAreaFillAlphas = 0;
        this.plotAreaBorderColor = "#000000";
        this.plotAreaBorderAlpha = 0;
        this.startAlpha = 1;
        this.startDuration = 0;
        this.startEffect = "elastic";
        this.sequencedAnimation = !0;
        this.colors = "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
        this.balloonDateFormat = "MMM DD, YYYY";
        this.valueAxes = [];
        this.graphs = [];
        this.gridAboveGraphs = !1;
        AmCharts.applyTheme(this, a, "AmCoordinateChart")
    },
    initChart: function() {
        AmCharts.AmCoordinateChart.base.initChart.call(this);
        var a = this.categoryAxis;
        a && (this.categoryAxis = AmCharts.processObject(a, AmCharts.CategoryAxis, this.theme));
        this.processValueAxes();
        this.createValueAxes();
        this.processGraphs();
        AmCharts.VML && (this.startAlpha = 1);
        this.setLegendData(this.graphs);
        this.gridAboveGraphs && this.gridSet.toFront()
    },
    createValueAxes: function() {
        if (0 === this.valueAxes.length) {
            var a = new AmCharts.ValueAxis;
            this.addValueAxis(a)
        }
    },
    parseData: function() {
        this.processValueAxes();
        this.processGraphs()
    },
    parseSerialData: function() {
        var a = this.graphs,
            b, c = {},
            d = this.seriesIdField;
        d || (d = this.categoryField);
        this.chartData = [];
        var f = this.dataProvider;
        if (f) {
            var e = !1,
                g, h = this.categoryAxis,
                k;
            h && (e = h.parseDates, k = h.forceShowField, g = h.categoryFunction);
            var l, m;
            e && (b = AmCharts.extractPeriod(h.minPeriod), l = b.period, m = b.count);
            var n = {};
            this.lookupTable = n;
            var p, q = this.dataDateFormat;
            for (p = 0; p < f.length; p++) {
                var t = {},
                    r = f[p];
                b = r[this.categoryField];
                t.category = g ? g(b, r, h) : String(b);
                k && (t.forceShow = r[k]);
                n[r[d]] = t;
                e && (b = h.categoryFunction ? h.categoryFunction(b, r, h) : b instanceof Date ? "fff" == h.minPeriod ? AmCharts.useUTC ? new Date(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate(), b.getUTCHours(), b.getUTCMinutes(), b.getUTCSeconds(), b.getUTCMilliseconds()) : new Date(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds(), b.getMilliseconds()) : new Date(b) : q ? AmCharts.stringToDate(b, q) : new Date(b), b = AmCharts.resetDateToMin(b, l, m, h.firstDayOfWeek), t.category = b, t.time = b.getTime());
                var s = this.valueAxes;
                t.axes = {};
                t.x = {};
                var w;
                for (w = 0; w < s.length; w++) {
                    var v = s[w].id;
                    t.axes[v] = {};
                    t.axes[v].graphs = {};
                    var u;
                    for (u = 0; u < a.length; u++) {
                        b = a[u];
                        var A = b.id,
                            F = b.periodValue;
                        if (b.valueAxis.id == v) {
                            t.axes[v].graphs[A] = {};
                            var y = {};
                            y.index = p;
                            var z = r;
                            b.dataProvider && (z = c);
                            y.values = this.processValues(z, b, F);
                            this.processFields(b, y, z);
                            y.category = t.category;
                            y.serialDataItem = t;
                            y.graph = b;
                            t.axes[v].graphs[A] = y
                        }
                    }
                }
                this.chartData[p] = t
            }
        }
        for (c = 0; c < a.length; c++) b = a[c], b.dataProvider && this.parseGraphData(b)
    },
    processValues: function(a, b, c) {
        var d = {},
            f, e = !1;
        "candlestick" != b.type && "ohlc" != b.type || "" === c || (e = !0);
        f = Number(a[b.valueField + c]);
        isNaN(f) || (d.value = f);
        f = Number(a[b.errorField + c]);
        isNaN(f) || (d.error = f);
        e && (c = "Open");
        f = Number(a[b.openField + c]);
        isNaN(f) || (d.open = f);
        e && (c = "Close");
        f = Number(a[b.closeField + c]);
        isNaN(f) || (d.close = f);
        e && (c = "Low");
        f = Number(a[b.lowField + c]);
        isNaN(f) || (d.low = f);
        e && (c = "High");
        f = Number(a[b.highField + c]);
        isNaN(f) || (d.high = f);
        return d
    },
    parseGraphData: function(a) {
        var b = a.dataProvider,
            c = a.seriesIdField;
        c || (c = this.seriesIdField);
        c || (c = this.categoryField);
        var d;
        for (d = 0; d < b.length; d++) {
            var f = b[d],
                e = this.lookupTable[String(f[c])],
                g = a.valueAxis.id;
            e && (g = e.axes[g].graphs[a.id], g.serialDataItem = e, g.values = this.processValues(f, a, a.periodValue), this.processFields(a, g, f))
        }
    },
    addValueAxis: function(a) {
        a.chart = this;
        this.valueAxes.push(a);
        this.validateData()
    },
    removeValueAxesAndGraphs: function() {
        var a = this.valueAxes,
            b;
        for (b = a.length - 1; - 1 < b; b--) this.removeValueAxis(a[b])
    },
    removeValueAxis: function(a) {
        var b = this.graphs,
            c;
        for (c = b.length - 1; 0 <= c; c--) {
            var d = b[c];
            d && d.valueAxis == a && this.removeGraph(d)
        }
        b = this.valueAxes;
        for (c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1);
        this.validateData()
    },
    addGraph: function(a) {
        this.graphs.push(a);
        this.chooseGraphColor(a, this.graphs.length - 1);
        this.validateData()
    },
    removeGraph: function(a) {
        var b = this.graphs,
            c;
        for (c = b.length - 1; 0 <= c; c--) b[c] == a && (b.splice(c, 1), a.destroy());
        this.validateData()
    },
    processValueAxes: function() {
        var a = this.valueAxes,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b],
                c = AmCharts.processObject(c, AmCharts.ValueAxis, this.theme);
            a[b] = c;
            c.chart = this;
            c.id || (c.id = "valueAxis" + b + "_" + (new Date).getTime());
            if (!0 === this.usePrefixes || !1 === this.usePrefixes) c.usePrefixes = this.usePrefixes
        }
    },
    processGraphs: function() {
        var a = this.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b],
                c = AmCharts.processObject(c, AmCharts.AmGraph, this.theme);
            a[b] = c;
            this.chooseGraphColor(c, b);
            c.chart = this;
            AmCharts.isString(c.valueAxis) && (c.valueAxis = this.getValueAxisById(c.valueAxis));
            c.valueAxis || (c.valueAxis = this.valueAxes[0]);
            c.id || (c.id = "graph" + b + "_" + (new Date).getTime())
        }
    },
    formatString: function(a, b) {
        var c = b.graph,
            d = c.valueAxis;
        d.duration && b.values.value && (d = AmCharts.formatDuration(b.values.value, d.duration, "", d.durationUnits, d.maxInterval, d.numberFormatter), a = a.split("[[value]]").join(d));
        a = AmCharts.massReplace(a, {
            "[[title]]": c.title,
            "[[description]]": b.description
        });
        a = AmCharts.fixBrakes(a);
        return a = AmCharts.cleanFromEmpty(a)
    },
    getBalloonColor: function(a, b, c) {
        var d = a.lineColor,
            f = a.balloonColor;
        c && (f = d);
        c = a.fillColors;
        "object" == typeof c ? d = c[0] : void 0 !== c && (d = c);
        b.isNegative && (c = a.negativeLineColor, a = a.negativeFillColors, "object" == typeof a ? c = a[0] : void 0 !== a && (c = a), void 0 !== c && (d = c));
        void 0 !== b.color && (d = b.color);
        void 0 === f && (f = d);
        return f
    },
    getGraphById: function(a) {
        return AmCharts.getObjById(this.graphs, a)
    },
    getValueAxisById: function(a) {
        return AmCharts.getObjById(this.valueAxes, a)
    },
    processFields: function(a, b, c) {
        if (a.itemColors) {
            var d = a.itemColors,
                f = b.index;
            b.color = f < d.length ? d[f] : AmCharts.randomColor()
        }
        d = "lineColor color alpha fillColors description bullet customBullet bulletSize bulletConfig url labelColor dashLength pattern".split(" ");
        for (f = 0; f < d.length; f++) {
            var e = d[f],
                g = a[e + "Field"];
            g && (g = c[g], AmCharts.isDefined(g) && (b[e] = g))
        }
        b.dataContext = c
    },
    chooseGraphColor: function(a, b) {
        if (!a.lineColor) {
            var c;
            c = this.colors.length > b ? this.colors[b] : AmCharts.randomColor();
            a.lineColor = c
        }
        if (c = this.patterns) a.pattern = c[b]
    },
    handleLegendEvent: function(a) {
        var b = a.type;
        a = a.dataItem;
        if (!this.legend.data && a) {
            var c = a.hidden,
                d = a.showBalloon;
            switch (b) {
                case "clickMarker":
                    d ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                    break;
                case "clickLabel":
                    d ? this.hideGraphsBalloon(a) : this.showGraphsBalloon(a);
                    break;
                case "rollOverItem":
                    c || this.highlightGraph(a);
                    break;
                case "rollOutItem":
                    c || this.unhighlightGraph();
                    break;
                case "hideItem":
                    this.hideGraph(a);
                    break;
                case "showItem":
                    this.showGraph(a)
            }
        }
    },
    highlightGraph: function(a) {
        var b = this.graphs,
            c, d = 0.2;
        this.legend && (d = this.legend.rollOverGraphAlpha);
        if (1 != d) for (c = 0; c < b.length; c++) {
            var f = b[c];
            f != a && f.changeOpacity(d)
        }
    },
    unhighlightGraph: function() {
        var a;
        this.legend && (a = this.legend.rollOverGraphAlpha);
        if (1 != a) {
            a = this.graphs;
            var b;
            for (b = 0; b < a.length; b++) a[b].changeOpacity(1)
        }
    },
    showGraph: function(a) {
        a.hidden = !1;
        this.dataChanged = !0;
        this.marginsUpdated = !1;
        this.chartCreated && this.initChart()
    },
    hideGraph: function(a) {
        this.dataChanged = !0;
        this.marginsUpdated = !1;
        a.hidden = !0;
        this.chartCreated && this.initChart()
    },
    hideGraphsBalloon: function(a) {
        a.showBalloon = !1;
        this.updateLegend()
    },
    showGraphsBalloon: function(a) {
        a.showBalloon = !0;
        this.updateLegend()
    },
    updateLegend: function() {
        this.legend && this.legend.invalidateSize()
    },
    resetAnimation: function() {
        var a = this.graphs;
        if (a) {
            var b;
            for (b = 0; b < a.length; b++) a[b].animationPlayed = !1
        }
    },
    animateAgain: function() {
        this.resetAnimation();
        this.validateNow()
    }
});
AmCharts.AmSlicedChart = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function(a) {
        this.createEvents("rollOverSlice", "rollOutSlice", "clickSlice", "pullOutSlice", "pullInSlice", "rightClickSlice");
        AmCharts.AmSlicedChart.base.construct.call(this, a);
        this.colors = "#FF0F00 #FF6600 #FF9E01 #FCD202 #F8FF01 #B0DE09 #04D215 #0D8ECF #0D52D1 #2A0CD0 #8A0CCF #CD0D74 #754DEB #DDDDDD #999999 #333333 #000000 #57032A #CA9726 #990000 #4B0C25".split(" ");
        this.alpha = 1;
        this.groupPercent = 0;
        this.groupedTitle = "Other";
        this.groupedPulled = !1;
        this.groupedAlpha = 1;
        this.marginLeft = 0;
        this.marginBottom = this.marginTop = 10;
        this.marginRight = 0;
        this.hoverAlpha = 1;
        this.outlineColor = "#FFFFFF";
        this.outlineAlpha = 0;
        this.outlineThickness = 1;
        this.startAlpha = 0;
        this.startDuration = 1;
        this.startEffect = "bounce";
        this.sequencedAnimation = !0;
        this.pullOutDuration = 1;
        this.pullOutEffect = "bounce";
        this.pullOnHover = this.pullOutOnlyOne = !1;
        this.labelsEnabled = !0;
        this.labelTickColor = "#000000";
        this.labelTickAlpha = 0.2;
        this.hideLabelsPercent = 0;
        this.urlTarget = "_self";
        this.autoMarginOffset = 10;
        this.gradientRatio = [];
        AmCharts.applyTheme(this, a, "AmSlicedChart")
    },
    initChart: function() {
        AmCharts.AmSlicedChart.base.initChart.call(this);
        this.dataChanged && (this.parseData(), this.dispatchDataUpdated = !0, this.dataChanged = !1, this.setLegendData(this.chartData));
        this.drawChart()
    },
    handleLegendEvent: function(a) {
        var b = a.type;
        a = a.dataItem;
        if (!this.legend.data && a) {
            var c = a.hidden;
            switch (b) {
                case "clickMarker":
                    c || this.clickSlice(a);
                    break;
                case "clickLabel":
                    c || this.clickSlice(a);
                    break;
                case "rollOverItem":
                    c || this.rollOverSlice(a, !1);
                    break;
                case "rollOutItem":
                    c || this.rollOutSlice(a);
                    break;
                case "hideItem":
                    this.hideSlice(a);
                    break;
                case "showItem":
                    this.showSlice(a)
            }
        }
    },
    invalidateVisibility: function() {
        this.recalculatePercents();
        this.initChart();
        var a = this.legend;
        a && a.invalidateSize()
    },
    addEventListeners: function(a, b) {
        var c = this;
        a.mouseover(function(a) {
            c.rollOverSlice(b, !0, a)
        }).mouseout(function(a) {
                c.rollOutSlice(b, a)
            }).touchend(function(a) {
                c.rollOverSlice(b, a);
                c.panEventsEnabled && c.clickSlice(b, a)
            }).touchstart(function(a) {
                c.rollOverSlice(b, a)
            }).click(function(a) {
                c.clickSlice(b, a)
            }).contextmenu(function(a) {
                c.handleRightClick(b, a)
            })
    },
    formatString: function(a, b) {
        a = AmCharts.formatValue(a, b, ["value"], this.numberFormatter, "", this.usePrefixes, this.prefixesOfSmallNumbers, this.prefixesOfBigNumbers);
        a = AmCharts.formatValue(a, b, ["percents"], this.percentFormatter);
        a = AmCharts.massReplace(a, {
            "[[title]]": b.title,
            "[[description]]": b.description
        }); - 1 != a.indexOf("[[") && (a = AmCharts.formatDataContextValue(a, b.dataContext));
        a = AmCharts.fixBrakes(a);
        return a = AmCharts.cleanFromEmpty(a)
    },
    startSlices: function() {
        var a;
        for (a = 0; a < this.chartData.length; a++) 0 < this.startDuration && this.sequencedAnimation ? this.setStartTO(a) : this.startSlice(this.chartData[a])
    },
    setStartTO: function(a) {
        var b = this;
        a = setTimeout(function() {
            b.startSequenced.call(b)
        }, b.startDuration / b.chartData.length * 500 * a);
        b.timeOuts.push(a)
    },
    pullSlices: function(a) {
        var b = this.chartData,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            d.pulled && this.pullSlice(d, 1, a)
        }
    },
    startSequenced: function() {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) if (!a[b].started) {
            this.startSlice(this.chartData[b]);
            break
        }
    },
    startSlice: function(a) {
        a.started = !0;
        var b = a.wedge,
            c = this.startDuration;
        b && 0 < c && (0 < a.alpha && b.show(), b.translate(a.startX, a.startY), b.animate({
            opacity: 1,
            translate: "0,0"
        }, c, this.startEffect))
    },
    showLabels: function() {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            if (0 < c.alpha) {
                var d = c.label;
                d && d.show();
                (c = c.tick) && c.show()
            }
        }
    },
    showSlice: function(a) {
        isNaN(a) ? a.hidden = !1 : this.chartData[a].hidden = !1;
        this.invalidateVisibility()
    },
    hideSlice: function(a) {
        isNaN(a) ? a.hidden = !0 : this.chartData[a].hidden = !0;
        this.hideBalloon();
        this.invalidateVisibility()
    },
    rollOverSlice: function(a, b, c) {
        isNaN(a) || (a = this.chartData[a]);
        clearTimeout(this.hoverInt);
        this.pullOnHover && this.pullSlice(a, 1);
        1 > this.hoverAlpha && a.wedge && a.wedge.attr({
            opacity: this.hoverAlpha
        });
        var d = a.balloonX,
            f = a.balloonY;
        a.pulled && (d += a.pullX, f += a.pullY);
        var e = this.formatString(this.balloonText, a),
            g = AmCharts.adjustLuminosity(a.color, -0.15);
        this.showBalloon(e, g, b, d, f);
        a = {
            type: "rollOverSlice",
            dataItem: a,
            chart: this,
            event: c
        };
        this.fire(a.type, a)
    },
    rollOutSlice: function(a, b) {
        isNaN(a) || (a = this.chartData[a]);
        a.wedge && a.wedge.attr({
            opacity: 1
        });
        this.hideBalloon();
        var c = {
            type: "rollOutSlice",
            dataItem: a,
            chart: this,
            event: b
        };
        this.fire(c.type, c)
    },
    clickSlice: function(a, b) {
        isNaN(a) || (a = this.chartData[a]);
        a.pulled ? this.pullSlice(a, 0) : this.pullSlice(a, 1);
        AmCharts.getURL(a.url, this.urlTarget);
        var c = {
            type: "clickSlice",
            dataItem: a,
            chart: this,
            event: b
        };
        this.fire(c.type, c)
    },
    handleRightClick: function(a, b) {
        isNaN(a) || (a = this.chartData[a]);
        var c = {
            type: "rightClickSlice",
            dataItem: a,
            chart: this,
            event: b
        };
        this.fire(c.type, c)
    },
    drawTicks: function() {
        var a = this.chartData,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            if (c.label) {
                var d = c.ty,
                    d = AmCharts.line(this.container, [c.tx0, c.tx, c.tx2], [c.ty0, d, d], this.labelTickColor, this.labelTickAlpha);
                c.tick = d;
                c.wedge.push(d)
            }
        }
    },
    initialStart: function() {
        var a = this,
            b = a.startDuration,
            c = setTimeout(function() {
                a.showLabels.call(a)
            }, 1E3 * b);
        a.timeOuts.push(c);
        a.chartCreated ? a.pullSlices(!0) : (b = setTimeout(function() {
            a.pullSlices.call(a)
        }, 1200 * b), a.timeOuts.push(b), a.startSlices())
    },
    pullSlice: function(a, b, c) {
        var d = this.pullOutDuration;
        !0 === c && (d = 0);
        (c = a.wedge) && c.animate({
            translate: b * a.pullX + "," + b * a.pullY
        }, d, this.pullOutEffect);
        1 == b ? (a.pulled = !0, this.pullOutOnlyOne && this.pullInAll(a.index), a = {
            type: "pullOutSlice",
            dataItem: a,
            chart: this
        }) : (a.pulled = !1, a = {
            type: "pullInSlice",
            dataItem: a,
            chart: this
        });
        this.fire(a.type, a)
    },
    pullInAll: function(a) {
        var b = this.chartData,
            c;
        for (c = 0; c < this.chartData.length; c++) c != a && b[c].pulled && this.pullSlice(b[c], 0)
    },
    pullOutAll: function(a) {
        a = this.chartData;
        var b;
        for (b = 0; b < a.length; b++) a[b].pulled || this.pullSlice(a[b], 1)
    },
    parseData: function() {
        var a = [];
        this.chartData = a;
        var b = this.dataProvider;
        isNaN(this.pieAlpha) || (this.alpha = this.pieAlpha);
        if (void 0 !== b) {
            var c = b.length,
                d = 0,
                f, e, g;
            for (f = 0; f < c; f++) {
                e = {};
                var h = b[f];
                e.dataContext = h;
                e.value = Number(h[this.valueField]);
                (g = h[this.titleField]) || (g = "");
                e.title = g;
                e.pulled = AmCharts.toBoolean(h[this.pulledField], !1);
                (g = h[this.descriptionField]) || (g = "");
                e.description = g;
                e.labelRadius = Number(h[this.labelRadiusField]);
                e.url = h[this.urlField];
                g = h[this.patternField];
                !g && this.patterns && (g = this.patterns[f]);
                e.pattern = g;
                e.visibleInLegend = AmCharts.toBoolean(h[this.visibleInLegendField], !0);
                g = h[this.alphaField];
                e.alpha = void 0 !== g ? Number(g) : this.alpha;
                g = h[this.colorField];
                void 0 !== g && (e.color = AmCharts.toColor(g));
                e.labelColor = AmCharts.toColor(h[this.labelColorField]);
                d += e.value;
                e.hidden = !1;
                a[f] = e
            }
            for (f = b = 0; f < c; f++) e = a[f], e.percents = e.value / d * 100, e.percents < this.groupPercent && b++;
            1 < b && (this.groupValue = 0, this.removeSmallSlices(), a.push({
                title: this.groupedTitle,
                value: this.groupValue,
                percents: this.groupValue / d * 100,
                pulled: this.groupedPulled,
                color: this.groupedColor,
                url: this.groupedUrl,
                description: this.groupedDescription,
                alpha: this.groupedAlpha,
                pattern: this.groupedPattern
            }));
            c = this.baseColor;
            c || (c = this.pieBaseColor);
            d = this.brightnessStep;
            d || (d = this.pieBrightnessStep);
            for (f = 0; f < a.length; f++) c ? g = AmCharts.adjustLuminosity(c, f * d / 100) : (g = this.colors[f], void 0 === g && (g = AmCharts.randomColor())), void 0 === a[f].color && (a[f].color = g);
            this.recalculatePercents()
        }
    },
    recalculatePercents: function() {
        var a = this.chartData,
            b = 0,
            c, d;
        for (c = 0; c < a.length; c++) d = a[c], !d.hidden && 0 < d.value && (b += d.value);
        for (c = 0; c < a.length; c++) d = this.chartData[c], d.percents = !d.hidden && 0 < d.value ? 100 * d.value / b : 0
    },
    removeSmallSlices: function() {
        var a = this.chartData,
            b;
        for (b = a.length - 1; 0 <= b; b--) a[b].percents < this.groupPercent && (this.groupValue += a[b].value, a.splice(b, 1))
    },
    animateAgain: function() {
        var a = this;
        a.startSlices();
        var b = setTimeout(function() {
            a.pullSlices.call(a)
        }, 1200 * a.startDuration);
        a.timeOuts.push(b)
    },
    measureMaxLabel: function() {
        var a = this.chartData,
            b = 0,
            c;
        for (c = 0; c < a.length; c++) {
            var d = this.formatString(this.labelText, a[c]),
                d = AmCharts.text(this.container, d, this.color, this.fontFamily, this.fontSize),
                f = d.getBBox().width;
            f > b && (b = f);
            d.remove()
        }
        return b
    }
});
AmCharts.AmRectangularChart = AmCharts.Class({
    inherits: AmCharts.AmCoordinateChart,
    construct: function(a) {
        AmCharts.AmRectangularChart.base.construct.call(this, a);
        this.theme = a;
        this.createEvents("zoomed");
        this.marginRight = this.marginBottom = this.marginTop = this.marginLeft = 20;
        this.verticalPosition = this.horizontalPosition = this.depth3D = this.angle = 0;
        this.heightMultiplier = this.widthMultiplier = 1;
        this.zoomOutButtonImageSize = 17;
        this.zoomOutButtonImage = "lens.png";
        this.zoomOutText = "Show all";
        this.zoomOutButtonColor = "#e5e5e5";
        this.zoomOutButtonAlpha = 0;
        this.zoomOutButtonRollOverAlpha = 1;
        this.zoomOutButtonPadding = 8;
        this.trendLines = [];
        this.autoMargins = !0;
        this.marginsUpdated = !1;
        this.autoMarginOffset = 10;
        AmCharts.applyTheme(this, a, "AmRectangularChart")
    },
    initChart: function() {
        AmCharts.AmRectangularChart.base.initChart.call(this);
        this.updateDxy();
        var a = !0;
        !this.marginsUpdated && this.autoMargins && (this.resetMargins(), a = !1);
        this.processScrollbars();
        this.updateMargins();
        this.updatePlotArea();
        this.updateScrollbars();
        this.updateTrendLines();
        this.updateChartCursor();
        this.updateValueAxes();
        a && (this.scrollbarOnly || this.updateGraphs())
    },
    drawChart: function() {
        AmCharts.AmRectangularChart.base.drawChart.call(this);
        this.drawPlotArea();
        if (AmCharts.ifArray(this.chartData)) {
            var a = this.chartCursor;
            a && a.draw();
            a = this.zoomOutText;
            "" !== a && a && this.drawZoomOutButton()
        }
    },
    resetMargins: function() {
        var a = {},
            b;
        if ("serial" == this.chartType || "gantt" == this.chartType) {
            var c = this.valueAxes;
            for (b = 0; b < c.length; b++) {
                var d = c[b];
                d.ignoreAxisWidth || (d.setOrientation(this.rotate), d.fixAxisPosition(), a[d.position] = !0)
            }(b = this.categoryAxis) && !b.ignoreAxisWidth && (b.setOrientation(!this.rotate), b.fixAxisPosition(), b.fixAxisPosition(), a[b.position] = !0)
        } else {
            d = this.xAxes;
            c = this.yAxes;
            for (b = 0; b < d.length; b++) {
                var f = d[b];
                f.ignoreAxisWidth || (f.setOrientation(!0), f.fixAxisPosition(), a[f.position] = !0)
            }
            for (b = 0; b < c.length; b++) d = c[b], d.ignoreAxisWidth || (d.setOrientation(!1), d.fixAxisPosition(), a[d.position] = !0)
        }
        a.left && (this.marginLeft = 0);
        a.right && (this.marginRight = 0);
        a.top && (this.marginTop = 0);
        a.bottom && (this.marginBottom = 0);
        this.fixMargins = a
    },
    measureMargins: function() {
        var a = this.valueAxes,
            b, c = this.autoMarginOffset,
            d = this.fixMargins,
            f = this.realWidth,
            e = this.realHeight,
            g = c,
            h = c,
            k = f - c;
        b = e - c;
        var l;
        for (l = 0; l < a.length; l++) b = this.getAxisBounds(a[l], g, k, h, b), g = b.l, k = b.r, h = b.t, b = b.b;
        if (a = this.categoryAxis) b = this.getAxisBounds(a, g, k, h, b), g = b.l, k = b.r, h = b.t, b = b.b;
        d.left && g < c && (this.marginLeft = Math.round(-g + c));
        d.right && k > f - c && (this.marginRight = Math.round(k - f + c));
        d.top && h < c + this.titleHeight && (this.marginTop = Math.round(this.marginTop - h + c + this.titleHeight));
        d.bottom && b > e - c && (this.marginBottom = Math.round(b - e + c));
        this.initChart()
    },
    getAxisBounds: function(a, b, c, d, f) {
        if (!a.ignoreAxisWidth) {
            var e = a.labelsSet,
                g = a.tickLength;
            a.inside && (g = 0);
            if (e) switch (e = a.getBBox(), a.position) {
                case "top":
                    a = e.y;
                    d > a && (d = a);
                    break;
                case "bottom":
                    a = e.y + e.height;
                    f < a && (f = a);
                    break;
                case "right":
                    a = e.x + e.width + g + 3;
                    c < a && (c = a);
                    break;
                case "left":
                    a = e.x - g, b > a && (b = a)
            }
        }
        return {
            l: b,
            t: d,
            r: c,
            b: f
        }
    },
    drawZoomOutButton: function() {
        var a = this,
            b = a.container.set();
        a.zoomButtonSet.push(b);
        var c = a.color,
            d = a.fontSize,
            f = a.zoomOutButtonImageSize,
            e = a.zoomOutButtonImage,
            g = a.zoomOutText,
            h = a.zoomOutButtonColor,
            k = a.zoomOutButtonAlpha,
            l = a.zoomOutButtonFontSize,
            m = a.zoomOutButtonPadding;
        isNaN(l) || (d = l);
        (l = a.zoomOutButtonFontColor) && (c = l);
        var l = a.zoomOutButton,
            n;
        l && (l.fontSize && (d = l.fontSize), l.color && (c = l.color), l.backgroundColor && (h = l.backgroundColor), isNaN(l.backgroundAlpha) || (a.zoomOutButtonRollOverAlpha = l.backgroundAlpha));
        var p = l = 0;
        void 0 !== a.pathToImages && e && (n = a.container.image(a.pathToImages + e, 0, 0, f, f), b.push(n), n = n.getBBox(), l = n.width + 5);
        void 0 !== g && (c = AmCharts.text(a.container, g, c, a.fontFamily, d, "start"), d = c.getBBox(), p = n ? n.height / 2 - 3 : d.height / 2, c.translate(l, p), b.push(c));
        n = b.getBBox();
        h = AmCharts.rect(a.container, n.width + 2 * m + 5, n.height + 2 * m - 2, h, 1, 1, h, 1);
        h.setAttr("opacity", k);
        h.translate(-m, -m);
        b.push(h);
        h.toBack();
        a.zbBG = h;
        n = h.getBBox();
        b.translate(a.marginLeftReal + a.plotAreaWidth - n.width + m, a.marginTopReal + m);
        b.hide();
        b.mouseover(function() {
            a.rollOverZB()
        }).mouseout(function() {
                a.rollOutZB()
            }).click(function() {
                a.clickZB()
            }).touchstart(function() {
                a.rollOverZB()
            }).touchend(function() {
                a.rollOutZB();
                a.clickZB()
            });
        for (k = 0; k < b.length; k++) b[k].attr({
            cursor: "pointer"
        });
        a.zbSet = b
    },
    rollOverZB: function() {
        this.zbBG.setAttr("opacity", this.zoomOutButtonRollOverAlpha)
    },
    rollOutZB: function() {
        this.zbBG.setAttr("opacity", this.zoomOutButtonAlpha)
    },
    clickZB: function() {
        this.zoomOut()
    },
    zoomOut: function() {
        this.updateScrollbar = !0;
        this.zoom()
    },
    drawPlotArea: function() {
        var a = this.dx,
            b = this.dy,
            c = this.marginLeftReal,
            d = this.marginTopReal,
            f = this.plotAreaWidth - 1,
            e = this.plotAreaHeight - 1,
            g = this.plotAreaFillColors,
            h = this.plotAreaFillAlphas,
            k = this.plotAreaBorderColor,
            l = this.plotAreaBorderAlpha;
        this.trendLinesSet.clipRect(c, d, f, e);
        "object" == typeof h && (h = h[0]);
        g = AmCharts.polygon(this.container, [0, f, f, 0], [0, 0, e, e], g, h, 1, k, l, this.plotAreaGradientAngle);
        g.translate(c + a, d + b);
        g.node.setAttribute("class", "amChartsPlotArea");
        this.set.push(g);
        0 !== a && 0 !== b && (g = this.plotAreaFillColors, "object" == typeof g && (g = g[0]), g = AmCharts.adjustLuminosity(g, -0.15), f = AmCharts.polygon(this.container, [0, a, f + a, f, 0], [0, b, b, 0, 0], g, h, 1, k, l), f.translate(c, d + e), this.set.push(f), a = AmCharts.polygon(this.container, [0, 0, a, a, 0], [0, e, e + b, b, 0], g, h, 1, k, l), a.translate(c, d), this.set.push(a))
    },
    updatePlotArea: function() {
        var a = this.updateWidth(),
            b = this.updateHeight(),
            c = this.container;
        this.realWidth = a;
        this.realWidth = b;
        c && this.container.setSize(a, b);
        a = a - this.marginLeftReal - this.marginRightReal - this.dx;
        b = b - this.marginTopReal - this.marginBottomReal;
        1 > a && (a = 1);
        1 > b && (b = 1);
        this.plotAreaWidth = Math.round(a);
        this.plotAreaHeight = Math.round(b)
    },
    updateDxy: function() {
        this.dx = Math.round(this.depth3D * Math.cos(this.angle * Math.PI / 180));
        this.dy = Math.round(-this.depth3D * Math.sin(this.angle * Math.PI / 180));
        this.d3x = Math.round(this.columnSpacing3D * Math.cos(this.angle * Math.PI / 180));
        this.d3y = Math.round(-this.columnSpacing3D * Math.sin(this.angle * Math.PI / 180))
    },
    updateMargins: function() {
        var a = this.getTitleHeight();
        this.titleHeight = a;
        this.marginTopReal = this.marginTop - this.dy + a;
        this.marginBottomReal = this.marginBottom;
        this.marginLeftReal = this.marginLeft;
        this.marginRightReal = this.marginRight
    },
    updateValueAxes: function() {
        var a = this.valueAxes,
            b = this.marginLeftReal,
            c = this.marginTopReal,
            d = this.plotAreaHeight,
            f = this.plotAreaWidth,
            e;
        for (e = 0; e < a.length; e++) {
            var g = a[e];
            g.axisRenderer = AmCharts.RecAxis;
            g.guideFillRenderer = AmCharts.RecFill;
            g.axisItemRenderer = AmCharts.RecItem;
            g.dx = this.dx;
            g.dy = this.dy;
            g.viW = f - 1;
            g.viH = d - 1;
            g.marginsChanged = !0;
            g.viX = b;
            g.viY = c;
            this.updateObjectSize(g)
        }
    },
    updateObjectSize: function(a) {
        a.width = (this.plotAreaWidth - 1) * this.widthMultiplier;
        a.height = (this.plotAreaHeight - 1) * this.heightMultiplier;
        a.x = this.marginLeftReal + this.horizontalPosition;
        a.y = this.marginTopReal + this.verticalPosition
    },
    updateGraphs: function() {
        var a = this.graphs,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.x = this.marginLeftReal + this.horizontalPosition;
            c.y = this.marginTopReal + this.verticalPosition;
            c.width = this.plotAreaWidth * this.widthMultiplier;
            c.height = this.plotAreaHeight * this.heightMultiplier;
            c.index = b;
            c.dx = this.dx;
            c.dy = this.dy;
            c.rotate = this.rotate;
            c.chartType = this.chartType
        }
    },
    updateChartCursor: function() {
        var a = this.chartCursor;
        a && (a = AmCharts.processObject(a, AmCharts.ChartCursor, this.theme), this.addChartCursor(a), a.x = this.marginLeftReal, a.y = this.marginTopReal, a.width = this.plotAreaWidth - 1, a.height = this.plotAreaHeight - 1, a.chart = this)
    },
    processScrollbars: function() {
        var a = this.chartScrollbar;
        a && (a = AmCharts.processObject(a, AmCharts.ChartScrollbar, this.theme), this.addChartScrollbar(a))
    },
    updateScrollbars: function() {},
    addChartCursor: function(a) {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        a && (this.listenTo(a, "changed", this.handleCursorChange), this.listenTo(a, "zoomed", this.handleCursorZoom));
        this.chartCursor = a
    },
    removeChartCursor: function() {
        AmCharts.callMethod("destroy", [this.chartCursor]);
        this.chartCursor = null
    },
    zoomTrendLines: function() {
        var a = this.trendLines,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.valueAxis.recalculateToPercents ? c.set && c.set.hide() : (c.x = this.marginLeftReal + this.horizontalPosition, c.y = this.marginTopReal + this.verticalPosition, c.draw())
        }
    },
    addTrendLine: function(a) {
        this.trendLines.push(a)
    },
    removeTrendLine: function(a) {
        var b = this.trendLines,
            c;
        for (c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1)
    },
    adjustMargins: function(a, b) {
        var c = a.scrollbarHeight;
        "top" == a.position ? b ? this.marginLeftReal += c : this.marginTopReal += c : b ? this.marginRightReal += c : this.marginBottomReal += c
    },
    getScrollbarPosition: function(a, b, c) {
        a.position = b ? "bottom" == c || "left" == c ? "bottom" : "top" : "top" == c || "right" == c ? "bottom" : "top"
    },
    updateChartScrollbar: function(a, b) {
        if (a) {
            a.rotate = b;
            var c = this.marginTopReal,
                d = this.marginLeftReal,
                f = a.scrollbarHeight,
                e = this.dx,
                g = this.dy;
            "top" == a.position ? b ? (a.y = c, a.x = d - f) : (a.y = c - f + g - 1, a.x = d + e) : b ? (a.y = c + g, a.x = d + this.plotAreaWidth + e) : (a.y = c + this.plotAreaHeight, a.x = this.marginLeftReal)
        }
    },
    showZB: function(a) {
        var b = this.zbSet;
        b && (a ? b.show() : b.hide(), this.rollOutZB())
    },
    handleReleaseOutside: function(a) {
        AmCharts.AmRectangularChart.base.handleReleaseOutside.call(this, a);
        (a = this.chartCursor) && a.handleReleaseOutside()
    },
    handleMouseDown: function(a) {
        AmCharts.AmRectangularChart.base.handleMouseDown.call(this, a);
        var b = this.chartCursor;
        b && b.handleMouseDown(a)
    },
    handleCursorChange: function(a) {}
});
AmCharts.TrendLine = AmCharts.Class({
    construct: function(a) {
        this.createEvents("click");
        this.isProtected = !1;
        this.dashLength = 0;
        this.lineColor = "#00CC00";
        this.lineThickness = this.lineAlpha = 1;
        AmCharts.applyTheme(this, a, "TrendLine")
    },
    draw: function() {
        var a = this;
        a.destroy();
        var b = a.chart,
            c = b.container,
            d, f, e, g, h = a.categoryAxis,
            k = a.initialDate,
            l = a.initialCategory,
            m = a.finalDate,
            n = a.finalCategory,
            p = a.valueAxis,
            q = a.valueAxisX,
            t = a.initialXValue,
            r = a.finalXValue,
            s = a.initialValue,
            w = a.finalValue,
            v = p.recalculateToPercents,
            u = b.dataDateFormat;
        h && (k && (k instanceof Date || (k = u ? AmCharts.stringToDate(k, u) : new Date(k)), a.initialDate = k, d = h.dateToCoordinate(k)), l && (d = h.categoryToCoordinate(l)), m && (m instanceof Date || (m = u ? AmCharts.stringToDate(m, u) : new Date(m)), a.finalDate = m, f = h.dateToCoordinate(m)), n && (f = h.categoryToCoordinate(n)));
        q && !v && (isNaN(t) || (d = q.getCoordinate(t)), isNaN(r) || (f = q.getCoordinate(r)));
        p && !v && (isNaN(s) || (e = p.getCoordinate(s)), isNaN(w) || (g = p.getCoordinate(w)));
        isNaN(d) || isNaN(f) || isNaN(e) || isNaN(e) || (b.rotate ? (h = [e, g], f = [d, f]) : (h = [d, f], f = [e, g]), e = a.lineColor, d = AmCharts.line(c, h, f, e, a.lineAlpha, a.lineThickness, a.dashLength), g = h, k = f, n = h[1] - h[0], p = f[1] - f[0], 0 === n && (n = 0.01), 0 === p && (p = 0.01), l = n / Math.abs(n), m = p / Math.abs(p), p = n * p / Math.abs(n * p) * Math.sqrt(Math.pow(n, 2) + Math.pow(p, 2)), n = Math.asin(n / p), p = 90 * Math.PI / 180 - n, n = Math.abs(5 * Math.cos(p)), p = Math.abs(5 * Math.sin(p)), g.push(h[1] - l * p, h[0] - l * p), k.push(f[1] + m * n, f[0] + m * n), h = AmCharts.polygon(c, g, k, e, 0.005, 0), c = c.set([h, d]), c.translate(b.marginLeftReal, b.marginTopReal), b.trendLinesSet.push(c), a.line = d, a.set = c, h.mouseup(function() {
            a.handleLineClick()
        }).mouseover(function() {
                a.handleLineOver()
            }).mouseout(function() {
                a.handleLineOut()
            }), h.touchend && h.touchend(function() {
            a.handleLineClick()
        }))
    },
    handleLineClick: function() {
        var a = {
            type: "click",
            trendLine: this,
            chart: this.chart
        };
        this.fire(a.type, a)
    },
    handleLineOver: function() {
        var a = this.rollOverColor;
        void 0 !== a && this.line.attr({
            stroke: a
        })
    },
    handleLineOut: function() {
        this.line.attr({
            stroke: this.lineColor
        })
    },
    destroy: function() {
        AmCharts.remove(this.set)
    }
});
AmCharts.circle = function(a, b, c, d, f, e, g, h) {
    if (void 0 == f || 0 === f) f = 0.01;
    void 0 === e && (e = "#000000");
    void 0 === g && (g = 0);
    d = {
        fill: c,
        stroke: e,
        "fill-opacity": d,
        "stroke-width": f,
        "stroke-opacity": g
    };
    a = a.circle(0, 0, b).attr(d);
    h && a.gradient("radialGradient", [c, AmCharts.adjustLuminosity(c, -0.6)]);
    return a
};
AmCharts.text = function(a, b, c, d, f, e, g, h) {
    e || (e = "middle");
    "right" == e && (e = "end");
    isNaN(h) && (h = 1);
    void 0 !== b && (b = String(b), AmCharts.isIE && !AmCharts.isModern && (b = b.replace("&amp;", "&"), b = b.replace("&", "&amp;")));
    c = {
        fill: c,
        "font-family": d,
        "font-size": f,
        opacity: h
    };
    !0 === g && (c["font-weight"] = "bold");
    c["text-anchor"] = e;
    return a.text(b, c)
};
AmCharts.polygon = function(a, b, c, d, f, e, g, h, k, l, m) {
    isNaN(e) && (e = 0.01);
    isNaN(h) && (h = f);
    var n = d,
        p = !1;
    "object" == typeof n && 1 < n.length && (p = !0, n = n[0]);
    void 0 === g && (g = n);
    f = {
        fill: n,
        stroke: g,
        "fill-opacity": f,
        "stroke-width": e,
        "stroke-opacity": h
    };
    void 0 !== m && 0 < m && (f["stroke-dasharray"] = m);
    m = AmCharts.dx;
    e = AmCharts.dy;
    a.handDrawn && (c = AmCharts.makeHD(b, c, a.handDrawScatter), b = c[0], c = c[1]);
    g = Math.round;
    l && (g = AmCharts.doNothing);
    l = "M" + (g(b[0]) + m) + "," + (g(c[0]) + e);
    for (h = 1; h < b.length; h++) l += " L" + (g(b[h]) + m) + "," + (g(c[h]) + e);
    a = a.path(l + " Z").attr(f);
    p && a.gradient("linearGradient", d, k);
    return a
};
AmCharts.rect = function(a, b, c, d, f, e, g, h, k, l, m) {
    isNaN(e) && (e = 0);
    void 0 === k && (k = 0);
    void 0 === l && (l = 270);
    isNaN(f) && (f = 0);
    var n = d,
        p = !1;
    "object" == typeof n && (n = n[0], p = !0);
    void 0 === g && (g = n);
    void 0 === h && (h = f);
    b = Math.round(b);
    c = Math.round(c);
    var q = 0,
        t = 0;
    0 > b && (b = Math.abs(b), q = -b);
    0 > c && (c = Math.abs(c), t = -c);
    q += AmCharts.dx;
    t += AmCharts.dy;
    f = {
        fill: n,
        stroke: g,
        "fill-opacity": f,
        "stroke-opacity": h
    };
    void 0 !== m && 0 < m && (f["stroke-dasharray"] = m);
    a = a.rect(q, t, b, c, k, e).attr(f);
    p && a.gradient("linearGradient", d, l);
    return a
};
AmCharts.bullet = function(a, b, c, d, f, e, g, h, k, l, m) {
    var n;
    "circle" == b && (b = "round");
    switch (b) {
        case "round":
            n = AmCharts.circle(a, c / 2, d, f, e, g, h);
            break;
        case "square":
            n = AmCharts.polygon(a, [-c / 2, c / 2, c / 2, -c / 2], [c / 2, c / 2, -c / 2, -c / 2], d, f, e, g, h, l - 180);
            break;
        case "rectangle":
            n = AmCharts.polygon(a, [-c, c, c, -c], [c / 2, c / 2, -c / 2, -c / 2], d, f, e, g, h, l - 180);
            break;
        case "diamond":
            n = AmCharts.polygon(a, [-c / 2, 0, c / 2, 0], [0, -c / 2, 0, c / 2], d, f, e, g, h);
            break;
        case "triangleUp":
            n = AmCharts.triangle(a, c, 0, d, f, e, g, h);
            break;
        case "triangleDown":
            n = AmCharts.triangle(a, c, 180, d, f, e, g, h);
            break;
        case "triangleLeft":
            n = AmCharts.triangle(a, c, 270, d, f, e, g, h);
            break;
        case "triangleRight":
            n = AmCharts.triangle(a, c, 90, d, f, e, g, h);
            break;
        case "bubble":
            n = AmCharts.circle(a, c / 2, d, f, e, g, h, !0);
            break;
        case "yError":
            n = a.set();
            n.push(AmCharts.line(a, [0, 0], [-c / 2, c / 2], d, f, e));
            n.push(AmCharts.line(a, [-k, k], [-c / 2, -c / 2], d, f, e));
            n.push(AmCharts.line(a, [-k, k], [c / 2, c / 2], d, f, e));
            break;
        case "xError":
            n = a.set(), n.push(AmCharts.line(a, [-c / 2, c / 2], [0, 0], d, f, e)), n.push(AmCharts.line(a, [-c / 2, -c / 2], [-k, k], d, f, e)), n.push(AmCharts.line(a, [c / 2, c / 2], [-k, k], d, f, e))
    }
    n && n.pattern(m);
    return n
};
AmCharts.triangle = function(a, b, c, d, f, e, g, h) {
    if (void 0 === e || 0 === e) e = 1;
    void 0 === g && (g = "#000");
    void 0 === h && (h = 0);
    d = {
        fill: d,
        stroke: g,
        "fill-opacity": f,
        "stroke-width": e,
        "stroke-opacity": h
    };
    b /= 2;
    var k;
    0 === c && (k = " M" + -b + "," + b + " L0," + -b + " L" + b + "," + b + " Z");
    180 == c && (k = " M" + -b + "," + -b + " L0," + b + " L" + b + "," + -b + " Z");
    90 == c && (k = " M" + -b + "," + -b + " L" + b + ",0 L" + -b + "," + b + " Z");
    270 == c && (k = " M" + -b + ",0 L" + b + "," + b + " L" + b + "," + -b + " Z");
    return a.path(k).attr(d)
};
AmCharts.line = function(a, b, c, d, f, e, g, h, k, l, m) {
    if (a.handDrawn && !m) return AmCharts.handDrawnLine(a, b, c, d, f, e, g, h, k, l, m);
    e = {
        fill: "none",
        "stroke-width": e
    };
    void 0 !== g && 0 < g && (e["stroke-dasharray"] = g);
    isNaN(f) || (e["stroke-opacity"] = f);
    d && (e.stroke = d);
    d = Math.round;
    l && (d = AmCharts.doNothing);
    l = AmCharts.dx;
    f = AmCharts.dy;
    g = "M" + (d(b[0]) + l) + "," + (d(c[0]) + f);
    for (h = 1; h < b.length; h++) g += " L" + (d(b[h]) + l) + "," + (d(c[h]) + f);
    if (AmCharts.VML) return a.path(g, void 0, !0).attr(e);
    k && (g += " M0,0 L0,0");
    return a.path(g).attr(e)
};
AmCharts.makeHD = function(a, b, c) {
    for (var d = [], f = [], e = 1; e < a.length; e++) for (var g = Number(a[e - 1]), h = Number(b[e - 1]), k = Number(a[e]), l = Number(b[e]), m = Math.sqrt(Math.pow(k - g, 2) + Math.pow(l - h, 2)), m = Math.round(m / 50) + 1, k = (k - g) / m, l = (l - h) / m, n = 0; n <= m; n++) {
        var p = g + n * k + Math.random() * c,
            q = h + n * l + Math.random() * c;
        d.push(p);
        f.push(q)
    }
    return [d, f]
};
AmCharts.handDrawnLine = function(a, b, c, d, f, e, g, h, k, l, m) {
    var n = a.set();
    for (m = 1; m < b.length; m++) for (var p = [b[m - 1], b[m]], q = [c[m - 1], c[m]], q = AmCharts.makeHD(p, q, a.handDrawScatter), p = q[0], q = q[1], t = 1; t < p.length; t++) n.push(AmCharts.line(a, [p[t - 1], p[t]], [q[t - 1], q[t]], d, f, e + Math.random() * a.handDrawThickness - a.handDrawThickness / 2, g, h, k, l, !0));
    return n
};
AmCharts.doNothing = function(a) {
    return a
};
AmCharts.wedge = function(a, b, c, d, f, e, g, h, k, l, m, n) {
    var p = Math.round;
    e = p(e);
    g = p(g);
    h = p(h);
    var q = p(g / e * h),
        t = AmCharts.VML,
        r = 359.5 + e / 100;
    359.94 < r && (r = 359.94);
    f >= r && (f = r);
    var s = 1 / 180 * Math.PI,
        r = b + Math.sin(d * s) * h,
        w = c - Math.cos(d * s) * q,
        v = b + Math.sin(d * s) * e,
        u = c - Math.cos(d * s) * g,
        A = b + Math.sin((d + f) * s) * e,
        F = c - Math.cos((d + f) * s) * g,
        y = b + Math.sin((d + f) * s) * h,
        s = c - Math.cos((d + f) * s) * q,
        z = {
            fill: AmCharts.adjustLuminosity(l.fill, -0.2),
            "stroke-opacity": 0,
            "fill-opacity": l["fill-opacity"]
        },
        H = 0;
    180 < Math.abs(f) && (H = 1);
    d = a.set();
    var I;
    t && (r = p(10 * r), v = p(10 * v), A = p(10 * A), y = p(10 * y), w = p(10 * w), u = p(10 * u), F = p(10 * F), s = p(10 * s), b = p(10 * b), k = p(10 * k), c = p(10 * c), e *= 10, g *= 10, h *= 10, q *= 10, 1 > Math.abs(f) && 1 >= Math.abs(A - v) && 1 >= Math.abs(F - u) && (I = !0));
    f = "";
    var B;
    0 < k && (t ? (B = " M" + r + "," + (w + k) + " L" + v + "," + (u + k), I || (B += " A" + (b - e) + "," + (k + c - g) + "," + (b + e) + "," + (k + c + g) + "," + v + "," + (u + k) + "," + A + "," + (F + k)), B += " L" + y + "," + (s + k), 0 < h && (I || (B += " B" + (b - h) + "," + (k + c - q) + "," + (b + h) + "," + (k + c + q) + "," + y + "," + (k + s) + "," + r + "," + (k + w)))) : (B = " M" + r + "," + (w + k) + " L" + v + "," + (u + k) + (" A" + e + "," + g + ",0," + H + ",1," + A + "," + (F + k) + " L" + y + "," + (s + k)), 0 < h && (B += " A" + h + "," + q + ",0," + H + ",0," + r + "," + (w + k))), B += " Z", B = a.path(B, void 0, void 0, "1000,1000").attr(z), d.push(B), B = a.path(" M" + r + "," + w + " L" + r + "," + (w + k) + " L" + v + "," + (u + k) + " L" + v + "," + u + " L" + r + "," + w + " Z", void 0, void 0, "1000,1000").attr(z), k = a.path(" M" + A + "," + F + " L" + A + "," + (F + k) + " L" + y + "," + (s + k) + " L" + y + "," + s + " L" + A + "," + F + " Z", void 0, void 0, "1000,1000").attr(z), d.push(B), d.push(k));
    t ? (I || (f = " A" + p(b - e) + "," + p(c - g) + "," + p(b + e) + "," + p(c + g) + "," + p(v) + "," + p(u) + "," + p(A) + "," + p(F)), e = " M" + p(r) + "," + p(w) + " L" + p(v) + "," + p(u) + f + " L" + p(y) + "," + p(s)) : e = " M" + r + "," + w + " L" + v + "," + u + (" A" + e + "," + g + ",0," + H + ",1," + A + "," + F) + " L" + y + "," + s;
    0 < h && (t ? I || (e += " B" + (b - h) + "," + (c - q) + "," + (b + h) + "," + (c + q) + "," + y + "," + s + "," + r + "," + w) : e += " A" + h + "," + q + ",0," + H + ",0," + r + "," + w);
    a.handDrawn && (b = AmCharts.line(a, [r, v], [w, u], l.stroke, l.thickness * Math.random() * a.handDrawThickness, l["stroke-opacity"]), d.push(b));
    a = a.path(e + " Z", void 0, void 0, "1000,1000").attr(l);
    if (m) {
        b = [];
        for (c = 0; c < m.length; c++) b.push(AmCharts.adjustLuminosity(l.fill, m[c]));
        0 < b.length && a.gradient("linearGradient", b)
    }
    a.pattern(n);
    d.push(a);
    return d
};
AmCharts.adjustLuminosity = function(a, b) {
    a = String(a).replace(/[^0-9a-f]/gi, "");
    6 > a.length && (a = String(a[0]) + String(a[0]) + String(a[1]) + String(a[1]) + String(a[2]) + String(a[2]));
    b = b || 0;
    var c = "#",
        d, f;
    for (f = 0; 3 > f; f++) d = parseInt(a.substr(2 * f, 2), 16), d = Math.round(Math.min(Math.max(0, d + d * b), 255)).toString(16), c += ("00" + d).substr(d.length);
    return c
};
AmCharts.Bezier = AmCharts.Class({
    construct: function(a, b, c, d, f, e, g, h, k, l) {
        "object" == typeof g && (g = g[0]);
        "object" == typeof h && (h = h[0]);
        e = {
            fill: g,
            "fill-opacity": h,
            "stroke-width": e
        };
        void 0 !== k && 0 < k && (e["stroke-dasharray"] = k);
        isNaN(f) || (e["stroke-opacity"] = f);
        d && (e.stroke = d);
        d = "M" + Math.round(b[0]) + "," + Math.round(c[0]);
        f = [];
        for (k = 0; k < b.length; k++) f.push({
            x: Number(b[k]),
            y: Number(c[k])
        });
        1 < f.length && (b = this.interpolate(f), d += this.drawBeziers(b));
        l ? d += l : AmCharts.VML || (d += "M0,0 L0,0");
        this.path = a.path(d).attr(e)
    },
    interpolate: function(a) {
        var b = [];
        b.push({
            x: a[0].x,
            y: a[0].y
        });
        var c = a[1].x - a[0].x,
            d = a[1].y - a[0].y,
            f = AmCharts.bezierX,
            e = AmCharts.bezierY;
        b.push({
            x: a[0].x + c / f,
            y: a[0].y + d / e
        });
        var g;
        for (g = 1; g < a.length - 1; g++) {
            var h = a[g - 1],
                k = a[g],
                d = a[g + 1];
            isNaN(d.x) && (d = k);
            isNaN(k.x) && (k = h);
            isNaN(h.x) && (h = k);
            c = d.x - k.x;
            d = d.y - h.y;
            h = k.x - h.x;
            h > c && (h = c);
            b.push({
                x: k.x - h / f,
                y: k.y - d / e
            });
            b.push({
                x: k.x,
                y: k.y
            });
            b.push({
                x: k.x + h / f,
                y: k.y + d / e
            })
        }
        d = a[a.length - 1].y - a[a.length - 2].y;
        c = a[a.length - 1].x - a[a.length - 2].x;
        b.push({
            x: a[a.length - 1].x - c / f,
            y: a[a.length - 1].y - d / e
        });
        b.push({
            x: a[a.length - 1].x,
            y: a[a.length - 1].y
        });
        return b
    },
    drawBeziers: function(a) {
        var b = "",
            c;
        for (c = 0; c < (a.length - 1) / 3; c++) b += this.drawBezierMidpoint(a[3 * c], a[3 * c + 1], a[3 * c + 2], a[3 * c + 3]);
        return b
    },
    drawBezierMidpoint: function(a, b, c, d) {
        var f = Math.round,
            e = this.getPointOnSegment(a, b, 0.75),
            g = this.getPointOnSegment(d, c, 0.75),
            h = (d.x - a.x) / 16,
            k = (d.y - a.y) / 16,
            l = this.getPointOnSegment(a, b, 0.375);
        a = this.getPointOnSegment(e, g, 0.375);
        a.x -= h;
        a.y -= k;
        b = this.getPointOnSegment(g, e, 0.375);
        b.x += h;
        b.y += k;
        c = this.getPointOnSegment(d, c, 0.375);
        h = this.getMiddle(l, a);
        e = this.getMiddle(e, g);
        g = this.getMiddle(b, c);
        l = " Q" + f(l.x) + "," + f(l.y) + "," + f(h.x) + "," + f(h.y);
        l += " Q" + f(a.x) + "," + f(a.y) + "," + f(e.x) + "," + f(e.y);
        l += " Q" + f(b.x) + "," + f(b.y) + "," + f(g.x) + "," + f(g.y);
        return l += " Q" + f(c.x) + "," + f(c.y) + "," + f(d.x) + "," + f(d.y)
    },
    getMiddle: function(a, b) {
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    },
    getPointOnSegment: function(a, b, c) {
        return {
            x: a.x + (b.x - a.x) * c,
            y: a.y + (b.y - a.y) * c
        }
    }
});
AmCharts.AmDraw = AmCharts.Class({
    construct: function(a, b, c, d) {
        AmCharts.SVG_NS = "http://www.w3.org/2000/svg";
        AmCharts.SVG_XLINK = "http://www.w3.org/1999/xlink";
        AmCharts.hasSVG = !! document.createElementNS && !! document.createElementNS(AmCharts.SVG_NS, "svg").createSVGRect;
        1 > b && (b = 10);
        1 > c && (c = 10);
        this.div = a;
        this.width = b;
        this.height = c;
        this.rBin = document.createElement("div");
        AmCharts.hasSVG ? (AmCharts.SVG = !0, d = this.createSvgElement("svg"), d.style.position = "absolute", d.style.width = b + "px", d.style.height = c + "px", AmCharts.rtl && (d.setAttribute("direction", "rtl"), d.style.left = "auto", d.style.right = "0px"), d.setAttribute("version", "1.1"), a.appendChild(d), this.container = d, this.R = new AmCharts.SVGRenderer(this)) : AmCharts.isIE && AmCharts.VMLRenderer && (AmCharts.VML = !0, AmCharts.vmlStyleSheet || (document.namespaces.add("amvml", "urn:schemas-microsoft-com:vml"), b = document.createStyleSheet(), b.addRule(".amvml", "behavior:url(#default#VML); display:inline-block; antialias:true"), AmCharts.vmlStyleSheet = b), this.container = a, this.R = new AmCharts.VMLRenderer(this, d), this.R.disableSelection(a))
    },
    createSvgElement: function(a) {
        return document.createElementNS(AmCharts.SVG_NS, a)
    },
    circle: function(a, b, c, d) {
        var f = new AmCharts.AmDObject("circle", this);
        f.attr({
            r: c,
            cx: a,
            cy: b
        });
        this.addToContainer(f.node, d);
        return f
    },
    setSize: function(a, b) {
        0 < a && 0 < b && (this.container.style.width = a + "px", this.container.style.height = b + "px")
    },
    rect: function(a, b, c, d, f, e, g) {
        var h = new AmCharts.AmDObject("rect", this);
        AmCharts.VML && (f = 100 * f / Math.min(c, d), c += 2 * e, d += 2 * e, h.bw = e, h.node.style.marginLeft = -e, h.node.style.marginTop = -e);
        1 > c && (c = 1);
        1 > d && (d = 1);
        h.attr({
            x: a,
            y: b,
            width: c,
            height: d,
            rx: f,
            ry: f,
            "stroke-width": e
        });
        this.addToContainer(h.node, g);
        return h
    },
    image: function(a, b, c, d, f, e) {
        var g = new AmCharts.AmDObject("image", this);
        g.attr({
            x: b,
            y: c,
            width: d,
            height: f
        });
        this.R.path(g, a);
        this.addToContainer(g.node, e);
        return g
    },
    addToContainer: function(a, b) {
        b || (b = this.container);
        b.appendChild(a)
    },
    text: function(a, b, c) {
        return this.R.text(a, b, c)
    },
    path: function(a, b, c, d) {
        var f = new AmCharts.AmDObject("path", this);
        d || (d = "100,100");
        f.attr({
            cs: d
        });
        c ? f.attr({
            dd: a
        }) : f.attr({
            d: a
        });
        this.addToContainer(f.node, b);
        return f
    },
    set: function(a) {
        return this.R.set(a)
    },
    remove: function(a) {
        if (a) {
            var b = this.rBin;
            b.appendChild(a);
            b.innerHTML = ""
        }
    },
    renderFix: function() {
        var a = this.container,
            b = a.style,
            c;
        try {
            c = a.getScreenCTM() || a.createSVGMatrix()
        } catch (d) {
            c = a.createSVGMatrix()
        }
        a = 1 - c.e % 1;
        c = 1 - c.f % 1;
        0.5 < a && (a -= 1);
        0.5 < c && (c -= 1);
        a && (b.left = a + "px");
        c && (b.top = c + "px")
    },
    update: function() {
        this.R.update()
    }
});
AmCharts.AmDObject = AmCharts.Class({
    construct: function(a, b) {
        this.D = b;
        this.R = b.R;
        this.node = this.R.create(this, a);
        this.y = this.x = 0;
        this.scale = 1
    },
    attr: function(a) {
        this.R.attr(this, a);
        return this
    },
    getAttr: function(a) {
        return this.node.getAttribute(a)
    },
    setAttr: function(a, b) {
        this.R.setAttr(this, a, b);
        return this
    },
    clipRect: function(a, b, c, d) {
        this.R.clipRect(this, a, b, c, d)
    },
    translate: function(a, b, c, d) {
        d || (a = Math.round(a), b = Math.round(b));
        this.R.move(this, a, b, c);
        this.x = a;
        this.y = b;
        this.scale = c;
        this.angle && this.rotate(this.angle)
    },
    rotate: function(a, b) {
        this.R.rotate(this, a, b);
        this.angle = a
    },
    animate: function(a, b, c) {
        for (var d in a) if (a.hasOwnProperty(d)) {
            var f = d,
                e = a[d];
            c = AmCharts.getEffect(c);
            this.R.animate(this, f, e, b, c)
        }
    },
    push: function(a) {
        if (a) {
            var b = this.node;
            b.appendChild(a.node);
            var c = a.clipPath;
            c && b.appendChild(c);
            (a = a.grad) && b.appendChild(a)
        }
    },
    text: function(a) {
        this.R.setText(this, a)
    },
    remove: function() {
        this.R.remove(this)
    },
    clear: function() {
        var a = this.node;
        if (a.hasChildNodes()) for (; 1 <= a.childNodes.length;) a.removeChild(a.firstChild)
    },
    hide: function() {
        this.setAttr("visibility", "hidden")
    },
    show: function() {
        this.setAttr("visibility", "visible")
    },
    getBBox: function() {
        return this.R.getBBox(this)
    },
    toFront: function() {
        var a = this.node;
        if (a) {
            this.prevNextNode = a.nextSibling;
            var b = a.parentNode;
            b && b.appendChild(a)
        }
    },
    toPrevious: function() {
        var a = this.node;
        a && this.prevNextNode && (a = a.parentNode) && a.insertBefore(this.prevNextNode, null)
    },
    toBack: function() {
        var a = this.node;
        if (a) {
            this.prevNextNode = a.nextSibling;
            var b = a.parentNode;
            if (b) {
                var c = b.firstChild;
                c && b.insertBefore(a, c)
            }
        }
    },
    mouseover: function(a) {
        this.R.addListener(this, "mouseover", a);
        return this
    },
    mouseout: function(a) {
        this.R.addListener(this, "mouseout", a);
        return this
    },
    click: function(a) {
        this.R.addListener(this, "click", a);
        return this
    },
    dblclick: function(a) {
        this.R.addListener(this, "dblclick", a);
        return this
    },
    mousedown: function(a) {
        this.R.addListener(this, "mousedown", a);
        return this
    },
    mouseup: function(a) {
        this.R.addListener(this, "mouseup", a);
        return this
    },
    touchstart: function(a) {
        this.R.addListener(this, "touchstart", a);
        return this
    },
    touchend: function(a) {
        this.R.addListener(this, "touchend", a);
        return this
    },
    contextmenu: function(a) {
        this.node.addEventListener ? this.node.addEventListener("contextmenu", a, !0) : this.R.addListener(this, "contextmenu", a);
        return this
    },
    stop: function(a) {
        (a = this.animationX) && AmCharts.removeFromArray(this.R.animations, a);
        (a = this.animationY) && AmCharts.removeFromArray(this.R.animations, a)
    },
    length: function() {
        return this.node.childNodes.length
    },
    gradient: function(a, b, c) {
        this.R.gradient(this, a, b, c)
    },
    pattern: function(a, b) {
        a && this.R.pattern(this, a, b)
    }
});
AmCharts.VMLRenderer = AmCharts.Class({
    construct: function(a, b) {
        this.chart = b;
        this.D = a;
        this.cNames = {
            circle: "oval",
            rect: "roundrect",
            path: "shape"
        };
        this.styleMap = {
            x: "left",
            y: "top",
            width: "width",
            height: "height",
            "font-family": "fontFamily",
            "font-size": "fontSize",
            visibility: "visibility"
        }
    },
    create: function(a, b) {
        var c;
        if ("group" == b) c = document.createElement("div"), a.type = "div";
        else if ("text" == b) c = document.createElement("div"), a.type = "text";
        else if ("image" == b) c = document.createElement("img"), a.type = "image";
        else {
            a.type = "shape";
            a.shapeType = this.cNames[b];
            c = document.createElement("amvml:" + this.cNames[b]);
            var d = document.createElement("amvml:stroke");
            c.appendChild(d);
            a.stroke = d;
            var f = document.createElement("amvml:fill");
            c.appendChild(f);
            a.fill = f;
            f.className = "amvml";
            d.className = "amvml";
            c.className = "amvml"
        }
        c.style.position = "absolute";
        c.style.top = 0;
        c.style.left = 0;
        return c
    },
    path: function(a, b) {
        a.node.setAttribute("src", b)
    },
    setAttr: function(a, b, c) {
        if (void 0 !== c) {
            var d;
            8 === document.documentMode && (d = !0);
            var f = a.node,
                e = a.type,
                g = f.style;
            "r" == b && (g.width = 2 * c, g.height = 2 * c);
            "roundrect" != a.shapeType || "width" != b && "height" != b || (c -= 1);
            "cursor" == b && (g.cursor = c);
            "cx" == b && (g.left = c - AmCharts.removePx(g.width) / 2);
            "cy" == b && (g.top = c - AmCharts.removePx(g.height) / 2);
            var h = this.styleMap[b];
            void 0 !== h && (g[h] = c);
            "text" == e && ("text-anchor" == b && (a.anchor = c, h = f.clientWidth, "end" == c && (g.marginLeft = -h + "px"), "middle" == c && (g.marginLeft = -(h / 2) + "px", g.textAlign = "center"), "start" == c && (g.marginLeft = "0px")), "fill" == b && (g.color = c), "font-weight" == b && (g.fontWeight = c));
            if (g = a.children) for (h = 0; h < g.length; h++) g[h].setAttr(b, c);
            if ("shape" == e) {
                "cs" == b && (f.style.width = "100px", f.style.height = "100px", f.setAttribute("coordsize", c));
                "d" == b && f.setAttribute("path", this.svgPathToVml(c));
                "dd" == b && f.setAttribute("path", c);
                e = a.stroke;
                a = a.fill;
                "stroke" == b && (d ? e.color = c : e.setAttribute("color", c));
                "stroke-width" == b && (d ? e.weight = c : e.setAttribute("weight", c));
                "stroke-opacity" == b && (d ? e.opacity = c : e.setAttribute("opacity", c));
                "stroke-dasharray" == b && (g = "solid", 0 < c && 3 > c && (g = "dot"), 3 <= c && 6 >= c && (g = "dash"), 6 < c && (g = "longdash"), d ? e.dashstyle = g : e.setAttribute("dashstyle", g));
                if ("fill-opacity" == b || "opacity" == b) 0 === c ? d ? a.on = !1 : a.setAttribute("on", !1) : d ? a.opacity = c : a.setAttribute("opacity", c);
                "fill" == b && (d ? a.color = c : a.setAttribute("color", c));
                "rx" == b && (d ? f.arcSize = c + "%" : f.setAttribute("arcsize", c + "%"))
            }
        }
    },
    attr: function(a, b) {
        for (var c in b) b.hasOwnProperty(c) && this.setAttr(a, c, b[c])
    },
    text: function(a, b, c) {
        var d = new AmCharts.AmDObject("text", this.D),
            f = d.node;
        f.style.whiteSpace = "pre";
        f.innerHTML = a;
        this.D.addToContainer(f, c);
        this.attr(d, b);
        return d
    },
    getBBox: function(a) {
        return this.getBox(a.node)
    },
    getBox: function(a) {
        var b = a.offsetLeft,
            c = a.offsetTop,
            d = a.offsetWidth,
            f = a.offsetHeight,
            e;
        if (a.hasChildNodes()) {
            var g, h, k;
            for (k = 0; k < a.childNodes.length; k++) {
                e = this.getBox(a.childNodes[k]);
                var l = e.x;
                isNaN(l) || (isNaN(g) ? g = l : l < g && (g = l));
                var m = e.y;
                isNaN(m) || (isNaN(h) ? h = m : m < h && (h = m));
                l = e.width + l;
                isNaN(l) || (d = Math.max(d, l));
                e = e.height + m;
                isNaN(e) || (f = Math.max(f, e))
            }
            0 > g && (b += g);
            0 > h && (c += h)
        }
        return {
            x: b,
            y: c,
            width: d,
            height: f
        }
    },
    setText: function(a, b) {
        var c = a.node;
        c && (c.innerHTML = b);
        this.setAttr(a, "text-anchor", a.anchor)
    },
    addListener: function(a, b, c) {
        a.node["on" + b] = c
    },
    move: function(a, b, c) {
        var d = a.node,
            f = d.style;
        "text" == a.type && (c -= AmCharts.removePx(f.fontSize) / 2 - 1);
        "oval" == a.shapeType && (b -= AmCharts.removePx(f.width) / 2, c -= AmCharts.removePx(f.height) / 2);
        a = a.bw;
        isNaN(a) || (b -= a, c -= a);
        isNaN(b) || isNaN(c) || (d.style.left = b + "px", d.style.top = c + "px")
    },
    svgPathToVml: function(a) {
        var b = a.split(" ");
        a = "";
        var c, d = Math.round,
            f;
        for (f = 0; f < b.length; f++) {
            var e = b[f],
                g = e.substring(0, 1),
                e = e.substring(1),
                h = e.split(","),
                k = d(h[0]) + "," + d(h[1]);
            "M" == g && (a += " m " + k);
            "L" == g && (a += " l " + k);
            "Z" == g && (a += " x e");
            if ("Q" == g) {
                var l = c.length,
                    m = c[l - 1],
                    n = h[0],
                    p = h[1],
                    k = h[2],
                    q = h[3];
                c = d(c[l - 2] / 3 + 2 / 3 * n);
                m = d(m / 3 + 2 / 3 * p);
                n = d(2 / 3 * n + k / 3);
                p = d(2 / 3 * p + q / 3);
                a += " c " + c + "," + m + "," + n + "," + p + "," + k + "," + q
            }
            "A" == g && (a += " wa " + e);
            "B" == g && (a += " at " + e);
            c = h
        }
        return a
    },
    animate: function(a, b, c, d, f) {
        var e = a.node,
            g = this.chart;
        if ("translate" == b) {
            b = c.split(",");
            c = b[1];
            var h = e.offsetTop;
            g.animate(a, "left", e.offsetLeft, b[0], d, f, "px");
            g.animate(a, "top", h, c, d, f, "px")
        }
    },
    clipRect: function(a, b, c, d, f) {
        a = a.node;
        0 === b && 0 === c ? (a.style.width = d + "px", a.style.height = f + "px", a.style.overflow = "hidden") : a.style.clip = "rect(" + c + "px " + (b + d) + "px " + (c + f) + "px " + b + "px)"
    },
    rotate: function(a, b, c) {
        if (0 !== Number(b)) {
            var d = a.node;
            a = d.style;
            c || (c = this.getBGColor(d.parentNode));
            a.backgroundColor = c;
            a.paddingLeft = 1;
            c = b * Math.PI / 180;
            var f = Math.cos(c),
                e = Math.sin(c),
                g = AmCharts.removePx(a.left),
                h = AmCharts.removePx(a.top),
                k = d.offsetWidth,
                d = d.offsetHeight;
            b /= Math.abs(b);
            a.left = g + k / 2 - k / 2 * Math.cos(c) - b * d / 2 * Math.sin(c) + 3;
            a.top = h - b * k / 2 * Math.sin(c) + b * d / 2 * Math.sin(c);
            a.cssText = a.cssText + "; filter:progid:DXImageTransform.Microsoft.Matrix(M11='" + f + "', M12='" + -e + "', M21='" + e + "', M22='" + f + "', sizingmethod='auto expand');"
        }
    },
    getBGColor: function(a) {
        var b = "#FFFFFF";
        if (a.style) {
            var c = a.style.backgroundColor;
            "" !== c ? b = c : a.parentNode && (b = this.getBGColor(a.parentNode))
        }
        return b
    },
    set: function(a) {
        var b = new AmCharts.AmDObject("group", this.D);
        this.D.container.appendChild(b.node);
        if (a) {
            var c;
            for (c = 0; c < a.length; c++) b.push(a[c])
        }
        return b
    },
    gradient: function(a, b, c, d) {
        var f = "";
        "radialGradient" == b && (b = "gradientradial", c.reverse());
        "linearGradient" == b && (b = "gradient");
        var e;
        for (e = 0; e < c.length; e++) {
            var g = Math.round(100 * e / (c.length - 1)),
                f = f + (g + "% " + c[e]);
            e < c.length - 1 && (f += ",")
        }
        a = a.fill;
        90 == d ? d = 0 : 270 == d ? d = 180 : 180 == d ? d = 90 : 0 === d && (d = 270);
        8 === document.documentMode ? (a.type = b, a.angle = d) : (a.setAttribute("type", b), a.setAttribute("angle", d));
        f && (a.colors.value = f)
    },
    remove: function(a) {
        a.clipPath && this.D.remove(a.clipPath);
        this.D.remove(a.node)
    },
    disableSelection: function(a) {
        void 0 !== typeof a.onselectstart && (a.onselectstart = function() {
            return !1
        });
        a.style.cursor = "default"
    },
    pattern: function(a, b) {
        var c = a.fill;
        a.node.fillColor = "none";
        8 === document.documentMode ? (c.type = "tile", c.src = b.url) : (c.setAttribute("type", "tile"), c.setAttribute("src", b.url))
    },
    update: function() {}
});
AmCharts.SVGRenderer = AmCharts.Class({
    construct: function(a) {
        this.D = a;
        this.animations = []
    },
    create: function(a, b) {
        return document.createElementNS(AmCharts.SVG_NS, b)
    },
    attr: function(a, b) {
        for (var c in b) b.hasOwnProperty(c) && this.setAttr(a, c, b[c])
    },
    setAttr: function(a, b, c) {
        void 0 !== c && a.node.setAttribute(b, c)
    },
    animate: function(a, b, c, d, f) {
        var e = a.node;
        a["an_" + b] && AmCharts.removeFromArray(this.animations, a["an_" + b]);
        "translate" == b ? (e = (e = e.getAttribute("transform")) ? String(e).substring(10, e.length - 1) : "0,0", e = e.split(", ").join(" "), e = e.split(" ").join(","), 0 === e && (e = "0,0")) : e = Number(e.getAttribute(b));
        c = {
            obj: a,
            frame: 0,
            attribute: b,
            from: e,
            to: c,
            time: d,
            effect: f
        };
        this.animations.push(c);
        a["an_" + b] = c
    },
    update: function() {
        var a, b = this.animations;
        for (a = b.length - 1; 0 <= a; a--) {
            var c = b[a],
                d = 1E3 * c.time / AmCharts.updateRate,
                f = c.frame + 1,
                e = c.obj,
                g = c.attribute,
                h, k, l;
            f <= d ? (c.frame++, "translate" == g ? (h = c.from.split(","), g = Number(h[0]), h = Number(h[1]), isNaN(h) && (h = 0), k = c.to.split(","), l = Number(k[0]), k = Number(k[1]), l = 0 === l - g ? l : Math.round(AmCharts[c.effect](0, f, g, l - g, d)), c = 0 === k - h ? k : Math.round(AmCharts[c.effect](0, f, h, k - h, d)), g = "transform", c = "translate(" + l + "," + c + ")") : (k = Number(c.from), h = Number(c.to), l = h - k, c = AmCharts[c.effect](0, f, k, l, d), isNaN(c) && (c = h), 0 === l && this.animations.splice(a, 1)), this.setAttr(e, g, c)) : ("translate" == g ? (k = c.to.split(","), l = Number(k[0]), k = Number(k[1]), e.translate(l, k)) : (h = Number(c.to), this.setAttr(e, g, h)), this.animations.splice(a, 1))
        }
    },
    getBBox: function(a) {
        if (a = a.node) try {
            return a.getBBox()
        } catch (b) {}
        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }
    },
    path: function(a, b) {
        a.node.setAttributeNS(AmCharts.SVG_XLINK, "xlink:href", b)
    },
    clipRect: function(a, b, c, d, f) {
        var e = a.node,
            g = a.clipPath;
        g && this.D.remove(g);
        var h = e.parentNode;
        h && (e = document.createElementNS(AmCharts.SVG_NS, "clipPath"), g = AmCharts.getUniqueId(), e.setAttribute("id", g), this.D.rect(b, c, d, f, 0, 0, e), h.appendChild(e), b = "#", AmCharts.baseHref && !AmCharts.isIE && (b = window.location.href + b), this.setAttr(a, "clip-path", "url(" + b + g + ")"), this.clipPathC++, a.clipPath = e)
    },
    text: function(a, b, c) {
        var d = new AmCharts.AmDObject("text", this.D);
        a = String(a).split("\n");
        var f = b["font-size"],
            e;
        for (e = 0; e < a.length; e++) {
            var g = this.create(null, "tspan");
            g.appendChild(document.createTextNode(a[e]));
            g.setAttribute("y", (f + 2) * e + Math.round(f / 2));
            g.setAttribute("x", 0);
            d.node.appendChild(g)
        }
        d.node.setAttribute("y", Math.round(f / 2));
        this.attr(d, b);
        this.D.addToContainer(d.node, c);
        return d
    },
    setText: function(a, b) {
        var c = a.node;
        c && (c.removeChild(c.firstChild), c.appendChild(document.createTextNode(b)))
    },
    move: function(a, b, c, d) {
        b = "translate(" + b + "," + c + ")";
        d && (b = b + " scale(" + d + ")");
        this.setAttr(a, "transform", b)
    },
    rotate: function(a, b) {
        var c = a.node.getAttribute("transform"),
            d = "rotate(" + b + ")";
        c && (d = c + " " + d);
        this.setAttr(a, "transform", d)
    },
    set: function(a) {
        var b = new AmCharts.AmDObject("g", this.D);
        this.D.container.appendChild(b.node);
        if (a) {
            var c;
            for (c = 0; c < a.length; c++) b.push(a[c])
        }
        return b
    },
    addListener: function(a, b, c) {
        a.node["on" + b] = c
    },
    gradient: function(a, b, c, d) {
        var f = a.node,
            e = a.grad;
        e && this.D.remove(e);
        b = document.createElementNS(AmCharts.SVG_NS, b);
        e = AmCharts.getUniqueId();
        b.setAttribute("id", e);
        if (!isNaN(d)) {
            var g = 0,
                h = 0,
                k = 0,
                l = 0;
            90 == d ? k = 100 : 270 == d ? l = 100 : 180 == d ? g = 100 : 0 === d && (h = 100);
            b.setAttribute("x1", g + "%");
            b.setAttribute("x2", h + "%");
            b.setAttribute("y1", k + "%");
            b.setAttribute("y2", l + "%")
        }
        for (d = 0; d < c.length; d++) g = document.createElementNS(AmCharts.SVG_NS, "stop"), h = 100 * d / (c.length - 1), 0 === d && (h = 0), g.setAttribute("offset", h + "%"), g.setAttribute("stop-color", c[d]), b.appendChild(g);
        f.parentNode.appendChild(b);
        c = "#";
        AmCharts.baseHref && !AmCharts.isIE && (c = window.location.href + c);
        f.setAttribute("fill", "url(" + c + e + ")");
        a.grad = b
    },
    pattern: function(a, b, c) {
        var d = a.node;
        isNaN(c) && (c = 1);
        var f = a.patternNode;
        f && this.D.remove(f);
        var f = document.createElementNS(AmCharts.SVG_NS, "pattern"),
            e = AmCharts.getUniqueId(),
            g = b;
        b.url && (g = b.url);
        var h = Number(b.width);
        isNaN(h) && (h = 4);
        var k = Number(b.height);
        isNaN(k) && (k = 4);
        h /= c;
        k /= c;
        c = b.x;
        isNaN(c) && (c = 0);
        var l = -Math.random() * Number(b.randomX);
        isNaN(l) || (c = l);
        l = b.y;
        isNaN(l) && (l = 0);
        b = -Math.random() * Number(b.randomY);
        isNaN(b) || (l = b);
        f.setAttribute("id", e);
        f.setAttribute("width", h);
        f.setAttribute("height", k);
        f.setAttribute("patternUnits", "userSpaceOnUse");
        f.setAttribute("xlink:href", g);
        this.D.image(g, 0, 0, h, k, f).translate(c, l);
        g = "#";
        AmCharts.baseHref && !AmCharts.isIE && (g = window.location.href + g);
        d.setAttribute("fill", "url(" + g + e + ")");
        a.patternNode = f;
        d.parentNode.appendChild(f)
    },
    remove: function(a) {
        a.clipPath && this.D.remove(a.clipPath);
        a.grad && this.D.remove(a.grad);
        a.patternNode && this.D.remove(a.patternNode);
        this.D.remove(a.node)
    }
});
AmCharts.AmDSet = AmCharts.Class({
    construct: function(a) {
        this.create("g")
    },
    attr: function(a) {
        this.R.attr(this.node, a)
    },
    move: function(a, b) {
        this.R.move(this.node, a, b)
    }
});
AmCharts.AmLegend = AmCharts.Class({
    construct: function(a) {
        this.createEvents("rollOverMarker", "rollOverItem", "rollOutMarker", "rollOutItem", "showItem", "hideItem", "clickMarker", "rollOverItem", "rollOutItem", "clickLabel");
        this.position = "bottom";
        this.borderColor = this.color = "#000000";
        this.borderAlpha = 0;
        this.markerLabelGap = 5;
        this.verticalGap = 10;
        this.align = "left";
        this.horizontalGap = 0;
        this.spacing = 10;
        this.markerDisabledColor = "#AAB3B3";
        this.markerType = "square";
        this.markerSize = 16;
        this.markerBorderThickness = this.markerBorderAlpha = 1;
        this.marginBottom = this.marginTop = 0;
        this.marginLeft = this.marginRight = 20;
        this.autoMargins = !0;
        this.valueWidth = 50;
        this.switchable = !0;
        this.switchType = "x";
        this.switchColor = "#FFFFFF";
        this.rollOverColor = "#CC0000";
        this.reversedOrder = !1;
        this.labelText = "[[title]]";
        this.valueText = "[[value]]";
        this.useMarkerColorForLabels = !1;
        this.rollOverGraphAlpha = 1;
        this.textClickEnabled = !1;
        this.equalWidths = !0;
        this.dateFormat = "DD-MM-YYYY";
        this.backgroundColor = "#FFFFFF";
        this.backgroundAlpha = 0;
        this.useGraphSettings = !1;
        this.showEntries = !0;
        AmCharts.applyTheme(this, a, "AmLegend")
    },
    setData: function(a) {
        this.legendData = a;
        this.invalidateSize()
    },
    invalidateSize: function() {
        this.destroy();
        this.entries = [];
        this.valueLabels = [];
        (AmCharts.ifArray(this.legendData) || AmCharts.ifArray(this.data)) && this.drawLegend()
    },
    drawLegend: function() {
        var a = this.chart,
            b = this.position,
            c = this.width,
            d = a.divRealWidth,
            f = a.divRealHeight,
            e = this.div,
            g = this.legendData;
        this.data && (g = this.data);
        isNaN(this.fontSize) && (this.fontSize = a.fontSize);
        if ("right" == b || "left" == b) this.maxColumns = 1, this.marginLeft = this.marginRight = 10;
        else if (this.autoMargins) {
            this.marginRight = a.marginRight;
            this.marginLeft = a.marginLeft;
            var h = a.autoMarginOffset;
            "bottom" == b ? (this.marginBottom = h, this.marginTop = 0) : (this.marginTop = h, this.marginBottom = 0)
        }
        c = void 0 !== c ? AmCharts.toCoordinate(c, d) : a.realWidth;
        "outside" == b ? (c = e.offsetWidth, f = e.offsetHeight, e.clientHeight && (c = e.clientWidth, f = e.clientHeight)) : (e.style.width = c + "px", e.className = "amChartsLegend");
        this.divWidth = c;
        this.container = new AmCharts.AmDraw(e, c, f, a);
        this.lx = 0;
        this.ly = 8;
        b = this.markerSize;
        b > this.fontSize && (this.ly = b / 2 - 1);
        0 < b && (this.lx += b + this.markerLabelGap);
        this.titleWidth = 0;
        if (b = this.title) a = AmCharts.text(this.container, b, this.color, a.fontFamily, this.fontSize, "start", !0), a.translate(this.marginLeft, this.marginTop + this.verticalGap + this.ly + 1), a = a.getBBox(), this.titleWidth = a.width + 15, this.titleHeight = a.height + 6;
        this.index = this.maxLabelWidth = 0;
        if (this.showEntries) {
            for (a = 0; a < g.length; a++) this.createEntry(g[a]);
            for (a = this.index = 0; a < g.length; a++) this.createValue(g[a])
        }
        this.arrangeEntries();
        this.updateValues()
    },
    arrangeEntries: function() {
        var a = this.position,
            b = this.marginLeft + this.titleWidth,
            c = this.marginRight,
            d = this.marginTop,
            f = this.marginBottom,
            e = this.horizontalGap,
            g = this.div,
            h = this.divWidth,
            k = this.maxColumns,
            l = this.verticalGap,
            m = this.spacing,
            n = h - c - b,
            p = 0,
            q = 0,
            t = this.container,
            r = t.set();
        this.set = r;
        t = t.set();
        r.push(t);
        var s = this.entries,
            w, v;
        for (v = 0; v < s.length; v++) {
            w = s[v].getBBox();
            var u = w.width;
            u > p && (p = u);
            w = w.height;
            w > q && (q = w)
        }
        var A = u = 0,
            F = e;
        for (v = 0; v < s.length; v++) {
            var y = s[v];
            this.reversedOrder && (y = s[s.length - v - 1]);
            w = y.getBBox();
            var z;
            this.equalWidths ? z = e + A * (p + m + this.markerLabelGap) : (z = F, F = F + w.width + e + m);
            z + w.width > n && 0 < v && 0 !== A && (u++, A = 0, z = e, F = z + w.width + e + m);
            y.translate(z, (q + l) * u);
            A++;
            !isNaN(k) && A >= k && (A = 0, u++);
            t.push(y)
        }
        w = t.getBBox();
        k = w.height + 2 * l - 1;
        "left" == a || "right" == a ? (h = w.width + 2 * e, g.style.width = h + b + c + "px") : h = h - b - c - 1;
        c = AmCharts.polygon(this.container, [0, h, h, 0], [0, 0, k, k], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        r.push(c);
        r.translate(b, d);
        c.toBack();
        b = e;
        if ("top" == a || "bottom" == a || "absolute" == a || "outside" == a)"center" == this.align ? b = e + (h - w.width) / 2 : "right" == this.align && (b = e + h - w.width);
        t.translate(b, l + 1);
        this.titleHeight > k && (k = this.titleHeight);
        a = k + d + f + 1;
        0 > a && (a = 0);
        g.style.height = Math.round(a) + "px"
    },
    createEntry: function(a) {
        if (!1 !== a.visibleInLegend) {
            var b = this.chart,
                c = a.markerType;
            c || (c = this.markerType);
            var d = a.color,
                f = a.alpha;
            a.legendKeyColor && (d = a.legendKeyColor());
            a.legendKeyAlpha && (f = a.legendKeyAlpha());
            var e;
            !0 === a.hidden && (e = d = this.markerDisabledColor);
            var g = a.pattern,
                h = a.customMarker;
            h || (h = this.customMarker);
            var k = this.container,
                l = this.markerSize,
                m = 0,
                n = 0,
                p = l / 2;
            if (this.useGraphSettings) if (m = a.type, "line" == m || "step" == m || "smoothedLine" == m || "ohlc" == m) this.switchType = void 0, g = k.set(), a.hidden || (d = a.lineColor, e = a.bulletBorderColor), n = AmCharts.line(k, [0, 2 * l], [l / 2, l / 2], d, a.lineAlpha, a.lineThickness, a.dashLength), g.push(n), a.bullet && (a.hidden || (d = a.bulletColor), n = AmCharts.bullet(k, a.bullet, a.bulletSize, d, a.bulletAlpha, a.bulletBorderThickness, e, a.bulletBorderAlpha)) && (n.translate(l + 1, l / 2), g.push(n)), p = 0, m = l, n = l / 3;
            else {
                var q;
                a.getGradRotation && (q = a.getGradRotation());
                if (g = this.createMarker("rectangle", a.fillColors, a.fillAlphas, a.lineThickness, d, a.lineAlpha, q, g)) p = l, g.translate(p, l / 2);
                m = l
            } else h ? (b.path && (h = b.path + h), g = k.image(h, 0, 0, l, l)) : (g = this.createMarker(c, d, f, void 0, void 0, void 0, void 0, g)) && g.translate(l / 2, l / 2);
            this.addListeners(g, a);
            k = k.set([g]);
            this.switchable && k.setAttr("cursor", "pointer");
            if (e = this.switchType) q = "x" == e ? this.createX() : this.createV(), q.dItem = a, !0 !== a.hidden ? "x" == e ? q.hide() : q.show() : "x" != e && q.hide(), this.switchable || q.hide(), this.addListeners(q, a), a.legendSwitch = q, k.push(q);
            e = this.color;
            a.showBalloon && this.textClickEnabled && void 0 !== this.selectedColor && (e = this.selectedColor);
            this.useMarkerColorForLabels && (e = d);
            !0 === a.hidden && (e = this.markerDisabledColor);
            d = AmCharts.massReplace(this.labelText, {
                "[[title]]": a.title
            });
            q = this.fontSize;
            g && l <= q && g.translate(p, l / 2 + this.ly - q / 2 + (q + 2 - l) / 2 - n);
            var t;
            d && (d = AmCharts.fixBrakes(d), a.legendTextReal = d, t = AmCharts.text(this.container, d, e, b.fontFamily, q, "start"), t.translate(this.lx + m, this.ly), k.push(t), b = t.getBBox().width, this.maxLabelWidth < b && (this.maxLabelWidth = b));
            this.entries[this.index] = k;
            a.legendEntry = this.entries[this.index];
            a.legendLabel = t;
            this.index++
        }
    },
    addListeners: function(a, b) {
        var c = this;
        a && a.mouseover(function() {
            c.rollOverMarker(b)
        }).mouseout(function() {
                c.rollOutMarker(b)
            }).click(function() {
                c.clickMarker(b)
            })
    },
    rollOverMarker: function(a) {
        this.switchable && this.dispatch("rollOverMarker", a);
        this.dispatch("rollOverItem", a)
    },
    rollOutMarker: function(a) {
        this.switchable && this.dispatch("rollOutMarker", a);
        this.dispatch("rollOutItem", a)
    },
    clickMarker: function(a) {
        this.switchable ? !0 === a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a) : this.textClickEnabled && this.dispatch("clickMarker", a)
    },
    rollOverLabel: function(a) {
        a.hidden || (this.textClickEnabled && a.legendLabel && a.legendLabel.attr({
            fill: this.rollOverColor
        }), this.dispatch("rollOverItem", a))
    },
    rollOutLabel: function(a) {
        if (!a.hidden) {
            if (this.textClickEnabled && a.legendLabel) {
                var b = this.color;
                void 0 !== this.selectedColor && a.showBalloon && (b = this.selectedColor);
                this.useMarkerColorForLabels && (b = a.lineColor, void 0 === b && (b = a.color));
                a.legendLabel.attr({
                    fill: b
                })
            }
            this.dispatch("rollOutItem", a)
        }
    },
    clickLabel: function(a) {
        this.textClickEnabled ? a.hidden || this.dispatch("clickLabel", a) : this.switchable && (!0 === a.hidden ? this.dispatch("showItem", a) : this.dispatch("hideItem", a))
    },
    dispatch: function(a, b) {
        this.fire(a, {
            type: a,
            dataItem: b,
            target: this,
            chart: this.chart
        })
    },
    createValue: function(a) {
        var b = this,
            c = b.fontSize;
        if (!1 !== a.visibleInLegend) {
            var d = b.maxLabelWidth;
            b.equalWidths || (b.valueAlign = "left");
            "left" == b.valueAlign && (d = a.legendEntry.getBBox().width);
            var f = d;
            if (b.valueText) {
                var e = b.color;
                b.useMarkerColorForValues && (e = a.color, a.legendKeyColor && (e = a.legendKeyColor()));
                !0 === a.hidden && (e = b.markerDisabledColor);
                var g = b.valueText,
                    d = d + b.lx + b.markerLabelGap + b.valueWidth,
                    h = "end";
                "left" == b.valueAlign && (d -= b.valueWidth, h = "start");
                e = AmCharts.text(b.container, g, e, b.chart.fontFamily, c, h);
                e.translate(d, b.ly);
                b.entries[b.index].push(e);
                f += b.valueWidth + 2 * b.markerLabelGap;
                e.dItem = a;
                b.valueLabels.push(e)
            }
            b.index++;
            e = b.markerSize;
            e < c + 7 && (e = c + 7, AmCharts.VML && (e += 3));
            c = b.container.rect(b.markerSize, 0, f, e, 0, 0).attr({
                stroke: "none",
                fill: "#ffffff",
                "fill-opacity": 0.005
            });
            c.dItem = a;
            b.entries[b.index - 1].push(c);
            c.mouseover(function() {
                b.rollOverLabel(a)
            }).mouseout(function() {
                    b.rollOutLabel(a)
                }).click(function() {
                    b.clickLabel(a)
                })
        }
    },
    createV: function() {
        var a = this.markerSize;
        return AmCharts.polygon(this.container, [a / 5, a / 2, a - a / 5, a / 2], [a / 3, a - a / 5, a / 5, a / 1.7], this.switchColor)
    },
    createX: function() {
        var a = this.markerSize - 4,
            b = {
                stroke: this.switchColor,
                "stroke-width": 3
            },
            c = this.container,
            d = AmCharts.line(c, [3, a], [3, a]).attr(b),
            a = AmCharts.line(c, [3, a], [a, 3]).attr(b);
        return this.container.set([d, a])
    },
    createMarker: function(a, b, c, d, f, e, g, h) {
        var k = this.markerSize,
            l = this.container;
        f || (f = this.markerBorderColor);
        f || (f = b);
        isNaN(d) && (d = this.markerBorderThickness);
        isNaN(e) && (e = this.markerBorderAlpha);
        return AmCharts.bullet(l, a, k, b, c, d, f, e, k, g, h)
    },
    validateNow: function() {
        this.invalidateSize()
    },
    updateValues: function() {
        var a = this.valueLabels,
            b = this.chart,
            c, d = this.data;
        for (c = 0; c < a.length; c++) {
            var f = a[c],
                e = f.dItem,
                g = " ";
            if (d) e.value ? f.text(e.value) : f.text("");
            else {
                if (void 0 !== e.type) {
                    var h = e.currentDataItem,
                        k = this.periodValueText;
                    e.legendPeriodValueText && (k = e.legendPeriodValueText);
                    h ? (g = this.valueText, e.legendValueText && (g = e.legendValueText), g = b.formatString(g, h)) : k && (g = b.formatPeriodString(k, e))
                } else g = b.formatString(this.valueText, e);
                (h = e.legendLabel) && h.text(e.legendTextReal);
                f.text(g)
            }
        }
    },
    renderFix: function() {
        if (!AmCharts.VML) {
            var a = this.container;
            a && a.renderFix()
        }
    },
    destroy: function() {
        this.div.innerHTML = "";
        AmCharts.remove(this.set)
    }
});
AmCharts.formatMilliseconds = function(a, b) {
    if (-1 != a.indexOf("fff")) {
        var c = b.getMilliseconds(),
            d = String(c);
        10 > c && (d = "00" + c);
        10 <= c && 100 > c && (d = "0" + c);
        a = a.replace(/fff/g, d)
    }
    return a
};
AmCharts.extractPeriod = function(a) {
    var b = AmCharts.stripNumbers(a),
        c = 1;
    b != a && (c = Number(a.slice(0, a.indexOf(b))));
    return {
        period: b,
        count: c
    }
};
AmCharts.resetDateToMin = function(a, b, c, d) {
    void 0 === d && (d = 1);
    var f, e, g, h, k, l, m;
    AmCharts.useUTC ? (f = a.getUTCFullYear(), e = a.getUTCMonth(), g = a.getUTCDate(), h = a.getUTCHours(), k = a.getUTCMinutes(), l = a.getUTCSeconds(), m = a.getUTCMilliseconds(), a = a.getUTCDay()) : (f = a.getFullYear(), e = a.getMonth(), g = a.getDate(), h = a.getHours(), k = a.getMinutes(), l = a.getSeconds(), m = a.getMilliseconds(), a = a.getDay());
    switch (b) {
        case "YYYY":
            f = Math.floor(f / c) * c;
            e = 0;
            g = 1;
            m = l = k = h = 0;
            break;
        case "MM":
            e = Math.floor(e / c) * c;
            g = 1;
            m = l = k = h = 0;
            break;
        case "WW":
            0 === a && 0 < d && (a = 7);
            g = g - a + d;
            m = l = k = h = 0;
            break;
        case "DD":
            m = l = k = h = 0;
            break;
        case "hh":
            h = Math.floor(h / c) * c;
            m = l = k = 0;
            break;
        case "mm":
            k = Math.floor(k / c) * c;
            m = l = 0;
            break;
        case "ss":
            l = Math.floor(l / c) * c;
            m = 0;
            break;
        case "fff":
            m = Math.floor(m / c) * c
    }
    AmCharts.useUTC ? (a = new Date, a.setUTCFullYear(f, e, g), a.setUTCHours(h, k, l, m)) : a = new Date(f, e, g, h, k, l, m);
    return a
};
AmCharts.getPeriodDuration = function(a, b) {
    void 0 === b && (b = 1);
    var c;
    switch (a) {
        case "YYYY":
            c = 316224E5;
            break;
        case "MM":
            c = 26784E5;
            break;
        case "WW":
            c = 6048E5;
            break;
        case "DD":
            c = 864E5;
            break;
        case "hh":
            c = 36E5;
            break;
        case "mm":
            c = 6E4;
            break;
        case "ss":
            c = 1E3;
            break;
        case "fff":
            c = 1
    }
    return c * b
};
AmCharts.intervals = {
    s: {
        nextInterval: "ss",
        contains: 1E3
    },
    ss: {
        nextInterval: "mm",
        contains: 60,
        count: 0
    },
    mm: {
        nextInterval: "hh",
        contains: 60,
        count: 1
    },
    hh: {
        nextInterval: "DD",
        contains: 24,
        count: 2
    },
    DD: {
        nextInterval: "",
        contains: Infinity,
        count: 3
    }
};
AmCharts.getMaxInterval = function(a, b) {
    var c = AmCharts.intervals;
    return a >= c[b].contains ? (a = Math.round(a / c[b].contains), b = c[b].nextInterval, AmCharts.getMaxInterval(a, b)) : "ss" == b ? c[b].nextInterval : b
};
AmCharts.dayNames = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");
AmCharts.shortDayNames = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
AmCharts.monthNames = "January February March April May June July August September October November December".split(" ");
AmCharts.shortMonthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
AmCharts.getWeekNumber = function(a) {
    a = new Date(a);
    a.setHours(0, 0, 0);
    a.setDate(a.getDate() + 4 - (a.getDay() || 7));
    var b = new Date(a.getFullYear(), 0, 1);
    return Math.ceil(((a - b) / 864E5 + 1) / 7)
};
AmCharts.stringToDate = function(a, b) {
    var c = {},
        d = [{
            pattern: "YYYY",
            period: "year"
        }, {
            pattern: "YY",
            period: "year"
        }, {
            pattern: "MM",
            period: "month"
        }, {
            pattern: "M",
            period: "month"
        }, {
            pattern: "DD",
            period: "date"
        }, {
            pattern: "D",
            period: "date"
        }, {
            pattern: "JJ",
            period: "hours"
        }, {
            pattern: "J",
            period: "hours"
        }, {
            pattern: "HH",
            period: "hours"
        }, {
            pattern: "H",
            period: "hours"
        }, {
            pattern: "KK",
            period: "hours"
        }, {
            pattern: "K",
            period: "hours"
        }, {
            pattern: "LL",
            period: "hours"
        }, {
            pattern: "L",
            period: "hours"
        }, {
            pattern: "NN",
            period: "minutes"
        }, {
            pattern: "N",
            period: "minutes"
        }, {
            pattern: "SS",
            period: "seconds"
        }, {
            pattern: "S",
            period: "seconds"
        }, {
            pattern: "QQQ",
            period: "milliseconds"
        }, {
            pattern: "QQ",
            period: "milliseconds"
        }, {
            pattern: "Q",
            period: "milliseconds"
        }],
        f = !0,
        e = b.indexOf("AA"); - 1 != e && (a.substr(e, 2), "pm" == a.toLowerCase && (f = !1));
    var e = b,
        g, h, k;
    for (k = 0; k < d.length; k++) h = d[k].period, c[h] = 0, "date" == h && (c[h] = 1);
    for (k = 0; k < d.length; k++) if (g = d[k].pattern, h = d[k].period, -1 != b.indexOf(g)) {
        var l = AmCharts.getFromDateString(g, a, e);
        b = b.replace(g, "");
        if ("KK" == g || "K" == g || "LL" == g || "L" == g) f || (l += 12);
        c[h] = l
    }
    return new Date(c.year, c.month, c.date, c.hours, c.minutes, c.seconds, c.milliseconds)
};
AmCharts.getFromDateString = function(a, b, c) {
    c = c.indexOf(a);
    b = b.substr(c, a.length);
    "0" == b.charAt(0) && (b = b.substr(1, b.length - 1));
    b = Number(b);
    isNaN(b) && (b = 0); - 1 != a.indexOf("M") && b--;
    return b
};
AmCharts.formatDate = function(a, b) {
    var c, d, f, e, g, h, k, l, m = AmCharts.getWeekNumber(a);
    AmCharts.useUTC ? (c = a.getUTCFullYear(), d = a.getUTCMonth(), f = a.getUTCDate(), e = a.getUTCDay(), g = a.getUTCHours(), h = a.getUTCMinutes(), k = a.getUTCSeconds(), l = a.getUTCMilliseconds()) : (c = a.getFullYear(), d = a.getMonth(), f = a.getDate(), e = a.getDay(), g = a.getHours(), h = a.getMinutes(), k = a.getSeconds(), l = a.getMilliseconds());
    var n = String(c).substr(2, 2),
        p = d + 1;
    9 > d && (p = "0" + p);
    var q = f;
    10 > f && (q = "0" + f);
    var t = "0" + e;
    b = b.replace(/W/g, m);
    m = g;
    24 == m && (m = 0);
    var r = m;
    10 > r && (r = "0" + r);
    b = b.replace(/JJ/g, r);
    b = b.replace(/J/g, m);
    m = g;
    0 === m && (m = 24);
    r = m;
    10 > r && (r = "0" + r);
    b = b.replace(/HH/g, r);
    b = b.replace(/H/g, m);
    m = g;
    11 < m && (m -= 12);
    r = m;
    10 > r && (r = "0" + r);
    b = b.replace(/KK/g, r);
    b = b.replace(/K/g, m);
    m = g;
    0 === m && (m = 12);
    12 < m && (m -= 12);
    r = m;
    10 > r && (r = "0" + r);
    b = b.replace(/LL/g, r);
    b = b.replace(/L/g, m);
    m = h;
    10 > m && (m = "0" + m);
    b = b.replace(/NN/g, m);
    b = b.replace(/N/g, h);
    h = k;
    10 > h && (h = "0" + h);
    b = b.replace(/SS/g, h);
    b = b.replace(/S/g, k);
    k = l;
    10 > k && (k = "00" + k);
    100 > k && (k = "0" + k);
    h = l;
    10 > h && (h = "00" + h);
    b = b.replace(/QQQ/g, k);
    b = b.replace(/QQ/g, h);
    b = b.replace(/Q/g, l);
    b = 12 > g ? b.replace(/A/g, "am") : b.replace(/A/g, "pm");
    b = b.replace(/YYYY/g, "@IIII@");
    b = b.replace(/YY/g, "@II@");
    b = b.replace(/MMMM/g, "@XXXX@");
    b = b.replace(/MMM/g, "@XXX@");
    b = b.replace(/MM/g, "@XX@");
    b = b.replace(/M/g, "@X@");
    b = b.replace(/DD/g, "@RR@");
    b = b.replace(/D/g, "@R@");
    b = b.replace(/EEEE/g, "@PPPP@");
    b = b.replace(/EEE/g, "@PPP@");
    b = b.replace(/EE/g, "@PP@");
    b = b.replace(/E/g, "@P@");
    b = b.replace(/@IIII@/g, c);
    b = b.replace(/@II@/g, n);
    b = b.replace(/@XXXX@/g, AmCharts.monthNames[d]);
    b = b.replace(/@XXX@/g, AmCharts.shortMonthNames[d]);
    b = b.replace(/@XX@/g, p);
    b = b.replace(/@X@/g, d + 1);
    b = b.replace(/@RR@/g, q);
    b = b.replace(/@R@/g, f);
    b = b.replace(/@PPPP@/g, AmCharts.dayNames[e]);
    b = b.replace(/@PPP@/g, AmCharts.shortDayNames[e]);
    b = b.replace(/@PP@/g, t);
    return b = b.replace(/@P@/g, e)
};
AmCharts.changeDate = function(a, b, c, d, f) {
    var e = -1;
    void 0 === d && (d = !0);
    void 0 === f && (f = !1);
    !0 === d && (e = 1);
    switch (b) {
        case "YYYY":
            a.setFullYear(a.getFullYear() + c * e);
            d || f || a.setDate(a.getDate() + 1);
            break;
        case "MM":
            b = a.getMonth();
            a.setMonth(a.getMonth() + c * e);
            a.getMonth() > b + c * e && a.setDate(a.getDate() - 1);
            d || f || a.setDate(a.getDate() + 1);
            break;
        case "DD":
            a.setDate(a.getDate() + c * e);
            break;
        case "WW":
            a.setDate(a.getDate() + c * e * 7);
            break;
        case "hh":
            a.setHours(a.getHours() + c * e);
            break;
        case "mm":
            a.setMinutes(a.getMinutes() + c * e);
            break;
        case "ss":
            a.setSeconds(a.getSeconds() + c * e);
            break;
        case "fff":
            a.setMilliseconds(a.getMilliseconds() + c * e)
    }
    return a
};