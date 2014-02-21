/*
编写人：鲁佳
描述：安卓系统socket管理
时间：2012-12-18
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.AndroidSocket = function () {
    //参数：jsonobj="{State:'',Content:{"ControlID":"Panel001","Points":["11ae84101","11ae84102","11ae84103"]}}
    this.socket;
    this.state = "断开";  //状态值：[断开,连接中,连接成功,运行中]
    this._points = null;
    this.androidSocketActionCmd = function (jsonobj) {

    }

    this.androidSocketOpen = function () {      //打开socket连接
        var add = 'http://' + Agi.AndroidSocketAddressInfo.Ip + ":" + Agi.AndroidSocketAddressInfo.Port;
        if (this.state == "断开") {
            this.state = "连接中";
            try {
                this.socket = io.connect(add);
            } catch (e) {
                alert(e)
            }
        }
        this.socket.on('connect', function () {
            //连接成功
            Agi.Msg.AndroidSocketManage.state = "连接成功";
            if (Agi.Msg.AndroidSocketManage._points != null) {
                Agi.Msg.AndroidSocketManage.WSRegisterPoint(Agi.Msg.AndroidSocketManage._points);
            }
        });

        this.socket.on('reconnect', function () {
            //重连
        });
        this.socket.on('reconnecting', function () {
            //重连中....
        });

        //接收数据
        this.socket.on('WSReceiveData', Agi.Msg.AndroidSocketManage.WSReceiveData);

        this.socket.on('error', function () {
            //连接失败
        });
    }

    this.WSRegisterPoint = function (points) {
        try {
            this._points = points;
            if (this.state == "断开") {
                this.androidSocketOpen();
            }
            if (this.state == "连接成功") {
                var data = {
                    "actionType": "0",   //0代表注册点位号
                    "actionMessage": this._points
                };
                this.socket.on("WSRegisterPoint", function (arg1) {
                    Agi.Msg.AndroidSocketManage.state = "运行中";
                });

                this.socket.emit('WSRegisterPoint', data);
            }
        }
        catch (e) {
            alert(e);
        }
    }

    this.WSReceiveData = function (arg0) {
        if (arg0.actionType == 2) {  //正常消息
            Agi.Msg.TriggerManage.SendRealMessage(arg0.data);
            //alert("ArriveTime:" + arg0.data.ArriveTime + ",TagName:" + arg0.data.TagName + ",Value:" + arg0.data.Value);
        }
    }

    this.androidSocketClose = function () {    //关闭socket连接
        this.socket.on("WSClose", function (arg1) {
            Agi.Msg.AndroidSocketManage.state = "断开";
        });

        this.socket.emit('WSClose', { "actionType": "3", "actionMessage": "" });
    }

    //判断是否在安卓系统上运行
    this.isRuntimeInAndroid = function () {
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = (isLinux && ua.indexOf("android") != -1);
        return isAndroid;
    }
}
Agi.Msg.AndroidSocketManage = new Agi.Msg.AndroidSocket();
