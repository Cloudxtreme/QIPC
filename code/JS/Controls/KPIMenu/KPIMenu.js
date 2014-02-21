/// <reference path="../../jquery-1.7.2.min.js" />

/*添加 Agi.Controls命名空间*/
Namespace.register("Agi.Controls");

Agi.Controls.KPIMenu = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
                if (Agi.Edit) {
                    menuManagement.updateDataSourceDragDropTargets();
                }
            }
        },
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
        },
        ResetProperty: function () {

        },
        ReadData: function (et) {
            var self = this;
            self.IsChangeEntity = true;

            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);

            this.Set("Entity", entity);
        },
        ParameterChange: function (_ParameterInfo) {//参数联动

            this.Set('Entity', this.Get('Entity'));
        },
        ReadRealData: function (_Entity) {
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.IsChangeEntity = false;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "KPIMenu");

            var ID = savedId ? savedId : "KPIMenu" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom:15px; padding-right:2px;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 190,
                height: 120,
                divPanel: HTMLElementPanel
                //                enableFrame:true
            });

            var BaseControlObj = $('<div id='+ID+' class="KPIMenu">'+
                                                    '<div class="KPILeft">'+
                                                        '<div class="KPIOneText"><div id="ChartIcon"></div><div id="TextIcon"><span>MEAN</span></div><div class="sitdiv"></div><div id="ArrawIcon"></div></div>'+
                                                        '<div class="KPITwoText"><span>24.519</span></div>'+
                                                        '<div class="KPIThreeText"><div class="sitdiv"></div><div class="ThreeSpan"><span>23.519</span></div></div>' +
                                                    '</div>'+
//                                                    '<div class="KPIRight">↑</div>' +
                                                '</div>');
            this.shell.initialControl(BaseControlObj[0]);


            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            var BasicProperty = {
                TitleName:"Menu",
                SecondValue:"",
                ThridValue:"",
                ShowIcon:"Yes"
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
                HTMLElementPanel.width(190);
                HTMLElementPanel.height(120);
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
            });

            $('#' + self.shell.ID).dblclick(function (ev) {

                if (!Agi.Controls.IsControlEdit) {
                    ev.stopPropagation();
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
//            Agi.Edit.workspace.addParameter(ID + ".SelValue", 0);
            obj = ThisProPerty = PagePars = PostionValue = null;

            var basicproperty = self.Get("BasicProperty");

//            Agi.Msg.PageOutPramats.AddPramats({
//                'Type': Agi.Msg.Enum.Controls,
//                'Key': ID,
//                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': 0}]
//            });

            //缩小的最小宽高设置
            HTMLElementPanel.resizable({
                minHeight: 100,
                minWidth: 50
            });
            //20130515 倪飘 解决bug，组态环境中拖入KIP面板以后拖入容器框控件，容器框控件会覆盖KPI面板控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.KPIMenuProrityInit(this);
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
        Copy: function () {
            //20130530 倪飘 解决bug，SPC演示控件中-KPI面板不能复制，粘贴，按F12页面报错
            if (layoutManagement.property.type == 1) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewKPIMenu = new Agi.Controls.KPIMenu();
                NewKPIMenu.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewKPIMenu;
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
            };
            if (size) {
                obj.css({ "width": size.width, "height": size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
            //固定一个宽度,防止超出左边的容器
            this.shell.Container.css({'width':190,'height':120});
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight: 50,
                    minWidth: 100
                });
            }
            //刷新大小
            this.PostionChange(null);
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.KPIMenuAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.KPIMenu.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var KPIMenuControl = {
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
            KPIMenuControl.Control.ControlType = this.Get("ControlType");
            KPIMenuControl.Control.ControlID = ProPerty.ID;
            KPIMenuControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            KPIMenuControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
//            $(Entitys).each(function (i, e) {
//                e.Data = null;
//            });
            KPIMenuControl.Control.Entity = Entitys;
            KPIMenuControl.Control.BasicProperty = this.Get("BasicProperty");
            KPIMenuControl.Control.Position = this.Get("Position");
            //            MultiSelectControl.Control.ThemeInfo = this.Get("ThemeInfo");
            KPIMenuControl.Control.ThemeInfo = this.Get("ThemeInfo");
            KPIMenuControl.Control.ZIndex = $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index");
            return KPIMenuControl.Control;
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

                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);


                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    //应用样式
                    this.ChangeTheme(_Config.ThemeInfo);

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

                    this.Set("Entity", _Config.Entity);


                }
            }
        } //根据配置信息创建控件
    }, true);


//拖拽控件至编辑页面时，初始控件的方法
    Agi.Controls.InitKPIMenu = function () {
        return new Agi.Controls.KPIMenu();
}


/*应用样式，将样式应用到控件的相关参数以更新相关显示
* _StyConfig:样式配置信息
* _MultiSelect:当前控件对象
* */
Agi.Controls.KPIMenu.OptionsAppSty = function (_StyConfig, _KPIMenu) {
    if (_StyConfig != null) {
        var mid = _KPIMenu.shell.ID;
        $('#' + mid + ' .KPIMenu').css('background', _StyConfig.background);
        $('#' + mid + ' .KPIMenu').css('border', _StyConfig.border);
        $('#' + mid + ' .KPIMenu').css('border-radius', _StyConfig.borderRadius);
        $('#' + mid + ' .KPIMenu').css('boxShadow', _StyConfig.boxShadow);
        $('#' + mid).find('.KPIOneText').css('color', _StyConfig.OneColor);
        $('#' + mid).find('.KPITwoText').css('color', _StyConfig.TwoColor);

    }
}


/*日期选择控件参数更改处理方法*/
Agi.Controls.KPIMenuAttributeChange = function (_ControlObj, Key, _Value) {
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
                var entity = _ControlObj.Get('Entity');
                if (entity && entity.length) {
                    BindDataByEntity(_ControlObj, entity[0]);
                } else {

                }
            } break;
        case "BasicProperty":
            {
                var BasicProperty = _ControlObj.Get('BasicProperty');
                var controlObject = $(_ControlObj.Get('HTMLElement'));

                controlObject.find('.KPIOneText span').text(BasicProperty.TitleName);
                if (BasicProperty.ShowIcon == "Yes") {
                    controlObject.find('#ChartIcon').css('background-image', 'url(JS/Controls/KPIMenu/img/icon-chart.png)');
                } else {
                    controlObject.find('#ChartIcon').css('background-image', 'none');
                }

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
                    BasicProperty.SecondValue = d.Columns[0];
                    BasicProperty.ThridValue = d.Columns[0];
                    self.IsChangeEntity = false;
                }

                var data = d.Data.length ? d.Data : [];
                var columns = d.Columns;
                et.Data = data;
                if (!et.Data || et.Data.lenght <= 0) {
                    AgiCommonDialogBox.Alert(et.Data);
                }
                et.Columns = d.Columns;
                var SecondField = BasicProperty && BasicProperty.SecondValue ? BasicProperty.SecondValue : columns[0];
                var ThridField = BasicProperty && BasicProperty.ThridValue ? BasicProperty.ThridValue : columns[0];
                if (BasicProperty.SecondValue == undefined) {
                    BasicProperty.SecondValue = SecondField
                }
                if (BasicProperty.ThridValue == undefined) {
                    BasicProperty.ThridValue = ThridField;
                }

                var ID = self.shell.BasicID;
                $("#" + ID).find('.KPITwoText span').text(data[0][SecondField]);
                $("#" + ID).find('.KPIThreeText span').text(data[0][ThridField]);



                if (isNaN(data[0][SecondField]) == false && isNaN(data[0][ThridField]) == false) {
                    if (parseFloat(data[0][SecondField]) >= parseFloat(data[0][ThridField])) {
                        $("#" + ID).find('#ArrawIcon').css('background-image', 'url(JS/Controls/KPIMenu/img/arrow-red.png)');
                        $("#" + ID).find('.KPIThreeText span').css('color', '#d40237');
                    } else {
                        $("#" + ID).find('#ArrawIcon').css('background-image', 'url(JS/Controls/KPIMenu/img/arrow-green.png)');
                        $("#" + ID).find('.KPIThreeText span').css('color', '#00a31b');
                    }
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
        //修改列
        if (self.IsChangeEntity) {
            BasicProperty.SecondValue = d.Columns[0];
            BasicProperty.ThridValue = d.Columns[0];
            self.IsChangeEntity = false;
        }

        var data = d.Data.length ? d.Data : [];
        var columns = d.Columns;
        et.Data = data;
        if (!et.Data || et.Data.lenght <= 0) {
            alert(et.Data);
        }
        et.Columns = d.Columns;
        var SecondField = BasicProperty && BasicProperty.SecondValue ? BasicProperty.SecondValue : columns[0];
        var ThridField = BasicProperty && BasicProperty.ThridValue ? BasicProperty.ThridValue : columns[0];
        if (BasicProperty.SecondValue == undefined) {
            BasicProperty.SecondValue = SecondField
        }
        if (BasicProperty.ThridValue == undefined) {
            BasicProperty.ThridValue = ThridField;
        }

        var ID = self.shell.BasicID;
        $("#" + ID).find('.KPITwoText span').text(data[0][SecondField]);
        $("#" + ID).find('.KPIThreeText span').text(data[0][ThridField]);



        if (isNaN(data[0][SecondField]) == false && isNaN(data[0][ThridField]) == false) {
            if (parseFloat(data[0][SecondField]) >= parseFloat(data[0][ThridField])) {
                $("#" + ID).find('#ArrawIcon').css('background-image', 'url(JS/Controls/KPIMenu/img/arrow-red.png)');
                $("#" + ID).find('.KPIThreeText span').css('color', '#d40237');
            } else {
                $("#" + ID).find('#ArrawIcon').css('background-image', 'url(JS/Controls/KPIMenu/img/arrow-green.png)');
                $("#" + ID).find('.KPIThreeText span').css('color', '#00a31b');
            }
        }
    }

}                                                           //end


//ColumnChart 自定义属性面板初始化显示
Agi.Controls.KPIMenuProrityInit = function (KPIMenuControl) {
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='DatePickerProperty'>");
    ItemContent.append("<div>标题显示：<input type='text' id='KPITitleName' class='ControlProTextSty' maxlength='20' ischeck='true'></div>");
    ItemContent.append("<div>第二行显示值：<select id='KPISecondValue'></select></div>");
    ItemContent.append("<div>第三行显示值：<select id='KPIThridValue'></select></div>");
    ItemContent.append("<div>是否显示chart图标：<select id='KPIChartIcon'></select></div>");
    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //显示保存值
    var BasicProperty = KPIMenuControl.Get("BasicProperty");
    var entity = KPIMenuControl.Get('Entity');

    $("#KPITitleName").val(BasicProperty.TitleName);

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

    //    $("#KPISecondValue").html(options);
    //    $("#KPIThridValue").html(options);



    $("#KPITitleName").change(function () {
        BasicProperty.TitleName = $("#KPITitleName").val();
        KPIMenuControl.Set("BasicProperty", BasicProperty);
    });


    $("#KPISecondValue").append($(options)).bind('change', function () {
        BasicProperty.SecondValue = $("#KPISecondValue").val();
        KPIMenuControl.Set("BasicProperty", BasicProperty);
    });

    $("#KPIThridValue").append($(options)).bind('change', function () {
        BasicProperty.ThridValue = $("#KPIThridValue").val();
        KPIMenuControl.Set("BasicProperty", BasicProperty);
    });

    //显示绑定的列的值
    $("#KPISecondValue").val(BasicProperty.SecondValue);
    $("#KPIThridValue").val(BasicProperty.ThridValue);

    var IconOptions = "<option value='Yes'>显示</option><option value='No'>隐藏</option>";
    $("#KPIChartIcon").append($(IconOptions)).bind('change', function () {
        BasicProperty.ShowIcon = $("#KPIChartIcon").val();
        KPIMenuControl.Set("BasicProperty", BasicProperty);
    });

    $("#KPIChartIcon").val(BasicProperty.ShowIcon);

}