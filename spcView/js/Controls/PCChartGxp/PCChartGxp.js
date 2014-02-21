/**
 * User: gxp
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.PCChartGxp = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        initData:function (data) {
            if (data) {
                var container ="Panel_chart_"+this.Get("ProPerty").ID;
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
                var newchartoptions={
                    colors:ChartOptions.colors,
                    chart:{
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
                        plotBorderColor:ChartOptions.chart.plotBorderColor,
                        plotBorderWidth:ChartOptions.chart.plotBorderWidth
                    },
                    title:ChartOptions.title,
                    credits:{
                        enabled:false
                    },
                    legend:{
                        enabled:false
                    },
                    xAxis:[
                        {
                            min:data.xMin,
                            max:data.xMax,
                            plotLines:[
                                {
                                    label:{
                                        text:'LSL',
                                        rotation:0,
                                        style:{
                                            fontWeight:'bold',
                                            //透明底样式
                                            color: '#909596'
                                        },
                                        x:-12,
                                        y:-0
                                    },
                                    dashStyle:'solid',
                                    value:data.lsl, width: 2,
                                    color:'#95A7B3'
                                },
                                {
                                    label:{
                                        text:'目标',
                                        rotation:0,
                                        style:{
                                            fontWeight: 'bold',
                                            //透明底样式
                                            color: '#FFF'
                                        },
                                        x:-13,
                                        y:-0
                                    },
                                    dashStyle:'solid',
                                    value: data.target, width: 2,
                                    color:'#FF0000'
                                },
                                {
                                    label:{
                                        text:'USL',
                                        rotation:0,
                                        style:{
                                            fontWeight: 'bold',
                                            //透明底样式
                                            color: '#909596'
                                        },
                                        x:-13,
                                        y:-0
                                    },
                                    dashStyle:'solid',
                                    value:data.usl, width: 2,
                                    color:'#95A7B3'
                                },
                                {
                                    label:{
                                        text:'均值',
                                        rotation:0,
                                        style:{
                                            fontWeight: 'bold',
                                            //透明底样式
                                            color: '#FFF'
                                        },
                                        x:-13,
                                        y:-0
                                    },
                                    dashStyle:'longdash',
                                    value: data.avg, width: 1,
                                    color:'#7E9E33'
                                },
                                {
                                    label:{
                                        text:'3',
                                        rotation:0,
                                        style:{
                                            fontWeight: 'bold',
                                            //透明底样式
                                            color: '#909596'
                                        },
                                        x:-13,
                                        y:-0
                                    },
                                    dashStyle:'longdash',
                                    value: data.pValue, width: 1,
                                    color:'#7E9E33'
                                },
                                {
                                    label:{
                                        text:'-3',
                                        rotation:0,
                                        style:{
                                            fontWeight: 'bold',
                                            //透明底样式
                                            color: '#909596'
                                        },
                                        x:-13,
                                        y:-0
                                    },
                                    dashStyle:'longdash',
                                    value:data.opValue, width:1,
                                    color:'#7E9E33'
                                }
                            ]
                        },
                        {
                            linkedTo:0,
                            lineWidth:0,
                            labels:{
                                enabled:false
                            }
                        }
                    ],
                    yAxis:[
                        {
                            min:0,
                            gridLineDashStyle:'dash',
                            //tickInterval:2,
                            title:{
                                text:null
                            }
                        },
                        {
                            min:0,
                            gridLineDashStyle:'dash',
                            title:{
                                text:null
                            },
                            labels:{
                                enabled:false
//                                    formatter:function () { //格式化标签名称
//                                        return this.value + '%';
//                                    }
                            },
                            opposite:true
                        }
                    ],
                    series:[
                        {
                            type:'column',
                            data:data.histoSeriesData,
                            xAxis:0,
                            yAxis:0,
                            point:{
                                /*events:{
                                 mouseOver:function () {
                                 control.pointMouseover(this, control);
                                 },
                                 mouseOut:function () {
                                 control.pointMouseout(this, control);
                                 }
                                 }*/
                            }
                        },
                        {
                            type:'spline',
                            data: data.normalSeriesData,
                            color: '#909596',
                            lineWidth:2,
                            xAxis:1,
                            yAxis:1
                        },
                        {
                            type:'spline',
                            dashStyle:'longdash',
                            data: data.normalSeriesData2,
                            color: '#909596',
                            lineWidth:2,
                            xAxis:1,
                            yAxis:1
                        }
                    ],
                    plotOptions:{
                        column:{
                            color:{
                                linearGradient:{ x1:0, y1:0, x2:1, y2:0 },
                                stops:[
                                    [0, '#8bdcf9'],
                                    [0.2, '#76ccef'],
                                    [1, '#5ab2d5']
                                ]
                            },
                            //pointWidth:25,
                            borderWidth:1,
                            borderColor:'#689196',
                            pointPadding:0,
                            groupPadding:0,
                            shadow:true
                        },
                        spline:{
                            marker:{
                                enabled:false
                            }, /*
                             tooltip:{
                             enabled:false
                             },*/
                            enableMouseTracking:false
                        }

                    },
                    tooltip:{
                        formatter:function () {
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
                };
                //
                chart = new Highcharts.Chart(newchartoptions);
                //
                var property = this.Get("ProPerty");
                property.BasciObj = chart;
                this.Set("ProPerty", property);
            }
            if($("#propertyShowPanel").length>0){
                $("#propertyShowPanel").html("<a id='btnTotalMenu' class='totalAlarmmenusty' >+属性</a></div>");
            } else {
                var propertyShowPanelHTML=$("<div id='propertyShowPanel' class='AlarmSty'></div>").appendTo($("#Panel_MenuObj_"+this.Get("ProPerty").ID));
                $("#propertyShowPanel").css({"right":"5px","top":"5px"});
                propertyShowPanelHTML.append("<a  id='btnTotalMenu' class='totalAlarmmenusty'>+属性</a>");
            }

            $("#btnTotalMenu").unbind().bind("click",function(ev){
                $(this).hide();
                $("#propWinAll").fadeIn(500);
                ev.stopPropagation();    //  阻止事件冒泡
            });//显示统计表格

            var nameArray = new Array("过程数据","实测性能","预测组内性能","预测整体性能","潜在（组内）能力","整体能力","正态检验");
            var strWinAll = "<div id='propWinAll' style='display: none'><a  id='btnTotalHidenMenu' class='totalAlarmmenusty' style='float: right;margin: 5px 5px 5px 0px;'>-隐藏</a><br><br>";
            for (var nI=0; nI<nameArray.length; nI++)
            {
                var str = "<table class='PCChart_propertyTable' style='float:left;display:inline;'><tr><td class='PCChart_propertyTr' colspan=2>"+nameArray[nI]+"</td></tr>";
                for (var item in data[nameArray[nI]])
                {
                    str = str + "<tr><td>" + item + "</td><td>&nbsp;" + data[nameArray[nI]][item]+" </td></tr>";
                }
                str = str + "</table><div style='float:left;width: 3px;'>&nbsp;</div>";
                strWinAll = strWinAll + str;
            }
            $("#propertyShowPanel").append(strWinAll + "</div>");

            $("#btnTotalHidenMenu").unbind().bind("click",function(ev){
                $("#propWinAll").fadeOut(500,function(){$("#btnTotalMenu").show();});
                ev.stopPropagation();    //  阻止事件冒泡
            });
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
        ReadDataBak: function (_EntityInfo) {
            var Me = this;
            if (_EntityInfo != undefined) {
                if (!_EntityInfo.IsShareEntity) {
                    Agi.Utility.RequestData2(_EntityInfo, function (d) {
                        //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
                        _EntityInfo.Data = d.Data;
                        _EntityInfo.Columns = d.Columns;
                    });
                } else {
                    //Me.BindDataByEntity(_EntityInfo);
                }
                var MeEntitys = this.Get("Entity");
                MeEntitys = [];
                MeEntitys.push(_EntityInfo);
                this.Set("Entity", MeEntitys);
                this.changEntity = true;
            }
        },
        CallRFuc: function () {
            var Me = this;
            var PCChartDataProperty= Me.Get("PCChartDataProperty");
            var jsonData = {
                "basicOption":PCChartDataProperty.basicOption,
                "stdDevEst":PCChartDataProperty.stdDevEst,
                "pageDisplay":PCChartDataProperty.pageDisplay,
                "normalityVerify":PCChartDataProperty.normalityVerify
            }
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData(
                {
                    "MethodName": "RPCChart", "Paras": jsonString, "CallBackFunction":function(data){
                    if(data.result=='true')
                    {
                        if(data['直方图'])
                        {   //组织画图参数 data
                            var datapar={
                                histoSeriesData: [],//柱状图
                                normalSeriesData: [],//组内
                                normalSeriesData2:[],//整体
                                usl: data['过程数据']['上限'],
                                lsl: data['过程数据']['下限'],
                                target: data['过程数据']['目标'],
                                avg: data['过程数据']['样本均值'],
                                pValue: 0,
                                opValue: 0,
                                histoSeriesDataDic:[]
                            }
                            var groups=data['直方图']['groups'];
                            var x,y;
                            datapar.histoSeriesData=[];
                            for(var i=0;i<groups.length;i++)
                            {
                                x = groups[i].upperLimit - (groups[i].upperLimit - groups[i].lowerLimit) / 2;
                                y = groups[i].groupSize;
                                datapar.histoSeriesData.push([x, y]);
                                datapar.histoSeriesDataDic.push({ key: x, l: groups[i].lowerLimit, u: groups[i].upperLimit })
                            }
                            //正态分布重新计算-曲线图-组内
                            var distribution = new NormalDistribution(data['过程数据']['样本均值'],data['过程数据']['标准差(组内)']);
                            var plot = new DistributionPlot('plot_qwerty', distribution);
                            datapar.normalSeriesData = plot._pdfValues;
                            //曲线图-整体
                            distribution = new NormalDistribution(data['过程数据']['样本均值'],data['过程数据']['标准差(整体)']);
                            plot = new DistributionPlot('plot_qwerty', distribution);
                            datapar.normalSeriesData2 = plot._pdfValues;

                            //
                            datapar['过程数据']=data['过程数据'];
                            datapar['实测性能']=data['实测性能'];
                            datapar['预测组内性能']=data['预测组内性能'];
                            datapar['预测整体性能']=data['预测整体性能'];
                            datapar['潜在（组内）能力']=data['潜在（组内）能力'];
                            datapar['整体能力']=data['整体能力'];
                            datapar['正态检验']=data['正态检验'];
                            Me.Set("ChartData", datapar);
                            //_ControlObj.initData(datapar);
                            Me.Refresh();
                        }
                    }
                }
                }
            )
        },
        ReadData: function (_EntityInfo) {
            var Me = this;
            if (_EntityInfo != undefined) {
                if (!_EntityInfo.IsShareEntity) {
                    Agi.Utility.RequestData2(_EntityInfo, function (d) {
                        //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
                        _EntityInfo.Data = d.Data;
                        _EntityInfo.Columns = d.Columns;
                        var MeEntitys = Me.Get("Entity");
                        MeEntitys = [];
                        MeEntitys.push(_EntityInfo);
                        Me.Set("Entity", MeEntitys);

                        var basicOption= Me.Get("PCChartDataProperty").basicOption;
                        if(Me.Get("Entity")[0]!=null)
                        {
                            var  data=Me.Get("Entity")[0].Data;
                            var  dataArray=[];
                            var MaxLength = 1000; //限定处理数据最大行数为1000
                            $.each(data, function (i, item) {
                                if(basicOption.dataColumnValue==null || basicOption.dataColumnValue==""){
                                    if (item[_EntityInfo.Columns[1]]) {//默认第一列为分组数据
                                        if (dataArray.length >= MaxLength) {
                                            return false;
                                        } else {
                                            dataArray.push(eval(item[_EntityInfo.Columns[1]]));
                                        }
                                    }
                                }
                                else{
                                    if (dataArray.length >= MaxLength) {
                                        return false;
                                    } else {
                                        dataArray.push(eval(item[basicOption.dataColumnValue]));
                                    }
                                }

                            });
                            basicOption.dataColumn=dataArray;
                        }
                        Me.CallRFuc();
                    });
                } else {
                    //Me.BindDataByEntity(_EntityInfo);
                }
            }
        },
        ReadRealData: function () {
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
        AddEntity: function (_entity) {/*添加实体*/
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
                var MaxLength = 1000; //限定处理数据最大行数为1000
                $.each(data, function (i, item) {
                    if (item[cols[1]]) {//默认第一列为分组数据
                        if (dataArray.length >= MaxLength) {
                            return false;
                        } else {
                            dataArray.push(eval(item[cols[1]]));
                        }
                    }
                });
                //NO:201211210918 end
                var PCChartDataProperty = that.Get("PCChartDataProperty");
                var dataProperty = PCChartDataProperty.propertyData;
                //
                var data = PCChartDataProperty.data;
                data.usl = dataProperty.usl;
                data.lsl = dataProperty.lsl;
                data.target = dataProperty.target;
//                //region 直方图
                var json = { 'action': 'RCalHistogram', 'dataArray': dataArray, 'sampleLength': '', 'USL': '', 'LSL': '', 'specValue': '' };
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalHistogram",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
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
                                    data.histoSeriesDataDic.push({ key: x, l: item.lowerLimit, u: item.upperLimit })
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
                var json = { 'action': 'RCalNormalDis', 'dataArray': dataArray, 'nrow': dataProperty.nrow };
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalNormalDis",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
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
                var Me = this;
                var Entitys = Me.Get("Entity");
                var bolIsEx = false;
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
                var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
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
                            THisChartDataArray.push({ name: Agi.Controls.PCChartNewSeriesName(THisChartDataArray), data: Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _entity.Columns[1]])), type: "column", color: "#058DC7", Entity: _entity, XColumn: _entity.Columns[0], YColumn: _entity.Columns[1] });
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
                    Me.RefreshStandLines(); //更新基准线显示
                }
            }
            else {
                //alert("您添加的实体无数据！");
            }
        },
        RemoveEntity: function (_EntityKey) {
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
                Entitys.splice(entityIndex, 1); //移除实体元素
            }
            var ThisChartObj = Me.Get("ProPerty").BasciObj;
            var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
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
            Me.RefreshStandLines(); //更新基准线显示
        }, //移除实体Entity
        ParameterChange: function (_ParameterInfo) {
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
        Init: function (_Target, _ShowPosition) {
            var Me = this;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "PCChartGxp");
            var ID = "PCChartGxp" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PCChartPanelSty'><div id='Panel_chart_" + ID + "' class='pcchartpanel' style='float:left;height:100%;'></div><div id='Panel_MenuObj_" + ID + "' class='pcchartmenu'  style='width:0px;height:100%;float:right;'></div><div style='clear:both;width:0px;height: 0px;font-size: 0px;'></div>");
            HTMLElementPanel.css('padding-bottom', '0px');
            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(600);
                HTMLElementPanel.height(400);
                HTMLElementPanel.find(".pcchartpanel").width(HTMLElementPanel.width()-HTMLElementPanel.find(".pcchartmenu").width());
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                obj.html("");
            }
            /*图表Chart X轴相应的显示点集合*/
            this.InitChartData();
            var ThisProPerty = {
                ID: ID,
                BasciObj: null
            };
            this.Set("ProPerty", ThisProPerty);
            this.Set("HTMLElement", HTMLElementPanel[0]);
            if (_Target != null) {
                this.Render(_Target);
            }
            var StartPoint = { X: 0, Y: 0 }
            /*事件绑定*/
            if (Agi.Edit) {
                $("#" + HTMLElementPanel.attr("id")).dblclick(function (ev) {
                        if (!Agi.Controls.IsControlEdit) {
                            Agi.Controls.ControlEdit(Me); //控件编辑界面
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
                        if(this.id!=null && this.id.substr(0,13)=="Panel_PCChart"){
                            Agi.Controls.BasicPropertyPanel.Show(this.id);
                        }
                    });
                }else {
                    HTMLElementPanel.mousedown(function (ev) {
                        ev.stopPropagation();
                        if(this.id!=null && this.id.substr(0,13)=="Panel_PCChart"){
                            Agi.Controls.BasicPropertyPanel.Show(this.id);
                        }
                    });
                }
            }

            this.Set("Position",PostionValue);
            //输出参数
//            var OutPramats = { "XValue": 0, "YValue": 0 };
//            this.Set("OutPramats", OutPramats);
//            /*输出参数名称集合*/
//            var THisOutParats = [];
//            if (OutPramats != null) {
//                for (var item in OutPramats) {
//                    THisOutParats.push({ Name: item, Value: OutPramats[item] });
//                }
//            }
//            Agi.Msg.PageOutPramats.AddPramats({
//                "Type": Agi.Msg.Enum.Controls,
//                "Key": ID,
//                "ChangeValue": THisOutParats
//            });
            obj = ThisProPerty = PagePars = PostionValue = THisOutParats = null;
            this.Set("ThemeInfo", "darkbrown");
            //
            var PCChartDataProperty;
            PCChartDataProperty = {
                data: {
                    histoSeriesData: [],
                    normalSeriesData: [],
                    usl: 0,
                    lsl: 0,
                    target: 0,
                    avg: 0,
                    pValue: 0,
                    opValue: 0
                },
                propertyData: {
                    usl: 0,
                    lsl: 0,
                    target: 0,
                    nrow: 0
                },
                //属性模板参数
                //基本设置
                basicOption:{
                    dataColumnValue:'',
                    dataColumn:[],
                    subGroupSize:0,
                    specLower:0,
                    specLowerBorder:0,
                    specUpper:0,
                    specUpperBorder:0,
                    historyAvg:0,
                    historyStdDev:0,
                    targetVal:0
                },
                //标准差估计
                stdDevEst:{
                    optionVal2:'mergeStdDev',//Sbar,Rbar,mergeStdDev         movRangeAvg/movRangeMid/squareRootOfMeanSquareDev
                    optionVal1:'movRangeAvg',//Sbar,Rbar,mergeStdDev         movRangeAvg/movRangeMid/squareRootOfMeanSquareDev
                    movingRangeLen:2
                },
                //图形设置
                pageDisplay:{
                    sigmaKValue:6,
                    displayRatio:'ppm',   // ppm/hpm
                    abilityOrZVal:'ablity',  // ablity/ZVal
                    confidenceInterval:0,   //0/1
                    confidenceLevel:95,
                    confidenceRange:'double', //'double'/upper/lower
                    subGroupAnalysis:1,   //0/1
                    wholeAnalysis:1  //0/1
                },
                //正态性
                normalityVerify:{
                    normalityVerifyStyle:'anderson' //anderson,ryan,kolmogorov
                }
            };
            this.Set("PCChartDataProperty", PCChartDataProperty);
            //20130515 倪飘 解决bug，组态环境中拖入过程能力图表以后拖入容器框控件，容器框控件会覆盖过程能力图表控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr("id"));
            this.Refresh();//刷新显示
        }, /*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
        CustomProPanelShow: function () {
            Agi.Controls.PCChartProrityInit(this);
        }, //显示自定义属性面板
        Destory: function () {
            var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
            var proPerty = this.Get("ProPerty");
            //            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/
            //            Agi.Edit.workspace.controlList.remove(this);
            //            Agi.Edit.workspace.currentControls.length = 0;
            //            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中
            /*清除选中控件对象*/
            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            //            Agi.Msg.PageOutPramats.RemoveItems(proPerty.ID);//控件删除时，移除联动参数相关
            proPerty = null;
            delete this;
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var Newdropdownlist = new Agi.Controls.PCChart();
                Newdropdownlist.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return Newdropdownlist;
            }
        },
        PostionChange: function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PagePars = { Width: ParentObj.width()-100, Height: ParentObj.height() };
                var _ThisPosition = {
                    Left: (_Postion.Left / PagePars.Width).toFixed(4),
                    Top: (_Postion.Top / PagePars.Height).toFixed(4),
                    Right: (_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                var ThisHTMLElementobj = $("#" + this.Get("HTMLElement").id);
                var ThisPCChartPanel=ThisHTMLElementobj.find(".pcchartpanel");
                ThisPCChartPanel.width(ThisHTMLElementobj.width()-ThisHTMLElementobj.find(".pcchartmenu").width());


                var ParentObj = ThisHTMLElementobj.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };
                var ThisControlPars = { Width: ThisHTMLElementobj.width(), Height: ThisHTMLElementobj.height(), Left: (ThisHTMLElementobj.offset().left - PagePars.Left), Top: (ThisHTMLElementobj.offset().top - PagePars.Top), Right: 0, Bottom: 0 };
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
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            var ThisHTMLElementobj = $("#" + this.Get("HTMLElement").id);
            var ThisPCChartPanel=ThisHTMLElementobj.find(".pcchartpanel");
            ThisPCChartPanel.width(ThisHTMLElementobj.width()-ThisHTMLElementobj.find(".pcchartmenu").width());
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
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
        /*7.图表控件，初始化值获取*/
        InitChartData: function () {
            var ChartXAxisArray = [];
            var THisChartData = [0,0,0,0.8,1.5,2,1.7,0.3,0,0,0];
            var thischartSeriesData={
                histoSeriesData: [],//柱状图
                normalSeriesData: [],//组内
                normalSeriesData2:[],//整体
                usl: 0,
                lsl: 0,
                target: 0,
                avg: 0,
                pValue: 0,
                opValue: 0,
                histoSeriesDataDic:[],
                xMin:0,
                xMax:15
            }
            thischartSeriesData.histoSeriesData = THisChartData;

            var distribution = new NormalDistribution(5,1);
            var plot = new DistributionPlot('plot_qwerty', distribution);
            thischartSeriesData.normalSeriesData = plot._pdfValues;
            var distribution = new NormalDistribution(5,2);
            var plot = new DistributionPlot('plot_qwerty', distribution);
            thischartSeriesData.normalSeriesData2 = plot._pdfValues;

            this.Set("ChartData", thischartSeriesData);
        },
        Refresh: function () {
            //0.清除原图表
            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HtmlElementID ="Panel_chart_"+MePrority.ID;
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
            var ThisChartYAxisArray = Me.Get("ChartYAxisArray");
            /*获取图表Chart X轴相应的显示点集合*/
            var ChartOptions = Me.Get("ChartOptions");
            if (ThisChartXAxisArray != null && ThisChartXAxisArray.length > 0) {
                ChartOptions.xAxis.categories = ThisChartXAxisArray;
            }
            if (ThisChartYAxisArray != null && ThisChartYAxisArray.length > 0) {
                ChartOptions.yAxis.categories = ThisChartYAxisArray;
            }
            var thischartSeriesData = Me.Get("ChartData"); //图表数据
            var container ="Panel_chart_"+this.Get("ProPerty").ID;
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
            var data = this.Get("ChartData");

            var control = this;
            var newchartoptions={
                colors:ChartOptions.colors,
                chart:{
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
                    plotBorderColor:ChartOptions.chart.plotBorderColor,
                    plotBorderWidth:ChartOptions.chart.plotBorderWidth
                },
                title:ChartOptions.title,
                credits:{
                    enabled:false
                },
                legend:{
                    enabled:false
                },
                xAxis:[
                    {
                        min:data.xMin,
                        max:data.xMax,
                        plotLines:[
                            {
                                label:{
                                    text:'LSL',
                                    rotation:0,
                                    style:{
                                        fontWeight:'bold',
                                        //透明底样式
                                        color: '#909596'
                                    },
                                    x:-12,
                                    y:-0
                                },
                                dashStyle:'solid',
                                value:data.lsl, width: 2,
                                color:'#95A7B3'
                            },
                            {
                                label:{
                                    text:'目标',
                                    rotation:0,
                                    style:{
                                        fontWeight: 'bold',
                                        //透明底样式
                                        color: '#FFF'
                                    },
                                    x:-13,
                                    y:-0
                                },
                                dashStyle:'solid',
                                value: data.target, width: 2,
                                color:'#FF0000'
                            },
                            {
                                label:{
                                    text:'USL',
                                    rotation:0,
                                    style:{
                                        fontWeight: 'bold',
                                        //透明底样式
                                        color: '#909596'
                                    },
                                    x:-13,
                                    y:-0
                                },
                                dashStyle:'solid',
                                value:data.usl, width: 2,
                                color:'#95A7B3'
                            },
                            {
                                label:{
                                    text:'均值',
                                    rotation:0,
                                    style:{
                                        fontWeight: 'bold',
                                        //透明底样式
                                        color: '#FFF'
                                    },
                                    x:-13,
                                    y:-0
                                },
                                dashStyle:'longdash',
                                value: data.avg, width: 1,
                                color:'#7E9E33'
                            },
                            {
                                label:{
                                    text:'3',
                                    rotation:0,
                                    style:{
                                        fontWeight: 'bold',
                                        //透明底样式
                                        color: '#909596'
                                    },
                                    x:-13,
                                    y:-0
                                },
                                dashStyle:'longdash',
                                value: data.pValue, width: 1,
                                color:'#7E9E33'
                            },
                            {
                                label:{
                                    text:'-3',
                                    rotation:0,
                                    style:{
                                        fontWeight: 'bold',
                                        //透明底样式
                                        color: '#909596'
                                    },
                                    x:-13,
                                    y:-0
                                },
                                dashStyle:'longdash',
                                value:data.opValue, width:1,
                                color:'#7E9E33'
                            }
                        ]
                    },
                    {
                        linkedTo:0,
                        lineWidth:0,
                        labels:{
                            enabled:false
                        }
                    }
                ],
                yAxis:[
                    {
                        min:0,
                        gridLineDashStyle:'dash',
                        //tickInterval:2,
                        title:{
                            text:null
                        }
                    },
                    {
                        min:0,
                        gridLineDashStyle:'dash',
                        title:{
                            text:null
                        },
                        labels:{
                            enabled:false
//                                    formatter:function () { //格式化标签名称
//                                        return this.value + '%';
//                                    }
                        },
                        opposite:true
                    }
                ],
                series:[
                    {
                        type:'column',
                        data:data.histoSeriesData,
                        xAxis:0,
                        yAxis:0,
                        point:{
                            /*events:{
                             mouseOver:function () {
                             control.pointMouseover(this, control);
                             },
                             mouseOut:function () {
                             control.pointMouseout(this, control);
                             }
                             }*/
                        }
                    },
                    {
                        type:'spline',
                        data: data.normalSeriesData,
                        color: '#909596',
                        lineWidth:2,
                        xAxis:1,
                        yAxis:1
                    },
                    {
                        type:'spline',
                        dashStyle:'longdash',
                        data: data.normalSeriesData2,
                        color: '#909596',
                        lineWidth:2,
                        xAxis:1,
                        yAxis:1
                    }
                ],
                plotOptions:{
                    column:{
                        color:{
                            linearGradient:{ x1:0, y1:0, x2:1, y2:0 },
                            stops:[
                                [0, '#8bdcf9'],
                                [0.2, '#76ccef'],
                                [1, '#5ab2d5']
                            ]
                        },
                        //pointWidth:25,
                        borderWidth:1,
                        borderColor:'#689196',
                        pointPadding:0,
                        groupPadding:0,
                        shadow:true
                    },
                    spline:{
                        marker:{
                            enabled:false
                        }, /*
                         tooltip:{
                         enabled:false
                         },*/
                        enableMouseTracking:false
                    }

                },
                tooltip:{
                    formatter:function () {
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
            };
            chart = new Highcharts.Chart(newchartoptions);
            //
            var property = this.Get("ProPerty");
            property.BasciObj = chart;
            this.Set("ProPerty", property);

            if($("#propertyShowPanel").length>0){
                $("#propertyShowPanel").html("<a id='btnTotalMenu' class='totalAlarmmenusty' >+属性</a></div>");
            } else {
                var propertyShowPanelHTML=$("<div id='propertyShowPanel' class='AlarmSty'></div>").appendTo($("#Panel_MenuObj_"+this.Get("ProPerty").ID));
                $("#propertyShowPanel").css({"right":"5px","top":"5px"});
                propertyShowPanelHTML.append("<a  id='btnTotalMenu' class='totalAlarmmenusty'>+属性</a>");
            }

            $("#btnTotalMenu").unbind().bind("click",function(ev){
                $(this).hide();
                $("#propWinAll").fadeIn(500);
                ev.stopPropagation();    //  阻止事件冒泡
            });//显示统计表格
            var nameArray = new Array("过程数据","实测性能","预测组内性能","预测整体性能","潜在（组内）能力","整体能力","正态检验");
            var strWinAll = "<div id='propWinAll' style='display: none'><a  id='btnTotalHidenMenu' class='totalAlarmmenusty' style='float: right;margin: 5px 5px 5px 0px;'>-隐藏</a><br><br>";
            for (var nI=0; nI<nameArray.length; nI++)
            {
                var str = "<table class='PCChart_propertyTable' style='float:left;display:inline;'><tr><td class='PCChart_propertyTr' colspan=2>"+nameArray[nI]+"</td></tr>";
                for (var item in data[nameArray[nI]])
                {
                    str = str + "<tr><td>" + item + "</td><td>&nbsp;" + data[nameArray[nI]][item]+" </td></tr>";
                }
                str = str + "</table><div style='float:left;width: 3px;'>&nbsp;</div>";
                strWinAll = strWinAll + str;
            }
            $("#propertyShowPanel").append(strWinAll + "</div>");

            $("#btnTotalHidenMenu").unbind().bind("click",function(ev){
                $("#propWinAll").fadeOut(500,function(){$("#btnTotalMenu").show();});
                ev.stopPropagation();    //  阻止事件冒泡
            });

//            //4.更改大小、位置 Position信息
//            $("#" + HtmlElementID).append(Childrens);
//            Me.Set("Position", Me.Get("Position"))
//            if (Agi.Controls.IsControlEdit) {
//                Agi.Controls.PCChartShowSeriesPanel(Me);
//                Me.RefreshStandLines(); //更新基准线显示
//            }
        },
        Checked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /* $("#" + this.Get("HTMLElement").id).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
             "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        GetConfig: function () {
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
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基础对象
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    PCChartDataProperty: null, //chart基本属性
                    SeriesData: null, //系列数据
                    Position: null, //控件位置
                    ChartOptions: null //chart option
                }
            }
            /*配置信息对象*/
            PCChartControl.Control.ControlType = Me.Get("ControlType");
            PCChartControl.Control.ControlID = ProPerty.ID;
            PCChartControl.Control.ControlBaseObj = ProPerty.ID;
            PCChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
            PCChartControl.Control.Entity = Me.Get("Entity");
            PCChartControl.Control.PCChartDataProperty = Me.Get("PCChartDataProperty");
            PCChartControl.Control.Position = Me.Get("Position");
            PCChartControl.Control.ChartOptions = Me.Get("ChartOptions");
            PCChartControl.Control.StandardLines = Me.Get("StandardLines");
            return PCChartControl.Control;
        }, //获得PCChart控件的配置信息
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.PCChartAttributeChange(this, Key, _Value);
        },
        CreateControl: function (_Config, _Target) {
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.SeriesData = _Config.SeriesData;
                    _Config.Position = _Config.Position;
                    _Config.ChartOptions = _Config.ChartOptions;
                    _Config.Entity = _Config.Entity;

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
//
                    Me.Set("ControlType", "PCChartGxp"); //类型
                    //Me.Set("Entity", ThisEntitys);//实体
                    Me.Set("ChartData", _Config.SeriesData); //Series数据
                    //PCChartDataProperty
                    var PCChartDataProperty = _Config.PCChartDataProperty;
                    this.Set("PCChartDataProperty", PCChartDataProperty);
                    Me.Set("ChartOptions", _Config.ChartOptions); //ChartOptions

                    this.ReadData(_Config.Entity[0]);//获取数据

                    var ID = _Config.ControlID;
                    var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PCChartPanelSty'>" +
                        "<div id='Panel_chart_" + ID + "' class='pcchartpanel' style='float:left;height:100%;'></div><div id='Panel_MenuObj_" + ID + "' class='pcchartmenu'  style='width:0px;height:100%;float:right;'></div><div style='clear:both;width:0px;height: 0px;font-size: 0px;'></div>");
                    HTMLElementPanel.css('padding-bottom', '0px');

                    var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
                    var obj = null;
                    if (typeof (_Target) == "string") {
                        obj = $("#" + _Target);
                    } else {
                        obj = $(_Target);
                    }
                    var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
                    if (layoutManagement.property.type == 1) {
                        PostionValue = _Config.Position;
                    } else {
                        HTMLElementPanel.removeClass("selectPanelSty");
                        HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                        obj.html("");
                    }
                    var ThisProPerty = {
                        ID: ID,
                        BasciObj: null
                    };
                    this.Set("ProPerty", ThisProPerty);
                    this.Set("HTMLElement", HTMLElementPanel[0]);
                    if (_Target != null) {
                        this.Render(_Target);
                    }
                    var StartPoint = { X: 0, Y: 0 }
                    /*事件绑定*/
                    if (Agi.Edit) {
                        $("#" + HTMLElementPanel.attr("id")).dblclick(function (ev) {
                                if (!Agi.Controls.IsControlEdit) {
                                    Agi.Controls.ControlEdit(Me); //控件编辑界面
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
                }
            }
        }, //根据配置信息创建控件
        InEdit: function () {
            $(window).resize();
            /*debugger;
             var htmlelemnt = this.Get("HTMLElement");
             var chart = this.Get("ProPerty").BasciObj;
             $(htmlelemnt).find(".highcharts-container").css({
             width:$(htmlelemnt).width(),
             height:$(htmlelemnt).height()
             });*/
        },
        ExtEdit: function () {
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
        GetSPCViewGridData:function(){
            var Me=this;

            var GridData={
                ChartData: Me.Get("Entity")[0].Data,//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:[]//所选的异常点
            };
            return GridData;
        },//SPC控件支持View框架，控件显示源数据
        SPCViewMenus: function () {
            var Me = this;
            var viewmenus = [];
            viewmenus.push({Title: "基本设置", MenuImg: "ViewMenuImages/viewmenu_Standline.png", CallbackFun: Me.SPCViewBaseSetMenu});
            viewmenus.push({Title: "标准差估计", MenuImg: "ViewMenuImages/viewmenu_sigma.png", CallbackFun: Me.SPCViewStdDevMenu});
            viewmenus.push({Title: "图形选项", MenuImg: "ViewMenuImages/viewmenu_Abnormal.png", CallbackFun: Me.SPCViewImgSetMenu});
            viewmenus.push({Title: "正太性检验", MenuImg: "ViewMenuImages/dataextract.png", CallbackFun: Me.SPCViewNormalTstMenu});
            return viewmenus;
        },//SPC控件支持View框架，控件菜单显示
        SPCViewBaseSetMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("基本设置");
            $(_Panel).find(".content").height(169);
            Agi.Controls.PCChartView_BaseSetMenu(_Panel, Me);
            _CallFun();
        },//SPC控件View，基本设置
        SPCViewStdDevMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("标准差估计");
            $(_Panel).find(".content").height(169);
            Agi.Controls.PCChartView_StdDevMenu(_Panel, Me);
            _CallFun();
        },//SPC控件View，标准差估计
        SPCViewImgSetMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("图形选项");
            $(_Panel).find(".content").height(169);
            Agi.Controls.PCChartView_ImgSetMenu(_Panel, Me);
            _CallFun();
        },//SPC控件View，图形选项
        SPCViewNormalTstMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("正太性校验");
            $(_Panel).find(".content").height(169);
            Agi.Controls.PCChartView_NormalTstMenu(_Panel, Me);
            _CallFun();
        }//SPC控件View，正太性校验
    });
//在View环境中显示基本设置菜单项
Agi.Controls.PCChartView_BaseSetMenu=function(_Panel,_Control){
    var Me=_Control;
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/PCChartGxp/tabTemplates.html #ptab-1', function () {
        //保存处理
        $(this).find("#pop1Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").basicOption;

            if(Me.Get("Entity")[0]!=null)
            {
                var  datalist=Me.Get("Entity")[0].Data;
                var  templist=[];
                if(datalist!=null && datalist.length>0)
                {

                    for(var inx=0;inx<datalist.length;inx++)
                    {
                        templist.push(datalist[inx][$('#chartColumn').val()]);
                    }
                }
                item.dataColumn=templist;
            }
            item.dataColumnValue=$('#chartColumn').val();
            item.subGroupSize=$('#chartGroup').val();


            item.specLower=$('#chartStdLower').val();
            if($('#chartStdLowerBox').attr('checked'))
                item.specLowerBorder=1;
            item.specUpper=$('#chartStdUpper').val();
            if($('#chartStdUpperBox').attr('checked'))
                item.specUpperBorder=1;
            item.historyAvg=$('#chartHisVal').val();
            item.historyStdDev=$('#chartHisStd').val();
            item.targetVal=$('#chartTargetVal').val();
            Agi.Controls.PCChart.FPCChartProperty(0,item,Me);
        });
        //初始化下拉框
        var PCChartEntity=Me.Get("Entity")[0];
        var PCChartEntityColumns=[];
        if(PCChartEntity!=null && PCChartEntity.Columns!=null){
            PCChartEntityColumns=PCChartEntity.Columns;
        }
        var DataColumns=$(this).find('#chartColumn');
        DataColumns.empty();

        DataColumns.append("<option value=''></option>");//填充空字段列
        if(PCChartEntityColumns!=null && PCChartEntityColumns.length>0)
        {
            for(var i=0;i<PCChartEntityColumns.length;i++) {
                var option ="<option value='"+PCChartEntityColumns[i]+"'>"+PCChartEntityColumns[i]+"</option>";
                DataColumns.append(option);
            }
        }

        //初始化其他组件
        var basedata= Me.Get("PCChartDataProperty").basicOption;
        $('#chartColumn').val(basedata.dataColumnValue);
        $('#chartGroup').val(basedata.subGroupSize);
        $('#chartStdLower').val(basedata.specLower);
        if(basedata.specLowerBorder==1)
            $('#chartStdLowerBox').attr('checked',"true");
        if(basedata.specUpper==1)
            $('#chartStdUpper').attr('checked',"true");

        $('#chartStdUpper').val(basedata.specUpper);
        $('#chartHisVal').val(basedata.historyAvg);
        $('#chartHisStd').val(basedata.historyStdDev);
        $('#chartTargetVal').val(basedata.targetVal);
    });
}
//在View环境中显示标准差估计菜单项
Agi.Controls.PCChartView_StdDevMenu=function(_Panel,_Control){
    var Me=_Control;
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/PCChartGxp/tabTemplates.html #ptab-2', function () {
        //保存处理
        $(this).find("#pop2Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").stdDevEst;
            var grpsize= parseInt(Me.Get("PCChartDataProperty").basicOption.subGroupSize);
            //if(grpsize>1)
            item.optionVal2=$('input:radio[name="stdLg1"]:checked').val();
            //if(grpsize==1)
            item.optionVal1=$('input:radio[name="std1"]:checked').val();
            item.movingRangeLen=$('#chartRangeLength').val();
            Agi.Controls.PCChart.FPCChartProperty(1,item,Me);
            Me.CallRFuc();
        });
        //初始化其他组件
        var basedata= Me.Get("PCChartDataProperty").stdDevEst;
        var grpsize= parseInt(Me.Get("PCChartDataProperty").basicOption.subGroupSize);
        if(grpsize>1)
            $('input:radio[name="stdLg1"][value='+basedata.optionVal+']').attr("checked",true);
        if(grpsize==1)
            $('input:radio[name="std1"][value='+basedata.optionVal+']').attr("checked",true);
        $('#chartRangeLength').val(basedata.movingRangeLen);
    });
}
//在View环境中显示图形选项菜单项
Agi.Controls.PCChartView_ImgSetMenu=function(_Panel,_Control){
    var Me=_Control;
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/PCChartGxp/tabTemplates.html #ptab-3', function () {
        //保存处理
        $(this).find("#pop3Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").pageDisplay;
            item.sigmaKValue=$('#chartSigmaVal').val();
            item.displayRatio=$('input:radio[name="chartView"]:checked').val();
            item.abilityOrZVal=$('input:radio[name="chartView2"]:checked').val();
            if($('#confidenceBox').attr('checked'))
            {
                item.confidenceInterval=1;
                item.confidenceLevel=$('#chartLevel').val();
                item.confidenceRange=$('#chartRange').val();
            }
            if($('#chartGrpAnaBox').attr('checked'))
                item.subGroupAnalysis=1;
            if($('#chartWholeAnaBox').attr('checked'))
                item.wholeAnalysis=1;

            Agi.Controls.PCChart.FPCChartProperty(2,item,Me);
            Me.CallRFuc();
        });
        //
        $(this).find("#confidenceBox").unbind().bind("click",function(ev){
            if($('#confidenceBox').attr('checked'))
            {
                $("#chartLevel").attr('disabled',false);
                $("#chartRange").attr('disabled',false);
            }else{
                $("#chartLevel").attr('disabled',true);
                $("#chartRange").attr('disabled',true);
            }
        });
        //初始化其他组件
        var item= Me.Get("PCChartDataProperty").pageDisplay;
        $('#chartSigmaVal').val(item.sigmaKValue);
        $('input:radio[name="chartView"][value='+item.displayRatio+']').attr("checked",true);
        $('input:radio[name="chartView2"][value='+item.abilityOrZVal+']').attr("checked",true);
        if(item.confidenceInterval==1)
        {
            $('#confidenceBox').attr('checked',"true");
            $('#chartLevel').val(item.confidenceLevel);
            $('#chartRange').val(item.confidenceRange);
        }
        if(item.subGroupAnalysis==1)
            $('#chartGrpAnaBox').attr('checked',"true");
        if(item.wholeAnalysis==1)
            $('#chartWholeAnaBox').attr('checked',"true");
    });
}
//在View环境中显示正太性校验菜单项
Agi.Controls.PCChartView_NormalTstMenu=function(_Panel,_Control){
    var Me=_Control;
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/PCChartGxp/tabTemplates.html #ptab-4', function () {
        //保存处理
        $(this).find("#pop4Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").normalityVerify;
            item.normalityVerifyStyle=$('input:radio[name="tnormalRadio"]:checked').val();
            Agi.Controls.PCChart.FPCChartProperty(3,item,Me);
            Me.CallRFuc();
        });
        //初始化其他组件
        var item= Me.Get("PCChartDataProperty").normalityVerify;
        $('input:radio[name="tnormalRadio"][value='+item.normalityVerifyStyle+']').attr("checked",true);
    });
}
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

            var ThisPCChartPanel=ThisHTMLElementobj.find(".pcchartpanel");
            ThisPCChartPanel.width(ThisControlPars.Width-ThisHTMLElementobj.find(".pcchartmenu").width());
            ThisPCChartPanel.height(ThisControlPars.Height);

            ThisControlObj.setSize(ThisPCChartPanel.width(),ThisPCChartPanel.height());
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
            //_ControlObj.Refresh();//刷新显示
        }
    }else  if (Key == "PCChartDataProperty") {
//        var jsonData = {
//            "basicOption":_Value.basicOption,
//            "stdDevEst":_Value.stdDevEst,
//            "pageDisplay":_Value.pageDisplay,
//            "normalityVerify":_Value.normalityVerify
//        }
//        var jsonString = JSON.stringify(jsonData);
        //数据交互
        this.CallRFuc();

    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitPCChartGxp = function () {
    return new Agi.Controls.PCChartGxp();
}
//PCChart 自定义属性面板初始化显示
Agi.Controls.PCChartProrityInit = function (_PCChart) {
    var Me = _PCChart;
    var ChartOptions = Me.Get("ChartOptions");

    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = "";
    //图形属性-基本设置-
    ItemContent=$("<div id='pcchartBaseSet'></div>");
    ItemContent.load('JS/Controls/PCChartGxp/tabTemplates.html #ptab-1', function () {
        //保存处理
        $(this).find("#pop1Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").basicOption;

            if(Me.Get("Entity")[0]!=null)
            {
                var  datalist=Me.Get("Entity")[0].Data;
                var  templist=[];
                if(datalist!=null && datalist.length>0)
                {

                    for(var inx=0;inx<datalist.length;inx++)
                    {
                        templist.push(datalist[inx][$('#chartColumn').val()]);
                    }
                }
                item.dataColumn=templist;
            }
            item.dataColumnValue=$('#chartColumn').val();
            item.subGroupSize=$('#chartGroup').val();

            var stdDevEst= Me.Get("PCChartDataProperty").stdDevEst;
            if( item.subGroupSize>1)
                stdDevEst.optionVal=$('input:radio[name="stdLg1"]:checked').val();
            if( item.subGroupSize==1)
                stdDevEst.optionVal=$('input:radio[name="std1"]:checked').val();
            stdDevEst.movingRangeLen=$('#chartRangeLength').val();
            Agi.Controls.PCChart.FPCChartProperty(1,stdDevEst,Me);

            item.specLower=$('#chartStdLower').val();
            if($('#chartStdLowerBox').attr('checked'))
                item.specLowerBorder=1;
            item.specUpper=$('#chartStdUpper').val();
            if($('#chartStdUpperBox').attr('checked'))
                item.specUpperBorder=1;
            item.historyAvg=$('#chartHisVal').val();
            item.historyStdDev=$('#chartHisStd').val();
            item.targetVal=$('#chartTargetVal').val();
            Agi.Controls.PCChart.FPCChartProperty(0,item,Me);
            Me.CallRFuc();
        });
        //初始化下拉框
        var PCChartEntity=Me.Get("Entity")[0];
        var PCChartEntityColumns=[];
        if(PCChartEntity!=null && PCChartEntity.Columns!=null){
            PCChartEntityColumns=PCChartEntity.Columns;
        }
        var DataColumns=$(this).find('#chartColumn');
        DataColumns.empty();

        DataColumns.append("<option value=''></option>");//填充空字段列
        if(PCChartEntityColumns!=null && PCChartEntityColumns.length>0)
        {
            for(var i=0;i<PCChartEntityColumns.length;i++) {
                var option ="<option value='"+PCChartEntityColumns[i]+"'>"+PCChartEntityColumns[i]+"</option>";
                DataColumns.append(option);
            }
        }

        //初始化其他组件
        var basedata= Me.Get("PCChartDataProperty").basicOption;
        $('#chartColumn').val(basedata.dataColumnValue);
        $('#chartGroup').val(basedata.subGroupSize);
        $('#chartStdLower').val(basedata.specLower);
        if(basedata.specLowerBorder==1)
            $('#chartStdLowerBox').attr('checked',"true");
        if(basedata.specUpper==1)
            $('#chartStdUpper').attr('checked',"true");

        $('#chartStdUpper').val(basedata.specUpper);
        $('#chartHisVal').val(basedata.historyAvg);
        $('#chartHisStd').val(basedata.historyStdDev);
        $('#chartTargetVal').val(basedata.targetVal);
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: ItemContent }));
    //标准差估计
    ItemContent = null;
    ItemContent=$("<div id='pcchartStdDev'></div>");
    ItemContent.load('JS/Controls/PCChartGxp/tabTemplates.html #ptab-2', function () {
        //保存处理
        $(this).find("#pop2Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").stdDevEst;
            var grpsize= parseInt(Me.Get("PCChartDataProperty").basicOption.subGroupSize);
            if(grpsize>1)
                item.optionVal=$('input:radio[name="stdLg1"]:checked').val();
            if(grpsize==1)
                item.optionVal=$('input:radio[name="std1"]:checked').val();
            item.movingRangeLen=$('#chartRangeLength').val();
            Agi.Controls.PCChart.FPCChartProperty(1,item,Me);
            Me.CallRFuc();
        });
        //初始化其他组件
        var basedata= Me.Get("PCChartDataProperty").stdDevEst;
        var grpsize= parseInt(Me.Get("PCChartDataProperty").basicOption.subGroupSize);
        if(grpsize>1)
            $('input:radio[name="stdLg1"][value='+basedata.optionVal+']').attr("checked",true);
        if(grpsize==1)
            $('input:radio[name="std1"][value='+basedata.optionVal+']').attr("checked",true);
        $('#chartRangeLength').val(basedata.movingRangeLen);
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标准差估计", DisabledValue: 1, ContentObj: ItemContent }));
    //图形选项
    ItemContent = null;
    ItemContent=$("<div id='pcchartImgSet'></div>");
    ItemContent.load('JS/Controls/PCChartGxp/tabTemplates.html #ptab-3', function () {
        //保存处理
        $(this).find("#pop3Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").pageDisplay;
            item.sigmaKValue=$('#chartSigmaVal').val();
            item.displayRatio=$('input:radio[name="chartView"]:checked').val();
            item.abilityOrZVal=$('input:radio[name="chartView2"]:checked').val();
            if($('#confidenceBox').attr('checked'))
            {
                item.confidenceInterval=1;
                item.confidenceLevel=$('#chartLevel').val();
                item.confidenceRange=$('#chartRange').val();
            }
            if($('#chartGrpAnaBox').attr('checked'))
                item.subGroupAnalysis=1;
            if($('#chartWholeAnaBox').attr('checked'))
                item.wholeAnalysis=1;

            Agi.Controls.PCChart.FPCChartProperty(2,item,Me);
            Me.CallRFuc();
        });
        //
        $(this).find("#confidenceBox").unbind().bind("click",function(ev){
            if($('#confidenceBox').attr('checked'))
            {
                $("#chartLevel").attr('disabled',false);
                $("#chartRange").attr('disabled',false);
            }else{
                $("#chartLevel").attr('disabled',true);
                $("#chartRange").attr('disabled',true);
            }
        });
        //初始化其他组件
        var item= Me.Get("PCChartDataProperty").pageDisplay;
        $('#chartSigmaVal').val(item.sigmaKValue);
        $('input:radio[name="chartView"][value='+item.displayRatio+']').attr("checked",true);
        $('input:radio[name="chartView2"][value='+item.abilityOrZVal+']').attr("checked",true);
        if(item.confidenceInterval==1)
        {
            $('#confidenceBox').attr('checked',"true");
            $('#chartLevel').val(item.confidenceLevel);
            $('#chartRange').val(item.confidenceRange);
        }
        if(item.subGroupAnalysis==1)
            $('#chartGrpAnaBox').attr('checked',"true");
        if(item.wholeAnalysis==1)
            $('#chartWholeAnaBox').attr('checked',"true");
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "图形选项", DisabledValue: 1, ContentObj: ItemContent }));
    // 正太性检验
    ItemContent = null;
    ItemContent=$("<div id='pcchartNormalTst'></div>");
    ItemContent.load('JS/Controls/PCChartGxp/tabTemplates.html #ptab-4', function () {
        //保存处理
        $(this).find("#pop4Save").unbind().bind("click",function(ev){
            var item= Me.Get("PCChartDataProperty").normalityVerify;
            item.normalityVerifyStyle=$('input:radio[name="tnormalRadio"]:checked').val();
            Agi.Controls.PCChart.FPCChartProperty(3,item,Me);
            Me.CallRFuc();
        });
        //初始化其他组件
        var item= Me.Get("PCChartDataProperty").normalityVerify;
        $('input:radio[name="tnormalRadio"][value='+item.normalityVerifyStyle+']').attr("checked",true);
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "正太性检验", DisabledValue: 1, ContentObj: ItemContent }));

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
    }

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
Namespace.register("Agi.Controls.PCChart");
/*添加 Agi.Controls.PCChart命名空间*/

//组织属性模板参数
//tabseq:属性模板号 0-3    propertyObj：属性模板内组织好的参数集合
Agi.Controls.PCChart.FPCChartProperty = function (tabseq,propertyObj,pcchart){
    var propertyData=pcchart.Get('PCChartDataProperty');
    var jsonData = {
        "basicOption":propertyData.basicOption,
        "stdDevEst":propertyData.stdDevEst,
        "pageDisplay":propertyData.pageDisplay,
        "normalityVerify":propertyData.normalityVerify
    }
    if(tabseq==0)
    {
        jsonData.basicOption=propertyObj;
        propertyData.basicOption=propertyObj;
    }
    if(tabseq==1)
    {
        jsonData.stdDevEst=propertyObj;
        propertyData.stdDevEst=propertyObj;
    }
    if(tabseq==2)
    {
        jsonData.pageDisplay=propertyObj;
        propertyData.pageDisplay=propertyObj;
    }
    if(tabseq==3)
    {
        jsonData.normalityVerify=propertyObj;
        propertyData.normalityVerify=propertyObj;
    }
    var jsonString = JSON.stringify(jsonData);
    //alert(jsonString);
    pcchart.Set("PCChartDataProperty", propertyData);
    pcchart.CallRFuc();
}

//判断相应名称的基准线是否已存在
Agi.Controls.PCChart.StandLineIsExt = function (_standlines, _LineName) {
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
Agi.Controls.PCChart.GetStandardLine = function (_standlines, _LineID) {
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
Agi.Controls.PCChart.GetStandardLineIDByName = function (_standlines, _LineName) {
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
Agi.Controls.PCChart.GetPostionObjByXYStr = function (_XY) {
    var PostionArray = _XY.split(" ");
    return {StartX:parseInt(PostionArray[1]), StartY:parseInt(PostionArray[2]), EndX:parseInt(PostionArray[4]), EndY:parseInt(PostionArray[5])};
}
/*根据基准线格式化图表线条数据*/
/*
 * _ChartSeriesData,对象，元素包含属性{name,data:数组，元素为对象，包含属性：{name,x,y},type,color,Entity,XColumn,YColumn}
 * _ChartStandLines,数组，元素包含属性：{LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips}
 * */
Agi.Controls.PCChart.GetStandLineDataArray = function (_ChartSeriesData, _ChartStandLines) {
    var ReturnData = _ChartSeriesData.data;
    if (_ChartStandLines != null && _ChartStandLines.length > 0) {
        for (var i = 0; i < _ChartStandLines.length; i++) {
            //if(_ChartStandLines[i].LineDir=="Horizontal"){
            ReturnData = Agi.Controls.PCChart.GetChartSeriesDataBy_Standardline(ReturnData, _ChartStandLines[i].LineValue, {Type:_ChartSeriesData.type, Color:_ChartSeriesData.color}, _ChartStandLines)
            // }
        }
    }
    return ReturnData;
}
/*-------基准线拖动更改点颜色---------*/
/*更改点的颜色*/
Agi.Controls.PCChart.GetChartSeriesDataBy_Standardline = function (_ChartDataArray, StanrdValue, _ChartTypePar, _StandardLines) {
    var ReturnData = [];
    if (_ChartDataArray != null && _ChartDataArray.length > 0) {
        if (_ChartTypePar.Type == "column") {
            for (var i = 0; i < _ChartDataArray.length; i++) {
                ReturnData.push({name:_ChartDataArray[i].name, x:_ChartDataArray[i].x, y:_ChartDataArray[i].y, color:Agi.Controls.PCChart.GetColumnSty(_ChartDataArray[i].y, StanrdValue, _ChartTypePar.Color, _StandardLines)});
            }
        } else {
            for (var i = 0; i < _ChartDataArray.length; i++) {
                ReturnData.push({name:_ChartDataArray[i].name, x:_ChartDataArray[i].x, y:_ChartDataArray[i].y, marker:Agi.Controls.PCChart.GetMarkrSty(_ChartDataArray[i].y, StanrdValue, _StandardLines)});
            }
        }
    }
    return ReturnData;
}
/*判断值是否符合条件*/
Agi.Controls.PCChart.GetMarkrSty = function (_Value, _CompareValue, _StandardLines) {
    var MarkerFillColor = Agi.Controls.PCChart.GetPointColorByStandardLinds(_StandardLines, _Value);
    if (MarkerFillColor != null && MarkerFillColor != "") {
        return {fillColor:MarkerFillColor};
    } else {
        return null;
    }
}
//获取柱状图点的样式
Agi.Controls.PCChart.GetColumnSty = function (_Value, _CompareValue, _OldColor, _StandardLines) {
    var ColumnColor = Agi.Controls.PCChart.GetPointColorByStandardLinds(_StandardLines, _Value);
    if (ColumnColor != null && ColumnColor != "") {
        return ColumnColor;
    } else {
        return _OldColor;
    }
}
