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
Agi.Controls.LEDChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
            console.log("拖拽点位至控件上");
            var Me = this;
            //20130121 倪飘 给圆形仪表盘，半圆仪表盘，温度计，LED控件添加dataset参数联动和共享数据源参数联动功能
            //        ProPerty.CloumnName = "";
            var entity = [];
            //20130516 倪飘 解决bug，仪表盘控件（圆形仪表盘，半圆仪表盘，温度计，数字指示器）不拖入任何数据保存页面，再次编辑页面时，控件为透明状态，但是预览页面是有控件显示的
            if (_EntityInfo != undefined) {
                //20130117 倪飘 集成共享数据源
                if (!_EntityInfo.IsShareEntity) {
                    //20130507 倪飘 修改bug，数字指示器控件拖入只有一个字段一条数据的dataset时，双击进入控件属性编辑页面，下方的表格中数据显示错误
                    //20130507 倪飘 修改bug，数字指示器控件拖入实体参数联动，保存页面再次进入数字指示器属性编辑页面是，下方显示无可用实体数据 但是页面还是可以联动

                    Agi.Utility.RequestData2(_EntityInfo, function (d) {
                        _EntityInfo.Data = d.Data;
                        _EntityInfo.Columns = d.Columns;
                        entity.push(_EntityInfo);
                        Me.chageEntity = true;
                        Me.Set("Entity", entity);
                        Me.AddEntity(entity[0]);
                        /*添加实体*/
                        //20130122 倪飘 解决控件库-LEDchart，不可以在设置页面拖入数据问题
                        if (Agi.Controls.IsControlEdit) {
                            Agi.Controls.ShowControlData(Me); //更新实体数据显示
                            //20130122 倪飘 更新实体数据之后更行高级属性面板
                            Agi.Controls.LEDChartProrityInit(Me);
                        }
                    });
                }
                else {
                    entity.push(_EntityInfo);
                    Me.chageEntity = true;
                    Me.Set("Entity", entity);
                    Me.AddEntity(entity[0]);
                    /*添加实体*/
                    //20130122 倪飘 解决控件库-LEDchart，不可以在设置页面拖入数据问题
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.ShowControlData(Me); //更新实体数据显示
                        //20130122 倪飘 更新实体数据之后更行高级属性面板
                        Agi.Controls.LEDChartProrityInit(Me);
                    }
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
            if (ThisProPerty.LedDefaultNum) {
                ThisProPerty.LedDefaultNum = null;
            }
            Me.Set("ProPerty", ThisProPerty);
            //如果在编辑界面，则更新LED右侧属性面板值显示
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.LEDChartProrityInit(Me);
            }

        },
        ReadRealData: function (MsgObj) {
            var Me = this;
            var ThisProPerty = Me.Get("ProPerty");
            var LEDChartProperty = ThisProPerty.BasciObj;
            if (!isNaN(MsgObj.Value)) {
                LEDChartProperty.ledNum = Agi.Script.StringTrim(MsgObj.Value.toString());
                Me.BindChart();
            }
        },
        BindChart: function () {
            var chart = null;
            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HTMLElement = Me.Get("HTMLElement");
            $(HTMLElement).find("canvas").remove();
            var BasciObj = MePrority.BasciObj;
            digitalClock({
                element: HTMLElement,
                iDigitWidth: BasciObj.iDigitWidth,
                iLineSize: BasciObj.iLineSize,
                iGap: BasciObj.iGap,
                sDigitColor: BasciObj.sDigitColor,
                ledNum: BasciObj.ledNum
            });
        },
        AddEntity: function (_entity) {
            if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
                var Me = this;
                var ProPerty = Me.Get("ProPerty");
                var LEDChartProPerty = ProPerty.BasciObj;
                for (var cloumnName in _entity.Data[0]) {
                    var _value = "";
                    if (ProPerty.CloumnName != "") {
                        _value = _entity.Data[0][ProPerty.CloumnName];
                    }
                    else {
                        _value = _entity.Data[0][cloumnName];
                        ProPerty.CloumnName = cloumnName;
                    }
                    if (!isNaN(_value)) {
                        LEDChartProPerty.ledNum = Agi.Script.StringTrim(_value.toString());
                        Me.BindChart();
                    }
                    break;
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
            if (!_EntityKey) {
                throw 'LEDChart.RemoveEntity Arg is null';
            }
            var self = this;
            var entitys = self.Get('Entity');
            var ProPerty = self.Get("ProPerty");
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
                ProPerty.CloumnName = "";
                self.Set('ProPerty', ProPerty);
                self.Set('Entity', entitys);
            }
            //删除数据后删掉共享数据源和控件的关系
            Agi.Msg.ShareDataRelation.DeleteItem(self.shell.BasicID);
            //20130122 倪飘 更新实体数据之后更行高级属性面板
            Agi.Controls.LEDChartProrityInit(self);
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
            Me.Set("ControlType", "LEDChart");
            var ID = "LEDChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty LEDChartPanelSty'></div>");
            HTMLElementPanel.css('padding-bottom', '0px');
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 300,
                height: 200,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:100%;margin: 0 auto">' + '</div>');
            this.shell.initialControl(BaseControlObj[0]);
            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(180);
                HTMLElementPanel.height(36);
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
                RealTimePoint: ""
            };
            ThisProPerty.BasciObj = {
                iDigitWidth: 20,
                iLineSize: 4,
                iGap: 2,
                sDigitColor: "#000000",
                ledNum: "34567",
                LedDefaultNum: null
            };
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

            //20130515 倪飘 解决bug，组态环境中拖入数字指示器控件以后拖入容器框控件，容器框控件会覆盖数字指示器控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        },
        CustomProPanelShow: function () {
            Agi.Controls.LEDChartProrityInit(this);
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
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewLEDChart = new Agi.Controls.LEDChart();
//                NewLEDChart.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewLEDChart;
//            }
//        },
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
                Agi.Controls.LEDChartProrityInit(Me);
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
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.LEDChartAttributeChange(this, Key, _Value);
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
            ConfigObj.append("<LEDChart>" + JSON.stringify(ProPerty.BasciObj) + "</LEDChart>"); */
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
            var LEDChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    LEDChart: null, //chart属性
                    CloumnName: null, //*数据列名称*//
                    RealTimePoint: null, //*实时点位号*//
                    Entity: null, //*控件实体*//
                    ControlBaseObj: null, //*控件基础对象*//
                    HTMLElement: null, /*控件外壳ID*/
                    Position: null //*控件位置信息*//
                }
            }
            LEDChartControl.Control.ControlType = Me.Get("ControlType");
            LEDChartControl.Control.ControlID = ProPerty.ID;
            LEDChartControl.Control.LEDChart = ProPerty.BasciObj;
            LEDChartControl.Control.CloumnName = ProPerty.CloumnName;
            LEDChartControl.Control.RealTimePoint = ProPerty.RealTimePoint;
            LEDChartControl.Control.LedNum = ProPerty.LedNum;
            LEDChartControl.Control.LedDefaultNum = ProPerty.LedDefaultNum;
            var Entity = Me.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
            //        $(Entity).each(function (i, e) {
            //            e.Data = null;
            //        });
            LEDChartControl.Control.Entity = Entity;

            LEDChartControl.Control.ControlBaseObj = ProPerty.ID;
            LEDChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
            LEDChartControl.Control.Position = Me.Get("Position");
            return LEDChartControl.Control;
        }, //获得BasicChart控件的配置信息
        CreateControl: function (_Config, _Target) {
            var Me = this;
            Me.AttributeList = [];
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    Me.Set("ControlType", "LEDChart")
                    var ID = _Config.ControlID;
                    var CloumnName = _Config.CloumnName;
                    var RealTimePoint = _Config.RealTimePoint;
                    var LEDChartProPerty = _Config.LEDChart;
                    var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty LEDChartPanelSty'></div>");
                    HTMLElementPanel.css('padding-bottom', '0px');
                    this.shell = new Agi.Controls.Shell({
                        ID: ID,
                        width: 300,
                        height: 200,
                        divPanel: HTMLElementPanel
                    });
                    var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:100%;margin: 0 auto">' + '</div>');
                    this.shell.initialControl(BaseControlObj[0]);
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
                        BasciObj: LEDChartProPerty,
                        CloumnName: CloumnName,
                        RealTimePoint: RealTimePoint,
                        LedNum: _Config.LedNum,
                        LedDefaultNum: _Config.LedDefaultNum
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
                    Me.Set("Entity", _Config.Entity);
                    var Entity = Me.Get("Entity");
                    if (Entity.length > 0) {
                        var EntityInfo = Entity[0];
                        //20130117 倪飘 集成共享数据源
                        if (!EntityInfo.IsShareEntity) {
                            Agi.Utility.RequestData2(EntityInfo, function (d) {
                                EntityInfo.Data = d.Data;
                                EntityInfo.Columns = d.Columns;
                                Me.AddEntity(EntityInfo);
                                /*添加实体*/
                            });
                        } else {
                            Me.AddEntity(EntityInfo);
                            /*添加实体*/
                        }
                        Me.BindChart();
                    }
                    else {
                        Me.BindChart();
                    }
                    Me.ReadOtherData(ThisProPerty.RealTimePoint);
                    obj = ThisProPerty = PagePars = PostionValue = null;
                }
            }
        },
        InEdit: function () {
        }, //编辑中
        ExtEdit: function () {

        } //退出编辑
    });
/*BasicChart参数更改处理方法*/
Agi.Controls.LEDChartAttributeChange = function (_ControlObj, Key, _Value) {
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
Agi.Controls.InitLEDChart = function () {
    return new Agi.Controls.LEDChart();
}
//BasicChart 自定义属性面板初始化显示
Agi.Controls.LEDChartProrityInit = function (_LEDChart) {
    var Me = _LEDChart;
    var ThisProPerty = Me.Get("ProPerty");
    var LEDChartProperty = ThisProPerty.BasciObj;
    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //属性配置
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
        '<table  class="prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">数据列：</td><td class="prortityPanelTabletd1"><select data-field="ColumnName" id="ColumnName"></select></td>' +
    //   '<td class="prortityPanelTabletd0">主题：</td><td  class="prortityPanelTabletd1"><select data-field="themeName" id="themeName"> <option value=""></option><option value="theme1">主题1</option><option value="theme2">主题2</option><option value="theme3">主题3</option></select> </td>' +
        '<td class="prortityPanelTabletd0"></td><td   class="prortityPanelTabletd1"><input type="button" value="保存" id="btnLEDChartSave"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">实时点位号：</td><td colspan="3" class="prortityPanelTabletd1"><input data-field="RealTimePoint" id="RealTimePoint" type="text" value="" class="ControlProTextSty" maxlength="20" ischeck="false"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">默认值：</td><td colspan="3" class="prortityPanelTabletd1"><input data-field="ledNum" id="ledNum" type="text" value="" class="ControlProTextSty" maxlength="10" ischeck="false"/></td>' +
        '</tr>' +
        '<tr>' +
        '<td  class="prortityPanelTabletd0">字体颜色</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="sDigitColor" id="sDigitColor"/></td>' +
        '<td class="prortityPanelTabletd0">字体大小：</td><td  class="prortityPanelTabletd1"><input data-field="iDigitWidth" id="iDigitWidth" type ="number" value ="20" min="10" max = "100"  class="ControlProNumberSty" defaultvalue="20"/> </td>' +
        '</tr>' +
    //    '<tr>' +
    //    '<td class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"></td>' +
    //   '<td class="prortityPanelTabletd0">最大值：</td><td  class="prortityPanelTabletd1"><input data-field="maxValue1" id="maxValue1" type="text" value=""/></td>' +
    //    '</tr>' +
    //    '<tr>' +
    //    '<td  class="prortityPanelTabletd0">二区</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="Color2" id="Color2"/> </td>' +
    //      '<td class="prortityPanelTabletd0">最小值：</td><td  class="prortityPanelTabletd1"><input data-field="minValue2" id="minValue2" type="text" value=""/></td>' +
    //    '</tr>' +
    //     '<tr>' +
    //     '<td class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"></td>' +
    //   '<td class="prortityPanelTabletd0">最大值：</td><td class="prortityPanelTabletd1"><input data-field="maxValue2" id="maxValue2" type="text" value=""/></td>' +
    //    '</tr>' +
    //    '<tr>' +
    //    '<td  class="prortityPanelTabletd0">三区</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="Color3" id="Color3"/></td>' +
    //      '<td class="prortityPanelTabletd0">最小值：</td><td  class="prortityPanelTabletd1"><input data-field="minValue3" id="minValue3" type="text" value=""/></td>' +
    //    '</tr>' +
    //     '<tr>' +
    //     '<td class="prortityPanelTabletd0"></td><td  class="prortityPanelTabletd1"></td>' +
    //   '<td class="prortityPanelTabletd0">最大值：</td><td class="prortityPanelTabletd1"><input data-field="maxValue3" id="maxValue3" type="text" value=""/></td>' +
    //    '</tr>' +
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
    $("#RealTimePoint").val(ThisProPerty.RealTimePoint);
    //20130401 倪飘 解决bug，数字指示器控件高级属性中字体颜色无法更改（报错）
    if (LEDChartProperty.LedDefaultNum != null && LEDChartProperty.LedDefaultNum != "") {
        LEDChartProperty.ledNum = LEDChartProperty.LedDefaultNum;
    }
    $("#ledNum").val(LEDChartProperty.ledNum);
    $("#iDigitWidth").val(LEDChartProperty.iDigitWidth);
    $("#sDigitColor").val(LEDChartProperty.sDigitColor);
    //    $("#minValue2").val(LEDChartProperty.colorrange.color[1].minvalue);
    //    $("#minValue3").val(LEDChartProperty.colorrange.color[2].minvalue);
    //    $("#maxValue1").val(LEDChartProperty.colorrange.color[0].maxvalue);
    //    $("#maxValue2").val(LEDChartProperty.colorrange.color[1].maxvalue);
    //    $("#maxValue3").val(LEDChartProperty.colorrange.color[2].maxvalue);
    //    $("#Color1").val(LEDChartProperty.colorrange.color[0].code);
    //    $("#Color2").val(LEDChartProperty.colorrange.color[1].code);
    //    $("#Color3").val(LEDChartProperty.colorrange.color[2].code);
    $('.BasicColor').spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['#272727', '#000079'],
            ['#FF2D2D', '#0072E3'],
            ['#FFF7FF', '#613030'],
            ['#616130', '#D200D2'],
            ['#006000', '#6F00D2']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function (color) {
            var pName = $(this).data('field');
            switch (pName) {
                case 'sDigitColor':
                    LEDChartProperty.sDigitColor = color.toHexString();
                    break;
            }
            //20121228 15:00 倪飘 修改LED控件属性实时应用问题
            $("#btnLEDChartSave").click();
        }
    });
    $('.prortityPanelTabletd1>input').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "ledNum":
                var ledNum = $(this).val();
                if (isNaN(ledNum)) {
                    AgiCommonDialogBox.Alert("请输入数字！");
                    ledNum = "34567";
                    $(this).val("34567");
                } else {
                    //                    LEDChartProperty.ledNum = Agi.Script.StringTrim($('#ledNum').val());
                }
                break;
            case "iDigitWidth":
                //20130130 倪飘 修改LED高级属性字体大小限制问题
                var iDigitWidth = parseInt($(this).val());
                if (iDigitWidth > 100) {
                    AgiCommonDialogBox.Alert("请输入10-100范围内的值！");
                    iDigitWidth = 100;
                    $(this).val(100);
                    //                    LEDChartProperty.iDigitWidth = iDigitWidth;
                    //                    LEDChartProperty.iLineSize = iDigitWidth / 5;
                } else if (iDigitWidth < 10) {
                    AgiCommonDialogBox.Alert("请输入10-100范围内的值！");
                    iDigitWidth = 10;
                    $(this).val(10);
                    //                    LEDChartProperty.iDigitWidth = iDigitWidth;
                    //                    LEDChartProperty.iLineSize = iDigitWidth / 5;
                } else if (iDigitWidth >= 10 && iDigitWidth <= 100) {
                    //                    LEDChartProperty.iDigitWidth = iDigitWidth;
                    //                    LEDChartProperty.iLineSize = iDigitWidth / 5;
                } else {
                    AgiCommonDialogBox.Alert("请输入10-100范围内的值！");
                    //                    iDigitWidth = LEDChartProperty.iDigitWidth;
                    $(this).val(LEDChartProperty.iDigitWidth);
                    //                    LEDChartProperty.iLineSize = iDigitWidth / 5;
                }


                break;   //add by lj 2012-12-29  添加一个break  
            case "RealTimePoint":
                ThisProPerty.RealTimePoint = $(this).val();
                PointEditState = true;
                break;
        }
        //20121228 15:00 倪飘 修改LED控件属性实时应用问题
        //        if (pName != "sDigitColor") {    //add by lj 2012-12-29 修复选中颜色值，颜色控件没有及时显示对应的颜色问题
        //            $("#btnLEDChartSave").click();
        //        }
    });
    $("#btnLEDChartSave").unbind().bind("click", function () {
        if (PointEditState) {
            Me.ReadOtherData(ThisProPerty.RealTimePoint);
            PointEditState = !PointEditState;
        }
        //保存属性
        ThisProPerty.CloumnName = $("#ColumnName").val();
        var ledNum = Agi.Script.StringTrim($('#ledNum').val());
        if (ledNum === "") {
            ledNum = Entity[0].Data[0][ThisProPerty.CloumnName];
            $('#ledNum').val(ledNum);
        }
        var strLEDDefaultNumber = Agi.Script.StringTrim($('#ledNum').val());
        if (strLEDDefaultNumber != "") {
            LEDChartProperty.LedDefaultNum = strLEDDefaultNumber;
            LEDChartProperty.ledNum = LEDChartProperty.LedDefaultNum;
        } else {
            LEDChartProperty.LedDefaultNum = null;
            LEDChartProperty.ledNum = "";
            var LEDColumnName = $("#ColumnName").val();
            if (LEDColumnName != null && LEDColumnName != "") {
                var LEDColumnValue = Entity[0].Data[0][LEDColumnName];
                if (!isNaN(LEDColumnValue)) {
                    LEDChartProperty.ledNum = LEDColumnValue.toString();
                }
            }
        }

        var iDigitWidth = parseInt($('#iDigitWidth').val());
        LEDChartProperty.iDigitWidth = iDigitWidth;
        LEDChartProperty.iLineSize = iDigitWidth / 5;

        ThisProPerty.BasciObj = LEDChartProperty;
        Me.Set("ProPerty", ThisProPerty);
        Me.BindChart();
    });

    $("#ColumnName").change(function () {
        var Entity = Me.Get("Entity");
        LEDColumnName = $(this).val();
        //        ThisProPerty.CloumnName = LEDColumnName;
        //20130424 倪飘 解决bug，数字指示器拖入实体修改显示字段列返回整体页面后再进去属性编辑页面，字段列还原
        var ledNum = Entity[0].Data[0][LEDColumnName];
        $('#ledNum').val(Entity[0].Data[0][LEDColumnName]);
        if (!isNaN(ledNum)) {
            if (LEDChartProperty.LedDefaultNum != null && LEDChartProperty.LedDefaultNum != "") {
            } else {
                LEDChartProperty.ledNum = Agi.Script.StringTrim(ledNum.toString());
            }
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