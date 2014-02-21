/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");
var ControlWidth = 0, ControlHeight = 0;
/*添加 Agi.Controls命名空间*/
Agi.Controls.AnimationControl = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        /*动画控件数据入口*/
        initData: function (data) {
            if (data) {
                this.startAnimation(data.Value);
            }
        },
        /*动画控件解析函数*/
        startAnimation: function (value) {
            /*获取动画*/
            var animations = this.Get("PropertySettings").animations;
            /*获取控件*/
            var control = this;
            /*获取控件Html*/
            var controlHtml = this.Get("ProPerty").BasciObj;
            /*获取控件panel*/
            var controlPanel = this.Get("HTMLElement");
            //获取当前画布
            var ParentObj = $(controlPanel).parent();
            //获取控件position
            var Position = this.Get("Position");
            /*获取动画元素*/
            var fillAni = controlHtml.find("#ac_fill"); // $("#ac_fill");
            var fillBorder = controlHtml.find("#ac_border"); // $("#ac_border");
            var fillBgcolor = controlHtml.find("#ac_gradient"); //ac_gradient
            /*if (value > 1) {
            //fillAni.css("-webkit-transition", "background-color 0.5s linear");
            }*/

            var Me = this;
            var AnimationControlIsEnable = false;
            var IsExtAnamationVisible = false;
            fillBorder.css("border-width", "0px"); //默认边框宽度
            //20130223 倪飘 判断是否存在border动画
            var IsBorder = false;
            /*20130107 10:53 markeluo 添加水平或垂直填充后保存，再删除动画后预览时还是可以看到背景效果修改 */
            if (animations != null && animations.length > 0) {
                for (var i = 0; i < animations.length; i++) {
                    if (animations[i].type === "isEnable") {
                        var Estate = animations[i].Estate == "0" ? true : false;
                        var expression = animations[i].expression;
                        while (expression.indexOf("var") != -1) {
                            expression = expression.replace("var", value);
                        }
                        if (eval(expression) && Estate) {
                            AnimationControlIsEnable = true;
                        } else {
                            if (!eval(expression) && !Estate) {
                                AnimationControlIsEnable = true;
                            } else {
                                AnimationControlIsEnable = false;
                            }
                        }
                    }
                    if (animations[i].type === "isVisible") {
                        IsExtAnamationVisible = true;
                    }
                    //20130223 倪飘 判断是否存在border动画
                    if (animations[i].type === "border") {
                        IsBorder = true;
                    }
                }
                //20130223 倪飘 不存在border动画则设置边框填充为0
                if (!IsBorder) {
                    fillBorder.css("border-width", "0px");
                    var fillBorder_height = control.Get("ProPerty").BasciObj.height();
                    fillBorder.height(fillBorder_height);
                }
                if (!IsExtAnamationVisible) {
                    $(controlPanel).css("display", "block"); //当所有的动画设置都删除后启用可见
                }
            } else {
                fillBgcolor.css("background", "inherit");
                $(controlPanel).css("display", "block"); //当所有的动画设置都删除后启用可见
                return;
            }
            /*解析动画*/
            $.each(animations, function (i, animation) {
                if (!AnimationControlIsEnable) {
                    /*border*/
                    if (animation.type === "border") {
                        if (animation.colors != null && animation.colors.length > 0) {
                            //
                            /*border*/
                            if (control.Get("PropertySettings").border) {
                                fillBorder.css("border-width", control.Get("PropertySettings").border + "px");
                                var fillBorder_height = control.Get("ProPerty").BasciObj.height() - 2 * parseInt(fillBorder.css("border-width"));
                                fillBorder.height(fillBorder_height);
                            } else {
                                //20130223 倪飘 解决控件库-动画控件，设置边框宽度，设置填充，设置边线，将边线里的项都delet，出现情况见附件问题（盈科bug1023）
                                fillBorder.css("border-width", "0px");
                                var fillBorder_height = control.Get("ProPerty").BasciObj.height();
                                fillBorder.height(fillBorder_height);
                            }
                            //
                            for (var i = 0; i < animation.colors.length; i++) {
                                var color = animation.colors[i];
                                if (color.relation == "<=") {
                                    var prePercentage = 0
                                    if (i > 0) {
                                        prePercentage = animation.colors[i - 1].percentage
                                    }
                                    //console.log(value + " " + color.relation + " " + color.percentage + " " + "&&" + " " + value + " " + ">" + " " + prePercentage)
                                    if (eval(value + " " + color.relation + " " + color.percentage + " " + "&&" + " " + value + " " + ">" + " " + prePercentage)) {
                                        fillBorder.css("border-color", color.color);
                                    }
                                }
                                else {
                                    if (eval(value + " " + color.relation + " " + color.percentage)) {
                                        fillBorder.css("border-color", color.color);
                                    }
                                }
                            }
                        }
                        //20130223 倪飘 解决控件库-动画控件，设置边框宽度，设置填充，设置边线，将边线里的项都delet，出现情况见附件问题（盈科bug1023）
                        else {
                            fillBorder.css("border-width", "0px");
                            var fillBorder_height = control.Get("ProPerty").BasciObj.height();
                            fillBorder.height(fillBorder_height);
                        }
                    }
                    /*fill*/
                    if (animation.type === "fill") {
                        //
                        for (var i = 0; i < animation.colors.length; i++) {
                            var color = animation.colors[i];
                            if (color.relation == "<=") {
                                var prePercentage = 0
                                if (i > 0) {
                                    prePercentage = animation.colors[i - 1].percentage
                                }
                                //console.log(value + " " + color.relation + " " + color.percentage + " " + "&&" + " " + value + " " + ">" + " " + prePercentage)
                                if (eval(value + " " + color.relation + " " + color.percentage + " " + "&&" + " " + value + " " + ">" + " " + prePercentage)) {
                                    fillAni.css("background", color.color);
                                }
                            }
                            else {
                                if (eval(value + " " + color.relation + " " + color.percentage)) {
                                    fillAni.css("background", color.color);
                                }
                            }
                        }
                    }
                    /*fillImage*/
                    if (animation.type === "fillImage") {
                        for (var i = 0; i < animation.images.length; i++) {
                            var image = animation.images[i];
                            if (image.relation == "<=") {
                                var prePercentage = 0
                                if (i > 0) {
                                    prePercentage = animation.images[i - 1].percentage
                                }
                                //console.log(value + " " + color.relation + " " + color.percentage + " " + "&&" + " " + value + " " + ">" + " " + prePercentage)
                                if (eval(value + " " + image.relation + " " + image.percentage + " " + "&&" + " " + value + " " + ">" + " " + prePercentage)) {
                                    fillBorder.css("background-image", "url(" + image.image + ")");
                                    fillBorder.css("background-position", "center");
                                    fillBorder.css("background-repeat", "no-repeat");
                                    fillBorder.css("background-size", "100% 100%");
                                }
                            }
                            else if (image.relation == "==") {
                                if (eval(value + " " + image.relation + " " + image.percentage)) {
                                    fillBorder.css("background-image", "url(" + image.image + ")");
                                    fillBorder.css("background-position", "center");
                                    fillBorder.css("background-repeat", "no-repeat");
                                    fillBorder.css("background-size", "100% 100%");
                                }
                            }
                            else {
                                if (eval(value + " " + image.relation + " " + image.percentage)) {
                                    fillBorder.css("background-image", "url(" + image.image + ")");
                                    fillBorder.css("background-position", "center");
                                    fillBorder.css("background-repeat", "no-repeat");
                                    fillBorder.css("background-size", "100% 100%");
                                }
                            }
                        }
                    }
                    /*hFill*/
                    if (animation.type === "hFill") {
                        /*计算*/
                        var interval = (animation.maxPercentage - animation.minPercentage) / (animation.maxValue - animation.minValue);
                        var percentage = (interval * (value - animation.minValue) + parseInt(animation.minPercentage)) / 100;
                        //
                        //console.log(percentage)
                        //
                        if (percentage > 0 && percentage <= 1) {
                            /*参考点*/
                            if (animation.align == "left") {
                                fillAni.css("float", "left");
                            }
                            if (animation.align == "right") {
                                fillAni.css("float", "right");
                            }
                            /*动画*/
                            //20130105 10:37 markeluo 新增背景是否渐变选项
                            if (!animation.bgcolorisChange) {
                                fillBgcolor.css("background", "-webkit-linear-gradient(top, rgba(0, 0, 0, 0.3) 0%,rgba(0, 0, 0, 0.3) 100%)");
                            } else {
                                fillBgcolor.css("background", "-webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%)");
                            }
                            fillAni.css("width", percentage * 100 + "%");
                            fillAni.css("height", "100%");
                        }
                    }
                    /*vFill*/
                    if (animation.type === "vFill") {
                        //debugger;
                        /*计算*/
                        var interval = (animation.maxPercentage - animation.minPercentage) / (animation.maxValue - animation.minValue);
                        var percentage = (interval * (value - animation.minValue) + parseInt(animation.minPercentage)) / 100;
                        //
                        //console.log(percentage)
                        //
                        if (percentage > 0 && percentage <= 1) {
                            /*参考点*/
                            if (animation.align == "top") {
                                fillAni.parent().css("position", "");
                                fillAni.css({
                                    position: "",
                                    bottom: ""
                                })
                            }
                            if (animation.align == "bottom") {
                                //fillAni.css("float", "right");
                                //position: absolute;bottom: 0
                                fillAni.parent().css("position", "relative");
                                fillAni.css({
                                    position: "absolute",
                                    bottom: 0
                                })
                            }
                            /*动画*/
                            //20130105 10:37 markeluo 新增背景是否渐变选项
                            if (!animation.bgcolorisChange) {
                                fillBgcolor.css("background", "-webkit-linear-gradient(top, rgba(0, 0, 0, 0.3) 0%,rgba(0, 0, 0, 0.3) 100%)");
                            } else {
                                fillBgcolor.css("background", "-webkit-linear-gradient(left, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%)");
                            }
                            fillAni.css("width", "100%");
                            fillAni.css("height", percentage * 100 + "%");
                        }
                    }
                    /*bool*/
                    if (animation.type === "bool") {
                        //debugger;
                        var boolString = animation.expression.replace(new RegExp("var", "gm"), value);
                        if (eval(boolString)) {
                            fillBorder.css("background-color", animation.colorTrue);
                        }
                        else {
                            fillBorder.css("background-color", animation.colorFalse);
                        }
                    }
                    /*flash*/
                    if (animation.type === "flash") {
                        //debugger;
                        var boolString = animation.expression.replace(new RegExp("var", "gm"), value);
                        if (eval(boolString)) {
                            fillBorder.fadeOut(animation.speed, function () {
                                fillBorder.fadeIn(animation.speed);
                            });
                        }
                    }
                    if (animation.type === "vMove") {
                        //获取控件元始上偏移像素
                        var _ControlTop = parseInt(parseFloat(Position.Top) * ParentObj.height());
                        //如果小于等于最小值，上偏移像素为最小值对应像素
                        if (value <= animation.Startvalue) {
                            _ControlTop -= animation.Startpixel;
                        }
                        //如果大于等于最大值，上偏移像素为最大值对应像素
                        else if (value >= animation.Finallyvalue) {
                            _ControlTop -= animation.Finallypixel;
                        }
                        else {
                            var inteval = (animation.Finallypixel - animation.Startpixel) / (animation.Finallyvalue - animation.Startvalue);
                            var piex = value * inteval;
                            _ControlTop -= piex;
                        }
                        //获取控件高度
                        //                    var _ControlHeight = $(controlPanel).height();
                        //控件的最小上偏移为0.
                        var _MinPixel = 0;
                        //如果当前上偏移像素大于最大可偏移像素，取最大可偏移像素
                        if (_ControlTop < _MinPixel) {
                            _ControlTop = _MinPixel;
                        }
                        $(controlPanel).css("top", _ControlTop);
                    }
                    if (animation.type === "hMove") {
                        //获取控件元始左偏移像素
                        var _ControlLeft = parseInt(parseFloat(Position.Left) * ParentObj.width());
                        //如果小于等于最小值，右偏移像素为最小值对应像素
                        if (value <= animation.Startvalue) {
                            _ControlLeft += animation.Startpixel;
                        }
                        //如果大于等于最大值，右偏移像素为最大值对应像素
                        else if (value >= animation.Finallyvalue) {
                            _ControlLeft += animation.Finallypixel;
                        }
                        //计算值对应像素
                        else {
                            var inteval = (animation.Finallypixel - animation.Startpixel) / (animation.Finallyvalue - animation.Startvalue);
                            var piex = value * inteval;
                            _ControlLeft += piex;
                        }
                        //获取控件宽度
                        var _ControlWidth = $(controlPanel).width();
                        //最大可左偏移像素
                        var _MaxPixel = ParentObj.width() - _ControlWidth;
                        //如果当前左偏移像素大于最大可偏移像素，取最大可偏移像素
                        if (_ControlLeft > _MaxPixel) {
                            _ControlLeft = _MaxPixel;
                        }
                        $(controlPanel).css("left", _ControlLeft);
                    }
                    if (animation.type === "hChange") {
                        //获取控件元始上偏移像素
                        var _ControlTop = parseInt(parseFloat(Position.Top) * ParentObj.height());
                        //获取控件元始高度
                        var _ControlHeight = ParentObj.height() - ((parseFloat(Position.Top) + parseFloat(Position.Bottom)) * ParentObj.height());
                        //var _ControlHeight = ControlHeight;
                        var _NewControlHeight = 0; //改变之后的高度
                        if (value <= animation.MinValue) {
                            _NewControlHeight = _ControlHeight * (animation.MinPercentage / 100);
                        }
                        else if (value >= animation.MaxValue) {
                            _NewControlHeight = _ControlHeight * (animation.MaxPercentage / 100);
                        }
                        else {
                            var interval = (animation.MaxValue - animation.MinValue) / (animation.MaxPercentage - animation.MaxPercentage);
                            interval = (interval === Infinity || interval <= 0) ? 1 : interval;
                            var piex = value * interval / 100;
                            _NewControlHeight = _ControlHeight * piex;
                        }
                        //根据参考点不同取对应的上偏移像素
                        switch (animation.Rvalue) {
                            case "0": //上
                                //上偏移位置不变
                                break;
                            case "1": //中
                                //上偏移增大当(_ControlHeight-_NewControlheight)/2
                                _ControlTop += (_ControlHeight - _NewControlHeight) / 2;
                                break;
                            case "2": //下
                                //上偏移增大_ControlHeight
                                _ControlTop += _ControlHeight;
                                break;
                        }
                        //设置上偏移
                        $(controlPanel).css("top", Agi.Controls.IsControlEdit ? '0' : _ControlTop);
                        //设置控件高度
                        $(controlPanel).css("height", _NewControlHeight);
                    }
                    if (animation.type === "wChange") {
                        //获取控件元始左偏移像素
                        var _ControlLeft = parseInt(parseFloat(Position.Left) * ParentObj.width());
                        //获取控件元始宽度
                        var _ControlWidth = ParentObj.width() - ((parseFloat(Position.Left) + parseFloat(Position.Right)) * ParentObj.width());
                        //var _ControlWidth = ControlWidth;
                        var _NewControlWidth = 0; //改变之后的宽度
                        if (value <= animation.MinValue) {
                            _NewControlWidth = _ControlWidth * (animation.MinPercentage / 100);
                        }
                        else if (value >= animation.MaxValue) {
                            _NewControlWidth = _ControlWidth * (animation.MaxPercentage / 100);
                        }
                        else {
                            var interval = (animation.MaxValue - animation.MinValue) / (animation.MaxPercentage - animation.MaxPercentage);
                            interval = (interval === Infinity || interval <= 0) ? 1 : interval;
                            var piex = value * interval / 100;
                            _NewControlWidth = _ControlWidth * piex;
                        }
                        //根据参考点不同取对应的左偏移像素
                        switch (animation.Rvalue) {
                            case "0": //左
                                //左偏移位置不变
                                break;
                            case "1": //中
                                //左偏移增大当(_ControlWidth-_NewControlwidth)/2
                                _ControlLeft += (_ControlWidth - _NewControlwidth) / 2;
                                break;
                            case "2": //右
                                //左偏移增大_ControlHeight
                                _ControlLeft += _ControlWidth;
                                break;
                        }
                        //设置左偏移
                        $(controlPanel).css("left", Agi.Controls.IsControlEdit ? '0' : _ControlLeft);
                        //设置控件宽度
                        $(controlPanel).css("width", _NewControlWidth);
                        //console.log('_NewControlWidth:'+ _NewControlWidth+'->' + 'currentValue:'+value)
                    }
                    if (animation.type === "isVisible") {
                        var Vstate = animation.Vstate == "0" ? true : false;
                        var expression = animation.expression;
                        while (expression.indexOf("var") != -1) {
                            expression = expression.replace("var", value);
                        }
                        if (eval(expression) && Vstate) {
                            $(controlPanel).css("display", "none");
                        }
                        else {
                            if (!eval(expression) && !Vstate) {
                                $(controlPanel).css("display", "none");
                            } else {
                                $(controlPanel).css("display", "block");
                            }
                        }
                    }

                }

            });
        },
        Render: function (_Target) {
            //
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var ThisHTMLElement = this.Get("HTMLElement");
            if (ThisHTMLElement != null) {
                $(ThisHTMLElement).appendTo(obj);
            }
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
                menuManagement.dragablePoint();
            }
        },
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 60,
                minWidth: 180
            });
            return this;
        },
        ReadData: function (et) {
            //
            return;
            //
            this.changEntity = true;
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity", entity);
            //
            var that = this;
            //
            Agi.Utility.RequestData(et, function (d) {
                var dataArray = [];
                var data = d;
                var cols = et.Columns;
                $.each(data, function (i, item) {
                    $.each(cols, function (i2, col) {
                        if (item[col]) {
                            dataArray.push(item[col]);
                        }
                    })
                });
                //
                var AnimationControlDataProperty = that.Get("AnimationControlDataProperty");
                var dataProperty = AnimationControlDataProperty.propertyData;
                //
                var data = AnimationControlDataProperty.data;
                //
                data.usl = dataProperty.usl;
                data.lsl = dataProperty.lsl;
                data.target = dataProperty.target;
                //最大值
                var i = dataArray[0];
                for (n = 0; n < dataArray.length; n++) {
                    if (i < dataArray[n]) {
                        i = dataArray[n];
                    }
                }
                data.zuidazhi = i;
                //
                var i = dataArray[0];
                for (n = 0; n < dataArray.length; n++) {
                    if (i > dataArray[n]) {
                        i = dataArray[n];
                    }
                }
                data.zuixiaozhi = i;
                //
                data.ceshishuliang = dataArray.length;
                //webservice回调
                var json = { 'action': 'RCalHistogram', 'dataArray': dataArray, 'sampleLength': '', 'USL': '', 'LSL': '', 'specValue': '' };
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalHistogram",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var histoReturn = result;
                                data.zizushuliang = histoReturn.data.groupNumber;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //
                var json = { 'action': 'RCalNormalDis', 'dataArray': dataArray, 'nrow': dataProperty.nrow };
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalNormalDis",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var normalReturn = result;
                                data.junzhi = normalReturn.data.xBarBar;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //
                var json = { 'action': 'RCalProcessCap', 'dataArray': dataArray, 'USL': dataProperty.usl, 'LSL': dataProperty.lsl, 'nrow': dataProperty.nrow, 'sampleLength': '', 'constantArray': '' };
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalProcessCap",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var pcReturn = result;
                                data.bianyixishu = pcReturn.data.CV;
                                data.cp = pcReturn.data.Cp;
                                data.cr = pcReturn.data.Cr;
                                data.Cpk = pcReturn.data.Cpk;
                                data.Cpu = pcReturn.data.Cpu;
                                data.Cpl = pcReturn.data.Cpl;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //
                var json = { 'action': 'RCalProcessPer', 'dataArray': dataArray, 'USL': dataProperty.usl, 'LSL': dataProperty.lsl };
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalProcessPer",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var ppReturn = result;
                                data.pp = ppReturn.data.Pp;
                                data.pr = ppReturn.data.Pr;
                                data.Ppk = ppReturn.data.Ppk;
                                data.Ppu = ppReturn.data.Ppu;
                                data.Ppl = ppReturn.data.Ppl;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                return;
                var histoReturn = JSON.parse('{"result":"true","data":{"groupNumber":3,"groups":[{"lowerLimit":0.5,"upperLimit":2.5,"groupSize":2},{"lowerLimit":2.5,"upperLimit":4.5,"groupSize":2},{"lowerLimit":4.5,"upperLimit":6.5,"groupSize":2}]},"message":"返回成功"}');
                var pcReturn = JSON.parse('{"result":"true","data":{"CV":0,"Cp":-0.282,"Cpu":-0.282,"Cpl":-0.282,"Cpk":-0.282,"Cr":-3.5460992907801425},"message":"返回成功"}');
                var ppReturn = JSON.parse('{"result":"true","data":{"Pp":-0.0890870806374748,"Ppu":-0.44543540318737396,"Ppl":0.2672612419124244,"Ppk":0.2672612419124244,"Pr":-11.224972160321824},"message":"返回成功"}');
                var normalReturn = JSON.parse('{"result":"true","data":{"xBarBar":3.5,"sigma":1.8708286933869707},"message":"返回成功"}');
                var data = that.Get(data);
                if (!data) {
                    data = {
                        zuidazhi: 0,
                        zuixiaozhi: 0,
                        ceshishuliang: 0,
                        zizushuliang: 0,
                        zizudaxiao: 0,
                        bianyixishu: 0,
                        junzhi: 0,
                        cp: 0,
                        cr: 0,
                        pp: 0,
                        pr: 0,
                        Cpk: 0,
                        Ppk: 0,
                        Cpu: 0,
                        Ppu: 0,
                        Cpl: 0,
                        Ppl: 0
                        //Cpm:0,
                        //Ppm:0
                    };
                }
                //
                data.bianyixishu = pcReturn.data.CV;
                data.junzhi = normalReturn.data.xBarBar;
                data.cp = pcReturn.data.Cp;
                data.cr = pcReturn.data.Cr;
                data.pp = ppReturn.data.Pp;
                data.pr = ppReturn.data.Pr;
                //
                data.Cpk = pcReturn.data.Cpk;
                data.Cpu = pcReturn.data.Cpu;
                data.Cpl = pcReturn.data.Cpl;
                //data.Cpm = pcReturn.data.Cpm;
                //
                data.Ppk = ppReturn.data.Ppk;
                data.Ppu = ppReturn.data.Ppu;
                data.Ppl = ppReturn.data.Ppl;
                //data.Ppm = pcReturn.data.Cpk;
                //
                that.Set(data);
                //
                that.initData(data);
            });
        },
        ReadOtherData: function (Point) {
            var ThisProPerty = this.Get("ProPerty");
            if (!Agi.Controls.IsOpenControl) {
                Agi.Msg.PointsManageInfo.AddPoint({ "ControlID": this.Get("ProPerty").ID, "Points": [Point] });
            }
            else {
                Agi.Msg.PointsManageInfo.AddViewPoint({ "ControlID": this.Get("ProPerty").ID, "Points": [Point] });
            }
            ThisProPerty.realtimeTag = Point;
            this.Set("ProPerty", ThisProPerty);
            var PropertySettings = this.Get("PropertySettings");
            PropertySettings.realtimeTag = Point;
            this.Set("PropertySettings", PropertySettings);
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.AnimationControlPropertyInit(this);
            }
        },
        ReadRealData: function (MsgObj) {
            var ThisProPerty = this.Get("ProPerty");
            var DashboardChartProperty = ThisProPerty.BasciObj;
            if (!isNaN(MsgObj.Value)) {
                this.initData(MsgObj);
            }
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            //this.Set('Entity', this.Get('Entity'));
            this.ReadData(this.Get('Entity')[0]);
        },
        Init: function (_Target, _ShowPosition, trueid) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "AnimationControl");
            //PropertySettings
            var PropertySettings = {
                animations: [],
                realtimeTag: null
            }
            this.Set("PropertySettings", PropertySettings)
            //
            var ID = 0;
            if (trueid) {
                ID = trueid;
            }
            else {
                ID = "AnimationControl" + Agi.Script.CreateControlGUID();
            }
            //
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='overflow:hidden ;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: 300,
                height: 400,
                divPanel: HTMLElementPanel
            });
            //
            var AnimationControlBasicProperty = {
                AnimationControlTextField: undefined,
                AnimationControlValueField: undefined,
                LeftFillet1: 0,
                LeftFillet2: 0,
                RightFillet1: 0,
                RightFillet2: 0,
                fontSize: "14",
                fontColor: "black",
                bgColor: "",
                FontText: "test",
                borderWidth: 0,
                borderColor: "red",
                hrefAddress: "",
                IsDisabledhrefAddress: "disabled",
                OpenPosition: "",
                IsDisabledOpenPosition: "disabled",
                InsideLinkAddress: "",
                IsDisabledInsideLinkAddress: null,
                IsLink: null,
                IsShadow: null
            };
            this.Set("AnimationControlBasicProperty", AnimationControlBasicProperty);
            //
            //  Agi.Controls.objAnimationControl = ToUrl;
            var getAnimationControlProperty = this.Get("AnimationControlBasicProperty");
            var BaseControlObj = $('<div id="' + ID + '" class="AnimationControlPor" value="">'
                + '<div id="AnimationControlObjId">'
                + '</div>'
                + '</div>');
            BaseControlObj.load("JS/Controls/AnimationControl/animationPage001.html")
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };
            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
            this.Set("ProPerty", ThisProPerty);
            // this.Set("HTMLElement", ThisProPerty.BasciObj[0]);
            this.Set("ThemeInfo", null);
            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(320);
                HTMLElementPanel.height(240);
                //BaseControlObj.height($('.HTMLElementPanel').height() - 14);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("PanelSty");
                HTMLElementPanel.addClass("AutoFill_PanelSty");
                obj.html("");
            }
            if (_Target != null) {
                this.Render(_Target);
            }
            var StartPoint = { X: 0, Y: 0 }
            var self = this;
            /*事件绑定*/
            if (Agi.Edit) {
                $('#' + self.shell.ID).mousedown(function (ev) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
                $('#' + self.shell.ID).dblclick(function (ev) {
                    if (!Agi.Controls.IsControlEdit) {
                        Agi.Controls.ControlEdit(self); //控件编辑界面
                    }
                });
                if (HTMLElementPanel.touchstart) {
                    HTMLElementPanel.touchstart(function (ev) {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    });
                }
            }
            //
            this.Set("Position", PostionValue);
            //
            //            Agi.Msg.PageOutPramats.AddPramats({
            //                'Type': Agi.Msg.Enum.Controls,
            //                'Key': ID,
            //                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1 }]
            //            });
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = AnimationControlFilter = null;
            //缩放最小宽高设置
            if (Agi.Edit) {
                HTMLElementPanel.resizable({
                    minHeight: 32,
                    minWidth: 32
                });
            }
            //20130515 倪飘 解决bug，组态环境中拖入容器框控件以后拖入动画控件，容器框控件会覆盖住动画控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            //            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/
            //Agi.Edit.workspace.controlList.remove(this);
            //Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/
            //            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        CustomProPanelShow: function () {
            Agi.Controls.AnimationControlPropertyInit(this);
        },
        Copy: function () {
            //20130530 倪飘 解决bug，动画控件不能粘贴复制，按F12页面报错
            if (layoutManagement.property.type == 1) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newAnimationControlPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewAnimationControl = new Agi.Controls.AnimationControl();
                NewAnimationControl.Init(ParentObj, PostionValue);
                newAnimationControlPositionpars = null;
                return NewAnimationControl;
            }
        },
        PostionChange: function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                var _ThisPosition = {
                    Left: (_Postion.Left / PagePars.Width).toFixed(4),
                    Top: (_Postion.Top / PagePars.Height).toFixed(4),
                    Right: (_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                //var ParentObj=$(this.Get("HTMLElement")).parent();
                var ThisHTMLElement = $(this.Get("HTMLElement"));
                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };
//                var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                //                var ThisControlPars = { Width: ThisHTMLElement.width(), Height: ThisHTMLElement.height(), Left: (ThisHTMLElement.offset().left - PagePars.Left), Top: (ThisHTMLElement.offset().top - PagePars.Top), Right: 0, Bottom: 0 };
                //20130106 12:18 markeluo 由于未获取控件高度和宽度导致动画控件无法更改大小
                ControlWidth = ThisHTMLElement.width();
                ControlHeight = ThisHTMLElement.height();
                //添加动画配置之后，如果移动控件，获取到的控件宽度或高度不是初始化控件宽度和高度
                var ThisControlPars = { Width: ControlWidth, Height: ControlHeight, Left: (ThisHTMLElement.offset().left - PagePars.Left), Top: (ThisHTMLElement.offset().top - PagePars.Top), Right: 0, Bottom: 0 };

                ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
                ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);
                var _ThisPosition = {
                    Left: (ThisControlPars.Left / PagePars.Width).toFixed(4),
                    Top: (ThisControlPars.Top / PagePars.Height).toFixed(4),
                    Right: (ThisControlPars.Right / PagePars.Width).toFixed(4),
                    Bottom: (ThisControlPars.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
                /*border*/
                var fillBorder = ThisHTMLElement.find("#ac_border"); // $("#ac_border");
                var borderwithtxt = fillBorder.css("border-width");
                if (borderwithtxt != "") {
                    borderwithtxt = borderwithtxt.replace("px", "")
                    borderwithtxt = parseInt(borderwithtxt);
                } else {
                    borderwithtxt = 0;
                }
                //                var fillBorder_height = ThisControlPars.Height - 2 * parseInt(fillBorder.css("border-width"));
                var fillBorder_height = parseInt(ThisControlPars.Height - 2 * borderwithtxt);
                fillBorder.height(fillBorder_height);
            }
        },
        FilterChange: function (_Fillter) {
            if (_Fillter != null && _Fillter.LeftFillet1 != null && _Fillter.LeftFillet2 != null && _Fillter.RightFillet1 != null && _Fillter.RightFillet2 != null) {
                this.Set("AnimationControlBasicProperty", _Fillter);
                _Fillter = null;
            }
        },
        Refresh: function () {
            var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
            var ParentObj = ThisHTMLElement.parent();
            if (!ParentObj.length) {
                return;
            }
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            var PostionValue = this.Get("Position");
            PostionValue.Left = parseFloat(PostionValue.Left);
            PostionValue.Right = parseFloat(PostionValue.Right);
            PostionValue.Top = parseFloat(PostionValue.Top);
            PostionValue.Bottom = parseFloat(PostionValue.Bottom);
            var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (PostionValue.Left + PostionValue.Right))),
                Height: parseInt(PagePars.Height - (PagePars.Height * (PostionValue.Top + PostionValue.Bottom)))
            };
            ThisHTMLElement.width(ThisControlPars.Width);
            ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
            this.Set("Position", this.Get("Position"))
        },
        Checked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /*   $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
            "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"
            });*/
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        EnterEditState: function (size) {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            if (size) {
                obj.css({ "width": size.width, "height": size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
            //
            var width = $("#ControlEditPageLeft").css("width");
            var height = $("#ControlEditPageLeft").css("height");
            obj.css({ "width": width, "height": height });
            //
            /*this.shell.Container.width(width);
            this.shell.Container.height(height);*/
            /*border*/
            var fillBorder = obj.find("#ac_border"); // $("#ac_border");
            var fillBorder_height = obj.height() - 2 * parseInt(fillBorder.css("border-width"));
            fillBorder.height(fillBorder_height);
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight: 100,
                    minWidth: 100
                });
            }
            this.PostionChange(null);
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            switch (Key) {
                case "Position":
                    if (layoutManagement.property.type == 1) {
                        var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                        var ParentObj = ThisHTMLElement.parent();
                        var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };

                        ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                        ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                        //20130106 12:18 markeluo 由于未获取控件高度和宽度导致动画控件无法更改大小
                        //                        ControlWidth = PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width);
                        //                        ControlHeight = PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height);
                        //
                        //                        ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                        //                        ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                        var ThisControlPars = { Width: parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                            Height: parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))
                        };
                        ThisHTMLElement.width(ThisControlPars.Width);
                        ThisHTMLElement.height(ThisControlPars.Height);
                    }
                    break;
                case "AnimationControlBasicProperty":
                    if (layoutManagement.property.type == 1) {
                        var $UI = $('#' + this.shell.ID).find('.AnimationControlPor');
                        $(this.Get('HTMLElement')).css("border-top-left-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-top-right-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-bottom-left-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-bottom-right-radius", "5px");
                        $('#' + this.shell.ID).find('#AnimationControlObjId').css({ "font-size": "" + _Value.fontSize + "px" });
                        $('#' + this.shell.ID).find('#AnimationControlObjId').css({ "color": "" + _Value.fontColor + "" });
                        /*if (_Value.FontText) {
                        $('#' + this.shell.ID).find('#AnimationControlObjId').text(_Value.FontText);
                        }
                        else if (_Value.AnimationControlTextField) {
                        $('#' + this.shell.ID).find('#AnimationControlObjId').text(_Value.AnimationControlTextField);
                        }*/
                        //$(this.Get('HTMLElement')).css({"background-color":"" + _Value.bgColor + ""});
                        // $("#"+propertyAnimationControl.shell.BasicID).css({" text-align":""+fontPosition+""});  AnimationControlObjId
                        $UI.css({ "border-width": "" + _Value.borderWidth + "" });
                        $UI.css({ "border-color": "" + _Value.borderColor + "" });
                        if (_Value.hrefAddress != "" || _Value.InsideLinkAddress != "") {
                            $UI.css({ "text-decoration": "underline", "cursor": "pointer" });
                        }
                    }
                    break;
                    var self = _obj;
                case "data": //用户选择了一个项目
                    {
                        var data = _ControlObj.Get('data');
                        if (data.selectedValue.value) {
                            //alert('您选择了:'+data.selectedValue.value +'\n'+ data.selectedValue.text);
                            var ThisProPerty = _ControlObj.Get("ProPerty");
                            Agi.Msg.PageOutPramats.PramatsChange({
                                'Type': Agi.Msg.Enum.Controls,
                                'Key': ThisProPerty.ID,
                                'ChangeValue': [
                                { 'Name': 'selectedValue', 'Value': data.selectedValue.value }
                            ]
                            });
                            Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": _obj, "Type": Agi.Msg.Enum.Controls });
                        }
                    }
                    break;
                case "Entity": //实体
                    {
                        var entity = _obj.Get('Entity');
                        if (entity && entity.length) {
                            //BindDataByEntity(_obj, entity[0]);
                            //this.ReadData(entity[0]);
                        } else {
                            var $UI = $('#' + self.shell.ID);
                            $UI.find('.AnimationControlPor').text('');
                        }
                    }
                    break;
            } //end switch
        },
        GetConfig: function () {
            var Property = this.Get("ProPerty");
            //
            var config = {
                ControlType: this.Get("ControlType"),
                ControlID: Property.ID,
                ControlBaseObj: Property.ID,
                HTMLElement: Property.ID,
                Entity: this.Get("Entity"),
                Position: this.Get("Position"),
                AnimationControlBasicProperty: this.Get("AnimationControlBasicProperty"),
                AnimationControlPropertySettings: this.Get("PropertySettings"),
                ThemeInfo: this.Get("ThemeInfo")
            }
            //console.log(config.AnimationControlPropertySettings)
            //console.log(JSON.stringify(this.Get("PropertySettings")))
            //
            //return JSON.stringify(config);
            return config;
            //
            /*  var ConfigObj = new Agi.Script.StringBuilder();
            */
            /*配置信息数组对象*/
            /*
            ConfigObj.append("<Control>");
            ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>");
            */
            /*控件类型*/
            /*
            ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>");
            */
            /*控件属性*/
            /*
            ConfigObj.append("<ControlBaseObj>" + ProPerty.ID + "</ControlBaseObj>");
            */
            /*控件基础对象*/
            /*
            ConfigObj.append("<HTMLElement>" + ProPerty.ID + "</HTMLElement>");
            */
            /*控件的外壳HTML元素信息*/
            /*

            ConfigObj.append("<Entity>" + JSON.stringify(this.Get("Entity")) + "</Entity>");
            */
            /*控件的外壳HTML元素信息*/
            /*
            ConfigObj.append("<Position>" + JSON.stringify(this.Get("Position")) + "</Position>");
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("<AnimationControlBasicProperty>" + JSON.stringify(this.Get("AnimationControlBasicProperty")) + "</AnimationControlBasicProperty>");
            //
            var PropertySettings = this.Get("PropertySettings");
            ConfigObj.append("<PropertySettings>" + JSON.stringify(PropertySettings) + "</PropertySettings>");
            //
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("<ThemeInfo>" + JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>");
            */
            /*控件位置信息*/
            /*
            ConfigObj.append("</Control>");
            return ConfigObj.toString(); //返回配置字符串*/
        }, //获得AnimationControl控件的配置信息
        CreateControl: function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement, _Config.ControlID);
            if (_Config != null) {
                var AnimationControlBasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.Entity = _Config.Entity;
                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);
                    _Config.ThemeInfo = _Config.ThemeInfo;
                    AnimationControlBasicProperty = _Config.AnimationControlBasicProperty;
                    this.Set("AnimationControlBasicProperty", AnimationControlBasicProperty);
                    var PropertySettings = _Config.AnimationControlPropertySettings;
                    this.Set("PropertySettings", PropertySettings);
                    var ThisProPerty = this.Get('ProPerty');
                    //ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);
                    $("#" + ThisProPerty.ID).css({ "font-size": "" + AnimationControlBasicProperty.fontSize + "px" });
                    $("#" + ThisProPerty.ID).css({ "color": "" + AnimationControlBasicProperty.fontColor + "" });
                    //$("#" + ThisProPerty.ID).css({"background-color":"" + AnimationControlBasicProperty.bgColor + ""});
                    $("#" + ThisProPerty.ID).val(AnimationControlBasicProperty.FontText);
                    $("#" + ThisProPerty.ID).css({ "border-width": "solid " + AnimationControlBasicProperty.borderWidth + "" });
                    $("#" + ThisProPerty.ID).css({ "border-color": "" + AnimationControlBasicProperty.borderColor + "" });
                    if (AnimationControlBasicProperty.hrefAddress != "" || AnimationControlBasicProperty.InsideLinkAddress != "") {
                        $("#" + ThisProPerty.ID).css({ "text-decoration": "underline" });
                    }
                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height() };
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);
                    var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height: parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))
                    };
                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");
                    this.Set("Entity", _Config.Entity);
                    //
                    this.ReadOtherData(this.Get("PropertySettings").realtimeTag);
                }
            }
        } //根据配置信息创建控件
    }, true);
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitAnimationControl = function () {
    return new Agi.Controls.AnimationControl();
}
/*属性设置初始化*/
Agi.Controls.AnimationControlPropertyInit = function (AnimationControl) {
    //
    var selfID = $("#" + AnimationControl.shell.BasicID)
    //
    var ThisProItems = [];
    //绘制属性配置界面
    var bindHTML = $('<form class="form-horizontal"></form>');
    //基本属性
    var ItemContent = new Agi.Script.StringBuilder();
    ItemContent.append("<div class='BasicProperty_Radius'>");
    ItemContent.append("<table class='RadiusTable'>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityAnimationControlTabletd0' width='50%'>"
        + "实时点位"
        + "</td>");
    ItemContent.append("<td class='prortityAnimationControlTabletd0'>"
        + "<input type='text' value='' id='AnimationControlPropertyRealtimeTag' class='ControlProTextSty' maxlength='20' ischeck='true'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityAnimationControlTabletd0'>"
        + "边框宽度"
        + "</td>");
    ItemContent.append("<td class='prortityAnimationControlTabletd0'>"
        + "<input value='0' id='AnimationControlPropertyBorder' defaultvalue='0' type='number' min='0' max='50' class='ControlProNumberSty'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityAnimationControlTabletd0'>"
        + "<input type='button' value='动画属性设置' id='AnimationControlPropertyAnimationSettings' class='btnclass'>"
        + "</td>");
    ItemContent.append("<td class='prortityAnimationControlTabletd0'>"
        + "<input type='button' value='预览' id='AnimationControlPropertyAnimationSettingsPreview' class='btnclass'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("<tr>");
    ItemContent.append("<td class='prortityAnimationControlTabletd0'colspan='2'>"
        + "<input type='button' value='保存' id='AnimationControlPropertySave' class='btnclass'>"
        + "</td>");
    ItemContent.append("</tr>");
    ItemContent.append("</table>");
    ItemContent.append("</div>");
    //
    var PropertySettingsHtml = $(ItemContent.toString());
    //
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title:"基本设置", DisabledValue:1, ContentObj:PropertySettingsHtml }));
    //
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    //
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        //        var itemtitle = _item.Title;
        //        if (_item.DisabledValue == 0) {
        //            itemtitle += "禁用";
        //        } else {
        //            itemtitle += "启用";
        //        }
        //        alert(itemtitle);
    }
    //初始化控件属性
    var control = Agi.Edit.workspace.currentControls[0];
    var propertySettings = control.Get("PropertySettings");
    $("#AnimationControlPropertyRealtimeTag").val(propertySettings.realtimeTag);
    $("#AnimationControlPropertyBorder").val(propertySettings.border ? propertySettings.border : 0);
    //
    /*属性事件*/
    $("#AnimationControlPropertySave").live(
        "click",
        function () {
            var control = Agi.Edit.workspace.currentControls[0];
            var propertySettings = control.Get("PropertySettings")
            propertySettings.border = $("#AnimationControlPropertyBorder").val()
            control.Set("PropertySettings", propertySettings);
            //var aniBorder = control.Get("ProPerty").BasciObj.find("#ac_border");
            //aniBorder.css("border-width", propertySettings.border + "px");
//            aniBorder.css("border-bottom-width", "-" + propertySettings.border + "px");
            //var fillBorder_height = control.Get("ProPerty").BasciObj.height() - 2 * parseInt(aniBorder.css("border-width"));
            //aniBorder.height(fillBorder_height);
            control.ReadOtherData($("#AnimationControlPropertyRealtimeTag").val());
        });
    $("#AnimationControlPropertyAnimationSettings").unbind();
    $("#AnimationControlPropertyAnimationSettings").bind(
        "click",
        function () {
            //
            $("<div class='modal hide' style='width: 640px; height: 360px;overflow: hidden;'>" +
                "<div class='modal-header paramHeader'>" +
                "<button type='button' class='close' data-dismiss='modal'>×</button>" +
                "<p>动画属性配置</p>" +
                "</div>" +
                "</div>")
                .appendTo($("body"))
                .append(
                $("<div></div>")
                    .load("JS/Controls/AnimationControl/animationSettings.html")
            )
                //.draggable()
                .modal()
                .on('hidden', function () {
                    $(this).remove();
                });
        });
    $("#AnimationControlPropertyAnimationSettingsPreview").unbind();
    $("#AnimationControlPropertyAnimationSettingsPreview").bind(
        "click",
        function () {
            animationPage.preview();
        });
};

