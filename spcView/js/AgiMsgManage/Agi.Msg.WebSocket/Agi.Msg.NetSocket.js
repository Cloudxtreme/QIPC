/*
 编写人：鲁佳
 描述：.netsocket处理类
 修改人：刘文川
 时间：2012-09-19，17:44
 */

AgiNetSocket = function () {
    var sessionID = ""; //预设SessionID JAVAWebSocket连接注册用
    this.AlchemyChatServer = {};
    //connection server
    this.WSOpenConnection = function (jsonInfo, callback) {
        WorkerLog("实例化Sockt，参数:" + JSON.stringify(jsonInfo));
        this.AlchemyChatServer = new WorkerAlchemyManage.alchemy({
            Server: jsonInfo.Ip,
            Port: jsonInfo.Port,
            sessionID: NetSocketManage.GetGuid(),
            JavaUrl: jsonInfo.JavaUrl,
            ServerModel: WebServiceConfigType,
            Action: 'chat',
            DebugMode: false
        });

        //close
        this.AlchemyChatServer.Disconnected = function (event) {
            WebSocketManage.IsSocketOpen = false;
            WebSocketManage.SocketState = "断开";  //2013-01-10
            WorkerLog("与服务端建立连接失败");
        };

        //open
        this.AlchemyChatServer.Connected = function (event) {
            WebSocketManage.IsSocketOpen = true;
            WebSocketManage.SocketState = "连接成功"; //2013-01-10
            ResultIsSocketOpen();
            if (callback != null) {
                callback();
            }
        };

        //post data
        this.AlchemyChatServer.MessageReceived = function (event) {
            //接收到数据处理
            try {
                var ReturnData = JSON.parse(event.data);
                //WorkerLog(JSON.stringify(ReturnData));
                if (WebServiceConfigType == "JAVA") {
                    if (ReturnData.actionType > 3) {
                        //错误消息
                        WorkerLog("返回值无法识别");
                    }
                    else if (ReturnData.actionType == 2) {  //正常消息
                        ResultValue(CreateNewJson(ReturnData.data));
                    }
                }
                else if (WebServiceConfigType == ".NET") {
                    if (ReturnData.Type > 3) {
                        //错误消息
                        WorkerLog("返回值无法识别");
                    }
                    else if (ReturnData.Type == 2) {  //正常消息
                        ResultValue(CreateNewJson(ReturnData.Data.Message));
                    }
                }
                else {
                    WorkerLog("无法识别的连接模式,请确定配置是否为.NET或JAVA(大小写敏感)");
                }
            }
            catch (e) { throw e; }
        };

        this.AlchemyChatServer.Start();

        return this;
    }

    //注册
    this.msgSend = function (data) {
        if (WebServiceConfigType == ".NET") {
            this.AlchemyChatServer.Send(data);
        }
        else if (WebServiceConfigType == "JAVA") {
            if (typeof data == "string") {
                data = JSON.parse(data);
            }
            data.actionType = "0";
            data.sessionID = NetSocketManage.GetGuid();
            WorkerLog("格式处理:" + JSON.stringify(data));
            this.AlchemyChatServer.Send(JSON.stringify(data));
            WorkerLog("注册点位结束:" + JSON.stringify(data));
        }
        else {
            WorkerLog("无法识别的连接模式,请确定配置是否为.NET或JAVA(大小写敏感)");
        }
    }

    //关闭
    this.SocketClose = function () {//2013-01-10
        try {
            this.AlchemyChatServer.Stop();
            WebSocketManage.IsSocketOpen = false;
            WebSocketManage.SocketState = "断开";
        } catch (e) { } 
    }

    this.GetGuid = function () {
        if (sessionID === "") {
            sessionID = this.GUID();
        }
        return sessionID;
    }

    this.GUID = function () {
        var ThisRandomValue = parseInt(1000 * Math.random());
        var ID = new Date().getMilliseconds().toString() + ThisRandomValue;
        return ID;
    }
}
NetSocketManage = new AgiNetSocket();