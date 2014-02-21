/*
 编写人：鲁佳
 描述：注册点位号管理
 修改人：刘文川
 时间：2012-09-19，17:44
 */

Namespace.register("Agi.Msg");
/*添加 Agi.Msg命名空间*/
/** @namespace Agi.Msg */
Agi.Msg.PointsManage = function () {//jsonobj结构为：{"ControlID":"Panel001","Points":["11ae84101","11ae84102","11ae84103"]}
    this.loadState = false; //当前临时保存页面处理状态，方便外部查询
    this.IsSocketOpen = false; //当前临时保存SOCKET连接打开状态
    this.ControlPoints = []; //当前临时保存点位号信息
    //客户端线程处理
    var agiWorker = null;
    try {
        agiWorker = new Worker("JS/AgiMsgManage/Agi.Msg.WebSocket/Agi.Msg.Worker.js");
        //基础配置参数传递

        agiWorker.postMessage(JSON.stringify({ State:'WebServiceConfigType', Content:Agi.WebServiceConfig.Type }));
        agiWorker.postMessage(JSON.stringify({ State:'SocketAddressInfo', Content:Agi.SocketAddressInfo }));

        //侦听事件
        agiWorker.onmessage = function (_event) {//数据取回，参数：_event.data="{State:'',Content:''}"
            //        try{
            var myData = JSON.parse(_event.data);
            switch (myData.State) {
                case "Value": //返回的Content里面为一组JSON结构：[{ControlID:'',PointID:'',Value:''},{ControlID:'',PointID:'',Value:''}]
                    Agi.Msg.PointsManageInfo.SendRealMessage(myData.Content);
                    break;
                case "IsSocketOpen": //返回是否已经打开连接
                    if (myData.Content) {
                        console.log("Log-连接成功");
                    }

                    Agi.Msg.PointsManageInfo.IsSocketOpen = myData.Content;
                    break;
                case "Log": //返回日志信息
                    console.log("Log-" + myData.Content);
                    break;
                default:
                    console.log("捕获状态未处理-" + myData.State);
            }
            //        }
            //        catch(e){
            //            console.log("客户端线程处理数据时出错")
            //        }
        };
        //错误事件
        agiWorker.onerror = function (e) {//线程抛出异常
            console.log("ERROR-" + e.lineno + e.message + e.filename);
        };
    } catch (e) {
        console.log("ERROR-" + e.lineno + e.message + e.filename);
    }

    this.AddPoint = function (jsonobj) {//追加点位号
        this.SaveControlPoints(jsonobj);
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'AddPoint', Content:jsonobj }));
        }
    };

    this.AddViewPoint = function (jsonobj) {//追加点位号
        this.SaveControlPoints(jsonobj);
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'AddViewPoint', Content:jsonobj }));
        }
    };

    this.AddMassPoint = function (jsonobj) {//追加点位号
        this.SaveControlPoints(jsonobj);
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'AddMassPoint', Content:jsonobj }));
        }
    };

    this.UpdatePoint = function (jsonobj) {//更新点位号
        this.SaveControlPoints(jsonobj);
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'UpdatePoint', Content:jsonobj }));
        }
    };

    this.SetLoadState = function (_valueKey) {//设置页面打开属性
        this.loadState = _valueKey;
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'LoadState', Content:_valueKey }));
        }
    };

    this.ConnOpen = function () {//外部打开SOCKET连接
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'ConnOpen', Content:"" }));
        }
    };

    this.RegMassPoint = function () {//新页面注册点位号数据
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'RegMassPoint', Content:"" }));
        }
    };

    this.RegPoint = function (objData) {//新页面注册点位号数据
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'RegPoint', Content:objData }));
        }
    };

    this.RegPoint1 = function (pointsStr) {//打开页面时注册点位号数据
        if (agiWorker != null) {
            agiWorker.postMessage(JSON.stringify({ State:'RegPoint1', Content:pointsStr }));
        }
//        console.log(pointsStr);
//        if (Agi.Msg.AndroidSocketManage.isRuntimeInAndroid()) {
//            Agi.Msg.AndroidSocketManage.WSRegisterPoint(pointsStr);
//        }
//        else {
//            if (agiWorker != null) {
//                agiWorker.postMessage(JSON.stringify({ State:'RegPoint1', Content:pointsStr }));
//            }
//        }
    };

    this.CloseServer = function () { //关闭socket连接  2013-01-10
        agiWorker.postMessage(JSON.stringify({ State:'Close', Content:"" }));
    };

    this.SendRealMessage = function (MsgObj) {//接收到数据后向注册控件发送实时数据
        var objControl;
        var i;
        for (i = 0; i < MsgObj.Content.length; i++) {
            //console.log("返回数据 ControlID："+MsgObj.Content[i].ControlID+" Value："+JSON.stringify(MsgObj.Content[i].Value));
            objControl = Agi.Controls.FindControl(MsgObj.Content[i].ControlID);
            if (objControl) {
                objControl.ReadRealData(MsgObj.Content[i].Value);
            }
        }
        objControl = null;
    };

    this.SaveControlPoints = function (jsonobj) {//临时保存页面点位信息，方便查询
        var i;
        for (i = 0; i < this.ControlPoints.length; i++) {
            if (this.ControlPoints[i].ControlID == jsonobj.ControlID) {
                this.ControlPoints[i].Points = jsonobj.Points;
                return;
            }
        }
        this.ControlPoints.push(jsonobj);
    };

    this.ObjectToString = function (objArray) {//["11ae84101","11ae84102"]  序列化成："11ae84101|11ae84102|"
        var _value = "";
        var i;
        for (i = 0; i < objArray.length; i++) {
            _value += objArray[i] + "|";
        }
        return _value;
    };
};
Agi.Msg.PointsManageInfo = new Agi.Msg.PointsManage();