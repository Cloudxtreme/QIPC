/*
编写人：鲁佳   
编写时间：2012-08-26
描述：数据统一访问方法
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

        if (objcet.MethodName != "vSFileSave" && objcet.MethodName != "sPC_VSFileSave"  &&  objcet.MethodName != "htmlToExcel"
            && objcet.MethodName !="dSTestData" && objcet.MethodName != "dSReadData" && objcet.MethodName != "dSSave"
            && objcet.MethodName != "vTSave"  && objcet.MethodName != "dSReadDataByPage") {
            if(objcet.MethodName == "DSReadDataByPage"){
                //分页数据获取测试
                var TestData={
                    "result":"true",
                    "pageLimit":9,//每页显示记录数
                    "pageNum":1,//当前页码
                    "totalRows":15,//总记录数
                    "totalPages":2,//总页数
                    "Data":[
                        {"MID_CLASS":"管线钢","MID_AVLUE":45,"MID_MAX":30,"MID_MIn":22},
                        {"MID_CLASS":"汽车板","MID_AVLUE":15,"MID_MAX":22,"MID_MIn":25},
                        {"MID_CLASS":"管线钢","MID_AVLUE":22,"MID_MAX":30,"MID_MIn":15},
                        {"MID_CLASS":"汽车板","MID_AVLUE":35,"MID_MAX":16,"MID_MIn":30},
                        {"MID_CLASS":"管线钢","MID_AVLUE":16,"MID_MAX":36,"MID_MIn":16},
                        {"MID_CLASS":"管线钢","MID_AVLUE":51,"MID_MAX":51,"MID_MIn":36},
                        {"MID_CLASS":"汽车板","MID_AVLUE":36,"MID_MAX":35,"MID_MIn":35},
                        {"MID_CLASS":"管线钢","MID_AVLUE":40,"MID_MAX":30,"MID_MIn":30},
                        {"MID_CLASS":"汽车板","MID_AVLUE":35,"MID_MAX":40,"MID_MIn":25},
                    ],
                    "message":"获取数据成功"
                }
                objcet.CallBackFunction(TestData);
			
			//20140308 Call_qpcPageLoad方法测试
//			if(objcet.MethodName == "Call_qpcPageLoad"){
//				//WebService_Jurisdiction.js.Call_qpcPageLoad方法回调测试
//				var TestData={
//					 "result":"true/false",
//					 "message":"成功/失败",
//					"showTopButton":
//						[{"items":"database_plus","state":"1"},
//							{"items":"virtual","state":"1"},
//							{"items":"dataset","state":"1"},
//							{"items":"dashboardspc","state":"1"}],
//					"showLeftButton":
//						[{"items":"DrawerMenu_Group","state":"1"},
//							{"items":"DrawerMenu_ReAndR","state":"1"},
//							{"items":"AddVTManage","state":"1"},
//							{"items":"DrawerMenu_MyDataSets","state":"1"},
//							{"items":"DrawerMenu_PageManage","state":"1"},
//							{"items":"DrawerMenu_ResourceManage","state":"1"}],
//					"showRightButton":
//						[{"items":"MainDatasourceDiv","state":"1"},
//							{"items":"MainVirtualtableDiv","state":"1"},
//							{"items":"MainDatasetsDiv","state":"1"},
//							{"items":"MainSPCPageDiv","state":"1"},
//							{"items":"MainSourceDiv","state":"1"}],
//					"showEditPagLeftButton":
//						[{"items":"EpDrawerMenu_RealTimeDataSource","state":"1"},
//							{"items":"EpDrawerMenu_Dataset","state":"1"}]
//					};
//				objcet.CallBackFunction(TestData);
            }else{
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
            }
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

Namespace.register("Agi.RightsManagement");
Agi.RightsManagement.UserRights=function(){
    //用户登录信息
    this.UserInfo={
        card:"",
        sessionid:""
    }
    //用户登录信息初始化
    this.Init=function(){
        this.UserInfo.card=GetUrlParas("card");
        this.UserInfo.sessionid=GetUrlParas("ssid");
        //存入cookie
        document.cookie="card="+escape(this.UserInfo.card);
        document.cookie="sessionId="+escape(this.UserInfo.sessionid);
    }
    //获取cookie中参数
    this.getCookie=function(cookieName){
        var cookieContent = '';
        var cookieAry = document.cookie.split(";");//得到Cookie数组
        for(var i=0;i<cookieAry.length;i++){
            var temp = cookieAry[i].split("=");
            if(temp[0] == cookieName){
                cookieContent = unescape(temp[1]);
            }
        }
        return cookieContent;
    }
    //获取url参数
    this.GetUrlParas=function(param) {
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
}