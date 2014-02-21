/**
 * Created with JetBrains WebStorm.
 * User: 张鹏
 * Date: 12-12-29
 * Time: 下午1:06
 * To change this template use File | Settings | File Templates.
 * 使用jquery ui 中的 dialog 组件封装自定义对话框
 * 这里有两种alert和confirm对话框 ，可以根据框架主题皮肤换肤。
 */
/*jshint strict:true */
/*global Namespace: true,Agi:true */
Namespace.register("Agi.CommonDialogBox");

Agi.CommonDialogBox = function () {
    "use strict";
    var self = this;
    //消息提示框
    self.Alert = function (content, title) {
        var messageFrame,
            dialog;
        messageFrame = "<div id='custom_alert_'>" + content + "</div>";
        dialog = $(messageFrame).dialog({
            resizable:false,
            //draggable: false,
            zIndex:50000,
            modal:true,
            dialogClass:"alert",
            title:(title === null || title === undefined)  ? "信息提示" : title,
            buttons:{
                "确定":function () {
                    $(this).dialog("destroy");
                    $("#custom_alert_").remove(); //弹出alert框后需要清除alert框
                    $('div[id="Agi-Common-DialogBox-Alert"]').remove(); //清除遮罩层
                }
            }
        }).parent().attr('id', 'Agi-Common-DialogBox-Alert');//设置id主要应用CSS设置样式（code/CSS/FrameThemes/theme1.css和code/CSS/FrameThemes/theme2.css）

        $(dialog).find("button").addClass("btn btn-primary");//应用bootstrap中的样式（code/assets/css/bootstrap-responsive.css）
    };

    //消息提示框
    self.CallBakAlert = function (content, title,_CllBakFunction,hideCloseBtn) {
        var messageFrame,
            dialog;
        messageFrame = "<div id='custom_alert_'>" + content + "</div>";
        dialog = $(messageFrame).dialog({
            closeOnEscape:!hideCloseBtn ? true : false,
            resizable:false,
            //draggable: false,
            zIndex:50000,
            modal:true,
            dialogClass:"alert",
            title:(title === null || title === undefined)  ? "信息提示" : title,
            open: function(event, ui) {
                $(event.target.parentElement).find('>div.ui-widget-header>a.ui-dialog-titlebar-close').css('display',hideCloseBtn ? 'none' : 'block');
            },
            buttons:{
                "确定":function () {
                    $(this).dialog("destroy");
                    $("#custom_alert_").remove(); //弹出alert框后需要清除alert框
                    $('div[id="Agi-Common-DialogBox-Alert"]').remove(); //清除遮罩层
                    if(_CllBakFunction)
                    {
                        _CllBakFunction();//执行回调
                    }
                }
            }
        }).parent().attr('id', 'Agi-Common-DialogBox-Alert');//设置id主要应用CSS设置样式（code/CSS/FrameThemes/theme1.css和code/CSS/FrameThemes/theme2.css）

        $(dialog).find("button").addClass("btn btn-primary");//应用bootstrap中的样式（code/assets/css/bootstrap-responsive.css）
    };

    //询问框
    self.Confirm = function (content, title, callback) {
        var messageFrame,
            dialog;

        messageFrame = "<div id='custom_confirm_'>" + content + "</div>";
        dialog = $(messageFrame).dialog({
            resizable:false,
            //draggable: false,
            zIndex:50000,
            modal:true,
            title:title === null ? "信息提示" : title,
            buttons:{
                "确定":function () {
                    $(this).dialog("destroy");
                    $("#custom_confirm_").remove();
                    $('div[id="Agi-Common-DialogBox-Confirm"]').remove();
                    if (callback !== null) {
                        callback.call(null, true);
                    }
                },
                "取消":function () {
                    $(this).dialog("destroy");
                    $("#custom_confirm_").remove();
                    $('div[id="Agi-Common-DialogBox-Confirm"]').remove();
                    if (callback !== null) {
                        callback.call(null, false);
                    }
                }
            }
        }).parent().attr('id', 'Agi-Common-DialogBox-Confirm');

        $(dialog).find("button").addClass("btn btn-primary").css({"font-size":"12px","padding":"5px 14px 6px"});
    };
    //询问框,显示详情
    self.ConfirmDetail = function (content, title,DetailContent, callback) {
        var messageFrame,
            dialog;

        messageFrame = "<div id='custom_confirm_'><div>" + content + "</div><div style='border-top:solid 1px #f2f2f2; line-height:35px;'>" +
            "<a id='ShowDetailbtn' href='#' style='color:#64acf4;font-family:'微软雅黑 宋体'>+详情</a></div>" +
            "<div id='ditailCoentDiv' style='width:100%;height:150px;overflow:auto;white-space:nowrap;display:none;' data-visibel='false'>"+
            DetailContent+"</div></div>";
        dialog = $(messageFrame).dialog({
            resizable:false,
            //draggable: false,
            zIndex:50000,
            width:500,
            modal:true,
            title:title === null ? "信息提示" : title,
            buttons:{
                "确定":function () {
                    $(this).dialog("destroy");
                    $("#custom_confirm_").remove();
                    $('div[id="Agi-Common-DialogBox-Confirm"]').remove();
                    if (callback !== null) {
                        callback.call(null, true);
                    }
                },
                "取消":function () {
                    $(this).dialog("destroy");
                    $("#custom_confirm_").remove();
                    $('div[id="Agi-Common-DialogBox-Confirm"]').remove();
                    if (callback !== null) {
                        callback.call(null, false);
                    }
                }
            }
        }).parent().attr('id', 'Agi-Common-DialogBox-Confirm');
        $(dialog).find("#ShowDetailbtn").unbind().bind("click",function(ev){
            if($("#ditailCoentDiv").data("visibel")=="true"){
                $("#ditailCoentDiv").hide();
                $("#ditailCoentDiv").data("visibel","false");
                $(this).html("+展开详情");
            }else{
                $("#ditailCoentDiv").show();
                $("#ditailCoentDiv").data("visibel","true");
                $(this).html("-隐藏详情");
            }
        })
        $(dialog).find("button").addClass("btn btn-primary").css({"font-size":"12px","padding":"5px 14px 6px"});
    };
    //输入框
    self.Prompt = function (content, title, callback) {
        var messageFrame,
            dialog;

        messageFrame = "<div id='custom_prompt_'>" + content + "<input type='text' id='newName_text'/></div>";
        dialog = $(messageFrame).dialog({
            resizable:false,
            //draggable: false,
            zIndex:50000,
            modal:true,
            title:title === null ? "消息提示" : title,
            buttons:{
                "确定":function () {
                    var newName = $("#newName_text").val();
                    $(this).dialog("destroy");
                    $("#custom_prompt_").remove();
                    $('div[id="Agi-Common-DialogBox-Prompt"]').remove();
                    if (callback !== null) {
                        callback.call(null, true,newName);
                    }
                },
                "取消":function () {
                    $(this).dialog("destroy");
                    $("#custom_prompt_").remove();
                    $('div[id="Agi-Common-DialogBox-Prompt"]').remove();
                    if (callback !== null) {
                        callback.call(null, false,null);
                    }
                }
            }
        }).parent().attr('id', 'Agi-Common-DialogBox-Prompt');
        $(dialog).find("button").addClass("btn btn-primary").css("font-size","12px");
    };
};
var AgiCommonDialogBox = new Agi.CommonDialogBox();
