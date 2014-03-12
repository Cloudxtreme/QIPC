/**
 * Created with JetBrains WebStorm.
 * User: markewulei
 * Date: 12-9-3
 * Time: 上午9:50
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.InquireButton = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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

        },
        ReadData: function (et) {
            var self = this;
            self.IsChangeEntity = true;
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);

            this.Set("Entity", entity);
        },
        RequestData2: function (entity, callback, option) {
            var self = this;
            self.options = {
                url: WebServiceAddress,
                method: "DSReadData"
            };
            for (name in option) {
                self.options[name] = option[name];
            }
        },
        ReadRealData: function () {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.AttributeList = [];
            this.IsChangeEntity = false;
            this.Set("Entity", []);
            this.Set("ControlType", "InquireButton");

            var ID = savedId ? savedId : "InquireButton" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom: 15px'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 50,
                height: 25,
                divPanel: HTMLElementPanel
            });
            //隐藏头尾
            this.shell.Title.hide();
            this.shell.Title.hide().removeClass('selectPanelheadSty');
            this.shell.Footer.hide();

            var BaseControlObj = $('<input type="button" class="InquireButtonClass" id=' + ID + ' value="查询"/>');
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);

            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            //20140217 范金鹏 添加fontFamily属性
            var BasicProperty = {
                IsUsThemeSty:false,
                FontSize: "12",
                FontColor: "#000",
                BorderRadius:0,
                Background:null,
                BorderSize:0,
                BorderColor:null,
                FontFamily:""
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
                HTMLElementPanel.width(50);
                HTMLElementPanel.height(25);
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
//            /*事件绑定*/
//            $('#' + self.shell.ID).mousedown(function (ev) {
//                // alert($("#"+BaseControlObj));
//                Agi.Controls.BasicPropertyPanel.Show(this.id);
//            });

            $('#' + self.shell.ID).click(function (ev) {
                obj = { "sender": self, "Type": Agi.Msg.Enum.Controls };
                Agi.Msg.BtnQuery.queryEvent(obj);
                //add for count click on each page.
//                Agi.DAL.ReadData({
//                    "MethodName": "QBtnClickCount",
//                    "Paras": {'page':GetUrlParas("page")}
//                });
            });

//            $('#' + self.shell.ID).live('dblclick', function (ev) {
//                if (!Agi.Controls.IsControlEdit) {
//                    Agi.Controls.ControlEdit(self); //控件编辑界面
//                }
//            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            this.Set("Position", PostionValue);
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = null;

//            //缩小的最小宽高设置
//            HTMLElementPanel.resizable({
//                minHeight: 20,
//                minWidth: 25
//            });
            this.Set("ThemeName", null);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
            //Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/

            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        CustomProPanelShow: function () {
            Agi.Controls.ButtonPropertyInit(this);
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent(); // $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewButton = new Agi.Controls.InquireButton();
                NewButton.Init(ParentObj, PostionValue);
                newPositionpars = null;
                return NewButton;
            }
        },
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
                var ThisHTMLElement = $(this.Get("HTMLElement"));
                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };
                //                var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);

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
            ThisHTMLElement.css("left", (parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
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
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            var self = this;
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
                case "BasicProperty": //用户选择了一个项目
                    {
                        var BasicProperty = self.Get("BasicProperty");
                        $("#" + self.shell.BasicID).css("font-size", BasicProperty.FontSize + "px");
                        $("#" + self.shell.BasicID).css("color", BasicProperty.FontColor);
                        $("#" + self.shell.BasicID).css("border-radius", BasicProperty.BorderRadius+"px");
                        if(BasicProperty.Background!=null && BasicProperty.Background!=""){
                            if(typeof(BasicProperty.Background) === "string"){
                                $("#" + self.shell.BasicID).css({ "background-color": "" + BasicProperty.Background + "" });
                            }else{
                                var oBackgroundValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(BasicProperty.Background);
                                if(oBackgroundValue.BolIsTransfor!="false"){
                                    $("#" + self.shell.BasicID).css({"background":"none","background-color":"transparent"});
                                }else{
                                    $("#" + self.shell.BasicID).css(BasicProperty.Background.value);
                                }
                            }
                        }
                        if(BasicProperty.BorderColor!=null){
                            var strBordervalue="solid "+BasicProperty.BorderSize+"px "+BasicProperty.BorderColor;
                            $("#" + self.shell.BasicID).css("border",strBordervalue);
                            strBordervalue=null;
                        }else{
                            $("#" + self.shell.BasicID).css("border","solid 0px #ffffffff");
                        }
                        //20140217 范金鹏 添加更新FontFamily的代码
                        if (BasicProperty.FontFamily != null && BasicProperty.FontFamily != "") {
                            $('#' + self.shell.BasicID).css({ "font-family": "" + BasicProperty.FontFamily + "" });
                        }
                        //end
                        BasicProperty.IsUsThemeSty=false;
                    } break;
            } //end switch

        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var ButtonContorl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件ID
                    ControlBaseObj: null, //控件对象
                    HTMLElement: null, //控件的外壳HTML元素信息
                    Entity: null, // 实体
                    BasicProperty: null, //控件基本属性
                    Position: null, // 控件位置信息
                    ThemeName: null//主题名称
                }
            }// 配置信息数组对象
            ButtonContorl.Control.ControlType = this.Get("ControlType");
            ButtonContorl.Control.ControlID = ProPerty.ID;
            ButtonContorl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            ButtonContorl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            ButtonContorl.Control.Entity = this.Get("Entity");
            ButtonContorl.Control.BasicProperty = this.Get("BasicProperty");
            ButtonContorl.Control.Position = this.Get("Position");
            ButtonContorl.Control.ThemeName = this.Get("ThemeName");
            return ButtonContorl.Control; //返回配置字符串
        },
        //获得控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {

                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    this.Set("Position", _Config.Position);


                    BasicProperty = _Config.BasicProperty;
                    if(BasicProperty.IsUsThemeSty!=null && BasicProperty.IsUsThemeSty){
                        this.Set("BasicProperty", BasicProperty);
                        this.ChangeTheme(_Config.ThemeName);//更改主题
                    }else{
                        this.ChangeTheme(_Config.ThemeName);//更改主题
                        this.Set("BasicProperty", BasicProperty);
                    }

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
                }
            }
        },
        ChangeTheme: function (_themeName) {
            //1.根据当前控件类型和样式名称获取样式信息
            var ButtonStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(this.Get("ControlType"), _themeName);

            //2.保存主题名称
            this.Set("ThemeName", _themeName);

            //3.应用当前控件的信息
            Agi.Controls.InquireButton.OptionsAppSty(ButtonStyleValue, this);

            var BasicProperty = this.Get('ProPerty');
            BasicProperty.IsUsThemeSty=true;
        } //更改控件样式
    }, true);
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */
    Agi.Controls.InquireButton.OptionsAppSty = function (_StyConfig, _Button) {
        if (_StyConfig != null) {
            var BtnID = _Button.shell.BasicID;
            if (_StyConfig.ClassName) {
                $("#" + BtnID).removeClass();
                $("#" + BtnID).addClass(_StyConfig.ClassName);
            }
            else {
                $("#" + _Button.shell.BasicID).css("color", _StyConfig.color);
                $("#" + _Button.shell.BasicID).css("font-size", _StyConfig.fontSize);
                $("#" + _Button.shell.BasicID).css("border-radius", _StyConfig.borderRadius);
                $("#" + _Button.shell.BasicID).css("background", _StyConfig.background);
                $("#" + _Button.shell.BasicID).css("border", _StyConfig.border);
                $('#' + _Button.shell.BasicID).css("text-shadow", _StyConfig.textShadow);
                var BasicProperty=_Button.Get("BasicProperty");
                BasicProperty.BorderRadius=_StyConfig.borderRadius.replace("px","");
                BasicProperty.Background=_StyConfig.background;
                if(_StyConfig.border!=null && _StyConfig.border.length>0){
                    var aBorderValues=_StyConfig.border.split(" ");
                    if(aBorderValues!=null && aBorderValues.length>0){
                        for(var i=0;i<aBorderValues.length;i++){
                            if(aBorderValues[i]==""){
                            }else{
                                if(aBorderValues[i].indexOf("px")>-1){
                                    BasicProperty.BorderSize=aBorderValues[i].replace("px","");
                                }
                                if(aBorderValues[i].indexOf("#")>-1 || aBorderValues[i].indexOf("(")>-1){
                                    BasicProperty.BorderColor=aBorderValues[i];
                                }
                            }
                        }
                    }
                }
            }
            $("#" + BtnID).css("width", "100%");
            $("#" + BtnID).css("height", "100%");
        }
    }


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitInquireButton=function(){
    return new Agi.Controls.InquireButton();
}


// 自定义属性面板初始化显示
Agi.Controls.ButtonPropertyInit = function (ButtonControl) {
    var _Button = ButtonControl;
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();

    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicChart_Pro_Panel'>");
    ItemContent.append("<table class='prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>背景颜色：</td><td class='prortityPanelTabletd2'></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>圆角半径：</td><td class='prortityPanelTabletd2'><input type='number' id='Button_BorderRoundSize' min='0' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>边框宽度：</td><td class='prortityPanelTabletd2'><input type='number' id='Button_BorderSize' min='0' /></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>边框颜色：</td><td class='prortityPanelTabletd2'><input type='text' id='Button_BorderColor' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体颜色：</td><td class='prortityPanelTabletd2'><input type='text' id='BtnFontColor'/></td>");
    ItemContent.append("<td class='prortityPanelTabletd0'>字体大小：</td><td class='prortityPanelTabletd2'><input type='number' id='BtnFontSize' min='0' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BasicObj = $(ItemContent.toString());

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: BasicObj }));

    if (Agi.Msg.PageOutPramats.GetSerialData().length > 0) {
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='BasicChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable' id='BtnBindControlTable'>");
        for (var i = 0; i < Agi.Msg.PageOutPramats.GetSerialData().length; i++) {
            if (Agi.Msg.PageOutPramats.GetSerialData()[i].MsgType != "UrlType") {
                ItemContent.append("<tr>");
                ItemContent.append("<td class='prortityPanelTabletd0'><input type='checkbox' class='BtnChangeControls'></td><td class='prortityPanelTabletd1' colspan='3'>" + Agi.Msg.PageOutPramats.GetSerialData()[i].key + "</td>");
                ItemContent.append("</tr>");
            }
        }
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var ControlObj = $(ItemContent.toString());

        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "取消联动选择", DisabledValue: 1, ContentObj: ControlObj }));
    }
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //绑定保存值
    var BasicProperty = _Button.Get("BasicProperty");
    $("#Button_BorderRoundSize").val(BasicProperty.BorderRadius);
    $("#BtnFontColor").val(BasicProperty.FontColor);
    $("#Button_BorderColor").val(BasicProperty.BorderColor);
    $("#BtnFontSize").val(BasicProperty.FontSize);
    $("#Button_BorderSize").val(BasicProperty.BorderSize);

    var TableTrList = $("#BtnBindControlTable").find('tr');
    //绑定保存的控件联动
    if (Agi.Msg.ButtonBindControls.Isexistitems(_Button.shell.BasicID)) {
        var AllControlList = Agi.Msg.ButtonBindControls.FindSingelObj(_Button.shell.BasicID).BindRelations;
        for (var j = 0; j < TableTrList.length; j++) {
            var Isexist = false;
            for (var i = 0; i < AllControlList.length; i++) {
                if (AllControlList[i].ControlID == $(TableTrList[j]).find('td')[1].innerText && AllControlList[i].IsBind == false) {
                    Isexist = true;
                    break;
                }
            }

            if (Isexist) {
                $(TableTrList[j]).find('input').attr('checked', 'checked');
            }
        }
    }

    $("#BtnFontColor").spectrum({
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
            $("#BtnFontColor").val(color.toHexString());
            BasicProperty.FontColor = color.toHexString();
            _Button.Set("BasicProperty", BasicProperty);
        }
    });
    $("#Button_BorderColor").spectrum({
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
            $("#Button_BorderColor").val(color.toHexString());
            BasicProperty.BorderColor = color.toHexString();
            _Button.Set("BasicProperty", BasicProperty);
        }
    });

    $("#BtnFontSize").change(function () {
        BasicProperty.FontSize = $("#BtnFontSize").val();
        _Button.Set("BasicProperty", BasicProperty);
    });
    $("#Button_BorderSize").change(function () {
        BasicProperty.BorderSize = $("#Button_BorderSize").val();
        _Button.Set("BasicProperty", BasicProperty);
    });
    $("#Button_BorderRoundSize").change(function () {
        BasicProperty.BorderRadius = $("#Button_BorderRoundSize").val();
        _Button.Set("BasicProperty", BasicProperty);
    });

    $(".BtnChangeControls").live('click', function () {
        var AllTableTr = $("#BtnBindControlTable").find('tr');
        var controlList = [];
        if (AllTableTr.length > 0){
            for (var i = 0; i < AllTableTr.length; i++) {
                var IsBind = true;
                var control = $(AllTableTr[i]).find('td')[1].innerText;
                if ($(AllTableTr[i]).find('input').attr('checked') == "checked") {
                    IsBind = false;
                }

                controlList.push({
                    ControlID: control,
                    IsBind: IsBind
                });

            }

            //保存
            Agi.Msg.ButtonBindControls.SaveControlsRelation(_Button.shell.BasicID, controlList);
        }
    });

}

