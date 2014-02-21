/*
 编写人：鲁佳
 描述：socket管理类
 修改人：刘文川
 时间：2012-09-19，17:44
 */

AgiWebSocket = function () {
    this.NetSocket = null;
    this.JavaSocket = null;
    this.IsSocketOpen = false;   //socket连接是否打开
    this.SocketState = "断开";   //连接成功，断开，连接中
    this.ConnOpen = function (callback) {
        if (WebServiceConfigType == ".NET" || WebServiceConfigType == "JAVA") {
            if (this.SocketState == "断开") { //2013-01-10
                WorkerLog("打开连接");
                //SocketAddressInfo.sessionID="111";
                WorkerLog("打开连接，参数：" + JSON.stringify(SocketAddressInfo));
                this.SocketState = "连接中"; //2013-01-10
                this.NetSocket = NetSocketManage.WSOpenConnection(SocketAddressInfo, callback);
            }
        }
        else {
            //this.JavaSocket();
            WorkerLog("无法识别的连接模式,请确定配置是否为.NET或JAVA(大小写敏感)");
        }
    }

    this.MsgSend = function (jsonData) {
        if (WebServiceConfigType == ".NET" || WebServiceConfigType == "JAVA") {
            this.NetSocket.msgSend(jsonData);
            WorkerPointsManage.ClearRegData(); //清楚发送数据JSON模板结构中的Message
        }
        else {
            //this.JavaSocket();
            WorkerLog("无法识别的连接模式,请确定配置是否为.NET或JAVA(大小写敏感)");
        }
    }
}
WebSocketManage = new AgiWebSocket();