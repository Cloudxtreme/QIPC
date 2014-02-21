/**
单值图面板配置
 */
define(function () {
    var panelId = 'customizePropertydialog';
    var tabId = 'customizePropertyTab';
    var self = {};

    var myCallBack = undefined;
    var initial = function(){
        //debugger;
        var htmlStr = "";
        htmlStr = '<div id="' + panelId + '" title="单值图配置" class="hide">' +
            '</div>';
        var panel = $(htmlStr);
        panel.load('js/CustomizeProperty/tabTemplates.html #'+tabId, function () {
            panel.appendTo($('body:first'));
            self.dialogBox = $('#' + panelId).dialog({
                zIndex:1000000,
                width:620,
                height:400,
                'min-height':488,
                resizable:false,
                position:'middle',
                autoOpen:false,
                modal:true,
                buttons:{
                    "确定":function () {
                        $(this).dialog("close");
                        myCallBack(property);
                    },
                    "取消":function () {
                        $(this).dialog("close");
                    }
                }
            });
            self.tabs = $("#" + tabId).tabs();
        });
    };

    initial();

    var property = {
        //标准线
        standardLine:[{
            name:'line1',
            lineWidth:2
        }]
    };
    return {
        open:function(property,callBack){
//            if(!self.dialogBox){
//                initial();
//            }
            self.dialogBox.dialog('open');
            myCallBack = callBack;
        },
        close:function(){
            self.dialogBox.dialog('open');
        }
    };
});