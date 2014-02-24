/// <reference path="../../jquery-1.7.2.js" />

/*添加 Agi.Controls命名空间*/
Namespace.register("Agi.Controls");

Agi.Controls.TimeSplider = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){ //获得实体数据

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

                //保存初始值
                var basicproperty = self.Get("BasicProperty");
                $("#mainBar" + basicproperty.ID).css("width", basicproperty.width);
                $("#mainBar" + basicproperty.ID).css("height", $("#" + self.shell.BasicID).height() - $(".menucelltimesty").height());

                $("#StartPoint" + basicproperty.ID).height($("#mainBar" + basicproperty.ID).height());
                $("#EndPoint" + basicproperty.ID).height($("#mainBar" + basicproperty.ID).height());
                $("#PointPanel" + basicproperty.ID).height($("#mainBar" + basicproperty.ID).height());
                GetNewSplider(this, basicproperty.ID, basicproperty.startDate, basicproperty.endDate, basicproperty.beginValue, basicproperty.endValue);
            }
        },
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
            return this;
        },
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 59,
                minWidth: 260,
                maxWidth: 260,
                maxHeight: 59
            });
            return this;
        },
        ReadData: function (et) {
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity", entity);
        },
        ReadRealData: function (_Entity) {
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "TimeSplider");

            var ID = savedId ? savedId : "TimeSplider" + Agi.Script.CreateControlGUID();

            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 300,
                height: 69,
                divPanel: HTMLElementPanel
                //                enableFrame:true
            });

            var BaseControlObj = $("<div id='" + ID + "' class='shadow'>" +
                                                       "<div id='TimePanel" + ID + "' class='TimePanelSty'><div id='mainBar" + ID + "' class='mainbarsty'><div id='StartPoint" + ID + "' class='StartPointsty'>" +
                                                       "</div><div id='EndPoint" + ID + "' class='EndPointsty'></div><div id='PointPanel" + ID + "' class='PointPanelsty'></div></div><div class='cleartfloat'>" +
                                                       "</div></div><div class='selectPanelheadSty menucelltimesty' ><span id='SpanstartTime" + ID + "'></span>&nbsp; <span>--</span>&nbsp; <span id='SpanEndTime" + ID + "'>" +
                                                       "</span></div></div>");
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            var BasicProperty = {
                ID: ID,
                startDate: "2012-05-01",
                endDate: "2012-12-01",
                beginValue: "2012-06-01",
                endValue: "2012-08-01",
                width: 300
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
                HTMLElementPanel.width(BasicProperty.width);
                HTMLElementPanel.height(69);
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
            $('#' + self.shell.ID).live('mousedown', function (ev) {
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });

            $('#' + self.shell.ID).live('dblclick', function (ev) {
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


            Agi.Edit.workspace.addParameter(ID + ".SelValue", 0);
            obj = ThisProPerty = PagePars = PostionValue = null;

            var basicproperty = self.Get("BasicProperty");

            Agi.Msg.PageOutPramats.AddPramats({
                'Type': Agi.Msg.Enum.Controls,
                'Key': ID,
                'ChangeValue': [{ 'Name': 'BeginDate', 'Value': basicproperty.beginValue }, { 'Name': 'EndDate', 'Value': basicproperty.endValue}]
            });

            //缩小的最小宽高设置
            HTMLElementPanel.resizable({
                minHeight: 69,
                minWidth: 200
                //                maxHeight: 89
            });
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.TimeSpliderProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = $(this.Get("HTMLElement")).parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewTimeSplider = new Agi.Controls.TimeSplider();
//                NewTimeSplider.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewTimeSplider;
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
                }

                var id = ThisHTMLElement.attr("id");
                id = id.substring(id.indexOf('T'));

                $("#mainBar" + id).css("width", $("#" + id).width());
                $("#mainBar" + id).css("height", $("#" + ThisHTMLElement.attr("id")).height() - $(".menucelltimesty").height());

                $("#StartPoint" + id).height($("#mainBar" + id).height());
                $("#EndPoint" + id).height($("#mainBar" + id).height());
                $("#PointPanel" + id).height($("#mainBar" + id).height());

                var basicproperty = this.Get("BasicProperty");
                var endvalue = $("#SpanEndTime" + id).html();
                var beginvalue = $("#SpanstartTime" + id).html();
                basicproperty.width = $("#" + id).width();
                this.Set("BasicProperty", basicproperty);
                var self = this;
                GetNewSplider(self, basicproperty.ID, basicproperty.startDate, basicproperty.endDate, beginvalue, endvalue);
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }
        },
        Refresh: function () {
            var ThisHTMLElement = $(this.Get("HTMLElement"));
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
            $(this.Get("HTMLElement")).css({"-webkit-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000"});
         /*   $(this.Get("HTMLElement")).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
                "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
            });*/
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
            var h = this.shell.Title.height() + this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            obj.height(19);
            obj.width(300);

            var id = obj.attr("id");
            id = id.substring(id.indexOf('T'));
            $("#mainBar" + id).width(300);
            $("#mainBar" + id).css("height", $("#" + $(this.Get('HTMLElement')).attr("id")).height() - $(".menucelltimesty").height());

            $("#StartPoint" + id).height($("#mainBar" + id).height());
            $("#EndPoint" + id).height($("#mainBar" + id).height());
            $("#PointPanel" + id).height($("#mainBar" + id).height());

            var basicproperty = this.Get("BasicProperty");
            var endvalue = $("#SpanEndTime" + id).html();
            var beginvalue = $("#SpanstartTime" + id).html();
            var self = this;
            GetNewSplider(self, basicproperty.ID, basicproperty.startDate, basicproperty.endDate, beginvalue, endvalue);
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);

                obj.resizable({
                    minHeight: 69,
                    minWidth: 200
                    //                    maxHeight: 89
                });

                var id = obj.attr("id");
                id = id.substring(id.indexOf('T'));
                var basicproperty = this.Get("BasicProperty");
                var endvalue = $("#SpanEndTime" + id).html();
                var beginvalue = $("#SpanstartTime" + id).html();
                var self = this;
                GetNewSplider(self, basicproperty.ID, basicproperty.startDate, basicproperty.endDate, beginvalue, endvalue);
            }

        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.TimeSpliderAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
          /*  ConfigObj.append("<Control>");
            var Entitys = this.Get("Entity");
            $(Entitys).each(function (i, e) {
                e.Data = null;
            });

            var BasicProperty = this.Get("BasicProperty");
            BasicProperty.beginValue = $("#SpanstartTime" + BasicProperty.ID).html();
            BasicProperty.endValue = $("#SpanEndTime" + BasicProperty.ID).html();
            this.Set("BasicProperty", BasicProperty);
            ConfigObj.append("<ZIndex>" + $("#Panel_" + ProPerty.BasciObj[0].id).css("z-index") + "</ZIndex>");
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串*/
            var TimeSpliderControl ={
                Control:{
                    ControlType:null,//控件类型
                    ControlID:null,//控件属性
                    ControlBaseObj:null,//控件基础对象
                    HTMLElement:null,//控件外壳ID
                    Entity:null,//控件实体
                    BasicProperty:null,//控件基本属性
                    Position:null,//控件位置
                    ThemeInfo:null,
                    ZIndex:null
                }
            }
            TimeSpliderControl.Control.ControlType = this.Get("ControlType");
            TimeSpliderControl.Control.ControlID = ProPerty.ID;
            TimeSpliderControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            TimeSpliderControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            $(Entitys).each(function (i, e) {
                e.Data = null;
            });
            TimeSpliderControl.Control.Entity = Entitys;
            TimeSpliderControl.Control.BasicProperty  =this.Get("BasicProperty");
            TimeSpliderControl.Control.Position = this.Get("Position");
            TimeSpliderControl.Control.ThemeInfo = this.Get("ThemeInfo");
            TimeSpliderControl.Control.ZIndex =$("#Panel_" + ProPerty.BasciObj[0].id).css("z-index");
            return TimeSpliderControl.Control;
        }, //获得TimeSplider控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                        _Config.Entity = _Config.Entity;

                        _Config.Position = _Config.Position;
                        this.Set("Position", _Config.Position);

                        _Config.ThemeInfo = _Config.ThemeInfo;

                        BasicProperty = _Config.BasicProperty;
                        this.Set("BasicProperty", BasicProperty);


                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    $("#mainBar" + ThisProPerty.ID).width(BasicProperty.width);
                    GetNewSplider(this, ThisProPerty.ID, BasicProperty.startDate, BasicProperty.endDate, BasicProperty.beginValue, BasicProperty.endValue);

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
                    if (this.IsPageView) {
                        $('#' + this.shell.ID).css('z-index', 10000);
                    }
                }
            }
        } //根据配置信息创建控件
    }, true);



//拖拽控件至编辑页面时，初始控件的方法
    Agi.Controls.InitTimeSplider = function () {
        return new Agi.Controls.TimeSplider();
}

/*日期选择控件参数更改处理方法*/
    Agi.Controls.TimeSpliderAttributeChange = function (_ControlObj, Key, _Value) {
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
                }
            } break;
        case "SelValue":
            {
            } break;
    } //end switch

}     //end

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.TimeSpliderProrityInit = function (TimeSpliderControl) {
    _TimeSplider = TimeSpliderControl;
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='DatePickerProperty'>");
    ItemContent.append("<div>开始日期：<input type='text' id='begindate'></div>");
    ItemContent.append("<div>结束日期：<input  type='text' id='enddate'></div>");
    ItemContent.append("<div>选择开始值：<input type='text' id='beginvalue'></div>");
    ItemContent.append("<div>选择结束值：<input type='text' id='endvalue'></div>");
    ItemContent.append("<div><input type='button' value='应用更改' style='width:200px;' id='TimeSpliderpropertychange' class='btnclass'></div>");
    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    var getProperty = Agi.Edit.workspace.currentControls[0].Get("BasicProperty");

    $("#begindate").Zebra_DatePicker({
        onSelect: function (e) {
            var edate = $("#enddate").val();
            var bdate = $("#begindate").val();
            if (bdate > edate) {
                AgiCommonDialogBox.Alert("开始值不能大于结束值！");
                if ($("#begindate").val() != "") {
                    $("#begindate").val("");
                }
                return;
            }
            if ($("#beginvalue").val() < bdate) {
                if ($("#beginvalue").val() != "") {
                    $("#beginvalue").val("");
                }
            }
            if ($("#endvalue").val() < bdate) {
                if ($("#endvalue").val() != "") {
                    $("#endvalue").val("");
                }
            }
        }
    });
    $("#enddate").Zebra_DatePicker({
        onSelect: function (e) {
            var edate = $("#enddate").val();
            var bdate = $("#begindate").val();
            if (edate < bdate) {
                AgiCommonDialogBox.Alert("结束值不能小于开始值！");
                if ($("#enddate").val() != "") {
                    $("#enddate").val("");
                }
                return;
            }

            if ($("#beginvalue").val() > edate) {
                if ($("#beginvalue").val() != "") {
                    $("#beginvalue").val("");
                }
            }
            if ($("#endvalue").val() > edate) {
                if ($("#endvalue").val() != "") {
                    $("#endvalue").val("");
                }
            }
        }
    });
    $("#beginvalue").Zebra_DatePicker({
        onSelect: function (e) {
            var bdate = $("#begindate").val();
            var evalue = $("#endvalue").val();
            var bvalue = $("#beginvalue").val();
            if (evalue != "") {
                if (bvalue > evalue) {
                    AgiCommonDialogBox.Alert("选择开始日期值不能大于结束日期！");
                    if ($("#beginvalue").val() != "") {
                        $("#beginvalue").val("");
                    }
                    return;
                }

                if (bvalue < bdate) {
                    AgiCommonDialogBox.Alert("选择开始日期值不能小于选定开始值！");
                    if ($("#beginvalue").val() != "") {
                        $("#beginvalue").val("");
                    }
                    return;
                }
            }
            else {
                AgiCommonDialogBox.Alert("请先选择结束日期！");
                $("#beginvalue").val("");
                return;
            }
        }
    });
    $("#endvalue").Zebra_DatePicker({
        onSelect: function (e) {
            var edate = $("#enddate").val();
            var evalue = $("#endvalue").val();
            var bvalue = $("#beginvalue").val();
            var bdate = $("#begindate").val();

            if (evalue > edate) {
                AgiCommonDialogBox.Alert("选择结束日期值不能大于选定结束值！");
                if ($("#endvalue").val() != "") {
                    $("#endvalue").val("");
                }
                return;
            }
            if (evalue < bvalue) {
                AgiCommonDialogBox.Alert("选择结束日期值不能小于开始日期！");
                if ($("#endvalue").val() != "") {
                    $("#endvalue").val("");
                }
                return;
            }
            if (evalue < bdate) {
                AgiCommonDialogBox.Alert("选择结束日期值不能小于选定开始值！");
                if ($("#endvalue").val() != "") {
                    $("#endvalue").val("");
                }
                return;
            }
        } 
    });

    $("#begindate").val(getProperty.startDate);
    $("#enddate").val(getProperty.endDate);
    $("#beginvalue").val(getProperty.beginValue);
    $("#endvalue").val(getProperty.endValue);


    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
    }
}

$("#TimeSpliderpropertychange").live('click', function () {
    var mid = Agi.Edit.workspace.currentControls[0].shell.BasicID;
    var self = Agi.Edit.workspace.currentControls[0];

    if ($("#begindate").val() == "" || $("#enddate").val() == "" || $("#beginvalue").val() == "" || $("#endvalue").val() == "") {
        AgiCommonDialogBox.Alert("请填写完整相关日期值！");
        return;
    }
    else {
        $("#mainBar" + mid).width($("#" + mid).width());
        GetNewSplider(self, mid, $("#begindate").val(), $("#enddate").val(), $("#beginvalue").val(), $("#endvalue").val());

        var getProperty = Agi.Edit.workspace.currentControls[0].Get('BasicProperty');
        getProperty.startDate = $("#begindate").val();
        getProperty.endDate = $("#enddate").val();
        getProperty.beginValue = $("#beginvalue").val();
        getProperty.endValue = $("#endvalue").val();

        Agi.Edit.workspace.currentControls[0].Set('BasicProperty', getProperty);
    }
});

