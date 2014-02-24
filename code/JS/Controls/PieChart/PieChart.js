/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 13-4-17
 * Time: 下午 5:03
 * To change this template use File | Settings | File Templates.
 * PieChart:饼图
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.PieChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
            if (!_EntityInfo.IsShareEntity) {
                Agi.Utility.RequestData(_EntityInfo, function (d) {
                    _EntityInfo.Data = d;
                    if (d != null && d.length > 0) {
                        _EntityInfo.Columns.length = 0;
                        for (var _param in d[0]) {
                            _EntityInfo.Columns.push(_param);
                        }
                    }
                    //20130531 倪飘 解决bug，饼图，拖入超过20条数据实体，无提示信息，双击进入属性编辑面板，显示20条限制提示
                    if (Agi.Edit && _EntityInfo.Data != null && _EntityInfo.Data.length > 20) {
                        AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,饼图将截取显示前20条数据！");
                    }
                    Me.IsBindNewData = false;
                    Me.AddEntity(_EntityInfo); /*添加实体*/
                });
            }
            else {
                if (_EntityInfo.Data != null && _EntityInfo.Data.length > 0) {
                    _EntityInfo.Columns.length = 0;
                    for (var _param in _EntityInfo.Data[0]) {
                        _EntityInfo.Columns.push(_param);
                    }
                }
                if (Agi.Edit && _EntityInfo.Data != null && _EntityInfo.Data.length > 20) {
                    AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,饼图将截取显示前20条数据！");
                }
                Me.AddEntity(_EntityInfo); /*添加实体*/
            }
        },
        ReadRealData: function () {
        },
        AddEntity: function (_entity) {/*添加实体*/
            if (_entity != null && _entity.Data != null) {
                var Me = this;
                var Entitys = Me.Get("Entity");
                Entitys = [_entity];
                Me.Set("Entity", Entitys);

                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                var ChartSerieslength = ThisChartObj.series.length;
                for (var i = 0; i < ChartSerieslength; i++) {
                    ThisChartObj.series[0].remove();
                }

                var THisChartDataArray = [];
                Me.Set("ChartData", THisChartDataArray);
                if (Entitys != null && Entitys.length > 0) {
                    var ChartXAxisArray = [];
                    var _ChartOptions = Me.Get("ChartOptions");
                    for (var i = 0; i < Entitys.length; i++) {
                        if (i < THisChartDataArray.length) {
                            THisChartDataArray[i].data = Agi.Controls.PieChart.ChartDataConvert(ChartXAxisArray,
                                Agi.Controls.PieChart.DataExtract(
                                    Agi.Controls.EntityDataConvertToArrayByColumns(Entitys[i], [Entitys[i].Columns[0], Entitys[i].Columns[1]]), 20));
                        } else {
                            var _Newcolor = Agi.Controls.PieChart.OptionsAppStyGetColorByIndex(i, _ChartOptions.colors);
                            THisChartDataArray.push({
                                name: Agi.Controls.PieChartNewSeriesName(THisChartDataArray),
                                data: Agi.Controls.PieChart.ChartDataConvert(ChartXAxisArray,
                                    Agi.Controls.PieChart.DataExtract(
                                        Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _entity.Columns[1]]), 20)
                                ),
                                type: "pie",
                                color: _Newcolor,
                                Entity: _entity,
                                XColumn: _entity.Columns[0],
                                YColumn: _entity.Columns[1],
                                ExtData: Agi.Controls.PieChart.SeriesExDefaultDataInfo(_Newcolor, _ChartOptions.tooltip)
                            });
                            _Newcolor = null;
                        }
                        THisChartDataArray[i].data = Agi.Controls.PieChart.GetStandLineDataArray(THisChartDataArray[i], null);
                        ThisChartObj.addSeries(THisChartDataArray[i]);
                    }
                }

                ThisChartObj.setSize(ThisChartObj.chartWidth, ThisChartObj.chartHeight);
                ThisChartObj.xAxis[0].setCategories(ChartXAxisArray);
                Me.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/

                Me.Set("Position", Me.Get("Position"));

                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.PieChartShowSeriesPanel(Me);
                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                }
            } else {
                AgiCommonDialogBox.Alert("您添加的实体无数据！");
            }
        },
        AddColumn: function (_entity, _ColumnName) {
            var Me = this;
            var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
            var ColumnIsAddedToChart = false;

            //region 20130529 9:08 饼图添加列时导致显示格式不正确问题解决
            //            for (var i = 0; i < THisChartDataArray.length; i++) {
            //                if (THisChartDataArray[i].Entity == _entity && THisChartDataArray[i].YColumn === _ColumnName) {
            //                    ColumnIsAddedToChart = true;
            //                    break;
            //                }
            //            }
            if (THisChartDataArray != null && THisChartDataArray.length > 0) {
                AgiCommonDialogBox.Alert("此图形只支持一个Series，显示数据列被替换！");

                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                var ChartSerieslength = ThisChartObj.series.length;
                for (var i = 0; i < ChartSerieslength; i++) {
                    ThisChartObj.series[0].remove();
                }
                THisChartDataArray = [];
            }
            //endregion 20130529 9:08

            if (!ColumnIsAddedToChart) {
                var ChartXAxisArray = Me.Get("ChartXAxisArray"); /*图表Chart X轴相应的显示点集合*/
                var defaultchartype = "pie";
                var _ChartOptions = Me.Get("ChartOptions");
                var _Newcolor = Agi.Controls.PieChart.OptionsAppStyGetColorByIndex(i, _ChartOptions.colors);
                THisChartDataArray.push({ name: Agi.Controls.PieChartNewSeriesName(THisChartDataArray), data: Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.PieChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _ColumnName]), 20)), type: defaultchartype, color: _Newcolor, Entity: _entity, XColumn: _entity.Columns[0], YColumn: _ColumnName,
                    ExtData: Agi.Controls.PieChart.SeriesExDefaultDataInfo(_Newcolor, _ChartOptions.tooltip)
                });
                _Newcolor = null;

                var ThisChartObj = Me.Get("ProPerty").BasciObj;
                ThisChartObj.addSeries(THisChartDataArray[THisChartDataArray.length - 1]);
                ThisChartObj.xAxis[0].setCategories(ChartXAxisArray);
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.PieChartShowSeriesPanel(Me);
                    var ChartOptions = Me.Get("ChartOptions");
                    if (ChartOptions.plotOptions.series.stacking != null) {
                        Me.Refresh();
                    }
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
                Agi.Controls.PieChart.LoadALLEntityData(MeEntitys, 0, THisChartDataArray, ChartXAxisArray, function () {
                    Me.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/
                    THisChartDataArray = Me.Get("ChartData")
                    for (var i = 0; i < THisChartDataArray.length; i++) {
                        THisChartDataArray[i].data = Agi.Controls.PieChart.GetStandLineDataArray(THisChartDataArray[i], null);
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
                THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.PieChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]), 20));
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
                Agi.Controls.PieChart.RemoveSeriesUpEntityArray(Me, EntityKey, THisChartDataArray);
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
                    Agi.Controls.PieChartShowSeriesPanel(Me);
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
            this.Set("ControlType", "PieChart");
            var ID = "PieChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PieChartPanelSty'></div>");
            HTMLElementPanel.css('padding-bottom', '0px');
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 300,
                height: 200,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:100%;margin: 0 auto">' + '</div>');
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement", this.shell.Container[0]);

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
            var ChartXAxisArray = [];
            var THisChartData = Agi.Controls.GetChartInitData();
            THisChartData = Agi.Controls.ChartDataConvert(ChartXAxisArray, THisChartData);
            var thischartSeriesData = [];
            thischartSeriesData.push({ name: "示例数据", data: THisChartData, type: "pie", color: "#058DC7", Entity: null, XColumn: "", YColumn: "", ZColumn: "",
                ExtData: Agi.Controls.PieChart.SeriesExDefaultDataInfo("#058DC7", null)
            });

            thischartSeriesData[0].data = Agi.Controls.PieChart.GetStandLineDataArray(thischartSeriesData[0], null); //更新数据信息
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
            this.Set("ChartType", "pie"); //Chart 图表类型
            this.Set("ThemeInfo", "darkbrown");

            //20130515 倪飘 解决bug，组态环境中拖入饼图以后拖入容器框控件，容器框控件会覆盖饼图控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        }, /*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
        CustomProPanelShow: function () {
            Agi.Controls.PieChartProrityInit(this);
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
//                var Newdropdownlist = new Agi.Controls.PieChart();
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
                var ParentObj = $('#BottomRightCenterContentDiv'); ;
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
                Agi.Controls.PieChartShowSeriesPanel(Me);
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
            //20130409 倪飘 解决bug，气泡图控件进行参数联动的时候，超过20条的数据在截取前200条数据时候没有弹出提示框
            //20130530 倪飘 解决bug，饼图控件被联动，数据超过20条时候弹出信息提示框不准确
            if (Agi.Edit && Me.IsBindNewData && thischartSeriesData[0].data != null && thischartSeriesData[0].data.length >= 20) {
                AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,饼图将截取显示前20条数据！");
            }
            //20130531 倪飘 解决bug，饼图，拖入超过20条数据实体，无提示信息，双击进入属性编辑面板，显示20条限制提示
            Me.IsBindNewData = true;
            var ChartInitOption = {
                //                colors:ChartOptions.colors,
                colors: Agi.Controls.PieChart.ApplyGradientfillColor(ChartOptions.colors), //应用渐变
                chart: {
                    renderTo: MePrority.ID,
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
            ChartInitOption.xAxis.labels.rotation = 30;
            ChartInitOption.xAxis.labels.align = "left";
            ChartInitOption.tooltip.formatter = function () { return '<span style="color:' + this.point.color + '">' + this.point.name + ':(' + Math.round(this.percentage) + '%)</span>' };

            var BaseControlObj = new Highcharts.Chart(ChartInitOption);
            MePrority.BasciObj = BaseControlObj;

            //2.如果是非编辑界面则为控件添加外壳样式 让其可拖动位置、更改大小
            if (!Agi.Controls.IsControlEdit) {
                $("#" + HtmlElementID).addClass("PanelSty");
            }
            //3.控件重新定位
            Me.Set("Position", Me.Get("Position"));

            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.PieChartShowSeriesPanel(Me);
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
            Agi.Controls.PieChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var Me = this;
            var ProPerty = this.Get("ProPerty");
            var PieChartControl = {
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

            PieChartControl.Control.ControlType = Me.Get("ControlType"); /*控件类型*/
            PieChartControl.Control.ControlID = ProPerty.ID; /*控件属性*/
            PieChartControl.Control.ControlBaseObj = ProPerty.ID; /*控件基础对象*/
            PieChartControl.Control.HTMLElement = Me.Get("HTMLElement").id; /*控件外壳ID*/

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
            PieChartControl.Control.SeriesData = SeriesList; /*控件实体*/
            SeriesList = null;
            PieChartControl.Control.Position = Me.Get("Position"); /*控件位置信息*/
            PieChartControl.Control.ChartOptions = Me.Get("ChartOptions"); /*Chart Options信息*/
            PieChartControl.Control.StandardLines = Me.Get("StandardLines"); /*Chart StandardLines*/
            PieChartControl.Control.ChartThemeName = Me.Get("ThemeName"); /*控件样式名称*/
            PieChartControl.Control.ChartType = Me.Get("ChartType"); //控件类型名称

            return PieChartControl.Control; //返回配置字符串
        }, //获得PieChart控件的配置信息
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
                    Me.Set("ControlType", "PieChart"); //类型
                    Me.Set("Entity", ThisEntitys); //实体
                    Me.Set("ChartData", _Config.SeriesData); //Series数据

                    _Config.ChartOptions.plotOptions.series.point.events = {
                        click: function () {
                            Me.Set("OutPramats", { "XValue": this.name, "Yvalue": this.y }); /*输出参数更改*/
                        }
                    }

                    if (_Config.ChartOptions.tooltip != null) {
                        _Config.ChartOptions.tooltip.formatter = function () { return '<span style="color:' + this.point.color + '">' + this.point.name + ':(' + Math.round(this.percentage) + '%)</span>' };
                    }
                    Agi.Controls.PieChart.ChartPlotOptionsApply(_Config.ChartOptions); //应用Chart PlotOptions 饼图格式化信息

                    Me.Set("ChartOptions", _Config.ChartOptions); //ChartOptions
                    Me.Set("StandardLines", _Config.StandardLines); //StandardLines

                    var ID = _Config.ControlID;
                    var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PieChartPanelSty'></div>");
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
            for (var i = 0; i < ThisChartObj.series.length; i++) {
                ThisChartObj.series[0].remove();
                i--;
            }
            if (MeChartData != null && MeChartData.length > 0) {
                for (var i = 0; i < MeChartData.length; i++) {
                    MeChartData[i].data = Agi.Controls.PieChart.GetStandLineDataArray(MeChartData[i], chartStandLines); /*根据基准线更新相应的点值*/
                    ThisChartObj.addSeries(MeChartData[i]);
                }
            }
        }, //重新加载Series
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
            Agi.Controls.PieChart.OptionsAppSty(Me.Get("ChartData"), Me.Get("ChartType"), ChartStyleValue, _ChartOptions);

            //4.重新赋值ChartOptions与样式名称
            Me.Set("ChartOptions", _ChartOptions);
            Me.Set("ThemeName", _themeName);

            //5.控件刷新显示
            Me.Refresh(); //刷新显示
            ChartStyleValue = null;
            /*20121104163027 结束*/
        } //更改样式
    });
/*PieChart参数更改处理方法*/
Agi.Controls.PieChartAttributeChange=function(_ControlObj,Key,_Value){
    if(Key=="Position"){
        if(layoutManagement.property.type==1){
            var ThisHTMLElementobj=$("#"+_ControlObj.Get("HTMLElement").id);
            var ThisControlObj=_ControlObj.Get("ProPerty").BasciObj;

            var ParentObj=ThisHTMLElementobj.parent();
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
            ThisControlObj.Refresh();/*Chart 更改大小*/
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
        var ChartOptions=Agi.Controls.PieChart.GetManagerThemeInfo(_ControlObj,_Value);//获得处理后的主题信息值
        _ControlObj.Set("ChartOptions",ChartOptions);
        _ControlObj.Refresh();//刷新显示
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitPieChart=function(){
    return new Agi.Controls.PieChart();
}

//region PieChart 自定义属性面板初始化显示
Agi.Controls.PieChartProrityInit=function(_PieChart){
    var Me=_PieChart;
    var ThisProItems=[];
    var _ChartOptions=Me.Get("ChartOptions");

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent=new Agi.Script.StringBuilder();

    //region 4.1.标题
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='PieChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>标题内容：</td><td colspan='3' class='prortityPanelTabletd1'><input id='PieChart_Titletxt' type='text' style='width:70%;' class='ControlProTextSty' maxlength='15' ischeck='true'><div id='PieChart_TitleSave' class='PieChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体样式：</td><td class='prortityPanelTabletd1'><select id='PieChart_TitleFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>粗体样式：</td><td class='prortityPanelTabletd1'><select id='PieChart_TitleFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd1'><input id='PieChart_TitleFontSize' type='number' value='14' defaultvalue='14' min='8' max='30'  class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd1'><div id='PieChart_TitleFontColor' class='PieChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>水平方向：</td><td class='prortityPanelTabletd1'><select id='PieChart_TitleHorDir'><option value='left'>居左</option><option value='center' selected='selected'>居中</option><option value='right'>居右</option></select></td>");
//    ItemContent.append("<td class='prortityPanelTabletd0'>垂直方向：</td><td class='prortityPanelTabletd1'><select id='PieChart_TitleVirDir'><option value='top' selected='selected'>居上</option><option value='middle'>居中</option><option value='bottom'>居下</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>垂直方向：</td><td class='prortityPanelTabletd1'><select id='PieChart_TitleVirDir'><option value='top' selected='selected'>居上</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var TitleObj=$(ItemContent.toString());
    //endregion

    //region 4.2.显示设置
    var ThisChartData=_PieChart.Get("ChartData");
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();


    var ThisChartEntitys=_PieChart.Get("Entity");
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
        ItemContent.append("<div class='PieChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>曲线：</td>");
        ItemContent.append("<td colspan='3' class='prortityPanelTabletd2'><input id='TxtProPanelLineName' type='text'  value='"+ThisChartData[0].name+"' class='ControlProTextSty' maxlength='10' ischeck='true'><div id='PieChartSeriesLineSave'  class='PieChartPropSavebuttonsty' title='保存'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>标签：</td><td class='prortityPanelTabletd1'><select id='PieChartLine_Lable'><option selected='selected' value='false'>禁用</option><option  value='true'>启用</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>标签文字大小：</td><td class='prortityPanelTabletd1'><input id='PieDatalableFontSize' type='number' value='14' defaultvalue='14' min='8' max='30'  class='ControlProNumberSty'/></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>标签颜色：</td><td class='prortityPanelTabletd1' colspan='3'><div id='PieDatalableFontColor' class='PieChart_ColorControl' style='background-color:#4a4a4a;' title='编辑'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Tips：</td><td class='prortityPanelTabletd1'><select id='PieChartLine_Tips'><option selected='selected' value='false'>禁用</option><option  value='true'>启用</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Tips文字大小：</td><td class='prortityPanelTabletd1'><input id='PieTipsFontSize' type='number' value='14' defaultvalue='14' min='8' max='30'  class='ControlProNumberSty'/></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<td class='prortityPanelTabletd1' colspan='4'>分区颜色设置：</td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd1' colspan='4'><div class='PieChart_ColorsPanel'><div class='PieChart_ColorAddColor' title='添加'></div><div class='PieChart_ColorPanelSty'><div id='PieChart_ColorsUndo' class='PieChartPropUndobuttonsty' title='撤销'></div></div></div></td></td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        DataLinesObj=$(ItemContent.toString());
    }
    //Series 扩展属性更改
    Me.SeriesExtDataChanged=function(_SeriesData){
        var ExtData=_SeriesData.SeriesExData;//Series 扩展属性信息
        var SeriesName=_SeriesData.Name;//Series 更改后名称
        var ChartSeriesData=_PieChart.Get("ChartData");
        var SeriesIndex=-1;
        if(Agi.Controls.PieChartSelSeriesName!=null && ChartSeriesData.length>0){
            for(var i=0;i<ChartSeriesData.length;i++){
                if(ChartSeriesData[i].name===Agi.Controls.PieChartSelSeriesName){
                    SeriesIndex=i;
                }
                ChartSeriesData[i].ExtData.Tips.enabled=ExtData.Tips.enabled;
                ChartSeriesData[i].ExtData.Tips.fontSize=ExtData.Tips.fontSize;
            }
        }
        if(SeriesIndex>-1){}else{
            AgiCommonDialogBox.Alert("请选中对应的Series后再试！");
            return ;
        }
        if(ChartSeriesData!=null && ChartSeriesData.length>0){
            ChartSeriesData[SeriesIndex].name=SeriesName;

            ChartSeriesData[SeriesIndex].ExtData=ExtData;
            var ChartOptions=Me.Get("ChartOptions");

            //Tooltip 格式化
            if(ChartOptions!=null){
                if(ChartOptions.tooltip==null){
                    ChartOptions.tooltip={
                        enabled:false
                    }
                }
                ChartOptions.tooltip.enabled=ExtData.Tips.enabled;
                ChartOptions.tooltip.style={
                    fontSize:ExtData.Tips.fontSize
                };
                ChartOptions.tooltip.formatter = function () {
                    ChartOptions.tooltip.formatter=function(){return  '<span style="color:'+this.point.color+'">'+this.point.name +':('+ Math.round(this.percentage) +'%)</span>'};
                }
            }

            //DataLables启用,禁用
            if(ChartSeriesData[SeriesIndex].dataLabels==null){
                ChartSeriesData[SeriesIndex].dataLabels={
                    enabled:ChartSeriesData[SeriesIndex].ExtData.dataLabels.enabled,
                    style:ChartSeriesData[SeriesIndex].ExtData.dataLabels.style
                }
            }else{
                ChartSeriesData[SeriesIndex].dataLabels.enabled=ChartSeriesData[SeriesIndex].ExtData.dataLabels.enabled;
                ChartSeriesData[SeriesIndex].dataLabels.style=ChartSeriesData[SeriesIndex].ExtData.dataLabels.style;
            }
            ChartSeriesData[SeriesIndex].data=Agi.Controls.PieChart.GetStandLineDataArray(ChartSeriesData[SeriesIndex],null);
            _PieChart.Refresh();
        }else{
            AgiCommonDialogBox.Alert("请您先添加DataSet 至当前图表!")
        }
    }
    //endregion

    //endregion

    //region 4.6.颜色/背景相关设置
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='PieChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='Pie_prortityPanelTabletd0'>图表背景：</td><td class='prortityPanelTabletd1'><div id='PieChart_bgvalue' class='PieChart_ColorControl' style='float:left;background-color:#ffffff;'/></div><div id='PieChart_BackgroundSave' class='PieChartPropSavebuttonsty' title='保存' style='float: left;margin-top:6px;'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BackGroundObj=$(ItemContent.toString());
    //endregion

    //region 5.初始化属性项显示
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"标题",DisabledValue:1,ContentObj:TitleObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"背景设置",DisabledValue:1,ContentObj:BackGroundObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"显示设置",DisabledValue:1,ContentObj:DataLinesObj}));

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
    $("#PieChart_TitleFontColor").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });
    $(".PieChartColorSelsty").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });

    $("#PieChart_TitleSave").die("click");
    $("#PieChart_TitleSave").live("click",function(ev){
        var Yvalue=null;
//        Yvalue=eval($("#PieChart_TitleFontSize").val())-10;
//        if($("#PieChart_TitleVirDir").val()==="bottom"){
//            Yvalue=null;
//        }
        var ThisColorValue=Agi.Controls.ControlColorApply.fColorControlValueGet("PieChart_TitleFontColor");
        ChartOptions.title={
            align:$("#PieChart_TitleHorDir").val(),
            floating:false,
//            margin:30,
            text:$("#PieChart_Titletxt").val(),
            verticalAlign:null,
            style:{
                fontFamily:$("#PieChart_TitleFontSty").val(),
                fontWeight: $("#PieChart_TitleFontWeight").val(),
                color:ThisColorValue,
                fontSize:$("#PieChart_TitleFontSize").val()+"px"
            }
//            ,y:Yvalue
        }
        Me.Get("ProPerty").BasciObj.setTitle(ChartOptions.title);
        Me.Set("ChartOptions",ChartOptions);
    });
    if(ChartOptions.title!=null){
        $("#PieChart_Titletxt").val(ChartOptions.title.text);
        $("#PieChart_TitleFontSty").find("option[value='"+ChartOptions.title.style.fontFamily+"']").attr("selected","selected");
        $("#PieChart_TitleFontWeight").find("option[value='"+ChartOptions.title.style.fontWeight+"']").attr("selected","selected");
        $("#PieChart_TitleFontSize").val(parseInt(ChartOptions.title.style.fontSize.replace("px","")));
        Agi.Controls.ControlColorApply.fColorControlValueSet("PieChart_TitleFontColor",ChartOptions.title.style.color,false);//赋值默认颜色
        $("#PieChart_TitleHorDir").find("option[value='"+ChartOptions.title.align+"']").attr("selected","selected");
        $("#PieChart_TitleVirDir").find("option[value='"+ChartOptions.title.verticalAlign+"']").attr("selected","selected");
    }


    $("#PieChartSeriesLineSave").die("click");
    $("#PieChartSeriesLineSave").live("click",function(ev){
        var _SeriesData={
            Name:"",
            SeriesExData:null
        };
        _SeriesData.Name = $("#TxtProPanelLineName").val(); //Series 名称
        //20130531 倪飘 解决bug，饼图控件中修改曲线名称为空以后点击保存，应该弹出"曲线名称不可为空！"的提示框
          if(_SeriesData.Name!=null && _SeriesData.Name!=""){
        _SeriesData.SeriesExData=Agi.Controls.PieChart.SeriesExDefaultDataInfo("#058DC7",null);//基本信息
        _SeriesData.SeriesExData.dataLabels.enabled=Agi.Controls.PieChart.BolTrue_False($("#PieChartLine_Lable").val());//是否禁用dataLabels
        _SeriesData.SeriesExData.dataLabels.style.fontSize=$("#PieDatalableFontSize").val();
        _SeriesData.SeriesExData.dataLabels.style.color=Agi.Controls.ControlColorApply.fColorControlValueGet("PieDatalableFontColor");;

        _SeriesData.SeriesExData.Tips.enabled=Agi.Controls.PieChart.BolTrue_False($("#PieChartLine_Tips").val());//是否禁用Tips
        _SeriesData.SeriesExData.Tips.fontSize=$("#PieTipsFontSize").val();

        var PieChartColorPanels=$(".PieChart_ColorPanel");
        var PieChartColorArray=[];
        if(PieChartColorPanels.length>0){
            var ThisColorValue="";
            PieChartColorPanels.each(function(){
                ThisColorValue=Agi.Controls.ControlColorApply.fColorControlValueGet(this);
                PieChartColorArray.push(ThisColorValue);
            });
        }
        _ChartOptions.colors=PieChartColorArray;
        Me.Set("ChartOptions",_ChartOptions);

        Me.SeriesExtDataChanged(_SeriesData);//所选Series的扩展属性，和名称更改
    } else {
        AgiCommonDialogBox.Alert("曲线名称不可为空!");
    }
    });

    $("#PieChart_bgvalue").unbind().bind("click",function(){
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
        var ThisChartbgvalue=Agi.Controls.PieChart.BackgroundValueGet(_ChartOptions);
        $("#PieChart_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项

        if(_ChartOptions.xAxis.gridLineColor!=null && _ChartOptions.xAxis.gridLineColor!=""){
        }else{
            _ChartOptions.xAxis.gridLineColor="#737272";
        }
    }else{
        var ThisChartbgvalue=Agi.Controls.PieChart.BackgroundValueGet(_ChartOptions);
        $("#PieChart_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项
    }

    /*7.7 背景设置保存*/
    $("#PieChart_BackgroundSave").unbind().bind("click",function(ev){
        var color=$("#PieChart_bgvalue").data('colorValue');
        var BgColorValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
        var BackgroudObj={
            BolIsTransfor:BgColorValue.BolIsTransfor,//是否透明
            StartColor:BgColorValue.StartColor,//开始颜色
            EndColor:BgColorValue.EndColor,//结束颜色
            GradualChangeType:BgColorValue.GradualChangeType//渐变方式
        }
        Agi.Controls.PieChart.BackgroundApply(Me,BackgroudObj);//背景应用
    });

    //endregion

    //region 7.10 颜色设置保存
    //region7.10.0.显示系统已默认设置的颜色
    if(_ChartOptions.colors!=null && _ChartOptions.colors.length>0){
        var PieChartAddColorPanel=$(".PieChart_ColorAddColor");
        var ColorPanelElment=null;
        for(var i=0;i<_ChartOptions.colors.length;i++){
            ColorPanelElment=$("<div class='PieChart_ColorPanel' style='background-color:"+_ChartOptions.colors[i]+";' title='编辑'><div class='PieChart_ColorPanelDelsty' title='移除'></div></div>");
            ColorPanelElment.data('colorValue',{"type":1,"rgba":_ChartOptions.colors[i],"hex":_ChartOptions.colors[i],"ahex":_ChartOptions.colors[i],"value":_ChartOptions.colors[i]});//设置默认项
            PieChartAddColorPanel.before(ColorPanelElment);
        }
        ColorPanelElment=null;
    }
    //endregion

    //7.10.1.添加新可用颜色
    $(".PieChart_ColorAddColor").unbind().bind("click",function(ev){
        var BsicChartColorPanels=$(".PieChart_ColorPanel");
        if(BsicChartColorPanels.length<=19){
            Agi.Controls.ControlColorApply.fEditColor(null,[1,2],false,function(color){
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                var ColorPanelElment=$("<div class='PieChart_ColorPanel' style='background-color:"+color.value.background+";' title='编辑'><div class='PieChart_ColorPanelDelsty' title='移除'></div></div>");
                $(".PieChart_ColorAddColor").before(ColorPanelElment);
                ColorPanelElment.data('colorValue', color);
                ColorPanelElment=null;
            });
        }else{
            AgiCommonDialogBox.Alert("最多只能添加20种可用颜色!");
        }
    });
    //7.10.2.删除可用颜色
    $(".PieChart_ColorPanelDelsty").die().live("click",function(ev){
        $(this).parent().remove();
//        return false;
        if (ev.stopPropagation){
            ev.stopPropagation();
        }else {
            ev.cancelBubble = true;
        }
    });
    //7.10.3.重新设定颜色
    $(".PieChart_ColorPanel").die().live("click",function(ev){
        var oColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oColorPanel,[1,2],false,function(color){
            $(oColorPanel).css("background-color",color.value.background).data('colorValue',color);
        });
    });

    //7.10.5.撤销所有更改
    $("#PieChart_ColorsUndo").unbind().bind("click",function(ev){
        $(".PieChart_ColorPanel").remove();
        if(_ChartOptions.colors!=null && _ChartOptions.colors.length>0){
            var PieChartAddColorPanel=$(".PieChart_ColorAddColor");
            var ColorPanelElment=null;
            for(var i=0;i<_ChartOptions.colors.length;i++){
                ColorPanelElment=$("<div class='PieChart_ColorPanel' style='background-color:"+_ChartOptions.colors[i]+";' title='编辑'><div class='PieChart_ColorPanelDelsty' title='移除'></div></div>");
                ColorPanelElment.data('colorValue',{"type":1,"rgba":_ChartOptions.colors[i],"hex":_ChartOptions.colors[i],"ahex":_ChartOptions.colors[i],"value":_ChartOptions.colors[i]});//设置默认项
                PieChartAddColorPanel.before(ColorPanelElment);
            }
            ColorPanelElment=null;
        }
    });
    //endregion

    $("#PieDatalableFontColor").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });

    Agi.Controls.PieChartSeriesSelected(Me,ThisChartData[0].name);//显示第一个Series 信息
}
//endregion

//添加新Series时，新建一个Series名称
Agi.Controls.PieChartNewSeriesName=function(_ChartDataArray){
    var newPieChartSeriesName="";
    if(_ChartDataArray!=null && _ChartDataArray.length>0){
        var SeriesNamesArray=[];
        for(var i=0;i<_ChartDataArray.length;i++){
            SeriesNamesArray.push(_ChartDataArray[i].name);
        }
        newPieChartSeriesName=Agi.Controls.PieChartSeriesNameCreate(SeriesNamesArray);
        SeriesNamesArray=null;
        maxIndex=null;
    }else{
        newPieChartSeriesName="Series0";
    }
    return newPieChartSeriesName;
}
//创建一个可用的名称
Agi.Controls.PieChartSeriesNameCreate=function(_Names){
    var newPieChartSeriesName="";
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
        newPieChartSeriesName="Series"+(MaxIndex+1);
        StartIndex=MaxIndex=null;
    }else{
        newPieChartSeriesName="Series0";
    }
    return newPieChartSeriesName;
}

//显示Series面板
Agi.Controls.PieChartShowSeriesPanel=function(_PieChart){
    //7.显示Series面板
    var ControlEditPanelID=_PieChart.Get("HTMLElement").id;
    var ChartSeriesPanel=null;
    if($("#menuBasichartseriesdiv").length>0){
        $("#menuBasichartseriesdiv").remove();
    }
    ChartSeriesPanel=$("<div id='menuBasichartseriesdiv' class='PieChartSeriesmenudivsty'></div>");
    ChartSeriesPanel.appendTo($("#"+ControlEditPanelID));
    ChartSeriesPanel.html("");
    var ThisChartObj=_PieChart.Get("ProPerty").BasciObj;

    if (ThisChartObj.series != null && ThisChartObj.series.length > 0) {
        //region 20130529 9:19 markeluo 显示饼图Series标签颜色
//        for (var i = 0; i < ThisChartObj.series.length; i++) {
//            $("#menuBasichartseriesdiv").append("<div class='PieChartSerieslablesty'>" +
//                "<div style='width:10px; height:10px; line-height: 30px; background-color:" + ThisChartObj.series[i].color + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
//                "<div class='PieChartSeriesname' id='Sel" + ThisChartObj.series[i].name + "' title='"+ThisChartObj.series[i].name+"'>"
//                + ThisChartObj.series[i].name + "</div>" +
//                "<div class='PieseriesImgsty' id='remove" + ThisChartObj.series[i].name + "'></div>" +
//                "<div class='clearfloat'></div></div>");
//        }
        var ThisChartColor="#058dc7";
        if(_PieChart.Get("ChartOptions").colors!=null && _PieChart.Get("ChartOptions").colors.length>0){
            ThisChartColor=_PieChart.Get("ChartOptions").colors[0];
        }
        for (var i = 0; i < ThisChartObj.series.length; i++) {
            $("#menuBasichartseriesdiv").append("<div class='PieChartSerieslablesty'>" +
                "<div style='width:10px; height:10px; line-height: 30px; background-color:" + ThisChartColor + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                "<div class='PieChartSeriesname' id='Sel" + ThisChartObj.series[i].name + "' title='"+ThisChartObj.series[i].name+"'>"
                + ThisChartObj.series[i].name + "</div>" +
                "<div class='PieseriesImgsty' id='remove" + ThisChartObj.series[i].name + "'></div>" +
                "<div class='clearfloat'></div></div>");
        }
        ThisChartColor=null;
        //endregion 20130529 9:19
        $("#menuBasichartseriesdiv").append("<div style='clear:both;'></div>");
        $("#menuBasichartseriesdiv").css("left",($("#"+ControlEditPanelID).width()-120)+"px");
        $("#menuBasichartseriesdiv").css("top","10px");
    }
    $(".PieChartSeriesname").die("click");
    $(".PieseriesImgsty").die("click");

    $(".PieChartSeriesname").live("click",function(ev){
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
            Agi.Controls.PieChartSeriesSelected(_PieChart,SelSeries.name);//Series选中
        }
    })
    $(".PieseriesImgsty").live("click",function(ev){
        var _obj=this;
        var removeseriesname = _obj.id.substr(_obj.id.indexOf("remove") + 6, _obj.id.length - 6);
        $(_obj).parent().remove();
        _PieChart.RemoveSeries(removeseriesname);/*移除线条*/
    })
}

//Chart Series 选中
Agi.Controls.PieChartSelSeriesName=null;
Agi.Controls.PieChartSeriesSelected=function(_PieChart,_SeriesName){
    $("#TxtProPanelLineName").val(_SeriesName);//SeriesName
    var ThisSeriesData=_PieChart.Get("ChartData");//ChartData
    var ThisSelSeriesIndex=-1;
    for(var i=0;i<ThisSeriesData.length;i++){
        if(ThisSeriesData[i].name===_SeriesName){
            ThisSelSeriesIndex=i;
            break;
        }
    }
    if(ThisSelSeriesIndex>-1){
        Agi.Controls.PieChartSelSeriesName=ThisSeriesData[ThisSelSeriesIndex].name;
        //选中Series 相关属性显示
        Agi.Controls.ControlColorApply.fColorControlValueSet("BsicChartLineColorSel",ThisSeriesData[ThisSelSeriesIndex].color,false);
        $("#PieChartLine_Tips").find("option[value='"+Agi.Controls.PieChart.BolTrue_FalseTostring(ThisSeriesData[ThisSelSeriesIndex].ExtData.Tips.enabled)+"']").attr("selected","selected");
        $("#PieChartLine_Lable").find("option[value='"+Agi.Controls.PieChart.BolTrue_FalseTostring(ThisSeriesData[ThisSelSeriesIndex].ExtData.dataLabels.enabled)+"']").attr("selected","selected");

        if(ThisSeriesData[ThisSelSeriesIndex].ExtData.dataLabels.style==null){
            ThisSeriesData[ThisSelSeriesIndex].ExtData.dataLabels.style={
                fontSize:12,
                color:"#636363"
            }
        }
        $("#PieDatalableFontSize").val(ThisSeriesData[ThisSelSeriesIndex].ExtData.dataLabels.style.fontSize);
        Agi.Controls.ControlColorApply.fColorControlValueSet("PieDatalableFontColor",ThisSeriesData[ThisSelSeriesIndex].ExtData.dataLabels.style.color,false);//赋值默认颜色
        if(ThisSeriesData[ThisSelSeriesIndex].ExtData.Tips.fontSize!=null && ThisSeriesData[ThisSelSeriesIndex].ExtData.Tips.fontSize>0){}else{
            ThisSeriesData[ThisSelSeriesIndex].ExtData.Tips.fontSize=12;
        }
        $("#PieTipsFontSize").val(ThisSeriesData[ThisSelSeriesIndex].ExtData.Tips.fontSize);
    }
}

/*Chart 基准线相关处理-------------------------------------------------------------------*/
Namespace.register("Agi.Controls.PieChart");/*添加 Agi.Controls.PieChart命名空间*/
/*根据基准线格式化图表线条数据*/
/*
 * _ChartSeriesData,对象，元素包含属性{name,data:数组，元素为对象，包含属性：{name,x,y},type,color,Entity,XColumn,YColumn}
 * _ChartStandLines,数组，元素包含属性：{LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips}
 * */
Agi.Controls.PieChart.GetStandLineDataArray=function(_ChartSeriesData,_ChartStandLines){
    var  ReturnData=_ChartSeriesData.data;
    ReturnData=Agi.Controls.PieChart.GetChartSeriesDataBy_Standardline(_ChartSeriesData,null,{Type:_ChartSeriesData.type,Color:_ChartSeriesData.color},_ChartStandLines);
    return ReturnData;
}
/*更改点的颜色*/
Agi.Controls.PieChart.GetChartSeriesDataBy_Standardline=function(_ChartSeriesData,StanrdValue,_ChartTypePar,_StandardLines){
    var  ReturnData=[];
    var _ChartDataArray=_ChartSeriesData.data;
    if(_ChartDataArray!=null && _ChartDataArray.length>0){
        for(var i=0;i<_ChartDataArray.length;i++){
            ReturnData.push({name:_ChartDataArray[i].name,x:_ChartDataArray[i].x,y:_ChartDataArray[i].y});
        }
    }
    return ReturnData;
}

/*-----------------------------------基准线处理end---------------------------------------*/

/*-----------------------------Series 线条处理-------------------*/
Agi.Controls.PieChart.SeriesExDefaultDataInfo=function(_defaultColor,_ChartTips){
    var NewChartTpis=null;
    if(_ChartTips!=null && _ChartTips.enabled!=null){
        NewChartTpis={enabled:_ChartTips.enabled,fontSize:_ChartTips.fontSize};
    }else{
        NewChartTpis={enabled:false,fontSize:12};
    }
    return {
        dataLabels:{
            enabled:true,
            style:{
                fontSize:12,
                color:"#636363"
            }
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
Agi.Controls.PieChart.BolTrue_False=function(_strbolvalue){
    if(_strbolvalue==="true"){
        return true;
    }else{
        return false;
    }
}
Agi.Controls.PieChart.BolTrue_FalseTostring=function(_bolvalue){
    if(_bolvalue){
        return "true";
    }else{
        return "false";
    }
}
/*-----------------------------Series 线条处理end----------------*/

/*--------------Chart 多实体数据加载 start-------------*/
Agi.Controls.PieChart.LoadALLEntityData=function(MeEntitys,thisindex,THisChartDataArray,ChartXAxisArray,_callBackFun){
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
                        THisChartDataArray[i].data =Agi.Controls.PieChart.ChartDataConvert(ChartXAxisArray,
                            Agi.Controls.PieChart.DataExtract(
                                Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn, THisChartDataArray[i].ZColumn]),20));
                    }
                    _callBackFun();
                } else {
                    Agi.Controls.PieChart.LoadALLEntityData(MeEntitys, (thisindex + 1), THisChartDataArray, ChartXAxisArray, _callBackFun);
                }
            });
        }
        else {
            if (thisindex === (MeEntitys.length - 1)) {
//                for (var i = 0; i < MeEntitys.length; i++) {
//                    THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(MeEntitys[i], [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]));
//                }
                for (var i = 0; i < THisChartDataArray.length; i++) {
                    THisChartDataArray[i].data = Agi.Controls.PieChart.ChartDataConvert(ChartXAxisArray,
                        Agi.Controls.PieChart.DataExtract(
                            Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn, THisChartDataArray[i].ZColumn]),20));
                }
                _callBackFun();
            } else {
                Agi.Controls.PieChart.LoadALLEntityData(MeEntitys, (thisindex + 1), THisChartDataArray, ChartXAxisArray, _callBackFun);
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
Agi.Controls.PieChart.OptionsAppSty=function(_SeriesData,_ChartType,_StyConfig,_Options){
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
                _SeriesData[i].color=Agi.Controls.PieChart.OptionsAppStyGetColorByIndex(i,_StyConfig.SeriesColors);
            }
        }
    }
}
//根据Series 索引获取对应的默认显示显示
Agi.Controls.PieChart.OptionsAppStyGetColorByIndex=function(_index,_ColorArray){
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
Agi.Controls.PieChart.GetManagerThemeInfo=function(_ControlObj,_ThemeValue){
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
Agi.Controls.PieChart.DialogManager=function(_Controlobj,TipInfo,OkCallBackFun){
    $("#progressbar1").find(".progressBar").hide();//隐藏进度条
    var BasiChartDialogContent="<div id='PieChartDialogPanel' class='PieChartDialogPanelSty'>" +
        "<div class='PieChartDialogPanelTitlesty'>"+TipInfo+"</div>"+
        "<div><div id='PieChartDialogOK' class='btn'>确定</div><div id='PieChartDialogCancel' class='btn'>取消</div></div>"+
        "</div>";
    $('#progressbar1').append(BasiChartDialogContent);
    $('#progressbar1').show().find(".btn").click(function(ev){
        if(this.id=="PieChartDialogOK"){
            $("#PieChartDialogPanel").remove();//移除确认选择对话框
            $('#progressbar1').hide();//隐藏遮罩背景
            OkCallBackFun();//执行回调
        }else{
            $("#PieChartDialogPanel").remove();//移除确认选择对话框
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
Agi.Controls.PieChart.RemoveSeriesUpEntityArray=function(_Controlobj,_EntityKey,_THisChartDataArray){
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
Agi.Controls.PieChart.BackgroundApply=function(_ControlObj,_BackGroudObj){
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
Agi.Controls.PieChart.BackgroundValueGet=function(_oBackgroundObj){
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
Agi.Controls.PieChart.XAsixApply=function(_ControlObj,_XAsixObj){
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
Agi.Controls.PieChart.YAsixApply=function(_ControlObj,_YAsixObj){
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
Agi.Controls.PieChart.GetChartInitData=function(){
    var ThisDay = new Date();
    var ThisData = [];
    for (i = 0; i < 10; i++) {
        ThisData.push([(i+1)*2,Agi.Script.GetRandomValue(10, 95),Agi.Script.GetRandomValue(10, 95)]);
    }
    return ThisData;
}
Agi.Controls.PieChart.ChartDataConvert= function(_ChartXAxisArray, _DataArrary) {
    var ThisData = [];
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
            ThisData.push({ name:_DataArrary[i][0], x:i, y:_DataArrary[i][1]});
        }
        Agi.Controls.ChartAddSeriesUpXAxis(_ChartXAxisArray, ThisData);
    }
    return ThisData;
}
Agi.Controls.PieChart.DataExtract=function(_EntityDataArray,_MaxRow){
    if(_EntityDataArray!=null && _EntityDataArray.length>0){
        if(_EntityDataArray.length>_MaxRow){
            _EntityDataArray.splice(_MaxRow,(_EntityDataArray.length-_MaxRow));
        }
    }
    return _EntityDataArray;
}
//endregion

//region 20130425 14:11 饼图分区渐变/百分比显示 效果实现
Agi.Controls.PieChart.ApplyGradientfillColor=function(_colors){
    var ChartColors=[];
    if(_colors!=null && _colors.length>0){
        for(var i=0;i<_colors.length;i++){
            if(typeof(_colors[i])==="string"){
                ChartColors.push(Agi.Controls.PieChart.ChartPointColorConvert(_colors[i]));
            }else{
                ChartColors.push(_colors[i])
            }
        }
    }
    return ChartColors;
}
Agi.Controls.PieChart.ChartPointColorConvert= function(_ColorValue){
    return {
        radialGradient: { cx: 0.5, cy: 0.3, r: 0.9},
        stops: [
            [0,_ColorValue],
            [1, Highcharts.Color(_ColorValue).brighten(-0.3).get('rgb')] // darken
        ]
    }
}
Agi.Controls.PieChart.ChartPlotOptionsApply=function(_ChartOption){
    _ChartOption.plotOptions.pie={
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: true,
            formatter: function() {
                return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
            }
        }
    }
}
//endregion