/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.SpcDemoPCChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        initData:function (data) {
            if (data) {
                if (data.histoSeriesData.length == 0 || data.normalSeriesData.length == 0) {
                    return;
                }
                var container = this.Get("HTMLElement").id;
                //highcharts-container
                var chart = this.Get("ProPerty").BasciObj;
                try {
                    chart.destroy();
                } catch (e) {
                    chart = null;
                    $("#" + container).find(".highcharts-container").remove();
                }
                //
                var handle = $("#" + container).children().clone()
                //
                $("#" + container).children().remove();
                //
                //theme
                var ChartOptions = this.Get("ChartOptions");
                //
                var control = this;
                //
                chart = new Highcharts.Chart({
                    colors: ChartOptions.colors,
                    chart: {
                        renderTo: container,
                        //透明底样式
                        backgroundColor: 'transparent',
                        //白色底样式
                        //                            backgroundColor: ChartOptions.chart.backgroundColor,

                        /*borderColor:ChartOptions.chart.borderColor,
                        borderWidth:ChartOptions.chart.borderWidth,*/
                        className: ChartOptions.chart.className,
                        //透明底样式
                        plotBackgroundColor: 'transparent',
                        //白色底样式
                        //                            plotBackgroundColor: ChartOptions.chart.plotBackgroundColor,
                        plotBorderColor: ChartOptions.chart.plotBorderColor,
                        plotBorderWidth: ChartOptions.chart.plotBorderWidth
                    },
                    title:ChartOptions.title,
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    xAxis: [
                            {
                                min: data.xMin,
                                max: data.xMax,
                                plotLines: [
                                    {
                                        label: {
                                            text: 'LSL',
                                            rotation: 0,
                                            style: {
                                                fontWeight: 'bold',
                                                //透明底样式
                                                color: '#909596'
                                            },
                                            x: -12,
                                            y: -0
                                        },
                                        dashStyle: 'solid',
                                        value: data.lsl, width: 2,
                                        color: '#95A7B3'
                                    },
                                    {
                                        label: {
                                            text: '目标',
                                            rotation: 0,
                                            style: {
                                                fontWeight: 'bold',
                                                //透明底样式
                                                color: '#FFF'
                                            },
                                            x: -13,
                                            y: -0
                                        },
                                        dashStyle: 'solid',
                                        value: data.target, width: 2,
                                        color: '#FF0000'
                                    },
                                    {
                                        label: {
                                            text: 'USL',
                                            rotation: 0,
                                            style: {
                                                fontWeight: 'bold',
                                                //透明底样式
                                                color: '#909596'
                                            },
                                            x: -13,
                                            y: -0
                                        },
                                        dashStyle: 'solid',
                                        value: data.usl, width: 2,
                                        color: '#95A7B3'
                                    },
                                    {
                                        label: {
                                            text: '均值',
                                            rotation: 0,
                                            style: {
                                                fontWeight: 'bold',
                                                //透明底样式
                                                color: '#FFF'
                                            },
                                            x: -13,
                                            y: -0
                                        },
                                        dashStyle: 'longdash',
                                        value: data.avg, width: 1,
                                        color: '#7E9E33'
                                    },
                                    {
                                        label: {
                                            text: '3',
                                            rotation: 0,
                                            style: {
                                                fontWeight: 'bold',
                                                //透明底样式
                                                color: '#909596'
                                            },
                                            x: -13,
                                            y: -0
                                        },
                                        dashStyle: 'longdash',
                                        value: data.pValue, width: 1,
                                        color: '#7E9E33'
                                    },
                                    {
                                        label: {
                                            text: '-3',
                                            rotation: 0,
                                            style: {
                                                fontWeight: 'bold',
                                                //透明底样式
                                                color: '#909596'
                                            },
                                            x: -13,
                                            y: -0
                                        },
                                        dashStyle: 'longdash',
                                        value: data.opValue, width: 1,
                                        color: '#7E9E33'
                                    }
                                ]
                            },
                            {
                                linkedTo: 0,
                                lineWidth: 0,
                                labels: {
                                    enabled: false
                                }
                            }
                        ],
                    yAxis: [
                            {
                                min: 0,
                                gridLineDashStyle: 'dash',
                                //tickInterval:2,
                                title: {
                                    text: null
                                }
                            },
                            {
                                min: 0,
                                gridLineDashStyle: 'dash',
                                title: {
                                    text: null
                                },
                                labels: {
                                    enabled: false
                                    //                                    formatter:function () { //格式化标签名称
                                    //                                        return this.value + '%';
                                    //                                    }
                                },
                                opposite: true
                            }
                        ],
                    series: [
                            {
                                type: 'column',
                                data: data.histoSeriesData,
                                xAxis: 0,
                                yAxis: 0,
                                point: {
                                    events: {
                                        mouseOver: function () {
                                            control.pointMouseover(this, control);
                                        },
                                        mouseOut: function () {
                                            control.pointMouseout(this, control);
                                        }
                                    }
                                }
                                //                                    [
                                //                                    [1.2478, 2],
                                //                                    [1.2482, 6],
                                //                                    [1.2488, 28.57],
                                //                                    [1.2492, 47.62],
                                //                                    [1.2498, 12],
                                //                                    [1.2502, 3]
                                //                                ],
                            },
                            {
                                type: 'spline',
                                data: data.normalSeriesData,
                                //白色底样式
                                //                                color: 'black',
                                //透明底样式
                                color: '#909596',

                                lineWidth: 2,
                                xAxis: 1,
                                yAxis: 1
                                /*[
                                [1.245, 0],
                                [1.246, 0],
                                [1.247, 0],
                                [1.248, 1],
                                [1.249, 27],
                                [1.250, 4],
                                [1.251, 0],
                                [1.252, 0],
                                [1.253, 0],
                                [1.254, 0],
                                [1.255, 0]
                                ]*/
                            }
                        ],
                    plotOptions: {
                        column: {
                            color: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                                stops: [
                                        [0, '#8bdcf9'],
                                        [0.2, '#76ccef'],
                                        [1, '#5ab2d5']
                                    ]
                            },
                            //pointWidth:25,
                            borderWidth: 1,
                            borderColor: '#689196',
                            pointPadding: 0,
                            groupPadding: 0,
                            shadow: true
                        },
                        spline: {
                            marker: {
                                enabled: false
                            }, /*
                                 tooltip:{
                                 enabled:false
                                 },*/
                            enableMouseTracking: false
                        }

                    },
                    tooltip: {
                        formatter: function () {
                            var x = this.x;
                            var l = 0, u = 0;
                            for (var i = 0; i < data.histoSeriesDataDic.length; i++) {
                                var item = data.histoSeriesDataDic[i];
                                if (item.key == x) {
                                    //
                                    var lString = item.l.toString();
                                    var lIndex = lString.indexOf(".");
                                    l = lString.substring(0, lIndex + 3);
                                    //
                                    var uString = item.u.toString();
                                    var uIndex = uString.indexOf(".");
                                    u = uString.substring(0, uIndex + 3);
                                    break;
                                }
                            }
                            return '介于' + l + '与' + u + '之间的值有<b>' + this.y + '</b>个 ';
                        }
                    }
                });
                //
                $("#" + container).append(handle);
                //
                var property = this.Get("ProPerty");
                property.BasciObj = chart;
                this.Set("ProPerty", property);
            }
        },
        Render:function (_Target) {
            var obj = null;
            if (typeof(_Target) == "string") {
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
            }
        },
        ReadData:function (_EntityInfo) {
            var Me = this;
            var MeEntitys = this.Get("Entity");
            MeEntitys = [];
            MeEntitys.push(_EntityInfo);
            this.Set("Entity", MeEntitys);
            this.changEntity = true;
            //
            var PCChartDataProperty = this.Get("PCChartDataProperty");
            PCChartDataProperty.data.histoSeriesData = [];
            PCChartDataProperty.data.normalSeriesData = [];
            this.Set("PCChartDataProperty", PCChartDataProperty);
            if(!_EntityInfo.IsShareEntity){
                Agi.Utility.RequestData(_EntityInfo, function (d) {
                    _EntityInfo.Data = d;
                    //Me.AddEntity(_EntityInfo);
                    Me.BindDataByEntity(_EntityInfo);
                });
            }else{
                Me.BindDataByEntity(_EntityInfo);
            }
        },
        ReadRealData:function () {
        },
        BindDataByEntity:function(_entity){
            var data =  _entity.Data;


            var data2 = {"histoSeriesData":[
                [28709.04, 2],
                [29340.04, 9],
                [29971.04, 5],
                [30602.04, 11],
                [31233.04, 0],
                [31864.04, 28]
            ],
                "normalSeriesData":[
                    [25345.72696, 1.336381e-9],
                    [25458.100344, 2.192331e-9],
                    [25570.473728, 3.560729e-9],
                    [25682.847112, 5.725704e-9],
                    [25795.220495, 9.115401e-9],
                    [25907.593879, 1.4367453e-8],
                    [26019.967263, 2.2420269e-8],
                    [26132.340647, 3.4638488e-8],
                    [26244.714031, 5.29827e-8],
                    [26357.087415, 8.023545e-8],
                    [26469.460798, 1.20297211e-7],
                    [26581.834182, 1.78567278e-7],
                    [26694.207566, 2.62425029e-7],
                    [26806.58095, 3.81826164e-7],
                    [26918.954334, 5.50025937e-7],
                    [27031.327718, 7.84436351e-7],
                    [27143.701101, 0.00000110761622],
                    [27256.074485, 0.000001548381446],
                    [27368.447869, 0.000002143007373],
                    [27480.821253, 0.000002936475806],
                    [27593.194637, 0.000003983696499],
                    [27705.568021, 0.000005350607772],
                    [27817.941404, 0.000007115035043],
                    [27930.314788, 0.000009367161887],
                    [28042.688172, 0.000012209448959],
                    [28155.061556, 0.000015755825293],
                    [28267.43494, 0.000020129978202],
                    [28379.808324, 0.000025462585942],
                    [28492.181707, 0.000031887374788],
                    [28604.555091, 0.000039535940994],
                    [28716.928475, 0.000048531358537],
                    [28829.301859, 0.00005898069322],
                    [28941.675243, 0.000070966657694],
                    [29054.048627, 0.000084538762483],
                    [29166.422011, 0.000099704434737],
                    [29278.795394, 0.000116420676978],
                    [29391.168778, 0.000134586909384],
                    [29503.542162, 0.000154039668482],
                    [29615.915546, 0.000174549812052],
                    [29728.28893, 0.000195822797674],
                    [29840.662314, 0.000217502459126],
                    [29953.035697, 0.00023917850519],
                    [30065.409081, 0.000260397720587],
                    [30177.782465, 0.000280678575948],
                    [30290.155849, 0.000299528675274],
                    [30402.529233, 0.000316464210687],
                    [30514.902617, 0.000331030381042],
                    [30627.276, 0.000342821586819],
                    [30739.649384, 0.000351500156608],
                    [30852.022768, 0.000356812401187],
                    [30964.396152, 0.000358600930791],
                    [31076.769536, 0.000356812401187],
                    [31189.14292, 0.000351500156608],
                    [31301.516303, 0.000342821586819],
                    [31413.889687, 0.000331030381042],
                    [31526.263071, 0.000316464210687],
                    [31638.636455, 0.000299528675274],
                    [31751.009839, 0.000280678575948],
                    [31863.383223, 0.000260397720587],
                    [31975.756606, 0.00023917850519],
                    [32088.12999, 0.000217502459126],
                    [32200.503374, 0.000195822797674],
                    [32312.876758, 0.000174549812052],
                    [32425.250142, 0.000154039668482],
                    [32537.623526, 0.000134586909384],
                    [32649.996909, 0.000116420676978],
                    [32762.370293, 0.000099704434737],
                    [32874.743677, 0.000084538762483],
                    [32987.117061, 0.000070966657694],
                    [33099.490445, 0.00005898069322],
                    [33211.863829, 0.000048531358537],
                    [33324.237213, 0.000039535940994],
                    [33436.610596, 0.000031887374788],
                    [33548.98398, 0.000025462585942],
                    [33661.357364, 0.000020129978202],
                    [33773.730748, 0.000015755825293],
                    [33886.104132, 0.000012209448959],
                    [33998.477516, 0.000009367161887],
                    [34110.850899, 0.000007115035043],
                    [34223.224283, 0.000005350607772],
                    [34335.597667, 0.000003983696499],
                    [34447.971051, 0.000002936475806],
                    [34560.344435, 0.000002143007373],
                    [34672.717819, 0.000001548381446],
                    [34785.091202, 0.00000110761622],
                    [34897.464586, 7.84436351e-7],
                    [35009.83797, 5.50025937e-7],
                    [35122.211354, 3.81826164e-7],
                    [35234.584738, 2.62425029e-7],
                    [35346.958122, 1.78567278e-7],
                    [35459.331505, 1.20297211e-7],
                    [35571.704889, 8.023545e-8],
                    [35684.078273, 5.29827e-8],
                    [35796.451657, 3.4638488e-8],
                    [35908.825041, 2.2420269e-8],
                    [36021.198425, 1.4367453e-8],
                    [36133.571808, 9.115401e-9],
                    [36245.945192, 5.725704e-9],
                    [36358.318576, 3.560729e-9],
                    [36470.69196, 2.192331e-9]
                ],
                "usl":"40000", "lsl":"10000", "target":"25000",
                "histoSeriesDataDic":[],
                "xMax":40000, "xMin":10000,
                "avg":30932.451272727274,
                "pValue":"34269.94076", "opValue":"27594.96178"
            };

            //正太分布图数据计算参数
            var temp = {
                "xBarBar":null,
                "sigma":null
            };
            if(data!=null && data.length>0){
                data2.usl = data[0].usl;
                data2.lsl = data[0].lsl;
                data2.target = data[0].target;
                data2.xMax = data[0].xMax;
                data2.xMin = data[0].xMin;
                data2.avg = data[0].avg;
                data2.pValue = data[0].pValue;
                data2.opValue = data[0].opValue;
                temp.xBarBar = data[0].xBarBar;
                temp.sigma = data[0].sigma;
                for(var i = 0;i<data.length;i++){
                    var aData = data[i];
                    data2.histoSeriesData.push([ aData['histoX'],aData['histoY']]) ;
                }
            }
            //清空正太分布测试数据
            data2.normalSeriesData = [];
            //正态分布重新计算
            var distribution = new NormalDistribution(temp.xBarBar, temp.sigma);
            var plot = new DistributionPlot('plot_qwerty', distribution);
            data2.normalSeriesData = plot._pdfValues;

            this.initData(data2);
        },
        AddEntity:function (_entity) {/*添加实体*/
            var that = this;
            if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
                //
                var dataArray = [];
                var data = _entity.Data;
                var cols = _entity.Columns;
//                $.each(data, function (i, item) {
//                    $.each(cols, function (i2, col) {
//                        if (item[col]) {
//                            dataArray.push(item[col]);
//                        }
//                    })
//                })
                //20121121 markeluo SPC图修改  NO:201211210918 start
                var MaxLength = 1000;//限定处理数据最大行数为1000
                $.each(data, function (i, item) {
                    if (item[cols[0]]) {//默认第一列为分组数据
                        if (dataArray.length >= MaxLength) {
                            return false;
                        } else {
                            dataArray.push(eval(item[cols[0]]));
                        }
                    }
                });
                //NO:201211210918 end
                var PCChartDataProperty = that.Get("PCChartDataProperty");
                //
                var dataProperty = PCChartDataProperty.propertyData;
                //
                var data = PCChartDataProperty.data;
                //
                data.usl = dataProperty.usl;
                data.lsl = dataProperty.lsl;
                data.target = dataProperty.target;
                //region 直方图
                var json = {'action':'RCalHistogram', 'dataArray':dataArray, 'sampleLength':'', 'USL':'', 'LSL':'', 'specValue':''};
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName":"RCalHistogram",
                        "Paras":jsonString,
                        "CallBackFunction":function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var histoReturn = result;
                                //
                                data.histoSeriesData.length = 0;
                                data.histoSeriesDataDic = [];
                                var allXNumber = [];
                                allXNumber.push(data.usl);
                                allXNumber.push(data.lsl);
                                allXNumber.push(data.target);
                                //
                                for (var i = 0; i < result.data.groupNumber; i++) {
                                    var item = result.data.groups[i];
                                    var x = item.upperLimit - (item.upperLimit - item.lowerLimit) / 2;
                                    var y = item.groupSize;
                                    data.histoSeriesData.push([x, y]);
                                    data.histoSeriesDataDic.push({key:x, l:item.lowerLimit, u:item.upperLimit})
                                    allXNumber.push(x);
                                }
                                /*此处.NET R 返回参数中有avg,pvalue,opvalue 三个参数，JAVA的R 返回值中没有此三个参数
                                 * 20121121 markeluo SPC图修改  NO:201211211345 start*/
//                                allXNumber.push(result.data.avg);
//                                allXNumber.push(result.data.pValue);
//                                allXNumber.push(result.data.opValue);
                                //NO:201211211345 end
                                data.xMax = Math.max.apply(Math, allXNumber);
                                data.xMin = Math.min.apply(Math, allXNumber);
                                //
                                data.avg = result.data.avg;
                                data.pValue = result.data.pValue;
                                data.opValue = result.data.opValue;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //endregion
                //region 正太分布
                var json = {'action':'RCalNormalDis', 'dataArray':dataArray, 'nrow':dataProperty.nrow};
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName":"RCalNormalDis",
                        "Paras":jsonString,
                        "CallBackFunction":function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var normalReturn = result;
                                //js
                                var distribution = new NormalDistribution(normalReturn.data.xBarBar, normalReturn.data.sigma);
                                var plot = new DistributionPlot('plot_qwerty', distribution);
                                data.normalSeriesData = plot._pdfValues;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //endregion
                return;
                //
//                var Me = this;
//                var Entitys = Me.Get("Entity");
//                var bolIsEx = false;
                if (Entitys != null && Entitys.length > 0) {
                    for (var i = 0; i < Entitys.length; i++) {
                        if (Entitys[i].Key == _entity.Key) {
                            bolIsEx = true;
                            break;
                        }
                    }
                }
                if (!bolIsEx) {
                    Entitys.push(_entity);
                }
                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                var ChartSerieslength = ThisChartObj.series.length;
                for (var i = 0; i < ChartSerieslength; i++) {
                    ThisChartObj.series[0].remove();
                }
                var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
                for (var i = 0; i < Entitys.length; i++) {
                    if (i < THisChartDataArray.length) {
                        if (THisChartDataArray[i].Entity == null) {
                            THisChartDataArray.splice(i, 1);
                            i = 0;
                        }
                    }
                }
                if (Entitys != null && Entitys.length > 0) {
                    var ChartXAxisArray = [];
                    for (var i = 0; i < Entitys.length; i++) {
                        if (i < THisChartDataArray.length) {
                            THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(Entitys[i], [Entitys[i].Columns[0], Entitys[i].Columns[1]]));
                        } else {
                            THisChartDataArray.push({name:Agi.Controls.PCChartNewSeriesName(THisChartDataArray), data:Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _entity.Columns[1]])), type:"column", color:"#058DC7", Entity:_entity, XColumn:_entity.Columns[0], YColumn:_entity.Columns[1]});
                        }
                        ThisChartObj.addSeries(THisChartDataArray[i]);
                    }
                    ThisChartObj.setSize(ThisChartObj.chartWidth, ThisChartObj.chartHeight);
                    ThisChartObj.xAxis[0].setCategories(ChartXAxisArray);
                    Me.Set("ChartXAxisArray", ChartXAxisArray);
                    /*图表Chart X轴相应的显示点集合*/
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.PCChartShowSeriesPanel(Me);
                    }
                    Me.RefreshStandLines();//更新基准线显示
                }
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(Me);//更新实体数据显示
                }
            } else {
                //alert("您添加的实体无数据！");
            }
        },
        AddColumn:function (_entity, _ColumnName) {
            var Me = this;
            var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
            var ColumnIsAddedToChart = false;
            for (var i = 0; i < THisChartDataArray.length; i++) {
                if (THisChartDataArray[i].Entity == _entity && THisChartDataArray[i].YColumn === _ColumnName) {
                    ColumnIsAddedToChart = true;
                    break;
                }
            }
            if (!ColumnIsAddedToChart) {
                var ChartXAxisArray = Me.Get("ChartXAxisArray");
                /*图表Chart X轴相应的显示点集合*/
                THisChartDataArray.push({name:Agi.Controls.PCChartNewSeriesName(THisChartDataArray), data:Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _ColumnName])), type:"column", color:"#058DC7", Entity:_entity, XColumn:_entity.Columns[0], YColumn:_ColumnName});
                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                ThisChartObj.addSeries(THisChartDataArray[THisChartDataArray.length - 1]);
                ThisChartObj.xAxis[0].setCategories(ChartXAxisArray);
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.PCChartShowSeriesPanel(Me);
                    Me.RefreshStandLines();//更新基准线显示
                }
            }
        }, //拖动列到图表新增Series
        UpDateEntity:function (_callBackFun) {
            var Me = this;
            var MeEntitys = Me.Get("Entity");
            var ThisEntityLength = MeEntitys.length;
            var ChartXAxisArray = [];
            for (var i = 0; i < MeEntitys.length; i++) {
                var THisEntity = MeEntitys[i];
                Agi.Utility.RequestData(THisEntity, function (d) {
                    THisEntity.Data = d;
                    ThisEntityLength = ThisEntityLength - 1;
                    if (ThisEntityLength == 0) {
                        var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
                        for (var i = 0; i < MeEntitys.length; i++) {
                            THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(THisEntity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]));
                        }
                        Me.Set("ChartXAxisArray", ChartXAxisArray);
                        /*图表Chart X轴相应的显示点集合*/
                        _callBackFun();
                    }
                });
            }
        }, //更新实体数据，回调函数通知更新完成
        UpDateSeriesData:function () {
            var Me = this;
            var ChartXAxisArray = [];
            var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
            for (var i = 0; i < THisChartDataArray.length; i++) {
                THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]));
            }
            Me.Set("ChartXAxisArray", ChartXAxisArray);
            /*图表Chart X轴相应的显示点集合*/
        },
        RemoveSeries:function (_SeriesName) {
            var Me = this;
            var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
            var ThisBaseObj = Me.Get("ProPerty").BasciObj;
            var RemoveIndex = -1;
            for (var i = 0; i < THisChartDataArray.length; i++) {
                if (THisChartDataArray[i].name == _SeriesName) {
                    RemoveIndex = i;
                    break;
                }
            }
            if (RemoveIndex > -1) {
                var EntityKey = THisChartDataArray[RemoveIndex].Entity.Key;
                ThisBaseObj.series[RemoveIndex].remove();
                THisChartDataArray.splice(RemoveIndex, 1);
            }
            Me.UpDateSeriesData();
            Me.Refresh();
        }, //移除Series
        RemoveEntity:function (_EntityKey) {
            var Me = this;
            var Entitys = Me.Get("Entity");
            var entityIndex = -1;
            if (Entitys != null && Entitys.length > 0) {
                for (var i = 0; i < Entitys.length; i++) {
                    if (Entitys[i].Key == _EntityKey) {
                        entityIndex = i;
                        break;
                    }
                }
            }
            if (entityIndex > -1) {
                Entitys.splice(entityIndex, 1);//移除实体元素
            }
            var ThisChartObj = Me.Get("ProPerty").BasciObj;
            var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
            if (THisChartDataArray != null && THisChartDataArray.length > 0) {
                var ChartXAxisArray = [];
                for (var i = 0; i < THisChartDataArray.length; i++) {
                    if (THisChartDataArray[i].Entity.Key == _EntityKey) {
                        ThisChartObj.series[i].remove();
                        THisChartDataArray.splice(i, 1);
                        i = 0;
                    }
                }
                ThisChartObj.setSize(ThisChartObj.chartWidth, ThisChartObj.chartHeight);
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.PCChartShowSeriesPanel(Me);
                }
            }
            Me.RefreshStandLines();//更新基准线显示
        }, //移除实体Entity
        ParameterChange:function (_ParameterInfo) {
            //当前控件的Entity参数已经被更改，需要将实体的数据重新查找一遍并更新显示
//            var Me = this;
//            Me.UpDateEntity(function () {
//                Me.Refresh();//刷新显示
            //            });
            var chart = this.Get("ProPerty").BasciObj;
            //
            try {
                chart.destroy();
            } catch (e) {
                chart = null;
                var container = this.Get("HTMLElement").id;
                $("#" + container).find(".highcharts-container").remove();
            }
            //
            this.ReadData(this.Get("Entity")[0]);
        }, //参数联动
        Init:function (_Target, _ShowPosition) {
            var Me = this;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "SpcDemoPCChart");
            var ID = "SpcDemoPCChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PCChartPanelSty'></div>");
            HTMLElementPanel.css('padding-bottom', '0px');
            var PostionValue = {Left:0, Top:0, Right:0, Bottom:0};
            var obj = null;
            if (typeof(_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = {Width:$(obj).width(), Height:$(obj).height(), Left:0, Top:0};
            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(600);
                HTMLElementPanel.height(400);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                obj.html("");
            }
            var ChartXAxisArray = [];
            var THisChartData = Agi.Controls.GetChartInitData();
            THisChartData = Agi.Controls.ChartDataConvert(ChartXAxisArray, THisChartData);
            var thischartSeriesData = [];
            thischartSeriesData.push({name:"示例数据", data:THisChartData, type:"column", color:"#058DC7", Entity:null, XColumn:"", YColumn:""});
            this.Set("ChartData", thischartSeriesData);
            /*Chart数据*/
            this.Set("StandardLines", []);
            /*Chart 基准线*/
            this.Set("ChartXAxisArray", ChartXAxisArray);
            /*图表Chart X轴相应的显示点集合*/
            var ThisProPerty = {
                ID:ID,
                BasciObj:null
            };
            this.Set("ProPerty", ThisProPerty);
            this.Set("HTMLElement", HTMLElementPanel[0]);
            if (_Target != null) {
                this.Render(_Target);
            }
            var StartPoint = {X:0, Y:0}
            /*事件绑定*/
            if (Agi.Edit) {
                $("#" + HTMLElementPanel.attr("id")).dblclick(function (ev) {
                        if (!Agi.Controls.IsControlEdit) {
                            Agi.Controls.ControlEdit(Me);//控件编辑界面
                        }
                    }
                );
//                    HTMLElementPanel.dblclick(function (ev) {
//                        if (!Agi.Controls.IsControlEdit) {
//                            Agi.Controls.ControlEdit(Me);//控件编辑界面
//                        }
//                    });
                if (HTMLElementPanel.touchstart) {
                    HTMLElementPanel.touchstart(function (ev) {
                        ev.stopPropagation();
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    });
                } else {
                    HTMLElementPanel.mousedown(function (ev) {
                        ev.stopPropagation();
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    });
                }
            }
            this.Set("Position", PostionValue);
            //输出参数
            var OutPramats = {"XValue":0, "YValue":0};
            this.Set("OutPramats", OutPramats);
            /*输出参数名称集合*/
            var THisOutParats = [];
            if (OutPramats != null) {
                for (var item in OutPramats) {
                    THisOutParats.push({Name:item, Value:OutPramats[item]});
                }
            }
            Agi.Msg.PageOutPramats.AddPramats({
                "Type":Agi.Msg.Enum.Controls,
                "Key":ID,
                "ChangeValue":THisOutParats
            });
            obj = ThisProPerty = PagePars = PostionValue = THisOutParats = null;
            this.Set("ThemeInfo", "grid");
            //
            var PCChartDataProperty;
            PCChartDataProperty = {
                data:{
                    histoSeriesData:[],
                    normalSeriesData:[],
                    usl:0,
                    lsl:0,
                    target:0,
                    avg:0,
                    pValue:0,
                    opValue:0
                },
                propertyData:{
                    usl:0,
                    lsl:0,
                    target:0,
                    nrow:0
                }
            };
            this.Set("PCChartDataProperty", PCChartDataProperty);
            // this.Refresh();//刷新显示
        }, /*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
        CustomProPanelShow:function () {
            Agi.Controls.PCChartProrityInit(this);
        }, //显示自定义属性面板
        Destory:function () {
            var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/
//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length = 0;
            /*清除选中控件对象*/
            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
//            Agi.Msg.PageOutPramats.RemoveItems(proPerty.ID);//控件删除时，移除联动参数相关
            proPerty = null;
            delete this;
        },
        Copy:function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = {Left:parseFloat(PostionValue.Left), Top:parseFloat(PostionValue.Top)}
                var Newdropdownlist = new Agi.Controls.SpcDemoPCChart();
                Newdropdownlist.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return Newdropdownlist;
            }
        },
        PostionChange:function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PagePars = {Width:ParentObj.width(), Height:ParentObj.height()};
                var _ThisPosition = {
                    Left:(_Postion.Left / PagePars.Width).toFixed(4),
                    Top:(_Postion.Top / PagePars.Height).toFixed(4),
                    Right:(_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom:(_Postion.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                var ThisHTMLElementobj = $("#" + this.Get("HTMLElement").id);
                var ParentObj = ThisHTMLElementobj.parent();
                var PagePars = {Width:ParentObj.width(), Height:ParentObj.height(), Left:ParentObj.offset().left, Top:ParentObj.offset().top};
                var ThisControlPars = {Width:ThisHTMLElementobj.width(), Height:ThisHTMLElementobj.height(), Left:(ThisHTMLElementobj.offset().left - PagePars.Left), Top:(ThisHTMLElementobj.offset().top - PagePars.Top), Right:0, Bottom:0};
                ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
                ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);
                var _ThisPosition = {
                    Left:(ThisControlPars.Left / PagePars.Width).toFixed(4),
                    Top:(ThisControlPars.Top / PagePars.Height).toFixed(4),
                    Right:(ThisControlPars.Right / PagePars.Width).toFixed(4),
                    Bottom:(ThisControlPars.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }
        },
        HTMLElementSizeChanged:function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", {Left:0, Right:0, Top:0, Bottom:0});
            } else {
                Me.Refresh();
            }
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.PCChartShowSeriesPanel(Me);
            }
//        var MePrority=Me.Get("ProPerty");
//        var ThisHTMLElement=$("#"+Me.Get("HTMLElement").id);
//        MePrority.BasciObj.setSize(ThisHTMLElement.width(),ThisHTMLElement.height());/*Chart 更改大小*/
        }, //外壳大小更改
        Refresh:function () {
            //0.清除原图表
            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HtmlElementID = Me.Get("HTMLElement").id;
            var Childrens = [];
            if (MePrority.BasciObj != null) {
                MePrority.BasciObj.destroy();
                MePrority.BasciObj = null;
                $.each($("#" + HtmlElementID).children(), function (i, item) {
                    Childrens.push(item);
                })
                $("#" + HtmlElementID).children().remove();
            }
            //3.更新ChartOptions信息
            var ThisChartXAxisArray = Me.Get("ChartXAxisArray");
            /*获取图表Chart X轴相应的显示点集合*/
            var ChartOptions = Me.Get("ChartOptions");
            if (ThisChartXAxisArray != null && ThisChartXAxisArray.length > 0) {
                ChartOptions.xAxis.categories = ThisChartXAxisArray;
            }
            var thischartSeriesData = Me.Get("ChartData");//图表数据
            var BaseControlObj = new Highcharts.Chart({
                colors:ChartOptions.colors,
                chart:{
                    renderTo:HtmlElementID,
                    style:{
                        zIndex:0
                    },
                    zoomType:'',
                    reflow:true,
                    backgroundColor:ChartOptions.chart.backgroundColor,
                    borderColor:ChartOptions.chart.borderColor,
                    borderWidth:ChartOptions.chart.borderWidth,
                    className:ChartOptions.chart.className,
                    plotBackgroundColor:ChartOptions.chart.plotBackgroundColor,
                    plotBorderColor:ChartOptions.chart.plotBorderColor,
                    plotBorderWidth:ChartOptions.chart.plotBorderWidth
                },
                credits:{
                    enabled:false
                },
                legend:ChartOptions.legend,
                title:ChartOptions.title,
                xAxis:ChartOptions.xAxis,
                yAxis:ChartOptions.yAxis,
                tooltip:ChartOptions.tooltip,
                plotOptions:{
                    area:{
                        lineWidth:1,
                        marker:{
                            enabled:true,
                            states:{
                                hover:{
                                    enabled:false,
                                    radius:5
                                }
                            }
                        },
                        shadow:false,
                        states:{
                            hover:{
                                lineWidth:1
                            }
                        }
                    },
                    column:{
                        lineWidth:0,
                        borderColor:'',
                        series:{
                            pointPadding:'1px'
                        },
                        marker:{
                            enabled:false,
                            states:{
                                hover:{
                                    enabled:false,
                                    lineWidth:0
                                }
                            }
                        }
                    },
                    line:{
                        marker:{
                            enabled:true,
                            states:{
                                hover:{
                                    enabled:true,
                                    radius:4
                                }
                            }
                        }
                    },
                    bar:{
                        lineWidth:0,
                        borderColor:'',
                        series:{
                            pointPadding:'1px'
                        },
                        marker:{
                            enabled:false,
                            states:{
                                hover:{
                                    enabled:false,
                                    lineWidth:0
                                }
                            }
                        }
                    },
                    series:{
                        marker:{
                            radius:3
                        },
                        cursor:'pointer',
                        point:{
                            events:{
                                click:function () {
                                    Me.Set("OutPramats", {"XValue":this.name, "Yvalue":this.y});
                                    /*输出参数更改*/
                                }
                            }
                        },
                        states:{
                            hover:{
                                enabled:false
                            }
                        }
                    }
                },
                toolbar:ChartOptions.toolbar,
                navigation:ChartOptions.navigation,
                rangeSelector:ChartOptions.rangeSelector,
                navigator:ChartOptions.navigator,
                scrollbar:ChartOptions.scrollbar,
                legendBackgroundColor:ChartOptions.legendBackgroundColor,
                legendBackgroundColorSolid:ChartOptions.legendBackgroundColorSolid,
                dataLabelsColor:ChartOptions.dataLabelsColor,
                textColor:ChartOptions.textColor,
                maskColor:ChartOptions.maskColor,
                legend:{
                    enabled:false
                },
                yAxis:{
                    title:{
                        text:null
                    }
                },
                tooltip:{
                    enabled:false
                },
                series:thischartSeriesData
            });
            MePrority.BasciObj = BaseControlObj;
            //4.更改大小、位置 Position信息
            $("#" + HtmlElementID).append(Childrens);
            Me.Set("Position", Me.Get("Position"))
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.PCChartShowSeriesPanel(Me);
                Me.RefreshStandLines();//更新基准线显示
            }
        },
        Checked:function () {
            $("#" + this.Get("HTMLElement").id).css({"-webkit-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027"});
        },
        UnChecked:function () {
            $("#" + this.Get("HTMLElement").id).css({"-webkit-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000"});
            /* $("#" + this.Get("HTMLElement").id).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
             "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        ControlAttributeChangeEvent:function (_obj, Key, _Value) {
            Agi.Controls.PCChartAttributeChange(this, Key, _Value);
        },
        GetConfig:function () {
            var Me = this;
            var ProPerty = this.Get("ProPerty");
            /*   var ConfigObj = new Agi.Script.StringBuilder();
             */
            /*配置信息数组对象*/
            /*
             ConfigObj.append("<Control>");
             ConfigObj.append("<ControlType>" + Me.Get("ControlType") + "</ControlType>");
             */
            /*控件类型*/
            /*
             ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>");
             */
            /*控件属性*/
            /*
             ConfigObj.append("<ControlBaseObj>" + ProPerty.ID + "</ControlBaseObj>");
             */
            /*控件基础对象*/
            /*
             ConfigObj.append("<HTMLElement>" + Me.Get("HTMLElement").id + "</HTMLElement>");
             ConfigObj.append("<Entity>" + JSON.stringify(Me.Get("Entity")) + "</Entity>");
             var PCChartDataProperty = Me.Get("PCChartDataProperty");
             //PCChartDataProperty.data = null;
             ConfigObj.append("<PCChartDataProperty>" + JSON.stringify(PCChartDataProperty) + "</PCChartDataProperty>");
             */
            /*控件外壳ID*/
            /*

             //            var thischartSeriesData = Me.Get("ChartData");//图表线条Series数据
             //            var SeriesList = [];
             //            for (var i = 0; i < thischartSeriesData.length; i++) {
             //                SeriesList.push(Agi.Script.CloneObj(thischartSeriesData[i]));
             //                SeriesList[i].data = null;
             //                SeriesList[i].Entity.Parameters = thischartSeriesData[i].Entity.Parameters;
             //                if (SeriesList[i].Entity != null) {
             //                    SeriesList[i].Entity.Data = null;
             //                }
             //            }
             //            ConfigObj.append("<SeriesData>" + JSON.stringify(SeriesList) + "</SeriesData>");
             */
            /*控件实体*/
            /*
             SeriesList = null;
             ConfigObj.append("<Position>" + JSON.stringify(Me.Get("Position")) + "</Position>");
             */
            /*控件位置信息*/
            /*
             ConfigObj.append("<ChartOptions>" + JSON.stringify(Me.Get("ChartOptions")) + "</ChartOptions>");
             */
            /*Chart Options信息*/
            /*
             */
            /*ConfigObj.append("<StandardLines>" + JSON.stringify(Me.Get("StandardLines")) + "</StandardLines>");*/
            /*
             */
            /*Chart StandardLines*/
            /*
             ConfigObj.append("</Control>");
             return ConfigObj.toString(); //返回配置字符串*/
            var PCChartControl = {
                Control:{
                    ControlType:null, //控件类型
                    ControlID:null, //控件属性
                    ControlBaseObj:null, //控件基础对象
                    HTMLElement:null, //控件外壳ID
                    Entity:null, //控件实体
                    PCChartDataProperty:null, //chart基本属性
                    SeriesData:null, //系列数据
                    Position:null, //控件位置
                    ChartOptions:null //chart option
                }
            }
            /*配置信息对象*/
            PCChartControl.Control.ControlType = Me.Get("ControlType");
            PCChartControl.Control.ControlID = ProPerty.ID;
            PCChartControl.Control.ControlBaseObj = ProPerty.ID;
            PCChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
            var _entity = Me.Get("Entity");
            for(var i=0;i<_entity.length;i++){
                _entity[i].Data = null;
            }
            PCChartControl.Control.Entity = _entity;
            PCChartControl.Control.PCChartDataProperty = Me.Get("PCChartDataProperty");
            PCChartControl.Control.Position = Me.Get("Position");
            PCChartControl.Control.ChartOptions = Me.Get("ChartOptions");
            PCChartControl.Control.StandardLines = Me.Get("StandardLines");
            return   PCChartControl.Control;
        }, //获得PCChart控件的配置信息
        CreateControl:function (_Config, _Target) {
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.SeriesData = _Config.SeriesData;
                    _Config.Position = _Config.Position;
                    _Config.ChartOptions = _Config.ChartOptions;
                    _Config.Entity = _Config.Entity;
                    //PCChartDataProperty
                    var PCChartDataProperty = _Config.PCChartDataProperty;
                    this.Set("PCChartDataProperty", PCChartDataProperty);
                    //
                    var et = _Config.Entity[0];
                    if(et!=null && !et.IsShareEntity){
                        this.ReadData(et);
                    }

                    //
                    var Me = this;
                    //Me.AttributeList = [];
                    var ThisEntitys = [];
                    var bolIsExt = false;
                    if (_Config.SeriesData != null && _Config.SeriesData.length > 0) {
                        for (var i = 0; i < _Config.SeriesData.length; i++) {
                            if (ThisEntitys.length > 0) {
                                bolIsExt = false;
                                for (var j = 0; j < ThisEntitys.length; j++) {
                                    if (ThisEntitys[j].Key == _Config.SeriesData[i].Entity) {
                                        bolIsExt = true;
                                        break;
                                    }
                                }
                                if (!bolIsExt) {
                                    ThisEntitys.push(_Config.SeriesData[i].Entity);
                                }
                            } else {
                                ThisEntitys.push(_Config.SeriesData[i].Entity);
                            }
                        }
                    }
                    bolIsExt = null;
                    Me.Set("ControlType", "SpcDemoPCChart");//类型
                    //Me.Set("Entity", ThisEntitys);//实体
                    Me.Set("ChartData", _Config.SeriesData);//Series数据
                    Me.Set("ChartOptions", _Config.ChartOptions);//ChartOptions
                    Me.Set("StandardLines", _Config.StandardLines);//StandardLines
                    //
//
                    var ID = _Config.ControlID;
                    var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PCChartPanelSty'></div>");
                    HTMLElementPanel.css('padding-bottom', '0px');
                    var PostionValue = {Left:0, Top:0, Right:0, Bottom:0};
                    var obj = null;
                    if (typeof(_Target) == "string") {
                        obj = $("#" + _Target);
                    } else {
                        obj = $(_Target);
                    }
                    var PagePars = {Width:$(obj).width(), Height:$(obj).height(), Left:0, Top:0};
                    if (layoutManagement.property.type == 1) {
                        PostionValue = _Config.Position;
                    } else {
                        HTMLElementPanel.removeClass("selectPanelSty");
                        HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                        obj.html("");
                    }
                    var ThisProPerty = {
                        ID:ID,
                        BasciObj:null
                    };
                    this.Set("ProPerty", ThisProPerty);
                    this.Set("HTMLElement", HTMLElementPanel[0]);
                    if (_Target != null) {
                        this.Render(_Target);
                    }
                    var StartPoint = {X:0, Y:0}
                    /*事件绑定*/
                    if (Agi.Edit) {
                        $("#" + HTMLElementPanel.attr("id")).dblclick(function (ev) {
                                if (!Agi.Controls.IsControlEdit) {
                                    Agi.Controls.ControlEdit(Me);//控件编辑界面
                                }
                            }
                        );
                        //HTMLElementPanel.double
                        HTMLElementPanel.mousedown(function (ev) {
                            Agi.Controls.BasicPropertyPanel.Show(this.id);
                        });
                        if (HTMLElementPanel.touchstart) {
                            HTMLElementPanel.touchstart(function (ev) {
                                Agi.Controls.BasicPropertyPanel.Show(this.id);
                            });
                        }
                    }
                    this.Set("Position", PostionValue);
                    //输出参数
                    var OutPramats = {"XValue":0, "YValue":0};
                    this.Set("OutPramats", OutPramats);
                    /*输出参数名称集合*/
                    var THisOutParats = [];
                    if (OutPramats != null) {
                        for (var item in OutPramats) {
                            THisOutParats.push({Name:item, Value:OutPramats[item]});
                        }
                    }
                    Agi.Msg.PageOutPramats.AddPramats({
                        "Type":Agi.Msg.Enum.Controls,
                        "Key":ID,
                        "ChangeValue":THisOutParats
                    });
                    obj = ThisProPerty = PagePars = PostionValue = THisOutParats = null;
                    //更新实体数据
//                    Me.UpDateEntity(function () {
//                        Me.Refresh();
//                        Me.RefreshStandLines();//更新基准线
//                    });
                }
            }
        }, //根据配置信息创建控件
        AddStandardValueLine:function (_StandLineInfo, _bolIsAddList) {
            //LineDir:Horizontal 水平 ,Vertical:垂直
            //_StandLineInfo:{LineID:"line_0",LineType:"Solid",LineColor:"red",LineSize:2,LineDir:"Vertical",LineValue:2000,LineTooTips:"上线"}
            var Me = this;
            var NewLineObj = null;
            var StandardLineId = _StandLineInfo.LineID;
            var _SDLineColor = "red";
            if (_StandLineInfo.LineColor != null && _StandLineInfo.LineColor != "") {
                _SDLineColor = _StandLineInfo.LineColor;
            }
            var chartStandLines = Me.Get("StandardLines");//获取图表的基准线信息
            var ThisChartObj = Me.Get("ProPerty").BasciObj;//获取图表基本对象
            if (_StandLineInfo.LineDir == "Vertical") {
                var VerStandardlineOptions = {
                    value:_StandLineInfo.LineValue,
                    type:_StandLineInfo.LineDir,
                    color:_SDLineColor,
                    width:_StandLineInfo.LineSize,
                    id:StandardLineId,
                    zIndex:5
                };
                NewLineObj = ThisChartObj.xAxis[0].addPlotLine(VerStandardlineOptions);
            } else {
                var HorStandardlineOptions = {
                    value:_StandLineInfo.LineValue,
                    type:_StandLineInfo.LineDir,
                    color:_SDLineColor,
                    width:_StandLineInfo.LineSize,
                    id:StandardLineId,
                    zIndex:5
                };
                NewLineObj = ThisChartObj.yAxis[0].addPlotLine(HorStandardlineOptions);
            }
            if (_bolIsAddList) {
                chartStandLines.push(_StandLineInfo);
            }
            //更新Chart 的数据
            var MeChartData = Me.Get("ChartData");//获取原图表Data
            if (MeChartData != null && MeChartData.length > 0) {
                for (var i = 0; i < MeChartData.length; i++) {
                    MeChartData[i].data = Agi.Controls.SpcDemoPCChart.GetStandLineDataArray(MeChartData[i], chartStandLines);
                    /*根据基准线更新相应的点值*/
                }
            }
            Me.ReloadSeries();//更新Series数据
            return NewLineObj;
        }, //20120913,添加基准线
        RemoveStandardLine:function (_LineID) {
            var Me = this;
            var chartStandLines = Me.Get("StandardLines");//获取图表的基准线信息
            var ThisChartObj = Me.Get("ProPerty").BasciObj;//获取图表基本对象
            if (chartStandLines != null && chartStandLines.length > 0) {
                var IndexValue = -1;
                for (var i = 0; i < chartStandLines.length; i++) {
                    if (chartStandLines[i].LineID == _LineID) {
                        IndexValue = i;
                        break;
                    }
                }
                //移除基准线和菜单
                if (IndexValue > -1) {
                    Me.RemoveStandardLines(ThisChartObj, chartStandLines);//移除基准线
                    chartStandLines.splice(IndexValue, 1);
                    Me.RefreshStandLines();//刷新基准线显示
                }
            }
        }, //移除基准线
        ReloadSeries:function () {
            var Me = this;
            var MeChartData = Me.Get("ChartData");//获取原图表Data
            var ThisChartObj = Me.Get("ProPerty").BasciObj;//获取图表基本对象
            var chartStandLines = Me.Get("StandardLines");//获取图表的基准线信息
            for (var i = 0; i < ThisChartObj.series.length; i++) {
                ThisChartObj.series[0].remove();
                i--;
            }
            if (MeChartData != null && MeChartData.length > 0) {
                for (var i = 0; i < MeChartData.length; i++) {
                    MeChartData[i].data = Agi.Controls.SpcDemoPCChart.GetStandLineDataArray(MeChartData[i], chartStandLines);
                    /*根据基准线更新相应的点值*/
                    ThisChartObj.addSeries(MeChartData[i]);
                }
            }
        }, //重新加载Series
        RefreshStandLines:function () {
            var Me = this;
            var NewChartStandardLines = Me.Get("StandardLines");//获取图表的基准线信息
            var ThisChartObj = Me.Get("ProPerty").BasciObj;//获取图表基本对象
            Me.RemoveStandardLines(ThisChartObj, NewChartStandardLines);//移除基准线
            if (NewChartStandardLines != null && NewChartStandardLines.length > 0) {
                for (var i = 0; i < NewChartStandardLines.length; i++) {/*元素包含对象：LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips*/
                    var LineObj = Me.AddStandardValueLine(NewChartStandardLines[i], false);
                    Me.LoadStandardLineObjMenu(LineObj, NewChartStandardLines[i].LineDir);
                }
            } else {
                Me.ReloadSeries();//更新Series数据
            }
        }, //20120913,更新基准线显示
        LoadStandardLineObjMenu:function (_ChartStandardLineObj, _Dir) {
            var Me = this;
            Agi.Controls.SpcDemoPCChart.ShowStandardLineMenu(Me);
        }, //加载基准线菜单
        RemoveStandardLines:function (ThisChartObj, _StandardLines) {
            if (_StandardLines != null && _StandardLines.length > 0) {
                for (var i = 0; i < _StandardLines.length; i++) {
                    if (_StandardLines[i].LineDir == "Vertical") {
                        ThisChartObj.xAxis[0].removePlotLine(_StandardLines[i].LineID);
                    } else {
                        ThisChartObj.yAxis[0].removePlotLine(_StandardLines[i].LineID);
                    }
                    if ($("#Menu_" + _StandardLines[i].LineID).length > 0) {
                        $("#Menu_" + _StandardLines[i].LineID).remove();
                    }
                }
            }
        }, //20120913,移除基准线
        InEdit:function () {
            $(window).resize();
            /*debugger;
             var htmlelemnt = this.Get("HTMLElement");
             var chart = this.Get("ProPerty").BasciObj;
             $(htmlelemnt).find(".highcharts-container").css({
             width:$(htmlelemnt).width(),
             height:$(htmlelemnt).height()
             });*/
        },
        ExtEdit:function () {
            setTimeout(function () {
                $(window).resize();
            }, 300);
            /*debugger;
             var htmlelemnt = this.Get("HTMLElement");
             var chart = this.Get("ProPerty").BasciObj;
             $(htmlelemnt).find(".highcharts-container").css({
             width:$(htmlelemnt).width(),
             height:$(htmlelemnt).height()
             });*/
        },
        /*控件交互 Liuyi 2012年11月19日*/
        /*获取第三方控件和自定义函数*/
        getInsideControl:function (grid) {
            var chart = this.Get("ProPerty").BasciObj;
            //
            if (chart == null) {
                this.interactiveGrid = grid;
                return {};
            }
            return chart;
        },
        /*自定义函数*/
        pointMouseover:function (point, control) {
            /*获取chart*/
            var chart = point.series.chart;
            /*获取点索引*/
            for (var i = 0; i < point.series.data.length; i++) {
                var seriesPoint = point.series.data[i];
                if (seriesPoint === point) {
                    chart.pointIndex = i;
                }
            }
            //交互事件
            if (chart.agiEvents) {
                chart.agiEvents.pointChange(chart.pointIndex);
            }
            else {
                if(control.interactiveGrid){
                    control.interactiveGrid.highLightSpcData(chart.pointIndex, control.getSpcNrow());
                }
            }
        },
        pointMouseout:function (point, control) {
            /*获取chart*/
            var chart = point.series.chart;
            /*移除点索引*/
            chart.pointIndex = -1;
            //交互事件
            if (chart.agiEvents) {
                chart.agiEvents.pointChange(chart.pointIndex);
            }
            else {
                if(control.interactiveGrid){
                    control.interactiveGrid.highLightSpcData(chart.pointIndex, control.getSpcNrow());
                }
            }
        },
        getSpcNrow:function () {
            return this.Get("PCChartDataProperty").propertyData.nrow;
        }
//退出编辑
    })
;
/*PCChart参数更改处理方法*/
Agi.Controls.PCChartAttributeChange = function (_ControlObj, Key, _Value) {
    if (Key == "Position") {
        if (layoutManagement.property.type == 1) {
            var ThisHTMLElementobj = $("#" + _ControlObj.Get("HTMLElement").id);
            var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;
            var ParentObj = ThisHTMLElementobj.parent();
            if (!ParentObj.length) {
                return;
            }
            var PagePars = {Width:ParentObj.width(), Height:ParentObj.height()};
            ThisHTMLElementobj.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
            ThisHTMLElementobj.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
            var ThisControlPars = {Width:parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                Height:parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))};
            ThisHTMLElementobj.width(ThisControlPars.Width);
            ThisHTMLElementobj.height(ThisControlPars.Height);
            ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
            /*Chart 更改大小*/
            ThisControlObj.Refresh();
            /*Chart 更改大小*/
            PagePars = null;
        }
    } else if (Key == "OutPramats") {
        if (_Value != 0) {
            var ThisControlPrority = _ControlObj.Get("ProPerty");
            var ThisOutPars = [];
            if (_Value != null) {
                for (var item in _Value) {
                    ThisOutPars.push({Name:item, Value:_Value[item]});
                }
            }
            Agi.Msg.PageOutPramats.PramatsChange({/*Chart 输出参数更改*/
                "Type":Agi.Msg.Enum.Controls,
                "Key":ThisControlPrority.ID,
                "ChangeValue":ThisOutPars
            });
            Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj, "Type":Agi.Msg.Enum.Controls});
//            ThisOutPars=null;
        }
        //通知消息模块，参数发生更改
    } else if (Key == "ThemeInfo") {//主题更改
//        var ThisChartXAxisArray = _ControlObj.Get("ChartXAxisArray");
//        /*获取图表Chart X轴相应的显示点集合*/
        var ChartOptions = Agi.Controls.GetChartOptionsByTheme(_Value);
//        if (ThisChartXAxisArray != null && ThisChartXAxisArray.length > 0) {
//            ChartOptions.xAxis.categories = ThisChartXAxisArray;
//        }
        _ControlObj.Set("ChartOptions", ChartOptions);
        //_ControlObj.Refresh();//刷新显示
        if (_ControlObj.Get("Entity")[0]) {
            _ControlObj.initData(_ControlObj.Get("PCChartDataProperty").data);
        }
        else {
            var ThisChartXAxisArray = _ControlObj.Get("ChartXAxisArray");
            /*获取图表Chart X轴相应的显示点集合*/
            var ChartOptions = Agi.Controls.GetChartOptionsByTheme(_Value);
            if (ThisChartXAxisArray != null && ThisChartXAxisArray.length > 0) {
                ChartOptions.xAxis.categories = ThisChartXAxisArray;
            }
            _ControlObj.Set("ChartOptions", ChartOptions);
            _ControlObj.Refresh();//刷新显示
        }
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitSpcDemoPCChart = function () {
    return new Agi.Controls.SpcDemoPCChart();
}
//SpcDemoPCChart 自定义属性面板初始化显示
Agi.Controls.PCChartProrityInit = function (_PCChart) {
    var Me = _PCChart;
    var ChartOptions=Me.Get("ChartOptions");
    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //2.主题
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='PCChart_Pro_Panel'>");
    ItemContent.append("<div id='PCChart_ProTheme_grid' class='PCChart_ProTheme'></div>");
    ItemContent.append("<div id='PCChart_ProTheme_darkblue' class='PCChart_ProTheme'></div>");
    ItemContent.append("<div id='PCChart_ProTheme_darkgreen' class='PCChart_ProTheme'></div>");
    ItemContent.append("<div id='PCChart_ProTheme_gray' class='PCChart_ProTheme'></div>");
    ItemContent.append("<div style='clear: both;width:0px;height: 0px;font-size: 0px;line-height: 0px;'></div>");
    ItemContent.append("</div>");
    var ThemeContentObj = $(ItemContent.toString());
    $(".PCChart_ProTheme").die("click");
    $(".PCChart_ProTheme").live("click", function (ev) {
        var thisid = $(ev.currentTarget)[0].id;
        Me.ThemeChange(thisid.substring(thisid.lastIndexOf("_") + 1));
    });
    Me.ThemeChange = function (ThemName) {
        _PCChart.Set("ThemeInfo", ThemName);
    }

    //3.标题
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='SpcDemoPCChart_Pro_Panel'>");
    ItemContent.append("<table class='SpcDemoPCChart_prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>标题内容：</td><td colspan='3' class='SpcDemoPCChart_prortityPanelTabletd1'><input id='SpcDemoPCChart_Titletxt' type='text' style='width:70%;' ><div id='SpcDemoPCChart_TitleSave' class='BasicChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>字体样式：</td><td class='SpcDemoPCChart_prortityPanelTabletd1'><select id='SpcDemoPCChart_TitleFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>粗体样式：</td><td class='SpcDemoPCChart_prortityPanelTabletd1'><select id='SpcDemoPCChart_TitleFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>字体大小：</td><td class='SpcDemoPCChart_prortityPanelTabletd1'><input id='SpcDemoPCChart_TitleFontSize' type='number' value='14' defaultvalue='14' min='2' max='30'/></td>");
    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>字体颜色：</td><td class='SpcDemoPCChart_prortityPanelTabletd1'><input id='SpcDemoPCChart_TitleFontColor' type='text' value='#000000'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>水平方向：</td><td class='SpcDemoPCChart_prortityPanelTabletd1'><select id='SpcDemoPCChart_TitleHorDir'><option value='left'>居左</option><option value='center' selected='selected'>居中</option><option value='right'>居右</option></select></td>");
//    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>垂直方向：</td><td class='SpcDemoPCChart_prortityPanelTabletd1'><select id='SpcDemoPCChart_TitleVirDir'><option value='top' selected='selected'>居上</option><option value='middle'>居中</option><option value='bottom'>居下</option></select></td>");
    ItemContent.append("<td class='SpcDemoPCChart_prortityPanelTabletd0'>垂直方向：</td><td class='SpcDemoPCChart_prortityPanelTabletd1'><select id='SpcDemoPCChart_TitleVirDir'><option value='top' selected='selected'>居上</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var TitleObj = $(ItemContent.toString());
    //4.数据曲线
    var ThisChartData = _PCChart.Get("ChartData");
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    var ThisChartEntitys = _PCChart.Get("Entity");
    var Columns = [];
    if (ThisChartEntitys != null && ThisChartEntitys.length > 0) {
        for (var item in ThisChartEntitys[0].Columns) {
            Columns.push(ThisChartEntitys[0].Columns[item]);
        }
    }
    var DataLinesObj = null;
    if (ThisChartData != null && ThisChartData.length > 0) {
        //chart Series 颜色可选项
        var ChartLineColors = new Agi.Script.StringBuilder();
        var ChartLineColorhtml = "";
        if (Agi.Controls.ChartLineColors != null && Agi.Controls.ChartLineColors.length > 0) {
            for (var i = 0; i < Agi.Controls.ChartLineColors.length; i++) {
                ChartLineColors.append("<option value='" + Agi.Controls.ChartLineColors[i] + "' style='background-color:" + Agi.Controls.ChartLineColors[i] + "'></option>");
            }
            ChartLineColorhtml = ChartLineColors.toString();
        }
        ChartLineColors = null;
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='PCChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>曲线色系：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>默认</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>整体颜色：</td><td class='prortityPanelTabletd1'><select style='background-color:#058DC7'><option selected='selected' style='background-color:#058DC7'></option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>曲线：</td>");
        ItemContent.append("<td colspan='3' class='prortityPanelTabletd2'><input id='TxtProPanelLineName' type='text'  value='" + ThisChartData[0].name + "'><div  class='btn'>保存</div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>X轴数据：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>" + Columns[0] + "</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Y轴数据：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>" + Columns[1] + "</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>X轴类型：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>Auto</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Y轴类型：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>Auto</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>标签：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>无</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Tips：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>无</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>TooTips：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>关闭</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Tip内容：</td><td class='prortityPanelTabletd2'><input type='text'/></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>关闭</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker样式：</td><td class='prortityPanelTabletd1'><select><option selected='selected'>Circle</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker大小：</td><td class='prortityPanelTabletd1'><input type='number' value='8' min='1' max='10'/></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker颜色：</td><td class='prortityPanelTabletd1'><select style='background-color:#058DC7'><option selected='selected' style='background-color:#058DC7'></option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td colspan='4' class='basicprortitystytdCenter'>单个数据颜色</td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>颜色：</td><td colspan='3' class='prortityPanelTabletd1'><select id='BsicChartLineColorSel' style='background-color:" + Agi.Controls.ChartLineColors[0] + "'>" + ChartLineColorhtml + "</select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td colspan='4' class='basicprortitystytdCenter'>单个数据图表类型</td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td colspan='4'>");
        ItemContent.append("<div class='PCChart_ProTypeImgSty'><img id='Chart_ProType_column' src='JS/Controls/SpcDemoControls/PCChart/img/column_chart.png' title='Column'/></div>");
        ItemContent.append("<div class='PCChart_ProTypeImgSty'><img id='Chart_ProType_area' src='JS/Controls/SpcDemoControls/PCChart/img/area_chart.png' title='Area'/></div>");
        ItemContent.append("<div class='PCChart_ProTypeImgSty'><img id='Chart_ProType_line' src='JS/Controls/SpcDemoControls/PCChart/img/line_chart.png'  title='Line'/></div>");
        ItemContent.append("</td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        DataLinesObj = $(ItemContent.toString());
    }
    $("#BsicChartLineColorSel").die("change");
    $("#BsicChartLineColorSel").live("change", function (ev) {
        var ThisSelColor = $(this).val();
        $(this).css("background-color", ThisSelColor);
        Me.SeriesColorChanged(ThisSelColor);
        ThisSelColor = null;
    });
    //Series颜色更改
    Me.SeriesColorChanged = function (thisChartcolor) {
        var ChartSeriesData = _PCChart.Get("ChartData");
        var SeriesIndex = 0;
        if (Agi.Controls.PCChartSelSeriesName != null && ChartSeriesData.length > 0) {
            for (var i = 0; i < ChartSeriesData.length; i++) {
                if (ChartSeriesData[i].name === Agi.Controls.PCChartSelSeriesName) {
                    SeriesIndex = i;
                    break;
                }
            }
        }
        if (ChartSeriesData != null && ChartSeriesData.length > 0) {
            _PCChart.Get("ChartData")[SeriesIndex].color = thisChartcolor;
            _PCChart.Refresh();
        } else {
            alert("请绑定真实数据源!")
        }
    }
    $(".PCChart_ProTypeImgSty").die("click");
    $(".PCChart_ProTypeImgSty").live("click", function (ev) {
        var curentimgid = $(ev.currentTarget).find("img")[0].id;
        var thischarType = curentimgid.substring(curentimgid.lastIndexOf("_") + 1);
        Me.SeriesTypeChanged(thischarType);
    });
    Me.SeriesTypeChanged = function (thischarType) {
        var ChartSeriesData = _PCChart.Get("ChartData");
        var SeriesIndex = 0;
        if (Agi.Controls.PCChartSelSeriesName != null && ChartSeriesData.length > 0) {
            for (var i = 0; i < ChartSeriesData.length; i++) {
                if (ChartSeriesData[i].name === Agi.Controls.PCChartSelSeriesName) {
                    SeriesIndex = i;
                    break;
                }
            }
        }
        if (ChartSeriesData != null && ChartSeriesData.length > 0) {
            if (thischarType == "line") {
                _PCChart.Get("ChartData")[SeriesIndex].type = "line";
                _PCChart.Refresh();
            } else if (thischarType == "column") {
                _PCChart.Get("ChartData")[SeriesIndex].type = "column";
                _PCChart.Refresh();
            } else if (thischarType == "area") {
                _PCChart.Get("ChartData")[SeriesIndex].type = "area";
                _PCChart.Refresh();
            }
        } else {
            alert("请绑定真实数据源!")
        }
    }
    /*5.基准线---------------------------------------start*/
    var StandLinesObj = null;
    if (ThisChartData != null && ThisChartData.length > 0) {
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        var StandardLineColorsOptions = "";
        var StandardLineColors = ["#f9222c", "#3253fd", "#3fff35", "#fd1de0", "#fbdf26", "#26fbdf", "#63c404", "#0f5376"];
        /*红,蓝,绿,紫,黄,碧绿,鹅黄,蓝黑*/
        for (var i = 0; i < StandardLineColors.length; i++) {
//            if(i==0){
//                StandardLineColorsOptions=StandardLineColorsOptions+"<option selected='selected' style='background-color:"+StandardLineColors[i]+"'></option>";
//            }else{
            StandardLineColorsOptions = StandardLineColorsOptions + "<option value='" + StandardLineColors[i] + "' style='background-color:" + StandardLineColors[i] + "'></option>";
//            }
        }
        var StandardLineTypes = ["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash", "LongDash", "DashDot", "LongDashDot", "LongDashDotDot"];
        var StandardLineTypeItems = "";
        for (var i = 0; i < StandardLineTypes.length; i++) {
//            if(i==0){
//                StandardLineTypeItems=StandardLineTypeItems+"<option selected='selected'>"+StandardLineTypes[i]+"</option>";
//            }else{
            StandardLineTypeItems = StandardLineTypeItems + "<option value='" + StandardLineTypes[i] + "'>" + StandardLineTypes[i] + "</option>";
//            }
        }
        ItemContent.append("<div class='PCChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>基准线：</td>");
        ItemContent.append("<td colspan='3' class='prortityPanelTabletd2'><div class='bsicChartStandline_sty'><input id='TxtProPanelStandLineName' type='text' ></div><div id='PCChart_standardline_add'  class='bsicChartStandlineAdd'></div><div class='clearfloat'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>线样式：</td><td class='prortityPanelTabletd1'><select id='PCChart_standardline_type'>" + StandardLineTypeItems + "</select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>线颜色：</td><td class='prortityPanelTabletd1'><select id='PCChart_standardline_color' style='background-color:" + StandardLineColors[0] + "'>" + StandardLineColorsOptions + "</select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>线宽：</td><td class='prortityPanelTabletd1'><input  id='PCChart_standardline_size' type='number' value='2' min='1' max='10'/></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>方向：</td><td class='prortityPanelTabletd1'><select  id='PCChart_standardline_dir'><option selected='selected' value='Horizontal'>水平</option><option value='Vertical'>垂直</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>数据来源：</td>");
        ItemContent.append("<td class='prortityPanelTabletd2' colspan='3'><input id='StandLineValueType' type='radio' name='StandLineValueType' value='0' style='margin: 0px;' checked='checked'>固定值 <input id='StandLineValueType' type='radio' name='StandLineValueType' value='1'style='margin: 0px;'>其它值</td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>固定值：</td><td colspan='3' class='prortityPanelTabletd2'><input type='text'  id='PCChart_standardline_value'></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>参数列表：</td><td colspan='3' class='prortityPanelTabletd1'><select id='PCChart_standardline_Parsvalue' disabled='disabled'></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        StandLinesObj = $(ItemContent.toString());
        StandardLineColors = null;
        StandardLineTypes = null;
        //添加基准线，Me.AddStandardValueLine
        $("#PCChart_standardline_color").die("change");
        $("#PCChart_standardline_color").live("change", function (ev) {
            var ThisSelColor = $(this).val();
            $(this).css("background-color", ThisSelColor);
        });
        $("#StandLineValueType").die("click");
        $("#StandLineValueType").live("click", function (ev) {
            var val = $('input:radio[name="StandLineValueType"]:checked').val();
            if (val != null) {
                if (val === "1") {
                    $("#PCChart_standardline_value").attr("disabled", true);
                    $("#PCChart_standardline_Parsvalue").attr("disabled", false);
                } else {
                    $("#PCChart_standardline_Parsvalue").attr("disabled", true);
                    $("#PCChart_standardline_value").attr("disabled", false);
                }
            }
        });
        $("#PCChart_standardline_add").die("click");
        $("#PCChart_standardline_add").live("click", function (ev) {
            var thisChartStandardLines = Me.Get("StandardLines");
            var thisChartLineId = "StandardLine_" + Agi.Script.CreateControlGUID();
            var thisChartLineName = $("#TxtProPanelStandLineName").val();
            if (thisChartLineId != "") {
                var ChartLineValue = $("#PCChart_standardline_value").val();
                if (ChartLineValue == "") {
                    alert("请输入基准线的值！")
                    return;
                }
                if (isNaN(ChartLineValue)) {
                    alert("基准线的值不符合规范！")
                    return;
                }
                if (!Agi.Controls.SpcDemoPCChart.StandLineIsExt(thisChartStandardLines, thisChartLineName)) {
                    var StandLineInfo = {
                        LineID:thisChartLineId,
                        LineType:$("#PCChart_standardline_type option:selected").val(),
                        LineColor:$("#PCChart_standardline_color option:selected").val(),
                        LineSize:$("#PCChart_standardline_size").val(),
                        LineDir:$("#PCChart_standardline_dir option:selected").val(),
                        LineValue:parseInt($("#PCChart_standardline_value").val()),
                        LineTooTips:thisChartLineName
                    }
                    var NewStandLine = Me.AddStandardValueLine(StandLineInfo, true);
                    Me.LoadStandardLineObjMenu(NewStandLine, StandLineInfo.LineDir);
                } else {
                    alert("同名基准线已存在！")
                }
            } else {
                alert("基准线名称不可为空！")
            }
        });
    }
    //定制属性
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicProperty_Radius'>");
    ItemContent.append("<table class='RadiusTable'>");
    ItemContent.append("<tr>")
    ItemContent.append("<td class='prortityPCChartTabletd0'>USL</td><td class='prortityPCChartTabletd1'><div class='selectDivClass'>" +
        "<input id='PCChartPropertyUSL' type='text' value='' style='width: 100px'/>" +
        "</td></div>")
    ItemContent.append("<td class='prortityPCChartTabletd0'>LSL</td><td class='prortityPCChartTabletd1'><div class='selectDivClass'>" +
        "<input type='text' id='PCChartPropertyLSL' value='' style='width: 100px'/></div></td>");
    ItemContent.append("</tr>")
    ItemContent.append("<tr>")
    ItemContent.append("<td class='prortityPCChartTabletd0'>目标</td><td class='prortityPCChartTabletd1'><div class='colorDivClass'>" +
        "<input type='text' id='PCChartPropertyTarget' value='' style='width: 100px'></div></td>")
    ItemContent.append("<td class='prortityPCChartTabletd0'>每组大小</td><td class='prortityPCChartTabletd1'><div class='colorDivClass'>" +
        "<input type='text' id='PCChartPropertyNrow' value='' style='width: 100px'></div></td>")
    ItemContent.append("</tr>")
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPCChartTabletd0'colspan='4'><input type='button' value='保存' id='PCChartPropertySave' class='btnclass'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var propertySettings = $(ItemContent.toString());
    //
    //初始化
    var thisControl = Agi.Edit.workspace.currentControls[0];
    var PCChartDataProperty = thisControl.Get("PCChartDataProperty");
    var property = PCChartDataProperty.propertyData;
    propertySettings.find("#PCChartPropertyUSL").attr("value", property.usl);
    propertySettings.find("#PCChartPropertyLSL").attr("value", property.lsl);
    propertySettings.find("#PCChartPropertyTarget").attr("value", property.target);
    propertySettings.find("#PCChartPropertyNrow").attr("value", property.nrow);
    //
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"基本设置", DisabledValue:1, ContentObj:propertySettings }));
    //
    //保存
    $("#PCChartPropertySave").live("click", function () {
        var thisControl = Agi.Edit.workspace.currentControls[0];
        var PCChartDataProperty = thisControl.Get("PCChartDataProperty");
        var property = PCChartDataProperty.propertyData;
        property.usl = $("#PCChartPropertyUSL").attr("value");
        property.lsl = $("#PCChartPropertyLSL").attr("value");
        property.target = $("#PCChartPropertyTarget").attr("value");
        property.nrow = $("#PCChartPropertyNrow").attr("value");
        //
        thisControl.Set("PCChartDataProperty", PCChartDataProperty);
        //gyh:2012/9/25
        PCChartDataProperty.data.usl = property.usl;
        PCChartDataProperty.data.lsl = property.lsl;
        PCChartDataProperty.data.target = property.target;
        //thisControl.initData(PCChartDataProperty.data);
        if (thisControl.Get("Entity")[0]) {
            thisControl.ReadData(thisControl.Get("Entity")[0]);
        }
    });
    /*基准线-------------------------------------------end*/
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"标题", DisabledValue:1, ContentObj:TitleObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"主题", DisabledValue:1, ContentObj:ThemeContentObj}));
    //ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"数据曲线", DisabledValue:1, ContentObj:DataLinesObj}));
    //ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"基准线", DisabledValue:1, ContentObj:StandLinesObj}));
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        var itemtitle = _item.Title;
        if (_item.DisabledValue == 0) {
            itemtitle += "禁用";
        } else {
            itemtitle += "启用";
        }
        alert(itemtitle);
    }

    $("#SpcDemoPCChart_TitleFontColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
        }
    });
    if(ChartOptions.title!=null){
        if(ChartOptions.title.style!=null){
            $("#SpcDemoPCChart_Titletxt").val(ChartOptions.title.text);
            $("#SpcDemoPCChart_TitleFontSty").find("option[value='"+ChartOptions.title.style.fontFamily+"']").attr("selected","selected");
            $("#SpcDemoPCChart_TitleFontWeight").find("option[value='"+ChartOptions.title.style.fontWeight+"']").attr("selected","selected");
            $("#SpcDemoPCChart_TitleFontSize").val(parseInt(ChartOptions.title.style.fontSize.replace("px","")));
            $("#SpcDemoPCChart_TitleFontColor").spectrum("set",ChartOptions.title.style.color);
            $("#SpcDemoPCChart_TitleHorDir").find("option[value='"+ChartOptions.title.align+"']").attr("selected","selected");
            $("#SpcDemoPCChart_TitleVirDir").find("option[value='"+ChartOptions.title.verticalAlign+"']").attr("selected","selected");
        }
    }

    $("#SpcDemoPCChart_TitleSave").die("click");
    $("#SpcDemoPCChart_TitleSave").live("click",function(ev){
        var Yvalue=null;
        ChartOptions.title={
            align:$("#SpcDemoPCChart_TitleHorDir").val(),
            floating:false,
//            margin:30,
            text:$("#SpcDemoPCChart_Titletxt").val(),
            verticalAlign:null,
            style:{
                fontFamily:$("#SpcDemoPCChart_TitleFontSty").val(),
                fontWeight: $("#SpcDemoPCChart_TitleFontWeight").val(),
                color:$("#SpcDemoPCChart_TitleFontColor").val(),
                fontSize:$("#SpcDemoPCChart_TitleFontSize").val()+"px"
            }
//            ,y:Yvalue
        }
        Me.Get("ProPerty").BasciObj.setTitle(ChartOptions.title);
        Me.Set("ChartOptions",ChartOptions);
    });
}
//添加新Series时，新建一个Series名称
Agi.Controls.PCChartNewSeriesName = function (_ChartDataArray) {
    var newPCChartSeriesName = "";
    if (_ChartDataArray != null && _ChartDataArray.length > 0) {
        var SeriesNamesArray = [];
        for (var i = 0; i < _ChartDataArray.length; i++) {
            SeriesNamesArray.push(_ChartDataArray[i].name);
        }
        var maxIndex = parseInt(SeriesNamesArray[SeriesNamesArray.length - 1].substring(6)) + 1;
        newPCChartSeriesName = "Series" + maxIndex;
        SeriesNamesArray = null;
        maxIndex = null;
    } else {
        newPCChartSeriesName = "Series0";
    }
    return newPCChartSeriesName;
}
//显示Series面板
Agi.Controls.PCChartShowSeriesPanel = function (_PCChart) {
    //7.显示Series面板
    /*var ControlEditPanelID = _PCChart.Get("HTMLElement").id;
     var ChartSeriesPanel = null;
     if ($("#menuBasichartseriesdiv").length > 0) {
     $("#menuBasichartseriesdiv").remove();
     }
     ChartSeriesPanel = $("<div id='menuBasichartseriesdiv' class='BschartSeriesmenudivsty'></div>");
     ChartSeriesPanel.appendTo($("#" + ControlEditPanelID));
     ChartSeriesPanel.html("");
     var ThisChartObj = _PCChart.Get("ProPerty").BasciObj;

     if (ThisChartObj.series != null && ThisChartObj.series.length > 0) {
     for (var i = 0; i < ThisChartObj.series.length; i++) {
     $("#menuBasichartseriesdiv").append("<div class='BschartSerieslablesty'>" +
     "<div style='width:10px; height:10px; line-height: 30px; background-color:" + ThisChartObj.series[i].color + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
     "<div class='BschartSeriesname' id='Sel" + ThisChartObj.series[i].name + "'>"
     + ThisChartObj.series[i].name + "</div>" +
     "<div class='BschartseriesImgsty' id='remove" + ThisChartObj.series[i].name + "'></div>" +
     "<div class='clearfloat'></div></div>");
     }
     $("#menuBasichartseriesdiv").append("<div style='clear:both;'></div>");
     $("#menuBasichartseriesdiv").css("left", ($("#" + ControlEditPanelID).width() - 120) + "px");
     $("#menuBasichartseriesdiv").css("top", "10px");
     }
     $(".BschartSeriesname").die("click");
     $(".BschartseriesImgsty").die("click");

     $(".BschartSeriesname").live("click", function (ev) {
     var _obj = this;
     var hideseriesname = _obj.id.substring(_obj.id.indexOf("Sel") + 3);
     if (ThisChartObj.series != null && ThisChartObj.series.length > 0) {
     var SelSeries = null;
     for (var i = 0; i < ThisChartObj.series.length; i++) {
     if (ThisChartObj.series[i].name == hideseriesname) {
     SelSeries = ThisChartObj.series[i];
     break;
     }
     }
     Agi.Controls.PCChartSeriesSelected(_PCChart, SelSeries.name);//Series选中
     }
     })
     $(".BschartseriesImgsty").live("click", function (ev) {
     var _obj = this;
     var removeseriesname = _obj.id.substr(_obj.id.indexOf("remove") + 6, _obj.id.length - 6);
     $(_obj).parent().remove();
     _PCChart.RemoveSeries(removeseriesname);
     */
    /*移除线条*/
    /*
     })*/
}
//Chart Series 选中
Agi.Controls.PCChartSelSeriesName = null;
Agi.Controls.PCChartSeriesSelected = function (_PCChart, _SeriesName) {
    $("#TxtProPanelLineName").val(_SeriesName);//SeriesName
    var ThisSeriesData = _PCChart.Get("ChartData");//ChartData
    var ThisSelSeriesIndex = -1;
    for (var i = 0; i < ThisSeriesData.length; i++) {
        if (ThisSeriesData[i].name === _SeriesName) {
            ThisSelSeriesIndex = i;
            break;
        }
    }
    if (ThisSelSeriesIndex > -1) {
        Agi.Controls.PCChartSelSeriesName = ThisSeriesData[ThisSelSeriesIndex].name;
        $("#BsicChartLineColorSel").css("background-color", ThisSeriesData[ThisSelSeriesIndex].color);
    }
}
/*Chart 基准线相关处理-------------------------------------------------------------------*/
Namespace.register("Agi.Controls.SpcDemoPCChart");
/*添加 Agi.Controls.PCChart命名空间*/
//判断相应名称的基准线是否已存在
Agi.Controls.SpcDemoPCChart.StandLineIsExt = function (_standlines, _LineName) {
    var bolIsExt = false;
    if (_standlines != null && _standlines.length > 0) {
        for (var i = 0; i < _standlines.length; i++) {
            if (_standlines[i].LineTooTips == _LineName) {
                bolIsExt = true;
                break;
            }
        }
    }
    return bolIsExt;
}
//根据基准线ID获取相应的基准线
Agi.Controls.SpcDemoPCChart.GetStandardLine = function (_standlines, _LineID) {
    if (_standlines != null && _standlines.length > 0) {
        for (var i = 0; i < _standlines.length; i++) {
            if (_standlines[i].LineID == _LineID) {
                return _standlines[i];
            }
        }
    }
    return null;
}
//根据基准线名称获取基准线ID
Agi.Controls.SpcDemoPCChart.GetStandardLineIDByName = function (_standlines, _LineName) {
    if (_standlines != null && _standlines.length > 0) {
        for (var i = 0; i < _standlines.length; i++) {
            if (_standlines[i].LineTooTips == _LineName) {
                return _standlines[i].LineID;
            }
        }
    }
    return null;
}
/*获取坐标范围值，格式如："M 109.5 433 L 109.5 438" */
Agi.Controls.SpcDemoPCChart.GetPostionObjByXYStr = function (_XY) {
    var PostionArray = _XY.split(" ");
    return {StartX:parseInt(PostionArray[1]), StartY:parseInt(PostionArray[2]), EndX:parseInt(PostionArray[4]), EndY:parseInt(PostionArray[5])};
}
/*根据基准线格式化图表线条数据*/
/*
 * _ChartSeriesData,对象，元素包含属性{name,data:数组，元素为对象，包含属性：{name,x,y},type,color,Entity,XColumn,YColumn}
 * _ChartStandLines,数组，元素包含属性：{LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips}
 * */
Agi.Controls.SpcDemoPCChart.GetStandLineDataArray = function (_ChartSeriesData, _ChartStandLines) {
    var ReturnData = _ChartSeriesData.data;
    if (_ChartStandLines != null && _ChartStandLines.length > 0) {
        for (var i = 0; i < _ChartStandLines.length; i++) {
            //if(_ChartStandLines[i].LineDir=="Horizontal"){
            ReturnData = Agi.Controls.SpcDemoPCChart.GetChartSeriesDataBy_Standardline(ReturnData, _ChartStandLines[i].LineValue, {Type:_ChartSeriesData.type, Color:_ChartSeriesData.color}, _ChartStandLines)
            // }
        }
    }
    return ReturnData;
}
/*-------基准线拖动更改点颜色---------*/
/*更改点的颜色*/
Agi.Controls.SpcDemoPCChart.GetChartSeriesDataBy_Standardline = function (_ChartDataArray, StanrdValue, _ChartTypePar, _StandardLines) {
    var ReturnData = [];
    if (_ChartDataArray != null && _ChartDataArray.length > 0) {
        if (_ChartTypePar.Type == "column") {
            for (var i = 0; i < _ChartDataArray.length; i++) {
                ReturnData.push({name:_ChartDataArray[i].name, x:_ChartDataArray[i].x, y:_ChartDataArray[i].y, color:Agi.Controls.SpcDemoPCChart.GetColumnSty(_ChartDataArray[i].y, StanrdValue, _ChartTypePar.Color, _StandardLines)});
            }
        } else {
            for (var i = 0; i < _ChartDataArray.length; i++) {
                ReturnData.push({name:_ChartDataArray[i].name, x:_ChartDataArray[i].x, y:_ChartDataArray[i].y, marker:Agi.Controls.SpcDemoPCChart.GetMarkrSty(_ChartDataArray[i].y, StanrdValue, _StandardLines)});
            }
        }
    }
    return ReturnData;
}
/*判断值是否符合条件*/
Agi.Controls.SpcDemoPCChart.GetMarkrSty = function (_Value, _CompareValue, _StandardLines) {
    var MarkerFillColor = Agi.Controls.SpcDemoPCChart.GetPointColorByStandardLinds(_StandardLines, _Value);
    if (MarkerFillColor != null && MarkerFillColor != "") {
        return {fillColor:MarkerFillColor};
    } else {
        return null;
    }
}
//获取柱状图点的样式
Agi.Controls.SpcDemoPCChart.GetColumnSty = function (_Value, _CompareValue, _OldColor, _StandardLines) {
    var ColumnColor = Agi.Controls.SpcDemoPCChart.GetPointColorByStandardLinds(_StandardLines, _Value);
    if (ColumnColor != null && ColumnColor != "") {
        return ColumnColor;
    } else {
        return _OldColor;
    }
}
//获取点的颜色，根据基准线
Agi.Controls.SpcDemoPCChart.GetPointColorByStandardLinds = function (_StandardLines, _PointValue) {
    /*_StandardLines:包含元素 LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips*/
    var MaxValue = -1;
    var LineColor = "";
    if (_StandardLines != null && _StandardLines.length > 0) {
        for (var i = 0; i < _StandardLines.length; i++) {
            if (_PointValue >= _StandardLines[i].LineValue) {
                if (_StandardLines[i].LineValue >= MaxValue) {
                    MaxValue = _StandardLines[i].LineValue;
                    LineColor = _StandardLines[i].LineColor;
                }
            }
        }
    }
    return LineColor;
}
//是否开始拖拽基准线
Agi.Controls.SpcDemoPCChart.IsStartDragStandLine = false;
/*基准线拖拽开始事件添加*/
Agi.Controls.SpcDemoPCChart.BindStandardLineStartEndEvent = function (_Element) {
    if ("createTouch" in document) {
        $(_Element).bind("touchstart", function () {
            Agi.Controls.SpcDemoPCChart.IsStartDragStandLine = true;
        });
        $(_Element).bind("touchend", function () {
            Agi.Controls.SpcDemoPCChart.IsStartDragStandLine = false;
        });
    } else {
        $(_Element).bind("mousedown", function () {
            Agi.Controls.SpcDemoPCChart.IsStartDragStandLine = true;
        });
        $(_Element).bind("mouseup", function () {
            Agi.Controls.SpcDemoPCChart.IsStartDragStandLine = false;
        });
    }
}
/*显示基准线菜单*/
Agi.Controls.SpcDemoPCChart.ShowStandardLineMenu = function (_PCChart) {
    //7.显示StandardLine面板
    if ($("#BasichartStandardLinemenudiv").length > 0) {
        $("#BasichartStandardLinemenudiv").remove();
    }
    if (Agi.Controls.IsControlEdit) {
        var ControlEditPanelID = _PCChart.Get("HTMLElement").id;
        var ChartStandardLineMenuPanel = null;
        ChartStandardLineMenuPanel = $("<div id='BasichartStandardLinemenudiv' class='BschartStandardLinemenudivsty'></div>");
        ChartStandardLineMenuPanel.appendTo($("#" + ControlEditPanelID));
        ChartStandardLineMenuPanel.html("");
        var ThisChartProPerty = _PCChart.Get("ProPerty");
        var NewChartStandardLines = _PCChart.Get("StandardLines");//获取图表的基准线信息
        if (NewChartStandardLines != null && NewChartStandardLines.length > 0) {
            for (var i = 0; i < NewChartStandardLines.length; i++) {
                $("#BasichartStandardLinemenudiv").append("<div class='BschartStandardLinelablesty'>" +
                    "<div style='width:10px; height:10px; line-height: 30px; background-color:" + NewChartStandardLines[i].LineColor + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                    "<div class='BschartStandardLinename'>"
                    + NewChartStandardLines[i].LineTooTips + "</div>" +
                    "<div id='" + NewChartStandardLines[i].LineID + "' class='BschartStandardLineImgsty'></div>" +
                    "<div class='clearfloat'></div></div>");
            }
            $("#BasichartStandardLinemenudiv").append("<div style='clear:both;'></div>");
            $("#BasichartStandardLinemenudiv").css("left", "10px");
            $("#BasichartStandardLinemenudiv").css("top", "10px");
        }
        $(".BschartStandardLineImgsty").die("click");
        $(".BschartStandardLineImgsty").live("click", function (ev) {
            var _obj = this;
            var removestandartlineID = _obj.id;
            $(_obj).parent().remove();
            _PCChart.RemoveStandardLine(removestandartlineID);
        })
    }
};





