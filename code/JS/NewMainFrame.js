/// <reference path="AddNewFunc.js" />
/// <reference path="jquery-1.7.2.min.js" />

var ContentWidth;
var ContentHeight;

//gyh
var layoutManagement = null;//布局管理对象
var dragControlItems = [];//编辑界面左侧可拖动的控件
var dragDataSourceItems = [];//编辑界面左侧可拖动的数据实体
var dragRealTimePointItems = [];//编辑界面左侧可拖动的实时点位
var dragControlStyle = [];//编辑界面左侧可拖动的控件样式
var menuManagement = null;//编辑界面左侧菜单管理

//页面参数弹出层
$("#URLP").live('click', function () {
    $("#SettingModal").modal('hide')
    Agi.Msg.UrlManageInfo.Show();
});


$(document).ready(function () {
    //设置,更新资源上传的地址
    Agi.ImgUploadPath="SourceManager";//资源上传相对文件夹
    if(Agi.WebServiceConfig.Type==".NET"){
        Agi.ImgUploadServiceAddress = Agi.ImgServiceAddress + '/Upload.ashx';//资源图片上传服务地址
    }
    //end 设置,更新资源上传的地址
//    Agi.DAL.ReadData({
//        "MethodName": "VerifyLicense",
//        "Paras": "",
//        "CallBackFunction": function (lic) {
//            switch(lic.Release){
//                case '1':
//                    break;
//                case '0':
//                    if(lic.RemindDays <=0){
//                        AgiCommonDialogBox.CallBakAlert("已经超过试用期限,请注册后使用!",'title',function(){
//                            location.href = "about:blank";
//                        },true);
//                    }else{
//                        AgiCommonDialogBox.CallBakAlert('剩余试用天数:'+ lic.RemindDays,'提示',function(){
//                        },true);
//                    }
//                break;
//                case '-1':
//                    AgiCommonDialogBox.CallBakAlert("注册信息异常!",'提示',function(){
//                        location.href = "about:blank";
//                    },true);
//                    break;
//                case '-2':
//                    AgiCommonDialogBox.CallBakAlert("请注册后使用!",'提示',function(){
//                        location.href = "about:blank";
//                    },true);
//                    break;
//            }
//        }
//    });
    DistinguishExplorer();
    //去掉右键
    $(this).bind("contextmenu", function (e) {
        //return false;
    });
    //打开进度条
    $('#progressbar1').show().find('.close').click(function (e) {
        $('#progressbar1').hide().html('<div class="progressBar">' +
            '<button style="position: absolute;left: 186px;top: -4px;" type="button" class="close" data-dismiss="alert">×</button>' +
            '<div class="progress progress-striped active borderFlash">' +
            '<div class="bar" style="width: 100%;"></div>' +
            '</div>' +
            '<span>正在载入...</span>' +
            '</div>');
    });

    ShowMainFramePage();
    GetDCMangeList(true);
    OperationLeftMenu();
    //默认选中100%大小
    $('[name="SelectAspectRatio"]:radio').each(function () {
        if (this.value == '100%') {
            this.checked = true;
        }
    });

    //获取url参数
    //alert(Agi.Msg.UrlManageInfo.getParameter("id"));

    //新建页面
    $("#dashboard").click(function () {
        if (boolIsSave == false) {
            AgiCommonDialogBox.Confirm("确认离开编辑页面？", null, function (flag1) {
                if (flag1) {
                    boolIsSave = true;
                    AgiCommonDialogBox.Confirm("是否新建页面？", null, function (flag2) {
                        if (flag2) {
                            IsNewSPCPage=false;
                            boolIsSave = false;
                            ShowNewMainPage();
                        }
                    });
                    //无论用户做什么与DataSet无关的操作，只要弹出框还显示就隐藏...

                    //        if ($("#PopupSelectDataSource").is(":visible")) {
                    //            $("#PopupSelectDataSource").modal('hide');
                    //        }
                    //        if ($("#PopupSelectVTable").is(":visible")) {
                    //            $("#PopupSelectVTable").modal('hide');
                    //        }
                }
            });

        } else {

            AgiCommonDialogBox.Confirm("是否新建页面？", null, function (flag) {
                if (flag) {
                    boolIsSave =false;
                    IsNewSPCPage=false;
                    ShowNewMainPage();
                }else{
                    boolIsSave = true;
                }
            });

            //无论用户做什么与DataSet无关的操作，只要弹出框还显示就隐藏...

            //            if ($("#PopupSelectDataSource").is(":visible")) {
            //                $("#PopupSelectDataSource").modal('hide');
            //            }
            //            if ($("#PopupSelectVTable").is(":visible")) {
            //                $("#PopupSelectVTable").modal('hide');
            //            }
        }
    });
    $("#dashboardspc").click(function () {
        if (boolIsSave == false) {
            AgiCommonDialogBox.Confirm("确认离开编辑页面？", null, function (flag1) {
                if (flag1) {
                    boolIsSave = true;
                    AgiCommonDialogBox.Confirm("是否新建页面？", null, function (flag2) {
                        if (flag2) {
                            IsNewSPCPage=true;
                            boolIsSave = false;
                            ShowNewMainPage();
                        }
                    });
                }
            });
        } else {
            AgiCommonDialogBox.Confirm("是否新建页面？", null, function (flag) {
                if (flag) {
                    boolIsSave =false;
                    IsNewSPCPage=true;
                    ShowNewMainPage();
                }else{
                    boolIsSave = true;
                }
            });
        }
    });

    $("#MainPageDiv").live('click', function () {
        boolIsSave = false;
        IsNewSPCPage=false;//20130916 14:20 SPC 页面支持
        ShowNewMainPage();
    });

    //region 20130916 14:20 SPC 页面支持
    $("#MainSPCPageDiv").live('click', function () {
        boolIsSave = false;
        IsNewSPCPage=true;
        ShowNewMainPage();
    });
    //endregion
    $("#BottomLeftBottomDiv").click(function () {
        if (boolIsSave == false) {

            AgiCommonDialogBox.Confirm("确认离开编辑页面？", null, function (flag) {

                if (flag) {
                    boolIsSave = true;
                    ShowMainFramePage();
                    edit.ChangeEdit();//有编辑页面点击首页时，isEdite = false;
                    $("#BottomRightCenterContentDiv").css("background-image", "");//由编辑页面点击首页时将背景图片清空，还原网格
                    $("#BottomRightCenterContentDiv").css("background-position", "");
                    $("#BottomRightCenterContentDiv").css("background-repeat", "");
                    $("#BottomRightCenterContentDiv").css("background-size", "");
                    //无论用户做什么与DataSet无关的操作，只要弹出框还显示就隐藏...

//                    if ($("#PopupSelectDataSource").is(":visible")) {
//                        $("#PopupSelectDataSource").modal('hide');
//                    }
                    dialogs._PopupSelectDataSource.dialog('close');
//                    if ($("#PopupSelectVTable").is(":visible")) {
//                        $("#PopupSelectVTable").modal('hide');
//                    }
                    dialogs._PopupSelectVTable.dialog('close');
                    HideAllSamllWin();
                    HideAllMainPageWin();
                    //清空共享数据源相关内容
                    ShareDataOperation.LeaveClear();
                    //清除共享数据源过滤相关内容
                    ShareDataFilter.LeaveClear();
                    //显示头图标
                    //20130114 倪飘 解决在控件属性编辑页面直接返回主页面，再次进入组态环境页面，上方按钮未显示，拖出控件不能进行属性设置问题
                    Agi.Controls.EditChangedMenuManager(true);
                    Agi.Controls.IsControlEdit = false;

                }
            });
        } 
        else {
            ShowMainFramePage();
            edit.ChangeEdit();//有编辑页面点击首页时，isEdite = false;
            $("#BottomRightCenterContentDiv").css("background-image", "");//由编辑页面点击首页时将背景图片清空，还原网格
            $("#BottomRightCenterContentDiv").css("background-position", "");
            $("#BottomRightCenterContentDiv").css("background-repeat", "");
            $("#BottomRightCenterContentDiv").css("background-size", "");
            //无论用户做什么与DataSet无关的操作，只要弹出框还显示就隐藏...

//            if ($("#PopupSelectDataSource").is(":visible")) {
//                $("#PopupSelectDataSource").modal('hide');
//            }
            dialogs._PopupSelectDataSource.dialog('close');
//            if ($("#PopupSelectVTable").is(":visible")) {
//                $("#PopupSelectVTable").modal('hide');
//            }
            dialogs._PopupSelectVTable.dialog('close');
            HideAllSamllWin();
            HideAllMainPageWin();
            //清空共享数据源相关内容
            ShareDataOperation.LeaveClear();
             //显示头图标
             //20130114 倪飘 解决在控件属性编辑页面直接返回主页面，再次进入组态环境页面，上方按钮未显示，拖出控件不能进行属性设置问题
           Agi.Controls.EditChangedMenuManager(true);
           Agi.Controls.IsControlEdit = false;

        }

    });

    $("#home2").click(function () {
        ShowMainFramePage();
    });

    $("#parameter").click(function () {
        $("#PageParam").modal('hide');
        new Agi.Msg.OpenParasSettingWindow().Show();

    });
    //隐藏所有打开的小窗口
    function HideAllSamllWin() {
        workspace.Restore();
        Agi.Controls.BasicPropertyPanel.ALLControlsClear();
        Agi.Msg.PageOutPramats.Clear();  //清除控件参数集合
        Agi.Msg.ParaBindManage.Clear();//清除管理绑定集合
        $("#SelectAspectRatioDiv").hide();
        $("#ChangePageSizeDiv").hide();
        $("#ChangeBackGroundDiv").hide();
        $("#ChangeGridlinesDiv").hide();
        $("#BasicPropertyPanel").hide();
        $("#powerId").hide();
        $("#SettingModal").modal('hide');
        $("#ShareDataOperationPanel").modal('hide');
        $(".ui-dialog").hide();
        $("#SettingModal").modal('hide');
        $("#PageParam").modal('hide');
        $("#ShowBgImage").modal('hide');
        $("#RealTimeLableParam").modal('hide');
        $("#ShowVersioninfomodal").modal('hide');
    }



    //布局管理相关代码
    layoutManagement = new Agi.LayoutMangement.layoutDesigner({
        panelID: "dialog1",
        designer: "fDesigner1",
        addRowBottom: "btnAddRow1",
        canvasID: "BottomRightCenterContentDiv",
        layoutChangeCallBack: function () {
            var lm = this;
            $(dragControlItems).each(function (i, item) {
                item.dropTargets = lm.getCells();
            })
        }
    });
    var btns = $('#layoutSwitch');
    btns.find('button').bind('click', function (e) {
        $(this).parent().find('button').attr('class', 'layoutUnactived');
        var type = $(this).attr('class', 'layoutActived').attr('name').trim();
        var isSwitch = layoutManagement.switch(type);
        if (isSwitch) {
            if (type == '2') {
                $(dragControlItems).each(function (i, item) {
                    item.dropTargets = layoutManagement.getCells();
                })
            } else {
                $(dragControlItems).each(function (i, item) {
                    item.dropTargets = $("#BottomRightCenterContentDiv");
                })
            }
        }
    });
    //布局管理相关代码 end

    //事件绑定
    // {
    //1 单选框点击时改变面板大小
    //$('[name="SelectAspectRatio"]:radio').bind('change', function () {
    $('[name="SelectAspectRatio"]').click(function () {
        //var Aspect = $('[name="SelectAspectRatio"][checked=true]:radio').val();
        //var Aspect = $('[name="SelectAspectRatio"]:radio:checked').val();
        var Aspect = $(this).val();
        var Frame = $("#BottomRightCenterContentDiv");
        switch (Aspect) {
            case "400%":
                Frame.css("width", ContentWidth * 4 + "px");
                Frame.css("height", ContentHeight * 4 + "px");
                PropertyPanelFloatAsPercent(Aspect);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "200%":
                Frame.css("width", ContentWidth * 2 + "px");
                Frame.css("height", ContentHeight * 2 + "px");
                PropertyPanelFloatAsPercent(Aspect);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "100%":
                Frame.css("width", ContentWidth + "px");
                Frame.css("height", ContentHeight + "px");
                PropertyPanelFloatAsPercent(Aspect);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "75%":
                Frame.css("width", ContentWidth * 0.75 + "px");
                Frame.css("height", ContentHeight * 0.75 + "px");
                PropertyPanelFloatAsPercent(Aspect);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "50%":
                Frame.css("width", ContentWidth * 0.5 + "px");
                Frame.css("height", ContentHeight * 0.5 + "px");
                PropertyPanelFloatAsPercent(Aspect);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "25%":
                Frame.css("width", ContentWidth * 0.25 + "px");
                Frame.css("height", ContentHeight * 0.25 + "px");
                PropertyPanelFloatAsPercent(Aspect);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
        }
        //region 控件自适应大小
        for (var i = 0; i < workspace.controlList.size() ; i++) {
            var item = workspace.controlList.get(i);
            item.HTMLElementSizeChanged();
        }
        //endregion

        if (layoutManagement.property.type == 2) {
            layoutManagement.updateCellHeight();
        }
        layoutManagement.property.showScale = Aspect.trim();

        $("#Proportion").text(Aspect);
        $("#SelectAspectRatioDiv").hide();
    });

    //2.1 选择页面分辨率大小的弹出框
    $("#PageSizeText").bind('click', function () {
        var Pag = document.getElementById("PageSizeDiv");
        var PagShow = document.getElementById("ChangePageSizeDiv");
        PagShow.style.top = Pag.offsetTop - $("#ChangePageSizeDiv").height() - 20 + "px";
        PagShow.style.left = Pag.offsetLeft + 20 + "px";
        if ($("#ChangePageSizeDiv").is(":visible") == false) {
            Agi.Controls.BasicPropertyPanel.Show("ChangePageSizeDiv");
            PagShow.style.display = "block";
            var zindex = menuManagement.getControlMaxzIndex($("#BottomRightCenterContentDiv"));
         $("#ChangePageSizeDiv").css('z-index',zindex.max+100);
        }
        else {
            PagShow.style.display = "none";
        }

        /*释放临时变量*/
        Pag=PagShow=null;
    });

    //2.2选择页面分辨率大小的下拉菜单事件
    $("#SelectPageSize").live('change', function () {
        var Num = $(this).val();
        $('#PageSizeText').text(Num);
        $("#ChangePageSizeDiv").hide();

        var Frame = $("#BottomRightCenterContentDiv");
        edit.workspace.autoSize = false;
        switch (Num) {
            // case "800 * 600":
            //                    Frame.css("width", "800px");
            //                    Frame.css("height", "600px");
            //                    ContentWidth = 800;
            //                    ContentHeight = 600;
            //                    PropertyPanelFloat(ContentWidth);
            //                    ChangeBottomRightCenterContent(Frame.width(), Frame.height());
            //                break;
            case "1024 * 768":
                Frame.css("width", "1024px");
                Frame.css("height", "768px");
                ContentWidth = 1024;
                ContentHeight = 768;
                PropertyPanelFloat(ContentWidth);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "1280 * 600":
                Frame.css("width", "1280px");
                Frame.css("height", "600px");
                ContentWidth = 1280;
                ContentHeight = 600;
                PropertyPanelFloat(ContentWidth);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "1280 * 720":
                Frame.css("width", "1280px");
                Frame.css("height", "720px");
                ContentWidth = 1280;
                ContentHeight = 720;
                PropertyPanelFloat(ContentWidth);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "1280 * 768":
                Frame.css("width", "1280px");
                Frame.css("height", "768px");
                ContentWidth = 1280;
                ContentHeight = 768;
                PropertyPanelFloat(ContentWidth);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "1280 * 800":
                Frame.css("width", "1280");
                Frame.css("height", "800");
                ContentWidth = 1280;
                ContentHeight = 800;
                PropertyPanelFloat(ContentWidth);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "1366 * 768":
                Frame.css("width", "1366");
                Frame.css("height", "768");
                ContentWidth = 1366;
                ContentHeight = 768;
                PropertyPanelFloat(ContentWidth);
                ChangeBottomRightCenterContent(Frame.width(), Frame.height());
                break;
            case "自适应":
                edit.workspace.autoSize = true;
                Frame.css("width", screen.availWidth);
                Frame.css("height", screen.availHeight);
                ContentWidth = screen.availWidth;
                ContentHeight = screen.availHeight;
                ChangeBottomRightCenterContent(screen.availWidth, screen.availHeight);
                break;
        }
        //region 控件自适应大小
        for (var i = 0; i < workspace.controlList.size() ; i++) {
            var item = workspace.controlList.get(i);
            item.HTMLElementSizeChanged();
        }
        //endregion
        layoutManagement.property.pageSize = Num.trim();

        /*释放临时变量*/
        Num=Frame=null;
    });

    //3 背景颜色
    var $canvas = $('#BottomRightCenterContentDiv');
    $.farbtastic($('#colorpicker'), function (color) {
        $canvas.css('background-color', color);
        layoutManagement.property.backGround = color.trim();
    });

    //4 选择格子大小变化的事件
    $("#SelectGridlines").bind('change', function () {
        $("#BottomRightCenterContentDiv").css("background-image", "");//点击网格时图片不显示
        $("#BottomRightCenterContentDiv").css("background-position", "");
        $("#BottomRightCenterContentDiv").css("background-repeat", "");
        $("#BottomRightCenterContentDiv").css("background-size", "");
        var Num = $("#SelectGridlines").val();
        $("#BottomRightCenterContentDiv").css("background-size", Num + "px" + " " + Num + "px");
        $("#ChangeGridlinesDiv").hide();
        $('#Gridlines').text(Num);

        layoutManagement.property.gridLine = Num.trim();
    });

    //更换画布显示比例层的显示与隐藏
    $("#AspectRatioDiv").bind('click', function () {

        var Asp = document.getElementById("AspectRatioDiv");
        var AspShow = document.getElementById("SelectAspectRatioDiv");
        AspShow.style.top = Asp.offsetTop - $("#SelectAspectRatioDiv").height() - 20 + "px";
        AspShow.style.left = Asp.offsetLeft + 20 + "px";

        if ($("#SelectAspectRatioDiv").is(":visible") == false) {
            Agi.Controls.BasicPropertyPanel.Show("SelectAspectRatioDiv");
            AspShow.style.display = "block";
             var zindex = menuManagement.getControlMaxzIndex($("#BottomRightCenterContentDiv"));
         $("#SelectAspectRatioDiv").css('z-index',zindex.max+100);
        }
        else {
            AspShow.style.display = "none";
        }

        /*释放临时变量*/
        Asp=AspShow=null;
    });
    //隐藏撤销
    //以下代码用样式进行了隐藏
//    $("#undo").hide();
//    $("#redo").hide();
//    $("#Point_plus").hide();
//    $("#TagGroupConfig_plus").hide();
    //图片的点击
    $("#ControlpropertiesImg").click(function () {
        if (Agi.Edit.workspace.controlList.toArray().length > 0) {
            PropertyPanelFloat(ContentWidth);
            Agi.Controls.BasicPropertyPanel.PanelStateChange();
        }
    });

    //属性面板浮动
    function PropertyPanelFloat(ContentWidth) {
        if (ContentWidth == 800 || ContentWidth == 1024 || ContentWidth == 1440) {
            Agi.Controls.BasicPropertyPanel.PanelPositionChange({
                Left: ($(document.body).width() - $("#BasicPropertyPanel").width() - 25) + "px",
                Top: ($(document.body).height() - $("#BasicPropertyPanel").height()) - $("#BottomRightBottomDiv").height() * 1.2 + "px"
            });
        }
        if (ContentWidth == 1280 || ContentWidth == 1366 || ContentWidth == 1364) {
            Agi.Controls.BasicPropertyPanel.PanelPositionChange({
                Left: ($(document.body).width() - $("#BasicPropertyPanel").width() - 25) + "px",
                Top: ($(document.body).height() - $("#BasicPropertyPanel").height()) - $("#BottomRightBottomDiv").height() * 1.7 + "px"
            });
        }
    }

    function PropertyPanelFloatAsPercent(_Percent) {
        if (_Percent == "100%") {
            if (ContentWidth == 800 || ContentWidth == 1024 || ContentWidth == 1440) {
                Agi.Controls.BasicPropertyPanel.PanelPositionChange({
                    Left: ($(document.body).width() - $("#BasicPropertyPanel").width() - 25) + "px",
                    Top: ($(document.body).height() - $("#BasicPropertyPanel").height()) - $("#BottomRightBottomDiv").height() * 1.2 + "px"
                });
            }
            if (ContentWidth == 1280 || ContentWidth == 1366 || ContentWidth == 1364) {
                Agi.Controls.BasicPropertyPanel.PanelPositionChange({
                    Left: ($(document.body).width() - $("#BasicPropertyPanel").width() - 25) + "px",
                    Top: ($(document.body).height() - $("#BasicPropertyPanel").height()) - $("#BottomRightBottomDiv").height() * 1.7 + "px"
                });
            }
        }
        if (_Percent == "400%" || _Percent == "200%") {
            Agi.Controls.BasicPropertyPanel.PanelPositionChange({
                Left: ($(document.body).width() - $("#BasicPropertyPanel").width() - 25) + "px",
                Top: ($(document.body).height() - $("#BasicPropertyPanel").height()) - $("#BottomRightBottomDiv").height() * 1.7 + "px"
            });

        }
        if (_Percent == "75%" || _Percent == "50%" || _Percent == "25%") {
            Agi.Controls.BasicPropertyPanel.PanelPositionChange({
                Left: ($(document.body).width() - $("#BasicPropertyPanel").width() - 25) + "px",
                Top: ($(document.body).height() - $("#BasicPropertyPanel").height()) - $("#BottomRightBottomDiv").height() * 1.2 + "px"
            });
        }
    }

    $('#skinSwitch-img').hover(function (e) {
        $(this).attr('src', "Img/TopIcon/skin_hover.png");
    }, function (e) {
        $(this).attr('src', "Img/TopIcon/skin.png");
    });

    $('#skinSwitch').next().find('li[class!=divider]').bind('click', function (e) {
        $(this).parent().parent().removeClass('open');
        var val = $(this).data('type');
        var $themeLink = $('#lkTheme');
        if (val == '1') {
            $themeLink.attr('href', 'CSS/FrameThemes/theme1.css');
        } else if(val=='2') {
            $themeLink.attr('href', 'CSS/FrameThemes/theme2.css');
        } 
        /**[SGAI MARKER][20140307]START*/
        //[liuxing][provide url to download chrome installer]
        else if(val=='3'){
        	window.location.href='http://10.3.250.120:8080/qpc-web/Chrome33.exe';
        }
        /**[SGAI MARKER][20140307]END*/
    });
    //  }

    //左侧菜单
    menuManagement = new Agi.MenuManagement({
        controlXmlFile: "xml/ControlConfig.xml",
        controlsContainer: $("#controlsListContaner"),
        pageManageNode: $('#PageManage')
    });
    menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
    menuManagement.loadRealTimeDC($('#RealTimeListContaner'));
    menuManagement.loadStyles($('#stylesListContaner'));
    //初始加载页面列表
    menuManagement.loadPages();

    //为画布注册单击事件
    $('#BottomRightCenterContentDiv').bind('click', function (e) {
        //激活脚本的单击事件
        canvas.fireScriptCode('click');
    });
	
    window.dialogs = {
        _save : Agi.Utility.DialogBox('ShowVersioninfomodal',{title:'保存'}),
        _pageParamConfig : Agi.Utility.DialogBox('PageParam',{title:'页面参数配置'}),
//        _ShareDataOperationPanel : Agi.Utility.DialogBox('ShareDataOperationPanel',{title:'共享数据源配置面板 '}),
        _SelectWayToCreateVT : Agi.Utility.DialogBox('SelectWayToCreateVT',{title:'实体配置向导',height:300}),
        _VTSelectDS : Agi.Utility.DialogBox('VTSelectDS',{title:'选择数据源',height:350}),
        _ScVTSelectDS : Agi.Utility.DialogBox('ScVTSelectDS',{title:'选择数据源',height:350}),
        _ScVTSelectVT : Agi.Utility.DialogBox('ScVTSelectVT',{title:'选择实体',height:350}),
        _keyModal : Agi.Utility.DialogBox('keyModal',{title:'SQL参数配置面板'}),
        _PopupSelectDataSource : Agi.Utility.DialogBox('PopupSelectDataSource',{title:'选择数据源',height:350}),
        _PopupSelectVTable : Agi.Utility.DialogBox('PopupSelectVTable',{title:'选择虚拟表',height:350}),
        _SetExpression : Agi.Utility.DialogBox('SetExpression',{title:'配置表达式'}),
        _OperateExcelDiv: Agi.Utility.DialogBox('OperateExcelDiv',{title:'上传Excel文件',height:400}),
        _PROVTSelectDS: Agi.Utility.DialogBox('PROVTSelectDS',{title:'选择数据源',height:350}),
        _PROVTSelectPRO: Agi.Utility.DialogBox('PROVTSelectPRO',{title:'选择存储过程',height:350}),
        _powerId:Agi.Utility.DialogBox('PagePerson',{title:'权限管理',height:600,width:1280}),
        _ProKeyModal: Agi.Utility.DialogBox('ProKeyModal',{title:'参数配置'})
    };
//    //隐藏所有控件
//    dis_JunHideAll("");
//    //调用qpcPageLoad名称的webservice接口
//	call_qpcPageLoad("");
});

//end (document).ready

//隐藏所有主页面操作小窗口
function HideAllMainPageWin() {
    $("#PopupSelectDataSource").modal('hide');
    $("#PopupSelectVTable").modal('hide');
    $("#VTSelectDS").modal('hide');
    $("#SelectWayToCreateVT").modal('hide');
    $("#ScVTSelectDS").modal('hide');
    $("#ScVTSelectVT").modal('hide');
    $("#ChangeBackGroundDiv").modal('hide');
    //$("#powerId1").modal('hide');
    //        $("#SelectWayToCreateVT").hide();
}

/*控件初始化到的目标对象(jquery 对象),控件显示位置,控件类型*/
function InitControl(_TargetObj, _position, _ControlType) {
    menuManagement.loadControlTheme($('#accordion-agivis #ControlTheme>.accordion-inner'), _ControlType);//加载控件主题
    var NewControl = null;
    if (_ControlType == "Panel") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/Panel/Panel.css",
                "JS/Controls/Panel/Panel.js"],
            function () {
                NewControl = new Agi.Controls.Panel();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    } else if (_ControlType == "DropDownList") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/DropDownList/DropDownList.css",
                "JS/Controls/DropDownList/DropDownList.js"],
            function () {
                NewControl = new Agi.Controls.DropDownList();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "Label") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/Label/Label.css",
                "JS/Controls/Label/Label.js"],
            function () {
                NewControl = new Agi.Controls.Label();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "InquireButton") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/InquireButton/InquireButton.css",
                "JS/Controls/InquireButton/InquireButton.js"],
            function () {
                NewControl = new Agi.Controls.InquireButton();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "TimePicker") {
        Agi.Script.Import.LoadFileList(
            [
                "JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/TimePicker/TimePicker.css",
                "JS/Controls/TimePicker/TimePicker.js",
                "JS/Controls/TimePicker/MyDatePicker.js",
                "JS/Controls/TimePicker/MyDatePicker.css"
            ],
            function () {
                NewControl = new Agi.Controls.TimePicker();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "CylinderChart") {
        Agi.Script.Import.LoadFileList(
            [
                "JS/Controls/CylinderChart/css/style.css",
                "JS/Controls/CylinderChart/css/prettify.css",
                "JS/Controls/CylinderChart/jsFile/prettify.js",
                "JS/Controls/CylinderChart/jsFile/lib.js",
                "JS/Controls/CylinderChart/jsFile/json2.js",
                "JS/Controls/CylinderChart/jsFile/FusionCharts.js",
                "JS/Controls/CylinderChart/CylinderChart.js"
            ],
            function () {
                NewControl = new Agi.Controls.CylinderChart();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "DatePicker") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/DatePicker/zebra_datepicker_metallic.css",
                "JS/Controls/DatePicker/zebra_datepicker.src.js",
                "JS/Controls/DatePicker/DatePicker.js"],
            function () {
                NewControl = new Agi.Controls.DatePicker();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "TimeSplider") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/TimeSplider/TimeSplider.css",
                "JS/Controls/TimeSplider/TimeSpliderTemplate.js",
                "JS/Controls/TimeSplider/TimeSplider.js"],
            function () {
                NewControl = new Agi.Controls.TimeSplider();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "RealTimeLable") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/RealTimeLable/RealTimeLable.css",
                "JS/Controls/RealTimeLable/RealTimeLable.js"],
            function () {
                NewControl = new Agi.Controls.RealTimeLable();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
    else if (_ControlType == "BoxChart") {
        Agi.Script.Import.LoadFileList(
            ["JS/Controls/ControlBasic.css",
                "JS/Controls/ControlBasic.js",
                "JS/Controls/BoxChart/Boxandwhiskers4.js",
                "JS/Controls/BoxChart/json2.js",
                "JS/Controls/BoxChart/lib.js",
                "JS/Controls/BoxChart/css/prettify.css",
                "JS/Controls/BoxChart/prettify.js",
                "JS/Controls/BoxChart/css/style.css",
                "JS/Controls/BoxChart/css/BoxChart.css",
                "JS/Controls/BoxChart/BoxChart.js"],
            function () {
                NewControl = new Agi.Controls.RealTimeLable();
                NewControl.Init(_TargetObj, _position);//初始化显示
                InitControlMenu(NewControl);//显示菜单
            })
    }
}
/*控件库拖拽出控件进行初始化显示*/
function InitControlToCanvas(_TargetObj, _position, _controlLibs, _InitFun, Entity, tabsTabid) {
    //ly,undo
    oldValue = $(workspace.editDiv).html();
    //
    var NewControl = null;
    Agi.Script.Import.LoadFileList(_controlLibs,
        function () {
            NewControl = eval(_InitFun)();
            NewControl.Init(_TargetObj, _position);//初始化显示
            //ly undo
            newValue = $(workspace.editDiv).html();
            //
            InitControlMenu(NewControl);//显示菜单
            //
            if (Entity) {
                NewControl.ReadData(Entity);
            }
            //
            if (tabsTabid) {
                var oProprty = NewControl.Get('ProPerty');
                oProprty.tabsTabid = tabsTabid;
                NewControl.Set('ProPerty', oProprty);
            }
            NewControl.parentId = null;
            if(_TargetObj.attr('container') == 'true'){//建立关系
                NewControl.parentId =  _TargetObj.attr('id');
                var container = Agi.Controls.FindControlByPanel(NewControl.parentId);
                container.childControls.push(NewControl);
            }
            //region 模拟数据
            //            if (_InitFun.indexOf('PC') > 0) {
            //                NewControl.initData(true);
            //            }
            //endregion
            
            /**[SGAI MARKER][20140303]START*/
            //[liuxing][20140303]初始化控件时,确认查询参数和查询区域控件之间的关系
            associateControlWithQueryArea(NewControl,true);
            /**[SGAI MARKER][20140303]END*/
        }
    );
}
/**[SGAI MARKER][20140303]START*/
function associateControlWithQueryArea(NewControls,isInit){
	if($.isArray(NewControls)){
		for(var i=0;i<NewControls.length;i++){
			contactQeuryToArea(NewControls[i],isInit);
		}
	}else{
		contactQeuryToArea(NewControls,isInit);
	}
}
function contactQeuryToArea(NewControl,isInit){
	var oProprty = NewControl.Get('ProPerty');
    var controlobj=Agi.Controls.FindControl(oProprty.ID);
    var controltype=controlobj.Get('ControlType');
    
    //如果当前控件不是查询区域,并且已存在的查询区域列表为空,就不需要再判断位置关系
    if((controltype!='QueryPanel'&&!IsQueryAreaExist()))
		return;
    
    if(controltype=='QueryPanel'){
    	//如果当前位置/大小变化的控件是查询区域:
    	var controlList=Agi.Edit.workspace.controlList.toArray();
    	var inAreaControlIDList=[];
    	for(var i=0;i<controlList.length;i++){
    		var extControl=controlList[i];
    		var extType=extControl.Get('ControlType');
    		if(IsControlAQueryType(extType)){
    			if(IsQueryInArea(extControl.Get('Position'),controlobj.Get('Position'))){
    				inAreaControlIDList.push(extControl.Get('ProPerty').ID);
    			}
    		}
    	}
    	if(inAreaControlIDList.length>0){
    		controlobj.ContactWithQueryControl('refresh',inAreaControlIDList);
    	}
    }else if(IsControlAQueryType(controltype)){
    	//如果当前位置/大小变化的控件是查询参数/按钮控件:
    	if(IsQueryAreaExist()){
    		for(var i=0;i<GetQueryAreas().length;i++){
    			var queryarea=GetQueryAreas()[i];
    			if(IsQueryInArea(controlobj.Get('Position'),queryarea.Get('Position'))){
    				queryarea.ContactWithQueryControl('add',controlobj.Get('ProPerty').ID);
    			}else{
    				queryarea.ContactWithQueryControl('del',controlobj.Get('ProPerty').ID);
    			}
    		}
    		
    	}
    }
}
//[liuxing][20140303]当前所有的能出现在查询区域的控件
var queryControlTypesList=[/*'Panel',*/
                           'InquireButton',
                           'DropDownList',
                           'MultiSelect',
                           'Label',
                           'TextInputBox',
                           'RadioButton',
                           'AssociativeInputBox',
                           'DatePicker',
                           'TimeSelector',
                           'AnimationControl',
                           'CheckBox',
                           'TimePicker'];
/*//[liuxing][20140303]编辑区域出现的所有查询区域控件的引用的集合
var queryAreasList=[];*/
function GetQueryAreas(){
	var controlList=Agi.Edit.workspace.controlList.toArray();
	var queryAreas=[];
	for(var i=0;i<controlList.length;i++){
		var con=controlList[i];
		if(con.Get('ControlType')=='QueryPanel'){
			queryAreas.push(con);
		}
	}
	return queryAreas;
}
function IsQueryAreaExist(){
	return GetQueryAreas().length>0;
}
//[liuxing][20140303]检查控件是否为查询参数
function IsControlAQueryType(controltype){
	return InArray(controltype,queryControlTypesList);
}
function InArray(val,arr){
	return $.inArray( val, arr )!=-1;
}
//[liuxing][20140303]检查query控件的锚点(左上角)是否在一个area这个查询区域控件中
function IsQueryInArea(query,area){
	return query.Left>=area.Left && query.Right>=area.Right && query.Top>=area.Top && query.Bottom>=area.Bottom;
}
/**[SGAI MARKER][20140303]END*/


//
var initUndo = {};
function InitControlMenu(_NewControl) {
    Agi.Edit.workspace.controlList.add(_NewControl);//添加当前新增控件至控件列表
    //ly,undo
    initUndo.control = _NewControl;

    var THisControlPanel = $(_NewControl.Get("HTMLElement"));
    if (THisControlPanel.length) {
        Agi.Controls.BasicPropertyPanel.Show(THisControlPanel[0].id,true);//显示默认属性面板，并选中当前新增的控件
    }
    //ly,undo
    var undoFunction = function () {
        workspace.controlList.remove(initUndo.control);
        Agi.Controls.BasicPropertyPanel.Hide();
    }
    var redoFunction = function () {
        Agi.Edit.workspace.controlList.add(_NewControl);
        var THisControlPanel = $(_NewControl.Get("HTMLElement"));
        Agi.Controls.BasicPropertyPanel.Show(THisControlPanel[0].id);
    }
    //在控件拖出后给样式列表绑定事件
    menuManagement.updateDragableStylesTargets();
    //stack.execute(new EditCommand(undoFunction, redoFunction, oldValue, newValue));
}

//显示frame页面
function ShowMainFramePage() {
    //初始化时隐藏于组态环境的显示块
    $("#TitleMenuDiv").hide();
    $("#ShowListDiv").hide();
    $("#BottomRightCenterDiv").hide();
    $("#BottomRightBottomDiv").hide();
    $("#BottomRightCenterOthersContentDiv").hide();

    //显示关于frame功能的显示块
    $("#BottomRightText").text("主页");
    $("#FrameTitleMenuDiv").show();
    $("#FrameShowListDiv").show();
    $("#FrameBottomRightBottomContentDiv").show();
    $("#BottomRightText").text("主页");
    $('.themeSwitch').show();

}


//显示组态环境页面
function ShowNewMainPage() {

    //隐藏关于frame功能的显示块
    $("#FrameTitleMenuDiv").hide();
    $("#FrameShowListDiv").hide();
    $("#FrameBottomRightBottomContentDiv").hide();
    $("#BottomRightCenterOthersContentDiv").hide();
    $('.themeSwitch').hide();

    //显示关于组态环境的显示块
    $("#TitleMenuDiv").show();
    $("#ShowListDiv").show();
    $("#BottomRightCenterDiv").show();
    $("#BottomRightBottomDiv").show();
    $("#BottomRightText").text("组态环境");
    //    $('#accordion-agivis>.accordion-group:eq(1)>.accordion-heading>a').click();
    //设置右侧中间div的初始值
    $("#BottomRightCenterContentDiv").html("");
    Agi.Edit.ClearAllControls();//清除所有控件对象
    $("#BottomRightCenterContentDiv").css("width", screen.width);
    $("#BottomRightCenterContentDiv").css("height", screen.height);
    $("#PageSizeText").text(screen.width + " * " + screen.height);
    $("#SelectPageSize").val(screen.width + " * " + screen.height);
    //    $("#BottomRightCenterContentDiv").css("margin", "40px");
    ContentWidth = screen.width;
    ContentHeight = screen.height;
    ChangeBottomRightCenterContent(screen.width, screen.height);
    //    //隐藏所有主页面操作小窗体
    //    HideAllMainPageWin();

    //20140310 13:35 markeluo 新增 新建页面时，默认让页面另存为的选项为可见
    $("#PageSaveToGroup").show();
}

//显示frame操作数据源的面板
function ShowOperationData() {
    $("#FrameBottomRightBottomContentDiv").hide();

    $("#BottomRightCenterOthersContentDiv").show();
   //20130124 15:30 盈科 王伟资源上传修改
//    $("#BottomRightCenterOthersContentDiv").html("");
}


//设置右侧中间面板居中显示
function ChangeBottomRightCenterContent(width, height) {
    if (width > $("#BottomRightCenterDiv").width() && height > $("#BottomRightCenterDiv").height()) {
        $("#BottomRightCenterContentDiv").css("margin", "0px");
    }
    else {
        if (width > $("#BottomRightCenterDiv").width() && height < $("#BottomRightCenterDiv").height()) {
            $("#BottomRightCenterContentDiv").css("margin-left", "0px");
            $("#BottomRightCenterContentDiv").css("margin-right", "0px");
            $("#BottomRightCenterContentDiv").css("margin-top", ($("#BottomRightCenterDiv").height() - height) / 2 + "px");
            $("#BottomRightCenterContentDiv").css("margin-bottom", ($("#BottomRightCenterDiv").height() - height) / 2 + "px");
        }
        else if (width < $("#BottomRightCenterDiv").width() && height > $("#BottomRightCenterDiv").height()) {
            $("#BottomRightCenterContentDiv").css("margin-left", ($("#BottomRightCenterDiv").width() - width) / 2 + "px");
            $("#BottomRightCenterContentDiv").css("margin-right", ($("#BottomRightCenterDiv").width() - width) / 2 + "px");
            $("#BottomRightCenterContentDiv").css("margin-top", "0px");
            $("#BottomRightCenterContentDiv").css("margin-bottom", "0px");
        }
        else {
            $("#BottomRightCenterContentDiv").css("margin-left", ($("#BottomRightCenterDiv").width() - width) / 2 + "px");
            $("#BottomRightCenterContentDiv").css("margin-right", ($("#BottomRightCenterDiv").width() - width) / 2 + "px");
            $("#BottomRightCenterContentDiv").css("margin-top", ($("#BottomRightCenterDiv").height() - height) / 2 + "px");
            $("#BottomRightCenterContentDiv").css("margin-bottom", ($("#BottomRightCenterDiv").height() - height) / 2 + "px");
        }
    }
}

//右侧菜单显示隐藏
$("#SuspensionDiv").live('click', function () {
    $('#BottomLeftDiv').toggle();

    //右侧中间内容居中显示
    ChangeBottomRightCenterContent($("#BottomRightCenterContentDiv").width(), $("#BottomRightCenterContentDiv").height());

});


//选择格子背景的宽度弹出框
$("#GridlinesDiv").live('click', function () {
    var Gri = document.getElementById("GridlinesDiv");
    var GriShow = document.getElementById("ChangeGridlinesDiv");
    GriShow.style.top = Gri.offsetTop - $("#ChangeGridlinesDiv").height() - 20 + "px";
    GriShow.style.left = Gri.offsetLeft + 20 + "px";
    if ($("#ChangeGridlinesDiv").is(":visible") == false) {
        Agi.Controls.BasicPropertyPanel.Show("ChangeGridlinesDiv");
        GriShow.style.display = "block";
         var zindex = menuManagement.getControlMaxzIndex($("#BottomRightCenterContentDiv"));
         $("#ChangeGridlinesDiv").css('z-index',zindex.max+100);
    }
    else {
        GriShow.style.display = "none";
    }

    /*释放临时变量*/
    Gri=GriShow=null;
});
//选择画布的背景图片
$("#BgImgDiv").live('click', function () {
    var BgImgShow = document.getElementById("ShowBgImage");
    Agi.BgImageManage.AllBackgroundImg(function (result) {
        if (result.result == "true") {
            var AllImages = result.listData;
            $('#ShowBgImage').modal({ backdrop:true, keyboard: false, show: true }); //加载弹出层
            $('#ShowBgImage').draggable({
                handle: ".modal-header"
            });
            var AllImageStr = "<ul class='showimgfaceul' id='SelectCanvasBG'>";
            for (var i = 0; i < AllImages.length; i++) {
                var path = Agi.ImgServiceAddress + AllImages[i];
                //console.log(AllImages[i]);
                var arrTemp =AllImages[i].split('/');
                var title = arrTemp[arrTemp.length-1];
                AllImageStr += "<li><a href='#' title='"+title.trim()+"'><img src='" + path + "'></img></a></li>"
            }
            AllImageStr += "</ul>";

            $("#ShowAllImg").html(AllImageStr);

        } else {

            AgiCommonDialogBox.Alert("当前服务器没有可使用的图片！", null);
            return false;
        }
    });
    if ($("#ShowBgImage").is(":visible") == false) {
        $('#ShowBgImage').modal({ backdrop:true, keyboard: false, show: true }); //加载弹出层
        $('#ShowBgImage').draggable({
            handle: ".modal-header"
        });
        Agi.Controls.BasicPropertyPanel.Show("ShowBgImage");
        BgImgShow.style.display = "block";
        var zindex = menuManagement.getControlMaxzIndex($("#BottomRightCenterContentDiv"));
         $("#ShowBgImage").css('z-index',zindex.max+100);
    } else {
        BgImgShow.style.display = "none";
    }
    BgImgShow.style.zIndex = '2147483647';
});
//点击图片，获得图片路径
var BgImgPath;
var arrBgImgPath = [];
$("#SelectCanvasBG").find("a").live('click', function () {
    var BottomRightCenterContentDivTemp=$("#BottomRightCenterContentDiv");
    BottomRightCenterContentDivTemp.css("background-image", "url(" + $(this).find("img").attr("src") + ")");
    BgImgPath = $(this).find("img").attr("src");

    BottomRightCenterContentDivTemp.css("background-position", "center");
    BottomRightCenterContentDivTemp.css("background-repeat", "no-repeat");
    BottomRightCenterContentDivTemp.css("background-size", "100% 100%");
    BottomRightCenterContentDivTemp=null;//DOM查询优化，临时变量清空

    arrBgImgPath.push(BgImgPath);
});
//点击确定将图片显示在画布上
$("#ConfirmImg").live('click', function () {
    $("#ShowBgImage").modal('hide');
});
//点击取消按钮
$("#AbolishImg").live('click', function () {
    var BottomRightCenterContentDivTemp=$("#BottomRightCenterContentDiv");
    $("#ShowBgImage").modal('hide');
    if (arrBgImgPath.length >= 2) {
        arrBgImgPath.pop();
        var imgPath = arrBgImgPath.slice(-1);
        BottomRightCenterContentDivTemp.css("background-image", "url(" + imgPath + ")");
        BottomRightCenterContentDivTemp.css("background-position", "center");
        BottomRightCenterContentDivTemp.css("background-repeat", "no-repeat");
        BottomRightCenterContentDivTemp.css("background-size", "100% 100%");
        
    } else {
      
        BottomRightCenterContentDivTemp.css("background-color", "");
        BottomRightCenterContentDivTemp.css("-webkit-box-shadow", "");
        BottomRightCenterContentDivTemp.css("background-size", "");
        BottomRightCenterContentDivTemp.css("background-image", "");
        BottomRightCenterContentDivTemp.css("position", "");
        BottomRightCenterContentDivTemp.css("background-position", "");
        BottomRightCenterContentDivTemp.css("background-repeat", "");
        //20130115 倪飘 修改组态环境添加背景颜色以后添加背景图片点取消按钮（这时组态环境中背景清空），预览页面中出现背景颜色问题
        layoutManagement.property.backGround="";
    }
    BottomRightCenterContentDivTemp=null;//DOM查询优化，临时变量清空
});

//选择改变背景颜色的弹出框以及颜色改变事件
$("#BackGroundDiv").live('click', function () {
//    //出现选择颜色控件
//    //    $('#colorpicker').farbtastic('#BottomRightCenterContentDiv');
//    //    $('#colorpicker').farbtastic(callback);
//    var BgiShow = document.getElementById("ChangeBackGroundDiv");
//    $("#ChangeBackGroundDiv").css("left", ($("#BottomRightCenterDiv").width() - $("#ChangeBackGroundDiv").width()) / 2 + $("#ChangeBackGroundDiv").width() + "px");
//    $("#ChangeBackGroundDiv").css("top", ($("#BottomRightCenterDiv").height() - $("#ChangeBackGroundDiv").height()) / 2 + ($("#ChangeBackGroundDiv").height() / 2) + "px");
//    if ($("#ChangeBackGroundDiv").is(":visible") == false) {
//        Agi.Controls.BasicPropertyPanel.Show("ChangeBackGroundDiv");
//        BgiShow.style.display = "block";
//    }
//    else {
//        BgiShow.style.display = "none";
//    }
//    BgiShow.style.zIndex = "2147483647";
    var $canvas = $('#BottomRightCenterContentDiv');
    var currentColor = $canvas.data('colorValue');
    colorPicker.open({
        defaultValue:!currentColor ? null : currentColor, //这个参数是上一次选中的颜色
        saveCallBack:function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
            //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
            //20130410 倪飘 解决bug，组态页面修改背景颜色后，网格线不见
            if(color.rgba){
                $canvas.css('background','');
                $canvas.css('background-image','');
                $canvas.css('background-image','-webkit-gradient(linear, 0 0, 0 100%, color-stop(.1, transparent), color-stop(.1, rgba(0, 0, 0, .1)), to(rgba(0, 0, 0, .1))),-webkit-gradient(linear, 0 0, 100% 0, color-stop(.1, transparent), color-stop(.1, rgba(0, 0, 0, .1)), to(rgba(0, 0, 0, .1)))');
                $canvas.css('background-color','');
                $canvas.css('background-color',color.rgba).data('colorValue', color);//3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
             }else{
                  $canvas.css(color.value).data('colorValue', color);//3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
             }
        }
    });
});
//显示新建数据源面板
$("#MainDatasourceDiv").live('click', function () {
    boolIsSave = false;
    AddNewDataSource();
});

$("#database_plus").live('click', function () {
    if (boolIsSave == false) {
        AgiCommonDialogBox.Confirm("确认离开编辑页面?", null, function (flag) {
            if (flag) {
                boolIsSave = true;
                AddNewDataSource();
            }
        });
    } else {
        AddNewDataSource();
    }
    boolIsSave = false
});
//权限
$("#powerPerson").live('click', function () {
    //window.open ('../../sgai/pageIndex.html','newwindow','height=400,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no') ;
//	$("#PagePerson").load('../../sgai/pageIndex.html',function(){
//		$("#PagePerson").modal({ backdrop: true, keyboard: false, show: true });
//	})
    if(!dialogs._powerId.dialog('isOpen')){
        dialogs._powerId.dialog('open');
    }
//    var TempDive=$("<div style='width:100%;height:auto;'></div>");
//
//    TempDive.load("servicetest.html");
    var TempDive=$("<div  style='width:100%;height:95%;'></div>");
//    TempDive.html("<iframe style='width:2000;height0%' height='1000'></iframe>");
    TempDive.html("<iframe style='width: 99%;height: 95%;over-flow:hidden' src='../../sgai/pageIndex.html'></iframe>");
//    var iframe = document.createElement('iframe');
//    $(iframe).attr('style', 'width: 1000;height: 600');
//    $(iframe).attr('src', '../../sgai/userManage.html');
    $("#PagePersonItemContent").children().remove()
    $("#PagePersonItemContent").append(TempDive);
});

//显示新建虚拟表面板

$("#MainVirtualtableDiv").live('click', function () {
    if (boolIsSave == false) {
        AgiCommonDialogBox.Confirm("确认离开编辑页面?", null, function (flag) {
            if (flag) {
                boolIsSave = true;
                $("#WayOne").attr("checked","checked");
                //修改弹出框遮罩问题
//                $("#SelectWayToCreateVT").modal({ backdrop: true, keyboard: false, show: true });
////                $('#SelectWayToCreateVT').draggable({
////                    handle: ".modal-header"
////                });
//                $('#SelectWayToCreateVT').draggable("disable");
                if(!dialogs._SelectWayToCreateVT.dialog('isOpen')){
                    dialogs._SelectWayToCreateVT.dialog('open');
                }
            }
        });
    } else {
        $("#WayOne").attr("checked","checked");
         //修改弹出框遮罩问题
//        $("#SelectWayToCreateVT").modal({ backdrop: true, keyboard: false, show: true });
////        $('#SelectWayToCreateVT').draggable({
////            handle: ".modal-header"
////        });
//        $('#SelectWayToCreateVT').draggable("disable");
        if(!dialogs._SelectWayToCreateVT.dialog('isOpen')){
            dialogs._SelectWayToCreateVT.dialog('open');
        }
    }
    boolIsSave = false;
});

//选择建立虚拟表方式确定
$("#SelectWayNext").live('click', function () {
    var SelectWay = $(":radio[name='VTWay']:checked").val();
    switch (SelectWay) {
        case "WayOne":
            //$("#SelectWayToCreateVT").modal('hide');
            dialogs._SelectWayToCreateVT.dialog('close');
            AddNewVirtualTable();
            $("#BottomRightText").text("新建标准虚拟表");
            break;
        case "WayTwo":
            //$("#SelectWayToCreateVT").modal('hide');
            dialogs._SelectWayToCreateVT.dialog('close');
            AddNewSCVirtualTable();
            $("#BottomRightText").text("新建混合虚拟表");
            break;
        case "WayThree":
            //$("#SelectWayToCreateVT").modal('hide');
            dialogs._SelectWayToCreateVT.dialog('close');
            AddNewPROVirtualTable();
            $("#BottomRightText").text("新建存储过程虚拟表");
            break;
    }

    /*释放临时变量*/
    SelectWay=null;
});
//选择建立虚拟表取消
$("#SelectWayCancel").live('click', function () {
    //$("#SelectWayToCreateVT").modal('hide');
    dialogs._SelectWayToCreateVT.dialog('close');
    boolIsSave = true;
    ShowMainFramePage();
});

$("#VirtualPre").live('click', function () {
//    $("#VTSelectDS").modal('hide');
    dialogs._VTSelectDS.dialog('close');
//    $("#SelectWayToCreateVT").modal({ backdrop: false, keyboard: false, show: true });
////    $('#SelectWayToCreateVT').draggable({
////        handle: ".modal-header"
////    });
//    $('#SelectWayToCreateVT').draggable("disable");
    if(!dialogs._SelectWayToCreateVT.dialog('isOpen')){
        dialogs._SelectWayToCreateVT.dialog('open');
    }
});

$("#ScDsPreBtn").live('click', function () {
//    $("#ScVTSelectDS").modal('hide');
    dialogs._ScVTSelectDS.dialog('close');
//    $("#SelectWayToCreateVT").modal({ backdrop: false, keyboard: false, show: true });
////    $('#SelectWayToCreateVT').draggable({
////        handle: ".modal-header"
////    });
//    $('#SelectWayToCreateVT').draggable("disable");
    if(!dialogs._SelectWayToCreateVT.dialog('isOpen')){
        dialogs._SelectWayToCreateVT.dialog('open');
    }
});


$("#virtual").live('click', function () {
    //    if(boolIsSave == false){
    //        if(confirm("确认离开编辑页面?")){
    //            boolIsSave = true;
    ShowMainFramePage();
    //隐藏所有主页面操作小窗体
    HideAllMainPageWin();
    $("#WayOne").attr("checked","checked");//默认选中新建标准虚拟表
//    $("#SelectWayToCreateVT").modal({ backdrop: true, keyboard: false, show: true });
////    $('#SelectWayToCreateVT').draggable({
////        handle: ".modal-header"
////    });
//    $('#SelectWayToCreateVT').draggable("disable");
    if(!dialogs._SelectWayToCreateVT.dialog('isOpen')){
        dialogs._SelectWayToCreateVT.dialog('open');
    }
    //20130111 倪飘 解决虚拟表-创建混合虚拟表-点击取消退出实体配置向导，再次点击新建虚拟表，实体配置向导默认错误问题
    $('[name="VTWay"]:radio').each(function() { 
        if (this.value == 'WayOne') 
        { 
        this.checked = true; 
        } 
        }); 
    //        }
    //    }else{
    //            $("#SelectWayToCreateVT").modal({ backdrop: true, keyboard: false, show: true });
    //            $('#SelectWayToCreateVT').draggable({
    //         handle: ".modal-header"});
    //    }

    //    boolIsSave=false;
});
//显示新建Datasets面板
//$("#MainDatasetsDiv").live('click', function () {
//    AddDataSets();
//});

//$("#dataset").live('click', function () {
//    AddDataSets();
//});


//操作左侧菜单展开收起的方法

function OperationLeftMenu() {
    var accordion_head = $('.accordion > li a');
    accordion_head.live('click', function (event) {
        //        event.preventDefault();
        //        if ($(this).attr('class') != 'active') {
        //            //accordion_body.slideUp('fast');
        //            accordion_head.removeClass('active');
        //            $(this).addClass('active');
        //        }
        //        $(this).next().stop(true, true).slideToggle('fast');

        //收起其它的
        var parentUL = $(this).parent().parent();
        parentUL.find('>li>a').removeClass('active').next().slideUp('fast');
        //打开当前的
        if (!$(this).next().is(':visible')) {
            $(this).addClass('active').next().slideToggle('fast', function (e) {
                if (!$(this).is(":visible")) {
                    $(this).prev().removeClass('active');
                }
            });
        }
    });

    //$("#collapseOne").find("li a")
    var accordion_head2 =$("#collapseOne").find("li a");
    var parentUL =null;
    accordion_head2.live('click', function (event) {
        //收起其它的
        parentUL= $(this).parent().parent();
        parentUL.find('>li>a').removeClass('active').next().slideUp('fast').parent().data("Expend","0");
        //打开当前的
        if ($(this).parent().data("Expend")!="1") {
            $(this).parent().data("Expend","1");
            $(this).parent().find('>a').addClass('active').next().slideToggle('fast');
        }else{
            $(this).parent().data("Expend","0");
        }
        parentUL=null;
    });
}//end OperationLeftMenu

//数据源菜单
//20140308 增加ID
function AddLeftMenu(resultData) {
    /// <summary>添加数据源菜单</summary>
    /// <param name="resultData" type="String">所有数据源</param>
    /// <param name="resultData" type="String">所有数据源</param>
    if (!resultData) {
        $("#FrameShowListDiv").html("<div id='wrapper-250'><ul class='accordion' id='DrawerMenu_Group'>" +
            "<li class='ReAndR' id='DrawerMenu_ReAndR'> <a><span><img src='Img/LeftIcon/database.png'/></span>数据源管理</a><ul class='sub-menu' id='DataSource' ></ul></li>" +
            "<li class='addVTManage' id='addVTManage'><a><span><img src='Img/LeftIcon/table.png'/></span>虚拟表管理</a><ul class='sub-menu' id='VirtualTableManage'></ul></li>" +
            "<li class='MyDataSets' id='DrawerMenu_MyDataSets'> <a><span><img src='Img/LeftIcon/datasets.png'/></span>Datasets管理</a><ul class='sub-menu' id='DatasetsManage'></ul></li>" +

            // "<li class='PointInfo'> <a><span><img src='Img/LeftIcon/database.png'/></span>点位信息</a><ul class='sub-menu' id='PointInfoMagage'></ul></li>" +
//    "<li class='MyGroup'> <a><span><img src='Img/LeftIcon/resource.png'/></span>分组管理</a><ul class='sub-menu' id='GroupManage'></ul></li>" +
     //       "<li class='MyTagGroupConfig'> <a><span><img src='Img/LeftIcon/resource.png'/></span>关系配置</a><ul class='sub-menu' id='GroupConfigManage'></ul></li>" +
            "<li data-isfile='pageRoot'  id='DrawerMenu_PageManage'> <a><span><img src='Img/LeftIcon/dashboard.png'/></span>页面管理</a><ul class='sub-menu'  id='PageManage' ></ul></li>" +
//    "<li class='VersionInfo'> <a><span><img src='Img/LeftIcon/database.png'/></span>版本管理</a><ul class='sub-menu' id='VersionManage'></ul></li>" +
            "<li id='DrawerMenu_ResourceManage'> <a><span><img src='Img/LeftIcon/resource.png'/></span>资源管理</a><ul class='sub-menu'  id='ResourceManage' >" +
            "<li id='imgResourceManage' class='imgResourceManage' ><a><span> <img src='Img/LeftIcon/database.png'></span>图片资源</a><ul class='Sub2' id='imgResource'></ul></li>" +     //图片资源管理
            "</ul></li></ul></div>");
    }
    else {
        BindLeftManageList();
        BindVTManageList(resultData);
        //添加datasets
        AddAllDatasets();
        //添加关系数据源
        AddLeftRLDataSource(resultData);
        //添加实时数据源
        AddLeftRTDataSource();
        //添加分组信息
        AddAllGroup();
        //添加点位信息
        BindPointManageList();
        //添加配置关系
        AddMyTagGroupConfigList()
    }
    AddRightMenu();
}
function BindLeftManageList() {
    var LeftManageList = "";

    LeftManageList += "<li class='MyRealTimeDataS' id='MyRealTimeDataS' style='background-image: none; border-radius:0px;'> <a style='margin-top: 0;margin-bottom: 0;'><span><img src='Img/LeftIcon/database.png'/></span>实时数据源</a><ul class='Sub2' id='RTDataSourceManage' style='/*border:1px solid #E5E5E5;border-top:0px;*/ margin:0px 5px 0px 5px; border-radius:10px;'></ul></li>";

    LeftManageList += "<li class='RightNewDS' id='MyRTds' style='background-image: none; border-radius:0px;'> <a style='margin-top: 0;margin-bottom: 0;'><span><img src='Img/LeftIcon/database.png'/></span>关系数据源</a><ul class='Sub2' id='DataSourceManage' style='/*border:1px solid #E5E5E5;border-top:0px;*/ margin:0px 5px 5px 5px; border-radius:10px;'></ul></li>";
    $("#DataSource").html(LeftManageList);
}

function AddLeftRLDataSource(resultData) {
    $("#DataSourceManage").html("");
    var RTManageList = "";
    if (resultData.length > 0) {
        for (var i = 0; i < resultData.length; i++) {
            var dataSourceName = resultData[i].dataSourceName;
            var dataSourceType=resultData[i].dataSourceType;
            var T = resultData[i].dataSourceName + "T";
            var V = resultData[i].dataSourceName + "V";
            var P = resultData[i].dataSourceName + "P";
            //20130711 倪飘 解决bug，存储过程虚拟表，excel数据源无法创建存储过程虚拟表，新建存储过程虚拟表选项应该去掉（数据源下的view和Procedures也建议去掉）
             if(dataSourceType==="Excel"){
             RTManageList += "<li id='" + dataSourceName + "' class='RightDS' title='" + dataSourceName + "'>" +
                    "<a><span><img src='Img/LeftIcon/database.png'/></span>" + dataSourceName + "</a><ul class='Sub3'><li class='tables'>" +
                    "<a><span><img src='Img/LeftIcon/table.png'/></span>Tables</a><ul id='" + T + "' class='Sub4'></ul></li></ul></li>";
             }
             else{
                RTManageList += "<li id='" + dataSourceName + "' class='RightDS' title='" + dataSourceName + "'>" +
                    "<a><span><img src='Img/LeftIcon/database.png'/></span>" + dataSourceName + "</a><ul class='Sub3'><li class='tables'>" +
                    "<a><span><img src='Img/LeftIcon/table.png'/></span>Tables</a><ul id='" + T + "' class='Sub4'></ul></li><li class='views'>" +
                    "<a><span><img src='Img/LeftIcon/view.png'/></span>Views</a><ul id='" + V + "' class='Sub4'></ul></li><li class='procedures'>" +
                    "<a><span><img src='Img/LeftIcon/procedure.png'/></span>Procedures</a><ul id='" + P + "' class='Sub4'></ul></li></ul></li>";
                }
           }
        //        $("#DataSource").html(LeftManageList);
        $("#DataSourceManage").html(RTManageList);
    }
}

function BindVTManageList(resultData) {
    $("#VirtualTableManage").html("");
    var VTManageList = "";
    if (resultData.length > 0) {
        for (var i = 0; i < resultData.length; i++) {
            var dataSourceName = resultData[i].dataSourceName;
            var dataSourceType=resultData[i].dataSourceType;
            var X = resultData[i].dataSourceName + "X";
            var SC = resultData[i].dataSourceName + "SC";
            var PRO= resultData[i].dataSourceName + "PRO";
            //20130711 倪飘 解决bug，存储过程虚拟表，excel数据源无法创建存储过程虚拟表，新建存储过程虚拟表选项应该去掉（数据源下的view和Procedures也建议去掉）
             if(dataSourceType==="Excel"){
                VTManageList += "<li id='" + dataSourceName + "' class='RightVT' title='" + dataSourceName + "'><a><span><img src='Img/LeftIcon/database.png'/></span>" + dataSourceName + "</a>" +
                "<ul class='Sub2'><li class='AddNewVT'><a><span><img src='Img/LeftIcon/table.png'/></span>&nbsp;标准虚拟表</a>" +
                "<ul class='Sub3' id='" + X + "'></ul></li>" +
                "<li class='AddNewSCVTs'><a><span><img src='Img/LeftIcon/table.png'/></span>&nbsp;混合虚拟表</a><ul class='Sub3' id='" + SC + "'></ul></li></ul></li>";
            }
            else{
                VTManageList += "<li id='" + dataSourceName + "' class='RightVT' title='" + dataSourceName + "'><a><span><img src='Img/LeftIcon/database.png'/></span>" + dataSourceName + "</a>" +
                "<ul class='Sub2'><li class='AddNewVT'><a><span><img src='Img/LeftIcon/table.png'/></span>&nbsp;标准虚拟表</a>" +
                "<ul class='Sub3' id='" + X + "'></ul></li>" +
                "<li class='AddNewSCVTs'><a><span><img src='Img/LeftIcon/table.png'/></span>&nbsp;混合虚拟表</a><ul class='Sub3' id='" + SC + "'></ul></li>"+
                "<li class='AddNewPRO'><a><span><img src='Img/LeftIcon/table.png'/></span>存储过程虚拟表</a><ul class='Sub3' id='" + PRO + "'></ul></li></ul></li>";
            }
         }
        $("#VirtualTableManage").html(VTManageList);


        //新建标准虚拟表
        $(".AddNewVT").contextMenu('AddNewBZVT', {
            bindings: {
                'addnewbzvts': function (t) {
                    $("#BottomRightText").text("新建标准虚拟表");
                    var _dataSourceName = $(t).parent().parent().find('a').first().text();
                    Agi.DCManager.DCGetConnDByID(_dataSourceName, function (result) {
                        if (result.result == "true") {
                            NewVirtualTableDBName = result.dataSourceName;
                            NewVirtualTableDBType = result.dataBaseType;
                            AddVTManage(result.dataSourceName, result.dataBaseType);
                        }
                    });
                }
            }
        });

        //新建混合虚拟表
        $(".AddNewSCVTs").contextMenu('AddNewSCVTs', {
            bindings: {
                'addnewscvtss': function (t) {
                    ShowMainFramePage();
                    $("#BottomRightText").text("新建混合虚拟表");
                    var _dataSourceName = $(t).parent().parent().find('a').first().text();
                    Agi.DCManager.DCGetConnDByID(_dataSourceName, function (result) {
                        if (result.result == "true") {
                            SelectAllVT(result.dataSourceName, result.dataBaseType);
                        }
                    });
                }
            }
        });

        //新建存储过程虚拟表
        $(".AddNewPRO").contextMenu('AddNewPROs', {
            bindings: {
                'addnewpross': function (t) {
                    ShowMainFramePage();
                    $("#BottomRightText").text("新建存储过程虚拟表");
                    var _dataSourceName = $(t).parent().parent().find('a').first().text();
                    Agi.DCManager.DCGetConnDByID(_dataSourceName, function (result) {
                        if (result.result == "true") {
                            ShowAllDSPro(result.dataSourceName, result.dataBaseType);
                        }
                    });
                }
            }
        });
    }
}

//点位信息--------------------------------------------------------------------------------------------------------------------------
//点击点位信息----------------------------------------------------------------------------------------------------------------
$("#MainPointInfoDiv").live('click', function () {
    $("#BottomRightText").text("新建点位");
    AddNwePointInformation();
});

$("#Point_plus").live('click', function () {
    $("#BottomRightText").text("新建点位");
    AddNwePointInformation();

    //无论用户做什么与DataSet无关的操作，只要弹出框还显示就隐藏...

    //    if ($("#PopupSelectDataSource").is(":visible")) {
    //        $("#PopupSelectDataSource").modal('hide');
    //    }
    //    if ($("#PopupSelectVTable").is(":visible")) {
    //        $("#PopupSelectVTable").modal('hide');
    //    }
}); //end点击点位信息-----------------------------------------------------------------------------------------------------------------

//新建关系配置===========================================================================================================================
//$("#MainPointInfoDiv").live('click', function () {
//    $("#BottomRightText").text("新建关系配置");
//    AddNwePointInformation();
//    goBack = ShowMainFramePage;
//    goForward = AddNwePointInformation;
//    goStack.execute(new goCommand(goBack, goForward));
//});

$("#TagGroupConfig_plus").live('click', function () {
    $("#BottomRightText").text("新建关系配置");
    AddNewTagGroupConfig();

    //无论用户做什么与DataSet无关的操作，只要弹出框还显示就隐藏...

    //    if ($("#PopupSelectDataSource").is(":visible")) {
    //        $("#PopupSelectDataSource").modal('hide');
    //    }
    //    if ($("#PopupSelectVTable").is(":visible")) {
    //        $("#PopupSelectVTable").modal('hide');
    //    }
});  //新建关系配置===========================================================================================================================
function BindPointSource() {
    var pointRtdbID = "";
    var tagName = "";
    Agi.DCManage.DCFindPointDate(pointRtdbID, tagName, function (result) {
        var array = result;
        // BindPointManageList(array);
    });
}
function BindPointManageList() {//点位信息
    $("#PointInfoMagage").html("");
    var PointManageList = "";
    var RightPointListVar = "";
    Agi.RTDSManager.RtdbLoad('', function (result) {
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            for (var i = 0; i < rtdsdata.length; i++) {
                var VarTag = rtdsdata[i].RtdbID;
                PointManageList += "<li id=" + rtdsdata[i].RtdbID + "  class='RightListPoint'>" +
                    "<a title=" + rtdsdata[i].RtdbID + "><span><img src='Img/LeftIcon/datasetss.png'/></span>" + rtdsdata[i].RtdbID + "</a><ul class='Sub2' id='" + VarTag + "'></ul></li>";
                //                Agi.DCManager.DCFindPointDate(rtdsdata[i].RtdbID,"",function(_result){
                //                    if(_result.result){
                //                        var TagSoruce = _result.tagName;
                //                        var varTagList = "" ;
                //                        if(TagSoruce != null){
                //                            for(var i=0;i<TagSoruce.length;i++){
                //                                varTagList +="<li id='" + TagSoruce[i].Tag + "'  class='RightPoint' id='RightPointList'>" +
                //                                    "<a title='" + TagSoruce[i].Tag + "'><span><img src='Img/LeftIcon/datasetss.png'/></span>" + TagSoruce[i].Tag + "</a></li>";
                //                            }
                //                            $("#"+VarTag).html(varTagList);
                //                        }
                //                    }
                //                });
            }
            //绑定点位信息到下拉菜单
            $("#PointInfoMagage").html(PointManageList);
            //右键菜单
            $(".RightListPoint").contextMenu('PointDrop', {
                bindings: {
                    'NewPoint': function (t) {
                        var IsNewOrUpdataPoint = "save";
                        var rtdbid = $(t).find('a').first().text();
                        AddNwePointInformation(rtdbid, IsNewOrUpdataPoint);
                        $("#BottomRightText").text("新建点位");
                    },
                    //点位编辑方法
                    'PointEdit': function (t) {
                        var IsNewOrUpdata = "update";
                        var VarrtdbID = $(t).find('a').first().text();
                        UpdatePointInformation(VarrtdbID, IsNewOrUpdata);
                        $("#BottomRightText").text("编辑点位");
                    },
                    //删除数据源方法
                    'PointDelete': function (t) {
                        var rtdbid = $(t).parent().parent().find('a').first().text();
                        var dataID = $(t).find('a').first().text();
                        if (confirm("确定删除点位：" + $(t).parent().parent().find('a').first().text() + "?")) {
                            DeletePointInfoOP(rtdbid, dataID);
                        } else {
                            return;
                        }
                    }
                }
            });

            /*释放临时变量*/
            PointManageList=RightPointListVar=null;
        }
    });
    //点击加载下一级菜单
    //    $(".RightPoint").live('click', function () {
    ////获取当前点击的RtdbID
    //        var currentRtdbID = $(this).find('a').first().text();
    //        var RightPointListVar = "";
    //        //根据ID查找单个DataSet数据信息
    //        Agi.DCManager.DCFindPointDate( currentRtdbID,"",function (result) { //位号名称
    //            var rtdsdata=result.tagName;
    //            if (rtdsdata != null) {
    //                $.each(rtdsdata, function (i, val) {
    //                    RightPointListVar += "<li id='" + rtdsdata[i].Tag + "' class='RightPoint'>" +
    //                        "<a title='" + rtdsdata[i].Tag + "'><span><img src='Img/LeftIcon/database.png'/></span>" + rtdsdata[i].Tag + "</a></li>";
    //                    // alert( rtdsdata[i].Tag);
    //                });
    //                $("#" + currentRtdbID + " .Sub2").html(RightPointListVar);
    //                $("#" + currentRtdbID).contextMenu('PointDrop', {
    //                    bindings:{
    //                        //数据源编辑方法
    //                        'PointEdit':function (t) {
    //                            IsNewOrUpdataPoint = "update";
    //                            var rtdbid = $(t).parent().parent().find('a').first().text();
    //                            var tag = $(t).find('a').first().text();
    //                            EditPointInfoOP(rtdbid,tag);
    //                        },
    //                        //删除数据源方法
    //                        'PointDelete':function (t) {
    //                            var rtdbid = $(t).parent().parent().find('a').first().text();
    //                            var dataID = $(t).find('a').first().text();
    //                            if (confirm("确定删除点位：" +  $(t).parent().parent().find('a').first().text() + "?")) {
    //                                DeletePointInfoOP(rtdbid,dataID);
    //                            }else { return;}
    //                        }
    //                    }
    //                });
    //            }
    //        });
    //    });
}

//删除
function DeletePointInfoOP(rtdbid, dataID) {
    Agi.DCManager.DCDeletePoint(rtdbid, dataID, function (result) {
        if (result.result == "true") {
            BindPointManageList();

            AgiCommonDialogBox.Alert(result.message, null);
        }
        else {
            AgiCommonDialogBox.Alert(result.message, null);
            return;
        }
    });

}
//点位信息--------------------------------------------------------------------------------------------------------------------------
//关系配置 ================================================================================================================================
function AddMyTagGroupConfigList() {
    $("#GroupConfigManage").html("");
    var ConfigManageList = "";
    Agi.RTDSManager.RtdbLoad('', function (result) {
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            for (var i = 0; i < rtdsdata.length; i++) {
                var VarTag = rtdsdata[i].RtdbID + "Tag";
                ConfigManageList += "<li id='" + rtdsdata[i].RtdbID + "'  class='RightPoint' id='RightPointList'>" +
                    "<a title='" + rtdsdata[i].RtdbID + "'><span><img src='Img/LeftIcon/datasetss.png'/></span>" + rtdsdata[i].RtdbID + "</a><ul class='Sub2' id='" + VarTag + "'></ul></li>";
            }
        }
        $("#GroupConfigManage").html(ConfigManageList);
    });
    $(".MyTagGroupConfig").contextMenu('AddTagGroupConfig', {
        bindings: {
            'NewTagGroupConfig': function (t) { //新建配置关系
                AddNewTagGroupConfig();
                $("#BottomRightText").text("新建配置关系");
            },
            'GroupConfigEdit': function (t) { //编辑配置关系
                UpdateTagGroupConfig();
                $("#BottomRightText").text("编辑配置关系");
            },
            'GroupConfigDelete': function (t) { //删除配置关系
                DeleteTagGroupConfig();
                $("#BottomRightText").text("删除配置关系");
            }
        }
    });
}
//end关系配置===============================================================================================================================

function GetArrayList(ArrayString) {
    /// <summary>数据处理，去除"[]"并且返回array</summary>
    /// <param name="ArrayString" type="String">string类型的集合</param>
    //    var dataSourceNames = ArrayString.substring(1, ArrayString.length - 1);
    //    return array = dataSourceNames.split(',');

    return ArrayString;  //webservice直接返回数组，不需要其它处理
}
//function GetDCMangeDetailsList(resultData) {
//    /// <summary>根据数据源获取对应的详细数据</summary>
//    /// <param name="resultData" type="String">所有数据源</param>
//    debugger;
//    for (var i = 0; i < resultData.length; i++) {
//        var _dataSourceName = resultData[i].dataSourceName;
//        Agi.DCManager.DCGetNamesByID(_dataSourceName, function (result) {
//            AddLeftMenuDetails(_dataSourceName,resultData);
//        });
//    }
//}
function GetDCMangeList(result) {
    if (result) {
        AddLeftMenu(null);
        /// <summary>获取所有数据源</summary>
        Agi.DCManager.DCGetAllConn(function (result) {
            var array = result.dataSourceData;
            AddLeftMenu(array);
        });
    }
    else {
        Agi.DCManager.DCGetAllConn(function (result) {
            var array = result.dataSourceData;
            AddLeftRLDataSource(array);
            BindVTManageList(array);
            AddRightMenu();
        });
    }

}
//绑定虚拟表数据源下面的虚拟表
function AddVTMenuDetails(resultData) {
    //20130703 markeluo 修改 解决数据源下不存在任何虚拟表时出错的问题
    if(resultData.result=="true"){
        var _dataSourceName = resultData.dataSourceName;
        var array = resultData.virtualTableData;
        var virtualTableList = "";
        var X = _dataSourceName + "X";
        $("#" + X).html("");
        if (array.length > 0) {
            for (var i = 0; i < array.length; i++) {
                //20140224 范金鹏 判断字符长度，若是长度在20以内就全部显示，若是大于20，后面显示省略号
                if(array[i].ID.replace(/[^\x00-\xff]/g,'**').length>40)
                {
                virtualTableList += "<li class='VTdes' title='" + array[i].ID + "'><a><span><img src='Img/LeftIcon/tables.png'/></span>" + array[i].ID.substr(0,19)+"..." + "</a></li>";
                }
                else
                {
                 virtualTableList += "<li class='VTdes' title='" + array[i].ID + "'><a><span><img src='Img/LeftIcon/tables.png'/></span>" + array[i].ID + "</a></li>";
                }
            }
            $("#" + X).html(virtualTableList);
        }

        //虚拟表操作
        $(".VTdes").contextMenu('OperationVTManage', {
            bindings: {
                //新建DataSet
                'RNewDs': function (t) {
                    var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                    var vtName = $(t).find('a').first().text();
                    Agi.VTManager.VTGetTableDetailsByDS(dataSourceName, vtName, function (result) {
                        if (result.result == "true") {
                            if (Agi.WebServiceConfig.Type == ".NET") {
                                if (result.TableDetailsData.SingleEntityInfo.SqlDefined.Schema != undefined) {
//                                $("#PopupSelectVTable").modal('hide');
                                    dialogs._PopupSelectVTable.dialog('close');
                                    AddDataSets(dataSourceName, vtName);
                                }
                                else {
                                    AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                                    return false;
                                }
                            }
                            else {
                                if (result.TableDetailsData != null && result.TableDetailsData.length > 0 && result.TableDetailsData[0].schema != undefined) {
//                                $("#PopupSelectVTable").modal('hide');
                                    dialogs._PopupSelectVTable.dialog('close');
                                    AddDataSets(dataSourceName, vtName);
                                }
                                else {
                                    AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                                    return false;
                                }
                            }
                        }
                        else {
                            AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                            return false;
                        }
                    });
                },
                //虚拟表编辑方法
                'EVTManage': function (t) {
                    var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                    //var vtName = $(t).find('a').first().text();
                    var vtName=$(t).attr("title");
                    EditVT(dataSourceName, vtName);
                    $("#BottomRightText").text("虚拟表编辑");
                    boolIsSave = false;
                },
                //虚拟表删除方法
                'DVTManage': function (t) {
                    var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                    //var vtName = $(t).find('a').first().text();
                    var vtName =$(t).attr("title");

                    //20130626 markeluo 修改 删除提示
//                var content = "确定删除虚拟表" + vtName + "?";
//                AgiCommonDialogBox.Confirm(content, null, function (flag) {
//
//                    if (flag) {
//                        Agi.VTManager.VTDelete(dataSourceName, vtName, function (result) {
//                            if (result.result == "true") {
//                                GobakFramePage();//20121227 11:43 markeluo 删除虚拟表 后，右侧面板恢复默认内容
//                                AddAllDatasets();//20130225  yangyu 连带删除前台刷新
//                                //刷新面板。
//                                menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
//                                Agi.VTManager.VTGetVirtualTableByDS(dataSourceName, function (result) {
//                                    AddVTMenuDetails(result);
//                                });
//                            }
//                        });
//                    }
//                });

                    var SrcObj={
                        "deleteenum":"2",
                        "datasource":dataSourceName,
                        "vtable":vtName,
                        "dataset":""
                    }
                    var content = "确定删除 " + vtName + "?";
                    var detailcontent="";
                    Agi.PageSourceDelTipManager.DelSource(SrcObj,function(result){
                        if(result.result=="true"){
                            content=vtName + "被"+result.fhvtablecount+"个混合虚拟表、"+result.datasetcount+"个Dataset、"+result.pagecount+"个页面使用，您确定删除?";
                            detailcontent=Agi.PageSourceDelTipManager.TipsMerg(result);
                        }else{
                            content="获取" + vtName + "的引用关系失败，您确定继续删除?";
                        }
                        AgiCommonDialogBox.ConfirmDetail(content, null,detailcontent, function(flag) {
                            if (flag) {
                                Agi.VTManager.VTDelete(dataSourceName, vtName, function (result) {
                                    if (result.result == "true") {
                                        GobakFramePage();//20121227 11:43 markeluo 删除虚拟表 后，右侧面板恢复默认内容
                                        AddAllDatasets();//20130225  yangyu 连带删除前台刷新
                                        //刷新面板。
                                        menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
                                        Agi.VTManager.VTGetVirtualTableByDS(dataSourceName, function (result) {
                                            AddVTMenuDetails(result);
                                        });
                                    }
                                });
                            } else {
                                return;
                            }
                        });
                    });
                }
            }
        });

        /*释放临时变量*/
        _dataSourceName=array=virtualTableList=null;
    }

}

//绑定混合数据源实体
function BindSCVTData(data) {

    var SCvirtualTableList = "";

    var SCData;
    if (data.result == "true") {
        var SC = data.data.dataSourceName + "SC";
        $("#" + SC).html("");
        SCData = data.data.scDefined;
        if (SCData.length > 0) {
            for (var i = 0; i < SCData.length; i++) {
                //20130902 14:28 markeluo 更改标准虚拟表，标识关联的混合虚拟表和DataSet的修改状态
                //SCvirtualTableList += "<li class='SCVTdes' title='" + SCData[i] + "'><a><span><img src='Img/LeftIcon/tables.png'/></span>" + SCData[i] + "</a></li>";
                if(GetscvtChangeState(SCData[i],data.data.scDefinedStates)=="0"){
                    SCvirtualTableList += "<li class='SCVTdes' title='" + SCData[i] + "'><a><span><img src='Img/LeftIcon/tables.png'/></span>" + SCData[i] + "</a></li>";
                }else{
                    SCvirtualTableList += "<li class='SCVTdes' title='" + SCData[i] + "'><a><span><img src='Img/LeftIcon/tables_Changed.png'/></span>" + SCData[i] + "</a></li>";
                }
            }
            $("#" + SC).html(SCvirtualTableList);
        }
    }

    //混合虚拟表操作
    $(".SCVTdes").contextMenu('AStandardVT', {
        bindings: {
            'AddRNewDs': function (t) {
                var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                var vtName = $(t).find('a').first().text();
                Agi.VTManager.VTGetTableDetailsByDS(dataSourceName, vtName, function (result) {
                    if (result.result == "true") {
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            if (result.TableDetailsData.SingleEntityInfo.ScDefined.Columns.Column != undefined) {
//                                $("#PopupSelectVTable").modal('hide');
                                dialogs._PopupSelectVTable.dialog('close');
                                AddDataSets(dataSourceName, vtName, true);
                            }
                            else {
                                AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                                return false;
                            }
                        } else {
                            //20121130 markeluo 添加JAVA的处理逻辑代码
                            if (result.TableDetailsData[0].Columns.Column != undefined) {
//                                $("#PopupSelectVTable").modal('hide');
                                dialogs._PopupSelectVTable.dialog('close');
                                AddDataSets(dataSourceName, vtName, true);
                            }
                            else {
                                AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                                return false;
                            }
                        }
                    } else {
                        AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                        return false;
                    }
                });
            },
            'EditStandardVT': function (t) {
                //编辑混合虚拟表
                var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                var vtName = $(t).find('a').first().text();
                EditSCVirtualTablePage(dataSourceName, vtName)
                $("#BottomRightText").text("编辑混合虚拟表");
                boolIsSave = false;
            },
            'DeleteStandardVT': function (t) {
                //删除混合实体
                var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                var vtName = $(t).find('a').first().text();

//                var content = "确定删除混合虚拟表：" + vtName + "?";
//                AgiCommonDialogBox.Confirm(content, null, function (flag) {
//
//                    if (flag) {
//                        Agi.VTManager.SCVTDeleteScMethodInfo(dataSourceName, vtName, function (result) {
//                            if (result.result == "true") {
//                                Agi.VTManager.SCVTGetScMethodInfoEx(dataSourceName, function (_result) {
//                                    BindSCVTData(_result);
//                                    AgiCommonDialogBox.Alert("删除成功！", null);
//                                    GobakFramePage();//20121227 16:58 倪飘 删除混合虚拟表 后，右侧面板恢复默认内容
//                                });
//                            }
//                        });
//                    }
//                    else {
//                        return;
//                    }
//                });
                var SrcObj={
                    "deleteenum":"3",
                    "datasource":dataSourceName,
                    "vtable":vtName,
                    "dataset":""
                }
                var content = "确定删除 " + vtName + "?";
                var detailcontent="";
                Agi.PageSourceDelTipManager.DelSource(SrcObj,function(result){
                    if(result.result=="true"){
                        content=vtName + "被"+result.datasetcount+"个Dataset、"+result.pagecount+"个页面使用，您确定删除?";
                        detailcontent=Agi.PageSourceDelTipManager.TipsMerg(result);
                    }else{
                        content="获取" + vtName + "的引用关系失败，您确定继续删除?";
                    }

                    AgiCommonDialogBox.ConfirmDetail(content, null,detailcontent, function(flag) {
                        if (flag) {
                            Agi.VTManager.SCVTDeleteScMethodInfo(dataSourceName, vtName, function (result) {
                                if (result.result == "true") {
                                        GobakFramePage();//20121227 16:58 倪飘 删除混合虚拟表 后，右侧面板恢复默认内容
                                        AddAllDatasets();//20130225  yangyu 连带删除前台刷新
                                        //刷新面板。
                                        menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
                                        Agi.VTManager.SCVTGetScMethodInfoEx(dataSourceName, function (_result) {
                                        BindSCVTData(_result);
                                        AgiCommonDialogBox.Alert("删除成功！", null);
                                    });
                                }
                            });
                        } else {
                            return;
                        }
                    });
                });
            }
        }
    });

    /*释放临时变量*/
    SCvirtualTableList=null;
}
//绑定存储过程实体
function BindProVT(data){

    var PROvirtualTableList = "";

    var PROData;
    if (data.result == "true") {
        var PRO = data.datasource + "PRO";
        $("#" + PRO).html("");
        PROData = data.vtables;
        if (PROData.length > 0) {
            for (var i = 0; i < PROData.length; i++) {
                PROvirtualTableList += "<li class='PROVTdes' title='" + PROData[i] + "'><a><span><img src='Img/LeftIcon/tables.png'/></span>" + PROData[i] + "</a></li>";
            }
            $("#" + PRO).html(PROvirtualTableList);
        }

    }

       //存储过程虚拟表操作
    $(".PROVTdes").contextMenu('AStandardProVT', {
        bindings: {
            'AddProNewDS': function (t) {
                var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                var vtName = $(t).find('a').first().text();
                 Agi.VTManager.VTGetTableDetailsByDS(dataSourceName, vtName, function (result) {
                    if (result.result == "true") {
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            if (result.TableDetailsData.SingleEntityInfo.SpDefined.Schema != undefined) {
//                                $("#PopupSelectVTable").modal('hide');
                                dialogs._PopupSelectVTable.dialog('close');
                                AddDataSets(dataSourceName, vtName,false);
                            }
                            else {
                                AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                                return false;
                            }
                        }
                        else {
                            if (result.TableDetailsData != null && result.TableDetailsData.length > 0 && result.TableDetailsData[0].schema != undefined) {
//                                $("#PopupSelectVTable").modal('hide');
                                dialogs._PopupSelectVTable.dialog('close');
                                AddDataSets(dataSourceName, vtName,false);
                            }
                            else {
                                AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                                return false;
                            }
                        }
                    }
                    else {
                        AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                        return false;
                    }
                });
            },
            'EditPro': function (t) {
                //编辑存储过程虚拟表
                var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                var vtName = $(t).find('a').first().text();
                EditProVirtualTablePage(dataSourceName, vtName)
                $("#BottomRightText").text("编辑混合虚拟表");
                boolIsSave = false;
            },
            'DletePro': function (t) {
                //删除存储过程实体
                var dataSourceName = $(t).parent().parent().parent().parent().find('a').first().text();
                var vtName = $(t).find('a').first().text();

                var content = "确定删除存储过程虚拟表：" + vtName + "?";
                AgiCommonDialogBox.Confirm(content, null, function (flag) {

                    if (flag) {
                        Agi.VTManager.SP_DeleteSpMethodInfo(dataSourceName, vtName, function (result) {
                            if (result.result == "true") {
                                 //20130715 倪飘 解决bug，删除存储过程虚拟表，但是此虚拟表下的dataset没有连带删除
                                   GobakFramePage();//20121227 16:58 倪飘 删除混合虚拟表 后，右侧面板恢复默认内容
                                    AddAllDatasets();//20130225  yangyu 连带删除前台刷新
                                    //刷新面板。
                                    menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
                                    Agi.VTManager.SP_GetSptable(dataSourceName, function (_result) {
                                     BindProVT(_result);
                                      AgiCommonDialogBox.Alert("删除成功！", null);
                                    });
                            }
                            else{
                                AgiCommonDialogBox.Alert(_result.message);
                                return;
                            }
                        });
                    }
                    else {
                        return;
                    }
                });
            }
        }
    });
}

function AddLeftMenuDetails(resultData) {
    /// <summary>根据数据源绑定Tables/Views/Procedures</summary>
    /// <param name="dataSourceName" type="String">数据源名称</param>
    /// <param name="resultData" type="String">数据源对象</param>
    ///_dataSourceName:数据源名称 _tableData:Tables集合 _viewData:Views集合 _StoredProcedureData:Procedures集合
    var _dataSourceName = resultData.dataSourceName;
    var _tableData = resultData.tableData;
    var _viewData = resultData.viewData;
    var _StoredProcedureData = resultData.StoredProcedureData;
    ///tableDataList、viewDataList、StoredProcedureDataList拼接tableData成<UL><LI></LI></UL>
    var tableDataList = "", viewDataList = "", StoredProcedureDataList = "";
    ///T, V, R;拼接<LI>标签ID添加标签
    var T, V, R;
    T = _dataSourceName + "T";
    V = _dataSourceName + "V";
    P = _dataSourceName + "P";
    if (_tableData.length > 0 && _tableData != "") {
        for (var i = 0; i < _tableData.length; i++) {
            tableDataList += "<li class='des' title='" + _tableData[i] + "'><a><span><img src='Img/LeftIcon/tables.png'/></span>" + _tableData[i] + "</a></li>";
        }
        $("#" + T).html(tableDataList);
    }
    if (_viewData.length > 0 && _viewData != "") {
        for (var i = 0; i < _viewData.length; i++) {
            viewDataList += "<li class='des' title='" + _viewData[i] + "'><a><span><img src='Img/LeftIcon/views.png'/></span>" + _viewData[i] + "</a></li>";
        }
        $("#" + V).html(viewDataList);
    }
    if (_StoredProcedureData.length > 0 && _StoredProcedureData != "") {
        for (var i = 0; i < _StoredProcedureData.length; i++) {
            StoredProcedureDataList += "<li classp='pdes' title='" + _StoredProcedureData[i] + "'><a classp='pdes'><span classp='pdes'><img classp='pdes' src='Img/LeftIcon/procedures.png'/></span>" + _StoredProcedureData[i] + "</a></li>";
        }
        $("#" + P).html(StoredProcedureDataList);
    }
    $(".des").contextMenu('desS', {
        bindings: {
            'desserch': function (t) {
                var dbname = $(t).parent().parent().parent().parent().find('a').first().text();
                var type = $(t).parent().parent().find('a').first().text();
                var nameID = $(t).find('a').first().text();
                ShowDetailquery(dbname, type, nameID);
                //                alert($(t).parent().parent().parent().parent().find('a').first().text()+"   "+$(t).parent().parent().find('a').first().text()+"   "+$(t).find('a').first().text());
            }
        }
    });

    /*释放临时变量*/
    _dataSourceName=_tableData=_viewData=_StoredProcedureData=T=V=P=null;
}
function DCMangeDelete(dataSourceName,callBack) {
    var callBackFun = callBack;
    Agi.DCManager.DCDelete(dataSourceName, function (result) {
        if (result.result == "true") {
            GetDCMangeList(false);
        }else{
            AgiCommonDialogBox.Alert("删除失败!");
        }
        if(callBackFun && typeof callBackFun === 'function'){
            callBackFun();
        }
    });

}
//添加右键菜单
function AddRightMenu() {
    //新建关系数据源和实时数据源
    $(".ReAndR").contextMenu('AddNewRandreDatasource', {
        bindings: {
            'AnewReDatasource': function (t) {
                AddNewDataSource();
            },
            'AnewRDatasource': function (t) {
                boolIsSave = false;
                $("#BottomRightText").text("新建实时数据源");
                AddRTDBPanel();
            }
        }
    });


    //新建数据源
    $(".RightNewDS").contextMenu('newdsright', {
        bindings: {
            'newdss': function (t) {
                AddNewDataSource();
                //                goBack = goForward;
                //                goForward = AddNewDataSource;
                //                goStack.execute(new goCommand(goBack, goForward));
            }
        }
    });
    //资源
    $("#Resource").contextMenu('UpResourcePicture', {
        bindings: {
            'UpPicture': function (t) {

            }
        }
    });
    //新建虚拟表
    $("#addVTManage").contextMenu('AVTManage', {
        bindings: {
            'AddVTManage': function (t) {
                $("#WayOne").attr("checked","checked");//选择新建标准虚拟表时，则选中新建标准虚拟表选项
                //20130427 倪飘 解决bug，标准虚拟表，在编辑其他页面时，右键'虚拟表'，点击"新建标准虚拟表"，弹出实体配置窗口，实体配置窗口后应返回主页，不应显示上一编辑页面
                ShowMainFramePage();
                AddNewVirtualTable();
                $("#BottomRightText").text("新建标准虚拟表");
                boolIsSave = false;
            },
            'AddStandardVT': function (t) {
                $("#WayTwo").attr("checked","checked");//选择新建混合虚拟表时，则选中新建混合虚拟表选项
                AddNewSCVirtualTable();
                $("#BottomRightText").text("新建混合虚拟表");
                boolIsSave = false;
            },
            'AddStandardPRO': function (t) {
                $("#WayThree").attr("checked","checked");//选择新建混合虚拟表时，则选中新建混合虚拟表选项
//                AddNewSCVirtualTable();
                $("#BottomRightText").text("新建存储过程虚拟表");
                AddNewPROVirtualTable();
                boolIsSave = false;
            }
        }
    });
    //虚拟表菜单 根据数据源新建虚拟表
    $(".RightVT").contextMenu('AVTManage', {
        bindings: {
            //新建虚拟表
            'AddVTManage': function (t) {
                $("#WayOne").attr("checked","checked");//选择新建标准虚拟表时，则选中新建标准虚拟表选项
                $("#BottomRightText").text("新建标准虚拟表");
                boolIsSave = false;
                var _dataSourceName = $(t).find('a').first().text();
                Agi.DCManager.DCGetConnDByID(_dataSourceName, function (result) {
                    if (result.result == "true") {
                        NewVirtualTableDBName = result.dataSourceName;
                        NewVirtualTableDBType = result.dataBaseType;
                        AddVTManage(result.dataSourceName, result.dataBaseType);
                    }
                });
            },
            'AddStandardVT': function (t) {
                $("#WayTwo").attr("checked","checked");//选择新建混合虚拟表时，则选中新建混合虚拟表选项
                $("#BottomRightText").text("新建混合虚拟表");
                boolIsSave = false;
                var _dataSourceName = $(t).find('a').first().text();
                Agi.DCManager.DCGetConnDByID(_dataSourceName, function (result) {
                    if (result.result == "true") {
                        SelectAllVT(result.dataSourceName, result.dataBaseType);
                    }
                });

            },
            'AddStandardPRO': function (t) {
                $("#WayThree").attr("checked","checked");//选择新建混合虚拟表时，则选中新建混合虚拟表选项
                $("#BottomRightText").text("新建存储过程虚拟表");
                boolIsSave = false;
                var _dataSourceName = $(t).find('a').first().text();
                Agi.DCManager.DCGetConnDByID(_dataSourceName, function (result) {
                    if (result.result == "true") {
                        ShowAllDSPro(result.dataSourceName, result.dataBaseType);
                    }
                });

            }
        }
    });


    $(".RightDS").contextMenu('dsopp', {
        bindings: {
            //数据源编辑方法
            'dsedit': function (t) {
                IsNewOrUpdataData = "update";
                EditDataSourceOP($(t).find('a').first().text());
                boolIsSave = false;
            },
            //测试连接方法
            'testlink': function (t) {
                DCMangeTest($(t).find('a').first().text());
            },
            //删除数据源方法
            'dsdelete': function (t) {
                //20130626 markeluo 修改 删除提示
                var dataSourceName = $(t).find('a').first().text();
//                var content = "确定删除数据源" + dataSourceName + "?</br>(注意：数据源中的虚拟表和DataSets同时将都被删除)";
//
//                AgiCommonDialogBox.Confirm(content, null, function (result) {
//                    if (result) {
//                        DCMangeDelete(dataSourceName,function(){
//                            //添加datasets
//                            AddAllDatasets();//20121227 10:25 倪飘 连带删除前台刷新
//                            //更新组态环境页面的dataset
//                            menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
//                            GobakFramePage();//20121227 17:00 倪飘 删除实时数据源后，右侧面板恢复默认内容
//                        });
//                    }
//                });

                var SrcObj={
                    "deleteenum":"1",
                    "datasource":dataSourceName,
                    "vtable":"",
                    "dataset":""
                }
                var content = "确定删除 " + dataSourceName + "?";
                var detailcontent="";
                Agi.PageSourceDelTipManager.DelSource(SrcObj,function(result){
                    if(result.result=="true"){
                        content=dataSourceName + "被"+result.bzvtablecount+"个标准虚拟表、"+result.fhvtablecount+"个混合虚拟表、"+
                            result.datasetcount+"个dataset、"+result.pagecount+"个页面 使用，您确定继续删除此资源?";
                        detailcontent=Agi.PageSourceDelTipManager.TipsMerg(result);
                    }else{
                        content="获取" + dataSourceName + "的引用关系失败，您确定继续删除?";
                    }
                    AgiCommonDialogBox.ConfirmDetail(content, null,detailcontent,function(flag) {
                        if (flag) {
                            DCMangeDelete(dataSourceName,function(){
                                //添加datasets
                                AddAllDatasets();//20121227 10:25 倪飘 连带删除前台刷新
                                //更新组态环境页面的dataset
                                menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
                                GobakFramePage();//20121227 17:00 倪飘 删除实时数据源后，右侧面板恢复默认内容
                            });
                        } else {
                            return;
                        }
                    });
                });

                //if(confirm("确定删除数据源"+dataSourceName+"?")){
                //DCMangeDelete(dataSourceName);
                ////添加datasets
                //AddAllDatasets();//20121227 10:25 倪飘 连带删除前台刷新
                //GobakFramePage();//20121227 17:00 倪飘 删除实时数据源后，右侧面板恢复默认内容
                //}
            }
        }
    });
    $(".tables").contextMenu('listtable', {
        bindings: {
            //表清单
            'tlist': function (t) {
                $("#BottomRightText").text("表清单");
                ShowAllListT($(t).parent().parent().find('a').first().text(), $(t).find('a').first().text())
            }
        }
    });

    $(".views").contextMenu('listview', {
        bindings: {
            //视图清单
            'vlist': function (t) {
                //              $("#BottomRightText").text("");
                $("#BottomRightText").text("视图清单");
                ShowAllListT($(t).parent().parent().find('a').first().text(), $(t).find('a').first().text());
            }
        }
    });
    $(".procedures").contextMenu('listproc', {
        bindings: {
            //存储过程清单
            'plist': function (t) {
                //              $("#BottomRightText").text("");
                $("#BottomRightText").text("存储过程清单");
                ShowAllListT($(t).parent().parent().find('a').first().text(), $(t).find('a').first().text());
            }
        },
        //20130125 倪飘 解决数据源-关系数据源-右键某个存储过程，不应该显示”存储过程清单“菜单问题
        onShowMenu: function(e,menu) {
        if ($(e.target).attr('classp') == 'pdes') 
        {
            $(menu).find('ul').css('display','none');
        }
          return menu;
       
      }
    });


    //新建datasets
    $(".MyDataSets").contextMenu('ANDS', {
        bindings: {
            'adddas': function (t) {
                ShowMainFramePage();
                HideAllMainPageWin();
                dialogs._PopupSelectDataSource.dialog('open');
                DSDCShow();
            },
            'addNewGrpFolder':function(t){//20130621 10:37 markeluo 新增,DataSets文件夹新增
                AddDataSetsGroup(null,function(data){
                    var  NodeInfo={perid:"root"};
                    LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2,function(){
                        //2014-02-20   COKE
                        CreateNewNode();//添加组别重新获取组别名称;
                    });

                });
            }
        }
    });

    $(".RightDS").click(function () {
        /// <summary>给所有数据源添加点击事件，点击加载Tables/Views/Procedures</summary>
        var dataSourceName = $(this).find('a').first().text();
        Agi.DCManager.DCGetNamesByID(dataSourceName, function (result) {
            AddLeftMenuDetails(result);
        });
    });
    $(".RightVT").click(function () {
        /// <summary>给所有虚拟表数据源添加点击事件，点击加载虚拟表</summary>
        var dataSourceName = $(this).find('a').first().text();
        Agi.VTManager.VTGetVirtualTableByDS(dataSourceName, function (result) {
            AddVTMenuDetails(result);
            Agi.VTManager.SCVTGetScMethodInfoEx(dataSourceName, function (_result) {
                BindSCVTData(_result);
                Agi.VTManager.SP_GetSptable(dataSourceName, function (_result) {
                    BindProVT(_result);
                });
            });
        });

    });
    //新建实时数据源
    $(".MyRealTimeDataS").contextMenu('RTDBNew', {
        bindings: {
            'newrtdb': function (t) {
                $("#BottomRightText").text("新建实时数据源");
                boolIsSave = false;
                AddRTDBPanel();
            }
        }
    });
    //图片资源上传
    $(".imgResourceManage").contextMenu('ImgRManage', {
        bindings: {
            //新建虚拟表
            'uploadRM': function (t) {
                //$("#BottomRightText").text("图片资源");
                //20130427 倪飘 解决bug，资源图片上传，在编辑其他页面时，右键'图片资源'，点击'上传'，弹出上传窗口，上传窗口后应返回主页，不应显示上一编辑页面
                ShowMainFramePage();
                popupDiv('pop_div');
            },
            'previewRM': function (t) {
                $("#BottomRightText").text("图片资源");
                Agi.ResourcesManager.ReGetAllImages(bindImageResourceForBrowser);
            }
        }
    });
    //"图片资源"单击事件
    $("#imgResourceManage").click(function () {
        Agi.ResourcesManager.ReGetAllImages(function (result) {
            AddImageResourceImageList(result);
        });
    });
    //       $(".MyGroup").contextMenu('GroupNew', {
    //        bindings:{
    //            'newgroup1':function (t) {
    //                AddGroupanel();
    //                AddAllRTDBToSelect($(t).find('a').first().parent().attr("id"));
    //            }
    //        }
    //    });
}


//全局变量 保存所有的dataset的值
var AllDS = "";

function AddAllDatasets() {
    $("#DatasetsManage").html("");
    var leftfirstdslist = "";

    //获取所有的DataSet信息
//    Agi.DatasetsManager.DSSGetAllDataset(function (result) {
//        AllDS = result.Data;
//        /*罗万里 20120911 添加-----------------开始*/
//        if (Agi.WebServiceConfig.Type === "JAVA") {
//            AllDS = {
//                DataSets: {
//                    DataSet: []
//                }
//            };
//            $.each(result.Data, function (i, val) {
//                AllDS.DataSets.DataSet.push(val.data.DataSet);
//            });
//        }
//        /*--------------------------------------结束*/
//
//        if (AllDS != null) {
//            try {
//                if (isArray(AllDS.DataSets.DataSet)) {
//                    //如果返回的是多个DataSe（是数组），则循环每一个DataSet，获取需要的数据
//                    $.each(AllDS.DataSets.DataSet, function (i, val) {
//                        if (AllDS.DataSets.DataSet[i].Parent == "root") {
//                            leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet[i].ID + "'  class='MyDataSetss'><a title='" + AllDS.DataSets.DataSet[i].ID + "'><span><img src='Img/LeftIcon/datasetss.png'/></span>" + AllDS.DataSets.DataSet[i].ID + "</a><ul class='Sub2'></ul></li>";
//                        }
//                    });
//                }
//                else {
//                    //如果返回的是单个DataSet，则直接获取其ID
//                    if (AllDS.DataSets.DataSet.Parent == "root") {
//                        leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet.ID + "'  class='MyDataSetss'><a  title='" + AllDS.DataSets.DataSet.ID + "'><span><img src='Img/LeftIcon/datasetss.png'/></span>" + AllDS.DataSets.DataSet.ID + "</a><ul class='Sub2'></ul></li>";
//
//					}
//                }
//                //绑定数据到下拉菜单
//                $("#DatasetsManage").html(leftfirstdslist);
//                //隐藏进度条
//                $('#progressbar1').hide();
//            }
//            catch (e) {
//
//            }
//        }
//
//
//        //关于datasets的右键菜单
//        $(".MyDataSetss").contextMenu('OPDas', {
//            bindings: {
//                'adddas': function (t) {
//                    AddDataSets($(t).find('a').first().text());
//                    //alert($(t).find('a').first().text());
//                },
//                //编辑dataset
//                'eddas': function (t) {
//                    EditDataSets($(t).find('a').first().text());
//                    //alert($(t).find('a').first().text());
//                    boolIsSave = false;
//                },
//                //删除dataset
//                'dedas': function (t) {
//
//                    var content = "确定删除Dataset：" + $(t).find('a').first().text() + "?";
//
//                    AgiCommonDialogBox.Confirm(content, null, function (flag) {
//
//                        if (flag) {
//                            DelDataset($(t).find('a').first().text());
//                        } else {
//                            return;
//                        }
//                    });
//                }
//            }
//        });
//
//    });

    //获取所有DataSet 分组信息 20130618 15:03 markeluo 新增
    var  NodeInfo={perid:"root"};
    Agi.DatasetsManager.DSAllDataSet_SG(NodeInfo,function(result){
        AllDS = result.Data;
        /*罗万里 20120911 添加-----------------开始*/
        if (Agi.WebServiceConfig.Type === "JAVA") {
            AllDS = {
                DataSets: {
                    DataSet:[],
                    groups:[]
                }
            };
//            $.each(result.Data, function (i, val) {
//                AllDS.DataSets.DataSet.push(val.data.DataSet);
//            });
//            AllDS.DataSets.DataSet=result.Data.DataSet
//            AllDS.DataSets.groups=result.Data.groups;

            //20130813 markeluo 没有任何DataSet 时处理错误
            if(result.Data!=null){
                AllDS.DataSets.DataSet=result.Data.DataSet;
                AllDS.DataSets.groups=result.Data.groups;
            }
        }
        /*--------------------------------------结束*/

        if (AllDS != null) {
            try {
                if(AllDS.DataSets.DataSet!=null){
                    if (isArray(AllDS.DataSets.DataSet)) {
                        //如果返回的是多个DataSe（是数组），则循环每一个DataSet，获取需要的数据

                        //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                        var changestateimg="Img/LeftIcon/datasetss.png";
                        $.each(AllDS.DataSets.DataSet, function (i, val) {
                            if (AllDS.DataSets.DataSet[i].Parent == "root") {
                                //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                                if(AllDS.DataSets.DataSet[i].changestate!=null && AllDS.DataSets.DataSet[i].changestate=="1"){
                                    changestateimg="Img/LeftIcon/tables_Changed.png";
                                }else{
                                    changestateimg="Img/LeftIcon/datasetss.png";
                                }
                                if(AllDS.DataSets.DataSet[i].ID.replace(/[^\x00-\xff]/g,'**').length>40)
                                {
                                leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet[i].ID + "'  class='MyDataSetss'><a title='" +
                                    AllDS.DataSets.DataSet[i].ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet[i].ID.substr(0,19)+"..." + "</a><ul class='Sub2'></ul></li>";
                                }
                                else
                                {
                                 leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet[i].ID + "'  class='MyDataSetss'><a title='" +
                                    AllDS.DataSets.DataSet[i].ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet[i].ID + "</a><ul class='Sub2'></ul></li>";
                                }
                            }
                        });
                    }
                    else {
                        //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                        var changestateimg="Img/LeftIcon/datasetss.png";
                        //如果返回的是单个DataSet，则直接获取其ID
                        if (AllDS.DataSets.DataSet.Parent == "root") {
                            //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                            if(AllDS.DataSets.DataSet[i].changestate!=null && AllDS.DataSets.DataSet[i].changestate=="1"){
                                changestateimg="Img/LeftIcon/tables_Changed.png";
                            }else{
                                changestateimg="Img/LeftIcon/datasetss.png";
                            }
                            if(AllDS.DataSets.DataSet.ID.replace(/[^\x00-\xff]/g,'**').length>40)
                            {
                                leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet.ID + "'  class='MyDataSetss'><a  title='" +
                                AllDS.DataSets.DataSet.ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet.ID.substr(0,19)+"..." + "</a><ul class='Sub2'></ul></li>";
                            }
                            else
                            {
                               leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet.ID + "'  class='MyDataSetss'><a  title='" +
                                AllDS.DataSets.DataSet.ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet.ID+ "</a><ul class='Sub2'></ul></li>";
                            }

                        }
                    }
                }
                if(AllDS.DataSets.groups!=null){
                    if (isArray(AllDS.DataSets.groups)) {
                        //如果返回的是多个group（是数组），则循环每一个group，获取需要的数据
                        $.each(AllDS.DataSets.groups, function (i, val) {
                            if(AllDS.DataSets.groups[i].ID.replace(/[^\x00-\xff]/g,'**').length>40)
                            {
                            leftfirstdslist += "<li id='" + AllDS.DataSets.groups[i].path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='2'><a title='" + AllDS.DataSets.groups[i].ID.substr(0,19)+"..." + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups[i].ID + "</a><ul class='Sub2'></ul></li>";
                            }
                            else
                            {
                            leftfirstdslist += "<li id='" + AllDS.DataSets.groups[i].path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='2'><a title='" + AllDS.DataSets.groups[i].ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups[i].ID + "</a><ul class='Sub2'></ul></li>";
                            }
                        });
                    }
                    else {
                        //如果返回的是单个group，则直接获取其ID
                        if(AllDS.DataSets.groups.ID.replace(/[^\x00-\xff]/g,'**').length>40)
                        {
                        leftfirstdslist += "<li id='" + AllDS.DataSets.groups.path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='2'><a  title='" + AllDS.DataSets.groups.ID.substr(0,19)+"..." + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups.ID + "</a><ul class='Sub2'></ul></li>";
                        }
                        else
                        {
                        leftfirstdslist += "<li id='" + AllDS.DataSets.groups.path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='2'><a  title='" + AllDS.DataSets.groups.ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups.ID + "</a><ul class='Sub2'></ul></li>";
                        }
                       
                    }
                }
                //绑定数据到下拉菜单
                $("#DatasetsManage").html(leftfirstdslist);
                BindDataSetsGroupClickEvent($("#DatasetsManage").find(".MyDataSetGroup"));
                //绑定可拖拽
                Agi.MenuManagement.BindDataSetsGroupDrag($("#DatasetsManage").find(".MyDataSetss,.MyDataSetGroup"),$("#DatasetsManage").find(".MyDataSetGroup"));
                //隐藏进度条
                $('#progressbar1').hide();
            }
            catch (e) {

            }
        }


        //关于datasets的右键菜单
        $(".MyDataSetss").contextMenu('OPDas', {
            bindings: {
                'adddas': function (t) {
                    //AddDataSets($(t).find('a').first().text());
                    AddDataSets($(t).find("a").attr("title"));
                    //alert($(t).find('a').first().text());
                },
                //编辑dataset
                'eddas': function (t) {
                    //EditDataSets($(t).find('a').first().text());
                    EditDataSets($(t).find("a").attr("title"));
                    //alert($(t).find('a').first().text());
                    boolIsSave = false;
                },
                //删除dataset
                'dedas': function (t) {
                 //20130626 markeluo 修改 删除提示
//
//                    var content = "确定删除Dataset：" + $(t).find('a').first().text() + "?";
//
//                    AgiCommonDialogBox.Confirm(content, null, function (flag) {
//
//                        if (flag) {
//                            DelDataset($(t).find('a').first().text());
//                        } else {
//                            return;
//                        }
//                    });

                   // var DataSetID=$(t).find('a').first().text();
                   var DataSetID=$(t).find("a").attr("title");
                    var SrcObj={
                        "deleteenum":"4",
                        "datasource":"",
                        "vtable":"",
                        "dataset":DataSetID
                    }
                    var content = "确定删除Dataset：" + DataSetID + "?";
                    var detailcontent="";
                    Agi.PageSourceDelTipManager.DelSource(SrcObj,function(result){
                        if(result.result=="true"){
                            content=DataSetID + "被"+result.pagecount+"个页面使用，您确定继续删除此资源?";
                            detailcontent=Agi.PageSourceDelTipManager.TipsMerg(result);
                        }else{
                            content="获取" + DataSetID + "的引用关系失败，您确定继续删除?";
                        }
                        AgiCommonDialogBox.ConfirmDetail(content, null,detailcontent, function (flag) {
                            if (flag) {
                                DelDataset(DataSetID);
                            } else {
                                return;
                            }
                        });
                    });

                },
                'movedas':function(t){
                    MovesGroupData(t);
                }//2014-03-03  coke 移动组别
            }
        });
        //关于datasets的分组右键菜单
        $(".MyDataSetGroup").contextMenu('DSGroupFolder',{
            bindings:{
                'addGrpFolder':function(t){
                    AddDataSetsGroup({NodeName:$(t).find('a').attr("title"),Parent:$(t)[0].id},function(ev){
                        if($(t).parent().parent()[0].id==""){
                            var  NodeInfo={perid:"root"};
                            LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                        }else{
                            var  NodeInfo={perid:t.id};
                            LoadDataSetsAndGrpList(NodeInfo,t,(parseInt($(t).attr("LayerIndex"))+1));
                        }

                    });
                },
                'DelGrpFolder':function(t){
                    DelDataSetsGroup({NodeName:$(t).find('a').attr("title"),NodeKey:$(t)[0].id},function(ev){
                        if($(t).parent().parent()[0].id==""){
                            var  NodeInfo={perid:"root"};
                            LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                        }else{
                            var  NodeInfo={perid:$(t).parent().parent()[0].id};
                            LoadDataSetsAndGrpList(NodeInfo,$(t).parent().parent(),(parseInt($(t).parent().parent().attr("LayerIndex"))+1));
                        }
                    });
                },
                'EditGrpFolder':function(t){
                    EditDataSetsGroup({NodeName:$(t).find('a').attr("title"),NodeKey:$(t)[0].id,Parent:$($(t)[0]).parent().parent()[0].id},function(ev){
                        if($(t).parent().parent()[0].id==""){
                            var  NodeInfo={perid:"root"};
                            LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                        }else{
                            var  NodeInfo={perid:$(t).parent().parent()[0].id};
                            LoadDataSetsAndGrpList(NodeInfo,$(t).parent().parent(),(parseInt($(t).parent().parent().attr("LayerIndex"))+1));
                        }
                    });
                }
            }
        });
    });
}

//datasets点击加载下一级菜单
$(".MyDataSetss").live('click', function () {
    //获取当前点击的DataSet的ID
    var datasetName = $(this).find('a').first().text();
    var leftseconddslist = "";
    //根据ID查找单个DataSet数据信息
    Agi.DatasetsManager.DSSGetDatasetByID(datasetName, function (result) {
        var dataset = result.Data;
        if (dataset != null) {
            if (dataset.DataSets.DataSet.Parent == "datasetName") {
                $.each(dataset.DataSets.DataSet, function (i, val) {
                    leftseconddslist += "<li class=''><a title='" + val + "'>" + val + "</a></li>";
                });
                //绑定数据
                $("#" + datasetName + " .Sub2").html(leftseconddslist);
            }
        }
    });
});

//2014-03-03 coke
function MovesGroupData(t)
{
    new Agi.Msg.OpenParasSettingWindow().Masklayer();
    $("#BtnOkDiv").off().bind("click",function(){
        var parentID=$("#GroupNameID").val();
        if(parentID=="0")
        {
            $('#SettingMasklayer').modal('hide');
            //没有选择移动组别id
            AgiCommonDialogBox.Alert("您没有选择组别！", null);
            return;
        }
        Agi.DatasetsManager.DSNodeMove({DataSetsKey:$(t).find("a").attr("title"),ParentKey:parentID},function(result){
            if(result.result=="true"){
                AddAllDatasets();//刷新主界面的DataSet列表
                menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));//刷新新建页面左侧的DataSet列表
                $('#SettingMasklayer').modal('hide');
                AgiCommonDialogBox.Alert("移动成功！", null);
            }else{
                $('#SettingMasklayer').modal('hide');
                AgiCommonDialogBox.Alert(result.message, null);
            }
        });
    });
    $("#ContentDiv").html('<div style="font-size: 15px; float: left; width: 80px; font-weight: bold;"><p style="margin-top: ' +
        '104px;text-align: center;">组别名称：</p></div><div id="MovesDataSetGroup" ' +
        'class="jstree jstree-1 jstree-default jstree-focused jstree-0" style="height:228px; width:356px; text-align:left;overflow-y: scroll;float: ' +
        'left;"></div>');
    RequestMovePageData();
}
/*2014-03-03  coke
 * 获取组别名称
 *
 * */
function RequestMovePageData(dataContent,BackFunction)
{
    var NewNodeInfo = { perid: "root" };
    if(dataContent==undefined)
    {
        $("#MovesDataSetGroup").empty();
    }else
    {
        NewNodeInfo.perid=dataContent.rslt.obj.attr("ID")
    }

    Agi.DatasetsManager.DSAllDataSet_SG(NewNodeInfo,function (result) {
        if (result.result!="true") {
            BackFunction([]); //无效返回值
            return;
        }
        if(dataContent==undefined){
            //产生树形节点
            //第一次加载的时候执行
            CreateMoveTreeNode(result.Data.groups);
        }else{
            //点击树形节点执行此代码
            var data=result.Data.groups;
            var position = 'inside';
            var parent = $('#MovesDataSetGroup').jstree('get_selected');
            for(var s= 0,len=data.length;s<len;s++)
            {
                var em={
                    "data": {title:data[s].ID },
                    'attr': {title:data[s].ID ,ID:data[s].path},
                    "metadata": { id:data[s].path, type: 'commonLib' }
                }
                dataContent.inst.create_node(parent, position, em, false, false);//添加节点
            }
            dataContent.inst.open_node();//打开节点
            BackFunction(data); //返回实体下次使用
        }

    });

}
/*2014-03-03  coke
 * 产生树形节点
 *
 * */
function CreateMoveTreeNode(dataList)
{
    var dataIn = [];
    var data=dataList;
    for(var s= 0,len=data.length;s<len;s++)
    {
        var em={
            "data": {title:data[s].ID },
            'attr': {title:data[s].ID,ID:data[s].path},
            "metadata": { id:data[s].path, type: 'commonLib' },
            children: []
        }
        dataIn.push(em);
    }
    if(dataIn.length<0){return;}
    var temp="";
    $("#MovesDataSetGroup") .jstree({
        json_data: {data: dataIn },
        plugins: ["themes", "json_data", "ui"]
    }).bind("select_node.jstree",function (event, data1) {
            //点击获取组别
            $("#GroupNameID").val(data1.rslt.obj.attr("ID"));
            //删除节点
            data1.rslt.obj.children(2).eq(2).remove();
            if(temp!=data1.rslt.obj.attr("title"))
            {
                temp=data1.rslt.obj.attr("title");
                RequestMovePageData(data1,function(ev){
                    data=ev;
                });

            }else{
                var position = 'inside';
                var parent = $('#MovesDataSetGroup').jstree('get_selected');
                for(var s= 0,len=data.length;s<len;s++)
                {
                    var em={
                        "data": {title:data[s].ID },
                        'attr': {title:data[s].ID ,ID:data[s].path},
                        "metadata": { id:data[s].path, type: 'commonLib' }
                    }
                    data1.inst.create_node(parent, position, em, false, false);
                }
                data1.inst.open_node();
            }

        }).delegate("a", "click", function (event, data) {
            event.preventDefault();
        }).bind("loaded.jstree",function(e,data){ })
}
//删除dataset
function DelDataset(setid) {
    Agi.DatasetsManager.DSSDelete(setid, function (result) {
        if (result.result) {
            AddAllDatasets();
            //更新组态环境页面的dataset
             menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
            GobakFramePage();//20121227 11:31 markeluo 删除DataSet 后，右侧面板恢复默认内容
        }
        else {
            AgiCommonDialogBox.Alert(result.message, null);
        }
    });
}

//判断是否是数组
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

//实时数据源操作块========================================================
function AddLeftRTDataSource() {
    $("#RTDataSourceManage").html("");
    var LeftRTDSList = "";
    Agi.RTDSManager.RtdbLoad('', function (result) {
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            //如果返回的是多个RTDS（是数组），则循环每一个RTDS，获取需要的数据
            $.each(rtdsdata, function (i, val) {
                LeftRTDSList += "<li id='" + rtdsdata[i].RtdbID + "'  class='MyRTDBs'><a title='" + rtdsdata[i].RtdbID + "' ><span><img src='Img/LeftIcon/datasetss.png'/></span>" + rtdsdata[i].RtdbID + "</a><ul class='Sub2'></ul></li>";
            });

            //绑定数据到下拉菜单
            $("#RTDataSourceManage").html(LeftRTDSList);
            //关于RTDB的右键菜单

            $(".MyRTDBs").contextMenu('RTDBEdit', {
                bindings: {
                    //点位查询
                    'pointfind': function (t) {
                        //记录实时数据源名字
                        var rtdbid = $(t).find('a').first().text();
                        AddNwePointInformation(rtdbid);
                        $("#BottomRightText").text("点位管理");
                        boolIsSave = false;
                    },
                    //编辑rtdb
                    'editrtdb': function (t) {
                        UpdateRTDBPanel();
                        SelectSingelRTDB($(t).find('a').first().text());
                        boolIsSave = false;
                    },
                    //rtdb测试连接
                    'testrtdb': function (t) {
                        TestRTDBLink($(t).find('a').first().text());
                    },
                    //删除rtdb
                    'deletertdb': function (t) {

                        var message = "确定删除实时数据源：" + $(t).find('a').first().text() + "?";

                        AgiCommonDialogBox.Confirm(message, null, function (result) { //20130104 19:47 张鹏 统一弹出框风格
                            if (result) {
                                DeleteRTDB($(t).find('a').first().text());
                                GobakFramePage();//20121227 17:00 倪飘 删除实时数据源 后，右侧面板恢复默认内容
                            }
                            else {
                                return;
                            }
                        });

                    }
                }
            });
        }
    });
}

//删除实时数据源
function DeleteRTDB(rtdbid) {
    Agi.RTDSManager.RtdbDelete(rtdbid, function (result) {
        if (result.result == "true") {
            AddLeftRTDataSource();
            //更新组态环境页面的实时数据源
            menuManagement.loadRealTimeDC($('#RealTimeListContaner'));
            AddAllGroup();
        } else {
            AgiCommonDialogBox.Alert(result.message, null);
        }
    });
}

//查找单个实时数据源
function SelectSingelRTDB(rtdbid) {
    Agi.RTDSManager.RtdbLoad(rtdbid, function (result) {
        if (result.result == "true") {
            var rtdbdata = result.rtdbData;
            $("#RTDBName").val(rtdbdata[0].RtdbID);
            $("#RTDBType").val(rtdbdata[0].RtdbType);

            //实时数据源类型是INSQL的时候，更改布局
            if (rtdbdata[0].RtdbType == "INSQL") {
                $("#InSqlDiv").css("display", "block");
                $("#NewRTDBPage").height(450);
                $("#RTDBIP").val(rtdbdata[0].ServerIP);
                var ISQLStr = rtdbdata[0].Port.split('#');
                $("#RTDBPort").val(ISQLStr[0]);
                $("#Account").val(ISQLStr[1]);
                $("#password").val(ISQLStr[2]);
                $("#dbname").val(ISQLStr[3]);
            }
            else {
                $("#RTDBIP").val(rtdbdata[0].ServerIP);
                $("#RTDBPort").val(rtdbdata[0].Port);
            }


            $("#RTDBName").attr("readonly", true)
             $("#RTDBType").attr('disabled', true);
        }
    });
}

//测试实时数据源连接
function TestRTDBLink(rtdbid) {
    Agi.RTDSManager.RtdbConnTest(rtdbid, function (result) {
        if (result.result == "true") {
            AgiCommonDialogBox.Alert("连接成功!");
        } else {
            AgiCommonDialogBox.Alert(result.message);
        }
    });
}

//添加实时数据源面板显示

//实时数据源类型是INSQL的时候，更改布局
$("#RTDBType").live('change', function () {
    if ($(this).val() == "INSQL") {
        $("#InSqlDiv").css("display", "block");
        $("#NewRTDBPage").height(450);
    } else {
        $("#InSqlDiv").css("display", "none");
        $("#NewRTDBPage").height(380);
    }
})


//保存新建实时数据源
$("#NewRTDBSaveBtn").live('click', function () {
//20130114 倪飘 解决建立实时数据源时，名称为空格，其他信息正常输入，点击保存，应提示'实时数据源名称不能为空！'问题
    if ($("#RTDBName").val().trim() == "") {
        AgiCommonDialogBox.Alert("实时数据源名称不能为空!");
        return;
    }

    if ($("#RTDBType").val() == "请选择") {
        AgiCommonDialogBox.Alert("请选择实时数据源类型!");
        return;
    }
    //20130126 倪飘 IP地址的正确性判断
    if ($("#RTDBIP").val() == "" || !f_check_IP($("#RTDBIP").val())) {
        AgiCommonDialogBox.Alert("请输入正确的IP地址!");
        return;
    }

    if ($("#RTDBPort").val() == "") {
        AgiCommonDialogBox.Alert("端口不能为空!");
        return;
    }

    var ID = $("#RTDBName").val();
    var rtdbtype = $("#RTDBType").val();
    //实时数据源类型是INSQL的时候，所需验证的内容也做区别
    if (rtdbtype == "INSQL") {
        if ($("#Account").val() == "" || $("#password").val() == "" || $("#dbname").val() == "") {
            AgiCommonDialogBox.Alert("请将信息填写完整再进行保存！");
            return;
        }
        var serverIP = $("#RTDBIP").val();
        var Account = $("#Account").val();
        var password = $("#password").val();
        var dbname = $("#dbname").val();
        var port = $("#RTDBPort").val();
        port = port + "#" + Account + "#" + password + "#" + dbname;
    }
    else {
        if ($("#RTDBIP").val() == "" || !f_check_IP($("#RTDBIP").val())) {
            AgiCommonDialogBox.Alert("请输入正确的IP地址！");
            return;
        }

        if ($("#RTDBPort").val() == "") {
            AgiCommonDialogBox.Alert("实时数据服务端口不能为空！");
            return;
        }
        var serverIP = $("#RTDBIP").val();
        var port = $("#RTDBPort").val();

        if (!IsNum(port)) {
            AgiCommonDialogBox.Alert("请输入正确的端口！");
            $("#RTDBPort").val("");
            $("#RTDBPort").focus();
            return;
        }
    }

    Agi.RTDSManager.RtdbSave(ID, serverIP, port, rtdbtype, function (result) {
        if (result.result == "true") {
            AgiCommonDialogBox.Alert("保存成功！");
            //20130114 倪飘 解决新建实时和关系数据源输入信息并点击保存以后，数据库类型还能进行修改，预期为不可修改。问题
             $("#RTDBType").attr('disabled', true);
            AddLeftRTDataSource();
            //更新组态环境页面的实时数据源
            menuManagement.loadRealTimeDC($('#RealTimeListContaner'));
            AddAllGroup();
            boolIsSave = true;
        }
        else {
            AgiCommonDialogBox.Alert("当前实时数据源已存在，您可以选择修改已存在实时数据源！");
        }

    });
});
//20130126 倪飘 IP地址的正确性判断
//判断输入的是否是正确的IP地址
function f_check_IP(IPAdd){  var ip =IPAdd;
   var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式   
   if(re.test(ip))   
   {   
       if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256) 
       return true;   
   }   
   return false;    
}


//保存修改实时数据源
$("#EditRTDBSaveBtn").live('click', function () {
    if ($("#RTDBName").val() == "") {
        AgiCommonDialogBox.Alert("实时数据源名称不能为空！");
        return;
    }

    if ($("#RTDBType").val() == "请选择") {
        AgiCommonDialogBox.Alert("请选择实时数据源类型！");
        return;
    }

    var ID = $("#RTDBName").val();
    var rtdbtype = $("#RTDBType").val();

    //实时数据源类型是INSQL的时候，所需验证的内容也做区别
    if (rtdbtype == "INSQL") {
        if ($("#Account").val() == "" || $("#password").val() == "" || $("#dbname").val() == "" || $("#RTDBIP").val() == "") {
            AgiCommonDialogBox.Alert("请将信息填写完整再进行保存！");
            return;
        }
        var serverIP = $("#RTDBIP").val();
        var Account = $("#Account").val();
        var password = $("#password").val();
        var dbname = $("#dbname").val();
        var port = $("#RTDBPort").val();
        port = port + "#" + Account + "#" + password + "#" + dbname;
    }
    else {
        if ($("#RTDBIP").val() == ""  || !f_check_IP($("#RTDBIP").val())) {
            AgiCommonDialogBox.Alert("请输入正确的IP地址！");
            return;
        }


        if ($("#RTDBPort").val() == "") {
            AgiCommonDialogBox.Alert("实时数据服务端口不能为空！");
            return;
        }
        var serverIP = $("#RTDBIP").val();
        var port = $("#RTDBPort").val();

        if (!IsNum(port)) {
            AgiCommonDialogBox.Alert("请输入正确的端口！");
            $("#RTDBPort").val("");
            $("#RTDBPort").focus();
            return;
        }
    }

    Agi.RTDSManager.RtdbUpdate(ID, serverIP, port, rtdbtype, function (result) {
        if (result.result == "true") {
            AgiCommonDialogBox.Alert("修改成功！");
        }
        else {
            AgiCommonDialogBox.Alert("修改失败！");
        }
        boolIsSave = true;
    });
});

//判断输入的字符串是不是数字
function IsNum(s) {
    S = s.trim();
    if (s != null) {
        var r, re;
        re = /\d*/i; //\d表示数字,*表示匹配多个数字
        r = s.match(re);
        return (r == s) ? true : false;
    }
    return false;
}

//分组代码块===============================
//存储所有的分组信息
var GlobalGroupInfo;
//显示所有分组信息
function AddAllGroup() {
    $("#GroupManage").html("");
    var LeftGroupList = "";
    Agi.GroupManager.RGLoad('', '0', function (result) {
        var AllGroup = result.GroupName;
        GlobalGroupInfo = AllGroup;
        if (AllGroup != null) {
            $.each(AllGroup, function (i, val) {
                LeftGroupList += "<li id='" + AllGroup[i].GroupID + "'  class='MyGroups'><a title='" + AllGroup[i].GroupName + "'><span><img src='Img/LeftIcon/datasetss.png'/></span>" + AllGroup[i].GroupName + "</a><ul class='Sub2' id='GroupId" + AllGroup[i].GroupID + "'></ul></li>";
            });
            $("#GroupManage").html(LeftGroupList);
        }

        $(".MyGroups").contextMenu('GroupEdit', {
            bindings: {
                //新建group
                'newgroup': function (t) {
                    AddGroupanel();
                    AddAllRTDBToSelect($(t).find('a').first().parent().attr("id"));
                },
                //group编辑
                'editgroup': function (t) {
                    UpdateGroupPanel();
                    AddGroupInfo($(t).find('a').first().parent().attr("id"), $(t).find('a').first().text(), $(t).find('a').first().parent().parent().attr("id"));
                },
                //删除group
                'deletegroup': function (t) {
                    var content = "确定删除分组：" + $(t).find('a').first().text() + "?";

                    AgiCommonDialogBox.Confirm(content, null, function (flag) {

                        if (flag) {
                            GroupDelete($(t).find('a').first().parent().attr("id"));
                        }
                        else {
                            return;
                        }
                    });
                }
            }
        });
    });
}


//记录当前节点的RTDBID
var CurrentRTDBID = "";

//点击分组显示下级菜单
$("#GroupManage a").live('click', function () {

    var currgroupid = $(this).parent().attr("id");
    ;
    var SecondLevelList = "";

    //当前rtdbid
    var currnetrtdbid;
    $.each(GlobalGroupInfo, function (i, val) {
        if (GlobalGroupInfo[i].GroupID == currgroupid) {
            currnetrtdbid = GlobalGroupInfo[i].RtdbID;
        }
    });

    var needRTDBID;
    if (currnetrtdbid == null) {
        needRTDBID = CurrentRTDBID;
    }
    else {
        needRTDBID = currnetrtdbid;
    }

    //计算显示缩进
    var parentclassname = $(this).parent().parent().first().attr('class');
    var parentindent = $(this).parent().parent().first().find('li a').css('text-indent');
    var thisindent = 0;
    if (parentclassname == "Sub3" || parentclassname == "Sub2") {
        thisindent = parseInt(parentindent.substring(0, parentindent.indexOf('p'))) + 10;
    }

    Agi.GroupManager.RGLoad(needRTDBID, currgroupid, function (result) {
        var SecondLevel = result.GroupName;
        //记录下rtdbid
        CurrentRTDBID = needRTDBID;
        if (SecondLevel != null) {
            $.each(SecondLevel, function (i, val) {
                SecondLevelList += "<li class='MyGroups" + currgroupid + "' id='" + SecondLevel[i].GroupID + "'><a title='" + SecondLevel[i].GroupName + "'><span><img src='Img/LeftIcon/tables.png'/></span>" + SecondLevel[i].GroupName + "</a><ul id='GroupId" + SecondLevel[i].GroupID + "' class='Sub3'></ul></li>";
            });
            $("#GroupId" + currgroupid).html(SecondLevelList);
            //设置缩进
            $("#GroupId" + currgroupid).find('li a').css("text-indent", thisindent + "px");
        }

        $(".MyGroups" + currgroupid).contextMenu('GroupEdit', {
            bindings: {
                //新建group
                'newgroup': function (t) {
                    AddGroupanel();
                    AddAllRTDBToSelect($(t).find('a').first().parent().attr("id"));
                },
                //group编辑
                'editgroup': function (t) {
                    UpdateGroupPanel();
                    AddGroupInfo($(t).find('a').first().parent().attr("id"), $(t).find('a').first().text(), $(t).find('a').first().parent().parent().attr("id"));
                },
                //删除group
                'deletegroup': function (t) {
                    var content = "确定删除分组：" + $(t).find('a').first().text() + "?";
                    AgiCommonDialogBox.Confirm(content, null, function (flag) {
                        if (flag) {
                            GroupDelete($(t).find('a').first().parent().attr("id"));
                        }
                        else {
                            return;
                        }
                    });
                }
            }
        });
    });

});


//添加rtdbid到下拉菜单
function AddAllRTDBToSelect(parentid) {
    var ID = "";
    $.each(GlobalGroupInfo, function (i, val) {
        if (GlobalGroupInfo[i].GroupID == parentid) {
            ID = GlobalGroupInfo[i].RtdbID;
        }
    });
    if (ID != "") {
        $("#Grouprtdb").append("<option>" + ID + "</option>");
    }
    else {
        $("#Grouprtdb").append("<option>" + CurrentRTDBID + "</option>");
    }
    $("#GroupParent").val(parentid);
    $("#GroupParent").attr("readonly", true);
    /*释放临时变量*/
    ID=null;
}

//删除分组
function GroupDelete(Groupid) {
    var DelGroup;
    $.each(GlobalGroupInfo, function (i, val) {
        if (GlobalGroupInfo[i].GroupID == Groupid) {
            DelGroup = GlobalGroupInfo[i].RtdbID;
        }
    });
    var needrtdb;
    if (DelGroup == null) {
        needrtdb = CurrentRTDBID;
    }
    else {
        needrtdb = DelGroup;
    }

    Agi.GroupManager.RGDelete(needrtdb, ["\"" + Groupid + "\""], function (result) {
        if (result.result == "true") {
            AddAllGroup();
        } else {
            AgiCommonDialogBox.Alert(result.message, null);
        }
    });
}

//保存分组
$("#NewGroupSaveBtn").live('click', function () {
    var groupData;
    var rtdbid = $("#Grouprtdb").val();
    var GroupName = $("#GroupName").val();
    var ParentID = $("#GroupParent").val();
    var GroupType = "0";

    if (rtdbid == "请选择" || GroupName == "") {
        AgiCommonDialogBox.Alert("请填写完整！", null);
        return;
    }
    groupData = {
        rtdbID: rtdbid,
        GroupName: GroupName,
        ParentID: ParentID,
        GroupType: GroupType
    };

    /*释放临时变量*/
    rtdbid=GroupName=ParentID=GroupType=null;
    Agi.GroupManager.RGSave(groupData, function (result) {
        if (result.result == "true") {
            AddAllGroup();
            AgiCommonDialogBox.Alert(result.message, null);
        }
        else {
            AgiCommonDialogBox.Alert(result.message, null);
        }
    });
});


//填充需要修改的信息
function AddGroupInfo(Groupid, GroupName, GroupParent) {

    var UpdateGroup;
    $.each(GlobalGroupInfo, function (i, val) {
        if (GlobalGroupInfo[i].GroupID == Groupid) {
            UpdateGroup = GlobalGroupInfo[i];
        }
    });

    var needrtdb;
    if (UpdateGroup == null) {
        needrtdb = CurrentRTDBID;
    }
    else {
        needrtdb = UpdateGroup.RtdbID;
    }

    Agi.RTDSManager.RtdbLoad('', function (result) {
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            $.each(rtdsdata, function (i, val) {
                if (rtdsdata[i].RtdbID == needrtdb) {
                    $("#Grouprtdb").append("<option selected='true'>" + rtdsdata[i].RtdbID + "</option>");
                } else {
                    $("#Grouprtdb").append("<option>" + rtdsdata[i].RtdbID + "</option>");
                }
            });
        }
    });


    $("#GroupName").val(GroupName);
    if (UpdateGroup != null) {
        $("#GroupParent").val(UpdateGroup.ParentID);
    }
    else {
        $("#GroupParent").val(GroupParent.substring(7));
    }
    $("#HiddenGroupID").val(Groupid);


    $("#GroupParent").attr("readonly", true)
}
//修改分组信息
$("#EditGroupSaveBtn").live('click', function () {
    var groupData;
    var rtdbid = $("#Grouprtdb").val();
    var GroupName = $("#GroupName").val();
    var ParentID = $("#GroupParent").val();
    var GroupType = "0";
    var GroupID = $("#HiddenGroupID").val();


    if (GroupName == "") {
        AgiCommonDialogBox.Alert("请填写完整！", null);
        return;
    }

    groupData = {
        rtdbID: rtdbid,
        GroupName: GroupName,
        ParentID: ParentID,
        GroupType: GroupType,
        GroupID: GroupID
    };

    /*释放临时变量*/
    rtdbid=GroupName=ParentID=GroupType=GroupID=null;

    Agi.GroupManager.RGUpdate(groupData, function (result) {
        if (result.result == "true") {
            AddAllGroup();
            AgiCommonDialogBox.Alert(result.message, null);
        }
        else {
            AgiCommonDialogBox.Alert(result.message, null);
        }
    });

});


Namespace.register('Agi.Utility');
Agi.Utility.xml2json = function (xml, tab) {
    var X = {
        toObj: function (xml) {
            var o = {};
            if (xml.nodeType == 1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i = 0; i < xml.attributes.length; i++)
                        o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0, cdataChild = 0, hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            }
            else
                AgiCommonDialogBox.Alert("unhandled node type: " + xml.nodeType, null);
            return o;
        },
        toJson: function (o, name, ind) {
            var json = name ? ("\"" + name + "\"") : "";
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++)
                    o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            }
            else if (o == null)
                json += (name && ":") + "null";
            else if (typeof (o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
            }
            else if (typeof (o) == "string")
                json += (name && ":") + "\"" + o.toString() + "\"";
            else
                json += (name && ":") + o.toString();
            return json;
        },
        innerXml: function (node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function (n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        }
                        else
                            s += "/>";
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite: function (e) {
            e.normalize();
            for (var n = e.firstChild; n;) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    }
                    else
                        n = n.nextSibling;
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                }
                else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

Agi.Utility.RequestData = function (entity, callback, option) {
    var self = this;
    self.options = {
        url: WebServiceAddress,
        method: "DSReadData"
    };
    for (name in option) {
        self.options[name] = option[name];
    }

    var jsonData = {
        "datasetID": "TEST",
        "param": [
            { "key": "begindate", "value": "2012-07-08" },
            { "key": "enddate", "value": "2012-07-15" }
        ]
    };
    jsonData.datasetID = entity.Key;
    jsonData.param = [];
    $(entity.Parameters).each(function (i, p) {
        jsonData.param.push({ key: p.Key, value: p.Value });
    });
    if (!entity.Parameters.length) {
        jsonData.param = [];
    }
    var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
    Agi.DAL.ReadData({
        "MethodName": self.options.method,
        "Paras": jsonString, //json字符串
        "CallBackFunction": function (result) {     //回调函数
            if (result.result) {
                var data = result.Data ? result.Data : [];
                if (data != null && data.length > 0) {
                    entity.Columns=[];
                    for (var _param in data[0]) {
                        entity.Columns.push(_param);
                    }
                }
                callback(data);
            } else {
                callback([]);
            }
        }
    });
};
Agi.Utility.RequestData2 = function (entity, callback, option) {
    var self = this;
    self.options = {
        url: WebServiceAddress,
        method: "DSReadData"
    };
    for (name in option) {
        self.options[name] = option[name];
    }

    var jsonData = {
        "datasetID": "TEST",
        "param": [
            { "key": "begindate", "value": "2012-07-08" },
            { "key": "enddate", "value": "2012-07-15" }
        ]
    };
    jsonData.datasetID = entity.Key;
    jsonData.param = [];
    $(entity.Parameters).each(function (i, p) {
        jsonData.param.push({ key: p.Key, value: p.Value });
    });
    if (!entity.Parameters.length) {
        jsonData.param = [];
    }
    var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
    Agi.DAL.ReadData({
        "MethodName": self.options.method,
        "Paras": jsonString, //json字符串
        "CallBackFunction": function (result) {     //回调函数
            if (result.Columns) { } else {
                if (result.Data != null && result.Data.length > 0) {
                    var _Columns = [];
                    for (var _param in result.Data[0]) {
                        _Columns.push(_param);
                    }
                    result = {
                        result: result.result,
                        Data: result.Data,
                        message: result.message,
                        Columns: _Columns
                    }
                }
            }
            callback(result);
        }
    });
};
Agi.Utility.RequestDataByPage = function (entity,page,pagesize,callback, option) {
    var self = this;
    self.options = {
        url: WebServiceAddress,
        method: "DSReadDataByPage"
    };
    for (name in option) {
        self.options[name] = option[name];
    }

    var jsonData = {
        "datasetID": "TEST",
        "param": [
            { "key": "begindate", "value": "2012-07-08" },
            { "key": "enddate", "value": "2012-07-15" }
        ]
    };
    jsonData.datasetID = entity.Key;
    jsonData.pageLimit=pagesize;
    jsonData.pageNum=page;
    jsonData.param = [];
    $(entity.Parameters).each(function (i, p) {
        jsonData.param.push({ key: p.Key, value: p.Value });
    });
    if (!entity.Parameters.length) {
        jsonData.param = [];
    }
    var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
    Agi.DAL.ReadData({
        "MethodName": self.options.method,
        "Paras": jsonString, //json字符串
        "CallBackFunction": function (result) {     //回调函数
            if (result.Columns) { } else {
                if (result.Data != null && result.Data.length > 0) {
                    var _Columns = [];
                    for (var _param in result.Data[0]) {
                        _Columns.push(_param);
                    }
                    result.Columns =_Columns;
                }
            }
            callback(result);
        }
    });
};
Agi.Utility.DialogBox = function(el,options){
    //debugger;
    var dialogHtml = typeof el === 'string' ? $('#'+el) : $(el);
    if(dialogHtml.data('dialog')){
        return dialogHtml;
    }
    //去除bootstrap 模态窗口的一些样式
    dialogHtml.removeClass('modal')
        .find('.modal-header').hide();
    //dialogHtml.find('.modal-footer').removeClass('modal-footer');
    dialogHtml.css({'padding':'0'});
    var option = {
        zIndex: 100000,
        width:'auto',
        height:'auto',
        resizable:false,
        draggable: false,
        autoOpen:false,
        modal:true
    };
    if(options){
        for(var name in options){
            option[name] = options[name];
        }
    }
    option.width = dialogHtml.width();
    dialogHtml.dialog(option);
    dialogHtml.parent().attr('id', dialogHtml.attr('id'));
    return dialogHtml;
};
//判断浏览器版本，调整样式
function DistinguishExplorer() {
    // browser check-----start
    var userAgent = navigator.userAgent, // userAgent
        rMsie = /.*(msie) ([\w.]+).*/, // ie
        rFirefox = /.*(firefox)\/([\w.]+).*/, // firefox
        rOpera = /(opera).+version\/([\w.]+)/, // opera
        rChrome = /.*(chrome)\/([\w.]+).*/, // chrome
        rSafari = /.*version\/([\w.]+).*(safari).*/;// safari

    var ua = userAgent.toLowerCase();

    function uaMatch(ua) {
        var match = rMsie.exec(ua);
        if (match != null) {
            return { browser: match[1] || "", version: match[2] || "0" };
        }
        var match = rFirefox.exec(ua);
        if (match != null) {
            return { browser: match[1] || "", version: match[2] || "0" };
        }
        var match = rOpera.exec(ua);
        if (match != null) {
            return { browser: match[1] || "", version: match[2] || "0" };
        }
        var match = rChrome.exec(ua);
        if (match != null) {
            return { browser: match[1] || "", version: match[2] || "0" };
        }
        var match = rSafari.exec(ua);
        if (match != null) {
            return { browser: match[2] || "", version: match[1] || "0" };
        }
        if (match != null) {
            return { browser: "", version: "0" };
        }
    }

    var browserMatch = uaMatch(userAgent.toLowerCase());
    var expdiv = $("#expdiv");
    if(browserMatch){
        if (browserMatch.browser == "chrome") {
            if (browserMatch.version == "22.0.1229.92") {
                expdiv.addClass("expdiv_higher");
            }
            else {
                expdiv.addClass("expdiv_lower");
            }
        }
        else {
            expdiv.addClass("expdiv_lower");
        }
        // browser check-----end
    }else{
        expdiv.addClass("expdiv_lower");
    }
}
/*配 置 表 达 式*/
$("#ShotaBranch").live('click', function () {
    $('#AlgMapping').draggable();
    $("#AlgMapping").modal({ backdrop: false, keyboard: false, show: true });
});

$("#BaseRadio").live('click', function () {
    if ($(this).attr("checked") == "checked") {
        $("#AlgoritRadio").attr("checked", null);
        /*   $("#exprssionpoID").show();
         $("#AlgoritDIV").hide();*/
    }
});
$("#AlgoritRadio").live('click', function () {
    if ($(this).attr("checked") == "checked") {
        $("#BaseRadio").attr("checked", null);
        /*  $("#AlgoritDIV").show();
         $("#exprssionpoID").hide();*/
    }
});

/*参数选择*/
$(".AlgoritChange").live('change', function () {
    if ($(".AlgoritChange").val() == "其他算法") {
        $('#AlgoritChecked').draggable();
        $("#AlgoritChecked").modal({ backdrop: false, keyboard: false, show: true });
    }

});

/*图片管理 *武东海(盈科) 20121204 14:23 **
 * *******************************************/
//"图片资源"右键菜单
//预览所有图片
function bindImageResourceForBrowser(response) {
    $("#BottomRightCenterOthersContentDiv").html("");
    if($("#pop_Image_content").length>0){
        $("#ulImageList").html("");
    }else{
        var popimgcontent=$("<div id='pop_Image_content' style='width:100%;height:550px;background:#D8eaf4;'><div id='pop_Image_main'><ul id='ulImageList'></ul></div></div>");
        popimgcontent.appendTo($("#BottomRightCenterOthersContentDiv"));
    }

    var imageList = response.data;
    var imageHtml = "";
    //20130124 15:30 盈科 王伟资源上传修改
    //20130523 倪飘 解决bug，图片资源，右键图片资源，点击预览按钮，F12报错（在没有任何图片返回的时候）
    if(imageList !=undefined && imageList !=null){
    for (var i = 0; i < imageList.length; i++) {
        var imagePath = encodeURI(imageList[i].Url);
        var imgName = imageList[i].Name;
        var shortName = imgName;

        shortName = subString(shortName,18,true);
        imageHtml += '<li align="center" id="' + i + '"> <img src="' + imagePath + '"/><span title="'+imgName+'">' + shortName + '</span></li>';
    }
    }else{
        AgiCommonDialogBox.Alert("当前没有可显示图片资源！");
    }
    $("#ulImageList").html(imageHtml);
    RMAllImageThumb();

    //"图片列表"右键菜单
    $(".RMImageMainLi").contextMenu('ImgRightMenuForAll', {
        bindings: {
            'imgDelete1': function (t) {
                AgiCommonDialogBox.Confirm("您确定要删除所选图片?", null, function(result){
                    if(result){//点击确定按钮
//                        var imageName = $(t).find("span").html();
//                        Agi.ResourcesManager.ReDeleteImage(imageName, t, deleteImageComplete);
//                        //20130124 15:30 盈科 王伟资源上传修改
//                        Agi.ResourcesManager.ReGetAllImages(bindImageResourceForBrowser);  //重新加载
                        var imageName = $(t).find("span").attr("title");
                        Agi.ResourcesManager.ReDeleteImage(imageName, t, deleteImageComplete);
                        Agi.ResourcesManager.ReGetAllImages(bindImageResourceForBrowser);
                    }else{
                        return;
                    }
                });
            },
            'imgRename1': function (t) {
                var content = "请输入新名称：";
                var imageName = $(t).find("span").attr("title");
                AgiCommonDialogBox.Prompt(content,null,function (flag,newName) {
                    if (flag) {
                        var txt =/^(\w|[\u4E00-\u9FA5])*$/;
                        if(newName == null||newName.length<=0)
                        {
                            AgiCommonDialogBox.Alert("名称不能为空！", null);
                        }else if(newName.length>16){
                            AgiCommonDialogBox.Alert("最多可输入16个字符！",null);
                        }
                        else if(!txt.test(newName)){
                            AgiCommonDialogBox.Alert("名称不能为特殊字符！", null);
                        }else{
                            Agi.ResourcesManager.ReReNameImage(imageName, newName, t, reNameImageComplete);
                        }
                    } else {
                        return;
                    }
                });
            }
        }
    });

    //        popupDiv('pop_Image');
    PageSourceBrowser();
}

//截取的方法 可以将该方法放在文件的任意位置，可访问到即可,截取字符串 包含中文处理
//(串,长度,增加...)
function subString(str, len, hasDot)
{
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++)
    {
        singleChar = str.charAt(i).toString();
        if(singleChar.match(chineseRegex) != null)
        {
            newLength += 2;
        }
        else
        {
            newLength++;
        }
        if(newLength > len)
        {
            break;
        }
        newStr += singleChar;
    }

    if(hasDot && strLength > len)
    {
        newStr += "...";
    }
    return newStr;
}
//添加图片资源列表
function AddImageResourceImageList(resultData) {
    var data = resultData.data;
    var imgs = "";
    //20130124 15:30 盈科 王伟资源上传修改
//    for (var i = 0; i < data.length; i++) {
//        var imgName = data[i].Name;
//        if(imgName.length>20){
//            imgName = imgName.substring(0,18)+"..."
//        }
//        imgs += '<li class="imgRMC" title="' + data[i].Name + '"><a><span  style="display:none">' + data[i].Url + '</span>' + imgName + '</a></li>';
//    }
    for (var i = 0; i < data.length; i++) {
        var imgName = data[i].Name;
        imgName = subString(imgName,18,true);
        imgs += '<li class="imgRMC" title="' + data[i].Name + '"><a><span  style="display:none">' + data[i].Url + '</span>' + imgName + '</a></li>';
    }

    $("#imgResource").html(imgs);

    //"图片列表"右键菜单
    $(".imgRMC").contextMenu('ImgRightMenu', {
        bindings: {
            'imgPreview': function (t) {
                var uu = $(t).find("span").html();
                uu = encodeURI(uu);
                window.open(uu);
            },
            'imgDelete': function (t) {
                AgiCommonDialogBox.Confirm("您确定要删除所选图片?", null, function(result){
//                    if(result){//点击确定按钮
//                        Agi.ResourcesManager.ReDeleteImage(t.title, null, deleteImageComplete);
//                    }
                    if (result) {
                        Agi.ResourcesManager.ReDeleteImage(t.title, t, deleteImageComplete);
                    } else {
                        return;
                    }
                })
            },
            'imgRename': function (t) {
                var content = "请输入新名称！";
                AgiCommonDialogBox.Prompt(content,null,function (flag,newName) {
                    if (flag) {

                        var txt =/^(\w|[\u4E00-\u9FA5])*$/;
                        if(newName == null||newName.length<=0)
                        {
                            AgiCommonDialogBox.Alert("名称不能为空！", null);
                        }else if(newName.length>16){
                            AgiCommonDialogBox.Alert("最多可输入16个字符！",null);
                        }
                        else if(!txt.test(newName)){
                            AgiCommonDialogBox.Alert("名称不能为特殊字符！", null);
                        }else{
                            Agi.ResourcesManager.ReReNameImage(t.title, newName, t, reNameImageComplete);
                        }
                    } else {
                        return;
                    }
                });
            }
        }
    });
}

//图片重命名结果
function reNameImageComplete(result, li, newName) {
    switch (result) {
        case 1:
            if (li) {
                var oldNameArray = $(li).find('span').html().split('.');
                newName = newName + '.' + oldNameArray[oldNameArray.length - 1];
                if(newName.length>20){
                    newName = newName.substring(0,18)+"..."
                }
                $(li).find('span').html(newName);
            }
            $("#imgResourceManage").click();
            break;
        case 2:
            AgiCommonDialogBox.Alert("已有相同名称的图片！", null);
            break;
        case 0:
            AgiCommonDialogBox.Alert('重命名失败,可能包含非法字符！', null);
            break;
        case -1:
            AgiCommonDialogBox.Alert("此图片一不存在，请刷新图片列表！", null);
            break;
    }
}
// 删除图片列表的某一项
function deleteImageComplete(result, li) {
    if (result == 1) {
        if (li) {
            $(li).remove();
        }

        $("#imgResourceManage").click();
        //AgiCommonDialogBox.Alert("删除成功！", null);
        var content = "删除成功，是否刷新预览列表？";
        AgiCommonDialogBox.Confirm(content, null, function (flag) {

            if (flag) {
                Agi.ResourcesManager.ReGetAllImages(bindImageResourceForBrowser);
            } else {
                return;
            }
        });
    }
    else if (result == 0) {
        AgiCommonDialogBox.Alert("删除失败！", null);
    }
    else {
        AgiCommonDialogBox.Alert("此次操作失败！", null);
    }
}
/*20121204 14:23 结束*/
//20121227 11:38 markeluo 删除虚拟表或DataSet 返回主页面
function GobakFramePage() {
    boolIsSave = true;
    if (ShowMainFramePage) {
        ShowMainFramePage();
    }
    edit.ChangeEdit();//有编辑页面点击首页时，isEdite = false;
    $("#BottomRightCenterContentDiv").css("background-image", "");//由编辑页面点击首页时将背景图片清空，还原网格
    $("#BottomRightCenterContentDiv").css("background-position", "");
    $("#BottomRightCenterContentDiv").css("background-repeat", "");
    $("#BottomRightCenterContentDiv").css("background-size", "");
    //无论用户做什么与DataSet无关的操作，只要弹出框还显示就隐藏...

//    if ($("#PopupSelectDataSource").is(":visible")) {
//        $("#PopupSelectDataSource").modal('hide');
//    }
    dialogs._PopupSelectDataSource.dialog('close');
//    if ($("#PopupSelectVTable").is(":visible")) {
//        $("#PopupSelectVTable").modal('hide');
//    }
    dialogs._PopupSelectVTable.dialog('close');
    if (HideAllMainPageWin) {
        HideAllMainPageWin();
    }
    //清空共享数据源相关内容
    ShareDataOperation.LeaveClear();
    //清除共享数据源过滤相关内容
    ShareDataFilter.LeaveClear();
}

//region 20130618 16:43 markeluo 新增 DataSet 分组文件夹 相关处理

    //1.加载DataSet列表和分组列表
    function LoadDataSetsAndGrpList(NodeInfo,ElementObj,LayerIndex,_CallBack)
    {
        Agi.DatasetsManager.DSAllDataSet_SG(NodeInfo,function(result){
            AllDS = result.Data;
            /*罗万里 20120911 添加-----------------开始*/
            if (Agi.WebServiceConfig.Type === "JAVA") {
                AllDS = {
                    DataSets: {
                        DataSet:[],
                        groups:[]
                    }
                };
//            $.each(result.Data, function (i, val) {
//                AllDS.DataSets.DataSet.push(val.data.DataSet);
//            });
                AllDS.DataSets.DataSet=result.Data.DataSet
                AllDS.DataSets.groups=result.Data.groups;
            }
            /*--------------------------------------结束*/

            if (AllDS != null) {
                var leftfirstdslist="";
                try {
                    if(AllDS.DataSets.DataSet!=null){

                        //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                        var changestateimg="Img/LeftIcon/datasetss.png";
                        if (isArray(AllDS.DataSets.DataSet)) {
                            //如果返回的是多个DataSe（是数组），则循环每一个DataSet，获取需要的数据
                            $.each(AllDS.DataSets.DataSet, function (i, val) {
                                //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                                if(AllDS.DataSets.DataSet[i].changestate!=null && AllDS.DataSets.DataSet[i].changestate=="1"){
                                    changestateimg="Img/LeftIcon/tables_Changed.png";
                                }else{
                                    changestateimg="Img/LeftIcon/datasetss.png";
                                }
                                //20140225 范金鹏 修改字数显示控制使其与父菜单保持一致
                                if(AllDS.DataSets.DataSet[i].ID.replace(/[^\x00-\xff]/g,'**').length>40)
                                {
                                leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet[i].ID + "'  class='MyDataSetss' LayerIndex='"+LayerIndex+"'><a title='" +
                                        AllDS.DataSets.DataSet[i].ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet[i].ID.substr(0,19)+"..." + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                                }
                                else
                                {
                                 leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet[i].ID + "'  class='MyDataSetss' LayerIndex='"+LayerIndex+"'><a title='" +
                                        AllDS.DataSets.DataSet[i].ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet[i].ID + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                                }
                            });
                        }
                        else {
                            //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                            if(AllDS.DataSets.DataSet.changestate!=null && AllDS.DataSets.DataSet.changestate=="1"){
                                changestateimg="Img/LeftIcon/tables_Changed.png";
                            }else{
                                changestateimg="Img/LeftIcon/datasetss.png";
                            }
                            //如果返回的是单个DataSet，则直接获取其ID
                               if(AllDS.DataSets.DataSet.ID.replace(/[^\x00-\xff]/g,'**').length>40)
                               {
                                leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet.ID + "'  class='MyDataSetss' LayerIndex='"+LayerIndex+"'><a  title='" +
                                    AllDS.DataSets.DataSet.ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet.ID.substr(0,19)+"..." + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                                }
                                else
                                {
                                 leftfirstdslist += "<li id='" + AllDS.DataSets.DataSet.ID + "'  class='MyDataSetss' LayerIndex='"+LayerIndex+"'><a  title='" +
                                    AllDS.DataSets.DataSet.ID + "'><span><img src='"+changestateimg+"'/></span>" + AllDS.DataSets.DataSet.ID + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                                }
                        }
                    }
                    if(AllDS.DataSets.groups!=null){
                        if (isArray(AllDS.DataSets.groups)) {
                            //如果返回的是多个group（是数组），则循环每一个group，获取需要的数据
                            $.each(AllDS.DataSets.groups, function (i, val) {
                                if(AllDS.DataSets.groups[i].ID.replace(/[^\x00-\xff]/g,'**').length>40)
                                {
                                leftfirstdslist += "<li id='" + AllDS.DataSets.groups[i].path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='"+LayerIndex+"'><a title='" + AllDS.DataSets.groups[i].ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups[i].ID.substr(0,19)+"..." + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                                }
                                else
                                {
                                leftfirstdslist += "<li id='" + AllDS.DataSets.groups[i].path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='"+LayerIndex+"'><a title='" + AllDS.DataSets.groups[i].ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups[i].ID + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                                }
                            });
                        }
                        else {
                            //如果返回的是单个group，则直接获取其ID
                            if(AllDS.DataSets.groups.ID.replace(/[^\x00-\xff]/g,'**').length>40)
                            {
                            leftfirstdslist += "<li id='" + AllDS.DataSets.groups.path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='"+LayerIndex+"'><a  title='" + AllDS.DataSets.groups.ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups.ID.substr(0,19)+"..." + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                            }
                            else
                            {
                            leftfirstdslist += "<li id='" + AllDS.DataSets.groups.path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='"+LayerIndex+"'><a  title='" + AllDS.DataSets.groups.ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups.ID + "</a><ul class='Sub"+LayerIndex+"'></ul></li>";
                            }
                        }
                    }
                    //绑定数据到下拉菜单
                    if(LayerIndex<=2){
                        $(ElementObj).find("#DatasetsManage").html(leftfirstdslist);
                    }else{
                        $(ElementObj).find(".Sub"+(LayerIndex-1)).html(leftfirstdslist);
                    }

                    BindDataSetsGroupClickEvent($(ElementObj).find(".MyDataSetGroup"));

                    //2014-02-20  coke 重新读取组别名称；
                    if(_CallBack)
                    {
                        _CallBack();
                    }
                    //绑定可拖拽
                    Agi.MenuManagement.BindDataSetsGroupDrag($("#DatasetsManage").find(".MyDataSetss,.MyDataSetGroup"),$("#DatasetsManage").find(".MyDataSetGroup"));
                    //隐藏进度条
                    $('#progressbar1').hide();
                }
                catch (e) {

                }
            }

            //关于datasets的右键菜单
            $(ElementObj).find(".MyDataSetss").contextMenu('OPDas', {
                bindings: {
                    'adddas': function (t) {
                        //AddDataSets($(t).find('a').first().text());
                        AddDataSets($(t).find("a").attr("title"));
                        //alert($(t).find('a').first().text());
                    },
                    //编辑dataset
                    'eddas': function (t) {
                        var test=$(t);
                        //EditDataSets($(t).find('a').first().text());
                        EditDataSets($(t).find("a").attr("title"));
                        //alert($(t).find('a').first().text());
                        boolIsSave = false;
                    },
                    //删除dataset
                    'dedas': function (t) {
                          //20130626 markeluo 修改 删除提示
//                        var content = "确定删除Dataset：" + $(t).find('a').first().text() + "?";
//
//                        AgiCommonDialogBox.Confirm(content, null, function (flag) {
//
//                            if (flag) {
//                                DelDataset($(t).find('a').first().text());
//                            } else {
//                                return;
//                            }
//                        });
                        //var DataSetID=$(t).find('a').first().text();
                        var DataSetID=$(t).find("a").attr("title");
                        var SrcObj={
                            "deleteenum":"4",
                            "datasource":"",
                            "vtable":"",
                            "dataset":DataSetID
                        }
                        var content = "确定删除Dataset：" + DataSetID + "?";
                        var detailcontent="";
                        Agi.PageSourceDelTipManager.DelSource(SrcObj,function(result){
                            if(result.result=="true"){
                                content=DataSetID + "被"+result.pagecount+"个页面使用，您确定继续删除此资源?";
                                detailcontent=Agi.PageSourceDelTipManager.TipsMerg(result);
                            }else{
                                content="获取" + DataSetID + "的引用关系失败，您确定继续删除?";
                            }
                            AgiCommonDialogBox.ConfirmDetail(content, null,detailcontent, function (flag) {
                                if (flag) {
                                    DelDataset(DataSetID);
                                } else {
                                    return;
                                }
                            });
                        });
                    },
                    'movedas':function(t){
                        MovesGroupData(t);
                    }//2014-03-03  coke 移动组别
                }
            });
            //关于datasets的分组右键菜单
            $(ElementObj).find(".MyDataSetGroup").contextMenu('DSGroupFolder',{
                bindings:{
                    'addGrpFolder':function(t){
                        AddDataSetsGroup({NodeName:$(t).find("a").attr("title"),Parent:$(t)[0].id},function(ev){
                        if($(t).parent().parent()[0].id==""){
                            var  NodeInfo={perid:"root"};
                            LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                        }else{
                                var  NodeInfo={perid:t.id};
                                LoadDataSetsAndGrpList(NodeInfo,t,(parseInt($(t).attr("LayerIndex"))+1));
                            }
                        });
                    },
                    'DelGrpFolder':function(t){
                        DelDataSetsGroup({NodeName:$(t).find("a").attr("title"),NodeKey:$(t)[0].id},function(ev){
                            if($(t).parent().parent()[0].id==""){
                                var  NodeInfo={perid:"root"};
                                LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                            }else{
                                var  NodeInfo={perid:$(t).parent().parent()[0].id};
                                LoadDataSetsAndGrpList(NodeInfo,$(t).parent().parent(),(parseInt($(t).parent().parent().attr("LayerIndex"))+1));
                            }
                        });
                    },
                    'EditGrpFolder':function(t){
                        //ParentKey:$($(t)[0]).parent().parent()[0].id
                        //ParentNodeName:$($(t)[0]).parent().parent().find('a').first().text()
                        //_groupInfo.NodeName:分组名称 _groupInfo.NodeKey:分组唯一标识 _groupInfo.Parent:分组父节点标识
                        EditDataSetsGroup({NodeName:$(t).find("a").attr("title"),NodeKey:$(t)[0].id,Parent:$($(t)[0]).parent().parent()[0].id},function(ev){
                            if($(t).parent().parent()[0].id==""){
                                var  NodeInfo={perid:"root"};
                                LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                            }else{
                                var  NodeInfo={perid:$(t).parent().parent()[0].id};
                                LoadDataSetsAndGrpList(NodeInfo,$(t).parent().parent(),(parseInt($(t).parent().parent().attr("LayerIndex"))+1));
                            }
                        });
                    }
                }
            });
        });
    }
    //2.为datasets分组文件夹绑定单击处理事件
    function BindDataSetsGroupClickEvent(JqueryElementArray){
        $(JqueryElementArray).unbind().bind("click",function(event){
            var ParentObj=$(this).parent().parent();
            if(ParentObj!=null && ParentObj[0].id!=null && ParentObj[0].id!=""){
                ParentObj.unbind();
            }
            ParentObj=null;
            var  NodeInfo={perid:this.id};
            LoadDataSetsAndGrpList(NodeInfo,this,(parseInt($(this).attr("LayerIndex"))+1));
        });
     }

//endregion
//region 20130902 14:18 markeluo 修改标准虚拟表 标识相关引用的混合虚拟表、DataSet状态
function GetscvtChangeState(_scvtName,_scDefinedStates){
    var Changestate="0";
    if(_scDefinedStates!=null && _scDefinedStates.length>0){
        for(var i=0;i<_scDefinedStates.length;i++){
            if(_scDefinedStates[i].vtname==_scvtName){
                Changestate=_scDefinedStates[i].changestate;
                break;
            }
        }
    }
    return Changestate+"";
}
//endregion

