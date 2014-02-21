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
        if (!menu_state) {
            $(".menu").transit({x: -35});
            menu_state = !menu_state;
            $(".pointer").transit({rotate: 90});
            $(".data").transit({y: 0});
            $("#workspace").parent().css(
                {
                    height: "auto",
                    overflow: "hidden"
                }
            );
        }
        else {
            $(".menu").transit({x: 0});
            menu_state = !menu_state;
            $(".pointer").transit({rotate: -90});
            $(".pop").transit({x: 0});
        }
    });
//点击菜单按钮
    $(".menu>.content>div div").live("click", function () {
        $(".menu>.content>div div").css("backgroundColor", "transparent");
        $(this).css("backgroundColor", "orange");
        switch ($(this).text().trim()) {
            case "导出":
                $(".pop").each(function (i, item) {
                    if (!$(item).hasClass("popExport")) {
                        $(item).transit({x: 0, opacity: 0});
                    }
                });
                setTimeout(
                    function () {
                        $(".popExport").transit({x: -190, opacity: 1});
                    }, 500
                );
                break;
            case "信息":
                $(".pop").each(function (i, item) {
                    if (!$(item).hasClass("popInfo")) {
                        $(item).transit({x: 0, opacity: 0});
                    }
                });
                setTimeout(
                    function () {
                        $(".popInfo").transit({x: -270, opacity: 1});
                    }, 500
                );
                break;
            default:
                var show = function () {
                    $(".pop1").css({
                        marginTop: -($(".pop1").height() / 2)
                    });
                    $(".pop1").transit({x: -($(".pop1").width() + 70), opacity: 1});
                }
                $(".pop").each(function (i, item) {
                    if (!$(item).hasClass("pop1")) {
                        $(item).transit({x: 0});
                    }
                });
                var element = this;
                $(".pop1").transit({x: 0, opacity: 0}, function () {
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
//数据表格
    var editedCells = [];
    var lastEditRowID;
    var gridOptions = {
        datatype: "local",
        autowidth: true,
        height: 165,
        scroll: false,
        scrollOffset: 0,
        colNames: ['标识', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
        colModel: [
            {name: 'id', index: 'id', width: 60, sorttype: "int"},
            {name: 'invdate', index: 'invdate', width: 90, sorttype: "date", editable: true},
            {name: 'name', index: 'name', width: 100, editable: true},
            {name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", editable: true},
            {name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float", editable: true},
            {name: 'total', index: 'total', width: 80, align: "right", sorttype: "float", editable: true},
            {name: 'note', index: 'note', width: 150, sortable: false, editable: true}
        ],
        multiselect: true,
        rowNum: 7,
        pager: "#data_pager",
        pagerpos: "left",
        pginput: false,
        viewrecords: true,
        ondblClickRow: function (rowID) {
            if (rowID && rowID !== lastEditRowID) {
                jQuery('#data_table').jqGrid('restoreRow', lastEditRowID);
                jQuery('#data_table').jqGrid('editRow', rowID, true, null, null, "clientArray", null, function () {
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
        gridComplete: function () {
            var ids = $("#data_table").jqGrid("getDataIDs");
            $(".toolbar .count").text(ids.length);
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
//显示表格
    $(".PanelSty").live("dblclick", function () {
//    $("#adv_main").live("dblclick", function (e) {
//        if (e.srcElement.id !== "adv_main")return;
        //绑定数据
        var control = Agi.Controls.FindControlByPanel(this.id);
        var data = control.GetSPCViewGridData();
        Agi.view.advance.refreshGridData(data);
        //
        $(".menu").transit({x: 0});
        menu_state = !menu_state;
        $(".pointer").transit({rotate: -90});
        $(".pop").transit({x: 0});
    });
//    $(".PanelSty").live("click", function () {
    //mousedown
    $(".PanelSty").live("mouseup", function () {
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
        $(".menu").transit({x: 0});
        menu_state = !menu_state;
        $(".pointer").transit({rotate: -90});
        $(".pop").transit({x: 0});
    });
//关闭表格
    $(".toolbar .close").click(function () {
        $(".data").transit({y: 0});
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
                for (var i = selectedRows.length - 1; i >= 0; i--) {
                    var selectedRow = selectedRows[i];
                    $("#data_table").jqGrid('delRowData', selectedRow);
                    $(this).attr("disabled", "disabled");
                    delete myData[selectedRow];
                }
                break;
            case "筛选":
                //显示
                $(".filterBox").show().css("opacity", 0).transit({opacity: 1});
                $(this).attr("disabled", "disabled");
                //绑定
                $("filterBox_fieldNames").empty();
                var columnNames = $("#data_table").jqGrid("getGridParam", "colNames");
                $("#filterBox_fieldNames").html("");//20130922 15:34 markeluo 每次填充栏位前先清空栏位内元素
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
                var rowData = $("#data_table").jqGrid('getRowData');
                for (var i = 0; i < rowData.length; i++) {
                    var data = rowData[i];
                    delete data["标识"];
                }
//                var control = Agi.Controls.FindControl(this.id);//此方法错误，需要传入控件的ID
                Agi.view.advance.currentControl.SPCViewRefreshByGridData(rowData);
                break;
        }
    });
//筛选框事件
    $("#filterBox_save").click(function () {
        $(".filterBox").transit({opacity: 0}, function () {
            $(".filterBox").hide();
        });
        $(".toolbar .filter").removeAttr("disabled");
        //筛选
        //getCell
        var columnName = $("#filterBox_fieldNames").val();
        var rule = $("#filterBox_rule").val();
        var source = $("#filterBox_source").val();
        var number = $("#filterBox_number").val();
        switch (source) {
            case "固定值":
                var newData = [];
                for (var i = 0; i < myData.length; i++) {
                    var data = myData[i];
                    var statement = data[columnName] + rule + number;
                    if (eval(statement)) {
                        newData.push(data);
                    }
                }
                $("#data_table").jqGrid('clearGridData');
                for (var i = 0; i <= newData.length; i++) {
                    $("#data_table").jqGrid('addRowData', i + 1, newData[i]);
                }
                break;
            case "数据列":
                var newData = [];
                for (var i = 0; i < myData.length; i++) {
                    var data = myData[i];
                    var statement = data[columnName] + rule + data[number];
                    if (eval(statement)) {
                        newData.push(data);
                    }
                }
                $("#data_table").jqGrid('clearGridData');
                for (var i = 0; i <= newData.length; i++) {
                    $("#data_table").jqGrid('addRowData', i + 1, newData[i]);
                }
                break;
        }
    });
    $("#filterBox_cancel").click(function () {
        $(".filterBox").transit({opacity: 0}, function () {
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
            $(".data").transit({y: -260});
            $("#workspace").parent().css(
                {
                    height: parseInt($("#workspace").parent().height()) - 250,
                    overflow: "scroll"
                }
            );
            //列
            var columnNames = ["标识"];
            var columnModels = [
                {name: "标识", index: "标识", width: 50, sorttype: "int"}
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
                myData.push(chartData);
//                $("#data_table").jqGrid('addRowData', i + 1, chartData);
            }
            //
            gridOptions.data = myData;
            $("#data_table").jqGrid(gridOptions);
            //异常点
            var myPage = Math.ceil((abnormalRows[0] + 1) / 7);
            if (!isNaN(myPage)) {
                $("#data_table").jqGrid("setGridParam", {page: myPage}).trigger("reloadGrid");
            }
        }
    }
//模拟测试
    var testGridData = {
        ChartData: [
            {"GroupName": "甲班", "重量": 12, "厚度": 0.85},
            {"GroupName": "甲班", "重量": 8, "厚度": 0.84},
            {"GroupName": "乙班", "重量": 9, "厚度": 0.85},
            {"GroupName": "乙班", "重量": 11, "厚度": 0.80}
        ],//SPC控件对应的数据
        AlarmCells: [
            {Row: 0, Col: 1, AlarmColor: "#ff6699"},
            {Row: 1, Col: 1, AlarmColor: "#994c00"}
        ],//报警点信息
        AbnormalRows: [
            0, 3
        ]//异常点信息
    };
    testGridData = {
        "ChartData": [
            {"SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "1", "标识": 1},
            {"SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "2", "标识": 2},
            {"SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "3", "标识": 3},
            {"SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "4", "标识": 4},
            {"SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "5", "标识": 5},
            {"SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "6", "标识": 6},
            {"SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "7", "标识": 7},
            {"SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "8", "标识": 8},
            {"SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "9", "标识": 9},
            {"SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "10", "标识": 10},
            {"SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "11", "标识": 11},
            {"SHIFT": "甲", "VALUE": "12", "VALUE_ORDER": "12", "标识": 12},
            {"SHIFT": "甲", "VALUE": "11.9", "VALUE_ORDER": "13", "标识": 13},
            {"SHIFT": "甲", "VALUE": "12", "VALUE_ORDER": "14", "标识": 14},
            {"SHIFT": "甲", "VALUE": "11", "VALUE_ORDER": "15", "标识": 15},
            {"SHIFT": "甲", "VALUE": "12", "VALUE_ORDER": "16", "标识": 16},
            {"SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "17", "标识": 17},
            {"SHIFT": "甲", "VALUE": "6.9", "VALUE_ORDER": "18", "标识": 18},
            {"SHIFT": "甲", "VALUE": "5.5", "VALUE_ORDER": "19", "标识": 19},
            {"SHIFT": "甲", "VALUE": "7.8", "VALUE_ORDER": "20", "标识": 20},
            {"SHIFT": "甲", "VALUE": "8.9", "VALUE_ORDER": "21", "标识": 21},
            {"SHIFT": "甲", "VALUE": "7", "VALUE_ORDER": "22", "标识": 22},
            {"SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "23", "标识": 23},
            {"SHIFT": "甲", "VALUE": "7", "VALUE_ORDER": "24", "标识": 24},
            {"SHIFT": "甲", "VALUE": "8", "VALUE_ORDER": "25", "标识": 25},
            {"SHIFT": "甲", "VALUE": "9", "VALUE_ORDER": "26", "标识": 26},
            {"SHIFT": "甲", "VALUE": "10", "VALUE_ORDER": "27", "标识": 27},
            {"SHIFT": "甲", "VALUE": "10.1", "VALUE_ORDER": "28", "标识": 28},
            {"SHIFT": "甲", "VALUE": "10.2", "VALUE_ORDER": "29", "标识": 29},
            {"SHIFT": "甲", "VALUE": "10.3", "VALUE_ORDER": "30", "标识": 30},
            {"SHIFT": "甲", "VALUE": "10.4", "VALUE_ORDER": "31", "标识": 31},
            {"SHIFT": "甲", "VALUE": "10.5", "VALUE_ORDER": "32", "标识": 32},
            {"SHIFT": "甲", "VALUE": "10.6", "VALUE_ORDER": "33", "标识": 33},
            {"SHIFT": "甲", "VALUE": "13.4", "VALUE_ORDER": "34", "标识": 34},
            {"SHIFT": "甲", "VALUE": "13.5", "VALUE_ORDER": "35", "标识": 35}
        ],
        "AlarmCells": [
            {"Row": 1, "Col": 1, "AlarmColor": "#fd5530"},
            {"Row": 3, "Col": 1, "AlarmColor": "#fd5530"},
            {"Row": 6, "Col": 1, "AlarmColor": "#fd5530"},
            {"Row": 8, "Col": 1, "AlarmColor": "#fd5530"},
            {"Row": 10, "Col": 1, "AlarmColor": "#fd5530"},
            {"Row": 11, "Col": 1, "AlarmColor": "#ff0"},
            {"Row": 12, "Col": 1, "AlarmColor": "#ff0"},
            {"Row": 13, "Col": 1, "AlarmColor": "#ff0"},
            {"Row": 15, "Col": 1, "AlarmColor": "#ff0"},
            {"Row": 17, "Col": 1, "AlarmColor": "#ee82ee"},
            {"Row": 18, "Col": 1, "AlarmColor": "#ee82ee"},
            {"Row": 19, "Col": 1, "AlarmColor": "#ee82ee"},
            {"Row": 21, "Col": 1, "AlarmColor": "#ee82ee"},
            {"Row": 23, "Col": 1, "AlarmColor": "#ee82ee"},
            {"Row": 25, "Col": 1, "AlarmColor": "#fd5530"},
            {"Row": 28, "Col": 1, "AlarmColor": "#34fd43"},
            {"Row": 29, "Col": 1, "AlarmColor": "#34fd43"},
            {"Row": 30, "Col": 1, "AlarmColor": "#34fd43"},
            {"Row": 31, "Col": 1, "AlarmColor": "#34fd43"},
            {"Row": 32, "Col": 1, "AlarmColor": "#34fd43"},
            {"Row": 33, "Col": 1, "AlarmColor": "#34fd43"},
            {"Row": 34, "Col": 1, "AlarmColor": "#34fd43"}
        ],
        "AbnormalRows": [29]}
//测试
//    Agi.view.advance.refreshGridData(testGridData);
})();
