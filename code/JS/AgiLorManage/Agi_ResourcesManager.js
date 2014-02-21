/**
 * Created with JetBrains WebStorm.
 * User: wdh
 * Date: 12-11-18
 * Time: 下午4:26
 * To change this template use File | Settings | File Templates.
 */
(function(){
    Namespace.register("Agi.ResourcesManager");

    Agi.ResourcesManager.ReGetAllImages=function(callback){
        //20130627 markeluo 修改 兼容JAVA获取图片资源列表方法
        if(Agi.WebServiceConfig.Type==".NET"){
            var AjaxURL=WebServiceAddress+"/GetImageList";
            $.ajax({
                url:AjaxURL,
                type: 'post',
                dataType: 'jsonp',
                data:{'jsonData':''},
                success: function (response) {
                    response=JSON.parse(base64decode(response));
                    callback(response);
                },
                error: function (x, e) {
                    alert("读取数据失败！");
                }

            });
        }else{
            /// <summary>Datasets删除</summary>
            var jsonData = { "jsonData": ''};
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({ "MethodName": "GetImageList", "Paras": jsonString, "CallBackFunction": function (_result) {
                callback(_result);
            }
            });
        }
    }
    Agi.ResourcesManager.ReReNameImage=function(oldName,newName,li,callback){
        //20130627 markeluo 修改 兼容JAVA修改图片名称方法
        var jsonData=oldName+','+newName;
        var cparas={"li":li,"newName":newName};
        if(Agi.WebServiceConfig.Type==".NET"){
            var AjaxURL=WebServiceAddress+"/ImageReName";
            jsonData=base64encode(jsonData);
            $.ajax({
                url: AjaxURL,
                type: 'post',
                dataType: 'jsonp',
                data:{'jsonData':jsonData},
                success: function (response) {
                    response=JSON.parse(base64decode(response));
                    callback(response.result,li,newName);
                },
                error: function (x, e) {
                    alert("读取数据失败！");
                }
            });
        }else{
            var jsonData = { "jsonData":jsonData};
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({
                "MethodName": "ImageReName",
                "Paras": jsonString,
                "CallBackFunction": function (_result) {
                    callback(_result.result,li,newName);
                }
            });
        }
    }
    Agi.ResourcesManager.ReDeleteImage=function(imageName,li,callback){
        //20130627 markeluo 修改 兼容JAVA删除图片方法
        var cparas=li;
        if(Agi.WebServiceConfig.Type==".NET"){
            var AjaxURL=WebServiceAddress+"/ImageDelete";
            imageName=base64encode(imageName);
            $.ajax({
                url:AjaxURL,
                type: 'post',
                dataType: 'jsonp',
                data:{'jsonData':imageName},
                success: function (response) {
                    response=JSON.parse(base64decode(response));
                    callback(response.result,li);
                },
                error: function (x, e) {
                    alert("读取数据失败！");
                }

            });
        }else{
            var jsonData = { "jsonData":imageName};
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({
                "MethodName": "ImageDelete",
                "Paras": jsonString,
                "CallBackFunction": function (_result) {
                    callback(_result.result,li);
                }
            });
        }
    }
})();

//浏览所有图片资源时   固定各个图片的位置
function RMAllImageThumb() {
    $("#pop_Image_main li").addClass('RMImageMainLi');
    $("#pop_Image_main li img").addClass('RMImageMainLiImage');
    var liLeft = 50, liTop = 12, j = 0, nonePosition = 0;

    var mum = $("#ulImageList").children().length;
    while (liLeft <= 818 && j < mum)//初始化各个店铺图片的位置
    {
//        $("#pop_Image_main li:eq(" + j + ")").css({ left: liLeft + "px", top: liTop + "px" });
//        liLeft += 150;
//        if (liLeft > 800 && j != mum) {
//            liLeft = 40;
//            liTop += 136;
//        }
//        j++;
        $("#pop_Image_main li:eq(" + j + ")").css({ left: liLeft + "px", top: liTop + "px" });
        liLeft += 150;
        if (liLeft > 800 && j != mum) {
            liLeft = 50;
            liTop += 143;
        }
        j++;
    }
    //20130124 15:30 盈科 王伟资源上传修改
    $("#pop_Image_main li").click(function(){
        if (!$(this).hasClass("current")) //用户点击了非放大的当前图片
        {
            $("#pop_Image_main li").css("background","00000000");
            $(this).css("background","#ff0000");  //点击时背景色红色
        }
    });
    //20130124 15:30 盈科 王伟资源上传修改
    $("#pop_Image_main li").dblclick(function () {
        $("#pop_Image_main li").css("z-index", "2");
        if ($(this).hasClass("current")) //用户点击了放大的当前图片
        {
            $(this).animate({ height: 116, width: 116, top: nonePosition.top, left: nonePosition.left }, "normal");
            $("img", this).animate({ height: 116, width: 116 }, "normal");
            $("a", this).animate({ opacity: "hide" }, "fast");
            $(this).css("z-index", "3");
            $(this).removeClass("current");
            $(this).css("background","#ff0000");
        }
        else 	//用户点击了后面的图片
        {
            if (nonePosition != 0) {
                $("#pop_Image_main li.current").css("z-index", "3");
                $("#pop_Image_main li.current").animate({ height: 116, width: 116, top: nonePosition.top, left: nonePosition.left }, "normal");
                $("#pop_Image_main li.current>img").animate({ height: 116, width: 116 }, "normal");
                $("#pop_Image_main li.current>a").animate({ opacity: "hide" }, "fast");
                $("#pop_Image_main li.current").removeClass("current");
            }
            nonePosition = $(this).position();
            $(this).css("z-index", "6");
            $(this).addClass("current");
            var top = ($(window).height() - 370)/2;
            var left = ($(window).width() - 350)/2;
            var scrollTop = $(document).scrollTop();
            var scrollLeft = $(document).scrollLeft();
            $(this).animate({ height: 370, width: 350, bottom:top+scrollTop+370, left:200 }, "normal");
            $("img", this).animate({ height: 350, width: 350 }, "normal");
            $(this).css("background","#ffffff");
        }
    });
}