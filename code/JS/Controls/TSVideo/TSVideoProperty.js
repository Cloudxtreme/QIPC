/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * To change this template use File | Settings | File Templates.
 */
//1、属性初始化
Agi.Controls.TSVideoPropertyInit = function (TSVideo) {
    //
    var selfID = $("#" + TSVideo.shell.BasicID)
    //
    var ThisProItems = [];
    //绘制属性配置界面
    var bindHTML = $('<form class="form-horizontal"></form>');
    //基本属性
    var ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicProperty_Radius'>");
    ItemContent.append("<table class='RadiusTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityTSVideoTabletd0'colspan='2'>"
        + "视屏源"
        + "</td>");
    ItemContent.append("<td class='prortityTSVideoTabletd0'colspan='2'>"
        + "<input type='text' value='' id='TSVideoPropertySource'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityTSVideoTabletd0'colspan='2'>"
        + "视屏源(插件)"
        + "</td>");
    ItemContent.append("<td class='prortityTSVideoTabletd0'colspan='2'>"
        + "<input type='text' value='' id='TSVideoPropertySource2'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityTSVideoTabletd0'colspan='4'>"
        + "<input type='button' value='保存' id='TSVideoPropertySave' class='btnclass'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    //
    var PropertySettingsHtml = $(ItemContent.toString());
    //
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"基本设置", DisabledValue:1, ContentObj:PropertySettingsHtml }));
    //
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
//        var itemtitle = _item.Title;
//        if (_item.DisabledValue == 0) {
//            itemtitle += "禁用";
//        } else {
//            itemtitle += "启用";
//        }
//        alert(itemtitle);
    }
    //初始化控件属性
    var control = Agi.Edit.workspace.currentControls[0];
    var propertySettings = control.Get("PropertySettings")
    $("#TSVideoPropertySource").val(propertySettings.videoSource)
    $("#TSVideoPropertySource2").val(propertySettings.videoSource2)
    //
}
//2、属性事件
$("#TSVideoPropertySave").live(
    "click",
    function () {
        var control = Agi.Edit.workspace.currentControls[0];
        var propertySettings = control.Get("PropertySettings")
        propertySettings.videoSource = $("#TSVideoPropertySource").val()
        propertySettings.videoSource2 = $("#TSVideoPropertySource2").val()
        control.Set("PropertySettings", propertySettings)
        control.initData(true);
    })

//3、属性保存