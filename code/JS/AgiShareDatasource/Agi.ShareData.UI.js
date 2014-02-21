/// <reference path="../jquery-1.7.2.min.js" />


//共享数据源操作方法
var ShareDataOperation = {
    //获取鼠标释放时停留的区域对象
    SelectAreaObj: null,
    //存放参数位置
    Para_EntityItemsRect: [],
    //记录是否是编辑状态
    IsUpdate: false,
    //拖拽对象
    DragSharesObj: [],
    //显示共享数据源操作面板
    ShowOperatonPanel: function (DataSourceName, DataSetName) {
        this.Para_EntityItemsRect = [];
        //显示面板
        $('#ShareDataOperationPanel').css('zIndex', 9999);
        $("#ShareDataOperationPanel").modal({ backdrop: true, keyboard: false, show: true });
        //20130528 倪飘 解决bug，编辑一个已经创建的共享数据源，点击右上角X按钮关闭共享数据源配置面板，再次新建共享数据源时下方显示数据不是所选择的实体
        $("#ShareDataOperationPanel").on('hidden', function (e) {
            ShareDataOperation.IsUpdate = false;
        })
        //        $('#ShareDataOperationPanel').draggable({
        //            handle: ".modal-header"
        //        });
        //        if(!dialogs._ShareDataOperationPanel.dialog('isOpen')){
        //            dialogs._ShareDataOperationPanel.dialog('open');
        //        }

        //文本框赋值和清空
        $("#sharedatasetname").val(DataSetName);
        $("#sharedataname").val("");
        $("#sharedataname").attr('readonly', false);

        //        new iScroll('ControlsList', { hScrollbar: false, vScrollbar: false });
        //        new iScroll('ParamsList', { hScrollbar: false, vScrollbar: false });
        //加载所有的控件参数列表
        this.LoadAllControlsList();
        this.GetDataSetInfo(DataSourceName, DataSetName);

        //隐藏滚动条
        new iScroll('ShareWrapper1', { hScrollbar: false, vScrollbar: false });
        new iScroll('ShareWrapper2', { hScrollbar: false, vScrollbar: false });
    },
    //获取共享数据源dataset相关数据
    GetDataSetInfo: function (DataSourceName, DataSetName) {
        var str = "";

        var id = Agi.Script.CreateControlGUID();
        str += "<dl style='width:100%'>" +
                            "<dt class=" + id + " onclick=EntityControlTemplate_Showsubmenu1(this)>" + DataSetName +
                            "<dd id=" + id + " >" +
                            "<ul>";

        if (this.IsUpdate) {
            if (Agi.Msg.ShareDataRealTimeBindPara.IsexistShares(DataSourceName)) {
                var tempShareRelationList = Agi.Msg.ShareDataRealTimeBindPara.GetShareItemObj(DataSourceName).ParasRelation;
                if (tempShareRelationList.length > 0) {
                    for (var i = 0; i < tempShareRelationList.length; i++) {
                        str += "<li id=" + tempShareRelationList[i].EntityPara + " class='datasetPara'>" + tempShareRelationList[i].RelationExpression + "</li>";

                    }
                }
                else {
                    str += "<li id='NoPara'>无参数</li>";
                }
                str += "</ul></dd></dl>";
                $("#ParamsList").html(str);
            }
        }
        else {
            var jsonData = {
                "datasetID": DataSetName
            };
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({ "MethodName": "VSGetVirtualTable", "Paras": jsonString, "CallBackFunction": function (_result) {
                if (_result.result == "true") {
                    var VTData = _result.virtualTableData.SingleEntityInfo;
                    var ParaList;
                    //判断是混合虚拟表创建的dataset还是标准虚拟表创建的dataset,还是存储过程虚拟表创建的dataset
                    if (VTData.SqlDefined) {
                        ParaList = VTData.SqlDefined.Para;
                    }
                    else if (VTData.ScDefined) {
                        ParaList = VTData.ScDefined.Para;
                    }
                    else if (VTData.SpDefined) {
                        ParaList = VTData.SpDefined.Para;
                    }
                    if (ParaList != undefined) {
                        if (ParaList.length > 0) {
                            for (var i = 0; i < ParaList.length; i++) {
                                str += "<li id=" + ParaList[i].ID + " class='datasetPara'>" + ParaList[i].ID + "</li>";
                            }
                            str += "</ul></dd></dl>";
                        } else if (ParaList != null) {
                            str += "<li id=" + ParaList.ID + " class='datasetPara'>" + ParaList.ID + "</li></ul></dd></dl>";
                        }
                        else {
                            str += "<li id='NoPara'>无参数</li></ul></dd></dl>";
                        }
                    } else {
                        str += "<li id='NoPara'>无参数</li></ul></dd></dl>";
                    }
                }
                else {
                    str += "<li id='NoPara'>无参数</li></ul></dd></dl>";
                }
                $("#ParamsList").html(str);
            }
            });
        }

    },
    //保存并绑定列表
    ShareDataSaveAndBindList: function () {
        var ShareDataName = "";
        if ($("#sharedataname").val().trim() != "") {
            if (Agi.Msg.ShareDataRealTimeBindPara.IsexistShares($("#sharedataname").val()) && this.IsUpdate == false) {
                //alert("当前数据源名称已经存在，如需修改请右键菜单点击修改共享数据源！");
                AgiCommonDialogBox.Alert("当前数据源名称已经存在，如需修改请右键菜单点击修改共享数据源！", null);
                return;
            }
            else {
                ShareDataName = $("#sharedataname").val();
            }
        } else {
            //alert("共享数据源名称不能为空！");
            AgiCommonDialogBox.Alert("共享数据源名称不能为空！", null);
            return false;
        }

        var DataSetName = $("#sharedatasetname").val();
        if ($("#ParamsList").find("li").first().attr('id') != "NoPara") {
            for (var i = 0; i < $("#ParamsList").find("li").length; i++) {
                var obj = $("#ParamsList").find("li")[i].innerText;
                var Rvalue = obj.split('=');
                Agi.Msg.ShareDataRealTimeBindPara.AddItem(Rvalue[1], Rvalue[0]);
            }
        }

        Agi.Msg.ShareDataRealTimeBindPara.SaveShareDataObj(DataSetName, ShareDataName);

        var panel = $('#ShareDataUL');
        var ShareLi = "";
        //        panel.empty();
        for (var i = 0; i < Agi.Msg.ShareDataRealTimeBindPara.PageAllShareDataRelation.length; i++) {
            var ShareDataNameList = Agi.Msg.ShareDataRealTimeBindPara.PageAllShareDataRelation[i].ShareDataName;

            ShareLi += '<li class="sdli" id=' + ShareDataNameList + '  style="list-style: none; margin-bottom:5px;">' +
                                '<a><span><img src="Img/LeftIcon/datasetss.png"></span>' + ShareDataNameList + '</a>' +
                                '</li>';
        }
        panel.html(ShareLi);


        //添加拖拽事件
        this.DragSharesObj = panel.find('li');
        this.updateDragableShareTargets();

        if (this.IsUpdate == false) {
            //收起dataset
            $('#collapseOne').parent().find('.accordion-heading>a:eq(0)').click();

            //展开共享数据源
            $('#collapseShareData').parent().find('.accordion-heading>a:eq(0)').click();
        }

        //添加修改和删除共享数据源的右键菜单
        $(".sdli").contextMenu('OPSD', {
            bindings: {
                //编辑共享数据源
                'editshare': function (t) {
                    var ShareDataName = $(t).find('a').text();
                    ShareDataOperation.EditShareDatasource(ShareDataName);
                },
                //删除共享数据源
                'deleteshare': function (t) {
                    var ShareDataName = $(t).find('a').text();
                    var content = "确定删除共享数据源" + ShareDataName + "?";
                    AgiCommonDialogBox.Confirm(content, null, function (flag) {
                        if (flag) {
                            ShareDataOperation.DeleteShareDatasource(ShareDataName);
                            //20130301 倪飘 共享数据源删除后删除所有绑定了改共享数据源的关系
                            Agi.Msg.ShareDataRelation.DeleteItemByShareName(ShareDataName);
                        }
                    });
                }
            }
        });

        if (this.IsUpdate == true) {
            this.IsUpdate = false;
            AgiCommonDialogBox.Alert("共享数据源修改成功！", null);
            //alert("共享数据源修改成功！");
        } else {
            AgiCommonDialogBox.Alert("共享数据源保存成功！", null);
            //alert("共享数据源保存成功！");
        }
        //20121227 16:54 倪飘 修改共享数据源提示信息

        $("#ShareDataOperationPanel").modal('hide');
        //        dialogs._ShareDataOperationPanel.dialog('close');
    },
    //加载所有的控件参数列表
    LoadAllControlsList: function () {
        var str = "";
        var idArray = [];
        $("#ControlsList").html("");
        for (var i = 0; i < Agi.Msg.PageOutPramats.GetSerialData().length; i++) {
            var id = Agi.Script.CreateControlGUID();
            str += "<dl style='width:100%'>" +
                "<dt class=" + id + " onclick=EntityControlTemplate_Showsubmenu1(this)>" + Agi.Msg.PageOutPramats.GetSerialData()[i].key +
                "<dd id=" + id + " >" +
                "<ul>";

            for (var j = 0; j < Agi.Msg.PageOutPramats.GetSerialData()[i].value.length; j++) {
                var lid = Agi.Script.CreateControlGUID();
                str += "<LI id=" + lid + "  divid=" + Agi.Msg.PageOutPramats.GetSerialData()[i].key + "." + Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name + ">" + Agi.Msg.PageOutPramats.GetSerialData()[i].value[j].Name + "</LI>";
                idArray.push(lid);
            }
            str += "</ul></dd></dl>";
        }
        if (str == "")
        { str = "无参数" }
        $("#ControlsList").html(str);


        //1.添加拖拽功能
        for (var j = 0; j < idArray.length; j++) {
            new Agi.Msg.Drag(idArray[j], this.mouseEndcallback, this.dargToArea, null);
        }
    },
    //拖拽Move回调 拖拽移动同时计算鼠标所在区域
    dargToArea: function () {
        //判断是移动设备上还是PC机
        var SupportsTouches = ("createTouch" in document);
        var HammerEndX, HammerEndY;
        if (SupportsTouches) {
            HammerEndX = dragE.changedTouches[0].clientX; HammerEndY = dragE.changedTouches[0].clientY;
        } else {
            HammerEndX = dragE.clientX; HammerEndY = dragE.clientY;
        }
        $.each(ShareDataOperation.Para_EntityItemsRect, function (i, LayoutItem) {
            var LayoutItemRect = LayoutItem.Rect;
            if (HammerEndX >= (LayoutItemRect.left) && HammerEndY >= (LayoutItemRect.top)
            && HammerEndX <= (LayoutItemRect.left + LayoutItemRect.width) && HammerEndY <= (LayoutItemRect.top + LayoutItemRect.height)
            && LayoutItem.type == 1
            ) {
                dragEndDivId = LayoutItem.obj.id; //获取到拖拽到的div的id
                ShareDataOperation.SelectAreaObj = LayoutItem.obj;
                LayoutItem.obj.className = "DargToItemSelected";
            }
            else {
                LayoutItem.obj.className = "DargToItem";
            }
        });
    },
    //释放鼠标的回调
    mouseEndcallback: function (e, obj) {
        if (ShareDataOperation.SelectAreaObj != null && ShareDataOperation.SelectAreaObj.id != "NoPara") {
            //更新界面
            ShareDataOperation.SelectAreaObj.innerText = ShareDataOperation.SelectAreaObj.id + "=" + $(obj).attr('divid');


        }
    },
    //计算参数配置界面每个实体 item大小
    GetItemsSize: function () {
        this.Para_EntityItemsRect = [];
        //计算参数配置界面每个实体 item大小
        for (var i = 0; i < $("#ParamsList").find("li").length; i++) {
            var obj = $("#ParamsList").find("li")[i];
            var Rect = obj.getBoundingClientRect();
            var temp = new itemsObj(obj, Rect, 1);
            this.Para_EntityItemsRect.push(temp);
        }
    },
    //编辑共享数据源
    EditShareDatasource: function (ShareDataName) {
        this.IsUpdate = true;
        if (Agi.Msg.ShareDataRealTimeBindPara.IsexistShares(ShareDataName)) {
            var TempShare = Agi.Msg.ShareDataRealTimeBindPara.GetShareItemObj(ShareDataName);

            this.Para_EntityItemsRect = [];
            //显示面板
            $('#ShareDataOperationPanel').css('zIndex', 9999);
            $("#ShareDataOperationPanel").modal({ backdrop: false, keyboard: false, show: true });
            $('#ShareDataOperationPanel').draggable({
                handle: ".modal-header"
            });

            //文本框赋值和清空
            $("#sharedatasetname").val(TempShare.DatasetName);
            $("#sharedataname").val("");
            $("#sharedataname").val(ShareDataName);
            $("#sharedataname").attr('readonly', true);

            this.LoadAllControlsList();
            this.GetDataSetInfo(ShareDataName, TempShare.DatasetName);

            //隐藏滚动条
            new iScroll('ShareWrapper1', { hScrollbar: false, vScrollbar: false });
            new iScroll('ShareWrapper2', { hScrollbar: false, vScrollbar: false });
        }
        else {
            //alert("当前共享数据源不存在！");
            AgiCommonDialogBox.Alert("当前共享数据源不存在！", null);
        }
    },
    //删除共享数据源
    DeleteShareDatasource: function (ShareDataName) {
        if (Agi.Msg.ShareDataRealTimeBindPara.IsexistShares(ShareDataName)) {
            Agi.Msg.ShareDataRealTimeBindPara.DeleteItem(ShareDataName);
            $("#ShareDataUL li").remove("li[id=" + ShareDataName + "]");
            //alert("共享数据源删除成功！");
            AgiCommonDialogBox.Alert("共享数据源删除成功！", null);
        } else {
            //alert("删除失败，当前共享数据源不存在！");
            AgiCommonDialogBox.Alert("删除失败，当前共享数据源不存在！", null);
        }
    },
    //读取数据显示
    ReadyDataAndShow: function (CurrentPageAllShareDataRelation) {
        var panel = $('#ShareDataUL');
        var ShareLi = "";
        for (var i = 0; i < CurrentPageAllShareDataRelation.length; i++) {
            var ShareDataName = CurrentPageAllShareDataRelation[i].ShareDataName;
            ShareLi += '<li class="sdli" id=' + ShareDataName + '  style="list-style: none; margin-bottom:5px;">' +
                                '<a><span><img src="Img/LeftIcon/datasetss.png"></span>' + ShareDataName + '</a>' +
                                '</li>';
        }

        panel.html(ShareLi);

        //添加拖拽事件
        this.DragSharesObj = panel.find('li');
        this.updateDragableShareTargets();

        //添加修改和删除共享数据源的右键菜单
        $(".sdli").contextMenu('OPSD', {
            bindings: {
                //编辑共享数据源
                'editshare': function (t) {
                    var ShareDataName = $(t).find('a').text();
                    ShareDataOperation.EditShareDatasource(ShareDataName);
                },
                //删除共享数据源
                'deleteshare': function (t) {
                    var ShareDataName = $(t).find('a').text();
                    ShareDataOperation.DeleteShareDatasource(ShareDataName);
                }
            }
        });
    },
    //用户离开操作页面时清楚显示列表和关系数组
    LeaveClear: function () {
        $('#ShareDataUL').empty();
        Agi.Msg.ShareDataRealTimeBindPara.PageAllShareDataRelation = [];
        Agi.Msg.ShareDataRelation.clear();
    },
    //拖拽事件和回调（数据源到控件上面）
    updateDragableShareTargets: function () {
        var _dragablePoint = this.DragSharesObj.length ? this.DragSharesObj : [this.DragSharesObj];
        var dropTargets = $("#BottomRightCenterContentDiv .PanelSty"); //找出画布里面的控件
        var dragControlShare = [];
        if (dropTargets.length) {
            $(_dragablePoint).each(function (i, Point) {
                var dragShares = new Agi.DragDrop.SimpleDragDrop({
                    dragObject: Point,
                    targetObject: dropTargets, //目标为画布中的控件
                    //拖拽完成回调
                    dragEndCallBack: function (d) {
                        //获得拖动的共享数据源名称
                        var ShareDataID = d.object.attr('id');

                        //获得控件ID
                        var ControlName = d.target.attr('id');
                        ControlName = ControlName.substr(ControlName.indexOf('_') + 1);

                        //alert("共享数据源名称：" + ShareDataID + ",当前控件ID：" + ControlName);
                        //绑定共享数据源和控件联动
                        Agi.Msg.ShareDataRelation.AddItem(ShareDataID, ControlName, true);

                    }
                });
                dragControlShare.push(dragShares);
            });
        }
    }
}

//共享数据源配置确定
$("#ShareDataOK").live('click', function () {
     ShareDataOperation.ShareDataSaveAndBindList();
});

//共享数据源配置取消
$("#ShareDataCancel").live('click', function () {
    $("#ShareDataOperationPanel").modal('hide');
    //20130528 倪飘 解决bug，编辑一个已经创建的共享数据源，点击右上角X按钮关闭共享数据源配置面板，再次新建共享数据源时下方显示数据不是所选择的实体
    ShareDataOperation.IsUpdate = false;
    //    dialogs._ShareDataOperationPanel.dialog('close');
});



