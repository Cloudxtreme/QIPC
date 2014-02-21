///<reference path="../jquery.min.js" />
(function () {
    //命名空间
    Namespace.register("Agi.BgImageManage");

    Agi.BgImageManage.AllBackgroundImg = function (callback) {
        /// <summary>获取所有图片</summary>
        var jsonData = { "type": "image" };

        var jsonString = JSON.stringify(jsonData);

        Agi.DAL.ReadData({ "MethodName": "VSGetResources", "Paras": jsonString, "CallBackFunction": function (_result) {
            callback(_result);
        }
        });
    }
})();