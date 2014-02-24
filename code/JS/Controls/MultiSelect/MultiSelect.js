/// <reference path="../../jquery-1.7.2.min.js" />

/*添加 Agi.Controls命名空间*/
Namespace.register("Agi.Controls");

Agi.Controls.MultiSelect = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () { //获得实体数据

        },
        SetValue: function (_string) {

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


                $("#" + self.shell.BasicID).dropdownchecklist(
                { icon: { placement: 'right' },
                    onComplete: function (selector) {
                        var values = "";
                        for (i = 0; i < selector.options.length; i++) {
                            if (selector.options[i].selected && (selector.options[i].value != "")) {
                                if (values != "") values += ",";
                                values += selector.options[i].value;
                            }
                        }
                        self.Set("SelValue", values);
                    },
                    firstItemChecksAll: true,
                    //                    maxDropHeight: 150, 
                    width: $("#" + self.shell.ID).width(),
                    emptyText: "请选择"
                });

                if (Agi.Edit) {
                    menuManagement.updateDataSourceDragDropTargets();
                }
            }
        },
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
            $("#" + self.shell.BasicID).dropdownchecklist(
                { icon: { placement: 'right' },
                    onComplete: function (selector) {
                        var values = "";
                        for (i = 0; i < selector.options.length; i++) {
                            if (selector.options[i].selected && (selector.options[i].value != "")) {
                                if (values != "") values += ",";
                                values += selector.options[i].value;
                            }
                        }
                        self.Set("SelValue", values);
                    },
                    firstItemChecksAll: true,
                    //                    maxDropHeight: 150,
                    width: $("#" + self.shell.ID).width() - 2,
                    emptyText: "请选择"
                });

            var BasicProperty = self.Get('BasicProperty');
            var controlObject = $(self.Get('HTMLElement'));
            controlObject.find('.ui-dropdownchecklist-selector-wrapper').css('display', "block");
            controlObject.find('.ui-dropdownchecklist-selector-wrapper').css('overflow', "visible");
            //            controlObject.find('.ui-dropdownchecklist-selector>span').css('color', BasicProperty.FontColor);
            //            controlObject.find('.ui-dropdownchecklist-selector').css('background', BasicProperty.BackGroundColor);

            var ThemeInfo = self.Get("ThemeInfo");
            if (ThemeInfo != null) {
                //1.根据当前控件类型和样式名称获取样式信息
                var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(self.Get("ControlType"), ThemeInfo);
                //3.应用当前控件的Options信息
                Agi.Controls.MultiSelect.OptionsAppSty(ChartStyleValue, self);
            } else {
                var ThisBasicProperty = self.Get("BasicProperty");
                self.Set("BasicProperty", ThisBasicProperty);
            }

            //触发参数联动
            self.Set("SelValue", BasicProperty.SelectedValue);

        },
        ResetProperty: function () {

        },
        ReadData: function (et) {
            var self = this;
            //解决预览问题
            if (Agi.Edit) {
                self.IsChangeEntity = true;
            }

            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);

            this.Set("Entity", entity);
        },
        ReadRealData: function (_Entity) {
        },
        RemoveEntity: function (_EntityKey) {
            //20130201 倪飘 多选下拉框-拖入数据双击进入属性设置页面，下方数据无法删除问题解决
            if (!_EntityKey) {
                throw 'MultiSelect.RemoveEntity Arg is null';
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
            Agi.Controls.MultiSelectProrityInit(self);
        },
        //20130402 倪飘 解决bug，多选下拉列表框控件无法被其他控件联动
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.IsChangeEntity = false;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "MultiSelect");

            var ID = savedId ? savedId : "MultiSelect" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom:15px; padding-right:2px;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 200,
                height: 22,
                divPanel: HTMLElementPanel
                //                enableFrame:true
            });

            var BaseControlObj = $('<select id=' + ID + ' multiple="multiple"></select>');
            this.shell.initialControl(BaseControlObj[0]);


            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            //20140218 范金鹏 添加FontFamily属性
            var BasicProperty = {
                IsUseStyle: false, //是否已应用样式
                FontSize: "12px",
                FontColor: "#000",
                BackGroundColor: "#e3e3e3",
                ListColor: "",
                ShowValueColumn: "",
                SelectValueColumn: "",
                SplitStr: ",",
                SelectedValue: "",
                BorderRadius: '0', //圆角半径
                BorderSize: '1', //边框宽度
                BorderColor: '#e3e3e3', //边框颜色
                TxtIndent: '0', //文本缩进
                MaxHeight: 150,
                FontFamily: ''
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
                HTMLElementPanel.height(22);
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
                if (Agi.Edit) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    Agi.Controls.ControlEdit(self); //控件编辑界面
                }
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);
            //输出参数
            Agi.Edit.workspace.addParameter(ID + ".SelValue", 0);
            obj = ThisProPerty = PagePars = PostionValue = null;

            var basicproperty = self.Get("BasicProperty");

            Agi.Msg.PageOutPramats.AddPramats({
                'Type': Agi.Msg.Enum.Controls,
                'Key': ID,
                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': 0}]
            });

            //缩小的最小宽高设置
            HTMLElementPanel.resizable({
                minHeight: 22,
                minWidth: 90,
                maxHeight: 22
            }).css("position", "absolute");

            //20130515 倪飘 解决bug，组态环境中拖入多选下拉列表框以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.MultiSelectProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            //            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

            //            Agi.Edit.workspace.controlList.remove(this);
            //            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
            //            Agi.Controls.ControlDestoryByList(this); //移除控件,从列表中

            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            Agi.Msg.PageOutPramats.RemoveItems(proPerty.ID); //控件删除时，移除联动参数相关
            proPerty = null;
            Me = null;
        },
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = $(this.Get("HTMLElement")).parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewMultiSelect = new Agi.Controls.MultiSelect();
//                NewMultiSelect.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewMultiSelect;
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

                var id = ThisHTMLElement.attr("id");
                ThisHTMLElement.find(".ui-dropdownchecklist-selector").css("width", $("#" + id).width() - 2);
                ThisHTMLElement.find(".ui-dropdownchecklist-dropcontainer-wrapper").css("width", $("#" + id).width() - 2);
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
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            if (size) {
                obj.css({ "width": size.width, "height": size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
            //固定一个宽度,防止超出左边的容器
            this.shell.Container.width(200);
            //20130525 倪飘 解决bug，多选下拉列表控件，拖入实体双击进入属性编辑页面后，点击下拉列表展开，多出盖住下面实体名称
            //obj.find(".ui-dropdownchecklist-dropcontainer").css("height", "320px");
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
            //重新刷新大小 andy guo
            this.PostionChange(null);
            //20130525 倪飘 解决bug，多选下拉列表控件，拖入实体双击进入属性编辑页面后，点击下拉列表展开，多出盖住下面实体名称
            //obj.find(".ui-dropdownchecklist-dropcontainer").css("height", "auto");
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.MultiSelectAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.MultiSelect.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var MultiSelectControl = {
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
            MultiSelectControl.Control.ControlType = this.Get("ControlType");
            MultiSelectControl.Control.ControlID = ProPerty.ID;
            MultiSelectControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            MultiSelectControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
            //            $(Entitys).each(function (i, e) {
            //                e.Data = null;
            //            });
            MultiSelectControl.Control.Entity = Entitys;
            MultiSelectControl.Control.BasicProperty = this.Get("BasicProperty");
            MultiSelectControl.Control.Position = this.Get("Position");
            MultiSelectControl.Control.ThemeInfo = this.Get("ThemeInfo");
            MultiSelectControl.Control.ZIndex = $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index");
            return MultiSelectControl.Control;
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
                    //应用样式
                    this.ChangeTheme(_Config.ThemeInfo);

                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);

                    $("#" + ThisProPerty.ID).css("z-index", _Config.ZIndex);

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


                    this.IsInitRead = true;
                    this.Set("Entity", _Config.Entity);


                }
            }
        } //根据配置信息创建控件
    }, true);


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitMultiSelect = function () {
    return new Agi.Controls.MultiSelect();
}


/*应用样式，将样式应用到控件的相关参数以更新相关显示
* _StyConfig:样式配置信息
* _MultiSelect:当前控件对象
* */
Agi.Controls.MultiSelect.OptionsAppSty = function (_StyConfig, _MultiSelect) {
    if (_StyConfig != null) {
        var mid = _MultiSelect.shell.ID;
        var ThisBasicProperty = _MultiSelect.Get("BasicProperty");
        //20130401 倪飘 解决bug，多选下拉列表框控件修改背景颜色以后，控件样式无法应用
        $("#" + mid + " .ui-dropdownchecklist-selector>span").css("color", _StyConfig.color);
        $("#" + mid + " .ui-dropdownchecklist-selector>span").css("font-size", _StyConfig.fontSize);
        $("#" + mid + " .ui-dropdownchecklist-selector").css("border-radius", _StyConfig.borderRadius);
        $("#" + mid + " .ui-dropdownchecklist-selector").css("background", _StyConfig.background);
        $("#" + mid + " .ui-dropdownchecklist-selector").css("border", _StyConfig.border);
        $("#" + mid + " .ui-dropdownchecklist-selector").css("text-indent", _StyConfig.textIndet);
        $("#" + mid + " .ui-dropdownchecklist-selector").css("height", "22px");

        ThisBasicProperty.FontSize = _StyConfig.fontSize;
        ThisBasicProperty.FontColor = _StyConfig.color;

        ThisBasicProperty.BackGroundColor = _StyConfig.background;
        ThisBasicProperty.BorderRadius = parseInt(_StyConfig.borderRadius.replace("px", ""));
        if (_StyConfig.border != null && _StyConfig.border != "") {
            var aBorderValues = _StyConfig.border.split(" ");
            if (aBorderValues != null && aBorderValues.length > 0) {
                for (var i = 0; i < aBorderValues.length; i++) {
                    if (aBorderValues[i] == "") {
                    } else {
                        if (aBorderValues[i].indexOf("px") > -1) {
                            ThisBasicProperty.BorderSize = parseInt(aBorderValues[i].replace("px", ""));
                        }
                        if (aBorderValues[i].indexOf("#") > -1 || aBorderValues[i].indexOf("(") > -1) {
                            ThisBasicProperty.BorderColor = aBorderValues[i];
                        }
                    }
                }
            }
        }
        ThisBasicProperty.TxtIndent = parseInt(_StyConfig.textIndet.replace("px", ""));
        ThisBasicProperty.IsUseStyle = true;
        _MultiSelect.Set("BasicProperty", ThisBasicProperty);
    }
}


/*日期选择控件参数更改处理方法*/
Agi.Controls.MultiSelectAttributeChange = function (_ControlObj, Key, _Value) {
    switch (Key) {
        case "Position":
            {
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElement = $(_ControlObj.Get("HTMLElement"));
                    var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

                    var ParentObj = ThisHTMLElement.parent();
                    var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                    //ThisControlObj.height(ThisHTMLElement.height()-20);
                    ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                    ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                    ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                    PagePars = null;
                }
                Agi.Controls.MultiSelectMaxHeightApply(_ControlObj);
            } break;
        case "Entity": //实体
            {
                var entity = _ControlObj.Get('Entity');
                if (entity && entity.length) {
                    BindDataByEntity(_ControlObj, entity[0]);
                } else {
                    $("#" + _ControlObj.shell.ID + " .selectPanelBodySty>span").remove();
                    $("#" + _ControlObj.shell.ID + " .selectPanelBodySty>div").remove();
                    $("#" + _ControlObj.shell.BasicID).html("");
                    $("#" + _ControlObj.shell.BasicID).dropdownchecklist(
                        { icon: { placement: 'right' },
                            firstItemChecksAll: true,
                            width: $("#" + _ControlObj.shell.ID).width()
                        });
                    var ThemeInfo = _ControlObj.Get("ThemeInfo");
                    if (ThemeInfo != null) {
                        //1.根据当前控件类型和样式名称获取样式信息
                        var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(_ControlObj.Get("ControlType"), ThemeInfo);
                        //3.应用当前控件的Options信息
                        Agi.Controls.MultiSelect.OptionsAppSty(ChartStyleValue, _ControlObj);
                    }
                    //解决bug，多选下拉列表框，未拖入数据时，修改控件属性，点击预览，预览界面未显示修改后的属性
                    _ControlObj.Set("BasicProperty", _ControlObj.Get('BasicProperty'));
                }
            } break;
        case "SelValue":
            {
                var data = _Value
                var BasicProperty = _ControlObj.Get("BasicProperty");
                if (data != "") {
                    var valuelist = data.split(',');

                    var valuestr = "";
                    if (valuelist.length > 1) {
                        for (var i = 0; i < valuelist.length; i++) {
                            if (valuelist[i] != "全选") {
                                valuestr += valuelist[i] + BasicProperty.SplitStr;
                            }
                        }
                        valuestr = valuestr.substr(0, valuestr.length - 1);
                    } else if (valuelist.length = 1) {
                        valuestr = valuelist[0];
                    }

                    //显示值
                    var controlLabel = $("#" + _ControlObj.shell.ID).find(".ui-dropdownchecklist-selector span");
                    if (_ControlObj.IsChangeColumn) {
                        controlLabel.html("请选择");
                        _ControlObj.IsChangeColumn = false;
                    } else {
                        controlLabel.html(valuestr);
                    }
                    var ThisProPerty = _ControlObj.Get("ProPerty");

                    Agi.Msg.PageOutPramats.PramatsChange({
                        'Type': Agi.Msg.Enum.Controls,
                        'Key': ThisProPerty.ID,
                        'ChangeValue': [{ 'Name': 'selectedValue', 'Value': valuestr}]
                    });
                    Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _ControlObj, "Type": Agi.Msg.Enum.Controls });

                    BasicProperty.SelectedValue = data;

                }
                //20130115 倪飘 解决多选下拉框控件拖入dataset，展开选择全选，再展开取消全选，点击页面预览按钮，多选下拉框中还显示全选的数据问题
                else {
                    BasicProperty.SelectedValue = data;
                }
            } break;
        case "BasicProperty":
            {
                var BasicProperty = _ControlObj.Get('BasicProperty');
                var controlObject = $(_ControlObj.Get('HTMLElement'));
                controlObject.find('.ui-dropdownchecklist-selector>span').css('color', BasicProperty.FontColor);
                if (BasicProperty.BackGroundColor != null && BasicProperty.BackGroundColor != "") {
                    if (typeof (BasicProperty.BackGroundColor) === "string") {
                        if (BasicProperty.BackGroundColor.indexOf("(") > -1) {
                            controlObject.find('.ui-dropdownchecklist-selector').css('background-color', "transparent");
                            controlObject.find('.ui-dropdownchecklist-selector').css('background', BasicProperty.BackGroundColor);
                        } else {
                            controlObject.find('.ui-dropdownchecklist-selector').css('background', "none");
                            controlObject.find('.ui-dropdownchecklist-selector').css('background-color', BasicProperty.BackGroundColor);
                        }
                    } else {
                        controlObject.find('.ui-dropdownchecklist-selector').css(BasicProperty.BackGroundColor.value);
                    }
                }

                if (BasicProperty.FontSize != null && BasicProperty.FontSize != "") {
                    controlObject.find(".ui-dropdownchecklist-selector>span").css("font-size", BasicProperty.FontSize);
                }
                if (BasicProperty.BorderRadius != null && BasicProperty.BorderRadius != "") {
                    controlObject.find(".ui-dropdownchecklist-selector").css("border-radius", BasicProperty.BorderRadius + "px");
                }
                if (BasicProperty.BorderSize != null && BasicProperty.BorderSize > 0) {
                    controlObject.find(".ui-dropdownchecklist-selector").css("border", BasicProperty.BorderSize + "px solid " + BasicProperty.BorderColor);
                } else {
                    controlObject.find(".ui-dropdownchecklist-selector").css("border", "0px solid #000000");
                }
                if (BasicProperty.TxtIndent != null && BasicProperty.TxtIndent != "") {
                    controlObject.find(".ui-dropdownchecklist-selector").css("text-indent", BasicProperty.TxtIndent + "px");
                }

                //20140218 范金鹏 数据绑定完成后，将字体样式设置到选项上面
                if(BasicProperty.FontFamily!=null&&BasicProperty.FontFamily!="")
                {
                controlObject.find('.ui-dropdownchecklist-text').css({ "font-family": "" + BasicProperty.FontFamily + "" });
                }
                //end

                //                    controlObject.find('.ui-widget-content').css('background', BasicProperty.ListColor+' !important');

            }
            break;
        case "ValueBindChange":
            {
                var entity = _ControlObj.Get('Entity');
                if (entity && entity.length) {
                    BindDataByEntity(_ControlObj, entity[0]);
                }
            }
            break;
    } //end switch

    function BindDataByEntity(controlObj, et) {
        var self = controlObj;
        if (!et.IsShareEntity) {
            Agi.Utility.RequestData2(et, function (d) {

                var BasicProperty = self.Get("BasicProperty");
                //修改列
                if (self.IsChangeEntity) {
                    BasicProperty.ShowValueColumn = d.Columns[0];
                    BasicProperty.SelectValueColumn = d.Columns[0];
                    self.IsChangeEntity = false;
                    //20130125 倪飘 修改多选下拉预览问题
                    BasicProperty.SelectedValue = "";
                    $("#" + self.shell.ID).find(".ui-dropdownchecklist-selector span").html("请选择");
                }

                var data = d.Data.length ? d.Data : [];
                var columns = d.Columns;
                et.Data = data;
                if (!et.Data || et.Data.lenght <= 0) {
                    AgiCommonDialogBox.Alert(et.Data);
                }
                et.Columns = d.Columns;
                var textField = BasicProperty && BasicProperty.ShowValueColumn ? BasicProperty.ShowValueColumn : columns[0];
                var valueField = BasicProperty && BasicProperty.SelectValueColumn ? BasicProperty.SelectValueColumn : columns[0];
                if (BasicProperty.ShowValueColumn == undefined) {
                    BasicProperty.ShowValueColumn = textField
                }
                if (BasicProperty.SelectValueColumn == undefined) {
                    BasicProperty.SelectValueColumn = valueField;
                }

                var ID = self.shell.BasicID;
                $("#" + self.shell.ID + " .selectPanelBodySty>span").remove();
                $("#" + self.shell.ID + " .selectPanelBodySty>div").remove();
                var stroption = "<option>全选</option>";

                ///读取页面时如果有上次选定的数据，则绑定
                if (self.IsInitRead) {
                    if (BasicProperty.SelectedValue != "") {
                        var datalist = BasicProperty.SelectedValue.split(',');
                        $(data).each(function (i, dd) {
                            var state = false;
                            for (var j = 0; j < datalist.length; j++) {
                                if (datalist[j].trim() == dd[valueField].toString().trim()) { //20121227 9:39 倪飘 修改多选下拉控件预览时报的trim()错
                                    state = true;
                                    break;
                                }
                            }
                            if (state) {
                                stroption += "<option value=" + dd[valueField].toString().trim() + " selected='selected'>" + dd[textField].toString().trim() + "</option>";
                            }
                            else {
                                stroption += "<option value=" + dd[valueField].toString().trim() + " >" + dd[textField].toString().trim() + "</option>";
                            }
                        });
                    }
                    else {
                        $(data).each(function (i, dd) {
                            stroption += "<option value=" + dd[valueField].toString().trim() + ">" + dd[textField].toString().trim() + "</option>";
                        });
                    }
                    self.IsInitRead = false;
                }
                else {
                    $(data).each(function (i, dd) {
                        stroption += "<option value=" + dd[valueField].toString().trim() + ">" + dd[textField].toString().trim() + "</option>";
                    });
                }

                $("#" + self.shell.BasicID).html(stroption);
                self.ReBindEvents();

                if (Agi.Controls.IsControlEdit) {
                    Agi.Controls.ShowControlData(self); //更新实体数据显示
                    Agi.Controls.MultiSelectProrityInit(self); //更新属性面板
                }
                Agi.Controls.MultiSelectMaxHeightApply(self);
            });


        } else {
            BindDataByJson.call(self, et, et);

        }
        return;
    }

    function BindDataByJson(et, d) {
        var self = this;
        var BasicProperty = self.Get("BasicProperty");
        //修改列
        if (self.IsChangeEntity) {
            BasicProperty.ShowValueColumn = d.Columns[0];
            BasicProperty.SelectValueColumn = d.Columns[0];
            self.IsChangeEntity = false;
            //20130125 倪飘 修改多选下拉预览问题
            BasicProperty.SelectedValue = "";
            $("#" + self.shell.ID).find(".ui-dropdownchecklist-selector span").html("请选择");
        }

        var data = d.Data.length ? d.Data : [];
        var columns = d.Columns;
        et.Data = data;
        if (!et.Data || et.Data.lenght <= 0) {
            AgiCommonDialogBox.Alert(et.Data);
        }
        et.Columns = d.Columns;
        var textField = BasicProperty && BasicProperty.ShowValueColumn ? BasicProperty.ShowValueColumn : columns[0];
        var valueField = BasicProperty && BasicProperty.SelectValueColumn ? BasicProperty.SelectValueColumn : columns[0];
        if (BasicProperty.ShowValueColumn == undefined) {
            BasicProperty.ShowValueColumn = textField
        }
        if (BasicProperty.SelectValueColumn == undefined) {
            BasicProperty.SelectValueColumn = valueField;
        }


        var ID = self.shell.BasicID;
        $("#" + self.shell.ID + " .selectPanelBodySty>span").remove();
        $("#" + self.shell.ID + " .selectPanelBodySty>div").remove();
        var stroption = "<option>全选</option>";

        ///读取页面时如果有上次选定的数据，则绑定
        if (self.IsInitRead) {
            if (BasicProperty.SelectedValue != "") {
                var datalist = BasicProperty.SelectedValue.split(',');
                $(data).each(function (i, dd) {
                    var state = false;
                    for (var j = 0; j < datalist.length; j++) {
                        if (datalist[j].trim() == dd[valueField].trim()) {
                            state = true;
                            break;
                        }
                    }
                    if (state) {
                        stroption += "<option value=" + dd[valueField].trim() + " selected='selected'>" + dd[textField].trim() + "</option>";
                    }
                    else {
                        stroption += "<option value=" + dd[valueField].trim() + " >" + dd[textField].trim() + "</option>";
                    }
                });

            }
            else {
                $(data).each(function (i, dd) {
                    stroption += "<option value=" + dd[valueField.trim()] + ">" + dd[textField.trim()] + "</option>";
                });
            }
            self.IsInitRead = false;
        }
        else {
            $(data).each(function (i, dd) {
                stroption += "<option value=" + dd[valueField.trim()] + ">" + dd[textField.trim()] + "</option>";
            });
        }

        $("#" + self.shell.BasicID).html(stroption);
        self.ReBindEvents();

        if (Agi.Controls.IsControlEdit) {
            Agi.Controls.ShowControlData(self); //更新实体数据显示
            Agi.Controls.MultiSelectProrityInit(self); //更新属性面板
        }
        Agi.Controls.MultiSelectMaxHeightApply(self);
    }

}                                                  //end


//ColumnChart 自定义属性面板初始化显示
Agi.Controls.MultiSelectProrityInit = function (MultiSelectControl) {
    var _MultiSelect = MultiSelectControl;
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='MultiSelect_Pro_Panel'>");
    ItemContent.append("<table class='MultiSelectProPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>字体颜色：</td><td class='MultiSelectProTabtd1'><input id='MSfontcolorselect' type='text'></td>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>字体大小：</td><td class='MultiSelectProTabtd1'><input type='number' title='字体大小' min='12' max='30' defaultvalue='12' value='0' id='MultiSel_FontSize' class='MultiSelectNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>背景颜色：</td><td class='MultiSelectProTabtd1'><div id='MSbgcolorselect' style='background-color:#ffffffff;' class='ControlColorSelPanelSty'></div></td>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>圆角半径：</td><td class='MultiSelectProTabtd1'><input type='number' title='圆角半径' min='0' max='10' defaultvalue='0' value='0' id='MultiSel_BorderRadius' class='MultiSelectNumberSty'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>边框宽度：</td><td class='MultiSelectProTabtd1'><input type='number' title='边框宽度' min='0' max='10' defaultvalue='0' value='0' id='MultiSel_BorderSize' class='MultiSelectNumberSty'/></td>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>边框颜色：</td><td class='MultiSelectProTabtd1'><input type='text' id='MultiSel_Bordercolor'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    //20140218 范金鹏 删除文字缩进colspan=3，添加字体样式选择框
    ItemContent.append("<td class='MultiSelectProTabtd0'>文字缩进：</td><td class='MultiSelectProTabtd1'><input type='number' title='文字缩进' min='0' max='30' defaultvalue='0' value='0' id='MultiSel_TxtIndent' class='MultiSelectNumberSty'/></td>");
    ItemContent.append("<td>字体样式：</td><td><div><select id='FontFamilySelect'>" +
        '<option selected value="微软雅黑">微软雅黑</option>' +
        "<option value='宋体'>宋体</option>" +
        "<option value='楷体'>楷体</option>" +
        "<option value='黑体'>黑体</option>" +
        "<option value='隶书'>隶书</option>" +
        "<option value='仿宋'>仿宋</option>" +
        "<option value='华文彩云'>华文彩云</option>" +
        "<option value='华文琥珀'>华文琥珀</option>" +
        "<option value='华文隶书'>华文隶书</option>" +
        '</select></div></td>');
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>显示值：</td><td class='MultiSelectProTabtd1' colspan='3'><select id='MSShowValue'></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>选择值：</td><td class='MultiSelectProTabtd1' colspan='3'><select  id='MSSelectValue'></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr style='display:none;'>");
    ItemContent.append("<td class='MultiSelectProTabtd0'>分隔符：</td><td class='MultiSelectProTabtd1' colspan='3'><input type='text' id='MSSplitStr'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //显示保存值
    var BasicProperty = _MultiSelect.Get("BasicProperty");
    var entity = _MultiSelect.Get('Entity');



    //绑定所有的列信息
    var options = "";
    if (entity.length) {
        if (entity[0].Columns) {
            options = "";
            $(entity[0].Columns).each(function (i, col) {
                options += "<option value='" + col + "'>" + col + "</option>";
            });
        }
    }

    //        $("#MSShowValue").html(options);
    //        $("#MSSelectValue").html(options);

    //应用属性
    $("#MSfontcolorselect").spectrum({
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
            $("#MSfontcolorselect").val(color.toHexString());
            BasicProperty.FontColor = color.toHexString();
            _MultiSelect.Set("BasicProperty", BasicProperty);
        }
    });

    //背景设置
    $("#MSbgcolorselect").unbind().bind("click", function () {
        var oThisSelColorPanel = this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel, [2], true, function (color) {
            $(oThisSelColorPanel).css("background", color.value.background).data('colorValue', color);
            oThisSelColorPanel = null;
            BasicProperty.BackGroundColor = color;
            //属性更改
            _MultiSelect.Set("BasicProperty", BasicProperty);
        });
    });

    $("#MSShowValue").append($(options)).bind('change', function () {
        BasicProperty.ShowValueColumn = $("#MSShowValue").val();
        _MultiSelect.IsChangeColumn = true;
        if (BasicProperty.SelectValueColumn == undefined) {
            BasicProperty.SelectValueColumn = $("#MSSelectValue").val();
        }
        _MultiSelect.Set("ValueBindChange", null);
    });

    $("#MSSelectValue").append($(options)).bind('change', function () {
        BasicProperty.SelectValueColumn = $("#MSSelectValue").val();
        _MultiSelect.IsChangeColumn = true;
        if (BasicProperty.ShowValueColumn == undefined) {
            BasicProperty.ShowValueColumn = $("#MSShowValue").val();
        }
        _MultiSelect.Set("ValueBindChange", null);
    });

    //20140218 范金鹏 增加字体选择控件的change事件代码
    $("#FontFamilySelect").bind('change', function () {
        var val = $("#FontFamilySelect").val();
        BasicProperty.FontFamily = val;
        _MultiSelect.Set("BasicProperty", BasicProperty);
    });
    //end

    //显示绑定的列的值
    $("#MSShowValue").val(BasicProperty.ShowValueColumn);
    $("#MSSelectValue").val(BasicProperty.SelectValueColumn);
    $("#MSSplitStr").live('change', function () {
        BasicProperty.SplitStr = $("#MSSplitStr").val();
        _MultiSelect.Set("BasicProperty", BasicProperty);
    });

    $("#MultiSel_Bordercolor").spectrum({
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
            $("#MultiSel_Bordercolor").val(color.toHexString());
            BasicProperty.BorderColor = color.toHexString();
            _MultiSelect.Set("BasicProperty", BasicProperty);
        }
    });
    //20130401 倪飘 解决bug，多选下拉列表框中字体大小输入31并点击空白地方，弹出提示框，控件中显示的字体大小与输入框中的值不一致（圆角半径、边框宽度、文字缩进均存在此问题）
    $(".MultiSelectNumberSty").unbind().bind("change", function (ev) {
        var title = $(this).attr('title');
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (title == '字体大小') {
            if (val.trim() === "") {
                $(this).val(BasicProperty.FontSize.substr(0, BasicProperty.FontSize.indexOf('p')));
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
            else {
                if (val >= MinNumber && val <= MaxNumber) {
                    BasicProperty.FontSize = val + "px";
                }
                else {
                    $(this).val(BasicProperty.FontSize.substr(0, BasicProperty.FontSize.indexOf('p')));
                    var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                    AgiCommonDialogBox.Alert(DilogboxTitle);
                }
            }
        }
        else if (title == '圆角半径') {
            if (val.trim() === "") {
                $(this).val(BasicProperty.BorderRadius);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
            else {
                if (val >= MinNumber && val <= MaxNumber) {
                    BasicProperty.BorderRadius = val;
                }
                else {
                    $(this).val(BasicProperty.BorderRadius);
                    var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                    AgiCommonDialogBox.Alert(DilogboxTitle);
                }
            }
        } else if (title == '边框宽度') {
            if (val.trim() === "") {
                $(this).val(BasicProperty.BorderSize);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
            else {
                if (val >= MinNumber && val <= MaxNumber) {
                    BasicProperty.BorderSize = val;
                }
                else {
                    $(this).val(BasicProperty.BorderSize);
                    var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                    AgiCommonDialogBox.Alert(DilogboxTitle);
                }
            }
        } else if (title == '文字缩进') {
            if (val.trim() === "") {
                $(this).val(BasicProperty.TxtIndent);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
            else {
                if (val >= MinNumber && val <= MaxNumber) {
                    BasicProperty.TxtIndent = val;
                }
                else {
                    $(this).val(BasicProperty.TxtIndent);
                    var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                    AgiCommonDialogBox.Alert(DilogboxTitle);
                }
            }
        }

        //            BasicProperty.FontSize = $("#MultiSel_FontSize").val() + "px";
        //            BasicProperty.BorderRadius = $("#MultiSel_BorderRadius").val();
        //            BasicProperty.BorderSize = $("#MultiSel_BorderSize").val();
        //            BasicProperty.TxtIndent = $("#MultiSel_TxtIndent").val();
        //属性更改
        _MultiSelect.Set("BasicProperty", BasicProperty);
    });

    //region 初始化属性面板值显示
    if (BasicProperty.BackGroundColor != null && BasicProperty.BackGroundColor != "") {
        if (typeof (BasicProperty.BackGroundColor) === "string") {
            if (BasicProperty.BackGroundColor.indexOf("(") > -1) {
                BasicProperty.BackGroundColor = {
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
                             "background": BasicProperty.BackGroundColor
                         }
                };
            } else {
                BasicProperty.BackGroundColor = { "type": 1, "rgba": "", "hex": "ffffff", "ahex": "", "value": { "background": ""} };
            }
        }
    } else {
        BasicProperty.BackGroundColor = { "type": 1, "rgba": "", "hex": BasicProperty.BackGroundColor, "ahex": "ffffffff", "value": { "background": BasicProperty.BackGroundColor} };
    }
    Agi.Controls.ControlColorApply.fColorControlValueSet("MSbgcolorselect", BasicProperty.BackGroundColor, true); //背景设置初始化

    $("#MSfontcolorselect").spectrum("set", BasicProperty.FontColor); //字体颜色
    $("#MSSplitStr").val(BasicProperty.SplitStr); //分隔符
    //字体大小
    if (BasicProperty.FontSize != null && BasicProperty.FontSize != "") {
        $("#MultiSel_FontSize").val(parseInt(BasicProperty.FontSize.replace("px")));
    } else {
        $("#MultiSel_FontSize").val(12);
    }
    //圆角半径
    if (BasicProperty.BorderRadius != null && BasicProperty.BorderRadius != "") {
        $("#MultiSel_BorderRadius").val(BasicProperty.BorderRadius);
    } else {
        $("#MultiSel_BorderRadius").val(0);
    }
    //边框宽度
    if (BasicProperty.BorderSize != null && BasicProperty.BorderSize != "") {
        $("#MultiSel_BorderSize").val(BasicProperty.BorderSize);
    } else {
        $("#MultiSel_BorderSize").val(0);
    }
    //缩进
    if (BasicProperty.TxtIndent != null && BasicProperty.TxtIndent != "") {
        $("#MultiSel_TxtIndent").val(BasicProperty.TxtIndent);
    } else {
        $("#MultiSel_TxtIndent").val(0);
    }
    if (BasicProperty.BorderColor != null && BasicProperty.BorderColor != "") {
        $("#MultiSel_Bordercolor").spectrum("set", BasicProperty.BorderColor);
    } else {
        $("#MultiSel_Bordercolor").spectrum("set", "#000000");
    }

    //20140218 范金鹏 绑定上次选择的值到字体选择控件
    if (BasicProperty.FontFamily) {
    }
    else {
        BasicProperty.FontFamily = "";
    }
    $("#FontFamilySelect").val(BasicProperty.FontFamily);
    //end
    //endregion
}

//20131225 22:33 markeluo 新增最大高度应用
Agi.Controls.MultiSelectMaxHeightApply = function (_Cotnrol) {
    var basicproperty = _Cotnrol.Get("BasicProperty");
    var InitMaxHeight = "auto";
    if (basicproperty.MaxHeight != null) {
        if (basicproperty.MaxHeight == "auto") {
        } else {
            InitMaxHeight = basicproperty.MaxHeight + "px";
        }
    } else {
        InitMaxHeight = "150px";
    }
    var DropListPanelID = "ddcl-" + _Cotnrol.shell.BasicID + "-ddw";
    $($("#" + DropListPanelID).children()[0]).css("height", InitMaxHeight);
}