/**
 * Created with JetBrains WebStorm.
 * User: alex
 * Date: 12-11-12
 * Time: 下午2:44
 * To change this template use File | Settings | File Templates.
 * TextInputBox: 文本框
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.TextInputBox = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        Render:function (_Target) {
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
        RemoveEntity:function (_EntityKey) {
           
        },
        ReadData:function (et) {
        },
        AddColumn:function (_entity, _ColumnName) {
        },
        ReadOtherData:function (Point) {
        },
        ReadRealData:function (MsgObj) {
        },
        AddEntity:function (_entity) {

        },
        ParameterChange:function (_ParameterInfo) {
            this.Set('Entity', this.Get('Entity'));
        }, //参数联动
        Init:function (_Target, _ShowPosition, savedId) {
            var Me = this;
            Me.AttributeList = [];
            this.minHeight = 26;
            this.minWidth = 200;
            Me.Set("Entity", []);
            Me.Set("ControlType", "TextInputBox");
            Me.Set("AssociativeValue", []);  //控件联想值
            Me.Set("SelectedColumn", []);   //控件联想选中行
            var ID = savedId ? savedId : "TextInputBox" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty'></div>");
            HTMLElementPanel.css('padding-bottom', '0px');

            this.shell = new Agi.Controls.Shell({
                ID:ID,
                width:200,
                height:26,
                divPanel:HTMLElementPanel
            });

            //20140218 范金鹏 添加FontFamily属性
            var TextInputBoxBasicProperty = {
                PanelFontSty:"微软雅黑", //面板字体样式
                PanelBgColor:"#ffffff", //面板背景色
                PanelBorderColor:"#9f9f9f", //面板边框色
                PanelSelectedColumnColor:"#00f",
                AssociativeDisplayRows:10, //联想列
                InputFontColor:"#000000", //输入框字体颜色
                InputBorderColor:"#9f9f9f", //输入框边框颜色
                ButtonBgColor:"#b9b9b9", //按钮背景色
                ButtonBorderColor:"#9f9f9f", //按钮边框色
                ButtonText:"Go",                   //按钮显示文字
                FontFamily:''
            };
            this.Set("TextInputBoxBasicProperty", TextInputBoxBasicProperty);

            var PostionValue = {Left:0, Top:0, Right:0, Bottom:0};

            var obj = null;
            if (typeof(_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = {Width:$(obj).width(), Height:$(obj).height(), Left:0, Top:0};
            var TextBoxID="TextInputBox_"+ID;
            var BaseControlObj = $("<div id='TextinputBoxDiv'><div id='TxtinputBoxAndButtonShell'><input id='"+TextBoxID+"' class='TextinputBoxativeClass' ></div></div>");
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement", this.shell.Container[0]);

            var ThisProPerty = {
                ID:ID,
                BasciObj:BaseControlObj
            };
            this.Set("ProPerty", ThisProPerty);
            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(210);
                //         HTMLElementPanel.height(25);
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
            var StartPoint = {X:0, Y:0}

            var self = this;
            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    Agi.Controls.ControlEdit(self);//控件编辑界面
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
            $('#' + self.shell.ID).find('.TextinputBoxativeClass').blur(function () {
                Agi.Controls.TextInputBoxblur(this, Me);
            });
            this.Set("Position", PostionValue);

            if (Agi.Edit) {
                //缩小的最小宽高设置
                HTMLElementPanel.resizable({
                    minWidth:self.minWidth,
                    minHeight:self.minHeight,
                    maxHeight:self.minHeight
                });
                $('#' + self.shell.ID + ' .ui-resizable-handle').css('z-index', 2000);
            }

            //输出参数
            Agi.Msg.PageOutPramats.AddPramats({
                "Type":Agi.Msg.Enum.Controls,
                "Key":ID,
                "ChangeValue":[
                    { 'Name':"TextValue","Value":""}
                ]
            });
            //20130515 倪飘 解决bug，组态环境中拖入联想输入框以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        },

        CustomProPanelShow:function () {
            Agi.Controls.TextInputBoxPropertyInit(this);
        }, //显示自定义属性面板

        Destory:function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");

            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        Copy:function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent();// $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newInputBoxPositionpars = { Left:parseFloat(PostionValue.Left), Top:parseFloat(PostionValue.Top) }
                var NewInputBox = new Agi.Controls.TextInputBox();
                NewInputBox.Init(ParentObj, PostionValue);
                newInputBoxPositionpars = null;
                return NewInputBox;
            }
        },
        PostionChange:function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PagePars = {Width:ParentObj.width(), Height:ParentObj.height()};
                var _ThisPosition = {
                    Left:(_Postion.Left / PagePars.Width).toFixed(4),
                    Top:(_Postion.Top / PagePars.Height).toFixed(4),
                    Right:(_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom:(_Postion.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                var ThisHTMLElement = $(this.Get("HTMLElement"));
                var ParentObj = ThisHTMLElement.parent();
                var PagePars = {Width:ParentObj.width(), Height:ParentObj.height(), Left:ParentObj.offset().left, Top:ParentObj.offset().top};


                var ThisControlPars = {Width:ThisHTMLElement.width(), Height:ThisHTMLElement.height(), Left:(ThisHTMLElement.offset().left - PagePars.Left), Top:(ThisHTMLElement.offset().top - PagePars.Top), Right:0, Bottom:0};
                ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
                ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);

                var _ThisPosition = {
                    Left:(ThisControlPars.Left / PagePars.Width).toFixed(4),
                    Top:(ThisControlPars.Top / PagePars.Height).toFixed(4),
                    Right:(ThisControlPars.Right / PagePars.Width).toFixed(4),
                    Bottom:(ThisControlPars.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }
        },
        HTMLElementSizeChanged:function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", {Left:0, Right:0, Top:0, Bottom:0});//由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh();//每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        }, //外壳大小更改
        Refresh:function () {
            var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
            var ParentObj = ThisHTMLElement.parent();
            if (!ParentObj.length) {
                return;
            }
            var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
            var PostionValue = this.Get("Position");
            PostionValue.Left = parseFloat(PostionValue.Left);
            PostionValue.Right = parseFloat(PostionValue.Right);

            PostionValue.Top = parseFloat(PostionValue.Top);
            PostionValue.Bottom = parseFloat(PostionValue.Bottom);
            var ThisControlPars = { Width:parseInt(PagePars.Width - (PagePars.Width * (PostionValue.Left + PostionValue.Right))),
                Height:parseInt(PagePars.Height - (PagePars.Height * (PostionValue.Top + PostionValue.Bottom)))
            };
            ThisHTMLElement.width(ThisControlPars.Width);
            ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", ( parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
        },
        Checked:function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked:function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000"
            });
        },
        ControlAttributeChangeEvent:function (_obj, Key, _Value) {
            if (Key == "Position") {
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                    var ParentObj = ThisHTMLElement.parent();
                    var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
                    ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                    ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                    //输入框缩小

                    var inputObj = $('#' + this.shell.ID).find('.TextinputBoxativeClass');
                    inputObj.width(ThisHTMLElement.width() - 22);
                    ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                }
            }
            else if (Key == "TextInputBoxBasicProperty") {
                if (layoutManagement.property.type == 1) {
                    $('#' + this.shell.ID).find('.TextinputBoxativeClass').css({"color":"" + _Value.InputFontColor + ""});
                    $('#' + this.shell.ID).find('.TextinputBoxativeClass').css({ "border-color": _Value.InputBorderColor });
                    //20140218 范金鹏 当属性面板中的字体样式改变之后改变相应的组态环境中的输入控件字体显示
                    $('#' + this.shell.ID).find('.TextinputBoxativeClass').css({ "font-family": _Value.FontFamily });
                    //end
                }
            }
            else if (Key == "AssociativeValue") {

                var ThisProPerty = _obj.Get("ProPerty");

                Agi.Msg.PageOutPramats.PramatsChange({
                    "Type":Agi.Msg.Enum.Controls,
                    "Key":ThisProPerty.ID,
                    "ChangeValue":[
                        { 'Name':'TextValue', 'Value':_Value }
                    ]
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_obj, "Type":Agi.Msg.Enum.Controls});

            }
            else if (Key == "Entity")//实体
            {
                var entity = _obj.Get('Entity');
                    BindDataByEntity(_obj, entity[0]);
            }

            function BindDataByEntity(controlObj, et) {
                var self = controlObj;
                if(!et.IsShareEntity){
                Agi.Utility.RequestData2(et, function (d) {
                    //修改选中列
                    self.Set("SelectedColumn", d.Columns[0]);

                    var $UI = $('#' + controlObj.shell.ID);
                    var data = d.Data.length ? d.Data : [];
                    var columns = d.Columns;
                    et.Data = data;
                    et.Columns = d.Columns;
                    if (Agi.Controls.IsControlEdit)
                    {
                        Agi.Controls.ShowControlData(self); //更新实体数据显示
                        //20130521 倪飘 解决bug，联想输入框中拖入数据，双击高级属性设置界面中添加替换实体，但是右侧绑定配置中选择联想列中依旧存在绑定的列
                        //刷新属性面板
                        Agi.Controls.TextInputBoxPropertyInit(self);
                    }
                });
                }else{
                    BindDataByJson.call(self,et,et);
                }
                return;
            }
            function BindDataByJson(et,d){
                var controlObj = this;
                controlObj.Set("SelectedColumn", d.Columns[0]);
                var data = d.Data.length ? d.Data : [];
                var columns = d.Columns;
                et.Data = data;
                et.Columns = d.Columns;
                if (Agi.Controls.IsControlEdit)
                {
                    Agi.Controls.ShowControlData(controlObj); //更新实体数据显示
                    //20130521 倪飘 解决bug，联想输入框中拖入数据，双击高级属性设置界面中添加替换实体，但是右侧绑定配置中选择联想列中依旧存在绑定的列
                    //刷新属性面板
                    Agi.Controls.TextInputBoxPropertyInit(self);
                }
            }
        },
        GetConfig:function () {
            var ProPerty = this.Get("ProPerty");

            var TextInputBoxControl = {
                Control:{
                    ControlType:null, //控件类型
                    ControlID:null, //控件属性
                    ControlBaseObj:null, //控件基础对象
                    HTMLElement:null, //控件外壳ID
                    Entity:null, //控件实体
                    TextInputBoxBasicProperty:null, //控件面板基本属性
                    Position:null, //控件位置
                    ThemeInfo:null,
                    AssociativeValue:null
                }
            }
            TextInputBoxControl.Control.ControlType = this.Get("ControlType");
            TextInputBoxControl.Control.ControlID = ProPerty.ID;
            TextInputBoxControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            TextInputBoxControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            TextInputBoxControl.Control.TextInputBoxBasicProperty = this.Get("TextInputBoxBasicProperty");
            TextInputBoxControl.Control.Position = this.Get("Position");
            TextInputBoxControl.Control.ThemeInfo = this.Get("ThemeInfo");
            TextInputBoxControl.Control.AssociativeValue = this.Get("AssociativeValue");
            return  TextInputBoxControl.Control;
        }, //获得联想输入框控件的配置信息
        CreateControl:function (_Config, _Target) {
            var savedId = _Config.ControlID;
            this.Init(_Target, _Config.Position, savedId);

            if (_Config != null) {
                var TextInputBoxBasicProperty = null;
                var Me=this;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;

                    var TextInputBoxBasicProperty = _Config.TextInputBoxBasicProperty;
                    this.Set("TextInputBoxBasicProperty", TextInputBoxBasicProperty);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    //输入框
                    $("#" + ThisProPerty.ID).find('.TextinputBoxativeClass').css({"color":"" + TextInputBoxBasicProperty.InputFontColor + ""})
                    $("#" + ThisProPerty.ID).find('.TextinputBoxativeClass').css({"border-color":"" + TextInputBoxBasicProperty.InputBorderColor + ""})

                    var PagePars = {Width:_Targetobj.width(), Height:_Targetobj.height()};
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);

                    var ThisControlPars = {Width:parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height:parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))};
                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                    $('#' + ThisProPerty.ID).find('.TextinputBoxativeClass').val(_Config.AssociativeValue).blur(function () {
                        Agi.Controls.TextInputBoxblur(this, Me);
                    });
                    Me.Set("AssociativeValue", _Config.AssociativeValue);
                }
            }
        },
        ChangeTheme:function (_themeName) {
            var Me = this;
            //1.根据当前控件类型和样式名称获取样式信息
            var TextInputBoxStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);
            //2.保存主题
            Me.Set("ThemeName", _themeName);
            //3.应用当前控件的信息
            Agi.Controls.TextInputBox.OptionsAppSty(TextInputBoxStyleValue, Me);
        }, //更改控件样式
        EnterEditState: function (size) {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            if (size) {
                obj.css({ "width": size.width, "height": size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
        },
        InEdit:function () {

            this.Set("EditState", true);//编辑
        }, //编辑中
        ExtEdit:function () {
            var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
            ThisHTMLElement.resizable({
                minWidth:this.minWidth,
                minHeight:this.minHeight,
                maxHeight:this.minHeight
            });
        } //退出编辑
    });
Agi.Controls.TextInputBox.OptionsAppSty = function (_StyConfig, Me) {
    if (_StyConfig != null) {
        var TextInputBoxBasicProperty=Me.Get("TextInputBoxBasicProperty");
        TextInputBoxBasicProperty.PanelFontSty=_StyConfig.PanelFontSty;
        TextInputBoxBasicProperty.PanelBgColor=_StyConfig.PanelBgColor;
        TextInputBoxBasicProperty.PanelBorderColor=_StyConfig.PanelBorderColor;
        TextInputBoxBasicProperty.PanelSelectedColumnColor=_StyConfig.PanelSelectedColumnColor;
        TextInputBoxBasicProperty.AssociativeDisplayRows=_StyConfig.AssociativeDisplayRows;
        TextInputBoxBasicProperty.InputFontColor=_StyConfig.InputFontColor;
        TextInputBoxBasicProperty.InputBorderColor=_StyConfig.InputBorderColor;
        TextInputBoxBasicProperty.InputFontColor=_StyConfig.InputFontColor;
        TextInputBoxBasicProperty.InputBorderColor=_StyConfig.InputBorderColor;
        TextInputBoxBasicProperty.ButtonBgColor=_StyConfig.ButtonBgColor;
        TextInputBoxBasicProperty.ButtonBorderColor=_StyConfig.ButtonBorderColor;
        Me.Set("TextInputBoxBasicProperty", TextInputBoxBasicProperty);
    }

}

function showTips(_obj, ControlObj) {
    //获取控件最外层外壳ID
    (function ($) {
        $.extend($, {
            arrunique:function (array) {
                var ret = [], done = {};
                try {
                    for (var i = 0, length = array.length; i < length; i++) {
                        var tmp = array[i]; // jQuery源码：var id = jQuery.data(array[i]);
                        if (!done[tmp]) {
                            done[tmp] = true;
                            ret.push(tmp);
                        }
                    }
                } catch (e) {
                    ret = array;
                }
                return ret;
            }
        });
    })(jQuery);

    var selectedCol = ControlObj.Get("SelectedColumn");
    var entity = ControlObj.Get("Entity");
    var data;
    if(entity.length)
    {
        data = entity[0].Data;
    }
    else
    {
        return;
    }

    var arrayObjMul = new Array();
    $(data).each(function (i, dd) {
        arrayObjMul.push(dd[selectedCol]); //含有重复数据的数组
    });

    var arrayObj = jQuery.arrunique(arrayObjMul); //删除重复数据后的数组
    var _obj = event.srcElement;
    var parentObj = $(_obj).parent().parent();
    var sel = $(parentObj).find('#selInputAssociative');  //获取联想面板
    var i;
    var re = new RegExp("^" + _obj.value, "i");
    var inputSelect = sel[0];
    inputSelect.options.length = 0;
    var inputWidth = _obj.offsetWidth;
    $(parentObj).find('#selInputAssociative').css("offsetWidth", inputWidth);
    //获取联想面板的数据
    for (i = 0; i < arrayObj.length; i++) {
        if (re.test(arrayObj[i]) == true) {
            sel.css("display", "inline-block");
            inputSelect.add(new Option(arrayObj[i], arrayObj[i]));
        }

    }
    var TextInputBoxBasicProperty = ControlObj.Get("TextInputBoxBasicProperty");
    var associativeDisplayRows = TextInputBoxBasicProperty.AssociativeDisplayRows;
    //更改联想面板显示数
    inputSelect.size = associativeDisplayRows;
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitTextInputBox = function () {
    return new Agi.Controls.TextInputBox();
}

//联想输入框 自定义属性面板初始化显示
Agi.Controls.TextInputBoxPropertyInit = function (propertyTextInputBox) {

    var isSaFari = navigator.userAgent.indexOf("Safari")
    if (isSaFari) {
        $("#TextInputBoxPropertyPanel").removeClass("BasicProperty_Panel");
        $("#TextInputBoxPropertyPanel").attr('className', 'BasicProperty_RadiusTextInputBox');
    }
    var $UI = $("#" + propertyTextInputBox.shell.ID);

    var ThisProItems = [];
    var TextInputBoxBasicProperty = propertyTextInputBox.Get("TextInputBoxBasicProperty");
    var ItemContent = new Agi.Script.StringBuilder();
    var PanelContent=null;

    //输入框设置
    var InputContent = null;
    InputContent = new Agi.Script.StringBuilder();
    InputContent.append("<div class='TextInputBox_Pro_Panel' >");
    InputContent.append("<table class='prortityPanelTableTxtBox' border='0' cellspacing='1' cellpadding='0'>");

    InputContent.append("<tr>");
    InputContent.append("<td class='prortityPanelTabletd0txtinputbo'>字体颜色</td><td class='prortityPanelTabletd1txtinputbo'><input id='TextInputBoxFontColor' type='text' class='basic input-mini'></td>");
    InputContent.append("<td class='prortityPanelTabletd0txtinputbo'>边框颜色</td><td class='prortityPanelTabletd1txtinputbo'><input type='text' id='TextInputBoxBorderColor' /></td>");
    InputContent.append("</tr>");

    InputContent.append("</table>");
    InputContent.append("</div>");
    var InputObj = $(InputContent.toString());

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"输入框设置", DisabledValue:1, ContentObj:InputObj }));

    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    $("#TextInputBoxFontColor").val(TextInputBoxBasicProperty.InputFontColor);
    $("#TextInputBoxBorderColor").val(TextInputBoxBasicProperty.InputBorderColor);

    //输入框边框颜色
    $("#TextInputBoxBorderColor").spectrum({
        showInput:true,
        showPalette:true,
        palette:[
            ['black', 'white'],
            ['blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50', 'red'],
            ['yellow', 'green'],
            ['blue', 'violet']
        ],
        cancelText:"取消",
        chooseText:"选择",
        change:function (color) {
            $(this).val(color.toHexString());
            TextInputBoxBasicProperty.InputBorderColor = color.toHexString();
            propertyTextInputBox.Set("TextInputBoxBasicProperty", TextInputBoxBasicProperty);
        }
    });
    //输入框字体颜色
    $("#TextInputBoxFontColor").spectrum({
        showInput:true,
        showPalette:true,
        palette:[
            ['black', 'white'],
            ['blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50', 'red'],
            ['yellow', 'green'],
            ['blue', 'violet']
        ],
        cancelText:"取消",
        chooseText:"选择",
        change:function (color) {
            $(this).val(color.toHexString());
            TextInputBoxBasicProperty.InputFontColor = color.toHexString();
            propertyTextInputBox.Set("TextInputBoxBasicProperty", TextInputBoxBasicProperty);
        }
    });
}

//单击双击事件处理
//20130520  倪飘 解决bug，联想输入框控件与其他控件进行联动的时候，双击联想输入框控件"go"按钮，会进入被联动的控件的高级属性面板
var TextInputBoxflag = 0;
varTextInputBoxObj = null;
Agi.Controls.TextInputBoxClickManager = function (_ClickOption) {
    TextInputBoxObj = _ClickOption;
    if (!TextInputBoxflag) {
        setTimeout(Agi.Controls.TextInputBoxClickLogic, 300);
    }
    TextInputBoxflag++;
}
Agi.Controls.TextInputBoxClickReset = function () {
    TextInputBoxflag = 0;
}
Agi.Controls.TextInputBoxDoubleClick = function (_ClickOption) {
    Agi.Controls.TextInputBoxClickReset();
    if (!Agi.Controls.IsControlEdit) {
        Agi.Controls.ControlEdit(_ClickOption.ControlObj); //控件编辑界面
    }
}

Agi.Controls.TextInputBoxClickLogic = function () {
    if (TextInputBoxflag === 1) {
        Agi.Controls.TextInputBoxSingleClick(TextInputBoxObj);
    }
    else {
        Agi.Controls.TextInputBoxDoubleClick(TextInputBoxObj);
    }
}
//文本框失去焦点触发联动
Agi.Controls.TextInputBoxblur=function(_obj, ControlObj) {
    var assoValue = $('#' + ControlObj.shell.ID).find(".TextinputBoxativeClass").val();
    ControlObj.Set("AssociativeValue", assoValue);
}