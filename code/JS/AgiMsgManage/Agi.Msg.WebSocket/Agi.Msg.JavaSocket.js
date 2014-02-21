/*
 编写人：鲁佳
 描述：javasocket处理类
 修改人：刘文川
 时间：2012-09-19，17:44
 */

AgiJavaSocket = function () {
    this.AlchemyChatServer = {};
    //connection server
    this.WSOpenConnection = function (jsonInfo) {
        this.AlchemyChatServer = new Alchemy({
//            Server: jsonInfo.Ip,
//            Port: jsonInfo.Port
        });

        //close
        this.AlchemyChatServer.Disconnected = function (event) {
            //alert("与服务端建立连接失败");
        };

        //open
        this.AlchemyChatServer.Connected = function (event) {
            WorkerLog("socket连接成功");
            WorkerPointsManage.IsSocketOpen = true;
        };

        //post data
        this.AlchemyChatServer.MessageReceived = function (event) {
            //接收到数据处理
        };

        this.AlchemyChatServer.Start();

        return this.AlchemyChatServer;
    }

    this.Send = function (jsonObj) {
        WorkerLog("注册");
        //var data = { Type: 1, Message: message };
        //this.AlchemyChatServer.Send(data);
    }
}
JavaSocketManage = new AgiJavaSocket();