/**
 * Created with JetBrains WebStorm.
 * User: MARKELUO
 * Date: 13-6-22
 * Time: 下午5:03
 * To change this template use File | Settings | File Templates.
 */
//注册命名空间
Namespace.register("Agi.PageGroupManager");
//Datasets文件夹删除
Agi.PageGroupManager.AddPageGroup=function(NodeInfo,callback){
    //NodeInfo.Key:文件夹唯一标识(.NET存放文件夹路径，JAVA存放文件夹ID,根节点为"")
    ////OldName:NodeInfo.Name,NewName:NodeInfo.NewName,Parent:NodeInfo.Parent,Key:NodeInfo.Key
    var jsondata={
        "action":"save",
        "parentpath":NodeInfo.Parent,
        "groupname":NodeInfo.Name,
        "groupid":"",
        "oldgroupname":""
    };
    jsondata=JSON.stringify(jsondata);
    Agi.DAL.ReadData({ "MethodName":"VSGroupManager", "Paras": jsondata, "CallBackFunction": function (_result) {
        callback(_result);
    }});
}
Agi.PageGroupManager.EditPageGroup=function(NodeInfo,callback){
    //NodeInfo.Key:文件夹唯一标识(.NET存放文件夹路径，JAVA存放文件夹ID,根节点为"")
    ////OldName:NodeInfo.Name,NewName:NodeInfo.NewName,Parent:NodeInfo.Parent,Key:NodeInfo.Key
    var jsondata={
        "action":"update",
        "parentpath":NodeInfo.Key,
        "groupname":NodeInfo.NewName,
        "groupid":NodeInfo.Key,
        "oldgroupname":NodeInfo.OldName
    };
    if(Agi.WebServiceConfig.Type!=".NET"){
        jsondata.parentpath="";
    }
    jsondata=JSON.stringify(jsondata);
    Agi.DAL.ReadData({ "MethodName":"VSGroupManager", "Paras": jsondata, "CallBackFunction": function (_result) {
        callback(_result);
    }});
}
Agi.PageGroupManager.DeletePageGroup=function(NodeInfo,callback){
    //NodeInfo.Key:文件夹唯一标识(.NET存放文件夹路径，JAVA存放文件夹ID,根节点为"")
    ////Name:NodeInfo.Name,Parent:NodeInfo.Parent,Key:NodeInfo.Key
    var jsondata={
        "action":"delete",
        "parentpath":NodeInfo.Parent,
        "groupname":NodeInfo.Key,
        "groupid":NodeInfo.Name,
        "oldgroupname":""
    };
    if(Agi.WebServiceConfig.Type!=".NET"){
        jsondata.groupid=NodeInfo.Key;
    }
    jsondata=JSON.stringify(jsondata);
    Agi.DAL.ReadData({ "MethodName":"VSGroupManager", "Paras": jsondata, "CallBackFunction": function (_result) {
        callback(_result);
    }});
}
//页面移动到分组
Agi.PageGroupManager.VSPageMove=function(PageInfo,callback){
    //PageInfo.Key:文件夹唯一标识(.NET存放页面名称，JAVA存放页面ID")
    //PageInfo.Parent 移动到的分组文件夹
    var jsondata={
        "pagename":PageInfo.Key,
        "grouppath":PageInfo.Parent,
        "parentid":PageInfo.Parent
    };
    jsondata=JSON.stringify(jsondata);
    Agi.DAL.ReadData({ "MethodName":"VSPageMove", "Paras": jsondata, "CallBackFunction": function (_result) {
        callback(_result);
    }});
}
//页面分组文件夹移动
Agi.PageGroupManager.VSGroupMove=function(PageInfo,callback){
    //PageInfo.Key:文件夹唯一标识(.NET存放页面名称，JAVA存放页面ID")
    //PageInfo.Parent 移动到的分组文件夹
    var jsondata={
        "groupfrom":PageInfo.Key,
        "groupto":PageInfo.Parent,
        "groupid":PageInfo.Key,
        "parentid":PageInfo.Parent
    };
    jsondata=JSON.stringify(jsondata);
    Agi.DAL.ReadData({ "MethodName":"VSGroupMove", "Paras": jsondata, "CallBackFunction": function (_result) {
        callback(_result);
    }});
}

//公共删除提示方法
Namespace.register("Agi.PageSourceDelTipManager");
Agi.PageSourceDelTipManager.DelSource=function(SourceInfo,callback){
    //SourceInfo.deleteenum:删除资源类型(1/2/3/4),1：数据源 2:标注虚拟表 3:混合虚拟表 4:dataset
    //SourceInfo.datasource 数据源ID
    //SourceInfo.vtable 标准/混合虚拟表ID
    //SourceInfo.dataset datasetID

    var jsondata={
        "deleteenum":SourceInfo.deleteenum,
        "datasource":SourceInfo.datasource,
        "vtable":SourceInfo.vtable,
        "dataset":SourceInfo.dataset
    };
    jsondata=JSON.stringify(jsondata);
    Agi.DAL.ReadData({ "MethodName":"DeletePromptInfo", "Paras": jsondata, "CallBackFunction": function (_result) {
        if(_result.result=="true"){
            if(_result.bzvtablecount!=null && _result.bzvtablecount!=""){}else{
                _result.bzvtablecount=0;
            }
            if(_result.fhvtablecount!=null && _result.fhvtablecount!=""){}else{
                _result.fhvtablecount=0;
            }
            if(_result.datasetcount!=null && _result.datasetcount!=""){}else{
                _result.datasetcount=0;
            }
            if(_result.pagecount!=null && _result.pagecount!=""){}else{
                _result.pagecount=0;
            }
        }
        callback(_result);
    }});
}
Agi.PageSourceDelTipManager.TipsMerg=function(data){
    //"bzvtablelist":["PCITabA","PCITabB","11223344","text"]
    // "fhvtablelist":["test12367","11122221"]
    // "datasetlist":["111","123"]
    // "pagelist":["PCI_1.xml","PCI_1.xml","1_1.xml"]
    var TipDetailContent="";
    if(data!=null){
        if(data.bzvtablelist!=null && data.bzvtablelist!=""){
            TipDetailContent+="<div style='font-family:微软雅黑 宋体 arial'>标准虚拟表:";
            TipDetailContent+=data.bzvtablelist.join(",");
            TipDetailContent+="</div>";
        }
        if(data.fhvtablelist!=null && data.fhvtablelist!=""){
            TipDetailContent+="<div style='font-family:微软雅黑 宋体 arial'>混合虚拟表:";
            TipDetailContent+=data.fhvtablelist.join(",");
            TipDetailContent+="</div>";
        }
        if(data.datasetlist!=null && data.datasetlist!=""){
            TipDetailContent+="<div style='font-family:微软雅黑 宋体 arial'>DataSets:";
            TipDetailContent+=data.datasetlist.join(",");
            TipDetailContent+="</div>";
        }
        if(data.pagelist!=null && data.pagelist!=""){
            TipDetailContent+="<div style='font-family:微软雅黑 宋体 arial'>页面:";
            TipDetailContent+=data.pagelist.join(",").replaceAll(".xml","");
            TipDetailContent+="</div>";
        }
    }
    return TipDetailContent;
}
