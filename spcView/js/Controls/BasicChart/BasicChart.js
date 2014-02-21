/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-20
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 * BasicChart:基础Chart
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.BasicChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
        //20130117 倪飘 集成共享数据源
        if (!_EntityInfo.IsShareEntity) {
            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                //20130513 倪飘 解决bug，基本图表拖入只有一个字段一条数据的dataset时，页面按F12报错
                _EntityInfo.Data = d.Data;
                _EntityInfo.Columns = d.Columns;
//                if (Agi.Edit && _EntityInfo.Data != null && _EntityInfo.Data.length > 100) {
//                    AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,基本图表将截取显示前100条数据！");
//                }
                Me.IsBindNewData = false;
                Me.AddEntity(_EntityInfo); /*添加实体*/
            });
        }
        else {
            if (Me.IsFirstIn) {
                for (var entity in Me.Get("Entity")) {
                    if (Me.Get("Entity")[entity].Key == _EntityInfo.Key) {
                        _EntityInfo = Me.Get("Entity")[entity];
                        break;
                    }
                }
                Me.IsFirstIn = false;
            } else {
                if (_EntityInfo.Data != null && _EntityInfo.Data.length > 0) {
                    _EntityInfo.Columns.length = 0;
                    for (var _param in _EntityInfo.Data[0]) {
                        _EntityInfo.Columns.push(_param);
                    }
                }
            }
//            if (Agi.Edit && _EntityInfo.Data != null && _EntityInfo.Data.length > 100) {
//                AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,基本图表将截取显示前100条数据！");
//            }

            Me.AddEntity(_EntityInfo); /*添加实体*/
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
                        THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.BasicChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(Entitys[i], [Entitys[i].Columns[0], Entitys[i].Columns[1]]), 100, _ChartOptions.xAxis.XTimeFormat));
                    } else {
                        var _Newcolor = Agi.Controls.BasicChart.OptionsAppStyGetColorByIndex(i, _ChartOptions.colors);
                        THisChartDataArray.push({
                            name: Agi.Controls.BasicChartNewSeriesName(THisChartDataArray),
                            data: Agi.Controls.ChartDataConvert(ChartXAxisArray,
                                Agi.Controls.BasicChart.DataExtract(
                                    Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _entity.Columns[1]]), 100, _ChartOptions.xAxis.XTimeFormat)),
                            type: "column", color: _Newcolor, Entity: _entity, XColumn: _entity.Columns[0], YColumn: _entity.Columns[1],
                            ExtData: Agi.Controls.BasicChart.SeriesExDefaultDataInfo(_Newcolor, _ChartOptions.tooltip)
                        });
                        _Newcolor = null;
                    }
                    ThisChartObj.addSeries(Agi.Controls.BasicChart.ColumnSeriesColorGradientApplay(THisChartDataArray[i]), false);
                }
                ThisChartObj.setSize(ThisChartObj.chartWidth, ThisChartObj.chartHeight);
                ThisChartObj.xAxis[0].setCategories(ChartXAxisArray);

                Me.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/

                Me.Set("Position", Me.Get("Position"));

                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.BasicChartShowSeriesPanel(Me);
                }
                Me.Refresh();
                Me.RefreshStandLines(); //更新基准线显示
            }
            if (Agi.Controls.IsControlEdit) {
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
        for (var i = 0; i < THisChartDataArray.length; i++) {
            if (THisChartDataArray[i].Entity == _entity && THisChartDataArray[i].YColumn === _ColumnName) {
                ColumnIsAddedToChart = true;
                break;
            }
        }
        if (!ColumnIsAddedToChart) {
            var ChartXAxisArray = Me.Get("ChartXAxisArray"); /*图表Chart X轴相应的显示点集合*/
            var defaultchartype = "column";
            if (Agi.Controls.BasicChart.ThisChartIsBar(THisChartDataArray)) {
                defaultchartype = "bar";
            }
            var _ChartOptions = Me.Get("ChartOptions");
            var _Newcolor = Agi.Controls.BasicChart.OptionsAppStyGetColorByIndex(i, _ChartOptions.colors);
            THisChartDataArray.push({ name: Agi.Controls.BasicChartNewSeriesName(THisChartDataArray), data: Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.BasicChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(_entity, [_entity.Columns[0], _ColumnName]), 100, _ChartOptions.xAxis.XTimeFormat)), type: defaultchartype, color: _Newcolor, Entity: _entity, XColumn: _entity.Columns[0], YColumn: _ColumnName,
                ExtData: Agi.Controls.BasicChart.SeriesExDefaultDataInfo(_Newcolor, _ChartOptions.tooltip)
            });
            _Newcolor = null;

            var ThisChartObj = Me.Get("ProPerty").BasciObj;
            ThisChartObj.addSeries(Agi.Controls.BasicChart.ColumnSeriesColorGradientApplay(THisChartDataArray[THisChartDataArray.length - 1]), false);
            ThisChartObj.xAxis[0].setCategories(ChartXAxisArray);
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.BasicChartShowSeriesPanel(Me);
                var ChartOptions = Me.Get("ChartOptions");
                Me.RefreshStandLines(); //更新基准线显示
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
        var XTimeFormat = Me.Get("ChartOptions").xAxis.XTimeFormat; //获取原图表X轴时间格式化信息
        if (MeEntitys != null && MeEntitys.length > 0) {
            Agi.Controls.BasicChart.LoadALLEntityData(MeEntitys, 0, THisChartDataArray, ChartXAxisArray, XTimeFormat, function () {
                Me.Set("ChartXAxisArray", ChartXAxisArray); /*图表Chart X轴相应的显示点集合*/
                _callBackFun();
            });
        } else {
            _callBackFun();
        }
    }, //更新实体数据，回调函数通知更新完成
    UpDateSeriesData: function () {
        var Me = this;
        var ChartXAxisArray = [];
        var THisChartDataArray = Me.Get("ChartData"); //获取原图表Data
        var _ChartOptions = Me.Get("ChartOptions"); //
        for (var i = 0; i < THisChartDataArray.length; i++) {
            THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.BasicChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]), 100, _ChartOptions.xAxis.XTimeFormat));
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
            Agi.Controls.BasicChart.RemoveSeriesUpEntityArray(Me, EntityKey, THisChartDataArray);
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
                Agi.Controls.BasicChartShowSeriesPanel(Me);
            }
        }

        Me.RefreshStandLines(); //更新基准线显示

    }, //移除实体Entity
    ParameterChange: function (_ParameterInfo) {
        //当前控件的Entity参数已经被更改，需要将实体的数据重新查找一遍并更新显示
        var Me = this;
        Me.UpDateEntity(function () {
            Me.Refresh(); //刷新显示
            Me.RefreshStandLines(); //更新基准线
        });
    }, //参数联动
    Init: function (_Target, _ShowPosition) {
        var Me = this;
        this.AttributeList = [];
        this.Set("Entity", []);
        this.Set("ControlType", "BasicChart");
        var ID = "BasicChart" + Agi.Script.CreateControlGUID();
        var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty BasicChartPanelSty'></div>");
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
        var THisChartData = Agi.Controls.GetChartInitData();
        THisChartData = Agi.Controls.ChartDataConvert(ChartXAxisArray, THisChartData);
        var thischartSeriesData = [];
        thischartSeriesData.push({ name: "示例数据", data: THisChartData, type: "column", color: "#058DC7", Entity: null, XColumn: "", YColumn: "",
            ExtData: Agi.Controls.BasicChart.SeriesExDefaultDataInfo("#058DC7", null)
        });

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
            ev.stopPropagation();
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
        // this.Refresh();//刷新显示
        this.ReloadSeries(); //重新加载Series
        //20130515 倪飘 解决bug，组态环境中拖入基本图表控件以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
        Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
    }, /*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
    CustomProPanelShow: function () {
        Agi.Controls.BasicChartProrityInit(this);
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
    Copy: function () {
        if (layoutManagement.property.type == 1) {
            var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
            var PostionValue = this.Get("Position");
            var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
            var Newdropdownlist = new Agi.Controls.BasicChart();
            Newdropdownlist.Init(ParentObj, PostionValue);
            newPanelPositionpars = null;
            return Newdropdownlist;
        }
    },
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
            Agi.Controls.BasicChartShowSeriesPanel(Me);
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

        //20130409 倪飘 解决bug，基本图表控件进行参数联动的时候，超过100条的数据在截取前100条数据时候没有弹出提示框
//        if (Agi.Edit && Me.IsBindNewData && thischartSeriesData[0].data != null && thischartSeriesData[0].data.length >= 100) {
//            AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,基本图表将截取显示前100条数据！");
//        }
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
                backgroundColor: ChartOptions.chart.backgroundColor,
                borderColor: ChartOptions.chart.borderColor,
                borderWidth: ChartOptions.chart.borderWidth,
                className: ChartOptions.chart.className,
                plotBackgroundColor: ChartOptions.chart.plotBackgroundColor,
                plotBorderColor: ChartOptions.chart.plotBorderColor,
                plotBorderWidth: ChartOptions.chart.plotBorderWidth,
                polar: ChartOptions.chart.polar
            },
            pane: ChartOptions.pane,
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
            toolbar: ChartOptions.toolbar,
            navigation: ChartOptions.navigation,
            rangeSelector: ChartOptions.rangeSelector,
            navigator: ChartOptions.navigator,
            scrollbar: ChartOptions.scrollbar,
            legendBackgroundColor: ChartOptions.legendBackgroundColor,
            legendBackgroundColorSolid: ChartOptions.legendBackgroundColorSolid,
            dataLabelsColor: ChartOptions.dataLabelsColor,
            textColor: ChartOptions.textColor,
            maskColor: ChartOptions.maskColor,
            legend: {
                enabled: false
            },
            series: Agi.Controls.BasicChart.ColorGradientApplay(thischartSeriesData, ChartOptions.colors)
        };
        if (MePrority.BasciObj != null && MePrority.BasciObj != null) {
            try {
                MePrority.BasciObj.destroy(); //清除原Chart对象
            } catch (e) {
            }

            //3.控件重新定位
            if (ChartOptions.plotOptions.series.stacking == null) {
                Me.Set("Position", Me.Get("Position"));
            }
        }

        //region 20140208 11:08 根据数量设定X轴显示的lable 步长
        Agi.Controls.BasicChart.SetxAsixTickInterval(ChartInitOption);
        //endregion

        var BaseControlObj = new Highcharts.Chart(ChartInitOption);
        MePrority.BasciObj = BaseControlObj;

        //2.如果是非编辑界面则为控件添加外壳样式 让其可拖动位置、更改大小
        if (!Agi.Controls.IsControlEdit) {
            $("#" + HtmlElementID).addClass("PanelSty");
        }

        if (Agi.Controls.IsControlEdit) {
            Agi.Controls.BasicChartShowSeriesPanel(Me);
            //堆积图时，无法显示基准线信息
            if (ChartOptions.plotOptions.series.stacking == null) {
                Me.RefreshStandLines(); //更新基准线显示
            }
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
        Agi.Controls.BasicChartAttributeChange(this, Key, _Value);
    },
    GetConfig: function () {
        var Me = this;
        var ProPerty = this.Get("ProPerty");
        var BasicChartControl = {
            Control: {
                ControlType: null, //控件类型
                ControlID: null, //控件ID
                Entity: null,
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

        BasicChartControl.Control.ControlType = Me.Get("ControlType"); /*控件类型*/
        BasicChartControl.Control.ControlID = ProPerty.ID; /*控件属性*/
        BasicChartControl.Control.ControlBaseObj = ProPerty.ID; /*控件基础对象*/
        BasicChartControl.Control.HTMLElement = Me.Get("HTMLElement").id; /*控件外壳ID*/

        var thischartSeriesData = Me.Get("ChartData"); //图表线条Series数据
        var SeriesList = [];
        //20130117 倪飘 集成共享数据源
        var Entitys = Me.Get("Entity");
        for (var i = 0; i < thischartSeriesData.length; i++) {
            SeriesList.push(Agi.Script.CloneObj(thischartSeriesData[i]));
            //SeriesList[i].data = null;
            if (SeriesList[i].Entity != null) {
                if (!Entitys[0].IsShareEntity) {//非共享数据源时清空数据
                    SeriesList[i].Entity.Parameters = thischartSeriesData[i].Entity.Parameters;
                    SeriesList[i].Entity.Data = null;
                    SeriesList[i].data = null;
                }
            }
        }
        if (SeriesList > 1) {
            for (var i = 1; i < SeriesList.length; i++) {
                for (var j = 0; j < i; j++) {
                    if (SeriesList[i].Entity.Key == SeriesList[j].Entity.Key) {
                        SeriesList[i].Entity.Parameters = SeriesList[j].Entity.Parameters;
                    }
                }
            }
        }
        BasicChartControl.Control.SeriesData = SeriesList; /*控件实体*/
        SeriesList = null;
        BasicChartControl.Control.Position = Me.Get("Position"); /*控件位置信息*/
        BasicChartControl.Control.ChartOptions = Me.Get("ChartOptions"); /*Chart Options信息*/
        BasicChartControl.Control.StandardLines = Me.Get("StandardLines"); /*Chart StandardLines*/
        BasicChartControl.Control.ChartThemeName = Me.Get("ThemeName"); /*控件样式名称*/
        BasicChartControl.Control.ChartType = Me.Get("ChartType"); //控件类型名称

        return BasicChartControl.Control; //返回配置字符串
    }, //获得BasicChart控件的配置信息
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
                Me.Set("ControlType", "BasicChart"); //类型
                Me.Set("Entity", ThisEntitys); //实体
                Me.Set("ChartData", _Config.SeriesData); //Series数据

                _Config.ChartOptions.plotOptions.series.point.events = {
                    click: function () {
                        Me.Set("OutPramats", { "XValue": this.name, "Yvalue": this.y }); /*输出参数更改*/
                    }
                }
                if (_Config.ChartType === "pie") {
                    if (_Config.ChartOptions.tooltip != null) {
                        _Config.ChartOptions.tooltip.formatter = function () { return '' + this.series.name + ':' + this.point.name + ' (' + Math.round(this.percentage) + '%)' };
                    }
                    if (_Config.ChartOptions.plotOptions.pie.dataLabels != null) {
                        _Config.ChartOptions.plotOptions.pie.dataLabels.formatter = function () {
                            return '<b>' + this.point.name + '</b>: ' + Math.round(this.percentage) + ' %';
                        };
                    }
                }

                Me.Set("ChartOptions", _Config.ChartOptions); //ChartOptions
                Me.Set("StandardLines", _Config.StandardLines); //StandardLines

                var ID = _Config.ControlID;
                var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty BasicChartPanelSty'></div>");
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
                Me.IsFirstIn = true;
                //更新实体数据
                Me.UpDateEntity(function () {
                    Me.Refresh();
                    Me.RefreshStandLines(); //更新基准线
                    Agi.Controls.BasicChart.UpdateParameters(Me);
                });
            }
        }
    }, //根据配置信息创建控件
    AddStandardValueLine: function (_StandLineInfo, _bolIsAddList) {
        //LineDir:Horizontal 水平 ,Vertical:垂直
        //_StandLineInfo:{LineID:"line_0",LineType:"Solid",LineColor:"red",LineSize:2,LineDir:"Vertical",LineValue:2000,LineTooTips:"上线"}
        var Me = this;
        var NewLineObj = null;
        var StandardLineId = _StandLineInfo.LineID;
        var _SDLineColor = "red";
        if (_StandLineInfo.LineColor != null && _StandLineInfo.LineColor != "") {
            _SDLineColor = _StandLineInfo.LineColor;
        }

        var chartStandLines = Me.Get("StandardLines"); //获取图表的基准线信息
        var ThisChartObj = Me.Get("ProPerty").BasciObj; //获取图表基本对象
        if (_StandLineInfo.LineDir == "Vertical") {
            var VerStandardlineOptions = {
                value: _StandLineInfo.LineValue,
                dashStyle: _StandLineInfo.LineType,
                color: _SDLineColor,
                width: _StandLineInfo.LineSize,
                id: StandardLineId,
                zIndex: 5
            };
            NewLineObj = ThisChartObj.xAxis[0].addPlotLine(VerStandardlineOptions);
        } else {
            var HorStandardlineOptions = {
                value: _StandLineInfo.LineValue,
                dashStyle: _StandLineInfo.LineType,
                color: _SDLineColor,
                width: _StandLineInfo.LineSize,
                id: StandardLineId,
                zIndex: 5
            };
            NewLineObj = ThisChartObj.yAxis[0].addPlotLine(HorStandardlineOptions);
        }
        if (_bolIsAddList) {
            chartStandLines.push(_StandLineInfo);
        }

        //更新Chart 的数据
        var MeChartData = Me.Get("ChartData"); //获取原图表Data
        if (MeChartData != null && MeChartData.length > 0) {
            for (var i = 0; i < MeChartData.length; i++) {
                MeChartData[i].data = Agi.Controls.BasicChart.GetStandLineDataArray(MeChartData[i], chartStandLines); /*根据基准线更新相应的点值*/
            }
        }
        Me.ReloadSeries(); //更新Series数据
        return NewLineObj;
    }, //20120913,添加基准线
    RemoveStandardLine: function (_LineID) {
        var Me = this;
        var chartStandLines = Me.Get("StandardLines"); //获取图表的基准线信息
        var ThisChartObj = Me.Get("ProPerty").BasciObj; //获取图表基本对象

        if (chartStandLines != null && chartStandLines.length > 0) {
            var IndexValue = -1;
            for (var i = 0; i < chartStandLines.length; i++) {
                if (chartStandLines[i].LineID == _LineID) {
                    IndexValue = i;
                    break;
                }
            }
            //移除基准线和菜单
            if (IndexValue > -1) {
                Me.RemoveStandardLines(ThisChartObj, chartStandLines); //移除基准线
                chartStandLines.splice(IndexValue, 1);
                Me.RefreshStandLines(); //刷新基准线显示
            }
        }
    }, //移除基准线
    ClearALLStandardLine: function () {
        var Me = this;
        var chartStandLines = Me.Get("StandardLines"); //获取图表的基准线信息
        var ThisChartObj = Me.Get("ProPerty").BasciObj; //获取图表基本对象

        if (chartStandLines != null && chartStandLines.length > 0) {
            var IndexValue = -1;
            for (var i = 0; i < chartStandLines.length; i++) {
                Me.RemoveStandardLines(ThisChartObj, chartStandLines); //移除基准线
            }
            chartStandLines.length = 0;
            Me.Set("StandardLines", chartStandLines); //更新基准线属性
        }
    }, //移除所有基准线
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
                MeChartData[i].data = Agi.Controls.BasicChart.GetStandLineDataArray(MeChartData[i], chartStandLines); /*根据基准线更新相应的点值*/
                ThisChartObj.addSeries(Agi.Controls.BasicChart.ColumnSeriesColorGradientApplay(MeChartData[i]), false);
            }
            Me.Set("Position", Me.Get("Position"));
        }
    }, //重新加载Series
    RefreshStandLines: function () {
        var Me = this;
        var ChartOptions = Me.Get("ChartOptions");
        var MeChartData = Me.Get("ChartData"); //获取原图表Data
        var chartStandLines = Me.Get("StandardLines"); //获取图表的基准线信息
        if (MeChartData.length === 1 && MeChartData[0].type === "pie") { } else {
            //非堆积图时才可显示基准线
            if (ChartOptions.plotOptions.series.stacking == null) {
                var NewChartStandardLines = Me.Get("StandardLines"); //获取图表的基准线信息
                var ThisChartObj = Me.Get("ProPerty").BasciObj; //获取图表基本对象
                Me.RemoveStandardLines(ThisChartObj, NewChartStandardLines); //移除基准线

                if (NewChartStandardLines != null && NewChartStandardLines.length > 0) {
                    for (var i = 0; i < NewChartStandardLines.length; i++) {/*元素包含对象：LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips*/
                        var LineObj = Me.AddStandardValueLine(NewChartStandardLines[i], false);
                        Me.LoadStandardLineObjMenu(LineObj, NewChartStandardLines[i].LineDir);
                    }
                } else {
                    Me.ReloadSeries(); //更新Series数据
                }
            } else {
                var MeChartData = Me.Get("ChartData"); //获取原图表Data
                var chartStandLines = Me.Get("StandardLines"); //获取图表的基准线信息
                if (MeChartData != null && MeChartData.length > 0) {
                    for (var i = 0; i < MeChartData.length; i++) {
                        MeChartData[i].data = Agi.Controls.BasicChart.GetStandLineDataArray(MeChartData[i], chartStandLines); /*根据基准线更新相应的点值*/
                    }
                }
            }
        }
    }, //20120913,更新基准线显示
    LoadStandardLineObjMenu: function (_ChartStandardLineObj, _Dir) {
        var Me = this;
        Agi.Controls.BasicChart.ShowStandardLineMenu(Me);
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
        Me.RefreshStandLines(); //更新基准线显示
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
        Agi.Controls.BasicChart.OptionsAppSty(Me.Get("ChartData"), Me.Get("ChartType"), ChartStyleValue, _ChartOptions);

        //4.重新赋值ChartOptions与样式名称
        Me.Set("ChartOptions", _ChartOptions);
        Me.Set("ThemeName", _themeName);

        //5.控件刷新显示
        Me.Refresh(); //刷新显示
        Me.RefreshStandLines(); //更新基准线

        ChartStyleValue = null;
        /*20121104163027 结束*/
    } //更改样式
});
/*BasicChart参数更改处理方法*/
Agi.Controls.BasicChartAttributeChange=function(_ControlObj,Key,_Value){
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
//                ThisControlObj.Refresh();/*Chart 更改大小*/
//            }

            PagePars=null;
        }
    }else if(Key=="OutPramats"){
        if(_Value!=0){
            var ThisControlPrority=_ControlObj.Get("ProPerty");
            var ThisOutPars=[];
            if(_Value!=null){
                for(var item in _Value){
                    ThisOutPars.push({Name:item,Value:_Value[item]});
                }
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
        var ChartOptions=Agi.Controls.BasicChart.GetManagerThemeInfo(_ControlObj,_Value);//获得处理后的主题信息值
        _ControlObj.Set("ChartOptions",ChartOptions);
        _ControlObj.Refresh();//刷新显示
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitBasicChart=function(){
    return new Agi.Controls.BasicChart();
}

//region BasicChart 自定义属性面板初始化显示
Agi.Controls.BasicChartProrityInit=function(_BasicChart){
    var Me=_BasicChart;
    var ThisProItems=[];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent=new Agi.Script.StringBuilder();

    //region 4.1.标题
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>标题内容：</td><td colspan='3' class='prortityPanelTabletd1'><input id='basicChart_Titletxt' type='text' style='width:70%;' class='ControlProTextSty' maxlength='15' ischeck='true'><div id='basicChart_TitleSave' class='BasicChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体样式：</td><td class='prortityPanelTabletd1'><select id='basicChart_TitleFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>粗体样式：</td><td class='prortityPanelTabletd1'><select id='basicChart_TitleFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd1'><input id='basicChart_TitleFontSize' type='number' value='14' defaultvalue='14' min='8' max='30'  class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_TitleFontColor' class='BsicChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>水平方向：</td><td class='prortityPanelTabletd1'><select id='basicChart_TitleHorDir'><option value='left'>居左</option><option value='center' selected='selected'>居中</option><option value='right'>居右</option></select></td>");
//    ItemContent.append("<td class='prortityPanelTabletd0'>垂直方向：</td><td class='prortityPanelTabletd1'><select id='basicChart_TitleVirDir'><option value='top' selected='selected'>居上</option><option value='middle'>居中</option><option value='bottom'>居下</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>垂直方向：</td><td class='prortityPanelTabletd1'><select id='basicChart_TitleVirDir'><option value='top' selected='selected'>居上</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var TitleObj=$(ItemContent.toString());
    //endregion

    //region 4.2.数据曲线
    var ThisChartData=_BasicChart.Get("ChartData");
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();


    var ThisChartEntitys=_BasicChart.Get("Entity");
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
        ItemContent.append("<div class='BasicChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>曲线：</td>");
        ItemContent.append("<td colspan='3' class='prortityPanelTabletd2'><input id='TxtProPanelLineName' type='text'  value='"+ThisChartData[0].name+"' class='ControlProTextSty' maxlength='10' ischeck='true'><div id='BsicChartSeriesLineSave'  class='BasicChartPropSavebuttonsty' title='保存'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>数据颜色：</td><td colspan='3' class='prortityPanelTabletd1'><div id='BsicChartLineColorSel' class='BsicChart_ColorControl ' style='background-color:#058dc7;' title='编辑'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>标签：</td><td class='prortityPanelTabletd1'><select id='BasicChartLine_Lable'><option selected='selected' value='false'>禁用</option><option  value='true'>启用</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Tips：</td><td class='prortityPanelTabletd1'><select id='BasicChartLine_Tips'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker：</td><td class='prortityPanelTabletd1'><select id='BasicChartLine_Markerenabled'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker样式：</td><td class='prortityPanelTabletd1'><select id='BasicChartLine_Markerstyle'><option selected='selected' value='circle'>圆点</option><option value='square'>方块</option><option value='diamond'>菱形</option><option value='triangle'>正三角</option><option value='triangle-down'>倒三角</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker大小：</td><td class='prortityPanelTabletd1'><input id='BasicChartLine_Markersize' type='number' value='3' defaultvalue='3' min='1' max='10' class='ControlProNumberSty'/></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker颜色：</td><td class='prortityPanelTabletd1'><div id='BasicChartLine_MarkerColor' class='basicChartColorSelsty BsicChart_ColorControl ' style='background-color:#058DC7;' title='编辑'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td colspan='4' class='basicprortitystytdCenter'>单个数据图表类型</td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td colspan='4'>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_column' src='JS/Controls/BasicChart/img/column_chart.png' title='Column'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_area' src='JS/Controls/BasicChart/img/area_chart.png' title='Area'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_line' src='JS/Controls/BasicChart/img/line_chart.png'  title='Line'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_stackedpercentcolumn' src='JS/Controls/BasicChart/img/heapcolumn_chart.png'  title='Stacked_Column_Percent'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_stackedcolumn' src='JS/Controls/BasicChart/img/columnstacked_chart.png'  title='Stacked_Column'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_bar' src='JS/Controls/BasicChart/img/Bar_chart.png'  title='Bar'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_stackedbar' src='JS/Controls/BasicChart/img/barstacked_chart.png'  title='Stacked_Bar'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_stackedpercentbar' src='JS/Controls/BasicChart/img/barstackedpercent_chart.png'  title='Stacked_Bar_Percent'/></div>");
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_scatter' src='JS/Controls/BasicChart/img/scatterplot_chart.png'  title='scatter'/></div>");//点图
        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_polar' src='JS/Controls/BasicChart/img/polar_chart.png'  title='polar'/></div>"); //雷达图
        //饼图单独封装出来了，在基本chart中去掉饼图选项的显示
//        ItemContent.append("<div class='BasicChart_ProTypeImgSty'><img id='Chart_ProType_pie' src='JS/Controls/BasicChart/img/pie_chart.png'  title='Pie'/></div>");//饼图
        ItemContent.append("</td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        DataLinesObj=$(ItemContent.toString());
    }

    //Series颜色更改
    Me.SeriesColorChanged=function(thisChartcolor){
        var ChartSeriesData=_BasicChart.Get("ChartData");
        var SeriesIndex=0;
        if(Agi.Controls.BasicChartSelSeriesName!=null && ChartSeriesData.length>0){
            for(var i=0;i<ChartSeriesData.length;i++){
                if(ChartSeriesData[i].name===Agi.Controls.BasicChartSelSeriesName){
                    SeriesIndex=i;
                    break;
                }
            }
        }
        if(ChartSeriesData!=null && ChartSeriesData.length>0){
            ChartSeriesData[SeriesIndex].color=thisChartcolor;
            if(ChartSeriesData[SeriesIndex].type==="scatter"){//如果是散点图，则其marker点的颜色和series 颜色需要一致
                Agi.Controls.ControlColorApply.fColorControlValueSet("BasicChartLine_MarkerColor",thisChartcolor,false);
                ChartSeriesData[SeriesIndex].ExtData.Marker.fillColor=thisChartcolor;//
            }
            var chartStandLines=Me.Get("StandardLines");//获取图表的基准线信息
            ChartSeriesData[SeriesIndex].data=Agi.Controls.BasicChart.GetStandLineDataArray(ChartSeriesData[SeriesIndex],chartStandLines);/*根据基准线更新相应的点值*/

            _BasicChart.Refresh();
        }else{
            AgiCommonDialogBox.Alert("请您先添加DataSet 至当前图表!")
        }
    }
    //Series 扩展属性更改
    Me.SeriesExtDataChanged=function(_SeriesData){
        var ExtData=_SeriesData.SeriesExData;//Series 扩展属性信息
        var SeriesName=_SeriesData.Name;//Series 更改后名称
        var ChartSeriesData=_BasicChart.Get("ChartData");
        var SeriesIndex=-1;
        if(Agi.Controls.BasicChartSelSeriesName!=null && ChartSeriesData.length>0){
            for(var i=0;i<ChartSeriesData.length;i++){
                if(ChartSeriesData[i].name===Agi.Controls.BasicChartSelSeriesName){
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
            }

            ChartSeriesData[SeriesIndex].data=Agi.Controls.BasicChart.GetStandLineDataArray(ChartSeriesData[SeriesIndex],chartStandLines);
            _BasicChart.Refresh();
        }else{
            AgiCommonDialogBox.Alert("请您先添加DataSet 至当前图表!")
        }
    }
    $(".BasicChart_ProTypeImgSty").die("click");
    $(".BasicChart_ProTypeImgSty").live("click",function(ev){
        var curentimgid=$(ev.currentTarget).find("img")[0].id;
        var thischarType=curentimgid.substring(curentimgid.lastIndexOf("_")+1);
        if(thischarType==="polar"){
            var chartStandLines=Me.Get("StandardLines");//获取图表的基准线信息
            if(chartStandLines!=null && chartStandLines.length>0){
                Agi.Controls.BasicChart.DialogManager(Me,"应用雷达图会清除之前的基准线设置，您是否还要继续？",function(){
                    Me.ClearALLStandardLine();//清除所有基准线
                    Me.SeriesTypeChanged(thischarType);
                });//显示选择对话框
            }else{
                Me.SeriesTypeChanged(thischarType);
            }
        }else{
            Me.SeriesTypeChanged(thischarType);
        }
    });
    Me.SeriesTypeChanged=function(thischarType){
        var ChartSeriesData=_BasicChart.Get("ChartData");
        var SeriesIndex=0;
        if(Agi.Controls.BasicChartSelSeriesName!=null && ChartSeriesData.length>0){
            for(var i=0;i<ChartSeriesData.length;i++){
                if(ChartSeriesData[i].name===Agi.Controls.BasicChartSelSeriesName){
                   SeriesIndex=i;
                    break;
                }
            }
        }
        if(ChartSeriesData!=null && ChartSeriesData.length>0){
            var ChartOptions=Me.Get("ChartOptions");
            ChartOptions.plotOptions.series.stacking=null;
            ChartOptions.plotOptions.column.stacking=null;
            ChartOptions.tooltip.formatter=null;
            ChartOptions.chart.polar=false;
            ChartOptions.pane=null;

            if(thischarType=="polar")
            {
                ChartOptions.chart.polar=true;
                ChartOptions.pane={size: '80%'};
                ChartOptions.xAxis={
                        categories:ChartOptions.xAxis.categories,
                        tickmarkPlacement: 'on',
                        lineWidth: 0
                }
               ChartOptions.yAxis={
                    gridLineInterpolation:'polygon',
                    lineWidth:0,
                   min:0
                }//不要设置Y轴
                Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"line");//判断并更新整个Chart 的Series 类型
                _BasicChart.Refresh();
            }else{
                if(Me.Get("ChartType")=="polar"){//如果原类型为雷达图，则需要重新初始化参数显示其它图表类型
                    ChartOptions=Agi.Controls.BasicChart.GetManagerThemeInfo(Me,"darkbrown");//更改图表主题样式值
                    Me.Set("ChartOptions",ChartOptions);
                }
                if(thischarType=="line"){
                    ChartOptions.xAxis.labels.rotation=30;
                    ChartOptions.xAxis.labels.align="left";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"line");//判断并更新整个Chart 的Series 类型
                    _BasicChart.Refresh();
                }else if(thischarType=="column"){
                    ChartOptions.xAxis.labels.rotation=30;
                    ChartOptions.xAxis.labels.align="left";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"column");//判断并更新整个Chart 的Series 类型
                    _BasicChart.Refresh();
                }else if(thischarType=="area"){
                    ChartOptions.xAxis.labels.rotation=30;
                    ChartOptions.xAxis.labels.align="left";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"area");//判断并更新整个Chart 的Series 类型
                    _BasicChart.Refresh();
                }else if(thischarType=="pie"){
                    ChartOptions.xAxis.labels.rotation=30;
                    ChartOptions.xAxis.labels.align="left";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"pie");//判断并更新整个Chart 的Series 类型
                    ChartOptions.tooltip.formatter=function(){return ''+this.series.name +':'+this.point.name+' ('+ Math.round(this.percentage) +'%)'};
                    _BasicChart.Refresh();
                }else if(thischarType=="stackedpercentcolumn"){
                    ChartOptions.xAxis.labels.rotation=30;
                    ChartOptions.xAxis.labels.align="left";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"column");//判断并更新整个Chart 的Series 类型
                    ChartOptions.tooltip.formatter=function(){
                            return ''+this.series.name +': '+ this.y +' ('+ Math.round(this.percentage) +'%)';
                    }
                    ChartOptions.plotOptions.series.stacking="percent";
                    ChartOptions.plotOptions.column.stacking="percent";
                    Me.RefreshStandLines();//更新基准线显示
                    _BasicChart.Refresh();
                }else if(thischarType=="stackedcolumn"){
                    ChartOptions.xAxis.labels.rotation=30;
                    ChartOptions.xAxis.labels.align="left";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"column");//判断并更新整个Chart 的Series 类型
                    ChartOptions.plotOptions.series.stacking="normal";
                    ChartOptions.plotOptions.column.stacking="normal";
                    Me.RefreshStandLines();//更新基准线显示
                    _BasicChart.Refresh();
                }else if(thischarType=="bar"){
                    ChartOptions.xAxis.labels.rotation=0;
                    ChartOptions.xAxis.labels.align="right";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"bar");//判断并更新整个Chart 的Series 类型
                    _BasicChart.Refresh();
                }else if(thischarType=="stackedbar"){
                    ChartOptions.xAxis.labels.rotation=0;
                    ChartOptions.xAxis.labels.align="right";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"bar");//判断并更新整个Chart 的Series 类型
                    ChartOptions.plotOptions.series.stacking="normal";
                    ChartOptions.plotOptions.column.stacking="normal";
                    Me.RefreshStandLines();//更新基准线显示
                    _BasicChart.Refresh();
                }else if(thischarType=="stackedpercentbar"){
                    ChartOptions.xAxis.labels.rotation=0;
                    ChartOptions.xAxis.labels.align="right";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"bar");//判断并更新整个Chart 的Series 类型
                    ChartOptions.tooltip.formatter=function(){
                        return ''+this.series.name +': '+ this.y +' ('+ Math.round(this.percentage) +'%)';
                    }
                    ChartOptions.plotOptions.series.stacking="percent";
                    ChartOptions.plotOptions.column.stacking="percent";
                    Me.RefreshStandLines();//更新基准线显示
                    _BasicChart.Refresh();
                }else if(thischarType=="scatter"){
                    ChartOptions.xAxis.labels.rotation=30;
                    ChartOptions.xAxis.labels.align="left";
                    Agi.Controls.BasicChart.UpSeriesTypeByThisType(Me,ChartSeriesData,SeriesIndex,thischarType,"scatter");//判断并更新整个Chart 的Series 类型
                }
            }
            Me.Set("ChartType",thischarType);//更改图表类型
        }else{
            AgiCommonDialogBox.Alert("请您先添加DataSet 至当前图表!")
        }
    }
    //endregion

    //region 4.3.基准线
    var StandLinesObj=null;
    if(ThisChartData!=null && ThisChartData.length>0){
        ItemContent=null;
        ItemContent=new Agi.Script.StringBuilder();
        var StandardLineDefaultColor="#f9222c";

        var StandardLineTypes=["Solid","ShortDash","ShortDot","ShortDashDot","ShortDashDotDot","Dot","Dash","LongDash","DashDot","LongDashDot","LongDashDotDot"];
        var StandardLineTypeItems="";
        for(var i=0;i<StandardLineTypes.length;i++){
                StandardLineTypeItems=StandardLineTypeItems+"<option value='"+StandardLineTypes[i]+"'>"+StandardLineTypes[i]+"</option>";
        }

        ItemContent.append("<div class='BasicChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>基准线：</td>");
        ItemContent.append("<td colspan='3' class='prortityPanelTabletd2'><div class='bsicChartStandline_sty'><input id='TxtProPanelStandLineName' type='text' class='ControlProTextSty' maxlength='10' ischeck='true'></div><div id='basicchart_standardline_add'  class='bsicChartStandlineAdd' title='新增'></div><div id='basicchart_standardline_save'  class='bsicChartStandlineSave' title='保存'></div><div class='clearfloat'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>线样式：</td><td class='prortityPanelTabletd1'><select id='basicchart_standardline_type'>"+StandardLineTypeItems+"</select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>线颜色：</td><td class='prortityPanelTabletd1'><div id='basicchart_standardline_color' class='BsicChart_ColorControl' style='background-color:"+StandardLineDefaultColor+";' title='编辑'></div></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>线宽：</td><td class='prortityPanelTabletd1'><input  id='basicchart_standardline_size' type='number' value='2' defaultvalue='2' min='1' max='10' class='ControlProNumberSty'/></td>");
//        ItemContent.append("<td class='prortityPanelTabletd0'>方向：</td><td class='prortityPanelTabletd1'><select  id='basicchart_standardline_dir'><option selected='selected' value='Horizontal'>水平</option><option value='Vertical'>垂直</option></select></td>");//20130114 11:17 markeluo 垂直基准线由于X轴默认支持的是字符串格式，所以暂不支持垂直基准线
        ItemContent.append("<td class='prortityPanelTabletd0'>方向：</td><td class='prortityPanelTabletd1'><select  id='basicchart_standardline_dir'><option selected='selected' value='Horizontal'>水平</option></select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>数据来源：</td>");
//        ItemContent.append("<td class='prortityPanelTabletd2' colspan='3'><input id='StandLineValueType' type='radio' name='StandLineValueType' value='0' style='margin: 0px;' checked='checked'>固定值 <input id='StandLineValueType' type='radio' name='StandLineValueType' value='1'style='margin: 0px;'>其它值</td>");
                ItemContent.append("<td class='prortityPanelTabletd2' colspan='3'><input id='StandLineValueType' type='radio' name='StandLineValueType' value='0' style='margin: 0px;' checked='checked'>固定值</td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>固定值：</td><td colspan='3' class='prortityPanelTabletd2'><input type='text'  id='basicchart_standardline_value' class='ControlProTextSty' maxlength='5'></td>");
        ItemContent.append("</tr>");
//        ItemContent.append("<tr>");
//        ItemContent.append("<td class='prortityPanelTabletd0'>参数列表：</td><td colspan='3' class='prortityPanelTabletd1'><select id='basicchart_standardline_Parsvalue' disabled='disabled'></select></td>");
//        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        StandLinesObj=$(ItemContent.toString());
        StandardLineColors=null;
        StandardLineTypes=null;
        //添加基准线，Me.AddStandardValueLine

        $("#StandLineValueType").die("click");
        $("#StandLineValueType").live("click",function(ev){
            var val=$('input:radio[name="StandLineValueType"]:checked').val();
            if(val!=null){
                if(val==="1"){
                    $("#basicchart_standardline_value").attr("disabled",true);
                    $("#basicchart_standardline_Parsvalue").attr("disabled",false);
                }else{
                    $("#basicchart_standardline_Parsvalue").attr("disabled",true);
                    $("#basicchart_standardline_value").attr("disabled",false);
                }
            }
        });

        //基准线添加
        $("#basicchart_standardline_add").die("click");
        $("#basicchart_standardline_add").live("click",function(ev){
            if(Me.Get("ChartType")==="polar"){
                AgiCommonDialogBox.Alert("雷达图不支持基准线!");
                return ;
            }
            var thisChartStandardLines=Me.Get("StandardLines");
            var thisChartLineId="StandardLine_"+Agi.Script.CreateControlGUID();
            var thisChartLineName=$("#TxtProPanelStandLineName").val();

            thisChartLineName = thisChartLineName.replace(/(^\s*)|(\s*$)/g,"");
            if(thisChartLineName == ""){
                AgiCommonDialogBox.Alert("请输入基准线名称！");
                return;
            }

            if(thisChartLineId!=""){
                var ChartLineValue=$("#basicchart_standardline_value").val();
                if(ChartLineValue==""){
                    AgiCommonDialogBox.Alert("请输入基准线固定值！")
                    return;
                }
                if(isNaN(ChartLineValue)){
                    AgiCommonDialogBox.Alert("您输入的基准线固定值不符合规范！")
                    return;
                }
                if(!Agi.Controls.BasicChart.StandLineIsExt(thisChartStandardLines,thisChartLineName)){
                    var ThisColorValue=Agi.Controls.ControlColorApply.fColorControlValueGet("basicchart_standardline_color");
                    var StandLineInfo={
                        LineID:thisChartLineId,
                        LineType:$("#basicchart_standardline_type option:selected").val(),
                        LineColor:ThisColorValue,
                        LineSize:$("#basicchart_standardline_size").val(),
                        LineDir:$("#basicchart_standardline_dir option:selected").val(),
                        LineValue:parseInt($("#basicchart_standardline_value").val()),
                        LineTooTips:thisChartLineName
                    }
                    var NewStandLine=Me.AddStandardValueLine(StandLineInfo,true);
                    Me.LoadStandardLineObjMenu(NewStandLine,StandLineInfo.LineDir);
                }else{
                    AgiCommonDialogBox.Alert("同名基准线已存在！")
                }
            }else{
                AgiCommonDialogBox.Alert("基准线名称不可为空！")
            }
        });
        //基准线修改
        $("#basicchart_standardline_save").die("click");
        $("#basicchart_standardline_save").live("click",function(ev){
            var thisChartStandardLines=Me.Get("StandardLines");
            var StrStandLineName= $("#TxtProPanelStandLineName").val();
            StrStandLineName=StrStandLineName.replace(/(^\s*)|(\s*$)/g,"");
            if(StrStandLineName!=""){
                var ChartLineValue=$("#basicchart_standardline_value").val();
                if(ChartLineValue==""){
                    AgiCommonDialogBox.Alert("请输入基准线的值！")
                    return;
                }
                if(isNaN(ChartLineValue)){
                    AgiCommonDialogBox.Alert("基准线的值不符合规范！")
                    return;
                }
                var StrStandLineID=Agi.Controls.BasicChart.GetStandardLineIDByName(thisChartStandardLines,StrStandLineName);//根据基准线名称获取基准线ID
                if(StrStandLineID && StrStandLineID!=""){
                    var ThisColorValue=Agi.Controls.ControlColorApply.fColorControlValueGet("basicchart_standardline_color");
                    var StandLineInfo={
                        LineID:StrStandLineID,
                        LineType:$("#basicchart_standardline_type option:selected").val(),
                        LineColor:ThisColorValue,
                        LineSize:$("#basicchart_standardline_size").val(),
                        LineDir:$("#basicchart_standardline_dir option:selected").val(),
                        LineValue:parseInt($("#basicchart_standardline_value").val()),
                        LineTooTips:StrStandLineName
                    };
                    Me.RemoveStandardLine(StrStandLineID);//移除原基准线
                    var NewStandLine=Me.AddStandardValueLine(StandLineInfo,true);//新增基准线
                    Me.LoadStandardLineObjMenu(NewStandLine,StandLineInfo.LineDir);//加载基准线菜单
                }else{
                    if(thisChartStandardLines!=null && thisChartStandardLines.length>0){
                        AgiCommonDialogBox.Alert("不支持基准线名称更改！")
                    }else{
                        AgiCommonDialogBox.Alert("不存在此名称的基准线,无法应用更改！")
                    }
                }
            }else{
                AgiCommonDialogBox.Alert("请先选择基准线！")
            }
        });
    }
    //endregion

    //region 4.4.XAxis
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>启用状态：</td><td colspan='3' class='prortityPanelTabletd1'><select id='BasicChartXAxis'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select><div id='basicChart_XAxisSave' class='BasicChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体样式：</td><td class='prortityPanelTabletd1'><select id='basicChart_XAxisFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>粗体样式：</td><td class='prortityPanelTabletd1'><select id='basicChart_XAxisFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd1'><input id='basicChart_XAxisFontSize' type='number' value='14' defaultvalue='14' min='8' max='40' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_XAxisFontColor' class='basicChartColorSelsty BsicChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条大小：</td><td class='prortityPanelTabletd1'><input id='basicChart_XAxisLineSize' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_XAxisLineColor' class='basicChartColorSelsty BsicChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度长度：</td><td class='prortityPanelTabletd1'><input id='basicChart_XAxisLineTicklength' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度宽度：</td><td class='prortityPanelTabletd1'><input id='basicChart_XAxisLineTickWidth' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_XAxisLineTickcolor' style='background-color:#000000' class='basicChartColorSelsty BsicChart_ColorControl'title='编辑'></div></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度位置：</td><td class='prortityPanelTabletd1'><select id='basicChart_XAxisLineTickPosition'><option selected='selected' value='outside'>外侧</option><option value='inside'>内侧</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>时间格式：</td><td class='prortityPanelTabletd' colspan='3'><select id='BasicChart_XTimeLableFormatr' class='BasicChart_XTimeLableFormatrsty'><option selected='selected' value='none'>无格式化</option>" +
        "<option value='yyyy-MM-dd hh:mm:ss'>yyyy-MM-dd hh:mm:ss</option>" +
        "<option value='yyyy/MM/dd hh:mm:ss'>yyyy/MM/dd hh:mm:ss</option>" +
        "<option value='yyyy年MM月dd日 hh时mm分ss秒'>yyyy年MM月dd日 hh时mm分ss秒</option>" +
        "<option value='yyyy年MM月dd日'>yyyy年MM月dd日</option>" +
        "<option value='yyyy/MM/dd'>yyyy/MM/dd</option>" +
        "<option value='yyyy-MM-dd'>yyyy-MM-dd</option>" +
        "</select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var XAxisObj=$(ItemContent.toString());
    //endregion

    //region 4.5.YAxis
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>启用状态：</td><td colspan='3' class='prortityPanelTabletd1'><select id='BasicChartYAxis'><option selected='selected' value='false'>禁用</option><option   value='true'>启用</option></select><div id='basicChart_YAxisSave' class='BasicChartPropSavebuttonsty' title='保存'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体样式：</td><td class='prortityPanelTabletd1'><select id='basicChart_YAxisFontSty'><option selected='selected' value='微软雅黑'>微软雅黑</option><option value='宋体'>宋体</option><option value='黑体'>黑体</option><option value='Arial'>Arial</option></select></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>粗体样式：</td><td class='prortityPanelTabletd1'><select id='basicChart_YAxisFontWeight'><option selected='selected' value='bold'>粗体</option><option value='Normal'>常规</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd1'><input id='basicChart_YAxisFontSize' type='number' value='14' defaultvalue='14' min='8' max='40' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_YAxisFontColor' class='basicChartColorSelsty BsicChart_ColorControl' style='background-color:#000000;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条大小：</td><td class='prortityPanelTabletd1'><input id='basicChart_YAxisLineSize' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_YAxisLineColor'  style='background-color:#000000' class='basicChartColorSelsty BsicChart_ColorControl' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度长度：</td><td class='prortityPanelTabletd1'><input id='basicChart_YAxisLineTicklength' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度宽度：</td><td class='prortityPanelTabletd1'><input id='basicChart_YAxisLineTickWidth' type='number' value='1' defaultvalue='1' min='0' max='10' class='ControlProNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_YAxisLineTickcolor' style='background-color:#000000' class='basicChartColorSelsty BsicChart_ColorControl'title='编辑'></div></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>刻度位置：</td><td class='prortityPanelTabletd1'><select id='basicChart_YAxisLineTickPosition'><option selected='selected' value='outside'>外侧</option><option value='inside'>内侧</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var YAxisObj=$(ItemContent.toString());
    //endregion

    //region 4.6.背景相关
    ItemContent=null;
    ItemContent=new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>图表背景：</td><td colspan='3' class='prortityPanelTabletd1'><div id='basicChart_bgvalue' class='BsicChart_ColorControl' style='float:left;background-color:#ffffff;'/></div><div id='basicChart_BackgroundSave' class='BasicChartPropSavebuttonsty' title='保存' style='float: left;margin-top:6px;'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>水平网格线：</td><td class='prortityPanelTabletd1'><input id='basicChart_YGridLineSize' type='number' value='0' defaultvalue='0' min='0' max='5' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_YGridLineColor' class='basicChartColorSelsty BsicChart_ColorControl' style='background-color:#a4a4a4;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>垂直网格线：</td><td class='prortityPanelTabletd1'><input id='basicChart_XGridLineSize' type='number' value='0' defaultvalue='0' min='0' max='5' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd1'><div id='basicChart_XGridLineColor' class='basicChartColorSelsty BsicChart_ColorControl' style='background-color:#a4a4a4;' title='编辑'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BackGroundObj=$(ItemContent.toString());
    //endregion

    //region 4.7.Series颜色设置 20130520 13:53 markeluo 取消基本Chart 中的颜色设置(由于饼图已单独成为一个控件)
//    var BasicChart_Colors=null;
//    ItemContent=null;
//    ItemContent=new Agi.Script.StringBuilder();
//    ItemContent.append("<div class='BasicChart_Pro_Panel'>");
//    ItemContent.append("<table class='prortityPanelTable'>");
//    ItemContent.append("<tr>");
//    ItemContent.append("<td class='prortityPanelTabletd0'><div class='BasicChart_ColorsPanel'><div class='BsicChart_ColorAddColor' title='添加'></div></div></td></td>");
//    ItemContent.append("</tr>");
//    ItemContent.append("<tr>");
//    ItemContent.append("<td class='prortityPanelTabletd1'><div id='basicChart_ColorsSave' class='BasicChartPropSavebuttonsty' title='保存'></div><div id='basicChart_ColorsUndo' class='BasicChartPropUndobuttonsty' title='撤销'></div></td>");
//    ItemContent.append("</tr>");
//    ItemContent.append("</table>");
//    ItemContent.append("</div>");
//    BasicChart_Colors=ItemContent.toString();//颜色列表
    //endregion

    //region 5.初始化属性项显示
    //20130525 倪飘 解决bug，基本图表，拖入数据后，建议能修改默认颜色设置，保存后显示在左侧控件中（由于饼图已经分离出来，这个设置对基本图表无效，先隐藏该功能）
//    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"默认颜色设置",DisabledValue:1,ContentObj:BasicChart_Colors}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"标题",DisabledValue:1,ContentObj:TitleObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"背景设置",DisabledValue:1,ContentObj:BackGroundObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"数据曲线",DisabledValue:1,ContentObj:DataLinesObj}));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"基准线",DisabledValue:1,ContentObj:StandLinesObj}));
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
    $("#basicChart_TitleFontColor").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });
    $(".basicChartColorSelsty").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });

    $("#basicChart_TitleSave").die("click");
    $("#basicChart_TitleSave").live("click",function(ev){
        var Yvalue=null;
//        Yvalue=eval($("#basicChart_TitleFontSize").val())-10;
//        if($("#basicChart_TitleVirDir").val()==="bottom"){
//            Yvalue=null;
//        }
        var ThisColorValue=Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_TitleFontColor");
        ChartOptions.title={
            align:$("#basicChart_TitleHorDir").val(),
            floating:false,
//            margin:30,
            text:$("#basicChart_Titletxt").val(),
            verticalAlign:null,
            style:{
                fontFamily:$("#basicChart_TitleFontSty").val(),
                fontWeight: $("#basicChart_TitleFontWeight").val(),
                color:ThisColorValue,
                fontSize:$("#basicChart_TitleFontSize").val()+"px"
            }
//            ,y:Yvalue
        }
        Me.Get("ProPerty").BasciObj.setTitle(ChartOptions.title);
        Me.Set("ChartOptions",ChartOptions);
    });
    if(ChartOptions.title!=null){
        $("#basicChart_Titletxt").val(ChartOptions.title.text);
        $("#basicChart_TitleFontSty").find("option[value='"+ChartOptions.title.style.fontFamily+"']").attr("selected","selected");
        $("#basicChart_TitleFontWeight").find("option[value='"+ChartOptions.title.style.fontWeight+"']").attr("selected","selected");
        $("#basicChart_TitleFontSize").val(parseInt(ChartOptions.title.style.fontSize.replace("px","")));
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_TitleFontColor",ChartOptions.title.style.color,false);//赋值默认颜色
        $("#basicChart_TitleHorDir").find("option[value='"+ChartOptions.title.align+"']").attr("selected","selected");
        $("#basicChart_TitleVirDir").find("option[value='"+ChartOptions.title.verticalAlign+"']").attr("selected","selected");
    }

    /*7.2.Series 数据颜色更改*/
    $("#BsicChartLineColorSel").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            //Me.SeriesColorChanged(Agi.Controls.ControlColorApply.fColorControlValueGet($(oThisSelColorPanel)));
            oThisSelColorPanel=null;
        });
    });

    $("#BsicChartSeriesLineSave").die("click");
    $("#BsicChartSeriesLineSave").live("click",function(ev){
        var _SeriesData={
            Name:"",
            SeriesExData:null
        };
        _SeriesData.Name=$("#TxtProPanelLineName").val();//Series 名称
        if(_SeriesData.Name!=null && _SeriesData.Name!=""){
            _SeriesData.SeriesExData=Agi.Controls.BasicChart.SeriesExDefaultDataInfo("#058DC7",null);//基本信息
            _SeriesData.SeriesExData.dataLabels.enabled=Agi.Controls.BasicChart.BolTrue_False($("#BasicChartLine_Lable").val());//是否禁用dataLabels
            _SeriesData.SeriesExData.Tips.enabled=Agi.Controls.BasicChart.BolTrue_False($("#BasicChartLine_Tips").val());//是否禁用Tips
            _SeriesData.SeriesExData.Marker.enabled=Agi.Controls.BasicChart.BolTrue_False($("#BasicChartLine_Markerenabled").val());//是否禁用Marker
            _SeriesData.SeriesExData.Marker.symbol=$("#BasicChartLine_Markerstyle").val();//Marker样式
            _SeriesData.SeriesExData.Marker.radius=parseInt($("#BasicChartLine_Markersize").val());//Marker大小
            _SeriesData.SeriesExData.Marker.fillColor=Agi.Controls.ControlColorApply.fColorControlValueGet("BasicChartLine_MarkerColor");//Marker颜色
            Me.SeriesColorChanged(Agi.Controls.ControlColorApply.fColorControlValueGet($("#BsicChartLineColorSel")));
            Me.SeriesExtDataChanged(_SeriesData);//所选Series的扩展属性，和名称更改
        }else{
            AgiCommonDialogBox.Alert("曲线名称不可为空!");
        }
    });
    /*7.3.基准线颜色插件加载*/
    Agi.Controls.ControlColorApply.fColorControlValueSet("basicchart_standardline_color",StandardLineDefaultColor,false);//赋值默认颜色
    $("#basicchart_standardline_color").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[1,2],false,function(color){
            $(oThisSelColorPanel).css("background-color",color.value.background).data('colorValue', color);
            oThisSelColorPanel=null;
        });
    });

    var _ChartOptions=Me.Get("ChartOptions");
    $("#basicChart_bgvalue").unbind().bind("click",function(){
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
       var ThisChartbgvalue=Agi.Controls.BasicChart.BackgroundValueGet(_ChartOptions);
        $("#basicChart_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项

        if(_ChartOptions.xAxis.gridLineWidth!=null){
            $("#basicChart_XGridLineSize").val(parseInt(_ChartOptions.xAxis.gridLineWidth));//水平网格线宽度
        }
        if(_ChartOptions.xAxis.gridLineColor!=null && _ChartOptions.xAxis.gridLineColor!=""){
        }else{
            _ChartOptions.xAxis.gridLineColor="#737272";
        }
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_XGridLineColor",_ChartOptions.xAxis.gridLineColor,false);//水平网格线颜色

        if(_ChartOptions.yAxis.gridLineWidth!=null){
            $("#basicChart_YGridLineSize").val(parseInt(_ChartOptions.yAxis.gridLineWidth));//水平网格线宽度
        }
        if(_ChartOptions.yAxis.gridLineColor!=null){
            Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_YGridLineColor",_ChartOptions.yAxis.gridLineColor,false);
        }

    }else{
        var ThisChartbgvalue=Agi.Controls.BasicChart.BackgroundValueGet(_ChartOptions);
        $("#basicChart_bgvalue").css("background",ThisChartbgvalue.value.background).data('colorValue',ThisChartbgvalue);//设置默认项
    }

    /*7.5 XAsix 属性面板初始化赋值、选中*/
    if(_ChartOptions.xAxis.labels.style.fontFamily!=null){
        $("#basicChart_XAxisFontSty").find("option[value='"+_ChartOptions.xAxis.labels.style.fontFamily+"']").attr("selected","selected");
    }
    if(_ChartOptions.xAxis.labels.style.fontWeight!=null){
        $("#basicChart_XAxisFontWeight").find("option[value='"+_ChartOptions.xAxis.labels.style.fontWeight+"']").attr("selected","selected");
    }
    if(_ChartOptions.xAxis.labels.style.fontSize!=null){
        $("#basicChart_XAxisFontSize").val(_ChartOptions.xAxis.labels.style.fontSize);//字体大小
    }
    if(_ChartOptions.xAxis.labels.style.color!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_XAxisFontColor",_ChartOptions.xAxis.labels.style.color,false);
    }
    if(_ChartOptions.xAxis.lineWidth!=null){
        $("#basicChart_XAxisLineSize").val(_ChartOptions.xAxis.lineWidth);//线条大小
    }
    if(_ChartOptions.xAxis.tickLength!=null){
        $("#basicChart_XAxisLineTicklength").val(_ChartOptions.xAxis.tickLength);//刻度长度
    }
    if(_ChartOptions.xAxis.tickWidth!=null){
        $("#basicChart_XAxisLineTickWidth").val(_ChartOptions.xAxis.tickWidth);//刻度宽度
    }
    if(_ChartOptions.xAxis.tickColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_XAxisLineTickcolor",_ChartOptions.xAxis.tickColor,false);//刻度颜色
    }else{
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_XAxisLineTickcolor","#000000",false);//刻度颜色
    }
    if(_ChartOptions.xAxis.tickPosition!=null){
        $("#basicChart_XAxisLineTickPosition").find("option[value='"+_ChartOptions.xAxis.tickPosition+"']").attr("selected","selected");
    }
    if(_ChartOptions.xAxis.lineColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_XAxisLineColor",_ChartOptions.xAxis.lineColor,false);//线条颜色
    }
    if(_ChartOptions.xAxis.labels.enabled!=null){
        $("#BasicChartXAxis").find("option[value='"+_ChartOptions.xAxis.labels.enabled+"']").attr("selected","selected");
    }else{
        $("#BasicChartXAxis").find("option[value='true']").attr("selected","selected");
    }
    if(_ChartOptions.xAxis.XTimeFormat!=null && _ChartOptions.xAxis.XTimeFormat!=""){
        $("#BasicChart_XTimeLableFormatr").find("option[value='"+_ChartOptions.xAxis.XTimeFormat+"']").attr("selected","selected");
    }


    /*7.6 YAsix 属性面板初始化赋值、选中*/
    if(_ChartOptions.yAxis.labels.style.fontFamily!=null){
        $("#basicChart_YAxisFontSty").find("option[value='"+_ChartOptions.yAxis.labels.style.fontFamily+"']").attr("selected","selected");
    }
    if(_ChartOptions.yAxis.labels.style.fontWeight!=null){
        $("#basicChart_YAxisFontWeight").find("option[value='"+_ChartOptions.yAxis.labels.style.fontWeight+"']").attr("selected","selected");
    }
    if(_ChartOptions.yAxis.labels.style.fontSize!=null){
        $("#basicChart_YAxisFontSize").val(_ChartOptions.yAxis.labels.style.fontSize);//字体大小
    }
    if(_ChartOptions.yAxis.labels.style.color!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_YAxisFontColor",_ChartOptions.yAxis.labels.style.color,false);
    }
    if(_ChartOptions.yAxis.lineWidth!=null){
        $("#basicChart_YAxisLineSize").val(_ChartOptions.yAxis.lineWidth);//线条大小
    }
    if(_ChartOptions.yAxis.tickLength!=null){
        $("#basicChart_YAxisLineTicklength").val(_ChartOptions.yAxis.tickLength);//刻度长度
    }else{
        //20130529 13:50 markeluo
        $("#basicChart_YAxisLineTicklength").val(4);//默认刻度长度
    }
    if(_ChartOptions.yAxis.tickWidth!=null){
        $("#basicChart_YAxisLineTickWidth").val(_ChartOptions.yAxis.tickWidth);//刻度宽度
    }
    if(_ChartOptions.yAxis.tickColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_YAxisLineTickcolor",_ChartOptions.yAxis.tickColor,false);//刻度颜色
    }else{
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_YAxisLineTickcolor","#000000",false);//刻度颜色
    }
    if(_ChartOptions.yAxis.tickPosition!=null){
        $("#basicChart_YAxisLineTickPosition").find("option[value='"+_ChartOptions.yAxis.tickPosition+"']").attr("selected","selected");
    }
    if(_ChartOptions.yAxis.lineColor!=null){
        Agi.Controls.ControlColorApply.fColorControlValueSet("basicChart_YAxisLineColor",_ChartOptions.yAxis.lineColor,false);//线条颜色
    }
    if(_ChartOptions.yAxis.labels.enabled!=null){
        $("#BasicChartYAxis").find("option[value='"+_ChartOptions.yAxis.labels.enabled+"']").attr("selected","selected");
    }else{
        $("#BasicChartYAxis").find("option[value='true']").attr("selected","selected");
    }

    /*7.7 背景设置保存*/
    $("#basicChart_BackgroundSave").unbind().bind("click",function(ev){
        var color=$("#basicChart_bgvalue").data('colorValue');
        var BgColorValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
        var BackgroudObj={
            BolIsTransfor:BgColorValue.BolIsTransfor,//是否透明
            StartColor:BgColorValue.StartColor,//开始颜色
            EndColor:BgColorValue.EndColor,//结束颜色
            GradualChangeType:BgColorValue.GradualChangeType,//渐变方式
            XgridLineWidth:$("#basicChart_XGridLineSize").val(),//水平网格线宽度
            XgridLineColor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_XGridLineColor"),//水平网格线颜色
            YgridLineWidth:$("#basicChart_YGridLineSize").val(),//垂直网格线宽度
            YgridLineColor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_YGridLineColor")//垂直网格线颜色
        }
        Agi.Controls.BasicChart.BackgroundApply(Me,BackgroudObj);//背景应用
    });
    /*7.8 XAsix 设置保存*/
    $("#basicChart_XAxisSave").unbind().bind("click",function(ev){
        var XAsixObj={
            XAsixIsEnable:$("#BasicChartXAxis").val(),//是否启用
            XAsixfontfamily:$("#basicChart_XAxisFontSty").val(),//字体样式
            XAsixfontweight:$("#basicChart_XAxisFontWeight").val(),//是否粗体
            XAsixfontsize:parseInt($("#basicChart_XAxisFontSize").val()),//字体大小
            XAsixfontcolor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_XAxisFontColor"),//字体颜色
            XAsixLinesieze:parseInt($("#basicChart_XAxisLineSize").val()),//线条大小
            XAsixLinecolor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_XAxisLineColor"),//线条颜色
            XAsixtickLength:parseInt($("#basicChart_XAxisLineTicklength").val()),//刻度长度
            XAsixtickWidth:parseInt($("#basicChart_XAxisLineTickWidth").val()),//刻度宽度
            XAsixtickColor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_XAxisLineTickcolor"),//刻度颜色
            XAsixtickPosition:$("#basicChart_XAxisLineTickPosition").val(),// inside,outside
            XTimeFormat:$("#BasicChart_XTimeLableFormatr").val()//yyyy-mm-dd hh:mm:ss yyyy/mm/dd hh:mm:ss yyyy年MM月dd日 hh时mm分ss秒 yyyy年MM月dd日 MM/dd/yyyy MM-dd-yyyy
        }
        Agi.Controls.BasicChart.XAsixApply(Me,XAsixObj);//XAsix 应用
    });
    /*7.9 YAsix 设置保存*/
    $("#basicChart_YAxisSave").unbind().bind("click",function(ev){
        var YAsixObj={
            YAsixIsEnable:$("#BasicChartYAxis").val(),//是否启用
            YAsixfontfamily:$("#basicChart_YAxisFontSty").val(),//字体样式
            YAsixfontweight:$("#basicChart_YAxisFontWeight").val(),//是否粗体
            YAsixfontsize:parseInt($("#basicChart_YAxisFontSize").val()),//字体大小
            YAsixfontcolor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_YAxisFontColor"),//字体颜色
            YAsixLinesieze:parseInt($("#basicChart_YAxisLineSize").val()),//线条大小
            YAsixLinecolor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_YAxisLineColor"),//线条颜色
            YAsixtickLength:parseInt($("#basicChart_YAxisLineTicklength").val()),//刻度长度
            YAsixtickWidth:parseInt($("#basicChart_YAxisLineTickWidth").val()),//刻度宽度
            YAsixtickColor:Agi.Controls.ControlColorApply.fColorControlValueGet("basicChart_YAxisLineTickcolor"),//刻度颜色
            YAsixtickPosition:$("#basicChart_YAxisLineTickPosition").val()// inside,outside
        }
        Agi.Controls.BasicChart.YAsixApply(Me,YAsixObj);//YAsix 应用
    });

    //region 7.10 颜色设置保存  20130520 13:55 markeluo 注释掉原有关默认颜色设置的方法
//    //region7.10.0.显示系统已默认设置的颜色
//    if(_ChartOptions.colors!=null && _ChartOptions.colors.length>0){
//        var BasicChartAddColorPanel=$(".BsicChart_ColorAddColor");
//        var ColorPanelElment=null;
//        for(var i=0;i<_ChartOptions.colors.length;i++){
//            ColorPanelElment=$("<div class='BsicChart_ColorPanel' style='background-color:"+_ChartOptions.colors[i]+";' title='编辑'><div class='BsicChart_ColorPanelDelsty' title='移除'></div></div>");
//            ColorPanelElment.data('colorValue',{"type":1,"rgba":_ChartOptions.colors[i],"hex":_ChartOptions.colors[i],"ahex":_ChartOptions.colors[i],"value":_ChartOptions.colors[i]});//设置默认项
//            BasicChartAddColorPanel.before(ColorPanelElment);
//        }
//        ColorPanelElment=null;
//    }
//    //endregion
//
//    //7.10.1.添加新可用颜色
//    $(".BsicChart_ColorAddColor").unbind().bind("click",function(ev){
//        var BsicChartColorPanels=$(".BsicChart_ColorPanel");
//        if(BsicChartColorPanels.length<=19){
//            Agi.Controls.ControlColorApply.fEditColor(null,[1,2],false,function(color){
//                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
//                var ColorPanelElment=$("<div class='BsicChart_ColorPanel' style='background-color:"+color.value.background+";' title='编辑'><div class='BsicChart_ColorPanelDelsty' title='移除'></div></div>");
//                $(".BsicChart_ColorAddColor").before(ColorPanelElment);
//                ColorPanelElment.data('colorValue', color);
//                ColorPanelElment=null;
//            });
//        }else{
//            AgiCommonDialogBox.Alert("最多只能添加20种可用颜色!");
//        }
//    });
//    //7.10.2.删除可用颜色
//    $(".BsicChart_ColorPanelDelsty").die().live("click",function(ev){
//        $(this).parent().remove();
////        return false;
//        if (ev.stopPropagation){
//            ev.stopPropagation();
//        }else {
//            ev.cancelBubble = true;
//        }
//    });
//    //7.10.3.重新设定颜色
//    $(".BsicChart_ColorPanel").die().live("click",function(ev){
//        var oColorPanel=this;
//        Agi.Controls.ControlColorApply.fEditColor(oColorPanel,[1,2],false,function(color){
//            $(oColorPanel).css("background-color",color.value.background).data('colorValue',color);
//        });
//    });
//    //7.10.4.保存更改
//    $("#basicChart_ColorsSave").unbind().bind("click",function(ev){
//        var BsicChartColorPanels=$(".BsicChart_ColorPanel");
//        var BsicChartColorArray=[];
//        if(BsicChartColorPanels.length>0){
//            var ThisColorValue="";
//            BsicChartColorPanels.each(function(){
//                ThisColorValue=Agi.Controls.ControlColorApply.fColorControlValueGet(this);
//                BsicChartColorArray.push(ThisColorValue);
//            });
//        }
//        _ChartOptions.colors=BsicChartColorArray;
//        Me.Set("ChartOptions",_ChartOptions);
//
//        //5.控件刷新显示
//        Me.Refresh();//刷新显示
//        Me.RefreshStandLines();//更新基准线
//    });
//    //7.10.5.撤销所有更改
//    $("#basicChart_ColorsUndo").unbind().bind("click",function(ev){
//        $(".BsicChart_ColorPanel").remove();
//        if(_ChartOptions.colors!=null && _ChartOptions.colors.length>0){
//            var BasicChartAddColorPanel=$(".BsicChart_ColorAddColor");
//            var ColorPanelElment=null;
//            for(var i=0;i<_ChartOptions.colors.length;i++){
//                ColorPanelElment=$("<div class='BsicChart_ColorPanel' style='background-color:"+_ChartOptions.colors[i]+";' title='编辑'><div class='BsicChart_ColorPanelDelsty' title='移除'></div></div>");
//                ColorPanelElment.data('colorValue',{"type":1,"rgba":_ChartOptions.colors[i],"hex":_ChartOptions.colors[i],"ahex":_ChartOptions.colors[i],"value":_ChartOptions.colors[i]});//设置默认项
//                BasicChartAddColorPanel.before(ColorPanelElment);
//            }
//            ColorPanelElment=null;
//        }
//    });
//    //endregion

    //endregion

    Agi.Controls.BasicChartSeriesSelected(Me,ThisChartData[0].name);//显示第一个Series 信息
}
//endregion

//添加新Series时，新建一个Series名称
Agi.Controls.BasicChartNewSeriesName=function(_ChartDataArray){
    var newbasicChartSeriesName="";
    if(_ChartDataArray!=null && _ChartDataArray.length>0){
        var SeriesNamesArray=[];
        for(var i=0;i<_ChartDataArray.length;i++){
            SeriesNamesArray.push(_ChartDataArray[i].name);
        }
        newbasicChartSeriesName=Agi.Controls.BasicChartSeriesNameCreate(SeriesNamesArray);
        SeriesNamesArray=null;
        maxIndex=null;
    }else{
        newbasicChartSeriesName="Series0";
    }
    return newbasicChartSeriesName;
}
//创建一个可用的名称
Agi.Controls.BasicChartSeriesNameCreate=function(_Names){
    var newbasicChartSeriesName="";
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
        newbasicChartSeriesName="Series"+(MaxIndex+1);
        StartIndex=MaxIndex=null;
    }else{
        newbasicChartSeriesName="Series0";
    }
    return newbasicChartSeriesName;
}

//显示Series面板
Agi.Controls.BasicChartShowSeriesPanel=function(_BasicChart){
    //7.显示Series面板
    var ControlEditPanelID=_BasicChart.Get("HTMLElement").id;
    var ChartSeriesPanel=null;
    if($("#menuBasichartseriesdiv").length>0){
        $("#menuBasichartseriesdiv").remove();
    }
    ChartSeriesPanel=$("<div id='menuBasichartseriesdiv' class='BschartSeriesmenudivsty'></div>");
    ChartSeriesPanel.appendTo($("#"+ControlEditPanelID));
    ChartSeriesPanel.html("");
    var ThisChartObj=_BasicChart.Get("ProPerty").BasciObj;

    if (ThisChartObj.series != null && ThisChartObj.series.length > 0) {
        var ThisSeriesColor="#2F93D9";
        for (var i = 0; i < ThisChartObj.series.length; i++) {
            if(ThisChartObj.series[i].color !== undefined){
                if(typeof(ThisChartObj.series[i].color)==="string"){
                    ThisSeriesColor=ThisChartObj.series[i].color;
                }else{
                    ThisSeriesColor=ThisChartObj.series[i].color.stops[0][1];
                }
            }
            $("#menuBasichartseriesdiv").append("<div class='BschartSerieslablesty'>" +
//                "<div style='width:10px; height:10px; line-height: 30px; background-color:" + ThisChartObj.series[i].color + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                "<div style='width:10px; height:10px; line-height: 30px; background-color:" + ThisSeriesColor + "; float: left; margin-top:10px;border-radius: 5px;'></div>" +
                "<div class='BschartSeriesname' id='Sel" + ThisChartObj.series[i].name + "' title='"+ThisChartObj.series[i].name+"'>"
                + ThisChartObj.series[i].name + "</div>" +
                "<div class='BschartseriesImgsty' id='remove" + ThisChartObj.series[i].name + "'></div>" +
                "<div class='clearfloat'></div></div>");
        }
        $("#menuBasichartseriesdiv").append("<div style='clear:both;'></div>");
        $("#menuBasichartseriesdiv").css("left",($("#"+ControlEditPanelID).width()-120)+"px");
        $("#menuBasichartseriesdiv").css("top","10px");
        ThisSeriesColor=null;//清空局部变量
    }
    $(".BschartSeriesname").die("click");
    $(".BschartseriesImgsty").die("click");

    $(".BschartSeriesname").live("click",function(ev){
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
            Agi.Controls.BasicChartSeriesSelected(_BasicChart,SelSeries.name);//Series选中
        }
    })
    $(".BschartseriesImgsty").live("click",function(ev){
        var _obj=this;
        var removeseriesname = _obj.id.substr(_obj.id.indexOf("remove") + 6, _obj.id.length - 6);
        $(_obj).parent().remove();
        _BasicChart.RemoveSeries(removeseriesname);/*移除线条*/
    })
}

//Chart Series 选中
Agi.Controls.BasicChartSelSeriesName=null;
Agi.Controls.BasicChartSeriesSelected=function(_BasicChart,_SeriesName){
    $("#TxtProPanelLineName").val(_SeriesName);//SeriesName
    var ThisSeriesData=_BasicChart.Get("ChartData");//ChartData
    var ThisSelSeriesIndex=-1;
    for(var i=0;i<ThisSeriesData.length;i++){
        if(ThisSeriesData[i].name===_SeriesName){
            ThisSelSeriesIndex=i;
            break;
        }
    }
    if(ThisSelSeriesIndex>-1){
        Agi.Controls.BasicChartSelSeriesName=ThisSeriesData[ThisSelSeriesIndex].name;
        //选中Series 相关属性显示
        Agi.Controls.ControlColorApply.fColorControlValueSet("BsicChartLineColorSel",ThisSeriesData[ThisSelSeriesIndex].color,false);
        $("#BasicChartLine_Tips").find("option[value='"+Agi.Controls.BasicChart.BolTrue_FalseTostring(ThisSeriesData[ThisSelSeriesIndex].ExtData.Tips.enabled)+"']").attr("selected","selected");
        $("#BasicChartLine_Lable").find("option[value='"+Agi.Controls.BasicChart.BolTrue_FalseTostring(ThisSeriesData[ThisSelSeriesIndex].ExtData.dataLabels.enabled)+"']").attr("selected","selected");
        $("#BasicChartLine_Markerenabled").find("option[value='"+Agi.Controls.BasicChart.BolTrue_FalseTostring(ThisSeriesData[ThisSelSeriesIndex].ExtData.Marker.enabled)+"']").attr("selected","selected");
        $("#BasicChartLine_Markerstyle").find("option[value='"+ThisSeriesData[ThisSelSeriesIndex].ExtData.Marker.symbol+"']").attr("selected","selected");
        $("#BasicChartLine_Markersize").val(ThisSeriesData[ThisSelSeriesIndex].ExtData.Marker.radius);
        Agi.Controls.ControlColorApply.fColorControlValueSet("BasicChartLine_MarkerColor",ThisSeriesData[ThisSelSeriesIndex].ExtData.Marker.fillColor,false);
    }
}

/*Chart 基准线相关处理-------------------------------------------------------------------*/
Namespace.register("Agi.Controls.BasicChart");/*添加 Agi.Controls.BasicChart命名空间*/
//判断相应名称的基准线是否已存在
Agi.Controls.BasicChart.StandLineIsExt=function(_standlines,_LineName){
   var bolIsExt=false;
    if(_standlines!=null && _standlines.length>0){
        for(var i=0;i<_standlines.length;i++){
            if(_standlines[i].LineTooTips==_LineName){
                bolIsExt=true;
                break;
            }
        }
    }
    return bolIsExt;
}
//根据基准线ID获取相应的基准线
Agi.Controls.BasicChart.GetStandardLine=function(_standlines,_LineID){
    if(_standlines!=null && _standlines.length>0){
        for(var i=0;i<_standlines.length;i++){
            if(_standlines[i].LineID==_LineID){
                return _standlines[i];
            }
        }
    }
    return null;
}
//根据基准线名称获取基准线ID
Agi.Controls.BasicChart.GetStandardLineIDByName=function(_standlines,_LineName){
    if(_standlines!=null && _standlines.length>0){
        for(var i=0;i<_standlines.length;i++){
            if(_standlines[i].LineTooTips==_LineName){
                return _standlines[i].LineID;
            }
        }
    }
    return null;
}
/*获取坐标范围值，格式如："M 109.5 433 L 109.5 438" */
Agi.Controls.BasicChart.GetPostionObjByXYStr=function(_XY){
    var PostionArray=_XY.split(" ");
    return {StartX:parseInt(PostionArray[1]),StartY:parseInt(PostionArray[2]),EndX:parseInt(PostionArray[4]),EndY:parseInt(PostionArray[5])};
}
/*根据基准线格式化图表线条数据*/
/*
 * _ChartSeriesData,对象，元素包含属性{name,data:数组，元素为对象，包含属性：{name,x,y},type,color,Entity,XColumn,YColumn}
 * _ChartStandLines,数组，元素包含属性：{LineID,LineType,LineColor,LineSize,LineDir,LineValue,LineTooTips}
 * */
Agi.Controls.BasicChart.GetStandLineDataArray=function(_ChartSeriesData,_ChartStandLines){
    var  ReturnData=_ChartSeriesData.data;
    if(_ChartStandLines!=null && _ChartStandLines.length>0){
        for(var i=0;i<_ChartStandLines.length;i++){
                ReturnData=Agi.Controls.BasicChart.GetChartSeriesDataBy_Standardline(_ChartSeriesData,_ChartStandLines[i].LineValue,{Type:_ChartSeriesData.type,Color:_ChartSeriesData.color},_ChartStandLines);
        }
    }else{
        ReturnData=Agi.Controls.BasicChart.GetChartSeriesDataBy_Standardline(_ChartSeriesData,null,{Type:_ChartSeriesData.type,Color:_ChartSeriesData.color},_ChartStandLines);
    }
    return ReturnData;
}
/*-------基准线拖动更改点颜色---------*/
/*更改点的颜色*/
Agi.Controls.BasicChart.GetChartSeriesDataBy_Standardline=function(_ChartSeriesData,StanrdValue,_ChartTypePar,_StandardLines){
    var  ReturnData=[];
    var _ChartDataArray=_ChartSeriesData.data;
    if(_ChartDataArray!=null && _ChartDataArray.length>0){
        if(_ChartTypePar.Type==="column" || _ChartTypePar.Type==="bar"){
            for(var i=0;i<_ChartDataArray.length;i++){
                ReturnData.push({name:_ChartDataArray[i].name,x:_ChartDataArray[i].x,y:_ChartDataArray[i].y,color:Agi.Controls.BasicChart.GetColumnSty(_ChartDataArray[i].y,StanrdValue,_ChartTypePar.Color,_StandardLines),dataLabels:_ChartSeriesData.ExtData.dataLabels});
            }
        }else{
            for(var i=0;i<_ChartDataArray.length;i++){
                ReturnData.push({name:_ChartDataArray[i].name,x:_ChartDataArray[i].x,y:_ChartDataArray[i].y,marker:Agi.Controls.BasicChart.GetMarkrSty(_ChartDataArray[i].y,StanrdValue,_StandardLines,_ChartSeriesData.ExtData,_ChartTypePar),dataLabels:_ChartSeriesData.ExtData.dataLabels});
            }
        }
    }
    return ReturnData;
}
/*判断值是否符合条件*/
Agi.Controls.BasicChart.GetMarkrSty=function(_Value,_CompareValue,_StandardLines,_ExData,_chartype){
    var MarkerFillColor=Agi.Controls.BasicChart.GetPointColorByStandardLinds(_StandardLines,_Value);
    if(MarkerFillColor!=null && MarkerFillColor!=""){
        var thismarkerdata=Agi.Controls.BasicChart.SeriesExDefaultDataCopy(_ExData)
        if(_chartype.Type==="pie"){
            thismarkerdata.Marker.fillColor="";
        }else{
            thismarkerdata.Marker.fillColor=MarkerFillColor;
        }
        return thismarkerdata.Marker;
    }else{
        if(_chartype.Type==="pie"){
            _ExData.Marker.fillColor="";
        }
        return _ExData.Marker;
    }
}
//获取柱状图点的样式
Agi.Controls.BasicChart.GetColumnSty=function(_Value,_CompareValue,_OldColor,_StandardLines){
    var ColumnColor=Agi.Controls.BasicChart.GetPointColorByStandardLinds(_StandardLines,_Value);
    if(ColumnColor!=null && ColumnColor!=""){
        return ColumnColor;
    }else{
        return _OldColor;
    }
}
//获取点的颜色，根据基准线
Agi.Controls.BasicChart.GetPointColorByStandardLinds=function(_StandardLines,_PointValue){
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
Agi.Controls.BasicChart.IsStartDragStandLine=false;
/*基准线拖拽开始事件添加*/
Agi.Controls.BasicChart.BindStandardLineStartEndEvent=function(_Element){
    if ("createTouch" in document) {
        $(_Element).bind("touchstart",function(){
            Agi.Controls.BasicChart.IsStartDragStandLine=true;
        });
        $(_Element).bind("touchend",function(){
            Agi.Controls.BasicChart.IsStartDragStandLine=false;
        });
    }else{

        $(_Element).bind("mousedown",function(){
            Agi.Controls.BasicChart.IsStartDragStandLine=true;
        });
        $(_Element).bind("mouseup",function(){
            Agi.Controls.BasicChart.IsStartDragStandLine=false;
        });
    }
}
/*显示基准线菜单*/
Agi.Controls.BasicChart.ShowStandardLineMenu=function(_BasicChart){
    //7.显示StandardLine面板
    if($("#BasichartStandardLinemenudiv").length>0){
        $("#BasichartStandardLinemenudiv").remove();
    }
    if(Agi.Controls.IsControlEdit){
        var ControlEditPanelID=_BasicChart.Get("HTMLElement").id;
        var ChartStandardLineMenuPanel=null;

        ChartStandardLineMenuPanel=$("<div id='BasichartStandardLinemenudiv' class='BschartStandardLinemenudivsty'></div>");
        ChartStandardLineMenuPanel.appendTo($("#"+ControlEditPanelID));
        ChartStandardLineMenuPanel.html("");
        var ThisChartProPerty=_BasicChart.Get("ProPerty");
        var NewChartStandardLines=_BasicChart.Get("StandardLines");//获取图表的基准线信息
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
            Agi.Controls.BasicChart.StandardLineSelected(_BasicChart,this.innerText);//相应基准线已选中
        })
        /*2.移除基准线 */
        $(".BschartStandardLineImgsty").die("click");
        $(".BschartStandardLineImgsty").live("click",function(ev){
            var _obj=this;
            var removestandartlineID = _obj.id;
            $(_obj).parent().remove();
            _BasicChart.RemoveStandardLine(removestandartlineID);
        })
    }

};
/*Chart 基准线选中*/
Agi.Controls.BasicChart.StandardLineSelected=function(_BasicChart,_StandardLineName){
    var chartStandLines=_BasicChart.Get("StandardLines");//获取图表的基准线信息
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
            $("#basicchart_standardline_type").find("option[value='"+SelLineInfo.LineType+"']").attr("selected","selected");
//            $("#basicchart_standardline_color").spectrum("set",SelLineInfo.LineColor);
            Agi.Controls.ControlColorApply.fColorControlValueSet("basicchart_standardline_color",SelLineInfo.LineColor,false);//赋值默认颜色
            $("#basicchart_standardline_size").val(SelLineInfo.LineSize);
            $("#basicchart_standardline_dir").find("option[value='"+SelLineInfo.LineDir+"']").attr("selected","selected");
            $("#basicchart_standardline_value").val(SelLineInfo.LineValue);

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
Agi.Controls.BasicChart.SeriesExDefaultDataInfo=function(_defaultColor,_ChartTips){
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
Agi.Controls.BasicChart.SeriesExDefaultDataCopy=function(_OldData){
    var thisNewData=Agi.Controls.BasicChart.SeriesExDefaultDataInfo(_OldData.Marker.fillColor,_OldData.Tips);
    thisNewData.dataLabels.enabled=_OldData.dataLabels.enabled;
    thisNewData.Tips.enabled=_OldData.Tips.enabled;
    thisNewData.Marker.enabled=_OldData.Marker.enabled;
    thisNewData.Marker.lineColor=_OldData.Marker.lineColor;
    thisNewData.Marker.lineWidth=_OldData.Marker.lineWidth;
    thisNewData.Marker.radius=_OldData.Marker.radius;
    thisNewData.Marker.symbol=_OldData.Marker.symbol;
    return thisNewData;
}
Agi.Controls.BasicChart.BolTrue_False=function(_strbolvalue){
   if(_strbolvalue==="true"){
       return true;
   }else{
       return false;
   }
}
Agi.Controls.BasicChart.BolTrue_FalseTostring=function(_bolvalue){
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
Agi.Controls.BasicChart.UpSeriesTypeByThisType=function(_ControlObj,_ChartData,_index,_thistype,_linetype){
    //line,column,area,stackedpercentcolumn,stackedcolumn,bar,stackedbar,stackedpercentbar
    if(_ChartData!=null && _ChartData.length>0 && _index>-1){
        if(_thistype==="line" || _thistype==="column"  || _thistype==="area" || _thistype==="pie" || _thistype==="stackedpercentcolumn" || _thistype==="stackedcolumn"){
            var bolIsbar=Agi.Controls.BasicChart.ThisChartIsBar(_ChartData);
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

                _SeriesData.SeriesExData=Agi.Controls.BasicChart.SeriesExDefaultDataInfo(_ChartData[_index].color,null);//基本信息
                _SeriesData.SeriesExData.dataLabels.enabled=_ChartData[_index].ExtData.dataLabels.enabled;//dataLabels是否可用
                _SeriesData.SeriesExData.Tips.enabled=_ChartData[_index].ExtData.Tips.enabled;//Tips是否可用
                _SeriesData.SeriesExData.Marker.enabled=true;//Marker是否可用
                $("#BasicChartLine_Markerenabled").find("option[value='true']").attr("selected","selected");//是否禁用Marker,页面选项

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
Agi.Controls.BasicChart.ThisChartIsBar=function(_ChartData){
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
Agi.Controls.BasicChart.LoadALLEntityData=function(MeEntitys,thisindex,THisChartDataArray,ChartXAxisArray,XTimeFormat,_callBackFun){
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
                        THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray,Agi.Controls.BasicChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]),100,XTimeFormat));
                    }
                    _callBackFun();
                } else {
                    Agi.Controls.BasicChart.LoadALLEntityData(MeEntitys, (thisindex + 1), THisChartDataArray, ChartXAxisArray,XTimeFormat,_callBackFun);
                }
            });
        }
        else {
            if (thisindex === (MeEntitys.length - 1)) {
//                for (var i = 0; i < MeEntitys.length; i++) {
//                    THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray, Agi.Controls.EntityDataConvertToArrayByColumns(MeEntitys[i], [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]));
//                }
                for (var i = 0; i < THisChartDataArray.length; i++) {
                    THisChartDataArray[i].data = Agi.Controls.ChartDataConvert(ChartXAxisArray,Agi.Controls.BasicChart.DataExtract(Agi.Controls.EntityDataConvertToArrayByColumns(THisChartDataArray[i].Entity, [THisChartDataArray[i].XColumn, THisChartDataArray[i].YColumn]),100,XTimeFormat));
                }
               _callBackFun();
            } else {
                Agi.Controls.BasicChart.LoadALLEntityData(MeEntitys, (thisindex + 1), THisChartDataArray, ChartXAxisArray,XTimeFormat,_callBackFun);
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
Agi.Controls.BasicChart.OptionsAppSty=function(_SeriesData,_ChartType,_StyConfig,_Options){
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
                _SeriesData[i].color=Agi.Controls.BasicChart.OptionsAppStyGetColorByIndex(i,_StyConfig.SeriesColors);
            }
        }
    }
}
//根据Series 索引获取对应的默认显示显示
Agi.Controls.BasicChart.OptionsAppStyGetColorByIndex=function(_index,_ColorArray){
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
Agi.Controls.BasicChart.GetManagerThemeInfo=function(_ControlObj,_ThemeValue){
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
            stacking:seriesStacking,
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
Agi.Controls.BasicChart.DialogManager=function(_Controlobj,TipInfo,OkCallBackFun){
    $("#progressbar1").find(".progressBar").hide();//隐藏进度条
    var BasiChartDialogContent="<div id='BasicChartDialogPanel' class='BasicChartDialogPanelSty'>" +
    "<div class='BasicChartDialogPanelTitlesty'>"+TipInfo+"</div>"+
    "<div><div id='BasicChartDialogOK' class='btn'>确定</div><div id='BasicChartDialogCancel' class='btn'>取消</div></div>"+
    "</div>";
    $('#progressbar1').append(BasiChartDialogContent);
    $('#progressbar1').show().find(".btn").click(function(ev){
        if(this.id=="BasicChartDialogOK"){
            $("#BasicChartDialogPanel").remove();//移除确认选择对话框
            $('#progressbar1').hide();//隐藏遮罩背景
            OkCallBackFun();//执行回调
        }else{
            $("#BasicChartDialogPanel").remove();//移除确认选择对话框
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
Agi.Controls.BasicChart.RemoveSeriesUpEntityArray=function(_Controlobj,_EntityKey,_THisChartDataArray){
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
Agi.Controls.BasicChart.BackgroundApply=function(_ControlObj,_BackGroudObj){
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
    _ControlObj.RefreshStandLines();//更新基准线
}
//背景颜色值获取
Agi.Controls.BasicChart.BackgroundValueGet=function(_oBackgroundObj){
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
Agi.Controls.BasicChart.XAsixApply=function(_ControlObj,_XAsixObj){

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

        var XFormatAppMsg=Agi.Controls.BasicChart.XAsixTimeFormat(_ControlObj,_XAsixObj.XTimeFormat);
        if(XFormatAppMsg.State){
            _ChartOptions.xAxis.XTimeFormat=_XAsixObj.XTimeFormat;//:yyyy-mm-dd hh:mm:ss yyyy/mm/dd hh:mm:ss yyyy年MM月dd日 hh时mm分ss秒 yyyy年MM月dd日 MM/dd/yyyy MM-dd-yyyy
        }else{
            AgiCommonDialogBox.Alert(XFormatAppMsg.MsgDetail);
        }

    }
    //4.重新赋值ChartOptions与样式名称
    _ControlObj.Set("ChartOptions",_ChartOptions);

    //5.控件刷新显示
    _ControlObj.Refresh();//刷新显示
    _ControlObj.RefreshStandLines();//更新基准线
}

/*XAsix设置*/
Agi.Controls.BasicChart.YAsixApply=function(_ControlObj,_YAsixObj){
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
    _ControlObj.RefreshStandLines();//更新基准线
}
//endregion

//region 20130201 10:17 数据优化处理,数据量截取
Agi.Controls.BasicChart.DataExtract=function(_EntityDataArray,_MaxRow,XTimeFormat){
    if(_EntityDataArray!=null && _EntityDataArray.length>0){
//        if(_EntityDataArray.length>_MaxRow){
//            _EntityDataArray.splice(_MaxRow,(_EntityDataArray.length-_MaxRow));
//        }

        if(XTimeFormat!=null && XTimeFormat!="" && XTimeFormat!="none"){
                for (var i = 0; i < _EntityDataArray.length; i++) {
                    if(_EntityDataArray[i][0].length!=10 && _EntityDataArray[i][0].length!=19){
                        break;
                    }
                    _EntityDataArray[i][0]=Agi.Controls.BasicChart.TimeStrConverToTime(_EntityDataArray[i][0]).format(XTimeFormat);
                }
            }
    }
    return _EntityDataArray;
}
//endregion

Agi.Controls.BasicChart.ColorGradientApplay=function(ThisChartSeriesData,_Colors){
    var oCloneData=[];
    if(ThisChartSeriesData!=null && ThisChartSeriesData.length>0){
        if(ThisChartSeriesData[0].type==="pie"){
            for(var i=0;i<ThisChartSeriesData.length;i++){
                oCloneData.push(Agi.Controls.BasicChart.PieSeriesColorGradientApplay(ThisChartSeriesData[i],_Colors));
            }
        }else{
            for(var i=0;i<ThisChartSeriesData.length;i++){
                oCloneData.push(Agi.Controls.BasicChart.ColumnSeriesColorGradientApplay(ThisChartSeriesData[i]));
            }
        }
    }
    return oCloneData;
}
Agi.Controls.BasicChart.ColumnSeriesColorGradientApplay=function(_SeriesData){
    var oCloneData=Agi.Script.CloneObj(_SeriesData);
    var bolIsExtColumnSeries=false;
    if(oCloneData.type==="column" || oCloneData.type==="bar"){
        if(oCloneData.data[0].color!=null && oCloneData.data[0].color!=""){
            for(var dataindex=0;dataindex<oCloneData.data.length;dataindex++){
                if(typeof(oCloneData.data[dataindex].color)==="string"){
                    oCloneData.data[dataindex].color={
                        linearGradient:{"x1":0,"y1":0,"x2":1,"y2":0},
                        stops: [[0,oCloneData.data[dataindex].color],[0.499,'#ffffff'],[0.5,'#ffffff'],[1,oCloneData.data[dataindex].color]]
                    }
                }
            }
        }else{
            if(typeof(oCloneData.color)==="string"){
                oCloneData.color={
                    linearGradient:{"x1":0,"y1":0,"x2":1,"y2":0},
                    stops: [[0,oCloneData.color],[0.499,'#ffffff'],[0.5,'#ffffff'],[1,oCloneData.color]]
                }
            }
        }
        //region  20130517 16:36 markeluo 添加(解决基本图表column和bar添加渐变支持后导致的负数值的点不能显示的问题)
        oCloneData.marker=null;
       //endregion 20130517 16:36 markeluo
    }else{
        if(oCloneData.type==="area" && typeof(oCloneData.color)==="string"){
            oCloneData.color={
                linearGradient:{"x1":0,"y1":0,"x2":0,"y2":1},
                stops: [[0,oCloneData.color],[0.2,oCloneData.color],[1,'rgba(224,224,224,0)']]
            }
        }
    }
    return oCloneData;
}
Agi.Controls.BasicChart.PieSeriesColorGradientApplay=function(_SeriesData,_Colors){
    var oCloneData=Agi.Script.CloneObj(_SeriesData);
    //饼图的特殊化处理
    oCloneData.color=null;
    for(var j=0;j<oCloneData.data.length;j++){
        if(j<(_Colors.length-1)){
            if(oCloneData.data[j].marker){
                oCloneData.data[j].marker.fillColor=_Colors[j];
                oCloneData.data[j].color=_Colors[j];
            }else{
                oCloneData.data[j].color=_Colors[j];
                oCloneData.data[j].marker={"enabled":false,"fillColor":_Colors[j],"lineColor":"","lineWidth":0,"radius":0,"symbol":"circle"};
            }
        }else{
            if(oCloneData.data[j].marker){
                oCloneData.data[j].marker.fillColor="";
                oCloneData.data[j].color="";
            }else{
                oCloneData.data[j].color="";
                oCloneData.data[j].marker={"enabled":false,"fillColor":"","lineColor":"","lineWidth":0,"radius":0,"symbol":"circle"};
            }
        }

    }
    return oCloneData;
}
//region X轴 时间类型格式化
Agi.Controls.BasicChart.XAsixTimeFormat=function(_Control,_TimeFormatstr){
    var Msg={State:true,MsgDetail:"格式化完成！"};
    var ThisChartOptions=_Control.Get("ChartOptions");
    if(ThisChartOptions.xAxis.XTimeFormat!=null && ThisChartOptions.xAxis.XTimeFormat!="" && ThisChartOptions.xAxis.XTimeFormat!="none"){
        if(ThisChartOptions.xAxis.XTimeFormat==_TimeFormatstr){
        }else{
            ThisChartOptions.xAxis.XTimeFormat=_TimeFormatstr;
            _Control.UpDateSeriesData();//更新实体数据
        }
    }else{
        if(_TimeFormatstr=="none"){
        }else{
            var ThisChartXAxisArray=_Control.Get("ChartXAxisArray");
            if(ThisChartXAxisArray!=null && ThisChartXAxisArray.length>0){
                var NewxAxiscategories=[];
                for(var i=0;i<ThisChartXAxisArray.length;i++){
                    if(ThisChartXAxisArray[i].length!=10 && ThisChartXAxisArray[i].length!=19){
                        Msg.State=false;
                        Msg.MsgDetail="无法进行时间格式化，类型不正确!"
                        break;
                    }
                    NewxAxiscategories[i]=Agi.Controls.BasicChart.TimeStrConverToTime(ThisChartXAxisArray[i]).format(_TimeFormatstr);
                }

                ThisChartXAxisArray=NewxAxiscategories;
                _Control.Set("ChartXAxisArray",ThisChartXAxisArray);
                Agi.Controls.BasicChart.SeriesDataUpByXAxiscategories(_Control.Get("ChartData"),NewxAxiscategories);
            }
        }
    }
    return Msg;
}

Agi.Controls.BasicChart.TimeStrConverToTime=function(c_date){
    var date = null;
    if (!c_date)
        return date;
    var DateType=0;
    var tempArray = c_date.split("-");
    if (tempArray.length != 3) {
        tempArray = c_date.split("/");
        if (tempArray.length != 3) {
            return date;
        }
        DateType=1;
    }
    var dateArr = c_date.split(" ");
    if (dateArr.length == 2) {
        var yymmdd = dateArr[0].split("-");
        if(DateType==1){
            yymmdd = dateArr[0].split("/");
        }
        var hhmmss = dateArr[1].split(":");
        date = new Date(yymmdd[0], yymmdd[1] - 1, yymmdd[2], hhmmss[0], hhmmss[1], hhmmss[2]);
    } else {
        date = new Date(tempArray[0], tempArray[1] - 1, tempArray[2], 00, 00, 01);
    }
    return date;
}
Agi.Controls.BasicChart.SeriesDataUpByXAxiscategories=function(THisChartDataArray,_XAxiscategories){
    for (var i = 0; i < THisChartDataArray.length; i++) {
        if(THisChartDataArray[i].data!=null && THisChartDataArray[i].data.length>0)
        {
            for(var j=0;j<THisChartDataArray[i].data.length;j++){
                THisChartDataArray[i].data[j].name=_XAxiscategories[THisChartDataArray[i].data[j].x];
            }
        }
    }
}
//endregion

//region 多参数联动Bug修复 20130503
Agi.Controls.BasicChart.UpdateParameters=function(_ChartObj){
    var ThisChartXAxisArray = _ChartObj.Get("ChartXAxisArray"); /*获取图表Chart X轴相应的显示点集合*/
    var thischartSeriesData = _ChartObj.Get("ChartData"); //图表数据
    var _Array=null;
    if(ThisChartXAxisArray!=null && ThisChartXAxisArray.length>0 && thischartSeriesData.length>0){
        _Array=[ThisChartXAxisArray[0],thischartSeriesData[0].data[0].y];
    }
    if(_Array!=null){

        //输出参数
        var OutPramats = { "XValue":_Array[0], "YValue":_Array[1]};
        _ChartObj.Set("OutPramats", OutPramats); /*输出参数名称集合*/

        var THisOutParats = [];
        if (OutPramats != null) {
            for (var item in OutPramats) {
                THisOutParats.push({ Name: item, Value: OutPramats[item] });
            }
        }
        Agi.Msg.PageOutPramats.AddPramats({
            "Type": Agi.Msg.Enum.Controls,
            "Key": _ChartObj.Get("ProPerty").ID,
            "ChangeValue": THisOutParats
        });
    }
}
//endregion

//region 20140208 10:56 根据数据量设定X轴步长
Agi.Controls.BasicChart.SetxAsixTickInterval=function(_ChartOption){
    if(_ChartOption!=null && _ChartOption.xAxis!=null){
        var MaxNum=0;
        if(_ChartOption.series!=null && _ChartOption.series.length>0){
            for(var i=0;i<_ChartOption.series.length;i++){
                if(_ChartOption.series[i].data.length>MaxNum){
                    MaxNum=_ChartOption.series[i].data.length;
                }
            }
        }
        if(MaxNum>0){

            if(MaxNum>20){
                _ChartOption.xAxis.tickInterval=parseInt(MaxNum/20)+1;
            }else{
                _ChartOption.xAxis.tickInterval=null;
            }
        }else{
            _ChartOption.xAxis.tickInterval=null;
        }
    }
}
//endregion