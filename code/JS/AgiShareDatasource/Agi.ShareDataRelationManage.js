/*
编写人：鲁佳
描述：维护共享数据源与控件的关系
*/

Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ShareDataRelationManage = function () {
    //添加关系项
    this.AddItem = function (shareID, controlID, state) {
        //这里做一个特殊处理，当一个控件切换绑定不同共享数据源时，应该把之前的控件与共享关系移除，除了chart控件外
        if (controlID.indexOf("BasicChart") < 0) {
            this.DeleteItem(controlID);
        }

        if (this.Existitems(shareID)) {
            var tempcontros = this.GetItemObj(shareID).controlID;
            var _state = false;
            for (var i = 0; i < tempcontros.length; i++) {
                if (tempcontros[i] == controlID) {
                    _state = true; break;
                }
            }
            if (!_state) {
                tempcontros.push(controlID);
            }
        }
        else {
            var item = { "shareID": shareID, "controlID": [controlID] };
            this.ShareRelation.push(item);
        }

        //绑定后查数据 提供给控件     state=true 共享数据源拖动到控件上时
        if (state) {
            var obj = { "shareID": shareID, "controlID": controlID };
            Agi.Msg.TriggerManage.ShareDataInAgivisEdit(obj);
        }

        /*
        一个控件只能绑定一个相同名称的dataset;    所以在同一控件中，相同的dataset共享数据源与关系数据为互斥关系。
        */
        try {
            //获取共享对应的dataset名称
            var _dsName = Agi.Msg.ShareDataRealTimeBindPara.GetShareItemObj(shareID).DatasetName;
            Agi.Msg.ParaBindManage.DeleteRelationItem(controlID, _dsName);
        }
        catch (e) { }
    }

    //检查是否存在
    this.Existitems = function (shareID) {
        var state = false;
        for (var i = 0; i < this.ShareRelation.length; i++) {
            if (this.ShareRelation[i].shareID == shareID) {
                state = true;
                break;
            }
        }
        return state;
    }

    //检查控件是否存在 2012-12-11添加
    this.ExistiemsControl = function (controlID) {
        var state = false;
        for (var i = 0; i < this.ShareRelation.length; i++) {
            for (var j = 0; j < this.ShareRelation[i].controlID.length; j++) {
                if (this.ShareRelation[i].controlID[j] == controlID) {
                    state = true;
                    return state;
                }
            }
        }
    }

    //返回对应的item对象
    this.GetItemObj = function (shareID) {
        var item;
        for (var i = 0; i < this.ShareRelation.length; i++) {
            if (this.ShareRelation[i].shareID == shareID) {
                item = this.ShareRelation[i];
                break;
            }
        }
        return item;
    }

    //移除对应项   2013-01-23修改
    this.DeleteItem = function (controlID) {
        for (var i = 0; i < this.ShareRelation.length; i++) {
            for (var j = 0; j < this.ShareRelation[i].controlID.length; j++) {
                if (this.ShareRelation[i].controlID[j] === controlID) {
                    this.ShareRelation[i].controlID.splice(j, 1);
                    j--;
                }
            }
            if (this.ShareRelation[i].controlID.length <= 0) {
                this.ShareRelation.splice(i, 1);
                i--;
            }
        }
    }

    //20130301 倪飘 移除对应项，共享数据源删除后移除所有的绑定了该共享数据源的关系
    this.DeleteItemByShareName = function (shareID) {
        if (this.Existitems(shareID)) {
            for (var i = 0; i < this.ShareRelation.length; i++) {
                if (this.ShareRelation[i].shareID == shareID) {
                    //删除共享数据源关联时清空绑定控件的数据
                     try {
                        for (var j = 0; j < this.ShareRelation[i].controlID.length; j++) {
                                Agi.Controls.FindControl(this.ShareRelation[i].controlID[j]).RemoveEntity(shareID);
                                j--;
                        }
                    } catch (e) {

                    }
                    this.ShareRelation.splice(i, 1);
                    i--;
                }
            }
        }
    }

    //根据控件ID和dataset名称查找是否在共享中存在关系，如果存在将删除
    //此方法在Agi.MenuManagement.js 关系实体拖动到控件上时用到
    this.DeleteSharaItem = function (controlID, datasetName) {
        try {
            var _shareName = Agi.Msg.ShareDataRealTimeBindPara.GetItemObj(datasetName).ShareDataName;
            /* old code
            for (var i = 0; i < this.ShareRelation.length; i++) {
            if (this.ShareRelation[i].controlID == controlID && this.ShareRelation[i].shareID == _shareName) {
            this.ShareRelation.splice(i, 1);
            break;
            }
            }
            */
            //2013-01-23
            for (var i = 0; i < this.ShareRelation.length; i++) {
                for (var j = 0; j < this.ShareRelation[i].controlID.length; j++) {
                    if (this.ShareRelation[i].controlID[j] === controlID && this.ShareRelation[i].shareID === _shareName) {
                        this.ShareRelation[i].controlID.splice(j, 1);
                        j--;
                    }
                }
                if (this.ShareRelation[i].controlID.length <= 0) {
                    this.ShareRelation.splice(i, 1);
                    i--;
                }
            }
        }
        catch (e) { }
    }

    this.clear = function () {
        this.ShareRelation = [];
    }

    this.ObjToString = function () {
        var ShareString = $.toJSON(this.ShareRelation);
        return ShareString;
    }

    this.StringToObj = function (strValue) {
        if (strValue != undefined && strValue != "" && strValue != []) {
            this.ShareRelation = $.evalJSON(strValue);
        }
    }

    this.ShareRelation = [];
}
Agi.Msg.ShareDataRelation = new Agi.Msg.ShareDataRelationManage();
