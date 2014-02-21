/**
 * Created with JetBrains WebStorm.
 * User: andy-guo
 * Date: 12-11-15
 * Time: 下午3:50
 * 统一功能
 */
Namespace.register('Agi.Script');
//公共方法
Agi.Script.Utility = {
    //实现控件的关系数据源重新绑定
    updateRelationData:function (controls) {
        'use strict';
        if (controls && controls instanceof Array) {
            $(controls).each(function (i, con) {
                if (con.ReBindRelationData) {
                    con.ReBindRelationData();
                }
            });
        } else {
            throw 'method updateRelationData parameter must be a array';
        }
    },
    //注册点位号
    registTagNamesForControls:function (controls, tagNames) {
        'use strict';
        if (controls && controls instanceof Array) {
            $(controls).each(function (i, con) {
                if (con.AddTagNames) {
                    con.AddTagNames(con, tagNames);
                }
            });
        } else {
            throw 'method add TagName parameter must be a array';
        }
    },

    //拓展highChart的线可配置
    highChartSeriesConfigable:function (control) {
        'use strict';

        //修改指定series的类型/颜色 的方法
        function changeSeriesTyle(chartObj, serieIndex, nType, nColor) {
            /*jshint validthis:true */
            var self = this;
            //alert(nColor);
            var series = [];
            var nColor1 = nColor;
            $(chartObj.series).each(function (i, ser) {
                var aSerie = {
                    data:[],
                    type:ser.options.type,
                    lineWidth:ser.options.lineWidth,
                    lineColor:ser.options.lineColor, //如果type是线,这个会影响无法修改颜色
                    shadow:ser.options.shadow,
                    marker:ser.options.marker,
                    color:ser.options.color,
                    point:ser.options.point
                };
                //debugger;
                $(ser.data).each(function (i, d) {
                    //debugger;
                    aSerie.data.push({
                        x:d.x,
                        y:d.y,
                        marker:aSerie.marker
                    });
                });
                aSerie.name = ser.name;
                series.push(aSerie);//
                ser.remove();
            });
            // debugger;
            $(series).each(function (i, s) {
                if (serieIndex === i) {
                    s.type = nType;
                    if (nColor1) {
                        s.color = nColor1;
                        if(s.marker){
                            s.marker.fillColor = nColor1;
                        }
                    }

                    if (s.type === 'line' || s.type === 'spline') {
                        delete s.lineColor;
                    }
                }
                //debugger;
                //console.log(JSON.stringify(s));
                chartObj.addSeries(s);
            });
            self.fireScriptCode('updateAllSeries');
        }

        function legendClickCallBack(event) {
            /*jshint validthis:true */
            $('.pop_close').click();//关闭其它的弹出窗口
            var legIndex = $(this).index();
            var serColor = highChartObj.series[legIndex].color;
            var serType = highChartObj.series[legIndex].type;
            var data = $(this).data("popbox");
            if (data) {
                $(this).popbox("setPos", data.position);//这里重新定位
            }
            else {
                event.preventDefault();
                //debugger;
                //弹出tips
                var popbox = $(this).popbox({
                    boxClass:'sd_poptip',
                    zIndex:2000000,
                    isCreate:1,
                    //"iconClass":"icon_error",
                    closeAble:true,
                    offset:20,
                    width:200,
                    directing:0,
                    direction:"bottomR",
//                        direction:{
//                            "popBoxOffsetT":20,
//                            "popBoxOffsetL":50,
//                            "popBoxT":20,
//                            "popBoxL":20
//                        },
                    "content":function () {
                        var _this = this;
                        //用作loading
                        _this.setContent('<div style="width: auto; height: auto; border: 0 solid red; display: inline-block; background: #273746">' +
                            '<div class="control-group" style="margin-bottom: 0;">' +
                            '<label class="chart-select-label">类型:</label>' +
                            '<div style="margin: 2px 5px;">' +
                            '<img class="chart-select-item" src="js/Controls/BasicChart/img/area_chart.png" alt="area">' +
                            '<img class="chart-select-item" src="js/Controls/BasicChart/img/column_chart.png" alt="column">' +
                            '<img class="chart-select-item" src="js/Controls/BasicChart/img/line_chart.png" alt="line">' +
                            '</div>' +
                            '</div>' +
                            '<div class="control-group" style="margin-bottom: 0;">' +
                            '<label class="chart-select-label">颜色:</label>' +
                            '<div style="margin: 2px 5px;">' +
                            '<div class="chart-select-item" style="background: RGBA(72,168,79,0.54);"></div>' +
                            '<div class="chart-select-item" style="background: RGBA(27,112,176,0.54);"></div>' +
                            '<div class="chart-select-item" style="background: RGBA(240,214,105,0.52);"></div>' +
                            '<div class="chart-select-item" style="background: RGBA(255,37,64,0.52);"></div>' +
                            '</div>' +
                            '</div>' +
                            '</div>');
                    },

                    'callBack':function () {
                        //变类型
                        var types = this.$popContent.find('img[class="chart-select-item"]');
                        types.unbind('click').bind('click', function (e) {
                            serColor = highChartObj.series[legIndex].color;
                            changeSeriesTyle.call(control, chart, legIndex, $(this).attr('alt'), null);
                            if (control.addPlotLines) {
                                control.addPlotLines();
                            }
                        });
                        //变颜色
                        var colors = this.$popContent.find('div[class="chart-select-item"]');
                        colors.unbind('click').bind('click', function () {
                            serType = highChartObj.series[legIndex].type;
                            changeSeriesTyle.call(control, chart, legIndex, serType, $(this).css('background-color'));
                            if (control.addPlotLines) {
                                control.addPlotLines();
                            }
                        });
                    }//end callBack

                });
            }
        }

        if (!control.getInsideControl) {
            console.log(control.Get('HTMLElement').id + ' 没有实现 getInsideControl 方法');
            return;
        }
        //找到内部的第三方控件
        var highChartObj = control.getInsideControl();
        if (!highChartObj) {
            return;
        }
        var chart = highChartObj;
        //找到legendDOM元素
        var legends = $('.highcharts-legend-item', highChartObj.container.offsetParent);


        //为legend绑定弹出窗口
        legends.each(function (i, leg) {
            leg.onclick = "return false;";
            $(leg).unbind('click').bind('click', legendClickCallBack)
                .unbind('touchstart').bind('touchstart', legendClickCallBack);
        });//end legends

    }, //end highChartSeriesConfigable

    //滑动切换控件的效果
    flowControlsExpand:function () {
        'use strict';
        alert('flowControlsExpand not implement!');
//        'use strict';
//        var myAnimate = null, myTransit = null;
//
//        var currentIndex = -1, //当前显示的控件索引
//            controls = [];
//        agi.using(["my/animate", "jquery/transit"], function (animate, transit) {
//            myAnimate = animate;
//
//
//            $('html:eq(0)').css({'overflow-x':'hidden'})
//                .find('body:eq(0)')[0].onselect = "return false;";
//
//            //1 为所有control加上滑动事件
//            for (var i = 0; i < controlArray.length; i++) {
//                var ctrs = controlArray[i];
//
//                var aGroupControl = {
//                    switchIndex:i,
//                    controls:[]
//                };
//                //分组控件
//                for (var j = 0; j < ctrs.length; j++) {
//                    var con = ctrs[j];
//
//                    //if (j <= 0) {
//                    var htmlObj = $(con.Get('HTMLElement'));
//                    var hm = htmlObj.data('hammer');
//                    if (hm !== null) {
//                        //debugger;
//                        hm['onswipe'] = (function (el, eventName, aGroupControl) {
//                            return function (ev) {
//                                //el.trigger(jQuery.Event(eventName, ev));
//                                //debugger;
//                                var index = aGroupControl.switchIndex;
//                                var param = {
//                                    direction:ev.direction,
//                                    index:index
//                                };
//                                controlSwitch(param, myAnimate);
//                            };
//                        })(htmlObj, 'onswipe', aGroupControl);
//                    } else {
//                        htmlObj.hammer({
//                            swipe_time:200,
//                            swipe_min_distance:100,
//                            prevent_default:true,
//
//                            scale_treshold:0,
//                            drag_min_distance:0
//                        })
//                            .bind("swipe", {'conGroup':aGroupControl}, function (ev) {
//                                //direction: "left""right"
//                                //debugger;
//                                var index = ev.data.conGroup.switchIndex;
//                                var param = {
//                                    direction:ev.direction,
//                                    index:index
//                                };
//                                controlSwitch(param, myAnimate);
//                            });//end hammer
//                    }
//                    //}
//                    aGroupControl.controls.push(con);
//                    if (aGroupControl.switchIndex > 0) {
//                        //agi.using(["my/animate", "jquery/transit"], function (animate, transit) {
//                        for (var k = 0; k < aGroupControl.controls.length; k++) {
//                            var otherCon = aGroupControl.controls[k];
//                            var html = $("#" + myAnimate.get(otherCon)).css({x:1500});
//                        }
//                        //});
//                    }
//                }//end for
//                controls.push(aGroupControl);
//
//            }//end for
//            currentIndex = 0;
//        });
//
//
//        function controlSwitch(param, animateIn) {
//            var direction = param.direction;
//            var showControlIndex = param.index;//要显示的控件索引
//            var curControls = controls[showControlIndex].controls;
//            var nextControls = [];
//            var myAnimate = animateIn;
//            switch (direction) {
//                case "left":
//                {
//                    //debugger;
//                    if (currentIndex < controls.length - 1) {
//                        currentIndex++;
//                        //下一组控件显示
//                        nextControls = controls[currentIndex].controls;
//                        //agi.using(["my/animate", "jquery/transit"], function (animate, transit) {
//                        var i = 0;
//                        for (; i < curControls.length; i++) {
//                            var curControl = curControls[i];
//                            $("#" + myAnimate.get(curControl)).transit(
//                                {
//                                    x:-1500,
//                                    //y:60,
//                                    //rotate: '-60deg',
//                                    duration:600,
//                                    easing:'in',
//                                    complete:function () {
////                                            $(this).css({
////                                                y:0,
////                                                rotate:'0deg'
////                                            });
//                                        for (var i = 0; i < nextControls.length; i++) {
//                                            var nextControl = nextControls[i];
//                                            $("#" + myAnimate.get(nextControl)).transit({x:0});
//                                        }
//                                    }
//                                });
//                        }
//                        //});
//                    }
//                }
//                    break;
//                case "right":
//                {
//                    if (currentIndex > 0) {
//                        currentIndex--;
//                        //下一个控件显示
//                        nextControls = controls[currentIndex].controls;
//                        //agi.using(["my/animate", "jquery/transit"], function (animate, transit) {
//                        var j = 0;
//                        for (; j < curControls.length; j++) {
//                            var curControl = curControls[j];
//                            $("#" + myAnimate.get(curControl)).transit(
//                                {
//                                    x:1500,
////                                        y:60,
////                                        rotate: '60deg',
//                                    duration:600,
//                                    easing:'in',
//                                    complete:function () {
////                                            $(this).css({
////                                                y:0,
////                                                rotate:'0deg'
////                                            });
//                                        for (var i = 0; i < nextControls.length; i++) {
//                                            var nextControl = nextControls[i];
//                                            $("#" + myAnimate.get(nextControl)).transit({x:0});
//                                        }
//                                    }
//                                });
//                        }
//                        //});
//                    }
//                }
//                    break;
//            }
//            //console.log('currentIndex : ' + currentIndex);
//        }
    },

    //滑动切换控件的效果2
    flowControlsExpand2:function (animate, controlArray) {
        'use strict';
        ($('head')).prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">');
        var myAnimate = null;
        var workspace = $('#workspace');
        var currentIndex = -1, //当前显示的控件索引
            controls = [];
        //agi.using(["my/animate", "jquery/transit"], function (animate, transit) {
        myAnimate = animate;


        $('html:eq(0)').css({'overflow-x':'hidden'});
//                .find('body:eq(0)')[0].onselect = "return false;";

        //1 为所有control加上滑动事件
        for (var i = 0; i < controlArray.length; i++) {
            var ctrs = controlArray[i];

            var aGroupControl = {
                switchIndex:i,
                controls:[],
                tagert:null
            };
            aGroupControl.target = $('<div class="swipeGroup"></div>').appendTo(workspace);//添加组
            aGroupControl.target.css({
                width:window.screen.width * 0.2,
                height:window.screen.height * 0.2
            });

            //分组控件---------------------------------
            for (var j = 0; j < ctrs.length; j++) {
                var con = ctrs[j];
                if (!con) {
                    continue;
                }
                var htmlObj = $(con.Get('HTMLElement'));
                htmlObj.appendTo(aGroupControl.target);//构造组

            }//end for

            if (aGroupControl.switchIndex > 0) {
                //agi.using(["my/animate", "jquery/transit"], function (animate, transit) {
                //for(var k = 0; k<aGroupControl.controls.length;k++){
                //var otherCon = aGroupControl.controls[k];
                aGroupControl.target.css({x:1500});//隐藏其它组
                //}
                //});
            }

            controls.push(aGroupControl);

            //为每组添加滑动事件
            var hm = aGroupControl.target.data('hammer');
            if (hm) {
                //debugger;
                hm.onswipe = (function (el, eventName, aGroupControl) {
                    return function (ev) {
                        //el.trigger(jQuery.Event(eventName, ev));
                        //debugger;
                        var index = aGroupControl.switchIndex;
                        var param = {
                            direction:ev.direction,
                            index:index
                        };
                        controlSwitch(param);
                    };
                })(htmlObj, 'onswipe', aGroupControl);
            } else {
                aGroupControl.target.hammer({
                    swipe_time:500,
                    swipe_min_distance:100,
                    prevent_default:false,

                    scale_treshold:0,
                    drag_min_distance:0
                })
                    .bind("swipe", {'conGroup':aGroupControl}, function (ev) {
                        //direction: "left""right"
                        //debugger;
                        var index = ev.data.conGroup.switchIndex;
                        var param = {
                            direction:ev.direction,
                            index:index
                        };
                        controlSwitch(param, myAnimate);
                    });//end hammer
            }

        }//end for
        currentIndex = 0;
        //});


        function controlSwitch(param) {
            //debugger;
            var direction = param.direction;
            var showControlIndex = param.index;//要显示的控件索引
            var curCroup = controls[showControlIndex].target;
            var nextGroup = null;
            //var myAnimate = animateIn;
            switch (direction) {
                case "left":
                {
                    if (currentIndex < controls.length - 1) {
                        currentIndex++;
                        //下一组控件显示
                        nextGroup = controls[currentIndex].target;
                        curCroup.transit(
                            {
                                x:-1500
                            });
                        nextGroup.transit({x:0});
                    }
                }
                    break;
                case "right":
                {
                    if (currentIndex > 0) {
                        currentIndex--;
                        nextGroup = controls[currentIndex].target;
                        curCroup.transit(
                            {
                                x:1500
                            });
                        nextGroup.transit({x:0});
                    }
                    //});
                }
                    break;
            }//end switch

        }//end controlSwitch
    },

    //为控件加上缩放手势
    transformingControl:function (animate, controlArray, zoomInCallBack, zoomOutCallBack) {
        'use strict';

        function transformendCallBack(e) {
            //debugger;
            e.preventDefault();
            var con = e.data.con;
            if (e.scale > 1) {
                excuteCallBack(con, zoomInCallBack);
            } else if (e.scale < 1) {
                excuteCallBack(con, zoomOutCallBack);
            }
        }//end transformendCallBack
        //执行回调函数
        function excuteCallBack(con, cbFun) {
            //console.log(con);
            //console.log(cbFun);
            if (cbFun !== undefined) {
                if (typeof cbFun === 'function') {
                    //console.log('animate:'+animate);
                    cbFun.call(con, animate);
                }
            }
        }

        ($('head')).prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">');
        //debugger;
        for (var i = 0; i < controlArray.length; i++) {
            var con = controlArray[i];
            var htmlObj = $(con.Get('HTMLElement'));
            var hm = htmlObj.data('hammer');
            if (hm) {
                //debugger;
                hm.ontransformend = (function (control, zIn, zOut) {
                    return function (e) {
                        if (e.scale > 1) {
                            excuteCallBack(control, zIn);
                            //console.log('放大1');
                        } else if (e.scale < 1) {
                            excuteCallBack(control, zOut);
                            //console.log('缩小1');
                        }
                    }
                })(con, zoomInCallBack, zoomOutCallBack);
            } else {
                htmlObj.hammer({
                    prevent_default:true,
                    scale_treshold:0,
                    drag_min_distance:0
                })
                    .bind('transformend', {'con':con}, transformendCallBack);
            }
        }//end for
    },

    //datagrid 滚动条支持iPad(暂时不用,与框架有事件冲突)
    datagridSupplyScroll:function (dataGrid) {
        "use strict";
        var grid = dataGrid;
        if (grid) {
            var isPad = ('createTouch' in document);
            if (isPad) {
                var scrollObj = $(grid.Get('HTMLElement')).find('.wijmo-wijsuperpanel-contentwrapper')[0];
                if (scrollObj) {
                    console.log('scroll obj is found!');
                    grid.iscrollPad = new iScroll(scrollObj, {
                        hScrollbar:false,
                        vScrollbar:false,
                        fixedScrollbar:false,
                        bounce:false,
                        momentum:false,
                        onScrollStart: function (e) { e.preventDefault(); e.stopPropagation();
                            agi.using(['../myPage'],function(myPage){
                                myPage.enable = false;
                            });
                        },
                        onScrollEnd: function () {
                            agi.using(['../myPage'],function(myPage){
                                myPage.enable = true;
                            });
                        }
                    });
                }
            }
        }
        return null;
    },

    //chart 手势,圈选数据,生成新图表,grid高亮..
    chartGestureExpand1:function (chart1, chart2, grid, animateIn) {
        'use strict';
        ($('head')).prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">');
        //$(window).unbind('resize');//这里可以防止datagrid不停的刷新
        //var myAnimate = null;
        if (!animateIn) {
            alert('no animate!');
        }
        return (function (chart1, chart2, grid) {
            function initialHammer(obj){
                if(obj){
                    $(obj).hammer({
                        swipe_time:1000,
                        swipe_min_distance:50,
                        prevent_default:false,
                        scale_treshold:0,
                        drag:false
                    });
                    console.log('为对象初始化手势!');
                }
            }
            //查询charth上的点位,哪些被选中
            function checkPoint(offset, chartConfig) {
                //return;
                var chart = chartConfig.hchart;
                chart.showLoading('正在计算选中数据...');
//                console.log('checkPoint:' + JSON.stringify(offset));
                var selColor = '#00FF00';
                var count = 0;
                var seriesLength = chart.series.length;
                for (var i = 0; i < seriesLength; i++) {
                    var ser = chart.series[i];
                    var pointsLength = ser.points.length;
                    for (var j = 0; j < pointsLength; j++) {
                        var pt = ser.points[j];
                        var ptOffset = $(pt.graphic.element).offset();
                        var x = ptOffset.left;
                        var y = ptOffset.top;
//                        console.log('pt:'+x +':' +y);
                        if (x >= offset.left && y >= offset.top && x < (offset.left + offset.width) && y < (offset.top + offset.height)) {
                            count++;
                            ser.gestureSelected = true;
                            pt.gestureSelected = true;
                            if (i <= 0) {
                                if (grid) {
                                    grid.highLightSpcData(j, 2);
                                }
                            }
                            if (ser.type === 'column') {
                                pt.update({
                                    color:selColor
//                                    marker:{
//                                        fillColor:selColor,
//                                        states:{
//                                            hover:{
//                                                fillColor:'#f00',
//                                                radius:4.0
//                                            }
//                                        }
//                                    }
                                });
                            } else {
                                pt.update({
                                    color:selColor,
                                    marker:{
                                        fillColor:selColor,
                                        radius:10
                                    }
                                });
                            }
                        }
                    }//end for pt
                }//end for series
                //alert(count);
                chart.hideLoading();
            }// end checkPoint

            //原生的拖拽处理(必须两个手指)
            function touchstartCallBack(ev, chartconfig) {
                if (!chartconfig) {
                    return;
                }
                var offset = chartconfig.offset;
                if (ev.touches.length > 1) {
                    offset.x1 = ev.touches[1].pageX;//x1
                    offset.y1 = ev.touches[1].pageY;//y1
                }
            }

            function touchmoveCallBack(ev, chartconfig) {
                if (!chartconfig) {
                    return;
                }
                var offset = chartconfig.offset;
                if (ev.touches.length > 1) {
                    var x = ev.touches[1].pageX;
                    var y = ev.touches[1].pageY;
//                    console.log(x);
                    if (x > offset.x2) {
                        offset.x2 = x;//x2
                    }
                    if (y < offset.y1) {
                        offset.y1 = y; //y1
                    } else {
                        offset.y2 = y; //y2
                    }
                }
            }

            function touchendCallBack(ev, chartconfig) {
                if (!chartconfig) {
                    return;
                }
                //console.log('ev:' + ev + 'chartconfig:' + chartconfig);
                var offset = chartconfig.offset;
                if (offset.x1 <= 0 ||
                    offset.x2 <= 0 ||
                    offset.y1 <= 0 ||
                    offset.y2 <= 0) {
                    return;
                }
                if (ev.touches.length > 0) {
//                    console.log('prototype ok' + 'pts count:' +  pts.length);
                    //calculate w,h
                    offset.width = offset.x2 - offset.x1;
                    offset.height = offset.y2 - offset.y1;

                    console.log(JSON.stringify(offset));
                    checkPoint({
                        left:offset.x1,
                        top:offset.y1,
                        width:offset.width,
                        height:offset.height
                    }, chartconfig);
                    offset.x1 = 0;
                    offset.x2 = 0;
                    offset.y1 = 0;
                    offset.y2 = 0;
                }
            }

            //得到手势圈选的数据
            function gestureSelectData(chartConfig) {
                //开始
                chartConfig.container.ontouchstart = (function (fun, chartConf) {
                    return function (e) {
                        fun(e, chartConf);
                    };
                })(touchstartCallBack, chartConfig);
                //拖动中
                chartConfig.container.ontouchmove = (function (fun, chartConf) {
                    return function (e) {
                        fun(e, chartConf);
                    };
                })(touchmoveCallBack, chartConfig);
                //拖动结束
                chartConfig.container.ontouchend = (function (fun, chartConf) {
                    return function (e) {
                        fun(e, chartConf);
                        if (dragObj.html) {
                            dragObj.html.hide();
                        }
                    };
                })(touchendCallBack, chartConfig);
            }

            function exsitGestureData(chart) {
                var ret = false;
                for (var i = 0; i < chart.series.length; i++) {
                    var ser = chart.series[i];
                    if (ser.gestureSelected) {
                        ret = true;
                        break;
                    }
                }
                return ret;
            }

            //功能2:图表数据选中后,grid 中相关数据 高亮(已经在 checkPoin t函数中处理)
            //功能3:选中的数据可以拖出,生成新的chart
            function getRadam(min, max) {
                return parseInt(Math.random() * (min - max + 1) + max);
            }
            function createChart2DataFromChart1(chart1, chart2) {
                //clear chart2 data
                $(chart2.series).each(function (i, ser) {
                    ser.remove();
                });
                // get selected data from chart1
                var nSeries = [];
                for (var i = 0; i < chart1.series.length; i++) {
                    var ser = chart1.series[i];
                    var tempSer = {
                        data:[],
                        type:ser.options.type,
                        lineWidth:ser.options.lineWidth,
                        lineColor:ser.options.lineColor, //如果type是线,这个会影响无法修改颜色
                        shadow:ser.options.shadow,
                        marker:ser.options.marker,
                        color:ser.options.color,
                        point:ser.options.point
                    };
                    if (ser.gestureSelected) {
                        nSeries.push(tempSer);
                    }
                    for (var j = 0; j < ser.points.length; j++) {
                        var pt = ser.points[j];
                        if (pt.gestureSelected) {
                            tempSer.data.push({
                                x:pt.x,
                                y:pt.y,
                                marker:ser.marker
                            });
                        }

                    }//end for points
                }//end for series
                while (nSeries.length) {
                    chart2.addSeries(nSeries.shift());
                }
                if (grid) {
                    //高亮grid
                    grid.highLightSpcData(-1, 3);
                    var rd = getRadam(0,2);
                    grid.highLightSpcData(rd, 2);
                }
            }


            //利用hammer实现单手拖拽,产生拖动效果
            function addDragHandler(chartConfig, target) {
                var isPad = ('createTouch' in document);
                if (!isPad) {
                    return;
                }
                var element = $(chartConfig.container);
                $('#workspace').hammer({
//                    swipe_time:20,
//                    swipe_min_distance:1000,
                    prevent_default:false,
//                    scale_treshold:0,
                    drag:true,
                    drag_min_distance:100
                })
                    .bind('dragstart', function (ev) {
                        //debugger;
                        var exsitSelectedData = exsitGestureData(chartConfig.hchart);
                        var x = ev.touches[0].x;
                        var y = ev.touches[0].y;
                        var offset = element.offset();
                        if (x >= offset.left && y >= offset.top && x < (offset.left + element.width()) && y < (offset.top + element.height()) && exsitSelectedData) {
                            //console.log('body drag start');
                            if (!dragObj.html) {
                                dragObj.html = $('<div style="position: absolute;z-index: 2000000;background: transparent;top: 0;left: 0;display: block"><img style="width: 60px;height: 30px;" src="js/Controls/KPIMenu/img/icon-chart.png" /></div>');
                                dragObj.html.appendTo($('body'));
                                dragObj.w = dragObj.html.width();
                                dragObj.h = dragObj.html.height();
                            }
                            dragObj.html.css({
                                top:(y - dragObj.h - 15) + 'px',
                                left:(x - dragObj.w - 15) + 'px'
                            }).show();
                        }
                    })
                    .bind('drag', function (ev) {
                        if (dragObj.html) {
                            dragObj.html.css({
                                top:(ev.touches[0].y - dragObj.h - 15) + 'px',
                                left:(ev.touches[0].x - dragObj.w - 15) + 'px'
                            });
                            dragObj.stopX = ev.touches[0].x;
                            dragObj.stopY = ev.touches[0].y;

                            if (!chart1Config.isDragOut && dragObj.stopX > (chart1Config.shell.offset().left + chart1Config.shell.width())) {

                                chart1Config.isDragOut = true;
                                chart1Config.shell.transition({
                                    duration:500,
                                    width:(chart1Config.shell.width() * 0.5)
                                }, function () {
                                    chart1Config.hchart.setSize(chart1Config.shell.width(), chart1Config.shell.height());
                                    chart2Config.shell.transition({
                                        scale:[1, 1],
                                        opacity:1,
                                        y:0
                                    },800);
                                    window.gesture2HandlerOpen = true;
                                });
                            }
                        }
                    })
                    .bind('dragend', function (ev) {
//                        alert('dragend');
                        if (dragObj.html) {
                            dragObj.html.hide();
                            //console.log('chart objcect already release');
//                            console.log('type:' + ev.originalEvent.touches[1].pageX);
                            if (!ev.touches.length) {
//                                var ps = [];
//                                for(var k in ev.originalEvent){
//                                    ps.push(k);
//                                }
//                                console.log(ps);
//                                return;
                            }
//                            alert(ev.originalEvent.touches.length);
                            var x = dragObj.stopX;
                            var y = dragObj.stopY;

                            var offset = $(target.container).offset();
                            if (x >= offset.left && y >= offset.top && x < (offset.left + element.width()) && y < (offset.top + element.height())){
                                //if (chart1Config.isDragOut) {
                                console.log('found');
                                createChart2DataFromChart1(hchart1, hchart2);
                            }
                        }

                    });
            }




            //功能4:选中的数据向上拖动,可以删除它
            function swipeDeleteSelectedData(chart) {
                var container = $(chart.container);
                var hm = container.data('hammer');
                var distanceLimite = container.height() * 0.3;
                if(hm){
                    container.bind('swipe',function(ev){
                        //var distanceLimite = container.height() * 0.3;
                        if (ev.direction === 'up' && ev.distance > distanceLimite) {
                            if (grid) {
                                grid.highLightSpcData(-1, 3);
                            }
                            var pts = [];
                            for (var i = 0; i < chart.series.length; i++) {
                                var ser = chart.series[i];
                                for (var j = 0; j < ser.points.length; j++) {
                                    var pt = ser.points[j];
                                    if (ser.gestureSelected && pt.gestureSelected) {
                                        pts.push(pt);
                                    }
                                }
                            }
                            var delPt = null;
                            //debugger;
                            while (pts.length) {
                                delPt = pts.pop();
                                delPt.series.gestureSelected = false;
                                delPt.remove();
                            }
                        }
                    });
                }else{
                    container.hammer({
                        swipe_time:1000,
                        swipe_min_distance:20,
                        prevent_default:false
                    }).bind('swipe', function (ev) {
                            //var distanceLimite = container.height() * 0.3;
                            if (ev.direction === 'up' && ev.distance > distanceLimite) {
                                if (grid) {
                                    grid.highLightSpcData(-1, 3);
                                }
                                var pts = [];
                                for (var i = 0; i < chart.series.length; i++) {
                                    var ser = chart.series[i];
                                    for (var j = 0; j < ser.points.length; j++) {
                                        var pt = ser.points[j];
                                        if (ser.gestureSelected && pt.gestureSelected) {
                                            pts.push(pt);
                                        }
                                    }
                                }
                                var delPt = null;
                                //debugger;
                                while (pts.length) {
                                    delPt = pts.pop();
                                    delPt.series.gestureSelected = false;
                                    delPt.remove();
                                }
                            }
                        });
                }
            }
            //取消数据点的选中状态
            function cancleSelectData(chart){
                var container = $(chart.container);
                var hm = container.data('hammer');
                if(hm){
                    hm.ontap = function(){
                        //console.log('cancleSelectData is fired 1!');
                        //chart.showLoading('正在取消选中数据...');
                        var seriesLength = chart.series.length;
                        for (var i = 0; i < seriesLength; i++) {
                            var ser = chart.series[i];
                            ser.gestureSelected = false;
                            var pointsLength = ser.points.length;
                            for (var j = 0; j < pointsLength; j++) {
                                var pt = ser.points[j];
                                if(pt.gestureSelected){
                                    pt.gestureSelected = false;
                                    pt.update({
                                        //color:cancle,
                                        marker:{
                                            fillColor:'#FFFFFF',
                                            radius:3
                                        }
                                    });
                                }
                            }//end for
                        }//end for
                        //chart.hideLoading();
                        grid.highLightSpcData(-1, 3);
                    };
                }else{
                    container.hammer({
                        swipe_time:1000,
                        swipe_min_distance:20,
                        prevent_default:false,
                        scale_treshold:0,
                        drag_min_distance:0
                    }).bind('tap', function () {
                            for (var i = 0; i < chart.series.length; i++) {
                                var ser = chart.series[i];
                                ser.gestureSelected = false;
                                for (var j = 0; j < ser.points.length; j++) {
                                    var pt = ser.points[j];
                                    pt.gestureSelected = false;
                                }//end for
                            }//end for
                            //取消grid高亮
                            grid.highLightSpcData(-1, 3);
                        });
                }
            }

            //添加滑动排序的处理
            function swipeSort(chart, isClose) {
                var container = $(chart.container);
                container.hammer({
                    swipe_time:1000,
                    swipe_min_distance:50,
                    prevent_default:true,
                    scale_treshold:0,
                    drag:false
                }).bind('swipe', function (ev) {
                        var h = container.height();
                        var w = container.width();
                        var distanceLimite = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) * 0.8;
                        //console.log('direction:'+e.direction + '>angle:' + e.angle + '>distance:' + e.distance);
                        if (ev.direction === 'right' && ev.distance > distanceLimite && ev.angle > 10) {
                            sortChart(chart, 'des');
                            if (grid) {
                                grid.highLightSpcData(-1, 3);
                            }
                        } else if (ev.direction === 'right' && ev.distance > distanceLimite && ev.angle > -50 && ev.angle < 0) {
                            sortChart(chart, 'asc');
                            if (grid) {
                                grid.highLightSpcData(-1, 3);
                            }
                        }
                        if (dragObj.html) {
                            dragObj.html.hide();
                        }
                    });
                if (isClose) {
                    var hm = container.data('hammer');
                    if (hm) {
                        hm.ondoubletap = function () {
                            chart1Config.isDragOut = false;
                            chart1Config.shell.transit({
                                width:(chart1Config.shell.width() * 2)
                            },800, function () {
                                chart1Config.hchart.setSize(chart1Config.shell.width(), chart1Config.shell.height());
                                chart2Config.shell.transition({
                                    scale:[0, 0],
                                    opacity:0,
                                    y:300
                                },800,function(){
                                    while(chart2Config.hchart.series.length){
                                        chart2Config.hchart.series.pop().remove();
                                    }
                                });
                                window.gesture2HandlerOpen = false;
                            });
                        }
                    }
                }
//                ev.preventDefault();
//                ev.stopPropagation();
            }
            //对图表重新排序方式
            function sortChart(chart, direction) {
                //chart.showLoading('排序进行中...');
                var nSeries = [];
                for (var i = 0; i < chart.series.length; i++) {
                    var ser = chart.series[i];
                    var tempSer = {
                        data:[],
                        name:ser.name,
                        type:ser.options.type,
                        lineWidth:ser.options.lineWidth,
                        lineColor:ser.options.lineColor, //如果type是线,这个会影响无法修改颜色
                        shadow:ser.options.shadow,
                        marker:ser.options.marker,
                        color:ser.options.color,
                        point:ser.options.point
                    };
                    nSeries.push(tempSer);
                    var pt = null;
                    for (var j = 0; j < ser.points.length; j++) {
                        pt = ser.points[j];
                        tempSer.data.push({
//                            x:pt.x,
                            y:pt.y,
                            name:pt.name,
                            category:pt.category,
                            marker:ser.marker
                        });
                    }//end for points
                    if (direction === 'asc') {
                        tempSer.data.sort(function (a, b) {
                            return a.y - b.y;
                        });
                    } else {
                        tempSer.data.sort(function (a, b) {
                            return -(a.y - b.y);
                        });
                    }
                    for (var k = 0; k < tempSer.data.length; k++) {
                        tempSer.data.x = k;
                    }
                }//end for series
                while (chart.series.length) {
                    chart.series.pop().remove();
                }
                while (nSeries.length) {
                    chart.addSeries(nSeries.shift());
                }
                //chart.hideLoading();
                chart.gestureSort = true;
            }

            //还原数据
            function goBackData(chartConfig){
                while(chartConfig.hchart.series.length){
                    chartConfig.hchart.series.pop().remove();
                }
                var length = chartConfig.series.length;
                //debugger;
                for(var i = 0 ; i<length;i++){
                    chartConfig.hchart.addSeries(chartConfig.series[i]);
                }
            }


            //功能代码:画圈选取图表数据===========

            ////region 为两个图表控件添加圈选数据的功能

            var dragObj = {
                html:null,
                w:0,
                h:0
            };
            //chart1的初始化
            var hchart1 = chart1.getInsideControl();
            var chart1Config = {
                offset:{
                    x1:0, //原点X
                    y1:0, //最高点Y
                    x2:0, //结束点X
                    y2:0, //结束点Y
                    width:0,
                    height:0
                },
                container:hchart1.container,
                hchart:hchart1,
                control:chart1,
                shell:$('#' + chart1.Get('HTMLElement').id)
            };
            //选取数据的操作
            gestureSelectData(chart1Config);
            //chart2的初始化
            var hchart2 = chart2.getInsideControl();
            var chart2Config = {
                offset:{
                    x1:0, //原点X
                    y1:0, //最高点Y
                    x2:0, //结束点X
                    y2:0, //结束点Y
                    width:0,
                    height:0
                },
                container:hchart2.container,
                hchart:hchart2,
                control:chart2,
                shell:$('#' + chart2.Get('HTMLElement').id)
            };
            //把第二图表清空隐藏
            while (hchart2.series.length) {
                hchart2.series.pop().remove();
            }
            chart2Config.shell.css({
                opacity:0,
                y:1000
            });
            //选取数据的操作
            gestureSelectData(chart2Config);

            //为两个chart初始化hammer手势
            initialHammer(chart1Config.shell);
            initialHammer(chart2Config.shell);

            //拖拽选定数据的处理
            addDragHandler(chart1Config, chart2Config);
            //滑动删除数据
            swipeDeleteSelectedData(hchart1);
            swipeDeleteSelectedData(hchart2);
            //点击取消选中数据状态
            cancleSelectData(hchart1);
            cancleSelectData(hchart2);
            //滑动排序
            swipeSort(hchart1);
            swipeSort(hchart2, true);

            //保存chart1数据
            chart1Config.series=[];
            $(chart1Config.hchart.series).each(function (i, ser) {
                var aSerie = {
                    data:[],
                    type:ser.options.type,
                    lineWidth:ser.options.lineWidth,
                    lineColor:ser.options.lineColor, //如果type是线,这个会影响无法修改颜色
                    shadow:ser.options.shadow,
                    marker:ser.options.marker,
                    color:ser.options.color,
                    point:ser.options.point
                };
                $(ser.data).each(function (i, d) {
                    aSerie.data.push({
                        x:d.x,
                        y:d.y,
                        marker:{
                            fillColor:'#fff',
                            radius:3,
                            symbol: "circle"
                        }
                    });
                });
                aSerie.name = ser.name;
                chart1Config.series.push(aSerie);//
            });
            var hm1 = $(chart1Config.hchart.container).data('hammer');
            if(hm1){
                hm1.ondoubletap = function(){
                    if(chart1Config.hchart.gestureSort){
                        goBackData(chart1Config);
                        chart1Config.hchart.gestureSort = false;
                    }
                }
            }
            ////endregion 为两个图表控件添加圈选数据的功能 end

        })(chart1, chart2, grid, animateIn);
    },

    //KPI面板点击切换的效果代码
    //controlArray:需要切换的控件组
    //buttonArr:点击的页面组
    //defaultShowIndex:默认显示的组
    //otherControls:其它特殊处理的控件
    groupControls:function (animate, controlArray, buttonArr, defaultShowIndex,otherControls) {
        'use strict';
        ($('head')).prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">');
        //var myAnimate = null, myTransit = null;
        var workspace = $('#workspace');
        //var currentIndex = -1, //当前显示的控件索引
        var controls = [];
        //myAnimate = animate;

        var isiPad = (window.navigator.userAgent.indexOf('iPad')>0);
        $('html:eq(0)').css({'overflow':'hidden'});
//                .find('body:eq(0)')[0].onselect = "return false;";

        //开始
        return (function () {

            //index,-1表示隐藏所有,
            function switchGroup(index) {
                var group = null;
                var nextGroup = null;
                var currentShowGroup = null;
                if (index >= 0) {
                    var conLength = controls.length;
                    for (var i = 0; i < conLength; i++) {
                        group = controls[i];
                        if (index === i) {
                            //找到了
                            nextGroup = group;
//                            group.visible = true;
//                            group.target.transit({
//                                duration:500,
//                                opacity: (visibleIn) ? 1 : 0,
//                                y:(visibleIn) ? 0 : 300,
//                                scale:(visibleIn) ? [1,1] : [0,0]
//                            });
                        }
                        if(group.visible){
                            currentShowGroup = group;
                        }
                    }//end for
                } else {
                    return;
                }
                //隐藏当前显示的组
                if(currentShowGroup.visible && currentShowGroup.switchIndex === index){
                    return;
                }
                currentShowGroup.visible = false;
                currentShowGroup.target.transition({
                    opacity: 0,
                    y:300,
                    scale:[0,0]
                },800);
                //显示下一组
                nextGroup.visible = true;
                nextGroup.target.transition({
                    opacity: 1,
                    y:0,
                    scale:[1,1]
                },800);
                if(otherControls){
                    for (var k = 0; k < otherControls.length; k++){
                        var con = otherControls[k];
                        $('#'+con.Get('HTMLElement').id).transit({
                            opacity:0,
                            y:300
                        });
                    }
                }
            }

            //1 把控件分组
            var conLength = controlArray.length;
            for (var i = 0; i < conLength; i++) {
                var ctrs = controlArray[i];

                var aGroupControl = {
                    switchIndex:i,
                    controls:[],
                    tagert:null
                };
//                aGroupControl.target = $('<div class="swipeGroup" style="background: rgba(255,0,0,0.5)"></div>').appendTo(workspace);//添加组
                aGroupControl.target = $('<div class="swipeGroup"></div>');//添加组
                aGroupControl.target.css({
                    width:(!isiPad) ? window.screen.width : 1024,
                    height:(!isiPad) ? 200 : 100
                });

                //分组控件---------------------------------
                var ctrsLength = ctrs.length;
                for (var j = 0; j < ctrsLength; j++) {
                    var con = ctrs[j];
                    if (!con) {
                        continue;
                    }
                    var htmlObj = $(con.Get('HTMLElement'));
                    htmlObj.appendTo(aGroupControl.target);//构造组

                }//end for
                aGroupControl.target.appendTo(workspace);
                var defaultIndex = (defaultShowIndex >= 0) ? defaultShowIndex : 0;
                if (defaultIndex >= 0) {
                    if (aGroupControl.switchIndex !== defaultIndex) {
                        aGroupControl.target.css({
                            duration:0,
                            opacity: 0,
                            y:300,
                            scale:[0,0]
                        });//隐藏其它组
                        aGroupControl.visible = false;


                    } else {
                        aGroupControl.visible = true;
                    }
                }
                controls.push(aGroupControl);
            }//end for

            function clickCallBack(con){
                "use strict";
                return function(){
                    if(window.gesture1HandlerOpen){
                        alert('请还原当前手势场景!');
                        return;
                    }
                    if(window.gesture2HandlerOpen){
                        alert('请还原当前手势场景!');
                        return;
                    }
                    var showIndex = (con.switchIndex>=controls.length) ? -1 : con.switchIndex;
                    switchGroup(showIndex);

                    var btnLength = buttonArr.length;
                    for(var cI = 0;cI<btnLength;cI++){
                        var kpi = buttonArr[cI];
                        kpi.shell.Container.find('.KPIMenu').removeClass('KPIMenuSelected');
                    }
                    con.shell.Container.find('.KPIMenu').addClass('KPIMenuSelected');
                }
            }
            //2 添加点击事件
            var btnLength = buttonArr.length;
            for (var index = 0; index < btnLength; index++){
                var btnCon = buttonArr[index];
                //debugger;
                btnCon.switchIndex = index;
                var shell = btnCon.Get('HTMLElement');
                //var hm = new Hammer(shell,{swipe_time:1000});
                shell.addEventListener("click", clickCallBack(btnCon));
//                shell.onclick = (function(con){
//                    return function(){
//                        clickCallBack(con);
//                    };
//                })(btnCon);
                shell.style.cursor = 'pointer';
            }
        })();
    },

    //控件滚动效果脚本
    scrollableForControls: function(animate, controlArray,offset){
        'use strict';
        var isiPad = (window.navigator.userAgent.indexOf('iPad')>0);
        var workspace = $('#workspace');
        var scroll = null;
        var maxControlTop = 10000;
        return (function(){

            //1
            scroll = $('<div class="swipeGroup" style="background: rgba(255,0,0,0)"></div>')
                .append('<div class="swipeGroup" style="background: rgba(0,0,255,0);width: 100%;height: 100%"></div>')
                .appendTo(workspace);//添加组
            scroll.css({
                width:(!isiPad) ? window.screen.width : 1024
            });
            //
            var container = scroll.find('>div');
            container.css({
                width:(!isiPad) ? window.screen.width*1.2 : 1024 * 1.2
            });
            var sumH = 0;
            var sumLeft = 0;
            var lastCon = null;
            var conLength = controlArray.length;
            for (var i = 0; i < conLength; i++) {
                var ctrs = controlArray[i];
                if(ctrs){
                    var HTMLElement = $(ctrs.Get('HTMLElement')).appendTo(container);
                    lastCon = HTMLElement;
                    var controlTop = HTMLElement.offset().top;
                    sumH +=HTMLElement.height();
                    sumLeft += HTMLElement.width();
//                   console.log(controlTop);
                    if(controlTop < maxControlTop){
                        maxControlTop = controlTop;
                    }
                    HTMLElement.css({
                        'top':0,
                        left:'',
                        position: 'relative',
                        float: 'left',
                        'margin-left':'8px'
                        //background:'#f00'
                    });
                }
            }//end for
            var os = offset ? offset:{top:0,left:0};
            scroll.css({
                top:maxControlTop + os.top
            })
                .height( sumH / conLength + 15);
            container.width(sumLeft + conLength *10);

            window.myScroll = new iScroll(scroll[0], {
                snap: false,
                momentum: false,
                hScrollbar: false,
                vScrollbar: false ,
                vScroll:false,
//                    onBeforeScrollStart: function (e) { e.preventDefault();e.stopPropagation();},
                onScrollStart: function () {
                    agi.using(['../myPage'],function(myPage){
                        myPage.enable = false;
                    });
                },
//                    onBeforeScrollMove: function (e) { e.preventDefault(); e.stopPropagation();},
//                    onScrollMove: function (e) { e.preventDefault(); e.stopPropagation();},
//                    onBeforeScrollEnd: function (e) { e.preventDefault(); e.stopPropagation();},
                onScrollEnd: function () {
                    agi.using(['../myPage'],function(myPage){
                        myPage.enable = true;
                    });
                }
//                    onTouchEnd:function (e) {
//                        e.preventDefault();
//                        e.stopPropagation();
//                    }
            });

        })();
    }
};
