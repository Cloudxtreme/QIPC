Namespace.register("Agi.Script");
Agi.Script.Editor = function(){
    var self  = this;
    {
        //配置
        self.pro = {
            panelID:'Agi-Script-Editor'
        };
        self.dialogBox = null;//对话框
        self.container = null;//容器
        self.dropdownList = null;//下拉控件
        self.eventMenu = null;//控件事件菜单

        self.controlObjects = null;//控件对象s
        self.parameterObjects = null;//参数对象s
        self.controlMethods = null;//控件对象s
        self.commonMethodObjects = null;//通用方法对象s

        self.textArea = null;//脚本输入框
        self.currentControl = null;//当前编辑的控件
        self.currentEventType = null;//当前事件类型
        self.timerInput = null;
        self.btnSave = null;//保存按钮
        self.btnReset = null;//清除按钮

        self.tree1 = null;
        self.dragObjects = [];
        self.isOpen = false;
    }
    self.initial = function(){
        var htmlStr = "";
        htmlStr = '<div title="脚本编辑器" class="hide">'+
            '</div>';
        var panel = $(htmlStr);
        panel.load('JS/AgiScript/ui/template.html #s-editor-container',function(){
            //载界面并初始化弹出窗口
            panel.appendTo($('body:first'));
            self.dialogBox = panel.dialog({
                zIndex:1000000,
                width: "auto",
                height: "auto",
                resizable: false,
                position:"center",
                autoOpen: false,
                modal:true,
                show: { effect: 'drop', direction: "up" },
                hide: { effect: 'drop', direction: "down" },
                buttons: {
//                    "确定": function() {
//                        self.dialogBox.dialog('close');
//                    },
//                    "取消": function() {
//                        self.dialogBox.dialog('close');
//                    }
                },
                beforeclose: function(event, ui) {
                },
                close: function(event, ui) {
                    self.isOpen = false;
                }
            });
            self.dialogBox.parent().attr('id',self.pro.panelID);

            //初始化界面上的元素
            self.container = panel;
            self.dropdownList = $('#s-editor-dropdown',self.container);
            self.eventMenu = $('.s-editor-eventList',self.container);

            self.controlObjects = $('.accordion-group:eq(0) .accordion-inner',self.container);
            self.parameterObjects = $('.accordion-group:eq(1) .accordion-inner',self.container);
            self.controlMethods = $('.accordion-group:eq(2) .accordion-inner',self.container);
            self.commonMethodObjects = $('.accordion-group:eq(3) .accordion-inner',self.container);
            self.timerInput = $('.s-editor-timer input[type="number"]',self.container);
            self.textArea = $('.s-editor-right-input textarea',self.container);

            self.btnSave = $('.s-editor-right-header .btnSave',self.container);
            self.btnReset = $('.s-editor-right-header .btnReset',self.container);
            self.btnSave.bind('click',function(e){
                var str = self.textArea.val();
                //var str2 = str.replace(/[\n]/g,'')//去回车
//                console.log(str2);
                if(self.currentControl instanceof Agi.Script.Page){
                    self.currentControl.addScriptCode(self.currentEventType,str);
                    var interval = self.timerInput.val();
                    interval = isNaN(interval)?1000:parseInt(interval)*1000;
                    canvas.setTimerInterval(interval);
                }else{
                    self.currentControl.addScriptCode(self.currentEventType,str);
                }
                var state = str.trim() == '' ? 's-state-base s-state-noEvent':'s-state-base s-state-Event';
                self.eventMenu.find('li.active span').attr('class',state);

                $(this).fadeOut(300).delay(300).fadeIn(200);
            });
            self.btnReset.hide();
        });

        return self;
    }

    self.open = function(controlId_in){
        self.dialogBox.dialog('open');
        self.updateDropDownList(controlId_in);
        //('#Agi-Script-Editor').css('z-index',1000000);

        self.dragObjects = null;
        self.dragObjects = [];
        self.loadControls();
        self.loadParameters();
        self.loadControlMethods();
        self.loadCommonMethods();
        self.isOpen = true;
    }
    self.close = function(){
        self.dialogBox.dialog('close');
    }

    self.initial();

    //更新下拉列表控件的
    self.updateDropDownList = function(controlId_in){
        self.dropdownList.empty();
        self.dropdownList.unbind();
        $('<option value="canvas" controlID="canvas">canvas</option>').appendTo(self.dropdownList);
        $(Agi.Edit.workspace.controlList.array).each(function(i,con){
            var id = con.Get('HTMLElement').id.replace('Panel_','');
            var conType = con.Get('ControlType');
            $('<option value="'+conType+'" controlID="'+id+'">'+id+'</option>').appendTo(self.dropdownList);
        });

        self.dropdownList.bind('change',function(e){
            //debugger;
            var type = $(this).val();
            self.eventMenu.empty();
            self.textArea.val('');
            var conID = $(this).find('option:selected').text();
            if(conID === 'canvas'){
                self.currentControl = canvas;
                self.timerInput.val(self.currentControl._timerInterval / 1000)
                    .parent().slideDown();
            }else{
                self.currentControl = Agi.Controls.FindControl(conID);
                self.timerInput.parent().slideUp();
            }
            //加载基本事件
            $(Agi.Script.BaseConfig.baseEventsForControls).each(function(i,bConf){
                var setBool = false;
                if(conID === 'canvas'){
                    if(bConf.type == 'all'){
                        setBool=true;
                    }
                }else{
                    setBool=true;
                }
                if(setBool){
                    var setBool = self.exitsScript(self.currentControl,bConf.key);
                    var className = setBool ? 's-state-Event' : 's-state-noEvent';
                    $('<li><a href="#" key="'+bConf.key+'" title="'+bConf.title+'"><span class="s-state-base '+className+'"></span>'+bConf.name+'</a></li>')
                        .appendTo(self.eventMenu);
                }
            });
            //加载控件自定义事件
            var controlEvent = undefined
            $(Agi.Script.BaseConfig.customEventsForControls).each(function(i,cConf){
                if(cConf.controlType === type){
                    controlEvent = cConf
                    return false;
                }
            });
            if(controlEvent != undefined){
                $(controlEvent.events).each(function(i,e){
                    var setBool = self.exitsScript(self.currentControl,e.key);
                    var className = setBool ? 's-state-Event' : 's-state-noEvent';
                    $('<li><a href="#" key="'+e.key+'" title="'+e.title+'"><span class="s-state-base '+className+'"></span>'+e.name+'</a></li>')
                       .appendTo(self.eventMenu);
                });
            }

            //为事件列表绑定点击事件
            self.eventMenu.find('>li')
                .unbind()
                .bind('click',function(e){
                self.eventMenu.find('li').removeClass('active');
                $(this).addClass('active');

                self.eventListClickHandler(e);
            })
                .first().click();

            //更新对象浏览器容器的高度
            var box1 = self.container.find('.s-editor-box:eq(0)');
            var box2 = self.container.find('.s-editor-box:eq(1)');
            var leftMenu = box2.parent();
            box2.css({
                'height':leftMenu.height() - box1.height() - 10,
                'overflow-y':'auto'
            });
        });//end chage

        if(controlId_in){
            self.dropdownList.find('option[controlID="'+controlId_in+'"]').attr('selected','selected');
        }
        self.dropdownList.change();
    }
    //检查选中控件的事件是否存在脚本
    self.exitsScript = function(con,eventType){
        var setBool = false;
        if(con._scriptCode){
            if(con._scriptCode[eventType]){
                var code =con._scriptCode[eventType].code;
                if(code && code.trim()!=''){
                    setBool = true;
                }
            }
        }
        return setBool;
    }
    //控件事件列表点击处理
    self.eventListClickHandler = function(e){
        //debugger;
        var eventKey = $(e.target).attr('key');
        self.currentEventType = eventKey;
        var code = undefined;
        if(self.currentControl && self.currentControl._scriptCode
            &&self.currentControl._scriptCode[eventKey]){
            code = self.currentControl._scriptCode[eventKey].code;
        }
        if(code && code !=''){
            //var str3 = code.replace(/[;]/g,';\n')//还原
            self.textArea.val(code);
        }else{
            self.textArea.val('');
        }
    }

    //载入控件对象
    self.loadControls = function(){
        var controlName = Agi.Script.ClasslibManage.getControlMethodAttribute();
        var dataIn = [];
        $(controlName).each(function(i,con){
            var aCon = {
                "data":{
                    title:con.control
                },
                "metadata":{ id:con.control,type:'control'},
                "children":[]
            };
            $(con.attribute).each(function(i,attr){
                //属性
                aCon.children.push({
                    "data":{
                        title:attr,
                        icon : "s-editor-icon-property"
                    },
                    "metadata":{ id:attr,type:'controlProperty'}
                });
            });
            dataIn.push(aCon);
        });
        self.controlObjects.jstree({
            json_data:{
                data:dataIn
            },
            plugins:[ "themes", "json_data", "ui" ]
        }).bind("select_node.jstree", function (e, data) {
                //debugger;
                //alert(jQuery.data(data.rslt.obj[0], "id"));
            })
            .bind("loaded.jstree",function(e,data){
                self.tree1 = data.inst;
                var aList = $(this).find('li>a');
                $(aList).each(function(i,a){
                    var dragObj = new Agi.DragDrop.SimpleDragDrop({
                        dragObject: a,
                        targetObject: self.textArea, //目录
                        dragEndCallBack : dragEndCallBackHandler,
                        dargStartCallBack : dargStartCallBackHandler,
                        draggingCallBack : draggingCallBackHandler
                    });
                    self.dragObjects.push(dragObj);
                });
            });//end loaded
    }
    //载入输出参数
    self.loadParameters = function(){
        var params = Agi.Script.ClasslibManage.getOutputParas()
        var dataIn = [{
            "data":'页面变量',
            "metadata":{ id:'' },
            children:[]
        },{
            "data":'实时变量',
            "metadata":{ id:'' }
        },{
            "data":'输出参数',
            "metadata":{ id:'' },
            children:[]
        }];
        $(params.urlParas).each(function(i,pageParam){
            dataIn[0].children.push({
                "data":{
                    title:pageParam,
                    icon : "s-editor-icon-property"
                },
                'attr':{title:pageParam},
                "metadata":{ id:pageParam,type:'pageParam' }
            });
        });

        $(params.controlParas).each(function(i,conParam){
            dataIn[2].children.push({
                "data":{
                    title:conParam,
                    icon : "s-editor-icon-property"
                },
                'attr':{title:conParam},
                "metadata":{ id:conParam,type:'controlParam' }
            });
        });
        self.parameterObjects.jstree({
            json_data:{
                data:dataIn
            },
            plugins:[ "themes", "json_data", "ui" ]
        }).bind("select_node.jstree", function (e, data) {
                //debugger;
                //alert(jQuery.data(data.rslt.obj[0], "id"));
            })
            .bind("loaded.jstree",function(e,data){
                var aList = $(this).find('li>a');
                $(aList).each(function(i,a){
                    var dragObj = new Agi.DragDrop.SimpleDragDrop({
                        dragObject: a,
                        targetObject: self.textArea, //目录
                        dragEndCallBack : dragEndCallBackHandler,
                        dargStartCallBack : dargStartCallBackHandler,
                        draggingCallBack : draggingCallBackHandler
                    });
                    self.dragObjects.push(dragObj);
                });
            });//end loaded
    }
    //载入控件方法
    self.loadControlMethods = function(){
        var controlName = Agi.Script.ClasslibManage.getControlMethodAttribute();
        var dataIn = [];
        $(controlName).each(function(i,con){
            var aCon = {
               "data":con.control,
               "metadata":{ id:con.control,type:'control'},
               children:[]
            };
            $(con.method).each(function(i,method){
                aCon.children.push({
                    "data":{
                        title:method,
                        icon:"s-editor-icon-method"
                    },
                    "metadata":{ id:method,type:'controlMethod'}
                })
            });
            dataIn.push(aCon);
        });
        self.controlMethods.jstree({
            json_data:{
                data:dataIn
            },
            plugins:[ "themes", "json_data", "ui" ]
        }).bind("select_node.jstree", function (e, data) {
                //debugger;
                //alert(jQuery.data(data.rslt.obj[0], "id"));
            }).bind("loaded.jstree",function(e,data){
                var aList = $(this).find('li>a');
                $(aList).each(function(i,a){
                    var dragObj = new Agi.DragDrop.SimpleDragDrop({
                        dragObject: a,
                        targetObject: self.textArea, //目录
                        dragEndCallBack : dragEndCallBackHandler,
                        dargStartCallBack : dargStartCallBackHandler,
                        draggingCallBack : draggingCallBackHandler
                    });
                    self.dragObjects.push(dragObj);
                });
            });//end loaded
    }
    //载入通用库
    self.loadCommonMethods = function(){
        var libs = Agi.Script.BaseConfig.commonLibs;
        var dataIn = [];
        $(libs).each(function(i,lib){
            var aLib = {
                "data":{
                    title:lib.name,
                    icon:'s-editor-icon-class'
                },
                'attr':{title:lib.title},
                "metadata":{ id:lib.name.control,type:'commonLib'},
                children:[]
            };
            $(lib.methods).each(function(i,method){
                aLib.children.push({
                    "data":{
                        title:method.name,
                        icon:"s-editor-icon-method"
                    },
                    'attr':{title:method.title},
                    "metadata":{
                        id: method.methodCode,
                        type:'commonLibMothod'
                    }
                })
            });
            dataIn.push(aLib);
        });
        self.commonMethodObjects.jstree({
            json_data:{
                data:dataIn
            },
            plugins:[ "themes", "json_data", "ui" ]
        }).bind("select_node.jstree", function (e, data) {
                //debugger;
                //alert(jQuery.data(data.rslt.obj[0], "id"));
            }).bind("loaded.jstree",function(e,data){
                var aList = $(this).find('li>a');
                $(aList).each(function(i,a){
                    var dragObj = new Agi.DragDrop.SimpleDragDrop({
                        dragObject: a,
                        targetObject: self.textArea, //目录
                        dragEndCallBack : dragEndCallBackHandler,
                        dargStartCallBack : dargStartCallBackHandler,
                        draggingCallBack : draggingCallBackHandler
                    });
                    self.dragObjects.push(dragObj);
                });
            });//end loaded
    }

    //拖动结束
    function dragEndCallBackHandler(d, tabsTabid){
        var dragElement = d.object.parent();
        var idVal = dragElement.data('id');
        var type = dragElement.data('type');
        var addCode = undefined;
        switch(type){
            case "control"://控件ID
                addCode = "Agi.Controls.FindControl('"+idVal+"')";
                break;
            case "controlProperty"://控件属性
                addCode = "."+idVal+"";
                break;
            case "controlParam"://控件参数
                addCode = "Agi.Script.ClasslibManage.getParaValue('"+idVal+"')";
                break;
            case "pageParam"://页面参数
                addCode = "Agi.Script.ClasslibManage.getParaValue('"+idVal+"')";
                break;
            case "controlMethod"://控件方法
                addCode = "."+idVal+"()";
                break;
            case "commonLibMothod"://通用方法
                addCode = idVal;
                break;
        }
        if(addCode != undefined){
            self.textArea.val(self.textArea.val() + addCode);
        }
    }
    //开始拖
    function dargStartCallBackHandler(d){
        //var type = d.object.parent().data('type');
    }
    //正在拖动
    function draggingCallBackHandler(){

    }
}
var scriptEditor = new Agi.Script.Editor();
