/**
* Created with JetBrains WebStorm.
* User: luopeng
* Date: 2012年9月4日 
* Time: 14:02:00
* To change this template use File | Settings | File Templates.
* RealTimeLable 实时Lable
*/
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
var _RealTimeState = true;
Agi.Controls.RealTimeLable = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
            var ThisHTMLElement = this.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj);
            }
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
                menuManagement.dragablePoint();
            }
        },
        ReadData: function (ReadData) {

        },
        ReadOtherData: function (Point) {
            var BasicProperty = this.Get('BasicProperty');
            if (Agi.Edit) {
                Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": this.Get("ProPerty").ID, "Points": [Point] });
            }
            else {
                Agi.Msg.PointsManageInfo.AddViewPoint({ "ControlID": this.Get("ProPerty").ID, "Points": [Point] });
            }
            BasicProperty._RealTimePoint = Point;
            this.Set("BasicProperty", BasicProperty);
        },
        ReadRealData: function (MsgObj) {
            var controlObject = this.shell.Container;
            //controlObject.find('.RealTimeLable').html(MsgObj.Value);
            var BasicProperty = this.Get('BasicProperty');
            var RTPValue = MsgObj.Value;
            //20130115 倪飘 修改控件库-实时标签-基本设置中选择小数点位数为3，无法正常显示问题
            switch (BasicProperty._Mlength) {
                case "0":
                    RTPValue = Math.round(RTPValue);
                    break;
                case "1":
                    RTPValue = RTPValue.toFixed(1);
                    break;
                case "2":
                    RTPValue = RTPValue.toFixed(2);
                    break;
                case "3":
                    RTPValue = RTPValue.toFixed(3);
                    break;
                case "4":
                    RTPValue = RTPValue.toFixed(4);
                    break;

            }
            if (BasicProperty._StartParam && BasicProperty._Param.length > 0) {
                //20130104 17:27 markeluo 实时Lable 如果不设置显示文本则无法显示默认点位值Bug 修改
                var ThisTempValue="";//
                var _Param = BasicProperty._Param;
                if (Object.prototype.toString.call(_Param) === "[object Object]") {
                    var _Operation = _Param._Operation;
                    if(_Param._Value!=null && _Param._Value!=""){
                        ThisTempValue=_Param._Value;
                    }else{
                        ThisTempValue=RTPValue
                    }
                    var _key = parseInt(_Param._Key);
                    switch (_Operation) {
                        case "大于":
                            if (RTPValue > _key) {
                                controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param._TxtColor);
                            }
                            break;
                        case "大于等于":
                            if (RTPValue >= _key) {
                                controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param._TxtColor);
                            }
                            break;
                        case "小于":
                            if (RTPValue < _key) {
                                controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param._TxtColor);
                            }
                            break;
                        case "小于等于":
                            if (RTPValue <= _key) {
                                controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param._TxtColor);
                            }
                            break;
                        case "等于":
                            if (RTPValue == _key) {
                                controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param._TxtColor);
                            }
                            break;
                    }
                }
                else if (Object.prototype.toString.call(_Param) === "[object Array]") {
                    for (var i = 0; i < _Param.length; i++) {
                        var _Operation = _Param[i]._Operation;
                        var _key = parseInt(_Param[i]._Key);
                        if(_Param[i]._Value!=null && _Param[i]._Value!=""){
                            ThisTempValue=_Param[i]._Value;
                        }else{
                            ThisTempValue=RTPValue
                        }
                        switch (_Operation) {
                            case "大于":
                                if (RTPValue > _key) {
                                    controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param[i]._TxtColor);
                                }
                                break;
                            case "大于等于":
                                if (RTPValue >= _key) {
                                    controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param[i]._TxtColor);
                                }
                                break;
                            case "小于":
                                if (RTPValue < _key) {
                                    controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param[i]._TxtColor);
                                }
                                break;
                            case "小于等于":
                                if (RTPValue <= _key) {
                                    controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param[i]._TxtColor);
                                }
                                break;
                            case "等于":
                                if (RTPValue == _key) {
                                    controlObject.find('.RealTimeLable').html(ThisTempValue).css("color",_Param[i]._TxtColor);
                                }
                                break;
                        }
                    }
                }
            }
            else {
                controlObject.find('.RealTimeLable').html(RTPValue);
            }
            RTPValue = null;
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            //联动接口: 框架传递过来点位号；控件自己去注册点位号
            var controlObject = this.shell.Container;
            controlObject.find('.RealTimeLable').html(_ParameterInfo.Points);
            Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": this.Get("ProPerty").ID, "Points": [_ParameterInfo.Points] });
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            self.shell = null;
            self.AttributeList = [];
            self.Set("Entity", []);
            self.Set("ControlType", "RealTimeLable");
            var ID = savedId ? savedId : "RealTimeLable_" + Agi.Script.CreateControlGUID();
            var HTMLRealTimeLable = $("<div recivedata='true' id='Panel_" + ID + "'   class='PanelSty'></div>");
            self.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 200,
                height: 40,
                divPanel: HTMLRealTimeLable
            });
            var BaseControlObj = $('<table id="' + ID + '"  class="navbarRealTimeLable"><tr><td align="left">' +
                '<table width="100%" border="0" cellspacing="0" cellpadding="0">' +
                '<tbody><tr><td  class="RealTimeLable" style="white-space:nowrap;">0</td>' +
                '</tr></tbody></table></td></tr></table>');
            /* $('<div style="height:100%;width:100%;text-align:center" id="' + ID + '" >' +
            '<label style="height:100%;width:100%" class="RealTimeLable">0</label>' +
            '</div>');*/
            self.shell.initialControl(BaseControlObj[0]);
            self.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            var BasicProperty = {
                _Title: true,
                _Top: true,
                _Contract: true,
                _LableBgColor: "White",
                _LableFontColor: "Black",
                _LableBorderColor: "#000",
                _LableFontSize: "16",
                _FontWeight: "Normal",
                _LabLT: 0,
                _LabRT: 0,
                _LabLB: 0,
                _LabRB: 0,
                _StartParam: false,
                _ParamCount: 0,
                _Param: [],
                _RealTimePoint: "0",
                _Mlength: "3",
                _TxtIndent:0,//文本缩进
                _LableBorderSize:0//边框大小
            };
            self.Set('BasicProperty', BasicProperty);
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
                HTMLRealTimeLable.width(200);
                HTMLRealTimeLable.height(40);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLRealTimeLable.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLRealTimeLable.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                ThisProPerty.BasciObj.removeClass("PanelSty");
                ThisProPerty.BasciObj.addClass("AutoFill_PanelSty");
                obj.html("");
            }
            if (_Target != null) {
                self.Render(_Target);
            }
            var StartPoint = { X: 0, Y: 0 };
            //撤销live
            $('#' + self.shell.ID).mousedown(function () {
                if (Agi.Edit) {
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
            if (HTMLRealTimeLable.touchstart) {
                HTMLRealTimeLable.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            self.Set("Position", PostionValue);
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = null;

            if (Agi.Edit) {
                HTMLRealTimeLable.resizable({
                // minHeight: 30
            }).css("position","absolute");
        }
            this.Set("ThemeName",null);//主题名称
    },
    Destory: function () {
        var HTMLElement = this.Get("HTMLElement");
        var proPerty = this.Get("ProPerty");
//        Agi.Edit.workspace.removeParameter(proPerty.ID);
        /*移除输出参数*/
//        Agi.Edit.workspace.controlList.remove(this);
        $("#" + HTMLElement.id).remove();
        HTMLElement = null;
        this.AttributeList.length = 0;
        proPerty = null;
        delete this;
    },
    CustomProPanelShow: function () {
        Agi.Controls.RealTimeLableProrityInit(this);
    },
    Copy: function () {
        if (layoutManagement.property.type == 1) {
            var ParentObj = this.shell.Container.parent();
            var PostionValue = this.Get("Position");
            var newRealTimeLablePositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
            var NewRealTimeLable = new Agi.Controls.RealTimeLable();
            NewRealTimeLable.Init(ParentObj, newRealTimeLablePositionpars);
            newRealTimeLablePositionpars = null;
            return NewRealTimeLable;
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
            this.Set("Position", _ThisPosition);
            PagePars = _ThisPosition = null;
        }
    },
    HTMLElementSizeChanged: function () {
        var Me = this;
        if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
            Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
        } else {
            Me.Refresh();
        }
        if (Agi.Controls.IsControlEdit) {
            Agi.Controls.RealTimeLableProrityInit(Me);
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
        /* $(this.Get("HTMLElement")).css({ "-webkit-box-shadow": "1px 1px 1px , -1px -1px 1px ",
        "-moz-box-shadow": "1px 1px 1px , -1px -1px 1px "
        });*/
    },
    ControlAttributeChangeEvent: function (_RealTimeLableobj, Key, _Value) {
        if (Key == "Position") {
            if (layoutManagement.property.type == 1) {
                var ThisHTMLElement = $("#" + _RealTimeLableobj.Get("HTMLElement").id);
                var ThisControlObj = _RealTimeLableobj.Get("ProPerty").BasciObj;
                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                var ThisControlPars = { Width: parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                    Height: parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))
                };
                ThisHTMLElement.width(ThisControlPars.Width);
                ThisHTMLElement.height(ThisControlPars.Height);
                ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height);
                PagePars = null;
            }
        }
        if (Key == "BasicProperty") {
            if (layoutManagement.property.type == 1) {
                _RealTimeState = false;
                var BasicProperty = _RealTimeLableobj.Get('BasicProperty');
                var controlObject = $(_RealTimeLableobj.Get('HTMLElement'));
                if(BasicProperty._LableBgColor!=null && BasicProperty._LableBgColor!=""){
                    if(typeof(BasicProperty._LableBgColor)==="string"){
                        controlObject.css("background","none");
                        controlObject.css("background-color", BasicProperty._LableBgColor);
                    }else{
                        controlObject.css("background-color","transparent");
                        controlObject.css(BasicProperty._LableBgColor.value);
                    }
                }
                //controlObject.find('.RealTimeLable').css("background-color", BasicProperty._LableBgColor);
                controlObject.find('.RealTimeLable').css("font-size", BasicProperty._LableFontSize + "px");

                controlObject.css("border-color", BasicProperty._LableBorderColor);
                controlObject.css("border-style","solid");
                controlObject.find('.RealTimeLable').css("text-indent", BasicProperty._TxtIndent+"px");//文本缩进
                controlObject.css("border-width", BasicProperty._LableBorderSize+"px");//边框大小

                controlObject.find('.RealTimeLable').css("color", BasicProperty._LableFontColor);
                controlObject.find('.RealTimeLable').css("font-weight", BasicProperty._FontWeight);
                controlObject.css("border-top-left-radius", BasicProperty._LabLT + "px");
                controlObject.css("border-top-right-radius", BasicProperty._LabRT + "px");
//                    controlObject.find('.selectPanelheadSty').css("border-top-left-radius", BasicProperty._LabLT + "px");
//                    controlObject.find('.selectPanelheadSty').css("border-top-right-radius", BasicProperty._LabRT + "px");
                controlObject.css("border-bottom-left-radius", BasicProperty._LabLB + "px");
                controlObject.css("border-bottom-right-radius", BasicProperty._LabRB + "px");
//                    controlObject.find('.selectPanelFooterSty').css("border-bottom-left-radius", BasicProperty._LabLB + "px");
//                    controlObject.find('.selectPanelFooterSty').css("border-bottom-right-radius", BasicProperty._LabRB + "px");
                //                if (!_RealTimeState) {
                //                    ChangeLableValue(BasicProperty, controlObject);
                //                }
            }
        }
    },
    GetConfig: function () {
        var ProPerty = this.Get("ProPerty");
        /*  var ConfigObj = new Agi.Script.StringBuilder();
        */
        /*配置信息数组对象*//*
             ConfigObj.append("<Control>");
             ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>");
             */
        /*控件类型*//*
             ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>");
             */
        /*控件属性*//*
             ConfigObj.append("<ControlBaseObj>" + ProPerty.BasciObj[0].id + "</ControlBaseObj>");
             */
        /*控件基础对象*//*
             ConfigObj.append("<HTMLElement>" + ProPerty.BasciObj[0].id + "</HTMLElement>");
             */
        /*控件的外壳HTML元素信息*//*
             ConfigObj.append("<Entity>" + JSON.stringify(this.Get("Entity")) + "</Entity>");
             */
        /*控件的外壳HTML元素信息*//*
             ConfigObj.append("<BasicProperty>" + JSON.stringify(this.Get("BasicProperty")) + "</BasicProperty>");
             */
        /*控件的基本属性信息*//*
             ConfigObj.append("<Position>" + JSON.stringify(this.Get("Position")) + "</Position>");
             */
        /*控件位置信息*//*
             ConfigObj.append("<ThemeInfo>" + JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>");
             */
        /*控件位置信息*//*
             ConfigObj.append("</Control>");
             return ConfigObj.toString(); //返回配置字符串*/
        var REaTimeLabelControl = {
            Control: {
                ControlType: null, //控件类型
                ControlID: null, //控件属性
                ControlBaseObj: null, //控件基础对象
                HTMLElement: null, //控件外壳ID
                Entity: null, //控件实体
                BasicProperty: null, //控件基本属性
                Position: null, //控件位置
                ThemeName: null
            }
        }
        REaTimeLabelControl.Control.ControlType = this.Get("ControlType");
        REaTimeLabelControl.Control.ControlID = ProPerty.ID;
        REaTimeLabelControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
        REaTimeLabelControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
        REaTimeLabelControl.Control.Entity = this.Get("Entity");
        REaTimeLabelControl.Control.BasicProperty = this.Get("BasicProperty");
        REaTimeLabelControl.Control.Position = this.Get("Position");
        REaTimeLabelControl.Control.ThemeName = this.Get("ThemeName");
        return REaTimeLabelControl.Control;
    }, //获得Panel控件的配置信息
    CreateControl: function (_Config, _Target) {
        if (_Config != null) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Target != null && _Target != "") {
                var _Targetobj = $(_Target);
                this.Set("Position", _Config.Position);

                this.Set("ThemeName",_Config.ThemeName);


                BasicProperty = _Config.BasicProperty;


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
                this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                this.Set("Entity", _Config.Entity);
            }
            if (BasicProperty._RealTimePoint != "") {
                Agi.Msg.PointsManageInfo.AddViewPoint({ "ControlID": ThisProPerty.ID, "Points": [BasicProperty._RealTimePoint] });
            }
            if (_Config.hasOwnProperty("ThemeName") && _Config.ThemeName!=null && _Config.ThemeName!="") {
                this.ChangeTheme(_Config.ThemeName);

                var ThisBasicProperty=this.Get("BasicProperty");
                Agi.Controls.RealTimeLableSyncTheme_Pro(ThisBasicProperty,BasicProperty);//同步属性
                this.Set("BasicProperty", BasicProperty);
            }else{
                this.Set("BasicProperty", BasicProperty);
            }
        }
    }, //根据配置信息创建控件
        ChangeTheme:function(_themeName){
             //1.获得当前控件类型和样式名称
            var RealTimeLableValue = Agi.layout.StyleControl.GetStyOptionByControlType(this.Get("ControlType"),_themeName);
            //2.样式属性
           this.Set("ThemeName",_themeName);
            //3.应用当前控件的信息
            Agi.Controls.RealTimeLable.OptionsAppSty(RealTimeLableValue,this);
        } //根据主题名称更改控件样式

}, true);
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */
Agi.Controls.RealTimeLable.OptionsAppSty = function(_StyConfig,_RealTimeLable){
     if(_StyConfig !=null){
         var controlObject = $(_RealTimeLable.Get('HTMLElement'));
         controlObject.css("background-color", _StyConfig._LableBgColor);
         controlObject.find('.RealTimeLable').css("font-size", _StyConfig._LableFontSize + "px");
         controlObject.find('.RealTimeLable').css("border-color", _StyConfig._LableBorderColor);
         controlObject.find('.RealTimeLable').css("color", _StyConfig._LableFontColor);
         controlObject.find('.RealTimeLable').css("font-weight", _StyConfig._FontWeight);
         controlObject.find('.RealTimeLable').css("text-indent", _StyConfig.textIndet);
//         controlObject.find('.RealTimeLable').css("border", _StyConfig.border);
         controlObject.css("border-top-left-radius", _StyConfig._LabLT + "px");
         controlObject.css("border-top-right-radius", _StyConfig._LabRT + "px");
//        controlObject.find('.selectPanelheadSty').css("border-top-left-radius", _StyConfig._LabLT + "px");
//        controlObject.find('.selectPanelheadSty').css("border-top-right-radius", _StyConfig._LabRT + "px");
         controlObject.css("border-bottom-left-radius", _StyConfig._LabLB + "px");
         controlObject.css("border-bottom-right-radius", _StyConfig._LabRB + "px");
//        controlObject.find('.selectPanelFooterSty').css("border-bottom-left-radius", _StyConfig._LabLB + "px");
//        controlObject.find('.selectPanelFooterSty').css("border-bottom-right-radius", _StyConfig._LabRB + "px");

         controlObject.css("background", _StyConfig.background);

         var ThisBasicProperty=_RealTimeLable.Get("BasicProperty");
         if(_StyConfig.background!=null && _StyConfig.background!=""){
             ThisBasicProperty._LableBgColor=_StyConfig.background;
         }else{
             ThisBasicProperty._LableBgColor=_StyConfig._LableBgColor;
         }
         if(ThisBasicProperty._LableBgColor!=null && ThisBasicProperty._LableBgColor!=""){
             if(ThisBasicProperty._LableBgColor.indexOf("(")>-1){
                 ThisBasicProperty._LableBgColor={
                     "type":2,
                     "direction":"vertical",
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
                         "background":ThisBasicProperty._LableBgColor
                     }
                 };
             }else{
                 ThisBasicProperty._LableBgColor={"type":1,"rgba":"","hex":ThisBasicProperty._LableBgColor,"ahex":"","value":{"background":""}};
             }
         }
         ThisBasicProperty._LableBorderColor=_StyConfig._LableBorderColor;
         ThisBasicProperty._LableFontColor=_StyConfig._LableFontColor;
         ThisBasicProperty._FontWeight=_StyConfig._FontWeight;
         ThisBasicProperty._TxtIndent=_StyConfig.textIndet;
         ThisBasicProperty._LabLT=_StyConfig._LabLT;
         ThisBasicProperty._LabRT=_StyConfig._LabRT;
         ThisBasicProperty._LabLB=_StyConfig._LabLB;
         ThisBasicProperty._LabRB=_StyConfig._LabRB;
     }
}
 //拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitRealTimeLable = function () {
    return new Agi.Controls.RealTimeLable();
}
//BasicChart 自定义属性面板初始化显示
Agi.Controls.RealTimeLableProrityInit = function (_RealTimeLable) {
    var BasicProperty = _RealTimeLable.Get('BasicProperty');
    var ThisProItems = [];
    //1.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //2.常规设置
    ItemContent = null; //update by zp 2012.12.28
    ItemContent = $('<div class="RealTimeLable_Pro_Panel">' +
    '<table  class="RlTimeLable_prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">背景色:</td><td class="RlTimeLable_prortityPanelTabletd1"><input type="text" class="BasicColor" data-field="_BgColor" id="_BgColor"/></td>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">透明色:</td><td class="RlTimeLable_prortityPanelTabletd1"><input type="checkbox" data-field="_bgCTransparent" id="_bgCTransparent" title="透明色"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">字体颜色</td><td type="text" class="RlTimeLable_prortityPanelTabletd1"><input class="BasicColor" data-field="_FontColor" id="_FontColor"/></td>' +
    //'<td class="RlTimeLable_prortityPanelTabletd0">边框色:</td><td type="text" class="RlTimeLable_prortityPanelTabletd1"><input class="BasicColor" style="display: none" data-field="_BorderColor" id="_BorderColor"/> </td>' +
    '</tr>' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">字体大小:</td><td  class="RlTimeLable_prortityPanelTabletd1"><input data-field="txtFontSize" id="txtFontSize" type="number" value="16" min="5" max="100"/></td>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">字体粗细:</td><td class="RlTimeLable_prortityPanelTabletd1"><select data-field="_FontWeight" id="_FontWeight"><option value="Normal">Normal</option><option value="bold">bold</option><option value="bolder">bolder</option><option value="lighter">lighter</option><option value="inherit">inherit</option></select></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">左上角半径:</td><td  class="RlTimeLable_prortityPanelTabletd1"><input data-field="LabLT" id="LabLT" type="number" value="0" min="0" max="100"/></td>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">右上角半径:</td><td class="RlTimeLable_prortityPanelTabletd1"><input data-field="LabRT" id="LabRT"type="number" value="0" min="0" max="100"/></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">左下角半径:</td><td  class="RlTimeLable_prortityPanelTabletd1"><input data-field="LabLB" id="LabLB" type="number" value="0" min="0" max="100"/></td>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">右下角半径:</td><td class="RlTimeLable_prortityPanelTabletd1"><input  data-field="LabRB" id="LabRB" type="number" value="0" min="0" max="100"></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">点位号:</td><td colspan="3" class="RlTimeLable_prortityPanelTabletd1"><input data-field="LabRealTime" id="LabRealTime" type="text" /></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">保留小数:</td><td  class="RlTimeLable_prortityPanelTabletd1"><select data-field="MLength" id="MLength"><option value="0">零位</option><option value="1">一位</option><option value="2">两位</option><option value="3">三位</option><option value="4">四位</option></select></td>' +
   '<td class="RlTimeLable_prortityPanelTabletd1"><input colspan="2" type="button" value="确定" id="btnRealTime"/> </td>' +
    '</tr>' +
    '</table>' +
    '</div>');
    var BasicObj = ItemContent;
    ItemContent == null;
    ItemContent = $('<div class="RealTimeLable_Pro_Panel">' +
    '<table  class="RlTimeLable_prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
    '<tr>' +
    '<td class="RlTimeLable_prortityPanelTabletd0">规则配置:</td><td colspan="3" class="RlTimeLable_prortityPanelTabletd1"><input type="button" id="_btnRules" value="..." /></td>' +
    '</tr>' +
    '</table>' +
    '</div>');
    var RealLableRules = ItemContent;
    ItemContent = null;
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: BasicObj }));
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "规则配置", DisabledValue: 1, ContentObj: RealLableRules }));
    //3.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //4.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        var itemtitle = _item.Title;
        if (_item.DisabledValue == 0) {
            itemtitle += "禁用";
        } else {
            itemtitle += "启用";
        }
        alert(itemtitle);
    }
    if (BasicProperty._LableBgColor == "Transparent") {
        $("#_bgCTransparent").attr("checked", true);
    }
    else {
        $("#_bgCTransparent").attr("checked", false);
    }
    $("#LableTitle").attr("checked", BasicProperty._Title);
    $("#LableTop").attr("checked", BasicProperty._Top);
    $("#LableContract").attr("checked", BasicProperty._Contract);
    $("#LableRounded").attr("checked", BasicProperty._Rounded);
    $("#txtFontSize").val(BasicProperty._LableFontSize);
    $("#_FontWeight").val(BasicProperty._FontWeight);
    $("#LabLT").val(BasicProperty._LabLT);
    $("#LabRT").val(BasicProperty._LabRT);
    $("#LabLB").val(BasicProperty._LabLB);
    $("#LabRB").val(BasicProperty._LabRB);
    $("#LabRealTime").val(BasicProperty._RealTimePoint);
    $("#_BgColor").val(BasicProperty._LableBgColor);
    $("#_FontColor").val(BasicProperty._LableFontColor);
    $("#_BorderColor").val(BasicProperty._LableBorderColor);
    $("#MLength").val(BasicProperty._Mlength);
    $('.BasicColor').spectrum({
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
            switch (pName) {
                case "_BgColor":
                    if (BasicProperty._LableBgColor == "Transparent")
                        $("#_bgCTransparent").attr("checked", true);
                    else
                        $("#_bgCTransparent").attr("checked", false);

                    BasicProperty._LableBgColor = color.toHexString();

                    break
                case '_FontColor':
                    BasicProperty._LableFontColor = color.toHexString();
                    break;
                case '_BorderColor':
                    BasicProperty._LableBorderColor = color.toHexString();
                    break;
            }
            _RealTimeLable.Set('BasicProperty', BasicProperty);
        }
    });
    $("#btnRealTime").click(function () {
        var RealTimePoint = $('.RealTimeLable_Pro_Panel').find("#LabRealTime").val();
        BasicProperty._RealTimePoint = RealTimePoint;
        _RealTimeLable.Set('BasicProperty', BasicProperty);
        Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": _RealTimeLable.Get("ProPerty").ID, "Points": [RealTimePoint] });
    });
    $('.RlTimeLable_prortityPanelTabletd1>input,.RlTimeLable_prortityPanelTabletd1>select').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "_bgCTransparent":
                if ($(this).attr("checked") == "checked") {
                    BasicProperty._LableBgColor = "Transparent";
                }
                else {
                    BasicProperty._LableBgColor = $("#_BgColor").val();
                }
                break;
            case "LableTitle":
                BasicProperty._Title = $(this).attr("checked") == "checked" ? true : false;
                break;
            case "LableTop":
                BasicProperty._Top = $(this).attr("checked") == "checked" ? true : false;
                break;
            case "LableContract":
                BasicProperty._Contract = $(this).attr("checked") == "checked" ? true : false;
                break;
            case "txtFontSize":
                BasicProperty._LableFontSize = $(this).val();
                break;
            case "_FontWeight":
                BasicProperty._FontWeight = $(this).val();
                break;
            case "LabLT":
                BasicProperty._LabLT = $(this).val();
                break;
            case "LabRT":
                BasicProperty._LabRT = $(this).val();
                break;
            case "LabLB":
                BasicProperty._LabLB = $(this).val();
                break;
            case "LabRB":
                BasicProperty._LabRB = $(this).val();
                break;
            case "MLength":
                BasicProperty._Mlength = $(this).val();
                break;
            case "_BgColor":
                if (BasicProperty._LableBgColor == "Transparent")
                    $("#_bgCTransparent").attr("checked", false);

                BasicProperty._LableBgColor = $("#_BgColor").val();
                break
        }
        _RealTimeLable.Set('BasicProperty', BasicProperty);
    });

    $("#_btnRules").click(function () {
        var currentControl = Agi.Edit.workspace.currentControls[0];
        BasicProperty = currentControl.Get('BasicProperty');
        var _GridParame = null;
        //$('#RealTimeLableParam').draggable({ handle: ".modal-header" });
        $('#RealTimeLableParam').draggable("disable");
        $('#RealTimeLableParam').modal({ backdrop: false, keyboard: false, show: true }); //加载弹出层
        var ParameCount = BasicProperty._ParameCount == undefined ? 0 : BasicProperty._ParameCount;
        $("#ParamTable>tbody>tr>td")[2].innerText = "规则个数:" + ParameCount;
        if (BasicProperty._StartParam) {
            $("#_Start").attr("checked", true);
            $("#_AddParam").attr("disabled", false);
        }
        else {
            $("#_Start").attr("checked", false);
            $("#_AddParam").attr("disabled", true);
        }
        _GridParame = BasicProperty._Param;
        BindGridParame(_GridParame);
    })
    $("#_Start").change(function () {
        if ($("#_Start").attr("checked") == "checked") {
            $("#_AddParam").attr("disabled", false);
        }
        else {
            $("#_AddParam").attr("disabled", true);
        }
    });
    $("#_AddParam").unbind("click").click(function () {
        var _GridParame = $("#GridParame").data("kendoGrid");
        $(_GridParame.tbody).append('<tr><td class="RlTimeLable_prortityPanelTabletd2">var</td><td class="RlTimeLable_prortityPanelTabletd2"><select id="txtOperation"><option value="大于">></option><option value="大于等于">>=</option>' +
            '<option value="小于"><</option><option value="小于等于"><=</option><option value="等于">==</option></select></td><td class="RlTimeLable_prortityPanelTabletd2"><input type="text" id="_txtKey"/></td>' +
            '<td class="RlTimeLable_prortityPanelTabletd2"><input type="text" id="_txtValue"/></td><td><input type="text" id="_txtColor" class="RealTimeLableTxtColorSty"/></td></tr>');
        $("#ParamTable>tbody>tr>td")[2].innerText = "规则个数:" + _GridParame.tbody.find("tr").length;

        //20130104 16:16 markeluo 实时Lable 新增规则时，需要能够变换字体颜色

        $(".RealTimeLableTxtColorSty").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                [ 'blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50','red'],
                [ 'yellow', 'green'],
                [ 'blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function(color){
                $(this).val(color.toHexString());
            }
        });
    });
    $("#_DelParam").unbind("click").click(function () {
        var _GridParame = $("#GridParame").data("kendoGrid");
        var RIndex = _GridParame.select().index();
        if (RIndex >= 0) {
            $("#GridParame>.k-grid-content tr:eq(" + RIndex + ")").remove();
            var currentControl = Agi.Edit.workspace.currentControls[0];
            //设置、显示规则个数

            $("#ParamTable>tbody>tr>td")[2].innerText = "规则个数:" + _GridParame.tbody.find("tr").length;
        }
    });
    $("#btnSaveParam").click(function () {
        //BasicProperty = _RealTimeLable.Get('BasicProperty');
        var currentControl = Agi.Edit.workspace.currentControls[0];
        BasicProperty = currentControl.Get('BasicProperty');
        BasicProperty._Param = [];
        BasicProperty._StartParam = $("#_Start").attr("checked") == "checked" ? true : false;
        var _GridParame = $("#GridParame").data("kendoGrid");
        var _ParameTr = $(_GridParame.tbody).find("tr");
        BasicProperty._ParameCount = _ParameTr.length;
        if (_ParameTr.length > 0) {
            for (var i = 0; i < _ParameTr.length; i++) {
                var _originalV = "var";
                var _Operation = $(_ParameTr[i]).find("#txtOperation").val();
                var _Key = $(_ParameTr[i]).find("#_txtKey").val();
                var _Value = $(_ParameTr[i]).find("#_txtValue").val();
                //20130104 16:16 markeluo 实时Lable 新增规则时，需要能够变换字体颜色
                var _TxtColor = $(_ParameTr[i]).find("#_txtColor").val();//文本颜色
                if(_TxtColor == ""){
                    _TxtColor="#000000";//默认颜色
                }
                BasicProperty._Param.push(
                { _originalV: _originalV, _Operation: _Operation, _Key: _Key, _Value: _Value,_TxtColor:_TxtColor}
                )
            }
        }
        currentControl.Set('BasicProperty', BasicProperty);
        $('#RealTimeLableParam').modal('hide');
    });

}
//实时标签 样式应用后的属性与新属性同步
Agi.Controls.RealTimeLableSyncTheme_Pro = function (ThisBasicProperty,BasicProperty){
    if(ThisBasicProperty._LableBgColor!=null && ThisBasicProperty._LableBgColor!=""){
        if(typeof(ThisBasicProperty._LableBgColor)==="string"){}else{
            if(BasicProperty._LableBgColor!=null && BasicProperty._LableBgColor!=""){
                if(typeof(BasicProperty._LableBgColor)==="string"){
                    BasicProperty._LableBgColor=ThisBasicProperty._LableBgColor;
                }
            }else{
                BasicProperty._LableBgColor=ThisBasicProperty._LableBgColor;
            }
        }
    }//背景色
    if(BasicProperty._LableFontSize!=null && parseInt(BasicProperty._LableFontSize)>0){}else{
        BasicProperty._LableFontSize=ThisBasicProperty._LableFontSize;
    }
    if(BasicProperty._LabLT!=null && parseInt(BasicProperty._LabLT)>0){}else{
        BasicProperty._LabLT=ThisBasicProperty._LabLT;
    }
    if(BasicProperty._LabRT!=null && parseInt(BasicProperty._LabRT)>0){}else{
        BasicProperty._LabRT=ThisBasicProperty._LabRT;
    }
    if(BasicProperty._LabLB!=null && parseInt(BasicProperty._LabLB)>0){}else{
        BasicProperty._LabLB=ThisBasicProperty._LabLB;
    }
    if(BasicProperty._LabRB!=null && parseInt(BasicProperty._LabRB)>0){}else{
        BasicProperty._LabRB=ThisBasicProperty._LabRB;
    }
    if(BasicProperty._TxtIndent!=null && parseInt(BasicProperty._TxtIndent)>0){}else{
        BasicProperty._TxtIndent=ThisBasicProperty._TxtIndent;
    }
    if(BasicProperty._LableBorderColor!=null && BasicProperty._LableBorderColor.length>0){}else{
        BasicProperty._LableBorderColor=ThisBasicProperty._LableBorderColor;
    }
    if(BasicProperty._LableFontColor!=null && BasicProperty._LableFontColor.length>0){}else{
        BasicProperty._LableFontColor=ThisBasicProperty._LableFontColor;
    }
}
function BindGridParame(_DataGridParame) {
    $("#GridParame").html("");
    $("#GridParame").kendoGrid({
        dataSource: {
            data: _DataGridParame
        },
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: false,
        pageable: false,
        columns: [{
            field: "_originalV",
            width: 40,
            title: "原值"
        }, {
            field: "_Operation",
            width: 80,
            title: "比较运算",
            template: "<select id='txtOperation'><option value='大于'>></option><option value='大于等于'>>=</option><option value='小于'><</option><option value='小于等于'><=</option><option value='等于'>==</option></select>"
        }, {
            field: "_Key",
            width: 60,
            title: "比较值",
            template: "<input type='text' id ='_txtKey'>"
        }, {
            field: "_Value",
            align: "center",
            width: 80,
            title: "显示文本",
            template: "<input type='text' id ='_txtValue'>"
        }, {
            field: "_txtColor",
            align: "center",
            width: 80,
            title: "文本颜色",
            template: "<input type='text' id ='_txtColor' class='RealTimeLableTxtColorSty'>"
        }]
    });
    var _GridParame = $("#GridParame").data("kendoGrid");
    var ParameTr = $(_GridParame.tbody.find("tr"));
    $(".RealTimeLableTxtColorSty").spectrum({
        showInput: true,
        showPalette: true,
        palette: [
            ['black', 'white'],
            [ 'blanchedalmond', 'rgb(255, 128, 0);'],
            ['hsv 100 70 50','red'],
            [ 'yellow', 'green'],
            [ 'blue', 'violet']
        ],
        cancelText: "取消",
        chooseText: "选择",
        change: function(color){
        }
    });
    for (var i = 0; i < ParameTr.length; i++) {
        $(ParameTr[i]).find("#txtOperation").val(_DataGridParame[i]._Operation);
        $(ParameTr[i]).find("#_txtKey").val(_DataGridParame[i]._Key);
        $(ParameTr[i]).find("#_txtValue").val(_DataGridParame[i]._Value);
        $(ParameTr[i]).find("#_txtColor").spectrum("set",_DataGridParame[i]._TxtColor);
    }
}