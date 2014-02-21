/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-20
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 * BasicChart:基础Chart
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
var PointEditState = false;
Agi.Controls.ThermometerChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () { //获得实体数据
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
                //20130117 倪飘 集成共享数据源
                if (!_EntityInfo.IsShareEntity) {
                    //20130507 倪飘 修改bug，温度器控件拖入只有一个字段一条数据的dataset时，双击进入控件属性编辑页面，下方的表格中数据显示错误
                    //20130507 倪飘 修改bug，温度器控件拖入实体参数联动，保存页面再次进入数字指示器属性编辑页面是，下方显示无可用实体数据 但是页面还是可以联动
                    Agi.Utility.RequestData2(_EntityInfo, function (d) {
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
            }
        },
        ReadOtherData: function (Point) {
            var Me = this;
            var ThisProPerty = Me.Get("ProPerty");
            //20130517 倪飘 解决bug，实时控件（圆形仪表盘、半圆仪表盘、温度计、数字指示器），拖入点位后，删除属性面板中点位信息，点击保存，左侧控件还在读取点位信息
//            if (Point != "") {
                if (!Agi.Controls.IsOpenControl) {
                    Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": ThisProPerty.ID, "Points": [Point] });
                }
                else {
                    Agi.Msg.PointsManageInfo.AddViewPoint({ "ControlID": ThisProPerty.ID, "Points": [Point] });
                }
//            }
            ThisProPerty.RealTimePoint = Point;
            Me.Set("ProPerty", ThisProPerty);
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ThermometerChartProrityInit(this);
            }
        },
        ReadRealData: function (MsgObj) {
            //var Me = this;
            //var ThisProPerty = Me.Get("ProPerty");
            //var DashboardChartProperty = ThisProPerty.BasciObj;
            if (!isNaN(MsgObj.Value)) {
                var chart = this.chart;
                if(chart){
                    chart.setData(MsgObj.Value);
                }else{
                    this.BindChart();
                }
            }
        },
        BindChart: function () {
            var chart = null;
            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HTMLElement = Me.Get("HTMLElement");
            var ThermometerChartJson = MePrority.BasciObj;
            var ThermometerChartId = $(HTMLElement).find('div')[0].id;
            if (FusionCharts("_" + ThermometerChartId)) {
                FusionCharts("_" + ThermometerChartId).dispose();
            }
            chart = new FusionCharts("JS/Controls/ThermometerChart/image/Thermometer.swf", "_" + ThermometerChartId, "100%", "100%", "0", "1");
            chart.setTransparent(true);
            chart.setJSONData(ThermometerChartJson);
            chart.render($(HTMLElement).find('div')[0]);
            Me.chart = chart;
        },
        AddEntity: function (_entity) {
            if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
                var Me = this;
                var ProPerty = Me.Get("ProPerty");
                var ThermometerChartProPerty = ProPerty.BasciObj;
                for (var cloumnName in _entity.Data[0]) {
                    //20130121 倪飘 给圆形仪表盘，半圆仪表盘，温度计，LED控件添加dataset参数联动和共享数据源参数联动功能
                    if (ProPerty.CloumnName != "" && ProPerty.CloumnName === cloumnName) {
                        var _value = _entity.Data[0][cloumnName];
                        if (!isNaN(_value)) {
                            ThermometerChartProPerty.value = _entity.Data[0][cloumnName];
                            Me.BindChart();
                        }
                        break;
                    } else if (ProPerty.CloumnName == "") {
                        var _value = _entity.Data[0][cloumnName];
                        if (!isNaN(_value)) {
                            ThermometerChartProPerty.value = _entity.Data[0][cloumnName];
                            Me.BindChart();
                        }
                        break;
                    }
                }
                //20130121 倪飘 解决控件库-圆形仪表盘/半圆仪表盘/温度计，不可以在设置页面拖入数据问题
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                    //20130121 倪飘 更新实体数据之后更行高级属性面板
                    Agi.Controls.ThermometerChartProrityInit(Me);
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
            //20130121 倪飘 解决控件库-半圆仪表盘、圆形仪表盘、温度计-属性中的实体数据无法关闭删除问题
            if (!_EntityKey) {
                throw 'DataGrid.RemoveEntity Arg is null';
            }
            var self = this;
            var ProPerty = self.Get("ProPerty");
            var ThermometerChartProPerty = ProPerty.BasciObj;
            var entitys = self.Get('Entity');
            var index = -1;
            if (entitys && entitys.length) {
                for (var i = 0; i < entitys.length; i++) {
                    if (entitys[i]["Key"] == _EntityKey) {
                        index = i;
                        break;
                    }
                }
            }
            if (index >= 0) {
                entitys.splice(index, 1);
                ThermometerChartProPerty.value = null;
                self.BindChart();
            }
            //20130122 倪飘 删除实体数据之后更行高级属性面板
            Agi.Controls.ThermometerChartProrityInit(self);
        }, //移除实体Entity
        ParameterChange: function (_ParameterInfo) {
            var Me = this;
            var entity = this.Get("Entity");
            this.Set("Entity", entity);
            Agi.Utility.RequestData(entity[0], function (d) {
                entity[0].Data = d;
                Me.AddEntity(entity[0]);
                /*添加实体*/
            });
        }, //参数联动
        Init: function (_Target, _ShowPosition) {
            var Me = this;
            this.AttributeList = [];
            Me.Set("Entity", []);
            Me.Set("ControlType", "ThermometerChart");
            var ID = "ThermometerChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty ThermometerChartPanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
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
                HTMLElementPanel.width(130);
                HTMLElementPanel.height(380);
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
                CloumnName: "",
                BackGround: {
                    ahex: "00000000",
                    hex: "000000",
                    rgba: "rgba(0,0,0,0)",
                    type: 1,
                    value: { background: "rgba(0, 0, 0, 0)" }
                },
                RealTimePoint: ""
            };
            //20130525 倪飘 解决bug，温度计，当拖入数据的数值长度超过8位时，温度计底部的数字显示不全，如图
            var ThermometerChartProperty = {
                "chart": {
                    "animation": "0",
                    "manageresize": "1",
                    "lowerlimit": "0",
                    "upperlimit": "50",
                    "showborder": "0",
                    "bgalpha": "0",
                    "majortmnumber": "9",
                    "majortmcolor": "000000",
                    "minortmcolor": "000000",
                    "majortmwidth": "4",
                    "minortmnumber": "4",
                    "majortmthickness": "1",
                    "basefontcolor": "FF0000",
                    "decmials": "0",
                    "tickmarkdecmials": "0",
                    "thmfillcolor": "FF0000",
                    "chartleftmargin": "60",
                    "charttopmargin": "5",
                    "chartbottommargin": "5",
                    "numbersuffix": "°",
                    "borderthickness": "2",
                    "thmbulbradius": "20",
                    "showValues": "1"
                },
                "value": "0",
                "annotations": {
                    "groups": [
                        {
                            "showbelow": "1",
                            "items": [
                                {
                                    "type": "rectangle",
                                    "x": "$chartStartX",
                                    "y": "$chartStartY",
                                    "tox": "$chartEndX",
                                    "toy": "$chartEndY",
                                    "radius": "10",
                                    "showborder": "0",
                                    "borderthickness": "1",
                                    //zsj "fillcolor":"000000",
                                    //zsj "fillasgradient":"1",
                                    "fillangle": "90",
                                    "fillpattern": "linear",
                                    "fillalpha": "0"
                                }
                            //                          ,
                            //                          {
                            //                              "type": "text",
                            //                              "x": "80",
                            //                              "y": "343",
                            //                              "label": "F",
                            //                              "fontsize": "40",
                            //                              "fontcolor": "FFFFFF"
                            //                          }
                            ]
                        }
                    ]
                }
            };
            ThisProPerty.BasciObj = ThermometerChartProperty;
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
                        ev.stopPropagation();
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    }
                });
            }
            Me.Set("ProPerty", ThisProPerty);
            this.Set("Position", PostionValue);
            obj = ThisProPerty = PagePars = PostionValue = null;
            Me.BindChart();

            this.Set("ThemeName", null);

            //20130515 倪飘 解决bug，组态环境中拖入温度计控件以后拖入容器框控件，容器框控件会覆盖温度计控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        },
        CustomProPanelShow: function () {
            Agi.Controls.ThermometerChartProrityInit(this);
        }, //显示自定义属性面板
        Destory: function () {
            var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
            var proPerty = this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/

            //        Agi.Edit.workspace.controlList.remove(this);
            //        Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
            Agi.Controls.ControlDestoryByList(this); //移除控件,从列表中

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
                var NewThermometerChart = new Agi.Controls.ThermometerChart();
                NewThermometerChart.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewThermometerChart;
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
                Agi.Controls.ThermometerChartProrityInit(Me);
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
            /*   $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
            "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
            });*/
        },
        InEdit: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css({ "width": 120, "height": "100%" });
            this.IsEditState = true;
        }, //编辑中
        ExtEdit: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width);
                obj.height(this.oldSize.height);
                obj.resizable({
                }).css("position", "absolute");
            }
            this.IsEditState = false;
        }, //退出编辑
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.ThermometerChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var Me = this;
            var ProPerty = this.Get("ProPerty");
            /* var ConfigObj = new Agi.Script.StringBuilder(); */
            /*配置信息数组对象*/
            /*
            ConfigObj.append("<Control>");
            ConfigObj.append("<ControlType>" + Me.Get("ControlType") + "</ControlType>"); */
            /*控件类型*/
            /*
            ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>"); */
            /*控件属性*/
            /*
            ConfigObj.append("<ThermometerChart>" + JSON.stringify(ProPerty.BasciObj) + "</ThermometerChart>"); */
            /*控件属性*/
            /*
            ConfigObj.append("<CloumnName>" + ProPerty.CloumnName + "</CloumnName>"); */
            /*数据列名称*/
            /*
            ConfigObj.append("<RealTimePoint>" + ProPerty.RealTimePoint + "</RealTimePoint>"); */
            /*实时点位号*/
            /*
            ConfigObj.append("<Entity>" + JSON.stringify(Me.Get("Entity")) + "</Entity>"); */
            /*控件实体*/
            /*
            ConfigObj.append("<ControlBaseObj>" + ProPerty.ID + "</ControlBaseObj>"); */
            /*控件基础对象*/
            /*
            ConfigObj.append("<HTMLElement>" + Me.Get("HTMLElement").id + "</HTMLElement>"); */
            /*控件外壳ID*/
            /*
            ConfigObj.append("<Position>" + JSON.stringify(Me.Get("Position")) + "</Position>"); */
            /*控件位置信息*/
            /*
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串*/
            var ThermometerChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ThermometerChart: null, //控件基本属性
                    BackGround: null, //背景填充
                    CloumnName: null, //数据列名称
                    RealTimePoint: null, //实时点位
                    Entity: null, //控件实体
                    ControlBaseObj: null, //控件基本对象
                    HTMLElement: null, //控件外壳
                    Position: null, //控件位子
                    ThemeName: null//主题名
                }
            }
            ThermometerChartControl.Control.ControlType = Me.Get("ControlType");
            ThermometerChartControl.Control.ControlID = ProPerty.ID;
            ThermometerChartControl.Control.ThermometerChart = ProPerty.BasciObj;
            ThermometerChartControl.Control.CloumnName = ProPerty.CloumnName;
            ThermometerChartControl.Control.BackGround = ProPerty.BackGround;
            ThermometerChartControl.Control.RealTimePoint = ProPerty.RealTimePoint;
            ThermometerChartControl.Control.Entity = Me.Get("Entity");
            ThermometerChartControl.Control.ControlBaseObj = ProPerty.ID;
            ThermometerChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
            ThermometerChartControl.Control.Position = Me.Get("Position");
            ThermometerChartControl.Control.ThemeName = Me.Get("ThemeName");
            return ThermometerChartControl.Control;
        }, //获得BasicChart控件的配置信息
        CreateControl: function (_Config, _Target) {
            var Me = this;
            Me.AttributeList = [];
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    this.Set("ThemeName", _Config.ThemeName);

                    this.Set("ControlType", "ThermometerChart");


                    var ID = _Config.ControlID;
                    var CloumnName = _Config.CloumnName;
                    var RealTimePoint = _Config.RealTimePoint;
                    var BackGround = _Config.BackGround;
                    var ThermometerChartProPerty = _Config.ThermometerChart;
                    var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty ThermometerChartPanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
                    HTMLElementPanel.css('padding-bottom', '0px');
                    HTMLElementPanel.css(BackGround.value);
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
                        BasciObj: ThermometerChartProPerty,
                        CloumnName: CloumnName,
                        BackGround: BackGround,
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
                    this.Set("Position", PostionValue);
                    //                    if (_Config.hasOwnProperty("ThemeName")) {
                    //                        this.ChangeTheme(_Config.ThemeName);
                    //                    }
                    Me.Set("Entity", _Config.Entity); //实体
                    Me.ReadData(_Config.Entity[0]);
                    Me.BindChart();
                    Me.ReadOtherData(ThisProPerty.RealTimePoint);
                    obj = ThisProPerty = PagePars = PostionValue = null;
                }

            }
        },
        ChangeTheme: function (_themeName) {
            //1.根据当前控件类型和样式名称获取样式信息
            var StyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(this.Get("ControlType"), _themeName);

            //2.保存主题
            this.Set("ThemeName", _themeName);
            //3.应用当前控件的信息
            Agi.Controls.ThermometerChart.OptionsAppSty(StyleValue, this);

            //应用
            this.BindChart();
        } //更改样式
    });
Agi.Controls.ThermometerChart.OptionsAppSty = function (_StyConfig, ThermometerChart) {
    if (_StyConfig != null) {
        var ThisProPerty = ThermometerChart.Get("ProPerty");
        var DashboardChartProperty = ThisProPerty.BasciObj;
        //更改字体颜色
        //zsj DashboardChartProperty.annotations.groups[0].items[0].fillcolor = _StyConfig.fillcolor;
        //zsj DashboardChartProperty.annotations.groups[0].items[0].fillasgradient = _StyConfig.fillasgradient;
        DashboardChartProperty.annotations.groups[0].items[0].fillangle = _StyConfig.fillangle;
        DashboardChartProperty.annotations.groups[0].items[0].fillpattern = _StyConfig.fillpattern;
        DashboardChartProperty.annotations.groups[0].items[0].fillalpha = _StyConfig.fillalpha;
        ThisProPerty.BackGround=_StyConfig.BackGround;
        $(ThermometerChart.Get("HTMLElement")).css(ThisProPerty.BackGround.value);
//         //刻度颜色
//         DashboardChartProperty.chart.majortmcolor = _StyConfig.majortmcolor;
//         DashboardChartProperty.chart.minortmcolor = _StyConfig.minortmcolor;
        //填充颜色
//         DashboardChartProperty.chart.thmfillcolor = _StyConfig.thmfillcolor;
        ThisProPerty.BasciObj = DashboardChartProperty;
        ThermometerChart.Set("ProPerty", ThisProPerty);
    }
}
/*BasicChart参数更改处理方法*/
Agi.Controls.ThermometerChartAttributeChange = function (_ControlObj, Key, _Value) {
    var Me = this;
    if (Key == "Position") {
        if (layoutManagement.property.type == 1) {
            var ThisHTMLElementobj = $("#" + _ControlObj.Get("HTMLElement").id);
            var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

            var ParentObj = ThisHTMLElementobj.parent();
            var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
            ThisHTMLElementobj.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
            ThisHTMLElementobj.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");

            var ThisControlPars = { Width:parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                Height:parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))
            };

            ThisHTMLElementobj.width(ThisControlPars.Width);
            ThisHTMLElementobj.height(ThisControlPars.Height);
            ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
            /*Chart 更改大小*/
            ThisControlObj.Refresh();
            /*Chart 更改大小*/
            PagePars = null;
        }
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitThermometerChart = function () {
    return new Agi.Controls.ThermometerChart();
};
//BasicChart 自定义属性面板初始化显示
Agi.Controls.ThermometerChartProrityInit = function (_ThermometerChart) {
    var Me = _ThermometerChart;
    var ThisProPerty = Me.Get("ProPerty");
    var ThermometerChartProperty = ThisProPerty.BasciObj;
    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //属性配置
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
        '<table  class="prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">数据列：</td><td  class="prortityPanelTabletd1"><select data-field="ColumnName" id="ColumnName"></select></td>' +
        '<td class="prortityPanelTabletd0"></td><td   class="prortityPanelTabletd1"><input type="button" value="保存" id="btnThermometerChart"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">背景填充:</td><td colspan="3"  class="prortityPanelTabletd1"><div id="ThermomentChart_BgFillColor" class="ControlColorSelPanelSty"></div></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">长刻度线:</td><td  class="prortityPanelTabletd1"><input type="text" id="ThermomentChart_MaxortmColor" data-field="MaxortmColor" value="#ffffff" class="ThermomentChart_color"></td>' +
        '<td class="prortityPanelTabletd0">短刻度线:</td><td  class="prortityPanelTabletd1"><input type="text" id="ThermomentChart_Minortmcolor" data-field="Minortmcolor" value="#ffffff" class="ThermomentChart_color"></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">实时点位号：</td><td colspan="3" class="prortityPanelTabletd1"><input data-field="RealTimePoint" id="RealTimePoint" type="text" value=""  class="ControlProTextSty" maxlength="20" ischeck="false"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">下限:</td><td  class="prortityPanelTabletd1"><input data-field="lowerlimit" id="lowerlimit" type="number" value="0"/></td>' +
        '<td  class="prortityPanelTabletd0">填充色:</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="thmFillColor" id="thmFillColor"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td  class="prortityPanelTabletd0">上限:</td><td  class="prortityPanelTabletd1"><input data-field="upperlimit" id="upperlimit" type="number" value="0" /></td>' +
        '<td  class="prortityPanelTabletd0">字体颜色:</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="baseFontColor" id="baseFontColor"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td  class="prortityPanelTabletd0">符号:</td><td  class="prortityPanelTabletd1"><input data-field="numbersuffix" id="numbersuffix" type="text" value=""  class="ControlProTextSty" maxlength="5" ischeck="false"/></td>' +
        '<td  class="prortityPanelTabletd0">数字显示:</td><td  class="prortityPanelTabletd1"><input type="checkbox" data-field="showValues" id="showValues" /></td>' +
        '</tr>' +
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
    $("#lowerlimit").val(ThermometerChartProperty.chart.lowerlimit);
    $("#RealTimePoint").val(ThisProPerty.RealTimePoint);
    $("#upperlimit").val(ThermometerChartProperty.chart.upperlimit);
    $("#thmFillColor").val(ThermometerChartProperty.chart.thmfillcolor);
    $("#baseFontColor").val(ThermometerChartProperty.chart.basefontcolor);
    $("#numbersuffix").val(ThermometerChartProperty.chart.numbersuffix);
    $("#showValues").val(ThermometerChartProperty.chart.showValues);
    if (ThermometerChartProperty.chart.showValues == "1") {
        $("#showValues").attr("checked", true);
    }
    else {
        $("#showValues").attr("checked", false);
    }

    //20121228 14.56 倪飘 修改温度计高级属性实时应用的问题
    $("#thmFillColor").spectrum({
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
            ThermometerChartProperty.chart.thmfillcolor = color.toHexString();
            $("#btnThermometerChart").click();
        }
    });
    $("#baseFontColor").spectrum({
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

            ThermometerChartProperty.chart.basefontcolor = color.toHexString();
            $("#btnThermometerChart").click();
        }
    });
    $('.prortityPanelTabletd1>input').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "lowerlimit":
                //20130121 倪飘 修改控件库-温度计-设置温度计的下限温度大于上限温度，温度计显示温度不正确问题
                var lowerlimit = parseInt($(this).val());
                var upperlimit = parseInt($('#upperlimit').val());
                if (isNaN(lowerlimit)) {
                    lowerlimit = 0;
                    $(this).val(0);
                }
                if (isNaN(upperlimit)) {
                    upperlimit = 0;
                    $('#upperlimit').val(2);
                }
                if (lowerlimit > upperlimit) {
                    AgiCommonDialogBox.Alert("下限值不能大于上限值！请正确输入！");
                    $(this).val(ThermometerChartProperty.chart.lowerlimit);
                    return;
                }
                //                ThermometerChartProperty.chart.lowerlimit = $(this).val();

                break;
            case "upperlimit":
                //20130121 倪飘 修改控件库-温度计-设置温度计的下限温度大于上限温度，温度计显示温度不正确问题
                var lowerlimit = parseInt($('#lowerlimit').val());
                var upperlimit = parseInt($(this).val());
                if (isNaN(upperlimit)) {
                    upperlimit = 0;
                    $(this).val(2);
                }
                if (isNaN(lowerlimit)) {
                    lowerlimit = 0;
                    $('#lowerlimit').val(0);
                }
                if (upperlimit < lowerlimit) {
                    AgiCommonDialogBox.Alert("上限值不能小于下限值！请正确输入！");
                    $(this).val(ThermometerChartProperty.chart.upperlimit);
                    return;
                }
                //                ThermometerChartProperty.chart.upperlimit = $(this).val();

                break;
            case "RealTimePoint":
                ThisProPerty.RealTimePoint = $(this).val();
                PointEditState = true;
                break;
            //            case "numbersuffix": 
            //                ThermometerChartProperty.chart.numbersuffix = $(this).val(); 
            //                break; 
            //            case "numbersuffix": 
            //                ThermometerChartProperty.chart.numbersuffix = $("#numbersuffix").val();  
            //                break; 
            case "showValues":
                //                ThermometerChartProperty.chart.showValues = $(this).attr("checked") == "checked" ? "1" : "0";
                break;
        }
        //修改没有点击保存数据就保存的问题
        //        if (pName != "thmFillColor" && pName != "baseFontColor") {//add by lj 2012-12-29 修复选中颜色值，颜色控件没有及时显示对应的颜色问题 
        //            $("#btnThermometerChart").click();
        //        }
    });
    $("#btnThermometerChart").click(function () {
        if (PointEditState) {
            Me.ReadOtherData(ThisProPerty.RealTimePoint);
            PointEditState = !PointEditState;
        }
        //保存属性值
        ThisProPerty.CloumnName = TMColumnName;
        ThermometerChartProperty.chart.lowerlimit = $('#lowerlimit').val();
        ThermometerChartProperty.chart.upperlimit = $('#upperlimit').val();
        ThermometerChartProperty.chart.numbersuffix = $('#numbersuffix').val();
        //20130216 倪飘 修改复选框选中状态
        ThermometerChartProperty.chart.showValues = $('#showValues').attr("checked") == "checked" ? "1" : "0";
        ThisProPerty.BasciObj = ThermometerChartProperty;
        Me.Set("ProPerty", ThisProPerty);
        Me.BindChart();
    });
    var TMColumnName = "";
    $("#ColumnName").change(function () {
        var Entity = Me.Get("Entity");
        TMColumnName = $(this).val();
        //        ThisProPerty.CloumnName = TMColumnName;
        //20130520 倪飘 解决bug，温度计控件中拖入数据以后绑定数据列并保存，控件中显示的数据与绑定的数据列数据不一致
        var _value = Entity[0].Data[0][TMColumnName];
        if (!isNaN(_value)) {
            ThermometerChartProperty.value = _value;
            //Me.BindChart();
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

    //region 20130321 14:36 新增属性设置
    $(".ThermomentChart_color").spectrum({
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
            var pName = $(this).data('field');
            switch (pName) {
                case "MaxortmColor":
                    ThermometerChartProperty.chart.majortmcolor =color.toHexString();
                    break;
                case "Minortmcolor":
                    ThermometerChartProperty.chart.minortmcolor =color.toHexString();
                    break;
                case "FontColor":
                    ThermometerChartProperty.chart.basefontcolor=color.toHexString();
                    break;
            }
            Me.BindChart();
        }
    });//颜色设置，非背景色

    $("#ThermomentChart_BgFillColor").css(ThisProPerty.BackGround.value).data('colorValue', ThisProPerty.BackGround);
    $("#ThermomentChart_BgFillColor").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        var htmlElementID="#Panel_" + ThisProPerty.ID;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[2],true,function(color){
            if(color.type==2){
                if(color.direction!="horizontal"){
                    AgiCommonDialogBox.Alert("此图表只支持纯色和水平渐变色填充!");
                    return;
                }
            }
            $(oThisSelColorPanel).css(color.value).data('colorValue', color);
            $(htmlElementID).css(color.value);
            ThisProPerty.BackGround=color;
            oThisSelColorPanel=null;
            //zsj Agi.Controls.ThermomentChartFillBgColorApplay(color,ThermometerChartProperty);//颜色属性赋值

            Me.BindChart();
        });
    });//背景色

    //属性显示字体颜色，刻度颜色,tips颜色
    $("#ThermomentChart_FontColor").spectrum("set",ThermometerChartProperty.chart.basefontcolor);
    $("#ThermomentChart_MaxortmColor").spectrum("set",ThermometerChartProperty.chart.majortmcolor);
    $("#ThermomentChart_Minortmcolor").spectrum("set",ThermometerChartProperty.chart.minortmcolor);
/*zsj
    //属性显示景颜色
    var ThisFillBgcolorValue= {
        "type":2,
        "direction":"horizontal",
        "stopMarker":
            [{
                "position":0.01,
                "color":"",
                "ahex":""
            },{
                "position":0.99,
                "color":"",
                "ahex":""
            }],
        "value":
        {
            "background":""
        }
    };
    */
/*zsj
    if(ThermometerChartProperty.annotations.groups[0].items[0].fillcolor!=null &&
        ThermometerChartProperty.annotations.groups[0].items[0].fillasgradient!=null){
        var aThisfillbgcolors=ThermometerChartProperty.annotations.groups[0].items[0].fillcolor.split(",");
        var aThisfillbgcolorValues=ThermometerChartProperty.annotations.groups[0].items[0].fillasgradient.split(",");
        var aStopMarkers=[];
        var sBackgroundValueStr="";
        if(aThisfillbgcolors!=null && aThisfillbgcolors.length>0){
            for(var i=0;i<aThisfillbgcolors.length;i++){
                if(aThisfillbgcolors[i]!=""){
                    if(aThisfillbgcolors[i].indexOf("#")>-1){}else{
                        aThisfillbgcolors[i]="#"+aThisfillbgcolors[i];
                    }
                    aStopMarkers.push({ "position":0,"color":aThisfillbgcolors[i],"ahex":aThisfillbgcolors[i]});
                    if(i<aThisfillbgcolorValues.length && aThisfillbgcolorValues[i]!=""){
                        aStopMarkers[aStopMarkers.length-1].position=parseInt(aThisfillbgcolorValues[i])/100;
                        sBackgroundValueStr=sBackgroundValueStr+"color-stop("+aThisfillbgcolorValues[i]+"%,"+aThisfillbgcolors[i]+"),";
                    }else{
                        aStopMarkers[aStopMarkers.length-1].position=1;
                        sBackgroundValueStr=sBackgroundValueStr+"color-stop(100%,"+aThisfillbgcolors[i]+"),";
                    }
                }
            }
            if(sBackgroundValueStr.length>0){
                ThisFillBgcolorValue.stopMarker=aStopMarkers;
                sBackgroundValueStr=sBackgroundValueStr.substring(0,sBackgroundValueStr.length-1);
                ThisFillBgcolorValue.value.background="-webkit-gradient(linear, left top, right top,"+sBackgroundValueStr+")";

            }
        }
    }
    */
    //zsj Agi.Controls.ControlColorApply.fColorControlValueSet("ThermomentChart_BgFillColor",ThisFillBgcolorValue,true);//背景设置初始化

    //endregion
};
/*zsj
//DashboardChart 背景匹配
Agi.Controls.ThermomentChartFillBgColorApplay=function(_Color,_ThermomentChartPro){
    if(_Color!=null){
        if(_Color.type==1){
            if(_Color.ahex==="#ffffffff" || _Color.ahex==="ffffffff"){
                _ThermomentChartPro.annotations.groups[0].items[0].fillcolor="";
            }else{
                if(_Color.hex.indexOf("#")>-1){
                    _ThermomentChartPro.annotations.groups[0].items[0].fillcolor=_Color.hex;
                }else{
                    _ThermomentChartPro.annotations.groups[0].items[0].fillcolor="#"+_Color.hex;
                }
            }
            _ThermomentChartPro.annotations.groups[0].items[0].fillasgradient=100;
        }else if(_Color.type==2){
            if(_Color.stopMarker!=null && _Color.stopMarker.length>0){
                var afillcolorValues=[];
                var afillcolorNumbers=[];
                for(var i=0;i<_Color.stopMarker.length;i++){
                    if(_Color.stopMarker[i].ahex==="#ffffffff" || _Color.stopMarker[i].ahex==="ffffffff"){
                        afillcolorValues.push("");
                    }else{
                        if(_Color.stopMarker[i].ahex.indexOf("#")>-1){
                            afillcolorValues.push(_Color.stopMarker[i].ahex.substr(0,7));
                        }else{
                            afillcolorValues.push("#"+_Color.stopMarker[i].ahex.substr(0,6));
                        }
                    }
                    afillcolorNumbers.push(_Color.stopMarker[i].position*100);
                }
                _ThermomentChartPro.annotations.groups[0].items[0].fillcolor=afillcolorValues.toString();
                _ThermomentChartPro.annotations.groups[0].items[0].fillasgradient=afillcolorNumbers.toString();

                afillcolorValues=afillcolorNumbers=null;
            }
        }
    }
}*/