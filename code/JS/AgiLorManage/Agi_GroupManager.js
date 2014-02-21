(function () {
    //命名空间
    Namespace.register("Agi.GroupManager");

    Agi.GroupManager.RGDelete = function (_rtdbID, _groupID, callback) {
        /// <summary>group删除</summary>
        var jsonData = {
                "rtdbID": _rtdbID,
                "groupID": _groupID
        };
        var jsonString = JSON.stringify(jsonData);
        Agi.DAL.ReadData({ "MethodName": "RGDelete", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

Agi.GroupManager.RGSave = function (_groupData, callback) {
    /// <summary>group添加</summary>
    var jsonData = {
            "action": "save",
            "data": _groupData
        };

        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "RGSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });

    }

Agi.GroupManager.RGUpdate = function (_groupData, callback) {
    /// <summary>group修改</summary>
        var jsonData = {
            "action": "update",
            "data": _groupData
        };
        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "RGSave", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });

    }
Agi.GroupManager.RGLoad = function (_rtdbID, _parentID, callback) {
    /// <summary>Gruop读取</summary>
        var jsonData = {
            "rtdbID": _rtdbID,
            "ParentID": _parentID
        };
        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "RGLoad", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }

})();