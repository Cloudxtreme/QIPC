/**
* Created with JetBrains WebStorm.
* User: 姬念文
* Date: 12-6-20
* Time: 下午10:06
* 时间轴控件.多选框控件 ，单选框控件
*/

//------------------------时间轴控件开始---------------------------------------------------//
var mainbarwidth, yuluoffset, mainlef, maintop;
//时间轴开始时间，时间轴结束时间，两个时间差,毫秒级
var SliderStartTime, SliderEndTime, Difference;
//步长
var StepValue;
//返回的开始和结束时间
var StarttimeShow, EndtimeShow;

//初始化自定义时间轴
function InitalizationTimSlider(_ParentDiv,BeginWidth, PanelLeft, PanelWidth, EndWidth, IsNoSelect) {
    //判断是否支持触控
    $.extend($.support, { touch: "ontouchend" in document });
    if ($.support.touch) {
        //支持触控

        //停用页面滚动功能
        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
        
    }
    
    createTimeSplider(_ParentDiv,BeginWidth, PanelLeft, PanelWidth, EndWidth, IsNoSelect);
};
function createTimeSplider(_ParentDiv,BeginWidth, PanelLeft, PanelWidth, EndWidth, IsNoSelect) {
    $("#mainBar" + _ParentDiv).width($("#TimePanel" + _ParentDiv).width());
    mainbarwidth = $("#mainBar" + _ParentDiv).width();
    //步长
    StepValue = Difference / mainbarwidth; //每个点位代表的毫秒数
    yuluoffset = $("#mainBar" + _ParentDiv).offset();
    mainlef = yuluoffset.left;
    maintop = yuluoffset.top;
    $("#mainBar" + _ParentDiv).css("width", mainbarwidth);
    
    //update by lj 2012-07-17
    if (IsNoSelect) {
        $("#PointPanel" + _ParentDiv).css("width", mainbarwidth - $("#EndPoint" + _ParentDiv).width() - $("#StartPoint" + _ParentDiv).width());
        $("#PointPanel" + _ParentDiv).css("left", $("#EndPoint" + _ParentDiv).width());
        EndPointlefwidth = $("#mainBar" + _ParentDiv).width() - $("#StartPoint" + _ParentDiv).width();
        $("#EndPoint" + _ParentDiv).css("left", EndPointlefwidth)
        $("#StartPoint" + _ParentDiv).css("left", 0);

    }
    else {
        $("#StartPoint" + _ParentDiv).css("left", BeginWidth);
        $("#PointPanel" + _ParentDiv).css("width", PanelWidth);
        $("#PointPanel" + _ParentDiv).css("left", PanelLeft);
        $("#EndPoint" + _ParentDiv).css("left", EndWidth);

    }

}

//将"yyyy-MM-dd hh:mm:ss" 字符串转换为DateTime类型返回，主要兼容Safari浏览器
function TimeConvert(_oldtimestr) {
    if (_oldtimestr.indexOf("-") > 0) {
        _oldtimestr = _oldtimestr.replace("-", "/").replace("-", "/");
    }
    return Date.parse(_oldtimestr);
}

function AddDragEvent(_ControlObj,_ParentDiv) {
//    $("#mainBar" + _ParentDiv).width($("#TimePanel" + _ParentDiv).width() - 10);
    mainbarwidth = $("#mainBar" + _ParentDiv).width();
    //步长
    StepValue = Difference / mainbarwidth; //每个点位代表的毫秒数

    //3.容器
    var PointPanelbtn = new LWLTimeSliderObj("PointPanel" + _ParentDiv, _ParentDiv,_ControlObj);
    PointPanelbtn.moveStyle = Pg0DD_HMOVE;
    PointPanelbtn.isMoved = function (newPosX, newPosY) {
        PointPanelMoveChange(_ControlObj,_ParentDiv, newPosX); //移动容器
            return { x: newPosX >= $("#mainBar" + _ParentDiv).offset().left + $("#StartPoint" + _ParentDiv).width() && newPosX <= ($("#mainBar" + _ParentDiv).width() - $("#EndPoint" + _ParentDiv).width() - $("#PointPanel" + _ParentDiv).width() + $("#mainBar" + _ParentDiv).offset().left) };
    }


    //1.开始点
        var Startbtn = new LWLTimeSliderObj("StartPoint" + _ParentDiv, _ParentDiv,_ControlObj);
    Startbtn.moveStyle = Pg0DD_HMOVE;
    Startbtn.isMoved = function (newPosX, newPosY) {
            ChangePanelBar(_ParentDiv, newPosX, true);
            StatisticsTimes(_ControlObj,_ParentDiv);
        return { x: newPosX >= mainlef && newPosX <= ($("#EndPoint" + _ParentDiv).offset().left - $("#EndPoint" + _ParentDiv).width()) };
    }

    //2.截止点
    var Endbtn = new LWLTimeSliderObj("EndPoint" + _ParentDiv, _ParentDiv,_ControlObj);
    Endbtn.moveStyle = Pg0DD_HMOVE;
    Endbtn.isMoved = function (newPosX, newPosY) {

        ChangePanelBar(_ParentDiv, newPosX, false);
        StatisticsTimes(_ControlObj,_ParentDiv);
        return { x: newPosX >= ($("#StartPoint" + _ParentDiv).offset().left + $("#StartPoint" + _ParentDiv).width()) && newPosX <= $("#mainBar" + _ParentDiv).width() - $("#EndPoint" + _ParentDiv).width() + mainlef };
    }
};
//区域块滑动
function PointPanelMoveChange(_ControlObj,_ParentDiv, _newPosX) {
//update by lj
    IsNotDrag = false;
    $("#StartPoint" + _ParentDiv).css("left", $("#PointPanel" + _ParentDiv).position().left - 10 / 2);
    $("#EndPoint" + _ParentDiv).css("left", $("#PointPanel" + _ParentDiv).position().left + $("#PointPanel" + _ParentDiv).width() - 10 / 2);
    StatisticsTimes(_ControlObj,_ParentDiv);
    return;
}
//更改区域块大小
function ChangePanelBar(_ParentDiv, _newPosX, _bolisStart) {
    //update by lj 
    $("#PointPanel" + _ParentDiv).css("width", $("#EndPoint" + _ParentDiv).position().left - $("#StartPoint" + _ParentDiv).position().left);
    $("#PointPanel" + _ParentDiv).css("left", $("#StartPoint" + _ParentDiv).position().left + 10 / 2);
    return;
}
//更新最新选中的时间段

function StatisticsTimes(_ControlObj, _ParentDiv) {
    //*获得选中的开始时间点和结束时间点之间的位置
    var _StartIndex = $("#StartPoint" + _ParentDiv).offset().left - mainlef;
    var _EndIndex = $("#EndPoint" + _ParentDiv).offset().left + $("#EndPoint" + _ParentDiv).width() - mainlef;
    var returnTime = new Array();
    //开始时间和截止时间
    var Times = GetSelTimes(_StartIndex, _EndIndex, StepValue);
    //时间更改中
    returnTime.push(Times[0].format("yyyy-MM-dd"));
    returnTime.push(Times[1].format("yyyy-MM-dd"));
    StarttimeShow = Times[0];
    EndtimeShow = Times[1];
    DateChanging(_ControlObj,_ParentDiv, Times[0], Times[1]);
    //    return returnTime;
    
}
//获得选择的时间段的值
function GetSelTimes(_StartInex, _EndIndex, _StepValue) {
    differenceNumber = _EndIndex - _StartInex; //选择的轴相差值

    var SelTimesArray = new Array(); //选中的开始时间和结束时间
    var StartTimeStr = SliderStartTime.format("yyyy/MM/dd hh:mm:ss");
    var ThisStartTime = new Date(StartTimeStr);
    var ThisEndtTime = new Date(StartTimeStr);

    ThisStartTime.setMilliseconds(ThisStartTime.getMilliseconds() + parseInt(_StartInex * _StepValue))
    ThisEndtTime.setMilliseconds(ThisEndtTime.getMilliseconds() + parseInt(_EndIndex * _StepValue));
    SelTimesArray.push(ThisStartTime);
    SelTimesArray.push(ThisEndtTime);

    return SelTimesArray;
}

//时间更改中
function DateChanging(_ControlObj,_ParentDiv, _starttime, _endtime) {
    $("#SpanstartTime" + _ParentDiv).html(_starttime.format("yyyy-MM-dd"));
    $("#SpanEndTime" + _ParentDiv).html(_endtime.format("yyyy-MM-dd"));


}
//返回时间
function ReturnTime() {
    var ReturnTime = new Array();
    ReturnTime.push(StarttimeShow.format("yyyy-MM-dd"));
    ReturnTime.push(EndtimeShow.format("yyyy-MM-dd"));
    return ReturnTime;
}
//1.0初始化控件内容
function JNWSelectTimeTempl(_ParentDiv) {
    this.LoadData = function () {
        
    };
    this.Show = function (_ControlObj,_shartTime, _endTime, selectBeginTime, selectEndTime) {
        $("#" + _ParentDiv).show();

        //时间轴开始时间
        SliderStartTime = new Date(_shartTime);
        //时间轴结束时间
        SliderEndTime = new Date(_endTime);
        //两个时间差,毫秒级
        Difference = SliderEndTime.getTime() - SliderStartTime.getTime();
        if (selectBeginTime != null && selectEndTime != null) {
            DateChanging(_ControlObj,_ParentDiv, new Date(selectBeginTime), new Date(selectEndTime));
            StarttimeShow = new Date(selectBeginTime);
            EndtimeShow = new Date(selectEndTime);
        }
        else {
            DateChanging(_ControlObj,_ParentDiv, SliderStartTime, SliderEndTime);
            StarttimeShow = SliderStartTime;
            EndtimeShow = SliderEndTime;
        }

        /* update by lj   begin*/
        var times = new Date(selectBeginTime) - new Date(_shartTime);
        var times1 = new Date(selectEndTime) - new Date(selectBeginTime);
        var step1 = Difference / $("#" + _ParentDiv).width();
        var BeginWidth = times / step1;
        var PanelWidth = times1 / step1;
        var PanelLeft = $("#StartPoint" + _ParentDiv).width() / 2 + BeginWidth;
        var EndWidth = BeginWidth + PanelWidth;
        if (EndWidth >= $("#" + _ParentDiv).width()) {
            PanelWidth -= $("#StartPoint" + _ParentDiv).width();
            EndWidth -= $("#StartPoint" + _ParentDiv).width();
        }

        if ((selectBeginTime == null && selectEndTime == null)) {
            InitalizationTimSlider(_ParentDiv, BeginWidth, PanelLeft, PanelWidth, EndWidth, true); //初始化自定义时间轴
//            GreatChart("mainBar" + _ParentDiv);
        }
        else {
            InitalizationTimSlider(_ParentDiv, BeginWidth, PanelLeft, PanelWidth, EndWidth, false); //初始化自定义时间轴
//            GreatChart("mainBar" + _ParentDiv);
        }
        
    };
}
//------------------------时间轴控件结束---------------------------------------------------//

//------------------------容器---------------------------------------------------//
//以下定义移动方向的常量
Pg0DD_FREEMOVE = 0; //自由移动，没有限制
Pg0DD_HMOVE = 1; //水平移动，也就是左右移动
Pg0DD_VMOVE = 2; //垂直移动，也就是上下移动

function LWLTimeSliderObj(obj,parent,_ControlObj) {
    
    var me = this;
    this.moveStyle = Pg0DD_FREEMOVE;
    this.foo = (typeof obj == "string") ? document.getElementById(obj) : obj;
    this.onDrop = function () { };
    this.onDrag = function () { };
    this.isMoved = function (newPosX, newPosY) { return { x: true, y: true} }; //offsetX:x的移动距离;offsetY:y的移动距离
    this.foo.addEventListener("touchstart", Pg0touchStart, false);
    this.foo.addEventListener("touchmove", Pg0touchMove, false);
    this.foo.addEventListener("touchend", Pg0touchEnd, false);

    this.foo.onmousedown = function (e) {
        var foo = me.foo;
        e = e || event;
        foo.lj = { x: e.clientX, left: $(foo).position().left };
        if (e.layerX > 0) {
            foo.oOffset = { x: e.layerX, y: e.layerY };
        } else {
            foo.oOffset = { x: e.offsetX, y: e.offsetY };
        }
        document.onmousemove = me.drag; //移动
        document.onmouseup = me.drop; //移动结束
        document.onselectstart = function () { return false; };
    }

    this.drag = function (e) {
        var foo = me.foo;
        e = e || event;

        var templeft = e.clientX - foo.lj.x + foo.lj.left;
        if ($(me.foo).attr("id").indexOf("StartPoint") > -1) {
            //拖动开始拖动按钮
            if (templeft >= 0 && templeft < $("#EndPoint"+parent).position().left-5) {
                foo.style.left = templeft + "px";
            }
        }
        if ($(me.foo).attr("id").indexOf("PointPanel") > -1) {
            //拖动中间区域
            if (templeft >= 5 && templeft < $("#mainBar" + parent).width() - $(foo).width() - 5) {
                foo.style.left = templeft + "px";
            }
        }
        if ($(me.foo).attr("id").indexOf("EndPoint") > -1) {
            //拖动结束按钮
            if (templeft >= $("#StartPoint" + parent).position().left + 5 && templeft < $("#mainBar" + parent).width() - 10) {
                foo.style.left = templeft + "px";
            }
        }

        var mv = me.isMoved(e.clientX - foo.oOffset.x + document.body.scrollLeft,
            e.clientY - foo.oOffset.y + document.body.scrollTop);
        me.onDrag();
    }

    this.drop = function (e) {
        e = e || event;
        document.onmousemove = document.onmouseup = document.onselectstart = null;

        Agi.Msg.PageOutPramats.PramatsChange({
            'Type': Agi.Msg.Enum.Controls,
            'Key': parent,
            'ChangeValue': [{ 'Name': 'BeginDate', 'Value': $("#SpanstartTime" + parent).html()}, { 'Name': 'EndDate', 'Value': $("#SpanEndTime" + parent).html()}]
        });
        Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _ControlObj, "Type": Agi.Msg.Enum.Controls });

        me.onDrop();

    }

    var startX, endX;
    /*添加触控事件*/
    function Pg0touchStart(e) {
        var foo = me.foo;
        e = e || event;
        if (e.layerX > 0) {
            foo.oOffset = { x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY };
        } else {
            foo.oOffset = { x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY };
        }
        startX = e.targetTouches[0].pageX;
    }
    function Pg0touchEnd(e) {
        touchInfo = {}
        e = e || event;
        document.onmousemove = document.onmouseup = document.onselectstart = null;
        me.onDrop();
    }
    function Pg0touchMove(e) {
        var foo = me.foo;
        e = e || event;
        var mv = me.isMoved(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
        if (mv.x && me.moveStyle != Pg0DD_VMOVE) {
            foo.style.left = e.targetTouches[0].pageX - mainlef + "px";
        }
        if (mv.y && me.moveStyle != Pg0DD_HMOVE) {
            foo.style.top = e.targetTouches[0].pageY + "px";
        }
        me.Pg0touchMove();
    }
}


//------------------------格式化日期格式---------------------------------------------------//
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


//------------------------实例化一个新的滑动时间控件---------------------------------------------------//
function GetNewSplider(_ControlObj,ParentDiv, StartDate, EndDate, BeginValue, EndValue) {
    AddDragEvent(_ControlObj,ParentDiv);
    var selectTimeC = new JNWSelectTimeTempl(ParentDiv);

    selectTimeC.Show(_ControlObj, StartDate, EndDate, BeginValue, EndValue);
}