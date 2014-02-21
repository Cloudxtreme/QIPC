/**
 * Created with JetBrains WebStorm.
 * User: yangyu
 * Date: 13-1-21
 * Time: 上午10:25
 * To change this template use File | Settings | File Templates.
 * DataChart：大数据Chart
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.DataChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        Render:function (_Target) {//_Target==显示到的容器
            var self = this;
            var obj = null;
            if (typeof(_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var ThisHTMLElement = self.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj);
            }
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }

        }, //将控件添加到指定的容器
        ReadData:function (_EntityInfo) {
            var self = this;
            Agi.Utility.RequestData(_EntityInfo, function (d) {
                var dateExp=/[1-2]\d{3}(-|\/)\d{1,2}(-|\/)\d{1,2}\s+[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/;
                if (d != null && d.length > 0) {
                    _EntityInfo.Columns.length = 0;
                    for (var _param in d[0]) {
                        _EntityInfo.Columns.push(_param);
                    }
                }
                if(_EntityInfo.Columns.length<2||!dateExp.test(d[0][_EntityInfo.Columns[0]])){
                    return;
                }
                _EntityInfo.Data = d;
                self.AddEntity(_EntityInfo);   //修改添加
            });
        }, //添加实体方法  AddEntity方法
        AddEntity:function (_entity) {//添加实体
            if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
                var Me = this;
                var Entitys = Me.Get("Entity");
                var bolIsEx = false;
                if (Entitys != null && Entitys.length > 0) {
                    Entitys = [];
                }
                if (!bolIsEx) {
                    Entitys.push(_entity);
                }
                Me.Set("Entity", Entitys);
                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                var ChartSerieslength = ThisChartObj.series.length;
                for (var i = 0; i < ChartSerieslength; i++) {
                    ThisChartObj.series[0].remove();
                }
                var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
                for (var i = 0; i < Entitys.length; i++) {
                    if (i < THisChartDataArray.length) {
                        THisChartDataArray.splice(i, 1);
                        i = 0;
                    }
                }
                var THisChartDataArray = [];
                var ChartXAxisArray = [];
                var _ChartOptions = Me.Get("ChartOptions");
//                var _Newcolor = Agi.Controls.DataChart.OptionsAppStyGetColorByIndex(0,_ChartOptions.colors);
                var isFirstColumn=true;
                for(var item in _entity.Columns){
                    if(isFirstColumn){
                        isFirstColumn=false;
                    } else {
                        THisChartDataArray.push({
                            name:_entity.Columns[item],
                            data:Agi.Controls.DataChart.ProcessData( _entity,item),
                            type:"spline",
                            linecolor:'#a90000',
                            color:'#a90000',
                            YgridLineWidth:0,
                            YgridLineColor:"",
                            fillColor : {
                                linearGradient : {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops : [[0, '#a90000'],[1, '#999']]
                            },
                            yAxis:null,
                            Entity:_entity,
                            XColumn:_entity.Columns[0],
                            YColumn:_entity.Columns[item],
                            center:null,
                            size:null
                        });
                        if(THisChartDataArray.length>=2){
                            break;
                        }
                    }
                }
                /*
                THisChartDataArray.push({
                    name:"销量",
                    data:Agi.Controls.DataChart.ProcessData(ChartXAxisArray, _entity),
                    type:"areaspline",
                    linecolor:'#a90000',
                    color:'#a90000',
                    yAxis:null,
                    Entity:_entity,
                    XColumn:_entity.Columns[0],
                    YColumn:_entity.Columns[1],
                    center:null,
                    size:null});
                    */
//                _Newcolor = Agi.Controls.DataChart.OptionsAppStyGetColorByIndex(1, _ChartOptions.colors);
                /*
                THisChartDataArray.push({ name:"产量",
                    data: Agi.Controls.DataChart.ProcessDataByArray(ChartXAxisArray,Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0],_entity.Columns[2]])),
                    type:"column",yAxis:null, color:'#a90000', Entity: _entity, XColumn: _entity.Columns[0], YColumn:_entity.Columns[2],center:null,size:null});
                    */
                //_Newcolor = null;
                ThisChartObj.setSize(ThisChartObj.chartWidth, ThisChartObj.chartHeight);
               // Me.Set("ChartXAxisArray", ChartXAxisArray);//图表Chart X轴相应的显示点集合
                //var ThisChartXAxisArray = ChartXAxisArray;
                Me.Set("ChartData", THisChartDataArray);
                _ChartOptions.plotOptions.series.point.events = {
                    click:function () {
                        Me.Set("OutPramats", {"XValue":ChartXAxisArray[this.x], "Yvalue":this.y});
                        /*输出参数更改*/
                    }
                };
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.DataChartShowSeriesPanel(Me);
                }
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(Me);//更新实体数据显示
                }
                Me.Refresh();
            } else {
                AgiCommonDialogBox.Alert("您添加的实体无数据！");
            }
        }, //添加实体。
        AddColumn:function (_entity, _ColumnName) {
            var THisChartDataArray = this.Get("ChartData");
            if(THisChartDataArray!=null && THisChartDataArray.length>=3){
                AgiCommonDialogBox.Alert("该图表最多只支持3列数据!");
                return;
            }
            for(var item in THisChartDataArray){
                if(THisChartDataArray[item].name==_ColumnName){
                    return;
                }
            }
            var i=0;
            while(i<_entity.Columns.length){
                if(_entity.Columns[i]==_ColumnName){
                    break;
                }
                i++;
            }
            if(i>=_entity.Columns.length||i<=0){
                return;
            }
            THisChartDataArray.push({
                name:_ColumnName,
                data:Agi.Controls.DataChart.ProcessData( _entity,i),
                type:"column",
                linecolor:'#a90000',
                color:'#a90000',
                YgridLineWidth:0,
                YgridLineColor:"",
                fillColor : {
                    linearGradient : {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops : [[0, '#a90000'],[1, '#999']]
                },
                yAxis:null,
                Entity:_entity,
                XColumn:_entity.Columns[0],
                YColumn:_entity.Columns[i],
                center:null,
                size:null
            });
            this.Set("ChartData", THisChartDataArray);
            this.Refresh();
        },//添加列
        ReadOtherData:function () {
        },
        getInsideControl: function () {
            var Me = this;
            return Me.Get("ProPerty").BasciObj;
        }, //返回第三方highchart 对象
        ReadRealData:function () {
        },
        ParameterChange:function () {
            var Me = this;
            Me.UpDateEntity(function () {
                Me.Refresh();//刷新显示
            });
        }, //有参数更改,外部通知调用
        GetConfig:function () {
            var Me = this;
            var ProPerty = this.Get("ProPerty");
            var DataChartControl = {
                Control:{
                    ControlType:null, //控件类型
                    ControlID:null, //控件ID
                    ControlBaseObj:null, //控件对象
                    HTMLElement:null, //控件外壳
                    SeriesData:null, //Series数据信息
                    Position:null, //控件位置，大小信息
                    ChartOptions:null, //控件属性
                    ChartThemeName:null, //控件样式名称
                    ChartType:"spline"//图表类型名称
                }
            };
            DataChartControl.Control.ControlType = Me.Get("ControlType");
            /*控件类型*/
            DataChartControl.Control.ControlID = ProPerty.ID;
            /*控件属性*/
            DataChartControl.Control.ControlBaseObj = ProPerty.ID;
            /*控件基础对象*/
            DataChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
            /*控件外壳ID*/

            var thischartSeriesData = Me.Get("ChartData");//图表线条Series数据
            var SeriesList = [];
            for (var i = 0; i < thischartSeriesData.length; i++) {
                SeriesList.push(Agi.Script.CloneObj(thischartSeriesData[i]));
                //SeriesList[i].data = null;
                if (SeriesList[i].Entity != null) {
                    SeriesList[i].Entity.Parameters = thischartSeriesData[i].Entity.Parameters;
                    SeriesList[i].Entity.Data = null;
                    SeriesList[i].data = null;
                }
            }
            DataChartControl.Control.SeriesData = SeriesList; //控件实体
            SeriesList = null;
            DataChartControl.Control.Position = Me.Get("Position"); //获取控件位置信息
            DataChartControl.Control.ChartOptions = Me.Get("ChartOptions"); //获取Chart Options信息
            DataChartControl.Control.ChartThemeName = Me.Get("ThemeName");//获取控件样式名称
            DataChartControl.Control.ChartType = Me.Get("ChartType");//控件类型名称

            return DataChartControl.Control; //返回配置字符串
        }, //保存信息。
        CreateControl:function (_Config, _Target) {
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    if (typeof (_Config.SeriesData) == "string") {
                        _Config.SeriesData = JSON.parse(_Config.SeriesData);
                    }
                    if (typeof (_Config.Position) == "string") {
                        _Config.Position = JSON.parse(_Config.Position);
                    }
                    if (typeof (_Config.ChartOptions) == "string") {
                        _Config.ChartOptions = JSON.parse(_Config.ChartOptions);
                    }
                    var Me = this;
                    Me.AttributeList = [];
                    var ThisEntitys = [];
                    var bolIsExt = false;
                    if (_Config.SeriesData != null && _Config.SeriesData.length > 0) {
                        for (var i = 0; i < _Config.SeriesData.length; i++) {
                            if (_Config.SeriesData[i].Entity != null && _Config.SeriesData[i].Entity != "") {
                                if (ThisEntitys.length > 0) {
                                    bolIsExt = false;
                                    for (var j = 0; j < ThisEntitys.length; j++) {
                                        if (ThisEntitys[j].Key == _Config.SeriesData[i].Entity.Key) {
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
                    }
                    bolIsExt = null;
                    Me.Set("ControlType", "DataChart");//类型
                    Me.Set("Entity", ThisEntitys);//实体
                    Me.Set("ChartData", _Config.SeriesData);//Series数据
                    Me.Set("ChartOptions", _Config.ChartOptions);//ChartOptions
                    var ThisChartXAxisArray = _Config.ChartOptions.xAxis.categories;
                    _Config.ChartOptions.plotOptions.series.point.events = {
                        click:function () {
                            Me.Set("OutPramats", {"XValue":ThisChartXAxisArray[this.x], "Yvalue":this.y});
                            /*输出参数更改*/
                        }
                    };
                    Me.Set("ChartOptions", _Config.ChartOptions); //ChartOptions
                    var ID = _Config.ControlID;
                    var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty DataChartPanelSty'></div>");
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
                    var StartPoint = {X:0, Y:0};
                    HTMLElementPanel.dblclick(function (ev) {
                        if (!Agi.Controls.IsControlEdit) {
                            Agi.Controls.ControlEdit(Me);//控件编辑界面
                        }
                    });
                    if (HTMLElementPanel.touchstart) {
                        HTMLElementPanel.touchstart(function (ev) {
                            var editstate = Me.Get("EditState");
                            if (editstate != null && editstate) {
                            } else {
                                Agi.Controls.BasicPropertyPanel.Show(this.id);
                            }

                        });
                    } else {
                        HTMLElementPanel.mousedown(function (ev) {
                            var editstate = Me.Get("EditState");
                            if (editstate != null && editstate) {
                            } else {
                                Agi.Controls.BasicPropertyPanel.Show(this.id);
                            }
                        });
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
                    Me.UpDateEntity(function () {
                        Me.Refresh();
                    });
                }
            }
        }, //获取保存信息。
        Checked:function () {
            $("#" + this.Get("HTMLElement").id).css({"-webkit-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027"});
        }, //选中
        UnChecked:function () {
            $("#" + this.Get("HTMLElement").id).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
                "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});
        }, //取消选中
        UpDateEntity:function (_callBackFun) {
            var Me = this;
            var MeEntitys = Me.Get("Entity");
            var ChartXAxisArray = [];
            var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
            Agi.Controls.DataChart.LoadEntityData(MeEntitys, 0, THisChartDataArray, ChartXAxisArray, function () {
                Me.Set("ChartXAxisArray", ChartXAxisArray);//图表Chart X轴相应的显示点集合
                _callBackFun();
            });
        },
        UpDateSeriesData:function () {
            var Me = this;
            var ChartXAxisArray = [];
            var THisChartDataArray = Me.Get("ChartData");
            for (var i = 0; i < THisChartDataArray.length; i++) {
                THisChartDataArray[i].data = Agi.Controls.DataChart.ProcessData(ChartXAxisArray, THisChartDataArray[i].Entity)
            }
            Me.Set("ChartXAxisArray", ChartXAxisArray);//图表Chart X轴相应的显示点集合

        }, //更新SeriesData数据
        Init:function (_Target, _ShowPosition) {
            var Me = this;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "DataChart");
            var ID = "DataChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty DataChartPanelSty'></div>");
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
                HTMLElementPanel.width(300);
                HTMLElementPanel.height(200);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() -
                    (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() -
                    (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                obj.html("");
            }
            var ChartXAxisArray = [];
            var THisChartData = Agi.Controls.GetChartInitXTimeData();
            /*        var data =[];
             for(var i=0;i<1000000;i++)
             {
             var a =1183939200000+i*1000000;
             var b= Math.floor(Math.random()*1000);

             data.push([a,b])
             }*/
            var thischartSeriesData = [];
            thischartSeriesData.push({name:'测试数据', color:'#a90000', data:THisChartData, fillColor : {
                linearGradient : {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops : [[0, '#a90000'],[1, '#999']]
            },XColumn:"", YColumn:"",YgridLineWidth:0,YgridLineColor:"", type:'column', Entity:null});
            this.Set("ChartData", thischartSeriesData);//Chart数据
            this.Set("ChartXAxisArray", []);//图表Chart X轴相应的显示点集合
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
            /*进入编辑界面*/
            HTMLElementPanel.dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit && Agi.Edit) {
                    Agi.Controls.ControlEdit(Me);//控件编辑界面
                    // Me.Refresh();//控件本身X轴显示bug，刷新正常。
                }
            });
            /*进入编辑界面end*/
            /*判断鼠标和键盘事件*/
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    var editstate = Me.Get("EditState");
                    if (editstate != null && editstate) {
                    } else {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    }
                });
            } else {
                HTMLElementPanel.mousedown(function (ev) {
                    ev.stopPropagation();
                    var editstate = Me.Get("EditState");
                    if (editstate != null && editstate) {
                    } else {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    }
                });
            }
            /*事件判断end*/
            //事件绑定
            this.Set("Position", PostionValue);
            //参数联动初始化定义
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
            //参数联动  end
            obj = ThisProPerty = PagePars = PostionValue = THisOutParats = null;
            this.Set("ChartType", "spline");//Chart 图表类型
            this.Set("ThemeInfo", "darkbrown");
            //输出参数
            //Me.Refresh();
            //20130515 倪飘 解决bug，组态环境中拖入大数据图表以后拖入容器框控件，容器框控件会覆盖大数据图表控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        }, //控件初始化
        Refresh:function () {
            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HtmlElementID = Me.Get("HTMLElement").id;
            //禁用外壳的拖拽移动位置、更改大小 的事件和样式
            $("#" + HtmlElementID).draggable("destroy");
            $("#" + HtmlElementID).resizable("destroy");
            $("#" + HtmlElementID).removeClass("PanelSty");

            var ThisChartXAxisArray = Me.Get("ChartXAxisArray");//获取图表Chart X轴相应的显示点集合
            var ChartOptions = Me.Get("ChartOptions");
            var yAsixInfo=null;
            if(ChartOptions.yAxis!=null &&  ChartOptions.yAxis[0]!=null){
                yAsixInfo=ChartOptions.yAxis[0];
            }else{
                yAsixInfo={labels:{align:'right',style:{color:'#000000',fontSize:9},enabled:true}};
            }

            var thischartSeriesData = Me.Get("ChartData");//图表数据
            if(thischartSeriesData!=null && thischartSeriesData.length>1){
                ChartOptions.yAxis=[];
                var ThisChartHeight = $("#" + Me.Get("HTMLElement").id).height();
                var topheight=15;

                var SeriesHeight=(ThisChartHeight-topheight-100)/(thischartSeriesData.length+1);
                ChartOptions.yAxis.push({top:topheight,height:SeriesHeight*2,lineWidth: 0,gridLineWidth:thischartSeriesData[0].YgridLineWidth,gridLineColor:thischartSeriesData[0].YgridLineColor,labels:yAsixInfo.labels});
                for(var i=2;i<thischartSeriesData.length+1;i++){
                    ChartOptions.yAxis.push({top:(SeriesHeight*i+topheight),height:SeriesHeight,lineWidth: 0,gridLineWidth:thischartSeriesData[i-1].YgridLineWidth,gridLineColor:thischartSeriesData[i-1].YgridLineColor,labels:yAsixInfo.labels});
                }

                for(var item in thischartSeriesData){
                    thischartSeriesData[item].yAxis=parseInt(item);
                    thischartSeriesData[item].dataGrouping=null;
                }
            }else{
                if(thischartSeriesData!=null && thischartSeriesData.length==1){
                    ChartOptions.yAxis=[{lineWidth: 0,gridLineWidth:thischartSeriesData[0].YgridLineWidth,gridLineColor:thischartSeriesData[0].YgridLineColor,labels:yAsixInfo.labels}];
                    if(thischartSeriesData.length===1){
                        thischartSeriesData[0].yAxis=0;
                    }
                }else{
                    ChartOptions.yAxis=[];
                }
            }

            var ChartInitOption = ({
                chart:{
                    renderTo:HtmlElementID,
                    backgroundColor: ChartOptions.chart.backgroundColor,
                    borderColor: ChartOptions.chart.borderColor,
                    borderWidth: ChartOptions.chart.borderWidth,
                    className: ChartOptions.chart.className,
                    style:{
                        zIndex:0
                    },
                    zoomType:'x',
                    alignTicks: false,
                    reflow:false
                    /*
                    events: {
                        load: function (e) {
                            $(this.container).find('>svg>rect').attr('fill-opacity',0);
                            $(this.container).find('>svg>g:eq(0)').css('display','none');
                        },
                        redraw: function () {
                        }
                    }*/
                },
                title: ChartOptions.title,
                credits:{
                    enabled:false
                },
                navigator:{
                    series:{
                        type:"area"
                    }
                },
                xAxis:ChartOptions.xAxis,
                yAxis:ChartOptions.yAxis,
                scrollbar:{enabled:false},
                rangeSelector:{
                    enabled:false,
                    selected:false
                },
                legend:{enabled:false},
                exporting_enabled:false,
                series:thischartSeriesData
            });

            //region 20130523 15:10 markeluo 修改
            if(MePrority.BasciObj!=null && MePrority.BasciObj!=null){
                try{
                    MePrority.BasciObj.destroy();//清除原Chart对象
                    $("#"+HtmlElementID).html("");
                }catch(e){
                }
            }
            //endregion

            var DataControlObj = new Highcharts.StockChart(ChartInitOption);
            MePrority.BasciObj = DataControlObj;
            Me.Set("ChartXAxisArray", ThisChartXAxisArray)

            //如果非编辑状态获取外壳
            if (!Agi.Controls.IsControlEdit) {
                $("#" + HtmlElementID).addClass("PanelSty");
            }
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.DataChartShowSeriesPanel(Me);
            }
        },
        PostionChange:function (_Postion, IsResizable) {
            var Me = this;
            if (IsResizable != null && IsResizable) {
                Me.Set("IsResizable", true);
            } else {
                Me.Set("IsResizable", false);
            }
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
                var PagePars = {Width:ParentObj.width(), Height:ParentObj.height(),
                    Left:ParentObj.offset().left, Top:ParentObj.offset().top};
                var ThisControlPars = {Width:ThisHTMLElementobj.width(), Height:ThisHTMLElementobj.height(),
                    Left:(ThisHTMLElementobj.offset().left - PagePars.Left), Top:(ThisHTMLElementobj.offset().top - PagePars.Top),
                    Right:0, Bottom:0};
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
                //移除拖拽、更改大小效果
                $("#" + Agi.Controls.EditControlElementID).draggable("destroy");
                $("#" + Agi.Controls.EditControlElementID).resizable("destroy");
                $("#" + Agi.Controls.EditControlElementID).removeClass("PanelSty");
                Me.Refresh();
            }
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.DataChartShowSeriesPanel(Me);
            }
        },
        ControlAttributeChangeEvent:function (_obj, Key, _Value) {
            Agi.Controls.DataChartAttributeChange(this, Key, _Value);
        },
        CustomProPanelShow:function () {
            Agi.Controls.DataChartProrityInit(this);
        }, //显示自定义面板。
        Destory:function () {
            var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
            var proPerty = this.Get("ProPerty");
            $(HTMLElement).remove();
            HTMLElement = null;
            var Me = this;
            Me.AttributeList.length = 0;
            proPerty = null;
            delete this
        }, //删除
        Copy:function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left:parseFloat(PostionValue.Left), Top:parseFloat(PostionValue.Top) }
                var Newdropdownlist = new Agi.Controls.BasicChart();
                Newdropdownlist.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return Newdropdownlist;
            }
        }, // 复制
        RemoveSeries:function (_SeriesName) {
            var Me = this;
            var THisChartDataArray = Me.Get("ChartData");//获取原图表Data
            var ThisBaseObj = Me.Get("ProPerty").BasciObj;

            var RemoveIndex = -1;
            for (var i = 0; i < THisChartDataArray.length; i++) {
                if (THisChartDataArray[i].name === _SeriesName) {
                    RemoveIndex = i;
                    break;
                }
            }
            if (RemoveIndex > -1) {
                var EntityKey = THisChartDataArray[RemoveIndex].Entity.Key;
                //ThisBaseObj.series[RemoveIndex].remove();
                THisChartDataArray.splice(RemoveIndex, 1);
                //移除Series时，移除Entity markeluo 20130525 17:53 新增
                Agi.Controls.DataChart.RemoveSeriesEntityArray(Me, EntityKey, THisChartDataArray);
            }
            Me.Set("ChartData",THisChartDataArray);
            //Me.UpDateSeriesData();
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
                    Agi.Controls.DataChartShowSeriesPanel(Me);
                }
            }
            Me.Refresh();
        }, //移除Entity
        InEdit:function () {
            var Me = this;
            Me.Set("EditState", true);//编辑
            Me.UnChecked();
            Me.Refresh();
        }, //编辑中
        ExtEdit:function () {
            var Me = this;
            if ($("#menuDatachartseriesdiv").length > 0) {
                $("#menuDatachartseriesdiv").remove();
            }
            if (Me.Get("HTMLElement") != null) {
                Me.Checked();
            }
            Me.Set("EditState", false);//非编辑
            Me.Refresh();
        }//退出编辑
    });

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDataChart = function () {
    return new Agi.Controls.DataChart();
};
//位置修改、参数联动、初始化
Agi.Controls.DataChartAttributeChange = function (_ControlObj, Key, _Value) {
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

            var bolIsResizable = _ControlObj.Get("IsResizable");
            var ThisControlPars = {Width:parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                Height:parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))};
            ThisHTMLElementobj.width(ThisControlPars.Width);
            ThisHTMLElementobj.height(ThisControlPars.Height);
            /*Chart 更改大小,以及整体刷新*/
            //region 20130523 17:12 markeluo 修改 (当控件高度更改不超过10时，则只刷新控件整体高度显示，不进行重绘计算分区高度)
            if(Math.abs(ThisControlObj.chartHeight-ThisControlPars.Height)>10){
                _ControlObj.Refresh()
            }else{
                ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
                ThisControlObj.Refresh();
            }
            //endregion
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
            }   //参数联动
            Agi.Msg.PageOutPramats.PramatsChange({   /*Chart 输出参数更改*/
                "Type":Agi.Msg.Enum.Controls,
                "Key":ThisControlPrority.ID,
                "ChangeValue":ThisOutPars
            });
            Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj, "Type":Agi.Msg.Enum.Controls});
        }
        //通知消息模块，参数发生更改
    } else if (Key == "ThemeInfo") {//主题更改
        var ChartOptions = Agi.Controls.DataChart.GetManagerThemeInfo(_ControlObj, _Value);//获得处理后的主题信息值
        ChartOptions.xAxis.labels.enabled =false;
        ChartOptions.xAxis.lineWidth=0;
        _ControlObj.Set("ChartOptions", ChartOptions);
        _ControlObj.Refresh();//刷新显示
    }
};
/* _ThemeName:主题名称(非样式，图表内置主题)*/
Agi.Controls.DataChart.GetManagerThemeInfo = function (_ControlObj, _ThemeValue) {
    var ThisChartXAxisArray = _ControlObj.Get("ChartXAxisArray");
    /*获取图表Chart X轴相应的显示点集合*/
    var ChartOptions = Agi.Controls.GetChartOptionsByTheme(_ThemeValue);
    if (ThisChartXAxisArray != null && ThisChartXAxisArray.length > 0) {
        ChartOptions.xAxis.categories = ThisChartXAxisArray;
    }
    var thischartoptions = _ControlObj.Get("ChartOptions");
    var seriesStacking = null;
    if (thischartoptions != null && thischartoptions.plotOptions != null && thischartoptions.plotOptions.series.stacking != null) {
        seriesStacking = thischartoptions.plotOptions.series.stacking;
        for (var i = 0; i < ThisChartXAxisArray.length; i++) {
            this.x[i] = ThisChartXAxisArray[i];
        }
    }
    ChartOptions.plotOptions = {
        Data:{
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
        series:{
            marker:{
                radius:3
            },
            cursor:'pointer',
            point:{
                events:{
                    click:function () {
                        _ControlObj.Set("OutPramats", {"XValue":ThisChartXAxisArray[this.x], "Yvalue":this.y});
                    }
                }
            },
            states:{
                hover:{
                    enabled:false
                }
            },
            stacking:seriesStacking
        }
    };

    if (thischartoptions != null && thischartoptions.title != null) {
        ChartOptions.title = thischartoptions.title;
    }
    return ChartOptions;
};
//根据Series 索引获取对应的默认显示显示
Agi.Controls.DataChart.OptionsAppStyGetColorByIndex = function (_index, _ColorArray) {
    if (_index < _ColorArray.length) {
        return _ColorArray[_index];
    } else {
        return _ColorArray[_index % _ColorArray.length];
    }
};
//添加新Series时，新建一个Series名称（为后面拓展添加多条Series命名用，本控件可以不用此方法）
Agi.Controls.DataChartNewSeriesName = function (_ChartDataArray) {
    var newDataChartSeriesName = "";
    if (_ChartDataArray != null && _ChartDataArray.length > 0) {
        var SeriesNamesArray = [];
        for (var i = 0; i < _ChartDataArray.length; i++) {
            SeriesNamesArray.push(_ChartDataArray[i].name);
        }
        newDataChartSeriesName = Agi.Controls.DataChartSeriesNameCreate(SeriesNamesArray);
        SeriesNamesArray = null;
        maxIndex = null;
    } else {
        newDataChartSeriesName = "Series0";
    }
    return newDataChartSeriesName;
};
//创建一个可用的名称
Agi.Controls.DataChartSeriesNameCreate = function (_Names) {
    var newDataChartSeriesName = "";
    if (_Names != null && _Names.length > 0) {
        var StartIndex = -1;
        var MaxIndex = -1;
        for (var i = 0; i < _Names.length; i++) {
            StartIndex = _Names[i].indexOf("Series");
            if (StartIndex > -1) {
                var _ThisNumber = _Names[i].substring((StartIndex + 6));
                if (!isNaN(_ThisNumber)) {
                    if (eval(_ThisNumber) > MaxIndex) {
                        MaxIndex = eval(_ThisNumber);
                    }
                }
            }
        }
        newDataChartSeriesName = "Series" + (MaxIndex + 1);
        StartIndex = MaxIndex = null;
    } else {
        newDataChartSeriesName = "Series0";
    }
    return newDataChartSeriesName;
};
//Chart 实体数据加载 可拓展添加多实体
Agi.Controls.DataChart.LoadEntityData = function (MeEntitys, thisindex, THisChartDataArray, ChartXAxisArray, _callBackFun) {
    var Me = this
    if (thisindex < MeEntitys.length) {
        var THisEntity = MeEntitys[thisindex];
        Agi.Utility.RequestData(THisEntity, function (d) {
            THisEntity.Data = d;
            for(var i=0;i<THisChartDataArray.length;i++){
                THisChartDataArray[i].data=Agi.Controls.DataChart.ProcessDataByArray(ChartXAxisArray,
                    Agi.Controls.EntityDataConvertToArrayByColumns(THisEntity, [THisEntity.Columns[0],THisEntity.Columns[i+1]]));
            }
            _callBackFun();
        });
    }else{
        _callBackFun();
    }
}
//面板的显示。
Agi.Controls.DataChartProrityInit = function (_DataChart) {
    //1、获取需要添加的图形；
    //2、采用js添加HTMl到页面模块
    //3、调用模块结构显示
    //4、绑定div内控制控件的属性。
    var Me = _DataChart;
    var ThisProPerty = Me.Get("ProPerty");
    var DataChartProperty = ThisProPerty.BasciObj;
    var ThisProItems = [];
    var ItemContent = new Agi.Script.StringBuilder(); //添加到新的数组中
    ItemContent.append("<div class='DataChart_Pro_Panel' >");
    ItemContent.append("<table class='DataPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DataChartTabletd0'>控件标题：</td><td colspan='3' class='DataChartTabletd1'>" +
        "<input id='DataChart_Titletxt' type='text' style='width:60%;' maxlength='15'>" + //20130427 倪飘 解决bug大数据图表，标题未做限制，应只能输入15位，第16位无法输入
        "<div id='DataChart_TitleSave' class='DataChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DataChartTabletd0'>字体样式：</td>" +
        "<td class='DataChartTabletd1'><select id='DataChart_TitleFontSty'>" +
        "<option selected='selected' value='宋体'>宋体</option><option value='微软雅黑'>微软雅黑</option>" +
        "<option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='DataChartTabletd0'>粗体样式：</td>" +
        "<td class='DataChartTabletd1'><select id='DataChart_TitleFontWeight'>" +
        "<option selected='selected' value='bold'>粗体</option>" +
        "<option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DataChartTabletd0'>字体大小：</td>" +
        "<td class='DataChartTabletd1'><input id='DataChart_TitleFontSize' type='number' value='14' min='8' max='30'/></td>");
    ItemContent.append("<td class='DataChartTabletd0'>字体颜色：</td>" +
        "<td class='DataChartTabletd1'><input id='DataChart_TitleFontColor' type='text' value='#000000' class='DataChartLine'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DataChartTabletd0'>标题位置：</td><td class='DataChartTabletd1'>" +
        "<select id='DataChart_TitleHorDir'>" +
        "<option value='left'>居左</option>" +
        "<option value='center' selected='selected'>居中</option>" +
        "<option value='right'>居右</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var DataObj = $(ItemContent.toString());
    //背景颜色
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='dataChart_Pro_Panel'>");
    ItemContent.append("<table class='dcprortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>图表背景：</td><td colspan='3' class='dcprortityPanelTabletd1'><div id='DataChart_bgvalue' class='DataChart_ColorControl' style='float:left;background-color:#ffffff;'/></div><div id='DataChart_BackgroundSave' class='DataChartPropSavebuttonsty' title='保存' style='float: left;margin-top:6px;'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>水平网格线：</td><td class='dcprortityPanelTabletd1'><input id='DataChart_YGridLineSize' type='number' value='0' defaultvalue='0' min='0' max='5' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>线条颜色：</td><td class='dcprortityPanelTabletd1'><div id='DataChart_YGridLineColor' class='DataChartColorSelsty DataChart_ColorControl' style='background-color:#a4a4a4;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>垂直网格线：</td><td class='dcprortityPanelTabletd1'><input id='DataChart_XGridLineSize' type='number' value='0' defaultvalue='0' min='0' max='5' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>线条颜色：</td><td class='dcprortityPanelTabletd1'><div id='DataChart_XGridLineColor' class='DataChartColorSelsty DataChart_ColorControl' style='background-color:#a4a4a4;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BackGroundObj = $(ItemContent.toString());
    //背景颜色

    var ThisChartData = _DataChart.Get("ChartData");
    var DataLinesObj = null;
    if (ThisChartData != null && ThisChartData.length > 0) {
        ItemContent = null
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='DataChart_Pro_Panel'>");
        ItemContent.append("<table class='DataChartPanelTable'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DataChartPanelTabletd0'>曲线名称：</td>");
        ItemContent.append("<td colspan='3' class='DataChartPanelTabletd2'><input id='DataTxtProPanelLineName' type='text'  value='" + ThisChartData[0].name + "' readonly/><div id='DataChartSeriesLineSave'  class='DataChartPropSavebuttonsty' title='保存'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='DataChartPanelTabletd0'>曲线类型：</td><td class='DataChartPanelTabletd1'>" +
            "<select id='DataChart_Type'>" +
            "<option value='spline' selected='selected'>线性</option>" +
            "<option value='areaspline'>区域</option>" +
            "<option value='column'>柱形</option></select></td>");
        ItemContent.append("<td class='DataChartPanelTabletd0'>数据颜色：</td><td  class='DataChartPanelTabletd1'><input type='text' id='DataChartLineColorSel'  value='#058dc7'/></td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        DataLinesObj = $(ItemContent.toString());
    }

    //region XAxis
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='DataChart_Pro_Panel'>");
    ItemContent.append("<table class='DataChartPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>启用状态：</td><td colspan='3' class='dcprortityPanelTabletd1'><select id='DataChartXAxis'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select><div id='DataChart_XAxisSave' class='DataChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>字体大小：</td><td class='dcprortityPanelTabletd1'><input id='DataChart_XAxisFontSize' type='number' value='14' defaultvalue='14' min='8' max='40' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>字体颜色：</td><td class='dcprortityPanelTabletd1'><input type='text' id='DataChart_XAxisFontColor'  value='#000000'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>线条大小：</td><td class='dcprortityPanelTabletd1'><input id='DataChart_XAxisLineSize' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>线条颜色：</td><td class='dcprortityPanelTabletd1'><input type='text' id='DataChart_XAxisLineColor'  value='#000000'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>刻度长度：</td><td class='dcprortityPanelTabletd1'><input id='DataChart_XAxisLineTicklength' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>刻度颜色：</td><td class='dcprortityPanelTabletd1'><input type='text' id='DataChart_XAxisLineTickcolor'  value='#000000'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var XAxisObj=$(ItemContent.toString());
    //endregion

    //region YAxis
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='DataChart_Pro_Panel'>");
    ItemContent.append("<table class='dcprortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>启用状态：</td><td colspan='3' class='dcprortityPanelTabletd1'><select id='DataChartYAxis'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select><div id='DataChart_YAxisSave' class='DataChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>字体大小：</td><td class='dcprortityPanelTabletd1'><input id='DataChart_YAxisFontSize' type='number' value='14' defaultvalue='14' min='8' max='40' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='dcprortityPanelTabletd0'>字体颜色：</td><td class='dcprortityPanelTabletd1'><input type='text' id='DataChart_YAxisFontColor'  value='#969696'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var YAxisObj=$(ItemContent.toString());
    //endregion

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标题设置", DisabledValue: 1, ContentObj: DataObj }));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "背景颜色", DisabledValue: 1, ContentObj: BackGroundObj }));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据曲线", DisabledValue: 1, ContentObj: DataLinesObj }));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "XAxis", DisabledValue: 1, ContentObj: XAxisObj }));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "YAxis", DisabledValue: 1, ContentObj: YAxisObj }));
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems); //初始化面板显示
    //颜色选择器的 通用的
    $(".DataChartLine").spectrum({
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
            $("#DataChartLine").val(color.toHexString());
        }
    });
    //线条颜色专用
    $("#DataChartLineColorSel").val(ThisChartData[0].color);
    $("#DataChartLineColorSel").spectrum({
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
            //Me.SeriesColorChanged(color.toHexString());
            $("#DataChartLineColorSel").val(color.toHexString());//20130524 10:23 markeluo 大数据更改颜色不会立即更改显示效果，需要点击保存按钮进行保存
        }
    });
    //背景颜色
    $(".dataChartColorSelsty").spectrum({
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
        }
    });
    //对面板上的功能进行绑定。
    // 标题的处理

    var ChartOptions = Me.Get("ChartOptions");
    if (ChartOptions.title == null) {
        ChartOptions.title = {
            align: "center",
            floating: false,
            text: "",
            verticalAlign: null,
            style: {
                fontFamily: "微软雅黑",
                fontWeight: "bold",
                color: "#000000",
                fontSize: "14px"
            }
        }
    }
    ;
    $("#DataChart_TitleSave").die("click");
    $("#DataChart_TitleSave").live("click", function (ev) {
        ChartOptions.title = {
            align: $("#DataChart_TitleHorDir").val(),
            floating: false,
            text: $("#DataChart_Titletxt").val(),
            verticalAlign: null,
            style: {
                fontFamily: $("#DataChart_TitleFontSty").val(),
                fontWeight: $("#DataChart_TitleFontWeight").val(),
                color: $("#DataChart_TitleFontColor").val(),
                fontSize: $("#DataChart_TitleFontSize").val() + "px"
            }
        }
        Me.Get("ProPerty").BasciObj.setTitle(ChartOptions.title);
        Me.Set("ChartOptions", ChartOptions);
        //Me.Refresh();减少内存占用不刷新。
    });
    if (ChartOptions.title != null) {
        $("#DataChart_Titletxt").val(ChartOptions.title.text);
        $("#DataChart_TitleFontSty").find("option[value='" + ChartOptions.title.style.fontFamily + "']").attr("selected", "selected");
        $("#DataChart_TitleFontWeight").find("option[value='" + ChartOptions.title.style.fontWeight + "']").attr("selected", "selected");
        $("#DataChart_TitleFontSize").val(parseInt(ChartOptions.title.style.fontSize.replace("px", "")));
        $("#DataChart_TitleFontColor").spectrum("set", ChartOptions.title.style.color);
        $("#DataChart_TitleHorDir").find("option[value='" + ChartOptions.title.align + "']").attr("selected", "selected");
        // $("#DataChart_TitleVirDir").find("option[value='"+ChartOptions.title.verticalAlign+"']").attr("selected","selected");
        //影响标题显示位置。
    }

    //region xAsix 处理 20130524 13:54 markeluo 新增
    //1.1 绑定数据
    if (ChartOptions.xAxis != null) {
        if(ChartOptions.xAxis.labels==null){
            ChartOptions.xAxis.labels={
                style:{
                    fontFamily:'微软雅黑',
                    fontSize:9,
                    color:'#000000'
                }
            }
        }
        if(ChartOptions.xAxis.labels.style==null){
            ChartOptions.xAxis.labels.style={
                fontFamily:'微软雅黑',
                fontSize:9,
                color:'#000000'
            }
        }
        if(ChartOptions.xAxis.labels.style.fontSize==null){
            ChartOptions.xAxis.labels.style.fontSize=9;
        }
        $("#DataChart_XAxisFontSize").val(ChartOptions.xAxis.labels.style.fontSize);//字体大小

        if(ChartOptions.xAxis.labels.style.color==null){
            ChartOptions.xAxis.labels.style.color="#969696";
        }
        $("#DataChart_XAxisFontColor").val(ChartOptions.xAxis.labels.style.color);//字体颜色

        if(ChartOptions.xAxis.lineWidth==null){
            ChartOptions.xAxis.lineWidth=0;
        }
        $("#DataChart_XAxisLineSize").val(ChartOptions.xAxis.lineWidth);//线条大小

        if(ChartOptions.xAxis.tickLength==null){
            ChartOptions.xAxis.tickLength=0;
        }
        $("#DataChart_XAxisLineTicklength").val(ChartOptions.xAxis.tickLength);//刻度长度

        if(ChartOptions.xAxis.tickColor!=null){
            $("#DataChart_XAxisLineTickcolor").val(ChartOptions.xAxis.tickColor);//刻度颜色
        }else{
            $("#DataChart_XAxisLineTickcolor").val("#000000");//刻度颜色
        }
        if(ChartOptions.xAxis.lineColor!=null){
            $("#DataChart_XAxisLineColor").val(ChartOptions.xAxis.lineColor);//线条颜色
        }else{
            $("#DataChart_XAxisLineColor").val("#000000");//线条颜色
        }
        if(ChartOptions.xAxis.labels.enabled!=null){
            $("#DataChartXAxis").find("option[value='"+ChartOptions.xAxis.labels.enabled+"']").attr("selected","selected");
        }else{
            $("#DataChartXAxis").find("option[value='true']").attr("selected","selected");
        }
    }
    //1.2 格式化
    $("#DataChart_XAxisFontColor").spectrum({//字体颜色
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
            $("#DataChart_XAxisFontColor").val(color.toHexString());
        }
    });
    $("#DataChart_XAxisLineColor").spectrum({//线条颜色
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
            $("#DataChart_XAxisLineColor").val(color.toHexString());
        }
    });
    $("#DataChart_XAxisLineTickcolor").spectrum({//刻度颜色
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
            $("#DataChart_XAxisLineTickcolor").val(color.toHexString());
        }
    });

    /*1.3 XAsix 设置保存*/
    $("#DataChart_XAxisSave").unbind().bind("click",function(ev){
        var XAsixObj={
            XAsixIsEnable:$("#DataChartXAxis").val(),//是否启用
            XAsixfontsize:parseInt($("#DataChart_XAxisFontSize").val()),//字体大小
            XAsixfontcolor:$("#DataChart_XAxisFontColor").val(),//字体颜色
            XAsixLinesieze:parseInt($("#DataChart_XAxisLineSize").val()),//线条大小
            XAsixLinecolor:$("#DataChart_XAxisLineColor").val(),//线条颜色
            XAsixtickLength:parseInt($("#DataChart_XAxisLineTicklength").val()),//刻度长度
            XAsixtickColor:$("#DataChart_XAxisLineTickcolor").val()//刻度颜色
        }
        Agi.Controls.DataChart.XAsixApply(Me,XAsixObj);//XAsix 应用
    });
    //endregion

    //region yAsix 处理 20130524 13:54 markeluo 新增
    //1.1 绑定数据
    if (ChartOptions.yAxis.length>0 && ChartOptions.yAxis[0] != null) {

        if(ChartOptions.yAxis[0].labels==null){
            ChartOptions.yAxis[0].labels={
                style:{
                    fontFamily:'微软雅黑',
                    fontSize:9,
                    color:'#000000'
                },
                align:'right'
            }
        }
        if(ChartOptions.yAxis[0].labels.style==null){
            ChartOptions.yAxis[0].labels.style={
                fontFamily:'微软雅黑',
                fontSize:9,
                color:'#000000'
            }
        }
        if(ChartOptions.yAxis[0].labels.style.fontSize==null){
            ChartOptions.yAxis[0].labels.style.fontSize=9;
        }
        $("#DataChart_YAxisFontSize").val(ChartOptions.yAxis[0].labels.style.fontSize);//字体大小

        if(ChartOptions.yAxis[0].labels.style.color==null){
            ChartOptions.yAxis[0].labels.style.color="#969696";
        }
        $("#DataChart_YAxisFontColor").val(ChartOptions.yAxis[0].labels.style.color);//字体颜色

        if(ChartOptions.yAxis[0].labels.enabled!=null){
            $("#DataChartYAxis").find("option[value='"+ChartOptions.yAxis[0].labels.enabled+"']").attr("selected","selected");
        }else{
            $("#DataChartYAxis").find("option[value='true']").attr("selected","selected");
        }
    }

    //1.2 格式化
    $("#DataChart_YAxisFontColor").spectrum({//字体颜色
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
            $("#DataChart_YAxisFontColor").val(color.toHexString());
        }
    });
    /*1.3 YAsix 设置保存*/
    $("#DataChart_YAxisSave").unbind().bind("click",function(ev){
        var YAsixObj={
            YAsixIsEnable:$("#DataChartYAxis").val(),//是否启用
            YAsixfontsize:parseInt($("#DataChart_YAxisFontSize").val()),//字体大小
            YAsixfontcolor:$("#DataChart_YAxisFontColor").val()//字体颜色
        }
        Agi.Controls.DataChart.YAsixApply(Me,YAsixObj);//YAsix 应用
    });
    //endregion

    //字体大小处理
    //20130427 倪飘 解决bug，大数据图表，基本设置，字体大小未做限制，应为8-30，且不能输入负数
    $("#DataChart_TitleFontSize").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val.trim() === "") {
            $(this).val(parseInt(ChartOptions.title.style.fontSize.replace("px", "")));
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
        else {
            if (val >= MinNumber && val <= MaxNumber) {
                ChartOptions.title.style.FontSize = val + "px";
            }
            else {
                $(this).val(parseInt(ChartOptions.title.style.fontSize.replace("px", "")));
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
        }
    });

    //背景颜色处理
    if (ChartOptions.chart.backgroundColor != null) {
        var ThisChartbgvalue = Agi.Controls.DataChart.BackgroundValueGet(ChartOptions);
        $("#DataChart_bgvalue").css("background", ThisChartbgvalue.value.background).data('colorValue', ThisChartbgvalue); //设置默认项

        if (ChartOptions.xAxis.gridLineWidth != null) {
            $("#DataChart_XGridLineSize").val(parseInt(ChartOptions.xAxis.gridLineWidth)); //水平网格线宽度
        }
        if(ChartOptions.xAxis.gridLineColor!=null && ChartOptions.xAxis.gridLineColor!=""){
        }else{
            ChartOptions.xAxis.gridLineColor="#a4a4a4";
        }
        if (ChartOptions.xAxis.gridLineColor != null) {
            Agi.Controls.ControlColorApply.fColorControlValueSet("DataChart_XGridLineColor", ChartOptions.xAxis.gridLineColor, false); //水平网格线颜色
        }

        for (var yAxis in ChartOptions.yAxis) {
            if (ChartOptions.yAxis[yAxis].gridLineWidth != null) {
                $("#DataChart_YGridLineSize").val(parseInt(ChartOptions.yAxis[yAxis].gridLineWidth)); //水平网格线宽度
            }
            if(ChartOptions.yAxis[yAxis].gridLineColor!=null && ChartOptions.yAxis[yAxis].gridLineColor!=""){
            }else{
                ChartOptions.yAxis[yAxis].gridLineColor="#a4a4a4";
            }
            if (ChartOptions.yAxis[yAxis].gridLineColor != null) {
                Agi.Controls.ControlColorApply.fColorControlValueSet("DataChart_YGridLineColor", ChartOptions.yAxis[yAxis].gridLineColor, false);
            }
        }
    } else {
        var ThisChartbgvalue = Agi.Controls.DataChart.BackgroundValueGet(ChartOptions);
        $("#DataChart_bgvalue").css("background", ThisChartbgvalue.value.background).data('colorValue', ThisChartbgvalue); //设置默认项
    }

    $("#DataChart_bgvalue").unbind().bind("click", function () {
        var oThisSelColorPanel = this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel, [2], true, function (color) {
            if (color.direction === "radial") {
                AgiCommonDialogBox.Alert("该图表不支持此种渐变类型!");
            } else {
                //20130529 14:17 markeluo 提示背景只支持两种颜色
                if(color!=null && color.type==2 && color.stopMarker.length>2){
                    AgiCommonDialogBox.Alert("此背景渐变只支持两种颜色，将从多个颜色中取前两个颜色!");
                }
                $(oThisSelColorPanel).css("background", color.value.background).data('colorValue', color);
            }
            oThisSelColorPanel = null;
        });
    });
    $(".DataChartColorSelsty").unbind().bind("click", function () {
        var oThisSelColorPanel = this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel, [1, 2], false, function (color) {
            $(oThisSelColorPanel).css("background-color", color.value.background).data('colorValue', color);
            oThisSelColorPanel = null;
        });
    });
    $("#DataChart_BackgroundSave").unbind().bind("click", function (ev) {
        var color = $("#DataChart_bgvalue").data('colorValue');
        var BgColorValue = Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
        var BackgroudObj = {
            BolIsTransfor: BgColorValue.BolIsTransfor, //是否透明
            StartColor: BgColorValue.StartColor, //开始颜色
            EndColor: BgColorValue.EndColor, //结束颜色
            GradualChangeType: BgColorValue.GradualChangeType, //渐变方式
            XgridLineWidth: $("#DataChart_XGridLineSize").val(), //水平网格线宽度
            XgridLineColor: Agi.Controls.ControlColorApply.fColorControlValueGet("DataChart_XGridLineColor"), //水平网格线颜色
            YgridLineWidth: $("#DataChart_YGridLineSize").val(), //垂直网格线宽度
            YgridLineColor: Agi.Controls.ControlColorApply.fColorControlValueGet("DataChart_YGridLineColor")//垂直网格线颜色
        }
        Agi.Controls.DataChart.Background(Me, BackgroudObj); //背景应用
    });

    /**曲线处理**/
    //线条颜色
//    Me.SeriesColorChanged = function (thisChartcolor) {
//        var ChartSeriesData = _DataChart.Get("ChartData");
//        var SeriesIndex = 0;
//        if (Agi.Controls.DataChartSelSeriesName != null && ChartSeriesData.length > 0) {
//            for (var i = 0; i < ChartSeriesData.length; i++) {
//                if (ChartSeriesData[i].name === Agi.Controls.DataChartSelSeriesName) {
//                    SeriesIndex = i;
//                    break;
//                }
//            }
//        }
//
//        if (ChartSeriesData != null && ChartSeriesData.length > 0) {
//            ChartSeriesData[SeriesIndex].color = thisChartcolor;
//            ChartSeriesData[SeriesIndex].fillColor.stops[0][1] = thisChartcolor;
//            _DataChart.Set("ChartData", ChartSeriesData);
//            _DataChart.Refresh();
//        }
//    }
    //线条类型处理
    $("#DataChart_Type").find("option[value='" + ThisChartData[0].type + "']").attr("selected", "selected");
    $("#DataChartSeriesLineSave").die("click");
    $("#DataChartSeriesLineSave").live("click", function (ev) {
        var Txt = $("#DataTxtProPanelLineName").val();
        for (var i = 0; i < ThisChartData.length; i++) {
            if (Txt === ThisChartData[i].name) {
                ThisChartData[i].type = $("#DataChart_Type").val();
                //20130524 10:23 markeluo 大数据更改颜色不会立即更改显示效果，需要点击保存按钮进行保存
                ThisChartData[i].fillColor.stops[0][1] =ThisChartData[i].color =$("#DataChartLineColorSel").val();//颜色保存
                break;
            } //多实体时采用For语句实现。
        }
        Me.Refresh();
    });
    /*曲线处理结束*/
};
//移除实体
Agi.Controls.DataChart.RemoveSeriesEntityArray = function (_Controlobj, _EntityKey, _THisChartDataArray) {
    if (_Controlobj != null && _EntityKey != null) {
        var MeEntitys = _Controlobj.Get("Entity");//获得当前控件的实体数组
        var bolIsExt = false;//实体是否还存在应用
        if (_THisChartDataArray != null && _THisChartDataArray.length > 0) {
            //判断实体是否被应用到
            for (var i = 0; i < _THisChartDataArray.length; i++) {
                if (_THisChartDataArray[i].Entity.Key === _EntityKey) {
                    bolIsExt = true;
                    break;
                }
            }
            if (!bolIsExt) {
                //判断实体是否存在
                var RemoveEntityIndex = -1;
                for (var _index = 0; _index < MeEntitys.length; _index++) {
                    if (MeEntitys[_index].Key === _EntityKey) {
                        RemoveEntityIndex = _index;
                        break;
                    }
                }
                if (RemoveEntityIndex > -1) {
                    //从控件的实体数组中，移除实体
                    MeEntitys.splice(RemoveEntityIndex, 1);
                    //重新赋值控件实体
                    _Controlobj.Set("Entity", MeEntitys);
                    //更新实体数据显示
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.ShowControlData(_Controlobj);
                    }
                }
            }
        } else {
            //清空实体
            _Controlobj.Set("Entity", []);
            //更新实体数据显示
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(_Controlobj);
            }
        }
    }
}
//添加数据选项
Agi.Controls.DataChartShowSeriesPanel = function (_DataChart) {
    //获取外壳ID
    var ControlsEditPanelID = _DataChart.Get("HTMLElement").id;
    var ChartSeriesPanel = null;

    if ($("#menuDatachartseriesdiv").length > 0) {
        $("#menuDatachartseriesdiv").remove();
    }
    ChartSeriesPanel = $("<div id='menuDatachartseriesdiv' class='DatachartSeriesmenudivsty'></div>");
    ChartSeriesPanel.appendTo($("#" + ControlsEditPanelID));
    var ThisChartObj = _DataChart.Get("ProPerty").BasciObj;
    if (ThisChartObj.series != null && ThisChartObj.series.length > 0) {
        for (var i = 0; i < ThisChartObj.series.length-1; i++) {
            $("#menuDatachartseriesdiv").append("<div class='DatachartSerieslablesty'>" +
                "<div style='width:10px; height:10px; line-height: 30px; background-color:" + ThisChartObj.series[i].color + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                "<div class='DatachartSeriesname' id='Sel" + ThisChartObj.series[i].name + "' title='"+ ThisChartObj.series[i].name + "'>"
                + ThisChartObj.series[i].name + "</div>" +
                "<div class='DatachartseriesImgsty' id='remove" + ThisChartObj.series[i].name + "'></div>" +
                "<div class='clearfloat'></div></div>");
        }
        $("#menuDatachartseriesdiv").append("<div style='clear:both;'></div>");
        $("#menuDatachartseriesdiv").css("left", ($("#" + ControlsEditPanelID).width() - 120) + "px");
        $("#menuDatachartseriesdiv").css("top", "10px");
    }
    $(".DatachartSeriesname").die("click");
    $(".DatachartseriesImgsty").die("click");
    $(".DatachartSeriesname").live("click", function (ev) {
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
            Agi.Controls.DataChartSeriesSelected(_DataChart, SelSeries.name);//Series选中
        }
    })
    $(".DatachartseriesImgsty").live("click", function (ev) {
        var _obj = this;
        var removeseriesname = _obj.id.substr(_obj.id.indexOf("remove") + 6, _obj.id.length - 6);
//        var THisChartDataArray=_DataChart.Get("ChartData");
//        if(THisChartDataArray.length<=1){
//            return;
//        }
        //substr（6,7）截取字符串//indexOf("remove")筛选出remove的起始位置。返回数字类型
        $(_obj).parent().remove();//获取父层移除
        _DataChart.RemoveSeries(removeseriesname);
        /*移除线条*/
    })
};
//Chart Series 选中
Agi.Controls.DataChartSelSeriesName = null;
Agi.Controls.DataChartSeriesSelected = function (_DataChart, _SeriesName) {
    $("#DataTxtProPanelLineName").val(_SeriesName);//SeriesName
    var ThisSeriesData = _DataChart.Get("ChartData");//ChartData
    var ThisSelSeriesIndex = -1;
    for (var i = 0; i < ThisSeriesData.length; i++) {
        if (ThisSeriesData[i].name === _SeriesName) {
            ThisSelSeriesIndex = i;
            break;
        }
    }
    if (ThisSelSeriesIndex > -1) {
        Agi.Controls.DataChartSelSeriesName = ThisSeriesData[ThisSelSeriesIndex].name;
        $("#DataChartLineColorSel").spectrum("set", ThisSeriesData[ThisSelSeriesIndex].color);

        $("#DataChart_Type").val(ThisSeriesData[ThisSelSeriesIndex].type);
    }
};
//数据转换。
Agi.Controls.DataChart.ProcessData = function (Data,item) {
    var data = [];
    for (var i = 0; i < Data.Data.length; i++) {
        //if(/^\s*\d+(\.?)\d*\s*$/.test(Data.Data[i][Data.Columns[item]])){
            data.push([Agi.Controls.DataChart.ProcessDataXTimeConvert(Data.Data[i][Data.Columns[0]]),Data.Data[i][Data.Columns[item]]]);
        //}else{
        //    data.push([Agi.Controls.DataChart.ProcessDataXTimeConvert(Data.Data[i][Data.Columns[0]]),0]);
        //}
    }
    return data;
};
Agi.Controls.DataChart.ProcessDataByArray = function (ChartXAxisArray,_ArrayData) {
    var data = [];
    for (var i = 0; i < _ArrayData.length; i++) {
//        if(/^\s*\d+(\.?)\d*\s*$/.test(_ArrayData[i][1])){
            data.push([Agi.Controls.DataChart.ProcessDataXTimeConvert(_ArrayData[i][0]),_ArrayData[i][1]]);
//        }else{
//            data.push([Agi.Controls.DataChart.ProcessDataXTimeConvert(_ArrayData[i][0]),0]);
//        }
    }
    return data;
};
//X轴时间转换
Agi.Controls.DataChart.ProcessDataXTimeConvert=function(_oldtimestr){
    if (_oldtimestr.indexOf("-") > 0) {
        _oldtimestr = _oldtimestr.replace("-", "/").replace("-", "/");
    }
    return Date.parse(_oldtimestr);
}
//背景颜色
Agi.Controls.DataChart.Background=function(_ControlObj,_BackGroudObj){
    //2.获取当前控件的ChartOptions属性
    var _ChartOptions=_ControlObj.Get("ChartOptions");
    if(_BackGroudObj.BolIsTransfor==="true"){
        _ChartOptions.chart.backgroundColor='';
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
        _ChartOptions.chart.backgroundColor={
            linearGradient:lineargradientvalue,
            stops: [
                [0,_BackGroudObj.StartColor],
                [1,_BackGroudObj.EndColor]
            ]
        };
    }
    _ChartOptions.xAxis.gridLineWidth=_BackGroudObj.XgridLineWidth;//宽度
    _ChartOptions.xAxis.gridLineColor=_BackGroudObj.XgridLineColor;//颜色
//    _ChartOptions.xAxis.gridLineDashStyle='';//线条样式
    var ChartData=_ControlObj.Get("ChartData");
    for(var yAxis in _ChartOptions.yAxis){
        _ChartOptions.yAxis[yAxis].gridLineWidth=_BackGroudObj.YgridLineWidth;//宽度
        _ChartOptions.yAxis[yAxis].gridLineColor=_BackGroudObj.YgridLineColor;//颜色
        ChartData[yAxis].YgridLineWidth=_BackGroudObj.YgridLineWidth;
        ChartData[yAxis].YgridLineColor=_BackGroudObj.YgridLineColor;
//    _ChartOptions.yAxis.gridLineDashStyle=';//线条样式
        //4.重新赋值ChartOptions与样式名称
    }
    _ControlObj.Set("ChartData",ChartData);
    _ControlObj.Set("ChartOptions",_ChartOptions);

    //5.控件刷新显示
    _ControlObj.Refresh();//刷新显示
};
Agi.Controls.DataChart.BackgroundValueGet=function(_oBackgroundObj){
    var oBackground={"type":1,"rgba":"rgba(0,0,0,0)","hex":"ffffff","ahex":"ffffffff","value":{"background":"rgba(0,0,0,0)"}};
    if(_oBackgroundObj.chart.backgroundColor!=null){
        var backgroundstops=_oBackgroundObj.chart.backgroundColor.stops;
        var lineargradientoption=_oBackgroundObj.chart.backgroundColor.linearGradient;
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
                if (lineargradientoption.x1 != null) {
                    //20130517 倪飘 解决bug，大数据图表控件设置背景颜色为纯色填充以后再次双击控件进入高级属性中，控件背景颜色变为黑色
                    if (backgroundstops[0][1].indexOf("rgb(") < 0 && backgroundstops[0][1].indexOf("rgba(") < 0) {
                        if(backgroundstops[0][1].indexOf("#")<0){
                            backgroundstops[0][1]="#"+backgroundstops[0][1];
                        }
                    }
                    if (backgroundstops[1][1].indexOf("rgb(") < 0 && backgroundstops[1][1].indexOf("rgba(") < 0) {
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
                    if(backgroundstops[0][1].indexOf("rgb(")<0){
                        oBackground.stopMarker[0].color=backgroundstops[0][1];
                        oBackground.stopMarker[0].ahex=backgroundstops[0][1];
                        oBackground.stopMarker[1].color=backgroundstops[1][1];
                        oBackground.stopMarker[1].ahex=backgroundstops[1][1];

                    }else{
                        oBackground.stopMarker[0].color=backgroundstops[0][1];
                        oBackground.stopMarker[0].ahex=backgroundstops[0][1];
                        oBackground.stopMarker[1].color=backgroundstops[1][1];
                        oBackground.stopMarker[1].ahex=backgroundstops[1][1];
                    }
                }
            }
        }else{
            if(_oBackgroundObj.chart.backgroundColor!=null && _oBackgroundObj.chart.backgroundColor!=''){
                if(_oBackgroundObj.chart.backgroundColor.indexOf("#>0")){
                    if(_oBackgroundObj.chart.backgroundColor.length>7){
                        oBackground={"type":1,"rgba":"","hex":_oBackgroundObj.chart.backgroundColor.substring(0,7),"ahex":_oBackgroundObj.chart.backgroundColor,"value":{"background":_oBackgroundObj.chart.backgroundColor}};
                    }else{
                        oBackground={"type":1,"rgba":"","hex":_oBackgroundObj.chart.backgroundColor,"ahex":_oBackgroundObj.chart.backgroundColor+"ff","value":{"background":_oBackgroundObj.chart.backgroundColor}};
                    }
                }else{
                    oBackground={"type":1,"rgba":_oBackgroundObj.chart.backgroundColor,"hex":"","ahex":"","value":{"background":_oBackgroundObj.chart.backgroundColor}};
                }
            }
        }
    }
    return oBackground;
};

/*XAsix设置*/
Agi.Controls.DataChart.XAsixApply=function(_ControlObj,_XAsixObj){

    //2.获取当前控件的ChartOptions属性
    var _ChartOptions=_ControlObj.Get("ChartOptions");
    if(_ControlObj!=null && _XAsixObj!=null){
        if(_XAsixObj.XAsixIsEnable==="true"){
            _ChartOptions.xAxis.labels.enabled=true;
        }else{
            _ChartOptions.xAxis.labels.enabled=false;
        }
        if(_ChartOptions.xAxis.labels==null){
            _ChartOptions.xAxis.labels={
                style:{
                    fontFamily:'微软雅黑',
                    fontSize:9,
                    color:'#000000'
                }
            }
        }
        if(_ChartOptions.xAxis.labels.style==null){
            _ChartOptions.xAxis.labels.style={
                fontFamily:'微软雅黑',
                fontSize:9,
                color:'#000000'
            }
        }
        _ChartOptions.xAxis.labels.style.fontFamily='微软雅黑,宋体';
        _ChartOptions.xAxis.labels.style.color=_XAsixObj.XAsixfontcolor;
        _ChartOptions.xAxis.labels.style.fontWeight='none';
        _ChartOptions.xAxis.labels.style.fontSize=_XAsixObj.XAsixfontsize;
        _ChartOptions.xAxis.lineColor=_XAsixObj.XAsixLinecolor;
        _ChartOptions.xAxis.lineWidth=_XAsixObj.XAsixLinesieze;
        _ChartOptions.xAxis.tickLength=_XAsixObj.XAsixtickLength;
        _ChartOptions.xAxis.tickWidth=2;
        _ChartOptions.xAxis.tickColor=_XAsixObj.XAsixtickColor;
        _ChartOptions.xAxis.tickPosition='outsite';
    }
    //4.重新赋值ChartOptions与样式名称
    _ControlObj.Set("ChartOptions",_ChartOptions);

    //5.控件刷新显示
    _ControlObj.Refresh();//刷新显示
}
/*YAsix设置*/
Agi.Controls.DataChart.YAsixApply=function(_ControlObj,_YAsixObj){

    //2.获取当前控件的ChartOptions属性
    //2.获取当前控件的ChartOptions属性
    var _ChartOptions=_ControlObj.Get("ChartOptions");
    if(_ControlObj!=null && _YAsixObj!=null){
        for(var i=0;i<_ChartOptions.yAxis.length;i++){
            if(_ChartOptions.yAxis[i].labels==null){
                _ChartOptions.yAxis[i].labels={
                    style:{
                        fontFamily:'微软雅黑',
                        fontSize:9,
                        color:'#000000'
                    },
                    align:'right'
                }
            }
            if(_ChartOptions.yAxis[i].labels.style==null){
                _ChartOptions.yAxis[i].labels.style={
                    fontFamily:'微软雅黑',
                    fontSize:9,
                    color:'#000000'
                }
            }
            if(_YAsixObj.YAsixIsEnable==="true"){
                _ChartOptions.yAxis[i].labels.enabled=true;
            }else{
                _ChartOptions.yAxis[i].labels.enabled=false;
            }
            _ChartOptions.yAxis[i].labels.style.color=_YAsixObj.YAsixfontcolor;
            _ChartOptions.yAxis[i].labels.style.fontSize=_YAsixObj.YAsixfontsize;
        }
    }

    //4.重新赋值ChartOptions与样式名称
    _ControlObj.Set("ChartOptions",_ChartOptions);

    //5.控件刷新显示
    _ControlObj.Refresh();//刷新显示
}

