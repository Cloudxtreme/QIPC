/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 13-4-16
 * Time: 上午9:15
 * To change this template use File | Settings | File Templates.
 * * Container 容器控件
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.Container = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        RunAnimate: function () {
            if (!Agi.Edit) {
                //console.log('enter run animate!');
                var self = this;
                var direction = self.configuration.animate;
                agi.using(["jquery/transit"], function (animate) {
                    //console.log('agi using transit is ok!');
                    var target = { opacity: 1 };
                    switch (direction) {
                        case 'left':
                            //hidePos
                            target.left = self.htmlElement.css('left');
                            self.htmlElement.css({ opacity: 0, left: -900 });
                            break;
                        case 'right':
                            //hidePos
                            target.left = self.htmlElement.css('left');
                            self.htmlElement.css({ opacity: 0, left: 900 });
                            break;
                        case 'up':
                            target.top = self.htmlElement.css('top');
                            self.htmlElement.css({ opacity: 0, top: -900 });
                            break;
                        case 'down':
                            target.top = self.htmlElement.css('top');
                            self.htmlElement.css({ opacity: 0, top: 900 });
                            break;
                        case 'slowIn':
                            self.htmlElement.css({ opacity: 0 });
                            break;
                    }
                    self.htmlElement.transition(target, self.configuration.animateSpeed);
                    //console.log('Runed Animate');
                });
            }
        },
        ApplyProperty: function () {
            var self = this;
            var htmlElement = Agi.Controls.IsControlEdit ? self.editClone : self.htmlElement;
            htmlElement.css({
                'border-top-left-radius': self.configuration.leftTop + 'px',
                'border-top-right-radius': self.configuration.rightTop + 'px',
                'border-bottom-left-radius': self.configuration.leftBottom + 'px',
                'border-bottom-right-radius': self.configuration.rightBottom + 'px'
            }).css('border', self.configuration.borderWidth + 'px solid ' + self.configuration.borderColor.value.background)
                .css(self.configuration.backColor.value);
        },
        RemoveChildControl: function (controlID) {
            var len = this.childControls.length;
            var delIndex = -1;
            for (var i = 0; i < len; i++) {
                var con = this.childControls[i];
                if (con.Get('ProPerty').ID === controlID) {
                    delIndex = i;
                    break;
                }
            }
            this.childControls.splice(delIndex, 1);
        },
        Render: function (_Target) {
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }

            var ThisHTMLElement = self.Get("HTMLElement");
            if (self.configuration.animate !== 'none' && !Agi.Edit) {
                $(ThisHTMLElement).css('opacity', '0');
            }
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj);
                self.htmlElement = $(ThisHTMLElement);
            }
            this.ApplyProperty();
            if (Agi.Edit) {//更新左侧控件的拖拽目标
                for (var i = 0; i < dragControlItems.length; i++) {
                    dragControlItems[i].dropTargets = $('#BottomRightCenterContentDiv div[container="true"],#BottomRightCenterContentDiv');
                }
            }
        },
        GetBlankClone: function () {
            this.UnChecked();
            //20130503 倪飘 解决bug，容器控件中设置边框宽度为100时候控件会盖住属性设置面板；
            //进入属性面板时将宽度和高度调小，将不会随着变宽增而盖住属性面板
            return this.htmlElement.clone().html('').css({
                width: '50%', height: '30%'
            });
        },
        Init: function (_Target, _ShowPosition, savedId, propertyConfig) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            this.shell = null;
            this.IsEditState = false;
            this.IsChangeEntity = false;
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "Container");
            this.childControls = [];

            this.configuration = {
                leftTop: 0,
                rightTop: 0,
                leftBottom: 0,
                rightBottom: 0,
                borderColor: { "type": 1, "rgba": "rgba(0,0,0,1)", "hex": "000000", "ahex": "000000ff", "value": { "background": "rgba(0,0,0,1)"} },
                borderWidth: 0,
                backColor: { "type": 1, "rgba": "rgba(86,170,255,1)", "hex": "56aaff", "ahex": "56aaffff", "value": { "background": "rgba(86,170,255,1)"} },

                animate: 'none',
                animateSpeed: 1000
            };
            if (propertyConfig) {
                this.configuration = propertyConfig;
            }
            var ID = savedId ? savedId : "Panel_Container" + Agi.Script.CreateControlGUID();
            //var HTMLElementPanel=$("<div id='Panel_"+ID+"' class='PanelSty selectPanelSty'><div id='head_"+ID+"' class='selectPanelheadSty'></div></div>");
            var HTMLElementPanel = $('<div style="width: 500px;height: 350px;padding-right: 6px;padding-bottom: 6px;" recivedata="false" id="' + ID + '" class="PanelSty selectPanelSty" container="true"></div>');
            HTMLElementPanel.css(this.configuration.backColor.value);

            this.Set("HTMLElement", HTMLElementPanel[0]);
            var ThisProPerty = {
                ID: ID.replace('Panel_', ''),
                BasciObj: HTMLElementPanel
            };

            var BasicProperty = {
                selectTextField: undefined,
                selectValueField: undefined,
                controlBgColor: "#E3E3E3", //背景色
                dropdownMenuBgColor: "#FFF", //菜单背景色
                fontColor: "#000", //字体色;

                borderColor: '#000000', //边框颜色
                borderWidth: '0', //边框宽
                borderRadius: '0'//圆角
            };
            //this.Set('BasicProperty', BasicProperty);

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
            HTMLElementPanel.mousedown(function (ev) {
                if (Agi.Edit) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

            HTMLElementPanel.dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    if (Agi.Edit) {
                        Agi.Controls.ControlEdit(self); //控件编辑界面
                    }
                }
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    //Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);
            //            //输出参数
            //            this.Set("SelValue", 0);
            //            if (Agi.Edit) {
            //                //缩小的最小宽高设置
            //                HTMLElementPanel.resizable({
            //                    minHeight: self.minHeight,
            //                    minWidth: self.minWidth,
            //                    maxHeight: self.minHeight
            //                }).css("position","absolute");
            //                $('#' + self.shell.ID + ' .ui-resizable-handle').css('z-index', 2000);
            //            } else {
            //            }
            //obj = ThisProPerty = PagePars = PostionValue = null;

            //            Agi.Msg.PageOutPramats.AddPramats({
            //                'Type': Agi.Msg.Enum.Controls,
            //                'Key': ID,
            //                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1}]
            //            });
            //20130515 倪飘 解决bug，组态环境中拖出容器控件以后以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.ContainerProrityInit(this);
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
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.htmlElement.parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) };
                var NewContainer = new Agi.Controls.Container();
                NewContainer.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewContainer;
            } else {

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
                var ParentObj = ThisHTMLElement.parent(); // $('#BottomRightCenterContentDiv');
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
            //$('#'+this.shell.BasicID).find('.dropdown:eq(0)')
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
            ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
            this.Set("Position", PostionValue);
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
            this.htmlElement.css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            this.htmlElement.css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /*  $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
            "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        EnterEditState: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
        },
        BackOldSize: function () {
        },
        ExtEdit: function () {
            this.ApplyProperty();
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.ContainerAttributeChange(this, Key, _Value);
        },
        ChangeTheme: function (_themeName) {
            if (!_themeName) {
                return;
            }
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.Container.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var config = {
                ControlType: null, //控件类型
                ControlID: null, //控件属性
                ControlBaseObj: null, //控件基础对象
                HTMLElement: null, //控件外壳ID
                BasicProperty: null, //控件基本属性
                Position: null, //控件位置
                ThemeInfo: null,
                parentId: null,
                childControlConfigs: []//子控件的配置
            };
            config.ControlType = this.Get("ControlType");
            config.ControlID = ProPerty.ID;
            config.ControlBaseObj = ProPerty.BasciObj[0].id;
            config.HTMLElement = ProPerty.BasciObj[0].id;
            config.configuration = this.configuration;
            config.Position = this.Get("Position");
            config.ThemeInfo = this.Get("ThemeInfo");
            config.parentId = this.parentId;
            config.ChildControlCount = this.childControls.length;
            for (var i = 0; i < this.childControls.length; i++) {
                var conf = this.childControls[i].GetConfig();
                conf.parentId = this.childControls[i].parentId;
                config.childControlConfigs.push(conf);
            }
            return config;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            //this.setScriptCode(_Config.script)
            this.Init(_Target, _Config.Position, _Config.HTMLElement, _Config.configuration);
            this.configuration = _Config.configuration;
            this.ChildControlCount = _Config.ChildControlCount;
            this.ApplyProperty();
            if (!this.ChildControlCount || this.ChildControlCount <= 0) {
                this.RunAnimate();
            }
            if (_Config != null) {
                //var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;

                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    //BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", _Config.BasicProperty);

                    //应用样式
                    this.ChangeTheme(_Config.ThemeInfo);


                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height() };
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);

                    var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height: parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))
                    };

                    this.htmlElement.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.htmlElement.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.htmlElement.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");
                }
            }
        } //根据配置信息创建控件
    }, true);


Agi.Controls.Container.AddSubControl = function(subControl){
    if(subControl.parentId){
        var parent = Agi.Edit ? $('#'+subControl.parentId,'#BottomRightCenterContentDiv') : $('#'+subControl.parentId,'#workspace');
        $(subControl.Get('HTMLElement')).appendTo( parent);
        subControl.Refresh();
        var pControl = Agi.Controls.FindControlByPanel(subControl.parentId);
        if(pControl){
            if(pControl.childControls.length >= pControl.ChildControlCount){
                //alert('载入子控件完成!');
                pControl.RunAnimate();
            }
        }
    }
};
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * */
Agi.Controls.Container.OptionsAppSty = function (_StyConfig, _Container) {
    if (_StyConfig != null) {


    }
};

/*下拉列表控件参数更改处理方法*/
Agi.Controls.ContainerAttributeChange=function(_ControlObj,Key,_Value){
    var self = _ControlObj;
    if (Key == "Position") {
        if (layoutManagement.property.type == 1) {
            var ThisHTMLElement = self.htmlElement;
            var ParentObj = ThisHTMLElement.parent();
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
            ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
            ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
            ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
        }
    }
};// ContainerAttributeChangeend

/*下拉列表参数更改 _ContainerID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.ContainerParsChange=function(_ContainerID,_ParsName,_ParsValue){
    var ThisControl=Agi.Controls.FindControl(_ContainerID);/*查找到相应的控件*/
    if(ThisControl){
        ThisControl.Set(_ParsName,_ParsValue);
    }
};

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitContainer=function(){
    return new Agi.Controls.Container();
};

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.ContainerProrityInit = function (control) {
    var self = control;
    var ThisProItems = [];
    //基本设置
    var basicPro = $('<div></div>');
    basicPro.load('JS/Controls/Container/setting.html #property1', function () {
        //初始化值
        basicPro.find('[title="左上角半径"]').val(self.configuration.leftTop);
        basicPro.find('[title="右上角半径"]').val(self.configuration.rightTop);
        basicPro.find('[title="左下角半径"]').val(self.configuration.leftBottom);
        basicPro.find('[title="右下角半径"]').val(self.configuration.rightBottom);
        basicPro.find('[title="边框颜色"]').css(self.configuration.borderColor.value);
        basicPro.find('[title="边框宽度"]').val(self.configuration.borderWidth);
        basicPro.find('[title="背景设置"]').css(self.configuration.backColor.value);
        basicPro.find('[title="进入动画"]').val(self.configuration.animate);
        //事件处理
        basicPro.find('input').bind('blur',function(){
            var title = $(this).attr('title');
            var val = $(this).val();
            var MinNumber = parseInt($(this).attr("min"));
            var MaxNumber = parseInt($(this).attr("max"));
            switch(title){
                case '左上角半径':
                    if (val.trim() === "") {
                        $(this).val(self.configuration.leftTop);
                        var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                        AgiCommonDialogBox.Alert(DilogboxTitle);
                    }
                    else {
                        if (val >= MinNumber && val <= MaxNumber) {
                            self.configuration.leftTop = val;
                        }
                        else {
                            $(this).val(self.configuration.leftTop);
                            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                        }
                    }
                    break;
                case '右上角半径':
                    if (val.trim() === "") {
                        $(this).val(self.configuration.rightTop);
                        var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                        AgiCommonDialogBox.Alert(DilogboxTitle);
                    }
                    else {
                        if (val >= MinNumber && val <= MaxNumber) {
                            self.configuration.rightTop = val;
                        }
                        else {
                            $(this).val(self.configuration.rightTop);
                            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                        }
                    }

                    
                    break;
                case '左下角半径':
                    if (val.trim() === "") {
                        $(this).val(self.configuration.leftBottom);
                        var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                        AgiCommonDialogBox.Alert(DilogboxTitle);
                    }
                    else {
                        if (val >= MinNumber && val <= MaxNumber) {
                            self.configuration.leftBottom = val;
                        }
                        else {
                            $(this).val(self.configuration.leftBottom);
                            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                        }
                    }
                   
                    break;
                case '右下角半径':
                    if (val.trim() === "") {
                        $(this).val(self.configuration.rightBottom);
                        var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                        AgiCommonDialogBox.Alert(DilogboxTitle);
                    }
                    else {
                        if (val >= MinNumber && val <= MaxNumber) {
                            self.configuration.rightBottom = val;
                        }
                        else {
                            $(this).val(self.configuration.rightBottom);
                            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                        }
                    }
                    
                    break;
                case '边框颜色':
                    self.configuration.borderColor =val;
                    break;
                case '边框宽度':
                    if (val.trim() === "") {
                        $(this).val(self.configuration.borderWidth);
                        var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                        AgiCommonDialogBox.Alert(DilogboxTitle);
                    }
                    else {
                        if (val >= MinNumber && val <= MaxNumber) {
                            self.configuration.borderWidth = val;
                        }
                        else {
                            $(this).val(self.configuration.borderWidth);
                            var DilogboxTitle = "请输入" + MinNumber + "-" + MaxNumber + "范围内的值！";
                            AgiCommonDialogBox.Alert(DilogboxTitle);
                        }
                    }
                    
                    break;
            }
            self.ApplyProperty();
        });
        basicPro.find('[title="边框颜色"]').bind('click', function () {
            var btn = $(this);
            var currentColor = self.configuration.borderColor;
            colorPicker.open({
                disableTabIndex: [1,2],
                defaultValue: !currentColor ? null : currentColor, //这个参数是上一次选中的颜色
                saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                    //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                    btn.css(color.value);
                    //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                    //btn.data('colorValue', color);
                    self.configuration.borderColor = color;
                    self.ApplyProperty();
                }
            });
        });
        basicPro.find('[title="背景设置"]').bind('click', function () {
            var btn = $(this);
            var currentColor = self.configuration.backColor;
            colorPicker.open({
                disableTabIndex: [],
                defaultValue: !currentColor ? null : currentColor, //这个参数是上一次选中的颜色
                saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                    //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                    btn.css(color.value);
                    //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                    //btn.data('colorValue', color);
                    self.configuration.backColor = color;
                    self.ApplyProperty();
                }
            });
        });
        basicPro.find('[title="进入动画"]').bind('change',function(){
            self.configuration.animate = $(this).val();
        });
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: basicPro }));

    //动画设置
    var animatePro = $('<div></div>');
    animatePro.load('JS/Controls/Container/setting.html #property2', function () {
        //初始化值
        animatePro.find('[title="进入动画"]').val(self.configuration.animate);
        animatePro.find('[title="动画速度"]').val(self.configuration.animateSpeed ? self.configuration.animateSpeed : 1000);
        //事件处理
        animatePro.find('[title="进入动画"],[title="动画速度"]').bind('change',function(){
            var title = this.title;
            var val = $(this).val();
            switch(title){
                case "进入动画":
                    self.configuration.animate = val;
                    break;
                case "动画速度":
                    self.configuration.animateSpeed = parseInt(val);
                    break;
            }
        });
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "动画设置", DisabledValue: 1, ContentObj: animatePro }));
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {

    };
};
