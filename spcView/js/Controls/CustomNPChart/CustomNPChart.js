/**
* Created with JetBrains WebStorm.
* User: markeluo
* Date: 13-12-10
* Time: 下午 14:26
 *Update:
 *Detail:NP控制图
* To change this template use File | Settings | File Templates.
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/

Agi.Controls.CustomNPChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
            var checkDataSeries = [
                { Names: "", min: 0, max: 4, minValue: 1, middleValue: 2, maxValue: 3, Data: [null]}];
            var cp = this.Get("ChartProperty");
            if(typeof cp == 'undefined'){
                return;
            }
            cp.chart_MarginRight = 30;
            cp.xAxis_Auxiliary_Enabled = false;
            cp.yAxis_Auxiliary_Enabled = false;
            this.Set("ChartProperty", cp);
            this.Set("CheckDataSeries", checkDataSeries);
            this.SetChartDataProperty();
            this.InitHighChart();
        },
        AddEntitySingle: function (_entity) {
            var Me = this;
            Me.Set("FilterData",_entity.Data);

            Me.ChartLoadByData(_entity.Data);//加载数据
            Me.ShowDataTable();//显示表格数据
        },//单值图
        ChartLoadByData:function(_Data){
            $('#pointMenu').hide();//图形刷新前隐藏原数据点右键菜单
            var Me=this;
            var  ArrayBCName = [],DataArray = [],GroupArray=[], EntityData = [];
            var ChartGroupDataArray=[];
            var cp = Me.Get('ChartProperty');//cp.SeriesGroupColumn cp.SeriesDataColumn
            var jsonData = { "action": "RCalp_Nplot",
                "isigma":cp.ChartisigmaValue, //西格玛系数
                "nrow":cp.chart_Data_NRow.Value,//子组大小
                "groupdata":[]//分组数据
            };
            if(_Data!=null && _Data.length>0){
                EntityData=_Data;
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

                    //region 支持多分组时的代码
                    for (var Name in ArrayBCName) {
                        jsonData.groupdata.push({name:ArrayBCName[Name],dataArray:[],nrows:[]});
                        ChartGroupDataArray.push({name:ArrayBCName[Name],dataArray:[],nrows:[]});
                        for (var j = 0; j < EntityData.length; j++) {
                            if (EntityData[j][cp.SeriesGroupColumn] == ArrayBCName[Name]) {
                                jsonData.groupdata[jsonData.groupdata.length-1].dataArray.push(eval(EntityData[j][cp.SeriesDataColumn[0]]));
                                ChartGroupDataArray[ChartGroupDataArray.length-1].dataArray.push(eval(EntityData[j][cp.SeriesDataColumn[0]]));

                                if(cp.chart_Data_NRow.Type==1){//子组大小为字段列
                                    jsonData.groupdata[jsonData.groupdata.length-1].nrows.push(eval(EntityData[j][cp.chart_Data_NRow.Value]));
                                    ChartGroupDataArray[ChartGroupDataArray.length-1].nrows.push(eval(EntityData[j][cp.chart_Data_NRow.Value]));
                                }
                            }
                        }
                    }
                    //endregion

                }else{
                    ArrayBCName=[""];
                    jsonData.groupdata.push({name:"",dataArray:[],nrows:[]});
                    ChartGroupDataArray.push({name:"",dataArray:[],nrows:[]});
                    for (var j = 0; j < EntityData.length; j++) {
                        jsonData.groupdata[jsonData.groupdata.length-1].dataArray.push(eval(EntityData[j][cp.SeriesDataColumn[0]]));
                        ChartGroupDataArray[ChartGroupDataArray.length-1].dataArray.push(eval(EntityData[j][cp.SeriesDataColumn[0]]));
                        if(cp.chart_Data_NRow.Type==1){//子组大小为字段列
                            jsonData.groupdata[jsonData.groupdata.length-1].nrows.push(eval(EntityData[j][cp.chart_Data_NRow.Value]));
                            ChartGroupDataArray[ChartGroupDataArray.length-1].nrows.push(eval(EntityData[j][cp.chart_Data_NRow.Value]));
                        }
                    }
                }
                if(cp.ChartisigmaValue!=null && cp.ChartisigmaValue!=""){}else{
                    cp.ChartisigmaValue=3;
                }
                if(cp.chart_Data_NRow.Type==1){
                    jsonData.nrow="";
                }else{
                    jsonData.nrow+="";
                }
                var jsonString = JSON.stringify(jsonData);
                Agi.DAL.ReadData({"MethodName":"RCalp_Nplot","Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result && _result.result == "true" && _result.groupdata!=null && _result.groupdata.length>0) {
                        var cp = Me.Get("ChartProperty");
                        var checkDataSeries = [];
                        for (var i = 0; i < _result.groupdata.length; i++) {
                            var min = checkDataSeries.length > 0 ? checkDataSeries[checkDataSeries.length - 1].max : 0;
                            var max = min + ChartGroupDataArray[i].dataArray.length;
                            checkDataSeries.push({
                                Names: _result.groupdata[i].name,
                                min: min,
                                max: max,
                                minValue: _result.groupdata[i].NP_LCL,
                                middleValue: _result.groupdata[i].NPbar,
                                maxValue: _result.groupdata[i].NP_UCL,
                                Isigma:null,
                                Data:ChartGroupDataArray[i].dataArray
                            })
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
                        var cp = Me.Get("ChartProperty");
                        var checkDataSeries = [];

                        checkDataSeries.push({
                            Names:"",
                            min: 0,
                            max: DataArray.length,
                            minValue:[700],
                            middleValue:920,
                            maxValue:[1200],
                            Isigma: null,
                            Data:DataArray
                        })
                        cp.chart_MarginRight = 150;
                        cp.xAxis_Auxiliary_Enabled = true;
                        cp.yAxis_Auxiliary_Enabled = true;
                        Me.Set("ChartProperty", cp);
                        Me.Set("CheckDataSeries", checkDataSeries);
                        Me.SetChartDataProperty();
                        Me.InitHighChart();
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
            cp.chart_Data_NRow.Type=_dataLine.GroupSize.Type;
            cp.chart_Data_NRow.Value=_dataLine.GroupSize.Value;

            var FilterDataArray=Me.Get("FilterData");
            if(FilterDataArray!=null && FilterDataArray.length>0){
                FilterDataArray=Me.DataSortByGrpName(FilterDataArray);
            }else{
                    FilterDataArray= Me.DataSortByGrpName(Me.Get("Entity")[0].Data);
            }
            if(cp.chart_Data_NRow.Type==1){
            }else{
                cp.chart_Data_NRow.ArrayValues=[];
            }
            Me.Set('ChartProperty',cp);

            Me.Set("FilterData",FilterDataArray);
        },//更改曲线设置后，更新显示  20130817 markeluo
        GetDataSeries:function(){
            var Me=this;
            var DataSeries=Agi.Controls.CustomNPChartGetDataSries(Me.Get('ChartSeries'),true);
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
            var CusXMRChart=Me.Get('chart');
            var PlotLineAndBands= CusXMRChart.yAxis[0].plotLinesAndBands[0];
            if(PlotLineAndBands!=null&& PlotLineAndBands.length>0){
                for(var i=0;i<PlotLineAndBands.length;i++){
                    CusXMRChart.yAxis[0].removePlotLine(PlotLineAndBands[i].id);
                }
            }
            var _PlotLineGrps=Me.Get("NoFormatPlotLines");
            var PlotLines=[];
            var newGroup=null;
            if(_PlotLineGrps!=null && _PlotLineGrps.length>0){
                for(var i=0;i<_PlotLineGrps.length;i++){
                    newGroup=Agi.Controls.CustomNPChartFormatPlotGrpPars(Me.Get("Entity")[0],_PlotLineGrps[i]);//新增标准线组
                    if(newGroup!=null){
                        PlotLines.push({GroupName:_PlotLineGrps[i].GroupName,Items:newGroup});
                    }
                }
            }
            Me.Set("PlotLines",PlotLines);

            if(PlotLines!=null){
                //获取当前标准线组的标准线元素
                var Yasixobj=CusXMRChart.yAxis[0];
                for(var i=0;i<PlotLines.length;i++){
                    if(PlotLines[i].Items[0].Enable){
                        Yasixobj.addPlotLine(PlotLines[i].Items[0]);
                    }
                    if(PlotLines[i].Items[1].Enable){
                        Yasixobj.addPlotLine(PlotLines[i].Items[1]);
                    }
                }
            }

            //更新超出标准线的point点
            var chartSeries = Me.Get('ChartSeries');
            var checkDataSeries = this.Get('CheckDataSeries');

            var DataSeries=Agi.Controls.CustomNPChartGetDataSries(chartSeries);
            Agi.Controls.CustomNPChartPlotLineUpSeries(DataSeries,PlotLines);//更新Series 点数据

            //特异判断规则应用，更改series 点的颜色
            var FilterData=Me.Get("FilterData");
            var WarnRuleValue=Me.Get("WarnRule");//特殊报警功能
            if(WarnRuleValue!=null && WarnRuleValue.warnColumn!=null && FilterData!=null && FilterData.length>0){
                var bool=false;
                if(checkDataSeries!=null && checkDataSeries.length>0){
                    var PointRows=null;
                    for(var j=0;j<DataSeries[0].data.length;j++){
                        PointRows= Agi.Controls.CustomNPChart.FindDataRowsByPoint(checkDataSeries,DataSeries[0].data[j].x);
                        bool=Agi.Controls.WarnValueCompare(FilterData[PointRows[0]][WarnRuleValue.warnColumn],WarnRuleValue.warnCompareValue,WarnRuleValue.warnRule);
                        if(bool){
                            DataSeries[0].data[j].marker={fillColor:WarnRuleValue.warnColor};
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
                for(var i=0;i<CusXMRChart.series.length;i++){
                    for(var j=0;j<DataSeries.length;j++){
                        if(CusXMRChart.series[i].name==DataSeries[j].name){
                            CusXMRChart.series[i].remove();
                            i=-1;
                            break;
                        }
                    }
                }


                for(var i=0;i<DataSeries.length;i++){
                    DataSeries[i].data=Me.ApplySigmRule(DataSeries[i].data);//应用西格玛八项判异规则
                    CusXMRChart.addSeries(DataSeries[i]);
                }
            }

            Me.ShowDataTable();//显示表格数据

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
                var ojb = new NPRclsSigmaFunc(_SeriesDataArray,SigmArray,CheckDataSries);
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
            this.Set("ControlType", "CustomNPChart");
            this.Set('IntervalID', null); //预先保存定时器ID
            this.Set("ChartParameters", { Key: false, Points: [] }); //预先保存结构
            this.Set("ChartCurrentData", []); //设置及时刷新数据显示
            this.Set("PointsParamerters", []); //注册数据点位号保存，点位号集合，结构["11AE84102","11AE84015","11AE84103"]
            var ID = savedId ? savedId : "CustomNPChart" + Agi.Script.CreateControlGUID();
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
        SetChartProperty: function (_objCanvasAreaID) {//初始化定义图形控件属性结构，并预设值属性，_objCanvasAreaID：画布显示区域ID
            //图形基本结构定义
            var chartProperty = {
                chart_Data_Type: "移动极差",
                chart_Data_NRow:
                {
                    Type:0,//类型:0,固定值,1:数据列
                    Value:10000,//Type=0,固定值，Type=1:数据列名称
                    ArrayValues:[]//当Value==1时，此处存放数据值数组
                },
                chart_PointNumber: 20, //当前图形范围所显示的点位
                chart_RenderTo: _objCanvasAreaID, //画布ID
                chart_Type: 'line', //'spline',//显示图形
                chart_MarginTop: 30, //图形距画框右边距距离
                chart_MarginRight: 80, //图形距画框右边距距离
                chart_Reflow: true, //图形是否跟随放大
                chart_Animation: false, //动画平滑滚动
                chart_PlotBorderWidth: 1, //数据图表区域边框宽度
                chart_PlotBorderColor: "#5c5757", //数据图表区域边框颜色
                chart_BackgroundColor:{"linearGradient":{"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#ededed"],[1,"#cbcbcb"]]}, //"#C9E8E2",//数据图表区域颜色
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
                xAxis_PlotLines: [], //参考线位置，计算取得
                xAxis_PlotLines_LineColor: "blue", //参考线颜色
                xAxis_PlotLines_LineWidth: 1, //参考线宽度
                xAxis_PlotLines_DashStyle: "longdash", //X轴参考线显示类型 longdash：虚线
                xAxis_LinkedTo: 0, //未知，用于第二X轴，伪轴显示
                xAxis_Opposite: true, //是否相反方向显示
                xAxis_TickPositions: [], //显示X轴线指定值
                yAxis_TickPositions: [], //显示Y轴线指定值
                yAxis_Title_Text: 'NP 控制图', //'单独值', //Y轴标题文字
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
                series_MinPlotLine_Names: "NP_LCL", //是否显示最低参考线 markeluo 20121126 LCL与UCL 写反了
                series_MiddlePlotLine_Color: "green", //中间值参考线颜色
                series_MiddlePlotLine_Enabled: true, //是否显示中间参考线
                series_MiddlePlotLine_Names: "NPBar", //是否显示最低参考线
                series_MaxPlotLine_Color: "#f41d12", //最大参考线颜色
                series_MaxPlotLine_Enabled: true, //是否显示最大参考线
                series_MaxPlotLine_Names: "NP_UCL", //是否显示最低参考线 markeluo 20121126 LCL与UCL 写反了
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
                    backgroundColor:{"linearGradient":{"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#ededed"],[1,"#cbcbcb"]]},//背景
                    Tolbtnbackground:"#cecece",//菜单按钮背景
                    TolbtnFontColor:"#3d95e6",//菜单按钮字体
                    TolTabbackground:"#dbdbdb",//统计表格背景
                    TolTabFontColor:"#000000"//统计表格字体
                }//背景配置
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

            var dataMin = [];
            var dataMiddle = [];
            var dataMax = [];

            {//数据结构生成
                var seriesMinValue = 0;
                var seriesMiddleValue = 0;
                var seriesMaxValue = 0;
                for (var i = 0; i < checkDataSeries.length; i++) {
                    var obj = checkDataSeries[i];

                    obj.Data = GetData(obj); //获取模拟数据
                    Agi.Controls.CustomNPChart.MinMaxLineData(obj,dataMin,true,"min",i);
                    if (i != checkDataSeries.length - 1) dataMin.push(null);

//                    dataMiddle.push([obj.min, obj.middleValue]);
//                    dataMiddle.push([obj.max, obj.middleValue]);
                    Agi.Controls.CustomNPChart.MinMaxLineData(obj,dataMiddle,false,"midd",i)
                    if (i != checkDataSeries.length - 1) dataMiddle.push(null);

                    //判断并填充上下标准线的Series 点
                    Agi.Controls.CustomNPChart.MinMaxLineData(obj,dataMax,false,"max",i);
                    if (i != checkDataSeries.length - 1) dataMax.push(null);

                    if (i === checkDataSeries.length - 1) {
                        seriesMinValue = obj.minValue[obj.minValue.length-1];
                        seriesMiddleValue = obj.middleValue[obj.middleValue.length-1];
                        seriesMaxValue = obj.maxValue[obj.maxValue.length-1];

                        cp.yAxis_TickPositions.push(seriesMinValue);
                        cp.yAxis_TickPositions.push(seriesMiddleValue);
                        cp.yAxis_TickPositions.push(seriesMaxValue);
                    }
                    cp.yAxis_PlotLines_Max = cp.yAxis_PlotLines_Max > obj.maxValue[obj.maxValue.length-1] ? cp.yAxis_PlotLines_Max : obj.maxValue[obj.maxValue.length-1];
                    cp.yAxis_PlotLines_Min = cp.yAxis_PlotLines_Min < obj.minValue[obj.minValue.length-1] ? cp.yAxis_PlotLines_Min : obj.minValue[obj.minValue.length-1];
                }
                this.Set('SeriesMinValue', seriesMinValue);
                this.Set('SeriesMiddleValue', seriesMiddleValue);
                this.Set('SeriesMaxValue', seriesMaxValue);
                function GetData(objValue) {
                    var objData = [];
                    if(objValue.minValue.length>1){
                        var minValue =0;
                        var maxValue =0;
                        for (var i =0; i <objValue.Data.length; i++) {
                            minValue=objValue.minValue[i];
                            maxValue=objValue.maxValue[i];
                            var x = objValue.min+i;
                            var y = objValue.Data[i];
                            if (y > maxValue)
                                y = { x: x, y: y, marker: { fillColor: cp.yAxis_PlotLines_MaxMarkerColor} };
                            else if (y < minValue)
                                y = { x: x, y: y, marker: { fillColor: cp.yAxis_PlotLines_MinMarkerColor} };
                            else
                                y = { x: x, y: y, marker: { fillColor: cp.series_PointMarkerColor} }
                            objData.push(y);
                        }
                    }else{
                        var minValue = objValue.minValue[0];
                        var maxValue = objValue.maxValue[0];

                        for (var i = 0; i <objValue.Data.length; i++) {
                            var x = objValue.min + i;
                            var y = objValue.Data[i];
                            if (y > maxValue)
                                y = { x: x, y: y, marker: { fillColor: cp.yAxis_PlotLines_MaxMarkerColor} };
                            else if (y < minValue)
                                y = { x: x, y: y, marker: { fillColor: cp.yAxis_PlotLines_MinMarkerColor} };
                            else
                                y = { x: x, y: y, marker: { fillColor: cp.series_PointMarkerColor} }
                            objData.push(y);
                        }
                    }
                    return objData;
                }
            }
            {//生成数据
                var seriesData = [];
                for (var i = 0; i < checkDataSeries.length; i++) {
                    var obj = checkDataSeries[i];
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
                    chartSeries.push({
                        name: "min",
                        data: dataMin,
                        type:'line',
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
                        type:'line',
                        data: dataMax,
                        color: cp.yAxis_PlotLines_MaxMarkerColor,
                        lineWidth: cp.series_MaxPlotLine_LineWidth,
                        marker: {
                            enabled: false
                        }
                    });
                }

                chartSeries.push({
                    name: 'A',
                    data: seriesData,
                    color:cp.series_DataColor, //cp.series_DataColor,
                    lineWidth: cp.series_Data_LineWidth,
                    marker: {
                        color: cp.series_PointMarkerColor //cp.series_DataColor,
                    }
                });
                this.Set('ChartSeries', chartSeries);
            }
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
             var PointRow=_PointValue.x;
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var checkDataSeries = this.Get('CheckDataSeries');
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:Agi.Controls.CustomNPChart.FindDataRowsByPoint(checkDataSeries,PointRow)//所选的异常点
            };
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
        InitHighChart: function () {//初始化图形控件
            var Me=this;
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
//                    min: cp.yAxis_Min,
//                    max: cp.yAxis_Max,
                    gridLineWidth: cp.yAxis_GridLineWidth,
//                    tickInterval: yValue,
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
                var chart;
                var ChartOptions={
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
//                                            //endregion  markeluo 20130821 0846 markeluo 点击Chart Point菜单处理 #end
//                                        }
//                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        enabled: cp.tooltip_enabled,
                        formatter: function () {
                            if (this.series.name === "min")
                                return '<b>' + cp.series_MinPlotLine_Names + '='+this.y+'</b>';
                            if (this.series.name === "middle")
                                return '<b>' + cp.series_MiddlePlotLine_Names + '='+this.y+'</b>';
                            if (this.series.name === "max")
                                return '<b>' + cp.series_MaxPlotLine_Names + '='+this.y+ '</b>';
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
                            return this.x+' , <b>' + name + ': ' + this.y + '</b>';
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
                };

                chart = new Highcharts.Chart(ChartOptions);
                ChartOptions=null;
                this.Set('chart', chart);
                this.chart = chart;
            }

//            this.UpPlotLineGroups([
//                {GroupName:"标准线1",MaxSize:1,MaxColor:'#04faf7',MaxValueType:0,MaxValue:32000,MinSize:1,MinColor:'#fa0df2',MinValueType:0,MinValue:25000,MaxReviseSig:上限修正符号,MaxReviseValue:上限修正值,MinReviseSig:下限修正符号,MinReviseValue:下限修正值},
//                {GroupName:"标准线2",MaxSize:1,MaxColor:'#04fe45',MaxValueType:0,MaxValue:29000,MinSize:1,MinColor:'#fbf806',MinValueType:0,MinValue:25800, MaxReviseSig:上限修正符号,MaxReviseValue:上限修正值,MinReviseSig:下限修正符号,MinReviseValue:下限修正值}]);//添加标准线
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
            Agi.Controls.CustomNPChartProrityInit(this);
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
            Agi.Controls.CustomNPChartAttributeChange(this, Key, _Value);
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
            viewmenus.push({Title: "图形选项", MenuImg: "ViewMenuImages/viewmenu_Abnormal.png", CallbackFun: Me.SPCViewChartSetting});
            viewmenus.push({Title: "标准线设置", MenuImg: "ViewMenuImages/viewmenu_Standline.png", CallbackFun: Me.SPCViewStandLineMenu});
            viewmenus.push({Title: "西格玛判异", MenuImg: "ViewMenuImages/viewmenu_sigma.png", CallbackFun: Me.SPCViewSigmaMenu});
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
            Agi.Controls.CustomNPChartView_StandLinesMenu(_Panel, Me);
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
            Agi.Controls.CustomNPChartView_SigmaMenu(_Panel, Me);
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
            Agi.Controls.CustomNPChartView_ExtractMenu(_Panel, Me);
            _CallFun();
        },//SPC控件View，数据钻取
        SPCViewChartSetting:function(_Panel,_CallFun){
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 380,
                height: "auto",
                right: -400
            }).find(".title").text("图形选项");
            $(_Panel).find(".content").height(200);
            Agi.Controls.CustomNPChartView_ChartSetMenu(_Panel, Me);
            _CallFun();
        },//图形选项
        GetSPCViewGridData:function(){
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:[]//所选的异常点
            };
            return GridData;
        },//SPC控件支持View框架，控件显示源数据
        SPCViewRefreshByGridData:function(_GridData){
            var Me=this;
            Me.Set("FilterData",_GridData);
            Me.Set("IsShowLastChart",true);

            Me.RefreshByProPanelUp();//更新显示
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

            Me.Set("LastChartImgIsExt",false);

            Me.RefreshByProPanelUp();//更新显示
        },//SPC控件支持View框架，还原至原始数据
        SPCViewDataExtractURLGet:function(RowData){
            return this.Get("ExtractConfig");//数据钻取配置信息
        }//数据钻取URL获取，需传入行数据
    },true);

/*下拉列表控件参数更改处理方法*/
Agi.Controls.CustomNPChartAttributeChange = function (_ControlObj, Key, _Value) {
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
Agi.Controls.InitCustomNPChart = function () {
    return new Agi.Controls.CustomNPChart();
}

Agi.Controls.CustomNPChartProrityInit = function (_BasicChart) {
    var Me = _BasicChart;
    //取得默认属性
    var cp = Me.Get('ChartProperty');
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ChartDataSeries=Me.GetDataSeries();//图表曲线集合，不包含基准线和西格玛线

    var ThisProItems = [];
    //1.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    {
        var ItemContent ="";

        //4.基本属性设置

        //region 4.1.数据曲线
        ItemContent=$("<div id='CSChartDataLine'></div>")
        Agi.Controls.CustomNPChartView_ChartSetMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据曲线", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.2.背景设置
        ItemContent = null;
        ItemContent=$("<div id='CSChartBackgroundPanel'></div>");
        Agi.Controls.CustomNPChartView_BackgroundSetMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "背景设置", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.2.标准线
        ItemContent = null;
        ItemContent=$("<div id='CSChartStandLine'></div>");
        Agi.Controls.CustomNPChartView_StandLinesMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标准线", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

        //region 4.3.西格玛判异规则
        ItemContent = null;
        ItemContent=$("<div id='CSChartSigMa'></div>");
        Agi.Controls.CustomNPChartView_SigmaMenu(ItemContent,Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "西格玛判异规则", DisabledValue: 1, ContentObj: ItemContent }));
        //endregion

//        //region 4.4.数据钻取设置
//        ItemContent = null;
//        ItemContent=$("<div id='CSChartExtract'></div>");
//        Agi.Controls.CustomNPChartView_ExtractMenu(ItemContent,Me);
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
Agi.Controls.CustomNPChartFormatPlotGrpPars=function(_Entity,_PlotGrp){
    var PlotArray=null;
    //_PlotGrp: {GroupName:"标准线1",MaxSize:1,MaxColor:'red',MaxValueType:0,MaxValue:3000,MinSize:1,MinColor:'red',MinValueType:0,MinValue:3000, MaxReviseSig:上限修正符号,MaxReviseValue:上限修正值,MinReviseSig:下限修正符号,MinReviseValue:下限修正值，MaxValueEnable:上限是否可用,MinValueEnable:下线是否可用}
    if(_PlotGrp!=null){
        PlotArray=[];
        var MaxValue=0,MinValue=0;
        _PlotGrp.MaxValueType=parseInt(_PlotGrp.MaxValueType);
        _PlotGrp.MinValueType=parseInt(_PlotGrp.MinValueType);
        var maxcolumn=null;
        var mincolumn=null;
        if(_PlotGrp.MaxValueType==0){
            MaxValue=parseFloat(_PlotGrp.MaxValue);
        }else{
            maxcolumn=_PlotGrp.MaxValue;
            if(_Entity.Data.length>0){
                MaxValue=parseFloat(_Entity.Data[0][_PlotGrp.MaxValue]);
            }else{
                MaxValue=0;
            }

            if(_PlotGrp.MaxReviseValue!=null && _PlotGrp.MaxReviseValue!=""){
                var valuetemp=null;
                try{
                    valuetemp=parseFloat(eval('MaxValue'+_PlotGrp.MaxReviseSig+_PlotGrp.MaxReviseValue));
                    MaxValue=valuetemp;
                }catch(ex){
                }
            }
        }
        if(_PlotGrp.MinValueType==0){
            MinValue=parseFloat(_PlotGrp.MinValue);
        }else{
            mincolumn=_PlotGrp.MinValue;
            if(_Entity.Data.length>0){
                MinValue=parseFloat(_Entity.Data[0][_PlotGrp.MinValue]);
            }else{
                MinValue=0;
            }
            if(_PlotGrp.MinReviseValue!=null && _PlotGrp.MinReviseValue!=""){
                var valuetemp=null;
                try{
                    valuetemp=parseFloat(eval('MinValue'+_PlotGrp.MinReviseSig+_PlotGrp.MinReviseValue));
                    MinValue=valuetemp;
                }catch(ex){
                }
            }
        }
        PlotArray.push({value:MaxValue,columnName:maxcolumn,dashStyle:'solid',color:_PlotGrp.MaxColor,width:_PlotGrp.MaxSize,id:_PlotGrp.GroupName+"_MAX",zIndex: 5,Enable:_PlotGrp.MaxValueEnable});
        PlotArray.push({value:MinValue,columnName:mincolumn,dashStyle:'solid',color:_PlotGrp.MinColor,width:_PlotGrp.MinSize,id:_PlotGrp.GroupName+"_MIN",zIndex: 5,Enable:_PlotGrp.MinValueEnable});
        MaxValue=MinValue=null;
    }
    return PlotArray;
}
//2.根据标准线数组值，更新Series中相关Point点的颜色
Agi.Controls.CustomNPChartPlotLineUpSeries=function(_SeriesArrar,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
//    var DataSeriesArray=Agi.Controls.CustomNPChartGetDataSries(_SeriesArrar);
    if(_SeriesArrar!=null && _SeriesArrar.length>0){
        for(var i=0;i<_SeriesArrar.length;i++){
            Agi.Controls.CustomNPChartPlotLineUpPoint(_SeriesArrar[i],_PlotLines);
        }
    }
}
Agi.Controls.CustomNPChartGetDataSries=function(_SeriesArrar,_IsDataSeries){
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
Agi.Controls.CustomNPChartPlotLineUpPoint=function(_Series,_PlotLines){
    //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
    if(_Series!=null && _Series.data!=null && _Series.data.length>0){
        var PointColor=null;
        for(var i=0;i<_Series.data.length;i++){
            PointColor=Agi.Controls.CustomNPChartPlotLineGetPointColor(_Series.data[i].y,_PlotLines);
            if(PointColor!=null){
                _Series.data[i].marker={fillColor:PointColor};
            }
        }
    }
}
//4.根据标准线组获取对应的point点颜色,如为null则对应的point点颜色不更改
Agi.Controls.CustomNPChartPlotLineGetPointColor=function(_Value,_PlotLines){
    var PointColor=null;
    if(_PlotLines!=null && _PlotLines.length>0){
        var MaxLines=[];
        var MinLines=[];
        for(var i=0;i<_PlotLines.length;i++){
            if(_PlotLines[i].Items!=null && _PlotLines[i].Items.length>0){
                for(var j=0;j<_PlotLines[i].Items.length;j++){
                    if(_PlotLines[i].Items[j].Enable){
                        if(_PlotLines[i].Items[j].id.substr(_PlotLines[i].Items[j].id.length-4)=="_MAX"){
                            MaxLines.push(_PlotLines[i].Items[j]);
                        }else{
                            MinLines.push(_PlotLines[i].Items[j]);
                        }
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
Agi.Controls.CustomNPChartAlarmStatistical=function(_ALLSeries,_PlotLines){
    var AlarmStatisticaldata={PlotLines:[],SGM:{AlarmSum:0,Percentage:0,MaxObj:{AlarmSum:0,Percentage:0,Item:[]},MinObj:{AlarmSum:0,Percentage:0,Item:[]}}};
    var _Series=Agi.Controls.CustomNPChartGetDataSries(_ALLSeries);//获得对应的的数据Series
    var _ScmSeries=Agi.Controls.CustomNPChartGetDataSries(_ALLSeries,false);//获得对应的的西格玛线Series

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
                Agi.Controls.CustomNPChartAlarmStatisticalByData(j,_Series[i].data[j].y,AlarmStatisticaldata,SumPointNum);//统计标准线所在比例信息
            }
        }
    }
    return AlarmStatisticaldata;
}

Agi.Controls.CustomNPChartAlarmStatisticalByData=function(_index,_PointValue,_AlarmStatisticaldata,SumPointNum){
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
Agi.Controls.CustomNPChartAlarmStatisticalPanelShow=function(_AlarmStatisticaldata,_ApendToPanel){
    if($("#CustomNPChartAlarmPanel").length>0){
        $("#CustomNPChartAlarmPanel").html("");
    }else{
        var CustomNPChartAlarmPanelHTML=$("<div id='CustomNPChartAlarmPanel' class='AlarmSty'></div>").appendTo($(_ApendToPanel));
        $("#CustomNPChartAlarmPanel").css({"right":"8px","top":"8px"});
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
    $("#CustomNPChartAlarmPanel").append(SubItemHTML);
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
//2.图形选项
Agi.Controls.CustomNPChartView_ChartSetMenu=function(_Panel,_Control){
    var Me=_Control;
    //3.1.初始化数据准备
    var ChartEntity=Me.Get("Entity")[0];
    var cp=Me.Get("ChartProperty");//获取属性
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ChartDataSeries=Me.GetDataSeries();//图表曲线集合，不包含基准线和西格玛线

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/CustomNPChart/tabTemplates.html #tab-1', function () {
        $(this).find("#CustNPdataColor").spectrum({
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
        $(this).find("#CustNPmarkerColor").spectrum({
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

        $("input[name='NP_SubGrp']").unbind().bind("click",function(ev){
            var ThisSelectedType=$("input[name=NP_SubGrp]:checked").attr("value");
            if(ThisSelectedType==0){
                $("#NP_SubGrpColumns").hide();
                $("#XMRChart_RGroupSize").show();
            }else{
                $("#NP_SubGrpColumns").show();
                $("#XMRChart_RGroupSize").hide();
            }
        });

        //默认选中
        $(this).find("#CustNPdataColor").spectrum("set","#d2d2d2");
        $(this).find("#CustNPmarkerColor").spectrum("set","#4572A7");
        if(cp.series_DataColor!=null && cp.series_PointMarkerColor!=null){
            $(this).find("#CustNPdataColor").spectrum("set",cp.series_DataColor);
            $(this).find('#CustNPmarkerColor').spectrum("set",cp.series_PointMarkerColor);
        }
        //分组列和数据列绑定
        var GroupColumns=$(this).find('#CustNPGrpColumn');
        var DataColumns=$(this).find('#CustNPDataColumn');
        var SubGroupColumns=$(this).find('#NP_SubGrpColumns');
        GroupColumns.empty();
        DataColumns.empty();
        SubGroupColumns.empty();

        GroupColumns.append("<option value=''></option>");//填充空字段列
        for(var i=0;i<ChartEntityColumns.length;i++) {
            var option ="<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>";
            GroupColumns.append(option);
            DataColumns.append(option);
            SubGroupColumns.append(option);
        }

        if(cp.SeriesGroupColumn && cp.SeriesDataColumn!=null){
        }else{
            if(cp.SeriesGroupColumn==null){
                cp.SeriesGroupColumn=$($("#CustNPGrpColumn").children()[0]).val();
            }
            if(cp.SeriesDataColumn==null){
                cp.SeriesDataColumn=$($("#CustNPDataColumn").children()[0]).val();
            }
        }
        GroupColumns.find("option[value='"+cp.SeriesGroupColumn+"']").attr("selected","selected");
        DataColumns.find("option[value='"+cp.SeriesDataColumn+"']").attr("selected","selected");
        if(cp.chart_Data_NRow!=null && cp.chart_Data_NRow.Type==1){
            SubGroupColumns.find("option[value='"+cp.chart_Data_NRow.Value+"']").attr("selected","selected");
            $("#NP_SubGrp_1").attr("checked","checked");
            $("#XMRChart_RGroupSize").hide();
            $("#NP_SubGrpColumns").show();

        }else{
            $("#XMRChart_RGroupSize").val(cp.chart_Data_NRow.Value);
            $("#NP_SubGrpColumns").hide();
            $("#XMRChart_RGroupSize").show();

            $("#NP_SubGrp_0").attr("checked","checked");
            SubGroupColumns.find('option:eq(0)').attr('selected','selected');
        }

        var CustNPChartSeriesItems= $(this).find("#CustNPSeries").empty();
        if(ChartDataSeries!=null && ChartDataSeries.length>0){
            for(var i=0;i<ChartDataSeries.length;i++) {
                var option ="<option value='"+ChartDataSeries[i].name+"'>"+ChartDataSeries[i].name+"</option>";
                CustNPChartSeriesItems.append(option);
            }
            CustNPChartSeriesItems.find("option[value='"+ChartDataSeries[0].name+"']").attr("selected","selected");
        }

        //保存处理
        $(this).find("#CustNPSeriesSave").unbind().bind("click",function(ev){
            var CustNPChartSeriesObj={
                SeriesName:$("#CustNPSeries").val(),
                GroupColumn:$("#CustNPGrpColumn").val(),
                DataColumn:$("#CustNPDataColumn").val(),
                SeriesColor:$("#CustNPdataColor").val(),
                SeriesMarkerColor:$("#CustNPmarkerColor").val(),
                GroupSize:{
                    Type:0,//类型
                    Value:$("#XMRChart_RGroupSize").val()
                }//分组大小
            }
            if($("#NP_SubGrp_0").is(":checked")){}else{
                CustNPChartSeriesObj.GroupSize.Type=1;
                CustNPChartSeriesObj.GroupSize.Value=$("#NP_SubGrpColumns").val();
            }
            Me.UpSeriesBindInfo(CustNPChartSeriesObj);//更新Series 设置
            Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
        });
    });

}
//3.在View环境中显示标准线设置菜单项
Agi.Controls.CustomNPChartView_StandLinesMenu=function(_Panel,_Control){
    var Me=_Control;
    //3.1.初始化数据准备
    var ChartEntity=Me.Get("Entity")[0];
    var cp=Me.Get("ChartProperty");//获取属性
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    var ThisChartStandLines=Me.Get("NoFormatPlotLines");
    if(ThisChartStandLines!=null){
    }else{
        ThisChartStandLines=[{GroupName:"",MaxSize:1, MaxColor:"#ff0000",MaxValueType:"0", MaxValueEnable:false, MaxValue:"",
            MinSize:1,MinColor:"#ff0000",MinValueType:"0",MinValueEnable:false,MinValue:"",
            MaxReviseSig:null,MaxReviseValue:null,MinReviseSig:null,MinReviseValue:null}];
    }

    //3.2.加载标准线设置菜单
    ItemContentPanel.load('js/Controls/CustomNPChart/tabTemplates.html #tab-2', function () {
        //0.控件当前值获取
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

        //2.保存按钮
        $(this).find("#btnSaveGrp").click(function(){
            var SelectedItemObj=null;
            var line={
                GroupName:$("#CustNPStLinename").attr('value'),
                MaxSize:$("#topWidth").val(),
                MaxColor:$("#topColor").attr('value')==""?"#000":$("#topColor").attr('value'),
                MaxValueType:"0",
                MaxValueEnable:$("#CustmaxEnable").is(":checked"),
                MaxValue:parseFloat($("#topValue1").val()),
                MinSize:$("#bottomWidth").val(),
                MinColor:$("#bottomColor").attr('value')==""?"#000":$("#bottomColor").attr('value'),
                MinValueType:"0",
                MinValueEnable:$("#CustminEnable").is(":checked"),
                MinValue:parseFloat($("#bottomValue1").val()),
                MaxReviseSig:null,//上限修正符号
                MaxReviseValue:null,//上限修正值
                MinReviseSig:null,//下限修正符号
                MinReviseValue:null//下限修正值
            };
            //添加到数组
            ThisChartStandLines=[line];
            cp=Me.Get("ChartProperty");//获取属性
            cp.ChartisigmaValue=$("#NPChart_BZSize").val();
            Me.Set("ChartProperty",cp);//保存属性设置

            Me.UpPlotLineGroups(ThisChartStandLines);//更新标准线显示
            Me.RefreshByProPanelUp();//刷新图形显示
        });

        //3.3.初始化
        if(ThisChartStandLines!=null && ThisChartStandLines.length>0){
            $("#NPChart_BZSize").val(cp.ChartisigmaValue);
            $("#topValue1").val(ThisChartStandLines[0].MaxValue);
            $("#topWidth").val(ThisChartStandLines[0].MaxSize);
            $("#topColor").spectrum("set",ThisChartStandLines[0].MaxColor);
            $("#bottomValue1").val(ThisChartStandLines[0].MinValue);
            $("#bottomWidth").val(ThisChartStandLines[0].MinSize);
            $("#bottomColor").spectrum("set",ThisChartStandLines[0].MinColor);
            if(ThisChartStandLines[0].MaxValueEnable){
                $("#CustmaxEnable").attr("checked","checked");
                $("#topValue1").removeAttr("disabled");
            }else{
                $("#CustmaxEnable").removeAttr("checked");
                $("#topValue1").attr("disabled","disabled");
            }
            if(ThisChartStandLines[0].MinValueEnable){
                $("#CustminEnable").attr("checked","checked");
                $("#bottomValue1").removeAttr("disabled");
            }else{
                $("#CustminEnable").removeAttr("checked");
                $("#bottomValue1").attr("disabled","disabled");
            }
        }
        $("#CustmaxEnable").unbind().bind("click",function(ev){
            if($(this).is(":checked")){
                $("#topValue1").removeAttr("disabled");
            }else{
                $("#topValue1").attr("disabled","disabled");
            }
        });
        $("#CustminEnable").unbind().bind("click",function(ev){
            if($(this).is(":checked")){
                $("#bottomValue1").removeAttr("disabled");
            }else{
                $("#bottomValue1").attr("disabled","disabled");
            }
        });
    });
}

//4.在View环境中显示西格玛判异菜单项
Agi.Controls.CustomNPChartView_SigmaMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('js/Controls/CustomNPChart/tabTemplates.html #tab-3', function () {
        var THisChartSigmaRules=Me.Get("Sigmrules");//获取八项判异规则
        //1.八项规则保存
        $(this).find("#CustNPSigMaRuleSave").unbind().bind("click",function(ev){
            var rule=[];
            var ruleitem=null;
            for(i=1;i<=4;i++)
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
			//20140303 倪飘 8项判异规则的默认颜色更改为红色
			$('#Kcolor1').spectrum("set",'#f00');
			$('#Kcolor2').spectrum("set",'#f00');
			$('#Kcolor3').spectrum("set",'#f00');
			$('#Kcolor4').spectrum("set",'#f00');
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
//endreigon
//6.数据钻取设置
Agi.Controls.CustomNPChartView_ExtractMenu=function(_Panel,_Control){
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
    ItemContentPanel.load('js/Controls/CustomNPChart/tabTemplates.html #tab-4', function () {
        //0.默认选项隐藏
        $("#CustomNPParCancel").hide();
        $("#CustomNPNewParsTxt").width(0).hide();

        //1.添加参数
        $(this).find('#CustomNPParAdd').click(function(){
            $(this).hide();
            $("#CustomNPParCancel").show();
            $("#CustomNPNewParsTxt").width(60).show();
            $("#CustomNPParsNames").hide();
        });
        //2.取消添加
        $(this).find('#CustomNPParCancel').click(function(){
            $("#CustomNPParCancel").hide();
            $("#CustomNPNewParsTxt").width(0).val("").hide();
            $("#CustomNPParsNames").show();
            $("#CustomNPParAdd").show();
        });
        //3.保存
        $(this).find('#CustomNPParSave').click(function(){
            var SCSTxtVisibly=!$("#CustomNPNewParsTxt").is(':hidden');
            var CusChartParsName="";
            var CusChartParsValue="";
            if(SCSTxtVisibly){
                //新增参数
                CusChartParsName=$("#CustomNPNewParsTxt").val();
                CusChartParsValue=$("#CustomNPParsValues").val();
            }else{
                //编辑参数
                CusChartParsName=$("#CustomNPParsNames").val();
                CusChartParsValue=$("#CustomNPParsValues").val();
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
                            $("#CustomNPParsNames").append("<option value='"+CusChartParsName+"'>"+CusChartParsName+"</option>");

                            $("#CustomNPParCancel").hide();
                            $("#CustomNPNewParsTxt").width(0).val("").hide();
                            $("#CustomNPParsNames").show();
                            $("#CustomNPParAdd").show();

                            $("#CustomNPParsNames").val(CusChartParsName);
                            //更新列表显示
                            Agi.Controls.CustomNPChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");

                            AgiCommonDialogBox.Alert("添加成功!");
                        }
                    }else{
                        ChartExtractConfig.Paras[i].Column=CusChartParsValue;
                        //更新列表显示
                        Agi.Controls.CustomNPChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
                        AgiCommonDialogBox.Alert("修改成功!");
                    }
                }else{
                    ChartExtractConfig.Paras.push({Name:CusChartParsName,Column:CusChartParsValue,Value:""});
                    $("#CustomNPParsNames").append("<option value='"+CusChartParsName+"'>"+CusChartParsName+"</option>");

                    $("#CustomNPParCancel").hide();
                    $("#CustomNPNewParsTxt").width(0).val("").hide();
                    $("#CustomNPParsNames").show();
                    $("#CustomNPParAdd").show();

                    $("#CustomNPParsNames").val(CusChartParsName);

                    //更新列表显示
                    Agi.Controls.CustomNPChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");

                    AgiCommonDialogBox.Alert("添加成功!");
                }

                Me.Set("ExtractConfig",ChartExtractConfig);//数据钻取配置信息保存
            }else{
                AgiCommonDialogBox.Alert("参数名称和绑定列不可为空!");
            }
        });
        //4.删除
        $(this).find('#CustomNPParDel').click(function(){
            var SCSTxtVisibly=!$("#CustomNPNewParsTxt").is(':hidden');
            if(SCSTxtVisibly){
                AgiCommonDialogBox.Alert("请取消或完成新增，选择已存在的参数名称后再试!");
            }else{
                //编辑参数
               var CusChartParsName=$("#CustomNPParsNames").val();
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
                        $("#CustomNPParsNames option[value='"+ChartExtractConfig.Paras[ParIndex].Name+"']").remove(); //删除Select中Value=''的Option

                        ChartExtractConfig.Paras.splice(ParIndex,1);
                        //更新列表显示
                        Agi.Controls.CustomNPChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
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
                    $("#CustNPExtractURL").html(strCustSigChartExtractURLoptions);
                    if(ChartExtractConfig!=null && ChartExtractConfig.URL!=null){
                        $("#CustNPExtractURL").find("[value='"+ChartExtractConfig.URL+"']").attr("selected","selected");
                    }
                }
            }
        })
        if(ChartExtractConfig.Paras!=null && ChartExtractConfig.Paras.length>0){
            for(var i=0;i<ChartExtractConfig.Paras.length;i++){
                $("#CustomNPParsNames").append("<option value='"+ChartExtractConfig.Paras[i].Name+"'>"+ChartExtractConfig.Paras[i].Name+"</option>");
            }
            DefaultParNameColumn=ChartExtractConfig.Paras[0].Column;
            $("#CustomNPParsNames").val(ChartExtractConfig.Paras[0].Name);

            //更新列表显示
            Agi.Controls.CustomNPChartParsListUpdate(ChartExtractConfig.Paras,"ParsListPanel");
        }else{
            $("#CustomNPParAdd").hide();
            $("#CustomNPParCancel").show();
            $("#CustomNPNewParsTxt").width(60).show();
            $("#CustomNPParsNames").hide();
        }
        if(ChartEntityColumns!=null && ChartEntityColumns.length>0){
            for(var i=0;i<ChartEntityColumns.length;i++){
                $("#CustomNPParsValues").append("<option value='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>");
            }
            if(DefaultParNameColumn!=null){
                $("#CustomNPParsValues").val(DefaultParNameColumn);
            }
        }
        //6.参数名称选中项更改
        $(this).find('#CustomNPParsNames').change(function(){
            var StrThisSelValue=$(this).val();
            var ThisParas=Me.Get("ExtractConfig").Paras;//数据钻取配置信息保存
            if(ThisParas!=null && ThisParas.length>0){
                for(var i=0;i<ThisParas.length;i++){
                    if(ThisParas[i].Name==StrThisSelValue){
                        $("#CustomNPParsValues").val(ThisParas[i].Column);
                        break;
                    }
                }
            }
        });
        //7.参数项&URL信息保存
        $(this).find('#CstNPExtractOptionSave').click(function(){
            var ThisExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息保存
            ThisExtractConfig.URL=$("#CustNPExtractURL").val();
            Me.Set("ExtractConfig",ThisExtractConfig);//数据钻取配置信息保存
            AgiCommonDialogBox.Alert("数据钻取配置信息保存成功!");
        });
    });
}
//7.背景设置
Agi.Controls.CustomNPChartView_BackgroundSetMenu=function(_Panel,_Control){
    var Me=_Control;
    //获取属性
    var cp = Me.Get('ChartProperty');

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('js/Controls/CustomNPChart/tabTemplates.html #tab-5', function () {
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

        $("#CustomNP_bgvalue").unbind().bind("click",function(){
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
        var ThisChartbgvalue=Agi.Controls.CustomNPChartBackgroundValueGet(cp.ChartBackConfig.backgroundColor);
        $("#CustomNP_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项
        // backgroundColor//背景 ,Tolbtnbackground,//菜单按钮背景,TolbtnFontColor,//菜单按钮字体,TolTabbackground,//统计表格背景,TolTabFontColor//统计表格字体
        $("#CustomNP_Tolbgvalue").spectrum("set",cp.ChartBackConfig.Tolbtnbackground);
        $("#CustomNP_Tolbtncolor").spectrum("set",cp.ChartBackConfig.TolbtnFontColor);
        $("#CustomNP_TolTabbg").spectrum("set",cp.ChartBackConfig.TolTabbackground);
        $("#CustomNP_TolTabfontbg").spectrum("set",cp.ChartBackConfig.TolTabFontColor);

        $("#CustomNP_BackgroundSave").unbind().bind("click",function(){
            var color=$("#CustomNP_bgvalue").data('colorValue');
            var BgColorValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
            var BackgroudObj={
                BolIsTransfor:BgColorValue.BolIsTransfor,//是否透明
                StartColor:BgColorValue.StartColor,//开始颜色
                EndColor:BgColorValue.EndColor,//结束颜色
                GradualChangeType:BgColorValue.GradualChangeType,//渐变方式
                Tolbtnbackground:null,//统计信息按钮背景
                TolbtnFontColor:null,//统计信息按钮字体颜色
                TolTabbackground:null,//统计信息表格背景
                TolTabFontColor:null//统计信息表格字体颜色
            }
            Agi.Controls.CustomNPChart.BackgroundApply(Me,BackgroudObj);//背景应用
            Me.RefreshByProPanelUp();//更新属性后，刷新图形显示
        })
    });
}
//endegion

//region 编辑数据
//显示单值图数据钻取参数列表
Agi.Controls.CustomNPChartParsListUpdate=function(_Paras,_ListPanelID){
    var StrListItems="";
    if(_Paras!=null && _Paras.length>0){
        for(var i=0;i<_Paras.length;i++){
            StrListItems+=" <div class='ParsListHeadSty'><div class='CustomNPParsListCellSty'>"+_Paras[i].Name+"</div><div class='CustomNPParsListCellSty'>"+_Paras[i].Column+"</div></div>";
        }
    }
    $("#"+_ListPanelID).html(StrListItems);
}
//endregion
//region 背景设置
Agi.Controls.CustomNPChartBackgroundValueGet=function(_oBackgroundObj){
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
Agi.Controls.CustomNPChart.BackgroundApply=function(_ControlObj,_BackGroudObj){
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
Agi.Controls.CustomNPChart.FindDataRowsByPoint=function(_checkDataSeries,_PointX){
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

//region 20131125 根据计算得出的上下限组织上下限线条Series 数据
Agi.Controls.CustomNPChart.MinMaxLineData=function(_ThischeckSeriesObj,_MinMaxData,_IsMin,_linetype,_index){
    if(_ThischeckSeriesObj.minValue.length>1){
        var stepIndex1=0;
        var stepIndex2=0;
        for(var i=0;i<_ThischeckSeriesObj.Data.length;i++){
            if(_ThischeckSeriesObj.Data[i].x>0){
                if(_index!=0){
                    if(i==0){
                        stepIndex1=_ThischeckSeriesObj.Data[i].x;
                        stepIndex2=_ThischeckSeriesObj.Data[i].x+0.5;
                    }else{
                        if(i==(_ThischeckSeriesObj.Data.length-1)){
                            stepIndex1=_ThischeckSeriesObj.Data[i].x-0.5;
                            stepIndex2=_ThischeckSeriesObj.Data[i].x;
                        }else{
                            stepIndex1=_ThischeckSeriesObj.Data[i].x-0.5;
                            stepIndex2=_ThischeckSeriesObj.Data[i].x+0.5;
                        }
                    }
                }else{
                    if(i==(_ThischeckSeriesObj.Data.length-1)){
                        stepIndex1=_ThischeckSeriesObj.Data[i].x-0.5;
                        stepIndex2=_ThischeckSeriesObj.Data[i].x+1;
                    }else{
                        stepIndex1=_ThischeckSeriesObj.Data[i].x;
                        stepIndex2=_ThischeckSeriesObj.Data[i].x+0.5;
                    }
                }

            }else{
                stepIndex1=0;
                stepIndex2=0.5;
            }
            switch(_linetype){
                case "min":
                    _MinMaxData.push([stepIndex1, _ThischeckSeriesObj.minValue[i]]);
                    _MinMaxData.push([stepIndex2, _ThischeckSeriesObj.minValue[i]]);
                   break;
                case "max":
                    _MinMaxData.push([stepIndex1, _ThischeckSeriesObj.maxValue[i]]);
                    _MinMaxData.push([stepIndex2, _ThischeckSeriesObj.maxValue[i]]);
                    break;
                case "midd":
                    _MinMaxData.push([stepIndex1, _ThischeckSeriesObj.middleValue[i]]);
                    _MinMaxData.push([stepIndex2, _ThischeckSeriesObj.middleValue[i]]);
                    break;
                default:
                    break;
            }
        }
    }else{
        switch(_linetype){
            case "min":
                _MinMaxData.push([_ThischeckSeriesObj.min, _ThischeckSeriesObj.minValue[0]]);
                _MinMaxData.push([_ThischeckSeriesObj.max, _ThischeckSeriesObj.minValue[0]]);
                break;
            case "max":
                _MinMaxData.push([_ThischeckSeriesObj.min, _ThischeckSeriesObj.maxValue[0]]);
                _MinMaxData.push([_ThischeckSeriesObj.max, _ThischeckSeriesObj.maxValue[0]]);
                break;
            case "midd":
                _MinMaxData.push([_ThischeckSeriesObj.min, _ThischeckSeriesObj.middleValue[0]]);
                _MinMaxData.push([_ThischeckSeriesObj.max, _ThischeckSeriesObj.middleValue[0]]);
                break;
            default:
                break;
        }
    }
}

//曲线Series 计算
Agi.Controls.CustomNPChart.SeriesDataCal=function(_DataArray,_GroupValue){
    var TempDataArray=[];
    if(_GroupValue.length>1){
        for(var i=0;i<_DataArray.length;i++){
            TempDataArray.push(parseFloat((_DataArray[i]/_GroupValue[i]).toFixed(3)));
        }
    }else{
        for(var i=0;i<_DataArray.length;i++){
            TempDataArray.push(parseFloat((_DataArray[i]/_GroupValue[0]).toFixed(3)));
        }
    }
    return TempDataArray;
}
//endregion