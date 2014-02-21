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
Agi.Controls.DashboardChart1 = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
        //20130117 倪飘 集成共享数据源
        if (!_EntityInfo.IsShareEntity) {
            Agi.Utility.RequestData(_EntityInfo, function (d) {
                _EntityInfo.Data = d;
                entity.push(_EntityInfo);
                Me.chageEntity = true;
                Me.Set("Entity", entity);
                Me.AddEntity(entity[0]); /*添加实体*/
            });
        }
        else {
            entity.push(_EntityInfo);
            Me.chageEntity = true;
            Me.Set("Entity", entity);
            Me.AddEntity(entity[0]); /*添加实体*/
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
        var DashboardChart1Json = MePrority.BasciObj;
        //20130507 倪飘 解决bug，半圆仪表盘拖入共享数据源，控件无反应，页面报错
        var DashboardChart1Id = $(HTMLElement)[0].id;
        if (FusionCharts("_" + DashboardChart1Id)) {
            FusionCharts("_" + DashboardChart1Id).dispose();
        }
        chart = new FusionCharts("JS/Controls/DashboardChart1/image/AngularGauge.swf", "_" + DashboardChart1Id, "100%", "100%", "0", "1");
        chart.setTransparent(true);
        chart.setJSONData(DashboardChart1Json);
        chart.render(HTMLElement);
        Me.chart = chart;
    },
    AddEntity: function (_entity) {
        if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
            var Me = this;
            var ProPerty = Me.Get("ProPerty");
            var DashboardChart1ProPerty = ProPerty.BasciObj;
            for (var cloumnName in _entity.Data[0]) {
                //20130121 倪飘 给圆形仪表盘，半圆仪表盘，温度计，LED控件添加dataset参数联动和共享数据源参数联动功能
                if (ProPerty.CloumnName != "" && ProPerty.CloumnName === cloumnName) {
                    var _value = _entity.Data[0][cloumnName];
                    if (!isNaN(_value)) {
                        //20130529 倪飘 解决bug，半圆仪表盘，拖入数据后，选择数据列，点击保存，左侧控件显示多出一半控件
                        if (_value.length > 5) {
                            _value = _value.substr(0, 5);
                            DashboardChart1ProPerty.dials.dial[0].value = _value;
                            AgiCommonDialogBox.Alert("所选数值过大，会影响控件显示，现将截取前5位数值显示！");
                        }
                        else {
                            DashboardChart1ProPerty.dials.dial[0].value = _value;
                        }
                        Me.BindChart();
                    }
                    break;
                }
                else if (ProPerty.CloumnName == "") {
                    var _value = _entity.Data[0][cloumnName];
                    if (!isNaN(_value)) {
                        //20130529 倪飘 解决bug，半圆仪表盘，拖入数据后，选择数据列，点击保存，左侧控件显示多出一半控件
                        if (_value.length > 5) {
                            _value = _value.substr(0, 5);
                            DashboardChart1ProPerty.dials.dial[0].value = _value;
                            AgiCommonDialogBox.Alert("所选数值过大，会影响控件显示，现将截取前5位数值显示！");
                        }
                        else {
                            DashboardChart1ProPerty.dials.dial[0].value = _value;
                        }
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
        Me.Set("Entity", []);
        Me.Set("ControlType", "DashboardChart1");
        var ID = "DashboardChart1" + Agi.Script.CreateControlGUID();
        var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty DashboardChart1PanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
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
            HTMLElementPanel.width(400);
            HTMLElementPanel.height(250);
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
        var DashboardChart1Property = {
            "chart": {
                "animation": "0",
                "manageresize": "1",
                "origw": "400",
                "origh": "250",
                "showborder": "0",
                "managevalueoverlapping": "1",
                "autoaligntickvalues": "1",
                "bgalpha": "0",
                "fillangle": "45",
                "upperlimit": "360",
                "lowerlimit": "0",
                "majortmnumber": "8",
                "majortmheight": "10",
                "minortmnumber": "4", //显示多少刻度
                "minortmheight": "3", //刻度高度
                "showgaugeborder": "0",
                "gaugeouterradius": "140",
                "gaugeoriginx": "205",
                "gaugeoriginy": "205",
                "gaugeinnerradius": "2",
                "formatnumberscale": "1",
                "decmials": "2",
                "tickmarkdecimals": "1",
                "pivotradius": "10",
                "showpivotborder": "0",
                "pivotfillmix": "FFFFFF,000000",
                "tickvaluedistance": "10"
            },
            "colorrange": {
                "color": [
                  {
                      "minvalue": "0",
                      "maxvalue": "120",
                      "code": "40fe00"
                  },
                  {
                      "minvalue": "120",
                      "maxvalue": "240",
                      "code": "fcc400"
                  },
                  {
                      "minvalue": "240",
                      "maxvalue": "360",
                      "code": "eb1313"
                  }
                ]
            },
            "dials": {
                "dial": [
                  {
                      "value": "0",
                      "bgcolor": "000000,ff2d2d,000000",
                      "basewidth": "10",
                      "topwidth": "1",
                      "radius": "130"
                  }
                ]
            },
            "annotations": {
                "groups": [
                  {
                      "x": "205",
                      "y": "205",
                      "items": [
                      {
                          "type": "circle",
                          "x": "0",
                          "y": "2.5",
                          "radius": "150",
                          "startangle": "0",
                          "endangle": "180",
                          "showborder": "1",
                          "fillpattern": "linear",
                          "fillasgradient": "1",
                          "fillcolor": "000000",
                          "fillalpha": "100,100",
                          "fillratio": "1,99",
                          "bordercolor": "cccccc",
                          "borderthickness": "2",
                          "fillangle": "0"
                      }
                    ]
                  }
                ]
            }
        };
        ThisProPerty.BasciObj = DashboardChart1Property;
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
        Me.Set("ThemeInfo", null);
        Me.Set("ProPerty", ThisProPerty);
        this.Set("Position", PostionValue);
        obj = ThisProPerty = PagePars = PostionValue = null;
        Me.BindChart();
    },
    CustomProPanelShow: function () {
        Agi.Controls.DashboardChart1ProrityInit(this);
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
            var NewDashboardChart1 = new Agi.Controls.DashboardChart1();
            NewDashboardChart1.Init(ParentObj, PostionValue);
            newPanelPositionpars = null;
            return NewDashboardChart1;
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
            Agi.Controls.DashboardChart1ProrityInit(Me);
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
        /*  $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
        "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
        });*/
    },
    ControlAttributeChangeEvent: function (_obj, Key, _Value) {
        Agi.Controls.DashboardChart1AttributeChange(this, Key, _Value);
    },
    GetConfig: function () {
        var Me = this;
        var ProPerty = this.Get("ProPerty");
        /*  var ConfigObj = new Agi.Script.StringBuilder(); *//*配置信息数组对象*//*
         ConfigObj.append("<Control>");
         ConfigObj.append("<ControlType>" + Me.Get("ControlType") + "</ControlType>"); */
        /*控件类型*//*
         ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>"); */
        /*控件属性*//*
         ConfigObj.append("<DashboardChart1>" + JSON.stringify(ProPerty.BasciObj) + "</DashboardChart1>"); */
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
        var DashboardChart1Control = {
            Control: {
                ControlType: null, //*控件类型*//
                ControlID: null, //*控件属性*/
                DashboardChart1: null, //*控件属性*/
                CloumnName: null, //*数据列名称*//
                RealTimePoint: null, //*实时点位号*//
                Entity: null, //*控件实体*//
                ControlBaseObj: null, //*控件基础对象*//
                HTMLElement: null, //*控件外壳ID*//
                Position: null, //*控件位置信息*//
                ThemeInfo: null//主题名
            }
        }
        DashboardChart1Control.Control.ControlType = Me.Get("ControlType");
        DashboardChart1Control.Control.ControlID = ProPerty.ID;
        DashboardChart1Control.Control.DashboardChart1 = ProPerty.BasciObj;
        DashboardChart1Control.Control.CloumnName = ProPerty.CloumnName;
        DashboardChart1Control.Control.RealTimePoint = ProPerty.RealTimePoint;
        DashboardChart1Control.Control.Entity = Me.Get("Entity");
        DashboardChart1Control.Control.ControlBaseObj = ProPerty.ID;
        DashboardChart1Control.Control.HTMLElement = Me.Get("HTMLElement").id;
        DashboardChart1Control.Control.Position = Me.Get("Position");
        DashboardChart1Control.Control.ThemeInfo = Me.Get("ThemeInfo");
        return DashboardChart1Control.Control;
    }, //获得BasicChart控件的配置信息
    CreateControl: function (_Config, _Target) {
        var Me = this;
        Me.AttributeList = [];
        if (_Config != null) {
            if (_Target != null && _Target != "") {
                var _Targetobj = $(_Target);
                Me.Set("ControlType", "DashboardChart1");
                Me.Set("Entity", _Config.Entity); //实体
                var ID = _Config.ControlID;
                var CloumnName = _Config.CloumnName;
                var ThemeInfo = _Config.ThemeInfo;
                var RealTimePoint = _Config.RealTimePoint;
                var DashboardChart1ProPerty = _Config.DashboardChart1;
                var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty DashboardChart1PanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
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
                    BasciObj: DashboardChart1ProPerty,
                    CloumnName: CloumnName,
                    RealTimePoint: RealTimePoint
                };
                this.Set("HTMLElement", HTMLElementPanel[0]);

                if (_Target != null) {
                    this.Render(_Target);
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
//                Me.Set("ThemeInfo", ThemeInfo);
                Me.BindChart();
                Me.ReadOtherData(ThisProPerty.RealTimePoint);
                obj = ThisProPerty = PagePars = PostionValue = null;
            }
        }
    },
    ChangeTheme: function (_themeName) {
        var Me = this;
        //1.保存主题名称
        Me.Set("ThemeInfo", _themeName);
        //2.绑定样式
        Me.BindChart();
    } //更改控件样式
});
Agi.Controls.DashboardChart1.OptionsAppSty = function (StyleValue, Me) {
    if (StyleValue != null) {
        var ThisProPerty = Me.Get("ProPerty");
        var DashboardChartProperty = ThisProPerty.BasciObj;
        DashboardChartProperty.colorrange.color[0].code = StyleValue.colorrange;
        DashboardChartProperty.colorrange.color[1].code = StyleValue.colorrange;
        DashboardChartProperty.colorrange.color[2].code = StyleValue.colorrange;
        ThisProPerty.BasciObj = DashboardChartProperty;
        Me.Set("ProPerty", ThisProPerty);
        Me.BindChart();
    }
}
/*BasicChart参数更改处理方法*/
Agi.Controls.DashboardChart1AttributeChange = function (_ControlObj, Key, _Value) {
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
        var DashboardChart1Property = ThisProPerty.BasciObj;
        var ThisColorrangeColor=ChartStyleValue.colorrange.split(",");
        if(ThisColorrangeColor!=null && ThisColorrangeColor.length>0){
            for(var i=0;i<ThisColorrangeColor.length;i++){
                if(ThisColorrangeColor[i]!=""){
                    ThisColorrangeColor=ThisColorrangeColor[i];
                    break;
                }
            }
        }
        for (var i = 0; i < DashboardChart1Property.colorrange.color.length; i++) {
            DashboardChart1Property.colorrange.color[i].code = ThisColorrangeColor;
        }

        ThisProPerty.BasciObj = DashboardChart1Property;
        _ControlObj.Set("ProPerty", ThisProPerty);
    }
    if(Key == "ProPerty"){
        var DashboardChart1Property = _Value.BasciObj;
        if(DashboardChart1Property.colorrange.color!=null && DashboardChart1Property.colorrange.color.length>0){
            var ThisColorrangeColor=DashboardChart1Property.colorrange.color[0].code.split(",");
            if(ThisColorrangeColor!=null && ThisColorrangeColor.length>1){
                for(var i=0;i<ThisColorrangeColor.length;i++){
                    if(ThisColorrangeColor[i]!=""){
                        ThisColorrangeColor=ThisColorrangeColor[i];
                        break;
                    }
                }
                for (var i = 0; i < DashboardChart1Property.colorrange.color.length; i++) {
                    DashboardChart1Property.colorrange.color[i].code = ThisColorrangeColor;
                }
            }
        }
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDashboardChart1 = function () {
    return new Agi.Controls.DashboardChart1();
}
//BasicChart 自定义属性面板初始化显示
Agi.Controls.DashboardChart1ProrityInit = function (_DashboardChart1) {
    var Me = _DashboardChart1;
    var ThisProPerty = Me.Get("ProPerty");
    var DashboardChart1Property = ThisProPerty.BasciObj;
    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    var ColorRows = '';
    var _color = DashboardChart1Property.colorrange.color;
    for (var i = 1; i <= _color.length; i++){
        //<input type="button" value="删除" class="colorDel" color="' + DashboardChartProperty.colorrange.color[i - 1].code + '"  />
        ColorRows += '<tr class="colorClass"><td  class="prortityPanelTabletd0"> ' + i + '区Min:</td><td  class="prortityPanelTabletd1"><input data-field="minValue' + i + '" id="minValue' + i + '" type="number" value="" min ="0" max="1000"/></td><td class="prortityPanelTabletd0">Max:</td><td  class="prortityPanelTabletd1"><input data-field="maxValue' + i + '" id="maxValue' + i + '" type="number" value="" min ="0" max="1000"/></td></tr>';
    }
    //属性配置
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
    '<table  class="prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
    '<tr>' +
   '<td class="prortityPanelTabletd0"></td><td colspan="3" class="prortityPanelTabletd1"><input type="button" value="保存" id="btnDashboardChartSave1"/></td>' +
    '</tr>' +
    '<tr>' +
   '<td class="prortityPanelTabletd0">数据列：</td><td  class="prortityPanelTabletd1"><select data-field="ColumnName" id="ColumnName"></select></td>' +
    '<td class="prortityPanelTabletd0">点位号：</td><td  class="prortityPanelTabletd1"><input data-field="RealTimePoint" id="RealTimePoint" type="text" value=""/></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="prortityPanelTabletd0">样式：</td><td  class="prortityPanelTabletd1"><select data-field="className" id="className"> <option value=""></option><option value="class1">二分区</option><option value="class2">三分区</option><option value="class3">四分区</option><option value="class4">五分区</option></select> </td>' +
      '<td class="prortityPanelTabletd0">最大值：</td><td  class="prortityPanelTabletd1"><input data-field="txtupperlimit" id="txtupperlimit" type="text" value=""/></td>' +
    '</tr>' +
    ColorRows +
    '</table>' +
    '</div>');
    var BasicObj = ItemContent;
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: BasicObj }));

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
    $("#txtupperlimit").val(DashboardChart1Property.chart.upperlimit);
    $("#RealTimePoint").val(ThisProPerty.RealTimePoint);
    $("#bgColor").val(DashboardChart1Property.chart.bgcolor);
    for (var i = 1; i <= _color.length; i++) {
        $("#minValue" + i).val(DashboardChart1Property.colorrange.color[i - 1].minvalue);
        $("#maxValue" + i).val(DashboardChart1Property.colorrange.color[i - 1].maxvalue);
        //        $("#Color" + i).val(DashboardChart1Property.colorrange.color[i - 1].code);
    }
    var Entity = Me.Get("Entity");
    if (Entity[0] != null && Entity[0].Data != null && Entity[0].Data.length > 0) {
        for (var cloumnName in Entity[0].Data[0]) {
            $("#ColumnName").append("<option value='" + cloumnName + "'>" + cloumnName + "</option>");
        }
        if (ThisProPerty.CloumnName != "") {
            $("#ColumnName").val(ThisProPerty.CloumnName);
        }
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
    //                    DashboardChart1Property.colorrange.color[0].code = color.toHexString();
    //                    break;
    //                case 'Color2':
    //                    DashboardChart1Property.colorrange.color[1].code = color.toHexString();
    //                    break;
    //                case 'Color3':
    //                    DashboardChart1Property.colorrange.color[2].code = color.toHexString();
    //                    break;
    //                case 'Color4':
    //                    DashboardChart1Property.colorrange.color[3].code = color.toHexString();
    //                    break;
    //                case 'Color5':
    //                    DashboardChart1Property.colorrange.color[4].code = color.toHexString();
    //                    break;
    //            }

    //        }
    //    });
    $('.prortityPanelTabletd1>input').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "txtupperlimit":
                DashboardChart1Property.chart.upperlimit = $(this).val();
                break;
            case "minValue1":
                DashboardChart1Property.colorrange.color[0].minvalue = $(this).val();
                DashboardChart1Property.chart.lowerlimit = $(this).val();
                break;
            case "minValue2":
                DashboardChart1Property.colorrange.color[1].minvalue = $(this).val();
                break;
            case "minValue3":
                DashboardChart1Property.colorrange.color[2].minvalue = $(this).val();
                break;
            case "minValue4":
                DashboardChart1Property.colorrange.color[3].minvalue = $(this).val();
                break;
            case "minValue5":
                DashboardChart1Property.colorrange.color[4].minvalue = $(this).val();
                break;
            case "maxValue1":
                DashboardChart1Property.colorrange.color[0].maxvalue = $(this).val();
                break;
            case "maxValue2":
                DashboardChart1Property.colorrange.color[1].maxvalue = $(this).val();
                break;
            case "maxValue3":
                DashboardChart1Property.colorrange.color[2].maxvalue = $(this).val();
                break;
            case "maxValue4":
                DashboardChart1Property.colorrange.color[3].maxvalue = $(this).val();
                break;
            case "maxValue5":
                DashboardChart1Property.colorrange.color[4].maxvalue = $(this).val();
            case "RealTimePoint":
                ThisProPerty.RealTimePoint = $(this).val();
                PointEditState = true;
                break;

        }
    });
    $("#btnDashboardChartSave1").click(function () {
        if (PointEditState) {
            Me.ReadOtherData(ThisProPerty.RealTimePoint);
            PointEditState = !PointEditState;
        }
        ThisProPerty.BasciObj = DashboardChart1Property;
        Me.Set("ProPerty", ThisProPerty);
        Me.BindChart();
    });
    $("#ColumnName").change(function () {
        var Entity = Me.Get("Entity");
        var cloumnName = $(this).val();
        ThisProPerty.CloumnName = cloumnName;
        var _value = Entity[0].Data[0][cloumnName];
        if (!isNaN(_value)) {
            DashboardChart1Property.dials.dial[0].value = _value;
            //Me.BindChart();
        }
    });
    $("#className").change(function () {
        var className = $(this).val();
        if (className != "") {
            DashboardChart1Property.chart.upperlimit = "";
            DashboardChart1Property.chart.lowerlimit = "";
            DashboardChart1Property.colorrange = "";
            DashboardChart1Property.dials = "";
            switch (className) {
                case "class1":
                    DashboardChart1Property.chart.upperlimit = JSON.parse(JSON.stringify(class1_1.upperlimit));
                    DashboardChart1Property.chart.lowerlimit = JSON.parse(JSON.stringify(class1_1.lowerlimit));
                    DashboardChart1Property.colorrange = JSON.parse(JSON.stringify(class1_1.colorrange));
                    DashboardChart1Property.dials = JSON.parse(JSON.stringify(class1_1.dials));
                    break;
                case "class2":
                    DashboardChart1Property.chart.upperlimit = JSON.parse(JSON.stringify(class2_1.upperlimit));
                    DashboardChart1Property.chart.lowerlimit = JSON.parse(JSON.stringify(class2_1.lowerlimit));
                    DashboardChart1Property.colorrange = JSON.parse(JSON.stringify(class2_1.colorrange));
                    DashboardChart1Property.dials = JSON.parse(JSON.stringify(class2_1.dials));
                    break;
                case "class3":
                    DashboardChart1Property.chart.upperlimit = JSON.parse(JSON.stringify(class3_1.upperlimit));
                    DashboardChart1Property.chart.lowerlimit = JSON.parse(JSON.stringify(class3_1.lowerlimit));
                    DashboardChart1Property.colorrange = JSON.parse(JSON.stringify(class3_1.colorrange));
                    DashboardChart1Property.dials = JSON.parse(JSON.stringify(class3_1.dials));
                    break;
                case "class4":
                    DashboardChart1Property.chart.upperlimit = JSON.parse(JSON.stringify(class4_1.upperlimit));
                    DashboardChart1Property.chart.lowerlimit = JSON.parse(JSON.stringify(class4_1.lowerlimit));
                    DashboardChart1Property.colorrange = JSON.parse(JSON.stringify(class4_1.colorrange));
                    DashboardChart1Property.dials = JSON.parse(JSON.stringify(class4_1.dials));
                    break;
            }
            $(".prortityPanelTable>tbody").find(".colorClass").detach();
            for (var i = 1; i <= DashboardChart1Property.colorrange.color.length; i++) {
                //获取当前的table元素
                var prortityPanelTable = $(".prortityPanelTable");
                //获取当前行数
                var currentRow = prortityPanelTable.find("tbody>tr").length;
                var ColorName = "Color" + i;
                var minValue = "minValue" + i;
                var maxValue = "maxValue" + i;
                $('<tr class="colorClass"><td  class="prortityPanelTabletd0">' + i + '区Min:</td><td  class="prortityPanelTabletd1"><input data-field="' + minValue + '" id="' + minValue + '" type="number" value="" min="0" max="1000"/></td><td class="prortityPanelTabletd0">Max:</td><td  class="prortityPanelTabletd1"><input data-field="' + maxValue + '" id="' + maxValue + '" type="number" value="" min="0" max="1000"/></td></tr>').insertAfter(prortityPanelTable.find("tbody>tr")[currentRow - 1]);
                $("#minValue" + i).val(DashboardChart1Property.colorrange.color[i - 1].minvalue);
                $("#maxValue" + i).val(DashboardChart1Property.colorrange.color[i - 1].maxvalue);
                //                $("#Color" + i).val(DashboardChart1Property.colorrange.color[i - 1].code);
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
                //                                DashboardChart1Property.colorrange.color[0].code = color.toHexString();
                //                                break;
                //                            case 'Color2':
                //                                DashboardChart1Property.colorrange.color[1].code = color.toHexString();
                //                                break;
                //                            case 'Color3':
                //                                DashboardChart1Property.colorrange.color[2].code = color.toHexString();
                //                                break;
                //                            case 'Color4':
                //                                DashboardChart1Property.colorrange.color[3].code = color.toHexString();
                //                                break;
                //                            case 'Color5':
                //                                DashboardChart1Property.colorrange.color[4].code = color.toHexString();
                //                                break;
                //                        }

                //                    }
                //                });
                $('.prortityPanelTabletd1>input').change(function (obj) {
                    var pName = $(this).data('field');
                    switch (pName) {
                        case "txtupperlimit":
                            DashboardChart1Property.chart.upperlimit = $(this).val();
                            break;
                        case "minValue1":
                            DashboardChart1Property.colorrange.color[0].minvalue = $(this).val();
                            DashboardChart1Property.chart.lowerlimit = $(this).val();
                            break;
                        case "minValue2":
                            DashboardChart1Property.colorrange.color[1].minvalue = $(this).val();
                            break;
                        case "minValue3":
                            DashboardChart1Property.colorrange.color[2].minvalue = $(this).val();
                            break;
                        case "minValue4":
                            DashboardChart1Property.colorrange.color[3].minvalue = $(this).val();
                            break;
                        case "minValue5":
                            DashboardChart1Property.colorrange.color[4].minvalue = $(this).val();
                            break;
                        case "maxValue1":
                            DashboardChart1Property.colorrange.color[0].maxvalue = $(this).val();
                            break;
                        case "maxValue2":
                            DashboardChart1Property.colorrange.color[1].maxvalue = $(this).val();
                            break;
                        case "maxValue3":
                            DashboardChart1Property.colorrange.color[2].maxvalue = $(this).val();
                            break;
                        case "maxValue4":
                            DashboardChart1Property.colorrange.color[3].maxvalue = $(this).val();
                            break;
                        case "maxValue5":
                            DashboardChart1Property.colorrange.color[4].maxvalue = $(this).val();
                            break;
                    }
                });
            }
            ThisProPerty.BasciObj = DashboardChart1Property;
            Me.Set("ProPerty", ThisProPerty);
            if (Me.Get("ThemeInfo")) {
                Me.Set("ThemeInfo", Me.Get("ThemeInfo"));
            }
            Me.BindChart();
            $("#txtupperlimit").val(DashboardChart1Property.chart.upperlimit);
            //            $("#bgColor").val(DashboardChart1Property.chart.bgcolor);
        }
    });

}