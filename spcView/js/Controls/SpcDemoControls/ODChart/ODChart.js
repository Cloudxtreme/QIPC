/**
 * Created with JetBrains WebStorm.
 * User: yanhua guo
 * Date: 12-8-17
 * Time: 上午9:15
 * SPC均值/极差控件
 * *
 */
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/
Agi.Controls.SpcDemoODChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            self.shell.Container.appendTo(obj);
            self.shell.Title.hide().removeClass('selectPanelheadSty');

            this.shell.Footer.hide();

            var touchesDevice = ("createTouch" in document);
            //20120107 倪飘 添加均值极差图标样式功能
            self.chartOption = {
                chart: {
                    renderTo: this.shell.BasicID,
                    type: 'area',
                    animation: true,
                    marginTop: "10",
                    marginRight: "90",
                    marginLeft: "80",
                    borderWidth: 0,
                    backgroundColor: '#fff',
                    plotBackgroundColor: '#fff',
                    events: {
                        load: function (e) {
                        },
                        redraw: function () {
                            $('.highcharts-legend-item', this.container.offsetParent).each(function (i, l) {
                                l.onclick = "return false;";
                                l.ontouchstart = 'return false';
                            });
                            self.fireScriptCode('redraw');
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                //                colors: [
                //                      '#48a84f'
                //                ],
                title: {
                    text: '',
                    x: 0 //center
                },

                xAxis: [{
                    lineWidth: 1,
                    lineColor: '#95a7b2',
                    //                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    //                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'test'],
                    labels: {
                        enabled: true
                    }
                }],
                yAxis: [{
                    labels: {
                        enabled: true, //markeluo 20121126 11:17  首自信这边需要显示出来
                        formatter: function () {
                            return this.value.toString();
                            //                            function getYValue(_value) {
                            //                                if (_value.length < 5) {
                            //                                    return getYValue("　" + _value);
                            //                                }
                            //                                return _value;
                            //                            }
                        }
                    },
                    //max:200,
                    //min:0,
                    //tickInterval:50,
                    gridLineWidth: 0,
                    lineWidth: 1,
                    lineColor: '#95a7b2',
                    title: {
                        text: '',
                        style: {
                            color: '#000',
                            fontFamily: 'Microsoft Yahei',
                            fontWeight: 'bold',
                            fontSize: "12px"
                        }
                    },
                    plotLines: [{
                        id: self.shell.BasicID + '-0',
                        //                        color: '#e43a4f',
                        color: '#95a7b2',
                        width: 1,
                        value: 72,
                        label: {
                            text: 'UCL',
                            align: 'right',
                            verticalAlign: "middle",
                            backgroungColor: 'red',
                            x: 30,
                            y: 2,
                            style: {
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: '10px',
                                fontFamily: '微软雅黑'
                            }
                        },
                        events: {
                            mouseover: function (e) {
                                self.chart.yAxis[0].plotLinesAndBands[0].options.color = '#e43a4f';
                                //                                self.chart.yAxis[0].plotLinesAndBands[0].options.color = 'blue';
                                //                                alert(self.chart.yAxis[0].plotLinesAndBands[0].options.color);
                            },
                            mouseout: function (e) {
                                self.chart.yAxis[0].plotLinesAndBands[0].options.color = '#95a7b2';
                            }
                        }
                    },
                        {
                            id: self.shell.BasicID + '-1',
                            color: '#95a7b2',
                            width: 1,
                            value: 35,
                            label: {
                                text: 'CL',
                                align: 'right',
                                verticalAlign: "middle",
                                x: 25,
                                y: 2,
                                style: {
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    fontFamily: '微软雅黑'
                                }
                            }
                        }, {
                            id: self.shell.BasicID + '-2',
                            color: '#95a7b2',
                            width: 1,
                            value: 0,
                            label: {
                                text: 'LCL',
                                align: 'right',
                                verticalAlign: "middle",
                                x: 30,
                                y: 2,
                                style: {
                                    color: '#000',
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    fontFamily: '微软雅黑'
                                }
                            }
                        }]
                }, {
                    lineWidth: 1,
                    lineColor: '#95a7b2',
                    opposite: true,
                    title: {
                        text: ''
                    }
                }],
                tooltip: {
                    formatter: function () {
                        //                        return '<b>'+ this.series.name +'</b><br/>'+
                        //                            this.x +': '+ this.y +'';
                        return '<b>' + this.series.name + '：</b>' + '<b>' + this.y + '</b>';
                    },
                    //              
                    borderWidth: 1,
                    borderRadius: 3,
                    borderColor: '#2d3133',
                    shadow: true,
                    backgroundColor: '#2d3133',
                    style: {
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        padding: '5px',
                        fontFamily: '微软雅黑'
                    },
                    crosshairs: [{
                        width: 1,
                        color: '#909497'
                    }]
                },
                legend: {
                    enabled: true,
                    align: 'right',
                    verticalAlign: 'top',
                    x: -90,
                    y: -5,
                    borderWidth: 0,
                    itemStyle: {
                        fontWeight: 'bold',
                        fontSize: touchesDevice ? '20px' : '12px'
                    }
                },
                series: [{
                    name: '演示数据 ',
                    color: '#48a84f',
                    data: [1, 8, 57, 11.3, 22.0, 47.0, 14.1, 24.8, 54.1, 20.1, 8.6, 2.5, 50],
                    lineWidth: 2,
                    lineColor: '#48a84f',
                    shadow: false,
                    marker: {
                        enabled: true,
                        radius: 4,
                        fillColor: '#14871a'
                        //fillColor:'#f00'
                    },
                    color: {
                        linearGradient: [0, 0, 0, 150],
                        stops: [
                            [0, 'rgba(72,168,79,0.2)'],
                            [100, 'rgba(72,168,79,0.2)']
                        ]
                    },
                    point: {
                        events: {
                            mouseOver: function () {
                                self.pointMouseover(this);
                            },
                            mouseOut: function () {
                                self.pointMouseout(this);
                            }
                        }
                    }
                }]
                //                plotOptions: {
                //                    series: {
                //                        lineWidth: 1,
                //                        lineColor: '#48a84f',
                //                        shadow: false,
                //                        marker: {
                //                            enabled: true,
                //                            radius: 2,
                //                            fillColor: '#14871a'
                //                        },
                //                        color: {
                //                            linearGradient: [0, 0, 0, 150],
                //                            stops: [
                //                            //                            [0, 'rgba(20,135,26,0.5)'],
                //                            [0, 'rgba(72,168,79,0.2)']
                //                        ]
                //                        },
                //                        point:{
                //                            events:{
                //                                mouseOver:function () {
                //                                    self.pointMouseover(this);
                //                                },
                //                                mouseOut:function () {
                //                                    self.pointMouseout(this);
                //                                }
                //                            }
                //                        }
                //                    }
                //
                //                }
            };

            self.chart = new Highcharts.Chart(self.chartOption);

            self.UpdateChartSize();
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }



        },
        //重新绑定事件
        ReBindEvents: function () {

            return this;
        },
        //重新设置属性
        ResetProperty: function () {
            var self = this;

            return this;
        },
        RedrawChart: function () {
            var self = this;
            self.chartOption.yAxis[0].title.text = self.BasicProperty.yAxisTitle
            self.chartOption.xAxis[0].labels.enabled = self.BasicProperty.xAxislabel;
            self.chart.destroy();
            self.chart = new Highcharts.Chart(self.chartOption);

            //            self.chart.yAxis[0].title.text = self.BasicProperty.yAxisTitle
            //            self.chart.xAxis[0].labels.enabled = self.BasicProperty.xAxislabel;
            //            self.chart.redraw();
            self.UpdateChartSize();
            var entity = self.Get('Entity');
            self.Set('Entity', entity);
            self.addPlotLines();
        },
        RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'SpcDemoODChart.RemoveEntity Arg is null';
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
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.chageEntity = true;
            this.Set("Entity", entity);
        },
        ReadRealData: function (_Entity) {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            self.shell = null;
            self.AttributeList = [];
            self.Set("Entity", []);
            self.Set("ControlType", "SpcDemoODChart");
            /* 20121121 markeluo SPC图修改  NO:201211211346 start */
            self.Set("Groupnrow",3);//默认分组大小，3个一组
            /*NO:201211211346 end */
            var ID = savedId ? savedId : "SpcDemoODChart" + Agi.Script.CreateControlGUID();


            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 800,
                height: 200,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div style="width: 100%; height:100%;" id="' + ID + '"></div>');
            this.shell.initialControl(BaseControlObj[0]);

            self.isBindData = false;
            self.isInit = true;
            self.isApplyProperty = false;
            self.chageEntity = false;

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            self.BasicProperty = {
                chartType: "均值",
                yAxisTitle: "",
                xAxislabel: false
            };
            //this.Set('BasicProperty',BasicProperty);

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
                //HTMLElementPanel.width(400);
                //HTMLElementPanel.height(300);
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
            $('#' + self.shell.ID).mousedown(function (ev) {
                if (Agi.Edit) {
                 ev.stopPropagation();
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
            self.isInit = false;
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.ODChartProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/

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
                var NewDataGrid = new Agi.Controls.SpcDemoODChart();
                NewDataGrid.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewDataGrid;
            }
        },
        PostionChange: function (_Postion) {
            var self = this;
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
                var ParentObj = ThisHTMLElement.parent();
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
            self.UpdateChartSize();
            return this;
        },
        UpdateChartSize: function () {
            var self = this;
            if (self.chart) {
                var w = self.shell.Container.width();
                var h = self.shell.Container.height(); // - self.shell.Title.height();
                if (w > 1 && h > 1) {
                    self.chart.setSize(w, h, false);
                }
                self.addPlotLines();
            }
        },
        ResizeCompleted: function () {
        },
        Refresh: function () {
            var ThisHTMLElement = $(this.Get("HTMLElement"));
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
            //ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
            this.Set("Position", PostionValue);
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
            var self = this;
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css({ "width": '100%' });
            obj.height(obj.parent().height() - 20);
            self.UpdateChartSize();
            self.addPlotLines();
            //高度重新计算
            //var h = this.shell.Title.height()+this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            //this.shell.Container.height(h);
        },
        BackOldSize: function () {
            var self = this;
            if (self.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(self.oldSize.width).height(self.oldSize.height);
                self.UpdateChartSize();
                self.addPlotLines();
            }
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.ODChartAttributeChange(this, Key, _Value);

            if (Key === 'Position' && !_obj.isInit) {
                var htmlElement = $('#' + this.shell.ID);
                var ParentObj = htmlElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                htmlElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                htmlElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
            }
        },
        GetConfig: function () {
            var self = this;

            var ProPerty = this.Get("ProPerty");
            /*   var ConfigObj = new Agi.Script.StringBuilder(); *//*配置信息数组对象*//*
             ConfigObj.append("<Control>");
             ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>"); */
            /*控件类型*//*
             ConfigObj.append("<ControlID>" +ProPerty.ID + "</ControlID>"); */
            /*控件属性*//*
             ConfigObj.append("<ControlBaseObj>" +ProPerty.BasciObj[0].id + "</ControlBaseObj>"); */
            /*控件基础对象*//*
             ConfigObj.append("<HTMLElement>" +ProPerty.BasciObj[0].id + "</HTMLElement>"); */
            /**//*
             var Entitys = this.Get("Entity");
             $(Entitys).each(function(i,e){
             e.Data = null;
             });
             ConfigObj.append("<Entity>" +JSON.stringify(Entitys) + "</Entity>"); */
            /**//*

             ConfigObj.append("<BasicProperty>" +JSON.stringify(self.BasicProperty) + "</BasicProperty>"); */
            /**//*
             ConfigObj.append("<Position>" +JSON.stringify(this.Get("Position")) + "</Position>"); */
            /**//*
             ConfigObj.append("<ThemeInfo>" +JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>"); */
            /**//*


             ConfigObj.append("</Control>");
             return ConfigObj.toString(); //返回配置字符串*/
            var ODChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基本对象
                    HTMLElement: null, //控件外壳
                    Entity: null, //实体
                    BasicProperty: null, //控件基本属性
                    Position: null, //控件位置
                    ThemeInfo: null
                }
            }
            ODChartControl.Control.ControlType = this.Get("ControlType");
            ODChartControl.Control.ControlID = ProPerty.ID;
            ODChartControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            ODChartControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            $(Entitys).each(function (i, e) {
                e.Data = null;
            });
            ODChartControl.Control.Entity = Entitys
            ODChartControl.Control.BasicProperty = self.BasicProperty;
            ODChartControl.Control.Position = this.Get("Position");
            ODChartControl.Control.ThemeInfo = this.Get("ThemeInfo");
            return ODChartControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            var self = this;
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;


                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);
                    /* 20121121 markeluo SPC图修改  NO:201211211346 start */
                    self.Set("Groupnrow",3);//默认分组大小，3个一组
                    /*NO:201211211346 end */

                    self.BasicProperty = null;
                    self.BasicProperty = _Config.BasicProperty;


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
                    //ThisProPerty.BasciObj.parent().width(ThisControlPars.Width);
                    //ThisProPerty.BasciObj.parent().height(ThisControlPars.Height);
                    //ThisProPerty.BasciObj.parent().css("left",(_Targetobj.offset().left+parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(_Targetobj.offset().top+parseInt(_Config.Position.Top*PagePars.Height))+"px");
                    //ThisProPerty.BasciObj.parent().css("left",(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(parseInt(_Config.Position.Top*PagePars.Height))+"px");

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                    //应用样式
                    if (_Config.ThemeInfo) {
                        this.ChangeTheme(_Config.ThemeInfo);
                    }
                    this.RedrawChart();
                    this.Set("Entity", _Config.Entity);
                }
            }

            //            if (self.IsPageView) {
            //                //$('#'+self.shell.ID).css('z-index',1);
            //            }
        }, //根据配置信息创建控件
        addPlotLines: function (lines) {
            var self = this;
            self.clearPlotLine();
            if (lines == null || lines == undefined) {//markeluo 20121126 12:47 修改
                lines = self.Get("PlotLines"); //获取PlotLines 属性
            }
            if (lines) {
                //20120107 倪飘 添加均值极差图标样式功能
                var ThemeInfo = self.Get('ThemeInfo');
                if (ThemeInfo) {
                    var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(self.Get("ControlType"), ThemeInfo);
                    $(lines).each(function (i, line) {
                        var text = line.text + "=" + line.value; //修改者：markleuo  20121126 10:42
                        var offsetX = text.length * 6;
                        var linecolor;
                        switch (i) {
                            case 0:
                                linecolor = ChartStyleValue.UCLLinecolor;
                                break;
                            case 1:
                                linecolor = ChartStyleValue.CLLinecolor;
                                break;
                            case 2:
                                linecolor = ChartStyleValue.LCLLinecolor;
                                break;

                        }
                        self.chart.yAxis[0].addPlotLine({
                            id: (self.shell.BasicID + '-' + i),
                            color: linecolor,
                            width: 1,
                            value: line.value,
                            label: {
                                text: text,
                                align: 'right',
                                verticalAlign: "middle",
                                style: {
                                    color: ChartStyleValue.AlllineColor,
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    fontFamily: '微软雅黑'
                                },
                                x: offsetX + 2,
                                y: 2
                            }
                        });
                    });
                }
                else {
                    $(lines).each(function (i, line) {
                        var text = line.text + "=" + line.value; //修改者：markleuo  20121126 10:42
                        var offsetX = text.length * 6;
                        self.chart.yAxis[0].addPlotLine({
                            id: (self.shell.BasicID + '-' + i),
                            color: '#98AF5D',
                            width: 1,
                            value: line.value,
                            label: {
                                text: text,
                                align: 'right',
                                verticalAlign: "middle",
                                style: {
                                    color: '#e43a4f',
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    fontFamily: '微软雅黑'
                                },
                                x: offsetX + 2,
                                y: 2
                            }
                        });
                    });
                }
            }
            else {
                var max = self.chart.yAxis[0].max;
                var min = self.chart.yAxis[0].min;
                var pls = [{
                    value: max,
                    text: 'UCL',
                    color: '#95a7b2',
                    labelcolor: '#909596'
                }, {
                    value: (max - min) / 2 + min,
                    text: 'CL',
                    color: '#95a7b2',
                    labelcolor: '#909596'
                }, {
                    value: min,
                    text: 'LCL',
                    color: '#95a7b2',
                    labelcolor: '#909596'
                }];
                $(pls).each(function (i, pl) {
                    self.chart.yAxis[0].addPlotLine({
                        id: (self.shell.BasicID + '-' + i),
                        color: pl.color,
                        width: 1,
                        value: pl.value,
                        label: {
                            text: pl.text,
                            align: 'right',
                            verticalAlign: "middle",
                            style: {
                                color: pl.labelcolor,
                                fontWeight: 'bold',
                                fontSize: '10px',
                                fontFamily: '微软雅黑'
                            },
                            x: 30,
                            y: 2
                        }
                    });
                });
            }
        },
        clearPlotLine: function () {
            var self = this;
            self.chart.yAxis[0].removePlotLine(self.shell.BasicID + '-0');
            self.chart.yAxis[0].removePlotLine(self.shell.BasicID + '-1');
            self.chart.yAxis[0].removePlotLine(self.shell.BasicID + '-2');
        },
        changePlotLine: function () {
            var self = this;
            alert(self.chart.yAxis[0].plotLinesAndBands[0].options.color);
            //            self.chart.yAxis[0].removePlotLine(self.shell.BasicID + '-0');
            //            self.chart.yAxis[0].removePlotLine(self.shell.BasicID + '-1');
            //            self.chart.yAxis[0].removePlotLine(self.shell.BasicID + '-2');
        },
        clearSeriers: function () {
            var self = this;
            $(self.chart.series).each(function (i, s) {
                s.remove();
            });
        },
        changeYaxisMin_MaxValue:function(_min,_max){
            var self = this;
            self.chart.yAxis[0].setExtremes(_min,_max);
        },//设置Y轴最小、最大值  添加者：markeluo 20121126 11:17

        /*控件交互 Liuyi 2012年11月19日*/
        /*获取第三方控件和自定义函数*/
        getInsideControl:function () {
            var chart = this.chart;
            //
            return chart;
        },
        /*自定义函数*/
        pointMouseover:function (point) {
            /*获取chart*/
            var chart = point.series.chart;
            /*获取点索引*/
            for (var i = 0; i < point.series.data.length; i++) {
                var seriesPoint = point.series.data[i];
                /*if (seriesData[0] === point.x && seriesData[1] === point.x) {
                 chart.pointIndex = i;
                 }*/
                if (seriesPoint === point) {
                    chart.pointIndex = i;
                }
            }
            //交互事件
            if (chart.agiEvents) {
                chart.agiEvents.pointChange(-1);//清空之前高亮的数据
                chart.agiEvents.pointChange(chart.pointIndex);
            }
        },
        pointMouseout:function (point) {
            return;//清空的高亮放到 pointMouseover 方法里面
            /*获取chart*/
            var chart = point.series.chart;
            /*移除点索引*/
            chart.pointIndex = -2;
            //交互事件
            if (chart.agiEvents) {
                chart.agiEvents.pointChange(chart.pointIndex);
            }
        },

        //获取SpsNrow属性
        getSpcNrow: function (){
            return this.Get('Groupnrow');
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);
            //保存主题样式
            Me.Set("ThemeInfo", _themeName);
            //3.应用当前控件的Options信息
            Agi.Controls.SpcDemoODChart.OptionsAppSty(ChartStyleValue, Me);

        } //更改样式
    }, true);

    //样式应用
    //20120107 倪飘 添加均值极差图标样式功能
    Agi.Controls.SpcDemoODChart.OptionsAppSty = function (_StyConfig, _SpcDemoODChart) {
        var self = _SpcDemoODChart;
        var touchesDevice = ("createTouch" in document);
        self.chartOption = {
            chart: {
                renderTo: self.shell.BasicID,
                type: 'area',
                animation: true,
                marginTop: "10",
                marginRight: "90",
                marginLeft: "80",
                borderWidth: 0,
                backgroundColor: _StyConfig.backgroundColor,
                plotBackgroundColor: _StyConfig.plotBackgroundColor,
                events: {
                    load: function (e) {
                    },
                    redraw: function () {
                        $('.highcharts-legend-item', this.container.offsetParent).each(function (i, l) {
                            l.onclick = "return false;";
                            l.ontouchstart = 'return false';
                        });
                        self.fireScriptCode('redraw');
                    }
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: '',
                x: 0 //center
            },

              xAxis: [{
                lineWidth: 1,
                lineColor: _StyConfig.AlllineColor,
                labels: {
                    enabled: true,
                    style: {
                        color: _StyConfig.XYFontColor,
                    }
                }
            }],
            yAxis: [{
                labels: {
                    enabled: true, //markeluo 20121126 11:17  首自信这边需要显示出来
                    formatter: function () {
                        return this.value.toString();
                    },
                    style: {
                        color: _StyConfig.XYFontColor,
                    }
                },
                gridLineWidth: 0,
                lineWidth: 1,
                lineColor: _StyConfig.AlllineColor,
                title: {
                    text: '',
                    style: {
                        color: _StyConfig.YAxisTitleColor,
                        fontFamily: 'Microsoft Yahei',
                        fontWeight: 'bold',
                        fontSize: "12px"
                    }
                },
                plotLines: [{
                    id: self.shell.BasicID + '-0',
                    color: _StyConfig.UCLLinecolor,
                    width: 1,
                    value: 72,
                    label: {
                        text: 'UCL',
                        align: 'right',
                        verticalAlign: "middle",
                        backgroungColor: 'red',
                        x: 30,
                        y: 2,
                        style: {
                            color: _StyConfig.labelcolor,
                            fontWeight: 'bold',
                            fontSize: '10px',
                            fontFamily: '微软雅黑'
                        }
                    },
                    events: {
                        mouseover: function (e) {
                            self.chart.yAxis[0].plotLinesAndBands[0].options.color = '#e43a4f';
                        },
                        mouseout: function (e) {
                            self.chart.yAxis[0].plotLinesAndBands[0].options.color = '#95a7b2';
                        }
                    }
                },
                        {
                            id: self.shell.BasicID + '-1',
                            color: _StyConfig.CLLinecolor,
                            width: 1,
                            value: 35,
                            label: {
                                text: 'CL',
                                align: 'right',
                                verticalAlign: "middle",
                                x: 25,
                                y: 2,
                                style: {
                                    color: _StyConfig.labelcolor,
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    fontFamily: '微软雅黑'
                                }
                            }
                        }, {
                            id: self.shell.BasicID + '-2',
                            color: _StyConfig.LCLLinecolor,
                            width: 1,
                            value: 0,
                            label: {
                                text: 'LCL',
                                align: 'right',
                                verticalAlign: "middle",
                                x: 30,
                                y: 2,
                                style: {
                                    color: _StyConfig.labelcolor,
                                    fontWeight: 'bold',
                                    fontSize: '10px',
                                    fontFamily: '微软雅黑'
                                }
                            }
                        }]
            }, {
                lineWidth: 1,
                lineColor:_StyConfig.labelcolor,
                opposite: true,
                title: {
                    text: ''
                }
            }],
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '：</b>' + '<b>' + this.y + '</b>';
                },
                borderWidth: 1,
                borderRadius: 3,
                borderColor: '#2d3133',
                shadow: true,
                backgroundColor: '#2d3133',
                style: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    padding: '5px',
                    fontFamily: '微软雅黑'
                },
                crosshairs: [{
                    width: 1,
                    color: _StyConfig.crosshaircolor
                }]
            },
            legend: {
                enabled: true,
                align: 'right',
                verticalAlign: 'top',
                x: -90,
                y: -5,
                borderWidth: 0,
                itemStyle: {
                    fontWeight: 'bold',
                    fontSize: touchesDevice ? '20px' : '12px'
                }
            },
            series: [{
                name: '演示数据 ',
                color: _StyConfig.seriescolorandlineColorandmarkerfillColor,
                data: [1, 8, 57, 11.3, 22.0, 47.0, 14.1, 24.8, 54.1, 20.1, 8.6, 2.5, 50],
                lineWidth: 2,
                lineColor: _StyConfig.seriescolorandlineColorandmarkerfillColor,
                shadow: false,
                marker: {
                    enabled: true,
                    radius: 4,
                    fillColor: _StyConfig.seriescolorandlineColorandmarkerfillColor
                },
                color: {
                    linearGradient: [0, 0, 0, 150],
                    stops: [
                            [0, _StyConfig.colorstops0],
                            [100, _StyConfig.colorstops100]
                        ]
                },
                point: {
                    events: {
                        mouseOver: function () {
                            self.pointMouseover(this);
                        },
                        mouseOut: function () {
                            self.pointMouseout(this);
                        }
                    }
                }
            }]

        };

        self.chart = new Highcharts.Chart(self.chartOption);
        self.Set('Entity', self.Get('Entity'))
    }

/*下拉列表控件参数更改处理方法*/
Agi.Controls.ODChartAttributeChange = function (SpcDemoODChart, Key, _Value) {
    var self = SpcDemoODChart;
    switch (Key) {
        case "Position":
        {
            if (layoutManagement.property.type == 1) {
                var ThisHTMLElement = $(self.Get("HTMLElement"));
                var ThisControlObj = self.Get("ProPerty").BasciObj;

                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                //ThisControlObj.height(ThisHTMLElement.height()-20);
                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                PagePars = null;


            }
        } break;
        case "SelValue":
        {

        } break;
        case "OutPramats": //用户选择了一个项目
        {
            if (_Value != 0) {
                //var ThisControlPrority=_ControlObj.Get("ProPerty");
                var ThisOutPars = [];
                if (_Value != null) {
                    for (var item in _Value) {
                        ThisOutPars.push({ Name: item, Value: _Value[item] });
                    }
                }
                Agi.Msg.PageOutPramats.PramatsChange({/*Chart 输出参数更改*/
                    "Type": Agi.Msg.Enum.Controls,
                    "Key": _ControlObj.shell.BasicID,
                    "ChangeValue": ThisOutPars
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _ControlObj, "Type": Agi.Msg.Enum.Controls });
                ThisOutPars = null;
            }
            //通知消息模块，参数发生更改
        } break;
        case "BasicProperty":
        {
        } break;
        case "Entity": //实体
        {
            var entity = self.Get('Entity');
            if (entity && entity.length) {
                BindDataByEntity.call(self, entity[0]);
            } else {

            }
        } break;
    } //end switch

//根据实体信息绑定数据
function BindDataByEntity(et) {
    var self = this;
    //remove all serier
    self.clearSeriers();
    //请求webservice
    if (!et.IsShareEntity) {//不是共享数据源
        Agi.Utility.RequestData2(et, function (d) {
            var data = d.Data;
            var Tname = "平均值";
            et.Columns = d.Columns;
            et.Data = d.Data;


            var result = {
                arr: [[], []],
                plot_data: {
                    meanPlot: {
                        m_CC: 30010.602,
                        m_LCL: 29111.184492,
                        m_UCL: 30910.019507999998
                    },
                    rangePlot: {
                        r_CC: 879.1959999999999,
                        r_LCL: 500,
                        r_UCL: 2263.050504
                    }
                }
            };
            for (var i = 0; i < data.length; i++) {
                var tData = data[i];
                result.arr[0].push(tData['y1']);
                result.arr[1].push(tData['y2']);
            }
            if (true) {
                //Spc.Data.GetSpcDataForGrid(d,self.Get("Groupnrow"), function (result) {
                //
                if (!result || !result.arr) {
                    //alert('没有取到值!');
                    return;
                }

                var PlotLines = null; //需要添加的UCL,CL,LCL线  markeluo 20121126 10:13
                var YasixMin_MaxData = null; //Y轴设置最小、最大值 markeluo 20121126 10:13
                var ada = null;
                if (self.BasicProperty.chartType == '均值') {
                    ada = result.arr[0];
                    var plot = result.plot_data.meanPlot; //markeluo 20121126 10:17
                    if (plot) {
                        YasixMin_MaxData = { Min: plot.m_LCL.toFixed(3), Max: plot.m_UCL.toFixed(3) };

                        PlotLines = [];
                        PlotLines.push({ text: "UCL", value: YasixMin_MaxData.Max }); //最大值
                        PlotLines.push({ text: "CL", value: plot.m_CC.toFixed(3) }); //
                        PlotLines.push({ text: "LCL", value: YasixMin_MaxData.Min }); //最小值

                    }
                } else {
                    ada = result.arr[1];
                    Tname = "极差值";
                    var plot = result.plot_data.rangePlot; //markeluo 20121126 10:17
                    if (plot) {
                        YasixMin_MaxData = { Min: plot.r_LCL.toFixed(3), Max: plot.r_UCL.toFixed(3) };

                        PlotLines = [];
                        PlotLines.push({ text: "UCL", value: plot.r_UCL.toFixed(3) }); //最大值
                        PlotLines.push({ text: "CL", value: plot.r_CC.toFixed(3) }); //
                        PlotLines.push({ text: "LCL", value: plot.r_LCL.toFixed(3) }); //最小值
                    }
                }

                //get data
                var key = '',
                        serierData = [];

                //20120107 倪飘 添加均值极差图标样式功能
                var ThemeInfo = self.Get('ThemeInfo');
                if (ThemeInfo) {
                    var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(self.Get("ControlType"), ThemeInfo);

                    for (var i = 0; i < ada.length; i++) {
                        serierData.push({
                            y: ada[i],
                            marker: {
                                enabled: true,
                                radius: 4,
                                fillColor: ChartStyleValue.seriescolorandlineColorandmarkerfillColor,
                                symbol: 'circle'
                            }
                        });
                    }

                    //bind to chart
                    self.clearSeriers();
                    self.chart.addSeries({
                        name: Tname,
                        data: serierData,
                        lineWidth: 2,
                        lineColor: ChartStyleValue.seriescolorandlineColorandmarkerfillColor,
                        shadow: false,
                        marker: {
                            enabled: true,
                            radius: 4,
                            fillColor: ChartStyleValue.seriescolorandlineColorandmarkerfillColor
                            //fillColor:'#f00'
                        },
                        color: {
                            linearGradient: [0, 0, 0, 150],
                            stops: [
                                [0, ChartStyleValue.colorstops0],
                            [100, ChartStyleValue.colorstops100]
                            ]
                        },
                        point: {
                            events: {
                                mouseOver: function () {
                                    self.pointMouseover(this);
                                },
                                mouseOut: function () {
                                    self.pointMouseout(this);
                                }
                            }
                        }
                    });
                }
                else {
                    for (var i = 0; i < ada.length; i++) {
                        serierData.push({
                            y: ada[i],
                            marker: {
                                enabled: true,
                                radius: 4,
                                fillColor: '#14871a',
                                symbol: 'circle'
                            }
                        });
                    }

                    self.chart.addSeries({
                        name: Tname,
                        data: serierData,
                        lineWidth: 2,
                        lineColor: '#48a84f',
                        shadow: false,
                        marker: {
                            enabled: true,
                            radius: 4,
                            fillColor: '#14871a'
                            //fillColor:'#f00'
                        },
                        color: {
                            linearGradient: [0, 0, 0, 150],
                            stops: [
                                [0, 'rgba(72,168,79,0.2)'],
                            [100, 'rgba(72,168,79,0.2)']
                            ]
                        },
                        point: {
                            events: {
                                mouseOver: function () {
                                    self.pointMouseover(this);
                                },
                                mouseOut: function () {
                                    self.pointMouseout(this);
                                }
                            }
                        }
                    });
                }
                //                    self.addPlotLines();

                self.Set("PlotLines", PlotLines); //markeluo 20121126 10:17 （由于点相对集中，所以需要设置Y轴起始值）
                self.addPlotLines(PlotLines);
                if (serierData != null && serierData.length > 0) {
                    for (var i = 0; i < serierData.length; i++) {
                        if (serierData[i].y < YasixMin_MaxData.Min) {
                            YasixMin_MaxData.Min = serierData[i].y;
                        }
                        if (serierData[i].y > YasixMin_MaxData.Max) {
                            YasixMin_MaxData.Max = serierData[i].y;
                        }
                    }
                }
                if (YasixMin_MaxData != null) {
                    self.changeYaxisMin_MaxValue((YasixMin_MaxData.Min - parseInt(YasixMin_MaxData.Min / 10)), (YasixMin_MaxData.Max + parseInt(YasixMin_MaxData.Min / 10))); //更改Y轴最小、最大值
                }
                /*markeluo 20121126 10:17 end*/

                //save to memery
                self.chartOption.series = [];
                self.chartOption.series.push({
                    name: Tname,
                    data: serierData,
                    marker: {
                        symbol: 'circle'
                    }
                });

                //                    clearPlotLine.call(self);
                //                    addPlotLine.call(self,[
                //                        {value:1.450,text:'A'},
                //                        {value:1.510,text:'B'},
                //                        {value:1.470,text:'C'}
                //                    ]);
                //}); //end GetSpcDataForGrid
            } //end if
            else {

            }
        }); //end RequestData2
    } else {
        var data = et.Data;

        var result = {
            arr: [[], []],
            plot_data: {
                meanPlot: {
                    m_CC: 30010.602,
                    m_LCL: 29111.184492,
                    m_UCL: 30910.019507999998
                },
                rangePlot: {
                    r_CC: 879.1959999999999,
                    r_LCL: 0,
                    r_UCL: 2263.050504
                }
            }
        };
        for (var i = 0; i < data.length; i++) {
            var tData = data[i];
            result.arr[0].push(tData['y1']);
            result.arr[1].push(tData['y2']);
        }
        var Tname = "平均值";
        //et.Columns = d.Columns;
        //et.Data = d.Data;
        if (true) {
            //Spc.Data.GetSpcDataForGrid(et,self.Get("Groupnrow"), function (result) {
            //
            if (!result || !result.arr) {
                //alert('没有取到值!');
                return;
            }

            var PlotLines = null; //需要添加的UCL,CL,LCL线  markeluo 20121126 10:13
            var YasixMin_MaxData = null; //Y轴设置最小、最大值 markeluo 20121126 10:13
            var ada = null;
            if (self.BasicProperty.chartType == '均值') {
                ada = result.arr[0];
                var plot = result.plot_data.meanPlot; //markeluo 20121126 10:17
                if (plot) {
                    YasixMin_MaxData = { Min: plot.m_LCL.toFixed(3), Max: plot.m_UCL.toFixed(3) };

                    PlotLines = [];
                    PlotLines.push({ text: "UCL", value: YasixMin_MaxData.Max }); //最大值
                    PlotLines.push({ text: "CL", value: plot.m_CC.toFixed(3) }); //
                    PlotLines.push({ text: "LCL", value: YasixMin_MaxData.Min }); //最小值

                }
            } else {
                ada = result.arr[1];
                Tname = "极差值";
                var plot = result.plot_data.rangePlot; //markeluo 20121126 10:17
                if (plot) {
                    YasixMin_MaxData = { Min: plot.r_LCL.toFixed(3), Max: plot.r_UCL.toFixed(3) };

                    PlotLines = [];
                    PlotLines.push({ text: "UCL", value: plot.r_UCL.toFixed(3) }); //最大值
                    PlotLines.push({ text: "CL", value: plot.r_CC.toFixed(3) }); //
                    PlotLines.push({ text: "LCL", value: plot.r_LCL.toFixed(3) }); //最小值
                }
            }

            //get data
            var key = '',
                    serierData = [];
            for (var i = 0; i < ada.length; i++) {
                serierData.push({
                    y: ada[i],
                    marker: {
                        enabled: true,
                        radius: 4,
                        fillColor: '#14871a',
                        symbol: 'circle'
                    }
                });
            }

            //bind to chart
            self.clearSeriers();
            self.chart.addSeries({
                name: Tname,
                data: serierData,
                lineWidth: 2,
                lineColor: '#48a84f',
                shadow: false,
                marker: {
                    enabled: true,
                    radius: 4,
                    fillColor: '#14871a'
                    //fillColor:'#f00'
                },
                color: {
                    linearGradient: [0, 0, 0, 150],
                    stops: [
                            [0, 'rgba(72,168,79,0.2)'],
                            [100, 'rgba(72,168,79,0.2)']
                        ]
                },
                point: {
                    events: {
                        mouseOver: function () {
                            self.pointMouseover(this);
                        },
                        mouseOut: function () {
                            self.pointMouseout(this);
                        }
                    }
                }
            });

            //                    self.addPlotLines();

            self.Set("PlotLines", PlotLines); //markeluo 20121126 10:17 （由于点相对集中，所以需要设置Y轴起始值）
            self.addPlotLines(PlotLines);
            if (serierData != null && serierData.length > 0) {
                for (var i = 0; i < serierData.length; i++) {
                    if (serierData[i].y < YasixMin_MaxData.Min) {
                        YasixMin_MaxData.Min = serierData[i].y;
                    }
                    if (serierData[i].y > YasixMin_MaxData.Max) {
                        YasixMin_MaxData.Max = serierData[i].y;
                    }
                }
            }
            if (YasixMin_MaxData != null) {
                self.changeYaxisMin_MaxValue((YasixMin_MaxData.Min - parseInt(YasixMin_MaxData.Min / 10)), (YasixMin_MaxData.Max + parseInt(YasixMin_MaxData.Min / 10))); //更改Y轴最小、最大值
            }
            /*markeluo 20121126 10:17 end*/

            //save to memery
            self.chartOption.series = [];
            self.chartOption.series.push({
                name: Tname,
                data: serierData,
                marker: {
                    symbol: 'circle'
                }
            });
            //}); //end GetSpcDataForGrid
        } //end if
    }

    return;
}
}  //end

/*下拉列表参数更改 _DropDownListID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.ODChartParsChange = function (_DropDownListID, _ParsName, _ParsValue) {
    var ThisControl = Agi.Controls.FindControl(_DropDownListID); /*查找到相应的控件*/
    if (ThisControl) {
        ThisControl.Set(_ParsName, _ParsValue);
    }
}

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitSpcDemoODChart = function () {
    return new Agi.Controls.SpcDemoODChart();
}

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.ODChartProrityInit = function (SpcDemoODChart) {
    var self = SpcDemoODChart;


    var ThisProItems = [];

    var basicPro = $('<div></div>');
    basicPro.load('JS/Controls/SpcDemoControls/ODChart/ODChartSetting.html #ODChartBasicSetting1', function () {
        var tbody = $('#ODChartBasicSetting1 tbody');
        //初始化值
        tbody.find('[title="Y轴名称"]').val(self.BasicProperty.yAxisTitle)
            .bind('blur', function (e) {
                self.BasicProperty.yAxisTitle = $(this).val();
                self.RedrawChart();
            });
        if (self.BasicProperty.xAxislabel) {
            tbody.find('[title="X轴Label启用"]').attr('checked', 'checked');
        } else {
            tbody.find('[title="X轴Label启用"]').removeAttr('checked');
        }
        tbody.find('[title="图表类型"]').val(self.BasicProperty.chartType);
        //修改后重绘chart
        tbody.find('input,select').bind('change', function (e) {
            var title = $(this).attr('title');
            switch (title) {
                case "X轴Label启用":
                    self.BasicProperty.xAxislabel = $(this).attr('checked') ? true : false;
                    break;
                case "图表类型":
                    self.BasicProperty.chartType = $(this).val();
                    break
            } //end switch
            self.RedrawChart();
        });
    });

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: basicPro }));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);


    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        //        var itemtitle=_item.Title;
        //        if(_item.DisabledValue==0){
        //            itemtitle+="禁用";
        //        }else{
        //            itemtitle+="启用";
        //        }
        //        alert(itemtitle);
    }
}
