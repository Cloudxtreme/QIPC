/// <reference path="../../jquery-1.7.2.min.js" />

/*添加 Agi.Controls命名空间*/
Namespace.register("Agi.Controls");

Agi.Controls.NewCheckBox = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
                //绑定点击事件
                CheckLoad(self);
                var BasicProperty = self.Get('BasicProperty');
                $('#' + self.shell.ID).find('.CheckBoxForm').live('click', function () {
                    var AllLabel = $('#' + self.shell.ID).find('label');
                    var AllCheckValue = "";
                    var AllCheckShowValue = "";
                    var AllValue = [];
                    var AllShowAndValue = [];
                    for (var i = 0; i < AllLabel.length; i++) {
                        if ($(AllLabel[i]).find('input')[0].checked) {
                            AllCheckValue += $(AllLabel[i]).attr('id') + ",";
                            AllCheckShowValue += $(AllLabel[i]).text() + ",";
                        }
                        AllShowAndValue.push({
                            ShowValue: $(AllLabel[i]).text(),
                            SelectValue: $(AllLabel[i]).attr('id')
                        });
                    }
                    AllValue.push({
                        AllCheckValue: AllCheckValue, //选择值
                        AllCheckShowValue: AllCheckShowValue//显示值
                    });
                    BasicProperty.AllShowAndValue = AllShowAndValue;
                    if (!Agi.Controls.IsControlEdit) {
                        self.Set("SelValue", AllValue);
                    }
                    else {
                        //                        AgiCommonDialogBox.Alert("高级属性编辑时将禁用参数联动！");
                        //                        return;
                    }
                });
                //保存值
                SaveValues(self);
                if (Agi.Edit) {
                    menuManagement.updateDataSourceDragDropTargets();
                }
            }
        },
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
            //绑定点击事件
            self.Set('BasicProperty', self.Get('BasicProperty'));
            CheckLoad(self);
            //保存值
            SaveValues(self);
            //触发参数联动
            // self.Set("SelValue", BasicProperty.SelectedValue);

        },
        ResetProperty: function () {

        },
        ReadData: function (et) {
            var self = this;
            if (!self.IsInitShareOrData) {
                //解决预览问题
                if (Agi.Edit) {
                    self.IsChangeEntity = true;
                }
                debugger;
                var entity = this.Get("Entity");
                entity = [];
                entity.push(et);
                var BasicProperty = self.Get('BasicProperty');
                BasicProperty.IsUseEntity = true;
                BasicProperty.IsChangeItem = false;
                BasicProperty.IsRefreshPanel = true;
                this.Set("Entity", entity);
            }
            self.IsInitShareOrData = false;
        },
        ReadRealData: function (_Entity) {
        },
        RemoveEntity: function (_EntityKey) {
            //20130201 倪飘 多选下拉框-拖入数据双击进入属性设置页面，下方数据无法删除问题解决
            if (!_EntityKey) {
                throw 'NewCheckBox.RemoveEntity Arg is null';
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
            var BasicProperty = self.Get('BasicProperty');
            BasicProperty.IsUseEntity = false;
            //删除下方数据表格
            Agi.Controls.ShowControlData(self);
            Agi.Msg.ShareDataRelation.DeleteItem(self.shell.BasicID);
            if (BasicProperty.IsRefreshPanel === true) {
                Agi.Controls.NewCheckBoxProrityInit(self);
            }
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.IsChangeEntity = false;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "NewCheckBox");
            this.IsInitShareOrData = false;
            var ID = savedId ? savedId : "NewCheckBox" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='height:auto; width:auto;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                //                width: 200,
                //                height: 50,
                divPanel: HTMLElementPanel
                //                enableFrame:true
            });

            var BaseControlObj = $('<div id=' + ID + ' class="CheckBoxForm has-js"><label id="NewCheckBox1" class="label_check labeldisplay" for="' + ID + 'checkbox-01">' +
                                                 '<div></div><input name="sample-checkbox-01" id="' + ID + 'checkbox-01" value="1" type="checkbox" checked />NewCheckBox1</label>' +
                                                 '<label class="label_check labeldisplay" for="' + ID + 'checkbox-02" id="NewCheckBox2">' +
                                                 '<div></div><input name="sample-checkbox-02" id="' + ID + 'checkbox-02" value="2" type="checkbox" /> NewCheckBox2</label></div>');
            this.shell.initialControl(BaseControlObj[0]);


            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            var BasicProperty = {
                ShowValueColumn: "",
                SelectValueColumn: "",
                SelectedValue: "",
                SelectedShowValue: "",
                AllShowAndValue: "",
                IsUseEntity: false,
                VOrH: "垂直",
                BorderColor: "#e3e3e3",
                BorderSize: "1px",
                LeftTopRadius: "0",
                RightTopRadius: "0",
                LeftBottomRadius: "0",
                RightBottomRadius: "0",
                BackgroundColor: "#e3e3e3",
                FontColor: "#000",
                CheckBoxBackground: "#fff",
                ItemCount: 5,
                IsChangeItem: false,
                IsRefreshPanel: true
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
                //                HTMLElementPanel.width(200);
                //                HTMLElementPanel.height(50);
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
                //                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                //                if (!Agi.Controls.IsControlEdit) {
                //                    Agi.Controls.ControlEdit(self); //控件编辑界面
                //                }
                //                Agi.Controls.CheckBoxClickManager({ "ControlObj": self }); //
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);
            //输出参数
            //            Agi.Edit.workspace.addParameter(ID + ".SelValue", 0);
            obj = ThisProPerty = PagePars = PostionValue = null;

            var basicproperty = self.Get("BasicProperty");

            Agi.Msg.PageOutPramats.AddPramats({
                'Type': Agi.Msg.Enum.Controls,
                'Key': ID,
                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': 0 }, { 'Name': 'ShowValue', 'Value': 0}]
            });

            //缩小的最小宽高设置
            HTMLElementPanel.resizable({
                //                minHeight: 50,
                minWidth: 180
            }).css("position", "absolute");
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.NewCheckBoxProrityInit(this);
        },
        //20130402 倪飘 解决bug，复选框控件被联动问题
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
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
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewNewCheckBox = new Agi.Controls.NewCheckBox();
                NewNewCheckBox.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewNewCheckBox;
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
            this.shell.Container.width(200)
                .find(".ui-dropdownchecklist-selector,.ui-dropdownchecklist-dropcontainer-wrapper").css("width", 200);
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                var IsHasDisplay = false;
                if ($($("#" + this.shell.ID).find('.CheckBoxForm label')).hasClass('labeldisplay')) {
                    IsHasDisplay = true;
                }
                if (IsHasDisplay) {
                    obj.height(this.oldSize.width);
                }
                else {
                    //20130401 倪飘 解决bug，新复选框，修改排列方式为水平后，返回整体页面，控件没有自动为水平模式自适应
                    obj.css('width', 'auto');
                }
                obj.height(this.oldSize.height);
                obj.resizable({
                    //                    minHeight: 50,
                    //                    minWidth: 180
                }).css("position", "absolute");
            }
            //重新刷新大小 andy guo
            this.PostionChange(null);
            //缩小的最小宽高设置
            obj.resizable({
                //                minHeight: 50,
                minWidth: 180
            }).css("position", "absolute");
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.NewCheckBoxAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            //            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.NewCheckBox.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var NewCheckBoxControl = {
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
            NewCheckBoxControl.Control.ControlType = this.Get("ControlType");
            NewCheckBoxControl.Control.ControlID = ProPerty.ID;
            NewCheckBoxControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            NewCheckBoxControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
            //            $(Entitys).each(function (i, e) {
            //                e.Data = null;
            //            });
            NewCheckBoxControl.Control.Entity = Entitys;
            NewCheckBoxControl.Control.BasicProperty = this.Get("BasicProperty");
            NewCheckBoxControl.Control.Position = this.Get("Position");
            NewCheckBoxControl.Control.ThemeInfo = this.Get("ThemeInfo");
            NewCheckBoxControl.Control.ZIndex = $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index");
            return NewCheckBoxControl.Control;
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

                    //                    _Config.ThemeInfo = _Config.ThemeInfo;
                    //                    this.Set("ThemeInfo", _Config.ThemeInfo);


                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    //                    //应用样式
                    //                    this.ChangeTheme(_Config.ThemeInfo);

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
                    this.IsInitShareOrData = true;
                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);
                    this.Set("Entity", _Config.Entity);
                    //20130524 倪飘 解决bug，新复选框，基本设置，修改选框背景后，返回整体页面，点击预览按钮，预览页面中选框背景与编辑页面不一致
                    this.Set("BasicProperty", BasicProperty);

                }
            }
        } //根据配置信息创建控件

    }, true);


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitNewCheckBox = function () {
    return new Agi.Controls.NewCheckBox();
}


/*应用样式，将样式应用到控件的相关参数以更新相关显示
* _StyConfig:样式配置信息
* _NewCheckBox:当前控件对象
* */
Agi.Controls.NewCheckBox.OptionsAppSty = function (_StyConfig, _NewCheckBox) {
    if (_StyConfig != null) {
        var BasicProperty = _NewCheckBox.Get('BasicProperty');
        var controlObject = $(_NewCheckBox.Get('HTMLElement'));
        controlObject.find('.CheckBoxForm').css('border', BasicProperty.BorderSize + ' solid ' + _StyConfig.borderColor);
        controlObject.find('.CheckBoxForm').css('border-top-left-radius', _StyConfig.borderRadius + "px");
        controlObject.find('.CheckBoxForm').css('border-top-right-radius', _StyConfig.borderRadius + "px");
        controlObject.find('.CheckBoxForm').css('border-bottom-left-radius', _StyConfig.borderRadius + "px");
        controlObject.find('.CheckBoxForm').css('border-bottom-right-radius', _StyConfig.borderRadius + "px");
        controlObject.find('.CheckBoxForm').css('background', _StyConfig.background);
        controlObject.find('.CheckBoxForm').css('color', _StyConfig.FontColor);
        controlObject.find('.CheckBoxForm').find('div').css('background-color', _StyConfig.CheckBoxBackground);

        BasicProperty.BorderColor = _StyConfig.borderColor;
        BasicProperty.LeftTopRadius = _StyConfig.borderRadius;
        BasicProperty.RightTopRadius = _StyConfig.borderRadius;
        BasicProperty.LeftBottomRadius = _StyConfig.borderRadius;
        BasicProperty.RightBottomRadius = _StyConfig.borderRadius;
        BasicProperty.BackgroundColor = _StyConfig.background;
        BasicProperty.FontColor = _StyConfig.FontColor;
        BasicProperty.CheckBoxBackground = _StyConfig.CheckBoxBackground;

    }
}


/*日期选择控件参数更改处理方法*/
Agi.Controls.NewCheckBoxAttributeChange = function (_ControlObj, Key, _Value) {
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
            } break;
        case "Entity": //实体
            {
                var BasicProperty = _ControlObj.Get('BasicProperty');
                if (BasicProperty.IsUseEntity === true) {
                    var entity = _ControlObj.Get('Entity');
                    if (entity && entity.length) {
                        BindDataByEntity(_ControlObj, entity[0]);
                    }
                    else {
                        var Panel = $('#' + _ControlObj.shell.ID).find('.CheckBoxForm');
                        $(Panel).html("");
                        $(Panel).html('<label id="NewCheckBox1" class="label_check labeldisplay" for="' + _ControlObj.shell.BasicID + 'checkbox-01">' +
                                                 '<div></div><input name="sample-checkbox-01" id="' + _ControlObj.shell.BasicID + 'checkbox-01" value="1" type="checkbox" checked />NewCheckBox1</label>' +
                                                 '<label class="label_check labeldisplay" for="' + _ControlObj.shell.BasicID + 'checkbox-02" id="NewCheckBox2">' +
                                                 '<div></div><input name="sample-checkbox-02" id="' + _ControlObj.shell.BasicID + 'checkbox-02" value="1" type="checkbox" /> NewCheckBox2</label>');
                        //绑定点击事件
                        CheckLoad(_ControlObj);
                    }
                }
                else {
                    var AllValueAndShow = BasicProperty.AllShowAndValue;
                    var SelectedValue = BasicProperty.SelectedValue;
                    var Panel = $('#' + _ControlObj.shell.ID).find('.CheckBoxForm');

                    var AllLabelHtml = "";
                    var valueList = SelectedValue.split(',');
                    //20130408 倪飘 修改bug复选框控件修改选项的显示值后保存页面，再次编辑时，修改项还原成默认的选项显示值
                    if (_ControlObj.IsInitRead) {
                        for (var i = 0; i < AllValueAndShow.length; i++) {
                            var IsChecked = "";
                            for (var j = 0; j < valueList.length; j++) {
                                if (valueList[j] == AllValueAndShow[i].SelectValue) {
                                    IsChecked = "checked";
                                }
                            }
                            if (BasicProperty.VOrH === "垂直") {
                                AllLabelHtml += "<label class='label_check labeldisplay' for='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' id=" + AllValueAndShow[i].SelectValue + "><div></div><input name='sample-checkbox-0" + parseInt(parseInt(i) + 1) + "' id='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' value='" + parseInt(parseInt(i) + 1) + "' type='checkbox' " + IsChecked + " />" + AllValueAndShow[i].ShowValue + "</label>";
                            } else {
                                AllLabelHtml += "<label class='label_check' for='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' id=" + AllValueAndShow[i].SelectValue + "><div></div><input name='sample-checkbox-0" + parseInt(parseInt(i) + 1) + "' id='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' value='" + parseInt(parseInt(i) + 1) + "' type='checkbox' " + IsChecked + " />" + AllValueAndShow[i].ShowValue + "</label>";
                            }
                        }
                        $(Panel).html("");
                        $(Panel).html(AllLabelHtml);
                        //绑定点击事件
                        CheckLoad(_ControlObj);

                        _ControlObj.IsInitRead = false;
                    }
                    else {
                        if (parseInt(BasicProperty.ItemCount) <= AllValueAndShow.length) {
                            for (var i = 0; i < BasicProperty.ItemCount; i++) {
                                var IsChecked = "";
                                for (var j = 0; j < valueList.length; j++) {
                                    if (valueList[j] == AllValueAndShow[i].SelectValue) {
                                        IsChecked = "checked";
                                    }
                                }
                                if (BasicProperty.VOrH === "垂直") {
                                    AllLabelHtml += "<label class='label_check labeldisplay' for='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' id=" + AllValueAndShow[i].SelectValue + "><div></div><input name='sample-checkbox-0" + parseInt(parseInt(i) + 1) + "' id='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' value='" + parseInt(parseInt(i) + 1) + "' type='checkbox' " + IsChecked + " />" + AllValueAndShow[i].ShowValue + "</label>";
                                } else {
                                    AllLabelHtml += "<label class='label_check' for='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' id=" + AllValueAndShow[i].SelectValue + "><div></div><input name='sample-checkbox-0" + parseInt(parseInt(i) + 1) + "' id='" + _ControlObj.shell.BasicID + "checkbox-0" + parseInt(parseInt(i) + 1) + "' value='" + parseInt(parseInt(i) + 1) + "' type='checkbox' " + IsChecked + " />" + AllValueAndShow[i].ShowValue + "</label>";
                                }
                            }
                            $(Panel).html("");
                            $(Panel).html(AllLabelHtml);
                            //绑定点击事件
                            CheckLoad(_ControlObj);
                        }
                    }


                }
            } break;
        case "SelValue":
            {
                var data = _Value;
                var BasicProperty = _ControlObj.Get("BasicProperty");
                var valuestr = "";
                var showstr = "";

                if (data.length > 0) {
                    var value = data[0].AllCheckValue.split(',');
                    var show = data[0].AllCheckShowValue.split(',');
                    for (var i = 0; i < value.length; i++) {
                        valuestr += value[i] + ",";
                    }
                    for (var i = 0; i < show.length; i++) {
                        showstr += show[i] + ",";
                    }
                    valuestr = valuestr.substr(0, valuestr.length - 2);
                    showstr = showstr.substr(0, showstr.length - 2);
                }

                var ThisProPerty = _ControlObj.Get("ProPerty");

                Agi.Msg.PageOutPramats.PramatsChange({
                    'Type': Agi.Msg.Enum.Controls,
                    'Key': ThisProPerty.ID,
                    'ChangeValue': [{ 'Name': 'selectedValue', 'Value': valuestr }, { 'Name': 'ShowValue', 'Value': showstr}]
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _ControlObj, "Type": Agi.Msg.Enum.Controls });

                BasicProperty.SelectedValue = valuestr;
                BasicProperty.SelectedShowValue = showstr;

            } break;
        case "BasicProperty":
            {
                var BasicProperty = _ControlObj.Get('BasicProperty');
                var controlObject = $(_ControlObj.Get('HTMLElement'));
                controlObject.find('.CheckBoxForm').css('border', BasicProperty.BorderSize + ' solid ' + BasicProperty.BorderColor);
                controlObject.find('.CheckBoxForm').css('border-top-left-radius', BasicProperty.LeftTopRadius + "px");
                controlObject.find('.CheckBoxForm').css('border-top-right-radius', BasicProperty.RightTopRadius + "px");
                controlObject.find('.CheckBoxForm').css('border-bottom-left-radius', BasicProperty.LeftBottomRadius + "px");
                controlObject.find('.CheckBoxForm').css('border-bottom-right-radius', BasicProperty.RightBottomRadius + "px");
                controlObject.find('.CheckBoxForm div').css('background-color', BasicProperty.CheckBoxBackground);
                controlObject.find('.CheckBoxForm').css('color', BasicProperty.FontColor);
                if (BasicProperty.VOrH === "水平") {
                    controlObject.find('.CheckBoxForm label').removeClass('labeldisplay');
                }
                else {
                    controlObject.find('.CheckBoxForm label').addClass('labeldisplay');
                }
                if (typeof (BasicProperty.BackgroundColor) === "string") {
                    controlObject.find('.CheckBoxForm').css('background', BasicProperty.BackgroundColor);
                }
                else {
                    controlObject.find('.CheckBoxForm').css(BasicProperty.BackgroundColor.value);
                }
            }
            break;
    } //end switch

    function BindDataByEntity(controlObj, et) {
        var self = controlObj;
        if (!et.IsShareEntity) {
            Agi.Utility.RequestData2(et, function (d) {

                var BasicProperty = self.Get("BasicProperty");
                BasicProperty.IsUseEntity = true;
                //修改列
                if (self.IsChangeEntity) {
                    BasicProperty.ShowValueColumn = d.Columns[0];
                    BasicProperty.SelectValueColumn = d.Columns[0];
                    self.IsChangeEntity = false;
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
                var IsHasDisplay = false;
                if ($($("#" + self.shell.ID).find('.CheckBoxForm label')).hasClass('labeldisplay')) {
                    IsHasDisplay = true;
                }
                $("#" + self.shell.ID).find('.CheckBoxForm').html("");
                var AllCheckBox = "";
                ///读取页面时如果有上次选定的数据，则绑定
                if (self.IsInitRead) {
                    if (BasicProperty.SelectedValue != "") {
                        var datalist = BasicProperty.SelectedValue.split(',');
                        $(data).each(function (i, dd) {
                            if (i < BasicProperty.ItemCount) {
                                var state = false;
                                for (var j = 0; j < datalist.length; j++) {
                                    if (datalist[j].trim() == dd[valueField].toString().trim()) { //20121227 9:39 倪飘 修改多选下拉控件预览时报的trim()错
                                        state = true;
                                        break;
                                    }
                                }
                                if (state) {
                                    if (IsHasDisplay === true) {
                                        AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox' checked />" + dd[textField].toString().trim() + "</label>";
                                    } else {
                                        AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox' checked />" + dd[textField].toString().trim() + "</label>";
                                    }
                                }
                                else {
                                    if (IsHasDisplay === true) {
                                        AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                                    } else {
                                        AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                                    }
                                }
                            }
                        });
                    }
                    else {
                        $(data).each(function (i, dd) {
                            if (i < BasicProperty.ItemCount) {
                                if (IsHasDisplay === true) {
                                    AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                                } else {
                                    AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                                }
                            }
                        });
                    }
                    self.IsInitRead = false;
                }
                else {
                    $(data).each(function (i, dd) {
                        if (i < BasicProperty.ItemCount) {
                            if (IsHasDisplay === true) {
                                AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                            } else {
                                AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                            }
                        }
                    });
                }

                $("#" + self.shell.ID).find('.CheckBoxForm').html(AllCheckBox);
                self.ReBindEvents();

                if (Agi.Controls.IsControlEdit && BasicProperty.IsChangeItem != true) {
                    Agi.Controls.ShowControlData(self); //更新实体数据显示
                    //局部刷新
                    if (BasicProperty.IsRefreshPanel === true) {
                        Agi.Controls.NewCheckBoxProrityInit(self); //更新属性面板
                    }
                    BasicProperty.IsRefreshPanel = true;
                    BasicProperty.IsChangeItem = false;
                }
            });


        } else {
            BindDataByJson.call(self, et, et);

        }
        return;
    }

    function BindDataByJson(et, d) {
        var self = this;
        var BasicProperty = self.Get("BasicProperty");
        BasicProperty.IsUseEntity = true;
        //修改列
        if (self.IsChangeEntity) {
            BasicProperty.ShowValueColumn = d.Columns[0];
            BasicProperty.SelectValueColumn = d.Columns[0];
            self.IsChangeEntity = false;
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
        var IsHasDisplay = false;
        if ($($("#" + self.shell.ID).find('.CheckBoxForm label')).hasClass('labeldisplay')) {
            IsHasDisplay = true;
        }
        $("#" + self.shell.ID).find('.CheckBoxForm').html("");
        var AllCheckBox = "";
        ///读取页面时如果有上次选定的数据，则绑定
        if (self.IsInitRead) {
            if (BasicProperty.SelectedValue != "") {
                var datalist = BasicProperty.SelectedValue.split(',');
                $(data).each(function (i, dd) {
                    if (i < BasicProperty.ItemCount) {
                        var state = false;
                        for (var j = 0; j < datalist.length; j++) {
                            if (datalist[j].trim() == dd[valueField].toString().trim()) { //20121227 9:39 倪飘 修改多选下拉控件预览时报的trim()错
                                state = true;
                                break;
                            }
                        }
                        if (state) {
                            if (IsHasDisplay === true) {
                                AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox' checked />" + dd[textField].toString().trim() + "</label>";
                            } else {
                                AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox' checked />" + dd[textField].toString().trim() + "</label>";
                            }
                        }
                        else {
                            if (IsHasDisplay === true) {
                                AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                            } else {
                                AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + parseInt(i) + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + parseInt(i) + 1 + "' value='" + parseInt(i) + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                            }
                        }
                    }
                });
            }
            else {
                $(data).each(function (i, dd) {
                    if (i < BasicProperty.ItemCount) {
                        if (IsHasDisplay === true) {
                            AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                        } else {
                            AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                        }
                    }
                });
            }
            self.IsInitRead = false;
        }
        else {
            $(data).each(function (i, dd) {
                if (i < BasicProperty.ItemCount) {
                    if (IsHasDisplay === true) {
                        AllCheckBox += "<label class='label_check labeldisplay' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                    } else {
                        AllCheckBox += "<label class='label_check' for='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' id=" + dd[valueField].toString().trim() + "><div></div><input name='sample-checkbox-0" + i + 1 + "' id='" + self.shell.BasicID + "checkbox-0" + i + 1 + "' value='" + i + 1 + "' type='checkbox'/>" + dd[textField].toString().trim() + "</label>";
                    }
                }
            });
        }


        $("#" + self.shell.ID).find('.CheckBoxForm').html(AllCheckBox);
        self.ReBindEvents();

        if (Agi.Controls.IsControlEdit && BasicProperty.IsChangeItem != true) {
            Agi.Controls.ShowControlData(self); //更新实体数据显示
            //局部刷新
            if (BasicProperty.IsRefreshPanel === true) {
                Agi.Controls.NewCheckBoxProrityInit(self); //更新属性面板
            }
            BasicProperty.IsRefreshPanel = true;
            BasicProperty.IsChangeItem = false;
        }
    }

}                                                                                                     //end


//ColumnChart 自定义属性面板初始化显示
Agi.Controls.NewCheckBoxProrityInit = function (NewCheckBoxControl) {
    var _NewCheckBox = NewCheckBoxControl;
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='NewCheckBox_Pro_Panel'>");
    ItemContent.append("<table class='NewCheckBox_prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>显示值：</td><td class='NewCheckBoxPro_Tabtd2'><select id='CheckShowValue'></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>选择值：</td><td class='NewCheckBoxPro_Tabtd2'><select id='CheckSelectValue'></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var DataObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "绑定设置", DisabledValue: 1, ContentObj: DataObj }));

    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='NewCheckBox_Pro_Panel'>");
    ItemContent.append("<table class='NewCheckBox_prortityPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>排列方式：</td><td class='NewCheckBox_prortityPanelTabletd2'><select id='CheckVorH'></select></td>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>数据条数：</td><td class='NewCheckBox_prortityPanelTabletd2'><input id='CheckItemCount' type='number' min='2' max='15' class='ControlProNumberSty'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>左上圆角：</td><td class='NewCheckBox_prortityPanelTabletd2'><input id='CheckLTR' type='number' max='50' min='0' class='ControlProNumberSty'></td>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>右上圆角：</td><td class='NewCheckBox_prortityPanelTabletd2'><input  id='CheckRTR' type='number' max='50' min='0' class='ControlProNumberSty'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>左下圆角：</td><td class='NewCheckBox_prortityPanelTabletd2'><input  id='CheckLBR' type='number' max='50' min='0' class='ControlProNumberSty'></td>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>右下圆角：</td><td class='NewCheckBox_prortityPanelTabletd2'><input id='CheckRBR' type='number' max='50' min='0' class='ControlProNumberSty'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    //<input id='CheckBackground' type='text'>
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>背景颜色：</td><td class='NewCheckBox_prortityPanelTabletd2'><div id='CheckBackground' style='background-color:#000000;' class='ControlColorSelPanelSty'></div></td>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>字体颜色：</td><td class='NewCheckBox_prortityPanelTabletd2'><input id='CheckFontColor' type='text'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>边框大小：</td><td class='NewCheckBox_prortityPanelTabletd2'><input id='CheckBorderSize' type='number' min='0' max='10' class='ControlProNumberSty'></td>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>边框颜色：</td><td class='NewCheckBox_prortityPanelTabletd2'><input id='CheckBorderColor' type='text'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'>选框背景：</td><td class='NewCheckBox_prortityPanelTabletd2'><input id='CheckBoxBackground' type='text'></td>");
    ItemContent.append("<td class='NewCheckBox_prortityPanelTabletd0'></td><td class='NewCheckBox_prortityPanelTabletd2'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 2, ContentObj: FilletObj }));

    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='NewCheckBox_Pro_Panel1'>");
    ItemContent.append("<div class='NewCheckBox_Small_Panel'>");
    var AllLabel = $('#' + _NewCheckBox.shell.ID).find('label');
    var AllListHtml = "";
    for (var i = 0; i < AllLabel.length; i++) {
        AllListHtml += "<div index=" + i + " id=" + $(AllLabel[i]).attr('id') + " onclick='clickdiv(this)'>" + $(AllLabel[i]).text() + "</div>";
    }
    ItemContent.append(AllListHtml);
    //20130408 倪飘 解决bug，复选框中添加属性显示值，选择值输入框没有做限制
    ItemContent.append("</div>");
    ItemContent.append("<div class='NewCheckBox_SmallR_Panel'>");
    ItemContent.append("<div>");
    ItemContent.append("<div>选项信息：</div><div>显示值：<input type='text' id='ShowInfo' maxlength='20'></br>选择值：<input type='text' id='SelectInfo' maxlength='20'></br><input type='button' value='保存修改' id='UpdateItem'><input type='button' value='删除选项' id='DeleteItem'></div>");
    ItemContent.append("</div>");

    ItemContent.append("<div>");
    ItemContent.append("<div>添加选项：</div><div>显示值：<input type='text' id='ShowAdd' maxlength='20'></br>选择值：<input type='text' id='SelectAdd' maxlength='20'></br><input type='button' value='添加' id='AddItem'></div>");
    ItemContent.append("</div>");
    ItemContent.append("</div>");
    ItemContent.append("</div>");
    var ManaObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "选项管理", DisabledValue: 2, ContentObj: ManaObj }));


    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);




    var BasicProperty = _NewCheckBox.Get('BasicProperty');
    var entity = _NewCheckBox.Get('Entity');

    if (BasicProperty.IsUseEntity === true) {
        $('#ShowInfo').attr('disabled', true);
        $('#SelectInfo').attr('disabled', true);
        $('#UpdateItem').attr('disabled', true);
        $('#DeleteItem').attr('disabled', true);
        //        $('#ShowAdd').attr('disabled', false);
        //        $('#SelectAdd').attr('disabled', false);
        //        $('#AddItem').attr('disabled', false);
    }
    else {
        $('#ShowInfo').attr('disabled', false);
        $('#SelectInfo').attr('disabled', false);
        $('#UpdateItem').attr('disabled', false);
        $('#DeleteItem').attr('disabled', false);
        //        $('#ShowAdd').attr('disabled', false);
        //        $('#SelectAdd').attr('disabled', false);
        //        $('#AddItem').attr('disabled', false);
    }


    $('#CheckBorderColor').val(BasicProperty.BorderColor);
    $('#CheckBorderSize').val(BasicProperty.BorderSize.substr(0, BasicProperty.BorderSize.indexOf('p')));
    $('#CheckLTR').val(BasicProperty.LeftTopRadius);
    $('#CheckRTR').val(BasicProperty.RightTopRadius);
    $('#CheckLBR').val(BasicProperty.LeftBottomRadius);
    $('#CheckRBR').val(BasicProperty.RightBottomRadius);
    $('#CheckBoxBackground').val(BasicProperty.CheckBoxBackground);
    Agi.Controls.ControlColorApply.fColorControlValueSet("CheckBackground", BasicProperty.BackgroundColor, true);
    $('#CheckFontColor').val(BasicProperty.FontColor);
    $("#CheckItemCount").val(BasicProperty.ItemCount);

    var VH = "<option value='垂直'>垂直</option><option value='水平'>水平</option>";
    $("#CheckVorH").append($(VH)).bind('change', function () {
        BasicProperty.VOrH = $("#CheckVorH").val();
        _NewCheckBox.Set("BasicProperty", BasicProperty);
    });

    $('#CheckVorH').val(BasicProperty.VOrH);

    $("#CheckBorderColor").spectrum({
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
            $("#CheckBorderColor").val(color.toHexString());
            BasicProperty.BorderColor = color.toHexString();
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
    });

    $("#CheckBorderSize").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val >= MinNumber && val <= MaxNumber) {
            BasicProperty.BorderSize = $("#CheckBorderSize").val() + "px";
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
        else {
            $(this).val(BasicProperty.BorderSize);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }


    });

    $("#CheckBoxBackground").spectrum({
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
            $("#CheckBoxBackground").val(color.toHexString());
            BasicProperty.CheckBoxBackground = color.toHexString();
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
    });

    $("#CheckBackground").unbind().bind("click", function () {
        var oThisSelColorPanel = this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel, [2], true, function (color) {
            $(oThisSelColorPanel).css("background", color.value.background).data('colorValue', color);
            oThisSelColorPanel = null;
            BasicProperty.BackgroundColor = color;
            //属性更改
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        });
    });

    $("#CheckFontColor").spectrum({
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
            $("#CheckFontColor").val(color.toHexString());
            BasicProperty.FontColor = color.toHexString();
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
    });

    $("#CheckLTR").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val >= MinNumber && val <= MaxNumber) {
            BasicProperty.LeftTopRadius = $("#CheckLTR").val();
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
        else {
            $(this).val(BasicProperty.LeftTopRadius);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });

    $("#CheckRTR").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val >= MinNumber && val <= MaxNumber) {
            BasicProperty.RightTopRadius = $("#CheckRTR").val();
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
        else {
            $(this).val(BasicProperty.RightTopRadius);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }


    });

    $("#CheckLBR").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val >= MinNumber && val <= MaxNumber) {

            BasicProperty.LeftBottomRadius = $("#CheckLBR").val();
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
        else {
            $(this).val(BasicProperty.LeftBottomRadius);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });

    $("#CheckRBR").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val >= MinNumber && val <= MaxNumber) {
            BasicProperty.RightBottomRadius = $("#CheckRBR").val();
            _NewCheckBox.Set("BasicProperty", BasicProperty);
        }
        else {
            $(this).val(BasicProperty.RightBottomRadius);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });


    $("#CheckItemCount").change(function () {
        var val = $(this).val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val >= MinNumber && val <= MaxNumber) {
            BasicProperty.ItemCount = val;
            BasicProperty.IsChangeItem = true;
            //        if (entity && entity.length) {
            _NewCheckBox.Set('Entity', _NewCheckBox.Get('Entity'));
            //        }

            var NewAllLabel = $('#' + _NewCheckBox.shell.ID).find('label');
            var AllListHtml = "";
            for (var i = 0; i < NewAllLabel.length; i++) {
                AllListHtml += "<div index=" + i + " id=" + $(NewAllLabel[i]).attr('id') + " onclick='clickdiv(this)'>" + $(NewAllLabel[i]).text() + "</div>";
            }

            $('.NewCheckBox_Small_Panel').html("");
            $('.NewCheckBox_Small_Panel').html(AllListHtml);
        }
        else {
            $(this).val(BasicProperty.ItemCount);
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });

    //获取所有列名选项
    var options = "";
    if (entity.length) {
        if (entity[0].Columns) {
            options = "";
            $(entity[0].Columns).each(function (i, col) {
                options += "<option value='" + col + "'>" + col + "</option>";
            });
        }
    }


    $("#CheckShowValue").append($(options)).bind('change', function () {
        BasicProperty.ShowValueColumn = $("#CheckShowValue").val();
        //BasicProperty.IsUseEntity = false;
        _NewCheckBox.IsChangeColumn = true;
        BasicProperty.IsChangeItem = false;
        if (BasicProperty.SelectValueColumn == "") {
            BasicProperty.SelectValueColumn = $("#CheckShowValue").val();
        }

        if (entity && entity.length) {
            _NewCheckBox.Set('Entity', _NewCheckBox.Get('Entity'));
        }
    });

    $("#CheckSelectValue").append($(options)).bind('change', function () {
        BasicProperty.SelectValueColumn = $("#CheckSelectValue").val();
        _NewCheckBox.IsChangeColumn = true;
        BasicProperty.IsChangeItem = false;
        //BasicProperty.IsUseEntity = false;
        if (BasicProperty.ShowValueColumn == "") {
            BasicProperty.ShowValueColumn = $("#CheckSelectValue").val();
        }
        if (entity && entity.length) {
            _NewCheckBox.Set('Entity', _NewCheckBox.Get('Entity'));
        }
    });

    //显示绑定的列的值
    $("#CheckShowValue").val(BasicProperty.ShowValueColumn);
    $("#CheckSelectValue").val(BasicProperty.SelectValueColumn);

    //20130410 倪飘 解决bug，新复选框控件中选项管理为点击选中选项，直接输入选项信息的显示值和选择值并点击保存修改或者删除选项，无提示
    $('#UpdateItem').bind('click', function () {
        BasicProperty.IsUseEntity = false;
        if ($('#ShowInfo').val().trim() != "" && $('#SelectInfo').val().trim() != "" && $(this).attr('index') != "") {
            var AllLabel = $('#' + _NewCheckBox.shell.ID).find('label');
            var index = $(this).attr('index');
            if (index) {
                for (var i = 0; i < AllLabel.length; i++) {
                    if (i === parseInt(index)) {
                        var ischecked = $($(AllLabel[i]).find('input'))[0].checked;
                        var checkedstr = "";
                        if (ischecked === true) {
                            checkedstr = "checked";
                        }
                        var innerhtml = "<div></div><input name='sample-checkbox-0" + parseInt(parseInt(i) + 1) + "' id='checkbox-0" + parseInt(parseInt(i) + 1) + "' value='" + parseInt(parseInt(i) + 1) + "' type='checkbox' " + checkedstr + "/>" + $('#ShowInfo').val()
                        $(AllLabel[i]).html("");
                        $(AllLabel[i]).html(innerhtml);
                        $(AllLabel[i]).attr('id', $('#SelectInfo').val());
                    }
                }

                var AllPanel = $('#' + _NewCheckBox.shell.ID);
                AllPanel.find('.CheckBoxForm').html("");
                AllPanel.find('.CheckBoxForm').html(AllLabel);
                CheckLoad(NewCheckBoxControl);
                var AllListHtml = "";
                for (var i = 0; i < AllLabel.length; i++) {
                    AllListHtml += "<div index=" + i + " id=" + $(AllLabel[i]).attr('id') + " onclick='clickdiv(this)'>" + $(AllLabel[i]).text() + "</div>";
                }

                $('.NewCheckBox_Small_Panel').html("");
                $('.NewCheckBox_Small_Panel').html(AllListHtml);

                //保存值
                SaveValues(NewCheckBoxControl);

                $(this).removeAttr('index');
                AgiCommonDialogBox.Alert("修改成功！");
            } else {
                AgiCommonDialogBox.Alert("请选择需要修改的选项！");
                return;
            }

        }
        else {
            AgiCommonDialogBox.Alert("请选择需要修改的项或者将内容填写完整！");
            return;
        }
    });

    $('#DeleteItem').bind('click', function () {
        BasicProperty.IsUseEntity = false;
        if ($('#ShowInfo').val() != "" && $('#SelectInfo').val() != "" && $(this).attr('index') != "") {
            var AllLabel = $('#' + _NewCheckBox.shell.ID).find('label');
            if (AllLabel.length > 2) {
                var index = $(this).attr('index');
                if (index) {
                    for (var i = 0; i < AllLabel.length; i++) {
                        if (i === parseInt(index)) {
                            AllLabel.splice(i, 1);
                        }
                    }
                    var AllPanel = $('#' + _NewCheckBox.shell.ID);
                    AllPanel.find('.CheckBoxForm').html("");
                    AllPanel.find('.CheckBoxForm').html(AllLabel);
                    CheckLoad(NewCheckBoxControl);
                    var AllListHtml = "";
                    for (var i = 0; i < AllLabel.length; i++) {
                        AllListHtml += "<div index=" + i + " id=" + $(AllLabel[i]).attr('id') + " onclick='clickdiv(this)'>" + $(AllLabel[i]).text() + "</div>";
                    }

                    $('.NewCheckBox_Small_Panel').html("");
                    $('.NewCheckBox_Small_Panel').html(AllListHtml);

                    $('#ShowInfo').val("");
                    $('#SelectInfo').val("");


                    //保存值
                    SaveValues(NewCheckBoxControl);


                    //20130409 倪飘 解决bug，新复选框控件选项管理中选中其中一项并删除，此时没有项被选中，但是输入显示值和选择值以后点击保存修改，左侧有其中一项被改动（点击删除选项无反应）
                    $(this).attr('index', '');
                    $('#UpdateItem').attr('index', '');
                    AgiCommonDialogBox.Alert("删除成功！");
                } else {
                    AgiCommonDialogBox.Alert("请选择需要删除的选项！");
                    return;
                }
            } else {
                AgiCommonDialogBox.Alert("选项不能少于2项！");
                return;
            }
        }
        else {
            AgiCommonDialogBox.Alert("请选择需要删除的选项！");
            return;
        }
    });

    $('#AddItem').bind('click', function () {
        if (BasicProperty.IsUseEntity === true) {
            AgiCommonDialogBox.Confirm("切换到自定义将清空实体数据，是否切换？", null, function (flag) {
                if (flag) {
                    BasicProperty.IsRefreshPanel = false;
                    NewCheckBoxControl.RemoveEntity(entity[0].Key);
                    BasicProperty.IsUseEntity = false;

                    $("#CheckShowValue").html("");
                    $("#CheckSelectValue").html("");
                    var AllLabel = $('#' + _NewCheckBox.shell.ID).find('label');
                    var AllListHtml = "";
                    for (var i = 0; i < AllLabel.length; i++) {
                        AllListHtml += "<div index=" + i + " id=" + $(AllLabel[i]).attr('id') + " onclick='clickdiv(this)'>" + $(AllLabel[i]).text() + "</div>";
                    }

                    $(".NewCheckBox_Small_Panel").html("");
                    $(".NewCheckBox_Small_Panel").html(AllListHtml);
                    $('#ShowInfo').attr('disabled', false);
                    $('#SelectInfo').attr('disabled', false);
                    $('#UpdateItem').attr('disabled', false);
                    $('#DeleteItem').attr('disabled', false);

                }
            });
        }
        else {
            BasicProperty.IsUseEntity = false;
            if ($('#ShowAdd').val().trim() != "" && $('#SelectAdd').val().trim() != "") {
                var AllLabel = $('#' + _NewCheckBox.shell.ID).find('label');
                if (AllLabel.length >= BasicProperty.ItemCount) {
                    AgiCommonDialogBox.Alert("数据条数已超过所选最大数据条数，将不能添加！");
                    return;
                }
                else {
                    var AllLabelPanel = $('#' + _NewCheckBox.shell.ID).find('.CheckBoxForm');
                    var IsHasDisplay = false;
                    if ($($("#" + _NewCheckBox.shell.ID).find('.CheckBoxForm label')).hasClass('labeldisplay')) {
                        IsHasDisplay = true;
                    }
                    var OneLabel = "";
                    var count = $(AllLabel).last().find('input').attr('value');
                    if (count === NaN) {
                        count = 1;
                    }
                    if (IsHasDisplay === true) {
                        OneLabel = "<label class='label_check labeldisplay' for='" + _NewCheckBox.shell.BasicID + "checkbox-0" + parseInt(parseInt(count) + 1) + "' id=" + $('#SelectAdd').val() + "><div></div><input name='sample-checkbox-0" + parseInt(parseInt(count) + 1) + "' id='" + _NewCheckBox.shell.BasicID + "checkbox-0" + parseInt(parseInt(count) + 1) + "' value='" + parseInt(parseInt(count) + 1) + "' type='checkbox'/>" + $('#ShowAdd').val() + "</label>";
                    } else {
                        OneLabel = "<label class='label_check' for='" + _NewCheckBox.shell.BasicID + "checkbox-0" + parseInt(parseInt(count) + 1) + "' id=" + $('#SelectAdd').val() + "><div></div><input name='sample-checkbox-0" + parseInt(parseInt(count) + 1) + "' id='" + _NewCheckBox.shell.BasicID + "checkbox-0" + parseInt(parseInt(count) + 1) + "' value='" + parseInt(parseInt(count) + 1) + "' type='checkbox'/>" + $('#ShowAdd').val() + "</label>";
                    }
                    $(AllLabelPanel).append(OneLabel);

                    var NewAllLabel = $('#' + _NewCheckBox.shell.ID).find('label');
                    var AllListHtml = "";
                    for (var i = 0; i < NewAllLabel.length; i++) {
                        AllListHtml += "<div index=" + i + " id=" + $(NewAllLabel[i]).attr('id') + " onclick='clickdiv(this)'>" + $(NewAllLabel[i]).text() + "</div>";
                    }

                    $('.NewCheckBox_Small_Panel').html("");
                    $('.NewCheckBox_Small_Panel').html(AllListHtml);

                    //20130409 倪飘 解决bug，新复选框控件在添加选项时输入显示值和选择值并点击添加以后显示值和选择值输入框中值没有被清空
                    $('#ShowAdd').val("");
                    $('#SelectAdd').val("");

                    CheckLoad(NewCheckBoxControl);
                    //保存值
                    SaveValues(NewCheckBoxControl);

                    AgiCommonDialogBox.Alert("添加成功！");
                }
            }
            else {
                AgiCommonDialogBox.Alert("请填写完整再添加！");
                return;
            }
        }
    });

}

//选项点击事件
function clickdiv(obj) {
    $('.NewCheckBox_Small_Panel div').css('background', 'none');
    $(obj).css('background', ' -webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(196,211,237)),color-stop(1, rgb(179,198,218)))');
    $('#ShowInfo').val($(obj).text());
    $('#SelectInfo').val($(obj).attr('id'));
    $('#UpdateItem').attr('index', $(obj).attr('index'));
    $('#DeleteItem').attr('index', $(obj).attr('index'));
    var ControlObj = Agi.Edit.workspace.currentControls[0];
    var BasicProperty = ControlObj.Get('BasicProperty');

    if (BasicProperty.IsUseEntity === true) {
        $('#ShowInfo').attr('disabled', true);
        $('#SelectInfo').attr('disabled', true);
        $('#UpdateItem').attr('disabled', true);
        $('#DeleteItem').attr('disabled', true);
        //        $('#ShowAdd').attr('disabled', true);
        //        $('#Selectdd').attr('disabled', true);
        //        $('#AddItem').attr('disabled', true);
    }
    else {
        $('#ShowInfo').attr('disabled', false);
        $('#SelectInfo').attr('disabled', false);
        $('#UpdateItem').attr('disabled', false);
        $('#DeleteItem').attr('disabled', false);
        //        $('#ShowAdd').attr('disabled', false);
        //        $('#SelectAdd').attr('disabled', false);
        //        $('#AddItem').attr('disabled', false);
    }

}

//保存值
function SaveValues(ControlConfig) {
    var _NewCheckBox = ControlConfig;
    var BasicProperty = _NewCheckBox.Get('BasicProperty');
    //保存值
    var AllLabelEnd = $('#' + _NewCheckBox.shell.ID).find('label');
    var AllCheckValue = "";
    var AllShowAndValue = [];
    for (var i = 0; i < AllLabelEnd.length; i++) {
        if ($(AllLabelEnd[i]).find('input')[0].checked) {
            AllCheckValue += $(AllLabelEnd[i]).attr('id') + ",";
        }
        AllShowAndValue.push({
            ShowValue: $(AllLabelEnd[i]).text(),
            SelectValue: $(AllLabelEnd[i]).attr('id')
        });
    }
    BasicProperty.SelectedValue = AllCheckValue;
    BasicProperty.AllShowAndValue = AllShowAndValue;
}

//绑定复选框的点击事件
function CheckLoad(ControlObj) {
    var ID = ControlObj.shell.ID;
    $('#' + ID).find('.label_check').click(function () {
        CheckBindEvents(ControlObj);
    });
    CheckBindEvents(ControlObj);
}
function CheckBindEvents(ControlObj) {
    var ID = ControlObj.shell.ID;
    if ($('#' + ID).find('.label_check input').length) {
        $('#' + ID).find('.label_check').each(function () {
            $(this).find('div').removeClass('c_on');
        });


        $('#' + ID).find('.label_check input:checked').each(function () {
            $(this).parent('label').find('div').addClass('c_on');
        });
    }
}

//单击双击事件处理
var NewCheckBoxflag = 0;
var NewCheckBoxObj = null;
Agi.Controls.CheckBoxClickManager = function (_ClickOption) {
    NewCheckBoxObj = _ClickOption;
    if (!NewCheckBoxflag) {
        setTimeout(Agi.Controls.CheckBoxClickLogic, 300);
    }
    NewCheckBoxflag++;
}
Agi.Controls.CheckBoxClickReset = function () {
    NewCheckBoxflag = 0;
}
Agi.Controls.CheckBoxSingleClick = function (_ClickOption) {
    Agi.Controls.CheckBoxClickReset();
    var ControlObj = _ClickOption.ControlObj;
    var BasicProperty = ControlObj.Get('BasicProperty');
    ControlObj.Set('SelValue', BasicProperty.SelectedValue);
}
Agi.Controls.CheckBoxDoubleClick = function (_ClickOption) {
    Agi.Controls.CheckBoxClickReset();
    if (!Agi.Controls.IsControlEdit) {
        Agi.Controls.ControlEdit(_ClickOption.ControlObj); //控件编辑界面
    }
}

Agi.Controls.CheckBoxClickLogic = function () {
    Agi.Controls.CheckBoxDoubleClick(NewCheckBoxObj);
}




