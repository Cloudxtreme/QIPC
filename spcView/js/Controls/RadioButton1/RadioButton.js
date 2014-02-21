/**
 * Created with JetBrains WebStorm.
 * User: zsj
 * Date: 2013年3月18日
 * Time: 14:02:00
 * To change this template use File | Settings | File Templates.
 * RadioButton 单选按钮
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/

Agi.Controls.RadioButton = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,{
    Render: function (_Target) {
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
        var self = this;
        var radioButtonBasicProperty=self.Get("RadioButtonBasicProperty");
        if(radioButtonBasicProperty.DataType == "UserDefined"){
            /*if(!self.IsEditState){
             radioButtonBasicProperty.DataType = "Entity";
             }*/
            AgiCommonDialogBox.Confirm("若添加实体数据将清空自定义数据，是否切换？", null, function (flag) {
                if(flag){
                    // self.IsUserDefined=false;
                    radioButtonBasicProperty.DataType = "Entity";
                    radioButtonBasicProperty.RadioButtonTextField = "";
                    radioButtonBasicProperty.RadioButtonValueField = "";
                    self.Set("RadioButtonBasicProperty",radioButtonBasicProperty);
                    self.IsChangeEntity = true;
                    var entity = self.Get("Entity");
                    entity = [];
                    entity.push(et);
                    self.Set("Entity", entity);
                }
            });
            /*
             if(!confirm("若添加实体数据将清空自定义数据，是否切换？")){
             return;
             }
             */
        }else{
            //self.IsUserDefined=false;
            radioButtonBasicProperty.DataType = "Entity";
            radioButtonBasicProperty.RadioButtonTextField = "";
            radioButtonBasicProperty.RadioButtonValueField = "";
            self.Set("RadioButtonBasicProperty",radioButtonBasicProperty);
            self.IsChangeEntity = true;
            var entity = self.Get("Entity");
            entity = [];
            entity.push(et);
            self.Set("Entity", entity);
        }
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

    },//拖动列到option

    Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
        var self = this;
        self.AttributeList = [];
        self.Set("Entity", []);
        self.Set("ControlType", "RadioButton");
        var ID = savedId ? savedId : "RadioButton" + Agi.Script.CreateControlGUID();
        var HTMLRadioButton = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty RadioButtonPanelSty' style='padding-bottom:15px;'></div>");
        self.shell = new Agi.Controls.Shell({
            ID: ID,
            width: 250,
            height:150,
            divPanel: HTMLRadioButton
        });
        // self.IsUserDefined=true;
        var RadioButtonBasicProperty = {

            RadioButtonText:["radio0","radio1","radio2"],
            RadioButtonValue:["0","1","2"],
            ItemNum:3,
            RadioButtonOutParameters:0,//选中元素位置
            RadioButtonTextField:"", //显示值列名
            RadioButtonValueField:"",//返回值列名
            DataType:"UserDefined",//自定义：UserDefined,数据实体:"Entity"
            EntityNum:3,
            SelectedRadio:-1,
            ItemEditSelectNum:0,
            ShowCounts:5,
            Alignment:"vertical", //"horizontal","vertical"排列方式
            RowHeight:"25",        //保存拖拽和手动设置的值
            MinRowHeight:"25",    //只保存手动设置的值，主要用于配置后返回整体页面的最小值参考
            ColumnWidth:"250",
            MinColumnWidth:"100",
            BackgroundColor:{value:{background:"#f9f9f9"}},//背景颜色
            ButtonColor:"#dadcdb",//按钮颜色(填充渐变结束的颜色)
            FontColor:"#000",
            FontFamily:["微软雅黑","宋体","黑体","楷体_GB2312","Arial","Times New Roman"],
            FontIndex:0,
            BorderColor:"#9f9f9f",//边框颜色
            CheckedBackgroundColor:{value:{background:"-webkit-gradient(linear,left top,left bottom,color-stop(0, rgb(237,237,237)),color-stop(1, rgb(215,215,215)))"}},//选中背景颜色(填充渐变结束的颜色值)
            CheckedButtonColor:"#dedede"//选中按钮颜色(填充渐变结束的颜色值)
        };
        this.Set("RadioButtonBasicProperty", RadioButtonBasicProperty);
        var getRadioButtonProperty = this.Get("RadioButtonBasicProperty");
        var BaseControlObjHtml = '<div id="'+ID+'" class="RadioButtonDiv">';
        var showCount=getRadioButtonProperty.ItemNum>getRadioButtonProperty.ShowCounts?getRadioButtonProperty.ShowCounts:getRadioButtonProperty.ItemNum;
        if(getRadioButtonProperty.Alignment == "vertical"){
            BaseControlObjHtml = BaseControlObjHtml +'<table class="radioButtonTable">';

            for(var buttonId=0;buttonId<showCount;buttonId++){
                BaseControlObjHtml = BaseControlObjHtml + '<tr><td alt="'+buttonId+'" class="radioButtonTD"><input type="radio" name="radio" style="width: 0px;" value="'+buttonId+'"/><div class="radioUnChecked"></div><span class="radioButtonSpan">'+getRadioButtonProperty.RadioButtonText[buttonId]+ '</span></td></tr>';
            }

        }else{
            BaseControlObjHtml = BaseControlObjHtml +'<table class="radioButtonTable_horizontal">';
            BaseControlObjHtml = BaseControlObjHtml+"<tr class='RadioButtonHorizontalTR'>";
            for(var buttonId=0;buttonId<showCount;buttonId++){
                BaseControlObjHtml = BaseControlObjHtml + '<td alt="'+buttonId+'" class="radioButtonTD_horizontal"><input type="radio" name="radio" style="width: 0px;" value="'+buttonId+'"/><div class="radioUnChecked"></div><span class="radioButtonSpan">'+getRadioButtonProperty.RadioButtonText[buttonId]+ '</span></td>';
            }
            BaseControlObjHtml = BaseControlObjHtml+"</tr>";
        }
        BaseControlObjHtml = BaseControlObjHtml +'</table></div>';
        var BaseControlObj =$(BaseControlObjHtml);
        if(getRadioButtonProperty.Alignment == "vertical"){
            BaseControlObj.find('.radioButtonTD').css("height",RadioButtonBasicProperty.RowHeight);
            BaseControlObj.find('.radioButtonTD').css("width",RadioButtonBasicProperty.ColumnWidth);
            BaseControlObj.find(".radioButtonTable").css("height","auto");
            BaseControlObj.find(".radioButtonTable").css("width",RadioButtonBasicProperty.ColumnWidth);
            BaseControlObj.css({"min-width":(parseInt(RadioButtonBasicProperty.MinColumnWidth)+2),"min-height":(parseInt(RadioButtonBasicProperty.MinRowHeight)*2+3),"max-width":802,"max-height":(101*showCount+1)});
        }else{
            BaseControlObj.find('.radioButtonTD_horizontal').css("width",RadioButtonBasicProperty.ColumnWidth);
            BaseControlObj.find('.radioButtonTD_horizontal').css("height",RadioButtonBasicProperty.RowHeight);
            BaseControlObj.find(".radioButtonTable_horizontal").css("height",RadioButtonBasicProperty.RowHeight);
            BaseControlObj.find(".radioButtonTable_horizontal").css("width","auto");
            BaseControlObj.css({"min-width":(parseInt(RadioButtonBasicProperty.MinColumnWidth)+2),"min-height":(parseInt(RadioButtonBasicProperty.MinRowHeight)+2),"max-width":((801)*showCount+1),"max-height":102});
        }

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
            HTMLRadioButton.width(252);
            HTMLRadioButton.height(79);
            PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
            PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
            PostionValue.Right = ((PagePars.Width - HTMLRadioButton.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
            PostionValue.Bottom = ((PagePars.Height - HTMLRadioButton.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
        } else {
            ThisProPerty.BasciObj.removeClass("selectPanelSty");
            ThisProPerty.BasciObj.addClass("selectAutoFill_PanelSty");
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
            Agi.Controls.RadioButtonClickManager({ "ControlObj": self });
            /*
             if (!Agi.Controls.IsControlEdit) {
             if (Agi.Edit) {
             Agi.Controls.ControlEdit(self); //控件编辑界面
             }
             }
             */
        });
        self.Set("Position", PostionValue);
        //输出参数,无
        obj = ThisProPerty = PagePars = PostionValue = null;

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

        $UI.find(".radioButtonTD").each(function(){
            if(getRadioButtonProperty.SelectedRadio==$(this).attr("alt")){
                $(this).addClass("radioButtonTDChecked").css(getRadioButtonProperty.CheckedBackgroundColor.value).parent().siblings().children().removeClass("radioButtonTDChecked").css(getRadioButtonProperty.BackgroundColor.value);
                $(this).find(".radioUnChecked").attr("class","radioChecked").css("background",getRadioButtonProperty.CheckedButtonColor+" url('JS/Controls/RadioButton1/img/hook-radio.png') no-repeat center center");
                $(this).parent().siblings().find(".radioChecked").attr("class","radioUnChecked").css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+getRadioButtonProperty.ButtonColor+"))");
            }
            var outPramats;
            $(this).bind('click touchstart',function(){
                var RadioButtonOutParametersNum = $(this).attr("alt");
                getRadioButtonProperty.SelectedRadio=$(this).attr("alt");
                outPramats = {"CheckedText":getRadioButtonProperty.RadioButtonText[getRadioButtonProperty.RadioButtonOutParameters],"CheckedValue":getRadioButtonProperty.RadioButtonValue[RadioButtonOutParametersNum]};
                $(this).addClass("radioButtonTDChecked").parent().siblings().children().removeClass("radioButtonTDChecked");
                $(this).find(".radioUnChecked").attr("class","radioChecked");
                $(this).parent().siblings().find(".radioChecked").attr("class","radioUnChecked");
                self.Set("OutPramats",outPramats);
                self.Set('RadioButtonBasicProperty',getRadioButtonProperty);
            });
        });
        $UI.find(".radioButtonTD_horizontal").each(function(){
            if(getRadioButtonProperty.SelectedRadio==$(this).attr("alt")){
                $(this).addClass("radioButtonTDChecked").css(getRadioButtonProperty.CheckedBackgroundColor.value).siblings().removeClass("radioButtonTDChecked").css(getRadioButtonProperty.BackgroundColor.value);
                $(this).find(".radioUnChecked").attr("class","radioChecked").css("background",getRadioButtonProperty.CheckedButtonColor+" url('JS/Controls/RadioButton1/img/hook-radio.png') no-repeat center center");
                $(this).siblings().find(".radioChecked").attr("class","radioUnChecked").css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+getRadioButtonProperty.ButtonColor+"))");
            }
            var outPramats;
            $(this).bind('click touchstart',function(){
                var RadioButtonOutParametersNum = $(this).attr("alt");
                getRadioButtonProperty.SelectedRadio=$(this).attr("alt");
                outPramats = {"CheckedText":getRadioButtonProperty.RadioButtonText[getRadioButtonProperty.RadioButtonOutParameters],"CheckedValue":getRadioButtonProperty.RadioButtonValue[RadioButtonOutParametersNum]};
                $(this).addClass("radioButtonTDChecked").siblings().removeClass("radioButtonTDChecked");
                $(this).find(".radioUnChecked").attr("class","radioChecked");
                $(this).siblings().find(".radioChecked").attr("class","radioUnChecked");
                self.Set("OutPramats",outPramats);
                self.Set('RadioButtonBasicProperty',getRadioButtonProperty);
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

    ParameterChange: function (_ParameterInfo) {//参数联动
        //联动接口: 框架传递过来点位号；控件自己去注册点位号
        this.IsChangeEntity=true;
        this.Set('Entity',this.Get('Entity'));

    },
    CustomProPanelShow: function () {
        Agi.Controls.RadioButtonProrityInit(this);
    },

    Copy: function () {
        console.log("调用"+"Copy");
        if (layoutManagement.property.type == 1) {
            var ParentObj = this.shell.Container.parent();
            var PostionValue = this.Get("Position");
            var newRadioButtonPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
            var NewRadioButton = new Agi.Controls.RadioButton();
            NewRadioButton.Init(ParentObj, newRadioButtonPositionpars);
            newRadioButtonPositionpars = null;
            return NewRadioButton;
        }
    },

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
    },

    Refresh: function () {

        console.log("调用"+"Refresh");
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
        ThisHTMLElement.width(parseInt(ThisControlPars.Width)+1);
        ThisHTMLElement.height(parseInt(ThisControlPars.Height)+1);
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
    EnterEditState: function () {
        var obj = $(this.Get('HTMLElement'));
        this.oldSize = {
            width: obj.width(),
            height: obj.height()
        }
        obj.css({ "width": 252, "height": 150 });
        $(".RadioButtonDiv").css("overflow","auto");
        this.IsEditState = true;
    },
    BackOldSize: function () {
        if (this.oldSize) {
            var obj = $(this.Get('HTMLElement'));
            //20130402 倪飘 解决bug，单选按钮1控件边框无法自适应控件大小。
            var RadioButtonBasicProperty=this.Get("RadioButtonBasicProperty");
            var tableHeight= 0,tableWidth=0;
            var showCount=parseInt(RadioButtonBasicProperty.ItemNum>RadioButtonBasicProperty.ShowCounts?RadioButtonBasicProperty.ShowCounts:RadioButtonBasicProperty.ItemNum);
            if(RadioButtonBasicProperty.Alignment=="vertical"){
                tableHeight=(parseInt(RadioButtonBasicProperty.RowHeight)+1)*showCount+1;
                tableWidth=parseInt(RadioButtonBasicProperty.ColumnWidth)+2;
            }else{
                tableWidth=(parseInt(RadioButtonBasicProperty.ColumnWidth)+1)*showCount+1;
                tableHeight=parseInt(RadioButtonBasicProperty.RowHeight)+2;
            }
            obj.width((parseInt(this.oldSize.width)>=tableWidth?tableWidth:parseInt(this.oldSize.width))+1);
            obj.height((parseInt(this.oldSize.height)>=tableHeight?tableHeight:parseInt(this.oldSize.height))+1);
            obj.resizable({
                //                    minHeight: 50,
                //                    minWidth: 180
            }).css("position", "absolute");
        }
        $(".RadioButtonDiv").css("overflow","hidden");
        this.IsEditState = false;
    },
    ControlAttributeChangeEvent: function (_RadioButtonobj, Key, _Value) {
        switch(Key){
            case"Position":
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElement = $("#"+this.Get("HTMLElement").id);
                    var ParentObj = ThisHTMLElement.parent();
                    var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                    var height=Math.round(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                    var width=Math.round(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                    ThisHTMLElement.width(width+1);
                    ThisHTMLElement.height(height+1);
                    ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                    if(!_RadioButtonobj.IsEditState){
                        var RadioButtonBasicProperty=_RadioButtonobj.Get("RadioButtonBasicProperty");
                        var showCount=parseInt(RadioButtonBasicProperty.ItemNum>RadioButtonBasicProperty.ShowCounts?RadioButtonBasicProperty.ShowCounts:RadioButtonBasicProperty.ItemNum);
                        if(RadioButtonBasicProperty.Alignment=="vertical"){
                            if(width>=(parseInt(RadioButtonBasicProperty.MinColumnWidth)+2)&&width<=802){
                                RadioButtonBasicProperty.ColumnWidth=width-2;
                            }
                            var maxHeight=(101)*showCount+1;
                            var minHeight=(parseInt(RadioButtonBasicProperty.MinRowHeight)+1)*showCount+1;
                            if(minHeight<=height&&height<=maxHeight){
                                RadioButtonBasicProperty.RowHeight=Math.round((height-1)/showCount-1);
                            }else if(height<minHeight){
                                RadioButtonBasicProperty.RowHeight=RadioButtonBasicProperty.MinRowHeight;
                            }else{
                                RadioButtonBasicProperty.RowHeight=100;
                            }
                        }else{
                            if(parseInt(RadioButtonBasicProperty.MinRowHeight)+2<=height&&height<=102){
                                RadioButtonBasicProperty.RowHeight=height-2;
                            }
                            var maxWidth=(801)*showCount+1;
                            var minWidth=(parseInt(RadioButtonBasicProperty.MinColumnWidth)+1)*showCount+1;
                            if(minWidth<=width&&width<=maxWidth){
                                RadioButtonBasicProperty.ColumnWidth=Math.round((width-1)/showCount-1);
                            }else if(width<minWidth){
                                RadioButtonBasicProperty.ColumnWidth=RadioButtonBasicProperty.MinColumnWidth;
                            }else{
                                RadioButtonBasicProperty.ColumnWidth=800;
                            }
                        }
                        _RadioButtonobj.Set("RadioButtonBasicProperty",RadioButtonBasicProperty);
                    }
                }
                break;
            case "RadioButtonBasicProperty":
                if (layoutManagement.property.type == 1) {
                    var showCount=_Value.ItemNum>_Value.ShowCounts?_Value.ShowCounts:_Value.ItemNum;
                    var items="";
                    for(var i=0; i<showCount;i++){
                        items+="<tr alt='"+i+"'>";
                        items+="<td class='prortityPanelRadioButtonTextTD'>"+_Value.RadioButtonText[i]+"</td>";
                        items+="</tr>";
                    }
                    $(".prortityPanelRadioButtonTextTable").html(items);
                    $(".prortityPanelRadioButtonTextTable tr").css("cursor","pointer").each( function(){
                        if(_Value.ItemEditSelectNum == $(this).attr("alt")){
                            $(this).css('background','-webkit-gradient(linear,left top, left bottom, color-stop(0, rgb(196,211,237)), color-stop(1, rgb(179,198,218)) )').siblings().css('background','');
                        }
                        $(this).bind('click touchstart',function(){
                            _Value.ItemEditSelectNum = $(this).attr("alt");
                            $(this).css('background','-webkit-gradient(linear,left top, left bottom, color-stop(0, rgb(196,211,237)), color-stop(1, rgb(179,198,218)) )').siblings().css('background','');
                            $('#textFieldChanged').val(_Value.RadioButtonText[_Value.ItemEditSelectNum]);
                            $('#valueFieldChanged').val(_Value.RadioButtonValue[_Value.ItemEditSelectNum]);

                            _RadioButtonobj.Set('RadioButtonBasicProperty',_Value);
                        });
                    });
                    var $UI = $('#'+ this.shell.ID);
                    var tableID = _RadioButtonobj.Get("ProPerty").ID;
                    var BaseControlObjHtml = '<div id="'+tableID+'" class="RadioButtonDiv">';
                    if(_Value.Alignment == "vertical"){
                        BaseControlObjHtml = BaseControlObjHtml + '<table class="radioButtonTable">';
                        for(var buttonId=0;buttonId<showCount;buttonId++){
                            BaseControlObjHtml = BaseControlObjHtml + '<tr><td alt="'+buttonId+'"  class="radioButtonTD"><INPUT TYPE="radio" NAME="radio"  style="width:0px;" value="'+buttonId+'"/><div class="radioUnChecked"></div><span class="radioButtonSpan">'+_Value.RadioButtonText[buttonId]+
                                '</span></td></tr>';
                        }
                    }else{
                        BaseControlObjHtml = BaseControlObjHtml +'<table class="radioButtonTable_horizontal">';
                        BaseControlObjHtml = BaseControlObjHtml+"<tr class='RadioButtonHorizontalTR'>";
                        for(var buttonId=0;buttonId<showCount;buttonId++){
                            BaseControlObjHtml = BaseControlObjHtml + '<td alt="'+buttonId+'" class="radioButtonTD_horizontal"><INPUT TYPE="radio" NAME="radio" style="width:0px;" value="'+buttonId+'"/><div class="radioUnChecked"></div><span class="radioButtonSpan">'+_Value.RadioButtonText[buttonId]+
                                '</span></td>';
                        }
                        BaseControlObjHtml = BaseControlObjHtml+"</tr>";
                    }
                    BaseControlObjHtml = BaseControlObjHtml  + '</table></div>';

                    BaseControlObjHtml="<div class='selectPanelBodySty'>"+BaseControlObjHtml+"</div>";
                    $UI.find(".selectPanelBodySty").replaceWith(BaseControlObjHtml);
                    if(this.IsEditState){
                        $(".RadioButtonDiv").css("overflow","auto");
                    }else{
                        $(".RadioButtonDiv").css("overflow","hidden");
                    }
                    $("#"+tableID+" table").css("border-color",_Value.BorderColor);
                    $("#"+tableID+" table td").css(_Value.BackgroundColor.value).css({
                        "color":_Value.FontColor,
                        "font-family":_Value.FontFamily[_Value.FontIndex],
                        "border-color":_Value.BorderColor
                    });
                    var BasePanel=$(_RadioButtonobj.Get("HTMLElement"));
                    if(_Value.Alignment == "vertical"){
                        $(".radioButtonTable").css("height","auto");
                        $(".radioButtonTable").css("width",_Value.ColumnWidth);
                        $(".radioButtonTD").css("width",_Value.ColumnWidth);
                        $(".radioButtonTD").css("height",_Value.RowHeight);
                        BasePanel.css({"min-width":(parseInt(_Value.MinColumnWidth)+2),"min-height":(parseInt(_Value.MinRowHeight)*2+3),"max-width":802,"max-height":(101*showCount+1)});
                    }else{
                        $(".radioButtonTable_horizontal").css("width","auto");
                        $(".radioButtonTable_horizontal").css("height",_Value.RowHeight);

                        $(".radioButtonTD_horizontal").css("width",_Value.ColumnWidth);
                        //$(".radioButtonTD_horizontal").css("width",_Value.ColumnWidth);
                        $(".radioButtonTD_horizontal").css("height",_Value.RowHeight);
                        BasePanel.css({"min-width":(parseInt(_Value.MinColumnWidth)+2),"min-height":(parseInt(_Value.MinRowHeight)+2),"max-width":(801*showCount+1),"max-height":102});
                    }
                    $UI.find(".radioUnChecked").css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+_Value.ButtonColor+"))");
                    $UI.find(".radioButtonTD").each( function(){
                        var outPramats;
                        if(_Value.SelectedRadio==$(this).attr("alt")){
                            $(this).addClass("radioButtonTDChecked").css(_Value.CheckedBackgroundColor.value).parent().siblings().children().removeClass("radioButtonTDChecked").css(_Value.BackgroundColor.value);
                            $(this).find(".radioUnChecked").attr("class","radioChecked").css("background",_Value.CheckedButtonColor+" url('JS/Controls/RadioButton1/img/hook-radio.png') no-repeat center center");
                            $(this).parent().siblings().find(".radioChecked").attr("class","radioUnChecked").css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+_Value.ButtonColor+"))");
                        }
                        $(this).bind('click touchstart',function(){
                            _Value.RadioButtonOutParameters = $(this).attr("alt");
                            _Value.SelectedRadio=$(this).attr("alt");
                            outPramats = {"CheckedText":_Value.RadioButtonText[_Value.RadioButtonOutParameters],"CheckedValue":_Value.RadioButtonValue[_Value.RadioButtonOutParameters]};
                            $(this).addClass("radioButtonTDChecked").css(_Value.CheckedBackgroundColor.value).parent().siblings().children().removeClass("radioButtonTDChecked").css(_Value.BackgroundColor.value);
                            $(this).find(".radioUnChecked").attr("class","radioChecked").css("background",_Value.CheckedButtonColor+" url('JS/Controls/RadioButton1/img/hook-radio.png') no-repeat center center");
                            $(this).parent().siblings().find(".radioChecked").attr("class","radioUnChecked").css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+_Value.ButtonColor+"))");
                            _RadioButtonobj.Set("OutPramats",outPramats);
                        });
                    });
                    $UI.find(".radioButtonTD_horizontal").each( function(){
                        if(_Value.SelectedRadio==$(this).attr("alt")){
                            $(this).addClass("radioButtonTDChecked").css(_Value.CheckedBackgroundColor.value).siblings().removeClass("radioButtonTDChecked").css(_Value.BackgroundColor.value);
                            $(this).find(".radioUnChecked").attr("class","radioChecked").css("background",_Value.CheckedButtonColor+" url('JS/Controls/RadioButton1/img/hook-radio.png') no-repeat center center");
                            $(this).siblings().find(".radioChecked").attr("class","radioUnChecked").css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+_Value.ButtonColor+"))");
                        }
                        var outPramats;
                        $(this).bind('click touchstart',function(){
                            _Value.RadioButtonOutParameters = $(this).attr("alt");
                            _Value.SelectedRadio=$(this).attr("alt");
                            outPramats = {"CheckedText":_Value.RadioButtonText[_Value.RadioButtonOutParameters],"CheckedValue":_Value.RadioButtonValue[_Value.RadioButtonOutParameters]};
                            $(this).addClass("radioButtonTDChecked").css(_Value.CheckedBackgroundColor.value).siblings().removeClass("radioButtonTDChecked").css(_Value.BackgroundColor.value);
                            $(this).find(".radioUnChecked").attr("class","radioChecked").css("background",_Value.CheckedButtonColor+" url('JS/Controls/RadioButton1/img/hook-radio.png') no-repeat center center");
                            $(this).siblings().find(".radioChecked").attr("class","radioUnChecked").css("background","-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to("+_Value.ButtonColor+"))");
                            _RadioButtonobj.Set("OutPramats",outPramats);
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
                    "Key": _RadioButtonobj.Get("ProPerty").ID,
                    "ChangeValue":ThisOutParats
                });

                Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_RadioButtonobj,"Type":Agi.Msg.Enum.Controls});

            } break;
            case "Entity"://实体
            {
                var entity = _RadioButtonobj.Get('Entity');
                var radioButtonBasicProperty = _RadioButtonobj.Get('RadioButtonBasicProperty');
                if (entity && entity.length) {

                    //20130402 倪飘 解决bug，单选按钮控件中拖入数据并在高级属性设置界面中设置最大显示条数为1，预览页面中显示为1条但是预览页面中显示还是5条
                    // radioButtonBasicProperty.ShowCounts=5;
                    BindDataByEntity(_RadioButtonobj,entity[0]);
                }else{
                    for(var i= 0;i<radioButtonBasicProperty.ItemNum;i++){
                        $UI.find('#radioButtonId_'+i).text('');
                    }
                }
            }break;
        }//end switch

        function BindDataByEntity(controlObj, et) {
            var self = controlObj;
            var $UI = $('#' + controlObj.shell.ID);
            var getRadioButtonProperty = controlObj.Get("RadioButtonBasicProperty");
            if (!et.IsShareEntity) {
                Agi.Utility.RequestData2(et, function (d) {
                    var data = d.Data.length ? d.Data : [];
                    var columns = d.Columns;
                    et.Data = data;
                    et.Columns = columns;

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
                    if (controlObj.IsChangeEntity) {
                        getRadioButtonProperty.RadioButtonText = [];
                        getRadioButtonProperty.RadioButtonValue = [];
                        $(d.Data).each(function (i, el) {
                            getRadioButtonProperty.RadioButtonText[i] = el[textField];
                            getRadioButtonProperty.RadioButtonValue[i] = el[valueField];
                            $UI.find("#radioButtonId_" + i).text(getRadioButtonProperty.RadioButtonText[i]);
                        });
                        controlObj.IsChangeEntity = false;
                    }
                    controlObj.Set("RadioButtonBasicProperty", getRadioButtonProperty);
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.ShowControlData(self); //更新实体数据显示
                        Agi.Controls.RadioButtonProrityInit(self); //更新属性面板
                    }
                });
            } else {
                BindDataByJson.call(controlObj, et, et);
            }
            return;
        }

        function BindDataByJson(et, d) {
            var self = this;
            var $UI = $('#' + self.shell.ID);
            var getRadioButtonProperty = self.Get("RadioButtonBasicProperty");

            var data = d.Data.length ? d.Data : [];
            var columns = d.Columns;
            et.Data = data;
            et.Columns = columns;

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
            if (self.IsChangeEntity) {
                getRadioButtonProperty.RadioButtonText = [];
                getRadioButtonProperty.RadioButtonValue = [];
                $(d.Data).each(function (i, el) {
                    getRadioButtonProperty.RadioButtonText[i] = el[textField];
                    getRadioButtonProperty.RadioButtonValue[i] = el[valueField];
                    $UI.find("#radioButtonId_" + i).text(getRadioButtonProperty.RadioButtonText[i]);
                });
                self.IsChangeEntity = false;
            }
            self.Set("RadioButtonBasicProperty", getRadioButtonProperty);
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(self); //更新实体数据显示
                Agi.Controls.RadioButtonProrityInit(self); //更新属性面板
            }
        }
    },

    GetConfig: function () {
        console.log("调用"+"GetConfig");
        var ProPerty = this.Get("ProPerty");
        var RadioButtonControl = {
            Control:{
                ControlType:null,//控件类型
                ControlID:null, //控件ID
                ControlBaseObj:null,//控件对象
                HTMLElement:null,//控件的外壳HTML元素信息
                Entity:null, // 实体
                Position:null,// 控件位置信息
                RadioButtonBasicProperty:null,//控件属性
                ThemeInfo:null,
                OutPramats:null
            }
        };// 配置信息数组对象
        RadioButtonControl.Control.ControlType = this.Get("ControlType");
        RadioButtonControl.Control.ControlID = ProPerty.ID;
        RadioButtonControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
        RadioButtonControl.Control.HTMLElement= ProPerty.BasciObj[0].id;
//            RadioButtonContorl.Control.ControlBaseObj = ProPerty.ID;
        //RadioButtonControl.Control.HTMLElement= this.Get("HTMLElement").id;
        RadioButtonControl.Control.Entity = this.Get("Entity");
        RadioButtonControl.Control.Position = this.Get("Position");
        RadioButtonControl.Control.RadioButtonBasicProperty =this.Get("RadioButtonBasicProperty");
        RadioButtonControl.Control.ThemeInfo = this.Get("ThemeInfo");
        RadioButtonControl.Control.OutPramats=this.Get("OutPramats");
//            RadioButtonContorl.Control.ThemeInfo = this.Get("ThemeInfo");
        return  RadioButtonControl.Control; //返回配置字符串
    }, //获得RadioButton控件的配置信息

    CreateControl:function(_Config, _Target){
        console.log("调用"+"CreateControl");
        this.Init(_Target,_Config.Position,_Config.ControlID);
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
                this.shell.Container.width(parseInt(ThisControlPars.Width)+1).height(parseInt(ThisControlPars.Height)+1);
                this.shell.Container.css('left',(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                this.shell.Container.css('top',(parseInt(_Config.Position.Top*PagePars.Height))+"px");
                this.Set("Entity",_Config.Entity);
                this.ChangeTheme(_Config.ThemeInfo);
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
        //radioButtonBasicProperty.Alignment = _StyConfig.Alignment;
        //radioButtonBasicProperty.RowHeight = _StyConfig.RowHeight;
        //radioButtonBasicProperty.ColumnWidth = _StyConfig.ColumnWidth;
        radioButtonBasicProperty.BackgroundColor = _StyConfig.BackgroundColor;
        radioButtonBasicProperty.ButtonColor = _StyConfig.ButtonColor;
        radioButtonBasicProperty.BorderColor = _StyConfig.BorderColor;
        radioButtonBasicProperty.FontColor=_StyConfig.FontColor;
        radioButtonBasicProperty.CheckedBackgroundColor = _StyConfig.CheckedBackgroundColor;
        radioButtonBasicProperty.CheckedButtonColor = _StyConfig.CheckedButtonColor;
        radioButton.Set('RadioButtonBasicProperty',radioButtonBasicProperty);
    }
};

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitRadioButton = function () {
    return new Agi.Controls.RadioButton();
};
Agi.Controls.RadioButtonProrityInit = function (_RadioButtonControl) {

    var radioButtonBasicProperty = _RadioButtonControl.Get('RadioButtonBasicProperty');
    var ThisProItems = [];

    //绑定配置的代码
    var bindHTML = new Agi.Script.StringBuilder();
    bindHTML.append('<form class="form-horizontal"><table class="prortityBindTable"><tbody>');

    bindHTML.append('<tr>');
    bindHTML.append('<td class="prortityBindLabel">显示值:</td><td class="prortityBindSelect"><select id="selectText"  data-field="显示值" placeholder="" class="input"></select></td>');
    bindHTML.append('</tr>');
    bindHTML.append('<tr>');
    bindHTML.append('<td class="prortityBindLabel">选择值:</td><td class="prortityBindSelect"><select id="selectValue" data-field="选择值" placeholder="" class="input"></select></td>');
    bindHTML.append('</tr>');
    bindHTML.append('<tr>');
    var max = radioButtonBasicProperty.ItemNum > radioButtonBasicProperty.ShowCounts ? radioButtonBasicProperty.ItemNum : radioButtonBasicProperty.ShowCounts;
    bindHTML.append('<td class="prortityBindLabel">最大显示条数:</td><td class="prortityBindSelect"><input id="ShowCounts" type="number" class="ControlProNumberSty" value="' + radioButtonBasicProperty.ShowCounts + '" min="1" max="' + max + '"/></td>');
    bindHTML.append('</tr>');
    bindHTML.append('</tbody></table></form>');
    var BindObj = $(bindHTML.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "绑定配置", DisabledValue: 1, ContentObj: BindObj }));

    var basicHTML = new Agi.Script.StringBuilder();
    basicHTML.append("<div class='BasicChart_Pro_Panel'>");
    basicHTML.append("<table class='prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>排列方式:</td><td class='prortityPanelTabletd1'><select id='AligmentSelect'  data-field='Item排列方式' placeholder='' class='input'><option value='vertical'>纵向</option><option value='horizontal'>横向</option></select></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>边框颜色:</td><td class='prortityPanelTabletd2'><input type='text' id='FilterBorderColor' /></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>列宽:</td><td class='prortityPanelTabletd1'><input id='ColumnWidth' type='number' value='" + radioButtonBasicProperty.ColumnWidth + "'class='ControlProNumberSty' min='100' max='800'/></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>行高</td><td class='prortityPanelTabletd1'><input id='RowHeight' type='number' value='" + radioButtonBasicProperty.RowHeight + "'class='ControlProNumberSty' min='25' max='100'/></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>背景颜色:</td><td class='prortityPanelTabletd2'><div id='FilterBgColor' class='ControlColorSelPanelSty'></div></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>选中项背景颜色:</td><td class='prortityPanelTabletd2'><div id='CheckedBgColor' class='ControlColorSelPanelSty'></div></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>按钮颜色:</td><td class='prortityPanelTabletd2'><input id='ButtonBgColor' type='text' class='basic input-mini' ></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>选中项按钮颜色:</td><td class='prortityPanelTabletd2'><input id='CheckedButtonBgColor' type='text' class='basic input-mini' ></td>");
    basicHTML.append("</tr>");
    basicHTML.append("<tr>");
    basicHTML.append("<td class='prortityPanelTabletd0'>字体类型:</td><td class='prortityPanelTabletd2'><select id='FontFamily'  data-field='字体类型' placeholder='' class='input'>");
    for (var i = 0; i < radioButtonBasicProperty.FontFamily.length; i++) {
        basicHTML.append("<option value='" + i + "'>" + radioButtonBasicProperty.FontFamily[i] + "</option>");
    }
    basicHTML.append("</select></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>字体颜色:</td><td class='prortityPanelTabletd2'><input id='FontColor' type='text' class='basic input-mini' ></td>");
    basicHTML.append("</tr>");
    basicHTML.append("</table>");
    basicHTML.append("</div>");
    var FilletObj = $(basicHTML.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));

    //元素管理
    var itemEdit = new Agi.Script.StringBuilder();
    var showCount = radioButtonBasicProperty.ItemNum > radioButtonBasicProperty.ShowCounts ? radioButtonBasicProperty.ShowCounts : radioButtonBasicProperty.ItemNum;
    itemEdit.append("<div class='prortityPanelRadioButtonManagmentDiv'>");

    itemEdit.append("<div class='prortityPanelRadioButtonTextDiv' >");
    itemEdit.append("<table class='prortityPanelRadioButtonTextTable'>");
    for (var i = 0; i < showCount; i++) {
        itemEdit.append("<tr alt='" + i + "'>");
        itemEdit.append("<td class='prortityPanelRadioButtonTextTD'>" + radioButtonBasicProperty.RadioButtonText[i] + "</td>");
        itemEdit.append("</tr>");
    }
    itemEdit.append("</table>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelRadioButtonItemManagmentDiv'>");

    itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
    itemEdit.append("<label class='prortityPanelRadioButtonManagmentLabel'>选项信息:</label>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
    itemEdit.append("<label for='textFieldChanged'>显示值:</label>");
    itemEdit.append("<input type='text' class='InputText' id='textFieldChanged' placeholder='显示值'/>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelRadioButtonManagmentDivUnit'>");
    itemEdit.append("<label for='valueFieldChanged'>选择值:</label>");
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
    itemEdit.append("<input type='button' class='InputButtonAdd' id='UserDefined' value='自定义'/>");
    itemEdit.append("</div>");

    itemEdit.append("</div>");

    itemEdit.append("</div>");

    var ItemEditObj = $(itemEdit.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "选项管理", DisabledValue: 1, ContentObj: ItemEditObj }));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //4.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) { };

    var entity = _RadioButtonControl.Get('Entity');
    var textOptions = null;
    if (entity.length) {
        if (entity[0].Columns) {
            textOptions = "";
            $(entity[0].Columns).each(function (i, col) {

                if (radioButtonBasicProperty.RadioButtonTextField == col) {
                    textOptions += '<option value="' + col + '" selected="true">' + col + '</option>';
                } else {
                    textOptions += '<option value="' + col + '">' + col + '</option>';
                }
            });
        }
    }
    var valueOptions = null;
    if (entity.length) {
        if (entity[0].Columns) {
            valueOptions = "";
            $(entity[0].Columns).each(function (i, col) {

                if (radioButtonBasicProperty.RadioButtonValueField == col) {
                    valueOptions += '<option value="' + col + '" selected="true">' + col + '</option>';
                } else {
                    valueOptions += '<option value="' + col + '">' + col + '</option>';
                }
            });
        }
    }

    $(".prortityBindTable").find('#selectText').append($(textOptions)).bind('change', { sels: $(".prortityBindTable").find('#selectText') }, function (e) {
        $(e.data.sels).each(function (i, sel) {
            radioButtonBasicProperty.RadioButtonTextField = $(sel).val();
            $(sel).val(radioButtonBasicProperty.RadioButtonTextField);
            Agi.Utility.RequestData2(entity[0], function (d) {
                var data = d.Data.length ? d.Data : [];
                entity[0].Data = data;
                $(data).each(function (i, dd) {
                    radioButtonBasicProperty.RadioButtonText[i] = dd[radioButtonBasicProperty.RadioButtonTextField];

                });
                _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
            });
        });
    });

    $(".prortityBindTable").find('#selectValue').append($(valueOptions)).bind('change', { sels: $(".prortityBindTable").find('#selectValue') }, function (e) {
        $(e.data.sels).each(function (i, sel) {

            radioButtonBasicProperty.RadioButtonValueField = $(sel).val();
            $(sel).val(radioButtonBasicProperty.RadioButtonValueField);
            Agi.Utility.RequestData2(entity[0], function (d) {
                var data = d.Data.length ? d.Data : [];
                entity[0].Data = data;
                $(data).each(function (i, dd) {
                    radioButtonBasicProperty.RadioButtonValue[i] = dd[radioButtonBasicProperty.RadioButtonValueField];
                });
                _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
            });
        });
    });
    $("#ShowCounts").val(radioButtonBasicProperty.ShowCounts);
    $("#ShowCounts").change(function () {
        var count = parseInt($("#ShowCounts").val());
        var max = parseInt($("#ShowCounts").attr("max"));
        if (count >= 1 && count <= max) {
            radioButtonBasicProperty.ShowCounts = count;
        }else{
            AgiCommonDialogBox.Alert("请输入1-" + max + "范围内的值！");
            $("#ShowCounts").val(radioButtonBasicProperty.ShowCounts);
        }
        _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
    });
    $(".prortityPanelRadioButtonTextTable tr").css("cursor", "pointer").each(function () {
        $(this).bind('click touchstart', function () {
            radioButtonBasicProperty.ItemEditSelectNum = $(this).attr("alt");
            $(this).css('background', '-webkit-gradient(linear,left top, left bottom, color-stop(0, rgb(196,211,237)), color-stop(1, rgb(179,198,218)) )').siblings().css('background', '');
            $('#textFieldChanged').val(radioButtonBasicProperty.RadioButtonText[radioButtonBasicProperty.ItemEditSelectNum]);
            $('#valueFieldChanged').val(radioButtonBasicProperty.RadioButtonValue[radioButtonBasicProperty.ItemEditSelectNum]);

            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
        });
    });

    $("#AligmentSelect").find("option").each(function () {
        if (this.value == radioButtonBasicProperty.Alignment) {
            this.selected = true;
        }
    });
    $("#AligmentSelect").change(function () {
        var alignment = $("#AligmentSelect").val();
        if (alignment == "horizontal") {
            radioButtonBasicProperty.ColumnWidth = 100;
        }
        if (alignment == "vertical") {
            radioButtonBasicProperty.ColumnWidth = 250;
        }
        radioButtonBasicProperty.MinColumnWidth=100;
        radioButtonBasicProperty.MinRowHeight=radioButtonBasicProperty.RowHeight;
        $("#ColumnWidth").val(radioButtonBasicProperty.ColumnWidth);
        radioButtonBasicProperty.Alignment = $("#AligmentSelect").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
    });
    $("#RowHeight").val(radioButtonBasicProperty.RowHeight);
    $("#RowHeight").change(function () {
        var height = parseInt($("#RowHeight").val());
        //20130402 倪飘 解决bug，单选按钮列宽输入框中点击向下箭头减小宽度到100，输入值宽为1，弹出信息提示并确定以后，输入框中值变为250但是控件中宽度为10（单选按钮行高也存在相同问题）
        if (height >= 25 && height <= 100) {
            radioButtonBasicProperty.RowHeight = height;
            radioButtonBasicProperty.MinRowHeight=height;
            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
        } else {
            $(this).val(radioButtonBasicProperty.RowHeight);
            var DilogboxTitle = "请输入" + parseInt($(this).attr("min")) + "-" + parseInt($(this).attr("max")) + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });
    $("#ColumnWidth").val(radioButtonBasicProperty.ColumnWidth);
    $("#ColumnWidth").change(function () {
        var width = parseInt($("#ColumnWidth").val());

        //20130402 倪飘 解决bug，单选按钮列宽输入框中点击向下箭头减小宽度到100，输入值宽为1，弹出信息提示并确定以后，输入框中值变为250但是控件中宽度为10（单选按钮行高也存在相同问题）
        if (width >= 100 && width <= 800) {
            radioButtonBasicProperty.ColumnWidth = width;
            radioButtonBasicProperty.MinColumnWidth = width;
            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
        } else {
            $(this).val(radioButtonBasicProperty.ColumnWidth);
            var DilogboxTitle = "请输入" + parseInt($(this).attr("min")) + "-" + parseInt($(this).attr("max")) + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });

    $("#ButtonBgColor").val(radioButtonBasicProperty.ButtonColor);
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
            $("#ButtonBgColor").val(color.toHexString());
            radioButtonBasicProperty.ButtonColor = color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
        }
    });
    $("#CheckedButtonBgColor").val(radioButtonBasicProperty.CheckedButtonColor);
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
            radioButtonBasicProperty.CheckedButtonColor = color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
        }
    });
    /*
     $("#CheckedBgColor").val(radioButtonBasicProperty.CheckedBackgroundColor);
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
     $("#FilterBgColor").val(radioButtonBasicProperty.BackgroundColor);
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
     */
    $("#FilterBgColor").css(radioButtonBasicProperty.BackgroundColor.value);
    $("#FilterBgColor").bind("click touchstart", function () {
        //var currentColor = $(this).data('colorValue');
        //var btn = $(this);
        colorPicker.open({
            disableTabIndex: [],
            defaultValue: radioButtonBasicProperty.BackgroundColor, //这个参数是上一次选中的颜色
            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                radioButtonBasicProperty.BackgroundColor = color;
                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                //btn.data('colorValue', color);
                $("#FilterBgColor").css(color.value);
                _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
            }
        });
    });
    $("#CheckedBgColor").css(radioButtonBasicProperty.CheckedBackgroundColor.value);
    $("#CheckedBgColor").bind("click touchstart", function () {
        //var currentColor = $(this).data('colorValue');
        //var btn = $(this);
        colorPicker.open({
            disableTabIndex: [],
            defaultValue: radioButtonBasicProperty.CheckedBackgroundColor, //这个参数是上一次选中的颜色
            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                radioButtonBasicProperty.CheckedBackgroundColor = color;
                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                //btn.data('colorValue', color);CheckedBgColor
                $("#CheckedBgColor").css(color.value);
                _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
            }
        });
    });
    $("#FilterBorderColor").val(radioButtonBasicProperty.BorderColor);
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
            $("#FilterBorderColor").val(color.toHexString());
            radioButtonBasicProperty.BorderColor = color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
        }
    });
    $("#FontColor").val(radioButtonBasicProperty.FontColor);
    $("#FontColor").spectrum({
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
            $("#FontColor").val(color.toHexString());
            radioButtonBasicProperty.FontColor = color.toHexString();
            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
        }
    });
    $("#FontFamily").find("option").each(function () {
        if (this.value == radioButtonBasicProperty.FontIndex) {
            this.selected = true;
        }
    });
    $("#FontFamily").change(function () {
        radioButtonBasicProperty.FontIndex = $("#FontFamily").val();
        _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
    });
    //if(_RadioButtonControl.IsUserDefined){
    if(radioButtonBasicProperty.DataType=="UserDefined"){
        $("#UserDefined").val("添　加");
        $('#SaveChangeButton').attr('disabled', false);
        $('#DeleteItemButton').attr('disabled', false);
        $("#textFieldAdded").attr("disabled", false);
        $("#valueFieldAdded").attr("disabled", false);
    }else{
        $("#UserDefined").val("自定义");
        $("#textFieldAdded").attr("disabled", true);
        $("#valueFieldAdded").attr("disabled", true);
        $('#SaveChangeButton').attr('disabled', true);
        $('#DeleteItemButton').attr('disabled', true);
    }

    $("#UserDefined").bind('click touchstart', function () {
        if (radioButtonBasicProperty.DataType == "Entity") {
            AgiCommonDialogBox.Confirm("若添加自定义数据将清空实体数据，是否切换？", null, function (flag) {
                if (flag) {
                    // _RadioButtonControl.IsUserDefined=true;
                    radioButtonBasicProperty.DataType = "UserDefined";
                    $("#UserDefined").val("添　加");
                    radioButtonBasicProperty.EntityNum = 0;
                    radioButtonBasicProperty.ItemNum = 0;
                    radioButtonBasicProperty.ShowCounts = 5;
                    radioButtonBasicProperty.RadioButtonText = [];
                    radioButtonBasicProperty.RadioButtonValue = [];
                    radioButtonBasicProperty.ItemEditSelectNum = "";
                    radioButtonBasicProperty.SelectedRadio = -1;
                    $('#selectText').html("");
                    $('#selectValue').html("");
                    $("#textFieldChanged").val("");
                    $("#valueFieldChanged").val("");
                    $('#SaveChangeButton').attr('disabled', false);
                    $('#DeleteItemButton').attr('disabled', false);
                    $("#textFieldAdded").attr("disabled", false);
                    $("#valueFieldAdded").attr("disabled", false);
                    $("#ShowCounts").val(5);
                    $("#ShowCounts").attr("max",5);
                    _RadioButtonControl.Set("Entity", []);
                    _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
                    //更新实体数据显示
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.ShowControlData(_RadioButtonControl);
                    }
                }
            });
        } else if (radioButtonBasicProperty.DataType == "UserDefined") {
            if ($("#textFieldAdded").val() == "") {
                AgiCommonDialogBox.Alert("请输入显示值！");
            } else if ($("#valueFieldAdded").val() == "") {
                AgiCommonDialogBox.Alert("请输入选择值！");
            } else {
                radioButtonBasicProperty.ItemNum += 1;
                radioButtonBasicProperty.RadioButtonText.push($("#textFieldAdded").val());
                radioButtonBasicProperty.RadioButtonValue.push($("#valueFieldAdded").val());
                radioButtonBasicProperty.ItemEditSelectNum = "";
                radioButtonBasicProperty.SelectedRadio = -1;
                $("#textFieldChanged").val("");
                $("#valueFieldChanged").val("");
                if(radioButtonBasicProperty.ItemNum>radioButtonBasicProperty.ShowCounts){
                    radioButtonBasicProperty.ShowCounts=radioButtonBasicProperty.ItemNum;
                }
                _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
                $("#textFieldAdded").val("");
                $("#valueFieldAdded").val("");
                var max = radioButtonBasicProperty.ItemNum > radioButtonBasicProperty.ShowCounts ? radioButtonBasicProperty.ItemNum : radioButtonBasicProperty.ShowCounts;
                $("#ShowCounts").attr("max",max).val(radioButtonBasicProperty.ShowCounts);
            }
        }
    });

    $('#SaveChangeButton').bind('click touchstart', function () {
        if ($("#textFieldChanged").val() == "") {
            AgiCommonDialogBox.Alert("请输入显示值！");
        } else if ($("#valueFieldChanged").val() == "") {
            AgiCommonDialogBox.Alert("请输入选择值！");
        } else if (radioButtonBasicProperty.ItemEditSelectNum == "") {
            AgiCommonDialogBox.Alert("请选择元素！");
        } else if ($("#textFieldChanged").val() == radioButtonBasicProperty.RadioButtonText[radioButtonBasicProperty.ItemEditSelectNum] &&
            $("#valueFieldChanged").val() == radioButtonBasicProperty.RadioButtonValue[radioButtonBasicProperty.ItemEditSelectNum]) {
            AgiCommonDialogBox.Alert("没有修改，不需要保存！");
        } else {
            radioButtonBasicProperty.RadioButtonText[radioButtonBasicProperty.ItemEditSelectNum] = $("#textFieldChanged").val();
            radioButtonBasicProperty.RadioButtonValue[radioButtonBasicProperty.ItemEditSelectNum] = $("#valueFieldChanged").val();
            radioButtonBasicProperty.ItemEditSelectNum = "";
            radioButtonBasicProperty.SelectedRadio = -1;
            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
            $("#textFieldChanged").val("");
            $("#valueFieldChanged").val("");
        }
    });

    $('#DeleteItemButton').bind('click touchstart', function () {
        if (radioButtonBasicProperty.ItemEditSelectNum == "") {
            AgiCommonDialogBox.Alert("请选择元素！");
        } else {
            if (radioButtonBasicProperty.ItemEditSelectNum < radioButtonBasicProperty.EntityNum) {
                radioButtonBasicProperty.EntityNum -= 1;
            }
            if(radioButtonBasicProperty.ShowCounts==radioButtonBasicProperty.ItemNum){
                radioButtonBasicProperty.ShowCounts--;
            }
            radioButtonBasicProperty.ItemNum -= 1;
            radioButtonBasicProperty.RadioButtonText.splice(radioButtonBasicProperty.ItemEditSelectNum, 1);
            radioButtonBasicProperty.RadioButtonValue.splice(radioButtonBasicProperty.ItemEditSelectNum, 1);
            radioButtonBasicProperty.ItemEditSelectNum = "";
            radioButtonBasicProperty.SelectedRadio = -1;

            _RadioButtonControl.Set('RadioButtonBasicProperty', radioButtonBasicProperty);
            $("#textFieldChanged").val("");
            $("#valueFieldChanged").val("");
            var max = radioButtonBasicProperty.ItemNum > radioButtonBasicProperty.ShowCounts ? radioButtonBasicProperty.ItemNum : radioButtonBasicProperty.ShowCounts;
            if(max<5){
                max=5;
            }
            $("#ShowCounts").val(radioButtonBasicProperty.ShowCounts);
            $("#ShowCounts").attr("max",max);
        }
    });
};

//单击双击事件处理
var RadioButtonflag = 0;
var RadioButtonObj = null;
Agi.Controls.RadioButtonClickManager = function (_ClickOption) {
    RadioButtonObj = _ClickOption;
    if (!RadioButtonflag) {
        setTimeout(Agi.Controls.RadioButtonClickLogic, 300);
    }
    RadioButtonflag++;
}
Agi.Controls.RadioButtonClickReset = function () {
    RadioButtonflag = 0;
}
Agi.Controls.RadioButtonSingleClick = function (_ClickOption) {
    Agi.Controls.RadioButtonClickReset();
    // var ControlObj = _ClickOption.ControlObj;
    // var BasicProperty = ControlObj.Get('RadioButtonBasicProperty');
    //  ControlObj.Set('SelValue', BasicProperty.SelectedValue);
}
Agi.Controls.RadioButtonDoubleClick = function (_ClickOption) {
    Agi.Controls.RadioButtonClickReset();
    if (!Agi.Controls.IsControlEdit) {
        Agi.Controls.ControlEdit(_ClickOption.ControlObj); //控件编辑界面
    }
}

Agi.Controls.RadioButtonClickLogic = function () {
    Agi.Controls.RadioButtonDoubleClick(RadioButtonObj);
}
