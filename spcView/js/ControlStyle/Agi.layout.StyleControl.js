/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-11-3
 * Time: 下午6:42
 * To change this template use File | Settings | File Templates.
 *
 * 说明：控件样式应用处理类，包括加载样式文件、根据控件类型获取所需的样式信息
 */
/*0.注册Agi.layout 命名空间*/
Namespace.register("Agi.layout.StyleControl");

/*1.加载样式所需文件
* _FileList:样式所需文件列表(可包含.css和.js 文件)
* _callfun:加载成功后回调函数
* */
Agi.layout.StyleControl.LoadStyleFiles=function(_FileList,_callfun){
    Agi.Script.Import.LoadFileList(_FileList,_callfun);
}

/*2.根据控件类型和样式名称获取控件样式选项信息
* _ControlType:控件类型，控件特有标识(ControlType),如:Panel,BasicChart
* _ThemeInfo:控件皮肤名称
* */
Agi.layout.StyleControl.GetStyOptionByControlType = function (_ControlType, _ThemeName) {
    var ContorlTypeCname
    var AllControlsEnameAndCname = Agi.Msg.ControlNameExchange.GetControlNameExchangeList();
    for (var i = 0; i < AllControlsEnameAndCname.length; i++) {
        if (AllControlsEnameAndCname[i].Ename.trim() == _ControlType.trim()) {
            ContorlTypeCname = AllControlsEnameAndCname[i].Cname;
        }
    }

    return eval("Agi.layout.StyleControl.ControlStyList." + ContorlTypeCname + "." + _ThemeName);
}

/*
* 3.根据控件类型获取控件可用的皮肤名称列表
* _ControlType:控件类型
* */
Agi.layout.StyleControl.GetStyItemsByControlType=function(_ControlType){
    var StyItemsObj= eval("Agi.layout.StyleControl.ControlStyList."+_ControlType);
    var StyeItemNameList=[];
    if(StyItems!=null){
        for (var _param in StyItemsObj) {
            StyeItemNameList.push(_param);
        }
    }
    return StyeItemNameList;
}