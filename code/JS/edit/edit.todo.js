/*控件实例化*/
(function () {
    Agi.Edit.todo = (function () {
        this.CreateNewControl = function (config,parentId) {
            if (!config) {
                return false;
            }
            var target = parentId != undefined ? $(Agi.Edit.workspace.editDiv).find('#'+parentId) : $(Agi.Edit.workspace.editDiv);
            Edit_InitControlToCanvas(config, target , config.Position, Agi.Edit.workspace
                .GetControlsLibs(config.ControlType), "Agi.Controls.Init" + config.ControlType,parentId);
            return;
        };
        return  this;
    })();
    function Edit_InitControlToCanvas(config, _TargetObj, _position, _controlLibs, _InitFun,_TargetObjID) {
        //
        var NewControl = null;
        Agi.Script.Import.LoadFileList(_controlLibs,
            function () {
                NewControl = eval(_InitFun)();
                NewControl.parentId = _TargetObjID;
                if(_TargetObjID){
                    var container = Agi.Controls.FindControlByPanel(_TargetObjID);
                    if(container){//建立关系
                        container.childControls.push(NewControl);
                    }
                }
                /*读取脚本*/
                NewControl.setScriptCode(config.script);
                NewControl.CreateControl(config, _TargetObj);//初始化显示
                if(Agi.Controls.Container){
                    Agi.Controls.Container.AddSubControl(NewControl);
                }
                //设置层级
                if(config.zIndex){
                    NewControl.Get('HTMLElement').style.zIndex = config.zIndex;
                }
                InitControlMenu(NewControl); //显示菜单
                /*选项卡*/
                if (config.tabsTabid) {
                    var oProprty = NewControl.Get('ProPerty');
                    oProprty.tabsTabid = config.tabsTabid;
                    NewControl.Set('ProPerty', oProprty);
                }
                //
                $("#tabs").tabs("select", 1).tabs("select", 0);
                //
                Agi.Msg.PageLoadManage.Set("PageControlLoadindex", Agi.Msg.PageLoadManage.Get("PageControlLoadindex") + 1);  //add by lj
            }
        );
    }
})();
/*加载库*/
(function () {
    /*CSS3动画库*/
    var animationCSS = document.createElement("link");
    animationCSS.href = "JS/edit/animate.css";
    animationCSS.rel = "stylesheet";
    //$("head").append(animationCSS);
})();
/*页面加载完成事件*/
$(function () {
    //region 主页前进后退，Liuyi。
    /* var goBack = $.noop(), goForward = $.noop();
     var goStack = new Undo.Stack(),
     goCommand = Undo.Command.extend({
     constructor:function (back, forward) {
     this.back = back;
     this.forward = forward;
     },
     execute:function () {
     },
     undo:function () {
     this.back();
     },
     redo:function () {
     this.forward();
     }
     });*/
    //endregion
    //region 动态绑定
    var panelControls = $(".PanelSty");
    if (layoutManagement.property.type == 1) {
        //ly :undoHtml
        panelControls.live("mouseover", function () {
            //拖拽
            $(this)
                .click(function () {
                    if (event.ctrlKey) {
                        $(this).toggleClass('grouped');
                    }
                })
                .draggable({
                    //handle:".selectPanelheadSty",
                    //zIndex:2147483647,
                    containment:"parent",
                    scroll:false,
                    start:function (event, ui) {
                        //$(this).css('position','relative');
                        //region ly,undoHtml
                        oldValue = $(workspace.editDiv).html();
                        //endregion

                        // 20140226 添加记录控件原始位置的代码
                        posTopArray = [];
                        posLeftArray = [];
                        if ($(this).hasClass("grouped")) {  // Loop through each element and store beginning start and left positions
                            $(".grouped").each(function (i) {
                                thiscsstop = $(this).css('top');
                                if (thiscsstop == 'auto') thiscsstop = 0; // For IE

                                thiscssleft = $(this).css('left');
                                if (thiscssleft == 'auto') thiscssleft = 0; // For IE

                                posTopArray[i] = parseInt(thiscsstop);
                                posLeftArray[i] = parseInt(thiscssleft);
                            });
                        }

                        begintop = $(this).offset().top; // Dragged element top position
                        beginleft = $(this).offset().left; // Dragged element left position
                        //end
                    },
                    drag: function (event, ui) {
                        //20140212
                        var topdiff = $(this).offset().top - begintop;  // Current distance dragged element has traveled vertically
                        var leftdiff = $(this).offset().left - beginleft; // Current distance dragged element has traveled horizontally

                        if ($(this).hasClass("grouped")) {
                            $(".grouped").each(function (i) {
                                var top = $(this).position().top + ui.position.top - ui.originalPosition.top;
                                var left = $(this).position().left + ui.position.left - ui.originalPosition.left;
                                if (ui.position.top < 0 || left < 0 || (top + $(this).height() > $("#BottomRightCenterContentDiv").height()) ||
                                (left + $(this).width() > $("#BottomRightCenterContentDiv").width())) {
                                    return;
                                }
                                else {
                                    $(this).css('top', posTopArray[i] + topdiff); // Move element veritically - current css top + distance dragged element has travelled vertically
                                    $(this).css('left', posLeftArray[i] + leftdiff); // Move element horizontally - current css left + distance dragged element has travelled horizontally
                                }
                            });
                        }
                        //end

//////                        var dragControls = Agi.Edit.workspace.currentControls;
//////                        /*边界判断*/
//////                        for (var i = 0; i < dragControls.length; i++) {
//////                            var dragControl = dragControls[i];
//////                            var id = $(dragControl.Get("HTMLElement")).attr("id");
//////                            //
//////                            var top = $("#" + id).position().top + ui.position.top - ui.originalPosition.top;
//////                            var left = $("#" + id).position().left + ui.position.left - ui.originalPosition.left;
//////                            if (ui.position.top < 0 ||
//////                                left < 0 ||
//////                                (top + $("#" + id).height() > $("#BottomRightCenterContentDiv").height()) ||
//////                                (left + $("#" + id).width() > $("#BottomRightCenterContentDiv").width())) {
//////                                return;
//////                            }
//////                        }
//////                        for (var i = 0; i < dragControls.length; i++) {
//////                            var dragControl = dragControls[i];
//////                            var id = $(dragControl.Get("HTMLElement")).attr("id");
//////                            //
//////                            var top = $("#" + id).position().top + ui.position.top - ui.originalPosition.top;
//////                            var left = $("#" + id).position().left + ui.position.left - ui.originalPosition.left;
//////                            //
////////                            $("#" + id).css({ top:top, left:left });这句代码会导致窗口控件拖动异常
//////                            /*刷新属性*/
//////                            //dragControl.PostionChange(null);
//////                            //
//////                            /*console.log("control.position.top-" +  $("#" + id).position().top);
//////                             console.log("control.position.left-" + $("#" + id).position().left);
//////                             console.log("ui.position.top-" + ui.position.top);
//////                             console.log("ui.position.left-" + ui.position.left);
//////                             console.log("ui.originalPosition.top-" + ui.originalPosition.top);
//////                             console.log("ui.originalPosition.top-" + ui.originalPosition.left);*/
//////                        }
//////                        /*记录前一个位置*/
//////                        ui.originalPosition.top = ui.position.top;
//////                        ui.originalPosition.left = ui.position.left;
                    },
                    stop:function (event, ui) {
                        //Agi.Edit.workspace.currentControls[Agi.Edit.workspace.currentControls.length - 1].PostionChange(null);
                        var len = Agi.Edit.workspace.currentControls.length;
                        for (var i = 0; i < len; i++) {
                            var control = Agi.Edit.workspace.currentControls[i];
                            control.PostionChange(null);
                        }
                        if (Agi.Edit.workspace.currentControls[Agi.Edit.workspace.currentControls.length - 1] === undefined) {
                            return;
                        }
                        Agi.Controls.BasicPropertyPanel.Show(Agi.Edit.workspace.currentControls[Agi.Edit.workspace.currentControls.length - 1].Get("ProPerty").ID);
                        if(Agi.Edit.workspace.controlList.array.length>1){
                            Agi.Edit.workspace.updateControlRelation( Agi.Edit.workspace.currentControls);
                        }
                        //显示默认属性面板，并选中当前新增的控件
                        //region ly,undoHtml
                        //newValue = $(workspace.editDiv).html();
                        /*stack.execute(new EditCommand(function () {
                         $(Agi.Edit.workspace.controlList.array).each(function (i, con) {
                         if (con.ReBindEvents) {
                         con.ReBindEvents().ResetProperty();
                         }
                         });
                         }, function () {
                         $(Agi.Edit.workspace.controlList.array).each(function (i, con) {
                         if (con.ReBindEvents) {
                         con.ReBindEvents().ResetProperty();
                         }
                         });
                         }, oldValue, newValue));*/
                        
                        /**[SGAI MARKER][20140303]START*/
                        associateControlWithQueryArea(Agi.Edit.workspace.currentControls,false);
                        /**[SGAI MARKER][20140303]END*/
                        //end drag
                    }
                })
                .resizable({
                    //containment:"#BottomRightCenterContentDiv",
                    start:function (event, ui) {
                        //region ly,undoHtml
                        oldValue = $(workspace.editDiv).html();
                        //endregion
                    },
                    stop:function (event, ui) {
                        //20130106 11:13 markeluo 更改控件大小时，多传一个IsResizable(bool 类型)参数用于和移动控件位置进行区分
                        Agi.Edit.workspace.currentControls[Agi.Edit.workspace.currentControls.length - 1].PostionChange(null, true);
                        Agi.Controls.BasicPropertyPanel.Show(Agi.Edit.workspace.currentControls[Agi.Edit.workspace.currentControls.length - 1].Get("ProPerty").ID);
                        //显示默认属性面板，并选中当前新增的控件
                        //alert('resize-ok');
                        //region ly,undoHtml
                        //newValue = $(workspace.editDiv).html();
                        /*stack.execute(new EditCommand(function () {
                         $(Agi.Edit.workspace.controlList.array).each(function (i, con) {
                         if (con.ReBindEvents) {
                         con.ReBindEvents().ResetProperty();
                         }
                         });
                         }, function () {
                         $(Agi.Edit.workspace.controlList.array).each(function (i, con) {
                         if (con.ReBindEvents) {
                         con.ReBindEvents().ResetProperty();
                         }
                         });
                         }, oldValue, newValue
                         ));*/
                        //endregion
                        
                        /**[SGAI MARKER][20140303]START*/
                        associateControlWithQueryArea(Agi.Edit.workspace.currentControls,false);
                        /**[SGAI MARKER][20140303]END*/
                    },
                    resize:function (event, ui) {
                        //$(window).resize();//这段代码会导致实时chart在缩放后报一个错误
                    }
                })
                .css('position', 'absolute');
            //暂时解决DataGrid拖动后宽度异常
            //$('#BottomRightCenterContentDiv .wijmo-wijgrid table').css('width', '100%');
            var ThisControl = Agi.Controls.FindControl(this.id);
            if (ThisControl == null) {
                ThisControl = Agi.Controls.FindControl(this.id.replace("Panel_", ""))
            }
            if (ThisControl.isLock) {
                $(this).draggable("disable")
                    .resizable("disable");
            }
            var title = $(this).find('.selectPanelheadSty');
            title.removeClass('hide');
        }).live('mouseleave',function(){
                var title = $(this).find('.selectPanelheadSty');
                title.addClass('hide');
            });
        /*  panelControls.live("", function () {*/
        //ly，右键菜单
        $(".PanelSty").jeegoocontext('menu', {
            livequery:true,
            widthOverflowOffset:0,
            heightOverflowOffset:3,
            submenuLeftOffset:-4,
            submenuTopOffset:-5
        });
        /* });*/
    }
//updateDataSourceDragDrop();
//menuManagement.updateDataSourceDragDropTargets();
//endregion
});

Agi.Edit.todo.DoCheckText = function (text) {
    var reg = RegExp("[\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\<,\\>,\"]");
    if (reg.test(text)) {
        //alert("文件夹名稱不能包含下列字符之一:\n \\ / : * ? \" < > | & , ");
        return true;
    }
}
