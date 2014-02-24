Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.CustomYGZButton = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () {//获得实体数据
            var entity = this.Get('Entity')[0];
            if (entity != undefined && entity != null) {
                return entity.Data;
            } else {
                return null;
            }
        },
        Render: function (_Target) {
            var obj = null;
            var self = this;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var ThisHTMLElement = this.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj);
            }
        },
        ReadData: function (et) {
            var self = this;
            var entity = this.Get("Entity");
			var BasicProperty = this.Get("BasicProperty");
			
			//将当前控件的dataset保存起来，方便给参数赋值
			BasicProperty.EntityInfo=et;
			BasicProperty.OrgParamters=et.Parameters;
			var ParaBindInfo=BasicProperty.ParaBindInfo;
			ParaBindInfo=[];
			for(var i=0;i<et.Parameters.length;i++){
				ParaBindInfo.push({
					PName:et.Parameters[i].Key,
					PValue:et.Parameters[i].Value,
					PControl:"",
					POUTP:""
				});
			}
			BasicProperty.ParaBindInfo=ParaBindInfo;

			if (et != undefined && et != null && et != "") {
                Agi.Utility.RequestData2(et, function (d) {
                        var data = d.Data.length ? d.Data : [];
                        var columns = d.Columns;
                        et.Data = data;
                        et.Columns = d.Columns;
						entity = [];
						entity.push(et);
						self.Set("Entity", entity);
                    });
            }else{
					entity = [];
					entity.push(et);
					self.Set("Entity", entity);
			}
			
        },
		RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'CustomYGZButton.RemoveEntity Arg is null';
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
			
			var BasicProperty=self.Get('BasicProperty');
				BasicProperty.EntityInfo=undefined,
				BasicProperty.PostControlID=[],
				BasicProperty.OrgParamters=[],
				BasicProperty.ParaBindInfo=[]
            self.Set('BasicProperty', BasicProperty);
            //20130123 倪飘 更新实体数据之后更行高级属性面板
            Agi.Controls.CustomYGZButtonPropertyInit(self);

        }, //移除实体Entity
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.AttributeList = [];
            this.IsChangeEntity = false;
            this.Set("Entity", []);
            this.Set("ControlType", "CustomYGZButton");

            var ID = savedId ? savedId : "CustomYGZButton" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-bottom: 15px'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 100,
                height: 40,
                divPanel: HTMLElementPanel
            });
            //隐藏头尾
//            this.shell.Title.hide();
//            this.shell.Title.hide().removeClass('selectPanelheadSty');
//            this.shell.Footer.hide();

            var BaseControlObj = $('<input type="button" class="CustomYGZButtonClass" id=' + ID + ' value="炼钢"/>');
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement", this.shell.Container[0]);

            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            var BasicProperty = {
				ButtonText:"炼钢",
                FontSize: "12",
                FontColor: "#000",
                BorderRadius: 5,
                Background: "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(203,202,202)),color-stop(1, rgb(235,233,233)))",
                BorderSize: 1,
                BorderColor: "#768d96",
				EntityInfo:undefined,
				PostControlID:[],
				OrgParamters:[],
				ParaBindInfo:[]
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

            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(100);
                HTMLElementPanel.height(40);
                //BaseControlObj.height($('.HTMLElementPanel').height() - 14);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
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
            $('#' + self.shell.ID).mousedown(function (ev) {
                ev.stopPropagation();
                if (Agi.Edit) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

            $('#' + self.shell.ID).click(function (ev) {
                Agi.Controls.CustomButtonClickManager({ "ControlObj": self }); //
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                ev.stopPropagation();
                if (Agi.Edit) {
                    Agi.Controls.CustomButtonClickManager({ "ControlObj": self });
                }
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            this.Set("Position", PostionValue);
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = null;

            //缩小的最小宽高设置
            HTMLElementPanel.resizable({
                minHeight: 20,
                minWidth: 25
            }).css("position", "absolute");
            this.Set("ThemeName", null);
            //20130514 倪飘 解决bug，组态环境中查询按钮以后拖入容器框控件，容器框控件会覆盖查询按钮控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");

            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        CustomProPanelShow: function () {
            Agi.Controls.CustomYGZButtonPropertyInit(this);
        },
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = this.shell.Container.parent(); // $("#" + this.Get("HTMLElement").id).parent();
//                var PostionValue = this.Get("Position");
//                var newPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewButton = new Agi.Controls.CustomYGZButton();
//                NewButton.Init(ParentObj, PostionValue);
//                newPositionpars = null;
//                return NewButton;
//            }
//        },
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
            ThisHTMLElement.css("left", (parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
        },
        Checked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        EnterEditState: function (size) {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            };
            //固定一个宽度,防止超出左边的容器
            //                        this.shell.Container.css({'width':200});
            obj.height(40);
            obj.width(100);
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            //刷新大小
            this.PostionChange(null);
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            var self = this;
            switch (Key) {
                case "Position":
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
                case "BasicProperty": //用户选择了一个项目
                    {
                         var BasicProperty = self.Get("BasicProperty");
						$("#" + self.shell.BasicID).val(BasicProperty.ButtonText);
                        $("#" + self.shell.BasicID).css("font-size", BasicProperty.FontSize + "px");
                        $("#" + self.shell.BasicID).css("color", BasicProperty.FontColor);
                        $("#" + self.shell.BasicID).css("border-radius", BasicProperty.BorderRadius + "px");
                        if (BasicProperty.Background != null && BasicProperty.Background != "") {
                            if (typeof (BasicProperty.Background) === "string") {
                                if(BasicProperty.Background.indexOf('-webkit-gradient')>=0){
									$("#" + self.shell.BasicID).css({ "background-image": "" + BasicProperty.Background + "" });
								}else{
									$("#" + self.shell.BasicID).css({ "background-color": "" + BasicProperty.Background + "" });
								}
                            } else {
                                var oBackgroundValue = Agi.Controls.ControlColorApply.fBackgroundColorFormat(BasicProperty.Background);
                                if (oBackgroundValue.BolIsTransfor != "false") {
                                    $("#" + self.shell.BasicID).css({ "background": "none", "background-color": "transparent" });
                                } else {
                                    $("#" + self.shell.BasicID).css(BasicProperty.Background.value);
                                }
                            }
                        }
                        if (BasicProperty.BorderColor != null) {
                            var strBordervalue = BasicProperty.BorderSize + "px " + " solid " + BasicProperty.BorderColor;
                            $("#" + self.shell.BasicID).css("border", strBordervalue);
                            strBordervalue = null;
                        } else {
                            $("#" + self.shell.BasicID).css("border", "0px solid #ffffff");
                        }
                    }
                    break;
            } //end switch

        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var ButtonContorl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件ID
                    ControlBaseObj: null, //控件对象
                    HTMLElement: null, //控件的外壳HTML元素信息
                    Entity: null, // 实体
                    BasicProperty: null, //控件基本属性
                    Position: null, // 控件位置信息
                    ThemeName: null//主题名称
                }
            }// 配置信息数组对象
            ButtonContorl.Control.ControlType = this.Get("ControlType");
            ButtonContorl.Control.ControlID = ProPerty.ID;
            ButtonContorl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            ButtonContorl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            ButtonContorl.Control.Entity = this.Get("Entity");
            ButtonContorl.Control.BasicProperty = this.Get("BasicProperty");
            ButtonContorl.Control.Position = this.Get("Position");
            return ButtonContorl.Control; //返回配置字符串
        },
        //获得控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {

                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    this.Set("Position", _Config.Position);


                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);


                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

					this.Set("Entity", _Config.Entity);

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
                }
            }
        }
    }, true);


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitCustomYGZButton = function () {
    return new Agi.Controls.CustomYGZButton();
}


// 自定义属性面板初始化显示
Agi.Controls.CustomYGZButtonPropertyInit = function (CustomYGZButtonControl) {
    var _Button = CustomYGZButtonControl;
    var Me = this;
    var ThisProItems = [];

    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();

    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='CustomControl_Pro_Panel'>");
    ItemContent.append("<table class='CustomControlproPanelTable'>");
	ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>按钮文本：</td><td class='CustomControlproPanelTabletd1' colspan='3'><input type='text' id='CButton_ButtonText' style='width:80%;'  /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>背景设置：</td><td class='CustomControlproPanelTabletd1'><div id='CButton_FilterBgColor' style='background-color:#ffffffff;' class='ControlColorSelPanelSty'></div></td>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>圆角半径：</td><td class='CustomControlproPanelTabletd1'><input style='width:90%' type='number' id='CButton_BorderRoundSize' min='0'  max='20'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>边框宽度：</td><td class='CustomControlproPanelTabletd1'><input style='width:90%' type='number' id='CButton_BorderSize' min='0' max='10'/></td>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>边框颜色：</td><td class='CustomControlproPanelTabletd1'><input style='width:90%' type='text' id='CButton_BorderColor' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>字体颜色：</td><td class='CustomControlproPanelTabletd1'><input style='width:90%' type='text' id='CButton_FontColor'/></td>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>字体大小：</td><td class='CustomControlproPanelTabletd1'><input style='width:90%' type='number' id='CButton_FontSize' min='12' max='30'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BasicObj = $(ItemContent.toString());

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: BasicObj }));

	ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='CustomControl_Pro_Panel'>");
    ItemContent.append("<table class='CustomControlproPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>参数名称：</td><td colspan='3'><select id='YGZButton_ParameterList'></select></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>参数值：</td><td colspan='3' id='YGZButton_ParameterValue'></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>控件列表：</td><td colspan='3'><select id='YGZButton_ParameterConList'></select></td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>控件参数：</td><td colspan='3'><select id='YGZButton_ParameterConPara'></select></td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td colspan='4' class='CustomControlproPanelTabletd1'>");
	//ItemContent.append("<div class='CustomControlProbtnAdd' title='新增' id='YGZButton_ParameterAdd'></div>");
	ItemContent.append("<div class='CustomControlProbtnSave' title='保存' id='YGZButton_ParameterAdd'></div>");
	ItemContent.append("<div class='CustomControlProbtnDelete' title='删除' id='YGZButton_ParameterDelete'></div>");
	ItemContent.append("<div class='CustomControlProbtnfloatclear'></div>");
	ItemContent.append("<div class='CustomControlProhidenValue' id='YGZButton_ParametersHiddenValue'></div>");
	ItemContent.append("</td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td colspan='4' class='CustomControlProRowtdsty'>已配置参数信息</td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td colspan='4'>");
	ItemContent.append("<div class='CustomCtrlExtParsHeadSty'>");
	ItemContent.append("<div class='CustomCtrlExtParsheadCellSty'>参数</div>");
	ItemContent.append("<div class='CustomCtrlExtParsheadCellSty'>对应控件</div>");
	ItemContent.append("<div class='CustomCtrlExtParsheadCellSty'>控件参数</div>");
	ItemContent.append("</div>");
	ItemContent.append("<div class='CustomCtrlExtParsListPanelsty' id='YGZButton_ParameterInfoTabel'></div>");
	ItemContent.append("</td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BasicObj1 = $(ItemContent.toString());
	ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "关联参数设置", DisabledValue: 1, ContentObj: BasicObj1 }));

	ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='CustomControl_Pro_Panel'>");
    ItemContent.append("<table class='CustomControlproPanelTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='CustomControlproPanelTabletd0'>控件列表：</td><td colspan='3'><select id='YGZButton_ControlList'></select></td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td colspan='4' class='CustomControlproPanelTabletd1'>");
	ItemContent.append("<div class='CustomControlProbtnAdd' title='新增' id='YGZButton_ControlAdd'></div>");
	//ItemContent.append("<div class='CustomControlProbtnSave' title='保存' id='YGZButton_ControlSave'></div>");
	ItemContent.append("<div class='CustomControlProbtnDelete' title='删除' id='YGZButton_ControlDelete'></div>");
	ItemContent.append("<div class='CustomControlProbtnfloatclear'></div>");
	ItemContent.append("<div class='CustomControlProhidenValue' id='YGZButton_ControlHiddenValue'></div>");
	ItemContent.append("</td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td colspan='4' class='CustomControlProRowtdsty'>已添加联动控件</td>");
    ItemContent.append("</tr>");
	ItemContent.append("<tr>");
    ItemContent.append("<td colspan='4'>");
	ItemContent.append("<div class='CustomCtrlExtParsHeadSty'>");
	ItemContent.append("<div class='CustomCtrlExtParsheadCellSty'>控件名称</div>");
	ItemContent.append("<div class='CustomCtrlExtParsheadCellSty'></div>");
	ItemContent.append("<div class='CustomCtrlExtParsheadCellSty'></div>");
	ItemContent.append("</div>");
	ItemContent.append("<div class='CustomCtrlExtParsListPanelsty' id='YGZButton_ControlAddListPanel' ></div>");
	ItemContent.append("</td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var BasicObj2 = $(ItemContent.toString());
	ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "联动控件设置", DisabledValue: 1, ContentObj: BasicObj2 }));

	 Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
	
	//基本属性
	//绑定保存值
    var BasicProperty = _Button.Get("BasicProperty");
	$("#CButton_ButtonText").val(BasicProperty.ButtonText);
    if (BasicProperty.BorderRadius) { } else {
        BasicProperty.BorderRadius = 5;
    }
    $("#CButton_BorderRoundSize").val(BasicProperty.BorderRadius);
    $("#CButton_FontColor").val(BasicProperty.FontColor);
    if (BasicProperty.FontSize) { } else {
        BasicProperty.FontSize = 12;
    }
    if (BasicProperty.BorderColor) { } else {
        BasicProperty.BorderColor = "#768d96";
    }
    $("#CButton_BorderColor").val(BasicProperty.BorderColor);
    $("#CButton_FontSize").val(BasicProperty.FontSize);
    if (BasicProperty.BorderSize) { } else {
        BasicProperty.BorderSize = 1;
    }
    $("#CButton_BorderSize").val(BasicProperty.BorderSize);
    if (BasicProperty.Background) { } else {
        BasicProperty.Background =
        {
            "type": 2,
            "direction": "radial",
            "stopMarker":
            [
                { "position": 0, "color": "rgb(235,233,233", "ahex": "" },
                { "position": 1, "color": "rgb(203,202,202)", "ahex": "" }
            ],
            "value":
            {
                "background": "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(235,233,233)),color-stop(1, rgb(203,202,202)))"
            }
        };
    }
    Agi.Controls.ControlColorApply.fColorControlValueSet("CButton_FilterBgColor", BasicProperty.Background, true);

	
    $("#CButton_ButtonText").change(function () {
        var val = $("#CButton_ButtonText").val();
		BasicProperty.ButtonText=val;
		_Button.Set("BasicProperty", BasicProperty);
		$(this).val(BasicProperty.ButtonText);
        
    });
	 $("#CButton_FontColor").spectrum({
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
            $("#CButton_FontColor").val(color.toHexString());
            BasicProperty.FontColor = color.toHexString();
            _Button.Set("BasicProperty", BasicProperty);
        }
    });
    $("#CButton_BorderColor").spectrum({
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
            $("#CButton_BorderColor").val(color.toHexString());
            BasicProperty.BorderColor = color.toHexString();
            _Button.Set("BasicProperty", BasicProperty);
        }
    });
    //20130408  倪飘 修改bug，查询按钮高级属性中，边框宽度，圆角半径，字体大小输入框对特殊字符以及空格无限制
    $("#CButton_FontSize").change(function () {
        var val = $("#CButton_FontSize").val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val.trim() != "") {
            if (val >= MinNumber && val <= MaxNumber) {
                BasicProperty.FontSize = val;
            }
            else {
                $(this).val(BasicProperty.FontSize);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }
            _Button.Set("BasicProperty", BasicProperty);
        } else {
            AgiCommonDialogBox.Alert("请输入" + MinNumber + "-" + MaxNumber + "范围内的值！");
            $(this).val(BasicProperty.FontSize);
        }
    });
    $("#CButton_BorderSize").change(function () {
        var val = $("#CButton_BorderSize").val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val.trim() != "") {
            if (val >= MinNumber && val <= MaxNumber) {
                BasicProperty.BorderSize = val;
            }
            else {
                $(this).val(BasicProperty.BorderSize);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }

            _Button.Set("BasicProperty", BasicProperty);
        } else {
            AgiCommonDialogBox.Alert("请输入" + MinNumber + "-" + MaxNumber + "范围内的值！");
            $(this).val(BasicProperty.BorderSize);
        }
    });
    $("#CButton_BorderRoundSize").change(function () {
        var val = $("#CButton_BorderRoundSize").val();
        var MinNumber = parseInt($(this).attr("min"));
        var MaxNumber = parseInt($(this).attr("max"));
        if (val.trim() != "") {
            if (val >= MinNumber && val <= MaxNumber) {
                BasicProperty.BorderRadius = val;
            }
            else {
                $(this).val(BasicProperty.BorderRadius);
                var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                AgiCommonDialogBox.Alert(DilogboxTitle);
            }

            _Button.Set("BasicProperty", BasicProperty);
        } else {
            AgiCommonDialogBox.Alert("请输入" + MinNumber + "-" + MaxNumber + "范围内的值！");
            $(this).val(BasicProperty.BorderRadius);
        }
    });
    $("#CButton_FilterBgColor").unbind().bind("click", function () {
        var oThisSelColorPanel = this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel, [], true, function (color) {
            var BgColorValue = Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
            if (BgColorValue.ColorType != 3) {
                $(oThisSelColorPanel).css("background", color.value.background).data('colorValue', color);
            } else {
                $(oThisSelColorPanel).css(BgColorValue.BackGroundImg).data('colorValue', color);
            }
            BasicProperty.Background = color;
            _Button.Set("BasicProperty", BasicProperty);
        });
    });
	//当前页面所有控件列表
	var _controlObj = Agi.Edit.workspace.controlList.toArray();
	//关联参数设置
	 /*var BasicProperty = {
               
				EntityInfo:undefined,
				PostControlID:[],
				OrgParamters:undefined,
				ParaBindInfo:[{PName:'time',PValue:'con.text',PControl:'con',POUTP:'TEXT'}]
            };*/

	//将参数列表添加到下拉菜单
	var ParamtersOptions = "";
	var paralist=BasicProperty.OrgParamters;
	for (var i = 0; i < paralist.length; i++){
              ParamtersOptions += "<option value='" + paralist[i].Key + "'>" + paralist[i].Key + "</option>";
        }
	$("#YGZButton_ParameterList").append($(ParamtersOptions)).unbind('change').bind('change',function(ev){
		var OrgParamters=BasicProperty.OrgParamters;
		var ParaBindInfo=BasicProperty.ParaBindInfo;
		var CurrentParaName=$(this).val();
		for(var i=0;i<ParaBindInfo.length;i++){
			if(CurrentParaName===ParaBindInfo[i].PName){
				document.getElementById('YGZButton_ParameterValue').innerHTML=ParaBindInfo[i].PValue;
				$("#YGZButton_ParameterConList").val(ParaBindInfo[i].PControl);
				$("#YGZButton_ParameterConList").change();
				$("#YGZButton_ParameterConPara").val(ParaBindInfo[i].POUTP);
				break;
			}else{
				document.getElementById('YGZButton_ParameterValue').innerHTML="";
				$("#YGZButton_ParameterConList").val("");
				$("#YGZButton_ParameterConList").change();
			}
		}

	});

	//默认显示下方列表
	//将确认添加的控件加到下方控件列表
			var InitParaConListItems="";
			if(BasicProperty.ParaBindInfo !=null && BasicProperty.ParaBindInfo.length>0){
				for(var j=(BasicProperty.ParaBindInfo.length-1);j>=0;j--){
					for(var k=0;k<BasicProperty.OrgParamters.length;k++){
						if(BasicProperty.ParaBindInfo[j].PName===BasicProperty.OrgParamters[k].Key){
							if(BasicProperty.ParaBindInfo[j].PValue !=BasicProperty.OrgParamters[k].Value){
								 InitParaConListItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' title='"+BasicProperty.ParaBindInfo[j].PName+"'>"+BasicProperty.ParaBindInfo[j].PName
												+"</div><div class='CustomCtrlExtParsCellSty' title='"+BasicProperty.ParaBindInfo[j].PControl+"'>"+BasicProperty.ParaBindInfo[j].PControl+"</div>" +
												"<div class='CustomCtrlExtParsCellSty' title='"+BasicProperty.ParaBindInfo[j].POUTP+"'>"+BasicProperty.ParaBindInfo[j].POUTP+"</div></div>";
							}
						}
					}
				}
			}
			$("#YGZButton_ParameterInfoTabel").html(InitParaConListItems);
			$("#YGZButton_ParameterList").change();
			$("#YGZButton_ParameterInfoTabel").find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
				$(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
				$(this).addClass("CustomCtrlExtParsitem_selected");
				$("#YGZButton_ParameterList").val($(this).find("div")[0].innerText);
				$("#YGZButton_ParameterList").change();
				$("#YGZButton_ParametersHiddenValue").html($(this).find("div")[0].innerText);
			});


	//保存按钮点击事件
	$("#YGZButton_ParameterAdd").unbind("click").bind("click",function(ev){
		var OrgParamters=BasicProperty.OrgParamters;
		var ParaBindInfo=BasicProperty.ParaBindInfo;

		var PName=$("#YGZButton_ParameterList").val();
		var PControl=$("#YGZButton_ParameterConList").val();
		var POUTP=$("#YGZButton_ParameterConPara").val();
		//判断是否为空
		if(PName ==="" || PControl ==="" || POUTP ===""){
			AgiCommonDialogBox.Alert("请选择完整再添加！");
			return;
		}

		
		for(var i=0;i<ParaBindInfo.length;i++){
			if(PName===ParaBindInfo[i].PName){
				ParaBindInfo[i].PValue=PControl+'.'+POUTP;
				ParaBindInfo[i].PControl=PControl;
				ParaBindInfo[i].POUTP=POUTP;
			}
		}
		
		//将当前选中的名称显示到隐藏面板，方便删除时使用
		$("#YGZButton_ParametersHiddenValue").html(PName);
		//将确认添加的控件加到下方控件列表
			var ConListItems="";
			if(ParaBindInfo !=null && ParaBindInfo.length>0){
				for(var j=(ParaBindInfo.length-1);j>=0;j--){
					for(var k=0;k<OrgParamters.length;k++){
						if(ParaBindInfo[j].PName===OrgParamters[k].Key){
							if(ParaBindInfo[j].PValue !=OrgParamters[k].Value){
								 ConListItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' title='"+ParaBindInfo[j].PName+"'>"+ParaBindInfo[j].PName
												+"</div><div class='CustomCtrlExtParsCellSty' title='"+ParaBindInfo[j].PControl+"'>"+ParaBindInfo[j].PControl+"</div>" +
												"<div class='CustomCtrlExtParsCellSty' title='"+ParaBindInfo[j].POUTP+"'>"+ParaBindInfo[j].POUTP+"</div></div>";
							}
						}
					}
				}
			}
			$("#YGZButton_ParameterInfoTabel").html(ConListItems);
			$("#YGZButton_ParameterList").change();
			$("#YGZButton_ParameterInfoTabel").find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
				$(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
				$(this).addClass("CustomCtrlExtParsitem_selected");
				$("#YGZButton_ParameterList").val($(this).find("div")[0].innerText);
				$("#YGZButton_ParameterList").change();
				$("#YGZButton_ParametersHiddenValue").html($(this).find("div")[0].innerText);
			});

			AgiCommonDialogBox.Alert("保存成功！");

		
	});


	//删除按钮点击事件
	$("#YGZButton_ParameterDelete").unbind("click").bind("click",function(ev){
		var OrgParamters=BasicProperty.OrgParamters;
		var ParaBindInfo=BasicProperty.ParaBindInfo;

		var PName=$("#YGZButton_ParametersHiddenValue").html();
		if(PName!=""){
                AgiCommonDialogBox.Confirm("确定删除【"+PName+"】的配置信息，还原参数值?", null, function (flag) {
                    if (flag) {
                      
                        for(var i=0;i<ParaBindInfo.length;i++){
                            if(ParaBindInfo[i].PName==PName){
                                ParaBindInfo[i].PControl="";
								ParaBindInfo[i].POUTP="";
									
								for(var j=0;j<OrgParamters.length;j++){
									if(ParaBindInfo[i].PName===OrgParamters[j].Key){
										ParaBindInfo[i].PValue=OrgParamters[j].Value;
									}
								}
                                break;
                            }
                        }

			$("#YGZButton_ParametersHiddenValue").html("");
           //刷新下方面板
			var ConListItems="";
			if(ParaBindInfo !=null && ParaBindInfo.length>0){
				for(var j=(ParaBindInfo.length-1);j>=0;j--){
					for(var k=0;k<OrgParamters.length;k++){
						if(ParaBindInfo[j].PName===OrgParamters[k].Key){
							if(ParaBindInfo[j].PValue !=OrgParamters[k].Value){
								 ConListItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' title='"+ParaBindInfo[j].PName+"'>"+ParaBindInfo[j].PName
												+"</div><div class='CustomCtrlExtParsCellSty' title='"+ParaBindInfo[j].PControl+"'>"+ParaBindInfo[j].PControl+"</div>" +
												"<div class='CustomCtrlExtParsCellSty' title='"+ParaBindInfo[j].POUTP+"'>"+ParaBindInfo[j].POUTP+"</div></div>";
							}
						}
					}
				}
			}
			$("#YGZButton_ParameterInfoTabel").html(ConListItems);
			$("#YGZButton_ParameterList").change();
			$("#YGZButton_ParameterInfoTabel").find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
				$(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
				$(this).addClass("CustomCtrlExtParsitem_selected");
				$("#YGZButton_ParameterList").val($(this).find("div")[0].innerText);
				$("#YGZButton_ParameterList").change();
				$("#YGZButton_ParametersHiddenValue").html($(this).find("div")[0].innerText);
			});

                    }
                });
            }else{
                AgiCommonDialogBox.Alert("请在下方已保存列表选择需要删除的项目！");
            }
		
	});
	
	//联动控件设置
	//进入编辑页面先显示已存在列表
	
	//绑定所有页面控件列表
	var ControlListoptions = "";
	var ParaControlListoptions="<option value=''></option>";
	for (var i = 0; i < _controlObj.length; i++) {
			var tempid = _controlObj[i].Get("ProPerty").ID; //控件ID
            //不显示出容器框控件、动画控件、实时标签、实时图表之类的不能参与数据联动的控件的名称
            if (_controlObj[i].Get("ControlType") != "Panel" && _controlObj[i].Get("ControlType") != "DatePicker" && _controlObj[i].Get("ControlType") != "TimePicker" && _controlObj[i].Get("ControlType") != "RealTimeLable" &&
             _controlObj[i].Get("ControlType") != "InquireButton" && _controlObj[i].Get("ControlType") != "TimeSelector" && _controlObj[i].Get("ControlType") != "AnimationControl" && _controlObj[i].Get("ControlType") != "Container") {
                if (tempid.indexOf("CustomYGZButton") < 0) {
                   ControlListoptions += "<option value='" + tempid + "'>" + tempid + "</option>";
                }
            }
			if (_controlObj[i].Get("ControlType") != "Panel" && _controlObj[i].Get("ControlType") != "InquireButton"&& _controlObj[i].Get("ControlType") != "AnimationControl" && _controlObj[i].Get("ControlType") != "Container") {
				if (tempid.indexOf("CustomYGZButton") < 0) {
				   ParaControlListoptions += "<option value='" + tempid + "'>" + tempid + "</option>";
                }
			}
        }
	//将控件列表添加到联动下拉菜单
	$("#YGZButton_ControlList").append($(ControlListoptions));
	//将控件列表添加到参数下拉菜单
	$("#YGZButton_ParameterConList").append($(ParaControlListoptions)).unbind('change').bind('change',function(){
		//控件点击改变的时候，显示该控件的输出参数
		var AllControlToPara= Agi.Msg.PageOutPramats.GetSerialData();
		var CurrentControlName=$(this).val();
		$("#YGZButton_ParameterConPara").html("");
		for(var i=0;i<AllControlToPara.length;i++){
			if(CurrentControlName===AllControlToPara[i].key){
				var ParaNameList=AllControlToPara[i].value;
				if(ParaNameList.length>0){
					var OutPStr="";
					for(var j=0;j<ParaNameList.length;j++){
						OutPStr += "<option value='" + ParaNameList[j].Name + "'>" + ParaNameList[j].Name + "</option>";
					}
					
					$("#YGZButton_ParameterConPara").append($(OutPStr));
				}
			}
		}
	});

//参数配置模块的初始化
if(BasicProperty.ParaBindInfo.length>0){
	$("#YGZButton_ParameterList").change();
}
	
	
	//将确认添加的控件加到下方控件列表
	var IniConListItems="";
	var IniPostControlID=BasicProperty.PostControlID;
	if(IniPostControlID!=null && IniPostControlID.length>0){
	for(var i=(IniPostControlID.length-1);i>=0;i--){
		IniConListItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' style='width: 90%;' title='"+IniPostControlID[i]+"'>"+IniPostControlID[i]+"</div></div>";
		}
	}
	$("#YGZButton_ControlAddListPanel").html(IniConListItems);
	$("#YGZButton_ControlAddListPanel").find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
				$(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
				$(this).addClass("CustomCtrlExtParsitem_selected");
				$("#YGZButton_ControlList").val($(this).find("div")[0].innerText);
				$("#YGZButton_ControlHiddenValue").html($(this).find("div")[0].innerText);
			});
	$("#YGZButton_ControlList").val(IniPostControlID[0]);

	//添加控件
	$("#YGZButton_ControlAdd").unbind("click").bind("click",function(ev){
            var ControlName=$("#YGZButton_ControlList").val();
			//判断是否为空
			if(ControlName !=""){}else{
				AgiCommonDialogBox.Alert("控件名称不能为空！");
				return;
			}
			//判断是否存在
			var PostControlID=BasicProperty.PostControlID;
			for(var i=0;i<PostControlID.length;i++){
				if(PostControlID[i]===ControlName){
					AgiCommonDialogBox.Alert("新增控件名称已存在！");
					return;
				}
			}
			//将添加的控件名称添加到推送数组
			PostControlID.push(ControlName);

			//将当前选中的名称显示到隐藏面板，方便删除时使用
			$("#YGZButton_ControlHiddenValue").html(ControlName);
			//将确认添加的控件加到下方控件列表
			var ConListItems="";
			if(PostControlID!=null && PostControlID.length>0){
			for(var i=(PostControlID.length-1);i>=0;i--){
				ConListItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' style='width: 90%;' title='"+PostControlID[i]+"'>"+PostControlID[i]+"</div></div>";
				}
			}
			$("#YGZButton_ControlAddListPanel").html(ConListItems);
			$("#YGZButton_ControlAddListPanel").find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
				$(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
				$(this).addClass("CustomCtrlExtParsitem_selected");
				$("#YGZButton_ControlList").val($(this).find("div")[0].innerText);
				$("#YGZButton_ControlHiddenValue").html($(this).find("div")[0].innerText);
			});

			AgiCommonDialogBox.Alert("保存成功！");

        });

		//删除控件
	$("#YGZButton_ControlDelete").unbind("click").bind("click",function(ev){
            var ControlName=$("#YGZButton_ControlHiddenValue").html();
			if(ControlName!=""){
                AgiCommonDialogBox.Confirm("确定删除【"+ControlName+"】?", null, function (flag) {
                    if (flag) {
                        var PostControlID=BasicProperty.PostControlID;//所有保存的列表名称
                        for(var i=0;i<PostControlID.length;i++){
                            if(PostControlID[i]==ControlName){
                                PostControlID.shift(i,1);
                                break;
                            }
                        }
					$("#YGZButton_ControlHiddenValue").html("");
                     //刷新下方面板
                     var ConListItems="";
					 for(var i=(PostControlID.length-1);i>=0;i--){
						ConListItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' style='width: 90%;' title='"+PostControlID[i]+"'>"+PostControlID[i]+"</div></div>";
							}
					 $("#YGZButton_ControlAddListPanel").html(ConListItems);

					 $("#YGZButton_ControlAddListPanel").find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
						$(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
						$(this).addClass("CustomCtrlExtParsitem_selected");
						$("#YGZButton_ControlList").val($(this).find("div")[0].innerText);
						$("#YGZButton_ControlHiddenValue").html($(this).find("div")[0].innerText);
						});
                    }
                });
            }else{
                AgiCommonDialogBox.Alert("请在下方已保存列表选择需要删除的项目！");
            }
        });

}


//事件处理
var CustomYGZButtonflag=0;
var CustomYGZButtonObj=null;
Agi.Controls.CustomButtonClickManager=function(_ClickOption){
    CustomYGZButtonObj=_ClickOption;
    if(!CustomYGZButtonflag)
    {
        setTimeout(Agi.Controls.CustomButtonClickLogic,300);
    }
    CustomYGZButtonflag++;
}
Agi.Controls.CustomButtonClickReset=function(){
    CustomYGZButtonflag=0;
}
Agi.Controls.CustomButtonSingleClick=function(_ClickOption){
    Agi.Controls.CustomButtonClickReset();
	var BasicProperty=_ClickOption.ControlObj.Get("BasicProperty");
	//获取参数联动的控件
	var ControlList=BasicProperty.PostControlID;
	//获取带参数的实体，当前控件绑定的实体
	var Entity=_ClickOption.ControlObj.Get("Entity")[0];
	//保存的实体信息
	var EntityInfo=BasicProperty.EntityInfo;
	//保存的原始参数信息以及值
	var OrgPara=BasicProperty.OrgParamters;
	//保存参数绑定信息
	var ParaBindInfo=BasicProperty.ParaBindInfo;
	//如果参数个数大于0，而且推送的控件个数大于0，则做如下操作：获取绑定的其他控件的输出参数给实体参数赋值
	if(Entity !=undefined){
	if(Entity.Parameters.length>0 && ControlList.length>0){
	//循环保存的参数绑定信息
	for(var j=0;j<ParaBindInfo.length;j++){
		//循环当前绑定实体的信息
		for(var g=0;g<Entity.Parameters.length;g++){
			//如果参数名称相同
			if(ParaBindInfo[j].PName===Entity.Parameters[g].Key){
				//而且参数值发生修改，与默认值不相同，绑定了其他控件的输出参数
				for(var k=0;k<OrgPara.length;k++){
					if(ParaBindInfo[j].PName ===OrgPara[k].Key && ParaBindInfo[j].PValue !=OrgPara[k].Value){
					//获取其他绑定参数控件的当前输出参数，给当前绑定的实体参数赋值
					Entity.Parameters[g].Value= Agi.Msg.PageOutPramats.GetItem_Value(ParaBindInfo[j].PControl,ParaBindInfo[j].POUTP);
				  }
				}
			}
		}
	 }
	}
	}
	//赋给新的对象
	var NewEntity=Entity;

	//推送到其他控件
	if(ControlList.length>0){
		for(var i=0;i<ControlList.length;i++){
			if(Agi.Controls.FindControl(ControlList[i]) !=null && Agi.Controls.FindControl(ControlList[i]) != undefined){
				Agi.Controls.FindControl(ControlList[i]).ReadData(NewEntity);
			}
		}
	}

	//改变样式
	//当前页面所有控件列表
	var _controlObj = Agi.Edit.workspace.controlList.toArray();
	
	for(var i=0;i<_controlObj.length;i++){
		var tempid = _controlObj[i].Get("ProPerty").ID; //控件ID
        if (tempid.indexOf("CustomYGZButton") >= 0) {
            Agi.Controls.FindControl(tempid).Set('BasicProperty', Agi.Controls.FindControl(tempid).Get('BasicProperty'));
         }
	}
	//改变本身点击控件的样式
	$("#"+_ClickOption.ControlObj.shell.BasicID).addClass('CustomYGZButtonClickClass');
	$("#"+_ClickOption.ControlObj.shell.BasicID).css('border','1px solid #ccc');
	$("#"+_ClickOption.ControlObj.shell.BasicID).css('background-color','#EBEBEB');
	$("#"+_ClickOption.ControlObj.shell.BasicID).css('background-image','none');
	$("#"+_ClickOption.ControlObj.shell.BasicID).css('color','#A1A1A0');

}
Agi.Controls.CustomButtonDoubleClick=function(_ClickOption){
    Agi.Controls.CustomButtonClickReset();
    if (!Agi.Controls.IsControlEdit) {
        Agi.Controls.ControlEdit(_ClickOption.ControlObj); //控件编辑界面
    }
}

Agi.Controls.CustomButtonClickLogic=function()
{
    if(CustomYGZButtonflag===1){
        Agi.Controls.CustomButtonSingleClick(CustomYGZButtonObj);
    }
    else{
        Agi.Controls.CustomButtonDoubleClick(CustomYGZButtonObj);
    }
}

