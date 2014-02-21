/**
* Created with JetBrains WebStorm.
* User: 鲁佳
* Date: 2012-11-12
* Time: 下午2:39
* 实现脚本公用方法封装
*/
Namespace.register('Agi.Script')
Agi.Script.Classlib = function () {
    /*
    根据控件ID查找控件对象;
    controlName:控件ID;
    */
    this.getControlObj = function (controlName) {
        var _tempObj = Agi.Controls.FindControl(controlName);
        return _tempObj;
    }

    /*
    获取参数值
    paraName:控件ID.参数名称
    返回：具体值
    */
    this.getParaValue = function (paraName) {
        return Agi.Msg.PageOutPramats.GetItem_Value(paraName.split(".")[0], paraName.split(".")[1]);
    }

    /*
    获取页面中所有控件,url的参数列表
    返回值：{"controlParas":["chart1.xvalue","chart1.yvalue"],"urlParas":["Url参数.pageName"]}
    */
    this.getOutputParas = function () {
        var _tempParasInfoArray = Agi.Msg.PageOutPramats.GetSerialData();
        var _returnValue = { "controlParas": [], "urlParas": [] };
        for (var i = 0; i < _tempParasInfoArray.length; i++) {
            for (var j = 0; j < _tempParasInfoArray[i].value.length; j++) {
                if (_tempParasInfoArray[i].MsgType == Agi.Msg.Enum.Controls) { //控件输出参数
                    _returnValue.controlParas.push(_tempParasInfoArray[i].key + "." + _tempParasInfoArray[i].value[j].Name);
                }
                else {  //url参数
                    if (_tempParasInfoArray[i].value[j].Name != null && _tempParasInfoArray[i].value[j].Name !="") {
                        _returnValue.urlParas.push(_tempParasInfoArray[i].key + "." + _tempParasInfoArray[i].value[j].Name);
                    }
                }
            }
        }
        return _returnValue;
    }

    /*
    获取当前页面中所有的控件列表
    */
    this.getControlsName = function () {
        var _tempControls = [];
        if (Agi.Edit.workspace.controlList) {
            var ControlsArray = Agi.Edit.workspace.controlList.toArray();
            if (ControlsArray != null && ControlsArray.length > 0) {
                for (var i = 0; i < ControlsArray.length; i++) {
                    _tempControls.push(ControlsArray[i].Get("ProPerty").ID);
                }
            }
        }
        return _tempControls;
    }

    /*
    获取各个控件的方法，属性列表;
    返回格式：[{"control":"chart1","method":["A","B"],"attribute":["att1","att2"]}]
    */
    this.getControlMethodAttribute = function () {
        var _tempControlsInfo = [];
        if (Agi.Edit.workspace.controlList) {
            var ControlsArray = Agi.Edit.workspace.controlList.toArray();
            if (ControlsArray != null && ControlsArray.length > 0) {
                for (var i = 0; i < ControlsArray.length; i++) {
                    var _tempItem = { "control": null, "method": [], "attribute": [] };
                    _tempItem.control = ControlsArray[i].Get("ProPerty").ID;
                    _tempControlsInfo.push(_tempItem);
                    this.allPrpos(ControlsArray[i], _tempItem);
                }
            }
        }
        return _tempControlsInfo;
    }


    this.allPrpos = function (obj, _tempItem) {
        for (var p in obj) {
            if (typeof (obj[p]) == "function") {
                _tempItem.method.push(p);
            } else {
                _tempItem.attribute.push(p);
            }
        }
    }


}

Agi.Script.ClasslibManage = new Agi.Script.Classlib();