/**
* Created with JetBrains WebStorm.
* User: 刘文川
* Date: 12-10-24
* Time: 上午10:17
 *Update:20130812
 *Detail:单值图功能完善与扩展
* To change this template use File | Settings | File Templates.
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/

Agi.Controls.EdgeData = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
                minHeight: 400,
                minWidth: 200
            });
            return this;
        },
        ReadPage:function(pagenum,pagelimit,pagenumtobe,totalpage){
        	var Me=this;
        	var cp=Me.Get('ChartProperty');
        	var offset=pagenumtobe-pagenum;
        	if(pagenumtobe>=1 && pagenumtobe<=totalpage){
        		cp.data_page_no=pagenumtobe,cp.data_page_limit=pagelimit;
                var _EntityInfo=Me.Get('EntityInfo');
                this.ReadData(_EntityInfo);
        	}else{
        		if(offset<0){
        			AgiCommonDialogBox.Alert('已经是第一页');
        		}else{
        			AgiCommonDialogBox.Alert('已经是最后一页');
        		}
        	}
        },
        ReadData: function (_EntityInfo) {
            if (!_EntityInfo) {
                this.ReadOtherData("");
                return;
            }
            var Me = this;
            var entity = [];
            this.Set("EntityInfo", _EntityInfo);

            var cp=Me.Get('ChartProperty');
            var pageno=cp.data_page_no,pagesize=cp.data_page_limit;
            //分页查询方法
            Agi.Utility.RequestDataByPage (_EntityInfo,pageno,pagesize,function(data){
                //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
                _EntityInfo.Data = data.Data;
                _EntityInfo.Columns = data.Columns;
                _EntityInfo.result=data.result;
                _EntityInfo.totalrow=data.totalRows;
                _EntityInfo.totalpage=data.totalPages;
                _EntityInfo.pageLimit=data.pageLimit;
                _EntityInfo.pageNum=data.pageNum;

                entity.push(_EntityInfo);
                Me.Set("Entity", entity);

                Me.AddEntity(_EntityInfo); /*添加实体*/
                Me.chageEntity = true;
            });
            
        },
        ReadOtherData: function (_PointID) {//测试数据
            this.InitEdgeData();
        },
        AddEntitySingle: function (_entity) {
            var Me = this;
            Me.Set("FilterData",_entity.Data);

            Me.ChartLoadByData(_entity);//加载数据
        },//单值图
        ChartLoadByData:function(_Data){
            var Me=this;
            var pager={
            		totalrow : _Data.totalrow,
        			pagenum : _Data.pageNum,
        			pagelimit : _Data.pageLimit,
        			totalpage : _Data.totalpage
            }
            Me.chart.setDatas(_Data.Data,pager);
        },
        //设置边降数据上下限
        SetEdgeDataYAxisRange:function(setting){
        	var chart=this.chart;
        	chart.setYAxisRange(setting);
        },
        //显示标准线
        SetEdgeDataStdLine:function(setting){
        	var chart=this.chart;
        	var cp=this.Get('ChartProperty');
        	cp.chart_std_top_color=setting.topcolor;
        	cp.chart_std_bottom_color=setting.bottomcolor;
        	cp.chart_std_top_visible=setting.topvisible;
        	cp.chart_std_bottom_visible=setting.bottomvisible;
        	cp.chart_std_top_val=setting.topval;
        	cp.chart_std_bottom_val=setting.bottomval;
        	cp.chart_std_top_linewidth=setting.topwidth;
        	cp.chart_std_bottom_linewidth=setting.bottomwidth;
        	chart.setStdLineOption(setting);
        },
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
            //[{GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000}]
            //MaxValueType&MinValueType:0,代表Value为输入值 ;1，代表选择对应的Value为字段名
            var Me=this;
            Me.Set("NoFormatPlotLines",_PlotLineGrps);
        },//更新标准线组 20130815 markeluo
        UpSigmConditions:function(_rules){
            var Me=this;
            Me.Set("Sigmrules",_rules);//保存八项判异规则
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
            var DataSeries=Agi.Controls.CustomSingleChartGetDataSries(Me.Get('ChartSeries'),true);
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
            var CusSigChart=Me.Get('chart');
            var PlotLineAndBands= CusSigChart.yAxis[0].plotLinesAndBands[0];
            if(PlotLineAndBands!=null&& PlotLineAndBands.length>0){
                for(var i=0;i<PlotLineAndBands.length;i++){
                    CusSigChart.yAxis[0].removePlotLine(PlotLineAndBands[i].id);
                }
            }
            var _PlotLineGrps=Me.Get("NoFormatPlotLines");
            var PlotLines=[];
            var newGroup=null;
            if(_PlotLineGrps!=null && _PlotLineGrps.length>0){
                for(var i=0;i<_PlotLineGrps.length;i++){
                    newGroup=Agi.Controls.CustomSingleChartFormatPlotGrpPars(Me.Get("Entity")[0],_PlotLineGrps[i]);//新增标准线组
                    if(newGroup!=null){
                        PlotLines.push({GroupName:_PlotLineGrps[i].GroupName,Items:newGroup});
                    }
                }
            }
            Me.Set("PlotLines",PlotLines);

            if(PlotLines!=null){
                //获取当前标准线组的标准线元素
                var Yasixobj=CusSigChart.yAxis[0];
                for(var i=0;i<PlotLines.length;i++){
                    Yasixobj.addPlotLine(PlotLines[i].Items[0]);
                    Yasixobj.addPlotLine(PlotLines[i].Items[1]);
                }
            }

            //更新超出标准线的point点
            var chartSeries = Me.Get('ChartSeries');

            var DataSeries=Agi.Controls.CustomSingleChartGetDataSries(chartSeries);
            Agi.Controls.CustomSingleChartPlotLineUpSeries(DataSeries,PlotLines);//更新Series 点数据

            //特异判断规则应用，更改series 点的颜色
            var FilterData=Me.Get("FilterData");
            var WarnRuleValue=Me.Get("WarnRule");//特殊报警功能
            if(WarnRuleValue!=null && WarnRuleValue.warnColumn!=null && FilterData!=null && FilterData.length>0){
                var bool=false;
                for(var i=0;i<FilterData.length;i++){
                    //bool=eval(eval(FilterData[i][WarnRuleValue.warnColumn])+WarnRuleValue.warnRule+eval(WarnRuleValue.warnCompareValue));
                    bool=Agi.Controls.WarnValueCompare(FilterData[i][WarnRuleValue.warnColumn],WarnRuleValue.warnCompareValue,WarnRuleValue.warnRule);
                    if(bool)
                    {
                        if(DataSeries!=null && DataSeries.length>0){
                            for(var j=0;j<DataSeries.length;j++){
                                DataSeries[j].data[i].marker={fillColor:WarnRuleValue.warnColor};
                            }
                        }
                    }
                }
                if(chartSeries!=null && chartSeries.length>0){
                    for(var i=0;i<chartSeries.length;i++){
                        for(var j=0;j<DataSeries.length;j++){
                            if(chartSeries[i].name==DataSeries[j].name){
                                chartSeries[i].data=DataSeries[j].data;
                            }
                        }
                    }
                }
            }

            if(DataSeries!=null && DataSeries.length>0){
                for(var i=0;i<CusSigChart.series.length;i++){
                    for(var j=0;j<DataSeries.length;j++){
                        if(CusSigChart.series[i].name==DataSeries[j].name){
                            CusSigChart.series[i].remove();
                            i=-1;
                            break;
                        }
                    }
                }


                for(var i=0;i<DataSeries.length;i++){
                    DataSeries[i].data=Me.ApplySigmRule(DataSeries[i].data);//应用西格玛八项判异规则
                    CusSigChart.addSeries(DataSeries[i]);
                }
            }

            Me.ShowDataTable();//显示表格数据

           //标准线、西格玛线 统计信息
           var tolInfo=Agi.Controls.CustomSigChartAlarmStatistical(chartSeries,PlotLines);//统计信息
           var AppendToPanel=Me.Get("HTMLElement");
            var cp=Me.Get('ChartProperty');
            tolInfo.SGM.SigmaValue=cp.ChartisigmaValue;//西格玛系数
            tolInfo.SGM.Enable=cp.ChartisigmaLineVisible;

           //Agi.Controls.CustomSigChartAlarmStatisticalPanelShow(tolInfo,AppendToPanel);
            Agi.Controls.CustomSigChartAlarmStatisticalTableShow(tolInfo,AppendToPanel,cp.ChartBackConfig);
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
        ApplySigmRule:function(_SeriesDataArray){
            var Me=this;
            var SigmArray= Me.Get("Sigmrules");//八项判异规则数组
            var NewSeriesData=_SeriesDataArray;
            if(SigmArray!=null && SigmArray.length>0){
                var CheckDataSries=Agi.Controls.SigmRuleApplyGetGroupData(Me.Get("CheckDataSeries"));//分组数据信息
                ////待实现
                //NewSeriesData=SigmArlmFunc({SeriesData:_SeriesDataArray,SigmRule:SigmArray,GroupData:CheckDataSries});
                var ojb = new clsSigmaFunc(_SeriesDataArray,SigmArray,CheckDataSries);
                NewSeriesData = ojb.check();
            }
            return NewSeriesData;
        },//应用西格玛八项规则
        ShowDataTable:function(){

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
                                    Me.InitEdgeData();
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
                                    Me.InitEdgeData();
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
                _EntityInfo.Data=Me.DataSortByGrpName(d.Data);

                entity.push(_EntityInfo);
                Me.Set("Entity", entity);

                Me.AddEntity(entity[0]); /*添加实体*/
                Me.chageEntity = true;
            });
        }, //参数联动
        Init: function (_Target, _ShowPosition, savedId,_ChartProperty) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.Set("dataGridArray",[]);
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "EdgeDataView");
            this.Set("ChartCurrentData", []); //设置及时刷新数据显示
            var ID = savedId ? savedId : "EdgeDataView" + Agi.Script.CreateControlGUID();
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
                divPanel:HTMLElementPanel
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
                HTMLElementPanel.width(800);
                HTMLElementPanel.height(500);
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
            this.SetChartProperty(ID,_ChartProperty);
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
        },//end Init
        GetYValue: function () {
            var cp = this.Get('ChartProperty');
            var result = parseInt((cp.yAxis_PlotLines_Max - cp.yAxis_PlotLines_Min) / 3);
            return result <= 0 ? 1 : result;
        },
        SetChartProperty: function (_objCanvasAreaID,_ChartProperty) {//初始化定义图形控件属性结构，并预设值属性，_objCanvasAreaID：画布显示区域ID
            //图形基本结构定义
            var chartProperty = {
                chart_Data_Type: "边降数据",
                chart_RenderTo: _objCanvasAreaID, //画布ID
                data_page_no:1,//默认当前页数
                data_page_limit:10,//默认每页行数
                chart_max_line:_ChartProperty.chart_max_line,//chart的上显示边界值
                chart_min_line:_ChartProperty.chart_min_line,//chart的下显示边界值
                chart_std_top_color:_ChartProperty.chart_std_top_color,//chart的标准线上限颜色
                chart_std_bottom_color:_ChartProperty.chart_std_bottom_color,//chart的标准线下限颜色
                chart_std_top_visible:_ChartProperty.chart_std_top_visible,//chart的标准线上限是否显示
                chart_std_bottom_visible:_ChartProperty.chart_std_bottom_visible,//chart的标准线下限是否显示
                chart_std_top_val:_ChartProperty.chart_std_top_val,//chart的标准线上限值
                chart_std_bottom_val:_ChartProperty.chart_std_bottom_val,//chart的标准线下限值
                chart_std_top_linewidth:_ChartProperty.chart_std_top_linewidth,//chart的标准线上限线宽
                chart_std_bottom_linewidth:_ChartProperty.chart_std_bottom_linewidth//chart的标准线下限线宽
            };
            this.Set('ChartProperty', chartProperty); //保存属性结构
        },
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
        },//Point点击处理
        PointClick:function(_PointValue){
             var PointRow=_PointValue.x-1;
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:[PointRow]//所选的异常点
            };
            var ThisDataSeries=Me.GetDataSeries();//获取当前曲线信息
            if(ThisDataSeries!=null && ThisDataSeries.length>0){
                for(var i=0;i<ThisDataSeries.length;i++){
                    Agi.Controls.CustomSigChartAlarmDataPointsFind(GridData,cp.SeriesDataColumn[i],ThisDataSeries[i],cp.series_PointMarkerColor);
                }
            }
            Agi.view.advance.refreshGridData(GridData);//调用View框架的定位源数据功能
        },//单击,1.源数据定位
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
        InitEdgeData: function () {//初始化图形控件
            var Me=this;
            var cp = this.Get('ChartProperty');
            if (cp.chart_RenderTo) {
                var edgedata=new EdgeData({
            		container:cp.chart_RenderTo,
            		parentControl:Me,
            		range_max:cp.chart_max_line,
            		range_min:cp.chart_min_line,
            		topstdval:cp.chart_std_top_val,
            		topstdcolor:cp.chart_std_top_color,
            		topstdwidth:cp.chart_std_top_linewidth,
            		topstdvisible:cp.chart_std_top_visible,
            		bottomstdval:cp.chart_std_bottom_val,
            		bottomstdcolor:cp.chart_std_bottom_color,
            		bottomstdwidth:cp.chart_std_bottom_linewidth,
            		bottomstdvisible:cp.chart_std_bottom_visible
            	});
                this.Set('chart', edgedata);
                this.chart=edgedata;
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
            Agi.Controls.EdgeDataProrityInit(this);
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
            Agi.Controls.CustomSingleChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var EdgeDataControl = {
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
            EdgeDataControl.Control.ControlType = this.Get("ControlType");
            EdgeDataControl.Control.ControlID = ProPerty.ID;
            EdgeDataControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            EdgeDataControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            EdgeDataControl.Control.Entity = Entitys;
            EdgeDataControl.Control.BasicProperty = this.Get("BasicProperty");
            EdgeDataControl.Control.ChartProperty = this.Get("ChartProperty");
            EdgeDataControl.Control.ChartSeries = this.Get("ChartSeries");
            EdgeDataControl.Control.PointsParamerters = this.Get("PointsParamerters");
            EdgeDataControl.Control.Position = this.Get("Position");
            EdgeDataControl.Control.EntityInfo = this.Get("EntityInfo");
            EdgeDataControl.Control.ThemeInfo = this.Get("ThemeInfo");

            return EdgeDataControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
        	this.Init(_Target, _Config.Position, _Config.HTMLElement,_Config.ChartProperty);
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
        SetSavedProperty:function(){
        	var cp = this.Get('ChartProperty');
        	this.SetEdgeDataYAxisRange({'max':cp.chart_max_line,'min':cp.chart_min_line});
        },
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
            viewmenus.push({Title: "上下限设置", MenuImg: "ViewMenuImages/viewmenu_Standline.png", CallbackFun: Me.SPCEdgeDataRangeSetter});
            viewmenus.push({Title: "标准线设置", MenuImg: "ViewMenuImages/viewmenu_sigma.png", CallbackFun: Me.SPCEdgeDataStdLineSetter});
            return viewmenus;
        },//SPC控件支持View框架，控件菜单显示
        //
        SPCEdgeDataRangeSetter: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("上下限设置");
            $(_Panel).find(".content").height(50);
            Agi.Controls.EdgeDataRangeSetter(_Panel, Me);
            _CallFun();
        },//SPC控件View，标准线
        SPCEdgeDataStdLineSetter: function (_Panel, _CallFun) {
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("标准线设置");
            $(_Panel).find(".content").height(150);
            Agi.Controls.EdgeDataChartStdLineSetter(_Panel, Me);
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
                for(var i=0;i<ThisDataSeries.length;i++){
                    Agi.Controls.CustomSigChartAlarmDataPointsFind(GridData,cp.SeriesDataColumn[i],ThisDataSeries[i],cp.series_PointMarkerColor);
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

            //setTimeout(Agi.Controls.CustomSigChartLastChartShowExE(Me),2000);
            Agi.Controls.CustomSigChartLastChartShow(Me);
            if(Me.Get("LastChartImgIsExt")){
                Me.RefreshByProPanelUp();//更新显示
            }else{
                setTimeout(Agi.Controls.CustomSigChartRefreshShowExe(Me),2000);//更新显示
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
            Agi.Controls.CustomSigChartLastChartShowMenu(Me,false);//还原数据后，清除原对照图
            Me.Set("LastChartImgIsExt",false);

            Me.RefreshByProPanelUp();//更新显示
        },//SPC控件支持View框架，还原至原始数据
        SPCViewDataExtractURLGet:function(RowData){
            var Me=this;
            var ThisExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息保存
            if(ThisExtractConfig!=null && ThisExtractConfig.URL!=null && ThisExtractConfig.URL!=""){
                var Strurl="";
                Strurl+=ThisExtractConfig.URL;
                if(Strurl.indexOf("?")>-1){}else{
                    Strurl+="?";
                }
                if(ThisExtractConfig.Paras!=null && ThisExtractConfig.Paras.length>0){
                    var ThisParsValue=null;

                    for(var i=0;i<ThisExtractConfig.Paras.length;i++){
                        ThisParsValue=RowData[ThisExtractConfig.Paras[i].Column];
                        if(ThisParsValue!=null){
                            Strurl+="&"+ThisExtractConfig.Paras[i].Name+"="+ThisParsValue;
                        }
                    }
                }
                return Strurl;
            }else{
               return null;
            }
        }//数据钻取URL获取，需传入行数据
    },true);

/*下拉列表控件参数更改处理方法*/
Agi.Controls.CustomSingleChartAttributeChange = function (_ControlObj, Key, _Value) {
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
Agi.Controls.InitEdgeDataView = function () {
    return new Agi.Controls.EdgeData();
}

Agi.Controls.EdgeDataProrityInit = function (_BasicChart) {
    var Me = _BasicChart;
    //取得默认属性
    var cp = Me.Get('ChartProperty');
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];

    var ThisProItems = [];
    {
        var ItemContent =$("<div id='EdgeDataChartRange'></div>")
        Agi.Controls.EdgeDataRangeSetter(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "上下限设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.2.标准线
        ItemContent=$("<div id='CSChartStandLine'></div>");
        Agi.Controls.EdgeDataChartStdLineSetter(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标准线", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

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
Agi.Controls.EdgeDataRangeSetter=function(_Panel,_Control){
	var Me=_Control;
    var cp=Me.Get('ChartProperty');

    var ItemContent=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContent=$(_Panel).find(".content");
    }
	ItemContent.load('js/Controls/EdgeData/tabTemplates.html #tab-1', function () {
    	var checkbox=$(this).find('#isEdgeDataRangeFiexed'),
    		maxinput=$(this).find('#edgeDataChartMax'),
    		mininput=$(this).find('#edgeDataChartMin'),
    		savebtn=$(this).find('#edgeDataChartRangeSave');
    	checkbox.change(function(){
    		var ischecked=$(this).is(':checked');
    		if(ischecked){
    			maxinput.removeAttr('disabled');
    			mininput.removeAttr('disabled');
    		}else{
    			maxinput.attr('disabled','disabled');
    			mininput.attr('disabled','disabled');
    		}
    		saveRangeSet();
    	});
    	setRangeInputDefualt();
    	savebtn.click(saveRangeSet/*function(){
    		var max=parseInt(maxinput.val()),min=parseInt(mininput.val());
    		max=isNaN(max)?null:max;
    		min=isNaN(min)?null:min;
    		Me.SetEdgeDataYAxisRange({'max':max,'min':min});
    	}*/);
    	
    	function setRangeInputDefualt(){
    		if(cp.chart_fixed_range){
    			checkbox.attr('checked','checked');
    			maxinput.removeAttr('disabled');
    			mininput.removeAttr('disabled');
    		}else{
    			checkbox.removeAttr('checked');
    			maxinput.attr('disabled','disabled');
    			mininput.attr('disabled','disabled');
    		}
    		maxinput.val(cp.chart_max_line);
    		mininput.val(cp.chart_min_line);
    	}
    	
    	
    	function saveRangeSet(){
    		var ischecked=checkbox.is(':checked');
    		var max,min;
    		if(ischecked){
    			max=parseInt(maxinput.val());
    			min=parseInt(mininput.val());
        		max=isNaN(max)?null:max;
        		min=isNaN(min)?null:min;
    		}else{
    			max=null;
    			min=null;
    		}
    		Me.SetEdgeDataYAxisRange({'max':max,'min':min});
    	}
    });
}
//设置标准线配置界面
Agi.Controls.EdgeDataChartStdLineSetter=function(_Panel,_Control){
	var Me=_Control;
	var cp=Me.Get('ChartProperty');
    var ItemContent=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContent=$(_Panel).find(".content");
    }
	ItemContent.load('js/Controls/EdgeData/tabTemplates.html #tab-2', function () {
		var stdlineids=['top','bottom'];
		var thiscontent=$(this);
		$.each(stdlineids,function(idx,val){
			var lineColorVal=$("#"+val+"LineColorVal_EdgeData");
			lineColorVal.val(cp['chart_std_'+val+'_color']);
			thiscontent.find("#"+val+"LineColor_EdgeData").spectrum({//标准线颜色拾色器
				color:cp['chart_std_'+val+'_color'],
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
	            	lineColorVal.attr("value",color.toHexString());
	            }
	        });
			var visibleCheckbox=thiscontent.find('#'+val+'LineVisible_EdgeData');
			if(cp['chart_std_'+val+'_visible']){
				visibleCheckbox.attr('checked','checked');
			}else{
				visibleCheckbox.removeAttr('checked');
			}
			//topLineValue_EdgeData
			thiscontent.find('#'+val+'LineValue_EdgeData').val(cp['chart_std_'+val+'_val']);
			//topLineWidth_EdgeData
			thiscontent.find('#'+val+'LineWidth_EdgeData').val(cp['chart_std_'+val+'_linewidth']);
		});
		
		
		$(this).find('#edgeDataChartStdLineSave').click(function(){
			var opt={};
			$.each(stdlineids,function(idx,val){
				opt[val+'color']=thiscontent.find("#"+val+"LineColorVal_EdgeData").val();
				opt[val+'visible']=thiscontent.find('#'+val+'LineVisible_EdgeData').is(':checked');
				opt[val+'val']=thiscontent.find('#'+val+'LineValue_EdgeData').val();
				opt[val+'width']=thiscontent.find('#'+val+'LineWidth_EdgeData').val();
			});
			Me.SetEdgeDataStdLine(opt);
		});
	});
}
//region 20130815 markeluo 标准线相关处理
//1.格式化标准线组的显示值信息
Agi.Controls.CustomSingleChartFormatPlotGrpPars=function(_Entity,_PlotGrp){
    var PlotArray=null;
    //_PlotGrp: {GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000}
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
        }
        PlotArray.push({value:MaxValue,columnName:maxcolumn,dashStyle:'solid',color:_PlotGrp.MaxColor,width:_PlotGrp.MaxSize,id:_PlotGrp.GroupName+"_MAX",zIndex: 5});
        PlotArray.push({value:MinValue,columnName:mincolumn,dashStyle:'solid',color:_PlotGrp.MinColor,width:_PlotGrp.MinSize,id:_PlotGrp.GroupName+"_MIN",zIndex: 5});
        MaxValue=MinValue=null;
    }
    return PlotArray;
}
//2.根据标准线数组值，更新Series中相关Point点的颜色
Agi.Controls.CustomSingleChartPlotLineUpSeries=function(_SeriesArrar,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
//    var DataSeriesArray=Agi.Controls.CustomSingleChartGetDataSries(_SeriesArrar);
    if(_SeriesArrar!=null && _SeriesArrar.length>0){
        for(var i=0;i<_SeriesArrar.length;i++){
            Agi.Controls.CustomSingleChartPlotLineUpPoint(_SeriesArrar[i],_PlotLines);
        }
    }
}
Agi.Controls.CustomSingleChartGetDataSries=function(_SeriesArrar,_IsDataSeries){
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
Agi.Controls.CustomSingleChartPlotLineUpPoint=function(_Series,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
    if(_Series!=null && _Series.data!=null && _Series.data.length>0){
        var PointColor=null;
        for(var i=0;i<_Series.data.length;i++){
            PointColor=Agi.Controls.CustomSingleChartPlotLineGetPointColor(_Series.data[i].y,_PlotLines);
            if(PointColor!=null){
                _Series.data[i].marker={fillColor:PointColor};
            }
        }
    }
}
//4.根据标准线组获取对应的point点颜色,如为null则对应的point点颜色不更改
Agi.Controls.CustomSingleChartPlotLineGetPointColor=function(_Value,_PlotLines){
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
Agi.Controls.CustomSigChartAlarmStatistical=function(_ALLSeries,_PlotLines){
    var AlarmStatisticaldata={PlotLines:[],SGM:{AlarmSum:0,Percentage:0,MaxObj:{AlarmSum:0,Percentage:0,Item:[]},MinObj:{AlarmSum:0,Percentage:0,Item:[]},Enable:false}};
    var _Series=Agi.Controls.CustomSingleChartGetDataSries(_ALLSeries);//获得对应的的数据Series
    var _ScmSeries=Agi.Controls.CustomSingleChartGetDataSries(_ALLSeries,false);//获得对应的的西格玛线Series

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
                Agi.Controls.CustomSigChartAlarmStatisticalByData(j,_Series[i].data[j].y,AlarmStatisticaldata,SumPointNum);//统计标准线所在比例信息
            }
        }
    }
    return AlarmStatisticaldata;
}

Agi.Controls.CustomSigChartAlarmStatisticalByData=function(_index,_PointValue,_AlarmStatisticaldata,SumPointNum){
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
Agi.Controls.CustomSigChartAlarmStatisticalPanelShow=function(_AlarmStatisticaldata,_ApendToPanel){
    if($("#CustomSigChartAlarmPanel").length>0){
        $("#CustomSigChartAlarmPanel").html("");
    }else{
        var CustomSigChartAlarmPanelHTML=$("<div id='CustomSigChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomSigChartAlarmPanel").css({"right":"8px","top":"8px"});
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
    $("#CustomSigChartAlarmPanel").append(SubItemHTML);
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
Agi.Controls.CustomSigChartAlarmDataPointsFind=function(_GridData,_ColumnName,_ChartSeires,_markercolor){
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
        for(var j=0;j<_ChartSeires.data.length;j++){
            if(_ChartSeires.data[j].marker.fillColor!=_markercolor){//如果marker点颜色与原设置point点颜色不一致则说明该点为报警点
                _GridData.AlarmCells.push({Row:(_ChartSeires.data[j].x-1),Col:_Index,AlarmColor:_ChartSeires.data[j].marker.fillColor});
            }
        }
    }
}
//3.在View环境中显示标准线设置菜单项
Agi.Controls.CustomSigChartView_StandLinesMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('JS/Controls/CustomSingleChart/tabTemplates.html #tab-2', function () {
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
            LineTablePanel.find('#CustSigChartStLinename').show();
            LineTablePanel.find('#CustSigChartStLinegroupName').hide();
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
            if($("#CustSigChartStLinegroupName").is(":hidden")){
                if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                    //创建对象
                    if(Intopstatevalue==0){//新增
                        for(var i=0;i<ThisChartStandLines.length;i++){
                            if($("#CustSigChartStLinename").attr('value')==ThisChartStandLines[i].GroupName)
                            {
                                AgiCommonDialogBox.Alert('标准线不允许重名！');
                                return;
                            }
                        }
                    }else{//编辑
                        var NewGrpName=$("#CustSigChartStLinename").attr('value');
                        var OldSelGrpName=$("#CustSigChartStLinegroupName").val();
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
                var SelValue=$("#CustSigChartStLinegroupName").val();
                if(SelValue!=null && SelValue!=""){
                    SelectedItemObj=SelValue;
                }
            }
            $('#CustSigChartStLinename').hide();
            $('#CustSigChartStLinegroupName').show();
            $('#btnGrpUndo').hide();
            $('#btnEditGrp').show();
            $("#btnNewGrp").show();
            $("#btnDeleteGrp").show();

            var line={
                GroupName:$("#CustSigChartStLinename").attr('value'),
                MaxSize:$("#topWidth").attr('value'),
                MaxColor:$("#topColor").attr('value')==""?"#000":$("#topColor").attr('value'),
                MaxValueType:$("#topInstall option:selected").val(),
                MaxValue:$("#topInstall option:selected").text()=="固定值"?$("#topValue1").val():$("#topValue option:selected").text(),
                MinSize:$("#bottomWidth").attr('value'),
                MinColor:$("#bottomColor").attr('value')==""?"#000":$("#bottomColor").attr('value'),
                MinValueType:$("#bottomInstall option:selected").val(),
                MinValue:$("#bottomInstall option:selected").text()=="固定值"?$("#bottomValue1").val():$("#bottomValue option:selected").text()
            };
            //添加到数组
            if(SelectedItemObj!=null){
                line.GroupName=SelectedItemObj;
                if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
                    for(var i=0;i<ThisChartStandLines.length;i++){
                        if(ThisChartStandLines[i].GroupName==SelectedItemObj){
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

            var StandLinGrpNames = $("#CustSigChartStLinegroupName");
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
            if($('#CustSigChartStLinegroupName').css('display')!="none"){
                var index=-1;
                for(var i=0;i<ThisChartStandLines.length;i++){
                    if($('#CustSigChartStLinegroupName option:selected').text()==ThisChartStandLines[i].GroupName)
                    {
                        index=i;break;
                    }
                }
                ThisChartStandLines.splice(index,1);
                var name = $("#CustSigChartStLinegroupName");
                name.empty();
                for(var i=0;i<ThisChartStandLines.length;i++) {
                    var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>"
                    name.append(option);
                }
                if(ThisChartStandLines.length==0)
                {
                    $('#CustSigChartStLinegroupName').hide();
                    $('#CustSigChartStLinename').val("").show();
                }
                groupNameChange(ThisChartStandLines);
            }
            else{
                AgiCommonDialogBox.Alert('请先选择要删除的标准线！');
            }
        });

        //3.取消
        $(this).find("#btnGrpUndo").unbind().bind("click",function(ev){
            $(this).hide();

            $('#CustSigChartStLinename').hide();
            $('#CustSigChartStLinegroupName').show();
            $("#btnDeleteGrp").show();
            $("#btnNewGrp").show();
            $("#btnEditGrp").show();

            groupNameChange(ThisChartStandLines);
        }).hide();
        //4.编辑
        $(this).find("#btnEditGrp").unbind().bind("click",function(ev){
            var LineTablePanel=$(this).parent().parent().parent();
            LineTablePanel.find('#CustSigChartStLinename').show().val(LineTablePanel.find('#CustSigChartStLinegroupName').val());
            LineTablePanel.find('#CustSigChartStLinegroupName').hide();
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
            }
            else if($("#topInstall option:selected").text()=="数据列"){
                $('#topValue1').hide();
                $('#topValue').show();
            }
        });
        $(this).find("#bottomInstall").change(function(){
            if( $("#bottomInstall option:selected").text()=="固定值"){
                $('#bottomValue1').show();
                $('#bottomValue').hide();
            }
            else if($("#bottomInstall option:selected").text()=="数据列"){
                $('#bottomValue1').hide();
                $('#bottomValue').show();
            }
        });
        $(this).find("#CustSigChartStLinegroupName").change(function(){
            groupNameChange(ThisChartStandLines);
        });

        //选中项发生更改
        var groupNameChange=function(_StandLines){
            for(var i=0;i<_StandLines.length;i++)
            {
                if($("#CustSigChartStLinegroupName  option:selected").text()==_StandLines[i].GroupName){
                    $('#topWidth').attr('value',_StandLines[i].MaxSize);
                    $("#topInstall").find("option[value='"+_StandLines[i].MaxValueType+"']").attr("selected",true);
                    $('#topColor').spectrum("set", _StandLines[i].MaxColor);
                    if( $("#topInstall option:selected").text()=="固定值"){
                        $('#topValue1').show();
                        $('#topValue').hide();
                        $('#topValue1').val(_StandLines[i].MaxValue);
                    }
                    else if($("#topInstall option:selected").text()=="数据列"){
                        $('#topValue1').hide();
                        $('#topValue').show();
                        $("#topValue").find("option[value='"+_StandLines[i].MaxValue+"']").attr("selected",true);
                    }
                    $('#bottomWidth').attr('value',_StandLines[i].MinSize);
                    $("#bottomInstall").find("option[value='"+_StandLines[i].MinValueType+"']").attr("selected",true);
                    $('#bottomColor').spectrum("set", _StandLines[i].MinColor);
                    if( $("#bottomInstall option:selected").text()=="固定值"){
                        $('#bottomValue1').show();
                        $('#bottomValue').hide();
                        $('#bottomValue1').val(_StandLines[i].MinValue);
                    }
                    else if($("#bottomInstall option:selected").text()=="数据列"){
                        $('#bottomValue1').hide();
                        $('#bottomValue').show();
                        $("#bottomValue").find("option[value='"+_StandLines[i].MinValue+"']").attr("selected",true);
                    }
                }
            }
        }

        //4.初始化绑定
        var StandLinGrpNames = $(this).find("#CustSigChartStLinegroupName");
        StandLinGrpNames.empty();
        if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
            for(var i=0;i<ThisChartStandLines.length;i++) {
                var option ="<option value='"+ThisChartStandLines[i].GroupName+"'>"+ThisChartStandLines[i].GroupName+"</option>";
                StandLinGrpNames.append(option);
            }
            StandLinGrpNames.find("option[value='"+ThisChartStandLines[0].GroupName+"']").attr("selected",true);
            $(this).find('#CustSigChartStLinename').hide();
            $(this).find('#CustSigChartStLinegroupName').show();
            groupNameChange(ThisChartStandLines);//绑定显示

            $("#btnEditGrp").show();
        }else{
            $(this).find('#CustSigChartStLinename').show();
            $(this).find('#CustSigChartStLinegroupName').hide();
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
            StandLinetopValueColumns.find("option[value="+ChartEntityColumns[0]+"]").attr("selected","selected");
            StandLinebottomValueColumns.find("option[value="+ChartEntityColumns[0]+"]").attr("selected","selected");
        }

    });
}
//4.在View环境中显示下西格玛设置菜单项
Agi.Controls.CustomSigChartView_SigmaSettingMenu=function(_Panel,_Control){
    var Me=_Control;
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/CustomSingleChart/tabTemplates.html #tab-6', function () {
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
        $(this).find("#CstSigChartSigmaOptionSave").unbind().bind("click",function(ev){
            var newcp=Me.Get("ChartProperty");//获取属性
            newcp.ChartisigmaValue=$("#CustSigChartSigmaValue").val();
            newcp.yAxis_PlotLines_MaxMarkerColor=$("#CustSigmatopColor").val();
            newcp.yAxis_PlotLines_MinMarkerColor=$("#CustSigmabottomColor").val();
            var StateValue=$("#CustSigChartSigmaLineState").val();
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
        $(this).find("#CustSigChartSigmaValue").val(cp.ChartisigmaValue);
        var VisibleStateValue="1";
        if(!cp.ChartisigmaLineVisible){
            VisibleStateValue="0";
        }
        $(this).find("#CustSigChartSigmaLineState").find("option[value='"+VisibleStateValue+"']").attr("selected",true);
        cp=null;
    });
}
//4.在View环境中显示西格玛判异菜单项
Agi.Controls.CustomSigChartView_SigmaMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('JS/Controls/CustomSingleChart/tabTemplates.html #tab-3', function () {
        var THisChartSigmaRules=Me.Get("Sigmrules");//获取八项判异规则
        //1.八项规则保存
        $(this).find("#CustsigChartSigMaRuleSave").unbind().bind("click",function(ev){
            var rule=[];
            var ruleitem=null;
            for(i=1;i<=8;i++)
            {
                ruleitem={
                    NO:i,
                    Kvalue:$('#K'+i).val(),
                    color:$('#Kcolor'+i).attr("value")==""?"#000":$('#Kcolor'+i).attr('value'),
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
Agi.Controls.CustomSigChartView_SpecialAlarmMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('JS/Controls/CustomSingleChart/tabTemplates.html #tab-5', function () {
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
Agi.Controls.CustomSigChartView_ExtractMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('JS/Controls/CustomSingleChart/tabTemplates.html #tab-7', function () {
        //0.默认选项隐藏
        $("#CustomSigChartParCancel").hide();
        $("#CustomSigChartNewParsTxt").width(0).hide();

        //1.添加参数
        $(this).find('#CustomSigChartParAdd').click(function(){
            $(this).hide();
            $("#CustomSigChartParCancel").show();
            $("#CustomSigChartNewParsTxt").width(60).show();
            $("#CustomSigChartParsNames").hide();
        });
        //2.取消添加
        $(this).find('#CustomSigChartParCancel').click(function(){
            $("#CustomSigChartParCancel").hide();
            $("#CustomSigChartNewParsTxt").width(0).val("").hide();
            $("#CustomSigChartParsNames").show();
            $("#CustomSigChartParAdd").show();
        });
        //3.保存
        $(this).find('#CustomSigChartParSave').click(function(){
            var SCSTxtVisibly=!$("#CustomSigChartNewParsTxt").is(':hidden');
            var CusChartParsName="";
            var CusChartParsValue="";
            if(SCSTxtVisibly){
                //新增参数
                CusChartParsName=$("#CustomSigChartNewParsTxt").val();
                CusChartParsValue=$("#CustomSigChartParsValues").val();
            }else{
                //编辑参数
                CusChartParsName=$("#CustomSigChartParsNames").val();
                CusChartParsValue=$("#CustomSigChartParsValues").val();
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
                            $("#CustomSigChartParsNames").append("<option value='"+CusChartParsName+"'>"+CusChartParsName+"</option>");

                            $("#CustomSigChartParCancel").hide();
                            $("#CustomSigChartNewParsTxt").width(0).val("").hide();
                            $("#CustomSigChartParsNames").show();
                            $("#CustomSigChartParAdd").show();

                            $("#CustomSigChartParsNames").val(CusChartParsName);
                            //更新列表显示
                            Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");

                            AgiCommonDialogBox.Alert("添加成功!");
                        }
                    }else{
                        ChartExtractConfig.Paras[i].Column=CusChartParsValue;
                        //更新列表显示
                        Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
                        AgiCommonDialogBox.Alert("修改成功!");
                    }
                }else{
                    ChartExtractConfig.Paras.push({Name:CusChartParsName,Column:CusChartParsValue,Value:""});
                    $("#CustomSigChartParsNames").append("<option value='"+CusChartParsName+"'>"+CusChartParsName+"</option>");

                    $("#CustomSigChartParCancel").hide();
                    $("#CustomSigChartNewParsTxt").width(0).val("").hide();
                    $("#CustomSigChartParsNames").show();
                    $("#CustomSigChartParAdd").show();

                    $("#CustomSigChartParsNames").val(CusChartParsName);

                    //更新列表显示
                    Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");

                    AgiCommonDialogBox.Alert("添加成功!");
                }

                Me.Set("ExtractConfig",ChartExtractConfig);//数据钻取配置信息保存
            }else{
                AgiCommonDialogBox.Alert("参数名称和绑定列不可为空!");
            }
        });
        //4.删除
        $(this).find('#CustomSigChartParDel').click(function(){
            var SCSTxtVisibly=!$("#CustomSigChartNewParsTxt").is(':hidden');
            if(SCSTxtVisibly){
                AgiCommonDialogBox.Alert("请取消或完成新增，选择已存在的参数名称后再试!");
            }else{
                //编辑参数
               var CusChartParsName=$("#CustomSigChartParsNames").val();
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
                        $("#CustomSigChartParsNames option[value='"+ChartExtractConfig.Paras[ParIndex].Name+"']").remove(); //删除Select中Value=''的Option

                        ChartExtractConfig.Paras.splice(ParIndex,1);
                        //更新列表显示
                        Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
                        Me.Set("ExtractConfig",ChartExtractConfig);//数据钻取配置信息保存

                        AgiCommonDialogBox.Alert("删除成功!");
                    }
                }
            }
        });
        //5.初始化列表栏位显示
        var DefaultParNameColumn=null;
        if(ChartExtractConfig!=null && ChartExtractConfig.URL!=null){
           $("#CustSigChartExtractURL").val(ChartExtractConfig.URL);
        }
        if(ChartExtractConfig.Paras!=null && ChartExtractConfig.Paras.length>0){
            for(var i=0;i<ChartExtractConfig.Paras.length;i++){
                $("#CustomSigChartParsNames").append("<option value='"+ChartExtractConfig.Paras[i].Name+"'>"+ChartExtractConfig.Paras[i].Name+"</option>");
            }
            DefaultParNameColumn=ChartExtractConfig.Paras[0].Column;
            $("#CustomSigChartParsNames").val(ChartExtractConfig.Paras[0].Name);

            //更新列表显示
            Agi.Controls.CustomSigChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
        }else{
            $("#CustomSigChartParAdd").hide();
            $("#CustomSigChartParCancel").show();
            $("#CustomSigChartNewParsTxt").width(60).show();
            $("#CustomSigChartParsNames").hide();
        }
        if(ChartEntityColumns!=null && ChartEntityColumns.length>0){
            for(var i=0;i<ChartEntityColumns.length;i++){
                $("#CustomSigChartParsValues").append("<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>");
            }
            if(DefaultParNameColumn!=null){
                $("#CustomSigChartParsValues").val(DefaultParNameColumn);
            }
        }
        //6.参数名称选中项更改
        $(this).find('#CustomSigChartParsNames').change(function(){
            var StrThisSelValue=$(this).val();
            var ThisParas=Me.Get("ExtractConfig").Paras;//数据钻取配置信息保存
            if(ThisParas!=null && ThisParas.length>0){
                for(var i=0;i<ThisParas.length;i++){
                    if(ThisParas[i].Name==StrThisSelValue){
                        $("#CustomSigChartParsValues").val(ThisParas[i].Column);
                        break;
                    }
                }
            }
        });
        //7.参数项&URL信息保存
        $(this).find('#CstSigChartExtractOptionSave').click(function(){
            var ThisExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息保存
            ThisExtractConfig.URL=$("#CustSigChartExtractURL").val();
            Me.Set("ExtractConfig",ThisExtractConfig);//数据钻取配置信息保存
            AgiCommonDialogBox.Alert("数据钻取配置信息保存成功!");
        });
    });
}

//region 21030917 22:26 markeluo 标准线和西格玛线报警汇总统计面板显示
Agi.Controls.CustomSigChartAlarmStatisticalTableShow=function(_AlarmStatisticaldata,_ApendToPanel,_BackGroundConfig){
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
    if($("#CustomSigChartAlarmPanel").length>0){
        $("#CustomSigChartAlarmPanel").html("<a id='btnTotalMenu' class='totalAlarmmenusty' >+统计信息</a></div>");
    }else{
        var CustomSigChartAlarmPanelHTML=$("<div id='CustomSigChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomSigChartAlarmPanel").css({"right":"8px","top":"8px"});
        CustomSigChartAlarmPanelHTML.append("<a  id='btnTotalMenu' class='totalAlarmmenusty'>+统计信息</a>");
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
    SubItemHTML+="<tr><td style='background-color:#4bacc6'>图形名称</td><td style='background-color:#4bacc6'>单值图</td><td></td><td></td><td></td></tr>";
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
    if(_AlarmStatisticaldata!=null && _AlarmStatisticaldata.SGM!=null && _AlarmStatisticaldata.SGM.Enable){
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>西格玛值</td><td>"+_AlarmStatisticaldata.SGM.SigmaValue+"</td><td></td><td></td></tr>";
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>超上限</td><td ></td><td>"+_AlarmStatisticaldata.SGM.MaxObj.AlarmSum+"</td><td>"+accMul(parseFloat(_AlarmStatisticaldata.SGM.MaxObj.Percentage),100)+"</td></tr>";
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>超下限</td><td ></td><td>"+_AlarmStatisticaldata.SGM.MinObj.AlarmSum+"</td><td>"+accMul(parseFloat(_AlarmStatisticaldata.SGM.MinObj.Percentage),100)+"</td></tr>";
        var PercentageValue=accMul(parseFloat(_AlarmStatisticaldata.SGM.Percentage),100);
        SubItemHTML+="<tr><td style='background-color:#4bacc6'>西格玛线</td><td style='background-color:#4bacc6'>合计</td><td ></td><td>"+_AlarmStatisticaldata.SGM.AlarmSum+"</td><td>"+PercentageValue+"</td></tr>";
    }
    SubItemHTML+="</table>"
    $("#CustomSigChartAlarmPanel").append(SubItemHTML);
    $("#CustomSigChartAlarmPanel").find(".totalAlarmmenusty").css({
        "color":_BackGroundConfig.TolbtnFontColor,
        "background-color":_BackGroundConfig.Tolbtnbackground
    })
    $("#CustomSigChartAlarmPanel").find("#TotalTable").css({
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
    $("#CustomSigChartAlarmPanel").unbind().bind("dblclick",function(ev){
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
            $("#CustomSigChartAlarmPanel").html()+
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
Agi.Controls.CustomSigChartLastChartShow=function(_Controls){
    var Me=_Controls;
    if(Me.Get("LastChartImgIsExt")){
        Agi.Controls.CustomSigChartLastChartShowMenu(Me,true);
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
               // $(ThisControlObj.renderTo).append("<div id='"+ControlPanelID+"_Img' class='SigChartLastImgPanel'><img src='"+canvas.toDataURL('image/png')+"' style='width:100%;height:100%;'></div>");
                $("#"+ControlPanelID).append("<div id='"+ControlPanelID+"_Img' class='SigChartLastImgPanel'><img src='"+canvas.toDataURL('image/png')+"' style='width:100%;height:100%;'></div>");
                $("#"+ControlPanelID+"_Img").height(parseInt($("#"+ControlPanelID).height()/2));
                Agi.Controls.CustomSigChartLastChartShowMenu(Me,true);
                Me.Set("LastChartImgIsExt",true);
            }
        });
        Me.Set("IsShowLastChart",false);
    }
}
Agi.Controls.CustomSigChartRefreshShowExe=function(_Controls){
    return function(){
        _Controls.RefreshByProPanelUp();
    };
}

Agi.Controls.CustomSigChartLastChartShowMenu=function(_Control,_IsShow){
    var Me=_Control;
    var _ApendToPanel=Me.Get("HTMLElement");
    if(_IsShow){
        if($("#CustomSigChartLastImgMenu").length>0){
        }else{
            var CustomSigChartLastImgHTML=$("<div id='CustomSigChartLastImgMenu' class='AlarmStyLasgImg' data-state='0'>查看原始图形</div>").appendTo($(_ApendToPanel));
            $("#CustomSigChartLastImgMenu").css({"right":"78px","top":"8px"});
        }
        $("#CustomSigChartLastImgMenu").show();
        $("#CustomSigChartLastImgMenu").unbind().bind("click",function(ev){
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
        $("#CustomSigChartLastImgMenu").hide();//隐藏
    }

}
//显示单值图数据钻取参数列表
Agi.Controls.CustomSigChartParsListUpdate=function(_Paras,_ListPanelID){
    var StrListItems="";
    if(_Paras!=null && _Paras.length>0){
        for(var i=0;i<_Paras.length;i++){
            StrListItems+=" <div class='ParsListHeadSty'><div class='CustomSigChartParsListCellSty'>"+_Paras[i].Name+"</div><div class='CustomSigChartParsListCellSty'>"+_Paras[i].Column+"</div></div>";
        }
    }
    $("#"+_ListPanelID).html(StrListItems);
}
//endregion
//region 背景设置
Agi.Controls.CustomSigChartBackgroundValueGet=function(_oBackgroundObj){
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
