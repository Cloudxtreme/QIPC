/**
 * Created with JetBrains WebStorm.
 * User: wangwei
 * Date: 12-11-15
 * Time: 上午3:00
 * To change this template use File | Settings | File Templates.
 * * TimeSelector 时间选择器
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.TimeSelector = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
                throw 'TimeSelector.RemoveEntity Arg is null';
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
            /* var entity  = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity",entity);*/
            //alert("此控件不支持加载实体");
            AgiCommonDialogBox.Alert("此控件不支持加载实体！", null);
        },
        ReadRealData: function (_Entity) {
        },
        AddEntity: function (_entity) {/*添加实体*/
            //alert("此控件不支持加载实体");
            AgiCommonDialogBox.Alert("此控件不支持加载实体！", null);
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("inputColor", "#000000");
            this.Set("inputSize", "14");
            this.Set("inputbgColor", "#eeeeee");
            this.Set("titlebgColor", "#000000");
            this.Set("titleColor", "#eee");
            this.Set("selectColor", "#eee");
            this.Set("selectbgColor", "#17384d");
            this.Set("selectInmonth", "#000000");
            this.Set("selectNotInmonth", "#b4b4b4");
            this.Set("ControlType", "TimeSelector");
            this.Set("skinValue", "-webkit-gradient(linear,left bottom,left top,color-stop(0,#ffffff),color-stop(100, #f9f9f9))");
            var ID = savedId ? savedId : "TimeSelector" + Agi.Script.CreateControlGUID();
            //var HTMLElementPanel=$("<div id='Panel_"+ID+"' class='PanelSty selectPanelSty'><div id='head_"+ID+"' class='selectPanelheadSty'></div></div>");
            //var HTMLElementPanel=$("<div recivedata='true' id='Panel_"+ID+"' class='PanelSty selectPanelSty' style='padding-bottom: 15px;'></div>");
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom: 15px;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 200,
                height: 25,
                divPanel: HTMLElementPanel
                // enableFrame:true; 显示蓝条
            });
            //隐藏头
            // this.shell.Title.hide();

            var myDate = new Date();
            var month = myDate.getMonth() + 1;
            if (parseInt(month) < 10) { month = "0" + month; }
            var day= myDate.getDate();
            if (parseInt(day) < 10) { day = "0" + day; }
            var nowDay = myDate.getFullYear() + "-" + month + "-" + day;
            var dfy = myDate.getDate() - 4;
            var oldDay = myDate.getFullYear() + "-" + month + "-" + dfy;
            var showDay = nowDay + "至" + nowDay;


            //Agi.Controls.myFunction = initLayout;
            var selector_mywidgetCalendar = "selector_widgetCalendar" + ID;
            var myTimePickID = "selector_aid" + ID;
            var mywidgetFieldID = "selector_Field" + ID;
            var BaseControlObj = $('<div id="' + ID + '" class="selector_navbar">' +
            // '<div id="widgetField"> '+
            // '<span>2012-08-01至2012-10-31</span> '+
                            '<input type="text" class="selector_widgetFieldClass" id="' + mywidgetFieldID + '" style=" height:24px; width:100%; padding-left: 1px; padding-top: 1px; padding-bottom: 1px; padding-right: 0px;" readonly value="' + showDay + '">' +
            // '<label style=" width:100%; padding-left: 0px; padding-right: 0px;"></label>'+
                           ' <a href="#" id="' + myTimePickID + '" name="ABCTine" class="selector_DropDownDatePick">Select date range</a>' +  // onclick="Agi.Controls.objFunction()"
                        '<input type="hidden" name="field＿name" value="1" id="hidden_id"> </div>' +
            // '<div class="widgetCalendar" id="'+mywidgetCalendar+'"></div>'+   Agi.Controls.objFunction('+this.id+')
                '</div>');
            //HTMLElementwidgetCalendar.append(BaseControlObj);
            // Agi.Controls.DropDownDatePicker(this);
            var pickerHtml = $('<div class="selector_widgetCalendar" id="' + selector_mywidgetCalendar + '"></div>');
            $('#' + selector_mywidgetCalendar).live('dblclick', function (ev) {
                return false;
            });

            pickerHtml.appendTo(HTMLElementPanel);

            //手势滑动效果
            /* var hammer = new Hammer($("#"+mywidgetCalendar));
            hammer.ondragstart = function(ev) {
            alert(ev);
            };
            hammer.ondrag = function(ev) {
            alert("ev");
            };
            hammer.ondragend = function(ev) {
            alert("ev");

            };

            hammer.ontap = function(ev) {
            alert("ev");
            };
            hammer.ondoubletap = function(ev) {
            alert("ev");
            };
            hammer.onhold = function(ev) {
            alert("ev");
            };

            hammer.ontransformstart = function(ev) {
            alert("ev");
            };
            hammer.ontransform = function(ev) {
            alert("ev");
            };
            hammer.ontransformend = function(ev) {
            alert("ev");
            };*/

            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            //20130509 倪飘 解决bug，日期范围选择1控件中，字体颜色、背景颜色、当月文字颜色、字体大小的初始值与控件高级属性设置中的初始值不一致
            var BasicProperty = {
                fontColor: "#000000",
                fontSize: 14,
                bgColor: "#eeeeee",
                titleColor: "#eeeeee",
                titlebgColor: "#000000",
                selectedbgColor: "#17384d",
                selectedColor: "#eee",
                selectInmonth: "#000000",
                selectNotInmonth: "#b4b4b4",
                CalendarSkinValue: "1",
                skinValue: "",
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
                HTMLElementPanel.width(200);
                HTMLElementPanel.height(25);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectorAutoFill_PanelSty");
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
            $("#" + myTimePickID).click(function (ev) {
                //alert(self.shell.ID);
                var varWidgetCalendar = selector_mywidgetCalendar.substring(24, selector_mywidgetCalendar.length);
                var varFieldID = mywidgetFieldID.substring(15, mywidgetFieldID.length);
                var varAid = myTimePickID.substring(13, myTimePickID.length);
                //self.shell.ID = "Panel_T"+varAid;
                //设置控制面板的输出
                var dateArray = $("#" + mywidgetFieldID).val().split("至");
                $('#input1').val(dateArray[0]);
                $('#input2').val(dateArray[1]);
                var now3 = new Date(dateArray[0]);
                var now4 = new Date(dateArray[1]);
                if (varAid != varWidgetCalendar && varAid != varFieldID) {
                    var selector_myCalendar = selector_mywidgetCalendar.substring(0, 24) + varAid;
                    var myFieldID = mywidgetFieldID.substring(0, 15) + varAid;
                    if (state) {
                        // alert("#"+self.shell.ID+"==="+selector_mywidgetCalendar+"==="+selector_myCalendar);
                        $("#" + selector_myCalendar).stop().animate({ height: 0 }, 500);
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").css("border", "none");
                    } else {
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").css("border", "1px solid #9f9f9f");
                        $('#date').SelectorDatePicker({
                            flat: true,
                            date: '2008-07-31',
                            current: '2008-07-31',
                            calendars: 1,
                            starts: 1,
                            view: 'years'
                        }, selector_myCalendar);
                        $("#" + selector_myCalendar).SelectorDatePicker({
                            flat: true,
                            // format: 'd B, Y',
                            format: 'Y-m-d',
                            date: [new Date(now3), new Date(now4)],
                            calendars: 3,
                            mode: 'range',
                            current: now3,
                            starts: 1,
                            onChange: function (formated) {
                                $("#" + self.shell.ID).find(".selector_datepickerSelected").css("background-color", self.Get("selectbgColor"));
                                $("#" + self.shell.ID).find(".selector_datepickerDays").find("a").css("color", self.Get("selectInmonth"));
                                $("#" + self.shell.ID).find(".selector_datepickerSelected").find("a").css("color", self.Get("selectColor"));
                                $("#" + self.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", self.Get("selectNotInmonth"));
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
                        }, selector_myCalendar);
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").find("#title").css("background-color", self.Get("titlebgColor"));
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").find("#title").find("a").css("color", self.Get("titleColor"));
                        $("#" + self.shell.ID).find(".selector_datepickerSelected").css("background-color", self.Get("selectbgColor"));
                        $("#" + self.shell.ID).find(".selector_datepickerDays").find("a").css("color", self.Get("selectInmonth"));
                        $("#" + self.shell.ID).find(".selector_datepickerSelected").find("a").css("color", self.Get("selectColor"));
                        $("#" + self.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", self.Get("selectNotInmonth"));
                        $("#" + self.shell.ID).find('.selector_widgetCalendar').css("background", self.Get("skinValue"));
                        $("#" + selector_myCalendar).stop().animate({ height: $("#" + selector_myCalendar).find('div.selector_datepicker').get(0).offsetHeight }, 500);
                    }
                    state = !state;
                    return false;
                } else {
                    if (state) {
                        $("#" + selector_mywidgetCalendar).stop().animate({ height: 0 }, 500);
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").css("border", "none");
                    } else {
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").css("border", "1px solid #9f9f9f");
                        $("#" + self.shell.ID).find('#date').SelectorDatePicker({
                            flat: true,
                            date: '2008-07-31',
                            current: '2008-07-31',
                            calendars: 1,
                            starts: 1,
                            view: 'years'
                        }, selector_mywidgetCalendar);
                        // $("#widgetCalendar").DatePicker({
                        var temp=1; // 2014-02-17 coke  临时参数作为参数计算点击第二次触发参数联动标记
                        $("#" + selector_mywidgetCalendar).SelectorDatePicker({
                            flat: true,
                            // format: 'd B, Y',
                            format: 'Y-m-d',
                            date: [new Date(now3), new Date(now4)],
                            current: now3,
                            calendars: 3,
                            mode: 'range',
                            starts: 1,
                            onChange: function (formated) {
                                $("#" + self.shell.ID).find(".selector_datepickerSelected").css("background-color", self.Get("selectbgColor"));
                                $("#" + self.shell.ID).find(".selector_datepickerDays").find("a").css("color", self.Get("selectInmonth"));
                                $("#" + self.shell.ID).find(".selector_datepickerSelected").find("a").css("color", self.Get("selectColor"));
                                $("#" + self.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", self.Get("selectNotInmonth"));
                                $("#" + self.shell.ID).find('#' + mywidgetFieldID).val(formated.join('至'));
                                var timeval = $("#" + self.shell.ID).find('#' + mywidgetFieldID).val(); //输出参数改变
                                if (timeval) {
                                    var beginDate = timeval.substring(0, 10);
                                    var endDate = timeval.substring(11, 21);

                                   if (beginDate != endDate) {
                                        _OutPramats = { "BeginTime": beginDate, "EndTime": endDate }
                                        self.Set("OutPramats", _OutPramats);
                                    }else if(beginDate==endDate&&temp==2)
                                   {
                                       //  2014-02-17  coke 日期范围控件支持两个时间选择同一天
                                       _OutPramats = {"BeginTime":beginDate,"EndTime":endDate}
                                       self.Set("OutPramats",_OutPramats);
                                       temp=1;
                                   }else if(beginDate==endDate&&temp!=2)
                                   {
                                       temp++;
                                   }
                                }

                            }
                        }, selector_mywidgetCalendar);
                        // $('#widgetCalendar').stop().animate({height: state ? 0 : $('#widgetCalendar div.datepicker').get(0).offsetHeight}, 500);   colid
                        //var title = $("#" + selector_myCalendar).find('td>table thead').find("#title");
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").find("#title").css("background-color", self.Get("titlebgColor"));
                        $("#" + self.shell.ID).find(".selector_widgetCalendar").find("#title").find("a").css("color", self.Get("titleColor"));
                        $("#" + self.shell.ID).find(".selector_datepickerSelected").css("background-color", self.Get("selectbgColor"));
                        $("#" + self.shell.ID).find(".selector_datepickerDays").find("a").css("color", self.Get("selectInmonth"));
                        $("#" + self.shell.ID).find(".selector_datepickerSelected").find("a").css("color", self.Get("selectColor"));
                        $("#" + self.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", self.Get("selectNotInmonth"));
                        $("#" + self.shell.ID).find('.selector_widgetCalendar').css("background", self.Get("skinValue"));
                        $("#" + selector_mywidgetCalendar).stop().animate({ height: $("#" + selector_mywidgetCalendar).find('div.selector_datepicker').get(0).offsetHeight }, 500);
                    }
                    state = !state;
                    return false;
                }
            });
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
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            this.Set("Position", PostionValue);
            //输出参数

            //  Agi.Edit.workspace.addParameter(ID + ".SelValue", 0);
            obj = ThisProPerty = PagePars = PostionValue = null;
            var basicproperty = self.Get("BasicProperty");
            var OutPramats;

            if (basicproperty.SelectDate == "") {
                OutPramats = { "BeginTime": nowDay, "EndTime": nowDay };
            } else {
                OutPramats = { "BeginTime": basicproperty.BeginDate, "EndTime": basicproperty.EndDate };
            }
//            this.Set("OutPramats", OutPramats); /*输出参数名称集合*/

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
//            HTMLElementPanel.resizable({
//                minHeight: 25,
//                minWidth: 200,
//                maxHeight: 25
//            });
            //主题名称
            this.Set("ThemeName", null);

            //20130515 倪飘 解决bug，组态环境中拖入日期范围选择1控件以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.TimeSelectorProrityInit(this);
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
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = this.shell.Container.parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewTimeSelector = new Agi.Controls.TimeSelector();
//                NewTimeSelector.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewTimeSelector;
//            }
//        },
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
            //$('#'+this.shell.BasicID).find('.dropdown:eq(0)')
        },
        Refresh: function () {
            var ThisHTMLElement = $(this.Get("HTMLElement"));
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
            this.shell.Container.width(200);
        },
        BackOldSize: function () { //从属性面板返回，人控制最小宽高
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight: 25,
                    minWidth: 200,
                    maxHeight: 25
                });
            }
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.TimeSelectorAttributeChange(this, Key, _Value);
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
            var TimeSelectorControl = {
                Control: {
                    ControlType: this.Get("ControlType"), //控件类型
                    ControlID: ProPerty.ID, //控件属性
                    ControlBaseObj: ProPerty.BasciObj[0].id, //控件对象
                    HTMLElement: ProPerty.BasciObj[0].id, //控件外壳ID
                    Entity: this.Get("Entity"), //控件实体
                    BasicProperty: this.Get("BasicProperty"), //控件基本属性
                    Position: this.Get("Position"), //控件位置
                    ChangeTime: $(this.Get('HTMLElement')).find('.selector_widgetFieldClass').val(), //显示在文本框里的时间
                    ThemeInfo: this.Get("ThemeInfo"),
                    //TimePickerThemeName:this.Get("ThemeName")
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
            return TimeSelectorControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;

                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;


                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);

                    var OutPramats=null;
                    if (BasicProperty.SelectDate!=null &&BasicProperty.SelectDate!= "") {
                        OutPramats = { "BeginTime": BasicProperty.BeginDate, "EndTime": BasicProperty.EndDate };
                    } else {
                        var myDate = new Date();
                        var month = myDate.getMonth() + 1;
                        var nowDay = myDate.getFullYear() + "-" + month + "-" + myDate.getDate();
                        OutPramats = { "BeginTime": nowDay, "EndTime": nowDay };
                    }
                    this.Set("OutPramats", OutPramats); /*输出参数名称集合*/

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);
                    $("#" + ThisProPerty.ID).css("z-index", _Config.ZIndex);
                    $("#" + ThisProPerty.ID).find('input').css("color", BasicProperty.fontColor);
                    $("#" + ThisProPerty.ID).find('input').css("font-size", BasicProperty.fontSize + "px");
                    $("#" + ThisProPerty.ID).find('input').css("background-color", BasicProperty.bgColor);
                    if (BasicProperty.titlebgColor != "") {
                        this.Set("titlebgColor", BasicProperty.titlebgColor);
                    }
                    if (BasicProperty.titleColor != "") {
                        this.Set("titleColor", BasicProperty.titleColor);
                    }
                    if (BasicProperty.selectedColor != "") {
                        this.Set("selectColor", BasicProperty.selectedColor);
                    }
                    if (BasicProperty.fontSize != "") {
                        this.Set("inputSize", BasicProperty.fontSize);
                    }
                    if (BasicProperty.selectedbgColor != "") {
                        this.Set("selectbgColor", BasicProperty.selectedbgColor);
                    }
                    if (BasicProperty.selectInmonth != "") {
                        this.Set("selectInmonth", BasicProperty.selectInmonth);
                    }
                    if (BasicProperty.selectNotInmonth != "") {
                        this.Set("selectNotInmonth", BasicProperty.selectNotInmonth);
                    }
                    if (BasicProperty.skinValue != "") {
                        this.Set("skinValue", '-webkit-gradient(linear,0% 0%, 0% 100%,from(#ffffff),to( #f9f9f9))');
                    }
                    $("#" + this.shell.ID).find(".selector_widgetCalendar").find("#title").css("background-color", this.Get("titlebgColor"));
                    $("#" + this.shell.ID).find(".selector_widgetCalendar").find("#title").find("a").css("color", this.Get("titleColor"));
                    $("#" + this.shell.ID).find(".selector_datepickerSelected").css("background-color", this.Get("selectbgColor"));
                    $("#" + this.shell.ID).find(".selector_datepickerDays").find("a").css("color", this.Get("selectInmonth"));
                    $("#" + this.shell.ID).find(".selector_datepickerSelected").find("a").css("color", this.Get("selectColor"));
                    $("#" + this.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", this.Get("selectNotInmonth"));
                    $("#" + this.shell.ID).find('.selector_widgetCalendar').css("background", this.Get("skinValue"));
                    //var selectVal=BasicProperty.CalendarSkinValue;
                    // var colObj = $(this.Get('HTMLElement')).find('#widgetCalendar');        mywidgetCalendar    widgetCalendar
                    // var colObj = $(this.Get('HTMLElement')).find('#widgetCalendar'+ThisProPerty.ID);
                    if (_Config.ChangeTime != "") {
                        $(this.Get('HTMLElement')).find('.selector_widgetFieldClass').val(_Config.ChangeTime);
                    }
                    var colObj = $(this.Get('HTMLElement')).find('.selector_widgetCalendar');
                    colObj.css("background", BasicProperty.skinValue);
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
            var TimeSelectorStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //2.保存主题
            Me.Set("ThemeName", _themeName);

            //3.应用当前控件的信息
            Agi.Controls.TimeSelector.OptionsAppSty(TimeSelectorStyleValue, Me);
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
Agi.Controls.TimeSelector.OptionsAppSty=function(_StyConfig,_TimeSelector){
    if(_StyConfig !=null){

        var min =  _TimeSelector.shell.BasicID;
        $("#" +min).find('input').css("color", _StyConfig.fontColor);
        $("#" +min).find('input').css("font-size", _StyConfig.fontSize + "px");
        $("#" +min).find('input').css("background-color", _StyConfig.bgColor);
        var title = $("#" + _TimeSelector.shell.ID).find('td>table thead').find("#title");
        title.css("background-color",_StyConfig.titlebgColor);
        title.find("a").css("color",_StyConfig.titleColor);
        $("#" + _TimeSelector.shell.ID).find(".selector_datepickerSelected").css("background-color",_StyConfig.selectedbgColor);
        $("#" + _TimeSelector.shell.ID).find(".selector_datepickerSelected").find("a").css("color",_StyConfig.selectedColor);
        $("#" + _TimeSelector.shell.ID).find(".selector_datepickerDays").find("a").css("color",_StyConfig.selectInmonth);
        $("#" + _TimeSelector.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color",_StyConfig.selectNotInmonth);
        var colObj =  $("#" + _TimeSelector.shell.ID).find('.selector_widgetCalendar');
        colObj.css("background","none");
        colObj.css("background",_StyConfig.skinValue);

        _TimeSelector.Set("inputColor",_StyConfig.fontColor);
        _TimeSelector.Set("inputSize",_StyConfig.fontSize);
        _TimeSelector.Set("inputbgColor",_StyConfig.bgColor);
        _TimeSelector.Set("titlebgColor",_StyConfig.titlebgColor);
        _TimeSelector.Set("titleColor",_StyConfig.titleColor);
        _TimeSelector.Set("selectColor",_StyConfig.selectedColor);
        _TimeSelector.Set("selectbgColor",_StyConfig.selectedbgColor);
        _TimeSelector.Set("selectInmonth",_StyConfig.selectInmonth);
        _TimeSelector.Set("selectNotInmonth",_StyConfig.selectNotInmonth);
        _TimeSelector.Set("skinValue",_StyConfig.skinValue);

        SaveAllProperty();

    }
    function SaveAllProperty() {
        getProperty = {
            fontColor: _TimeSelector.Get("inputColor"),
            bgColor: _TimeSelector.Get("inputbgColor"),
            fontSize: _TimeSelector.Get("inputSize"),
            titlebgColor:_TimeSelector.Get("titlebgColor"),
            titleColor:_TimeSelector.Get("titleColor"),
            selectedColor:_TimeSelector.Get("selectColor"),
            selectedbgColor:_TimeSelector.Get("selectbgColor"),
            selectInmonth:_TimeSelector.Get("selectInmonth"),
            selectNotInmonth:_TimeSelector.Get("selectNotInmonth"),
            skinValue:_TimeSelector.Get("skinValue")
        }
        Agi.Edit.workspace.currentControls[0].Set('BasicProperty', getProperty);
    }
}
/*多日历控件参数更改处理方法*/
Agi.Controls.TimeSelectorAttributeChange=function(_ControlObj,Key,_Value){
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
        {
            var entity = self.Get('Entity');
            if (entity && entity.length) {
                BindDataByEntity(self, entity[0]);
            }
        } break;
        case "OutPramats"://用户选择了一个项目
        {
            if(_Value!=0){
                //var ThisControlPrority=_ControlObj.Get("ProPerty");
                var ThisOutPars=[];
                if(_Value!=null){
                  var ControlProtity=_ControlObj.Get("BasicProperty");
                    ControlProtity.SelectDate=_Value.BeginTime+"至"+_Value.EndTime;
                    ControlProtity.BeginDate=_Value.BeginTime;
                    ControlProtity.EndDate=_Value.EndTime;
                    _ControlObj.Set("BasicProperty",ControlProtity);

                    for(var item in _Value){
                        ThisOutPars.push({Name:item,Value:Agi.Controls.TimeSelector.OutPutValueFormat(ControlProtity.OutParsFormat,_Value[item])});
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
Agi.Controls.TimeSelectorParsChange=function(_DropDownListID,_ParsName,_ParsValue){
    var ThisControl=Agi.Controls.FindControl(_DropDownListID);/*查找到相应的控件*/
    if(ThisControl){
        ThisControl.Set(_ParsName,_ParsValue);
    }
}

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitTimeSelector =function(){
    return new Agi.Controls.TimeSelector();
}

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.TimeSelectorProrityInit=function(dropDownControl){
    timeSelector=dropDownControl;
    var mid = timeSelector.shell.BasicID;
    var ThisProItems = [];
    var ItemContent = new Agi.Script.StringBuilder();
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();

    ItemContent.append("<div class='TimeSelectorProperty'>");
    ItemContent.append("<table class='prortitySelectorTable' border='0' cellspacing='1' cellpadding='0'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>字体颜色:</td><td class='prortitySelectorTabletd1'><input id='selector_fontcolorselect' type='text'></td>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>背景颜色:</td><td class='prortitySelectorTabletd1'><input id='selector_bgcolorselect' type='text'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>标题背景颜色:</td><td class='prortitySelectorTabletd1'><input id='selector_titlebgcolorselect' type='text'></td>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>标题文字颜色:</td><td class='prortitySelectorTabletd1'><input id='selector_titlecolorselect' type='text'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>当月文字颜色:</td><td class='prortitySelectorTabletd2'><input type='text' id='selector_inmonthdays' /></td>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>非当月文字颜色:</td><td class='prortitySelectorTabletd1'><input type='text' id='selector_notinmonthdays' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>选中日期底色:</td><td class='prortitySelectorTabletd2'><input id='selector_selectedbgcolor' type='text'></td>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>选中日期颜色:</td><td class='prortitySelectorTabletd2'><input id='selector_selectedcolor' type='text'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>字体大小:</td><td class='prortitySelectorTabletd2'><input type='number' min='12' max='15' id='selector_fontsizenum' class='propetycontro'/></td>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>日历皮肤:</td><td class='prortitySelectorTabletd1'><select id='CalendarSkinSelect' style='width: 80px'>" +
        "<option value='-webkit-gradient(linear,left bottom,left top,color-stop(0,#ffffff),color-stop(100, #f9f9f9))' selected='selected' >银色系</option>" +
/*        "<option  value='2' >蓝色系</option>" +
        "<option  value='3'>绿色系</option>" +
        "<option  value='4'>紫色系</option>" +
        "<option  value='5'>红色系</option>" +*/
        "</select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortitySelectorTabletd0'>参数输出格式：</td>");
    ItemContent.append("<td class='prortitySelectorTabletd1' colspan='3'><select id='TimeSelectorOutParSel' style='width:90%;'>" +
        "<option value='yyyy-MM-dd' selected='selected'>yyyy-MM-dd</option>" +
        "<option value='yyyy-MM-dd HH:mm:ss'>yyyy-MM-dd HH:mm:ss</option>" +
        "<option value='yyyy-MM-dd HH:mm'>yyyy-MM-dd HH:mm</option>" +
        "<option value='yyyy-MM-dd HH'>yyyy-MM-dd HH</option>" +
        "<option value='yyyy-MM'>yyyy-MM</option>" +
        "<option value='yyyy'>yyyy</option>" +
        "</select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    /*ItemContent.append("<div class='TimeSelectorProperty'>");
    ItemContent.append("<div class='TimeSelectorProperty' style='padding:0px;'>字体颜色：<input id='selector_fontcolorselect' type='text'>边框颜色：<input id='selector_bgcolorselect' type='text'></div>");
   // ItemContent.append("<div class='TimeSelectorProperty' style='padding:0px;'>背景颜色：<input id='selector_bgcolorselect' type='text'></div>");
    ItemContent.append("<div class='TimeSelectorProperty' style='padding:0px;'>标题颜色：<input id='selector_titlecolorselect' type='text'>标题背景：<input id='selector_titlebgcolorselect' type='text'></div>");
    //ItemContent.append("<div class='TimeSelectorProperty' style='padding:0px;'>选中颜色：<input id='selector_selectedbgcolor' type='text'></div>");
    ItemContent.append("<div class='TimeSelectorProperty' style='padding:0px;'>选中日期颜色：<input id='selector_selectedcolor' type='text'>选中日期底色：<input id='selector_selectedbgcolor' type='text'></div>");
    ItemContent.append("<div class='TimeSelectorProperty'>字体大小：<input type='number' min='13' max='20' id='selector_fontsizenum' class='propetycontro'/></div>");
    ItemContent.append("<div class='TimeSelectorProperty'>日历皮肤：<select id='CalendarSkinSelect'>" +
        "<option value='1'selected='selected' >灰色系</option>" +
        "<option  value='2' >蓝色系</option>" +
        "<option  value='3'>绿色系</option>" +
        "<option  value='4'>紫色系</option>" +
        "<option  value='5'>红色系</option>" +
        "</select></div>");*/
//    ItemContent.append("<div  class='TimeSelectorProperty'>开始日期：<input type='text' id='begindate'readonly></div>");
//    ItemContent.append("<div  class='TimeSelectorProperty'>结束日期：<input type='text' id='enddate' readonly></div>");
//    ItemContent.append("<div class='TimeSelectorProperty'><input type='button' value='应用更改' id='propertychange' class='btnclass'></div>");
//    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));
    var dateString = $("#" + timeSelector.shell.ID).find("#selector_Field"+(timeSelector.shell.ID).toString().substring(6)).val();
    var dateArray = dateString.split("至");
    var timeObj = new Agi.Script.StringBuilder();
    //1.圆角设置
    timeObj = null;
    timeObj = new Agi.Script.StringBuilder();
    timeObj.append("<div class='TimeSelectorProperty'>");
    timeObj.append("<table class='prortitySelectorTable' border='0' cellspacing='1' cellpadding='0'>");
    timeObj.append("<tr>");
    timeObj.append("<td class='prortitySelectorTabletd1' style='padding-left: 2px'>日期范围:" +
        "<select name='select1' id='range' >" +
        "<option selected='selected' id='op' value='1'>自定义</option>" +
        "<option value='2'  >今天</option>" +
        "<option value='3' >昨天</option>" +
        "<option value='4' >上周</option>" +
        "<option value='5' >上月</option>" +
        "</select></td></tr>");
      timeObj.append("<tr><td class='prortitySelectorTabletd1'style='padding-left: 2px'>"+"<fieldset id='fieldset1'><input  id='input1' type='text' size=12 maxlength='10' align='middle' value='"+dateArray[0]+"' class='myinput'/> - "+
        "<input id='input2' type='text' size=12  maxlength='10' align='middle' value='"+dateArray[1]+"'class='myinput'/></fieldset></td></tr></table></div>");
       /* var timeObj = $('<form id="testform" style="margin-top: 10px">' +
        '日期范围：' +
        '<select name="select1" style="width: 70px" id="range" onchange="">' +
        '<option selected="selected" id="op" value="1">自定义</option>' +
        '<option value="2"  >今天</option> ' +
        '<option value="3" >昨天</option>' +
        '<option value="4" >上周</option>' +
        '<option value="5" >上月</option>' +
        '</select><br/>' +
        '<fieldset id="fieldset1" style="margin-top: 10px">' +
        '<input  id="input1" type="text" size=10 maxlength="10" value="'+dateArray[0]+'" class="myinput" />-' +
        '<input id="input2" type="text"  size=10 maxlength="10" value="'+dateArray[1]+'" class="myinput" />' +
        '</fieldset>' +
        '</form>');*/
    $('.myinput').live('change',function(ev){
        var date1;
        var date2;
        var i1 = $('#input1').val();
        var i2 = $('#input2').val();
        var iArr1 = i1.split("-");
        var iArr2 = i2.split("-");
        var txt = new RegExp("[/\D/^-]");
        if(!(/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig.test(i1))||!(/((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig.test(i2))){
            AgiCommonDialogBox.Alert("日期输入错误！", null);
            return false;
        }/*else if(iArr1.length!=3||iArr2.length!=3||iArr1[1].valueOf()<1||iArr1[1].valueOf()>12||iArr1[2].valueOf()<1||iArr1[2].valueOf()>31||iArr2[1].valueOf()<1||iArr2[1].valueOf()>12||iArr2[2].valueOf()<1||iArr2[2].valueOf()>31){
            //alert("日期输入错误！");
            AgiCommonDialogBox.Alert("日期输入错误！", null);
            return false;
        }*/else if(i1>i2){
            //alert("起始时间不能大于终止时间！");
            AgiCommonDialogBox.Alert("起始时间不能大于终止时间！", null);
            return false;
        }
        date1 = new Date(i1);
        date2 = new Date(i2);
        pushDate(date1,date2);
        $("#" + timeSelector.shell.ID).find("#selector_Field"+(timeSelector.shell.ID).toString().substring(6)).val(i1+'至'+i2);
    });
    //20130523  倪飘 解决bug，日期范围选择控件，双击进入属性编辑页面，修改时间选择日期范围为今天，在修改为昨天，上周，上月，日期控件中的日期未发生变化，按F12页面报错
    $('#range').live('change',function(ev){
        var select = $("#range");
        var vfset = document.getElementById("fieldset1");  //$("#fieldset1");
        var date1;
        var date2;
        switch(select.val()){
            case '1':         //自定义
                vfset.style.display="";
                date1 = new Date($('#input1').val());
                date2 = new Date($('#input2').val());
                $("#hidden_id").val("1");
                break;
            case '2':        //今天
                vfset.style.display="none";
                date1 = date2 = new Date();
                $("#hidden_id").val("2");
                break;
            case '3':     //昨天
                vfset.style.display="none";
                var date = new Date();
                date.setDate(date.getDate() - 1);
                date1 = date2 = date;
                $("#hidden_id").val("3");
                break;
            case '4':    //上周
                vfset.style.display="none";
                var date = new Date();
                var xq = date.getDay();
                date.setDate(date.getDate() - xq);
                date2 = date;
                var d = new Date();
                d.setDate(d.getDate() - 6 - xq);
                date1 = d;
                $("#hidden_id").val("4");
                break;
            case '5':    //上月
                vfset.style.display="none";
                var now = new Date();
                var y = now.getFullYear();
                var m = now.getMonth();
                if(m == 0) {
                    y -= 1;
                    m = 12;
                }
                var d = 32 - new Date(y, m - 1, 32).getDate();
                date1 = new Date(y,m-1,1);
                date2 = new Date(y,m-1,d);
                $("#hidden_id").val("5");
                break;
        }
        $('#input1').val(formatDate(date1,'Y-m-d'));
        $('#input2').val(formatDate(date2,'Y-m-d'));
        $("#" + timeSelector.shell.ID).find("#selector_Field"+(timeSelector.shell.ID).toString().substring(6)).val($('#input1').val()+'至'+$('#input2').val());
        pushDate(date1,date2);
    });
    //格式化数据
    function formatDate(date, format) {
        var m = date.getMonth();
        var d = date.getDate();
        var y = date.getFullYear();
//        var wn = date.getWeekNumber();
        var w = date.getDay();
        var s = {};
        var hr = date.getHours();
        var pm = (hr >= 12);
        var ir = (pm) ? (hr - 12) : hr;
//        var dy = date.getDayOfYear();
        if (ir == 0) {
            ir = 12;
        }
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var parts = format.split(''), part;
        for ( var i = 0; i < parts.length; i++ ) {
            part = parts[i];
            switch (parts[i]) {
                case 'a':
                    part = date.getDayName();
                    break;
                case 'A':
                    part = date.getDayName(true);
                    break;
                case 'b':
                    part = date.getMonthName();
                    break;
                case 'B':
                    part = date.getMonthName(true);
                    break;
                case 'C':
                    part = 1 + Math.floor(y / 100);
                    break;
                case 'd':
                    part = (d < 10) ? ("0" + d) : d;
                    break;
                case 'e':
                    part = d;
                    break;
                case 'H':
                    part = (hr < 10) ? ("0" + hr) : hr;
                    break;
                case 'I':
                    part = (ir < 10) ? ("0" + ir) : ir;
                    break;
                case 'j':
//                    part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
                    break;
                case 'k':
                    part = hr;
                    break;
                case 'l':
                    part = ir;
                    break;
                case 'm':
                    part = (m < 9) ? ("0" + (1+m)) : (1+m);
                    break;
                case 'M':
                    part = (min < 10) ? ("0" + min) : min;
                    break;
                case 'p':
                case 'P':
                    part = pm ? "PM" : "AM";
                    break;
                case 's':
                    part = Math.floor(date.getTime() / 1000);
                    break;
                case 'S':
                    part = (sec < 10) ? ("0" + sec) : sec;
                    break;
                case 'u':
                    part = w + 1;
                    break;
                case 'w':
                    part = w;
                    break;
                case 'y':
                    part = ('' + y).substr(2, 2);
                    break;
                case 'Y':
                    part = y;
                    break;
            }
            parts[i] = part;
        }
        return parts.join('');
    }
    //选中date1-date2范围的数据
    function pushDate(date1,date2){
        $("#selector_widgetCalendar"+(timeSelector.shell.ID).toString().substring(6)).SelectorDatePickerFill({
            flat: true,
            // format: 'd B, Y',
            format:'Y-m-d',
            date: [date1, date2],
            calendars: 3,
            current:date1,
            mode: 'range',
            starts: 1,
            onChange: function(formated) {
                $("#" + timeSelector.shell.ID).find(".selector_datepickerSelected").css("background-color",timeSelector.Get("selectbgColor"));
                $("#" + timeSelector.shell.ID).find(".selector_datepickerDays").find("a").css("color",timeSelector.Get("selectInmonth"));
                $("#" + timeSelector.shell.ID).find(".selector_datepickerSelected").find("a").css("color",timeSelector.Get("selectColor"));
                $("#" + timeSelector.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", timeSelector.Get("selectNotInmonth"));
                $("#" + timeSelector.shell.ID).find("#selector_Field"+(timeSelector.shell.ID).toString().substring(6)).val(formated.join('至'));
                var timeval =  $("#" + timeSelector.shell.ID).find("#selector_Field"+(timeSelector.shell.ID).toString().substring(6)).val();//输出参数改变

                if(timeval){
                    var beginDate=timeval.substring(0,10);
                    var endDate=timeval.substring(11,21);
                    if(beginDate != endDate){
                        _OutPramats = {"BeginTime":beginDate,"EndTime":endDate}
                        timeSelector.Set("OutPramats",_OutPramats);

                    }
                }

            }
        },"selector_widgetCalendar"+(timeSelector.shell.ID).toString().substring(6));
        $("#" + timeSelector.shell.ID).find(".selector_widgetCalendar").find("#title").css("background-color",timeSelector.Get("titlebgColor"));
        $("#" + timeSelector.shell.ID).find(".selector_widgetCalendar").find("#title").find("a").css("color",timeSelector.Get("titleColor"));
        $("#" + timeSelector.shell.ID).find(".selector_datepickerSelected").css("background-color",timeSelector.Get("selectbgColor"));
        $("#" + timeSelector.shell.ID).find(".selector_datepickerDays").find("a").css("color",timeSelector.Get("selectInmonth"));
        $("#" + timeSelector.shell.ID).find(".selector_datepickerSelected").find("a").css("color",timeSelector.Get("selectColor"));
        $("#" + timeSelector.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", timeSelector.Get("selectNotInmonth"));
        $("#" + timeSelector.shell.ID).find('.selector_widgetCalendar').css("background",timeSelector.Get("skinValue"));
    }
    var myObj = $(timeObj.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "时间选择", DisabledValue: 1, ContentObj:myObj}));
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    var getProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");
    if (getProperty.fontColor == "") { getProperty.fontColor = "Default"; }
    if (getProperty.bgColor == "") { getProperty.bgColor = "Default"; }
    if (getProperty.titlebgColor==""){getProperty.titlebgColor=timeSelector.Get("titlebgColor");}
    if (getProperty.titleColor==""){getProperty.titleColor=timeSelector.Get("titleColor");}
    if (getProperty.selectInmonth ==""){getProperty.selectInmonth=timeSelector.Get("selectInmonth");}
    if (getProperty.selectNotInmonth==""){getProperty.selectNotInmonth=timeSelector.Get("selectNotInmonth");}
    if (getProperty.selectedbgColor==""){getProperty.selectedbgColor=timeSelector.Get("selectbgColor");}
    if (getProperty.selectedColor==""){getProperty.selectedColor=timeSelector.Get("selectColor");}
    if(getProperty.skinValue==""){getProperty.skinValue=timeSelector.Get("skinValue");}
    $("#selector_fontcolorselect").val(getProperty.fontColor);
    $("#selector_bgcolorselect").val(getProperty.bgColor);
    $("#selector_titlebgcolorselect").val(getProperty.titlebgColor);
    $("#selector_titlecolorselect").val(getProperty.titleColor);
    $("#selector_notinmonthdays").val(getProperty.selectNotInmonth);
    $("#selector_inmonthdays").val(getProperty.selectInmonth);
    $("#selector_selectedbgcolor").val(getProperty.selectedbgColor);
    $("#selector_selectedcolor").val(getProperty.selectedColor);
    $("#selector_fontsizenum").val(getProperty.fontSize);
    $("#CalendarSkinSelect").val(getProperty.CalendarSkinValue);
    $("#" + timeSelector.shell.ID).find('.selector_widgetCalendar').css("background",getProperty.skinValue);
    $("#range").val($("#hidden_id").val());
    if($("#range").val()!=1){
        var vfset = document.getElementById("fieldset1");  //$("#fieldset1");
        vfset.style.display = "none";
    }
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
    $("#selector_fontcolorselect").spectrum({
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
            $("#selector_fontcolorselect").val(color.toHexString());
            $("#" + mid).find('input').css("color", $("#selector_fontcolorselect").val());
            timeSelector.Set("inputColor",$("#selector_fontcolorselect").val());
            SaveAllProperty();
        }
    });
    $("#selector_titlecolorselect").spectrum({
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
            $("#selector_titlecolorselect").val(color.toHexString());
            $("#" + timeSelector.shell.ID).find(".selector_widgetCalendar").find("#title").find("a").css("color", $("#selector_titlecolorselect").val());
            timeSelector.Set("titleColor", color.toHexString());
            SaveAllProperty();
        }
    });
    //selector_inmonthdays当月颜色
    $("#selector_inmonthdays").spectrum({
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
            $("#selector_inmonthdays").val(color.toHexString());
            $("#" + timeSelector.shell.ID).find(".selector_datepickerDays").find("a").css("color", $("#selector_inmonthdays").val());
            $("#" + timeSelector.shell.ID).find(".selector_datepickerSelected").find("a").css("color", timeSelector.Get("selectColor"));
            $("#" + timeSelector.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", timeSelector.Get("selectNotInmonth"));
            timeSelector.Set("selectInmonth",color.toHexString());
            SaveAllProperty();
        }
    });
    //非当月颜色
    $("#selector_notinmonthdays").spectrum({
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
            $("#selector_notinmonthdays").val(color.toHexString());
            $("#" + timeSelector.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", $("#selector_notinmonthdays").val());
            timeSelector.Set("selectNotInmonth",color.toHexString());
            SaveAllProperty();
        }
    });
    $("#selector_selectedcolor").spectrum({
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
            $("#selector_selectedcolor").val(color.toHexString());
            $("#" + timeSelector.shell.ID).find(".selector_datepickerSelected").find("a").css("color", $("#selector_selectedcolor").val());
            $("#" + timeSelector.shell.ID).find(".selector_datepickerNotInMonth").find("a").css("color", timeSelector.Get("selectNotInmonth"));
            timeSelector.Set("selectColor",color.toHexString());
            SaveAllProperty();
        }
    });
    $("#selector_bgcolorselect").spectrum({
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
            $("#selector_bgcolorselect").val(color.toHexString());
            $("#" + mid).find('input').css("background-color", $("#selector_bgcolorselect").val());
            timeSelector.Set("inputbgColor",$("#selector_bgcolorselect").val());
            SaveAllProperty();
        }
    });
    $("#selector_titlebgcolorselect").spectrum({
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
            $("#selector_titlebgcolorselect").val(color.toHexString());
            $("#" + timeSelector.shell.ID).find(".selector_widgetCalendar").find("#title").css("background-color", $("#selector_titlebgcolorselect").val());
            timeSelector.Set("titlebgColor", color.toHexString());
            SaveAllProperty();
        }
    });

    $("#selector_selectedbgcolor").spectrum({
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
            $("#selector_selectedbgcolor").val(color.toHexString());
            $("#" + timeSelector.shell.ID).find(".selector_datepickerSelected").css("background-color", $("#selector_selectedbgcolor").val());
            timeSelector.Set("selectbgColor",color.toHexString());
            SaveAllProperty();
        }
    });
    $("#selector_fontsizenum").change(function () {
        var size =  $("#selector_fontsizenum").val();
        if(size>15){
            $("#selector_fontsizenum").val(15);
            //alert("最大值为15");
            AgiCommonDialogBox.Alert("请输入12~15范围内的值！", null);
        }
        if(size<12){
            $("#selector_fontsizenum").val(12);
            AgiCommonDialogBox.Alert("请输入12~15范围内的值！", null);
            //alert("最小值为12");
        }
        $("#" + mid).find('input').css("font-size", $("#selector_fontsizenum").val() + "px");
        timeSelector.Set("inputSize",$("#selector_fontsizenum").val());
        SaveAllProperty();
    });
    //控件皮肤更换
    var selectVal;
    $("#CalendarSkinSelect").change(function(){
        selectVal=$("#CalendarSkinSelect").val();
      //  var colObj =  $("#" + timeSelector.shell.ID).find('#widgetCalendar'+timeSelector.shell.ID);       //find('.widgetCalendar')
        var colObj =  $("#" + timeSelector.shell.ID).find('.selector_widgetCalendar');
        cobObj.css("background",selectVal);
        timeSelector.Set("skinValue",selectVal);
        SaveAllProperty();
    });
      //获得多日历控件的起止时间
    var beginDate;
    var endDate;
    var selectDate;
    $("#propertychange").live('click', function () {
       var dateVal=$("#" + timeSelector.shell.BasicID).find('#widgetFieldID').val();
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
            fontColor: timeSelector.Get("inputColor"),
            bgColor: timeSelector.Get("inputbgColor"),
            fontSize: timeSelector.Get("inputSize"),
            titlebgColor:timeSelector.Get("titlebgColor"),
            titleColor:timeSelector.Get("titleColor"),
            selectedColor:timeSelector.Get("selectColor"),
            selectedbgColor:timeSelector.Get("selectbgColor"),
            selectInmonth:timeSelector.Get("selectInmonth"),
            selectNotInmonth:timeSelector.Get("selectNotInmonth"),
            skinValue:timeSelector.Get("skinValue"),
            //CalendarSkinValue: selectVal ,
            BeginDate:beginDate,
            EndDate:endDate ,
            SelectDate:selectDate,
            OutParsFormat:timeSelector.Get("OutParsFormat")
        }
        timeSelector.Set('BasicProperty', getProperty);
    }

    //20131220 08:23 markeluo 新增 输出参数格式化
    $("#TimeSelectorOutParSel").unbind().bind("change",function(){
        timeSelector.Set("OutParsFormat",$(this).val());
        SaveAllProperty();
    });
    if(getProperty.OutParsFormat!=null && getProperty.OutParsFormat!=""){
        $("#TimeSelectorOutParSel").find("option[value='"+getProperty.OutParsFormat+"']").attr("selected","selected");
    }else{
        $("#TimeSelectorOutParSel").find("option[value='yyyy-MM-dd']").attr("selected","selected");
    }
}

//region 20131219 14：48 markeluo 修改&新增
//输出参数格式化
Agi.Controls.TimeSelector.OutPutValueFormat=function(_format,_value){
    if(_format!=null && _format!=""){}else{
        _format="yyyy-MM-dd";
    }
    var ReturnValue=_value;
    switch (_format){
        case "yyyy-MM-dd HH:mm:ss":
            ReturnValue=_value+" 00:00:00";
            break;
        case "yyyy-MM-dd HH:mm":
            ReturnValue=_value+" 00:00";
            break;
        case "yyyy-MM-dd HH":
            ReturnValue=_value+" 00";
            break;
        case "yyyy-MM":
            ReturnValue=_value.substr(0,7);
            break;
        case "yyyy":
            ReturnValue=_value.substr(0,4);
            break;
        case "yyyy-MM-dd":
            ReturnValue=_value;
            break;
        default :
            ReturnValue=_value;
            break;
    }
    return ReturnValue;
}
//endregion