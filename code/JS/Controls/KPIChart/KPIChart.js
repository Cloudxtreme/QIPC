/**
 * Created with JetBrains WebStorm.
 * User: zsj
 * Date: 13-4-15
 * Time: 上午11:18
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
var PointEditState = false;
Agi.Controls.KPIChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
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
        ReadData: function (_EntityInfo) {
            var Me = this;
            var entity = [];
            if (!_EntityInfo.IsShareEntity) {
                Me.IsCoordinate = false;
                _EntityInfo.Columns = [];
                Agi.Utility.RequestData2(_EntityInfo, function (d) {
                    _EntityInfo.Data = d.Data;
                    _EntityInfo.Columns = d.Columns;
                    entity.push(_EntityInfo);
                    Me.Set("Entity", entity);
                    Me.AddEntity(entity[0]);
                });
            } else {
                entity.push(_EntityInfo);
                Me.Set("Entity", entity);
                Me.AddEntity(entity[0]);
                /*添加实体*/
            }
        },
        ReadOtherData: function (Point) {

        },
        ReadRealData: function (MsgObj) {

        },

        AddEntity: function (_entity) {
            if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
                var Me = this;
                var ProPerty = Me.Get("ProPerty");
                var KPIChartProPerty = ProPerty.BasciObj;

                if (!Me.IsCoordinate) {//判断是否为联动时进入，包括配置参数联动和共享数据源联动
                    if (_entity.IsShareEntity) {
                        Me.IsCoordinate = true;
                    }
                    KPIChartProPerty = [];
                    for (var i = 0; i < _entity.Columns.length; i++) {
                        KPIChartProPerty.push({ key: _entity.Columns[i],
                            value: {
                                "chart": {
                                    "palette": "2",
                                    "showopenanchor": "1",
                                    "showclosevalue": "1",
                                    "showopenvalue": "1",
                                    "showcloseanchor": "1",
                                    "bgColor": "ffffff,dddddd",
                                    "bgAlpha": "100",
                                    "showToolTip": "1",
                                    "chartRightMargin": "5",
                                    "canvasBgAlpha": "0",
                                    "linecolor": "ff6600",
                                    "plotFillColor": "ff6600",
                                    "linealpha": "100",
                                    "plotFillAlpha": "100",
                                    "highcolor": "0000ff",
                                    "lowcolor": "FF0000",
                                    "openColor": "0099ff",
                                    "closeColor": "0099ff",
                                    "showHighLowValue": '1',
                                    "caption": _entity.Columns[i],
                                    "subcaption": ""

                                },
                                "dataset": [
                                {
                                    "data": []
                                }
                            ]
                            }
                        });
                    }
                }

                for (var i = 0; i < KPIChartProPerty.length; i++) {
                    KPIChartProPerty[i].value.dataset[0].data = [];
                    for (var j = 0; j < _entity.Data.length; j++) {
                        KPIChartProPerty[i].value.dataset[0].data.push({
                            "value": parseFloat(_entity.Data[j][_entity.Columns[i]]) || 0 //当数据列不能转换为数据时取0
                        })
                    }
                }

                ProPerty.BasciObj = KPIChartProPerty;
                ProPerty.Title = _entity.Key;
                ProPerty.IsReDrawChart = true;
                Me.Set("ProPerty", ProPerty);
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(Me);
                    Agi.Controls.KPIChartProrityInit(Me);
                }
            }
        },
        AddColumn: function (_entity, _ColumnName) {
            var Property = this.Get('ProPerty');
            for (var i = 0; i < Property.BasciObj.length; i++) {
                if (Property.BasciObj[i].key == _ColumnName) {
                    break;
                }
            }
            if (i == Property.BasciObj.length) {
                $("#KPIChart_DataTitleTxt").val("").attr("disabled", true);
                $("#KPIChart_SymbolTxt").val("").attr("disabled", true);
                $("#KPIChart_DataColor").spectrum("set", Property.BasciObj[0].value.chart.linecolor);
                $("#KPIChart_DataBgColor").spectrum("set", Property.BasciObj[0].value.chart.bgColor.split(",")[0]);
                $("#KPIChart_HighDataColor").spectrum("set", Property.BasciObj[0].value.chart.highcolor);
                $("#KPIChart_LowDataColor").spectrum("set", Property.BasciObj[0].value.chart.lowcolor);
                $("#KPIChart_OpenDataColor").spectrum("set", Property.BasciObj[0].value.chart.openColor);
                $("#KPIChart_CloseDataColor").spectrum("set", Property.BasciObj[0].value.chart.closeColor);
                if (Property.BasciObj[0].value.chart.showHighLowValue == "1") {
                    $("#KPIChart_ShowHighLowValue").attr("checked", true);
                } else {
                    $("#KPIChart_ShowHighLowValue").attr("checked", false);
                }
                if (Property.SparkType == "SparkLine") {
                    if (Property.BasciObj[0].value.chart.showopenvalue == "1") {
                        $("#KPIChart_ShowOpenCloseValue").attr("checked", true);
                        $(".OnlyForSparkLine:last").css("display", "table-row");
                    } else {
                        $("#KPIChart_ShowOpenCloseValue").attr("checked", false);
                        $(".OnlyForSparkLine:last").css("display", "none");
                    }
                }
                Property.CheckedIndex = "-1";
                Property.AddOrDelete = "Add";
                Property.IsReDrawChart = true;
                Property.BasciObj.push({ key: _ColumnName,
                    value: {
                        "chart": {
                            "palette": "2",
                            "showopenanchor": "1",
                            "showclosevalue": "1",
                            "showopenvalue": "1",
                            "showcloseanchor": "1",
                            "bgColor": "ffffff,dddddd",
                            "bgAlpha": "100",
                            "showToolTip": "1",
                            "chartRightMargin": "5",
                            "canvasBgAlpha": "0",
                            "linecolor": "ff6600",
                            "plotFillColor": "ff6600",
                            "linealpha": "100",
                            "plotFillAlpha": "100",
                            "highcolor": "0000ff",
                            "lowcolor": "FF0000",
                            "openColor": "0099ff",
                            "closeColor": "0099ff",
                            "showHighLowValue": '1',
                            "caption": _ColumnName,
                            "subcaption": ""

                        },
                        "dataset": [
                            {
                                "data": []
                            }
                        ]
                    }
                });
                for (var j = 0; j < _entity.Data.length; j++) {
                    Property.BasciObj[i].value.dataset[0].data.push({
                        "value": parseFloat(_entity.Data[j][_ColumnName]) || 0 //当数据列不能转换为数据时取0
                    })
                }
                this.Set("ProPerty", Property);
            }
        },
        UpDateEntity: function (_callBackFun) {
        },
        //20130524 倪飘 解决bug，心跳图，拖入数据后双击进入属性，点击页面下方grid标签的叉叉按钮，无法删除该控件绑定的datasets数据
        RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'KPIChart.RemoveEntity Arg is null';
            }
            var self = this;
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
                self.Set('Entity', entitys);
            }
            var ThisProPerty = self.Get("ProPerty");
            ThisProPerty.SparkType = "SparkLine";
            ThisProPerty.Title = "测试数据";
            ThisProPerty.FontWeight = "Normal";
            ThisProPerty.FontColor = "#000000";
            ThisProPerty.CheckedIndex = "-1";
            ThisProPerty.AddOrDelete = "NoChange";
            ThisProPerty.BgColor = { value: { background: "#cccccc"} };
            ThisProPerty.TextAlign = "center";
            ThisProPerty.IsReDrawChart = true;

            var KPIChartProperty = [];
            var data = GetData();
            for (var i = 0; i < data.length; i++) {
                KPIChartProperty.push({ key: data[i].title,
                    value: {
                        "chart": {
                            "palette": "2",
                            "showopenanchor": "1",
                            "showclosevalue": "1",
                            "showopenvalue": "1",
                            "showcloseanchor": "1",
                            "bgColor": "ffffff,dddddd",
                            "bgAlpha": "100",
                            "showToolTip": "1",
                            "chartRightMargin": "5",
                            "canvasBgAlpha": "0",
                            "linecolor": "ff6600", //线形图线条颜色
                            "plotFillColor": "ff6600", //柱状图柱形颜色
                            "linealpha": "100", //线条透明度
                            "plotFillAlpha": "100", //条形透明度
                            "highcolor": "0000ff", //最大值颜色
                            "lowcolor": "FF0000", //最小值颜色
                            "openColor": "0099ff", //开口值颜色
                            "closeColor": "0099ff", //闭口值颜色
                            "showHighLowValue": '1', //线形图显示最值
                            "caption": data[i].title,
                            "subcaption": "▫C"
                        },
                        "dataset": [
                        {
                            "data": data[i].data
                        }
                    ]
                    }
                });
            }
            ThisProPerty.BasciObj = KPIChartProperty;
            self.Set("ProPerty", ThisProPerty);
            //删除数据后删掉共享数据源和控件的关系
            Agi.Msg.ShareDataRelation.DeleteItem(ThisProPerty.ID);
            Agi.Controls.KPIChartProrityInit(self); //更新属性面板
        },
        ParameterChange: function (_ParameterInfo) {
            var Me = this;
            var entityInfo = _ParameterInfo.Entity;
            var entity = [];
            if (!entityInfo.IsShareEntity) {
                Me.IsCoordinate = true;
                Agi.Utility.RequestData2(entityInfo, function (d) {
                    entityInfo.Columns = d.Columns;
                    entityInfo.Data = d.Data;
                    entity.push(entityInfo);
                    Me.Set("Entity", entity);
                    Me.AddEntity(entity[0]);
                });
            }
        }, //参数联动
        Init: function (_Target, _ShowPosition) {
            var Me = this;
            this.AttributeList = [];
            Me.Set("Entity", []);
            Me.Set("ControlType", "KPIChart");
            var ID = "KPIChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty KPIChartPanelSty'></div>");
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
                HTMLElementPanel.width(600);
                HTMLElementPanel.height(200);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                obj.html("");
            }
            Me.Set("HTMLElement", HTMLElementPanel[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: null,
                SparkType: "SparkLine", //SparkLine,SparkColumn,SparkWinLoss
                Title: "测试数据",
                FontFamily: "微软雅黑",
                FontWeight: "Normal",
                FontSize: "16px",
                FontColor: "#000000",
                CheckedIndex: "-1",
                AddOrDelete: "NoChange", //"NoChange":不做增删操作,"Add":添加,"i":删除的下标序号
                BgColor: { value: { background: "#cccccc"} },
                TextAlign: "center",
                IsReDrawChart: true//标记属性发生变化时是否需要重新绘制chart
            };
            var KPIChartProperty = [];
            var data = GetData();
            for (var i = 0; i < data.length; i++) {
                KPIChartProperty.push({ key: data[i].title,
                    value: {
                        "chart": {
                            "palette": "2",
                            "showopenanchor": "1",
                            "showclosevalue": "1",
                            "showopenvalue": "1",
                            "showcloseanchor": "1",
                            "bgColor": "ffffff,dddddd",
                            "bgAlpha": "100",
                            "showToolTip": "1",
                            "chartRightMargin": "5",
                            "canvasBgAlpha": "0",
                            "linecolor": "ff6600", //线形图线条颜色
                            "plotFillColor": "ff6600", //柱状图柱形颜色
                            "linealpha": "100", //线条透明度
                            "plotFillAlpha": "100", //条形透明度
                            "highcolor": "0000ff", //最大值颜色
                            "lowcolor": "FF0000", //最小值颜色
                            "openColor": "0099ff", //开口值颜色
                            "closeColor": "0099ff", //闭口值颜色
                            "showHighLowValue": '1', //线形图显示最值
                            "caption": data[i].title,
                            "subcaption": "▫C"
                        },
                        "dataset": [
                        {
                            "data": data[i].data
                        }
                    ]
                    }
                });
            }
            ThisProPerty.BasciObj = KPIChartProperty;

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
            Me.Set("ThemeInfo", null);
            Me.Set("ProPerty", ThisProPerty);
            this.Set("Position", PostionValue);
            obj = ThisProPerty = PagePars = PostionValue = null;

            //20130515 倪飘 解决bug，组态环境中拖入多KPI图表控件以后拖入容器框控件，容器框控件会覆盖多KPI图表控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        },
        CustomProPanelShow: function () {
            Agi.Controls.KPIChartProrityInit(this);
        }, //显示自定义属性面板
        Destory: function () {
            var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
            var proPerty = this.Get("ProPerty");
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
//                var KPIChart = new Agi.Controls.KPIChart();
//                KPIChart.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return KPIChart;
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
                Agi.Controls.KPIChartProrityInit(Me);
            }
        }, //外壳大小更改
        BindChart: function () {

            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HTMLElement = Me.Get("HTMLElement");
            var KPIChartJson = MePrority.BasciObj;
            var flashName = "";
            if (MePrority.SparkType == "SparkLine") {
                flashName = "SparkLine.swf";
            } else if (MePrority.SparkType == "SparkColumn") {
                flashName = "SparkColumn.swf";
            }
            FusionCharts.setCurrentRenderer('javascript');
            if (MePrority.CheckedIndex == "-1" && MePrority.AddOrDelete == "NoChange") {//-1表示重绘所有chart
                setTimeout(function () {
                    for (var i = 0; i < KPIChartJson.length; i++) {
                        if (FusionCharts(MePrority.ID + "myChart" + i)) {
                            FusionCharts(MePrority.ID + "myChart" + i).dispose();
                        }
                        var chart = new FusionCharts("JS/Controls/KPIChart/image/" + flashName, MePrority.ID + "myChart" + i, "100%", "100%", "0", "1");
                        chart.setJSONData(KPIChartJson[i].value);
                        chart.render(MePrority.ID + "_chart" + i);
                    }
                }, 0);
            } else if (MePrority.CheckedIndex == "-1" && MePrority.AddOrDelete == "Add") {
                var divs = $(HTMLElement).find("li>div");
                if (divs.length == KPIChartJson.length) {
                    for (var i = 0; i < KPIChartJson.length; i++) {
                        if (!FusionCharts(MePrority.ID + "myChart" + i)) {
                            var chart = new FusionCharts("JS/Controls/KPIChart/image/" + flashName, MePrority.ID + "myChart" + i, "100%", "100%", "0", "1");
                            chart.setJSONData(KPIChartJson[(KPIChartJson.length - 1)].value);
                            chart.render(MePrority.ID + "_chart" + i);
                            break;
                        }
                    }
                }
                MePrority.AddOrDelete = "NoChange";
            } else {//重绘选中的chart
                if (FusionCharts(MePrority.ID + "myChart" + MePrority.CheckedIndex)) {
                    FusionCharts(MePrority.ID + "myChart" + MePrority.CheckedIndex).dispose();
                }
                var chart = new FusionCharts("JS/Controls/KPIChart/image/" + flashName, MePrority.ID + "myChart" + MePrority.CheckedIndex, "100%", "100%", "0", "1");
                chart.setJSONData(KPIChartJson[MePrority.CheckedIndex].value);
                chart.render(MePrority.ID + "_chart" + MePrority.CheckedIndex);
            }
        },
        Refresh: function () {
            var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
            var ParentObj = ThisHTMLElement.parent();
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
            var Me = this;
            switch (Key) {
                case "Position":
                    if (layoutManagement.property.type == 1) {
                        var ThisHTMLElementobj = $("#" + _obj.Get("HTMLElement").id);
                        var ThisControlObj = _obj.Get("ProPerty").BasciObj;
                        var ParentObj = ThisHTMLElementobj.parent();
                        var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                        ThisHTMLElementobj.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                        ThisHTMLElementobj.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");

                        var ThisControlPars = { Width: parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                            Height: parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))
                        };
                        ThisHTMLElementobj.width(ThisControlPars.Width);
                        ThisHTMLElementobj.height(ThisControlPars.Height);

                        ThisHTMLElementobj.find("ul").width(ThisControlPars.Width).height((ThisControlObj.length + 1) * 50);
                        //ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
                        //ThisControlObj.Refresh();
                        PagePars = null;
                    }
                    break;
                case "ProPerty":
                    var HTMLElementPanel = $(_obj.Get("HTMLElement"));
                    var length = parseInt(_Value.BasciObj.length);
                    if (_Value.IsReDrawChart) {
                        if (_Value.CheckedIndex == "-1" && _Value.AddOrDelete == "NoChange") {//-1表示属性的变化将会影响整体，图表需全部重绘
                            var ControlHTML = "<ul>";
                            ControlHTML += "<li id='" + _Value.ID + "_Title' style='margin-top:-10px'><h2>" + _Value.Title + "</h2></li>";
                            for (var i = 0; i < length; i++) {
                                ControlHTML += "<li><div id='" + _Value.ID + "_chart" + i + "' style='text-align:center;'>Loading...Please wait!</div></li>";
                            }
                            ControlHTML += "</ul>";
                            var ul = HTMLElementPanel.find("ul");
                            if (ul && ul.length > 0) {
                                ul[0].remove();
                            }
                            HTMLElementPanel.append($(ControlHTML));
                            if (!Me.IsEditState) {//非属性编辑页面时，至少显示一个chart，最多显示全部且不可动态增高
                                HTMLElementPanel.css({
                                    "min-height": "100px",
                                    "max-height": (length + 1) * 50 + "px"
                                });
                            } else {
                                $("#KPIChart_Delete").attr("disabled", true);
                                //属性编辑页面为每个chart注册点击事件，且保证chart的属性与属性面板的值一致
                                HTMLElementPanel.find("li>div").bind("click", function () {
                                    //点击选中，再次点击取消选中，选中时只设置选中图表，取消选中时整体设置
                                    if ($(this).css("border")[0] == "1") {
                                        $(this).css("border", "");
                                        $("#KPIChart_Delete").attr("disabled", true);
                                        $("#KPIChart_DataTitleTxt").val("").attr("disabled", true);
                                        $("#KPIChart_SymbolTxt").val("").attr("disabled", true);
                                        if (_Value.BasciObj.length > 0) {//取消选中时，参数面板默认显示第一个chart的属性
                                            $("#KPIChart_DataColor").spectrum("set", _Value.BasciObj[0].value.chart.linecolor);
                                            $("#KPIChart_DataBgColor").spectrum("set", _Value.BasciObj[0].value.chart.bgColor.split(",")[0]);
                                            $("#KPIChart_HighDataColor").spectrum("set", _Value.BasciObj[0].value.chart.highcolor);
                                            $("#KPIChart_LowDataColor").spectrum("set", _Value.BasciObj[0].value.chart.lowcolor);
                                            $("#KPIChart_OpenDataColor").spectrum("set", _Value.BasciObj[0].value.chart.openColor);
                                            $("#KPIChart_CloseDataColor").spectrum("set", _Value.BasciObj[0].value.chart.closeColor);
                                            if (_Value.BasciObj[0].value.chart.showHighLowValue == "1") {
                                                $("#KPIChart_ShowHighLowValue").attr("checked", true);
                                            } else {
                                                $("#KPIChart_ShowHighLowValue").attr("checked", false);
                                            }
                                            if (_Value.SparkType == "SparkLine") {
                                                if (_Value.BasciObj[0].value.chart.showopenvalue == "1") {
                                                    $("#KPIChart_ShowOpenCloseValue").attr("checked", true);
                                                    $(".OnlyForSparkLine:last").css("display", "table-row");
                                                } else {
                                                    $("#KPIChart_ShowOpenCloseValue").attr("checked", false);
                                                    $(".OnlyForSparkLine:last").css("display", "none");
                                                }
                                            }
                                        }
                                        _Value.CheckedIndex = "-1";
                                    } else {
                                        $(this).css("border", "1px solid #ff0000").parent().siblings().find("div").css("border", "");
                                        var divs = HTMLElementPanel.find("li>div");
                                        for (var i = 0; i < divs.length; i++) {
                                            if (divs[i] == this) {
                                                $("#KPIChart_Delete").attr("disabled", false);
                                                $("#KPIChart_DataTitleTxt").val(_Value.BasciObj[i].value.chart.caption).attr("disabled", false);
                                                $("#KPIChart_SymbolTxt").val(_Value.BasciObj[i].value.chart.subcaption).attr("disabled", false);
                                                $("#KPIChart_DataColor").spectrum("set", _Value.BasciObj[i].value.chart.linecolor);
                                                $("#KPIChart_DataBgColor").spectrum("set", _Value.BasciObj[i].value.chart.bgColor.split(",")[0]);
                                                $("#KPIChart_HighDataColor").spectrum("set", _Value.BasciObj[i].value.chart.highcolor);
                                                $("#KPIChart_LowDataColor").spectrum("set", _Value.BasciObj[i].value.chart.lowcolor);
                                                $("#KPIChart_OpenDataColor").spectrum("set", _Value.BasciObj[i].value.chart.openColor);
                                                $("#KPIChart_CloseDataColor").spectrum("set", _Value.BasciObj[i].value.chart.closeColor);
                                                if (_Value.BasciObj[i].value.chart.showHighLowValue == "1") {
                                                    $("#KPIChart_ShowHighLowValue").attr("checked", true);
                                                } else {
                                                    $("#KPIChart_ShowHighLowValue").attr("checked", false);
                                                }
                                                if (_Value.SparkType == "SparkLine") {
                                                    if (_Value.BasciObj[i].value.chart.showopenvalue == "1") {
                                                        $("#KPIChart_ShowOpenCloseValue").attr("checked", true);
                                                        $(".OnlyForSparkLine:last").css("display", "table-row");
                                                    } else {
                                                        $("#KPIChart_ShowOpenCloseValue").attr("checked", false);
                                                        $(".OnlyForSparkLine:last").css("display", "none");
                                                    }
                                                }
                                                _Value.CheckedIndex = i;
                                                break;
                                            }
                                        }
                                    }
                                    _Value.IsReDrawChart = false;
                                    Me.Set("ProPerty", _Value);
                                })
                            }
                        } else if (_Value.AddOrDelete == "Add") {
                            debugger;
                            var divs = HTMLElementPanel.find("li>div");
                            for (var i = 0; i < length; i++) {
                                for (var j = 0; j < divs.length; j++) {
                                    var num = parseInt(divs[j].id.substring(divs[j].id.length - 1));
                                    if (num == i) {
                                        break;
                                    }
                                }
                                if (j == divs.length) {
                                    break;
                                }
                            }
                            HTMLElementPanel.find("ul").append("<li><div id='" + _Value.ID + "_chart" + i + "' style='text-align:center;'>Loading...Please wait!</div></li>");
                            HTMLElementPanel.find("#" + _Value.ID + "_chart" + i).click(function () {
                                if ($(this).css("border")[0] == "1") {
                                    $(this).css("border", "");
                                    $("#KPIChart_Delete").attr("disabled", true);
                                    $("#KPIChart_DataTitleTxt").val("").attr("disabled", true);
                                    $("#KPIChart_SymbolTxt").val("").attr("disabled", true);
                                    if (_Value.BasciObj.length > 0) {//取消选中时，参数面板默认显示第一个chart的属性
                                        $("#KPIChart_DataColor").spectrum("set", _Value.BasciObj[0].value.chart.linecolor);
                                        $("#KPIChart_DataBgColor").spectrum("set", _Value.BasciObj[0].value.chart.bgColor.split(",")[0]);
                                        $("#KPIChart_HighDataColor").spectrum("set", _Value.BasciObj[0].value.chart.highcolor);
                                        $("#KPIChart_LowDataColor").spectrum("set", _Value.BasciObj[0].value.chart.lowcolor);
                                        $("#KPIChart_OpenDataColor").spectrum("set", _Value.BasciObj[0].value.chart.openColor);
                                        $("#KPIChart_CloseDataColor").spectrum("set", _Value.BasciObj[0].value.chart.closeColor);
                                        if (_Value.BasciObj[0].value.chart.showHighLowValue == "1") {
                                            $("#KPIChart_ShowHighLowValue").attr("checked", true);
                                        } else {
                                            $("#KPIChart_ShowHighLowValue").attr("checked", false);
                                        }
                                        if (_Value.SparkType == "SparkLine") {
                                            if (_Value.BasciObj[0].value.chart.showopenvalue == "1") {
                                                $("#KPIChart_ShowOpenCloseValue").attr("checked", true);
                                                $(".OnlyForSparkLine:last").css("display", "table-row");
                                            } else {
                                                $("#KPIChart_ShowOpenCloseValue").attr("checked", false);
                                                $(".OnlyForSparkLine:last").css("display", "none");
                                            }
                                        }
                                    }
                                    _Value.CheckedIndex = "-1";
                                } else {
                                    $(this).css("border", "1px solid #ff0000").parent().siblings().find("div").css("border", "");
                                    var divs = HTMLElementPanel.find("li>div");
                                    for (var i = 0; i < divs.length; i++) {
                                        if (divs[i] == this) {
                                            $("#KPIChart_Delete").attr("disabled", false);
                                            $("#KPIChart_DataTitleTxt").val(_Value.BasciObj[i].value.chart.caption).attr("disabled", false);
                                            $("#KPIChart_SymbolTxt").val(_Value.BasciObj[i].value.chart.subcaption).attr("disabled", false);
                                            $("#KPIChart_DataColor").spectrum("set", _Value.BasciObj[i].value.chart.linecolor);
                                            $("#KPIChart_DataBgColor").spectrum("set", _Value.BasciObj[i].value.chart.bgColor.split(",")[0]);
                                            $("#KPIChart_HighDataColor").spectrum("set", _Value.BasciObj[i].value.chart.highcolor);
                                            $("#KPIChart_LowDataColor").spectrum("set", _Value.BasciObj[i].value.chart.lowcolor);
                                            $("#KPIChart_OpenDataColor").spectrum("set", _Value.BasciObj[i].value.chart.openColor);
                                            $("#KPIChart_CloseDataColor").spectrum("set", _Value.BasciObj[i].value.chart.closeColor);
                                            if (_Value.BasciObj[i].value.chart.showHighLowValue == "1") {
                                                $("#KPIChart_ShowHighLowValue").attr("checked", true);
                                            } else {
                                                $("#KPIChart_ShowHighLowValue").attr("checked", false);
                                            }
                                            if (_Value.SparkType == "SparkLine") {
                                                if (_Value.BasciObj[i].value.chart.showopenvalue == "1") {
                                                    $("#KPIChart_ShowOpenCloseValue").attr("checked", true);
                                                    $(".OnlyForSparkLine:last").css("display", "table-row");
                                                } else {
                                                    $("#KPIChart_ShowOpenCloseValue").attr("checked", false);
                                                    $(".OnlyForSparkLine:last").css("display", "none");
                                                }
                                            }
                                            _Value.CheckedIndex = i;
                                            break;
                                        }
                                    }
                                }
                                _Value.IsReDrawChart = false;
                                Me.Set("ProPerty", _Value);
                            });
                        }
                        Me.BindChart();
                    } else if (/^\d+$/.test(_Value.AddOrDelete)) {
                        var divs = HTMLElementPanel.find("li>div");
                        var num = parseInt(divs[_Value.AddOrDelete].id.substring(divs[_Value.AddOrDelete].id.length - 1));
                        if (FusionCharts(_Value.ID + "myChart" + num)) {
                            FusionCharts(_Value.ID + "myChart" + num).dispose();
                        }
                        HTMLElementPanel.find("#" + _Value.ID + "_chart" + num).parent().remove();
                        _Value.AddOrDelete = "NoChange";
                    }
                    HTMLElementPanel.find("ul").width(HTMLElementPanel.width()).height((length + 1) * 50).css(_Value.BgColor.value);
                    HTMLElementPanel.find("#" + _Value.ID + "_Title").find("h2").text(_Value.Title).css({
                        "font-family": _Value.FontFamily,
                        "font-weight": _Value.FontWeight,
                        "font-size": _Value.FontSize,
                        "color": _Value.FontColor,
                        "text-align": _Value.TextAlign
                    })
                    break;
            }
        },
        GetConfig: function () {
            var Me = this;
            var ThermometerChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ProPerty: null,
                    Entity: null, //控件实体
                    HTMLElement: null, //控件外壳
                    Position: null, //控件位子
                    ThemeInfo: null//主题名
                }
            }
            ThermometerChartControl.Control.ControlType = Me.Get("ControlType");
            ThermometerChartControl.Control.Entity = Me.Get("Entity");
            var ProPerty = this.Get("ProPerty");
            ProPerty.IsReDrawChart = true;
            ThermometerChartControl.Control.ProPerty = ProPerty;
            ThermometerChartControl.Control.HTMLElement = Me.Get("HTMLElement").id;
            ThermometerChartControl.Control.Position = Me.Get("Position");
            ThermometerChartControl.Control.ThemeInfo = Me.Get("ThemeInfo");
            return ThermometerChartControl.Control;
        },
        CreateControl: function (_Config, _Target) {
            var Me = this;
            Me.IsCoordinate = true;
            Me.AttributeList = [];
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    this.Set("ControlType", _Config.ControlType);

                    var ID = _Config.HTMLElement;
                    var HTMLElementPanel = $("<div recivedata='true' id='" + ID + "' class='PanelSty selectPanelSty KPIChartPanelSty'></div>");
                    HTMLElementPanel.css('padding-bottom', '0px');
                    var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
                    var obj = null;
                    if (typeof (_Target) == "string") {
                        obj = $("#" + _Target);
                    } else {
                        obj = $(_Target);
                    }
                    if (layoutManagement.property.type == 1) {
                        PostionValue = _Config.Position;
                    } else {
                        HTMLElementPanel.removeClass("selectPanelSty");
                        HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                        obj.html("");
                    }
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

                    Me.Set("ProPerty", _Config.ProPerty);
                    this.Set("Position", PostionValue);
                    Me.Set("Entity", _Config.Entity); //实体
                    //20130523 倪飘 解决bug，拖动一个心跳图到页面编辑环境中，拖入实体，保存页面，再次编辑页面时，下方显示无可用实体数据
                    var _EntityInfo = _Config.Entity[0];
                    if (!_EntityInfo.IsShareEntity) {
                        Agi.Utility.RequestData2(_EntityInfo, function (d) {
                            _EntityInfo.Data = d.Data;
                            _EntityInfo.Columns = d.Columns;
                            entity.push(_EntityInfo);
                            Me.Set("Entity", entity);
                        });
                    } else {
                        entity.push(_EntityInfo);
                        Me.Set("Entity", entity);
                    }
                    obj = PostionValue = null;
                }

            }
        },
        InEdit: function () {
            var Me = this;
            var ProPerty = Me.Get("ProPerty");
            var obj = $(Me.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css("overflow", "auto");
            obj.css({ "width": "100%", "height": "100%", "min-height": 0, "max-height": "9999px" });
            //chart的点击事件只在属性编辑页面注册，退出属性编辑页面时注销
            obj.find("li>div").bind("click", function () {
                if ($(this).css("border")[0] == "1") {
                    $(this).css("border", "");
                    $("#KPIChart_Delete").attr("disabled", true);
                    $("#KPIChart_DataTitleTxt").val("").attr("disabled", true);
                    $("#KPIChart_SymbolTxt").val("").attr("disabled", true);
                    if (ProPerty.BasciObj.length > 0) {
                        $("#KPIChart_DataColor").spectrum("set", ProPerty.BasciObj[0].value.chart.linecolor);
                        $("#KPIChart_DataBgColor").spectrum("set", ProPerty.BasciObj[0].value.chart.bgColor.split(",")[0]);
                        $("#KPIChart_HighDataColor").spectrum("set", ProPerty.BasciObj[0].value.chart.highcolor);
                        $("#KPIChart_LowDataColor").spectrum("set", ProPerty.BasciObj[0].value.chart.lowcolor);
                        $("#KPIChart_OpenDataColor").spectrum("set", ProPerty.BasciObj[0].value.chart.openColor);
                        $("#KPIChart_CloseDataColor").spectrum("set", ProPerty.BasciObj[0].value.chart.closeColor);
                        if (ProPerty.BasciObj[0].value.chart.showHighLowValue == "1") {
                            $("#KPIChart_ShowHighLowValue").attr("checked", true);
                        } else {
                            $("#KPIChart_ShowHighLowValue").attr("checked", false);
                        }
                        if (ProPerty.SparkType == "SparkLine") {
                            if (ProPerty.BasciObj[0].value.chart.showopenvalue == "1") {
                                $("#KPIChart_ShowOpenCloseValue").attr("checked", true);
                                $(".OnlyForSparkLine:last").css("display", "table-row");
                            } else {
                                $("#KPIChart_ShowOpenCloseValue").attr("checked", false);
                                $(".OnlyForSparkLine:last").css("display", "none");
                            }
                        }
                    }
                    ProPerty.CheckedIndex = "-1";
                } else {
                    $(this).css("border", "1px solid #ff0000").parent().siblings().find("div").css("border", "");
                    var divs = obj.find("li>div");
                    for (var i = 0; i < divs.length; i++) {
                        if (divs[i] == this) {
                            $("#KPIChart_Delete").attr("disabled", false);
                            $("#KPIChart_DataTitleTxt").val(ProPerty.BasciObj[i].value.chart.caption).attr("disabled", false);
                            $("#KPIChart_SymbolTxt").val(ProPerty.BasciObj[i].value.chart.subcaption).attr("disabled", false);
                            $("#KPIChart_DataColor").spectrum("set", ProPerty.BasciObj[i].value.chart.linecolor);
                            $("#KPIChart_DataBgColor").spectrum("set", ProPerty.BasciObj[i].value.chart.bgColor.split(",")[0]);
                            $("#KPIChart_HighDataColor").spectrum("set", ProPerty.BasciObj[i].value.chart.highcolor);
                            $("#KPIChart_LowDataColor").spectrum("set", ProPerty.BasciObj[i].value.chart.lowcolor);
                            $("#KPIChart_OpenDataColor").spectrum("set", ProPerty.BasciObj[i].value.chart.openColor);
                            $("#KPIChart_CloseDataColor").spectrum("set", ProPerty.BasciObj[i].value.chart.closeColor);
                            if (ProPerty.BasciObj[i].value.chart.showHighLowValue == "1") {
                                $("#KPIChart_ShowHighLowValue").attr("checked", true);
                            } else {
                                $("#KPIChart_ShowHighLowValue").attr("checked", false);
                            }
                            if (ProPerty.SparkType == "SparkLine") {
                                if (ProPerty.BasciObj[i].value.chart.showopenvalue == "1") {
                                    $("#KPIChart_ShowOpenCloseValue").attr("checked", true);
                                    $(".OnlyForSparkLine:last").css("display", "table-row");
                                } else {
                                    $("#KPIChart_ShowOpenCloseValue").attr("checked", false);
                                    $(".OnlyForSparkLine:last").css("display", "none");
                                }
                            }
                            ProPerty.CheckedIndex = i;
                            break;
                        }
                    }
                }
                ProPerty.IsReDrawChart = false;
                Me.Set("ProPerty", ProPerty);
            })
            this.IsEditState = true;
        }, //编辑中
        ExtEdit: function () {
            var Me = this;
            var ProPerty = Me.Get("ProPerty");
            var KPIChartProPerty = ProPerty.BasciObj;
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width);
                obj.height(this.oldSize.height);
                obj.resizable({
                }).css("min-height", "100px").css("max-height", (KPIChartProPerty.length + 1) * 50 + "px").css("position", "absolute");
            }
            obj.css("overflow", "hidden");
            obj.find("li>div").unbind("click").css("border", "");
            ProPerty.CheckedIndex = "-1";
            ProPerty.IsReDrawChart = false;
            Me.Set("ProPerty", ProPerty);
            Me.IsEditState = false;
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            //1.根据当前控件类型和样式名称获取样式信息
            var KPIChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);
            //2.保存主题
            Me.Set("ThemeInfo", _themeName);
            //3.应用当前控件的信息
            Agi.Controls.KPIChart.OptionsAppSty(KPIChartStyleValue, Me);
        }
    });

function GetData(){
    var rowNum=Math.ceil(Math.random()*4)+ 1,
        colNum=Math.ceil(Math.random()*41)+9;
    var data=[];
    for(var i=0;i<rowNum;i++){
        data[i]=new Array();
        data[i].title="测试数据"+i
        data[i].data=[];
        for(var j=0;j<colNum;j++){
            data[i].data.push({
                "value": (Math.random()*200-100).toFixed(2).toString()
            });
        }
    }
    return data;
}
Agi.Controls.KPIChart.OptionsAppSty = function (StyleValue, Me) {
    if(StyleValue !=null){
        var ProPerty=Me.Get("ProPerty");
        ProPerty.FontColor=StyleValue.FontColor;
        ProPerty.BgColor=StyleValue.BgColor;
        for(var i=0;i<ProPerty.BasciObj.length;i++){
            ProPerty.BasciObj[i].value.chart.bgColor=StyleValue.DataBgColor;
            ProPerty.BasciObj[i].value.chart.linecolor=StyleValue.DataColor;
            ProPerty.BasciObj[i].value.chart.plotFillColor=StyleValue.DataColor;
        }
        Me.Set("ProPerty",ProPerty);
    }
}

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitKPIChart = function () {
    return new Agi.Controls.KPIChart();
}

Agi.Controls.KPIChartProrityInit = function (_KPIChart){
    var Me = _KPIChart;
    var ThisProPerty = Me.Get("ProPerty");
    var KPIChartProperty = ThisProPerty.BasciObj;
    var ThisProItems = [];
    var ItemContent = new Agi.Script.StringBuilder();
    //标题配置
    ItemContent.append("<div class='BasicChart_Pro_Panel' >");
    ItemContent.append("<table class='KPIChartPanelTable'>");
    ItemContent.append("<tr>");
    //20130524 倪飘 解决bug，心跳图，属性面板中，控件标题未做长度限制
    ItemContent.append("<td class='KPIChartTabletd0'>控件标题：</td><td colspan='3' class='KPIChartTabletd1'>" +
        "<input id='KPIChart_Titletxt' type='text' style='width:60%;' maxlength='12'>" +
        "<div id='KPIChart_TitleSave' class='KPIChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='KPIChartTabletd0'>字体样式：</td>" +
        "<td class='KPIChartTabletd1'><select id='KPIChart_TitleFontSty'>" +
        "<option selected='selected' value='宋体'>宋体</option><option value='微软雅黑'>微软雅黑</option>" +
        "<option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='KPIChartTabletd0'>粗体样式：</td>" +
        "<td class='KPIChartTabletd1'><select id='KPIChart_TitleFontWeight'>" +
        "<option selected='selected' value='bold'>粗体</option>" +
        "<option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='KPIChartTabletd0'>字体大小：</td>" +
    //20130524 倪飘 解决bug，心跳图控件标题设置中字体大小设置2至12字体大小没变化。
        "<td class='KPIChartTabletd1'><input id='KPIChart_TitleFontSize' type='number' value='14' min='12' max='40'/></td>");
    ItemContent.append("<td class='KPIChartTabletd0'>字体颜色：</td>" +
        "<td class='KPIChartTabletd1'><input id='KPIChart_TitleFontColor' type='text' value='#000000' class='KPIChartLine'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='KPIChartTabletd0'>标题位置：</td><td class='KPIChartTabletd1'>" +
        "<select id='KPIChart_TitleHorDir'>" +
        "<option value='left'>居左</option>" +
        "<option value='center' selected='selected'>居中</option>" +
        "<option value='right'>居右</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var DataObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"标题设置", DisabledValue:1, ContentObj:DataObj }));

    //基本配置
    ItemContent=null;
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
        '<table  class="prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
        '<tr>' +
    //20130524 倪飘 解决bug，心跳图，基本设置中，数据标题，未做长度限制
        '<td class="prortityPanelTabletd0"><label for="KPIChart_DataTitleTxt">数据标题:</label></td><td colspan="3" class="prortityPanelTabletd1"><input id="KPIChart_DataTitleTxt" type="text" style="width:60%;"  maxlength="12"><div id="KPIChart_DataTitleSave" class="KPIChartPropSavebuttonsty" title="保存"></div></td>' +
        '</tr>' +
        '<tr>' +
    //20130524 倪飘 解决bug，心跳图，基本设置中，单位符号，未做长度限制
        '<td class="prortityPanelTabletd0"><label for="KPIChart_SymbolTxt">单位符号:</label></td><td colspan="3" class="prortityPanelTabletd1"><input id="KPIChart_SymbolTxt" type="text" style="width:60%;"   maxlength="5"><div id="KPIChart_SymbolSave" class="KPIChartPropSavebuttonsty" title="保存"></div></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0"><input type="button" value="删除" id="KPIChart_Delete"></td><td colspan="3" class="prortityPanelTabletd1"></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">曲线类型：</td><td  class="prortityPanelTabletd1"><select data-field="SparkType" id="SparkType"><option value="SparkLine">线性图</option><option value="SparkColumn">柱状图</option></select></td>' +
        '<td class="prortityPanelTabletd0">背景填充:</td><td colspan="3"  class="prortityPanelTabletd1"><div id="KPIChart_BgFillColor" class="ControlColorSelPanelSty"></div></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">数据颜色:</td><td  class="prortityPanelTabletd1"><input type="text" id="KPIChart_DataColor" value="#ffffff" class="KPIChart_color"></td>' +
        '<td class="prortityPanelTabletd0">数据背景:</td><td  class="prortityPanelTabletd1"><input type="text" id="KPIChart_DataBgColor" value="#ffffff" class="KPIChart_color"></td>' +
        '</tr>' +
        '<tr class="OnlyForSparkLine">' +
        '<td class="prortityPanelTabletd0"><label for="KPIChart_ShowHighLowValue">显示最值:</label></td><td colspan="3" class="prortityPanelTabletd1"><input type="checkbox" id="KPIChart_ShowHighLowValue"></td>' +
        '</tr>' +
        '<tr>' +
        '<td class="prortityPanelTabletd0">最大值颜色:</td><td  class="prortityPanelTabletd1"><input type="text" id="KPIChart_HighDataColor" value="#ffffff" class="KPIChart_color"></td>' +
        '<td class="prortityPanelTabletd0">最小值颜色:</td><td  class="prortityPanelTabletd1"><input type="text" id="KPIChart_LowDataColor" value="#ffffff" class="KPIChart_color"></td>' +
        '</tr>' +
        '<tr class="OnlyForSparkLine">' +
        '<td class="prortityPanelTabletd0"><label for="KPIChart_ShowOpenCloseValue"> 显示开闭值:</label></td><td colspan="3" class="prortityPanelTabletd1"><input type="checkbox" id="KPIChart_ShowOpenCloseValue"></td>' +
        '</tr>' +
        '<tr class="OnlyForSparkLine">' +
        '<td class="prortityPanelTabletd0">开口值颜色:</td><td  class="prortityPanelTabletd1"><input type="text" id="KPIChart_OpenDataColor" value="#ffffff" class="KPIChart_color"></td>' +
        '<td class="prortityPanelTabletd0">闭口值颜色:</td><td  class="prortityPanelTabletd1"><input type="text" id="KPIChart_CloseDataColor" value="#ffffff" class="KPIChart_color"></td>' +
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
    //region 标题属性设置
    $("#KPIChart_Titletxt").val(ThisProPerty.Title);
    $("#KPIChart_TitleSave").bind("click touchstart",function(){
        if(ThisProPerty.Title!=$("#KPIChart_Titletxt").val()){
            ThisProPerty.Title=$("#KPIChart_Titletxt").val();
            ThisProPerty.IsReDrawChart=false;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    $("#KPIChart_TitleFontSty").val(ThisProPerty.FontFamily);
    $("#KPIChart_TitleFontSty").bind("change",function(){
        ThisProPerty.FontFamily=$("#KPIChart_TitleFontSty").val();
        ThisProPerty.IsReDrawChart=false;
        Me.Set("ProPerty",ThisProPerty);
    });
    $("#KPIChart_TitleFontWeight").val(ThisProPerty.FontWeight);
    $("#KPIChart_TitleFontWeight").bind("change",function(){
        ThisProPerty.FontWeight = $("#KPIChart_TitleFontWeight").val();
        ThisProPerty.IsReDrawChart=false;
        Me.Set("ProPerty",ThisProPerty);
    });
    $("#KPIChart_TitleHorDir").val(ThisProPerty.TextAlign);
    $("#KPIChart_TitleHorDir").bind("change",function(){
        ThisProPerty.TextAlign = $("#KPIChart_TitleHorDir").val();
        ThisProPerty.IsReDrawChart=false;
        Me.Set("ProPerty",ThisProPerty);
    });
    $("#KPIChart_TitleFontSize").val(parseInt(ThisProPerty.FontSize));
    $("#KPIChart_TitleFontSize").bind("change",function(){
        var size=parseInt($("#KPIChart_TitleFontSize").val()),
            min=parseInt($(this).attr("min")),
            max=parseInt($(this).attr("max"));

        if (size >= min && size <= max) {
            ThisProPerty.FontSize=size+"px";
            ThisProPerty.IsReDrawChart=false;
            Me.Set("ProPerty",ThisProPerty);
        } else {
            $(this).val(parseInt(ThisProPerty.FontSize));
            var DilogboxTitle = "请输入" + min + "-" + max + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
    });
    $("#KPIChart_TitleFontColor").val(ThisProPerty.FontColor);
    $("#KPIChart_TitleFontColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
            $("#KPIChart_TitleFontColor").val(color.toHexString());
            ThisProPerty.FontColor = color.toHexString();
            ThisProPerty.IsReDrawChart=false;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    //endregion

    //region 设置chart各部分的颜色
    if(ThisProPerty.BasciObj.length>0){
        if(ThisProPerty.BasciObj[0].value.chart.showHighLowValue=="1"){
            $("#KPIChart_ShowHighLowValue").attr("checked",true);
        }else{
            $("#KPIChart_ShowHighLowValue").attr("checked",false);
        }
        if(ThisProPerty.SparkType=="SparkLine"){
            if(ThisProPerty.BasciObj[0].value.chart.showopenvalue=="1"){
                $("#KPIChart_ShowOpenCloseValue").attr("checked",true);
                $(".OnlyForSparkLine:last").css("display","table-row");
            }else{
                $("#KPIChart_ShowOpenCloseValue").attr("checked",false);
                $(".OnlyForSparkLine:last").css("display","none");
            }
        }
        $("#KPIChart_DataColor").val(ThisProPerty.BasciObj[0].value.chart.linecolor);
        $("#KPIChart_DataBgColor").val(ThisProPerty.BasciObj[0].value.chart.bgColor.split(",")[0]);
        $("#KPIChart_HighDataColor").val(ThisProPerty.BasciObj[0].value.chart.highcolor);
        $("#KPIChart_LowDataColor").val(ThisProPerty.BasciObj[0].value.chart.lowcolor);
        $("#KPIChart_OpenDataColor").val(ThisProPerty.BasciObj[0].value.chart.openColor);
        $("#KPIChart_CloseDataColor").val(ThisProPerty.BasciObj[0].value.chart.closeColor);
    }
    $("#KPIChart_DataColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
            $("#KPIChart_DataColor").val(color.toHexString());
            var c=color.toHexString().substring(1);
            if(c.length==3){
                color=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            }else{
                color=c;
            }
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.linecolor= color;
                    ThisProPerty.BasciObj[i].value.chart.plotFillColor= color;
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.linecolor= color;
                    ThisProPerty.BasciObj[i].value.chart.plotFillColor= color;
                }
            }
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    $("#KPIChart_DataBgColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
            $("#KPIChart_DataBgColor").val(color.toHexString());
            var c=color.toHexString().substring(1);
            if(c.length==3){
                color=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            }else{
                color=c;
            }
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.bgColor= color+",dddddd";
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.bgColor= color+",dddddd";
                }
            }
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    $("#KPIChart_HighDataColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
            $("#KPIChart_HighDataColor").val(color.toHexString());
            var c=color.toHexString().substring(1);
            if(c.length==3){
                color=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            }else{
                color=c;
            }
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.highcolor= color;
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.highcolor= color;
                }
            }
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    $("#KPIChart_LowDataColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
            $("#KPIChart_LowDataColor").val(color.toHexString());
            var c=color.toHexString().substring(1);
            if(c.length==3){
                color=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            }else{
                color=c;
            }
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.lowcolor= color;
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.lowcolor= color;
                }
            }
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    $("#KPIChart_OpenDataColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
            $("#KPIChart_OpenDataColor").val(color.toHexString());
            var c=color.toHexString().substring(1);
            if(c.length==3){
                color=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            }else{
                color=c;
            }
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.openColor= color;
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.openColor= color;
                }
            }
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    $("#KPIChart_CloseDataColor").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
            $("#KPIChart_CloseDataColor").val(color.toHexString());
            var c=color.toHexString().substring(1);
            if(c.length==3){
                color=c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
            }else{
                color=c;
            }
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.closeColor= color;
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.closeColor= color;
                }
            }
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    //endregion

    $("#KPIChart_DataTitleTxt").attr("disabled",true);
    $("#KPIChart_DataTitleSave").bind("click touchstart",function(){
        var text=ThisProPerty.BasciObj[ThisProPerty.CheckedIndex].value.chart.caption;
        if(text!=$("#KPIChart_DataTitleTxt").val()){
            ThisProPerty.BasciObj[ThisProPerty.CheckedIndex].value.chart.caption=$("#KPIChart_DataTitleTxt").val();
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });
    $("#KPIChart_SymbolTxt").attr("disabled",true);
    $("#KPIChart_SymbolSave").bind("click touchstart",function(){
        var text=ThisProPerty.BasciObj[ThisProPerty.CheckedIndex].value.chart.subcaption;
        if(text!=$("#KPIChart_SymbolTxt").val()){
            ThisProPerty.BasciObj[ThisProPerty.CheckedIndex].value.chart.subcaption=$("#KPIChart_SymbolTxt").val();
            ThisProPerty.IsReDrawChart=true;
            Me.Set("ProPerty",ThisProPerty);
        }
    });

    $("#KPIChart_BgFillColor").css(ThisProPerty.BgColor.value);
    $("#KPIChart_BgFillColor").bind("click touchstart", function () {
        //var currentColor = $(this).data('colorValue');
        //var btn = $(this);
        colorPicker.open({
            disableTabIndex: [],
            defaultValue: ThisProPerty.BgColor, //这个参数是上一次选中的颜色
            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                ThisProPerty.BgColor = color;
                ThisProPerty.IsReDrawChart=false;
                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                $("#KPIChart_BgFillColor").css(color.value);
                Me.Set('ProPerty', ThisProPerty);
            }
        });
    });
    //根据不同的图表类型设置联动设置参数面板及chart，图表类型只能整体设置，不支持单个设置
    $("#SparkType").val(ThisProPerty.SparkType);
    if($("#SparkType").val()=="SparkLine"){
        $(".OnlyForSparkLine").css("display","table-row");
    }else{
        $(".OnlyForSparkLine").css("display","none");
    }
    $("#SparkType").change(function(){
        $("li>div").css("border","");
        $("#KPIChart_DataTitleTxt").val("").attr("disabled",true);
        $("#KPIChart_SymbolTxt").val("").attr("disabled",true);
        if(ThisProPerty.BasciObj.length>0){
            $("#KPIChart_DataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.linecolor);
            $("#KPIChart_DataBgColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.bgColor.split(",")[0]);
            $("#KPIChart_HighDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.highcolor);
            $("#KPIChart_LowDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.lowcolor);
            $("#KPIChart_OpenDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.openColor);
            $("#KPIChart_CloseDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.closeColor);
            if(ThisProPerty.BasciObj[0].value.chart.showHighLowValue=="1"){
                $("#KPIChart_ShowHighLowValue").attr("checked",true);
            }else{
                $("#KPIChart_ShowHighLowValue").attr("checked",false);
            }
            if(ThisProPerty.SparkType=="SparkLine"){
                if(ThisProPerty.BasciObj[0].value.chart.showopenvalue=="1"){
                    $("#KPIChart_ShowOpenCloseValue").attr("checked",true);
                    $(".OnlyForSparkLine:last").css("display","table-row");
                }else{
                    $("#KPIChart_ShowOpenCloseValue").attr("checked",false);
                    $(".OnlyForSparkLine:last").css("display","none");
                }
            }
        }
        ThisProPerty.CheckedIndex="-1";
        ThisProPerty.SparkType=$("#SparkType").val();
        if($("#SparkType").val()=="SparkLine"){
            $(".OnlyForSparkLine").css("display","table-row");
            if(!($("#KPIChart_ShowOpenCloseValue").attr("checked"))){
                $(".OnlyForSparkLine:last").css("display","none");
            }
        }else{
            $(".OnlyForSparkLine").css("display","none");
        }
        ThisProPerty.IsReDrawChart=true;
        Me.Set("ProPerty",ThisProPerty);
    });
    $("#KPIChart_ShowHighLowValue").change(function(){
        if(!this.checked){
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.showHighLowValue= "0";
                    ThisProPerty.BasciObj[i].value.chart.chartRightMargin="2";
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.showHighLowValue= "0";
                    ThisProPerty.BasciObj[i].value.chart.chartRightMargin="2";
                }
            }
        }else{
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.showHighLowValue= "1";
                    ThisProPerty.BasciObj[i].value.chart.chartRightMargin="5";
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.showHighLowValue= "1";
                    ThisProPerty.BasciObj[i].value.chart.chartRightMargin="5";
                }
            }
        }
        ThisProPerty.IsReDrawChart=true;
        Me.Set("ProPerty",ThisProPerty);
    })
    $("#KPIChart_Delete").attr("disabled",true);
    $("#KPIChart_Delete").click(function(){debugger;
        for(var i=0;i<ThisProPerty.BasciObj.length;i++){
            if(ThisProPerty.CheckedIndex== i.toString()&&ThisProPerty.BasciObj.length>1){
                $("#KPIChart_Delete").attr("disabled",true);
                $("#KPIChart_DataTitleTxt").val("").attr("disabled",true);
                $("#KPIChart_SymbolTxt").val("").attr("disabled",true);
                ThisProPerty.BasciObj.splice(i,1);
                $("#KPIChart_DataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.linecolor);
                $("#KPIChart_DataBgColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.bgColor.split(",")[0]);
                $("#KPIChart_HighDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.highcolor);
                $("#KPIChart_LowDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.lowcolor);
                $("#KPIChart_OpenDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.openColor);
                $("#KPIChart_CloseDataColor").spectrum("set",ThisProPerty.BasciObj[0].value.chart.closeColor);
                if(ThisProPerty.BasciObj[0].value.chart.showHighLowValue=="1"){
                    $("#KPIChart_ShowHighLowValue").attr("checked",true);
                }else{
                    $("#KPIChart_ShowHighLowValue").attr("checked",false);
                }
                if(ThisProPerty.SparkType=="SparkLine"){
                    if(ThisProPerty.BasciObj[0].value.chart.showopenvalue=="1"){
                        $("#KPIChart_ShowOpenCloseValue").attr("checked",true);
                        $(".OnlyForSparkLine:last").css("display","table-row");
                    }else{
                        $("#KPIChart_ShowOpenCloseValue").attr("checked",false);
                        $(".OnlyForSparkLine:last").css("display","none");
                    }
                }
                ThisProPerty.CheckedIndex="-1";
                ThisProPerty.AddOrDelete= i.toString();
                ThisProPerty.IsReDrawChart=false;
                Me.Set("ProPerty",ThisProPerty);
                break;
            }
        }
    });
    $("#KPIChart_ShowOpenCloseValue").change(function(){
        if(!this.checked){
            $(".OnlyForSparkLine:last").css("display","none");
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.showclosevalue= "0";
                    ThisProPerty.BasciObj[i].value.chart.showopenvalue= "0";
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.showclosevalue= "0";
                    ThisProPerty.BasciObj[i].value.chart.showopenvalue= "0";
                }
            }
        }else{
            $(".OnlyForSparkLine:last").css("display","table-row");
            for(var i=0;i<ThisProPerty.BasciObj.length;i++){
                if(ThisProPerty.CheckedIndex=="-1"){
                    ThisProPerty.BasciObj[i].value.chart.showclosevalue= "1";
                    ThisProPerty.BasciObj[i].value.chart.showopenvalue= "1";
                }else if(ThisProPerty.CheckedIndex== i.toString()){
                    ThisProPerty.BasciObj[i].value.chart.showclosevalue= "1";
                    ThisProPerty.BasciObj[i].value.chart.showopenvalue= "1";
                }
            }
        }
        ThisProPerty.IsReDrawChart=true;
        Me.Set("ProPerty",ThisProPerty);
    })
}