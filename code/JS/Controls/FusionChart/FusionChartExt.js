Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/
Agi.Controls.FusionChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){ //获得实体数据

        },
        Render: function (_Target) {
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }

            self.chartConfig = {
                "chart": {
                    //          showNames                    是否显示横向坐标轴(x轴)标签名称
                    //          rotateNames                是否旋转显示标签，默认为0(False):横向显示
                    showValues: 0,                   //是否在图表显示对应的数据值，默认为1(True)
                    //          yAxisMinValue                指定纵轴(y轴)最小值，数字
                    //          yAxisMaxValue                 指定纵轴(y轴)最小值，数字
                    //          showLimits                    是否显示图表限值(y轴最大、最小值)，默认为1(True)
                    //
                    //          图表标题和轴名称
                    caption: '',                    //图表主标题
                    subcaption: '',                        //图表副标题
                    //xAxisName:'X',                    //横向坐标轴(x轴)名称
                    //yAxisName:'Y',                    //纵向坐标轴(y轴)名称
                    showLabels: 1,
                    showYAxisValues: 1,

                    //图表和画布的样式
                    bgColor: "#111519",
                    bgAlpha: "100",
                    showBorder: 0,
                    //"numberPrefix" : "$",
                    showCanvasBg: 0,
                    canvasBgColor: '#f00', //"#01253F",  //             画布背景色，6位16进制颜色值
                    canvasBgAlpha: "100", //              画布透明度，[0-100]
                    //canvasBorderColor            画布边框颜色，6位16进制颜色值
                    canvasBorderThickness: '0',        //画布边框厚度，[0-100]
                    shadowAlpha: '0',                //投影透明度，[0-100]
                    showLegend: 1, //                  是否显示系列名，默认为1(True)

                    //字体属性 transparent
                    baseFont: '#fff', //                   图表字体样式
                    baseFontSize: '12px',        //       图表字体大小
                    baseFontColor: '#fff',                //图表字体颜色，6位16进制颜色值
                    //outCnvBaseFont                //图表画布以外的字体样式
                    //outCnvBaseFontSize            //图表画布以外的字体大小
                    //outCnvBaseFontColor        //图表画布以外的字体颜色，6位16进制颜色值

                    //分区线和网格 transparent
                    numDivLines: '0',            //画布内部水平分区线条数，数字
                    divLineColor: '#fff',                //水平分区线颜色，6位16进制颜色值
                    //            divLineThickness            //水平分区线厚度，[1-5]
                    divLineAlpha: '100',                //水平分区线透明度，[0-100]
                    showAlternateHGridColor: '0',    //是否在横向网格带交替的颜色，默认为0(False)
                    alternateHGridColor: '#00f',        //横向网格带交替的颜色，6位16进制颜色值
                    alternateHGridAlpha: '100',        //横向网格带的透明度，[0-100]
                    showDivLineValues: 0,           //是否显示Div行的值，默认？？

                    numVDivLines: '0',                //画布内部垂直分区线条数，数字
                    vDivLineColor: '#fff',                //垂直分区线颜色，6位16进制颜色值
                    vDivLineThickness: '1',           //垂直分区线厚度，[1-5]
                    vDivLineAlpha: '100',               //垂直分区线透明度，[0-100]
                    showAlternateVGridColor: '0',    //是否在纵向网格带交替的颜色，默认为0(False)
                    alternateVGridColor: '#f00',        //纵向网格带交替的颜色，6位16进制颜色值
                    alternateVGridAlpha: '100',        //纵向网格带的透明度，[0-100]

                    "areaovercolumns": "0",
                    "showpercentvalues": "0",
                    'legendIconScale ': '2',
                    'legendBgColor': '#111519',
                    'legendBgAlpha': '100',
                    'legendBorderThickness': 0,
                    'interactiveLegend': 0
                },
                "styles": {
                    "definition": [{
                        "name": "myToolTipFont1",
                        "type": "font",
                        "font": "Arial",
                        "size": "12",
                        "color": "FF5904"
                    }, {
                        "name": "myCaptionFont1",
                        "type": "font",
                        "align": "left"
                    }],
                    "application": [{
                        "toobject": "ToolTip",
                        "styles": "myToolTipFont1"
                    }, {
                        "toobject": "Caption",
                        "styles": "myCaptionFont1"
                    }, {
                        "toobject": "SubCaption",
                        "styles": "myCaptionFont1"
                    }]
                },
                "categories": [
                    {
                        "category": [
                            {
                                "label": "2012/1/1"
                            },
                            {
                                "label": "2012/1/2"
                            },
                            {
                                "label": "2012/1/3"
                            },
                            {
                                "label": "2012/1/4"
                            },
                            {
                                "label": "2012/1/5"
                            },
                            {
                                "label": "2012/1/6"
                            },
                            {
                                "label": "2012/1/7"
                            },
                            {
                                "label": "2012/1/8"
                            },
                            {
                                "label": "2012/1/9"
                            },
                            {
                                "label": "2012/1/10"
                            },
                            {
                                "label": "2012/1/11"
                            },
                            {
                                "label": "2012/1/12"
                            }
                        ]
                    }
                ],
                "dataset": [
                    {
                        "seriesname": "市能",
                        "color": "FBAB35",
                        "data": [
                            {
                                "value": "370"
                            },
                            {
                                "value": "401"
                            },
                            {
                                "value": "342"
                            },
                            {
                                "value": "370"
                            },
                            {
                                "value": "414"
                            },
                            {
                                "value": "385"
                            },
                            {
                                "value": "400"
                            },
                            {
                                "value": "456"
                            },
                            {
                                "value": "340"
                            },
                            {
                                "value": "390"
                            },
                            {
                                "value": "332"
                            },
                            {
                                "value": "401"
                            }
                        ]
                    },
                    {
                        "seriesname": "光能",
                        "color": "DA3608",
                        "data": [
                            {
                                "value": "325"
                            },
                            {
                                "value": "305"
                            },
                            {
                                "value": "295"
                            },
                            {
                                "value": "345"
                            },
                            {
                                "value": "285"
                            },
                            {
                                "value": "315"
                            },
                            {
                                "value": "295"
                            },
                            {
                                "value": "335"
                            },
                            {
                                "value": "300"
                            },
                            {
                                "value": "320"
                            },
                            {
                                "value": "285"
                            },
                            {
                                "value": "260"
                            }
                        ]
                    },
                    {
                        "seriesname": "风能",
                        "color": "015887",
                        "data": [
                            {
                                "value": "155"
                            },
                            {
                                "value": "135"
                            },
                            {
                                "value": "125"
                            },
                            {
                                "value": "175"
                            },
                            {
                                "value": "115"
                            },
                            {
                                "value": "145"
                            },
                            {
                                "value": "125"
                            },
                            {
                                "value": "165"
                            },
                            {
                                "value": "130"
                            },
                            {
                                "value": "150"
                            },
                            {
                                "value": "115"
                            },
                            {
                                "value": "90"
                            }
                        ]
                    },
                    {
                        "seriesname": "用能",
                        renderas: 'Line',
                        "color": "78AE1C",
                        "data": [
                            {
                                "value": "76"
                            },
                            {
                                "value": "85"
                            },
                            {
                                "value": "64"
                            },
                            {
                                "value": "105"
                            },
                            {
                                "value": "56"
                            },
                            {
                                "value": "78"
                            },
                            {
                                "value": "56"
                            },
                            {
                                "value": "105"
                            },
                            {
                                "value": "80"
                            },
                            {
                                "value": "100"
                            },
                            {
                                "value": "67"
                            },
                            {
                                "value": "82"
                            }
                        ]
                    }
                ]
            };;

            self.shell.Container.appendTo(obj);

            debugger;
            var myChart2 = new FusionCharts("JS/Controls/FusionChart/image/StackedColumn3DLine.swf",
                self.shell.BasicID + '_1', "100%", "100%", "0");
            myChart2.setJSONData(self.chartConfig);
            myChart2.render(self.shell.BasicID);
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }
        },

        RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'FusionChart.RemoveEntity Arg is null';
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
        },
        ReadData: function (et) {
            var self = this;
            self.IsChangeEntity = true;

            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity", entity);
        },
        ReadRealData: function (_Entity) {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            this.shell = null;
            this.IsEditState = false;
            this.minHeight = 30;
            this.minWidth = 60;
            this.IsChangeEntity = false;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "FusionChart");

            debugger;

            var ID = savedId ? savedId : "FusionChart" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                //enableFrame:true,
                ID: ID,
                width: 540,
                height: 250,
                divPanel: HTMLElementPanel
            });
            var divObj = $('<div id="' + ID + '" style="height:100%;"></div>');

            this.shell.initialControl(divObj);

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: divObj
            };

            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };

            this.Set("ProPerty", ThisProPerty);

            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                //HTMLElementPanel.width(200);
                //HTMLElementPanel.height(59);
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
            var self = this;
            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                if (Agi.Edit) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    if (Agi.Edit) {
                        Agi.Controls.ControlEdit(self); //控件编辑界面
                    }
                }
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    //Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);
            //输出参数
            this.Set("SelValue", 0);
            if (Agi.Edit) {
                //缩小的最小宽高设置
//                HTMLElementPanel.resizable({
//                    minHeight: self.minHeight,
//                    minWidth: self.minWidth,
//                    maxHeight: self.minHeight
//                });
//                $('#' + self.shell.ID + ' .ui-resizable-handle').css('z-index', 2000);
            } else {
            }
            obj = ThisProPerty = PagePars = PostionValue = null;

//            Agi.Msg.PageOutPramats.AddPramats({
//                'Type': Agi.Msg.Enum.Controls,
//                'Key': ID,
//                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1}]
//            });

        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.FusionChartProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

            Agi.Edit.workspace.controlList.remove(this);
            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/

            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewFusionChart = new Agi.Controls.FusionChart();
                NewFusionChart.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewFusionChart;
            }
        },
        PostionChange: function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
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
                var ThisHTMLElement = $(this.Get("HTMLElement"));
                var ParentObj = $('#BottomRightCenterContentDiv');
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };


                var ThisControlPars = { Width: ThisHTMLElement.width(), Height: ThisHTMLElement.height(), Left: (ThisHTMLElement.offset().left - PagePars.Left), Top: (ThisHTMLElement.offset().top - PagePars.Top), Right: 0, Bottom: 0 };
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
            //$('#'+this.shell.BasicID).find('.dropdown:eq(0)')
        },
        Refresh: function () {
            var ThisHTMLElement = $(this.Get("HTMLElement"));
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
            //ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
            this.Set("Position", PostionValue);
            $('#' + this.shell.ID).css('height', 'auto');
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        Checked: function () {
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /*  $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
             "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        EnterEditState: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            //obj.css({ "width": 200 }).find('li[class*="dropdown"]').removeClass('open');

            this.IsEditState = true;
            //var h = this.shell.Title.height()+this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            //this.shell.Container.height(this.minHeight);
        },
        BackOldSize: function () {
            var self = this;
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
//            $('#' + this.shell.ID).resizable({
//                minHeight: self.minHeight,
//                minWidth: self.minWidth,
//                maxHeight: self.minHeight
//            });
            this.IsEditState = false;
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.FusionChartAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
//            var Me = this;
//            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
//            //1.根据当前控件类型和样式名称获取样式信息
//            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);
//
//            //保存主题样式
//            Me.Set("ThemeInfo", _themeName);
//
//            //3.应用当前控件的Options信息
//            Agi.Controls.FusionChart.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");

            var FusionChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基础对象
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    BasicProperty: null, //控件基本属性
                    Position: null, //控件位置
                    ThemeInfo: null,
                    SelectValue: null //选择值
                }
            }
            FusionChartControl.Control.ControlType = this.Get("ControlType");
            FusionChartControl.Control.ControlID = ProPerty.ID;
            FusionChartControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            FusionChartControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
//            $(Entitys).each(function (i, e) {
//                e.Data = null;
//            });
            FusionChartControl.Control.Entity = Entitys;
            FusionChartControl.Control.BasicProperty = this.Get("BasicProperty");
            FusionChartControl.Control.Position = this.Get("Position");
            FusionChartControl.Control.ThemeInfo = this.Get("ThemeInfo");
            //FusionChartControl.Control.SelectValue = this.selectedValue;
            //FusionChartControl.Control.script = this.getScriptCode();
            return FusionChartControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            //this.setScriptCode(_Config.script)
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            //debugger;
            if (_Config != null) {
                var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;

                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);

                    //应用样式
                    //this.ChangeTheme(_Config.ThemeInfo);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);



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

                    this.Set("Entity", _Config.Entity);
//                    if (this.IsPageView) {
//                        $('#' + this.shell.ID).css('z-index', 10000);
//                    }
                }
            }
        } //根据配置信息创建控件
    }, true);


Agi.Controls.FusionChartAttributeChange=function(_ControlObj,Key,_Value){
    var self = _ControlObj;
    switch(Key){
        case "Position":
        {
            if(layoutManagement.property.type==1){
                var ThisHTMLElement=$(_ControlObj.Get("HTMLElement"));
                var ThisControlObj=_ControlObj.Get("ProPerty").BasciObj;

                var ParentObj=ThisHTMLElement.parent();
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                //ThisControlObj.height(ThisHTMLElement.height()-20);
                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                ThisHTMLElement.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                ThisHTMLElement.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");
                PagePars=null;
            }
        }break;
        case "SelValue":
        {
        }break;
        case "BasicProperty":
        {

        }
            break;
        case "Entity"://实体
        {
            var entity = _ControlObj.Get('Entity');
            if(entity&&entity.length){
                BindDataByEntity(_ControlObj,entity[0]);
            }else{

            }
        }break;
    }//end switch

    function BindDataByEntity(controlObj,et){
        var self = controlObj;
        Agi.Utility.RequestData2(et,function(result){

            debugger;
            if (result.Data.length) {
                self.chartConfig.categories[0].category = [];
                $(self.chartConfig.dataset).each(function (i, set) {
                    set.data = [];
                });
                //0市,1光,2风,3用
                $(result.Data).each(function (i, d) {
                    self.chartConfig.categories[0].category.push({ label: d['DateDisp'] });
                    for (name in d) {
                        switch (name) {
                            case "solarEnergySum": //光能
                                self.chartConfig.dataset[1].data.push({ value: d['solarEnergySum'] });
                                break;
                            case "windEnergySum": //风能
                                self.chartConfig.dataset[2].data.push({ value: d['windEnergySum'] });
                                break;
                            case "elecEnergySum": //市电
                                self.chartConfig.dataset[0].data.push({ value: d['elecEnergySum'] });
                                break;
                            case "useEnergySum": //用能
                                self.chartConfig.dataset[3].data.push({ value: d['useEnergySum'] });
                                break;
                        }
                    }
                });

            } else {
                self.chartConfig.categories[0].category = [];
                self.chartConfig.dataset = [{
                    "seriesname": "市能",
                    "color": "FBAB35",
                    "data": []
                },
                    {
                        "seriesname": "光能",
                        "color": "DA3608",
                        "data": []
                    },
                    {
                        "seriesname": "风能",
                        "color": "015887",
                        "data": []
                    },
                    {
                        "seriesname": "用能",
                        renderas: 'Line',
                        "color": "78AE1C",
                        "data": []
                    }];
                //alert('未查询到数据!');
            }
            var chartReference = FusionCharts.items[self.shell.BasicID + '_1'];
            if (chartReference) {
                chartReference.setJSONData(self.chartConfig);
            }
        });
        return;
    }

}//end

/*下拉列表参数更改 _FusionChartID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.FusionChartParsChange=function(_FusionChartID,_ParsName,_ParsValue){
    var ThisControl=Agi.Controls.FindControl(_FusionChartID);/*查找到相应的控件*/
    if(ThisControl){
        ThisControl.Set(_ParsName,_ParsValue);
    }
}


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitFusionChart=function(){
    return new Agi.Controls.FusionChart();
}

Agi.Controls.FusionChartProrityInit=function(dropDownControl){

}


