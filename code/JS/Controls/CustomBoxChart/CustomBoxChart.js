/**
 * Created with JetBrains WebStorm.
 * User: liuyi
 * Date: 13-10-15
 * Time: 上午10:17
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/

Agi.Controls.CustomBoxChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        getChartOptions: function () {
            var control = this;
            return {
                chart: {
                    renderTo: '',
                    type: 'boxplot',
                    animation: false
                },
                title: {
                    text: '<div style="background-color: silver; font-size: 16px">箱线图</div>',
                    useHTML: true,
                    style: {
                        color: '#3E576F',
                        fontSize: '16px'
                    },
                    align: 'center',
                    verticalAlign: '',
                    floating: false,
                    y: 16
                },
                subtitle: {
                    text: '<a href="http://" target="_blank" get>demo</a>',
                    align: 'center',
                    verticalAlign: ''
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: ['1', '2', '3', '4', '5'],
                    title: {
                        enabled: false
                    }
                },
                yAxis: {
                    title: {
                        text: 'SPC箱线图'
                    }
                },
                series: [
                    {
                        data: [
                            [760, 801, 848, 895, 965],
                            [733, 853, 939, 980, 1080],
                            [714, 762, 817, 870, 918],
                            [724, 802, 806, 871, 950],
                            [834, 836, 864, 882, 910]
                        ]
                    },
                    {
                        name: 'Outlier',
                        color: Highcharts.getOptions().colors[0],
                        type: 'scatter',
                        data: [ // x, y positions where 0 is the first category
                            [0, 644],
                            [4, 718],
                            [4, 951],
                            [4, 969]
                        ],
                        marker: {
                            fillColor: 'white',
                            lineWidth: 1,
                            lineColor: Highcharts.getOptions().colors[0]
                        },
                        tooltip: {
                            pointFormat: 'Observation: {point.y}'
                        }
                    }
                ],
                tooltip: {
                    formatter: function () {
                        if (this.point.box) {
                            return this.point.category + "<br/>" +
                                this.series.name + "<br/>" +
                                "上限：" + this.point.high + "<br/>" +
                                "q3：" + this.point.q3 + "<br/>" +
                                "中位数：" + this.point.median + "<br/>" +
                                "q1：" + this.point.q1 + "<br/>" +
                                "下限：" + this.point.low;
                        }
                        else {
                            return this.point.category + "<br/>" +
                                this.y;
                        }
                    }
                },
                plotOptions: {
                    series:{
                        point:{
                            events:{
                                click: function (e) {
                                    if (!Agi.Edit) {
                                        var PointObj=this;
                                        if(PointObj.series.name==="异常值符号"){
                                            $("#PointErroSave").show();
                                            $("#PointSrcData").hide();
                                            $('#pointMenu').css('top',e.clientY+5);
                                            $('#pointMenu').css('left',e.clientX-15);
                                            $('#pointMenu').show().find("li").unbind("click").bind("click",function(event){
                                                control.PointClickEvent({name:PointObj.series.name,x:PointObj.x,y:PointObj.y,Time:new Date()},$(this).data("menutype"));
                                                $('#pointMenu').hide();
                                                event.stopPropagation();
                                            });
                                            $('#pointMenu').find(".dropdown-menu").show();
                                            $('.highcharts-container').unbind('click').bind('click',function(){
                                                $('#pointMenu').hide();
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
        }, /*chart配置*/
        GetEntityData: function () {//获得实体数据
            var entity = this.Get('Entity')[0];
            if (entity != undefined && entity != null) {
                return entity.Data;
            } else {
                return null;
            }
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
        ReadData: function (_EntityInfo) {
            if (!_EntityInfo) {
                this.ReadOtherData("");
                return;
            }
            var Me = this;
            var control = this;
            var entity = [];
            this.Set("EntityInfo", _EntityInfo);
            Me.Set("PlotLines", []);

            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
                _EntityInfo.Data =Agi.Controls.DataConvertManager.DataInterception(d.Data,1000);
                if(d.Columns!=null && d.Columns.length>0){
                    _EntityInfo.Columns = d.Columns;
                }
                //默认绑定字段
                var cp = Me.Get('ChartProperty')
                cp.SeriesGroupColumn = _EntityInfo.Columns[0];
                cp.SeriesDataColumn = [_EntityInfo.Columns[1]];
                //
                if (!cp.dataColumns) {
                    cp.groupColumns = [_EntityInfo.Columns[0]];
                    cp.dataColumns = [_EntityInfo.Columns[1]];
                }
                //
                Me.Set('ChartProperty', cp);

                entity.push(_EntityInfo);
                Me.Set("Entity", entity);

                Me.AddEntity(entity[0]);
                /*添加实体*/
                Me.chageEntity = true;
            });
        },
        ReadOtherData: function () {//测试数据
            //alert("测试数据");
            var cp = this.Get('ChartProperty');
            if (!this.chartOptions) {
                this.chartOptions = this.getChartOptions();
            }
            this.chartOptions.chart.renderTo = cp.chart_RenderTo;
            //模拟数据
            agi.jsloader.script("JS/controls/CustomBoxChart/demo.js")
                .wait(function () {
                    //debugger;
                });
            this.InitHighChart();
        },
        AddEntitySingle: function (_entity) {
            var Me = this;
            Me.Set("FilterData", _entity.Data);

            Me.ChartLoadByData(_entity.Data);//加载数据
            Me.ShowDataTable();//显示表格数据
        },//单值图
        ChartLoadByData: function (_Data) {
            $('#pointMenu').hide();//图形刷新前隐藏原数据点右键菜单
            var Me = this;
            var ArrayBCName = [], DataArray = [], EntityData = [];
            var ArrayValue = [];
            if (_Data != null && _Data.length > 0) {
                EntityData = _Data;

                var cp = Me.Get('ChartProperty');//cp.SeriesGroupColumn cp.SeriesDataColumn

                var sortData = Me.DataSortByGrpName(EntityData);
                EntityData = sortData.data;
                //bug fix
                if (cp.chartOptions) {
                    cp.chartOptions.tooltip = Me.chartOptions.tooltip;
                    cp.chartOptions.plotOptions = Me.chartOptions.plotOptions;
                    Me.chartOptions = cp.chartOptions;
                }
                //add groupColumn and dataColumn
                if (!cp.groupColumns) {
                    /*请求R计算服务*/
                    var json = {
                        "action": "RCalBoxplot",
                        "dataArray": []
                    };
                    //
                    json.dataArray = [];
                    //
                    Me.chartOptions.xAxis.categories = cp.dataColumns;
                    Me.chartOptions.title.text = $(Me.chartOptions.title.text).text(cp.dataColumns.toString() + "的箱线图")[0].outerHTML;
                    //
                    for (var i = 0; i < cp.dataColumns.length; i++) {
                        var cat = cp.dataColumns[i];
                        var tempArray = [];
                        //
                        for (var j = 0; j < EntityData.length; j++) {
                            var data = EntityData[j];
                            tempArray.push(data[cat]);
                        }
                        //
                        json.dataArray.push(tempArray);
                        //
//                    tempArray.length = 9;
                    }
                }
                else {
                    /*请求R计算服务*/
                    var json = {
                        "action": "RCalBoxplot",
                        "dataArray": []
                    };
                    //
                    //
                    json.dataArray = [];
                    //
                    //Me.chartOptions.xAxis.categories = groups;
                    Me.chartOptions.title.text = $(Me.chartOptions.title.text).text(cp.dataColumns.toString() + "的箱线图")[0].outerHTML;
                    //
                    var dataObject = {};
                    //add kuandu
                    for (var i = 0; i < cp.dataColumns.length; i++) {
                        var cat = cp.dataColumns[i];
                        dataObject[cat] = [];
                    }
                    //add banzu
                    for (var i = 0; i < cp.groupColumns.length; i++) {
                        var groupColumn = cp.groupColumns[i];
                        for (var obj in dataObject) {
                            delete dataObject[obj];
                            for (var j = 0; j < EntityData.length; j++) {
                                var data = EntityData[j];
                                var group = data[groupColumn];
                                if (!dataObject[obj + "##" + groupColumn + "&&" + group]) {
                                    dataObject[obj + "##" + groupColumn + "&&" + group] = [];
                                }
                            }
                        }
                    }
                    //
                    for (var obj in dataObject) {
                        for (var i = 0; i < EntityData.length; i++) {
                            var data = EntityData[i];
                            //
                            var dataColumn = obj.split("##")[0];
                            //
                            var addRow = true;
                            for (var j = 1; j < obj.split("##").length; j++) {
                                var columns = obj.split("##")[j];
                                var groupColumn = columns.split("&&")[0];
                                var group = columns.split("&&")[1];
                                addRow = (data[groupColumn] === group)
                            }
                            if (addRow) {
                                dataObject[obj].push(data[dataColumn]);
                            }
                        }
                    }
                    //add merge
                    if (cp.merge === "合并列") {
                        var lastDataColumn = "";
                        var dataObjectClone = JSON.parse(JSON.stringify(dataObject));
                        dataObject = {};
                        for (var obj in dataObjectClone) {
                            var dataColumn = obj.split("##")[0];
                            if (lastDataColumn !== dataColumn) {
                                lastDataColumn = dataColumn;
                                //
                                dataObject[dataColumn] = [];
                                //add data
                                for (var i = 0; i < EntityData.length; i++) {
                                    var data = EntityData[i];
                                    dataObject[dataColumn].push(data[dataColumn]);
                                }
                            }
                            dataObject[obj] = dataObjectClone[obj];
                        }
                    }
                    else if (cp.merge === "合并组") {
                        var lastGroup = "";
                        var dataObjectClone = JSON.parse(JSON.stringify(dataObject));
                        dataObject = {};
                        for (var obj in dataObjectClone) {
                            var groupColumn = obj.split("##")[1].split("&&")[0];
                            var group = obj.split("##")[1].split("&&")[1];
                            if (lastGroup !== group) {
                                lastGroup = group;
                                //
                                dataObject[obj.split("##")[0] + "##" + obj.split("&&")[1]] = [];
                                //add data
                                for (var i = 0; i < EntityData.length; i++) {
                                    var data = EntityData[i];
                                    if (data[groupColumn] === group) {
                                        dataObject[obj.split("##")[0] + "##" + obj.split("##")[1]].push(data[dataColumn]);
                                    }
                                }
                            }
                            dataObject[obj] = dataObjectClone[obj];
                        }
                    }
                    //
                    Me.chartOptions.xAxis.categories = [];
                    for (var obj in dataObject) {
                        var temp = dataObject[obj];
//                    temp.length = 9;
                        json.dataArray.push(temp);
                        var catNameFinal = obj.split("##")[0];
                        for (var i = 1; i < obj.split("##").length; i++) {
                            var catName = obj.split("##")[i];
                            catNameFinal += "-" + catName.split("&&")[1];
                        }
                        Me.chartOptions.xAxis.categories.push(catNameFinal);
                    }
                }
                //
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalBoxplot",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                Me.chartOptions.series = [
                                    {
                                        name: "箱线图",
                                        data: []
                                    }
                                ]
                                for (var i = 0; i < result.data.meddata.length; i++) {
                                    var meddata = result.data.meddata[i];
                                    Me.chartOptions.series[0].data.push(
                                        //[meddata.box_l, meddata.qua_l, meddata.med, meddata.qua_u, meddata.box_u]
                                        { x: i, low: meddata.box_l, q1: meddata.qua_l, median: meddata.med, q3: meddata.qua_u, high: meddata.box_u, pointWidth: 100 }
                                    )
                                }
                                Me.InitHighChart();
                                //
                                Me.data = result.data;
                                //
                                //add dataSymble
                                var control = Me;
                                if (cp.CustomBoxChart_zwszxqj) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        //if (tempSeries.name == "中位数置信区间") {
                                        if (tempSeries.name == "箱线图") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 1,
                                            name: "中位数置信区间",
                                            data: []
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.mediandata.length; i++) {
                                        var meddata = control.data.mediandata[i];
                                        series.data.push(
                                            //[i,meddata.box_l, meddata.qua_l, meddata.med, meddata.qua_u, meddata.box_u]
                                            { x: i, low: meddata.box_l, q1: meddata.qua_l, median: meddata.med, q3: meddata.qua_u, high: meddata.box_u, name: "中位数置信区间", color: "red", pointWidth: 50 }
                                        )
                                    }
                                    control.InitHighChart();
                                }
                                if (cp.CustomBoxChart_jck) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        if (tempSeries.name == "箱线图") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 2,
                                            name: "极差框",
                                            data: []
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.terrible.length; i++) {
                                        var meddata = control.data.terrible[i];
                                        series.data.push(
                                            //[meddata.box_l, meddata.qua_l, meddata.med, meddata.qua_u, meddata.box_u]
                                            { x: i, low: meddata.box_l, q1: meddata.qua_l, median: meddata.med, q3: meddata.qua_u, high: meddata.box_u, name: "极差框", color: "yellow", pointWidth: 150 }
                                        )
                                    }
                                    control.InitHighChart();
                                }
                                if (cp.CustomBoxChart_yczfh) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        if (tempSeries.name == "异常值符号") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 3,
                                            name: "异常值符号",
                                            type: "scatter",
                                            data: [],
                                            marker: {
                                                symbol: 'url(JS/Controls/CustomBoxChart/s1.png)'
                                            }
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.meddata.length; i++) {
                                        var meddata = control.data.meddata[i];
                                        for (var j = 0; j < meddata.anomalousArray.length; j++) {
                                            var anomalous = meddata.anomalousArray[j];
                                            series.data.push(
                                                [i, anomalous]
                                            )
                                        }
                                    }
                                    if (series.data.length === 0) {
                                        alert("没有异常值！");
                                        control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                                    }
                                    else {
                                        control.InitHighChart();
                                    }
                                }
                                if (cp.CustomBoxChart_dzfh) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        if (tempSeries.name == "单值符号") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 4,
                                            name: "单值符号",
                                            type: "scatter",
                                            data: [],
                                            marker: {
                                                symbol: 'url(JS/Controls/CustomBoxChart/s2.png)'
                                            }
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.mediandata.length; i++) {
                                        var meddata = control.data.mediandata[i];
                                        for (var attr in meddata) {
                                            if (!(isNaN(meddata[attr]))) {
                                                series.data.push(
                                                    [i, meddata[attr]]
                                                );
                                            }
                                        }
                                    }
                                    control.InitHighChart();
                                }
                                if (cp.CustomBoxChart_zwsfh) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        if (tempSeries.name == "中位数符号") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 5,
                                            name: "中位数符号",
                                            type: "scatter",
                                            data: [],
                                            marker: {
                                                symbol: 'url(JS/Controls/CustomBoxChart/s3.png)'
                                            }
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.mediandata.length; i++) {
                                        var meddata = control.data.mediandata[i];
                                        series.data.push(
                                            [i, meddata.med]
                                        );
                                    }
                                    control.InitHighChart();
                                }
                                if (cp.CustomBoxChart_zwsljx) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        if (tempSeries.name == "中位数连接线") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 6,
                                            name: "中位数连接线",
                                            type: "line",
                                            marker: {
                                                enabled: false
                                            },
                                            data: []
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.mediandata.length; i++) {
                                        var meddata = control.data.mediandata[i];
                                        series.data.push(
                                            [i, meddata.med]
                                        );
                                    }
                                    control.InitHighChart();
                                }
                                if (cp.CustomBoxChart_jzfh) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        if (tempSeries.name == "均值连符号") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 7,
                                            name: "均值连符号",
                                            type: "scatter",
                                            data: [],
                                            marker: {
                                                symbol: 'url(JS/Controls/CustomBoxChart/s4.png)'
                                            }
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.mediandata.length; i++) {
                                        var meddata = control.data.mediandata[i];
                                        series.data.push(
                                            [i, meddata.mean]
                                        );
                                    }
                                    control.InitHighChart();
                                }
                                if (cp.CustomBoxChart_jzljx) {
                                    var series = null;
                                    for (var i = 0; i < control.chartOptions.series.length; i++) {
                                        var tempSeries = control.chartOptions.series[i];
                                        if (tempSeries.name == "均值连接线") {
                                            series = tempSeries;
                                            break;
                                        }
                                    }
                                    if (!series) {
                                        series = {
                                            index: 8,
                                            name: "均值连接线",
                                            type: "line",
                                            marker: {
                                                enabled: false
                                            },
                                            data: []
                                        };
                                        control.chartOptions.series.push(series);
                                    }
                                    for (var i = 0; i < control.data.mediandata.length; i++) {
                                        var meddata = control.data.mediandata[i];
                                        series.data.push(
                                            [i, meddata.mean]
                                        );
                                    }
                                    control.InitHighChart();
                                }
                            }
                        }
                    }
                );
            }
        },//图表加载数据 20130817 markeluo
        DataSortByGrpName: function (_Data) {
            var Me = this;
            var EntityData = [], ArrayBCName = [];
            var TempArray = [];
            if (_Data != null && _Data.length > 0) {
                var cp = Me.Get('ChartProperty');//cp.SeriesGroupColumn cp.SeriesDataColumn
                var Groupname = cp.SeriesGroupColumn;

                var res = [], hash = {};
                //取出所有样本名称
                if (Groupname != "") {
                    for (var i = 0; i < _Data.length; i++) {
                        ArrayBCName.push(_Data[i][Groupname]);
                    }
                    //样本名称去重复
                    for (var i = 0, elem; (elem = ArrayBCName[i]) != null; i++) {
                        if (!hash[elem]) {
                            res.push(elem);
                            hash[elem] = true;
                        }
                    }
                }
                if (res != null && res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        for (var len = 0; len < _Data.length; len++) {
                            if (_Data[len][Groupname] == res[i]) {
                                TempArray.push(_Data[len]);
                            }
                        }
                    }
                } else {
                    for (var len = 0; len < _Data.length; len++) {
                        TempArray.push(_Data[len]);
                    }
                }
            }
            EntityData = ArrayBCName = null;
            return {
                data: TempArray,
                cat: res
            };
        },//根据分组名称对_Data进行分组排序
        RefreshByProPanelUp: function () {
            var Me = this;
            var FilterData = Me.Get("FilterData");
            if (FilterData == null) {
                FilterData = Me.Get("Entity")[0].Data;
            }
            Me.ChartLoadByData(FilterData);//加载数据
        },//属性更新后，图表刷新 20130817 markeluo
        UpPlotLineGroups: function (_PlotLineGrps) {
            //[{GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000}]
            //MaxValueType&MinValueType:0,代表Value为输入值 ;1，代表选择对应的Value为字段名
            var Me = this;
            Me.Set("NoFormatPlotLines", _PlotLineGrps);
        },//更新标准线组 20130815 markeluo
        UpSigmConditions: function (_rules) {
            var Me = this;
            Me.Set("Sigmrules", _rules);//保存八项判异规则
        },//图表应用西格玛线判异规则 20130817 markeluo
        UpChartwarnRule: function (_warnRule) {
            //_warnRule {warnColumn,warnRule,warnCompareValue,warnColor}
            var Me = this;
            Me.Set("WarnRule", _warnRule);//特殊报警功能
        },//图表特殊报警判异规则 20130817 markeluo
        FilterDataUpShow: function (_filterData) {
            var Me = this;
            Me.Set("FilterData", _filterData);
            Me.ChartLoadByData(_filterData);//重新加载数据
        },//筛选数据后，更新显示  20130817 markeluo
        UpSeriesBindInfo: function (_dataLine) {
            //_dataLine:{SeriesName,GroupColumn,DataColumn,SeriesColor,SeriesMarkerColor}
            var Me = this;
            var cp = Me.Get('ChartProperty');
            cp.series_DataColor = _dataLine.SeriesColor;
            cp.series_PointMarkerColor = _dataLine.SeriesMarkerColor;
            cp.SeriesGroupColumn = _dataLine.GroupColumn;
            cp.SeriesDataColumn = [_dataLine.DataColumn];
            var FilterDataArray = Me.Get("FilterData");
            if (FilterDataArray != null && FilterDataArray.length > 0) {
                FilterDataArray = Me.DataSortByGrpName(FilterDataArray);
            } else {
                FilterDataArray = Me.DataSortByGrpName(Me.Get("Entity")[0].Data);
            }
            Me.Set('ChartProperty', cp);
            Me.Set("FilterData", FilterDataArray);
        },//更改曲线设置后，更新显示  20130817 markeluo
        GetDataSeries: function () {
            var Me = this;
            var DataSeries = Agi.Controls.CustomBoxChartGetDataSries(Me.Get('ChartSeries'), true);
            return DataSeries;
        },//获取当前图表对应的数据series(非标准线)  20130817 markeluo
        RefinementData: function (_RowData) {
            //window.open(Agi.ViewServiceAddress + pageName + "&isView=true");
            var strParam = '';
            for (var key in _RowData) {
                if (strParam != "") {
                    strParam += '&' + (key + '=' + _RowData[key]);
                }
                else {
                    strParam += (key + '=' + _RowData[key]);
                }

            }

            window.open("page2.html?" + strParam);
        },//数据钻取/查看详情  20130817 markeluo
        DisabledDataDrill: function () {
            var Me = this;
            Me.Set("DataDrillState", false);//禁用钻取
        },//禁用数据钻取功能 20130820 13:26 markeluo
        RemoveALLPlotLine: function () {
            var Me = this;
            var PlotLines = Me.Get("PlotLines");
            if (PlotLines != null) {
                //获取当前标准线组的标准线元素
                var PlotLineArray = [];
                for (var i = 0; i < PlotLines.length; i++) {
                    PlotLineArray.push(PlotLines[i].Items[0].id);
                    PlotLineArray.push(PlotLines[i].Items[1].id);
                }
                for (var i = 0; i < PlotLineArray.length; i++) {
                    Me.Get('chart').yAxis[0].removePlotLine(PlotLineArray[i]);
                }
                for (var i = 0; i < PlotLines.length; i++) {
                    PlotLines.splice(0, 1);
                }
            }
            Me.ShowALLPlotLineGroup();
        },
        ShowALLPlotLineGroup: function () {
            var Me = this;
            var CusSigChart = Me.Get('chart');
            var PlotLineAndBands = CusSigChart.yAxis[0].plotLinesAndBands[0];
            if (PlotLineAndBands != null && PlotLineAndBands.length > 0) {
                for (var i = 0; i < PlotLineAndBands.length; i++) {
                    CusSigChart.yAxis[0].removePlotLine(PlotLineAndBands[i].id);
                }
            }
            var _PlotLineGrps = Me.Get("NoFormatPlotLines");
            var PlotLines = [];
            var newGroup = null;
            if (_PlotLineGrps != null && _PlotLineGrps.length > 0) {
                for (var i = 0; i < _PlotLineGrps.length; i++) {
                    newGroup = Agi.Controls.CustomBoxChartFormatPlotGrpPars(Me.Get("Entity")[0], _PlotLineGrps[i]);//新增标准线组
                    if (newGroup != null) {
                        PlotLines.push({GroupName: _PlotLineGrps[i].GroupName, Items: newGroup});
                    }
                }
            }
            Me.Set("PlotLines", PlotLines);

            if (PlotLines != null) {
                //获取当前标准线组的标准线元素
                var Yasixobj = CusSigChart.yAxis[0];
                for (var i = 0; i < PlotLines.length; i++) {
                    Yasixobj.addPlotLine(PlotLines[i].Items[0]);
                    Yasixobj.addPlotLine(PlotLines[i].Items[1]);
                }
            }

            //更新超出标准线的point点
            var chartSeries = Me.Get('ChartSeries');

            var DataSeries = Agi.Controls.CustomBoxChartGetDataSries(chartSeries);
            Agi.Controls.CustomBoxChartPlotLineUpSeries(DataSeries, PlotLines);//更新Series 点数据

            //特异判断规则应用，更改series 点的颜色
            var FilterData = Me.Get("FilterData");
            var WarnRuleValue = Me.Get("WarnRule");//特殊报警功能
            if (WarnRuleValue != null && WarnRuleValue.warnColumn != null && FilterData != null && FilterData.length > 0) {
                var bool = false;
                for (var i = 0; i < FilterData.length; i++) {
                    //bool=eval(eval(FilterData[i][WarnRuleValue.warnColumn])+WarnRuleValue.warnRule+eval(WarnRuleValue.warnCompareValue));
                    bool = Agi.Controls.WarnValueCompare(FilterData[i][WarnRuleValue.warnColumn], WarnRuleValue.warnCompareValue, WarnRuleValue.warnRule);
                    if (bool) {
                        if (DataSeries != null && DataSeries.length > 0) {
                            for (var j = 0; j < DataSeries.length; j++) {
                                DataSeries[j].data[i].marker = {fillColor: WarnRuleValue.warnColor};
                            }
                        }
                    }
                }
                if (chartSeries != null && chartSeries.length > 0) {
                    for (var i = 0; i < chartSeries.length; i++) {
                        for (var j = 0; j < DataSeries.length; j++) {
                            if (chartSeries[i].name == DataSeries[j].name) {
                                chartSeries[i].data = DataSeries[j].data;
                            }
                        }
                    }
                }
            }

            if (DataSeries != null && DataSeries.length > 0) {
                for (var i = 0; i < CusSigChart.series.length; i++) {
                    for (var j = 0; j < DataSeries.length; j++) {
                        if (CusSigChart.series[i].name == DataSeries[j].name) {
                            CusSigChart.series[i].remove();
                            i = -1;
                            break;
                        }
                    }
                }


                for (var i = 0; i < DataSeries.length; i++) {
                    DataSeries[i].data = Me.ApplySigmRule(DataSeries[i].data);//应用西格玛八项判异规则
                    CusSigChart.addSeries(DataSeries[i]);
                }
            }

            Me.ShowDataTable();//显示表格数据

            //标准线、西格玛线 统计信息
            var tolInfo = Agi.Controls.CustomSigChartAlarmStatistical(chartSeries, PlotLines);//统计信息
            var AppendToPanel = Me.Get("HTMLElement");
            tolInfo.SGM.SigmaValue = Me.Get('ChartProperty').ChartisigmaValue;//西格玛系数
            //Agi.Controls.CustomSigChartAlarmStatisticalPanelShow(tolInfo,AppendToPanel);
            Agi.Controls.CustomSigChartAlarmStatisticalTableShow(tolInfo, AppendToPanel);
        },//显示标准线
        GridTdAbnormal: function (array) {
//            debugger;
            if (array != null && array.length > 0) {
                var grid = this.grid;
                if (grid) {
                    var index = -1;
                    for (var i = 0; i < grid.wijgrid('columns').length; i++) {
                        if (grid.wijgrid('columns')[i].options.dataKey == array[0].column) {
                            index = i;
                        }
                    }
                    var pageIndex = grid.wijgrid('option', 'pageIndex');
                    var pageSize = grid.wijgrid('option', 'pageSize');
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].row >= pageIndex * pageSize && array[i].row < pageIndex * pageSize + 5) {
                            $($(grid.find('tbody>tr')[(array[i].row) % (pageIndex * pageSize)]).find('td')[index]).css('color', array[i].color);
                        }
                    }
                }
            }
        },//修改数据表格报警点颜色
        ApplySigmRule: function (_SeriesDataArray) {
            var Me = this;
            var SigmArray = Me.Get("Sigmrules");//八项判异规则数组
            var NewSeriesData = _SeriesDataArray;
            if (SigmArray != null && SigmArray.length > 0) {
                var CheckDataSries = Agi.Controls.SigmRuleApplyGetGroupData(Me.Get("CheckDataSeries"));//分组数据信息
                ////待实现
                //NewSeriesData=SigmArlmFunc({SeriesData:_SeriesDataArray,SigmRule:SigmArray,GroupData:CheckDataSries});
                var ojb = new clsSigmaFunc(_SeriesDataArray, SigmArray, CheckDataSries);
                NewSeriesData = ojb.check();
            }
            return NewSeriesData;
        },//应用西格玛八项规则
        ShowDataTable: function () {

        },//显示表格数据
        AddEntitySample: function (_entity) {//XBar-S
            var Me = this;
            var cp = Me.Get("ChartProperty");
            var ArrayBCName = [], EntityData = [];
            if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
                //                //序列化数据转换为Array
                //                for (var len = 0; len < _entity.Data.length; len++) {
                //                    var _Item = [];
                //                    for (var item in _entity.Data[len]) {
                //                        _Item.push(_entity.Data[len][item]);
                //                    }
                //                    EntityData.push(_Item);
                //                }
                //                //遍历EntityData,将二维数组转换为一维数组
                //                for (var i = 0; i < EntityData.length; i++) {
                //                    var ColumData = EntityData[i];
                //                    for (var item in ColumData) {
                //                        ArrayBCName.push(ColumData[item]);
                //                    }
                //                }]
                if (!isNaN(_entity.Data[0][_entity.Columns[0]])) {
                    for (var i = 0; i < _entity.Data.length; i++) {
                        ArrayBCName.push(eval(_entity.Data[i][_entity.Columns[0]]));
                    }
                }
                if (ArrayBCName != null && ArrayBCName.length > 0 && (ArrayBCName.length % cp.chart_Data_NRow) != 0) {
                    var temparray = [];
                    var MaxLength = parseInt(ArrayBCName.length / cp.chart_Data_NRow) * cp.chart_Data_NRow;
                    for (var i = 0; i < MaxLength; i++) {
                        temparray.push(ArrayBCName[i]);
                    }
                    ArrayBCName = temparray;
                    temparray = null;
                }
                var jsonData = { "action": "RCalMeanSDPlot",
                    "dataArray": ArrayBCName,
                    "nrow": cp.chart_Data_NRow //获取Nrow数值
                };
                var jsonString = JSON.stringify(jsonData);
                Agi.DAL.ReadData({ "MethodName": "RCalMeanSDPlot", "Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result && _result.result == "true") {

                        var checkDataSeries = []; //{ min: 0, max: `, minValue: 20, maxValue: 280, Names: "甲", Data: [] },
                        switch (cp.chart_Data_Type) {
                            case "样本均值":
                                if (_result.xBar_data && _result.xBar_data.points.length > 0) {
                                    var min = checkDataSeries.length > 0 ? checkDataSeries[checkDataSeries.length - 1].max : 0;
                                    var max = min + _result.xBar_data.points.length;
                                    checkDataSeries.push({
                                        Names: "样本均值",
                                        min: min,
                                        max: max,
                                        minValue: _result.xBar_data.LCL,
                                        middleValue: _result.xBar_data.xBarBar,
                                        maxValue: _result.xBar_data.UCL,
                                        Data: _result.xBar_data.points
                                    })
                                    cp.chart_MarginRight = 90;
                                    cp.xAxis_Auxiliary_Enabled = false;
                                    cp.yAxis_Auxiliary_Enabled = true;
//                                    cp.series_MinPlotLine_Enabled = true;
//                                    cp.series_MaxPlotLine_Enabled = true;
//                                    cp.series_MiddlePlotLine_Enabled = true;
                                    Me.Set("ChartProperty", cp);
                                    Me.Set("CheckDataSeries", checkDataSeries);
                                    Me.SetChartDataProperty();
                                    Me.InitHighChart();
                                }
                                else {
                                    Me.ReadOtherData("");
                                }
                                break;
                            case "样本标准差":
                                if (_result.SD_data && _result.SD_data.points.length > 0) {
                                    var min = checkDataSeries.length > 0 ? checkDataSeries[checkDataSeries.length - 1].max : 0;
                                    var max = min + _result.SD_data.points.length;
                                    checkDataSeries.push({
                                        Names: "样本标准差",
                                        min: min,
                                        max: max,
                                        minValue: _result.SD_data.LCL,
                                        middleValue: _result.SD_data.SDBar,
                                        maxValue: _result.SD_data.UCL,
                                        Data: _result.SD_data.points
                                    })
                                    cp.chart_MarginRight = 90;
                                    cp.xAxis_Auxiliary_Enabled = false;
                                    cp.yAxis_Auxiliary_Enabled = true;
//                                    cp.series_MinPlotLine_Enabled = true;
//                                    cp.series_MaxPlotLine_Enabled = true;
//                                    cp.series_MiddlePlotLine_Enabled = true;
                                    Me.Set("ChartProperty", cp);
                                    Me.Set("CheckDataSeries", checkDataSeries);
                                    Me.SetChartDataProperty();
                                    Me.InitHighChart();
                                }
                                else {
                                    Me.ReadOtherData("");
                                }
                                break;
                            default:
                                Me.ReadOtherData("");
                                break;
                        }
                    }
                    else {
                        Me.ReadOtherData("");
                    }
                }
                });
            }
        },
        AddEntity: function (_entity) {
            var Me = this;
            if (_entity.Data && _entity.Data.length <= 0) {
                this.ReadOtherData("");
                return;
            }

            this.AddEntitySingle(_entity);
            //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(Me);//更新实体数据显示
            }
        },
        ParameterChange: function (_ParameterInfo) {
            var Me = this;
            var entity =[];
            var _EntityInfo= this.Get("Entity")[0];
            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                d.Data=Agi.Controls.DataConvertManager.DataInterception(d.Data,1000);
                _EntityInfo.Data=Me.DataSortByGrpName(d.Data);
                if(d.Columns!=null && d.Columns.length>0){
                    _EntityInfo.Columns = d.Columns;
                }
                entity.push(_EntityInfo);
                Me.Set("Entity", entity);

                Me.AddEntity(entity[0]); /*添加实体*/
                Me.chageEntity = true;
            });
        }, //参数联动
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.Set("dataGridArray", []);
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "CustomBoxChart");
            this.Set('IntervalID', null); //预先保存定时器ID
            this.Set("ChartParameters", { Key: false, Points: [] }); //预先保存结构
            this.Set("ChartCurrentData", []); //设置及时刷新数据显示
            this.Set("PointsParamerters", []); //注册数据点位号保存，点位号集合，结构["11AE84102","11AE84015","11AE84103"]
            var ID = savedId ? savedId : "CustomBoxChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty SPCPanelSty'></div>");

            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };

            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: PagePars.Width,
                height: PagePars.Height,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:100%;margin: 0 auto;border:solid 1px #dcdcdc;">' + '</div>');
            this.shell.initialControl(BaseControlObj);
            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            this.Set("ProPerty", ThisProPerty);
            this.Set("ThemeInfo", null);
            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(450);
                HTMLElementPanel.height(200);
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
            //测试数据
            this.ReadOtherData("");
            //            this.SetChartDataProperty();
            //            //追加图形控件至画框
            //            this.InitHighChart();

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
                    minHeight: 200,
                    minWidth: 350
                });
            }
            //20130515 倪飘 解决bug，组态环境中拖入单值图控件以后拖入容器框控件，容器框控件会覆盖单值图控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);

            self.ShowDataTable();//显示默认数据表格
        },//end Init
        GetYValue: function () {
            var cp = this.Get('ChartProperty');
            var result = parseInt((cp.yAxis_PlotLines_Max - cp.yAxis_PlotLines_Min) / 3);
            return result <= 0 ? 1 : result;
        },
        SetChartProperty: function (_objCanvasAreaID) {//初始化定义图形控件属性结构，并预设值属性，_objCanvasAreaID：画布显示区域ID
            //图形基本结构定义
            var chartProperty = {
                chart_Data_Type: "单独值",
                chart_Data_NRow: 6,
                chart_PointNumber: 20, //当前图形范围所显示的点位
                chart_RenderTo: _objCanvasAreaID, //画布ID
                chart_Type: 'boxplot', //'spline',//显示图形
                chart_MarginTop: 30, //图形距画框右边距距离
                chart_MarginRight: 80, //图形距画框右边距距离
                chart_Reflow: true, //图形是否跟随放大
                chart_Animation: false, //动画平滑滚动
                chart_PlotBorderWidth: 1, //数据图表区域边框宽度
                chart_PlotBorderColor: "black", //数据图表区域边框颜色
                chart_BackgroundColor: "white", //"#C9E8E2",//数据图表区域颜色
                chart_Title_Text: '', //标题文字
                Axis_TickColor: "black", //轴线刻度颜色
                xAxis_Auxiliary_Enabled: true, //X轴是否显示副轴
                yAxis_Auxiliary_Enabled: true, //Y轴是否显示副轴
                xAxis_Type: 'datetime', //X轴数据类型
                xAxis_TickWidth: 1, //X轴刻度宽度
                xAxis_TickWidth2: 0, //X轴刻度宽度
                xAxis_TickPosition: "outside", //X轴线刻度朝向
                xAxis_TickPixelInterval: 100, //X轴数据间隔
                xAxis_TickInterval2: 1, //伪X轴刻度间隔大小
                xAxis_Reversed: false, //数据滚动方向
                xAxis_LineWidth: 0, //X轴轴线宽度
                xAxis_PlotLines: [], //参考线位置，计算取得
                xAxis_PlotLines_LineColor: "blue", //参考线颜色
                xAxis_PlotLines_LineWidth: 1, //参考线宽度
                xAxis_PlotLines_DashStyle: "longdash", //X轴参考线显示类型 longdash：虚线
                xAxis_LinkedTo: 0, //未知，用于第二X轴，伪轴显示
                xAxis_Opposite: true, //是否相反方向显示
                xAxis_TickPositions: [], //显示X轴线指定值
                yAxis_TickPositions: [], //显示Y轴线指定值
                yAxis_Title_Text: 'SPC箱线图', //'单独值', //Y轴标题文字
                //yAxis_Title_Margin: 50,//Y轴TITLE左边距
                yAxis_Min: 0, //Y轴最小值
                yAxis_Max: 280, //Y轴最大值
                yAxis_PlotLines_Max: 0, //数据最大值
                yAxis_PlotLines_Min: 0, //数据最小值
                yAxis_GridLineWidth: 0, //Y轴表格线宽度显示
                yAxis_LineWidth: 0, //X轴轴线宽度
                yAxis_TickWidth: 1,
                yAxis_TickPosition: "outside",
                series_MinPlotLine_Color: "#f41d12", //最低参考线颜色
                series_MinPlotLine_Enabled: true, //是否显示最低参考线
                series_MinPlotLine_Names: "LCL", //是否显示最低参考线 markeluo 20121126 LCL与UCL 写反了
                series_MiddlePlotLine_Color: "green", //中间值参考线颜色
                series_MiddlePlotLine_Enabled: true, //是否显示中间参考线
                series_MiddlePlotLine_Names: "XBar", //是否显示最低参考线
                series_MaxPlotLine_Color: "#f41d12", //最大参考线颜色
                series_MaxPlotLine_Enabled: true, //是否显示最大参考线
                series_MaxPlotLine_Names: "UCL", //是否显示最低参考线 markeluo 20121126 LCL与UCL 写反了
                series_MinPlotLine_LineWidth: 1, //最低参考线宽度
                series_MiddlePlotLine_LineWidth: 1, //中间值参考线宽度
                series_MaxPlotLine_LineWidth: 1, //最高参考线宽度
                series_Data_LineWidth: 0.5, //数据线线条粗细
                tooltip_enabled: true, //是否显示提示框
                plotOptions_Spline_Marker_enabled: true, //MARKER点位是否显示
                plotOptions_Spline_Marker_Radius: 2, //MARKER点位样式大小设置
                plotOptions_Spline_Marker_Symbol: 'circle', //数据线点位样式
                legend_enabled: false, //是否显示名片
                exporting_enabled: false, //是否显示打印和下载图片
                credits_enabled: false, //是否显示出品人
                navigation_menuItemStyle_fontSize: '10px',//NULL
                series_DataColor: '#d2d2d2', //20130817 12:01 markeluo修改 数据线颜色
                series_PointMarkerColor: '#4572A7', //20130817 12:01 markeluo 添加 数据线颜色
                SeriesGroupColumn: "",//20130817 12:01 markeluo 添加 曲线分组列
                SeriesDataColumn: [],//20130817 12:01 markeluo 添加 曲线数据列(可能为多列)
                ChartisigmaValue: 3,//20130817 12:01 markeluo 添加 西格玛系数
                ChartisigmaLineVisible: true,//20130916 西格玛线是否显示
                yAxis_PlotLines_MinMarkerColor: '#f41d12', //西格玛 上限颜色
                yAxis_PlotLines_MaxMarkerColor: '#f41d12' //西格玛 下限颜色
            };
            this.Set('ChartProperty', chartProperty); //保存属性结构
        },
        SetChartDataProperty: function () {//数据基本结构定义，在警戒范围中生成模拟数据
            var cp = this.Get('ChartProperty');
            var checkDataSeries = this.Get('CheckDataSeries');
            cp.xAxis_PlotLines = [];
            cp.yAxis_PlotLines_Max = -999999;
            cp.yAxis_PlotLines_Min = 999999;
            cp.xAxis_TickPositions = [];
            cp.yAxis_TickPositions = [];
            var chartSeries = [];
            {//数据结构生成
                var dataMin = [];
                var dataMiddle = [];
                var dataMax = [];
                var seriesMinValue = 0;
                var seriesMiddleValue = 0;
                var seriesMaxValue = 0;
                for (var i = 0; i < checkDataSeries.length; i++) {
                    var obj = checkDataSeries[i];

                    obj.Data = GetData(obj); //获取模拟数据

                    dataMin.push([obj.min, obj.minValue]);
                    dataMin.push([obj.max, obj.minValue]);
                    if (i != checkDataSeries.length - 1) dataMin.push(null);

                    dataMiddle.push([obj.min, obj.middleValue]);
                    dataMiddle.push([obj.max, obj.middleValue]);
                    if (i != checkDataSeries.length - 1) dataMiddle.push(null);

                    dataMax.push([obj.min, obj.maxValue]);
                    dataMax.push([obj.max, obj.maxValue]);
                    if (i != checkDataSeries.length - 1) dataMax.push(null);

                    if (i === checkDataSeries.length - 1) {
                        seriesMinValue = obj.minValue;
                        seriesMiddleValue = obj.middleValue;
                        seriesMaxValue = obj.maxValue;

                        cp.yAxis_TickPositions.push(seriesMinValue);
                        cp.yAxis_TickPositions.push(seriesMiddleValue);
                        cp.yAxis_TickPositions.push(seriesMaxValue);
                    }
                    cp.yAxis_PlotLines_Max = cp.yAxis_PlotLines_Max > obj.maxValue ? cp.yAxis_PlotLines_Max : obj.maxValue;
                    cp.yAxis_PlotLines_Min = cp.yAxis_PlotLines_Min < obj.minValue ? cp.yAxis_PlotLines_Min : obj.minValue;
                }
                this.Set('SeriesMinValue', seriesMinValue);
                this.Set('SeriesMiddleValue', seriesMiddleValue);
                this.Set('SeriesMaxValue', seriesMaxValue);
                function GetData(objValue) {
                    var minValue = objValue.minValue;
                    var maxValue = objValue.maxValue;
                    var objData = [];
                    for (var i = 1; i <= objValue.Data.length; i++) {
                        var x = objValue.min + i;
                        var y = objValue.Data[i - 1];
                        if (y > maxValue)
                            y = { x: x, y: y, marker: { fillColor: cp.yAxis_PlotLines_MaxMarkerColor} };
                        else if (y < minValue)
                            y = { x: x, y: y, marker: { fillColor: cp.yAxis_PlotLines_MinMarkerColor} };
                        else
                            y = { x: x, y: y, marker: { fillColor: cp.series_PointMarkerColor} }
                        objData.push(y);
                    }
                    return objData;
                }
            }
            {//生成数据
                var seriesData = [];
                for (var i = 0; i < checkDataSeries.length; i++) {
                    var obj = checkDataSeries[i];
                    seriesData = seriesData.concat(obj.Data);
                    //seriesData = seriesData.concat(null);
                    cp.xAxis_TickPositions.push(obj.min);
                    if (i === 0) continue;
                    cp.xAxis_PlotLines.push({
                        color: cp.xAxis_PlotLines_LineColor,
                        width: cp.xAxis_PlotLines_LineWidth,
                        value: obj.min,
                        dashStyle: cp.xAxis_PlotLines_DashStyle
                    });
                }
                for (var i = 0; i < seriesData.length; i++) {
                    var obj = seriesData[i];
                    if (obj) {
                        cp.yAxis_PlotLines_Max = cp.yAxis_PlotLines_Max > obj.y ? cp.yAxis_PlotLines_Max : obj.y;
                        cp.yAxis_PlotLines_Min = cp.yAxis_PlotLines_Min < obj.y ? cp.yAxis_PlotLines_Min : obj.y;
                    }
                }
            }
            {//配置数据属性
                if (cp.series_MinPlotLine_Enabled) {
                    chartSeries.push({
                        name: "min",
                        data: dataMin,
                        color: cp.yAxis_PlotLines_MinMarkerColor,
                        lineWidth: cp.series_MinPlotLine_LineWidth,
                        marker: {
                            enabled: false
                        }
                    });
                }
                if (cp.series_MiddlePlotLine_Enabled) {
                    chartSeries.push({
                        name: "middle",
                        data: dataMiddle,
                        color: cp.series_MiddlePlotLine_Color,
                        lineWidth: cp.series_MiddlePlotLine_LineWidth,
                        marker: {
                            enabled: false
                        }
                    });
                }
                if (cp.series_MaxPlotLine_Enabled) {
                    chartSeries.push({
                        name: "max",
                        data: dataMax,
                        color: cp.yAxis_PlotLines_MaxMarkerColor,
                        lineWidth: cp.series_MaxPlotLine_LineWidth,
                        marker: {
                            enabled: false
                        }
                    });
                }

                if (cp.chart_Data_Type == "样本均值" || cp.chart_Data_Type == "样本标准差") {//类型为面积
                    chartSeries.push({
                        name: 'A',
                        data: seriesData,
                        type: "area",
                        //color:"#76AD73",//"#D9EEDB",
                        lineWidth: cp.series_Data_LineWidth,
                        marker: {
                            color: cp.series_PointMarkerColor //cp.series_PointMarkerColor,
                        }
                    });
                }
                else {
                    chartSeries.push({
                        name: 'A',
                        data: seriesData,
                        color: cp.series_DataColor, //cp.series_DataColor,
                        lineWidth: cp.series_Data_LineWidth,
                        marker: {
                            color: cp.series_PointMarkerColor //cp.series_DataColor,
                        }
                    });
                }
                this.Set('ChartSeries', chartSeries);
            }
        },
        PointClickEvent: function (_PointValue, _MenuType) {
            //{name:this.name,x:this.x,y:this.y,Time:点击时间}
            var Me = this;
            if (_MenuType != null && _MenuType != "") {
                switch (_MenuType) {
                    case 1:
                        Me.PointClick(_PointValue);
                        break;
                    case 2:
                        Me.PointDbClick(_PointValue);
                        break;
                    case 3:
                        // Me.PointPress(_PointValue);//数据钻取
                        break;
                    default :
                        break;
                }
            }
        },//Point点击处理
        PointClick: function (_PointValue) {
            var columnName = this.chartOptions.xAxis.categories[_PointValue.x].split("-");
            var columnData = _PointValue.y;
            //
            var PointRow = _PointValue.x - 1;
            var Me = this;
            var cp = Me.Get('ChartProperty');
            var GridData = {
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells: [], //报警点信息
                AbnormalRows: []//所选的异常点
            };
            //
            for (var i = 0; i < GridData.ChartData.length; i++) {
                var cdata = GridData.ChartData[i];
                //
                var adds=[];
                for (var j = 1; j < columnName.length; j++) {
                    var dataOthers = columnName[j];
                    for (var tempColumn in cdata) {
                        if(cdata[tempColumn]===dataOthers){
                            adds.push("has");
                        }
                    }
                }
                //
                if(cdata[columnName[0]]===(columnData+"") && adds.length===(columnName.length-1)){
                    GridData.AbnormalRows=[i];
                }
            }
            //
            var ThisDataSeries = Me.GetDataSeries();//获取当前曲线信息
            if (ThisDataSeries != null && ThisDataSeries.length > 0) {
                for (var i = 0; i < ThisDataSeries.length; i++) {
                    Agi.Controls.CustomSigChartAlarmDataPointsFind(GridData, cp.SeriesDataColumn[i], ThisDataSeries[i], cp.series_PointMarkerColor);
                }
            }
            Agi.view.advance.refreshGridData(GridData);//调用View框架的定位源数据功能
        },//单击,1.源数据定位
        PointDbClick: function (_PointValue) {
            var Me = this;
            //{name:this.name,x:this.x,y:this.y,Time:点击时间}
            var FilterData = Me.Get("FilterData");
            var RowData = null;
            if (FilterData != null && FilterData.length > (_PointValue.x - 1)) {
                RowData = FilterData[_PointValue.x - 1];
                //Me.Abnormalpoint.AbnormalpointFrame(RowData);
                agi.using([  '../../customizePage/Abnormalpoint'],
                    function (Abnormalpoint) {
                        //异常点面板相关代码与控件建立连接关系
                        Me.Abnormalpoint = Abnormalpoint;
                        Me.Abnormalpoint.AbnormalpointFrame(RowData);
                    });
            }
        },//双击,2异常点存入数据库
        PointPress: function (_PointValue) {
            var Me = this;
            var FilterData = Me.Get("FilterData");
            var rowData = null;
            if (FilterData != null && _PointValue != null && _PointValue.x > 0 && FilterData.length > 0) {
                rowData = FilterData[_PointValue.x - 1];
            }
            if (rowData != null) {
                Me.RefinementData(rowData);
            }
        },//长按,3数据钻取
        InitHighChart: function () {//初始化图形控件

            if (true) {
                chart = new Highcharts.Chart(this.chartOptions);
                this.Set('chart', chart);
                this.chart = chart;
                return;
            }
            //
            var Me = this;
            var cp = this.Get('ChartProperty');
            var checkDataSeries = this.Get('CheckDataSeries');
            var yValue = this.GetYValue();
            if (cp.chart_Data_Type == "样本标准差") {
                cp.yAxis_Min = 0;
            }
            else {
                cp.yAxis_Min = cp.yAxis_PlotLines_Min - yValue / 4;
            }
            cp.yAxis_Max = cp.yAxis_PlotLines_Max + yValue / 4;
            var seriesMinValue = this.Get('SeriesMinValue');
            var seriesMiddleValue = this.Get('SeriesMiddleValue');
            var seriesMaxValue = this.Get('SeriesMaxValue');
            var chartSeries = this.Get('ChartSeries');
            {//轴线属性设置
                var xAxis = [];
                xAxis.push({
                    tickWidth: cp.xAxis_TickWidth,
                    tickPixelInterval: cp.xAxis_TickPixelInterval,
                    reversed: cp.xAxis_Reversed,
                    lineWidth: cp.xAxis_LineWidth,
                    tickColor: cp.Axis_TickColor,
                    tickPosition: cp.xAxis_TickPosition,
                    plotLines: cp.xAxis_PlotLines
                });
                if (cp.xAxis_Auxiliary_Enabled) {
                    xAxis.push({
                        lineWidth: cp.xAxis_LineWidth,
                        linkedTo: cp.xAxis_LinkedTo,
                        opposite: cp.xAxis_Opposite,
                        tickWidth: cp.xAxis_TickWidth2,
                        //tickInterval: cp.xAxis_TickInterval2,
                        tickPositions: cp.xAxis_TickPositions,
                        labels: {
                            formatter: function () {
                                for (var i = 0; i < checkDataSeries.length; i++) {
                                    var obj = checkDataSeries[i];
                                    if (obj.min === this.value) return '<b>' + "　　" + obj.Names + '</b>';
                                }
                                return "";
                            }
                        }
                    });
                }
                var yAxis = [];
                yAxis.push({
                    lineWidth: cp.yAxis_LineWidth,
                    title: {
                        //margin:cp.yAxis_Title_Margin,
                        text: cp.yAxis_Title_Text
                    },
                    min: cp.yAxis_Min,
                    max: cp.yAxis_Max,
                    gridLineWidth: cp.yAxis_GridLineWidth,
                    tickInterval: yValue,
                    tickWidth: cp.yAxis_TickWidth,
                    tickColor: cp.Axis_TickColor,
                    tickPosition: cp.yAxis_TickPosition, labels: {
                        formatter: function () {
                            return getYValue(this.value.toString());
                            function getYValue(_value) {
                                if (_value.length < 5) {
                                    return getYValue("　" + _value);
                                }
                                return _value;
                            }
                        }
                    }
                });
                if (cp.yAxis_Auxiliary_Enabled) {
                    yAxis.push({
                        lineWidth: cp.yAxis_LineWidth,
                        linkedTo: cp.xAxis_LinkedTo,
                        opposite: cp.xAxis_Opposite,
                        gridLineWidth: cp.yAxis_GridLineWidth,
                        //tickInterval: cp.xAxis_TickInterval2,
                        tickWidth: cp.xAxis_TickWidth2,
                        tickPosition: cp.Axis_TickColor,
                        tickPositions: cp.yAxis_TickPositions,
                        title: "",
                        labels: {
                            formatter: function () {
                                switch (this.value) {
                                    case seriesMinValue:
                                        if (cp.series_MinPlotLine_Enabled)
                                            return cp.series_MinPlotLine_Names + "=" + seriesMinValue;
                                        break;
                                    case seriesMiddleValue:
                                        if (cp.series_MiddlePlotLine_Enabled)
                                            return cp.series_MiddlePlotLine_Names + "=" + seriesMiddleValue;
                                        break;
                                    case seriesMaxValue:
                                        if (cp.series_MaxPlotLine_Enabled)
                                            return cp.series_MaxPlotLine_Names + "=" + seriesMaxValue;
                                        break;
                                }
                                return "";
                            }
                        }
                    });
                }
            }
            if (chartSeries && chartSeries && cp.chart_RenderTo) {
                Highcharts.setOptions({
                    global: {
                        useUTC: false//不使用夏令时
                    }
                });
                var series, chart;
                //
                if (!this.chart) {
                    //
                    chartSeries.length = 0;
                    chartSeries.push({
                        data: [
                            [760, 801, 848, 895, 965],
                            [733, 853, 939, 980, 1080],
                            [714, 762, 817, 870, 918],
                            [724, 802, 806, 871, 950],
                            [834, 836, 864, 882, 910]
                        ]
                    });
                }
                //
                chart = new Highcharts.Chart({
                    chart: {
                        animation: cp.chart_Animation,
                        renderTo: cp.chart_RenderTo,
                        //type: cp.chart_Type,
                        type: "boxplot",
                        marginTop: cp.chart_MarginTop,
                        marginRight: cp.chart_MarginRight,
                        plotBorderWidth: cp.chart_PlotBorderWidth,
                        plotBorderColor: cp.chart_PlotBorderColor,
                        backgroundColor: cp.chart_BackgroundColor,
                        events: {
                            redraw: function () {
                                //                                var series=Me.GetDataSeries(); //得到数据曲线series
                                //                                var MeDataGridArray=Me.Get("dataGridArray");
                                //                                for(var i=0;i<Me.chart.series.length;i++){
                                //                                    if(Me.chart.series[i].color==series[0].color){
                                //                                        MeDataGridArray=Me.bingDataGuid(Me,series[0]);
                                //                                        break;
                                //                                    }
                                //
                                //                                }
                                //                                Me.Set("dataGridArray",MeDataGridArray);
                            },
                            load: function () {

                            }
                        }
                    },
                    colors: ["#76AD73"],
                    title: {
                        text: cp.chart_Title_Text
                    },
                    xAxis: xAxis,
                    yAxis: yAxis,
                    plotOptions: {
                        spline: {
                            marker: {
                                enabled: cp.plotOptions_Spline_Marker_enabled,
                                color: "black",
                                radius: cp.plotOptions_Spline_Marker_Radius,
                                symbol: cp.plotOptions_Spline_Marker_Symbol
                            }
                        },
                        line: {
                            marker: {
                                enabled: cp.plotOptions_Spline_Marker_enabled,
                                color: "black",
                                radius: cp.plotOptions_Spline_Marker_Radius,
                                symbol: cp.plotOptions_Spline_Marker_Symbol
                            }
                        },
                        area: {
                            marker: {
                                enabled: cp.plotOptions_Spline_Marker_enabled,
                                color: "black",
                                radius: cp.plotOptions_Spline_Marker_Radius,
                                symbol: cp.plotOptions_Spline_Marker_Symbol
                            }
                        },
                        series: {
                            point: {
                                events: {
                                    click: function (e) {
                                        if (!Agi.Edit) {
                                            var PointObj = this;
                                            if (PointObj.series.name != "min" && PointObj.series.name != "max"
                                                && PointObj.series.name != "middle" && PointObj.series.name != null) {
                                                $('#pointMenu').css('top', e.clientY + 5);
                                                $('#pointMenu').css('left', e.clientX - 15);
                                                $('#pointMenu').show().find("li").unbind("click").bind("click", function (event) {
                                                    Me.PointClickEvent({name: PointObj.series.name, x: PointObj.x, y: PointObj.y, Time: new Date()}, $(this).data("menutype"));
                                                    $('#pointMenu').hide();
                                                    event.stopPropagation();
                                                });
                                                $('#pointMenu').find(".dropdown-menu").show();
                                                $('.highcharts-container').unbind('click').bind('click', function () {
                                                    $('#pointMenu').hide();
                                                });
                                            }
                                            //endregion  markeluo 20130821 0846 markeluo 点击Chart Point菜单处理 #end
                                        }
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        enabled: cp.tooltip_enabled,
                        formatter: function () {
                            if (this.series.name === "min")
                                return '<b>' + cp.series_MinPlotLine_Names + '=' + this.y + '</b>';
                            if (this.series.name === "middle")
                                return '<b>' + cp.series_MiddlePlotLine_Names + '=' + this.y + '</b>';
                            if (this.series.name === "max")
                                return '<b>' + cp.series_MaxPlotLine_Names + '=' + this.y + '</b>';
                            var name = "";
                            for (var i = 0; i < checkDataSeries.length; i++) {
                                if (this.x >= checkDataSeries[0].min && this.x <= checkDataSeries[0].max) {
                                    name = checkDataSeries[i].Names;
                                    break;
                                }
                                if (this.x > checkDataSeries[i].min && this.x <= checkDataSeries[i].max) {
                                    name = checkDataSeries[i].Names;
                                    break;
                                }
                            }
                            return this.x + ' , <b>' + name + ': ' + this.y + '</b>';
                        }
                    },
                    legend: {
                        enabled: cp.legend_enabled
                    },
                    exporting: {
                        enabled: cp.exporting_enabled
                    },
                    series: chartSeries,
                    credits: {
                        enabled: cp.credits_enabled
                    }
                });

                this.Set('chart', chart);
                this.chart = chart;
            }

//            this.UpPlotLineGroups([
//                {GroupName:"标准线1",MaxSize:1,MaxColor:'#04faf7',MaxValueType:0,MaxValue:32000,MinSize:1,MinColor:'#fa0df2',MinValueType:0,MinValue:25000},
//                {GroupName:"标准线2",MaxSize:1,MaxColor:'#04fe45',MaxValueType:0,MaxValue:29000,MinSize:1,MinColor:'#fbf806',MinValueType:0,MinValue:25800}]);//添加标准线
            Me.ShowALLPlotLineGroup();
            if (Me.Get("IsUpdateViewGrid")) {
                Agi.view.advance.refreshGridData(Me.GetSPCViewGridData());//调用View框架刷新数据表格显示
                Me.Set("IsUpdateViewGrid", false);
            }
        },
        bingDataGuid: function (control, series) {
            var chart = control.chart;
            var grid = control.grid;
            var data = control.theConfig;
            var array = [];
            var markerColor = '#4572A7';
            if (data != undefined) {
                markerColor = data.dataLine.markerColor;
            }
            var ent = control.Get('Entity')[0];
            var ChartProperty = control.Get("ChartProperty");
            for (var i = 0; i < series.data.length; i++) {
                if (series.data[i].marker.fillColor != markerColor) {
                    var ob = {
                        row: i,
                        color: series.data[i].marker.fillColor,
                        column: ChartProperty.SeriesDataColumn[0],
                        cle: -1
                    };

                    if (ent != undefined) {
                        for (var j = 0; j < ent.Columns.length; j++) {
                            if (ent.Columns[j] == ChartProperty.SeriesDataColumn[0]) {
                                ob.cle = j;
                                break;
                            }
                        }
                    }
                    array.push(ob);
                }
            }
            return array
        },//更新数据表格
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.CustomBoxChartProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
//            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewSPCSingleChart = Agi.Controls.InitSPCSingleChart();
                NewSPCSingleChart.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewSPCSingleChart;
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
        },
        Refresh: function () {
            var Me = this;
            var ThisHTMLElement = $(this.Get("HTMLElement"));
            var ParentObj = ThisHTMLElement.parent();
            if (!ParentObj.length) {
                return;
            }
            if (!Agi.Edit) {
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
                ThisHTMLElement.css("left", (parseInt(PostionValue.Left * PagePars.Width)) + "px");
                ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
            } else {
                var ThisControlObj = Me.Get('chart');
                ThisControlObj.setSize(ThisHTMLElement.width(), ThisHTMLElement.height());
                /*Chart 更改大小*/
            }
            $(window).resize();
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
        },
        EnterEditState: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css({ "width": '100%', "height": '100%' });

            //this.ShowDeleteSeries(this);
            //框架重新设置
            $(window).resize();
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            //框架重新设置
            $(window).resize();
        },
        InEdit: function () {
            var Me = this;
            Me.UnChecked();
            Me.Refresh(); //重新刷新显示
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.CustomBoxChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var SPCSingleChartControl = {
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
                    EntityInfo: null,//实体信息
                    ThemeInfo: null,//主题
                    DataExtractConfig: null//数据钻取配置
                }
            }
            SPCSingleChartControl.Control.ControlType = this.Get("ControlType");
            SPCSingleChartControl.Control.ControlID = ProPerty.ID;
            SPCSingleChartControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            SPCSingleChartControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
//            $(Entitys).each(function (i, e) {
//                e.Data = null;
//            });
            SPCSingleChartControl.Control.Entity = Entitys;
            SPCSingleChartControl.Control.BasicProperty = this.Get("BasicProperty");
            SPCSingleChartControl.Control.ChartProperty = this.Get("ChartProperty");
            SPCSingleChartControl.Control.ChartSeries = this.Get("ChartSeries");
            SPCSingleChartControl.Control.PointsParamerters = this.Get("PointsParamerters");
            SPCSingleChartControl.Control.Position = this.Get("Position");
            SPCSingleChartControl.Control.EntityInfo = this.Get("EntityInfo");
            SPCSingleChartControl.Control.ThemeInfo = this.Get("ThemeInfo");
            //单值图新增属性
            SPCSingleChartControl.Control.SigmaRule = this.Get("Sigmrules");//西格玛规则
            SPCSingleChartControl.Control.StandardLines = this.Get("NoFormatPlotLines");//标准线
            SPCSingleChartControl.Control.Ware = this.Get("WarnRule");//特殊报警
            SPCSingleChartControl.Control.DataExtractConfig = this.Get("ExtractConfig");//数据钻取规则

            return SPCSingleChartControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                var chartProperty = null;
                var chartSeries = null;
                var pointsParamerters = [];
                var entityInfo = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.Entity = _Config.Entity;
                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);
                    _Config.ThemeInfo = _Config.ThemeInfo;
                    chartProperty = _Config.ChartProperty;
                    this.Set("ChartProperty", chartProperty);
                    chartSeries = _Config.ChartSeries;
                    this.Set("ChartSeries", chartSeries);
                    pointsParamerters = _Config.PointsParamerters;
                    this.Set("PointsParamerters", pointsParamerters);
                    entityInfo = _Config.EntityInfo;
                    this.Set("EntityInfo", entityInfo);

                    this.Set("Sigmrules", _Config.SigmaRule);//西格玛规则
                    this.UpPlotLineGroups(_Config.StandardLines);//标准线
                    this.Set("WarnRule", _Config.Ware);//特殊报警
                    this.Set("ExtractConfig", _Config.DataExtractConfig);//数据钻取规则


                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height() };
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

                    //测试数据
                    this.ReadData(entityInfo);
                }
            }
        }, //根据配置信息创建控件
        BindClickForGridRow: function () {
            var self = this;
            var DataDrillState = self.Get("DataDrillState");//是否可以钻取
            if (DataDrillState != null && DataDrillState == false) {
            } else {
                if (self.grid) {
                    self.grid.find('tbody>tr').unbind('click').bind('click', function () {
                        var cells = self.grid.wijgrid("columns");
                        var rowData = {};
                        var tr = $(this);
                        for (var i = 0; i < cells.length; i++) {
                            rowData[cells[i].options.dataKey] = tr.find('td:eq(' + i + ')')[0].innerText.trim();
                        }

//                    alert(JSON.stringify(rowData));
                        self.RefinementData(rowData);
                    });
                }
            }
        },
        SPCViewMenus: function () {
            var Me = this;
            var viewmenus = [];
            viewmenus.push({Title: "数据符号和连线显示", MenuImg: "ViewMenuImages/checkboxfull.png", CallbackFun: Me.SPCViewStandLineMenu});
            return viewmenus;
        },//SPC控件支持View框架，控件菜单显示
        SPCViewStandLineMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("数据符号和连线显示");
            $(_Panel).find(".content").height(185);
            Agi.Controls.CustomBoxChartView_dataViewAdv(_Panel, Me);
            _CallFun();
        },//SPC控件View，标准线
        SPCViewSigmaMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 450,
                height: "auto",
                right: -460
            }).find(".title").text("西格玛判异");
            $(_Panel).find(".content").height(328);
            Agi.Controls.CustomBoxChartView_dataColumns(_Panel, Me);
            _CallFun();
        },//SPC控件View，西格玛设置
        SPCViewDataExtractMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 380,
                height: "auto",
                right: -400
            }).find(".title").text("数据钻取配置");
            $(_Panel).find(".content").height(200);
            Agi.Controls.CustomSigChartView_ExtractMenu(_Panel, Me);
            _CallFun();
        },//SPC控件View，数据钻取
        SPCViewSpecialAlarmMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                "width": "340px",
                "height": "auto",
                right: -350
            }).find(".title").text("特殊报警");
            $(_Panel).find(".content").height(102);
            Agi.Controls.CustomSigChartView_SpecialAlarmMenu(_Panel, Me);
            _CallFun();
        },//SPC控件View，特殊报警
        GetSPCViewGridData: function () {
            var Me = this;
            var cp = Me.Get('ChartProperty');
            var GridData = {
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells: [], //报警点信息
                AbnormalRows: []//所选的异常点
            };
            var ThisDataSeries = Me.GetDataSeries();//获取当前曲线信息
            if (ThisDataSeries != null && ThisDataSeries.length > 0) {
                for (var i = 0; i < ThisDataSeries.length; i++) {
                    Agi.Controls.CustomSigChartAlarmDataPointsFind(GridData, cp.SeriesDataColumn[i], ThisDataSeries[i], cp.series_PointMarkerColor);
                }
            }
            return GridData;
        },//SPC控件支持View框架，控件显示源数据
        SPCViewRefreshByGridData: function (_GridData) {
            var Me = this;
            Me.Set("FilterData", _GridData);
            //Me.ChartLoadByData(_GridData);//重新加载数据
            //Me.Set("IsShowLastChart", true);
            //显示对照图表

            //setTimeout(Agi.Controls.CustomSigChartLastChartShowExE(Me),2000);
            /* Agi.Controls.CustomSigChartLastChartShow(Me);
             if (Me.Get("LastChartImgIsExt")) {
             Me.RefreshByProPanelUp();//更新显示
             } else {
             setTimeout(Agi.Controls.CustomSigChartRefreshShowExe(Me), 2000);//更新显示
             }*/
            //Me.RefreshByProPanelUp();//更新显示
        },//SPC控件支持View框架，编辑源数据后更新控件显示
        SPCViewDataRestore: function () {
            var Me = this;
            var entity = Me.Get('Entity')[0];
            var data = entity.Data;
            var Filterdata = [];
            for (var i = 0; i < data.length; i++) {
                Filterdata.push(data[i]);
            }

            Me.Set("FilterData", Filterdata);
            Me.Set("IsUpdateViewGrid", true);

            //Me.ChartLoadByData(Filterdata);//重新加载数据
            Agi.Controls.CustomSigChartLastChartShowMenu(Me, false);//还原数据后，清除原对照图
            Me.Set("LastChartImgIsExt", false);

            Me.RefreshByProPanelUp();//更新显示
        },//SPC控件支持View框架，还原至原始数据
        SPCViewDataExtractURLGet: function (RowData) {
            return this.Get("ExtractConfig");//数据钻取配置信息
        }//数据钻取URL获取，需传入行数据
    }, true);

/*下拉列表控件参数更改处理方法*/
Agi.Controls.CustomBoxChartAttributeChange = function (_ControlObj, Key, _Value) {
    var self = _ControlObj;
    switch (Key) {
        case "Position":
        {
            if (layoutManagement.property.type == 1) {
                var ThisHTMLElementobj = $("#" + _ControlObj.Get("HTMLElement").id);
                var ThisControlObj = self.chart;

                var ParentObj = ThisHTMLElementobj.parent();
                var PagePars = {Width: ParentObj.width(), Height: ParentObj.height()};
                ThisHTMLElementobj.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                ThisHTMLElementobj.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");


                var ThisControlPars = {Width: parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                    Height: parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))};

                ThisHTMLElementobj.width(ThisControlPars.Width);
                ThisHTMLElementobj.height(ThisControlPars.Height);
                ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
                /*Chart 更改大小*/
                ThisControlObj.Refresh();
                /*Chart 更改大小*/


                PagePars = null;
            }
        }
            break;
    } //end switch
} //end

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitCustomBoxChart = function () {
    return new Agi.Controls.CustomBoxChart();
}

Agi.Controls.CustomBoxChartProrityInit = function (_BasicChart) {
    var Me = _BasicChart;
    //取得默认属性
    var cp = Me.Get('ChartProperty');
    var ChartEntity = Me.Get("Entity")[0];
    var ChartEntityColumns = [];
    if (ChartEntity != null && ChartEntity.Columns != null) {
        ChartEntityColumns = ChartEntity.Columns;
    }
    var ChartDataSeries = Me.GetDataSeries();//图表曲线集合，不包含基准线和西格玛线

    //取得页面显示数据属性
    var pointsParameters = Me.Get("PointsParamerters");
    var ThisProItems = [];
    //1.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    {
        var ItemContent;
//
        ItemContent = $("<div id='CSChartDataLine'></div>")
        ItemContent.load('JS/Controls/CustomBoxChart/tabTemplates.html #tab-1', function () {
            //初始化控件
            $(this).find("#CustomBoxChart_fontColor").spectrum({
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
                    ItemContent.find("#CustomBoxChart_fontColor").attr("value", color.toHexString());
                }
            });
            $(this).find("#CustomBoxChart_titleBackground").spectrum({
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
                    ItemContent.find("#CustomBoxChart_titleBackground").attr("value", color.toHexString());
                }
            });
            //读取属性
            var title = $(Me.chartOptions.title.text);
            $(this).find("#CustomBoxChart_title").val(title[0].innerText);
            $(this).find("#CustomBoxChartCustomBoxChart_fontFamily").val(Me.chartOptions.title.style.fontFamily);
            $(this).find("#CustomBoxChart_fontWeight").val(Me.chartOptions.title.style.fontWeight);
            //
            $(this).find("#CustomBoxChart_fontSize").val(parseInt(title.css("font-size")));
            $(this).find("#CustomBoxChart_fontColor").val(Me.chartOptions.title.style.color);
            //
            $(this).find("#CustomBoxChart_titleBackground").val(title.css("background-color"));
            $(this).find("#CustomBoxChart_align").val(Me.chartOptions.title.align);
            $(this).find("#CustomBoxChart_vAlign").val(Me.chartOptions.title.verticalAlign);
            $(this).find("#CustomBoxChart_position").val(Me.chartOptions.title.floating);
            //
            var subtitle = $(Me.chartOptions.subtitle.text.toString());
            $(this).find("#CustomBoxChart_link").val(subtitle[0].href);
            $(this).find("#CustomBoxChart_subtitle").val(subtitle[0].innerText);
            //
            var color1 = Me.chartOptions.title.style.color;
            $(this).find("#CustomBoxChart_fontColor").spectrum("set", color1);
            var color2 = title.css("background-color");
            $(this).find('#CustomBoxChart_titleBackground').spectrum("set", color2);
            //应用更改
            var loadContent = this;
            $(this).find("#CustomBoxChart_titleSave").click(function () {
                //
                //$(this).find("#CustomBoxChart_title").val(Me.chartOptions.title.text);
                Me.chartOptions.title.style.fontFamily = $(loadContent).find("#CustomBoxChartCustomBoxChart_fontFamily").val();
                Me.chartOptions.title.style.fontWeight = $(loadContent).find("#CustomBoxChart_fontWeight").val();
                Me.chartOptions.title.style.fontSize = $(loadContent).find("#CustomBoxChart_fontSize").val() + "px";
                Me.chartOptions.title.style.color = $(loadContent).find("#CustomBoxChart_fontColor").val();
                //
                Me.chartOptions.title.text = $("<p></p>").append(
                    title.clone().css("background-color", $(loadContent).find("#CustomBoxChart_titleBackground").val())
                        .css("font-size", $(loadContent).find("#CustomBoxChart_fontSize").val() + "px")
                ).html();
                Me.chartOptions.title.align = $(loadContent).find("#CustomBoxChart_align").val();
                Me.chartOptions.subtitle.align = $(loadContent).find("#CustomBoxChart_align").val();
                Me.chartOptions.title.verticalAlign = $(loadContent).find("#CustomBoxChart_vAlign").val();
                Me.chartOptions.subtitle.verticalAlign = $(loadContent).find("#CustomBoxChart_vAlign").val();
                Me.chartOptions.title.floating = JSON.parse($(loadContent).find("#CustomBoxChart_position").val());
                //
                var subtitle = $("<a target='_blank'></a>");
                subtitle[0].href = $(loadContent).find("#CustomBoxChart_link").val();
                subtitle[0].innerText = $(loadContent).find("#CustomBoxChart_subtitle").val();
                Me.chartOptions.subtitle.text = $("<div></div>").append(subtitle).html();
                //Me.chartOptions.subtitle.y = parseInt($(loadContent).find("#CustomBoxChart_fontSize").val())+20;
                Me.chartOptions.title.y = parseInt($(loadContent).find("#CustomBoxChart_fontSize").val()) - 4;
                //
                Me.InitHighChart();
                //
                var cp = Me.Get('ChartProperty');
                cp.chartOptions = Me.chartOptions;
                Me.Set('ChartProperty', cp);
                //
            });
        });
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标题", DisabledValue: 1, ContentObj: ItemContent }));
//
        /* ItemContent = null;
         ItemContent = $("<div id='CSChartStandLine'></div>");
         Agi.Controls.CustomBoxChartView_dataView(ItemContent, Me);
         ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据显示", DisabledValue: 1, ContentObj: ItemContent }));*/
//
        ItemContent = null;
        ItemContent = $("<div id='CSChartSigmaLine'></div>");
        Agi.Controls.CustomBoxChartView_dataViewAdv(ItemContent, Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据符号和连线显示", DisabledValue: 1, ContentObj: ItemContent }));
//
        ItemContent = null;
        ItemContent = $("<div id='CSChartSigMa'></div>")
        Agi.Controls.CustomBoxChartView_dataColumns(ItemContent, Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "合并并分组", DisabledValue: 1, ContentObj: ItemContent }));
//
//        ItemContent = null;
//        ItemContent = $("<div id='CSChartExtract'></div>");
//        Agi.Controls.CustomSigChartView_ExtractMenu(ItemContent, Me);
//        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据钻取设置", DisabledValue: 1, ContentObj: ItemContent }));

        //region 4.7.数据钻取页面列表设置
        ItemContent = null;
        ItemContent=$("<div id='CstmControlExtractPagelist'></div>");
        Agi.Controls.CustomControl_ExtractDataPageListMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据钻取页面设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.8.数据钻取参数列表设置
        ItemContent = null;
        ItemContent=$("<div id='CstmControlExtractParslist'></div>");
        Agi.Controls.CustomControl_ExtractDataParsListMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据钻取参数设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion
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
        alert(itemtitle);
    }

    //5.页面属性改变事件集合
    {
    }
}

//region 20130815 markeluo 标准线相关处理
//1.格式化标准线组的显示值信息
Agi.Controls.CustomBoxChartFormatPlotGrpPars = function (_Entity, _PlotGrp) {
    var PlotArray = null;
    //_PlotGrp: {GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000}
    if (_PlotGrp != null) {
        PlotArray = [];
        var MaxValue = 0, MinValue = 0;
        _PlotGrp.MaxValueType = parseInt(_PlotGrp.MaxValueType);
        _PlotGrp.MinValueType = parseInt(_PlotGrp.MinValueType);
        var maxcolumn = null;
        var mincolumn = null;
        if (_PlotGrp.MaxValueType == 0) {
            MaxValue = parseInt(_PlotGrp.MaxValue);
        } else {
            maxcolumn = _PlotGrp.MaxValue;
            if (_Entity.Data.length > 0) {
                MaxValue = parseInt(_Entity.Data[0][_PlotGrp.MaxValue]);
            } else {
                MaxValue = 0;
            }
        }
        if (_PlotGrp.MinValueType == 0) {
            MinValue = parseInt(_PlotGrp.MinValue);
        } else {
            mincolumn = _PlotGrp.MinValue;
            if (_Entity.Data.length > 0) {
                MinValue = parseInt(_Entity.Data[0][_PlotGrp.MinValue]);
            } else {
                MinValue = 0;
            }
        }
        PlotArray.push({value: MaxValue, columnName: maxcolumn, dashStyle: 'solid', color: _PlotGrp.MaxColor, width: _PlotGrp.MaxSize, id: _PlotGrp.GroupName + "_MAX", zIndex: 5});
        PlotArray.push({value: MinValue, columnName: mincolumn, dashStyle: 'solid', color: _PlotGrp.MinColor, width: _PlotGrp.MinSize, id: _PlotGrp.GroupName + "_MIN", zIndex: 5});
        MaxValue = MinValue = null;
    }
    return PlotArray;
}
//2.根据标准线数组值，更新Series中相关Point点的颜色
Agi.Controls.CustomBoxChartPlotLineUpSeries = function (_SeriesArrar, _PlotLines) {
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
//    var DataSeriesArray=Agi.Controls.CustomBoxChartGetDataSries(_SeriesArrar);
    if (_SeriesArrar != null && _SeriesArrar.length > 0) {
        for (var i = 0; i < _SeriesArrar.length; i++) {
            Agi.Controls.CustomBoxChartPlotLineUpPoint(_SeriesArrar[i], _PlotLines);
        }
    }
}
Agi.Controls.CustomBoxChartGetDataSries = function (_SeriesArrar, _IsDataSeries) {
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
    var SeriesArray = [];
    if (_SeriesArrar != null && _SeriesArrar.length > 0) {
        for (var i = 0; i < _SeriesArrar.length; i++) {
            if (_IsDataSeries != null && !_IsDataSeries) {
                if (_SeriesArrar[i].name == "max" || _SeriesArrar[i].name == "min") {
                    SeriesArray.push(_SeriesArrar[i]);
                }
            } else {
                if (_SeriesArrar[i].name != "max" && _SeriesArrar[i].name != "min" && _SeriesArrar[i].name != "middle") {
                    SeriesArray.push(_SeriesArrar[i]);
                }
            }
        }
    }
    return SeriesArray;
}
Agi.Controls.CustomBoxChartPlotLineUpPoint = function (_Series, _PlotLines) {
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
    if (_Series != null && _Series.data != null && _Series.data.length > 0) {
        var PointColor = null;
        for (var i = 0; i < _Series.data.length; i++) {
            PointColor = Agi.Controls.CustomBoxChartPlotLineGetPointColor(_Series.data[i].y, _PlotLines);
            if (PointColor != null) {
                _Series.data[i].marker = {fillColor: PointColor};
            }
        }
    }
}
//4.根据标准线组获取对应的point点颜色,如为null则对应的point点颜色不更改
Agi.Controls.CustomBoxChartPlotLineGetPointColor = function (_Value, _PlotLines) {
    var PointColor = null;
    if (_PlotLines != null && _PlotLines.length > 0) {
        var MaxLines = [];
        var MinLines = [];
        for (var i = 0; i < _PlotLines.length; i++) {
            if (_PlotLines[i].Items != null && _PlotLines[i].Items.length > 0) {
                for (var j = 0; j < _PlotLines[i].Items.length; j++) {
                    if (_PlotLines[i].Items[j].id.substr(_PlotLines[i].Items[j].id.length - 4) == "_MAX") {
                        MaxLines.push(_PlotLines[i].Items[j]);
                    } else {
                        MinLines.push(_PlotLines[i].Items[j]);
                    }
                }
            }
        }

        var MaxValueObj = {MaxValue: _Value, Color: ""};
        var MinValueObj = {MinValue: _Value, Color: ""};
        //排序
        var ObjIndex = -1;
        var TempObj = [];
        for (var i = 0; i < MaxLines.length; i++) {
            if (ObjIndex == -1) {
                ObjIndex = i;
            } else {
                if (MaxLines[i].value > MaxLines[ObjIndex].value) {
                    TempObj.push(MaxLines[ObjIndex]);
                    MaxLines[ObjIndex] = MaxLines[i];
                    MaxLines[i] = TempObj[0];
                    TempObj = [];
                    i = 0;
                }
            }
        }
        for (var i = 0; i < MinLines.length; i++) {
            if (ObjIndex == -1) {
                ObjIndex = i;
            } else {
                if (MinLines[i].value < MinLines[ObjIndex].value) {
                    TempObj.push(MinLines[ObjIndex]);
                    MinLines[ObjIndex] = MinLines[i];
                    MinLines[i] = TempObj[0];
                    TempObj = [];
                    i = 0;
                }
            }
        }

        for (var i = 0; i < MaxLines.length; i++) {
            if (_Value > MaxLines[i].value) {
                PointColor = MaxLines[i].color;
                break;
            }
        }
        if (PointColor == null) {
            for (var i = 0; i < MinLines.length; i++) {
                if (_Value < MinLines[i].value) {
                    PointColor = MinLines[i].color;
                    break;
                }
            }
        }
    }
    return PointColor;
}
//统计信息
Agi.Controls.CustomSigChartAlarmStatistical = function (_ALLSeries, _PlotLines) {
    var AlarmStatisticaldata = {PlotLines: [], SGM: {AlarmSum: 0, Percentage: 0, MaxObj: {AlarmSum: 0, Percentage: 0, Item: []}, MinObj: {AlarmSum: 0, Percentage: 0, Item: []}}};
    var _Series = Agi.Controls.CustomBoxChartGetDataSries(_ALLSeries);//获得对应的的数据Series
    var _ScmSeries = Agi.Controls.CustomBoxChartGetDataSries(_ALLSeries, false);//获得对应的的西格玛线Series

    if (_Series != null || _ScmSeries != null) {
        //标准线统计信息结构准备
        if (_PlotLines != null && _PlotLines.length > 0) {
            for (var i = 0; i < _PlotLines.length; i++) {//{GroupName:_PlotLineGrp.GroupName,Items:newGroup}
                AlarmStatisticaldata.PlotLines.push({GroupName: _PlotLines[i].GroupName, AlarmSum: 0, Percentage: 0, Items: []});
                for (var j = 0; j < _PlotLines[i].Items.length; j++) {
                    AlarmStatisticaldata.PlotLines[AlarmStatisticaldata.PlotLines.length - 1].Items.push({id: _PlotLines[i].Items[j].id, color: _PlotLines[i].Items[j].color, value: _PlotLines[i].Items[j].value, AlarmSum: 0, Percentage: 0})
                }
            }
        }
        //西格玛线统计信息结构准备
        if (_ScmSeries != null && _ScmSeries.length > 0) {
            var SigmLineobj = null;
            for (var i = 0; i < _ScmSeries.length; i++) {
                for (var j = 0; j < _ScmSeries[i].data.length; j++) {
                    if (_ScmSeries[i].data[j] != null) {
                        if (_ScmSeries[i].name == "max") {
                            SigmLineobj = GetSigmLineByArray(AlarmStatisticaldata.SGM.MaxObj.Item, _ScmSeries[i].data[j][1]);
                            if (SigmLineobj != null) {
                                SigmLineobj.EndIndex = _ScmSeries[i].data[j][0];
                            } else {
                                AlarmStatisticaldata.SGM.MaxObj.Item.push({StartIndex: _ScmSeries[i].data[j][0], EndIndex: null, value: _ScmSeries[i].data[j][1]});
                            }
                        } else {
                            SigmLineobj = GetSigmLineByArray(AlarmStatisticaldata.SGM.MinObj.Item, _ScmSeries[i].data[j][1]);
                            if (SigmLineobj != null) {
                                SigmLineobj.EndIndex = _ScmSeries[i].data[j][0];
                            } else {
                                AlarmStatisticaldata.SGM.MinObj.Item.push({StartIndex: _ScmSeries[i].data[j][0], EndIndex: null, value: _ScmSeries[i].data[j][1]});
                            }
                        }
                    }
                }

            }
        }

        var SumPointNum = 0;
        for (var i = 0; i < _Series.length; i++) {
            SumPointNum = SumPointNum + _Series[i].data.length;
        }
        for (var i = 0; i < _Series.length; i++) {
            for (var j = 0; j < _Series[i].data.length; j++) {
                Agi.Controls.CustomSigChartAlarmStatisticalByData(j, _Series[i].data[j].y, AlarmStatisticaldata, SumPointNum);//统计标准线所在比例信息
            }
        }
    }
    return AlarmStatisticaldata;
}

Agi.Controls.CustomSigChartAlarmStatisticalByData = function (_index, _PointValue, _AlarmStatisticaldata, SumPointNum) {
    //标准线超出点计算
    if (_AlarmStatisticaldata != null && _AlarmStatisticaldata.PlotLines != null
        && _AlarmStatisticaldata.PlotLines.length > 0) {
        for (var i = 0; i < _AlarmStatisticaldata.PlotLines.length; i++) {
            for (var j = 0; j < _AlarmStatisticaldata.PlotLines[i].Items.length; j++) {
                if (_AlarmStatisticaldata.PlotLines[i].Items[j].id.substr(_AlarmStatisticaldata.PlotLines[i].Items[j].id.length - 4) == "_MAX") {
                    if (_PointValue > _AlarmStatisticaldata.PlotLines[i].Items[j].value) {
                        _AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Items[j].Percentage = (_AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum / SumPointNum).toFixed(3);
                        _AlarmStatisticaldata.PlotLines[i].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Percentage = (_AlarmStatisticaldata.PlotLines[i].AlarmSum / SumPointNum).toFixed(3);
                    }
                } else {
                    if (_PointValue < _AlarmStatisticaldata.PlotLines[i].Items[j].value) {
                        _AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Items[j].Percentage = (_AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum / SumPointNum).toFixed(3);
                        _AlarmStatisticaldata.PlotLines[i].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Percentage = (_AlarmStatisticaldata.PlotLines[i].AlarmSum / SumPointNum).toFixed(3);
                    }
                }
            }
        }
    }
    //对应超出西格玛线点计算
    if (_AlarmStatisticaldata != null && _AlarmStatisticaldata.SGM != null) {
        if (_AlarmStatisticaldata.SGM.MaxObj.Item != null && _AlarmStatisticaldata.SGM.MaxObj.Item.length > 0) {
            for (var i = 0; i < _AlarmStatisticaldata.SGM.MaxObj.Item.length; i++) {
                if ((_index >= _AlarmStatisticaldata.SGM.MaxObj.Item[i].StartIndex && _index <= _AlarmStatisticaldata.SGM.MaxObj.Item[i].EndIndex)
                    && _PointValue > _AlarmStatisticaldata.SGM.MaxObj.Item[i].value) {
                    _AlarmStatisticaldata.SGM.MaxObj.AlarmSum++;
                    _AlarmStatisticaldata.SGM.MaxObj.Percentage = (_AlarmStatisticaldata.SGM.MaxObj.AlarmSum / SumPointNum).toFixed(3);
                    _AlarmStatisticaldata.SGM.AlarmSum++;
                    _AlarmStatisticaldata.SGM.Percentage = (_AlarmStatisticaldata.SGM.AlarmSum / SumPointNum).toFixed(3);
                    break;
                }
            }
        }
        if (_AlarmStatisticaldata.SGM.MinObj.Item != null && _AlarmStatisticaldata.SGM.MinObj.Item.length > 0) {
            for (var i = 0; i < _AlarmStatisticaldata.SGM.MinObj.Item.length; i++) {
                if ((_index >= _AlarmStatisticaldata.SGM.MinObj.Item[i].StartIndex && _index <= _AlarmStatisticaldata.SGM.MinObj.Item[i].EndIndex)
                    && _PointValue < _AlarmStatisticaldata.SGM.MinObj.Item[i].value) {
                    _AlarmStatisticaldata.SGM.MinObj.AlarmSum++;
                    _AlarmStatisticaldata.SGM.MinObj.Percentage = (_AlarmStatisticaldata.SGM.MinObj.AlarmSum / SumPointNum).toFixed(3);
                    _AlarmStatisticaldata.SGM.AlarmSum++;
                    _AlarmStatisticaldata.SGM.Percentage = (_AlarmStatisticaldata.SGM.AlarmSum / SumPointNum).toFixed(3);
                    break;
                }
            }
        }
    }
}
//统计信息显示
Agi.Controls.CustomSigChartAlarmStatisticalPanelShow = function (_AlarmStatisticaldata, _ApendToPanel) {
    if ($("#CustomSigChartAlarmPanel").length > 0) {
        $("#CustomSigChartAlarmPanel").html("");
    } else {
        var CustomSigChartAlarmPanelHTML = $("<div id='CustomSigChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomSigChartAlarmPanel").css({"right": "8px", "top": "8px"});
    }
    var SubItemHTML = "";
    if (_AlarmStatisticaldata != null && _AlarmStatisticaldata.PlotLines != null && _AlarmStatisticaldata.PlotLines.length > 0) {
        var PercentageValue = 0;
        for (var i = 0; i < _AlarmStatisticaldata.PlotLines.length; i++) {
            PercentageValue = accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Percentage), 100);
            SubItemHTML += "<div class='AlarmGroupSty'><div>组:" + _AlarmStatisticaldata.PlotLines[i].GroupName +
                " 超出点" + _AlarmStatisticaldata.PlotLines[i].AlarmSum + "个," + PercentageValue + "%</div>"
            for (var j = 0; j < _AlarmStatisticaldata.PlotLines[i].Items.length; j++) {
                PercentageValue = accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Items[j].Percentage), 100);
                SubItemHTML += "<div style='margin-left:15px;color:" + _AlarmStatisticaldata.PlotLines[i].Items[j].color + "'>" + _AlarmStatisticaldata.PlotLines[i].Items[j].id +
                    " 超出点" + _AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum + "个," + PercentageValue + "%</div>";
            }
            SubItemHTML += "</div>"
        }
    }
    if (_AlarmStatisticaldata != null && _AlarmStatisticaldata.SGM != null) {
        var PercentageValue = accMul(parseFloat(_AlarmStatisticaldata.SGM.Percentage), 100);
        SubItemHTML += "<div class='AlarmGroupSty'><div>超出西格玛线点" + _AlarmStatisticaldata.SGM.AlarmSum + "个," + PercentageValue + "%</div>"
        SubItemHTML += "</div>"
    }
    $("#CustomSigChartAlarmPanel").append(SubItemHTML);
}
function GetSigmLineByArray(_Array, _item) {
    for (i = 0; i < _Array.length; i++) {
        if (_Array[i].value == _item)
            return _Array[i];
    }
    return null;
}
function accMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//endregion

//region 20130828 markleuo 西格玛8项判异规则
Agi.Controls.SigmRuleApplyGetGroupData = function (_GroupDataArray) {
    var GroupData = [];
    if (_GroupDataArray != null && _GroupDataArray.length > 0) {
        for (var i = 0; i < _GroupDataArray.length; i++) {
            GroupData.push({
                Names: _GroupDataArray[i].Names,
                min: _GroupDataArray[i].min,
                max: _GroupDataArray[i].max,
                xBar: _GroupDataArray[i].middleValue,
                LCL: _GroupDataArray[i].minValue,
                UCL: _GroupDataArray[i].maxValue,
                Isigma: _GroupDataArray[i].Isigma
            });
        }
    }
    return GroupData;
}
//endregion

//region 20130912 markeluo SPC单值图组态控件化处理 (比较两个值大小，查找异常点,)
//1.比较两个值大小
Agi.Controls.WarnValueCompare = function (_ValueA, _ValueB, _ComPareCode) {
//    bool=eval(eval(FilterData[i][WarnRuleValue.warnColumn])+WarnRuleValue.warnRule+eval(WarnRuleValue.warnCompareValue));
    var bolSucced = false;
    if (isNaN(_ValueA) == isNaN(_ValueB)) {
        if (!isNaN(_ValueA)) {
            if (_ValueA.substring(0, 1) == "0") {
                bolSucced = eval('"' + _ValueA + '"' + _ComPareCode + '"' + _ValueB + '"');
            } else {
                bolSucced = eval(eval(_ValueA) + _ComPareCode + eval(_ValueB));
            }
        } else {
            bolSucced = eval('"' + _ValueA + '"' + _ComPareCode + '"' + _ValueB + '"');
        }
    } else {
        bolSucced = eval('"' + _ValueA + '"' + _ComPareCode + '"' + _ValueB + '"');
    }
    return bolSucced;
}
//2.查找异常点
Agi.Controls.CustomSigChartAlarmDataPointsFind = function (_GridData, _ColumnName, _ChartSeires, _markercolor) {
    var _Index = -1;
    if (_GridData.ChartData != null && _GridData.ChartData.length > 0) {
        for (var _param in _GridData.ChartData[0]) {
            _Index++;
            if (_param == _ColumnName) {
                break;
            }
        }
    }

    if (_Index > -1) {
        for (var j = 0; j < _ChartSeires.data.length; j++) {
            if (_ChartSeires.data[j].marker.fillColor != _markercolor) {//如果marker点颜色与原设置point点颜色不一致则说明该点为报警点
                _GridData.AlarmCells.push({Row: (_ChartSeires.data[j].x - 1), Col: _Index, AlarmColor: _ChartSeires.data[j].marker.fillColor});
            }
        }
    }
}
//3.在View环境中显示标准线设置菜单项
Agi.Controls.CustomBoxChartView_dataView = function (_Panel, _Control) {
    var control = _Control;
    var ItemContentPanel = $(_Panel);
    if ($(_Panel).find(".content").length > 0) {
        ItemContentPanel = $(_Panel).find(".content");
    }
    ItemContentPanel
}
//4.在View环境中显示下西格玛设置菜单项
Agi.Controls.CustomBoxChartView_dataViewAdv = function (_Panel, _Control) {
    var control = _Control;
    var ItemContentPanel = $(_Panel);
    if ($(_Panel).find(".content").length > 0) {
        ItemContentPanel = $(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomBoxChart/tabTemplates.html #tab-6', function () {
        //初始化
        var cp = control.Get('ChartProperty');
        //
        if (cp.CustomBoxChart_zwszxqj) {
            $("#CustomBoxChart_zwszxqj").prop("checked", true);
        }
        if (cp.CustomBoxChart_jck) {
            $("#CustomBoxChart_jck").prop("checked", true);
        }
        if (cp.CustomBoxChart_yczfh) {
            $("#CustomBoxChart_yczfh").prop("checked", true);
        }
        if (cp.CustomBoxChart_dzfh) {
            $("#CustomBoxChart_dzfh").prop("checked", true);
        }
        if (cp.CustomBoxChart_zwsfh) {
            $("#CustomBoxChart_zwsfh").prop("checked", true);
        }
        if (cp.CustomBoxChart_zwsljx) {
            $("#CustomBoxChart_zwsljx").prop("checked", true);
        }
        if (cp.CustomBoxChart_jzfh) {
            $("#CustomBoxChart_jzfh").prop("checked", true);
        }
        if (cp.CustomBoxChart_jzljx) {
            $("#CustomBoxChart_jzljx").prop("checked", true);
        }
        //更改
        $("#CustomBoxChart_zwszxqj").change(function () {
            cp.CustomBoxChart_zwszxqj = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    //if (tempSeries.name == "中位数置信区间") {
                    if (tempSeries.name == "箱线图") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 1,
                        name: "中位数置信区间",
                        data: []
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.mediandata.length; i++) {
                    var meddata = control.data.mediandata[i];
                    series.data.push(
                        //[i,meddata.box_l, meddata.qua_l, meddata.med, meddata.qua_u, meddata.box_u]
                        { x: i, low: meddata.box_l, q1: meddata.qua_l, median: meddata.med, q3: meddata.qua_u, high: meddata.box_u, name: "中位数置信区间", color: "red", pointWidth: 50 }
                    )
                }
                control.InitHighChart();
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "箱线图") {
                        series = tempSeries;
                        break;
                    }
                }
                for (var i = 0; i < series.data.length; i++) {
                    var data = series.data[i];
                    if (data) {
                        if (data.name === "中位数置信区间") {
                            delete series.data[i];
                        }
                    }
                }
                /*if (series) {
                 control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                 }*/
                control.InitHighChart();
            }
        });
        $("#CustomBoxChart_jck").change(function () {
            cp.CustomBoxChart_jck = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "箱线图") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 2,
                        name: "极差框",
                        data: []
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.terrible.length; i++) {
                    var meddata = control.data.terrible[i];
                    series.data.push(
                        //[meddata.box_l, meddata.qua_l, meddata.med, meddata.qua_u, meddata.box_u]
                        { x: i, low: meddata.box_l, q1: meddata.qua_l, median: meddata.med, q3: meddata.qua_u, high: meddata.box_u, name: "极差框", color: "yellow", pointWidth: 150 }
                    )
                }
                control.InitHighChart();
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "箱线图") {
                        series = tempSeries;
                        break;
                    }
                }
                for (var i = 0; i < series.data.length; i++) {
                    var data = series.data[i];
                    if (data) {
                        if (data.name === "极差框") {
                            delete series.data[i];
                        }
                    }
                }
                control.InitHighChart();
            }
        });
        $("#CustomBoxChart_yczfh").change(function () {
            cp.CustomBoxChart_yczfh = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "异常值符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 3,
                        name: "异常值符号",
                        type: "scatter",
                        data: [],
                        marker: {
                            symbol: 'url(JS/Controls/CustomBoxChart/s1.png)'
                        }
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.meddata.length; i++) {
                    var meddata = control.data.meddata[i];
                    for (var j = 0; j < meddata.anomalousArray.length; j++) {
                        var anomalous = meddata.anomalousArray[j];
                        series.data.push(
                            [i, anomalous]
                        )
                    }
                }
                if (series.data.length === 0) {
                    alert("没有异常值！");
                    control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                }
                else {
                    control.InitHighChart();
                }
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "异常值符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (series) {
                    control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                }
                control.InitHighChart();
            }
        });
        $("#CustomBoxChart_dzfh").change(function () {
            cp.CustomBoxChart_dzfh = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "单值符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 4,
                        name: "单值符号",
                        type: "scatter",
                        data: [],
                        marker: {
                            symbol: 'url(JS/Controls/CustomBoxChart/s2.png)'
                        }
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.mediandata.length; i++) {
                    var meddata = control.data.mediandata[i];
                    for (var attr in meddata) {
                        if (!(isNaN(meddata[attr]))) {
                            series.data.push(
                                [i, meddata[attr]]
                            );
                        }
                    }
                }
                control.InitHighChart();
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "单值符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (series) {
                    control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                }
                control.InitHighChart();
            }
        });
        $("#CustomBoxChart_zwsfh").change(function () {
            cp.CustomBoxChart_zwsfh = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "中位数符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 5,
                        name: "中位数符号",
                        type: "scatter",
                        data: [],
                        marker: {
                            symbol: 'url(JS/Controls/CustomBoxChart/s3.png)'
                        }
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.mediandata.length; i++) {
                    var meddata = control.data.mediandata[i];
                    series.data.push(
                        [i, meddata.med]
                    );
                }
                control.InitHighChart();
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "中位数符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (series) {
                    control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                }
                control.InitHighChart();
            }
        });
        $("#CustomBoxChart_zwsljx").change(function () {
            cp.CustomBoxChart_zwsljx = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "中位数连接线") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 6,
                        name: "中位数连接线",
                        type: "line",
                        marker: {
                            enabled: false
                        },
                        data: []
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.mediandata.length; i++) {
                    var meddata = control.data.mediandata[i];
                    series.data.push(
                        [i, meddata.med]
                    );
                }
                control.InitHighChart();
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "中位数连接线") {
                        series = tempSeries;
                        break;
                    }
                }
                if (series) {
                    control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                }
                control.InitHighChart();
            }
        });
        $("#CustomBoxChart_jzfh").change(function () {
            cp.CustomBoxChart_jzfh = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "均值连符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 7,
                        name: "均值连符号",
                        type: "scatter",
                        data: [],
                        marker: {
                            symbol: 'url(JS/Controls/CustomBoxChart/s4.png)'
                        }
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.mediandata.length; i++) {
                    var meddata = control.data.mediandata[i];
                    series.data.push(
                        [i, meddata.mean]
                    );
                }
                control.InitHighChart();
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "均值连符号") {
                        series = tempSeries;
                        break;
                    }
                }
                if (series) {
                    control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                }
                control.InitHighChart();
            }
        });
        $("#CustomBoxChart_jzljx").change(function () {
            cp.CustomBoxChart_jzljx = this.checked;
            if (this.checked) {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "均值连接线") {
                        series = tempSeries;
                        break;
                    }
                }
                if (!series) {
                    series = {
                        index: 8,
                        name: "均值连接线",
                        type: "line",
                        marker: {
                            enabled: false
                        },
                        data: []
                    };
                    control.chartOptions.series.push(series);
                }
                for (var i = 0; i < control.data.mediandata.length; i++) {
                    var meddata = control.data.mediandata[i];
                    series.data.push(
                        [i, meddata.mean]
                    );
                }
                control.InitHighChart();
            }
            else {
                var series;
                for (var i = 0; i < control.chartOptions.series.length; i++) {
                    var tempSeries = control.chartOptions.series[i];
                    if (tempSeries.name == "均值连接线") {
                        series = tempSeries;
                        break;
                    }
                }
                if (series) {
                    control.chartOptions.series.splice($.inArray(series, control.chartOptions.series), 1);
                }
                control.InitHighChart();
            }
        });
        //保存
        control.Set('ChartProperty', cp);
    });
}
//4.在View环境中显示西格玛判异菜单项
Agi.Controls.CustomBoxChartView_dataColumns = function (_Panel, _Control) {
    var control = _Control;
    var ItemContentPanel = $(_Panel);
    if ($(_Panel).find(".content").length > 0) {
        ItemContentPanel = $(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomBoxChart/tabTemplates.html #tab-3', function () {
        //初始化
        var cp = control.Get('ChartProperty');
        var chartEntity = control.Get("Entity")[0];
        //control
        for (var i = 0; i < chartEntity.Columns.length; i++) {
            var column = chartEntity.Columns[i];
            $("#CustomBoxChart_dataColumn").append(
                "<option>" + column + "</option>"
            );
            $("#CustomBoxChart_groupColumn").append(
                "<option>" + column + "</option>"
            );
        }
        //data
        if (cp.groupColumns) {
            $("#CustomBoxChart_groupColumn").val(cp.groupColumns);
        }
        if (cp.dataColumns) {
            $("#CustomBoxChart_dataColumn").val(cp.dataColumns);
        }
        if (cp.merge) {
            $("[name='merge'][value='合并组']").prop("checked", true);
        }
        //
        $("#CustomBoxChart_groupColumn").load(function () {
            $(this).dropdownchecklist({ width: 100 });
        })
        $("#CustomBoxChart_dataColumn").load(function () {
            $(this).dropdownchecklist({ width: 100 });
        })
        /*setTimeout(function () {
         $("#CustomBoxChart_groupColumn").dropdownchecklist({ width: 100 });
         $("#CustomBoxChart_dataColumn").dropdownchecklist({ width: 100 });
         }, 2000);*/
        //$(".ui-dropdownchecklist,.ui-dropdownchecklist-selector").height(25);
        //更改
        $("#CustomBoxChart_columnSave").click(function () {
            //var groups = $("#CustomBoxChart_groupColumn").val();
            //var cats = $("#CustomBoxChart_dataColumn").val();
            //var merge = $("[name='merge']:checked").val();
            //
            cp.groupColumns = $("#CustomBoxChart_groupColumn").val();
            cp.dataColumns = $("#CustomBoxChart_dataColumn").val();
            cp.merge = $("[name='merge']:checked").val();
            //
            if (!cp.groupColumns) {
                /*请求R计算服务*/
                var json = {
                    "action": "RCalBoxplot",
                    "dataArray": []
                };
                //
                //
                json.dataArray = [];
                //
                control.chartOptions.xAxis.categories = cp.dataColumns;
                control.chartOptions.title.text = $(control.chartOptions.title.text).text(cp.dataColumns.toString() + "的箱线图")[0].outerHTML;
                //
                for (var i = 0; i < cp.dataColumns.length; i++) {
                    var cat = cp.dataColumns[i];
                    var tempArray = [];
                    //
                    for (var j = 0; j < chartEntity.Data.length; j++) {
                        var data = chartEntity.Data[j];
                        tempArray.push(data[cat]);
                    }
                    //
                    json.dataArray.push(tempArray);
                    //
//                    tempArray.length = 9;
                }
            }
            else {
                /*请求R计算服务*/
                var json = {
                    "action": "RCalBoxplot",
                    "dataArray": []
                };
                //
                //
                json.dataArray = [];
                //
                //control.chartOptions.xAxis.categories = groups;
                control.chartOptions.title.text = $(control.chartOptions.title.text).text(cp.dataColumns.toString() + "的箱线图")[0].outerHTML;
                //
                var dataObject = {};
                //add kuandu
                for (var i = 0; i < cp.dataColumns.length; i++) {
                    var cat = cp.dataColumns[i];
                    dataObject[cat] = [];
                }
                //add banzu
                for (var i = 0; i < cp.groupColumns.length; i++) {
                    var groupColumn = cp.groupColumns[i];
                    for (var obj in dataObject) {
                        delete dataObject[obj];
                        for (var j = 0; j < chartEntity.Data.length; j++) {
                            var data = chartEntity.Data[j];
                            var group = data[groupColumn];
                            if (!dataObject[obj + "##" + groupColumn + "&&" + group]) {
                                dataObject[obj + "##" + groupColumn + "&&" + group] = [];
                            }
                        }
                    }
                }
                //
                for (var obj in dataObject) {
                    for (var i = 0; i < chartEntity.Data.length; i++) {
                        var data = chartEntity.Data[i];
                        //
                        var dataColumn = obj.split("##")[0];
                        //
                        var addRow = true;
                        for (var j = 1; j < obj.split("##").length; j++) {
                            var columns = obj.split("##")[j];
                            var groupColumn = columns.split("&&")[0];
                            var group = columns.split("&&")[1];
                            addRow = (data[groupColumn] === group)
                        }
                        if (addRow) {
                            dataObject[obj].push(data[dataColumn]);
                        }
                    }
                }
                //add merge
                if (cp.merge === "合并列") {
                    var lastDataColumn = "";
                    var dataObjectClone = JSON.parse(JSON.stringify(dataObject));
                    dataObject = {};
                    for (var obj in dataObjectClone) {
                        var dataColumn = obj.split("##")[0];
                        if (lastDataColumn !== dataColumn) {
                            lastDataColumn = dataColumn;
                            //
                            dataObject[dataColumn] = [];
                            //add data
                            for (var i = 0; i < chartEntity.Data.length; i++) {
                                var data = chartEntity.Data[i];
                                dataObject[dataColumn].push(data[dataColumn]);
                            }
                        }
                        dataObject[obj] = dataObjectClone[obj];
                    }
                }
                else if (cp.merge === "合并组") {
                    var lastGroup = "";
                    var dataObjectClone = JSON.parse(JSON.stringify(dataObject));
                    dataObject = {};
                    for (var obj in dataObjectClone) {
                        var groupColumn = obj.split("##")[1].split("&&")[0];
                        var group = obj.split("##")[1].split("&&")[1];
                        if (lastGroup !== group) {
                            lastGroup = group;
                            //
                            dataObject[obj.split("##")[0] + "##" + obj.split("##")[1]] = [];
                            //add data
                            for (var i = 0; i < chartEntity.Data.length; i++) {
                                var data = chartEntity.Data[i];
                                if (data[groupColumn] === group) {
                                    dataObject[obj.split("##")[0] + "##" + obj.split("##")[1]].push(data[dataColumn]);
                                }
                            }
                        }
                        dataObject[obj] = dataObjectClone[obj];
                    }
                }
                //
                control.chartOptions.xAxis.categories = [];
                for (var obj in dataObject) {
                    var temp = dataObject[obj];
//                    temp.length = 9;
                    json.dataArray.push(temp);
                    var catNameFinal = obj.split("##")[0];
                    for (var i = 1; i < obj.split("##").length; i++) {
                        var catName = obj.split("##")[i];
                        catNameFinal += "##" + catName.split("&&")[1];
                    }
                    control.chartOptions.xAxis.categories.push(catNameFinal);
                }
            }
            //
            var jsonString = JSON.stringify(json);
            //
            Agi.DAL.ReadData(
                {
                    "MethodName": "RCalBoxplot",
                    "Paras": jsonString,
                    "CallBackFunction": function (result) {
                        //alert(result.result);
                        if (result.result=="true") {
                            control.chartOptions.series = [
                                {
                                    name: "箱线图",
                                    data: []
                                }
                            ]
                            for (var i = 0; i < result.data.meddata.length; i++) {
                                var meddata = result.data.meddata[i];
                                control.chartOptions.series[0].data.push(
                                    [meddata.box_l, meddata.qua_l, meddata.med, meddata.qua_u, meddata.box_u]
                                )
                            }
                            control.InitHighChart();
                            //
                            control.data = result.data;
                        }
                    }
                }
            );
        });
        //保存
        control.Set('ChartProperty', cp);
    });
}
//5.特殊报警
Agi.Controls.CustomSigChartView_SpecialAlarmMenu = function (_Panel, _Control) {
    var Me = _Control;
    var ChartEntity = Me.Get("Entity")[0];
    var ChartEntityColumns = [];
    if (ChartEntity != null && ChartEntity.Columns != null) {
        ChartEntityColumns = ChartEntity.Columns;
    }

    var ItemContentPanel = $(_Panel);
    if ($(_Panel).find(".content").length > 0) {
        ItemContentPanel = $(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomBoxChart/tabTemplates.html #tab-5', function () {
        //1.保存规则
        $(this).find('#warnSave').click(function () {
            var warn = {
                warnColumn: $('#warnColumn').val(),
                warnRule: $('#warnRule').val(),
                warnCompareValue: $('#warnCompareValue').val(),
                warnColor: $('#tab5Color').val()
            }
            if (warn.warnCompareValue == "") {
                warn = null;
            }
            Me.Set("WarnRule", warn);//特殊报警功能
            Me.RefreshByProPanelUp();//更新显示
        });
        //2.删除规则
        $(this).find('#warnDelete').click(function () {
            $('#warnCompareValue').val("");
            Me.Set("WarnRule", null);//特殊报警功能
            Me.RefreshByProPanelUp();//更新显示
        });
        //3.默认数据列填充
        var warnColumns = $(this).find('#warnColumn');
        warnColumns.empty();
        for (var i = 0; i < ChartEntityColumns.length; i++) {
            var option = "<option value='" + ChartEntityColumns[i] + "'>" + ChartEntityColumns[i] + "</option>";
            warnColumns.append(option);
        }
        $(this).find('#tab5Color').spectrum({
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
                $(this).attr("value", color.toHexString());
            }
        });
        var WarnRuleCondition = Me.Get("WarnRule");//特殊报警功能
        if (WarnRuleCondition != null) {
            warnColumns.find("option[value='" + WarnRuleCondition.warnColumn + "']").attr("selected", true);
            $(this).find('#warnRule').find("option[value='" + WarnRuleCondition.warnRule + "']").attr("selected", true);
            $(this).find('#warnCompareValue').val(WarnRuleCondition.warnCompareValue);
            $(this).find('#tab5Color').spectrum("set", WarnRuleCondition.warnColor);
        }
    });
}
//endreigon

//6.数据钻取设置
Agi.Controls.CustomSigChartView_ExtractMenu = function (_Panel, _Control) {
    var Me = _Control;
    var ChartEntity = Me.Get("Entity")[0];
    var ChartEntityColumns = [];
    if (ChartEntity != null && ChartEntity.Columns != null) {
        ChartEntityColumns = ChartEntity.Columns;
    }
    var ChartExtractConfig = Me.Get("ExtractConfig");//数据钻取配置信息
    if (ChartExtractConfig != null) {
    } else {
        ChartExtractConfig = {URL: "", Paras: []};
    }
    // {URL:页面URL,Paras:[{Name:"p1",Column:"column1",Value:"值1"},Name:"p2",Column:"column2",Value:"值2"}]}

    var ItemContentPanel = $(_Panel);
    if ($(_Panel).find(".content").length > 0) {
        ItemContentPanel = $(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomBoxChart/tabTemplates.html #tab-7', function () {
        //0.默认选项隐藏
        $("#CustomBoxChartParCancel").hide();
        $("#CustomBoxChartNewParsTxt").width(0).hide();

        //1.添加参数
        $(this).find('#CustomBoxChartParAdd').click(function () {
            $(this).hide();
            $("#CustomBoxChartParCancel").show();
            $("#CustomBoxChartNewParsTxt").width(60).show();
            $("#CustomBoxChartParsNames").hide();
        });
        //2.取消添加
        $(this).find('#CustomBoxChartParCancel').click(function () {
            $("#CustomBoxChartParCancel").hide();
            $("#CustomBoxChartNewParsTxt").width(0).val("").hide();
            $("#CustomBoxChartParsNames").show();
            $("#CustomBoxChartParAdd").show();
        });
        //3.保存
        $(this).find('#CustomBoxChartParSave').click(function () {
            var SCSTxtVisibly = !$("#CustomBoxChartNewParsTxt").is(':hidden');
            var CusChartParsName = "";
            var CusChartParsValue = "";
            if (SCSTxtVisibly) {
                //新增参数
                CusChartParsName = $("#CustomBoxChartNewParsTxt").val();
                CusChartParsValue = $("#CustomBoxChartParsValues").val();
            } else {
                //编辑参数
                CusChartParsName = $("#CustomBoxChartParsNames").val();
                CusChartParsValue = $("#CustomBoxChartParsValues").val();
            }
            if (CusChartParsName != null && CusChartParsName != "" && CusChartParsValue != null && CusChartParsValue != "") {
                var ParIndex = -1;
                if (ChartExtractConfig.Paras != null && ChartExtractConfig.Paras.length > 0) {
                    for (var i = 0; i < ChartExtractConfig.Paras.length; i++) {
                        if (ChartExtractConfig.Paras[i].Name == CusChartParsName) {
                            ParIndex = i;
                            break;
                        }
                    }
                    if (SCSTxtVisibly) {
                        if (ParIndex > -1) {
                            AgiCommonDialogBox.Alert("同名参数已存在，无法添加!");
                        } else {
                            ChartExtractConfig.Paras.push({Name: CusChartParsName, Column: CusChartParsValue, Value: ""});
                            $("#CustomBoxChartParsNames").append("<option value='" + CusChartParsName + "'>" + CusChartParsName + "</option>");

                            $("#CustomBoxChartParCancel").hide();
                            $("#CustomBoxChartNewParsTxt").width(0).val("").hide();
                            $("#CustomBoxChartParsNames").show();
                            $("#CustomBoxChartParAdd").show();

                            $("#CustomBoxChartParsNames").val(CusChartParsName);
                            //更新列表显示
                            Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras, "ParsListPanel");

                            AgiCommonDialogBox.Alert("添加成功!");
                        }
                    } else {
                        ChartExtractConfig.Paras[i].Column = CusChartParsValue;
                        //更新列表显示
                        Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras, "ParsListPanel");
                        AgiCommonDialogBox.Alert("修改成功!");
                    }
                } else {
                    ChartExtractConfig.Paras.push({Name: CusChartParsName, Column: CusChartParsValue, Value: ""});
                    $("#CustomBoxChartParsNames").append("<option value='" + CusChartParsName + "'>" + CusChartParsName + "</option>");

                    $("#CustomBoxChartParCancel").hide();
                    $("#CustomBoxChartNewParsTxt").width(0).val("").hide();
                    $("#CustomBoxChartParsNames").show();
                    $("#CustomBoxChartParAdd").show();

                    $("#CustomBoxChartParsNames").val(CusChartParsName);

                    //更新列表显示
                    Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras, "ParsListPanel");

                    AgiCommonDialogBox.Alert("添加成功!");
                }

                Me.Set("ExtractConfig", ChartExtractConfig);//数据钻取配置信息保存
            } else {
                AgiCommonDialogBox.Alert("参数名称和绑定列不可为空!");
            }
        });
        //4.删除
        $(this).find('#CustomBoxChartParDel').click(function () {
            var SCSTxtVisibly = !$("#CustomBoxChartNewParsTxt").is(':hidden');
            if (SCSTxtVisibly) {
                AgiCommonDialogBox.Alert("请取消或完成新增，选择已存在的参数名称后再试!");
            } else {
                //编辑参数
                var CusChartParsName = $("#CustomBoxChartParsNames").val();
                if (ChartExtractConfig.Paras != null && ChartExtractConfig.Paras.length > 0) {
                    var ParIndex = -1;
                    for (var i = 0; i < ChartExtractConfig.Paras.length; i++) {
                        if (ChartExtractConfig.Paras[i].Name == CusChartParsName) {
                            ParIndex = i;
                            break;
                        }
                    }
                    if (ParIndex > -1) {
                        //移除对应的Option项
                        ("#CustomBoxChartParsNames option[value='" + ChartExtractConfig.Paras[ParIndex].Name + "']").remove(); //删除Select中Value=''的Option

                        ChartExtractConfig.Paras.splice(ParIndex, 1);
                        //更新列表显示
                        Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras, "ParsListPanel");
                        Me.Set("ExtractConfig", ChartExtractConfig);//数据钻取配置信息保存

                        AgiCommonDialogBox.Alert("删除成功!");
                    }
                }
            }
        });
        //5.初始化列表栏位显示
        var DefaultParNameColumn=null;
        Agi.PageDataDrill.GetAllPageFilList(function(_result){
            if(_result.result && _result.result=="true"){
                var strCustSigChartExtractURLoptions="";
                if(_result.data!=null && _result.data.length>0){
                    var itemValue="";
                    for(var i=0;i<_result.data.length;i++){
                        itemValue=_result.data[i]["pagename"]+"_"+_result.data[i]["no"];
                        strCustSigChartExtractURLoptions+="<option value='"+itemValue+"'>"+itemValue+"</option>";
                    }
                    itemValue=null;
                    $("#CustBoxChartExtractURL").html(strCustSigChartExtractURLoptions);
                    if(ChartExtractConfig!=null && ChartExtractConfig.URL!=null){
                        $("#CustBoxChartExtractURL").find("[value='"+ChartExtractConfig.URL+"']").attr("selected","selected");
                    }
                }
            }
        })

        if (ChartExtractConfig.Paras != null && ChartExtractConfig.Paras.length > 0) {
            for (var i = 0; i < ChartExtractConfig.Paras.length; i++) {
                $("#CustomBoxChartParsNames").append("<option value='" + ChartExtractConfig.Paras[i].Name + "'>" + ChartExtractConfig.Paras[i].Name + "</option>");
            }
            DefaultParNameColumn = ChartExtractConfig.Paras[0].Column;
            $("#CustomBoxChartParsNames").val(ChartExtractConfig.Paras[0].Name);

            //更新列表显示
            Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras, "ParsListPanel");
        } else {
            $("#CustomBoxChartParAdd").hide();
            $("#CustomBoxChartParCancel").show();
            $("#CustomBoxChartNewParsTxt").width(60).show();
            $("#CustomBoxChartParsNames").hide();
        }
        if (ChartEntityColumns != null && ChartEntityColumns.length > 0) {
            for (var i = 0; i < ChartEntityColumns.length; i++) {
                $("#CustomBoxChartParsValues").append("<option value='" + ChartEntityColumns[i] + "'>" + ChartEntityColumns[i] + "</option>");
            }
            if (DefaultParNameColumn != null) {
                $("#CustomBoxChartParsValues").val(DefaultParNameColumn);
            }
        }
        //6.参数名称选中项更改
        $(this).find('#CustomBoxChartParsNames').change(function () {
            var StrThisSelValue = $(this).val();
            var ThisParas = Me.Get("ExtractConfig").Paras;//数据钻取配置信息保存
            if (ThisParas != null && ThisParas.length > 0) {
                for (var i = 0; i < ThisParas.length; i++) {
                    if (ThisParas[i].Name == StrThisSelValue) {
                        $("#CustomBoxChartParsValues").val(ThisParas[i].Column);
                        break;
                    }
                }
            }
        });
        //7.参数项&URL信息保存
        $(this).find('#CstBoxChartExtractOptionSave').click(function () {
            var ThisExtractConfig = Me.Get("ExtractConfig");//数据钻取配置信息保存
            ThisExtractConfig.URL = $("#CustBoxChartExtractURL").val();
            Me.Set("ExtractConfig", ThisExtractConfig);//数据钻取配置信息保存
            AgiCommonDialogBox.Alert("数据钻取配置信息保存成功!");
        });
    });
}
//endegion

//region 21030917 22:26 markeluo 标准线和西格玛线报警汇总统计面板显示
Agi.Controls.CustomSigChartAlarmStatisticalTableShow = function (_AlarmStatisticaldata, _ApendToPanel) {
    if ($("#CustomSigChartAlarmPanel").length > 0) {
        $("#CustomSigChartAlarmPanel").html("<a id='btnTotalMenu' class='totalAlarmmenusty'>统计信息</a></div>");
    } else {
        var CustomSigChartAlarmPanelHTML = $("<div id='CustomSigChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomSigChartAlarmPanel").css({"right": "8px", "top": "8px"});
        CustomSigChartAlarmPanelHTML.append("<a  id='btnTotalMenu' class='totalAlarmmenusty'>统计信息</a>");
    }
    $("#btnTotalMenu").unbind().bind("click", function (ev) {
        $("#TotalTable").show();
        $(this).hide();
        ev.stopPropagation();    //  阻止事件冒泡
    });//显示统计表格
    var SubItemHTML = "<table id='TotalTable' class='tabsty'>";
    SubItemHTML += "<tr><td><a  id='btnTotalHidenMenu' class='totalAlarmmenusty'>隐藏统计信息</a></td><td></td><td></td><td></td><td style='text-align:center;background-color:#ffff00;'><a id='toalAlarmTableDownload' class='totalAlarmmenusty'>下载</a></td></tr>";
    SubItemHTML += "<tr><td style='background-color:#4bacc6'>分析内容</td><td colspan='4' class='toalarmEditcell'>热轧宽度均值极差图</td></tr>";
    SubItemHTML += "<tr><td style='background-color:#4bacc6'>图形名称</td><td style='background-color:#4bacc6'>单值图</td><td></td><td></td><td></td></tr>";
    SubItemHTML += "<tr><td style='background-color:#4bacc6'>样本点个数</td><td>100</td><td></td><td></td><td></td></tr>";
    SubItemHTML += "<tr><td style='background-color:#4bacc6'>分图时间</td><td>2013-9-17 22:46:13</td><td></td><td></td><td></td></tr>";
    SubItemHTML += "<tr><td style='background-color:#4bacc6'>备注</td><td colspan='4' class='toalarmEditcell'></td></tr>";
    SubItemHTML += "<tr><td style='background-color:#4bacc6'>分组</td><td style='background-color:#4bacc6'>标准线</td><td style='background-color:#4bacc6'>标准线值</td><td style='background-color:#4bacc6'>异常点个数</td><td style='background-color:#4bacc6'>异常点百分比</td></tr>";
    if (_AlarmStatisticaldata != null && _AlarmStatisticaldata.PlotLines != null && _AlarmStatisticaldata.PlotLines.length > 0) {
        var SumPercentageValue = 0;
        var PercentageValue = 0;
        var StandLineValue = null;
        for (var i = 0; i < _AlarmStatisticaldata.PlotLines.length; i++) {
            SumPercentageValue = accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Percentage), 100);
            for (var j = 0; j < _AlarmStatisticaldata.PlotLines[i].Items.length; j++) {
                //{value,columnName,dashStyle,color,width,id,zIndex};
                PercentageValue = accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Items[j].Percentage), 100);
                if (_AlarmStatisticaldata.PlotLines[i].Items[j].columnName != null) {
                    StandLineValue = _AlarmStatisticaldata.PlotLines[i].Items[j].columnName;
                } else {
                    StandLineValue = _AlarmStatisticaldata.PlotLines[i].Items[j].value;
                }
                SubItemHTML += "<tr><td style='background-color:#4bacc6'>" + _AlarmStatisticaldata.PlotLines[i].GroupName + "</td><td style='background-color:#4bacc6'>" + _AlarmStatisticaldata.PlotLines[i].Items[j].id + "</td><td>" + StandLineValue + "</td><td>" + _AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum + "</td><td>" + PercentageValue + "</td></tr>";
            }
            SubItemHTML += "<tr><td style='background-color:#4bacc6'>" + _AlarmStatisticaldata.PlotLines[i].GroupName + "</td><td style='background-color:#4bacc6'>合计</td><td style='background-color:#d8d8d8'></td><td>" + _AlarmStatisticaldata.PlotLines[i].AlarmSum + "</td><td>" + SumPercentageValue + "</td></tr>";
        }
    }
    if (_AlarmStatisticaldata != null && _AlarmStatisticaldata.SGM != null) {
        SubItemHTML += "<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>西格玛值</td><td>" + _AlarmStatisticaldata.SGM.SigmaValue + "</td><td></td><td></td></tr>";
        SubItemHTML += "<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>超上限</td><td style='background-color:#d8d8d8'></td><td>" + _AlarmStatisticaldata.SGM.MaxObj.AlarmSum + "</td><td>" + accMul(parseFloat(_AlarmStatisticaldata.SGM.MaxObj.Percentage), 100) + "</td></tr>";
        SubItemHTML += "<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>超下限</td><td style='background-color:#d8d8d8'></td><td>" + _AlarmStatisticaldata.SGM.MinObj.AlarmSum + "</td><td>" + accMul(parseFloat(_AlarmStatisticaldata.SGM.MinObj.Percentage), 100) + "</td></tr>";
        var PercentageValue = accMul(parseFloat(_AlarmStatisticaldata.SGM.Percentage), 100);
        SubItemHTML += "<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>合计</td><td style='background-color:#d8d8d8'></td><td>" + _AlarmStatisticaldata.SGM.AlarmSum + "</td><td>" + PercentageValue + "</td></tr>";
    }
    SubItemHTML += "</table>"
    $("#CustomSigChartAlarmPanel").append(SubItemHTML);
    $("#btnTotalHidenMenu").unbind().bind("click", function (ev) {
        $("#TotalTable").hide();
        $("#btnTotalMenu").show();
        ev.stopPropagation();    //  阻止事件冒泡
    });//隐藏统计表格
    $("#toalAlarmTableDownload").unbind().bind("click", function (ev) {

    })//下载统计表格
    $(".toalarmEditcell").unbind().bind("dblclick", function (ev) {
        var Thistxt = $(this).html();
        $(this).html("");
        if ($("#txtemp").length > 0) {
        } else {
            $("<input type='text' value='' id='txtemp' style='width: 98%;display:none;'>").appendTo($(this));
        }
        $("#txtemp").appendTo($(this)).show().focus();
        $("#txtemp").blur(function (ev) {
            var txtParent = $("#txtemp").parent();
            var txtValue = $(this).val();
            txtParent.html(txtValue);
            $(this).remove();
        });
        $("#txtemp").val(Thistxt);
        ev.stopPropagation();    //  阻止事件冒泡
    });
    $("#CustomSigChartAlarmPanel").unbind().bind("dblclick", function (ev) {
        ev.stopPropagation();    //  阻止事件冒泡
    });

    //统计表格下载
    $("#toalAlarmTableDownload").unbind().bind("click", function (ev) {
        var totalTablhtml = "<html xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head>" +
            "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>" +
            "<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name></x:Name><x:WorksheetOptions><x:Selected/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->" +
            "<style type='text/css'>" +
            " .tabsty{width: 100%;height: auto;border-radius: 5px;font-size:12px;font-weight: bold;font-family: '微软雅黑',Arial,'黑体';border: 1px solid #cccccc;border-collapse: collapse;}" +
            ".tabsty tr{height:25px;}" +
            ".tabsty td{border: 1px solid #cccccc;border-collapse: collapse;}" +
            "</style></head>" +
            "<body>" +
            "<div class='gdtjContainer'>" +
            $("#CustomSigChartAlarmPanel").html() +
            "</div>" +
            "</body>" +
            "</html>";
        Agi.DAL.JAVAPostManager({ "MethodName": "HtmlToExcel", "Paras": totalTablhtml, "CallBackFunction": function (_result) {
            if (_result.result == "true") {
                var str = _result.path;
                window.open(str, 'mywindow');
            } else {
                AgiCommonDialogBox.Alert(_result.message);
            }
        }
        });
    });
}
//endregion
//region 编辑数据后显示对照图形
Agi.Controls.CustomSigChartLastChartShow = function (_Controls) {
    var Me = _Controls;
    if (Me.Get("LastChartImgIsExt")) {
        Agi.Controls.CustomSigChartLastChartShowMenu(Me, true);
    } else {
        var _canvas = [];
        var ControlPanelID = $(Me.Get('HTMLElement'))[0].id;
        var svgList = $("#" + ControlPanelID).find("svg");
        for (var i = 0; i < svgList.length; i++) {
            var newcanvas = document.createElement("canvas");
            var parent = $(svgList[i]).parent();
            canvg(newcanvas, parent.html());
            $(parent).append(newcanvas);
            $(svgList[i]).hide();

            _canvas.push(newcanvas);
        }
        html2canvas($("#" + ControlPanelID)[0], {
            onrendered: function (canvas, a) {
                $("svg").show();
                for (var i = 0; i < _canvas.length; i++) {
                    $(_canvas[i]).remove();
                }
                if ($("#" + ControlPanelID + "_Img").length > 0) {
                    $("#" + ControlPanelID + "_Img").remove();
                }
                var ThisControlObj = Me.Get('chart');
                // $(ThisControlObj.renderTo).append("<div id='"+ControlPanelID+"_Img' class='SigChartLastImgPanel'><img src='"+canvas.toDataURL('image/png')+"' style='width:100%;height:100%;'></div>");
                $("#" + ControlPanelID).append("<div id='" + ControlPanelID + "_Img' class='SigChartLastImgPanel'><img src='" + canvas.toDataURL('image/png') + "' style='width:100%;height:100%;'></div>");
                $("#" + ControlPanelID + "_Img").height(parseInt($("#" + ControlPanelID).height() / 2));
                Agi.Controls.CustomSigChartLastChartShowMenu(Me, true);
                Me.Set("LastChartImgIsExt", true);
            }
        });
        Me.Set("IsShowLastChart", false);
    }
}
Agi.Controls.CustomSigChartRefreshShowExe = function (_Controls) {
    return function () {
        _Controls.RefreshByProPanelUp();
    };
}

Agi.Controls.CustomSigChartLastChartShowMenu = function (_Control, _IsShow) {
    var Me = _Control;
    var _ApendToPanel = Me.Get("HTMLElement");
    if (_IsShow) {
        if ($("#CustomSigChartLastImgMenu").length > 0) {
        } else {
            var CustomSigChartLastImgHTML = $("<div id='CustomSigChartLastImgMenu' class='AlarmStyLasgImg' data-state='0'>查看原始图形</div>").appendTo($(_ApendToPanel));
            $("#CustomSigChartLastImgMenu").css({"right": "78px", "top": "8px"});
        }
        $("#CustomSigChartLastImgMenu").show();
        $("#CustomSigChartLastImgMenu").unbind().bind("click", function (ev) {
            var ControlPanelID = $(Me.Get('HTMLElement'))[0].id;
            if ($(this).data("state") == "0") {
                $(this).data("state", "1");
                $(this).html("隐藏原始图形");
                var ThisControlObj = Me.Get('chart');
                ThisControlObj.setSize($("#" + ControlPanelID).width(), parseInt($("#" + ControlPanelID).height() / 2));
                /*Chart 更改大小*/
                $("#" + ControlPanelID + "_Img").appendTo($(ThisControlObj.renderTo)).show();
            } else {
                $(this).data("state", "0");
                $(this).html("查看原始图形");
                $("#" + ControlPanelID + "_Img").appendTo($("#" + ControlPanelID)).hide();
                var ThisControlObj = Me.Get('chart');
                ThisControlObj.setSize($("#" + ControlPanelID).width(), $(ThisControlObj.renderTo).height());
                /*Chart 更改大小*/
            }
        });
    } else {
        $("#CustomSigChartLastImgMenu").hide();//隐藏
    }

}
//显示单值图数据钻取参数列表
Agi.Controls.CustomSigChartParsListUpdate = function (_Paras, _ListPanelID) {
    var StrListItems = "";
    if (_Paras != null && _Paras.length > 0) {
        for (var i = 0; i < _Paras.length; i++) {
            StrListItems += " <div class='ParsListHeadSty'><div class='CustomSigChartParsListCellSty'>" + _Paras[i].Name + "</div><div class='CustomSigChartParsListCellSty'>" + _Paras[i].Column + "</div></div>";
        }
    }
    $("#" + _ListPanelID).html(StrListItems);
}
//endregion
function cancleM1() {
    $("#CustomBoxChart_mergeGroup").prop("checked", false);
}
function cancleM2() {
    $("#CustomBoxChart_mergeData").prop("checked", false);
}