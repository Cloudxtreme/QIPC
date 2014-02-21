/**
 * Created with JetBrains WebStorm.
 * User: MARKELUO
 * Date: 13-6-24
 * Time: 下午4:20
 * detail:列表元素拖拽，点击不触发拖拽，且只有拖动一段距离才出现拖拽效果
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.DragDropManager");
Agi.DragDropManager.DragDropBind = function (options) {
    var self = this;
    self.disable = false;
    self.options = {
        dragObject:"", //要拖动对象的ID
        targetObject:null, //释放鼠标时的目标元素ID
        contaninerObject:null,
        MousDownOffset:{offsetX:0,offsetY:0},//按下时鼠标坐标
        IsDragStart:false,//是否开始拖拽
        enableContaner:true,
        dargStartCallBack:function () {
        }, //开始拖动的回调函数
        draggingCallBack:function () {
        }, //正在拖动的回调函数
        dragEndCallBack:function () {
        }, //拖动过程结束的回调函数,targetObject 要设置正确才能执行
        mouseUpCallBack:function () {
        } //鼠标释放后的回调函数
    };
    for (name in options) {
        self.options[name] = options[name];
    }
    self.control = typeof self.options.dragObject == 'string' ? $('#' + self.options.dragObject) : $(self.options.dragObject);
    self.transcript = null;
    self.dragtargetPro=null;
    //拖放的目标 可能是一个,也可能是多个
    self.dropTargets = typeof self.options.targetObject == 'string' ? $('#' + self.options.targetObject) : $(self.options.targetObject);
    if (self.control) {
        self.control.unbind('mousedown');
        self.control.bind('mousedown', mouseDown);

        $(document).unbind('mousemove', mouseMove);
        $(document).bind('mousemove', mouseMove);

        $(document).unbind('mouseup', mouseUp);
        $(document).bind('mouseup', mouseUp);
    }
    function mouseDown(e) {
        if (e.which != 1 || self.disable) {
            return;
        }
        if (self.control) {
            $(document).unbind('mousemove', mouseMove);
            $(document).bind('mousemove', mouseMove);
            $(document).unbind('mouseup', mouseUp);
            $(document).bind('mouseup', mouseUp);
        }
        self.transcript = $(self.control).clone();
        self.transcript.attr('class', self.control.attr('class')).html(self.control.html()).removeAttr('id');
        $('body').append(self.transcript);
        self.transcript[0].style.background = "#6db9ff";
        self.transcript[0].style.zIndex = "2147483647";
        self.transcript.width(self.control.width());
        self.transcript.height(self.control.height());
        //self.transcript.width(self.transcript.width() - 30);
        //self.transcript.height = $(self.control).height() / 2;
        self.options.MousDownOffset.offsetX= e.offsetX;
        self.options.MousDownOffset.offsetY= e.offsetY;
        return false;
    }

    function mouseMove(e) {
        var e1 = e || window.event;
        if (self.transcript) {
            if(Math.abs((e.offsetX-self.options.MousDownOffset.offsetX))>8 || Math.abs((e.offsetY-self.options.MousDownOffset.offsetY))>8){
                if(self.options.IsDragStart==false){
                    self.transcript[0].style.opacity = 0.7;   //设置透明度
                    self.transcript.innerHTML = self.control[0].innerHTML;
                    $(self.transcript).css({ 'top':$(self.control).offset().top, 'left':$(self.control).offset().left });
                    $(self.transcript).addClass("dragdroptemplayer");
                    $('body').css('cursor', 'pointer');
                    self.options.dargStartCallBack.call(self,{
                        object:self.control
                    });
                }
                //region 移动更改颜色
                var newpos1 = calculateAbsPos(self.transcript.offset());
                var newpos2 = null;
                self.dragtargetPro=MouseOverTarget(self,newpos1,newpos2,e);
                if(self.dragtargetPro!=null && self.dragtargetPro.target!=null && self.control !=self.dragtargetPro.target){
                    try{
                        if(self.control.attr("isfolder")==self.dragtargetPro.target.attr("isfolder")
                            && self.control[0].id==self.dragtargetPro.target[0].id){
                            self.dragtargetPro=null;
                        }else{
                            self.dropTargets.find("a").css("background","");
                            self.dragtargetPro.target.children()[0].style.background='#baeafe';
                        }
                    }catch(ex){
                        self.dragtargetPro=null;
                    }
                }else{
                    self.dragtargetPro=null;
                }
                //endregion

                self.options.IsDragStart=true;
                self.transcript[0].style.position = "absolute";
                self.transcript[0].style.left = eval(e1.pageX - self.transcript.width() - 7) + "px";
                self.transcript[0].style.top = eval(e1.pageY - self.transcript.height()) + "px";
                self.options.draggingCallBack.call(self);
            }
            return false;
        }
    }

    function mouseUp(e) {
        if (self.transcript) {
            $(document).unbind('mousemove', mouseMove);
            $(document).unbind('mouseup', mouseUp);
//            if(Math.abs((e.offsetX-self.options.MousDownOffset.offsetX))>8 || Math.abs((e.offsetY-self.options.MousDownOffset.offsetY))>8){
//                var pos1 = calculateAbsPos(self.transcript.offset());
//                var pos2 = null;//calculateRelPos(self.transcript.offset());
//                //检查放置的目标
//
//                var TargetObj=MouseOverTarget(self,pos1,pos2,e);
//                if(TargetObj!=null){
//                    self.options.dragEndCallBack.call(self, {
//                        object:TargetObj.object,
//                        target:TargetObj.target,
//                        position:TargetObj.position,
//                        position2:TargetObj.position2
//                    }, TargetObj.tabsTabid);
//                }
//            }
            if(self.dragtargetPro!=null && self.dragtargetPro.target!=null){
                self.options.dragEndCallBack.call(self, {
                        object:self.dragtargetPro.object,
                        target:self.dragtargetPro.target,
                        position:self.dragtargetPro.position,
                        position2:self.dragtargetPro.position2
                    }, self.dragtargetPro.tabsTabid);
            }
            self.options.mouseUpCallBack.apply(self);
            //清除透明层
            self.transcript.remove();
            $(".dragdroptemplayer").remove();
            if (self.transcript) {
                self.transcript = null;
            }
            $('body').css('cursor', 'default');

            self.dropTargets.find("a").css("background","");

            return false;
        }
    }

    {
        function check(target, contanerId) {
            var b = {find:false, object:null};
            if ($(target).attr('id') == contanerId) {
                b.find = true;
                b.object = $(target);
                return b;
            }
            var parent = $(target).parent();
            while (parent.length) {
                if (parent.attr('id')
                    && parent[0].id === contanerId) {
                    b.find = true;
                    b.object = parent;
                    break;
                } else {
                    parent = parent.parent();
                }
            }
            return b;
        }

        function check2(target, containerArr) {
            var b = {find:false, object:null};
//            $(containerArr).each(function(i,c){
//                b = check(target, $(c).attr('id'));
//                if(b.find){
//                    return b;
//                }
//            });
            for (var i = containerArr.length - 1; i >= 0; i--) {
                b = check(target, $(containerArr[i]).attr('id'));
                if (b.find) {
                    break;
                }
            }
            return b;
        }

        function calculateAbsPos(pos) {
            var left = pos.left,
                top = pos.top,
                canvas = self.dropTargets;//$('#'+self.options.targetObject);
            if (left < canvas.offset().left) {
                left = canvas.offset().left;
            }
            if (top < canvas.offset().top) {
                top = canvas.offset().top;
            }
            return {
                left:left + 'px',
                top:top + 'px'
            };
        }

        function calculateRelPos(pos) {
            var left = pos.left,
                top = pos.top,
                canvas = self.dropTargets;//$('#'+self.options.targetObject);
            left = left - canvas.offset().left;
            top = top - canvas.offset().top;
            if (left <= canvas.offset().left) {
                left = 0;
            }
            if (top <= canvas.offset().top) {
                top = canvas.offset().top;
            }
            return {
                left:left + 'px',
                top:top + 'px'
            };
        }
        function MouseOverTarget(self,pos1,pos2,e){
            var RetrunObj=null;
            if (self.options.targetObject === e.target.id) {
                RetrunObj={
                    object:self.control,
                    target:$(e.target),
                    position:pos1,
                    position2:pos2,
                    tabsTabid:null
                }
            } else {
                /*TabsControl-Liuyi*/
                if (self.options.targetObject == "BottomRightCenterContentDiv") {
                    RetrunObj={
                        object:self.control,
                        target:$('#' + self.options.targetObject),
                        position:pos1,
                        position2:pos2,
                        tabsTabid: e.target.id
                    }
                }
                else {
                    var result = check2(e.target, self.dropTargets);
                    if (result.find) {
                        RetrunObj={
                            object:self.control,
                            target:$(result.object),
                            position:pos1,
                            position2:pos2,
                            tabsTabid:null
                        }
                    }
                    else {
                        var result = check2(e.target, self.dropTargets);
                        if (result.find) {
                            RetrunObj={
                                object:self.control,
                                target:$(result.object),
                                position:pos1,
                                position2:pos2,
                                tabsTabid:null
                            };
                        }
                    }
                    /*TabsControl-end*/
                }
            }

            return RetrunObj;
        }
    }
}
