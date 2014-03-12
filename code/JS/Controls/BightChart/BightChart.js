/**
 * * BightChart 曲线图表控件
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.BightChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        Render: function (_Target) {
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            }
            else {
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
        },//将控件渲染到制定容器
        ReadData: function (_EntityInfo) {
            var Me = this;
            if (!_EntityInfo.IsShareEntity) {
                Agi.Utility.RequestData2(_EntityInfo, function (d) {
                    _EntityInfo.Data = d.Data;
                    _EntityInfo.Columns = d.Columns;
                    Me.IsBindNewData = false;
                    Me.AddEntity(_EntityInfo);
                    /*添加实体*/
                });
            }
            else {
                if (Me.IsFirstIn) {
                    for (var entity in Me.Get("Entity")) {
                        if (Me.Get("Entity")[entity].Key == _EntityInfo.Key) {
                            _EntityInfo = Me.Get("Entity")[entity];
                            break;
                        }
                    }
                    Me.IsFirstIn = false;
                } else {
                    if (_EntityInfo.Data != null && _EntityInfo.Data.length > 0) {
                        _EntityInfo.Columns.length = 0;
                        for (var _param in _EntityInfo.Data[0]) {
                            _EntityInfo.Columns.push(_param);
                        }
                    }
                }
                Me.AddEntity(_EntityInfo);
                /*添加实体*/
            }
        }, //控件对应实体的参数发生更改，通知控件重新加载实体数据(参数联动)
        AddEntity:function(_Entity){
            var Me=this;
            var Entity= Me.Get("Entity");
            Entity=[];
            Entity.push(_Entity);
            Me.Set("Entity",Entity);
            if(Entity[0].Data!=null &&Entity[0].Data.length>0){
                //筛选数据
                Me.Set("FilterData",Entity[0].Data);
                var chartoption=Me.Get("ChartOption");
                chartoption.DataType=Agi.Controls.BightChartGetDataType(Entity[0].Data[0]);
                if(chartoption.DataSeries!=null && chartoption.DataSeries.length>0){
                    chartoption.DataSeries[0].XColumn=Entity[0].Columns[0];
                    chartoption.DataSeries[0].YColumn=Entity[0].Columns[1];
                }else{
                    chartoption.DataSeries=[{Name:"数据",XColumn:Entity[0].Columns[0],YColumn:Entity[0].Columns[1],Type:"line",Color:"#62a6f6",MarkerColor:""}]
                }
                Me.Set("ChartOption",chartoption);
            }
            var ChartOption=Me.Get("ChartOption");
            if(ChartOption.PlotLines.yplotlines!=null && ChartOption.PlotLines.yplotlines.length>0){
                ChartOption.PlotLines.yplotlines=[];
                Me.Set("ChartOption",ChartOption);
            }
            Me.InitHighChart();//初始化图形显示

            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(Me); //更新实体数据显示
            }
        },//新增实体
        UpDateEntity: function (_callBackFun) {
            var Me = this;
            var MeEntitys = Me.Get("Entity");
            var ThisEntityLength = MeEntitys.length;
            if (MeEntitys != null && MeEntitys.length > 0) {
                Me.LoadALLEntityData(MeEntitys, 0,function () {
                    MeEntitys=Me.Get("Entity")
                    //筛选数据
                    Me.Set("FilterData",MeEntitys[0].Data);
                    _callBackFun();
                });
            } else {
                _callBackFun();
            }
        }, //更新实体数据，回调函数通知更新完成
        LoadALLEntityData:function(MeEntitys,thisindex,_callBackFun){
            var Me=this;
            if(thisindex<MeEntitys.length){
                var THisEntity=MeEntitys[thisindex];
                if (!THisEntity.IsShareEntity) {
                    Agi.Utility.RequestData2(THisEntity, function (d) {
                        THisEntity.Data =d.Data;
                        THisEntity.Columns = d.Columns;
                        if (thisindex === (MeEntitys.length - 1)) {
                            _callBackFun();
                        } else {
                            Me.LoadALLEntityData(MeEntitys, (thisindex + 1),_callBackFun);
                        }
                    });
                }
                else {
                    if (thisindex === (MeEntitys.length - 1)) {
                        _callBackFun();
                    } else {
                        Agi.Controls.BasicChart.LoadALLEntityData(MeEntitys, (thisindex + 1),_callBackFun);
                    }
                }
            }
        },//加载所有实体数据
        ReadRealData: function (_Entity) {
        },//实时控件：收到实时数据接口方法
        ParameterChange: function (_ParameterInfo) {
            var Me = this;
            var entity =[];
            var _EntityInfo= Me.Get("Entity")[0];
            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                _EntityInfo.Data=d.Data;
                if(d.Columns!=null && d.Columns.length>0){
                    _EntityInfo.Columns = d.Columns;
                }
                Me.AddEntity(_EntityInfo); /*添加实体*/
            });
        },//参数联动，通知当前控件实体参数已更改
        //摘要：
        //      首次加载
        //参数：
        //      _Target：显示容器
        //      _ShowPosition：控件坐标定位
        //      savedId：标示 创建 或 加载
        Init: function (_Target, _ShowPosition, savedId) {

            var self = this;
            self.AttributeList = [];
            self.Set("Entity", []);
            self.Set("ControlType", "BightChart");

            //判断创建或加载，创建重新产生一个GUID
            var ID = savedId ? savedId : "BightChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty SPCPanelSty'></div>");
            HTMLElementPanel.css('padding-bottom', '0px');
            //保存当前控件对象
            var ThisProPerty = {
                ID: ID,
                BasciObj: null
            };
            self.Set("ProPerty", ThisProPerty);
            self.shell = new Agi.Controls.Shell(
                {
                    ID: ID,
                    width: 500,
                    height: 350,
                    divPanel: HTMLElementPanel
                });
            var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:100%;margin: 0 auto">' + '</div>');
            self.shell.initialControl(BaseControlObj[0]);

            self.Set("HTMLElement", HTMLElementPanel[0]);

            //将控件渲染到制定容器
            self.Render(_Target);

            //region 容器双击事件
            HTMLElementPanel.dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit && Agi.Edit) {
                    Agi.Controls.ControlEdit(self); //控件编辑界面
                }
            });


            //触发控件选中
            $('#' + self.shell.ID).mousedown(function (ev) {
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            //endregion

            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
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
            self.Set("Position", PostionValue);

            var ChartOption = {
                DataType:"date",//数据类型
                PlotLines:{xplotlines:[],yplotlines:[]},//标准线集合
                DataSeries:[{Name:"数据",XColumn:"",YColumn:"",Type:"line",Color:"#62a6f6",MarkerColor:""}],//数据曲线设置
                Characteristic:{
                    MAX:{Enable:false,Value:null},
                    MIN:{Enable:false,Value:null},
                    MEAN:{Enable:false,Value:null},
                    DEVIAT:{Enable:false,Value:null},
                    STED:{Enable:false,Value:null}
                }//特征值
            }
            self.Set("ChartOption", ChartOption);

            if(savedId==null){
                self.InitHighChart();
            }
        },
        Refresh: function () {
            this.InitHighChart();
        },//控件刷新显示
        Checked: function () {
            $('#' + this.shell.ID).css(
                {
                    "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                    "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
                }
            );
        },//被选中
        UnChecked: function () {
            $('#' + this.shell.ID).css(
                {
                    "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                    "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
                }
            );
        },//取消选中
        PostionChange: function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                var _ThisPosition =
                {
                    Left: (_Postion.Left / PagePars.Width).toFixed(4),
                    Top: (_Postion.Top / PagePars.Height).toFixed(4),
                    Right: (_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }
            else {
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
        },//控件的位置、大小发生更改
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
            } else {
                //移除拖拽、更改大小效果
                $("#" + Agi.Controls.EditControlElementID).draggable("destroy");
                $("#" + Agi.Controls.EditControlElementID).resizable("destroy");
                $("#" + Agi.Controls.EditControlElementID).removeClass("PanelSty");

                Me.Refresh();
            }
        },//外壳大小更改
        InEdit: function () {

        },// 进入编辑界面
        ExtEdit: function () {
        },//退出编辑界面
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.BightChartAttributeChange(_obj, Key, _Value);
        },//属性监听处理
        CustomProPanelShow: function () {
            Agi.Controls.BightChartProrityInit(this);
        },//加载自定义属性面板
        GetConfig: function () {
            var Me=this;
            var ProPerty = Me.Get("ProPerty");
            var SPCBightChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    ChartOption: null, //chart的属性
                    Position: null, //控件位置
                    DataExtractConfig:null//数据钻取配置
                }
            }
            SPCBightChartControl.Control.ControlType = Me.Get("ControlType");
            SPCBightChartControl.Control.ControlID = ProPerty.ID;
            SPCBightChartControl.Control.HTMLElement =ProPerty.ID;
            var Entitys = Me.Get("Entity");

            SPCBightChartControl.Control.Entity = Entitys;
            SPCBightChartControl.Control.ChartOption = Me.Get("ChartOption");
            SPCBightChartControl.Control.Position = Me.Get("Position");

            //SPC图相关特性
            //SPCBightChartControl.Control.DataExtractConfig=Me.Get("ExtractConfig");//数据钻取规则
            return SPCBightChartControl.Control;
        },//获取保存所需配置信息
        CreateControl: function (_Config, _Target) {
            var Me=this;
            Me.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                Me.Set("Position", _Config.Position);
                Me.Set("Entity",_Config.Entity);
                Me.Set("ChartOption",_Config.ChartOption);

                //更新实体数据
                Me.UpDateEntity(function(){
                    Me.InitHighChart();//初始化显示图形
                })
            }
        },//根据配置信息创建并渲染控件至指定容器
        SPCViewMenus: function () {
            var Me = this;
            var viewmenus = [];
            viewmenus.push({Title: "数据曲线设置", MenuImg: "ViewMenuImages/viewmenu_DataSeires.png", CallbackFun: Me.SPCViewDataSeriesMenu});
            viewmenus.push({Title: "水平标准线", MenuImg: "ViewMenuImages/viewmenu_Standline.png", CallbackFun: Me.SPCViewXStandLineMenu});
            viewmenus.push({Title: "垂直范围线", MenuImg: "ViewMenuImages/viewmenu_Standlinev.png", CallbackFun: Me.SPCViewYStandLineMenu});
            viewmenus.push({Title: "特征值", MenuImg: "ViewMenuImages/viewmenu_Abnormal.png", CallbackFun: Me.SPCViewCharacteristicMenu});
            //viewmenus.push({Title: "钻取页面配置", MenuImg: "ViewMenuImages/dataextract.png", CallbackFun: Me.SPCViewDataExtractMenu});
            return viewmenus;
        },//SPC控件支持View框架，控件菜单显示
        SPCViewDataSeriesMenu:function(_Panel,_CallFun){
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("数据曲线设置");
            $(_Panel).find(".content").height("auto");
            Agi.Controls.BightChartPropertyLine(_Panel, Me);
            _CallFun();
        },//数据曲线设置
        SPCViewXStandLineMenu:function(_Panel,_CallFun){
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("水平标准线");
            $(_Panel).find(".content").height("auto");
            Agi.Controls.BightChartPropertyXAxis(_Panel, Me);
            _CallFun();
        },//水平标准线设置
        SPCViewYStandLineMenu:function(_Panel,_CallFun){
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("垂直范围线");
            $(_Panel).find(".content").height("auto");
            Agi.Controls.BightChartPropertyYAxis(_Panel, Me);
            _CallFun();
        },//垂直标准线设置
        SPCViewCharacteristicMenu:function(_Panel,_CallFun){
            var Me = Agi.view.advance.currentControl;
            $(_Panel).css({
                width: 340,
                height: "auto",
                right: -350
            }).find(".title").text("特征值");
            $(_Panel).find(".content").height("auto");
            Agi.Controls.BightChartPropertyyCharacteristic(_Panel, Me);
            _CallFun();
        },//特征值设置
        GetSPCViewGridData:function(){
            var Me=this;
            var ChartOption=Me.Get("ChartOption");
            //DataSeries=[{Name:"数据",XColumn:"",YColumn:"",Type:"line",Color:"#62a6f6",MarkerColor:""}]
            var GridData={
                ChartData: Me.Get("FilterData"),//SPC控件对应的数据
                AlarmCells:[], //报警点信息
                AbnormalRows:[]//所选的异常点
            };

            var ThisDataSeries=Me.GetDataSeries();//获取当前曲线信息
            if(ThisDataSeries!=null && ThisDataSeries.length>0){
                for(var i=0;i<ThisDataSeries.length;i++){
                    Agi.Controls.BightChartAlarmDataPointsFind(GridData,ChartOption.DataSeries[i].YColumn,ThisDataSeries[i],ChartOption.DataSeries[i].Color);
                }
            }
            return GridData;
        },//获取SPCview表格数据
        SPCViewRefreshByGridData:function(_GridData){
            var Me=this;
            Me.Set("FilterData",_GridData);
            Me.InitHighChart();//更新显示
        },//SPC控件支持View框架，编辑源数据后更新控件显示
        SPCViewDataRestore:function(){
            var Me=this;
            var entity = Me.Get('Entity')[0];
            Me.Set("FilterData",entity.Data);
            Me.InitHighChart();//更新显示

            //调用View框架刷新数据表格显示
            Agi.view.advance.refreshGridData(Me.GetSPCViewGridData());
        },//SPC控件支持View框架，还原至原始数据
        /*--------------------以下为私有函数--------------------*/
        InitHighChart: function () {
            var Me = this;
            var model =
            {
                EntitysData: Me.Get("FilterData"),
                ChartOption: Me.Get("ChartOption"),
                HTMLPanelID: Me.Get("ProPerty").ID,
                seriesdata:[]
            };
            if (model.ChartOption.DataType != null) {
            }
            else {
                model.ChartOption.DataType = "date";
            }
            var ALLDataSeries=[];
            if (model.EntitysData != null && model.EntitysData.length>0) {
                var XcolumnName=null;
                var YcolumnName=null;
                var DataArray=null;
                model.seriesdata=[];
                for(var j=0;j<model.ChartOption.DataSeries.length;j++){
                    XcolumnName=model.ChartOption.DataSeries[j].XColumn;
                    YcolumnName=model.ChartOption.DataSeries[j].YColumn;
                    DataArray=[];
                    for (var i = 0; i < model.EntitysData.length; i++) {
                        if (model.ChartOption.DataType == "date") {
                            DataArray.push([Agi.Script.EntityDataFilterDateConvert(model.EntitysData[i][XcolumnName]),
                                eval(model.EntitysData[i][YcolumnName])]);
                        }
                        else {
                            DataArray.push([eval(model.EntitysData[i][XcolumnName]), eval(model.EntitysData[i][YcolumnName])]);
                        }
                    }
                    if(j==0){
                        model.seriesdata.push({name: "数据", data:DataArray,color:model.ChartOption.DataSeries[j].Color,
                            marker: {enabled: true, fillColor:null, radius: 2}});
                    }else{
                        model.seriesdata.push({name: "数据"+(i+1), data:DataArray,color:model.ChartOption.DataSeries[j].Color,
                            marker: {enabled: true, fillColor:null, radius: 2}});
                    }
                }
            }
            else {
                model.seriesdata =[{name: "数据", data:Agi.Controls.GetDemoData(200),color:"#62a6f6", marker: {enabled: true, fillColor:"#62a6f6", radius: 2}}];
            }

            var ChartInitoption = {
                chart: {
                    renderTo: model.HTMLPanelID,
                    style: {
                        zIndex: 0
                    },
                    type: 'line',
                    zoomType: "x",
                    reflow: true,
                    marginTop:20,
                    marginRight:20,
                    plotBorderWidth:1,
                    plotBorderColor:"#dcdcdc",
                    events: {
                        redraw: function () {//重画
                            //console.log("重画");
                            Agi.Controls.BightChartLineMenuRefreshPostion(this);
                            Agi.Controls.BightChartUpPointColorByXLine(Me);
//                            Me.Private_PlotLinesClear();
//                            Me.Private_PlotLineShow();//显示所有标准线
//                            Me.RefreshCharacteristicShow();//显示特征值
                        },
                        selection: function (event) {//选中范围更改
//                            if (event.xAxis != null) {
//                                // log the min and max of the primary, datetime x-axis
//                                //console.log(Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].min),Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].max));
//                                var ChartOption=Me.Get("ChartOption");
//                                if(ChartOption.PlotLines.yplotlines!=null && ChartOption.PlotLines.yplotlines.length>0){
//                                    ChartOption.PlotLines.yplotlines[0].value=event.xAxis[0].min;
//                                    ChartOption.PlotLines.yplotlines[1].value=event.xAxis[0].max;
//                                }else{
//                                    ChartOption.PlotLines.yplotlines=[];
//                                    ChartOption.PlotLines.yplotlines.push({id:"开始位置",value:event.xAxis[0].min,width:1,color:"red",dashstyle:"Solid",zindex:5});
//                                    ChartOption.PlotLines.yplotlines.push({id:"结束位置",value:event.xAxis[0].max,width:1,color:"red",dashstyle:"Solid",zindex:5});
//                                }
//                                Me.Set("ChartOption",ChartOption);
//                            }
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    labels: {
                        rotation:30, //坐标值显示的倾斜度
                        align:'left',
                        style:{
                            fontFamily:'arial,微软雅黑',
                            textAlign:'left',
                            fontSize:9
                        },
                        formatter: function () {
                            return  this.value;
                        }
                    }
                },
                yAxis: {
                    minorGridLineWidth: 0,
                    minorTickInterval: 'auto',
                    minorTickColor: '#000000',
                    minorTickWidth: 1,
                    minorTickLength:5,
                    title: {
                        text: model.yAxisTitle
                    },labels:{
                        align:'right',
                        x:-10
                    }
                },
                tooltip: {
                    formatter: function () {
                       return Agi.Controls.BightChartTooltipsFormat(this,"number");
                    }
                },
                scrollbar: {//滚动条
                    enabled: false
                },
                navigator: {
                    enabled: false
                },
                rangeSelector: {//选择区间是否显示
                    enabled: false
                },
                series:model.seriesdata
            }
            if (model.ChartOption.DataType == "date") {
                ChartInitoption.xAxis.type = 'datetime';
                ChartInitoption.xAxis.labels.formatter = function () {
                    //格式化X值为时间字符串
                    //return  Highcharts.dateFormat('%m-%d %H:%M:%S', this.value);
                    return new Date(this.value).format("MM-dd hh:mm:ss.S")
                };
                ChartInitoption.tooltip.formatter = function () {
                   return Agi.Controls.BightChartTooltipsFormat(this,"date");
                }
            }
            var Property = Me.Get("ProPerty");
            Property.BasciObj =new Highcharts.StockChart(ChartInitoption);
            Me.Set("Property", Property);
            model=null;

            Me.Private_PlotLinesClear();
            Me.Private_PlotLineShow();//显示所有标准线
            Me.RefreshCharacteristicShow();//显示特征值
        },
        Private_PlotLineShow:function() {
            var Me=this;
            var ChartOption=Me.Get("ChartOption");
            //ChartOption.PlotLines={
            // xplotlines:[{id:"",width:"",color:"",dashstyle:"",value:"",zindex:5}],
            // yplotlines:[{id:"开始位置",width:"",color:"",dashstyle:"",value:"",zindex:5}]
            // yplotlinesenable:true
            // },//标准线集合
            var Property = Me.Get("ProPerty");
            if(ChartOption.PlotLines.yplotlines!=null && ChartOption.PlotLines.yplotlines.length>0){}else{
                if(Property!=null && Property.BasciObj.series!=null &&
                    Property.BasciObj.series.length>0 && Property.BasciObj.series[0].points!=null
                    && Property.BasciObj.series[0].points.length>0){
                    ChartOption.PlotLines.yplotlines.push({id:"开始位置",value:Property.BasciObj.series[0].points[0].x,width:1,color:"red",dashstyle:"Solid",zindex:5});
                    ChartOption.PlotLines.yplotlines.push({id:"结束位置",value:Property.BasciObj.series[0].points[Property.BasciObj.series[0].points.length-1].x,width:1,color:"red",dashstyle:"Solid",zindex:5});
                }
            }
            //水平标准线,如果存在
            if(ChartOption.PlotLines.xplotlines!=null && ChartOption.PlotLines.xplotlines.length>0){
                for(var i=0;i<ChartOption.PlotLines.xplotlines.length;i++){
                    Agi.Controls.BightChartAddStandardLine(Property.BasciObj,"Horizontal",ChartOption.PlotLines.xplotlines[i],Me);
                }
            }
            //垂直标准线,如果存在，且启用
            if(ChartOption.PlotLines.yplotlines!=null &&
                ChartOption.PlotLines.yplotlines.length>0 && ChartOption.PlotLines.yplotlinesenable){
                for(var i=0;i<ChartOption.PlotLines.yplotlines.length;i++){
                    Agi.Controls.BightChartAddStandardLine(Property.BasciObj,"Vertical",ChartOption.PlotLines.yplotlines[i],Me);
                }
            }

            //更新属性面板中的垂直范围线的值显示
            Agi.Controls.BightChartVLineValueInfoUpShow(Me);

            //更新point 点显示
            Agi.Controls.BightChartUpPointColorByXLine(Me);
        },//全部标准线显示
        Private_PlotLinesClear:function(){
            var Me=this;
            var Property = Me.Get("ProPerty");
            var ChartOption=Me.Get("ChartOption");
            if(ChartOption.PlotLines.yplotlines!=null && ChartOption.PlotLines.yplotlines.length>0){
                for(var i=0;i<ChartOption.PlotLines.yplotlines.length;i++){
                    //Property.BasciObj.xAxis[0].removePlotLine(ChartOption.PlotLines.yplotlines[i].id);
                    Agi.Controls.RemoveStandardLine(Property.BasciObj,ChartOption.PlotLines.yplotlines[i].id,Me);
                }
            }
            if(ChartOption.PlotLines.xplotlines!=null && ChartOption.PlotLines.xplotlines.length>0){
                for(var i=0;i<ChartOption.PlotLines.xplotlines.length;i++){
                    Agi.Controls.RemoveStandardLine(Property.BasciObj,ChartOption.PlotLines.xplotlines[i].id,Me);
                    //Property.BasciObj.yAxis[0].removePlotLine(ChartOption.PlotLines.xplotlines[i].id);
                }
            }
        },//标准线清空
        RefreshCharacteristicShow:function(){
            var Me=this;
            var Chartobj=Me.Get("Property").BasciObj;
            var ChartSeriesData=[];
            if(Chartobj.series!=null && Chartobj.series.length>0){
                for(var i=0;i<Chartobj.series.length;i++){
                    if(Chartobj.series[i].name=="最大值"){
                        Chartobj.series[i].remove();
                        i--;
                        continue;
                    }
                    if(Chartobj.series[i].name=="最小值"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                    if(Chartobj.series[i].name=="均值"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                    if(Chartobj.series[i].name=="离差"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                    if(Chartobj.series[i].name=="标准差"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                }
            }
            if(Chartobj.series!=null && Chartobj.series.length>0){
                //ChartSeriesData=Chartobj.series[0].data;
                ChartSeriesData=Chartobj.series[0].points
            }

            Agi.Controls.BightChartCharacteristicTols(Me,ChartSeriesData,function(TolData){
                //TolData.chtis ;TolData.pointarray
                if(TolData.chtis.MAX.Enable && TolData.chtis.MAX.Value!=null){
                    Chartobj.addSeries({name:"最大值",data:[[TolData.pointarray[0],TolData.chtis.MAX.Value],[TolData.pointarray[1],TolData.chtis.MAX.Value]],color:"red",lineWidth:1})
                }
                if(TolData.chtis.MIN.Enable && TolData.chtis.MIN.Value!=null){
                    Chartobj.addSeries({name:"最小值",data:[[TolData.pointarray[0],TolData.chtis.MIN.Value],[TolData.pointarray[1],TolData.chtis.MIN.Value]],color:"red",lineWidth:1})
                }
                if(TolData.chtis.MEAN.Enable && TolData.chtis.MEAN.Value!=null){
                    Chartobj.addSeries({name:"均值",data:[[TolData.pointarray[0],TolData.chtis.MEAN.Value],[TolData.pointarray[1],TolData.chtis.MEAN.Value]],color:"red",lineWidth:1})
                }
                if(TolData.chtis.DEVIAT.Enable && TolData.chtis.DEVIAT.Value!=null){
                    var deviatData=[];
                    if(TolData.seriesdata!=null && TolData.seriesdata.length>0){
                        for(var i=0;i<TolData.seriesdata.length;i++){
                            deviatData.push([TolData.seriesdata[i].x,TolData.chtis.DEVIAT.Value[i]]);
                        }
                    }
                    Chartobj.addSeries({name:"离差",data:deviatData,color:"red",lineWidth:1});
                }
                if(TolData.chtis.STED.Enable && TolData.chtis.STED.Value!=null){
                    Chartobj.addSeries({name:"标准差",data:[[TolData.pointarray[0],TolData.chtis.STED.Value],[TolData.pointarray[1],TolData.chtis.STED.Value]],color:"red",lineWidth:1})
                }
            });
        },//特征值更新显示
        UpDateAreaDataTolsInfo:function(_Option){
            var Me=this;
            var Chartobj=Me.Get("Property").BasciObj;
            if(Chartobj.series!=null && Chartobj.series.length>0){
                for(var i=0;i<Chartobj.series.length;i++){
                    if(Chartobj.series[i].name=="最大值"){
                        Chartobj.series[i].remove();
                        i--;
                        continue;
                    }
                    if(Chartobj.series[i].name=="最小值"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                    if(Chartobj.series[i].name=="均值"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                    if(Chartobj.series[i].name=="离差"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                    if(Chartobj.series[i].name=="标准差"){
                        Chartobj.series[i].remove();
                        i--;
                    }
                }
            }
            var PointArray=[];
            if(Chartobj.series!=null && Chartobj.series.length>0){
//                var ChartSeriesData=Chartobj.series[0].data;
                var ChartSeriesData=Chartobj.series[0].points;
                for (var j = 0; j < ChartSeriesData.length; j++) {
                    if (ChartSeriesData[j].x >= _Option[0] && ChartSeriesData[j].x <= _Option[1]) {
                        PointArray.push(ChartSeriesData[j]);
                    }
                }
            }
            //统计显示信息
            Agi.Controls.BightChartCharacteristicTols(Me,PointArray,function(TolData){
                //TolData.chtis ;TolData.pointarray
                if(TolData.chtis.MAX.Enable && TolData.chtis.MAX.Value!=null){
                    Chartobj.addSeries({name:"最大值",data:[[TolData.pointarray[0],TolData.chtis.MAX.Value],[TolData.pointarray[1],TolData.chtis.MAX.Value]],color:"red",lineWidth:1})
                }
                if(TolData.chtis.MIN.Enable && TolData.chtis.MIN.Value!=null){
                    Chartobj.addSeries({name:"最小值",data:[[TolData.pointarray[0],TolData.chtis.MIN.Value],[TolData.pointarray[1],TolData.chtis.MIN.Value]],color:"red",lineWidth:1})
                }
                if(TolData.chtis.MEAN.Enable && TolData.chtis.MEAN.Value!=null){
                    Chartobj.addSeries({name:"均值",data:[[TolData.pointarray[0],TolData.chtis.MEAN.Value],[TolData.pointarray[1],TolData.chtis.MEAN.Value]],color:"red",lineWidth:1})
                }
                if(TolData.chtis.DEVIAT.Enable && TolData.chtis.DEVIAT.Value!=null){
                    var deviatData=[];
                    if(TolData.seriesdata!=null && TolData.seriesdata.length>0){
                        for(var i=0;i<TolData.seriesdata.length;i++){
                            deviatData.push([TolData.seriesdata[i].x,TolData.chtis.DEVIAT.Value[i]]);
                        }
                    }
                    Chartobj.addSeries({name:"离差",data:deviatData,color:"red",lineWidth:1});
                }
                if(TolData.chtis.STED.Enable && TolData.chtis.STED.Value!=null){
                    Chartobj.addSeries({name:"标准差",data:[[TolData.pointarray[0],TolData.chtis.STED.Value],[TolData.pointarray[1],TolData.chtis.STED.Value]],color:"red",lineWidth:1})
                }
            });

        },//更新区域内容数据的统计信息
        GetDataSeries:function(){
            var Me=this;
            var Chartobj=Me.Get("ProPerty").BasciObj;
            //_Series中元素名称 如果不为max/middle/min 则为对应的数据曲线的series
            var SeriesArray=[];
            if(Chartobj.series!=null && Chartobj.series.length>0){
                for(var i=0;i<Chartobj.series.length;i++){
                    if(Chartobj.series[i].name=="最大值"){
                        continue;
                    }
                    if(Chartobj.series[i].name=="最小值"){
                        continue;
                    }
                    if(Chartobj.series[i].name=="均值"){
                        continue;
                    }
                    if(Chartobj.series[i].name=="离差"){
                        continue;
                    }
                    if(Chartobj.series[i].name=="标准差"){
                        continue;
                    }
                    SeriesArray.push(Chartobj.series[i]);
                }
            }
            return SeriesArray;
        }//获取数据曲线Series（非标准线）
    }, true);


//摘要：
//     属性监听处理
Agi.Controls.BightChartAttributeChange = function (_ControlObj, Key, _Value) {
    var self = _ControlObj;
    switch (Key) {
        case "Position":
        {
            if (Key == "Position") {
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElementobj = $("#" + _ControlObj.Get("HTMLElement").id);
                    var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

                    var ParentObj = ThisHTMLElementobj.parent();
                    var PagePars = {Width: ParentObj.width(), Height: ParentObj.height()};
                    ThisHTMLElementobj.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElementobj.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");

                    ///20130106 11:13 更改控件位置时不更改控件大小
                    var bolIsResizable = _ControlObj.Get("IsResizable");
                    var ThisControlPars =
                    {
                        Width: parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                        Height: parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))
                    };
                    ThisHTMLElementobj.width(ThisControlPars.Width);
                    ThisHTMLElementobj.height(ThisControlPars.Height);
                    ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
                    PagePars = null;
                }
            }
            break;
        }
    }
}
//摘要：
//      产生默认加载测试数据
Agi.Controls.GetDemoData = function (_DataLength) {
    var ThisDay = new Date();
    var ThisData = [];
    for (var i = 0; i < _DataLength; i++) {
        ThisData.push([Date.parse(new Date(ThisDay.valueOf() + (i * 86400000))), Agi.Controls.GetRandomValue(-20, 20)]);
        // ThisData.push([i + 1, Agi.Controls.GetRandomValue(-20, 20)]);
    }
    return ThisData;
}
Agi.Controls.GetRandomValue = function (Minvalue, Maxvalue) {
    var ThisRandomValue = Minvalue + parseInt((Maxvalue - Minvalue) * Math.random());
    return ThisRandomValue;
}


//摘要：
//      首次加载默认执行
//备注：
//      本函数与ControlConfig.xml文件里配置名称要对应
Agi.Controls.InitBightChart = function () {
    //控件初始化
    return new Agi.Controls.BightChart();
}


//摘要：
//      属性面板
Agi.Controls.BightChartProrityInit = function (self) {

    var Me = self;
    //取得默认属性
    var ChartEntity = Me.Get("Entity")[0];
    var ChartEntityColumns = [];
    if (ChartEntity != null && ChartEntity.Columns != null) {
        ChartEntityColumns = ChartEntity.Columns;
    }
    Me.Set("Horizontal", []);
    var ThisProItems = [];
    {
        var ItemContent = "";
        ItemContent = $("<div id='CSChartDataLine'></div>");
        Agi.Controls.BightChartPropertyLine(ItemContent, Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据曲线", DisabledValue: 1, ContentObj: ItemContent }));

        ItemContent = null;
        ItemContent = $("<div id='CSChartDataxAxis'></div>");
        Agi.Controls.BightChartPropertyXAxis(ItemContent, Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "水平标准线", DisabledValue: 1, ContentObj: ItemContent }));

        ItemContent = null;
        ItemContent = $("<div id='CSChartDatayAxis'></div>");
        Agi.Controls.BightChartPropertyYAxis(ItemContent, Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "垂直范围线", DisabledValue: 1, ContentObj: ItemContent }));

        ItemContent = null;
        ItemContent = $("<div id='CSChartDataCharacteristic'></div>");
        Agi.Controls.BightChartPropertyyCharacteristic(ItemContent, Me);
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "特征值", DisabledValue: 1, ContentObj: ItemContent }));

    }
    //初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
}


//摘要：
//      数据曲线
Agi.Controls.BightChartPropertyLine = function (_Panel, Me) {
    var ChartEntityColumns = [];
    var ChartEntity = Me.Get("Entity")[0];
    if (ChartEntity != null && ChartEntity.Columns != null) {
        ChartEntityColumns = ChartEntity.Columns;
    }
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/BightChart/tabTemplates.html #tab-1', function () {
        var DataSeries=Me.Get("ChartOption").DataSeries;
//        [{Name:"数据u",XColumn:"",YColumn:"",Type:"line",Color:"",MarkerColor:""}]
        $(this).find('#BightChart_Savebuttonsty').bind('click', function () {
          var Thisoption= Me.Get("ChartOption");
            Thisoption.DataSeries[0].XColumn=$("#BightChartxAxis").val();
            Thisoption.DataSeries[0].YColumn=$("#BightChartyAxis").val();
            Thisoption.DataSeries[0].Color=$("#BightChartdataColor").val();
            if(Thisoption.PlotLines.yplotlines!=null && Thisoption.PlotLines.yplotlines.length>0){
                Thisoption.PlotLines.yplotlines=[];
            }

            Me.Set("ChartOption",Thisoption);
            Me.Refresh();
        });

        $(this).find("#BightChartdataColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['blue', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['black', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                ItemContentPanel.find("#BightChartdataColor").attr("value", color.toHexString());
            }
        });

        var BightChartxAxisPanel=$("#BightChartxAxis").html("");
        var BightChartyAxisPanel=$("#BightChartyAxis").html("");
        for (var i = 0; i < ChartEntityColumns.length; i++) {
            BightChartxAxisPanel.append("<option value='" + ChartEntityColumns[i] + "'>" + ChartEntityColumns[i] + "</option>");
            BightChartyAxisPanel.append("<option value='" + ChartEntityColumns[i] + "'>" + ChartEntityColumns[i] + "</option>");
        }
        if(DataSeries!=null && DataSeries.length>0){
            BightChartxAxisPanel.find("option[value='"+DataSeries[0].XColumn+"']").attr("selected","selected");
            BightChartyAxisPanel.find("option[value='"+DataSeries[0].YColumn+"']").attr("selected","selected");
            $(this).find("#BightChartdataColor").spectrum("set",DataSeries[0].Color);
        }
    });
}

var StandardLines = [];//所有的标准线集合
//摘要：
// 水平标准线
Agi.Controls.BightChartPropertyXAxis = function (_Panel, Me) {
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/BightChart/tabTemplates.html #tab-2', function () {
        var ThisChartOption=Me.Get("ChartOption");

        $(this).find("#BightChart_xplotcolor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['blue', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['black', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                ItemContentPanel.find("#bz_xAxis_color").attr("value", color.toHexString());
            }
        });
        //保存
        $(this).find("#BightChart_SavebuttonxAxis").unbind().bind("click",function () {
            //刻度值
            var xplotvalue={
                id:$("#BightChart_xplotName").val(),
                width:$("#BightChart_xplotwidth").val(),
                color:$("#BightChart_xplotcolor").val(),
                dashstyle:"solid",
                value:$("#BightChart_xplotvalue").val(),
                zindex:5
            };
            var OldXplotLineID=$("#BightChart_AxisStandlineEnum").val();
            Agi.Controls.BightChartXStandardLineSave(Me,xplotvalue,OldXplotLineID);
        });
        //新增
        $(this).find("#BightChart_AddbuttonxAxis").unbind().bind("click",function () {
              $("#BightChart_AxisStandlineEnum").val("");
              $("#BightChart_xplotName").val("");
              $("#BightChart_xplotvalue").val("");
        });
        //删除
        $(this).find("#BightChart_SavebuttonxDel").unbind().bind("click",function () {
            var delitemID = $("#BightChart_xplotDropItems").val();
            if(delitemID!=null){
                ThisChartOption=Me.Get("ChartOption");
                var DelItemIndex=-1;
                for(var i=0;i<ThisChartOption.PlotLines.xplotlines.length;i++){
                    if(ThisChartOption.PlotLines.xplotlines[i].id==delitemID){
                        DelItemIndex=i;
                        break;
                    }
                }
                if(DelItemIndex>-1){
                    ThisChartOption.PlotLines.xplotlines.shift(DelItemIndex,1);
                    $("#BightChart_xplotDropItems option[index='"+DelItemIndex+"']").remove();
                }
                Me.Set("ChartOption",ThisChartOption);
                $("#BightChart_AxisStandlineEnum").val("");
                $("#BightChart_xplotName").val("");
                $("#BightChart_xplotvalue").val("");

                Me.Private_PlotLinesClear();//清空所有标准线
                Me.Private_PlotLineShow();//更新标准线显示
            }else{
                AgiCommonDialogBox.Alert("请先选中需要删除的项后再试!");
            }
        });
        //选中项更改
        $(this).find("#BightChart_xplotDropItems").change(function(){
            ThisChartOption=Me.Get("ChartOption");
            var SelItemID=$(this).val();
            $("#BightChart_AxisStandlineEnum").val(SelItemID);
            $("#BightChart_xplotName").val(SelItemID);
            var SelectedItem=null;
            for(var i=0;i<ThisChartOption.PlotLines.xplotlines.length;i++){
                if(ThisChartOption.PlotLines.xplotlines[i].id==SelItemID){
                    SelectedItem=ThisChartOption.PlotLines.xplotlines[i];
                    break;
                }
            }
            if(SelectedItem!=null){
                $("#BightChart_xplotwidth").val(SelectedItem.width);
                $("#BightChart_xplotvalue").val(SelectedItem.value);
                $("#BightChart_xplotcolor").spectrum("set",SelectedItem.color);
            }
        });
        if(ThisChartOption!=null && ThisChartOption.PlotLines.xplotlines!=null
            &&  ThisChartOption.PlotLines.xplotlines.length>0){
            $("#BightChart_xplotDropItems").empty();
            var DropItemHTML="";
            for (var i = 0; i <ThisChartOption.PlotLines.xplotlines.length; i++) {
                DropItemHTML+="<option  value='" + ThisChartOption.PlotLines.xplotlines[i].id + "'>" + ThisChartOption.PlotLines.xplotlines[i].id + "</option>";
            }
            $("#BightChart_xplotDropItems").html(DropItemHTML);
            $("#BightChart_xplotDropItems").find("option[value='"+ThisChartOption.PlotLines.xplotlines[0].id+"']").attr("selected","selected");

            $("#BightChart_xplotwidth").val(ThisChartOption.PlotLines.xplotlines[0].width);
            $("#BightChart_xplotvalue").val(ThisChartOption.PlotLines.xplotlines[0].value);
            $("#BightChart_xplotcolor").spectrum("set",ThisChartOption.PlotLines.xplotlines[0].color);
        }
    });
}


//摘要：
// 垂直标准线
Agi.Controls.BightChartPropertyYAxis = function (_Panel, Me) {
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/BightChart/tabTemplates.html #tab-3', function () {
        $(this).find("#BightChart_yplotcolor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['blue', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['black', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                ItemContentPanel.find("#bz_xAxis_color").attr("value", color.toHexString());
            }
        });
        $("#BightChart_SavebuttonYSave").click(function () {
            var YstandLineObj={
                enable:true,
                color:$("#BightChart_yplotcolor").val(),
                width:$("#BightChart_yplotwidth").val(),
                startvalue:Agi.Script.EntityDataFilterDateConvert($("#BightChart_YStart").val()),
                endvalue:Agi.Script.EntityDataFilterDateConvert($("#BightChart_YEnd").val())
            };
            var Enablevalue=$("#BightChart_yplotEnable").val();
            if(Enablevalue=="OFF"){
                YstandLineObj.enable=false;
            }
            Agi.Controls.BightChartYStandardLineSave(Me,YstandLineObj);
        });
        var ThisChartOption=Me.Get("ChartOption");
        var Property = Me.Get("ProPerty");
        if(ThisChartOption.PlotLines.yplotlines!=null && ThisChartOption.PlotLines.yplotlines.length>0){
            $(this).find("#BightChart_yplotcolor").spectrum("set",ThisChartOption.PlotLines.yplotlines[0].color);
            $(this).find("#BightChart_yplotwidth").val(ThisChartOption.PlotLines.yplotlines[0].width);
            var chartoption=Me.Get("ChartOption");
            if(chartoption.DataType=="date"){
                $("#BightChart_YStart").val(new Date(ThisChartOption.PlotLines.yplotlines[0].value).format("yyyy-MM-dd hh:mm:ss.S"));
                $("#BightChart_YEnd").val(new Date(ThisChartOption.PlotLines.yplotlines[1].value).format("yyyy-MM-dd hh:mm:ss.S"));
            }else{
                $("#BightChart_YStart").val(ThisChartOption.PlotLines.yplotlines[0].value);
                $("#BightChart_YEnd").val(ThisChartOption.PlotLines.yplotlines[1].value);
            }
        }

    });
}

//摘要：
//      特征值
Agi.Controls.BightChartPropertyyCharacteristic = function (_Panel, Me) {
    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/BightChart/tabTemplates.html #tab-5', function () {
        //初始化选项
        var ChartOptiontemp=Me.Get("ChartOption");
        if(ChartOptiontemp!=null){
            if(ChartOptiontemp.Characteristic.MAX.Enable){
                $("#BightChart_featureMAX").attr("checked",true);
            }else{
                $("#BightChart_featureMAX").removeAttr("checked");
            }
            if(ChartOptiontemp.Characteristic.MIN.Enable){
                $("#BightChart_featureMIN").attr("checked",true);
            }else{
                $("#BightChart_featureMIN").removeAttr("checked");
            }
            if(ChartOptiontemp.Characteristic.MEAN.Enable){
                $("#BightChart_featureMEAN").attr("checked",true);
            }else{
                $("#BightChart_featureMEAN").removeAttr("checked");
            }
            if(ChartOptiontemp.Characteristic.DEVIAT.Enable){
                $("#BightChart_featureDEVIAT").attr("checked",true);
            }else{
                $("#BightChart_featureDEVIAT").removeAttr("checked");
            }
            if(ChartOptiontemp.Characteristic.STED.Enable){
                $("#BightChart_featureSTED").attr("checked",true);
            }else{
                $("#BightChart_featureSTED").removeAttr("checked");
            }

        }
        $(this).find("#BightChart_featureSave").unbind().bind("click",function(){
            ChartOptiontemp=Me.Get("ChartOption");
            ChartOptiontemp.Characteristic.MAX.Enable=!!$("#BightChart_featureMAX").attr("checked");
            ChartOptiontemp.Characteristic.MIN.Enable=!!$("#BightChart_featureMIN").attr("checked");
            ChartOptiontemp.Characteristic.MEAN.Enable=!!$("#BightChart_featureMEAN").attr("checked");
            ChartOptiontemp.Characteristic.DEVIAT.Enable=!!$("#BightChart_featureDEVIAT").attr("checked");
            ChartOptiontemp.Characteristic.STED.Enable=!!$("#BightChart_featureSTED").attr("checked");

            Me.Set("ChartOption",ChartOptiontemp);
            //更新特征值显示
            Me.RefreshCharacteristicShow();
        })
    });
};

//region 标准线相关处理
//添加标准线
Agi.Controls.BightChartAddStandardLine = function (chart, _Direction,_StandLineInfo,_Controlobj) {
    var NewLineObj = null;
    var StandardLineId = _StandLineInfo.id;

    if (_Direction == "Vertical") {
        var VerStandardlineOptions = {
            value:_StandLineInfo.value,
            color:_StandLineInfo.color,
            width:_StandLineInfo.width,
            dashstyle:_StandLineInfo.dashstyle,
            id: _StandLineInfo.id,
            events: {
//                click: function (e) {
//                    //ShowLineDragMenu(this,e);
//                },
//                mouseover: function (e) {
//                    //ShowLineDragMenu(this, e)
//                },
//                mouseout: function (e) {
//                },
//                mousemove: function (e) {
//                }
            },
            zIndex: _StandLineInfo.zindex
        }
        chart.xAxis[0].addPlotLine(VerStandardlineOptions);
        if (chart.xAxis[0].plotLinesAndBands != null && chart.xAxis[0].plotLinesAndBands.length > 0) {
            NewLineObj = chart.xAxis[0].plotLinesAndBands[chart.xAxis[0].plotLinesAndBands.length - 1];
        }
    }
    else {
        var HorStandardlineOptions = {
            value:_StandLineInfo.value,
            color:_StandLineInfo.color,
            width:_StandLineInfo.width,
            dashstyle:_StandLineInfo.dashstyle,
            id: _StandLineInfo.id,
            events: {
//                click: function (e) {
//                    //ShowLineDragMenu(this,e);
//                },
//                mouseover: function (e) {
//                    //ShowLineDragMenu(this, e)
//                },
//                mouseout: function (e) {
//                },
//                mousemove: function (e) {
//                }
            },
            zIndex: _StandLineInfo.zindex
        };
        chart.yAxis[0].addPlotLine(HorStandardlineOptions);
        if (chart.yAxis[0].plotLinesAndBands != null && chart.yAxis[0].plotLinesAndBands.length > 0) {
            NewLineObj = chart.yAxis[0].plotLinesAndBands[chart.yAxis[0].plotLinesAndBands.length - 1];
        }
    }
    Agi.Controls.BightChartLoadLineMenu(chart,NewLineObj,_Direction,_Controlobj,_StandLineInfo.value);
    return NewLineObj;
};
//水平标准线保存
Agi.Controls.BightChartXStandardLineSave = function (_ChartObj,_NewStandLineInfo,_OldStandLineID) {
    var ThisChartOption=_ChartObj.Get("ChartOption");
    if(_OldStandLineID!=null && _OldStandLineID!=""){
        for(var i=0;i<ThisChartOption.PlotLines.xplotlines.length;i++){
            if(ThisChartOption.PlotLines.xplotlines[i].id==_OldStandLineID){
                ThisChartOption.PlotLines.xplotlines[i]=_NewStandLineInfo;
                break;
            }
        }
        $("#BightChart_xplotDropItems").empty();
        var DropItemHTML="";
        for (var i = 0; i <ThisChartOption.PlotLines.xplotlines.length; i++) {
            DropItemHTML+="<option  value='" + ThisChartOption.PlotLines.xplotlines[i].id + "'>" + ThisChartOption.PlotLines.xplotlines[i].id + "</option>";
        }
        $("#BightChart_xplotDropItems").html(DropItemHTML);
        $("#BightChart_xplotDropItems").find("option[value='"+_NewStandLineInfo.id+"']").attr("selected","selected");

        _ChartObj.Private_PlotLinesClear();//清空所有标准线
        _ChartObj.Private_PlotLineShow();//更新标准线显示
    }else{
        $("#BightChart_xplotDropItems").empty();
        var bolIsExt=false;
        for(var i=0;i<ThisChartOption.PlotLines.xplotlines.length;i++){
            if(ThisChartOption.PlotLines.xplotlines[i].id==_NewStandLineInfo.id){
                bolIsExt=true;
                break;
            }
        }
        if(!bolIsExt){
            ThisChartOption.PlotLines.xplotlines.push(_NewStandLineInfo);
            var DropItemHTML="";
            for (var i = 0; i <ThisChartOption.PlotLines.xplotlines.length; i++) {
                DropItemHTML+="<option  value='" + ThisChartOption.PlotLines.xplotlines[i].id + "'>" + ThisChartOption.PlotLines.xplotlines[i].id + "</option>";
            }
            $("#BightChart_xplotDropItems").html(DropItemHTML);

            $("#BightChart_AxisStandlineEnum").val(_NewStandLineInfo.id);
            $("#BightChart_xplotDropItems").find("option[value='"+_NewStandLineInfo.id+"']").attr("selected","selected");

            _ChartObj.Private_PlotLinesClear();//清空所有标准线
            _ChartObj.Private_PlotLineShow();//更新标准线显示
        }else{
            AgiCommonDialogBox.Alert("已存在同名标准线!");
        }
    }
    _ChartObj.Set("ChartOption",ThisChartOption);
};
//垂直标准线信息保存
Agi.Controls.BightChartYStandardLineSave = function (_ChartObj,_YStandLineInfo) {
    //_YStandLineInfo:{enable:是否启用,color:颜色,width:宽度}
    var ThisChartOption=_ChartObj.Get("ChartOption");
    ThisChartOption.PlotLines.yplotlinesenable=_YStandLineInfo.enable;
    for(var i=0;i<ThisChartOption.PlotLines.yplotlines.length;i++){
        ThisChartOption.PlotLines.yplotlines[i].color=_YStandLineInfo.color;
        ThisChartOption.PlotLines.yplotlines[i].width=_YStandLineInfo.width;
        if(i==0){
            ThisChartOption.PlotLines.yplotlines[i].value=_YStandLineInfo.startvalue;
        }else{
            ThisChartOption.PlotLines.yplotlines[i].value=_YStandLineInfo.endvalue;
        }
    }
    _ChartObj.Set("ChartOption",ThisChartOption);
    _ChartObj.Private_PlotLinesClear();//清空所有标准线
    _ChartObj.Private_PlotLineShow();//更新标准线显示
}
Agi.Controls.GetPostionObjByXYStr = function (_XY) {
    var PostionArray = _XY.split(" ");
    return {StartX: parseInt(PostionArray[1]), StartY: parseInt(PostionArray[2]), EndX: parseInt(PostionArray[4]), EndY: parseInt(PostionArray[5])};
}

//加载标准线菜单拖拽按钮
Agi.Controls.BightChartLoadLineMenu=function(chart,_StandLineInfo,_Dir,_ControlObj,lineValue){
    var LineObj=new Object();
    var Me=_ControlObj;
    LineObj=_StandLineInfo;
    if(LineObj.svgElem!=null){
        var PostionObj=Agi.Controls.GetPostionObjByXYStr(LineObj.svgElem.d);/*获取坐标范围值*/
        if($("#Menu_"+LineObj.id).length==0){
            var DragMenuPostion=null;
            var DragMenuElement="";
            if(_Dir=="Vertical"){/*垂直*/
                var titlevalue=lineValue+"";
                if(titlevalue.length>=13){
                    titlevalue=new Date(lineValue).format("yyyy-MM-dd hh:mm:ss.S");
                }
                DragMenuPostion={X:PostionObj.StartX-15,Y:PostionObj.StartY-25,PanelCss:"Line_V_DragMenuPanelSty",MenuCss:"Line_V_DragMenuSty",LeftCss:"Line_V_DragMenuleftSty",Width:30,Height:(PostionObj.EndY-PostionObj.StartY)};
                DragMenuElement= $("<div id='Menu_"+LineObj.id+"' class='"+DragMenuPostion.PanelCss+"' title='"+titlevalue+"'>" +
                    "<div class='"+DragMenuPostion.MenuCss+"'></div>" +
//                    "<div class='Line_V_DragMenuleftSty'></div>"+
                    "<div></div>"+
                    "<div class='clearfloat'></div>" +
                    "</div>");
                titlevalue=null;
            }else{
                DragMenuPostion={X:PostionObj.StartX+25,Y:PostionObj.EndY-15,PanelCss:"Line_H_DragMenuPanelSty",MenuCss:"Line_H_DragMenuSty",LeftCss:"Line_H_DragMenuleftSty",Width:(PostionObj.EndX-PostionObj.StartX),Height:30};
                DragMenuElement= $("<div id='Menu_"+LineObj.id+"' class='"+DragMenuPostion.PanelCss+"' title='"+lineValue+"'>" +
//                    "<div class='Line_H_DragMenuleftSty'></div>"+
                    "<div></div>"+
                    "<div class='"+DragMenuPostion.MenuCss+"'></div>" +
                    "<div class='clearfloat'></div>" +
                    "</div>");
            }
            DragMenuElement.appendTo($(chart.container));
            DragMenuElement.width(DragMenuPostion.Width);
            DragMenuElement.height(DragMenuPostion.Height);

            var DragMenuEnlementHammer=null;
            if(_Dir=="Vertical"){/*垂直*/
                $(DragMenuElement.children()[1]).height(DragMenuPostion.Height-30);
                DragMenuEnlementHammer=new Hammer(DragMenuElement.children()[0]);
            }else{
                $(DragMenuElement.children()[0]).width(DragMenuPostion.Width-30);
                DragMenuEnlementHammer=new Hammer(DragMenuElement.children()[1]);
            }
            DragMenuElement.css("left",DragMenuPostion.X+"px");
            DragMenuElement.css("top",DragMenuPostion.Y+"px");
            var StartX,StartY,EndX,EndY;
            var MoveMin_MaxValue=Agi.Controls.GetMoveMin_MaxValue(_Dir,chart);/*移动范围*/

            DragMenuEnlementHammer.ondragstart=function(ev){/*开始移动*/
                StartX=(ev.touches[0].x-$(chart.container).offset().left-15);
                StartY=(ev.touches[0].y-$(chart.container).offset().top-15);

                if(_Dir=="Vertical"){/*垂直*/
                    $(DragMenuElement.children()[1]).addClass("Line_V_DragMenuleftSty");
                }else{
                    $(DragMenuElement.children()[0]).addClass("Line_H_DragMenuleftSty");
                }
            }
            DragMenuEnlementHammer.ondrag=function(ev){/*移动中*/
                var PostionValue=0;
                if(_Dir=="Vertical"){/*垂直*/
                    PostionValue=(ev.touches[0].x-$(chart.container).offset().left-15);
                    console.log("范围,min:"+MoveMin_MaxValue.Min+"  max:"+MoveMin_MaxValue.Max+"  当前值:"+PostionValue);
                    if(PostionValue>=MoveMin_MaxValue.Min && PostionValue<=MoveMin_MaxValue.Max){
                        DragMenuElement.css("left",PostionValue+"px");
                        EndX=PostionValue+15;
                    }
                }else{
                    PostionValue=(ev.touches[0].y-$(chart.container).offset().top-15);
                    if(PostionValue>=MoveMin_MaxValue.Min && PostionValue<=MoveMin_MaxValue.Max){
                        DragMenuElement.css("top",PostionValue+"px");
                        EndY=PostionValue+15;
                    }
                }
            }
            DragMenuEnlementHammer.ondragend=function(ev){/*移动结束*/
                /*1.根据基准线停放的位置获得对应的X轴或Y轴的值*/
                var LineValue=Agi.Controls.GetLineOverValue(_Dir,EndX,EndY,chart);
                /*2.先移除原基准线*/
                var LineID=LineObj.id;
                Agi.Controls.RemoveStandardLine(chart,LineID,Me);
                if(_Dir=="Vertical"){/*垂直*/
                    $(DragMenuElement.children()[1]).removeClass("Line_V_DragMenuleftSty");
                }else{
                    $(DragMenuElement.children()[0]).removeClass("Line_H_DragMenuleftSty");
                }

                /*3.根据获得的X轴获取Y轴的值，将拖拽的基准线定位到相应位置*/
                var ThisLineObj=Agi.Controls.BightChartLineObjById(LineID,Me);
                ThisLineObj.value=LineValue;

                /*4.标准线*/
                LineObj=Agi.Controls.BightChartAddStandardLine(chart,_Dir,ThisLineObj,Me);
                /*5.加载菜单*/
                Agi.Controls.BightChartLoadLineMenu(chart,LineObj,_Dir,Me,ThisLineObj.value);

                /*6.更新Chart 中相应点的颜色*/
                if (_Dir == "Horizontal") {
                    Agi.Controls.BightChartUpPointColorByXLine(Me);
                }else{
                    if (chart.series != null && chart.series.length > 0) {
                        //将纵向区域过滤出来
                        var num = Agi.Controls.BightChartLineYLineValues(Me);

                        //排序Asc
                        var TempValue=null;
                        if(num[0]>num[1]){
                            TempValue=num[0];
                            num[0]=num[1];
                            num[1]=TempValue;
                        }
                        //更新范围内数据信息
                        Me.UpDateAreaDataTolsInfo(num);
                    }
                }

                //6.更新菜单栏中的垂直线范围显示
                Agi.Controls.BightChartVLineValueInfoUpShow(Me);
            }
        }
    }
}
//更新标准线位置
Agi.Controls.BightChartLineMenuRefreshPostion=function(chart){
    var LinebaseObj=null;
    var PostionObj=null;
    var DragMenuPostion=null;
    if (chart.xAxis[0].plotLinesAndBands != null && chart.xAxis[0].plotLinesAndBands.length > 0) {
        for(var i=0;i<chart.xAxis[0].plotLinesAndBands.length;i++){
            LinebaseObj=chart.xAxis[0].plotLinesAndBands[i];
            PostionObj=Agi.Controls.GetPostionObjByXYStr(LinebaseObj.svgElem.d);/*获取坐标范围值*/
            DragMenuPostion={X:PostionObj.StartX-15,Y:PostionObj.StartY-25,PanelCss:"Line_V_DragMenuPanelSty",MenuCss:"Line_V_DragMenuSty",LeftCss:"Line_V_DragMenuleftSty",Width:30,Height:(PostionObj.EndY-PostionObj.StartY)};
            if($("#Menu_"+LinebaseObj.id).length>0){
                $("#Menu_"+LinebaseObj.id).css({"left":DragMenuPostion.X+"px","top":DragMenuPostion.Y+"px"});
            }
        }
    }
    if (chart.yAxis[0].plotLinesAndBands != null && chart.yAxis[0].plotLinesAndBands.length > 0) {
        for(var i=0;i<chart.yAxis[0].plotLinesAndBands.length;i++){
            LinebaseObj=chart.yAxis[0].plotLinesAndBands[i];
            PostionObj=Agi.Controls.GetPostionObjByXYStr(LinebaseObj.svgElem.d);/*获取坐标范围值*/
            DragMenuPostion={X:PostionObj.StartX+25,Y:PostionObj.EndY-15,PanelCss:"Line_H_DragMenuPanelSty",MenuCss:"Line_H_DragMenuSty",LeftCss:"Line_H_DragMenuleftSty",Width:(PostionObj.EndX-PostionObj.StartX),Height:30};
            if($("#Menu_"+LinebaseObj.id).length>0){
                $("#Menu_"+LinebaseObj.id).css({"left":DragMenuPostion.X+"px","top":DragMenuPostion.Y+"px"});
            }
        }
    }
}
//根据基准线停放的位置获取对应的X轴或Y轴的值 (_Dir:基准线方向（水平或垂直）,_X:基准线停留位置X值，_Y:基准线停留Y值,_Chart:Chart图表对象)
Agi.Controls.GetLineOverValue = function (_Dir, _X, _Y, _Chart) {
    var PostionObj = null, LineValue = 0;
    if (_Dir == "Vertical") {
        if (_Chart.xAxis[0].tickPositions != null && _Chart.xAxis[0].tickPositions.length > 0) {
            var MinMaxPositionInfo={Min:0,Max:0};
            MinMaxPositionInfo.Min=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[0]].mark.d).StartX;
            MinMaxPositionInfo.Max=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[_Chart.xAxis[0].tickPositions.length-1]].mark.d).StartX;
            var OneSpc=( MinMaxPositionInfo.Max-MinMaxPositionInfo.Min)/_Chart.xAxis[0].tickPositions.length;
            MinMaxPositionInfo.Min=MinMaxPositionInfo.Min-OneSpc;
            if( MinMaxPositionInfo.Min<0){
                MinMaxPositionInfo.Min=0;
            }
            MinMaxPositionInfo.Max=MinMaxPositionInfo.Max+OneSpc;
            var TickItems=[];
            TickItems.push({Value:_Chart.xAxis[0].min,Postion:{StartX:MinMaxPositionInfo.Min,EndX:MinMaxPositionInfo.Min,StartY:null,EndY:null}});
            for (var i = 0; i < _Chart.xAxis[0].tickPositions.length; i++) {
                TickItems.push({Value:_Chart.xAxis[0].tickPositions[i],Postion:Agi.Controls.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[i]].mark.d)});
            }
            TickItems.push({Value:_Chart.xAxis[0].max,Postion:{StartX:MinMaxPositionInfo.Max,EndX:MinMaxPositionInfo.Max,StartY:null,EndY:null}});

            var FirstPostionObj=null;
            var SpceValueNumber=null;

            for(var j=0;j<TickItems.length;j++){
                if (_X <= TickItems[j].Postion.StartX) {
                    if (j > 0) {
                        FirstPostionObj = TickItems[j-1];
                        SpceValueNumber = TickItems[j].Postion.StartX - FirstPostionObj.Postion.StartX;

                        var SpceValue = (TickItems[j].Value - TickItems[j-1].Value);
                         LineValue = (_X - FirstPostionObj.Postion.StartX) * SpceValue / SpceValueNumber + FirstPostionObj.Value;
                        if (LineValue < TickItems[0].Value) {
                            LineValue = TickItems[0].Value;
                        }
                        if (LineValue > TickItems[TickItems.length-1].Value) {
                            LineValue =TickItems[TickItems.length-1].Value;
                        }
                        break;
                    }
                }
            }
//            for (var i = 0; i < _Chart.xAxis[0].tickPositions.length; i++) {
//                PostionObj = Agi.Controls.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[i]].mark.d);
//                if (_X <= PostionObj.StartX) {
//                    if (i > 0) {
//                        var FirstPostionObj = Agi.Controls.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[i - 1]].mark.d);
//                        var SpceValueNumber = PostionObj.StartX - FirstPostionObj.StartX;
//                        var SpceValue = (_Chart.xAxis[0].tickPositions[i] - _Chart.xAxis[0].tickPositions[i - 1]);
////                        LineValue = (_X - FirstPostionObj.StartX) * SpceValue / SpceValueNumber + _Chart.xAxis[0].tickPositions[i - 1] + SpceValue / 2;
//                        LineValue = (_X - FirstPostionObj.StartX) * SpceValue / SpceValueNumber + _Chart.xAxis[0].tickPositions[i - 1];
//                        if (LineValue < _Chart.xAxis[0].tickPositions[0]) {
//                            LineValue = _Chart.xAxis[0].tickPositions[0];
//                        }
//                        if (LineValue > _Chart.xAxis[0].tickPositions[_Chart.xAxis[0].tickPositions.length - 1]) {
//                            LineValue = _Chart.xAxis[0].tickPositions[_Chart.xAxis[0].tickPositions.length - 1];
//                        }
//                        break;
//                    }
//                }
//            }
            if (LineValue == 0) {
                if (_X <= MinMaxPositionInfo.Min) {
                    LineValue=MinMaxPositionInfo.Min;
                }else{
                    LineValue = _Chart.xAxis[0].tickPositions[0];
                }
            }
        }
    } else {
        if (_Chart.yAxis[0].tickPositions != null && _Chart.yAxis[0].tickPositions.length > 0) {
            for (var i = 0; i < _Chart.yAxis[0].tickPositions.length; i++) {
                PostionObj = Agi.Controls.GetPostionObjByXYStr(_Chart.yAxis[0].ticks[_Chart.yAxis[0].tickPositions[i]].gridLine.d);
                if (_Y >= PostionObj.StartY) {
                    if (i > 0) {
                        var FirstPostionObj = Agi.Controls.GetPostionObjByXYStr(_Chart.yAxis[0].ticks[_Chart.yAxis[0].tickPositions[i - 1]].gridLine.d);
                        var SpceValueNumber = PostionObj.StartY - FirstPostionObj.StartY;
                        var SpceValue = (_Chart.yAxis[0].tickPositions[i - 1] - _Chart.yAxis[0].tickPositions[i]);
                        LineValue = (FirstPostionObj.StartY - _Y) * SpceValue / SpceValueNumber + _Chart.yAxis[0].tickPositions[i - 1];
                        if (LineValue < _Chart.yAxis[0].tickPositions[0]) {
                            LineValue = _Chart.yAxis[0].tickPositions[0];
                        }
                        if (LineValue > _Chart.yAxis[0].tickPositions[_Chart.xAxis[0].tickPositions.length - 1]) {
                            LineValue = _Chart.yAxis[0].tickPositions[_Chart.xAxis[0].tickPositions.length - 1];
                        }
                        break;
                    }
                }
            }
            if (LineValue == 0) {
                LineValue = _Chart.yAxis[0].tickPositions[0];
            }
        }
    }
    return LineValue;
}
Agi.Controls.GetLineOverValue.GetPostionObjByXYStr = function (_XY) {
    var PostionArray = _XY.split(" ");
    return {StartX: parseInt(PostionArray[1]), StartY: parseInt(PostionArray[2]), EndX: parseInt(PostionArray[4]), EndY: parseInt(PostionArray[5])};
}
//获取可移动范围
Agi.Controls.GetMoveMin_MaxValue=function(_Dir,_Chart){
    var Min_MaxValue={Min:0,Max:0};
    if(_Dir=="Vertical"){
        if(_Chart.xAxis[0].tickPositions!=null && _Chart.xAxis[0].tickPositions.length>1){
            Min_MaxValue.Min=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[0]].mark.d).StartX;
            Min_MaxValue.Max=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[_Chart.xAxis[0].tickPositions.length-1]].mark.d).StartX;
            var OneSpc=( Min_MaxValue.Max-Min_MaxValue.Min)/_Chart.xAxis[0].tickPositions.length;
            Min_MaxValue.Min=Min_MaxValue.Min-OneSpc;
            if( Min_MaxValue.Min<0){
                Min_MaxValue.Min=0;
            }
            Min_MaxValue.Max=Min_MaxValue.Max+OneSpc;
        }else{
            if(_Chart.xAxis[0].tickPositions!=null && _Chart.xAxis[0].tickPositions.length>0){
                var FirstPostionObj=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.xAxis[0].ticks[_Chart.xAxis[0].tickPositions[0]].mark.d);
                Min_MaxValue.Min=FirstPostionObj.StartX;
                Min_MaxValue.Max=FirstPostionObj.StartX;
            }
        }
    }else{
        if(_Chart.yAxis[0].tickPositions!=null && _Chart.yAxis[0].tickPositions.length>1){
            Min_MaxValue.Min=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.yAxis[0].ticks[_Chart.yAxis[0].tickPositions[_Chart.yAxis[0].tickPositions.length-1]].gridLine.d).StartY;
            Min_MaxValue.Max=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.yAxis[0].ticks[_Chart.yAxis[0].tickPositions[0]].gridLine.d).StartY;
            var OneSpc=( Min_MaxValue.Max-Min_MaxValue.Min)/_Chart.yAxis[0].tickPositions.length;
            Min_MaxValue.Max=Min_MaxValue.Max-OneSpc;
        }else{
            if(_Chart.yAxis[0].tickPositions!=null && _Chart.yAxis[0].tickPositions.length>0){
                var FirstPostionObj=Agi.Controls.GetLineOverValue.GetPostionObjByXYStr(_Chart.yAxis[0].ticks[_Chart.yAxis[0].tickPositions[0]].gridLine.d);
                Min_MaxValue.Min=FirstPostionObj.StartY;
                Min_MaxValue.Max=FirstPostionObj.StartY;
            }
        }
    }
    return Min_MaxValue;
}
//移除标准线
Agi.Controls.RemoveStandardLine=function(chart,_LineID,_ControlObj){
    var BolIsVertical=false;
    var BolIsExtLine=false;
    if(chart.xAxis[0].plotLinesAndBands!=null && chart.xAxis[0].plotLinesAndBands.length>0){
        for(var i=0;i<chart.xAxis[0].plotLinesAndBands.length;i++){
            if(chart.xAxis[0].plotLinesAndBands[i].id==_LineID){
                BolIsVertical=true;
                BolIsExtLine=true;
                break;
            }
        }
    }
    if(!BolIsExtLine){
        if(chart.yAxis[0].plotLinesAndBands!=null && chart.yAxis[0].plotLinesAndBands.length>0){
            for(var i=0;i<chart.yAxis[0].plotLinesAndBands.length;i++){
                if(chart.yAxis[0].plotLinesAndBands[i].id==_LineID){
                    BolIsExtLine=true;
                    break;
                }
            }
        }
    }
    if(BolIsExtLine){
        if(BolIsVertical){
            chart.xAxis[0].removePlotLine(_LineID);
        }else{
            chart.yAxis[0].removePlotLine(_LineID);
        }
        if($("#Menu_"+_LineID).length>0){
            $("#Menu_"+_LineID).remove();
        }

    }
}
//根据标准线ID 获取控件对象中
Agi.Controls.BightChartLineObjById=function(_LineID,_ControlObj){
    var ChartOption=_ControlObj.Get("ChartOption");
    var ChartLIneObj=null;
    if(ChartOption!=null && ChartOption.PlotLines.yplotlines!=null
        && ChartOption.PlotLines.yplotlines.length){
        for(var i=0;i<ChartOption.PlotLines.yplotlines.length;i++){
            if(ChartOption.PlotLines.yplotlines[i].id==_LineID){
                ChartLIneObj=ChartOption.PlotLines.yplotlines[i];
                break;
            }
        }
    }

    if(ChartLIneObj==null){
        if(ChartOption!=null && ChartOption.PlotLines.xplotlines!=null
            && ChartOption.PlotLines.xplotlines.length){
            for(var i=0;i<ChartOption.PlotLines.xplotlines.length;i++){
                if(ChartOption.PlotLines.xplotlines[i].id==_LineID){
                    ChartLIneObj=ChartOption.PlotLines.xplotlines[i];
                    break;
                }
            }
        }
    }
    return ChartLIneObj;
}
//根据垂直标准线获取垂直标准线的值，数组
Agi.Controls.BightChartLineYLineValues=function(_ControlObj){
    var ItemsValue=[];
    var ChartOption=_ControlObj.Get("ChartOption");
    if(ChartOption!=null && ChartOption.PlotLines.yplotlines!=null
        && ChartOption.PlotLines.yplotlines.length){
        for(var i=0;i<ChartOption.PlotLines.yplotlines.length;i++){
            ItemsValue.push(ChartOption.PlotLines.yplotlines[i].value);
        }
    }
    return ItemsValue;
}
//更新Point点颜色，根据水平标准线
Agi.Controls.BightChartUpPointColorByXLine=function(Me){
    var chart=Me.Get("Property").BasciObj;
    var ChartOption=Me.Get("ChartOption");
    if(ChartOption!=null && ChartOption.PlotLines.xplotlines!=null
        && ChartOption.PlotLines.xplotlines.length){
        var tempxplotLines=[];
        for(var i=1;i<ChartOption.PlotLines.xplotlines.length;i++){
            if(ChartOption.PlotLines.xplotlines[i].value<ChartOption.PlotLines.xplotlines[i-1].value){
                tempxplotLines.push(ChartOption.PlotLines.xplotlines[i-1].value);
                ChartOption.PlotLines.xplotlines[i-1]=ChartOption.PlotLines.xplotlines[i].value;
                ChartOption.PlotLines.xplotlines[i].value=tempxplotLines[0];
                i=0;
            }
        }
        tempxplotLines=null;

        var SeriesData=null;
        for (var i = 0; i < chart.series.length; i++) {
            //SeriesData=chart.series[i].data;
            SeriesData=chart.series[i].points;
            if(SeriesData!=null && SeriesData.length>0){
                for (var j = 0; j < SeriesData.length; j++) {
                    for(var z=0;z<ChartOption.PlotLines.xplotlines.length;z++){
                        if (SeriesData[j].y > ChartOption.PlotLines.xplotlines[z].value) {
                            SeriesData[j].update({marker: {fillColor:ChartOption.PlotLines.xplotlines[z].color}},false);
                        } else {
                            SeriesData[j].update({marker: {fillColor: null}},false);
                        }
                    }
                }
            }
        }
    }
}
//endregion

//特征值计算、统计
Agi.Controls.BightChartCharacteristicTols=function(Me,SeriesData,CallbackFunction){
    var Property = Me.Get("ProPerty");
    var ChartOption =Me.Get("ChartOption");
    var ALLPointData=[];
    var ALLPointSum=0;
    var pointarray=[];
    if(SeriesData!=null && SeriesData.length>0){
        pointarray.push(SeriesData[0].x);
        pointarray.push(SeriesData[SeriesData.length-1].x);
        for(var i=0;i<SeriesData.length;i++){
            ALLPointData.push(SeriesData[i].y);
            ALLPointSum+=SeriesData[i].y;
        }
        ChartOption.Characteristic.MEAN.Value=ALLPointSum/ALLPointData.length;//均值
        ChartOption.Characteristic.MAX.Value=Agi.FunLibrary.Items.MaxValue(ALLPointData);//获取最大值
        ChartOption.Characteristic.MIN.Value=Agi.FunLibrary.Items.MinValue(ALLPointData);//获取最小值
        ChartOption.Characteristic.DEVIAT.Value=Agi.FunLibrary.Items.Deviation(ALLPointData);//离差
        ChartOption.Characteristic.STED.Value=Agi.FunLibrary.Items.SDValue(ALLPointData);//标准差
        //回调处理
        CallbackFunction({chtis:ChartOption.Characteristic,pointarray:pointarray,seriesdata:SeriesData});
    }else{
        ChartOption.Characteristic.MEAN.Value=null;//均值
        ChartOption.Characteristic.MAX.Value=null;//最大值
        ChartOption.Characteristic.MIN.Value=null;//最小值
        ChartOption.Characteristic.MIN.Value=null;//最小值
        ChartOption.Characteristic.MIN.Value=null;//最小值
    }
}
Agi.Controls.BightChartTooltipsFormat=function(_pointObj,xAsixType){
    var TooltipsHTML="";
    if(_pointObj.points!=null && _pointObj.points.length>0){
        var temstr="";
        for(var i=0;i<_pointObj.points.length;i++){
            if (_pointObj.points[i].series.name === "最大值"){
                TooltipsHTML+= '最大值：' + _pointObj.points[i].y + '<br/>';
                continue;
            }
            if (_pointObj.points[i].series.name === "最小值"){
                TooltipsHTML+= '最小值：' + _pointObj.points[i].y + '<br/>';
                continue;
            }
            if (_pointObj.points[i].series.name === "均值"){
                TooltipsHTML+= '均值：' + _pointObj.points[i].y + '<br/>';
                continue;
            }
            if (_pointObj.points[i].series.name === "离差"){
                TooltipsHTML+= '离差：' + _pointObj.points[i].y + '<br/>';
                continue;
            }
            if (_pointObj.points[i].series.name === "标准差"){
                TooltipsHTML+= '标准差：' + _pointObj.points[i].y + '<br/>';
                continue;
            }
            if (_pointObj.points[i].series.name === "数据"){
                if(xAsixType=="date"){
                    TooltipsHTML+="x:<b>";
                    TooltipsHTML+=new Date(_pointObj.points[i].x).format("yyyy-MM-dd hh:mm:ss.S");
                    TooltipsHTML+="</b><br/>y:" +_pointObj.points[i].y+" <br/>";
                }else{
                    TooltipsHTML=TooltipsHTML+"x:<b>" + _pointObj.points[i].x + "</b> <br/>y:" +_pointObj.points[i].y+"<br/>";
                }
                continue;
            }

        }
    }else{
        if(xAsixType=="date"){
            TooltipsHTML+="x:<b>" ;
            TooltipsHTML+=new Date(_pointObj.points[i].x).format("yyyy-MM-dd hh:mm:ss.S");
            TooltipsHTML=TooltipsHTML+"</b> <br/>y:" +_pointObj.y;
        }else{
            TooltipsHTML=TooltipsHTML+"x:<b>" + _pointObj.x + "</b> <br/>y:" +_pointObj.y;
        }
    }
    return TooltipsHTML;
}
//获取数据X轴的类型
Agi.Controls.BightChartGetDataType=function(_data){
    var type="date";
    try{
        if(!isNaN(_data)){
            type="number";
        }
    }catch(ev){
        type="date";
    }
    return type;
}

//2.查找异常点
Agi.Controls.BightChartAlarmDataPointsFind=function(_GridData,_ColumnName,_ChartSeires,_markercolor){
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
//3.更新垂直范围线的显示值
Agi.Controls.BightChartVLineValueInfoUpShow=function(_Control){
    var ThisChartOption=_Control.Get("ChartOption");
    if(ThisChartOption.PlotLines.yplotlines!=null && ThisChartOption.PlotLines.yplotlines.length>0){
        $("#BightChart_yplotcolor").spectrum("set",ThisChartOption.PlotLines.yplotlines[0].color);
        $("#BightChart_yplotwidth").val(ThisChartOption.PlotLines.yplotlines[0].width);
        if(ThisChartOption.DataType=="date"){
            $("#BightChart_YStart").val(new Date(ThisChartOption.PlotLines.yplotlines[0].value).format("yyyy-MM-dd hh:mm:ss.S"));
            $("#BightChart_YEnd").val(new Date(ThisChartOption.PlotLines.yplotlines[1].value).format("yyyy-MM-dd hh:mm:ss.S"));
        }else{
            $("#BightChart_YStart").val(ThisChartOption.PlotLines.yplotlines[0].value);
            $("#BightChart_YEnd").val(ThisChartOption.PlotLines.yplotlines[1].value);
        }
    }
}