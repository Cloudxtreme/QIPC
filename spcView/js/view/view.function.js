/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-9-4
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */
Agi.view.pageinfo=null;//页面数据信息
Agi.view.functions =
{
    openPage: function() {
        var page = this.getUrlPage();
        if (!page) {
            return;
        }
        try {
            //Agi.Msg.PointsManageInfo.CloseServer();
        } catch (e) { }
        Agi.view.workspace.controlList.clear(); //清空控件集合
        Agi.Msg.PointsManageInfo.ControlPoints = []; //清空实时点位集合
        Agi.Msg.PageOutPramats.Clear();  //清空控件参数集合   
        Agi.Msg.ParaBindManage.Clear(); //清空管理绑定集合
        Agi.Msg.UrlManageInfo.Clear(); //清空url参数集合

        document.title = page;
        //本地存储
        if (localStorage[page] && GetUrlParas("isView") === "false") {
            console.debug("openPageFromLocalStorage");
            //
            var result = JSON.parse(localStorage[page]);
            result.data = JSON.parse(result.data);
            result.data.PageConfig = JSON.parse(result.data.PageConfig);
            //初始化页面
            Agi.view.workspace.setConfig(result.data.Config.PageConfig);
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
            } catch(e) { //异常处理是为了兼容原来已配置的页面
            }
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
            //解析绑定参数
            Agi.Msg.ParaBindManage.StringToObj(result.data.PageConfig.ParaRelationalExpression); //add by lujia
            Agi.Msg.PageLoadManage.Set("UrlParas", result.data.PageConfig.UrlParas);
            //实例化控件
            if (result.data.ControlList) {
                var controls = result.data.ControlList.length ? result.data.ControlList : [result.data.ControlList];
                if (controls.length) {
                    Agi.Msg.PageLoadManage.Set("PageControlCount", controls.length); //add by lj
                    if(result.data.ControlCount !== undefined){//由于加入了容器控件,控件个数要换个方式取
                        Agi.Msg.PageLoadManage.Set("PageControlCount", result.data.ControlCount);
                    }
                    Agi.Msg.PageLoadManage.Set("PageControlLoadindex", 0);
//                    $(controls).each(function(i, conConfig) {
//                        Agi.view.todo.CreateNewControl(conConfig);
//                    });
                    RecursiveConstructControl(controls);
                }
            }
        } else {
            var PageID = GetUrlParas("ID");
            var json = { "url": page, "ID": PageID };
            var jsonString = JSON.stringify(json);
            //
            Agi.DAL.ReadData(
                {
                    "MethodName": Agi.view.workspace.serviceOpen,
                    "Paras": jsonString,
                    "CallBackFunction": function(result) {
                        if (result.result) {
                            try{
                                localStorage[page] = JSON.stringify(result);
                            }catch (e){
                                console.log(e.message);
                            }
                            result.data.PageConfig = JSON.parse(result.data.PageConfig);
                            //初始化页面
                            Agi.view.workspace.setConfig(result.data.PageConfig);
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
                            } catch(e) { //异常处理是为了兼容原来已配置的页面
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
                            Agi.Msg.ParaBindManage.StringToObj(result.data.PageConfig.ParaRelationalExpression); //add by lujia
                            Agi.Msg.PageLoadManage.Set("UrlParas", result.data.PageConfig.UrlParas);

                            //触发页面创建控件之间的事件 gyh 2012/11/27
                            canvas.fireScriptCode('pageLoading');
                            //实例化控件
                            if (result.data.ControlList) {
                                var controls = result.data.ControlList.length ? result.data.ControlList : [result.data.ControlList];
                                if (controls.length) {
                                    Agi.Msg.PageLoadManage.Set("PageControlCount", controls.length); //add by lj
                                    if(result.data.ControlCount !== undefined){//由于加入了容器控件,控件个数要单独做保存/读取
                                        Agi.Msg.PageLoadManage.Set("PageControlCount", result.data.ControlCount);
                                    }
                                    Agi.Msg.PageLoadManage.Set("PageControlLoadindex", 0);
//                                    var controlCount = controls.length;
//                                    for(var i = 0;i<controlCount;i++){
//                                        Agi.view.todo.CreateNewControl(controls[i]);
//                                    }
                                    RecursiveConstructControl(controls);
                                }
                            }
                        }
                    }
                }
            );
        }
        //region 20131021 markeluo spcView组态环境,可以显示当前页面版本的创建人、目的、经验总结等信息
        if (Agi.WebServiceConfig.Type == "JAVA") {
            var NumIndexOf=page.lastIndexOf("_");
            if(NumIndexOf>-1){
                var PageNameStr=page.substring(0,NumIndexOf);
                var VeSionStr=page.substr((NumIndexOf+1),(page.length-NumIndexOf-1));
                var PageData=null;
                var jsonData = {"pageName":PageNameStr}
                var jsonString = JSON.stringify(jsonData);
                Agi.DAL.ReadData({ "MethodName":"SPC_VSGetversionsBypageName", "Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result.result == "true") {
                        if (_result.data.length > 0) {
                            for (var i = 0; i < _result.data.length; i++) {
                                if(_result.data[i].VID==VeSionStr){
                                    PageData={PageName:PageNameStr,Vesion:VeSionStr,VCreateUser:null,VCreateAim:null,VSummary:null,VCreateData:null};

                                    PageData.VCreateUser=_result.data[i].VCreateUser;
                                    PageData.VCreateAim=_result.data[i].VCreateAim;
                                    PageData.VSummary=_result.data[i].VSummary;
                                    PageData.VCreateData=_result.data[i].VCreateData;
                                    break;
                                }
                            }
                        }
                        Agi.view.pageinfo=PageData;
                        if(PageData!=null){
                            $("#spcviewPagename").html(PageData.PageName);
                            $("#spcviewcreatauth").html(PageData.VCreateUser);
                            $("#spcviewcreatdate").html(PageData.VCreateData);
                            $("#spcviewcreataim").find("textarea").val(PageData.VCreateAim);
                            $("#spcviewcreatsummary").find("textarea").val(PageData.VSummary);
                        }
                    }
                }
                });
            }
        }
        //endregion
        function RecursiveConstructControl(controls){
            var pControls = controls.sort(function(c){ return c.parentId; });
            while(pControls.length){
                var pConf = pControls.shift();
                Agi.view.todo.CreateNewControl(pConf,pConf.parentId);
                if(pConf.childControlConfigs){
                    RecursiveConstructControl(pConf.childControlConfigs);
                }
            }
        }
    },
    getUrlPage: function() {
        var name = "page";
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    loadControlLibs: function(_callbak) {//20130117 17:08 markeluo 更改为回调处理
        $.get("xml/ControlConfig.xml", function(data) {
            self.controlConfigFile = data;
            var js = JSON.parse(Agi.Utility.xml2json($(data).find('Controls')[0], ""));
            var groups = js.Controls.Group.length ? js.Controls.Group : [js.Controls.Group];
            $(groups).each(function(i, g) {
                {
                    var controls = g.Control.length ? g.Control : [g.Control];
                    $(controls).each(function(i, con) {
                        //
                        var files = con.Files.File.length ? con.Files.File : [con.Files.File];
                        var ControlLibs = [];
                        $.each(files, function(i, file) {
                            ControlLibs.push(file['@Path']);
                        })
                        if (Agi.view.workspace.ControlsLibs) {
                            Agi.view.workspace.ControlsLibs.push({ "controlType": con['@ControlType'], "files": ControlLibs });
                        }
                    });
                }
            })
            _callbak();
        })
    },
    upPageinfo:function(_PageInfo,_callbak){
        if(_PageInfo!=null){
            var thispageinfo=Agi.view.pageinfo;
            thispageinfo.VCreateAim=_PageInfo.VCreateAim;
            thispageinfo.VSummary=_PageInfo.VSummary;
            var jsonData ={
                "url":"",
                "name":thispageinfo.PageName,
                "versions":thispageinfo.Vesion,
                "description":thispageinfo.VSummary,
                "VCreateUser":thispageinfo.VCreateUser,
                "VCreateAim":thispageinfo.VCreateAim,
                "VSummary":thispageinfo.VSummary,
                "VIsSPCPage":"true"
            }
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({ "MethodName":"SPC_VSFileExpandInfoUp", "Paras": jsonString, "CallBackFunction": function (_result) {
                    _callbak(_result);
                }
            });
        }
    },
    pageinfo:null//页面信息
};
//获取url参数
function GetUrlParas(param) {
    var query = window.location.search;
    var iLen = param.length;
    var iStart = query.indexOf(param);
    if (iStart == -1)
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    if (iEnd == -1)
        return query.substring(iStart);
    return decodeURI(query.substring(iStart, iEnd));
}
//region 20131129 15:44 添加钻取权限管理，判断目标页面是否有权限
function GetDrillPageAuth(strUrl,CallBackFun)
{
    var PageName=GetDirllPageUrlParValue(strUrl,"page");
    var PageID=GetDirllPageUrlParValue(strUrl,"ID");
    if(PageName!=null && PageID!=null){
        var jsonString={
            "url":PageName,
            "ID":PageID
        };
        jsonString=JSON.stringify(jsonString);
        Agi.DAL.ReadData({
                "MethodName":"VSFileAuthGet",
                "Paras": jsonString,
                "CallBackFunction": function(result) {
                    if(result.result=="true"){
                        if(result.data.authvalue==0){
                            CallBackFun(false);
                        }else{
                            CallBackFun(true);
                        }
                    }else{
                        CallBackFun(false);
                    }
                }
            });
    }
}
function GetDirllPageUrlParValue(strUrl,ParName){
    var query =strUrl;
    var iLen = ParName.length;
    var iStart = query.indexOf(ParName);
    if (iStart == -1)
        return "";
    iStart += iLen + 1;
    var iEnd = query.indexOf("&", iStart);
    if (iEnd == -1)
        return query.substring(iStart);
    return decodeURI(query.substring(iStart, iEnd));
}
//endregion

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
//endregion
