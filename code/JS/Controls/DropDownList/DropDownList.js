/** 
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-17
 * Time: 上午9:15
 * To change this template use File | Settings | File Templates.
 * * DropDownList 下拉列表控件
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.DropDownList = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        ReBindRelationData:function(){
            this.Set('Entity',this.Get('Entity'));
        },
        GetEntityData:function(){//获得实体数据
            var entity = this.Get('Entity')[0];
            if(entity !=undefined && entity !=null){
                return entity.Data;
            }else{
                return null;
            }
        },
        SetValue:function(_string){
            var self = this;
            var entity = this.Get('Entity')[0];
            var $UI = $('#'+ this.shell.ID);
            var data = entity.Data;
            var BasicProperty = this.Get('BasicProperty');
            $(data).each(function(i,d){
                var  val = d[BasicProperty.selectValueField] ? d[BasicProperty.selectValueField].trim() : undefined;
                if(val == _string){
                    self.Set('data',{
                        value:d[BasicProperty.selectValueField],
                        text:d[BasicProperty.selectTextField]
                    });
                    $UI.find('.dropdown-toggle').html(_string+'<div class="downArrow"></div>');
                    return;
                }
            });
        },

        Render: function (_Target) {
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }

            var data = self.selectedValue;
            var ThisHTMLElement = self.shell.Container[0]; //self.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj)
                    .find('.dropdown-menu li').unbind('click touchstart').bind('click touchstart', function (e) {
                        $(ThisHTMLElement).find('.dropdown-toggle').html($(this).text() + '<div clas="downArrow"></div>');
                        $(ThisHTMLElement).find('.dropdown').removeClass('open');
                        data.value = $(this).data('value');
                        data.text = $(this).find('a').text();
                        self.Set('data', data);
                    });
            }
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }
        },
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
            var data = self.selectedValue;
            var ThisHTMLElement = self.shell.Container;
            var ThisHTMLElement = $('#' + ThisHTMLElement[0].id);
            ThisHTMLElement.find('.dropdown-menu li').unbind('click touchstart').bind('click touchstart', { ThisHTMLElement: ThisHTMLElement }, function (e) {
                e.data.ThisHTMLElement.find('.dropdown-toggle').html($(this).text() + '<div class="downArrow"></div>');
                e.data.ThisHTMLElement.find('.dropdown').removeClass('open');
                data.value = $(this).data('value');
                data.text = $(this).find('a').text();
                if (!self.IsEditState) {
                    self.Set('data', data);
                }
                self.fireScriptCode('selectValueChanged')
            });

            //20130715 markeluo 修改，支持下拉选项显示滚动条
            var DropDownBasicProperty=self.Get("BasicProperty");
            if(DropDownBasicProperty.DropDownMenuIsHeightAuto!=null){
                if(!DropDownBasicProperty.DropDownMenuIsHeightAuto){
                    ThisHTMLElement.find('ul.dropdown-menu').css({"height":DropDownBasicProperty.DropDownMenuHeight+"px","overflow":"auto"});
                }
            }else{
                DropDownBasicProperty.DropDownMenuIsHeightAuto=true;
                DropDownBasicProperty.DropDownMenuHeight=150;
            }

            return this;
        },
        ResetProperty: function () {
            var self = this;
            $('#' + this.shell.ID).resizable({
                minHeight: self.minHeight,
                minWidth: self.minWidth,
                maxHeight: self.minHeight
            }).css("position","absolute");
            return this;
        },
        RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'DropDownList.RemoveEntity Arg is null';
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
            //删除数据后删掉共享数据源和控件的关系
            Agi.Msg.ShareDataRelation.DeleteItem(self.shell.BasicID);
            Agi.Controls.DropDownListProrityInit(self); //更新属性面板
        },
        ReadData: function (et) {
            var self = this;
            self.IsChangeEntity = true;

            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            self.selectedValue.value = undefined;
            self.selectedValue.text = undefined;
            this.Set("Entity", entity);
        },
        ReadRealData: function (_Entity) {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            //alert('dropdownlist ParameterChange run!');
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            this.shell = null;
            this.IsEditState = false;
            this.minHeight = 25;
            this.minWidth = 60;
            this.IsChangeEntity = false;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "DropDownList");

            //选择数据
            self.selectedValue = {
                value: undefined,
                text: undefined
            };
            //this.Set('data',data);

            var ID = savedId ? savedId : "DropDownList" + Agi.Script.CreateControlGUID();

            //var HTMLElementPanel=$("<div id='Panel_"+ID+"' class='PanelSty selectPanelSty'><div id='head_"+ID+"' class='selectPanelheadSty'></div></div>");
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty dropdownControlShell'></div>");
            this.shell = new Agi.Controls.Shell({
                //enableFrame:true,
                ID: ID,
                width: 200,
                height: 25,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="' + ID + '" class="navbar">' +
                '<ul class="nav pull-right dropdownlistControl" role="navigation" style="height: 25px;background: transparent;">' +
                '<li class="dropdown" style="height: 25px;">' +
                '<a style="height: 22px;padding: 0px;vertical-align: top;" href="#" role="button" class="dropdown-toggle dropdown-theme1-a" data-toggle="dropdown"><div class="downArrow"></div></a>' +
                '<ul class="dropdown-menu" role="menu">' +
            //                '<li data-value="1"><a tabindex="-1" href="#">item1</a></li>'+
                '</ul>' +
                '</ul>' +
                '</div>');
            //HTMLElementPanel.append(BaseControlObj);

            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            //20140217 范金鹏 添加fontFamily属性
            var BasicProperty = {
                selectTextField: undefined,
                selectValueField: undefined,
                controlBgColor: "#E3E3E3",//背景色
                dropdownMenuBgColor: "#FFF",//菜单背景色
                fontColor: "#000",//字体色;

                borderColor:'#000000',//边框颜色
                borderWidth:'0',//边框宽
                borderRadius:'0',//圆角
                //20130715 11:27 markeluo 修改，下拉列表面板支持滚动条，高度设置
                DropDownMenuIsHeightAuto:true,//下拉列表菜单高度是否自动
                DropDownMenuHeight:150, //下拉列表带到的高度
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

            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(200);
                //HTMLElementPanel.height(59);
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
            //var StartPoint = { X: 0, Y: 0 };
            var self = this;
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
                    //Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);
            //输出参数
            this.Set("SelValue", 0);
            if (Agi.Edit) {
                //缩小的最小宽高设置
                HTMLElementPanel.resizable({
                    minHeight: self.minHeight,
                    minWidth: self.minWidth,
                    maxHeight: self.minHeight
                }).css("position","absolute");
                $('#' + self.shell.ID + ' .ui-resizable-handle').css('z-index', 2000);
            } else {
            }
            obj = ThisProPerty = PagePars = PostionValue = null;

            Agi.Msg.PageOutPramats.AddPramats({
                'Type': Agi.Msg.Enum.Controls,
                'Key': ID,
                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1}]
            });

        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.DropDownListProrityInit(this);
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
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = this.shell.Container.parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var Newdropdownlist = new Agi.Controls.DropDownList();
//                Newdropdownlist.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return Newdropdownlist;
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
            if(!ParentObj.length){
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
            //ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
            this.Set("Position", PostionValue);
            $('#' + this.shell.ID).css('height', 'auto');
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
        EnterEditState: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css({ "width": 200 }).find('li[class*="dropdown"]').removeClass('open');

            this.IsEditState = true;
            //var h = this.shell.Title.height()+this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            //this.shell.Container.height(this.minHeight);
        },
        BackOldSize: function () {
            var self = this;
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            $('#' + this.shell.ID).resizable({
                minHeight: self.minHeight,
                minWidth: self.minWidth,
                maxHeight: self.minHeight
            }).css("position","absolute");
            this.IsEditState = false;
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.DropDownListAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.DropDownList.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
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
            var DropDownListControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基础对象
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    BasicProperty: null, //控件基本属性
                    Position: null, //控件位置
                    ThemeInfo: null,
                    SelectValue: null //选择值
                }
            }
            DropDownListControl.Control.ControlType = this.Get("ControlType");
            DropDownListControl.Control.ControlID = ProPerty.ID;
            DropDownListControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            DropDownListControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
//            $(Entitys).each(function (i, e) {
//                e.Data = null;
//            });
            DropDownListControl.Control.Entity = Entitys;
            DropDownListControl.Control.BasicProperty = this.Get("BasicProperty");
            DropDownListControl.Control.Position = this.Get("Position");
            DropDownListControl.Control.ThemeInfo = this.Get("ThemeInfo");
            DropDownListControl.Control.SelectValue = this.selectedValue;
            //DropDownListControl.Control.script = this.getScriptCode();
            return DropDownListControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            //this.setScriptCode(_Config.script)
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                //var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;

                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    //BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", _Config.BasicProperty);

                    //应用样式
                    this.ChangeTheme(_Config.ThemeInfo);

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
                    //ThisProPerty.BasciObj.parent().width(ThisControlPars.Width);
                    //ThisProPerty.BasciObj.parent().height(ThisControlPars.Height);
                    //ThisProPerty.BasciObj.parent().css("left",(_Targetobj.offset().left+parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(_Targetobj.offset().top+parseInt(_Config.Position.Top*PagePars.Height))+"px");
                    //ThisProPerty.BasciObj.parent().css("left",(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(parseInt(_Config.Position.Top*PagePars.Height))+"px");

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                    if (_Config.SelectValue) {
                        this.selectedValue = _Config.SelectValue;
                    }
                    this.Set("Entity", _Config.Entity);
                    if (this.IsPageView) {
                        $('#' + this.shell.ID).css('z-index', 10000);
                    }
                }
            }
        } //根据配置信息创建控件
    }, true);



    /*应用样式，将样式应用到控件的相关参数以更新相关显示
    * _StyConfig:样式配置信息
    * _DatePicker:当前控件对象
    * */
    Agi.Controls.DropDownList.OptionsAppSty = function (_StyConfig, _DropDownList) {
        if (_StyConfig != null) {
            var dpID = _DropDownList.shell.BasicID;
            $('#' + dpID + ' .dropdown-theme1-a').css("color", _StyConfig.color);
            $('#' + dpID + ' .dropdown-theme1-a').css("font-size", _StyConfig.fontSize);
            $('#' + dpID + ' .dropdown-theme1-a').css("border-radius", _StyConfig.borderRadius);
            $('#' + dpID + ' .dropdown-theme1-a').css("background", _StyConfig.background);
            $('#' + dpID + ' .dropdown-theme1-a').css("border", _StyConfig.border);
        }
    }

/*下拉列表控件参数更改处理方法*/
Agi.Controls.DropDownListAttributeChange=function(_ControlObj,Key,_Value){
    var self = _ControlObj;
    switch(Key){
        case "Position":
        {
            if(layoutManagement.property.type==1){
                var ThisHTMLElement=$(_ControlObj.Get("HTMLElement"));
                var ThisControlObj=_ControlObj.Get("ProPerty").BasciObj;

                var ParentObj=ThisHTMLElement.parent();
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                //ThisControlObj.height(ThisHTMLElement.height()-20);
                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                //console.log("下拉列表位置:X:"+parseInt(parseFloat(_Value.Left)*PagePars.Width)+" Y:"+parseInt(parseFloat(_Value.Top)*PagePars.Height));
                ThisHTMLElement.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                ThisHTMLElement.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");
                PagePars=null;
            }
        }break;
        case "SelValue":
        {
//            var _ParameterInfo={
//                Type:"控件输出参数",
//                Control:_ControlObj,
//                ChangeValue:[{Name:"SelValue",Value:_Value}]
//            }
        }break;
        case "data"://用户选择了一个项目
        {
            //var data = _ControlObj.Get('data');
            var data = self.selectedValue;
            if(data.value){
                //alert('您选择了:'+data.selectedValue.value +'\n'+ data.selectedValue.text);

                var ThisProPerty = _ControlObj.Get("ProPerty");

                Agi.Msg.PageOutPramats.PramatsChange({
                    'Type': Agi.Msg.Enum.Controls,
                    'Key': ThisProPerty.ID,
                    'ChangeValue': [{ 'Name': 'selectedValue', 'Value': data.value }]
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj,"Type":Agi.Msg.Enum.Controls});
            }
        }break;
        case "BasicProperty":
        {
            var BasicProperty = _ControlObj.Get('BasicProperty');
            var controlObject = $(_ControlObj.Get('HTMLElement'));
            var a = controlObject.find('.dropdown-toggle').css('color',BasicProperty.fontColor);
            a.css('background-color',BasicProperty.controlBgColor);
            //controlObject.find('.dropdown-menu').css('background-color',BasicProperty.dropdownMenuBgColor);

            if(typeof BasicProperty.controlBgColor === 'object'){
                a.css(BasicProperty.controlBgColor.value);
            }

            //20140217 范金鹏 添加更新FontFamily的代码
                    if (BasicProperty.FontFamily != null && BasicProperty.FontFamily != "") {
                        controlObject.css({ "font-family": "" + BasicProperty.FontFamily + "" });
                    }
             //end
            a.css({
                'border-width':BasicProperty.borderWidth + 'px',
                'border-style': 'solid',
                'border-color':BasicProperty.borderColor,
                'border-radius':BasicProperty.borderRadius + 'px'
            });

            var entity = _ControlObj.Get('Entity');
            if(entity&&entity.length){
                BindDataByEntity(_ControlObj,entity[0]);
            }
        }
            break;
        case "Entity"://实体
        {
            var entity = _ControlObj.Get('Entity');
            if(entity&&entity.length){
                BindDataByEntity(_ControlObj,entity[0]);
            }else{
                var $UI = $('#'+ self.shell.ID);
                var menu = $UI.find('.dropdown-menu');
                $UI.find('.dropdown-toggle').html('<div class="downArrow">');
                menu.empty();
            }
        }break;
    }//end switch

    function BindDataByEntity(controlObj,et){
        var self = controlObj;
        if(!et.IsShareEntity){
            Agi.Utility.RequestData2(et,function(d){

                var BasicProperty = controlObj.Get("BasicProperty");
                //修改列
                if(self.IsChangeEntity){
                    BasicProperty.selectTextField = d.Columns[0];
                    BasicProperty.selectValueField = d.Columns[0];
                    self.IsChangeEntity = false;
                }
                var $UI = $('#'+ controlObj.shell.ID);
                var menu = $UI.find('.dropdown-menu');
                $UI.find('.dropdown-toggle').html('请选择'+'<div class="downArrow"></div>');

                menu.empty();
                var data = d.Data.length ? d.Data : [];
                var columns = d.Columns;
                et.Data = data;

//                if(!et.Data || et.Data.lenght<=0){
//                    AgiCommonDialogBox.Alert(et.Data);
//                }
                et.Columns = d.Columns;
                var textField = BasicProperty && BasicProperty.selectTextField?BasicProperty.selectTextField:columns[0];
                var valueField = BasicProperty && BasicProperty.selectValueField?BasicProperty.selectValueField:columns[0];
                if(BasicProperty.selectTextField == undefined){
                    BasicProperty.selectTextField = textField
                }
                if(BasicProperty.selectValueField == undefined){
                    BasicProperty.selectValueField = valueField;
                }

                $(data).each(function(i,dd){
                    $('<li data-value="'+dd[valueField.trim()]+'"><a tabindex="-1" href="#">'+dd[textField.trim()]+'</a></li>').appendTo(menu);
                });
                controlObj.ReBindEvents();

                var selData = self.selectedValue;
                if(selData.value && selData.text){
                    //self.Set('data',selData);//取消加载出控件以后去触发参数联动事件
                    self.shell.Body.find('.dropdown-toggle').html(selData.text +'<div class="downArrow"></div>');
                    //更新参数联动的字典
                    Agi.Msg.PageOutPramats.PramatsChange({
                        'Type': Agi.Msg.Enum.Controls,
                        'Key': self.shell.BasicID,
                        'ChangeValue': [{ 'Name': 'selectedValue', 'Value': selData.value }]
                    });
                }else{
                    //menu.find('li:eq(0)').click();//取消加载出控件以后去触发参数联动事件
                }

                if (Agi.Controls.IsControlEdit) {
                    if(Agi.Edit.workspace.currentControls[0].Get('ProPerty').ID === self.Get('ProPerty').ID){
                        Agi.Controls.ShowControlData(self); //更新实体数据显示
                        Agi.Controls.DropDownListProrityInit(self);//更新属性面板
                    }
                }
            });
        }else{
            BindDataByJson.call(self,et,et);
        }

        return;
    }

    function BindDataByJson(et,d){
        var controlObj = this;
        var BasicProperty = controlObj.Get("BasicProperty");
        //修改列
        if(self.IsChangeEntity){
            BasicProperty.selectTextField = d.Columns[0];
            BasicProperty.selectValueField = d.Columns[0];
            self.IsChangeEntity = false;
        }
        var $UI = $('#'+ controlObj.shell.ID);
        var menu = $UI.find('.dropdown-menu');
        $UI.find('.dropdown-toggle').html('请选择'+'<div class="downArrow"></div>');

        menu.empty();
        var data = d.Data.length ? d.Data : [];
        var columns = d.Columns;
        et.Data = data;
//        if(!et.Data || et.Data.lenght<=0){
//            AgiCommonDialogBox.Alert(et.Data);
//        }
        et.Columns = d.Columns;
        var textField = BasicProperty && BasicProperty.selectTextField?BasicProperty.selectTextField:columns[0];
        var valueField = BasicProperty && BasicProperty.selectValueField?BasicProperty.selectValueField:columns[0];
        if(BasicProperty.selectTextField == undefined){
            BasicProperty.selectTextField = textField
        }
        if(BasicProperty.selectValueField == undefined){
            BasicProperty.selectValueField = valueField;
        }

        $(data).each(function(i,dd){
            $('<li data-value="'+dd[valueField.trim()]+'"><a tabindex="-1" href="#">'+dd[textField.trim()]+'</a></li>').appendTo(menu);
        });
        controlObj.ReBindEvents();

        var selData = self.selectedValue;
        if(selData.value && selData.text){
            //self.Set('data',selData);//取消加载出控件以后去触发参数联动事件
            self.shell.Body.find('.dropdown-toggle').html(selData.text +'<div class="downArrow"></div>');
            //更新参数联动的字典
            Agi.Msg.PageOutPramats.PramatsChange({
                'Type': Agi.Msg.Enum.Controls,
                'Key': self.shell.BasicID,
                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': selData.value }]
            });
        }else{
            //menu.find('li:eq(0)').click();//取消加载出控件以后去触发参数联动事件
        }

        if (Agi.Controls.IsControlEdit) {
            if(Agi.Edit.workspace.currentControls[0].Get('ProPerty').ID === self.Get('ProPerty').ID){
                Agi.Controls.ShowControlData(self); //更新实体数据显示
                Agi.Controls.DropDownListProrityInit(self);//更新属性面板
            }
        }
    }
}//end

/*下拉列表参数更改 _DropDownListID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.DropDownListParsChange=function(_DropDownListID,_ParsName,_ParsValue){
    var ThisControl=Agi.Controls.FindControl(_DropDownListID);/*查找到相应的控件*/
    if(ThisControl){
        ThisControl.Set(_ParsName,_ParsValue);
    }
}

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDropDownList=function(){
    return new Agi.Controls.DropDownList();
}

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.DropDownListProrityInit = function (dropDownControl) {
    var self = dropDownControl;
    var BasicProperty = dropDownControl.Get('BasicProperty');


    var ThisProItems = [];
    //绑定配置的代码
    var bindHTML = null;
    bindHTML = $('<form class="form-horizontal">' +
        "<div class='DropDownList_Pro_Panel'>" +
        "<table class='DropDownListProPanelTable'></table>" +
        "</div>" +
        '</form>');
    var entity = dropDownControl.Get('Entity');

    var BindHTMLTable = bindHTML.find(".DropDownListProPanelTable");
    $(['显示值', '选择值']).each(function (i, label) {
        //        bindHTML.append('<div class="control-group">'+
        //            '<label style="display: block;" class="control-label" for="inputEmail">'+label+'</label>'+
        //            '<div class="controls">'+
        //            '<select data-field="'+label+'" placeholder="" class="input"></select>'+
        //            '</div>'+
        //            '</div>');
        BindHTMLTable.append("<tr>" +
            "<td class='DropDownListProTabtd0'>" + label + "：</td>" +
            "<td class='DropDownListProTabtd1'  colspan='3'><select title=" + label + " data-field=" + label + " placeholder='' class='input'></select></td>" +
            "</tr>");
    });
    var options = null;
    if (entity.length) {
        if (entity[0].Columns) {
            options = "";
            $(entity[0].Columns).each(function (i, col) {
                options += "<option value='" + col + "'>" + col + "</option>"
            });
        }
    }
    bindHTML.find('select').append($(options)).bind('change', { sels: bindHTML.find('select') }, function (e) {
        $(e.data.sels).each(function (i, sel) {
            var f = $(sel).data('field');
            if (f == '显示值') {
                BasicProperty.selectTextField = $(sel).val();
            }
            else if (f == '选择值') {
                BasicProperty.selectValueField = $(sel).val();
            }
        });
        self.selectedValue.value = undefined;
        self.selectedValue.text = undefined;
        dropDownControl.Set('BasicProperty', BasicProperty);
    }).each(function (i, sel) {
        var f = $(sel).data('field');
        if (f == '显示值') {
            $(sel).val(BasicProperty.selectTextField);
        }
        else if (f == '选择值') {
            $(sel).val(BasicProperty.selectValueField);
        }
    });
    //20130223 倪飘 解决控件库-下拉列表框，基本设置，选择字体颜色、控件背景之后自动跳转到绑定设置界面问题

    //基本设置
    //var controlObject = $(dropDownControl.Get('HTMLElement'));
    var tr3 = $("<tr></tr>");
    $(['字体颜色', '边框颜色']).each(function (i, label) {
        var field = getField(label);
        tr3.append("<td class=''>" + label + "：</td>" +
            "<td class=''><input title=" + label + " data-field=" + label + " class='basic input-mini' value=" + (!BasicProperty[field] ? '#000000' : BasicProperty[field]) + " type='text' name=" + label + "/></td>");
    });
    BindHTMLTable.append(tr3);
    //20130402 nipiao  修改bug，下拉列表框，边框宽度限制0-100过大，建议修改限制为0-10
    var tr4 = $('<tr><td>边框宽度:</td><td><input title="边框宽度" class="input-mini" type="number" min="0" max="10" value="' + (!BasicProperty.borderWidth ? '0' : BasicProperty.borderWidth) + '"/></td>' +
    '<td>圆角</td><td><input title="圆角" class="input-mini" type="number" min="0" max="10" value="' + (!BasicProperty.borderRadius ? '0' : BasicProperty.borderRadius) + '"/></td></tr>');
    BindHTMLTable.append(tr4);

    //20140217 范金鹏 
    //    var tr5 = $('<tr><td>控件背景:</td><td colspan="3"><div title="控件背景" class="ControlColorSelPanelSty" /></td>' +
    //        '<td></td><td></td></tr>');
    var tr5 = $('<tr><td>控件背景:</td><td><div title="控件背景" class="ControlColorSelPanelSty" /></td>' +
        '<td>字体样式：</td><td><div><select id="FontFamilySelect">' +
        '<option selected value="微软雅黑">微软雅黑</option>' +
        "<option value='宋体'>宋体</option>" +
        "<option value='楷体'>楷体</option>" +
        "<option value='黑体'>黑体</option>" +
        "<option value='隶书'>隶书</option>" +
        "<option value='仿宋'>仿宋</option>" +
        "<option value='华文彩云'>华文彩云</option>" +
        "<option value='华文琥珀'>华文琥珀</option>" +
        "<option value='华文隶书'>华文隶书</option>" +
        '</select></div></td></tr>');
    BindHTMLTable.append(tr5);

    //20130715 markeluo 新增关于下拉列表，下拉选项限定高度支持
    var tr6 = $("<tr><td>列表显示:</td><td><select id='DropDownlist_ListSty'><option selected='selected' value='true'>高度自适应</option><option   value='false'>超出高度显示滚动条</option></select></td>" +
    "<td>列表高度:</td><td><input id='DropDownlist_ListHight' type='number' value='150' defaultvalue='14' min='100' max='500'  class='ControlProNumberSty'/></td></tr>");
    BindHTMLTable.append(tr6);

    if (typeof BasicProperty.controlBgColor === 'string') {
        tr5.find('div.ControlColorSelPanelSty').css('background-color', BasicProperty.controlBgColor);
    } else if (typeof BasicProperty.controlBgColor === 'object') {
        tr5.find('div.ControlColorSelPanelSty').css(BasicProperty.controlBgColor.value);
    }

    bindHTML.find('input[data-field="字体颜色"],input[data-field="边框颜色"]').spectrum({
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
            var pName = $(this).data('field');
            var field = getField(pName);
            switch (pName) {
                case "字体颜色":
                    BasicProperty.fontColor = color.toHexString();
                    break
                case '控件背景':
                    BasicProperty.controlBgColor = color.toHexString();
                    break;
                case '菜单背景':
                    BasicProperty.dropdownMenuBgColor = color.toHexString();
                    break
                case "边框颜色":
                    BasicProperty.borderColor = color.toHexString();
                    break;
            } //end switch
            dropDownControl.Set('BasicProperty', BasicProperty);
            //alert(color.toHexString());
        }
    });

    bindHTML.find('input[title="边框宽度"],input[title="圆角"]').bind('change', function () {
        var title = $(this).attr('title');
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (title == '边框宽度') {
            if (val.trim() === "") {
                $(this).val(BasicProperty.borderWidth);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
            else {
                if (val >= MinNumber && val <= MaxNumber) {
                    BasicProperty.borderWidth = val;
                }
                else {
                    $(this).val(BasicProperty.borderWidth);
                    var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                    AgiCommonDialogBox.Alert(DilogboxTitle);
                }
            }

        } else if (title == '圆角') {
            if (val.trim() === "") {
                $(this).val(BasicProperty.borderRadius);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
            else {
                if (val >= MinNumber && val <= MaxNumber) {
                    BasicProperty.borderRadius = val;
                }
                else {
                    $(this).val(BasicProperty.borderRadius);
                    var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                    AgiCommonDialogBox.Alert(DilogboxTitle);
                }
            }
        }
        dropDownControl.Set('BasicProperty', BasicProperty);
    });
    bindHTML.find('div[title="控件背景"]').bind('click', function () {
        var btn = $(this);
        var currentColor = BasicProperty.controlBgColor;
        colorPicker.open({
            defaultValue: !currentColor ? null : currentColor, //这个参数是上一次选中的颜色
            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                btn.css(color.value);
                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                BasicProperty.controlBgColor = color;

                dropDownControl.Set('BasicProperty', BasicProperty);
            }
        });
    });

    //20140217 范金鹏 增加字体选择控件的change事件代码
    bindHTML.find('select[id="FontFamilySelect"]').bind('click', function () {
        var val = $("#FontFamilySelect").val();
        BasicProperty.FontFamily = val;
        dropDownControl.Set("BasicProperty", BasicProperty);
    });
    //end

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: bindHTML }));
    BindHTMLTable = null; //清空临时变量

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    function getField(label) {
        var field = "";
        switch (label) {
            case "字体颜色":
                field = 'fontColor';
                break;
            case "控件背景":
                field = 'controlBgColor';
                break;
            case "菜单背景":
                field = 'dropdownMenuBgColor';
                break;

            case "边框颜色":
                field = 'borderColor';
                break;
            //                    borderWidth:'1',//边框宽        
            //                borderRadius:'1'//圆角        
        }
        return field;
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

    //region7 20130715 14:08 markeluo 下拉列表的列表面板对滚动条的支持
    //1.根据保存选项加载列表项的默认选中项和列表高度
    //20140217 范金鹏 添加绑定属性面板中fontFamily值相关代码
    if (BasicProperty.FontFamily) {
    }
    else {
        BasicProperty.FontFamily = "";
    }
    $("#FontFamilySelect").val(BasicProperty.FontFamily);
    //end

    if (BasicProperty.DropDownMenuIsHeightAuto == null) {
        BasicProperty.DropDownMenuIsHeightAuto = true;
    }
    if (BasicProperty.DropDownMenuHeight == null) {
        BasicProperty.DropDownMenuHeight = 150;
    }
    if (BasicProperty.DropDownMenuIsHeightAuto) {
        $("#DropDownlist_ListSty").find("option[value='true']").attr("selected", "selected"); //是否禁用Marker,页面选项
    } else {
        $("#DropDownlist_ListSty").find("option[value='true']").attr("selected", "selected"); //是否禁用Marker,页面选项
        $("#DropDownlist_ListHight").val(BasicProperty.DropDownMenuHeight); //高度
    }

    //2.事件绑定
    $("#DropDownlist_ListSty").unbind().bind('change', function (ev) {
        var autostatevalue = $(this).val();
        var DropDownListPanel = $("#" + dropDownControl.Get('ProPerty').BasciObj[0].id);
        if (autostatevalue === "false") {
            BasicProperty.DropDownMenuIsHeightAuto = false;
            DropDownListPanel.find("ul.dropdown-menu").css({ "height": $("#DropDownlist_ListHight").val() + "px", "overflow": "auto" });
        } else {
            BasicProperty.DropDownMenuIsHeightAuto = true;
            DropDownListPanel.find("ul.dropdown-menu").css({ "height": "auto", "overflow": "auto" });
        }
        autostatevalue = null;
    });
    $("#DropDownlist_ListHight").unbind().bind('change', function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val.trim() === "") {
            $(this).val(BasicProperty.borderWidth);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
        else {
            if (val >= MinNumber && val <= MaxNumber) {
                var DropDownListPanel = $("#" + dropDownControl.Get('ProPerty').BasciObj[0].id);
                if ($("#DropDownlist_ListSty").val() === "false") {
                    DropDownListPanel.find("ul.dropdown-menu").css({ "height": val + "px", "overflow": "auto" });
                }
                BasicProperty.DropDownMenuHeight = val;
            }
            else {
                $(this).val(BasicProperty.borderWidth);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
        }
    });
    //endregion
};
