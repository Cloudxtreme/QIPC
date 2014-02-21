/*
 编写人：鲁佳
 描述：参数联动关系配置
 */

//打开参数配置窗口
Namespace.register("Agi.Msg");
/*添加 Agi.Msg命名空间*/
Agi.Msg.OpenParasSettingWindow = function () {
    this.Show = function () {
        tab_click("app_tab1");  //选中第一个
        Para_EntityItemsRect = [];
        $('#SettingModal').css('zIndex', 9999);
        $('#SettingModal').draggable({ cancel:"div.paramBody1" });
        $('#SettingModal').modal({ backdrop:true, keyboard:true, show:true });
        //tab1
        FrameWork_ItemsTemp();  //加载控件参数列表
        FrameWork_GetEntityInfo(); //加载实体信息列表
        //tab2
        FrameWork_ItemsTab2();
        GetRealTimeControl();

        //tab3
        ShareDataFilter.PShareDataFilterLeftList();
        new iScroll('wrapper', { hScrollbar:false, vScrollbar:false });
        new iScroll('wrapper1', { hScrollbar:false, vScrollbar:false });
        new iScroll('wrapper2', { hScrollbar:false, vScrollbar:false });
        new iScroll('wrapper3', { hScrollbar:false, vScrollbar:false });
        new iScroll('wrapper4', { hScrollbar:false, vScrollbar:false });
    }
}

var Para_EntityItemsRect = [];
function FrameWork_ItemsTemp() {
    var str = "";
    var idArray = [];
    for (var i = 0; i < Agi.Msg.PageOutPramats.GetSerialData().length; i++) {
        var id = Agi.Script.CreateControlGUID();
        str += "<dl style='width:100%'>" +
            "<dt class=" + id + " onclick=EntityControlTemplate_Showsubmenu1(this) title=" +
                Agi.Msg.PageOutPramats.GetSerialData()[i].key + ">" +
                Agi.Msg.PageOutPramats.GetSerialData()[i].key +
            "<dd id=" + id + " >" +
            "<ul>";

        for (var j = 0; j < Agi.Msg.PageOutPramats.GetSerialData()[i].value.length; j++) {
            str += "<li id=" + Agi.Msg.PageOutPramats.GetSerialData()[i].key + "." + Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name +
                " class='DargToItemSelected' title='"+Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name+"' style='position: relative;'>" +
                Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name + "</li>";
            idArray.push(Agi.Msg.PageOutPramats.GetSerialData()[i].key + "." + Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name);
        }
        str += "</ul></dd></dl>";
    }
    if (str == "") {
        str = "无参数"
    }
    $("#app_ControlParamDiv").html(str);
    //1.添加拖拽功能
    for (var j = 0; j < idArray.length; j++) {
        new Agi.Msg.Drag(idArray[j], mouseEndcallback, dargToArea, null);
    }
}

//加载实体信息
function FrameWork_GetEntityInfo() {
    var str = "";
    for (var i = 0; i < Agi.Msg.PageOutPramats.GetEntityParas().length; i++) {
        var id = Agi.Script.CreateControlGUID();
        var obj = Agi.Msg.PageOutPramats.GetEntityParas()[i];

        str += "<dl style='width:100%'>" +
            "<dt class=" + id + " title=" + obj.ControlID + " onclick=EntityControlTemplate_Showsubmenu1(this)>" + obj.ControlID +
            "<dd id=" + id + " ><section class='ac-container'>";

        for (var j = 0; j < obj.ParaName.length; j++) {
            var EntityID = obj.ControlID + "_" + obj.ParaName[j].ShowName;   //控件ID_实体.参数    obj.ControlID + "." + obj.ParaName[j].EntityName;
            var paramEntityID = "";
            var controlParamName="";
            var items="";
            //创建参数配置项  根据控件ID与参数名匹配
            for(var z=0;z<Agi.Msg.ParaBindManage.ParasRelation.length;z++){
                controlParamName=Agi.Msg.ParaBindManage.ParasRelation[z].ControlPara+"";
                paramEntityID=Agi.Msg.ParaBindManage.ParasRelation[z].EntityPara+"";
                if(EntityID==paramEntityID)
                {
                    items+=createParamExpression(EntityID,controlParamName);
                }
            }

            //创建参数列表
            str+=createParamList(obj.ControlID, obj.ParaName[j].ShowName,items);
        }
        str += "</section></dd>" +
            "</dl>";
    }
    if (str == "") {
        str = "无参数"
    }
    $("#app_selectedParamDiv").html(str);
    $("#app_selectedParamDiv").height(500);
}

function GetItemsSize() {
    Para_EntityItemsRect = [];
    //计算参数配置界面每个实体 item大小
    for (var i = 0; i < $("#app_selectedParamDiv").find("label").length; i++) {
        var obj = $("#app_selectedParamDiv").find("label")[i];
        var Rect = obj.getBoundingClientRect();
        var temp = new itemsObj(obj, Rect, 1);
        Para_EntityItemsRect.push(temp);
    }

    for (var i = 0; i < $("#app_ControlInuputParamDiv").find("li").length; i++) {
        var obj = $("#app_ControlInuputParamDiv").find("li")[i];
        var Rect = obj.getBoundingClientRect();
        var temp = new itemsObj(obj, Rect, 2);
        Para_EntityItemsRect.push(temp);
    }
}

//实体item集合
function itemsObj(_obj, _rect, _type) {
    this.obj = _obj;
    this.Rect = _rect;
    this.type = _type;
}

//拖拽Move回调 拖拽移动同时计算鼠标所在区域
var SelectAreaObj = null;  //获取鼠标释放时停留的区域对象
function dargToArea() {
    //判断是移动设备上还是PC机
    var SupportsTouches = ("createTouch" in document);
    var HammerEndX, HammerEndY;
    if (SupportsTouches) {
        HammerEndX = dragE.changedTouches[0].clientX;
        HammerEndY = dragE.changedTouches[0].clientY;
    } else {
        HammerEndX = dragE.clientX;
        HammerEndY = dragE.clientY;
    }
    $.each(Para_EntityItemsRect, function (i, LayoutItem) {
        var LayoutItemRect = LayoutItem.Rect;
        if (HammerEndX >= (LayoutItemRect.left) && HammerEndY >= (LayoutItemRect.top)
            && HammerEndX <= (LayoutItemRect.left + LayoutItemRect.width) && HammerEndY <= (LayoutItemRect.top + LayoutItemRect.height)
            && LayoutItem.type == 1
            ) {
            dragEndDivId = LayoutItem.obj.id; //获取到拖拽到的div的id
            SelectAreaObj = LayoutItem.obj;
            LayoutItem.obj.className = "DargToItemSelected";
        }
        else {
            LayoutItem.obj.className = "DargToItem";
        }
    });
}

//拖拽MouseEnd,touchEnd回调
function mouseEndcallback(e, obj) {
    if (SelectAreaObj != null) {
        var EntityID = SelectAreaObj.id + "_" +  SelectAreaObj.innerText;
        var article= $(SelectAreaObj.parentNode).find("article");
        var item=$(article).find("[name='"+obj.id+"']");
        if(item.length!=0){
            AgiCommonDialogBox.Alert("参数已存在!", null);
            return;
        }
        Agi.Msg.ParaBindManage.AddItem(obj.id, EntityID); //加入到关系维护类中

        article.append(createParamExpression(EntityID, obj.id));
        //如果参数过多这里需要重新计算高度
        //window.Modernizr.load();
        //更新界面
//        SelectAreaObj.innerText = Agi.Msg.ParaBindManage.GetItemObj(SelectAreaObj.id).RelationExpression;
//        SelectAreaObj.title = SelectAreaObj.innerText; //2013.01.25 张鹏 添加

        //region 20131216 08：51 markeluo 新增，支持在参数联动配置面板中移除已配置关联关系
//        $(SelectAreaObj).find("a").remove();
//        $(SelectAreaObj).append("<a class='parasSetUIItemDelSty' onclick='ParsItemRemove(this)' href='#'></a>");
        //endregion
    }
}

var itemIndex=1;
function createParamList(controlId, paramName,items)
{
    var item= "<div><input id='ac-"+itemIndex+"' name='accordion-"+itemIndex+"' type='checkbox'><label id='"+controlId+"' for='ac-"+itemIndex+"'>"+paramName+"</label><article class='ac-small'>"+items+"</article></div>";
    itemIndex++;
    return item;
}

function createParamExpression(EntityID, ItemShowName){
   return "<p id=" + EntityID + " name='"+ItemShowName+"' title=" + ItemShowName + ">" + ItemShowName + "<a class='parasSetUIItemDelSty' onclick='ParsItemRemove(this)' href='#'></a></p>"
}
//---------------------------------------------------------------------------------------------------------
/* tab2 */
function FrameWork_ItemsTab2() {
    var str = "";
    var idArray = [];
    for (var i = 0; i < Agi.Msg.PageOutPramats.GetSerialData().length; i++) {
        var id = Agi.Script.CreateControlGUID();
        str += "<dl style='width:100%'>" +
            "<dt class=" + id + " title=" + Agi.Msg.PageOutPramats.GetSerialData()[i].key + " onclick=EntityControlTemplate_Showsubmenu1(this)>" + Agi.Msg.PageOutPramats.GetSerialData()[i].key +
            "<dd id=" + id + " >" +
            "<ul>";

        for (var j = 0; j < Agi.Msg.PageOutPramats.GetSerialData()[i].value.length; j++) {
            var id = Agi.Msg.PageOutPramats.GetSerialData()[i].key + "." + Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name + "_";
            str += "<li id=" + id + " title=" + Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name + " style='position: relative;'>" + Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name + "</li>";
            idArray.push(id);
        }
        str += "</ul></dd></dl>";
    }
    if (str == "") {
        str = "无参数"
    }
    $("#app_ControlOutputParamDiv").html(str);
    //1.添加拖拽功能
    for (var j = 0; j < idArray.length; j++) {
        new Agi.Msg.Drag(idArray[j], mouseEndcallbackTab2, dargToArea2, null);
    }
}

//获取实时控件集合
function GetRealTimeControl() {
    var str = "";
    var id = Agi.Script.CreateControlGUID();
    var obj = Agi.Msg.PageOutPramats.GetControls();
    str += "<dl style='width:100%'>" +
        "<dt class=" + id + " title='实时控件列表' onclick=EntityControlTemplate_Showsubmenu1(this)>实时控件列表" +
        "<dd id=" + id + " >" +
        "<ul>";

    for (var j = 0; j < obj.length; j++) {
        var ItemShowName = null;
        ItemShowName = obj[j];
        if (Agi.Msg.RealTimeParaBindManage.IsExistRelation(ItemShowName)) {  //存在关系绑定
            ItemShowName = Agi.Msg.RealTimeParaBindManage.GetItemObj(ItemShowName).RelationExpression;
            //str += "<li id=" + obj[j] + " title="+ItemShowName+">" + ItemShowName + "</li>";
            //region 20131216 08：51 markeluo 修改，支持在参数联动配置面板中移除已配置关联关系
            str += "<li id=" + obj[j] + " title="+ItemShowName+" style='position: relative;'>" + ItemShowName + "<a  class='parasSetUIItemDelSty' onclick='RealTimeParsItemRemove(this)' href='#'></a></li>";
            //endregion
        }else{
            str += "<li id=" + obj[j] + " title="+ItemShowName+" style='position: relative;'>" + ItemShowName + "</li>";
        }
    }
    str += "</ul></dd></dl>";
    if (obj.length < 1) {
        str = "无参数"
    }
    $("#app_ControlInuputParamDiv").html(str);
}

/* tab2 */
//拖拽Move回调 拖拽移动同时计算鼠标所在区域
var SelectAreaObj1 = null;  //获取鼠标释放时停留的区域对象
function dargToArea2() {
    //判断是移动设备上还是PC机
    var SupportsTouches = ("createTouch" in document);
    var HammerEndX, HammerEndY;
    if (SupportsTouches) {
        HammerEndX = dragE.changedTouches[0].clientX;
        HammerEndY = dragE.changedTouches[0].clientY;
    } else {
        HammerEndX = dragE.clientX;
        HammerEndY = dragE.clientY;
    }
    $.each(Para_EntityItemsRect, function (i, LayoutItem) {
        var LayoutItemRect = LayoutItem.Rect;
        if (HammerEndX >= (LayoutItemRect.left) && HammerEndY >= (LayoutItemRect.top)
            && HammerEndX <= (LayoutItemRect.left + LayoutItemRect.width) && HammerEndY <= (LayoutItemRect.top + LayoutItemRect.height)
            && LayoutItem.type == 2
            ) {
            dragEndDivId = LayoutItem.obj.id; //获取到拖拽到的div的id
            SelectAreaObj1 = LayoutItem.obj;
            LayoutItem.obj.className = "DargToItemSelected";
        }
        else {
            LayoutItem.obj.className = "DargToItem";
        }
    });
}

function mouseEndcallbackTab2(e, obj) {
    if (SelectAreaObj1 != null) {
        Agi.Msg.RealTimeParaBindManage.AddItem(obj.id.substring(0, obj.id.length - 1), SelectAreaObj1.id); //加入到关系维护类中
        //更新界面
        SelectAreaObj1.innerText = Agi.Msg.RealTimeParaBindManage.GetItemObj(SelectAreaObj1.id).RelationExpression;

        //region 20131216 08：51 markeluo 新增，支持在参数联动配置面板中移除已配置关联关系
        $(SelectAreaObj1).find("a").remove();
        $(SelectAreaObj1).append("<a class='parasSetUIItemDelSty' onclick='RealTimeParsItemRemove(this)' href='#'></a>");
        //endregion
    }
}
//---------------------------------------------------------------------------------------------------------

/* 选项卡 */
function EntityControlTemplate_Showsubmenu1(sid) {
    var whichEl = $("#" + sid.className);
    whichEl.toggle();
}

/* tab选项卡 */
function tab_click(panelID) {
    if (panelID == "app_tab1") {
        $("#app_tab1").show();
        $("#app_tab2").hide();
        $("#app_tab3").hide();
        $('#para_tab1').attr('class', 'para_tabClassSelect');
        $('#para_tab2').attr('class', 'para_tabClass');
        $('#para_tab3').attr('class', 'para_tabClass');
    }
    else if (panelID == "app_tab2") {
        $("#app_tab1").hide();
        $("#app_tab3").hide();
        $("#app_tab2").show();
        $('#para_tab1').attr('class', 'para_tabClass');
        $('#para_tab3').attr('class', 'para_tabClass');
        $('#para_tab2').attr('class', 'para_tabClassSelect');
    }
    else if (panelID == "app_tab3") {
        $("#app_tab1").hide();
        $("#app_tab2").hide();
        $("#app_tab3").show();
        $('#para_tab1').attr('class', 'para_tabClass');
        $('#para_tab2').attr('class', 'para_tabClass');
        $('#para_tab3').attr('class', 'para_tabClassSelect');
    }
    new iScroll('wrapper', { hScrollbar: false, vScrollbar: false });
    new iScroll('wrapper1', { hScrollbar: false, vScrollbar: false });
    new iScroll('wrapper2', { hScrollbar: false, vScrollbar: false });
    new iScroll('wrapper3', { hScrollbar: false, vScrollbar: false });
    new iScroll('wrapper4', { hScrollbar: false, vScrollbar: false });
}

//region 20131213 15:41 markeluo 添加移除参数联动配置关系的方法
//普通DataSet参数联动关系
function ParsItemRemove(ev){
    if(ev!=null && ev.parentNode!=null){
        var ThisItemElement=ev.parentNode;
        //当前需要删除的元素信息
        var ThisItem={
            ID:ThisItemElement.id,
            ControlPars:ThisItemElement.title.substr((ThisItemElement.title.indexOf('.')+1)),
            EntityPars:ThisItemElement.id.substr((ThisItemElement.id.indexOf('_')+1)),
            RelationExpression:ThisItemElement.id+"="+ThisItemElement.title
        }
        //Agi.Msg.ParaBindManage.RemoveItem(ThisItem.ControlPars,ThisItem.ID); //加入到关系维护类中
        Agi.Msg.ParaBindManage.DeleteItem(ThisItemElement.title,ThisItemElement.id);
        $(ThisItemElement).remove();
//        ThisItemElement.innerText =ThisItem.EntityPars;
//        ThisItemElement.title=ThisItem.EntityPars
    }
    return false;
}
//实时数据参数联动关系
function RealTimeParsItemRemove(ev){
    if(ev!=null && ev.parentNode!=null){
        var ThisItemElement=ev.parentNode;
        //当前需要删除的元素信息
        var ThisItem={
            ID:ThisItemElement.id,
            ControlPars:ThisItemElement.title.substr((ThisItemElement.title.indexOf('=')+1)),
            RealtimePars:ThisItemElement.id,
            RelationExpression:ThisItemElement.title
        }
        Agi.Msg.RealTimeParaBindManage.RemoveItem(ThisItem.ControlPars,ThisItem.ID); //加入到关系维护类中

        ThisItemElement.innerText =ThisItem.RealtimePars;
        ThisItemElement.title=ThisItem.RealtimePars
    }
    return false;
}
//endregion