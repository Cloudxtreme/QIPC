/*
编写人：鲁佳
描述：button查询控件 查询逻辑js
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ButtonQuery = function () {
    //obj ={"sender":_ControlObj,"Type":Agi.Msg.Enum.Controls}
    this.send = null;
    this.queryEvent = function (obj) {
        this.send = obj; //button查询控件对象
        var tempControls = Agi.view.workspace.controlList.toArray(); //控件集合  这里需注意 编辑环境为agi.edit 预览为agi.view
        var _realations = Agi.Msg.ButtonBindControls.FindSingelObj(this.send.sender.shell.BasicID); //查找button绑定的控件集合
        for (var i = 0; i < tempControls.length; i++) {
            //            //20130522 倪飘 解决bug，查询的控制联动功能，如果if判断放开将刷新所有控件
            //            var RealationList = Agi.Msg.ButtonBindControls.ButtonBindControlsRelation;
            //            if (RealationList.length > 0) {
            //                for (var j = 0; j < RealationList.length; j++) {
            //                    for (var o = 0; o < RealationList[j].BindRelations.length; o++) {
            //                        var conid = tempControls[i].Get("HTMLElement").id;
            //                        var tempconid = conid.substr(conid.indexOf('_') + 1, conid.length);
            //                        if (tempconid === RealationList[j].BindRelations[o].ControlID) {
            //                            this.foecahEntity(tempControls[i]);
            //                        }
            //                    }
            //                }
            //            }
            //            //end

            //begin 20130524 鲁佳 （1）button需要配置关联的控件，控件才能刷新；（2）页面上有多个button不再会相互影响；
            if (_realations != undefined) {  //有关系
                for (var ii = 0; ii < _realations.BindRelations.length; ii++) {
                    if ((tempControls[i].Get("ProPerty").ID === _realations.BindRelations[ii].ControlID) //判断数据控件是否与button绑定了关系
                        && _realations.BindRelations[ii].IsBind == false) {  //逻辑反了，这里等于false的意思是与button有关联
                        this.foecahEntity(tempControls[i]);
                    }
                }
            }
            //end
        }
    }

    //遍历控件中的实体
    this.foecahEntity = function (_controlObj) {
        for (var i = 0; i < _controlObj.Get("Entity").length; i++) { //获取控件的实体集合
            var _obj = {
                "control": _controlObj,
                "entityName": _controlObj.Get("Entity")[i].Key,
                "entityObj": _controlObj.Get("Entity")[i],
                "paras": _controlObj.Get("Entity")[i].Parameters //获取控件实体的参数数组
            };
            if (_controlObj.Get("Entity")[i].IsShareEntity != true) {
                this.relationData(_obj); //关系
            }
            else {
                this.shareData(_obj);   //共享
            }
        }
    }

    //关系数据
    this.relationData = function (_controlObj) {
        this.relationParasSetting(_controlObj);
    }

    //共享数据
    this.shareData = function (_controlObj) {
        var tempobj = Agi.Msg.ShareDataRealTimeBindPara.GetitemObject(_controlObj.entityName, 1); //获取dataset参数
        Agi.Msg.TriggerManage.ShareDataQueryData(tempobj, true);  //（1）查数据；（2）数据过滤；（3）提供给控件
    }

    //给关系实体参数赋值
    this.relationParasSetting = function (_control) {
        for (var i = 0; i < _control.paras.length; i++) {

            var temp = _control.control.Get("ProPerty").ID + "_" + _control.entityName + "." + _control.paras[i].Key;

            var _getValue = Agi.Msg.ParaBindManage.GetOutPutControlPara(Agi.Msg.Enum.Controls,temp); //(1)传入参数：控件ID_实体名称.实体参数;   (2)返回值：控件id.参数   //关联的控件参数

            if (_getValue != null) {

                var _tempValue = Agi.Msg.PageOutPramats.GetItem_Value(_getValue.split('.')[0], _getValue.split('.')[1]); //获取具体值

                if (_tempValue != null) {
                    _control.paras[i].Value = _tempValue;
                }
            }
        }
        //触发控件的联动方法
        _control.control.ParameterChange({ "Type": Agi.Msg.Enum.Controls, "sender": this.send.sender, "Entity": _control.entityObj });
    }
}

Agi.Msg.BtnQuery = new Agi.Msg.ButtonQuery();