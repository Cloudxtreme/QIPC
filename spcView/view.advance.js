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
                    VCreateAim:$("#spcviewcreataim").find("textarea").val(),
                    VSummary:$("#spcviewcreatsummary").find("textarea").val()
                },function(_result){
                    if (_result.result == "true") {
                        AgiCommonDialogBox.Alert(_result.message);
                        $(".pop").transit({x: 0});
                    }else{
                        AgiCommonDialogBox.Alert(_result.message);
                    }
                });
                break;
            case "取消":
                $(".pop").transit({x: 0});
                break;
        }
    });
//数据表格
    var editedCells = [];
    var lastEditRowID;
    var PageDataDrillPars =null;
    var CellPageDataDrillItem=null;
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
                onContextMenu: function(event) {
                    CellPageDataDrillItem=null;
                    PageDataDrillPars = Agi.view.advance.currentControl.SPCViewDataExtractURLGet();
                    //格式:[{drillname:"硅钢统计月数据钻取日数据",drillcolumn:"统计时间",drillpage:"硅钢日统计",drillpars:[{parsname:"AA",parstype:"0",parsvalue:"column1"}]}]
                    if(PageDataDrillPars!=null && PageDataDrillPars.length>0){
                        var rowtdcellindex=event.currentTarget.cellIndex;
                        if(rowtdcellindex>1){
                            var tdColumnName=$("#gview_data_table .ui-jqgrid-htable th div")[rowtdcellindex].innerText;
                            var liItems="";
                            for(var i=0;i<PageDataDrillPars.length;i++){
                                if(PageDataDrillPars[i].drillcolumn==tdColumnName){
                                    CellPageDataDrillItem=PageDataDrillPars[i];
                                    liItems+="<li class='Drilldatamenuitem' title='"+PageDataDrillPars[i].drillname+"'>"+PageDataDrillPars[i].drillname+"</li>";
                                }
                            }
                            if(liItems!=""){
                                $("#data_menu").find("ul").html(liItems);
                            }else{
//                                AgiCommonDialogBox.Alert("该列未配置钻取信息，无法完成钻取操作!");
                                $("#data_menu").find("ul").html("<li class='DrilldataTipsty'>该列无钻取信息！</li>");;
                            }
                        }
                    }else{
                        $("#data_menu").find("ul").html("<li class='DrilldataTipsty'>该控件未配置钻取信息！</li>");
                    }
                    return true;
                },
                bindings: {
                    ".Drilldatamenuitem": function(trigger,tar,item) {//选中钻取项，执行钻取操作
                        PageDataDrillPars = Agi.view.advance.currentControl.SPCViewDataExtractURLGet();
                        //格式:[{drillname:"硅钢统计月数据钻取日数据",drillcolumn:"统计时间",drillpage:"硅钢日统计",drillpars:[{parsname:"AA",parstype:"0",parsvalue:"column1"}]}]
                        var CellDrillName=$(item).attr("title");
                        for(var i=0;i<PageDataDrillPars.length;i++){
                            if(CellDrillName==PageDataDrillPars[i].drillname){
                                CellPageDataDrillItem=PageDataDrillPars[i];
                                break;
                            }
                        }
                        var CellDrillURL="";
                        if(CellPageDataDrillItem!=null){
                            CellDrillURL=Agi.SPCViewServiceAddress+CellPageDataDrillItem.drillpage+"&isView=true&";
                            if(CellPageDataDrillItem.drillpars!=null && CellPageDataDrillItem.drillpars.length>0){
                                var ThisParsValue="";
                                var selectedRow =trigger.parentNode;
                                var selectedData =[];
                                if(selectedRow!=null && selectedRow.children!=null && selectedRow.children.length>0){
                                    var Itemstr=null;
                                    for(var j=0;j<selectedRow.children.length;j++){
                                        selectedData.push({ColumnName:trigger.parentNode.children[j].getAttribute("aria-describedby").replace("data_table_",""),Value:trigger.parentNode.children[j].innerText});
                                    }
                                }

                                for(var i=0;i<CellPageDataDrillItem.drillpars.length;i++){
                                    ThisParsValue="";
                                    if(CellPageDataDrillItem.drillpars[i].parstype=="1"){
                                        CellDrillURL+=CellPageDataDrillItem.drillpars[i].parsname+"="+Agi.Controls.AdvanceDataGrid.FormatParsValue(CellPageDataDrillItem.drillpars[i].parsvalue,CellPageDataDrillItem.drillpars[i].parsvaluefun)+"&";
                                    }else{
                                        if(CellPageDataDrillItem.drillpars[i].parstype=="0"){
                                            for(var z=0;z<selectedData.length;z++){
                                                if(selectedData[z].ColumnName==CellPageDataDrillItem.drillpars[i].parsvalue){
                                                    ThisParsValue=selectedData[z].Value;
                                                    break;
                                                }
                                            }
                                            CellDrillURL+=CellPageDataDrillItem.drillpars[i].parsname+"="+Agi.Controls.AdvanceDataGrid.FormatParsValue(ThisParsValue,CellPageDataDrillItem.drillpars[i].parsvaluefun)+"&";
                                        }else{
                                            var allRowData = $("#data_table").jqGrid("getGridParam", "data");
                                            ThisParsValue="";
                                            if(allRowData!=null &&allRowData.length>0){
                                                for(var Rindex=0;Rindex<allRowData.length;Rindex++){
                                                    ThisParsValue+=allRowData[Rindex][CellPageDataDrillItem.drillpars[i].parsvalue]+",";
                                                }
                                            }
                                            CellDrillURL+=CellPageDataDrillItem.drillpars[i].parsname+"="+Agi.Controls.AdvanceDataGrid.FormatParsValue(ThisParsValue,CellPageDataDrillItem.drillpars[i].parsvaluefun)+"&";
                                        }
                                    }
                                }
                                ThisParsValue=selectedRow=selectedData=null;
                            }
                            CellDrillURL+="ID=";

                            var DrillPageName=CellPageDataDrillItem.drillpage.substr(0,CellPageDataDrillItem.drillpage.lastIndexOf("_"));
                            var DrillPageVesion=CellPageDataDrillItem.drillpage.substr((CellPageDataDrillItem.drillpage.lastIndexOf("_")+1));

                            //根据页面名称和版本号获取页面ID
                            Agi.PageDataDrill.GetPageFilePath(DrillPageName,DrillPageVesion,function(_result){
                                if(_result.result && _result.result=="true"){
                                    CellDrillURL+=_result.data.ID;

                                    //20131129 15:44 添加钻取权限管理，判断目标页面是否有权限
                                    GetDrillPageAuth(CellDrillURL,function(_result){
                                        if(_result){
                                            window.open(CellDrillURL);
                                        }else{
                                            AgiCommonDialogBox.Alert("您对目标页面没有权限，请联系管理员!");
                                        }
                                        DrillPageName=DrillPageVesion=null;
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
        $(".menu").transit({x: 0});
        menu_state = !menu_state;
        $(".pointer").transit({rotate: -90});
        $(".pop").transit({x: 0});
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
                selectedRows=Agi.Controls.AdvanceDataGrid.NumberArrayConvertSort(selectedRows);
                for (var i = selectedRows.length - 1; i >= 0; i--) {
                    var selectedRow = selectedRows[i]-i;
                    $("#data_table").jqGrid('delRowData', selectedRow);
                    $("#data_table").trigger("reloadGrid");
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
                    var statement =data[columnName]+ rule+number;
                    var BolSucced=false;
                    if(isNaN(number)){//字符串
                        try{
                            statement = "'"+data[columnName]+"'" + rule + "'"+number+"'";
                            BolSucced=eval(statement);
                        }catch(ev){
                            statement =data[columnName]+ rule+number;
                            BolSucced=eval(statement);
                        }
                     }else{//数值
                        try{
                            BolSucced=eval(statement);
                        }catch(ev){
                            statement = "'"+data[columnName]+"'" + rule + "'"+number+"'";
                            BolSucced=eval(statement);
                        }
                    }
                    if (BolSucced) {
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
                    var statement =data[columnName]+ rule +data[number];
                    var BolSucced=false;
                    if(isNaN(number)){//字符串
                        try{
                            statement ="'"+data[columnName]+"'" + rule + "'"+data[number]+"'";
                            BolSucced=eval(statement);
                        }catch(ev){
                            statement =data[columnName]+ rule +data[number];
                            BolSucced=eval(statement);
                        }
                    }else{//数值
                        try{
                            BolSucced=eval(statement);
                        }catch(ev){
                            statement ="'"+data[columnName]+"'" + rule + "'"+data[number]+"'";
                            BolSucced=eval(statement);
                        }
                    }

                    if (BolSucced) {
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

            $(".popupLayer").hide();//隐藏异常点录入功能弹出窗口
        },
        RightMenuOPenClose:function(ShowState){
            if(!ShowState){
                $(".menu").transit({x: 0});
                $(".pointer").transit({rotate: -90});
                $(".pop").transit({x: 0});
            }else{
                $(".menu").transit({x: -35});
                $(".pointer").transit({rotate: 90});
                $(".data").transit({y: 0});
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

})();

//region 20131220 10:22 markeluo 数据处理
Namespace.register("Agi.Controls.AdvanceDataGrid");
//判断Number类型数据是否为空，若为空则进行替换
Agi.Controls.AdvanceDataGrid.NumberArrayConvertSort=function(_OldArray){
    if(_OldArray!=null &&_OldArray.length>0){
        var ConvertArray=[];
        for(var i=0;i<_OldArray.length;i++){
            ConvertArray.push(eval(_OldArray[i]));
        }
       return ConvertArray.sort();
    }
    return [];
}
//格式化钻取参数值，并返回格式化后的值
Agi.Controls.AdvanceDataGrid.FormatParsValue=function(_OldValue,_FormatFunName){
    if(_FormatFunName!=null && _FormatFunName!=""){
        var FormatFun=eval("Agi.FunLibrary.Items."+_FormatFunName);
        _OldValue=FormatFun(_OldValue);
    }
    return _OldValue;
}
//endregion
