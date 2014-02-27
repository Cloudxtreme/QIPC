/**
* Created with JetBrains WebStorm.
* User: zsj
* Date: 2013年3月18日
* Time: 14:02:00
* To change this template use File | Settings | File Templates.
* CheckBox 单选按钮
*/
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/

Agi.Controls.CheckBox = Agi.OOP.Class.Create(Agi.Controls.ControlBasic, {
	 //还原控件自己的属性,不绑定数据
    InitialControlObject:function(controlConfig){
        var self = this;
        self.shell = null;
        self.snycTheme = false;
        //还原控件的shell属性，有些控件可能没有用到，可以不用还原shell
        self.shell = new Agi.Controls.Shell({});
        self.shell.initialControlFromDom(self);

        //当前控件需要的一些属性
        var getCheckBoxBasicProperty =  controlConfig.CheckBoxBasicProperty;
        self.AttributeList.push({Key: "CheckBoxBasicProperty", Value: getCheckBoxBasicProperty});

        //输出参数声明
        var SelectValueIndex = getCheckBoxBasicProperty.SelectedCheckBox;
        var CheckedText = getCheckBoxBasicProperty.CheckBoxText;
        var CheckedValue = getCheckBoxBasicProperty.CheckBoxValue;
        var text = "";
        var value = "";
        if (SelectValueIndex.length > 0) {
            for (var i = 0; i < SelectValueIndex.length; i++) {
                text += CheckedText[SelectValueIndex[i]] + ",";
                value += CheckedValue[SelectValueIndex[i]] + ",";
            }
            text = text.substr(0, text.length - 1);
            value = value.substr(0, value.length - 1);
        }


        var OutPramats = { "CheckedText": text, "CheckedValue": value };
        var ThisOutParats = [];
        if (OutPramats != null) {
            for (var item in OutPramats) {
                ThisOutParats.push({ Name: item, Value: OutPramats[item] });
            }
        }

        Agi.Msg.PageOutPramats.PramatsChange({
            "Type": Agi.Msg.Enum.Controls,
            "Key": controlConfig.ControlID,
            "ChangeValue": ThisOutParats
        });
        this.controlLoadCompleted();
    },
    //绑定数据
    BindEntityData:function(callBack){
        this.Set('Entity',this.Get('Entity'))
    },
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
        var CheckBoxBasicProperty = self.Get("CheckBoxBasicProperty");
        if (Agi.Edit) {
            if (CheckBoxBasicProperty.DataType == "UserDefined") {
                /*if(!self.IsEditState){
                CheckBoxBasicProperty.DataType = "Entity";
                }*/
                AgiCommonDialogBox.Confirm("若添加实体数据将清空自定义数据，是否切换？", null, function (flag) {
                    if (flag) {
                        // self.IsUserDefined=false;
                        CheckBoxBasicProperty.DataType = "Entity";
                        CheckBoxBasicProperty.CheckBoxTextField = "";
                        CheckBoxBasicProperty.CheckBoxValueField = "";
                        CheckBoxBasicProperty.SelectedCheckBox = [];
                        self.Set("CheckBoxBasicProperty", CheckBoxBasicProperty);
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
            } else {
                //self.IsUserDefined=false;
                CheckBoxBasicProperty.DataType = "Entity";
                CheckBoxBasicProperty.CheckBoxTextField = "";
                CheckBoxBasicProperty.CheckBoxValueField = "";
                self.Set("CheckBoxBasicProperty", CheckBoxBasicProperty);
                self.IsChangeEntity = true;
                var entity = self.Get("Entity");
                entity = [];
                entity.push(et);
                self.Set("Entity", entity);
            }
        }
    },
    ReadOtherData: function (Point) {
    },
    ReadRealData: function (MsgObj) {
    },
    AddColumn: function (_entity, _ColumnName) {
        var CheckBoxBasicProperty = this.Get('CheckBoxBasicProperty');
        CheckBoxBasicProperty.CheckBoxTextField = _ColumnName;

        $(_entity.Data).each(function (i, dd) {
            if (i < CheckBoxBasicProperty.EntityNum) {
                CheckBoxBasicProperty.CheckBoxText[i] = dd[CheckBoxBasicProperty.CheckBoxTextField];
            }
        });
        this.Set("CheckBoxBasicProperty", CheckBoxBasicProperty);

    }, //拖动列到option

    Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
        var self = this;
        self.AttributeList = [];
        self.Set("Entity", []);
        self.Set("ControlType", "CheckBox");
        var ID = savedId ? savedId : "CheckBox" + Agi.Script.CreateControlGUID();
        var HTMLCheckBox = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty CheckBoxPanelSty' style='padding-bottom:15px;'></div>");
        self.shell = new Agi.Controls.Shell({
            ID: ID,
            width: 250,
            height: 150,
            divPanel: HTMLCheckBox
        });
        // self.IsUserDefined=true;
        var CheckBoxBasicProperty = {

            CheckBoxText: ["CheckBox0", "CheckBox1", "CheckBox2"],
            CheckBoxValue: ["0", "1", "2"],
            ItemNum: 3,
            //            CheckBoxOutParameters: [0], //选中元素位置
            CheckBoxTextField: "", //显示值列名
            CheckBoxValueField: "", //返回值列名
            DataType: "UserDefined", //自定义：UserDefined,数据实体:"Entity"
            EntityNum: 3,
            SelectedCheckBox: [0, 1],
            ItemEditSelectNum: 0,
            ShowCounts: 5,
            Alignment: "vertical", //"horizontal","vertical"排列方式
            RowHeight: "25",        //保存拖拽和手动设置的值
            MinRowHeight: "25",    //只保存手动设置的值，主要用于配置后返回整体页面的最小值参考
            ColumnWidth: "250",
            MinColumnWidth: "100",
            BackgroundColor: { value: { background: "#f9f9f9"} }, //背景颜色
            ButtonColor: "#dadcdb", //按钮颜色(填充渐变结束的颜色)
            FontColor: "#000",
            FontFamily: ["微软雅黑", "宋体", "黑体", "楷体_GB2312", "Arial", "Times New Roman"],
            FontIndex: 0,
			FontSize:12,
            BorderColor: "#9f9f9f", //边框颜色
            CheckedBackgroundColor: { value: { background: "-webkit-gradient(linear,left top,left bottom,color-stop(0, rgb(237,237,237)),color-stop(1, rgb(215,215,215)))"} }, //选中背景颜色(填充渐变结束的颜色值)
            CheckedButtonColor: "#dedede"//选中按钮颜色(填充渐变结束的颜色值)
        };
        this.Set("CheckBoxBasicProperty", CheckBoxBasicProperty);
        var getCheckBoxProperty = this.Get("CheckBoxBasicProperty");
        var BaseControlObjHtml = '<div id="' + ID + '" class="CheckBoxDiv">';
        var showCount = getCheckBoxProperty.ItemNum > getCheckBoxProperty.ShowCounts ? getCheckBoxProperty.ShowCounts : getCheckBoxProperty.ItemNum;
        if (getCheckBoxProperty.Alignment == "vertical") {
            BaseControlObjHtml = BaseControlObjHtml + '<table class="CheckBoxTable">';

            for (var buttonId = 0; buttonId < showCount; buttonId++) {
                BaseControlObjHtml = BaseControlObjHtml + '<tr><td alt="' + buttonId + '" class="CheckBoxTD"><input type="chekbox" style="width: 0px;" value="' + buttonId + '"/><div class="CheckBoxUnChecked"></div><span class="CheckBoxSpan">' + getCheckBoxProperty.CheckBoxText[buttonId] + '</span></td></tr>';
            }

        } else {
            BaseControlObjHtml = BaseControlObjHtml + '<table class="CheckBoxTable_horizontal">';
            BaseControlObjHtml = BaseControlObjHtml + "<tr class='CheckBoxHorizontalTR'>";
            for (var buttonId = 0; buttonId < showCount; buttonId++) {
                BaseControlObjHtml = BaseControlObjHtml + '<td alt="' + buttonId + '" class="CheckBoxTD_horizontal"><input type="chekbox" style="width: 0px;" value="' + buttonId + '"/><div class="CheckBoxUnChecked"></div><span class="CheckBoxSpan">' + getCheckBoxProperty.CheckBoxText[buttonId] + '</span></td>';
            }
            BaseControlObjHtml = BaseControlObjHtml + "</tr>";
        }
        BaseControlObjHtml = BaseControlObjHtml + '</table></div>';
        var BaseControlObj = $(BaseControlObjHtml);
        if (getCheckBoxProperty.Alignment == "vertical") {
            BaseControlObj.find('.CheckBoxTD').css("height", CheckBoxBasicProperty.RowHeight);
            BaseControlObj.find('.CheckBoxTD').css("width", CheckBoxBasicProperty.ColumnWidth);
            BaseControlObj.find(".CheckBoxTable").css("height", "auto");
            BaseControlObj.find(".CheckBoxTable").css("width", CheckBoxBasicProperty.ColumnWidth);
            BaseControlObj.css({ "min-width": (parseInt(CheckBoxBasicProperty.MinColumnWidth) + 2), "min-height": (parseInt(CheckBoxBasicProperty.MinRowHeight) * 2 + 3), "max-width": 802, "max-height": (101 * showCount + 1) });
        } else {
            BaseControlObj.find('.CheckBoxTD_horizontal').css("width", CheckBoxBasicProperty.ColumnWidth);
            BaseControlObj.find('.CheckBoxTD_horizontal').css("height", CheckBoxBasicProperty.RowHeight);
            BaseControlObj.find(".CheckBoxTable_horizontal").css("height", CheckBoxBasicProperty.RowHeight);
            BaseControlObj.find(".CheckBoxTable_horizontal").css("width", "auto");
            BaseControlObj.css({ "min-width": (parseInt(CheckBoxBasicProperty.MinColumnWidth) + 2), "min-height": (parseInt(CheckBoxBasicProperty.MinRowHeight) + 2), "max-width": ((801) * showCount + 1), "max-height": 102 });
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
            HTMLCheckBox.width(252);
            HTMLCheckBox.height(79);
            PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
            PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
            PostionValue.Right = ((PagePars.Width - HTMLCheckBox.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
            PostionValue.Bottom = ((PagePars.Height - HTMLCheckBox.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
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

        $UI.mousedown(function (ev) {
            if (Agi.Edit) {
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            }
        });

        $UI.dblclick(function (ev) {
            //20130426 倪飘 解决bug，容器控件，控件中拖入单选按钮1，双击单选按钮1，无法进入单选按钮1的属性编辑页面
            ev.stopPropagation();
            Agi.Controls.CheckBoxClickManager({ "ControlObj": self });
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
            HTMLCheckBox.resizable({
            });
        }

        Agi.Msg.PageOutPramats.AddPramats({
            "Type": Agi.Msg.Enum.Controls,
            "Key": ID,
            "ChangeValue": [{ 'Name': 'CheckedText', 'Value': 0 }, { 'Name': 'CheckedValue', 'Value': 0}]
        });
        //注释代码
        {
            //        $UI.find(".CheckBoxTD").each(function () {
            //            for (var i = 0; i < getCheckBoxProperty.SelectedCheckBox.length; i++) {
            //                if (getCheckBoxProperty.SelectedCheckBox[i] == parseInt($(this).attr("alt"))) {
            //                    //                    $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value).parent().removeClass("CheckBoxTDChecked").css(getCheckBoxProperty.BackgroundColor.value);
            //                    $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked").css("background", getCheckBoxProperty.CheckedButtonColor + " url('JS/Controls/CheckBox1/img/hook-CheckBox.png') no-repeat center center");
            //                    //                    $(this).parent().siblings().find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background", "-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to(" + getCheckBoxProperty.ButtonColor + "))");
            //                }
            //            }
            //            var outPramats;
            //            $(this).unbind('click touchstart').bind('click touchstart', function () {
            //                //                var CheckBoxOutParametersNum = $(this).attr("alt");
            //                //                getCheckBoxProperty.SelectedCheckBox.push($(this).attr("alt"));
            //                //                outPramats = { "CheckedText": getCheckBoxProperty.CheckBoxText[getCheckBoxProperty.CheckBoxOutParameters], "CheckedValue": getCheckBoxProperty.CheckBoxValue[CheckBoxOutParametersNum] };

            //                if ($(this).find("div").attr("class") === "CheckBoxUnChecked") {
            //                    $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked");
            //                    //                    $(this).addClass("CheckBoxTDChecked").parent().siblings().children().removeClass("CheckBoxTDChecked");
            //                    var state = false;
            //                    for (var j = 0; j < getCheckBoxProperty.SelectedCheckBox.length; j++) {
            //                        if (getCheckBoxProperty.SelectedCheckBox[j] === parseInt($(this).attr("alt"))) {
            //                            state = true;
            //                        }
            //                    }
            //                    if (!state) {
            //                        getCheckBoxProperty.SelectedCheckBox.push(parseInt($(this).attr("alt")));
            //                    }
            //                }
            //                else {
            //                    $(this).find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked");
            //                    //                    $(this).addClass("CheckBoxTDChecked").parent().siblings().children().removeClass("CheckBoxTDChecked");
            //                    for (var k = 0; k < getCheckBoxProperty.SelectedCheckBox.length; k++) {
            //                        if (getCheckBoxProperty.SelectedCheckBox[k] === parseInt($(this).attr("alt"))) {
            //                            getCheckBoxProperty.SelectedCheckBox.splice(j, 1);
            //                        }
            //                    }
            //                }
            //                $(this).addClass("CheckBoxTDChecked").parent().siblings().children().removeClass("CheckBoxTDChecked");
            //                //                self.Set("OutPramats", outPramats);
            //                self.Set('CheckBoxBasicProperty', getCheckBoxProperty);
            //            });
            //        });
            //        $UI.find(".CheckBoxTD_horizontal").each(function () {
            //            for (var i = 0; i < getCheckBoxProperty.SelectedCheckBox.length; i++) {
            //                if (getCheckBoxProperty.SelectedCheckBox[i] == parseInt($(this).attr("alt"))) {
            //                    //                    $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value).removeClass("CheckBoxTDChecked").css(getCheckBoxProperty.BackgroundColor.value);
            //                    $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked").css("background", getCheckBoxProperty.CheckedButtonColor + " url('JS/Controls/CheckBox1/img/hook-CheckBox.png') no-repeat center center");
            //                    //                    $(this).siblings().find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background", "-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to(" + getCheckBoxProperty.ButtonColor + "))");
            //                }
            //            }
            //            var outPramats;
            //            $(this).unbind('click touchstart').bind('click touchstart', function () {
            //                //                var CheckBoxOutParametersNum = $(this).attr("alt");
            //                //                getCheckBoxProperty.SelectedCheckBox.push($(this).attr("alt"));
            //                //                outPramats = { "CheckedText": getCheckBoxProperty.CheckBoxText[getCheckBoxProperty.CheckBoxOutParameters], "CheckedValue": getCheckBoxProperty.CheckBoxValue[CheckBoxOutParametersNum] };
            //                if ($(this).find("div").attr("class") === "CheckBoxUnChecked") {
            //                    $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked");
            //                    //                    $(this).addClass("CheckBoxTDChecked").parent().siblings().children().removeClass("CheckBoxTDChecked");
            //                    var state = false;
            //                    for (var j = 0; j < getCheckBoxProperty.SelectedCheckBox.length; j++) {
            //                        if (getCheckBoxProperty.SelectedCheckBox[j] === parseInt($(this).attr("alt"))) {
            //                            state = true;
            //                        }
            //                    }
            //                    if (!state) {
            //                        getCheckBoxProperty.SelectedCheckBox.push(parseInt($(this).attr("alt")));
            //                    }
            //                }
            //                else {
            //                    $(this).find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked");
            //                    //                    $(this).addClass("CheckBoxTDChecked").parent().siblings().children().removeClass("CheckBoxTDChecked");
            //                    for (var k = 0; k < getCheckBoxProperty.SelectedCheckBox.length; k++) {
            //                        if (getCheckBoxProperty.SelectedCheckBox[k] === parseInt($(this).attr("alt"))) {
            //                            getCheckBoxProperty.SelectedCheckBox.splice(j, 1);
            //                        }
            //                    }
            //                }
            //                $(this).addClass("CheckBoxTDChecked").parent().siblings().children().removeClass("CheckBoxTDChecked");
            //                //                self.Set("OutPramats", outPramats);
            //                self.Set('CheckBoxBasicProperty', getCheckBoxProperty);
            //            });
            //        });
        }
        //20130515 倪飘 解决bug，组态环境中拖入单选按钮1控件以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
        Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
    },
    Destory: function () {
        console.log("调用" + "Destory");
        var HTMLElement = this.Get("HTMLElement");
        var proPerty = this.Get("ProPerty");
        Agi.Edit.workspace.removeParameter(proPerty.ID);
        /*移除输出参数*/
        //            Agi.Edit.workspace.controlList.remove(this);
        Agi.Controls.ControlDestoryByList(this); //移除控件,从列表中
        $("#" + HTMLElement.id).remove();
        HTMLElement = null;
        this.AttributeList.length = 0;
        proPerty = null;
        delete this;
    },

    ParameterChange: function (_ParameterInfo) {//参数联动
        //联动接口: 框架传递过来点位号；控件自己去注册点位号
        this.IsChangeEntity = true;
        this.Set('Entity', this.Get('Entity'));

    },
    CustomProPanelShow: function () {
        Agi.Controls.CheckBoxProrityInit(this);
    },
    RemoveEntity: function (_EntityKey) {
        //20130627 倪飘 单选按钮1-拖入数据双击进入属性设置页面，下方数据无法删除问题解决
        if (!_EntityKey) {
            throw 'CheckBox.RemoveEntity Arg is null';
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
        var BasicProperty = self.Get('CheckBoxBasicProperty');
        BasicProperty.CheckBoxText = ["CheckBox0", "CheckBox1", "CheckBox2"];
        BasicProperty.CheckBoxValue = ["0", "1", "2"];
        BasicProperty.ItemNum = 3;
        //        BasicProperty.CheckBoxOutParameters.push(0); //选中元素位置
        BasicProperty.CheckBoxTextField = ""; //显示值列名
        BasicProperty.CheckBoxValueField = ""; //返回值列名
        BasicProperty.DataType = "UserDefined"; //自定义：UserDefined,数据实体:"Entity"
        self.Set('CheckBoxBasicProperty', BasicProperty);

        //删除下方数据表格
        Agi.Controls.ShowControlData(self);
        Agi.Msg.ShareDataRelation.DeleteItem(self.shell.BasicID);
        Agi.Controls.CheckBoxProrityInit(self);
    },
    Copy: function () {
        console.log("调用" + "Copy");
        if (layoutManagement.property.type == 1) {
            var ParentObj = this.shell.Container.parent();
            var PostionValue = this.Get("Position");
            var newCheckBoxPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
            var NewCheckBox = new Agi.Controls.CheckBox();
            NewCheckBox.Init(ParentObj, newCheckBoxPositionpars);
            newCheckBoxPositionpars = null;
            return NewCheckBox;
        }
    },

    PostionChange: function (_Postion) {
        console.log("调用" + "PostionChange");
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
        console.log("调用" + "HTMLElementSizeChanged");
        var Me = this;
        if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
            Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
        } else {
            Me.Refresh();
        }
    },

    Refresh: function () {

        console.log("调用" + "Refresh");
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
        $("#" + this.shell.ID).find(".CheckBoxDiv").css("overflow", "auto");
        this.IsEditState = true;
    },
    BackOldSize: function () {
        var obj = $(this.Get('HTMLElement'));
        if (this.oldSize) {

            var CheckBoxBasicProperty = this.Get("CheckBoxBasicProperty");
            var tableHeight = 0, tableWidth = 0;
            var showCount = parseInt(CheckBoxBasicProperty.ItemNum > CheckBoxBasicProperty.ShowCounts ? CheckBoxBasicProperty.ShowCounts : CheckBoxBasicProperty.ItemNum);
            if (CheckBoxBasicProperty.Alignment == "vertical") {
                tableHeight = (parseInt(CheckBoxBasicProperty.RowHeight) + 1) * showCount + 1;
                tableWidth = parseInt(CheckBoxBasicProperty.ColumnWidth) + 2;
            } else {
                tableWidth = (parseInt(CheckBoxBasicProperty.ColumnWidth) + 1) * showCount + 1;
                tableHeight = parseInt(CheckBoxBasicProperty.RowHeight) + 2;
            }
            obj.width((parseInt(this.oldSize.width) >= tableWidth ? tableWidth : this.oldSize.width));
            obj.height((parseInt(this.oldSize.height) >= tableHeight ? tableHeight : this.oldSize.height));
            obj.resizable({
                //                    minHeight: 50,
                //                    minWidth: 180
            }).css("position", "absolute");
        }
        //20130402 倪飘 解决bug，单选按钮1控件边框无法自适应控件大小。
        obj.css("width", "auto");
        obj.css("height", "auto");

        $("#" + this.shell.ID).find(".CheckBoxDiv").css("overflow", "hidden");
        this.IsEditState = false;
    },
    ControlAttributeChangeEvent: function (_CheckBoxobj, Key, _Value) {
        switch (Key) {
            case "Position":
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                    var ParentObj = ThisHTMLElement.parent();
                    var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                    var height = Math.round(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                    var width = Math.round(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                    ThisHTMLElement.width(width);
                    ThisHTMLElement.height(height);
                    ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                    if (!_CheckBoxobj.IsEditState) {
                        var CheckBoxBasicProperty = _CheckBoxobj.Get("CheckBoxBasicProperty");
                        var showCount = parseInt(CheckBoxBasicProperty.ItemNum > CheckBoxBasicProperty.ShowCounts ? CheckBoxBasicProperty.ShowCounts : CheckBoxBasicProperty.ItemNum);
                        if (CheckBoxBasicProperty.Alignment == "vertical") {
                            if (width >= (parseInt(CheckBoxBasicProperty.MinColumnWidth) + 2) && width <= 802) {
                                CheckBoxBasicProperty.ColumnWidth = width - 2;
                            }
                            var maxHeight = (101) * showCount + 1;
                            var minHeight = (parseInt(CheckBoxBasicProperty.MinRowHeight) + 1) * showCount + 1;
                            if (minHeight <= height && height <= maxHeight) {
                                CheckBoxBasicProperty.RowHeight = Math.round((height - 1) / showCount - 1);
                            } else if (height < minHeight) {
                                CheckBoxBasicProperty.RowHeight = CheckBoxBasicProperty.MinRowHeight;
                            } else {
                                CheckBoxBasicProperty.RowHeight = 100;
                            }
                        } else {
                            if (parseInt(CheckBoxBasicProperty.MinRowHeight) + 2 <= height && height <= 102) {
                                CheckBoxBasicProperty.RowHeight = height - 2;
                            }
                            var maxWidth = (801) * showCount + 1;
                            var minWidth = (parseInt(CheckBoxBasicProperty.MinColumnWidth) + 1) * showCount + 1;
                            if (minWidth <= width && width <= maxWidth) {
                                CheckBoxBasicProperty.ColumnWidth = Math.round((width - 1) / showCount - 1);
                            } else if (width < minWidth) {
                                CheckBoxBasicProperty.ColumnWidth = CheckBoxBasicProperty.MinColumnWidth;
                            } else {
                                CheckBoxBasicProperty.ColumnWidth = 800;
                            }
                        }
                        _CheckBoxobj.Set("CheckBoxBasicProperty", CheckBoxBasicProperty);
                    }
                }
                break;
            case "CheckBoxBasicProperty":
                if (layoutManagement.property.type == 1) {
                    var getCheckBoxProperty = this.Get("CheckBoxBasicProperty");
                    var showCount = getCheckBoxProperty.ItemNum > getCheckBoxProperty.ShowCounts ? getCheckBoxProperty.ShowCounts : getCheckBoxProperty.ItemNum;
                    var items = "";
                    for (var i = 0; i < showCount; i++) {
                        items += "<tr alt='" + i + "'>";
                        items += "<td class='prortityPanelCheckBoxTextTD'>" + getCheckBoxProperty.CheckBoxText[i] + "</td>";
                        items += "</tr>";
                    }
                    $(".prortityPanelCheckBoxTextTable").html(items);
                    $(".prortityPanelCheckBoxTextTable tr").css("cursor", "pointer").each(function () {
                        if (getCheckBoxProperty.ItemEditSelectNum == parseInt($(this).attr("alt"))) {
                            $(this).css('background', '-webkit-gradient(linear,left top, left bottom, color-stop(0, rgb(196,211,237)), color-stop(1, rgb(179,198,218)) )').siblings().css('background', '');
                        }
                        $(this).bind('click touchstart', function () {
                            getCheckBoxProperty.ItemEditSelectNum = parseInt($(this).attr("alt"));
                            $(this).css('background', '-webkit-gradient(linear,left top, left bottom, color-stop(0, rgb(196,211,237)), color-stop(1, rgb(179,198,218)) )').siblings().css('background', '');
                            $('#textFieldChanged').val(getCheckBoxProperty.CheckBoxText[getCheckBoxProperty.ItemEditSelectNum]);
                            $('#valueFieldChanged').val(getCheckBoxProperty.CheckBoxValue[getCheckBoxProperty.ItemEditSelectNum]);

                            _CheckBoxobj.Set('CheckBoxBasicProperty', getCheckBoxProperty);
                        });
                    });
                    var $UI = $('#' + this.shell.ID);
                    var tableID = _CheckBoxobj.Get("ProPerty").ID;
                    var BaseControlObjHtml = '<div id="' + tableID + '" class="CheckBoxDiv">';
                    if (getCheckBoxProperty.Alignment == "vertical") {
                        BaseControlObjHtml = BaseControlObjHtml + '<table class="CheckBoxTable">';
                        for (var buttonId = 0; buttonId < showCount; buttonId++) {
                            BaseControlObjHtml = BaseControlObjHtml + '<tr><td alt="' + buttonId + '"  class="CheckBoxTD"><INPUT TYPE="CheckBox"style="width:0px;" value="' + buttonId + '"/><div class="CheckBoxUnChecked"></div><span class="CheckBoxSpan">' + getCheckBoxProperty.CheckBoxText[buttonId] +
                                '</span></td></tr>';
                        }
                    } else {
                        BaseControlObjHtml = BaseControlObjHtml + '<table class="CheckBoxTable_horizontal">';
                        BaseControlObjHtml = BaseControlObjHtml + "<tr class='CheckBoxHorizontalTR'>";
                        for (var buttonId = 0; buttonId < showCount; buttonId++) {
                            BaseControlObjHtml = BaseControlObjHtml + '<td alt="' + buttonId + '" class="CheckBoxTD_horizontal"><INPUT TYPE="CheckBox" style="width:0px;" value="' + buttonId + '"/><div class="CheckBoxUnChecked"></div><span class="CheckBoxSpan">' + getCheckBoxProperty.CheckBoxText[buttonId] +
                                '</span></td>';
                        }
                        BaseControlObjHtml = BaseControlObjHtml + "</tr>";
                    }
                    BaseControlObjHtml = BaseControlObjHtml + '</table></div>';
                    BaseControlObjHtml = "<div class='selectPanelBodySty' style='height:auto'>" + BaseControlObjHtml + "</div>";
                    $UI.find(".selectPanelBodySty").replaceWith(BaseControlObjHtml);
                    if (this.IsEditState) {
                        $UI.find(".CheckBoxDiv").css("overflow", "auto");
                    } else {
                        $UI.find(".CheckBoxDiv").css("overflow", "hidden");
                    }
                    $("#" + tableID + " table").css("border-color", getCheckBoxProperty.BorderColor);
                    $("#" + tableID + " table td").css(getCheckBoxProperty.BackgroundColor.value).css({
                        "color": getCheckBoxProperty.FontColor,
                        "font-family": getCheckBoxProperty.FontFamily[getCheckBoxProperty.FontIndex],
						"font-size": getCheckBoxProperty.FontSize+"px",
                        "border-color": getCheckBoxProperty.BorderColor
                    });
                    var BasePanel = $(_CheckBoxobj.Get("HTMLElement"));
                    if (getCheckBoxProperty.Alignment == "vertical") {
                        $UI.find(".CheckBoxTable").css("height", "auto");
                        $UI.find(".CheckBoxTable").css("width", getCheckBoxProperty.ColumnWidth);
                        $UI.find(".CheckBoxTD").css("width", getCheckBoxProperty.ColumnWidth);
                        $UI.find(".CheckBoxTD").css("height", getCheckBoxProperty.RowHeight);
                        BasePanel.css({ "min-width": (parseInt(getCheckBoxProperty.MinColumnWidth) + 2), "min-height": (parseInt(getCheckBoxProperty.MinRowHeight) * 2 + 3), "max-width": 802, "max-height": (101 * showCount + 1) });
                    } else {
                        $UI.find(".CheckBoxTable_horizontal").css("width", "auto");
                        $UI.find(".CheckBoxTable_horizontal").css("height", getCheckBoxProperty.RowHeight);

                        $UI.find(".CheckBoxTD_horizontal").css("width", getCheckBoxProperty.ColumnWidth);
                        //$(".CheckBoxTD_horizontal").css("width",getCheckBoxProperty.ColumnWidth);
                        $UI.find(".CheckBoxTD_horizontal").css("height", getCheckBoxProperty.RowHeight);
                        BasePanel.css({ "min-width": (parseInt(getCheckBoxProperty.MinColumnWidth) + 2), "min-height": (parseInt(getCheckBoxProperty.MinRowHeight) + 2), "max-width": (801 * showCount + 1), "max-height": 102 });
                    }
                    //$UI.find(".CheckBoxUnChecked").css("background", "-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to(" + getCheckBoxProperty.ButtonColor + "))");
                    $UI.find(".CheckBoxUnChecked").css("background",  getCheckBoxProperty.ButtonColor);
                    $UI.find(".CheckBoxTD").each(function () {
                        for (var i = 0; i < getCheckBoxProperty.SelectedCheckBox.length; i++) {
                            if (getCheckBoxProperty.SelectedCheckBox[i] == parseInt($(this).attr("alt"))) {
                                $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value);
                                $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked").css("background", getCheckBoxProperty.CheckedButtonColor + " url('JS/Controls/CheckBox1/img/hook-CheckBox.png') no-repeat center center");
                                //                                $(this).parent().siblings().find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background", "-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to(" + getCheckBoxProperty.ButtonColor + "))");
                            }
                        }
                        $(this).unbind('click touchstart').bind('click touchstart', function () {

                            if ($(this).find("div").attr("class") === "CheckBoxUnChecked") {
                                $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked").css("background", getCheckBoxProperty.CheckedButtonColor + " url('JS/Controls/CheckBox1/img/hook-CheckBox.png') no-repeat center center");
                                var state = false;
                                for (var j = 0; j < getCheckBoxProperty.SelectedCheckBox.length; j++) {
                                    if (getCheckBoxProperty.SelectedCheckBox[j] === parseInt($(this).attr("alt"))) {
                                        state = true;
                                    }
                                }
                                if (!state) {
                                    getCheckBoxProperty.SelectedCheckBox.push(parseInt($(this).attr("alt")));
                                }
                                $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value);
                            }
                            else {
                                //$(this).find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background", "-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to(" + getCheckBoxProperty.ButtonColor + "))");
                                $(this).find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background", getCheckBoxProperty.ButtonColor);
                                for (var k = 0; k < getCheckBoxProperty.SelectedCheckBox.length; k++) {
                                    if (getCheckBoxProperty.SelectedCheckBox[k] === parseInt($(this).attr("alt"))) {
                                        getCheckBoxProperty.SelectedCheckBox.splice(k, 1);
                                    }
                                }
                                $(this).removeClass("CheckBoxTDChecked").css(getCheckBoxProperty.BackgroundColor.value);
                            }
                            //                            $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value).parent().siblings().children().removeClass("CheckBoxTDChecked").css(getCheckBoxProperty.BackgroundColor.value);
                            _CheckBoxobj.Set("OutPramats", getCheckBoxProperty.SelectedCheckBox);
                        });
                    });
                    $UI.find(".CheckBoxTD_horizontal").each(function () {
                        for (var i = 0; i < getCheckBoxProperty.SelectedCheckBox.length; i++) {
                            if (getCheckBoxProperty.SelectedCheckBox[i] == parseInt($(this).attr("alt"))) {
                                $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value);
                                $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked").css("background", getCheckBoxProperty.CheckedButtonColor + " url('JS/Controls/CheckBox1/img/hook-CheckBox.png') no-repeat center center");
                                //                                $(this).siblings().find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background", "-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to(" + getCheckBoxProperty.ButtonColor + "))");
                            }
                        }

                        $(this).unbind('click touchstart').bind('click touchstart', function () {

                            $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value).removeClass("CheckBoxTDChecked").css(getCheckBoxProperty.BackgroundColor.value);
                            if ($(this).find("div").attr("class") === "CheckBoxUnChecked") {
                                $(this).find(".CheckBoxUnChecked").attr("class", "CheckBoxChecked").css("background", getCheckBoxProperty.CheckedButtonColor + " url('JS/Controls/CheckBox1/img/hook-CheckBox.png') no-repeat center center");
                                var state = false;
                                for (var j = 0; j < getCheckBoxProperty.SelectedCheckBox.length; j++) {
                                    if (getCheckBoxProperty.SelectedCheckBox[j] === parseInt($(this).attr("alt"))) {
                                        state = true;
                                    }
                                }
                                if (!state) {
                                    getCheckBoxProperty.SelectedCheckBox.push(parseInt($(this).attr("alt")));
                                }
                                $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value);
                            }
                            else {
                               // $(this).find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background", "-webkit-gradient(linear, 0 0, 0 100%, from(#f3f3f3),to(" + getCheckBoxProperty.ButtonColor + "))");
                                $(this).find(".CheckBoxChecked").attr("class", "CheckBoxUnChecked").css("background",getCheckBoxProperty.ButtonColor);
                                for (var k = 0; k < getCheckBoxProperty.SelectedCheckBox.length; k++) {
                                    if (getCheckBoxProperty.SelectedCheckBox[k] === parseInt($(this).attr("alt"))) {
                                        getCheckBoxProperty.SelectedCheckBox.splice(k, 1);
                                    }
                                }
                                $(this).removeClass("CheckBoxTDChecked").css(getCheckBoxProperty.BackgroundColor.value);
                            }
                            //                            $(this).addClass("CheckBoxTDChecked").css(getCheckBoxProperty.CheckedBackgroundColor.value).parent().siblings().children().removeClass("CheckBoxTDChecked").css(getCheckBoxProperty.BackgroundColor.value);
                            _CheckBoxobj.Set("OutPramats", getCheckBoxProperty.SelectedCheckBox);
                        });
                    });
                }
                break;
            case "OutPramats":
                {
                    var getCheckBoxProperty = this.Get("CheckBoxBasicProperty");
                    var SelectValueIndex = getCheckBoxProperty.SelectedCheckBox;
                    var CheckedText = getCheckBoxProperty.CheckBoxText;
                    var CheckedValue = getCheckBoxProperty.CheckBoxValue;
                    var text = "";
                    var value = "";
                    if (SelectValueIndex.length > 0) {
                        for (var i = 0; i < SelectValueIndex.length; i++) {
                            text += CheckedText[SelectValueIndex[i]] + ",";
                            value += CheckedValue[SelectValueIndex[i]] + ",";
                        }
                        text = text.substr(0, text.length - 1);
                        value = value.substr(0, value.length - 1);
                    }


                    var OutPramats = { "CheckedText": text, "CheckedValue": value };
                    var ThisOutParats = [];
                    if (OutPramats != null) {
                        for (var item in OutPramats) {
                            ThisOutParats.push({ Name: item, Value: OutPramats[item] });
                        }
                    }

                    Agi.Msg.PageOutPramats.PramatsChange({
                        "Type": Agi.Msg.Enum.Controls,
                        "Key": _CheckBoxobj.Get("ProPerty").ID,
                        "ChangeValue": ThisOutParats
                    });

                    Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _CheckBoxobj, "Type": Agi.Msg.Enum.Controls });

                } break;
            case "Entity": //实体
                {
                    var entity = _CheckBoxobj.Get('Entity');
                    var CheckBoxBasicProperty = _CheckBoxobj.Get('CheckBoxBasicProperty');
                    if (entity && entity.length) {

                        //20130402 倪飘 解决bug，单选按钮控件中拖入数据并在高级属性设置界面中设置最大显示条数为1，预览页面中显示为1条但是预览页面中显示还是5条
                        // CheckBoxBasicProperty.ShowCounts=5;
                        BindDataByEntity(_CheckBoxobj, entity[0]);
                    } else {
                        for (var i = 0; i < CheckBoxBasicProperty.ItemNum; i++) {
                            $UI.find('#CheckBoxId_' + i).text('');
                        }
                        //控件加载完成
                        _CheckBoxobj.controlLoadCompleted();
                    }
                } break;
        } //end switch

        function BindDataByEntity(controlObj, et) {
            var self = controlObj;
            var $UI = $('#' + controlObj.shell.ID);
            var getCheckBoxProperty = controlObj.Get("CheckBoxBasicProperty");
            if (!et.IsShareEntity) {
                Agi.Utility.RequestData2(et, function (d) {
                    var data = d.Data.length ? d.Data : [];
                    var columns = d.Columns;
                    et.Data = data;
                    et.Columns = columns;

                    var textField = getCheckBoxProperty && getCheckBoxProperty.CheckBoxTextField ? getCheckBoxProperty.CheckBoxTextField : columns[0];
                    var valueField = getCheckBoxProperty && getCheckBoxProperty.CheckBoxValueField ? getCheckBoxProperty.CheckBoxValueField : columns[0];

                    if (getCheckBoxProperty.CheckBoxTextField == "") {
                        getCheckBoxProperty.CheckBoxTextField = textField
                    }
                    if (getCheckBoxProperty.CheckBoxValueField == "") {
                        getCheckBoxProperty.CheckBoxValueField = valueField;
                    }
                    getCheckBoxProperty.ItemNum = data.length;
                    getCheckBoxProperty.EntityNum = data.length;
                    //修改列
                    if (controlObj.IsChangeEntity) {
                        getCheckBoxProperty.CheckBoxText = [];
                        getCheckBoxProperty.CheckBoxValue = [];
                        $(d.Data).each(function (i, el) {
                            getCheckBoxProperty.CheckBoxText[i] = el[textField];
                            getCheckBoxProperty.CheckBoxValue[i] = el[valueField];
                            $UI.find("#CheckBoxId_" + i).text(getCheckBoxProperty.CheckBoxText[i]);
                        });
                        controlObj.IsChangeEntity = false;
                    }
                    controlObj.Set("CheckBoxBasicProperty", getCheckBoxProperty);
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.ShowControlData(self); //更新实体数据显示
                        Agi.Controls.CheckBoxProrityInit(self); //更新属性面板
                    }

                    //控件加载完成
                    self.controlLoadCompleted();
                });
            } else {
                BindDataByJson.call(controlObj, et, et);
            }
            return;
        }

        function BindDataByJson(et, d) {
            var self = this;
            var $UI = $('#' + self.shell.ID);
            var getCheckBoxProperty = self.Get("CheckBoxBasicProperty");

            var data = d.Data.length ? d.Data : [];
            var columns = d.Columns;
            et.Data = data;
            et.Columns = columns;

            var textField = getCheckBoxProperty && getCheckBoxProperty.CheckBoxTextField ? getCheckBoxProperty.CheckBoxTextField : columns[0];
            var valueField = getCheckBoxProperty && getCheckBoxProperty.CheckBoxValueField ? getCheckBoxProperty.CheckBoxValueField : columns[0];

            if (getCheckBoxProperty.CheckBoxTextField == "") {
                getCheckBoxProperty.CheckBoxTextField = textField
            }
            if (getCheckBoxProperty.CheckBoxValueField == "") {
                getCheckBoxProperty.CheckBoxValueField = valueField;
            }
            getCheckBoxProperty.ItemNum = data.length;
            getCheckBoxProperty.EntityNum = data.length;
            //修改列
            if (self.IsChangeEntity) {
                getCheckBoxProperty.CheckBoxText = [];
                getCheckBoxProperty.CheckBoxValue = [];
                $(d.Data).each(function (i, el) {
                    getCheckBoxProperty.CheckBoxText[i] = el[textField];
                    getCheckBoxProperty.CheckBoxValue[i] = el[valueField];
                    $UI.find("#CheckBoxId_" + i).text(getCheckBoxProperty.CheckBoxText[i]);
                });
                self.IsChangeEntity = false;
            }
            self.Set("CheckBoxBasicProperty", getCheckBoxProperty);
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(self); //更新实体数据显示
                Agi.Controls.CheckBoxProrityInit(self); //更新属性面板
            }
            //控件加载完成
            self.controlLoadCompleted();
        }
    },

    GetConfig: function () {
        console.log("调用" + "GetConfig");
        var ProPerty = this.Get("ProPerty");
        var CheckBoxControl = {
            Control: {
                ControlType: null, //控件类型
                ControlID: null, //控件ID
                ControlBaseObj: null, //控件对象
                HTMLElement: null, //控件的外壳HTML元素信息
                Entity: null, // 实体
                Position: null, // 控件位置信息
                CheckBoxBasicProperty: null, //控件属性
                ThemeInfo: null,
                OutPramats: null
            }
        }; // 配置信息数组对象
        CheckBoxControl.Control.ControlType = this.Get("ControlType");
        CheckBoxControl.Control.ControlID = ProPerty.ID;
        CheckBoxControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
        CheckBoxControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
        //            CheckBoxContorl.Control.ControlBaseObj = ProPerty.ID;
        //CheckBoxControl.Control.HTMLElement= this.Get("HTMLElement").id;
        CheckBoxControl.Control.Entity = this.Get("Entity");
        CheckBoxControl.Control.Position = this.Get("Position");
        CheckBoxControl.Control.CheckBoxBasicProperty = this.Get("CheckBoxBasicProperty");
        CheckBoxControl.Control.ThemeInfo = this.Get("ThemeInfo");
        CheckBoxControl.Control.OutPramats = this.Get("OutPramats");
        //            CheckBoxContorl.Control.ThemeInfo = this.Get("ThemeInfo");
        return CheckBoxControl.Control; //返回配置字符串
    }, //获得CheckBox控件的配置信息

    CreateControl: function (_Config, _Target) {
        this.Init(_Target, _Config.Position, _Config.ControlID);
        if (_Config != null) {
            var CheckBoxBasicProperty = null;
            if (_Target != null && _Target != "") {
                var _Targetobj = $(_Target);
                if (typeof (_Config.Entity) == "string") {
                    _Config.Entity = JSON.parse(_Config.Entity);
                }
                if (typeof (_Config.Position) == "string") {
                    _Config.Position = JSON.parse(_Config.Position);
                }
                this.Set("Position", _Config.Position);
                //                    _Config.ThemeInfo = _Config.ThemeInfo;
                CheckBoxBasicProperty = _Config.CheckBoxBasicProperty;
                this.Set("CheckBoxBasicProperty", CheckBoxBasicProperty);
                var ThisProPerty = this.Get('ProPerty');
                ThisProPerty.ID = _Config.ControlID;
                ThisProPerty.BasciObj.attr('id', _Config.ControlID);
                var $UI = $('#' + this.shell.ID);
                if (CheckBoxBasicProperty.CheckBoxText.length != 0) {
                    $(CheckBoxBasicProperty.CheckBoxText).each(function (i, el) {
                        $UI.find('#CheckBoxId_' + i).text(el);
                    });
                }

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
                //                this.ChangeTheme(_Config.ThemeInfo);
            }
        }

    }, //根据配置信息创建控件

    ChangeTheme: function (_themeName) {
        var Me = this;
        //1.根据当前控件类型和样式名称获取样式信息
        var CheckBoxStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);
        //2.保存主题
        Me.Set("ThemeName", _themeName);
        //3.应用当前控件的信息
        Agi.Controls.CheckBox.OptionsAppSty(CheckBoxStyleValue, Me);
    } //更改控件样式

}, true);

/*应用样式，将样式应用到控件的相关参数以更新相关显示
* _StyConfig:样式配置信息
* _Options:控件相关参数信息
* */
Agi.Controls.CheckBox.OptionsAppSty = function (_StyConfig, CheckBox) {
    if (_StyConfig != null) {
        var CheckBoxBasicProperty = CheckBox.Get('CheckBoxBasicProperty');
        //CheckBoxBasicProperty.Alignment = _StyConfig.Alignment;
        //CheckBoxBasicProperty.RowHeight = _StyConfig.RowHeight;
        //CheckBoxBasicProperty.ColumnWidth = _StyConfig.ColumnWidth;
        CheckBoxBasicProperty.BackgroundColor = _StyConfig.BackgroundColor;
        CheckBoxBasicProperty.ButtonColor = _StyConfig.ButtonColor;
        CheckBoxBasicProperty.BorderColor = _StyConfig.BorderColor;
        CheckBoxBasicProperty.FontColor = _StyConfig.FontColor;
        CheckBoxBasicProperty.CheckedBackgroundColor = _StyConfig.CheckedBackgroundColor;
        CheckBoxBasicProperty.CheckedButtonColor = _StyConfig.CheckedButtonColor;
        CheckBox.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
    }
};

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitCheckBox = function () {
    return new Agi.Controls.CheckBox();
};
Agi.Controls.CheckBoxProrityInit = function (_CheckBoxControl) {

    var CheckBoxBasicProperty = _CheckBoxControl.Get('CheckBoxBasicProperty');
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
    var max = CheckBoxBasicProperty.ItemNum > CheckBoxBasicProperty.ShowCounts ? CheckBoxBasicProperty.ItemNum : CheckBoxBasicProperty.ShowCounts;
    bindHTML.append('<td class="prortityBindLabel">最大显示条数:</td><td class="prortityBindSelect"><input id="ShowCounts" type="number" class="ControlProNumberSty" value="' + CheckBoxBasicProperty.ShowCounts + '" min="1" max="' + max + '"/></td>');
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
    basicHTML.append("<td class='prortityPanelTabletd0'>列宽:</td><td class='prortityPanelTabletd1'><input id='ColumnWidth' type='number' value='" + CheckBoxBasicProperty.ColumnWidth + "'class='ControlProNumberSty' min='100' max='800'/></td>");
    basicHTML.append("<td class='prortityPanelTabletd0'>行高</td><td class='prortityPanelTabletd1'><input id='RowHeight' type='number' value='" + CheckBoxBasicProperty.RowHeight + "'class='ControlProNumberSty' min='25' max='100'/></td>");
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
    for (var i = 0; i < CheckBoxBasicProperty.FontFamily.length; i++) {
        basicHTML.append("<option value='" + i + "'>" + CheckBoxBasicProperty.FontFamily[i] + "</option>");
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
    var showCount = CheckBoxBasicProperty.ItemNum > CheckBoxBasicProperty.ShowCounts ? CheckBoxBasicProperty.ShowCounts : CheckBoxBasicProperty.ItemNum;
    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDiv'>");

    itemEdit.append("<div class='prortityPanelCheckBoxTextDiv' >");
    itemEdit.append("<table class='prortityPanelCheckBoxTextTable'>");
    for (var i = 0; i < showCount; i++) {
        itemEdit.append("<tr alt='" + i + "'>");
        itemEdit.append("<td class='prortityPanelCheckBoxTextTD'>" + CheckBoxBasicProperty.CheckBoxText[i] + "</td>");
        itemEdit.append("</tr>");
    }
    itemEdit.append("</table>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxItemManagmentDiv'>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<label class='prortityPanelCheckBoxManagmentLabel'>选项信息:</label>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<label for='textFieldChanged'>显示值:</label>");
    itemEdit.append("<input type='text' class='InputText' id='textFieldChanged' placeholder='显示值'/>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<label for='valueFieldChanged'>选择值:</label>");
    itemEdit.append("<input type='text' class='InputText' id='valueFieldChanged' placeholder='选择值'/>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<input type='button' class='InputButton' id='DeleteItemButton' value='删除选项'/>");
    itemEdit.append("<input type='button' class='InputButton' id='SaveChangeButton' value='保存修改'/>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<hr class='prortityPanelCheckBoxManagmentDivUnitHr'/>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<label class='prortityPanelCheckBoxManagmentLabel'>选项信息:</label>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<label>显示值:</label>");
    itemEdit.append("<input type='text' class='InputText' id='textFieldAdded' placeholder='显示值'/>");
    itemEdit.append("</div>");

    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<label>选择值:</label>");
    itemEdit.append("<input type='text' class='InputText' id='valueFieldAdded' placeholder='选择值'/>");
    itemEdit.append("</div>");
    itemEdit.append("<div class='prortityPanelCheckBoxManagmentDivUnit'>");
    itemEdit.append("<input type='button' class='InputButtonAdd' id='UserDefined' value='自定义'/>");
    itemEdit.append("</div>");

    itemEdit.append("</div>");

    itemEdit.append("</div>");

    var ItemEditObj = $(itemEdit.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "选项管理", DisabledValue: 1, ContentObj: ItemEditObj }));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //4.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) { };

    var entity = _CheckBoxControl.Get('Entity');
    var textOptions = null;
    if (entity.length) {
        if (entity[0].Columns) {
            textOptions = "";
            $(entity[0].Columns).each(function (i, col) {

                if (CheckBoxBasicProperty.CheckBoxTextField == col) {
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

                if (CheckBoxBasicProperty.CheckBoxValueField == col) {
                    valueOptions += '<option value="' + col + '" selected="true">' + col + '</option>';
                } else {
                    valueOptions += '<option value="' + col + '">' + col + '</option>';
                }
            });
        }
    }

    $(".prortityBindTable").find('#selectText').append($(textOptions)).bind('change', { sels: $(".prortityBindTable").find('#selectText') }, function (e) {
        $(e.data.sels).each(function (i, sel) {
            CheckBoxBasicProperty.CheckBoxTextField = $(sel).val();
            $(sel).val(CheckBoxBasicProperty.CheckBoxTextField);
            Agi.Utility.RequestData2(entity[0], function (d) {
                var data = d.Data.length ? d.Data : [];
                entity[0].Data = data;
                $(data).each(function (i, dd) {
                    CheckBoxBasicProperty.CheckBoxText[i] = dd[CheckBoxBasicProperty.CheckBoxTextField];

                });
                _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
            });
        });
    });

    $(".prortityBindTable").find('#selectValue').append($(valueOptions)).bind('change', { sels: $(".prortityBindTable").find('#selectValue') }, function (e) {
        $(e.data.sels).each(function (i, sel) {

            CheckBoxBasicProperty.CheckBoxValueField = $(sel).val();
            $(sel).val(CheckBoxBasicProperty.CheckBoxValueField);
            Agi.Utility.RequestData2(entity[0], function (d) {
                var data = d.Data.length ? d.Data : [];
                entity[0].Data = data;
                $(data).each(function (i, dd) {
                    CheckBoxBasicProperty.CheckBoxValue[i] = dd[CheckBoxBasicProperty.CheckBoxValueField];
                });
                _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
            });
        });
    });
    $("#ShowCounts").val(CheckBoxBasicProperty.ShowCounts);
    $("#ShowCounts").change(function () {
        var count = parseInt($("#ShowCounts").val());
        var max = parseInt($("#ShowCounts").attr("max"));
        if (count >= 1 && count <= max) {
            CheckBoxBasicProperty.ShowCounts = count;
        } else {
            AgiCommonDialogBox.Alert("请输入1-" + max + "范围内的值！");
            $("#ShowCounts").val(CheckBoxBasicProperty.ShowCounts);
        }
        _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
    });
    $(".prortityPanelCheckBoxTextTable tr").css("cursor", "pointer").each(function () {
        $(this).bind('click touchstart', function () {
            CheckBoxBasicProperty.ItemEditSelectNum = parseInt($(this).attr("alt"));
            $(this).css('background', '-webkit-gradient(linear,left top, left bottom, color-stop(0, rgb(196,211,237)), color-stop(1, rgb(179,198,218)) )').css('background', '');
            $('#textFieldChanged').val(CheckBoxBasicProperty.CheckBoxText[CheckBoxBasicProperty.ItemEditSelectNum]);
            $('#valueFieldChanged').val(CheckBoxBasicProperty.CheckBoxValue[CheckBoxBasicProperty.ItemEditSelectNum]);

            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
        });
    });

    $("#AligmentSelect").find("option").each(function () {
        if (this.value == CheckBoxBasicProperty.Alignment) {
            this.selected = true;
        }
    });
    $("#AligmentSelect").change(function () {
        var alignment = $("#AligmentSelect").val();
        if (alignment == "horizontal") {
            CheckBoxBasicProperty.ColumnWidth = 100;
        }
        if (alignment == "vertical") {
            CheckBoxBasicProperty.ColumnWidth = 250;
        }
        CheckBoxBasicProperty.MinColumnWidth = 100;
        CheckBoxBasicProperty.MinRowHeight = CheckBoxBasicProperty.RowHeight;
        $("#ColumnWidth").val(CheckBoxBasicProperty.ColumnWidth);
        CheckBoxBasicProperty.Alignment = $("#AligmentSelect").val();
        _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
    });
    $("#RowHeight").val(CheckBoxBasicProperty.RowHeight);
    $("#RowHeight").change(function () {
        var height = parseInt($("#RowHeight").val());
        //20130402 倪飘 解决bug，单选按钮列宽输入框中点击向下箭头减小宽度到100，输入值宽为1，弹出信息提示并确定以后，输入框中值变为250但是控件中宽度为10（单选按钮行高也存在相同问题）
        if (height >= 25 && height <= 100) {
            CheckBoxBasicProperty.RowHeight = height;
            CheckBoxBasicProperty.MinRowHeight = height;
            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
        } else {
            $(this).val(CheckBoxBasicProperty.RowHeight);
            var DilogboxTitle = "请输入" + parseInt($(this).attr("min")) + "-" + parseInt($(this).attr("max")) + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });
    $("#ColumnWidth").val(CheckBoxBasicProperty.ColumnWidth);
    $("#ColumnWidth").change(function () {
        var width = parseInt($("#ColumnWidth").val());

        //20130402 倪飘 解决bug，单选按钮列宽输入框中点击向下箭头减小宽度到100，输入值宽为1，弹出信息提示并确定以后，输入框中值变为250但是控件中宽度为10（单选按钮行高也存在相同问题）
        if (width >= 100 && width <= 800) {
            CheckBoxBasicProperty.ColumnWidth = width;
            CheckBoxBasicProperty.MinColumnWidth = width;
            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
        } else {
            $(this).val(CheckBoxBasicProperty.ColumnWidth);
            var DilogboxTitle = "请输入" + parseInt($(this).attr("min")) + "-" + parseInt($(this).attr("max")) + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
        }

    });

    $("#ButtonBgColor").val(CheckBoxBasicProperty.ButtonColor);
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
            CheckBoxBasicProperty.ButtonColor = color.toHexString();
            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
        }
    });
    $("#CheckedButtonBgColor").val(CheckBoxBasicProperty.CheckedButtonColor);
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
            CheckBoxBasicProperty.CheckedButtonColor = color.toHexString();
            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
        }
    });
    $("#FilterBgColor").css(CheckBoxBasicProperty.BackgroundColor.value);
    $("#FilterBgColor").bind("click touchstart", function () {
        //var currentColor = $(this).data('colorValue');
        //var btn = $(this);
        colorPicker.open({
            disableTabIndex: [],
            defaultValue: CheckBoxBasicProperty.BackgroundColor, //这个参数是上一次选中的颜色
            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                CheckBoxBasicProperty.BackgroundColor = color;
                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                //btn.data('colorValue', color);
                $("#FilterBgColor").css(color.value);
                _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
            }
        });
    });
    $("#CheckedBgColor").css(CheckBoxBasicProperty.CheckedBackgroundColor.value);
    $("#CheckedBgColor").bind("click touchstart", function () {
        //var currentColor = $(this).data('colorValue');
        //var btn = $(this);
        colorPicker.open({
            disableTabIndex: [],
            defaultValue: CheckBoxBasicProperty.CheckedBackgroundColor, //这个参数是上一次选中的颜色
            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                CheckBoxBasicProperty.CheckedBackgroundColor = color;
                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                //btn.data('colorValue', color);CheckedBgColor
                $("#CheckedBgColor").css(color.value);
                _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
            }
        });
    });
    $("#FilterBorderColor").val(CheckBoxBasicProperty.BorderColor);
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
            CheckBoxBasicProperty.BorderColor = color.toHexString();
            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
        }
    });
    $("#FontColor").val(CheckBoxBasicProperty.FontColor);
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
            CheckBoxBasicProperty.FontColor = color.toHexString();
            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
        }
    });
    $("#FontFamily").find("option").each(function () {
        if (this.value == CheckBoxBasicProperty.FontIndex) {
            this.selected = true;
        }
    });
    $("#FontFamily").change(function () {
        CheckBoxBasicProperty.FontIndex = $("#FontFamily").val();
        _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
    });
    //if(_CheckBoxControl.IsUserDefined){
    if (CheckBoxBasicProperty.DataType == "UserDefined") {
        $("#UserDefined").val("添　加");
        $('#SaveChangeButton').attr('disabled', false);
        $('#DeleteItemButton').attr('disabled', false);
        $("#textFieldAdded").attr("disabled", false);
        $("#valueFieldAdded").attr("disabled", false);
    } else {
        $("#UserDefined").val("自定义");
        $("#textFieldAdded").attr("disabled", true);
        $("#valueFieldAdded").attr("disabled", true);
        $('#SaveChangeButton').attr('disabled', true);
        $('#DeleteItemButton').attr('disabled', true);
    }

    $("#UserDefined").bind('click touchstart', function () {
        if (CheckBoxBasicProperty.DataType == "Entity") {
            AgiCommonDialogBox.Confirm("若添加自定义数据将清空实体数据，是否切换？", null, function (flag) {
                if (flag) {
                    // _CheckBoxControl.IsUserDefined=true;
                    CheckBoxBasicProperty.DataType = "UserDefined";
                    $("#UserDefined").val("添　加");
                    CheckBoxBasicProperty.EntityNum = 3;
                    CheckBoxBasicProperty.ItemNum = 3;
                    CheckBoxBasicProperty.ShowCounts = 5;
                    CheckBoxBasicProperty.CheckBoxText = ["CheckBox0", "CheckBox1", "CheckBox2"];
                    CheckBoxBasicProperty.CheckBoxValue = ["0", "1", "2"];
                    CheckBoxBasicProperty.ItemEditSelectNum = "";
                    CheckBoxBasicProperty.SelectedCheckBox = [];
                    $('#selectText').html("");
                    $('#selectValue').html("");
                    $("#textFieldChanged").val("");
                    $("#valueFieldChanged").val("");
                    $('#SaveChangeButton').attr('disabled', false);
                    $('#DeleteItemButton').attr('disabled', false);
                    $("#textFieldAdded").attr("disabled", false);
                    $("#valueFieldAdded").attr("disabled", false);
                    $("#ShowCounts").val(5);
                    $("#ShowCounts").attr("max", 5);
                    _CheckBoxControl.Set("Entity", []);
                    _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
                    //更新实体数据显示
                    if (Agi.Controls.IsControlEdit) {
                        Agi.Controls.ShowControlData(_CheckBoxControl);
                    }
                }
            });
        } else if (CheckBoxBasicProperty.DataType == "UserDefined") {
            if ($("#textFieldAdded").val() == "") {
                AgiCommonDialogBox.Alert("请输入显示值！");
            } else if ($("#valueFieldAdded").val() == "") {
                AgiCommonDialogBox.Alert("请输入选择值！");
            } else {
                CheckBoxBasicProperty.ItemNum += 1;
                CheckBoxBasicProperty.CheckBoxText.push($("#textFieldAdded").val());
                CheckBoxBasicProperty.CheckBoxValue.push($("#valueFieldAdded").val());
                CheckBoxBasicProperty.ItemEditSelectNum = "";
                CheckBoxBasicProperty.SelectedCheckBox = [];
                $("#textFieldChanged").val("");
                $("#valueFieldChanged").val("");
                if (CheckBoxBasicProperty.ItemNum > CheckBoxBasicProperty.ShowCounts) {
                    CheckBoxBasicProperty.ShowCounts = CheckBoxBasicProperty.ItemNum;
                }
                _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
                $("#textFieldAdded").val("");
                $("#valueFieldAdded").val("");
                var max = CheckBoxBasicProperty.ItemNum > CheckBoxBasicProperty.ShowCounts ? CheckBoxBasicProperty.ItemNum : CheckBoxBasicProperty.ShowCounts;
                $("#ShowCounts").attr("max", max).val(CheckBoxBasicProperty.ShowCounts);
                AgiCommonDialogBox.Alert("添加成功！");
            }
        }
    });
    //20130516 倪飘 解决bug，单选按钮1，选项管理，在显示值和选择值中任意输入，点击保存修改，提示"请选择元素"，提示信息建议修改
    $('#SaveChangeButton').bind('click touchstart', function () {
        if ($("#textFieldChanged").val() == "") {
            AgiCommonDialogBox.Alert("请输入显示值！");
        } else if ($("#valueFieldChanged").val() == "") {
            AgiCommonDialogBox.Alert("请输入选择值！");
        } else if (CheckBoxBasicProperty.ItemEditSelectNum === "") {
            AgiCommonDialogBox.Alert("请选择需要修改的选项！");
        } else if ($("#textFieldChanged").val() == CheckBoxBasicProperty.CheckBoxText[CheckBoxBasicProperty.ItemEditSelectNum] &&
            $("#valueFieldChanged").val() == CheckBoxBasicProperty.CheckBoxValue[CheckBoxBasicProperty.ItemEditSelectNum]) {
            AgiCommonDialogBox.Alert("没有修改，不需要保存！");
        } else {
            CheckBoxBasicProperty.CheckBoxText[CheckBoxBasicProperty.ItemEditSelectNum] = $("#textFieldChanged").val();
            CheckBoxBasicProperty.CheckBoxValue[CheckBoxBasicProperty.ItemEditSelectNum] = $("#valueFieldChanged").val();
            CheckBoxBasicProperty.ItemEditSelectNum = "";
            CheckBoxBasicProperty.SelectedCheckBox = [];
            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
            $("#textFieldChanged").val("");
            $("#valueFieldChanged").val("");
            AgiCommonDialogBox.Alert("保存成功！");
        }
    });

    $('#DeleteItemButton').bind('click touchstart', function () {
        if (CheckBoxBasicProperty.ItemEditSelectNum === "") {
            AgiCommonDialogBox.Alert("请选择需要修改的选项！");
        } else {
            if (CheckBoxBasicProperty.ItemEditSelectNum < CheckBoxBasicProperty.EntityNum) {
                CheckBoxBasicProperty.EntityNum -= 1;
            }
            if (CheckBoxBasicProperty.ShowCounts == CheckBoxBasicProperty.ItemNum) {
                CheckBoxBasicProperty.ShowCounts--;
            }
            CheckBoxBasicProperty.ItemNum -= 1;
            CheckBoxBasicProperty.CheckBoxText.splice(CheckBoxBasicProperty.ItemEditSelectNum, 1);
            CheckBoxBasicProperty.CheckBoxValue.splice(CheckBoxBasicProperty.ItemEditSelectNum, 1);
            CheckBoxBasicProperty.ItemEditSelectNum = "";
            CheckBoxBasicProperty.SelectedCheckBox = [];

            _CheckBoxControl.Set('CheckBoxBasicProperty', CheckBoxBasicProperty);
            $("#textFieldChanged").val("");
            $("#valueFieldChanged").val("");
            var max = CheckBoxBasicProperty.ItemNum > CheckBoxBasicProperty.ShowCounts ? CheckBoxBasicProperty.ItemNum : CheckBoxBasicProperty.ShowCounts;
            if (max < 5) {
                max = 5;
            }
            $("#ShowCounts").val(CheckBoxBasicProperty.ShowCounts);
            $("#ShowCounts").attr("max", max);
            AgiCommonDialogBox.Alert("删除成功！");
        }
    });
};

//单击双击事件处理
var CheckBoxflag = 0;
var CheckBoxObj = null;
Agi.Controls.CheckBoxClickManager = function (_ClickOption) {
    CheckBoxObj = _ClickOption;
    if (!CheckBoxflag) {
        setTimeout(Agi.Controls.CheckBoxClickLogic, 300);
    }
    CheckBoxflag++;
}
Agi.Controls.CheckBoxClickReset = function () {
    CheckBoxflag = 0;
}
Agi.Controls.CheckBoxSingleClick = function (_ClickOption) {
    Agi.Controls.CheckBoxClickReset();
    // var ControlObj = _ClickOption.ControlObj;
    // var BasicProperty = ControlObj.Get('CheckBoxBasicProperty');
    //  ControlObj.Set('SelValue', BasicProperty.SelectedValue);
}
Agi.Controls.CheckBoxDoubleClick = function (_ClickOption) {
    Agi.Controls.CheckBoxClickReset();
    if (!Agi.Controls.IsControlEdit) {
        Agi.Controls.ControlEdit(_ClickOption.ControlObj); //控件编辑界面
    }
}

Agi.Controls.CheckBoxClickLogic = function () {
    Agi.Controls.CheckBoxDoubleClick(CheckBoxObj);
}
