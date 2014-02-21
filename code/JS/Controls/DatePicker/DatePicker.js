/// <reference path="../../jquery-1.7.2.js" />

/*添加 Agi.Controls命名空间*/
Namespace.register("Agi.Controls");

Agi.Controls.DatePicker = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () { //获得实体数据

        },
        SetValue: function (_string) {
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
                $("#" + self.shell.BasicID).Zebra_DatePicker({
					onClear:function(e){
						
						var value = {
                            id: self.shell.BasicID,
                            val: ""
                        };
                        self.Set("SelValue", value);
					},
                    onSelect: function (e) {
                        var value = {
                            id: self.shell.BasicID,
                            val: e
                        };
                        self.Set("SelValue", value);
                    }
					
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
                    var nowDay = myDate.getFullYear() + "-" + month + "-" + day
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
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
            //            //            var ThisHTMLElement = self.shell.Container;
            //            //            var $ThisHTMLElement = $('#' + ThisHTMLElement[0].id);
            var BProperty = self.Get("BasicProperty");
            $('#' + self.shell.BasicID).val(BProperty.selectedDate);

            $('#' + self.shell.BasicID).Zebra_DatePicker({
                format: BProperty.formatStr,
                direction: [BProperty.beginDate, BProperty.endDate],
                onSelect: function (e) {
                    var value = {
                        id: self.shell.BasicID,
                        val: e
                    };
                    self.Set("SelValue", value);
                },
				onClear:function(e){
							var value = {
                            id: self.shell.BasicID,
                            val: ""
                        };
                        self.Set("SelValue", value);
					}
            });

            return this;
        },
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 45,
                minWidth: 120,
                maxHeight: 45
            }).css("position", "absolute");
            return this;
        },
        ReadData: function (et) {
            //            var entity = this.Get("Entity");
            //            entity = [];
            //            entity.push(et);
            //            this.Set("Entity", entity);
            //20121227 11:18 罗万里 改控件不支持加载实体
            AgiCommonDialogBox.Alert("此控件不支持加载实体！");
            return;
        },
        ReadRealData: function (_Entity) {
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "DatePicker");

            var ID = savedId ? savedId : "DatePicker" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom:10px;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 180,
                height: 25,
                divPanel: HTMLElementPanel
                //                enableFrame:true
            });
            //解决bug，组态环境中单日期控件的高度可以通过右下角属性设置面板进行设置
            var BaseControlObj = $('<input id="' + ID + '" class="DatePicker" type="text" style=" width:100%; padding: 0px; padding-right: 0px;">');
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            //20130115 倪飘 解决控件默认背景颜色与控件属性设置中默认背景颜色选择框中的不一致问题
            var BasicProperty = {
                selectedDate: "",
                fontColor: "",
                fontSize: 12,
                formatStr: "Y-m-d",
                bgColor: "#f3f3f3",
                beginDate: "",
                endDate: "",
                IsUseStyle: false,
                OutParsFormat:"yyyy-MM-dd"
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
                HTMLElementPanel.width(180);
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
            var StartPoint = { X: 0, Y: 0 }
            var self = this;
            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
                $(".Zebra_DatePicker").css("z-index", "9999");
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    Agi.Controls.ControlEdit(self); //控件编辑界面
                    $(".Zebra_DatePicker").hide();
                }
                $(".Zebra_DatePicker").hide();
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
                minHeight: 25,
                minWidth: 90,
                maxHeight: 25
            }).css("position", "absolute");
            //20130515 倪飘 解决bug，组态环境中拖入单日期选择控件以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);

        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.DatePickerProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            //            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/

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
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewDatePicker = new Agi.Controls.DatePicker();
                NewDatePicker.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewDatePicker;
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
            /*  $(this.Get("HTMLElement")).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
            "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
            }); */
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
            if ($(".Zebra_DatePicker").css('display') == "block") {
                $(".Zebra_DatePicker").hide();
            }
            //            var h = this.shell.Title.height() + this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            //            obj.height(30);
            //            obj.width(150);
            //固定一个宽度,防止超出左边的容器
            this.shell.Container.css({ 'padding-right': '2px', 'width': 200 });
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight: 25,
                    minWidth: 120,
                    maxHeight: 25
                }).css("position", "absolute");
            }
            //刷新大小
            this.PostionChange(null);
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.DatePickerAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.DatePicker.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            /*  var ConfigObj = new Agi.Script.StringBuilder(); */
            /*配置信息数组对象*/
            /*
            ConfigObj.append("<Control>");
            ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>"); */
            /*控件类型*/
            /*
            ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>"); */
            /*控件属性*/
            /*
            ConfigObj.append("<ControlBaseObj>" + ProPerty.BasciObj[0].id + "</ControlBaseObj>"); */
            /*控件基础对象*/
            /*
            ConfigObj.append("<HTMLElement>" + ProPerty.BasciObj[0].id + "</HTMLElement>"); */
            /**/
            /*
            var Entitys = this.Get("Entity");
            $(Entitys).each(function (i, e) {
            e.Data = null;
            });
            ConfigObj.append("<Entity>" + JSON.stringify(Entitys) + "</Entity>"); */
            /**/
            /*

            ConfigObj.append("<BasicProperty>" + JSON.stringify(this.Get("BasicProperty")) + "</BasicProperty>"); */
            /**/
            /*
            ConfigObj.append("<Position>" + JSON.stringify(this.Get("Position")) + "</Position>"); */
            /**/
            /*
            ConfigObj.append("<ThemeInfo>" + JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>"); */
            /**/
            /*
            ConfigObj.append("<ZIndex>" + $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index") + "</ZIndex>");
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串*/
            var DatePickerControl = {
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
            DatePickerControl.Control.ControlType = this.Get("ControlType");
            DatePickerControl.Control.ControlID = ProPerty.ID;
            DatePickerControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            DatePickerControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            $(Entitys).each(function (i, e) {
                e.Data = null;
            });
            DatePickerControl.Control.Entity = Entitys;
            DatePickerControl.Control.BasicProperty = this.Get("BasicProperty");
            DatePickerControl.Control.Position = this.Get("Position");
            DatePickerControl.Control.ThemeInfo = this.Get("ThemeInfo");
            DatePickerControl.Control.ZIndex = $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index");
            return DatePickerControl.Control;
        }, //获得DatePicker控件的配置信息
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

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    BasicProperty = _Config.BasicProperty;
                    //应用样式
                    if (BasicProperty.IsUseStyle != false) {
                        this.ChangeTheme(_Config.ThemeInfo);
                    }

                    this.Set("BasicProperty", BasicProperty);

                    //20130115 倪飘 解决单日期控件设置背景颜色以后拖入白色样式，预览页面中样式无法显示问题
                    //设置样式属性

                    var format;
                    var self = this;
                    $("#" + ThisProPerty.ID).val(BasicProperty.selectedDate);
                    var value = {
                        id: ThisProPerty.ID,
                        val: BasicProperty.selectedDate
                    }
                    this.Set("SelValue", value);

                    //格式处理
                    var begin = getDateFormateForDatePickerControl(BasicProperty.beginDate, BasicProperty.formatStr);
                    var end = getDateFormateForDatePickerControl(BasicProperty.endDate, BasicProperty.formatStr);
                    var min = getDateFormateForDatePickerControl('1001-01-01', BasicProperty.formatStr);
                    var Datepickerdirection = null;
                    if (begin === "" && end === "") {
                    } else {
                        Datepickerdirection = [
                            begin === '' ? min : begin,
                            end === '' ? false : end
                        ];
                    }
                    $('#' + ThisProPerty.ID).Zebra_DatePicker({
                        format: BasicProperty.formatStr,
                        direction: Datepickerdirection,
                        onSelect: function (e) {
                            var value = {
                                id: ThisProPerty.ID,
                                val: e
                            };
                            self.Set("SelValue", value);
                        },
						onClear:function(e){
							var value = {
								id: self.shell.BasicID,
								val: ""
							};
							self.Set("SelValue", value);					}
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

                    this.Set("Entity", _Config.Entity);

                }
            }
        } //根据配置信息创建控件
    }, true);


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDatePicker = function () {
    return new Agi.Controls.DatePicker();
}


/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _DatePicker:当前控件对象
 * */
Agi.Controls.DatePicker.OptionsAppSty = function (_StyConfig, _DatePicker) {
    if (_StyConfig != null) {
        var BasicProperty = _DatePicker.Get('BasicProperty');
        BasicProperty.IsUseStyle = true;

        var mid = _DatePicker.shell.BasicID;
        $('#' + mid).css("color", _StyConfig.color);
        $('#' + mid).css("font-size", _StyConfig.fontSize);
        $('#' + mid).css("border-radius", _StyConfig.borderRadius);
        $('#' + mid).css("background", _StyConfig.background);
        $('#' + mid).css("border", _StyConfig.border);
        $('#' + mid).css("text-shadow", _StyConfig.textShadow);
        $('#' + mid).css("cursor", _StyConfig.cursor);
        $('#' + mid).css("text-indent", _StyConfig.textIndet);

        BasicProperty.fontColor=_StyConfig.color;
        BasicProperty.fontSize=_StyConfig.fontSize;
        BasicProperty.borderRadius=parseInt(_StyConfig.borderRadius.replace("px",""));
        if(_StyConfig.border!=null && _StyConfig.border!=""){
            var aBorderValues=_StyConfig.border.split(" ");
            if(aBorderValues!=null && aBorderValues.length>0){
                for(var i=0;i<aBorderValues.length;i++){
                    if(aBorderValues[i]==""){
                    }else{
                        if(aBorderValues[i].indexOf("px")>-1){
                            BasicProperty.borderSize=parseInt(aBorderValues[i].replace("px",""));
                        }
                        if(aBorderValues[i].indexOf("#")>-1 || aBorderValues[i].indexOf("(")>-1){
                            BasicProperty.borderColor=aBorderValues[i];
                        }
                    }
                }
            }
        }
        BasicProperty.txtIndent=parseInt(_StyConfig.textIndet.replace("px",""));
        _DatePicker.Set('BasicProperty', BasicProperty);
    }
}


/*日期选择控件参数更改处理方法*/
Agi.Controls.DatePickerAttributeChange = function (_ControlObj, Key, _Value) {
    switch (Key) {
        case "Position":
        {
            if (layoutManagement.property.type == 1) {
                var ThisHTMLElement = $(_ControlObj.Get("HTMLElement"));
                var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
                //ThisControlObj.height(ThisHTMLElement.height()-20);
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
            //                    var ThisProPerty = _ControlObj.Get("ProPerty");

            var basicproperty = _ControlObj.Get("BasicProperty");
            basicproperty.selectedDate = data.val;
            _ControlObj.Set("BasicProperty", basicproperty);

            Agi.Msg.PageOutPramats.PramatsChange({
                'Type':Agi.Msg.Enum.Controls,
                'Key':data.id,
                'ChangeValue':[
                    { 'Name':'CurrentValue', 'Value':Agi.Controls.DatePicker.OutPutValueFormat(basicproperty.OutParsFormat,data.val)}
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

            if(_Value.bgColor!=null && _Value.bgColor!=""){
                if(typeof(_Value.bgColor)==="string"){
                    if (_Value.IsUseStyle != true){
                        $("#" + mid).css("background-color",_Value.bgColor);
                    }
                }else{
                    $("#" + mid).css(_Value.bgColor.value);
                }
            }

            if(_Value.borderSize>0){
                var sborderstyle=_Value.borderSize+"px solid "+_Value.borderColor;
                $("#" + mid).css("border",sborderstyle);
            }else{
                $("#" + mid).css("border","0px solid #ffffff");
            }
            $("#" + mid).css("border-radius",_Value.borderRadius+"px");
            $("#" + mid).css("text-indent",_Value.txtIndent+"px");

        }
            break;
    } //end switch

}     //end

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.DatePickerProrityInit = function (DatePickerControl) {
    _DatePicker = DatePickerControl;
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='DatePickerPro_Panel'>");
    ItemContent.append("<table class='DatePickerPro_Tab_Panel'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>字体颜色：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input id='fontcolorselect' type='text'></td>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>背景设置：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><div id='bgcolorselect' style='background-color:#ffffffff;' class='ControlColorSelPanelSty'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>字体大小：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input type='number' min='10' max='20' defaultvalue='10' value='10' id='fontsizenum' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>格式化符：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><select id='splitselect'><option value='Y-m-d'>Y-m-d</option><option value='Y/m/d' title='提示：采用此种显示格式，开始结束日期将失效！'>Y/m/d</option></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>开始日期：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input type='text' id='begindate'></td>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>结束日期：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input type='text' id='enddate'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>边框宽度：</td>");
    //20130424 nipiao  解决bug，单日期选择控件修改了边框宽度为10 ，返回整体页面后，单日期选择控件不能移动
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input type='number' min='0' max='3' defaultvalue='0' value='0' id='DatePick_Bordersize' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>边框颜色：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input type='text' id='DatePick_Bordercolor'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>圆角半径：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input type='number' min='0' max='10' defaultvalue='0' value='0' id='DatePick_BorderRadius' class='ControlProNumberSty'/></td>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>文本缩进：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1'><input type='number' min='0' max='30' defaultvalue='0' value='0' id='DatePick_Txtindent' class='ControlProNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='DatePickerPro_tab_td0'>参数输出格式：</td>");
    ItemContent.append("<td class='DatePickerPro_tab_td1' colspan='3'><select id='DatepickerOutParSel' style='width:90%;'>" +
        "<option value='yyyy-MM-dd' selected='selected'>yyyy-MM-dd</option>" +
        "<option value='yyyy-MM-dd HH:mm:ss'>yyyy-MM-dd HH:mm:ss</option>" +
        "<option value='yyyy-MM-dd HH:mm'>yyyy-MM-dd HH:mm</option>" +
        "<option value='yyyy-MM-dd HH'>yyyy-MM-dd HH</option>" +
        "<option value='yyyy-MM'>yyyy-MM</option>" +
        "<option value='yyyy'>yyyy</option>" +
        "</select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td colspan='4' style='text-align: center;'><input type='button' value='应用格式和日期更改' style='width:200px;' id='propertychange' class='btnclass'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    //
    //
    //    ItemContent.append("<div style='padding:0px;'>字体颜色：<input id='fontcolorselect' type='text'></div>");
    //    ItemContent.append("<div style='padding:0px;'>背景颜色：<input id='bgcolorselect' type='text'></div>");
    //    ItemContent.append("<div>字体大小：<input type='number' min='10' max='20' defaultvalue='10' value='10' id='fontsizenum' class='propetycontro ControlProNumberSty'/></div>");
    //    ItemContent.append("<div>格式化符：<select id='splitselect' class='propetycontro'><option value='Y-m-d'>Y-m-d</option><option value='Y/m/d' title='提示：采用此种显示格式，开始结束日期将失效！'>Y/m/d</option></select></div>");
    //    //
    //    ItemContent.append("<div>开始日期：<input type='text' id='begindate'></div>");
    //    ItemContent.append("<div>结束日期：<input type='text' id='enddate'></div>");
    //    ItemContent.append("<div><input type='button' value='应用格式和日期更改' style='width:200px;' id='propertychange' class='btnclass'></div>");
    //    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    $('#begindate').Zebra_DatePicker(
        { onSelect: function (e) {
            //            if ($('#enddate').val() == "") { alert("请先选择结束日期！"); $('#begindate').val(""); return; }
            if ($('#enddate').val() <= $('#begindate').val() && $('#enddate').val() != "") {
                AgiCommonDialogBox.Alert('开始日期不能大于或等于结束日期，请重新选择！', null);
                $('#begindate').val("");
                return;
            }
        }
        }
    );

    $('#enddate').Zebra_DatePicker({ onSelect: function (e) {
        if ($('#enddate').val() <= $('#begindate').val()) {
            AgiCommonDialogBox.Alert('结束日期不能小于或等于开始日期，请重新选择！', null);
            $('#enddate').val("");
            return;
        }
    }
    });

    var mid = _DatePicker.shell.BasicID;
    var getProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");
    if (getProperty.fontColor == "") {
        getProperty.fontColor = "Default";
    }
    $("#fontcolorselect").val(getProperty.fontColor);
    $("#fontsizenum").val(getProperty.fontSize);
    if (getProperty.bgColor == "") {
        getProperty.bgColor = "Default";
    }
    if (getProperty.IsUseStyle) {//应用样式
        getProperty.bgColor = {
            "type": 2,
            "direction": "vertical",
            "stopMarker":
                [{
                    "position": 0.29,
                    "color": "",
                    "ahex": ""
                }, {
                    "position": 0.88,
                    "color": "",
                    "ahex": ""
                }],
            "value":
            {
                "background": $("#" + _DatePicker.shell.BasicID).css("background")
            }
        }
    } else {
        if (getProperty.bgColor != null && getProperty.bgColor != "") {
            if (typeof (getProperty.bgColor) === "string") {
                getProperty.bgColor = { "type": 1, "rgba": "", "hex": getProperty.bgColor, "ahex": "", "value": { "background": ""} };
            } else {
            }
        } else {
            getProperty.bgColor = { "type": 1, "rgba": "rgba(0,0,0,0)", "hex": "ffffff", "ahex": "ffffffff", "value": { "background": "rgba(0,0,0,0)"} };
        }
    }

    Agi.Controls.ControlColorApply.fColorControlValueSet("bgcolorselect", getProperty.bgColor, true); //背景设置初始化
    $("#splitselect").val(getProperty.formatStr);
    $("#begindate").val(getProperty.beginDate);
    $("#enddate").val(getProperty.endDate);
    if (getProperty.borderColor != null && getProperty.borderColor != "") {
    } else {
        getProperty.borderColor = "#000000";
    }
    //20130424 nipiao 解决bug，单日期选择控件修改边框的颜色后，返回整体页面 再次进入属性编辑中，右边属性中边框颜色显示为默认的
    $("#DatePick_Bordercolor").val(getProperty.borderColor);
    if (getProperty.borderSize) {
        $("#DatePick_Bordersize").val(getProperty.borderSize);
    }
    if (getProperty.borderRadius) {
        $("#DatePick_BorderRadius").val(getProperty.borderRadius);
    }
    if (getProperty.txtIndent) {
        $("#DatePick_Txtindent").val(getProperty.txtIndent);
    }

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
            if (getProperty.IsUseStyle != false) {
                getProperty.IsUseStyle = false;
                $("#" + mid).css("background-image", "none");
                $("#" + mid).css("background-color", getProperty.bgColor);
                $("#" + mid).css("border", "none");
            }
            $("#fontcolorselect").val(color.toHexString());
            //    SaveAllProperty();
            Agi.Controls.DatePicker.SaveAllProperty();
        }
    });
    //20130411 倪飘 解决bug，单日期选择，修改文本缩进超出限制，点击空白处，输入框中恢复默认值为0，左侧控件中日期显示空白
    $("#fontsizenum").change(function () {
        BasicProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.fontSize);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
        //    SaveAllProperty();
        Agi.Controls.DatePicker.SaveAllProperty();
    });

    $("#bgcolorselect").unbind().bind("click", function () {
        var oThisSelColorPanel = this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel, [2], true, function (color) {
            $(oThisSelColorPanel).css("background", color.value.background).data('colorValue', color);
            oThisSelColorPanel = null;
            //    SaveAllProperty();
            Agi.Controls.DatePicker.SaveAllProperty();
        });
    });

    if ($(".Zebra_DatePicker").css('display') == "block") {
        $(".Zebra_DatePicker").hide();
    }

    //边框颜色选择
    $("#DatePick_Bordercolor").spectrum({
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
            //    SaveAllProperty();
            Agi.Controls.DatePicker.SaveAllProperty();
        }
    });
    //边框宽度变化
    $("#DatePick_Bordersize").change(function () {
        BasicProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.borderSize);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
        //    SaveAllProperty();
        Agi.Controls.DatePicker.SaveAllProperty();
    });
    //圆角半径变化
        $("#DatePick_BorderRadius").change(function () {
        BasicProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.borderRadius);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
            //    SaveAllProperty();
            Agi.Controls.DatePicker.SaveAllProperty();
    });
    //文本缩进
    $("#DatePick_Txtindent").change(function () {
        BasicProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));

        if (val < MinNumber || val > MaxNumber) {
            $(this).val(BasicProperty.txtIndent);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
        //    SaveAllProperty();
        Agi.Controls.DatePicker.SaveAllProperty();
    });

    //输出参数格式化
    $("#DatepickerOutParSel").unbind().bind("change",function(){
        Agi.Controls.DatePicker.SaveAllProperty();
    });
    if(getProperty.OutParsFormat!=null && getProperty.OutParsFormat!=""){
        $("#DatepickerOutParSel").find("option[value='"+getProperty.OutParsFormat+"']").attr("selected","selected");
    }else{
        $("#DatepickerOutParSel").find("option[value='yyyy-MM-dd']").attr("selected","selected");
    }
}

function SaveAllProperty() {
    var mid = Agi.Edit.workspace.currentControls[0].shell.BasicID;
    var getProperty = Agi.Edit.workspace.currentControls[0].Get('BasicProperty');
    getProperty = {
        selectedDate:$("#" + mid).val(),
        fontColor:$("#fontcolorselect").val(),
        fontSize:$("#fontsizenum").val(),
        formatStr:$("#splitselect").val(),
        bgColor:$("#bgcolorselect").data('colorValue'),
        beginDate:$("#begindate").val(),
        endDate:$("#enddate").val(),
        borderSize:parseInt($("#DatePick_Bordersize").val()),
        borderColor:$("#DatePick_Bordercolor").val(),
        borderRadius:parseInt($("#DatePick_BorderRadius").val()),
        txtIndent:parseInt($("#DatePick_Txtindent").val()),
        IsUseStyle: getProperty.IsUseStyle,
        OutParsFormat:$("#DatepickerOutParSel").val()
    };
    //格式处理
    getProperty.beginDate = getDateFormateForDatePickerControl(getProperty.beginDate, getProperty.formatStr);
    getProperty.endDate = getDateFormateForDatePickerControl(getProperty.endDate, getProperty.formatStr);
    Agi.Edit.workspace.currentControls[0].Set('BasicProperty', getProperty);
}

//点击应用按钮
$("#propertychange").live('click', function () {
    //20130115 倪飘 解决日期控件双击进去修改开始日期后再进行页面参数配置后，不能联动问题
    var mid = Agi.Edit.workspace.currentControls[0].shell.BasicID;
    var beginDate = $("#begindate").val();
    var endDate = $("#enddate").val();
    var formatValue = $("#splitselect").val();
    var control = $('#' + mid);

//    var max = formatValue === "Y/m/d" ?  '9999/12/31' : '9999-12-31';
    var min = formatValue === "Y/m/d" ? '1001/01/01' : '1001-01-01';
    var max = false;
//    var min = false;
    beginDate = getDateFormateForDatePickerControl(beginDate, formatValue);
    endDate = getDateFormateForDatePickerControl(endDate, formatValue);
    if (beginDate != "" && endDate == "") {
        control.Zebra_DatePicker({
            format:formatValue,
            direction:[beginDate, max],
            onSelect:function (e) {
                var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:e
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
            },
			onClear:function(e){
				var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:""
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
			}
        });
        control.val(beginDate);
//        if (control.val() != "" && control.val().indexOf('-') > 0 && formatValue == "Y/m/d") {
//            control.val(control.val().replace(/\-/g, "/"));
//        }
//        else if (control.val() != "" && control.val().indexOf('/') > 0 && formatValue == "Y-m-d") {
//            control.val(control.val().replace(/\//g, "-"));
//        }
    } else if (beginDate == "" && endDate != "") {
        //AgiCommonDialogBox.Alert("请选择开始日期!");
        control.Zebra_DatePicker({
            format:formatValue,
            direction:[min, endDate],
            onSelect:function (e) {
                var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:e
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
            },
			onClear:function (e) {
                var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:""
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
            }
        });
        control.val(endDate);
//        if (control.val() != "" && control.val().indexOf('-') > 0 && formatValue == "Y/m/d") {
//            control.val(control.val().replace(/\-/g, "/"));
//        }
//        else if (control.val() != "" && control.val().indexOf('/') > 0 && formatValue == "Y-m-d") {
//            control.val(control.val().replace(/\//g, "-"));
//        }
    } else if (beginDate == "" && endDate == "") {
        control.Zebra_DatePicker({
            format:formatValue,
            onSelect:function (e) {
                var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:e
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
            },
			onClear:function (e) {
                var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:""
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
            }
        });
//        control.val(beginDate);
        if (control.val() != "") {
            if (formatValue === "Y/m/d") {
                control.val(control.val().replace(/\-/g, "/"));
            } else {
                control.val(control.val().replace(/\//g, "-"));
            }
        }
//        else if (control.val() != "" && control.val().indexOf('/') > 0 && formatValue == "Y-m-d") {
//            control.val(control.val().replace(/\//g, "-"));
//        }
    } else if (beginDate != "" && endDate != "") {
        control.Zebra_DatePicker({
            format:formatValue,
            direction:[beginDate, endDate],
            onSelect:function (e) {
                var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:e
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
            },
			onClear:function (e) {
                var value = {
                    id:Agi.Edit.workspace.currentControls[0].shell.BasicID,
                    val:""
                };
                Agi.Edit.workspace.currentControls[0].Set("SelValue", value);
            }
        });
        //将当前文本框内的格式转换成选择的格式
        if (beginDate != "") {
            control.val(beginDate);
        }
//        if (control.val() != "" && control.val().indexOf('-') > 0 && formatValue == "Y/m/d") {
//            control.val(control.val().replace(/\-/g, "/"));
//        }
//        else if (control.val() != "" && control.val().indexOf('/') > 0 && formatValue == "Y-m-d") {
//            control.val(control.val().replace(/\//g, "-"));
//        }
    }

//    SaveAllProperty();
    Agi.Controls.DatePicker.SaveAllProperty();
});
function getDateFormateForDatePickerControl(date, formate) {
    var value = '';
    if (formate == "Y/m/d") {
        value = date.replace(/\-/g, "/");
    } else if (formate == "Y-m-d") {
        value = date.replace(/\//g, "-");
    }
    return value;
}
//region 20131219 14：48 markeluo 修改&新增
//属性面板值更改后，保存设置
Agi.Controls.DatePicker.SaveAllProperty=function(){
    var mid = Agi.Edit.workspace.currentControls[0].shell.BasicID;
    var getProperty = Agi.Edit.workspace.currentControls[0].Get('BasicProperty');
    getProperty = {
        selectedDate:$("#" + mid).val(),
        fontColor:$("#fontcolorselect").val(),
        fontSize:$("#fontsizenum").val(),
        formatStr:$("#splitselect").val(),
        bgColor:$("#bgcolorselect").data('colorValue'),
        beginDate:$("#begindate").val(),
        endDate:$("#enddate").val(),
        borderSize:parseInt($("#DatePick_Bordersize").val()),
        borderColor:$("#DatePick_Bordercolor").val(),
        borderRadius:parseInt($("#DatePick_BorderRadius").val()),
        txtIndent:parseInt($("#DatePick_Txtindent").val()),
        IsUseStyle: getProperty.IsUseStyle,
        OutParsFormat:$("#DatepickerOutParSel").val()
    };
    //格式处理
    getProperty.beginDate = getDateFormateForDatePickerControl(getProperty.beginDate, getProperty.formatStr);
    getProperty.endDate = getDateFormateForDatePickerControl(getProperty.endDate, getProperty.formatStr);
    Agi.Edit.workspace.currentControls[0].Set('BasicProperty', getProperty);
}
Agi.Controls.DatePicker.OutPutValueFormat=function(_format,_value){
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