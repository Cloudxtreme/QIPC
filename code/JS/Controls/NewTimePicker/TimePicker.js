/// <reference path="../../jquery-1.7.2.js" />

/*添加 Agi.Controls命名空间*/
Namespace.register("Agi.Controls");

Agi.Controls.TimePicker = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () { //获得实体数据

        },
        SetValue: function (_string) {
            /*
			var BasicProperty = this.Get("BasicProperty");
            var format = BasicProperty.formatStr;
            var sMark = format.substring(format.indexOf("Y") + 1, format.indexOf("Y") + 2); //控件日期格式
            var sStrMark = _string.substring(4, 5);
            if (sMark != sStrMark) {
                AgiCommonDialogBox.Alert("当前日期格式为：" + format + ",请重新输入！");
            }

            $("#" + this.shell.BasicID).val(_string);
            var ThisProPerty = this.Get('ProPerty');
            var value = {
                id: ThisProPerty.ID,
                val: _string
            };
            this.Set("SelValue", value);
			*/
        },
        Render: function (_Target) {
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }

            var ThisHTMLElement = self.shell.Container[0]; //self.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj);

				$("#" + self.shell.BasicID).datetimepicker({
					//showOn: "button",
					//buttonImage: "JS/Controls/NewTimePicker/css/images/icon_calendar.gif",
					//buttonImageOnly: true,
					showSecond: true,
					timeFormat: 'hh:mm:ss',
					stepHour: 1,
					stepMinute: 1,
					stepSecond: 1
				});
                //保存初始值
                var basicproperty = self.Get("BasicProperty");
                if (basicproperty.selectedDate == "") {
                    //20130517 倪飘 解决bug，组态环境中拖入单日期控件后，控件中显示日期的格式与选择日期以后控件中显示日期的格式不一致
                    var myDate = new Date();
                    var month = myDate.getMonth() + 1;
                    if (parseInt(month) < 10) {
                        month = "0" + month
                    }
                    var day = myDate.getDate();
                    if (parseInt(day) < 10) {
                        day = "0" + day
                    }
					var hours=myDate.getHours();
					if (parseInt(hours) < 10) {
						hours = "0" + hours
					}
					var minutes=myDate.getMinutes();
					if (parseInt(minutes) < 10) {
						mius = "0" + minutes
					}
					var seconds=myDate.getSeconds();
					if (parseInt(seconds) < 10) {
						secons = "0" + seconds
					}
                    var nowDay = myDate.getFullYear() + "-" + month + "-" + day+" "+hours+":"+minutes+":"+seconds;
                    $("#" + self.shell.BasicID).val(nowDay);

                    basicproperty.selectedDate = nowDay;
                    self.Set("BasicProperty", basicproperty);

					
                }
                else {
                    $("#" + self.shell.BasicID).val(basicproperty.selectedDate);
                }

            }
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }
        },
       
        ReadData: function (et) {
            AgiCommonDialogBox.Alert("此控件不支持加载实体！");
            return;
        },
			//控件的值改变事件
        TimePickerValueGet: function (ChangeValue) {
			var self=this;
			var BasicProperty=self.Get('BasicProperty');
			BasicProperty.selectedDate=ChangeValue;
			var value = {
                            id: self.shell.BasicID,
                            val: ChangeValue
                        };
                        self.Set("SelValue", value);
			self.Set('BasicProperty',BasicProperty);
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "TimePicker");

            var ID = savedId ? savedId : "TimePicker" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom:10px;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 140,
                height: 20,
                divPanel: HTMLElementPanel
                //                enableFrame:true
            });
            //解决bug，组态环境中单日期控件的高度可以通过右下角属性设置面板进行设置
            var BaseControlObj = $('<input id="' + ID + '" readonly="readonly" class="ui_timepicker" style=" width:100%;font-size:12px;height:100%;cursor: pointer;">');
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            //20130115 倪飘 解决控件默认背景颜色与控件属性设置中默认背景颜色选择框中的不一致问题
            var BasicProperty = {
                selectedDate: "",
                fontColor: "#000",
                fontSize: 12,
				backgroundColor:"#fff",
				borderWidth:1,
				borderColor:"#ACA8A8",
				borderRadius:0,
				txtIndent:0,
                OutParsFormat:"yyyy-MM-dd HH:mm:ss"
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

            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(140);
                HTMLElementPanel.height(20);
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
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
                $("#ui-datepicker-div").css("z-index", "9999");
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    Agi.Controls.ControlEdit(self); //控件编辑界面
                    $("#ui-datepicker-div").hide();
                }
                $("#ui-datepicker-div").hide();
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
                    if (parseInt(month) < 10) {
                        month = "0" + month
                    }
                    var day = myDate.getDate();
                    if (parseInt(day) < 10) {
                        day = "0" + day
                    }
					var hours=myDate.getHours();
					if (parseInt(hours) < 10) {
						hours = "0" + hours
					}
					var minutes=myDate.getMinutes();
					if (parseInt(minutes) < 10) {
						mius = "0" + minutes
					}
					var seconds=myDate.getSeconds();
					if (parseInt(seconds) < 10) {
						secons = "0" + seconds
					}
                    var nowDay = myDate.getFullYear() + "-" + month + "-" + day+" "+hours+":"+minutes+":"+seconds;


            Agi.Edit.workspace.addParameter(ID + ".SelValue", 0);
            obj = ThisProPerty = PagePars = PostionValue = null;

            var basicproperty = self.Get("BasicProperty");

            if (basicproperty.selectedDate == "") {
                Agi.Msg.PageOutPramats.AddPramats({
                    'Type': Agi.Msg.Enum.Controls,
                    'Key': ID,
                    'ChangeValue': [
                        { 'Name': 'CurrentValue', 'Value': nowDay }
                    ]
                });
            } else {
                Agi.Msg.PageOutPramats.AddPramats({
                    'Type': Agi.Msg.Enum.Controls,
                    'Key': ID,
                    'ChangeValue': [
                        { 'Name': 'CurrentValue', 'Value': basicproperty.selectedDate }
                    ]
                });
            }
            //缩小的最小宽高设置
            HTMLElementPanel.resizable({
                minHeight: 20,
                minWidth: 120,
                maxHeight: 25
            }).css("position", "absolute");
            //20130515 倪飘 解决bug，组态环境中拖入单日期选择控件以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);

        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.TimePickerProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            
            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = $(this.Get("HTMLElement")).parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewTimePicker = new Agi.Controls.TimePicker();
//                NewTimePicker.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewTimePicker;
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
            $(this.Get("HTMLElement")).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $(this.Get("HTMLElement")).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
        },
        EnterEditState: function (size) {
            var obj = $(this.Get('HTMLElement'));
            var self = this;
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            if (size) {
                obj.css({ "width": size.width, "height": size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
            //固定一个宽度,防止超出左边的容器
            this.shell.Container.css({ 'padding-right': '2px', 'width': 140 });
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight: 20,
                    minWidth: 120,
                    maxHeight: 25
                }).css("position", "absolute");
            }
            //刷新大小
            this.PostionChange(null);
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.TimePickerAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
        }, //更改样式
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            
            var TimePickerControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基础对象
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    BasicProperty: null, //控件基本属性
                    Position: null, //控件位置
                    ThemeInfo: null,
                    ZIndex: null
                }
            }
            TimePickerControl.Control.ControlType = this.Get("ControlType");
            TimePickerControl.Control.ControlID = ProPerty.ID;
            TimePickerControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            TimePickerControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            $(Entitys).each(function (i, e) {
                e.Data = null;
            });
            TimePickerControl.Control.Entity = Entitys;
            TimePickerControl.Control.BasicProperty = this.Get("BasicProperty");
            TimePickerControl.Control.Position = this.Get("Position");
            TimePickerControl.Control.ThemeInfo = this.Get("ThemeInfo");
            TimePickerControl.Control.ZIndex = $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index");
            return TimePickerControl.Control;
        }, //获得TimePicker控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;


                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);

                    var format;
                    var self = this;
                    $("#" + ThisProPerty.ID).val(BasicProperty.selectedDate);
                    var value = {
                        id: ThisProPerty.ID,
                        val: BasicProperty.selectedDate
                    }
                    this.Set("SelValue", value);

					$("#" + self.shell.BasicID).datetimepicker({
						showSecond: true,
						timeFormat: 'hh:mm:ss',
						stepHour: 1,
						stepMinute: 1,
						stepSecond: 1
					});
                    $("#" + ThisProPerty.ID).css("z-index", _Config.ZIndex);

                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height() };
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);


                    var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height: parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))
                    };

                    this.Set("Position", _Config.Position);

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                }
            }
        } //根据配置信息创建控件
    }, true);


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitTimePicker = function () {
    return new Agi.Controls.TimePicker();
}


/*日期选择控件参数更改处理方法*/
Agi.Controls.TimePickerAttributeChange = function (_ControlObj, Key, _Value) {
    switch (Key) {
        case "Position":
        {
            if (layoutManagement.property.type == 1) {
                var ThisHTMLElement = $(_ControlObj.Get("HTMLElement"));
                var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                PagePars = null;
            }
        }
            break;
        case "Entity": //实体
        {
            var entity = _ControlObj.Get('Entity');
            if (entity && entity.length) {
                BindDataByEntity(_ControlObj, entity[0]);
            }
        }
            break;
        case "SelValue":
        {
            var data = _ControlObj.Get('SelValue');
			var basicproperty = _ControlObj.Get("BasicProperty");
            Agi.Msg.PageOutPramats.PramatsChange({
                'Type':Agi.Msg.Enum.Controls,
                'Key':data.id,
                'ChangeValue':[
                    { 'Name':'CurrentValue', 'Value':Agi.Controls.TimePicker.OutPutValueFormat(basicproperty.OutParsFormat,data.val)}
                ]
            });
            Agi.Msg.TriggerManage.ParaChangeEvent({ "sender":_ControlObj, "Type":Agi.Msg.Enum.Controls });

        }
            break;
        case "BasicProperty":
        {

           var mid = _ControlObj.shell.BasicID;
            $("#" + mid).css("color",_Value.fontColor);
            $("#" + mid).css("font-size",_Value.fontSize+"px");
            $("#" + mid).css("background-color",_Value.backgroundColor);
                

            if(_Value.borderWidth>0){
                var sborderstyle=_Value.borderWidth+"px solid "+_Value.borderColor;
                $("#" + mid).css("border",sborderstyle);
            }else{
                $("#" + mid).css("border","0px solid "+_Value.borderColor);
            }
            $("#" + mid).css("border-radius",_Value.borderRadius+"px");
            $("#" + mid).css("text-indent",_Value.txtIndent+"px");
        }
            break;
    } 

}    

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.TimePickerProrityInit = function (TimePickerControl) {
    _TimePicker = TimePickerControl;
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='TimePickerPro_Panel'>");
    ItemContent.append("<table class='TimePickerPro_Tab_Panel'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>背景设置：</td>");
    ItemContent.append("<td class='TimePickerPro_tab_td1' colspan='3'><input id='TimePicker_BgColor' type='text' /></td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>边框宽度：</td>");
    //20130424 nipiao  解决bug，单日期选择控件修改了边框宽度为10 ，返回整体页面后，单日期选择控件不能移动
    ItemContent.append("<td class='TimePickerPro_tab_td1'><input type='number' min='0' max='3' defaultvalue='0' value='0' id='TimePicker_BorderWidth' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>边框颜色：</td>");
    ItemContent.append("<td class='TimePickerPro_tab_td1'><input type='text' id='TimePicker_BorderColor'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>字体大小：</td>");
    ItemContent.append("<td class='TimePickerPro_tab_td1'><input type='number' min='10' max='20' defaultvalue='10' value='10' id='TimePicker_FontSize' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>字体颜色：</td>");
    ItemContent.append("<td class='TimePickerPro_tab_td1'><input id='TimePicker_FontColor' type='text' /></td>");
	ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>圆角半径：</td>");
    ItemContent.append("<td class='TimePickerPro_tab_td1'><input type='number' min='0' max='10' defaultvalue='0' value='0' id='TimePicker_BorderRadius' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>文本缩进：</td>");
    ItemContent.append("<td class='TimePickerPro_tab_td1'><input type='number' min='0' max='30' defaultvalue='0' value='0' id='TimePicker_TxtIndent' class='ControlProNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='TimePickerPro_tab_td0'>参数输出格式：</td>");
    ItemContent.append("<td class='TimePickerPro_tab_td1' colspan='3'><select id='TimePicker_OutParSel' style='width:90%;'>" +
        "<option value='yyyy-MM-dd' selected='selected'>yyyy-MM-dd</option>" +
        "<option value='yyyy-MM-dd HH:mm:ss'>yyyy-MM-dd HH:mm:ss</option>" +
        "<option value='yyyy-MM-dd HH:mm'>yyyy-MM-dd HH:mm</option>" +
        "<option value='yyyy-MM-dd HH'>yyyy-MM-dd HH</option>" +
        "<option value='yyyy-MM'>yyyy-MM</option>" +
        "<option value='yyyy'>yyyy</option>" +
        "</select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
   
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    
	var getProperty=_TimePicker.Get('BasicProperty');

	$("#TimePicker_BgColor").val(getProperty.backgroundColor);
    $("#TimePicker_FontColor").val(getProperty.fontColor);
    $("#TimePicker_FontSize").val(getProperty.fontSize);
	$("#TimePicker_BorderWidth").val(getProperty.borderWidth);
    $("#TimePicker_BorderColor").val(getProperty.borderColor);
    $("#TimePicker_BorderRadius").val(getProperty.borderRadius);
    $("#TimePicker_TxtIndent").val(getProperty.txtIndent);

    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
      
    }

    //应用属性
	//背景色
	$("#TimePicker_BgColor").spectrum({
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
            
            $("#TimePicker_BgColor").val(color.toHexString());
			getProperty.backgroundColor = color.toHexString();
            _TimePicker.Set("BasicProperty", getProperty);

        }
    });
	//字体色
    $("#TimePicker_FontColor").spectrum({
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
            
            $("#TimePicker_FontColor").val(color.toHexString());
			getProperty.fontColor = color.toHexString();
            _TimePicker.Set("BasicProperty", getProperty);
        }
    });

    $("#TimePicker_FontSize").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.fontSize);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
			return;
        }
		 
		getProperty.fontSize =val;
        _TimePicker.Set("BasicProperty", getProperty);

    });

    //边框颜色选择
    $("#TimePicker_BorderColor").spectrum({
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
			$("#TimePicker_BorderColor").val(color.toHexString());
			getProperty.borderColor = color.toHexString();
            _TimePicker.Set("BasicProperty", getProperty);
        }
    });
    //边框宽度变化
    $("#TimePicker_BorderWidth").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.borderWidth);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
			return;
        }
		getProperty.borderWidth =val;
        _TimePicker.Set("BasicProperty", getProperty);

    });
    //圆角半径变化
        $("#TimePicker_BorderRadius").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.borderRadius);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
			return;
        }
		getProperty.borderRadius =val;
        _TimePicker.Set("BasicProperty", getProperty);
    });
    //文本缩进
    $("#TimePicker_TxtIndent").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.txtIndent);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
			return;
        }
		getProperty.txtIndent =val;
        _TimePicker.Set("BasicProperty", getProperty);
    });

    //输出参数格式化
    $("#TimePicker_OutParSel").unbind().bind("change",function(){
        getProperty.OutParsFormat =$(this).val();
        _TimePicker.Set("BasicProperty", getProperty);
    });
    if(getProperty.OutParsFormat!=null && getProperty.OutParsFormat!=""){
        $("#TimePicker_OutParSel").find("option[value='"+getProperty.OutParsFormat+"']").attr("selected","selected");
    }else{
        $("#TimePicker_OutParSel").find("option[value='yyyy-MM-dd']").attr("selected","selected");
    }
}

Agi.Controls.TimePicker.OutPutValueFormat=function(_format,_value){
    if(_format!=null && _format!=""){}else{
        _format="yyyy-MM-dd HH:mm:ss";
    }
    var ReturnValue=_value;
    switch (_format){
        case "yyyy-MM-dd HH:mm:ss":
            ReturnValue=_value;
            break;
        case "yyyy-MM-dd HH:mm":
            ReturnValue=_value.substr(0,16);
            break;
        case "yyyy-MM-dd HH":
            ReturnValue=_value.substr(0,13);
            break;
        case "yyyy-MM":
            ReturnValue=_value.substr(0,7);
            break;
        case "yyyy":
            ReturnValue=_value.substr(0,4);
            break;
        case "yyyy-MM-dd":
            ReturnValue=_value.substr(0,10);
            break;
        default :
            ReturnValue=_value;
            break;
    }
    return ReturnValue;
}