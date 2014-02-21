/**
 * $.autopopbox
 * @extends jquery.1.7.2
 * @fileOverview popbox的扩展 通用的跟随目标元素定位的弹窗，提示等
 * @author 愚人码头
 * @email admin@css88.com
 * @site wwww.css88.com
 * @version 0.3
 * @date 2012-10-17
 * Copyright (c) 2012 愚人码头
 * @param {Object,String} options 插件配置或外部调用插件里的方法名 .
 * @example
 *    $('#single-posts').autopopbox({});//初始化
 *    $("#single-posts").autopopbox("show");//外部调用插件里的方法
 */
;(function ($,undefined ) {
    /**
     * @constructor AutoPopbox
     * 创建一个新的的 AutoPopbox 类.
     * @param {Object} element 弹窗所依附的DOM元素.
     * @param {Object} options 插件配置 .
     * @type {Object}
     * @example new AutoPopbox( this , options)
     * */
    var AutoPopbox = function (element, options) {
        this.initialize('autopopbox', element, options);
    };
    /**
     * This is a property of class Popbox
     */
    AutoPopbox.prototype = $.extend({}, $.fn.popbox.Constructor.prototype,{
        constructor:AutoPopbox,
        /**
         * 根据配置的位置属性获取弹窗位置属性
         * @return {Object} popBoxPos 弹窗位置属性
         */
        getPosition:function () {
            var popBoxPos = null;
            var _this = this;
            var positionFun = function (direction) {
                //根据配置自动定位
                switch (direction) {

                    case "leftRightAuto":
                        popBoxPos = _this._setPosLeftRightAuto();
                        break;
                    case "topBottomAuto":
                        popBoxPos = _this._setPosTopBottomAuto();
                        break;

                    default:
                }
                //
                return popBoxPos;
            };
            if (typeof this.options.direction == 'string') {
                //console.log("")
                popBoxPos = positionFun(this.options.direction);
                //这是三角
                //this.options.directing && this.setAutoAngle(popBoxPos);
            }
            return popBoxPos;
        },
        /**
         * 根据鼠标的event和目标元素的ClientRects属性获取弹窗位置属性
         * @return {Object}  弹窗位置属性
         */
        _getClientPos:function () {
            var windowInfo = this.getWindowInfo();
            //解决换行文本的弹出框定位问题
            var textRg = this.$element[0].getClientRects ? this.$element[0].getClientRects() : null;

            if (this.options.eventObj && (textRg && textRg.length > 1)) {
                //console.log(textRg);
                var temp0H = textRg[0]["bottom"], temp1H = textRg[1]["bottom"];
                var differH = temp1H - temp0H;//行高
                var evePageY = this.options.eventObj.pageY;
                //console.log(evePageY);
                //获得鼠标在第几行
                var i = 0;

                while (evePageY >= textRg[i]["bottom"] + windowInfo.winST) {

                    i = i + 1;
                }
                return {"popBoxTargetT":textRg[i]["top"] + windowInfo.winST, "popBoxTargetL":textRg[i]["left"] + windowInfo.winSL, "popBoxTargetW":textRg[i]["right"] - textRg[i]["left"], "popBoxTargetH":differH};
            } else {
                return {};
            }
        },
        /**
         * 根据配置的位置属性(topBottomAuto)获取弹窗位置属性
         * @return {Object}  弹窗位置属性
         */
        _setPosTopBottomAuto:function () {

            var posInfo = $.extend({}, this.getPosInfo(), this._getClientPos()),
                windowInfo = this.getWindowInfo(),
                newDirectionH = posInfo.popBoxTargetT - windowInfo.winST >= posInfo.popBoxOutH ? "top" : "bottom",
                newDirectionV = windowInfo.winW - posInfo.popBoxTargetL + windowInfo.winSL >= posInfo.popBoxOutW ? ["left", "L"] : ["right", "R"];


            //console.log(posInfo);
            var popBoxT = newDirectionH == "top" ? (posInfo.popBoxTargetT - posInfo.popBoxOutH) : (posInfo.popBoxTargetT + posInfo.popBoxTargetH);
            var popBoxL = newDirectionV[0] == "left" ? posInfo.popBoxTargetL : (posInfo.popBoxTargetL - posInfo.popBoxOutW + posInfo.popBoxTargetW);
            var popBoxOffsetT = newDirectionH == "top" ? (popBoxT - this.options.offset) : (popBoxT + this.options.offset);
            var popBoxOffsetL = popBoxL;

            //设置角度
            var directing = "";
            if (popBoxT > posInfo.popBoxTargetT) {
                directing = "bottom" + newDirectionV[1];
            } else {
                directing = "top" + newDirectionV[1];
            }
            this.$popWarp.removeClass("angle_topL angle_topR angle_bottomL angle_bottomR").addClass("angle_" + directing);
            this.$popLayer.removeClass("layer_topL layer_topR layer_bottomL layer_bottomR").addClass("layer_" + directing);

            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};
        },
        /**
         * 根据配置的位置属性(leftRightAuto)获取弹窗位置属性
         * @return {Object}  弹窗位置属性
         */
        _setPosLeftRightAuto:function () {
            var posInfo = this.getPosInfo(),
                windowInfo = this.getWindowInfo(),
                newDirectionH = windowInfo.winH + windowInfo.winST - posInfo.popBoxTargetT >= posInfo.popBoxOutH ? ["bottom", "T" ] : ["top", "B"],
                newDirectionV = windowInfo.winW + windowInfo.winSL - (posInfo.popBoxTargetL + posInfo.popBoxTargetW) >= posInfo.popBoxOutW ? "right" : "left";


            var popBoxT = newDirectionH[0] == "bottom" ? posInfo.popBoxTargetT : posInfo.popBoxTargetT + posInfo.popBoxTargetH - posInfo.popBoxOutH;
            var popBoxL = newDirectionV == "right" ? (posInfo.popBoxTargetL + posInfo.popBoxTargetW) : posInfo.popBoxTargetL - posInfo.popBoxOutW;
            var popBoxOffsetT = popBoxT;
            var popBoxOffsetL = newDirectionV == "right" ? (popBoxL + this.options.offset) : (popBoxL - this.options.offset);

            //设置角度
            var directing = "";
            if (popBoxL > posInfo.popBoxTargetL) {
                directing = "right" + newDirectionH[1];
            } else {
                directing = "left" + newDirectionH[1];
            }
            this.$popWarp.removeClass("angle_leftT angle_leftB angle_rightT angle_rightB").addClass("angle_" + directing);
            this.$popLayer.removeClass("layer_leftT layer_leftB layer_rightT layer_rightB").addClass("layer_" + directing);
            //console.log({"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL})
            return {"popBoxOffsetT":popBoxOffsetT, "popBoxOffsetL":popBoxOffsetL, "popBoxT":popBoxT, "popBoxL":popBoxL};

        }
    });
    $.fn.autopopbox = function (option) {
        var argumentsAry = [];
        for (var i = 0, len = arguments.length; i < len; i++) {
            argumentsAry.push(arguments[i]);
        }
        var newarg = argumentsAry.slice(1);
        return this.each(function () {
            var $this = $(this),
                data = $this.data('autopopbox'),
                options = typeof option == 'object' && option; //如果传递的参数是对象，
            //将Tooltip类赋值给这个元素的自定义属性tooltip，并且为data变量赋值
            //!data && $this.data('popbox', (data = new Popbox(this, options)));
            if (!data) {
                data = new AutoPopbox(this, options);
                $this.data('autopopbox', data);
            }else if( typeof option == 'object' ){
                data.setOptions({"eventObj":option.eventObj});
                data.setPos(data.getPosition());
            }
            //如果 option是字符串，就运行类的这个方法
            if (typeof argumentsAry[0] == 'string') {
                data[argumentsAry[0]].apply(data, newarg);
            }
        });
    };
    $.fn.autopopbox.Constructor = AutoPopbox;
    $.fn.autopopbox.defaults = $.extend({} , $.fn.popbox.defaults, {

        direction:"topBottomAuto"

    });
})(window.jQuery);
