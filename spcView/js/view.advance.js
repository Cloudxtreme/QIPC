/**
* Created with JetBrains WebStorm.
* User: Yi
* Date: 13-9-9
* Time: 上午10:56
* To change this template use File | Settings | File Templates.
*/
(function () {
    var menu_state;
    //开关菜单
    $(".open_close").click(function () {
        Agi.view.advance.RightMenuOPenClose(menu_state);
    });
    //点击菜单按钮
    $(".menu>.content>div div").live("click", function () {
        $(".menu>.content>div div").css("backgroundColor", "transparent");
        $(this).css("backgroundColor", "orange");
        switch ($(this).text().trim()) {
            case "导出":
                $(".pop").each(function (i, item) {
                    if (!$(item).hasClass("popExport")) {
                        $(item).transit({ x: 0, opacity: 0 });
                    }
                });
                setTimeout(
                    function () {
                        $(".popExport").transit({ x: -190, opacity: 1 });
                    }, 500
                );
                break;
            case "信息":
                $(".pop").each(function (i, item) {
                    if (!$(item).hasClass("popInfo")) {
                        $(item).transit({ x: 0, opacity: 0 });
                    }
                });
                setTimeout(
                    function () {
                        $(".popInfo").transit({ x: -270, opacity: 1 });
                    }, 500
                );
                break;
            default:
                var show = function () {
                    $(".pop1").css({
                        marginTop: -($(".pop1").height() / 2)
                    });
                    $(".pop1").transit({ x: -($(".pop1").width() + 70), opacity: 1 });
                }
                $(".pop").each(function (i, item) {
                    if (!$(item).hasClass("pop1")) {
                        $(item).transit({ x: 0 });
                    }
                });
                var element = this;
                $(".pop1").transit({ x: 0, opacity: 0 }, function () {
                    $(element).data("callback")($(".pop1"), show);
                });
                break;
        }
    });
    $(".menu>.content>div div").live("mouseenter", function () {
        $(this).css("backgroundColor", "orange");
    });
    $(".menu>.content>div div").live("mouseleave", function () {
        $(this).css("backgroundColor", "transparent");
    });
    //导出按钮
    $(".popExport>.content>div").mouseenter(function () {
        $(this).css("backgroundColor", "orange");
    });
    $(".popExport>.content>div").mouseleave(function () {
        $(this).css("backgroundColor", "transparent");
    });
    $(".popExport>.content>div").click(function () {
        switch (this.innerText.trim()) {
            case "Word":
                getWord();
                break;
            case "PDF":
                // window.useNativeAPI({ methodName: "toPDF" });
                getPDF();
                break;
            case "Excel":
                getExcel();
                break;
            case "Jpeg":
                pageExport();
                break;
        }
    });
    //保存页面信息
    $(".popInfo div").click(function () {
        switch (this.innerText.trim()) {
            case "保存":
                Agi.view.functions.upPageinfo({
                    VCreateAim: $("#spcviewcreataim").find("textarea").val(),
                    VSummary: $("#spcviewcreatsummary").find("textarea").val()
                }, function (_result) {
                    if (_result.result == "true") {
                        AgiCommonDialogBox.Alert(_result.message);
                        $(".pop").transit({ x: 0 });
                    } else {
                        AgiCommonDialogBox.Alert(_result.message);
                    }
                });
                break;
            case "取消":
                $(".pop").transit({ x: 0 });
                break;
        }
    });
    //数据表格
    var editedCells = [];
    var lastEditRowID;
    var PageDataDrillPars = null;
    var CellPageDataDrillItem = null;
    var gridOptions = {
        datatype: "local",
        autowidth: true,
        height: 165,
        scroll: false,
        scrollOffset: 0,
        colNames: ['标识', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
        colModel: [
            { name: 'id', index: 'id', width: 60, sorttype: "int" },
            { name: 'invdate', index: 'invdate', width: 90, sorttype: "date", editable: true },
            { name: 'name', index: 'name', width: 100, editable: true },
            { name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", editable: true },
            { name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float", editable: true },
            { name: 'total', index: 'total', width: 80, align: "right", sorttype: "float", editable: true },
            { name: 'note', index: 'note', width: 150, sortable: false, editable: true }
        ],
        multiselect: true,
        rowNum: 7,
        pager: "#data_pager",
        pagerpos: "left",
        pginput: false,
        viewrecords: true,
        ondblClickRow: function (rowID) {
            if (rowID && rowID !== lastEditRowID) {
                $('#data_table').jqGrid('restoreRow', lastEditRowID);
                $('#data_table').jqGrid('editRow', rowID, true, null, null, "clientArray", null, function () {
                    //修改后的数据变化颜色
                    ////判断
                    var rowData = $("#data_table").jqGrid('getRowData');
                    for (var i = 0; i < rowData.length; i++) {
                        var row = rowData[i];
                        for (var column in row) {
                            if (row[column].toString() !== myData[i][column].toString()) {
                                editedCells.push({
                                    rowIndex: i,
                                    column: column
                                });
                            }
                        }
                    }
                    ////变色
                    for (var i = 0; i < editedCells.length; i++) {
                        var cell = editedCells[i];
                        $("#data_table").find("tr").eq(cell.rowIndex + 1)
                                .find("[aria-describedby='data_table_" + cell.column + "']")
                                .css({
                                    backgroundColor: "silver",
                                    fontWeight: "bold"
                                });
                    }
                }
                )
                ;
                lastEditRowID = rowID;
            }
        },
        onSelectRow: function () {
            var selectedRows = $("#data_table").jqGrid('getGridParam', 'selarrrow');
            if (selectedRows.length > 0) {
                $(".toolbar button").eq(0).removeAttr("disabled");
            }
            else {
                $(".toolbar button").eq(0).attr("disabled", "disabled");
            }
        },
        loadComplete: function () {
            //
            //            $("tr.jqgrow", this).contextMenu('data_menu', {
            //                bindings: {
            //                    'add': function (trigger) {
            //                        //数据钻取
            //                        var selectedRow = $("#data_table").jqGrid('getGridParam', 'selarrrow');
            //                        var selectedData = $("#data_table").jqGrid('getRowData', selectedRow);
            //                        delete selectedData["标识"];
            //                        var PageDataDrillPars = Agi.view.advance.currentControl.SPCViewDataExtractURLGet(selectedData);
            //                        //格式:[{drillname:"硅钢统计月数据钻取日数据",drillcolumn:"统计时间",drillpage:"硅钢日统计",drillpars:[{parsname:"AA",parstype:"0",parsvalue:"column1"}]}]
            //                        if(PageDataDrillPars!=null && PageDataDrillPars.length>0){
            //                            AgiCommonDialogBox.Alert("未配置钻取参数信息，无法完成钻取操作!");
            //                            return;
            //                        }
            //                        var url=Agi.SPCViewServiceAddress+PageDataDrillPars.PageName+"_"+PageDataDrillPars.Vesion+"&isView=true&";
            //
            //                        //window.open(url);
            //                        if(PageDataDrillPars.Pars!=null && PageDataDrillPars.Pars.length>0){
            //                            for(var i=0;i<PageDataDrillPars.Pars.length;i++){
            //                                url+=PageDataDrillPars.Pars[i].ParsName+"="+PageDataDrillPars.Pars[i].ParsValue+"&";
            //                            }
            //                        }
            //                        url+="ID=";
            //
            //                        Agi.PageDataDrill.GetPageFilePath(PageDataDrillPars.PageName,PageDataDrillPars.Vesion,function(_result){
            //                            if(_result.result && _result.result=="true"){
            //                                url+=_result.data.ID;
            //                                //20131129 15:44 添加钻取权限管理，判断目标页面是否有权限
            //                                GetDrillPageAuth(url,function(_result){
            //                                    if(_result){
            //                                        window.open(url);
            //                                    }else{
            //                                        AgiCommonDialogBox.Alert("您对目标页面没有权限，请联系管理员!");
            //                                    }
            //                                })
            //                            }
            //                        });
            //                    }
            //                },
            //                onContextMenu: function (event/*, menu*/) {
            //                    var rowId = $(event.target).closest("tr.jqgrow").attr("id");
            //                    $("#data_table").jqGrid("resetSelection");
            //                    $('#data_table').jqGrid("setSelection", rowId);
            //                    return true;
            //                }
            //            });
            $("#gview_data_table tr.jqgrow td").contextRMenu("data_menu", {
                onContextMenu: function (event) {
                    CellPageDataDrillItem = null;
                    PageDataDrillPars = Agi.view.advance.currentControl.SPCViewDataExtractURLGet();
                    //格式:[{drillname:"硅钢统计月数据钻取日数据",drillcolumn:"统计时间",drillpage:"硅钢日统计",drillpars:[{parsname:"AA",parstype:"0",parsvalue:"column1"}]}]
                    if (PageDataDrillPars != null && PageDataDrillPars.length > 0) {
                        var rowtdcellindex = event.currentTarget.cellIndex;
                        if (rowtdcellindex > 1) {
                            var tdColumnName = $("#gview_data_table .ui-jqgrid-htable th div")[rowtdcellindex].innerText;
                            var liItems = "";
                            for (var i = 0; i < PageDataDrillPars.length; i++) {
                                if (PageDataDrillPars[i].drillcolumn == tdColumnName) {
                                    CellPageDataDrillItem = PageDataDrillPars[i];
                                    liItems += "<li class='Drilldatamenuitem' title='" + PageDataDrillPars[i].drillname + "'>" + PageDataDrillPars[i].drillname + "</li>";
                                }
                            }
                            if (liItems != "") {
                                $("#data_menu").find("ul").html(liItems);
                            } else {
                                //                                AgiCommonDialogBox.Alert("该列未配置钻取信息，无法完成钻取操作!");
                                $("#data_menu").find("ul").html("<li class='DrilldataTipsty'>该列无钻取信息！</li>"); ;
                            }
                        }
                    } else {
                        $("#data_menu").find("ul").html("<li class='DrilldataTipsty'>该控件未配置钻取信息！</li>");
                    }
                    return true;
                },
                bindings: {
                    ".Drilldatamenuitem": function (trigger, tar, item) {//选中钻取项，执行钻取操作
                        PageDataDrillPars = Agi.view.advance.currentControl.SPCViewDataExtractURLGet();
                        //格式:[{drillname:"硅钢统计月数据钻取日数据",drillcolumn:"统计时间",drillpage:"硅钢日统计",drillpars:[{parsname:"AA",parstype:"0",parsvalue:"column1"}]}]
                        var CellDrillName = $(item).attr("title");
                        for (var i = 0; i < PageDataDrillPars.length; i++) {
                            if (CellDrillName == PageDataDrillPars[i].drillname) {
                                CellPageDataDrillItem = PageDataDrillPars[i];
                                break;
                            }
                        }
                        var CellDrillURL = "";
                        if (CellPageDataDrillItem != null) {
                            CellDrillURL = Agi.SPCViewServiceAddress + CellPageDataDrillItem.drillpage + "&isView=true&";
                            if (CellPageDataDrillItem.drillpars != null && CellPageDataDrillItem.drillpars.length > 0) {
                                var ThisParsValue = "";
                                var selectedRow = trigger.parentNode;
                                var selectedData = [];
                                if (selectedRow != null && selectedRow.children != null && selectedRow.children.length > 0) {
                                    var Itemstr = null;
                                    for (var j = 0; j < selectedRow.children.length; j++) {
                                        selectedData.push({ ColumnName: trigger.parentNode.children[j].getAttribute("aria-describedby").replace("data_table_", ""), Value: trigger.parentNode.children[j].innerText });
                                    }
                                }

                                for (var i = 0; i < CellPageDataDrillItem.drillpars.length; i++) {
                                    ThisParsValue = "";
                                    if (CellPageDataDrillItem.drillpars[i].parstype == "1") {
                                        CellDrillURL += CellPageDataDrillItem.drillpars[i].parsname + "=" + Agi.Controls.AdvanceDataGrid.FormatParsValue(CellPageDataDrillItem.drillpars[i].parsvalue, CellPageDataDrillItem.drillpars[i].parsvaluefun) + "&";
                                    } else {
                                        if (CellPageDataDrillItem.drillpars[i].parstype == "0") {
                                            for (var z = 0; z < selectedData.length; z++) {
                                                if (selectedData[z].ColumnName == CellPageDataDrillItem.drillpars[i].parsvalue) {
                                                    ThisParsValue = selectedData[z].Value;
                                                    break;
                                                }
                                            }
                                            CellDrillURL += CellPageDataDrillItem.drillpars[i].parsname + "=" + Agi.Controls.AdvanceDataGrid.FormatParsValue(ThisParsValue, CellPageDataDrillItem.drillpars[i].parsvaluefun) + "&";
                                        } else {
                                            var allRowData = $("#data_table").jqGrid("getGridParam", "data");
                                            ThisParsValue = "";
                                            if (allRowData != null && allRowData.length > 0) {
                                                for (var Rindex = 0; Rindex < allRowData.length; Rindex++) {
                                                    ThisParsValue += allRowData[Rindex][CellPageDataDrillItem.drillpars[i].parsvalue] + ",";
                                                }
                                            }
                                            CellDrillURL += CellPageDataDrillItem.drillpars[i].parsname + "=" + Agi.Controls.AdvanceDataGrid.FormatParsValue(ThisParsValue, CellPageDataDrillItem.drillpars[i].parsvaluefun) + "&";
                                        }
                                    }
                                }
                                ThisParsValue = selectedRow = selectedData = null;
                            }
                            CellDrillURL += "ID=";

                            var DrillPageName = CellPageDataDrillItem.drillpage.substr(0, CellPageDataDrillItem.drillpage.lastIndexOf("_"));
                            var DrillPageVesion = CellPageDataDrillItem.drillpage.substr((CellPageDataDrillItem.drillpage.lastIndexOf("_") + 1));

                            //根据页面名称和版本号获取页面ID
                            Agi.PageDataDrill.GetPageFilePath(DrillPageName, DrillPageVesion, function (_result) {
                                if (_result.result && _result.result == "true") {
                                    CellDrillURL += _result.data.ID;

                                    //20131129 15:44 添加钻取权限管理，判断目标页面是否有权限
                                    GetDrillPageAuth(CellDrillURL, function (_result) {
                                        if (_result) {
                                            window.open(CellDrillURL);
                                        } else {
                                            AgiCommonDialogBox.Alert("您对目标页面没有权限，请联系管理员!");
                                        }
                                        DrillPageName = DrillPageVesion = null;
                                    })
                                }
                            });
                        }
                    }
                }
            });
        },
        gridComplete: function () {
            //            var ids = $("#data_table").jqGrid("getDataIDs");
            //            $(".toolbar .count").text(ids.length);
            $(".toolbar .count").text($("#data_table").jqGrid("getGridParam", "data").length);
        },
        afterInsertRow: function (rowID, rowData, rowElement) {
            //报警信息
            for (var i = 0; i < alarmCells.length; i++) {
                var cell = alarmCells[i];
                if (rowData["标识"] === cell.Row + 1) {
                    $("#data_table").find("tr:last").find("td").eq(cell.Col + 2)
                        .css({
                            backgroundColor: cell.AlarmColor
                        });
                }
                /* $("#data_table").find("tr").eq(cell.Row + 1)
                .find("td").eq(cell.Col + 2)
                .css({
                backgroundColor: cell.AlarmColor
                });*/
            }
            //异常点信息
            for (var i = 0; i < abnormalRows.length; i++) {
                var rowIndex = abnormalRows[i];
                if (rowData["标识"] === rowIndex + 1) {
                    $("#data_table").find("tr:last").css({
                        border: "2px solid orange",
                        boxShadow: "inset 1px 1px 10px orange"
                    });
                    //显示当前行  setSelection
                    $("#data_table").jqGrid("resetSelection");
                    $("#data_table").jqGrid("setSelection", rowIndex + 1, false);
                }
            }
        }
    };
    //$("#data_table").jqGrid(gridOptions);
    var myData = [
    /*{id: "1", invdate: "2007-10-01", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00"},
    {id: "2", invdate: "2007-10-02", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00"},
    {id: "3", invdate: "2007-09-01", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00"},
    {id: "4", invdate: "2007-10-04", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00"},
    {id: "5", invdate: "2007-10-05", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00"},
    {id: "6", invdate: "2007-09-06", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00"},
    {id: "7", invdate: "2007-10-04", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00"},
    {id: "8", invdate: "2007-10-03", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00"},
    {id: "9", invdate: "2007-09-01", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00"}*/
    ];
    /*for (var i = 0; i <= myData.length; i++) {
    $("#data_table").jqGrid('addRowData', i + 1, myData[i]);
    }*/
    //全选按钮
    $("#cb_data_table").live("click", function () {
        var selectedRows = $("#data_table").jqGrid('getGridParam', 'selarrrow');
        if (selectedRows.length > 0) {
            $(".toolbar button").eq(0).removeAttr("disabled");
        }
        else {
            $(".toolbar button").eq(0).attr("disabled", "disabled");
        }
    });
    //显示表格
    $(".SPCPanelSty").live("dblclick", function () {
        //    $("#adv_main").live("dblclick", function (e) {
        //        if (e.srcElement.id !== "adv_main")return;
        //绑定数据
        var control = Agi.Controls.FindControlByPanel(this.id);
        var data = control.GetSPCViewGridData();
        Agi.view.advance.refreshGridData(data);
        //
        $(".menu").transit({ x: 0 });
        menu_state = !menu_state;
        $(".pointer").transit({ rotate: -90 });
        $(".pop").transit({ x: 0 });
    });
    //    $(".PanelSty").live("click", function () {
    //mousedown
    $(".SPCPanelSty").live("mouseup", function () {
        //    $("#adv_main").live("click", function (e) {
        //        if (e.srcElement.id !== "adv_main")return;
        var control = Agi.Controls.FindControlByPanel(this.id);
        Agi.view.advance.currentControl = control;
        var controlMenus = control.SPCViewMenus();
        //        var viewmenus = [];
        //        viewmenus.push({Title: "判异", MenuImg: "ViewMenuImages/Sigma.png", CallbackFun: "SPCViewSigmaManager"});
        //        viewmenus.push({Title: "报警", MenuImg: "ViewMenuImages/SpecialAlarm.png", CallbackFun: "SPCViewSpAlarmManager"});
        //        viewmenus.push({Title: "测试", MenuImg: "ViewMenuImages/SpecialAlarm.png", CallbackFun: "SPCViewSpAlarmManager"});
        //        var controlMenus = viewmenus;
        $(".customPop").empty();
        for (var i = 0; i < controlMenus.length; i++) {
            var menu = controlMenus[i];
            var tempPop = $("<div title='" + menu.Title + "'>" +
                "<img src='" + menu.MenuImg + "' alt='" + menu.Title + "'/>" +
                menu.Title +
                "</div>");
            tempPop.data("callback", menu.CallbackFun);
            $(".customPop").append(tempPop);
        }
        //fixMenuHeight
        $(".menu,.menu>.content").css({
            height: ($(".menu>.content div").length - 2) * 50
        });
        $(".menu").css({
            marginTop: -($(".menu").height() / 2)
        });
        //
        $(".menu").transit({ x: 0 });
        menu_state = !menu_state;
        $(".pointer").transit({ rotate: -90 });
        $(".pop").transit({ x: 0 });
    });
    //关闭表格
    $(".toolbar .close").click(function () {
        $(".data").transit({ y: 0 });
        $("#workspace").parent().css(
            {
                height: parseInt($("#workspace").parent().height()) + 250,
                overflow: "hidden"
            }
        );
    });
    //表格按钮事件
    $(".toolbar button").click(function () {
        switch ($(this).text().trim()) {
            case "删除":
                var selectedRows = $("#data_table").jqGrid('getGridParam', 'selarrrow');
                //modified by liuxing[20140226] to avoid row-deletion index calculating mistake
                var currentPage = $("#data_table").jqGrid('getGridParam', 'page'); //jqgrid's current page number
                var rowNum = $("#data_table").jqGrid('getGridParam', 'rowNum');
                var rowIndexAddtion = (currentPage - 1) * rowNum;

                selectedRows = Agi.Controls.AdvanceDataGrid.NumberArrayConvertSort(selectedRows);
                for (var i = selectedRows.length - 1; i >= 0; i--) {
                    var selectedRow = selectedRows[i];
                    $("#data_table").jqGrid('delRowData', selectedRow);
                    $("#data_table").trigger("reloadGrid");
                    $(this).attr("disabled", "disabled");
                    delete myData[rowIndexAddtion + selectedRow - 1];
                }
                break;
            case "筛选":
                //显示
                $(".filterBox").show().css("opacity", 0).transit({ opacity: 1 });
                $(this).attr("disabled", "disabled");
                //绑定
                $("filterBox_fieldNames").empty();
                var columnNames = $("#data_table").jqGrid("getGridParam", "colNames");
                $("#filterBox_fieldNames").html(""); //20130922 15:34 markeluo 每次填充栏位前先清空栏位内元素
                for (var i = 1; i < columnNames.length; i++) {
                    var columnName = columnNames[i];
                    $("#filterBox_fieldNames").append("<option>" + columnName + "</option>");
                }
                break;
            case "恢复":
                //clear
                //$("#data_table").jqGrid('clearGridData');
                //add
                //                for (var i = 0; i <= myData.length; i++) {
                //                    $("#data_table").jqGrid('addRowData', i + 1, myData[i]);
                //                }
                //                var control = Agi.Controls.FindControl(this.id);//此方法错误，需要传入控件的ID
                Agi.view.advance.currentControl.SPCViewDataRestore();
                break;
            case "刷新":
                // var rowData = $("#data_table").jqGrid('getRowData');
                var rowData = $("#data_table").jqGrid("getGridParam", "data");
                //                for (var i = 0; i < rowData.length; i++) {
                //                    var data = rowData[i];
                //                    delete data["标识"];
                //                }
                //                var control = Agi.Controls.FindControl(this.id);//此方法错误，需要传入控件的ID
                Agi.view.advance.currentControl.SPCViewRefreshByGridData(rowData);
                break;
        }
    });

    //20140304 范金鹏 添加条件事件
    var dataFilters = new Array();
    $("#addFilter").live('click', function () {
        var columnName = $("#filterBox_fieldNames").val();
        var rule = $("#filterBox_rule").val();
        var source = $("#filterBox_source").val();
        var number = $("#filterBox_number").val();
        var tr = '<tr><td>过滤字段:</td><td>' + columnName + '</td><td>过滤规则:</td><td>' + rule + '</td><td>比较源:</td><td>' + source + '</td><td>比较值:</td><td>' + number + '</td><td><input type="button" style="width:50px;" class="dataFilters" value="删除"/></td></tr>';
        $("#filtersTable").append(tr);
        dataFilters.push(
            {
                columnName: columnName,
                rule: rule,
                source: source,
                number: number
            });
    });

    //添加控制条件table行删除的代码
    $(".dataFilters").live('click', function () {
        var tempTr = $(this).parent().parent();
        tempTr.remove();
        var tRs = $("#filtersTable").find("tr");
        dataFilters = new Array();
        for (var i = 0; i < tRs.length; i++) {
            dataFilters.push({
                columnName: tRs[i].children[1].innerText,
                rule: tRs[i].children[3].innerText,
                source: tRs[i].children[5].innerText,
                number: tRs[i].children[7].innerText
            });
        }
    });

    //20140305 范金鹏 放大按钮事件
    var controlParentObjId = '';
    var controlElementId = '';
    var controlLeft = '';
    var controlTop = '';
    var controlNull = false;
    $(".zoomControl").live('click', function () {
        $("#zoomDiv").css('width', screen.width);
        $("#zoomDiv").css('margin-left',-screen.width/2);

        controlElementId = $(this).parent()[0].id;
        controlParentObjId = $(this).parent().parent()[0].id;
        var controlObj = Agi.Controls.FindControlByPanel(controlElementId);
        if (controlObj != null) {
            var ThisControlObj = controlObj.Get('chart');
            var ThisHTMLElement = $(controlObj.Get("HTMLElement"));
            $(".zoomControl").addClass("hide");
            var controlData = $(this).parent();
            controlLeft = controlData.css('left');
            controlTop = controlData.css('top');

            controlData.css("top", "30px");
            controlData.css("left", "0px");
            $("#" + controlElementId).appendTo($("#zoomDiv"));
            controlObj.Set("HTMLElement", $("#" + controlElementId)[0]);
            controlObj.oldSize = {
                width: ThisHTMLElement.width(),
                height: ThisHTMLElement.height()
            }
            ThisHTMLElement.css({ "width": '98%', "height": '90%' });
            $(window).resize();
            Agi.Controls.ShowControlData(controlObj);
        }
        else {
            controlNull = true;
            return;
        }
    });

    //20140305 范金鹏 modal window隐藏时会触发的事件
    $("#zoomDiv").on('hidden', function () {
        if (!controlNull) {
            $("#" + controlElementId).css('left', controlLeft);
            $("#" + controlElementId).css('top', controlTop);
            $(".zoomControl").removeClass("hide");
            //var backControl = $("#" + controlElementId).css("zoom", "1");
            $("#" + controlElementId).appendTo($("#" + controlParentObjId));
            var controlObj = Agi.Controls.FindControlByPanel(controlElementId);
            //controlObj.BackOldSize.call(controlObj);
            var obj = $(controlObj.Get('HTMLElement'));
            obj.width(controlObj.oldSize.width).height(controlObj.oldSize.height);
            //框架重新设置
            $(window).resize();
        }
        controlNull = false;
    });

    //筛选框事件
    $("#filterBox_save").live('click', function () {
        //20140304 范金鹏 添加判断条件是否添加，未添加条件的话直接返回
        if ($("#filtersTable").find("tr").length == 0) {
            AgiCommonDialogBox.Alert("没有筛选条件，请填写条件后点击添加按钮添加条件");
            return;
        }
        //end

        $(".filterBox").transit({ opacity: 0 }, function () {
            $(".filterBox").hide();
        });
        $(".toolbar .filter").removeAttr("disabled");
        //筛选
        //getCell

        //        var columnName = $("#filterBox_fieldNames").val();
        //        var rule = $("#filterBox_rule").val();
        //        var source = $("#filterBox_source").val();
        //        var number = $("#filterBox_number").val();
        var newData = [];
        for (var i = 0; i < myData.length; i++) {
            var data = myData[i];
            var BolSucced = false;
            var statement = "";
            for (var j = 0; j < dataFilters.length; j++) {
                var columnName = dataFilters[j].columnName;
                var rule = dataFilters[j].rule;
                var source = dataFilters[j].source;
                var number = dataFilters[j].number;
                switch (source) {
                    case "固定值":
                        //                  var newData = [];
                        //                    for (var i = 0; i < myData.length; i++) {
                        //                        var data = myData[i];
                        //                        var statement = data[columnName] + rule + number;
                        //                        var BolSucced = false;
                        //                        if (isNaN(number)) {//字符串
                        //                            try {
                        //                                statement = "'" + data[columnName] + "'" + rule + "'" + number + "'";
                        //                                BolSucced = eval(statement);
                        //                            } catch (ev) {
                        //                                statement = data[columnName] + rule + number;
                        //                                BolSucced = eval(statement);
                        //                            }
                        //                        } else {//数值
                        //                            try {
                        //                                BolSucced = eval(statement);
                        //                            } catch (ev) {
                        //                                statement = "'" + data[columnName] + "'" + rule + "'" + number + "'";
                        //                                BolSucced = eval(statement);
                        //                            }
                        //                        }
                        //                        if (BolSucced) {
                        //                            newData.push(data);
                        //                        }
                        //                    }


                        //var statement = data[columnName] + rule + number;
                        var BolSucced = false;
                        //                        if (isNaN(number)) {//字符串
                        //                            try {
                        //                                statement += "'" + data[columnName] + "'" + rule + "'" + number + "'" + "&&";
                        //                            } catch (ev) {
                        //                                statement += data[columnName] + rule + number + "&&";
                        //                            }
                        //                        } else {//数值
                        //                            try {
                        statement += data[columnName] + rule + number + "&&";
                        //                            } catch (ev) {
                        //                                statement += "'" + data[columnName] + "'" + rule + "'" + number + "'" + "&&";
                        //                            }
                        //                        }
                        break;
                    case "数据列":
                        var BolSucced = false;
                        //                        if (isNaN(number)) {//字符串
                        //                            try {
                        //                                statement += "'" + data[columnName] + "'" + rule + "'" + data[number] + "'" + "&&";
                        //                            } catch (ev) {
                        //                                statement += data[columnName] + rule + data[number] + "&&";
                        //                            }
                        //                        } else {//数值
                        //                            try {
                        statement += data[columnName] + rule + data[number] + "&&";
                        //                            } catch (ev) {
                        //                                statement += "'" + data[columnName] + "'" + rule + "'" + data[number] + "'" + "&&";
                        //                            }
                        //                        }
                        break;
                }
            }
            BolSucced = eval(statement.substr(0, statement.length - 2));
            if (BolSucced) {
                newData.push(data);
            }
        }
        //判断条件是否
        //var testData = newData;
        $("#data_table").jqGrid('clearGridData');
        for (var i = 0; i <= newData.length; i++) {
            $("#data_table").jqGrid('addRowData', i + 1, newData[i]);
        }
    });

    $("#filterBox_cancel").click(function () {
        $(".filterBox").transit({ opacity: 0 }, function () {
            $(".filterBox").hide();
        });
        $(".toolbar .filter").removeAttr("disabled");
    });
    var filterBox_number = $("#filterBox_number").clone();
    $("#filterBox_source").change(function () {
        switch (this.value) {
            case "固定值":
                $(".filterBox_source_number").empty().append(filterBox_number);
                break;
            case "数据列":
                $(".filterBox_source_number").empty().append($("#filterBox_fieldNames").clone().attr("id", "filterBox_number"));
                break;
        }
    });
    //
    var alarmCells = [], abnormalRows = [];
    //对外接口方法
    Agi.view.advance = {
        refreshGridData: function (data) {
            //
            $(".data").transit({ y: -260 });
            //判断是否减小高度
            if ($("#workspace").parent().height() === $("#workspace").height()) {
                $("#workspace").parent().css(
                    {
                        height: parseInt($("#workspace").parent().height()) - 250,
                        overflow: "scroll"
                    }
                );
            }
            //列
            var columnNames = ["标识"];
            var columnModels = [
                { name: "标识", index: "标识", width: 50, sorttype: "int" }
            ];
            for (var columnName in data.ChartData[0]) {
                columnNames.push(columnName);
                columnModels.push({
                    name: columnName,
                    index: columnName,
                    width: 100,
                    editable: true
                });
            }
            gridOptions.colNames = columnNames;
            gridOptions.colModel = columnModels;
            $("#data_table").jqGrid("GridUnload");
            //数据
            alarmCells = data.AlarmCells;
            abnormalRows = data.AbnormalRows;
            //
            myData = [];
            editedCells = [];
            for (var i = 0; i < data.ChartData.length; i++) {
                var chartData = data.ChartData[i];
                chartData["标识"] = i + 1;
                //modified by liuxing[20140226] to avoid row-deletion index calculating mistake
                chartData["id"] = i + 1;
                myData.push(chartData);
                //                $("#data_table").jqGrid('addRowData', i + 1, chartData);
            }
            //
            gridOptions.data = myData;
            $("#data_table").jqGrid(gridOptions);
            //异常点
            var myPage = Math.ceil((abnormalRows[0] + 1) / 7);
            if (!isNaN(myPage)) {
                $("#data_table").jqGrid("setGridParam", { page: myPage }).trigger("reloadGrid");
            }

            $(".popupLayer").hide(); //隐藏异常点录入功能弹出窗口
        },
        RightMenuOPenClose: function (ShowState) {
            if (!ShowState) {
                $(".menu").transit({ x: 0 });
                $(".pointer").transit({ rotate: -90 });
                $(".pop").transit({ x: 0 });
            } else {
                $(".menu").transit({ x: -35 });
                $(".pointer").transit({ rotate: 90 });
                $(".data").transit({ y: 0 });
                $("#workspace").parent().css(
                    {
                        height: "auto",
                        overflow: "hidden"
                    }
                );
            }
            menu_state = !menu_state;
        }
    }

    //模拟测试
    var testGridData = {
        ChartData: [
            { "GroupName": "甲班", "重量": 12, "厚度": 0.85 },
            { "GroupName": "甲班", "重量": 8, "厚度": 0.84 },
            { "GroupName": "乙班", "重量": 9, "厚度": 0.85 },
            { "GroupName": "乙班", "重量": 11, "厚度": 0.80 }
        ], //SPC控件对应的数据
        AlarmCells: [
            { Row: 0, Col: 1, AlarmColor: "#ff6699" },
            { Row: 1, Col: 1, AlarmColor: "#994c00" }
        ], //报警点信息
        AbnormalRows: [
            0, 3
        ]//异常点信息
    };
    testGridData = {
        "ChartData": [
            { "SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "1", "标识": 1 },
            { "SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "2", "标识": 2 },
            { "SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "3", "标识": 3 },
            { "SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "4", "标识": 4 },
            { "SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "5", "标识": 5 },
            { "SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "6", "标识": 6 },
            { "SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "7", "标识": 7 },
            { "SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "8", "标识": 8 },
            { "SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "9", "标识": 9 },
            { "SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "10", "标识": 10 },
            { "SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "11", "标识": 11 },
            { "SHIFT": "甲", "VALUE": "12", "VALUE_ORDER": "12", "标识": 12 },
            { "SHIFT": "甲", "VALUE": "11.9", "VALUE_ORDER": "13", "标识": 13 },
            { "SHIFT": "甲", "VALUE": "12", "VALUE_ORDER": "14", "标识": 14 },
            { "SHIFT": "甲", "VALUE": "11", "VALUE_ORDER": "15", "标识": 15 },
            { "SHIFT": "甲", "VALUE": "12", "VALUE_ORDER": "16", "标识": 16 },
            { "SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "17", "标识": 17 },
            { "SHIFT": "甲", "VALUE": "6.9", "VALUE_ORDER": "18", "标识": 18 },
            { "SHIFT": "甲", "VALUE": "5.5", "VALUE_ORDER": "19", "标识": 19 },
            { "SHIFT": "甲", "VALUE": "7.8", "VALUE_ORDER": "20", "标识": 20 },
            { "SHIFT": "甲", "VALUE": "8.9", "VALUE_ORDER": "21", "标识": 21 },
            { "SHIFT": "甲", "VALUE": "7", "VALUE_ORDER": "22", "标识": 22 },
            { "SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "23", "标识": 23 },
            { "SHIFT": "甲", "VALUE": "7", "VALUE_ORDER": "24", "标识": 24 },
            { "SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "25", "标识": 25 },
            { "SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "26", "标识": 26 },
            { "SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "27", "标识": 27 },
            { "SHIFT": "甲", "VALUE": "10.1", "VALUE_ORDER": "28", "标识": 28 },
            { "SHIFT": "甲", "VALUE": "10.2", "VALUE_ORDER": "29", "标识": 29 },
            { "SHIFT": "甲", "VALUE": "10.3", "VALUE_ORDER": "30", "标识": 30 },
            { "SHIFT": "甲", "VALUE": "10.4", "VALUE_ORDER": "31", "标识": 31 },
            { "SHIFT": "甲", "VALUE": "10.5", "VALUE_ORDER": "32", "标识": 32 },
            { "SHIFT": "甲", "VALUE": "10.6", "VALUE_ORDER": "33", "标识": 33 },
            { "SHIFT": "甲", "VALUE": "13.4", "VALUE_ORDER": "34", "标识": 34 },
            { "SHIFT": "甲", "VALUE": "13.5", "VALUE_ORDER": "35", "标识": 35 }
        ],
        "AlarmCells": [
            { "Row": 1, "Col": 1, "AlarmColor": "#fd5530" },
            { "Row": 3, "Col": 1, "AlarmColor": "#fd5530" },
            { "Row": 6, "Col": 1, "AlarmColor": "#fd5530" },
            { "Row": 8, "Col": 1, "AlarmColor": "#fd5530" },
            { "Row": 10, "Col": 1, "AlarmColor": "#fd5530" },
            { "Row": 11, "Col": 1, "AlarmColor": "#ff0" },
            { "Row": 12, "Col": 1, "AlarmColor": "#ff0" },
            { "Row": 13, "Col": 1, "AlarmColor": "#ff0" },
            { "Row": 15, "Col": 1, "AlarmColor": "#ff0" },
            { "Row": 17, "Col": 1, "AlarmColor": "#ee82ee" },
            { "Row": 18, "Col": 1, "AlarmColor": "#ee82ee" },
            { "Row": 19, "Col": 1, "AlarmColor": "#ee82ee" },
            { "Row": 21, "Col": 1, "AlarmColor": "#ee82ee" },
            { "Row": 23, "Col": 1, "AlarmColor": "#ee82ee" },
            { "Row": 25, "Col": 1, "AlarmColor": "#fd5530" },
            { "Row": 28, "Col": 1, "AlarmColor": "#34fd43" },
            { "Row": 29, "Col": 1, "AlarmColor": "#34fd43" },
            { "Row": 30, "Col": 1, "AlarmColor": "#34fd43" },
            { "Row": 31, "Col": 1, "AlarmColor": "#34fd43" },
            { "Row": 32, "Col": 1, "AlarmColor": "#34fd43" },
            { "Row": 33, "Col": 1, "AlarmColor": "#34fd43" },
            { "Row": 34, "Col": 1, "AlarmColor": "#34fd43" }
        ],
        "AbnormalRows": [29]
    }
    //测试
    //Agi.view.advance.refreshGridData(testGridData);
})();

//region 20131220 10:22 markeluo 数据处理
Namespace.register("Agi.Controls.AdvanceDataGrid");
//判断Number类型数据是否为空，若为空则进行替换
Agi.Controls.AdvanceDataGrid.NumberArrayConvertSort = function (_OldArray) {
    if (_OldArray != null && _OldArray.length > 0) {
        var ConvertArray = [];
        for (var i = 0; i < _OldArray.length; i++) {
            ConvertArray.push(eval(_OldArray[i]));
        }
        return ConvertArray.sort();
    }
    return [];
}
//格式化钻取参数值，并返回格式化后的值
Agi.Controls.AdvanceDataGrid.FormatParsValue = function (_OldValue, _FormatFunName) {
    if (_FormatFunName != null && _FormatFunName != "") {
        var FormatFun = eval("Agi.FunLibrary.Items." + _FormatFunName);
        _OldValue = FormatFun(_OldValue);
    }
    return _OldValue;
}
//endregion
