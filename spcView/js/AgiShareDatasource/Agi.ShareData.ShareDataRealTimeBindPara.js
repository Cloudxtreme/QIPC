
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ShareDataRealTimeBindPara = function () {
    //添加关系项
    this.AddItem = function (_ControlOutputPara, _RealtimeIntputPara) {
        if (this.RIsexistitems(_RealtimeIntputPara)) {
            this.RGetItemObj(_RealtimeIntputPara).ControlPara = _ControlOutputPara;  //存在
            if (_ControlOutputPara == undefined) {
                this.RGetItemObj(_RealtimeIntputPara).RelationExpression = _RealtimeIntputPara;
            }
            else {
                this.RGetItemObj(_RealtimeIntputPara).RelationExpression = _RealtimeIntputPara + "=" + _ControlOutputPara;
            }
        }
        else {
            if (_ControlOutputPara == undefined) {
                this.ParasRelation.push(new ShareDataRelationRealtimeClass(_ControlOutputPara, _RealtimeIntputPara, _RealtimeIntputPara)); //不存在
            }
            else {
                this.ParasRelation.push(new ShareDataRelationRealtimeClass(_ControlOutputPara, _RealtimeIntputPara, _RealtimeIntputPara + "=" + _ControlOutputPara)); //不存在
            }
        }
    }

    //检查是否存在参数项
    this.RIsexistitems = function (_EntityPara) {
        var IsState = false;
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (this.ParasRelation[i].EntityPara == _EntityPara) {
                IsState = true;
                break;
            }
        }
        return IsState;
    }

    //返回匹配的参数item对象
    this.RGetItemObj = function (_EntityPara) {
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (this.ParasRelation[i].EntityPara == _EntityPara) {
                return this.ParasRelation[i];
            }
        }
    }

    //是否存在参数绑定关系
    this.RIsExistRelation = function (EntityIDName) {   //控件ID_实体.参数
        var state = false;
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (EntityIDName == this.ParasRelation[i].EntityPara) {
                state = true;
                break;
            }
        }
        return state;
    }

    //检查共享数据源名称是否存在是否存在
    this.IsexistShares = function (_ShareName) {
        var IsState = false;
        for (var i = 0; i < this.PageAllShareDataRelation.length; i++) {
            if (this.PageAllShareDataRelation[i].ShareDataName == _ShareName) {
                IsState = true;
                break;
            }
        }
        return IsState;
    }

    //返回匹配共享数据源名称的item对象
    this.GetShareItemObj = function (_ShareName) {
        for (var i = 0; i < this.PageAllShareDataRelation.length; i++) {
            if (this.PageAllShareDataRelation[i].ShareDataName == _ShareName) {
                return this.PageAllShareDataRelation[i];
            }
        }
    }

    //移除共享数据源
    this.DeleteItem = function (_ShareDataName) {
        for (var i = 0; i < this.PageAllShareDataRelation.length; i++) {
            if (_ShareDataName == this.PageAllShareDataRelation[i].ShareDataName) {
                this.PageAllShareDataRelation.splice(i, 1);
            }
        }
    }


    //检查dataset共享是否存在
    this.Isexistitems = function (_DatasetName) {
        var IsState = false;
        for (var i = 0; i < this.PageAllShareDataRelation.length; i++) {
            if (this.PageAllShareDataRelation[i].DatasetName == _DatasetName) {
                IsState = true;
                break;
            }
        }
        return IsState;
    }

    //返回匹配dataset共享的item对象
    this.GetItemObj = function (_DatasetName) {
        for (var i = 0; i < this.PageAllShareDataRelation.length; i++) {
            if (this.PageAllShareDataRelation[i].DatasetName == _DatasetName) {
                return this.PageAllShareDataRelation[i];
            }
        }
    }

    /*
    根据[控件ID.参数]查找是否有绑定关系
    该方法在Agi.Msg.Trigger.js中用到 
    add by lujia
    date 2012-11-29
    controlPara:[0:控件ID.参数 1:共享数据源名称]
    queryType:[0:根据输出参数匹配 1：根据共享数据名称匹配]
    */
    this.GetitemObject = function (controlPara, queryType) {
        var returnObj = { "state": null, "ShareDataName": null, "dataset": { "datasetID": null, "param": []} }; //返回对象
        var temp = null;
        for (var i = 0; i < this.PageAllShareDataRelation.length; i++) {
            var state = false;
            if (queryType == 0) { //根据输出参数匹配
                for (var j = 0; j < this.PageAllShareDataRelation[i].ParasRelation.length; j++) {//从数组中查找，是否有绑定关系
                    if (this.PageAllShareDataRelation[i].ParasRelation[j].RelationExpression.indexOf(controlPara) > -1) {
                        state = true; break;
                    }
                }
            }
            else { //根据共享数据名称匹配
                if (this.PageAllShareDataRelation[i].ShareDataName.indexOf(controlPara) > -1) {
                    state = true;
                }
            }
            if (state) { temp = this.PageAllShareDataRelation[i]; break; } //如果有绑定关系，将item赋值给临时变量temp
        }

        if (temp == null) { //没有找到绑定关系
            returnObj.state = false; returnObj.dataset = null;
        }
        else {   //控件参数与dataset参数有绑定关系
            returnObj.state = true;
            returnObj.dataset.datasetID = temp.DatasetName; //datasetID
            returnObj.ShareDataName = temp.ShareDataName; //共享ID
            for (var i = 0; i < temp.ParasRelation.length; i++) {
                var tempjson = fcommSplit(temp.ParasRelation[i].RelationExpression, "="); //获取对象[dataset参数,控件ID.参数]
                var tempjson1 = fcommSplit(tempjson.value, "."); //获取对象[控件ID，参数名称]
                var value = Agi.Msg.PageOutPramats.GetItem_Value(tempjson1.key, tempjson1.value);
                returnObj.dataset.param.push({ "key": temp.ParasRelation[i].EntityPara, "value": value }); //参数名称，参数值
            }
        }
        return returnObj;
    }

    //保存方法
    this.SaveShareDataObj = function (DatasetName, ShareDataName) {
        //        this.SingelShareDataRelation = [];
        if (this.IsexistShares(ShareDataName)) {
            for (var i = 0; i < this.PageAllShareDataRelation.length; i++) {
                if (this.PageAllShareDataRelation[i].ShareDataName == ShareDataName) {
                    this.PageAllShareDataRelation[i].DatasetName = DatasetName;
                    this.PageAllShareDataRelation[i].ParasRelation = this.ParasRelation;
                }
            }
        } else {
            this.PageAllShareDataRelation.push({
                DatasetName: DatasetName,  //dataset名称
                ShareDataName: ShareDataName, //共享数据源名称
                ParasRelation: this.ParasRelation //dataset名称的参数=控件ID.输出参数
            });

            //            this.PageAllShareDataRelation.push(this.SingelShareDataRelation);
        }
        this.ParasRelation = [];
    }

    //将数组转换成字符串保存
    this.SaveAllShareToString = function () {
        var ShareString = $.toJSON(this.PageAllShareDataRelation);
        //        this.PageAllShareDataRelation = [];
        //        this.ParasRelation = [];
        return ShareString;
    }

    //将获取到的字符串转成数组显示
    this.GetShareStringToArray = function (ShareString) {
        if (ShareString != undefined && ShareString != "" && ShareString != []) {
            this.PageAllShareDataRelation = $.evalJSON(ShareString);
            try {
                ShareDataOperation.ReadyDataAndShow(this.PageAllShareDataRelation);
            }
            catch (e) { }
        }
    }

    //存储所有关系
    this.ParasRelation = [];
    //存放单个共享数据源对象
    //    this.SingelShareDataRelation = [];
    //存放当前页面所有的共享数据源对象
    this.PageAllShareDataRelation = [];

}

//输入，输出控件关系绑定类
function ShareDataRelationRealtimeClass(_ControlOutputPara, _RealtimeIntputPara, _Expression) {
    this.EntityPara = _RealtimeIntputPara;        //参数名称
    this.ControlPara = _ControlOutputPara;   //控件ID.参数
    this.RelationExpression = _Expression;      //关系表达式  参数名称=控件.输出参数
}

Agi.Msg.ShareDataRealTimeBindPara = new Agi.Msg.ShareDataRealTimeBindPara();