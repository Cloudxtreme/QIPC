/**
 * Created with JetBrains WebStorm.
 * User: wulei
 * Date: 12-9-11
 * Time: 上午3:00
 * To change this template use File | Settings | File Templates.
 * * TimePicker多日历控件
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.TimePicker = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () { //获得实体数据

        },
        Render: function (_Target) {
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }

            var data = self.Get('data');
            var ThisHTMLElement = self.shell.Container[0]; //self.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj)
                    .find('.dropdown-menu li').live('click', function (e) {
                        $(ThisHTMLElement).find('.dropdown-toggle').html($(this).text() + '<b class="caret"></b>');
                        $(ThisHTMLElement).find('.dropdown').removeClass('open');
                        data.selectedValue.value = $(this).data('value');
                        data.selectedValue.text = $(this).find('a').text();
                        self.Set('data', data);
                    });
            }
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }
            // menuManagement.updateDataSourceDragDropTargets();
        },
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
            var data = self.Get('data');
            var ThisHTMLElement = self.shell.Container;
            var $ThisHTMLElement = $('#' + ThisHTMLElement[0].id);
            $ThisHTMLElement.find('.dropdown-menu li').unbind().bind('click', { ThisHTMLElement: $ThisHTMLElement }, function (e) {
                e.data.ThisHTMLElement.find('.dropdown-toggle').html($(this).text() + '<b class="caret"></b>');
                e.data.ThisHTMLElement.find('.dropdown').removeClass('open');
                data.selectedValue.value = $(this).data('value');
                data.selectedValue.text = $(this).find('a').text();
                self.Set('data', data);
            });
            return this;
        },
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 25,
                minWidth: 190,
                maxHeight: 25
            });
            return this;
        },
        RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'TimePicker.RemoveEntity Arg is null';
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
            //            var entity  = this.Get("Entity");
            //            entity = [];
            //            entity.push(et);
            //            this.Set("Entity",entity);
            //20121227 11:18 罗万里 改控件不支持加载实体
            AgiCommonDialogBox.Alert("此控件不支持加载实体！");
            return;
        },
        ReadRealData: function (_Entity) {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "TimePicker");
            var ID = savedId ? savedId : "TimePicker" + Agi.Script.CreateControlGUID();
            //var HTMLElementPanel=$("<div id='Panel_"+ID+"' class='PanelSty selectPanelSty'><div id='head_"+ID+"' class='selectPanelheadSty'></div></div>");
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom: 15px;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 190,
                height: 25,
                divPanel: HTMLElementPanel
                // enableFrame:true; 显示蓝条
            });
            //隐藏头
            // this.shell.Title.hide();

            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var nowDay = myDate.getFullYear() + "-" + month + "-" + myDate.getDate();
            var month = myDate.getMonth() + 1;
            var nowDay = myDate.getFullYear() + "-" + month + "-" + myDate.getDate();
            var dfy = myDate.getDate() - 4;
            var oldDay = myDate.getFullYear() + "-" + month + "-" + dfy;
            var showDay = oldDay + "至" + nowDay;


            Agi.Controls.objFunction = initLayout;
            var mywidgetCalendar = "widgetCalendar" + ID;
            var myTimePickID = "aid" + ID;
            var mywidgetFieldID = "Field" + ID;
            var BaseControlObj = $('<div id="' + ID + '" class="navbar">' +
            // '<div id="widgetField"> '+
            // '<span>2012-08-01至2012-10-31</span> '+
                            '<input type="text" class="widgetFieldClass" id="' + mywidgetFieldID + '" style=" height:24px; width:100%; padding-left: 0px; padding-right: 0px;" readonly value="' + showDay + '">' +
            // '<label style=" width:100%; padding-left: 0px; padding-right: 0px;"></label>'+
                           ' <a href="#" id="' + myTimePickID + '" onclick=" Agi.Controls.objFunction(id)" name="ATine" class="DropDownDatePick">Select date range</a>' +  // onclick="Agi.Controls.objFunction()"
                        ' </div>' +
            // '<div class="widgetCalendar" id="'+mywidgetCalendar+'"></div>'+   Agi.Controls.objFunction('+this.id+')
                '</div>');
            //HTMLElementPanel.append(BaseControlObj);
            // Agi.Controls.DropDownDatePicker(this);
            var pickerHtml = $('<div class="widgetCalendar" id="' + mywidgetCalendar + '"></div>');
            // var pickerHtml = $( '<div id="widgetCalendar"></div>');
            pickerHtml.appendTo(HTMLElementPanel);
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            //20130115 倪飘 解决控件默认背景颜色与控件属性设置中默认背景颜色选择框中的不一致问题
            var BasicProperty = {
                fontColor: "",
                fontSize: 12,
                bgColor: "#f3f3f3",
                CalendarSkinValue: "2",
                SelectDate: "",
                BeginDate: "",
                EndDate: ""
            };
            this.Set('BasicProperty', BasicProperty);

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
                HTMLElementPanel.width(190);
                HTMLElementPanel.height(25);
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
            var self = this;
            /*时间控件的方法*/
            var state = false;
            var _OutPramats;
            //            $(document).live('mousedown',function(){
            //                if(state){
            //                    $('#widgetCalendar').stop().animate({height: state ? 0 : $('#widgetCalendar div.datepicker').get(0).offsetHeight}, 0);
            //                    state = true;
            //                }
            //            });
            function initLayout(colid) {
                var varWidgetCalendar = mywidgetCalendar.substring(24, mywidgetCalendar.length);
                var varFieldID = mywidgetFieldID.substring(15, mywidgetFieldID.length);
                var varAid = colid.substring(13, colid.length);
                if (varAid != varWidgetCalendar && varAid != varFieldID) {
                    var myCalendar = mywidgetCalendar.substring(0, 24) + varAid;
                    var myFieldID = mywidgetFieldID.substring(0, 15) + varAid;
                    $('#date').DatePicker({
                        flat: true,
                        date: '2008-07-31',
                        current: '2008-07-31',
                        calendars: 1,
                        starts: 1,
                        view: 'years'
                    });
                    var now3 = new Date();
                    now3.addDays(-4);
                    var now4 = new Date()
                    // $("#widgetCalendar").DatePicker({
                    $("#" + myCalendar).DatePicker({
                        flat: true,
                        // format: 'd B, Y',
                        format: 'Y-m-d',
                        date: [new Date(now3), new Date(now4)],
                        calendars: 3,
                        mode: 'range',
                        starts: 1,
                        onChange: function (formated) {
                            $('#' + myFieldID).val(formated.join('至'));
                            var timeval = $('#' + myFieldID).val(); //输出参数改变
                            if (timeval) {
                                var beginDate = timeval.substring(0, 10);
                                var endDate = timeval.substring(11, 21);
                                if (beginDate != endDate) {
                                    _OutPramats = { "BeginTime": beginDate, "EndTime": endDate }
                                    self.Set("OutPramats", _OutPramats);
                                }
                            }

                        }
                    });
                    // $('#widgetCalendar').stop().animate({height: state ? 0 : $('#widgetCalendar div.datepicker').get(0).offsetHeight}, 500);   colid
                    $("#" + myCalendar).stop().animate({ height: state ? 0 : $("#" + myCalendar).find('div.datepicker').get(0).offsetHeight }, 500);
                    state = !state;
                    return false;
                } else {
                    // alert(varAid+"助燃"+mywidgetCalendar);
                    $('#date').DatePicker({
                        flat: true,
                        date: '2008-07-31',
                        current: '2008-07-31',
                        calendars: 1,
                        starts: 1,
                        view: 'years'
                    });
                    var now3 = new Date();
                    now3.addDays(-4);
                    var now4 = new Date()
                    // $("#widgetCalendar").DatePicker({
                    $("#" + mywidgetCalendar).DatePicker({
                        flat: true,
                        // format: 'd B, Y',
                        format: 'Y-m-d',
                        date: [new Date(now3), new Date(now4)],
                        calendars: 3,
                        mode: 'range',
                        starts: 1,
                        onChange: function (formated) {
                            $('#' + mywidgetFieldID).val(formated.join('至'))
                            var timeval = $('#' + mywidgetFieldID).val(); //输出参数改变
                            if (timeval) {
                                var beginDate = timeval.substring(0, 10);
                                var endDate = timeval.substring(11, 21);
                                if (beginDate != endDate) {
                                    _OutPramats = { "BeginTime": beginDate, "EndTime": endDate }
                                    self.Set("OutPramats", _OutPramats);
                                }
                            }

                        }
                    });
                    // $('#widgetCalendar').stop().animate({height: state ? 0 : $('#widgetCalendar div.datepicker').get(0).offsetHeight}, 500);   colid
                    $("#" + mywidgetCalendar).stop().animate({ height: state ? 0 : $("#" + mywidgetCalendar).find('div.datepicker').get(0).offsetHeight }, 500);
                    state = !state;
                    return false;
                    //  });
                    //  $('#widgetCalendar div.datepicker').css('position', 'absolute');
                }
            };
            var StartPoint = { X: 0, Y: 0 }

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
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            this.Set("Position", PostionValue);
            //输出参数
            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            var nowDay = myDate.getFullYear() + "-" + month + "-" + myDate.getDate();
            //  Agi.Edit.workspace.addParameter(ID + ".SelValue", 0);
            obj = ThisProPerty = PagePars = PostionValue = null;
            var basicproperty = self.Get("BasicProperty");
            var OutPramats;
            if (basicproperty.SelectDate == "") {
                OutPramats = { "BeginTime": nowDay, "EndTime": nowDay };
            } else {
                OutPramats = { "BeginTime": basicproperty.BeginDate, "EndTime": basicproperty.EndDate };
            }
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
            //缩小的最小宽高设置
            if (Agi.Edit) {
                HTMLElementPanel.resizable({
                    minHeight: 25,
                    minWidth: 190,
                    maxHeight: 25
                });
            }
            //主题名称
            this.Set("ThemeName", null);
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.TimePickerProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
//            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

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
                var NewTimePicker = new Agi.Controls.TimePicker();
                NewTimePicker.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewTimePicker;
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
            ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
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
        EnterEditState: function (size) { //进入编辑属性
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            this.shell.Container.height(60);
            this.shell.Container.width(180);
        },
        BackOldSize: function () { //从属性面板返回，人控制最小宽高
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight: 25,
                    minWidth: 180,
                    maxHeight: 25
                });
            }
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.TimePickerAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            /*  var ConfigObj = new Agi.Script.StringBuilder(); *//*配置信息数组对象*//*
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

            ConfigObj.append("<BasicProperty>" +JSON.stringify(this.Get("BasicProperty")) + "</BasicProperty>"); */
            /**//*
            ConfigObj.append("<Position>" +JSON.stringify(this.Get("Position")) + "</Position>"); */
            /**//*
            ConfigObj.append("<ThemeInfo>" +JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>"); */
            /**//*
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串*/
            var TimePickControl = {
                Control: {
                    ControlType: this.Get("ControlType"), //控件类型
                    ControlID: ProPerty.ID, //控件属性
                    ControlBaseObj: ProPerty.BasciObj[0].id, //控件对象
                    HTMLElement: ProPerty.BasciObj[0].id, //控件外壳ID
                    Entity: this.Get("Entity"), //控件实体
                    BasicProperty: this.Get("BasicProperty"), //控件基本属性
                    Position: this.Get("Position"), //控件位置
                    ChangeTime: $(this.Get('HTMLElement')).find('.widgetFieldClass').val(), //显示在文本框里的时间
                    ThemeName: this.Get("ThemeName"), //主题名称
                    ZIndex: $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index")//显示层次
                }
            }
            //            TimePickControl.Control.ControlType = this.Get("ControlType");
            //            TimePickControl.Control.ControlID = ProPerty.ID;
            //            TimePickControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            //            TimePickControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            //            var Entitys = this.Get("Entity");
            //            $(Entitys).each(function(i,e){
            //                e.Data = null;
            //            });
            //            TimePickControl.Control.Entity = Entitys;
            //            TimePickControl.Control.BasicProperty = this.Get("BasicProperty");
            //            TimePickControl.Control.Position = this.Get("Position");
            //            TimePickControl.Control.ThemeInfo = this.Get("ThemeInfo");
            return TimePickControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    this.Set("Position", _Config.Position);

                    this.Set("ThemeName", _Config.ThemeName);
                    if (_Config.hasOwnProperty("ThemeName")) {
                        this.ChangeTheme(_Config.ThemeName);
                    }

                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);


                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);
                    $("#" + ThisProPerty.ID).css("z-index", _Config.ZIndex);
                    $("#" + ThisProPerty.ID).find('input').css("color", BasicProperty.fontColor);
                    $("#" + ThisProPerty.ID).find('input').css("font-size", BasicProperty.fontSize + "px");
                    $("#" + ThisProPerty.ID).find('input').css("background-color", BasicProperty.bgColor);
                    var selectVal = BasicProperty.CalendarSkinValue
                    // var colObj = $(this.Get('HTMLElement')).find('#widgetCalendar');        mywidgetCalendar    widgetCalendar
                    // var colObj = $(this.Get('HTMLElement')).find('#widgetCalendar'+ThisProPerty.ID);
                    if (_Config.ChangeTime != "") {
                        $(this.Get('HTMLElement')).find('.widgetFieldClass').val(_Config.ChangeTime);
                    }
                    var colObj = $(this.Get('HTMLElement')).find('.widgetCalendar');
                    switch (selectVal) {
                        case "1":
                            colObj.css({ "background": "-webkit-gradient(linear, 0 0, 0 bottom, from(#0000FF), to(rgba(0, 0, 255, 0.5)))" });
                            break;
                        case "2":
                            // colObj.css({"background":"-webkit-gradient(linear, 0 0, 0 bottom, from(#2F93D9), to(#236DA1))"});
                            colObj.css({ "background": " -webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb)" });
                            break;
                        case "3":
                            colObj.css({ "background": "-webkit-gradient(linear, 0 0, 0 bottom, from(#C0D9D9), to(#32CD99))" });
                            break;
                        case "4":
                            colObj.css({ "background": "-webkit-gradient(linear, 0 0, 0 bottom, from(#D8BFD8), to(#4F2F4F))" });
                            break;
                        case "5":
                            colObj.css({ "background": "-webkit-gradient(linear, 0 0, 0 bottom, from(#FF2400), to(#FF7F00))" });
                            break;
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
                }
            }

        }, //根据配置信息创建控件
        ChangeTheme: function (_themeName) {
            var Me = this;
            //1.根据当前控件类型和样式名称获取样式信息
            var TimePickerStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //2.保存主题
            Me.Set("ThemeName", _themeName);

            //3.应用当前控件的信息
            Agi.Controls.TimePicker.OptionsAppSty(TimePickerStyleValue, Me);
            //4.
            //   this.Set("BasicProperty", TimePickerStyleValue);
            //5.控件刷新显示
            //  Me.Refresh();//刷新显示

            //   TimePickerStyleValue=null;
        } //更改控件样式
    }, true);
/*应用样式，将样式应用到控件的相关参数以更新相关显示
* _StyConfig:样式配置信息
* _Options:控件相关参数信息
   * */
Agi.Controls.TimePicker.OptionsAppSty=function(_StyConfig,_TimePicker){
    if(_StyConfig !=null){
        var min =  _TimePicker.shell.BasicID;
        $("#" +min).find('input').css("color", _StyConfig.fontColor);
        $("#" +min).find('input').css("font-size", _StyConfig.fontSize + "px");
        $("#" +min).find('input').css("background-color", _StyConfig.bgColor);
        $("#" + min).find('input').css("background", _StyConfig.backgroundw);
        $("#" + min).find('input').css("border", _StyConfig.border);
        $("#" + min).find('input').css("border-radius", _StyConfig.borderRadius);
        $("#" + min).find('input').css("text-indent", _StyConfig.textIndet);
        $("#" + min).find('input').css("height", "22px");
        $("#" + min).find('input').css("padding", "0px");
        var colObj =  $("#" + _TimePicker.shell.ID).find('.widgetCalendar');
        colObj.css("background","none");
        colObj.css("background",_StyConfig.background);
    }
}

/*多日历控件参数更改处理方法*/
Agi.Controls.TimePickerAttributeChange=function(_ControlObj,Key,_Value){
    var self = _ControlObj ;
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
        case "Entity": //实体
//        {
//            var entity = self.Get('Entity');
//            if (entity && entity.length) {
//                BindDataByEntity(self, entity[0]);
//            }
 //20121227 11:18 罗万里 改控件不支持加载实体

            //} break;  //2012-12-29 modify by lj 之前修改的少注释了一行代码 导致控件拖不出来
        case "OutPramats"://用户选择了一个项目
        {
            if(_Value!=0){
                //var ThisControlPrority=_ControlObj.Get("ProPerty");
                var ThisOutPars=[];
                if(_Value!=null){
                    for(var item in _Value){
                        ThisOutPars.push({Name:item,Value:_Value[item]});
                                             }
                                   }
                Agi.Msg.PageOutPramats.PramatsChange({/*Chart 输出参数更改*/
                    "Type": Agi.Msg.Enum.Controls,
                    "Key":_ControlObj.shell.BasicID,
                    "ChangeValue":ThisOutPars
                         });
                Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj,"Type":Agi.Msg.Enum.Controls});
                ThisOutPars=null;
            } //通知消息模块，参数发生更改
        }break;
    }
}//end


/*下拉列表参数更改 _DropDownListID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.TimePickerParsChange=function(_DropDownListID,_ParsName,_ParsValue){
    var ThisControl=Agi.Controls.FindControl(_DropDownListID);/*查找到相应的控件*/
    if(ThisControl){
        ThisControl.Set(_ParsName,_ParsValue);
    }
}

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitTimePicker=function(){
    return new Agi.Controls.TimePicker();
}

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.TimePickerProrityInit=function(dropDownControl){
    timePick=dropDownControl;
    var mid = timePick.shell.BasicID;
    var ThisProItems = [];
    var ItemContent = new Agi.Script.StringBuilder();
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='TimePickerProperty'>");
    ItemContent.append("<div class='TimePickerProperty' style='padding:0px;'>字体颜色：<input id='fontcolorselect' type='text'></div>");
    ItemContent.append("<div class='TimePickerProperty' style='padding:0px;'>背景颜色：<input id='bgcolorselect' type='text'></div>");
    //20130228 nipiao 解决日期范围选择2，字体大小可以输入负数，手动输入可输入小于13问题，武汉bug（ZHZS-441）
    ItemContent.append("<div class='TimePickerProperty'>字体大小：<input type='number' min='12' max='20' id='fontsizenum' class='propetycontro ControlProNumberSty'/></div>");
    //ItemContent.append("<div class='TimePickerProperty' style='display: none;'>日历皮肤：<select id='CalendarSkinSelect'>" +
    //    "<option value='1'>亮蓝色系</option>" +
    //    "<option  value='2' selected>蓝色系</option>" +
    //    "<option  value='3'>绿色系</option>" +
    //    "<option  value='4'>紫色系</option>" +
    //    "<option  value='5'>红色系</option>" +
    //    "</select></div>");
//    ItemContent.append("<div  class='TimePickerProperty'>开始日期：<input type='text' id='begindate'readonly></div>");
//    ItemContent.append("<div  class='TimePickerProperty'>结束日期：<input type='text' id='enddate' readonly></div>");
//    ItemContent.append("<div class='TimePickerProperty'><input type='button' value='应用更改' id='propertychange' class='btnclass'></div>");
//    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    var getProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");
    if (getProperty.fontColor == "") { getProperty.fontColor = "Default"; }
    if (getProperty.bgColor == "") { getProperty.bgColor = "Default"; }
    $("#fontcolorselect").val(getProperty.fontColor);
    $("#bgcolorselect").val(getProperty.bgColor);
    $("#fontsizenum").val(getProperty.fontSize);
   // $("#CalendarSkinSelect").val(getProperty.CalendarSkinValue);
    $("#begindate").val(getProperty.BeginDate);
    $("#enddate").val(getProperty.EndDate) ;
    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
//                var itemtitle=_item.Title;
//                if(_item.DisabledValue==0){
//                    itemtitle+="禁用";
//                }else{
//                    itemtitle+="启用";
//                }
////                alert(itemtitle);
    }

    //应用属性
    $("#fontcolorselect").spectrum({
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
            $("#fontcolorselect").val(color.toHexString());
            $("#" + mid).find('input').css("color", $("#fontcolorselect").val());
            SaveAllProperty();
        }
    });
    $("#bgcolorselect").spectrum({
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
            $("#bgcolorselect").val(color.toHexString());
            $("#" + mid).find('input').css("background-color", $("#bgcolorselect").val());
            SaveAllProperty();
        }
    });
    $("#fontsizenum").change(function () {
        if ($("#fontsizenum").val() > 20) {
            $("#fontsizenum").val('20');
            AgiCommonDialogBox.Alert('所选字体大小不能超过20像素！',null);
        }
        $("#" + mid).find('input').css("font-size", $("#fontsizenum").val() + "px");
        SaveAllProperty();
    });
    //控件皮肤更换
    var selectVal;
    //$("#CalendarSkinSelect").change(function(){
    //    selectVal=$("#CalendarSkinSelect").val();
    //  //  var colObj =  $("#" + timePick.shell.ID).find('#widgetCalendar'+timePick.shell.ID);       //find('.widgetCalendar')
    //    var colObj =  $("#" + timePick.shell.ID).find('.widgetCalendar');
    //    switch(selectVal){
    //        case "1" :
    //            colObj.css({"background":"-webkit-gradient(linear, 0 0, 0 bottom, from(#0000FF), to(rgba(0, 0, 255, 0.5)))"});
    //            break;
    //        case "2":
    //            colObj.css({"background":"-webkit-gradient(linear, 0 0, 0 bottom, from(#2F93D9), to(#236DA1))"});
    //            break;
    //        case "3":
    //            colObj.css({"background":"-webkit-gradient(linear, 0 0, 0 bottom, from(#C0D9D9), to(#32CD99))"});
    //            break;
    //        case "4":
    //            colObj.css({"background":"-webkit-gradient(linear, 0 0, 0 bottom, from(#D8BFD8), to(#4F2F4F))"});
    //            break;
    //        case "5":
    //            colObj.css({"background":"-webkit-gradient(linear, 0 0, 0 bottom, from(#FF2400), to(#FF7F00))"});
    //            break;
    //    }
    //    SaveAllProperty();
    //});
      //获得多日历控件的起止时间
    var beginDate;
    var endDate;
    var selectDate;
    $("#propertychange").live('click', function () {
  //  $("#" + timePick.shell.BasicID).find('#widgetFieldID').live('change',function(){ //input文本改变事件
       var dateVal=$("#" + timePick.shell.BasicID).find('#widgetFieldID').val();
        selectDate =  dateVal;
        beginDate=dateVal.substring(0,10);
        endDate=dateVal.substring(11,21);
       // alert(endDate);
       $("#begindate").val(beginDate);
       $("#enddate").val(endDate) ;
        SaveAllProperty();
    });
    function SaveAllProperty() {
        getProperty = {
            fontColor: $("#fontcolorselect").val(),
            bgColor: $("#bgcolorselect").val(),
            fontSize: $("#fontsizenum").val() ,
            CalendarSkinValue: selectVal ,
            BeginDate:beginDate,
            EndDate:endDate ,
            SelectDate:selectDate
        }
        Agi.Edit.workspace.currentControls[0].Set('BasicProperty', getProperty);
    }
}
