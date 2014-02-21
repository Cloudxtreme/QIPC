/**
* Created with JetBrains WebStorm.
* User: markeluo
* Date: 12-8-20
* Time: 下午5:43
* To change this template use File | Settings | File Templates.
* BasicChart:基础Chart
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/
var PointEditState = false;
Agi.Controls.DashboardChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
{
    GetEntityData:function(){ //获得实体数据

    },
    Render: function (_Target) {
        var Me = this;
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
    ReadData: function (_EntityInfo) {
        var Me = this;
        var entity = [];
        //20130516 倪飘 解决bug，仪表盘控件（圆形仪表盘，半圆仪表盘，温度计，数字指示器）不拖入任何数据保存页面，再次编辑页面时，控件为透明状态，但是预览页面是有控件显示的
        if (_EntityInfo != undefined) {
            //20130523 倪飘 解决bug，圆形仪表盘控件拖入共享数据源，选择显示字段，再拖入普通dataset，选择显示字段，保存页面后进行页面编辑，双击进入控件属性编辑环境，数据显示不正常
            if (Me.ReadTimes === undefined) {
                //20130117 倪飘 集成共享数据源
                if (!_EntityInfo.IsShareEntity) {
                    Agi.Utility.RequestData2(_EntityInfo, function (d) {
                        //20130507 倪飘 解决bug，圆形仪表盘控件拖入实体参数联动，保存页面再次进入圆形仪表盘属性编辑页面是，下方显示无可用实体数据 
                        _EntityInfo.Data = d.Data;
                        _EntityInfo.Columns = d.Columns;
                        entity.push(_EntityInfo);
                        Me.chageEntity = true;
                        Me.Set("Entity", entity);
                        Me.AddEntity(entity[0]);
                        /*添加实体*/
                    });
                }
                else {
                    entity.push(_EntityInfo);
                    Me.chageEntity = true;
                    Me.Set("Entity", entity);
                    Me.AddEntity(entity[0]);
                    /*添加实体*/
                }
                if (Me.IsReadData === true) {
                    Me.ReadTimes = 1;
                    Me.IsReadData = false;
                } else {
                    Me.ReadTimes = undefined;
                    Me.IsReadData = false;
                }
            }
            else {
                Me.ReadTimes = undefined
            }
        }
    },
    ReadOtherData: function (Point) {
        var Me = this;
        var ThisProPerty = Me.Get("ProPerty");
        //20130517 倪飘 解决bug，实时控件（圆形仪表盘、半圆仪表盘、温度计、数字指示器），拖入点位后，删除属性面板中点位信息，点击保存，左侧控件还在读取点位信息
//        if (Point != "") {
            if (!Agi.Controls.IsOpenControl) {
                Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": ThisProPerty.ID, "Points": [Point] });
            }
            else {
                Agi.Msg.PointsManageInfo.AddViewPoint({ "ControlID": ThisProPerty.ID, "Points": [Point] });
            }
//        }
        ThisProPerty.RealTimePoint = Point;
        Me.Set("ProPerty", ThisProPerty);
    },
    ReadRealData: function (MsgObj) {
        //var Me = this;
        //var ThisProPerty = Me.Get("ProPerty");
        //var DashboardChartProperty = ThisProPerty.BasciObj;
        if (!isNaN(MsgObj.Value)) {
            //DashboardChartProperty.dials.dial[0].value = MsgObj.Value.toString();
            var chart = this.chart;
            if(chart){
                chart.setData(1, MsgObj.Value);
            }else{
                this.BindChart();
            }
        }
    },
    BindChart: function () {
        var chart = null;
        var Me = this;
        var MePrority = Me.Get("ProPerty");
        var HTMLElement = Me.Get("HTMLElement")
        var DashboardChartJson = MePrority.BasciObj;
        //20130507 倪飘 解决bug，圆形仪表盘拖入共享数据源，控件无反应，页面报错
        var DashboardChartId = $(HTMLElement)[0].id;
        if (FusionCharts("_" + DashboardChartId)) {
            FusionCharts("_" + DashboardChartId).dispose();
        }
        chart = new FusionCharts("JS/Controls/DashboardChart/image/AngularGauge.swf", "_" + DashboardChartId, "100%", "100%", "0", "1");
        chart.setTransparent(true);
        chart.setJSONData(DashboardChartJson);
        chart.render(HTMLElement);
        Me.chart = chart;
    },
    AddEntity: function (_entity) {
        if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
            var Me = this;
            var ProPerty = Me.Get("ProPerty");
            var DashboardChartProPerty = ProPerty.BasciObj;
            for (var cloumnName in _entity.Data[0]) {
                //20130121 倪飘 给圆形仪表盘，半圆仪表盘，温度计，LED控件添加dataset参数联动和共享数据源参数联动功能
                if (ProPerty.CloumnName != "" && ProPerty.CloumnName === cloumnName) {
                    var _value = _entity.Data[0][cloumnName];
                    if (!isNaN(_value)) {
                        DashboardChartProPerty.dials.dial[0].value = _entity.Data[0][cloumnName];
                        Me.BindChart();
                    }
                    break;
                }
                else if (ProPerty.CloumnName == "") {
                    var _value = _entity.Data[0][cloumnName];
                    if (!isNaN(_value)) {
                        DashboardChartProPerty.dials.dial[0].value = _entity.Data[0][cloumnName];
                        Me.BindChart();
                    }
                    break;
                }
            }
        }
    },
    AddColumn: function (_entity, _ColumnName) {
    }, //拖动列到图表新增Series
    UpDateEntity: function (_callBackFun) {
    }, //更新实体数据，回调函数通知更新完成
    UpDateSeriesData: function () {
    },
    RemoveSeries: function (_SeriesName) {
    }, //移除Series
    RemoveEntity: function (_EntityKey) {
    }, //移除实体Entity
    ParameterChange: function (_ParameterInfo) {
        var Me = this;
        var entity = this.Get("Entity");
        this.Set("Entity", entity);
        Agi.Utility.RequestData(entity[0], function (d) {
            entity[0].Data = d;
            Me.AddEntity(entity[0]); /*添加实体*/
        });
    }, //参数联动
    Init: function (_Target, _ShowPosition) {
        var Me = this;
        this.AttributeList = [];
        this.ReadTimes = undefined;
        Me.Set("Entity", []);
        Me.Set("ControlType", "DashboardChart");
        var ID = "DashboardChart" + Agi.Script.CreateControlGUID();
        var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty DashboardChartPanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
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
            HTMLElementPanel.width(300);
            HTMLElementPanel.height(300);
            PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
            PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
            PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
            PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
        } else {
            HTMLElementPanel.removeClass("selectPanelSty");
            HTMLElementPanel.addClass("selectAutoFill_PanelSty");
            obj.html("");
        }
        var ThisProPerty = {
            ID: ID,
            BasciObj: null,
            ColumnName: "",
            RealTimePoint: ""
        };
        ThisProPerty.BasciObj = JSON.parse(JSON.stringify(theme1));
        Me.Set("HTMLElement", HTMLElementPanel[0]);
        if (_Target != null) {
            this.Render(_Target);
        }
        var StartPoint = { X: 0, Y: 0 }
        /*事件绑定*/
        HTMLElementPanel.dblclick(function (ev) {
            if (!Agi.Controls.IsControlEdit) {
                if (!Me.IsPageView) {
                    Agi.Controls.ControlEdit(Me); //控件编辑界面
                }
            }
        });
        if (HTMLElementPanel.touchstart) {
            HTMLElementPanel.touchstart(function (ev) {
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });
        } else {
            HTMLElementPanel.mousedown(function (ev) {
                if (!Me.IsPageView) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });
        }
        Me.Set("ProPerty", ThisProPerty);
        Me.Set("Position", PostionValue);
        obj = ThisProPerty = PagePars = PostionValue = null;
        Me.BindChart();
    },
    CustomProPanelShow: function () {
        Agi.Controls.DashboardChartProrityInit(this);
    }, //显示自定义属性面板
    Destory: function () {
        var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
        var proPerty = this.Get("ProPerty");
//        Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//        Agi.Edit.workspace.controlList.remove(this);
//        Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/

        $(HTMLElement).remove();
        HTMLElement = null;
        this.AttributeList.length = 0;
        proPerty = null;
        delete this;
    },
    Copy: function () {
        if (layoutManagement.property.type == 1) {
            var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
            var PostionValue = this.Get("Position");
            var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
            var NewDashboardChart = new Agi.Controls.DashboardChart();
            NewDashboardChart.Init(ParentObj, PostionValue);
            newPanelPositionpars = null;
            return NewDashboardChart;
        }
    },
    PostionChange: function (_Postion) {
        if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
            var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            var _ThisPosition = {
                Left: (_Postion.Left / PagePars.Width).toFixed(4),
                Top: (_Postion.Top / PagePars.Height).toFixed(4),
                Right: (_Postion.Right / PagePars.Width).toFixed(4),
                Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
            }
            this.Set("Position", _ThisPosition);
            PagePars = _ThisPosition = null;
        }
        else {
            var ThisHTMLElementobj = $("#" + this.Get("HTMLElement").id);
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
        if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
            Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
        } else {
            Me.Refresh();
        }
        if (Agi.Controls.IsControlEdit) {
            Agi.Controls.DashboardChartProrityInit(Me);
        }
    }, //外壳大小更改
    Refresh: function () {
        var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
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
        ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
        ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
        this.Set("Position", this.Get("Position"))
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
        /* $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
        "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
        });*/
    },
    ControlAttributeChangeEvent: function (_obj, Key, _Value) {
        Agi.Controls.DashboardChartAttributeChange(this, Key, _Value);
    },
    GetConfig: function () {
        var Me = this;
        var ProPerty = this.Get("ProPerty");
        /* var ConfigObj = new Agi.Script.StringBuilder(); *//*配置信息数组对象*//*
        ConfigObj.append("<Control>");
        ConfigObj.append("<ControlType>" + Me.Get("ControlType") + "</ControlType>"); */
        /*控件类型*//*
        ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>"); */
        /*控件属性*//*
        ConfigObj.append("<DashboardChart>" + JSON.stringify(ProPerty.BasciObj) + "</DashboardChart>"); */
        /*控件属性*//*
        ConfigObj.append("<CloumnName>" + ProPerty.CloumnName + "</CloumnName>"); */
        /*数据列名称*//*
        ConfigObj.append("<RealTimePoint>" + ProPerty.RealTimePoint + "</RealTimePoint>"); */
        /*实时点位号*//*
        ConfigObj.append("<Entity>" + JSON.stringify(Me.Get("Entity")) + "</Entity>"); */
        /*控件实体*//*
        ConfigObj.append("<ControlBaseObj>" + ProPerty.ID + "</ControlBaseObj>"); */
        /*控件基础对象*//*
        ConfigObj.append("<HTMLElement>" + Me.Get("HTMLElement").id + "</HTMLElement>"); */
        /*控件外壳ID*//*
        ConfigObj.append("<Position>" + JSON.stringify(Me.Get("Position")) + "</Position>"); */
        /*控件位置信息*//*
        ConfigObj.append("</Control>");
        return ConfigObj.toString(); //返回配置字符串*/
        var DashboardChartControl = {
            Control: {
                ControlType: null, //*控件类型*//
                ControlID: null, //*控件属性*//
                DashboardChart: null, //*控件属性*//
                CloumnName: null, //*数据列名称*//
                RealTimePoint: null, //*实时点位号*//
                Entity: null, //*控件实体*//
                ControlBaseObj: null, //*控件基础对象*//
                HTMLElement: null, //*控件外壳ID*//
                Position: null, /*控件位置信息*/
                ThemeInfo: null//主题名
            }
        }
        DashboardChartControl.Control.ControlType = Me.Get("ControlType");
        DashboardChartControl.Control.ControlID = ProPerty.ID;
        DashboardChartControl.Control.DashboardChart = ProPerty.BasciObj;
        DashboardChartControl.Control.CloumnName = ProPerty.CloumnName;
        DashboardChartControl.Control.RealTimePoint = ProPerty.RealTimePoint;
        DashboardChartControl.Control.Entity = Me.Get("Entity");
        DashboardChartControl.Control.ControlBaseObj = ProPerty.ID;
        DashboardChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
        DashboardChartControl.Control.Position = Me.Get("Position");
        DashboardChartControl.Control.ThemeInfo = Me.Get("ThemeInfo");
        return DashboardChartControl.Control;
    }, //获得BasicChart控件的配置信息
    CreateControl: function (_Config, _Target) {
        var Me = this;
        Me.AttributeList = [];
        if (_Config != null) {
            if (_Target != null && _Target != "") {
                var _Targetobj = $(_Target);
                Me.Set("ControlType", "DashboardChart");
                Me.Set("Entity", _Config.Entity); //实体
                var ID = _Config.ControlID;
                var CloumnName = _Config.CloumnName;
                var ThemeInfo = _Config.ThemeInfo;
                var RealTimePoint = _Config.RealTimePoint;
                var DashboardChartProPerty = _Config.DashboardChart;
                var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty DashboardChartPanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
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
                    BasciObj: DashboardChartProPerty,
                    CloumnName: CloumnName,
                    RealTimePoint: RealTimePoint
                };
                this.Set("HTMLElement", HTMLElementPanel[0]);

                if (_Target != null) {
                    Me.Render(_Target);
                }
                var StartPoint = { X: 0, Y: 0 };
                HTMLElementPanel.dblclick(function (ev) {
                    if (!Agi.Controls.IsControlEdit) {
                        if (!Me.IsPageView) {
                            Agi.Controls.ControlEdit(Me); //控件编辑界面
                        }
                    }
                });
                if (HTMLElementPanel.touchstart) {
                    HTMLElementPanel.touchstart(function (ev) {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    });
                } else {
                    HTMLElementPanel.mousedown(function (ev) {
                        if (!Me.IsPageView) {
                            Agi.Controls.BasicPropertyPanel.Show(this.id);
                        }
                    });
                }

                Me.Set("ProPerty", ThisProPerty);
                Me.Set("Position", PostionValue);
                //                Me.Set("ThemeInfo", _Config.ThemeInfo);
                this.ReadTimes = 1;
                this.IsReadData = true;
                Me.BindChart();
                Me.ReadOtherData(ThisProPerty.RealTimePoint);
                obj = ThisProPerty = PagePars = PostionValue = null;
            }
        }
    },
    InEdit: function () {
    }, //编辑中
    ExtEdit: function () {

    }, //退出编辑
    ChangeTheme: function (_themeName) {
        var Me = this;
        //1.保存主题名称
        Me.Set("ThemeInfo", _themeName);
        //2.绑定样式
        Me.BindChart();
    } //更改控件样式
});
/*BasicChart参数更改处理方法*/
Agi.Controls.DashboardChartAttributeChange = function (_ControlObj, Key, _Value) {
    var Me = this;
    if (Key == "Position") {
        if (layoutManagement.property.type == 1) {
            var ThisHTMLElementobj = $("#" + _ControlObj.Get("HTMLElement").id);
            var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

            var ParentObj = ThisHTMLElementobj.parent();
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            ThisHTMLElementobj.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
            ThisHTMLElementobj.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");

            var ThisControlPars = { Width: parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                Height: parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))
            };

            ThisHTMLElementobj.width(ThisControlPars.Width);
            ThisHTMLElementobj.height(ThisControlPars.Height);
            ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height); /*Chart 更改大小*/
            ThisControlObj.Refresh(); /*Chart 更改大小*/
            PagePars = null;
        }
    }
    if (Key == "ThemeInfo") {
        var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(_ControlObj.Get("ControlType"), _Value);
        var ThisProPerty = _ControlObj.Get("ProPerty");
        var DashboardChartProperty = ThisProPerty.BasciObj;
        for (var i = 0; i < DashboardChartProperty.colorrange.color.length; i++) {
            DashboardChartProperty.colorrange.color[i].code = ChartStyleValue.colorrange;
        }

        //更改字体颜色，刻度颜色
        DashboardChartProperty.chart.basefontcolor = ChartStyleValue.basefontcolor;
        DashboardChartProperty.chart.majortmcolor = ChartStyleValue.majortmcolor;
        DashboardChartProperty.chart.minortmcolor = ChartStyleValue.minortmcolor;
        DashboardChartProperty.chart.tooltipbgcolor = ChartStyleValue.tooltipbgcolor;
        //改背景颜色
        DashboardChartProperty.annotations.groups[0].items[0].fillcolor = ChartStyleValue.fillcolor;
        DashboardChartProperty.annotations.groups[0].items[0].fillratio = ChartStyleValue.fillratio;

        ThisProPerty.BasciObj = DashboardChartProperty;
        _ControlObj.Set("ProPerty", ThisProPerty);
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDashboardChart = function () {
    return new Agi.Controls.DashboardChart();
}
//BasicChart 自定义属性面板初始化显示
Agi.Controls.DashboardChartProrityInit = function (_DashboardChart) {
    var Me = _DashboardChart;
    var ThisProPerty = Me.Get("ProPerty");
    var DashboardChartProperty = ThisProPerty.BasciObj;
    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    var ColorRows = '';
    var _color = DashboardChartProperty.colorrange.color;
    for (var i = 1; i <= _color.length; i++) {
        //<input type="button" value="删除" class="colorDel" color="' + DashboardChartProperty.colorrange.color[i - 1].code + '"  />
        //        ColorRows += '<tr class="colorClass"><td  class="prortityPanelTabletd0"> ' + i + '区</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="Color' + i + '" id="Color' + i + '"/></td><td class="prortityPanelTabletd0">最小值:</td><td  class="prortityPanelTabletd1"><input data-field="minValue' + i + '" id="minValue' + i + '" type="number" value="" min ="0" max="1000"/></td></tr>';
        //        ColorRows += '<tr class="colorClass"><td class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"></td><td class="prortityPanelTabletd0">最大值:</td><td class="prortityPanelTabletd1"><input data-field="maxValue' + i + '" id="maxValue' + i + '" type="number" value="" min ="0" max="1000"/></td></tr>';
        ColorRows += '<tr class="colorClass"><td  class="prortityPanelTabletd0"> ' + i + '区Min:</td><td  class="prortityPanelTabletd1"><input data-field="minValue' + i + '" id="minValue' + i + '" type="number" value="" min ="0" max="1000"/></td><td class="prortityPanelTabletd0">Max:</td><td  class="prortityPanelTabletd1"><input data-field="maxValue' + i + '" id="maxValue' + i + '" type="number" value="" min ="0" max="1000"/></td></tr>';
    }
    //属性配置
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
    '<table  class="prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
    '<tr>' +
   '<td class="prortityPanelTabletd0">数据列:</td><td  class="prortityPanelTabletd1"><select data-field="ColumnName" id="ColumnName"></select></td>' +
   '<td  class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"><input type="button" value="保存" id="btnDashboardChartSave"/></td>' +
    //   '<td class="prortityPanelTabletd0">主题:</td><td  class="prortityPanelTabletd1"><select data-field="themeName" id="themeName"> <option value=""></option><option value="theme1">主题1</option><option value="theme2">主题2</option><option value="theme3">主题3</option></select> </td>' +
    '</tr>' +
    '<tr>' +
    '<td class="prortityPanelTabletd0">主题:</td><td  class="prortityPanelTabletd1"><select data-field="themeName" id="themeName"> <option value=""></option><option value="theme1">主题1</option><option value="theme2">主题2</option></select> </td>' +
       '<td class="prortityPanelTabletd0">点位号:</td><td  class="prortityPanelTabletd1"><input data-field="RealTimePoint" id="RealTimePoint" type="text" value=""/></td>' +
    '</tr>' +
     '<tr>' +
       '<td class="prortityPanelTabletd0">样式:</td><td  class="prortityPanelTabletd1"><select data-field="className" id="className"> <option value=""></option><option value="class1">二分区</option><option value="class2">三分区</option><option value="class3">四分区</option><option value="class4">五分区</option></select> </td>' +
   '<td class="prortityPanelTabletd0">最大值:</td><td colspan="3"  class="prortityPanelTabletd1"><input data-field="txtupperlimit" id="txtupperlimit" type="text" value=""/></td>' +
    '</tr>' +
    //'<tr>' +
    //    '<td  class="prortityPanelTabletd0">添加分区</td><td colspan="3" class="prortityPanelTabletd1"><input type="button" value="添加分区" id="btnDashboardAddColor"/><input type="button" value="保存" id="btnDashboardChartSave"/></td>' +

    //'</tr>' +
    ColorRows +
    '</table>' +
    '</div>');
    var BasicObj = ItemContent;
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: BasicObj }));
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
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    $("#txtupperlimit").val(DashboardChartProperty.chart.upperlimit);
    $("#RealTimePoint").val(ThisProPerty.RealTimePoint);
    $("#bgColor").val(DashboardChartProperty.chart.bgcolor);
    for (var i = 1; i <= _color.length; i++) {
        $("#minValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].minvalue);
        $("#maxValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].maxvalue);
        //        $("#Color" + i).val(DashboardChartProperty.colorrange.color[i - 1].code);
    }
    //    $('.BasicColor').spectrum({
    //        showInput: true,
    //        showPalette: true,
    //        palette: [
    //            ['#272727', '#000079'],
    //            ['#FF2D2D', '#0072E3'],
    //            ['#FFF7FF', '#613030'],
    //            ['#616130', '#D200D2'],
    //            ['#006000', '#6F00D2']
    //        ],
    //        cancelText: "取消",
    //        chooseText: "选择",
    //        change: function (color) {
    //            var pName = $(this).data('field');
    //            switch (pName) {
    //                case 'Color1':
    //                    DashboardChartProperty.colorrange.color[0].code = color.toHexString();
    //                    break;
    //                case 'Color2':
    //                    DashboardChartProperty.colorrange.color[1].code = color.toHexString();
    //                    break;
    //                case 'Color3':
    //                    DashboardChartProperty.colorrange.color[2].code = color.toHexString();
    //                    break;
    //                case 'Color4':
    //                    DashboardChartProperty.colorrange.color[3].code = color.toHexString();
    //                    break;
    //                case 'Color5':
    //                    DashboardChartProperty.colorrange.color[4].code = color.toHexString();
    //                    break;
    //            }

    //        }
    //    });
    $('.prortityPanelTabletd1>input').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "txtupperlimit":
                DashboardChartProperty.chart.upperlimit = $(this).val();
                break;
            case "minValue1":
                DashboardChartProperty.chart.lowerlimit = $(this).val();
                DashboardChartProperty.colorrange.color[0].minvalue = $(this).val();
                break;
            case "minValue2":
                DashboardChartProperty.colorrange.color[1].minvalue = $(this).val();
                break;
            case "minValue3":
                DashboardChartProperty.colorrange.color[2].minvalue = $(this).val();
                break;
            case "minValue4":
                DashboardChartProperty.colorrange.color[3].minvalue = $(this).val();
                break;
            case "minValue5":
                DashboardChartProperty.colorrange.color[4].minvalue = $(this).val();
                break;
            case "maxValue1":
                DashboardChartProperty.colorrange.color[0].maxvalue = $(this).val();
                break;
            case "maxValue2":
                DashboardChartProperty.colorrange.color[1].maxvalue = $(this).val();
                break;
            case "maxValue3":
                DashboardChartProperty.colorrange.color[2].maxvalue = $(this).val();
                break;
            case "maxValue4":
                DashboardChartProperty.colorrange.color[3].maxvalue = $(this).val();
                break;
            case "maxValue5":
                DashboardChartProperty.colorrange.color[4].maxvalue = $(this).val();
            case "RealTimePoint":
                ThisProPerty.RealTimePoint = $(this).val();
                PointEditState = true;
                break;

        }
    });
    $("#btnDashboardChartSave").click(function () {
        if (PointEditState) {
            Me.ReadOtherData(ThisProPerty.RealTimePoint);
            PointEditState = !PointEditState;
        }
        ThisProPerty.BasciObj = DashboardChartProperty;
        Me.Set("ProPerty", ThisProPerty);
        Me.BindChart();
    });

    //var globleIndex = 0;

    //    $(".colorDel").live("click", function () {
    //        if (DashboardChartProperty.colorrange.color.length > 2) {
    //        var color = $(this).attr("color");
    //        for (var i = 0; i < DashboardChartProperty.colorrange.color.length; i++) {
    //            var obj = DashboardChartProperty.colorrange.color[i];
    //            if (obj.code == color) {
    //                DashboardChartProperty.colorrange.color.splice(i, 1);
    //                return;
    //            }
    //        }
    //        //DashboardChartProperty.colorrange.color.splice(_index, 1);
    //        $(".prortityPanelTable>tbody").find(".colorClass").detach();
    //        for (var i = 1; i <= DashboardChartProperty.colorrange.color.length; i++) {
    //            //获取当前的table元素
    //            var prortityPanelTable = $(".prortityPanelTable");
    //            //获取当前行数
    //            var currentRow = prortityPanelTable.find("tbody>tr").length;
    //            var ColorName = "Color" + i;
    //            var minValue = "minValue" + i;
    //            var maxValue = "maxValue" + i;
    //            $('<tr class="colorClass"><td  class="prortityPanelTabletd0">' + i + '区</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="' + ColorName + '" id="' + ColorName + '"/></td><td class="prortityPanelTabletd0">最小值:</td><td  class="prortityPanelTabletd1"><input data-field="' + minValue + '" id="' + minValue + '" type="text" value=""/></td></tr><tr class="colorClass"><td class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"><input type="button" value="删除" class="colorDel" color="' + DashboardChartProperty.colorrange.color[i - 1].code + '" /></td><td class="prortityPanelTabletd0">最大值:</td><td class="prortityPanelTabletd1"><input data-field="' + maxValue + '" id="' + maxValue + '" type="text" value=""/></td></tr>').insertAfter(prortityPanelTable.find("tbody>tr")[currentRow - 1]);
    //            $("#minValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].minvalue);
    //            $("#maxValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].maxvalue);
    //            $("#Color" + i).val(DashboardChartProperty.colorrange.color[i - 1].code);
    //            $('.BasicColor').spectrum({
    //                showInput: true,
    //                showPalette: true,
    //                palette: [
    //    ['#272727', '#000079'],
    //    ['#FF2D2D', '#0072E3'],
    //    ['#FFF7FF', '#613030'],
    //    ['#616130', '#D200D2'],
    //    ['#006000', '#6F00D2']
    //    ],
    //                cancelText: "取消",
    //                chooseText: "选择",
    //                change: function (color) {
    //                    var pName = $(this).data('field');
    //                    switch (pName) {
    //                        case ColorName:
    //                            DashboardChartProperty.colorrange.color[i - 1].code = color.toHexString();
    //                            break;
    //                    }

    //                }
    //            });
    //            $('.prortityPanelTabletd1>input').change(function (obj) {
    //                var pName = $(this).data('field');
    //                switch (pName) {
    //                    case minValue:
    //                        DashboardChartProperty.colorrange.color[i - 1].minvalue = $(this).val();
    //                        break;
    //                    case maxValue:
    //                        DashboardChartProperty.colorrange.color[i - 1].maxvalue = $(this).val();
    //                        break;
    //                }
    //            });
    //        }
    //        ThisProPerty.BasciObj = DashboardChartProperty;
    //        Me.Set("ProPerty", ThisProPerty);
    //        Me.BindChart();
    //        $("#txtupperlimit").val(DashboardChartProperty.chart.upperlimit);
    //        $("#bgColor").val(DashboardChartProperty.chart.bgcolor);
    //    }
    //    });
    //    $("#btnDashboardAddColor").click(function () {
    //        //获取当前分区数
    //        var colorCount = DashboardChartProperty.colorrange.color.length;
    //        if (colorCount < 5) {
    //            //获取当前的table元素
    //            var prortityPanelTable = $(".prortityPanelTable");
    //            //获取当前行数
    //            var currentRow = prortityPanelTable.find("tbody>tr").length;
    //            var ColorName = "Color" + (colorCount + 1);
    //            var minValue = "minValue" + (colorCount + 1);
    //            var maxValue = "maxValue" + (colorCount + 1);
    //            $('<tr class="colorClass"><td  class="prortityPanelTabletd0">' + (colorCount + 1) + '区</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="' + ColorName + '" id="' + ColorName + '"/></td><td class="prortityPanelTabletd0">最小值:</td><td  class="prortityPanelTabletd1"><input data-field="' + minValue + '" id="' + minValue + '" type="text" value=""/></td></tr><tr class="colorClass"><td class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"><input type="button" class="colorDel" value="删除" color="00000' + colorCount + '" /></td><td class="prortityPanelTabletd0">最大值:</td><td class="prortityPanelTabletd1"><input data-field="' + maxValue + '" id="' + maxValue + '" type="text" value=""/></td></tr>').insertAfter(prortityPanelTable.find("tbody>tr")[currentRow - 1]);
    //            DashboardChartProperty.colorrange.color.push(
    //                {
    //                    "minvalue": "",
    //                    "maxvalue": "",
    //                    "code": "00000" + colorCount
    //                }
    //                );
    //            $('.BasicColor').spectrum({
    //                showInput: true,
    //                showPalette: true,
    //                palette: [
    //            ['#272727', '#000079'],
    //            ['#FF2D2D', '#0072E3'],
    //            ['#FFF7FF', '#613030'],
    //            ['#616130', '#D200D2'],
    //            ['#006000', '#6F00D2']
    //        ],
    //                cancelText: "取消",
    //                chooseText: "选择",
    //                change: function (color) {
    //                    var pName = $(this).data('field');
    //                    switch (pName) {
    //                        case ColorName:
    //                            DashboardChartProperty.colorrange.color[colorCount].code = color.toHexString();
    //                            break;
    //                    }

    //                }
    //            });
    //            $('.prortityPanelTabletd1>input').change(function (obj) {
    //                var pName = $(this).data('field');
    //                switch (pName) {
    //                    case minValue:
    //                        DashboardChartProperty.colorrange.color[colorCount].minvalue = $(this).val();
    //                        break;
    //                    case maxValue:
    //                        DashboardChartProperty.colorrange.color[colorCount].maxvalue = $(this).val();
    //                        break;
    //                }
    //            });
    //        }
    //    });
    $("#ColumnName").change(function () {
        var Entity = Me.Get("Entity");
        var cloumnName = $(this).val();
        ThisProPerty.CloumnName = cloumnName;
        var _value = Entity[0].Data[0][cloumnName];
        if (!isNaN(_value)) {
            DashboardChartProperty.dials.dial[0].value = _value;
        }
    });
    $("#themeName").change(function () {
        var themeName = $(this).val();
        if (themeName != "") {
            switch (themeName) {
                case "theme1":
                    DashboardChartProperty.chart.lowerlimitdisplay = "";
                    DashboardChartProperty.chart.upperlimitdisplay = "";
                    DashboardChartProperty.chart.gaugestartangle = "225";
                    DashboardChartProperty.chart.gaugeendangle = "-45";
                    break;
                case "theme2":
                    DashboardChartProperty.chart.lowerlimitdisplay = " ";
                    DashboardChartProperty.chart.upperlimitdisplay = "";
                    DashboardChartProperty.chart.gaugestartangle = "90";
                    DashboardChartProperty.chart.gaugeendangle = "-270";
                    break;
            }
        }
    });
    //    $("#themeName").change(function () {
    //        var themeName = $(this).val();
    //        if (themeName != "") {
    //            //移除当前分区
    //            $(".prortityPanelTable>tbody").find(".colorClass").remove();
    //            DashboardChartProperty == "";
    //            switch (themeName) {
    //                case "theme1":
    //                    DashboardChartProperty = JSON.parse(JSON.stringify(theme1));
    //                    break;
    //                case "theme2":
    //                    DashboardChartProperty = JSON.parse(JSON.stringify(theme2));
    //                    break;
    //                case "theme3":
    //                    DashboardChartProperty = JSON.parse(JSON.stringify(theme3));
    //                    break;
    //            }
    //            for (var i = 1; i <= DashboardChartProperty.colorrange.color.length; i++) {
    //                //获取当前的table元素
    //                var prortityPanelTable = $(".prortityPanelTable");
    //                //获取当前行数
    //                var currentRow = prortityPanelTable.find("tbody>tr").length;
    //                var ColorName = "Color" + i;
    //                var minValue = "minValue" + i;
    //                var maxValue = "maxValue" + i;
    //                $('<tr class="colorClass"><td  class="prortityPanelTabletd0">' + i + '区</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="' + ColorName + '" id="' + ColorName + '"/></td><td class="prortityPanelTabletd0">最小值:</td><td  class="prortityPanelTabletd1"><input data-field="' + minValue + '" id="' + minValue + '" type="text" value=""/></td></tr><tr class="colorClass"><td class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"><input type="button" value="删除" id="btnDashboardChartDel"/></td><td class="prortityPanelTabletd0">最大值:</td><td class="prortityPanelTabletd1"><input data-field="' + maxValue + '" id="' + maxValue + '" type="text" value=""/></td></tr>').insertAfter(prortityPanelTable.find("tbody>tr")[currentRow - 1]);
    //                $("#minValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].minvalue);
    //                $("#maxValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].maxvalue);
    //                $("#Color" + i).val(DashboardChartProperty.colorrange.color[i - 1].code);
    //                $('.BasicColor').spectrum({
    //                    showInput: true,
    //                    showPalette: true,
    //                    palette: [
    //                        ['#272727', '#000079'],
    //                        ['#FF2D2D', '#0072E3'],
    //                        ['#FFF7FF', '#613030'],
    //                        ['#616130', '#D200D2'],
    //                        ['#006000', '#6F00D2']
    //                    ],
    //                    cancelText: "取消",
    //                    chooseText: "选择",
    //                    change: function (color) {
    //                        var pName = $(this).data('field');
    //                        switch (pName) {
    //                            case ColorName:
    //                                DashboardChartProperty.colorrange.color[i - 1].code = color.toHexString();
    //                                break;
    //                        }

    //                    }
    //                });
    //                $('.prortityPanelTabletd1>input').change(function (obj) {
    //                    var pName = $(this).data('field');
    //                    switch (pName) {
    //                        case "txtupperlimit":
    //                            DashboardChartProperty.chart.upperlimit = $(this).val();
    //                            break;
    //                        case "minValue1":
    //                            DashboardChartProperty.colorrange.color[0].minvalue = $(this).val();
    //                            break;
    //                        case "minValue2":
    //                            DashboardChartProperty.colorrange.color[1].minvalue = $(this).val();
    //                            break;
    //                        case "minValue3":
    //                            DashboardChartProperty.colorrange.color[2].minvalue = $(this).val();
    //                            break;
    //                        case "minValue4":
    //                            DashboardChartProperty.colorrange.color[3].minvalue = $(this).val();
    //                            break;
    //                        case "minValue5":
    //                            DashboardChartProperty.colorrange.color[4].minvalue = $(this).val();
    //                            break;
    //                        case "maxValue1":
    //                            DashboardChartProperty.colorrange.color[0].maxvalue = $(this).val();
    //                            break;
    //                        case "maxValue2":
    //                            DashboardChartProperty.colorrange.color[1].maxvalue = $(this).val();
    //                            break;
    //                        case "maxValue3":
    //                            DashboardChartProperty.colorrange.color[2].maxvalue = $(this).val();
    //                            break;
    //                        case "maxValue4":
    //                            DashboardChartProperty.colorrange.color[3].maxvalue = $(this).val();
    //                            break;
    //                        case "maxValue5":
    //                            DashboardChartProperty.colorrange.color[4].maxvalue = $(this).val();
    //                            break;
    //                    }
    //                });
    //            }
    //            ThisProPerty.BasciObj = DashboardChartProperty;
    //            Me.Set("ProPerty", ThisProPerty);
    //            Me.BindChart();
    //            $("#txtupperlimit").val(DashboardChartProperty.chart.upperlimit);
    //            $("#bgColor").val(DashboardChartProperty.chart.bgcolor);
    //        }

    //    });
    $("#className").change(function () {
        var className = $(this).val();
        if (className != "") {
            DashboardChartProperty.chart.upperlimit = "";
            DashboardChartProperty.chart.lowerlimit = "";
            DashboardChartProperty.colorrange = "";
            DashboardChartProperty.dials = "";
            switch (className) {
                case "class1":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class1.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class1.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class1.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class1.dials));
                    break;
                case "class2":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class2.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class2.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class2.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class2.dials));
                    break;
                case "class3":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class3.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class3.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class3.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class3.dials));
                    break;
                case "class4":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class4.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class4.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class4.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class4.dials));
                    break;
            }
            $(".prortityPanelTable>tbody").find(".colorClass").detach();
            for (var i = 1; i <= DashboardChartProperty.colorrange.color.length; i++) {
                //获取当前的table元素
                var prortityPanelTable = $(".prortityPanelTable");
                //获取当前行数
                var currentRow = prortityPanelTable.find("tbody>tr").length;
                var ColorName = "Color" + i;
                var minValue = "minValue" + i;
                var maxValue = "maxValue" + i;
                $('<tr class="colorClass"><td  class="prortityPanelTabletd0">' + i + '区Min:</td><td  class="prortityPanelTabletd1"><input data-field="' + minValue + '" id="' + minValue + '" type="number" value="" min="0" max="1000"/></td><td class="prortityPanelTabletd0">Max:</td><td  class="prortityPanelTabletd1"><input data-field="' + maxValue + '" id="' + maxValue + '" type="number" value="" min="0" max="1000"/></td></tr>').insertAfter(prortityPanelTable.find("tbody>tr")[currentRow - 1]);
                $("#minValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].minvalue);
                $("#maxValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].maxvalue);
                $("#Color" + i).val(DashboardChartProperty.colorrange.color[i - 1].code);
                //                $('.BasicColor').spectrum({
                //                    showInput: true,
                //                    showPalette: true,
                //                    palette: [
                //                    ['#272727', '#000079'],
                //                    ['#FF2D2D', '#0072E3'],
                //                    ['#FFF7FF', '#613030'],
                //                    ['#616130', '#D200D2'],
                //                    ['#006000', '#6F00D2']
                //                    ],
                //                    cancelText: "取消",
                //                    chooseText: "选择",
                //                    change: function (color) {
                //                        var pName = $(this).data('field');
                //                        switch (pName) {
                //                            case 'Color1':
                //                                DashboardChartProperty.colorrange.color[0].code = color.toHexString();
                //                                break;
                //                            case 'Color2':
                //                                DashboardChartProperty.colorrange.color[1].code = color.toHexString();
                //                                break;
                //                            case 'Color3':
                //                                DashboardChartProperty.colorrange.color[2].code = color.toHexString();
                //                                break;
                //                            case 'Color4':
                //                                DashboardChartProperty.colorrange.color[3].code = color.toHexString();
                //                                break;
                //                            case 'Color5':
                //                                DashboardChartProperty.colorrange.color[4].code = color.toHexString();
                //                                break;
                //                        }

                //                    }
                //                });
                $('.prortityPanelTabletd1>input').change(function (obj) {
                    var pName = $(this).data('field');
                    switch (pName) {
                        case minValue:
                            DashboardChartProperty.colorrange.color[i - 1].minvalue = $(this).val();
                            break;
                        case maxValue:
                            DashboardChartProperty.colorrange.color[i - 1].maxvalue = $(this).val();
                            break;
                    }
                });
            }
            ThisProPerty.BasciObj = DashboardChartProperty;
            Me.Set("ProPerty", ThisProPerty);
            if (Me.Get("ThemeInfo")) {
                Me.Set("ThemeInfo", Me.Get("ThemeInfo"));
            }
            Me.BindChart();
            $("#txtupperlimit").val(DashboardChartProperty.chart.upperlimit);
            //            $("#bgColor").val(DashboardChartProperty.chart.bgcolor);
        }
    });
    var Entity = Me.Get("Entity");
    if (Entity[0] != null && Entity[0].Data != null && Entity[0].Data.length > 0) {
        for (var cloumnName in Entity[0].Data[0]) {
            $("#ColumnName").append("<option value='" + cloumnName + "'>" + cloumnName + "</option>");
        }
        if (ThisProPerty.CloumnName != "") {
            $("#ColumnName").val(ThisProPerty.CloumnName);
        }
    }

}