/*
编写人：鲁佳
描述：控件参数与实体参数绑定关系
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.RealTimeParaBindRelation = function () {
    this.AddItem = function (_ControlOutputPara, _RealtimeIntputPara) {
        if (this.Isexistitems(_RealtimeIntputPara)) {
            this.GetItemObj(_RealtimeIntputPara).ControlPara = _ControlOutputPara;  //存在
            this.GetItemObj(_RealtimeIntputPara).RelationExpression = _RealtimeIntputPara + "=" + _ControlOutputPara;
        }
        else {
            this.ParasRelation.push(new RelationRealtimeClass(_ControlOutputPara, _RealtimeIntputPara, _RealtimeIntputPara + "=" + _ControlOutputPara)); //不存在
        }
    }

    //delete item
    this.DeleteItem = function (key) {
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (key == this.ParasRelation[i].ControlPara) {
                this.ParasRelation.splice(i, 1);
                i--;
                continue;
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
        }
    }


    //检查是否存在
    this.Isexistitems = function (_EntityPara) {
        var IsState = false;
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (this.ParasRelation[i].EntityPara == _EntityPara) {
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
    this.IsExistRelation = function (EntityIDName) {   //控件ID
        var state = false;
        for (var i = 0; i < this.ParasRelation.length; i++) {
            if (EntityIDName == this.ParasRelation[i].EntityPara) {
                state = true;
                break;
            }
        }
        return state;
    }


    this.RelevanceEntityControl = [];  //保存关系参数联动实体的控件

    this.Clear = function () {
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
//输入，输出控件关系绑定类
function RelationRealtimeClass(_ControlOutputPara, _RealtimeIntputPara, _Expression) {
    this.EntityPara = _RealtimeIntputPara;        //控件ID
    this.ControlPara = _ControlOutputPara;   //控件ID.参数
    this.RelationExpression = _Expression;      //关系表达式  实时控件ID=控件.输出参数
}

Agi.Msg.RealTimeParaBindManage = new Agi.Msg.RealTimeParaBindRelation();
//Agi.Msg.RealTimeParaBindManage.AddItem("控件001.value", "控件003");
//Agi.Msg.RealTimeParaBindManage.AddItem("控件001.select", "控件003");