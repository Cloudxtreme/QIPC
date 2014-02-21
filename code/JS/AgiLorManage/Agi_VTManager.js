///<reference path="../jquery.min.js" />
(function () {
    //����ռ�
    Namespace.register("Agi.VTManager");
    var webserviceUrl = "http://192.168.1.9/Agi_webserivce/Service1.asmx";
    /**
    * Created with JetBrains WebStorm.
    * User: luopeng
    * Date Time: 2012-08-14 16:21:52
    * To change VTSave ,VTDelete,VTGetVirtualTableByDS,VTGetDataBySql,VTGetTableDetailsByDS
    * Virtual Table Manager ��������
    */
    Agi.VTManager.VTSave = function (_action, _vtName, _dataSourceName, _vtCreatType, _sqlString, _para, _schema, _data1, _dbType, _specification, callback) {
        /// <summary>����?��</summary>
        /// <param name="_action" type="String">����״̬��save/update</param>
        /// <param name="_vtName" type="String">��������</param>
        /// <param name="_dataSourceName" type="String">���Դ���</param>
        /// <param name="_vtCreatType" type="String">�Զ�������</param>
        /// <param name="_sqlString" type="String">SQL���</param>
        /// <param name="_para" type="[]">��Ҫ��ֵ���ֶ�</param>
        /// <param name="_schema" type="[]">��ѯ������</param>
        /// <param name="_data1" type="String">Ԥ���ֶ�</param>
        /// <param name="callback" type="String">�ص�ֵ</param>
        var jsonData = {
            "action": _action,
            "data": {
                "vtName": _vtName,
                "dataSourceName": _dataSourceName,
                "vtCreateType": _vtCreatType,
                "sqlString": _sqlString,
                "para": _para,
                "schema": _schema,
                "data1": _data1,
                dbType: _dbType,
                "specification": _specification //20121224 16:53 markeluo 创建虚拟表时添加备注信息
            }
        };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "VTSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.VTManager.VTDelete = function (_dataSourceName, _vtName, callback) {
        /// <summary>�����ɾ��</summary>
        /// <param name="_dataSourceName" type="String">���Դ���</param>
        /// <param name="_vtName" type="String">��������</param>
        /// <param name="callback" type="String">�ص�ֵ</param>
        var jsonData = {
            "action": "delete",
            "dataSourceName": _dataSourceName,
            "vtName": _vtName
        };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "VTDelete", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.VTManager.VTGetVirtualTableByDS = function (_dataSourceName, callback) {
        /// <summary>������Դ��ƻ�ȡ���еı�׼�����</summary>
        /// <param name="_dataSourceName" type="String">���Դ���</param>
        /// <param name="callback" type="String">�ص�ֵ</param>
        var jsonData = {
            "dataSourceName": _dataSourceName
        };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "VTGetVirtualTableByDS", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    function returnjsonString(jsonData, callback) {
        /// <summary>ת��json</summary>
        /// <param name="jsonData" type="String">����ת�������</param>
        return JSON.stringify(jsonData);
    }
    Agi.VTManager.VTGetDataBySql = function (_dataSourceName, _sql, _count, callback) {
        /// <summary>������ԴID��sql��䡢ǰ����������ȡ���������</summary>
        var jsonData = {
            "dataSourceName": _dataSourceName,
            "sql": _sql,
            "count": _count
        };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "VTGetDataBySql", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
    Agi.VTManager.VTGetTableDetailsByDS = function (_dataSourceName, _vtName, callback) {
        /// <summary>������ԴID���������ƻ�ȡ�������ϸ��Ϣ</summary>
        var jsonData = {
            "dataSourceName": _dataSourceName,
            "vtName": _vtName
        };
        var jsonString = returnjsonString(jsonData);
        Agi.DAL.ReadData({ "MethodName": "VTGetTableDetailsByDS", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.VTManager.SCVTAllEntitys = function (callback) {
        //��ȡ���л�����Դʵ��
        Agi.DAL.ReadData({ "MethodName": "VTAllEntitys", "Paras": null, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.VTManager.SCVTGetScMethodInfoEx = function (_dataSourceName, callback) {
        //��ȡĳһʵ��������ScDefined�������б�
        var jsonData = {
            "dataSourceName": _dataSourceName
        };
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VTGetScMethodInfoEx", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.VTManager.SCVTGetScMethodInfo = function (_dataSourceName, _dtName, callback) {
        //��ȡĳһʵ��������ScDefined�������б�
        var jsonData = {
            "dataSourceName": _dataSourceName,
            "entityName": _dtName
        };
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VTGetScMethodInfo", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.VTManager.SCVTDeleteScMethodInfo = function (_dataSourceName, _SCVTName, callback) {
        //ɾ����ʵ��
        var jsonData = {
            "action": "Delete",
            "dataSourceName": _dataSourceName,
            "entityName": _SCVTName
        };
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VTSaveScMethodInfo", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.VTManager.SCVTReadMethodParams = function (_dbinfos, callback) {
        //��ȡָ��ʵ�����������
        var jsonData = {
            "dbinfos": _dbinfos
        };
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VTReadMethodParams", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.VTManager.SCVTSaveScMethodInfo = function (_DataSourceName, _entityName, _MethodInfo, _Relation, _Column, _Para, _Schema, _Specification, callback) {
        //�����������
        var jsonData = {
            "action": "Insert",
            "dataSourceName": _DataSourceName,
            "entityName": _entityName,
            "MethodInfos":
                {
                    "MethodInfo": _MethodInfo
                },
            "Relations":
               {
                   "Relation": _Relation
               },
            "Columns":
                {
                    "Column": _Column
                },
            "Para": _Para,
            "Schema": _Schema,
            "Specification": _Specification
        }
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VTSaveScMethodInfo", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.VTManager.SCVTUpdateScMethodInfo = function (_DataSourceName, _entityName, _MethodInfo, _Relation, _Column, _Para, _Schema, _Specification, callback) {
        //�޸Ļ�������
        var jsonData = {
            "action": "Update",
            "dataSourceName": _DataSourceName,
            "entityName": _entityName,
            "MethodInfos":
                {
                    "MethodInfo": _MethodInfo
                },
            "Relations":
               {
                   "Relation": _Relation
               },
            "Columns":
                {
                    "Column": _Column
                },
            "Para": _Para,
            "Schema": _Schema,
            "Specification": _Specification
        }
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VTSaveScMethodInfo", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
//根据数据源名称获取所有的存储过程
    Agi.VTManager.SP_GetDatabaseProcedures = function (_dataSourceName, callback) {
        var jsonData = {
            "datasource": _dataSourceName
        };
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "SP_GetDatabaseProcedures", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
//根据数据源名称，存储过程名称获取存储过程参数
    Agi.VTManager.SP_GetProcedureParams = function (_dataSourceName, _proName, callback) {
        var jsonData = {
            "datasource": _dataSourceName,
            "proc": _proName
        };
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "SP_GetProcedureParams", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
//生成语句并查询
    Agi.VTManager.SP_QueryProcedureData = function (_dataSourceName, _proName, _paras,_count, callback) {
        var jsonData = {
            "datasource": _dataSourceName,
            "proc": _proName,
            "paras": _paras,
            "count": _count
        };
        var jsonString = returnjsonString(jsonData);

        Agi.DAL.ReadData({ "MethodName": "SP_QueryProcedureData", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
}
//获取数据源下的存储过程虚拟表
Agi.VTManager.SP_GetSptable = function (_dataSourceName,callback) {
    var jsonData = {
        "datasource": _dataSourceName
    };
    var jsonString = returnjsonString(jsonData);

    Agi.DAL.ReadData({ "MethodName": "SP_GetSptable", "Paras": jsonString, "CallBackFunction": function (_result) {
        callback(_result);
    }
    });
}

//删除存储过程虚拟表
Agi.VTManager.SP_DeleteSpMethodInfo = function (_dataSourceName, _proVTName,callback) {
    var jsonData = {
        "action":"Delete",
        "datasource": _dataSourceName,
        "vtable": _proVTName,
        "specification": "",
        "procname":"",
        "paras":[],
        "schema":[]
    };
    var jsonString = returnjsonString(jsonData);

    Agi.DAL.ReadData({ "MethodName": "SP_SaveSpMethodInfo", "Paras": jsonString, "CallBackFunction": function (_result) {
        callback(_result);
    }
    });
}

//根据数据源名称，虚拟表名称获取详细信息
Agi.VTManager.SP_GetTableDetails = function (_dataSourceName, _proName, callback) {
    var jsonData = {
        "datasource": _dataSourceName,
        "vtable": _proName
    };
    var jsonString = returnjsonString(jsonData);

    Agi.DAL.ReadData({ "MethodName": "SP_GetTableDetails", "Paras": jsonString, "CallBackFunction": function (_result) {
        callback(_result);
    }
    });
}

//保存和修改存储过程虚拟表
//删除存储过程虚拟表
Agi.VTManager.SP_OperationSpMethodInfo = function (_action, _dataSourceName, _proVTName, _specification, _procname, _paras,_schema,callback) {
    var jsonData = {
        "action": _action,
        "datasource": _dataSourceName,
        "vtable": _proVTName,
        "specification": _specification,
        "procname": _procname,
        "paras": _paras,
        "schema":_schema
    };
    var jsonString = returnjsonString(jsonData);

    Agi.DAL.ReadData({ "MethodName": "SP_SaveSpMethodInfo", "Paras": jsonString, "CallBackFunction": function (_result) {
        callback(_result);
    }
    });
}


})();
