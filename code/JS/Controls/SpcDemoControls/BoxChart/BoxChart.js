/**
* Created with JetBrains WebStorm.
* User: markeluo
* Date: 12-8-20
* Time: 下午5:43
* To change this template use File | Settings | File Templates.
* BasicChart:基础Chart
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/
Agi.Controls.SpcDemoBoxChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
{
    GetEntityData:function(){//获得实体数据
        var entity = this.Get('Entity')[0];
        if(entity !=undefined && entity !=null){
            return entity.Data;
        }else{
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
        var entity = [];
        entity.push(_EntityInfo);
        Me.chageEntity = true;
        Me.Set("Entity", entity);
        Agi.Utility.RequestData(_EntityInfo, function (d) {
            //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
            _EntityInfo.Data=d;
            if(d!=null && d.length>0){
                _EntityInfo.Columns.length=0;
                for (var _param in d[0]) {
                    _EntityInfo.Columns.push(_param);
                }
            }
            Me.AddEntity(_EntityInfo); /*添加实体*/
        });
    },
    ReadOtherData: function () {
        var chart = null;
        var Me = this;
        var MePrority = Me.Get("ProPerty");
        var HTMLElement = Me.Get("HTMLElement")
        var BoxChartProperty = MePrority.BasciObj;
        var boxChartId = $(HTMLElement).find('div')[0].id;
        if (FusionCharts("_" + boxChartId)) {
            FusionCharts("_" + boxChartId).dispose();
        }
        chart = new FusionCharts("JS/Controls/BoxChart/image/BoxAndWhisker2D.swf", "_" + boxChartId, "100%", "100%", "0");
        chart.options.renderer == "javascript";
        chart.setJSONData(BoxChartProperty);
        chart.render(boxChartId);

        $("#"+boxChartId +" .highcharts-container").css('background','none');
        $($('#'+boxChartId +' svg').find('rect')[2]).attr('fill','rgba(0,0,0,0)');
        $($('#'+boxChartId +' svg').find('rect')[3]).attr('fill','rgba(170,188,255,0.1)');
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

            var OriData=_entity.Data;
            for(var i=0;i<OriData.length;i++){
                category.push({ label: i+1 });
                if(i==3 || i==7||i==11|| i==15){
                    data.push({upperboxcolor: "#FEFF7C",lowerboxcolor: "#FEFF7C", outliers: "", value: OriData[i].Nber });
                }else{
                    data.push({ outliers: "", value: OriData[i].Nber });
                }
            }

            BoxChartProPerty.categories[0].category = category;
            BoxChartProPerty.dataset[0].data = data;

            Me.ReadOtherData();
            //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
            if(Agi.Controls.IsControlEdit){
                Agi.Controls.ShowControlData(Me);//更新实体数据显示
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
        Agi.Utility.RequestData(entity[0], function (d) {
            entity[0].Data = d;
            Me.AddEntity(entity[0]); /*添加实体*/
        });
    }, //参数联动
    Init: function (_Target, _ShowPosition) {
        var Me = this;
        this.AttributeList = [];
        Me.Set("Entity", []);
        Me.Set("ControlType", "SpcDemoBoxChart1");
        var ID = "SpcDemoBoxChart1" + Agi.Script.CreateControlGUID();
        var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty BoxChartPanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
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
                "yAxisName": "SpcDemoBoxChart", //Y轴名称
                "showToolTip":"0",
                "bgColor": "transparent",
                "bgAlpha":"100",
                "canvasBgColor": "transparent",
                "canvasBorderThickness": "1", //画布边框厚度
                "canvasBorderColor": "777777",
                "divLineColor":"none",
                "showAlternateHGridColor":"0",
                "showDivLineValues":"0",
                "baseFontSize": "0", //字体大小
                "baseFontColor":"transparent",
                "outCnvBaseFontSize":"11",
                "outCnvBaseFontColor":"909596",
                "plotBorderColor":"909596",//(柱子边框的颜色)
                "plotBorderThickness":"1",
                "showBorder":"0",
            },
            "categories": [
                {
                    "category": [
                        {
                            "label": "1"
                        }
                    ]
                }
            ],
            "dataset": [
                {
                    "upperboxcolor": "#6AB8FE",
                    "lowerboxcolor": "#6AB8FE",
                    "width":"50",
                    "data": [
                        {
                            outliers: "",
                            value: "30,90,80,160"
                        }
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
        Agi.Controls.SpcDemoBoxChartProrityInit(this);
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
//    //20130530 倪飘 解决bug，SPC演示控件中箱线图不能复制，粘贴，按F12页面报错
//        if (layoutManagement.property.type == 1) {
//            var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
//            var PostionValue = this.Get("Position");
//            var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//            var NewSpcDemoBoxChart = new Agi.Controls.SpcDemoBoxChart();
//            NewSpcDemoBoxChart.Init(ParentObj, PostionValue);
//            newPanelPositionpars = null;
//            return NewSpcDemoBoxChart;
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
              $("#"+this.Get("HTMLElement").id  +" .highcharts-container").css('background','none');
             $($('#'+this.Get("HTMLElement").id  +' svg').find('rect')[2]).attr('fill','rgba(0,0,0,0)');
             $($('#'+this.Get("HTMLElement").id  +' svg').find('rect')[3]).attr('fill','rgba(170,188,255,0.1)');
    },
    HTMLElementSizeChanged: function () {
        var Me = this;
        if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
            Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
        } else {
            Me.Refresh();
        }
        if (Agi.Controls.IsControlEdit) {
            Agi.Controls.SpcDemoBoxChartProrityInit(Me);
        }
        $("#"+Me.Get("HTMLElement").id  +" .highcharts-container").css('background','none');
             $($('#'+Me.Get("HTMLElement").id  +' svg').find('rect')[2]).attr('fill','rgba(0,0,0,0)');
             $($('#'+Me.Get("HTMLElement").id  +' svg').find('rect')[3]).attr('fill','rgba(170,188,255,0.1)');
    }, //外壳大小更改
    Refresh: function () {
        var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
        var ParentObj = ThisHTMLElement.parent();
         if(!ParentObj.length){
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
        $("#"+this.Get("HTMLElement").id  +" .highcharts-container").css('background','none');
             $($('#'+this.Get("HTMLElement").id  +' svg').find('rect')[2]).attr('fill','rgba(0,0,0,0)');
             $($('#'+this.Get("HTMLElement").id  +' svg').find('rect')[3]).attr('fill','rgba(170,188,255,0.1)');
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
                Me.Set("Entity", _Config.Entity); //实体
                var ID = _Config.ControlID;
                var BoxChartProPerty = _Config.BoxChart;
                var ThemeInfo = _Config.ThemeInfo;
                var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty BoxChartPanelSty'><div id='children_" + ID + "' style='width:100%;height:100%'></div></div>");
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
                Me.ReadOtherData();
                $("#"+ID +" .highcharts-container").css('background','none');
                $($('#'+ID +' svg').find('rect')[2]).attr('fill','rgba(0,0,0,0)');
                $($('#'+ID +' svg').find('rect')[3]).attr('fill','rgba(170,188,255,0.1)');
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
Agi.Controls.InitSpcDemoBoxChart1 = function () {
    return new Agi.Controls.SpcDemoBoxChart();
}
//BasicChart 自定义属性面板初始化显示
Agi.Controls.SpcDemoBoxChartProrityInit = function (_BoxChart) {
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
    '<td class="prortityPanelTabletd0">名称:</td><td colspan="2" class="prortityPanelTabletd1"><input data-field="txtyAxisName" id="txtyAxisName" type="text" value="" class="ControlProTextSty" maxlength="10" ischeck="false"/></td>' +
    '<td   class="prortityPanelTabletd1"><input type="button" value="确定" id="btnBoxChart"/></td>' +
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
