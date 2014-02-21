﻿/*异步加载必须JS*/
agi.jsloader
    .script("JS/edit/edit.core.js")
    .wait(function () {
        //$("head").append('<meta http-equiv="X-UA-Compatible" content="chrome=1">');
    })
    .script("JS/edit/edit.workspace.js")
    .script("JS/edit/edit.function.js")
    .script("JS/edit/edit.todo.js")
    .wait(function () {
        $(function () {
            /*初始化工作区（画布）*/
            /*已过时*/
            //Agi.Edit.Init($("#BottomRightCenterContentDiv"));
            /*加载控件列表*/
            Agi.Edit.getControlList();
            /*事件*/
            $("#new").click(
                function () {
                    Agi.Edit.NewPage();
                    //HideAllSamllWin();
                }
            );
            /*版本管理*/
            var TextpageName; //文本框显示的页面名称
            $("#save").click(
                function () {
                    // Agi.Edit.SavePage();

                    var Versioninfomodal = document.getElementById("ShowVersioninfomodal");
                    $("#isCoverVersion").removeClass("isCoverVersionBlock");
                    $("#isCoverVersion").addClass("isCoverVersionNone");
                    // $("#InputPageName").val(workspace.pageName);//获得页面名称
                    if (isEdite) {
                        $("#VersionSelect").empty(); //$("#sel").empty()
                        $("#isCoverVersion").removeClass("isCoverVersionNone");
                        $("#isCoverVersion").addClass("isCoverVersionBlock");
                        $("#VersionSelect").append("<option value=''>创建新版本</option>");
                        $("#VersionSelect").append("<option value='saveas'>页面另存为...</option>");
                        if (workspace.pageName.lastIndexOf("/") != -1) {

                            selectLak(workspace.pageName.substring(0, workspace.pageName.lastIndexOf("/"))); //文件夹的名字
                            //selectLak(workspace.pageName); //文件夹的名字
                            //markeluo 兼容JAVA版本存储管理
                            var Pagename=workspace.pageName.substring(0, workspace.pageName.lastIndexOf("/"));
                            if(Agi.WebServiceConfig.Type!=".NET"){
                                Pagename=Pagename.substring(0,Pagename.lastIndexOf("_"));
                            }

                            $("#InputPageName").val(Pagename); //获得文件夹名称
                        } else {
                            selectLak(workspace.pageName);
                            //markeluo 兼容JAVA版本存储管理
                            var Pagename=workspace.pageName;
                            if(Agi.WebServiceConfig.Type!=".NET"){
                                // Pagename=Pagename.substring(0,Pagename.lastIndexOf("_"));

                                //20130722 10:19 markeluo 解决页面新建版本后再保存无法获取版本列表问题
                                var NameLastindex=Pagename.lastIndexOf("_");
                                if(NameLastindex>=0){
                                    Pagename=Pagename.substring(0,NameLastindex);
                                }
                                NameLastindex=null;
                            }
                            $("#InputPageName").val(Pagename);
                        }
                        //20130531 倪飘 解决bug，新建页面进行保存操作，再次点击保存，此时保存框中页面名称为可编辑状态
                        $("#InputPageName").attr('readonly', true);
                    }
                    else {
                        $("#InputPageName").attr('readonly', false);
                    }

//                    if ($("#ShowVersioninfomodal").is(":visible") == false) {
//                        $('#ShowVersioninfomodal').draggable({
//                            handle:".modal-header"
//                        });
//                        //20130126 倪飘 调整弹出框口的层级关系
//                        $('#ShowVersioninfomodal').css('zIndex', 9999);
//                        $("#ShowVersioninfomodal").modal({ backdrop:false, keyboard:false, show:true });
//                        // $('#ShowVersioninfomodal').show();
//                        Agi.Controls.BasicPropertyPanel.Show("ShowVersioninfomodal");
//                        Versioninfomodal.style.display = "block";
//                    }
                    if(!dialogs._save.dialog('isOpen')){
                        dialogs._save.dialog('open');
                    }
                }
            );
            $("#SelectVersionBtn").live('click', function () {  //点击确定
                if ($("#InputPageName").val().trim() == "") {
                    AgiCommonDialogBox.Alert("页面名称不能为空!", null);
                    return;
                }
                //$('#ShowVersioninfomodal').hide();
                dialogs._save.dialog('close');
                Agi.Edit.SavePage();
            });
            $("#CancelVersionBtn").live('click', function () {//点击取消
//                $('#ShowVersioninfomodal').hide();
//                return;
                dialogs._save.dialog('close');
            });
            /*  $("#save").live('click',function(){  //点击保存
             $('#ShowVersioninfomodal').draggable({
             handle: ".modal-header"
             });
             $("#ShowVersioninfomodal").modal({ backdrop: false, keyboard: false, show: true });
             });*/
            $("#preview").click(
                function () {
                    Agi.Edit.ViewPage();
                }
            );
            $("#delete").click(
                function () {
                    Agi.Edit.DeleteControls();
                }
            );
            $("#duplicate").click(
                function () {
                    Agi.Edit.CopyControls();
                }
            );
            $("#paste").click(
                function () {
                    Agi.Edit.PastContols();
                }
            );
            $("#liLeft").click(
                function () {
                    Agi.Edit.doControlsAlignmentLeft();
                }
            );
            $("#liLeftRight").click(
                function () {
                    Agi.Edit.doControlsAlignmentLeftRight();
                }
            );
            $("#liRight").click(
                function () {
                    Agi.Edit.doControlsAlignmentRight();
                }
            );
            $("#liTop").click(
                function () {
                    Agi.Edit.doControlsAlignmentTop();
                }
            );
            $("#liTopBottom").click(
                function () {
                    Agi.Edit.doControlsAlignmentTopBottom();
                }
            );
            $("#liBottom").click(
                function () {
                    Agi.Edit.doControlsAlignmentBottom();
                }
            );
            $("#liH").click(
                function () {
                    Agi.Edit.doControlsAlignmentHList();
                }
            );
            $("#liV").click(
                function () {
                    Agi.Edit.doControlsAlignmentVList();
                }
            );
            $("#undo").click(
                function () {
                    Agi.Edit.unDo();
                }
            );
            $("#redo").click(
                function () {
                    Agi.Edit.reDo();
                }
            );
            $("#fitWindow").click(
                function () {
                    //alert(this.checked);
                    edit.workspace.autoSize = this.selected;
                }
            );
            /*键盘事件*/
            $("body").keydown(
                function () {
//                    if ($("#Agi-Script-Editor").get(0).style.display != "none") {
//                        return;
//                    }
                    //20130115 15:46 markeluo 当进入控件属性编辑界面时，禁用快捷键
                    if (Agi.Controls.IsControlEdit) {
                        return;
                    }
                    /*全局快捷键*/
                    //Ctrl+N
                    if (event.ctrlKey == true && event.keyCode == 79) {
                        event.returnvalue = false;
                        Agi.Edit.NewPage();
                    }
                    /*编辑器快捷键*/
                    if ($("#BottomRightCenterDiv").css("display") === "none") {
                        return;
                    }
                    //Del
                    if (event.keyCode == 46) {
                        if($("#Agi-Common-DialogBox-Confirm").length){//如果弹出了删除警告框,不再弹出
                            return;
                        }
                        event.returnvalue = false;
                        //Agi.Edit.DeleteControls();
                    }
                    //Ctrl+Q
                    else if (event.ctrlKey == true && event.keyCode == 81) {
                        event.returnvalue = false;
                        Agi.Edit.ViewPage();
                    }
                    //Ctrl+S
                    else if (event.ctrlKey == true && event.keyCode == 83) {
                        event.returnvalue = false;

                        // Agi.Edit.SavePage();

                        var Versioninfomodal = document.getElementById("ShowVersioninfomodal");
                        $("#isCoverVersion").removeClass("isCoverVersionBlock");
                        $("#isCoverVersion").addClass("isCoverVersionNone");
                        // $("#InputPageName").val(workspace.pageName);//获得页面名称
                        if (isEdite) {
                            $("#VersionSelect").empty(); //$("#sel").empty()
                            $("#isCoverVersion").removeClass("isCoverVersionNone");
                            $("#isCoverVersion").addClass("isCoverVersionBlock");
                            $("#VersionSelect").append("<option value=''>创建新版本</option>");
                            $("#VersionSelect").append("<option value='saveas'>页面另存为...</option>");
                            if (workspace.pageName.lastIndexOf("/") != -1) {
                                selectLak(workspace.pageName.substring(0, workspace.pageName.lastIndexOf("/"))); //文件夹的名字

                                //markeluo 兼容JAVA版本存储管理
                                var Pagename=workspace.pageName.substring(0, workspace.pageName.lastIndexOf("/"));
                                if(Agi.WebServiceConfig.Type!=".NET"){
                                    Pagename=Pagename.substring(0,Pagename.lastIndexOf("_"));
                                }
                                $("#InputPageName").val(Pagename); //获得文件夹名称
                                $("#InputPageName").attr('readonly', true);
                            } else {
                                selectLak(workspace.pageName);
                                //markeluo 兼容JAVA版本存储管理
                                var Pagename=workspace.pageName;
                                if(Agi.WebServiceConfig.Type!=".NET"){
                                    Pagename=Pagename.substring(0,Pagename.lastIndexOf("_"));
                                }
                                $("#InputPageName").val(Pagename);
                            }
                        }
                        else {
                            $("#InputPageName").attr('readonly', false);
                        }

//                        if ($("#ShowVersioninfomodal").is(":visible") == false) {
//                            $('#ShowVersioninfomodal').draggable({
//                                handle:".modal-header"
//                            });
//                            $("#ShowVersioninfomodal").modal({ backdrop:false, keyboard:false, show:true });
//                            // $('#ShowVersioninfomodal').show();
//                            Agi.Controls.BasicPropertyPanel.Show("ShowVersioninfomodal");
//                            Versioninfomodal.style.display = "block";
//                        }
                        if(!dialogs._save.dialog('isOpen')){
                            dialogs._save.dialog('open');
                        }
                    }
                    //Ctrl+Z
                    else if (event.ctrlKey == true && event.keyCode == 90) {
                        event.returnvalue = false;
                        //Agi.Edit.unDo();
                    }
                    //Ctrl+Y
                    else if (event.ctrlKey == true && event.keyCode == 89) {
                        event.returnvalue = false;
                        //Agi.Edit.reDo();
                    }
                    //Ctrl+C
                    else if (event.ctrlKey == true && event.keyCode == 67) {
                        event.returnvalue = false;
                        //Agi.Edit.CopyControls();
                    }
                    //Ctrl+V
                    else if (event.ctrlKey == true && event.keyCode == 86) {
                        event.returnvalue = false;
                        //Agi.Edit.PastContols();
                    }
                    //20130228  倪飘 解决武汉bug所有控件，属性编辑页面，鼠标能输入的位置，按键盘上下左右键，
                    //属性编辑界面中控件位置都会跟着改变，但是右下角控件属性中值未改变问题（编号：ZHZS-289）
                    //左37
//                    else if (event.keyCode == 37) {
//                        for (var i = 0; i < workspace.currentControls.length; i++) {
//                            var item = workspace.currentControls[i];
//                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//                            if (event.ctrlKey == false) {
//                                html.css("left", parseInt(html.css("left")) - 4);
//                            }
//                            else {
//                                html.css("left", parseInt(html.css("left")) - 1);
//                            }
//                        }
//                    }
//                    //上38
//                    else if (event.keyCode == 38) {
//                        for (var i = 0; i < workspace.currentControls.length; i++) {
//                            var item = workspace.currentControls[i];
//                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//                            if (event.ctrlKey == false) {
//                                html.css("top", parseInt(html.css("top")) - 4);
//                            }
//                            else {
//                                html.css("top", parseInt(html.css("top")) - 1);
//                            }
//                        }
//                    }
//                    //右39
//                    else if (event.keyCode == 39) {
//                        for (var i = 0; i < workspace.currentControls.length; i++) {
//                            var item = workspace.currentControls[i];
//                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//                            if (event.ctrlKey == false) {
//                                html.css("left", parseInt(html.css("left")) + 4);
//                            }
//                            else {
//                                html.css("left", parseInt(html.css("left")) + 1);
//                            }
//                        }
//                    }
//                    //下40
//                    else if (event.keyCode == 40) {
//                        for (var i = 0; i < workspace.currentControls.length; i++) {
//                            var item = workspace.currentControls[i];
//                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
//                            if (event.ctrlKey == false) {
//                                html.css("top", parseInt(html.css("top")) + 4);
//                            }
//                            else {
//                                html.css("top", parseInt(html.css("top")) + 1);
//                            }
//                        }
                    //                    }
                    //20140217 范金鹏 使用键盘上的方向键控制控件在组态环境中的上下左右移动
                    //按左键将控件向左边移动
                    else if (event.keyCode == 37) {
                        for (var i = 0; i < workspace.currentControls.length; i++) {
                            var item = workspace.currentControls[i];
                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
                            if ((parseInt(html.css("left")) - 2) < 0) {
                                return;
                            }
                            else {
                                html.css("left", parseInt(html.css("left")) - 2);
                            }
                            item.PostionChange(null);

                            Agi.Controls.BasicPropertyPanel.Show(item.Get("ProPerty").ID);
                        }
                        if (Agi.Edit.workspace.controlList.array.length > 1) {
                            Agi.Edit.workspace.updateControlRelation(Agi.Edit.workspace.currentControls);
                        }
                    }

                    //按右键将控件向右边移动
                    else if (event.keyCode == 39) {
                        for (var i = 0; i < workspace.currentControls.length; i++) {
                            var item = workspace.currentControls[i];
                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
                            if ((parseInt(html.css("left")) + 2 + html.width()) > $("#BottomRightCenterContentDiv").width()) {
                                return;
                            }
                            else {
                                html.css("left", parseInt(html.css("left")) + 2);
                            }

                            item.PostionChange(null);

                            Agi.Controls.BasicPropertyPanel.Show(item.Get("ProPerty").ID);
                        }
                        if (Agi.Edit.workspace.controlList.array.length > 1) {
                            Agi.Edit.workspace.updateControlRelation(Agi.Edit.workspace.currentControls);
                        }
                    }

                    //按上键将控件向上方移动
                    else if (event.keyCode == 38) {
                        for (var i = 0; i < workspace.currentControls.length; i++) {
                            var item = workspace.currentControls[i];
                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
                            if ((parseInt(html.css("top")) - 2) < 0) {
                                return;
                            }
                            else {
                                html.css("top", parseInt(html.css("top")) - 2);
                            }
                            item.PostionChange(null);

                            Agi.Controls.BasicPropertyPanel.Show(item.Get("ProPerty").ID);
                        }
                        if (Agi.Edit.workspace.controlList.array.length > 1) {
                            Agi.Edit.workspace.updateControlRelation(Agi.Edit.workspace.currentControls);
                        }
                    }

                    //按下方向键将控件向下方移动
                    else if (event.keyCode == 40) {
                        for (var i = 0; i < workspace.currentControls.length; i++) {
                            var item = workspace.currentControls[i];
                            var html = $("#" + $(item.Get("HTMLElement")).attr("id"));
                            if ((parseInt(html.css("top")) + 2 + html.height()) > $("#BottomRightCenterContentDiv").height()) {
                                return;
                            }
                            else {
                                html.css("top", parseInt(html.css("top")) + 2);
                            }
                            item.PostionChange(null);

                            Agi.Controls.BasicPropertyPanel.Show(item.Get("ProPerty").ID);
                        }
                        if (Agi.Edit.workspace.controlList.array.length > 1) {
                            Agi.Edit.workspace.updateControlRelation(Agi.Edit.workspace.currentControls);
                        }
                    }
                    //end
                    else {
                        //alert(event.keyCode);
                    }
                }
            );
        });
    }
);
//