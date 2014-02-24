/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-20
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 * WaterChart:瀑布图
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.WaterfallChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        Render: function (_Target) {
            var self = this;
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
            }
        },
        ReadData: function (_EntityInfo) {
            var Me = this;
            var Entitys = Me.Get("Entity");
            var bolIsEx = false;
            //20130117 倪飘 集成共享数据源
            if (!_EntityInfo.IsShareEntity) {
                if (Entitys != null && Entitys.length > 0) {
                    AgiCommonDialogBox.Alert("此图表只允许应用一个实体！");
                } else {
                    Agi.Utility.RequestData(_EntityInfo, function (d) {
                        _EntityInfo.Data = d;
                        if (d != null && d.length > 0) {
                            _EntityInfo.Columns.length = 0;
                            for (var _param in d[0]) {
                                _EntityInfo.Columns.push(_param);
                            }
                        }
                        //20130531 倪飘 解决bug，气泡图，拖入超过100条数据实体，无提示信息，双击进入属性编辑面板，显示100条限制提示框
                        if (Agi.Edit && _EntityInfo.Data != null && _EntityInfo.Data.length > 100) {
                            AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,瀑布图将截取显示前100条数据！");
                        }
                        Me.IsBindNewData = false;
                        Me.AddEntity(_EntityInfo); /*添加实体*/
                    });
                }
            }
            else {
                //20130409 倪飘 解决bug，瀑布图无法进行共享数据源参数联动
                if (Entitys != null && Entitys.length > 0) {
                    if (Entitys[0].Key != _EntityInfo.Key) {
                        AgiCommonDialogBox.Alert("此图表只允许应用一个实体！");
                    }
                    else {
                        if (_EntityInfo.Data != null && _EntityInfo.Data.length > 0) {
                            _EntityInfo.Columns.length = 0;
                            for (var _param in _EntityInfo.Data[0]) {
                                _EntityInfo.Columns.push(_param);
                            }
                        }
                        if (Agi.Edit && _EntityInfo.Data != null && _EntityInfo.Data.length > 100) {
                            AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,瀑布图将截取显示前100条数据！");
                        }
                        Me.AddEntity(_EntityInfo); /*添加实体*/
                    }

                } else {
                    if (_EntityInfo.Data != null && _EntityInfo.Data.length > 0) {
                        _EntityInfo.Columns.length = 0;
                        for (var _param in _EntityInfo.Data[0]) {
                            _EntityInfo.Columns.push(_param);
                        }
                    }
                    if (Agi.Edit && _EntityInfo.Data != null && _EntityInfo.Data.length > 100) {
                        AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,瀑布图将截取显示前100条数据！");
                    }
                    Me.AddEntity(_EntityInfo); /*添加实体*/

                }
            }

        },
        ReadRealData: function () {
        },
        AddEntity: function (_entity) {/*添加实体*/
            if (_entity != null && _entity.Data != null) {
                var Me = this;
                var Entitys = Me.Get("Entity");
                var bolIsEx = false;
                if (Entitys != null && Entitys.length > 0) {
                    for (var i = 0; i < Entitys.length; i++) {
                        if (Entitys[i].Key == _entity.Key) {
                            Entitys[i].Data = _entity.Data;
                            bolIsEx = true;
                            break;
                        }
                    }
                }
                if (!bolIsEx) {
                    Entitys.push(_entity);
                }
                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                var ChartSerieslength = ThisChartObj.series.length;
                for (var i = 0; i < ChartSerieslength; i++) {
                    ThisChartObj.series[0].remove();
                }
                var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
                for (var i = 0; i < Entitys.length; i++) {
                    if (i < THisChartDataArray.length) {
                        if (THisChartDataArray[i].Entity == null) {
                            THisChartDataArray.splice(i, 1);
                            i = 0;
                        }
                    }
                }
                if (Entitys != null && Entitys.length > 0) {
                    var ChartXAxisArray = [];
                    var _ChartOptions = Me.Get("ChartOptions");
                    for (var i = 0; i < Entitys.length; i++) {
                        if (i < THisChartDataArray.length) {
                            THisChartDataArray[i].data = Agi.Controls.WaterfallChart.ChartDataConvert(ChartXAxisArray,
                                Agi.Controls.WaterfallChart.DataExtract(
                                    Agi.Controls.EntityDataConvertToArrayByColumns(Entitys[i], [Entitys[i].Columns[0], Entitys[i].Columns[1]]), 100));
                        } else {
                            var _Newcolor = Agi.Controls.WaterfallChart.OptionsAppStyGetColorByIndex(i, _ChartOptions.colors);
                            THisChartDataArray.push({
                                name: Agi.Controls.WaterfallChartNewSeriesName(THisChartDataArray),
                                data: Agi.Controls.WaterfallChart.ChartDataConvert(ChartXAxisArray,
                                    Agi.Controls.WaterfallChart.DataExtract(
                                        Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _entity.Columns[1]]), 100)
                                ),
                                type: "waterfall",
                                color: _Newcolor,
                                upColor: _ChartOptions.SeriesExtData.UpColor,
                                Entity: _entity,
                                XColumn: _entity.Columns[0],
                                YColumn: _entity.Columns[1],
                                ExtData: Agi.Controls.WaterfallChart.SeriesExDefaultDataInfo(_Newcolor, _ChartOptions.tooltip),
                                dataLabels: {
                                    enabled: false,
                                    formatter: function () {
                                        if (this.y > 1000 || this.y < -1000) {
                                            return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
                                        } else {
                                            return this.y;
                                        }
                                    },
                                    style: {
                                        color: '#FFFFFF',
                                        fontWeight: 'bold'
                                    }
                                }
                            });
                            _Newcolor = null;
                        }
                        THisChartDataArray[i].data = Agi.Controls.WaterfallChart.GetStandLineDataArray(THisChartDataArray[i], null, _ChartOptions.SeriesExtData);
                        ThisChartObj.addSeries(THisChartDataArray[i], false);
                    }
                    ThisChartObj.setSize(ThisChartObj.chartWidth, ThisChartObj.chartHeight);
                    //                    ThisChartObj.xAxis[0].setCategories(ChartXAxisArray);
                    Me.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/

                    //                    Me.Set("Position", Me.Get("Position"));

                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.WaterfallChartShowSeriesPanel(Me);
                    }
                }
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                }
            } else {
                AgiCommonDialogBox.Alert("您添加的实体无数据！");
            }
        },
        AddColumn: function (_entity, _ColumnName) {
            //            AgiCommonDialogBox.Alert("此图表不支持此操作！");
            var Me = this;
            var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
            var ColumnIsAddedToChart = false;

            if (THisChartDataArray != null && THisChartDataArray.length > 0) {
                AgiCommonDialogBox.Alert("此图形只支持一个Series，显示数据列被替换！");

                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                var ChartSerieslength = ThisChartObj.series.length;
                for (var i = 0; i < ChartSerieslength; i++) {
                    ThisChartObj.series[0].remove();
                }
                THisChartDataArray = [];
            }
            if (!ColumnIsAddedToChart) {
                var ChartXAxisArray = Me.Get("ChartXAxisArray"); /*图表Chart X轴相应的显示点集合*/
                var defaultchartype = "waterfall";
                var _ChartOptions = Me.Get("ChartOptions");
                var _Newcolor = Agi.Controls.WaterfallChart.OptionsAppStyGetColorByIndex(i, _ChartOptions.colors);
                THisChartDataArray.push({
                    name: Agi.Controls.WaterfallChartNewSeriesName(THisChartDataArray),
                    data: Agi.Controls.WaterfallChart.ChartDataConvert(ChartXAxisArray,
                        Agi.Controls.WaterfallChart.DataExtract(
                            Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _ColumnName]), 100)
                    ),
                    type: "waterfall",
                    color: _Newcolor,
                    upColor: _ChartOptions.SeriesExtData.UpColor,
                    Entity: _entity,
                    XColumn: _entity.Columns[0],
                    YColumn: _entity.Columns[1],
                    ExtData: Agi.Controls.WaterfallChart.SeriesExDefaultDataInfo(_Newcolor, _ChartOptions.tooltip),
                    dataLabels: {
                        enabled: false,
                        formatter: function () {
                            if (this.y > 1000 || this.y < -1000) {
                                return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
                            } else {
                                return this.y;
                            }
                        },
                        style: {
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                        }
                    }
                });
                _Newcolor = null;

                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                ThisChartObj.addSeries(THisChartDataArray[THisChartDataArray.length - 1]);
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.WaterfallChartShowSeriesPanel(Me);
                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                }
            }
        }, //拖动列到图表新增Series
        UpDateEntity: function (_callBackFun) {
            var Me = this;
            var MeEntitys = Me.Get("Entity");
            var ThisEntityLength = MeEntitys.length;
            var ChartXAxisArray = [];
            var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
            if (MeEntitys != null && MeEntitys.length > 0) {
                Agi.Controls.WaterfallChart.LoadALLEntityData(MeEntitys, 0, THisChartDataArray, ChartXAxisArray, function () {
                    Me.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/
                    THisChartDataArray = Me.Get("ChartData")
                    var _ChartOptions = Me.Get("ChartOptions");
                    for (var i = 0; i < THisChartDataArray.length; i++) {
                        THisChartDataArray[i].data = Agi.Controls.WaterfallChart.GetStandLineDataArray(THisChartDataArray[i], null, _ChartOptions.SeriesExtData);
                    }
                    _callBackFun();
                });
            }
        }, //更新实体数据，回调函数通知更新完成
        UpDateSeriesData: function () {
            var Me = this;
            var ChartXAxisArray = [];
            var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
            for (var i = 0; i < THisChartDataArray.length; i++) {
                THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.WaterfallChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]), 100));
            }
            Me.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/
        },
        RemoveSeries: function (_SeriesName) {
            var Me = this;
            var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data

            var ThisBaseObj = Me.Get("ProPerty").BasciObj;

            var RemoveIndex = -1;
            for (var i = 0; i < THisChartDataArray.length; i++) {
                if (THisChartDataArray[i].name == _SeriesName) {
                    RemoveIndex = i;
                    break;
                }
            }
            if (RemoveIndex > -1) {
                var EntityKey = THisChartDataArray[RemoveIndex].Entity.Key;
                ThisBaseObj.series[RemoveIndex].remove();
                THisChartDataArray.splice(RemoveIndex, 1);

                //移除Series 时，如果控件剩下的Entity 没有被Series 应用则将其从数组中移除
                Agi.Controls.WaterfallChart.RemoveSeriesUpEntityArray(Me, EntityKey, THisChartDataArray);
            }
            Me.UpDateSeriesData();
            Me.Refresh();
        }, //移除Series
        RemoveEntity: function (_EntityKey) {
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
                Entitys.splice(entityIndex, 1); //移除实体元素
            }
            //删除数据后删掉共享数据源和控件的关系
            Agi.Msg.ShareDataRelation.DeleteItem(Me.Get('ProPerty').ID);
            var ThisChartObj = Me.Get("ProPerty").BasciObj;
            var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
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
                    Agi.Controls.WaterfallChartShowSeriesPanel(Me);
                }
            }

        }, //移除实体Entity
        ParameterChange: function (_ParameterInfo) {
            //当前控件的Entity参数已经被更改，需要将实体的数据重新查找一遍并更新显示
            var Me = this;
            Me.UpDateEntity(function () {
                Me.Refresh(); //刷新显示
            });
        }, //参数联动
        Init: function (_Target, _ShowPosition) {
            var Me = this;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "WaterfallChart");
            var ID = "WaterfallChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty WaterfallChartPanelSty'></div>");
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
                HTMLElementPanel.width(250);
                HTMLElementPanel.height(150);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                obj.html("");
            }
            var ChartXAxisArray = [];
            var THisChartData = Agi.Controls.WaterfallChart.GetChartInitData();
            THisChartData = Agi.Controls.WaterfallChart.ChartDataConvert(ChartXAxisArray, THisChartData);
            var thischartSeriesData = [];
            thischartSeriesData.push({ name: "示例数据", data: THisChartData, type: "waterfall", color: "#058DC7", upColor: Highcharts.getOptions().colors[2], Entity: null, XColumn: "", YColumn: "",
                ExtData: Agi.Controls.WaterfallChart.SeriesExDefaultDataInfo("#058DC7", null),
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.y > 1000 || this.y < -1000) {
                            return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
                        } else {
                            return this.y;
                        }
                    },
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                }
            });

            var _ChartOptionsSeriesExtData = { UpColor: "#8bbc21", SeriesStatistical: { Title: "增长统计", Color: "#000000" }, SeriesTotal: { Title: "合计", Color: "#000000"} };
            thischartSeriesData[0].data = Agi.Controls.WaterfallChart.GetStandLineDataArray(thischartSeriesData[0], null, _ChartOptionsSeriesExtData); //更新数据信息
            this.Set("ChartData", thischartSeriesData); /*Chart数据*/
            this.Set("StandardLines", []); /*Chart 基准线*/
            this.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/
            var ThisProPerty = {
                ID: ID,
                BasciObj: null
            };
            this.Set("ProPerty", ThisProPerty);
            this.Set("HTMLElement", HTMLElementPanel[0]);
            if (_Target != null) {
                this.Render(_Target);
            }

            var StartPoint = { X: 0, Y: 0 }
            /*事件绑定*/

            HTMLElementPanel.dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit && Agi.Edit) {
                    Agi.Controls.ControlEdit(Me); //控件编辑界面
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
                    ev.stopPropagation();
                    var editstate = Me.Get("EditState");
                    if (editstate != null && editstate) {
                    } else {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    }
                });
            }
            this.Set("Position", PostionValue);
            //输出参数
            var OutPramats = { "XValue": 0, "YValue": 0 };
            this.Set("OutPramats", OutPramats); /*输出参数名称集合*/

            var THisOutParats = [];
            if (OutPramats != null) {
                for (var item in OutPramats) {
                    THisOutParats.push({ Name: item, Value: OutPramats[item] });
                }
            }
            Agi.Msg.PageOutPramats.AddPramats({
                "Type": Agi.Msg.Enum.Controls,
                "Key": ID,
                "ChangeValue": THisOutParats
            });
            obj = ThisProPerty = PagePars = PostionValue = THisOutParats = null;
            this.Set("ChartType", "column"); //Chart 图表类型
            this.Set("ThemeInfo", "darkbrown");
            //20130515 倪飘 解决bug，组态环境中拖入瀑布图控件以后拖入容器框控件，容器框控件会覆盖瀑布图控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        }, /*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
        CustomProPanelShow: function () {
            Agi.Controls.WaterfallChartProrityInit(this);
        }, //显示自定义属性面板
        Destory: function () {
            var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
            var proPerty = this.Get("ProPerty");
            $(HTMLElement).remove();
            HTMLElement = null;
            var Me = this;
            Me.AttributeList.length = 0;
            proPerty = null;
            delete this
        },
        getInsideControl: function () {
            var Me = this;
            return Me.Get("ProPerty").BasciObj;
        }, //返回第三方highchart 对象
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var Newdropdownlist = new Agi.Controls.WaterfallChart();
//                Newdropdownlist.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return Newdropdownlist;
//            }
//        },
        PostionChange: function (_Postion, IsResizable) {
            var Me = this;
            if (IsResizable != null && IsResizable) {
                Me.Set("IsResizable", true);
            } else {
                Me.Set("IsResizable", false);
            }
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
            } else {
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
                //移除拖拽、更改大小效果
                $("#" + Agi.Controls.EditControlElementID).draggable("destroy");
                $("#" + Agi.Controls.EditControlElementID).resizable("destroy");
                $("#" + Agi.Controls.EditControlElementID).removeClass("PanelSty");

                Me.Refresh();
            }
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.WaterfallChartShowSeriesPanel(Me);
            }

            //        var MePrority=Me.Get("ProPerty");
            //        var ThisHTMLElement=$("#"+Me.Get("HTMLElement").id);
            //        MePrority.BasciObj.setSize(ThisHTMLElement.width(),ThisHTMLElement.height());/*Chart 更改大小*/
        }, //外壳大小更改
        Refresh: function () {
            //0.清除原图表
            var Me = this;
            var MePrority = Me.Get("ProPerty");
            var HtmlElementID = Me.Get("HTMLElement").id;

            //1.禁用外壳的拖拽移动位置、更改大小 的事件和样式
            $("#" + HtmlElementID).draggable("destroy");
            $("#" + HtmlElementID).resizable("destroy");
            $("#" + HtmlElementID).removeClass("PanelSty");

            //3.更新ChartOptions信息
            var ThisChartXAxisArray = Me.Get("ChartXAxisArray"); /*获取图表Chart X轴相应的显示点集合*/
            var ChartOptions = Me.Get("ChartOptions");
            if (ThisChartXAxisArray != null && ThisChartXAxisArray.length > 0 && ChartOptions.xAxis != null) {
                ChartOptions.xAxis.categories = ThisChartXAxisArray;
            }
            var thischartSeriesData = Me.Get("ChartData"); //图表数据
            //20130409 倪飘 解决bug，瀑布图控件通过参数面板配置参数，进行参数联动的时候，超过100条的数据在截取前100条数据时候没有弹出提示框
            if (Agi.Edit && Me.IsBindNewData && thischartSeriesData[0].data != null && thischartSeriesData[0].data.length >= 100) {
                AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,瀑布图将截取显示前100条数据！");
            }
            //20130531 倪飘 解决bug，气泡图，拖入超过100条数据实体，无提示信息，双击进入属性编辑面板，显示100条限制提示框
            Me.IsBindNewData = true;
            var ChartInitOption = {
                colors: ChartOptions.colors,
                chart: {
                    renderTo: HtmlElementID,
                    style: {
                        zIndex: 0
                    },
                    zoomType: '',
                    reflow: true,
                    backgroundColor: ChartOptions.chart.backgroundColor
                },
                credits: {
                    enabled: false
                },
                exporting:{enabled:false},
                legend: ChartOptions.legend,
                title: ChartOptions.title,
                xAxis: ChartOptions.xAxis,
                yAxis: ChartOptions.yAxis,
                tooltip: ChartOptions.tooltip,
                plotOptions: ChartOptions.plotOptions,
                navigator: ChartOptions.navigator,
                scrollbar: ChartOptions.scrollbar,
                legend: {
                    enabled: false
                },
                series: thischartSeriesData
            };
            ChartInitOption.xAxis.type = "category";

            var BaseControlObj = new Highcharts.Chart(ChartInitOption);
            MePrority.BasciObj = BaseControlObj;

            //2.如果是非编辑界面则为控件添加外壳样式 让其可拖动位置、更改大小
            if (!Agi.Controls.IsControlEdit) {
                $("#" + HtmlElementID).addClass("PanelSty");
            }
            //3.控件重新定位
            //            Me.Set("Position", Me.Get("Position"));

            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.WaterfallChartShowSeriesPanel(Me);
            }
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
            Agi.Controls.WaterfallChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var Me = this;
            var ProPerty = this.Get("ProPerty");
            var WaterChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件ID
                    ControlBaseObj: null, //控件对象
                    HTMLElement: null, //控件外壳
                    SeriesData: null, //Series数据信息
                    Position: null, //控件位置，大小信息
                    ChartOptions: null, //控件属性
                    StandardLines: null, //控件基准线信息
                    ChartThemeName: null, //控件样式名称
                    ChartType: "column"//图表类型名称
                }
            }/*配置信息对象*/

            WaterChartControl.Control.ControlType = Me.Get("ControlType"); /*控件类型*/
            WaterChartControl.Control.ControlID = ProPerty.ID; /*控件属性*/
            WaterChartControl.Control.ControlBaseObj = ProPerty.ID; /*控件基础对象*/
            WaterChartControl.Control.HTMLElement = Me.Get("HTMLElement").id; /*控件外壳ID*/

            var thischartSeriesData = Me.Get("ChartData"); //图表线条Series数据
            var SeriesList = [];
            //20130117 倪飘 集成共享数据源
            var Entitys = Me.Get("Entity");
            for (var i = 0; i < thischartSeriesData.length; i++) {
                SeriesList.push(Agi.Script.CloneObj(thischartSeriesData[i]));
                SeriesList[i].data = null;
                if (SeriesList[i].Entity != null) {
                    if (!Entitys[0].IsShareEntity) {//非共享数据源时清空数据
                        SeriesList[i].Entity.Parameters = thischartSeriesData[i].Entity.Parameters;
                        SeriesList[i].Entity.Data = null;
                    }
                }
            }
            WaterChartControl.Control.SeriesData = SeriesList; /*控件实体*/
            SeriesList = null;
            WaterChartControl.Control.Position = Me.Get("Position"); /*控件位置信息*/
            WaterChartControl.Control.ChartOptions = Me.Get("ChartOptions"); /*Chart Options信息*/
            WaterChartControl.Control.StandardLines = Me.Get("StandardLines"); /*Chart StandardLines*/
            WaterChartControl.Control.ChartThemeName = Me.Get("ThemeName"); /*控件样式名称*/
            WaterChartControl.Control.ChartType = Me.Get("ChartType"); //控件类型名称

            return WaterChartControl.Control; //返回配置字符串
        }, //获得WaterChart控件的配置信息
        CreateControl: function (_Config, _Target) {
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
                    if (typeof (_Config.StandardLines) == "string") {
                        _Config.StandardLines = JSON.parse(_Config.StandardLines);
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
                    Me.Set("ControlType", "WaterfallChart"); //类型
                    Me.Set("Entity", ThisEntitys); //实体
                    Me.Set("ChartData", _Config.SeriesData); //Series数据

                    _Config.ChartOptions.plotOptions.series.point.events = {
                        click: function () {
                            Me.Set("OutPramats", { "XValue": this.name, "Yvalue": this.y }); /*输出参数更改*/
                        }
                    }

                    if (_Config.ChartOptions.tooltip != null) {
                        _Config.ChartOptions.tooltip.formatter = function () {
                            if (this.point.y > 1000 || this.point.y < -1000) {
                                return '<span style="color:' + this.point.color + '">' + this.series.name + '</span><br>(' + this.point.name + ", " + Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k' + ")";
                            } else {
                                return '<span style="color:' + this.point.color + '">' + this.series.name + '</span><br>(' + this.point.name + "," + this.y + ")";
                            }
                        }
                    }

                    Me.Set("ChartOptions", _Config.ChartOptions); //ChartOptions
                    Me.Set("StandardLines", _Config.StandardLines); //StandardLines

                    var ID = _Config.ControlID;
                    var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty WaterfallChartPanelSty'></div>");
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
                        BasciObj: null
                    };
                    this.Set("ProPerty", ThisProPerty);
                    this.Set("HTMLElement", HTMLElementPanel[0]);

                    if (_Target != null) {
                        this.Render(_Target);
                    }

                    var StartPoint = { X: 0, Y: 0 }
                    /*事件绑定*/
                    //                HTMLElementPanel.mousedown(function(ev){
                    //                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                    //                });
                    //                if(HTMLElementPanel.touchstart){
                    //                    HTMLElementPanel.touchstart(function(ev){
                    //                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    //                    });
                    //                }
                    HTMLElementPanel.dblclick(function (ev) {
                        if (!Agi.Controls.IsControlEdit) {
                            Agi.Controls.ControlEdit(Me); //控件编辑界面
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
                    var OutPramats = { "XValue": 0, "YValue": 0 };
                    this.Set("OutPramats", OutPramats); /*输出参数名称集合*/

                    var THisOutParats = [];
                    if (OutPramats != null) {
                        for (var item in OutPramats) {
                            THisOutParats.push({ Name: item, Value: OutPramats[item] });
                        }
                    }
                    Agi.Msg.PageOutPramats.AddPramats({
                        "Type": Agi.Msg.Enum.Controls,
                        "Key": ID,
                        "ChangeValue": THisOutParats
                    });
                    obj = ThisProPerty = PagePars = PostionValue = THisOutParats = null;

                    //更新实体数据
                    Me.UpDateEntity(function () {
                        Me.Refresh();
                    });

                }
            }
        }, //根据配置信息创建控件
        ReloadSeries: function () {
            var Me = this;
            var MeChartData = Me.Get("ChartData"); //获取原图表Data
            var ThisChartObj = Me.Get("ProPerty").BasciObj; //获取图表基本对象
            var chartStandLines = Me.Get("StandardLines"); //获取图表的基准线信息
            var _ChartOptions = Me.Get("ChartOptions");
            for (var i = 0; i < ThisChartObj.series.length; i++) {
                ThisChartObj.series[0].remove();
                i--;
            }
            if (MeChartData != null && MeChartData.length > 0) {
                for (var i = 0; i < MeChartData.length; i++) {
                    MeChartData[i].data = Agi.Controls.WaterfallChart.GetStandLineDataArray(MeChartData[i], chartStandLines, _ChartOptions.SeriesExtData); /*根据基准线更新相应的点值*/
                    ThisChartObj.addSeries(MeChartData[i]);
                }
            }
        }, //重新加载Series
        LoadStandardLineObjMenu: function (_ChartStandardLineObj, _Dir) {
            var Me = this;
            Agi.Controls.WaterfallChart.ShowStandardLineMenu(Me);
        }, //加载基准线菜单
        RemoveStandardLines: function (ThisChartObj, _StandardLines) {
            if (_StandardLines != null && _StandardLines.length > 0) {
                for (var i = 0; i < _StandardLines.length; i++) {
                    if (_StandardLines[i].LineDir == "Vertical") {
                        ThisChartObj.xAxis[0].removePlotLine(_StandardLines[i].LineID);
                    } else {
                        ThisChartObj.yAxis[0].removePlotLine(_StandardLines[i].LineID);
                    }
                    if ($("#Menu_" + _StandardLines[i].LineID).length > 0) {
                        $("#Menu_" + _StandardLines[i].LineID).remove();
                    }
                }
            }
        }, //20120913,移除基准线
        InEdit: function () {
            var Me = this;
            Me.Set("EditState", true); //编辑
            Me.UnChecked();
            Me.Refresh(); //重新刷新显示
        }, //编辑中
        ExtEdit: function () {
            var Me = this;
            if ($("#menuBasichartseriesdiv").length > 0) {
                $("#menuBasichartseriesdiv").remove();
            }
            if ($("#BasichartStandardLinemenudiv").length > 0) {
                $("#BasichartStandardLinemenudiv").remove();
            }
            if (Me.Get("HTMLElement") != null) {
                Me.Checked();
            }
            Me.Set("EditState", false); //非编辑
        }, //退出编辑
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //2.获取当前控件的ChartOptions属性
            var _ChartOptions = Me.Get("ChartOptions");

            //3.应用当前控件的Options信息
            Agi.Controls.WaterfallChart.OptionsAppSty(Me.Get("ChartData"), Me.Get("ChartType"), ChartStyleValue, _ChartOptions);

            //4.重新赋值ChartOptions与样式名称
            Me.Set("ChartOptions", _ChartOptions);
            Me.Set("ThemeName", _themeName);

            //5.控件刷新显示
            Me.Refresh(); //刷新显示
            ChartStyleValue = null;
            /*20121104163027 结束*/
        } //更改样式
    });
/*WaterChart参数更改处理方法*/
Agi.Controls.WaterfallChartAttributeChange=function(_ControlObj,Key,_Value){
    if(Key=="Position"){
        if(layoutManagement.property.type==1){
            var ThisHTMLElementobj=$("#"+_ControlObj.Get("HTMLElement").id);
            var ThisControlObj=_ControlObj.Get("ProPerty").BasciObj;

            var ParentObj = ThisHTMLElementobj.parent();
            if (!ParentObj.length) {
                return;
            }
            var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
            ThisHTMLElementobj.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
            ThisHTMLElementobj.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");

            ///20130106 11:13 更改控件位置时不更改控件大小
            var bolIsResizable=_ControlObj.Get("IsResizable");
//            if(bolIsResizable){
            var ThisControlPars={Width:parseInt(PagePars.Width*(1-_Value.Left-_Value.Right)),
                Height:parseInt(PagePars.Height*(1-_Value.Top-_Value.Bottom))};

            ThisHTMLElementobj.width(ThisControlPars.Width);
            ThisHTMLElementobj.height(ThisControlPars.Height);
            ThisControlObj.setSize(ThisControlPars.Width,ThisControlPars.Height);/*Chart 更改大小*/
//            }

            PagePars=null;
        }
    }else if(Key=="OutPramats"){
        if(_Value!=null && _Value!=""){
            var ThisControlPrority=_ControlObj.Get("ProPerty");
            var ThisOutPars=[];
            for(var item in _Value){
                ThisOutPars.push({Name:item,Value:_Value[item]});
            }

            Agi.Msg.PageOutPramats.PramatsChange({/*Chart 输出参数更改*/
                "Type": Agi.Msg.Enum.Controls,
                "Key":ThisControlPrority.ID,
                "ChangeValue":ThisOutPars
            });
            Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj,"Type":Agi.Msg.Enum.Controls});
//            ThisOutPars=null;
        }
        //通知消息模块，参数发生更改
    }else if(Key=="ThemeInfo"){//主题更改
        var ChartOptions=Agi.Controls.WaterfallChart.GetManagerThemeInfo(_ControlObj,_Value);//获得处理后的主题信息值

        //默认扩展数据选项
        ChartOptions.SeriesExtData={UpColor:"#8bbc21",SeriesStatistical:{Title:"增长统计",Color:"#000000"},SeriesTotal:{Title:"合计",Color:"#000000"}};
        _ControlObj.Set("ChartOptions",ChartOptions);
        _ControlObj.Refresh();//刷新显示
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitWaterfallChart=function(){
    return new Agi.Controls.WaterfallChart();
}

//region WaterChart 自定义属性面板初始化显示
Agi.Controls.WaterfallChartProrityInit=function(_WaterChart){
    var Me=_WaterChart;
    var ThisProItems=[];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent=new Agi.Script.StringBuilder();

    //region 4.1.标题
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='WaterfallChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>标题内容：</td><td colspan='3' class='prortityPanelTabletd1'><input id='WaterChart_Titletxt' type='text' style='width:70%;' class='ControlProTextSty' maxlength='15' ischeck='true'><div id='WaterChart_TitleSave' class='WaterChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体样式：</td><td class='prortityPanelTabletd1'><select id='WaterChart_TitleFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>粗体样式：</td><td class='prortityPanelTabletd1'><select id='WaterChart_TitleFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd1'><input id='WaterChart_TitleFontSize' type='number' value='14' defaultvalue='14' min='8' max='30'  class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_TitleFontColor' class='WaterfallChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>水平方向：</td><td class='prortityPanelTabletd1'><select id='WaterChart_TitleHorDir'><option value='left'>居左</option><option value='center' selected='selected'>居中</option><option value='right'>居右</option></select></td>");
//    ItemContent.append("<td class='prortityPanelTabletd0'>垂直方向：</td><td class='prortityPanelTabletd1'><select id='WaterChart_TitleVirDir'><option value='top' selected='selected'>居上</option><option value='middle'>居中</option><option value='bottom'>居下</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>垂直方向：</td><td class='prortityPanelTabletd1'><select id='WaterChart_TitleVirDir'><option value='top' selected='selected'>居上</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var TitleObj=$(ItemContent.toString());
    //endregion

    //region 4.2.数据曲线
    var ThisChartData=_WaterChart.Get("ChartData");
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();


    var ThisChartEntitys=_WaterChart.Get("Entity");
    var Columns=[];
    if(ThisChartEntitys!=null && ThisChartEntitys.length>0){
        for(var item in ThisChartEntitys[0].Columns){
            Columns.push(ThisChartEntitys[0].Columns[item]);
        }
    }

    var DataLinesObj=null;
    if(ThisChartData!=null && ThisChartData.length>0){
        //chart Series 颜色可选项
        ItemContent=null;
        ItemContent=new Agi.Script.StringBuilder();
        ItemContent.append("<div class='WaterfallChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>曲线：</td>");
        ItemContent.append("<td colspan='3' class='prortityPanelTabletd2'><input id='TxtProPanelLineName' type='text'  value='"+ThisChartData[0].name+"' class='ControlProTextSty' maxlength='10' ischeck='true'><div id='BsicChartSeriesLineSave'  class='WaterChartPropSavebuttonsty' title='保存'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        //20130408 倪飘 解决bug，瀑布图控件中数据曲线里面"数据颜色"意思不明确
        //20130408 倪飘 解决bug，瀑布图控件高级属性中，数据曲线设置面板会被其他控件影响样式
        ItemContent.append("<td class='prortityPanelTabletd0'>数据指示色：</td><td colspan='3' class='prortityPanelTabletd1'><div id='BsicChartLineColorSel' class='WaterfallChartColorSelsty WaterfallChart_ColorControl ' style='background-color:#058dc7;' title='编辑'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>标签：</td><td class='prortityPanelTabletd1'><select id='WaterChartLine_Lable'><option selected='selected' value='false'>禁用</option><option  value='true'>启用</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Tips：</td><td class='prortityPanelTabletd1'><select id='WaterChartLine_Tips'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>增长颜色：</td><td class='prortityPanelTabletd1' colspan='3'><div id='WtflChart_SeriesUpcolor'  style='background-color:#8bbc21' class='WaterfallChartColorSelsty WaterfallChart_ColorControl'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>统计文本：</td><td class='prortityPanelTabletd1'><input id='WtflChart_StaticlText' type='text' ></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>统计颜色：</td><td class='prortityPanelTabletd1'><div id='WtflChart_StaticlColor' style='background-color:#000000' class='WaterfallChartColorSelsty WaterfallChart_ColorControl'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>合计文本：</td><td class='prortityPanelTabletd1'><input id='WtflChart_TolText' type='text' ></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>合计颜色：</td><td class='prortityPanelTabletd1'><div id='WtflChart_TolColor' style='background-color:#000000' class='WaterfallChartColorSelsty WaterfallChart_ColorControl'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        DataLinesObj=$(ItemContent.toString());
    }

    //Series颜色更改
    Me.SeriesColorChanged=function(thisChartcolor){
        var ChartSeriesData=_WaterChart.Get("ChartData");
        var SeriesIndex=0;
        if(Agi.Controls.WaterfallChartSelSeriesName!=null && ChartSeriesData.length>0){
            for(var i=0;i<ChartSeriesData.length;i++){
                if(ChartSeriesData[i].name===Agi.Controls.WaterfallChartSelSeriesName){
                    SeriesIndex=i;
                    break;
                }
            }
        }
        if(ChartSeriesData!=null && ChartSeriesData.length>0){
            ChartSeriesData[SeriesIndex].color=thisChartcolor;
            var chartStandLines=Me.Get("StandardLines");//获取图表的基准线信息
            var _ChartOptions = Me.Get("ChartOptions");
            ChartSeriesData[SeriesIndex].data=Agi.Controls.WaterfallChart.GetStandLineDataArray(ChartSeriesData[SeriesIndex],chartStandLines,_ChartOptions.SeriesExtData);/*根据基准线更新相应的点值*/
            _WaterChart.Refresh();
        }else{
            AgiCommonDialogBox.Alert("请您先添加DataSet 至当前图表!")
        }
    }
    //Series 扩展属性更改
    Me.SeriesExtDataChanged=function(_SeriesData){
        var ExtData=_SeriesData.SeriesExData;//Series 扩展属性信息
        var SeriesName=_SeriesData.Name;//Series 更改后名称
        var ChartSeriesData=_WaterChart.Get("ChartData");
        var SeriesIndex=-1;
        if(Agi.Controls.WaterfallChartSelSeriesName!=null && ChartSeriesData.length>0){
            for(var i=0;i<ChartSeriesData.length;i++){
                if(ChartSeriesData[i].name===Agi.Controls.WaterfallChartSelSeriesName){
                    SeriesIndex=i;
                }
                ChartSeriesData[i].ExtData.Tips.enabled=ExtData.Tips.enabled;
            }
        }
        if(SeriesIndex>-1){}else{
            AgiCommonDialogBox.Alert("请选中对应的Series后再试！");
            return ;
        }
        if(ChartSeriesData!=null && ChartSeriesData.length>0){
            ChartSeriesData[SeriesIndex].name=SeriesName;

            ChartSeriesData[SeriesIndex].dataLabels.enabled=_SeriesData.SeriesExData.dataLabels.enabled;

            var chartStandLines=Me.Get("StandardLines");//获取图表的基准线信息
            ChartSeriesData[SeriesIndex].ExtData=ExtData;
            var ChartOptions=Me.Get("ChartOptions");
            if(ChartOptions!=null){
                if(ChartOptions.tooltip==null){
                    ChartOptions.tooltip={
                        enabled:false
                    }
                }
                ChartOptions.tooltip.enabled=ExtData.Tips.enabled;
                ChartOptions.tooltip.formatter=function(){
                    if(this.point.y>1000 || this.point.y<-1000){
                        return '<span style="color:'+this.point.color+'">'+this.series.name+'</span><br>('+this.point.name+", "+Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k'+")";
                    }else{
                        return '<span style="color:'+this.point.color+'">'+this.series.name+'</span><br>('+this.point.name+","+this.y+")";
                    }
                }
            }

            var _ChartOptions = Me.Get("ChartOptions");
            ChartSeriesData[SeriesIndex].upColor=_ChartOptions.SeriesExtData.UpColor;
            ChartSeriesData[SeriesIndex].data = Agi.Controls.WaterfallChart.GetStandLineDataArray(ChartSeriesData[SeriesIndex], chartStandLines, _ChartOptions.SeriesExtData);

            //20130408 倪飘 解决bug，瀑布图控件高级属性中，设置数据颜色未点击保存便直接应用，与其他属性不一致
            ChartSeriesData[SeriesIndex].color = _ChartOptions.SeriesExtData.SeriesColor;
            var chartStandLines = Me.Get("StandardLines"); //获取图表的基准线信息
            var _ChartOptions = Me.Get("ChartOptions");
            ChartSeriesData[SeriesIndex].data = Agi.Controls.WaterfallChart.GetStandLineDataArray(ChartSeriesData[SeriesIndex], chartStandLines, _ChartOptions.SeriesExtData); /*根据基准线更新相应的点值*/

            _WaterChart.Refresh();
        }else{
            AgiCommonDialogBox.Alert("请您先添加DataSet 至当前图表!")
        }
    }
    //endregion

    //endregion

    //region 4.4.XAxis
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='WaterfallChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>启用状态：</td><td colspan='3' class='prortityPanelTabletd1'><select id='WaterChartXAxis'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select><div id='WaterChart_XAxisSave' class='WaterChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体样式：</td><td class='prortityPanelTabletd1'><select id='WaterChart_XAxisFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>粗体样式：</td><td class='prortityPanelTabletd1'><select id='WaterChart_XAxisFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd1'><input id='WaterChart_XAxisFontSize' type='number' value='14' defaultvalue='14' min='8' max='40' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_XAxisFontColor' class='WaterfallChartColorSelsty WaterfallChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条大小：</td><td class='prortityPanelTabletd1'><input id='WaterChart_XAxisLineSize' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_XAxisLineColor' class='WaterfallChartColorSelsty WaterfallChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度长度：</td><td class='prortityPanelTabletd1'><input id='WaterChart_XAxisLineTicklength' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度宽度：</td><td class='prortityPanelTabletd1'><input id='WaterChart_XAxisLineTickWidth' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_XAxisLineTickcolor' style='background-color:#000000' class='WaterfallChartColorSelsty WaterfallChart_ColorControl' title='编辑'></div></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度位置：</td><td class='prortityPanelTabletd1'><select id='WaterChart_XAxisLineTickPosition'><option selected='selected' value='outside'>外侧</option><option value='inside'>内侧</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var XAxisObj=$(ItemContent.toString());
    //endregion

    //region 4.5.YAxis
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='WaterfallChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>启用状态：</td><td colspan='3' class='prortityPanelTabletd1'><select id='WaterChartYAxis'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select><div id='WaterChart_YAxisSave' class='WaterChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体样式：</td><td class='prortityPanelTabletd1'><select id='WaterChart_YAxisFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>粗体样式：</td><td class='prortityPanelTabletd1'><select id='WaterChart_YAxisFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd1'><input id='WaterChart_YAxisFontSize' type='number' value='14' defaultvalue='14' min='8' max='40' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_YAxisFontColor' class='WaterfallChartColorSelsty WaterfallChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条大小：</td><td class='prortityPanelTabletd1'><input id='WaterChart_YAxisLineSize' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_YAxisLineColor'  style='background-color:#000000' class='WaterfallChartColorSelsty WaterfallChart_ColorControl' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度长度：</td><td class='prortityPanelTabletd1'><input id='WaterChart_YAxisLineTicklength' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度宽度：</td><td class='prortityPanelTabletd1'><input id='WaterChart_YAxisLineTickWidth' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_YAxisLineTickcolor' style='background-color:#000000' class='WaterfallChartColorSelsty WaterfallChart_ColorControl'title='编辑'></div></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度位置：</td><td class='prortityPanelTabletd1'><select id='WaterChart_YAxisLineTickPosition'><option selected='selected' value='outside'>外侧</option><option value='inside'>内侧</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var YAxisObj=$(ItemContent.toString());
    //endregion

    //region 4.6.背景相关
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='WaterfallChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>图表背景：</td><td colspan='3' class='prortityPanelTabletd1'><div id='WaterChart_bgvalue' class='WaterfallChart_ColorControl' style='float:left;background-color:#ffffff;'/></div><div id='WaterChart_BackgroundSave' class='WaterChartPropSavebuttonsty' title='保存' style='float: left;margin-top:6px;'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>水平网格线：</td><td class='prortityPanelTabletd1'><input id='WaterChart_YGridLineSize' type='number' value='0' defaultvalue='0' min='0' max='5' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_YGridLineColor' class='WaterfallChartColorSelsty WaterfallChart_ColorControl' style='background-color:#a4a4a4;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>垂直网格线：</td><td class='prortityPanelTabletd1'><input id='WaterChart_XGridLineSize' type='number' value='0' defaultvalue='0' min='0' max='5' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='WaterChart_XGridLineColor' class='WaterfallChartColorSelsty WaterfallChart_ColorControl' style='background-color:#a4a4a4;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BackGroundObj=$(ItemContent.toString());
    //endregion

    //region 5.初始化属性项显示
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"标题",DisabledValue:1,ContentObj:TitleObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"背景设置",DisabledValue:1,ContentObj:BackGroundObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"数据曲线",DisabledValue:1,ContentObj:DataLinesObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"XAxis",DisabledValue:1,ContentObj:XAxisObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"YAxis",DisabledValue:1,ContentObj:YAxisObj}));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //endregion

    //region 6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged=function(_item){
        var itemtitle=_item.Title;
        if(_item.DisabledValue==0){
            itemtitle+="禁用";
        }else{
            itemtitle+="启用";
        }
//        alert(itemtitle);
    }
    //endregion

    //region 7.加载自定义属性面板值与相应插件 事件处理
    //7.1.标题属性加载与保存
    var ChartOptions=Me.Get("ChartOptions");
    if(ChartOptions.title==null){
        ChartOptions.title={
            align:"center",
            floating:false,
            text:"",
            verticalAlign:null,
            style:{
                fontFamily:"微软雅黑",
                fontWeight:"bold",
                color:"#000000",
                fontSize:"14px"
            }
        }
    }
    $("#WaterChart_TitleFontColor").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });
    $(".WaterfallChartColorSelsty").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });

    $("#WaterChart_TitleSave").die("click");
    $("#WaterChart_TitleSave").live("click",function(ev){
        var Yvalue=null;
//        Yvalue=eval($("#WaterChart_TitleFontSize").val())-10;
//        if($("#WaterChart_TitleVirDir").val()==="bottom"){
//            Yvalue=null;
//        }
        var ThisColorValue=Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_TitleFontColor");
        ChartOptions.title={
            align:$("#WaterChart_TitleHorDir").val(),
            floating:false,
//            margin:30,
            text:$("#WaterChart_Titletxt").val(),
            verticalAlign:null,
            style:{
                fontFamily:$("#WaterChart_TitleFontSty").val(),
                fontWeight: $("#WaterChart_TitleFontWeight").val(),
                color:ThisColorValue,
                fontSize:$("#WaterChart_TitleFontSize").val()+"px"
            }
//            ,y:Yvalue
        }
        Me.Get("ProPerty").BasciObj.setTitle(ChartOptions.title);
        Me.Set("ChartOptions",ChartOptions);
    });
    if(ChartOptions.title!=null){
        $("#WaterChart_Titletxt").val(ChartOptions.title.text);
        $("#WaterChart_TitleFontSty").find("option[value='"+ChartOptions.title.style.fontFamily+"']").attr("selected","selected");
        $("#WaterChart_TitleFontWeight").find("option[value='"+ChartOptions.title.style.fontWeight+"']").attr("selected","selected");
        $("#WaterChart_TitleFontSize").val(parseInt(ChartOptions.title.style.fontSize.replace("px","")));
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_TitleFontColor",ChartOptions.title.style.color,false);//赋值默认颜色
        $("#WaterChart_TitleHorDir").find("option[value='"+ChartOptions.title.align+"']").attr("selected","selected");
        $("#WaterChart_TitleVirDir").find("option[value='"+ChartOptions.title.verticalAlign+"']").attr("selected","selected");
    }

    /*7.2.Series 数据颜色更改*/
//    $("#BsicChartLineColorSel").unbind().bind("click",function(){
//        var oThisSelColorPanel=this;
//        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
//            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
//            Me.SeriesColorChanged(Agi.Controls.ControlColorApply.fColorControlValueGet($(oThisSelColorPanel)));
//            oThisSelColorPanel=null;
//        });
//    });

    $("#BsicChartSeriesLineSave").die("click");
    $("#BsicChartSeriesLineSave").live("click",function(ev){
        var _SeriesData={
            Name:"",
            SeriesExData:null
        };
        _SeriesData.Name = $("#TxtProPanelLineName").val(); //Series 名称
        //20130531 倪飘 解决bug，瀑布图控件中修改曲线名称为空以后点击保存，应该弹出"曲线名称不可为空！"的提示框
        if (_SeriesData.Name != null && _SeriesData.Name != "") {
        _SeriesData.SeriesExData=Agi.Controls.WaterfallChart.SeriesExDefaultDataInfo("#058DC7",null);//基本信息
        _SeriesData.SeriesExData.dataLabels.enabled=Agi.Controls.WaterfallChart.BolTrue_False($("#WaterChartLine_Lable").val());//是否禁用dataLabels
        _SeriesData.SeriesExData.Tips.enabled=Agi.Controls.WaterfallChart.BolTrue_False($("#WaterChartLine_Tips").val());//是否禁用Tips

        var _ChartOptions = Me.Get("ChartOptions");
        _ChartOptions.SeriesExtData.SeriesColor = Agi.Controls.ControlColorApply.fColorControlValueGet("BsicChartLineColorSel");
        _ChartOptions.SeriesExtData.UpColor=Agi.Controls.ControlColorApply.fColorControlValueGet("WtflChart_SeriesUpcolor");
        _ChartOptions.SeriesExtData.SeriesStatistical.Title=$("#WtflChart_StaticlText").val();
        _ChartOptions.SeriesExtData.SeriesStatistical.Color=Agi.Controls.ControlColorApply.fColorControlValueGet("WtflChart_StaticlColor");
        _ChartOptions.SeriesExtData.SeriesTotal.Title=$("#WtflChart_TolText").val();
        _ChartOptions.SeriesExtData.SeriesTotal.Color=Agi.Controls.ControlColorApply.fColorControlValueGet("WtflChart_TolColor");

        Me.SeriesExtDataChanged(_SeriesData); //所选Series的扩展属性，和名称更改
         }else{
            AgiCommonDialogBox.Alert("曲线名称不可为空!");
        }
    });

    var _ChartOptions=Me.Get("ChartOptions");
    $("#WaterChart_bgvalue").unbind().bind("click",function(){
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
    /*7.4 背景属性初始化赋值、选中*/
    if( _ChartOptions.chart.backgroundColor!=null){
        var ThisChartbgvalue=Agi.Controls.WaterfallChart.BackgroundValueGet(_ChartOptions);
        $("#WaterChart_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项

        if(_ChartOptions.xAxis.gridLineWidth!=null){
            $("#WaterChart_XGridLineSize").val(parseInt(_ChartOptions.xAxis.gridLineWidth));//水平网格线宽度
        }
        if(_ChartOptions.xAxis.gridLineColor!=null && _ChartOptions.xAxis.gridLineColor!=""){
        }else{
            _ChartOptions.xAxis.gridLineColor="#737272";
        }
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_XGridLineColor",_ChartOptions.xAxis.gridLineColor,false);//水平网格线颜色

        if(_ChartOptions.yAxis.gridLineWidth!=null){
            $("#WaterChart_YGridLineSize").val(parseInt(_ChartOptions.yAxis.gridLineWidth));//水平网格线宽度
        }
        if(_ChartOptions.yAxis.gridLineColor!=null){
            Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_YGridLineColor",_ChartOptions.yAxis.gridLineColor,false);
        }

    }else{
        var ThisChartbgvalue=Agi.Controls.WaterfallChart.BackgroundValueGet(_ChartOptions);
        $("#WaterChart_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项
    }

    /*7.5 XAsix 属性面板初始化赋值、选中*/
    if(_ChartOptions.xAxis.labels.style.fontFamily!=null){
        $("#WaterChart_XAxisFontSty").find("option[value='"+_ChartOptions.xAxis.labels.style.fontFamily+"']").attr("selected","selected");
    }
    if(_ChartOptions.xAxis.labels.style.fontWeight!=null){
        $("#WaterChart_XAxisFontWeight").find("option[value='"+_ChartOptions.xAxis.labels.style.fontWeight+"']").attr("selected","selected");
    }
    if(_ChartOptions.xAxis.labels.style.fontSize!=null){
        $("#WaterChart_XAxisFontSize").val(_ChartOptions.xAxis.labels.style.fontSize);//字体大小
    }
    if(_ChartOptions.xAxis.labels.style.color!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_XAxisFontColor",_ChartOptions.xAxis.labels.style.color,false);
    }
    if(_ChartOptions.xAxis.lineWidth!=null){
        $("#WaterChart_XAxisLineSize").val(_ChartOptions.xAxis.lineWidth);//线条大小
    }
    if(_ChartOptions.xAxis.tickLength!=null){
        $("#WaterChart_XAxisLineTicklength").val(_ChartOptions.xAxis.tickLength);//刻度长度
    }
    if(_ChartOptions.xAxis.tickWidth!=null){
        $("#WaterChart_XAxisLineTickWidth").val(_ChartOptions.xAxis.tickWidth);//刻度宽度
    }
    if(_ChartOptions.xAxis.tickColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_XAxisLineTickcolor",_ChartOptions.xAxis.tickColor,false);//刻度颜色
    }else{
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_XAxisLineTickcolor","#000000",false);//刻度颜色
    }
    if(_ChartOptions.xAxis.tickPosition!=null){
        $("#WaterChart_XAxisLineTickPosition").find("option[value='"+_ChartOptions.xAxis.tickPosition+"']").attr("selected","selected");
    }
    if(_ChartOptions.xAxis.lineColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_XAxisLineColor",_ChartOptions.xAxis.lineColor,false);//线条颜色
    }
    if(_ChartOptions.xAxis.labels.enabled!=null){
        $("#WaterChartXAxis").find("option[value='"+_ChartOptions.xAxis.labels.enabled+"']").attr("selected","selected");
    }else{
        $("#WaterChartXAxis").find("option[value='true']").attr("selected","selected");
    }

    /*7.6 YAsix 属性面板初始化赋值、选中*/
    if(_ChartOptions.yAxis.labels.style.fontFamily!=null){
        $("#WaterChart_YAxisFontSty").find("option[value='"+_ChartOptions.yAxis.labels.style.fontFamily+"']").attr("selected","selected");
    }
    if(_ChartOptions.yAxis.labels.style.fontWeight!=null){
        $("#WaterChart_YAxisFontWeight").find("option[value='"+_ChartOptions.yAxis.labels.style.fontWeight+"']").attr("selected","selected");
    }
    if(_ChartOptions.yAxis.labels.style.fontSize!=null){
        $("#WaterChart_YAxisFontSize").val(_ChartOptions.yAxis.labels.style.fontSize);//字体大小
    }
    if(_ChartOptions.yAxis.labels.style.color!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_YAxisFontColor",_ChartOptions.yAxis.labels.style.color,false);
    }
    if(_ChartOptions.yAxis.lineWidth!=null){
        $("#WaterChart_YAxisLineSize").val(_ChartOptions.yAxis.lineWidth);//线条大小
    }
    if(_ChartOptions.yAxis.tickLength!=null){
        $("#WaterChart_YAxisLineTicklength").val(_ChartOptions.yAxis.tickLength);//刻度长度
    }else{
        //20130529 13:50 markeluo
        $("#WaterChart_YAxisLineTicklength").val(4);//默认刻度长度
    }
    if(_ChartOptions.yAxis.tickWidth!=null){
        $("#WaterChart_YAxisLineTickWidth").val(_ChartOptions.yAxis.tickWidth);//刻度宽度
    }
    if(_ChartOptions.yAxis.tickColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_YAxisLineTickcolor",_ChartOptions.yAxis.tickColor,false);//刻度颜色
    }else{
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_YAxisLineTickcolor","#000000",false);//刻度颜色
    }
    if(_ChartOptions.yAxis.tickPosition!=null){
        $("#WaterChart_YAxisLineTickPosition").find("option[value='"+_ChartOptions.yAxis.tickPosition+"']").attr("selected","selected");
    }
    if(_ChartOptions.yAxis.lineColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_YAxisLineColor",_ChartOptions.yAxis.lineColor,false);//线条颜色
    }
    if(_ChartOptions.yAxis.labels.enabled!=null){
        $("#WaterChartYAxis").find("option[value='"+_ChartOptions.yAxis.labels.enabled+"']").attr("selected","selected");
    }else{
        $("#WaterChartYAxis").find("option[value='true']").attr("selected","selected");
    }

    if(_ChartOptions.SeriesExtData!=null && _ChartOptions.SeriesExtData.UpColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WtflChart_SeriesUpcolor",_ChartOptions.SeriesExtData.UpColor,false);//增长颜色
    }else{
        Agi.Controls.ControlColorApply.fColorControlValueSet("WtflChart_SeriesUpcolor","#8bbc21",false);//增长颜色
    }
    if(_ChartOptions.SeriesExtData!=null && _ChartOptions.SeriesExtData.SeriesStatistical.Color!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WtflChart_StaticlColor",_ChartOptions.SeriesExtData.SeriesStatistical.Color,false);//增长颜色
    }else{
        Agi.Controls.ControlColorApply.fColorControlValueSet("WtflChart_StaticlColor","#000000",false);//增长颜色
    }
    if(_ChartOptions.SeriesExtData!=null && _ChartOptions.SeriesExtData.SeriesStatistical.Title!=null){
        $("#WtflChart_StaticlText").val(_ChartOptions.SeriesExtData.SeriesStatistical.Title);
    }else{
        $("#WtflChart_StaticlText").val("增长统计");
    }
    if(_ChartOptions.SeriesExtData!=null && _ChartOptions.SeriesExtData.SeriesTotal.Color!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("WtflChart_TolColor",_ChartOptions.SeriesExtData.SeriesTotal.Color,false);//增长颜色
    }else{
        Agi.Controls.ControlColorApply.fColorControlValueSet("WtflChart_TolColor","#000000",false);//增长颜色
    }
    if(_ChartOptions.SeriesExtData!=null && _ChartOptions.SeriesExtData.SeriesTotal.Title!=null){
        $("#WtflChart_TolText").val(_ChartOptions.SeriesExtData.SeriesTotal.Title);
    }else{
        $("#WtflChart_TolText").val("合计");
    }

    /*7.7 背景设置保存*/
    $("#WaterChart_BackgroundSave").unbind().bind("click",function(ev){
        var color=$("#WaterChart_bgvalue").data('colorValue');
        var BgColorValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
        var BackgroudObj={
            BolIsTransfor:BgColorValue.BolIsTransfor,//是否透明
            StartColor:BgColorValue.StartColor,//开始颜色
            EndColor:BgColorValue.EndColor,//结束颜色
            GradualChangeType:BgColorValue.GradualChangeType,//渐变方式
            XgridLineWidth:$("#WaterChart_XGridLineSize").val(),//水平网格线宽度
            XgridLineColor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_XGridLineColor"),//水平网格线颜色
            YgridLineWidth:$("#WaterChart_YGridLineSize").val(),//垂直网格线宽度
            YgridLineColor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_YGridLineColor")//垂直网格线颜色
        }
        Agi.Controls.WaterfallChart.BackgroundApply(Me,BackgroudObj);//背景应用
    });
    /*7.8 XAsix 设置保存*/
    $("#WaterChart_XAxisSave").unbind().bind("click",function(ev){
        var XAsixObj={
            XAsixIsEnable:$("#WaterChartXAxis").val(),//是否启用
            XAsixfontfamily:$("#WaterChart_XAxisFontSty").val(),//字体样式
            XAsixfontweight:$("#WaterChart_XAxisFontWeight").val(),//是否粗体
            XAsixfontsize:parseInt($("#WaterChart_XAxisFontSize").val()),//字体大小
            XAsixfontcolor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_XAxisFontColor"),//字体颜色
            XAsixLinesieze:parseInt($("#WaterChart_XAxisLineSize").val()),//线条大小
            XAsixLinecolor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_XAxisLineColor"),//线条颜色
            XAsixtickLength:parseInt($("#WaterChart_XAxisLineTicklength").val()),//刻度长度
            XAsixtickWidth:parseInt($("#WaterChart_XAxisLineTickWidth").val()),//刻度宽度
            XAsixtickColor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_XAxisLineTickcolor"),//刻度颜色
            XAsixtickPosition:$("#WaterChart_XAxisLineTickPosition").val()// inside,outside
        }
        Agi.Controls.WaterfallChart.XAsixApply(Me,XAsixObj);//XAsix 应用
    });
    /*7.9 YAsix 设置保存*/
    $("#WaterChart_YAxisSave").unbind().bind("click",function(ev){
        var YAsixObj={
            YAsixIsEnable:$("#WaterChartYAxis").val(),//是否启用
            YAsixfontfamily:$("#WaterChart_YAxisFontSty").val(),//字体样式
            YAsixfontweight:$("#WaterChart_YAxisFontWeight").val(),//是否粗体
            YAsixfontsize:parseInt($("#WaterChart_YAxisFontSize").val()),//字体大小
            YAsixfontcolor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_YAxisFontColor"),//字体颜色
            YAsixLinesieze:parseInt($("#WaterChart_YAxisLineSize").val()),//线条大小
            YAsixLinecolor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_YAxisLineColor"),//线条颜色
            YAsixtickLength:parseInt($("#WaterChart_YAxisLineTicklength").val()),//刻度长度
            YAsixtickWidth:parseInt($("#WaterChart_YAxisLineTickWidth").val()),//刻度宽度
            YAsixtickColor:Agi.Controls.ControlColorApply.fColorControlValueGet("WaterChart_YAxisLineTickcolor"),//刻度颜色
            YAsixtickPosition:$("#WaterChart_YAxisLineTickPosition").val()// inside,outside
        }
        Agi.Controls.WaterfallChart.YAsixApply(Me,YAsixObj);//YAsix 应用
    });

    //endregion

    Agi.Controls.WaterfallChartSeriesSelected(Me,ThisChartData[0].name);//显示第一个Series 信息
}
//endregion

//添加新Series时，新建一个Series名称
Agi.Controls.WaterfallChartNewSeriesName=function(_ChartDataArray){
    var newWaterChartSeriesName="";
    if(_ChartDataArray!=null && _ChartDataArray.length>0){
        var SeriesNamesArray=[];
        for(var i=0;i<_ChartDataArray.length;i++){
            SeriesNamesArray.push(_ChartDataArray[i].name);
        }
        newWaterChartSeriesName=Agi.Controls.WaterfallChartSeriesNameCreate(SeriesNamesArray);
        SeriesNamesArray=null;
        maxIndex=null;
    }else{
        newWaterChartSeriesName="Series0";
    }
    return newWaterChartSeriesName;
}
//创建一个可用的名称
Agi.Controls.WaterfallChartSeriesNameCreate=function(_Names){
    var newWaterChartSeriesName="";
    if(_Names!=null && _Names.length>0){
        var StartIndex=-1;
        var MaxIndex=-1;
        for(var i=0;i<_Names.length;i++){
            StartIndex=_Names[i].indexOf("Series");
            if(StartIndex>-1){
                var _ThisNumber=_Names[i].substring((StartIndex+6));
                if(!isNaN(_ThisNumber)){
                    if(eval(_ThisNumber)>MaxIndex){
                        MaxIndex=eval(_ThisNumber);
                    }
                }
            }
        }
        newWaterChartSeriesName="Series"+(MaxIndex+1);
        StartIndex=MaxIndex=null;
    }else{
        newWaterChartSeriesName="Series0";
    }
    return newWaterChartSeriesName;
}

//显示Series面板
Agi.Controls.WaterfallChartShowSeriesPanel=function(_WaterChart){
    //7.显示Series面板
    var ControlEditPanelID=_WaterChart.Get("HTMLElement").id;
    var ChartSeriesPanel=null;
    if($("#menuBasichartseriesdiv").length>0){
        $("#menuBasichartseriesdiv").remove();
    }
    ChartSeriesPanel=$("<div id='menuBasichartseriesdiv' class='WaterfallChartSeriesmenudivsty'></div>");
    ChartSeriesPanel.appendTo($("#"+ControlEditPanelID));
    ChartSeriesPanel.html("");
    var ThisChartObj=_WaterChart.Get("ProPerty").BasciObj;

    if (ThisChartObj.series != null && ThisChartObj.series.length > 0) {
        for (var i = 0; i < ThisChartObj.series.length; i++) {
            $("#menuBasichartseriesdiv").append("<div class='WaterfallChartSerieslablesty'>" +
                "<div style='width:10px; height:10px; line-height: 30px; background-color:" + ThisChartObj.series[i].color + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                "<div class='WaterfallChartSeriesname' id='Sel" + ThisChartObj.series[i].name + "' title='"+ThisChartObj.series[i].name+"'>"
                + ThisChartObj.series[i].name + "</div>" +
                "<div class='BubbleseriesImgsty' id='remove" + ThisChartObj.series[i].name + "'></div>" +
                "<div class='clearfloat'></div></div>");
        }
        $("#menuBasichartseriesdiv").append("<div style='clear:both;'></div>");
        $("#menuBasichartseriesdiv").css("left",($("#"+ControlEditPanelID).width()-120)+"px");
        $("#menuBasichartseriesdiv").css("top","10px");
    }
    $(".WaterfallChartSeriesname").die("click");
    $(".BubbleseriesImgsty").die("click");

    $(".WaterfallChartSeriesname").live("click",function(ev){
        var _obj=this;
        var hideseriesname = _obj.id.substring(_obj.id.indexOf("Sel") + 3);
        if (ThisChartObj.series != null && ThisChartObj.series.length > 0) {
            var SelSeries=null;
            for (var i = 0; i < ThisChartObj.series.length; i++) {
                if (ThisChartObj.series[i].name == hideseriesname) {
                    SelSeries=ThisChartObj.series[i];
                    break;
                }
            }
            Agi.Controls.WaterfallChartSeriesSelected(_WaterChart,SelSeries.name);//Series选中
        }
    })
    $(".BubbleseriesImgsty").live("click",function(ev){
        var _obj=this;
        var removeseriesname = _obj.id.substr(_obj.id.indexOf("remove") + 6, _obj.id.length - 6);
        $(_obj).parent().remove();
        _WaterChart.RemoveSeries(removeseriesname);/*移除线条*/
    })
}

//Chart Series 选中
Agi.Controls.WaterfallChartSelSeriesName=null;
Agi.Controls.WaterfallChartSeriesSelected=function(_WaterChart,_SeriesName){
    $("#TxtProPanelLineName").val(_SeriesName);//SeriesName
    var ThisSeriesData=_WaterChart.Get("ChartData");//ChartData
    var ThisSelSeriesIndex=-1;
    for(var i=0;i<ThisSeriesData.length;i++){
        if(ThisSeriesData[i].name===_SeriesName){
            ThisSelSeriesIndex=i;
            break;
        }
    }
    if(ThisSelSeriesIndex>-1){
        Agi.Controls.WaterfallChartSelSeriesName=ThisSeriesData[ThisSelSeriesIndex].name;
        //选中Series 相关属性显示
        Agi.Controls.ControlColorApply.fColorControlValueSet("BsicChartLineColorSel",ThisSeriesData[ThisSelSeriesIndex].color,false);
        $("#WaterChartLine_Tips").find("option[value='"+Agi.Controls.WaterfallChart.BolTrue_FalseTostring(ThisSeriesData[ThisSelSeriesIndex].ExtData.Tips.enabled)+"']").attr("selected","selected");
        $("#WaterChartLine_Lable").find("option[value='"+Agi.Controls.WaterfallChart.BolTrue_FalseTostring(ThisSeriesData[ThisSelSeriesIndex].ExtData.dataLabels.enabled)+"']").attr("selected","selected");
    }
}

/*Chart 基准线相关处理-------------------------------------------------------------------*/
Namespace.register("Agi.Controls.WaterfallChart");/*添加 Agi.Controls.WaterfallChart命名空间*/
/*根据基准线格式化图表线条数据*/
/*
 * _ChartSeriesData,对象，元素包含属性{name,data:数组，元素为对象，包含属性：{name,x,y},type,color,Entity,XColumn,YColumn}
 * _ChartStandLines,数组，元素包含属性：{LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips}
 * */
Agi.Controls.WaterfallChart.GetStandLineDataArray=function(_ChartSeriesData,_ChartStandLines,_SeriesExtData){
    var  ReturnData=_ChartSeriesData.data;
    if(_ChartStandLines!=null && _ChartStandLines.length>0){
        for(var i=0;i<_ChartStandLines.length;i++){
            ReturnData=Agi.Controls.WaterfallChart.GetChartSeriesDataBy_Standardline(_ChartSeriesData,_ChartStandLines[i].LineValue,{Type:_ChartSeriesData.type,Color:_ChartSeriesData.color},_ChartStandLines,_SeriesExtData);
        }
    }else{
        ReturnData=Agi.Controls.WaterfallChart.GetChartSeriesDataBy_Standardline(_ChartSeriesData,null,{Type:_ChartSeriesData.type,Color:_ChartSeriesData.color},_ChartStandLines,_SeriesExtData);
    }
    return ReturnData;
}
/*-------基准线拖动更改点颜色---------*/
/*更改点的颜色*/
Agi.Controls.WaterfallChart.GetChartSeriesDataBy_Standardline=function(_ChartSeriesData,StanrdValue,_ChartTypePar,_StandardLines,_SeriesExtData){
    var  ReturnData=[];
    var _ChartDataArray=_ChartSeriesData.data;
    if(_ChartDataArray!=null && _ChartDataArray.length>0){
        var bolIsAddTols=false;
        for(var i=0;i<_ChartDataArray.length;i++){
            if(_ChartDataArray[i].isIntermediateSum){
                bolIsAddTols=true;
                _ChartDataArray[i].name=_SeriesExtData.SeriesStatistical.Title;
                _ChartDataArray[i].color=_SeriesExtData.SeriesStatistical.Color;
            }
            if(_ChartDataArray[i].isSum){
                bolIsAddTols=true;
                _ChartDataArray[i].name=_SeriesExtData.SeriesTotal.Title;
                _ChartDataArray[i].color=_SeriesExtData.SeriesTotal.Color;
            }
        }
       if(!bolIsAddTols){
           for(var i=0;i<_ChartDataArray.length;i++){
               if(_ChartDataArray[i].y<0){
                   if(!bolIsAddTols){
                       if(i!=0){
                           ReturnData.push({name:_SeriesExtData.SeriesStatistical.Title,
                               isIntermediateSum: true,
                               color:_SeriesExtData.SeriesStatistical.Color});
                       }
                       bolIsAddTols=true;
                   }

               }
               ReturnData.push({name:_ChartDataArray[i].name,y:_ChartDataArray[i].y});
           }
           ReturnData.push({ name:_SeriesExtData.SeriesTotal.Title,
               isSum: true,
               color:_SeriesExtData.SeriesTotal.Color});
       }else{
           ReturnData=_ChartDataArray;
       }
    }
    return ReturnData;
}
/*判断值是否符合条件*/
Agi.Controls.WaterfallChart.GetMarkrSty=function(_Value,_CompareValue,_StandardLines,_ExData,_chartype){
    var MarkerFillColor=Agi.Controls.WaterfallChart.GetPointColorByStandardLinds(_StandardLines,_Value);
    if(MarkerFillColor!=null && MarkerFillColor!=""){
        var thismarkerdata=Agi.Controls.WaterfallChart.SeriesExDefaultDataCopy(_ExData)
        if(_chartype.Type==="pie"){
            thismarkerdata.Marker.fillColor="";
        }else{
            thismarkerdata.Marker.fillColor=MarkerFillColor;
        }
        return thismarkerdata.Marker;
    }else{
        if(_chartype.Type==="pie"){
            _ExData.Marker.fillColor="";
        }else{
            _ExData.Marker.fillColor={
                radialGradient: { cx: 0.4, cy: 0.3, r: 0.7},
                stops: [
                    [0, 'rgba(255,255,255,0.5)'],
                    [1,_chartype.Color]
                ]
            }
        }
        return _ExData.Marker;
    }
}
//获取柱状图点的样式
Agi.Controls.WaterfallChart.GetColumnSty=function(_Value,_CompareValue,_OldColor,_StandardLines){
    var ColumnColor=Agi.Controls.WaterfallChart.GetPointColorByStandardLinds(_StandardLines,_Value);
    if(ColumnColor!=null && ColumnColor!=""){
        return ColumnColor;
    }else{
        return _OldColor;
    }
}
//获取点的颜色，根据基准线
Agi.Controls.WaterfallChart.GetPointColorByStandardLinds=function(_StandardLines,_PointValue){
    /*_StandardLines:包含元素 LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips*/
    var MaxValue=-1;
    var LineColor="";

    if(_StandardLines!=null && _StandardLines.length>0 && _PointValue!=null){
        for(var i=0;i<_StandardLines.length;i++){
            if(_PointValue>=_StandardLines[i].LineValue){
                if(_StandardLines[i].LineValue>=MaxValue){
                    MaxValue=_StandardLines[i].LineValue;
                    LineColor=_StandardLines[i].LineColor;
                }
            }
        }
    }
    return LineColor;
}
//是否开始拖拽基准线
Agi.Controls.WaterfallChart.IsStartDragStandLine=false;
/*基准线拖拽开始事件添加*/
Agi.Controls.WaterfallChart.BindStandardLineStartEndEvent=function(_Element){
    if ("createTouch" in document) {
        $(_Element).bind("touchstart",function(){
            Agi.Controls.WaterfallChart.IsStartDragStandLine=true;
        });
        $(_Element).bind("touchend",function(){
            Agi.Controls.WaterfallChart.IsStartDragStandLine=false;
        });
    }else{

        $(_Element).bind("mousedown",function(){
            Agi.Controls.WaterfallChart.IsStartDragStandLine=true;
        });
        $(_Element).bind("mouseup",function(){
            Agi.Controls.WaterfallChart.IsStartDragStandLine=false;
        });
    }
}
/*显示基准线菜单*/
Agi.Controls.WaterfallChart.ShowStandardLineMenu=function(_WaterChart){
    //7.显示StandardLine面板
    if($("#BasichartStandardLinemenudiv").length>0){
        $("#BasichartStandardLinemenudiv").remove();
    }
    if(Agi.Controls.IsControlEdit){
        var ControlEditPanelID=_WaterChart.Get("HTMLElement").id;
        var ChartStandardLineMenuPanel=null;

        ChartStandardLineMenuPanel=$("<div id='BasichartStandardLinemenudiv' class='BschartStandardLinemenudivsty'></div>");
        ChartStandardLineMenuPanel.appendTo($("#"+ControlEditPanelID));
        ChartStandardLineMenuPanel.html("");
        var ThisChartProPerty=_WaterChart.Get("ProPerty");
        var NewChartStandardLines=_WaterChart.Get("StandardLines");//获取图表的基准线信息
        if (NewChartStandardLines != null && NewChartStandardLines.length > 0) {
            for (var i = 0; i < NewChartStandardLines.length; i++) {
                $("#BasichartStandardLinemenudiv").append("<div class='BschartStandardLinelablesty'>" +
                    "<div style='width:10px; height:10px; line-height: 30px; background-color:" + NewChartStandardLines[i].LineColor + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                    "<div class='BschartStandardLinename'>"
                    + NewChartStandardLines[i].LineTooTips + "</div>" +
                    "<div id='"+ NewChartStandardLines[i].LineID + "' class='BschartStandardLineImgsty'></div>" +
                    "<div class='clearfloat'></div></div>");
            }
            $("#BasichartStandardLinemenudiv").append("<div style='clear:both;'></div>");
            $("#BasichartStandardLinemenudiv").css("left","10px");
            $("#BasichartStandardLinemenudiv").css("top","10px");
        }
        /*1.基准线选中*/
        $(".BschartStandardLinename").die("click");
        $(".BschartStandardLinename").live("click",function(ev){
            Agi.Controls.WaterfallChart.StandardLineSelected(_WaterChart,this.innerText);//相应基准线已选中
        })
        /*2.移除基准线 */
        $(".BschartStandardLineImgsty").die("click");
        $(".BschartStandardLineImgsty").live("click",function(ev){
            var _obj=this;
            var removestandartlineID = _obj.id;
            $(_obj).parent().remove();
            _WaterChart.RemoveStandardLine(removestandartlineID);
        })
    }

};
/*Chart 基准线选中*/
Agi.Controls.WaterfallChart.StandardLineSelected=function(_WaterChart,_StandardLineName){
    var chartStandLines=_WaterChart.Get("StandardLines");//获取图表的基准线信息
    if(chartStandLines!=null && chartStandLines.length>0){
        var SelLineInfo=null;
        for(var i=0;i<chartStandLines.length;i++){
            if(chartStandLines[i].LineTooTips===_StandardLineName){
                SelLineInfo=chartStandLines[i];
                break;
            }
        }
        if(SelLineInfo){
            $("#TxtProPanelStandLineName").val(SelLineInfo.LineTooTips);
            $("#WaterChart_standardline_type").find("option[value='"+SelLineInfo.LineType+"']").attr("selected","selected");
//            $("#WaterChart_standardline_color").spectrum("set",SelLineInfo.LineColor);
            Agi.Controls.ControlColorApply.fColorControlValueSet("WaterChart_standardline_color",SelLineInfo.LineColor,false);//赋值默认颜色
            $("#WaterChart_standardline_size").val(SelLineInfo.LineSize);
            $("#WaterChart_standardline_dir").find("option[value='"+SelLineInfo.LineDir+"']").attr("selected","selected");
            $("#WaterChart_standardline_value").val(SelLineInfo.LineValue);

//            LineType:$("#basicchart_standardline_type option:selected").val(),
//                LineColor:$("#basicchart_standardline_color").val(),
//                LineSize:$("#basicchart_standardline_size").val(),
//                LineDir:$("#basicchart_standardline_dir option:selected").val(),
//                LineValue:parseInt($("#basicchart_standardline_value").val()),
//                LineTooTips:thisChartLineName
        }
    }
}
/*-----------------------------------基准线处理end---------------------------------------*/

/*-----------------------------Series 线条处理-------------------*/
Agi.Controls.WaterfallChart.SeriesExDefaultDataInfo=function(_defaultColor,_ChartTips){
    var NewChartTpis=null;
    if(_ChartTips!=null && _ChartTips.enabled!=null){
        NewChartTpis={enabled:_ChartTips.enabled};
    }else{
        NewChartTpis={enabled:false};
    }
    return {
        dataLabels:{
            enabled:false
        },
        Tips:NewChartTpis,
        Marker:{
            enabled:false,
            fillColor:_defaultColor,
            lineColor:"",
            lineWidth:0,
            radius:3,
            symbol:"circle"
        }
    };
}
Agi.Controls.WaterfallChart.SeriesExDefaultDataCopy=function(_OldData){
    var thisNewData=Agi.Controls.WaterfallChart.SeriesExDefaultDataInfo(_OldData.Marker.fillColor,null);
    thisNewData.dataLabels.enabled=_OldData.dataLabels.enabled;
    thisNewData.Tips.enabled=_OldData.Tips.enabled;
    thisNewData.Marker.enabled=_OldData.Marker.enabled;
    thisNewData.Marker.lineColor=_OldData.Marker.lineColor;
    thisNewData.Marker.lineWidth=_OldData.Marker.lineWidth;
    thisNewData.Marker.radius=_OldData.Marker.radius;
    thisNewData.Marker.symbol=_OldData.Marker.symbol;
    return thisNewData;
}
Agi.Controls.WaterfallChart.BolTrue_False=function(_strbolvalue){
    if(_strbolvalue==="true"){
        return true;
    }else{
        return false;
    }
}
Agi.Controls.WaterfallChart.BolTrue_FalseTostring=function(_bolvalue){
    if(_bolvalue){
        return "true";
    }else{
        return "false";
    }
}
/*更改控件类型处理
 *_ControlObj:图表对象
 *_ChartData:图表数据
 * _index：Series 索引
 * ,_thistype:Chart当前所选类型
 * _linetype:series 对应的类型 */
Agi.Controls.WaterfallChart.UpSeriesTypeByThisType=function(_ControlObj,_ChartData,_index,_thistype,_linetype){
    //line,column,area,stackedpercentcolumn,stackedcolumn,bar,stackedbar,stackedpercentbar
    if(_ChartData!=null && _ChartData.length>0 && _index>-1){
        if(_thistype==="line" || _thistype==="column"  || _thistype==="area" || _thistype==="pie" || _thistype==="stackedpercentcolumn" || _thistype==="stackedcolumn"){
            var bolIsbar=Agi.Controls.WaterfallChart.ThisChartIsBar(_ChartData);
            if(bolIsbar){
                for(var i=0;i<_ChartData.length;i++){
                    _ChartData[i].type=_linetype;
//                    _ChartData[i].center=null;
//                    _ChartData[i].size=null;
                }
            }else{
                if(_thistype==="stackedpercentcolumn" || _thistype==="stackedcolumn" ){
                    for(var i=0;i<_ChartData.length;i++){
                        _ChartData[i].type="column";
//                        _ChartData[i].center=null;
//                        _ChartData[i].size=null;
                    }
                }else{
                    if(_thistype==="pie"){
//                        _ChartData[_index].center=[100, 80];
//                        _ChartData[_index].size=100;
                    }else{
//                        _ChartData[_index].center=null;
//                        _ChartData[_index].size=null;
                    }
                    _ChartData[_index].type=_thistype;
                }
            }
        }else if(_thistype==="polar"){
            for(var i=0;i<_ChartData.length;i++){
                _ChartData[i].type=_linetype;
//                _ChartData[i].center=null;
//                _ChartData[i].size=null;
            }
        }else if(_thistype==="scatter"){
            _ChartData[_index].type=_linetype;
//            _ChartData[_index].center=null;
//            _ChartData[_index].size=null;
            if(_ChartData[_index].marker){
                if(_ChartData[_index].marker.enabled){}else{
                    _ChartData[_index].marker.enabled=true;
                }
            }else{
                var _SeriesData={
                    Name:null,
                    SeriesExData:null
                };
                _SeriesData.Name=_ChartData[_index].name;//Series 名称

                _SeriesData.SeriesExData=Agi.Controls.WaterfallChart.SeriesExDefaultDataInfo(_ChartData[_index].color,null);//基本信息
                _SeriesData.SeriesExData.dataLabels.enabled=_ChartData[_index].ExtData.dataLabels.enabled;//dataLabels是否可用
                _SeriesData.SeriesExData.Tips.enabled=_ChartData[_index].ExtData.Tips.enabled;//Tips是否可用
                _SeriesData.SeriesExData.Marker.enabled=true;//Marker是否可用
                $("#WaterChartLine_Markerenabled").find("option[value='true']").attr("selected","selected");//是否禁用Marker,页面选项

                _SeriesData.SeriesExData.Marker.symbol="circle";//Marker样式
                _SeriesData.SeriesExData.Marker.radius=3;//Marker大小
                _SeriesData.SeriesExData.Marker.fillColor=_ChartData[_index].color;//Marker颜色
                _ControlObj.SeriesExtDataChanged(_SeriesData);//所选Series的扩展属性，和名称更改
            }
        }else{
            for(var i=0;i<_ChartData.length;i++){
                _ChartData[i].type="bar";
//                _ChartData[i].center=null;
//                _ChartData[i].size=null;
            }
        }
    }
}//更新Series 数组的类型，根据当前type
Agi.Controls.WaterfallChart.ThisChartIsBar=function(_ChartData){
    var bolIsbar=false;
    for(var i=0;i<_ChartData.length;i++){
        if(_ChartData[i].type==="bar"){
            bolIsbar=true;
            break;
        }
    }
    return bolIsbar;
}
/*-----------------------------Series 线条处理end----------------*/
/*--------------Chart 多实体数据加载 start-------------*/
Agi.Controls.WaterfallChart.LoadALLEntityData=function(MeEntitys,thisindex,THisChartDataArray,ChartXAxisArray,_callBackFun){
    if(thisindex<MeEntitys.length){
        var THisEntity=MeEntitys[thisindex];
        //20130117 倪飘 集成共享数据源
        if (!THisEntity.IsShareEntity) {
            Agi.Utility.RequestData(THisEntity, function (d) {
                THisEntity.Data = d;
                for(var j=0;j<THisChartDataArray.length;j++){
                    if(THisChartDataArray[j].Entity.Key===THisEntity.Key){
                        THisChartDataArray[j].Entity.Data=THisEntity.Data;
                    }
                }
                if (thisindex === (MeEntitys.length - 1)) {
                    for (var i = 0; i < THisChartDataArray.length; i++) {
                        THisChartDataArray[i].data =Agi.Controls.WaterfallChart.ChartDataConvert(ChartXAxisArray,
                            Agi.Controls.WaterfallChart.DataExtract(
                                Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn, THisChartDataArray[i].ZColumn]),100));
                    }
                    _callBackFun();
                } else {
                    Agi.Controls.WaterfallChart.LoadALLEntityData(MeEntitys, (thisindex + 1), THisChartDataArray, ChartXAxisArray, _callBackFun);
                }
            });
        }
        else {
            if (thisindex === (MeEntitys.length - 1)) {
//                for (var i = 0; i < MeEntitys.length; i++) {
//                    THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(MeEntitys[i], [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]));
//                }
                for (var i = 0; i < THisChartDataArray.length; i++) {
                    THisChartDataArray[i].data = Agi.Controls.WaterfallChart.ChartDataConvert(ChartXAxisArray,
                        Agi.Controls.WaterfallChart.DataExtract(
                            Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn, THisChartDataArray[i].ZColumn]),100));
                }
                _callBackFun();
            } else {
                Agi.Controls.WaterfallChart.LoadALLEntityData(MeEntitys, (thisindex + 1), THisChartDataArray, ChartXAxisArray, _callBackFun);
            }
        }
    }
}
/*--------------Chart 多实体数据加载 end--------------------*/

/*--------------添加样式切换应用 Auth:Markeluo  时间：2012-11-04 16:50:27  NO:20121104165027-----------------*/
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _SeriesData:图表SeriesData集合
 * _ChartType:图表类型(column,line,area,polar...)
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */
Agi.Controls.WaterfallChart.OptionsAppSty=function(_SeriesData,_ChartType,_StyConfig,_Options){
    if(_StyConfig!=null){
        _Options.colors=_StyConfig.SeriesColors;
        if(_StyConfig.BackGroundfromColor==='' && _StyConfig.BackGroundendColor==''){
            _Options.chart.backgroundColor='';
        }else{
            _Options.chart.backgroundColor={
                linearGradient: [0,0,250,500],
                stops: [
                    [0,_StyConfig.BackGroundfromColor],
                    [1,_StyConfig.BackGroundendColor]
                ]
            };
        }
        if(_ChartType!="polar"){
            if(_StyConfig.XAxisLableEnable){
                _Options.xAxis.labels.enabled=true;
                _Options.xAxis.labels.rotation=_StyConfig.XAxisLableRotation;

                _Options.xAxis.labels.align=_StyConfig.XAxisLableAlign;
                _Options.xAxis.labels.style.fontFamily=_StyConfig.XAxisLableFontFamily;
                _Options.xAxis.labels.style.color=_StyConfig.XAxisLableFontColor;
                _Options.xAxis.lineColor=_StyConfig.XAxisLineColor;
                _Options.xAxis.lineWidth=_StyConfig.XAxisLineWidth;
            }else{
                _Options.xAxis.labels.enabled=false;
            }

            if(_StyConfig.YAxisLableEnable){
                _Options.yAxis.labels.enabled=true;
                _Options.yAxis.labels.rotation=_StyConfig.YAxisLableRotation;

                _Options.yAxis.labels.align=_StyConfig.YAxisLableAlign;
                _Options.yAxis.labels.style.fontFamily=_StyConfig.YAxisLableFontFamily;
                _Options.yAxis.labels.style.color=_StyConfig.YAxisLableFontColor;
                _Options.yAxis.lineColor=_StyConfig.YAxislineColor;
                _Options.yAxis.lineWidth=_StyConfig.YAxisLineWidth;
            }else{
                _Options.yAxis.labels.enabled=false;
            }
            if(_StyConfig.YAxisTitleEnable){
                _Options.yAxis.title.enabled=true;
                _Options.yAxis.title.text=_StyConfig.YAxisTitleText;
                _Options.yAxis.title.style.fontWeight=_StyConfig.YAxisTitlefontWeight;
                _Options.yAxis.title.style.fontFamily=_StyConfig.YAxisTitleFontFamily;
                _Options.yAxis.title.style.color=_StyConfig.YAxisTitlecolor;
                _Options.yAxis.title.style.fontSize=_StyConfig.YAxisTitleFontSize;

            }else{
                _Options.yAxis.title.text='';
            }
            _Options.yAxis.tickWidth=_StyConfig.YAxistickWidth;//Y轴，刻度线的宽度

        }

        if(_SeriesData!=null && _SeriesData.length>0){
            for(var i=0;i<_SeriesData.length;i++){
                _SeriesData[i].color=Agi.Controls.WaterfallChart.OptionsAppStyGetColorByIndex(i,_StyConfig.SeriesColors);
            }
        }
    }
}
//根据Series 索引获取对应的默认显示显示
Agi.Controls.WaterfallChart.OptionsAppStyGetColorByIndex=function(_index,_ColorArray){
    if(_index<_ColorArray.length){
        return _ColorArray[_index];
    }else{
        return _ColorArray[_index%_ColorArray.length];
    }
}
/*20121104165027 结束*/

/*----------201212181253 Chart 应用上雷达图和点线图 Auth:markeluo  start---------*/
/*
 *_ControlObj:控件对象
 * _ThemeName:主题名称(非样式，图表内置主题)*/
Agi.Controls.WaterfallChart.GetManagerThemeInfo=function(_ControlObj,_ThemeValue){
    var ThisChartXAxisArray=_ControlObj.Get("ChartXAxisArray");/*获取图表Chart X轴相应的显示点集合*/
    var ChartOptions=Agi.Controls.GetChartOptionsByTheme(_ThemeValue);
    if(ThisChartXAxisArray!=null && ThisChartXAxisArray.length>0){
        ChartOptions.xAxis.categories=ThisChartXAxisArray;
    }
    var thischartoptions= _ControlObj.Get("ChartOptions");
    var seriesStacking=null;
    if(thischartoptions!=null && thischartoptions.plotOptions!=null && thischartoptions.plotOptions.series.stacking!=null){
        seriesStacking=thischartoptions.plotOptions.series.stacking;
    }
    ChartOptions.plotOptions={
        area: {
            lineWidth: 1,
            marker: {
                enabled: true,
                states: {
                    hover: {
                        enabled: false,
                        radius: 5
                    }
                }
            },
            shadow: false,
            states: {
                hover: {
                    lineWidth: 1
                }
            }
        },
        column: {
            lineWidth: 0,
            borderColor: '',
            series: {
                pointPadding: '1px'
            },
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false,
                        lineWidth: 0
                    }
                }
            }
        },
        line: {
            marker: {
                enabled: true,
                states: {
                    hover: {
                        enabled: true,
                        radius: 4
                    }
                }
            }
        },
        bar: {
            lineWidth: 0,
            borderColor: '',
            series: {
                pointPadding: '1px'
            },
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: false,
                        lineWidth: 0
                    }
                }
            }
        },
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                formatter: function() {
                    return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                }
            }
        },
        series: {
            marker: {
                radius: 3
            },
            cursor: 'pointer',
            point:{
                events:{
                    click: function() {
                        _ControlObj.Set("OutPramats",{"XValue":this.name,"Yvalue":this.y});/*输出参数更改*/
                    }
                }
            },
            states: {
                hover: {
                    enabled:false
                }
            },
            stacking:seriesStacking
        }
    };
    if(thischartoptions!=null && thischartoptions.title!=null){
        ChartOptions.title=thischartoptions.title;
    }
    return ChartOptions;
}

/*应用雷达图时显示确认对话框，遮罩效果
 *_Controlobj:控件对象
 *TipInfo：提示信息
 *OkCallBackFun:点击确定按钮后的回调函数
 * */
Agi.Controls.WaterfallChart.DialogManager=function(_Controlobj,TipInfo,OkCallBackFun){
    $("#progressbar1").find(".progressBar").hide();//隐藏进度条
    var BasiChartDialogContent="<div id='WaterChartDialogPanel' class='WaterChartDialogPanelSty'>" +
        "<div class='WaterChartDialogPanelTitlesty'>"+TipInfo+"</div>"+
        "<div><div id='WaterChartDialogOK' class='btn'>确定</div><div id='WaterChartDialogCancel' class='btn'>取消</div></div>"+
        "</div>";
    $('#progressbar1').append(BasiChartDialogContent);
    $('#progressbar1').show().find(".btn").click(function(ev){
        if(this.id=="WaterChartDialogOK"){
            $("#WaterChartDialogPanel").remove();//移除确认选择对话框
            $('#progressbar1').hide();//隐藏遮罩背景
            OkCallBackFun();//执行回调
        }else{
            $("#WaterChartDialogPanel").remove();//移除确认选择对话框
            $('#progressbar1').hide();//隐藏遮罩背景
        }
    });
}
/*----------201212181253  end---------------------*/

/*----------20130107 10:06 markeluo 新增,解决拖拽多个实体至chart后删除所有series，然后再拖入一个实体导致生成多个series的错误----------------*/
/*删除Series 时，如果对应实体的Series都已删除，则将实体从当前控件中移除
 *_Controlobj:控件对象
 *_EntityKey:移除的Series用到的实体的Key
 *_THisChartDataArray:Chart Series 数组
 **/
Agi.Controls.WaterfallChart.RemoveSeriesUpEntityArray=function(_Controlobj,_EntityKey,_THisChartDataArray){
    if(_Controlobj!=null && _EntityKey!=null){
        var MeEntitys=_Controlobj.Get("Entity");//获得当前控件的实体数组
        var bolIsExt=false;//实体是否还存在应用
        if(_THisChartDataArray!=null && _THisChartDataArray.length>0){
            //判断实体是否被应用到
            for(var i=0;i<_THisChartDataArray.length;i++){
                if(_THisChartDataArray[i].Entity.Key===_EntityKey){
                    bolIsExt=true;
                    break;
                }
            }
            if(!bolIsExt){
                //判断实体是否存在
                var RemoveEntityIndex=-1;
                for(var _index=0;_index<MeEntitys.length;_index++){
                    if(MeEntitys[_index].Key===_EntityKey){
                        RemoveEntityIndex=_index;
                        break;
                    }
                }
                if(RemoveEntityIndex>-1){
                    //从控件的实体数组中，移除实体
                    MeEntitys.splice(RemoveEntityIndex,1);
                    //重新赋值控件实体
                    _Controlobj.Set("Entity",MeEntitys);

                    //更新实体数据显示
                    if(Agi.Controls.IsControlEdit){
                        Agi.Controls.ShowControlData(_Controlobj);
                    }
                }
            }
        }else{
            //清空实体
            _Controlobj.Set("Entity",[]);

            //更新实体数据显示
            if(Agi.Controls.IsControlEdit){
                Agi.Controls.ShowControlData(_Controlobj);
            }
        }
    }
}

//region 20130110 16:50 markeluo 新增，背景 XAsix YAsix 设置*/
/*背景设置*/
Agi.Controls.WaterfallChart.BackgroundApply=function(_ControlObj,_BackGroudObj){
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
    _ChartOptions.yAxis.gridLineWidth=_BackGroudObj.YgridLineWidth;//宽度
    _ChartOptions.yAxis.gridLineColor=_BackGroudObj.YgridLineColor;//颜色
//    _ChartOptions.yAxis.gridLineDashStyle=';//线条样式
    //4.重新赋值ChartOptions与样式名称
    _ControlObj.Set("ChartOptions",_ChartOptions);

    //5.控件刷新显示
    _ControlObj.Refresh();//刷新显示
}
//背景颜色值获取
Agi.Controls.WaterfallChart.BackgroundValueGet=function(_oBackgroundObj){
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
}
/*XAsix设置*/
Agi.Controls.WaterfallChart.XAsixApply=function(_ControlObj,_XAsixObj){
    //2.获取当前控件的ChartOptions属性
    var _ChartOptions=_ControlObj.Get("ChartOptions");
    if(_ControlObj!=null && _XAsixObj!=null){
        if(_XAsixObj.XAsixIsEnable==="true"){
            _ChartOptions.xAxis.labels.enabled=true;
        }else{
            _ChartOptions.xAxis.labels.enabled=false;
        }
        _ChartOptions.xAxis.labels.style.fontFamily=_XAsixObj.XAsixfontfamily;
        _ChartOptions.xAxis.labels.style.color=_XAsixObj.XAsixfontcolor;
        _ChartOptions.xAxis.labels.style.fontWeight=_XAsixObj.XAsixfontweight;
        _ChartOptions.xAxis.labels.style.fontSize=_XAsixObj.XAsixfontsize;
        _ChartOptions.xAxis.lineColor=_XAsixObj.XAsixLinecolor;
        _ChartOptions.xAxis.lineWidth=_XAsixObj.XAsixLinesieze;
        _ChartOptions.xAxis.tickLength=_XAsixObj.XAsixtickLength;
        _ChartOptions.xAxis.tickWidth=_XAsixObj.XAsixtickWidth;
        _ChartOptions.xAxis.tickColor=_XAsixObj.XAsixtickColor;
        _ChartOptions.xAxis.tickPosition=_XAsixObj.XAsixtickPosition;
    }

    //4.重新赋值ChartOptions与样式名称
    _ControlObj.Set("ChartOptions",_ChartOptions);

    //5.控件刷新显示
    _ControlObj.Refresh();//刷新显示
}

/*XAsix设置*/
Agi.Controls.WaterfallChart.YAsixApply=function(_ControlObj,_YAsixObj){
    //2.获取当前控件的ChartOptions属性
    var _ChartOptions=_ControlObj.Get("ChartOptions");
    if(_ControlObj!=null && _YAsixObj!=null){
        if(_YAsixObj.YAsixIsEnable==="true"){
            _ChartOptions.yAxis.labels.enabled=true;
        }else{
            _ChartOptions.yAxis.labels.enabled=false;
        }
        _ChartOptions.yAxis.labels.style.fontFamily=_YAsixObj.YAsixfontfamily;
        _ChartOptions.yAxis.labels.style.color=_YAsixObj.YAsixfontcolor;
        _ChartOptions.yAxis.labels.style.fontWeight=_YAsixObj.YAsixfontweight;
        _ChartOptions.yAxis.labels.style.fontSize=_YAsixObj.YAsixfontsize;
        _ChartOptions.yAxis.lineColor=_YAsixObj.YAsixLinecolor;
        _ChartOptions.yAxis.lineWidth=_YAsixObj.YAsixLinesieze;
        _ChartOptions.yAxis.tickLength=_YAsixObj.YAsixtickLength;
        _ChartOptions.yAxis.tickWidth=_YAsixObj.YAsixtickWidth;
        _ChartOptions.yAxis.tickColor=_YAsixObj.YAsixtickColor;
        _ChartOptions.yAxis.tickPosition=_YAsixObj.YAsixtickPosition;
    }

    //4.重新赋值ChartOptions与样式名称
    _ControlObj.Set("ChartOptions",_ChartOptions);

    //5.控件刷新显示
    _ControlObj.Refresh();//刷新显示
}
//endregion

//region 20130325 16:31 数据处理
//获取默认示例数据
Agi.Controls.WaterfallChart.GetChartInitData=function(){
    var ThisDay = new Date();
    var ThisData = [];
    for (i = 0; i < 5; i++) {
        ThisData.push([new Date(ThisDay.valueOf() + (i * 86400000)).format("yyyy/MM/dd"), Agi.Script.GetRandomValue(60, 95)]);
    }
    for (i = 0; i < 5; i++) {
        ThisData.push([new Date(ThisDay.valueOf() + (i * 86400000)).format("yyyy/MM/dd"), Agi.Script.GetRandomValue(-55,-10)]);
    }
    return ThisData;
}
Agi.Controls.WaterfallChart.ChartDataConvert= function(_ChartXAxisArray, _DataArrary) {
    var ThisData=[];
    var aOweData=[];

    if (_DataArrary != null && _DataArrary.length > 0) {
        for (var i = 0; i < _DataArrary.length; i++) {
            if (typeof (_DataArrary[i][0]) == "number") {
                _DataArrary[i][0] = _DataArrary[i][0] + "";
            }
            if (!isNaN(_DataArrary[i][1])) {//为数字时
                _DataArrary[i][1] = eval(_DataArrary[i][1]);
            } else {//如果Y轴值不是数字类型则将其赋值为0
                _DataArrary[i][1] = 0;
            }
            if(_DataArrary[i][1]>=0){
                ThisData.push({ name:_DataArrary[i][0], x:i, y:_DataArrary[i][1]});
            }else{
                aOweData.push({ name:_DataArrary[i][0], x:i, y:_DataArrary[i][1]});
            }
        }
        if(aOweData!=null && aOweData.length>0){
            for(var i=0;i<aOweData.length;i++){
                ThisData.push(aOweData[i]);
            }
        }
//        Agi.Controls.ChartAddSeriesUpXAxis(_ChartXAxisArray, ThisData);
    }
    return ThisData;
}
//优化处理,数据量截取
Agi.Controls.WaterfallChart.DataExtract=function(_EntityDataArray,_MaxRow){
    if(_EntityDataArray!=null && _EntityDataArray.length>0){
        if(_EntityDataArray.length>_MaxRow){
            _EntityDataArray.splice(_MaxRow,(_EntityDataArray.length-_MaxRow));
        }
    }
    return _EntityDataArray;
}
//endregion