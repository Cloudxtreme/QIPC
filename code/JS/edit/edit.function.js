//对象
var edit = Agi.Edit;
var workspace = edit.workspace;
//初始化
edit.Init = function (editDiv) {
    workspace.editDiv = editDiv;
    //
    edit.getControlList();
}
//新建
edit.NewPage = function () {

    AgiCommonDialogBox.Confirm("新建页面？", null, function (flag) {
        //20130123 倪飘 解决编辑页面中点击标题栏的新建页面按钮并点击取消，再点击保存，弹出的提示框中会变成"新建页面1"问题
        if (flag) {
        IsNewSPCPage=true;
		workspace.controlList.array = [];
            try {
                Agi.Controls.BasicPropertyPanel.HidePanel();
            } catch (e) {
            }
            workspace.Restore();
            $(workspace.editDiv).slideToggle(300);
            $(workspace.editDiv).show(600);

            //清空共享数据源相关内容
            ShareDataOperation.LeaveClear();
        
        $("#InputPageName").val("新建页面1");
        $("#InputDescription").val("");
        isEdite = false;
        $("#BottomRightCenterContentDiv").css("background-image", "");////由编辑页面点击新建时将背景图片清空，还原网格
        $("#BottomRightCenterContentDiv").css("background-position", "");
        $("#BottomRightCenterContentDiv").css("background-repeat", "");
        $("#BottomRightCenterContentDiv").css("background-size", "");
        //zsj 修复bug ZHZS-561
        $("#BottomRightCenterContentDiv").data('colorValue',null);
    }
    });
   
}
var pageName = undefined;
var isEdite = false;//页面是否为编辑页面，false为新建，true为编辑
edit.ChangeEdit = function () {
    isEdite = false;
    $("#InputDescription").val("");
    $("#InputPageName").val("新建页面1");
}
//保存
edit.SavePage = function (callBack) {
    /*  $("#isCoverVersion").removeClass("isCoverVersionBlock");
    $("#isCoverVersion").addClass("isCoverVersionNone");
    if(isEdite){
    $("#isCoverVersion").removeClass("isCoverVersionNone");
    $("#isCoverVersion").addClass("isCoverVersionBlock");
    VSGetPudversions ();//已发布的所有页面版本列表
    }
    $('#ShowVersioninfomodal').show();
    $('#ShowVersioninfomodal').draggable({
    handle: ".modal-header"
    });
    $("#ShowVersioninfomodal").modal({ backdrop: false, keyboard: false, show: true });*/
    //var description = $("#InputDescription").val();//描述
    //$("#InputPageName").val(workspace.pageName);//获得页面名称
    /*  $("#SelectVersionBtn").live('click',function(){
    $('#ShowVersioninfomodal').hide();*/
    pageName = $("#InputPageName").val();
    workspace.pageName = pageName;
    var OldPageName=$("#InputPageName").attr("PageName");
    if(OldPageName!=null && OldPageName!=""){
        workspace.pageName = OldPageName;
    }
    /* if(isEdite){
    workspace.pageName=pageName
    }*/
    if (!pageName) {
        return false;
    }
    // alert(pageName+"            "+isEdite);
    var description = $("#InputDescription").val(); //总结、说明
    var CreatePageAuth=$("#CreatePageAuth").val();//创建人
    var CreatePageGoal=$("#CreatePageGoal").val();//创建目的
    var isCreateNew = true;
    var versions = "";
    var isSaveAs=false;
    var PageDataSetsArray=[];//20130628 markeluo 添加，支持删除提示功能(页面使用到的DataSets数组)
    if (isEdite) {//编辑
        var rsionSelected = $("#VersionSelect").val(); // $("#VersionSelect").find("option:selected").text;
        if (rsionSelected == "") { //创建新版本
            isCreateNew = true;
            versions = "";
        } else if(rsionSelected==="saveas"){
            isCreateNew = true;
            versions = "";
            isSaveAs=true;
        }
        else{
            isCreateNew = false; //覆盖版本
            versions = rsionSelected;
        }
    }
    //       alert("是否创建新版本"+isCreateNew+"版本号"+versions);
    //页面组态保存，JSON标准化
    var PageControlOjb = {
        Config: {
            PageConfig: null,
            ControlList: null,
            ControlCount: Agi.Edit.workspace.controlList.array.length//由于加入了容器控件,须要记住控件个数
        }
    }
    //    var xml = new Array();
    //    xml.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
    //    xml.push("<Config>")
    //    xml.push(workspace.GetConfig());
    //    //
    //    for (var i = 0; i < workspace.controlList.size(); i++) {
    //        xml.push(workspace.controlList.get(i).GetConfig());
    //    }
    //    xml.push("</Config>")
    //    var xmlString = xml.join("\r\n");
    PageControlOjb.Config.PageConfig = workspace.GetConfig();
    PageControlOjb.Config.ControlList = [];
    var ThisControlEntity=[];
    for (var i = 0; i < workspace.controlList.size() ; i++) {
        var control = workspace.controlList.get(i);
        //PageControlOjb.Config.ControlList.push(workspace.controlList.get(i).GetConfig());
        /*为选项卡添加属性tabsTabid*/
        var oControlConfig = control.GetConfig();
        if(control.parentId){
            continue;
        }
        oControlConfig.tabsTabid = control.Get("ProPerty").tabsTabid;
        /*201212171710 markeluo 判断控件保存的配置信息中是否存在Entity 数组，如果存在则清空其Data start*/
        ThisControlEntity=control.Get("Entity");
        if (ThisControlEntity != null && ThisControlEntity.length > 0) {
            for(var eindex=0;eindex<ThisControlEntity.length;eindex++){
                PageDataSetsArray.push(ThisControlEntity[eindex].Key);
            }
            oControlConfig.Entity = Agi.Controls.ClearEntityData(ThisControlEntity); //清空EntityData
        }
        /*201212171710 markeluo 判断控件保存的配置信息中是否存在Entity 数组，如果存在则清空其Data end*/

        //保存脚本
        oControlConfig.script = control.getScriptCode();
        //保存层级
        var index = control.Get('HTMLElement').style.zIndex;
        if(isNaN(index) || parseInt(index) <=0){
            index = 1;
        }
        oControlConfig.zIndex = index;
        PageControlOjb.Config.ControlList.push(oControlConfig);
    }
    //
    var jsonData = {
        url: "",
        path: "",
        filename: pageName,
        ParentID: edit.EditPageParentID,
        name: pageName,
        data: PageControlOjb.Config,
        isCreateNew: isCreateNew,
        versions: versions,
        description: description,
        isSaveAS:isSaveAs,
        dataSets:PageDataSetsArray,  //20130628 markeluo 添加，支持删除提示功能(页面使用到的DataSets数组)
        "VCreateUser":CreatePageAuth,//创建人
        "VCreateAim":CreatePageGoal,//创建目录
        "VSummary":description,//经验总结
        "VIsSPCPage":"false"
    };

    edit.EditPageParentID = 0;
    /* alert(workspace.pageName);
    if(isEdite){
    var jsonData = {
    url:"",
    path:"",
    filename:workspace.pageName.substring(0,workspace.pageName.lastIndexOf("/")),
    ParentID:"0",
    name: workspace.pageName.substring(workspace.pageName.lastIndexOf("/")+1,workspace.pageName.length),
    data:PageControlOjb.Config,
    isCreateNew:isCreateNew,
    versions:versions,
    description:description
    };
    }*/
    //region 20130916 14:44 markeluo 添加对SPC页面的支持
    var SavePageMothodName="VSFileSave";
    if(IsNewSPCPage){
        SavePageMothodName="SPC_VSFileSave";
        jsonData.VIsSPCPage="true";
    }
    //endregion
    var jsonString = JSON.stringify(jsonData);

    Agi.DAL.ReadData(
        {
            "MethodName":SavePageMothodName,//20130916 14:44 添加对SPC页面的支持
            "Paras": jsonString,
            "CallBackFunction": function (result) {
                AgiCommonDialogBox.Alert(result.message, null);
                if(callBack){
                    callBack();
                }
                //alert(result.message);
                if (result.result) {
                    boolIsSave = true;
                    isEdite = true;
                    menuManagement.loadPages(); //重新加载页面列表
                }
            }
        });
    /*  });
    $("#CancelVersionBtn").live('click',function(){//点击取消
    $('#ShowVersioninfomodal').hide();
    return;
    });*/
}
edit.ViewPage = function () {
    var pageName = "TemporaryPage";
    var PageControlOjb = {
        Config: {
            PageConfig: null,
            ControlList: null,
            ControlCount: Agi.Edit.workspace.controlList.array.length//由于加入了容器控件,须要记住控件个数
        }
    }
    PageControlOjb.Config.PageConfig = workspace.GetConfig();
    PageControlOjb.Config.ControlList = [];
    for (var i = 0; i < workspace.controlList.size() ; i++) {
        var control = workspace.controlList.get(i);
        if(control.parentId){
            continue;
        }
        /*为选项卡添加属性tabsTabid*/
        var oControlConfig = control.GetConfig();
        oControlConfig.tabsTabid = control.Get("ProPerty").tabsTabid;
        /*201212171710 markeluo 判断控件保存的配置信息中是否存在Entity 数组，如果存在则清空其Data start*/
        if (oControlConfig.Entity != null && oControlConfig.Entity.length > 0) {
            oControlConfig.Entity = Agi.Controls.ClearEntityData(oControlConfig.Entity); //清空EntityData
        }
        /*201212171710 markeluo 判断控件保存的配置信息中是否存在Entity 数组，如果存在则清空其Data end*/
        //脚本
        oControlConfig.script = control.getScriptCode();
        PageControlOjb.Config.ControlList.push(oControlConfig);
    }
    //
    var jsonData = {
        url: '',
        path: '',
        filename: pageName,
        ParentID: '',
        name: pageName,
        data: PageControlOjb.Config,
        isCreateNew: 'true',
        versions: '',
        description: ''
    };
    var jsonString = JSON.stringify(jsonData);
    Agi.DAL.ReadData(
        {
            "MethodName": workspace.serviceSave,
            "Paras": jsonString,
            "CallBackFunction": function (result) {
                if (result.result == "true") {
                    //region 20130916 14:44 markeluo 添加对SPC页面的支持
                    var ViewAddress=Agi.ViewServiceAddress;
                    if(IsNewSPCPage){
                        ViewAddress=Agi.SPCViewServiceAddress;
                    }
                    window.open(ViewAddress + pageName + "&isView=true");
                    //endregion
                }
            }
        });
}
//打开
edit.EditPageParentID = 0;
edit.OpenPage = function (pageName, id, _parentID) {
    edit.EditPageParentID = _parentID;
    isEdite = true;
    var jsonData = { "url": pageName, "ID": id };
    var jsonString = JSON.stringify(jsonData);
    // alert(pageName);
    //
    Agi.DAL.ReadData(
        {
            "MethodName": workspace.serviceOpen,
            "Paras": jsonString,
            "CallBackFunction": function (result) {
                //  alert(result.result);
                if (result.result) {
                    workspace.Restore();
                    workspace.pageName = pageName;
                    // alert(workspace.pageName);
                    result.data.PageConfig = JSON.parse(result.data.PageConfig);
                    workspace.SetConfig(result.data.PageConfig);
                    //解析绑定参数
                    try {
                        if (result.data.PageConfig.IsExistRealTime) {
                            //                            Agi.Msg.PointsManageInfo.loadState = true;
                            //                            Agi.Msg.WebSocketManage.ConnOpen();  //打开socket连接  2012-09-17
                            //给在线程中处理的方法进行参数传递，修改人：刘文川，2012-09-20
                            Agi.Msg.PointsManageInfo.SetLoadState(true);
                            Agi.Msg.PointsManageInfo.ConnOpen();
                            Agi.Controls.IsOpenControl = true;
                        }
                    } catch (e) { //异常处理是为了兼容原来已配置的页面
                    }
                    Agi.Msg.ParaBindManage.StringToObj(result.data.PageConfig.ParaRelationalExpression); //add by lujia
                    Agi.Msg.RealTimeParaBindManage.StringToObj(result.data.PageConfig.ParaRealTimelExpression);
                    //共享数据源相关---np
                    Agi.Msg.ShareDataRealTimeBindPara.GetShareStringToArray(result.data.PageConfig.ShareDatasource);
                    if (result.data.PageConfig.ShareDataSourceAndControl != undefined) {
                        Agi.Msg.ShareDataRelation.StringToObj(result.data.PageConfig.ShareDataSourceAndControl);
                    }
                    if (result.data.PageConfig.ShareDataFilterRule != undefined) {
                        Agi.Msg.ShareDataFilterRelation.GetShareStringToArray(result.data.PageConfig.ShareDataFilterRule);
                    }
                    if (result.data.PageConfig.ButtonBindControlsRelation != undefined) {
                        Agi.Msg.ButtonBindControls.GetShareStringToArray(result.data.PageConfig.ButtonBindControlsRelation);
                    }
                    Agi.Msg.PageLoadManage.Set("UrlParas", result.data.PageConfig.UrlParas);
                    //实例化控件
                    if (result.data.ControlList) {
                        var controls = result.data.ControlList.length ? result.data.ControlList : [result.data.ControlList];
                        Agi.Msg.PageLoadManage.Set("PageControlCount", controls.length); //add by lj
                        if(result.data.ControlCount !== undefined){//由于加入了容器控件,控件个数要换个方式取
                            Agi.Msg.PageLoadManage.Set("PageControlCount", result.data.ControlCount);
                        }
                        Agi.Msg.PageLoadManage.Set("PageControlLoadindex", 0);
                        if (controls.length) {
//                            debugger;
//                            var controlCount = controls.length;
//                            for(var i = 0; i < controlCount; i++){
//                                Agi.Edit.todo.CreateNewControl(controls[i]);
//                            }
                            RecursiveConstructControl(controls);
                        }
                    }
                }
            }
        });
    function RecursiveConstructControl(controls){
        var pControls = controls.sort(function(c){ return c.parentId; });
        while(pControls.length){
            var pConf = pControls.shift();
            Agi.Edit.todo.CreateNewControl(pConf,pConf.parentId);
            if(pConf.childControlConfigs){
                RecursiveConstructControl(pConf.childControlConfigs);
            }
        }
    }
    //    var webservice = workspace.baseServer + workspace.serviceOpen;
    //    $.ajax({
    //        url:webservice,
    //        type:"POST",
    //        dataType:'jsonp',
    //        data:{ "jsonData":jsonString },
    //        success:function (data, textStatus) {
    //            // data.PageCentent.Config.PageConfig
    //            workspace.Restore();
    //            workspace.SetConfig(data.PageCentent.Config.PageConfig);
    //            //解析绑定参数
    //            Agi.Msg.ParaBindManage.StringToObj(data.PageCentent.Config.PageConfig.ParaRelationalExpression); //add by lujia
    //
    //            //实例化控件
    //            var controls = data.PageCentent.Config.Control.length? data.PageCentent.Config.Control:[data.PageCentent.Config.Control];
    //            if(controls.length){
    //                $(controls).each(function(i,conConfig){
    //                    Agi.Edit.todo.CreateNewControl(conConfig);
    //                });
    //            }
    //        },
    //        error:function (XMLHttpRequest, textStatus, errorThrown) {
    //            alert("function:\n  Agi.Edit.OpenPage\r\n" + textStatus + ":\n  " + errorThrown);
    //        }
    //    });
};
//加载控件库
edit.getControlList = function () {
    //gyh
    menuManagement.loadControls($('#controlsListContaner'), workspace);
    return;
    //
    var xml = $.get("xml/ControlConfig.xml", function (data) {
        //alert(data);
        var html4Group = $("<ul></ul>");
        $("#ShowListDiv").append(html4Group); //gyh
        var groups = $(data).find("Group");
        for (var i = 0; i < groups.length; i++) {
            //
            //html4Group.append($("<li>" + $(groups[i]).attr("Name") + "</li>"));
            var group = $("<li>" + $(groups[i]).attr("Name") + "</li>");
            group.appendTo(html4Group); //gyh
            //
            var controls = $(groups[i]).find("Control")
            var html4Controls = $("<ul></ul>");
            html4Controls.appendTo(group); //gyh
            for (var j = 0; j < controls.length; j++) {
                html4Controls.append("<li id=\"li" + $(controls[j]).attr("ControlType") + "\" ControlType=\"" + $(controls[j]).attr("ControlType") + "\" IcoURL=\"" + $(controls[j]).attr("IcoURL") + "\" Initialize=\"" + $(controls[j]).attr("Initialize") + "\">" + $(controls[j]).attr("ControlName") + "</li>");
                var files = $(controls[j]).find("File");
                var ControlLibs = [];
                $.each(files, function (i, item) {
                    ControlLibs.push($(item).attr("Path"));
                })
                workspace.ControlsLibs.push({ "controlType": $(controls[j]).attr("ControlType"), "files": ControlLibs });
                //
                var targts = layoutManagement.property.type == 1 ? 'BottomRightCenterContentDiv' : layoutManagement.getCells();
                //为每个左边的控件添加拖动处理
                var dragItem = new Agi.DragDrop.SimpleDragDrop({
                    dragObject: "li" + $(controls[j]).attr("ControlType"),
                    targetObject: targts, //目标为中间的画布
                    //拖拽完成回调
                    dragEndCallBack: function (d) {
                        //d.target :鼠标释放时落在哪一个元素上
                        //d.position :鼠标释放时 拖动对象副本的位置
                        //d.object     //当前拖动对象
                        var ContentDivObj = null;
                        var ThisDragControlType = d.object.attr("controlType");
                        /*实际应该从拖拽元素的自定义属性ControlType中获取*/
                        var ThissDragControlInitFun = d.object.attr("initialize");
                        /*控件初始化方法*/
                        if (layoutManagement.property.type == 1) {
                            ContentDivObj = $('#BottomRightCenterContentDiv');
                            /*画布对象*/
                            var thisleft = parseInt(d.position.left.replace("px", "")) - ContentDivObj.offset().left;
                            var thistop = parseInt(d.position.top.replace("px", "")) - ContentDivObj.offset().top;
                            //InitControl(ContentDivObj, { Left: thisleft, Top: thistop }, ThisDragControlType); //初始化生成控件
                            InitControlToCanvas(ContentDivObj, { Left: thisleft, Top: thistop }, Agi.Edit.workspace.GetControlsLibs(ThisDragControlType), ThissDragControlInitFun);
                        } else if (layoutManagement.property.type == 2) {
                            ContentDivObj = $(d.target);
                            //InitControl(ContentDivObj, null, ThisDragControlType); //初始化生成控件
                            InitControlToCanvas(ContentDivObj, null, Agi.Edit.workspace.GetControlsLibs(ThisDragControlType), ThissDragControlInitFun);
                        }
                        ThisDragControlType = thisleft = thistop = null;
                        /*清空不需要对象，释放内存*/
                    },
                    //正在拖拽的回调
                    draggingCallBack: function () {
                    },
                    //鼠标释放 ,不管拖拽是否成功
                    mouseUpCallBack: function () {
                    }
                });
                dragControlItems.push(dragItem);
            }
            group.append(html4Controls);
            html4Group.append(group);
        }
        //alert(html4Group.html());
    });
    //
    //        var webservice = workspace.baseServer + serviceGetControlList;
    //        $.ajax({
    //            url: webservice,
    //            type: "POST",
    //            success: function (data, textStatus) {
    //                //
    //                //var jData = $.parseJSON(data);
    //                //var jData = JSON.parse(data);
    //                var jData = eval(data);
    //                //alert(jData.result);
    //                var controlGroup = jData.ControlConfig.Controls.Controls.Group;
    //                $.each(controlGroup, function (i, item) {
    //                    var html4Group = $("<ul></ul>");
    //                    html4Group.append($("<li>" + item.Name + "</li>"));
    //                    alert(html4Group);
    //                });
    //            },
    //            error: function (XMLHttpRequest, textStatus, errorThrown) {
    //                alert("function:\n  Agi.Edit.getControlList\r\n" + textStatus + ":\n  " + errorThrown);
    //            }
    //        });
}
//加载实时数据源
edit.getDataSource = function () {
    Agi.DCManager.GetRealTimeDC(function (result) {
        if (result.result == "true") {
        }
    });
}
//撤销重做
/*var oldValue = "", newValue = "";
 var stack = new Undo.Stack(),*/
/*EditCommand = Undo.Command.extend({
 constructor:function (undoFunction, redoFunction, oldValue, newValue) {
 this.undoFunction = undoFunction;
 this.redoFunction = redoFunction;
 this.oldValue = oldValue;
 this.newValue = newValue;
 },
 execute:function () {
 },
 undo:function () {
 //html还原
 if (this.oldValue) {
 $(workspace.editDiv).html(this.oldValue);
 $(".ui-resizable-handle").detach()
 }
 //逻辑还原
 if (this.undoFunction) {
 this.undoFunction();
 }
 },
 redo:function () {
 //html还原
 if (this.newValue) {
 $(workspace.editDiv).html(this.newValue);
 $(".ui-resizable-handle").detach()
 }
 //逻辑还原
 if (this.redoFunction) {
 this.redoFunction();
 }
 }
 });
 Agi.Edit.unDo = function () {
 stack.canUndo() && stack.undo();
 };
 Agi.Edit.reDo = function () {
 stack.canRedo() && stack.redo();
 };*/
//删除
//region 用来记录操作
var delUndo = {};
//endregion
edit.DeleteControls = function () {
    //region 操作前html
    oldValue = $(workspace.editDiv).html();
    //endregion
    //region 执行操作并记录
    var delControls = [];
    for (var index = 0; index < workspace.currentControls.length; index++) {
        var control = workspace.currentControls[index];
        if (control.Get('ControlType') === 'Container' && control.childControls.length) {//如果当前是容器控件,并有子控件时,询问一下
            AgiCommonDialogBox.Confirm("您正在删除一个容器控件,是否删除当前控件下的子控件?", null, function (flag) {
                if (flag) {
                    //debugger;
                    edit.DeleteControls2(edit.beDeleteControls);
                }
                delete edit.beDeleteControls;
            });
            edit.FindChildByContainer(control, delControls);

        }
        else {
            //20130522 倪飘 解决bug，在有查询按钮控制的参数联动中，删除查询按钮以后，无法再进行参数联动；
            if (control.Get('ControlType') === "InquireButton") {
                Agi.Msg.ButtonBindControls.DeleteSingelObj(control.shell.BasicID);
            }
            delControls.push(control);
            edit.DeleteControls2(delControls);
        }
    } //end for
    edit.beDeleteControls = delControls;
};
//删除控件
edit.DeleteControls2 = function(delControls){
    for (var i = 0; i < delControls.length; i++) {
        var control = delControls[i];
//        delUndo.parameters = {};
//        delUndo.parameters[control.Get("ProPerty").ID] = Agi.Edit.workspace.getParameter(control.Get("ProPerty").ID);
//        delUndo.controls = [];
//        delUndo.controls[delUndo.controls.length] = control;
        //$(control.Get("HTMLElement")).remove();
        $("#" + $(control.Get("HTMLElement")).attr("id")).remove();

        Agi.Edit.workspace.removeParameter(control.Get("ProPerty").ID);
//        Agi.Edit.workspace.controlList.remove(control);
        Agi.Controls.ControlDestoryByList(control);//所有控件列表，当前选中列表中移除当前控件
        var controlPar = Agi.Msg.PageOutPramats.RemoveItems(control.Get("ProPerty").ID);
        //debugger;
        if(control.Get('ControlType') === 'Container'){
            control.childControls = [];
        }
        if(control.parentId){
            var pCon = Agi.Controls.FindControlByPanel(control.parentId);
            pCon.RemoveChildControl(control.Get('ProPerty').ID);
        }

//        delUndo.controlPar = controlPar;
        //删除界面上所有控件后属性面板隐藏
        if (Agi.Edit.workspace.controlList.size() == 0) {
            $("#BasicPropertyPanel").hide()
        }
        //20130114 倪飘 解决新建页面组态页面中创建共享数据源，在组态环境中拖入控件并将创建的共享数据拖入到控件中，删除该控件，打开控制面板中共享数据源过滤，控件名称依旧存在问题
        //删除控件，如果是带有共享数据源的控件，则删除共享数据源关系
        Agi.Msg.ShareDataRelation.DeleteItem(control.Get("ProPerty").ID);

        //20130220 14:57 markeluo 性能优化，缓存释放 删除控件，将控件对象从内存中释放
        if(control.Destory){
            control.Destory();
        }
        control=null;
        /* 性能优化，缓存释放 end*/
        //i=-1;
    }//end for
    workspace.currentControls.length = 0;//清空当前选中控件数组

    //删除界面上所有控件后属性面板隐藏
    if (Agi.Edit.workspace.controlList.toArray().length == 0) {
        $("#BasicPropertyPanel").hide()
    }else{
        var ThisControl = Agi.Edit.workspace.controlList.get(Agi.Edit.workspace.controlList.size() - 1);//获得控件列表中的最后一个控件
        Agi.Controls.BasicPropertyPanel.Show($(ThisControl.Get("HTMLElement"))[0].id);//根据对应控件的外壳ID,将控件的属性显示在公共属性面板
    }
    //endregion

    //region 20130128 16:12 markeluo 性能优化，缓存释放 暂时未调用撤销方法，所以暂时将撤销相关方法代码屏蔽
    //region 操作后html
    //newValue = $(workspace.editDiv).html();
    //endregion
    //region 撤销逻辑
//    var funUndo = function () {
//        //逻辑撤销
//        for (var i = 0; i < delUndo.parameters.length; i++) {
//            var obj = delUndo.parameters[i];
//            Agi.Edit.workspace.parameterList.add(obj);
//        }
//        for (var i = 0; i < delUndo.controls.length; i++) {
//            var obj1 = delUndo.controls[i];
//            Agi.Edit.workspace.controlList.add(obj1);
//            workspace.currentControls[workspace.currentControls.length] = obj1;
//            Agi.Msg.PageOutPramats.AddObj(delUndo.controlPar);
//        }
//    }
    //endregion
    //region 还原逻辑
//    var funRedo = function () {
//        //逻辑还原
//        for (var i = 0; i < delUndo.parameters.length; i++) {
//            var obj = delUndo.parameters[i];
//            Agi.Edit.workspace.parameterList.remove(obj);
//        }
//        for (var i = 0; i < delUndo.controls.length; i++) {
//            var obj1 = delUndo.controls[i];
//            Agi.Edit.workspace.controlList.remove(obj1);
//            Agi.Msg.PageOutPramats.RemoveItems(obj1.Get("ProPerty").ID);
//        }
//    }
    //endregion
    //region 入栈
    //stack.execute(new EditCommand(funUndo, funRedo, oldValue, newValue));
    //endregion
    //endregion 性能优化，缓存释放 end
};
edit.FindChildByContainer = function(container,childControlList){
    for(var i = 0; i<container.childControls.length;i++){
        var child = container.childControls[i];
        if(child.Get('ControlType') === 'Container'){
            edit.FindChildByContainer(child,childControlList);
        }else{
            childControlList.push(child);
        }
    }
    childControlList.push(container);
};
//复制
edit.CopyControls = function () {
    workspace.clipboardControls.length = 0;
    $.each(workspace.currentControls, function (i, item) {
        workspace.clipboardControls.push(item);
    });
}
//粘贴
var copyUndo = {};
edit.PastContols = function () {
    oldValue = $(workspace.editDiv).html();
    //
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var control = item.Copy();
        //建立关系
        if( item.parentId){
            control.parenId = item.parentId;
            var container = Agi.Controls.FindControlByPanel(item.parentId);
            if(container){
                container.childControls.push(control);
            }
        }
        workspace.controlList.add(control);
        copyUndo.controls = [];
        copyUndo.controls.push(control);
    }
    //
    newValue = $(workspace.editDiv).html();
    //
    var undoFunction = function () {
        for (var i = 0; i < copyUndo.controls.length; i++) {
            var item = copyUndo.controls[i];
            workspace.controlList.remove(item);
        }
    }
    var redoFunction = function () {
        for (var i = 0; i < copyUndo.controls.length; i++) {
            var item = copyUndo.controls[i];
            workspace.controlList.add(item);
        }
    }
    //
    //stack.execute(new EditCommand(undoFunction(), redoFunction(), oldValue, newValue));
}
//左对齐
edit.doControlsAlignmentLeft = function () {
    //region 操作前
    oldValue = $(workspace.editDiv).html();
    //endregion
    //region html操作
    var align = 0;
    //20140217 范金鹏 使控件左对齐始终以最左边的控件为准
    var leftArray = [];
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        leftArray.push(parseInt(html.css("left")));
    }
    var sortArray = leftArray.sort(function (a, b) { return a - b; });

    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//        if (i == 0) {
//            align = html.css("left");
//        }
//        else {
//            html.css("left", align);
        //        }
        html.css("left", sortArray[0]);
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    //endregion
    //region 操作后
    newValue = $(workspace.editDiv).html();
    //endregion
    //region 入栈
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
    //endregion
}
//左右居中
edit.doControlsAlignmentLeftRight = function () {
    oldValue = $(workspace.editDiv).html();
    var align = 0;
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        if (i == 0) {
            //align = parseInt(html.css("left").split("px")[0]) + parseInt(html.css("width").split("px")[0] / 2);
            align = parseInt(html.css("left")) + parseInt(html.css("width")) / 2;
        }
        else {
            html.css("left", align - (parseInt(html.css("width")) / 2));
        }
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    newValue = $(workspace.editDiv).html();
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
}
//右对齐
edit.doControlsAlignmentRight = function () {
    oldValue = $(workspace.editDiv).html();

    //20140217 范金鹏 使控件右对齐始终以最右边的控件为基准
    var rightArray = [];
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        rightArray.push(parseInt(html.css("left")) + parseInt(html.css("width")));
    }
    var sortArray = rightArray.sort(function (a, b) { return a - b; });

    var align = 0;
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//        if (i == 0) {
//            align = parseInt(html.css("left")) + parseInt(html.css("width"));
//        }
//        else {
//            html.css("left", align - parseInt(html.css("width")));
        //        }
        html.css("left", sortArray[sortArray.length - 1] - parseInt(html.css("width")));
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    newValue = $(workspace.editDiv).html();
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
}
//上对齐
edit.doControlsAlignmentTop = function () {
    oldValue = $(workspace.editDiv).html();

    //20140217 范金鹏 上对齐使控件始终以最上面的控件为基准
    var topArray = [];
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        topArray.push(parseInt(html.css("top")));
    }
    var sortArray = topArray.sort(function (a, b) { return a - b; });

    var align = 0;
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//        if (i == 0) {
//            align = html.css("top")
//        }
//        else {
//            html.css("top", align);
        //        }
        html.css("top", sortArray[0]);
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    newValue = $(workspace.editDiv).html();
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
}
//上下居中
edit.doControlsAlignmentTopBottom = function () {
    oldValue = $(workspace.editDiv).html();
    var align = 0;
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        if (i == 0) {
            align = parseInt(html.css("top")) + parseInt(html.css("height")) / 2;
        }
        else {
            html.css("top", align - parseInt(html.css("height")) / 2);
        }
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    newValue = $(workspace.editDiv).html();
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
}
//下对齐
edit.doControlsAlignmentBottom = function () {
    oldValue = $(workspace.editDiv).html();

    //20140217 范金鹏 使所有控件的对齐方式是以最下面控件为基准
    var bottomArray = [];
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        bottomArray.push(parseInt(html.css("top")) + parseInt(html.css("height")));
    }
    var sortArray = bottomArray.sort(function (a, b) { return a - b; });

    var align = 0;
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//        if (i == 0) {
//            align = parseInt(html.css("top")) + parseInt(html.css("height"));
//        }
//        else {
//            html.css("top", align - parseInt(html.css("height")));
        //        }
        html.css("top", sortArray[sortArray.length - 1] - parseInt(html.css("height")));
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    newValue = $(workspace.editDiv).html();
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
}
//横向排列
edit.doControlsAlignmentHList = function () {
    //region 检测
    var allWidth = 0;
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var html = $("#" + $(workspace.currentControls[i].Get("HTMLElement")).attr("id"));
        allWidth += parseInt(html.css("width")) + 8;
    }
    var html0 = $("#" + $(workspace.currentControls[0].Get("HTMLElement")).attr("id"));
    allWidth += parseInt(html0.css("left"));
    if (allWidth > parseInt($(workspace.editDiv).css("width"))) {
        /*var result = confirm("当前操作会使控件超出工作区边界，是否继续？");
        if (!result) {
            return;
        }*/
        AgiCommonDialogBox.Alert("当前操作会使控件超出工作区右边界，建议减少所选控件。");
        return;
    }
    //endregion
    oldValue = $(workspace.editDiv).html();
    var alignLeft = 0;
    var alignTop = 0;
    for (var i = 1; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html0 = $("#" + $(workspace.currentControls[i - 1].Get("HTMLElement")).attr("id"));
        var html = $("#" + $(workspace.currentControls[i].Get("HTMLElement")).attr("id"));
        alignTop = html0.css("top");
        alignLeft = parseInt(html0.css("left")) + parseInt(html0.css("width"));
        html.css("top", alignTop);
        html.css("left", alignLeft + 8);
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    newValue = $(workspace.editDiv).html();
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
}
//纵向排列
edit.doControlsAlignmentVList = function () {
    //region 检测
    var allHeight = 0;
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var html = $("#" + $(workspace.currentControls[i].Get("HTMLElement")).attr("id"));
        allHeight += parseInt(html.css("height")) + 8;
    }
    var html0 = $("#" + $(workspace.currentControls[0].Get("HTMLElement")).attr("id"));
    allHeight += parseInt(html0.css("top"));
    if (allHeight > parseInt($(workspace.editDiv).css("height"))) {
        /*var result = confirm("当前操作会使控件超出工作区边界，是否继续？");
        if (!result) {
            return;
        }*/
        AgiCommonDialogBox.Alert("当前操作会使控件超出工作区下边界，建议减少所选控件。");
        return;
    }
    //endregion
    oldValue = $(workspace.editDiv).html();
    var alignLeft = 0;
    var alignTop = 0;
    for (var i = 1; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        var html0 = $("#" + $(workspace.currentControls[i - 1].Get("HTMLElement")).attr("id"));
        var html = $("#" + $(workspace.currentControls[i].Get("HTMLElement")).attr("id"));
        alignLeft = html0.css("left");
        alignTop = parseInt(html0.css("top")) + parseInt(html0.css("height"));
        html.css("left", alignLeft);
        html.css("top", alignTop + 8);
        /*刷新控件的位置属性*/
        item.PostionChange(null);
    }
    newValue = $(workspace.editDiv).html();
    //stack.execute(new EditCommand(null, null, oldValue, newValue));
}
//锁定控件
edit.LockControls = function () {
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        item.isLock=true;
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        html.draggable("disable");
        html.resizable("disable")
    }
}
edit.UnLockControls = function () {
    for (var i = 0; i < workspace.currentControls.length; i++) {
        var item = workspace.currentControls[i];
        item.isLock=false;
        var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
        html.draggable("enable");
        html.resizable("enable");
    }
}
/*启动脚本编辑器*/
edit.startScriptEditor = function () {
    var controlId_in = workspace.currentControls[0].Get('HTMLElement').id.replace('Panel_', '');
    scriptEditor.open(controlId_in);
}
/*清除所有已创建的控件对象*/
//region 20130128 16:12 markeluo 性能优化，缓存释放 清除所有控件，内存释放，控件对象列表和选中控件列表等清空
edit.ClearAllControls=function(){
    delUndo.controls = [];
    workspace.currentControls.length=0;
    workspace.clipboardControls.length=0;
    var ControlsCount=workspace.controlList.size();
    var ThisControl=null;
    for(var i=0;i<ControlsCount;i++){
        ThisControl=workspace.controlList.get(0);
        if(ThisControl!=null && ThisControl.Destory){
            Agi.Edit.workspace.removeParameter(ThisControl.Get("ProPerty").ID);//移除相关参数
            Agi.Controls.ControlDestoryByList(ThisControl);//所有控件列表，当前选中列表中移除当前控件
            var controlPar = Agi.Msg.PageOutPramats.RemoveItems(ThisControl.Get("ProPerty").ID);//移除输出参数关联

            ThisControl.Destory();
        }
        ThisControl=null;
    }
    workspace.controlList.clear();
}
//endregion  20130128 16:12 markeluo 性能优化，缓存释放

//region 20140105 14:04 markeluo 页面钻取　功能支持
Namespace.register("Agi.PageDataDrill");
//获取所有页面版本列表
Agi.PageDataDrill.GetAllPageFilList=function(callback){
    var jsonString={"sessionkey":"KDKJLKJDLFJSDKJF20123"};
    jsonString=JSON.stringify(jsonString);
    Agi.DAL.ReadData(
        {
            "MethodName":"GetAllPageFileList",
            "Paras": jsonString,
            "CallBackFunction": function (_result) {
                callback(_result);
            }
        });
}
//根据页面名称和版本号获取页面版本ID
Agi.PageDataDrill.GetPageFilePath=function(strPageName,strVesionNO,callback){
    var jsonString={"pagename":strPageName,"no":strVesionNO};
    jsonString=JSON.stringify(jsonString);
    Agi.DAL.ReadData(
        {
            "MethodName":"GetPageFilePath",
            "Paras": jsonString,
            "CallBackFunction": function (_result) {
                callback(_result);
            }
        });
}
//根据页面名称和版本号获取页面URL参数信息
Agi.PageDataDrill.GetPageContenURL=function(strPageName,strVesionNO,callback){
    var jsonString={"pagename":strPageName,"no":strVesionNO};
    jsonString=JSON.stringify(jsonString);
    Agi.DAL.ReadData(
        {
            "MethodName":"GetPageContenURL",
            "Paras": jsonString,
            "CallBackFunction": function (_result) {
                callback(_result);
            }
        });
}
//endregion
