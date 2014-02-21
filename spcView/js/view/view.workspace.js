/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-9-4
 * Time: 下午5:54
 * To change this template use File | Settings | File Templates.
 */
Agi.view.workspace = {
    isFullAnimationPage: false,
    serviceOpen: "VSFileReadByID",
    controlList: new Agi.Script.CArrayList(),
    ControlsLibs: new Array(),
    setConfig: function (config) {
        var $workspace = $("#workspace");
        if (typeof config.PageStyle === "string") {
            config.PageStyle = JSON.parse(config.PageStyle);
        }
        /*是否全动画页面*/
        //this.isFullAnimationPage = config.isFullAnimationPage;
        //
        var bgColor = config.PageStyle.backGround;
        $workspace.css("background-color", bgColor);
        if (config.hasOwnProperty("BackgroundImg") == true) {//兼容以前的页面
            //alert(config.hasOwnProperty("BackgroundImg"));
            if (config.BackgroundImg.indexOf("SourceManager") != -1) { //画布的背景图片
                // alert(config.BackgroundImg.indexOf("url"));
                $workspace.css("background-image", "url(" + Agi.ImgServiceAddress + config.BackgroundImg + ")");
                $workspace.css("background-position", "center");
                $workspace.css("background-repeat", "no-repeat");
                $workspace.css("background-size", "100% 100%");
            }
        }
        //新取色控件的情况
        if(config.canvasBackGround){
            if(config.canvasBackGround.type == 3){
                $workspace.css({
                    "background-image": "url(" + Agi.ImgServiceAddress + config.canvasBackGround.imgName + ")",
                    "background-position": "center",
                     "background-repeat": "no-repeat",
                     "background-size": "100% 100%"});
            }else{
                $workspace.css(config.canvasBackGround.value);
            }
        }
        var w = 0;
        var h = 0;
        if (isNaN(parseInt(config.SurplusWithText))) {
            w = 0;
        } else {
            w = parseInt(config.SurplusWithText);
        }
        if (isNaN(parseInt(config.SurplusHeightText))) {
            h = 0;
        } else {
            h = parseInt(config.SurplusHeightText);
        }
        if (config.PageSize.AutoSize === true) {
            //var SupportsTouches = ("createTouch" in document);
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("mobile") != -1) {  //移动设备
                var isAndroid = (isLinux && ua.indexOf("android") != -1)
                if (isAndroid) {   //安卓系统
                    $workspace.width(screen.width - w);
                    $workspace.height(screen.height - h);
                }
                else {
                    $workspace.width(screen.height - w);
                    $workspace.height(screen.width - h);
                }
            }
            else {    //pc
                $workspace.width(screen.width - w);
                $workspace.height(screen.height - h);
            }
        }
        else {
            $workspace.css("width", config.PageSize.Width);
            $workspace.css("height", config.PageSize.Height);
        }
        //读取页面级脚本
        canvas.setScriptCode(config.PageScript);
        $workspace.bind('click', function (e) {
            canvas.fireScriptCode('click');
        });
    },
    GetControlsLibs: function (controltype) {
        var ControlLibs = [];
        if (Agi.view.workspace.ControlsLibs != null && Agi.view.workspace.ControlsLibs.length > 0) {
            for (var i = 0; i < Agi.view.workspace.ControlsLibs.length; i++) {
                if (Agi.view.workspace.ControlsLibs[i].controlType === controltype) {
                    ControlLibs = Agi.view.workspace.ControlsLibs[i].files;
                    break;
                }
            }
        }
        return ControlLibs;
    }
}

