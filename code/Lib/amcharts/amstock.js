AmCharts.AmStockChart = AmCharts.Class({
    construct: function(a) {
        this.version = "3.3.2";
        this.theme = a;
        this.createEvents("zoomed", "rollOverStockEvent", "rollOutStockEvent", "clickStockEvent", "panelRemoved", "dataUpdated", "init", "rendered", "drawn");
        this.colors = "#FF6600 #FCD202 #B0DE09 #0D8ECF #2A0CD0 #CD0D74 #CC0000 #00CC00 #0000CC #DDDDDD #999999 #333333 #990000".split(" ");
        this.firstDayOfWeek = 1;
        this.glueToTheEnd = !1;
        this.dataSetCounter = -1;
        this.zoomOutOnDataSetChange = !1;
        this.panels = [];
        this.dataSets = [];
        this.chartCursors = [];
        this.comparedDataSets = [];
        this.categoryAxesSettings = new AmCharts.CategoryAxesSettings(a);
        this.valueAxesSettings = new AmCharts.ValueAxesSettings(a);
        this.panelsSettings = new AmCharts.PanelsSettings(a);
        this.chartScrollbarSettings = new AmCharts.ChartScrollbarSettings(a);
        this.chartCursorSettings = new AmCharts.ChartCursorSettings(a);
        this.stockEventsSettings = new AmCharts.StockEventsSettings(a);
        this.legendSettings = new AmCharts.LegendSettings(a);
        this.balloon = new AmCharts.AmBalloon(a);
        this.previousEndDate = new Date(0);
        this.previousStartDate = new Date(0);
        this.dataSetCount = this.graphCount = 0;
        this.chartCreated = !1;
        AmCharts.applyTheme(this, a, "AmStockChart")
    },
    write: function(a) {
        var b = this.theme,
            c = this.exportConfig;
        c && AmCharts.AmExport && !this.AmExport && (this.AmExport = new AmCharts.AmExport(this, c));
        this.chartRendered = !1;
        a = "object" != typeof a ? document.getElementById(a) : a;
        this.zoomOutOnDataSetChange && (this.endDate = this.startDate = void 0);
        this.categoryAxesSettings = AmCharts.processObject(this.categoryAxesSettings, AmCharts.CategoryAxesSettings, b);
        this.valueAxesSettings = AmCharts.processObject(this.valueAxesSettings, AmCharts.ValueAxesSettings, b);
        this.chartCursorSettings = AmCharts.processObject(this.chartCursorSettings, AmCharts.ChartCursorSettings, b);
        this.chartScrollbarSettings = AmCharts.processObject(this.chartScrollbarSettings, AmCharts.ChartScrollbarSettings, b);
        this.legendSettings = AmCharts.processObject(this.legendSettings, AmCharts.LegendSettings, b);
        this.panelsSettings = AmCharts.processObject(this.panelsSettings, AmCharts.PanelsSettings, b);
        this.stockEventsSettings = AmCharts.processObject(this.stockEventsSettings, AmCharts.StockEventsSettings, b);
        this.dataSetSelector && (this.dataSetSelector = AmCharts.processObject(this.dataSetSelector, AmCharts.DataSetSelector, b));
        this.periodSelector && (this.periodSelector = AmCharts.processObject(this.periodSelector, AmCharts.PeriodSelector, b));
        a.innerHTML = "";
        this.div = a;
        this.measure();
        this.createLayout();
        this.updateDataSets();
        this.addDataSetSelector();
        this.addPeriodSelector();
        this.addPanels();
        this.updatePanels();
        this.addChartScrollbar();
        this.updateData();
        this.skipDefault || this.setDefaultPeriod()
    },
    setDefaultPeriod: function(a) {
        var b = this.periodSelector;
        b && (this.animationPlayed = !1, b.setDefaultPeriod(a))
    },
    validateSize: function() {
        var a, b = this.panels;
        this.measurePanels();
        for (a = 0; a < b.length; a++) panel = b[a], panel.invalidateSize()
    },
    updateDataSets: function() {
        var a = this.mainDataSet,
            b = this.dataSets,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c],
                d = AmCharts.processObject(d, AmCharts.DataSet);
            b[c] = d;
            d.id || (this.dataSetCount++, d.id = "ds" + this.dataSetCount);
            void 0 === d.color && (d.color = this.colors.length - 1 > c ? this.colors[c] : AmCharts.randomColor())
        }!a && AmCharts.ifArray(b) && (this.mainDataSet = this.dataSets[0])
    },
    updateEvents: function(a) {
        AmCharts.ifArray(a.stockEvents) && AmCharts.parseEvents(a, this.panels, this.stockEventsSettings, this.firstDayOfWeek, this, this.dataDateFormat)
    },
    getLastDate: function(a) {
        var b = this.dataDateFormat;
        a = a instanceof Date ? new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds()) : b ? AmCharts.stringToDate(a, b) : new Date(a);
        return new Date(AmCharts.changeDate(a, this.categoryAxesSettings.minPeriod, 1, !0).getTime() - 1)
    },
    getFirstDate: function(a) {
        var b = this.dataDateFormat;
        a = a instanceof Date ? new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds()) : b ? AmCharts.stringToDate(a, b) : new Date(a);
        return new Date(AmCharts.resetDateToMin(a, this.categoryAxesSettings.minPeriod, 1, this.firstDayOfWeek))
    },
    updateData: function() {
        var a = this.mainDataSet;
        if (a) {
            var b = this.categoryAxesSettings; - 1 == AmCharts.getItemIndex(b.minPeriod, b.groupToPeriods) && b.groupToPeriods.unshift(b.minPeriod);
            var c = a.dataProvider;
            if (AmCharts.ifArray(c)) {
                var d = a.categoryField;
                this.firstDate = this.getFirstDate(c[0][d]);
                this.lastDate = this.getLastDate(c[c.length - 1][d]);
                this.periodSelector && this.periodSelector.setRanges(this.firstDate, this.lastDate);
                a.dataParsed || (AmCharts.parseStockData(a, b.minPeriod, b.groupToPeriods, this.firstDayOfWeek, this.dataDateFormat), a.dataParsed = !0);
                this.updateComparingData();
                this.updateEvents(a)
            } else this.lastDate = this.firstDate = void 0;
            this.glueToTheEnd && this.startDate && this.endDate && this.lastDate && (AmCharts.getPeriodDuration(b.minPeriod), this.startDate = new Date(this.startDate.getTime() + (this.lastDate.getTime() - this.endDate.getTime())), this.endDate = this.lastDate, this.updateScrollbar = !0);
            this.updatePanelsWithNewData()
        }
        a = {
            type: "dataUpdated",
            chart: this
        };
        this.fire(a.type, a)
    },
    updateComparingData: function() {
        var a = this.comparedDataSets,
            b = this.categoryAxesSettings,
            c;
        for (c = 0; c < a.length; c++) {
            var d = a[c];
            d.dataParsed || (AmCharts.parseStockData(d, b.minPeriod, b.groupToPeriods, this.firstDayOfWeek, this.dataDateFormat), d.dataParsed = !0);
            this.updateEvents(d)
        }
    },
    createLayout: function() {
        var a = this.div,
            b, c, d = document.createElement("div");
        d.style.position = "relative";
        this.containerDiv = d;
        a.appendChild(d);
        if (a = this.periodSelector) b = a.position;
        if (a = this.dataSetSelector) c = a.position;
        if ("left" == b || "left" == c) a = document.createElement("div"), a.style.cssFloat = "left", a.style.styleFloat = "left", a.style.width = "0px", a.style.position = "absolute", d.appendChild(a), this.leftContainer = a;
        if ("right" == b || "right" == c) b = document.createElement("div"), b.style.cssFloat = "right", b.style.styleFloat = "right", b.style.width = "0px", d.appendChild(b), this.rightContainer = b;
        b = document.createElement("div");
        d.appendChild(b);
        this.centerContainer = b;
        d = document.createElement("div");
        b.appendChild(d);
        this.panelsContainer = d
    },
    addPanels: function() {
        this.measurePanels();
        for (var a = this.panels, b = 0; b < a.length; b++) {
            var c = a[b],
                c = AmCharts.processObject(c, AmCharts.StockPanel, this.theme);
            a[b] = c;
            this.addStockPanel(c, b)
        }
        this.panelsAdded = !0
    },
    measurePanels: function() {
        this.measure();
        var a = this.chartScrollbarSettings,
            b = this.divRealHeight,
            c = this.panelsSettings.panelSpacing;
        a.enabled && (b -= a.height);
        (a = this.periodSelector) && !a.vertical && (a = a.offsetHeight, b -= a + c);
        (a = this.dataSetSelector) && !a.vertical && (a = a.offsetHeight, b -= a + c);
        a = this.panels;
        this.panelsContainer.style.height = b + "px";
        this.chartCursors = [];
        var d = 0,
            e, g;
        for (e = 0; e < a.length; e++) {
            g = a[e];
            var f = g.percentHeight;
            isNaN(f) && (f = 100 / a.length, g.percentHeight = f);
            d += f
        }
        this.panelsHeight = Math.max(b - c * (a.length - 1), 0);
        for (e = 0; e < a.length; e++) g = a[e], g.percentHeight = g.percentHeight / d * 100, g.panelBox && (g.panelBox.style.height = Math.round(g.percentHeight * this.panelsHeight / 100) + "px")
    },
    addStockPanel: function(a, b) {
        var c = this.panelsSettings,
            d = document.createElement("div");
        d.className = "amChartsPanel";
        0 < b && !this.panels[b - 1].showCategoryAxis && (d.style.marginTop = c.panelSpacing + "px");
        a.panelBox = d;
        a.stockChart = this;
        a.id || (a.id = "stockPanel" + b);
        a.pathToImages = this.pathToImages;
        d.style.height = Math.round(a.percentHeight * this.panelsHeight / 100) + "px";
        d.style.width = "100%";
        this.panelsContainer.appendChild(d);
        0 < c.backgroundAlpha && (d.style.backgroundColor = c.backgroundColor);
        if (d = a.stockLegend) d.container = void 0, d.title = a.title, d.marginLeft = c.marginLeft, d.marginRight = c.marginRight, d.verticalGap = 3, d.position = "top", AmCharts.copyProperties(this.legendSettings, d), a.addLegend(d);
        a.zoomOutText = "";
        a.removeChartCursor();
        this.addCursor(a)
    },
    enableCursors: function(a) {
        var b = this.chartCursors,
            c;
        for (c = 0; c < b.length; c++) b[c].enabled = a
    },
    updatePanels: function() {
        var a = this.panels,
            b;
        for (b = 0; b < a.length; b++) this.updatePanel(a[b]);
        this.mainDataSet && this.updateGraphs();
        this.currentPeriod = void 0
    },
    updatePanel: function(a) {
        a.seriesIdField = "amCategoryIdField";
        a.dataProvider = [];
        a.chartData = [];
        a.graphs = [];
        var b = a.categoryAxis,
            c = this.categoryAxesSettings;
        AmCharts.copyProperties(this.panelsSettings, a);
        AmCharts.copyProperties(c, b);
        b.parseDates = !0;
        a.zoomOutOnDataUpdate = !1;
        a.showCategoryAxis ? "top" == b.position ? a.marginTop = c.axisHeight : a.marginBottom = c.axisHeight : (a.categoryAxis.labelsEnabled = !1, a.chartCursor && (a.chartCursor.categoryBalloonEnabled = !1));
        var c = a.valueAxes,
            d = c.length,
            e;
        0 === d && (e = new AmCharts.ValueAxis(this.theme), a.addValueAxis(e));
        b = new AmCharts.AmBalloon(this.theme);
        AmCharts.copyProperties(this.balloon, b);
        a.balloon = b;
        c = a.valueAxes;
        d = c.length;
        for (b = 0; b < d; b++) e = c[b], AmCharts.copyProperties(this.valueAxesSettings, e);
        a.listenersAdded = !1;
        a.write(a.panelBox)
    },
    zoom: function(a, b) {
        this.zoomChart(a, b)
    },
    zoomOut: function() {
        this.zoomChart(this.firstDate, this.lastDate)
    },
    updatePanelsWithNewData: function() {
        var a = this.mainDataSet;
        if (a) {
            var b = this.panels;
            this.currentPeriod = void 0;
            var c;
            for (c = 0; c < b.length; c++) {
                var d = b[c];
                d.categoryField = a.categoryField;
                0 === a.dataProvider.length && (d.dataProvider = [])
            }
            if (b = this.scrollbarChart) {
                c = this.categoryAxesSettings;
                d = c.minPeriod;
                b.categoryField = a.categoryField;
                if (0 < a.dataProvider.length) {
                    var e = this.chartScrollbarSettings.usePeriod;
                    b.dataProvider = e ? a.agregatedDataProviders[e] : a.agregatedDataProviders[d]
                } else b.dataProvider = [];
                e = b.categoryAxis;
                e.minPeriod = d;
                e.firstDayOfWeek = this.firstDayOfWeek;
                e.equalSpacing = c.equalSpacing;
                b.validateData()
            }
            0 < a.dataProvider.length && this.zoomChart(this.startDate, this.endDate)
        }
        this.panelDataInvalidated = !1
    },
    addChartScrollbar: function() {
        var a = this.chartScrollbarSettings,
            b = this.scrollbarChart;
        b && (b.clear(), b.destroy());
        if (a.enabled) {
            var c = this.panelsSettings,
                d = this.categoryAxesSettings,
                b = new AmCharts.AmSerialChart(this.theme);
            b.pathToImages = this.pathToImages;
            b.autoMargins = !1;
            this.scrollbarChart = b;
            b.id = "scrollbarChart";
            b.scrollbarOnly = !0;
            b.zoomOutText = "";
            b.panEventsEnabled = this.panelsSettings.panEventsEnabled;
            b.marginLeft = c.marginLeft;
            b.marginRight = c.marginRight;
            b.marginTop = 0;
            b.marginBottom = 0;
            var c = d.dateFormats,
                e = b.categoryAxis;
            e.boldPeriodBeginning = d.boldPeriodBeginning;
            c && (e.dateFormats = d.dateFormats);
            e.labelsEnabled = !1;
            e.parseDates = !0;
            d = a.graph;
            if (AmCharts.isString(d)) {
                c = this.panels;
                for (e = 0; e < c.length; e++) {
                    var g = AmCharts.getObjById(c[e].stockGraphs, a.graph);
                    g && (d = g)
                }
                a.graph = d
            }
            var f;
            d && (f = new AmCharts.AmGraph(this.theme), f.valueField = d.valueField, f.periodValue = d.periodValue, f.type = d.type, f.connect = d.connect, b.addGraph(f));
            d = new AmCharts.ChartScrollbar(this.theme);
            b.addChartScrollbar(d);
            AmCharts.copyProperties(a, d);
            d.scrollbarHeight = a.height;
            d.graph = f;
            this.removeListener(d, "zoomed", this.handleScrollbarZoom);
            this.listenTo(d, "zoomed", this.handleScrollbarZoom);
            f = document.createElement("div");
            f.style.height = a.height + "px";
            d = this.periodSelectorContainer;
            c = this.periodSelector;
            e = this.centerContainer;
            "bottom" == a.position ? c ? "bottom" == c.position ? e.insertBefore(f, d) : e.appendChild(f) : e.appendChild(f) : c ? "top" == c.position ? e.insertBefore(f, d.nextSibling) : e.insertBefore(f, e.firstChild) : e.insertBefore(f, e.firstChild);
            b.write(f)
        }
    },
    handleScrollbarZoom: function(a) {
        if (this.skipScrollbarEvent) this.skipScrollbarEvent = !1;
        else {
            var b = a.endDate,
                c = {};
            c.startDate = a.startDate;
            c.endDate = b;
            this.updateScrollbar = !1;
            this.handleZoom(c)
        }
    },
    addPeriodSelector: function() {
        var a = this.periodSelector;
        if (a) {
            var b = this.categoryAxesSettings.minPeriod;
            a.minDuration = AmCharts.getPeriodDuration(b);
            a.minPeriod = b;
            a.chart = this;
            var c = this.dataSetSelector,
                d, b = this.dssContainer;
            c && (d = c.position);
            var c = this.panelsSettings.panelSpacing,
                e = document.createElement("div");
            this.periodSelectorContainer = e;
            var g = this.leftContainer,
                f = this.rightContainer,
                h = this.centerContainer,
                k = this.panelsContainer,
                m = a.width + 2 * c + "px";
            switch (a.position) {
                case "left":
                    g.style.width = a.width + "px";
                    g.appendChild(e);
                    h.style.paddingLeft = m;
                    break;
                case "right":
                    h.style.marginRight = m;
                    f.appendChild(e);
                    f.style.width = a.width + "px";
                    break;
                case "top":
                    k.style.clear = "both";
                    h.insertBefore(e, k);
                    e.style.paddingBottom = c + "px";
                    e.style.overflow = "hidden";
                    break;
                case "bottom":
                    e.style.marginTop = c + "px", "bottom" == d ? h.insertBefore(e, b) : h.appendChild(e)
            }
            this.removeListener(a, "changed", this.handlePeriodSelectorZoom);
            this.listenTo(a, "changed", this.handlePeriodSelectorZoom);
            a.write(e)
        }
    },
    addDataSetSelector: function() {
        var a = this.dataSetSelector;
        if (a) {
            a.chart = this;
            a.dataProvider = this.dataSets;
            var b = a.position,
                c = this.panelsSettings.panelSpacing,
                d = document.createElement("div");
            this.dssContainer = d;
            var e = this.leftContainer,
                g = this.rightContainer,
                f = this.centerContainer,
                h = this.panelsContainer,
                c = a.width + 2 * c + "px";
            switch (b) {
                case "left":
                    e.style.width = a.width + "px";
                    e.appendChild(d);
                    f.style.paddingLeft = c;
                    break;
                case "right":
                    f.style.marginRight = c;
                    g.appendChild(d);
                    g.style.width = a.width + "px";
                    break;
                case "top":
                    h.style.clear = "both";
                    f.insertBefore(d, h);
                    d.style.overflow = "hidden";
                    break;
                case "bottom":
                    f.appendChild(d)
            }
            a.write(d)
        }
    },
    handlePeriodSelectorZoom: function(a) {
        var b = this.scrollbarChart;
        b && (b.updateScrollbar = !0);
        a.predefinedPeriod ? (this.predefinedStart = a.startDate, this.predefinedEnd = a.endDate) : this.predefinedEnd = this.predefinedStart = null;
        this.zoomChart(a.startDate, a.endDate)
    },
    addCursor: function(a) {
        var b = this.chartCursorSettings;
        if (b.enabled) {
            var c = new AmCharts.ChartCursor(this.theme);
            AmCharts.copyProperties(b, c);
            a.removeChartCursor();
            a.addChartCursor(c);
            this.removeListener(c, "changed", this.handleCursorChange);
            this.removeListener(c, "onHideCursor", this.hideChartCursor);
            this.removeListener(c, "zoomed", this.handleCursorZoom);
            this.listenTo(c, "changed", this.handleCursorChange);
            this.listenTo(c, "onHideCursor", this.hideChartCursor);
            this.listenTo(c, "zoomed", this.handleCursorZoom);
            this.chartCursors.push(c)
        }
    },
    hideChartCursor: function() {
        var a = this.chartCursors,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.hideCursor(!1);
            (c = c.chart) && c.updateLegendValues()
        }
    },
    handleCursorZoom: function(a) {
        var b = this.scrollbarChart;
        b && (b.updateScrollbar = !0);
        var b = {},
            c;
        if (this.categoryAxesSettings.equalSpacing) {
            var d = this.mainDataSet.categoryField,
                e = this.mainDataSet.agregatedDataProviders[this.currentPeriod];
            c = new Date(e[a.start][d]);
            a = new Date(e[a.end][d])
        } else c = new Date(a.start), a = new Date(a.end);
        b.startDate = c;
        b.endDate = a;
        this.handleZoom(b)
    },
    handleZoom: function(a) {
        this.zoomChart(a.startDate, a.endDate)
    },
    zoomChart: function(a, b) {
        var c = this,
            d = c.firstDate,
            e = c.lastDate,
            g = c.currentPeriod,
            f = c.categoryAxesSettings,
            h = f.minPeriod,
            k = c.panelsSettings,
            m = c.periodSelector,
            q = c.panels,
            y = c.comparedGraphs,
            s = c.scrollbarChart,
            x = c.firstDayOfWeek;
        if (d && e) {
            a || (a = d);
            b || (b = e);
            if (g) {
                var t = AmCharts.extractPeriod(g);
                a.getTime() == b.getTime() && t != h && (b = AmCharts.changeDate(b, t.period, t.count), b.setTime(b.getTime() - 1))
            }
            a.getTime() < d.getTime() && (a = d);
            a.getTime() > e.getTime() && (a = e);
            b.getTime() < d.getTime() && (b = d);
            b.getTime() > e.getTime() && (b = e);
            f = AmCharts.getItemIndex(h, f.groupToPeriods);
            e = g;
            g = c.choosePeriod(f, a, b);
            c.currentPeriod = g;
            f = AmCharts.extractPeriod(g);
            AmCharts.getPeriodDuration(f.period, f.count);
            AmCharts.getPeriodDuration(h);
            1 > b.getTime() - a.getTime() && (a = new Date(b.getTime() - 1));
            h = new Date(a);
            h.getTime() == d.getTime() && (h = AmCharts.resetDateToMin(a, f.period, f.count, x));
            for (d = 0; d < q.length; d++) {
                t = q[d];
                if (g != e) {
                    var n;
                    for (n = 0; n < y.length; n++) {
                        var w = y[n].graph;
                        w.dataProvider = w.dataSet.agregatedDataProviders[g]
                    }
                    n = t.categoryAxis;
                    n.firstDayOfWeek = x;
                    n.minPeriod = g;
                    t.dataProvider = c.mainDataSet.agregatedDataProviders[g];
                    if (n = t.chartCursor) n.categoryBalloonDateFormat = c.chartCursorSettings.categoryBalloonDateFormat(f.period), t.showCategoryAxis || (n.categoryBalloonEnabled = !1);
                    t.startTime = h.getTime();
                    t.endTime = b.getTime();
                    t.validateData(!0)
                }
                n = !1;
                t.chartCursor && t.chartCursor.panning && (n = !0);
                n || (t.startTime = void 0, t.endTime = void 0, t.zoomToDates(h, b));
                0 < k.startDuration && c.animationPlayed ? (t.startDuration = 0, t.animateAgain()) : 0 < k.startDuration && t.animateAgain()
            }
            c.animationPlayed = !0;
            AmCharts.extractPeriod(g);
            k = new Date(b);
            s && c.updateScrollbar && (s.zoomToDates(a, k), c.skipScrollbarEvent = !0, setTimeout(function() {
                c.resetSkip.call(c)
            }, 100));
            c.updateScrollbar = !0;
            c.startDate = a;
            c.endDate = b;
            m && m.zoom(a, b);
            if (a.getTime() != c.previousStartDate.getTime() || b.getTime() != c.previousEndDate.getTime()) m = {
                type: "zoomed"
            }, m.startDate = a, m.endDate = b, m.chart = c, m.period = g, c.fire(m.type, m), c.previousStartDate = new Date(a), c.previousEndDate = new Date(b)
        }
        c.eventsHidden && c.showHideEvents(!1);
        c.chartCreated || (g = "init", c.fire(g, {
            type: g,
            chart: c
        }));
        c.chartRendered || (g = "rendered", c.fire(g, {
            type: g,
            chart: c
        }), c.chartRendered = !0);
        g = "drawn";
        c.fire(g, {
            type: g,
            chart: c
        });
        c.chartCreated = !0;
        c.animationPlayed = !0
    },
    resetSkip: function() {
        this.skipScrollbarEvent = !1
    },
    updateGraphs: function() {
        this.getSelections();
        if (0 < this.dataSets.length) {
            var a = this.panels;
            this.comparedGraphs = [];
            var b;
            for (b = 0; b < a.length; b++) {
                var c = a[b],
                    d = c.valueAxes,
                    e;
                for (e = 0; e < d.length; e++) {
                    var g = d[e];
                    g.prevLog && (g.logarithmic = g.prevLog);
                    g.recalculateToPercents = "always" == c.recalculateToPercents ? !0 : !1
                }
                d = this.mainDataSet;
                e = this.comparedDataSets;
                g = c.stockGraphs;
                c.graphs = [];
                var f;
                for (f = 0; f < g.length; f++) {
                    var h = g[f],
                        h = AmCharts.processObject(h, AmCharts.StockGraph, this.theme);
                    g[f] = h;
                    if (!h.title || h.resetTitleOnDataSetChange) h.title = d.title, h.resetTitleOnDataSetChange = !0;
                    h.useDataSetColors && (h.lineColor = d.color, h.fillColors = void 0, h.bulletColor = void 0);
                    c.addGraph(h);
                    var k = !1;
                    "always" == c.recalculateToPercents && (k = !0);
                    var m = c.stockLegend,
                        q, y, s, x;
                    m && (m = AmCharts.processObject(m, AmCharts.StockLegend, this.theme), c.stockLegend = m, q = m.valueTextComparing, y = m.valueTextRegular, s = m.periodValueTextComparing, x = m.periodValueTextRegular);
                    if (h.comparable) {
                        var t = e.length;
                        0 < t && h.valueAxis.logarithmic && "never" != c.recalculateToPercents && (h.valueAxis.logarithmic = !1, h.valueAxis.prevLog = !0);
                        0 < t && "whenComparing" == c.recalculateToPercents && (h.valueAxis.recalculateToPercents = !0);
                        m && h.valueAxis && !0 === h.valueAxis.recalculateToPercents && (k = !0);
                        var n;
                        for (n = 0; n < t; n++) {
                            var w = e[n],
                                p = h.comparedGraphs[w.id];
                            p || (p = new AmCharts.AmGraph(this.theme), p.id = "comparedGraph" + n + "_" + w.id);
                            p.periodValue = h.periodValue;
                            p.dataSet = w;
                            h.comparedGraphs[w.id] = p;
                            p.seriesIdField = "amCategoryIdField";
                            p.connect = h.connect;
                            var l = h.compareField;
                            l || (l = h.valueField);
                            var D = !1,
                                A = w.fieldMappings,
                                z;
                            for (z = 0; z < A.length; z++) A[z].toField == l && (D = !0);
                            if (D) {
                                p.valueField = l;
                                p.title = w.title;
                                p.lineColor = w.color;
                                h.compareGraphType && (p.type = h.compareGraphType);
                                l = h.compareGraphLineThickness;
                                isNaN(l) || (p.lineThickness = l);
                                l = h.compareGraphDashLength;
                                isNaN(l) || (p.dashLength = l);
                                l = h.compareGraphLineAlpha;
                                isNaN(l) || (p.lineAlpha = l);
                                l = h.compareGraphCornerRadiusTop;
                                isNaN(l) || (p.cornerRadiusTop = l);
                                l = h.compareGraphCornerRadiusBottom;
                                isNaN(l) || (p.cornerRadiusBottom = l);
                                l = h.compareGraphBalloonColor;
                                isNaN(l) || (p.balloonColor = l);
                                if (l = h.compareGraphFillColors) p.fillColors = l;
                                if (l = h.compareGraphNegativeFillColors) p.negativeFillColors = l;
                                if (l = h.compareGraphFillAlphas) p.fillAlphas = l;
                                if (l = h.compareGraphNegativeFillAlphas) p.negativeFillAlphas = l;
                                if (l = h.compareGraphBullet) p.bullet = l;
                                if (l = h.compareGraphNumberFormatter) p.numberFormatter = l;
                                if (l = h.compareGraphBalloonText) p.balloonText = l;
                                l = h.compareGraphBulletSize;
                                isNaN(l) || (p.bulletSize = l);
                                l = h.compareGraphBulletAlpha;
                                isNaN(l) || (p.bulletAlpha = l);
                                l = h.compareGraphBulletBorderAlpha;
                                isNaN(l) || (p.bulletBorderAlpha = l);
                                if (l = h.compareGraphBulletBorderColor) p.bulletBorderColor = l;
                                l = h.compareGraphBulletBorderThickness;
                                isNaN(l) || (p.bulletBorderThickness = l);
                                p.visibleInLegend = h.compareGraphVisibleInLegend;
                                p.balloonFunction = h.compareGraphBalloonFunction;
                                p.valueAxis = h.valueAxis;
                                m && (k && q ? (p.legendValueText = q, p.legendPeriodValueText = s) : (y && (p.legendValueText = y), x && (p.legendPeriodValueText = x)));
                                c.addGraph(p);
                                this.comparedGraphs.push({
                                    graph: p,
                                    dataSet: w
                                })
                            }
                        }
                    }
                    m && (k && q ? (h.legendValueText = q, h.legendPeriodValueText = s) : (y && (h.legendValueText = y), x && (h.legendPeriodValueText = x)))
                }
            }
        }
    },
    choosePeriod: function(a, b, c) {
        var d = this.categoryAxesSettings,
            e = d.groupToPeriods,
            g = e[a],
            e = e[a + 1],
            f = AmCharts.extractPeriod(g),
            f = AmCharts.getPeriodDuration(f.period, f.count),
            h = b.getTime(),
            k = c.getTime(),
            d = d.maxSeries;
        return (k - h) / f > d && 0 < d && e ? this.choosePeriod(a + 1, b, c) : g
    },
    handleCursorChange: function(a) {
        var b = a.target,
            c = a.position;
        a = a.zooming;
        var d = this.chartCursors,
            e;
        for (e = 0; e < d.length; e++) {
            var g = d[e];
            g != b && c && (g.isZooming(a), g.previousMousePosition = NaN, g.forceShow = !0, g.setPosition(c, !1))
        }
    },
    getSelections: function() {
        var a = [],
            b = this.dataSets,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c];
            d.compared && a.push(d)
        }
        this.comparedDataSets = a;
        b = this.panels;
        for (c = 0; c < b.length; c++) d = b[c], "never" != d.recalculateToPercents && 0 < a.length ? d.hideDrawingIcons(!0) : d.drawingIconsEnabled && d.hideDrawingIcons(!1)
    },
    addPanel: function(a) {
        this.panels.push(a);
        AmCharts.removeChart(a);
        AmCharts.addChart(a)
    },
    addPanelAt: function(a, b) {
        this.panels.splice(b, 0, a);
        AmCharts.removeChart(a);
        AmCharts.addChart(a)
    },
    removePanel: function(a) {
        var b = this.panels,
            c;
        for (c = b.length - 1; 0 <= c; c--) if (b[c] == a) {
            var d = {
                type: "panelRemoved",
                panel: a,
                chart: this
            };
            this.fire(d.type, d);
            b.splice(c, 1);
            a.destroy();
            a.clear()
        }
    },
    validateData: function() {
        this.resetDataParsed();
        this.updateDataSets();
        this.mainDataSet.compared = !1;
        this.updateGraphs();
        this.updateData();
        var a = this.dataSetSelector;
        a && a.write(a.div)
    },
    resetDataParsed: function() {
        var a = this.dataSets,
            b;
        for (b = 0; b < a.length; b++) a[b].dataParsed = !1
    },
    validateNow: function() {
        this.skipDefault = !0;
        this.chartRendered = !1;
        this.clear(!0);
        this.write(this.div)
    },
    hideStockEvents: function() {
        this.showHideEvents(!1);
        this.eventsHidden = !0
    },
    showStockEvents: function() {
        this.showHideEvents(!0);
        this.eventsHidden = !1
    },
    showHideEvents: function(a) {
        var b = this.panels,
            c;
        for (c = 0; c < b.length; c++) {
            var d = b[c].graphs,
                e;
            for (e = 0; e < d.length; e++) {
                var g = d[e];
                !0 === a ? g.showBullets() : g.hideBullets()
            }
        }
    },
    invalidateSize: function() {
        var a = this;
        clearTimeout(a.validateTO);
        var b = setTimeout(function() {
            a.validateNow()
        }, 5);
        a.validateTO = b
    },
    measure: function() {
        var a = this.div,
            b = a.offsetWidth,
            c = a.offsetHeight;
        a.clientHeight && (b = a.clientWidth, c = a.clientHeight);
        this.divRealWidth = b;
        this.divRealHeight = c
    },
    clear: function(a) {
        var b = this.panels,
            c;
        if (b) for (c = 0; c < b.length; c++) {
            var d = b[c];
            a || (d.cleanChart(), d.destroy());
            d.clear(a)
        }(b = this.scrollbarChart) && b.clear();
        if (b = this.div) b.innerHTML = "";
        a || (this.div = null, AmCharts.deleteObject(this))
    }
});
AmCharts.StockEvent = AmCharts.Class({
    construct: function() {}
});
AmCharts.DataSet = AmCharts.Class({
    construct: function() {
        this.fieldMappings = [];
        this.dataProvider = [];
        this.agregatedDataProviders = [];
        this.stockEvents = [];
        this.compared = !1;
        this.showInCompare = this.showInSelect = !0
    }
});
AmCharts.PeriodSelector = AmCharts.Class({
    construct: function(a) {
        this.theme = a;
        this.createEvents("changed");
        this.inputFieldsEnabled = !0;
        this.position = "bottom";
        this.width = 180;
        this.fromText = "From: ";
        this.toText = "to: ";
        this.periodsText = "Zoom: ";
        this.periods = [];
        this.inputFieldWidth = 100;
        this.dateFormat = "DD-MM-YYYY";
        this.hideOutOfScopePeriods = !0;
        AmCharts.applyTheme(this, a, "PeriodSelector")
    },
    zoom: function(a, b) {
        this.inputFieldsEnabled && (this.startDateField.value = AmCharts.formatDate(a, this.dateFormat), this.endDateField.value = AmCharts.formatDate(b, this.dateFormat));
        this.markButtonAsSelected()
    },
    write: function(a) {
        var b = this;
        a.className = "amChartsPeriodSelector";
        var c = b.width,
            d = b.position;
        b.width = void 0;
        b.position = void 0;
        AmCharts.applyStyles(a.style, b);
        b.width = c;
        b.position = d;
        b.div = a;
        a.innerHTML = "";
        c = b.theme;
        d = b.position;
        d = "top" == d || "bottom" == d ? !1 : !0;
        b.vertical = d;
        var e = 0,
            g = 0;
        if (b.inputFieldsEnabled) {
            var f = document.createElement("div");
            a.appendChild(f);
            var h = document.createTextNode(b.fromText);
            f.appendChild(h);
            d ? AmCharts.addBr(f) : (f.style.styleFloat = "left", f.style.display = "inline");
            var k = document.createElement("input");
            k.className = "amChartsInputField";
            c && AmCharts.applyStyles(k.style, c.PeriodInputField);
            k.style.textAlign = "center";
            k.onblur = function() {
                b.handleCalChange()
            };
            AmCharts.isNN && k.addEventListener("keypress", function(a) {
                b.handleCalendarChange.call(b, a)
            }, !0);
            AmCharts.isIE && k.attachEvent("onkeypress", function(a) {
                b.handleCalendarChange.call(b, a)
            });
            f.appendChild(k);
            b.startDateField = k;
            if (d) h = b.width - 6 + "px", AmCharts.addBr(f);
            else {
                var h = b.inputFieldWidth + "px",
                    m = document.createTextNode(" ");
                f.appendChild(m)
            }
            k.style.width = h;
            k = document.createTextNode(b.toText);
            f.appendChild(k);
            d && AmCharts.addBr(f);
            k = document.createElement("input");
            k.className = "amChartsInputField";
            c && AmCharts.applyStyles(k.style, c.PeriodInputField);
            k.style.textAlign = "center";
            k.onblur = function() {
                b.handleCalChange()
            };
            AmCharts.isNN && k.addEventListener("keypress", function(a) {
                b.handleCalendarChange.call(b, a)
            }, !0);
            AmCharts.isIE && k.attachEvent("onkeypress", function(a) {
                b.handleCalendarChange.call(b, a)
            });
            f.appendChild(k);
            b.endDateField = k;
            d ? AmCharts.addBr(f) : e = k.offsetHeight + 2;
            h && (k.style.width = h)
        }
        f = b.periods;
        if (AmCharts.ifArray(f)) {
            h = document.createElement("div");
            d || (h.style.cssFloat = "right", h.style.styleFloat = "right", h.style.display = "inline");
            a.appendChild(h);
            d && AmCharts.addBr(h);
            a = document.createTextNode(b.periodsText);
            h.appendChild(a);
            b.periodContainer = h;
            var q;
            for (a = 0; a < f.length; a++) k = f[a], q = document.createElement("input"), q.type = "button", q.value = k.label, q.period = k.period, q.count = k.count, q.periodObj = k, q.className = "amChartsButton", c && AmCharts.applyStyles(q.style, c.PeriodButton), d && (q.style.width = b.width - 1 + "px"), h.appendChild(q), b.addEventListeners(q), k.button = q;
            !d && q && (g = q.offsetHeight);
            b.offsetHeight = Math.max(e, g)
        }
    },
    addEventListeners: function(a) {
        var b = this;
        AmCharts.isNN && a.addEventListener("click", function(a) {
            b.handlePeriodChange.call(b, a)
        }, !0);
        AmCharts.isIE && a.attachEvent("onclick", function(a) {
            b.handlePeriodChange.call(b, a)
        })
    },
    getPeriodDates: function() {
        var a = this.periods,
            b;
        for (b = 0; b < a.length; b++) this.selectPeriodButton(a[b], !0)
    },
    handleCalendarChange: function(a) {
        13 == a.keyCode && this.handleCalChange()
    },
    handleCalChange: function() {
        var a = this.dateFormat,
            b = AmCharts.stringToDate(this.startDateField.value, a),
            a = this.chart.getLastDate(AmCharts.stringToDate(this.endDateField.value, a));
        try {
            this.startDateField.blur(), this.endDateField.blur()
        } catch (c) {}
        if (b && a) {
            var d = {
                type: "changed"
            };
            d.startDate = b;
            d.endDate = a;
            d.chart = this.chart;
            this.fire(d.type, d)
        }
    },
    handlePeriodChange: function(a) {
        this.selectPeriodButton((a.srcElement ? a.srcElement : a.target).periodObj)
    },
    setRanges: function(a, b) {
        this.firstDate = a;
        this.lastDate = b;
        this.getPeriodDates()
    },
    selectPeriodButton: function(a, b) {
        var c = a.button,
            d = c.count,
            e = c.period,
            g = this.chart,
            f, h = this.firstDate,
            k = this.lastDate,
            m, q = this.theme;
        h && k && ("MAX" == e ? (g = h, f = k) : "YTD" == e ? (g = new Date, g.setMonth(0, 1), g.setHours(0, 0, 0, 0), 0 === d && g.setDate(g.getDate() - 1), f = this.lastDate) : (m = AmCharts.getPeriodDuration(e, d), this.selectFromStart ? (g = h, f = new Date(h.getTime() + m - 1)) : (g = AmCharts.resetDateToMin(new Date(k.getTime() - m + 1), e, 1, g.firstDayOfWeek), f = k)), a.startTime = g.getTime(), this.hideOutOfScopePeriods && (b && a.startTime < h.getTime() ? c.style.display = "none" : c.style.display = "inline"), g.getTime() > k.getTime() && (m = AmCharts.getPeriodDuration("DD", 1), g = new Date(k.getTime() - m)), g.getTime() < h.getTime() && (g = h), "YTD" == e && (a.startTime = g.getTime()), a.endTime = f.getTime(), b || (this.skipMark = !0, this.unselectButtons(), c.className = "amChartsButtonSelected", q && AmCharts.applyStyles(c.style, q.PeriodButtonSelected), c = {
            type: "changed"
        }, c.startDate = g, c.endDate = f, c.predefinedPeriod = e, c.chart = this.chart, c.count = d, this.fire(c.type, c)))
    },
    markButtonAsSelected: function() {
        if (!this.skipMark) {
            var a = this.chart,
                b = this.periods,
                c = a.startDate.getTime(),
                a = a.endDate.getTime(),
                d = this.theme;
            this.unselectButtons();
            var e;
            for (e = b.length - 1; 0 <= e; e--) {
                var g = b[e],
                    f = g.button;
                g.startTime && g.endTime && c == g.startTime && a == g.endTime && (this.unselectButtons(), f.className = "amChartsButtonSelected", d && AmCharts.applyStyles(f.style, d.PeriodButtonSelected))
            }
        }
        this.skipMark = !1
    },
    unselectButtons: function() {
        var a = this.periods,
            b, c = this.theme;
        for (b = a.length - 1; 0 <= b; b--) {
            var d = a[b].button;
            d.className = "amChartsButton";
            c && AmCharts.applyStyles(d.style, c.PeriodButton)
        }
    },
    setDefaultPeriod: function() {
        var a = this.periods,
            b;
        for (b = 0; b < a.length; b++) {
            var c = a[b];
            c.selected && this.selectPeriodButton(c)
        }
    }
});
AmCharts.StockGraph = AmCharts.Class({
    inherits: AmCharts.AmGraph,
    construct: function(a) {
        AmCharts.StockGraph.base.construct.call(this, a);
        this.useDataSetColors = !0;
        this.periodValue = "Close";
        this.compareGraphType = "line";
        this.compareGraphVisibleInLegend = !0;
        this.comparable = this.resetTitleOnDataSetChange = !1;
        this.comparedGraphs = {};
        this.showEventsOnComparedGraphs = !1;
        AmCharts.applyTheme(this, a, "StockGraph")
    }
});
AmCharts.StockPanel = AmCharts.Class({
    inherits: AmCharts.AmSerialChart,
    construct: function(a) {
        AmCharts.StockPanel.base.construct.call(this, a);
        this.theme = a;
        this.showCategoryAxis = !0;
        this.recalculateToPercents = "whenComparing";
        this.panelHeaderPaddingBottom = this.panelHeaderPaddingLeft = this.panelHeaderPaddingRight = this.panelHeaderPaddingTop = 0;
        this.trendLineAlpha = 1;
        this.trendLineColor = "#00CC00";
        this.trendLineColorHover = "#CC0000";
        this.trendLineThickness = 2;
        this.trendLineDashLength = 0;
        this.stockGraphs = [];
        this.drawingIconsEnabled = !1;
        this.iconSize = 18;
        this.autoMargins = this.allowTurningOff = this.eraseAll = this.erasingEnabled = this.drawingEnabled = !1;
        AmCharts.applyTheme(this, a, "StockPanel")
    },
    initChart: function(a) {
        AmCharts.StockPanel.base.initChart.call(this, a);
        this.drawingIconsEnabled && this.createDrawIcons();
        if (a = this.chartCursor) this.removeListener(a, "draw", this.handleDraw), this.listenTo(a, "draw", this.handleDraw)
    },
    addStockGraph: function(a) {
        this.stockGraphs.push(a);
        return a
    },
    removeStockGraph: function(a) {
        var b = this.stockGraphs,
            c;
        for (c = b.length - 1; 0 <= c; c--) b[c] == a && b.splice(c, 1)
    },
    createDrawIcons: function() {
        var a = this,
            b = a.iconSize,
            c = a.container,
            d = a.pathToImages,
            e = a.realWidth - 2 * b - 1 - a.marginRight,
            g = AmCharts.rect(c, b, b, "#000", 0.005),
            f = AmCharts.rect(c, b, b, "#000", 0.005);
        f.translate(b + 1, 0);
        var h = c.image(d + "pencilIcon.gif", 0, 0, b, b);
        a.pencilButton = h;
        f.setAttr("cursor", "pointer");
        g.setAttr("cursor", "pointer");
        g.mouseup(function() {
            a.handlePencilClick()
        });
        var k = c.image(d + "pencilIconH.gif", 0, 0, b, b);
        a.pencilButtonPushed = k;
        a.drawingEnabled || k.hide();
        var m = c.image(d + "eraserIcon.gif", b + 1, 0, b, b);
        a.eraserButton = m;
        f.mouseup(function() {
            a.handleEraserClick()
        });
        g.touchend && (g.touchend(function() {
            a.handlePencilClick()
        }), f.touchend(function() {
            a.handleEraserClick()
        }));
        b = c.image(d + "eraserIconH.gif", b + 1, 0, b, b);
        a.eraserButtonPushed = b;
        a.erasingEnabled || b.hide();
        c = c.set([h, k, m, b, g, f]);
        c.translate(e, 1);
        this.hideIcons && c.hide()
    },
    handlePencilClick: function() {
        var a = !this.drawingEnabled;
        this.disableDrawing(!a);
        this.erasingEnabled = !1;
        this.eraserButtonPushed.hide();
        a ? this.pencilButtonPushed.show() : (this.pencilButtonPushed.hide(), this.setMouseCursor("auto"))
    },
    disableDrawing: function(a) {
        this.drawingEnabled = !a;
        var b = this.chartCursor;
        this.stockChart.enableCursors(a);
        b && b.enableDrawing(!a)
    },
    handleEraserClick: function() {
        this.disableDrawing(!0);
        this.pencilButtonPushed.hide();
        if (this.eraseAll) {
            var a = this.trendLines,
                b;
            for (b = a.length - 1; 0 <= b; b--) {
                var c = a[b];
                c.isProtected || this.removeTrendLine(c)
            }
            this.validateNow()
        } else(this.erasingEnabled = a = !this.erasingEnabled) ? (this.eraserButtonPushed.show(), this.setTrendColorHover(this.trendLineColorHover), this.setMouseCursor("auto")) : (this.eraserButtonPushed.hide(), this.setTrendColorHover())
    },
    setTrendColorHover: function(a) {
        var b = this.trendLines,
            c;
        for (c = b.length - 1; 0 <= c; c--) {
            var d = b[c];
            d.isProtected || (d.rollOverColor = a)
        }
    },
    handleDraw: function(a) {
        var b = this.drawOnAxis;
        AmCharts.isString(b) && (b = this.getValueAxisById(b));
        b || (b = this.valueAxes[0]);
        this.drawOnAxis = b;
        var c = this.categoryAxis,
            d = a.initialX,
            e = a.finalX,
            g = a.initialY;
        a = a.finalY;
        var f = new AmCharts.TrendLine(this.theme);
        f.initialDate = c.coordinateToDate(d);
        f.finalDate = c.coordinateToDate(e);
        f.initialValue = b.coordinateToValue(g);
        f.finalValue = b.coordinateToValue(a);
        f.lineAlpha = this.trendLineAlpha;
        f.lineColor = this.trendLineColor;
        f.lineThickness = this.trendLineThickness;
        f.dashLength = this.trendLineDashLength;
        f.valueAxis = b;
        f.categoryAxis = c;
        this.addTrendLine(f);
        this.listenTo(f, "click", this.handleTrendClick);
        this.validateNow()
    },
    hideDrawingIcons: function(a) {
        (this.hideIcons = a) && this.disableDrawing(a)
    },
    handleTrendClick: function(a) {
        this.erasingEnabled && (a = a.trendLine, this.eraseAll || a.isProtected || this.removeTrendLine(a), this.validateNow())
    }
});
AmCharts.CategoryAxesSettings = AmCharts.Class({
    construct: function(a) {
        this.minPeriod = "DD";
        this.equalSpacing = !1;
        this.axisHeight = 28;
        this.tickLength = this.axisAlpha = 0;
        this.gridCount = 10;
        this.maxSeries = 150;
        this.groupToPeriods = "ss 10ss 30ss mm 10mm 30mm hh DD WW MM YYYY".split(" ");
        this.autoGridCount = !0;
        AmCharts.applyTheme(this, a, "CategoryAxesSettings")
    }
});
AmCharts.ChartCursorSettings = AmCharts.Class({
    construct: function(a) {
        this.enabled = !0;
        this.bulletsEnabled = this.valueBalloonsEnabled = !1;
        this.categoryBalloonDateFormats = [{
            period: "YYYY",
            format: "YYYY"
        }, {
            period: "MM",
            format: "MMM, YYYY"
        }, {
            period: "WW",
            format: "MMM DD, YYYY"
        }, {
            period: "DD",
            format: "MMM DD, YYYY"
        }, {
            period: "hh",
            format: "JJ:NN"
        }, {
            period: "mm",
            format: "JJ:NN"
        }, {
            period: "ss",
            format: "JJ:NN:SS"
        }, {
            period: "fff",
            format: "JJ:NN:SS"
        }];
        AmCharts.applyTheme(this, a, "ChartCursorSettings")
    },
    categoryBalloonDateFormat: function(a) {
        var b = this.categoryBalloonDateFormats,
            c, d;
        for (d = 0; d < b.length; d++) b[d].period == a && (c = b[d].format);
        return c
    }
});
AmCharts.ChartScrollbarSettings = AmCharts.Class({
    construct: function(a) {
        this.height = 40;
        this.enabled = !0;
        this.color = "#FFFFFF";
        this.updateOnReleaseOnly = this.autoGridCount = !0;
        this.hideResizeGrips = !1;
        this.position = "bottom";
        AmCharts.applyTheme(this, a, "ChartScrollbarSettings")
    }
});
AmCharts.LegendSettings = AmCharts.Class({
    construct: function(a) {
        this.marginBottom = this.marginTop = 0;
        this.usePositiveNegativeOnPercentsOnly = !0;
        this.positiveValueColor = "#00CC00";
        this.negativeValueColor = "#CC0000";
        this.autoMargins = this.equalWidths = this.textClickEnabled = !1;
        AmCharts.applyTheme(this, a, "LegendSettings")
    }
});
AmCharts.PanelsSettings = AmCharts.Class({
    construct: function(a) {
        this.marginBottom = this.marginTop = this.marginRight = this.marginLeft = 0;
        this.backgroundColor = "#FFFFFF";
        this.backgroundAlpha = 0;
        this.panelSpacing = 8;
        this.panEventsEnabled = !1;
        AmCharts.applyTheme(this, a, "PanelsSettings")
    }
});
AmCharts.StockEventsSettings = AmCharts.Class({
    construct: function(a) {
        this.type = "sign";
        this.backgroundAlpha = 1;
        this.backgroundColor = "#DADADA";
        this.borderAlpha = 1;
        this.borderColor = "#888888";
        this.balloonColor = this.rollOverColor = "#CC0000";
        AmCharts.applyTheme(this, a, "StockEventsSettings")
    }
});
AmCharts.ValueAxesSettings = AmCharts.Class({
    construct: function(a) {
        this.tickLength = 0;
        this.showFirstLabel = this.autoGridCount = this.inside = !0;
        this.showLastLabel = !1;
        this.axisAlpha = 0;
        AmCharts.applyTheme(this, a, "ValueAxesSettings")
    }
});
AmCharts.getItemIndex = function(a, b) {
    var c = -1,
        d;
    for (d = 0; d < b.length; d++) a == b[d] && (c = d);
    return c
};
AmCharts.addBr = function(a) {
    a.appendChild(document.createElement("br"))
};
AmCharts.applyStyles = function(a, b) {
    if (b && a) for (var c in a) {
        var d = c,
            e = b[d];
        if (void 0 !== e) try {
            a[d] = e
        } catch (g) {}
    }
};
AmCharts.parseStockData = function(a, b, c, d, e) {
    (new Date).getTime();
    var g = {},
        f = a.dataProvider,
        h = a.categoryField;
    if (h) {
        var k = AmCharts.getItemIndex(b, c),
            m = c.length,
            q, y = f.length,
            s, x = {};
        for (q = k; q < m; q++) s = c[q], g[s] = [];
        var t = {},
            n = a.fieldMappings,
            w = n.length;
        for (q = 0; q < y; q++) {
            var p = f[q],
                l = p[h],
                l = l instanceof Date ? "fff" == b ? AmCharts.useUTC ? new Date(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate(), l.getUTCHours(), l.getUTCMinutes(), l.getUTCSeconds(), l.getUTCMilliseconds()) : new Date(l.getFullYear(), l.getMonth(), l.getDate(), l.getHours(), l.getMinutes(), l.getSeconds(), l.getMilliseconds()) : new Date(l) : e ? AmCharts.stringToDate(l, e) : new Date(l),
                D = l.getTime(),
                A = {};
            for (s = 0; s < w; s++) A[n[s].toField] = p[n[s].fromField];
            var z;
            for (z = k; z < m; z++) {
                s = c[z];
                var B = AmCharts.extractPeriod(s),
                    C = B.period,
                    B = B.count,
                    v, u, r;
                if (z == k || D >= x[s] || !x[s]) {
                    t[s] = {};
                    t[s].amCategoryIdField = String(AmCharts.resetDateToMin(l, C, B, d).getTime());
                    var E;
                    for (E = 0; E < w; E++) v = n[E].toField, u = t[s], r = Number(A[v]), u[v + "Count"] = 0, u[v + "Sum"] = 0, isNaN(r) || (u[v + "Open"] = r, u[v + "Sum"] = r, u[v + "High"] = r, u[v + "Low"] = r, u[v + "Close"] = r, u[v + "Count"] = 1, u[v + "Average"] = r);
                    g[s].push(t[s]);
                    z > k && (u = new Date(l), u = AmCharts.changeDate(u, C, B, !0), u = AmCharts.resetDateToMin(u, C, B, d), x[s] = u.getTime());
                    if (z == k) for (var F in p) p.hasOwnProperty(F) && (t[s][F] = p[F]);
                    t[s][h] = new Date(l)
                } else for (C = 0; C < w; C++) v = n[C].toField, u = t[s], q == y - 1 && (u[h] = new Date(l)), r = Number(A[v]), isNaN(r) || (isNaN(u[v + "Low"]) && (u[v + "Low"] = r), r < u[v + "Low"] && (u[v + "Low"] = r), isNaN(u[v + "High"]) && (u[v + "High"] = r), r > u[v + "High"] && (u[v + "High"] = r), u[v + "Close"] = r, u[v + "Sum"] += r, u[v + "Count"]++, u[v + "Average"] = u[v + "Sum"] / u[v + "Count"])
            }
        }
    }
    a.agregatedDataProviders = g
};
AmCharts.parseEvents = function(a, b, c, d, e, g) {
    var f = a.stockEvents,
        h = a.agregatedDataProviders,
        k = b.length,
        m, q, y, s, x, t, n, w;
    for (m = 0; m < k; m++) {
        t = b[m];
        x = t.graphs;
        y = x.length;
        var p;
        for (q = 0; q < y; q++) s = x[q], s.customBulletField = "amCustomBullet" + s.id + "_" + t.id, s.bulletConfigField = "amCustomBulletConfig" + s.id + "_" + t.id;
        for (var l = 0; l < f.length; l++) if (n = f[l], p = n.graph, AmCharts.isString(p) && (p = AmCharts.getObjById(x, p))) n.graph = p
    }
    for (var D in h) if (h.hasOwnProperty(D)) {
        p = h[D];
        var A = AmCharts.extractPeriod(D),
            z = p.length,
            B;
        for (B = 0; B < z; B++) {
            var C = p[B];
            m = C[a.categoryField];
            w = m instanceof Date;
            g && !w && (m = AmCharts.stringToDate(m, g));
            var v = m.getTime();
            x = A.period;
            var l = A.count,
                u;
            u = "fff" == x ? m.getTime() + 1 : AmCharts.resetDateToMin(AmCharts.changeDate(new Date(m), A.period, A.count), x, l, d).getTime();
            for (m = 0; m < k; m++) for (t = b[m], x = t.graphs, y = x.length, q = 0; q < y; q++) {
                s = x[q];
                var r = {};
                r.eventDispatcher = e;
                r.eventObjects = [];
                r.letters = [];
                r.descriptions = [];
                r.shapes = [];
                r.backgroundColors = [];
                r.backgroundAlphas = [];
                r.borderColors = [];
                r.borderAlphas = [];
                r.colors = [];
                r.rollOverColors = [];
                r.showOnAxis = [];
                for (l = 0; l < f.length; l++) {
                    n = f[l];
                    w = n.date instanceof Date;
                    g && !w && (n.date = AmCharts.stringToDate(n.date, g));
                    w = n.date.getTime();
                    var E = !1;
                    n.graph && (n.graph.showEventsOnComparedGraphs && n.graph.comparedGraphs[a.id] && (E = !0), (s == n.graph || E) && w >= v && w < u && (r.eventObjects.push(n), r.letters.push(n.text), r.descriptions.push(n.description), n.type ? r.shapes.push(n.type) : r.shapes.push(c.type), void 0 !== n.backgroundColor ? r.backgroundColors.push(n.backgroundColor) : r.backgroundColors.push(c.backgroundColor), isNaN(n.backgroundAlpha) ? r.backgroundAlphas.push(c.backgroundAlpha) : r.backgroundAlphas.push(n.backgroundAlpha), isNaN(n.borderAlpha) ? r.borderAlphas.push(c.borderAlpha) : r.borderAlphas.push(n.borderAlpha), void 0 !== n.borderColor ? r.borderColors.push(n.borderColor) : r.borderColors.push(c.borderColor), void 0 !== n.rollOverColor ? r.rollOverColors.push(n.rollOverColor) : r.rollOverColors.push(c.rollOverColor), r.colors.push(n.color), !n.panel && n.graph && (n.panel = n.graph.chart), r.showOnAxis.push(n.showOnAxis), r.date = new Date(n.date)));
                    0 < r.shapes.length && (n = "amCustomBullet" + s.id + "_" + t.id, w = "amCustomBulletConfig" + s.id + "_" + t.id, C[n] = AmCharts.StackedBullet, C[w] = r)
                }
            }
        }
    }
};
AmCharts.StockLegend = AmCharts.Class({
    inherits: AmCharts.AmLegend,
    construct: function(a) {
        AmCharts.StockLegend.base.construct.call(this, a);
        this.valueTextComparing = "[[percents.value]]%";
        this.valueTextRegular = "[[value]]";
        AmCharts.applyTheme(this, a, "StockLegend")
    },
    drawLegend: function() {
        var a = this;
        AmCharts.StockLegend.base.drawLegend.call(a);
        var b = a.chart;
        if (b.allowTurningOff) {
            var c = a.container,
                d = c.image(b.pathToImages + "xIcon.gif", b.realWidth - 17, 3, 17, 17),
                b = c.image(b.pathToImages + "xIconH.gif", b.realWidth - 17, 3, 17, 17);
            b.hide();
            a.xButtonHover = b;
            d.mouseup(function() {
                a.handleXClick()
            }).mouseover(function() {
                    a.handleXOver()
                });
            b.mouseup(function() {
                a.handleXClick()
            }).mouseout(function() {
                    a.handleXOut()
                })
        }
    },
    handleXOver: function() {
        this.xButtonHover.show()
    },
    handleXOut: function() {
        this.xButtonHover.hide()
    },
    handleXClick: function() {
        var a = this.chart,
            b = a.stockChart;
        b.removePanel(a);
        b.validateNow()
    }
});
AmCharts.DataSetSelector = AmCharts.Class({
    construct: function(a) {
        this.theme = a;
        this.createEvents("dataSetSelected", "dataSetCompared", "dataSetUncompared");
        this.position = "left";
        this.selectText = "Select:";
        this.comboBoxSelectText = "Select...";
        this.compareText = "Compare to:";
        this.width = 180;
        this.dataProvider = [];
        this.listHeight = 150;
        this.listCheckBoxSize = 14;
        this.rollOverBackgroundColor = "#b2e1ff";
        this.selectedBackgroundColor = "#7fceff";
        AmCharts.applyTheme(this, a, "DataSetSelector")
    },
    write: function(a) {
        var b = this,
            c, d = b.theme;
        a.className = "amChartsDataSetSelector";
        var e = b.width;
        c = b.position;
        b.width = void 0;
        b.position = void 0;
        AmCharts.applyStyles(a.style, b);
        b.div = a;
        b.width = e;
        b.position = c;
        a.innerHTML = "";
        var e = b.position,
            g;
        g = "top" == e || "bottom" == e ? !1 : !0;
        b.vertical = g;
        var f;
        g && (f = b.width + "px");
        var e = b.dataProvider,
            h, k;
        if (1 < b.countDataSets("showInSelect")) {
            c = document.createTextNode(b.selectText);
            a.appendChild(c);
            g && AmCharts.addBr(a);
            var m = document.createElement("select");
            f && (m.style.width = f);
            b.selectCB = m;
            d && AmCharts.applyStyles(m.style, d.DataSetSelect);
            a.appendChild(m);
            AmCharts.isNN && m.addEventListener("change", function(a) {
                b.handleDataSetChange.call(b, a)
            }, !0);
            AmCharts.isIE && m.attachEvent("onchange", function(a) {
                b.handleDataSetChange.call(b, a)
            });
            for (c = 0; c < e.length; c++) if (h = e[c], !0 === h.showInSelect) {
                k = document.createElement("option");
                k.text = h.title;
                k.value = c;
                h == b.chart.mainDataSet && (k.selected = !0);
                try {
                    m.add(k, null)
                } catch (q) {
                    m.add(k)
                }
            }
            b.offsetHeight = m.offsetHeight
        }
        if (0 < b.countDataSets("showInCompare") && 1 < e.length) if (g ? (AmCharts.addBr(a), AmCharts.addBr(a)) : (c = document.createTextNode(" "), a.appendChild(c)), c = document.createTextNode(b.compareText), a.appendChild(c), k = b.listCheckBoxSize, g) {
            AmCharts.addBr(a);
            f = document.createElement("div");
            a.appendChild(f);
            f.className = "amChartsCompareList";
            d && AmCharts.applyStyles(f.style, d.DataSetCompareList);
            f.style.overflow = "auto";
            f.style.overflowX = "hidden";
            f.style.width = b.width - 2 + "px";
            f.style.maxHeight = b.listHeight + "px";
            for (c = 0; c < e.length; c++) h = e[c], !0 === h.showInCompare && h != b.chart.mainDataSet && (d = document.createElement("div"), d.style.padding = "4px", d.style.position = "relative", d.name = "amCBContainer", d.dataSet = h, d.style.height = k + "px", h.compared && (d.style.backgroundColor = b.selectedBackgroundColor), f.appendChild(d), g = document.createElement("div"), g.style.width = k + "px", g.style.height = k + "px", g.style.position = "absolute", g.style.backgroundColor = h.color, d.appendChild(g), g = document.createElement("div"), g.style.width = "100%", g.style.position = "absolute", g.style.left = k + 10 + "px", d.appendChild(g), h = document.createTextNode(h.title), g.style.whiteSpace = "nowrap", g.style.cursor = "default", g.appendChild(h), b.addEventListeners(d));
            AmCharts.addBr(a);
            AmCharts.addBr(a)
        } else {
            d = document.createElement("select");
            b.compareCB = d;
            f && (d.style.width = f);
            a.appendChild(d);
            AmCharts.isNN && d.addEventListener("change", function(a) {
                b.handleCBSelect.call(b, a)
            }, !0);
            AmCharts.isIE && d.attachEvent("onchange", function(a) {
                b.handleCBSelect.call(b, a)
            });
            k = document.createElement("option");
            k.text = b.comboBoxSelectText;
            try {
                d.add(k, null)
            } catch (y) {
                d.add(k)
            }
            for (c = 0; c < e.length; c++) if (h = e[c], !0 === h.showInCompare && h != b.chart.mainDataSet) {
                k = document.createElement("option");
                k.text = h.title;
                k.value = c;
                h.compared && (k.selected = !0);
                try {
                    d.add(k, null)
                } catch (s) {
                    d.add(k)
                }
            }
            b.offsetHeight = d.offsetHeight
        }
    },
    addEventListeners: function(a) {
        var b = this;
        AmCharts.isNN && (a.addEventListener("mouseover", function(a) {
            b.handleRollOver.call(b, a)
        }, !0), a.addEventListener("mouseout", function(a) {
            b.handleRollOut.call(b, a)
        }, !0), a.addEventListener("click", function(a) {
            b.handleClick.call(b, a)
        }, !0));
        AmCharts.isIE && (a.attachEvent("onmouseout", function(a) {
            b.handleRollOut.call(b, a)
        }), a.attachEvent("onmouseover", function(a) {
            b.handleRollOver.call(b, a)
        }), a.attachEvent("onclick", function(a) {
            b.handleClick.call(b, a)
        }))
    },
    handleDataSetChange: function() {
        var a = this.selectCB,
            a = this.dataProvider[a.options[a.selectedIndex].value],
            b = this.chart;
        b.mainDataSet = a;
        b.zoomOutOnDataSetChange && (b.startDate = void 0, b.endDate = void 0);
        b.validateData();
        a = {
            type: "dataSetSelected",
            dataSet: a,
            chart: this.chart
        };
        this.fire(a.type, a)
    },
    handleRollOver: function(a) {
        a = this.getRealDiv(a);
        a.dataSet.compared || (a.style.backgroundColor = this.rollOverBackgroundColor)
    },
    handleRollOut: function(a) {
        a = this.getRealDiv(a);
        a.dataSet.compared || (a.style.removeProperty && a.style.removeProperty("background-color"), a.style.removeAttribute && a.style.removeAttribute("backgroundColor"))
    },
    handleCBSelect: function(a) {
        var b = this.compareCB,
            c = this.dataProvider,
            d, e;
        for (d = 0; d < c.length; d++) e = c[d], e.compared && (a = {
            type: "dataSetUncompared",
            dataSet: e
        }), e.compared = !1;
        c = b.selectedIndex;
        0 < c && (e = this.dataProvider[b.options[c].value], e.compared || (a = {
            type: "dataSetCompared",
            dataSet: e
        }), e.compared = !0);
        b = this.chart;
        b.validateData();
        a.chart = b;
        this.fire(a.type, a)
    },
    handleClick: function(a) {
        a = this.getRealDiv(a).dataSet;
        !0 === a.compared ? (a.compared = !1, a = {
            type: "dataSetUncompared",
            dataSet: a
        }) : (a.compared = !0, a = {
            type: "dataSetCompared",
            dataSet: a
        });
        var b = this.chart;
        b.validateData();
        a.chart = b;
        this.fire(a.type, a)
    },
    getRealDiv: function(a) {
        a || (a = window.event);
        a = a.currentTarget ? a.currentTarget : a.srcElement;
        "amCBContainer" == a.parentNode.name && (a = a.parentNode);
        return a
    },
    countDataSets: function(a) {
        var b = this.dataProvider,
            c = 0,
            d;
        for (d = 0; d < b.length; d++)!0 === b[d][a] && c++;
        return c
    }
});
AmCharts.StackedBullet = AmCharts.Class({
    construct: function() {
        this.fontSize = 11;
        this.stackDown = !1;
        this.mastHeight = 8;
        this.shapes = [];
        this.backgroundColors = [];
        this.backgroundAlphas = [];
        this.borderAlphas = [];
        this.borderColors = [];
        this.colors = [];
        this.rollOverColors = [];
        this.showOnAxiss = [];
        this.textColor = "#000000";
        this.nextY = 0;
        this.size = 16
    },
    parseConfig: function() {
        var a = this.bulletConfig;
        this.eventObjects = a.eventObjects;
        this.letters = a.letters;
        this.shapes = a.shapes;
        this.backgroundColors = a.backgroundColors;
        this.backgroundAlphas = a.backgroundAlphas;
        this.borderColors = a.borderColors;
        this.borderAlphas = a.borderAlphas;
        this.colors = a.colors;
        this.rollOverColors = a.rollOverColors;
        this.date = a.date;
        this.showOnAxiss = a.showOnAxis;
        this.axisCoordinate = a.minCoord
    },
    write: function(a) {
        this.parseConfig();
        this.container = a;
        this.bullets = [];
        if (this.graph) {
            var b = this.graph.fontSize;
            b && (this.fontSize = b)
        }
        b = this.letters.length;
        (this.mastHeight + 2 * (this.fontSize / 2 + 2)) * b > this.availableSpace && (this.stackDown = !0);
        this.set = a.set();
        a = 0;
        var c;
        for (c = 0; c < b; c++) this.shape = this.shapes[c], this.backgroundColor = this.backgroundColors[c], this.backgroundAlpha = this.backgroundAlphas[c], this.borderAlpha = this.borderAlphas[c], this.borderColor = this.borderColors[c], this.rollOverColor = this.rollOverColors[c], this.showOnAxis = this.showOnAxiss[c], this.color = this.colors[c], this.addLetter(this.letters[c], a, c), this.showOnAxis || a++
    },
    addLetter: function(a, b, c) {
        var d = this.container;
        b = d.set();
        var e = -1,
            g = this.stackDown;
        this.showOnAxis && (this.stackDown = this.graph.valueAxis.reversed ? !0 : !1);
        this.stackDown && (e = 1);
        var f = 0,
            h = 0,
            k = 0,
            m, k = this.fontSize,
            q = this.mastHeight,
            y = this.shape,
            s = this.textColor;
        void 0 !== this.color && (s = this.color);
        void 0 === a && (a = "");
        a = AmCharts.text(d, a, s, this.chart.fontFamily, this.fontSize);
        d = a.getBBox();
        this.labelWidth = s = d.width;
        this.labelHeight = d.height;
        d = 0;
        switch (y) {
            case "sign":
                m = this.drawSign(b);
                f = q + 4 + k / 2;
                d = q + k + 4;
                1 == e && (f -= 4);
                break;
            case "flag":
                m = this.drawFlag(b);
                h = s / 2 + 3;
                f = q + 4 + k / 2;
                d = q + k + 4;
                1 == e && (f -= 4);
                break;
            case "pin":
                m = this.drawPin(b);
                f = 6 + k / 2;
                d = k + 8;
                break;
            case "triangleUp":
                m = this.drawTriangleUp(b);
                f = -k - 1;
                d = k + 4;
                e = -1;
                break;
            case "triangleDown":
                m = this.drawTriangleDown(b);
                f = k + 1;
                d = k + 4;
                e = -1;
                break;
            case "triangleLeft":
                m = this.drawTriangleLeft(b);
                h = k;
                d = k + 4;
                e = -1;
                break;
            case "triangleRight":
                m = this.drawTriangleRight(b);
                h = -k;
                e = -1;
                d = k + 4;
                break;
            case "arrowUp":
                m = this.drawArrowUp(b);
                a.hide();
                break;
            case "arrowDown":
                m = this.drawArrowDown(b);
                a.hide();
                d = k + 4;
                break;
            case "text":
                e = -1;
                m = this.drawTextBackground(b, a);
                f = this.labelHeight + 3;
                d = k + 10;
                break;
            case "round":
                m = this.drawCircle(b)
        }
        this.bullets[c] = m;
        this.showOnAxis ? (m = isNaN(this.nextAxisY) ? this.axisCoordinate : this.nextY, k = f * e, this.nextAxisY = m + e * d) : (m = this.nextY, k = f * e);
        a.translate(h, k);
        b.push(a);
        b.translate(0, m);
        this.addEventListeners(b, c);
        this.nextY = m + e * d;
        this.stackDown = g
    },
    addEventListeners: function(a, b) {
        var c = this;
        a.click(function() {
            c.handleClick(b)
        }).mouseover(function() {
                c.handleMouseOver(b)
            }).touchend(function() {
                c.handleMouseOver(b, !0)
            }).mouseout(function() {
                c.handleMouseOut(b)
            })
    },
    drawPin: function(a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.fontSize + 4;
        return this.drawRealPolygon(a, [0, c / 2, c / 2, -c / 2, -c / 2, 0], [0, b * c / 4, b * (c + c / 4), b * (c + c / 4), b * c / 4, 0])
    },
    drawSign: function(a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.mastHeight * b,
            d = this.fontSize / 2 + 2,
            e = AmCharts.line(this.container, [0, 0], [0, c], this.borderColor, this.borderAlpha, 1),
            g = AmCharts.circle(this.container, d, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        g.translate(0, c + d * b);
        a.push(e);
        a.push(g);
        this.set.push(a);
        return g
    },
    drawFlag: function(a) {
        var b = -1;
        this.stackDown && (b = 1);
        var c = this.fontSize + 4,
            d = this.labelWidth + 6,
            e = this.mastHeight,
            b = 1 == b ? b * e : b * e - c,
            e = AmCharts.line(this.container, [0, 0], [0, b], this.borderColor, this.borderAlpha, 1),
            c = AmCharts.polygon(this.container, [0, d, d, 0], [0, 0, c, c], this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        c.translate(0, b);
        a.push(e);
        a.push(c);
        this.set.push(a);
        return c
    },
    drawTriangleUp: function(a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, b, b, 0])
    },
    drawArrowUp: function(a) {
        var b = this.size,
            c = b / 2,
            d = b / 4;
        return this.drawRealPolygon(a, [0, c, d, d, -d, -d, -c, 0], [0, c, c, b, b, c, c, 0])
    },
    drawArrowDown: function(a) {
        var b = this.size,
            c = b / 2,
            d = b / 4;
        return this.drawRealPolygon(a, [0, c, d, d, -d, -d, -c, 0], [0, -c, -c, -b, -b, -c, -c, 0])
    },
    drawTriangleDown: function(a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b / 2, -b / 2, 0], [0, -b, -b, 0])
    },
    drawTriangleLeft: function(a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, b, b, 0], [0, -b / 2, b / 2])
    },
    drawTriangleRight: function(a) {
        var b = this.fontSize + 7;
        return this.drawRealPolygon(a, [0, -b, -b, 0], [0, -b / 2, b / 2, 0])
    },
    drawRealPolygon: function(a, b, c) {
        b = AmCharts.polygon(this.container, b, c, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        a.push(b);
        this.set.push(a);
        return b
    },
    drawCircle: function(a) {
        shape = AmCharts.circle(this.container, this.fontSize / 2, this.backgroundColor, this.backgroundAlpha, 1, this.borderColor, this.borderAlpha);
        a.push(shape);
        this.set.push(a);
        return shape
    },
    drawTextBackground: function(a, b) {
        var c = b.getBBox(),
            d = -c.width / 2 - 5,
            e = c.width / 2 + 5,
            c = -c.height - 12;
        return this.drawRealPolygon(a, [d, -5, 0, 5, e, e, d, d], [-5, -5, 0, -5, -5, c, c, -5])
    },
    handleMouseOver: function(a, b) {
        b || this.bullets[a].attr({
            fill: this.rollOverColors[a]
        });
        var c = this.eventObjects[a],
            d = {
                type: "rollOverStockEvent",
                eventObject: c,
                graph: this.graph,
                date: this.date
            },
            e = this.bulletConfig.eventDispatcher;
        d.chart = e;
        e.fire(d.type, d);
        c.url && this.bullets[a].setAttr("cursor", "pointer");
        this.chart.showBalloon(c.description, e.stockEventsSettings.balloonColor, !0)
    },
    handleClick: function(a) {
        a = this.eventObjects[a];
        var b = {
                type: "clickStockEvent",
                eventObject: a,
                graph: this.graph,
                date: this.date
            },
            c = this.bulletConfig.eventDispatcher;
        b.chart = c;
        c.fire(b.type, b);
        b = a.urlTarget;
        b || (b = c.stockEventsSettings.urlTarget);
        AmCharts.getURL(a.url, b)
    },
    handleMouseOut: function(a) {
        this.bullets[a].attr({
            fill: this.backgroundColors[a]
        });
        a = {
            type: "rollOutStockEvent",
            eventObject: this.eventObjects[a],
            graph: this.graph,
            date: this.date
        };
        var b = this.bulletConfig.eventDispatcher;
        a.chart = b;
        b.fire(a.type, a)
    }
});