/*
编写人：鲁佳   
编写时间：2012-08-26
描述：数据统一访问方法
修改:markeluo
说明:JAVA Webservice 为了能让js进行跨域请求返回数据，采用Servlet方式,前端JS 进行相应的调整
参数：{ "MethodName":"sava","Paras":"json字符串","CallBackFunction":回调方法 }
*/

Namespace.register("Agi.DataAccessLayer");

Agi.DataAccessLayer.DataManage = function () {
    this.url = null;
    this.isEncrypt = true;
    this.ReadData = function (objcet) {
        var self=this;
        if (objcet.Paras !=null) {
            if(self.isEncrypt){
                objcet.Paras = base64encode(objcet.Paras);  //加密
            }
        }
        this.url = WebServiceAddress + "/" + objcet.MethodName;
        if (Agi.WebServiceConfig.Type == ".NET") {
            this.NetDispose(objcet);
        }
        else {
            this.JavaDispose(objcet);
        }
    }

    //.net处理方式
    this.NetDispose = function (objcet) {
        var self=this;
        if (objcet.MethodName != "VSFileSave" && objcet.MethodName != "DSTestData" && objcet.MethodName != "DSReadData" && objcet.MethodName != "DSSave"
            && objcet.MethodName != "VTSave" && objcet.MethodName != "VTGetDataBySql" && objcet.MethodName != "RCal4MR_Plot" && objcet.MethodName != "RPSave"
            && objcet.MethodName != "RCalBoxplot" && objcet.MethodName != "RCalHistogram" && objcet.MethodName != "RCalMeanRange"
            && objcet.MethodName != "RCalNormalDis" && objcet.MethodName != "RCalProcessCap" && objcet.MethodName != "RCalProcessPer"
            && objcet.MethodName != "RCalIVPlot" && objcet.MethodName != "RCalMeanSDPlot" && objcet.MethodName != "VTQueryScMethod" && objcet.MethodName != "VTSaveScMethodInfo"
            && objcet.MethodName != "VSFileReadByID" && objcet.MethodName != "RPDelete"
            ) {
            //图片资源中  图片的重命名和删除专用
            if (objcet.MethodName == "ImageReName" || objcet.MethodName == "ImageDelete") {
                $.ajax({
                    type: "POST",
                    url: this.url,
                    dataType: "jsonp",
                    data: { "jsonData": objcet.Paras },
                    success: function (_result) {
                        if(self.isEncrypt){
                            _result = JSON.parse(base64decode(_result)); //解密
                        }else{
                            _result = JSON.parse(_result); //解密
                        }
                        objcet.CallBackFunction(_result, object.ClientParas);
                    },
                    error: function (_result) {
                        if(self.isEncrypt){
                            _result = JSON.parse(base64decode(_result));
                        }else{
                            _result = JSON.parse(_result);
                        }
                        objcet.CallBackFunction(_result);
                    }
                });
                return;
            }

            $.ajax({
                type: "POST",
                url: this.url,
                dataType: "jsonp",
                data: { "jsonData": objcet.Paras },
                success: function (_result) {
                    if(self.isEncrypt){
                        _result = JSON.parse(base64decode(_result)); //解密
                    }else{
                        _result = JSON.parse(_result); //解密
                    }
                    objcet.CallBackFunction(_result);
                },
                error: function (_result) {
                    if(self.isEncrypt){
                        _result = JSON.parse(base64decode(_result)); //解密
                    }else{
                        _result = JSON.parse(_result); //解密
                    }
                    objcet.CallBackFunction(_result);
                }
            });
        }
        else {
            /* jquery1.7.2 post提交方式 */
            $.post(
                this.url,
                { "jsonData": objcet.Paras },
                function (_result) {
                    if(self.isEncrypt){
                        _result = JSON.parse(base64decode(_result)); //解密
                    }else{
                        _result = JSON.parse(_result); //解密
                    }
                    objcet.CallBackFunction(_result);
                },
                "json");
        }
    }

//    //java处理方式
//    this.JavaDispose = function (objcet) {
//        $.ajax({
//            type: "POST",
//            contentType: "text/xml",
//            url: WebServiceAddress,
//            data: this.getPostData(objcet.MethodName, objcet.Paras), //这里不该用JSON格式
//            dataType: 'xml', //这里设成XML或者不设。设成JSON格式会让返回值变成NULL
//            success: function (xml) {
//                //对结果做XML解析。
//                //浏览器判断 (IE和非IE完全不同)
//                if ($.browser.msie) {
//                    objcet.CallBackFunction(JSON.parse(xml.getElementsByTagName("ns1:out")[0].childNodes[0].nodeValue));
//                    // $("#result").append(xml.getElementsByTagName("ns1:out")[0].childNodes[0].nodeValue + "<br/>");
//                }
//                else {
//                    $(xml).find("out").each(function () {
//                        // $("#result").append($(this).text() + "<br/>");
//                        if($(this).text()===""){
//                            objcet.CallBackFunction(null);
//                        }else{
//                            objcet.CallBackFunction(JSON.parse(base64decode($(this).text())));
//                        }
//                    })
//                }
//            },
//            error: function (x, e) {
//                alert('error:' + x.responseText);
//            },
//            complete: function (x) {
//                //alert('complete:'+x.responseText);
//            }
//        });
//    }
//
//    this.getPostData = function (MethodName, Paras) {
//        //根据WSDL分析sayHelloWorld是方法名，parameters是传入参数名
//        var postdata = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
//        postdata += "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">";
//        postdata += "<soap:Body><" + MethodName + " xmlns=\"http://tempuri.org/\">";
//        if (Paras != null) {
//            postdata += "<parameters>" + Paras + "</parameters>";
//        }
//        postdata += "</" + MethodName + "></soap:Body>";
//        postdata += "</soap:Envelope>";
//        return postdata;
//    }

    //20130627 markeluo 新增 java跨域处理方式
    this.JavaDispose = function (objcet) {
        var self=this;
        objcet.MethodName=objcet.MethodName.substr(0,1).toLowerCase()+objcet.MethodName.substr(1);
        if(objcet.Paras==null){
            objcet.Paras="";
        }
        var Dataobj={
            methodName:objcet.MethodName,
            parameters:objcet.Paras
        }
//        //数据模拟
//        switch(Dataobj.methodName){
//            case "vSFileReadByID":
//                objcet.CallBackFunction(Pageresultdata);
//                break;
//            case "dSReadData":
//                objcet.CallBackFunction(DSData);
//                break;
//            case "rCalIVPlot":
//                objcet.CallBackFunction(RplotData);
//                break;
//        }

        if (objcet.MethodName != "vSFileSave") {
            $.ajax({
                type: "POST",
                url:WebServiceAddress,
                dataType: "jsonp",
                data:Dataobj,
                success: function (_result) {
                    if(self.isEncrypt){
                        _result=base64decode(_result);
                    }
                    objcet.CallBackFunction(JSON.parse(_result));
                },
                error: function (_result) {
                    if(self.isEncrypt){
                        _result=base64decode(_result);
                    }
                    _result = JSON.parse(_result); //解密
                    objcet.CallBackFunction(_result);
                }
            });
        }else{
            $.post(
                WebServiceAddress ,
                Dataobj,
                function (_result) {
                    if(_result.substr(0,9)=="callBack("){
                        _result=_result.substring(_result.indexOf("callBack('")+10,_result.lastIndexOf("')"));
                    }
                    if(self.isEncrypt){
                        _result=base64decode(_result);
                    }
                    objcet.CallBackFunction(JSON.parse(_result));
                },"text");
        }
    }
    //20130920 markeluo JAVA 特殊处理，不加密解密
    this.JAVAPostManager=function(object){
        object.MethodName=object.MethodName.substr(0,1).toLowerCase()+object.MethodName.substr(1);
        if(object.Paras==null){
            object.Paras="";
        }
        var Dataobj={
            methodName:object.MethodName,
            parameters:object.Paras
        }
        $.post(
            WebServiceAddress ,
            Dataobj,
            function (_result) {
                if(_result.substr(0,9)=="callBack("){
                    _result=_result.substring(_result.indexOf("callBack('")+10,_result.lastIndexOf("')"));
                }
                object.CallBackFunction(JSON.parse(_result));
            },"text");
    }
}

Agi.DAL = new Agi.DataAccessLayer.DataManage();

Namespace.register("Agi.Utility");
Agi.Utility.RequestData = function (entity, callback, option) {
    var self = this;
    self.options = {
        url:WebServiceAddress,
        method:"DSReadData"
    };
    for (name in option) {
        self.options[name] = option[name];
    }

    var jsonData = {
        "datasetID":"TEST",
        "param":[
            { "key":"begindate", "value":"2012-07-08" },
            { "key":"enddate", "value":"2012-07-15"}
        ]
    };
    jsonData.datasetID = entity.Key;
    jsonData.param = [];
    $(entity.Parameters).each(function (i, p) {
        jsonData.param.push({key:p.Key, value:p.Value});
    });
    if (!entity.Parameters.length) {
        jsonData.param = [];
    }
    var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
    Agi.DAL.ReadData({
        "MethodName":self.options.method,
        "Paras":jsonString, //json字符串
        "CallBackFunction":function (result) {     //回调函数
            //alert(result.message);
            if (result.result) {
                var data = result.Data ? result.Data : [];
                callback(data);
            } else {
                callback([]);
            }
        }
    });
}
Agi.Utility.RequestData2 = function (entity, callback, option) {
    var self = this;
    self.options = {
        url:WebServiceAddress,
        method:"DSReadData"
    };
    for (name in option) {
        self.options[name] = option[name];
    }

    var jsonData = {
        "datasetID":"TEST",
        "param":[
            { "key":"begindate", "value":"2012-07-08" },
            { "key":"enddate", "value":"2012-07-15"}
        ]
    };
    jsonData.datasetID = entity.Key;
    jsonData.param = [];
    $(entity.Parameters).each(function (i, p) {
        jsonData.param.push({key:p.Key, value:p.Value});
    });
    if (!entity.Parameters.length) {
        jsonData.param = [];
    }
    var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
    Agi.DAL.ReadData({
        "MethodName":self.options.method,
        "Paras":jsonString, //json字符串
        "CallBackFunction":function (result) {     //回调函数
            if(result.Columns){}else{
                if(result.Data!=null && result.Data.length>0){
                    var _Columns=[];
                    for (var _param in result.Data[0]) {
                        _Columns.push(_param);
                    }
                    result={
                        result:result.result,
                        Data:result.Data,
                        message:result.message,
                        Columns:_Columns
                    }
                }
            }
            callback(result);
        }
    });
}
Agi.Utility.RequestDataByPage = function (entity,page,pagesize,callback, option) {
    var self = this;
    self.options = {
        url: WebServiceAddress,
        method: "DSReadDataByPage"
    };
    for (var name in option) {
        self.options[name] = option[name];
    }

    var jsonData = {
        "datasetID": "TEST",
        "param": [
            { "key": "begindate", "value": "2012-07-08" },
            { "key": "enddate", "value": "2012-07-15" }
        ]
    };
    jsonData.datasetID = entity.Key;
    jsonData.pageLimit=pagesize;
    jsonData.pageNum=page;
    jsonData.param = [];
    $(entity.Parameters).each(function (i, p) {
        jsonData.param.push({ key: p.Key, value: p.Value });
    });
    if (!entity.Parameters.length) {
        jsonData.param = [];
    }
    var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
    Agi.DAL.ReadData({
        "MethodName": self.options.method,
        "Paras": jsonString, //json字符串
        "CallBackFunction": function (result) {     //回调函数
            if (result.Columns) { } else {
                if (result.Data != null && result.Data.length > 0) {
                    var _Columns = [];
                    for (var _param in result.Data[0]) {
                        _Columns.push(_param);
                    }
                    result.Columns =_Columns;
                }
            }
            callback(result);
        }
    });
};

