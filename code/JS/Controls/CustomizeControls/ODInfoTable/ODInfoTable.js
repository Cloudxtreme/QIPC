/**
 * Created with JetBrains WebStorm.
 * User: yanhua guo
 * Date: 12-8-17
 * Time: 上午9:15
 * SPC过程能力信息控件.
 * *
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.ODInfoTable = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){//获得实体数据
            var entity = this.Get('Entity')[0];
            if(entity !=undefined && entity !=null){
                return entity.Data;
            }else{
                return null;
            }
        },
        Render: function (_Target) {
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            this.shell.Container.appendTo(obj);
//            this.shell.Title.hide().removeClass('selectPanelheadSty');
//            this.shell.Footer.hide();

            self.shell.Container.height(self.shell.Container.height() - 17);
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }
        },
        //重新绑定事件
        ReBindEvents: function () {

            return this;
        },
        //重新设置属性
        ResetProperty: function () {
            var self = this;

            return this;
        },
        RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'ODInfoTable.RemoveEntity Arg is null';
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
        },
        ReadData: function (et) {
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.chageEntity = true;
            this.Set("Entity", entity);
        },
        ReadRealData: function (_Entity) {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            self.shell = null;
            self.AttributeList = [];
            self.Set("Entity", []);
            self.Set("ControlType", "ODInfoTable");

            var ID = savedId ? savedId : "ODInfoTable" + Agi.Script.CreateControlGUID();


            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 955,
                height: 60,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="odInfoTable" style="width: 100%;height: 100%">' +
                '<table border="0">' +
                //                    '<thead>'+
                //                        '<tr><th colspan="2">当前过程能力信息</th></tr>'+
                //                    '</thead>'+
                '<tbody>' +
                //                        '<tr><td>Ca:</td><td title="CV">0.00</td></tr>'+
                //                        '<tr><td colspan="2">&nbsp;</td></tr>'+
                //                        '<tr><td>Cp:</td><td title="Cp">0.00</td></tr>'+
                //                        '<tr><td>Cpk:</td><td title="Cpk">0.00</td></tr>'+
                //                        '<tr><td>CPU:</td><td title="Cpu">0.00</td></tr>'+
                //                        '<tr><td>CPL:</td><td title="Cpl">0.00</td></tr>'+
                //                        '<tr><td>Cr:</td><td title="Cr">0.00</td></tr>'+
                //                        '<tr><td colspan="2">&nbsp;</td></tr>'+
                //                        '<tr><td>Pp:</td><td title="Pp">0.00</td></tr>'+
                //                        '<tr><td>Ppk:</td><td title="Ppk">0.00</td></tr>'+
                //                        '<tr><td>Ppu:</td><td title="Ppu">0.00</td></tr>'+
                //                        '<tr><td>Ppl:</td><td title="Ppl">0.00</td></tr>'+
                //                        '<tr><td>Pr:</td><td title="Pr">0.00</td>'+
                //                        '</tr>'+
                '<tr>' +
                '<td><div class="childrenDiv"><div class="bigText" title="CV">0</div><div class="smallText">(Ca)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Cp">0</div><div class="smallText">(Cp)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Cpk">0</div><div class="smallText">(Cpk)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Cpu">0</div><div class="smallText">(Cpu)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Cpl">0</div><div class="smallText">(CPL)</div></div></td>' +
                '<td ><div class="childrenDiv"><div class="bigText" title="Cr">0</div><div class="smallText">(Cr)</div></div></td>' +
                '<td ><div class="childrenDiv1"></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Pp">0</div><div class="smallText">(Pp)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Ppk">0</div><div class="smallText">(Ppk)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Ppu">0</div><div class="smallText">(Ppu)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Ppl">0</div><div class="smallText">(Ppl)</div></div></td>' +
                '<td><div class="childrenDiv"><div class="bigText" title="Pr">0</div><div class="smallText">(Pr)</div></div></td>' +
                '</tbody>' +
                '</table></div>');

            //var templateFile = 'JS/Controls/CustomizeControls/ODInfoTable/ODInfoTableTemplate.html #odInfoTable';
            //            if(self.IsPageView){
            //                templateFile = '../code/JS/Controls/CustomizeControls/ODInfoTable/ODInfoTableTemplate.html #odInfoTable';
            //            }
            //            this.shell.Body.load(templateFile,function(){
            //            });
            this.shell.initialControl(BaseControlObj[0]);

            self.isBindData = false;
            self.isInit = true;
            self.isApplyProperty = false;
            self.chageEntity = false;


            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: null
            };

            self.BasicProperty = {
                USL: '2',
                LSL: '5',
                nrow: '3'
            };

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
                //HTMLElementPanel.width(400);
                //HTMLElementPanel.height(300);
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

            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                if (!self.IsPageView) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    if (!self.IsPageView) {
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
            self.isInit = false;

            //20130515 倪飘 解决bug，组态环境中拖入过程能力信息控件以后拖入容器框控件，容器框控件会覆盖过程能力信息控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
            //缩小的最小宽高设置
            //            HTMLElementPanel.resizable({
            //                minHeight: 120,
            //                minWidth: 200
            //            });
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.ODInfoTableProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

            Agi.Edit.workspace.controlList.remove(this);
            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/

            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
//        Copy: function () {
//            if (layoutManagement.property.type == 1) {
//                var ParentObj = this.shell.Container.parent();
//                var PostionValue = this.Get("Position");
//                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//                var NewDataGrid = new Agi.Controls.ODInfoTable();
//                NewDataGrid.Init(ParentObj, PostionValue);
//                newPanelPositionpars = null;
//                return NewDataGrid;
//            }
//        },
        PostionChange: function (_Postion) {
            var self = this;
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
            return this;
        },

        ResizeCompleted: function () {
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
            //ThisHTMLElement.height(ThisControlPars.Height);
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
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /*  $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
             "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        //        EnterEditState:function(){
        //            var self = this;
        //            var obj = $(this.Get('HTMLElement'));
        //            this.oldSize = {
        //                width:obj.width(),
        //                height:obj.height()
        //            }

        //            self.shell.Container.height(292).width(160)
        //        },
        BackOldSize: function () {
            var self = this;
            if (self.oldSize) {
                self.shell.Container.width(self.oldSize.width)
                    .height(self.oldSize.height);
            }
            self.Set("Entity", self.Get("Entity"));
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.ODInfoTableAttributeChange(this, Key, _Value);

            if (Key === 'Position' && !_obj.isInit) {
                var htmlElement = $('#' + this.shell.ID);
                var ParentObj = htmlElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                htmlElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                htmlElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
            }
        },
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);

            //保存主题样式
            Me.Set("ThemeInfo", _themeName);

            //3.应用当前控件的Options信息
            Agi.Controls.ODInfoTable.OptionsAppSty(ChartStyleValue, Me);

        }, //更改样式
        GetConfig: function () {
            var self = this;

            var ProPerty = this.Get("ProPerty");
            /*  var ConfigObj = new Agi.Script.StringBuilder(); *//*配置信息数组对象*//*
             ConfigObj.append("<Control>");
             ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>"); */
            /*控件类型*//*
             ConfigObj.append("<ControlID>" +ProPerty.ID + "</ControlID>"); */
            /*控件属性*//*
             ConfigObj.append("<ControlBaseObj>" + self.shell.BasicID + "</ControlBaseObj>"); */
            /*控件基础对象*//*
             ConfigObj.append("<HTMLElement>" + self.shell.BasicID + "</HTMLElement>"); */
            /**//*
             var Entitys = this.Get("Entity");
             $(Entitys).each(function(i,e){
             e.Data = null;
             });
             ConfigObj.append("<Entity>" +JSON.stringify(Entitys) + "</Entity>"); */
            /**//*

             ConfigObj.append("<BasicProperty>" +JSON.stringify(self.BasicProperty) + "</BasicProperty>"); */
            /**//*
             ConfigObj.append("<Position>" +JSON.stringify(this.Get("Position")) + "</Position>"); */
            /**//*
             ConfigObj.append("<ThemeInfo>" +JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>"); */
            /**//*


             ConfigObj.append("</Control>");
             return ConfigObj.toString(); //返回配置字符串*/
            var ODInfoTableControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基本对象
                    HTMLElement: null, //控件外壳
                    Entity: null, //实体
                    BasicProperty: null, //控件基本属性
                    Position: null, //控件位置
                    ThemeInfo: null
                }
            }
            ODInfoTableControl.Control.ControlType = this.Get("ControlType");
            ODInfoTableControl.Control.ControlID = ProPerty.ID;
            ODInfoTableControl.Control.ControlBaseObj = self.shell.BasicID;
            ODInfoTableControl.Control.HTMLElement = self.shell.BasicID;
            var Entitys = this.Get("Entity");
            $(Entitys).each(function (i, e) {
                e.Data = null;
            });
            ODInfoTableControl.Control.Entity = Entitys
            ODInfoTableControl.Control.BasicProperty = self.BasicProperty;
            ODInfoTableControl.Control.Position = this.Get("Position");
            ODInfoTableControl.Control.ThemeInfo = this.Get("ThemeInfo");
            return ODInfoTableControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            var self = this;
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;

                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    self.BasicProperty = _Config.BasicProperty;

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    //ThisProPerty.BasciObj.attr('id',_Config.ControlID);

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
                    //ThisProPerty.BasciObj.parent().width(ThisControlPars.Width);
                    //ThisProPerty.BasciObj.parent().height(ThisControlPars.Height);
                    //ThisProPerty.BasciObj.parent().css("left",(_Targetobj.offset().left+parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(_Targetobj.offset().top+parseInt(_Config.Position.Top*PagePars.Height))+"px");
                    //ThisProPerty.BasciObj.parent().css("left",(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(parseInt(_Config.Position.Top*PagePars.Height))+"px");

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                    this.Set("Entity", _Config.Entity);
                }
            }
        } //根据配置信息创建控件

    }, true);

/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _ODInfoTable:当前控件对象
 * */
Agi.Controls.ODInfoTable.OptionsAppSty = function (_StyConfig, _ODInfoTable) {
    if (_StyConfig != null) {
        var mid = _ODInfoTable.shell.ID;
        $('#' + mid + ' .childrenDiv').css("background", _StyConfig.background);
        $('#' + mid + ' .childrenDiv').css("border", _StyConfig.border);
        $('#' + mid + ' .childrenDiv').css("border-radius", _StyConfig.borderRadius);
        $('#' + mid + ' .bigText').css("color", _StyConfig.bigFontColor);
    }
}


/*下拉列表控件参数更改处理方法*/
Agi.Controls.ODInfoTableAttributeChange=function(ODInfoTable,Key,_Value){
    var self = ODInfoTable;
    switch(Key){
        case "Position":
        {
            if(layoutManagement.property.type==1){
                var ThisHTMLElement=$(self.Get("HTMLElement"));
                var ThisControlObj=self.Get("ProPerty").BasciObj;

                var ParentObj=ThisHTMLElement.parent();
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                //ThisControlObj.height(ThisHTMLElement.height()-20);
                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                ThisHTMLElement.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                ThisHTMLElement.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");
                PagePars=null;

                //console.log(self.shell.BasicID+' moved!')
            }
        }break;
        case "SelValue":
        {

        }break;
        case "OutPramats"://用户选择了一个项目
        {
            if(_Value!=0){
                //var ThisControlPrority=_ControlObj.Get("ProPerty");
                var ThisOutPars=[];
                if(_Value!=null){
                    for(var item in _Value){
                        ThisOutPars.push({Name:item,Value:_Value[item]});
                    }
                }
                Agi.Msg.PageOutPramats.PramatsChange({/*Chart 输出参数更改*/
                    "Type": Agi.Msg.Enum.Controls,
                    "Key":_ControlObj.shell.BasicID,
                    "ChangeValue":ThisOutPars
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj,"Type":Agi.Msg.Enum.Controls});
                ThisOutPars=null;
            }
            //通知消息模块，参数发生更改
        }break;
        case "BasicProperty":
        {
        }break;
        case "Entity"://实体
        {
            var entity = self.Get('Entity');
            if(entity&&entity.length){
                BindDataByEntity.call(self,entity[0]);
            }else{

            }
        }break;
    }//end switch

    function BindDataByEntity(et){
        var self = this;
        if(!et.IsShareEntity){//不是共享数据源
            Agi.Utility.RequestData2(et,function(d){
                et.Columns = d.Columns;
                et.Data = d.Data;
                //debugger;
                var data = d.Data;
                var tbody = $('table>tbody',self.shell.Container);
                if(data.length && Spc.Data){

                    //var dataArray = Spc.Data.DataArray(data);

                    /* 20121122 markeluo SPC图修改  NO:201211220856 start */
                    var dataArray=[];
                    if(data && data.length>0){
                        if(!isNaN(data[0][et.Columns[0]])){
                            for(var i=0;i<data.length;i++){
                                dataArray.push(eval(data[i][et.Columns[0]]));
                            }
                        }
                    }
                    /* 20121122 markeluo SPC图修改  NO:201211220856 end */

                    if(dataArray&&dataArray.length){
                        //1
                        var jsData = {
                            'action':'RCalProcessCap',
                            'dataArray':dataArray,
                            'USL':self.BasicProperty.USL,
                            'LSL':self.BasicProperty.LSL,
                            'nrow':self.BasicProperty.nrow,
                            'sampleLength':data.length.toString(),
                            'constantArray':''
                        };

                        Spc.Data.GetSpcDataForInfoTable('RCalProcessCap',jsData,function(result){
                            var data = result.data;
                            //alert('loadTemplateCompeled: ' +self.loadTemplateCompeled);
                            if(data){
                                //debugger;
                                //var str = JSON.stringify(data);
                                //alert(str);
                                for(name in data){
                                    tbody.find('div[title="' + name + '"]').text(parseFloat(data[name]).toFixed(2));
                                }
                            }
                        });
                        //2
                        var jsParam = {
                            'action':'RCalProcessPer',
                            'dataArray':dataArray,
                            'USL':self.BasicProperty.USL,
                            'LSL':self.BasicProperty.LSL
                        };
                        Spc.Data.GetSpcDataForInfoTable('RCalProcessPer',jsParam,function(result){
                            var data = result.data;
                            if(data){
                                //debugger;
                                //var str = JSON.stringify(data);
                                //alert(str);
                                for(name in data){
                                    tbody.find('div[title="' + name + '"]').text(parseFloat(data[name]).toFixed(2));
                                }
                            }
                        });
                    }else{
                        emptyData.call(self);
                    }
                }else{
                    emptyData.call(self);
                }
            });
        }else{
            //共享数据源的处理方式
            //et.Columns = d.Columns;
            //et.Data = d.Data;
            //debugger;
            var data = et.Data;
            var tbody = $('table>tbody',self.shell.Container);
            if(data.length && Spc.Data){

                /* 20121122 markeluo SPC图修改  NO:201211220856 start */
                var dataArray=[];
                if(data && data.length>0){
                    if(!isNaN(data[0][et.Columns[0]])){
                        for(var i=0;i<data.length;i++){
                            dataArray.push(eval(data[i][et.Columns[0]]));
                        }
                    }
                }
                /* 20121122 markeluo SPC图修改  NO:201211220856 end */

                if(dataArray&&dataArray.length){
                    //1
                    var jsData = {
                        'action':'RCalProcessCap',
                        'dataArray':dataArray,
                        'USL':self.BasicProperty.USL,
                        'LSL':self.BasicProperty.LSL,
                        'nrow':self.BasicProperty.nrow,
                        'sampleLength':data.length.toString(),
                        'constantArray':''
                    };

                    Spc.Data.GetSpcDataForInfoTable('RCalProcessCap',jsData,function(result){
                        var data = result.data;
                        //alert('loadTemplateCompeled: ' +self.loadTemplateCompeled);
                        if(data){
                            //debugger;
                            //var str = JSON.stringify(data);
                            //alert(str);
                            for(name in data){
                                tbody.find('div[title="' + name + '"]').text(parseFloat(data[name]).toFixed(2));
                            }
                        }
                    });
                    //2
                    var jsParam = {
                        'action':'RCalProcessPer',
                        'dataArray':dataArray,
                        'USL':self.BasicProperty.USL,
                        'LSL':self.BasicProperty.LSL
                    };
                    Spc.Data.GetSpcDataForInfoTable('RCalProcessPer',jsParam,function(result){
                        var data = result.data;
                        if(data){
                            //debugger;
                            //var str = JSON.stringify(data);
                            //alert(str);
                            for(name in data){
                                tbody.find('div[title="' + name + '"]').text(parseFloat(data[name]).toFixed(2));
                            }
                        }
                    });
                }else{
                    emptyData.call(self);
                }
            }else{
                emptyData.call(self);
            }
        }
        return;
    }

    function emptyData(){
        var self = this;
        var tbody = $('table>tbody',self.shell.Container);
        tbody.find('div[title="CV"]').text('0.00');

        tbody.find('div[title="Cp"]').text('0.00');
        tbody.find('div[title="Cpk"]').text('0.00');
        tbody.find('div[title="Cpu"]').text('0.00');
        tbody.find('div[title="Cpl"]').text('0.00');
        tbody.find('div[title="Cr"]').text('0.00');

        tbody.find('div[title="Pp"]').text('0.00');
        tbody.find('div[title="Ppk"]').text('0.00');
        tbody.find('div[title="Ppu"]').text('0.00');
        tbody.find('div[title="Ppl"]').text('0.00');
        tbody.find('div[title="Pr"]').text('0.00');
    }
}//end

/*下拉列表参数更改 _DropDownListID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.ODInfoTableParsChange=function(_DropDownListID,_ParsName,_ParsValue){
    var ThisControl=Agi.Controls.FindControl(_DropDownListID);/*查找到相应的控件*/
    if(ThisControl){
        ThisControl.Set(_ParsName,_ParsValue);
    }
}

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitODInfoTable=function(){
    return new Agi.Controls.ODInfoTable();
}

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.ODInfoTableProrityInit=function(ODInfoTable){
    var self = ODInfoTable;


    var ThisProItems=[];

    var basicPro = $('<div></div>');
    basicPro.load('JS/Controls/CustomizeControls/ODInfoTable/ODInfoTableSetting.html #ODInfoTableSetting',function(){
        var tbody = $('#ODInfoTableSetting table>tbody');
        tbody.find('input[title="USL"]').val(self.BasicProperty.USL);
        tbody.find('input[title="LSL"]').val(self.BasicProperty.LSL);
        tbody.find('input[title="nrow"]').val(self.BasicProperty.nrow);
        $('#ODInfoTableSetting table input').bind('blur',function(e){
            var title = $(this).attr('title');
            switch(title){
                case "USL":
                    var num = $(this).val();
//                    num = isNaN(num) ? 3 : parseInt(num);
                    self.BasicProperty.USL=num;
                    break;
                case "nrow":
                    var num = $(this).val();
//                    num = isNaN(num) ? 3 : parseInt(num);
                    self.BasicProperty.nrow=num;
                    break;
                case "LSL":
                    var num = $(this).val();
//                    num = isNaN(num) ? 3 : parseInt(num);
                    self.BasicProperty.LSL=num;
                    break;
            }
        });
    });

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"基本设置",DisabledValue:1,ContentObj:basicPro}));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);


    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged=function(_item){
//        var itemtitle=_item.Title;
//        if(_item.DisabledValue==0){
//            itemtitle+="禁用";
//        }else{
//            itemtitle+="启用";
//        }
//        alert(itemtitle);
    }
}
