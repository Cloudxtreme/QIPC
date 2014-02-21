///<reference path="../jquery.min.js" />
(function () {
    //命名空间
    Namespace.register("Agi.DatasetsManager");
    //20130730 倪飘 20130723 首自信qpc项目接口参数更改
    Agi.DatasetsManager.DSSSave = function (_ID, _Memo, _DataSource, _VTType, _VirtualTable, _DefaultVisualContrl, _Level, _Parent, _DataColumn, _CalColumn, _ClumnOrder, _SortingRules, callback) {
        /// <summary>Datasets保存</summary>
        var jsonData = {
            "action": "save",
            "data": {
                "DataSet": { "ID": _ID,
                    "Memo": _Memo,
                    "DataSource": _DataSource,
                    "vtType": _VTType,
                    "VirtualTable": _VirtualTable, //20130730 倪飘 20130723 首自信qpc项目接口参数更改
                    "DefaultVisualContrl": _DefaultVisualContrl,
                    "Level": _Level,
                    "Parent": _Parent,
                    "Columns": {
                        "DataColumns": { "DataColumn": _DataColumn },
                        "CalColumns": { "CalColumn": _CalColumn }
                    },
                    "ClumnOrder": {
                        "ColumnName": _ClumnOrder
                    },
                    "SortingRules":{
                        "ColumnName": _SortingRules
                    }
                }
            }
        };
        var jsonString = JSON.stringify(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DSSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
//20130730 倪飘 20130723 首自信qpc项目接口参数更改
Agi.DatasetsManager.DSSUpdate = function (_DSId, _Memo, _DataSource, _VTType, _VirtualTable, _DefaultVisualContrl, _Level, _Parent, _DataColumns, _CalColumns, _ClumnOrder, _SortingRules, callback) {
        /// <summary>Datasets修改</summary>
        var jsonData = {
            "action": "update",
            "data": {
                "DataSet": { "ID": _DSId,
                    "Memo": _Memo,
                    "DataSource": _DataSource,
                    "vtType": _VTType, //20130730 倪飘 20130723 首自信qpc项目接口参数更改
                    "VirtualTable": _VirtualTable,
                    "DefaultVisualContrl": _DefaultVisualContrl,
                    "Level": _Level,
                    "Parent": _Parent,
                    "Columns": {
                        "DataColumns": { "DataColumn": _DataColumns },
                        "CalColumns": { "CalColumn": _CalColumns }
                    },
                    "ClumnOrder": {
                        "ColumnName": _ClumnOrder
                    },
                    "SortingRules": {
                        "ColumnName": _SortingRules
                    }
                }
            }
        };

        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "DSSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });

    }

    Agi.DatasetsManager.DSSDelete = function (_Datasetsname, callback) {
        /// <summary>Datasets删除</summary>
        var jsonData = { "action": "delete", "dsName": _Datasetsname };
        var jsonString = JSON.stringify(jsonData);

         Agi.DAL.ReadData({ "MethodName": "DSDelete", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DatasetsManager.DSSGetVirtualTableByDSAndVT = function (_dataSourceName, _VirtualTableName, callback) {
        /// <summary>根据数据源名称和虚拟表名称获取所依靠的虚拟表内容</summary>
        var jsonData = { "DataSourceName": _dataSourceName, "VirtualTable": _VirtualTableName };
        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VTColumInfos", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.DatasetsManager.DSSGetDatasetByID = function (_DatasetID, callback) {
        /// <summary>根据id查找单个dataset详细信息</summary>
        var jsonData = { "datasetID": _DatasetID };

        var jsonString = JSON.stringify(jsonData);

         Agi.DAL.ReadData({ "MethodName": "DSDataSetByID", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.DatasetsManager.DSSGetAllDataset = function (callback) {
        /// <summary>查找所有datasets信息</summary>

        Agi.DAL.ReadData({ "MethodName": "DSAllDataSet", "Paras": JSON.stringify({perid:"root"}), "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
}
    Agi.DatasetsManager.DSTestData = function (_ID,_Param,_Memo, _DataSource, _VirtualTable, _DefaultVisualContrl, _Level, _Parent, _DataColumn, _CalColumn, _ClumnOrder, _SortingRules, callback) {
    var jsonData = {
            "action": "test",
            "param":_Param,
            "data": {
                "DataSet": { "ID": _ID,
                    "Memo": _Memo,
                    "DataSource": _DataSource,
                    "VirtualTable": _VirtualTable,
                    "DefaultVisualContrl": _DefaultVisualContrl,
                    "Level": _Level,
                    "Parent": _Parent,
                    "Columns": {
                        "DataColumns": { "DataColumn": _DataColumn },
                        "CalColumns": { "CalColumn": _CalColumn }
                    },
                    "ClumnOrder": {
                        "ColumnName": _ClumnOrder
                    },
                    "SortingRules":{
                        "ColumnName": _SortingRules
                    }
                }
            }
        };
        var jsonString = JSON.stringify(jsonData);
        Agi.DAL.ReadData({ "MethodName": "DSTestData", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
}

    //获取DataSet及分组信息 20130618 14:59 markeluo 新增
    Agi.DatasetsManager.DSAllDataSet_SG=function(ParentNodeInfo,callback){
        /// <summary>Datasets删除</summary>
        var jsonData = { "perid": ParentNodeInfo.perid};
        var jsonString = JSON.stringify(jsonData);
        var Methodname="DSAllDataSet_SG";
        if (Agi.WebServiceConfig.Type === "JAVA") {
            Methodname="DSAllDataSet";
            if(ParentNodeInfo.perid=="root"){
                jsonString=JSON.stringify({perid:"root"});
            }
        }
        Agi.DAL.ReadData({ "MethodName":Methodname, "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }});
    }

    //添加分组文件夹
    Agi.DatasetsManager.DSNodeAdd=function(NewNodeInfo,callback){
        //NewNodeInfo.Name:文件夹名称
        //NewNodeInfo.Parent:父节点信息(.NET存放父文件夹路径，JAVA存放父文件夹ID,根节点为"")
        var jsondata={
            "action":"save",
            "parentnodename":NewNodeInfo.Parent,
            "nodename":NewNodeInfo.Name,
            "oldnodename":"",
            "parentnodeid":NewNodeInfo.Parent,
            "oldnodeid":""
        };
        jsondata=JSON.stringify(jsondata)
        Agi.DAL.ReadData({ "MethodName":"DSNodeManager", "Paras": jsondata, "CallBackFunction": function (_result) {
            callback(_result);
        }});
    }
    Agi.DatasetsManager.DSNodeEdit=function(NewNodeInfo,callback){
        //OldName:原名称,NewName:新名称,Parent:父节点,Key:当前Key
        //NewNodeInfo.Parent:父节点信息(.NET存放父文件夹路径，JAVA存放父文件夹ID,根节点为"")
        var jsondata={
            "action":"update",
            "parentnodename":NewNodeInfo.Key,
            "nodename":NewNodeInfo.NewName,
            "oldnodename":NewNodeInfo.OldName,
            "parentnodeid":NewNodeInfo.Parent,
            "oldnodeid":NewNodeInfo.Key
        };
        jsondata=JSON.stringify(jsondata)
        Agi.DAL.ReadData({ "MethodName":"DSNodeManager", "Paras": jsondata, "CallBackFunction": function (_result) {
            callback(_result);
        }});
    }
    //Datasets文件夹删除
    Agi.DatasetsManager.DSNodeDel=function(NodeInfo,callback){
        //NodeInfo.Value:文件夹唯一标识(.NET存放文件夹路径，JAVA存放文件夹ID,根节点为"")
        var jsondata={
            "action":"delete",
            "nodename":NodeInfo.Value,
            "nodeid":NodeInfo.Value
        };
        jsondata=JSON.stringify(jsondata)
        Agi.DAL.ReadData({ "MethodName":"DSNodeManager", "Paras": jsondata, "CallBackFunction": function (_result) {
            callback(_result);
        }});
    }
    //Datasets移动到分组文件夹
    Agi.DatasetsManager.DSNodeMove=function(NodeMoveInfo,callback){
        //NodeMoveInfo.DataSetsKey:Datasets唯一标标识
        //NodeMoveInfo.ParentKey:移动到的目标分组文件夹唯一标标识
        var jsondata={
            "datasetid":NodeMoveInfo.DataSetsKey,
            "parentpath":NodeMoveInfo.ParentKey,
            "parentid":NodeMoveInfo.ParentKey
        };
        jsondata=JSON.stringify(jsondata);
        Agi.DAL.ReadData({ "MethodName":"DSNodeMove", "Paras": jsondata, "CallBackFunction": function (_result) {
            callback(_result);
        }});
    }
    //Datasets移动到分组文件夹
    Agi.DatasetsManager.DSGroupMove=function(NodeMoveInfo,callback){
        //NodeMoveInfo.GroupKey:Group唯一标标识
        //NodeMoveInfo.ParentKey:移动到的目标分组文件夹唯一标标识
        var jsondata={
            "groupfrom":NodeMoveInfo.Key,
            "groupto":NodeMoveInfo.Parent,
            "groupid":NodeMoveInfo.Key,//首钢使用字段
            "parentid":NodeMoveInfo.Parent//首钢使用字段
        };
        jsondata=JSON.stringify(jsondata);
        Agi.DAL.ReadData({ "MethodName":"DSGroupMove", "Paras": jsondata, "CallBackFunction": function (_result) {
            callback(_result);
        }});
    }
})();