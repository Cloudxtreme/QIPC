//上传控件中“清空”按钮单击事件    清空上传图片控件中的子项
function fclearQueue() {
//
//    $('#uploadComplete').html('');
//    fgiveUp();
    //20130226 10:42 盈科_王伟 提交更新 修改
    $('#uploadComplete').html('');
    $('#custom_file_upload').uploadifyClearQueue();
}
//上传控件中“放弃”按钮单击事件    取消本次上传
function fgiveUp() {
//    $('#custom_file_upload').uploadifyClearQueue();

    //20130226 10:42 盈科_王伟 提交更新 修改
    if($(".uploadifyQueueItem").find(".fileName").html()!=null||!($("#uploadComplete").html()==null||$("#uploadComplete").html()=="")){
        $('#uploadComplete').html('');
        $('#custom_file_upload').uploadifyClearQueue();
    }else{
        AgiCommonDialogBox.Alert("请先添加图片资源！", null);
    }
}

//上传控件中“上传”按钮单击事件    清空上传图片控件中的子项
function fupload() {
//    $('#custom_file_upload').uploadifyUpload()
    //20130226 10:42 盈科_王伟 提交更新 修改
    if($(".uploadifyQueueItem").find(".fileName").html()!=null){
        $('#custom_file_upload').uploadifyUpload();
    }else{
        AgiCommonDialogBox.Alert("请先添加图片资源！", null);
    }
}

//设置上传控件大小
function popupDiv(div_id) {
    $('#custom-queue').html('');
    var div_obj = $("#" + div_id);
    //窗口宽度,高度
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    //弹出的div的宽度,高度
    var popHeight = div_obj.height();
    var popWidth = div_obj.width();
   // div_obj.show();
    div_obj.animate({ opacity: "show", left: (winWidth - popWidth) / 2, top: (winHeight - popHeight) / 2, width: popWidth, height: popHeight }, 300);
}
//关闭弹出层
function hideDiv(div_id) {
    $("#" + div_id).animate({ opacity: "hide" }, 300);

}

//关闭 上传控件
function closeUpLoadDiv(div_id)
{
//    hideDiv(div_id);
//    fgiveUp();
//    fclearQueue();
    //20130226 10:42 盈科_王伟 提交更新 修改
    hideDiv(div_id);
    fclearQueue();
}
$(function () {

    //绑定上传控件
    $('#custom_file_upload').uploadify({
        'uploader': 'JS/jquery.uploadify-v2.1.0/uploadify.swf?random=' + (new Date()).getTime(),
        'script':Agi.ImgUploadServiceAddress,
        'cancelImg': 'JS/jquery.uploadify-v2.1.0/cancel.png',
        'folder': '/'+Agi.ImgUploadPath,
        'multi': true,
        'auto': false,
        'fileExt': '*.jpg;*.gif;*.png',
        'fileDesc': 'Image Files (.JPG, .GIF, .PNG)',
        'queueID': 'custom-queue',
        'queueSizeLimit': 999,
        'simUploadLimit': 999,
        'buttonText': encodeURI('添加'),
        'hideButton':true,
        'buttonImg':'JS/jquery.uploadify-v2.1.0/add.png',
        'onComplete': function (event, queueId, fileObj, response, data) {
//            $("#uploadComplete").append(fileObj.name + " 上传成功<br/>");
            var fName = fileObj.name;
            var dataArray = fName.split('.');
            fName = MyUploadsubString(fName,10,true);
            $("#uploadComplete").append(fName +" ."+ dataArray[dataArray.length-1]+" 上传成功<br/>");
            Agi.ResourcesManager.ReGetAllImages(bindImageResourceForBrowser);
        },
        'onAllComplete':function(event,data){
            $("#imgResourceManage").click();
        }
    });

    $(".pop_box").easydrag(); //拖动
    $(".pop_box").setHandler(".pop_box .p_head");
});
//20130222 10:27 添加图片切换方法
function mouseOver()   {   document.close_img.src ="JS/jquery.uploadify-v2.1.0/close-pressed.png";   }
function mouseOut()   {   document.close_img.src ="JS/jquery.uploadify-v2.1.0/close.png";     }
function addmouseOver()   {   document.add_img.src ="JS/jquery.uploadify-v2.1.0/add-pressed.png";   }
function addmouseOut()   {   document.add_img.src ="JS/jquery.uploadify-v2.1.0/add.png";     }
function uploadmouseOver()   {   document.upload_img.src ="JS/jquery.uploadify-v2.1.0/upload-pressed.png";   }
function uploadmouseOut()   {   document.upload_img.src ="JS/jquery.uploadify-v2.1.0/upload.png";     }
function cancelmouseOver()   {   document.cancel_img.src ="JS/jquery.uploadify-v2.1.0/cancel1-pressed.png";   }
function cancelmouseOut()   {   document.cancel_img.src ="JS/jquery.uploadify-v2.1.0/cancel1.png";     }

//截取字符串 包含中文处理
//(串,长度,增加...)
function MyUploadsubString(str, len, hasDot)
{
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++)
    {
        singleChar = str.charAt(i).toString();
        if(singleChar.match(chineseRegex) != null)
        {
            newLength += 2;
        }
        else
        {
            newLength++;
        }
        if(newLength > len)
        {
            break;
        }
        newStr += singleChar;
    }

    if(hasDot && strLength > len)
    {
        newStr += "...";
    }
    return newStr;
}