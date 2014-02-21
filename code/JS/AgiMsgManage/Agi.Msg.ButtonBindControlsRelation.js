Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ButtonBindControls = function () {
    //保存
    this.SaveControlsRelation = function (ControlID, ArrObj) {
        if (this.Isexistitems(ControlID)) {
            for (var i = 0; i < this.ButtonBindControlsRelation.length; i++) {
                if (this.ButtonBindControlsRelation[i].ControlID == ControlID) {
                    this.ButtonBindControlsRelation[i].BindRelations = ArrObj;
                }
            }
        } else {
            this.ButtonBindControlsRelation.push({
                ControlID: ControlID,
                BindRelations: ArrObj
            });
        }
    }

    //判断是否存在
    this.Isexistitems = function (ControlID) {
        var IsExist = false;
        for (var i = 0; i < this.ButtonBindControlsRelation.length; i++) {
            if (this.ButtonBindControlsRelation[i].ControlID == ControlID) {
                IsExist = true;
            }
        }
        return IsExist;
    }


    //返回单个对象
    this.FindSingelObj = function (ControlID) {
        if (this.Isexistitems(ControlID)) {
            for (var i = 0; i < this.ButtonBindControlsRelation.length; i++) {
                if (this.ButtonBindControlsRelation[i].ControlID == ControlID) {
                    return this.ButtonBindControlsRelation[i];
                }
            }
        }
    }

    //转换成string
    this.SaveAllShareToString = function () {
        var ShareString = $.toJSON(this.ButtonBindControlsRelation);
        return ShareString;
    }

    //将获取到的字符串转成数组显示
    this.GetShareStringToArray = function (ShareString) {
        if (ShareString != undefined && ShareString != "" && ShareString != []) {
            this.ButtonBindControlsRelation = $.evalJSON(ShareString);
        }
    }

    //20130522 倪飘 解决bug，在有查询按钮控制的参数联动中，删除查询按钮以后，无法再进行参数联动；
    //删除单个对象
    this.DeleteSingelObj = function (ControlID) {
        if (this.Isexistitems(ControlID)) {
            for (var i = 0; i < this.ButtonBindControlsRelation.length; i++) {
                if (this.ButtonBindControlsRelation[i].ControlID == ControlID) {
                    this.ButtonBindControlsRelation.splice(i,1);
                }
            }
        }
    }


    /*
    add by lj    
    获取control是否屏蔽了即时联动功能
    此方法在Agi.Msg.Trigger.js中用到
    */
    this.getState = function (_controls) {
        for (var i = 0; i < this.ButtonBindControlsRelation.length; i++) {
            var controls = this.ButtonBindControlsRelation[i].BindRelations;
            for (var j = 0; j < controls.length; j++) {
                if (_controls == controls[j].ControlID && controls[j].IsBind == false) {  //false：屏蔽了联动事件的控件
                    return true;
                }
            }
        }
        return false;
    }

    this.ButtonBindControlsRelation = [];
}

Agi.Msg.ButtonBindControls = new Agi.Msg.ButtonBindControls();