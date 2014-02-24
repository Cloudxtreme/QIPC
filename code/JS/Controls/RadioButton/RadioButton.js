/**
 * Created with JetBrains WebStorm.
 * User: Joanna Guo
 * Date: 2012年11月16日
 * Time: 14:02:00
 * To change this template use File | Settings | File Templates.
 * RadioButton 单选按钮
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/

Agi.Controls.RadioButton = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,{
        Render: function (_Target) {
            console.log("调用Render");
            debugger;
            var self = this;
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
        ReadData: function (et) {
            debugger;
            var self = this;
            self.IsChangeEntity = true;
            var entity  = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity",entity);
        },
        ReadOtherData: function (Point) {
        },
        ReadRealData: function (MsgObj) {
        },
        AddColumn:function(_entity,_ColumnName){
            var radioButtonBasicProperty = this.Get('RadioButtonBasicProperty');
            radioButtonBasicProperty.RadioButtonTextField = _ColumnName;

               $(_entity.Data).each(function(i,dd){
                   if(i<radioButtonBasicProperty.EntityNum){
                       radioButtonBasicProperty.RadioButtonText[i]=dd[radioButtonBasicProperty.RadioButtonTextField];
                   }
               });

            this.Set("RadioButtonBasicProperty", radioButtonBasicProperty);
            RefreshItemManagementDiv(radioButtonBasicProperty,this);

        },//拖动列到option
        ParameterChange: function (_ParameterInfo) {//参数联动
            //联动接口: 框架传递过来点位号；控件自己去注册点位号
            this.Set('Entity',this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            self.AttributeList = [];
            self.Set("Entity", []);
            self.Set("ControlType", "RadioButton");
            var ID = savedId ? savedId : "RadioButton_" + Agi.Script.CreateControlGUID();
            var HTMLRadioButton = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty RadioButtonPanelSty'></div>");

            self.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 250,
                height:150,
                divPanel: HTMLRadioButton
            });
            var RadioButtonBasicProperty = {

                RadioButtonText:["TestRadioButtonOne","TestRadioButtonTwo","TestRadioButtonThree"],
                RadioButtonValue:["TestOne","TestTwo","TestThree"],
                ItemNum:3,
                RadioButtonOutParameters:0,//选中元素位置
                RadioButtonTextField:"", //显示值列名
                RadioButtonValueField:"",//返回值列名
                EntityNum:3,
                ItemEditSelectNum:0,

                Alignment:"vertical", //"horizontal","vertical"排列方式
                RowHeight:"25",
                ColumnWidth:"200",
                LeftTopRadius:"0",//左上圆角
                LeftBottomRadius:"0",//左下圆角
                RightTopRadius:"0",//右上圆角
                RightBottomRadius:"0",//右下圆角
                BackgroundColor:"#f9f9f9",//背景颜色
                ButtonColor:"#dadcdb",//按钮颜色(填充渐变结束的颜色)
                BorderColor:null,//边框颜色
                CheckedBackgroundColor:"#d7d7d7",//选中背景颜色(填充渐变结束的颜色值)
                CheckedButtonColor:"#dedede"//选中按钮颜色(填充渐变结束的颜色值)

            };
            this.Set("RadioButtonBasicProperty", RadioButtonBasicProperty);

            var getRadioButtonProperty = this.Get("RadioButtonBasicProperty");
            var BaseControlObjHtml = '<div class="RadioButtonDiv">';
            if(getRadioButtonProperty.Alignment == "vertical"){
                BaseControlObjHtml = BaseControlObjHtml +'<table id="'+ID+'" class="radioButtonTable"><tbody id="radioButtonTbody">';

                for(var buttonId=0;buttonId<getRadioButtonProperty.ItemNum;buttonId++){
                 BaseControlObjHtml = BaseControlObjHtml + '<tr><td id="radioButtonTD_'+buttonId+'" class="radioButtonTD"><INPUT TYPE="radio" NAME="radio"  style="width:0px;" value="'+buttonId+'"/><div class="radioButtonDivBeforeSpan"></div><span id="radioButtonId_'+buttonId+'" class="radioButtonSpan">'+getRadioButtonProperty.RadioButtonText[buttonId]+
                     '</span></td></tr>';
                }

            }else{
                BaseControlObjHtml = BaseControlObjHtml +'<table id="'+ID+'" class="radioButtonTable_horizontal"><tbody id="radioButtonTbody">';
                BaseControlObjHtml = BaseControlObjHtml+"<tr class='RadioButtonHorizontalTR'>";
                for(var buttonId=0;buttonId<getRadioButtonProperty.ItemNum;buttonId++){
                    BaseControlObjHtml = BaseControlObjHtml + '<td id="radioButtonTD_'+buttonId+'" class="radioButtonTD_horizontal"><INPUT TYPE="radio" NAME="radio" style="width:0px;" value="'+buttonId+'"/><div class="radioButtonDivBeforeSpan"></div><span id="radioButtonId_'+buttonId+'"  class="radioButtonSpan">'+getRadioButtonProperty.RadioButtonText[buttonId]+
                        '</span></td>';
                }
                BaseControlObjHtml = BaseControlObjHtml+"</tr>";
            }
            BaseControlObjHtml = BaseControlObjHtml +'</tbody>'+'</table></div>';

            var BaseControlObj =$(BaseControlObjHtml);
            if(getRadioButtonProperty.Alignment == "vertical"){
                BaseControlObj.find('.radioButtonTD').css("height",getRadioButtonProperty.RowHeight);
                BaseControlObj.find('.radioButtonTD').css("width","auto");
            }else{
                BaseControlObj.find('.radioButtonTD_horizontal').css("width",getRadioButtonProperty.ColumnWidth);
                BaseControlObj.find('.radioButtonTD_horizontal').css("height","auto");
            }
//            BaseControlObj.find('.radioButtonTable').css("border-top-right-radius",getRadioButtonProperty.RightTopRadius);
//            BaseControlObj.find('.radioButtonTable').css("border-bottom-right-radius",getRadioButtonProperty.RightBottomRadius);
//            BaseControlObj.find('.radioButtonTable').css("border-bottom-left-radius",getRadioButtonProperty.LeftBottomRadius);
//            BaseControlObj.find('.radioButtonTable').css("border-top-left-radius",getRadioButtonProperty.LeftTopRadius);

            self.shell.initialControl(BaseControlObj[0]);
            self.Set("HTMLElement", this.shell.Container[0]);

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
            self.Set("ProPerty", ThisProPerty);
            self.Set("ThemeInfo", null);
            if (layoutManagement.property.type == 1) {
                HTMLRadioButton.width(250);
                HTMLRadioButton.height(150);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLRadioButton.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLRadioButton.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                ThisProPerty.BasciObj.removeClass("PanelSty");
                ThisProPerty.BasciObj.addClass("AutoFill_PanelSty");
                obj.html("");
            }
            if (_Target != null) {
                self.Render(_Target);
            }

            var StartPoint = { X: 0, Y: 0 };
            //撤销live
            var $UI = $('#' + self.shell.ID);

            $UI.live("mousedown", function (ev) {
                if (Agi.Edit) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

            $UI.live('dblclick', function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    if (Agi.Edit) {
                        Agi.Controls.ControlEdit(self); //控件编辑界面
                    }
                }
            });

            if (HTMLRadioButton.touchstart) {
                HTMLRadioButton.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            self.Set("Position", PostionValue);
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = null;

            $UI.css("border-top-right-radius",getRadioButtonProperty.RightTopRadius+"px");
            $UI.css("border-bottom-right-radius",getRadioButtonProperty.RightBottomRadius+"px");
            $UI.css("border-bottom-left-radius",getRadioButtonProperty.LeftBottomRadius+"px");
            $UI.css("border-top-left-radius",getRadioButtonProperty.LeftTopRadius+"px");
            $UI.find('.RadioButtonDiv').css("border-top-right-radius",getRadioButtonProperty.RightTopRadius+"px");
            $UI.find('.RadioButtonDiv').css("border-bottom-right-radius",getRadioButtonProperty.RightBottomRadius+"px");
            $UI.find('.RadioButtonDiv').css("border-bottom-left-radius",getRadioButtonProperty.LeftBottomRadius+"px");
            $UI.find('.RadioButtonDiv').css("border-top-left-radius",getRadioButtonProperty.LeftTopRadius+"px");
            $UI.find('.radioButtonTable').css("background-color",getRadioButtonProperty.BackgroundColor);
            $UI.find('.radioButtonTable_horizontal').css("background-color",getRadioButtonProperty.BackgroundColor);
            $UI.find('.Radio_TD_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#ededed),to("+getRadioButtonProperty.CheckedBackgroundColor+"))");
            $UI.find('.radioButtonDivBeforeSpan').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#c8cac9),to("+getRadioButtonProperty.ButtonColor+"))");
            $UI.find('.radioButtonDivBeforeSpan_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+getRadioButtonProperty.CheckedButtonColor+")) url('/agi/ISCAS_Test/code/JS/Controls/RadioButton/image/hook-radio.png') no-repeat 0px");

            if (Agi.Edit) {
                HTMLRadioButton.resizable({
                });
            }

            //输出参数
            var OutPramats={"CheckedText":getRadioButtonProperty.RadioButtonText[getRadioButtonProperty.RadioButtonOutParameters],"CheckedValue":getRadioButtonProperty.RadioButtonValue[getRadioButtonProperty.RadioButtonOutParameters]};
            this.Set("OutPramats",OutPramats);/*输出参数名称集合*/

            var ThisOutParats=[];
            if(OutPramats!=null){
                for(var item in OutPramats){
                    ThisOutParats.push({Name:item,Value:OutPramats[item]});
                }
            }

            Agi.Msg.PageOutPramats.AddPramats({
                "Type":Agi.Msg.Enum.Controls,
                "Key": ID,
                "ChangeValue":ThisOutParats
            });

            $UI.find(".radioButtonTD").each( function(i,el){
                var outPramats;
                $(el).click(function(){
                    var RadioButtonOutParametersNum = $(el).attr("id").slice(14,$(el).attr("id").length);
                    outPramats = {"CheckedText":getRadioButtonProperty.RadioButtonText[RadioButtonOutParametersNum],"CheckedValue":getRadioButtonProperty.RadioButtonValue[RadioButtonOutParametersNum]};
                    var itemRadioInput = $(el).find("input");
                    var itemDiv = $(el).find("div");
                    if (!itemRadioInput.is(':checked')) {
                        $UI.find(".radioButtonTD").each(function(j, ele) {
                            $(ele).find("div").removeClass("radioButtonDivBeforeSpan_Checked");
                            $(ele).removeClass("Radio_TD_Checked");
                        });
                        itemRadioInput[0].checked = true;
                        itemDiv.addClass("radioButtonDivBeforeSpan_Checked");
                        $(el).addClass("Radio_TD_Checked");
                        $UI.find('.Radio_TD_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#ededed),to("+getRadioButtonProperty.CheckedBackgroundColor+"))");
                        $UI.find('.radioButtonDivBeforeSpan_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+getRadioButtonProperty.CheckedButtonColor+")) url('/agi/ISCAS_Test/code/JS/Controls/RadioButton/image/hook-radio.png') no-repeat 0px");
//                        $UI.find('.radioButtonDivBeforeSpan_Checked').css("background-image","url('image/hook-radio.png') no-repeat 0px");
                    }
                    self.Set("OutPramats",outPramats);
                });
            });

            $UI.find(".radioButtonTD_horizontal").each( function(i,el){
                var outPramats;
                $(el).click(function(){
                    var RadioButtonOutParametersNum = $(el).attr("id").slice(14,$(el).attr("id").length);
                    outPramats = {"CheckedText":getRadioButtonProperty.RadioButtonText[RadioButtonOutParametersNum],"CheckedValue":getRadioButtonProperty.RadioButtonValue[RadioButtonOutParametersNum]};
                    var itemRadioInput = $(el).find("input");
                    var itemDiv = $(el).find("div");
                    if (!itemRadioInput.is(':checked')) {
                        $UI.find(".radioButtonTD_horizontal").each(function(j, ele) {
                            $(ele).find("div").removeClass("radioButtonDivBeforeSpan_Checked");
                            $(ele).removeClass("Radio_TD_Checked");
                        });
                        itemRadioInput[0].checked = true;
                        itemDiv.addClass("radioButtonDivBeforeSpan_Checked");
                        $(el).addClass("Radio_TD_Checked");
                        $UI.find('.Radio_TD_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#ededed),to("+getRadioButtonProperty.CheckedBackgroundColor+"))");
                        $UI.find('.radioButtonDivBeforeSpan_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+getRadioButtonProperty.CheckedButtonColor+")) url('/agi/ISCAS_Test/code/JS/Controls/RadioButton/image/hook-radio.png') no-repeat 0px");
//                        $UI.find('.radioButtonDivBeforeSpan_Checked').css("background-image","url('image/hook-radio.png') no-repeat 0px");
                    }
                    self.Set("OutPramats",outPramats);
                });
            });
        },

        Destory: function () {
            console.log("调用"+"Destory");
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/
//            Agi.Edit.workspace.controlList.remove(this);
            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中
            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },

        CustomProPanelShow: function () {
            Agi.Controls.RadioButtonProrityInit(this);
        },

//        Copy: function () {
//            console.log("调用"+"Copy");
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = this.shell.Container.parent();
//                var PostionValue = this.Get("Position");
//                var newRadioButtonPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewRadioButton = new Agi.Controls.RadioButton();
//                NewRadioButton.Init(ParentObj, newRadioButtonPositionpars);
//                newRadioButtonPositionpars = null;
//                return NewRadioButton;
//            }
//        },

        PostionChange: function (_Postion) {
            console.log("调用"+"PostionChange");
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                var _ThisPosition = {
                    Left: (_Postion.Left / PagePars.Width).toFixed(4),
                    Top: (_Postion.Top / PagePars.Height).toFixed(4),
                    Right: (_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
                };
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
                };
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }
        },

        HTMLElementSizeChanged: function () {
            console.log("调用"+"HTMLElementSizeChanged");
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
            } else {
                Me.Refresh();
            }
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.RadioButtonProrityInit(Me);
            }
        },

        Refresh: function () {
            console.log("调用"+"Refresh");
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
            this.Set("Position", this.Get("Position"));
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

        ControlAttributeChangeEvent: function (_RadioButtonobj, Key, _Value) {
            switch(Key){
                case"Position":
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
                case "RadioButtonBasicProperty":
                    debugger;
                    if (layoutManagement.property.type == 1) {
                       var $UI = $('#'+ this.shell.ID);
                       var tableID = _RadioButtonobj.Get("ProPerty").ID;

                        var BaseControlObjHtml = '<div class="RadioButtonDiv">';
                        if(_Value.Alignment == "vertical"){
                            BaseControlObjHtml = BaseControlObjHtml + '<table id="'+tableID+'" class="radioButtonTable"><tbody id="radioButtonTbody">';
                            for(var buttonId=0;buttonId<_Value.ItemNum;buttonId++){
                                BaseControlObjHtml = BaseControlObjHtml + '<tr><td id="radioButtonTD_'+buttonId+'" class="radioButtonTD"><INPUT TYPE="radio" NAME="radio"  style="width:0px;" value="'+buttonId+'"/><div class="radioButtonDivBeforeSpan"></div><span id="radioButtonId_'+buttonId+'" class="radioButtonSpan">'+_Value.RadioButtonText[buttonId]+
                                    '</span></td></tr>';
                            }
                        }else{
                            BaseControlObjHtml = BaseControlObjHtml +'<table id="'+tableID+'" class="radioButtonTable_horizontal"><tbody id="radioButtonTbody">';
                            BaseControlObjHtml = BaseControlObjHtml+"<tr class='RadioButtonHorizontalTR'>";
                            for(var buttonId=0;buttonId<_Value.ItemNum;buttonId++){
                                BaseControlObjHtml = BaseControlObjHtml + '<td id="radioButtonTD_'+buttonId+'" class="radioButtonTD_horizontal"><INPUT TYPE="radio" NAME="radio" style="width:0px;" value="'+buttonId+'"/><div class="radioButtonDivBeforeSpan"></div><span id="radioButtonId_'+buttonId+'"  class="radioButtonSpan">'+_Value.RadioButtonText[buttonId]+
                                    '</span></td>';
                            }
                            BaseControlObjHtml = BaseControlObjHtml+"</tr>";
                        }
                        BaseControlObjHtml = BaseControlObjHtml  +'</tbody>' + '</table></div>';

                        BaseControlObjHtml="<div class='selectPanelBodySty'>"+BaseControlObjHtml+"</div>";
                        $UI.find(".selectPanelBodySty").replaceWith(BaseControlObjHtml);

                        if(_Value.Alignment == "vertical"){
                            $UI.find('.radioButtonTD').css("height",_Value.RowHeight);
                            $UI.find('.radioButtonTD').css("width","auto");
                        }else{
                            $UI.find('.radioButtonTD').css("width",_Value.ColumnWidth);
                            $UI.find('.radioButtonTD').css("height","auto");
                        }

                        $UI.css("border-top-right-radius",_Value.RightTopRadius+"px");
                        $UI.css("border-bottom-right-radius",_Value.RightBottomRadius+"px");
                        $UI.css("border-bottom-left-radius",_Value.LeftBottomRadius+"px");
                        $UI.css("border-top-left-radius",_Value.LeftTopRadius+"px");
                        $UI.find('.RadioButtonDiv').css("border-top-right-radius",_Value.RightTopRadius+"px");
                        $UI.find('.RadioButtonDiv').css("border-bottom-right-radius",_Value.RightBottomRadius+"px");
                        $UI.find('.RadioButtonDiv').css("border-bottom-left-radius",_Value.LeftBottomRadius+"px");
                        $UI.find('.RadioButtonDiv').css("border-top-left-radius",_Value.LeftTopRadius+"px");
                        $UI.find('.radioButtonTable').css("background-color",_Value.BackgroundColor);
                        $UI.find('.radioButtonTable_horizontal').css("background-color",_Value.BackgroundColor);
                        $UI.find('.radioButtonDivBeforeSpan').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#c8cac9),to("+_Value.ButtonColor+"))");
                        $UI.find('.radioButtonDivBeforeSpan_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+_Value.CheckedButtonColor+")) url('/agi/ISCAS_Test/code/JS/Controls/RadioButton/image/hook-radio.png') no-repeat 0px");
//                        $UI.find('.radioButtonDivBeforeSpan_Checked').css("background-image","url('image/hook-radio.png') no-repeat 0px");

                        $UI.find(".radioButtonTD").each( function(i,el){
                            var Radio_TD_Checked = {
                                background:"-webkit-gradient(linear, 0 0, 0 100%, from(#ededed),to("+_Value.CheckedBackgroundColor+"))"
                            };
                            var radioButtonDivBeforeSpan_Checked={
                                "background":"-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+_Value.CheckedButtonColor+"))",
                                "background":"url('/agi/ISCAS_Test/code/JS/Controls/RadioButton/image/hook-radio.png') no-repeat 0px"
                            };

                            $(el).click(function(){
                                _Value.RadioButtonOutParameters = $(el).attr("id").slice(14,$(el).attr("id").length);
                                outPramats = {"CheckedText":_Value.RadioButtonText[_Value.RadioButtonOutParameters],"CheckedValue":_Value.RadioButtonValue[_Value.RadioButtonOutParameters]};
                                var itemRadioInput = $(el).find("input");
                                var itemDiv = $(el).find("div");
                                if (!itemRadioInput.is(':checked')) {
                                    $UI.find(".radioButtonTD").each(function(j, ele) {
//                                        $(ele).find("div").removeClass("radioButtonDivBeforeSpan_Checked");
//                                        $(ele).find("div").removeAttr("background-image");
                                        $(ele).find("div").attr("background","-webkit-gradient(linear, 0 0, 0 100%, from(#c8cac9),to("+_Value.ButtonColor+"))");
//                                        $(ele).removeClass("Radio_TD_Checked");
                                        $(ele).removeAttr("background");
//                                        $(ele).css();
                                    });
                                    itemRadioInput[0].checked = true;
                                    itemDiv.addClass("radioButtonDivBeforeSpan_Checked");
                                    $(el).addClass("Radio_TD_Checked");

                                    $UI.find('.Radio_TD_Checked').css(Radio_TD_Checked);
                                    $UI.find('.radioButtonDivBeforeSpan_Checked').css(radioButtonDivBeforeSpan_Checked);

                                }
                                _RadioButtonobj.Set("OutPramats",outPramats);
                            });
                        });
                        $UI.find(".radioButtonTD_horizontal").each( function(i,el){
                            var outPramats;
                            $(el).click(function(){
                                var RadioButtonOutParametersNum = $(el).attr("id").slice(14,$(el).attr("id").length);
                                outPramats = {"CheckedText":_Value.RadioButtonText[RadioButtonOutParametersNum],"CheckedValue":_Value.RadioButtonValue[RadioButtonOutParametersNum]};
                                var itemRadioInput = $(el).find("input");
                                var itemDiv = $(el).find("div");
                                if (!itemRadioInput.is(':checked')) {
                                    $UI.find(".radioButtonTD_horizontal").each(function(j, ele) {
                                        $(ele).find("div").removeClass("radioButtonDivBeforeSpan_Checked");
                                        $(ele).removeClass("Radio_TD_Checked");
                                    });
                                    itemRadioInput[0].checked = true;
                                    itemDiv.addClass("radioButtonDivBeforeSpan_Checked");
                                    $(el).addClass("Radio_TD_Checked");
                                    $UI.find('.Radio_TD_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#ededed),to("+_Value.CheckedBackgroundColor+"))");
                                    $UI.find('.radioButtonDivBeforeSpan_Checked').css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+getRadioButtonProperty.CheckedButtonColor+")) url('/agi/ISCAS_Test/code/JS/Controls/RadioButton/image/hook-radio.png') no-repeat 0px");
//                        $UI.find('.radioButtonDivBeforeSpan_Checked').css("background-image","url('image/hook-radio.png') no-repeat 0px");
                                }
                                self.Set("OutPramats",outPramats);
                            });
                        });
                    }
                    break;
                case "OutPramats":
                {
                    var OutPramats={"CheckedText":_Value.CheckedText,"CheckedValue":_Value.CheckedValue};
                    var ThisOutParats=[];
                    if(OutPramats!=null){
                        for(var item in OutPramats){
                            ThisOutParats.push({Name:item,Value:OutPramats[item]});
                        }
                    }

                    Agi.Msg.PageOutPramats.PramatsChange({
                        "Type":Agi.Msg.Enum.Controls,
                        "Key": ThisProPerty.ID,
                        "ChangeValue":ThisOutParats
                    });

                    Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_RadioButtonobj,"Type":Agi.Msg.Enum.Controls});

                } break;
                case "Entity"://实体
                {
                    var entity = _RadioButtonobj.Get('Entity');
                    if(entity&&entity.length){
                        BindDataByEntity(_RadioButtonobj,entity[0]);
                    }else{
                        var radioButtonBasicProperty = _RadioButtonobj.Get('RadioButtonBasicProperty');
                        for(var i= 0;i<radioButtonBasicProperty.ItemNum;i++){
                            $UI.find('#radioButtonId_'+i).text('');
                        }
                    }
                }break;
            }//end switch

            function BindDataByEntity(controlObj,et){

                var $UI = $('#'+ controlObj.shell.ID);
                var getRadioButtonProperty = controlObj.Get("RadioButtonBasicProperty");
                Agi.Utility.RequestData2(et,function(d){

                    var data = d.Data.length ? d.Data : [];
                    var columns = d.Columns;
                    et.Data = data;
                    et.Columns = d.Columns;

                    var textField = getRadioButtonProperty && getRadioButtonProperty.RadioButtonTextField?getRadioButtonProperty.RadioButtonTextField:columns[0];
                    var valueField = getRadioButtonProperty && getRadioButtonProperty.RadioButtonValueField?getRadioButtonProperty.RadioButtonValueField:columns[0];

                    if(getRadioButtonProperty.RadioButtonTextField == ""){
                        getRadioButtonProperty.RadioButtonTextField = textField
                    }
                    if(getRadioButtonProperty.RadioButtonValueField == ""){
                        getRadioButtonProperty.RadioButtonValueField = valueField;
                    }

                    getRadioButtonProperty.ItemNum = data.length;
                    getRadioButtonProperty.EntityNum = data.length;
                    //修改列
                    if(controlObj.IsChangeEntity){
                        getRadioButtonProperty.RadioButtonText = [];
                        getRadioButtonProperty.RadioButtonValue = [];
                        $(d.Data).each(function(i,el){
                            getRadioButtonProperty.RadioButtonText[i] = el[textField];
                            getRadioButtonProperty.RadioButtonValue[i] = el[valueField];
                            $UI.find("#radioButtonId_"+i).text(getRadioButtonProperty.RadioButtonText[i]);
                        });
                        controlObj.IsChangeEntity = false;
                    }
                    controlObj.Set("RadioButtonBasicProperty",getRadioButtonProperty);

                });

            }
        },

        GetConfig: function () {
            console.log("调用"+"GetConfig");
            var ProPerty = this.Get("ProPerty");
            var RadioButtonContorl = {
                Control:{
                    ControlType:null,//控件类型
                    ControlID:null, //控件ID
                    ControlBaseObj:null,//控件对象
                    HTMLElement:null,//控件的外壳HTML元素信息
                    Entity:null, // 实体
                    Position:null,// 控件位置信息
                    RadioButtonBasicProperty:null,//控件属性
                    ThemeName:null
//                    ThemeInfo:null
                }
            };// 配置信息数组对象
            RadioButtonContorl.Control.ControlType = this.Get("ControlType");
            RadioButtonContorl.Control.ControlID = ProPerty.ID;
            RadioButtonContorl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            RadioButtonContorl.Control.HTMLElement= ProPerty.BasciObj[0].id;
//            RadioButtonContorl.Control.ControlBaseObj = ProPerty.ID;
//            RadioButtonContorl.Control.HTMLElement= this.Get("HTMLElement").id;
            RadioButtonContorl.Control.Entity = this.Get("Entity");
            RadioButtonContorl.Control.Position = this.Get("Position");
            RadioButtonContorl.Control.RadioButtonBasicProperty =this.Get("RadioButtonBasicProperty");
            RadioButtonContorl.Control.ThemeName = this.Get("ThemeName");
//            RadioButtonContorl.Control.ThemeInfo = this.Get("ThemeInfo");
            return  RadioButtonContorl.Control; //返回配置字符串
        }, //获得RadioButton控件的配置信息

        CreateControl:function(_Config, _Target){
            console.log("调用"+"CreateControl");
            this.Init(_Target,_Config.Position,_Config.HTMLElement);
            if(_Config!=null){
                var radioButtonBasicProperty = null;
                if(_Target!=null && _Target!=""){
                    var _Targetobj=$(_Target);
                    if (typeof (_Config.Entity) == "string") {
                        _Config.Entity = JSON.parse(_Config.Entity);
                    }
                    if (typeof (_Config.Position) == "string") {
                        _Config.Position = JSON.parse(_Config.Position);
                    }
                    this.Set("Position",_Config.Position);
//                    _Config.ThemeInfo = _Config.ThemeInfo;
                    radioButtonBasicProperty = _Config.RadioButtonBasicProperty;
                    debugger;
                    this.Set("RadioButtonBasicProperty",radioButtonBasicProperty);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id',_Config.ControlID);
                    var $UI = $('#'+ this.shell.ID);
                    if(radioButtonBasicProperty.RadioButtonText.length != 0){
                        $(radioButtonBasicProperty.RadioButtonText).each(function(i,el){
                            $UI.find('#radioButtonId_'+i).text(el);
                        });
                    }

                    var PagePars={Width:_Targetobj.width(),Height:_Targetobj.height()};
                    _Config.Position.Left=parseFloat(_Config.Position.Left);
                    _Config.Position.Right=parseFloat(_Config.Position.Right);
                    _Config.Position.Top=parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom=parseFloat(_Config.Position.Bottom);

                    var ThisControlPars={Width:parseInt(PagePars.Width-(PagePars.Width*(_Config.Position.Left+_Config.Position.Right))),
                        Height:parseInt(PagePars.Height-(PagePars.Height*(_Config.Position.Top+_Config.Position.Bottom)))};
                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left',(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    this.shell.Container.css('top',(parseInt(_Config.Position.Top*PagePars.Height))+"px");
                    this.Set("Entity",_Config.Entity);
                    this.ChangeTheme(_Config.ThemeName);
                }
            }

        },//根据配置信息创建控件

        ChangeTheme:function(_themeName){
            var Me=this;
            //1.根据当前控件类型和样式名称获取样式信息
            var RadioButtonStyleValue=Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"),_themeName);
            //2.保存主题
            Me.Set("ThemeName",_themeName);
            //3.应用当前控件的信息
            Agi.Controls.RadioButton.OptionsAppSty(RadioButtonStyleValue,Me);
        }//更改控件样式
    }, true);

/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */
Agi.Controls.RadioButton.OptionsAppSty=function(_StyConfig,radioButton){
    if(_StyConfig !=null){

        var radioButtonBasicProperty = radioButton.Get('RadioButtonBasicProperty');
        radioButtonBasicProperty.Alignment = _StyConfig.Alignment;
        radioButtonBasicProperty.RowHeight = _StyConfig.RowHeight;
        radioButtonBasicProperty.ColumnWidth = _StyConfig.ColumnWidth;
        radioButtonBasicProperty.LeftTopRadius = _StyConfig.LeftTopRadius;
        radioButtonBasicProperty.RightTopRadius = _StyConfig.RightTopRadius;
        radioButtonBasicProperty.LeftBottomRadius = _StyConfig.LeftBottomRadius;
        radioButtonBasicProperty.RightBottomRadius = _StyConfig.RightBottomRadius;
        radioButtonBasicProperty.BackgroundColor = _StyConfig.BackgroundColor;
        radioButtonBasicProperty.ButtonColor = _StyConfig.ButtonColor;
        radioButtonBasicProperty.BorderColor = _StyConfig.BorderColor;
        radioButtonBasicProperty.CheckedBackgroundColor = _StyConfig.CheckedBackgroundColor;
        radioButtonBasicProperty.CheckedButtonColor = _StyConfig.CheckedButtonColor;
        radioButton.Set('RadioButtonBasicProperty',radioButtonBasicProperty);

    }
};

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitRadioButton = function () {
    return new Agi.Controls.RadioButton();
};
Agi.Controls.RadioButtonProrityInit=function(_RadioButtonControl){

    var radioButtonBasicProperty = _RadioButtonControl.Get('RadioButtonBasicProperty');
    var ThisProItems=[];

    //绑定配置的代码
    var bindHTML=new Agi.Script.StringBuilder();
    bindHTML.append('<form class="form-horizontal"><table class="prortityBindTable"><tbody>');

    bindHTML.append('<tr>');
    bindHTML.append('<td class="prortityBindLabel">显示值:</td><td class="prortityBindSelect"><select id="selectText"  data-field="显示值" placeholder="" class="input"></select></td>');
    bindHTML.append('</tr>');
    bindHTML.append('<tr>');
    bindHTML.append('<td class="prortityBindLabel">选择值:</td><td class="prortityBindSelect"><select id="selectValue" data-field="选择值" placeholder="" class="input"></select></td>');
    bindHTML.append('</tr>');

    bindHTML.append('</tbody></table></form>');
    var BindObj = $(bindHTML.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"绑定配置",DisabledValue:1,ContentObj:BindObj}));

    var basicHTML = new Agi.Script.StringBuilder();
    basicHTML.append("<div class='BasicChart_Pro_Panel'>");
    basicHTML.append("<table class='prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>排列方式:</td><td class='prortityPanelTabletd1'><select id='AligmentSelect'  data-field='Item排列方式' placeholder='' class='input'><option value='vertical'>纵向</option><option value='horizontal'>横向</option></select></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>边框颜色:</td><td class='prortityPanelTabletd2'><input type='text' id='FilterBorderColor' /></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>列宽:</td><td class='prortityPanelTabletd1'><input id='ColumnWidth' type='number' value='"+radioButtonBasicProperty.ColumnWidth+"' min='0'/></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>行高</td><td class='prortityPanelTabletd1'><input id='RowHeight' type='number' value='"+radioButtonBasicProperty.RowHeight+"' min='0'/></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>左上角半径:</td><td class='prortityPanelTabletd1'><input id='LeftFillet1' type='number' value='"+radioButtonBasicProperty.LeftTopRadius+"' min='0' max='100'/></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>右上角半径</td><td class='prortityPanelTabletd1'><input id='RightFillet1' type='number' value='"+radioButtonBasicProperty.RightTopRadius+"' min='0' max='100'/></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>左下角半径:</td><td class='prortityPanelTabletd1'><input id='LeftFillet2' type='number' value='"+radioButtonBasicProperty.LeftBottomRadius+"' min='0' max='100'/></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>右下角半径:</td><td class='prortityPanelTabletd1'><input id='RightFillet2' type='number' value='"+radioButtonBasicProperty.RightBottomRadius+"' min='0' max='100'/></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>背景颜色:</td><td class='prortityPanelTabletd2'><input id='FilterBgColor' type='text' class='basic input-mini' ></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>选中项背景颜色:</td><td class='prortityPanelTabletd2'><input id='CheckedBgColor' type='text' class='basic input-mini' ></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>按钮颜色:</td><td class='prortityPanelTabletd2'><input id='ButtonBgColor' type='text' class='basic input-mini' ></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>选中项按钮颜色:</td><td class='prortityPanelTabletd2'><input id='CheckedButtonBgColor' type='text' class='basic input-mini' ></td>");
    basicHTML.append("</tr>");
    basicHTML.append("</table>");
    basicHTML.append("</div>");
    var FilletObj = $(basicHTML.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));

    //元素管理
    var itemEdit = new Agi.Script.StringBuilder();

    itemEdit.append("<div class='prortityPanelRadioButtonManagmentDiv'>");

        itemEdit.append("<div class='prortityPanelRadioButtonTextDiv' >");
          itemEdit.append("<table class='prortityPanelRadioButtonTextTable'>");
             for(var i=0; i<radioButtonBasicProperty.ItemNum;i++){
                 itemEdit.append("<tr class='prortityPanelRadioButtonTextTR' id='prortityPanelRadioButtonTextTR_"+i+"'>");
                 itemEdit.append("<td class='prortityPanelRadioButtonTextTD'>"+radioButtonBasicProperty.RadioButtonText[i]+"</td>");
                 itemEdit.append("</tr>");
             }
          itemEdit.append("</table>");
        itemEdit.append("</div>");

        itemEdit.append("<div class='prortityPanelRadioButtonItemManagmentDiv'>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<label class='prortityPanelRadioButtonManagmentLabel'>选项信息:</label>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<label>显示值:</label>");
            itemEdit.append("<input type='text' class='InputText' id='textFieldChanged' placeholder='显示值'/>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<label>选择值:</label>");
            itemEdit.append("<input type='text' class='InputText' id='valueFieldChanged' placeholder='选择值'/>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<input type='button' class='InputButton' id='DeleteItemButton' value='删除选项'/>");
            itemEdit.append("<input type='button' class='InputButton' id='SaveChangeButton' value='保存修改'/>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<hr class='prortityPanelRadioButtonManagmentDivUnitHr'/>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<label class='prortityPanelRadioButtonManagmentLabel'>选项信息:</label>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<label>显示值:</label>");
            itemEdit.append("<input type='text' class='InputText' id='textFieldAdded' placeholder='显示值'/>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<label>选择值:</label>");
            itemEdit.append("<input type='text' class='InputText' id='valueFieldAdded' placeholder='选择值'/>");
            itemEdit.append("</div>");

            itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
            itemEdit.append("<input type='button' class='InputButtonAdd' id='AddItemButton' value='添  加'/>");
            itemEdit.append("</div>");

        itemEdit.append("</div>");

    itemEdit.append("</div>");

    var ItemEditObj = $(itemEdit.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "选项管理", DisabledValue: 1, ContentObj: ItemEditObj }));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //4.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {};

    var entity = _RadioButtonControl.Get('Entity');
    var textOptions = null;
    if(entity.length){
        if(entity[0].Columns){
            textOptions="";
            $(entity[0].Columns).each(function(i,col){

                if(radioButtonBasicProperty.RadioButtonTextField == col ){
                    textOptions += '<option value="'+col+'" selected="true">'+col+'</option>';
                }else{
                    textOptions += '<option value="'+col+'">'+col+'</option>';
                }
            });
        }
    }
    var valueOptions = null;
    if(entity.length){
        if(entity[0].Columns){
            valueOptions="";
            $(entity[0].Columns).each(function(i,col){

                if(radioButtonBasicProperty.RadioButtonValueField == col ){
                    valueOptions += '<option value="'+col+'" selected="true">'+col+'</option>';
                }else{
                    valueOptions += '<option value="'+col+'">'+col+'</option>';
                }
            });
        }
    }

    $(".prortityBindTable").find('#selectText').append($(textOptions)).bind('change',{sels:$(".prortityBindTable").find('#selectText')},function(e){
        $(e.data.sels).each(function(i,sel){

                radioButtonBasicProperty.RadioButtonTextField = $(sel).val();
                $(sel).val(radioButtonBasicProperty.RadioButtonTextField);
                Agi.Utility.RequestData2(entity[0],function(d){
                    var data = d.Data.length ? d.Data : [];
                    entity[0].Data = data;
                    $(data).each(function(i,dd){
                        radioButtonBasicProperty.RadioButtonText[i]=dd[radioButtonBasicProperty.RadioButtonTextField];
                        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
                        RefreshItemManagementDiv(radioButtonBasicProperty,_RadioButtonControl);
                    });});

        });
    });

    $(".prortityBindTable").find('#selectValue').append($(valueOptions)).bind('change',{sels:$(".prortityBindTable").find('#selectValue')},function(e){
        $(e.data.sels).each(function(i,sel){

                radioButtonBasicProperty.RadioButtonValueField = $(sel).val();
                $(sel).val(radioButtonBasicProperty.RadioButtonValueField);
                Agi.Utility.RequestData2(entity[0],function(d){
                    var data = d.Data.length ? d.Data : [];
                    et.Data = data;
                    $(data).each(function(i,dd){
                        radioButtonBasicProperty.RadioButtonValue[i]=dd[radioButtonBasicProperty.RadioButtonValueField];
                        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
                        RefreshItemManagementDiv(radioButtonBasicProperty,_RadioButtonControl);
                    }); });
             });
    });

    $(".prortityPanelRadioButtonTextTR").each( function(i,el){
        $(el).click(function(){
            radioButtonBasicProperty.ItemEditSelectNum = $(el).attr("id").slice(31,$(el).attr("id").length);
            $(".prortityPanelRadioButtonTextTR").each(function(j, ele) {
                    $(ele).removeClass("prortityPanelRadioButtonTextTR_checked");
                });
            $(el).addClass("prortityPanelRadioButtonTextTR_checked");
            $('#textFieldChanged').val(radioButtonBasicProperty.RadioButtonText[radioButtonBasicProperty.ItemEditSelectNum]);
            $('#valueFieldChanged').val(radioButtonBasicProperty.RadioButtonValue[radioButtonBasicProperty.ItemEditSelectNum]);
            if(radioButtonBasicProperty.ItemEditSelectNum <radioButtonBasicProperty.EntityNum){
                $('#textFieldChanged').attr("disabled",true);
                $('#valueFieldChanged').attr("disabled",true);
                $('#SaveChangeButton').hide();
            }else{
                $('#textFieldChanged').attr("disabled",false);
                $('#valueFieldChanged').attr("disabled",false);
                $('#SaveChangeButton').show();
            }
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
        });
    });

    $("#AligmentSelect").find("option").each(function(){
        if(this.value == radioButtonBasicProperty.Alignment){
            this.selected = true;
        }
    });

    $("#AligmentSelect").change(function(){
        debugger;
        radioButtonBasicProperty.Alignment =$("#AligmentSelect").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    });

    $("#RowHeight").change(function(){
        radioButtonBasicProperty.RowHeight =$("#RowHeight").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    });

    $("#ColumnWidth").change(function(){
        radioButtonBasicProperty.RowHeight =$("#ColumnWidth").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    });

    $("#LeftFillet1").change(function () {
        radioButtonBasicProperty.LeftTopRadius =$("#LeftFillet1").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    });

    $("#RightFillet1").change(function () {
        radioButtonBasicProperty.RightTopRadius =$("#RightFillet1").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    });

    $("#LeftFillet2").change(function () {
        radioButtonBasicProperty.LeftBottomRadius =$("#LeftFillet2").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    });

    $("#RightFillet2").change(function () {
        radioButtonBasicProperty.RightBottomRadius =$("#RightFillet2").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    });

    $("#ButtonBgColor").spectrum({
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
            debugger;
            $("#ButtonBgColor").val(color.toHexString());
            radioButtonBasicProperty.ButtonColor =color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
        }
    });

    $("#CheckedButtonBgColor").spectrum({
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
            $("#CheckedBgColor").val(color.toHexString());
            radioButtonBasicProperty.CheckedButtonColor =color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
        }
    });

    $("#CheckedBgColor").spectrum({
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
            $("#CheckedBgColor").val(color.toHexString());
            radioButtonBasicProperty.CheckedBackgroundColor =color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
        }
    });

    $("#FilterBgColor").spectrum({
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
            $("#FilterBgColor").val(color.toHexString());
            radioButtonBasicProperty.BackgroundColor =color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
        }
    });

    $("#FilterBorderColor").spectrum({
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
            debugger;
            $("#FilterBorderColor").val(color.toHexString());

        }
    });

    $("#AddItemButton").click(function(){
        if($("#textFieldAdded").val() ==""){
            AgiCommonDialogBox.Alert("请输入显示值！");
        }else if($("#valueFieldAdded").val() == ""){
            AgiCommonDialogBox.Alert("请输入返回值！");
        }else{
             radioButtonBasicProperty.ItemNum +=1;
             radioButtonBasicProperty.RadioButtonText.push($("#textFieldAdded").val());
             radioButtonBasicProperty.RadioButtonValue.push($("#valueFieldAdded").val());
             radioButtonBasicProperty.ItemEditSelectNum = "";
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
             RefreshItemManagementDiv(radioButtonBasicProperty,_RadioButtonControl);
            $("#textFieldAdded").val("") ;
            $("#valueFieldAdded").val("");
        }
    });

    $('#SaveChangeButton').click(function(){
        if($("#textFieldChanged").val() ==""){
            alert("请输入显示值！");
        }else if($("#valueFieldChanged").val() == ""){
            alert("请输入返回值！");
        }else if(radioButtonBasicProperty.ItemEditSelectNum == ""){
            alert("请选择元素！");
        }else{
            radioButtonBasicProperty.RadioButtonText[radioButtonBasicProperty.ItemEditSelectNum]=$("#textFieldChanged").val();
            radioButtonBasicProperty.RadioButtonValue[radioButtonBasicProperty.ItemEditSelectNum]=$("#valueFieldChanged").val();
            radioButtonBasicProperty.ItemEditSelectNum = "";
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
            RefreshItemManagementDiv(radioButtonBasicProperty,_RadioButtonControl);
            $("#textFieldChanged").val("") ;
            $("#valueFieldChanged").val("");
        }
    });

    $('#DeleteItemButton').click(function(){
        if(radioButtonBasicProperty.ItemEditSelectNum == ""){
            alert("请选择元素！");
        }else{
            if(radioButtonBasicProperty.ItemEditSelectNum <radioButtonBasicProperty.EntityNum){
                radioButtonBasicProperty.EntityNum -= 1;
            }
            radioButtonBasicProperty.ItemNum -=1;
            radioButtonBasicProperty.RadioButtonText.splice(radioButtonBasicProperty.ItemEditSelectNum,1);
            radioButtonBasicProperty.RadioButtonValue.splice(radioButtonBasicProperty.ItemEditSelectNum,1);
            radioButtonBasicProperty.ItemEditSelectNum = "";
            _RadioButtonControl.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
            RefreshItemManagementDiv(radioButtonBasicProperty,_RadioButtonControl);
            $("#textFieldChanged").val("") ;
            $("#valueFieldChanged").val("");
        }
    });
};

function RefreshItemManagementDiv(_radioButtonProperty,_RadioButtonControl){
    var refreshItemEdit = new Agi.Script.StringBuilder();
    refreshItemEdit.append("<div class='prortityPanelRadioButtonTextDiv' >");
    refreshItemEdit.append("<table class='prortityPanelRadioButtonTextTable'>");
    for(var i=0; i<_radioButtonProperty.ItemNum;i++){
        refreshItemEdit.append("<tr class='prortityPanelRadioButtonTextTR' id='prortityPanelRadioButtonTextTR_"+i+"'>");
        refreshItemEdit.append("<td class='prortityPanelRadioButtonTextTD'>"+_radioButtonProperty.RadioButtonText[i]+"</td>");
        refreshItemEdit.append("</tr>");
    }
    refreshItemEdit.append("</table>");
    refreshItemEdit.append("</div>");
    $('.prortityPanelRadioButtonTextDiv').replaceWith(refreshItemEdit.toString());
    $(".prortityPanelRadioButtonTextTR").each( function(i,el){
        $(el).click(function(){
            _radioButtonProperty.ItemEditSelectNum= $(el).attr("id").slice(31,$(el).attr("id").length);
            _RadioButtonControl.Set('RadioButtonBasicProperty',_radioButtonProperty);
            $(".prortityPanelRadioButtonTextTR").each(function(j, ele) {
                $(ele).removeClass("prortityPanelRadioButtonTextTR_checked");
            });
            $(el).addClass("prortityPanelRadioButtonTextTR_checked");
            $('#textFieldChanged').val(_radioButtonProperty.RadioButtonText[_radioButtonProperty.ItemEditSelectNum]);
            $('#valueFieldChanged').val(_radioButtonProperty.RadioButtonValue[_radioButtonProperty.ItemEditSelectNum]);
            if(_radioButtonProperty.ItemEditSelectNum <_radioButtonProperty.EntityNum){
                $('#textFieldChanged').attr("disabled",true);
                $('#valueFieldChanged').attr("disabled",true);
//                $('#SaveChangeButton').attr("display","none");
                $('#SaveChangeButton').hide();
            }else{
                $('#textFieldChanged').attr("disabled",false);
                $('#valueFieldChanged').attr("disabled",false);
                $('#SaveChangeButton').show();
//                $('#SaveChangeButton').attr("display","block");
            }

        });

    });
}
