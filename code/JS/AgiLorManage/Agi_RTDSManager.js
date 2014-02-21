(function () {
    //命名空间
    Namespace.register("Agi.RTDSManager");

    Agi.RTDSManager.RtdbGetTagByIPTag = function (_RTDSID, _TagName, callback) {
        /// <summary>根据IP和点位号名称获取点位号信息</summary>
        var jsonData = {
                "rtdbID": _RTDSID,
                "tagName": _TagName
        };
        var jsonString = JSON.stringify(jsonData);
        Agi.DAL.ReadData({ "MethodName": "RtdbGetTagByIPTag", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

    Agi.RTDSManager.RtdbGetHisData = function (_RTDSID, callback) {
        /// <summary>获取历史数据</summary>
        var jsonData = {
                "rtdbID": _RTDSID
        };

        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "RtdbGetHisData", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });

    }

    Agi.RTDSManager.RtdbConnTest = function (_RTDSID, callback) {
        /// <summary>实时数据库是否连通</summary>
        var jsonData = { "rtdbID": _RTDSID };
        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "RtdbConnTest", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });

    }
    Agi.RTDSManager.RtdbSave = function (_RTDSID, _serverIP, _port, _rtdbType, callback) {
        /// <summary>rtdb实时数据源添加</summary>
        var jsonData = {
            "action": "save",
            "rtdbID": _RTDSID,
            "serverIP": _serverIP,
            "port": _port,
            "rtdbType": _rtdbType
        };
        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "RtdbSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
}
Agi.RTDSManager.RtdbUpdate = function (_RTDSID, _serverIP, _port, _rtdbType, callback) {
    /// <summary>rtdb实时数据源添加</summary>
    var jsonData = {
        "action": "update",
        "rtdbID": _RTDSID,
        "serverIP": _serverIP,
        "port": _port,
        "rtdbType": _rtdbType
    };
    var jsonString = JSON.stringify(jsonData);

    Agi.DAL.ReadData({ "MethodName": "RtdbSave", "Paras": jsonString, "CallBackFunction": function (_result) {
        callback(_result);
    }
    });
}
    Agi.RTDSManager.RtdbDelete = function (_RTDSID, callback) {
        /// <summary>rtdb实时数据源删除</summary>
        var jsonData = { "rtdbID": _RTDSID };

        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "RtdbDelete", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

Agi.RTDSManager.RtdbLoad = function (_RTDSID,callback) {
        /// <summary>rtdb实时数据源读取</summary>
            var jsonData = { "rtdbID": _RTDSID };
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({ "MethodName": "RtdbLoad", "Paras": jsonString, "CallBackFunction": function (_result) {
                callback(_result);
            }
            });
    }
    Agi.RTDSManager.DSBAGetAllType = function (callback) {
        /// <summary>获取所有已创建的数据源</summary>
        /// <param name="callback" type="String">回调对象</param>
        Agi.DAL.ReadData({ "MethodName": "DSBAGetAllType", "Paras": null, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
}
Agi.RTDSManager.DSBAGetDataByType = function (typeName, callback) {
    /// <summary>rtdb实时数据源读取</summary>
    var jsonData = { "Type": typeName };
    var jsonString = JSON.stringify(jsonData);
    Agi.DAL.ReadData({ "MethodName": "DSBAGetDataByType", "Paras": jsonString, "CallBackFunction": function (_result) {
        callback(_result);
    }
    });
}
Agi.RTDSManager.DSBAGetDataById = function (typeName,id, callback) {
    /// <summary>rtdb实时数据源读取</summary>
    var jsonData = { "Type": typeName, "ID": id };
    var jsonString = JSON.stringify(jsonData);
    Agi.DAL.ReadData({ "MethodName": "DSBAGetDataById", "Paras": jsonString, "CallBackFunction": function (_result) {
        callback(_result);
    }
    });
}
})();