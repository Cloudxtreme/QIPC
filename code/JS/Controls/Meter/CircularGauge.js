/**
 * Created with JetBrains WebStorm.
 * User: 刘文川
 * Date: 12-9-6
 * Time: 上午9:54
 * To change this template use File | Settings | File Templates.
 * Gauge 仪表盘控件，样式1
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.CircularGauge=Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){ //获得实体数据

        },
        Render:function(_Target){
            var self = this;
            var obj=null;
            if(typeof(_Target)=="string"){
                obj=$("#"+_Target);
            }else{
                obj=$(_Target);
            }

            var data = self.Get('data');
            var ThisHTMLElement = self.shell.Container[0]; //self.Get("HTMLElement");
            if(ThisHTMLElement!=null){
                $(ThisHTMLElement).appendTo(obj)
                    .find('.dropdown-menu li').live('click',function(e){
                        $(ThisHTMLElement).find('.dropdown-toggle').html($(this).text()+'<b class="caret"></b>');
                        $(ThisHTMLElement).find('.dropdown').removeClass('open');
                        data.selectedValue.value = $(this).data('value');
                        data.selectedValue.text = $(this).find('a').text();
                        self.Set('data',data);
                    }).selector;
            }
            menuManagement.updateDataSourceDragDropTargets();
        },
        //重新绑定事件
        ReBindEvents:function(){
            var self = this;
            var data = self.Get('data');
            var ThisHTMLElement = self.shell.Container;
            var $ThisHTMLElement = $('#'+ThisHTMLElement[0].id);
            $ThisHTMLElement.find('.dropdown-menu li').unbind().bind('click',{ThisHTMLElement:$ThisHTMLElement},function(e){
                e.data.ThisHTMLElement.find('.dropdown-toggle').html($(this).text()+'<b class="caret"></b>');
                e.data.ThisHTMLElement.find('.dropdown').removeClass('open');
                data.selectedValue.value = $(this).data('value');
                data.selectedValue.text = $(this).find('a').text();
                self.Set('data',data);
            });
            return this;
        },
        ResetProperty:function(){
            $('#'+this.shell.ID).resizable({
                minHeight: 250,
                minWidth: 250
//                ,maxHeight:60
            });
            return this;
        },
        ReadData:function(et){
            var entity  = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity",entity);
//            var ThisHTMLElement=this.Get("HTMLElement");
//            if(ThisHTMLElement!=null){
//                $(ThisHTMLElement).find('.dropdown-menu').append('<li><a href="#">4</a></li><li><a href="#">5</a></li><li><a href="#">6</a></li>');
//            }
        },
        ReadRealData:function(_Entity){
        },
        ParameterChange:function(_ParameterInfo){//参数联动
            //alert('dropdownlist ParameterChange run!');
            this.Set('Entity',this.Get('Entity'));
        },
        Init:function(_Target,_ShowPosition,savedId){/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList=[];
            this.Set("Entity",[]);
            this.Set("ControlType","CircularGauge");
            var ID = "CircularGauge" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel=$("<div recivedata='true' id='Panel_"+ID+"' class='PanelSty selectPanelSty'></div>");
            //var objcanvas='<canvas id="cvs" width="250" height="250">[No canvas support]</canvas>';
            this.shell = new Agi.Controls.Shell({
                ID:ID,
                width:250,
                height:250,
                divPanel:HTMLElementPanel
            });
// width="250" height="250"
            var BaseControlObj= $('<div id="' + ID +'" style="height:100%;"><canvas id="cvs' + ID +'">' + ID +'</canvas>'+'</div>');
            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement",this.shell.Container[0]);

            var ThisProPerty = {
                ID: ID,
                BasciObj:BaseControlObj
            };
            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var LabelFilter = { LeftFillet1: 0, LeftFillet2: 0, RightFillet1: 0, RightFillet2: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };

            this.Set("ProPerty", ThisProPerty);
            // this.Set("HTMLElement", ThisProPerty.BasciObj[0]);
            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(250);
                HTMLElementPanel.height(250);
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

            //定义图形控件并显示
            var objCanvas = $("#cvs"+ID);
            objCanvas.attr("width",objCanvas.parent().width());
            objCanvas.attr("height",objCanvas .parent().height());
            objCanvas.attr("valign","top");
            var gauge = new RGraph.Gauge("cvs" + ID, 0, 10, 3);
            gauge.Draw();

            var StartPoint = { X: 0, Y: 0 }
            var self = this;
            /*事件绑定*/
            $('#'+self.shell.ID).live('mousedown',function(ev){
                // alert($("#"+BaseControlObj));
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });

            $('#'+self.shell.ID).live('dblclick',function(ev){
                if(!Agi.Controls.IsControlEdit){
                    Agi.Controls.ControlEdit(self);//控件编辑界面
                }
            });
            if(HTMLElementPanel.touchstart){
                HTMLElementPanel.touchstart(function(ev){
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }
            //鼠标悬停onmousehover
            /*  $("#"+this.Get('HTMLElement').id).live('onmousehover',function(ev){
             $("#"+this.Get('HTMLElement').id).css({"text-decoration":"underline","cursor":"pointer"});
             });*/

            //点击Label文本
            var hrefProperty = this.Get('hrefProperty');
            $("#"+this.Get('HTMLElement').id).click(function(){
                if(hrefProperty.InsideLinkAddress !=""){
                    var ss = hrefProperty.InsideLinkAddress;
                    AgiCommonDialogBox.Alert(ss);
                    Agi.Edit.OpenPage(ss);//打开内部链接
                }
                window.open(hrefProperty.hrefAddress,hrefProperty.OpenPosition ); //打开外部链接
            });
            this.Set("Position", PostionValue);
            this.Set("LabelFilter", LabelFilter);
            //最小高宽
            HTMLElementPanel.resizable({
                minHeight: 59,
                minWidth: 180,
                maxHeight:60
            });
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue =LabelFilter = null;
        },//end Init
        CustomProPanelShow:function(){//显示自定义属性面板
            Agi.Controls.DropDownListProrityInit(this);
        },
        Destory:function(){
            var HTMLElement=this.Get("HTMLElement");
            var proPerty=this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID);/*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/
            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

            $(HTMLElement).remove();
            HTMLElement=null;
            this.AttributeList.length=0;
            proPerty=null;
            delete this;
        },
        Copy:function(){
            if(layoutManagement.property.type==1){
                var ParentObj= this.shell.Container.parent();
                var PostionValue=this.Get("Position");
                var newPanelPositionpars={Left:parseFloat(PostionValue.Left),Top:parseFloat(PostionValue.Top)}
                var Newdropdownlist=new Agi.Controls.DropDownList();
                Newdropdownlist.Init(ParentObj,PostionValue);
                newPanelPositionpars=null;
                return Newdropdownlist;
            }
        },
        PostionChange:function(_Postion){
            if(_Postion!=null &&_Postion.Left!=null && _Postion.Top!=null && _Postion.Right!=null && _Postion.Bottom!=null){
                var ParentObj=$(this.Get("HTMLElement")).parent();
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                var _ThisPosition={
                    Left:(_Postion.Left/PagePars.Width).toFixed(4),
                    Top:(_Postion.Top/PagePars.Height).toFixed(4),
                    Right:(_Postion.Right/PagePars.Width).toFixed(4),
                    Bottom:(_Postion.Bottom/PagePars.Height).toFixed(4)
                }
                this.Set("Position",_ThisPosition);
                PagePars=_ThisPosition=null;
            }else{
                var ThisHTMLElement=$(this.Get("HTMLElement"));
                var ParentObj= $('#BottomRightCenterContentDiv');
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height(),Left:ParentObj.offset().left,Top:ParentObj.offset().top};


                var ThisControlPars={Width:ThisHTMLElement.width(),Height:ThisHTMLElement.height(),Left:(ThisHTMLElement.offset().left-PagePars.Left),Top:(ThisHTMLElement.offset().top-PagePars.Top),Right:0,Bottom:0};
                ThisControlPars.Right=(PagePars.Width-ThisControlPars.Width-ThisControlPars.Left);
                ThisControlPars.Bottom=(PagePars.Height-ThisControlPars.Height-ThisControlPars.Top);

                var _ThisPosition={
                    Left:(ThisControlPars.Left/PagePars.Width).toFixed(4),
                    Top:(ThisControlPars.Top/PagePars.Height).toFixed(4),
                    Right:(ThisControlPars.Right/PagePars.Width).toFixed(4),
                    Bottom:(ThisControlPars.Bottom/PagePars.Height).toFixed(4)
                }
                this.Set("Position",_ThisPosition);
                PagePars=_ThisPosition=null;
            }
        },
        Refresh:function(){
            var ThisHTMLElement = $(this.Get("HTMLElement"));
            var ParentObj = ThisHTMLElement.parent();
            var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
            var PostionValue=this.Get("Position");
            PostionValue.Left=parseFloat(PostionValue.Left);
            PostionValue.Right=parseFloat(PostionValue.Right);
            PostionValue.Top=parseFloat(PostionValue.Top);
            PostionValue.Bottom=parseFloat(PostionValue.Bottom);
            var ThisControlPars={Width:parseInt(PagePars.Width-(PagePars.Width*(PostionValue.Left+PostionValue.Right))),
                Height:parseInt(PagePars.Height-(PagePars.Height*(PostionValue.Top+PostionValue.Bottom)))};
            ThisHTMLElement.width(ThisControlPars.Width);
            ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left",(ParentObj.offset().left+parseInt(PostionValue.Left*PagePars.Width))+"px");
            ThisHTMLElement.css("top",(ParentObj.offset().top+parseInt(PostionValue.Top*PagePars.Height))+"px");
        },
        HTMLElementSizeChanged:function(){
            var Me = this;
            if(Agi.Controls.IsControlEdit){//如果是进入编辑界面，100%适应
                Me.Set("Position",{Left:0,Right:0,Top:0,Bottom:0});//由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            }else{
                Me.Refresh();//每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        Checked:function(){
            $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027"});
        },
        UnChecked:function(){
            $('#'+this.shell.ID).css({"-webkit-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000"});
            /*   $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",

             /*   $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
                "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        EnterEditState:function(){
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width:obj.width(),
                height:obj.height()
            }
            obj.css({"width":200,"height":59}).find('li[class*="dropdown"]').removeClass('open');
        },
        BackOldSize:function(){
            if(this.oldSize){
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
        },
        ControlAttributeChangeEvent:function(_obj,Key,_Value){
            Agi.Controls.DropDownListAttributeChange(this,Key,_Value);
        },
        GetConfig:function(){
            var ProPerty=this.Get("ProPerty");
            var ConfigObj = new Agi.Script.StringBuilder(); /*配置信息数组对象*/
            ConfigObj.append("<Control>");
            ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>"); /*控件类型*/
            ConfigObj.append("<ControlID>" +ProPerty.ID + "</ControlID>"); /*控件属性*/
            ConfigObj.append("<ControlBaseObj>" +ProPerty.BasciObj[0].id + "</ControlBaseObj>"); /*控件基础对象*/
            ConfigObj.append("<HTMLElement>" +ProPerty.BasciObj[0].id + "</HTMLElement>"); /**/
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
//            $(Entitys).each(function(i,e){
//                e.Data = null;
//            });
            ConfigObj.append("<Entity>" +JSON.stringify(Entitys) + "</Entity>"); /**/

            ConfigObj.append("<BasicProperty>" +JSON.stringify(this.Get("BasicProperty")) + "</BasicProperty>"); /**/
            ConfigObj.append("<Position>" +JSON.stringify(this.Get("Position")) + "</Position>"); /**/
            ConfigObj.append("<ThemeInfo>" +JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>"); /**/
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串
        },//获得Panel控件的配置信息
        CreateControl:function(_Config,_Target){
            this.Init(_Target,JSON.parse(_Config.Position),_Config.HTMLElement);
            if(_Config!=null){
                var BasicProperty = null;
                if(_Target!=null && _Target!=""){
                    var _Targetobj=$(_Target);
                    if (typeof (_Config.Entity) == "string") {
                        _Config.Entity = JSON.parse(_Config.Entity);
                    }
                    if (typeof (_Config.Position) == "string") {
                        _Config.Position = JSON.parse(_Config.Position);
                        this.Set("Position",_Config.Position);
                    }
                    if (typeof (_Config.ThemeInfo) == "string") {
                        _Config.ThemeInfo = JSON.parse(_Config.ThemeInfo);
                    }
                    if (typeof (_Config.BasicProperty) == "string") {
                        BasicProperty = JSON.parse(_Config.BasicProperty);
                        this.Set("BasicProperty",BasicProperty);
                    }

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id',_Config.ControlID);

                    var PagePars={Width:_Targetobj.width(),Height:_Targetobj.height()};
                    _Config.Position.Left=parseFloat(_Config.Position.Left);
                    _Config.Position.Right=parseFloat(_Config.Position.Right);
                    _Config.Position.Top=parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom=parseFloat(_Config.Position.Bottom);

                    var ThisControlPars={Width:parseInt(PagePars.Width-(PagePars.Width*(_Config.Position.Left+_Config.Position.Right))),
                        Height:parseInt(PagePars.Height-(PagePars.Height*(_Config.Position.Top+_Config.Position.Bottom)))};
                    //ThisProPerty.BasciObj.parent().width(ThisControlPars.Width);
                    //ThisProPerty.BasciObj.parent().height(ThisControlPars.Height);
                    //ThisProPerty.BasciObj.parent().css("left",(_Targetobj.offset().left+parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(_Targetobj.offset().top+parseInt(_Config.Position.Top*PagePars.Height))+"px");
                    //ThisProPerty.BasciObj.parent().css("left",(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(parseInt(_Config.Position.Top*PagePars.Height))+"px");

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left',(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    this.shell.Container.css('top',(parseInt(_Config.Position.Top*PagePars.Height))+"px");

                    this.Set("Entity",_Config.Entity);
                }
            }
        }//根据配置信息创建控件
    },true);


//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitCircularGauge=function(){
    return new Agi.Controls.CircularGauge();
}

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.CircularGaugeProrityInit=function(dropDownControl){
    var BasicProperty = dropDownControl.Get('BasicProperty');


    var ThisProItems=[];
    //绑定配置的代码
    var bindHTML=null;
    bindHTML = $('<form class="form-horizontal">'+
        '</form>');
    var entity = dropDownControl.Get('Entity');
    $(['显示值','选择值']).each(function(i,label){
        bindHTML.append('<div class="control-group">'+
            '<label style="display: block;" class="control-label" for="inputEmail">'+label+'</label>'+
            '<div class="controls">'+
            '<select data-field="'+label+'" placeholder="" class="input"></select>'+
            '</div>'+
            '</div>');
    });
    var options = null;
    if(entity.length){
        if(entity[0].Columns){
            options="";
            $(entity[0].Columns).each(function(i,col){
                options += "<option value='"+col+"'>"+col+"</option>"
            });
        }
    }
    bindHTML.find('select').append($(options)).bind('change',{sels:bindHTML.find('select')},function(e){
        $(e.data.sels).each(function(i,sel){
            var f = $(sel).data('field');
            if(f=='显示值'){
                BasicProperty.selectTextField = $(sel).val();
            }
            else if(f=='选择值'){
                BasicProperty.selectValueField = $(sel).val();
            }
        });
        dropDownControl.Set('BasicProperty',BasicProperty);
    }).each(function(i,sel){
            var f = $(sel).data('field');
            if(f=='显示值'){
                $(sel).val(BasicProperty.selectTextField);
            }
            else if(f=='选择值'){
                $(sel).val(BasicProperty.selectValueField);
            }
        });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"绑定配置",DisabledValue:1,ContentObj:bindHTML}));

    //基本设置
    var controlObject = $(dropDownControl.Get('HTMLElement'));
    var basicHTML =  $('<form class="form-horizontal">'+
        '</form>');
    $(['字体颜色','控件背景']).each(function(i,label){
        var field = getField(label);
        basicHTML.append('<div class="control-group">'+
            '<label style="display: block;" class="control-label" for="inputEmail">'+label+'</label>'+
            '<div class="controls">'+
            '<input data-field="'+label+'" class="basic input-mini" value="'+BasicProperty[field]+'" ' +
            'type="text" name="'+label+'" />'+
            '</div>'+
            '</div>');
    });
//    basicHTML.find('input').bind('blur',function(e){
//        var pName = $(this).data('field');
//        var field = getField(pName);
//        switch(pName){
//            case "字体颜色":
//                BasicProperty.fontColor = $(this).val();
//                //controlObject.find('.dropdown-toggle').css('color',BasicProperty[field])
//                break
//            case '控件背景':
//                BasicProperty.controlBgColor = $(this).val();
//                //controlObject.find('.dropdownlistControl,.dropdown-toggle').css('background-color',BasicProperty[field])
//                break;
//            case '菜单背景':
//                BasicProperty.dropdownMenuBgColor = $(this).val();
//                //controlObject.find('.dropdown-menu').css('background-color',BasicProperty[field])
//                //.border-bottom-color
//                break
//        }//end switch
//        dropDownControl.Set('BasicProperty',BasicProperty);
//    });
    basicHTML.find('input').spectrum({
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
            var pName = $(this).data('field');
            var field = getField(pName);
            switch(pName){
                case "字体颜色":
                    BasicProperty.fontColor = color.toHexString();
                    break
                case '控件背景':
                    BasicProperty.controlBgColor = color.toHexString();
                    break;
                case '菜单背景':
                    BasicProperty.dropdownMenuBgColor = color.toHexString();
                    break
            }//end switch
            dropDownControl.Set('BasicProperty',BasicProperty);
            //alert(color.toHexString());
        }
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"基本设置",DisabledValue:1,ContentObj:basicHTML}));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    function getField(label){
        var field = "";
        switch(label){
            case"字体颜色":
                field = 'fontColor';
                break;
            case"控件背景":
                field ='controlBgColor';
                break;
            case"菜单背景":
                field = 'dropdownMenuBgColor';
                break;
        }
        return field;
    }

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
