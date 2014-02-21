/*
编写人：鲁佳
描述：消息通知
*/

//打开参数配置窗口
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.Trigger = function () {
    this.ParaChangeEvent = function (objcet) {
        var paras = Agi.Msg.ParaBindManage.ParasRelation; //关系绑定集合
        var RealTimeparas = Agi.Msg.RealTimeParaBindManage.ParasRelation;  //实时控件关系绑定集合

        var senderControl = objcet.sender; //发起者

        if (objcet.Type == Agi.Msg.Enum.Controls) {  //控件参数

            var senderParas = Agi.Msg.PageOutPramats.GetItemValue(senderControl.Get("ProPerty").ID); //获取发起者输出参数
            //关系
            this.ControlEvent(paras, senderControl, objcet, senderParas);
            //实时
            this.ControlRealTimeEvent(RealTimeparas, senderControl, objcet, senderParas);
            //共享数据源
            this.ControlShareDataEvent(senderControl, objcet, senderParas);
        }
        else if (objcet.Type == Agi.Msg.Enum.Url) {  //url参数
            var senderParas = Agi.Msg.PageOutPramats.GetItemValue(senderControl); //获取发起者url输出参数
            //关系
            this.UrlEvent(paras, senderControl, objcet, senderParas);
            //实时
            this.URLRealTimeEvent(RealTimeparas, senderControl, objcet, senderParas);
            //共享数据源
            this.UrlShareDataEvent(senderControl, objcet, senderParas);
        }
    }

    //region 通知实时控件 [发起者：控件]
    this.ControlRealTimeEvent = function (paras, senderControl, objcet, senderParas) {
        //用发起者参数匹配关联者对象
        for (var i = 0; i < senderParas.length; i++) {

            for (var j = 0; j < paras.length; j++) {

                if (paras[j].ControlPara == senderControl.Get("ProPerty").ID + "." + senderParas[i].Name) {  //有绑定关系

                    var _tempValue = Agi.Msg.PageOutPramats.GetItem_Value(senderControl.Get("ProPerty").ID, senderParas[i].Name); //参数值 =查找“控件ID+参数名称”

                    var objControl = Agi.Controls.FindControl(paras[j].EntityPara); //根据控件ID查找控件

                    objControl.ParameterChange({ "Type": objcet.Type, "sender": senderControl, "Points": _tempValue });
                }
            }
        }
    }
    //endregion

    //region 通知实时控件 [发起者：url]
    this.URLRealTimeEvent = function (paras, senderControl, objcet, senderParas) {
        //用发起者参数匹配关联者对象
        for (var i = 0; i < senderParas.length; i++) {

            for (var j = 0; j < paras.length; j++) {

                if (paras[j].ControlPara == senderControl + "." + senderParas[i].Name) {  //有绑定关系

                    var _tempValue = Agi.Msg.PageOutPramats.GetItem_Value(senderControl, senderParas[i].Name); //参数值 =查找“urlKey+参数名称”

                    var objControl = Agi.Controls.FindControl(paras[j].EntityPara); //根据控件ID查找控件

                    objControl.ParameterChange({ "Type": objcet.Type, "sender": senderControl, "Points": _tempValue });
                }
            }
        }
    }
    //endregion

    //region url事件
    this.UrlEvent = function (paras, senderControl, objcet, senderParas) {
        for (var i = 0; i < senderParas.length; i++) {

            for (var j = 0; j < paras.length; j++) {

                if (paras[j].ControlPara == senderControl + "." + senderParas[i].Name) {  //有绑定关系

                    //找到有绑定关系的控件，修改接收参数的值
                    var _RelationExpression = AgiMsgGetGeyValue(paras[j].EntityPara);
                    var objControl = Agi.Controls.FindControl(_RelationExpression.key);
                    //var objControl = Agi.Controls.FindControl(paras[j].EntityPara.split('_')[0]); //获取关联控件

                    this.SendMessage(objControl, paras[j], senderControl, objcet, senderParas);
                }
            }
        }
    }
    //endregion

    //#region  控件事件
    this.ControlEvent = function (paras, senderControl, objcet, senderParas) {

        for (var i = 0; i < senderParas.length; i++) {

            for (var j = 0; j < paras.length; j++) {

//                if(paras[j].ControlPara.toString().contains("Url参数")){
//                    continue;
//                }

                if (paras[j].ControlPara == senderControl.Get("ProPerty").ID + "." + senderParas[i].Name) {  //有绑定关系

                    //找到有绑定关系的控件，修改接收参数的值
                    var _RelationExpression = AgiMsgGetGeyValue(paras[j].EntityPara);
                    var objControl = Agi.Controls.FindControl(_RelationExpression.key);
                    //var objControl = Agi.Controls.FindControl(paras[j].EntityPara.split('_')[0]); //获取关联控件

                    this.SendMessage(objControl, paras[j], senderControl, objcet, senderParas);
                }
            }
        }
    }
    //endregion

    //region 共享数据源 ：控件参数改变事件 
    //1.找到关联的dataset参数赋值
    //2.查询数据
    //3.找到对应的共享数据源对应的控件
    //4.通知控件             
    this.ControlShareDataEvent = function (senderControl, objcet, senderParas) {
        for (var i = 0; i < senderParas.length; i++) {
            var tempPara = senderControl.Get("ProPerty").ID + "." + senderParas[i].Name; //控件输出参数
            this.ShareDataComm(tempPara);
        }
    }

    //共享数据源 ：URL参数改变事件    
    this.UrlShareDataEvent = function (senderControl, objcet, senderParas) {
        for (var i = 0; i < senderParas.length; i++) {
            var tempPara = senderControl + "." + senderParas[i].Name; //控件输出参数
            this.ShareDataComm(tempPara);
        }
    }

    //共享数据源获取对应的dataset参数
    this.ShareDataComm = function (tempPara) {
        var tempobj = Agi.Msg.ShareDataRealTimeBindPara.GetitemObject(tempPara, 0); //获取dataset参数
        this.ShareDataQueryData(tempobj);
    }

    // 共享数据源拖动到控件上时使用;
    this.ShareDataInAgivisEdit = function (obj) {
        var tempobj = Agi.Msg.ShareDataRealTimeBindPara.GetitemObject(obj.shareID, 1); //获取dataset参数
        tempobj.controlID = obj.controlID;
        //this.ShareDataQueryData(tempobj);
        this.ShareDataInLoad(tempobj);
    }

    //共享过滤规则配置完毕后使用 
    this.ShareDataFilterSetting = function (obj) {
        if (Agi.Msg.ShareDatas.IsExistSharaData(obj.shareID)) {  //从共享集合中取数据
            var result = Agi.Msg.ShareDatas.getItem(obj.shareID);
            var resultinfo = {};
            resultinfo.Columns = result.result.Columns;
            resultinfo.Data = result.result.Data;
            resultinfo.Filter = null;
            resultinfo.Key = result.tempobj.ShareDataName;
            resultinfo.Parameters = result.tempobj.dataset.param;
            resultinfo.IsShareEntity = true;
            Agi.Msg.TriggerManage.ShareDataFilterWorker({ "datainfo": resultinfo, "controlID": obj.controlID });
        }
        else {  //共享集合中没有，则重新查数据
            this.ShareDataInAgivisEdit(obj);
        }
    }

    //共享数据源 页面加载完成后使用
    this.ShareDataInLoadComplete = function () {
        var ShareParas = Agi.Msg.ShareDataRelation.ShareRelation; //共享数据源关系维护集合
        for (var i = 0; i < ShareParas.length; i++) {
            var tempobj = Agi.Msg.ShareDataRealTimeBindPara.GetitemObject(ShareParas[i].shareID, 1); //获取dataset参数
            //this.ShareDataQueryData(tempobj);
            this.ShareDataInLoad(tempobj, true);
        }
    }

    //共享数据源 页面加载时 查询dataset的默认参数
    this.ShareDataInLoad = function (tempobj, isAgiMsgLoad) {
        Agi.DAL.ReadData({ "MethodName": "VSGetVirtualTable",
            "Paras": JSON.stringify(tempobj.dataset),
            "CallBackFunction": function (result) {
                if (result.result == "true") {
                    var parms = [];
                    if (Agi.WebServiceConfig.Type === ".NET") {
                        if (result.virtualTableData.SingleEntityInfo.SqlDefined != null)//标准虚拟表
                        {
                            parms = result.virtualTableData.SingleEntityInfo.SqlDefined.Para; //获取虚拟表参数
                        }
                        else if (result.virtualTableData.SingleEntityInfo.ScDefined != null)  //混合虚拟表 
                        {
                            parms = result.virtualTableData.SingleEntityInfo.ScDefined.Para; //获取混合虚拟表参数
                        }
                        else if (result.virtualTableData.SingleEntityInfo.SpDefined != null)  //存储过程虚拟表  lujia 2013/07/04
                        {
                            parms = result.virtualTableData.SingleEntityInfo.SpDefined.Para; //获取存储过程虚拟表参数
                        }
                        if (parms == null) {
                            parms = [];
                        }
                        tempobj.dataset.param = [];
                        $(parms).each(function (i, p) {
                            tempobj.dataset.param.push({ key: p.ID, value: p.Default });
                        });
                    }
                    else {
                        if (parms == null) {
                            parms = [];
                        }
                        tempobj.dataset.param = [];
                        parms = result.virtualTableData.data.para;
                        $(parms).each(function (i, p) {
                            tempobj.dataset.param.push({ key: p.paraName, value: p.Default });
                        });
                    }
                    Agi.Msg.TriggerManage.ShareDataQueryData(tempobj, isAgiMsgLoad);
                }
            }
        });
    }

    //共享数据源查询数据 查询数据
    this.ShareDataQueryData = function (tempobj, isAgiMsgLoad) {
        var Me = this;
        if (tempobj.state) {  //有绑定关系 查数据
            Agi.DAL.ReadData({ "MethodName": "DSReadData",
                "Paras": JSON.stringify(tempobj.dataset),
                "CallBackFunction": function (result) {
                    Agi.Msg.ShareDatas.AddItem({ "shareID": tempobj.ShareDataName, "result": result, "tempobj": tempobj }); //将数据存储到数据集合中
                    var tempShareRelation = Agi.Msg.ShareDataRelation.ShareRelation; //得到所有共享与控件的关系集合
                    for (var i = 0; i < tempShareRelation.length; i++) {
                        if (tempobj.controlID == null) {
                            //集合中的共享名称如果等于当前的共享名称
                            if (tempShareRelation[i].shareID == tempobj.ShareDataName) {
                                for (var j = 0; j < tempShareRelation[i].controlID.length; j++) {
                                    //找到控件
                                    /*
                                    var objControl = Agi.Controls.FindControl(tempShareRelation[i].controlID[j]);
                                    */
                                    //通知控件
                                    var resultinfo = {};
                                    var tempResult = Me.CloneObj(result);

                                    resultinfo.Columns = tempResult.Columns;
                                    resultinfo.Data = tempResult.Data;

                                    resultinfo.Filter = null;
                                    resultinfo.Key = tempobj.ShareDataName;
                                    resultinfo.Parameters = tempobj.dataset.param;
                                    resultinfo.IsShareEntity = true;
                                    /*
                                    if (objControl != null) {
                                    objControl.ReadData(resultinfo); //调用控件的共享数据接口
                                    }
                                    */
                                    Agi.Msg.TriggerManage.ShareDataFilterWorker({ "datainfo": resultinfo, "controlID": tempShareRelation[i].controlID[j], "isAgiMsgLoad": isAgiMsgLoad });
                                }
                            }
                        }
                        else {
                            //找到控件
                            var objControl = Agi.Controls.FindControl(tempobj.controlID);
                            //通知控件
                            var resultinfo = {};
                            resultinfo.Columns = result.Columns;
                            resultinfo.Data = result.Data;
                            resultinfo.Filter = null;
                            resultinfo.Key = tempobj.ShareDataName;
                            resultinfo.Parameters = tempobj.dataset.param;
                            resultinfo.IsShareEntity = true;
                            //Agi.Msg.TriggerManage.ShareDataFilterWorker({ "datainfo": resultinfo, "controlID": tempobj.controlID });
                            if (objControl != null) {
                                objControl.ReadData(resultinfo); //调用控件的共享数据接口
                            }
                        }
                    }
                }
            });
        }
    }
    this.CloneObj = function (_DataObj) {
        var objClone;
        if (_DataObj.constructor == Object){
            objClone = new _DataObj.constructor();
        }
        else {
            objClone = new _DataObj.constructor(_DataObj.valueOf());
        }
        if(_DataObj.valueOf() instanceof Array && _DataObj.valueOf().length <=0){//解决空数据会有数据嵌套
            objClone = [];
        }
        for (var key in _DataObj) {
            if (objClone[key] != _DataObj[key]) {
                if (typeof (_DataObj[key]) == 'object') {
                    objClone[key] = this.CloneObj(_DataObj[key]);
                }
                else {
                    objClone[key] = _DataObj[key];
                }
            }
        }
        return objClone;
    };

    //共享数据源查询数据 数据二次过滤 通知对应控件
    this.ShareDataFilterWorker = function (obj) {
        //2012-12-13 button查询拦截功能  
        if (!Agi.Msg.ButtonBindControls.getState(obj.controlID) || obj.isAgiMsgLoad == true) { //是否屏蔽了即时联动功能
            //1.调用数据规则处理类
            var Expression = Agi.Msg.ShareDataFilterRelation.getItem(obj.controlID);
            //2.得到过滤表达式
            if (Expression.state) //需要二次过滤              
            {
                obj.expression = Expression.item.calculateExpression;
                try {
                    //ie
                    if (window.navigator.userAgent.indexOf("MSIE") !== -1) {
                        for (var i = 0; i < obj.datainfo.Data.length; i++) {
                            var data = obj.datainfo.Data;
                            var state = eval(obj.expression);
                            if (!state) {
                                data.splice(i, 1);
                                i--;
                                continue;
                            }
                        }
                        var objControl = Agi.Controls.FindControl(obj.controlID);
                        if (objControl != null) {
                            objControl.ReadData(obj.datainfo); //调用控件的共享数据接口
                        }
                    } else {//chrome
                        var worker = new Worker("JS/AgiShareDatasource/Agi.ShareData.DataFilterWorker.js");
                        worker.postMessage(obj);
                        worker.onmessage = function (e) {
                            var con = Agi.Controls.FindControl(e.data.controlID);
                            if (con != null) {
                                con.ReadData(e.data.datainfo); //调用控件的共享数据接口
                            }
                        };
                    }
                }
                catch (e) {//不支持多线程,这块之前已做个处理了，主要用于共享数据源数据过滤  

                }
            }
            else   //不需要二次过滤
            {
                var objControl = Agi.Controls.FindControl(obj.controlID);
                if (objControl != null) {
                    objControl.ReadData(obj.datainfo); //调用控件的共享数据接口
                }
            }
        }
    }
    //end region

    //region send begin
    this.SendMessage = function (objControl, paras, senderControl, objcet, senderParas) {
        if (objControl != null) {
            for (var x = 0; x < objControl.Get("Entity").length; x++) {                   //获取关联控件实体集合

                var _RelationExpression = AgiMsgGetGeyValue(paras.EntityPara);
                if (objControl.Get("Entity")[x].Key == _RelationExpression.value.split('.')[0]) {  //找到对应的实体

                    for (var y = 0; y < objControl.Get("Entity")[x].Parameters.length; y++) { //获取绑定控件的实体参数数组

                        /*if (objControl.Get("Entity")[x].Parameters[y].Key == paras[j].EntityPara.split('_')[1].split('.')[1]) {

                        objControl.Get("Entity")[x].Parameters[y].Value = senderParas[i].Value;
                        }*/

                        //2012-09-09 修改
                        //_controlvalue =控件id.参数
                        var _controlvalue = Agi.Msg.ParaBindManage.GetOutPutControlPara(objcet,objControl.Get("ProPerty").ID + "_" + objControl.Get("Entity")[x].Key + "." + objControl.Get("Entity")[x].Parameters[y].Key);

                        if (_controlvalue != null) {
                            var _tempValue = Agi.Msg.PageOutPramats.GetItem_Value(_controlvalue.split('.')[0], _controlvalue.split('.')[1]);

                            if (_tempValue != null) {
                                objControl.Get("Entity")[x].Parameters[y].Value = _tempValue;
                            }
                        }
                    }
                    //2012-12-13 button查询拦截功能  
                    if (!Agi.Msg.ButtonBindControls.getState(objControl.Get("ProPerty").ID)) { //是否屏蔽了即时联动功能
                        objControl.ParameterChange({ "Type": objcet.Type, "sender": senderControl, "Entity": objControl.Get("Entity")[x] });
                    }
                }
            }
        }
    }
    //endregion send end

    //var thread = new Worker('JS/AgiMsgManage/Agi.Msg.WebSocket/Agi.Msg.Thread.js');
    //region send real time data begin
    this.SendRealMessage = function (MsgObj) {

        //        thread.postMessage(MsgObj.TagName);
        //        thread.onmessage = function (e) {
        //            //e.control.ReadRealData(e.data);
        //            //alert("sss");
        //        }

        //过滤点位 分发给控件
        for (var i = 0; i < Agi.Msg.PointsManageInfo.ControlPoints.length; i++) {
            var controlID = Agi.Msg.PointsManageInfo.ControlPoints[i].ControlID;

            var controbj = Agi.Controls.FindControl(controlID);

            for (var j = 0; j < Agi.Msg.PointsManageInfo.ControlPoints[i].Points.length; j++) {

                if (MsgObj.TagName == Agi.Msg.PointsManageInfo.ControlPoints[i].Points[j]) {
                    controbj.ReadRealData(MsgObj);
                }
            }
        }
    }
    //endregion send real time data end
}

function fcommSplit(_strvalue, split) {
    var t = _strvalue.indexOf(split);
    var temp = { "key": null, "value": null };
    temp.key = _strvalue.substring(0, t);
    temp.value = _strvalue.substring(t + 1, _strvalue.length);
    return temp;
}

Agi.Msg.TriggerManage = new Agi.Msg.Trigger();

