Namespace.register("Agi.ColorPicker");
Agi.ColorPicker = function (option) {
    var self = this;
    //配置
    self.pro = {
        panelID:'AgiColorPickerDialog1',
        tabsID:'AgiColorPickerDialog_tabs',
        defaultValue:null,
        saveCallBack:function () {
        },
        cancelCallBack:function () {
        },
        disableTabIndex:[],
        gradiendLevelLimited : 10
    };
    //属性
    self.dialogBox = null;
    self.tabs = null;
    self.jpicker = null;
    self.selectValue = {
        type:1,
        color:null
    };
    self.gradientEl = {
        gradientType:null,
        previewEl:null,
        dragArea:null,
        stopMarker:null
    };
    self.imagesContainer = null;
    //临时属性
    self.tempSelectedType = 1;
    //纯色填充控件相关回调函数
    self.type1CallBacks = {
        saveCalllBack:function (color, context) {
        },
        changungCallBack:function (color, context) {
            self.selectValue.color = color.val('all');
            //console.log(self.selectValue.color);
        },
        cancelCallBack:function (color, context) {

        }
    };

    for (name in option) {
        self.pro[name] = option[name];
    }

    //构造整个弹出对话框
    //初始化纯色填充的UI
    self.initial = function () {
        var htmlStr = "";
        htmlStr = '<div id="' + self.pro.panelID + '" title="颜色选择器" class="hide">' +
            '</div>';
        var panel = $(htmlStr);
        panel.load('JS/AgiColorPicker/tabTemplates.html #AgiColorPickerDialog_tabs', function () {
            panel.appendTo($('body:first'));
            self.dialogBox = $('#' + self.pro.panelID).dialog({
                zIndex:1000000,
                width:620,
                height:'auto',
                'min-height':488,
                resizable:false,
                position:'top',
                autoOpen:false,
                modal:true,
                buttons:{
                    "确定":function () {
//                        if (self.tempSelectedType == 4) {
//                            alert('暂未实现');
//                            return;
//                        }
                        self.selectValue.type = self.tempSelectedType;
                        if (self.tempSelectedType === 1) {
                            var val = self.selectValue;
                            var r = 0, g = 0, b = 0, a = 0;
                            var hex = 'ffffff', ahex = 'ffffffff';
                            if (val.color) {
                                r = val.color.r;
                                g = val.color.g;
                                b = val.color.b;
                                a = val.color.a;
                                hex = val.color.hex;
                                ahex = val.color.ahex;
                            }
                            var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + ( a / 255 ) + ')';
                            var type1 = {
                                type:self.selectValue.type,
                                rgba:rgba,
                                hex:hex,
                                ahex:ahex,
                                value:{'background':rgba}
                            };
                            self.pro.saveCallBack.call(self, type1);
                        }
                        else if (self.tempSelectedType === 2) {
                            var tempGradient = getGradientForWebkit();
                            var gradient = {
                                type:self.selectValue.type,
                                direction:tempGradient.direction,
                                stopMarker:tempGradient.stopMarker,
                                value:{'background':tempGradient.value}
                            };
                            self.pro.saveCallBack.call(self, gradient);
                        }
                        else if(self.tempSelectedType === 3){
                            var selectItem = self.imagesContainer.find('a.selected img');
                            var img =null;
                            var url=null;
                            if(Agi.WebServiceConfig.Type==".NET"){
                                url = !Agi.ImgServiceAddress ? selectItem.attr('src')  : Agi.ImgServiceAddress + '/SourceManager/'+ selectItem.attr('title');
                                img = {
                                    type:self.selectValue.type,
                                    imgName: '/SourceManager/' + selectItem.attr('title'),
                                    value:{
                                        'background-image': null,
                                        'background-size': '100%',
                                        'background-position': '50% 50%',
                                        'background-repeat': 'no-repeat no-repeat'
                                    }
                                };
                                img.value['background-image'] = 'url('+url +')';
                                if(Agi.ImgServiceAddress){
                                    img.value['background-image'] = 'url('+Agi.ImgServiceAddress+'/SourceManager/' + selectItem.attr('title') +')';
                                }
                            }else{
                                url =$(selectItem).data('imgsrc');
                                img = {
                                    type:self.selectValue.type,
                                    imgName:'/'+selectItem.attr('title'),
                                    value:{
                                        'background-image': null,
                                        'background-size': '100%',
                                        'background-position': '50% 50%',
                                        'background-repeat': 'no-repeat no-repeat'
                                    }
                                };
                                img.value['background-image'] = 'url('+url +')';
                            }
                            self.pro.saveCallBack.call(self, img);
                        }

                        $(this).dialog("close");
                    },
                    "取消":function () {
                        var val = self.selectValue;
                        self.pro.cancelCallBack.call(self, val);
                        $(this).dialog("close");
                    }
                }
            });
            self.dialogBox.parent().attr('id', self.pro.panelID);
            self.dialogBox.css({
                'font-size':'12px',
                'font-family':'Microsoft Yahei'
            });
            self.dialogBox.bind('dialogclose', function () {
                self.pro.gradiendLevelLimited = 10;
                self.pro.disableTabIndex = [];
                self.tabs.tabs('select', 0);
                self.tabs.tabs('enable', 1);
                self.tabs.tabs('enable', 2);
                //打开被禁用的下拉项
                self.dialogBox.find('#colorPickerGradientType option').removeAttr('disabled')
                    .css('background','');
                //reset纯色和渐变色的界面
                $.jPicker.List[0].color.active.val('ahex', 'ffffffff');
                var def = {"type":2,"direction":"horizontal","stopMarker":[{"position":0,"color":"rgb(0, 0, 0)","ahex":"000000ff"},{"position":1,"color":"rgb(66, 48, 201)","ahex":"4230c9ff"}],"value":{"background":"-webkit-gradient(linear, left top, right top,color-stop(0,rgb(0, 0, 0)),color-stop(1,rgb(66, 48, 201)))"}};
                self.initialGradientUI(def);
            });
            self.tabs = $("#" + self.pro.tabsID).tabs();
            self.tabs.bind('tabsselect', function (event, ui) {
                // Objects available in the function context:
                //ui.tab     // anchor element of the selected (clicked) tab
                //ui.panel   // element, that contains the selected/clicked tab contents
                //ui.index   // zero-based index of the selected (clicked) tab
                self.tempSelectedType = ui.index + 1;
            });

            $.fn.jPicker.defaults.images.clientPath = 'JS/AgiColorPicker/jpicker/images/';
            self.jpicker = $('#Alpha').jPicker({
                    window:{
                        expandable:false,
                        title:' ',
                        alphaSupport:true
                    },
                    color:{
                        active:new $.jPicker.Color({ahex:'99330099'})
                    },
                    localization:{
                        text:{
                            title:'Drag Markers To Pick A Color',
                            newColor:' ',
                            currentColor:' ',
                            ok:'OK',
                            cancel:'Cancel'
                        }
                    }
                },
                self.type1CallBacks.saveCalllBack,
                self.type1CallBacks.changungCallBack,
                self.type1CallBacks.cancelCallBack
            );
            self.initialGradientUI();

            self.imagesContainer = $("#colorPickerTab-3>div:eq(0)");
            requestImagesData();
        });//end load

        return self;
    };

    //拖拽区域的点击
    function dragAreaClick(e) {
//        alert(e.eventPhase);
        if (!e.eventPhase || e.eventPhase >= 3) {
            return;
        }
        if(self.gradientEl.dragArea.find('>div.stop-marker').length >= self.pro.gradiendLevelLimited){
            AgiCommonDialogBox.Alert('渐变梯度不可超过'+self.pro.gradiendLevelLimited+'级!');
            return;
        }
        var left = e.offsetX - 11 / 2 + 'px';
        var addItem = '<div class="stop-marker active" title="Color stop" style="left: ' + left + '; top: 0px;">' +
            '<div class="color" style="background-color: rgb(0, 0, 0); "></div></div>';
        var marker = $(addItem).appendTo(self.gradientEl.dragArea);
        marker.find('div').data('ahex', '000000ff');
        //点击事件
        marker.unbind('click').bind('click', stopMarkerClick);
        marker.unbind('dblclick').bind('dblclick', stopMarkerDbClick);
        stopMarkerClick.call(marker);
        //拖动事件添加
        marker.draggable({
            "containment":"parent",
            start:stopMarkerDragStart,
            drag:stopMarkerDrag,
            end:stopMarkerDragEnd
        });
        self.gradientEl.stopMarker.push(marker[0]);

        getGradientForWebkit();
    }

    //stopmarker的点击
    function stopMarkerClick(ev) {
        self.gradientEl.dragArea.find('div.stop-marker').removeClass('active');
        $(this).addClass('active');
        var ahex = $(this).find('div').data('ahex');
        if (ahex) {
            $.jPicker.List[1].color.active.val('ahex', ahex);
        }
    }

    //双击删除
    function stopMarkerDbClick() {
        if (self.gradientEl.stopMarker.length >= 3) {
            $(this).remove();
            self.gradientEl.stopMarker = self.gradientEl.dragArea.find('.stop-marker');
            getGradientForWebkit();
        }
    }

    function stopMarkerDragStart(event, ui) {
        stopMarkerClick.call(ui.helper);
    }

    function stopMarkerDrag(event, ui) {
        getGradientForWebkit();
    }

    function stopMarkerDragEnd(event, ui) {

    }

    function getGradientForWebkit() {
        //方向
        var direction = self.gradientEl.direction.val();
        var styleDirection = 'linear, left top, right top,';
        switch (direction) {
            case 'horizontal':
                styleDirection = '-webkit-gradient(linear, left top, right top,';
                break;
            case 'vertical':
                styleDirection = '-webkit-gradient(linear, left top, left bottom,';
                break;
            case 'diagonal':
                styleDirection = '-webkit-gradient(linear, left top, right bottom,';
                break;
            case 'diagonal-bottom':
                styleDirection = '-webkit-gradient(linear, left bottom, right top,';
                break;
            case 'radial':
                styleDirection = '-webkit-radial-gradient(center, ellipse cover,';
                break;
        }
        var colorStop = [];
        var len = self.gradientEl.stopMarker.length;
        var i = 0;
        self.gradientEl.stopMarker.sort(function (a, b) {
            return ( parseInt(a.style.left.replace('px', '')) > parseInt(b.style.left.replace('px', '')) );
        });
        var result = {
            direction:direction,
            stopMarker:[],
            value:''
        };
        for (; i < len; i++) {
            var marker = $(self.gradientEl.stopMarker[i]);
            var left = parseInt(marker.css('left').replace('px', ''));
            var color = marker.find('div.color').css('background-color');
            var position = left <= 0 ? 0.00 : parseFloat(((left + 11) / 490).toFixed(2));
            if (direction === 'radial') {
                colorStop.push(color + ' ' + (position * 100) + '%');
            } else {
                colorStop.push('color-stop(' + position + ',' + color + ')');
            }
            result.stopMarker.push({
                position:position,
                color:color,
                ahex:marker.find('div.color').data('ahex')
            });
        }
        var bgColor = styleDirection + colorStop.join(',') + ')';
        result.value = bgColor;
        self.gradientEl.previewEl.css('background', bgColor);
        return  result;
    }

    self.initialGradientUI = function (config) {
        var tab2 = $('#colorPickerTab-2');
        //渐变类型改变事件
        tab2.find('#colorPickerGradientType').unbind('change');
        if (config) {
            tab2.find('#colorPickerGradientType').val(config.direction);
        }
        tab2.find('#colorPickerGradientType').bind('change', function () {
            getGradientForWebkit();
        });
        //DOM元素获取
        self.gradientEl.direction = tab2.find('#colorPickerGradientType');
        self.gradientEl.gradientType = tab2.find('#colorPickerGradientType');
        self.gradientEl.previewEl = tab2.find('.gradientViewArea');
        self.gradientEl.dragArea = tab2.find('.gradientDragArea');
        if (config) {
            self.gradientEl.dragArea.empty();
            var i = 0, len = config.stopMarker.length;
            for (; i < len; i++) {
                var pos = parseFloat(config.stopMarker[i].position);
                var color = config.stopMarker[i].color;
                var left = (pos <= 0) ? '0' : pos * 490 - 11 + 'px';
                var addItem = '<div class="stop-marker active" title="Color stop" style="left: ' + left + '; top: 0px;">' +
                    '<div class="color" style="background: rgb(0, 0, 0); "></div></div>';
                var marker = $(addItem).appendTo(self.gradientEl.dragArea);
                marker.find('div.color').css('background', color)
                    .data('ahex', config.stopMarker[i].ahex);
            }
        }
        self.gradientEl.stopMarker = tab2.find('.stop-marker');
        //将两个marker重置位置
        if (!config) {
            self.gradientEl.stopMarker.first().css('left', self.gradientEl.dragArea.offset().left)
                .find('div').css('background-color', 'rgb(0,0,0)').data('ahex', '000000ff');
            self.gradientEl.stopMarker.last().css('left', self.gradientEl.dragArea.offset().left + self.gradientEl.dragArea.width() - 11)
                .find('div').css('background-color', 'rgb(66,48,201)').data('ahex', '4230c9ff');
        }
        //拖动事件添加
        self.gradientEl.stopMarker.draggable({
            "containment":"parent",
            start:stopMarkerDragStart,
            drag:stopMarkerDrag,
            end:stopMarkerDragEnd
        });
        //点击事件
        self.gradientEl.stopMarker.unbind('click').bind('click', stopMarkerClick);
        self.gradientEl.dragArea.unbind('click').bind('click', dragAreaClick);
        //双击删除
        self.gradientEl.stopMarker.unbind('dblclick').bind('dblclick', stopMarkerDbClick);
        //取色器控件
        if (!config) {
            $('#Alpha2').jPicker({
                    window:{
                        expandable:false,
                        title:' ',
                        alphaSupport:true
                    },
                    color:{
                        active:new $.jPicker.Color({ahex:'99330099'})
                    },
                    localization:{
                        text:{
                            title:'Drag Markers To Pick A Color',
                            newColor:' ',
                            currentColor:' ',
                            ok:'OK',
                            cancel:'Cancel'
                        }
                    }
                }, function () {
                },
                function (color, context) {
                    var val = {color:color.val()};
                    var r = 0, g = 0, b = 0, a = 0;
                    var hex = 'ffffff', ahex = 'ffffffff';
                    if (val.color) {
                        r = val.color.r;
                        g = val.color.g;
                        b = val.color.b;
                        a = val.color.a;
                        hex = val.color.hex;
                        ahex = val.color.ahex;
                    }
                    var rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + ( a / 255 ) + ')';
                    self.gradientEl.dragArea.find('div.active').find('div').css('background', rgba)
                        .data('ahex', ahex);
                    getGradientForWebkit();
                },
                function () {
                });
        }
        self.gradientEl.stopMarker.first().click();
        getGradientForWebkit();
    };
    function imageItemClick(){
        self.imagesContainer.find('a').removeClass('selected');
        $(this).addClass('selected');
    }
    function requestImagesData() {
        //20130627 markeluo 图片资源列表获取，兼容JAVA处理
        //var AjaxURL = 'http://192.168.1.122/DataAccessWebService/Service1.asmx/GetImageList';
        //if(undefined  != window.WebServiceAddress){
        //    AjaxURL = WebServiceAddress+"/GetImageList";
        //}
        self.imagesContainer.empty();
        if(Agi.WebServiceConfig.Type==".NET"){
            Agi.DAL.ReadData({
                "MethodName": "GetImageList",
                "Paras": "", //json字符串
                "CallBackFunction": function (response) {     //回调函数
                    if (response.data && response.data.length) {
                        var images = [];
                        var len = response.data.length;
                        for (var i = 0; i < len; i++) {
                            var img = response.data[i];
                            images.push('<a class="color-imageItem"><img title="' + img.Name + '" src="' + img.Url + '" alt=""></a>');
                        }
                        self.imagesContainer.append(images.join(''))
                            .find('a').unbind('click').bind('click', imageItemClick);
                    } else {
                        console.log(JSON.stringify(response));
                    }

                }
            });
        }else{
            var jsonData = { "jsonData": ''};
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({
                "MethodName": "GetImageList",
                "Paras": jsonString,
                "CallBackFunction": function (_result) {
                    var images = [];
                    if(_result!=null && _result.data!=null && _result.data.length>0){
                        var len = _result.data.length;
                        for (var i = 0; i < len; i++) {
                            var img = _result.data[i];
                            images.push('<a class="color-imageItem"><img title="' + img.Name + '" src="' + img.Url + '" alt="" data-imgsrc="' + img.Url + '"></a>');
                        }
                        self.imagesContainer.append(images.join(''))
                            .find('a').unbind('click').bind('click',imageItemClick);
                    }
                }
            });
        }
    }

    /*********************分割线********************/
    self.initial();

    //方法
    self.open = function (option) {
        if (!option) {
            alert('没有输入必要的参数!');
            return;
        }

        for (name in option) {
            self.pro[name] = option[name];
        }

        self.dialogBox.dialog('open');

        if (self.pro.defaultValue) {
            var type = self.pro.defaultValue.type;
            switch (type) {
                case 1:
                    $.jPicker.List[0].color.active.val('ahex', self.pro.defaultValue.ahex);
                    break;
                case 2:
                    self.initialGradientUI(option.defaultValue);
                    break;
                case 3:
                    break;
                case 4:
                    break;
                default:
                    $.jPicker.List[0].color.active.val('ahex', 'ffffffff');
                    break;
            }
            self.tabs.tabs('select', type - 1);
        } else {
            $.jPicker.List[0].color.active.val('ahex', 'ffffffff');
        }

        $(self.pro.disableTabIndex).each(function (i, index) {
            self.tabs.tabs('disable', index);
        });

        //禁用指定的下拉选项
        if(option.defaultValue){
            $(option.defaultValue.disableGradientIndex).each(function (i, index) {
                self.dialogBox.find('#colorPickerGradientType option:eq('+index+')').attr('disabled','disabled')
                    .css('background','#e3e3e3');
            });
        }
        return self;
    };
    self.close = function () {
        self.dialogBox.dialog('close');
        return self;
    };
};
colorPicker = new Agi.ColorPicker();

$(document).ready(function () {
    $('#TitleTextDiv').dblclick(function () {
        var currentColor = $(this).data('colorValue');
        var btn = $(this);
        colorPicker.open({
            disableTabIndex:[],
            defaultValue:!currentColor ? null : currentColor, //这个参数是上一次选中的颜色
            saveCallBack:function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                $('#FrameBottomRightBottomContentDiv').css(color.value);
                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                btn.data('colorValue', color);
            }
        });
    });
});