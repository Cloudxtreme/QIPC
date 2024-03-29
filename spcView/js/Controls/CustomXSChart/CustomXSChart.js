/**
* Created with JetBrains WebStorm.
* User: markeluo
* Date: 13-10-28
* Time: 上午10:17
 *Update:
 *Detail:均值标准差XS
* To change this template use File | Settings | File Templates.
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/

Agi.Controls.CustomXSChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){//获得实体数据
            var entity = this.Get('Entity')[0];
            if(entity !=undefined && entity !=null){
                return entity.Data;
            }else{
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
            var entity = [];
            this.Set("EntityInfo", _EntityInfo);
            Me.Set("PlotLines",[]);

            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
                d.Data=Agi.Controls.DataConvertManager.DataInterception(d.Data,1000);
                _EntityInfo.Data = d.Data;
                if(d.Columns!=null && d.Columns.length>0){
                    _EntityInfo.Columns = d.Columns;
                }
                //默认绑定字段
                var cp = Me.Get('ChartProperty')
                if(!cp.SeriesGroupColumnIsApply){
                    cp.SeriesGroupColumn=_EntityInfo.Columns[0];
                    cp.SeriesDataColumn=[_EntityInfo.Columns[1]];
                }
                Me.Set('ChartProperty',cp);

                _EntityInfo.Data=Me.DataSortByGrpName(_EntityInfo.Data);

                entity.push(_EntityInfo);
                Me.Set("Entity", entity);

                Me.AddEntity(entity[0]); /*添加实体*/
                Me.chageEntity = true;
            });
        },
        ReadOtherData: function (_PointID) {//测试数据
            var checkDataSeries ={
                Mean_data:[{ Names: "", min: 0, max: 4, minValue: 1, middleValue: 2, maxValue: 3, Data: [],Isigma:3}],
                SD_data:[{ Names: "", min: 0, max: 4, minValue: 1, middleValue: 2, maxValue: 3, Data: [],Isigma:3}]};
            var cp = this.Get("ChartProperty");
            if(typeof cp == 'undefined'){
                return;
            }
            cp.chart_MarginRight = 30;
            cp.xAxis_Auxiliary_Enabled = false;
            cp.yAxis_Auxiliary_Enabled = false;
//            cp.series_MinPlotLine_Enabled = false;
//            cp.series_MaxPlotLine_Enabled = false;
//            cp.series_MiddlePlotLine_Enabled = false;
            this.Set("ChartProperty", cp);
            this.Set("CheckDataSeries", checkDataSeries);
            this.SetChartDataProperty();
            this.InitHighChart();
            function GetData(objValue) {
                var minValue = objValue.minValue;
                var maxValue = objValue.maxValue;
                var objData = [];
                for (var i = 1; i <= (objValue.max - objValue.min); i++) {
                    var x = objValue.min + i;
                    var y = parseInt(GetRandomValue(parseInt(minValue) - 50, parseInt(maxValue) + 50));
                    if (y > maxValue)
                        y = { x: x, y: y, marker: { fillColor: 'red'} };
                    else if (y < minValue)
                        y = { x: x, y: y, marker: { fillColor: 'blue', width: 100} };
                    else
                        y = { x: x, y: y };
                    objData.push(y);
                }
                return objData;
            }
            function GetRandomValue(_minValue, _maxValue) {//随机数取得，_minValue：最小范围值，_maxValue：最大范围值
                return parseInt(_minValue) + parseInt(_maxValue - _minValue) * Math.random();
            }
        },
        AddEntitySingle: function (_entity) {
            var Me = this;
            Me.Set("FilterData",_entity.Data);

            Me.ChartLoadByData(_entity.Data);//加载数据
        },//均值极差图
        ChartLoadByData:function(_Data){
            $('#pointMenu').hide();//图形刷新前隐藏原数据点右键菜单
            var Me=this;
            var  ArrayBCName = [],DataArray = [], EntityData = [];
            var ArrayValue = [];
            if(_Data!=null && _Data.length>0){
                EntityData=_Data;

                var cp = Me.Get('ChartProperty');//cp.SeriesGroupColumn cp.SeriesDataColumn
                if(cp.SeriesGroupColumn!=""){
                    //取出所有样本名称
                    for (var i = 0; i < EntityData.length; i++) {
                        ArrayBCName.push(EntityData[i][cp.SeriesGroupColumn]);
                    }
                    //样本名称去重复
                    var res = [], hash = {};
                    for (var i = 0, elem; (elem = ArrayBCName[i]) != null; i++) {
                        if (!hash[elem]) {
                            res.push(elem);
                            hash[elem] = true;
                        }
                    }
                    //去重之后的样本名称
                    ArrayBCName = res;
                    //根据样本名称去除对应样本值
                    for (var Name in ArrayBCName) {
                        ArrayValue=[];
                        for (var j = 0; j < EntityData.length; j++) {
                            if (EntityData[j][cp.SeriesGroupColumn] == ArrayBCName[Name]) {
                                ArrayValue.push(EntityData[j][cp.SeriesDataColumn[0]]);
                            }
                        }
                        DataArray.push(ArrayValue);
                    }
                }else{
                    ArrayBCName=[""];
                    for (var j = 0; j < EntityData.length; j++) {
                        ArrayValue.push(EntityData[j][cp.SeriesDataColumn[0]]);
                    }
                    DataArray.push(ArrayValue);
                }
                if(cp.ChartisigmaValue!=null && cp.ChartisigmaValue!=""){}else{
                    cp.ChartisigmaValue=3;
                }
                if(cp.ChartisigmaLineVisible!=null){}else{
                    cp.ChartisigmaLineVisible=true;
                }
                //获取每组数根据子组大小分组后剩余记录数，并属性保存备用
                Me.Set("GroupLaves",Agi.Controls.CustomXSChart.GroupSizeDataSave(DataArray,cp.chart_Data_NRow));

                var jsonData = { "action": "RCalMeanSDPlot",
                    "name": ArrayBCName,
                    "dataArray": DataArray,
                    "isigma":cp.ChartisigmaValue, //西格玛系数
                    "nrow":cp.chart_Data_NRow,//子组大小
                    "optionVal":cp.optionVal//标准差估计
                };
                var jsonString = JSON.stringify(jsonData);
                Agi.DAL.ReadData({ "MethodName": "RCalMeanSDPlot", "Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result && _result.result == "true") {
                        var cp = Me.Get("ChartProperty");
                        var checkDataSeries ={Mean_data:[],SD_data:[]}; //{ min: 0, max: 30, minValue: 20, maxValue: 280, Names: "甲", Data: [] },
                        var GroupLaves=Me.Get("GroupLaves");
                        if (_result.Mean_data != null &&
                            _result.name != null &&
                            _result.Mean_data.length == _result.name.length) {
                            for (var i = 0; i < _result.Mean_data.length; i++) {
                                var min = checkDataSeries.Mean_data.length > 0 ? checkDataSeries.Mean_data[checkDataSeries.Mean_data.length - 1].max : 0;
                                var max = min + _result.Mean_data[i].values.length;
                                checkDataSeries.Mean_data.push({
                                    Names: _result.name[i],
                                    min: min,
                                    max: max,
                                    minValue: _result.Mean_data[i].LCL,
                                    middleValue: _result.Mean_data[i].XBarBar,
                                    maxValue: _result.Mean_data[i].UCL,
                                    Isigma: _result.Mean_data[i].Msigma,
                                    LaveNum:GroupLaves.Items[i],
                                    Nrow:GroupLaves.Nrow,
                                    Data: _result.Mean_data[i].values
                                })
                            }
                        }
                        else {
                            Me.ReadOtherData("");
                        }

                        if (_result.S_data != null &&
                            _result.name != null &&
                            _result.S_data.length == _result.name.length) {
                            for (var i = 0; i < _result.S_data.length; i++) {
                                var min = checkDataSeries.SD_data.length > 0 ? checkDataSeries.SD_data[checkDataSeries.SD_data.length - 1].max : 0;
                                var max = min + _result.S_data[i].values.length;
                                checkDataSeries.SD_data.push({
                                    Names: _result.name[i],
                                    min: min,
                                    max: max,
                                    minValue: _result.S_data[i].LCL,
                                    middleValue: _result.S_data[i].SBar,
                                    maxValue: _result.S_data[i].UCL,
                                    Isigma: _result.S_data[i].Ssigma,
                                    LaveNum:GroupLaves.Items[i],
                                    Nrow:GroupLaves.Nrow,
                                    Data: _result.S_data[i].values
                                })
                            }
                        }
                        else {
                            Me.ReadOtherData("");
                        }

                        cp.chart_MarginRight = 150;
                        cp.xAxis_Auxiliary_Enabled = true;
                        cp.yAxis_Auxiliary_Enabled = true;
                        Me.Set("ChartProperty", cp);
                        Me.Set("CheckDataSeries", checkDataSeries);
                        Me.SetChartDataProperty();
                        Me.InitHighChart();
                    }
                    else {
                        Me.ReadOtherData("");
                    }
                }
                });
            }
        },//图表加载数据 20130817 markeluo
        DataSortByGrpName:function(_Data){
            var Me=this;
            var EntityData=[],ArrayBCName=[];
            var TempArray=[];
            if(_Data!=null && _Data.length>0){
                var cp = Me.Get('ChartProperty');//cp.SeriesGroupColumn cp.SeriesDataColumn
                var Groupname=cp.SeriesGroupColumn;

                var res = [], hash = {};
                //取出所有样本名称
                if(Groupname!=""){
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
                if(res!=null && res.length>0){
                    for(var i=0;i<res.length;i++){
                        for(var len=0;len<_Data.length;len++){
                            if(_Data[len][Groupname]==res[i]){
                                TempArray.push(_Data[len]);
                            }
                        }
                    }
                }else{
                    for(var len=0;len<_Data.length;len++){
                        TempArray.push(_Data[len]);
                    }
                }
            }
            EntityData=ArrayBCName=null;
            return TempArray;
        },//根据分组名称对_Data进行分组排序
        RefreshByProPanelUp:function(){
            var Me=this;
            var FilterData=Me.Get("FilterData");
            if(FilterData==null){
                FilterData= Me.Get("Entity")[0].Data;
            }
            Me.ChartLoadByData(FilterData);//加载数据
        },//属性更新后，图表刷新 20130817 markeluo
        UpPlotLineGroups:function(_PlotLineGrps){
            //[{GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000, MaxReviseSig:上限修正符号,MaxReviseValue:上限修正值,MinReviseSig:下限修正符号,MinReviseValue:下限修正值}]
            //MaxValueType&MinValueType:0,代表Value为输入值 ;1，代表选择对应的Value为字段名
            var Me=this;
            Me.Set("NoFormatPlotLines",_PlotLineGrps);
        },//更新标准线组 20130815 markeluo
        UpPlotLineGroups_SD:function(_PlotLineGrps){
            //[{GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000, MaxReviseSig:上限修正符号,MaxReviseValue:上限修正值,MinReviseSig:下限修正符号,MinReviseValue:下限修正值}]
            //MaxValueType&MinValueType:0,代表Value为输入值 ;1，代表选择对应的Value为字段名
            var Me=this;
            Me.Set("NoFormatPlotLines_SD",_PlotLineGrps);
        },//更新标准线组 20130815 markeluo
        UpSigmConditions:function(_rules){
            var Me=this;
            Me.Set("SigXSules",_rules);//保存八项判异规则
        },//图表应用西格玛线判异规则 20130817 markeluo
        UpChartwarnRule:function(_warnRule){
            //_warnRule {warnColumn,warnRule,warnCompareValue,warnColor}
            var Me=this;
            Me.Set("WarnRule",_warnRule);//特殊报警功能
        },//图表特殊报警判异规则 20130817 markeluo
        FilterDataUpShow:function(_filterData){
            var Me=this;
            Me.Set("FilterData",_filterData);
            Me.ChartLoadByData(_filterData);//重新加载数据
        },//筛选数据后，更新显示  20130817 markeluo
        UpSeriesBindInfo:function(_dataLine){
            //_dataLine:{SeriesName,GroupColumn,DataColumn,SeriesColor,SeriesMarkerColor}
            var Me=this;
            var cp = Me.Get('ChartProperty');
            cp.series_DataColor=_dataLine.SeriesColor;
            cp.series_PointMarkerColor=_dataLine.SeriesMarkerColor;
            cp.SeriesGroupColumn=_dataLine.GroupColumn;
            cp.SeriesGroupColumnIsApply=true;//已应用
            cp.SeriesDataColumn=[_dataLine.DataColumn];
            cp.chart_Data_NRow=_dataLine.GroupSize;

            var FilterDataArray=Me.Get("FilterData");
            if(FilterDataArray!=null && FilterDataArray.length>0){
                FilterDataArray=Me.DataSortByGrpName(FilterDataArray);
            }else{
                    FilterDataArray= Me.DataSortByGrpName(Me.Get("Entity")[0].Data);
            }
            Me.Set('ChartProperty',cp);
            Me.Set("FilterData",FilterDataArray);
        },//更改曲线设置后，更新显示  20130817 markeluo
        GetDataSeries:function(){
            var Me=this;
            var TwoChartSeries= Me.Get('ChartSeries');
            var DataSeries={
                    Mean_data:Agi.Controls.CustomXSChartGetDataSries(TwoChartSeries.Mean_data,true),
                    SD_data:Agi.Controls.CustomXSChartGetDataSries(TwoChartSeries.SD_data,true)
                }
            return DataSeries;
        },//获取当前图表对应的数据series(非标准线)  20130817 markeluo
        RefinementData:function(_RowData){
            //window.open(Agi.ViewServiceAddress + pageName + "&isView=true");
            var strParam = '';
            for(var key in _RowData){
                if(strParam!=""){
                    strParam += '&'+ (key + '=' + _RowData[key]) ;
                }
                else{
                    strParam += (key + '=' + _RowData[key]) ;
                }

            }

            window.open("page2.html?"+strParam);
        },//数据钻取/查看详情  20130817 markeluo
        DisabledDataDrill:function(){
            var Me=this;
            Me.Set("DataDrillState",false);//禁用钻取
        },//禁用数据钻取功能 20130820 13:26 markeluo
        RemoveALLPlotLine:function(){
            var Me=this;
            var PlotLines=Me.Get("PlotLines");
            if(PlotLines!=null){
                //获取当前标准线组的标准线元素
                var PlotLineArray=[];
                for(var i=0;i<PlotLines.length;i++){
                    PlotLineArray.push(PlotLines[i].Items[0].id);
                    PlotLineArray.push(PlotLines[i].Items[1].id);
                }
                for(var i=0;i<PlotLineArray.length;i++){
                    Me.Get('chart').yAxis[0].removePlotLine(PlotLineArray[i]);
                }
                for(var i=0;i<PlotLines.length;i++){
                    PlotLines.splice(0,1);
                }
            }
            Me.ShowALLPlotLineGroup();
        },
        ShowALLPlotLineGroup:function(){
            var Me=this;
            //更新超出标准线的point点
            var chartSeries = Me.Get('ChartSeries');//图表曲线Sries,均值+极差
            var checkDataSeries = this.Get('CheckDataSeries');//图表曲线分组,均值+极差
            var FilterData=Me.Get("FilterData");//筛选数据
            var WarnRuleValue=Me.Get("WarnRule");//特殊报警功能

            //region 1.均值图
            var CusXSChart_Mean=Me.Get('chart');
            var PlotLineAndBands= CusXSChart_Mean.yAxis[0].plotLinesAndBands[0];
            if(PlotLineAndBands!=null&& PlotLineAndBands.length>0){
                for(var i=0;i<PlotLineAndBands.length;i++){
                    CusXSChart_Mean.yAxis[0].removePlotLine(PlotLineAndBands[i].id);
                }
            }
            var _PlotLineGrps=Me.Get("NoFormatPlotLines");
            var PlotLines=[];
            var newGroup=null;
            if(_PlotLineGrps!=null && _PlotLineGrps.length>0){
                for(var i=0;i<_PlotLineGrps.length;i++){
                    newGroup=Agi.Controls.CustomXSChartFormatPlotGrpPars(Me.Get("Entity")[0],_PlotLineGrps[i]);//新增标准线组
                    if(newGroup!=null){
                        PlotLines.push({GroupName:_PlotLineGrps[i].GroupName,Items:newGroup});
                    }
                }
            }
            Me.Set("PlotLines",PlotLines);

            if(PlotLines!=null){
                //获取当前标准线组的标准线元素
                var Yasixobj=CusXSChart_Mean.yAxis[0];
                for(var i=0;i<PlotLines.length;i++){
                    Yasixobj.addPlotLine(PlotLines[i].Items[0]);
                    Yasixobj.addPlotLine(PlotLines[i].Items[1]);
                }
            }

            var DataSeries=Agi.Controls.CustomXSChartGetDataSries(chartSeries.Mean_data);
            Agi.Controls.CustomXSChartPlotLineUpSeries(DataSeries,PlotLines);//更新Series 点数据

            //特异判断规则应用，更改series 点的颜色
            if(WarnRuleValue!=null && WarnRuleValue.warnColumn!=null && FilterData!=null && FilterData.length>0){
                var bool=false;
                if(checkDataSeries.Mean_data!=null && checkDataSeries.Mean_data.length>0){
                    var PointRows=null;
                    for(var j=0;j<DataSeries[0].data.length;j++){
                        PointRows= Agi.Controls.CustomXSChart.FindDataRowsByPoint(checkDataSeries.Mean_data,DataSeries[0].data[j].x);
                        bool=Agi.Controls.WarnValueCompare(FilterData[PointRows[0]][WarnRuleValue.warnColumn],WarnRuleValue.warnCompareValue,WarnRuleValue.warnRule);
                        if(bool){
                            DataSeries[0].data[j].marker={fillColor:WarnRuleValue.warnColor};
                        }
                    }
                }

                if(chartSeries.Mean_data!=null && chartSeries.Mean_data.length>0){
                    for(var i=0;i<chartSeries.Mean_data.length;i++){
                        for(var j=0;j<DataSeries.length;j++){
                            if(chartSeries.Mean_data[i].name==DataSeries[j].name){
                                chartSeries.Mean_data[i].data=DataSeries[j].data;
                            }
                        }
                    }
                }
            }

            if(DataSeries!=null && DataSeries.length>0){
                for(var i=0;i<CusXSChart_Mean.series.length;i++){
                    for(var j=0;j<DataSeries.length;j++){
                        if(CusXSChart_Mean.series[i].name==DataSeries[j].name){
                            CusXSChart_Mean.series[i].remove();
                            i=-1;
                            break;
                        }
                    }
                }

                for(var i=0;i<DataSeries.length;i++){
                    DataSeries[i].data=Me.ApplySigXSule(DataSeries[i].data,checkDataSeries.Mean_data);//应用西格玛八项判异规则
                    CusXSChart_Mean.addSeries(DataSeries[i]);
                }
            }
           //endregion

            //region 2.极差图
            var CusXSChart_SD=Me.Get('chart_SD');
            var PlotLineAndBands= CusXSChart_SD.yAxis[0].plotLinesAndBands[0];
            if(PlotLineAndBands!=null&& PlotLineAndBands.length>0){
                for(var i=0;i<PlotLineAndBands.length;i++){
                    CusXSChart_SD.yAxis[0].removePlotLine(PlotLineAndBands[i].id);
                }
            }
            var _PlotLineGrps=Me.Get("NoFormatPlotLines_SD");
            var PlotLines_sd=[];
            var newGroup=null;
            if(_PlotLineGrps!=null && _PlotLineGrps.length>0){
                for(var i=0;i<_PlotLineGrps.length;i++){
                    newGroup=Agi.Controls.CustomXSChartFormatPlotGrpPars(Me.Get("Entity")[0],_PlotLineGrps[i]);//新增标准线组
                    if(newGroup!=null){
                        PlotLines_sd.push({GroupName:_PlotLineGrps[i].GroupName,Items:newGroup});
                    }
                }
            }
            Me.Set("PlotLines_SD",PlotLines_sd);

            if(PlotLines_sd!=null){
                //获取当前标准线组的标准线元素
                var Yasixobj=CusXSChart_SD.yAxis[0];
                for(var i=0;i<PlotLines_sd.length;i++){
                    Yasixobj.addPlotLine(PlotLines_sd[i].Items[0]);
                    Yasixobj.addPlotLine(PlotLines_sd[i].Items[1]);
                }
            }

            var DataSeries=Agi.Controls.CustomXSChartGetDataSries(chartSeries.SD_data);
            Agi.Controls.CustomXSChartPlotLineUpSeries(DataSeries,PlotLines_sd);//更新Series 点数据

            //特异判断规则应用，更改series 点的颜色
            if(WarnRuleValue!=null && WarnRuleValue.warnColumn!=null && FilterData!=null && FilterData.length>0){
                var bool=false;
                if(checkDataSeries.SD_data!=null && checkDataSeries.SD_data.length>0){
                    var PointRows=null;
                    for(var j=0;j<DataSeries[0].data.length;j++){
                        PointRows= Agi.Controls.CustomXSChart.FindDataRowsByPoint(checkDataSeries.SD_data,DataSeries[0].data[j].x);
                        bool=Agi.Controls.WarnValueCompare(FilterData[PointRows[0]][WarnRuleValue.warnColumn],WarnRuleValue.warnCompareValue,WarnRuleValue.warnRule);
                        if(bool){
                            DataSeries[0].data[j].marker={fillColor:WarnRuleValue.warnColor};
                        }
                    }
                }

                if(chartSeries.SD_data!=null && chartSeries.SD_data.length>0){
                    for(var i=0;i<chartSeries.SD_data.length;i++){
                        for(var j=0;j<DataSeries.length;j++){
                            if(chartSeries.SD_data[i].name==DataSeries[j].name){
                                chartSeries.SD_data[i].data=DataSeries[j].data;
                            }
                        }
                    }
                }
            }

            if(DataSeries!=null && DataSeries.length>0){
                for(var i=0;i<CusXSChart_SD.series.length;i++){
                    for(var j=0;j<DataSeries.length;j++){
                        if(CusXSChart_SD.series[i].name==DataSeries[j].name){
                            CusXSChart_SD.series[i].remove();
                            i=-1;
                            break;
                        }
                    }
                }

                for(var i=0;i<DataSeries.length;i++){
                    DataSeries[i].data=Me.ApplySigXSule(DataSeries[i].data,checkDataSeries.SD_data);//应用西格玛八项判异规则
                    CusXSChart_SD.addSeries(DataSeries[i]);
                }
            }
            //endregion

//           //标准线、西格玛线 统计信息
//           var tolInfo=Agi.Controls.CustomXSChartAlarmStatistical(chartSeries,PlotLines);//统计信息
//           var AppendToPanel=Me.Get("HTMLElement");
//            var cp=Me.Get('ChartProperty');
//            tolInfo.SGM.SigmaValue=cp.ChartisigmaValue;//西格玛系数
//            Agi.Controls.CustomXSChartAlarmStatisticalTableShow(tolInfo,AppendToPanel,cp.ChartBackConfig);
        },//显示标准线
        GridTdAbnormal:function(array){
//            debugger;
            if(array!=null && array.length>0){
                var grid = this.grid;
                if(grid){
                    var index=-1;
                    for(var i=0;i<grid.wijgrid('columns').length;i++){
                        if(grid.wijgrid('columns')[i].options.dataKey==array[0].column){
                            index=i;
                        }
                    }
                    var pageIndex=grid.wijgrid('option','pageIndex');
                    var pageSize = grid.wijgrid('option','pageSize');
                    for(var i=0;i<array.length;i++){
                        if(array[i].row>=pageIndex*pageSize && array[i].row<pageIndex*pageSize+5){
                            $($(grid.find('tbody>tr')[(array[i].row)%(pageIndex*pageSize)]).find('td')[index]).css('color',array[i].color);
                        }
                    }
                }
            }
        },//修改数据表格报警点颜色
        ApplySigXSule:function(_SeriesDataArray,_CheckDataSeries){
            var Me=this;
            var SigmArray= Me.Get("SigXSules");//八项判异规则数组
            var NewSeriesData=_SeriesDataArray;
            if(SigmArray!=null && SigmArray.length>0){
                ////待实现
                //NewSeriesData=SigmArlmFunc({SeriesData:_SeriesDataArray,SigXSule:SigmArray,GroupData:CheckDataSries});
                var NewCheckDataSries=Agi.Controls.SigXSuleApplyGetGroupData(_CheckDataSeries);//分组数据信息
                var ojb = new XSclsSigmaFunc(_SeriesDataArray,SigmArray,NewCheckDataSries);
                NewSeriesData = ojb.check();
            }
            return NewSeriesData;
        },//应用西格玛八项规则
        ShowDataTable:function(){

        },//显示表格数据
        AddEntity: function (_entity) {
            var Me=this;
            if (_entity.Data && _entity.Data.length <= 0) {
                this.ReadOtherData("");
                return;
            }
            var cp = this.Get("ChartProperty");
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
            this.Set("dataGridArray",[]);
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "CustomXSChart");
            this.Set('IntervalID', null); //预先保存定时器ID
            this.Set("ChartParameters", { Key: false, Points: [] }); //预先保存结构
            this.Set("ChartCurrentData", []); //设置及时刷新数据显示
            this.Set("PointsParamerters", []); //注册数据点位号保存，点位号集合，结构["11AE84102","11AE84015","11AE84103"]
            var ID = savedId ? savedId : "CustomXSChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty SPCPanelSty'></div>");

            var PostionValue ={ Left: 0, Top: 0, Right: 0, Bottom: 0 };
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
                height:PagePars.Height,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:50%;margin: 0 auto;border:solid 1px #dcdcdc;">' + '</div>' +
                '<div id="' + ID + '_SD" style="width:100%;height:50%;margin: 0 auto;border:solid 1px #dcdcdc;">' + '</div>');
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
            this.SetChartProperty(ID,ID+"_SD");
            //测试数据
            this.ReadOtherData("");

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

            //默认西格玛规则
            var DefaultruleArray=[
                {NO:1,Kvalue:3,color:"#f00",ischecked:true},
                {NO:2,Kvalue:9,color:"#f00",ischecked:false},
                {NO:3,Kvalue:6,color:"#f00",ischecked:false},
                {NO:4,Kvalue:14,color:"#f00",ischecked:false},
                {NO:5,Kvalue:2,color:"#f00",ischecked:false},
                {NO:6,Kvalue:4,color:"#f00",ischecked:false},
                {NO:7,Kvalue:15,color:"#f00",ischecked:false},
                {NO:8,Kvalue:8,color:"#f00",ischecked:false}
            ];
            this.Set("SigXSules",DefaultruleArray);

            if (Agi.Edit) {
                //缩小的最小宽高设置
                HTMLElementPanel.resizable({
                    minHeight:200,
                    minWidth: 350
                });
            }
            //20130515 倪飘 解决bug，组态环境中拖入均值极差图控件以后拖入容器框控件，容器框控件会覆盖均值极差图控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        },//end Init
        GetYValue: function () {
            var cp = this.Get('ChartProperty');
            var result ={Mean_YValue:1,SD_YValue:1};
            result.Mean_YValue=parseInt((cp.yAxis_PlotLines_Max - cp.yAxis_PlotLines_Min) / 3);
            result.Mean_YValue=result.Mean_YValue <= 0 ? 1 : result.Mean_YValue;
            result.SD_YValue=parseInt((cp.yAxis_PlotLines_Max_SD - cp.yAxis_PlotLines_Min_SD) / 3);
            result.SD_YValue=result.SD_YValue <= 0 ? 1 : result.SD_YValue;

            return result;
        },
        SetChartProperty: function (_objCanvasAreaID,_objCanvasSDID) {//初始化定义图形控件属性结构，并预设值属性，_objCanvasAreaID：画布显示区域ID
            //图形基本结构定义
            var chartProperty = {
                chart_Data_Type: "均值标准差图",
                chart_Data_NRow:2,
                chart_PointNumber: 20, //当前图形范围所显示的点位
                chart_RenderTo: _objCanvasAreaID, //画布ID,均值图
                chart_RenderTo_SD:_objCanvasSDID,//画布ID,极差图
                chart_Type: 'line', //'spline',//显示图形
                chart_MarginTop: 30, //图形距画框右边距距离
                chart_MarginRight: 80, //图形距画框右边距距离
                chart_Reflow: true, //图形是否跟随放大
                chart_Animation: false, //动画平滑滚动
                chart_PlotBorderWidth: 1, //数据图表区域边框宽度
                chart_PlotBorderColor: "#5c5757", //数据图表区域边框颜色
                chart_BackgroundColor:{"linearGradient":{"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#ededed"],[1,"#ededed"]]}, //"#C9E8E2",//数据图表区域颜色
                chart_Title_Text: '', //标题文字
                Axis_TickColor: "#5c5757", //轴线刻度颜色
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
                xAxis_PlotLines: [], //参考线位置，计算取得,均值图
                xAxis_PlotLines_SD: [], //参考线位置，计算取得,极差图
                xAxis_PlotLines_LineColor: "blue", //参考线颜色
                xAxis_PlotLines_LineWidth: 1, //参考线宽度
                xAxis_PlotLines_DashStyle: "longdash", //X轴参考线显示类型 longdash：虚线
                xAxis_LinkedTo: 0, //未知，用于第二X轴，伪轴显示
                xAxis_Opposite: true, //是否相反方向显示
                xAxis_TickPositions: [], //显示X轴线指定值,均值图
                xAxis_TickPositions_SD: [], //显示X轴线指定值,极差图
                yAxis_TickPositions: [], //显示Y轴线指定值,均值图
                yAxis_TickPositions_SD:[],//显示Y轴线指定值,极差图
                yAxis_Title_Text: '样本均值', //Y轴标题文字,均值图
                yAxis_Title_Text_SD: '样本标准差', //Y轴标题文字,极差图
                //yAxis_Title_Margin: 50,//Y轴TITLE左边距
                yAxis_Min: 0, //Y轴最小值
                yAxis_Min_SD: 0, //Y轴最小值,极差图
                yAxis_Max: 280, //Y轴最大值
                yAxis_Max_SD: 280, //Y轴最大值,极差图
                yAxis_PlotLines_Max: 0, //数据最大值,均值图
                yAxis_PlotLines_Max_SD: 0, //数据最大值，极差图
                yAxis_PlotLines_Min: 0, //数据最小值,均值图
                yAxis_PlotLines_Min_SD: 0, //数据最小值，极差图
                yAxis_GridLineWidth: 0, //Y轴表格线宽度显示
                yAxis_LineWidth: 0, //X轴轴线宽度
                yAxis_TickWidth: 1,
                yAxis_TickPosition: "outside",
                series_MinPlotLine_Color: "#f41d12", //最低参考线颜色
                series_MinPlotLine_Enabled: true, //是否显示最低参考线
                series_MinPlotLine_Names: "LCL", //是否显示最低参考线 markeluo 20121126 LCL与UCL 写反了
                series_MiddlePlotLine_Color: "green", //中间值参考线颜色
                series_MiddlePlotLine_Enabled: true, //是否显示中间参考线
                series_MiddlePlotLine_Names: "X", //是否显示最低参考线
                series_MiddlePlotLine_Names_SD: "S", //是否显示最低参考线,极差图
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
                series_DataColor: '#fb8814', //20130817 12:01 markeluo修改 数据线颜色
                series_PointMarkerColor: '#62a6f6', //20130817 12:01 markeluo 添加 数据线颜色
                SeriesGroupColumn:"",//20130817 12:01 markeluo 添加 曲线分组列
                SeriesGroupColumnIsApply:false,//20131017 16:32 markeluo 分组列是否已设置
                SeriesDataColumn:[],//20130817 12:01 markeluo 添加 曲线数据列(可能为多列)
                ChartisigmaValue:3,//20130817 12:01 markeluo 添加 西格玛系数
                ChartisigmaLineVisible:true,//20130916 西格玛线是否显示
                yAxis_PlotLines_MinMarkerColor: '#f41d12', //西格玛 上限颜色
                yAxis_PlotLines_MaxMarkerColor: '#f41d12', //西格玛 下限颜色
                ChartBackConfig:
                {
                    backgroundColor:{"linearGradient":{"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#ededed"],[1,"#ededed"]]},//背景
                    Tolbtnbackground:"#cecece",//菜单按钮背景
                    TolbtnFontColor:"#3d95e6",//菜单按钮字体
                    TolTabbackground:"#dbdbdb",//统计表格背景
                    TolTabFontColor:"#000000"//统计表格字体
                },//背景配置
                optionVal:"mergeStdDev"//标准差估计(合并标准差)
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
            var chartSeries ={Mean_data:[],SD_data:[]};
            //region 1.均值图属性
            if(checkDataSeries.Mean_data!=null && checkDataSeries.Mean_data.length>0){
                {//数据结构生成
                    var dataMin = [];
                    var dataMiddle = [];
                    var dataMax = [];
                    var seriesMinValue = 0;
                    var seriesMiddleValue = 0;
                    var seriesMaxValue = 0;
                    for (var i = 0; i < checkDataSeries.Mean_data.length; i++) {
                        var obj = checkDataSeries.Mean_data[i];

                        obj.Data = Agi.Controls.CustomXSChart.GetData(obj,cp); //获取模拟数据

                        dataMin.push([obj.min, obj.minValue]);
                        dataMin.push([obj.max, obj.minValue]);
                        if (i != checkDataSeries.Mean_data.length - 1) dataMin.push(null);

                        dataMiddle.push([obj.min, obj.middleValue]);
                        dataMiddle.push([obj.max, obj.middleValue]);
                        if (i != checkDataSeries.Mean_data.length - 1) dataMiddle.push(null);

                        dataMax.push([obj.min, obj.maxValue]);
                        dataMax.push([obj.max, obj.maxValue]);
                        if (i != checkDataSeries.Mean_data.length - 1) dataMax.push(null);

                        if (i === checkDataSeries.Mean_data.length - 1) {
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
                }
                {//生成数据
                    var seriesData = [];
                    for (var i = 0; i < checkDataSeries.Mean_data.length; i++) {
                        var obj = checkDataSeries.Mean_data[i];
                        seriesData = seriesData.concat(obj.Data);
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
                        chartSeries.Mean_data.push({
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
                        chartSeries.Mean_data.push({
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
                        chartSeries.Mean_data.push({
                            name: "max",
                            data: dataMax,
                            color: cp.yAxis_PlotLines_MaxMarkerColor,
                            lineWidth: cp.series_MaxPlotLine_LineWidth,
                            marker: {
                                enabled: false
                            }
                        });
                    }
                    chartSeries.Mean_data.push({
                        name: 'A',
                        data: seriesData,
                        color:cp.series_DataColor, //cp.series_DataColor,
                        lineWidth: cp.series_Data_LineWidth,
                        marker: {
                            color: cp.series_PointMarkerColor //cp.series_DataColor,
                        }
                    });
                }
            }
            //endregion

            //region 2.极差图属性
            if(checkDataSeries.SD_data!=null && checkDataSeries.SD_data.length>0){
                {//数据结构生成
                    var dataMin = [];
                    var dataMiddle = [];
                    var dataMax = [];
                    var seriesMinValue = 0;
                    var seriesMiddleValue = 0;
                    var seriesMaxValue = 0;
                    for (var i = 0; i < checkDataSeries.SD_data.length; i++) {
                        var obj = checkDataSeries.SD_data[i];

                        obj.Data = Agi.Controls.CustomXSChart.GetData(obj,cp); //获取模拟数据

                        dataMin.push([obj.min, obj.minValue]);
                        dataMin.push([obj.max, obj.minValue]);
                        if (i != checkDataSeries.SD_data.length - 1) dataMin.push(null);

                        dataMiddle.push([obj.min, obj.middleValue]);
                        dataMiddle.push([obj.max, obj.middleValue]);
                        if (i != checkDataSeries.SD_data.length - 1) dataMiddle.push(null);

                        dataMax.push([obj.min, obj.maxValue]);
                        dataMax.push([obj.max, obj.maxValue]);
                        if (i != checkDataSeries.SD_data.length - 1) dataMax.push(null);

                        if (i === checkDataSeries.SD_data.length - 1) {
                            seriesMinValue = obj.minValue;
                            seriesMiddleValue = obj.middleValue;
                            seriesMaxValue = obj.maxValue;

                            cp.yAxis_TickPositions_SD.push(seriesMinValue);
                            cp.yAxis_TickPositions_SD.push(seriesMiddleValue);
                            cp.yAxis_TickPositions_SD.push(seriesMaxValue);
                        }
                        cp.yAxis_PlotLines_Max_SD = cp.yAxis_PlotLines_Max_SD > obj.maxValue ? cp.yAxis_PlotLines_Max_SD : obj.maxValue;
                        cp.yAxis_PlotLines_Min_SD = cp.yAxis_PlotLines_Min_SD < obj.minValue ? cp.yAxis_PlotLines_Min_SD : obj.minValue;
                    }
                    this.Set('SeriesMinValue_SD', seriesMinValue);
                    this.Set('SeriesMiddleValue_SD', seriesMiddleValue);
                    this.Set('SeriesMaxValue_SD', seriesMaxValue);
                }
                {//生成数据
                    var seriesData = [];
                    for (var i = 0; i < checkDataSeries.SD_data.length; i++) {
                        var obj = checkDataSeries.SD_data[i];
                        seriesData = seriesData.concat(obj.Data);
                        cp.xAxis_TickPositions_SD.push(obj.min);
                        if (i === 0) continue;
                        cp.xAxis_PlotLines_SD.push({
                            color: cp.xAxis_PlotLines_LineColor,
                            width: cp.xAxis_PlotLines_LineWidth,
                            value: obj.min,
                            dashStyle: cp.xAxis_PlotLines_DashStyle
                        });
                    }
                    for (var i = 0; i < seriesData.length; i++) {
                        var obj = seriesData[i];
                        if (obj) {
                            cp.yAxis_PlotLines_Max_SD = cp.yAxis_PlotLines_Max_SD > obj.y ? cp.yAxis_PlotLines_Max_SD : obj.y;
                            cp.yAxis_PlotLines_Min_SD = cp.yAxis_PlotLines_Min_SD < obj.y ? cp.yAxis_PlotLines_Min_SD : obj.y;
                        }
                    }
                }
                {//配置数据属性
                    if (cp.series_MinPlotLine_Enabled) {
                        chartSeries.SD_data.push({
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
                        chartSeries.SD_data.push({
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
                        chartSeries.SD_data.push({
                            name: "max",
                            data: dataMax,
                            color: cp.yAxis_PlotLines_MaxMarkerColor,
                            lineWidth: cp.series_MaxPlotLine_LineWidth,
                            marker: {
                                enabled: false
                            }
                        });
                    }
                    chartSeries.SD_data.push({
                        name: 'A',
                        data: seriesData,
                        color:cp.series_DataColor, //cp.series_DataColor,
                        lineWidth: cp.series_Data_LineWidth,
                        marker: {
                            color: cp.series_PointMarkerColor //cp.series_DataColor,
                        }
                    });
                }
            }
            //endregion
            this.Set('ChartSeries', chartSeries);
        },
        PointClickEvent:function(_PointValue,_MenuType,_ChartNO){
            //{name:this.name,x:this.x,y:this.y,Time:点击时间}
            var Me=this;
            if(_MenuType!=null && _MenuType!=""){
                switch(_MenuType){
                    case 1:
                        Me.PointClick(_PointValue,_ChartNO);
                        break;
                    case 2:
                        Me.PointDbClick(_PointValue,_ChartNO);
                        break;
                    case 3:
                       // Me.PointPress(_PointValue);//数据钻取
                        break;
                    default :
                        break;
                }
            }
        },//Point点击处理
        PointClick:function(_PointValue,_ChartNO){
             var PointRow=_PointValue.x;
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var checkDataSeries = this.Get('CheckDataSeries');
            var ThisChartCheckSeries=null;
            if(_ChartNO==1){
                ThisChartCheckSeries=checkDataSeries.Mean_data;
            }else{
                ThisChartCheckSeries=checkDataSeries.SD_data;
            }
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:Agi.Controls.CustomXSChart.FindDataRowsByPoint(ThisChartCheckSeries,PointRow)//所选的异常点
            };
            var ThisDataSeries=Me.GetDataSeries();//获取当前曲线信息
            var ThisSelChartSeries=null;
            if(_ChartNO==1){
                ThisSelChartSeries=ThisDataSeries.Mean_data;
            }else{
                ThisSelChartSeries=ThisDataSeries.SD_data;
            }
            if(ThisSelChartSeries!=null && ThisSelChartSeries.length>0){
                for(var i=0;i<ThisSelChartSeries.length;i++){
                    Agi.Controls.CustomXSChartAlarmDataPointsFind(GridData,cp.SeriesDataColumn[i],ThisSelChartSeries[i],cp.series_PointMarkerColor,ThisChartCheckSeries);
                }
            }
            Agi.view.advance.refreshGridData(GridData);//调用View框架的定位源数据功能
        },//单击,1.源数据定位
        PointDbClick:function(_PointValue,_ChartNO){
            var Me=this;
            //{name:this.name,x:this.x,y:this.y,Time:点击时间}
            var FilterData=Me.Get("FilterData");
            var RowData=null;
            if(FilterData!=null && FilterData.length>(_PointValue.x-1)){
                RowData=FilterData[_PointValue.x-1];
                //Me.Abnormalpoint.AbnormalpointFrame(RowData);
                agi.using([  '../../customizePage/Abnormalpoint'],
                    function (Abnormalpoint) {
                        //异常点面板相关代码与控件建立连接关系
                        Me.Abnormalpoint = Abnormalpoint;
                        Me.Abnormalpoint.AbnormalpointFrame(RowData);
                    });
            }
        },//双击,2异常点存入数据库
        PointPress:function(_PointValue){
            var Me=this;
            var FilterData=Me.Get("FilterData");
            var rowData =null;
           if(FilterData!=null && _PointValue!=null && _PointValue.x>0 && FilterData.length>0){
               rowData=FilterData[_PointValue.x-1];
           }
            if(rowData!=null){
                Me.RefinementData(rowData);
            }
        },//长按,3数据钻取
        InitHighChart: function () {//初始化图形控件
            var Me=this;
            var cp = this.Get('ChartProperty');
            var checkDataSeries = this.Get('CheckDataSeries');
            var yValue = Me.GetYValue();
            var chartSeries = this.Get('ChartSeries');

            //region 1.均值图创建
            cp.yAxis_Min = cp.yAxis_PlotLines_Min - yValue.Mean_YValue / 4;
            cp.yAxis_Max = cp.yAxis_PlotLines_Max + yValue.Mean_YValue / 4;
            var seriesMinValue = this.Get('SeriesMinValue');
            var seriesMiddleValue = this.Get('SeriesMiddleValue');
            var seriesMaxValue = this.Get('SeriesMaxValue');
            {//轴线属性设置
                var xAxis = [];
                xAxis.push({
                    tickWidth: cp.xAxis_TickWidth,
                    tickPixelInterval: cp.xAxis_TickPixelInterval,
                    reversed: cp.xAxis_Reversed,
                    lineWidth: cp.xAxis_LineWidth,
                    tickColor: cp.Axis_TickColor,
                    minTickInterval:1,//最小步长
                    tickPosition: cp.xAxis_TickPosition,
                    plotLines: cp.xAxis_PlotLines
                });
                if (cp.xAxis_Auxiliary_Enabled) {
                    xAxis.push({
                        lineWidth: cp.xAxis_LineWidth,
                        linkedTo: cp.xAxis_LinkedTo,
                        opposite: cp.xAxis_Opposite,
                        tickWidth: cp.xAxis_TickWidth2,
                        minTickInterval:1,//最小步长
                        tickPositions: cp.xAxis_TickPositions,
                        labels: {
                            formatter: function () {
                                for (var i = 0; i < checkDataSeries.Mean_data.length; i++) {
                                    var obj = checkDataSeries.Mean_data[i];
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
                        text: cp.yAxis_Title_Text
                    },
//                    min: cp.yAxis_Min,
//                    max: cp.yAxis_Max,
                    gridLineWidth: cp.yAxis_GridLineWidth,
//                    tickInterval: yValue.Mean_YValue,
                    tickWidth: cp.yAxis_TickWidth,
                    tickColor: cp.Axis_TickColor,
                    tickPosition: cp.yAxis_TickPosition
                    , labels: {
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
            if (chartSeries && chartSeries.Mean_data && cp.chart_RenderTo) {
                Highcharts.setOptions({
                    global: {
                        useUTC: false//不使用夏令时
                    }
                });
                var series, chart;
                chart = new Highcharts.Chart({
                    chart: {
                        animation: cp.chart_Animation,
                        renderTo: cp.chart_RenderTo,
                        type: cp.chart_Type,
                        marginTop: cp.chart_MarginTop,
                        marginRight: cp.chart_MarginRight,
                        plotBorderWidth: cp.chart_PlotBorderWidth,
                        plotBorderColor: cp.chart_PlotBorderColor,
                        backgroundColor: cp.chart_BackgroundColor,
                        events:{
                            redraw:function(){
                            },
                            load:function(){

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
                        series:{
                            point:{
                                events:{
                                    click: function (e) {
                                        if (!Agi.Edit) {
                                            var PointObj=this;
                                            if(PointObj.series.name!="min" && PointObj.series.name!="max"
                                                &&PointObj.series.name!="middle" && PointObj.series.name!=null){
                                                $("#PointErroSave").hide();
                                                $("#PointSrcData").show();
                                                $('#pointMenu').css('top',e.clientY+5);
                                                $('#pointMenu').css('left',e.clientX-15);
                                                $('#pointMenu').show().find("li").unbind("click").bind("click",function(event){
                                                    Me.PointClickEvent({name:PointObj.series.name,x:PointObj.x,y:PointObj.y,Time:new Date()},$(this).data("menutype"),1);
                                                    $('#pointMenu').hide();
                                                    event.stopPropagation();
                                                });
                                                $('#pointMenu').find(".dropdown-menu").show();
                                                $('.highcharts-container').unbind('click').bind('click',function(){
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
                            for (var i = 0; i < checkDataSeries.Mean_data.length; i++) {
                                if (this.x >= checkDataSeries.Mean_data[0].min && this.x <= checkDataSeries.Mean_data[0].max) {
                                    name = checkDataSeries.Mean_data[i].Names;
                                    break;
                                }
                                if (this.x > checkDataSeries.Mean_data[i].min && this.x <= checkDataSeries.Mean_data[i].max) {
                                    name = checkDataSeries.Mean_data[i].Names;
                                    break;
                                }
                            }
                            return this.x+' , <b>' + name + ': ' + this.y + '</b>';
                        }
                    },
                    legend: {
                        enabled: cp.legend_enabled
                    },
                    exporting: {
                        enabled: cp.exporting_enabled
                    },
                    series: chartSeries.Mean_data,
                    credits: {
                        enabled: cp.credits_enabled
                    }
                });
                this.Set('chart', chart);
            }
            //endregion

            //region 2.极差图创建
            cp.yAxis_Min_SD = cp.yAxis_PlotLines_Min_SD - yValue.SD_YValue / 4;
            cp.yAxis_Max_SD = cp.yAxis_PlotLines_Max_SD + yValue.SD_YValue / 4;
            var seriesMinValue_SD = this.Get('SeriesMinValue_SD');
            var seriesMiddleValue_SD = this.Get('SeriesMiddleValue_SD');
            var seriesMaxValue_SD = this.Get('SeriesMaxValue_SD');
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
                        tickPositions: cp.xAxis_TickPositions_SD,
                        labels: {
                            formatter: function () {
                                for (var i = 0; i < checkDataSeries.SD_data.length; i++) {
                                    var obj = checkDataSeries.SD_data[i];
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
                        text: cp.yAxis_Title_Text_SD
                    },
//                    min: cp.yAxis_Min_SD,
//                    max: cp.yAxis_Max_SD,
                    gridLineWidth: cp.yAxis_GridLineWidth,
//                    tickInterval: yValue.SD_YValue,
                    tickWidth: cp.yAxis_TickWidth,
                    tickColor: cp.Axis_TickColor,
                    tickPosition: cp.yAxis_TickPosition
                    , labels: {
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
                        tickWidth: cp.xAxis_TickWidth2,
                        tickPosition: cp.Axis_TickColor,
                        tickPositions: cp.yAxis_TickPositions_SD,
                        title: "",
                        labels: {
                            formatter: function () {
                                switch (this.value) {
                                    case seriesMinValue_SD:
                                        if (cp.series_MinPlotLine_Enabled)
                                            return cp.series_MinPlotLine_Names + "=" + seriesMinValue_SD;
                                        break;
                                    case seriesMiddleValue_SD:
                                        if (cp.series_MiddlePlotLine_Enabled)
                                            return cp.series_MiddlePlotLine_Names_SD + "=" + seriesMiddleValue_SD;
                                        break;
                                    case seriesMaxValue_SD:
                                        if (cp.series_MaxPlotLine_Enabled)
                                            return cp.series_MaxPlotLine_Names + "=" + seriesMaxValue_SD;
                                        break;
                                }
                                return "";
                            }
                        }
                    });
                }
            }
            if (chartSeries && chartSeries.SD_data && cp.chart_RenderTo_SD) {
                Highcharts.setOptions({
                    global: {
                        useUTC: false//不使用夏令时
                    }
                });
                var series, chart;
                chart = new Highcharts.Chart({
                    chart: {
                        animation: cp.chart_Animation,
                        renderTo: cp.chart_RenderTo_SD,
                        type: cp.chart_Type,
                        marginTop: cp.chart_MarginTop,
                        marginRight: cp.chart_MarginRight,
                        plotBorderWidth: cp.chart_PlotBorderWidth,
                        plotBorderColor: cp.chart_PlotBorderColor,
                        backgroundColor: cp.chart_BackgroundColor,
                        events:{
                            redraw:function(){
                            },
                            load:function(){

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
                        series:{
                            point:{
                                events:{
                                    click: function (e) {
                                        if (!Agi.Edit) {
                                            var PointObj=this;
                                            if(PointObj.series.name!="min" && PointObj.series.name!="max"
                                                &&PointObj.series.name!="middle" && PointObj.series.name!=null){
                                                $("#PointErroSave").hide();
                                                $("#PointSrcData").show();

                                                $('#pointMenu').css('top',e.clientY+5);
                                                $('#pointMenu').css('left',e.clientX-15);
                                                $('#pointMenu').show().find("li").unbind("click").bind("click",function(event){
                                                    Me.PointClickEvent({name:PointObj.series.name,x:PointObj.x,y:PointObj.y,Time:new Date()},$(this).data("menutype"),2);
                                                    $('#pointMenu').hide();
                                                    event.stopPropagation();
                                                });
                                                $('#pointMenu').find(".dropdown-menu").show();
                                                $('.highcharts-container').unbind('click').bind('click',function(){
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
                                return '<b>' + cp.series_MiddlePlotLine_Names_SD + '=' + this.y + '</b>';
                            if (this.series.name === "max")
                                return '<b>' + cp.series_MaxPlotLine_Names + '=' + this.y + '</b>';
                            var name = "";
                            for (var i = 0; i < checkDataSeries.SD_data.length; i++) {
                                if (this.x >= checkDataSeries.SD_data[0].min && this.x <= checkDataSeries.SD_data[0].max) {
                                    name = checkDataSeries.SD_data[i].Names;
                                    break;
                                }
                                if (this.x > checkDataSeries.SD_data[i].min && this.x <= checkDataSeries.SD_data[i].max) {
                                    name = checkDataSeries.SD_data[i].Names;
                                    break;
                                }
                            }
                            return this.x+' , <b>' + name + ': ' + this.y + '</b>';
                        }
                    },
                    legend: {
                        enabled: cp.legend_enabled
                    },
                    exporting: {
                        enabled: cp.exporting_enabled
                    },
                    series: chartSeries.SD_data,
                    credits: {
                        enabled: cp.credits_enabled
                    }
                });
                this.Set('chart_SD', chart);
            }
            //endregion

            Me.ShowALLPlotLineGroup();
            if(Me.Get("IsUpdateViewGrid")){
                Agi.view.advance.refreshGridData(Me.GetSPCViewGridData());//调用View框架刷新数据表格显示
                Me.Set("IsUpdateViewGrid",false);
            }
        },
        bingDataGuid:function(control,series){
            var chart = control.chart;
            var grid = control.grid;
            var data=control.theConfig;
            var array=[];
            var markerColor='#4572A7';
            if(data!=undefined){
                markerColor=data.dataLine.markerColor;
            }
            var ent = control.Get('Entity')[0];
            var ChartProperty=control.Get("ChartProperty");
            for(var i=0;i<series.data.length;i++)
            {
                if(series.data[i].marker.fillColor!=markerColor)
                {
                    var ob={
                        row:i,
                        color:series.data[i].marker.fillColor,
                        column:ChartProperty.SeriesDataColumn[0],
                        cle:-1
                    };

                    if(ent!=undefined){
                        for(var j=0;j<ent.Columns.length;j++){
                            if(ent.Columns[j]==ChartProperty.SeriesDataColumn[0]){
                                ob.cle=j;
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
            Agi.Controls.CustomXSChartProrityInit(this);
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
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = this.shell.Container.parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewSPCSingleChart = Agi.Controls.InitSPCSingleChart();
//                NewSPCSingleChart.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewSPCSingleChart;
//            }
//        },
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
            var Me=this;
            var ThisHTMLElement = $(this.Get("HTMLElement"));
            var ParentObj = ThisHTMLElement.parent();
            if (!ParentObj.length) {
                return;
            }
            if (!Agi.Edit){
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
            }else{
               var ThisControlObj= Me.Get('chart');
                ThisControlObj.setSize(ThisHTMLElement.width(),ThisHTMLElement.height()/2);/*Chart 更改大小*/
                var ThisControlObj_SD= Me.Get('chart_SD');
                ThisControlObj_SD.setSize(ThisHTMLElement.width(),ThisHTMLElement.height()/2);/*Chart 更改大小*/
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
        InEdit:function(){
            var Me=this;
            Me.UnChecked();
            Me.Refresh(); //重新刷新显示
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.CustomXSChartAttributeChange(this, Key, _Value);
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
                    DataExtractConfig:null//数据钻取配置
                }
            }
            SPCSingleChartControl.Control.ControlType = this.Get("ControlType");
            SPCSingleChartControl.Control.ControlID = ProPerty.ID;
            SPCSingleChartControl.Control.ControlBaseObj = ProPerty.ID;
            SPCSingleChartControl.Control.HTMLElement = ProPerty.ID;
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
            //均值极差图新增属性
            SPCSingleChartControl.Control.SigmaRule=this.Get("SigXSules");//西格玛规则
            SPCSingleChartControl.Control.StandardLines=this.Get("NoFormatPlotLines");//标准线
            SPCSingleChartControl.Control.StandardLines_SD=this.Get("NoFormatPlotLines_SD");//标准线
            SPCSingleChartControl.Control.Ware=this.Get("WarnRule");//特殊报警
            SPCSingleChartControl.Control.DataExtractConfig=this.Get("ExtractConfig");//数据钻取规则

            return SPCSingleChartControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.ControlID);
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

                    this.Set("SigXSules",_Config.SigmaRule);//西格玛规则
                    this.UpPlotLineGroups(_Config.StandardLines);//标准线
                    this.UpPlotLineGroups_SD(_Config.StandardLines_SD);//标准线,样本极差图
                    this.Set("WarnRule",_Config.Ware);//特殊报警
                    this.Set("ExtractConfig",_Config.DataExtractConfig);//数据钻取规则


                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
//                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

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
            var DataDrillState=self.Get("DataDrillState");//是否可以钻取
            if(DataDrillState!=null && DataDrillState==false){}else{
                if(self.grid){
                    self.grid.find('tbody>tr').unbind('click').bind('click',function(){
                        var cells = self.grid.wijgrid("columns");
                        var rowData = {};
                        var tr = $(this);
                        for(var i = 0; i < cells.length; i++ ){
                            rowData[cells[i].options.dataKey] = tr.find('td:eq('+i+')')[0].innerText.trim();
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
            //viewmenus.push({Title: "标准线设置", MenuImg: "ViewMenuImages/viewmenu_Standline.png", CallbackFun: Me.SPCViewStandLineMenu});
            viewmenus.push({Title: "西格玛判异", MenuImg: "ViewMenuImages/viewmenu_sigma.png", CallbackFun: Me.SPCViewSigmaMenu});
            //viewmenus.push({Title: "特殊报警", MenuImg: "ViewMenuImages/viewmenu_Abnormal.png", CallbackFun: Me.SPCViewSpecialAlarmMenu});
            //viewmenus.push({Title: "钻取配置", MenuImg: "ViewMenuImages/dataextract.png", CallbackFun: Me.SPCViewDataExtractMenu});
            return viewmenus;
        },//SPC控件支持View框架，控件菜单显示
        SPCViewStandLineMenu: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("标准线设置");
            $(_Panel).find(".content").height(230);
            Agi.Controls.CustomXSChartView_StandLinesMenu(_Panel, Me);
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
            Agi.Controls.CustomXSChartView_SigmaMenu(_Panel, Me);
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
            Agi.Controls.CustomXSChartView_ExtractMenu(_Panel, Me);
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
            Agi.Controls.CustomXSChartView_SpecialAlarmMenu(_Panel, Me);
            _CallFun();
        },//SPC控件View，特殊报警
        GetSPCViewGridData:function(){
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:[]//所选的异常点
            };
            var ThisDataSeries=Me.GetDataSeries();//获取当前曲线信息
            var checkDataSeries = this.Get('CheckDataSeries');
            if(ThisDataSeries!=null && ThisDataSeries.Mean_data.length>0){
                for(var i=0;i<ThisDataSeries.Mean_data.length;i++){
                    Agi.Controls.CustomXSChartAlarmDataPointsFind(GridData,cp.SeriesDataColumn[i],ThisDataSeries.Mean_data[i],cp.series_PointMarkerColor,checkDataSeries.Mean_data);
                }
            }
            if(ThisDataSeries!=null && ThisDataSeries.SD_data.length>0){
                for(var i=0;i<ThisDataSeries.SD_data.length;i++){
                    Agi.Controls.CustomXSChartAlarmDataPointsFind(GridData,cp.SeriesDataColumn[i],ThisDataSeries.SD_data[i],cp.series_PointMarkerColor,checkDataSeries.SD_data);
                }
            }
            return GridData;
        },//SPC控件支持View框架，控件显示源数据
        SPCViewRefreshByGridData:function(_GridData){
            var Me=this;
            Me.Set("FilterData",_GridData);
            //Me.ChartLoadByData(_GridData);//重新加载数据
            Me.Set("IsShowLastChart",true);
            //显示对照图表

            //setTimeout(Agi.Controls.CustomXSChartLastChartShowExE(Me),2000);
            Agi.Controls.CustomXSChartLastChartShow(Me);
            if(Me.Get("LastChartImgIsExt")){
                Me.RefreshByProPanelUp();//更新显示
            }else{
                setTimeout(Agi.Controls.CustomXSChartRefreshShowExe(Me),2000);//更新显示
            }
            //Me.RefreshByProPanelUp();//更新显示
        },//SPC控件支持View框架，编辑源数据后更新控件显示
        SPCViewDataRestore:function(){
            var Me=this;
            var entity = Me.Get('Entity')[0];
            var data =entity.Data;
            var Filterdata=[];
            for(var i = 0;i<data.length;i++){
                Filterdata.push(data[i]);
            }

            Me.Set("FilterData",Filterdata);
            Me.Set("IsUpdateViewGrid",true);

            //Me.ChartLoadByData(Filterdata);//重新加载数据
            Agi.Controls.CustomXSChartLastChartShowMenu(Me,false);//还原数据后，清除原对照图
            Me.Set("LastChartImgIsExt",false);

            Me.RefreshByProPanelUp();//更新显示
        },//SPC控件支持View框架，还原至原始数据
        SPCViewDataExtractURLGet:function(RowData){
            return this.Get("ExtractConfig");//数据钻取配置信息
        }//数据钻取URL获取，需传入行数据
    },true);

/*下拉列表控件参数更改处理方法*/
Agi.Controls.CustomXSChartAttributeChange = function (_ControlObj, Key, _Value) {
    var self = _ControlObj;
    switch (Key) {
        case "Position":
            {
                if(layoutManagement.property.type==1){
                    var ThisHTMLElementobj=$("#"+_ControlObj.Get("HTMLElement").id);
                    var ThisControlObj_Mean = self.Get("chart");
                    var ThisControlObj_SD = self.Get("chart_SD");

                    var ParentObj=ThisHTMLElementobj.parent();
                    var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                    ThisHTMLElementobj.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                    ThisHTMLElementobj.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");


                    var ThisControlPars={Width:parseInt(PagePars.Width*(1-_Value.Left-_Value.Right)),
                        Height:parseInt(PagePars.Height*(1-_Value.Top-_Value.Bottom))};

                    ThisHTMLElementobj.width(ThisControlPars.Width);
                    ThisHTMLElementobj.height(ThisControlPars.Height);
                    ThisControlObj_Mean.setSize(ThisControlPars.Width,ThisControlPars.Height/2);/*Chart 更改大小*/
                    try{
                        ThisControlObj_Mean.Refresh();/*Chart 更改大小*/
                    }catch(ex){}
                    ThisControlObj_SD.setSize(ThisControlPars.Width,ThisControlPars.Height/2);/*Chart 更改大小*/
                    ThisControlObj_SD.Refresh();/*Chart 更改大小*/

                    PagePars=null;
                }
            } break;
    } //end switch
} //end

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitCustomXSChart = function () {
    return new Agi.Controls.CustomXSChart();
}

Agi.Controls.CustomXSChartProrityInit = function (_BasicChart) {
    var Me = _BasicChart;
    //取得默认属性
    var cp = Me.Get('ChartProperty');
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ChartDataSeries=Me.GetDataSeries();//图表曲线集合，不包含基准线和西格玛线

    //取得页面显示数据属性
    var pointsParameters = Me.Get("PointsParamerters");
    var ThisProItems = [];
    //1.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    {
        var ItemContent ="";

        //4.基本属性设置

        //region 4.1.数据曲线
        ItemContent=$("<div id='CSChartDataLine'></div>")
        ItemContent.load('js/Controls/CustomXSChart/tabTemplates.html #tab-1', function () {
            $(this).find("#CustXSdataColor").spectrum({
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
                    ItemContent.find("#dataColor").attr("value",color.toHexString());
                }
            });
            $(this).find("#CustXSmarkerColor").spectrum({
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
                    ItemContent.find("#markerColor").attr("value",color.toHexString());
                }
            });

            //默认选中
            $(this).find("#CustXSdataColor").spectrum("set","#d2d2d2");
            $(this).find("#CustXSmarkerColor").spectrum("set","#4572A7");
            if(cp.series_DataColor!=null && cp.series_PointMarkerColor!=null){
                $(this).find("#CustXSdataColor").spectrum("set",cp.series_DataColor);
                $(this).find('#CustXSmarkerColor').spectrum("set",cp.series_PointMarkerColor);
            }
            //分组列和数据列绑定
            var GroupColumns=$(this).find('#CustXSGrpColumn');
            var DataColumns=$(this).find('#CustXSDataColumn');
            GroupColumns.empty();
            DataColumns.empty();

            GroupColumns.append("<option value=''></option>");//填充空字段列
            for(var i=0;i<ChartEntityColumns.length;i++) {
                var option ="<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>";
                GroupColumns.append(option);
                DataColumns.append(option);
            }

            if(cp.SeriesGroupColumn && cp.SeriesDataColumn!=null){
            }else{
                if(cp.SeriesGroupColumn==null){
                    cp.SeriesGroupColumn=$($("#CustXSGrpColumn").children()[0]).val();
                }
                if(cp.SeriesDataColumn==null){
                    cp.SeriesDataColumn=$($("#CustXSDataColumn").children()[0]).val();
                }
            }
            GroupColumns.find("option[value='"+cp.SeriesGroupColumn+"']").attr("selected","selected");
            DataColumns.find("option[value='"+cp.SeriesDataColumn+"']").attr("selected","selected");

            var CustXSChartSeriesItems= $(this).find("#CustXSSeries").empty();
            if(ChartDataSeries!=null && ChartDataSeries.length>0){
                for(var i=0;i<ChartDataSeries.length;i++) {
                    var option ="<option value='"+ChartDataSeries[i].name+"'>"+ChartDataSeries[i].name+"</option>";
                    CustXSChartSeriesItems.append(option);
                }
                CustXSChartSeriesItems.find("option[value='"+ChartDataSeries[0].name+"']").attr("selected","selected");
            }
            //子组大小初始化
            if(cp.chart_Data_NRow==null){cp.chart_Data_NRow=2};
            $("#XSChart_RGroupSize").val(cp.chart_Data_NRow);

            //保存处理
            $(this).find("#CustXSSeriesSave").unbind().bind("click",function(ev){
                var CustXSChartSeriesObj={
                    SeriesName:$("#CustXSSeries").val(),
                    GroupColumn:$("#CustXSGrpColumn").val(),
                    DataColumn:$("#CustXSDataColumn").val(),
                    SeriesColor:$("#CustXSdataColor").val(),
                    SeriesMarkerColor:$("#CustXSmarkerColor").val(),
                    GroupSize:$("#XSChart_RGroupSize").val()//分组大小
                }
                Me.UpSeriesBindInfo(CustXSChartSeriesObj);//更新Series 设置
                Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
            });
        });
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据曲线", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.2.背景设置
        ItemContent = null;
        ItemContent=$("<div id='CSChartBackgroundPanel'></div>");
        Agi.Controls.CustomXSChartView_BackgroundSetMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "背景设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.3.西格玛设定
        ItemContent = null;
        ItemContent=$("<div id='CSChartSigmaLine'></div>");
        Agi.Controls.CustomXSChartView_SigmaSettingMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "西格玛设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.4.标准差估计
        ItemContent = null;
        ItemContent=$("<div id='CSChartRType'></div>");
        Agi.Controls.CustomXSChartView_RTypeMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标准差估计", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.5.西格玛判异规则
        ItemContent = null;
        ItemContent=$("<div id='CSChartSigMa'></div>");
        Agi.Controls.CustomXSChartView_SigmaMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "西格玛判异规则", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.6.样本均值标准线
        ItemContent = null;
        ItemContent=$("<div id='CSChartStandLine'></div>");
        Agi.Controls.CustomXSChartView_StandLinesMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "样本均值_标准线", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.6.2.样本标准差标准线
        ItemContent = null;
        ItemContent=$("<div id='CSChartStandLine_SD'></div>");
        Agi.Controls.CustomXSChartView_StandLinesMenu_SD(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "样本标准差_标准线", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion



        //region 4.7.特殊报警设置(禁用)
//        ItemContent = null;
//        ItemContent=$("<div id='CSChartSigMa'></div>");
//        Agi.Controls.CustomXSChartView_SpecialAlarmMenu(ItemContent,Me);
//        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "特殊报警设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

//        //region 4.8.数据钻取设置
//        ItemContent = null;
//        ItemContent=$("<div id='CSChartExtract'></div>");
//        Agi.Controls.CustomXSChartView_ExtractMenu(ItemContent,Me);
//        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据钻取设置", DisabledValue: 1, ContentObj: ItemContent }));
//        //endregion
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
    {}
}

//region 20130815 markeluo 标准线相关处理
//1.格式化标准线组的显示值信息
Agi.Controls.CustomXSChartFormatPlotGrpPars=function(_Entity,_PlotGrp){
    var PlotArray=null;
    //_PlotGrp: {GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000, MaxReviseSig:上限修正符号,MaxReviseValue:上限修正值,MinReviseSig:下限修正符号,MinReviseValue:下限修正值}
    if(_PlotGrp!=null){
        PlotArray=[];
        var MaxValue=0,MinValue=0;
        _PlotGrp.MaxValueType=parseInt(_PlotGrp.MaxValueType);
        _PlotGrp.MinValueType=parseInt(_PlotGrp.MinValueType);
        var maxcolumn=null;
        var mincolumn=null;
        if(_PlotGrp.MaxValueType==0){
            MaxValue=parseInt(_PlotGrp.MaxValue);
        }else{
            maxcolumn=_PlotGrp.MaxValue;
            if(_Entity.Data.length>0){
                MaxValue=parseInt(_Entity.Data[0][_PlotGrp.MaxValue]);
            }else{
                MaxValue=0;
            }

            if(_PlotGrp.MaxReviseValue!=null && _PlotGrp.MaxReviseValue!=""){
                var valuetemp=null;
                try{
                    valuetemp=parseInt(eval('MaxValue'+_PlotGrp.MaxReviseSig+_PlotGrp.MaxReviseValue));
                    MaxValue=valuetemp;
                }catch(ex){
                }
            }
        }
        if(_PlotGrp.MinValueType==0){
            MinValue=parseInt(_PlotGrp.MinValue);
        }else{
            mincolumn=_PlotGrp.MinValue;
            if(_Entity.Data.length>0){
                MinValue=parseInt(_Entity.Data[0][_PlotGrp.MinValue]);
            }else{
                MinValue=0;
            }
            if(_PlotGrp.MinReviseValue!=null && _PlotGrp.MinReviseValue!=""){
                var valuetemp=null;
                try{
                    valuetemp=parseInt(eval('MinValue'+_PlotGrp.MinReviseSig+_PlotGrp.MinReviseValue));
                    MinValue=valuetemp;
                }catch(ex){
                }
            }
        }
        PlotArray.push({value:MaxValue,columnName:maxcolumn,dashStyle:'solid',color:_PlotGrp.MaxColor,width:_PlotGrp.MaxSize,id:_PlotGrp.GroupName+"_MAX",zIndex: 5});
        PlotArray.push({value:MinValue,columnName:mincolumn,dashStyle:'solid',color:_PlotGrp.MinColor,width:_PlotGrp.MinSize,id:_PlotGrp.GroupName+"_MIN",zIndex: 5});
        MaxValue=MinValue=null;
    }
    return PlotArray;
}
//2.根据标准线数组值，更新Series中相关Point点的颜色
Agi.Controls.CustomXSChartPlotLineUpSeries=function(_SeriesArrar,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
//    var DataSeriesArray=Agi.Controls.CustomXSChartGetDataSries(_SeriesArrar);
    if(_SeriesArrar!=null && _SeriesArrar.length>0){
        for(var i=0;i<_SeriesArrar.length;i++){
            Agi.Controls.CustomXSChartPlotLineUpPoint(_SeriesArrar[i],_PlotLines);
        }
    }
}
Agi.Controls.CustomXSChartGetDataSries=function(_SeriesArrar,_IsDataSeries){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
    var SeriesArray=[];
    if(_SeriesArrar!=null && _SeriesArrar.length>0){
        for(var i=0;i<_SeriesArrar.length;i++){
            if(_IsDataSeries!=null && !_IsDataSeries){
                if(_SeriesArrar[i].name=="max" || _SeriesArrar[i].name=="min"){
                    SeriesArray.push(_SeriesArrar[i]);
                }
            }else{
                if(_SeriesArrar[i].name!="max" && _SeriesArrar[i].name!="min" && _SeriesArrar[i].name!="middle"){
                    SeriesArray.push(_SeriesArrar[i]);
                }
            }
        }
    }
    return SeriesArray;
}
Agi.Controls.CustomXSChartPlotLineUpPoint=function(_Series,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
    if(_Series!=null && _Series.data!=null && _Series.data.length>0){
        var PointColor=null;
        for(var i=0;i<_Series.data.length;i++){
            PointColor=Agi.Controls.CustomXSChartPlotLineGetPointColor(_Series.data[i].y,_PlotLines);
            if(PointColor!=null){
                _Series.data[i].marker={fillColor:PointColor};
            }
        }
    }
}
//4.根据标准线组获取对应的point点颜色,如为null则对应的point点颜色不更改
Agi.Controls.CustomXSChartPlotLineGetPointColor=function(_Value,_PlotLines){
    var PointColor=null;
    if(_PlotLines!=null && _PlotLines.length>0){
        var MaxLines=[];
        var MinLines=[];
        for(var i=0;i<_PlotLines.length;i++){
            if(_PlotLines[i].Items!=null && _PlotLines[i].Items.length>0){
                for(var j=0;j<_PlotLines[i].Items.length;j++){
                    if(_PlotLines[i].Items[j].id.substr(_PlotLines[i].Items[j].id.length-4)=="_MAX"){
                        MaxLines.push(_PlotLines[i].Items[j]);
                    }else{
                        MinLines.push(_PlotLines[i].Items[j]);
                    }
                }
            }
        }

        var MaxValueObj={MaxValue:_Value,Color:""};
        var MinValueObj={MinValue:_Value,Color:""};
        //排序
        var ObjIndex=-1;
        var TempObj=[];
        for(var i=0;i<MaxLines.length;i++){
            if(ObjIndex==-1){
                ObjIndex=i;
            }else{
                if(MaxLines[i].value>MaxLines[ObjIndex].value){
                    TempObj.push(MaxLines[ObjIndex]);
                    MaxLines[ObjIndex]=MaxLines[i];
                    MaxLines[i]=TempObj[0];
                    TempObj=[];
                    i=0;
                }
            }
        }
        for(var i=0;i<MinLines.length;i++){
            if(ObjIndex==-1){
                ObjIndex=i;
            }else{
                if(MinLines[i].value<MinLines[ObjIndex].value){
                    TempObj.push(MinLines[ObjIndex]);
                    MinLines[ObjIndex]=MinLines[i];
                    MinLines[i]=TempObj[0];
                    TempObj=[];
                    i=0;
                }
            }
        }

        for(var i=0;i<MaxLines.length;i++){
            if(_Value>MaxLines[i].value){
                PointColor=MaxLines[i].color;
                break;
            }
        }
        if(PointColor==null){
            for(var i=0;i<MinLines.length;i++){
                if(_Value<MinLines[i].value){
                    PointColor=MinLines[i].color;
                    break;
                }
            }
        }
    }
    return PointColor;
}
//统计信息
Agi.Controls.CustomXSChartAlarmStatistical=function(_ALLSeries,_PlotLines){
    var AlarmStatisticaldata={PlotLines:[],SGM:{AlarmSum:0,Percentage:0,MaxObj:{AlarmSum:0,Percentage:0,Item:[]},MinObj:{AlarmSum:0,Percentage:0,Item:[]}}};
    var _Series=Agi.Controls.CustomXSChartGetDataSries(_ALLSeries);//获得对应的的数据Series
    var _ScmSeries=Agi.Controls.CustomXSChartGetDataSries(_ALLSeries,false);//获得对应的的西格玛线Series

    if(_Series!=null || _ScmSeries!=null){
        //标准线统计信息结构准备
        if(_PlotLines!=null && _PlotLines.length>0){
            for(var i=0;i<_PlotLines.length;i++){//{GroupName:_PlotLineGrp.GroupName,Items:newGroup}
                AlarmStatisticaldata.PlotLines.push({GroupName:_PlotLines[i].GroupName,AlarmSum:0,Percentage:0,Items:[]});
                for(var j=0;j<_PlotLines[i].Items.length;j++){
                    AlarmStatisticaldata.PlotLines[AlarmStatisticaldata.PlotLines.length-1].Items.push({id:_PlotLines[i].Items[j].id,color:_PlotLines[i].Items[j].color,value:_PlotLines[i].Items[j].value,AlarmSum:0,Percentage:0})
                }
            }
        }
        //西格玛线统计信息结构准备
        if(_ScmSeries!=null && _ScmSeries.length>0){
            var SigmLineobj=null;
            for(var i=0;i<_ScmSeries.length;i++){
                for(var j=0;j<_ScmSeries[i].data.length;j++){
                    if(_ScmSeries[i].data[j]!=null){
                        if(_ScmSeries[i].name=="max"){
                            SigmLineobj=GetSigmLineByArray(AlarmStatisticaldata.SGM.MaxObj.Item,_ScmSeries[i].data[j][1]);
                            if(SigmLineobj!=null){
                                SigmLineobj.EndIndex=_ScmSeries[i].data[j][0];
                            }else{
                                AlarmStatisticaldata.SGM.MaxObj.Item.push({StartIndex:_ScmSeries[i].data[j][0],EndIndex:null,value:_ScmSeries[i].data[j][1]});
                            }
                        }else{
                            SigmLineobj=GetSigmLineByArray(AlarmStatisticaldata.SGM.MinObj.Item,_ScmSeries[i].data[j][1]);
                            if(SigmLineobj!=null){
                                SigmLineobj.EndIndex=_ScmSeries[i].data[j][0];
                            }else{
                                AlarmStatisticaldata.SGM.MinObj.Item.push({StartIndex:_ScmSeries[i].data[j][0],EndIndex:null,value:_ScmSeries[i].data[j][1]});
                            }
                        }
                    }
                }

            }
        }

        var SumPointNum=0;
        for(var i=0;i<_Series.length;i++){
            SumPointNum=SumPointNum+_Series[i].data.length;
        }
        for(var i=0;i<_Series.length;i++){
            for(var j=0;j<_Series[i].data.length;j++){
                Agi.Controls.CustomXSChartAlarmStatisticalByData(j,_Series[i].data[j].y,AlarmStatisticaldata,SumPointNum);//统计标准线所在比例信息
            }
        }
    }
    return AlarmStatisticaldata;
}

Agi.Controls.CustomXSChartAlarmStatisticalByData=function(_index,_PointValue,_AlarmStatisticaldata,SumPointNum){
    //标准线超出点计算
    if(_AlarmStatisticaldata!=null && _AlarmStatisticaldata.PlotLines!=null
        && _AlarmStatisticaldata.PlotLines.length>0)
    {
        for(var i=0;i<_AlarmStatisticaldata.PlotLines.length;i++){
            for(var j=0;j<_AlarmStatisticaldata.PlotLines[i].Items.length;j++){
                if(_AlarmStatisticaldata.PlotLines[i].Items[j].id.substr(_AlarmStatisticaldata.PlotLines[i].Items[j].id.length-4)=="_MAX"){
                    if(_PointValue>_AlarmStatisticaldata.PlotLines[i].Items[j].value){
                        _AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Items[j].Percentage=(_AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum/SumPointNum).toFixed(3);
                        _AlarmStatisticaldata.PlotLines[i].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Percentage=(_AlarmStatisticaldata.PlotLines[i].AlarmSum/SumPointNum).toFixed(3);
                    }
                }else{
                    if(_PointValue<_AlarmStatisticaldata.PlotLines[i].Items[j].value){
                        _AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Items[j].Percentage=(_AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum/SumPointNum).toFixed(3);
                        _AlarmStatisticaldata.PlotLines[i].AlarmSum++;
                        _AlarmStatisticaldata.PlotLines[i].Percentage=(_AlarmStatisticaldata.PlotLines[i].AlarmSum/SumPointNum).toFixed(3);
                    }
                }
            }
        }
    }
    //对应超出西格玛线点计算
    if(_AlarmStatisticaldata!=null && _AlarmStatisticaldata.SGM!=null ){
        if(_AlarmStatisticaldata.SGM.MaxObj.Item!=null && _AlarmStatisticaldata.SGM.MaxObj.Item.length>0){
            for(var i=0;i<_AlarmStatisticaldata.SGM.MaxObj.Item.length;i++){
                if((_index>=_AlarmStatisticaldata.SGM.MaxObj.Item[i].StartIndex && _index<=_AlarmStatisticaldata.SGM.MaxObj.Item[i].EndIndex)
                    && _PointValue>_AlarmStatisticaldata.SGM.MaxObj.Item[i].value){
                    _AlarmStatisticaldata.SGM.MaxObj.AlarmSum++;
                    _AlarmStatisticaldata.SGM.MaxObj.Percentage=(_AlarmStatisticaldata.SGM.MaxObj.AlarmSum/SumPointNum).toFixed(3);
                    _AlarmStatisticaldata.SGM.AlarmSum++;
                    _AlarmStatisticaldata.SGM.Percentage=(_AlarmStatisticaldata.SGM.AlarmSum/SumPointNum).toFixed(3);
                    break;
                }
            }
        }
        if(_AlarmStatisticaldata.SGM.MinObj.Item!=null && _AlarmStatisticaldata.SGM.MinObj.Item.length>0){
            for(var i=0;i<_AlarmStatisticaldata.SGM.MinObj.Item.length;i++){
                if((_index>=_AlarmStatisticaldata.SGM.MinObj.Item[i].StartIndex && _index<=_AlarmStatisticaldata.SGM.MinObj.Item[i].EndIndex)
                    && _PointValue<_AlarmStatisticaldata.SGM.MinObj.Item[i].value){
                    _AlarmStatisticaldata.SGM.MinObj.AlarmSum++;
                    _AlarmStatisticaldata.SGM.MinObj.Percentage=(_AlarmStatisticaldata.SGM.MinObj.AlarmSum/SumPointNum).toFixed(3);
                    _AlarmStatisticaldata.SGM.AlarmSum++;
                    _AlarmStatisticaldata.SGM.Percentage=(_AlarmStatisticaldata.SGM.AlarmSum/SumPointNum).toFixed(3);
                    break;
                }
            }
        }
    }
}
//统计信息显示
Agi.Controls.CustomXSChartAlarmStatisticalPanelShow=function(_AlarmStatisticaldata,_ApendToPanel){
    if($("#CustomXSChartAlarmPanel").length>0){
        $("#CustomXSChartAlarmPanel").html("");
    }else{
        var CustomXSChartAlarmPanelHTML=$("<div id='CustomXSChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomXSChartAlarmPanel").css({"right":"8px","top":"8px"});
    }
    var SubItemHTML="";
    if(_AlarmStatisticaldata!=null && _AlarmStatisticaldata.PlotLines!=null && _AlarmStatisticaldata.PlotLines.length>0){
        var PercentageValue=0;
        for(var i=0;i<_AlarmStatisticaldata.PlotLines.length;i++){
            PercentageValue=accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Percentage),100);
            SubItemHTML+="<div class='AlarmGroupSty'><div>组:"+_AlarmStatisticaldata.PlotLines[i].GroupName+
                " 超出点"+_AlarmStatisticaldata.PlotLines[i].AlarmSum+"个,"+PercentageValue+"%</div>"
            for(var j=0;j<_AlarmStatisticaldata.PlotLines[i].Items.length;j++){
                PercentageValue=accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Items[j].Percentage),100);
                SubItemHTML+="<div style='margin-left:15px;color:"+_AlarmStatisticaldata.PlotLines[i].Items[j].color+"'>"+_AlarmStatisticaldata.PlotLines[i].Items[j].id+
                    " 超出点"+_AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum+"个,"+PercentageValue+"%</div>";
            }
            SubItemHTML+="</div>"
        }
    }
    if(_AlarmStatisticaldata!=null && _AlarmStatisticaldata.SGM!=null){
        var PercentageValue=accMul(parseFloat(_AlarmStatisticaldata.SGM.Percentage),100);
        SubItemHTML+="<div class='AlarmGroupSty'><div>超出西格玛线点"+_AlarmStatisticaldata.SGM.AlarmSum+"个,"+PercentageValue+"%</div>"
        SubItemHTML+="</div>"
    }
    $("#CustomXSChartAlarmPanel").append(SubItemHTML);
}
function GetSigmLineByArray(_Array,_item){
    for(i=0;i<_Array.length;i++){
        if(_Array[i].value == _item)
            return _Array[i];
    }
    return null;
}
function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
//endregion

//region 20130828 markleuo 西格玛8项判异规则
Agi.Controls.SigXSuleApplyGetGroupData=function(_CheckedDataArray){
    var GroupData=[];
    if(_CheckedDataArray!=null && _CheckedDataArray.length>0){
        for(var i=0;i<_CheckedDataArray.length;i++){
            GroupData.push({
                Names:_CheckedDataArray[i].Names,
                min:_CheckedDataArray[i].min,
                max:_CheckedDataArray[i].max,
                xBar:_CheckedDataArray[i].middleValue,
                LCL:_CheckedDataArray[i].minValue,
                UCL:_CheckedDataArray[i].maxValue,
                Isigma:_CheckedDataArray[i].Isigma
            });
        }
    }
    return GroupData;
}
//endregion

//region 20130912 markeluo SPC均值极差图组态控件化处理 (比较两个值大小，查找异常点,)
//1.比较两个值大小
Agi.Controls.WarnValueCompare=function(_ValueA,_ValueB,_ComPareCode){
//    bool=eval(eval(FilterData[i][WarnRuleValue.warnColumn])+WarnRuleValue.warnRule+eval(WarnRuleValue.warnCompareValue));
    var bolSucced=false;
    if(isNaN(_ValueA)==isNaN(_ValueB)){
        if(!isNaN(_ValueA)){
            if(_ValueA.substring(0,1)=="0"){
                bolSucced=eval('"'+_ValueA+'"'+_ComPareCode+'"'+_ValueB+'"');
            }else{
                bolSucced=eval(eval(_ValueA)+_ComPareCode+eval(_ValueB));
            }
        }else{
            bolSucced=eval('"'+_ValueA+'"'+_ComPareCode+'"'+_ValueB+'"');
        }
    }else{
        bolSucced=eval('"'+_ValueA+'"'+_ComPareCode+'"'+_ValueB+'"');
    }
    return bolSucced;
}
//2.查找异常点
Agi.Controls.CustomXSChartAlarmDataPointsFind=function(_GridData,_ColumnName,_ChartSeires,_markercolor,_CheckDataSeries){
    var _Index=-1;
    if(_GridData.ChartData!=null && _GridData.ChartData.length>0){
        for (var _param in _GridData.ChartData[0]) {
            _Index++;
            if(_param==_ColumnName){
                break;
            }
        }
    }

    if(_Index>-1){
        var NewItemArray=[];
        for(var j=0;j<_ChartSeires.data.length;j++){
            if(_ChartSeires.data[j].marker.fillColor!=_markercolor){//如果marker点颜色与原设置point点颜色不一致则说明该点为报警点
                NewItemArray=Agi.Controls.CustomXSChart.FindDataRowsByPoint(_CheckDataSeries,_ChartSeires.data[j].x);
                if(NewItemArray!=null && NewItemArray.length>0){
                    for(var item in NewItemArray){
                        _GridData.AlarmCells.push({Row:NewItemArray[item],Col:_Index,AlarmColor:_ChartSeires.data[j].marker.fillColor});
                    }
                }
            }
        }
    }
}
//3.在View环境中显示标准线设置菜单项
Agi.Controls.CustomXSChartView_StandLinesMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-2', function () {
        //0.控件当前值获取
        var ThisChartStandLines=Me.Get("NoFormatPlotLines");
        if(ThisChartStandLines!=null){
        }else{
            ThisChartStandLines=[];
        }
        $(this).find("#topColor").spectrum({
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
                $("#topColor").attr("value",color.toHexString());
            }
        });
        $(this).find("#bottomColor").spectrum({
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
                $("#bottomColor").attr("value",color.toHexString());
            }
        });

        //1.点击新增按钮
        $(this).find("#btnNewGrp").click(function(){
            //清空面板
            var LineTablePanel=$(this).parent().parent().parent();
            LineTablePanel.find('#CustXSStLinename').show();
            LineTablePanel.find('#CustXSStLinegroupName').hide();
            LineTablePanel.find("#topWidth").attr("value","1");
            LineTablePanel.find("#bottomWidth").attr("value","1");
            LineTablePanel.find("#topValue1").attr("value","");
            LineTablePanel.find("#bottomValue1").attr("value","");
            LineTablePanel.find("#topColor").spectrum("set",'#000');
            LineTablePanel.find("#bottomColor").spectrum("set",'#000');

            $("#btnSaveGrp").attr("opstate","0");
            $("#btnGrpUndo").show();
            $("#btnEditGrp").hide();
            $(this).hide();
            $("#btnDeleteGrp").hide();
        });
        //2.保存按钮
        $(this).find("#btnSaveGrp").click(function(){
            var SelectedItemObj=null;
            var Intopstatevalue=0;
            if($(this).attr("opstate")=="0"){}else{
                Intopstatevalue=1;
            }

            if($("#CustXSStLinegroupName").is(":hidden")){
                if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                    //创建对象
                    if(Intopstatevalue==0){//新增
                        for(var i=0;i<ThisChartStandLines.length;i++){
                            if($("#CustXSStLinename").attr('value')==ThisChartStandLines[i].GroupName)
                            {
                                AgiCommonDialogBox.Alert('标准线不允许重名！');
                                return;
                            }
                        }
                    }else{//编辑
                        var NewGrpName=$("#CustXSStLinename").attr('value');
                        var OldSelGrpName=$("#CustXSStLinegroupName").val();
                        var indexA=-1;
                        var indexB=-1;
                        if(NewGrpName!=OldSelGrpName){
                            for(var i=0;i<ThisChartStandLines.length;i++){
                                if(NewGrpName==ThisChartStandLines[i].GroupName)
                                {
                                    indexA=i;
                                }
                                if(OldSelGrpName==ThisChartStandLines[i].GroupName)
                                {
                                    indexB=i;
                                }
                            }
                            if(indexA>-1){
                                AgiCommonDialogBox.Alert('输入新名称与其它标准线名称重复！');
                                return;
                            }else{
                                ThisChartStandLines.splice(indexB,1);
                            }
                        }else{
                            SelectedItemObj=OldSelGrpName;
                        }
                    }
                }
            }else{
                var SelValue=$("#CustXSStLinegroupName").val();
                if(SelValue!=null && SelValue!=""){
                    SelectedItemObj=SelValue;
                }
            }
            $('#CustXSStLinename').hide();
            $('#CustXSStLinegroupName').show();
            $('#btnGrpUndo').hide();
            $('#btnEditGrp').show();
            $("#btnNewGrp").show();
            $("#btnDeleteGrp").show();

            var line={
                GroupName:$("#CustXSStLinename").attr('value'),
                MaxSize:$("#topWidth").attr('value'),
                MaxColor:$("#topColor").attr('value')==""?"#000":$("#topColor").attr('value'),
                MaxValueType:$("#topInstall option:selected").val(),
                MaxValue:$("#topInstall option:selected").text()=="固定值"?$("#topValue1").val():$("#topValue option:selected").text(),
                MinSize:$("#bottomWidth").attr('value'),
                MinColor:$("#bottomColor").attr('value')==""?"#000":$("#bottomColor").attr('value'),
                MinValueType:$("#bottomInstall option:selected").val(),
                MinValue:$("#bottomInstall option:selected").text()=="固定值"?$("#bottomValue1").val():$("#bottomValue option:selected").text(),
                MaxReviseSig:$("#topInstall_revise").val(),//上限修正符号
                MaxReviseValue:$("#topInstall_revise_Value").val(),//上限修正值
                MinReviseSig:$("#bottomInstall_revise").val(),//下限修正符号
                MinReviseValue:$("#bottomInstall_revise_Value").val()//下限修正值
            };
            //添加到数组
            if(SelValue!=null){
                line.GroupName=SelValue;
                if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                    for(var i=0;i<ThisChartStandLines.length;i++){
                        if(ThisChartStandLines[i].GroupName==SelValue){
                            ThisChartStandLines[i]=line;
                        }
                    }
                }
            }else{
                if(ThisChartStandLines!=null && ThisChartStandLines.length>=2){
                    ThisChartStandLines.push(line);
                    ThisChartStandLines.shift();
                }
                else{
                    ThisChartStandLines.push(line);
                }
            }

            var StandLinGrpNames = $("#CustXSStLinegroupName");
            StandLinGrpNames.empty();
            if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                for(var i=0;i<ThisChartStandLines.length;i++) {
                    var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>";
                    StandLinGrpNames.append(option);
                }
                StandLinGrpNames.find("option[value='"+ThisChartStandLines[0].GroupName+"']").attr("selected",true);
            }
            groupNameChange(ThisChartStandLines);

            Me.UpPlotLineGroups(ThisChartStandLines);//更新标准线显示
            Me.RefreshByProPanelUp();//刷新图形显示
        });
        //3.删除标准线组
        $(this).find('#btnDeleteGrp').click(function(){
            if($('#CustXSStLinegroupName').css('display')!="none"){
                var index=-1;
                for(var i=0;i<ThisChartStandLines.length;i++){
                    if($('#CustXSStLinegroupName option:selected').text()==ThisChartStandLines[i].GroupName)
                    {
                        index=i;break;
                    }
                }
                ThisChartStandLines.splice(index,1);
                var name = $("#CustXSStLinegroupName");
                name.empty();
                for(var i=0;i<ThisChartStandLines.length;i++) {
                    var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>"
                    name.append(option);
                }
                if(ThisChartStandLines.length==0)
                {
                    $('#CustXSStLinegroupName').hide();
                    $('#CustXSStLinename').val("").show();
                }
                groupNameChange(ThisChartStandLines);
            }
            else{
                AgiCommonDialogBox.Alert('请先选择要删除的标准线！');
            }
        });
        //4.取消
        $(this).find("#btnGrpUndo").unbind().bind("click",function(ev){
            $(this).hide();

            $('#CustXSStLinename').hide();
            $('#CustXSStLinegroupName').show();
            $("#btnDeleteGrp").show();
            $("#btnNewGrp").show();
            $("#btnEditGrp").show();

            groupNameChange(ThisChartStandLines);
        }).hide();

        //5.编辑
        $(this).find("#btnEditGrp").unbind().bind("click",function(ev){
            var LineTablePanel=$(this).parent().parent().parent();
            LineTablePanel.find('#CustXSStLinename').show().val(LineTablePanel.find('#CustXSStLinegroupName').val());
            LineTablePanel.find('#CustXSStLinegroupName').hide();
            $("#btnSaveGrp").attr("opstate","1");

            $("#btnGrpUndo").show();
            $(this).hide();
            $("#btnNewGrp").hide();
            $("#btnDeleteGrp").hide();
        }).hide();


        $(this).find("#topInstall").change(function(){
            if( $("#topInstall option:selected").text()=="固定值"){
                $('#topValue1').show();
                $('#topValue').hide();
                $('#topInstall_revise').attr("disabled","disabled");
                $('#topInstall_revise_Value').attr("disabled","disabled").val("");
            }
            else if($("#topInstall option:selected").text()=="数据列"){
                $('#topValue1').hide();
                $('#topValue').show();
                $('#topInstall_revise').removeAttr('disabled');
                $('#topInstall_revise_Value').removeAttr('disabled');
            }
        });
        $(this).find("#bottomInstall").change(function(){
            if( $("#bottomInstall option:selected").text()=="固定值"){
                $('#bottomValue1').show();
                $('#bottomValue').hide();

                $('#bottomInstall_revise').attr("disabled","disabled");
                $('#bottomInstall_revise_Value').attr("disabled","disabled").val("");
            }
            else if($("#bottomInstall option:selected").text()=="数据列"){
                $('#bottomValue1').hide();
                $('#bottomValue').show();

                $('#bottomInstall_revise').removeAttr('disabled');
                $('#bottomInstall_revise_Value').removeAttr('disabled');
            }
        });
        $(this).find("#CustXSStLinegroupName").change(function(){
            debugger;
            groupNameChange(ThisChartStandLines);
        });

        //选中项发生更改
        var groupNameChange=function(_StandLines){
            for(var i=0;i<_StandLines.length;i++)
            {
                if($("#CustXSStLinegroupName  option:selected").text()==_StandLines[i].GroupName){
                    $('#topWidth').attr('value',_StandLines[i].MaxSize);
                    $("#topInstall").find("option[value='"+_StandLines[i].MaxValueType+"']").attr("selected",true);
                    $('#topColor').spectrum("set", _StandLines[i].MaxColor);
                    if( $("#topInstall option:selected").text()=="固定值"){
                        $('#topValue1').show();
                        $('#topValue').hide();
                        $('#topValue1').val(_StandLines[i].MaxValue);
                        $('#topInstall_revise').attr("disabled","disabled");
                        $('#topInstall_revise_Value').attr("disabled","disabled").val("");
                    }
                    else if($("#topInstall option:selected").text()=="数据列"){
                        $('#topValue1').hide();
                        $('#topValue').show();
                        $("#topValue").find("option[value='"+_StandLines[i].MaxValue+"']").attr("selected",true);
                        $('#topInstall_revise').removeAttr('disabled');
                        var MaxReviseValue="";
                        if(_StandLines[i].MaxReviseValue!=null && _StandLines[i].MaxReviseValue!=""){
                            MaxReviseValue=_StandLines[i].MaxReviseValue;
                        }
                        $('#topInstall_revise_Value').removeAttr('disabled').val(MaxReviseValue);
                    }
                    if(_StandLines[i].MaxReviseSig!=null){
                        $("#topInstall_revise").find("option[value='"+_StandLines[i].MaxReviseSig+"']").attr("selected",true);
                    }

                    $('#bottomWidth').attr('value',_StandLines[i].MinSize);
                    $("#bottomInstall").find("option[value='"+_StandLines[i].MinValueType+"']").attr("selected",true);
                    $('#bottomColor').spectrum("set", _StandLines[i].MinColor);
                    if( $("#bottomInstall option:selected").text()=="固定值"){
                        $('#bottomValue1').show();
                        $('#bottomValue').hide();
                        $('#bottomValue1').val(_StandLines[i].MinValue);

                        $('#bottomInstall_revise').attr("disabled","disabled");
                        $('#bottomInstall_revise_Value').attr("disabled","disabled").val("");
                    }
                    else if($("#bottomInstall option:selected").text()=="数据列"){
                        $('#bottomValue1').hide();
                        $('#bottomValue').show();
                        $("#bottomValue").find("option[value='"+_StandLines[i].MinValue+"']").attr("selected",true);

                        $('#bottomInstall_revise').attr("disabled","disabled");
                        var MinReviseValue="";
                        if(_StandLines[i].MinReviseValue!=null && _StandLines[i].MinReviseValue!=""){
                            MinReviseValue=_StandLines[i].MinReviseValue;
                        }
                        $('#bottomInstall_revise_Value').attr("disabled","disabled").val(MinReviseValue);
                    }
                    if(_StandLines[i].MinReviseSig!=null){
                        $("#bottomInstall_revise").find("option[value='"+_StandLines[i].MinReviseSig+"']").attr("selected",true);
                    }
                }
            }
        }

        //4.初始化绑定
        var StandLinGrpNames = $(this).find("#CustXSStLinegroupName");
        StandLinGrpNames.empty();
        if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
            for(var i=0;i<ThisChartStandLines.length;i++) {
                var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>";
                StandLinGrpNames.append(option);
            }
            StandLinGrpNames.find("option[value='"+ThisChartStandLines[0].GroupName+"']").attr("selected",true);
            $(this).find('#CustXSStLinename').hide();
            $(this).find('#CustXSStLinegroupName').show();
            groupNameChange(ThisChartStandLines);//绑定显示

            $("#btnEditGrp").show();
        }else{
            $(this).find('#CustXSStLinename').show();
            $(this).find('#CustXSStLinegroupName').hide();
        }

        //最大值和最下值绑定列默认值
        var StandLinetopValueColumns=$(this).find('#topValue');
        var StandLinebottomValueColumns=$(this).find('#bottomValue');
        StandLinetopValueColumns.empty();
        StandLinebottomValueColumns.empty();
        if(ChartEntityColumns!=null && ChartEntityColumns.length>0){
            for(var i=0;i<ChartEntityColumns.length;i++) {
                var option ="<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>";
                StandLinetopValueColumns.append(option);
                StandLinebottomValueColumns.append(option);
            }
            StandLinetopValueColumns.find("option[value='"+ChartEntityColumns[0]+"']").attr("selected","selected");
            StandLinebottomValueColumns.find("option[value='"+ChartEntityColumns[0]+"']").attr("selected","selected");
        }

    });
}
//3.2.样本极差标准线
Agi.Controls.CustomXSChartView_StandLinesMenu_SD=function(_Panel,_Control){
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
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-10', function () {
        //0.控件当前值获取
        var ThisChartStandLines=Me.Get("NoFormatPlotLines_SD");
        if(ThisChartStandLines!=null){
        }else{
            ThisChartStandLines=[];
        }
        $(this).find("#topColor_SD").spectrum({
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
                $("#topColor_SD").attr("value",color.toHexString());
            }
        });
        $(this).find("#bottomColor_SD").spectrum({
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
                $("#bottomColor_SD").attr("value",color.toHexString());
            }
        });

        //1.点击新增按钮
        $(this).find("#btnNewGrp_SD").click(function(){
            //清空面板
            var LineTablePanel=$(this).parent().parent().parent();
            LineTablePanel.find('#CustXSStLinename_SD').show();
            LineTablePanel.find('#CustXSStLinegroupName_SD').hide();
            LineTablePanel.find("#topWidth_SD").attr("value","1");
            LineTablePanel.find("#bottomWidth_SD").attr("value","1");
            LineTablePanel.find("#topValue1_SD").attr("value","");
            LineTablePanel.find("#bottomValue1_SD").attr("value","");
            LineTablePanel.find("#topColor_SD").spectrum("set",'#000');
            LineTablePanel.find("#bottomColor_SD").spectrum("set",'#000');

            $("#btnSaveGrp_SD").attr("opstate","0");
            $("#btnGrpUndo_SD").show();
            $("#btnEditGrp_SD").hide();
            $(this).hide();
            $("#btnDeleteGrp_SD").hide();
        });
        //2.保存按钮
        $(this).find("#btnSaveGrp_SD").click(function(){
            var SelectedItemObj=null;
            var Intopstatevalue=0;
            if($(this).attr("opstate")=="0"){}else{
                Intopstatevalue=1;
            }

            if($("#CustXSStLinegroupName_SD").is(":hidden")){
                if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                    //创建对象
                    if(Intopstatevalue==0){//新增
                        for(var i=0;i<ThisChartStandLines.length;i++){
                            if($("#CustXSStLinename_SD").attr('value')==ThisChartStandLines[i].GroupName)
                            {
                                AgiCommonDialogBox.Alert('标准线不允许重名！');
                                return;
                            }
                        }
                    }else{//编辑
                        var NewGrpName=$("#CustXSStLinename_SD").attr('value');
                        var OldSelGrpName=$("#CustXSStLinegroupName_SD").val();
                        var indexA=-1;
                        var indexB=-1;
                        if(NewGrpName!=OldSelGrpName){
                            for(var i=0;i<ThisChartStandLines.length;i++){
                                if(NewGrpName==ThisChartStandLines[i].GroupName)
                                {
                                    indexA=i;
                                }
                                if(OldSelGrpName==ThisChartStandLines[i].GroupName)
                                {
                                    indexB=i;
                                }
                            }
                            if(indexA>-1){
                                AgiCommonDialogBox.Alert('输入新名称与其它标准线名称重复！');
                                return;
                            }else{
                                ThisChartStandLines.splice(indexB,1);
                            }
                        }else{
                            SelectedItemObj=OldSelGrpName;
                        }
                    }
                }
            }else{
                var SelValue=$("#CustXSStLinegroupName_SD").val();
                if(SelValue!=null && SelValue!=""){
                    SelectedItemObj=SelValue;
                }
            }
            $('#CustXSStLinename_SD').hide();
            $('#CustXSStLinegroupName_SD').show();
            $('#btnGrpUndo_SD').hide();
            $('#btnEditGrp_SD').show();
            $("#btnNewGrp_SD").show();
            $("#btnDeleteGrp_SD").show();

            var line={
                GroupName:$("#CustXSStLinename_SD").attr('value'),
                MaxSize:$("#topWidth_SD").attr('value'),
                MaxColor:$("#topColor_SD").attr('value')==""?"#000":$("#topColor_SD").attr('value'),
                MaxValueType:$("#topInstall_SD option:selected").val(),
                MaxValue:$("#topInstall_SD option:selected").text()=="固定值"?$("#topValue1_SD").val():$("#topValue_SD option:selected").text(),
                MinSize:$("#bottomWidth_SD").attr('value'),
                MinColor:$("#bottomColor_SD").attr('value')==""?"#000":$("#bottomColor_SD").attr('value'),
                MinValueType:$("#bottomInstall_SD option:selected").val(),
                MinValue:$("#bottomInstall_SD option:selected").text()=="固定值"?$("#bottomValue1_SD").val():$("#bottomValue_SD option:selected").text(),
                MaxReviseSig:$("#topInstall_revise_SD").val(),//上限修正符号
                MaxReviseValue:$("#topInstall_revise_Value_SD").val(),//上限修正值
                MinReviseSig:$("#bottomInstall_revise_SD").val(),//下限修正符号
                MinReviseValue:$("#bottomInstall_revise_Value_SD").val()//下限修正值
            };
            //添加到数组
            if(SelValue!=null){
                line.GroupName=SelValue;
                if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                    for(var i=0;i<ThisChartStandLines.length;i++){
                        if(ThisChartStandLines[i].GroupName==SelValue){
                            ThisChartStandLines[i]=line;
                        }
                    }
                }
            }else{
                if(ThisChartStandLines!=null && ThisChartStandLines.length>=2){
                    ThisChartStandLines.push(line);
                    ThisChartStandLines.shift();
                }
                else{
                    ThisChartStandLines.push(line);
                }
            }

            var StandLinGrpNames = $("#CustXSStLinegroupName_SD");
            StandLinGrpNames.empty();
            if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                for(var i=0;i<ThisChartStandLines.length;i++) {
                    var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>";
                    StandLinGrpNames.append(option);
                }
                StandLinGrpNames.find("option[value='"+ThisChartStandLines[0].GroupName+"']").attr("selected",true);
            }

            groupNameChange(ThisChartStandLines);
            Me.UpPlotLineGroups_SD(ThisChartStandLines);//更新标准线显示
            Me.RefreshByProPanelUp();//刷新图形显示
        });
        //3.删除标准线组
        $(this).find('#btnDeleteGrp_SD').click(function(){
            if($('#CustXSStLinegroupName_SD').css('display')!="none"){
                var index=-1;
                for(var i=0;i<ThisChartStandLines.length;i++){
                    if($('#CustXSStLinegroupName_SD option:selected').text()==ThisChartStandLines[i].GroupName)
                    {
                        index=i;break;
                    }
                }
                ThisChartStandLines.splice(index,1);
                var name = $("#CustXSStLinegroupName_SD");
                name.empty();
                for(var i=0;i<ThisChartStandLines.length;i++) {
                    var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>"
                    name.append(option);
                }
                if(ThisChartStandLines.length==0)
                {
                    $('#CustXSStLinegroupName_SD').hide();
                    $('#CustXSStLinename_SD').val("").show();
                }
                groupNameChange(ThisChartStandLines);
            }
            else{
                AgiCommonDialogBox.Alert('请先选择要删除的标准线！');
            }
        });
        //4.取消
        $(this).find("#btnGrpUndo_SD").unbind().bind("click",function(ev){
            $(this).hide();
            $('#CustXSStLinename_SD').hide();
            $('#CustXSStLinegroupName_SD').show();
            $("#btnDeleteGrp_SD").show();
            $("#btnNewGrp_SD").show();
            $("#btnEditGrp_SD").show();

            groupNameChange(ThisChartStandLines);
        }).hide();

        //5.编辑
        $(this).find("#btnEditGrp_SD").unbind().bind("click",function(ev){
            var LineTablePanel=$(this).parent().parent().parent();
            LineTablePanel.find('#CustXSStLinename_SD').show().val(LineTablePanel.find('#CustXSStLinegroupName_SD').val());
            LineTablePanel.find('#CustXSStLinegroupName_SD').hide();
            $("#btnSaveGrp_SD").attr("opstate","1");

            $("#btnGrpUndo_SD").show();
            $(this).hide();
            $("#btnNewGrp_SD").hide();
            $("#btnDeleteGrp_SD").hide();
        }).hide();

        $(this).find("#topInstall_SD").change(function(){
            if( $("#topInstall_SD option:selected").text()=="固定值"){
                $('#topValue1_SD').show();
                $('#topValue_SD').hide();
                $('#topInstall_revise_SD').attr("disabled","disabled");
                $('#topInstall_revise_Value_SD').attr("disabled","disabled").val("");
            }
            else if($("#topInstall_SD option:selected").text()=="数据列"){
                $('#topValue1_SD').hide();
                $('#topValue_SD').show();
                $('#topInstall_revise_SD').removeAttr('disabled');
                $('#topInstall_revise_Value_SD').removeAttr('disabled');
            }
        });
        $(this).find("#bottomInstall_SD").change(function(){
            if( $("#bottomInstall_SD option:selected").text()=="固定值"){
                $('#bottomValue1_SD').show();
                $('#bottomValue_SD').hide();

                $('#bottomInstall_revise_SD').attr("disabled","disabled");
                $('#bottomInstall_revise_Value_SD').attr("disabled","disabled").val("");
            }
            else if($("#bottomInstall_SD option:selected").text()=="数据列"){
                $('#bottomValue1_SD').hide();
                $('#bottomValue_SD').show();

                $('#bottomInstall_revise_SD').removeAttr('disabled');
                $('#bottomInstall_revise_Value_SD').removeAttr('disabled');
            }
        });
        $(this).find("#CustXSStLinegroupName_SD").change(function(){
            debugger;
            groupNameChange(ThisChartStandLines);
        });

        //选中项发生更改
        var groupNameChange=function(_StandLines){
            for(var i=0;i<_StandLines.length;i++)
            {
                if($("#CustXSStLinegroupName_SD  option:selected").text()==_StandLines[i].GroupName){
                    $('#topWidth_SD').attr('value',_StandLines[i].MaxSize);
                    $("#topInstall_SD").find("option[value='"+_StandLines[i].MaxValueType+"']").attr("selected",true);
                    $('#topColor_SD').spectrum("set", _StandLines[i].MaxColor);
                    if( $("#topInstall_SD option:selected").text()=="固定值"){
                        $('#topValue1_SD').show();
                        $('#topValue_SD').hide();
                        $('#topValue1_SD').val(_StandLines[i].MaxValue);
                        $('#topInstall_revise_SD').attr("disabled","disabled");
                        $('#topInstall_revise_Value_SD').attr("disabled","disabled").val("");
                    }
                    else if($("#topInstall_SD option:selected").text()=="数据列"){
                        $('#topValue1_SD').hide();
                        $('#topValue_SD').show();
                        $("#topValue_SD").find("option[value='"+_StandLines[i].MaxValue+"']").attr("selected",true);
                        $('#topInstall_revise_SD').removeAttr('disabled');
                        var MaxReviseValue="";
                        if(_StandLines[i].MaxReviseValue!=null && _StandLines[i].MaxReviseValue!=""){
                            MaxReviseValue=_StandLines[i].MaxReviseValue;
                        }
                        $('#topInstall_revise_Value_SD').removeAttr('disabled').val(MaxReviseValue);
                    }
                    if(_StandLines[i].MaxReviseSig!=null){
                        $("#topInstall_revise_SD").find("option[value='"+_StandLines[i].MaxReviseSig+"']").attr("selected",true);
                    }

                    $('#bottomWidth_SD').attr('value',_StandLines[i].MinSize);
                    $("#bottomInstall_SD").find("option[value='"+_StandLines[i].MinValueType+"']").attr("selected",true);
                    $('#bottomColor_SD').spectrum("set", _StandLines[i].MinColor);
                    if( $("#bottomInstall_SD option:selected").text()=="固定值"){
                        $('#bottomValue1_SD').show();
                        $('#bottomValue_SD').hide();
                        $('#bottomValue1_SD').val(_StandLines[i].MinValue);

                        $('#bottomInstall_revise_SD').attr("disabled","disabled");
                        $('#bottomInstall_revise_Value_SD').attr("disabled","disabled").val("");
                    }
                    else if($("#bottomInstall_SD option:selected").text()=="数据列"){
                        $('#bottomValue1_SD').hide();
                        $('#bottomValue_SD').show();
                        $("#bottomValue_SD").find("option[value='"+_StandLines[i].MinValue+"']").attr("selected",true);

                        $('#bottomInstall_revise_SD').attr("disabled","disabled");
                        var MinReviseValue="";
                        if(_StandLines[i].MinReviseValue!=null && _StandLines[i].MinReviseValue!=""){
                            MinReviseValue=_StandLines[i].MinReviseValue;
                        }
                        $('#bottomInstall_revise_Value_SD').attr("disabled","disabled").val(MinReviseValue);
                    }
                    if(_StandLines[i].MinReviseSig!=null){
                        $("#bottomInstall_revise_SD").find("option[value='"+_StandLines[i].MinReviseSig+"']").attr("selected",true);
                    }
                }
            }
        }

        //4.初始化绑定
        var StandLinGrpNames = $(this).find("#CustXSStLinegroupName_SD");
        StandLinGrpNames.empty();
        if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
            for(var i=0;i<ThisChartStandLines.length;i++) {
                var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>";
                StandLinGrpNames.append(option);
            }
            StandLinGrpNames.find("option[value='"+ThisChartStandLines[0].GroupName+"']").attr("selected",true);
            $(this).find('#CustXSStLinename_SD').hide();
            $(this).find('#CustXSStLinegroupName_SD').show();
            groupNameChange(ThisChartStandLines);//绑定显示

            $("#btnEditGrp_SD").show();
        }else{
            $(this).find('#CustXSStLinename_SD').show();
            $(this).find('#CustXSStLinegroupName_SD').hide();
        }

        //最大值和最下值绑定列默认值
        var StandLinetopValueColumns=$(this).find('#topValue_SD');
        var StandLinebottomValueColumns=$(this).find('#bottomValue_SD');
        StandLinetopValueColumns.empty();
        StandLinebottomValueColumns.empty();
        if(ChartEntityColumns!=null && ChartEntityColumns.length>0){
            for(var i=0;i<ChartEntityColumns.length;i++) {
                var option ="<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>";
                StandLinetopValueColumns.append(option);
                StandLinebottomValueColumns.append(option);
            }
            StandLinetopValueColumns.find("option[value='"+ChartEntityColumns[0]+"']").attr("selected","selected");
            StandLinebottomValueColumns.find("option[value='"+ChartEntityColumns[0]+"']").attr("selected","selected");
        }

    });
}

//4.在View环境中显示下西格玛设置菜单项
Agi.Controls.CustomXSChartView_SigmaSettingMenu=function(_Panel,_Control){
    var Me=_Control;
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-6', function () {
        $(this).find(".CustSigmaSetColor").spectrum({
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
                $(this).attr("value",color.toHexString());
            }
        });
        $(this).find("#CstXSSigmaOptionSave").unbind().bind("click",function(ev){
            var newcp=Me.Get("ChartProperty");//获取属性
            newcp.ChartisigmaValue=$("#CustXSSigmaValue").val();
            newcp.yAxis_PlotLines_MaxMarkerColor=$("#CustSigmatopColor").val();
            newcp.yAxis_PlotLines_MinMarkerColor=$("#CustSigmabottomColor").val();
            var StateValue=$("#CustXSSigmaLineState").val();
            if(StateValue=="0"){
                newcp.ChartisigmaLineVisible=false;
                newcp.series_MinPlotLine_Enabled=false;
                newcp.series_MiddlePlotLine_Enabled=false;
                newcp.series_MaxPlotLine_Enabled=false;
            }else{
                newcp.ChartisigmaLineVisible=true;
                newcp.series_MinPlotLine_Enabled=true;
                newcp.series_MiddlePlotLine_Enabled=true;
                newcp.series_MaxPlotLine_Enabled=true;
            }
            Me.Set("ChartProperty",newcp);//保存属性更改
            Me.RefreshByProPanelUp();//更新显示
            newcp=null;
        });
        var cp=Me.Get("ChartProperty");//获取属性
        //ChartisigmaValue,ChartisigmaLineVisible,yAxis_PlotLines_MaxMarkerColor,yAxis_PlotLines_MinMarkerColor
        $(this).find("#CustSigmatopColor").spectrum("set",cp.yAxis_PlotLines_MaxMarkerColor);
        $(this).find("#CustSigmabottomColor").spectrum("set",cp.yAxis_PlotLines_MinMarkerColor);
        $(this).find("#CustXSSigmaValue").val(cp.ChartisigmaValue);
        var VisibleStateValue="1";
        if(!cp.ChartisigmaLineVisible){
            VisibleStateValue="0";
        }
        $(this).find("#CustXSSigmaLineState").find("option[value='"+VisibleStateValue+"']").attr("selected",true);
        cp=null;
    });
}
//4.在View环境中显示西格玛判异菜单项
Agi.Controls.CustomXSChartView_SigmaMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-3', function () {
        var THisChartSigmaRules=Me.Get("SigXSules");//获取八项判异规则
        //1.八项规则保存
        $(this).find("#CustXSSigMaRuleSave").unbind().bind("click",function(ev){
            var rule=[];
            var ruleitem=null;
            for(i=1;i<=8;i++)
            {
                ruleitem={
                    NO:i,
                    Kvalue:$('#K'+i).val(),
                    color:$('#Kcolor'+i).attr("value")==""?"#f00":$('#Kcolor'+i).attr('value'),
                    ischecked:$("input[name='ruleNum'][value='"+i+"']").attr('checked')==undefined?false:true
                }
                rule.push(ruleitem);
                ruleitem=null;
            }
            Me.UpSigmConditions(rule);//应用西格玛八项判异规则
            Me.RefreshByProPanelUp();//更新显示
        });
        //2.八项规则默认颜色控件初始化
        $(this).find(".SigmaRulColor").spectrum({
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
                $(this).attr("value",color.toHexString());
            }
        });
        //3.判断当前控件有没有应用规则，进行绑定
        if(THisChartSigmaRules==null){
            THisChartSigmaRules=[];
			//20140303 倪飘 8项判异规则的默认颜色更改为红色
			$('#Kcolor1').spectrum("set",'#f00');
			$('#Kcolor2').spectrum("set",'#f00');
			$('#Kcolor3').spectrum("set",'#f00');
			$('#Kcolor4').spectrum("set",'#f00');
			$('#Kcolor5').spectrum("set",'#f00');
			$('#Kcolor6').spectrum("set",'#f00');
			$('#Kcolor7').spectrum("set",'#f00');
			$('#Kcolor8').spectrum("set",'#f00');
        }
        if(THisChartSigmaRules!=null && THisChartSigmaRules.length>0){
            for(var i=1;i<=THisChartSigmaRules.length;i++){
                $(this).find('#K'+THisChartSigmaRules[i-1].NO).val(THisChartSigmaRules[(i-1)].Kvalue);
                $(this).find('#Kcolor'+THisChartSigmaRules[i-1].NO).spectrum("set",THisChartSigmaRules[(i-1)].color);
                $(this).find("input[name='ruleNum'][value='"+i+"']").attr('checked',THisChartSigmaRules[(i-1)].ischecked);
            }
        }
    });
}
//5.特殊报警
Agi.Controls.CustomXSChartView_SpecialAlarmMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-5', function () {
        //1.保存规则
        $(this).find('#warnSave').click(function(){
            var warn={
                warnColumn:$('#warnColumn').val(),
                warnRule:$('#warnRule').val(),
                warnCompareValue:$('#warnCompareValue').val(),
                warnColor:$('#tab5Color').val()
            }
            if(warn.warnCompareValue==""){
                warn=null;
            }
            Me.Set("WarnRule",warn);//特殊报警功能
            Me.RefreshByProPanelUp();//更新显示
        });
        //2.删除规则
        $(this).find('#warnDelete').click(function(){
            $('#warnCompareValue').val("");
            Me.Set("WarnRule",null);//特殊报警功能
            Me.RefreshByProPanelUp();//更新显示
        });
        //3.默认数据列填充
        var warnColumns=$(this).find('#warnColumn');
        warnColumns.empty();
        for(var i=0;i<ChartEntityColumns.length;i++) {
            var option ="<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>";
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
                $(this).attr("value",color.toHexString());
            }
        });
        var WarnRuleCondition=Me.Get("WarnRule");//特殊报警功能
        if(WarnRuleCondition!=null){
            warnColumns.find("option[value='"+WarnRuleCondition.warnColumn+"']").attr("selected",true);
            $(this).find('#warnRule').find("option[value='"+WarnRuleCondition.warnRule+"']").attr("selected",true);
            $(this).find('#warnCompareValue').val(WarnRuleCondition.warnCompareValue);
            $(this).find('#tab5Color').spectrum("set",WarnRuleCondition.warnColor);
        }
    });
}
//endreigon

//6.数据钻取设置
Agi.Controls.CustomXSChartView_ExtractMenu=function(_Panel,_Control){
    var Me=_Control;
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
    if(ChartExtractConfig!=null){}else{
        ChartExtractConfig={URL:"",Paras:[]};
    }
    // {URL:页面URL,Paras:[{Name:"p1",Column:"column1",Value:"值1"},Name:"p2",Column:"column2",Value:"值2"}]}

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-7', function () {
        //0.默认选项隐藏
        $("#CustomXSParCancel").hide();
        $("#CustomXSNewParsTxt").width(0).hide();

        //1.添加参数
        $(this).find('#CustomXSParAdd').click(function(){
            $(this).hide();
            $("#CustomXSParCancel").show();
            $("#CustomXSNewParsTxt").width(60).show();
            $("#CustomXSParsNames").hide();
        });
        //2.取消添加
        $(this).find('#CustomXSParCancel').click(function(){
            $("#CustomXSParCancel").hide();
            $("#CustomXSNewParsTxt").width(0).val("").hide();
            $("#CustomXSParsNames").show();
            $("#CustomXSParAdd").show();
        });
        //3.保存
        $(this).find('#CustomXSParSave').click(function(){
            var SCSTxtVisibly=!$("#CustomXSNewParsTxt").is(':hidden');
            var CusChartParsName="";
            var CusChartParsValue="";
            if(SCSTxtVisibly){
                //新增参数
                CusChartParsName=$("#CustomXSNewParsTxt").val();
                CusChartParsValue=$("#CustomXSParsValues").val();
            }else{
                //编辑参数
                CusChartParsName=$("#CustomXSParsNames").val();
                CusChartParsValue=$("#CustomXSParsValues").val();
            }
            if(CusChartParsName!=null && CusChartParsName!="" && CusChartParsValue!=null && CusChartParsValue!=""){
                var ParIndex=-1;
                if(ChartExtractConfig.Paras!=null && ChartExtractConfig.Paras.length>0){
                    for(var i=0;i<ChartExtractConfig.Paras.length;i++){
                        if(ChartExtractConfig.Paras[i].Name==CusChartParsName){
                            ParIndex=i;
                            break;
                        }
                    }
                    if(SCSTxtVisibly){
                        if(ParIndex>-1){
                            AgiCommonDialogBox.Alert("同名参数已存在，无法添加!");
                        }else{
                            ChartExtractConfig.Paras.push({Name:CusChartParsName,Column:CusChartParsValue,Value:""});
                            $("#CustomXSParsNames").append("<option value='"+CusChartParsName+"'>"+CusChartParsName+"</option>");

                            $("#CustomXSParCancel").hide();
                            $("#CustomXSNewParsTxt").width(0).val("").hide();
                            $("#CustomXSParsNames").show();
                            $("#CustomXSParAdd").show();

                            $("#CustomXSParsNames").val(CusChartParsName);
                            //更新列表显示
                            Agi.Controls.CustomXSChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");

                            AgiCommonDialogBox.Alert("添加成功!");
                        }
                    }else{
                        ChartExtractConfig.Paras[i].Column=CusChartParsValue;
                        //更新列表显示
                        Agi.Controls.CustomXSChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
                        AgiCommonDialogBox.Alert("修改成功!");
                    }
                }else{
                    ChartExtractConfig.Paras.push({Name:CusChartParsName,Column:CusChartParsValue,Value:""});
                    $("#CustomXSParsNames").append("<option value='"+CusChartParsName+"'>"+CusChartParsName+"</option>");

                    $("#CustomXSParCancel").hide();
                    $("#CustomXSNewParsTxt").width(0).val("").hide();
                    $("#CustomXSParsNames").show();
                    $("#CustomXSParAdd").show();

                    $("#CustomXSParsNames").val(CusChartParsName);

                    //更新列表显示
                    Agi.Controls.CustomXSChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");

                    AgiCommonDialogBox.Alert("添加成功!");
                }

                Me.Set("ExtractConfig",ChartExtractConfig);//数据钻取配置信息保存
            }else{
                AgiCommonDialogBox.Alert("参数名称和绑定列不可为空!");
            }
        });
        //4.删除
        $(this).find('#CustomXSParDel').click(function(){
            var SCSTxtVisibly=!$("#CustomXSNewParsTxt").is(':hidden');
            if(SCSTxtVisibly){
                AgiCommonDialogBox.Alert("请取消或完成新增，选择已存在的参数名称后再试!");
            }else{
                //编辑参数
               var CusChartParsName=$("#CustomXSParsNames").val();
                if(ChartExtractConfig.Paras!=null && ChartExtractConfig.Paras.length>0){
                    var ParIndex=-1;
                    for(var i=0;i<ChartExtractConfig.Paras.length;i++){
                        if(ChartExtractConfig.Paras[i].Name==CusChartParsName){
                            ParIndex=i;
                            break;
                        }
                    }
                    if(ParIndex>-1){
                        //移除对应的Option项
                        $("#CustomXSParsNames option[value='"+ChartExtractConfig.Paras[ParIndex].Name+"']").remove(); //删除Select中Value=''的Option

                        ChartExtractConfig.Paras.splice(ParIndex,1);
                        //更新列表显示
                        Agi.Controls.CustomXSChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
                        Me.Set("ExtractConfig",ChartExtractConfig);//数据钻取配置信息保存

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
                    $("#CustXSExtractURL").html(strCustSigChartExtractURLoptions);
                    if(ChartExtractConfig!=null && ChartExtractConfig.URL!=null){
                        $("#CustXSExtractURL").find("[value='"+ChartExtractConfig.URL+"']").attr("selected","selected");
                    }
                }
            }
        })
        if(ChartExtractConfig.Paras!=null && ChartExtractConfig.Paras.length>0){
            for(var i=0;i<ChartExtractConfig.Paras.length;i++){
                $("#CustomXSParsNames").append("<option value='"+ChartExtractConfig.Paras[i].Name+"'>"+ChartExtractConfig.Paras[i].Name+"</option>");
            }
            DefaultParNameColumn=ChartExtractConfig.Paras[0].Column;
            $("#CustomXSParsNames").val(ChartExtractConfig.Paras[0].Name);

            //更新列表显示
            Agi.Controls.CustomXSChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
        }else{
            $("#CustomXSParAdd").hide();
            $("#CustomXSParCancel").show();
            $("#CustomXSNewParsTxt").width(60).show();
            $("#CustomXSParsNames").hide();
        }
        if(ChartEntityColumns!=null && ChartEntityColumns.length>0){
            for(var i=0;i<ChartEntityColumns.length;i++){
                $("#CustomXSParsValues").append("<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>");
            }
            if(DefaultParNameColumn!=null){
                $("#CustomXSParsValues").val(DefaultParNameColumn);
            }
        }
        //6.参数名称选中项更改
        $(this).find('#CustomXSParsNames').change(function(){
            var StrThisSelValue=$(this).val();
            var ThisParas=Me.Get("ExtractConfig").Paras;//数据钻取配置信息保存
            if(ThisParas!=null && ThisParas.length>0){
                for(var i=0;i<ThisParas.length;i++){
                    if(ThisParas[i].Name==StrThisSelValue){
                        $("#CustomXSParsValues").val(ThisParas[i].Column);
                        break;
                    }
                }
            }
        });
        //7.参数项&URL信息保存
        $(this).find('#CstXSExtractOptionSave').click(function(){
            var ThisExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息保存
            ThisExtractConfig.URL=$("#CustXSExtractURL").val();
            Me.Set("ExtractConfig",ThisExtractConfig);//数据钻取配置信息保存
            AgiCommonDialogBox.Alert("数据钻取配置信息保存成功!");
        });
    });
}
//7.背景设置
Agi.Controls.CustomXSChartView_BackgroundSetMenu=function(_Panel,_Control){
    var Me=_Control;
    //获取属性
    var cp = Me.Get('ChartProperty');

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-8', function () {
        $(this).find(".CustomXSColorSty").spectrum({
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
                $(this).attr("value",color.toHexString());
            }
        });

        $("#CustomXS_bgvalue").unbind().bind("click",function(){
            var oThisSelColorPanel=this;
            Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[2],true,function(color){
                if(color.direction==="radial"){
                    AgiCommonDialogBox.Alert("该图表不支持此种渐变类型!");
                }else{
                    //20130529 14:17 markeluo 提示背景只支持两种颜色
                    if(color!=null && color.type==2 && color.stopMarker.length>2){
                        AgiCommonDialogBox.Alert("此背景渐变只支持两种颜色，将从多个颜色中取前两个颜色!");
                    }
                    $(oThisSelColorPanel).css("background",color.value.background).data('colorValue', color);
                }
                oThisSelColorPanel=null;
            });
        });
        var ThisChartbgvalue=Agi.Controls.CustomXSChartBackgroundValueGet(cp.ChartBackConfig.backgroundColor);
        $("#CustomXS_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项
        // backgroundColor//背景 ,Tolbtnbackground,//菜单按钮背景,TolbtnFontColor,//菜单按钮字体,TolTabbackground,//统计表格背景,TolTabFontColor//统计表格字体
        $("#CustomXS_Tolbgvalue").spectrum("set",cp.ChartBackConfig.Tolbtnbackground);
        $("#CustomXS_Tolbtncolor").spectrum("set",cp.ChartBackConfig.TolbtnFontColor);
        $("#CustomXS_TolTabbg").spectrum("set",cp.ChartBackConfig.TolTabbackground);
        $("#CustomXS_TolTabfontbg").spectrum("set",cp.ChartBackConfig.TolTabFontColor);

        $("#CustomXS_BackgroundSave").unbind().bind("click",function(){
            var color=$("#CustomXS_bgvalue").data('colorValue');
            var BgColorValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
            var BackgroudObj={
                BolIsTransfor:BgColorValue.BolIsTransfor,//是否透明
                StartColor:BgColorValue.StartColor,//开始颜色
                EndColor:BgColorValue.EndColor,//结束颜色
                GradualChangeType:BgColorValue.GradualChangeType,//渐变方式
                Tolbtnbackground:$("#CustomXS_Tolbgvalue").val(),//统计信息按钮背景
                TolbtnFontColor:$("#CustomXS_Tolbtncolor").val(),//统计信息按钮字体颜色
                TolTabbackground:$("#CustomXS_TolTabbg").val(),//统计信息表格背景
                TolTabFontColor:$("#CustomXS_TolTabfontbg").val()//统计信息表格字体颜色
            }
            Agi.Controls.CustomXSChart.BackgroundApply(Me,BackgroudObj);//背景应用
            Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
        })
    });
}
//9.标准差估计
Agi.Controls.CustomXSChartView_RTypeMenu=function(_Panel,_Control){
    var Me=_Control;
    var cp = Me.Get('ChartProperty');
    //获取属性
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/CustomXSChart/tabTemplates.html #tab-9', function () {
        $("#CustomXS_RTypeSave").unbind().bind("click",function(){
            cp= Me.Get('ChartProperty');
            cp.optionVal=$('input:radio[name="CustomXS_RTypeRadio"]:checked').val();
            Me.Set('ChartProperty',cp);
            Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
        });
        if(cp.optionVal=="Rbar"){
            $("#RadiRbar").attr("checked","checked");
        }else{
            $("#RadimergeStdDev").attr("checked","checked");
        }
    });
}

//endegion

//region 21030917 22:26 markeluo 标准线和西格玛线报警汇总统计面板显示
Agi.Controls.CustomXSChartAlarmStatisticalTableShow=function(_AlarmStatisticaldata,_ApendToPanel,_BackGroundConfig){
    if(_BackGroundConfig.Tolbtnbackground!=null && _BackGroundConfig.Tolbtnbackground!=""){}else{
        _BackGroundConfig.Tolbtnbackground="#ffffff";
    }
    if(_BackGroundConfig.TolbtnFontColor!=null && _BackGroundConfig.TolbtnFontColor!=""){}else{
        _BackGroundConfig.TolbtnFontColor="#3d95e6";
    }
    if(_BackGroundConfig.TolTabbackground!=null && _BackGroundConfig.TolTabbackground!=""){}else{
        _BackGroundConfig.TolTabbackground="#ffffff";
    }
    if(_BackGroundConfig.TolTabFontColor!=null && _BackGroundConfig.TolTabFontColor!=""){}else{
        _BackGroundConfig.TolTabFontColor="#000000";
    }
    if($("#CustomXSChartAlarmPanel").length>0){
        $("#CustomXSChartAlarmPanel").html("<a id='btnTotalMenu' class='totalAlarmmenusty' >+统计信息</a></div>");
    }else{
        var CustomXSChartAlarmPanelHTML=$("<div id='CustomXSChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomXSChartAlarmPanel").css({"right":"8px","top":"8px"});
        CustomXSChartAlarmPanelHTML.append("<a  id='btnTotalMenu' class='totalAlarmmenusty'>+统计信息</a>");
    }
    $("#btnTotalMenu").unbind().bind("click",function(ev){
        $(this).hide();
        $("#TotalTable").fadeIn(500);
        ev.stopPropagation();    //  阻止事件冒泡
    });//显示统计表格
    var SubItemHTML="<table id='TotalTable' class='tabsty'>";
    SubItemHTML+="<tr><td colspan='5' style='line-height:30px;height:30px;'>" +
        "<a id='toalAlarmTableDownload' class='totalAlarmmenusty' style='float: left;margin: 5px 5px 5px 0px;'>下载</a>" +
        "<a  id='btnTotalHidenMenu' class='totalAlarmmenusty' style='float: right;margin: 5px 5px 5px 0px;'>-隐藏统计信息</a>" +
        "</td></tr>";
    SubItemHTML+="<tr><td style='background-color:#4bacc6'>分析内容</td><td colspan='4' class='toalarmEditcell'>热轧宽度均值极差图</td></tr>";
    SubItemHTML+="<tr><td style='background-color:#4bacc6'>图形名称</td><td style='background-color:#4bacc6'>均值极差</td><td></td><td></td><td></td></tr>";
    SubItemHTML+="<tr><td style='background-color:#4bacc6'>样本点个数</td><td>100</td><td></td><td></td><td></td></tr>";
    SubItemHTML+="<tr><td style='background-color:#4bacc6'>分图时间</td><td>2013-9-17 22:46:13</td><td></td><td></td><td></td></tr>";
    SubItemHTML+="<tr><td style='background-color:#4bacc6'>备注</td><td colspan='4' class='toalarmEditcell'></td></tr>";
    SubItemHTML+="<tr><td style='background-color:#4bacc6'>分组</td><td style='background-color:#4bacc6'>标准线</td><td style='background-color:#4bacc6'>标准线值</td><td style='background-color:#4bacc6'>异常点个数</td><td style='background-color:#4bacc6'>异常点百分比</td></tr>";
    if(_AlarmStatisticaldata!=null && _AlarmStatisticaldata.PlotLines!=null && _AlarmStatisticaldata.PlotLines.length>0){
        var SumPercentageValue=0;
        var PercentageValue=0;
        var StandLineValue=null;
        for(var i=0;i<_AlarmStatisticaldata.PlotLines.length;i++){
            SumPercentageValue=accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Percentage),100);
            for(var j=0;j<_AlarmStatisticaldata.PlotLines[i].Items.length;j++){
                //{value,columnName,dashStyle,color,width,id,zIndex};
                PercentageValue=accMul(parseFloat(_AlarmStatisticaldata.PlotLines[i].Items[j].Percentage),100);
                if(_AlarmStatisticaldata.PlotLines[i].Items[j].columnName!=null){
                    StandLineValue=_AlarmStatisticaldata.PlotLines[i].Items[j].columnName;
                }else{
                    StandLineValue=_AlarmStatisticaldata.PlotLines[i].Items[j].value;
                }
                SubItemHTML+="<tr><td style='background-color:#4bacc6'>"+_AlarmStatisticaldata.PlotLines[i].GroupName+"</td><td style='background-color:#4bacc6'>"+_AlarmStatisticaldata.PlotLines[i].Items[j].id+"</td><td>"+StandLineValue+"</td><td>"+_AlarmStatisticaldata.PlotLines[i].Items[j].AlarmSum+"</td><td>"+PercentageValue+"</td></tr>";
            }
            SubItemHTML+="<tr><td style='background-color:#4bacc6'>"+_AlarmStatisticaldata.PlotLines[i].GroupName+"</td><td style='background-color:#4bacc6'>合计</td><td></td><td>"+_AlarmStatisticaldata.PlotLines[i].AlarmSum+"</td><td>"+SumPercentageValue+"</td></tr>";
        }
    }
    if(_AlarmStatisticaldata!=null && _AlarmStatisticaldata.SGM!=null){
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>西格玛值</td><td>"+_AlarmStatisticaldata.SGM.SigmaValue+"</td><td></td><td></td></tr>";
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>超上限</td><td ></td><td>"+_AlarmStatisticaldata.SGM.MaxObj.AlarmSum+"</td><td>"+accMul(parseFloat(_AlarmStatisticaldata.SGM.MaxObj.Percentage),100)+"</td></tr>";
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>超下限</td><td ></td><td>"+_AlarmStatisticaldata.SGM.MinObj.AlarmSum+"</td><td>"+accMul(parseFloat(_AlarmStatisticaldata.SGM.MinObj.Percentage),100)+"</td></tr>";
        var PercentageValue=accMul(parseFloat(_AlarmStatisticaldata.SGM.Percentage),100);
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>合计</td><td ></td><td>"+_AlarmStatisticaldata.SGM.AlarmSum+"</td><td>"+PercentageValue+"</td></tr>";
    }
    SubItemHTML+="</table>"
    $("#CustomXSChartAlarmPanel").append(SubItemHTML);
    $("#CustomXSChartAlarmPanel").find(".totalAlarmmenusty").css({
        "color":_BackGroundConfig.TolbtnFontColor,
        "background-color":_BackGroundConfig.Tolbtnbackground
    })
    $("#CustomXSChartAlarmPanel").find("#TotalTable").css({
        "color":_BackGroundConfig.TolTabFontColor,
        "background-color":_BackGroundConfig.TolTabbackground
    })

    $("#btnTotalHidenMenu").unbind().bind("click",function(ev){
        $("#TotalTable").fadeOut(500,function(){$("#btnTotalMenu").show();});
        ev.stopPropagation();    //  阻止事件冒泡
    });//隐藏统计表格
    $("#toalAlarmTableDownload").unbind().bind("click",function(ev){

    })//下载统计表格
    $(".toalarmEditcell").unbind().bind("dblclick",function(ev){
        var Thistxt=$(this).html();
        $(this).html("");
        if($("#txtemp").length>0){}else{
            $("<input type='text' value='' id='txtemp' style='width: 98%;display:none;'>").appendTo($(this));
        }
        $("#txtemp").appendTo($(this)).show().focus();
        $("#txtemp").blur(function(ev){
            var txtParent=$("#txtemp").parent();
            var txtValue=$(this).val();
            txtParent.html(txtValue);
            $(this).remove();
        });
        $("#txtemp").val(Thistxt);
        ev.stopPropagation();    //  阻止事件冒泡
    });
    $("#CustomXSChartAlarmPanel").unbind().bind("dblclick",function(ev){
        ev.stopPropagation();    //  阻止事件冒泡
    });

    //统计表格下载
    $("#toalAlarmTableDownload").unbind().bind("click",function(ev){
        var totalTablhtml="<html xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head>"+
            "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>"+
            "<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name></x:Name><x:WorksheetOptions><x:Selected/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->"+
            "<style type='text/css'>"+
            " .tabsty{width: 100%;height: auto;border-radius: 5px;font-size:12px;font-weight: bold;font-family: '微软雅黑',Arial,'黑体';border: 1px solid #cccccc;border-collapse: collapse;}"+
            ".tabsty tr{height:25px;}"+
            ".tabsty td{border: 1px solid #cccccc;border-collapse: collapse;}"+
            "</style></head>"+
            "<body>"+
            "<div class='gdtjContainer'>"+
            $("#CustomXSChartAlarmPanel").html()+
            "</div>"+
            "</body>"+
            "</html>";
        Agi.DAL.JAVAPostManager({ "MethodName": "HtmlToExcel", "Paras": totalTablhtml, "CallBackFunction": function (_result) {
                if(_result.result=="true"){
                    var str =_result.path;
                    window.open(str, 'mywindow');
                }else{
                    AgiCommonDialogBox.Alert(_result.message);
                }
            }
        });
    });
}
//endregion
//region 编辑数据后显示对照图形
Agi.Controls.CustomXSChartLastChartShow=function(_Controls){
    var Me=_Controls;
    if(Me.Get("LastChartImgIsExt")){
        Agi.Controls.CustomXSChartLastChartShowMenu(Me,true);
    }else{
        var _canvas = [];
        var ControlPanelID=$(Me.Get('HTMLElement'))[0].id;
        var svgList = $("#"+ControlPanelID).find("svg");
        for (var i = 0; i < svgList.length; i++) {
            var newcanvas = document.createElement("canvas");
            var parent = $(svgList[i]).parent();
            canvg(newcanvas, parent.html());
            $(parent).append(newcanvas);
            $(svgList[i]).hide();

            _canvas.push(newcanvas);
        }
        html2canvas($("#"+ControlPanelID)[0],{
            onrendered:function(canvas, a){
                $("svg").show();
                for (var i = 0; i < _canvas.length; i++) {
                    $(_canvas[i]).remove();
                }
                if($("#"+ControlPanelID+"_Img").length>0){
                    $("#"+ControlPanelID+"_Img").remove();
                }
                var ThisControlObj= Me.Get('chart');
               // $(ThisControlObj.renderTo).append("<div id='"+ControlPanelID+"_Img' class='XSChartLastImgPanel'><img src='"+canvas.toDataURL('image/png')+"' style='width:100%;height:100%;'></div>");
                $("#"+ControlPanelID).append("<div id='"+ControlPanelID+"_Img' class='XSChartLastImgPanel'><img src='"+canvas.toDataURL('image/png')+"' style='width:100%;height:100%;'></div>");
                $("#"+ControlPanelID+"_Img").height(parseInt($("#"+ControlPanelID).height()/2));
                Agi.Controls.CustomXSChartLastChartShowMenu(Me,true);
                Me.Set("LastChartImgIsExt",true);
            }
        });
        Me.Set("IsShowLastChart",false);
    }
}
Agi.Controls.CustomXSChartRefreshShowExe=function(_Controls){
    return function(){
        _Controls.RefreshByProPanelUp();
    };
}

Agi.Controls.CustomXSChartLastChartShowMenu=function(_Control,_IsShow){
    var Me=_Control;
    var _ApendToPanel=Me.Get("HTMLElement");
    if(_IsShow){
        if($("#CustomXSChartLastImgMenu").length>0){
        }else{
            var CustomXSChartLastImgHTML=$("<div id='CustomXSChartLastImgMenu' class='AlarmStyLasgImg' data-state='0'>查看原始图形</div>").appendTo($(_ApendToPanel));
            $("#CustomXSChartLastImgMenu").css({"right":"78px","top":"8px"});
        }
        $("#CustomXSChartLastImgMenu").show();
        $("#CustomXSChartLastImgMenu").unbind().bind("click",function(ev){
            var ControlPanelID=$(Me.Get('HTMLElement'))[0].id;
            if($(this).data("state")=="0"){
                $(this).data("state","1");
                $(this).html("隐藏原始图形");
                var ThisControlObj= Me.Get('chart');
                ThisControlObj.setSize($("#"+ControlPanelID).width(),parseInt($("#"+ControlPanelID).height()/2));/*Chart 更改大小*/
                $("#"+ControlPanelID+"_Img").appendTo($(ThisControlObj.renderTo)).show();
            }else{
                $(this).data("state","0");
                $(this).html("查看原始图形");
                $("#"+ControlPanelID+"_Img").appendTo($("#"+ControlPanelID)).hide();
                var ThisControlObj= Me.Get('chart');
                ThisControlObj.setSize($("#"+ControlPanelID).width(),$(ThisControlObj.renderTo).height());/*Chart 更改大小*/
            }
        });
    }else{
        $("#CustomXSChartLastImgMenu").hide();//隐藏
    }

}
//显示均值极差图数据钻取参数列表
Agi.Controls.CustomXSChartParsListUpdate=function(_Paras,_ListPanelID){
    var StrListItems="";
    if(_Paras!=null && _Paras.length>0){
        for(var i=0;i<_Paras.length;i++){
            StrListItems+=" <div class='ParsListHeadSty'><div class='CustomXSParsListCellSty'>"+_Paras[i].Name+"</div><div class='CustomXSParsListCellSty'>"+_Paras[i].Column+"</div></div>";
        }
    }
    $("#"+_ListPanelID).html(StrListItems);
}
//endregion
//region 背景设置
Agi.Controls.CustomXSChartBackgroundValueGet=function(_oBackgroundObj){
    var oBackground={"type":1,"rgba":"rgba(0,0,0,0)","hex":"ffffff","ahex":"ffffffff","value":{"background":"rgba(0,0,0,0)"}};
    if(_oBackgroundObj!=null){
        var backgroundstops=_oBackgroundObj.stops;
        var lineargradientoption=_oBackgroundObj.linearGradient;
        if(lineargradientoption!=null){
            if(backgroundstops[0][1]===backgroundstops[1][1]
                && backgroundstops[0][1]==="rgba(0,0,0,0)"){
            }else{
                oBackground={
                    "type":2,
                    "direction":"vertical",
                    "stopMarker":
                        [{
                            "position":0.29,
                            "color":"rgb(0,0,0)",
                            "ahex":"#ffffffff"
                        },{
                            "position":0.88,
                            "color":"rgb(0,0,0)",
                            "ahex":"#ffffffff"
                        }],
                    "value":{
                        "background":"#ffffff"
                    }
                };
                if(lineargradientoption.x1!=null){
                    if(backgroundstops[0][1].indexOf("rgb(")<0 && backgroundstops[0][1].indexOf("rgba(")<0){
                        if(backgroundstops[0][1].indexOf("#")<0){
                            backgroundstops[0][1]="#"+backgroundstops[0][1];
                        }
                    }
                    if(backgroundstops[1][1].indexOf("rgb(")<0 && backgroundstops[1][1].indexOf("rgba(")<0){
                        if(backgroundstops[1][1].indexOf("#")<0){
                            backgroundstops[1][1]="#"+backgroundstops[1][1];
                        }
                    }
                    if(lineargradientoption.x1===0 && lineargradientoption.y1===0 && lineargradientoption.x2==1 && lineargradientoption.y2===0){
                        //horizontal
                        oBackground.direction="horizontal";
                        oBackground.value.background="-webkit-gradient(linear, left top, right top,color-stop(0.29,"+backgroundstops[0][1]+"),color-stop(0.88,"+backgroundstops[1][1]+"))";
                    }else if(lineargradientoption.x1===0 && lineargradientoption.y1===0 && lineargradientoption.x2==1 && lineargradientoption.y2===1){
                        //diagonal
                        oBackground.direction="diagonal";
                        oBackground.value.background="-webkit-gradient(linear,left top, right bottom,color-stop(0.29,"+backgroundstops[0][1]+"),color-stop(0.88,"+backgroundstops[1][1]+"))";
                    }else if(lineargradientoption.x1===0 && lineargradientoption.y1===1 && lineargradientoption.x2==1 && lineargradientoption.y2===0){
                        //diagonal-bottom
                        oBackground.direction="diagonal-bottom";
                        oBackground.value.background="-webkit-gradient(linear,left bottom, right top,color-stop(0.29,"+backgroundstops[0][1]+"),color-stop(0.88,"+backgroundstops[1][1]+"))";
                    }else{
                        //vertical
                        oBackground.direction="vertical";
                        oBackground.value.background="-webkit-gradient(linear,left top, left bottom,color-stop(0.29,"+backgroundstops[0][1]+"),color-stop(0.88,"+backgroundstops[1][1]+"))";
                    }
                    oBackground.stopMarker[0].color=backgroundstops[0][1];
                    oBackground.stopMarker[0].ahex=backgroundstops[0][1];
                    oBackground.stopMarker[1].color=backgroundstops[1][1];
                    oBackground.stopMarker[1].ahex=backgroundstops[1][1];
                }
            }
        }else{
            if(_oBackgroundObj!=null && _oBackgroundObj!=''){
                if(_oBackgroundObj.indexOf("#>0")){
                    if(_oBackgroundObj.length>7){
                        oBackground={"type":1,"rgba":"","hex":_oBackgroundObj.substring(0,7),"ahex":_oBackgroundObj,"value":{"background":_oBackgroundObj}};
                    }else{
                        oBackground={"type":1,"rgba":"","hex":_oBackgroundObj,"ahex":_oBackgroundObj+"ff","value":{"background":_oBackgroundObj}};
                    }
                }else{
                    oBackground={"type":1,"rgba":_oBackgroundObj,"hex":"","ahex":"","value":{"background":_oBackgroundObj}};
                }
            }
        }
    }
    return oBackground;
}
Agi.Controls.CustomXSChart.BackgroundApply=function(_ControlObj,_BackGroudObj){
    //2.获取当前控件的ChartOptions属性
    var cp = _ControlObj.Get('ChartProperty');
    if(_BackGroudObj.BolIsTransfor==="true"){
        cp.chart_BackgroundColor='';
    }else{
        var lineargradientvalue={x1:0,y1:0,x2:0,y2:0}
        switch (_BackGroudObj.GradualChangeType){
            case "horizontal":
                lineargradientvalue={x1:0,y1:0,x2:1,y2:0}
                break;
            case "vertical":
                lineargradientvalue={x1:0,y1:0,x2:0,y2:1}
                break;
            case "diagonal":
                lineargradientvalue={x1:0,y1:0,x2:1,y2:1}
                break;
            case "diagonal-bottom":
                lineargradientvalue={x1:0,y1:1,x2:1,y2:0}
                break;
        }
        cp.chart_BackgroundColor={
            linearGradient:lineargradientvalue,
            stops: [
                [0,_BackGroudObj.StartColor],
                [1,_BackGroudObj.EndColor]
            ]
        };
    }
    cp.ChartBackConfig.backgroundColor=cp.chart_BackgroundColor;
    cp.ChartBackConfig.Tolbtnbackground=_BackGroudObj.Tolbtnbackground;
    cp.ChartBackConfig.TolbtnFontColor=_BackGroudObj.TolbtnFontColor;
    cp.ChartBackConfig.TolTabbackground=_BackGroudObj.TolTabbackground;
    cp.ChartBackConfig.TolTabFontColor=_BackGroudObj.TolTabFontColor;

    _ControlObj.Set("ChartProperty",cp);

}
//endregion

//region 20131029 根据Series 数据点获得对应的Grid 数据行位置
Agi.Controls.CustomXSChart.FindDataRowsByPoint=function(_checkDataSeries,_PointX){
//    var checkDataSeries = this.Get('CheckDataSeries');
    var PointRows=[];
    if(_checkDataSeries!=null && _checkDataSeries.length>0){
        var DataRowIndex=0;
        var DataRowLaveNum=0;
        for(var i=0;i<_checkDataSeries.length;i++){
            if ((_PointX>= _checkDataSeries[0].min && _PointX <= _checkDataSeries[0].max) ||
                (_PointX > _checkDataSeries[i].min && _PointX <= _checkDataSeries[i].max)){
//                PointRows=[(_PointX-1)+i,_PointX+i];
                DataRowIndex=_checkDataSeries[i].Nrow*(_PointX-1)+DataRowLaveNum;
                for(var j=0;j<_checkDataSeries[i].Nrow;j++){
                    PointRows.push(DataRowIndex+j);
                }
                break;
            }
            DataRowLaveNum+=_checkDataSeries[i].LaveNum;
        }
    }
    return PointRows;
}
//endregion
//20131031 markeluo 图形修改
Agi.Controls.CustomXSChart.GetData=function(objValue,_Chartcp) {
    var minValue = objValue.minValue;
    var maxValue = objValue.maxValue;
    var objData = [];
    for (var i = 1; i <= objValue.Data.length; i++) {
        var x = objValue.min + i;
        var y = objValue.Data[i - 1];
        if (y > maxValue)
            y = { x: x, y: y, marker: { fillColor: _Chartcp.yAxis_PlotLines_MaxMarkerColor} };
        else if (y < minValue)
            y = { x: x, y: y, marker: { fillColor: _Chartcp.yAxis_PlotLines_MinMarkerColor} };
        else
            y = { x: x, y: y, marker: { fillColor: _Chartcp.series_PointMarkerColor} }
        objData.push(y);
    }
    return objData;
}
//计算分组后的剩余数据行数
Agi.Controls.CustomXSChart.GroupSizeDataSave=function(_GroupData,_nrow){
    var GroupLaves={Nrow:_nrow,Items:[]};
    if(_GroupData!=null && _GroupData.length>0){
        for(var i=0;i<_GroupData.length;i++){
            GroupLaves.Items.push(_GroupData[i].length%_nrow);
        }
    }
    return GroupLaves;
}
//endregion