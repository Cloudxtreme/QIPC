/**
 * Created with JetBrains WebStorm.
 * User: alex
 * Date: 12-11-12
 * Time: 下午2:44
 * To change this template use File | Settings | File Templates.
 * AssociativeInputBox: 联想输入框
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/

Agi.Controls.AssociativeInputBox = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
            if (!_EntityKey) {
                throw 'AssociativeInputBox.RemoveEntity Arg is null';
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
            //20130521 倪飘 解决bug，联想输入框中拖入数据，双击高级属性设置界面中删除下方实体，但是右侧绑定配置中选择联想列中依旧存在绑定的列
            //刷新属性面板
            Agi.Controls.AssociativeInputBoxPropertyInit(self);
        },
        ReadData:function (et) {
            var self = this;
//            self.IsChangeEntity = true;
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity", entity);
        },
        AddColumn:function (_entity, _ColumnName) {
            this.Set("SelectedColumn", _ColumnName);
            var changeAsso = $("#changeAsso");
            changeAsso.val(_ColumnName);
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
            Me.Set("ControlType", "AssociativeInputBox");
            Me.Set("AssociativeValue", []);  //控件联想值
            Me.Set("SelectedColumn", []);   //控件联想选中行
            Me.Set("IsSelectHidden", false); //用于判断点击位置使联想面板收起
            var ID = savedId ? savedId : "AssociativeInputBox" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty'></div>");
            HTMLElementPanel.css('padding-bottom', '0px');

            this.shell = new Agi.Controls.Shell({
                ID:ID,
                width:200,
                height:26,
                divPanel:HTMLElementPanel
            });

            var AssociativeInputBoxBasicProperty = {
                PanelFontSty:"微软雅黑", //面板字体样式
                PanelBgColor:"#ffffff", //面板背景色
                PanelBorderColor:"#9f9f9f", //面板边框色
                PanelSelectedColumnColor:"#00f",
                AssociativeDisplayRows:10, //联想列
                InputFontColor:"#000000", //输入框字体颜色
                InputBorderColor:"#9f9f9f", //输入框边框颜色
                ButtonBgColor:"#b9b9b9", //按钮背景色
                ButtonBorderColor:"#9f9f9f", //按钮边框色
                ButtonText:"Go"                   //按钮显示文字
            };
            this.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);

            var PostionValue = {Left:0, Top:0, Right:0, Bottom:0};

            var obj = null;
            if (typeof(_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = {Width:$(obj).width(), Height:$(obj).height(), Left:0, Top:0};

            var BaseControlObj = $('<div id="inputDiv">' +
                '<div id="inputAndButtonShell">' +
                '<input id="AssociativeInputBox_' + ID + '" class="inputAssociativeClass" >' +
                '<input id="ButtonAssociativeID" type="button" value="Go" style="width: 50px" ></div>' +
                '<select id="selInputAssociative" class="selClass" style="display:none;z-index: 2002;" ></select></div>');
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

//            $('#' + self.shell.ID).live('mousedown', function (ev) {

//                Agi.Controls.BasicPropertyPanel.Show(this.id);
//            });

            $('#' + self.shell.ID).find('.inputAssociativeClass').bind('keyup', function () {
                showTips(this, Me);
            });

            $('#' + self.shell.ID).find("#ButtonAssociativeID").bind("click", function (ev) {
//                buttonAsso(this, Me);
                //20130520  倪飘 解决bug，联想输入框控件与其他控件进行联动的时候，双击联想输入框控件"go"按钮，会进入被联动的控件的高级属性面板
                Agi.Controls.AssociativeInputBoxClickManager({ "ControlObj": Me });
            });
            $('#' + self.shell.ID).find("#selInputAssociative").bind("change", function () {
                selectChange(this, Me);
            });
            $('#' + self.shell.ID).find('.inputAssociativeClass').blur(function () {
                inputblur(this, Me);
            });
            $('#' + self.shell.ID).find("#selInputAssociative").bind("mouseover", function () {
                selectMouseover(this, Me);
            });
            $('#' + self.shell.ID).find("#selInputAssociative").bind("mouseout", function () {
                selectMouseout(this, Me);
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
                    { 'Name':'AssociativeValue', 'Value':-1}
                ]
            });
            //20130515 倪飘 解决bug，组态环境中拖入联想输入框以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        },

        CustomProPanelShow:function () {
            Agi.Controls.AssociativeInputBoxPropertyInit(this);
        }, //显示自定义属性面板

        Destory:function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/

            //Agi.Edit.workspace.controlList.remove(this);
            //Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/
//            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

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
                var NewInputBox = new Agi.Controls.AssociativeInputBox();
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
            //20130529 倪飘 解决bug，显示比例，拖入联想输入框，修改显示比列为200%或400%后，再设置为25%，联想输入框显示超出画布大小
//            this.Set("Position", PostionValue);
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
                    var buttonObj = $('#' + this.shell.ID).find('#ButtonAssociativeID');
                    var buttonWidth = buttonObj.width();
                    var inputObj = $('#' + this.shell.ID).find('.inputAssociativeClass');
                    inputObj.width(ThisHTMLElement.width() - buttonWidth - 22);
                    //联想下拉框长宽变化
                    $('#' + this.shell.ID).find('#selInputAssociative').css("width", $(inputObj).width());

                    ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                }
            }
            else if (Key == "AssociativeInputBoxBasicProperty") {
                if (layoutManagement.property.type == 1) {
                    $('#' + this.shell.ID).find('#selInputAssociative').css({"font-family": _Value.PanelFontSty});
                    $('#' + this.shell.ID).find('#selInputAssociative').css({"background":_Value.PanelBgColor});
                    $('#' + this.shell.ID).find('#selInputAssociative').css({"border-color":_Value.PanelBorderColor});
                    var sel = $('#' + this.shell.ID).find('#selInputAssociative');
                    sel[0].size = _Value.AssociativeDisplayRows;
                    var inputValue = _obj.Get("AssociativeValue");
                    if (inputValue) {
                        $('#' + this.shell.ID).find('.inputAssociativeClass').css({"color":"" + _Value.InputFontColor + ""});
                    }
                    $('#' + this.shell.ID).find('.inputAssociativeClass').css({"border-color": _Value.InputBorderColor});
                    $('#' + _obj.shell.ID).find('#ButtonAssociativeID').val(_Value.ButtonText);
                    $('#' + _obj.shell.ID).find('#ButtonAssociativeID').css({"border-color":_Value.ButtonBorderColor});
                    $('#' + _obj.shell.ID).find('#ButtonAssociativeID').css("background","-webkit-gradient(linear,left bottom,left top,color-stop(0, #f7f7f7),color-stop(1, "+_Value.ButtonBgColor+"))");
                }
            }

            else if (Key == "AssociativeValue") {

                var ThisProPerty = _obj.Get("ProPerty");

                Agi.Msg.PageOutPramats.PramatsChange({
                    "Type":Agi.Msg.Enum.Controls,
                    "Key":ThisProPerty.ID,
                    "ChangeValue":[
                        { 'Name':'AssociativeValue', 'Value':_Value }
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
                        Agi.Controls.AssociativeInputBoxPropertyInit(self);
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
                    Agi.Controls.AssociativeInputBoxPropertyInit(self);
                }
            }
        },
        GetConfig:function () {
            var ProPerty = this.Get("ProPerty");

            var AssociativeInputBoxControl = {
                Control:{
                    ControlType:null, //控件类型
                    ControlID:null, //控件属性
                    ControlBaseObj:null, //控件基础对象
                    HTMLElement:null, //控件外壳ID
                    Entity:null, //控件实体
                    AssociativeInputBoxBasicProperty:null, //控件面板基本属性
                    Position:null, //控件位置
                    ThemeInfo:null,
                    SelectedColumn:null,
                    IsSelectHidden:null
                }
            }
            AssociativeInputBoxControl.Control.ControlType = this.Get("ControlType");
            AssociativeInputBoxControl.Control.ControlID = ProPerty.ID;
            AssociativeInputBoxControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            AssociativeInputBoxControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var ThisControlEntitys = this.Get("Entity");//获取当前控件中的Entity 列表
            var entitylist = [];
            //清除掉原Entity 中的Data 数据，并创建一个用于保存的Entity 数组
//            for (var i = 0; i < ThisControlEntitys.length; i++) {
//                entitylist.push(Agi.Script.CloneObj(ThisControlEntitys[i]));
//                entitylist[i].data = null;
//                entitylist[i].Data = null;
//                entitylist[i].Parameters = ThisControlEntitys[i].Parameters;
//                if (entitylist[i].Entity != null) {
//                    entitylist[i].Entity.Parameters = ThisControlEntitys[i].Entity.Parameters;
//                    entitylist[i].Entity.Data = null;
//                }
//            }
            AssociativeInputBoxControl.Control.Entity = ThisControlEntitys;
            AssociativeInputBoxControl.Control.AssociativeInputBoxBasicProperty = this.Get("AssociativeInputBoxBasicProperty");
            AssociativeInputBoxControl.Control.Position = this.Get("Position");
            AssociativeInputBoxControl.Control.ThemeInfo = this.Get("ThemeInfo");
            AssociativeInputBoxControl.Control.SelectedColumn = this.Get("SelectedColumn");
            AssociativeInputBoxControl.Control.IsSelectHidden = this.Get("IsSelectHidden");
            return  AssociativeInputBoxControl.Control;
        }, //获得联想输入框控件的配置信息
        CreateControl:function (_Config, _Target) {
            var savedId = _Config.ControlID;
            this.Init(_Target, _Config.Position, savedId);

            if (_Config != null) {
                var AssociativeInputBoxBasicProperty = null;
                var Me=this;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;
                    this.Set("Entity", _Config.Entity);
                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;

                    var AssociativeInputBoxBasicProperty = _Config.AssociativeInputBoxBasicProperty;
                    this.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    //输入框
                    $("#" + ThisProPerty.ID).find('.inputAssociativeClass').css({"color":"" + AssociativeInputBoxBasicProperty.InputFontColor + ""})
                    $("#" + ThisProPerty.ID).find('.inputAssociativeClass').css({"border-color":"" + AssociativeInputBoxBasicProperty.InputBorderColor + ""})
                    //面板
                    $('#' + ThisProPerty.ID).find('#selInputAssociative').css({"font-family":"" + AssociativeInputBoxBasicProperty.PanelFontSty + ""});
                    $('#' + ThisProPerty.ID).find('#selInputAssociative').css({"background":"" + AssociativeInputBoxBasicProperty.PanelBgColor + ""});
                    $('#' + ThisProPerty.ID).find('#selInputAssociative').css({"border-color":"" + AssociativeInputBoxBasicProperty.PanelBorderColor + ""});
                    $('#' + ThisProPerty.ID).find('#selInputAssociative').size = AssociativeInputBoxBasicProperty.AssociativeDisplayRows;
                    //按钮
                    $('#' + ThisProPerty.ID).find('#ButtonAssociativeID').val(AssociativeInputBoxBasicProperty.ButtonText);
                    $('#' + ThisProPerty.ID).find('#ButtonAssociativeID').css({"border-color":"" + AssociativeInputBoxBasicProperty.ButtonBorderColor + ""});
                    $('#' + ThisProPerty.ID).find('#ButtonAssociativeID').css({"background":"-webkit-gradient(linear,left bottom,left top,color-stop(0, #f7f7f7),color-stop(1, " + AssociativeInputBoxBasicProperty.ButtonBgColor + "))"});


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
//                    this.IsChangeEntity = true;
                    //               this.Set("Entity",_Config.Entity);
                    this.Set("IsSelectHidden", _Config.IsSelectHidden);

                    $('#' + ThisProPerty.ID).find('.inputAssociativeClass').bind('keyup', function () {
                        // showTips(this,Me);
                        var selectedCol = _Config.SelectedColumn;
                        var entity = _Config.Entity;
                        //该方法用于删除数组中的重复数据
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

                        var data = entity[0].Data;
                        var arrayObjMul = new Array();
                        $(data).each(function (i, dd) {
                            arrayObjMul.push(dd[selectedCol]);
                        });
                        var arrayObj = jQuery.arrunique(arrayObjMul);
                        var _obj = event.srcElement;
                        var parentObj = $(_obj).parent().parent();
                        var sel = $(parentObj).find('#selInputAssociative');
                        var i;
                        var re = new RegExp("^" + _obj.value, "i");
                        var inputSelect = sel[0];
                        inputSelect.options.length = 0;
                        var inputWidth = _obj.offsetWidth;
                        $('#selInputAssociative').css("offsetWidth", inputWidth);

                        for (i = 0; i < arrayObj.length; i++) {
                            if (re.test(arrayObj[i]) == true) {
                                sel.css("display", "inline-block");
                                inputSelect.add(new Option(arrayObj[i], arrayObj[i]));
                            }

                        }
                        var AssociativeInputBoxBasicProperty = _Config.Get("AssociativeInputBoxBasicProperty");
                        var associativeDisplayRows = AssociativeInputBoxBasicProperty.AssociativeDisplayRows;

                        inputSelect.size = associativeDisplayRows;
                    });
                    $('#' + ThisProPerty.ID).find("#ButtonAssociativeID").bind("click", function () {
                        //   buttonAsso(this,Me);
                        var assoValue = $('#' + ThisProPerty.ID).find(".inputAssociativeClass").val();
                        Me.Set("AssociativeValue", assoValue);
                    });
                    $('#' + ThisProPerty.ID).find("#selInputAssociative").bind("change", function () {
                        //    rv(this,Me);
                        var _selectObj = event.srcElement;
                        var parentObj = $(_selectObj).parent().parent();
                        var inputObj = $(parentObj).find('.inputAssociativeClass');
                        var sel = $(parentObj).find('#selInputAssociative');
                        if (_selectObj.value != "") {
                            inputObj[0].value = _selectObj.value;
                            //20130517 倪飘 解决bug，联想输入框控件在与其他控件进行联动操作的时候，点击联想输入框控件下拉选项中的项以后，未点击右侧按钮"go"，就已经联动了
//                            Me.Set("AssociativeValue", inputObj[0].value);
                        }
                        sel.css("display", "none");
                        inputObj.focus();
                    });
                    $('#' + ThisProPerty.ID).find('.inputAssociativeClass').blur(function () {
                        var IsSelectHidden = Me.Get("IsSelectHidden");
                        if (!IsSelectHidden) {
                            var _obj = event.srcElement;
                            var parentObj = $(_obj).parent().parent();
                            var sel = $(parentObj).find('#selInputAssociative');
                            sel.css("display", "none");
                        }
                    });
                    $('#' + ThisProPerty.ID).find("#selInputAssociative").bind("mouseover", function () {
                        var IsSelectHidden = true;
                        Me.Set("IsSelectHidden", IsSelectHidden);
                    });
                    $('#' + ThisProPerty.ID).find("#selInputAssociative").bind("mouseout", function () {
                        var IsSelectHidden = false;
                        Me.Set("IsSelectHidden", IsSelectHidden);
                    });
                }
            }

        },
        ChangeTheme:function (_themeName) {
            var Me = this;
            //1.根据当前控件类型和样式名称获取样式信息
            var AssociativeInputBoxStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //2.保存主题
            Me.Set("ThemeName", _themeName);

            //3.应用当前控件的信息
            Agi.Controls.AssociativeInputBox.OptionsAppSty(AssociativeInputBoxStyleValue, Me);
            //4.
            //   this.Set("BasicProperty", TimePickerStyleValue);
            //5.控件刷新显示
            //  Me.Refresh();//刷新显示

            //   TimePickerStyleValue=null;
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
            //            var h = this.shell.Title.height() + this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
//            this.shell.Container.height(80);
//            this.shell.Container.width(180);
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
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */

Agi.Controls.AssociativeInputBox.OptionsAppSty = function (_StyConfig, Me) {
    if (_StyConfig != null) {
        var AssociativeInputBoxBasicProperty=Me.Get("AssociativeInputBoxBasicProperty");
        AssociativeInputBoxBasicProperty.PanelFontSty=_StyConfig.PanelFontSty;
        AssociativeInputBoxBasicProperty.PanelBgColor=_StyConfig.PanelBgColor;
        AssociativeInputBoxBasicProperty.PanelBorderColor=_StyConfig.PanelBorderColor;
        AssociativeInputBoxBasicProperty.PanelSelectedColumnColor=_StyConfig.PanelSelectedColumnColor;
        AssociativeInputBoxBasicProperty.AssociativeDisplayRows=_StyConfig.AssociativeDisplayRows;
        AssociativeInputBoxBasicProperty.InputFontColor=_StyConfig.InputFontColor;
        AssociativeInputBoxBasicProperty.InputBorderColor=_StyConfig.InputBorderColor;
        AssociativeInputBoxBasicProperty.InputFontColor=_StyConfig.InputFontColor;
        AssociativeInputBoxBasicProperty.InputBorderColor=_StyConfig.InputBorderColor;
        AssociativeInputBoxBasicProperty.ButtonBgColor=_StyConfig.ButtonBgColor;
        AssociativeInputBoxBasicProperty.ButtonBorderColor=_StyConfig.ButtonBorderColor;
        Me.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
    }

}

function showTips(_obj, ControlObj) {
    //获取控件最外层外壳ID
//    var ControlPanelID= _obj.parentElement.parentElement.parentElement.parentElement.id;
//    var ControlObj=Agi.Controls.FindControlByPanel(ControlPanelID);//根据控件的外壳容器查找当前控件
    //该方法用于删除数组中的重复数据
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
    var AssociativeInputBoxBasicProperty = ControlObj.Get("AssociativeInputBoxBasicProperty");
    var associativeDisplayRows = AssociativeInputBoxBasicProperty.AssociativeDisplayRows;
    //更改联想面板显示数
    inputSelect.size = associativeDisplayRows;
}

function selectChange(_obj, ControlObj) {

    var _selectObj = event.srcElement;
    var parentObj = $(_selectObj).parent().parent();
    var inputObj = $(parentObj).find('.inputAssociativeClass');  //输入框
    var sel = $(parentObj).find('#selInputAssociative');         //联想面板
    if (_selectObj.value != "") {
        inputObj[0].value = _selectObj.value;
        //20130517 倪飘 解决bug，联想输入框控件在与其他控件进行联动操作的时候，点击联想输入框控件下拉选项中的项以后，未点击右侧按钮"go"，就已经联动了
//        ControlObj.Set("AssociativeValue", inputObj[0].value);  //输入框中的输入值
    }
    sel.css("display", "none");
    inputObj.focus();
    var IsSelectHidden = false;
    ControlObj.Set("IsSelectHidden", IsSelectHidden);
}
//点击按钮，获取输入值
function buttonAsso(_obj, ControlObj) {

    var assoValue = $('#' + ControlObj.shell.ID).find(".inputAssociativeClass").val();
    ControlObj.Set("AssociativeValue", assoValue);
}
//当点击其他位置时联想面板消失，使用IsSelectHidden来判定
function inputblur(_obj, ControlObj) {

    var IsSelectHidden = ControlObj.Get("IsSelectHidden");
    if (!IsSelectHidden) {
        var _obj = event.srcElement;
        var parentObj = $(_obj).parent().parent();
        var sel = $(parentObj).find('#selInputAssociative');
        sel.css("display", "none");
    }

}

function selectMouseover(_obj, ControlObj) {
    var IsSelectHidden = true;
    ControlObj.Set("IsSelectHidden", IsSelectHidden);
}

function selectMouseout(_obj, ControlObj) {
    var IsSelectHidden = false;
    ControlObj.Set("IsSelectHidden", IsSelectHidden);
}

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitAssociativeInputBox = function () {
    return new Agi.Controls.AssociativeInputBox();
}

//联想输入框 自定义属性面板初始化显示
Agi.Controls.AssociativeInputBoxPropertyInit = function (propertyAssociativeInputBox) {

    var isSaFari = navigator.userAgent.indexOf("Safari")
    if (isSaFari) {
        $("#AssociativeInputBoxPropertyPanel").removeClass("BasicProperty_Panel");
        $("#AssociativeInputBoxPropertyPanel").attr('className', 'BasicProperty_RadiusforSaFari');
    }
    var $UI = $("#" + propertyAssociativeInputBox.shell.ID);

    var ThisProItems = [];
    var AssociativeInputBoxBasicProperty = propertyAssociativeInputBox.Get("AssociativeInputBoxBasicProperty");
    var ItemContent = new Agi.Script.StringBuilder();


    //数据绑定
    var SelectedColumn = propertyAssociativeInputBox.Get("SelectedColumn");
    var bindHTML = null;
    bindHTML = $('<form class="Asso-form-horizontal">' +
        '</form>');
    var entity = propertyAssociativeInputBox.Get('Entity');
    $(['选择联想列']).each(function (i, label) {
        bindHTML.append('<div class="Asso-control-group">' +
            '<label style="display: block; width: 60px; font-size: 12px; margin-top: 6px; font-weight: bold; padding-left: 10px;padding-right: 10px;" class="Asso-control-label" for="inputEmail">' + label + '</label>' +
            '<div class="Asso-controls"> ' +
            '<select data-field="' + label + '" placeholder="" class="input" style="height:20px; line-height:14px;" id="changeAsso"></select>' +
            '</div>' +
            '</div>');
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
    bindHTML.find('select').append($(options)).bind('change', {sels:bindHTML.find('select')},function (e) {
        $(e.data.sels).each(function (i, sel) {
            var f = $(sel).data('field');
            if (f == '选择联想列') {
                propertyAssociativeInputBox.Set("SelectedColumn", $(sel).val());
                $UI.find(".inputAssociativeClass").val("");
            }
        });
    }).each(function (i, sel) {
            var f = $(sel).data('field');
            if (f == '选择联想列') {
                //       $(sel).val(getAssociativeInputBoxBasicProperty.selectedAssociativeField);
            }
        });

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"绑定配置", DisabledValue:1, ContentObj:bindHTML}));


    //弹出面板设置
    PanelContent = null;
    PanelContent = new Agi.Script.StringBuilder();
    PanelContent.append("<div class='Asso_Pro_Panel' >");
    PanelContent.append("<table class='prortityPanelTableAsso' border='0' cellspacing='1' cellpadding='0'>");
    PanelContent.append("<tr>");

    //PanelContent.append("<td class='prortityPanelTabletd0'>面板高度</td><td class='prortityPanelTabletd1'><input id='PanelHeight' type='number' value='100' /></td>");
    PanelContent.append("<td class='prortityPanelTabletd0Asso'>字体样式</td><td class='prortityPanelTabletd1Asso'><select id='PanelFontSty'>" +
        "<option selected value='微软雅黑'>微软雅黑</option>" +
        "<option value='宋体'>宋体</option>" +
        "<option value='楷体'>楷体</option>" +
        "<option value='黑体'>黑体</option>" +
        "<option value='隶书'>隶书</option>" +
        "<option value='仿宋'>仿宋</option>" +
        "<option value='华文彩云'>华文彩云</option>" +
        "<option value='华文琥珀'>华文琥珀</option>" +
        "<option value='华文隶书'>华文隶书</option>" +
        "</select></td>");
    PanelContent.append("<td class='prortityPanelTabletd0Asso'>背景颜色</td><td class='prortityPanelTabletd1Asso'><input id='PanelBgColor' type='text' class='basic input-mini'></td>");
    PanelContent.append("</tr>");
    PanelContent.append("<tr>");
    PanelContent.append("<td class='prortityPanelTabletd0Asso'>显示行数</td><td class='prortityPanelTabletd1Asso'><input id='AssociativeDisplayRows' type='number' min='4' max='10'/></td>");
    PanelContent.append("<td class='prortityPanelTabletd0Asso'>边框颜色</td><td class='prortityPanelTabletd1Asso'><input type='text' id='PanelBorderColor' /></td>");
    PanelContent.append("</tr>");

    PanelContent.append("</table>");
    PanelContent.append("</div>");
    var FilletObj = $(PanelContent.toString());

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"联想面板设置", DisabledValue:1, ContentObj:FilletObj }));

    //输入框设置
    InputContent = null;
    InputContent = new Agi.Script.StringBuilder();
    InputContent.append("<div class='Asso_Pro_Panel' >");
    InputContent.append("<table class='prortityPanelTableAsso' border='0' cellspacing='1' cellpadding='0'>");

    InputContent.append("<tr>");
    InputContent.append("<td class='prortityPanelTabletd0Asso'>字体颜色</td><td class='prortityPanelTabletd1Asso'><input id='InputFontColor' type='text' class='basic input-mini'></td>");
    InputContent.append("<td class='prortityPanelTabletd0Asso'>边框颜色</td><td class='prortityPanelTabletd1Asso'><input type='text' id='InputBorderColor' /></td>");
    InputContent.append("</tr>");

    InputContent.append("</table>");
    InputContent.append("</div>");
    var InputObj = $(InputContent.toString());

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"输入框设置", DisabledValue:1, ContentObj:InputObj }));

    //联想按钮设置
    ButtonContent = null;
    ButtonContent = new Agi.Script.StringBuilder();
    ButtonContent.append("<div class='Asso_Pro_Panel' >");
    ButtonContent.append("<table class='prortityPanelTableAsso' border='0' cellspacing='1' cellpadding='0'>");

    ButtonContent.append("<tr>");
    ButtonContent.append("<td class='prortityPanelTabletd0Asso'>背景颜色</td><td class='prortityPanelTabletd1Asso'><input id='ButtonBgColor' type='text' class='basic input-mini'></td>");
    ButtonContent.append("<td class='prortityPanelTabletd0Asso'colspan=''>文  本</td><td class='prortityPanelTabletd1Asso'><div class='selectDivClass'>" +
        "<input type='text' id='ButtonText' value='' maxlength='2'/></div></td>");
    ButtonContent.append("</tr>");
    ButtonContent.append("<tr>");
    ButtonContent.append("<td class='prortityPanelTabletd0Asso'>边框颜色</td><td class='prortityPanelTabletd1Asso'><input type='text' id='ButtonBorderColor' /></td>");
    ButtonContent.append("</tr>");

    ButtonContent.append("</table>");
    ButtonContent.append("</div>");
    var ButtonObj = $(ButtonContent.toString());

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"联想按钮设置", DisabledValue:1, ContentObj:ButtonObj }));

    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //6.属性禁用、启用处理
   /* Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
//        var itemtitle = _item.Title;
//        if (_item.DisabledValue == 0) {
//            itemtitle += "禁用";
//        } else {
//            itemtitle += "启用";
//        }
//        alert(itemtitle);
    }

*/
    $("#PanelFontSty").val(AssociativeInputBoxBasicProperty.PanelFontSty);
    $("#PanelBgColor").val(AssociativeInputBoxBasicProperty.PanelBgColor);
    $("#PanelBorderColor").val(AssociativeInputBoxBasicProperty.PanelBorderColor);
    $("#PanelSelectedColumnColor").val(AssociativeInputBoxBasicProperty.PanelSelectedColumnColor);
    $("#AssociativeDisplayRows").val(AssociativeInputBoxBasicProperty.AssociativeDisplayRows);
    $("#InputFontColor").val(AssociativeInputBoxBasicProperty.InputFontColor);
    $("#InputBorderColor").val(AssociativeInputBoxBasicProperty.InputBorderColor);
    $("#ButtonBgColor").val(AssociativeInputBoxBasicProperty.ButtonBgColor);
    $("#ButtonBorderColor").val(AssociativeInputBoxBasicProperty.ButtonBorderColor);
    $("#ButtonText").val(AssociativeInputBoxBasicProperty.ButtonText);

    //面板字体
    $("#PanelFontSty").change(function () {
        AssociativeInputBoxBasicProperty.PanelFontSty = $("#PanelFontSty").val();
        propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
    });
    //面板显示行
    $("#AssociativeDisplayRows").change(function () {
        //20130516 倪飘 解决bug，联想输入框控件联想面板设置中显示行数设置为1 弹出提示框："请输入4-10范围内的值！"，点击确定以后文本框中的值还是1
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val.trim() === "") {
            $(this).val(AssociativeInputBoxBasicProperty.AssociativeDisplayRows);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }
        else {
            if (val >= MinNumber && val <= MaxNumber) {
                AssociativeInputBoxBasicProperty.AssociativeDisplayRows = val;
                propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
            }
            else {
                $(this).val(AssociativeInputBoxBasicProperty.AssociativeDisplayRows);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
        }
        
    });
    //按钮文字
    $("#ButtonText").change(function () {
        AssociativeInputBoxBasicProperty.ButtonText = $("#ButtonText").val();
        propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
    });

    //面板背景颜色
    $("#PanelBgColor").spectrum({
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
            $("#PanelBgColor").val(color.toHexString());
            AssociativeInputBoxBasicProperty.PanelBgColor = color.toHexString();
            propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
        }
    });
    //按钮背景颜色
    $("#ButtonBgColor").spectrum({
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
            $("#ButtonBgColor").val(color.toHexString());
            AssociativeInputBoxBasicProperty.ButtonBgColor = color.toHexString();
            propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
        }
    });
    //按钮边框颜色
    $("#ButtonBorderColor").spectrum({
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
        change:function (color) {debugger;
            $("#ButtonBorderColor").val(color.toHexString());
            AssociativeInputBoxBasicProperty.ButtonBorderColor = color.toHexString();
            propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
        }
    });
    //输入框边框颜色
    $("#InputBorderColor").spectrum({
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
            $("#InputBorderColor").val(color.toHexString());
            AssociativeInputBoxBasicProperty.InputBorderColor = color.toHexString();
            propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
        }
    });
    //面板边框颜色
    $("#PanelBorderColor").spectrum({
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
            $("#PanelBorderColor").val(color.toHexString());
            AssociativeInputBoxBasicProperty.PanelBorderColor = color.toHexString();
            propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
        }
    });
    //输入框字体颜色
    $("#InputFontColor").spectrum({
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
            $("#InputFontColor").val(color.toHexString());
            AssociativeInputBoxBasicProperty.InputFontColor = color.toHexString();
            propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
        }
    });
    //面板选中行颜色
    $("#PanelSelectedColumnColor").spectrum({
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
            $("#PanelSelectedColumnColor").val(color.toHexString());
            AssociativeInputBoxBasicProperty.PanelSelectedColumnColor = color.toHexString();
            propertyAssociativeInputBox.Set("AssociativeInputBoxBasicProperty", AssociativeInputBoxBasicProperty);
        }
    });
    //修改绑定配置中的选择联想列
    var changeAsso = $("#changeAsso");
    changeAsso.val(SelectedColumn);
}

//单击双击事件处理
//20130520  倪飘 解决bug，联想输入框控件与其他控件进行联动的时候，双击联想输入框控件"go"按钮，会进入被联动的控件的高级属性面板
var AssociativeInputBoxflag = 0;
varAssociativeInputBoxObj = null;
Agi.Controls.AssociativeInputBoxClickManager = function (_ClickOption) {
    AssociativeInputBoxObj = _ClickOption;
    if (!AssociativeInputBoxflag) {
        setTimeout(Agi.Controls.AssociativeInputBoxClickLogic, 300);
    }
    AssociativeInputBoxflag++;
}
Agi.Controls.AssociativeInputBoxClickReset = function () {
    AssociativeInputBoxflag = 0;
}
Agi.Controls.AssociativeInputBoxSingleClick = function (_ClickOption) {
    Agi.Controls.AssociativeInputBoxClickReset();
    buttonAsso(_ClickOption.ControlObj, _ClickOption.ControlObj);
}
Agi.Controls.AssociativeInputBoxDoubleClick = function (_ClickOption) {
    Agi.Controls.AssociativeInputBoxClickReset();
    if (!Agi.Controls.IsControlEdit) {
        Agi.Controls.ControlEdit(_ClickOption.ControlObj); //控件编辑界面
    }
}

Agi.Controls.AssociativeInputBoxClickLogic = function () {
    if (AssociativeInputBoxflag === 1) {
        Agi.Controls.AssociativeInputBoxSingleClick(AssociativeInputBoxObj);
    }
    else {
        Agi.Controls.AssociativeInputBoxDoubleClick(AssociativeInputBoxObj);
    }
}
