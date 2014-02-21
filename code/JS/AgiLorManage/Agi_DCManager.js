///<reference path="../jquery.min.js" />
(function () {
    //命名空间
    Namespace.register("Agi.DCManager");
    var webserviceUrl = "http://192.168.1.9:8080/qpc-app/services/dataSourceManagementService?wsdl";
    var webserviceUrl = "http://192.168.1.9/Agi_webserivce/Service1.asmx";
    /**
    * Created with JetBrains WebStorm.
    * User: luopeng
    * Date Time: 2012-08-13 15:39:17
    * To change DCSave ,DCDelete,DCTest,DCGetAllConn,DCGetNamesByID,DCGetColumnsByID,DCGetDataByID
    * Data Source Manager 数据源管理
    */
    Agi.DCManager.DCSave = function (_action, _dataSourceName, _dataBaseType,_port, _serverName, _userName, _password, _database,_Dbdescription, callback) {
        /// <summary>保存数据源</summary>
        /// <param name="_dataSourceName" type="String">新建实体名称</param>
        /// <param name="_dataBaseType" type="String">数据库类型</param>
        /// <param name="_serverName" type="String">数据库服务IP</param>
        /// <param name="_userName" type="String">用户名</param>
        /// <param name="_password" type="String">密码</param>
        /// <param name="_database" type="String">数据库名称</param>
        /// <param name="callback" type="String">回调对象</param>
       /*
        var jsonData = {
            "action": _action,
            "dataSourceName": _dataSourceName,
            "data": {
                "dataBaseType": _dataBaseType,
                "port":_port,
                "serverName": _serverName,
                "userName": _userName,
                "password": _password,
                "database": _database
            }
        };
        */
        var jsonData = {
            "action": _action,
            "dataSourceName": _dataSourceName,
            "data": {
                "dataBaseType": _dataBaseType,
                "port":_port,
                "dbdescription":_Dbdescription,//20121224 14:10 markeluo 新增了备注信息保存
                "serverName": _serverName,
                "userName": _userName,
                "password": _password,
                "database": _database
            }
        };


        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DCSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.DCManager.DCSaveExcel = function (_action, _dataSourceName, _dataBaseType,_port, _serverName, _userName, _password, _database,_Dbdescription, callback) {
        /// <summary>保存EXCEL数据源</summary>
        /// <param name="_action" type="String">状态</param>
        /// <param name="_dataSourceName" type="String">新建实体名称</param>
        /// <param name="_dataBaseType" type="String">数据库类型</param>
        /// <param name="callback" type="String">回调对象</param>

        var jsonData = {
            "action":_action,
            "dataSourceName":_dataSourceName,
            "excelFileName":_port,
            "data": {"dataBaseType": _dataBaseType,"serverName": _serverName,"userName":_userName,"password":_password,"database":_database, "dbdescription":_Dbdescription}
        };
        var ExcelDCSaveMethName="DCSave";
        if (Agi.WebServiceConfig.Type == "JAVA" && _dataBaseType=="Excel") {
            ExcelDCSaveMethName="DsExcelSave";
        }
        var jsonString = returnjsonString(jsonData);
            Agi.DAL.ReadData({ "MethodName":ExcelDCSaveMethName, "Paras": jsonString, "CallBackFunction": function (_result) {
                callback(_result);
            }
        });
    }
    Agi.DCManager.ExcelDataSourceGetAll = function (MethodName, Paras, callback) {
        /// <summary>获取当前EXCEL数据源</summary>
        /// <param name="callback" type="String">回调对象</param>
        Agi.DAL.ReadData({"MethodName": "DSExcelGetSheetName","Paras": Paras,"CallBackFunction": function (_result) {     //回调函数
            callback(_result);
                }
            });
    }
    function returnjsonString(jsonData) {
        /// <summary>转换json</summary>
        /// <param name="jsonData" type="String">进行转换的数据</param>
        return JSON.stringify(jsonData);
    }
    Agi.DCManager.DCDelete = function (_dataSourceName, callback) {
        /// <summary>删除数据源</summary>
        /// <param name="dataSourceName" type="String">实体名称</param>
        /// <param name="callback" type="String">回调对象</param>
        var jsonData = {
            "dataSourceName": _dataSourceName,
            "action": "delete"
        };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DCDelete", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.DCTest = function (_dataSourceName, callback) {
        /// <summary>测试数据源连接</summary>
        /// <param name="_dataSourceName" type="String">实体名称</param>
        /// <param name="callback" type="String">回调对象</param>
        var jsonData = { "dataSourceName": _dataSourceName, "action": "test" };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DCTest", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    //传点位信息的Json参数 -----------------------------------------------------------------------------------------------------------------------------------
    Agi.DCManager.DCPointInfoSaveSave = function (_PointInfoManageState,_tagData,callback) {
        var jsonData = {
            'action': _PointInfoManageState,
            tagData:_tagData
       // {'action':'save',tagData:{'rtdbID':'1','Tag':'a','TagType':'1','TagDescrption':'1','UnitOfMeasure':'1','Group':'1','Area':'1','Unit':'1','Console':'1','Operator':'1'}}
        }
        var jsonString = returnjsonString(jsonData);
       // alert(jsonString)
        Agi.DAL.ReadData({ "MethodName": "RPSave", "Paras": jsonString, "CallBackFunction": function (_reslut) {
            callback(_reslut);
        }
        });
    }
    Agi.DCManager.DCGetApiPoint = function(_redbid,callback){//根据实时数据眼名称从Api中获得点位
        var jsonData={
            'RtdbName':_redbid
        }
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "RtdbGetpoints", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.DCFindRtdbIDKey = function(keyValue,callback){ //查询’实时数据连接‘外键
        var jsonData={
            'rtdbID':keyValue
        }
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "RtdbLoad", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.DCFindPointDate = function(__pointRtdbID,_tagName,callback){ //时实数据源上的点位信息
//        if(_tagName == ""){
            var jsonDate = {
                'rtdbID':__pointRtdbID,
                'tagName':_tagName
//            }
        }
      /*  else{
            var jsonDate = {
                'rtdbID':__pointRtdbID,
                'tagName':[_tagName]
            }
        }*/

        var jsonString = returnjsonString(jsonDate);
        Agi.DAL.ReadData({ "MethodName": "RPLoad", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.DCManager.DCFindPointTabel = function(__pointRtdbID,_tagName,callback){ //指定点位信息读取
        var jsonDate = {
            'rtdbID':__pointRtdbID,
            'tagName':[_tagName]
        }
        var jsonString = returnjsonString(jsonDate);
        Agi.DAL.ReadData({ "MethodName": "RPLoad", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.DCDeletePoint = function(_pointID,_tagName,callback){
        var jsonDate = {
            'rtdbID':_pointID,
            'tag':_tagName
        }
        var jsonString = returnjsonString(jsonDate);
       // alert(jsonString);
        Agi.DAL.ReadData({ "MethodName": "RPDelete", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    //点位信息end---------------------------------------------------------------------------------------------------------------------------------
    //关系配置===================================================================================================================================
    Agi.DCManager.AddGroupConfig = function(_rtdbID,_groupID,_tag,callback){
            var jsonDate = {
                'rtdbID':_rtdbID,
                'groupID':[_groupID],
                'tag':[_tag]
            }
        var jsonString = returnjsonString(jsonDate);
        Agi.DAL.ReadData({ "MethodName": "RCSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.FindGroupConfig = function(_rtdbID,_groupID,callback){
        var jsonDate = {
            'rtdbID':_rtdbID,
            'groupID':null
        }
        var jsonString = returnjsonString(jsonDate);
        Agi.DAL.ReadData({ "MethodName": "RCLoad", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
          }
        });
    }
    Agi.DCManager.DeleteGroupConfig = function(_rtdbID,_groupID,_tag,callback){
        var jsonDate = {
            'rtdbID':_rtdbID,
            'groupID':[_groupID],
            'tag':[_tag]
        }
        var jsonString = returnjsonString(jsonDate);
        Agi.DAL.ReadData({ "MethodName": "RCDelete", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }    //RCDelete
    //关系配置===================================================================================================================================

    Agi.DCManager.DCGetAllConn = function (callback) {
        /// <summary>获取所有已创建的数据源</summary>
        /// <param name="callback" type="String">回调对象</param>
//        Agi.DAL.ReadData({ "MethodName": "DCGetAllConn", "Paras":null, "CallBackFunction": function (_result) {
//                callback(_result);
//            }
//        });
        //JAVA webservice 权限处理支持，给后台传入session　参数
        Agi.DAL.ReadData({ "MethodName": "DCGetAllConn", "Paras":"{'sessionkey':'KDKJLKJDLFJSDKJF20123'}", "CallBackFunction": function (_result) {
                callback(_result);
            }
        });
    }
    Agi.DCManager.DCGetNamesByID = function (_dataSourceName, callback) {
        /// <summary>根据ID获取实体</summary>
        /// <param name="_dataSourceName" type="String">实体名称</param>
        /// <param name="callback" type="String">返回值</param>
        /// <param name="callback" type="String">回调对象</param>
        var jsonData = { "dataSourceName": _dataSourceName };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DCGetNamesByID", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.DCGetColumnsByID = function (_dataSourceName, _nameID, callback) {
        /// <summary>根据数据源ID和表名/视图名称获取列的信息(列名称，列的数据类型)</summary>
        /// <param name="_dataSourceName" type="String">数据源ID</param>
        /// <param name="_nameID" type="String">表名/视图名</param>
        /// <param name="callback" type="String">回调对象</param>
        var jsonData = { "dataSourceName": _dataSourceName, "nameID": _nameID };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DCGetColumnsByID", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.DCGetDataByID = function (_dataSourceName, _nameID, _count, callback) {
        /// <summary>根据数据源ID、表名/视图名称、查询的前多少行来获取此表的数据</summary>
        /// <param name="_dataSourceName" type="String">数据源ID</param>
        /// <param name="_nameID" type="String">表名/视图名称</param>
        /// <param name="_count" type="String">行数</param>
        /// <param name="callback" type="String">回调对象</param>
        var jsonData = { "dataSourceName": _dataSourceName, "nameID": _nameID, "count": _count };
        //如果是excel的表名,必须加上中括号
        var index = _nameID.indexOf('$');
        if(index >= 0 && index === (_nameID.length-1)){
            jsonData.nameID = '['+_nameID+']';
        }
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DCGetDataByID", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.DCGetConnDByID = function (_dataSourceName, callback) {
        /// <summary>根据数据源名称获取数据源详细信息</summary>
        /// <param name="_dataSourceName" type="String">数据源名称</param>
        /// <param name="callback" type="String">回调对象</param>
        var jsonData = { "dataSourceName": _dataSourceName };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DCGetConnDByID", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    /*版本管理*******************************************************************************************************************************/
    Agi.DCManager.FMGetFileByParent = function(_url,_ID,callback){//获得版本文件夹
        var jsonData = {"url":_url,"ID":_ID}
        var jsonString = returnjsonString(jsonData);
        var Methname="FMGetFileByParent_SG";
        if (Agi.WebServiceConfig.Type== "JAVA") {
//            Methname="FMGetFileByParent";  //20130916 11:03 获取页面分组、页面、版本 对SPC 类型页面支持
              Methname="SPC_FMGetFileByParent";
        }
        Agi.DAL.ReadData({ "MethodName":Methname, "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });

    }
	Agi.DCManager.VSGetversionsBypageName = function(_pageName,_isbolspcpage,callback){//页面信息
		var jsonData = {"pageName":_pageName}
		  var jsonString = returnjsonString(jsonData);
        var geversionmethname="VSGetversionsBypageName";
        if(_isbolspcpage){
            geversionmethname="SPC_VSGetversionsBypageName";
        }
        Agi.DAL.ReadData({ "MethodName":geversionmethname, "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
	}

    Agi.DCManager.VSGetPudversions = function(callback){//获取已发布的所有页面版本列表
      /*  var jsonData = {"pageName":_pageName}
        var jsonString = returnjsonString(jsonData);*/
        Agi.DAL.ReadData({ "MethodName": "VSGetPudversions", "Paras": "", "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DCManager.VSUpdatePubstate = function(_pageName,_versionnum,callback){
            var jsonData = {"VName":_pageName,"VID":_versionnum}
            var jsonString = returnjsonString(jsonData);
            Agi.DAL.ReadData({ "MethodName": "VSUpdatePubstate", "Paras": jsonString, "CallBackFunction": function (_result) {
                callback(_result);
            }
        });
    }//发布版本  VSUpdatePubstate
})();
