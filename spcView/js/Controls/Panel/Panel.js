/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-3
 * Time: 下午4:01
 * To change this template use File | Settings | File Templates.
 * Panel 容器控件
 */

/// <reference path="../../jquery-1.7.2.min.js" />

Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.Panel = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData: function () { //获得实体数据
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
                var panelIndex = menuManagement.getPanelControlIndex();
                $(ThisHTMLElement).css('z-index', panelIndex.max);
            }
            //激活控件载入事件
            self.fireScriptCode('loaded');
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }
        },
        ReadData: function (_EntityInfo) {
            AgiCommonDialogBox.Alert("此控件不支持实体数据！");
        },
        ReadRealData: function () {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
        },
        Init: function (_Target, _ShowPosition) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var Me = this;
            this.AttributeList = [];
            //this.Set("Entity", []);
            this.Set("ControlType", "Panel");
            var ID = "Panel" + Agi.Script.CreateControlGUID();
            var ThisProPerty = {
                ID: ID,
                BasciObj: $("<div recivedata='true' id='" + ID + "' class='PanelSty agi-panel'></div>"),
                IsUseStyle: false
            };
            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var PanelFilter = { LeftFillet1: 0, LeftFillet2: 0, RightFillet1: 0, RightFillet2: 0, FilterFrameWid: 0, FilterBgColor:{
                ahex: "00000000",
                hex: "000000",
                rgba: "rgba(0,0,0,0)",
                type: 1,
                value:{background:{"background-color": "rgba(0, 0, 0, 0)"}}
            }};
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };

            this.Set("ProPerty", ThisProPerty);
            this.Set("Entity", []);
            this.Set("HTMLElement", ThisProPerty.BasciObj[0]);
            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                ThisProPerty.BasciObj.width(PagePars.Width);
                ThisProPerty.BasciObj.height(PagePars.Height);
                ThisProPerty.BasciObj.width(200);
                ThisProPerty.BasciObj.height(200);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - ThisProPerty.BasciObj.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - ThisProPerty.BasciObj.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                ThisProPerty.BasciObj.removeClass("PanelSty");
                ThisProPerty.BasciObj.addClass("AutoFill_PanelSty");
                obj.html("");
            }
            if (_Target != null) {
                this.Render(_Target);
            }
            var StartPoint = { X: 0, Y: 0 }
            //            $("#" + ID).mousedown(function (ev) {
            //                Agi.Controls.BasicPropertyPanel.Show(this.id);
            //            });
            //撤销live
            $("#" + ID).mousedown(function (ev) {
                if (Agi.Edit) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);

                    var PanelFilter = Me.Get("PanelFilter");
                    PanelFilter.FilterIndex = $("#" + ID).css("z-index");
                    Me.FilterChange(PanelFilter);
                }
            });

            $('#' + ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    if (!self.IsPageView) {
                        Agi.Controls.ControlEdit(Me); //控件编辑界面
                    }
                }
            });
            if ($("#" + ID).touchstart) {
                $("#" + ID).touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            this.Set("Position", PostionValue);
            this.Set("PanelFilter", PanelFilter);


            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = PanelFilter = null;

            this.Set("ThemeName", null); //主题名称
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/

            //Agi.Edit.workspace.controlList.remove(this);
            //Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/
//            Agi.Controls.ControlDestoryByList(this); //移除控件,从列表中

            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        CustomProPanelShow: function () {
            Agi.Controls.PanelProrityInit(this);
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewPanel = new Agi.Controls.Panel();
                NewPanel.Init(ParentObj, newPanelPositionpars);
                newPanelPositionpars = null;
                return NewPanel;
            }
        },
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
                var ParentObj=$(this.Get("HTMLElement")).parent();
                //var ParentObj = $("#BottomRightCenterContentDiv");
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };
                var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);

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
        FilterChange: function (_Fillter) {debugger;
            if (_Fillter != null && _Fillter.LeftFillet1 != null && _Fillter.LeftFillet2 != null && _Fillter.RightFillet1 != null && _Fillter.RightFillet2 != null) {
                this.Set("PanelFilter", _Fillter);
                _Fillter = null;
            }
        },
        Refresh: function () {
            var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
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
            var ThisControlPars = {
                Width: parseInt(PagePars.Width - (PagePars.Width * (PostionValue.Left + PostionValue.Right))),
                Height: parseInt(PagePars.Height - (PagePars.Height * (PostionValue.Top + PostionValue.Bottom)))
            };
            ThisHTMLElement.width(ThisControlPars.Width);
            ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
        },
        Checked: function () {
            $("#" + this.Get("HTMLElement").id).css({
                "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $("#" + this.Get("HTMLElement").id).css({
                "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /*  $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
            "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
            });*/
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        EnterEditState: function (size) {debugger;
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            //修复边框设置为100以后高级属性设置界面中显示超出了显示区域。  yangyu  201302191820
            obj.height(100);
            obj.width(100);
            //obj.height(200);
            //obj.width(200);
            //           if(window.openDatabase){
            //               obj.height(280);
            //               obj.width(786);
            //           }
            //            //Sys.safari = ua.match(/version\/([\d.]+)/)[1];
            //            obj.height(300);
            //            obj.width(786);
            //  Mozilla/5.0 (Windows; U; Windows NT 5.2) AppleWebKit/525.13 (KHTML, like Gecko) Version/3.1 Safari/525.13
        },
        BackOldSize: function () {debugger;
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                var Me = this;
                obj.width(this.oldSize.width).height(this.oldSize.height);
                //                obj.resizable({
                //                    minHeight: 60,
                //                    minWidth: 80
                //                });

                var PanelFilter = Me.Get("PanelFilter");
                //        _Panel.Set("PanelFilter", PanelFilter);
                $("#" + this.Get('HTMLElement').id).css("z-index", PanelFilter.FilterIndex)
            }
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            var self = _obj;
            if (Key == "Position") {
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                    var ParentObj = ThisHTMLElement.parent();
                    var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                    ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                    ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                    ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                    ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                }
            }
            if (Key == "PanelFilter") {
                if (layoutManagement.property.type == 1) {
                    var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                    var theme = this.Get("ThemeName");
                    var ThisProPerty = this.Get("ProPerty");
                    if (_Value.FilterBgImage == "" && _Value.FilterBgColor.value.background == "") {//比那几属性时
                        this.ChangeTheme(theme);
                    }
                    ThisHTMLElement.css("border-top-left-radius", _Value.LeftFillet1 + "px");
                    ThisHTMLElement.css("border-top-right-radius", _Value.RightFillet1 + "px");
                    ThisHTMLElement.css("border-bottom-left-radius", _Value.LeftFillet2 + "px");
                    ThisHTMLElement.css("border-bottom-right-radius", _Value.RightFillet2 + "px");
                    if (_Value.hasOwnProperty("FilterBgColor") && _Value.FilterBgColor.value.background != "" && _Value.FilterBgColor.value.background != "hsv(0, 0%, 0%)") {
                        if (ThisProPerty.IsUseStyle != true) {
                            ThisHTMLElement.css("background", _Value.FilterBgColor.value.background);

                        }
                    }
                    //解决透明问题
                    else if (_Value.FilterBgColor.value.background == "" || _Value.FilterBgColor.value.background === "hsv(0, 0%, 0%)") {
                        if (ThisProPerty.IsUseStyle != true) {
                            ThisHTMLElement.css("background", "#000");
                        }
                    }
                    var ImgServiceAddress = Agi.ImgServiceAddress;
                    if (_Value.FilterBgImage.indexOf("http") == -1 && _Value.FilterBgImage != undefined && _Value.FilterBgImage != "") {
                        _Value.FilterBgImage = ImgServiceAddress + _Value.FilterBgImage;
                        ThisHTMLElement.css({
                            "background-image": "url(" + _Value.FilterBgImage + ")",
                            "background-color": "transparent"
                        });
                    }
                    else if (_Value.FilterBgImage.indexOf("http") >= 0 && _Value.FilterBgImage != undefined && _Value.FilterBgImage != "") {
                        ThisHTMLElement.css({
                            "background-image": "url(" + _Value.FilterBgImage + ")",
                            "background-color": "transparent"
                        });
                    }
                    ThisHTMLElement.css("background-position", "center");
                    ThisHTMLElement.css("background-repeat", "no-repeat");
                   //修改背景图片完整平铺问题。 yangyu 20130220
                    ThisHTMLElement.css("background-size", "100% 100%");
                   // ThisHTMLElement.css("background-size", "cover");
                    ThisHTMLElement.css("border-width", _Value.FilterFrameWid + "px");
                    ThisHTMLElement.css("border-style", "solid");
                    if (_Value.FilterBorderColor == "") {
                        ThisHTMLElement.css("border-color", "#000");
                    }
                    else {
                        ThisHTMLElement.css("border-color", _Value.FilterBorderColor);
                    }
                    ThisHTMLElement.css("z-index", _Value.FilterIndex);
                    if (ThisProPerty.IsUseStyle != true) {
                        if (_Value.FilterTransparent == "checked") {
                            ThisHTMLElement.css("background", "none");
                        }
                    }
                    _Value.FilterBgImage = _Value.FilterBgImage.substring(_Value.FilterBgImage.lastIndexOf("/") - 14, _Value.FilterBgImage.length); //保存地址
                }
            }
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            /*  var ConfigObj = new Agi.Script.StringBuilder();
            */
            /*配置信息数组对象*/
            /*
            ConfigObj.append("<Control>");
            ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>");
            */
            /*控件类型*/
            /*
            ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>");
            */
            /*控件属性*/
            /*
            ConfigObj.append("<ControlBaseObj>" + ProPerty.BasciObj[0].id + "</ControlBaseObj>");
            */
            /*控件基础对象*/
            /*
            ConfigObj.append("<HTMLElement>" + ProPerty.BasciObj[0].id + "</HTMLElement>");
            */
            /*控件的外壳HTML元素信息*/
            /*

            ConfigObj.append("<Entity>" + JSON.stringify(this.Get("Entity")) + "</Entity>");
            */
            /*控件的外壳HTML元素信息*/
            /*
            ConfigObj.append("<Position>" + JSON.stringify(this.Get("Position")) + "</Position>");
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("<PanelFilter>" + JSON.stringify(this.Get("PanelFilter")) + "</PanelFilter>");
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("<ThemeInfo>" + JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>");
            */
            /*控件z-index值*/
            /*
            ConfigObj.append("<ZIndex>" + $("#" + ProPerty.BasciObj[0].id).css("z-index") + "</ZIndex>");
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串*/
            var PanelContorl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件ID
                    ControlBaseObj: null, //控件对象
                    IsUseStyle: null,
                    HTMLElement: null, //控件的外壳HTML元素信息
                    Entity: null, // 实体
                    Position: null, // 控件位置信息
                    PanelFilter: null, //控件属性
                    ThemeInfo: null,
                    ZIndex: null,
                    ThemeName: null//主题名称
                }
            }// 配置信息数组对象
            PanelContorl.Control.ControlType = this.Get("ControlType");
            PanelContorl.Control.ControlID = ProPerty.ID;
            PanelContorl.Control.IsUseStyle = ProPerty.IsUseStyle;
            PanelContorl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            PanelContorl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            //PanelContorl.Control.Entity = this.Get("Entity");
            PanelContorl.Control.Position = this.Get("Position");
            PanelContorl.Control.PanelFilter = this.Get("PanelFilter");
            PanelContorl.Control.ThemeInfo = this.Get("ThemeInfo");
            PanelContorl.Control.ZIndex = $("#" + ProPerty.BasciObj[0].id).css("z-index");
            PanelContorl.Control.ThemeName = this.Get("ThemeName");
            //PanelContorl.Control.script = this.getScriptCode();
            return PanelContorl.Control; //返回配置字符串
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            //this.setScriptCode(_Config.script);
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    this.AttributeList = [];

                    var ThisProPerty = {
                        ID: _Config.ControlID,
                        BasciObj: $("<div id='" + _Config.ControlID + "' class='PanelSty agi-panel'></div>"),
                        IsUseStyle: _Config.IsUseStyle
                    };
                    this.Set("ProPerty", ThisProPerty);
                    this.Set("HTMLElement", ThisProPerty.BasciObj[0]);
                    this.Set("ThemeName", _Config.ThemeName);
                    this.Set("Entity", []);
                    this.Set("ControlType", "Panel");
                    if (_Target != null) {
                        if(!_Target.length){
                            _Target = $(_Target.selector);
                        }
                        this.Render(_Target);
                    }
                    $("#" + _Config.ControlID).css("z-index", _Config.ZIndex);

                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height() };
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);
                    var PostionValue = { Left: _Config.Position.Left, Top: _Config.Position.Top, Right: _Config.Position.Right, Bottom: _Config.Position.Bottom };
                    this.Set("Position", PostionValue);
                    _Config.PanelFilter.LeftFillet1 = parseFloat(_Config.PanelFilter.LeftFillet1); //左上角
                    _Config.PanelFilter.LeftFillet2 = parseFloat(_Config.PanelFilter.LeftFillet2); //左下角
                    _Config.PanelFilter.RightFillet1 = parseFloat(_Config.PanelFilter.RightFillet1); //右上角
                    _Config.PanelFilter.RightFillet2 = parseFloat(_Config.PanelFilter.RightFillet2); //右下角
                    if (_Config.PanelFilter.hasOwnProperty("FilterBgImage") && _Config.PanelFilter.FilterBgImage != "") { // 有主题的时候不执行
                        var ImgServiceAddress = Agi.ImgServiceAddress; //获取服务器图片路径
                        var imgFile = _Config.PanelFilter.FilterBgImage;
                        if (imgFile.indexOf("http") != -1) {
                            imgFile = imgFile.substring(imgFile.lastIndexOf("/") - 14, imgFile.length); //图片文件夹
                        }
                        _Config.PanelFilter.FilterBgImage = ImgServiceAddress + imgFile;
                    }
                    if (_Config.hasOwnProperty("ThemeName") && ThisProPerty.IsUseStyle == true) {
                        this.ChangeTheme(_Config.ThemeName);
                    }
                    var PanelFilter = { LeftFillet1: _Config.PanelFilter.LeftFillet1, RightFillet1: _Config.PanelFilter.RightFillet1, LeftFillet2: _Config.PanelFilter.LeftFillet2, RightFillet2: _Config.PanelFilter.RightFillet2, FilterBgColor: _Config.PanelFilter.FilterBgColor, FilterBgImage: _Config.PanelFilter.FilterBgImage, FilterBorderColor: _Config.PanelFilter.FilterBorderColor, FilterFrameWid: _Config.PanelFilter.FilterFrameWid, FilterIndex: _Config.PanelFilter.FilterIndex, FilterTransparent: _Config.PanelFilter.FilterTransparent };

                    this.Set("PanelFilter", PanelFilter);
                    //                    if (_Config.PanelFilter.FilterBgImage != undefined && _Config.PanelFilter.FilterBgImage != "") {
                    //                        $("#" + this.Get("HTMLElement").id).css({
                    //                            "background-image": "url(" + _Config.PanelFilter.FilterBgImage + ")",
                    //                            "background-color": "transparent"
                    //                        });
                    //                    }
                    //                    if (_Config.PanelFilter.FilterTransparent == "checked") {
                    //                        $("#" + this.Get("HTMLElement").id).css("background", "none");
                    //                    }
                    $("#" + _Config.ControlID).mousedown(function (ev) {
                        if (Agi.Edit) {
                            ev.stopPropagation();
                            Agi.Controls.BasicPropertyPanel.Show(this.id);
                        }
                    });

                    var Me = this;
                    $('#' + _Config.ControlID).dblclick(function (ev) {
                        if (!Agi.Controls.IsControlEdit) {
                            if (!self.IsPageView) {
                                Agi.Controls.ControlEdit(Me); //控件编辑界面
                            }
                        }
                    });
                    //this.Set("Entity", _Config.Entity);
                }
            }
        }, //根据配置信息创建控件
        ChangeTheme: function (_themeName) {
            var Me = this;
            //1.根据当前控件类型和样式名称获取样式信息
            var PanelStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //2.保存主题名称
            Me.Set("ThemeName", _themeName);
            //3.应用当前控件的PanelFilter信息
            Agi.Controls.Panel.OptionsAppSty(PanelStyleValue, Me);
            //5.控件刷新显示
            //    Me.Refresh();//刷新显示

            //  PanelStyleValue=null;

        } //更改控件样式
    }, true);
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */
    Agi.Controls.Panel.OptionsAppSty = function (_StyConfig, _Panel) {
        if (_StyConfig != null) {
            var ThisHTMLElement = $("#" + _Panel.Get("HTMLElement").id);
            //        ThisHTMLElement.css("border-top-left-radius", _StyConfig.LeftFillet1 + "px");
            //        ThisHTMLElement.css("border-top-right-radius", _StyConfig.RightFillet1 + "px");
            //        ThisHTMLElement.css("border-bottom-left-radius", _StyConfig.LeftFillet2 + "px");
            //        ThisHTMLElement.css("border-bottom-right-radius", _StyConfig.RightFillet2 + "px");
            ThisHTMLElement.css("background-color", "none");
            ThisHTMLElement.css("background", _StyConfig.background);
            var self = _Panel;
            var ThisProPerty = self.Get("ProPerty");
            ThisProPerty.IsUseStyle = true;
            //        var ImgServiceAddress = Agi.ImgServiceAddress;
            //        if( _StyConfig.hasOwnProperty("FilterBgImage")){
            //            if( _StyConfig.FilterBgImage.indexOf("http") == -1){
            //                _StyConfig.FilterBgImage = ImgServiceAddress+_StyConfig.FilterBgImage;
            //                ThisHTMLElement.css("background-image", "url("+_StyConfig.FilterBgImage + ")");
            //            }
            //        }
            //        ThisHTMLElement.css("background-position", "center");
            //        ThisHTMLElement.css("background-repeat", "no-repeat");
            //        ThisHTMLElement.css("background-size", "cover");
            //        ThisHTMLElement.css("border-width", _StyConfig.FilterFrameWid + "px");
            //        ThisHTMLElement.css("border-style", "solid");
            //        ThisHTMLElement.css("border-color", _StyConfig.FilterBorderColor);
            //        ThisHTMLElement.css("z-index", _StyConfig.FilterIndex);

        }
    }

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitPanel = function () {
    return new Agi.Controls.Panel();
}
//var _Panel;
//BasicChart 自定义属性面板初始化显示
Agi.Controls.PanelProrityInit = function (prortityPanel) {debugger;
    var _Panel = prortityPanel;
    var Me = this;
    var ThisProItems = [];
    var PanelFilter = _Panel.Get("PanelFilter");
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //1.圆角设置
    ItemContent = null;
    ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='Panel_Pro_Panel'>");
    ItemContent.append("<table class='Panel_prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>左上角半径:</td><td class='Panel_prortityPanelTabletd1'><input id='LeftFillet1' type='number' value='0' min='0' max='100' class='ControlProNumberSty' defaultvalue='0'/></td>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>右上角半径</td><td class='Panel_prortityPanelTabletd1'><input id='RightFillet1' type='number' value='0' min='0' max='100' class='ControlProNumberSty' defaultvalue='0'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>左下角半径:</td><td class='Panel_prortityPanelTabletd1'><input id='LeftFillet2' type='number' value='0' min='0' max='100' class='ControlProNumberSty' defaultvalue='0'/></td>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>右下角半径:</td><td class='Panel_prortityPanelTabletd1'><input id='RightFillet2' type='number' value='0' min='0' max='100' class='ControlProNumberSty' defaultvalue='0'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>边框颜色:</td><td class='Panel_prortityPanelTabletd2'><input type='text' id='FilterBorderColor' /></td>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>自定义索引:</td><td class='Panel_prortityPanelTabletd2'><input id='FilterIndex' defaultvalue='0' type='number' min='0' max='5000' class='ControlProNumberSty'></td>");
//    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>启用阴影:</td><td class='Panel_prortityPanelTabletd1'><input id='FilterShadow' type='checkbox' name='name'/></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    //20130401 倪飘 解决bug，隐藏是否显示阴影属性
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>边框宽度:</td><td class='Panel_prortityPanelTabletd2'><input id='FilterFrameWid' type='number' min='0' value='0' max='100' class='ControlProNumberSty' defaultvalue='0'></td>");
//    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>背景颜色:</td><td class='Panel_prortityPanelTabletd2'><input id='FilterBgColor' type='text' class='basic input-mini' ></td>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>背景设置:</td><td class='Panel_prortityPanelTabletd2'><div id='FilterBgColor' style='background-color:rgba(0, 0, 0, 0);' class='ControlColorSelPanelSty'></div></td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
//    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>自定义索引:</td><td colspan='3' class='Panel_prortityPanelTabletd2'><input id='FilterIndex' defaultvalue='0' type='number' min='0' max='5000' class='ControlProNumberSty'><input id='FilterTransparent' type='checkbox' style='display: none;'/></td>");
//    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>背景透明:</td><td class='Panel_prortityPanelTabletd1'><input id='FilterTransparent' type='checkbox'/></td>")
    ItemContent.append("</tr>");
    ItemContent.append("<tr style='display: none;'>");
    ItemContent.append("<td class='Panel_prortityPanelTabletd0'>背景图片:</td><td class='Panel_prortityPanelTabletd2' colspan='3'><input id='BgImagePath' type='text' style='width:100px;' readonly='readonly'><input type='button' id='ChoseBgImageBtn' style='width:100px;' class='btn btn-small' value='选择背景图片'/><input type='button' id='ClearBgImageBtn' value='清除图片' class='btn btn-small' /></td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    var FilletObj = $(ItemContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "圆角设置", DisabledValue: 1, ContentObj: FilletObj }));

    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        var itemtitle = _item.Title;
        if (_item.DisabledValue == 0) {
            itemtitle += "禁用";
        } else {
            itemtitle += "启用";
        }
        AgiCommonDialogBox.Alert(itemtitle);
    }
    var ImgServiceAddress = Agi.ImgServiceAddress;
    $("#LeftFillet1").val(PanelFilter.LeftFillet1);
    $("#RightFillet1").val(PanelFilter.RightFillet1);
    $("#LeftFillet2").val(PanelFilter.LeftFillet2);
    $("#RightFillet2").val(PanelFilter.RightFillet2);
//    $("#FilterBgColor").val(PanelFilter.FilterBgColor); //背景色颜色控件替换
    //Agi.Controls.ControlColorApply.fColorControlValueSet("FilterBgColor",PanelFilter.FilterBgColor,true);
    if (PanelFilter.hasOwnProperty("FilterBgImage") && PanelFilter.FilterBgImage != "" && PanelFilter.FilterBgImage !== undefined) {//编辑
        if (PanelFilter.FilterBgImage.indexOf("//192") == -1) {
            PanelFilter.FilterBgImage = ImgServiceAddress + PanelFilter.FilterBgImage;
            //20130401 倪飘 解决bug，容器框控件双击修改背景图片名称为'头部'，点击确定后，背景设置框中显示的却是黑色
            Agi.Controls.ControlColorApply.fColorControlValueSet("FilterBgColor", PanelFilter.FilterBgImage, true);
        }
    }
    $("#BgImagePath").val(PanelFilter.FilterBgImage);
    $("#FilterBorderColor").val(PanelFilter.FilterBorderColor);
    $("#FilterFrameWid").val(PanelFilter.FilterFrameWid);
    $("#FilterIndex").val(PanelFilter.FilterIndex);
//    $("#FilterTransparent").attr("checked", PanelFilter.FilterTransparent);
//    $("#FilterTransparent").unbind().bind('change', function () {
//        $("#BgImagePath").val("");
//        var ThisProPerty = _Panel.Get("ProPerty");
//        ThisProPerty.IsUseStyle = false;
//        _Panel.Set("ProPerty", ThisProPerty);
//        //20130227 nipiao 修改武汉bug480
//        if ($(this).attr('checked')) {
//            _Panel.Set("ThemeName", null);
//        }
//        SetFillet();
//    });
    $("#LeftFillet1").change(function () {
        SetFillet();
    });
    $("#RightFillet1").change(function () {
        SetFillet();
    });
    $("#LeftFillet2").change(function () {
        SetFillet();

    });
    $("#RightFillet2").change(function () {
        SetFillet();
    });
    $("#FilterFrameWid").change(function () {
        SetFillet();
    });
//    $("#FilterBgColor").spectrum({
//        showInput: true,
//        showPalette: true,
//        palette: [
//            ['black', 'white'],
//            ['blanchedalmond', 'rgb(255, 128, 0);'],
//            ['hsv 100 70 50', 'red'],
//            ['yellow', 'green'],
//            ['blue', 'violet']
//        ],
//        cancelText: "取消",
//        chooseText: "选择",
//        change: function (color) {
//            $("#FilterBgColor").val(color.toHexString());
//            var ThisProPerty = _Panel.Get("ProPerty");
//            ThisProPerty.IsUseStyle = false;
//            SetFillet();
//        }
//    });
    $("#FilterBgColor").css(PanelFilter.FilterBgColor.value).data('colorValue',PanelFilter.FilterBgColor);
    $("#FilterBgColor").unbind().bind("click",function(){
        var oThisSelColorPanel=this;
        Agi.Controls.ControlColorApply.fEditColor(oThisSelColorPanel,[],true,function(color){debugger;
            var BgColorValue=Agi.Controls.ControlColorApply.fBackgroundColorFormat(color);
            PanelFilter.FilterBgColor=color;
            _Panel.Set("PanelFilter",PanelFilter);
            if(BgColorValue.ColorType!=3){
                $("#BgImagePath").val("");
                $(oThisSelColorPanel).css("background",color.value.background).data('colorValue', color);
            }else{
                $("#BgImagePath").val(BgColorValue.Imgurl);
                $(oThisSelColorPanel).css(BgColorValue.BackGroundImg).data('colorValue', color);
            }
            if(BgColorValue.BolIsTransfor!="false"){//透明
                $("#FilterTransparent").attr("checked",true);
                if ($("#FilterTransparent").attr('checked')) {
                }else
                {
                    //FilterTransparent
                    $('#FilterTransparent').triggerHandler('change');
                }
            }else{
                $("#FilterTransparent").attr("checked",false);
                if ($("#FilterTransparent").attr('checked')) {
                    //FilterTransparent
                    $('#FilterTransparent').triggerHandler('change');
                }
            }


            var ThisProPerty = _Panel.Get("ProPerty");
            ThisProPerty.IsUseStyle = false;
            SetFillet();

            oThisSelColorPanel=null;
        });
    });

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
            SetFillet();
        }
    });
    //1.先创建选择背景图片的dom元素
    var PanelImgBroser = "<div class='modal hide' id='PannelShowAllServerImage'><div class='modal-header paramHeader'>" +
        "<button type='button' class='close' data-dismiss='modal'></button><p>背景图片</p></div>" +
        "<div class='paramBody'><div class='Popup1'><div id='PannelShowImg'></div></div></div>" +
        "<div class='modal-footer'><span id='PannelselectImageAlert' style='color: red;float: left'></span>" +
        "<input type='button' value='确     定' id='PannelSlectedImg' class='PopupBtn'/><input type='button' value='取     消' id='PannelCancelImg' class='PopupBtn'/></div></div>";
    $("#ChoseBgImageBtn").click(function () {
        if ($("#PannelShowAllServerImage").length > 0) {
            $("#PannelShowAllServerImage").remove();
        }
        $(PanelImgBroser).appendTo($(document.body));
        /*提示请选择背景图片*/
        $("#PannelselectImageAlert").text("");
        Agi.BgImageManage.AllBackgroundImg(function (result) {
            if (result.result == "true") {
                var AllImages = result.listData;


                var AllImageStr = "<ul class='showimgfaceul' id='SelectPanelBG'>";
                for (var i = 0; i < AllImages.length; i++) {
                    var path = Agi.ImgServiceAddress + AllImages[i];
                    var imgp = path.split('/');
                    AllImageStr += "<li title='" + imgp[5] + "'><a href='#'><img src='" + path + "'></img></a></li>";

                }
                AllImageStr += "</ul>";

                $("#PannelShowImg").html(AllImageStr);

                $('#PannelShowAllServerImage').modal({ backdrop: true, keyboard: false, show: true }); //加载弹出层
                $('#PannelShowAllServerImage').draggable({
                    handle: ".modal-header"
                });
                $('#PannelShowAllServerImage').find("#PannelSlectedImg").unbind().bind("click", function () {
                    /*提示请选择背景图片*/
                    if (testpath === undefined) {
                        $("#PannelselectImageAlert").text("请选择背景图片！");
                        $("#PannelShowAllServerImage").modal({ backdrop: true, keyboard: false, show: true });
                        return;
                    }
                    $("#BgImagePath").val(testpath);
                    SetFillet();
                    $("#PannelShowAllServerImage").modal('hide');
                    $(prortityPanel.Get('HTMLElement')).css('background-color', 'transparent');
                });
                $('#PannelShowAllServerImage').find("#PannelCancelImg").unbind().bind("click", function () {
                    $("#" + Me.EditControlElementID).css("background-image", "url(" + PanelFilter.FilterBgImage + ")");
                    $("#BgImagePath").val(PanelFilter.FilterBgImage);
                    SetFillet();
                    $("#PannelShowAllServerImage").modal('hide');
                });
            } else {
                alert("当前服务器没有可使用的图片！");
                return false;
            }
        });
    });
    var testpath;
    $("#SelectPanelBG").find("a").live('click', function () {
        var curr = this;
        $("#" + Me.EditControlElementID).css("background-image", "url(" + $(this).find("img").attr("src") + ")");
        testpath = $(this).find("img").attr("src");
        $("#" + Me.EditControlElementID).css("background-position", "center");
        $("#" + Me.EditControlElementID).css("background-repeat", "no-repeat");
        //$("#" + Me.EditControlElementID).css("background-size", "cover");
         //修改背景图片完整平铺问题。 yangyu 20130220
        $("#" + Me.EditControlElementID).css("background-size", "100% 100%");
    });

    $("#ClearBgImageBtn").click(function () {
        $("#BgImagePath").val("");
        $("#" + Me.EditControlElementID).css("background-image", "url(undefined)");
        SetFillet();
    });

    $("#FilterIndex").change(function () {
        var rows = parseInt($("#FilterIndex").val());
        if (isNaN(rows) || rows > 5000 || rows < 0) {
            return;
        }
        SetFillet();
    });
}

function SetFillet() {
    var LeftFillet1 = parseInt($("#LeftFillet1").val());
    var RightFillet1 = parseInt($("#RightFillet1").val());
    var LeftFillet2 = parseInt($("#LeftFillet2").val());
    var RightFillet2 = parseInt($("#RightFillet2").val());

//    var FilterBgColor = $("#FilterBgColor").val();
    var PanelFilter=Agi.Edit.workspace.currentControls[0].Get("PanelFilter");

    //修改透明情况下选择背景图片 地址栏显示错误。yangyu  20130220
    var FilterTransparent;
    if ($("#FilterTransparent").attr("checked") == "checked") {
        FilterTransparent = "checked";
        $("#BgImagePath").val("");
    } else {
        FilterTransparent = null;
    }
    var FilterBgImage = $("#BgImagePath").val();
    // alert("获取的路径"+FilterBgImage);
    // if(PanelFilter.hasOwnProperty("FilterBgImage") == true && PanelFilter.FilterBgImage.indexOf("//192") !=-1){//编辑
    FilterBgImage = FilterBgImage.substring(FilterBgImage.lastIndexOf("/") - 14, FilterBgImage.length);
    // }
    // alert("保存的地址不保存服务器地址"+FilterBgImage);
    var FilterBorderColor = $("#FilterBorderColor").val();
    var FilterFrameWid = parseInt($("#FilterFrameWid").val());
    var FilterIndex = $("#FilterIndex").val();

//    if ($("#FilterTransparent").attr("checked") == "checked") {
//        FilterTransparent = "checked";
//        $("#BgImagePath").val("");
//    } else {
//        FilterTransparent = null;
//    }

    if ((LeftFillet1 >= 0 && RightFillet1 >= 0 && LeftFillet2 >= 0 && RightFillet2 >= 0) &&
        (LeftFillet1 <= 100 && RightFillet1 <= 100 && LeftFillet2 <= 100 && RightFillet2 <= 100) &&
        (FilterFrameWid >= 0 && FilterFrameWid <= 100)) {
        var PanelFilter = { LeftFillet1:LeftFillet1, RightFillet1:RightFillet1, LeftFillet2:LeftFillet2, RightFillet2:RightFillet2, FilterBgColor:PanelFilter.FilterBgColor, FilterBgImage:FilterBgImage, FilterBorderColor:FilterBorderColor, FilterFrameWid:FilterFrameWid, FilterIndex:FilterIndex, FilterTransparent:FilterTransparent };
              //  _Panel.Set("PanelFilter", PanelFilter);
        Agi.Edit.workspace.currentControls[0].FilterChange(PanelFilter)
    } else {
        if (FilterFrameWid < 0 || FilterFrameWid > 100 || isNaN(FilterFrameWid)) {
            AgiCommonDialogBox.Alert("您输入的数值不在0-100范围内，将恢复默认值0!");
            $("#FilterFrameWid").val(0);
            SetFillet();
        }
        if (LeftFillet1 < 0 || LeftFillet1 > 100 || isNaN(LeftFillet1)) {
            AgiCommonDialogBox.Alert("您输入的数值不在0-100范围内，将恢复默认值0!");
            $("#LeftFillet1").val(0);
            SetFillet();
        }
        if (RightFillet1 < 0 || RightFillet1 > 100 || isNaN(RightFillet1)) {
            AgiCommonDialogBox.Alert("您输入的数值不在0-100范围内，将恢复默认值0!");
            $("#RightFillet1").val(0);
            SetFillet();
        }
        if (LeftFillet2 < 0 || LeftFillet2 > 100 || isNaN(LeftFillet2)) {
            AgiCommonDialogBox.Alert("您输入的数值不在0-100范围内，将恢复默认值0!");
            $("#LeftFillet2").val(0);
            SetFillet();
        }
        if (RightFillet2 < 0 || RightFillet2 > 100 || isNaN(RightFillet2)) {
            AgiCommonDialogBox.Alert("您输入的数值不在0-100范围内，将恢复默认值0!");
            $("#RightFillet2").val(0);
            SetFillet();
        }
    }
}
