/**
 * $.popbox
 * @extends jquery.1.7.2
 * @fileOverview 通用的跟随目标元素定位的弹窗，提示等
 * @author 愚人码头
 * @email admin@css88.com
 * @site wwww.css88.com
 * @version 0.3
 * @date 2012-10-17
 * Copyright (c) 2012 愚人码头
 * @param {Object,String} options 插件配置或外部调用插件里的方法名 .
 * @example
 *    $('#single-posts').popbox({});//初始化
 *    $("#single-posts").popbox("show");//外部调用插件里的方法
 */
;
(function ($, window, undefined) {
    /**
     * @constructor Popbox
     * 创建一个新的的Popbox类.
     * @param {Object} element 弹窗所依附的DOM元素.
     * @param {Object} options 插件配置 .
     * @type {Object}
     * @example new Popbox( this , options)
     * */
    var Popbox = function (element, options) {
        this.initialize('popbox', element, options);
    };
    /**
     * This is a property of class Popbox
     */
    Popbox.prototype = {
        constructor:Popbox,
        /**
         * 初始化
         * @classDescription 初始化
         * @param {String} type 弹窗类型
         * @param {Object} element 弹窗所依附的DOM元素.
         * @param {Object} options 插件配置 .
         */
        initialize:function (type, element, options) {
            this.type = type;
            this.$element = $(element);
            this.options = this.options || this.getOptions(options);
            this.$popbox = this.$popbox || this._popObj();
            var $popBox = this.$popbox;
            var opt = this.options;
            this.$popLayer = this.$popLayer || $popBox.find(".pop_layer");
            this.$popWarp = this.$popWarp || $popBox.find(".pop_warp");
            this.$popContent = this.$popContent || $popBox.find(".pop_content");
            //定时器
            this.delaytimer = null;
            //关闭
            if (opt.closeAble) {
                /**
                 * 关闭按钮
                 * @property {Object} jQuery对象
                 */
                this.$closeBtn = this.$closeBtn || $('<a title="关闭" class="pop_close" href="#">关闭</a>');
                this.$popWarp.css("padding-right", opt.closePRight).append(this.$closeBtn);
                this.closePopBox();
            }
            //图标
            if (opt.iconClass) {
                /**
                 * ico
                 * @property {Object} jQuery对象
                 */
                this.$popIcon = this.$popIcon || $('<span class="pop_icon"></span>').addClass(opt.iconClass);
                this.$popWarp.css("padding-left", opt.iconPLeft).prepend(this.$popIcon);
            }
            //三角
            this.setNormalAngle();
            //宽高
            if (opt.width) {
                this.setWidth(opt.width);
            }
            if (opt.height) {
                this.setHeight(opt.height);
            }
            //z-index
            if (opt.zIndex) {
                this.setZindex(opt.zIndex);
            }
            // 如果是弹窗内容需要异步请求，

            if (typeof opt.content === 'function') {
                opt.content.call(this);
            } else {
                //泪飙了，这里使用的 html 和 append 竟然不一样
                //外部使用setZindex方法时候发现了这个问题
                //用html this.$popbox 对象中竟然不会包含this.options.content内容
                this.$popContent.append(opt.content);
            }
            //弹窗创建后的回调行数，
            // 参数是这个 this.$tipBox对象 ，还没想好如何扩展，fuck！
            if (typeof opt.callBack === 'function') {
                opt.callBack.call(this);
            }
            /*//-------------------------------应放下爱 setPos中，可以优化
             //延时关闭是不是要放在这里呢？
             if (this.options.closeDelay > 0) {
             this.delayClose();
             }
             //鼠标离开自动关闭弹窗
             if (this.options.mouseOverDelay > 0) {
             this.mousedelayClose();
             }*/

            //载入到DOM
            $popBox.appendTo(opt.appendToTarget).hide().css({
                "opacity":opt.opacity ? 0 : 1
            });

            this.position = this.position || this.getPosition();
            //----------------需要慎重考虑这个代码,暂时不做
            /*if (typeof opt.attachEvent === 'string') {
             var _this=this;
             this.$element.on( opt.attachEvent,function(event){
             //console.log("22222222");
             event.preventDefault();
             _this.setPos(_this.position);
             });
             }*/
            //console.log(opt.show);
            opt.show && this.setPos(this.position);
        },
        /**
         * 设置位置并且显示弹窗
         */
        setPos:function (PosObj) {
            //重新赋值，setPos很可能外包调用，关系到close还原动画
            this.position = PosObj;

            var $popBox = this.$popbox || this._popObj();
            //开启便宜的动画效果
            //direction不能设置为auto

            //初始定位
            $popBox.css({
                "top":PosObj.popBoxOffsetT,
                "left":PosObj.popBoxOffsetL
            });
            //！！！！！！！！！！！！！！！！！！不考虑直接显示，可以优化成一个判断
            if ((PosObj.popBoxOffsetT != PosObj.popBoxT || PosObj.popBoxOffsetL != PosObj.popBoxL) && this.options.offsetTimer.show !== 0) {
                //偏移动画+淡入淡出效果
                $popBox.stop(true, true).animate({
                    "top":PosObj.popBoxT,
                    "left":PosObj.popBoxL,
                    "opacity":1
                }, this.options.offsetTimer.show).show();
            } else {
                if (!this.options.opacity || this.options.offsetTimer.show === 0) {
                    //直接显示
                    $popBox.show().css({
                        "opacity":1
                    }).show();
                } else {
                    //仅作淡入淡出效果
                    $popBox.stop(true, true).animate({
                        "top":PosObj.popBoxT,
                        "left":PosObj.popBoxL,
                        "opacity":1
                    }, this.options.offsetTimer.show).show();
                }

            }
            if (this.delaytimer) {
                window.clearTimeout(this.delaytimer);
                this.delaytimer = null;
            }
            //-------------------------------应放下爱 setPos中，可以优化
            //延时关闭是不是要放在这里呢？
            if (this.options.closeDelay > 0) {
                this.delayClose();
            }
            //鼠标离开自动关闭弹窗
            if (this.options.mouseOverDelay > 0) {
                this.mousedelayClose();
            }
        },
        /**
         * 初始化 配置参数 返回参数MAP
         * @param {Object} options 插件配置 .
         * @return {Object} 配置参数
         */
        getOptions:function (options) {
            options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), (this.options || {}), options);
            //偏移动画执行时间
            if (typeof options.offsetTimer == 'number') {
                options.offsetTimer = {
                    show:options.offsetTimer,
                    hide:options.offsetTimer
                };
            } else {
                options.offsetTimer = $.extend({
                    show:200,
                    hide:200
                }, options.offsetTimer);
            }
            //重置isCreate参数，
            //(options.closeDelay > 0 || options.mouseOverDelay > 0) && (options.isCreate = false);
            //暂时不做attachEvent参数
            //(typeof options.attachEvent == "string" && options.attachEvent)&&(options.show = false);
            //重置iconPLeft参数
            if (typeof options.iconClass == "string" && !options.iconPLeft) {
                if (options.iconClass.indexOf("M") == -1 && options.iconClass.indexOf("B") == -1) {
                    //小图标
                    options.iconPLeft = 25;
                } else if (options.iconClass.indexOf("M") !== -1) {
                    //中图标
                    options.iconPLeft = 36;
                } else {
                    //大图标
                    options.iconPLeft = 50;
                }
            }
            return options;
        },
        /**
         * 创建弹窗元素属性,返回弹窗JQ对象
         * @return {Object} 弹窗JQ对象
         */
        _popObj:function () {
            var _this = this;
            return $("<div></div>", {
                "class":_this.options.boxClass,
                "id":_this.options.id ? _this.options.id : "",
                "html":_this.options.template || ['<div class="pop_layer">',
                    '<div class="pop_warp">',
                    '<div class="pop_content">',
                    '</div>',
                    '</div>',
                    '</div>'].join("")
            });
        },
        /**
         * 设置弹窗的内容。
         * @param {Object} content 要重置的内容.
         */
        setContent:function (content) {
            // 如果是弹窗内容需要异步请求，
            if (typeof content === 'function') {
                this.options.content.call(this);

            } else {
                //泪飙了，这里使用的 html 和 append 竟然不一样
                //外部使用setZindex方法时候发现了这个问题
                //用html this.$popbox 对象中竟然不会包含this.options.content内容
                this.$popContent.empty().append(content);
            }
        },
        /**
         * 设置弹窗的宽度
         * @param {Number} num 宽度值 .
         */
        setWidth:function (num) {
            this.$popWarp.css("width", num);
        },
        /**
         * 设置弹窗的高度
         * @param {Number} num 高度值 .
         */
        setHeight:function (num) {
            this.$popWarp.css("height", num);
        },
        /**
         * 设置配置参数并且重置弹窗的位置。
         * @param {Object} obj 要重置的参数.
         */
        setOptions:function (obj) {
            this.options = $.extend({}, this.options, obj);
            //重新获取位置对象---------------------------可以优化为只有在topBottomAuto模式下需要重新设置位置对象
            //this.position = this.getPos();
        },
        /**
         * 小三角。
         */
        setNormalAngle:function () {
            var directing = this.options.directing;
            var direction = this.options.direction;
            if (directing && typeof direction == 'string') {
                this.$popAngle = this.$popAngle || $('<span class="angle"><span class="diamond"></span></span>');
                this.$popWarp.addClass("angle_" + direction).prepend(this.$popAngle);
                this.$popLayer.addClass("layer_" + direction);
                typeof directing == "object" && this.$popAngle.css(directing);
            }
        },
        /**
         * 设置弹窗的z-index
         * @param {Number} num z-index值 .
         */
        setZindex:function (num) {
            this.$popbox.css("zIndex", num);
        },

        /**
         * 根据配置的位置属性获取弹窗位置属性
         * @return {Object} popBoxPos 弹窗位置属性
         */
        getPosition:function () {
            var popBoxPos = null;
            var _this = this;
            var positionFun = function (direction) {
                //根据配置自动定位  topL,topC,topR,bottomL,bottomC,bottomB,leftT,leftC,leftB,rightT,rightC,rightB
                switch (direction) {
                    case "topL":
                        popBoxPos = _this._setPosTopL();
                        break;
                    case "topC":
                        popBoxPos = _this._setPosTopC();
                        break;
                    case "topR":
                        popBoxPos = _this._setPosTopR();
                        break;
                    case "bottomL":
                        popBoxPos = _this._setPosBottomL();
                        break;
                    case "bottomC":
                        popBoxPos = _this._setPosBottomC();
                        break;
                    case "bottomR":
                        popBoxPos = _this._setPosBottomR();
                        break;
                    case "leftT":
                        popBoxPos = _this._setPosLeftT();
                        break;
                    case "leftC":
                        popBoxPos = _this._setPosLeftC();
                        break;
                    case "leftB":
                        popBoxPos = _this._setPosLeftB();
                        break;
                    case "rightT":
                        popBoxPos = _this._setPosRightT();
                        break;
                    case "rightC":
                        popBoxPos = _this._setPosRightC();
                        break;
                    case "rightB":
                        popBoxPos = _this._setPosRightB();
                        break;

                    default:
                        popBoxPos = _this._setPosTopL();
                        break;
                }
                //

                return popBoxPos;
            };
            if (typeof this.options.direction == 'string') {
                //console.log("")
                popBoxPos = positionFun(this.options.direction);
                //这是三角
                //(this.options.directing && (this.options.direction == "leftRightAuto" || this.options.direction == "topBottomAuto")) && this.setAutoAngle(popBoxPos);
            } else {
                var defaultPosOption = {
                    "popBoxOffsetT":0, //偏移量 top
                    "popBoxOffsetL":0, //偏移量 left
                    "popBoxT":0, //定位的 top
                    "popBoxL":0         //定位的 left
                };
                //defaultPos=
                popBoxPos = $.extend({}, defaultPosOption, this.options.direction);
            }

            //console.log(popBoxPos)
            return popBoxPos;
        },
        /**
         * 获取目标元素的相关属性
         * @return {Object}  目标元素的相关属性
         */
        getPosInfo:function () {
            var $popBoxTarget = this.$element;
            var $popBox = this.$popbox || this._popObj();
            var popBoxTargetT = parseInt($popBoxTarget.offset().top);
            var popBoxTargetL = parseInt($popBoxTarget.offset().left);
            var popBoxTargetW = $popBoxTarget.outerWidth();
            var popBoxTargetH = $popBoxTarget.outerHeight();

            var popBoxOutW = $popBox.outerWidth(true);
            var popBoxOutH = $popBox.outerHeight(true);
            return {"popBoxTargetT":popBoxTargetT, "popBoxTargetL":popBoxTargetL, "popBoxTargetW":popBoxTargetW, "popBoxTargetH":popBoxTargetH, "popBoxOutW":popBoxOutW, "popBoxOutH":popBoxOutH};
        },
        /**
         * 获取Window的相关属性
         * @return {Object}  Window的相关属性
         * @example
         * {
         * "winW":{Number},
         * "winH":{Number},
         * "winST":{Number},
         * "winSL":{Number}
         * }
         */
        getWindowInfo:function () {
            var $win = $(window);
            return {"winW":$win.width(), "winH":$win.height(), "winST":$win.scrollTop(), "winSL":$win.scrollLeft()};
        },
        _setPosTopL:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT - posInfo.popBoxOutH;
            var popBoxL = posInfo.popBoxTargetL;
            var popBoxOffsetT = popBoxT - this.options.offset;
            var popBoxOffsetL = popBoxL;

            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosTopC:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT - posInfo.popBoxOutH;
            var popBoxL = posInfo.popBoxTargetL - parseInt(posInfo.popBoxOutW / 2, 10) + parseInt(posInfo.popBoxTargetW / 2, 10);
            var popBoxOffsetT = popBoxT - this.options.offset;
            var popBoxOffsetL = popBoxL;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosTopR:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT - posInfo.popBoxOutH;
            var popBoxL = posInfo.popBoxTargetL - posInfo.popBoxOutW + posInfo.popBoxTargetW;
            var popBoxOffsetT = popBoxT - this.options.offset;
            var popBoxOffsetL = popBoxL;

            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosBottomL:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT + posInfo.popBoxTargetH;
            var popBoxL = posInfo.popBoxTargetL;
            var popBoxOffsetT = popBoxT + this.options.offset;
            var popBoxOffsetL = popBoxL;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosBottomC:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT + posInfo.popBoxTargetH;
            var popBoxL = posInfo.popBoxTargetL - parseInt(posInfo.popBoxOutW / 2, 10) + parseInt(posInfo.popBoxTargetW / 2, 10);
            var popBoxOffsetT = popBoxT + this.options.offset;
            var popBoxOffsetL = popBoxL;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosBottomR:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT + posInfo.popBoxTargetH;
            var popBoxL = posInfo.popBoxTargetL - posInfo.popBoxOutW + posInfo.popBoxTargetW;
            var popBoxOffsetT = popBoxT + this.options.offset;
            var popBoxOffsetL = popBoxL;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosLeftT:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT;
            var popBoxL = posInfo.popBoxTargetL - posInfo.popBoxOutW;
            var popBoxOffsetT = popBoxT;
            var popBoxOffsetL = popBoxL - this.options.offset;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosLeftC:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT - parseInt(posInfo.popBoxOutH / 2, 10) + parseInt(posInfo.popBoxTargetH / 2, 10);
            var popBoxL = posInfo.popBoxTargetL - posInfo.popBoxOutW;
            var popBoxOffsetT = popBoxT;
            var popBoxOffsetL = popBoxL - this.options.offset;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosLeftB:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT - posInfo.popBoxOutH + posInfo.popBoxTargetH;
            var popBoxL = posInfo.popBoxTargetL - posInfo.popBoxOutW;
            var popBoxOffsetT = popBoxT;
            var popBoxOffsetL = popBoxL - this.options.offset;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosRightT:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT;
            var popBoxL = posInfo.popBoxTargetL + posInfo.popBoxTargetW;
            var popBoxOffsetT = popBoxT;
            var popBoxOffsetL = popBoxL + this.options.offset;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosRightC:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT - parseInt(posInfo.popBoxOutH / 2, 10) + parseInt(posInfo.popBoxTargetH / 2, 10);
            var popBoxL = posInfo.popBoxTargetL + posInfo.popBoxTargetW;
            var popBoxOffsetT = popBoxT;
            var popBoxOffsetL = popBoxL + this.options.offset;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        _setPosRightB:function () {
            var posInfo = this.getPosInfo();
            var popBoxT = posInfo.popBoxTargetT - posInfo.popBoxOutH + posInfo.popBoxTargetH;
            var popBoxL = posInfo.popBoxTargetL + posInfo.popBoxTargetW;
            var popBoxOffsetT = popBoxT;
            var popBoxOffsetL = popBoxL + this.options.offset;
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },

        /**
         * 鼠标移入移出延迟关闭事件，对象上的时候的方法------------------可以继续优化动画完成后的回调
         *
         */
        mousedelayClose:function () {
            var _this = this;
            var $popBox = this.$popbox || this._popObj();
            //执行了2次的bug

            $popBox.on("mouseenter.popbox", function () {
                window.clearTimeout(_this.delaytimer);
                _this.delaytimer = null;
            });
            $popBox.on("mouseleave.popbox", function () {

                _this.delaytimer = window.setTimeout(function () {
                    _this.closeFun();
                }, _this.options.mouseOverDelay);
            });
            //isCreate:false情况下，去掉这个貌似好了
            this.$element.on("mouseenter.popbox", function () {
                window.clearTimeout(_this.delaytimer);
                _this.delaytimer = null;
            });
            this.$element.on("mouseleave.popbox", function () {
                _this.delaytimer = window.setTimeout(function () {
                    _this.closeFun();
                }, _this.options.mouseOverDelay);
            });

        },
        /**
         * 延迟关闭事件
         */
        delayClose:function () {
            var _this = this;
            var $popBox = this.$popbox || this._popObj();


            this.delaytimer = window.setTimeout(function () {
                _this.closeFun();
            }, this.options.closeDelay);

            //当鼠标移入popbox时,不延时关闭
            $popBox.mouseover(function () {
                window.clearTimeout(_this.delaytimer);
                _this.delaytimer = null;
            }).mouseout(function () {
                    _this.delaytimer = window.setTimeout(function () {
                        _this.closeFun();
                    }, 500);
                });
        },
        /**
         * 关闭函数
         */
        closeFun:function () {
            //

            var _this = this;
            var $popBox = this.$popbox || this._popObj();
            var PosObj = this.position || this.getPosInfo();
            if (this.options.mouseOverDelay > 0) {
                $popBox.off(".popbox");
                this.$element.off(".popbox");
            }
            function close() {
                $popBox.hide();
                if (!_this.options.isCreate) {
                    $popBox.remove();
                    _this.$element.removeData(_this.type);
                }
            }

            //开启便宜的动画效果
            if ((PosObj.popBoxOffsetT != PosObj.popBoxT || PosObj.popBoxOffsetL != PosObj.popBoxL) && this.options.offsetTimer.hide !== 0) {
                $popBox.animate({
                    "top":PosObj.popBoxOffsetT,
                    "left":PosObj.popBoxOffsetL,
                    "opacity":this.options.opacity ? 0 : 1
                }, _this.options.offsetTimer.hide, function () {
                    close();
                });
            } else {
                if (!this.options.opacity || this.options.offsetTimer.hide === 0) {
                    close();
                } else {
                    $popBox.animate({
                        "opacity":0
                    }, _this.options.offsetTimer.hide, function () {
                        close();
                    });
                }
            }
        },
        /**
         * 关闭事件
         */
        closePopBox:function () {
            var _this = this;
            this.$closeBtn.bind("click", function (event) {
                /*if (typeof that.options.closeCallBack === 'function') {
                 that.options.closeCallBack(this.$tipBox);
                 }*/
                if (typeof _this.options.closeCallBack === 'function') {
                    _this.options.closeCallBack.call(_this);
                }
                _this.closeFun();

                //window.clearTimeout(that.delaytimer);
                //window.clearTimeout(that.delaytimer1);
                event.preventDefault();
            });
        }
    };
    $.fn.popbox = function (option) {
        var argumentsAry = [];
        for (var i = 0, len = arguments.length; i < len; i++) {
            argumentsAry.push(arguments[i]);
        }
        var newarg = argumentsAry.slice(1);
        return this.each(function () {
            var $this = $(this),
                data = $this.data('popbox'),
                options = typeof option == 'object' && option; //如果传递的参数是对象，
            //将Tooltip类赋值给这个元素的自定义属性tooltip，并且为data变量赋值
            //!data && $this.data('popbox', (data = new Popbox(this, options)));
            if (!data) {
                data = new Popbox(this, options);
                $this.data('popbox', data);
            } else if (typeof option == 'object') {
                //console.log("11111111111")
                $this.popbox("setPos", data.position);
            }
            //如果 option是字符串，就运行类的这个方法
            if (typeof argumentsAry[0] == 'string') {
                data[argumentsAry[0]].apply(data, newarg);
            }
        });
    };
    $.fn.popbox.Constructor = Popbox;

    $.fn.popbox.defaults = {
        isCreate:false,
        id:"",
        content:"<p style='margin: 0; padding: 5px'>欢迎使用popbox，css88.com 愚人码头 出品。</p>",
        width:null, //宽度
        height:null, //高度
        boxClass:"sd_popbox", //弹窗样式

        appendToTarget:"body", //将弹窗插入到哪个对象里
        zIndex:null,
        direction:"topL", //tip相对于对象的方向,top,down,left,right,auto
        /*
         * direction还有一种参数数据类型为对象，例如：
         * {
         *     "popBoxOffsetT":popBoxOffsetT, //偏移量 top
         *     "popBoxOffsetL":popBoxOffsetL, //偏移量 left
         *     "popBoxT":popBoxT,             //定位的 top
         *     "popBoxL":popBoxL              //定位的 left
         * }
         * 当direction 为 对象的时候，offset参数就失效了
         * 当 popBoxOffsetT !== popBoxT 或者 popBoxOffsetL !== popBoxL 会有想用的偏移动画
         * 当 popBoxOffsetT == popBoxT 并且 popBoxOffsetL == popBoxL 并且opacity为false 没有偏移动画 和淡入淡出动画，offsetTimer参数失效
         * ，
         * */
        offset:0,
        /*
         * 效果开启,偏移量,当开启偏移量时，
         * offset为0时将没有偏移动画, offsetTimer参数失效
         * direction不能设置为 auto等自动方向
         * 当 direction 为 对象的时候，offset参数就失效了
         * */
        offsetTimer:200,
        /* 执行偏移动画的时间 默认200毫秒,
         * 也可以是一个对象，
         * {
         *     show: {Number},  //显示动画的时间
         *     hide: {Number}   //隐藏动画的时间
         * }
         * 如果offsetTimer为0，将不执行偏移动画，
         * 同样，offsetTimer.show或者offsetTimer.hide为0，将不执行相应的偏移动画
         * offsetTimer参数是否有效取决于 偏移动画 和 淡入淡出动画 是否存在，
         * */

        opacity:false, //当有偏移动画的时候，是否开启淡入淡出的动画效果
        closeAble:false, //是否显示关闭
        closePRight:25, //配合closeable的参数，表示content容器的padding-right值
        iconClass:null, //小图标样式，null表示没有小图标，必要时可以将小图标写在内容中
        iconPLeft:null, //配合iconClass   表示content容器的padding-left值
        directing:null, //是否显示箭头，对象，top，left，right，bottom样式属性｛top:20px｝

        eventObj:null,
        closeDelay:0, //自动隐藏的延迟时间，这个和mouseOverDelay只出现一个
        mouseOverDelay:0, //鼠标移入移出 自动隐藏的延迟时间，这个和closeDelay只出现一个
        show:true, //表示立即显示，false只是初始化，不显示
        //attachEvent:null,//暂时不做
        template:""
    };
})(window.jQuery, window);
