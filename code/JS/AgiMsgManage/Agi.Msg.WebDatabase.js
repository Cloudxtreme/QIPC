/*
编写人:鲁佳
创建时间：2012-06-15
描      述  : 本地数据+本地存储
参数说明：dbName:数据库名称
dbVersion:版本号
dbDisplayName:显示名称
dbEstimatedSize：数据库大小
example:  (1)创建数据库
var MyDB = FrameWork_CreateDatabase('WebDB', '1.0', 'MyDB', 2 * 1024 * 1024);
(2)执行数据库操作 增，删，改
MyDB.ExecSql("insert into 表名 values(参数)");
(3)执行查询
MyDB.QuerySql("select * from 表名",CallBack);  //CallBack:回调函数

本地存储：和以前的cookie用法一样。
                   
*/
Namespace.register("Agi.Msg");
Agi.Msg.DataBaseManage=function(dbName, dbVersion, dbDisplayName, dbEstimatedSize) {
    var obj = this;
    this.db = openDatabase(dbName, dbVersion, dbDisplayName, dbEstimatedSize);
    obj.db.transaction(function (tx) {
//        tx.executeSql("drop table EntityData");
        tx.executeSql("create table EntityData(key ,value,paras)");
    });
    this.QuerySql = function (StrSql, EntityName,paras, CallBack) {
        obj.db.transaction(function (tx) {
            tx.executeSql(StrSql, [], function (tx, result) {
                eval(CallBack)(result, EntityName,paras);
            },
             function (trans, error) {
                 throw error.message;
                 alert(error.message);
             }
            );
        });
    }
    this.ExecSql = function (StrSql) {
        obj.db.transaction(function (tx) {
            tx.executeSql(StrSql);
        });
    }
}

// -----------------------------------------Web Storage本地存储-------------------------------------------
Agi.Msg.StorageInfo = function () {
    this.StorageSave = function (key, value) {
        return window.localStorage.setItem(key, value);
    }

    this.StorageGet = function (key) {
        return window.localStorage.getItem(key);
    }

    this.StorageRemove = function (key) {
        window.localStorage.removeItem(key);
    }

    this.StorageClearAll = function () {
        window.localStorage.clear();
    }
}
// -----------------------------------------Web Storage End-------------------------------------------

//手动更新缓存
function FrameWork_UpDateCache() {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        window.applicationCache.update();
    }
}

//检查是否在线
function FrameWork_IsOnline() {
    return navigator.onLine ? true : false;
}
Agi.Msg.DBManage = new Agi.Msg.DataBaseManage();
Agi.Msg.StorageManage = new Agi.Msg.StorageInfo();