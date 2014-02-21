/*
编写人：鲁佳
描述：主要用于框架左侧菜单的拖拽功能
参数说明：objID 需要拖拽的容器id
*/
Namespace.register("Agi.Msg");
var dragE = null;  //参数联动配置 拖拽控件参数时需要用到
Agi.Msg.Drag =function(objID, FrameWork_callbck, parasCallback) {
    var Me = this;
    Me.obj = document.getElementById(objID);
    var tagstr = document.getElementById(objID).tagName;
    Me.transcript = null;
    Me.obj.onmousedown = Entity_touchStart;
    Me.obj.addEventListener("touchstart", Entity_touchStart, false);

    function Entity_touchStart(e) {
        e.preventDefault();
        var e1 = e || window.event;
        dragE = e1;  //add by 2012-07-09
        Me.transcript = document.createElement(tagstr);
        var SupportsTouches = ("createTouch" in document);
        if (SupportsTouches) {
            Me.StartX = e1.targetTouches[0].pageX;
            Me.StartY = e1.targetTouches[0].pageY;
        } else {
            Me.StartX = e1.pageX;
            Me.StartY = e1.pageY;
        }
        Me.transcript.className = "app_MyDivli";
        Me.transcript.style.background = "#6db9ff";
        Me.transcript.style.zIndex = "9999";
        Me.transcript.style.width = Me.obj.offsetWidth + "px";
        Me.transcript.style.height = Me.obj.offsetHeight + "px";
        Me.transcript.width = $(Me.obj).width() / 2;
        Me.transcript.height = $(Me.obj).height() / 2;
        Me.transcript.style.position = "absolute";
        Me.transcript.style.opacity = 0.7;   //设置透明度
        Me.transcript.innerHTML = Me.obj.innerHTML;
        $(Me.transcript).css({ 'top': $(Me.obj).offset().top, 'left': $(Me.obj).offset().left });
        document.body.appendChild(Me.transcript);
        document.onmousemove = Entity_touchMove;
        document.onmouseup = Entity_touchEnd;
        document.addEventListener("touchmove", Entity_touchMove, false);
        document.addEventListener("touchend", Entity_touchEnd, false);
        //2012-07-09 用于参数联动配置时：获取每个实体参数所在的区域
        if (parasCallback != null) {
            GetItemsSize(); //重新获取item大小  函数在Agi.Msg.ParasSettingWindow.js文件中
            //共享数据源块
            ShareDataOperation.GetItemsSize();
        }
    }
    function Entity_touchMove(e) {
        e.preventDefault();
        var e1 = e || window.event;
        dragE = e1;
        //判断是移动设备上还是PC机
        var SupportsTouches = ("createTouch" in document);
        if (SupportsTouches) {
            Me.transcript.style.left = eval(e1.targetTouches[0].pageX - Me.transcript.width) + "px";
            Me.transcript.style.top = eval(e1.targetTouches[0].pageY - Me.transcript.height) + "px";
        } else {
            Me.transcript.style.left = eval(e1.pageX - Me.transcript.width) + "px";
            Me.transcript.style.top = eval(e1.pageY - Me.transcript.height) + "px";
        }
        //用于参数联动配置时：获取每个实体参数所在的区域
        if (parasCallback != null) {
            eval(parasCallback)();
        }
    }

    function Entity_touchEnd(e) {
        e.preventDefault();
        var e1 = e || window.event;
        document.touchmove = null;
        document.touchend = null;
        document.onmousemove = null;
        document.onmouseup = null;
        document.body.removeChild(Me.transcript);
        var SupportsTouches = ("createTouch" in document);
        if (SupportsTouches) {
            Me.EndX = e1.changedTouches[0].pageX;
            Me.EndY = e1.changedTouches[0].pageY;
        } else {
            Me.EndX = e1.pageX;
            Me.EndY = e1.pageY;
        }
        if (Math.abs(Me.EndX - Me.StartX) > 130) {
            eval(FrameWork_callbck)(e, Me.obj);
        }
    }
    Me.GetZindex = function () {
        var maxZindex = 0;
        var divs = document.getElementsByTagName("div");
        for (z = 0; z < divs.length; z++) {
            maxZindex = Math.max(maxZindex, divs[z].style.zIndex);
        }
        return maxZindex + 1;
    }
}
