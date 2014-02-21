/**
 * Created with JetBrains WebStorm.
 * User: markewulei
 * Date: 12-9-3
 * Time: 上午9:50
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.Label = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
//            if (Agi.Edit) {
//                menuManagement.updateDataSourceDragDropTargets();
//            }
        },
//        ResetProperty:function(){
//            $('#'+this.shell.ID).resizable({
//                minHeight: 60,
//                minWidth: 80
//            });
//            return this;
//        },
        ReadData: function (et) {
            var self = this;
            self.IsChangeEntity = true;
            var entity = this.Get("Entity");
            //20130125 倪飘 共享数据源列显示不对问题
            if (et.key != entity.key || entity == []) {
                self.IsAnotherData = true;
            }
            entity = [];
            entity.push(et);
            this.Set("Entity",entity);
        },
        RequestData2:function (entity, callback, option) {
            var self = this;
            self.options = {
                url:WebServiceAddress,
                method:"DSReadData"
            };
            for (name in option) {
                self.options[name] = option[name];
            }
        },
        ReadRealData: function () {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity',this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition,savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var Me = this;
            Me.AttributeList = [];
            Me.IsChangeEntity = false;
            Me.Set("Entity", []);
            Me.Set("ControlType", "Label");
            //选择数据
            var data={
                dataItems:[],
                selectedValue:{
                    value:undefined,
                    text:undefined
                }
            };
            Me.Set('data',data);

            var ID = savedId ? savedId:"Label" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel=$("<div recivedata='true' id='Panel_"+ID+"' class='PanelSty selectPanelSty'></div>"); //style='overflow:hidden ;'
            this.shell = new Agi.Controls.Shell({
                ID:ID,
                width:200,
                height:60,
                divPanel:HTMLElementPanel
            });
            //隐藏头尾
            this.shell.Title.hide();
            this.shell.Title.hide().removeClass('selectPanelheadSty');
            this.shell.Footer.hide();

            var hrefUrl={InsideLink:undefined,OutsideLink:"",OutsideLinkOpenPosition:""};
            this.Set("hrefUrl",hrefUrl);

            var LabelBasicProperty = {
                labelTextField : undefined,
                labelValueField : undefined,

                LeftFillet1: 0,
                LeftFillet2: 0,
                RightFillet1: 0,
                RightFillet2: 0,
                fontSize: "12",
                fontWeight: "",
                fontFamily: "",
                fontColor: "black",
                bgColor: "",
                FontText: "",
                borderWidth: 0,
                borderColor: "red",
                IsShowText: false,

                hrefAddress:"" ,
                IsDisabledhrefAddress:"disabled",
                OpenPosition:"",
                IsDisabledOpenPosition:"disabled",
                InsideLinkAddress:"",
                IsDisabledInsideLinkAddress :null,
                IsLink:null,
                IsShadow:null,
                isTransparent:null,
                otherBgColorIsTransparent:""
            };
            this.Set("LabelBasicProperty", LabelBasicProperty);

            //  Agi.Controls.objLabel = ToUrl;
            var  getLabelProperty  = this.Get("LabelBasicProperty");
//            var BaseControlObj = $('<div  id="'+ID+'" class="LabelPor" >' +
//                '<input type="text" readonly id="labelObjId" value="'+getLabelProperty.FontText+'"/>'+
//                '</div>');
            var BaseControlObj= $('<table width="100%"  id="'+ID+'" class="LabelPor" value=""><tr><td align="left">'+//getLabelProperty.FontText+
                '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                '<tbody><tr><td id="labelObjId" style="white-space:nowrap;">'+getLabelProperty.FontText+'</td>' +
                '</tr></tbody></table>'+
                // '<div id="labelObjId">'+getLabelProperty.FontText+'</div>'+
                // '<span id="labelObjId">'+getLabelProperty.FontText+'</span>'+
                //  '<label id="labelObjId">'+getLabelProperty.FontText+'</label>'+
                // '<a id="aLink" href="http://www.baidu.com" onclick="Agi.Controls.objLabel()" role="button" class="dropdown-toggle">'+LabelBasicProperty.FontText+'</a>'+
                '</td></tr></table>');
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement",this.shell.Container[0]);

            var ThisProPerty = {
                ID: ID,
                BasciObj:BaseControlObj
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
            Agi.Msg.PageOutPramats.AddPramats({
                "Type":Agi.Msg.Enum.Controls,
                "Key":ID,
                "ChangeValue":[
                    { 'Name':'LabelValue', 'Value':-1}
                ]
            });
            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(180);
                HTMLElementPanel.height(60);
                //BaseControlObj.height($('.HTMLElementPanel').height() - 14);
                PostionValue.Left=((_ShowPosition.Left-PagePars.Left)/PagePars.Width).toFixed(4);
                PostionValue.Top=((_ShowPosition.Top-PagePars.Top)/PagePars.Height).toFixed(4);
                PostionValue.Right=((PagePars.Width-HTMLElementPanel.width()-(_ShowPosition.Left-PagePars.Left))/PagePars.Width).toFixed(4);
                PostionValue.Bottom=((PagePars.Height-HTMLElementPanel.height()-(_ShowPosition.Top-PagePars.Top))/PagePars.Height).toFixed(4);
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
            $('#'+self.shell.ID).mousedown(function(ev){
                // alert($("#"+BaseControlObj));
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });

            $('#'+self.shell.ID).dblclick(function(ev){
                if(!Agi.Controls.IsControlEdit){
                    Agi.Controls.ControlEdit(self);//控件编辑界面
                }
            });
            $('#' + self.shell.ID).find(".selectPanelBodySty").bind("click", function () {
                Labelbutton(this, Me);
            });
            if(HTMLElementPanel.touchstart){
                HTMLElementPanel.touchstart(function(ev){
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            var LinkUl = this.Get("hrefUrl");
            var $UI = $('#'+self.shell.ID);
            $UI.find('.LabelPor').find("#labelObjId").live('click',function(){  //如果在Div中有其他的块.用这个方法绑定事件
                 //alert('LabelPor点击事件')
                if(LinkUl.OutsideLink =="" &&  LinkUl.InsideLink ==undefined){
                    //  alert("没有链接地址！");
                    return;
                }
                if(LinkUl.InsideLink !=undefined){
                    var ss =LinkUl.InsideLink;
                    Agi.Edit.ViewPage(ss); //打开内部链接
                }
                if(LinkUl.OutsideLink != ""){
                    window.open(LinkUl.OutsideLink,LinkUl.OutsideLinkOpenPosition); //打开外部链接
                }
            });

            this.Set("Position", PostionValue);
//            Agi.Msg.PageOutPramats.AddPramats({
//                'Type': Agi.Msg.Enum.Controls,
//                'Key': ID,
//                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1 }]
//            });
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue =LabelFilter = null;

            //缩小的最小宽高设置
//            HTMLElementPanel.resizable({
//                minHeight:60,
//                minWidth: 80
//            });
            this.Set("ThemeName", null);//主题名称
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
            Agi.Controls.LabelPropertyInit(this);
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent();// $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newLabelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewLabel = new Agi.Controls.Label();
                NewLabel.Init(ParentObj, PostionValue);
                newLabelPositionpars = null;
                return NewLabel;
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
        FilterChange: function (_Fillter) {
            if (_Fillter != null && _Fillter.LeftFillet1 != null && _Fillter.LeftFillet2 != null && _Fillter.RightFillet1 != null && _Fillter.RightFillet2 != null) {
                this.Set("LabelBasicProperty", _Fillter);
                _Fillter = null;
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
            ThisHTMLElement.css("left", ( parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
        },
        Checked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
                "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
            });
        },
        HTMLElementSizeChanged:function(){
            var Me = this;
            if(Agi.Controls.IsControlEdit){//如果是进入编辑界面，100%适应
                Me.Set("Position",{Left:0,Right:0,Top:0,Bottom:0});//由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            }else{
                Me.Refresh();//每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        EnterEditState: function (size) {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            if (size) {
                obj.css({ "width": size.width, "height": size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
            //            var h = this.shell.Title.height() + this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            this.shell.Container.height(80);
            this.shell.Container.width(180);
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
//                obj.resizable({
//                    minHeight: 60,
//                    minWidth: 80
//                });
            }
        },

        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
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
                case "LabelBasicProperty":
                    if (layoutManagement.property.type == 1) {
                        var $UI = $('#'+ this.shell.ID).find('.LabelPor');
                        var theme = this.Get("ThemeName");
                        if( _Value.bgColor == ""){
                            this.ChangeTheme(theme);
                        }
                        if(_Value.LeftFillet1!=null && _Value.LeftFillet1!=""){
                            $(this.Get('HTMLElement')).css("border-top-left-radius", _Value.LeftFillet1 + "px");
                        }
                        if(_Value.RightFillet1!=null && _Value.RightFillet1!=""){
                            $(this.Get('HTMLElement')).css("border-top-right-radius", _Value.RightFillet1 + "px");
                        }
                        if(_Value.LeftFillet2!=null && _Value.LeftFillet2!=""){
                            $(this.Get('HTMLElement')).css("border-bottom-left-radius", _Value.LeftFillet2 + "px");
                        }
                        if(_Value.RightFillet2!=null && _Value.RightFillet2!=""){
                            $(this.Get('HTMLElement')).css("border-bottom-right-radius", _Value.RightFillet2 + "px");
                        }
                        if(_Value.fontSize!=null && _Value.fontSize!=""){
                            $('#' + this.shell.ID).find('#labelObjId').css({ "font-size": "" + _Value.fontSize + "px" });
                        }
                        if(_Value.fontColor!=null && _Value.fontColor!=""){
                            $('#' + this.shell.ID).find('#labelObjId').css({ "color": "" + _Value.fontColor + "" });
                        }
                        if(_Value.fontWeight!=null && _Value.fontWeight!=""){
                            $('#' + this.shell.ID).css({ "font-weight": "" + _Value.fontWeight + "" });
                        }
                        if(_Value.fontFamily!=null && _Value.fontFamily!=""){
                            $('#' + this.shell.ID).css({ "font-family": "" + _Value.fontFamily + "" });
                        }
                        if (_Value.IsShowText == true) {
                            $('#' + this.shell.ID).find('#labelObjId').text(_Value.FontText);
                            $('#' + this.shell.ID).find('#labelObjId').css({ "font-size": "" + _Value.fontSize + "px" });
                            $('#' + this.shell.ID).find('#labelObjId').css({ "color": "" + _Value.fontColor + "" });
                        }
                        else {
                            //                            $('#'+ this.shell.ID).find('#labelObjId').text(_Value.DataFont);
                            this.Set('Entity', _obj.Get('Entity'));
                            $('#' + this.shell.ID).find('.LabelPor').css({ "font-size": "" + _Value.fontSize + "px" });
                            $('#' + this.shell.ID).find('.LabelPor').css({ "color": "" + _Value.fontColor + "" });
                        }
                        //20130114 倪飘 解决基本label控件中设置背景颜色以后勾选右侧背景透明，并点击"应用"，返回整体页面，再次双击进入属性设置界面中基本设置直接点击："应用"，结果，控件显示背景颜色而背景透明复选框为勾选状态问题
//                        if (_Value.isTransparent == null) {
//                            $(this.Get('HTMLElement')).css({ "background-color": "" + _Value.otherBgColorIsTransparent + "" });
//                            $(this.Get('HTMLElement')).css("background", "none");
//                        } else {
//                            $(this.Get('HTMLElement')).css({ "background-color": "" + _Value.bgColor + "" });
//                        }
                        if(_Value.bgColor!=null && _Value.bgColor!=""){
                            if(typeof(_Value.bgColor) === "string"){
                                if (_Value.isTransparent == null) {
                                    $(this.Get('HTMLElement')).css({ "background-color": "" + _Value.otherBgColorIsTransparent + "" });
                                    $(this.Get('HTMLElement')).css("background", "none");
                                } else {
                                    $(this.Get('HTMLElement')).css({ "background-color": "" + _Value.bgColor + "" });
                                }
                            }else{
                                var oBackgroundValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(_Value.bgColor);
                                if(oBackgroundValue.BolIsTransfor!="false"){
                                    $(this.Get('HTMLElement')).css({"background":"none","background-color":"none"});
                                }else{
                                    $(this.Get('HTMLElement')).css(_Value.bgColor.value);
                                }
                            }
                        }

                        // $("#"+propertyLabel.shell.BasicID).css({" text-align":""+fontPosition+""});  labelObjId
                        $UI.css({"border-width":""+_Value.borderWidth+""});
                        $UI.css({"border-color":""+_Value.borderColor+""});
                        if(_Value.hrefAddress != "" ||_Value.InsideLinkAddress !=""){
                           // $UI.find("#labelObjId").css({"text-decoration":"underline", "cursor":"pointer"});
                            $("#" + ThisProPerty.ID).find("#labelObjId").addClass("labelCssHover");
                        }else{
                            $("#" + ThisProPerty.ID).find("#labelObjId").removeClass("labelCssHover")
                        }
                    }
                    break;
                    var self = _obj;
                    //20130114 倪飘 解决控件库-基本控件，标签基本设置，内部导航页面名称-返回整体页面点击文字没有新建页面跳转到已有文件问题
                case "hrefUrl":
                    if (layoutManagement.property.type == 1) {
                        var LabelBasicProperty = _obj.Get('LabelBasicProperty');
                        $('#' + _obj.shell.ID).find("#labelObjId").unbind('click'); //移除之前的点击事件
                        $('#' + _obj.shell.ID).find("#labelObjId").bind('click', function () {  //如果在Div中有其他的块.用这个方法绑定事件

                            // alert('LabelPor点击事件')
                            if (LabelBasicProperty.hrefAddress == "" && LabelBasicProperty.InsideLinkAddress == undefined) {
                                //  alert("没有链接地址！");
                                return;
                            }
                            if (LabelBasicProperty.IsLink) {
                                if (LabelBasicProperty.hrefAddress != "") {
                                    //  alert("外链");
                                    window.open(LabelBasicProperty.hrefAddress, LabelBasicProperty.OpenPosition); //打开外部链接
                                }
                            } else {
                                if (LabelBasicProperty.InsideLinkAddress != undefined && LabelBasicProperty.InsideLinkAddress != "") {
                                    //                                    Agi.Edit.OpenPage(LabelBasicProperty.InsideLinkAddress); //打开内部链接
                                    var path = Agi.ViewServiceAddress + LabelBasicProperty.InsideLinkAddress;
                                    //var path = Agi.ViewServiceAddress + filename;
                                    window.open(path);
                                    // alert("内链");
                                }
                            }
                        });
                        if (LabelBasicProperty.hrefAddress != "" || LabelBasicProperty.InsideLinkAddress != "") {
                            //20130514 倪飘 解决bug，标签控件中输入文本，点击勾选链接后再次点击取消链接勾选状态，结果控件中文本存在下划线。
                            if (LabelBasicProperty.IsLink != null) {
                                // $UI.find("#labelObjId").css({"text-decoration":"underline", "cursor":"pointer"});
                                $('#' + _obj.shell.ID).find("#labelObjId").addClass("labelCssHover");
                            } else {
                                $('#' + _obj.shell.ID).find("#labelObjId").removeClass("labelCssHover")
                            }
                        }
                    }
                    break;
                //输出参数yangyu  20130222
                case "LabelValue":
                    var ThisProPerty = _obj.Get("ProPerty");

                    Agi.Msg.PageOutPramats.PramatsChange({
                        "Type":Agi.Msg.Enum.Controls,
                        "Key":ThisProPerty.ID,
                        "ChangeValue":[
                            { 'Name':'LabelValue', 'Value':_Value }
                        ]
                    });
                    Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_obj, "Type":Agi.Msg.Enum.Controls});
                    break;
                case "data"://用户选择了一个项目
                {
                    var data = _ControlObj.Get('data');
                    if(data.selectedValue.value){
                        //alert('您选择了:'+data.selectedValue.value +'\n'+ data.selectedValue.text);
                        var ThisProPerty = _ControlObj.Get("ProPerty");
                        Agi.Msg.PageOutPramats.PramatsChange({
                            'Type': Agi.Msg.Enum.Controls,
                            'Key': ThisProPerty.ID,
                            'ChangeValue': [{ 'Name': 'selectedValue', 'Value': data.selectedValue.value }]
                        });
                        Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_obj,"Type":Agi.Msg.Enum.Controls});
                    }
                }break;
                case "Entity"://实体
                {
                    var entity = _obj.Get('Entity');
                    if(entity&&entity.length){
                        BindDataByEntity(_obj,entity[0]);
                    }else{
                        var $UI = $('#'+ self.shell.ID);
                        $UI.find('#labelObjId').text('');
                    }
                }break;
            }//end switch

        function BindDataByEntity(controlObj, et) {
            var self = controlObj;
            if (!et.IsShareEntity) {
                Agi.Utility.RequestData2(et, function (d) {
                    var getLabelProperty = controlObj.Get("LabelBasicProperty");
                    //修改列
                    if (self.IsChangeEntity) {
                        getLabelProperty.selectTextField = d.Columns[0];
                        getLabelProperty.selectValueField = d.Columns[0];
                        self.IsChangeEntity = false;
                    }
                    var $UI = $('#' + controlObj.shell.ID);
                    $UI.find('#labelObjId').text(getLabelProperty.FontText);

                    //                    var data = d.length ? d:[d];
                    //                    var columns = et.Columns.length?et.Columns:[et.Columns];
                    //                    et.Data = data;
                    var data = d.Data.length ? d.Data : [];
                    var columns = d.Columns;
                    et.Data = data;
                    et.Columns = d.Columns;
                    var textField = getLabelProperty && getLabelProperty.labelTextField ? getLabelProperty.labelTextField : columns[0];
                    var valueField = getLabelProperty && getLabelProperty.labelValueField ? getLabelProperty.labelValueField : columns[0];
                    if (getLabelProperty.labelTextField == undefined) {
                        getLabelProperty.labelTextField = textField
                    }
                    if (getLabelProperty.labelValueField == undefined) {
                        getLabelProperty.labelValueField = valueField;
                    }
                    //20130509 倪飘 解决bug，基本label控件中输入文本并应用，返回整体页面以后直接拖入数据，控件中显示的是拖入的数据的值而不是之前设置的文本
                    if (getLabelProperty.FontText === "") {
                        $(data[0]).each(function (i, dd) {
                            $UI.find('#labelObjId').val(dd[valueField]);
                            $UI.find('#labelObjId').text(dd[textField]);
                            //                        getLabelProperty.DataFont = dd[textField]; //记录下数据源中的数据
                        });
                    }
                    else {
                        AgiCommonDialogBox.Alert("当标签文本为空时才能显示绑定数据值。");
                    }
                    // controlObj.ReBindEvents();
                    // menu.find('li:eq(0)').click();
                });
            } else {
                BindDataByJson.call(self, et, et);
            }
            return;
        }

        //20130117 倪飘 集成共享数据源
        function BindDataByJson(et, d) {
            var controlObj = this;
            var getLabelProperty = controlObj.Get("LabelBasicProperty");
            //修改列
            if (controlObj.IsChangeEntity && controlObj.IsAnotherData) {
                getLabelProperty.selectTextField = d.Columns[0];
                getLabelProperty.selectValueField = d.Columns[0];
                controlObj.IsChangeEntity = false;
                controlObj.IsAnotherData = false;
            }
            var $UI = $('#' + controlObj.shell.ID);
            $UI.find('#labelObjId').text(getLabelProperty.FontText);

            //                    var data = d.length ? d:[d];
            //                    var columns = et.Columns.length?et.Columns:[et.Columns];
            //                    et.Data = data;
            var data = d.Data.length ? d.Data : [];
            var columns = d.Columns;
            et.Data = data;
            et.Columns = d.Columns;
            var textField = getLabelProperty && getLabelProperty.labelTextField ? getLabelProperty.labelTextField : columns[0];
            var valueField = getLabelProperty && getLabelProperty.labelValueField ? getLabelProperty.labelValueField : columns[0];
            if (getLabelProperty.labelTextField == undefined) {
                getLabelProperty.labelTextField = textField
            }
            if (getLabelProperty.labelValueField == undefined) {
                getLabelProperty.labelValueField = valueField;
            }
            //20130509 倪飘 解决bug，基本label控件中输入文本并应用，返回整体页面以后直接拖入数据，控件中显示的是拖入的数据的值而不是之前设置的文本
            if (getLabelProperty.FontText === "") {
                $(data[0]).each(function (i, dd) {
                    $UI.find('#labelObjId').val(dd[valueField]);
                    $UI.find('#labelObjId').text(dd[textField]);
                    //                        getLabelProperty.DataFont = dd[textField]; //记录下数据源中的数据
                });
            }
            else {
                AgiCommonDialogBox.Alert("当标签文本为空时才能显示绑定数据值。");
            }
        }
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            /*  var ConfigObj = new Agi.Script.StringBuilder(); *//*配置信息数组对象*//*
             ConfigObj.append("<Control>");
             ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>"); *//*控件类型*//*
             ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>"); *//*控件属性*//*
             ConfigObj.append("<ControlBaseObj>" + ProPerty.BasciObj[0].id + "</ControlBaseObj>"); *//*控件基础对象*//*
             ConfigObj.append("<HTMLElement>" + ProPerty.BasciObj[0].id + "</HTMLElement>"); *//*控件的外壳HTML元素信息*//*

             ConfigObj.append("<Entity>" + JSON.stringify(this.Get("Entity")) + "</Entity>"); *//*控件的外壳HTML元素信息*//*
             ConfigObj.append("<Position>" + JSON.stringify(this.Get("Position")) + "</Position>"); *//*控件位置信息*//*
             ConfigObj.append("<LabelBasicProperty>" + JSON.stringify(this.Get("LabelBasicProperty")) + "</LabelBasicProperty>"); *//*控件位置信息*//*
             ConfigObj.append("<ThemeInfo>" + JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>"); *//*控件位置信息*//*
             ConfigObj.append("</Control>");
             return ConfigObj.toString(); //返回配置字符串*/
            var LabelContorl = {
                Control:{
                    ControlType:null,//控件类型
                    ControlID:null, //控件ID
                    ControlBaseObj:null,//控件对象
                    HTMLElement:null,//控件的外壳HTML元素信息
                    Entity:null, // 实体
                    Position:null,// 控件位置信息
                    LabelBasicProperty: null, //控件属性
                    hrefUrl: null,
                    ThemeName:null
                }
            }// 配置信息数组对象
            LabelContorl.Control.ControlType = this.Get("ControlType");
            LabelContorl.Control.ControlID = ProPerty.ID;
            LabelContorl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            LabelContorl.Control.HTMLElement= ProPerty.BasciObj[0].id;
            LabelContorl.Control.Entity = this.Get("Entity");
            LabelContorl.Control.Position = this.Get("Position");
            LabelContorl.Control.LabelBasicProperty = this.Get("LabelBasicProperty");
            LabelContorl.Control.hrefUrl = this.Get("hrefUrl");
            LabelContorl.Control.ThemeName = this.Get("ThemeName");
           // LabelContorl.Control.script = this.getScriptCode();
            return  LabelContorl.Control; //返回配置字符串
        },
        //获得Label控件的配置信息
        CreateControl: function (_Config, _Target) {
           // this.setScriptCode(_Config.script);
            this.Init(_Target,_Config.Position,_Config.HTMLElement);
            if(_Config!=null){
                var LabelBasicProperty = null;
                if(_Target!=null && _Target!=""){
                    var _Targetobj=$(_Target);
                    this.Set("Position",_Config.Position);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    //20130122 倪飘 label应用样式和基本属性优先级修改
                    this.Set("ThemeName", _Config.ThemeName);
                    if (_Config.hasOwnProperty("ThemeName")) {
                        this.ChangeTheme(_Config.ThemeName);
                    }

                    LabelBasicProperty = _Config.LabelBasicProperty;
                    this.Set("LabelBasicProperty",LabelBasicProperty);

//                    $("#" + ThisProPerty.ID).css({"font-size":""+LabelBasicProperty.fontSize+"px"});
//                    $("#" + ThisProPerty.ID).css({"color":""+LabelBasicProperty.fontColor+""});
//                    $('#'+ this.shell.ID).css({"font-weight":""+LabelBasicProperty.fontWeight+""});
//                    $('#'+ this.shell.ID).css({"font-family":""+LabelBasicProperty.fontFamily+""});
//                    if(LabelBasicProperty.otherBgColorIsTransparent != ""){ //控件背景透明杯选中
//                        $('#'+ this.shell.ID).css({"background-color":""+LabelBasicProperty.otherBgColorIsTransparent+""});
//                    }else{
//                        $('#'+ this.shell.ID).css({"background-color":""+LabelBasicProperty.bgColor+""});
//                    }

                    //20130114 倪飘 解决控件库-基本控件，标签基本设置，内部导航页面名称-返回整体页面点击文字没有新建页面跳转到已有文件问题
                    _Config.hrefUrl = _Config.hrefUrl;
                    this.Set("hrefUrl", _Config.hrefUrl);

                    var PagePars={Width:_Targetobj.width(),Height:_Targetobj.height()};
                    _Config.Position.Left=parseFloat(_Config.Position.Left);
                    _Config.Position.Right=parseFloat(_Config.Position.Right);
                    _Config.Position.Top=parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom=parseFloat(_Config.Position.Bottom);

                    var ThisControlPars={Width:parseInt(PagePars.Width-(PagePars.Width*(_Config.Position.Left+_Config.Position.Right))),
                        Height:parseInt(PagePars.Height-(PagePars.Height*(_Config.Position.Top+_Config.Position.Bottom)))};
                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left',(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");
                    //20130111 倪飘 解决控件库-基本控件，标签基本设置，文本-预览显示所拖入数据的第一列的第一个，没有显示123问题
                    if (LabelBasicProperty.IsShowText==true) {
                        $('#' + this.shell.ID).find('#labelObjId').text(LabelBasicProperty.FontText);
                    }
                    else {
//                        $('#' + this.shell.ID).find('#labelObjId').text(LabelBasicProperty.DataFont);
                        this.Set("Entity", _Config.Entity);
                    }
                   
                }
            }
//            if(this.IsPageView){
//                this.shell.Container.css('height',( this.shell.Container.height() +15) +'px' );
//            }
        },
        ChangeTheme:function(_themeName){
            var Me=this;
            //1.根据当前控件类型和样式名称获取样式信息
            var LabelStyleValue=Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"),_themeName);

            //2.保存主题名称
            Me.Set("ThemeName",_themeName);
         // this.Set("LabelBasicProperty",LabelStyleValue); //主题样式给控件

            //3.应用当前控件的信息
            Agi.Controls.Label.OptionsAppSty(LabelStyleValue,Me);
        } //更改控件样式
    },true);
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */
Agi.Controls.Label.OptionsAppSty=function(_StyConfig,_Label){
    if(_StyConfig !=null){
        var $UI = $('#'+ _Label.shell.ID).find('.LabelPor');
        $(_Label.Get('HTMLElement')).css("border-top-left-radius", _StyConfig.LeftFillet1 + "px");
        $(_Label.Get('HTMLElement')).css("border-top-right-radius", _StyConfig.RightFillet1 + "px");
        $(_Label.Get('HTMLElement')).css("border-bottom-left-radius", _StyConfig.LeftFillet2 + "px");
        $(_Label.Get('HTMLElement')).css("border-bottom-right-radius", _StyConfig.RightFillet2 + "px");

        $('#'+ _Label.shell.ID).find('#labelObjId').css({"font-size":""+_StyConfig.fontSize+"px"});
        $('#'+ _Label.shell.ID).find('#labelObjId').css({"color":""+_StyConfig.fontColor+""});
        $('#'+ _Label.shell.ID).css({"font-weight":""+_StyConfig.fontWeight+""});
        $('#'+ _Label.shell.ID).css({"font-family":""+_StyConfig.fontFamily+""});
        if(_StyConfig.FontText){
            $('#'+ _Label.shell.ID).find('#labelObjId').text(_StyConfig.FontText);
            $('#'+ _Label.shell.ID).find('#labelObjId').css({"font-size":""+_StyConfig.fontSize+"px"});
            $('#'+ _Label.shell.ID).find('#labelObjId').css({"color":""+_StyConfig.fontColor+""});
        }
        else if(_StyConfig.DataFont){
            $('#'+ _Label.shell.ID).find('#labelObjId').text(_StyConfig.DataFont);
            $('#'+ _Label.shell.ID).find('.LabelPor').css({"font-size":""+_StyConfig.fontSize+"px"});
            $('#'+ _Label.shell.ID).find('.LabelPor').css({"color":""+_StyConfig.fontColor+""});
        }
        if(_StyConfig.isTransparent != null){
            $(_Label.Get('HTMLElement')).css({"background-color":""+_StyConfig.otherBgColorIsTransparent+""});
        }else{
            $(_Label.Get('HTMLElement')).css({"background":""+_StyConfig.background+""});
            $(_Label.Get('HTMLElement')).css({"background-color":""+_StyConfig.bgColor+""});
        }
        $UI.css({"border-width":"none"});
        $UI.css({"border-color":"none"});
        if (_StyConfig.hrefAddress != "" && _StyConfig.InsideLinkAddress != "" && _StyConfig.hrefAddress != undefined && _StyConfig.InsideLinkAddress != undefined) {
            $UI.css({ "text-decoration": "underline", "cursor": "pointer" });
        }
    }
}


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitLabel=function(){
    return new Agi.Controls.Label();
}

//Label 自定义属性面板初始化显示
Agi.Controls.LabelPropertyInit = function (propertyLabel) {
    var isSaFari= navigator.userAgent.indexOf("Safari")
    if(isSaFari){
        $("#LabelPropertyPanel").removeClass("BasicProperty_Radius");
        $("#LabelPropertyPanel").attr('className', 'BasicProperty_RadiusforSaFari');
    }
    var selfID = $("#"+propertyLabel.shell.BasicID)//.find('#labelObjId')
    var url =propertyLabel.Get("hrefUrl");
    var ThisProItems = [];
    var getLabelBasicProperty = Agi.Edit.workspace.currentControls[0].Get("LabelBasicProperty");
    var  ItemContent = new Agi.Script.StringBuilder();
    //数据绑定
    var bindHTML=null;
    bindHTML = $('<form class="form-horizontal">'+
        '</form>');
    var entity = propertyLabel.Get('Entity');
    $(['显示内容']).each(function(i,label){
        bindHTML.append('<div class="control-group">'+
            '<label style="display: block;margin-top: 6px;width:85px;font-family:微软雅黑,arial;" class="control-label LableProBindConfigLable" for="inputEmail">'+label+'</label>'+
            '<div class="controls"> '+
            '<select data-field="'+label+'" placeholder="" class="input"></select>'+
            '</div>'+
            '</div>');
    });
    var options = null;
    if(entity.length){
        if(entity[0].Columns){
            options="";
            $(entity[0].Columns).each(function(i,col){
                options += "<option value='"+col+"'>"+col+"</option>"
            });
        }
    }
    bindHTML.find('select').append($(options)).bind('change',{sels:bindHTML.find('select')},function(e){
        $(e.data.sels).each(function(i,sel){
            var f = $(sel).data('field');
            if(f=='显示内容'){
                getLabelBasicProperty.labelTextField = $(sel).val();
                // $("#"+propertyLabel.shell.BasicID).text(entity[getLabelBasicProperty.labelTextField]);
                //                BindDataByChange(entity[0]);
                Agi.Edit.workspace.currentControls[0].Set('Entity', propertyLabel.Get('Entity'));
            }
        });
        propertyLabel.Set('LabelBasicProperty',getLabelBasicProperty);
    }).each(function(i,sel){
            var f = $(sel).data('field');
            //  $(sel).val(getLabelBasicProperty.labelTextField);
            if(f=='显示内容'){
                $(sel).val(getLabelBasicProperty.labelTextField);
            }
        });
    var dataFont =undefined;
    function BindDataByChange(et){
        Agi.Utility.RequestData2(et,function(d){
            var data = d.Data.length ? d.Data : [];
            var columns = et.Columns.length?et.Columns:[et.Columns];
            et.Data = data
            $(data[0]).each(function(i,dd){
                selfID.find('#labelObjId').text(dd[getLabelBasicProperty.labelTextField]);
                dataFont=dd[getLabelBasicProperty.labelTextField];
            });
        });
        return;
    }
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"绑定配置",DisabledValue:1,ContentObj:bindHTML}));

    //Agi.Controls.objLabel = changeColor;
    //基本属性
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicProperty_Radius' id='LabelPropertyPanel'>");
    ItemContent.append("<table class='LableRadiusTable'>");
    ItemContent.append("<tr>")
    ItemContent.append("<td class='prortityLabelTabletd0'>字体大小</td><td class='prortityLabelTabletd1'><div class='selectDivClass'>" +
        "<input id='FontSizeDivId' type='text' value=''/>"+
        "</td></div>")
    ItemContent.append("<td class='prortityLabelTabletd0'>字体样式</td><td class='prortityLabelTabletd1'><div><select id='FontFamilySelect'>" +
        "<option selected value='微软雅黑'>微软雅黑</option>"+
        "<option value='宋体'>宋体</option>"+
        "<option value='楷体'>楷体</option>"+
        "<option value='黑体'>黑体</option>"+
        "<option value='隶书'>隶书</option>"+
        "<option value='仿宋'>仿宋</option>"+
        "<option value='华文彩云'>华文彩云</option>"+
        "<option value='华文琥珀'>华文琥珀</option>"+
        "<option value='华文隶书'>华文隶书</option>"+
        "</select></div></td>");
    ItemContent.append("</tr>")
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityLabelTabletd0'>文  本</td><td class='prortityLabelTabletd1'><div class='selectDivClass'>" +
        "<input type='text' id='FontTextInput' value=''/></div></td>");
    ItemContent.append("<td class='prortityLabelTabletd0'>字体粗细</td><td class='prortityLabelTabletd1'><div><select id='FontWeightSelect'>" +
        "<option selected value='normal'>正常</option>" +
        "<option value='bold' >粗体</option>" +
        "<option value='100' >细体</option>" +
        "</select></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr class='colorTrID'>")
    ItemContent.append("<td class='prortityLabelTabletd0'>字体颜色</td><td class='prortityLabelTabletd1'><div class='colorDivClass'>" +
        "<input type='text' id='FontColorDivId' name='字体颜色' style='height: 35px'></div></td>")
    ItemContent.append("<td class='prortityLabelTabletd0' >背景颜色</td><td class='prortityLabelTabletd1'><div class='colorDivClass'style='display:inline;'>" +
        "<input id='BackgroundColorDivId' type='text' name='背景颜色' style='height: 35px;' readonly/>" +
        "<input type='checkbox' value='transparent' id='bgColorTransparent' title='透明色'/>" +
        "</div></td>")
    ItemContent.append("</tr>")
    ItemContent.append("<tr>");
//    ItemContent.append("<tr>");
//    ItemContent.append("<td class='prortityLabelTabletd0'>启用阴影</td><td class='prortityLabelTabletd1'><input id='FilterShadow' type='checkbox' name='name' value='' /></td>");
//    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityLabelTabletd0'>左上角半径</td><td class='prortityLabelTabletd1'><input id='LeftFillet1' type='number' value='0' min='0' max='100'/></td>");
    ItemContent.append("<td class='prortityLabelTabletd0'>右上角半径</td><td class='prortityLabelTabletd1'><input id='RightFillet1' type='number' value='0' min='0' max='100'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityLabelTabletd0'>左下角半径</td><td class='prortityLabelTabletd1'><input id='LeftFillet2' type='number' value='0' min='0' max='100'/></td>");
    ItemContent.append("<td class='prortityLabelTabletd0'>右下角半径</td><td class='prortityLabelTabletd1'><input id='RightFillet2' type='number' value='0' min='0' max='100'/></td>");
    ItemContent.append("</tr>");
//    ItemContent.append("<tr class='colorTrID'>");
//    ItemContent.append("<td class='prortityLabelTabletd0'>边框颜色</td><td class='prortityLabelTabletd1'><div class='colorDivClass'>" +
//        "<input type='text' id='borderColorDivId'  name='边框颜色' style='height: 35px' ></div></td>")
//    ItemContent.append("<td class='prortityLabelTabletd0'>边框宽度</td><td class='prortityLabelTabletd1'><div class='selectDivClass'>" +
//        "<select id='borderWidthDivId'>" +
//        "<option selected value='1px'>1px</option>" +
//        "<option value='2px'>2px</option>"+
//        "<option value='3px'>3px</option>"+
//        "<option value='4px'>4px</option>"+
//        "<option value='5px'>5px</option>"+
//        "</select>" +
//        "</div></td>");
//    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityLabelTabletd0' >链接</td><td class='prortityLabelTabletd1' colspan='3'>" +
        "<input id='IsLink' type='checkbox' name='name' value='' />" +
        "<input id='LinkAddress' type='text' name='name' value='' disabled='disabled' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityLabelTabletd0'colspan=''>弹出位置</td><td class='prortityLabelTabletd1'colspan='3' align='center'><div" +
        " align='center' id='OpenPositionDiv'>" +
        "<select id='OpenPosition' disabled='disabled' >" +
        "<option value='_blank'>新空白界面</option>" +
        "<option selected value='_parent'>当前界面</option></select></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityLabelTabletd0'colspan='2' id='insideLinkDiv'>内部导航页面名称</td><td class='prortityLabelTabletd1'colspan='2'>" +
        "<input id='InsideLinkAddress' type='text' name='name' value='' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityLabelTabletd0'colspan='4'><input type='button' value='应用' id='Labelpropertychange' class='btnclass'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
//    function changeColor(col,pName){
//        $(col).spectrum({
//            showInput: true,
//            showPalette: true,
//            palette: [
//                //['transparent'],
//                ['black', 'white'],
//                [ 'blanchedalmond', 'rgb(255, 128, 0);'],
//                ['hsv 100 70 50','red'],
//                [ 'yellow', 'green'],
//                [ 'blue', 'violet']
//            ],
//            cancelText: "取消",
//            chooseText: "选择",
//            change: function(color){
//                if(pName=='字体颜色'){
//                    getLabelBasicProperty.fontColor = color.toHexString();
//                    $("#FontColorDivId").val( color.toHexString());
//                    $("#"+propertyLabel.shell.BasicID).css({"color":""+ color.toHexString()+""});
//                }
//                if(pName=='背景颜色'){
//                    getLabelBasicProperty.bgColor = color.toHexString();
//                    $("#BackgroundColorDivId").val(color.toHexString());
//                    $("#"+propertyLabel.shell.BasicID).css({"background-color":""+ color.toHexString()+""});
//                }
//                if(pName=='边框颜色'){
//                    getLabelBasicProperty.borderColor = color.toHexString();
//                    $("#borderColorDivId").val(color.toHexString()) ;
//                    $("#"+propertyLabel.shell.BasicID).css({"border-color":""+ color.toHexString()+""});
//                }
//                alert("OnLoad");
//            }
//        })
//    }//FontColorInputId
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"基本设置", DisabledValue:1, ContentObj:FilletObj }));
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
//        var itemtitle = _item.Title;
//        if (_item.DisabledValue == 0) {
//            itemtitle += "禁用";
//        } else {
//            itemtitle += "启用";
//        }
//        alert(itemtitle);
    }
    $("#FontSizeDivId").val(getLabelBasicProperty.fontSize);
    $("#FontColorDivId").val(getLabelBasicProperty.fontColor);
    $("#FontWeightSelect").val(getLabelBasicProperty.fontWeight);
    $("#FontFamilySelect").val(getLabelBasicProperty.fontFamily);
    $("#BackgroundColorDivId").val(getLabelBasicProperty.bgColor);
    $("#FontTextInput").text(getLabelBasicProperty.FontText);
    $("#FontTextInput").val(getLabelBasicProperty.FontText);
    $("#borderWidthDivId").val(getLabelBasicProperty.borderWidth);
    $("#borderColorDivId").val(getLabelBasicProperty.borderColor);
    $("#IsLink").attr("checked",getLabelBasicProperty.IsLink);
    if($("#IsLink").attr("checked")=="checked"){
        isLink ="checked";
        //  alert($(this).attr("checked")=="checked");
        $("#LinkAddress").attr( "disabled",null);
        $("#OpenPosition").attr("disabled",null);
        isDisabledLinkAddress = null;
        isDisabledOpenPosition = null;
        $("#LinkAddress").val("http://");
        $("#InsideLinkAddress").attr("disabled","disabled");
        $("#InsideLinkAddress").val("");
        isDisabledInsideLinkAddress = "disabled";
    }else{
        isLink =null;
        //lert($(this).attr("checked")=="checked");
        $("#LinkAddress").attr("disabled","disabled");
        $("#OpenPosition").attr("disabled","disabled");
        $("#InsideLinkAddress").attr("disabled",null);
        $("#LinkAddress").val("");
        isDisabledLinkAddress ="disabled";
        isDisabledOpenPosition = "disabled";
        isDisabledInsideLinkAddress = null;
    }
    $("#LinkAddress").val(getLabelBasicProperty.hrefAddress);
    $("#InsideLinkAddress").val(getLabelBasicProperty.InsideLinkAddress);
    $("#OpenPosition").val(getLabelBasicProperty.OpenPosition);
    $("#LinkAddress").attr("disabled",getLabelBasicProperty.IsDisabledhrefAddress);
    $("#OpenPosition").attr("disabled",getLabelBasicProperty.IsDisabledOpenPosition);
    $("#InsideLinkAddress").attr("disabled",getLabelBasicProperty.IsDisabledInsideLinkAddress);

    $("#FilterShadow").attr("checked",getLabelBasicProperty.IsShadow);
    $("#bgColorTransparent").attr("checked",getLabelBasicProperty.isTransparent);

    $("#LeftFillet1").val(getLabelBasicProperty.LeftFillet1);
    $("#RightFillet1").val(getLabelBasicProperty.RightFillet1);
    $("#LeftFillet2").val(getLabelBasicProperty.LeftFillet2);
    $("#RightFillet2").val(getLabelBasicProperty.RightFillet2);
    //打开外部连接
    var isLink;
    var isDisabledLinkAddress;
    var isDisabledOpenPosition;
    var isDisabledInsideLinkAddress ;
    var isShadow;
    var istransparent;
    $("#IsLink").live('click', function () {
        if($(this).attr("checked")=="checked"){
            isLink ="checked";
            //  alert($(this).attr("checked")=="checked");
            $("#LinkAddress").attr( "disabled",null);
            $("#OpenPosition").attr("disabled",null);
            isDisabledLinkAddress = null;
            isDisabledOpenPosition = null;
            $("#LinkAddress").val("http://");
            $("#InsideLinkAddress").attr("disabled","disabled");
//            $("#InsideLinkAddress").val("");
            isDisabledInsideLinkAddress = "disabled" ;
        }else{
            isLink =null;
            //lert($(this).attr("checked")=="checked");
            $("#LinkAddress").attr("disabled","disabled");
            $("#OpenPosition").attr("disabled","disabled");
            $("#InsideLinkAddress").attr("disabled",null);
//            $("#LinkAddress").val("");
            isDisabledLinkAddress ="disabled";
            isDisabledOpenPosition = "disabled";
            isDisabledInsideLinkAddress = null;
        }
    });
    var strcolor;
    $("#bgColorTransparent").live('click',function(){
        if($(this).attr("checked")=="checked"){
            istransparent = "checked";
            strcolor = $("#bgColorTransparent").val();
           // $("#BackgroundColorDivId").val(strcolor) ;
            // $("#BackgroundColorDivId").attr("readonly","readonly");
        } else{
            strcolor ="";
            istransparent=null;
            // $("#BackgroundColorDivId").attr("disabled",null);
        }
    });
    //-webkit-box-shadow: 0 0 3px #040d14; 阴影
    $("#FilterShadow").live('click', function () {
        if($(this).attr("checked")=="checked"){
            // alert($(this).attr("checked"));
            selfID.find('.LabelPor').css({"-webkit-box-shadow":"0 0 5px "+getLabelBasicProperty.borderColor});
            isShadow = "checked";
        }  else{
            selfID.find('.LabelPor').css({ "-webkit-box-shadow":"0 0 0"});
            isShadow = null;
        }
    });
    /*  //文本框中写入外部地址、hrefAddress
     //var hrefProperty = LabelFilter.Get("LabelFilter");//
     $("#LinkAddress").change(function(){
     var  hrefAddress =  $("#LinkAddress").val();

     //Agi.Edit.workspace.currentControls[0].Set('BasicProperty', getProperty);
     getLabelBasicProperty.Set('LabelBasicProperty',getLabelBasicProperty);//写入地址保存
     });
     //改变网站打开位置    OpenPosition
     $("#OpenPosition").change(function(){
     var openPositionText=$("#OpenPosition").val();
     if(openPositionText=="新空白界面"){
     getLabelBasicProperty.OpenPosition="_blank";
     }else if (openPositionText=="当前界面"){
     getLabelBasicProperty.OpenPosition="_parent";
     }
     getLabelBasicProperty.Set('LabelBasicProperty',getLabelBasicProperty);
     });

     //Agi.Edit.OpenPage(filename); 内部导航页面名称
     $("#InsideLinkAddress").change(function(){
     // alert("进入内部链接");
     var InsideLinkAddress = $("#InsideLinkAddress").val();
     alert(getLabelBasicProperty.InsideLinkAddress);
     getLabelBasicProperty.Set('LabelBasicProperty',getLabelBasicProperty);//内部链接地址保存
     });*/
    //调色板
    $("#FontColorDivId").spectrum({//字体颜色
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
            $("#FontColorDivId").val(color.toHexString());
            // $("#"+propertyLabel.shell.BasicID).css({"color":""+color.toHexString()+""});
        }
    });
    $("#BackgroundColorDivId").spectrum({//控件背景色
        showInput: true,
        showPalette: true,
        palette: [
            [],
            ['black', 'white'],
            ['blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50', 'red'],
            ['yellow', 'green'],
            ['blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function (color) {
            $("#BackgroundColorDivId").val(color.toHexString());
        }
    });
    $("#borderColorDivId").spectrum({//边框颜色
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
            $("#borderColorDivId").val(color.toHexString());
        }
    });
    $("#FontSizeDivId").change(function(){
//        var fontSize= $("#FontSizeDivId").val();
//        if(fontSize>"100") {
//          alert("请填写100以内的数值");
//            $("#FontSizeDivId").val("")
//            return;
//        }
//        $("#"+propertyLabel.Get("HTMLElement").id).css({"font-size":""+fontSize+"px"});
//		var  LabelProperty = {fontSize:$("#FontSizeDivId").val()};
//		 Agi.Edit.workspace.currentControls[0].Set('LabelBasicProperty', LabelProperty);
    });

    //点击应用
    var openPositionText;
    var  hrefAddress ;
    var InsideLinkAddress;
    $("#Labelpropertychange").live('click', function () {
        var LeftFillet1 = parseInt($("#LeftFillet1").val());
        var RightFillet1 = parseInt($("#RightFillet1").val());
        var LeftFillet2 = parseInt($("#LeftFillet2").val());
        var RightFillet2 = parseInt($("#RightFillet2").val());

        var fontSize= $("#FontSizeDivId").val();
        var fontColor = $("#FontColorDivId").val();
        var fontWeight = $("#FontWeightSelect").val(); // 字体粗细
        // alert(fontWeight);
        var fontFamily = $("#FontFamilySelect").val(); //字体样式
        // alert(fontFamily);
        var bgColor = $("#BackgroundColorDivId").val();
        var fontText = $("#FontTextInput").val();
        var borderWidth = $("#borderWidthDivId").val();
        var borderColor =  $("#borderColorDivId").val();
        if (fontText.trim() == "") {
            IsShowText = false;
        }
        else {
            IsShowText = false;
        }
        openPositionText=$("#OpenPosition").val();
        hrefAddress =  $("#LinkAddress").val();
        InsideLinkAddress = $("#InsideLinkAddress").val();
        if($("#IsLink").attr("checked")=="checked"){
            isLink ="checked";
            $("#InsideLinkAddress").val("");
        }else{
            isLink =null;
            $("#LinkAddress").val("");
        }
//        if(getLabelBasicProperty.FontText){
//            selfID.find('#labelObjId').text(getLabelBasicProperty.FontText);
//            selfID.find('#labelObjId').css({"font-size":""+getLabelBasicProperty.fontSize+"px"});
//            selfID.find('#labelObjId').css({"color":""+getLabelBasicProperty.fontColor+""});
//        }
//        else if(getLabelBasicProperty.labelTextField){
//            selfID.find('#labelObjId').text(getLabelBasicProperty.labelTextField);
//            selfID.find('.LabelPor').css({"font-size":""+getLabelBasicProperty.fontSize+"px"});
//            selfID.find('.LabelPor').css({"color":""+getLabelBasicProperty.fontColor+""});
//        }

        var LabelBasicProperty = {
            LeftFillet1:LeftFillet1,
            RightFillet1:RightFillet1,
            LeftFillet2:LeftFillet2,
            RightFillet2:RightFillet2,

            fontSize:fontSize,
            fontColor:fontColor,
            fontWeight:fontWeight,
            fontFamily:fontFamily,
            bgColor:bgColor,
            FontText:fontText,
            DataFont:dataFont,
            borderWidth:borderWidth,
            borderColor: borderColor,
            IsShowText:IsShowText,

            hrefAddress:hrefAddress ,
            OpenPosition:openPositionText,
            InsideLinkAddress:InsideLinkAddress,
            IsDisabledhrefAddress:isDisabledLinkAddress,
            IsDisabledOpenPosition:isDisabledOpenPosition,
            IsDisabledInsideLinkAddress :isDisabledInsideLinkAddress,

            IsLink:isLink,
            IsShadow:isShadow,
            isTransparent:istransparent,
            otherBgColorIsTransparent:strcolor

        }
        Agi.Edit.workspace.currentControls[0].FilterChange(LabelBasicProperty)
        // alert("FilterChange");
        url.OutsideLink = hrefAddress;
        url.OutsideLinkOpenPosition =openPositionText ;
        url.InsideLink = InsideLinkAddress;
        // url.Set("hrefUrl",url);
        Agi.Edit.workspace.currentControls[0].Set('hrefUrl', url);
    });
//    url.OutsideLink = hrefAddress;
//    url.OutsideLinkOpenPosition =openPositionText ;
//    url.InsideLink = InsideLinkAddress;
//    url.Set("hrefUrl",url);

//    //字体大小
//    $("#FontSizeDivId").change(function(){
//        var fontSize= $("#FontSizeDivId").val();
//        $("#"+propertyLabel.Get("HTMLElement").id).css({"font-size":""+fontSize+"px"});
//		var  LabelProperty = {fontSize:$("#FontSizeDivId").val()};
//		 Agi.Edit.workspace.currentControls[0].Set('LabelBasicProperty', LabelProperty);
//    });
//
//    //字体颜色
//    $("#FontColorDivId").change(function(){
//        var fontColor = $("#FontColorDivId").val(); /*$(this).find("option:selected").text();*/
//       $("#"+propertyLabel.Get("HTMLElement").id).css({"color":""+fontColor+""});
//	    LabelProperty = {fontColor:$("#FontColorDivId").val()};
//		Agi.Edit.workspace.currentControls[0].Set('LabelFilter', LabelProperty);
//    });
//
//
//    //背景颜色
//    $("#BackgroundColorDivId").change(function(){
//        var bgColor = $("#BackgroundColorDivId").val();
//        $("#"+propertyLabel.Get("HTMLElement").id).css({"background-color":""+bgColor+""});
//	     LabelProperty = {bgColor:$("#BackgroundColorDivId").val()};
//		Agi.Edit.workspace.currentControls[0].Set('LabelFilter', LabelProperty);
//    });
//
//    //文字位置
//    $("#FontPositionDivId").change(function(){
//        var fontPosition = $("#FontPositionDivId").val();
//        alert(fontPosition);
//       $("#"+propertyLabel.Get("HTMLElement").id).css({"align":""+fontPosition+""});
//	   LabelProperty = {fontPosition:$("#FontPositionDivId").val()};
//		Agi.Edit.workspace.currentControls[0].Set('LabelFilter', LabelProperty);
//    });
//
//    //边框宽度
//    $("#borderWidthDivId").change(function(){
//        var borderWidth = $("#borderWidthDivId").val();
//        $("#"+propertyLabel.Get("HTMLElement").id).css({"border-width":"solid "+borderWidth+""});
//		 LabelProperty = {borderWidth:$("#borderWidthDivId").val()};
//		Agi.Edit.workspace.currentControls[0].Set('LabelFilter', LabelProperty);
//    });
//
//    //边框颜色
//    $("#borderColorDivId").change(function(){
//        var borderColor =  $("#borderColorDivId").val();
//        $("#"+propertyLabel.Get("HTMLElement").id).css({"border-color":""+borderColor+""});
//		 LabelProperty = {borderColor:$("#borderColorDivId").val()};
//		 Agi.Edit.workspace.currentControls[0].Set('LabelFilter', LabelProperty);
//    });
//
    //圆角
//    $("#LeftFillet1").change(function () {
//        SetFillet();
//    });
//    $("#RightFillet1").change(function () {
//        SetFillet();
//    });
//    $("#LeftFillet2").change(function () {
//        SetFillet();
//
//    });
//    $("#RightFillet2").change(function () {
//        SetFillet();
//    });
//}
//
//function SetFillet() {
//    var LeftFillet1 = parseInt($("#LeftFillet1").val());
//    var RightFillet1 = parseInt($("#RightFillet1").val());
//    var LeftFillet2 = parseInt($("#LeftFillet2").val());
//    var RightFillet2 = parseInt($("#RightFillet2").val());
//    if (LeftFillet1 >= 0 && RightFillet1 >= 0 && LeftFillet2 >= 0 && RightFillet2 >= 0) {
//        var LabelBasicProperty = { LeftFillet1: LeftFillet1, RightFillet1: RightFillet1, LeftFillet2: LeftFillet2, RightFillet2: RightFillet2, FilterBgColor: FilterBgColor };
////        _Panel.Set("PanelFilter", PanelFilter);
//        Agi.Edit.workspace.currentControls[0].FilterChange(LabelBasicProperty)
//    } else {
//        if (LeftFillet1 < 0) {
//            $("#LeftFillet1").val(0);
//            SetFillet();
//        }
//        if (RightFillet1 < 0) {
//            $("#RightFillet1").val(0);
//            SetFillet();
//        }
//        if (LeftFillet2 < 0) {
//            $("#LeftFillet2").val(0);
//            SetFillet();
//        }
//        if (RightFillet2 < 0) {
//            $("#RightFillet2").val(0);
//            SetFillet();
//        }
//    }
}
function Labelbutton(_obj, ControlObj) {
    var LabelValue = $('#' + ControlObj.shell.ID).find('#labelObjId').val();
    ControlObj.Set("LabelValue", LabelValue);
}
