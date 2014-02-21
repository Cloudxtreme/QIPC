/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-17
 * Time: 上午9:15
 * To change this template use File | Settings | File Templates.
 * * CheckBox 控件
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.CheckBox=Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
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
                $(ThisHTMLElement).appendTo(obj);

            }
            if(Agi.Edit){
                menuManagement.updateDataSourceDragDropTargets();
            }
        },
        //重新绑定事件
        ReBindEvents:function(){
//            var checkboxControl = this;
//            var BolIsCustom=checkboxControl.Get("IsCustom");//当前数据是否为自定义
//            if(Agi.Controls.IsControlEdit && BolIsCustom){
//                $(".CheckBoxseriesImgsty").live("click",function(ev){
//                    var _obj=this;
//                    var removeseriesname = _obj.id.substr(_obj.id.indexOf("remove") + 6, _obj.id.length - 6);
//                    $(_obj).parent().remove();
//                    checkboxControl.RemoveItem(removeseriesname);/*移除自定义项*/
//                })
//            }
//            return this;
        },
        ResetProperty:function(){
            var self = this;
            $('#'+this.shell.ID).resizable({
                minHeight: self.minHeight,
                minWidth: self.minWidth
            });
            return this;
        },
        RemoveEntity:function(_EntityKey){
            if(!_EntityKey){
                throw 'CheckBox.RemoveEntity Arg is null';
            }
            var self = this;
            var entitys = self.Get('Entity');
            var index = -1;
            if(entitys && entitys.length){
                for(var i=0;i<entitys.length;i++){
                    if(entitys[i]["Key"]==_EntityKey){
                        index = i;
                        break;
                    }
                }
            }
            if(index>=0){
                entitys.splice(index,1);
                self.Set('Entity',entitys);
            }
        },
        ReadData:function(et){
            var self = this;
            self.IsChangeEntity = true;

            var entity  = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity",entity);
            this.Set("DelItems" ,[]);
            this.Set("CustomData",[]);
//            self.AddEntity(entity);/*添加实体*/
        },
        ReadRealData:function(_Entity){
        },
        AddEntity:function(_entity){/*添加实体*/
//            if(_entity!=null){
//                var Me=this;
//                var Entitys=Me.Get("_entity");
//                var bolIsEx=false;
//                if(Entitys!=null && Entitys.length>0){
//                    for(var i=0;i<Entitys.length;i++){
//                        if(Entitys[i].Key==_entity.Key){
//                            bolIsEx=true;
//                            break;
//                        }
//                    }
//                }
//
//                var ThisChartObj=Me.Get("ProPerty").BasciObj;
//            }else{
//                alert("您添加的实体无数据！");
//            }
        },
        AddColumn:function(_entity,_ColumnName){
            var Me=this;
            Agi.Controls.CheckBoxBindEntityData(Me,_entity,_ColumnName);
        },//拖动列到option
        RemoveItem:function(_itemname){
//            //1.获取控件的 CustomData 数据
//            var Me=this;
//            var ThisCustomData=Me.Get("CustomData");
//            //2.从CustomData 数据中移除名称为 _ColumnName的项
//            if(ThisCustomData!=null && ThisCustomData.length>0){
//                for(var i=0;i<ThisCustomData.length;i++){
//                    if(ThisCustomData[i].Value===_itemname){
//                        ThisCustomData.splice(i,1);//重数组中移除相应的元素
//                        break;
//                    }
//                }
//
//            }
//            //3.重新绑定自定义数据
//            Me.Set("CustomData",ThisCustomData);//赋值后，属性监听器会监听到此属性更改，会自动调用自定义数据绑定
        },//移除Item
        ParameterChange:function(_ParameterInfo){//参数联动
            //alert('checkbox ParameterChange run!');
            this.Set('Entity',this.Get('Entity'));
        },
        Init:function(_Target,_ShowPosition, savedId){/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var Me = this;
            this.shell = null;
            this.IsEditState = false;
            this.minHeight = 30;
            this.minWidth = 250;
            this.IsChangeEntity = false;
            this.AttributeList=[];
            this.Set("selectTextField",null);
            this.Set("selectValueField", null);

            this.Set("DelItems",[]);  //用于记录datasets中被删除的记录号
            this.Set("Entity",[]);
            this.Set("ControlType","CheckBox");
            this.Set("ThemeName",null),

            this.Set("IsCustom",false);//是否自定义数据
            this.Set("CustomData",null);//自定义数据

            //选择数据

            this.Set('data',null);

            var ID = savedId ? savedId:"CheckBox"+Agi.Script.CreateControlGUID();

            var HTMLElementPanel=$("<div recivedata='true' id='Panel_"+ID+"' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                ID:ID,
                width:200,
                height:30,
                divPanel:HTMLElementPanel
            });
//            var BaseControlObj= $('<div id="'+ID+'" class="Checkboxnavbar">' +
//                '<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme1" value="item1" class="CheckBoxItemsSty" /><span class="checkBoxSpan"></span><label for="itme1" id="labelID" >item1</label></div>  '+
//                '<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme2" value="item2" class="CheckBoxItemsSty" /><span class="checkBoxSpan"></span><label for="itme2" id="labelID">item2</label></div>  '+
//                '<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme3" value="item3" class="CheckBoxItemsSty" /><span class="checkBoxSpan"></span><label for="itme3" id="labelID">item3</label></div> '+
//                '</div>');
            var BaseControlObj= $('<div id="'+ID+'" class="Checkboxnavbar Verishow">' +
                '<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme1" value="item1" class="CheckBoxItemsSty" /><div class="mydiv"  /><label for="itme1" id="labelID" >item1</label></div> '+
                '<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme2" value="item2" class="CheckBoxItemsSty" /><div class="mydiv"  /><label for="itme2" id="labelID">item2</label></div>  '+
                '<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme3" value="item3" class="CheckBoxItemsSty" /><div class="mydiv"  /><label for="itme3" id="labelID">item3</label></div> '+
                '</div><div class="ClearfloatDiv"/> ');


            //HTMLElementPanel.append(BaseControlObj);

            this.shell.initialControl(BaseControlObj[0]);

            this.Set("HTMLElement",this.shell.Container[0]);
            var ThisProPerty={
                ID:ID,
                BasciObj:BaseControlObj
            };

            var BasicProperty = {
//                selectTextField : undefined,
//                selectValueField : undefined,
                Alignment:"纵向" ,//"horizontal","vertical" 排列方向
                BorderColor:null,
                ColumnsWidth:250,
                RowHeight:25,
                TopLeftFillet:0,
                TopRightFillet:0,
                BottomLeftFillet:0,
                BottomRightFillet:0,
                BackgroundColor:"",
                SelectedBackgroundColor:"",
                CheckBoxColor:"",
                SelectedCheckBoxColor:""
            };
            this.Set('BasicProperty',BasicProperty);

            var PostionValue={Left:0,Top:0,Right:0,Bottom:0};
            var obj=null;
            if(typeof(_Target)=="string"){
                obj=$("#"+_Target);
            }else{
                obj=$(_Target);
            }
            var PagePars={Width:$(obj).width(),Height:$(obj).height(),Left:0,Top:0};

            this.Set("ProPerty",ThisProPerty);

            this.Set("ThemeInfo",null);

            if(layoutManagement.property.type==1){
                HTMLElementPanel.width(252);
                HTMLElementPanel.height(150);
                PostionValue.Left=((_ShowPosition.Left-PagePars.Left)/PagePars.Width).toFixed(4);
                PostionValue.Top=((_ShowPosition.Top-PagePars.Top)/PagePars.Height).toFixed(4);
                PostionValue.Right=((PagePars.Width-HTMLElementPanel.width()-(_ShowPosition.Left-PagePars.Left))/PagePars.Width).toFixed(4);
                PostionValue.Bottom=((PagePars.Height-HTMLElementPanel.height()-(_ShowPosition.Top-PagePars.Top))/PagePars.Height).toFixed(4);
            }else{
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                obj.html("");
            }
            if(_Target!=null){
                this.Render(_Target);
            }
            var StartPoint={X:0,Y:0}
            var self = this;
            /*事件绑定*/
            $('#'+self.shell.ID).live('mousedown',function(ev){
                if(!self.IsPageView){
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                    //$('#'+self.shell.ID).find(".CheckBoxItemDiv").css("width",HTMLElementPanel.width()+"px");
                }
            });

            $('#'+self.shell.ID).live('dblclick',function(ev){
                if(!Agi.Controls.IsControlEdit){
                    if(!self.IsPageView){
                        Agi.Controls.ControlEdit(self);//控件编辑界面
                    }
                }
            });
            $('#'+self.shell.ID).find(".mydiv").live("click",function(ev){
                $('#'+self.shell.ID).find(".mydiv").addClass("checkBox_Checked");
                var BasicProperty = self.Get("BasicProperty");
                var selectedItems=[];
                var selectedItemsText = [];
                var sign = 0;
                if($(this).parent().find(".CheckBoxItemsSty")[0].checked){
                    $(this).parent().find(".CheckBoxItemsSty")[0].checked='';
                }else{
                    $(this).parent().find(".CheckBoxItemsSty")[0].checked='checked';
                }
                var inputs = $('#'+self.shell.ID).find(".CheckBoxItemsSty");//获取所有的input标签对象。
                var obj =null;
                var aa=null;
                for(var i=0;i<inputs.length;i++){
                    obj = inputs[i];
                    aa=$(obj).parent();
                    aa.removeClass("CheckBoxHightLightItemDiv");
                    aa.find(".mydiv").removeClass("checkBox_Checked");
					aa.removeAttr("style");
                    aa.find(".mydiv").removeAttr("style");
                    aa.find(".mydiv").find(".checkBox_Checked").removeAttr("style");
                    if(obj.type=='checkbox'){
                        if(obj.checked==true){
                            selectedItems.push(obj.value);
                            selectedItemsText.push(aa.find("#labelID").html());
                            sign=1;
                            aa.addClass("CheckBoxHightLightItemDiv");
                            aa.find(".mydiv").addClass("checkBox_Checked");
                        }
                    }
                }
                var Alignment = BasicProperty.Alignment;

                var Zcss = {
                    width: '250px',
                    height: '25px',
                    borderBottom:'1px solid #9f9f9f',
                    background: '#f9f9f9',
                    verticalAlign: 'middle',
                    display:'-moz-box',
                    display:'-webkit-box',
                    display:'box'

                };

                var Hcss = {
                    width: '150px',
                    borderBottom:'1px solid #9f9f9f',
                    height: '25px',
                    verticalAlign: 'middle',
                    background: '#f9f9f9',
                    display:'-moz-box',
                    display:'-webkit-box',
                    display:'box'
                };



                if(Alignment == "纵向")
                {
                    $('#'+self.shell.ID).find(".CheckBoxItemDiv").css(Zcss);
                }
                else
                {
                    $('#'+self.shell.ID).find(".CheckBoxItemDiv").css(Hcss);
                }
                //背景色
                if(BasicProperty.BackgroundColor!=""){
                    //$(".CheckBoxItemDiv").removeAttr("style");
                    $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("background-color", BasicProperty.BackgroundColor);
                }
                //选中背景色
                if(BasicProperty.SelectedBackgroundColor!=""){
                    $('#'+self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-image","none");
                    $('#'+self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-color",BasicProperty.SelectedBackgroundColor);
                }else{
                    $('#'+self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-image","-webkit-gradient(linear,left bottom,left top,color-stop(0, #ededed),color-stop(1, #d7d7d7))");
                }
                //复选框颜色
                if(BasicProperty.CheckBoxColor!=""){
                    $('#'+self.shell.ID).find(".mydiv").css("background-color",BasicProperty.CheckBoxColor);
                }
                //选中时复选框
                if(BasicProperty.SelectedCheckBoxColor!=""){
                    $('#'+self.shell.ID).find(".checkBox_Checked").css("background-color",BasicProperty.SelectedCheckBoxColor);
                }
                //边框颜色
                if(BasicProperty.BorderColor!=null){
                    $('#'+self.shell.ID).find(".Checkboxnavbar").css("border-color", BasicProperty.BorderColor);
                    $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("border-color", BasicProperty.BorderColor);
//                    $(".CheckBoxItemDivHorizontal").css("border-color", BasicProperty.BorderColor);
                }

                if(BasicProperty.RowHeight!=0&&BasicProperty.RowHeight!=""){
                    //行高
                    $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("height", BasicProperty.RowHeight + "px") ;
                }
                if(BasicProperty.ColumnsWidth!=0&&BasicProperty.ColumnsWidth!=""){
                    $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("width", BasicProperty.ColumnsWidth + "px") ;
                }

                Me.Set("data",selectedItems+"&&"+selectedItemsText);
                if(sign==0)//没有被选择项
                {
                    //alert("未选择");
                }
            });

//            $(".checkBoxSpan").die("click");
//            $(".checkBoxSpan").live("click",function(ev){
//                var selectedItems=[];
//                var sign = 0;
//                if($(this).parent().find(".CheckBoxItemsSty")[0].checked){
//                    $(this).parent().find(".CheckBoxItemsSty")[0].checked='';
//                }else{
//                    $(this).parent().find(".CheckBoxItemsSty")[0].checked='checked';
//                }
//                var inputs = $(".CheckBoxItemsSty");//获取所有的input标签对象。
//                var obj =null;
//                var aa=null;
//                for(var i=0;i<inputs.length;i++){
//                    obj = inputs[i];
//                    aa=$(obj).parent();
//                    aa.removeClass("CheckBoxHightLightItemDiv");
//                    aa.find(".checkBox_Checked").removeClass("checkBox_Checked");
//                    if(obj.type=='checkbox'){
//                        if(obj.checked==true){
//                            selectedItems.push(obj.value);
//                            sign=1;
//                            aa.addClass("CheckBoxHightLightItemDiv");
//                            aa.find(".checkBoxSpan").addClass("checkBox_Checked");
//                        }
//                    }
//                }
//                Me.Set("data",selectedItems);
//                if(sign==0)//没有被选择项
//                {
//                    //alert("未选择");
//                }
//            });
            if(HTMLElementPanel.touchstart){
                HTMLElementPanel.touchstart(function(ev){
                    //Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position",PostionValue);
            //输出参数
            this.Set("SelValue",0);
            if(!self.IsPageView){
                //缩小的最小宽高设置
                HTMLElementPanel.resizable({
                    minHeight: self.minHeight,
                    minWidth: self.minWidth
                });
                $('#'+self.shell.ID +' .ui-resizable-handle').css('z-index',2000);
            }else{
            }

            Agi.Msg.PageOutPramats.AddPramats({
                'Type': Agi.Msg.Enum.Controls,
                'Key': ID,
                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1 }][{ 'Name': 'selectedValueText', 'Value': -1 }]
            });

        },//end Init
        CustomProPanelShow:function(){//显示自定义属性面板
            Agi.Controls.CheckBoxProrityInit(this);
        },
        Destory:function(){
            var HTMLElement=this.Get("HTMLElement");
            var proPerty=this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID);/*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/

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
                var Newcheckbox=new Agi.Controls.CheckBox();
                Newcheckbox.Init(ParentObj,PostionValue);
                newPanelPositionpars=null;
                return Newcheckbox;
            }
        },
        PostionChange:function(_Postion){
            if(_Postion!=null &&_Postion.Left!=null && _Postion.Top!=null && _Postion.Right!=null && _Postion.Bottom!=null){
                var ParentObj=$("#"+this.Get("HTMLElement").id).parent();
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
                var ThisHTMLElementobj=$("#"+this.Get("HTMLElement").id);
                var ParentObj = $('#BottomRightCenterContentDiv');;
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height(),Left:ParentObj.offset().left,Top:ParentObj.offset().top};


                var ThisControlPars={Width:ThisHTMLElementobj.width(),Height:ThisHTMLElementobj.height(),Left:(ThisHTMLElementobj.offset().left-PagePars.Left),Top:(ThisHTMLElementobj.offset().top-PagePars.Top),Right:0,Bottom:0};
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
            //ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left",(ParentObj.offset().left+parseInt(PostionValue.Left*PagePars.Width))+"px");
            ThisHTMLElement.css("top",(ParentObj.offset().top+parseInt(PostionValue.Top*PagePars.Height))+"px");
            this.Set("Position",PostionValue);
//          $('#'+this.shell.ID).css('height','auto');
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
            /*  $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
             "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        EnterEditState:function(){
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width:obj.width(),
                height:obj.height()
            }
            obj.css({"width":200, "height":200}).find('li[class*="checkbox"]').removeClass('open');

            this.IsEditState = true;
            //var h = this.shell.Title.height()+this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            //this.shell.Container.height(this.minHeight);
        },
        BackOldSize:function(){
            var self = this;
            if(this.oldSize){
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            $('#'+this.shell.ID).resizable({
                minHeight: self.minHeight,
                minWidth: self.minWidth
            });
            this.IsEditState = false;
        },
        ControlAttributeChangeEvent:function(_obj,Key,_Value){
            Agi.Controls.CheckBoxAttributeChange(this,Key,_Value);
        },
        GetConfig:function(){
            var ProPerty=this.Get("ProPerty");

            var ThisControlEntitys=this.Get("Entity");//获取当前控件中的Entity 列表

            var entitylist=[];
            //清除掉原Entity 中的Data 数据，并创建一个用于保存的Entity 数组
            for(var i=0;i<ThisControlEntitys.length;i++){
                entitylist.push(Agi.Script.CloneObj(ThisControlEntitys[i]));
                entitylist[i].data=null;
                entitylist[i].Data=null;
                entitylist[i].Parameters=ThisControlEntitys[i].Parameters;
                if(entitylist[i].Entity!=null){
                    entitylist[i].Entity.Parameters=ThisControlEntitys[i].Entity.Parameters;
                    entitylist[i].Entity.Data=null;
                }
            }


            var CheckBoxControl ={
                Control:{
                    ControlType:this.Get("ControlType"),//控件类型
                    ControlID:ProPerty.ID,//控件属性
                    ControlBaseObj:ProPerty.BasciObj[0].id,//控件对象
                    HTMLElement:ProPerty.BasciObj[0].id,//控件外壳ID
                    Entity:entitylist,//控件实体列表(清除Data 之后的Entity 数组)
                    BasicProperty:this.Get("BasicProperty"),//控件基本属性
                    Position:this.Get("Position"),//控件位置
                    ThemeInfo:this.Get("ThemeInfo"),
                    ThemeName:this.Get("ThemeName"),
                    IsCustom:this.Get("IsCustom"),//标志位，判断是自定义数据还是datasets
                    CustomData:this.Get("CustomData"),//自定义数据
                    selectTextField:this.Get("selectTextField"), //显示值
                    selectValueField:this.Get("selectTextField"), //选中值
                    DelItems:this.Get("DelItems")
                }
            }
            return CheckBoxControl.Control;
        },//获得Panel控件的配置信息
        CreateControl:function(_Config,_Target){
            var BasicProperty = _Config.BasicProperty;
            var savedId = _Config.ControlID;
            this.Init(_Target,_Config.Position,savedId);
            if(_Config!=null){
                if (typeof (_Config.Position) == "string") {
                    _Config.Position = JSON.parse(_Config.Position);
                }
                this.Set("Position", _Config.Position);
                if (typeof (_Config.ThemeInfo) == "string") {
                    _Config.ThemeInfo =  JSON.parse(_Config.ThemeInfo);
                }
                _Config.DelItems = _Config.DelItems;
                var DelItems = _Config.DelItems;
                this.Set("DelItems", DelItems);

                _Config.Entity = _Config.Entity;
                var Entity = _Config.Entity;
                this.Set("Entity", Entity);
                _Config.CustomData = _Config.CustomData;
                var CustomData = _Config.CustomData;
                this.Set("CustomData", CustomData);

                _Config.selectTextField = _Config.selectTextField;
                var selectTextField = _Config.selectTextField;
                this.Set("selectTextField", selectTextField);
                _Config.selectValueField = _Config.selectValueField;
                var selectValueField = _Config.selectValueField;
                this.Set("selectValueField", selectValueField);
//                _Config.DelItems = _Config.DelItems;
//                var DelItems = _Config.DelItems;
//                this.Set("DelItems", DelItems);
                this.Set("BasicProperty", BasicProperty);
//                _Config.IsCustom = _Config.IsCustom;
//                var IsCustom = _Config.IsCustom;
//                if (IsCustom)
//                {
//                    _Config.CustomData = _Config.CustomData;
//                    var CustomData = _Config.CustomData;
//                    this.Set("CustomData", CustomData);
//                }
//                else
//                {
//                    this.IsChangeEntity=true;
//                    _Config.Entity = _Config.Entity;
//                    var Entity = _Config.Entity;
//                    this.Set("Entity", Entity);
//                }
           //     this.ChangeTheme(_Config.ThemeName);
            }
        },//根据配置信息创建控件
        ChangeTheme:function(_themeName){
            var Me=this;
            //1.根据当前控件类型和样式名称获取样式信息
            var CheckBoxStyleValue=Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"),_themeName);

            //2.保存主题
            Me.Set("ThemeName",_themeName);

            //3.应用当前控件的信息
            Agi.Controls.CheckBox.OptionsAppSty(CheckBoxStyleValue,Me);
            //4.
            //   this.Set("BasicProperty", TimePickerStyleValue);
            //5.控件刷新显示
            //  Me.Refresh();//刷新显示

            //   TimePickerStyleValue=null;
        },//更改控件样式
        InEdit:function(){
//            var Me=this;
//            Me.UnChecked();//取消当前控件选中
//            var BolIsCustom=Me.Get("IsCustom");//当前数据是否为自定义
//            if(BolIsCustom){//是否自定义数据,如果是自定义数据时才显示删除选项(重新绑定数据)
//                Agi.Controls.CheckBoxBindDataByCustomData(Me,Me.Get("CustomData"))
//            }

        },//编辑中
        ExtEdit:function(){
//            var Me=this;
//            if($("#menuBasichartseriesdiv").length>0){
//                $("#menuBasichartseriesdiv").remove();
//            }
//            if(Me.Get("HTMLElement")!=null){
//                Me.Checked();
//            }
//
//            var BolIsCustom=Me.Get("IsCustom");//当前数据是否为自定义
//            if(BolIsCustom){//是否自定义数据,如果是自定义数据时才显示删除选项(重新绑定数据)
//                Agi.Controls.CheckBoxBindDataByCustomData(Me,Me.Get("CustomData"))
//            }
        }//退出编辑
    },true);
/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 * _Options:控件相关参数信息
 * */
Agi.Controls.CheckBox.OptionsAppSty=function(_StyConfig,CheckBox){
    if(_StyConfig !=null){
           /* Alignment:"纵向" ,//"horizontal","vertical" 排列方向
            BorderColor:"#9f9f9f",
            ColumnsWidth:250,
            RowHeight:25,
            TopLeftFillet:0,
            TopRightFillet:0,
            BottomLeftFillet:0,
            BottomRightFillet:0,
            BackgroundColor:"#f9f9f9",
            SelectedBackgroundColor:"#dadada",
            CheckBoxColor:"#f9f9f9",
            SelectedCheckBoxColor:"#f9f9f9"*/

     var BasicProperty = CheckBox.Get("BasicProperty");
     BasicProperty.Alignment = _StyConfig.Alignment;
     BasicProperty.BorderColor = _StyConfig.BorderColor;
     BasicProperty.ColumnsWidth = _StyConfig.ColumnsWidth;
     BasicProperty.RowHeight = _StyConfig.RowHeight;
     BasicProperty.TopLeftFillet = _StyConfig.TopLeftFillet;
     BasicProperty.TopRightFillet = _StyConfig.TopRightFillet;
     BasicProperty.BottomLeftFillet = _StyConfig.BottomLeftFillet;
     BasicProperty.BottomRightFillet = _StyConfig.BottomRightFillet;
     BasicProperty.BackgroundColor = _StyConfig.BackgroundColor;
     BasicProperty.SelectedBackgroundColor = _StyConfig.SelectedBackgroundColor;
     BasicProperty.CheckBoxColor = _StyConfig.CheckBoxColor;
     BasicProperty.SelectedCheckBoxColor = _StyConfig.SelectedCheckBoxColor;

     /*CheckBox.Set("BasicProperty",BasicProperty);*/


    /*    var min =  CheckBox.shell.BasicID;
        //alert( $("#" +min).find(".CheckBoxItemDiv")+_StyConfig.background);

        $("#" +min).find('#labelID').css("font-size", _StyConfig.fontSize);
        $(".Checkboxnavbar").css("background-color",_StyConfig.background);
        $("#" +min).find('#labelID').css("color",_StyConfig.color);*/

    }
}
/*下拉列表控件参数更改处理方法*/
Agi.Controls.CheckBoxAttributeChange=function(_ControlObj,Key,_Value){
    var self = _ControlObj;
    switch(Key){
        case "Position":
        {
            if(layoutManagement.property.type==1){
                var ThisHTMLElement=$(_ControlObj.Get("HTMLElement"));
                var ThisControlObj=_ControlObj.Get("ProPerty").BasciObj;

                var ParentObj=ThisHTMLElement.parent();
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                //ThisControlObj.height(ThisHTMLElement.height()-20);
                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                ThisHTMLElement.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                ThisHTMLElement.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");
                PagePars=null;
            }
        }break;
        case "SelValue":
        {
//            var _ParameterInfo={
//                Type:"控件输出参数",
//                Control:_ControlObj,
//                ChangeValue:[{Name:"SelValue",Value:_Value}]
//            }
        }break;
        case "data"://用户选择了一个项目
        {
            var data =_Value;
            if(data){
                var dataset = data.split("&&");
                var ThisProPerty = _ControlObj.Get("ProPerty");
                Agi.Msg.PageOutPramats.PramatsChange({
                    'Type': Agi.Msg.Enum.Controls,
                    'Key': ThisProPerty.ID,
                    'ChangeValue': [{ 'Name': 'selectedValue', 'Value': dataset[0].toString()}][{ 'Name': 'selectedValueText', 'Value': dataset[1] }]
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj,"Type":Agi.Msg.Enum.Controls});
            }
        }break;
        case "BasicProperty":
        {
            var BasicProperty = _ControlObj.Get('BasicProperty');
            var Alignment = BasicProperty.Alignment;

            var Zcss = {
                width: '250px',
                height: '25px',
                borderBottom:'1px solid #9f9f9f',
                background: '#f9f9f9',
                verticalAlign: 'middle',
                display:'-moz-box',
                display:'-webkit-box',
                display:'box'
            };

            var Hcss = {
                width: '150px',
                borderBottom:'1px solid #9f9f9f',
                height: '25px',
                verticalAlign: 'middle',
                background: '#f9f9f9',
                display:'-moz-box',
                display:'-webkit-box',
                display:'box'
            };



            if(Alignment == "纵向")
            {
                $('#'+self.shell.ID).find(".CheckBoxItemDiv").removeAttr("style");
                $('#'+self.shell.ID).find(".CheckBoxItemDiv").css(Zcss);
            }
            else
            {
                $('#'+self.shell.ID).find(".Checkboxnavbar").removeClass("Verishow");
                $('#'+self.shell.ID).find(".CheckBoxItemDiv").removeAttr("style");
                $('#'+self.shell.ID).find(".CheckBoxItemDiv").css(Hcss);
            }
            if(BasicProperty.ColumnsWidth!=""){
                $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("width", BasicProperty.ColumnsWidth + "px") ;
                $('#'+self.shell.ID).find("#labelID").css("width", BasicProperty.ColumnsWidth*0.7+"px") ;
            }
            if(BasicProperty.RowHeight!=""){
                //行高
                $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("height", BasicProperty.RowHeight + "px") ;
            }

            //背景色
            if(BasicProperty.BackgroundColor!=""){
                $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("background-color", BasicProperty.BackgroundColor);
            }

            //边框颜色
            $('#'+self.shell.ID).find(".Checkboxnavbar").css("border-color", BasicProperty.BorderColor);
            $('#'+self.shell.ID).find(".CheckBoxItemDiv").css("border-color", BasicProperty.BorderColor);
//            $(".CheckBoxItemDivHorizontal").css("border-color", BasicProperty.BorderColor);

            /*//左上圆角
            $('#'+self.shell.ID).find(".Checkboxnavbar").css("border-top-left-radius", BasicProperty.TopLeftFillet + "px");
            //右上圆角
            $('#'+self.shell.ID).find(".Checkboxnavbar").css("border-top-right-radius", BasicProperty.TopRightFillet + "px");
            //左下圆角
            $('#'+self.shell.ID).find(".Checkboxnavbar").css("border-bottom-left-radius", BasicProperty.BottomLeftFillet + "px");
            //右下圆角
            $('#'+self.shell.ID).find(".Checkboxnavbar").css("border-bottom-right-radius", BasicProperty.BottomRightFillet + "px");*/

            //选中项背景色
            if(BasicProperty.SelectedBackgroundColor!=""){
                $('#'+self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-image","none");
                $('#'+self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-color",BasicProperty.SelectedBackgroundColor);
            }else{
                $('#'+self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-image","-webkit-gradient(linear,left bottom,left top,color-stop(0, #ededed),color-stop(1, #d7d7d7))");
            }

            //按钮颜色
            if(BasicProperty.CheckBoxColor!=""){
                $('#'+self.shell.ID).find(".mydiv").css("background-color",BasicProperty.CheckBoxColor);
            }
            //选中项按钮颜色
            if(BasicProperty.SelectedCheckBoxColor!=""){
                $('#'+self.shell.ID).find(".checkBox_Checked").css("background-color",BasicProperty.SelectedCheckBoxColor);
            }

        }
            break;
        case "Entity"://实体
        {
            var entity = _ControlObj.Get('Entity');

            BindDataByEntity(_ControlObj,entity[0]);

        }
        case "CustomData"://自定义数据更改
        {
            var CustomData = self.Get("CustomData");
            var $UI = $('#'+ self.shell.ID);
            var menu = $UI.find('.Checkboxnavbar');
            var entity = self.Get("Entity");
            if(entity&&entity.length)
            {
                if(Agi.Edit)
                {
                    menu.empty();
                    RefreshEntity(_ControlObj);
                }
            }
            else
            {
                menu.empty();
            }
            if(CustomData&&CustomData.length){
                var BasicProperty = self.Get("BasicProperty");//获得控件基础对象属性信息(obj)

//                if(Agi.Edit)
//                {
//                    menu.empty();
//                    RefreshEntity(_ControlObj);
//                }

                    var Zcss = {
                        width: '250px',
                        height: '25px',
                        borderBottom:'1px solid #9f9f9f',
                        background: '#f9f9f9',
                        verticalAlign: 'middle',
                        display:'-moz-box',
                        display:'-webkit-box',
                        display:'box'
                    };

                    var Hcss = {
                        width: '150px',
                        borderBottom:'1px solid #9f9f9f',
                        height: '25px',
                        verticalAlign: 'middle',
                        background: '#f9f9f9',
                        display:'-moz-box',
                        display:'-webkit-box',
                        display:'box'
                    };
                    var Alignment = BasicProperty.Alignment;

                    $(CustomData).each(function(i,dd){
                        $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme'+(i+1)+'" value='+dd.Value+' class="CheckBoxItemsSty"/><div class="mydiv"/><label id="labelID">'+dd.Text+'</label></div>').appendTo(menu);
                    });
                    if(Alignment == "纵向")
                    {
                        $UI.find(".CheckBoxItemDiv").removeAttr("style");
                        $UI.find(".CheckBoxItemDiv").css(Zcss);
                    }
                    else
                    {
                        $UI.find(".CheckBoxItemDiv").removeAttr("style");
                        $UI.find(".CheckBoxItemDiv").css(Hcss);
                    }
                    setProperty(BasicProperty);

            }
        }break;
        case "DelItems": //实体数据有删除
        {
            RefreshEntity(_ControlObj);
            var BasicProperty = _ControlObj.Get("BasicProperty");
            var CustomData = self.Get("CustomData");
            if(CustomData&&CustomData.length){
                var BasicProperty = self.Get("BasicProperty");//获得控件基础对象属性信息(obj)
//                BasicProperty.selectTextField ="Text";
//                BasicProperty.selectValueField ="Value";
                var $UI = $('#'+ self.shell.ID);
                var menu = $UI.find('.Checkboxnavbar');
                var entity = self.Get("Entity");
                var etLength = entity[0].Data.length;//实体长度
                var length = CustomData.length;
//                $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" value='+CustomData[length-1].Value+' class="CheckBoxItemsSty"/><div class="mydiv"/><label id="labelID">'+CustomData[length-1].Text+'</label></div>').appendTo(menu);
//                var mLeft = $('.managementLeftDiv');

                //先判断排列方向？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
                var Zcss = {
                    width: '250px',
                    height: '25px',
                    borderBottom:'1px solid #9f9f9f',
                    background: '#f9f9f9',
                    verticalAlign: 'middle',
                    display:'-moz-box',
                    display:'-webkit-box',
                    display:'box'
                };

                var Hcss = {
                    width: '150px',
                    borderBottom:'1px solid #9f9f9f',
                    height: '25px',
                    verticalAlign: 'middle',
                    background: '#f9f9f9',
                    display:'-moz-box',
                    display:'-webkit-box',
                    display:'box'
                };
                var Alignment = BasicProperty.Alignment;

                    $(CustomData).each(function(i,dd){
                        $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme'+(i+1)+'" value='+dd.Value+' class="CheckBoxItemsSty"/><div class="mydiv"/><label id="labelID">'+dd.Text+'</label></div>').appendTo(menu);
                    });
                if(Alignment == "纵向")
                {
                    $UI.find(".CheckBoxItemDiv").removeAttr("style");
                    $UI.find(".CheckBoxItemDiv").css(Zcss);
                }
                else
                {
                    $UI.find(".CheckBoxItemDiv").removeAttr("style");
                    $UI.find(".CheckBoxItemDiv").css(Hcss);
                }
            }
            setProperty(BasicProperty);
        }break;
        case "selectValueField":
        {
            RefreshEntity(_ControlObj);
            RefreshCustomData(_ControlObj);
            ChangePropertyPanelLeft(_ControlObj);
        }break;
        case "selectTextField":
        {
            RefreshEntity(_ControlObj);
            RefreshCustomData(_ControlObj);
            ChangePropertyPanelLeft(_ControlObj);
        }break;
    }//end switch

    var _themeName = _ControlObj.Get("ThemeName");
    var CheckBoxStyleValue=Agi.layout.StyleControl.GetStyOptionByControlType(_ControlObj.Get("ControlType"),_themeName);
    Agi.Controls.CheckBox.OptionsAppSty(CheckBoxStyleValue,_ControlObj);

    function BindDataByEntity(controlObj,et){
        var self = controlObj;
        Agi.Utility.RequestData2(et,function(d){

            var BasicProperty = controlObj.Get("BasicProperty");

            var data = d.Data.length ? d.Data : [];
            var columns = d.Columns;
            et.Data = data;
            et.Columns = d.Columns;
            RefreshEntity(controlObj);

        });
        var _themeName = controlObj.Get("ThemeName");
        var CheckBoxStyleValue=Agi.layout.StyleControl.GetStyOptionByControlType(controlObj.Get("ControlType"),_themeName);
        Agi.Controls.CheckBox.OptionsAppSty(CheckBoxStyleValue,controlObj);
        return;
    }
    function RefreshEntity(controlObj)
    {
        entity = controlObj.Get("Entity");
        if(entity&&entity.length)
        {
            var BasicProperty = controlObj.Get("BasicProperty");
            var Alignment = BasicProperty.Alignment;
            var DelItems = controlObj.Get("DelItems");
            var selectTextField = controlObj.Get("selectTextField");
            var selectValueField = controlObj.Get("selectValueField");

            if(selectTextField == null)
            {
                selectTextField = entity[0].Columns[0];
            }
            if(selectValueField == null)
            {
                selectValueField = entity[0].Columns[0];
            }

            var $UI = $('#'+ controlObj.shell.ID);
            var menu = $UI.find('.Checkboxnavbar');
            menu.empty();
            var data = entity[0].Data;
//            var textField = BasicProperty && BasicProperty.selectTextField?BasicProperty.selectTextField:columns[0];
//            var valueField = BasicProperty && BasicProperty.selectValueField?BasicProperty.selectValueField:columns[0];
//            if(BasicProperty.selectTextField == undefined){
//                BasicProperty.selectTextField = textField
//            }
//            if(BasicProperty.selectValueField == undefined){
//                BasicProperty.selectValueField = valueField;
//            }
            var Zcss = {
                width: '250px',
                height: '25px',
                borderBottom:'1px solid #9f9f9f',
                background: '#f9f9f9',
                verticalAlign: 'middle',
                display:'-moz-box',
                display:'-webkit-box',
                display:'box'
            };

            var Hcss = {
                width: '150px',
                borderBottom:'1px solid #9f9f9f',
                height: '25px',
                verticalAlign: 'middle',
                background: '#f9f9f9',
                display:'-moz-box',
                display:'-webkit-box',
                display:'box'
            };
            if(DelItems&&DelItems.length) //有删除数据
            {

                $(data).each(function(i,dd){
                    var flag = false;
                    for(var j=0; j<DelItems.length; j++)
                    {
                        if(i == DelItems[j])
                        {
                            flag = true;
                            break;
                        }
                    }
                    if(flag == false)
                    {
                        //    $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme1" value="'+dd[valueField.trim()]+'" class="CheckBoxItemsSty"/><div class="mydiv" /><label id="labelID">'+dd[textField.trim()]+'</label></div>').appendTo(menu);
                        $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme1" value="'+dd[selectValueField]+'" class="CheckBoxItemsSty"/><div class="mydiv" /><label id="labelID">'+dd[selectTextField]+'</label></div>').appendTo(menu);

                    }
                });
                if(Alignment == "纵向")
                {
                    $UI.find(".CheckBoxItemDiv").removeAttr("style");
                    $UI.find(".CheckBoxItemDiv").css(Zcss);
                }

                else
                {
                    $UI.find(".CheckBoxItemDiv").removeAttr("style");
                    $UI.find(".CheckBoxItemDiv").css(Hcss);
                }
            }
            else
            {
                if(Alignment == "纵向")
                {
                    $(data).each(function(i,dd){
                        $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme1" value="'+dd[selectValueField]+'" class="CheckBoxItemsSty"/><div class="mydiv" /><label id="labelID">'+dd[selectTextField]+'</label></div>').appendTo(menu);
                    });
                    $UI.find(".CheckBoxItemDiv").removeAttr("style");
                    $UI.find(".CheckBoxItemDiv").css(Zcss);
                }
                else
                {
//                    $(data).each(function(i,dd){
//                        $('<div class="CheckBoxItemDivHorizontal"><input type="checkbox" name="item[]" id="itme1" value="'+dd[valueField.trim()]+'" class="CheckBoxItemsSty"/><div class="mydiv" /><label id="labelID">'+dd[textField.trim()]+'</label></div>').appendTo(menu);
//                    });
                    $(data).each(function(i,dd){
                        $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme1" value="'+dd[selectValueField]+'" class="CheckBoxItemsSty"/><div class="mydiv" /><label id="labelID">'+dd[selectTextField]+'</label></div>').appendTo(menu);
                    });
                    $UI.find(".CheckBoxItemDiv").removeAttr("style");
                    $UI.find(".CheckBoxItemDiv").css(Hcss);
                }
            }

            if(!Agi.Edit)
            {
                RefreshCustomData(controlObj);
            }
            setProperty(BasicProperty);
        }

    }
    function setProperty(BasicProperty){
        //列宽
        if(BasicProperty.ColumnsWidth!=""){
            $('#'+ self.shell.ID).find(".CheckBoxItemDiv").css("width", BasicProperty.ColumnsWidth + "px") ;
        }
        if(BasicProperty.RowHeight!=""){
        //行高
            $('#'+ self.shell.ID).find(".CheckBoxItemDiv").css("height", BasicProperty.RowHeight + "px") ;
        }
        //背景色
        if(BasicProperty.BackgroundColor!=""){
            $('#'+ self.shell.ID).find(".CheckBoxItemDiv").css("background-color", BasicProperty.BackgroundColor);
        }

        //边框颜色
        $('#'+ self.shell.ID).find(".Checkboxnavbar").css("border-color", BasicProperty.BorderColor);
        $('#'+ self.shell.ID).find(".CheckBoxItemDiv").css("border-color", BasicProperty.BorderColor);
//        $(".CheckBoxItemDivHorizontal").css("border-color", BasicProperty.BorderColor);

        /*//左上圆角
        $('#'+ self.shell.ID).find(".Checkboxnavbar").css("border-top-left-radius", BasicProperty.TopLeftFillet + "px");
        //右上圆角
        $('#'+ self.shell.ID).find(".Checkboxnavbar").css("border-top-right-radius", BasicProperty.TopRightFillet + "px");
        //左下圆角
        $('#'+ self.shell.ID).find(".Checkboxnavbar").css("border-bottom-left-radius", BasicProperty.BottomLeftFillet + "px");
        //右下圆角
        $('#'+ self.shell.ID).find(".Checkboxnavbar").css("border-bottom-right-radius", BasicProperty.BottomRightFillet + "px");*/

        //选中项背景色
        if(BasicProperty.SelectedBackgroundColor!=""){
            $('#'+ self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-image","none");
            $('#'+ self.shell.ID).find(".CheckBoxHightLightItemDiv").css("background-color",BasicProperty.SelectedBackgroundColor);
        }

        //按钮颜色
        if(BasicProperty.CheckBoxColor!=""){
            $('#'+ self.shell.ID).find(".mydiv").css("background-color",BasicProperty.CheckBoxColor);
        }
        //选中项按钮颜色
        if(BasicProperty.SelectedCheckBoxColor!=""){
            $('#'+ self.shell.ID).find(".checkBox_Checked").css("background-color",BasicProperty.SelectedCheckBoxColor);
        }
    }
    function RefreshCustomData(controlObj){
        var CustomData = controlObj.Get("CustomData");
        if(CustomData&&CustomData.length){
            var BasicProperty = self.Get("BasicProperty");//获得控件基础对象属性信息(obj)
//                BasicProperty.selectTextField ="Text";
//                BasicProperty.selectValueField ="Value";
            var $UI = $('#'+ self.shell.ID);
            var menu = $UI.find('.Checkboxnavbar');
            var entity = self.Get("Entity");
            var etLength = entity[0].Data.length;//实体长度
            var CustomData = self.Get("CustomData");
            var length = CustomData.length;

            var Zcss = {
                width: '250px',
                height: '25px',
                borderBottom:'1px solid #9f9f9f',
                background: '#f9f9f9',
                verticalAlign: 'middle',
                display:'-moz-box',
                display:'-webkit-box',
                display:'box'
            };

            var Hcss = {
                width: '150px',
                borderBottom:'1px solid #9f9f9f',
                height: '25px',
                verticalAlign: 'middle',
                background: '#f9f9f9',
                display:'-moz-box',
                display:'-webkit-box',
                display:'box'
            };
            var Alignment = BasicProperty.Alignment;
            if(Alignment == "纵向")
            {
                $(CustomData).each(function(i,dd){
                    $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme'+(i+1)+'" value='+dd.Value+' class="CheckBoxItemsSty"/><div class="mydiv"/><label id="labelID">'+dd.Text+'</label></div>').appendTo(menu);
                });
                $UI.find(".CheckBoxItemDiv").removeAttr("style");
                $UI.find(".CheckBoxItemDiv").css(Zcss);
            }
            else
            {
                $(CustomData).each(function(i,dd){
                    $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme'+(i+1)+'" value='+dd.Value+' class="CheckBoxItemsSty"/><div class="mydiv"/><label id="labelID">'+dd.Text+'</label></div>').appendTo(menu);
                });
                $UI.find(".CheckBoxItemDiv").removeAttr("style");
                $UI.find(".CheckBoxItemDiv").css(Hcss);
            }
            setProperty(BasicProperty);

        }
    }

}//end
/*下拉列表参数更改 _CheckBoxID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.CheckBoxParsChange=function(_CheckBoxID,_ParsName,_ParsValue){
    var ThisControl=Agi.Controls.FindControl(_CheckBoxID);/*查找到相应的控件*/
    if(ThisControl){
        ThisControl.Set(_ParsName,_ParsValue);
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitCheckBox=function(){
    return new Agi.Controls.CheckBox();
}
//CheckBox 自定义属性面板初始化显示
Agi.Controls.CheckBoxProrityInit=function(checkboxControl){
    var BasicProperty = checkboxControl.Get('BasicProperty');
    var selectTextField = checkboxControl.Get("selectTextField");
    var selectValueField = checkboxControl.Get("selectValueField");

    var ThisProItems=[];
    //绑定配置的代码
    var bindHTML=null;
    bindHTML = $('<form class="CheckBox-form-horizontal">'+
        '</form>');
    var entity = checkboxControl.Get('Entity');
    $(['显示值','选择值']).each(function(i,label){
        bindHTML.append('<div class="CheckBox-control-group" style="padding-top: 5px; padding-left: 10px;">'+
            '<div style="float: left"><label style="display: block;" class="checkBox-control-label" for="inputEmail">'+label+'</label></div>'+
            '<div class="checkBox_controls" style="float: left;">'+
            '<select data-field="'+label+'" placeholder="" class="input"></select>'+
            '</div>'+
            '</div><div class="ClearfloatDiv"></div>');
    });
    var options = null;

    if(entity.length){
        var DelItems = checkboxControl.Get("DelItems");
        var DelItemsLength = DelItems.length;
        if(entity[0].Data.length > DelItemsLength)
        {
            if(entity[0].Columns){
                options="";
                $(entity[0].Columns).each(function(i,col){
                    options += "<option value='"+col+"'>"+col+"</option>"
                });
            }
        }

    }
    bindHTML.find('select').append($(options)).bind('change',{sels:bindHTML.find('select')},function(e){
        $(e.data.sels).each(function(i,sel){
            var f = $(sel).data('field');
            if(f=='显示值'){
//                BasicProperty.selectTextField = $(sel).val();
                selectTextField = $(sel).val();
            }
            else if(f=='选择值'){
  //              BasicProperty.selectValueField = $(sel).val();
                selectValueField = $(sel).val();
            }
        });
        checkboxControl.Set('selectTextField',selectTextField);
        checkboxControl.Set("selectValueField", selectValueField);
    }).each(function(i,sel){
            var f = $(sel).data('field');
            if(f=='显示值'){
                $(sel).val(selectTextField);
            }
            else if(f=='选择值'){
                $(sel).val(selectValueField);
            }
        });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"绑定设置",DisabledValue:1,ContentObj:bindHTML}));

    //基本设置
    BasicContent = null;
    BasicContent = new Agi.Script.StringBuilder();
    BasicContent.append("<div class='CheckBox_Pro_Panel'>");
    BasicContent.append("<table class='prortityCheckBoxTable' border='0' cellspacing='1' cellpadding='0'>");
    BasicContent.append("<tr>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>排列方式:</td><td class='prortityCheckBoxTabletd1'><select id='checkbox-alignment'><option value='纵向'>纵向</option><option value='横向'>横向</option> </select></td>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>边框颜色:</td><td class='prortityCheckBoxTabletd1'><input id='checkboxBorderColor'type='text' /></td>");
    BasicContent.append("</tr>");
    BasicContent.append("<tr>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>列    宽:</td><td class='prortityCheckBoxTabletd1'><input id='checkbox-column-width' type='number' value='600' min='150' max='800'/></td>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>行    高:</td><td class='prortityCheckBoxTabletd1'><input id='checkbox-row-height' type='number' value='25' min='20' max='100' /></td>");
    BasicContent.append("</tr>");
    /*BasicContent.append("<tr>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>左上圆角:</td><td class='prortityCheckBoxTabletd2'><input id='checkbox-topleftfillet' type='number' value='0' min='0' max='100' /></td>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>右上圆角:</td><td class='prortityCheckBoxTabletd1'><input id='checkbox-toprightfillet' type='number' value='0' min='0' max='100'/></td>");
    BasicContent.append("</tr>");
    BasicContent.append("<tr>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>左下圆角:</td><td class='prortityCheckBoxTabletd2'><input id='checkbox-bottomleftfillet' type='number' value='0' min='0' max='100'/></td>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>右下圆角:</td><td class='prortityCheckBoxTabletd2'><input id='checkbox-bottomrightfillet' type='number' value='0' min='0' max='100' /></td>");
    BasicContent.append("</tr>");*/
    BasicContent.append("<tr>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>背景颜色:</td><td class='prortityCheckBoxTabletd2'><input id='checkbox-backgroudcolor' type='text'/></td>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>选中项背景颜色:</td><td class='prortityCheckBoxTabletd1'><input id='checkbox-selectedbgdcolor' type='text'/></td>")
    BasicContent.append("</tr>");
    BasicContent.append("<tr>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>按钮颜色:</td><td class='prortityCheckBoxTabletd2'><input id='checkbox-color' type='text'/></td>");
    BasicContent.append("<td class='prortityCheckBoxTabletd0'>选中项按钮颜色:</td><td class='prortityCheckBoxTabletd1'><input id='checkbox-selectedbtncolor' type='text'/></td>")
    BasicContent.append("</tr>");
    BasicContent.append("</table>");
    BasicContent.append("</div>");
    var FilletObj = $(BasicContent.toString());
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: FilletObj }));

//
//    //用户自定义ITEM
//    var controlObject = $(checkboxControl.Get('HTMLElement'));
//    var customItemHTML =  $('<form class="CheckBox-form-horizontal">'+
//        '</form>');
//    $(['']).each(function(i,label){
//        var field = getField(label);
//        customItemHTML.append('<div class="CheckBox_Pro_Panel">'+
//            '<label style="display: block;" class="control-label" for="inputEmail">'+label+'</label>'+
//            '<div class="CustomItemcontrols" style="padding-top: 5px;padding-left: 10px">'+
//            '显示值:<input type="text" name="selectTextField" placeholder="显示值"  id="selectTextField" autofocus required> <br />'+
//            '选择值:<input type="text" name="selectValueField" placeholder="选择值" id = "selectValueField" autofocus required> <br />'+
//            '<div><input type="button" value="添加" style="width:150px;" id="propertychange" class="btnclass"></div>'+
//            '</div>'+
//            '</div>');
//    });
    var manageHTML = $('<form class="CheckBox-management"></form>');
    manageHTML.append('<div id="managementLeftDiv"></div>' +
        '<div id="managementRightDiv" >' +
        '<label>选项信息：</label>' +
        '<div class="checkboxprotityrowsty"><label>显示值：</label><input class="checkboxDisplayValue1" type="text"/></div>' +
        '<div class="checkboxprotityrowsty"><label>选择值：</label><input class="checkboxSelectedValue1" type="text"/></div>' +
        '<div class="checkboxprotityrowsty"><input type="button" class="SaveChangeBtn" value="保存修改"/><input type="button" class="DelItemBtn" value="删除选项"/></div>' +
        '<label>选项信息：</label>' +
        '<div class="checkboxprotityrowsty"><label>显示值：</label><input class="checkboxDisplayValue2" type="text"/></div>' +
        '<div class="checkboxprotityrowsty"><label>选择值：</label><input class="checkboxSelectedValue2" type="text"/></div>' +
        '<div class="checkboxprotityrowsty"><input type="button" class="AddCustomDataBtn" value="添加"/></div>' +
        '</div>');

    ThisProItems.push(new Agi.Controls.Property.PropertyItem({Title:"选项管理",DisabledValue:1,ContentObj:manageHTML}));


    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);

    var entity = checkboxControl.Get("Entity");
    var CustomData = checkboxControl.Get("CustomData");
//    if((entity&&entity.length)||(CustomData&&CustomData.length))
//    {
    et = entity[0];
    var data;
    var etLength;     //实体datasets长度
    if(entity&&entity.length)
    {
        data = et.Data;
        etLength = entity[0].Data.length;
    }
    else
    {
        data = [];
        etLength = 0;
    }

        ChangePropertyPanelLeft(checkboxControl);

        var ClickItem;
//        var etLength = entity[0].Data.length;
        $(".mLeftDivItem").die("click");
        $(".mLeftDivItem").live("click",function(ev){
        $(".mLeftDivItem").removeClass("leftItemSelected");
            $(this).addClass("leftItemSelected");
            var i = $(this).find(".count").html();
            ClickItem = i;
            if(i < etLength)
            {
//            var textField = BasicProperty && BasicProperty.selectTextField?BasicProperty.selectTextField:columns[0];
//            var valueField = BasicProperty && BasicProperty.selectValueField?BasicProperty.selectValueField:columns[0];
//            if(BasicProperty.selectTextField == undefined){
//                BasicProperty.selectTextField = textField
//            }
//            if(BasicProperty.selectValueField == undefined){
//                BasicProperty.selectValueField = valueField;
//            }
                if(selectTextField == null)
                {
                    selectTextField = entity[0].Columns[0];
                }
                if(selectValueField == null)
                {
                    selectValueField = entity[0].Columns[0];
                }

                $(".SaveChangeBtn").css("visibility", "hidden");
//            $("#managementRightDiv").find(".checkboxDisplayValue1").val(data[i][textField]);
//            $("#managementRightDiv").find(".checkboxSelectedValue1").val(data[i][valueField]);
                $("#managementRightDiv").find(".checkboxDisplayValue1").val(data[i][selectTextField]);
                $("#managementRightDiv").find(".checkboxSelectedValue1").val(data[i][selectValueField]);
            }
            else
            {
                $(".SaveChangeBtn").css("visibility", "visible");
                var j = i - etLength;
                var CustomData = checkboxControl.Get("CustomData");
//            BasicProperty.selectTextField ="Text";
//            BasicProperty.selectValueField ="Value";
                $("#managementRightDiv").find(".checkboxDisplayValue1").val(CustomData[j].Text);
                $("#managementRightDiv").find(".checkboxSelectedValue1").val(CustomData[j].Value);

            }

        });

        $(".SaveChangeBtn").die("click");
        //点击保存修改按钮
        $(".SaveChangeBtn").live('click', function () {
            var j = ClickItem - etLength;
            var ThisCustomData=checkboxControl.Get("CustomData");//获取控件的自定义显示数据

            ThisCustomData[j].Text = $(".checkboxDisplayValue1").val();
            ThisCustomData[j].Value = $(".checkboxSelectedValue1").val();
            $(".checkboxDisplayValue1").val("");
            $(".checkboxSelectedValue1").val("");

            checkboxControl.Set("CustomData",ThisCustomData);
            ChangePropertyPanelLeft(checkboxControl);

        });

        $(".DelItemBtn").die("click");
        //点击删除选项按钮
        $(".DelItemBtn").live('click', function () {

//            var DelItemsLength = checkboxControl.DelItems.length; //获取datasets中已删除的数目
            var DelItems = checkboxControl.Get("DelItems");
            var DelItemsLength = DelItems.length;
            if(ClickItem < etLength) //删除Entity内一条数据
            {
                DelItems.push(ClickItem);
                checkboxControl.Set("DelItems", DelItems);
                $(".checkboxDisplayValue1").val("");
                $(".checkboxSelectedValue1").val("");

                if(DelItems.length == etLength)
                {
                    var sel = $(".CheckBox-control-group").find(".checkBox_controls").find("select");
                    for(var i=0; i<sel.length; i++)
                    {
                        var selOptionsLength = sel[i].length;
                        for(var j=0; j<selOptionsLength; j++)
                        {
                            sel[i].options.remove();
                        }
                    }
                }
            }
            else //删除自定义的一条数据
            {
                var ThisCustomData=checkboxControl.Get("CustomData");//获取控件的自定义显示数据
                var j = ClickItem - etLength;
                ThisCustomData.splice(j, 1);
                checkboxControl.Set("CustomData", ThisCustomData);
                $(".checkboxDisplayValue1").val("");
                $(".checkboxSelectedValue1").val("");

            }
            ChangePropertyPanelLeft(checkboxControl);
        });


        $(".AddCustomDataBtn").die("click");
        //点击添加按钮 添加自定义数据
        $(".AddCustomDataBtn").live('click', function () {

            var mid = Agi.Edit.workspace.currentControls[0].shell.BasicID;
            if ($(".checkboxDisplayValue2").val() != "" && $(".checkboxSelectedValue2").val() != "") {

                checkboxControl.Set("IsCustom",true);//设置当前控件为用户自定义模式
                var ThisCustomData=checkboxControl.Get("CustomData");//获取控件的自定义显示数据

                if(ThisCustomData){ //判断控件中自定义数据是否为null
                }else{
                    ThisCustomData=[];
                }
                var displayValueLength = $(".checkboxDisplayValue2").val().length;
                if(displayValueLength >= 20)
                {
                    alert("当前显示值输入过长，显示时可能会显示不全！");
                }

                var NewItem={Text:"",Value:""};//需要新增的Item 项(Text 值，Value值)
                NewItem.Text=$(".checkboxDisplayValue2").val();//赋值新增Item Text
                NewItem.Value=$(".checkboxSelectedValue2").val(); //赋值新增Item Value
                $(".checkboxDisplayValue2").val("");
                $(".checkboxSelectedValue2").val("");

                ThisCustomData.push(NewItem);//向控件自定义数据数组中添加新Item 元素

                checkboxControl.Set("CustomData",ThisCustomData);//重新赋值控件的自定义数据(控件会在Agi.Controls.CheckBoxAttributeChange 方法中监听到此属性值更改)
                ChangePropertyPanelLeft(checkboxControl);

            }
            else if  ($(".checkboxDisplayValue2").val() == "" && $(".checkboxSelectedValue2").val() != "")
            {
                alert("请填写显示值！");
            }
            else if($(".checkboxSelectedValue2").val() == "" && $(".checkboxDisplayValue2").val() != "")
            {
                alert("请填写选择值！");
            }
            else if($(".checkboxDisplayValue2").val() == "" && $(".checkboxSelectedValue2").val() == "")
            {
                alert("请填写显示值和选择值！");
            }
            checkboxControl.ReBindEvents();
        });

 //   }




    $("#checkbox-alignment").val(BasicProperty.Alignment);
    $("#checkbox-column-width").val(BasicProperty.ColumnsWidth);
    $("#checkbox-row-height").val(BasicProperty.RowHeight);
    $("#checkbox-topleftfillet").val(BasicProperty.TopLeftFillet);
    $("#checkbox-toprightfillet").val(BasicProperty.TopRightFillet);
    $("#checkbox-bottomleftfillet").val(BasicProperty.BottomLeftFillet);
    $("#checkbox-bottomrightfillet").val(BasicProperty.BottomRightFillet);
    $("#checkboxBorderColor").val(BasicProperty.BorderColor);
    if(BasicProperty.BackgroundColor==""){
        $("#checkbox-backgroudcolor").val("#f9f9f9");
    }else{
        $("#checkbox-backgroudcolor").val(BasicProperty.BackgroundColor);
    }
    if(BasicProperty.SelectedBackgroundColor==""){
        //$("#checkbox-selectedbgdcolor").val("#f9f9f9");
    }else{
        $("#checkbox-selectedbgdcolor").val(BasicProperty.SelectedBackgroundColor);
    }
    if(BasicProperty.CheckBoxColor==""){
        $("#checkbox-color").val("#f9f9f9");
    }else{
        $("#checkbox-color").val(BasicProperty.CheckBoxColor);
    }

    if(BasicProperty.SelectedCheckBoxColor==""){
        $("#checkbox-selectedbtncolor").val("#f9f9f9");
    }else{
        $("#checkbox-selectedbtncolor").val(BasicProperty.SelectedCheckBoxColor);
    }

    //排列方式
    $('#checkbox-alignment').live('change',function(ev){

        BasicProperty.Alignment = $("#checkbox-alignment").val();
        if(BasicProperty.Alignment=="横向"){
            BasicProperty.ColumnsWidth="150";
            $("#checkbox-column-width").val("150");
            $("#"+checkboxControl.shell.ID).find(".Checkboxnavbar").removeClass("Verishow");
        }else{
            //BasicProperty.ColumnsWidth=150px;
            BasicProperty.ColumnsWidth="250";
            $("#checkbox-column-width").val("250");
            $("#"+checkboxControl.shell.ID).find(".Checkboxnavbar").addClass("Verishow");
        }
        checkboxControl.Set('BasicProperty',BasicProperty);
    });
    //列宽
    $("#checkbox-column-width").change(function(){
        BasicProperty.ColumnsWidth = $("#checkbox-column-width").val();
        checkboxControl.Set('BasicProperty',BasicProperty);
    });
    //行高
    $("#checkbox-row-height").change(function(){
        BasicProperty.RowHeight = $("#checkbox-row-height").val();
        checkboxControl.Set('BasicProperty',BasicProperty);
    });
   /* //左上圆角
    $("#checkbox-topleftfillet").change(function(){
        BasicProperty.TopLeftFillet = $("#checkbox-topleftfillet").val();
        checkboxControl.Set('BasicProperty',BasicProperty);
    });
    //右上圆角
    $("#checkbox-toprightfillet").change(function(){
        BasicProperty.TopRightFillet = $("#checkbox-toprightfillet").val();
        checkboxControl.Set('BasicProperty',BasicProperty);
    });
    //左下圆角
    $("#checkbox-bottomleftfillet").change(function(){
        BasicProperty.BottomLeftFillet = $("#checkbox-bottomleftfillet").val();
        checkboxControl.Set('BasicProperty',BasicProperty);
    });
    //右下圆角
    $("#checkbox-bottomrightfillet").change(function(){
        BasicProperty.BottomRightFillet = $("#checkbox-bottomrightfillet").val();
        checkboxControl.Set('BasicProperty',BasicProperty);
    });*/
    //边框颜色
    $("#checkboxBorderColor").spectrum({
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
            $("#checkboxBorderColor").val(color.toHexString());
            BasicProperty.BorderColor = $("#checkboxBorderColor").val();
            checkboxControl.Set('BasicProperty',BasicProperty);
        }
    });
    //背景颜色
    $("#checkbox-backgroudcolor").spectrum({
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
            $("#checkbox-backgroudcolor").val(color.toHexString());
            BasicProperty.BackgroundColor = $("#checkbox-backgroudcolor").val();
            checkboxControl.Set('BasicProperty',BasicProperty);
        }
    });
    //选中项背景颜色
    $("#checkbox-selectedbgdcolor").spectrum({
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
            $("#checkbox-selectedbgdcolor").val(color.toHexString());
            BasicProperty.SelectedBackgroundColor = $("#checkbox-selectedbgdcolor").val();
            checkboxControl.Set('BasicProperty',BasicProperty);
        }
    });
    //按钮颜色
    $("#checkbox-color").spectrum({
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
            $("#checkbox-color").val(color.toHexString());
            BasicProperty.CheckBoxColor = $("#checkbox-color").val();
            checkboxControl.Set('BasicProperty',BasicProperty);
        }
    });
    //选中项按钮颜色
    $("#checkbox-selectedbtncolor").spectrum({
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
            $("#checkbox-selectedbtncolor").val(color.toHexString());
            BasicProperty.SelectedCheckBoxColor = $("#checkbox-selectedbtncolor").val();
            checkboxControl.Set('BasicProperty',BasicProperty);
        }
    });

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
//CheckBox 绑定自定义数据(如果在编辑界面时，显示自定义数据时，需要显示删除选项)
//Agi.Controls.CheckBoxBindDataByCustomData=function(_controlObj,_CustomData){
//    var self = _controlObj;
//
//    var BasicProperty = self.Get("BasicProperty");//获得控件基础对象属性信息(obj)
////    BasicProperty.selectTextField ="Text";
////    BasicProperty.selectValueField ="Value";
//    var $UI = $('#'+ self.shell.ID);
//    var menu = $UI.find('.Checkboxnavbar');
//
//    $(_CustomData).each(function(i,dd){
//        $('<div class="CheckBoxItemDiv"><input type="checkbox" name="item[]" id="itme'+(i+1)+'" value='+dd.Value+' class="CheckBoxItemsSty"/><div class="mydiv"/><label id="labelID">'+dd.Text+'</label></div>').appendTo(menu);
//    });
//
////        var Newitem=null;
////        $(_CustomData).each(function(i,dd){
////            Newitem="<div class='CheckBoxSerieslablesty'>" +
////                "<div class='CheckBoxSeriesCheckd'><input type='checkbox' name='item[]' id='itme"+(i+1)+"' value='"+dd.Value+"' class='CheckBoxItemsSty'/><span class='checkBoxSpan'></span></div>" +
////                "<div class='CheckBoxSeriesname'>"+ dd.Text + "</div>" +//文字
////                "<div class='CheckBoxseriesImgsty' id='remove" + dd.Value + "'></div>" +
////                "<div class='clearfloat'></div></div>";
////            $(Newitem).appendTo(menu);
////        });
//
//
//    self.ReBindEvents();
//    menu.find('li:eq(0)').click();
//    return;
//}
//Agi.Controls.CheckBoxBindEntityData=function(_controlObj,_EntityData,_ColumnName){
//    var self = _controlObj;
////    self.Set("IsCustom",false);//非自定义数据，显示实体EntityData数据
//
//    Agi.Utility.RequestData2(_EntityData,function(d){
//
//        var BasicProperty = self.Get("BasicProperty");
//        if(_ColumnName==null || _ColumnName==""){
//            _ColumnName=d.Columns[0];
//        }
//        //修改列
//
//        BasicProperty.selectTextField = _ColumnName;
//        BasicProperty.selectValueField =_ColumnName;
//
//        var $UI = $('#'+ self.shell.ID);
//        var menu = $UI.find('.Checkboxnavbar');
//        menu.empty();
//        var data = d.Data.length ? d.Data : [];
//        var columns = d.Columns;
//        d.Data = data;
//        d.Columns = d.Columns;
//        var textField =BasicProperty.selectTextField;
//        var valueField =BasicProperty.selectValueField;
//        if(BasicProperty.selectTextField == undefined){
//            BasicProperty.selectTextField = textField
//        }
//        if(BasicProperty.selectValueField == undefined){
//            BasicProperty.selectValueField = valueField;
//        }
//        var Alignment = BasicProperty.Alignment;
//        if(Alignment == "纵向")
//        {
//            $(data).each(function(i,dd){
//                $('<div class="CheckBoxItemDiv "><input type="checkbox" name="item[]" id="itme1" value="'+dd[valueField.trim()]+'" class="CheckBoxItemsSty"/><span class="checkBoxSpan"></span><label id="labelID">'+dd[textField.trim()]+'</label></div>').appendTo(menu);
//            });
//        }
//        else
//        {
//            $(data).each(function(i,dd){
//                $('<div class="CheckBoxItemDivHorizontal "><input type="checkbox" name="item[]" id="itme1" value="'+dd[valueField.trim()]+'" class="CheckBoxItemsSty"/><span class="checkBoxSpan"></span><label id="labelID">'+dd[textField.trim()]+'</label>').appendTo(menu);
//            });
//        }
//
//        self.ReBindEvents();
//        menu.find('li:eq(0)').click();
//    });
//    var _themeName = _controlObj.Get("ThemeName");
//    var CheckBoxStyleValue=Agi.layout.StyleControl.GetStyOptionByControlType(_controlObj.Get("ControlType"),_themeName);
//    Agi.Controls.CheckBox.OptionsAppSty(CheckBoxStyleValue,_controlObj);
//    return;
//}

function ChangePropertyPanelLeft(controlObj)
{

    var BasicProperty = controlObj.Get("BasicProperty");

    var mLeftDiv = $("#managementLeftDiv");
    mLeftDiv.empty();
    var etLength; //实体datasets长度
    var entity = controlObj.Get("Entity");
    if(entity && entity.length)
    {
        var selectTextField = controlObj.Get("selectTextField");
        var selectValueField = controlObj.Get("selectValueField");
        if(selectTextField == null)
        {
            selectTextField = entity[0].Columns[0];
        }
        if(selectValueField == null)
        {
            selectValueField = entity[0].Columns[0];
        }
        var et = entity[0];

        var data = et.Data.length ? et.Data : [];

        var DelItems = controlObj.Get("DelItems");

        if(DelItems)
        {
            $(data).each(function(i,dd){
                var flag = false;
                for(var j=0; j<data.length; j++)
                {
                    if(i == DelItems[j])
                    {
                        flag = true;
                        break;
                    }
                }
                if(flag == false)
                {
//                    $('<div class="mLeftDivItem"><label id="labelID">'+dd[textField.trim()]+'</label><label class="count">'+i+'</label></div>').appendTo(mLeftDiv);
                    $('<div class="mLeftDivItem"><label id="labelID">'+dd[selectTextField]+'</label><label class="count">'+i+'</label></div>').appendTo(mLeftDiv);

                }

            });
        }
        else
        {
            $(data).each(function(i,dd){
                $('<div class="mLeftDivItem"><label id="labelID">'+dd[selectTextField]+'</label><label class="count">'+i+'</label></div>').appendTo(mLeftDiv);
            });
        }
        etLength = entity[0].Data.length;//实体长度
    }
    else
    {
        etLength = 0;
    }

    var CustomData = controlObj.Get("CustomData");
    if(CustomData&&CustomData.length){

//        BasicProperty.selectTextField ="Text";
//        BasicProperty.selectValueField ="Value";
        var mLeftDiv = $("#managementLeftDiv");

        $(CustomData).each(function(i,dd){
            var j = i + etLength;
            $('<div class="mLeftDivItem"><label id="labelID">'+dd.Text+'</label><label class="count">'+j+'</label></div>').appendTo(mLeftDiv);
        });
    }
}