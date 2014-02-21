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
Agi.Controls.DashboardChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
                Agi.Controls.DashboardChartProrityInit(this);
            }
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
                            //                            ProPerty.CloumnName = cloumnName;
                            Me.BindChart();
                        }
                        break;
                    }
                    else if (ProPerty.CloumnName == "") {
                        var _value = _entity.Data[0][cloumnName];
                        if (!isNaN(_value)) {
                            DashboardChartProPerty.dials.dial[0].value = _entity.Data[0][cloumnName];
                            //                            ProPerty.CloumnName = cloumnName;
                            Me.BindChart();

                        }
                        break;
                    }
                }
                //20130121 倪飘 解决控件库-圆形仪表盘/半圆仪表盘/温度计，不可以在设置页面拖入数据问题
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                    //20130121 倪飘 更新实体数据之后更行高级属性面板
                    Agi.Controls.DashboardChartProrityInit(Me);
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
            var DashboardChartProPerty = ProPerty.BasciObj;
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
                DashboardChartProPerty.dials.dial[0].value = null;
                self.BindChart();
            }
            //删除数据后删掉共享数据源和控件的关系
            var ThisProPerty = self.Get('ProPerty');
            Agi.Msg.ShareDataRelation.DeleteItem(ThisProPerty.ID);
            //20130122 倪飘 删除实体数据之后更行高级属性面板
            Agi.Controls.DashboardChartProrityInit(self);
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
            this.ReadTimes = undefined;
            Me.Set("Entity", []);
            Me.Set("ControlType", "DashboardChart");
            Me.property = {
                background:null
            };
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
                RealTimePoint: "",
                ThemeName: "theme1",
                ClassName: "class0"
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
                        ev.stopPropagation();
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    }
                });
            }
            Me.Set("ProPerty", ThisProPerty);
            Me.Set("Position", PostionValue);
            obj = ThisProPerty = PagePars = PostionValue = null;
            Me.BindChart();

            //20130515 倪飘 解决bug，组态环境中拖入圆形仪表盘以后拖入容器框控件，容器框控件会覆盖圆形仪表盘控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        },
        CustomProPanelShow: function () {
            Agi.Controls.DashboardChartProrityInit(this);
        }, //显示自定义属性面板
        Destory: function () {
            var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
            var proPerty = this.Get("ProPerty");
            //            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/

            //            Agi.Edit.workspace.controlList.remove(this);
            //            Agi.Edit.workspace.currentControls.length = 0;
            //            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中
            /*清除选中控件对象*/

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
            ConfigObj.append("<DashboardChart>" + JSON.stringify(ProPerty.BasciObj) + "</DashboardChart>"); */
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
            var DashboardChartControl = {
                Control: {
                    ControlType: null, //*控件类型*//
                    ControlID: null, //*控件属性*//
                    DashboardChart: null, //*控件属性*//
                    CloumnName: null, //*数据列名称*//
                    RealTimePoint: null, //*实时点位号*//
                    ThemeName: null,
                    ClassName: null,
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
            DashboardChartControl.Control.ThemeName = ProPerty.ThemeName;
            DashboardChartControl.Control.ClassName = ProPerty.ClassName;
            DashboardChartControl.Control.Entity = Me.Get("Entity");
            DashboardChartControl.Control.ControlBaseObj = ProPerty.ID;
            DashboardChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
            DashboardChartControl.Control.Position = Me.Get("Position");
            DashboardChartControl.Control.ThemeInfo = Me.Get("ThemeInfo");
            DashboardChartControl.Control.Property = Me.property;
            return DashboardChartControl.Control;
        }, //获得BasicChart控件的配置信息
        CreateControl: function (_Config, _Target) {
            var Me = this;
            Me.AttributeList = [];
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    Me.Set("ControlType", "DashboardChart");
                    Me.property = _Config.Property;
                    var ID = _Config.ControlID;
                    var CloumnName = _Config.CloumnName;
                    var ThemeInfo = _Config.ThemeInfo;
                    var RealTimePoint = _Config.RealTimePoint;
                    var ThemeName = _Config.ThemeName;
                    var ClassName = _Config.ClassName;
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
                        RealTimePoint: RealTimePoint,
                        ThemeName: ThemeName,
                        ClassName: ClassName
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
                    //                    Me.Set("ThemeInfo", _Config.ThemeInfo);
                    Me.Set("Entity", _Config.Entity); //实体
                    Me.ReadData(_Config.Entity[0]);
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
    if(Key == "ProPerty"){
        var DashboardChartProperty = _Value.BasciObj;
        if(DashboardChartProperty.colorrange.color!=null && DashboardChartProperty.colorrange.color.length>0){
            for (var i = 0; i < DashboardChartProperty.colorrange.color.length; i++) {
                DashboardChartProperty.colorrange.color[i].code = DashboardChartProperty.colorrange.color[i].code.split(",")[0];
            }
        }

    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDashboardChart = function () {
    return new Agi.Controls.DashboardChart();
}
//DashboardChart 自定义属性面板初始化显示
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
        ColorRows += '<tr class="colorClass"><td  class="prortityPanelTabletd0"> ' + i + '区Min:</td><td  class="DashboardChart_prortityPanelTabletd1"><input data-field="minValue' + i + '" id="minValue' + i + '" type="number" min="0" value="0" /></td><td class="prortityPanelTabletd0">Max:</td><td  class="DashboardChart_prortityPanelTabletd1"><input data-field="maxValue' + i + '" id="maxValue' + i + '" type="number" min="0" value="0"/></td><td class="DshbChart1PanelTabletd0">颜色:<input data-field=' + i + ' id="DshChartPartition' + i + '_Color" type="text" value="" class="DshChartPartitionColorSty"/></td></tr>';
    }
    //属性配置
    //20130408 倪飘 解决bug，瀑布图控件高级属性中，数据曲线设置面板会被其他控件影响样式
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
        '<table  class="DashboardChart_prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
        '<tr>' +
        '<td class="DashboardChart_prortityPanelTabletd0">数据列:</td><td  class="DashboardChart_prortityPanelTabletd1"><select data-field="ColumnName" id="ColumnName"></select></td>' +
        '<td  class="DashboardChart_prortityPanelTabletd0"></td><td  class="DashboardChart_prortityPanelTabletd1" colspan="2"><input type="button" value="保存" id="btnDashboardChartSave"/></td>' +
    //   '<td class="prortityPanelTabletd0">主题:</td><td  class="prortityPanelTabletd1"><select data-field="themeName" id="themeName"> <option value=""></option><option value="theme1">主题1</option><option value="theme2">主题2</option><option value="theme3">主题3</option></select> </td>' +
        '</tr>' +
        '<tr>' +
        '<td class="DashboardChart_prortityPanelTabletd0">背景填充:</td><td  class="DashboardChart_prortityPanelTabletd1" colspan="4"><div id="DashboardChart_BgFillColor" style="background:-webkit-radial-gradient(center, ellipse cover,#ffffff 1%,#000000 99%)" class="ControlColorSelPanelSty"></div></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="DashboardChart_prortityPanelTabletd0">长刻度线:</td><td  class="DashboardChart_prortityPanelTabletd1"><input type="text" id="DashboardChart_MaxortmColor" data-field="MaxortmColor" value="#ffffff" class="DashboardChart_color"></td>' +
        '<td class="DashboardChart_prortityPanelTabletd0">短刻度线:</td><td  class="DashboardChart_prortityPanelTabletd1" colspan="2"><input type="text" id="DashboardChart_Minortmcolor" data-field="Minortmcolor" value="#ffffff" class="DashboardChart_color"></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="DashboardChart_prortityPanelTabletd0">字体颜色:</td><td class="DashboardChart_prortityPanelTabletd1"><input type="text" id="DashboardChart_FontColor" data-field="FontColor" value="#ffffff" class="DashboardChart_color"></td>' +
        '<td class="DashboardChart_prortityPanelTabletd0">Tips背景:</td><td class="DashboardChart_prortityPanelTabletd1" colspan="2"><input type="text" id="DashboardChart_TooltipsColor" data-field="TooltipsColor" value="#ffffff" class="DashboardChart_color"></td>' +
        '</tr>' +
        '<tr>' +
    //20130223 倪飘 解决控件库-圆形仪表盘（半圆形仪表盘），拖入点位进入属性设置界面，主题（样式）下拉框第一个是空白，选择空白点击保存，左侧控件无变化问题
        '<td class="DashboardChart_prortityPanelTabletd0">主题:</td><td  class="DashboardChart_prortityPanelTabletd1"><select data-field="themeName" id="themeName"><option value="theme1">主题1</option><option value="theme2">主题2</option></select> </td>' +
        '<td class="DashboardChart_prortityPanelTabletd0">点位号:</td><td  class="DashboardChart_prortityPanelTabletd1" colspan="2"><input data-field="RealTimePoint" id="RealTimePoint" type="text" value="" class="ControlProTextSty" maxlength="20" ischeck="false"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="DashboardChart_prortityPanelTabletd0">样式:</td><td  class="DashboardChart_prortityPanelTabletd1"><select data-field="className" id="className"> <option value="class0">一分区</option><option value="class1">二分区</option><option value="class2">三分区</option><option value="class3">四分区</option><option value="class4">五分区</option></select> </td>' +
        '<td class="DashboardChart_prortityPanelTabletd0">最大值:</td><td colspan="2"  class="DashboardChart_prortityPanelTabletd1" ><input data-field="txtupperlimit" id="txtupperlimit" type="text" value="" class="ControlProTextSty" maxlength="5" ischeck="false"/></td>' +
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
        AgiCommonDialogBox.Alert(itemtitle);
    }
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    $("#txtupperlimit").val(DashboardChartProperty.chart.upperlimit);
    $("#RealTimePoint").val(ThisProPerty.RealTimePoint);
    $("#bgColor").val(DashboardChartProperty.chart.bgcolor);
    $("#themeName").val(ThisProPerty.ThemeName);
    $("#className").val(ThisProPerty.ClassName);
    for (var i = 1; i <= _color.length; i++) {
        $("#minValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].minvalue);
        $("#maxValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].maxvalue);
        //        $("#Color" + i).val(DashboardChartProperty.colorrange.color[i - 1].code);
    }

    $('.DashboardChart_prortityPanelTabletd1>input').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "txtupperlimit":
                var upperlimit = parseInt($(this).val(), 10);
                if (isNaN(upperlimit)) {
                    upperlimit = 150;
                }
                if (upperlimit < 0) {
                    upperlimit = 0;
                }
                $(this).val(upperlimit);
                //修改没有点击保存数据就保存的问题
                //                DashboardChartProperty.chart.upperlimit = upperlimit + "";

                break;
            case "minValue1":
                DashboardChartProperty.chart.lowerlimit = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                DashboardChartProperty.colorrange.color[0].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "minValue2":
                DashboardChartProperty.colorrange.color[1].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "minValue3":
                DashboardChartProperty.colorrange.color[2].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "minValue4":
                DashboardChartProperty.colorrange.color[3].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "minValue5":
                DashboardChartProperty.colorrange.color[4].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "maxValue1":
                DashboardChartProperty.colorrange.color[0].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "maxValue2":
                DashboardChartProperty.colorrange.color[1].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "maxValue3":
                DashboardChartProperty.colorrange.color[2].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "maxValue4":
                DashboardChartProperty.colorrange.color[3].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                break;
            case "maxValue5":
                DashboardChartProperty.colorrange.color[4].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
            case "RealTimePoint":
                DBRealTimePoint = $(this).val();
                PointEditState = true;
                break;
        }
    });
    function setInputValid() {
        //添加非法输入验证
        $('.DashboardChart_prortityPanelTabletd1>input').focus(function (obj) {
            //记录当前合法值
            var val = $(this).val();
            if (!isNaN(val)) {
                $(this).data('preValue', val);
            }
        });
        $('.DashboardChart_prortityPanelTabletd1>input').blur(function (obj) {
            var pName = $(this).data('field');
            var val = $(this).val();
            if (val === '') {//非法值
                val = $(this).data('preValue');
            }
            switch (pName) {
                case "minValue1":
                case "minValue2":
                case "minValue3":
                case "minValue4":
                case "minValue5":
                case "maxValue1":
                case "maxValue2":
                case "maxValue3":
                case "maxValue4":
                case "maxValue5":
                    $(this).val(val);  //还原正确值
                    break;
            }
        });
        //end 添加非法输入验证
    }
    setInputValid();
    $(".DshChartPartitionColorSty").unbind().spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['#40fe00', '#fcc400'],
            ['#eb1313', '#1cf7ef'],
            ['#22a7fb', '#a6a6a7'],
            ['#f5f5f5', '#e6fc30']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function (color) {
            var colorIndex = $(this).data('field') - 1;
            DashboardChartProperty.colorrange.color[colorIndex].code = color.toHexString();
            Me.BindChart();
        }
    });
    //region 初始化颜色控件值显示
    $(".DshChartPartitionColorSty").each(function (ob) {
        var ThisIndex = $(this).data('field') - 1;
        if (DashboardChartProperty.colorrange.color[ThisIndex].code.indexOf("#") > -1) { } else {
            DashboardChartProperty.colorrange.color[ThisIndex].code = "#" + DashboardChartProperty.colorrange.color[ThisIndex].code;
        }
        $(this).spectrum("set", DashboardChartProperty.colorrange.color[ThisIndex].code);
    });

    var DBRealTimePoint = "";
    $("#btnDashboardChartSave").click(function () {
        if (PointEditState) {
            ThisProPerty.RealTimePoint = DBRealTimePoint;
            Me.ReadOtherData(ThisProPerty.RealTimePoint);
            PointEditState = !PointEditState;
        }
        //保存最大值
        DashboardChartProperty.chart.upperlimit = $('#txtupperlimit').val() + "";
        //20130121 倪飘 解决控件库-圆形仪表盘，数据列，下拉框选择需要的数据列，没有点击保存，返回整体页面再双击进入显示的却是选择的数据列问题
        if (DBcloumnName != "") {
            ThisProPerty.CloumnName = DBcloumnName;
        }
        if (DBThemename != "") {
            ThisProPerty.ThemeName = DBThemename;
            switch (DBThemename) {
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

        switch (ThisProPerty.ClassName) {
            case "class0":
                if (parseInt(DashboardChartProperty.colorrange.color[0].maxvalue) != parseInt(DashboardChartProperty.chart.upperlimit)) {
                    AgiCommonDialogBox.Alert("最大值和最大分区值不一致！");
                    return;
                }
                break;
            case "class1":
                if (parseInt(DashboardChartProperty.colorrange.color[1].maxvalue) != parseInt(DashboardChartProperty.chart.upperlimit)) {
                    AgiCommonDialogBox.Alert("最大值和最大分区值不一致！");
                    return;
                }
                break;
            case "class2":
                if (parseInt(DashboardChartProperty.colorrange.color[2].maxvalue) != parseInt(DashboardChartProperty.chart.upperlimit)) {
                    AgiCommonDialogBox.Alert("最大值和最大分区值不一致！");
                    return;
                }
                break;
            case "class3":
                if (parseInt(DashboardChartProperty.colorrange.color[3].maxvalue) != parseInt(DashboardChartProperty.chart.upperlimit)) {
                    AgiCommonDialogBox.Alert("最大值和最大分区值不一致！");
                    return;
                }
                break;
            case "class4":
                if (parseInt(DashboardChartProperty.colorrange.color[4].maxvalue) != parseInt(DashboardChartProperty.chart.upperlimit)) {
                    AgiCommonDialogBox.Alert("最大值和最大分区值不一致！");
                    return;
                }
                break;
        }



        //20130104 倪飘 解决组态环境中，圆形仪表盘和半圆形仪表盘属性基本设置中区间的选择时候，各个区的max值与min值不符合逻辑问题
        //20130121 倪飘 解决控件库-半圆仪表盘/圆形仪表盘-属性页面在分区中，输入非数字类字符，点击确定无提示框问题
        if (DashboardChartProperty.colorrange.color[0]) {
            if (BASEisNotNum(DashboardChartProperty.colorrange.color[0].maxvalue) || BASEisNotNum(DashboardChartProperty.colorrange.color[0].minvalue)) {
                AgiCommonDialogBox.Alert("第一分区值设定不正确，请输入正确的数值！");
                return;
            }
            if (parseInt(DashboardChartProperty.colorrange.color[0].maxvalue) < parseInt(DashboardChartProperty.colorrange.color[0].minvalue) || parseInt(DashboardChartProperty.colorrange.color[0].maxvalue) > parseInt(DashboardChartProperty.chart.upperlimit)) {
                AgiCommonDialogBox.Alert("第一分区值设定不正确，请重新设定！");
                return;
            }
        }

        if (DashboardChartProperty.colorrange.color[1]) {
            if (BASEisNotNum(DashboardChartProperty.colorrange.color[1].maxvalue) || BASEisNotNum(DashboardChartProperty.colorrange.color[1].minvalue)) {
                AgiCommonDialogBox.Alert("第一分区值设定不正确，请输入正确的数值！");
                return;
            }
            if (parseInt(DashboardChartProperty.colorrange.color[1].maxvalue) < parseInt(DashboardChartProperty.colorrange.color[1].minvalue) || parseInt(DashboardChartProperty.colorrange.color[0].maxvalue) > parseInt(DashboardChartProperty.colorrange.color[1].minvalue) || parseInt(DashboardChartProperty.colorrange.color[1].maxvalue) > parseInt(DashboardChartProperty.chart.upperlimit)) {
                AgiCommonDialogBox.Alert("第二分区值设定不正确，请重新设定！");
                return;
            }
        }

        if (DashboardChartProperty.colorrange.color[2]) {
            if (BASEisNotNum(DashboardChartProperty.colorrange.color[2].maxvalue) || BASEisNotNum(DashboardChartProperty.colorrange.color[2].minvalue)) {
                AgiCommonDialogBox.Alert("第一分区值设定不正确，请输入正确的数值！");
                return;
            }
            if (parseInt(DashboardChartProperty.colorrange.color[2].maxvalue) < parseInt(DashboardChartProperty.colorrange.color[2].minvalue) || parseInt(DashboardChartProperty.colorrange.color[1].maxvalue) > parseInt(DashboardChartProperty.colorrange.color[2].minvalue) || parseInt(DashboardChartProperty.colorrange.color[2].maxvalue) > parseInt(DashboardChartProperty.chart.upperlimit)) {
                AgiCommonDialogBox.Alert("第三分区值设定不正确，请重新设定！");
                return;
            }
        }

        if (DashboardChartProperty.colorrange.color[3]) {
            if (BASEisNotNum(DashboardChartProperty.colorrange.color[3].maxvalue) || BASEisNotNum(DashboardChartProperty.colorrange.color[3].minvalue)) {
                AgiCommonDialogBox.Alert("第一分区值设定不正确，请输入正确的数值！");
                return;
            }
            if (parseInt(DashboardChartProperty.colorrange.color[3].maxvalue) < parseInt(DashboardChartProperty.colorrange.color[3].minvalue) || parseInt(DashboardChartProperty.colorrange.color[2].maxvalue) > parseInt(DashboardChartProperty.colorrange.color[3].minvalue) || parseInt(DashboardChartProperty.colorrange.color[3].maxvalue) > parseInt(DashboardChartProperty.chart.upperlimit)) {
                AgiCommonDialogBox.Alert("第四分区值设定不正确，请重新设定！");
                return;
            }
        }

        if (DashboardChartProperty.colorrange.color[4]) {
            if (BASEisNotNum(DashboardChartProperty.colorrange.color[4].maxvalue) || BASEisNotNum(DashboardChartProperty.colorrange.color[4].minvalue)) {
                AgiCommonDialogBox.Alert("第一分区值设定不正确，请输入正确的数值！");
                return;
            }
            if (parseInt(DashboardChartProperty.colorrange.color[4].maxvalue) < parseInt(DashboardChartProperty.colorrange.color[4].minvalue) || parseInt(DashboardChartProperty.colorrange.color[3].maxvalue) > parseInt(DashboardChartProperty.colorrange.color[4].minvalue) || parseInt(DashboardChartProperty.colorrange.color[4].maxvalue) > parseInt(DashboardChartProperty.chart.upperlimit)) {
                AgiCommonDialogBox.Alert("第五分区值设定不正确，请重新设定！");
                return;
            }
        }

        //判断是否为数字方法
        function BASEisNotNum(theNum) {
            //判断是否为数字
            theNum += "";
            if (theNum.trim() == "")
                return true;
            for (var i = 0; i < theNum.length; i++) {
                oneNum = theNum.substring(i, i + 1);
                if (oneNum < "0" || oneNum > "9")
                    return true;
            }
            return false;
        }

        //20130115 倪飘 解决仪表盘分区不能设置问题


        //andy guo 2013/1/16 fix bug no:128
        var rangeCount = DashboardChartProperty.colorrange.color.length;
        for (var i = 0; i < rangeCount - 1; i++) {
            var range1 = DashboardChartProperty.colorrange.color[i];
            var range2 = DashboardChartProperty.colorrange.color[i + 1];
            if (parseInt(range1.maxvalue) !== parseInt(range2.minvalue)) {
                AgiCommonDialogBox.Alert((i + 1) + '区最大值与' + (i + 2) + '区最小值不能存在误差,请重新设定!');
                return;
            }
        }

        ThisProPerty.BasciObj = DashboardChartProperty;
        Me.Set("ProPerty", ThisProPerty);
        Me.BindChart();
    });
    var DBcloumnName = "";
    $("#ColumnName").change(function () {
        var Entity = Me.Get("Entity");
        DBcloumnName = $(this).val();
        //20130507 倪飘 解决bug，圆形仪表盘控件拖入数据双击进入属性编辑页面，选择字段列展开，选择第一个空白的选项点击保存按钮，控件没有反应
        if (DBcloumnName.trim() != "请选择值") {
            var _value = Entity[0].Data[0][DBcloumnName];
            if (!isNaN(_value)) {
                DashboardChartProperty.dials.dial[0].value = _value;
            }
        } else {
            AgiCommonDialogBox.Alert("显示列不能为空!");
            $(this).val(ThisProPerty.CloumnName);
        }
    });
    var DBThemename = "";
    $("#themeName").change(function () {
        var themeName = $(this).val();
        if (themeName != "") {

            DBThemename = themeName;

        }
    });

    $("#className").change(function () {
        var className = $(this).val();
        if (className != "") {
            DashboardChartProperty.chart.upperlimit = "";
            DashboardChartProperty.chart.lowerlimit = "";
            DashboardChartProperty.colorrange = "";
            DashboardChartProperty.dials = "";
            ThisProPerty.ClassName = className;   //20121227 10:00 倪飘 修改仪表盘样式主题下拉框保存之后为空的问题
            //20130524 倪飘 解决bug，圆形仪表盘控件拖入实体后，选择显示字段列，点击保存，修改分区后，仪表盘指针指示位置不正确
            switch (className) {
                //20130122 倪飘 解决控件库-圆形仪表盘-页面拖入圆形仪表盘，双击进入属性，主题和样式不显示默认选项问题  
                //20130528 倪飘 解决bug，圆形仪表盘，未拖入数据时，切换分区后，下方的分区列表无变化，F12报错                  
                case "class0":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class0.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class0.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class0.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class0.dials));
                    if (Entity[0] != undefined) {
                        DashboardChartProperty.dials.dial[0].value = Entity[0].Data[0][ThisProPerty.CloumnName];
                    }
                    break;
                case "class1":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class1.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class1.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class1.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class1.dials));
                    if (Entity[0] != undefined) {
                        DashboardChartProperty.dials.dial[0].value = Entity[0].Data[0][ThisProPerty.CloumnName];
                    }
                    break;
                case "class2":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class2.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class2.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class2.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class2.dials));
                    if (Entity[0] != undefined) {
                        DashboardChartProperty.dials.dial[0].value = Entity[0].Data[0][ThisProPerty.CloumnName];
                    }
                    break;
                case "class3":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class3.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class3.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class3.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class3.dials));
                    if (Entity[0] != undefined) {
                        DashboardChartProperty.dials.dial[0].value = Entity[0].Data[0][ThisProPerty.CloumnName];
                    }
                    break;
                case "class4":
                    DashboardChartProperty.chart.upperlimit = JSON.parse(JSON.stringify(class4.upperlimit));
                    DashboardChartProperty.chart.lowerlimit = JSON.parse(JSON.stringify(class4.lowerlimit));
                    DashboardChartProperty.colorrange = JSON.parse(JSON.stringify(class4.colorrange));
                    DashboardChartProperty.dials = JSON.parse(JSON.stringify(class4.dials));
                    if (Entity[0] != undefined) {
                        DashboardChartProperty.dials.dial[0].value = Entity[0].Data[0][ThisProPerty.CloumnName];
                    }
                    break;
            }
            //20130509 倪飘 解决bug，圆形仪表盘修改分区后，点击保存，下方的分区不显示需要返回整体页面后再进入属性编辑页面才会显示
            $(".DashboardChart_prortityPanelTable>tbody").find(".colorClass").detach();
            for (var i = 1; i <= DashboardChartProperty.colorrange.color.length; i++) {
                //获取当前的table元素
                var prortityPanelTable = $(".DashboardChart_prortityPanelTable");
                //获取当前行数
                var currentRow = prortityPanelTable.find("tbody>tr").length;
                var ColorName = "Color" + i;
                var minValue = "minValue" + i;
                var maxValue = "maxValue" + i;
                $('<tr class="colorClass"><td  class="prortityPanelTabletd0">' + i + '区Min:</td><td  class="DashboardChart_prortityPanelTabletd1"><input data-field="' + minValue + '" id="' + minValue + '" type="number" min="0" value="0"/></td><td class="prortityPanelTabletd0">Max:</td><td  class="DashboardChart_prortityPanelTabletd1"><input data-field="' + maxValue + '" id="' + maxValue + '" type="number" min="0" value="150"/></td><td class="DshbChart1PanelTabletd0">颜色:<input data-field=' + i + ' id="DshChartPartition' + i + '_Color" type="text" value="" class="DshChartPartitionColorSty"/></td></tr>').insertAfter(prortityPanelTable.find("tbody>tr")[currentRow - 1]);
                $("#minValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].minvalue);
                $("#maxValue" + i).val(DashboardChartProperty.colorrange.color[i - 1].maxvalue);
                $("#Color" + i).val(DashboardChartProperty.colorrange.color[i - 1].code);

                //20130115 倪飘 解决仪表盘分区不能设置问题
                $('.DashboardChart_prortityPanelTabletd1>input').change(function (obj) {
                    var pName = $(this).data('field');
                    switch (pName) {
                        case "txtupperlimit":
                            var upperlimit = parseInt($(this).val(), 10);
                            if (isNaN(upperlimit)) {
                                upperlimit = 150;
                            }
                            if (upperlimit < 0) {
                                upperlimit = 0;
                            }
                            $(this).val(upperlimit);

                            break;
                        case "minValue1":
                            DashboardChartProperty.colorrange.color[0].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            DashboardChartProperty.chart.lowerlimit = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "minValue2":
                            DashboardChartProperty.colorrange.color[1].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "minValue3":
                            DashboardChartProperty.colorrange.color[2].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "minValue4":
                            DashboardChartProperty.colorrange.color[3].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "minValue5":
                            DashboardChartProperty.colorrange.color[4].minvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "maxValue1":
                            DashboardChartProperty.colorrange.color[0].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "maxValue2":
                            DashboardChartProperty.colorrange.color[1].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "maxValue3":
                            DashboardChartProperty.colorrange.color[2].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "maxValue4":
                            DashboardChartProperty.colorrange.color[3].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                        case "maxValue5":
                            DashboardChartProperty.colorrange.color[4].maxvalue = $(this).val() == "" ? 0 : parseInt($(this).val(), 10);
                            break;
                    }
                });

            }
            $(".DshChartPartitionColorSty").unbind().spectrum({
                showInput: true,
                showPalette: true,
                palette: [
                    ['#40fe00', '#fcc400'],
                    ['#eb1313', '#1cf7ef'],
                    ['#22a7fb', '#a6a6a7'],
                    ['#f5f5f5', '#e6fc30']
                ],
                cancelText: "取消",
                chooseText: "选择",
                change: function (color) {
                    var colorIndex = $(this).data('field') - 1;
                    DashboardChartProperty.colorrange.color[colorIndex].code = color.toHexString();
                    Me.BindChart();
                }
            });
            for (var _index = 0; _index < DashboardChartProperty.colorrange.color.length; _index++) {
                DashboardChartProperty.colorrange.color[_index].code = DashboardChartProperty.colorrange.color[_index].code.split(",")[0];
            }
            //region 初始化颜色控件值显示
            $(".DshChartPartitionColorSty").each(function (ob) {
                var ThisIndex = $(this).data('field') - 1;

                if (DashboardChartProperty.colorrange.color[ThisIndex].code.indexOf("#") > -1) { } else {
                    DashboardChartProperty.colorrange.color[ThisIndex].code = "#" + DashboardChartProperty.colorrange.color[ThisIndex].code;
                }
                $(this).spectrum("set", DashboardChartProperty.colorrange.color[ThisIndex].code);
            });

            ThisProPerty.BasciObj = DashboardChartProperty;
            Me.Set("ProPerty", ThisProPerty);
            if (Me.Get("ThemeInfo")) {
                Me.Set("ThemeInfo", Me.Get("ThemeInfo"));
            }
            Me.BindChart();
            $("#txtupperlimit").val(DashboardChartProperty.chart.upperlimit);
            //            $("#bgColor").val(DashboardChartProperty.chart.bgcolor);
            setInputValid();
        }
    });
    var Entity = Me.Get("Entity");
    if (Entity[0] != null && Entity[0].Data != null && Entity[0].Data.length > 0) {
        //20130402 倪飘 解决bug，圆形仪表盘控件中拖入数据以后，高级属性基本设置中数据列自动选择数值类型列，但是无法正常显示
        $("#ColumnName").append("<option value='请选择值'>请选择值</option>");
        for (var cloumnName in Entity[0].Data[0]) {
            $("#ColumnName").append("<option value='" + cloumnName + "'>" + cloumnName + "</option>");
        }
        if (ThisProPerty.CloumnName != "") {
            $("#ColumnName").val(ThisProPerty.CloumnName);
        }
    }

    //region 20130321 14:36 新增属性设置
    $(".DashboardChart_color").spectrum({
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
                case "Colorrange":
                    if (DashboardChartProperty.colorrange.color != null && DashboardChartProperty.colorrange.color.length > 0) {
                        for (var i = 0; i < DashboardChartProperty.colorrange.color.length; i++) {
                            DashboardChartProperty.colorrange.color[i].code = color.toHexString();
                        }
                    }
                    break;
                case "MaxortmColor":
                    DashboardChartProperty.chart.majortmcolor = color.toHexString();
                    break;
                case "Minortmcolor":
                    DashboardChartProperty.chart.minortmcolor = color.toHexString();
                    break;
                case "FontColor":
                    DashboardChartProperty.chart.basefontcolor = color.toHexString();
                    break;
                case "TooltipsColor":
                    DashboardChartProperty.chart.tooltipbgcolor = color.toHexString();
                    break;

            }
            Me.BindChart();
        }
    }); //颜色设置，非背景色
    $("#DashboardChart_BgFillColor").unbind().bind("click", function () {
        var oThisSelColorPanel = this;
        $(oThisSelColorPanel).data('colorValue',Me.property.background);
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel, [2], true, function (color) {
            $(oThisSelColorPanel).css("background", color.value.background);
            oThisSelColorPanel = null;
            Agi.Controls.DashboardChartFillBgColorApplay(color, DashboardChartProperty); //颜色属性赋值

            Me.BindChart();
            Me.property.background = color;
        });
    }); //背景色

    //属性显示字体颜色，刻度颜色,tips颜色
    $("#DashboardChart_FontColor").spectrum("set", DashboardChartProperty.chart.basefontcolor);
    $("#DashboardChart_MaxortmColor").spectrum("set", DashboardChartProperty.chart.majortmcolor);
    $("#DashboardChart_Minortmcolor").spectrum("set", DashboardChartProperty.chart.minortmcolor);
    $("#DashboardChart_TooltipsColor").spectrum("set", DashboardChartProperty.chart.tooltipbgcolor);

    //属性显示景颜色
    var ThisFillBgcolorValue = {
        disableGradientIndex: [0, 1, 2, 3], //禁用除了放射之外的类型
        "type": 2,
        "direction": "radial",
        "stopMarker":
            [{
                "position": 0.01,
                "color": "rgb(255,255,255)",
                "ahex": "#ffffff"
            }, {
                "position": 0.99,
                "color": "rgb(0,0,0)",
                "ahex": "#000000"
            }],
        "value":
        {
            "background": "-webkit-radial-gradient(center, ellipse cover,rgb(255,255,255) 1%,rgb(0,0,0) 99%)"
        }
    };
    if(!Me.property.background){
        Me.property.background = ThisFillBgcolorValue;
    }
    //20130520 倪飘 解决bug，圆形仪表盘控件拖入实体，选择显示字段列，修改背景颜色为纯色，点击保存，返回整体页面，再次进入编辑环境，背景设置按钮无效按F12页面报错
    if (DashboardChartProperty.annotations.groups[0].items[0].fillcolor != null && DashboardChartProperty.annotations.groups[0].items[0].fillratio != null) {
        //        var aThisfillbgcolors = DashboardChartProperty.annotations.groups[0].items[0].fillcolor.split(",");
        //        var aThisfillbgcolorValues = DashboardChartProperty.annotations.groups[0].items[0].fillratio.split(",");

        var aThisfillbgcolors = [];
        var aThisfillbgcolorValues = [];
        if (DashboardChartProperty.annotations.groups[0].items[0].fillcolor.toString().indexOf(',') > -1) {
            aThisfillbgcolors = DashboardChartProperty.annotations.groups[0].items[0].fillcolor.split(",");
        } else {
            aThisfillbgcolors.push(DashboardChartProperty.annotations.groups[0].items[0].fillcolor);
        }
        if (DashboardChartProperty.annotations.groups[0].items[0].fillratio.toString().indexOf(',') > -1) {
            aThisfillbgcolorValues = DashboardChartProperty.annotations.groups[0].items[0].fillratio.split(",");
        } else {
            aThisfillbgcolorValues.push(DashboardChartProperty.annotations.groups[0].items[0].fillratio);
        }

        var aStopMarkers = [];
        var sBackgroundValueStr = "";
        if (aThisfillbgcolors != null && aThisfillbgcolors.length > 0) {
            for (var i = 0; i < aThisfillbgcolors.length; i++) {
                if (aThisfillbgcolors[i] != "") {
                    aStopMarkers.push({ "position": 0, "color": aThisfillbgcolors[i], "ahex": aThisfillbgcolors[i] });
                    if (i < aThisfillbgcolorValues.length && aThisfillbgcolorValues[i] != "") {
                        aStopMarkers[aStopMarkers.length - 1].position = parseInt(aThisfillbgcolorValues[i]) / 100;
                        sBackgroundValueStr = sBackgroundValueStr + aThisfillbgcolors[i] + " " + aThisfillbgcolorValues[i] + "%,";
                    } else {
                        aStopMarkers[aStopMarkers.length - 1].position = 1;
                        sBackgroundValueStr = sBackgroundValueStr + aThisfillbgcolors[i] + " 100%,";
                    }
                }
            }
            if (sBackgroundValueStr.length > 0) {
                if (aStopMarkers.length === 1) {
                    ThisFillBgcolorValue.stopMarker = aStopMarkers;
                    sBackgroundValueStr = sBackgroundValueStr.substring(0, sBackgroundValueStr.length - 1);
                    ThisFillBgcolorValue.value.background = sBackgroundValueStr;
                } else {
                    ThisFillBgcolorValue.stopMarker = aStopMarkers;
                    sBackgroundValueStr = sBackgroundValueStr.substring(0, sBackgroundValueStr.length - 1);
                    ThisFillBgcolorValue.value.background = "-webkit-radial-gradient(center, ellipse cover," + sBackgroundValueStr + ")";
                }
            }
        }
    }
    //Agi.Controls.ControlColorApply.fColorControlValueSet("DashboardChart_BgFillColor", ThisFillBgcolorValue, true); //背景设置初始化
    $("#DashboardChart_BgFillColor").css(ThisFillBgcolorValue.value).data('colorValue', ThisFillBgcolorValue);
    //endregion

}
//DashboardChart 背景匹配
Agi.Controls.DashboardChartFillBgColorApplay=function(_Color,_DashboardChartPro){
    if(_Color!=null){
        if(_Color.type==1){
            if(_Color.hex.indexOf("#")>-1){
                _DashboardChartPro.annotations.groups[0].items[0].fillcolor=_Color.hex;
            }else{
                _DashboardChartPro.annotations.groups[0].items[0].fillcolor="#"+_Color.hex;
            }
            _DashboardChartPro.annotations.groups[0].items[0].fillratio=100;
        }else if(_Color.type==2){
            if(_Color.stopMarker!=null && _Color.stopMarker.length>0){
                var afillcolorValues=[];
                var afillcolorNumbers=[];
                for(var i=0;i<_Color.stopMarker.length;i++){
                    if(_Color.stopMarker[i].ahex.indexOf("#")>-1){
                        afillcolorValues.push(_Color.stopMarker[i].ahex.substr(0,7));
                    }else{
                        afillcolorValues.push("#"+_Color.stopMarker[i].ahex.substr(0,6));
                    }
                    afillcolorNumbers.push(_Color.stopMarker[i].position*100);
                }
                _DashboardChartPro.annotations.groups[0].items[0].fillcolor=afillcolorValues.toString();
                _DashboardChartPro.annotations.groups[0].items[0].fillratio=afillcolorNumbers.toString();

                afillcolorValues=afillcolorNumbers=null;
            }
        }
    }
}