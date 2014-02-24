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
Agi.Controls.HeatMapChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
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
             if(_EntityInfo!=undefined){
              //20130529 倪飘 解决bug，热图控件拖入共享数据源后，再拖入普通的dataset，保存页面，预览页面显示的是普通dataset的数据，但是编辑页面中显示的是共享数据源的数据
                   if (Me.ReadTimes === undefined) {
                    //20130117 倪飘 集成共享数据源
                        if (!_EntityInfo.IsShareEntity) {
                        //20130508 倪飘 解决bug，热图控件拖入共享数据源后，再拖入普通的dataset，保存页面，预览页面显示的是普通dataset的数据，但是编辑页面中显示的是共享数据源的数据
                            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                                _EntityInfo.Data = d.Data;
                                 _EntityInfo.Columns = d.Columns;
                                entity.push(_EntityInfo);
                                Me.chageEntity = true;
                                Me.Set("Entity", entity);
                                //                    Me.AddEntity(entity[0]);
                                var ProPerty= Me.Get("ProPerty");
                                //20130508 倪飘 解决bug，2个热图控件，拖入同一个dataset，修改数据设置，保存页面，再次编辑页面时，双击进入属性编辑页面，下方显示无可用实体数据
                                if (Agi.Edit && !Me.IsInitDataOrShare) {
                                 ProPerty.LeftDataColumn ="";
                                ProPerty.CenterDataColumn="";
                                ProPerty.BottomDataColumn="";
                                ProPerty.ShowColumnNum="";
                                ProPerty.ShowLevelCount="3";
                                ProPerty.BasciObj.dataset[0].data=[];
                                Me.BindChart();
                                }
                                Me.IsInitDataOrShare=false;
                                Me.Set("ProPerty", Me.Get("ProPerty"));
                    
                               if (Agi.Controls.IsControlEdit) {
                                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                                    Agi.Controls.HeatMapChartProrityInit(Me);//更新属性面板
                                }
                            });
                        }
                        else {
                            var Entitys=Me.Get("Entity");
                             var ProPerty= Me.Get("ProPerty");
                             //解决共享数据源第一次拖上去不显示问题
                             if(Entitys.length>0){
                            if(Entitys[0].Key!=_EntityInfo.Key){
                                if (Agi.Edit && !Me.IsInitDataOrShare) {
                                 ProPerty.LeftDataColumn ="";
                                ProPerty.CenterDataColumn="";
                                ProPerty.BottomDataColumn="";
                                ProPerty.ShowColumnNum="";
                                 ProPerty.ShowLevelCount="3";
                                 ProPerty.BasciObj.dataset[0].data=[];
                                Me.BindChart();
                                }
                                Me.IsInitDataOrShare=false;
                            }
                            }
                            entity.push(_EntityInfo);
                            Me.chageEntity = true;
                            Me.Set("Entity", entity);
                            Me.Set("ProPerty", Me.Get("ProPerty"));
                            if (Agi.Controls.IsControlEdit) {
                                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                                    Agi.Controls.HeatMapChartProrityInit(Me);//更新属性面板
                                }
                        }
                    }else {
                    Me.ReadTimes = undefined
                }
            }
        },
        BindChart: function () {
            var chart = null;
            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HTMLElement = Me.Get("HTMLElement")
            var HeatMapChartJson = MePrority.BasciObj;
            var HeatMapChartId =MePrority.ID;
            if (FusionCharts("_" + HeatMapChartId)) {
                FusionCharts("_" + HeatMapChartId).dispose();
            }
            FusionCharts.setCurrentRenderer('javascript');
            chart = new FusionCharts("JS/Controls/HeatMapChart/image/HeatMap.swf", "_" + HeatMapChartId, "100%", "100%", "0");
            chart.setTransparent(true);
            chart.setJSONData(HeatMapChartJson);
            chart.render(HTMLElement);
        },
        RemoveEntity: function (_EntityKey) {
            //20130121 倪飘 解决控件库-半圆仪表盘、圆形仪表盘、温度计-属性中的实体数据无法关闭删除问题
            if (!_EntityKey) {
                throw 'DataGrid.RemoveEntity Arg is null';
            }
            var self = this;
            var ProPerty = self.Get("ProPerty");
            var HeatMapChartProPerty = ProPerty.BasciObj;
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
                ProPerty.LeftDataColumn ="";
                ProPerty.CenterDataColumn="";
                ProPerty.BottomDataColumn="";
                ProPerty.ShowColumnNum="";
                 ProPerty.ShowLevelCount="3";
                HeatMapChartProPerty.dataset[0].data=[];
                self.BindChart();
            }
            //删除数据后删掉共享数据源和控件的关系
            Agi.Msg.ShareDataRelation.DeleteItem(ProPerty.ID);
            //20130122 倪飘 删除实体数据之后更行高级属性面板
            Agi.Controls.HeatMapChartProrityInit(self);
        }, //移除实体Entity
        ParameterChange: function (_ParameterInfo) {
            var Me = this;
            var entity = Me.Get("Entity");
            Agi.Utility.RequestData(entity[0], function (d) {
                entity[0].Data = d;
                 Me.Set("Entity", entity);
                   Me.Set("ProPerty", Me.Get("ProPerty"));
                /*添加实体*/
            });

        }, //参数联动
        Init: function (_Target, _ShowPosition,savedId) {
            var Me = this;
            Me.IsInitDataOrShare=false;
            Me.ReadTimes = undefined;
            this.AttributeList = [];
            Me.Set("Entity", []);
            Me.Set("ControlType", "HeatMapChart");
            var ID = savedId ? savedId : "HeatMapChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                //                width: 200,
                //                height: 50,
                divPanel: HTMLElementPanel
                //                enableFrame:true
            });
            var BaseControlObj = $("<div id='" + ID + "' style='width:100%;height:100%'></div>");
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement", this.shell.Container[0]);

            var HeatMapChartBasciObj = {
                "chart": {
                    "caption": "Weekly Performance",
                    "subcaption": "In percentage",
                    "yaxisname": "Companies",
                    "xaxisname": "Week Days",
                    "showborder": "0",
                    "bgalpha": "0",//透明
                    //                    "bgcolor": "CACBEE"
//                     "clickURL": "JavaScript:alert('123');"
                },
                "dataset": [
                        {
            "data": [
                {
                    "rowid": "Google",
                    "columnid": "Mon",
                    "value": "68"
                },
                {
                    "rowid": "Google",
                    "columnid": "Tue",
                    "value": "35"
                },
                {
                    "rowid": "Google",
                    "columnid": "Wed",
                    "value": "95"
                },
                {
                    "rowid": "Google",
                    "columnid": "Thu",
                    "value": "17"
                },
                {
                    "rowid": "Google",
                    "columnid": "Fri",
                    "value": "55.98"
                },
                {
                    "rowid": "Yahoo",
                    "columnid": "Mon",
                    "value": "0"
                },
                {
                    "rowid": "Yahoo",
                    "columnid": "Tue",
                    "value": "71"
                },
                {
                    "rowid": "Yahoo",
                    "columnid": "Wed",
                    "value": "40"
                },
                {
                    "rowid": "Yahoo",
                    "columnid": "Thu",
                    "value": "63"
                },
                {
                    "rowid": "Yahoo",
                    "columnid": "Fri",
                    "value": "29"
                },
                {
                    "rowid": "Microsoft",
                    "columnid": "Mon",
                    "value": "98"
                },
                {
                    "rowid": "Microsoft",
                    "columnid": "Tue",
                    "value": "48"
                },
                {
                    "rowid": "Microsoft",
                    "columnid": "Wed",
                    "value": "31"
                },
                {
                    "rowid": "Microsoft",
                    "columnid": "Thu",
                    "value": "79"
                },
                {
                    "rowid": "Microsoft",
                    "columnid": "Fri",
                    "value": "39"
                }
            ]
        }
                 ],
                "colorrange": {
                    "gradient": "0",
                    "minvalue": "0",
                    "code": "F1C4EE",
                    "startlabel": "Very Bad",
                    "endlabel": "Very Good",
                    "color": [
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ]
                }
            };
            //20130508 倪飘 解决bug，热图，标示颜色与文本设置，当选择标示为10个时，范围4~10的默认颜色都为白色，建议默认为不同颜色，减少用户操作
            var ThisProPerty = {
                ID: ID,
                BasciObj: HeatMapChartBasciObj,
                LeftDataColumn:"",
                CenterDataColumn:"",
                BottomDataColumn:"",
                BadLevelColor: "FFEBE8",
                AverageLevelColor: "C6C0FF",
                GoodLevelColor: "C5A2EB",
                FourLevelColor:"aaff56",
                FiveLevelColor:"56ffff",
                SixLevelColor:"56aaff",
                SevenLevelColor:"aa56ff",
                EightLevelColor:"ff56ff",
                NineLevelColor:"ff007f",
                TenLevelColor:"ffd4aa",
                BadLevelText: "Text1",
                AverageLevelText: "Text2",
                GoodLevelText: "Text3",
                FourLevelText:"Text4",
                FiveLevelText:"Text5",
                SixLevelText:"Text6",
                SevenLevelText:"Text7",
                EightLevelText:"Text8",
                NineLevelText:"Text9",
                TenLevelText:"Text10",
                Title: "Weekly Performance",
                SecondTitle: "In percentage",
                YTitle: "Companies",
                XTitle: "Week Days",
                ShowColumnNum:"",
                ShowLevelCount:"3",
                IsInit:true
            };

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

            if (_Target != null) {
                this.Render(_Target);
            }
            var StartPoint = { X: 0, Y: 0 }
           
            /*事件绑定*/
            HTMLElementPanel.mousedown(function (ev) {
                if (Agi.Edit) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

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
            } 
            Me.Set("ProPerty", ThisProPerty);
            Me.Set("Position", PostionValue);
            obj = ThisProPerty = PagePars = PostionValue = null;
            Agi.Msg.PageOutPramats.AddPramats({
                'Type': Agi.Msg.Enum.Controls,
                'Key': ID,
                 'ChangeValue': [{ 'Name': 'YValue', 'Value': 0}, { 'Name': 'XValue', 'Value': 0}, { 'Name': 'CenterValue', 'Value': 0}]
            });
            Me.BindChart();
            //20130515 倪飘 解决bug，组态环境中拖入热图以后拖入容器框控件，容器框控件会覆盖热图控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        },
        CustomProPanelShow: function () {
            Agi.Controls.HeatMapChartProrityInit(this);
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
//        //20130524 倪飘 解决bug，热图控件不能被复制，粘贴
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewHeatMapChart = new Agi.Controls.HeatMapChart();
//                NewHeatMapChart.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewHeatMapChart;
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
                Agi.Controls.HeatMapChartProrityInit(Me);
            }
        }, //外壳大小更改
        Refresh: function () {
            var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
            var ParentObj = ThisHTMLElement.parent();
//            if(!ParentObj.length){
//                return;
//            }
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
            Agi.Controls.HeatMapChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var Me = this;
            var ProPerty=Me.Get("ProPerty");
            var HeatMapChartControl = {
                Control: {
                    ControlType: null, //*控件类型*//
                    ProPerty: null, //*控件属性*//
                    Entity: null, //*控件实体*//
                    HTMLElement: null, //*控件外壳ID*//
                    Position: null, /*控件位置信息*/
                    ThemeInfo: null,//主题名
                    ZIndex:null
                }
            }
            HeatMapChartControl.Control.ControlType = Me.Get("ControlType");
            HeatMapChartControl.Control.ProPerty =Me.Get("ProPerty");
            HeatMapChartControl.Control.Entity = Me.Get("Entity");
            HeatMapChartControl.Control.HTMLElement =ProPerty.ID;
            HeatMapChartControl.Control.Position = Me.Get("Position");
            HeatMapChartControl.Control.ThemeInfo = Me.Get("ThemeInfo");
            return HeatMapChartControl.Control;
        }, //获得BasicChart控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

//                    $("#" + ProPerty.ID).css("z-index", _Config.ZIndex);

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

                    ProPerty = _Config.ProPerty;
                    this.Set("ProPerty", ProPerty);
                    this.IsInitDataOrShare=true;
                    _Config.Entity = _Config.Entity;
                    this.ReadData(_Config.Entity[0]);
                    //20130529 倪飘 解决bug，热图控件拖入共享数据源后，再拖入普通的dataset，保存页面，预览页面显示的是普通dataset的数据，但是编辑页面中显示的是共享数据源的数据
                    this.ReadTimes = 1;
                }
            }
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
             //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);
            //1.保存主题名称
            Me.Set("ThemeInfo", _themeName);
            //2.绑定样式
             //3.应用当前控件的Options信息
            Agi.Controls.HeatMapChart.OptionsAppSty(ChartStyleValue, Me);
        } //更改控件样式
    });

        /*应用样式，将样式应用到控件的相关参数以更新相关显示
    * _StyConfig:样式配置信息
    * _DatePicker:当前控件对象
    * */
    Agi.Controls.HeatMapChart.OptionsAppSty = function (_StyConfig, _HeatMapChart) {
        if (_StyConfig != null) {
            var Me=_HeatMapChart;
            var ProPerty=Me.Get('ProPerty');
            var Entity=Me.Get('Entity');
            var HeatMapChartBasciObj=ProPerty.BasciObj;


        HeatMapChartBasciObj.colorrange.color[0].code=_StyConfig.BadColor;
        ProPerty.BadLevelColor=_StyConfig.BadColor;
        HeatMapChartBasciObj.colorrange.color[1].code=_StyConfig.AverangeColor;
        ProPerty.AverageLevelColor=_StyConfig.AverangeColor;
        HeatMapChartBasciObj.colorrange.color[2].code=_StyConfig.GoodColor;
        ProPerty.GoodLevelColor=_StyConfig.GoodColor;

        Me.BindChart();


        }
    }

/*BasicChart参数更改处理方法*/
Agi.Controls.HeatMapChartAttributeChange = function (_ControlObj, Key, _Value) {
    var Me = _ControlObj;
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
            ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
            /*Chart 更改大小*/
            ThisControlObj.Refresh();
            /*Chart 更改大小*/
            PagePars = null;
        }
    }
    if (Key == "ProPerty") {
        var ProPerty=Me.Get('ProPerty');
        var Entity=Me.Get('Entity');
        var HeatMapChartBasciObj=ProPerty.BasciObj;
        
            //绑定数据
        var DataSet=[];
        if(ProPerty.LeftDataColumn !="" && ProPerty.CenterDataColumn!="" && ProPerty.BottomDataColumn!=""){
            for(var i=0;i<Entity[0].Data.length;i++){
                if(i<ProPerty.ShowColumnNum){
                    var DataList=Entity[0].Data[i][ProPerty.LeftDataColumn]+","+Entity[0].Data[i][ProPerty.BottomDataColumn]+","+Entity[0].Data[i][ProPerty.CenterDataColumn];
                    DataSet.push({
                    rowid:Entity[0].Data[i][ProPerty.LeftDataColumn],
                    columnid:Entity[0].Data[i][ProPerty.BottomDataColumn],
                    value:Entity[0].Data[i][ProPerty.CenterDataColumn],
                    link:'j-HeatMapChartParamChange-'+DataList+","+Me.shell.ID
                    });
                }
            }
        }
//        value='"+StringUtil.checkNull(project.getClosed_cnt(),"0")+"' link='j-myJS-"+project.getShip_no()+"' 
        if(!ProPerty.IsInit && Entity.length){
        HeatMapChartBasciObj.dataset[0].data=DataSet;
        }
        ProPerty.IsInit=false;

        //绑定标题
        HeatMapChartBasciObj.chart.caption=ProPerty.Title;
        HeatMapChartBasciObj.chart.subcaption=ProPerty.SecondTitle;
        HeatMapChartBasciObj.chart.yaxisname=ProPerty.YTitle;
        HeatMapChartBasciObj.chart.xaxisname=ProPerty.XTitle;

        var colorrangecolor=[];
        //热图属性面板中添加范围可设置功能
        //20130510 倪飘 解决bug，热图控件中拖入数据并绑定数据列，控件中部分数据会出现空白
        if(ProPerty.ShowLevelCount==="3"){
        colorrangecolor=[
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
        //绑定标示
        if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
            var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/3));
                var AverageValue=parseInt(GoodValue*(2/3));
                colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";
        }
        else if(ProPerty.ShowLevelCount==="4"){
         colorrangecolor=[
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
              if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
            var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/4));
                var AverageValue=parseInt(GoodValue*(2/4));
                var ThreeValue=parseInt(GoodValue*(3/4));
                 colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[3].minvalue=BadMinValue+ThreeValue;
                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=BadMinValue+ThreeValue;
                 colorrangecolor[3].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";

          colorrangecolor[3].code=ProPerty.FourLevelColor;
        colorrangecolor[3].label=ProPerty.FourLevelText+"("+colorrangecolor[3].minvalue+"~"+colorrangecolor[3].maxvalue+")";
        
        }
        else if(ProPerty.ShowLevelCount==="5"){
          colorrangecolor=[
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
             if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
            var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/5));
                var AverageValue=parseInt(GoodValue*(2/5));
                var ThreeValue=parseInt(GoodValue*(3/5));
                 var FourValue=parseInt(GoodValue*(4/5));
                  colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[3].minvalue=BadMinValue+ThreeValue;
                 colorrangecolor[4].minvalue=BadMinValue+FourValue;
                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=BadMinValue+ThreeValue;
                 colorrangecolor[3].maxvalue=BadMinValue+FourValue;
                 colorrangecolor[4].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";

        colorrangecolor[3].code=ProPerty.FourLevelColor;
        colorrangecolor[3].label=ProPerty.FourLevelText+"("+colorrangecolor[3].minvalue+"~"+colorrangecolor[3].maxvalue+")";
         
        colorrangecolor[4].code=ProPerty.FiveLevelColor;
        colorrangecolor[4].label=ProPerty.FiveLevelText+"("+colorrangecolor[4].minvalue+"~"+colorrangecolor[4].maxvalue+")";
        
        }
        else if(ProPerty.ShowLevelCount==="6"){
          colorrangecolor=
          [
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
             if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
            var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/6));
                var AverageValue=parseInt(GoodValue*(2/6));
                var ThreeValue=parseInt(GoodValue*(3/6));
                 var FourValue=parseInt(GoodValue*(4/6));
                  var FiveValue=parseInt(GoodValue*(5/6));
                  colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[3].minvalue=BadMinValue+ThreeValue;
                  colorrangecolor[4].minvalue=BadMinValue+FourValue;
                 colorrangecolor[5].minvalue=BadMinValue+FiveValue;
                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=BadMinValue+ThreeValue;
                 colorrangecolor[3].maxvalue=BadMinValue+FourValue;
                  colorrangecolor[4].maxvalue=BadMinValue+FiveValue;
                 colorrangecolor[5].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";

        colorrangecolor[3].code=ProPerty.FourLevelColor;
        colorrangecolor[3].label=ProPerty.FourLevelText+"("+colorrangecolor[3].minvalue+"~"+colorrangecolor[3].maxvalue+")";
         
        colorrangecolor[4].code=ProPerty.FiveLevelColor;
        colorrangecolor[4].label=ProPerty.FiveLevelText+"("+colorrangecolor[4].minvalue+"~"+colorrangecolor[4].maxvalue+")";

         colorrangecolor[5].code=ProPerty.SixLevelColor;
        colorrangecolor[5].label=ProPerty.SixLevelText+"("+colorrangecolor[5].minvalue+"~"+colorrangecolor[5].maxvalue+")";

        }
         else if(ProPerty.ShowLevelCount==="7"){
          colorrangecolor=
          [
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
             if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
             var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/7));
                var AverageValue=parseInt(GoodValue*(2/7));
                var ThreeValue=parseInt(GoodValue*(3/7));
                 var FourValue=parseInt(GoodValue*(4/7));
                  var FiveValue=parseInt(GoodValue*(5/7));
                  var SixValue=parseInt(GoodValue*(6/7));
                  colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[3].minvalue=BadMinValue+ThreeValue;
                  colorrangecolor[4].minvalue=BadMinValue+FourValue;
                  colorrangecolor[5].minvalue=BadMinValue+FiveValue;
                 colorrangecolor[6].minvalue=BadMinValue+SixValue;

                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=BadMinValue+ThreeValue;
                 colorrangecolor[3].maxvalue=BadMinValue+FourValue;
                  colorrangecolor[4].maxvalue=BadMinValue+FiveValue;
                  colorrangecolor[5].maxvalue=BadMinValue+SixValue;
                 colorrangecolor[6].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";

        colorrangecolor[3].code=ProPerty.FourLevelColor;
        colorrangecolor[3].label=ProPerty.FourLevelText+"("+colorrangecolor[3].minvalue+"~"+colorrangecolor[3].maxvalue+")";
         
        colorrangecolor[4].code=ProPerty.FiveLevelColor;
        colorrangecolor[4].label=ProPerty.FiveLevelText+"("+colorrangecolor[4].minvalue+"~"+colorrangecolor[4].maxvalue+")";

         colorrangecolor[5].code=ProPerty.SixLevelColor;
        colorrangecolor[5].label=ProPerty.SixLevelText+"("+colorrangecolor[5].minvalue+"~"+colorrangecolor[5].maxvalue+")";

        colorrangecolor[6].code=ProPerty.SevenLevelColor;
        colorrangecolor[6].label=ProPerty.SevenLevelText+"("+colorrangecolor[6].minvalue+"~"+colorrangecolor[6].maxvalue+")";

        }
        else if(ProPerty.ShowLevelCount==="8"){
          colorrangecolor=
          [
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
             if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
            var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/8));
                var AverageValue=parseInt(GoodValue*(2/8));
                var ThreeValue=parseInt(GoodValue*(3/8));
                 var FourValue=parseInt(GoodValue*(4/8));
                  var FiveValue=parseInt(GoodValue*(5/8));
                  var SixValue=parseInt(GoodValue*(6/8));
                  var SevenValue=parseInt(GoodValue*(7/8));
                  colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[3].minvalue=BadMinValue+ThreeValue;
                  colorrangecolor[4].minvalue=BadMinValue+FourValue;
                  colorrangecolor[5].minvalue=BadMinValue+FiveValue;
                   colorrangecolor[6].minvalue=BadMinValue+SixValue;
                 colorrangecolor[7].minvalue=BadMinValue+SevenValue;

                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=BadMinValue+ThreeValue;
                 colorrangecolor[3].maxvalue=BadMinValue+FourValue;
                  colorrangecolor[4].maxvalue=BadMinValue+FiveValue;
                  colorrangecolor[5].maxvalue=BadMinValue+SixValue;
                   colorrangecolor[6].maxvalue=BadMinValue+SevenValue;
                 colorrangecolor[7].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";

        colorrangecolor[3].code=ProPerty.FourLevelColor;
        colorrangecolor[3].label=ProPerty.FourLevelText+"("+colorrangecolor[3].minvalue+"~"+colorrangecolor[3].maxvalue+")";
         
        colorrangecolor[4].code=ProPerty.FiveLevelColor;
        colorrangecolor[4].label=ProPerty.FiveLevelText+"("+colorrangecolor[4].minvalue+"~"+colorrangecolor[4].maxvalue+")";

          colorrangecolor[5].code=ProPerty.SixLevelColor;
        colorrangecolor[5].label=ProPerty.SixLevelText+"("+colorrangecolor[5].minvalue+"~"+colorrangecolor[5].maxvalue+")";

        colorrangecolor[6].code=ProPerty.SevenLevelColor;
        colorrangecolor[6].label=ProPerty.SevenLevelText+"("+colorrangecolor[6].minvalue+"~"+colorrangecolor[6].maxvalue+")";

         colorrangecolor[7].code=ProPerty.EightLevelColor;
        colorrangecolor[7].label=ProPerty.EightLevelText+"("+colorrangecolor[7].minvalue+"~"+colorrangecolor[7].maxvalue+")";

        }
        else if(ProPerty.ShowLevelCount==="9"){
          colorrangecolor=
          [
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
             if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
             var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/9));
                var AverageValue=parseInt(GoodValue*(2/9));
                var ThreeValue=parseInt(GoodValue*(3/9));
                 var FourValue=parseInt(GoodValue*(4/9));
                  var FiveValue=parseInt(GoodValue*(5/9));
                  var SixValue=parseInt(GoodValue*(6/9));
                  var SevenValue=parseInt(GoodValue*(7/9));
                  var EightValue=parseInt(GoodValue*(8/9));
                   colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[3].minvalue=BadMinValue+ThreeValue;
                  colorrangecolor[4].minvalue=BadMinValue+FourValue;
                  colorrangecolor[5].minvalue=BadMinValue+FiveValue;
                   colorrangecolor[6].minvalue=BadMinValue+SixValue;
                 colorrangecolor[7].minvalue=BadMinValue+SevenValue;
                 colorrangecolor[8].minvalue=BadMinValue+EightValue;

                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=BadMinValue+ThreeValue;
                 colorrangecolor[3].maxvalue=BadMinValue+FourValue;
                  colorrangecolor[4].maxvalue=BadMinValue+FiveValue;
                  colorrangecolor[5].maxvalue=BadMinValue+SixValue;
                   colorrangecolor[6].maxvalue=BadMinValue+SevenValue;
                 colorrangecolor[7].maxvalue=BadMinValue+EightValue;
                 colorrangecolor[8].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";

        colorrangecolor[3].code=ProPerty.FourLevelColor;
        colorrangecolor[3].label=ProPerty.FourLevelText+"("+colorrangecolor[3].minvalue+"~"+colorrangecolor[3].maxvalue+")";
         
        colorrangecolor[4].code=ProPerty.FiveLevelColor;
        colorrangecolor[4].label=ProPerty.FiveLevelText+"("+colorrangecolor[4].minvalue+"~"+colorrangecolor[4].maxvalue+")";

        colorrangecolor[5].code=ProPerty.SixLevelColor;
        colorrangecolor[5].label=ProPerty.SixLevelText+"("+colorrangecolor[5].minvalue+"~"+colorrangecolor[5].maxvalue+")";

        colorrangecolor[6].code=ProPerty.SevenLevelColor;
        colorrangecolor[6].label=ProPerty.SevenLevelText+"("+colorrangecolor[6].minvalue+"~"+colorrangecolor[6].maxvalue+")";

         colorrangecolor[7].code=ProPerty.EightLevelColor;
        colorrangecolor[7].label=ProPerty.EightLevelText+"("+colorrangecolor[7].minvalue+"~"+colorrangecolor[7].maxvalue+")";

        colorrangecolor[8].code=ProPerty.NineLevelColor;
        colorrangecolor[8].label=ProPerty.NineLevelText+"("+colorrangecolor[8].minvalue+"~"+colorrangecolor[8].maxvalue+")";
        
        }
        else if(ProPerty.ShowLevelCount==="10"){
          colorrangecolor=
          [
            {
                "code": "FFEBE8",
                "minvalue": "0",
                "maxvalue": "30",
                "label": "BAD"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C6C0FF",
                "minvalue": "0",
                "maxvalue": "70",
                "label": "AVERAGE"
            },
            {
                "code": "C5A2EB",
                "minvalue": "0",
                "maxvalue": "100",
                "label": "GOOD"
            }
        ];
             if(Entity.length){
            var CurrentRow=[];
            for(var j=0;j<ProPerty.ShowColumnNum;j++){
                CurrentRow.push(Entity[0].Data[j][ProPerty.CenterDataColumn]);
            }
            var GoodMaxValue=Math.max.apply(null,CurrentRow);
            var BadMinValue=Math.min.apply(null,CurrentRow);
            var GoodValue=GoodMaxValue-BadMinValue;
            if(!isNaN(GoodValue)){
                var BadValue=parseInt(GoodValue*(1/10));
                var AverageValue=parseInt(GoodValue*(2/10));
                var ThreeValue=parseInt(GoodValue*(3/10));
                var FourValue=parseInt(GoodValue*(4/10));
                var FiveValue=parseInt(GoodValue*(5/10));
                var SixValue=parseInt(GoodValue*(6/10));
                var SevenValue=parseInt(GoodValue*(7/10));
                var EightValue=parseInt(GoodValue*(8/10));
                var NineValue=parseInt(GoodValue*(9/10));
                 colorrangecolor[0].minvalue=BadMinValue;
                 colorrangecolor[1].minvalue=BadMinValue+BadValue;
                 colorrangecolor[2].minvalue=BadMinValue+AverageValue;
                 colorrangecolor[3].minvalue=BadMinValue+ThreeValue;
                 colorrangecolor[4].minvalue=BadMinValue+FourValue;
                 colorrangecolor[5].minvalue=BadMinValue+FiveValue;
                 colorrangecolor[6].minvalue=BadMinValue+SixValue;
                 colorrangecolor[7].minvalue=BadMinValue+SevenValue;
                 colorrangecolor[8].minvalue=BadMinValue+EightValue;
                 colorrangecolor[9].minvalue=BadMinValue+NineValue;

                 colorrangecolor[0].maxvalue=BadMinValue+BadValue;
                 colorrangecolor[1].maxvalue=BadMinValue+AverageValue;
                 colorrangecolor[2].maxvalue=BadMinValue+ThreeValue;
                 colorrangecolor[3].maxvalue=BadMinValue+FourValue;
                  colorrangecolor[4].maxvalue=BadMinValue+FiveValue;
                  colorrangecolor[5].maxvalue=BadMinValue+SixValue;
                   colorrangecolor[6].maxvalue=BadMinValue+SevenValue;
                 colorrangecolor[7].maxvalue=BadMinValue+EightValue;
                 colorrangecolor[8].maxvalue=BadMinValue+NineValue;
                 colorrangecolor[9].maxvalue=GoodMaxValue;
            }
       }
       

        colorrangecolor[0].code=ProPerty.BadLevelColor;
        colorrangecolor[0].label=ProPerty.BadLevelText+"("+colorrangecolor[0].minvalue+"~"+colorrangecolor[0].maxvalue+")";

        colorrangecolor[1].code=ProPerty.AverageLevelColor;
        colorrangecolor[1].label=ProPerty.AverageLevelText+"("+colorrangecolor[1].minvalue+"~"+colorrangecolor[1].maxvalue+")";

        colorrangecolor[2].code=ProPerty.GoodLevelColor;
        colorrangecolor[2].label=ProPerty.GoodLevelText+"("+colorrangecolor[2].minvalue+"~"+colorrangecolor[2].maxvalue+")";

        colorrangecolor[3].code=ProPerty.FourLevelColor;
        colorrangecolor[3].label=ProPerty.FourLevelText+"("+colorrangecolor[3].minvalue+"~"+colorrangecolor[3].maxvalue+")";
         
        colorrangecolor[4].code=ProPerty.FiveLevelColor;
        colorrangecolor[4].label=ProPerty.FiveLevelText+"("+colorrangecolor[4].minvalue+"~"+colorrangecolor[4].maxvalue+")";

        colorrangecolor[5].code=ProPerty.SixLevelColor;
        colorrangecolor[5].label=ProPerty.SixLevelText+"("+colorrangecolor[5].minvalue+"~"+colorrangecolor[5].maxvalue+")";

        colorrangecolor[6].code=ProPerty.SevenLevelColor;
        colorrangecolor[6].label=ProPerty.SevenLevelText+"("+colorrangecolor[6].minvalue+"~"+colorrangecolor[6].maxvalue+")";

         colorrangecolor[7].code=ProPerty.EightLevelColor;
        colorrangecolor[7].label=ProPerty.EightLevelText+"("+colorrangecolor[7].minvalue+"~"+colorrangecolor[7].maxvalue+")";

        colorrangecolor[8].code=ProPerty.NineLevelColor;
        colorrangecolor[8].label=ProPerty.NineLevelText+"("+colorrangecolor[8].minvalue+"~"+colorrangecolor[8].maxvalue+")";
        
        colorrangecolor[9].code=ProPerty.TenLevelColor;
        colorrangecolor[9].label=ProPerty.TenLevelText+"("+colorrangecolor[9].minvalue+"~"+colorrangecolor[9].maxvalue+")";
        
        }

        HeatMapChartBasciObj.colorrange.color=colorrangecolor;
        Me.BindChart();
    }


    
}

//参数联动
function HeatMapChartParamChange(AllParam){
       var ParaList=AllParam.split(',');
       var Control=Agi.Controls.FindControlByPanel(ParaList[3]);
       var ProPerty=Control.Get('ProPerty');


      Agi.Msg.PageOutPramats.PramatsChange({
                    'Type': Agi.Msg.Enum.Controls,
                    'Key': ProPerty.ID,
                    'ChangeValue': [{ 'Name': 'YValue', 'Value': ParaList[0] }, { 'Name': 'XValue', 'Value': ParaList[1]}, { 'Name': 'CenterValue', 'Value': ParaList[2]}]
                });
      Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": Control, "Type": Agi.Msg.Enum.Controls });
      //添加脚本事件
      Control.fireScriptCode('click')
    }

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitHeatMapChart = function () {
    return new Agi.Controls.HeatMapChart();
}
//DashboardChart 自定义属性面板初始化显示
Agi.Controls.HeatMapChartProrityInit = function (_HeatMapChart) {
    var Me = _HeatMapChart;
    var ThisProPerty = Me.Get("ProPerty");
    var HeatMapChartProperty = ThisProPerty.BasciObj;
     var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='HeatMapChart_Pro_Panel'>");
    ItemContent.append("<table class='HeatMapChart_prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>Y轴值：</td><td class='HeatMapChart_prortityPanelTabletd2'><select id='LeftDataColumn'></select></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>中间值：</td><td class='HeatMapChart_prortityPanelTabletd2'><select id='CenterDataColumn'></select></td>");
    ItemContent.append("</tr>");
     ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>X轴值：</td><td class='HeatMapChart_prortityPanelTabletd2'><select id='BottomDataColumn'></select></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>数据条数：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='number' id='ShowColumnNum' min='0'/></td>");
    ItemContent.append("</tr>");
     ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd2' colspan='4' style='text-align:center;'><input type='button' id='UsingDataSet' value='应用数据设置' style='width:120px; height:25px;font-size:13px;border-radius: 5px;border: 1px solid #ccc;margin: 2px 0px 2px 0px;'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var DataObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据设置", DisabledValue: 1, ContentObj: DataObj }));


    //1.基本属性设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='HeatMapChart_Pro_Panel'>");
    ItemContent.append("<table class='HeatMapChart_prortityPanelTable'>");
 ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>标示个数：</td><td class='HeatMapChart_prortityPanelTabletd2' colspan='3'><input type='number' id='ShowLevelCount' min='3' max='10' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围1颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='BadLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围1文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='BadLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围2颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='AverageLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围2文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='AverageLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围3颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='GoodLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围3文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='GoodLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
     ItemContent.append("<tr id='FourLevel' style='display:none;'>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围4颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='FourLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围4文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='FourLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr id='FiveLevel' style='display:none;'>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围5颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='FiveLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围5文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='FiveLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr id='SixLevel' style='display:none;'>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围6颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='SixLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围6文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='SixLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr id='SevenLevel' style='display:none;'>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围7颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='SevenLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围7文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='SevenLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr id='EightLevel' style='display:none;'>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围8颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='EightLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围8文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='EightLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr id='NineLevel' style='display:none;'>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围9颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='NineLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围9文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='NineLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr id='TenLevel' style='display:none;'>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围10颜色：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='TenLevelColor'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>范围10文本：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='TenLevelText' maxlength='20'></td>");
    ItemContent.append("</tr>");
     ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd2' colspan='4' style='text-align:center;'><input type='button'  id='UsingTipsSet' value='应用标示设置' style='width:120px; height:25px;font-size:13px;border-radius: 5px;border: 1px solid #ccc;margin: 2px 0px 2px 0px;'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标示颜色与文本设置", DisabledValue: 2, ContentObj: FilletObj }));

    //1.基本属性设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='HeatMapChart_Pro_Panel'>");
    ItemContent.append("<table class='HeatMapChart_prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>主标题：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='Title' maxlength='20'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>副标题：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='SecondTitle' maxlength='20'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>Y轴标题：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='YTitle' maxlength='20'></td>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd0'>X轴标题：</td><td class='HeatMapChart_prortityPanelTabletd2'><input type='text' id='XTitle' maxlength='20'></td>");
    ItemContent.append("</tr>");
     ItemContent.append("<tr>");
    ItemContent.append("<td class='HeatMapChart_prortityPanelTabletd2' colspan='4' style='text-align:center;'><input type='button' id='UsingTitleSet' value='应用标题设置' style='width:120px; height:25px;font-size:13px;border-radius: 5px;border: 1px solid #ccc;margin: 2px 0px 2px 0px;'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var TitleObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "标题设置", DisabledValue: 3, ContentObj: TitleObj }));

         
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

//绑定数据列
    {
     var Entity=Me.Get("Entity");
         //获取所有列名选项
    var options = "";
    if (Entity.length) {
        if (Entity[0].Columns) {
            options = "<option>请选择值</option>";
            $(Entity[0].Columns).each(function (i, col) {
                options += "<option value='" + col + "'>" + col + "</option>";
            });
        }
        $('#ShowColumnNum').attr('max',Entity[0].Data.length);
        //20140424 倪飘 解决bug，热图控件，设置数据条数后返回再进入属性编辑页面，数据条数恢复默认值
        if(ThisProPerty.ShowColumnNum===""){
        ThisProPerty.ShowColumnNum=Entity[0].Data.length;
        }
    }

$("#LeftDataColumn").append($(options)).bind('change', function () {
    
});

$("#CenterDataColumn").append($(options)).bind('change', function () {
    var CenterColumn=$(this).val();
     var Entity=Me.Get("Entity");
     if(isNaN(parseInt(Entity[0].Data[0][CenterColumn]))){
        AgiCommonDialogBox.Alert("当前字段是非数值类型，将不能作为中间值出现，请重新选择！");
        $(this).val("");
        return;
     }
});

$("#BottomDataColumn").append($(options)).bind('change', function () {
});

 $("#LeftDataColumn").val(ThisProPerty.LeftDataColumn);
 $("#CenterDataColumn").val(ThisProPerty.CenterDataColumn);
 $("#BottomDataColumn").val(ThisProPerty.BottomDataColumn);

    //绑定数据条数
  $('#ShowColumnNum').val(ThisProPerty.ShowColumnNum);
  $('#ShowColumnNum').change(function(){
    var min=parseInt($(this).attr('min'));
    var max=parseInt($(this).attr('max'));
    var value=$(this).val();

    if (value < min || value > max ||value.trim()==="") {
            $(this).val(ThisProPerty.ShowColumnNum);
            var DilogboxTitle = "请输入" + min + "-" + max + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
  });
  }
  //初始赋值
  {
    $('#BadLevelColor').val(ThisProPerty.BadLevelColor);
     $("#BadLevelColor").spectrum({
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
           if(color.toHexString()==="#f00"){
            $("#BadLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#BadLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#BadLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#BadLevelColor").val("#ffff00");
            }else{
            $("#BadLevelColor").val(color.toHexString());
            }
        }
    });
    $('#AverageLevelColor').val(ThisProPerty.AverageLevelColor);
    $("#AverageLevelColor").spectrum({
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
       if(color.toHexString()==="#f00"){
            $("#AverageLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#AverageLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#AverageLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#AverageLevelColor").val("#ffff00");
            }else{
            $("#AverageLevelColor").val(color.toHexString());
            }
        }
    });
    $('#GoodLevelColor').val(ThisProPerty.GoodLevelColor);
     $("#GoodLevelColor").spectrum({
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
         if(color.toHexString()==="#f00"){
            $("#GoodLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#GoodLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#GoodLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#GoodLevelColor").val("#ffff00");
            }else{
            $("#GoodLevelColor").val(color.toHexString());
            }
        }
    });
      $('#FourLevelColor').val(ThisProPerty.FourLevelColor);
     $("#FourLevelColor").spectrum({
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
         if(color.toHexString()==="#f00"){
            $("#FourLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#FourLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#FourLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#FourLevelColor").val("#ffff00");
            }else{
            $("#FourLevelColor").val(color.toHexString());
            }
        }
    });

      $('#FiveLevelColor').val(ThisProPerty.FiveLevelColor);
     $("#FiveLevelColor").spectrum({
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
         if(color.toHexString()==="#f00"){
            $("#FiveLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#FiveLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#FiveLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#FiveLevelColor").val("#ffff00");
            }else{
            $("#FiveLevelColor").val(color.toHexString());
            }
        }
    });

        $('#SixLevelColor').val(ThisProPerty.SixLevelColor);
     $("#SixLevelColor").spectrum({
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
         if(color.toHexString()==="#f00"){
            $("#SixLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#SixLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#SixLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#SixLevelColor").val("#ffff00");
            }else{
            $("#SixLevelColor").val(color.toHexString());
            }
        }
    });

        $('#SevenLevelColor').val(ThisProPerty.SevenLevelColor);
     $("#SevenLevelColor").spectrum({
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
        if(color.toHexString()==="#f00"){
            $("#SevenLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#SevenLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#SevenLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#SevenLevelColor").val("#ffff00");
            }else{
            $("#SevenLevelColor").val(color.toHexString());
            }
        }
    });

        $('#EightLevelColor').val(ThisProPerty.EightLevelColor);
     $("#EightLevelColor").spectrum({
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
         if(color.toHexString()==="#f00"){
            $("#EightLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#EightLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#EightLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#EightLevelColor").val("#ffff00");
            }else{
            $("#EightLevelColor").val(color.toHexString());
            }
        }
    });

        $('#NineLevelColor').val(ThisProPerty.NineLevelColor);
     $("#NineLevelColor").spectrum({
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
        if(color.toHexString()==="#f00"){
            $("#NineLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#NineLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#NineLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#NineLevelColor").val("#ffff00");
            }else{
            $("#NineLevelColor").val(color.toHexString());
            }
        }
    });

        $('#TenLevelColor').val(ThisProPerty.TenLevelColor);
     $("#TenLevelColor").spectrum({
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
        if(color.toHexString()==="#f00"){
            $("#TenLevelColor").val("#ff0000");
            }
            else if(color.toHexString()==="#00f"){
            $("#TenLevelColor").val("#0000ff");
            }
            else if(color.toHexString()==="#fff"){
            $("#TenLevelColor").val("#ffffff");
            }
            else if(color.toHexString()==="#ff0"){
            $("#TenLevelColor").val("#ffff00");
            }else{
            $("#TenLevelColor").val(color.toHexString());
            }
        }
    });

    $('#BadLevelText').val(ThisProPerty.BadLevelText);
    $('#AverageLevelText').val(ThisProPerty.AverageLevelText);
    $('#GoodLevelText').val(ThisProPerty.GoodLevelText);
    $('#FourLevelText').val(ThisProPerty.FourLevelText);
    $('#FiveLevelText').val(ThisProPerty.FiveLevelText);
    $('#SixLevelText').val(ThisProPerty.SixLevelText);
    $('#SevenLevelText').val(ThisProPerty.SevenLevelText);
    $('#EightLevelText').val(ThisProPerty.EightLevelText);
    $('#NineLevelText').val(ThisProPerty.NineLevelText);
    $('#TenLevelText').val(ThisProPerty.TenLevelText);


    $('#Title').val(ThisProPerty.Title);
    $('#SecondTitle').val(ThisProPerty.SecondTitle);
    $('#YTitle').val(ThisProPerty.YTitle);
    $('#XTitle').val(ThisProPerty.XTitle);

    $('#ShowLevelCount').bind('change', function (){
        var Count=$(this).val();
        var min=parseInt($(this).attr('min'));
        var max=parseInt($(this).attr('max'));

        if (Count < min || Count > max ||Count.trim()==="") {
            $(this).val(ThisProPerty.ShowLevelCount);
            var DilogboxTitle = "请输入" + min + "-" + max + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
            $('#ShowLevelCount').change();
        }else{
            if(Count==="3"){
                $("#FourLevel").css("display","none");
                $("#FiveLevel").css("display","none");
                $("#SixLevel").css("display","none");
                $("#SevenLevel").css("display","none");
                $("#EightLevel").css("display","none");
                $("#NineLevel").css("display","none");
                $("#TenLevel").css("display","none");
            }
            else if(Count==="4"){
                $("#FourLevel").removeAttr('style');
                $("#FiveLevel").css("display","none");
                $("#SixLevel").css("display","none");
                $("#SevenLevel").css("display","none");
                $("#EightLevel").css("display","none");
                $("#NineLevel").css("display","none");
                $("#TenLevel").css("display","none");
            }
            else if(Count==="5"){
                $("#FourLevel").removeAttr('style');
                $("#FiveLevel").removeAttr('style');
                $("#SixLevel").css("display","none");
                $("#SevenLevel").css("display","none");
                $("#EightLevel").css("display","none");
                $("#NineLevel").css("display","none");
                $("#TenLevel").css("display","none");
            }
            else if(Count==="6"){
                $("#FourLevel").removeAttr('style');
                $("#FiveLevel").removeAttr('style');
                $("#SixLevel").removeAttr('style');
                $("#SevenLevel").css("display","none");
                $("#EightLevel").css("display","none");
                $("#NineLevel").css("display","none");
                $("#TenLevel").css("display","none");
            }
            else if(Count==="7"){
                $("#FourLevel").removeAttr('style');
                $("#FiveLevel").removeAttr('style');
                $("#SixLevel").removeAttr('style');
                $("#SevenLevel").removeAttr('style');
                $("#EightLevel").css("display","none");
                $("#NineLevel").css("display","none");
                $("#TenLevel").css("display","none");
            }
            else if(Count==="8"){
                $("#FourLevel").removeAttr('style');
                $("#FiveLevel").removeAttr('style');
                 $("#SixLevel").removeAttr('style');
                $("#SevenLevel").removeAttr('style');
                $("#EightLevel").removeAttr('style');
                $("#NineLevel").css("display","none");
                $("#TenLevel").css("display","none");

            }
            else if(Count==="9"){
                $("#FourLevel").removeAttr('style');
                $("#FiveLevel").removeAttr('style');
                 $("#SixLevel").removeAttr('style');
                $("#SevenLevel").removeAttr('style');
                $("#EightLevel").removeAttr('style');
                $("#NineLevel").removeAttr('style');
                $("#TenLevel").css("display","none");
            }
            else if(Count==="10"){
                $("#FourLevel").removeAttr('style');
                $("#FiveLevel").removeAttr('style');
                  $("#SixLevel").removeAttr('style');
                $("#SevenLevel").removeAttr('style');
                $("#EightLevel").removeAttr('style');
                $("#NineLevel").removeAttr('style');
                $("#TenLevel").removeAttr('style');
            }
        }
    });
    $('#ShowLevelCount').val(ThisProPerty.ShowLevelCount);
    //20130510 倪飘 修改bug，热图控件中拖入数据绑定好数据并确定设置标示个数为4个，返回整体页面以后再次进入高级属性中标示颜色与文本设置中变为默认的三个标示
    $('#ShowLevelCount').change();
    }

    //按钮点击事件
    {
    $('#UsingDataSet').bind('click',function(){
        var LeftDataColumn=$('#LeftDataColumn').val().trim();
        var CenterDataColumn=$('#CenterDataColumn').val().trim();
        var BottomDataColumn=$('#BottomDataColumn').val().trim();
        var ShowColumnNum=$('#ShowColumnNum').val().trim();
        //20130424 nipiao  解决bug，热图控件，拖入datasets后，x轴、y轴、中间值显示为空选项，建议空选项加上提示性字，如"请选择值"
        if(LeftDataColumn ==="请选择值" || CenterDataColumn==="请选择值" || BottomDataColumn==="请选择值"||ShowColumnNum===null ||ShowColumnNum===""){
            AgiCommonDialogBox.Alert("请将数据属性选择完整再点击设置按钮！");
            return;
        }
         var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.LeftDataColumn=LeftDataColumn;
         ThisProPerty.CenterDataColumn=CenterDataColumn;
         ThisProPerty.BottomDataColumn=BottomDataColumn;
         ThisProPerty.ShowColumnNum=parseInt(ShowColumnNum);
          Me.Set("ProPerty",ThisProPerty);
    });

    $('#UsingTipsSet').bind('click',function(){
        var ShowLevelCount=$('#ShowLevelCount').val();
        //热图属性面板中添加范围可设置功能
        if(ShowLevelCount==="3"){
        var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val()
    
        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

         var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
          ThisProPerty.ShowLevelCount=ShowLevelCount;

          }
        else if (ShowLevelCount==="4"){
          var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val();
         var FourLevelColor=$('#FourLevelColor').val();

        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        var FourLevelText=$('#FourLevelText').val().trim();

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText==="" ||FourLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

          var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
         ThisProPerty.FourLevelColor=FourLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
           ThisProPerty.FourLevelText=FourLevelText;
             ThisProPerty.ShowLevelCount=ShowLevelCount;
          }
        else if(ShowLevelCount==="5"){
          var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val();
         var FourLevelColor=$('#FourLevelColor').val();
         var FiveLevelColor=$('#FiveLevelColor').val();

        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        var FourLevelText=$('#FourLevelText').val().trim();
        var FiveLevelText=$('#FiveLevelText').val().trim();

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText==="" ||FourLevelText==="" ||FiveLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

          var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
         ThisProPerty.FourLevelColor=FourLevelColor.replace('#','');
          ThisProPerty.FiveLevelColor=FiveLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
          ThisProPerty.FourLevelText=FourLevelText;
          ThisProPerty.FiveLevelText=FiveLevelText;
          ThisProPerty.ShowLevelCount=ShowLevelCount;
          }
        else if(ShowLevelCount==="6"){
          var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val();
         var FourLevelColor=$('#FourLevelColor').val();
         var FiveLevelColor=$('#FiveLevelColor').val();
         var SixLevelColor=$('#SixLevelColor').val();

        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        var FourLevelText=$('#FourLevelText').val().trim();
        var FiveLevelText=$('#FiveLevelText').val().trim();
        var SixLevelText=$('#SixLevelText').val().trim();

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText==="" ||FourLevelText==="" ||FiveLevelText==="" ||SixLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

          var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
         ThisProPerty.FourLevelColor=FourLevelColor.replace('#','');
          ThisProPerty.FiveLevelColor=FiveLevelColor.replace('#','');
          ThisProPerty.SixLevelColor=SixLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
          ThisProPerty.FourLevelText=FourLevelText;
          ThisProPerty.FiveLevelText=FiveLevelText;
          ThisProPerty.SixLevelText=SixLevelText;
          ThisProPerty.ShowLevelCount=ShowLevelCount;
          }
        else if(ShowLevelCount==="7"){
          var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val();
         var FourLevelColor=$('#FourLevelColor').val();
         var FiveLevelColor=$('#FiveLevelColor').val();
         var SixLevelColor=$('#SixLevelColor').val();
         var SevenLevelColor=$('#SevenLevelColor').val();

        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        var FourLevelText=$('#FourLevelText').val().trim();
        var FiveLevelText=$('#FiveLevelText').val().trim();
        var SixLevelText=$('#SixLevelText').val().trim();
         var SevenLevelText=$('#SevenLevelText').val().trim();

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText==="" ||FourLevelText==="" ||FiveLevelText==="" ||SixLevelText==="" || SevenLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

          var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
         ThisProPerty.FourLevelColor=FourLevelColor.replace('#','');
          ThisProPerty.FiveLevelColor=FiveLevelColor.replace('#','');
          ThisProPerty.SixLevelColor=SixLevelColor.replace('#','');
          ThisProPerty.SevenLevelColor=SevenLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
          ThisProPerty.FourLevelText=FourLevelText;
          ThisProPerty.FiveLevelText=FiveLevelText;
          ThisProPerty.SixLevelText=SixLevelText;
           ThisProPerty.SevenLevelText=SevenLevelText;
          ThisProPerty.ShowLevelCount=ShowLevelCount;
          }
        else if(ShowLevelCount==="8"){
          var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val();
         var FourLevelColor=$('#FourLevelColor').val();
         var FiveLevelColor=$('#FiveLevelColor').val();
         var SixLevelColor=$('#SixLevelColor').val();
         var SevenLevelColor=$('#SevenLevelColor').val();
          var EightLevelColor=$('#EightLevelColor').val();

        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        var FourLevelText=$('#FourLevelText').val().trim();
        var FiveLevelText=$('#FiveLevelText').val().trim();
        var SixLevelText=$('#SixLevelText').val().trim();
         var SevenLevelText=$('#SevenLevelText').val().trim();
          var EightLevelText=$('#EightLevelText').val().trim();

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText==="" ||FourLevelText==="" ||FiveLevelText==="" ||SixLevelText==="" || SevenLevelText==="" || EightLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

          var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
         ThisProPerty.FourLevelColor=FourLevelColor.replace('#','');
          ThisProPerty.FiveLevelColor=FiveLevelColor.replace('#','');
          ThisProPerty.SixLevelColor=SixLevelColor.replace('#','');
          ThisProPerty.SevenLevelColor=SevenLevelColor.replace('#','');
           ThisProPerty.EightLevelColor=EightLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
          ThisProPerty.FourLevelText=FourLevelText;
          ThisProPerty.FiveLevelText=FiveLevelText;
          ThisProPerty.SixLevelText=SixLevelText;
           ThisProPerty.SevenLevelText=SevenLevelText;
             ThisProPerty.EightLevelText=EightLevelText;
          ThisProPerty.ShowLevelCount=ShowLevelCount;
          }
        else if(ShowLevelCount==="9"){
          var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val();
         var FourLevelColor=$('#FourLevelColor').val();
         var FiveLevelColor=$('#FiveLevelColor').val();
         var SixLevelColor=$('#SixLevelColor').val();
         var SevenLevelColor=$('#SevenLevelColor').val();
          var EightLevelColor=$('#EightLevelColor').val();
           var NineLevelColor=$('#NineLevelColor').val();

        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        var FourLevelText=$('#FourLevelText').val().trim();
        var FiveLevelText=$('#FiveLevelText').val().trim();
        var SixLevelText=$('#SixLevelText').val().trim();
         var SevenLevelText=$('#SevenLevelText').val().trim();
          var EightLevelText=$('#EightLevelText').val().trim();
         var NineLevelText=$('#NineLevelText').val().trim();

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText==="" ||FourLevelText==="" ||FiveLevelText==="" ||SixLevelText==="" || SevenLevelText==="" || EightLevelText==="" || NineLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

          var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
         ThisProPerty.FourLevelColor=FourLevelColor.replace('#','');
          ThisProPerty.FiveLevelColor=FiveLevelColor.replace('#','');
          ThisProPerty.SixLevelColor=SixLevelColor.replace('#','');
          ThisProPerty.SevenLevelColor=SevenLevelColor.replace('#','');
           ThisProPerty.EightLevelColor=EightLevelColor.replace('#','');
         ThisProPerty.NineLevelColor=NineLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
          ThisProPerty.FourLevelText=FourLevelText;
          ThisProPerty.FiveLevelText=FiveLevelText;
          ThisProPerty.SixLevelText=SixLevelText;
           ThisProPerty.SevenLevelText=SevenLevelText;
             ThisProPerty.EightLevelText=EightLevelText;
         ThisProPerty.NineLevelText=NineLevelText;
          ThisProPerty.ShowLevelCount=ShowLevelCount;
          }
         else if(ShowLevelCount==="10"){
          var BadLevelColor=$('#BadLevelColor').val();
        var AverageLevelColor=$('#AverageLevelColor').val();
        var GoodLevelColor=$('#GoodLevelColor').val();
         var FourLevelColor=$('#FourLevelColor').val();
         var FiveLevelColor=$('#FiveLevelColor').val();
         var SixLevelColor=$('#SixLevelColor').val();
         var SevenLevelColor=$('#SevenLevelColor').val();
          var EightLevelColor=$('#EightLevelColor').val();
           var NineLevelColor=$('#NineLevelColor').val();
         var TenLevelColor=$('#TenLevelColor').val();

        var BadLevelText=$('#BadLevelText').val().trim();
        var AverageLevelText=$('#AverageLevelText').val().trim();
        var GoodLevelText=$('#GoodLevelText').val().trim();
        var FourLevelText=$('#FourLevelText').val().trim();
        var FiveLevelText=$('#FiveLevelText').val().trim();
        var SixLevelText=$('#SixLevelText').val().trim();
         var SevenLevelText=$('#SevenLevelText').val().trim();
          var EightLevelText=$('#EightLevelText').val().trim();
         var NineLevelText=$('#NineLevelText').val().trim();
          var TenLevelText=$('#TenLevelText').val().trim();

        if(BadLevelText ==="" || AverageLevelText==="" ||GoodLevelText==="" ||FourLevelText==="" ||FiveLevelText==="" ||SixLevelText==="" || SevenLevelText==="" || EightLevelText==="" || NineLevelText==="" || TenLevelText===""){
        AgiCommonDialogBox.Alert("请将标示文本填写完整再点击设置按钮！");
            return;
        }

          var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.BadLevelColor=BadLevelColor.replace('#','');
         ThisProPerty.AverageLevelColor=AverageLevelColor.replace('#','');
         ThisProPerty.GoodLevelColor=GoodLevelColor.replace('#','');
         ThisProPerty.FourLevelColor=FourLevelColor.replace('#','');
          ThisProPerty.FiveLevelColor=FiveLevelColor.replace('#','');
          ThisProPerty.SixLevelColor=SixLevelColor.replace('#','');
          ThisProPerty.SevenLevelColor=SevenLevelColor.replace('#','');
           ThisProPerty.EightLevelColor=EightLevelColor.replace('#','');
         ThisProPerty.NineLevelColor=NineLevelColor.replace('#','');
         ThisProPerty.TenLevelColor=TenLevelColor.replace('#','');
          ThisProPerty.BadLevelText=BadLevelText;
          ThisProPerty.AverageLevelText=AverageLevelText;
          ThisProPerty.GoodLevelText=GoodLevelText;
          ThisProPerty.FourLevelText=FourLevelText;
          ThisProPerty.FiveLevelText=FiveLevelText;
          ThisProPerty.SixLevelText=SixLevelText;
           ThisProPerty.SevenLevelText=SevenLevelText;
             ThisProPerty.EightLevelText=EightLevelText;
         ThisProPerty.NineLevelText=NineLevelText;
         ThisProPerty.TenLevelText=TenLevelText;
          ThisProPerty.ShowLevelCount=ShowLevelCount;
          }


       Me.Set("ProPerty",ThisProPerty);
    });
     
    $('#UsingTitleSet').bind('click',function(){
         var ThisProPerty = Me.Get("ProPerty");
         ThisProPerty.Title=$('#Title').val();
         ThisProPerty.SecondTitle=$('#SecondTitle').val();
         ThisProPerty.YTitle=$('#YTitle').val();
         ThisProPerty.XTitle=$('#XTitle').val();

          Me.Set("ProPerty",ThisProPerty);
    });
    }



}
