/**
* Created with JetBrains WebStorm.
* User: markeluo
* Date: 12-8-20
* Time: 下午5:43
* To change this template use File | Settings | File Templates.
* BasicChart:基础Chart
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/
Agi.Controls.BoxChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
{
    GetEntityData: function () {//获得实体数据
        var entity = this.Get('Entity')[0];
        if (entity != undefined && entity != null) {
            return entity.Data;
        } else {
            return null;
        }
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
        //20130522 倪飘 解决bug，业务控件-箱线图，在未拖入数据时，点击预览按钮，预览页面未显示展示图形
        if (_EntityInfo != undefined) {
            var entity = [];
            entity.push(_EntityInfo);
            Me.chageEntity = true;
            Me.Set("Entity", entity);
            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
                _EntityInfo.Data = d.Data;
                _EntityInfo.Columns = d.Columns;
                //            if(d!=null && d.length>0){
                //                _EntityInfo.Columns.length=0;
                //                for (var _param in d[0]) {
                //                    _EntityInfo.Columns.push(_param);
                //                }
                //            }
                var BoxChartIsCreate = Me.Get("IsCreateControls"); //创建控件
                if (BoxChartIsCreate != null && BoxChartIsCreate) {
                    Me.ReadOtherData(); //显示图表
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.ShowControlData(Me); //更新实体数据显示
                    }
                } else {
                    Me.AddEntity(_EntityInfo); /*添加实体*/
                }
            });
        }
        else {
            var BoxChartIsCreate = Me.Get("IsCreateControls"); //创建控件
            if (BoxChartIsCreate != null && BoxChartIsCreate) {
                Me.ReadOtherData(); //显示图表
                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(Me); //更新实体数据显示
                }
            }
            }
    },
    ReadOtherData: function () {
        var chart = null;
        var Me = this;
        var MePrority = Me.Get("ProPerty");
        var HTMLElement = this.shell.Container.find('#'+this.shell.BasicID)[0];//Me.Get("HTMLElement");
        var BoxChartProperty = MePrority.BasciObj;
        var boxChartId = HTMLElement.id;
        if (FusionCharts("_" + boxChartId)) {
            FusionCharts("_" + boxChartId).dispose();
        }
        chart = new FusionCharts("JS/Controls/BoxChart/image/BoxAndWhisker2D.swf", "_" + boxChartId, "100%", "100%", "0");
        chart.options.renderer == "javascript";
        chart.setJSONData(BoxChartProperty);
        chart.render(HTMLElement);
    },
    ChangeTheme: function (_themeName) {
        var Me = this;
        //保存主题样式
        Me.Set("ThemeInfo", _themeName);
        Me.ReadOtherData();
    }, //更改样式
    ReadRealData: function () {
    },
    AddEntity: function (_entity) {
        if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
            var Me = this;
            var BoxChartProPerty = this.Get("ProPerty").BasciObj;
            var category = [];
            var data = [];
            var outliers = "";
            var dataArray = [];
            //            for (var columnName in _entity.Data[0]) {
            //                var columns = "";
            //                var outliersArray = []
            //                category.push(
            //                        { "label": columnName }
            //                    );
            //                for (var j = 0; j < _entity.Data.length; j++) {
            //                    columns += _entity.Data[j][columnName] + ",";
            //                    outliersArray.push(_entity.Data[j][columnName]);
            //                }
            //                if (columns.length > 0) {
            //                    columns = columns.substring(0, columns.length - 1);
            //                }
            //                data.push(
            //                        { "value": columns, "outliers": "" }
            //                    );
            //                dataArray.push(outliersArray);
            //            }

            /*20121122 markeluo SPC图修改  NO:201211220942 start
            _entity.Columns[0] 值,_entity.Columns[1] 分组条件(即箱);
            * */
            var ConvertData = Agi.Controls.BoxChartDataConvert(_entity);
            category = ConvertData.category;
            data = ConvertData.data;
            dataArray = ConvertData.DataArray;

            BoxChartProPerty.chart.yaxisMaxvalue = (ConvertData.maxValue + parseInt(ConvertData.maxValue / 10)); //y轴最大值
            BoxChartProPerty.chart.yAxisMinValue = (ConvertData.minValue - parseInt(ConvertData.minValue / 10)); //y轴最小值
            /*20121122 markeluo SPC图修改  NO:201211220942 end*/
            BoxChartProPerty.categories[0].category = category;
            BoxChartProPerty.dataset[0].data = data;
            var jsonData = { "action": "RCalBoxplot",
                "dataArray": dataArray
            };
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({ "MethodName": "RCalBoxplot", "Paras": jsonString, "CallBackFunction": function (_result) {
                if (_result.result == "true") {
                    var _BoxData = _result.data;
                    for (var k = 0; k < _BoxData.length; k++) {
                        var outliersArray = _BoxData[k].anomalousArray;
                        if (outliersArray.length > 0) {
                            var outliers = "";
                            for (var j = 0; j < outliersArray.length; j++) {
                                outliers += outliersArray[j] + ",";
                            }
                            outliers = outliers.substring(0, outliers.length - 1);
                            BoxChartProPerty.dataset[0].data[k].outliers = outliers;
                        }
                    }
                    Me.ReadOtherData();
                }
            }
            });
            //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(Me); //更新实体数据显示
            }
        } else {
            var Me = this;
            var BoxChartProPerty = this.Get("ProPerty").BasciObj;
            BoxChartProPerty.categories[0].category = [];
            BoxChartProPerty.dataset[0].data = [];
            Me.ReadOtherData();
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
        Agi.Utility.RequestData2(entity[0], function (d) {
            entity[0].Data = d.Data;
            entity[0].Columns = d.Columns;
            Me.AddEntity(entity[0]); /*添加实体*/
        });
    }, //参数联动
    Init: function (_Target, _ShowPosition) {
        var Me = this;
        this.AttributeList = [];
        Me.Set("Entity", []);
        Me.Set("ControlType", "BoxChart1");
        var ID = "BoxChart1" + Agi.Script.CreateControlGUID();
        var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty BoxChartPanelSty'></div>");
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
            HTMLElementPanel.width(602);
            HTMLElementPanel.height(402);
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
            BasciObj: null
        };
        var BoxChartProperty = {
            "chart": {
                "yAxisName": "BoxChart", //Y轴名称
                "bgColor": "ffffff",
                "canvasBorderThickness": "1", //画布边框厚度
                "canvasBorderColor": "8baccd",
                "showborder": "0", //是否显示边框
                "outliericonshape": "spoke",
                "outliericonsides": "0",
                "yaxisMaxvalue": "90", //y轴最大值
                "yAxisMinValue": "0", //y轴最大值
                "plotSpacePercent": "60",
                "numdivlines": "0", //网格线条
                "baseFontSize": "11", //字体大小
                "baseFontColor": "000000",
                "showDivLinue": "1"//是否显示水平分割线的值
            },
            "categories": [
                {
                    "category": [
                        {
                            "label": "CCS/B"
                        }
                    //                        ,
                    //                        {
                    //                            "label": "乙"
                    //                        },
                    //                        {
                    //                            "label": "丙"
                    //                        },
                    //                        {
                    //                            "label": "丁"
                    //                        }
                    ]
                }
            ],
            "dataset": [
                {
                    "upperboxcolor": "#2f94f8",
                    "lowerboxcolor": "#2f94f8",
                    "data": [
                        {
                            "value": "30115.37,30193.04,30105.89,30264.23,30431.68,28687.84,30331.02,28842.79,29867.65,30687.94,29980.09,30646.73,29868.41,29899.03,30237.32,32053.38,30260.71",
                            "outliers": "28687.84,28842.79,32053.38"
                        }
                    //                          ,
                    //                        {
                    //                            "value": "34,430,44,31",
                    //                            "outliers": ""
                    //                        },
                    //                        {
                    //                            "value": "12,13,15,19",
                    //                            "outliers": ""
                    //                        },
                    //                        {
                    //                            "value": "80,12,54,30,32",
                    //                            "outliers": ""
                    //                        }
                    ]
                }
            ]
        };
        ThisProPerty.BasciObj = BoxChartProperty;
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
                ev.stopPropagation();
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
        Me.ReadOtherData();
        //20130515 倪飘 解决bug，组态环境中拖入箱线图表以后拖入容器框控件，容器框控件会覆盖箱线图表控件（容器框控件添加背景色以后能够看到效果）
        Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
    },
    CustomProPanelShow: function () {
        Agi.Controls.BoxChartProrityInit(this);
    }, //显示自定义属性面板
    Destory: function () {
        var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
        var proPerty = this.Get("ProPerty");
        //        Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

        //        Agi.Edit.workspace.controlList.remove(this);
        //        Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
        //        Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

        $(HTMLElement).remove();
        HTMLElement = null;
        this.AttributeList.length = 0;
        proPerty = null;
        delete this;
    },
//    Copy: function () {
//        if (layoutManagement.property.type == 1) {
//            var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
//            var PostionValue = this.Get("Position");
//            var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//            var NewBoxChart = new Agi.Controls.BoxChart();
//            NewBoxChart.Init(ParentObj, PostionValue);
//            newPanelPositionpars = null;
//            return NewBoxChart;
//        }
//    },
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
            Agi.Controls.BoxChartProrityInit(Me);
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
        Agi.Controls.BoxChartAttributeChange(this, Key, _Value);
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
        ConfigObj.append("<BoxChart>" + JSON.stringify(ProPerty.BasciObj) + "</BoxChart>"); */
        /*控件属性*//*
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
        var BoxChartContorl = {
            Control: {
                ControlType: null, //控件类型
                ControlID: null, //控件ID
                BoxChart: null, //控件属性
                Entity: null, // 实体
                ControlBaseObj: null, //控件对象
                HTMLElement: null, //控件的外壳HTML元素信息
                Position: null, // 控件位置信息
                ThemeInfo: null
            }
        }// 配置信息数组对象
        BoxChartContorl.Control.ControlType = Me.Get("ControlType");
        BoxChartContorl.Control.ControlID = ProPerty.ID;
        BoxChartContorl.Control.BoxChart = ProPerty.BasciObj;
        BoxChartContorl.Control.Entity = Me.Get("Entity");
        BoxChartContorl.Control.ControlBaseObj = ProPerty.ID;
        BoxChartContorl.Control.HTMLElement = Me.Get("HTMLElement").id
        BoxChartContorl.Control.Position = Me.Get("Position");
        BoxChartContorl.Control.ThemeInfo = Me.Get("ThemeInfo");
        return BoxChartContorl.Control;
    }, //获得BasicChart控件的配置信息
    CreateControl: function (_Config, _Target) {
        var Me = this;
        Me.AttributeList = [];
        if (_Config != null) {
            if (_Target != null && _Target != "") {
                var _Targetobj = $(_Target);
                Me.Set("ControlType", "BoxChart1");

                var ID = _Config.ControlID;
                var BoxChartProPerty = _Config.BoxChart;
                var ThemeInfo = _Config.ThemeInfo;
                var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty BoxChartPanelSty'></div>");
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
                    BasciObj: BoxChartProPerty
                };
                Me.Set("HTMLElement", HTMLElementPanel[0]);
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
                Me.Set("ThemeInfo", ThemeInfo);
                obj = ThisProPerty = PagePars = PostionValue = null;
                //                Me.ReadOtherData();
                //                Me.Set("Entity", _Config.Entity); //实体
                Me.Set("IsCreateControls", true); //创建控件
                if (typeof (_Config.Entity) == "string") {
                    _Config.Entity = JSON.parse(_Config.Entity);
                }
                Me.ReadData(_Config.Entity[0]); //读取实体
            }
        }
    }, //根据配置信息创建控件
    AddStandardValueLine: function (_StandLineInfo, _bolIsAddList) {
    }, //20120913,添加基准线
    RemoveStandardLine: function (_LineID) {

    }, //移除基准线
    ReloadSeries: function () {

    }, //重新加载Series
    RefreshStandLines: function () {

    }, //20120913,更新基准线显示
    LoadStandardLineObjMenu: function (_ChartStandardLineObj, _Dir) {

    }, //加载基准线菜单
    RemoveStandardLines: function (ThisChartObj, _StandardLines) {

    }, //20120913,移除基准线
    InEdit: function () {
    }, //编辑中
    ExtEdit: function () {

    } //退出编辑
});
/*BasicChart参数更改处理方法*/
Agi.Controls.BoxChartAttributeChange = function (_ControlObj, Key, _Value) {
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
        var BoxChartProperty = ThisProPerty.BasciObj;
        BoxChartProperty.dataset[0].upperboxcolor = ChartStyleValue.upperboxcolor;
        BoxChartProperty.dataset[0].lowerboxcolor = ChartStyleValue.upperboxcolor;
        ThisProPerty.BasciObj = BoxChartProperty;
        _ControlObj.Set("ProPerty", ThisProPerty);
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitBoxChart1 = function () {
    return new Agi.Controls.BoxChart();
}
//BasicChart 自定义属性面板初始化显示
Agi.Controls.BoxChartProrityInit = function (_BoxChart) {
    var Me = _BoxChart;
    var ThisProPerty = Me.Get("ProPerty");
    var BoxChartProperty = ThisProPerty.BasciObj;
    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //属性配置
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
    '<table  class="prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
    '<tr>' +
    '<td class="prortityPanelTabletd0">名称:</td><td colspan="2" class="prortityPanelTabletd1"><input data-field="txtyAxisName" id="txtyAxisName" type="text" value="" class="ControlProTextSty" maxlength="10" ischeck="true"/></td>' +
    '<td   class="prortityPanelTabletd1"><input type="button" value="确定" id="btnBoxChart"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="prortityPanelTabletd0">字体大小：</td><td  class="prortityPanelTabletd1"><input data-field="FontSize" id="FontSize" type="number" value="8" min="8" max="50" defaultvalue="8"  class="ControlProNumberSty"/></td>' +
    '<td class="prortityPanelTabletd0">字体颜色：</td><td  class="prortityPanelTabletd1"><input class="BasicColor" type="text" data-field="FontColor" id="FontColor"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="prortityPanelTabletd0">Y轴上限：</td><td  class="prortityPanelTabletd1"><input data-field="YMax" id="YMax" type="number" value="100" min="100" max="100000" defaultvalue="100"  class="ControlProNumberSty"/></td>' +
    '<td class="prortityPanelTabletd0">Y轴下限：</td><td  class="prortityPanelTabletd1"><input data-field="YMin" id="YMin" type="number" value="0" min="0" max="100000" defaultvalue="0"  class="ControlProNumberSty"/></td>' +
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
    $("#txtyAxisName").val(BoxChartProperty.chart.yAxisName);
    $("#FontSize").val(BoxChartProperty.chart.baseFontSize);
    $("#FontColor").val(BoxChartProperty.chart.baseFontColor);
    //$("#boxcolor").val(BoxChartProperty.dataset[0].upperboxcolor);
    $("#YMax").val(BoxChartProperty.chart.yaxisMaxvalue);
    $("#YMin").val(BoxChartProperty.chart.yAxisMinValue);
    $('.prortityPanelTabletd1>input').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "txtyAxisName":
                BoxChartProperty.chart.yAxisName = $(this).val();
                break;
            case "FontSize":
                BoxChartProperty.chart.baseFontSize = $(this).val();
                break;
            case "YMax":
                BoxChartProperty.chart.yaxisMaxvalue = $(this).val();
                break;
            case "YMin":
                BoxChartProperty.chart.yAxisMinValue = $(this).val();
                break;
        }
    });
    $("#btnBoxChart").click(function () {
        ThisProPerty.BasciObj = BoxChartProperty;
        Me.Set("ProPerty", ThisProPerty);
        Me.ReadOtherData();
    });
    $('.BasicColor').spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['red', 'white'],
            ['blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50', 'black'],
            ['yellow', 'green'],
            ['blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function (color) {
            var pName = $(this).data('field');
            switch (pName) {
                case "FontColor":
                    BoxChartProperty.chart.baseFontColor = color.toHexString();
                    break;
            }

        }
    });
}
Agi.Controls.BoxChartDataConvert = function (EntityInfo) {
    var BoxNameArray = new Agi.Script.CArrayList();
    var BoxDataArray = new Agi.Script.CArrayList();
    var _Category = [];
    var _data = [];
    var maxValue = 0;
    var minValue = 0;

    var thisItem = null;
    var thisValue = null;
    var Itemindex = -1;
    for (var i = 0; i < EntityInfo.Data.length; i++) {
        thisItem = EntityInfo.Data[i][EntityInfo.Columns[1]];
        thisValue = eval(EntityInfo.Data[i][EntityInfo.Columns[0]]);
        if (BoxNameArray.contains(thisItem)) {
            Itemindex = BoxNameArray.indexOf(thisItem);
        } else {
            BoxNameArray.add(thisItem);
            _Category.push({ label: thisItem });
            Itemindex = BoxNameArray.size() - 1;
            BoxDataArray.add([]);
        }
        BoxDataArray.get(Itemindex).push(thisValue);
        if (thisValue > maxValue) {
            maxValue = thisValue;
            if (minValue == 0) {
                minValue = thisValue;
            }
        }
        if (thisValue > 0 && thisValue < minValue) {
            minValue = thisValue;
        }
    }
    var _DataArray = BoxDataArray.toArray();
    if (_DataArray != null && _DataArray.length > 0) {
        for (var i = 0; i < _DataArray.length; i++) {
            _data.push({ outliers: "", value: _DataArray[i].toString() });
        }
    }
    var ReturnObj = {
        category: _Category,
        data: _data,
        DataArray: _DataArray,
        maxValue: maxValue,
        minValue: minValue
    };
    return ReturnObj;
}
