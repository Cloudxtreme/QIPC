(function () {
    //对象
    Agi.Edit.workspace = {
        //属性
        editDiv: "#BottomRightCenterContentDiv",
        canvas : null,
        name: "editWorkspace",
        pageName: "新建页面1",
        width: screen.width,
        height: screen.height,
        autoSize: false,
        backgroundColor: "rgb(255, 255, 255)",
        background: "rgb(255, 255, 255) -webkit-gradient(linear, 0 0, 0 100%, color-stop(0.1, transparent), color-stop(0.1, rgba(0, 0, 0, 0.0976563)), to(rgba(0, 0, 0, 0.0976563))), -webkit-gradient(linear, 0 0, 100% 0, color-stop(0.1, transparent), color-stop(0.1, rgba(0, 0, 0, 0.0976563)), to(rgba(0, 0, 0, 0.0976563))) repeat, repeat scroll, scroll 0% 0%, 0% 0% / 10px 10px, 10px 10px padding-box, padding-box border-box, border-box",
        controlList: new Agi.Script.CArrayList(),
        parameterList: new Agi.Script.CArrayList(),
        currentControls: new Array(),
        clipboardControls: new Array(),
        ControlsLibs: new Array(),
        //webservice
        //baseServer:"http://192.168.1.9/Agi_webserivce/Service1.asmx",
        baseServer: WebServiceAddress,
        serviceSave: "VSFileSave",
        serviceOpen: "VSFileReadByID",
        serviceDelete: "VSFileDelete",
        //方法
        Restore: function () {
            //
            Agi.Edit.workspace.pageName = "新建文件夹1";
            //
            layoutManagement.revertConfig();
            //
            $('[name="SelectAspectRatio"][value="100%"]').click();
            $("#SelectGridlines").val('10');
            $("#SelectGridlines").change();
            //
            //Agi.Edit.workspace.editDiv.empty();
            this.canvas.empty();
            $("#ControlEditPage").remove();
            $("#BottomRightDiv").css("display", "");
            //
            //Agi.Edit.workspace.pageName = "新建页面1";
            this.canvas.css("width", Agi.Edit.workspace.width);
            this.canvas.css("height", Agi.Edit.workspace.height);
            this.canvas.css("background", Agi.Edit.workspace.background);
            this.canvas.css("background-color", Agi.Edit.workspace.backgroundColor);
            //
            Agi.Edit.ClearAllControls();//清除所有控件
            Agi.Edit.workspace.controlList.clear();
            Agi.Edit.workspace.parameterList.clear();
            Agi.Edit.workspace.currentControls.length = 0;
            Agi.Edit.workspace.clipboardControls.length = 0;
            //------------------------------------------------begin   add by lj    
            Agi.Msg.PageOutPramats.Clear();  //清除控件参数集合   
            Agi.Msg.ParaBindManage.Clear(); //清除管理绑定集合
            Agi.Msg.UrlManageInfo.Clear(); //清除url参数集合
            $("#SelectAspectRatioDiv").hide();
            $("#ChangePageSizeDiv").hide();
            $("#ChangeBackGroundDiv").hide();
            $("#ChangeGridlinesDiv").hide();
            $("#BasicPropertyPanel").hide();
            $("#SettingModal").modal('hide');
            $(".ui-dialog").hide();
            //------------------------------------------------end    add by lj
            canvas = new Agi.Script.Page();
        },
        GetConfig: function () {
            if(!this.canvas || !this.canvas.length){
                this.canvas = $("#BottomRightCenterContentDiv");
            }
            var width = this.canvas.css("width");
            var height = this.canvas.css("height");
            var background = this.canvas.css("background");
            var backgroundColor = this.canvas.css("background-color");
            var backgroundImg = this.canvas.css("background-image");
            if (backgroundImg && backgroundImg.indexOf("url") != -1) {//图片路径拼接保存
                var ImgServiceAddress = Agi.ImgServiceAddress;  // url(http://192.168.1.122/JAVAWebService1017/SourceManager/121491143.jpg)
                backgroundImg = backgroundImg.substring(ImgServiceAddress.length + 4, backgroundImg.length - 1);
            }
            // alert(backgroundImg);
            var surpluswidth = $("#SurplusWithText").val();
            var surplusheight = $("#SurplusHeightText").val();
            var layout = layoutManagement.getConfig();

            //页面组态保存，JSON标准化
            var PageConfigObj = {
                PageConfig: {
                    PageSize: {
                        AutoSize: null,
                        Width: null,
                        Height: null
                    },
                    SelectPageSize: null,
                    PageSizeText: null,
                    BackgroundImg: null,
                    SurplusWithText: null,
                    SurplusHeightText: null,
                    PageStyle: null,
                    IsExistRealTime: null,
                    ParaRelationalExpression: null,
                    ParaRealTimelExpression: null,
                    UrlParas: null,
                    Parameter: null,
                    Variables: null,
                    RealTimeVariables: null,
                    ScriptEvents: null,
                    ScriptTimer: {
                        TimerPeriod: null,
                        ScriptContent: null
                    },
                    ShareDatasource: null,
                    ShareDataSourceAndControl: null,
                    ShareDataFilterRule: null,
                    ButtonBindControlsRelation: null,
                    canvasBackGround : null
                }
            };
            PageConfigObj.PageConfig.PageSize.AutoSize = Agi.Edit.workspace.autoSize;
            PageConfigObj.PageConfig.PageSize.Width = width;
            PageConfigObj.PageConfig.PageSize.Height = height;
            PageConfigObj.PageConfig.SelectPageSize = $("#SelectPageSize").val();
            PageConfigObj.PageConfig.PageSizeText = $("#PageSizeText").text;
            PageConfigObj.PageConfig.BackgroundImg = backgroundImg;
            PageConfigObj.PageConfig.SurplusWithText = surpluswidth;
            PageConfigObj.PageConfig.SurplusHeightText = surplusheight;
            PageConfigObj.PageConfig.PageStyle = layout;
            PageConfigObj.PageConfig.IsExistRealTime = Agi.Msg.PointsManageInfo.IsSocketOpen;
            PageConfigObj.PageConfig.ParaRelationalExpression = Agi.Msg.ParaBindManage.ObjToString();
            PageConfigObj.PageConfig.ParaRealTimelExpression = Agi.Msg.RealTimeParaBindManage.ObjToString();
            PageConfigObj.PageConfig.UrlParas = Agi.Msg.UrlManageInfo.SaveUrlParas();
            PageConfigObj.PageConfig.PageScript = canvas.getScriptCode();
            PageConfigObj.PageConfig.ShareDatasource = Agi.Msg.ShareDataRealTimeBindPara.SaveAllShareToString();
            PageConfigObj.PageConfig.ShareDataSourceAndControl = Agi.Msg.ShareDataRelation.ObjToString();
            PageConfigObj.PageConfig.ShareDataFilterRule = Agi.Msg.ShareDataFilterRelation.SaveAllShareToString();
            PageConfigObj.PageConfig.ButtonBindControlsRelation = Agi.Msg.ButtonBindControls.SaveAllShareToString();
            PageConfigObj.PageConfig.canvasBackGround = this.canvas.data('colorValue');

            //            var xml = new Array();
            //            xml.push("<PageConfig>");
            //            xml.push("<PageSize AutoSize=\"" + Agi.Edit.workspace.autoSize + "\" Width=\"" + width + "\" Height = \"" + height + "\" /> ");
            //            xml.push("<PageStyle>" + layout + "</PageStyle>");
            //            xml.push("<IsExistRealTime>" + Agi.Msg.PointsManageInfo.IsSocketOpen + "</IsExistRealTime>"); //add by lj 标示是否有实时控件
            //            xml.push("<ParaRelationalExpression>" + Agi.Msg.ParaBindManage.ObjToString() + "</ParaRelationalExpression>"); //add by lujia
            //            xml.push("<ParaRealTimelExpression>" + Agi.Msg.RealTimeParaBindManage.ObjToString() + "</ParaRealTimelExpression>"); //add by lujia
            //            xml.push("<UrlParas>" + Agi.Msg.UrlManageInfo.SaveUrlParas() + "</UrlParas>");
            //            xml.push("<Parameter />");
            //            xml.push("<Variables />");
            //            xml.push("<RealTimeVariables />");
            //            xml.push("<ScriptEvents />");
            //            xml.push("<ScriptTimer>");
            //              xml.push("<TimerPeriod>");
            //              xml.push("</TimerPeriod>");
            //              xml.push("<ScriptContent>");
            //              xml.push("</ScriptContent>");
            //            xml.push("</ScriptTimer>");
            //            xml.push("</PageConfig>");
            //            return xml.join("\r\n");
            return JSON.stringify(PageConfigObj.PageConfig);
        },
        SetConfig: function (config) {
            if (typeof (config.PageStyle) === "string") {
                config.PageStyle = JSON.parse(config.PageStyle);
            }
            var PageStyle = config.PageStyle;

            if (config.PageSize.AutoSize && config.PageSize.AutoSize.toString() == "true") {
                Agi.Edit.workspace.autoSize = config.PageSize.AutoSize; //add by wulei 保存true值
                this.canvas.css("width", screen.availWidth);
                this.canvas.css("height", screen.availHeight);
                $("#fitWindow").attr("selected", true);
                $("#PageSizeText").text("自适应"); //add by wulei
                //$("#PageSizeText").text(screen.availWidth + "*" + screen.availHeight);
            }
            else {
                this.canvas.css("width", config.PageSize.Width);
                this.canvas.css("height", config.PageSize.Height);

                var pageText = config.PageSize.Width.substring(0, 4) + " * " + config.PageSize.Height.substring(0, 3);
                $("#SelectPageSize").val(pageText); //add by wulei 显示出选择中的值
                $("#PageSizeText").text(pageText);
            }
            if (config.hasOwnProperty("BackgroundImg") == false) {//兼容以前的页面
                this.canvas.css("background-size", PageStyle.gridLine + "px " + PageStyle.gridLine + "px");
                this.canvas.css("background-color", PageStyle.backGround);
                this.canvas.css("background-image", "");
                this.canvas.css("background-position", "");
                this.canvas.css("background-repeat", "");
                this.canvas.css("background-size", "");
            } else {
                if (config.BackgroundImg.indexOf("SourceManager") != -1) { //画布的背景图片
                    this.canvas.css("background-image", "url(" + Agi.ImgServiceAddress + config.BackgroundImg + ")");
                    this.canvas.css("background-position", "center");
                    this.canvas.css("background-repeat", "no-repeat");
                    this.canvas.css("background-size", "100% 100%");
                } else {
                    this.canvas.css("background-size", PageStyle.gridLine + "px " + PageStyle.gridLine + "px");
                    this.canvas.css("background-color", PageStyle.backGround);
                }
            }
            if (config.hasOwnProperty("SurplusWithText") == true) {//移除高宽
                $("#SurplusWithText").val(config.SurplusWithText);
                $("#SurplusHeightText").val(config.SurplusHeightText);
            } else {
                $("#SurplusWithText").val("0");
                $("#SurplusHeightText").val("0");
            }
            $("#SelectPageSize").val(config.SelectPageSize); //add by wulei 显示出选择中的值
            $("#PageSizeText").text(config.PageSizeText);
            layoutManagement.initialConfig(config.PageStyle);
            if (config.PageScript) {
                canvas.setScriptCode(config.PageScript);
            }
            if(config.canvasBackGround){
                this.canvas.data('colorValue',config.canvasBackGround).css(config.canvasBackGround.value);
            }
        },
        addParameter: function (fullName, value) {
            Agi.Edit.workspace.parameterList.add({ "id": name.split(".")[0], "name": fullName, "value": value });
        },
        getParameter: function (id) {
            var ret = [];
            for (var i = Agi.Edit.workspace.parameterList.length - 1; i >= 0; i--) {
                if (Agi.Edit.workspace.parameterList[i].id == id) {
                    ret[ret.length] = Agi.Edit.workspace.parameterList[i];
                }
            }
            return ret;
        },
        removeParameter: function (name) {
            if (name.indexOf(".") > 0) {
                for (var i = 0; i < Agi.Edit.workspace.parameterList.length; i++) {
                    if (Agi.Edit.workspace.parameterList[i].name == name) {
                        Agi.Edit.workspace.parameterList.removeAt(i);
                        return false;
                    }
                }
            }
            else {
                for (var i = Agi.Edit.workspace.parameterList.length - 1; i >= 0; i--) {
                    if (Agi.Edit.workspace.parameterList[i].id == name) {
                        Agi.Edit.workspace.parameterList.removeAt(i);
                    }
                }
            }
        },
        //根据控件类型获取控件需要加载的文件
        GetControlsLibs: function (controltype) {
            var ControlLibs = [];
            if (Agi.Edit.workspace.ControlsLibs != null && Agi.Edit.workspace.ControlsLibs.length > 0) {
                for (var i = 0; i < Agi.Edit.workspace.ControlsLibs.length; i++) {
                    if (Agi.Edit.workspace.ControlsLibs[i].controlType === controltype) {
                        ControlLibs = Agi.Edit.workspace.ControlsLibs[i].files;
                        break;
                    }
                }
            }
            return ControlLibs;
        },
        //子控件移动时,判断是否移动到了个容器控件上,然后更新关系;
        updateControlRelation: function(controls){
            var conLen = controls.length;
            if(conLen){
                //debugger;
                //画布里的容器控件
                var containerControls = $('div[container="true"],#BottomRightCenterContentDiv');
                if(containerControls.length){
                    for(var i = 0; i < conLen; i++){
                    //拖动的控件
                    var con = controls[i];
                    var conElement = $(con.Get('HTMLElement'));
                    var conOffset = conElement.offset();
                    var x = conOffset.left;
                    var y = conOffset.top;
                    var panelLen = containerControls.length;
                    //与所有容器控件比对
                    for(var j = panelLen-1; j >=0; j--){

                        if('BottomRightCenterContentDiv' === containerControls[j].id){//移到画布上了
                            //debugger;
                            if(con.parentId){
                                var CControl = Agi.Controls.FindControlByPanel(con.parentId);
                                CControl.RemoveChildControl(con.Get('ProPerty').ID);
                            }
                            con.parentId =  undefined;//解除关系
                            conElement.appendTo(containerControls[j]);
                            break;
                        }
                        var panelControl = Agi.Controls.FindControlByPanel(containerControls[j].id);
                        var panelElement = $(panelControl.Get('HTMLElement'));
                        var panelOffset = panelElement.offset();
                        if (x >= panelOffset.left+2 && y >= panelOffset.top+2 && x < (panelOffset.left + panelElement.width()) && y < (panelOffset.top + panelElement.height())) {
                            if(con.parentId ===  panelElement[0].id){//还在当前的容器
                                break;
                            }
                            if(conElement[0].id !== panelElement[0].id && con.parentId !==  panelElement[0].id){//添加关系
                                //debugger;
                                if(con.parentId){
                                    var prePanelControl = Agi.Controls.FindControlByPanel(con.parentId);
                                    prePanelControl.RemoveChildControl(con.Get('ProPerty').ID);
                                }
                                panelControl.childControls.push(con);
                                con.parentId =  panelElement[0].id;
                                conElement.appendTo(panelElement);
                                conElement.draggable( "option", "containment", "#BottomRightCenterContentDiv" );
                                con.Refresh();
                                break;
                            }
                        }
                    }//for j
                }//for i
                }
            }
        },
        //根据控件类型获取控件所属分组
        GetControlGroup: function (controltype) {
            var strgroupname =null;
            if (Agi.Edit.workspace.ControlsLibs != null && Agi.Edit.workspace.ControlsLibs.length > 0) {
                for (var i = 0; i < Agi.Edit.workspace.ControlsLibs.length; i++) {
                    if (Agi.Edit.workspace.ControlsLibs[i].controlType === controltype) {
                        strgroupname = Agi.Edit.workspace.ControlsLibs[i].groupname;
                        break;
                    }
                }
            }
            return strgroupname;
        }
        //返回
        //return this;
    };
})();