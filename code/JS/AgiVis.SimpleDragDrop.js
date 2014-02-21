/**
 * Created with JetBrains WebStorm.
 * User: andy guo
 * Date: 12-8-14
 * Tiself: 下午4:01
 * 实现简单的拖动
 */
//简单的拖动处理,适用于左侧控件拖动到画布时使用
//demos/simpleDragDrop下有示例
Namespace.register("Agi.DragDrop");
Agi.DragDrop.SimpleDragDrop = function (options) {
    var self = this;
    self.disable = false;
    self.options = {
        dragObject:"", //要拖动对象的ID
        targetObject:null, //释放鼠标时的目标元素ID
        contaninerObject:null,
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
        self.transcript[0].style.position = "absolute";
        self.transcript[0].style.opacity = 0.7;   //设置透明度
        self.transcript.innerHTML = self.control[0].innerHTML;
        $(self.transcript).css({ 'top':$(self.control).offset().top, 'left':$(self.control).offset().left });
        $('body').css('cursor', 'pointer');
        self.options.dargStartCallBack.call(self,{
            object:self.control
        });
    }

    function mouseMove(e) {
        var e1 = e || window.event;
        if (self.transcript) {
            //document.body.style.cursor = "pointer";
            self.transcript[0].style.left = eval(e1.pageX - self.transcript.width() - 7) + "px";
            self.transcript[0].style.top = eval(e1.pageY - self.transcript.height()) + "px";
            self.options.draggingCallBack.call(self);
        }
    }

    function mouseUp(e) {
        if (self.transcript) {
            $(document).unbind('mousemove', mouseMove);
            $(document).unbind('mouseup', mouseUp);
            var pos1 = calculateAbsPos(self.transcript.offset());
            var pos2 = null;//calculateRelPos(self.transcript.offset());
            //检查放置的目标
            if (self.options.targetObject === e.target.id) {
                self.options.dragEndCallBack.call(self, {
                    object:self.control,
                    target:$(e.target),
                    position:pos1,
                    position2:pos2
                })
            } else {
                /*TabsControl-Liuyi*/
                if (self.options.targetObject == "BottomRightCenterContentDiv") {
                    var tabsTabid = e.target.id;
                    if (e.target.id.split('-')[0] == 'tabs') {
                        self.options.dragEndCallBack.call(self, {
                            object:self.control,
                            target:$('#' + self.options.targetObject),
                            position:pos1,
                            position2:pos2
                        }, tabsTabid)
                    }
                    else {
                        var result = check2(e.target, self.dropTargets);
                        if (result.find) {
                            self.options.dragEndCallBack.call(self, {
                                object:self.control,
                                target:$(result.object),
                                position:pos1,
                                position2:pos2
                            });
                        }
                    }
                }
                else {
                    var result = check2(e.target, self.dropTargets);
                    if (result.find) {
                        self.options.dragEndCallBack.call(self, {
                            object:self.control,
                            target:$(result.object),
                            position:pos1,
                            position2:pos2
                        });
                    }
                }
                /*TabsControl-end*/
            }
            self.options.mouseUpCallBack.apply(self);
            //清除透明层
            self.transcript.remove();
            if (self.transcript) {
                self.transcript = null;
            }
            $('body').css('cursor', 'default');
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
    }
}

