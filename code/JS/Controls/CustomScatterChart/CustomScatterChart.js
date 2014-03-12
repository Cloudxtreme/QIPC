/**
* Created with JetBrains WebStorm.
* User: markeluo
* Date: 13-11-14
* Time: 下午 15:55
 *Update:
 *Detail:散点图
* To change this template use File | Settings | File Templates.
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/

Agi.Controls.CustomScatterChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){
            var entity = this.Get('Entity')[0];
            if(entity !=undefined && entity !=null){
                return entity.Data;
            }else{
                return null;
            }
        },//1.获得实体数据
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
        },//2.控件添加到Dom UI
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 100,
                minWidth: 200
            });
            return this;
        },//3.重置属性
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
                    cp.SeriesGroupColumn="";
                    cp.SeriesDataColumn=[_EntityInfo.Columns[1]];
                }
                Me.Set('ChartProperty',cp);

                _EntityInfo.Data=Me.DataSortByGrpName(_EntityInfo.Data);

                entity.push(_EntityInfo);
                Me.Set("Entity", entity);

                Me.AddEntity(entity[0]); /*添加实体*/
                Me.chageEntity = true;
            });
        },//4.加载DataSet 数据
        ReadOtherData: function (_PointID) {//测试数据
            var cp = this.Get("ChartProperty");
            if(typeof cp == 'undefined'){
                return;
            }
            cp.chart_MarginRight = 30;
            cp.xAxis_Auxiliary_Enabled = false;
            cp.yAxis_Auxiliary_Enabled = false;
            this.Set("ChartProperty", cp);
            this.Set('ChartSeries',[{name:'示例',data:Agi.Controls.CustomScatterChart.GetChartInitData()}])

            this.InitHighChart();
        },//5.加载实时数据
        AddEntitySCAT: function (_entity) {
            var Me = this;
            Me.Set("FilterData",_entity.Data);

            Me.ChartLoadByData(_entity.Data);//加载数据
            Me.ShowDataTable();//显示表格数据
        },//6.控件添加DataSet 实体(Entity)
        ChartLoadByData:function(_Data){
            $('#pointMenu').hide();//图形刷新前隐藏原数据点右键菜单
            var Me=this;
            var  ArrayBCName = [],DataArray = [], EntityData = [];
            var ArrayValue = [];
            var GroupSortData=[];//分组排序后的数据格式
            if(_Data!=null && _Data.length>0){
                EntityData=_Data;
                var cp = Me.Get('ChartProperty');//cp.SeriesGroupColumn cp.SeriesDataColumn
                if(cp.SeriesGroupColumn!=""){
                    //取出所有样本名称
                    try
                    {
                        for (var i = 0; i < EntityData.length; i++) {
                            ArrayBCName.push(eval(EntityData[i][cp.SeriesGroupColumn]));
                        }
                        cp.xAxis_categoriesDataType="int";
                    }catch(ex){
                        ArrayBCName=[];
                        for (var i = 0; i < EntityData.length; i++) {
                            ArrayBCName.push(EntityData[i][cp.SeriesGroupColumn]);
                        }
                        cp.xAxis_categoriesDataType="string";
                    }

                    //样本名称去重复
                    var res = [], hash = {};
                    for (var i = 0, elem; (elem = ArrayBCName[i]) != null; i++) {
                        if (!hash[elem]) {
                            res.push(elem);
                            hash[elem] = true;
                        }
                    }
                    //去重之后的样本名称,并按照从小到大排序
                    ArrayBCName = res;
                    ArrayBCName.sort(function(a,b){return a>b?1:-1});

                   var NameObjArray=[];
                    if(cp.xAxis_categoriesDataType=="string"){
                        for(var i=0;i<ArrayBCName.length;i++){
                            NameObjArray.push({Index:i,Value:ArrayBCName[i]});
                        }
                    }else{
                        for(var i=0;i<ArrayBCName.length;i++){
                            NameObjArray.push({Index:ArrayBCName[i],Value:ArrayBCName[i]});
                        }
                    }
                    //根据样本名称去除对应样本值
                    var i=0;
                    for (var j = 0; j < EntityData.length; j++) {
                        for (var i=0;i<NameObjArray.length;i++) {
                            if (EntityData[j][cp.SeriesGroupColumn] ==NameObjArray[i].Value) {
                                DataArray.push({
                                    x:NameObjArray[i].Index,
                                    y:eval(EntityData[j][cp.SeriesDataColumn[0]]),
                                    name:NameObjArray[i].Value,
                                    marker: { fillColor: cp.series_PointMarkerColor},
                                    dataLabels: {enabled: false,y:null}
                                });
                                //GroupSortData.push(EntityData[j]);
                            }
                        }
                    }
                }else{
                    ArrayBCName=null;
                    var i=0;
                    for (var j = 0; j < EntityData.length; j++) {
                        DataArray.push({
                            x:i,
                            y:eval(EntityData[j][cp.SeriesDataColumn[0]]),
                            name:i+"",
                            marker: { fillColor: cp.series_PointMarkerColor},
                            dataLabels: {enabled: false,y:null}
                        });
                        //ArrayBCName.push(i);
                        i++;
                    }
                    cp.xAxis_categoriesDataType="int";
                    //GroupSortData=EntityData;
                }
                //X轴标签元素数组保存
                cp.xAxis_categories=ArrayBCName;
                Me.Set('ChartProperty',cp);

                //Me.Set("FilterData",GroupSortData);

                Me.Set("ChartSeries",[{name:"A",data:DataArray,color:cp.series_DataColor}]);
                Me.InitHighChart();//初始化图形显示
            }
        },//7.图表应用加载数据 20131114 markeluo
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
        },//8.根据分组名称对_Data进行分组排序
        RefreshByProPanelUp:function(){
            var Me=this;
            var FilterData=Me.Get("FilterData");
            if(FilterData==null){
                FilterData= Me.Get("Entity")[0].Data;
            }
            Me.ChartLoadByData(FilterData);//加载数据
        },//9.属性更新后，图表刷新 20131114 markeluo
        UpPlotLineGroups:function(_PlotLineGrps){
            //[{GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000, MaxReviseSig:上限修正符号,MaxReviseValue:上限修正值,MinReviseSig:下限修正符号,MinReviseValue:下限修正值}]
            //MaxValueType&MinValueType:0,代表Value为输入值 ;1，代表选择对应的Value为字段名
            var Me=this;
            Me.Set("NoFormatPlotLines",_PlotLineGrps);
        },//10.更新标准线组 20131114 markeluo
        UpSigmConditions:function(_rules){
            var Me=this;
            Me.Set("Sigmrules",_rules);//保存八项判异规则
        },//11.图表应用西格玛线判异规则 20131114 markeluo
        UpChartwarnRule:function(_warnRule){
            //_warnRule {warnColumn,warnRule,warnCompareValue,warnColor}
            var Me=this;
            Me.Set("WarnRule",_warnRule);//特殊报警功能
        },//12.图表特殊报警判异规则 20131114 markeluo
        FilterDataUpShow:function(_filterData){
            var Me=this;
            Me.Set("FilterData",_filterData);
            Me.ChartLoadByData(_filterData);//重新加载数据
        },//13.筛选数据后，更新显示  20131114 markeluo
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

//            var FilterDataArray=Me.Get("FilterData");
//            if(FilterDataArray!=null && FilterDataArray.length>0){
//                FilterDataArray=Me.DataSortByGrpName(FilterDataArray);
//            }else{
//                FilterDataArray= Me.DataSortByGrpName(Me.Get("Entity")[0].Data);
//            }
            Me.Set('ChartProperty',cp);
//            Me.Set("FilterData",FilterDataArray);
        },//14.更改曲线设置后，更新显示  20131114 markeluo
        GetDataSeries:function(){
            var Me=this;
            var DataSeries=Agi.Controls.CustomScatterChartGetDataSries(Me.Get('ChartSeries'),true);
            return DataSeries;
        },//15.获取当前图表对应的数据series(非标准线)  20131114 markeluo
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
        },//16.数据钻取/查看详情  20131114 markeluo
        DisabledDataDrill:function(){
            var Me=this;
            Me.Set("DataDrillState",false);//禁用钻取
        },//17.禁用数据钻取功能 20131114 16:26 markeluo
        ShowRegressLines:function(){
            var Me=this;
            var cp=Me.Get("ChartProperty");//ChartHGEnumType:回归分析类型
            if(cp.xAxis_categoriesDataType=="int" && cp.ChartHGEnumType!=null && cp.ChartHGEnumType!="N"){
                //region 1.组织请求R的数据
                var ChartSeries=Me.Get("ChartSeries");
                var JsonData={
                    "action":"RCalFitting",
                    "power":"2",
                    "level":"0.95",
                    "X":[],
                    "Y":[]
                };
                if(ChartSeries!=null && ChartSeries.length>0){
                    for(var i=0;i<ChartSeries[0].data.length;i++){
                        JsonData.X.push(eval(ChartSeries[0].data[i].name));
                        JsonData.Y.push(ChartSeries[0].data[i].y);
                    }
                }

                switch(cp.ChartHGEnumType){
                    case "L":
                        JsonData.power="1";
                        break;
                    case "Q":
                        JsonData.power="2";
                        break;
                    case "C":
                        JsonData.power="3";
                        break;
                    default:
                        break;
                }
                //endregion
                var jsonString = JSON.stringify(JsonData);
                //region 2.请求R处理
                Agi.DAL.ReadData({ "MethodName": "RCalFitting", "Paras": jsonString, "CallBackFunction": function (_result) {
                        if (_result && _result.result == "true") {
                            var HGSeriesLine={name:_result.formula,type:"spline",data:[]};
                            if(cp.ChartHGEnumType=="L"){
                                HGSeriesLine.data.push({x:_result.line_x100[0],y:_result.yhat_y100[0],name:_result.line_x100[0]+""});
                                HGSeriesLine.data.push({x:_result.line_x100[_result.line_x100.length-1],y:_result.yhat_y100[_result.line_x100.length-1],name:_result.line_x100[_result.line_x100.length-1]+""});
                            }else{
                                for(var i=0;i<_result.line_x100.length;i++){
                                    HGSeriesLine.data.push({x:_result.line_x100[i],y:_result.yhat_y100[i],name:_result.line_x100[i]+""});
                                }
                            }
                            var ThisChart=Me.Get("chart");
                            ThisChart.addSeries(HGSeriesLine);//添加回归线
                        }
                    }
                });
                //endregion
            }
        },//18.显示回归线,20131119
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
        },//19.移除所有的标准型
        ShowALLPlotLineGroup:function(){
//            var Me=this;
//            var CusXMRChart=Me.Get('chart');
//            var PlotLineAndBands= CusXMRChart.yAxis[0].plotLinesAndBands[0];
//            if(PlotLineAndBands!=null&& PlotLineAndBands.length>0){
//                for(var i=0;i<PlotLineAndBands.length;i++){
//                    CusXMRChart.yAxis[0].removePlotLine(PlotLineAndBands[i].id);
//                }
//            }
//            var _PlotLineGrps=Me.Get("NoFormatPlotLines");
//            var PlotLines=[];
//            var newGroup=null;
//            if(_PlotLineGrps!=null && _PlotLineGrps.length>0){
//                for(var i=0;i<_PlotLineGrps.length;i++){
//                    newGroup=Agi.Controls.CustomScatterChartFormatPlotGrpPars(Me.Get("Entity")[0],_PlotLineGrps[i]);//新增标准线组
//                    if(newGroup!=null){
//                        PlotLines.push({GroupName:_PlotLineGrps[i].GroupName,Items:newGroup});
//                    }
//                }
//            }
//            Me.Set("PlotLines",PlotLines);
//
//            if(PlotLines!=null){
//                //获取当前标准线组的标准线元素
//                var Yasixobj=CusXMRChart.yAxis[0];
//                for(var i=0;i<PlotLines.length;i++){
//                    Yasixobj.addPlotLine(PlotLines[i].Items[0]);
//                    Yasixobj.addPlotLine(PlotLines[i].Items[1]);
//                }
//            }
//
//            //更新超出标准线的point点
//            var chartSeries = Me.Get('ChartSeries');
//            var checkDataSeries = this.Get('CheckDataSeries');
//
//            var DataSeries=Agi.Controls.CustomScatterChartGetDataSries(chartSeries);
//            Agi.Controls.CustomScatterChartPlotLineUpSeries(DataSeries,PlotLines);//更新Series 点数据
//
//            //特异判断规则应用，更改series 点的颜色
//            var FilterData=Me.Get("FilterData");
//            var WarnRuleValue=Me.Get("WarnRule");//特殊报警功能
//            if(WarnRuleValue!=null && WarnRuleValue.warnColumn!=null && FilterData!=null && FilterData.length>0){
//                var bool=false;
//                if(checkDataSeries!=null && checkDataSeries.length>0){
//                    var PointRows=null;
//                    for(var j=0;j<DataSeries[0].data.length;j++){
//                        PointRows= Agi.Controls.CustomScatterChart.FindDataRowsByPoint(checkDataSeries,DataSeries[0].data[j].x);
//                        bool=Agi.Controls.WarnValueCompare(FilterData[PointRows[0]][WarnRuleValue.warnColumn],WarnRuleValue.warnCompareValue,WarnRuleValue.warnRule);
//                        if(bool){
//                            DataSeries[0].data[j].marker={fillColor:WarnRuleValue.warnColor};
//                        }
//                    }
//                }
//
//                if(chartSeries!=null && chartSeries.length>0){
//                    for(var i=0;i<chartSeries.length;i++){
//                        for(var j=0;j<DataSeries.length;j++){
//                            if(chartSeries[i].name==DataSeries[j].name){
//                                chartSeries[i].data=DataSeries[j].data;
//                            }
//                        }
//                    }
//                }
//            }
//
//            if(DataSeries!=null && DataSeries.length>0){
//                for(var i=0;i<CusXMRChart.series.length;i++){
//                    for(var j=0;j<DataSeries.length;j++){
//                        if(CusXMRChart.series[i].name==DataSeries[j].name){
//                            CusXMRChart.series[i].remove();
//                            i=-1;
//                            break;
//                        }
//                    }
//                }
//
//
//                for(var i=0;i<DataSeries.length;i++){
//                    DataSeries[i].data=Me.ApplySigmRule(DataSeries[i].data);//应用西格玛八项判异规则
//                    CusXMRChart.addSeries(DataSeries[i]);
//                }
//            }
//
//            Me.ShowDataTable();//显示表格数据
//
//           //标准线、西格玛线 统计信息
//           var tolInfo=Agi.Controls.CustomScatterChartAlarmStatistical(chartSeries,PlotLines);//统计信息
//           var AppendToPanel=Me.Get("HTMLElement");
//            var cp=Me.Get('ChartProperty');
//            tolInfo.SGM.SigmaValue=cp.ChartisigmaValue;//西格玛系数
//            Agi.Controls.CustomScatterChartAlarmStatisticalTableShow(tolInfo,AppendToPanel,cp.ChartBackConfig);
        },//20.显示标准线
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
        },//21.修改数据表格报警点颜色
        ApplySigmRule:function(_SeriesDataArray){
            var Me=this;
            var SigmArray= Me.Get("Sigmrules");//八项判异规则数组
            var NewSeriesData=_SeriesDataArray;
            if(SigmArray!=null && SigmArray.length>0){
                var CheckDataSries=Agi.Controls.SigmRuleApplyGetGroupData(Me.Get("CheckDataSeries"));//分组数据信息
                ////待实现
                //NewSeriesData=SigmArlmFunc({SeriesData:_SeriesDataArray,SigmRule:SigmArray,GroupData:CheckDataSries});
                var ojb = new XMRclsSigmaFunc(_SeriesDataArray,SigmArray,CheckDataSries);
                NewSeriesData = ojb.check();
            }
            return NewSeriesData;
        },//22.应用西格玛八项规则
        ShowDataTable:function(){

        },//23.显示表格数据
        AddEntity: function (_entity) {
            var Me=this;
            if (_entity.Data && _entity.Data.length <= 0) {
                this.ReadOtherData("");
                return;
            }
            var cp = this.Get("ChartProperty");
            this.AddEntitySCAT(_entity);
            //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(Me);//更新实体数据显示
            }
        },//24.控件添加DataSet 实体(Entity),内部调用AddEntitySCAT
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
        }, //25.参数联动
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.Set("dataGridArray",[]);
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "CustomScatterChart");
            this.Set('IntervalID', null); //预先保存定时器ID
            this.Set("ChartParameters", { Key: false, Points: [] }); //预先保存结构
            this.Set("ChartCurrentData", []); //设置及时刷新数据显示
            this.Set("PointsParamerters", []); //注册数据点位号保存，点位号集合，结构["11AE84102","11AE84015","11AE84103"]
            var ID = savedId ? savedId : "CustomScatterChart" + Agi.Script.CreateControlGUID();
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
                    minHeight:200,
                    minWidth: 350
                });
            }
            //20130515 倪飘 解决bug，组态环境中拖入单值图控件以后拖入容器框控件，容器框控件会覆盖单值图控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);

            self.ShowDataTable();//显示默认数据表格
        },//26.控件初始化
        SetChartProperty: function (_objCanvasAreaID) {//初始化定义图形控件属性结构，并预设值属性，_objCanvasAreaID：画布显示区域ID
            //图形基本结构定义
            var chartProperty = {
                chart_Data_Type: "移动极差",
                chart_Data_NRow:2,
                chart_PointNumber: 20, //当前图形范围所显示的点位
                chart_RenderTo: _objCanvasAreaID, //画布ID
                chart_Type: 'scatter', //'scatter',//散点图
                chart_MarginTop: 30, //图形距画框右边距距离
                chart_MarginRight: 80, //图形距画框右边距距离
                chart_Reflow: true, //图形是否跟随放大
                chart_Animation: false, //动画平滑滚动
                chart_PlotBorderWidth: 0, //数据图表区域边框宽度
                chart_PlotBorderColor: "#5c5757", //数据图表区域边框颜色
                chart_BackgroundColor:{"linearGradient":{"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#ededed"],[1,"#cbcbcb"]]}, //"#C9E8E2",//数据图表区域颜色
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
                xAxis_LineWidth: 1, //X轴轴线宽度
                xAxis_LineColor:"#EEEEEE",//X轴线颜色
                xAxis_PlotLines: [], //参考线位置，计算取得
                xAxis_PlotLines_LineColor: "blue", //参考线颜色
                xAxis_PlotLines_LineWidth: 1, //参考线宽度
                xAxis_PlotLines_DashStyle: "longdash", //X轴参考线显示类型 longdash：虚线
                xAxis_categories:[],//x轴元素
                xAxis_categoriesDataType:"int",//x轴元素数据类型
                xAxis_LinkedTo: 0, //未知，用于第二X轴，伪轴显示
                xAxis_Opposite: true, //是否相反方向显示
                xAxis_TickPositions: [], //显示X轴线指定值
                yAxis_TickPositions: [], //显示Y轴线指定值
                yAxis_Title_Text: '', //'单独值', //Y轴标题文字
                //yAxis_Title_Margin: 50,//Y轴TITLE左边距
                yAxis_Min: 0, //Y轴最小值
                yAxis_Max: 280, //Y轴最大值
                yAxis_PlotLines_Max: 0, //数据最大值
                yAxis_PlotLines_Min: 0, //数据最小值
                yAxis_GridLineWidth: 0, //Y轴表格线宽度显示
                yAxis_LineWidth: 1, //Y轴轴线宽度
                yAxis_LineColor:"#EEEEEE",//Y轴线颜色
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
                crosshairs_enabled:false,//是否显示十字线
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
                    backgroundColor:{"linearGradient":{"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#ededed"],[1,"#cbcbcb"]]}//背景
                },//背景配置
                ChartItemsConfig:
                {
                    IsShowLine:false,//连接线
                    IsShowArea:false,//区域
                    IsShowVLine:false,//投影线
                    plotOptions_Spline_LineWidth:1,//线条宽度
                    plotOptions_Spline_FillColor:"#fb8814"//背景填充颜色
                },//图形选项
                ChartHGEnumType:"N",//回归分析类型
                ChartTitleAndFootNote:{
                    chart_Title_Text: '', //标题文字
                    chart_subTitle1_Text:'',//副标题1
                    chart_subTitle2_Text:'',//副标题2
                    chart_footnote1_Text:'',//脚注1
                    chart_footnote2_Text:'',//脚注2
                    spacingBottom:15
                },//标题与脚注
                ChartLableValue:{
                    Type:'N',
                    Column:''
                }//数据标签
            };
            this.Set('ChartProperty', chartProperty); //保存属性结构
        },//27.设置控件属性参数
        PointClickEvent:function(_PointValue,_MenuType){
            //{name:this.name,x:this.x,y:this.y,Time:点击时间}
            var Me=this;
            if(_MenuType!=null && _MenuType!=""){
                switch(_MenuType){
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
        },//28.Point点击处理
        PointClick:function(_PointValue){
             var PointRow=_PointValue.x;
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var checkDataSeries = this.Get('CheckDataSeries');
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:Agi.Controls.CustomScatterChart.FindDataRowsByPoint(checkDataSeries,PointRow)//所选的异常点
            };
            var ThisDataSeries=Me.GetDataSeries();//获取当前曲线信息
            if(ThisDataSeries!=null && ThisDataSeries.length>0){
                for(var i=0;i<ThisDataSeries.length;i++){
                    Agi.Controls.CustomScatterChartAlarmDataPointsFind(GridData,cp.SeriesDataColumn[i],ThisDataSeries[i],cp.series_PointMarkerColor,checkDataSeries);
                }
            }
            Agi.view.advance.refreshGridData(GridData);//调用View框架的定位源数据功能
        },//29.单击,1.源数据定位
        PointDbClick:function(_PointValue){
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
        },//30.双击,2异常点存入数据库
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
        },//31.长按,3数据钻取
        InitHighChart: function () {
            var Me=this;
            var cp = this.Get('ChartProperty');
            var checkDataSeries = this.Get('CheckDataSeries');
            var seriesMiddleValue = this.Get('SeriesMiddleValue');
            var chartSeries = this.Get('ChartSeries');
            chartSeries=Agi.Controls.CustomScatterChart.FormatSeriesDataLable(chartSeries,cp,Me.Get("FilterData"));//Seires中每个数据点的Lables的格式

            {//轴线属性设置
                var xAxis = [];
                xAxis.push({
                    tickWidth: cp.xAxis_TickWidth,
                    tickPixelInterval: cp.xAxis_TickPixelInterval,
                    reversed: cp.xAxis_Reversed,
                    lineWidth: cp.xAxis_LineWidth,
                    lineColor:cp.xAxis_LineColor,
                    tickColor: cp.Axis_TickColor,
                    minTickInterval:1,//最小步长
                    tickPosition: cp.xAxis_TickPosition,
                    plotLines: cp.xAxis_PlotLines,
                    categories:cp.xAxis_categories
                });
                if (cp.xAxis_Auxiliary_Enabled) {
                    xAxis.push({
                        lineWidth: cp.xAxis_LineWidth,
                        lineColor:cp.xAxis_LineColor,
                        linkedTo: cp.xAxis_LinkedTo,
                        opposite: cp.xAxis_Opposite,
                        tickWidth: cp.xAxis_TickWidth2,
                        minTickInterval:1,//最小步长
                        tickPositions: cp.xAxis_TickPositions
                    });
                }

                var yAxis = [];
                yAxis.push({
                    lineWidth: cp.yAxis_LineWidth,
                    lineColor:cp.yAxis_LineColor,
                    title: {
                        text: cp.yAxis_Title_Text
                    },
                    gridLineWidth: cp.yAxis_GridLineWidth,
                    tickWidth: cp.yAxis_TickWidth,
                    tickColor: cp.Axis_TickColor,
                    tickPosition: cp.yAxis_TickPosition
                });
                if (cp.yAxis_Auxiliary_Enabled) {
                    yAxis.push({
                        lineWidth: cp.yAxis_LineWidth,
                        lineColor:cp.yAxis_LineColor,
                        linkedTo: cp.xAxis_LinkedTo,
                        opposite: cp.xAxis_Opposite,
                        gridLineWidth: cp.yAxis_GridLineWidth,
                        tickWidth: cp.xAxis_TickWidth2,
                        tickPosition: cp.Axis_TickColor,
                        tickPositions: cp.yAxis_TickPositions,
                        title: ""
                    });
                }
            }
            if (chartSeries && chartSeries && cp.chart_RenderTo) {
                Highcharts.setOptions({
                    global: {
                        useUTC: false//不使用夏令时
                    }
                });
                var SubTitleText=cp.ChartTitleAndFootNote.chart_subTitle1_Text+"<br/>"+cp.ChartTitleAndFootNote.chart_subTitle2_Text;
                cp.ChartTitleAndFootNote.spacingBottom=15;
                if(cp.ChartTitleAndFootNote.chart_footnote1_Text!=""){
                    cp.ChartTitleAndFootNote.spacingBottom+=20;
                }
                if(cp.ChartTitleAndFootNote.chart_footnote2_Text!=""){
                    cp.ChartTitleAndFootNote.spacingBottom+=20;
                }

                var series, chart;
                chart = new Highcharts.Chart({
                    chart: {
                        animation: cp.chart_Animation,
                        renderTo: cp.chart_RenderTo,
                        type: cp.chart_Type,
                        marginRight: cp.chart_MarginRight,
                        plotBorderWidth: cp.chart_PlotBorderWidth,
                        plotBorderColor: cp.chart_PlotBorderColor,
                        backgroundColor: cp.chart_BackgroundColor,
                        spacingBottom:cp.ChartTitleAndFootNote.spacingBottom,
                        events:{
                            redraw:function(){
                            },
                            load:function(){
                            }
                        }
                    },
                    colors: ["#76AD73"],
                    title: {
                        text: cp.ChartTitleAndFootNote.chart_Title_Text
                    },
                    subtitle:{
                        text:SubTitleText
                    },
                    xAxis: xAxis,
                    yAxis:yAxis,
                    plotOptions: {
                        area: {
                            marker: {
                                enabled: cp.plotOptions_Spline_Marker_enabled,
                                color: cp.series_PointMarkerColor,
                                radius: cp.plotOptions_Spline_Marker_Radius,
                                symbol: cp.plotOptions_Spline_Marker_Symbol
                            },
                            lineWidth:cp.plotOptions_Spline_LineWidth,
                            fillColor:cp.plotOptions_Spline_FillColor
                        },
                        line:{
                            lineWidth:cp.plotOptions_Spline_LineWidth
                        },
                        spline:{
                            marker:{enabled:false},
                            lineWidth:1
                        },
                        series:{
//                            point:{
//                                events:{
//                                    click: function (e) {
//                                        if (!Agi.Edit) {
//                                            var PointObj=this;
//                                            if(PointObj.series.name!="min" && PointObj.series.name!="max"
//                                                &&PointObj.series.name!="middle" && PointObj.series.name!=null){
//                                                $("#PointErroSave").show();
//                                                $("#PointSrcData").show();
//                                                $('#pointMenu').css('top',e.clientY+5);
//                                                $('#pointMenu').css('left',e.clientX-15);
//                                                $('#pointMenu').show().find("li").unbind("click").bind("click",function(event){
//                                                    Me.PointClickEvent({name:PointObj.series.name,x:PointObj.x,y:PointObj.y,Time:new Date()},$(this).data("menutype"));
//                                                    $('#pointMenu').hide();
//                                                    event.stopPropagation();
//                                                });
//                                                $('#pointMenu').find(".dropdown-menu").show();
//                                                $('.highcharts-container').unbind('click').bind('click',function(){
//                                                    $('#pointMenu').hide();
//                                                });
//                                            }
//                                        }
//                                    }
//                                }
//                            }
                        }
                    },
                    tooltip: {
                        enabled: cp.tooltip_enabled,
                        crosshairs:cp.crosshairs_enabled,
                        formatter: function() {
                            return 'x:'+ this.x +
                                '<br/>y:<b>'+ this.y +'</b>';
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

                Me.ShowRegressLines();//显示回归线 20131120 10:01:23
            }

            Agi.Controls.CustomScatterChart.ShowChartFootNodeInfo(cp);//显示脚注信息

             Me.ShowALLPlotLineGroup();
            if(Me.Get("IsUpdateViewGrid")){
                Agi.view.advance.refreshGridData(Me.GetSPCViewGridData());//调用View框架刷新数据表格显示
                Me.Set("IsUpdateViewGrid",false);
            }
        },//32.初始化图形控件
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.CustomScatterChartProrityInit(this);
        },//33.自定义属性面板显示
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
        },//34.控件删除,销毁
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
//        },//35.控件复制(新建控件)
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

            var Me=this;
            Agi.Controls.CustomScatterChart.ShowChartFootNodeInfo(Me.Get('ChartProperty'));//显示脚注信息
        },//36.控件大小.位置更改
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
                ThisControlObj.setSize(ThisHTMLElement.width(),ThisHTMLElement.height());/*Chart 更改大小*/
            }
            $(window).resize();
        },//37.控件刷新显示
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },//38.控件外壳大小更改
        Checked: function () {
            if (!Agi.Edit) return;
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },//39.控件选中
        UnChecked: function () {
            if (!Agi.Edit) return;
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
        },//40.控件取消选中
        EnterEditState: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css({ "width": '100%', "height": '100%' });
            //框架重新设置
            $(window).resize();
        },//41.控制信息
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            //框架重新设置
            $(window).resize();
        },//42.还原到原始大小
        InEdit:function(){
            var Me=this;
            Me.UnChecked();
            Me.Refresh(); //重新刷新显示
        },//43.进入编辑环境
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.CustomScatterChartAttributeChange(this, Key, _Value);
        },//44.属性更改监听
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
            SPCSingleChartControl.Control.SigmaRule=this.Get("Sigmrules");//西格玛规则
            SPCSingleChartControl.Control.StandardLines=this.Get("NoFormatPlotLines");//标准线
            SPCSingleChartControl.Control.Ware=this.Get("WarnRule");//特殊报警
            SPCSingleChartControl.Control.DataExtractConfig=this.Get("ExtractConfig");//数据钻取规则

            return SPCSingleChartControl.Control;
        }, //45.获得控件的保存配置信息
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

                    this.Set("Sigmrules",_Config.SigmaRule);//西格玛规则
                    this.UpPlotLineGroups(_Config.StandardLines);//标准线
                    this.Set("WarnRule",_Config.Ware);//特殊报警
                    this.Set("ExtractConfig",_Config.DataExtractConfig);//数据钻取规则


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
        }, //46.根据保存的配置信息还原控件
        SPCViewMenus: function () {
            var Me = this;
            var viewmenus = [];
            viewmenus.push({Title: "图形选项", MenuImg: "ViewMenuImages/viewmenu_Standline.png", CallbackFun: Me.SPCViewChartTypeMenu});
            viewmenus.push({Title: "回归分析", MenuImg: "ViewMenuImages/viewmenu_sigma.png", CallbackFun: Me.SPCViewHGMenu});
            viewmenus.push({Title: "数据标签", MenuImg: "ViewMenuImages/viewmenu_Abnormal.png", CallbackFun: Me.SPCViewLablesMenu});
            return viewmenus;
        },//47.SPC控件支持View框架，控件菜单显示
        SPCViewChartTypeMenu:function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 450,
                height: "auto",
                right: -460
            }).find(".title").text("图形选项");
            $(_Panel).find(".content").height(200);
            Agi.Controls.CustomScatterChartView_TypeMenu(_Panel, Me);
            _CallFun();
        },//48.SPC控件View，图形选项
        SPCViewHGMenu:function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 450,
                height: "auto",
                right: -460
            }).find(".title").text("回归分析");
            $(_Panel).find(".content").height(200);
            Agi.Controls.CustomScatterChartView_HGMenu(_Panel, Me);
            _CallFun();
        },//49.SPC控件View，回归设置
        SPCViewLablesMenu:function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 450,
                height: "auto",
                right: -460
            }).find(".title").text("数据标签");
            Agi.Controls.CustomScatterChartView_LablesMenu(_Panel, Me);
            $(_Panel).find(".content").height(200);
            _CallFun();
        },//50.SPC控件View，标签设置
        GetSPCViewGridData:function(){
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:[]//所选的异常点
            };
            var ThisDataSeries=Me.GetDataSeries();//获取当前曲线信息
            if(ThisDataSeries!=null && ThisDataSeries.length>0){
                var checkDataSeries = this.Get('CheckDataSeries');
                for(var i=0;i<ThisDataSeries.length;i++){
                    Agi.Controls.CustomScatterChartAlarmDataPointsFind(GridData,cp.SeriesDataColumn[i],ThisDataSeries[i],cp.series_PointMarkerColor,checkDataSeries);
                }
            }
            return GridData;
        },//51.SPC控件支持View框架，控件显示源数据
        SPCViewRefreshByGridData:function(_GridData){
            var Me=this;
            Me.Set("FilterData",_GridData);
            //Me.ChartLoadByData(_GridData);//重新加载数据
            Me.Set("IsShowLastChart",true);
            //显示对照图表

            //setTimeout(Agi.Controls.CustomScatterChartLastChartShowExE(Me),2000);
//            Agi.Controls.CustomScatterChartLastChartShow(Me);
//            if(Me.Get("LastChartImgIsExt")){
//                Me.RefreshByProPanelUp();//更新显示
//            }else{
//                setTimeout(Agi.Controls.CustomScatterChartRefreshShowExe(Me),2000);//更新显示
//            }
            Me.RefreshByProPanelUp();//更新显示
        },//52.SPC控件支持View框架，编辑源数据后更新控件显示
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

            Me.Set("LastChartImgIsExt",false);

            Me.RefreshByProPanelUp();//更新显示
        },//53.SPC控件支持View框架，还原至原始数据
        SPCViewDataExtractURLGet:function(RowData){
            return this.Get("ExtractConfig");//数据钻取配置信息
        }//54.数据钻取URL获取，需传入行数据
    },true);

/*下拉列表控件参数更改处理方法*/
Agi.Controls.CustomScatterChartAttributeChange = function (_ControlObj, Key, _Value) {
    var self = _ControlObj;
    switch (Key) {
        case "Position":
            {
                if(layoutManagement.property.type==1){
                    var ThisHTMLElementobj=$("#"+_ControlObj.Get("HTMLElement").id);
                    var ThisControlObj = self.chart;

                    var ParentObj=ThisHTMLElementobj.parent();
                    var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                    ThisHTMLElementobj.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                    ThisHTMLElementobj.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");


                    var ThisControlPars={Width:parseInt(PagePars.Width*(1-_Value.Left-_Value.Right)),
                        Height:parseInt(PagePars.Height*(1-_Value.Top-_Value.Bottom))};

                    ThisHTMLElementobj.width(ThisControlPars.Width);
                    ThisHTMLElementobj.height(ThisControlPars.Height);
                    ThisControlObj.setSize(ThisControlPars.Width,ThisControlPars.Height);/*Chart 更改大小*/
                    ThisControlObj.Refresh();/*Chart 更改大小*/


                    PagePars=null;
                }
            } break;
    } //end switch
} //end

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitCustomScatterChart = function () {
    return new Agi.Controls.CustomScatterChart();
}

Agi.Controls.CustomScatterChartProrityInit = function (_BasicChart) {
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
        //region 4.1.背景设置
        ItemContent = null;
        ItemContent=$("<div id='CSChartBackgroundPanel'></div>");
        Agi.Controls.CustomScatterChartView_BackgroundSetMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "背景设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.2.数据曲线
        ItemContent=$("<div id='CSChartDataLine'></div>")
        ItemContent.load('JS/Controls/CustomScatterChart/tabTemplates.html #tab-2', function () {
            $(this).find("#CustSCATdataColor").spectrum({
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
            $(this).find("#CustSCATmarkerColor").spectrum({
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
            $(this).find("#CustSCATdataColor").spectrum("set","#d2d2d2");
            $(this).find("#CustSCATmarkerColor").spectrum("set","#4572A7");
            if(cp.series_DataColor!=null && cp.series_PointMarkerColor!=null){
                $(this).find("#CustSCATdataColor").spectrum("set",cp.series_DataColor);
                $(this).find('#CustSCATmarkerColor').spectrum("set",cp.series_PointMarkerColor);
            }
            //分组列和数据列绑定
            var GroupColumns=$(this).find('#CustSCATGrpColumn');
            var DataColumns=$(this).find('#CustSCATDataColumn');
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
                    cp.SeriesGroupColumn=$($("#CustSCATGrpColumn").children()[0]).val();
                }
                if(cp.SeriesDataColumn==null){
                    cp.SeriesDataColumn=$($("#CustSCATDataColumn").children()[0]).val();
                }
            }
            GroupColumns.find("option[value='"+cp.SeriesGroupColumn+"']").attr("selected","selected");
            DataColumns.find("option[value='"+cp.SeriesDataColumn+"']").attr("selected","selected");

            var CustXMRChartSeriesItems= $(this).find("#CustSCATSeries").empty();
            if(ChartDataSeries!=null && ChartDataSeries.length>0){
                for(var i=0;i<ChartDataSeries.length;i++) {
                    var option ="<option value='"+ChartDataSeries[i].name+"'>"+ChartDataSeries[i].name+"</option>";
                    CustXMRChartSeriesItems.append(option);
                }
                CustXMRChartSeriesItems.find("option[value='"+ChartDataSeries[0].name+"']").attr("selected","selected");
            }

            //保存处理
            $(this).find("#CustSCATSeriesSave").unbind().bind("click",function(ev){
                var CustXMRChartSeriesObj={
                    SeriesName:$("#CustSCATSeries").val(),
                    GroupColumn:$("#CustSCATGrpColumn").val(),
                    DataColumn:$("#CustSCATDataColumn").val(),
                    SeriesColor:$("#CustSCATdataColor").val(),
                    SeriesMarkerColor:$("#CustSCATmarkerColor").val(),
                    GroupSize:0//分组大小
                }
                Me.UpSeriesBindInfo(CustXMRChartSeriesObj);//更新Series 设置
                Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
            });
        });
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据曲线", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.3.图形选项
        ItemContent=$("<div id='CSChartItems'></div>")
        Agi.Controls.CustomScatterChartView_TypeMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "图形选项", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.4.回归分析
        ItemContent=$("<div id='CSChartHGEnum'></div>")
        Agi.Controls.CustomScatterChartView_HGMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "回归分析", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.5.标题/脚注
        ItemContent=$("<div id='CSChartTitleAndFootnode'></div>")
        ItemContent.load('JS/Controls/CustomScatterChart/tabTemplates.html #tab-5', function () {
            $("#SCAChart_Title").val(cp.ChartTitleAndFootNote.chart_Title_Text);
            $("#SCAChart_Title1").val(cp.ChartTitleAndFootNote.chart_subTitle1_Text);
            $("#SCAChart_Title2").val(cp.ChartTitleAndFootNote.chart_subTitle2_Text);
            $("#SCAChart_FootNote1").val(cp.ChartTitleAndFootNote.chart_footnote1_Text);
            $("#SCAChart_FootNote2").val(cp.ChartTitleAndFootNote.chart_footnote2_Text);

            //保存处理
            $(this).find("#CustomSCA_ChartTitleFootSave").unbind().bind("click",function(ev){
                cp=Me.Get("ChartProperty");
                cp.ChartTitleAndFootNote.chart_Title_Text=$("#SCAChart_Title").val();
                cp.ChartTitleAndFootNote.chart_subTitle1_Text=$("#SCAChart_Title1").val();
                cp.ChartTitleAndFootNote.chart_subTitle2_Text=$("#SCAChart_Title2").val();
                cp.ChartTitleAndFootNote.chart_footnote1_Text=$("#SCAChart_FootNote1").val();
                cp.ChartTitleAndFootNote.chart_footnote2_Text=$("#SCAChart_FootNote2").val();;

                Me.Set("ChartProperty",cp);
                Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
            });
        });
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标题/脚注", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.6.数据标签
        ItemContent=$("<div id='CSChartLable'></div>")
        Agi.Controls.CustomScatterChartView_LablesMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据标签", DisabledValue: 1, ContentObj: ItemContent }));
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
Agi.Controls.CustomScatterChartFormatPlotGrpPars=function(_Entity,_PlotGrp){
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
Agi.Controls.CustomScatterChartPlotLineUpSeries=function(_SeriesArrar,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
//    var DataSeriesArray=Agi.Controls.CustomScatterChartGetDataSries(_SeriesArrar);
    if(_SeriesArrar!=null && _SeriesArrar.length>0){
        for(var i=0;i<_SeriesArrar.length;i++){
            Agi.Controls.CustomScatterChartPlotLineUpPoint(_SeriesArrar[i],_PlotLines);
        }
    }
}
Agi.Controls.CustomScatterChartGetDataSries=function(_SeriesArrar,_IsDataSeries){
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
Agi.Controls.CustomScatterChartPlotLineUpPoint=function(_Series,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
    if(_Series!=null && _Series.data!=null && _Series.data.length>0){
        var PointColor=null;
        for(var i=0;i<_Series.data.length;i++){
            PointColor=Agi.Controls.CustomScatterChartPlotLineGetPointColor(_Series.data[i].y,_PlotLines);
            if(PointColor!=null){
                _Series.data[i].marker={fillColor:PointColor};
            }
        }
    }
}
//4.根据标准线组获取对应的point点颜色,如为null则对应的point点颜色不更改
Agi.Controls.CustomScatterChartPlotLineGetPointColor=function(_Value,_PlotLines){
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
Agi.Controls.CustomScatterChartAlarmStatistical=function(_ALLSeries,_PlotLines){
    var AlarmStatisticaldata={PlotLines:[],SGM:{AlarmSum:0,Percentage:0,MaxObj:{AlarmSum:0,Percentage:0,Item:[]},MinObj:{AlarmSum:0,Percentage:0,Item:[]}}};
    var _Series=Agi.Controls.CustomScatterChartGetDataSries(_ALLSeries);//获得对应的的数据Series
    var _ScmSeries=Agi.Controls.CustomScatterChartGetDataSries(_ALLSeries,false);//获得对应的的西格玛线Series

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
                Agi.Controls.CustomScatterChartAlarmStatisticalByData(j,_Series[i].data[j].y,AlarmStatisticaldata,SumPointNum);//统计标准线所在比例信息
            }
        }
    }
    return AlarmStatisticaldata;
}

Agi.Controls.CustomScatterChartAlarmStatisticalByData=function(_index,_PointValue,_AlarmStatisticaldata,SumPointNum){
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
Agi.Controls.CustomScatterChartAlarmStatisticalPanelShow=function(_AlarmStatisticaldata,_ApendToPanel){
    if($("#CustomScatterChartAlarmPanel").length>0){
        $("#CustomScatterChartAlarmPanel").html("");
    }else{
        var CustomScatterChartAlarmPanelHTML=$("<div id='CustomScatterChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomScatterChartAlarmPanel").css({"right":"8px","top":"8px"});
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
    $("#CustomScatterChartAlarmPanel").append(SubItemHTML);
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
Agi.Controls.SigmRuleApplyGetGroupData=function(_GroupDataArray){
    var GroupData=[];
    if(_GroupDataArray!=null && _GroupDataArray.length>0){
        for(var i=0;i<_GroupDataArray.length;i++){
            GroupData.push({
                Names:_GroupDataArray[i].Names,
                min:_GroupDataArray[i].min,
                max:_GroupDataArray[i].max,
                xBar:_GroupDataArray[i].middleValue,
                LCL:_GroupDataArray[i].minValue,
                UCL:_GroupDataArray[i].maxValue,
                Isigma:_GroupDataArray[i].Isigma
            });
        }
    }
    return GroupData;
}
//endregion

//region 20130912 markeluo SPC单值图组态控件化处理 (比较两个值大小，查找异常点,)
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
Agi.Controls.CustomScatterChartAlarmDataPointsFind=function(_GridData,_ColumnName,_ChartSeires,_markercolor,_CheckDataSeries){
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
                NewItemArray=Agi.Controls.CustomScatterChart.FindDataRowsByPoint(_CheckDataSeries,_ChartSeires.data[j].x);
                if(NewItemArray!=null && NewItemArray.length>0){
                    for(var item in NewItemArray){
                        _GridData.AlarmCells.push({Row:NewItemArray[item],Col:_Index,AlarmColor:_ChartSeires.data[j].marker.fillColor});
                    }
                }
            }
        }
    }
}
//3.在View环境中显示回归分析
Agi.Controls.CustomScatterChartView_HGMenu=function(_Panel,_Control){
    var Me=_Control;
    var cp = Me.Get('ChartProperty');

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomScatterChart/tabTemplates.html #tab-4', function () {
        $("#SCAChartHGEnum_"+cp.ChartHGEnumType).attr("checked","checked");
        //保存处理
        $(this).find("#CustomSCA_ChartHGEnumSave").unbind().bind("click",function(ev){
            cp=Me.Get("ChartProperty");
            cp.ChartHGEnumType=$('input:radio[name="scahgenum"]:checked').val();

            Me.Set("ChartProperty",cp);
            if(cp.ChartHGEnumType!="N" && cp.xAxis_categoriesDataType!="int"){
                AgiCommonDialogBox.Alert('当前X轴值非数值型，无法进行回归分析！');
                return;
            }else{
                Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
            }
        });
    });
}
//4.在View环境中显示下西格玛设置菜单项
Agi.Controls.CustomScatterChartView_LablesMenu=function(_Panel,_Control){
    var Me=_Control;
    var cp = Me.Get('ChartProperty');
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }

    ItemContentPanel.load('JS/Controls/CustomScatterChart/tabTemplates.html #tab-6', function () {
        //$("input[name=scaLabletype]").removeAttr("checked");
        $("#SCAChartLable_"+cp.ChartLableValue.Type).attr("checked","checked");

        var LableDataColumns=$(this).find("#CustSCATLableColumn");
        LableDataColumns.empty();

        for(var i=0;i<ChartEntityColumns.length;i++) {
            var option ="<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>";
            LableDataColumns.append(option);
        }

        if(cp.ChartLableValue.Column && cp.ChartLableValue.Column!=null){
        }else{
            if(cp.ChartLableValue.Column==null){
                cp.ChartLableValue.Column=$($("#CustSCATLableColumn").children()[0]).val();
            }
        }

        $("#CustSCATLableColumn").attr("disabled","disabled");
        LableDataColumns.find("option[value='"+cp.ChartLableValue.Column+"']").attr("selected","selected");
        $("input[name='scaLabletype']").unbind().change(function() {
            if($(this).val()!="L"){
                $("#CustSCATLableColumn").attr("disabled","disabled");
            }else{
                $("#CustSCATLableColumn").removeAttr("disabled");
            }
        });

        //保存处理
        $(this).find("#CustomSCA_ChartLableSave").unbind().bind("click",function(ev){
            cp=Me.Get("ChartProperty");
            cp.ChartLableValue.Type=$('input:radio[name="scaLabletype"]:checked').val();
            cp.ChartLableValue.Column=$("#CustSCATLableColumn").val();

            Me.Set("ChartProperty",cp);
            Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
        });
    });
}
//5.在View环境中显示图形选项菜单
Agi.Controls.CustomScatterChartView_TypeMenu=function(_Panel,_Control){
    var Me=_Control;
    var cp = Me.Get('ChartProperty');
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomScatterChart/tabTemplates.html #tab-3', function () {
        if(cp.ChartItemsConfig.IsShowLine){
            $("#SCAChartItems_Line").attr("checked",'true');//选中
        }else{
            $("#SCAChartItems_Line").removeAttr("checked");//取消选中
        }
        if(cp.ChartItemsConfig.IsShowVLine){
            $("#SCAChartItems_VLine").attr("checked",'true');//选中
        }else{
            $("#SCAChartItems_VLine").removeAttr("checked");//取消选中
        }
        if(cp.ChartItemsConfig.IsShowArea){
            $("#SCAChartItems_Area").attr("checked",'true');//选中
        }else{
            $("#SCAChartItems_Area").removeAttr("checked");//取消选中
        }
        //保存处理
        $(this).find("#CustomSCA_ChartItemsSave").unbind().bind("click",function(ev){
            cp = Me.Get('ChartProperty');
            cp.ChartItemsConfig.IsShowLine=$("#SCAChartItems_Line").is(":checked");
            cp.ChartItemsConfig.IsShowVLine=$("#SCAChartItems_VLine").is(":checked");
            cp.ChartItemsConfig.IsShowArea=$("#SCAChartItems_Area").is(":checked");
            if(cp.ChartItemsConfig.IsShowArea){
                cp.chart_Type="area";//显示区域
                if(cp.ChartItemsConfig.IsShowLine){
                    cp.plotOptions_Spline_LineWidth=1;
                }else{
                    cp.plotOptions_Spline_LineWidth=0;
                }
            }else{
                if(cp.ChartItemsConfig.IsShowLine){
                    cp.chart_Type="line";//连接线
                    cp.plotOptions_Spline_LineWidth=1;
                }else{
                    cp.chart_Type="scatter";//散点
                    cp.plotOptions_Spline_LineWidth=0;
                }
            }

            if(cp.ChartItemsConfig.IsShowVLine){
                cp.crosshairs_enabled=true;
            }else{
                cp.crosshairs_enabled=false;
            }
            Me.Set("ChartProperty",cp);
            Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
        });
    });
}
//6.背景设置
Agi.Controls.CustomScatterChartView_BackgroundSetMenu=function(_Panel,_Control){
    var Me=_Control;
    //获取属性
    var cp = Me.Get('ChartProperty');

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomScatterChart/tabTemplates.html #tab-1', function () {
        $(this).find(".CustomXMRColorSty").spectrum({
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

        $("#CustomSCA_bgvalue").unbind().bind("click",function(){
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
        var ThisChartbgvalue=Agi.Controls.CustomScatterChartBackgroundValueGet(cp.ChartBackConfig.backgroundColor);
        $("#CustomSCA_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项
        // backgroundColor//背景 ,Tolbtnbackground,//菜单按钮背景,TolbtnFontColor,//菜单按钮字体,TolTabbackground,//统计表格背景,TolTabFontColor//统计表格字体

        $("#CustomSCA_BackgroundSave").unbind().bind("click",function(){
            var color=$("#CustomSCA_bgvalue").data('colorValue');
            var BgColorValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
            var BackgroudObj={
                BolIsTransfor:BgColorValue.BolIsTransfor,//是否透明
                StartColor:BgColorValue.StartColor,//开始颜色
                EndColor:BgColorValue.EndColor,//结束颜色
                GradualChangeType:BgColorValue.GradualChangeType//渐变方式
            }
            Agi.Controls.CustomScatterChart.BackgroundApply(Me,BackgroudObj);//背景应用
            Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
        })
    });
}
//endegion

//region 背景设置
Agi.Controls.CustomScatterChartBackgroundValueGet=function(_oBackgroundObj){
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
Agi.Controls.CustomScatterChart.BackgroundApply=function(_ControlObj,_BackGroudObj){
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

    _ControlObj.Set("ChartProperty",cp);

}
//endregion

//region 20131029 根据Series 数据点获得对应的Grid 数据行位置
Agi.Controls.CustomScatterChart.FindDataRowsByPoint=function(_checkDataSeries,_PointX){
//    var checkDataSeries = this.Get('CheckDataSeries');
    var PointRows=[];
    if(_checkDataSeries!=null && _checkDataSeries.length>0){
        for(var i=0;i<_checkDataSeries.length;i++){
            if ((_PointX>= _checkDataSeries[0].min && _PointX <= _checkDataSeries[0].max) ||
                (_PointX > _checkDataSeries[i].min && _PointX <= _checkDataSeries[i].max)){
                PointRows=[(_PointX-1)+i,_PointX+i];
                break;
            }
        }
    }
    return PointRows;
}
//endregion

//region 20131118 标题/脚注 & 标签
//1.根据标题与脚注设置显示脚注信息并定位
Agi.Controls.CustomScatterChart.ShowChartFootNodeInfo=function(_chartCP){
    if(_chartCP.chart_RenderTo){
        var ChartPanel=$("#"+_chartCP.chart_RenderTo);
        var ChartPanelPostion={Width:ChartPanel.width(),Height:ChartPanel.height()};

        var FootContentHTML=_chartCP.ChartTitleAndFootNote.chart_footnote1_Text+"<br/>"+_chartCP.ChartTitleAndFootNote.chart_footnote2_Text;
        if($("#CustomSATChartFoots").length>0){
            $("#CustomSATChartFoots").html(FootContentHTML).css("top",(ChartPanelPostion.Height-55)+"px");
        }else{
            var CustomSATChartFootsPanel=$("<div id='CustomSATChartFoots' class='CustomSATChartFootssty'>"+FootContentHTML+"</div>");
            CustomSATChartFootsPanel.css("top",(ChartPanelPostion.Height-55)+"px");
            ChartPanel.append(CustomSATChartFootsPanel);
            CustomSATChartFootsPanel=null;
        }
        ChartPanel=ChartPanelPostion=FootContentHTML=null;
    }
}
//2.根据属性设置格式化标签显示
Agi.Controls.CustomScatterChart.FormatSeriesDataLable=function(_chartSeriesDatas,_cp,_EntityData){
    //_cp
//    ChartLableValue:{
//        Type:'N',
//            Column:''
//    }//数据标签
    if(_chartSeriesDatas!=null && _chartSeriesDatas.length>0){
        for(var i=0;i<_chartSeriesDatas.length;i++){
            for(var j=0;j<_chartSeriesDatas[i].data.length;j++){
                _chartSeriesDatas[i].data[j].dataLabels.enabled=true;
                if(_cp.ChartLableValue.Type=="N"){
                    _chartSeriesDatas[i].data[j].dataLabels.enabled=false;
                }else if(_cp.ChartLableValue.Type=="V"){
                    _chartSeriesDatas[i].data[j].dataLabels.format=_chartSeriesDatas[i].data[j].y+'';
                }else if(_cp.ChartLableValue.Type=="R"){
                    _chartSeriesDatas[i].data[j].dataLabels.format=j+1+'';
                }else if(_cp.ChartLableValue.Type=="L"){
                    _chartSeriesDatas[i].data[j].dataLabels.format=Agi.Controls.CustomScatterChart.GetSeriesPointLableValue(_EntityData,j,_cp.ChartLableValue.Column);//点的值
                }
            }
        }
    }
    return _chartSeriesDatas;
}
//获取series 点的Lable 值
Agi.Controls.CustomScatterChart.GetSeriesPointLableValue=function(_EntityData,_rowindex,_column){
    if(_EntityData!=null && _EntityData.length>0){
        if(_rowindex<_EntityData.length){
            try{
                return _EntityData[_rowindex][_column];
            }catch(ex){
                return null;
            }
        }
    }
    return null;
}
//endregion
Agi.Controls.CustomScatterChart.GetChartInitData = function () {
    var ThisDay = new Date();
    var ThisData = [];
    for (var i = 0; i < 10; i++) {
        ThisData.push({
            x:i+2,
            y:Agi.Script.GetRandomValue(10, 95),
            name:(i+2)+"",
            marker: { fillColor:'#62a6f6'},
            dataLabels: {enabled: false,y:null}
        });
    }
    return ThisData;
}