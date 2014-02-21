/**
* Created with JetBrains WebStorm.
* User: 骆鹏
* DateTime:2012-11-28 14:01:56
* To change this template use File | Settings | File Templates.
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/
Agi.Controls.DynamicChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () { //获得实体数据
        },
        Render: function (_Target) {
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var ThisHTMLElement = this.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj);
            }
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
                menuManagement.dragablePoint();
            }
        },
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 100,
                minWidth: 200
            });
            return this;
        },
        ReadData: function (data) {
            var self = this;
            if (data.rtdbID != null) {
                var rtdbid = data.rtdbID;
                var _PointID = data.tagName;
                var pointsParameters = this.Get("PointsParamerters");
                var PointColor = this.Get("PointColor");
                if (pointsParameters.length > 0) {
                    for (var i = 0; i < pointsParameters.length; i++) {
                        if (pointsParameters[i] === _PointID) {
                            return;
                        }
                    }
                }
                PointColor.push({ name: _PointID, color: null });
                pointsParameters.push(_PointID);
                this.Set("PointColor", PointColor);
                this.Set("PointsParamerters", pointsParameters);
                this.RegisterData();

                //点位组织结构
                var length = self.pointConfig.length;
                var isFound = false;
                for (var iCount = 0; iCount < length; iCount++) {
                    var db = self.pointConfig[iCount];
                    if (db.rtdb === rtdbid) {
                        isFound = true;
                        if (db.tagName.indexOf(_PointID) < 0) {
                            db.tagName.push(_PointID);
                        }
                        break;
                    }
                } //end for

                if (!isFound) {
                    self.pointConfig.push({
                        rtdb: rtdbid,
                        tagName: [_PointID]
                    });
                }
            } else {
                //20130121 10:26 markeluo  实时Chart 不支持拖拽DataSet 至图表，当拖拽DataSet至图表上时给出提示信息
                AgiCommonDialogBox.Alert("此控件不支持实体数据！");
            }
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.DynamicChartProrityInit(this);
            }
        },
        ReadRealData: function (_MsgObj) {//获取注册后的实时数据，_MsgObj:注册后返回的参数实例
            var Me=this;
            if (_MsgObj) {
                var chartCurrentData = Me.Get("ChartCurrentData");
                var y = parseInt(_MsgObj.Value);
               //_MsgObj.ArriveTime 点位时间
                var x=_MsgObj.ArriveTime;
                x=Agi.Controls.DynamicChart.TimeStrConverToTime(_MsgObj.ArriveTime);
                //console.log(_MsgObj.TagName+"&"+x+":"+_MsgObj.Value);
                if(Me.Get("IsAddRealPointValue")){
                }else{
                    Me.Set("IsAddRealPointValue",true);
                    var chartProperty = this.Get('ChartProperty');
                    var ChartPoints= Me.Get("PointsParamerters");
                    chartCurrentData=Agi.Controls.DynamicChart.InitDataArrayByTime(chartProperty.chart_PointNumber,ChartPoints,x);

                    var series = Me.Get('series');
                    if(series!=null && series.length>0){
                        for(var i=0;i<series.length;i++){
                            series[i].setData(Agi.Controls.DynamicChart.GetPointDataArray(series[i].name,chartCurrentData));
                        }
                    }
                }
                chartCurrentData=Agi.Controls.DynamicChart.AddPointUpDataArray(_MsgObj.TagName,x,y,chartCurrentData);
                Me.Set("ChartCurrentData",chartCurrentData);

                if (this.Get("IntervalID") == null){
                    Me.BeginInterval();
                }
            }
        },
        ParameterChange: function (_ValueParam) {//参数联动，_ParameterInfo:参数联动传递参数，结构为 "11AE84102|11AE84015|11AE84103"
            var pointsParameters = this.Get("PointsParamerters");
            var arrParam = _ValueParam.split("|");
            var checkKey = true;
            for (var i = 0; i < arrParam.length; i++) {
                for (var j = 0; j < pointsParameters.length; j++) {
                    if (arrParam[i] == pointsParameters[j]) {
                        checkKey = false;
                        break;
                    }
                }
                if (checkKey) {
                    pointsParameters.push(arrParam[i]);
                }
            }
            this.Set("PointsParamerters", pointsParameters);
            this.RegisterData();
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target:显示到的容器，_ShowPosition:控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList = [];
            this.pointConfig = [];
            this.Set("Entity", []);
            this.Set("ControlType", "DynamicChart");
            this.Set('IntervalID', null); //预先保存定时器ID
            this.Set("ChartParameters", { Key: false, Points: [] }); //预先保存结构
            this.Set("ChartCurrentData", []); //设置及时刷新数据显示
            this.Set("PointsParamerters", []); //注册数据点位号保存，点位号集合，结构["11AE84102","11AE84015","11AE84103"]
            this.Set("PointColor", []);
            var ID = savedId ? savedId : "DynamicChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 300,
                height: 200,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:100%;margin: 0 auto">' + '</div>');
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
            this.Set("ProPerty", ThisProPerty);
            this.Set("ThemeInfo", null);
            if (layoutManagement.property.type == 1) {
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("PanelSty");
                HTMLElementPanel.addClass("AutoFill_PanelSty");
                obj.html("");
            }

            if (_Target != null) {
                this.Render(_Target);
            }
            //设置预设图形属性
            this.SetChartProperty(ID);
            this.SetChartDataProperty();
            //追加图形控件至画框
            this.InitHighChart();
            //临时数据测试更新
            //this.BeginInterval();

            var StartPoint = { X: 0, Y: 0 }
            var self = this;
            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    Agi.Controls.ControlEdit(self); //控件编辑界面
                }
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);

            if (Agi.Edit) {
                //缩小的最小宽高设置
                HTMLElementPanel.resizable({
                    minHeight: 100,
                    minWidth: 200
                });
            }
            //20130515 倪飘 解决bug，组态环境中拖入容器框控件和实时图表控件，容器框控件会覆盖实时图表控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        }, //end Init
        RegisterData: function () {//test point,模拟注册点位号，_ValuePoints:点位号集合，结构["11AE84102","11AE84015","11AE84103"]
            //this.Set("PointsParamerters",["11AE84102","11AE84103","11AE84104"]);
            this.StopInterval(); //终止测试数据
            var pointsParameters = this.Get("PointsParamerters");
            if (pointsParameters.length > 0) {
                if (!Agi.Controls.IsOpenControl) {
                    Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": this.Get("ProPerty").ID, "Points": pointsParameters });
                }
                else {
                    Agi.Msg.PointsManageInfo.AddViewPoint({ "ControlID": this.Get("ProPerty").ID, "Points": pointsParameters });
                }
                this.Set("ChartParameters", { Key: true, Points: pointsParameters });
                this.SetChartDataProperty(); //初始化数据线结构
                this.InitHighChart(); //重新初始化图像
            }
        },
        BeginInterval: function () {//图形实时更新
            var ControlObj=this;
            var series = ControlObj.Get("series");
            var chartProperty = ControlObj.Get('ChartProperty');
            var chartCurrentData = ControlObj.Get("ChartCurrentData");
            if (series){
                var checkKey = ControlObj.Get("ChartParameters").Key; //判断是否已注册数据
                ControlObj.StopInterval(); //保证控件只有一个定时器在运行
                var IntervalID = setInterval(function () {
                    if (checkKey) {
                        chartProperty = ControlObj.Get('ChartProperty');
                        chartCurrentData = ControlObj.Get("ChartCurrentData");
                        series = ControlObj.Get("series");
                        //20130718 13:55 markeluo 修改 实时点位漏点问题解决
                        Agi.Controls.DynamicChartUpdatePoint(ControlObj,series,chartCurrentData);
                        chartProperty=chartCurrentData=null;
                    }
                    else {
                    }
                },9000);
                ControlObj.Set('IntervalID', IntervalID);
            }
        },
        StopInterval: function () {//保证整个控件只有一个定时器存在。
            var IntervalID = this.Get('IntervalID');
            if (IntervalID != null) clearInterval(IntervalID);
            this.Set('IntervalID', null);
        },
        GetData: function (_IsParameter,_EndTime) {//预输入模拟数据,参数为判断是否输入测试数据，_IsParameter:带参数联动的数据取得，默认为空白图像
            var chartProperty = this.Get('ChartProperty');
            //            var minValue=chartProperty.yAxisLines[1].value;
            //            var maxValue=chartProperty.yAxisLines[0].value;
            var objData = [];
            var ThisDay = _EndTime;

            for (var i = chartProperty.chart_PointNumber; i >0;i--) {
                if (_IsParameter) {
                    objData.push({ x:(ThisDay.valueOf() - (i * 500)),y:Agi.Script.GetRandomValue(10,95)});
                }
                else {
                    objData.push({ x:(ThisDay.valueOf() - (i * 500)),y:Agi.Script.GetRandomValue(10,95)});
                }
            }
            return objData;
        },
        GetYValue: function () {
            var chartProperty = this.Get('ChartProperty');
            var result = parseInt((chartProperty.yAxis_Max - chartProperty.yAxis_Min) / 3);
            return result;
        },
        SetChartProperty: function (_objCanvasAreaID) {//初始化定义图形控件数据结构，并预设值属性，_objCanvasAreaID:画布显示区域ID
            //图形基本结构定义
            var chartProperty = {
                chart_PointNumber:30, //当前图形范围所显示的点位
                chart_RenderTo: _objCanvasAreaID, //画布ID
                chart_Type: 'spline', //'spline',//显示图形
                chart_MarginRight: 20, //图形距画框右边距距离
                chart_backgroundColor:{
                    linearGradient:{
                        x1:0,
                            y1:0,
                            x2:0,
                            y2:1
                    },
                    stops:[
                        [0, '#ededed'],
                        [1, '#cbcbcb']
                    ]
                },
                chart_Reflow: true, //图形是否跟随放大
                chart_Animation: false, //动画平滑滚动
                title_Text: '', //标题文字
                xAxis_Type: 'datetime', //X轴数据类型
                xAxis_TickWidth:2, //X轴刻线
                xAxis_TickPixelInterval:50, //X轴数据间隔
                xAxis_tickInterval:3*1000,
                xAxis_Reversed: true, //数据滚动方向
                yAxis_Title_Text: '', //Y轴标题文字
                yAxis_Min: -86, //Y轴最小值
                yAxis_Max: 344, //Y轴最大值
                yAxis_GridLineWidth: 0, //Y轴表格线宽度显示
                yAxis_PlotLines_Y: {//Y轴基本线定义
                    value: 0,
                    width: 2,
                    color: '#808080'
                },
                yAxisLines: [],
                yAxis_PlotLines_MinMarkerColor: 'blue',
                yAxis_PlotLines_MaxMarkerColor: 'red',
                tooltip_enabled: true,
                plotOptions_Spline_Marker_enabled: true, //MARKER点位是否显示
                plotOptions_Spline_Marker_Radius: 3, //MARKER点位样式大小设置
                plotOptions_Spline_Marker_Symbol: 'circle',
                legend_enabled: true, //是否显示名片
                exporting_enabled: false, //是否显示打印和下载图片
                credits_enabled: false, //是否显示出品人
                navigation_menuItemStyle_fontSize: '10px'//NULL
            };
            this.Set('ChartProperty', chartProperty); //保存属性结构
        },
        SetChartDataProperty: function () {//数据基本结构定义，在警戒范围中生成模拟数据
            var chartSeries = [];
            var chartCurrentData = [];
            var chartParameters = this.Get("ChartParameters");
            var PointColor = this.Get("PointColor");
            if (chartParameters != null && chartParameters.Key) {//有注册数据
                for (var i = 0; i < chartParameters.Points.length; i++) {
                    chartSeries.push({
                        type:"spline",
                        name: chartParameters.Points[i], //数据名称，用于名片显示隐藏
                        data: this.GetData(true,new Date()), //数据模型
                        dataLabels:{enabled:true},
                        color: GetColor(chartParameters.Points[i], PointColor)
                    });

                    //20130718 13:55 markeluo 修改 实时点位漏点问题解决
                    //chartCurrentData.push([chartParameters.Points[i], null]);
                }
            }
            else {//无注册数据
                chartSeries = [{
                    name: "", //数据名称，用于名片显示隐藏
                    type:"spline",
                    data: this.GetData(false,new Date()), //数据模型
                    dataLabels:{enabled:true},
                    color: null//线条颜色
                }];
            }

            //region 20140109 08:56 markeluo 修改 实时点位漏点问题解决
            var DataModelLength=chartSeries[0].data.length;
            for(var j=0;j<DataModelLength;j++){
                chartCurrentData.push({DTValue:null,Points:[],IsShow:false});
                for(var i=0;i<chartParameters.Points.length;i++){
                    chartCurrentData[j].Points.push({Tag:chartParameters.Points[i],Value:null});
                }
            }
            //endregion

            this.Set("ChartSeries", chartSeries);
            this.Set("ChartCurrentData",chartCurrentData);
        },
        InitHighChart: function () {//初始化图形控件
            var chartProperty = this.Get('ChartProperty');
            var Me=this;
            //20121227 11:13 倪飘 修改实时chart的markerbug
            //            if (chartProperty.yAxisLines.length <= 0) {
            //                chartProperty.plotOptions_Spline_Marker_enabled = false; //如果警戒线行数为0.不启用maker
            //            }
            var yValue = this.GetYValue(); //设置Y轴刻度的
            chartProperty.xAxis_Reversed = true;
            var chartSeries = this.Get('ChartSeries');
            var pointsParameters = this.Get("PointsParamerters");
            if (chartSeries && chartSeries && chartProperty.chart_RenderTo) {
                Highcharts.setOptions({
                    global: {
                        useUTC: false//不使用夏令时
                    }
                });
                var series, chart;

                chartProperty.xAxis_tickInterval=parseInt(chartProperty.chart_PointNumber/10)*1000;
                if(chartProperty.xAxis_tickInterval==0){
                    chartProperty.xAxis_tickInterval=1000;
                }

                chart = new Highcharts.Chart({
                    chart: {
                        animation: chartProperty.chart_Animation,
                        renderTo: chartProperty.chart_RenderTo,
                        type: chartProperty.chart_Type, //chartProperty.chart_Type,
                        marginTop: 20,
                        backgroundColor:chartProperty.chart_backgroundColor,
                        marginRight: chartProperty.chart_MarginRight,
                        reflow: chartProperty.chart_Reflow,
                        events: { load: function () {
                            series = this.series;
                            Me.Set("IsAddRealPointValue",false);
                        } }
                    },
                    colors: [
                        '#4572A7',
                        '#89A54E',
                        '#80699B',
                        '#3D96AE',
                        '#92A8CD',
                        '#A47D7C',
                        '#B5CA92'
                    ],
                    title: {
                        text: chartProperty.title_Text
                    },
                    xAxis: {
                        type: chartProperty.xAxis_Type,
                        lineWidth:1,
                        lineColor:"#6f6f6f",
                        tickWidth: chartProperty.xAxis_TickWidth,
                        tickLength:3,
                        tickColor:'#6f6f6f',
                        tickInterval:chartProperty.xAxis_tickInterval,
                        tickPixelInterval: chartProperty.xAxis_TickPixelInterval,
                        labels:{
                            rotation:40, //坐标值显示的倾斜度
                            align:'left'
                        }
//                        ,reversed: chartProperty.xAxis_Reversed
                    },
                    yAxis: {
                        showEmpty: false,
                        title: {
                            text: chartProperty.yAxis_Title_Text
                        },
                        // min: chartProperty.yAxis_Min,//禁用最小最大值
                        // max: chartProperty.yAxis_Max,
                        lineWidth:1,
                        lineColor:"#6f6f6f",
                        gridLineWidth: chartProperty.yAxis_GridLineWidth,
                        tickWidth:chartProperty.xAxis_TickWidth,
                        tickLength:3,
                        tickColor:'#6f6f6f',
                        labels: {
                            enabled: true
                        },
                        plotLines: chartProperty.yAxisLines
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: chartProperty.plotOptions_Spline_Marker_enabled,
                                radius: chartProperty.plotOptions_Spline_Marker_Radius,
                                symbol: chartProperty.plotOptions_Spline_Marker_Symbol
                            }
                        },
                        line: {
                            marker: {
                                enabled: chartProperty.plotOptions_Spline_Marker_enabled,
                                radius: chartProperty.plotOptions_Spline_Marker_Radius,
                                symbol: chartProperty.plotOptions_Spline_Marker_Symbol
                            }
                        }
                    },
                    tooltip: {
                        enabled: chartProperty.tooltip_enabled,
//                        crosshairs: true,//十字线
//                        shared:true,//十字线是否共享
                        formatter: function () {
//                            return '<b>' + this.series.name + ': <br/>' + this.y + '</b>';
                            var strx=this.x+"";
                            strx=strx.substr(strx.length-3);
                            return '<b>'+ this.series.name +'</b><br/>'+
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)+'.'+strx+'<br/>'+
                                Highcharts.numberFormat(this.y,2);
                        }
                    },
                    legend: {
                        enabled: pointsParameters.length > 0 ? chartProperty.legend_enabled : false,
                        layout: 'vertical',
                        align: 'left',
                        verticalAlign: 'top',
                        x: 30,
                        y: 0,
                        floating: true,
                        borderWidth: 1,
                        backgroundColor: '#FFFFFF'
                    },
                    exporting: {
                        enabled: chartProperty.exporting_enabled
                    },
                    series: chartSeries,
                    credits: {
                        enabled: chartProperty.credits_enabled
                    }
                });
                this.Set("chart", chart);
                this.Set("series",series);
                this.chart = chart;
            }
        },
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.DynamicChartProrityInit(this);
        },
        Destory: function () {
            var Me=this;
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

            //            Agi.Edit.workspace.controlList.remove(this);
            //            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
//            Agi.Controls.ControlDestoryByList(this); //移除控件,从列表中

            $(HTMLElement).remove();
            HTMLElement = null;
            Me.AttributeList.length = 0;
            Me.pointConfig = [];
            proPerty = null;
            Me=null;
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewDynamicChart = Agi.Controls.InitDynamicChart();
                NewDynamicChart.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewDynamicChart;
            }
        },
        PostionChange: function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                var _ThisPosition = {
                    Left: (_Postion.Left / PagePars.Width).toFixed(4),
                    Top: (_Postion.Top / PagePars.Height).toFixed(4),
                    Right: (_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
                }

                //                //缩小的最小宽高设置
                //                HTMLElementPanel.resizable({
                //                    minHeight: 200,
                //                    minWidth: 300
                //                });

                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                var ThisHTMLElement = $(this.Get("HTMLElement"));
                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };


                var ThisControlPars = { Width: ThisHTMLElement.width(), Height: ThisHTMLElement.height(), Left: (ThisHTMLElement.offset().left - PagePars.Left), Top: (ThisHTMLElement.offset().top - PagePars.Top), Right: 0, Bottom: 0 };
                ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
                ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);

                var _ThisPosition = {
                    Left: (ThisControlPars.Left / PagePars.Width).toFixed(4),
                    Top: (ThisControlPars.Top / PagePars.Height).toFixed(4),
                    Right: (ThisControlPars.Right / PagePars.Width).toFixed(4),
                    Bottom: (ThisControlPars.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }
            //$('#'+this.shell.BasicID).find('.dropdown:eq(0)')
        },
        Refresh: function () {
            var ThisHTMLElement = $(this.Get("HTMLElement"));
            var ParentObj = ThisHTMLElement.parent();
            if (!ParentObj.length) {
                return;
            }
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            var PostionValue = this.Get("Position");
            PostionValue.Left = parseFloat(PostionValue.Left);
            PostionValue.Right = parseFloat(PostionValue.Right);
            PostionValue.Top = parseFloat(PostionValue.Top);
            PostionValue.Bottom = parseFloat(PostionValue.Bottom);
            var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (PostionValue.Left + PostionValue.Right))),
                Height: parseInt(PagePars.Height - (PagePars.Height * (PostionValue.Top + PostionValue.Bottom)))
            };
            ThisHTMLElement.width(ThisControlPars.Width);
            ThisHTMLElement.height(ThisControlPars.Height);
            //            ThisHTMLElement.css("left",(ParentObj.offset().left+parseInt(PostionValue.Left*PagePars.Width))+"px");
            //            ThisHTMLElement.css("top",(ParentObj.offset().top+parseInt(PostionValue.Top*PagePars.Height))+"px");
            ThisHTMLElement.css("left", (parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");

            //$(window).resize();//这段代码会导致highchart报一个错
            this.UpdateChartSize();
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        Checked: function () {
            if (!Agi.Edit) return;
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            if (!Agi.Edit) return;
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /* $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
            "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        EnterEditState: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            };
            obj.css({ "width": '100%', "height": '100%' });

            //this.ShowDeleteSeries(this);
            //框架重新设置
//            $(window).resize();//这段代码会导致highchart报一个错
            this.UpdateChartSize();
        },
        ShowDeleteSeries: function (_chart) {//测试函数，可删除
            var ControlEditPanelID = _chart.Get("HTMLElement").id;
            var ChartSeriesPanel = null;
            if ($("#menuBasichartseriesdiv").length > 0) {
                $("#menuBasichartseriesdiv").remove();
            }
            ChartSeriesPanel = $("<div id='menuBasichartseriesdiv' class='BschartSeriesmenudivsty'></div>");
            ChartSeriesPanel.appendTo($("#" + ControlEditPanelID));
            ChartSeriesPanel.html("");

            var chartSeries = _chart.Get("ChartSeries");

            if (chartSeries != null && chartSeries.length > 0) {
                for (var i = 0; i < chartSeries.length; i++) {
                    $("#menuBasichartseriesdiv").append("<div class='BschartSerieslablesty'>" +
                        "<div style='width:10px; height:10px; line-height: 30px; background-color:" + chartSeries[i].color + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                        "<div class='BschartSeriesname' id='Sel" + chartSeries[i].name + "'>"
                        + chartSeries[i].name + "</div>" +
                        "<div class='BschartseriesImgsty' id='remove" + chartSeries[i].name + "'></div>" +
                        "<div class='clearfloat'></div></div>");
                }
                $("#menuBasichartseriesdiv").append("<div style='clear:both;'></div>");
                $("#menuBasichartseriesdiv").css("left", ($("#" + ControlEditPanelID).width() - 120) + "px");
                $("#menuBasichartseriesdiv").css("top", "10px");
            }
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            //框架重新设置
//            $(window).resize();//这段代码会导致highchart报一个错
            this.UpdateChartSize();
        },
        UpdateChartSize: function () {
            var self = this;
            if (self.chart) {
                var w = self.shell.Body.width();
                var h = self.shell.Container.height(); // - self.shell.Title.height();
                if (w > 1 && h > 1) {
                    self.chart.setSize(w, h, false);
                }
            }
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.DynamicChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var DynamicChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基础对象
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    BasicProperty: null, //控件基本属性
                    ChartProperty: null, //chart的属性
                    ChartSeries: null, //chart系列
                    PointsParamerters: null, //位置参数
                    Position: null, //控件位置
                    ThemeInfo: null,
                    PointColor: null
                }
            }
            DynamicChartControl.Control.ControlType = this.Get("ControlType");
            DynamicChartControl.Control.ControlID = ProPerty.ID;
            DynamicChartControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            DynamicChartControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 20:53 markeluo 页面预览或保存时会导致控件的实体数据被清空问题修改
            //            $(Entitys).each(function (i, e) {
            //                e.Data = null;
            //            });
            DynamicChartControl.Control.Entity = Entitys;
            DynamicChartControl.Control.BasicProperty = this.Get("BasicProperty");
            DynamicChartControl.Control.ChartProperty = this.Get("ChartProperty");
            DynamicChartControl.Control.ChartSeries = this.Get("ChartSeries");
            DynamicChartControl.Control.PointsParamerters = this.Get("PointsParamerters");
            DynamicChartControl.Control.Position = this.Get("Position");
            DynamicChartControl.Control.ThemeInfo = this.Get("ThemeInfo");
            DynamicChartControl.Control.PointColor = this.Get("PointColor");
            DynamicChartControl.Control.pointConfig = this.pointConfig;
            return DynamicChartControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                var chartProperty = null;
                var chartSeries = null;
                var pointsParamerters = [];
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.Entity = _Config.Entity;
                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);
                    this.Set("PointColor", _Config.PointColor);
                    _Config.ThemeInfo = _Config.ThemeInfo;
                    chartProperty = _Config.ChartProperty;
                    this.Set("ChartProperty", chartProperty);
                    chartSeries = _Config.ChartSeries;
                    this.Set("ChartSeries", chartSeries);
                    pointsParamerters = _Config.PointsParamerters;
                    this.Set("PointsParamerters", pointsParamerters);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height()};
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);

                    var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height: parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))
                    };

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                    this.Set("Entity", _Config.Entity);
                    var pointConfig = _Config.pointConfig ? _Config.pointConfig:[];
                    this.pointConfig = pointConfig;
                    //进行画布的显示
                    this.InitHighChart();
                    //重新开始自动滚动数据
                    //this.BeginInterval();
                    //获取注册数据
                    this.RegisterData();
                }
            }
        }, //根据配置信息创建控件
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-12-28 9:42:27 添加样式切换应用 Auth:Markeluo  编号:20121228094227*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            ChartStyleValue = null;
            /*20121228094227 结束*/
        } //更改样式
    }, true);

/*下拉列表控件参数更改处理方法*/
Agi.Controls.DynamicChartAttributeChange = function (_ControlObj, Key, _Value) {
    var self = _ControlObj;
    switch (Key) {
        case "Position":
            {
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElement = $(_ControlObj.Get("HTMLElement"));
                    var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

                    var ParentObj = ThisHTMLElement.parent();
                    var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                    //ThisControlObj.height(ThisHTMLElement.height()-20);
                    ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                    ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                    ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                    PagePars = null;

                    self.UpdateChartSize();
                }
            } break;
        case "SelValue":
            {
                //            var _ParameterInfo={
                //                Type:"控件输出参数",
                //                Control:_ControlObj,
                //                ChangeValue:[{Name:"SelValue",Value:_Value}]
                //            }
            } break;
        case "data": //用户选择了一个项目
            {
                var data = _ControlObj.Get('data');
                if (data.selectedValue.value) {
                    //alert('您选择了:'+data.selectedValue.value +'\n'+ data.selectedValue.text);

                    var ThisProPerty = _ControlObj.Get("ProPerty");

                    Agi.Msg.PageOutPramats.PramatsChange({
                        'Type': Agi.Msg.Enum.Controls,
                        'Key': ThisProPerty.ID,
                        'ChangeValue': [{ 'Name': 'selectedValue', 'Value': data.selectedValue.value}]
                    });
                    Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _ControlObj, "Type": Agi.Msg.Enum.Controls });
                }
            } break;
        case "BasicProperty":
            {
                var BasicProperty = _ControlObj.Get('BasicProperty');
                var controlObject = $(_ControlObj.Get('HTMLElement'));
                controlObject.find('.dropdown-toggle').css('color', BasicProperty.fontColor);
                controlObject.find('.dropdownlistControl,.dropdown-toggle').css('background-color', BasicProperty.controlBgColor);
                //controlObject.find('.dropdown-menu').css('background-color',BasicProperty.dropdownMenuBgColor);
                var entity = _ControlObj.Get('Entity');
                if (entity && entity.length) {
                    BindDataByEntity(_ControlObj, entity[0]);
                }
            }
            break;
        case "Entity": //实体
            {
                var entity = _ControlObj.Get('Entity');
                if (entity && entity.length) {
                    BindDataByEntity(_ControlObj, entity[0]);
                } else {
                    var $UI = $('#' + self.shell.ID);
                    var menu = $UI.find('.dropdown-menu');
                    $UI.find('.dropdown-toggle').text('');
                    menu.empty();
                }
            } break;
    } //end switch

    function BindDataByEntity(controlObj, et) {
        Agi.Utility.RequestData(et, function (d) {
            var BasicProperty = controlObj.Get("BasicProperty");
            var $UI = $('#' + controlObj.shell.ID);
            var menu = $UI.find('.dropdown-menu');
            $UI.find('.dropdown-toggle').text('请选择');

            menu.empty();
            var data = d.length ? d : [d];
            var columns = et.Columns.length ? et.Columns : [et.Columns];
            et.Data = data;
            var textField = BasicProperty && BasicProperty.selectTextField ? BasicProperty.selectTextField : columns[0];
            var valueField = BasicProperty && BasicProperty.selectValueField ? BasicProperty.selectValueField : columns[0];
            if (BasicProperty.selectTextField == undefined) {
                BasicProperty.selectTextField = textField
            }
            if (BasicProperty.selectValueField == undefined) {
                BasicProperty.selectValueField = valueField;
            }

            $(data).each(function (i, dd) {
                $('<li data-value="' + dd[valueField] + '"><a tabindex="-1" href="#">' + dd[textField] + '</a></li>').appendTo(menu);
            });
            controlObj.ReBindEvents();
            menu.find('li:eq(0)').click();
        });
        return;
    }

} //end

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDynamicChart = function () {
    return new Agi.Controls.DynamicChart();
}

Agi.Controls.DynamicChartProrityInit = function (_BasicChart) {
    var Me = _BasicChart;
    //取得默认属性
    var chartProperty = Me.Get('ChartProperty');
    //取得页面显示数据属性
    var pointsParameters = Me.Get("PointsParamerters");
    var PointColor = Me.Get("PointColor");
    var chart = Me.Get("chart");
    var ThisProItems = [];
    //1.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    {
        var ItemContent = new Agi.Script.StringBuilder();

        //2.主题
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='DynamicChart_Pro_Panel'>");
        ItemContent.append("<div id='BasicChart_ProTheme_grid' class='DynamicChart_ProTheme'></div>");
        ItemContent.append("<div id='BasicChart_ProTheme_darkblue' class='DynamicChart_ProTheme'></div>");
        ItemContent.append("<div id='BasicChart_ProTheme_darkgreen' class='DynamicChart_ProTheme'></div>");
        ItemContent.append("<div id='BasicChart_ProTheme_gray' class='DynamicChart_ProTheme'></div>");
        ItemContent.append("<div style='clear: both;width:0px;height: 0px;font-size: 0px;line-height: 0px;'></div>");
        ItemContent.append("</div>");
        var ThemeContentObj = $(ItemContent.toString());
        //4.基本属性设置
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='DynamicChart_Pro_Panel'>");
        ItemContent.append("<table class='DyChartprortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'colspan='4'><div id='DyChartProbtnSave1'  class='DynamicChart_pro_Save' title='保存' opstate='0'></div><div class='clearfloat'></div></td>");
       ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>ToolTips:</td><td class='DyChartprortityPanelTabletd1'><select id='ToolTips'><option selected='selected' value='2'>关闭</option><option value='1'>开启</option></select></td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>是否动画显示:</td><td class='DyChartprortityPanelTabletd2'><select id='Animation'><option selected='selected' value='1'>是</option><option value='2'>否</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>页面点数:</td><td class='DyChartprortityPanelTabletd2' ><input type='number' id='PointNum' class='ControlProNumberSty' defaultvalue='30' value='30' min='1' max='100' /></td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>是否显示图例:</td><td class='DyChartprortityPanelTabletd2'><select id='legendSetting'><option selected='selected' value='1'>是</option><option value='2'>否</option></select></td>");
        ItemContent.append("</tr>");
        //        ItemContent.append("<tr>");
        //        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>线条颜色:</td><td class='DyChartprortityPanelTabletd2' ><input type='text' id='ChartLineColor'/></td>");
        //        ItemContent.append("<td class='DyChartprortityPanelTabletd0'></td><td class='DyChartprortityPanelTabletd2' ></td>");
        //        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var DataLinesObj = $(ItemContent.toString());

        //报警属性设置
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='DynamicChart_Pro_Panel'>");
        ItemContent.append("<table id='AlarmLines' class='DyChartprortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd2'>报警信息:</td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd2'><input id='DyChartproLinesAddValue' type='number' min='-10000000' max='10000000' defaultvalue='100' value='100' /> </td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd2'><input type='text' id='DyChartproLinesAddColor' class='DyChartproColorSty' /></td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd2'><div id='DyChartprobtnAddLines' class='DynamicChart_pro_Add' title='添加'></div><div class='clearfloat'></div></td>");
        ItemContent.append("</tr>");
        for (var i = 0; i < chartProperty.yAxisLines.length; i++) {
            ItemContent.append("<tr class='Lines'>");
            ItemContent.append("<td class='DyChartprortityPanelTabletd0'>警戒线:</td><td class='DyChartprortityPanelTabletd1'><input class='AL' type='number'/></td>");
            ItemContent.append("<td class='DyChartprortityPanelTabletd0'><input class='AC ControlProTextSty' type='text'  maxlength='10' ischeck='false'/></td>" +
                "<td class='DyChartprortityPanelTabletd2'><div class='DynamicChart_pro_Del' title='删除'></div><div class='clearfloat'></div></td>");
            ItemContent.append("</tr>");
        }
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var AlarmPropertyObj = $(ItemContent.toString());

        //marker属性设置
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='DynamicChart_Pro_Panel'>");
        ItemContent.append("<table class='DyChartprortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>Marker:</td><td class='DyChartprortityPanelTabletd1' >" +
            "<select id='Marker'>" +
            "<option selected='selected' value='2'>关闭</option>" +
            "<option value='1'>开启</option>" +
            "</select></td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'colspan='2'><div id='DyChartProbtnSave2'  class='DynamicChart_pro_Save' title='保存' opstate='0'></div><div class='clearfloat'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>Marker大小:</td><td class='DyChartprortityPanelTabletd1'><input type='number' id='MarkerSize' class='ControlProNumberSty' defaultvalue='0' value='0' min='0' max='10'/></td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>Marker样式:</td><td class='DyChartprortityPanelTabletd1'><select id='MarkerSty'>" +
            "<option value='circle' selected='selected'>circle</option>" +
            "<option value='square'>square</option>" +
            "<option value='diamond'>diamond</option>" +
            "<option value='triangle'>triangle</option>" +
            "<option value='triangle-down'>triangle-down</option>" +
            "</select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>Marker上限:</td><td class='DyChartprortityPanelTabletd2'><input type='text' id='MarkerUpperColor' class='ControlProTextSty' maxlength='5' ischeck='false'/></td>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>Marker下限:</td><td class='DyChartprortityPanelTabletd2'><input type='text' id='MarkerLowerColor' class='ControlProTextSty' maxlength='5' ischeck='false'/></td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var MarkerPropertyObj = $(ItemContent.toString());


        //数据连接设置
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='DynamicChart_Pro_Panel'>");
        ItemContent.append("<table class='DyChartprortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr style='display: none;'>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>连接数据源:</td><td class='DyChartprortityPanelTabletd1' colspan='3'><input id='seriesRtdbID' type='text' readonly='true'/></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DyChartprortityPanelTabletd0'>点位号:</td><td class='DyChartprortityPanelTabletd2'  colspan='3' style='height:50px;'><div id='div_pointsParameters' style='height:80px;overflow:auto;display: -moz-box;display: -webkit-box;-moz-box-orient : vertical;-webkit-box-orient : vertical;'>");

        Agi.deleteSeries = deleteSeries;
        for (var i = 0; i < PointColor.length; i++) {
            var pointColor = PointColor[i].color == null ? "" : PointColor[i].color;
            var tagName = PointColor[i].name;
            var fullName = getPointFullName(Me.pointConfig,tagName);
            ItemContent.append("<div><a class='ChartLineColor' style='cursor:pointer;color:" + pointColor + "'>" + fullName + "</a><a id=" + tagName + " style='float:right;margin-right:15' onclick='Agi.deleteSeries(id)'>删除</a></div>");
        }
        ItemContent.append("</div></td>");

        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var DataLinkerObj = $(ItemContent.toString());

        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本属性", DisabledValue: 1, ContentObj: DataLinesObj }));
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "报警属性", DisabledValue: 1, ContentObj: AlarmPropertyObj }));
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "Marker属性", DisabledValue: 1, ContentObj: MarkerPropertyObj }));
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据连接", DisabledValue: 1, ContentObj: DataLinkerObj }));
    }

    //2.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //3.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        var itemtitle = _item.Title;
        if (_item.DisabledValue == 0) {
            itemtitle += "禁用";
        } else {
            itemtitle += "启用";
        }
        AgiCommonDialogBox.Alert(itemtitle);
    }


    //4.取得页面显示图形默认属性
    {
        //获取是否显示TIP框
        $("#ToolTips").val(chartProperty.tooltip_enabled ? "1" : "2");
        //add by lj 添加是否显示图列操作
        $("#legendSetting").val(chartProperty.legend_enabled ? "1" : "2");
        //获取是否显示数据线形上面的MARKER
        $("#Marker").val(chartProperty.plotOptions_Spline_Marker_enabled ? "1" : "2");
        //设置MARKER报警上限颜色
        $("#MarkerUpperColor").val(chartProperty.yAxis_PlotLines_MaxMarkerColor);
        //设置MARKER报警下限颜色
        $("#MarkerLowerColor").val(chartProperty.yAxis_PlotLines_MinMarkerColor);
        //设置MARKER大小
        $("#MarkerSize").val(chartProperty.plotOptions_Spline_Marker_Radius);
        //设置MARKER样式
        $("#MarkerSty").val(chartProperty.plotOptions_Spline_Marker_Symbol);
        for (var i = 0; i < chartProperty.yAxisLines.length; i++) {
            //设置警戒线值
            $("#AlarmLines .Lines:eq(" + i + ") .AL").val(chartProperty.yAxisLines[i].value);
            //设置警戒线颜色
            $("#AlarmLines .Lines:eq(" + i + ") .AC").val(chartProperty.yAxisLines[i].color);
        }
        //设置是否显示动画效果
        $("#Animation").val(chartProperty.chart_Animation ? "1" : "2");
        //设置页面显示最大点位数
        $("#PointNum").val(chartProperty.chart_PointNumber);

        //取得数据连接属性

//        这里请求了webservice,获取点位的所属数据库名称,暂时不用了 andy guo 2013/1/18
//        if (pointsParameters.length > 0) {
//            var Strparas = { "tagName": pointsParameters[pointsParameters.length - 1] };
//            Strparas = JSON.stringify(Strparas);
//            Agi.DAL.ReadData({ "MethodName": "RPQueryRTDBinfo", "Paras": Strparas, "CallBackFunction": ReadChartDataServer });
//
//            function ReadChartDataServer(_objJson) {
//                var result = _objJson.result;
//                var message = _objJson.message;
//                if (result && message == "执行成功" && _objJson.rtdbInfo.length > 0) {
//                    var rtdbInfo = _objJson.rtdbInfo[0];
//                    $("#seriesRtdbID").val(rtdbInfo.RtdbID);
//                    //                var RtdbID = rtdbInfo.RtdbID;
//                    //                var ServerIP = rtdbInfo.ServerIP;
//                    //                var Port =  rtdbInfo.Port;
//                    //                var RtdbType =  rtdbInfo.RtdbType;
//                }
//                else {
//                    $("#seriesRtdbID").val("未找到数据源");
//                }
//            }
//        }

        function deleteSeries(_id) {
            chartProperty = Me.Get('ChartProperty');
            ($('#' + _id).parent()).remove();
            var newArray = [];
            var newPointColor = [];
            var chartParameters = Me.Get("ChartParameters");
            pointsParameters = Me.Get("PointsParamerters");
            PointColor = Me.Get("PointColor");
            for (var i = 0; i < pointsParameters.length; i++) {
                if (pointsParameters[i] == _id)
                    continue;
                newArray.push(pointsParameters[i]);
            }

            //20130105 倪飘 解决新建页面组态环境中实时chart中添加点位号以后，删除该点位号，然后再添加另外一个点位号，先前删除的点位号重新出现在控件属性设置的数据连中问题
            for (var i = 0; i < PointColor.length; i++) {
                if (PointColor[i].name == _id) {
                    PointColor.splice(i,1);
                }
                //                    continue;
                //                newPointColor.push({ name: PointColor[i].name, color: PointColor[i].color })
            }
            Me.Set("PointsParamerters", newArray);
            Me.Set("ChartParameters", { Key: true, Points: newArray })
            Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
            deletePointConfig(Me.pointConfig,_id);
        }
        //从点位组织结构中删除指定的点位
        function deletePointConfig(pointConfig,point){
//            self.pointConfig.push({
//                rtdb:rtdbid,
//                tagName:[_PointID]
//            });
            for(var i = 0;i<pointConfig.length;i++){
                var db = pointConfig[i];
                var index = db.tagName.indexOf(point);
                if(index>=0){
                    db.tagName.splice(index,1);
                }
            }
        }
        //从点位组织结构中得到点位的全名
        function getPointFullName(pointConfig,point){
//            self.pointConfig.push({
//                rtdb:rtdbid,
//                tagName:[_PointID]
//            });
            var str = '';
            for(var i = 0;i<pointConfig.length;i++){
                var db = pointConfig[i];
                var index = db.tagName.indexOf(point);
                if(index>=0){
                    str = '[' + db.rtdb +']'+ point;
                    break;
                }
            }
            if(str===''){
                str = point;
            }
            return str;
        }
    }
    //5.页面属性改变事件集合
    {
        //添加颜色拾取器插件
        //Marker上限颜色
        $("#MarkerUpperColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#MarkerUpperColor").val(color.toHexString());
            }
        });
        $("#ChartLineColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                chartProperty = Me.Get('ChartProperty');
                var PointColor = Me.Get('PointColor');
                var PointName = $(this).html();
                for (var i = 0; i < PointColor.length; i++) {
                    if (PointName == PointColor[i].name) {
                        PointColor[i].color = color.toHexString();
                    }
                }
                $(this).css("color", color.toHexString());
                Me.Get('PointColor', PointColor);
                Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
            }
        });
        //Marker下限颜色
        $("#MarkerLowerColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#MarkerLowerColor").val(color.toHexString());
            }
        });
        $(".DyChartproColorSty").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $(this).val(color.toHexString());
            }
        });
        //报警值
        $(".AL").bind("change", function () {
            chartProperty = Me.Get('ChartProperty');
            var Rowindex = $(this).parent().parent().index() - 1;
            if (parseInt($(this).val()) > chartProperty.yAxis_Max) {
                chartProperty.yAxis_Max = parseInt($(this).val());
            }
            else if (parseInt($(this).val()) < chartProperty.yAxis_Min) {
                chartProperty.yAxis_Min = parseInt($(this).val());
            }
            chartProperty.yAxisLines[Rowindex].value = parseInt($(this).val());
            chartProperty.yAxisLines[Rowindex].label.text = "警戒线:" + parseInt($(this).val());
            Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
        });
        //报警颜色
        $(".AC").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                chartProperty = Me.Get('ChartProperty');
                var Rowindex = $(this).parent().parent().index() - 1;
                chartProperty.yAxisLines[Rowindex].color = color.toHexString();
                Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
            }
        });

        //1.基本属性保存
        $("#DyChartProbtnSave1").unbind().bind("click",function(ev){
            chartProperty = Me.Get('ChartProperty');
            chartProperty.tooltip_enabled = $("#ToolTips").val() == '1' ? true : false;//是否显示tooltips选择
            chartProperty.chart_Animation = $("#Animation").val() == '1' ? true : false;//是否显示动画显示效果
            chartProperty.legend_enabled = $("#legendSetting").val() == '1' ? true : false;//是否显示图例操
            chartProperty.chart_PointNumber = parseInt($("#PointNum").val());//页面最大点数量
            Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
        });
        //2.Marke属性保存
        $("#DyChartProbtnSave2").unbind().bind("click",function(ev){
            chartProperty = Me.Get('ChartProperty');
            if ($("#Marker").val() == '1') {
                chartProperty.plotOptions_Spline_Marker_enabled = true; //启用
            }
            else {
                chartProperty.plotOptions_Spline_Marker_enabled = false; //不启用maker
            }
            chartProperty.plotOptions_Spline_Marker_Radius = parseInt($("#MarkerSize").val());
            chartProperty.plotOptions_Spline_Marker_Symbol = $("#MarkerSty").val();
            chartProperty.yAxis_PlotLines_MaxMarkerColor = $("#MarkerUpperColor").val();
            chartProperty.yAxis_PlotLines_MinMarkerColor = $("#MarkerLowerColor").val();

            Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
        })

        //移除警戒线
        $(".DynamicChart_pro_Del").click(function () {
            chartProperty = Me.Get('ChartProperty');
            //1.获取当前索引
            var Rowindex = $(this).parent().parent().index() - 1;
            //2.移除属性配置中警戒线
            $("#AlarmLines .Lines:eq(" + Rowindex + ")").remove();
            //3.移除对象
            chartProperty.yAxisLines.splice(Rowindex, 1);
            //4.重新从警戒线中获取最大值和最小值
            var MaxLineValue = maxLine(chartProperty.yAxisLines);
            var MinLineValue = minLine(chartProperty.yAxisLines);
            chartProperty.yAxis_Max = MaxLineValue > 344 ? MaxLineValue : 344;
            chartProperty.yAxis_Min = MinLineValue < -86 ? MinLineValue : -86;
            //20121227 11:13 倪飘 修改实时chart的markerbug
            //            if (chartProperty.yAxisLines.length <= 0) {
            //                $("#Marker").val('2');
            //                chartProperty.plotOptions_Spline_Marker_enabled = false;
            //            }
            //5.重新绑定Chart
            Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
        });
        //marker大小选择改变事件
        $("#MarkerSize").change(function () {
            chartProperty = Me.Get('ChartProperty');
            var ThisValue = $(this).val();
            var MinNumber = parseInt($(this).attr("min"));
            var MaxNumber = parseInt($(this).attr("max"));
            var DefaultValue = $(this).attr("defaultvalue");
            if (DefaultValue != null && DefaultValue != "") {
                DefaultValue = parseInt(DefaultValue);
            }
            if (DefaultValue != null && DefaultValue != "") {
            } else {
                DefaultValue = MinNumber;
            }
            if (ThisValue >= MinNumber && ThisValue <= MaxNumber) {
            } else {
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
                $(this).val(DefaultValue);
            }
        });
        //页面最大点数量设置改变事件
        $("#PointNum").change(function () {
            chartProperty = Me.Get('ChartProperty');
            var ThisValue = $(this).val();
            var MinNumber = parseInt($(this).attr("min"));
            var MaxNumber = parseInt($(this).attr("max"));
            var DefaultValue = $(this).attr("defaultvalue");
            if (DefaultValue != null && DefaultValue != "") {
                DefaultValue = parseInt(DefaultValue);
            }
            if (DefaultValue != null && DefaultValue != "") {
            } else {
                DefaultValue = MinNumber;
            }
            if (ThisValue >= MinNumber && ThisValue <= MaxNumber) {
            } else {
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
                $(this).val(DefaultValue);
            }
        });
        $("#DyChartprobtnAddLines").click(function () {
            chartProperty = Me.Get('ChartProperty');
            var AIndex = $("#AlarmLines .Lines").length;
            var AColumn = "<tr class='Lines'>";
            AColumn += "<td class='DyChartprortityPanelTabletd0'>警戒线:</td><td class='DyChartprortityPanelTabletd1'><input class='AL' type='number' /></td>";
            AColumn += "<td class='DyChartprortityPanelTabletd0'><input class='AC' type='text'   class='ControlProTextSty' maxlength='10' ischeck='true'/></td>" +
                "<td class='DyChartprortityPanelTabletd2'><div class='DynamicChart_pro_Del' title='删除'></div><div class='clearfloat'></div></td>";
            AColumn += "</tr>";
            $("#AlarmLines tr:eq(" + AIndex + ")").after(AColumn);
            var ThisLineValueNumber=eval($("#DyChartproLinesAddValue").val());
            var ThisLineColor=$("#DyChartproLinesAddColor").val();
            chartProperty.yAxisLines.push({
                value:ThisLineValueNumber,
                width: 2,
                color:ThisLineColor,
                label: {
                    align: 'right',
                    text: "警戒线:" + ThisLineValueNumber,
                    style: {
                        color:ThisLineColor
                    }
                }
            });
            //20121227 11:13 倪飘 修改实时chart的markerbug
            //            if (chartProperty.yAxisLines.length > 0) {
            //                $("#Marker").val('1'); //Marker启用
            //                chartProperty.plotOptions_Spline_Marker_enabled = true;
            //            }
            //设置警戒线值和警戒线颜色
            $("#AlarmLines .Lines:eq(" + AIndex + ") .AL").val(chartProperty.yAxisLines[AIndex].value);
            $("#AlarmLines .Lines:eq(" + AIndex + ") .AC").val(chartProperty.yAxisLines[AIndex].color);
            Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
            var tempdom = $("#AlarmLines tr:eq(" + (AIndex + 1) + ")");
            $(tempdom).find(".AL").bind("change", function () {
                chartProperty = Me.Get('ChartProperty');
                var Rowindex = $(this).parent().parent().index() - 1;
                if (parseInt($(this).val()) > chartProperty.yAxis_Max) {
                    chartProperty.yAxis_Max = parseInt($(this).val());
                }
                else if (parseInt($(this).val()) < chartProperty.yAxis_Min) {
                    chartProperty.yAxis_Min = parseInt($(this).val());
                }
                chartProperty.yAxisLines[Rowindex].value = parseInt($(this).val());
                chartProperty.yAxisLines[Rowindex].label.text = "警戒线:" + parseInt($(this).val());
                Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
            });
            //报警颜色
            $(tempdom).find(".AC").spectrum({
                showInput: true,
                showPalette: true,
                palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
                cancelText: "取消",
                chooseText: "选择",
                change: function (color) {
                    chartProperty = Me.Get('ChartProperty');
                    var Rowindex = $(this).parent().parent().index() - 1;
                    chartProperty.yAxisLines[Rowindex].color = color.toHexString();
                    Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
                }
            });
            //移除报警线
            $(tempdom).find(".DynamicChart_pro_Del").bind("click", function () {
                chartProperty = Me.Get('ChartProperty');
                //1.获取当前索引
                var Rowindex = $(this).parent().parent().index() - 1;
                //2.移除属性配置中警戒线
                $("#AlarmLines .Lines:eq(" + Rowindex + ")").remove();
                //3.移除对象
                chartProperty.yAxisLines.splice(Rowindex, 1);
                //4.重新从警戒线中获取最大值和最小值
                var MaxLineValue = maxLine(chartProperty.yAxisLines);
                var MinLineValue = minLine(chartProperty.yAxisLines);
                chartProperty.yAxis_Max = MaxLineValue > 344 ? MaxLineValue : 344;
                chartProperty.yAxis_Min = MinLineValue < -86 ? MinLineValue : -86;
                //20121227 11:13 倪飘 修改实时chart的markerbug
                //                if (chartProperty.yAxisLines.length <= 0) {
                //                    $("#Marker").val('2');
                //                    chartProperty.plotOptions_Spline_Marker_enabled = false;
                //                }
                //5.重新绑定Chart
                Agi.Controls.DynamicChart.ParasChangeUpCharts(Me,chartProperty);
            });
        });
    }
}
function GetColor(PointName, PointColors) {
    for (var i = 0; i < PointColors.length; i++) {
        if (PointName == PointColors[i].name) {
            return PointColors[i].color;
        }
    }
}
function maxLine(arrayL) {   //最大值
    if (arrayL.length > 0) {
        var LineArray = [];
        for (var i = 0; i < arrayL.length; i++) {
            LineArray.push(arrayL[i].value);
        }
        return Math.max.apply({}, LineArray);
    }
    return 0;
}
function minLine(arrayL) {   //最小值
    if (arrayL.length > 0) {
        var LineArray = [];
        for (var i = 0; i < arrayL.length; i++) {
            LineArray.push(arrayL[i].value);
        }
        return Math.min.apply({}, LineArray);
    }
    return 0;
}

//region 20130718 13:55 markeluo 修改 实时点位漏点问题解决
Agi.Controls.DynamicChartUpdatePoint=function(_ControlObj,_chartSeires,_chartCurrentData){
    var serLen = _chartCurrentData.length;
    for (var i = 0; i< serLen; i++) {
        if(!_chartCurrentData[i].IsShow){
            Agi.Controls.DynamicChartUpdatePointAddPvalues(_ControlObj,_chartSeires,_chartCurrentData[i]);
            _chartCurrentData[i].IsShow=true;
        }
    }//end for
}
Agi.Controls.DynamicChartUpdatePointAddPvalues=function(_ControlObj,_chartSeries,_chartCurrentDataItem){
//    var PointValuesLength=_chartCurrentData[_j].Values.length;
//    if (_chartSeries[_i].name == _chartCurrentData[_j].Tag
//        && _chartCurrentData[_j].Values!= null && PointValuesLength>0){
//        for(var z=0;z<PointValuesLength;z++){
//            if (_chartCurrentData[_j].Values[z]!= null && _chartCurrentData[_j].Values[z].y!=null){
//                _chartSeries[_i].addPoint(Agi.Controls.DynamicChartCheckPointType(_ControlObj,_chartCurrentData[_j].Values[z]), true, true);
//                _chartCurrentData[_j].Values[z]={x:null,y:null};
//            }
//        }
//    }
//    PointValuesLength=null;
    if(_chartSeries!=null && _chartSeries.length>0){
        var AddPointValue=null;
        for(var i=0;i<_chartSeries.length;i++){
            if(_chartCurrentDataItem.Points!=null && _chartCurrentDataItem.Points.length>0){
                for(var j=0;j<_chartCurrentDataItem.Points.length;j++){
                    if(_chartSeries[i].name==_chartCurrentDataItem.Points[j].Tag){
                        AddPointValue=Agi.Controls.DynamicChartCheckPointType(_ControlObj,_chartCurrentDataItem.DTValue,_chartCurrentDataItem.Points[j].Value);
                        if(AddPointValue.x!=null){
                            _chartSeries[i].addPoint(AddPointValue, true, true);
                        }
                    }
                }
            }
        }
    }
}

Agi.Controls.DynamicChartCheckPointType=function (_ControlObj,_xvalue,_yvalue) {//对Point数据进行检查，并返回模块化数据类型，_value:数据{x:"",y:""}，_chartProperty，属性集合
    var _chartProperty = _ControlObj.Get('ChartProperty');
    var maxValue = maxLine(_chartProperty.yAxisLines);
    var minValue = minLine(_chartProperty.yAxisLines);
    //_xvalue=Agi.Controls.DynamicChart.TimeStrConverToTime(_xvalue);
    if (_yvalue > maxValue)
        return {x:_xvalue, y:_yvalue, marker: { fillColor: _chartProperty.yAxis_PlotLines_MaxMarkerColor} };
    if (_yvalue< minValue)
        return {x:_xvalue, y:_yvalue, marker: { fillColor: _chartProperty.yAxis_PlotLines_MinMarkerColor} };
    return {x:_xvalue, y:_yvalue };
}
//endregion
//region 转换时间字符串为时间数值
Agi.Controls.DynamicChart.TimeStrConverToTime=function(c_date){
    var date = null;
    if (!c_date)
        return date;
    var DateType=0;
    var tempArray = c_date.split("-");
    if (tempArray.length != 3) {
        tempArray = c_date.split("/");
        if (tempArray.length != 3) {
            return date;
        }
        DateType=1;
    }
    var dateArr = c_date.split(" ");
    var Millisecond="000";
    if (dateArr.length == 2) {
        var yymmdd = dateArr[0].split("-");
        if(DateType==1){
            yymmdd = dateArr[0].split("/");
        }
        var hhmmss = dateArr[1].split(":");
        Millisecond=hhmmss[2].split(".")[1];
        hhmmss[2]=hhmmss[2].split(".")[0];
        date = new Date(yymmdd[0], yymmdd[1] - 1, yymmdd[2], hhmmss[0], hhmmss[1], hhmmss[2]);
    } else {
        date = new Date(tempArray[0], tempArray[1] - 1, tempArray[2], 00, 00, 01);
    }
    date=Date.parse(date);
    if(Millisecond!="000"){
        date=date+eval(Millisecond);
    }
    return date;
}
//图形获得第一个点时，根据时间和显示点数初始化数据数组
Agi.Controls.DynamicChart.InitDataArrayByTime=function(_IntPointNumber,_PointArray,_DateTime){
    var objData = [];
    var ThisDay = _DateTime;
    for (var i = _IntPointNumber; i >0;i--) {
        objData.push({DTValue:(ThisDay.valueOf() - (i * 500)),Points:[],IsShow:false});
       for(var j=0;j<_PointArray.length;j++){
           objData[objData.length-1].Points.push({Tag:_PointArray[j],Value:null});
       }
    }
    return objData;
}
//根据点位号获取点位所需的图形数据
Agi.Controls.DynamicChart.GetPointDataArray=function(_PointTag,ChartDataArray){
    var objData = [];
    for (var i = 0; i<ChartDataArray.length;i++) {
        for(var j=0;j<ChartDataArray[i].Points.length;j++){
            if(ChartDataArray[i].Points[j].Tag==_PointTag){
                objData.push({x:ChartDataArray[i].DTValue,y:ChartDataArray[i].Points[j].Value});
                break;
            }
        }
    }
    return objData;
}
//更新点位数据
Agi.Controls.DynamicChart.AddPointUpDataArray=function(_PointTag,_XTime,_Value,ChartDataArray){
    var BolIsUpdate=false;
    for (var i = 0; i<ChartDataArray.length;i++) {
        if(ChartDataArray[i].DTValue==_XTime){
            if(ChartDataArray[i].IsShow){
                BolIsUpdate=true;
                break;
            }
            BolIsUpdate=true;
            for (var j = 0; j<ChartDataArray[i].Points.length;j++) {
                if(_PointTag==ChartDataArray[i].Points[j].Tag){
                    ChartDataArray[i].Points[j].Value=_Value;
                    break;
                }
            }
            break;
        }
    }
    if(!BolIsUpdate){
        var TimePointsArray=[];
        for (var j = 0; j<ChartDataArray[0].Points.length;j++) {
            if(_PointTag==ChartDataArray[0].Points[j].Tag){
                TimePointsArray.push({Tag:_PointTag,Value:_Value});
            }else{
                TimePointsArray.push({Tag:ChartDataArray[0].Points[j].Tag,Value:null});
            }
        }
        ChartDataArray.shift();
        ChartDataArray.push({DTValue:_XTime,Points:TimePointsArray,IsShow:false});
    }
    return ChartDataArray;
}
//6.参数变化保存并刷新页面图形显示数据、状态
Agi.Controls.DynamicChart.ParasChangeUpCharts=function(_Control,_chartProperty){
    //对属性进行保存
    _Control.Set('ChartProperty', _chartProperty);
    //重新设置series数据
    _Control.SetChartDataProperty();
    //进行画布的显示
    _Control.InitHighChart();
    //重新开始自动滚动数据
    var pointsParameters = _Control.Get("PointsParamerters");
    if (pointsParameters != null && pointsParameters.length > 0) {
        //_Control.BeginInterval();
    }
    //页面重新刷新
    $(window).resize();
}
//endregion