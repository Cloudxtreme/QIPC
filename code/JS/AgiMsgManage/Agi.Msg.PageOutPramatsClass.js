/*
编写人:      鲁佳
描述:         页面参数操作类
自定义参数说明：
AddItems 加入一个对象到数组
RemoveItems 从数组中移除一个对象
Isexistitems  对象是否已经存在
RemoveAll 清空数组
GetItemValue 返回value值
ItemsCount 返回数组长度
*/

//定义消息枚举
Namespace.register("Agi.Msg.Enum");
Agi.Msg.Enum.Controls = "ControlsType";
Agi.Msg.Enum.Url = "UrlType";


Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/

Agi.Msg.PageOutPramatsClass = function () {
    //添加元素
    this.AddPramats = function (objcet) {
        if (this.Isexistitems(objcet.Key)) {   //存在
            this.GetItemObject(objcet.Key).value = objcet.ChangeValue;  //update
            this.GetItemObject(objcet.Key).MsgType = objcet.Type //消息类型
        }
        else {
            var temp = new FrameWork_Dictionary(); //insert
            temp.key = objcet.Key;
            temp.value = objcet.ChangeValue;
            temp.MsgType = objcet.Type;
            this.OutPramats.push(temp);
        }
    }

    //update方法
    this.PramatsChange = function (objcet) {
        if (this.Isexistitems(objcet.Key)) {   //存在
            this.GetItemObject(objcet.Key).value = objcet.ChangeValue;  //update
            this.GetItemObject(objcet.Key).MsgType = objcet.Type //消息类型
        }
    }

    //    //移除指定参数
    //    this.DeletePramats = function (ParaArray) {
    //        for (var i = 0; i < ParaArray.length; i++) {
    //            for (var j = 0; j < this.OutPramats.length; j++) {
    //                if (ParaArray[i] == this.OutPramats[j].key) {
    //                    this.RemoveItems(this.OutPramats[j].key);
    //                    //同时移除相应的绑定关系
    //                    FrameWork_ParaBindRelationClass.DeleteItem(ParaArray[i]);
    //                    break;
    //                }
    //            }
    //        }
    //    }

    //移除指定元素
    this.RemoveItems = function (key) {
        var returnValue = null;  //这个值用来做撤销用的
        for (var i = 0; i < this.OutPramats.length; i++) {
            if (this.OutPramats[i].key == key) {
                returnValue = this.OutPramats[i];
                Agi.Msg.ParaBindManage.RemoveRelation(key);  //移除关系项
                this.OutPramats.splice(i, 1);
                break;
            }
        }
        return returnValue;
    }

    //移除url参数
    this.RemoveUrlItems = function (key, pName) {
        for (var i = 0; i < this.OutPramats.length; i++) {
            if (this.OutPramats[i].key == key) {
                for (var j = 0; j < this.OutPramats[i].value.length; j++) {
                    if (this.OutPramats[i].value[j].Name == pName) {
                        this.OutPramats[i].value.splice(j, 1);
                        //20130509 倪飘 修改bug，URL参数配置中无参数时，参数配置面板中应该不显示URL参数
                        //20130509 倪飘 当没有URL参数时，将URL的整个数组删除
                        if (this.OutPramats[i].value.length < 1) {
                            this.OutPramats.splice(i, 1);
                        }
                        break;
                    }
                }
            }
        }
    }

    //撤销时用到
    this.AddObj = function (obj) {
        if (obj != null) {
            this.OutPramats.push(obj);
        }
    }

    //获取value值
    this.GetItemValue = function (key) {
        for (var i = 0; i < this.OutPramats.length; i++) {
            if (this.OutPramats[i].key == key) {
                return this.OutPramats[i].value;
            }
        }
    }

    /*
    获取具体value
    2012-09-09新增方法
    返回示例: "2012-01-01";
    */
    this.GetItem_Value = function (key, paraName) {
        var value = null;
        for (var i = 0; i < this.OutPramats.length; i++) {
            if (this.OutPramats[i].key == key) {
                for (var j = 0; j < this.OutPramats[i].value.length; j++) {
                    if (paraName == this.OutPramats[i].value[j].Name) {
                        value = this.OutPramats[i].value[j].Value;
                        break;
                    }
                }
            }
        }
        return value;
    }


    //获取item对象
    this.GetItemObject = function (key) {
        for (var i = 0; i < this.OutPramats.length; i++) {
            if (this.OutPramats[i].key == key) {
                return this.OutPramats[i];
            }
        }
    }

    //移除所有元素
    this.RemoveAll = function () {
        this.OutPramats.splice(0);
    }

    //获取元素个数
    this.ItemsCount = function () {
        return this.OutPramats.length;
    }

    //元素是否存在
    this.Isexistitems = function (key) {
        var IsExisti = false;
        for (var i = 0; i < this.OutPramats.length; i++) {
            if (this.OutPramats[i].key == key) {
                IsExisti = true;
                break;
            }
        }
        return IsExisti;
    }

    //此方法提供给参数配置面板使用
    this.GetSerialData = function () {
        var tempControlArray = [];
        var tempUrlArray = [];
        for (var i = 0; i < this.OutPramats.length; i++) {
            if (this.OutPramats[i].MsgType == Agi.Msg.Enum.Controls) {
                tempControlArray.push(this.OutPramats[i]);
            }
            else {
                tempUrlArray.push(this.OutPramats[i]);
            }
        }
        return tempControlArray.concat(tempUrlArray);  //合并数组
    }

    //加载实体参数时用到     此方法提供给参数配置面板使用
    this.GetEntityParas = function () {
        var ReturnData = [];
        for (var i = 0; i < Agi.Edit.workspace.controlList.toArray().length; i++) {
            var temp = new FrameWork_ControlIDParaName();
            var _controlObj = Agi.Edit.workspace.controlList.toArray()[i];
            temp.ControlID = _controlObj.Get("ProPerty").ID; //控件ID

            //获取实体
            var ThisControlEntitys = _controlObj.Get("Entity");
            if (ThisControlEntitys != null && ThisControlEntitys.length > 0) {
                for (var j = 0; j < ThisControlEntitys.length; j++) {
                    var tempEntityName = ThisControlEntitys[j].Key;
                    if (ThisControlEntitys[j].IsShareEntity != true) { //不是共享
                        var paras = ThisControlEntitys[j].Parameters;
                        if (paras != null) {
                            for (var z = 0; z < paras.length; z++) {
                                /*
                                说明：共享数据源的Key为小写“key” 关系数据源为大写“Key”
                                这里只需要关系数据源的信息，所以就用if (paras[z].Key != null)来判断了
                                */
                                //if (paras[z].Key != null) {
                                temp.ParaName.push({ "ShowName": tempEntityName + "." + paras[z].Key, "EntityName": tempEntityName });
                                //}
                            }
                        }
                    }
                }
            }
            if (temp.ParaName.length > 0) {
                ReturnData.push(temp);
            }
        }
        return ReturnData;
    }

    //加载控件列表用到
    this.GetControls = function () {
        var ReturnData = [];
        for (var i = 0; i < Agi.Edit.workspace.controlList.toArray().length; i++) {

            var temp = new FrameWork_ControlIDParaName();
            var _controlObj = Agi.Edit.workspace.controlList.toArray()[i];
            if (_controlObj.AttributeList[1].Value == "RealTimeLable" || _controlObj.AttributeList[1].Value == "DynamicChart") {
                ReturnData.push(_controlObj.Get("ProPerty").ID); //控件ID
            }
        }
        return ReturnData;
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

    this.Clear = function () {
        this.OutPramats = [];
    }

    this.OutPramats = [];
}

function FrameWork_Dictionary() {
    this.key = null;
    this.value = null;
    this.MsgType = null;
}
//控件与控件参数
function FrameWork_ControlIDParaName() {
    this.ControlID = null;
    this.ParaName = [];
}
//实体与实体参数
function FrameWork_ParasList() {
    this.EntityObject = null;
    this.Paras = [];
}

Agi.Msg.PageOutPramats = new Agi.Msg.PageOutPramatsClass();
//Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Controls, 'Key': 'Chart001', 'ChangeValue': [{ 'Name': 'v1', 'Value': 0 }, { 'Name': 'v2', 'Value': 0}] });
//Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Controls, 'Key': 'Chart03301', 'ChangeValue': [{ 'Name': 'v1', 'Value': 0 }, { 'Name': 'v2', 'Value': 0}] });
//Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Controls, 'Key': 'Chart02301', 'ChangeValue': [{ 'Name': 'v1', 'Value': 0 }, { 'Name': 'v2', 'Value': 0}] });
//Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Controls, 'Key': 'Chart44001', 'ChangeValue': [{ 'Name': 'v1', 'Value': 0 }, { 'Name': 'v2', 'Value': 0}] });
//Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Controls, 'Key': 'Grid001', 'ChangeValue': [{ 'Name': 'v1', 'Value': 0}] });
//Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Url, 'Key': 'Url参数', 'ChangeValue': [{ 'Name': 'v1', 'Value': 0 }, { 'Name': 'v12', 'Value': 0 }, { 'Name': 'v123', 'Value': 0}] });

