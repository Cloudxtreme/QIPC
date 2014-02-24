/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 */
/*copy，居然每次重复一样的代码*/
Namespace.register("Agi.Controls");
/*控件命名空间*/
Agi.Controls.TabsControl = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){ //获得实体数据

        },
        initData: function (data) {
            var that = this;
            if (data) {
                var control = this.Get("ProPerty").BasciObj;
                //加载控件
                control.load("JS/Controls/TabsControl/control.html", function () {
                    that.initDataFunction(control);
                });
            }
        },
        initDataFunction: function (control) {
            var tabsDiv = $(control).find('#tabs');
            /*初始化Tabs*/
            tabsDiv.tabs();
            /*选择事件*/
            tabsDiv.bind('tabsselect', function (event, ui) {
                var tabsTabid = ui.panel.id;
                var controlList = [];
                if (Agi.Edit) {
                    controlList = Agi.Edit.workspace.controlList.toArray();
                }
                else {
                    controlList = Agi.view.workspace.controlList.toArray();
                }
                for (var i = 0; i < controlList.length; i++) {
                    var control = controlList[i];
                    var controlTabid = control.Get('ProPerty').tabsTabid;
                    if (controlTabid) {
                        if (controlTabid == tabsTabid) {
                            $(control.Get('HTMLElement')).show();
                        }
                        else {
                            $(control.Get('HTMLElement')).hide();
                        }
                    }
                }
                // Objects available in the functio\n context:
                //                ui.tab     // anchor element of the selected (clicked) tab
                //                ui.panel   // element, that contains the selected/clicked tab contents
                //                ui.index   // zero-based index of the selected (clicked) tab
                $(window).resize();
            });
            /*关闭Tab*/
            $("#tabs span.ui-icon-close").live("click", function () {
                //var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
                var panelId = $(this).closest("li").remove().find("a").attr("href")
                $(panelId).remove();
                tabsDiv.tabs("refresh");
            });
            //
            var oPropertySettings = this.Get("PropertySettings");
            if (oPropertySettings.tabs.length > 0) {
                tabsDiv.tabs("remove", 0);
                for (var i = 0; i < oPropertySettings.tabs.length; i++) {
                    var tab = oPropertySettings.tabs[i];
                    var tabTemplate = '<li>' +
                        '<a href="#{tabid}">' +
                        '<div class="main">{tab_title}</div>' +
                        '<div class="sub">{tab_title_en}</div>' +
                        '</a>' +
                        '<span class="ui-icon ui-icon-close">Remove Tab</span>' +
                        '</li>';
                    var id = tab.id,
                        title = tab.title,
                        title_en = tab.title_en,
                        li = $(tabTemplate.replace('{tabid}', id).replace('{tab_title}', title).replace('{tab_title_en}', title_en));
                    tabsDiv.find(".ui-tabs-nav").append(li);
                    tabsDiv.append("<div id='" + id + "'></div>");
                    tabsDiv.tabs("destroy");
                    tabsDiv.tabs();
                    $("#tabs span.ui-icon-close").hide();
                }
                tabsDiv.tabs("select", 1).tabs("select", 0);
            }

            //应用样式
            this.ChangeTheme(this.Get('ThemeInfo'));
        },
        Render: function (_Target) {
            //
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
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 60,
                minWidth: 180
            });
            return this;
        },
        ReadData: function (et) {
            return;
        },
        ReadOtherData: function (Point) {
            var ThisProPerty = this.Get("ProPerty");
            Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": ThisProPerty.ID, "Points": [Point] });
            ThisProPerty.realtimeTag = Point;
            this.Set("ProPerty", ThisProPerty);
            var PropertySettings = this.Get("PropertySettings");
            PropertySettings.realtimeTag = Point;
            this.Set("PropertySettings", PropertySettings);
        },
        ReadRealData: function (MsgObj) {
            var ThisProPerty = this.Get("ProPerty");
            var DashboardChartProperty = ThisProPerty.BasciObj;
            if (!isNaN(MsgObj.Value)) {
                this.initData(MsgObj);
            }
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            //this.Set('Entity', this.Get('Entity'));
            this.ReadData(this.Get('Entity')[0]);
        },
        Init: function (_Target, _ShowPosition, trueid) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "TabsControl");
            //PropertySettings
            var oPropertySettings = {
                tabs: [
                //{id:'', title:'', title_en:''}
                ]
            }
            this.Set("PropertySettings", oPropertySettings)
            //
            var ID = 0;
            if (trueid) {
                ID = trueid;
            }
            else {
                ID = "TabsControl" + Agi.Script.CreateControlGUID();
            }
            //
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='overflow:hidden ;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 640,
                height: 360,
                divPanel: HTMLElementPanel
            });
            //
            var TabsControlBasicProperty = {
                TabsControlTextField: undefined,
                TabsControlValueField: undefined,

                LeftFillet1: 0,
                LeftFillet2: 0,
                RightFillet1: 0,
                RightFillet2: 0,
                fontSize: "14",
                fontColor: "black",
                bgColor: "white",
                FontText: "test",
                borderWidth: 0,
                borderColor: "red",

                hrefAddress: "",
                IsDisabledhrefAddress: "disabled",
                OpenPosition: "",
                IsDisabledOpenPosition: "disabled",
                InsideLinkAddress: "",
                IsDisabledInsideLinkAddress: null,
                IsLink: null,
                IsShadow: null
            };
            this.Set("TabsControlBasicProperty", TabsControlBasicProperty);
            //
            //  Agi.Controls.objTabsControl = ToUrl;
            var getTabsControlProperty = this.Get("TabsControlBasicProperty");
            var BaseControlObj = $('<div id="' + ID + '" class="TabsControlPor" value="">'
                + '<div id="TabsControlObjId">'
                + '</div>'
                + '</div>');
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);

            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
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
            // this.Set("HTMLElement", ThisProPerty.BasciObj[0]);
            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(640);
                HTMLElementPanel.height(360);
                //BaseControlObj.height($('.HTMLElementPanel').height() - 14);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("PanelSty");
                HTMLElementPanel.addClass("AutoFill_PanelSty");
                obj.html("");
            }
            if (_Target != null) {
                this.Render(_Target);
            }
            var StartPoint = { X: 0, Y: 0 }
            var self = this;
            /*事件绑定*/
            if (Agi.Edit) {
                $('#' + self.shell.ID).live('mousedown', function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });

                $('#' + self.shell.ID).live('dblclick', function (ev) {
                    if (!Agi.Controls.IsControlEdit) {
                        Agi.Controls.ControlEdit(self); //控件编辑界面
                    }
                });
                if (HTMLElementPanel.touchstart) {
                    HTMLElementPanel.touchstart(function (ev) {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    });
                }
            }
            //
            this.Set("Position", PostionValue);
            //
            //            Agi.Msg.PageOutPramats.AddPramats({
            //                'Type': Agi.Msg.Enum.Controls,
            //                'Key': ID,
            //                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1 }]
            //            });
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = TabsControlFilter = null;
            //缩放最小宽高设置
            if (Agi.Edit) {
                HTMLElementPanel.resizable({
                    minHeight: 32,
                    minWidth: 32
                });
            }
            //
            this.initData(true);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/

            Agi.Edit.workspace.controlList.remove(this);
            //Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/

            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        CustomProPanelShow: function () {
            Agi.Controls.TabsControlPropertyInit(this);
        },
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
//                var PostionValue = this.Get("Position");
//                var newTabsControlPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewTabsControl = new Agi.Controls.TabsControl();
//                NewTabsControl.Init(ParentObj, newPanelPositionpars);
//                newTabsControlPositionpars = null;
//                return NewTabsControl;
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
            } else {
                //var ParentObj=$(this.Get("HTMLElement")).parent();
                var ParentObj = $("#BottomRightCenterContentDiv");
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };
                var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);

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
        },
        FilterChange: function (_Fillter) {
            if (_Fillter != null && _Fillter.LeftFillet1 != null && _Fillter.LeftFillet2 != null && _Fillter.RightFillet1 != null && _Fillter.RightFillet2 != null) {
                this.Set("TabsControlBasicProperty", _Fillter);
                _Fillter = null;
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
            /*   $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
            "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"
            });*/
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        EnterEditState: function (size) {
            /*Tab关闭按钮*/
            $("#tabs span.ui-icon-close").show();
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            if (size) {
                obj.css({ "width": size.width, "height": size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
            //
            var width = $("#ControlEditPageLeft").css("width");
            var height = $("#ControlEditPageLeft").css("height");
            //
            /*this.shell.Container.width(width);
            this.shell.Container.height(height);*/
            obj.css({ "width": width, "height": height })
        },
        BackOldSize: function () {
            /*Tab关闭按钮*/
            $("#tabs span.ui-icon-close").hide();
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight: 100,
                    minWidth: 100
                });
            }
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            switch (Key) {
                case "Position":
                    if (layoutManagement.property.type == 1) {
                        var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                        var ParentObj = ThisHTMLElement.parent();
                        var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                        ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                        ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                        ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                        ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                    }
                    break;
                case "TabsControlBasicProperty":
                    if (layoutManagement.property.type == 1) {
                        var $UI = $('#' + this.shell.ID).find('.TabsControlPor');
                        $(this.Get('HTMLElement')).css("border-top-left-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-top-right-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-bottom-left-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-bottom-right-radius", "5px");

                        $('#' + this.shell.ID).find('#TabsControlObjId').css({ "font-size": "" + _Value.fontSize + "px" });
                        $('#' + this.shell.ID).find('#TabsControlObjId').css({ "color": "" + _Value.fontColor + "" });
                        /*if (_Value.FontText) {
                        $('#' + this.shell.ID).find('#TabsControlObjId').text(_Value.FontText);
                        }
                        else if (_Value.TabsControlTextField) {
                        $('#' + this.shell.ID).find('#TabsControlObjId').text(_Value.TabsControlTextField);
                        }*/

                        //$(this.Get('HTMLElement')).css({"background-color":"" + _Value.bgColor + ""});
                        // $("#"+propertyTabsControl.shell.BasicID).css({" text-align":""+fontPosition+""});  TabsControlObjId
                        $UI.css({ "border-width": "" + _Value.borderWidth + "" });
                        $UI.css({ "border-color": "" + _Value.borderColor + "" });
                        if (_Value.hrefAddress != "" || _Value.InsideLinkAddress != "") {
                            $UI.css({ "text-decoration": "underline", "cursor": "pointer" });
                        }
                    }
                    break;
                    var self = _obj;
                case "data": //用户选择了一个项目
                    {
                        var data = _ControlObj.Get('data');
                        if (data.selectedValue.value) {
                            //alert('您选择了:'+data.selectedValue.value +'\n'+ data.selectedValue.text);
                            var ThisProPerty = _ControlObj.Get("ProPerty");
                            Agi.Msg.PageOutPramats.PramatsChange({
                                'Type': Agi.Msg.Enum.Controls,
                                'Key': ThisProPerty.ID,
                                'ChangeValue': [
                                { 'Name': 'selectedValue', 'Value': data.selectedValue.value }
                            ]
                            });
                            Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _obj, "Type": Agi.Msg.Enum.Controls });
                        }
                    }
                    break;
                case "Entity": //实体
                    {
                        var entity = _obj.Get('Entity');
                        if (entity && entity.length) {
                            //BindDataByEntity(_obj, entity[0]);
                            //this.ReadData(entity[0]);
                        } else {
                            var $UI = $('#' + self.shell.ID);
                            $UI.find('.TabsControlPor').text('');
                        }
                    }
                    break;
            } //end switch
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.TabsControl.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var Property = this.Get("ProPerty");
            //
            /*保存选项卡*/
            var oPropertySettings = this.Get("PropertySettings")
            oPropertySettings.tabs = [];
            var control = Property.BasciObj;
            var tabs = $(control).find("#tabs li");
            for (var i = 0; i < tabs.length; i++) {
                var tab = $(tabs[i]);
                oPropertySettings.tabs.push(
                    {
                        id: tab.find("a").attr("href").substring(1),
                        title: tab.find("a>.main").text(),
                        title_en: tab.find("a>.sub").text()
                    }
                )
            }
            //
            var config = {
                ControlType: this.Get("ControlType"),
                ControlID: Property.ID,
                ControlBaseObj: Property.ID,
                HTMLElement: Property.ID,
                Entity: this.Get("Entity"),
                Position: this.Get("Position"),
                TabsControlBasicProperty: this.Get("TabsControlBasicProperty"),
                TabsControlPropertySettings: oPropertySettings,
                ThemeInfo: this.Get("ThemeInfo")
            }
            //console.log(config.TabsControlPropertySettings)
            //console.log(JSON.stringify(this.Get("PropertySettings")))

            //
            //return JSON.stringify(config);
            return config;
            //
            /*  var ConfigObj = new Agi.Script.StringBuilder();
            */
            /*配置信息数组对象*/
            /*
            ConfigObj.append("<Control>");
            ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>");
            */
            /*控件类型*/
            /*
            ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>");
            */
            /*控件属性*/
            /*
            ConfigObj.append("<ControlBaseObj>" + ProPerty.ID + "</ControlBaseObj>");
            */
            /*控件基础对象*/
            /*
            ConfigObj.append("<HTMLElement>" + ProPerty.ID + "</HTMLElement>");
            */
            /*控件的外壳HTML元素信息*/
            /*

            ConfigObj.append("<Entity>" + JSON.stringify(this.Get("Entity")) + "</Entity>");
            */
            /*控件的外壳HTML元素信息*/
            /*
            ConfigObj.append("<Position>" + JSON.stringify(this.Get("Position")) + "</Position>");
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("<TabsControlBasicProperty>" + JSON.stringify(this.Get("TabsControlBasicProperty")) + "</TabsControlBasicProperty>");
            //
            var PropertySettings = this.Get("PropertySettings");
            ConfigObj.append("<PropertySettings>" + JSON.stringify(PropertySettings) + "</PropertySettings>");
            //
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("<ThemeInfo>" + JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>");
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串*/
            var TabsControlControl = {
                Control: {
                    ControlType: this.Get("ControlType"), //*控件类型*//
                    ControlID: ProPerty.ID, //*控件属性*//
                    ControlBaseObj: ProPerty.ID, //*控件基础对象*//
                    HTMLElement: ProPerty.ID, //*控件的外壳HTML元素信息*//
                    Entity: this.Get("Entity"), //*实体*//
                    Position: this.Get("Position"), //*控件位置信息*//
                    TabsControlBasicProperty: this.Get("TabsControlDataProperty"), //*控件基本属性*//
                    ThemeInfo: this.Get("ThemeInfo")
                }
            }
            return TabsControlControl.Control;
        }, //获得TabsControl控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement, _Config.ControlID);
            if (_Config != null) {
                var TabsControlBasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;

                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    TabsControlBasicProperty = _Config.TabsControlBasicProperty;
                    this.Set("TabsControlBasicProperty", TabsControlBasicProperty);

                    var PropertySettings = _Config.TabsControlPropertySettings;
                    this.Set("PropertySettings", PropertySettings);


                    var ThisProPerty = this.Get('ProPerty');
                    //ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    $("#" + ThisProPerty.ID).css({ "font-size": "" + TabsControlBasicProperty.fontSize + "px" });
                    $("#" + ThisProPerty.ID).css({ "color": "" + TabsControlBasicProperty.fontColor + "" });
                    //$("#" + ThisProPerty.ID).css({"background-color":"" + TabsControlBasicProperty.bgColor + ""});
                    $("#" + ThisProPerty.ID).val(TabsControlBasicProperty.FontText);
                    $("#" + ThisProPerty.ID).css({ "border-width": "solid " + TabsControlBasicProperty.borderWidth + "" });
                    $("#" + ThisProPerty.ID).css({ "border-color": "" + TabsControlBasicProperty.borderColor + "" });
                    if (TabsControlBasicProperty.hrefAddress != "" || TabsControlBasicProperty.InsideLinkAddress != "") {
                        $("#" + ThisProPerty.ID).css({ "text-decoration": "underline" });
                    }

                    

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
                    //this.ReadData(_Config.Entity[0]);
                    //
                    //this.initData(PropertySettings.tabs)

                    //应用样式
//                    this.ChangeTheme(_Config.ThemeInfo);
                }
            }
        } //根据配置信息创建控件
    }, true);
    /*控件初始化*/

    /*应用样式，将样式应用到控件的相关参数以更新相关显示
    * _StyConfig:样式配置信息
    * _Tabs:当前控件对象
    * */
    Agi.Controls.TabsControl.OptionsAppSty = function (_StyConfig, _Tabs) {
        if (_StyConfig != null) {
            var mid = _Tabs.shell.BasicID;
            $('#' + mid + ' .ui-tabs-nav').css("background", _StyConfig.ulBackground);
            $('#' + mid + ' #tabs').css("background", _StyConfig.tabsBackground);
        }
    }

Agi.Controls.InitTabsControl = function () {
    return new Agi.Controls.TabsControl();
}
/*属性初始化*/
Agi.Controls.TabsControlPropertyInit = function (TabsControl) {
    //
    var selfID = $("#" + TabsControl.shell.BasicID)
    //
    var ThisProItems = [];
    //绘制属性配置界面
    var bindHTML = $('<form class="form-horizontal"></form>');
    //基本属性
    var ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicProperty_Radius'>");
    ItemContent.append("<table class='RadiusTable'>");
    ItemContent.append("<tr>")
    /*ItemContent.append("<td class='prortityTabsControlTabletd0'>USL</td><td class='prortityTabsControlTabletd1'>"
     + "<div class='selectDivClass'>"
     + "<input id='TabsControlPropertyUSL' type='text' value='' style='width: 100px'/>"
     + "</div></td>")
     ItemContent.append("<td class='prortityTabsControlTabletd0'>LSL</td><td class='prortityTabsControlTabletd1'>"
     + "<div class='selectDivClass'>"
     + "<input type='text' id='TabsControlPropertyLSL' value='' style='width: 100px'/>"
     + "</div></td></tr>");
     ItemContent.append("<tr>")
     ItemContent.append("<td class='prortityTabsControlTabletd0'>目标</td><td class='prortityTabsControlTabletd1'>"
     + "<div class='colorDivClass'>"
     + "<input type='text' id='TabsControlPropertyTarget' value='' style='width: 100px'>"
     + "</div></td>")
     ItemContent.append("<td class='prortityTabsControlTabletd0'>每组大小</td><td class='prortityTabsControlTabletd1'>"
     + "<div class='colorDivClass'>"
     + "<input type='text' id='TabsControlPropertyNrow' value='' style='width: 100px'>"
     + "</div></td></tr>")*/
    ItemContent.append("<tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityTabsControlTabletd0'colspan='4'>"
        + "<input type='button' value='添加选项卡' id='TabsControlPropertyAdd' class='btnclass'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    //
    var PropertySettingsHtml = $(ItemContent.toString());
    //
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"基本设置", DisabledValue:1, ContentObj:PropertySettingsHtml }));
    //
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
//        var itemtitle = _item.Title;
//        if (_item.DisabledValue == 0) {
//            itemtitle += "禁用";
//        } else {
//            itemtitle += "启用";
//        }
//        alert(itemtitle);
    }
    //初始化控件属性
}
/*控件事件*/
$("#TabsControlPropertyAdd").live(
    "click",
    function () {
        var control = Agi.Edit.workspace.currentControls[0];
        var propertySettings = control.Get("PropertySettings")
        //
        //var tabs = control.Get("ProPerty").BasciObj.find("#tabs");
        var tabs = $("#tabs").tabs();
        //
        $("#controlPropertyHost").load("JS/Controls/TabsControl/addTab.html",
            function () {
                var tabTitle = $(this).find('#tab_title'),
                    tabTitle_en = $(this).find("#tab_title_en"),
                //tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>";
                    tabTemplate = '<li>' +
                        '<a href="#{tabid}">' +
                        '<div class="main">{tab_title}</div>' +
                        '<div class="sub">{tab_title_en}</div>' +
                        '</a>' +
                        '<span class="ui-icon ui-icon-close">Remove Tab</span>' +
                        '</li>';
                //
                var dialog = $("#dialog").dialog({
                    autoOpen:false,
                    modal:true,
                    buttons:{
                        Add:function () {
                            addTab();
                            $(this).dialog("close");
                        },
                        Cancel:function () {
                            $(this).dialog("close");
                        }
                    },
                    close:function () {
                        form[ 0 ].reset();
                    }
                });
                var form = dialog.find("form").submit(function (event) {
                    addTab();
                    dialog.dialog("close");
                    event.preventDefault();
                });
                //
                function addTab() {
                    var id = 'tabs-' + Agi.Script.CreateControlGUID(),
                        title = tabTitle.val(),
                        title_en = tabTitle_en.val(),
                        li = $(tabTemplate.replace('{tabid}', id).replace('{tab_title}', title).replace('{tab_title_en}', title_en));
                    tabs.find(".ui-tabs-nav").append(li);
                    tabs.append("<div id='" + id + "'></div>");
                    tabs.tabs("destroy");
                    tabs.tabs();
                    $("#tabs span.ui-icon-close").show();
                };
                //
                dialog.dialog("open");
            });
    }
)

