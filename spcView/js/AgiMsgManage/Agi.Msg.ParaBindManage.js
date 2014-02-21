/*
编写人：鲁佳
描述：控件参数与实体参数绑定关系
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ParaBindRelation = function () {
    this.AddItem = function (_ControlPara, _EntityPara) {
        var _RelationExpression = AgiMsgGetGeyValue(_EntityPara);
        if(!this.Isexistitems(_ControlPara,_EntityPara)){
            this.ParasRelation.push(new RelationEntityClass(_ControlPara, _EntityPara, _RelationExpression.value + "=" + _ControlPara)); //不存在
        }
    }

    //delete item
    this.DeleteItem = function (_ControlPara,_EntityPara) {
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (_ControlPara == this.ParasRelation[i].ControlPara&&_EntityPara==this.ParasRelation[i].EntityPara) {
                this.ParasRelation.splice(i, 1);
                i--;
                continue;
            }
        }
    }

    //根据控件ID，dataset名称移除对应的关系
    //此方法在用AgiShareDatasource/Agi.ShareDataRelationManage.js 添加方法中用到
    this.DeleteRelationItem = function (controlID, datasetName) {
        for (var i = 0; i < this.ParasRelation.length; i++) {
            var patt = new RegExp(controlID); //要查找的字符串
            var iscontrol = patt.test(this.ParasRelation[i].EntityPara);
            var patt1 = new RegExp(datasetName); //要查找的字符串
            var isds = patt1.test(this.ParasRelation[i].EntityPara);
            if (iscontrol = true && isds == true) {
                this.ParasRelation.splice(i, 1);
                i--;
            }
        }
    }

    //移除关系项
    this.RemoveRelation = function (controlID) {
        for (var i = 0; i < this.ParasRelation.length; i++) {
            var patt = new RegExp(controlID); //要查找的字符串
            if (patt.test(this.ParasRelation[i].ControlPara)) {
                this.ParasRelation.splice(i, 1);
                i--;
            }
            //            if (this.ParasRelation[i].ControlPara.indexof(controlID) > -1) {
            //                this.ParasRelation.splice(i, 1);
            //                i--;
            //            }
        }
    }


    //检查是否存在
    this.Isexistitems = function (_ControlPara, _EntityPara) {
        var IsState = false;
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (this.ParasRelation[i].EntityPara == _EntityPara&&this.ParasRelation[i].ControlPara==_ControlPara) {
                IsState = true;
                break;
            }
        }
        return IsState;
    }

    //返回匹配的item对象
    this.GetItemObj = function (_EntityPara) {
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (this.ParasRelation[i].EntityPara == _EntityPara) {
                return this.ParasRelation[i];
            }
        }
    }

    //是否存在绑定关系
    this.IsExistRelation = function (EntityIDName) {   //控件ID_实体.参数
        var state = false;
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (EntityIDName == this.ParasRelation[i].EntityPara) {
                state = true;
                break;
            }
        }
        return state;
    }


    /*
    根据控件ID_实体.接收参数查找输入参数
    2012-09-09新增方法
    */
    this.GetOutPutControlPara = function (objcet,ControlEntity) {
        var value = null;
        for (var i = 0; i < this.ParasRelation.length; i++) {
            var isUrl=this.isUrlParam(this.ParasRelation[i].ControlPara);
            if(objcet.Type == Agi.Msg.Enum.Url){
                if(!isUrl){
                    continue;
                }
            }
            else if(objcet.Type == Agi.Msg.Enum.Controls){
                if(isUrl){
                    continue;
                }
            }

            if (this.ParasRelation[i].EntityPara == ControlEntity) {
                value = this.ParasRelation[i].ControlPara;
                break;
            }
        }
        return value;
    }

    this.isUrlParam=function(controlParam){
        if(controlParam.toString().split('.')[0]=="Url参数"){
            return true;
        }
        else{
            return false;
        }
    }

    //    //参数联动事件触发
    //    this.ParaChangeEvent = function (objID) {
    //        var ReturnData = [];
    //        //#region
    //        if (this.ParasRelation.length > 0) {
    //            var tempArrayList = this.CloneObj(this.ParasRelation);  //复制绑定关系副本数组
    //            for (var i = 0; i < tempArrayList.length; i++) {
    //                if (i == 0) {
    //                    var temp = new tempEntityClass();
    //                    temp.EntityName = tempArrayList[i].EntityPara.split(".")[0];
    //                    temp.Para.push(tempArrayList[i].EntityPara.split(".")[1] + "=" + FrameWork_PageOutPramats.GetItemValue(tempArrayList[i].ControlPara));
    //                    ReturnData.push(temp);
    //                }
    //                else {
    //                    var IsState = false;
    //                    for (var j = 0; j < ReturnData.length; j++) {
    //                        if (tempArrayList[i].EntityPara.split(".")[0] == ReturnData[j].EntityName) {
    //                            IsState = true;
    //                            break;
    //                        }
    //                    }
    //                    if (IsState) {
    //                        ReturnData[j].Para.push(tempArrayList[i].EntityPara.split(".")[1] + "=" + FrameWork_PageOutPramats.GetItemValue(tempArrayList[i].ControlPara));
    //                    }
    //                    else {
    //                        var temp = new tempEntityClass();
    //                        temp.EntityName = tempArrayList[i].EntityPara.split(".")[0];
    //                        temp.Para.push(tempArrayList[i].EntityPara.split(".")[1] + "=" + FrameWork_PageOutPramats.GetItemValue(tempArrayList[i].ControlPara));
    //                        ReturnData.push(temp);
    //                    }
    //                }
    //            }
    //        }
    //        //#endregion
    //        //查找与发起事件对象关联的实体，并可以找到关联的控件 并且通知控件
    //        //1.根据控件名称查找绑定关系的实体
    //        //#region
    //        var tempEntityNameArray = [];
    //        for (var i = 0; i < this.ParasRelation.length; i++) {
    //            if (this.ParasRelation[i].ControlPara.split(".")[0] == objID) {
    //                var isState = false;
    //                for (var j = 0; j < tempEntityNameArray.length; j++) {
    //                    if (tempEntityNameArray[j] == this.ParasRelation[i].EntityPara.split(".")[0]) {
    //                        isState = true;
    //                        break;
    //                    }
    //                }
    //                if (!isState) { tempEntityNameArray.push(this.ParasRelation[i].EntityPara.split(".")[0]); }
    //            }
    //        }
    //        //2.找到实体后，在根据控件查找记录有那些控件绑定过该实体
    //        for (var i = 0; i < tempEntityNameArray.length; i++) {
    //            for (var j = 0; j < FrameWork_Layout.length; j++) {
    //                if (FrameWork_Layout[j].ChildControl != null) {
    //                    for (var z = 0; z < FrameWork_Layout[j].ChildControl.ChildControls[0].GetEntityNames().length; z++) {
    //                        if (FrameWork_Layout[j].ChildControl.ChildControls[0].GetEntityNames()[z] == tempEntityNameArray[i]) {
    //                            this.RelevanceEntityControl.push(FrameWork_Layout[j]);
    //                            break;
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        //#endregion
    //        for (var i = 0; i < ReturnData.length; i++) {
    //            var isState = false;
    //            for (var j = 0; j < tempEntityNameArray.length; j++) {
    //                if (ReturnData[i].EntityName == tempEntityNameArray[j]) {
    //                    isState = true; break;
    //                }
    //            }
    //            if (isState) {
    //                var EntityObj = EntiyInfo_GetEntityByName(ReturnData[i].EntityName);  //查找实体
    //                var tempPara = "";
    //                for (var j = 0; j < ReturnData[i].Para.length; j++) {
    //                    tempPara += ReturnData[i].Para[j] + "#";
    //                }
    //                if (tempPara.length > 0) {
    //                    tempPara = tempPara.substring(0, tempPara.length - 1);
    //                }
    //                //查数据
    //                this.IsParaChangetrigger = true;
    //                EntiyInfo_GetDataInfoByEntityName(EntityObj.EntityBaseInfo, tempPara, false, "", "");
    //            }
    //        }
    //        return ReturnData;
    //    }

    this.IsParaChangetrigger = false; //是否为参数联动时触发
    this.RelevanceEntityControl = [];  //保存关系参数联动实体的控件

    this.Clear = function () {
        this.IsParaChangetrigger = false;
        this.RelevanceEntityControl = [];
    }
    /*克隆对象*/
    this.CloneObj = function (_DataObj) {
        var objClone;
        if (_DataObj.constructor == Object) objClone = new _DataObj.constructor();
        else objClone = new _DataObj.constructor(_DataObj.valueOf());
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
    }

    this.ObjToString = function () {
        var Str = "";
        for (var i = 0; i < this.ParasRelation.length; i++) {
            Str += this.ParasRelation[i].EntityPara + "#" + this.ParasRelation[i].ControlPara + "##";
        }
        if (Str.length > 0) {
            Str = Str.substring(0, Str.length - 2);
        }
        return Str;
    }

    this.StringToObj = function (strValue) {
        try {
            if (strValue.length > 0) {
                var tempArray = strValue.split("##");
                for (var i = 0; i < tempArray.length; i++) {
                    this.AddItem(tempArray[i].split("#")[1], tempArray[i].split("#")[0]);
                }
            }
        }
        catch (e) { }
    }

    this.ParasRelation = [];
}
//关系实体
function RelationEntityClass(_ControlPara, _EntityPara, _Expression) {
    this.EntityPara = _EntityPara;        //控件ID_实体.参数
    this.ControlPara = _ControlPara;   //控件ID.参数
    this.RelationExpression = _Expression;      //关系表达式  实体.接收参数=控件.输出参数
}

function tempEntityClass() {
    this.EntityName = null;
    this.Para = [];  //参数列表:名称=值
}

function AgiMsgGetGeyValue(_strvalue) {
    var t = _strvalue.indexOf("_");
    var temp = { "key": null, "value": null };
    temp.key = _strvalue.substring(0, t);
    temp.value = _strvalue.substring(t + 1, _strvalue.length);
    return temp;
}

Agi.Msg.ParaBindManage = new Agi.Msg.ParaBindRelation();
//Agi.Msg.ParaBindManage.AddItem("控件001.value", "控件003_实体001.begin");
//Agi.Msg.ParaBindManage.AddItem("控件001.select", "控件003_实体001.end");