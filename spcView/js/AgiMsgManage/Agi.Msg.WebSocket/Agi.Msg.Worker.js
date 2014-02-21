/**
 * Created with 刘文川.
 * User: Administrator
 * Date: 12-9-19
 * Time: 下午4:42
 * To change this template use File | Settings | File Templates.
 */

importScripts('alchemy-client.js',
    'Agi.Msg.JavaSocket.js',
    'Agi.Msg.NetSocket.js',
    'Agi.Msg.WebSocketManage.js');

var WebServiceConfigType;// = ".NET";   //value:[.NET/JAVA] 大小写敏感
var SocketAddressInfo;// = {"Ip":"192.168.1.122","Port":"81"};  //socket连接地址

onmessage = function (event) {//取得传递参数，参数：_event.data="{State:'',Content:{"ControlID":"Panel001","Points":["11ae84101","11ae84102","11ae84103"]}}"
    var myData = JSON.parse(event.data)
    switch (myData.State) {
        case "AddPoint": //新增点位数
            WorkerPointsManage.AddPoint(myData.Content);
            break;
        case "AddViewPoint": //用于初始化显示页面多个点位注册时，模拟注册
            WorkerPointsManage.AddViewPoint(myData.Content);
            break;
        case "AddMassPoint": //新增点位数
            WorkerPointsManage.AddMassPoint(myData.Content);
            break;
        case "UpdatePoint": //更新点位
            WorkerPointsManage.UpdatePoint(myData.Content);
            break;
        case "LoadState": //设置读取状态
            WorkerPointsManage.loadState = myData.Content;
            break;
        case "ConnOpen": //预先打开socket连接
            WorkerPointsManage.IsViewState = true;
            WebSocketManage.ConnOpen();
            break;
        case "RegMassPoint": //外部强制注册方法
            WorkerPointsManage.RegMassPoint();
            break;
        case "RegPoint": //外部强制注册方法
            WorkerPointsManage.RegPoint(myData.Content);
            break;
        case "RegPoint1": //外部强制注册方法1
            WorkerPointsManage.RegPoint1(myData.Content);
            break;
        case "WebServiceConfigType": //配置基础参数
            WebServiceConfigType = myData.Content;
            break;
        case "SocketAddressInfo": //配置SOCKET连接配置
            SocketAddressInfo = myData.Content;
            break;
        case "Close": //关闭连接
            NetSocketManage.SocketClose(); //2013-01-10
            break;
        default:
            break;
    }
}

ResultValue=function(jsonobj){//传递数据回主线程
    postMessage(JSON.stringify({State:'Value',Content:jsonobj}));
}

WorkerLog=function(_message){//日志，用于监控程序异常
    postMessage(JSON.stringify({State:'Log',Content:_message}));
}

ResultIsSocketOpen=function(){
    postMessage(JSON.stringify({State:'IsSocketOpen',Content:WebSocketManage.IsSocketOpen}));
}

CreateNewJson=function(MsgObj){
    try
    {
        var objData=MsgObj;
        if(!(typeof(objData)=="object" || typeof(objData)=="Object")){
            objData=JSON.parse(objData);
        }
        var arrData={Content:[]};
        for (var i = 0; i < WorkerPointsManage.ControlPoints.length; i++) {
            var controlID =WorkerPointsManage.ControlPoints[i].ControlID;
            for (var j = 0; j < WorkerPointsManage.ControlPoints[i].Points.length; j++) {
                if (objData.TagName == WorkerPointsManage.ControlPoints[i].Points[j]) {
                    arrData.Content.push({ControlID:controlID,Value:objData});
                }
            }
        }
        return arrData;
    }catch(e){
        WorkerLog("取回数据进行分类时报错");
        throw e;
    }
}

AgiWorkerPoints=function(){//jsonobj={"ControlID":"Panel001","Points":["11ae84101","11ae84102","11ae84103"]}
    {//参数配置
        this.ControlPoints = [];//控件点位集合
        this.TempPoints=[];//临时存放数组
        this.loadState = false;//页面是否新建还是打开
        var _RegData={ actionType: 0, actionMessage: "",sessionID:"" };//设置数据发送格式
        var _timeCheck=500;//注册批量数据延迟
        var _timeConn=10000;//延迟时间上限
    }
    this.ClearRegData = function(){
        _RegData.actionMessage="";
    }
    this.AddPoint = function (jsonobj) {
        WorkerLog("AddPoint  "+JSON.stringify(jsonobj));
        if (!this.Isexistitems(jsonobj.ControlID)) {
            WorkerLog("kaishi");
            this.ControlPoints.push(jsonobj);
            this.RegPoint(jsonobj.Points); //通知服务端发送对应点位号
        }
        else {
            this.UpdatePoint(jsonobj);
        }
    }
    this.AddViewPoint = function(jsonobj){
        WorkerLog("AddViewPoint  "+JSON.stringify(jsonobj));
        if (!this.Isexistitems(jsonobj.ControlID)) {
            this.ControlPoints.push(jsonobj);
        }
        else {
            var obj = this.GetSelectedItem(jsonobj.ControlID);
            if (obj != null) {
                obj.Points = jsonobj.Points;
            }
        }
    }
    this.UpdatePoint = function (jsonobj) {
        var obj = this.GetSelectedItem(jsonobj.ControlID);
        if (obj != null) {
            obj.Points = jsonobj.Points;

            this.RegPoint(jsonobj.Points); //通知服务端发送对应点位号
        }
    }
    this.AddMassPoint = function(jsonobj){//预注册点位保存管理
        if (!this.Isexistitems(jsonobj.ControlID)) {
            this.ControlPoints.push(jsonobj);
            this.TempPoints = this.TempPoints.concat(jsonobj.Points);
        }
        else {
            this.UpdatePoint(jsonobj);
        }
    }
    this.RegMassPoint=function(){//统一大批量注册点位
        WorkerLog("RegMassPoint  "+JSON.stringify({"Points":this.TempPoints}));
        this.RegPoint1(this.ObjectToString(this.TempPoints)); //通知服务端发送对应点位号
        this.TempPoints = [];
    }
    this.RegPoint = function (objArray) {//注册点位号
        if (!this.loadState) {
            _RegData.actionMessage = this.ObjectToString(objArray);
            if (!WebSocketManage.IsSocketOpen) { //如果没有打开连接 先打开连接在注册
                WebSocketManage.ConnOpen(function () {
                    //WorkerLog(JSON.stringify(_RegData));
                    WebSocketManage.MsgSend(_RegData);
                });
            }
            else {
                WebSocketManage.MsgSend(_RegData);
            }
        }
    }
    function WhileRegPoint(){//连接打开延迟判断
        if( _RegData != null && _RegData.actionMessage != ""){
            if (!WebSocketManage.IsSocketOpen){
                if(_timeConn < _timeCheck){//设置一定时间后如果依然没有打开连接则重新打开连接
                    WorkerLog("判断连接");
                    WebSocketManage.ConnOpen(function () {
                        WebSocketManage.MsgSend(_RegData);
                    });
                }
                else{
                    _timeConn-=_timeCheck;
                    setTimeout(WhileRegPoint,_timeCheck);
                }
            }
            else{
                WebSocketManage.MsgSend(_RegData);
            }
        }
    }
    this.RegPoint1 = function (pointsStr) {
        _RegData.actionMessage = pointsStr;
        if (!WebSocketManage.IsSocketOpen) { //如果没有打开连接 先打开连接在注册
            setTimeout(WhileRegPoint,_timeCheck);
        }
        else {
            WebSocketManage.MsgSend(_RegData);
        }
        this.loadState = false;
    }
    this.Isexistitems = function (key) {//判断是否存在
        var IsExisti = false;
        for (var i = 0; i < this.ControlPoints.length; i++) {
            if (this.ControlPoints[i].ControlID == key) {
                IsExisti = true;
                break;
            }
        }
        return IsExisti;
    }
    this.GetSelectedItem = function (key) {
        var obj = null;
        for (var i = 0; i < this.ControlPoints.length; i++) {
            if (this.ControlPoints[i].ControlID == key) {
                obj = this.ControlPoints[i];
                break;
            }
        }
        return obj;
    }
    this.ObjectToString = function (objArray) {//["11ae84101","11ae84102"]  序列化成："11ae84101|11ae84102|"
        //if(!objArray) return;
        var _value = "";
        for (var i = 0; i < objArray.length; i++) {
            _value += objArray[i] + "|";
        }
        if(WebServiceConfigType == "JAVA" && _value.length > 0){
            _value=_value.substring(0,_value.length-1);
        }
        return _value;
    }
}
WorkerPointsManage = new AgiWorkerPoints();