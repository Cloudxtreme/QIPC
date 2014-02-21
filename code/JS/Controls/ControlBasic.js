/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-14
 * Time: 下午2:15
 * To change this template use File | Settings | File Templates.
 */
/*1.控件基类*/
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.IsOpenControl = false;
Agi.Controls.ControlBasic = Agi.OOP.Class.Create(null, {
    ControlType:"", /*控件类型*/
    Position:null, /*控件位置信息*/
    Entity:[], /*控件实体*/
    ProPerty:null, /*属性*/
    HTMLElement:null, /*控件HTML元素,外壳，目前所有外壳都是使用DIV*/
    ThemeInfo:null, /*控件主题信息*/
    IsPageView:false, /*是否运行在pageview环境下*/
    Render:function (_Target) {
    },//控件添加到目标容器
    ReadData:function () {
    },//控件加载实体数据
    ReadOtherData:function () {
    },//控件加载其它格式数据
    ReadRealData:function () {
    },//控件接收实时数据
    ParameterChange:function () {/*有参数更改,外部通知调用*/
    },//控件实体参数发生更改
    GetConfig:function () {
    },//获取保存所需的配置信息
    CreateControl:function () {
    },//根据配置信息创建/还原控件
    Init:function () {
    },//控件初始化
    Destory:function () {
    },//控件销毁/删除
    Copy:function () {
    },//控件复制
    PostionChange:function () {
    }, //位置移动，大小更改
    Checked:function () {
    }, //控件被选中
    UnChecked:function () {
    }, //控件选中取消
    RemoveEntity:function (_EntityKey) {
    }, //移除实体
    AddColumn:function (_entity, _ColumnName) {
    }, //拖拽实体中一列至图表上(控件属性编辑页面)
    InEdit:function () {
    }, //进入属性编辑界面
    ExtEdit:function () {
    }, //退出属性编辑界面
    ShareReadData:function (JsonData) {
    },
    //自定义事件对象
    _scriptCode:{},
    //激活自定义事件
    fireScriptCode:function (event) {
        if (Agi.Edit || !this._scriptCode) {
            return;
        }
        if (typeof event == "string") {
            event = { type:event };
        }
        if (!event.type) {  //falsy
            throw new Error("Event object missing 'type' property.");
        }
        if (this._scriptCode[event.type]) {
            var codeexcuteable = this.validScriptCode(this._scriptCode[event.type].code);
            eval(codeexcuteable);
        }
    },
    //对脚本的可执行性进行简单处理
    validScriptCode:function (codeIn) {
        var excuteableCode = '';
        excuteableCode = codeIn.replace(/[\n]/g, '');//去回车
        return excuteableCode;
    },
    //添加自定义事件
    addScriptCode:function (type, code_in) {
        //debugger;
        if (!this._scriptCode) {
            this._scriptCode = {};
        }
        if (typeof this._scriptCode[type] == "undefined") {
            this._scriptCode[type] = {
                code:''
            };
        }
        this._scriptCode[type].code = code_in;
    },
    removeScriptCode:function (type) {
        if (type == undefined) {
            throw 'removeListener param type is null';
        }
        if (this._scriptCode[type]) {
            this._scriptCode[type].code = '';
        }
    },
    //得到控件所有自定义事件的代码-保存时用到
    getScriptCode:function () {
        if (!this._scriptCode) {
            return null;
        }
        var lis = [
            {
                type:'',
                code:''
            }
        ];
        lis.length = 0;
        for (name in this._scriptCode) {
            if (name == '') {
                continue;
            }
            lis.push({
                type:name,
                code:this._scriptCode[name].code
            })
        }
        return lis;
    },
    //设置控件所有自定义事件的代码-读取时用到
    setScriptCode:function (lis) {
        this._scriptCode = {};
        //debugger;
        if (lis) {
            for (var i = 0; i < lis.length; i++) {
                var li = lis[i];
                this.addScriptCode(li.type, li.code);
            }
        }
    }
}, true);


/*2.基础属性控制面板对象*/
Agi.Controls.BasicPropertyPanelObj = Agi.OOP.Class.Create(null, {
    BaseObj:"BasicPropertyPanel",
    Control:null,
    Width:0,
    Heidth:0,
    Left:0,
    Right:0,
    Top:0,
    Bottom:0,
    Show:function (_ControlHTMLElementID,isOpenPage) {
        var Me = this;
        if (_ControlHTMLElementID != null && _ControlHTMLElementID != "") {
            if (_ControlHTMLElementID.substring(0, 6) === "Panel_") {
            } else {
                if (_ControlHTMLElementID.substring(0, 5) === "Panel") {
                } else {
                    _ControlHTMLElementID = "Panel_" + _ControlHTMLElementID;
                }
            }
        }
        //属性面板
        var Thisobj = $("#BasicPropertyPanel");

        var ControlsList = new Agi.Script.StringBuilder();
        var ControlsArray = Agi.Edit.workspace.controlList.toArray();
        var Protity = null;
        var SelectedIndex = -1;
        var IsUnChecked = false;
        if (ControlsArray != null && ControlsArray.length > 0) {
            //控件选中,原控制逻辑代码
//            for (var i = 0; i < ControlsArray.length; i++) {
//                if (ControlsArray[i].Get("HTMLElement").id == _ControlHTMLElementID) {
//                    if (Agi.Edit.workspace.currentControls.length > 0) {
//                        if (Agi.Script.KeyBordEvent.IsKeyDownControl) {
//                            //Agi.Edit.workspace.currentControls.push(ControlsArray[i]);
//                            /*控件多选，去重，update by Liuyi 2012.11.05*/
//                            var tempControl = ControlsArray[i];
//                            var isContain = false;
//                            for (var j = 0; j < Agi.Edit.workspace.currentControls.length; j++) {
//                                var tempCurrentControl = Agi.Edit.workspace.currentControls[j];
//                                if (tempCurrentControl.Get("ProPerty").ID == tempControl.Get("ProPerty").ID) {
//                                    isContain = true;
//                                }
//                            }
//                            if (!isContain) {
//                                Agi.Edit.workspace.currentControls.push(tempControl);
//                            }
//                        }
//                        else {
//                            for (var _ControlKey in Agi.Edit.workspace.currentControls) {
//                                Agi.Edit.workspace.currentControls[_ControlKey].UnChecked();
//                                /*取消选中*/
//                            }
//                            Agi.Edit.workspace.currentControls.length = 0;
//                            /*清空选中控件列表*/
//                            Agi.Edit.workspace.currentControls[0] = ControlsArray[i];
//                        }
//                    } else {
//                        Agi.Edit.workspace.currentControls[0] = ControlsArray[i];
//                    }
//                    SelectedIndex = i;
//                    ControlsArray[i].Checked();
//                    /*控件状态为选中*/
//                }
//                Protity = ControlsArray[i].Get("ProPerty");
//                ControlsList.append("<option value='" + i + "'>" + Protity.ID + "</option>");
//            }
            //20130123 17:28 markeluo 控件选中,新控制逻辑代码
            for (var i = 0; i < ControlsArray.length; i++) {
                if (ControlsArray[i].Get("HTMLElement").id == _ControlHTMLElementID) {
                    SelectedIndex = i;
                    if (Agi.Edit.workspace.currentControls.length > 0) {
                        if (Agi.Script.KeyBordEvent.IsKeyDownControl) {
                            //Agi.Edit.workspace.currentControls.push(ControlsArray[i]);
                            /*控件多选，去重，update by Liuyi 2012.11.05*/
                            var tempControl = ControlsArray[i];
                            var isContain = false;
                            for (var j = 0; j < Agi.Edit.workspace.currentControls.length; j++) {
                                var tempCurrentControl = Agi.Edit.workspace.currentControls[j];
                                if (tempCurrentControl.Get("ProPerty").ID == tempControl.Get("ProPerty").ID) {
                                    isContain = true;
                                    tempCurrentControl.UnChecked();
                                    Agi.Edit.workspace.currentControls.splice(j, 1);
                                    IsUnChecked = true;
                                    break;
                                }
                            }
                            if (!isContain) {
                                Agi.Edit.workspace.currentControls.push(tempControl);
                            }
                        }
                        else {
                            for (var _ControlKey in Agi.Edit.workspace.currentControls) {
                                Agi.Edit.workspace.currentControls[_ControlKey].UnChecked();
                                /*取消选中*/
                            }
                            Agi.Edit.workspace.currentControls.length = 0;
                            /*清空选中控件列表*/
                            Agi.Edit.workspace.currentControls.push(ControlsArray[i]);
                        }
                        if (IsUnChecked) {
                            if (i <= 0) {
                                if (ControlsArray.length <= 1) {
                                    SelectedIndex = 0;
                                    ControlsArray[0].Checked();
                                } else {
                                    SelectedIndex = 1;
                                    ControlsArray[1].Checked();
                                }
                            } else {
                                SelectedIndex = i - 1;
                                ControlsArray[i - 1].Checked();
                            }
                        } else {
                            SelectedIndex = i;
                            ControlsArray[i].Checked();
                        }
                        /*控件状态为选中*/
                    } else {
                        //取消所有控件选中
                        for (var _thisindex = 0; _thisindex < ControlsArray.length; _thisindex++) {
                            ControlsArray[_thisindex].UnChecked();
                        }
                        ControlsArray[i].Checked();
                        Agi.Edit.workspace.currentControls.length = 0;
                        Agi.Edit.workspace.currentControls.push(ControlsArray[i]);
                    }
                }
                Protity = ControlsArray[i].Get("ProPerty");
                ControlsList.append("<option value='" + i + "'>" + Protity.ID + "</option>");
            }
            if (SelectedIndex === -1) {
                if (Agi.Edit.workspace.currentControls.length > 0) {
                    for (var _ControlKey in Agi.Edit.workspace.currentControls) {
                        Agi.Edit.workspace.currentControls[_ControlKey].UnChecked();
                        /*取消选中*/
                    }
                }
            }

            if (Thisobj.length > 0 && $("#BasicProPanel_Controls").val() == SelectedIndex) {
            } else {
                Protity = null;
                if (Thisobj.length > 0) {
                } else {
                    var BasicProPanel = new Agi.Script.StringBuilder();
                    BasicProPanel.append("<div id='BasicPropertyPanel' class='ui-dialog ui-widget ui-widget-content ui-corner-all BasicPropertyPanel_sty'>");
                    BasicProPanel.append("<div id='BasicProPanel_Title'class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix' style='border-width:0px; margin:0px;'><span class='ui-dialog-title'  style=' display:block; text-align:center; font-size: 16'>控件属性</span></div>");
                    BasicProPanel.append("<table id='BasicProPanel_Items' cellpadding='0' cellspacing='0' border='0' style='margin-top:10px;font-family:微软雅黑; font-size:14px'>");
                    BasicProPanel.append("<tr class='tr1'><td class='BasicProPanel_Itemleft'>控件：</td><td><select id='BasicProPanel_Controls' class='BasicProPanel_Controls_Sty'></select></td></tr>");
                    BasicProPanel.append("<tr class='tr1'><td class='BasicProPanel_Itemleft'>宽：</td><td><input type='number' id='BasicProPanel_Width' step='1' min='10' class='BasicProPanel_Number_sty ControlProNumberSty' defaultvalue='' max='2000'></td></tr>");
                    BasicProPanel.append("<tr class='tr1'><td class='BasicProPanel_Itemleft'>高：</td><td><input type='number' id='BasicProPanel_Height' min='10'class='BasicProPanel_Number_sty ControlProNumberSty' defaultvalue='' max='2000'></td></tr>");
                    BasicProPanel.append("<tr class='tr1'><td class='BasicProPanel_Itemleft'>左偏移：</td><td><input type='number' id='BasicProPanel_Left' min='0'class='BasicProPanel_Number_sty ProControlProNumberSty' defaultvalue='' max='1500'></td></tr>");
                    BasicProPanel.append("<tr class='tr1'><td class='BasicProPanel_Itemleft'>上偏移：</td><td><input type='number' id='BasicProPanel_Top' min='0'class='BasicProPanel_Number_sty ProControlProNumberSty' defaultvalue='' max='1500'></td></tr>");
                    BasicProPanel.append("<tr class='tr1'><td class='BasicProPanel_Itemzindex'>层级：</td><td><input type='number' id='BasicProPanel_Zindex' min='1000'class='BasicProPanel_Number_sty ProControlProNumberSty' defaultvalue='' max='9999'></td></tr>");
                    BasicProPanel.append("<tr class='tr1'><td colspan='2'><div id='BasicProPanel_Senior' class='btn BasicProPanel_Senior_btnsty'>高级</div></td></tr>");
                    BasicProPanel.append("</table>");
                    BasicProPanel.append("</div>");
                    Thisobj = $(BasicProPanel.toString());
                    Thisobj.hide();
                    Thisobj.appendTo($("#BottomRightCenterDiv"));
                    BasicProPanel = null;
                    $("#BasicProPanel_Width").change(function () {
                        var ThisValue = $(this).val();
                        if (ThisValue >= 10 && ThisValue <= 2000) {
                        } else {
                            var DilogboxTitle = "请输入10-2000范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                            return false;
                        }
                        BasickpropertyChange();
                    });
                    $("#BasicProPanel_Height").change(function () {
                        var ThisValue = $(this).val();
                        if (ThisValue >= 10 && ThisValue <= 2000) {
                        } else {
                            var DilogboxTitle = "请输入10-2000范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                            return false;
                        }
                        BasickpropertyChange();
                    });
                    $("#BasicProPanel_Left").change(function () {
                        var ThisValue = $(this).val();
                        if (ThisValue >= 0 && ThisValue <= 1500) {
                        } else {
                            var DilogboxTitle = "请输入0-1500范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                            return false;
                        }
                        BasickpropertyChange();
                    });
                    $("#BasicProPanel_Top").change(function () {
                        var ThisValue = $(this).val();
                        if (ThisValue >= 0 && ThisValue <= 1500) {
                        } else {
                            var DilogboxTitle = "请输入0-1500范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                            return false;
                        }
                        BasickpropertyChange();
                    });
                    //2014-02-18 coke 所有控件的层级手动设置
                    $("#BasicProPanel_Zindex").change(function () {
                        var ThisValue = $(this).val();
                        if (ThisValue >=1000&& ThisValue <= 9999) {
                        } else {
                            var DilogboxTitle = "请输入1000-9999范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                            return false;
                        }
                        BasickpropertyChange();
                    });

                    $("#BasicProPanel_Senior").click(function () {/*高级*/
                        if (Agi.Edit.workspace.currentControls != null && Agi.Edit.workspace.currentControls.length > 0) {
                            Agi.Controls.ControlEdit(Agi.Edit.workspace.currentControls[0]); //进入控件编辑界面
                        } else {
                            AgiCommonDialogBox.Alert("请选择控件后重试！");
                        }
                    });
                    $("#BasicProPanel_Controls").change(function (ev) {
                        if (Agi.Edit.workspace.controlList.size() > 0) {
                            var ControlID = $(this).find("option:selected").text();
                            var ControlsArray = Agi.Edit.workspace.controlList.toArray();
                            for (var i = 0; i < ControlsArray.length; i++) {
                                ControlsArray[i].UnChecked(); //取消选中
                            }
                            var ThisSelControl = Agi.Controls.FindControl(ControlID); //选中控件
                            ThisSelControl.Checked(); //选中控件
                            Agi.Edit.workspace.currentControls.length = 0;
                            /*清空选中控件列表*/
                            Agi.Edit.workspace.currentControls[0] = ThisSelControl;
                            Me.BasicProValueChange(ThisSelControl); //更改基本属性面板中对应控件的属性值
                        }
                    });
                }
            }
            $("#BasicProPanel_Controls").html(ControlsList.toString());
            /*控件列表*/
            if (SelectedIndex > -1) {
                $("#BasicProPanel_Controls").get(0).selectedIndex = SelectedIndex;
            }
            Me.BasicProValueChange(Agi.Edit.workspace.currentControls[0]); //更改基本属性面板中对应控件的属性值
            ControlsList = null;
            ControlsArray = null;
            SelectedIndex = null;
        }

        //20130514 倪飘 修改bug，组态环境中拖入其他控件以后拖入容器框控件（其他控件拖入之后就不动），容器框控件会覆盖查询按钮控件（容器框控件添加背景色以后能够看到效果）
        //20130514 倪飘 由于第一个控件拖进来时上面的ControlsArray为空，所以不会执行付z-index的代码，故将这段代码从if判断中提出来
        //当前控件设置最大zindex
        var zindex = null;
        //2014-02-18 coke 所有控件的层级手动设置，关掉点击增加层级处理方法

//        if($("#" + _ControlHTMLElementID).css('z-index', zindex.max + 1);)
//        {
//            $("#" + _ControlHTMLElementID).css('z-index', zindex.max + 1);
//        }


//        if (!Agi.Controls.IsControlEdit && !isOpenPage) {
//            zindex = menuManagement.getControlMaxzIndex($("#BottomRightCenterContentDiv"));
//            if (_ControlHTMLElementID.substring(0, 5) == "Panel" && _ControlHTMLElementID.indexOf('_') < 0) {
//                var panel = $("#" + _ControlHTMLElementID);
//                var ind = panel.css('z-index');
//                ind = isNaN(ind) ? 0 : parseInt(ind);
//                panel.css('z-index', ind + 1);
//            }
//            else if (_ControlHTMLElementID.substring(0, 17) == "Panel_TabsControl") {
//                var panel = $("#" + _ControlHTMLElementID);
//                var ind = panel.css('z-index');
//                ind = isNaN(ind) ? 0 : parseInt(ind);
//                panel.css('z-index', ind + 1);
//            }
//            else {
//                $("#" + _ControlHTMLElementID).css('z-index', zindex.max + 1);
//            }
//            //console.log('zindex min:'+zindex.min + ' max:' +zindex.max);
//        }
//        if (zindex) {
//            //设置对其菜单的zIndex
//            $("#alignmentMenu").css("z-index", zindex.max + 9);
//            $('#BasicPropertyPanel').css("z-index", zindex.max + 1);
//        }

    }, //初始化控件属性信息
    ShowPanel:function () {
        var Thisobj = $("#BasicPropertyPanel");
        if (Thisobj.length > 0) {
            Thisobj.show();
        }
    }, //显示基本属性面板
    HidePanel:function () {
        var Thisobj = $("#BasicPropertyPanel");
        if (Thisobj.length > 0) {
            Thisobj.hide();
        }
    }, //隐藏基本属性面板
    PanelStateChange:function () {
        var Thisobj = $("#BasicPropertyPanel");
        if (Thisobj.length > 0) {
            if (Thisobj.is(":hidden")) {
                Thisobj.show();
            } else {
                Thisobj.hide();
            }
        }
    }, //显示状态更改,
    ALLControlsClear:function () {
        $("#BasicProPanel_Controls").html("");
        $("#BasicProPanel_Width").val(0);
        $("#BasicProPanel_Height").val(0);
        $("#BasicProPanel_Left").val(0);
        $("#BasicProPanel_Top").val(0);
        if ($("#ControlEditPage").length > 0) {//清除编辑界面
            $("#ControlEditPage").html("");
            $("#ControlEditPage").remove();
            $("#BottomRightDiv").show();
        }

        this.HidePanel();
    }, //所有控件清除
    PanelPositionChange:function (_PositionValue) {
        var Thisobj = $("#BasicPropertyPanel");
        if (Thisobj.length > 0) {
            Thisobj.css("left", _PositionValue.Left);
            Thisobj.css("top", _PositionValue.Top);
        }
    }, //基本属性面板位置更改,
    BasicProValueChange:function (_Control) {
        /*解决控件锁定批量移动后无法单个移动*/
        if(_Control===undefined){
            return;
        }
        var Control_Position = _Control.Get("Position");
        var ThisControlPanelObj = $(_Control.Get("HTMLElement"));
        var Control_ParentObj = ThisControlPanelObj.parent();
        var Control_ParentPars = { Width:Control_ParentObj.width(), Height:Control_ParentObj.height() };

        //2014-02-18 coke 所有控件的层级手动设置
        var zindex =ThisControlPanelObj.zIndex();
        var headControlID="";
        var ControlID="";
        if(_Control.shell==undefined)
        {
            //防止没有设置_Control.shell.BasicID的控件
            ControlID=_Control.Get("HTMLElement").id.split('_')[1];
            headControlID=_Control.Get("HTMLElement").id;
        }else{
            ControlID=_Control.shell.BasicID;
            headControlID=_Control.shell.ID;
        }

        if(Agi.Controls.FindControl(ControlID).Get('HTMLElement').style.zIndex=="")
        {
            zindex = parseInt(menuManagement.getControlMaxzIndex($("#BottomRightCenterContentDiv")).max)+1;
        }
        $("#"+headControlID).css('z-index',zindex);

        var Control_Pars = { Left:parseInt(parseFloat(Control_Position.Left) * Control_ParentPars.Width),
            Top:parseInt(parseFloat(Control_Position.Top) * Control_ParentPars.Height),
            Right:parseInt(parseFloat(Control_Position.Right) * Control_ParentPars.Width),
            Bottom:parseInt(parseFloat(Control_Position.Bottom) * Control_ParentPars.Height),
            Width:0,
            Heidth:0,
            Zindex:ThisControlPanelObj.zIndex()  //2014-02-18 coke 所有控件的层级手动设置
        }
        Control_Pars.Width = Control_ParentPars.Width - Control_Pars.Left - Control_Pars.Right;
        Control_Pars.Height = Control_ParentPars.Height - Control_Pars.Top - Control_Pars.Bottom;
        $("#BasicProPanel_Width").val(Control_Pars.Width);
        $("#BasicProPanel_Height").val(Control_Pars.Height);
        $("#BasicProPanel_Left").val(Control_Pars.Left);
        $("#BasicProPanel_Top").val(Control_Pars.Top);
        //2014-02-18 coke 所有控件的层级手动设置
       $("#BasicProPanel_Zindex").val(Control_Pars.Zindex);
        Control_Position = Control_ParentObj = Control_ParentPars = Control_Pars = null;
    }
}, true);
function BasickpropertyChange() {
    var Control_Width = parseInt($("#BasicProPanel_Width").val());
    var Control_Height = parseInt($("#BasicProPanel_Height").val());
    var Control_Left = parseInt($("#BasicProPanel_Left").val());
    var Control_Top = parseInt($("#BasicProPanel_Top").val());
    var Control_Zindex = parseInt($("#BasicProPanel_Zindex").val());

    if (Control_Width >= 10 && Control_Height >= 10 && Control_Left >= 0 && Control_Top >= 0&&Control_Zindex>=1000) {
        var ControlID = Agi.Edit.workspace.currentControls[0].Get("HTMLElement").id;
        var ParentObj = $("#" + ControlID).parent();
        var ControlPars = { Left:Control_Left, Top:Control_Top, Right:(ParentObj.width() - Control_Width - Control_Left), Bottom:(ParentObj.height() - Control_Height - Control_Top),Zindex:Control_Zindex };
        Agi.Edit.workspace.currentControls[0].PostionChange(ControlPars);
        //2014-02-18 coke 所有控件的层级手动设置
        //debugger;

        var headControlID="";
        if(Agi.Edit.workspace.currentControls[0].shell==undefined)
        {
            //防止没有设置_Control.shell.BasicID的控件
            headControlID=Agi.Edit.workspace.currentControls[0].Get("HTMLElement").id;
        }else{
            headControlID=Agi.Edit.workspace.currentControls[0].shell.ID;
        }

        $("#"+headControlID).css('z-index',Control_Zindex);
    } else {
        if (Control_Width < 10) {
            $("#BasicProPanel_Width").val(10);
            BasickpropertyChange();
        }
        if (Control_Height < 10) {
            $("#BasicProPanel_Height").val(10);
            BasickpropertyChange();
        }
        if (Control_Left < 0) {
            $("#BasicProPanel_Left").val(0);
            BasickpropertyChange();
        }
        if (Control_Top < 0) {
            $("#BasicProPanel_Top").val(0);
            BasickpropertyChange();
        }
        //2014-02-18 coke 所有控件的层级手动设置
        if(Control_Zindex<1000)
        {
            $("#BasicProPanel_Zindex").val(1000);
            BasickpropertyChange();
        }
    }
    $(window).resize();
}
/*2.1.实例化属性控制面板*/
Agi.Controls.BasicPropertyPanel = new Agi.Controls.BasicPropertyPanelObj();

/*3.根据控件ID查找控件*/
Agi.Controls.FindControl = function (_ControlID) {
    var ControlObj = null;
    if (Agi.Edit.workspace.controlList) {
        var ControlsArray = Agi.Edit.workspace.controlList.toArray();
        if (ControlsArray != null && ControlsArray.length > 0) {
            for (var i = 0; i < ControlsArray.length; i++) {
                if (ControlsArray[i].Get("ProPerty").ID == _ControlID) {
                    ControlObj = ControlsArray[i];
                    break;
                }
            }
        }
    }
    return ControlObj;
}
/*4.根据控件容器ID查找控件*/
Agi.Controls.FindControlByPanel = function (_PanelID) {
    var ControlObj = null;
    var _ControlID = _PanelID;
    if (_PanelID.length > 6 && _PanelID.substring(0, 6) == "Panel_") {
        _ControlID = _PanelID.substring(6);
    }
    if (Agi.Edit.workspace.controlList) {
        var ControlsArray = Agi.Edit.workspace.controlList.toArray();
        if (ControlsArray != null && ControlsArray.length > 0) {
            for (var i = 0; i < ControlsArray.length; i++) {
                if (ControlsArray[i].Get("ProPerty").ID == _ControlID) {
                    ControlObj = ControlsArray[i];
                    break;
                }
            }
        }
    }
    return ControlObj;
}

/*5.控件自定义属性面板 （编辑控件时显示）*/
//导入Agi.Controls.Property 命名空间
Namespace.register("Agi.Controls.Property");
//属性子项 _ItemObj:对象，包含属性Title:标题，ContentObj：子项详情(属性项对应的属性值内容详情，Jquery HTML对象),DisabledValue:禁用、启用状态 :0:禁用,1:启用，2：不可禁用
Agi.Controls.Property.PropertyItem = function (_ItemObj) {
    var Me = this;
    Me.Title = _ItemObj.Title;
    Me.ContentObj = _ItemObj.ContentObj; //_contentObj:表示内容Jquery元素
    Me.IsOpen = false;
    Me.DisabledValue = _ItemObj.DisabledValue; //禁用状态值，0:禁用,1:启用，2：不可禁用
    Me.HTMLContent = null;
    Me.ChangeOpenState = function () {//打开,关闭 状态更改
        if (Me.IsOpen) {
            Me.IsOpen = false;
            this.HTMLContent.find(".ProtiyPanel_ItemHeadOpenSty").removeClass("ProtiyPanel_ItemHeadOpenSty").addClass("ProtiyPanel_ItemHeadCloseSty");
            this.HTMLContent.find(".ProtiyPanel_ItemOpenStateOpenSty").removeClass("ProtiyPanel_ItemOpenStateOpenSty").addClass("ProtiyPanel_ItemOpenStateCloseSty");
            this.HTMLContent.find(".ProtiyPanel_ItemTitleOpenSty").removeClass("ProtiyPanel_ItemTitleOpenSty").addClass("ProtiyPanel_ItemTitleCloseSty");
            this.HTMLContent.find(".ProtiyPanel_ItemContentOpenSty").removeClass("ProtiyPanel_ItemContentOpenSty").addClass("ProtiyPanel_ItemContentCloseSty");
        } else {
            Me.IsOpen = true;
            this.HTMLContent.find(".ProtiyPanel_ItemHeadCloseSty").removeClass("ProtiyPanel_ItemHeadCloseSty").addClass("ProtiyPanel_ItemHeadOpenSty");
            this.HTMLContent.find(".ProtiyPanel_ItemOpenStateCloseSty").removeClass("ProtiyPanel_ItemOpenStateCloseSty").addClass("ProtiyPanel_ItemOpenStateOpenSty");
            this.HTMLContent.find(".ProtiyPanel_ItemTitleCloseSty").removeClass("ProtiyPanel_ItemTitleCloseSty").addClass("ProtiyPanel_ItemTitleOpenSty");
            this.HTMLContent.find(".ProtiyPanel_ItemContentCloseSty").removeClass("ProtiyPanel_ItemContentCloseSty").addClass("ProtiyPanel_ItemContentOpenSty");
            Agi.Controls.Property.PropertyPanelControl.OpenItem(Me);
        }
    };
    Me.Close = function () {
        Me.IsOpen = false;
        if (this.HTMLContent.find(".ProtiyPanel_ItemHeadOpenSty").length > 0) {
            this.HTMLContent.find(".ProtiyPanel_ItemHeadOpenSty").removeClass("ProtiyPanel_ItemHeadOpenSty").addClass("ProtiyPanel_ItemHeadCloseSty");
            this.HTMLContent.find(".ProtiyPanel_ItemOpenStateOpenSty").removeClass("ProtiyPanel_ItemOpenStateOpenSty").addClass("ProtiyPanel_ItemOpenStateCloseSty");
            this.HTMLContent.find(".ProtiyPanel_ItemTitleOpenSty").removeClass("ProtiyPanel_ItemTitleOpenSty").addClass("ProtiyPanel_ItemTitleCloseSty");
            this.HTMLContent.find(".ProtiyPanel_ItemContentOpenSty").removeClass("ProtiyPanel_ItemContentOpenSty").addClass("ProtiyPanel_ItemContentCloseSty");
        }
    };
    Me.DisabledChange = function () { //禁用状态更改
        if (Me.DisabledValue == 0) {
            Me.DisabledValue = 1;
            this.HTMLContent.find(".ProtiyPanel_ItemDisabled0Sty").removeClass("ProtiyPanel_ItemDisabled0Sty").addClass("ProtiyPanel_ItemDisabled1Sty");
            Agi.Controls.Property.PropertyPanelControl.DisabledChanged(Me);
        } else {
            Me.DisabledValue = 0;
            this.HTMLContent.find(".ProtiyPanel_ItemDisabled1Sty").removeClass("ProtiyPanel_ItemDisabled1Sty").addClass("ProtiyPanel_ItemDisabled0Sty");
            Agi.Controls.Property.PropertyPanelControl.DisabledChanged(Me);
        }
    }
    Me.Init = function () {
        var htmlcontent = "<div class='ProtiyPanel_ItemSty'><div class='ProtiyPanel_ItemHeadCloseSty'><div class='ProtiyPanel_ItemOpenStateCloseSty'></div><div class='ProtiyPanel_ItemTitleCloseSty'>" + this.Title + "</div>" +
            "<div class='ProtiyPanel_ItemDisabled1Sty'></div></div><div class='ProtiyPanel_ItemContentCloseSty'></div></div>";
        this.HTMLContent = $(htmlcontent);
        this.HTMLContent.find(".ProtiyPanel_ItemContentCloseSty").append(Me.ContentObj);

        if (this.DisabledValue == 0) {
            this.HTMLContent.find(".ProtiyPanel_ItemDisabled1Sty").removeClass("ProtiyPanel_ItemDisabled1Sty").addClass("ProtiyPanel_ItemDisabled0Sty");
            this.HTMLContent.find(".ProtiyPanel_ItemDisabled0Sty").click(function () {
                //Me.DisabledChange();
            });
        } else if (this.DisabledValue == 2) {
            this.HTMLContent.find(".ProtiyPanel_ItemDisabled1Sty").removeClass("ProtiyPanel_ItemDisabled1Sty").addClass("ProtiyPanel_ItemDisabled2Sty");
        } else {
            this.HTMLContent.find(".ProtiyPanel_ItemDisabled1Sty").click(function () {
                //Me.DisabledChange();
            });
        }
        this.HTMLContent.find(".ProtiyPanel_ItemOpenStateCloseSty").click(function () {
            Me.ChangeOpenState();
        });
    }
    Me.Init(); //初始化
}
//属性面板 _targetElement:属性面板显示到的目标区域，_subitems:子控件列表
Agi.Controls.Property.PropertyPanel = function () {
    var Me = this;
    Me.PanelhtmlElement = $("<div class='ProtiyPanel_ContentSty'></div>");
    Me.TargetElement = null;
    Me.Init = function (_targetElement) {
        if (_targetElement != null) {
            if (typeof (_targetElement) == "string") {
                Me.TargetElement = $("#" + _targetElement);
            } else {
                Me.TargetElement = $(_targetElement);
            }
            Me.PanelhtmlElement.appendTo(Me.TargetElement);
        }
    }
    Me.SubItems = [];
    Me.InitPanel = function (_items) {
        Me.PanelhtmlElement.html("");
        if (_items != null && _items.length > 0) {
            Me.SubItems = _items;
            for (var i = 0; i < _items.length; i++) {
                _items[i].HTMLContent.appendTo(Me.PanelhtmlElement);
            }
            Me.SubItems[0].ChangeOpenState();
        }
    };
    /**
     * 实时增加一个属性项add by liuxing
     * @param _item 要增加的属性项
     * @param doOpen 增加后是否打开
     */
    Me.AddItem=function(_item,doOpen){
    	Me.SubItems.push(_item);
    	_item.HTMLContent.appendTo(Me.PanelhtmlElement);
    	if(doOpen){
    		Me.SubItems[Me.SubItems.length-1].ChangeOpenState();
    	}
    };
    Me.RemoveItem=function(_item){
    	_item.HTMLContent.remove();
    }
    Me.OpenItem = function (_item) {
        if (Me.SubItems != null && Me.SubItems.length > 0) {
            for (var i = 0; i < Me.SubItems.length; i++) {
                if (Me.SubItems[i] == _item) {
                } else {
                    Me.SubItems[i].Close();
                }
            }
        }
    };
    Me.Destory = function () {
        Me.PanelhtmlElement.html("");
    }; //清空内容
    Me.DisabledChanged = function (_item) {
    };
}
//初始化面板，所有的控件共用一个面板，只是每个控件使用时使用InitPanel方法进行初始化 (main:属性面板显示到的容器)
Agi.Controls.Property.PropertyPanelControl = new Agi.Controls.Property.PropertyPanel();

/*6.根据皮肤获得相应的ChartOption信息 Auth:markeluo Date:20120921 Info:BasicChart 初始化时禁用Title 和Tooltips*/
Agi.Controls.GetChartOptionsByTheme = function (_theme) {
    var _chartOptions = {
        name:'grid',
        colors:['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        chart:{
            backgroundColor:'#ffffff',
            borderColor:'#000000',
            borderWidth:0,
            borderRadius:15,
            plotBackgroundColor:null,
            plotShadow:false,
            plotBorderWidth:0
        },
        legend:null,
        xAxis:{
            labels:{
                rotation:40, //坐标值显示的倾斜度
                align:'left',
                style:{
                    fontFamily:'arial,微软雅黑',
                    textAlign:'left'
                }
            }
        },
        yAxis:{
            title:{
                text:null
            }
        },
        plotOptions:{
            area:{
                lineWidth:1,
                marker:{
                    enabled:false,
                    states:{
                        hover:{
                            enabled:true,
                            radius:5
                        }
                    }
                },
                shadow:false,
                states:{
                    hover:{
                        lineWidth:1
                    }
                }
            },
            column:{
                lineWidth:0,
                borderColor:'',
                series:{
                    pointPadding:'1px'
                },
                marker:{
                    enabled:false,
                    states:{
                        hover:{
                            enabled:false,
                            lineWidth:0
                        }
                    }
                }
            },
            line:{
                marker:{
                    enabled:true,
                    states:{
                        hover:{
                            enabled:true,
                            radius:4
                        }
                    }
                }
            },
            bar:{
                lineWidth:0,
                borderColor:'',
                series:{
                    pointPadding:'1px'
                },
                marker:{
                    enabled:false,
                    states:{
                        hover:{
                            enabled:false,
                            lineWidth:0
                        }
                    }
                }
            },
            series:{
                states:{
                    hover:{
                        enabled:true
                    }
                }
            }
        },
        toolbar:null,
        navigation:null,
        rangeSelector:null,
        navigator:null,
        scrollbar:null,
        legendBackgroundColor:null,
        legendBackgroundColorSolid:null,
        dataLabelsColor:null,
        textColor:null,
        maskColor:null,
        title:null,
        tooltip:{
            formatter:null,
            enabled:false
        }
    }; //grid,默认皮肤
    if (_theme != null && _theme != "") {
        if (_theme == "darkblue") {
            _chartOptions = {
                name:'darkblue',
                colors:["#DDDF0D", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                chart:{
                    backgroundColor:{
                        linearGradient:[0, 0, 250, 500],
                        stops:[
                            [0, 'rgb(48, 48, 96)'],
                            [1, 'rgb(0, 0, 0)']
                        ]
                    },
                    borderColor:'#000000',
                    borderWidth:0,
                    className:'dark-container',
                    plotBackgroundColor:'rgba(255, 255, 255, .1)',
                    plotBorderColor:'#CCCCCC',
                    plotBorderWidth:1
                },
                xAxis:{
                    labels:{
                        rotation:40, //坐标值显示的倾斜度
                        align:'left',
                        style:{
                            color:'#A0A0A0'
                        }
                    },
                    gridLineColor:'#333333',
                    gridLineWidth:1,
                    lineColor:'#A0A0A0',
                    tickColor:'#A0A0A0',
                    title:{
                        style:{
                            color:'#CCC',
                            fontWeight:'bold',
                            fontSize:'12px',
                            fontFamily:'Trebuchet MS, Verdana, sans-serif'

                        }
                    }
                },
                yAxis:{
                    gridLineColor:'#333333',
                    labels:{
                        style:{
                            color:'#A0A0A0'
                        }
                    },
                    lineColor:'#A0A0A0',
                    minorTickInterval:null,
                    tickColor:'#A0A0A0',
                    tickWidth:1,
                    title:{
                        style:{
                            color:'#CCC',
                            fontWeight:'bold',
                            fontSize:'12px',
                            fontFamily:'Trebuchet MS, Verdana, sans-serif'
                        },
                        text:null
                    }
                },
                toolbar:{
                    itemStyle:{
                        color:'silver'
                    }
                },
                plotOptions:{
                    line:{
                        dataLabels:{
                            color:'#CCC'
                        },
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    spline:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    scatter:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    candlestick:{
                        lineColor:'white'
                    },
                    series:{
                        states:{
                            hover:{
                                enabled:true
                            }
                        }
                    }
                },
                legend:{
                    itemStyle:{
                        font:'9pt Trebuchet MS, Verdana, sans-serif',
                        color:'#A0A0A0'
                    },
                    itemHoverStyle:{
                        color:'#FFF'
                    },
                    itemHiddenStyle:{
                        color:'#444'
                    }
                },
                credits:{
                    style:{
                        color:'#666'
                    }
                },
                labels:{
                    style:{
                        color:'#CCC'
                    }
                },
                navigation:{
                    buttonOptions:{
                        backgroundColor:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#606060'],
                                [0.6, '#333333']
                            ]
                        },
                        borderColor:'#000000',
                        symbolStroke:'#C0C0C0',
                        hoverSymbolStroke:'#FFFFFF'
                    }
                },
                // scroll charts
                rangeSelector:{
                    buttonTheme:{
                        fill:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#888'],
                                [0.6, '#555']
                            ]
                        },
                        stroke:'#000000',
                        style:{
                            color:'#CCC',
                            fontWeight:'bold'
                        },
                        states:{
                            hover:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.4, '#BBB'],
                                        [0.6, '#888']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'white'
                                }
                            },
                            select:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.1, '#000'],
                                        [0.3, '#333']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'yellow'
                                }
                            }
                        }
                    },
                    inputStyle:{
                        backgroundColor:'#333',
                        color:'silver'
                    },
                    labelStyle:{
                        color:'silver'
                    }
                },
                navigator:{
                    handles:{
                        backgroundColor:'#666',
                        borderColor:'#AAA'
                    },
                    outlineColor:'#CCC',
                    maskFill:'rgba(16, 16, 16, 0.5)',
                    series:{
                        color:'#7798BF',
                        lineColor:'#A6C7ED'
                    }
                },
                scrollbar:{
                    barBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    barBorderColor:'#CCC',
                    buttonArrowColor:'#CCC',
                    buttonBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    buttonBorderColor:'#CCC',
                    rifleColor:'#FFF',
                    trackBackgroundColor:{
                        linearGradient:[0, 0, 0, 10],
                        stops:[
                            [0, '#000'],
                            [1, '#333']
                        ]
                    },
                    trackBorderColor:'#666'
                },
                // special colors for some of the
                legendBackgroundColor:'rgba(0, 0, 0, 0.5)',
                legendBackgroundColorSolid:'rgb(35, 35, 70)',
                dataLabelsColor:'#444',
                textColor:'#C0C0C0',
                maskColor:'rgba(255,255,255,0.3)',
                title:null,
                tooltip:{
                    formatter:null,
                    enabled:false
                }
            };
        }
        else if (_theme == "darkgreen") {
            _chartOptions = {
                name:'darkgreen',
                colors:["#DDDF0D", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
                    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                chart:{
                    backgroundColor:{
                        linearGradient:[0, 0, 250, 500],
                        stops:[
                            [0, 'rgb(48, 96, 48)'],
                            [1, 'rgb(0, 0, 0)']
                        ]
                    },
                    borderColor:'#000000',
                    borderWidth:0,
                    className:'dark-container',
                    plotBackgroundColor:'rgba(255, 255, 255, .1)',
                    plotBorderColor:'#CCCCCC',
                    plotBorderWidth:1
                },
                xAxis:{
                    labels:{
                        rotation:40, //坐标值显示的倾斜度
                        align:'left',
                        style:{
                            color:'#A0A0A0'
                        }
                    },
                    gridLineColor:'#333333',
                    gridLineWidth:1,
                    lineColor:'#A0A0A0',
                    tickColor:'#A0A0A0',
                    title:{
                        style:{
                            color:'#CCC',
                            fontWeight:'bold',
                            fontSize:'12px',
                            fontFamily:'Trebuchet MS, Verdana, sans-serif'

                        }
                    }
                },
                yAxis:{
                    gridLineColor:'#333333',
                    labels:{
                        style:{
                            color:'#A0A0A0'
                        }
                    },
                    lineColor:'#A0A0A0',
                    minorTickInterval:null,
                    tickColor:'#A0A0A0',
                    tickWidth:1,
                    title:{
                        style:{
                            color:'#CCC',
                            fontWeight:'bold',
                            fontSize:'12px',
                            fontFamily:'Trebuchet MS, Verdana, sans-serif'
                        },
                        text:null
                    }
                },
                toolbar:{
                    itemStyle:{
                        color:'silver'
                    }
                },
                plotOptions:{
                    line:{
                        dataLabels:{
                            color:'#CCC'
                        },
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    spline:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    scatter:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    candlestick:{
                        lineColor:'white'
                    },
                    series:{
                        states:{
                            hover:{
                                enabled:true
                            }
                        }
                    }
                },
                legend:{
                    itemStyle:{
                        font:'9pt Trebuchet MS, Verdana, sans-serif',
                        color:'#A0A0A0'
                    },
                    itemHoverStyle:{
                        color:'#FFF'
                    },
                    itemHiddenStyle:{
                        color:'#444'
                    }
                },
                credits:{
                    style:{
                        color:'#666'
                    }
                },
                navigation:{
                    buttonOptions:{
                        backgroundColor:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#606060'],
                                [0.6, '#333333']
                            ]
                        },
                        borderColor:'#000000',
                        symbolStroke:'#C0C0C0',
                        hoverSymbolStroke:'#FFFFFF'
                    }
                },
                // scroll charts
                rangeSelector:{
                    buttonTheme:{
                        fill:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#888'],
                                [0.6, '#555']
                            ]
                        },
                        stroke:'#000000',
                        style:{
                            color:'#CCC',
                            fontWeight:'bold'
                        },
                        states:{
                            hover:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.4, '#BBB'],
                                        [0.6, '#888']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'white'
                                }
                            },
                            select:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.1, '#000'],
                                        [0.3, '#333']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'yellow'
                                }
                            }
                        }
                    },
                    inputStyle:{
                        backgroundColor:'#333',
                        color:'silver'
                    },
                    labelStyle:{
                        color:'silver'
                    }
                },
                navigator:{
                    handles:{
                        backgroundColor:'#666',
                        borderColor:'#AAA'
                    },
                    outlineColor:'#CCC',
                    maskFill:'rgba(16, 16, 16, 0.5)',
                    series:{
                        color:'#7798BF',
                        lineColor:'#A6C7ED'
                    }
                },
                scrollbar:{
                    barBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    barBorderColor:'#CCC',
                    buttonArrowColor:'#CCC',
                    buttonBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    buttonBorderColor:'#CCC',
                    rifleColor:'#FFF',
                    trackBackgroundColor:{
                        linearGradient:[0, 0, 0, 10],
                        stops:[
                            [0, '#000'],
                            [1, '#333']
                        ]
                    },
                    trackBorderColor:'#666'
                },
                // special colors for some of the
                legendBackgroundColor:'rgba(0, 0, 0, 0.5)',
                legendBackgroundColorSolid:'rgb(35, 35, 70)',
                dataLabelsColor:'#444',
                textColor:'#C0C0C0',
                maskColor:'rgba(255,255,255,0.3)',
                title:null,
                tooltip:{
                    formatter:null,
                    enabled:false
                }
            };
        } else if (_theme == "gray") {
            _chartOptions = {
                name:'gray',
                colors:["#DDDF0D", "#7798BF", "#55BF3B", "#DF5353", "#aaeeee", "#ff0066", "#eeaaee",
                    "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                chart:{
                    backgroundColor:{
                        linearGradient:[0, 0, 0, 400],
                        stops:[
                            [0, 'rgb(96, 96, 96)'],
                            [1, 'rgb(16, 16, 16)']
                        ]
                    },
                    borderColor:'#000000',
                    borderWidth:0,
                    borderRadius:15,
                    plotBackgroundColor:null,
                    plotShadow:false,
                    plotBorderWidth:0
                },
                xAxis:{
                    labels:{
                        rotation:40, //坐标值显示的倾斜度
                        align:'left',
                        style:{
                            color:'#999',
                            fontWeight:'bold'
                        }
                    },
                    gridLineWidth:0,
                    lineColor:'#999',
                    tickColor:'#999',
                    title:{
                        style:{
                            color:'#AAA',
                            font:'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                },
                yAxis:{
                    alternateGridColor:null,
                    minorTickInterval:null,
                    gridLineColor:'rgba(255, 255, 255, .1)',
                    lineWidth:0,
                    tickWidth:0,
                    labels:{
                        style:{
                            color:'#999',
                            fontWeight:'bold'
                        }
                    },
                    title:{
                        style:{
                            color:'#AAA',
                            font:'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        },
                        text:null
                    }
                },
                legend:{
                    itemStyle:{
                        color:'#CCC'
                    },
                    itemHoverStyle:{
                        color:'#FFF'
                    },
                    itemHiddenStyle:{
                        color:'#333'
                    }
                },
                labels:{
                    style:{
                        color:'#CCC'
                    }
                },
                plotOptions:{
                    line:{
                        dataLabels:{
                            color:'#CCC'
                        },
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    spline:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    scatter:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    candlestick:{
                        lineColor:'white'
                    },
                    series:{
                        states:{
                            hover:{
                                enabled:true
                            }
                        }
                    }
                },
                toolbar:{
                    itemStyle:{
                        color:'#CCC'
                    }
                },
                navigation:{
                    buttonOptions:{
                        backgroundColor:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#606060'],
                                [0.6, '#333333']
                            ]
                        },
                        borderColor:'#000000',
                        symbolStroke:'#C0C0C0',
                        hoverSymbolStroke:'#FFFFFF'
                    }
                },
                // scroll charts
                rangeSelector:{
                    buttonTheme:{
                        fill:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#888'],
                                [0.6, '#555']
                            ]
                        },
                        stroke:'#000000',
                        style:{
                            color:'#CCC',
                            fontWeight:'bold'
                        },
                        states:{
                            hover:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.4, '#BBB'],
                                        [0.6, '#888']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'white'
                                }
                            },
                            select:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.1, '#000'],
                                        [0.3, '#333']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'yellow'
                                }
                            }
                        }
                    },
                    inputStyle:{
                        backgroundColor:'#333',
                        color:'silver'
                    },
                    labelStyle:{
                        color:'silver'
                    }
                },
                navigator:{
                    handles:{
                        backgroundColor:'#666',
                        borderColor:'#AAA'
                    },
                    outlineColor:'#CCC',
                    maskFill:'rgba(16, 16, 16, 0.5)',
                    series:{
                        color:'#7798BF',
                        lineColor:'#A6C7ED'
                    }
                },
                scrollbar:{
                    barBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    barBorderColor:'#CCC',
                    buttonArrowColor:'#CCC',
                    buttonBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    buttonBorderColor:'#CCC',
                    rifleColor:'#FFF',
                    trackBackgroundColor:{
                        linearGradient:[0, 0, 0, 10],
                        stops:[
                            [0, '#000'],
                            [1, '#333']
                        ]
                    },
                    trackBorderColor:'#666'
                },
                // special colors for some of the demo examples
                legendBackgroundColor:'rgba(48, 48, 48, 0.8)',
                legendBackgroundColorSolid:'rgb(70, 70, 70)',
                dataLabelsColor:'#444',
                textColor:'#E0E0E0',
                maskColor:'rgba(255,255,255,0.3)',
                title:null,
                tooltip:{
                    formatter:null,
                    enabled:false
                }
            };
        } else if (_theme == "darkbrown") {
            _chartOptions = {
                name:'darkbrown',
                colors:["#058dc7", "#d19004", "#4dbc03", "#d10202", "#06c9c9", "#d104ae", "#c3c603",
                    "#fcca6c", "#08c95f", "#4206ce", "#f7763b"],
                chart:{
                    backgroundColor:{
                        linearGradient:{
                            x1:0,
                            y1:0,
                            x2:0,
                            y2:1
                        },
                        stops:[
                            [0, '#ededed'],
                            [1, '#cbcbcb']
                        ]
                    },
                    borderColor:'#a7a7a7',
                    borderWidth:0,
                    borderRadius:15,
                    plotBackgroundColor:null,
                    plotBorderWidth:0
                },
                xAxis:{
                    labels:{
                        rotation:40, //坐标值显示的倾斜度
                        align:'left',
                        style:{
                            color:'#000000',
                            fontFamily:'微软雅黑',
                            fontWeight:'Normal',
                            fontSize:'11'
                        }
                    },
                    gridLineWidth:0,
                    lineColor:'#737272',
                    lineWidth:3,
                    tickWidth:0,
                    tickColor:'#737272',
                    title:{
                        style:{
                            color:'#AAA',
                            font:'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                },
                yAxis:{
                    alternateGridColor:null,
                    minorTickInterval:null,
                    lineColor:'#737272',
                    gridLineColor:'#737272',
                    gridLineWidth:0,
                    lineWidth:3,
                    tickWidth:2,
                    labels:{
                        style:{
                            color:'#000000',
                            fontFamily:'微软雅黑',
                            fontWeight:'Normal',
                            fontSize:'11'
                        }
                    },
                    title:{
                        style:{
                            color:'#ffffff',
                            font:'bold 12px 微软雅黑,Arial,黑体'
                        },
                        text:""
                    }
                },
                legend:{
                    itemStyle:{
                        color:'#CCC'
                    },
                    itemHoverStyle:{
                        color:'#FFF'
                    },
                    itemHiddenStyle:{
                        color:'#333'
                    }
                },
                labels:{
                    style:{
                        color:'#CCC'
                    }
                },
                plotOptions:{
                    line:{
                        dataLabels:{
                            color:'#CCC'
                        },
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    spline:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    scatter:{
                        marker:{
                            lineColor:'#333'
                        }
                    },
                    candlestick:{
                        lineColor:'white'
                    },
                    series:{
                        states:{
                            hover:{
                                enabled:true
                            }
                        }
                    }
                },
                toolbar:{
                    itemStyle:{
                        color:'#CCC'
                    }
                },
                navigation:{
                    buttonOptions:{
                        backgroundColor:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#606060'],
                                [0.6, '#333333']
                            ]
                        },
                        borderColor:'#000000',
                        symbolStroke:'#C0C0C0',
                        hoverSymbolStroke:'#FFFFFF'
                    }
                },
                // scroll charts
                rangeSelector:{
                    buttonTheme:{
                        fill:{
                            linearGradient:[0, 0, 0, 20],
                            stops:[
                                [0.4, '#888'],
                                [0.6, '#555']
                            ]
                        },
                        stroke:'#000000',
                        style:{
                            color:'#CCC',
                            fontWeight:'bold'
                        },
                        states:{
                            hover:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.4, '#BBB'],
                                        [0.6, '#888']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'white'
                                }
                            },
                            select:{
                                fill:{
                                    linearGradient:[0, 0, 0, 20],
                                    stops:[
                                        [0.1, '#000'],
                                        [0.3, '#333']
                                    ]
                                },
                                stroke:'#000000',
                                style:{
                                    color:'yellow'
                                }
                            }
                        }
                    },
                    inputStyle:{
                        backgroundColor:'#333',
                        color:'silver'
                    },
                    labelStyle:{
                        color:'silver'
                    }
                },
                navigator:{
                    handles:{
                        backgroundColor:'#666',
                        borderColor:'#AAA'
                    },
                    outlineColor:'#CCC',
                    maskFill:'rgba(16, 16, 16, 0.5)',
                    series:{
                        color:'#7798BF',
                        lineColor:'#A6C7ED'
                    }
                },
                scrollbar:{
                    barBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    barBorderColor:'#CCC',
                    buttonArrowColor:'#CCC',
                    buttonBackgroundColor:{
                        linearGradient:[0, 0, 0, 20],
                        stops:[
                            [0.4, '#888'],
                            [0.6, '#555']
                        ]
                    },
                    buttonBorderColor:'#CCC',
                    rifleColor:'#FFF',
                    trackBackgroundColor:{
                        linearGradient:[0, 0, 0, 10],
                        stops:[
                            [0, '#000'],
                            [1, '#333']
                        ]
                    },
                    trackBorderColor:'#666'
                },
                // special colors for some of the demo examples
                legendBackgroundColor:'rgba(48, 48, 48, 0.8)',
                legendBackgroundColorSolid:'rgb(70, 70, 70)',
                dataLabelsColor:'#444',
                textColor:'#E0E0E0',
                maskColor:'rgba(255,255,255,0.3)',
                title:{"align":"center", "floating":false, "text":" ", "verticalAlign":null, "style":{"fontFamily":"微软雅黑", "fontWeight":"bold", "color":"#000", "fontSize":"14px"}},
                tooltip:{
                    formatter:null,
                    enabled:false
                }
            };
        }
    }
    return _chartOptions;
}

/*7.图表控件，初始化值获取*/
Agi.Controls.GetChartInitData = function () {
    var ThisDay = new Date();
    var ThisData = [];
    for (i = 0; i < 10; i++) {
        ThisData.push([new Date(ThisDay.valueOf() + (i * 86400000)).format("yyyy/MM/dd"), Agi.Script.GetRandomValue(10, 95)]);
    }
    return ThisData;
}
Agi.Controls.GetChartInitXTimeData = function () {
    var ThisDay = new Date();
    var ThisData = [];
    for (i = 0; i < 10; i++) {
        ThisData.push([Date.parse(new Date(ThisDay.valueOf() + (i * 86400000))), Agi.Script.GetRandomValue(10, 95)]);
    }
    return ThisData;
}
/*8.图表控件，基准线颜色数组*/
Agi.Controls.ChartLineColors = ["#3253fd", "#f9222c", "#3fff35", "#fd1de0", "#fbdf26", "#26fbdf", "#63c404", "#0f5376"];
/*蓝,红,绿,紫,黄,碧绿,鹅黄,蓝黑*/

/*9.Chart 数据类型转换*/
/*Json数组转换为多维数组*/
Agi.Controls.ChartDataJsonConvertToArray = function (_JsonArray) {
    var ReturnArray = [];
    if (_JsonArray != null && _JsonArray.length > 0) {
        var ItemArray = null;
        for (var i = 0; i < _JsonArray.length; i++) {
            ItemArray = [];
            for (var item in _JsonArray[i]) {
                ItemArray.push(_JsonArray[i][item]);
            }
            ReturnArray.push(ItemArray);
        }
        ItemArray = null;
    }
    return ReturnArray;
}
Agi.Controls.EntityDataConvertToArrayByColumns = function (_Entity, _columns) {
    var ReturnArray = [];
    if (_Entity != null && _Entity.Data.length > 0 && _columns != null) {
        var ItemArray = null;
        for (var i = 0; i < _Entity.Data.length; i++) {
            ItemArray = [];
            for (var j = 0; j < _columns.length; j++) {
                ItemArray.push(_Entity.Data[i][_columns[j]]);
            }
            ReturnArray.push(ItemArray);
        }
        ItemArray = null;
    }
    return ReturnArray;
}
/*将Chart相应数组数据转换为符合图表格式数据*/
Agi.Controls.ChartDataConvert = function (_ChartXAxisArray, _DataArrary) {
    var ThisData = [];
    if (_DataArrary != null && _DataArrary.length > 0) {
        for (var i = 0; i < _DataArrary.length; i++) {
            if (typeof (_DataArrary[i][0]) == "number") {
                _DataArrary[i][0] = _DataArrary[i][0] + "";
            }
            if (!isNaN(_DataArrary[i][1])) {//为数字时
                _DataArrary[i][1] = eval(_DataArrary[i][1]);
            } else {//如果Y轴值不是数字类型则将其赋值为0
                _DataArrary[i][1] = 0;
            }
            ThisData.push({ name:_DataArrary[i][0], x:i, y:_DataArrary[i][1] });
        }
        Agi.Controls.ChartAddSeriesUpXAxis(_ChartXAxisArray, ThisData);
    }
    return ThisData;
}

Agi.Controls.ChartAddSeriesUpXAxis = function (_ChartXAxisArray, _SeriesData) {
    if (_SeriesData != null && _SeriesData.length > 0) {
        for (var i = 0; i < _SeriesData.length; i++) {
            var ThisSeriesIndex = Agi.Controls.ChartXAxisPointIndex(_ChartXAxisArray, _SeriesData[i].name);
            if (ThisSeriesIndex > -1) {
                _SeriesData[i].x = ThisSeriesIndex;
            } else {
                _ChartXAxisArray.push(_SeriesData[i].name);
                _SeriesData[i].x = _ChartXAxisArray.length - 1;
            }
        }
    }
}
/*Chart 获取XAxis 的索引*/
Agi.Controls.ChartXAxisPointIndex = function (_ChartXAxisArray, _ItemValue) {
    if (_ChartXAxisArray != null && _ChartXAxisArray.length > 0) {
        for (var i = 0; i < _ChartXAxisArray.length; i++) {
            if (_ChartXAxisArray[i] === _ItemValue) {
                return i;
            }
        }
    }
    return -1;
}

/*10._control 控件对象---------------------------------------------*/
Agi.Controls.IsControlEdit = false; //是否为编辑状态
Agi.Controls.EditControlElementID = null; //编辑控件的外壳ID
Agi.Controls.EditControlZindex = 0;
Agi.Controls.ControlEdit = function (_control) {
    /*检查控件锁定*/
    if (_control.isLock) {
        AgiCommonDialogBox.Alert("请先解锁控件！");
        return;
    }
    $("#BottomRightDiv").hide();
    $("#SelectAspectRatioDiv").hide(); //百分比
    $("#ChangePageSizeDiv").hide(); //分倍率
    $("#ChangeBackGroundDiv").hide(); //背景色
    $("#ChangeGridlinesDiv").hide(); //网格线
    var Me = this;
    Agi.Controls.IsControlEdit = true; //编辑
    var ThisPositionValue = Agi.Script.CloneObj(_control.Get("Position"));
    var OldPosition = { Left:parseFloat(ThisPositionValue.Left), Right:parseFloat(ThisPositionValue.Right), Top:parseFloat(ThisPositionValue.Top), Bottom:parseFloat(ThisPositionValue.Bottom) };
    Agi.Controls.EditControlElementID = _control.Get("HTMLElement").id;
    Agi.Controls.EditControlZindex = parseInt($("#" + Agi.Controls.EditControlElementID).css("z-index")); //当前编辑控件的Zindex
    $("#" + Agi.Controls.EditControlElementID).css("z-index", 0);
    var ParentOjbID = $("#" + Agi.Controls.EditControlElementID).parent()[0].id;
    if ($("#ControlEditPage").length > 0) {
        $("#ControlEditPage").show();
    } else {
        var editpageHTML = new Agi.Script.StringBuilder();
        editpageHTML.append("<div id='ControlEditPage' class='ControlEditPageSty' >");
        editpageHTML.append("<div class='theme-Righttitle theme-title'><a id='ControlEditPageGoBak' href='#'><img src='JS/Controls/img/reduce.png'>返回整体页面</a></div>");
        editpageHTML.append("<div class='ControlEditContentSty'>");
        editpageHTML.append("<div class='EditContentTopSty'>");
        editpageHTML.append("<div id='ControlEditPageLeft' class='EditContentTopLeftSty'></div>");
        editpageHTML.append("<div id='ControlEditPageCustomProPanel' class='EditContentTopRightSty'></div>");
        editpageHTML.append("<div class='EditContentTopProPanelbtnSty'></div>");
        editpageHTML.append("</div>");
        editpageHTML.append("<div id='ControlEditPageDataGrid' class='EditContentBottomSty'></div>");
        editpageHTML.append("</div>");
        editpageHTML.append("</div>");
        var editpage = $(editpageHTML.toString());
        $("#MainBottomDiv").append(editpage);

        var RightPanel = $(editpage.find(".EditContentTopRightSty")[0]);
        RightPanel.height($(".ControlEditContentSty").height() - $(".EditContentBottomSty").height() - 7);
        var ControlEditProPanelBtn = $(editpage.find(".EditContentTopProPanelbtnSty")[0]);
        var LeftValue = (RightPanel.offset().left - ControlEditProPanelBtn.width() + 2) + "px";
        var TopValue = (RightPanel.offset().top + 50) + "px";
        ControlEditProPanelBtn.css({ "left":LeftValue, "top":TopValue });
        /*属性面板展开、收缩*/
        ControlEditProPanelBtn.click(function (ev) {
            if (RightPanel.is(":hidden")) {
                RightPanel.show();
                LeftValue = (RightPanel.offset().left - ControlEditProPanelBtn.width() + 2) + "px";
                ControlEditProPanelBtn.css({ "left":LeftValue, "top":TopValue });
                /*auth:markeluo Date:20120920 Info:控件进入编辑界面后，展开/收缩属性面板，控件自适应大小*/
                var ThisControl = Agi.Controls.FindControlByPanel(Agi.Controls.EditControlElementID);
                var ControlType=ThisControl.Get("ControlType");
                if(ControlType!="Panel" && ControlType!="InquireButton" && ControlType!="DropDownList" && ControlType!="MultiSelect" &&
                    ControlType!="Label" && ControlType!="RadioButton" && ControlType!="CheckBox"&&  ControlType!="RealTimeLable"&&  ControlType!="KPIMenu"&&
                    ControlType!="DatePicker" && ControlType!="TimeSelector" && ControlType!="TimePicker" && ControlType!="SpcDemoPCLabel" &&
                    ControlType!="AssociativeInputBox"){
                    if (ThisControl.HTMLElementSizeChanged) {
                        ThisControl.HTMLElementSizeChanged();
                    }
                }
                /*---------------------end*/
            } else {
                RightPanel.hide();
                var ControlEditProLeft = $(editpage.find(".EditContentTopLeftSty")[0]);
                LeftValue = (ControlEditProLeft.offset().left + ControlEditProLeft.width() - ControlEditProPanelBtn.width() + 2) + "px";
                ControlEditProPanelBtn.css({ "left":LeftValue, "top":TopValue });
                /*auth:markeluo Date:20120920 Info:控件进入编辑界面后，展开/收缩属性面板，控件自适应大小*/
                var ThisControl = Agi.Controls.FindControlByPanel(Agi.Controls.EditControlElementID);
                var ControlType=ThisControl.Get("ControlType");
                if(ControlType!="Panel" && ControlType!="InquireButton" && ControlType!="DropDownList" && ControlType!="MultiSelect" &&
                    ControlType!="Label" && ControlType!="RadioButton" && ControlType!="CheckBox"&&  ControlType!="RealTimeLable"&&  ControlType!="KPIMenu"&&
                    ControlType!="DatePicker" && ControlType!="TimeSelector" && ControlType!="TimePicker" && ControlType!="SpcDemoPCLabel" &&
                    ControlType!="AssociativeInputBox"){
                    if (ThisControl.HTMLElementSizeChanged) {
                        ThisControl.HTMLElementSizeChanged();
                    }
                }
                /*---------------------end*/
            }
        });
        /*返回编辑主界面*/
        $("#ControlEditPageGoBak").click(function (ev) {
            Me.EditPageGoBack();
        });
        editpageHTML = null;
    }

    Me.EditPageGoBack = function () {
        if (this.IsPageView) return;
        $("#" + Agi.Controls.EditControlElementID).css("z-index", Agi.Controls.EditControlZindex);
        $("#" + Agi.Controls.EditControlElementID).appendTo($("#" + ParentOjbID));
        _control.Set("HTMLElement", $("#" + Agi.Controls.EditControlElementID)[0]);
        //        $("#"+Agi.Controls.EditControlElementID).resizable({ disabled: false });
        //        $("#"+Agi.Controls.EditControlElementID).draggable({ disabled: false });
        $("#" + Agi.Controls.EditControlElementID).addClass("PanelSty");
        Agi.Controls.IsControlEdit = false;
        $("#ControlEditPageMask").remove();
        if (_control.ExtEdit) { //罗万里,20120914 新增，通知控件退出编辑
            _control.ExtEdit();
        }
        Agi.Controls.EditChangedMenuManager(true); //显示顶部的菜单按钮 markeluo 2012-12-10 9:15       
        $("#ControlEditPageLeft").html("");
        $("#ControlEditPage").hide();
        $("#BottomRightDiv").show();

        _control.Set("Position", OldPosition);

        if (_control.BackOldSize) {//gyh 2012/12/6
            _control.BackOldSize.call(_control);
        }
    }
    var ControlEditPageLeftPanel = $("#ControlEditPageLeft");
    //    $("#"+Agi.Controls.EditControlElementID).draggable({ disabled: true });
    //    $("#"+Agi.Controls.EditControlElementID).resizable({ disabled: true });
    $("#" + Agi.Controls.EditControlElementID).draggable("destroy");
    $("#" + Agi.Controls.EditControlElementID).resizable("destroy");
    $("#" + Agi.Controls.EditControlElementID).removeClass("PanelSty");

//    $("#" + Agi.Controls.EditControlElementID).css({ "left":"0px", "top":"0px", "opacity":1 });
    $("#" + Agi.Controls.EditControlElementID).css({ "left":"0px", "top":"0px"});
    if(_control.Get('ControlType') === 'Container'){
        var clone = _control.GetBlankClone();
        clone.appendTo(ControlEditPageLeftPanel);
        _control.editClone = clone;
    }else{
        $("#" + Agi.Controls.EditControlElementID).appendTo(ControlEditPageLeftPanel);
    }
    _control.Set("HTMLElement", $("#" + Agi.Controls.EditControlElementID)[0]);

    if (_control.EnterEditState) {
        _control.EnterEditState.call(_control);
    }
    if (_control.HTMLElementSizeChanged && !_control.EnterEditState) {
        var ControlType=_control.Get("ControlType");
        if(ControlType!="Panel" && ControlType!="InquireButton" && ControlType!="DropDownList" && ControlType!="MultiSelect" &&
            ControlType!="Label" && ControlType!="RadioButton" && ControlType!="CheckBox"&&  ControlType!="RealTimeLable"&&  ControlType!="KPIMenu"&&
            ControlType!="DatePicker" && ControlType!="TimeSelector" && ControlType!="TimePicker" && ControlType!="SpcDemoPCLabel"){
            $("#" + Agi.Controls.EditControlElementID).width(ControlEditPageLeftPanel.width());
            $("#" + Agi.Controls.EditControlElementID).height(ControlEditPageLeftPanel.height());
            _control.HTMLElementSizeChanged();
        }
    }
    Agi.Controls.Property.PropertyPanelControl.Init($("#ControlEditPageCustomProPanel"))
    if (_control.CustomProPanelShow) {
        Agi.Controls.Property.PropertyPanelControl.Destory(); //清空
        _control.CustomProPanelShow(); //显示控件的自定义属性面板
    }
    Agi.Controls.ShowControlData(_control); //显示控件
    Agi.Controls.EditChangedMenuManager(false); //隐藏顶部的菜单按钮 markeluo 2012-12-10 9:15    
    if (_control.InEdit) { //20120914,罗万里 新增,通知控件进入编辑界面
        _control.InEdit();
    }
}
//控件编辑时，显示控件数据
Agi.Controls.EditControlSelEntityKey = null;
Agi.Controls.ShowControlData = function (_control) {
    var Me = this;
    var EntityTable = null;
    var Entitydata = _control.Get("Entity");
    Me.ShowEntityGrid = function (_KeyID) {
        if (Entitydata.length > 0) {
            Agi.Controls.EditControlSelEntityKey = _KeyID;
            var SelEntity = Agi.Controls.FindEntityByKey(Entitydata, Agi.Controls.EditControlSelEntityKey);
//            EntityTable = Agi.Controls.GetTableByEntityData(SelEntity);
//            if (EntityTable != null && EntityTable != "") {
//                if ($("#EditPageDatatabsGrid").length > 0) {
//                    $("#EditPageDatatabsGrid").html("");
//                }
//                EntityTable = $(EntityTable);
//                EntityTable.attr("id", "grid_" + _KeyID);
//                $("#EditPageDatatabsGrid").append(EntityTable);
//                EntityTable.flexigrid({
//                    height:145,
//                    width:'auto',
//                    resizable:false,
//                    CellDragEndCallBack:function (_ev) {
//                        Me.DrogCellCallbak(_ev);
//                    }
//                });
//            }
            $(EntityTable).remove();
            EntityTable = null;
            $("#EditPageDatatabsGrid").html("");
            EntityTable = $("<table id='grid_" + _KeyID + "' class='flexme2'></table>");
            $("#EditPageDatatabsGrid").append(EntityTable);

            var RowModels = Agi.Controls.GetTableRowModel(SelEntity);//行模板获取
            var RowDatas = Agi.Controls.GetTableContentRows(SelEntity);//DataSet/Entity 填充数据
            EntityTable.LWLflexigrid({
                dataType:'json',
                width:'auto',
                height:125,
                useRp:true,
                rp:10,
                page:1, //current page,默认当前页
                total:1, //total pages,总页面数
                usepager:true,
                showToggleBtn:false, //禁用列筛选
                colModel:RowModels,
                Datas:RowDatas,
                CellDragEndCallBack:function (_ev) {
                    Me.DrogCellCallbak(_ev);
                }
            });
        }
    }

    if (Agi.Controls.EntityIsExistData(Entitydata)) {
        var EditPageDataGrid = $("#ControlEditPageDataGrid");
        if (EditPageDataGrid.length > 0) {

            EditPageDataGrid.html("");
            var _TabsTitles = new Agi.Script.StringBuilder();
            _TabsTitles.append("<div class='EditControlEntityTabsRow theme-title'>");
            for (var i = 0; i < Entitydata.length; i++) {
                if (i == 0) {
                    _TabsTitles.append("<div id='Divtabs_" + Entitydata[i].Key + "' class='EditControlEntityTabsitemsty EditControlEntityTabsitemseledsty'>" + Entitydata[i].Key + "&nbsp;&nbsp;<img src='JS/Controls/BasicChart/img/ChartSeriesRemove2.png' class='EditControlEntityTabsitemImg'></div>");
                } else {
                    _TabsTitles.append("<div id='Divtabs_" + Entitydata[i].Key + "' class='EditControlEntityTabsitemsty'>" + Entitydata[i].Key + "&nbsp;&nbsp;<img src='JS/Controls/BasicChart/img/ChartSeriesRemove2.png' class='EditControlEntityTabsitemImg'></div>");
                }
            }
            _TabsTitles.append("<div style='clear: both;'></div>");
            _TabsTitles.append("</div><div id='EditPageDatatabsGrid' class='EditPageDatatabsGridsty'></div>")
            EditPageDataGrid.append($(_TabsTitles.toString()));
            $(".EditControlEntityTabsitemsty").unbind().bind("click", function (ev) {
                $(".EditControlEntityTabsitemsty").removeClass("EditControlEntityTabsitemseledsty");
                $(this).addClass("EditControlEntityTabsitemseledsty");
                Me.ShowEntityGrid(this.id.substring(8));
            });
            $(".EditControlEntityTabsitemImg").unbind().bind("click", function (ev) {
                Agi.Controls.RemoveEntity($(this).parent()[0].id.substring(8));
            });

            Me.ShowEntityGrid(Entitydata[0].Key);
        }
    } else {
        $("#ControlEditPageDataGrid").html("<div style='width: 100%;height: 100%;font-size: 14px;font-weight: bold;color:green;'>无可用实体数据!</div>");
    }
    Me.DrogCellCallbak = function (_evobj) {
        // _ev.TargetPosition.Left+"#"+_ev.CellIndex;
        var ControlPanel = $("#ControlEditPageLeft");
        var ControlPanelPositionValue = {
            Left:ControlPanel.offset().left,
            Top:ControlPanel.offset().top,
            Width:ControlPanel.width(),
            Height:ControlPanel.height()
        };
        if (_evobj.TargetPosition.Left >= ControlPanelPositionValue.Left && _evobj.TargetPosition.Left <= (ControlPanelPositionValue.Left + ControlPanelPositionValue.Width)
            && _evobj.TargetPosition.Top >= ControlPanelPositionValue.Top && _evobj.TargetPosition.Top <= (ControlPanelPositionValue.Top + ControlPanelPositionValue.Height)) {
            //拖拽处理
            if (_control.AddColumn) {
                var SelEntity = Agi.Controls.FindEntityByKey(Entitydata, Agi.Controls.EditControlSelEntityKey);
                if (SelEntity != null) {
                    _control.AddColumn(SelEntity, SelEntity.Columns[_evobj.CellIndex]);
                }
            }
        }
    }
}
//删除实体
Agi.Controls.RemoveEntity = function (_EntityKey) {
    var thiscontrol = Agi.Controls.FindControlByPanel(Agi.Controls.EditControlElementID); //当前编辑的控件对象
    //1.相应控件移除实体
    if (thiscontrol.RemoveEntity) {
        thiscontrol.RemoveEntity(_EntityKey);
    }
    //2.更新控件实体显示
    Agi.Controls.ShowControlData(thiscontrol);
}
Agi.Controls.FindEntityByKey = function (_Entitys, _entityKey) {
    if (_Entitys != null && _Entitys.length > 0 && _entityKey != null) {
        for (var i = 0; i < _Entitys.length; i++) {
            if (_Entitys[i].Key === _entityKey) {
                return _Entitys[i];
            }
        }
    }
    return null;
}

//根据实体数据获取Table内容
Agi.Controls.GetTableByEntityData = function (_EntityData) {
    if (_EntityData != null) {
        var Tablestr = new Agi.Script.StringBuilder();
        Tablestr.append("<table class='flexme2'>");
        if (_EntityData.Columns != null && _EntityData.Columns.length > 0) {
            Tablestr.append("<thead><tr>");
            for (var i = 0; i < _EntityData.Columns.length; i++) {
                Tablestr.append(" <th width='100'>" + _EntityData.Columns[i] + "</th>");
            }
            Tablestr.append("</tr></thead>");
        }
        if (_EntityData.Data != null && _EntityData.Data.length > 0) {
            Tablestr.append("<tbody>");
            for (var i = 0; i < _EntityData.Data.length; i++) {
                Tablestr.append("<tr>");
                for (var j = 0; j < _EntityData.Columns.length; j++) {
                    Tablestr.append("<td>" + _EntityData.Data[i][_EntityData.Columns[j]] + "</td>");
                }
                Tablestr.append("</tr>");
            }
            Tablestr.append("</tbody>");
        }
        Tablestr.append("</table>");
        return Tablestr.toString();
    }
    return null;
}
//20130122 9:54 markeluo 改善大数据量加载问题，行模板获取
Agi.Controls.GetTableRowModel = function (_EntityData) {
    var RowModels = [];
    if (_EntityData != null) {
        if (_EntityData.Columns != null && _EntityData.Columns.length > 0) {
            var TemColumnStr = "";
            for (var i = 0; i < _EntityData.Columns.length; i++) {
                TemColumnStr = "" + _EntityData.Columns[i];
                RowModels.push({display:TemColumnStr, name:TemColumnStr, width:100, sortable:true, align:'left'});
            }
            TemColumnStr = null;
        }
    }
    return RowModels;
}
//20130122 9:54 markeluo 改善大数据量加载问题，获取JSON数据
Agi.Controls.GetTableContentRows = function (_EntityData) {
    var RowDatas = [];
    if (_EntityData.Data != null && _EntityData.Data.length > 0) {
        for (var i = 0; i < _EntityData.Data.length; i++) {
            RowDatas.push({cell:[]});
            for (var j = 0; j < _EntityData.Columns.length; j++) {
                RowDatas[i].cell.push(_EntityData.Data[i][_EntityData.Columns[j]]);
            }
        }
    }
    return RowDatas;
}
/*-----------------------------------------------------------------*/

//控件的外壳(封装版)使用示例见:Agi.Controls.DropDownList.Init
Agi.Controls.Shell = function (options) {
    //PanelSty
    //初始化及一些属性
    var self = this;
    self.options = {
        ID:"",
        className:"",
        width:200,
        height:100,
        layoutType:1,
        divPanel:null,
        enableFrame:true//
    };
    for (name in options) {
        self.options[name] = options[name];
    }
    //属性
    self.Title = $('<div id="head_' + self.options.ID + '" class="selectPanelheadSty hide"><span></span></div>');
    self.Body = $("<div class='selectPanelBodySty'></div>");
    self.Footer = $("<div class='selectPanelFooterSty'></div>");
    self.Container = self.options.divPanel ? $(self.options.divPanel) : $("<div id='Panel_" + self.options.ID + "'></div>");
    self.Container.append(self.Title).append(self.Body).append(self.Footer);
    self.ID = self.Container.attr('id');
    self.BasicID = self.ID.replace('Panel_', '');

    if (!self.options.enableFrame) {
        self.Title.removeClass('selectPanelheadSty').addClass('hide');
        self.Footer.hide();
    }
    //debugger;
    self.Title.addClass('hide');
    self.Footer.addClass('hide');

    if (self.options.layoutType == 1) {
        if (self.options.width) {
            self.Container.width(self.options.width);
        }
        if (self.options.height) {
            self.Container.height(self.options.height);
        }
        //        PostionValue.Left=((_ShowPosition.Left-PagePars.Left)/PagePars.Width).toFixed(4);
        //        PostionValue.Top=((_ShowPosition.Top-PagePars.Top)/PagePars.Height).toFixed(4);
        //        PostionValue.Right=((PagePars.Width-HTMLElementPanel.width()-(_ShowPosition.Left-PagePars.Left))/PagePars.Width).toFixed(4);
        //        PostionValue.Bottom=((PagePars.Height-HTMLElementPanel.height()-(_ShowPosition.Top-PagePars.Top))/PagePars.Height).toFixed(4);
    } else {
        self.Container.removeClass("selectPanelSty");
        self.Container.addClass("selectAutoFill_PanelSty");
    }

    //内部方法
    {
        //初始化第三方控件进来
        self.initialControl = function (obj) {
            self.Body.append(obj);
            self.setTitle(self.options.ID);
        }
        //设置标题
        self.setTitle = function (strTitle) {
            //
            self.Title.find('span:eq(0)').text(strTitle);
        }
        //收起标题
        self.collapseTitle = function () {
            //
            self.title.slideUp('fast');
        }
        //展开标题
        self.expandTitle = function () {
            //
            self.title.slideDown('fast');
        }
    }
}

//编辑状态更改，菜单显示处理:
// _BolIsShow:是否显示菜单按钮,Bool类型
Agi.Controls.EditChangedMenuManager = function (_BolIsShow) {
    if (_BolIsShow) {
        $("#TopRightMenuDiv").children().show();
        //        $("#TopLeftMenuDiv").children().show();
        $("#new").show();
        $("#save").show();
        $("#preview").show();
    } else {
        $("#TopRightMenuDiv").children().hide();
        $("#TopLeftMenuDiv").children().hide();
    }
}
/* markeluo 2012-12-10 9:11 end*/

//控件保存时，清除Entitys 中所有DataSet的Data数据(否则保存的数据太多)
/*markeluo 20121217 15:53 start
 *_Entitys:控件的实体数据 */
Agi.Controls.ClearEntityData = function (_Entitys) {
    var entitylist = [];
    var bolIsClearData = false;
    for (var i = 0; i < _Entitys.length; i++) {
        //20130125 倪飘 当数据是共享数据源时，不删除Data
        if(_Entitys[i].IsShareEntity){}else{
            if(_Entitys[i].Data!=null){
                bolIsClearData = true;
                break;
            }
            if (_Entitys[i].Entity != null && _Entitys[i].Entity.Data != null){
                bolIsClearData = true;
                break;
            }
        }
    }

    if (bolIsClearData) {
        for (var i = 0; i < _Entitys.length; i++) {
            entitylist.push(Agi.Script.CloneObj(_Entitys[i]));
            if(entitylist[i].data){entitylist[i].data=null;}
            if(entitylist[i].Data){entitylist[i].Data=null;}
            if(entitylist[i].Columns){entitylist[i].Columns=null;}

            entitylist[i].Parameters = _Entitys[i].Parameters;
            if (entitylist[i].Entity != null) {
                entitylist[i].Entity.Parameters = _Entitys[i].Entity.Parameters;
                entitylist[i].Entity.Data = null;
            }
        }
    } else {
        entitylist = _Entitys;
    }
    return entitylist;
}
/**/
Agi.Controls.EntityIsExistData=function(_Entitys){
    var bolIsExistData=false;
    if(_Entitys!=null && _Entitys.length>0){
        for(var i=0;i<_Entitys.length;i++){
            if(_Entitys[i].Data!=null && _Entitys[i].Columns!=null && _Entitys[i].Columns.length>0){
                bolIsExistData=true;
                break;
            }
        }
    }
    return bolIsExistData;
}
/*markeluo 20121217 15:53 end*/

//region 删除控件时将控件从控件列表、当前选中列表、粘贴板中移除
Agi.Controls.ControlDestoryByList=function(_Control){
    Agi.Edit.workspace.controlList.remove(_Control);
    if(Agi.Edit.workspace.currentControls!=null && Agi.Edit.workspace.currentControls.length>0){
        for(var i=0;i<Agi.Edit.workspace.currentControls.length;i++){
            if(Agi.Edit.workspace.currentControls[i].Get("ProPerty").ID===_Control.Get("ProPerty").ID){
                Agi.Edit.workspace.currentControls.splice(i,1);
                break;
            }
        }
    }
}
//endregion

//region 异常输入判断处理
//记住前一个值
$(".ControlProNumberSty").live("mousedown",function(ev){
    var self = $(this);
    self.data('preValue',self.val());
});
$(".ControlProNumberSty").live("keydown",function(ev){
    var self = $(this);
    self.data('preValue',self.val());
});

$(".ControlProNumberSty").live("focus blur", function (ev) {
    var ThisValue = $(this).val();
    var MinNumber = parseInt($(this).attr("min"));
    var MaxNumber = parseInt($(this).attr("max"));
    var DefaultValue = $(this).attr("defaultvalue");
    if (DefaultValue != null && DefaultValue != "") {
        DefaultValue = parseInt(DefaultValue);
    }
    if (ThisValue == "") {
        $(this).val(MinNumber);
//        BasickpropertyChange();
    }
    if (ev.type === "focusin") {
        $(this).attr("defaultvalue", $(this).val());
    } else {
        if (DefaultValue != null && DefaultValue != "") {
        } else {
            DefaultValue = MinNumber;
        }
        if (ThisValue >= MinNumber && ThisValue <= MaxNumber) {
        } else {
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
            $(this).val(DefaultValue);
            var preValue = $(this).data('preValue');
            if(preValue !== undefined && preValue >= MinNumber && preValue <= MaxNumber){
                $(this).val( $(this).data('preValue') );//返回前一个正常的值 //gyh
            }
            $(this).change();//触发事件,通知控件刷新
        }
    }
    ThisValue = MinNumber = MaxNumber = DefaultValue = null;
});
//$(".ControlProTextSty").live("input propertychange", function (ev) {
//    var ThisValue = $(this).val();
////    var maxlength = parseInt($(this).attr("maxlength"));
//    var IsCheck = $(this).attr("ischeck");
////    if (ThisValue.length >= maxlength) {
////        var DilogboxTitle = "最多只允许输入" + maxlength + "个长度！";
////        AgiCommonDialogBox.Alert(DilogboxTitle);
////        $(this).val(ThisValue.substring(0, maxlength));//截取最大长度
////        ev.returnValue = false;
////    }
//    var OldLength = ThisValue.length;
//    if (IsCheck === "true") {
//        ThisValue = ThisValue.replace(/\~/g, "").replace(/\!/g, "").replace(/\@/g, "").replace(/\#/g, "").replace(/\$/g, "").replace(/\%/g, "");
//        ThisValue = ThisValue.replace(/\^/g, "").replace(/\&/g, "").replace(/\*/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "");
//        ThisValue = ThisValue.replace(/\=/g, "").replace(/\{/g, "").replace(/\}/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/\|/g, "");
//        ThisValue = ThisValue.replace(/\\/g, "").replace(/\//g, "").replace(/\"/g, "").replace(/'/g, "").replace(/:/g, "").replace(/\?/g, "");
//        ThisValue = ThisValue.replace(/\</g, "").replace(/\>/g, "").replace(/\./g, "").replace(/,/g, "").replace(/;/g, "").replace(/`/g, "");
//        if (OldLength != ThisValue.length) {
//            $(this).val(ThisValue);//替换掉特殊字符
//            var DilogboxTitle = "只允许输入文字、字母和数字!";
//            AgiCommonDialogBox.Alert(DilogboxTitle);
//        }
//    }
//    ThisValue = IsCheck  = OldLength = null;
//});
$(".ControlProTextSty").live("blur", function (ev) {
    var ThisValue = $(this).val();
    var maxlength =$(this).attr("maxlength");
    if(maxlength!=null && maxlength!=""){
        maxlength=parseInt($(this).attr("maxlength"));
    }else{
        maxlength=null;
    }
    var IsCheck = $(this).attr("ischeck");
    if (maxlength!=null && ThisValue.length > maxlength) {
        var DilogboxTitle = "最多只允许输入" + maxlength + "个长度！";
        AgiCommonDialogBox.Alert(DilogboxTitle);
        $(this).val(ThisValue.substring(0, maxlength));//截取最大长度
        ev.returnValue = false;
    }
    var OldLength = ThisValue.length;
    if (IsCheck === "true") {
        ThisValue = ThisValue.replace(/\~/g, "").replace(/\!/g, "").replace(/\@/g, "").replace(/\#/g, "").replace(/\$/g, "").replace(/\%/g, "");
        ThisValue = ThisValue.replace(/\^/g, "").replace(/\&/g, "").replace(/\*/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/\+/g, "");
        ThisValue = ThisValue.replace(/\=/g, "").replace(/\{/g, "").replace(/\}/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/\|/g, "");
        ThisValue = ThisValue.replace(/\\/g, "").replace(/\//g, "").replace(/\"/g, "").replace(/'/g, "").replace(/:/g, "").replace(/\?/g, "");
        ThisValue = ThisValue.replace(/\</g, "").replace(/\>/g, "").replace(/\./g, "").replace(/,/g, "").replace(/;/g, "").replace(/`/g, "");
        if (OldLength != ThisValue.length) {
            $(this).val(ThisValue);//替换掉特殊字符
            var DilogboxTitle = "只允许输入文字、字母和数字!";
            AgiCommonDialogBox.Alert(DilogboxTitle);
            ev.returnValue = false;
        }
    }
    ThisValue = IsCheck  = OldLength = null;
});
/*限定Number控件输入最小值(必须添加class:numberminCheck 和min 属性)*/
$(".numberminCheck").live("blur",function(ev){
    var ThisValue = $(this).val();
    var MinNumber = parseInt($(this).attr("min"));
    if(ThisValue=="" || ThisValue<MinNumber){
        $(this).val(MinNumber);
    }
});
//endregion
//面板控件属性异常输入判断处理
$(".ProControlProNumberSty").live("focus blur", function (ev) {
    var ThisValue = $(this).val();
    var MinNumber = parseInt($(this).attr("min"));
    var MaxNumber = parseInt($(this).attr("max"));
    var DefaultValue = $(this).attr("defaultvalue");
    if (DefaultValue != null && DefaultValue != "") {
        DefaultValue = parseInt(DefaultValue);
    }
    if (ThisValue == "") {
        $(this).val(MinNumber);
        BasickpropertyChange();
    }
    if (ev.type === "focusin") {
        $(this).attr("defaultvalue", $(this).val());
    } else {
        if (DefaultValue != null && DefaultValue != "") {
        } else {
            DefaultValue = MinNumber;
        }
        if (ThisValue >= MinNumber && ThisValue <= MaxNumber) {
        } else {
            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
            AgiCommonDialogBox.Alert(DilogboxTitle);
            $(this).val(DefaultValue);
        }
    }
    ThisValue = MinNumber = MaxNumber = DefaultValue = null;
});

//region 20130311 17:46 颜色选择控件替换处理
Namespace.register("Agi.Controls.ControlColorApply");
Agi.Controls.ControlColorApply.fEditColor=function(_oElement,_DisableTabIndexArray,_bSurpTransparent,_fCallbak){
    var currentValue =null;
    if (typeof (_oElement) === "string") {
        _oElement = $("#" +_oElement);
    } else {
        _oElement = $(_oElement);
    }
    if(_oElement!=null){
        currentValue=_oElement.data('colorValue');
    }

    colorPicker.open({
        disableTabIndex:_DisableTabIndexArray,//禁用渐变
        defaultValue:currentValue,//这个参数是上一次选中的颜色
        saveCallBack:function(color){//这是参数一个回调函数,当用户点击确定后,这里会执行
            if(!_bSurpTransparent){
                if(color.value.background==="rgba(0,0,0,0)"){
                    AgiCommonDialogBox.Alert("不支持透明色！");
                    return ;
                }
            }
            _fCallbak(color);
        }
    });
}
//颜色选择控件颜色值获取
Agi.Controls.ControlColorApply.fColorControlValueGet=function(_oElement){
    var oThisColorControl=null;
    if (typeof (_oElement) === "string") {
        oThisColorControl = $("#" +_oElement);
    } else {
        oThisColorControl = $(_oElement);
    }
    var ThisColorValue=oThisColorControl.data('colorValue');
    if(ThisColorValue!=null){
        if(ThisColorValue.type===2){
            ThisColorValue=ThisColorValue.value.background;
        }else if(ThisColorValue.type===1){
            ThisColorValue=ThisColorValue.hex;
            if(ThisColorValue.indexOf("#")<0){
                ThisColorValue="#"+ThisColorValue;
            }
        }else{
            ThisColorValue=ThisColorValue;
        }

    }
    return ThisColorValue;
}
//颜色控件赋值
Agi.Controls.ControlColorApply.fColorControlValueSet=function(_oElement,_sColorValue,IsGraChange){
    var oThisColorControl=null;
    if (typeof (_oElement) === "string") {
        oThisColorControl = $("#" +_oElement);
    } else {
        oThisColorControl = $(_oElement);
    }
    if(_sColorValue){
        if(typeof (_sColorValue) === "string"){
            if(IsGraChange){
                oThisColorControl.css("background",_sColorValue).data('colorValue',{"type":2,"direction":"horizontal",
                    "stopMarker":
                        [{
                            "position":0.29,
                            "color":"",
                            "ahex":""
                        },{
                            "position":0.88,
                            "color":"",
                            "ahex":""
                        }],
                    "value":
                    {
                        "background":_sColorValue
                    }
                });
            }else{
                oThisColorControl.css("background-color",_sColorValue).data('colorValue',
                    {"type":1,"rgba":_sColorValue,"hex":_sColorValue,"ahex":_sColorValue,"value":_sColorValue});//设置默认项
            }
        }else{
            if(_sColorValue.type===3){
                oThisColorControl.css(_sColorValue.value).data('colorValue',_sColorValue);
            }else{
                if(IsGraChange){
                    oThisColorControl.css(_sColorValue.value).data('colorValue',_sColorValue);
                }else{
                    oThisColorControl.css("background-color",_sColorValue.value.background).data('colorValue',_sColorValue);//设置默认项
                }
            }
        }
    }

}
//背景颜色值格式化
Agi.Controls.ControlColorApply.fBackgroundColorFormat=function(_oColorValue){
    var bgcolorValues={
        ColorType:_oColorValue.type,//类型
        BolIsTransfor:null,//是否透明
        StartColor:null,//开始颜色
        EndColor:null,//结束颜色
        GradualChangeType:null,//渐变方式(horizontal,vertical,diagonal,diagonal-bottom, radial)
        BackGroundImg:null,//背景图片样式
        Imgurl:null//图片路径
    }
    if(_oColorValue.type==1){
        if(_oColorValue.value.background==="rgba(0,0,0,0)"){
            bgcolorValues.BolIsTransfor="true";
        }else{
            bgcolorValues.BolIsTransfor="false";
        }

        bgcolorValues.StartColor=bgcolorValues.EndColor=_oColorValue.value.background;
    }else if(_oColorValue.type==2){
        bgcolorValues.StartColor=_oColorValue.stopMarker[0].color;
        bgcolorValues.EndColor=_oColorValue.stopMarker[1].color;
        if(bgcolorValues.StartColor==="rgba(0,0,0,0)" || bgcolorValues.EndColor==="rgba(0,0,0,0)"){
            bgcolorValues.BolIsTransfor="true";
        }else{
            bgcolorValues.BolIsTransfor="false";
        }
        bgcolorValues.GradualChangeType=_oColorValue.direction;
    }else if(_oColorValue.type==3){
        bgcolorValues.BolIsTransfor="false";
        bgcolorValues.BackGroundImg=_oColorValue.value;
        bgcolorValues.Imgurl=_oColorValue.imgName;
    }
    return bgcolorValues;
}
//endregion

//region 20131220 10:22 markeluo 数据处理
Namespace.register("Agi.Controls.DataConvertManager");
//判断Number类型数据是否为空，若为空则进行替换
Agi.Controls.DataConvertManager.NumberNULLReplace=function(_OldValue,_ReplaceValue){
    if(_OldValue!=null &&_OldValue!=""){
    }else{
        _OldValue=_ReplaceValue;
    }
    return _OldValue;
}
//Entity Data数据行过多时进行截取，并弹出提示信息
Agi.Controls.DataConvertManager.DataInterception=function(_OldData,_MaxLength){
    if(_OldData!=null && _OldData.length>0){
        if(_OldData.length>_MaxLength){
            _OldData.splice(_MaxLength,(_OldData.length-_MaxLength));
            AgiCommonDialogBox.Alert("数据超出范围!<br>为了保证显示效果,基本图表将截取显示前"+_MaxLength+"条数据！");
        }
        return _OldData;
    }
    return _OldData;
}
//endregion

//region 20140116 markeluo 新增 钻取设置
//10.数据钻取菜单统一处理,页面列表
Agi.Controls.CustomControl_ExtractDataPageListMenu=function(_Panel,_Control){
    var Me=_Control;
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
    if(ChartExtractConfig!=null){}else{
        ChartExtractConfig=[];
    }
    // [{drillname:"硅钢统计月数据钻取日数据",drillcolumn:"统计时间",drillpage:"硅钢日统计",drillpars:[{parsname:"AA",parstype:"0",parsvalue:"column1"}]}]

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/controltabtemplates.html #tab-1', function () {
        //0.默认选项隐藏
        $("#CstmtrlProParsNewParsTxt").width(0).hide();

        //1.初始化列表栏位显示
        var DefaultParNameColumn=null;
        Agi.PageDataDrill.GetAllPageFilList(function(_result){
            if(_result.result && _result.result=="true"){
                var strCustSigChartExtractURLoptions="";
                if(_result.data!=null && _result.data.length>0){
                    var itemValue="";
                    for(var i=0;i<_result.data.length;i++){
                        itemValue=_result.data[i]["pagename"]+"_"+_result.data[i]["no"];
                        strCustSigChartExtractURLoptions+="<option value='"+itemValue+"' title='"+itemValue+"'>"+itemValue+"</option>";
                    }
                    itemValue=null;
                    $("#CustomControlExtractURL").html(strCustSigChartExtractURLoptions);
                    if(ChartExtractConfig!=null && ChartExtractConfig.URL!=null){
                        //$("#CustSigChartExtractURL").val(ChartExtractConfig.URL);
                        $("#CustomControlExtractURL").find("[value='"+ChartExtractConfig.URL+"']").attr('checked',true);
                    }
                }
            }
        });
        //2.绑定数据列
        if(ChartEntityColumns!=null && ChartEntityColumns.length>0){
            for(var i=0;i<ChartEntityColumns.length;i++){
                $("#CustomControlExtractColumns").append("<option value='"+ChartEntityColumns[i]+"' title='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>");
            }
            if(DefaultParNameColumn!=null){
                $("#CustomControlExtractColumns").val(DefaultParNameColumn);
            }
        }
        //3.显示已配的页面列表
        Agi.Controls.CustomControl_ExtractDataPageListUpdte($("#ExtractPageListPanel"),ChartExtractConfig);
        $("#CustomControlExtractName").val("");
        $("#CustomControlProhidenPanel").html("");
        //region 4事件处理
        //4.1.新增钻取
        $("#CustomCtrlExtAdd").unbind().bind("click",function(ev){
            var DrillPageItem={
                drillname:$("#CustomControlExtractName").val(),
                drillcolumn:$("#CustomControlExtractColumns").val(),
                drillpage:$("#CustomControlExtractURL").val(),
                drillpars:[]
            }
            ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
            Agi.Controls.CustomControl_ExtractDataPageListSave(DrillPageItem,ChartExtractConfig,Me,"1");
        });
        //4.2.编辑
        $("#CustomCtrlExtSave").unbind().bind("click",function(ev){
            var OldDirllname=$("#CustomControlProhidenPanel").html();
            if(OldDirllname!=""){
                var DrillPageItem={
                    drillname:$("#CustomControlExtractName").val(),
                    drillcolumn:$("#CustomControlExtractColumns").val(),
                    drillpage:$("#CustomControlExtractURL").val()
                }
                ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
                Agi.Controls.CustomControl_ExtractDataPageListSave(DrillPageItem,ChartExtractConfig,Me,"0");
            }else{
                AgiCommonDialogBox.Alert("请先选择下方已保存的列表项，然后再编辑保存！");
            }
        });
        //4.3.删除
        $("#CustomCtrlExtDel").unbind().bind("click",function(ev){
            var OldDirllname=$("#CustomControlProhidenPanel").html();
            if(OldDirllname!=""){
                AgiCommonDialogBox.Confirm("确定删除【"+OldDirllname+"】钻取配置?", null, function (flag) {
                    if (flag) {
                        ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
                        for(var i=0;i<ChartExtractConfig.length;i++){
                            if(ChartExtractConfig[i].drillname==OldDirllname){
                                ChartExtractConfig.shift(i,1);
                                break;
                            }
                        }
                        $("#CustomControlExtractName").val("");
                        $("#CustomControlProhidenPanel").html("");
                        Me.Set("ExtractConfig",ChartExtractConfig);
                        Agi.Controls.CustomControl_ExtractDataPageListUpdte($("#ExtractPageListPanel"),ChartExtractConfig);
                    }
                });
            }else{
                AgiCommonDialogBox.Alert("请在下方已保存列表选择需要删除的项目！");
            }
        });
        //endregion
    });
}
//11.钻取页面保存
Agi.Controls.CustomControl_ExtractDataPageListSave=function(DrillPageItem,_DrillConfigs,_Control,_type){
    if(DrillPageItem.drillname!=""){}else{
        AgiCommonDialogBox.Alert("钻取名称不可为空！");
        return;
    }
    if(DrillPageItem.drillcolumn!=""){}else{
        AgiCommonDialogBox.Alert("钻取绑定列不可为空！");
        return;
    }
    if(DrillPageItem.drillpage!=""){}else{
        AgiCommonDialogBox.Alert("钻取页面不可为空！");
        return;
    }

    if(_DrillConfigs!=null && _DrillConfigs.length>0){
        var bolIsExt=false;
        if(_type=="0"){
            var OldDirllName=$("#CustomControlProhidenPanel").html();
            for(var i=0;i<_DrillConfigs.length;i++){
                if(_DrillConfigs[i].drillname==OldDirllName){
                    bolIsExt=true;
                    _DrillConfigs[i].drillname=DrillPageItem.drillname;
                    _DrillConfigs[i].drillcolumn=DrillPageItem.drillcolumn;
                    _DrillConfigs[i].drillpage=DrillPageItem.drillpage;
                    break;
                }
            }
        }else{
            for(var i=0;i<_DrillConfigs.length;i++){
                if(_DrillConfigs[i].drillname==DrillPageItem.drillname){
                    bolIsExt=true;
                    break;
                }
            }
        }
        if(bolIsExt){
            if(_type=="1"){
                AgiCommonDialogBox.Alert("新增钻取名称已存在！");
                return;
            }
        }else{
            if(_type=="0"){
                AgiCommonDialogBox.Alert("未找到对应名称的钻取信息，若需新增请点击新增按钮！");
                return;
            }else{
                _DrillConfigs.push(DrillPageItem);
            }
        }
    }else{
        if(_type=="0"){
            AgiCommonDialogBox.Alert("未找到对应名称的钻取信息，若需新增请点击新增按钮！");
            return;
        }else{
            _DrillConfigs=[DrillPageItem];
        }
    }
    _Control.Set("ExtractConfig",_DrillConfigs);
    Agi.Controls.CustomControl_ExtractDataPageListUpdte($("#ExtractPageListPanel"),_DrillConfigs);
    $("#CustomControlProhidenPanel").html(DrillPageItem.drillname);
    AgiCommonDialogBox.Alert("保存成功！");
}
//12.更新钻取列表至面板
Agi.Controls.CustomControl_ExtractDataPageListUpdte=function(_Panelobj,_Configs){
    var StrListItems="";
    if(_Configs!=null && _Configs.length>0){
        for(var i=(_Configs.length-1);i>=0;i--){
            StrListItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' title='"+_Configs[i].drillname+"'>"+_Configs[i].drillname
                +"</div><div class='CustomCtrlExtParsCellSty' title='"+_Configs[i].drillcolumn+"'>"+_Configs[i].drillcolumn+"</div>" +
                "<div class='CustomCtrlExtParsCellSty' title='"+_Configs[i].drillpage+"'>"+_Configs[i].drillpage+"</div></div>";
        }
    }
    _Panelobj.html(StrListItems);
    Agi.Controls.CustomControl_ExtractDataPageListItems(_Configs);//更新已配置列表显示

    _Panelobj.find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
        $(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
        $(this).addClass("CustomCtrlExtParsitem_selected");
        Agi.Controls.CustomControl_ExtractDataPagItemSelChanged({drillname:$(this).find("div")[0].innerText,drillcolumn:$(this).find("div")[1].innerText,drillpage:$(this).find("div")[2].innerText});
    })
}
//13.选中一行已配置钻取页面项
Agi.Controls.CustomControl_ExtractDataPagItemSelChanged=function(_SelObj){
    $("#CustomControlExtractColumns").find("option[value='"+_SelObj.drillcolumn+"']").attr("selected","selected");
    $("#CustomControlExtractURL").find("option[value='"+_SelObj.drillpage+"']").attr("selected","selected");
    $("#CustomControlExtractName").val(_SelObj.drillname);
    $("#CustomControlProhidenPanel").html(_SelObj.drillname);
}
//14.数据钻取菜单统一处理，参数列表
Agi.Controls.CustomControl_ExtractDataParsListMenu=function(_Panel,_Control){
    var Me=_Control;
    var ChartEntity=Me.Get("Entity")[0];
    var ChartEntityColumns=[];
    if(ChartEntity!=null && ChartEntity.Columns!=null){
        ChartEntityColumns=ChartEntity.Columns;
    }
    var ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
    if(ChartExtractConfig!=null){}else{
        ChartExtractConfig=[];
    }
    // [{drillname:"硅钢统计月数据钻取日数据",drillcolumn:"统计时间",drillpage:"硅钢日统计",drillpars:[{parsname:"AA",parstype:"0",parsvalue:"column1"}]}]

    var ItemContentPanel=$(_Panel);
    if($(_Panel).find(".content").length>0){
        ItemContentPanel=$(_Panel).find(".content");
    }
    ItemContentPanel.load('JS/Controls/controltabtemplates.html #tab-2', function () {
        //1.加载已保存的配置
        Agi.Controls.CustomControl_ExtractDataPageListItems(ChartExtractConfig);
        $("#CstmtrlProParsValue_1").hide();
        //2.绑定数据列
        $("#CstmtrlProParsValue_1").html("");
        if(ChartEntityColumns!=null && ChartEntityColumns.length>0){
            for(var i=0;i<ChartEntityColumns.length;i++){
                $("#CstmtrlProParsValue_0").append("<option value='"+ChartEntityColumns[i]+"' title='"+ChartEntityColumns[i]+"'>"+ChartEntityColumns[i]+"</option>");
            }
            $("#CstmtrlProParsValue_0").find("option[value='"+ChartEntityColumns[0]+"']").attr("selected","selected");
        }
        $("#CustomControlProhidenSelPars").html("");

        var ThisSelItemObj=null;
        //4.事件绑定
        $("#CustSigChartExtractPage").change(function(){
            var ThisSelItemName=$(this).val();

            ChartExtractConfig=Me.Get("ExtractConfig");
            if(ChartExtractConfig!=null && ChartExtractConfig.length>0){
                for(var i=0;i< ChartExtractConfig.length;i++){
                    if(ChartExtractConfig[i].drillname==ThisSelItemName){
                        ThisSelItemObj=ChartExtractConfig[i];
                        break;
                    }
                }
                if(ThisSelItemObj!=null){
                    //钻取页选中更改，重新当前钻取页的URL参数列表 (20140219 8:52 markeluo 新增)
                    Agi.Controls.CustomControl_ExtractPageParsLoad(ThisSelItemObj.drillpage);

                    Agi.Controls.CustomControl_ExtractDataPageParsLoad(ThisSelItemObj);
                }
            }
        });
        $("#CstmtrlProParsType").change(function(){
            var ThisSelItem=$(this).val();
            Agi.Controls.CustomControl_ExtraParsValShowByType(ThisSelItem);
        });
        //4.1.新增
        $("#CstmtrlProParsbtnAdd").unbind().bind("click",function(ev){
            if(ThisSelItemObj!=null){
                var newParsobj=Agi.Controls.CustomControl_ExtraParsGetItemObj();
                Agi.Controls.CustomControl_ExtraParsSave(ThisSelItemObj,newParsobj,1);

                ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
                ChartExtractConfig=Agi.Controls.CustomControl_ParsChangeUpConfigs(ThisSelItemObj,ChartExtractConfig);
                Me.Set("ExtractConfig",ChartExtractConfig);

                Agi.Controls.CustomControl_ExtractDataPageParsLoad(ThisSelItemObj);//加载参数列表
            }

        });
        //4.2.保存
        $("#CstmtrlProParsbtnSave").unbind().bind("click",function(ev){
            if(ThisSelItemObj!=null){
                var newParsobj=Agi.Controls.CustomControl_ExtraParsGetItemObj();
                Agi.Controls.CustomControl_ExtraParsSave(ThisSelItemObj,newParsobj,0);

                ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
                ChartExtractConfig=Agi.Controls.CustomControl_ParsChangeUpConfigs(ThisSelItemObj,ChartExtractConfig);
                Me.Set("ExtractConfig",ChartExtractConfig);

                Agi.Controls.CustomControl_ExtractDataPageParsLoad(ThisSelItemObj);//加载参数列表
            }
        });
        //4.3.删除
        $("#CstmtrlProParsbtnDelete").unbind().bind("click",function(ev){
            var SelName=$("#CustomControlProhidenSelPars").html();
            if(SelName!="" && ThisSelItemObj!=null && ThisSelItemObj.drillpars.length>0){
                AgiCommonDialogBox.Confirm("确定删除【"+SelName+"】参数?", null, function (flag) {
                    if (flag) {
                        for(var i=0;i<ThisSelItemObj.drillpars.length;i++){
                            if(SelName==ThisSelItemObj.drillpars[i].parsname){
                                ThisSelItemObj.drillpars.shift(i,1);
                                break;
                            }
                        }
                        ChartExtractConfig=Me.Get("ExtractConfig");//数据钻取配置信息
                        ChartExtractConfig=Agi.Controls.CustomControl_ParsChangeUpConfigs(ThisSelItemObj,ChartExtractConfig);
                        Me.Set("ExtractConfig",ChartExtractConfig);

                        Agi.Controls.CustomControl_ExtractDataPageParsLoad(ThisSelItemObj);//加载参数列表
                    }
                });
            }else{
                AgiCommonDialogBox.Alert("请在下方列表中选中需要删除的项再试！");
                return;
            }
            $("#CustomControlProhidenSelPars").html("");
        });
    });
}
//15.显示可钻取页面列表
Agi.Controls.CustomControl_ExtractDataPageListItems=function(_DrillConfigs){
    var strDrillPags="";
    var SelectedItem=null;
    if(_DrillConfigs!=null && _DrillConfigs.length>0){
        SelectedItem=_DrillConfigs[(_DrillConfigs.length-1)];
        for(var i=(_DrillConfigs.length-1);i>=0;i--){
            strDrillPags+="<option value='"+_DrillConfigs[i].drillname+"' title='"+_DrillConfigs[i].drillname+"'>"+_DrillConfigs[i].drillname+"</option>";
        }
    }
    $("#CustSigChartExtractPage").html(strDrillPags);
    if(SelectedItem!=null){
        $("#CustSigChartExtractPage").find("option[value='"+SelectedItem.drillname+"']").attr("selected","selected");
        //钻取页选中更改，重新当前钻取页的URL参数列表(20140219 8:52 markeluo 新增)
        Agi.Controls.CustomControl_ExtractPageParsLoad(SelectedItem.drillpage);

        Agi.Controls.CustomControl_ExtractDataPageParsLoad(SelectedItem);
    }
}
//16.显示钻取页面参数项
Agi.Controls.CustomControl_ExtractDataPageParsLoad=function(_DrillConfigIem){
    var strDrillPageParsItems="";
    if(_DrillConfigIem!=null && _DrillConfigIem.drillpars!=null && _DrillConfigIem.drillpars.length>0){
        //parsname,parstype,parsvalue
        for(var i=(_DrillConfigIem.drillpars.length-1);i>=0;i--){
            strDrillPageParsItems+="<div class='CustomCtrlExtParsitem'><div class='CustomCtrlExtParsCellSty' title='"+_DrillConfigIem.drillpars[i].parsname+"'>"+_DrillConfigIem.drillpars[i].parsname
                +"</div><div class='CustomCtrlExtParsCellSty' title='"+Agi.Controls.CustomControl_ExtraParsTypeName(_DrillConfigIem.drillpars[i].parstype,0)
                +"'>"+Agi.Controls.CustomControl_ExtraParsTypeName(_DrillConfigIem.drillpars[i].parstype,0)+"</div>" +
                "<div class='CustomCtrlExtParsCellSty' title='"+_DrillConfigIem.drillpars[i].parsvalue+"'>"+_DrillConfigIem.drillpars[i].parsvalue+"</div></div>";
        }
    }
    $("#ParsListPanel").html(strDrillPageParsItems);
    $("#ParsListPanel").find(".CustomCtrlExtParsitem").unbind().bind("click",function(){
        $(".CustomCtrlExtParsitem").removeClass("CustomCtrlExtParsitem_selected");
        $(this).addClass("CustomCtrlExtParsitem_selected");
        Agi.Controls.CustomControl_ExtractPagParsSelChanged({
            parsname:$(this).find("div")[0].innerText,
            parstype:Agi.Controls.CustomControl_ExtraParsTypeName($(this).find("div")[1].innerText,1),
            parsvalue:$(this).find("div")[2].innerText
        });
    });
}
//17.根据类型值返回类型名称/根据类型名称返回类型值
Agi.Controls.CustomControl_ExtraParsTypeName=function(_typevalue,_stype){
    var TypeNameOrValue="";
    if(_stype==0){
        switch(_typevalue){
            case "0":
                TypeNameOrValue="单行列值";
                break;
            case "1":
                TypeNameOrValue="固定值";
                break;
            case "2":
                TypeNameOrValue="整列数据";
                break;
            default:
                TypeNameOrValue="单行列值";
                break;
        }
    }else{
        switch(_typevalue){
            case "单行列值":
                TypeNameOrValue="0";
                break;
            case "固定值":
                TypeNameOrValue="1";
                break;
            case "整列数据":
                TypeNameOrValue="2";
                break;
            default:
                TypeNameOrValue="0";
                break;
        }
    }
    return TypeNameOrValue;
}
//18.根据参数类型显示对应标签和值
Agi.Controls.CustomControl_ExtraParsValShowByType=function(_type,_Value){
    switch(_type)
    {
        case "0":
            $("#CstmtrlProParsValue_0").show();
            $("#CstmtrlProParsValue_1").hide();
            if(_Value!=null){
                $("#CstmtrlProParsValue_0").find("option[value='"+_Value+"']").attr("selected","selected");
            }
            break;
        case "1":
            $("#CstmtrlProParsValue_1").show();
            $("#CstmtrlProParsValue_0").hide();
            if(_Value!=null){
                $("#CstmtrlProParsValue_1").val(_Value);
            }
            break;
        case "2":
            $("#CstmtrlProParsValue_0").show();
            $("#CstmtrlProParsValue_1").hide();
            if(_Value!=null){
                $("#CstmtrlProParsValue_0").find("option[value='"+_Value+"']").attr("selected","selected");
            }
            break;
        default:
            $("#CstmtrlProParsValue_0").show();
            $("#CstmtrlProParsValue_1").hide();
            if(_Value!=null){
                $("#CstmtrlProParsValue_0").find("option[value='"+_Value+"']").attr("selected","selected");
            }
            break;
    }
}
//19.保存参数配置信息时获取参数信息
Agi.Controls.CustomControl_ExtraParsGetItemObj=function(){
    var newParsobj={
        parsname:$("#CstmtrlProParsNames").val(),
        parstype:$("#CstmtrlProParsType").val(),
        parsvalue:""
    };
    if(newParsobj.parstype=="1"){
        newParsobj.parsvalue=$("#CstmtrlProParsValue_1").val();
    }else{
        newParsobj.parsvalue=$("#CstmtrlProParsValue_0").val();
    }
    return newParsobj;
}
//20.参数配置保存,_type:0,保存,1:新增
Agi.Controls.CustomControl_ExtraParsSave=function(_ExtractConfigItem,_newitem,_type){
    //parsname,parstype,parsvalue
    if(_newitem.parsname==""){
        AgiCommonDialogBox.Alert("URL参数名不可为空！");
        return;
    }
    if(_newitem.parsvalue==""){
        AgiCommonDialogBox.Alert("参数值不可为空！");
        return;
    }
    if(_type==0){
        var SelParsItemName=$("#CustomControlProhidenSelPars").html();
        if(SelParsItemName!=""){
            var BolIsExt=false;
            for(var i=0;i<_ExtractConfigItem.drillpars.length;i++){
                if(_ExtractConfigItem.drillpars[i].parsname==SelParsItemName){
                    BolIsExt=true;
                    _ExtractConfigItem.drillpars[i].parsname=_newitem.parsname;
                    _ExtractConfigItem.drillpars[i].parstype=_newitem.parstype;
                    _ExtractConfigItem.drillpars[i].parsvalue=_newitem.parsvalue;
                    break;
                }
            }
            if(!BolIsExt){
                AgiCommonDialogBox.Alert("未找到符合条件的保存项！");
                return;
            }
        }else{
            AgiCommonDialogBox.Alert("请在下方列表选中编辑项，更改相应选项后再试！");
            return;
        }
    }else{
        var BolIsExt=false;
        if(_ExtractConfigItem.drillpars!=null && _ExtractConfigItem.drillpars.length>0){
            for(var i=0;i<_ExtractConfigItem.drillpars.length;i++){
                if(_ExtractConfigItem.drillpars[i].parsname==_newitem.parsname){
                    BolIsExt=true;
                    break;
                }
            }
        }else{
            _ExtractConfigItem.drillpars=[];
        }
        if(!BolIsExt){
            _ExtractConfigItem.drillpars.push(_newitem);
        }else{
            AgiCommonDialogBox.Alert("同名参数已存在,无法添加！");
            return;
        }
    }
    $("#CustomControlProhidenSelPars").html(_newitem.parsname);
}
//21.钻取页面配置的参数更改，更新钻取配置列表
Agi.Controls.CustomControl_ParsChangeUpConfigs=function(_confititem,_configs){
    for(var i=0;i<_configs.length;i++){
        if(_configs[i].drillname==_confititem.drillname){
            _configs[i]=_confititem;
            break;
        }
    }
    return _configs;
}
//22.钻取页面参数面板中参数项选中更改
Agi.Controls.CustomControl_ExtractPagParsSelChanged=function(_SelObj){
    //{parsname,parstype,parsvalue}
    $("#CstmtrlProParsType").find("option[value='"+_SelObj.parstype+"']").attr("selected","selected");
    //显示参数值
    Agi.Controls.CustomControl_ExtraParsValShowByType(_SelObj.parstype,_SelObj.parsvalue);

    $("#CstmtrlProParsNames").val(_SelObj.parsname);
    $("#CstmtrlProSelectParsNames").find("option[value='"+_SelObj.parsname+"']").attr("selected","selected");
    $("#CustomControlProhidenSelPars").html(_SelObj.parsname);
}
//23.钻取页面选中更改，获取被钻取页面的URL参数列表并显示（20140219 8:48 markeluo 新增）
Agi.Controls.CustomControl_ExtractPageParsLoad=function(_SelObj,CallBack){
    var PageName=_SelObj.substr(0,_SelObj.lastIndexOf("_"));
    var PageVesion=_SelObj.substr(_SelObj.lastIndexOf("_")+1);
    Agi.PageDataDrill.GetPageContenURL(PageName,PageVesion,function(_result){
        if(_result.result && _result.result=="true"){
            var strCustSigChartExtractURLPars="";
            if(_result.data!=null && _result.data.urlpars!=null){
                var ParsArray=_result.data.urlpars.split(",");
                if(ParsArray!=null && ParsArray.length>0){
                    for(var i=0;i<ParsArray.length;i++){
                        strCustSigChartExtractURLPars+="<option value='"+ParsArray[i]+"' title='"+ParsArray[i]+"'>"+ParsArray[i]+"</option>";
                    }
                    $("#CstmtrlProParsNames").val(ParsArray[0]);
                    $("#CstmtrlProSelectParsNames").html(strCustSigChartExtractURLPars);
                    $("#CstmtrlProSelectParsNames").change(function(){
                        $("#CstmtrlProParsNames").val($(this).val());
                    });
                }
            }
        }
    })
}
//endregion