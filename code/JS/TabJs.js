
/// <reference path="jquery-1.7.2.min.js" />
var ExpressionState = "add";
var ViewSql = "";
var boolVisable = false;
var boolCheck = true;
var EditCloumnName = "";
$("#dsbtm1").live('click', function () {
    $("#dstop3").hide();
    $("#dstop2").hide();
    $("#dstop4").hide();
    $("#dstop1").show();
    $("#dsbtm1").css("background-color", "#fff");
    $("#dsbtm1").css("background-image", "none");
    $("#dsbtm2").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm3").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm4").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");

});
$("#dsbtm2").live('click', function () {
    $("#dstop3").hide();
    $("#dstop1").hide();
    $("#dstop4").hide();
    $("#dstop2").show();
    $("#dsbtm2").css("background-color", "#fff");
    $("#dsbtm2").css("background-image", "none");
    $("#dsbtm1").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm3").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm4").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
});

$("#dsbtm3").live('click', function () {
    $("#dstop1").hide();
    $("#dstop2").hide();
    $("#dstop4").hide();
    $("#dstop3").show();
    $("#dsbtm3").css("background-color", "#fff");
    $("#dsbtm3").css("background-image", "none");
    $("#dsbtm2").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm1").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm4").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
});

$("#dsbtm4").live('click', function () {
    $("#dstop1").hide();
    $("#dstop2").hide();
    $("#dstop3").hide();
    $("#dstop4").show();
    $("#dsbtm4").css("background-color", "#fff");
    $("#dsbtm4").css("background-image", "none");
    $("#dsbtm2").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm1").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#dsbtm3").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
});
function BindGrid1() {
    $("#gridone").find("tbody").html("");
    $("#gridone").kendoGrid({
        dataSource: {
            data: dataone
        },
        height: 250,
        selectable: "single row",
        groupable: false,
        scrollable: false,
        sortable: false,
        pageable: false,
        columns: [{
            field: "dscolums",
            width: 90,
            title: "列名"
        }, {
            field: "dstype",
            width: 80,
            title: "类型"
        }, {
            field: "dsexpression",
            width: 90,
            title: "表达式"
        }, {
            field: "dsaggregate",
            width: 60,
            title: "聚合函数",
            //20130121 倪飘 修改dataset聚合函数中没有AVG函数的bug
            template: "<select id='dsaggregate'><option value=''></option><option value='SUM'>SUM</option><option value='COUNT'>COUNT</option><option value='MAX'>MAX</option><option value='MIN'>MIN</option><option value='AVG'>AVG</option></select>"
        }, {
            field: "dsshow",
            width: 80,
            title: "是否显示",
            template: "<input type='checkbox' id='dsshow' value='' />"

        }, {
            field: "dsGroup",
            width: 80,
            title: "是否分组",
            template: "<input type='checkbox' id='dsGroup' value='' />"

        },{
             field: "aliases",
             width: 90,
             title: "别名",
             template: "<input type='text' id='aliases' value=''/>"
         }
        ]
    });
    var dsgridone = $("#gridone").data("kendoGrid");
    var dsgridtbodytrs=dsgridone.tbody.find("tr");
    for (var i = 0; i < dsgridone.dataSource._data.length; i++) {
        var tdE = $(dsgridtbodytrs[i]).find("td")[2].innerText;
        if (tdE != "") {
            $(dsgridtbodytrs[0]).find("td")[1].innerText
            $(dsgridtbodytrs[i]).find("td")[2].innerText = "";
            $(dsgridtbodytrs[i]).find("td")[1].innerText = "";
            $($(dsgridtbodytrs[i]).find("td")[2]).append('<input type="hidden" id="EValue" value="' + tdE + '" ><button id="btnEditE" onclick="_EditE()" class="exeditbtn">修改</button><button class="exeditbtn"  id="btnDelE" onclick="_DelE()"  >刪除</button>');
            $(dsgridtbodytrs[i]).find("td")[3].innerText = "";
            $(dsgridtbodytrs[i]).find("td")[4].innerText = "";
            //20130111 倪飘 解决Datasets-添加计算列-重新编辑带有计算列的Dataset，计算列在编辑页面消失问题
            $(dsgridtbodytrs[i]).find("td")[5].innerText = "";
        }
        //20140221 范金鹏 新建dataset时直接将列名绑定到别名列
        var dsgridonetbotytrstemp = null;
        dsgridonetbotytrstemp = $(dsgridone.tbody.find("tr")[i]);
        dsgridonetbotytrstemp.find("#aliases").val(dsgridone.dataSource._data[i].aliases);  
        //end                
    }
    dsgridtbodytrs=null;//DOM查询优化，临时变量清空
}
function _EditE() {
    ExpressionState = "update";
    var _columnName = $("#gridone").data("kendoGrid").select().find("td")[0].innerText;
    var _Expression = $("#gridone").data("kendoGrid").select().find("#EValue").val();
    EditCloumnName = _columnName;
    $("#txtCloumnName").val(_columnName); //列名
    $("#txtExpression").val(_Expression); //表达式
//    $("#txtCloumnName").attr('readonly', true);
    BindDropE();
//    $('#SetExpression').draggable();
//    $('#SetExpression').modal({ backdrop: false, keyboard: false, show: true }); //加载弹出层
    dialogs._SetExpression.dialog('open');
    /*临时变量清空*/
    _columnName = _Expression = null;
}
function _DelE() {
    var _columnName = $("#gridone").data("kendoGrid").select().find("td")[0].innerText;
    var _gridTwo = $("#gridtwo").data("kendoGrid");
    var gridtwotbodytrs=$("#gridtwo").find("tbody>tr");
    for (var k = 0; k < gridtwotbodytrs.length; k++) {
        var _cloumnName2 = $(gridtwotbodytrs[k]).find("td")[0].innerText;
        if (_cloumnName2 == _columnName) {
            $($("#gridtwo").data("kendoGrid").tbody.find("tr")[k]).remove();
            break;
        }
    }
    $("#gridone").data("kendoGrid").select().remove();
    /*临时变量清空*/
    _columnName = _gridTwo = gridtwotbodytrs = null;
}
function BindGrid2() {
    $("#gridtwo").find("tbody").html("");
    $("#gridtwo").kendoGrid({
        dataSource: {
            data: datatwo
        },
        height: 250,
        selectable: "single row",
        groupable: false,
        scrollable: false,
        sortable: false,
        pageable: false,
        columns: [{
            field: "dscolums",
            width: 90,
            title: "列名"
        }, {
            field: "dsgroping",
            width: 100,
            title: "字段排序",
            template: "<input type='checkbox' id='dsgroping' value='' />"
        }, {
            field: "SequenceWay",
            width: 60,
            title: "排序方式",
            template: "<select id='SequenceWay'><option value=''></option><option value='ASC'>ASC</option><option value='DESC'>DESC</option></select>"
        }
        ]
    });
}
function AddDSGridData() {
    BindGrid1();
    BindGrid2();
}

function ShowOneTab() {
    $("#dstop3").hide();
    $("#dstop2").hide();
    $("#dstop4").hide();
    $("#dsbtm1").css("background-color", "#fff");
    $("#dsbtm1").css("background-image", "none");
}

var dsdata;
var dataone = [];
var Data1Column = []; //dateone中的,借用一下
var datatwo = [];
var Data2Column = []; //datetwo中的,借用一下
function GetAllVTData(dsname, vtname) {
    Data1Column = [];
    Data2Column = [];
    ShowOneTab();
    //绑定所有数据Dataet数据
    Agi.DatasetsManager.DSSGetVirtualTableByDSAndVT(dsname, vtname, function (result) {
        if (result.result) {
            $("#dsetdsource").val(dsname);
            $("#dsetdsource").attr("disabled", "true");
            $("#dsetvtable").val(vtname);
            $("#dsetvtable").attr("disabled", "true");
            //20130730 倪飘 20130723 首自信qpc项目接口参数更改
            $("#dsvttype").val("1");
            //end
            if (Agi.WebServiceConfig.Type === ".NET") {
                if (result.datasetData.SingleEntityInfo.SqlDefined.Schema != undefined) {
                    dsdata = result.datasetData.SingleEntityInfo.SqlDefined.Schema;
                    if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                        $.each(dsdata, function (i, val) {
                            var columname = val,
                            datatype = "";
                            dataone.push({
                                dscolums: columname,
                                dstype: datatype,
                                dsaggregate: null,
                                dsshow: false,
                                dsexpression: ""
                            });
                            Data1Column = dataone;
                            datatwo.push({
                                dscolums: columname,
                                dsgroping: false
                            });
                            Data2Column = datatwo;
                        });
                    }
                    else {
                        dataone.push({
                            dscolums: dsdata,
                            dstype: "",
                            dsaggregate: null,
                            dsshow: false,
                            dsexpression: ""
                        });
                        Data1Column = dataone;
                        datatwo.push({
                            dscolums: dsdata,
                            dsgroping: false
                        });
                        Data2Column = datatwo;
                    }
                }
            }
            else {
                /*  if (result.Data != undefined) {
                dsdata = result.Data;
                if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                for (var i = 0; i < dsdata.length; i++) {
                dataone.push({
                dscolums: dsdata[i].colName,
                dstype: dsdata[i].colType,
                dsaggregate: null,
                dsshow: false,
                dsexpression: ""
                });
                Data1Column = dataone;
                datatwo.push({
                dscolums: dsdata[i].colName,
                dsgroping: false
                });
                Data2Column = datatwo;
                }
                }
                else {
                dataone.push({
                dscolums: dsdata,
                dstype: "",
                dsaggregate: null,
                dsshow: false,
                dsexpression: ""
                });
                Data1Column = dataone;
                datatwo.push({
                dscolums: dsdata,
                dsgroping: false
                });
                Data2Column = datatwo;
                }
                }*/
                //20121211 markeluo 添加JAVA处理代码
                if (result.Data != undefined) {
                    dsdata = result.Data;
                    if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                        for (var i = 0; i < dsdata.length; i++) {
                            dataone.push({
                                dscolums: dsdata[i].colName,
                                dstype: dsdata[i].colType,
                                dsaggregate: null,
                                dsshow: false,
                                dsexpression: "",
                                aliases:dsdata[i].colName
                            });
                            Data1Column = dataone;
                            datatwo.push({
                                dscolums: dsdata[i].colName,
                                dsgroping: false
                            });
                            Data2Column = datatwo;
                        }
                    }
                    else {
                        dataone.push({
                            dscolums: dsdata,
                            dstype: "",
                            dsaggregate: null,
                            dsshow: false,
                            dsexpression: ""
                        });
                        Data1Column = dataone;
                        datatwo.push({
                            dscolums: dsdata,
                            dsgroping: false
                        });
                        Data2Column = datatwo;
                    }
                }

            }
            AddDSGridData();
            dataone = [];
            datatwo = [];
        }
    });

}
function GetAllSCData(dsname, vtname) {
    Data1Column = [];
    Data2Column = [];
    ShowOneTab();
    //绑定所有数据Dataet数据
    Agi.DatasetsManager.DSSGetVirtualTableByDSAndVT(dsname, vtname, function (result) {
        if (result.result) {
            $("#dsetdsource").val(dsname);
            $("#dsetdsource").attr("disabled", "true");
            $("#dsetvtable").val(vtname);
            $("#dsetvtable").attr("disabled", "true");
            //20130730 倪飘 20130723 首自信qpc项目接口参数更改
            $("#dsvttype").val("2");
            //end
            if (Agi.WebServiceConfig.Type === ".NET") {
                if (result.datasetData.SingleEntityInfo.ScDefined.Columns.Column != undefined) {
                    dsdata = result.datasetData.SingleEntityInfo.ScDefined.Columns.Column;
                    if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                        $.each(dsdata, function (i, val) {
                            var columname = val.Alias,
                                datatype = "",
                                dsshow = val.Visible,
                                dsgrouping = val.GroupBy;
                            dataone.push({
                                dscolums: columname,
                                dstype: datatype,
                                dsaggregate: null,
                                dsshow: dsshow,
                                dsexpression: ""
                            });
                            datatwo.push({
                                dscolums: columname,
                                dsgroping: dsgrouping
                            });
                        });
                        Data1Column = dataone;
                        Data2Column = datatwo;
                    }
                    else {
                        dataone.push({
                            dscolums: dsdata,
                            dstype: "",
                            dsaggregate: null,
                            dsshow: false,
                            dsexpression: ""
                        });
                        Data1Column = dataone;
                        datatwo.push({
                            dscolums: dsdata,
                            dsgroping: false
                        });
                        Data2Column = datatwo;
                    }

                }
            }
            else {
                //20121130 markeluo 添加JAVA的处理逻辑代码
                if (result.Data[0].Columns.Column != null && result.Data[0].Columns.Column.length > 0) {
                    dsdata = result.Data[0].Columns.Column;
                    if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                        $.each(dsdata, function (i, val) {
                            var columname = val.Alias,
                                datatype = "",
                                dsshow = val.Visible,
                                dsgrouping = val.GroupBy;
                            dataone.push({
                                dscolums: columname,
                                dstype: datatype,
                                dsaggregate: null,
                                dsshow: dsshow,
                                dsexpression: "",
                                aliases:columname
                            });
                            datatwo.push({
                                dscolums: columname,
                                dsgroping: dsgrouping
                            });
                        });
                        Data1Column = dataone;
                        Data2Column = datatwo;
                    }
                    else {
                        dataone.push({
                            dscolums: dsdata,
                            dstype: "",
                            dsaggregate: null,
                            dsshow: false,
                            dsexpression: ""
                        });
                        Data1Column = dataone;
                        datatwo.push({
                            dscolums: dsdata,
                            dsgroping: false
                        });
                        Data2Column = datatwo;
                    }
                }
            }

            AddDSGridData();
            dataone = [];
            datatwo = [];
        }
    });

}

function GetAllProData(dsname, vtname) {
    Data1Column = [];
    Data2Column = [];
    ShowOneTab();
    //绑定所有数据Dataet数据
    Agi.DatasetsManager.DSSGetVirtualTableByDSAndVT(dsname, vtname, function (result) {
        if (result.result) {
            $("#dsetdsource").val(dsname);
            $("#dsetdsource").attr("disabled", "true");
            $("#dsetvtable").val(vtname);
            $("#dsetvtable").attr("disabled", "true");
            //20130730 倪飘 20130723 首自信qpc项目接口参数更改
            $("#dsvttype").val("3");
            //end
            if (Agi.WebServiceConfig.Type === ".NET") {
                if (result.datasetData.SingleEntityInfo.SpDefined.Schema != undefined) {
                    dsdata = result.datasetData.SingleEntityInfo.SpDefined.Schema;
                    if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                        $.each(dsdata, function (i, val) {
                            var columname = val,
                            datatype = "";
                            dataone.push({
                                dscolums: columname,
                                dstype: datatype,
                                dsaggregate: null,
                                dsshow: false,
                                dsexpression: ""
                            });
                            Data1Column = dataone;
                            datatwo.push({
                                dscolums: columname,
                                dsgroping: false
                            });
                            Data2Column = datatwo;
                        });
                    }
                    else {
                        dataone.push({
                            dscolums: dsdata,
                            dstype: "",
                            dsaggregate: null,
                            dsshow: false,
                            dsexpression: ""
                        });
                        Data1Column = dataone;
                        datatwo.push({
                            dscolums: dsdata,
                            dsgroping: false
                        });
                        Data2Column = datatwo;
                    }
                }
            }
            else {
                /*  if (result.Data != undefined) {
                dsdata = result.Data;
                if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                for (var i = 0; i < dsdata.length; i++) {
                dataone.push({
                dscolums: dsdata[i].colName,
                dstype: dsdata[i].colType,
                dsaggregate: null,
                dsshow: false,
                dsexpression: ""
                });
                Data1Column = dataone;
                datatwo.push({
                dscolums: dsdata[i].colName,
                dsgroping: false
                });
                Data2Column = datatwo;
                }
                }
                else {
                dataone.push({
                dscolums: dsdata,
                dstype: "",
                dsaggregate: null,
                dsshow: false,
                dsexpression: ""
                });
                Data1Column = dataone;
                datatwo.push({
                dscolums: dsdata,
                dsgroping: false
                });
                Data2Column = datatwo;
                }
                }*/
                //20121211 markeluo 添加JAVA处理代码
                if (result.Data != undefined) {
                    dsdata = result.Data;
                    if (Object.prototype.toString.call(dsdata) === "[object Array]") {
                        for (var i = 0; i < dsdata.length; i++) {
                            dataone.push({
                                dscolums: dsdata[i].colName,
                                dstype: dsdata[i].colType,
                                dsaggregate: null,
                                dsshow: false,
                                dsexpression: "",
                                aliases: dsdata[i].colName
                            });
                            Data1Column = dataone;
                            datatwo.push({
                                dscolums: dsdata[i].colName,
                                dsgroping: false
                            });
                            Data2Column = datatwo;
                        }
                    }
                    else {
                        dataone.push({
                            dscolums: dsdata,
                            dstype: "",
                            dsaggregate: null,
                            dsshow: false,
                            dsexpression: ""
                        });
                        Data1Column = dataone;
                        datatwo.push({
                            dscolums: dsdata,
                            dsgroping: false
                        });
                        Data2Column = datatwo;
                    }
                }

            }
            AddDSGridData();
            dataone = [];
            datatwo = [];
        }
    });
}
//判断是否是数组
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}


//点击保存按钮保存dataset
$("#DataSetSave").live('click', function () {
    //获取基本信息
    var _DsName = $("#dsetname").val();
    //ID不能为空的判断
    if (_DsName.trim() == "") {
        AgiCommonDialogBox.Alert("名称不能为空，请填写DataSet名称！", null);
        return false;
    }
    var _Remark = $("#dsetmemeo").val();
    var _DataSourceName = $("#dsetdsource").val();
    var _VTTableName = $("#dsetvtable").val();
    var _DContrl = $("#dsetdcontrol").attr("value");
    //20130730 倪飘 20130723 首自信qpc项目接口参数更改
    var _VTType = $("#dsvttype").val();
    //end
    //获取表格的所有数据
    var dsgridone = $("#gridone").data("kendoGrid");
    var dsgridtwo = $("#gridtwo").data("kendoGrid");

    //定义要用到的数组
    var DataColumn = []; //自有列
    var CalColumn = []; //新增带有表达式的列
    var ClumnOrder = []; //数据查询方式，按照列先后顺序存放
    var SortingRules = [];

    var ThisGridonetbodytrs = $("#gridone").find("tbody>tr");
    var ThisGridtwotbodytrs = $("#gridtwo").find("tbody>tr");
    for (var i = 0; i < ThisGridonetbodytrs.length; i++) {
        var _columName2 = $(ThisGridonetbodytrs[i]).find("td")[0].innerText; //列名
        for (var j = 0; j < ThisGridtwotbodytrs.length; j++) {
            var _columName = $(ThisGridtwotbodytrs[j]).find("td")[0].innerText;
            var boolGroup = $($("#gridtwo").find("tbody").find("#dsgroping")[j]).attr("checked") == "checked" ? "true" : "false";
            var _type = $(ThisGridonetbodytrs[i]).find("td")[1].innerText; //数据类型
            var _Aggregate = $(ThisGridonetbodytrs[i]).find("#dsaggregate").val() == undefined ? "" : $(ThisGridonetbodytrs[i]).find("#dsaggregate").val(); //聚合函数
            var boolShow = $(ThisGridonetbodytrs[i]).find("#dsshow").attr("checked") == "checked" ? "true" : "false"; //是否显示
            var _expression = $(ThisGridonetbodytrs[i]).find("#EValue").val() == undefined ? "" : $(ThisGridonetbodytrs[i]).find("#EValue").val(); //表达式
            var _IsGroupBy = $(ThisGridonetbodytrs[i]).find("#dsGroup").attr("checked") == "checked" ? "true" : "false"; //是否分组
            //20140220 范金鹏 获取别名信息
            var aliases = $(ThisGridonetbodytrs[i]).find("#aliases").val() == undefined ? "" : $(ThisGridonetbodytrs[i]).find("#aliases").val(); //别名
            //end
            if (_columName == _columName2) {
                //循环获取表格里面的数据
                if (_Aggregate == "请选择") { _Aggregate = "" }
                //如果表达式不为空，说明是新增列
                if (_expression == "") {
                    DataColumn.push({
                        ID: _columName2,
                        DataType: _type,
                        Aggregator: _Aggregate,
                        GroupBy: _IsGroupBy,
                        Visible: boolShow,
                        Aliases: aliases
                    });
                }
                //如果表达式为空，说明是虚拟表自有列
                else {

                }
                //数据查询方式，按照列先后顺序存放
                ClumnOrder.push(_columName2);
            }
            //20130111 倪飘 解决Datasets-添加计算列-重新编辑带有计算列的Dataset，计算列在编辑页面消失问题
            else {
                if (_expression != "") {
                    var cccount = 0;
                    for (var g = 0; g < CalColumn.length; g++) {
                        if (CalColumn[g].Name == _columName2) {
                            cccount++;
                        }
                    }
                    if (cccount == 0) {
                        CalColumn.push({
                            Name: _columName2,
                            Expression: _expression
                        });
                    }
                }
            }
            //结束

            /*清空临时变量*/
            _columName = boolGroup = _type = _Aggregate = boolShow = _expression = _IsGroupBy = null;
        }

        /*清空临时变量*/
        _columName2 = null;
    }

    ThisGridtwotbodytrs = $("#gridtwo").find("tbody>tr");
    for (var k = 0; k < ThisGridtwotbodytrs.length; k++) {
        var _columName = $(ThisGridtwotbodytrs[k]).find("td")[0].innerText;
        var boolGroup = $($("#gridtwo").find("tbody").find("#dsgroping")[k]).attr("checked") == "checked" ? "true" : "false"; //排序
        var _GroupWay = $(ThisGridtwotbodytrs[k]).find("#SequenceWay").val() == undefined ? "" : $(ThisGridtwotbodytrs[k]).find("#SequenceWay").val(); //排序方式
        //order by
        if (boolGroup == "true") {
            if (_GroupWay == "") {
                AgiCommonDialogBox.Alert("请选择对应的排序方式！", null);
                return;
            }
            else {
                SortingRules.push(_columName + "#" + _GroupWay);
            }
        }
    }
    ThisGridonetbodytrs = ThisGridtwotbodytrs = null; //DOM查询优化，临时变量清空

    if (DataColumn != null && DataColumn.length > 0) {
        var BolIsSelVisibleCol = false;
        for (var i = 0; i < DataColumn.length; i++) {
            if (DataColumn[i].Visible === "true") {
                BolIsSelVisibleCol = true;
                break;
            }
        }
        if (!BolIsSelVisibleCol) {
            AgiCommonDialogBox.Alert("请勾选至少一个显示列后再保存！", null);
            return;
        }
        BolIsSelVisibleCol = null;
    } else {
        AgiCommonDialogBox.Alert("请勾选至少一个显示列后再保存！", null);
        return;
    }
    //开始保存啦
    //编辑DataSet保存
    if (IsSaveOrUpdate == "update") {
        //20130730 倪飘 20130723 首自信qpc项目接口参数更改
        Agi.DatasetsManager.DSSUpdate(_DsName, _Remark, _DataSourceName, _VTType, _VTTableName, _DContrl, 0, "root", DataColumn, CalColumn, ClumnOrder, SortingRules, function (result) {
            if (result.result) {
                //2014-02-20 coke 移动dataset
                MoveNewDataSetGroup(function(){

                    AddAllDatasets();//刷新主界面的DataSet列表
                    menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));//刷新新建页面左侧的DataSet列表
                    AgiCommonDialogBox.Alert(result.message, null);
                    boolIsSave = true;
                });

            }
            else {
                AgiCommonDialogBox.Alert(result.message, null);
            }

            /*清空临时变量*/
            _DsName = _Remark = _DataSourceName = _VTTableName = _DContrl = dsgridone = dsgridtwo = null;
            DataColumn = CalColumn = ClumnOrder = SortingRules = null;
        });
    }
    //新增DataSet保存
    else if (IsSaveOrUpdate == "add") {
        //20130114 倪飘 解决新建datasets输入名称为已存在时，点击预览页面中的"保存"按钮无反应问题
        Agi.DatasetsManager.DSSGetDatasetByID(_DsName, function (result) {
            if (result.result == "true") {
                AgiCommonDialogBox.Alert("当前Dataset名称已存在，请重新填写Dataset名称！", null);

            }
            else {
                //20130730 倪飘 20130723 首自信qpc项目接口参数更改
                Agi.DatasetsManager.DSSSave(_DsName, _Remark, _DataSourceName,_VTType, _VTTableName, _DContrl, 0, "root", DataColumn, CalColumn, ClumnOrder, SortingRules, function (result) {
                    if (result.result) {
                        //2014-02-20 coke 移动dataset
                        MoveNewDataSetGroup(function(){
                            AddAllDatasets();
                            //更新组态环境页面的dataset
                            menuManagement.loadDataSource($('#accordion-agivis #collapseOne>.accordion-inner'));
                            $("#DataSetSave").attr("disabled", true);
                            //20130114 倪飘 解决新建混合虚拟表和新建datasets保存以后，保存按钮会变成不可选中状态，但是当鼠标移上去的时候还是可以看到按钮的变化问题
                            //$('#DataSetSave').css('background-image', 'none')
                            $('#DataSetSave').removeClass("btnclass");
                            AgiCommonDialogBox.Alert(result.message, null);
                            boolIsSave = true;
                        });

                    }
                    else {
                        AgiCommonDialogBox.Alert(result.message, null);
                    }
                });
            }

            /*清空临时变量*/
            _DsName = _Remark = _DataSourceName = _VTTableName = _DContrl = dsgridone = dsgridtwo = null;
            DataColumn = CalColumn = ClumnOrder = SortingRules = null;
        });

    }

});
/*
* 2014-02-20  coke 将dataset移至选中组别名称;
* */
function MoveNewDataSetGroup(CallBack)
{

    var parentID=$("#GroupNameID").val();
    if(parentID=="0")
    {
        //没有选择移动组别id
        CallBack();
        return;
    }
    var pageid=$("#dsetname").val().toString().trim();

    Agi.DatasetsManager.DSNodeMove({DataSetsKey:pageid,ParentKey:parentID},function(result){
        if(result.result=="true"){
           // AgiCommonDialogBox.Alert("移动成功！", null);

        }else{
            AgiCommonDialogBox.Alert(result.message, null);
        }
        CallBack();
    });

}

//编辑DataSet页面
function EditDatasetsFun(dsname) {
    //显示第一个Tab
    ShowOneTab();
    //20130123 倪飘 修改编辑dataset时的全选状态
    boolCheck = false;
    //根据DataSet的ID查找单个DataSet数据
    Agi.DatasetsManager.DSSGetDatasetByID(dsname, function (result) {
        if (result.result == "true") {

            dsdatas = result.Data.DataSets.DataSet;
            //绑定详细信息字段
            $("#dsetname").val(dsdatas.ID);
            $("#dsetname").attr("disabled", "true");
            $("#dsetmemeo").val(dsdatas.Memo);
            $("#dsetdsource").val(dsdatas.DataSource);
            $("#dsetdsource").attr("disabled", "true");
            $("#dsetvtable").val(dsdatas.VirtualTable);
            $("#dsetvtable").attr("disabled", "true");
            $("#dsvttype").val(dsdatas.vtType);
            //20130730 倪飘 20130723 首自信qpc项目接口参数更改
            $("#dsetdcontrol").val(dsdatas.DefaultVisualContrl);
            //end
            var DataColumn;
            var CalColumn;
            var ClumnOrder = dsdatas.ClumnOrder.ColumnName;
            //若DataSet中只有一列时导致的列无法显示问题修改
            if (Object.prototype.toString.call(ClumnOrder) === "[object Array]") {
            } else {
                if (ClumnOrder != null) {
                    ClumnOrder = [ClumnOrder];
                } else {
                    ClumnOrder = [];
                }
            }
            if (Object.prototype.toString.call(dsdatas.Columns.DataColumns.DataColumn) === "[object Array]") {
                //update by sunming 2014-01-17  过滤列名
//                for(var o in dsdatas.Columns.DataColumns.DataColumn)
//                {
//                    var cols=dsdatas.Columns.DataColumns.DataColumn[o];
//                    if(!cols){
//                        continue;
//                    }
//                    cols.ID=cols.ID.trimStart('\'').trimEnd('\'');
//                }
            } else {
                if (dsdatas.Columns.DataColumns.DataColumn != null) {
                    dsdatas.Columns.DataColumns.DataColumn = [dsdatas.Columns.DataColumns.DataColumn];
                } else {
                    dsdatas.Columns.DataColumns.DataColumn = [];
                }
            }
            if (dsdatas.Columns.CalColumns != null && Object.prototype.toString.call(dsdatas.Columns.CalColumns.CalColumn) === "[object Array]") {
            } else {
                if (dsdatas.Columns.CalColumns != null && dsdatas.Columns.CalColumns.CalColumn != null) {
                    dsdatas.Columns.CalColumns.CalColumn = [dsdatas.Columns.CalColumns.CalColumn];
                }
            }
            for (var i = 0; i < ClumnOrder.length; i++) {
                var _OrderName = ClumnOrder[i];
                if (Object.prototype.toString.call(dsdatas.Columns.DataColumns.DataColumn) === "[object Array]") {
                    DataColumn = dsdatas.Columns.DataColumns.DataColumn;
                    //绑定列名和数据类型列
                    for (var j = 0; j < DataColumn.length; j++) {
                        var _cloumsname = DataColumn[j].ID;
                        if (_OrderName == _cloumsname) {
                            var _datatype = DataColumn[j].DataType;
                            if (_datatype == null) { _datatype = "" };
                            var _aggregator = DataColumn[j].Aggregator;
                            var _visible = DataColumn[j].Visible;
                            var _groupby = DataColumn[j].GroupBy;
                            dataone.push({
                                dscolums: _cloumsname,
                                dstype: _datatype,
                                dsaggregate: _aggregator,
                                dsshow: _visible,
                                dsexpression: ""
                                //                                dsGroup: _groupby
                            });
                            datatwo.push({
                                dscolums: _cloumsname,
                                dsgroping: _groupby
                            });
                        }
                    }
                }
                if (Object.prototype.toString.call(dsdatas.Columns.DataColumns.DataColumn) === "[object Object]") {
                    DataColumn = dsdatas.Columns.DataColumns.DataColumn;
                    //绑定列名和数据类型列
                    var _cloumsname = DataColumn.ID;
                    if (_OrderName == _cloumsname) {
                        var _datatype = DataColumn.DataType;
                        if (_datatype == null) { _datatype = "" };
                        var _aggregator = DataColumn.Aggregator;
                        var _visible = DataColumn.Visible;
                        var _groupby = DataColumn.GroupBy;
                        dataone.push({
                            dscolums: _cloumsname,
                            dstype: _datatype,
                            dsaggregate: _aggregator,
                            dsshow: _visible,
                            dsexpression: ""
                        });
                        datatwo.push({
                            dscolums: _cloumsname,
                            dsgroping: _groupby
                        });
                    }
                }
            }
            //20130111 倪飘 解决Datasets-添加计算列-重新编辑带有计算列的Dataset，计算列在编辑页面消失问题
            if (dsdatas.Columns.CalColumns != null) {
                if (Object.prototype.toString.call(dsdatas.Columns.CalColumns.CalColumn) === "[object Array]") {
                    CalColumn = dsdatas.Columns.CalColumns.CalColumn;
                    for (var j = 0; j < CalColumn.length; j++) {
                        var _name = CalColumn[j].Name;
                        //                        if (_OrderName != _name) {
                        var _expression = CalColumn[j].Expression;
                        dataone.push({
                            dscolums: _name,
                            dstype: "",
                            dsaggregate: "",
                            dsshow: "",
                            dsexpression: _expression,
                            dsGroup: ""
                        });
                        //                                datatwo.push({
                        //                                    dscolums: _name,
                        //                                    dsgroping: ""
                        //                                });
                        //                        }
                    }

                }
                if (Object.prototype.toString.call(dsdatas.Columns.CalColumns.CalColumn) === "[object Object]") {
                    CalColumn = dsdatas.Columns.CalColumns.CalColumn;
                    var _name = CalColumn.Name;
                    //                    if (_OrderName != _name) {
                    var _expression = CalColumn.Expression;
                    dataone.push({
                        dscolums: _name,
                        dstype: "",
                        dsaggregate: "",
                        dsshow: "",
                        dsexpression: _expression,
                        dsGroup: ""
                    });
                    //                            datatwo.push({
                    //                                dscolums: _name,
                    //                                dsgroping: ""
                    //                            });
                    //                    }

                }
            }
            //结束
            AddDSGridData();
            Data1Column = dataone;
            Data2Column = datatwo;
            dataone = [];
            datatwo = [];
            //取出表格数据对象
            var dsgridone = $("#gridone").data("kendoGrid");
            var dsgridtwo = $("#gridtwo").data("kendoGrid");
            if (DataColumn != null) {
                if (Object.prototype.toString.call(DataColumn) === "[object Array]") {
                    for (var i = 0; i < DataColumn.length; i++) {
                        var _Aggregator = DataColumn[i].Aggregator;
                        var _Visible = DataColumn[i].Visible;
                        var _GroupBy = DataColumn[i].GroupBy;
                        //20140220 范金鹏 获取别名信息
                        var _Aliases = DataColumn[i].Aliases;
                        //end
                        var dsgridonetbotytrstemp = null;
                        for (var j = 0; j < dsgridone.dataSource._data.length; j++) {
                            dsgridonetbotytrstemp = $(dsgridone.tbody.find("tr")[j]);
                            var _columnName = dsgridonetbotytrstemp.find("td")[0].innerText;
                            if (_columnName == DataColumn[i].ID) {
                                //绑定聚合函数列内容
                                dsgridonetbotytrstemp.find("#dsaggregate").val(_Aggregator);
                                //20140220 范金鹏 将别名绑定编辑表格，如果没有别名直接绑定列名
                                //以前的数据在没有修改前别名为undefined，修改后保存没有赋值的话为空
                                if (_Aliases == undefined || _Aliases == "") {
                                    dsgridonetbotytrstemp.find("#aliases").val(_columnName);
                                }
                                else {
                                    dsgridonetbotytrstemp.find("#aliases").val(_Aliases);
                                }
                                //end
                                //绑定是否显示列内容
                                if (_Visible == "true") {
                                    dsgridonetbotytrstemp.find("#dsshow").attr("checked", true);
                                }
                                if (_GroupBy == "true") {
                                    dsgridonetbotytrstemp.find("#dsGroup").attr("checked", true);
                                }
                            }
                        }
                        dsgridonetbotytrstemp = null; //DOM查询优化，临时变量清空
                    }
                }
                else if (Object.prototype.toString.call(DataColumn) === "[object Object]") {
                    var _Aggregator = DataColumn.Aggregator;
                    var _Visible = DataColumn.Visible;
                    var _GroupBy = DataColumn.GroupBy;
                    $(dsgridone.tbody.find("tr")[0]).find("#dsaggregate").val(_Aggregator);
                    if (_Visible == "true") {
                        $(dsgridone.tbody.find("tr")[0]).find("#dsshow").attr("checked", true);
                    }
                    if (_GroupBy == "true") {
                        $(dsgridone.tbody.find("tr")[j]).find("#dsGroup").attr("checked", true);
                    }
                }

            }
            if (dsdatas.SortingRules != null) {
                var SortingRules = dsdatas.SortingRules.ColumnName;
                if (Object.prototype.toString.call(SortingRules) === "[object Array]") {
                    for (var i = 0; i < SortingRules.length; i++) {
                        for (var j = 0; j < dsgridtwo.dataSource._data.length; j++) {
                            var _columnName = $(dsgridtwo.tbody.find("tr")[j]).find("td")[0].innerText;
                            var SortingRule = SortingRules[i].split('#');
                            if (_columnName == SortingRule[0]) {
                                $(dsgridtwo.tbody.find("#dsgroping")[j]).attr("checked", true);
                                $(dsgridtwo.tbody.find("tr")[j]).find("#SequenceWay").val(SortingRule[1]);
                            }
                        }
                    }
                }
                else if (Object.prototype.toString.call(SortingRules) === "[object String]") {
                    for (var k = 0; k < dsgridtwo.dataSource._data.length; k++) {
                        var _columnName = $(dsgridtwo.tbody.find("tr")[k]).find("td")[0].innerText;
                        var SortingRule = SortingRules.split('#');
                        if (_columnName == SortingRule[0]) {
                            $(dsgridtwo.tbody.find("#dsgroping")[k]).attr("checked", true);
                            $(dsgridtwo.tbody.find("tr")[k]).find("#SequenceWay").val(SortingRule[1]);
                        }
                    }
                }
            }
            dsgridone = dsgridtwo = null; //DOM查询优化，临时变量清空

            /*清空临时变量*/
            DataColumn = CalColumn = ClumnOrder = null;
        }
    });
}


//全部变量保存选定的数据源和虚拟表ID
var SelectedDS, SelectedVTable;
//点击新建dataset弹出选择框
$("#dataset").live('click', function () {
    ShowMainFramePage();
    HideAllMainPageWin();
    dialogs._PopupSelectDataSource.dialog('open');
    DSDCShow();

});

$("#MainDatasetsDiv").live('click', function () {
    boolIsSave = false;
    //20130216 倪飘 解决弹出框背景问题
//    ShowOperationData();
    HideAllMainPageWin();
//    $("#PopupSelectDataSource").modal({ backdrop: true, keyboard: false, show: true });
////    $('#PopupSelectDataSource').draggable({
////        handle: ".modal-header"
////    });
//    $('#PopupSelectDataSource').draggable("disable");
    if(!dialogs._PopupSelectDataSource.dialog('isOpen')){
        dialogs._PopupSelectDataSource.dialog('open');
    }
    DSDCShow();
});

//选择数据源弹出框取消事件
$("#PDCancel").live('click', function () {
//    $("#PopupSelectDataSource").modal('hide');
    dialogs._PopupSelectDataSource.dialog('close');
    boolIsSave = true;
    ShowMainFramePage();
});

//选择数据源弹出框确定事件
$("#PDOK").live('click', function () {
    var grid = $("#PopupSelectDGrid").data("kendoGrid");
    var list = grid.select().text();
    var data = list.split(" ");
    SelectedDS = data[0];
    if (SelectedDS == "") {
        AgiCommonDialogBox.Alert("请选择数据源！", null);
    }
    else {
        //        $("#PopupSelectDataSource").modal('hide');
        dialogs._PopupSelectDataSource.dialog('close');
        //        $("#PopupSelectVTable").modal({ backdrop: false, keyboard: false, show: true });
        ////        $('#PopupSelectVTable').draggable({
        ////            handle: ".modal-header"
        ////        });
        //        $('#PopupSelectVTable').draggable("disable");
        dialogs._PopupSelectVTable.dialog('open');
        DSVTShow(SelectedDS);
    }

    /*清空临时变量*/
    grid = list = data = null;
});

//选择虚拟表取消事件
$("#PVCancel").live('click', function () {
//    $("#PopupSelectVTable").modal('hide');
    dialogs._PopupSelectVTable.dialog('close');
    boolIsSave = true;
    ShowMainFramePage();
});

//虚拟表选择上一步
$("#PVPrevious").live('click', function () {
//    $("#PopupSelectVTable").modal('hide');
    dialogs._PopupSelectVTable.dialog('close');
//    $("#PopupSelectDataSource").modal({ backdrop: false, keyboard: false, show: true });
////    $('#PopupSelectDataSource').draggable({
////        handle: ".modal-header"
////    });
//    $('#PopupSelectDataSource').draggable("disable");
    dialogs._PopupSelectDataSource.dialog('open');
    DSDCShow();
});

//选择虚拟表确定事件
$("#PVOK").live('click', function () {
//20130116 倪飘 解决Dataset-新建Dataset-新建的列信息页面，选择"列显示全选"需要点击两次才可全选问题
    boolCheck = true;
    var grid = $("#PopupSelectVGrid").data("kendoGrid");
    var list = grid.select().text();
    var data = list.split(" ");
    SelectedVTable = data[0];
    if (SelectedVTable == "") {
        AgiCommonDialogBox.Alert("请选择虚拟表，如果当前没有可用的虚拟表，可以点击”上一步“重新选择数据源！", null);
    }
    else {
        Agi.VTManager.VTGetTableDetailsByDS(SelectedDS, SelectedVTable, function (result) {
            if (result.result == "true") {
                //.net，java兼容
                if (Agi.WebServiceConfig.Type == ".NET") {
                    //如果是标准虚拟表
                    if (result.TableDetailsData.SingleEntityInfo.SqlDefined) {
                        if (result.TableDetailsData.SingleEntityInfo.SqlDefined.Schema != undefined) {
//                            $("#PopupSelectVTable").modal('hide');
                            dialogs._PopupSelectVTable.dialog('close');
                            AddDataSets(SelectedDS, SelectedVTable);
                        }
                        else {
                            AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                            return false;
                        }
                        //如果是混合虚拟表
                    } else if (result.TableDetailsData.SingleEntityInfo.ScDefined.Columns.Column) {
                        if (result.TableDetailsData.SingleEntityInfo.ScDefined.Columns.Column != undefined) {
//                            $("#PopupSelectVTable").modal('hide');
                            dialogs._PopupSelectVTable.dialog('close');
                            AddDataSets(SelectedDS, SelectedVTable, true);
                        }
                    }
                }
                else {
                    //如果是标准虚拟表
                    if (result.TableDetailsData[0].schema) {
                        if (result.TableDetailsData != null && result.TableDetailsData.length > 0 && result.TableDetailsData[0].schema != undefined) {
//                            $("#PopupSelectVTable").modal('hide');
                            dialogs._PopupSelectVTable.dialog('close');
                            AddDataSets(SelectedDS, SelectedVTable);
                        }
                        else {
                            AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                            return false;
                        }
                    }
                    //如果是混合虚拟表
                    else if (result.TableDetailsData[0].Relations) {
                        //20121130 markeluo 添加JAVA的处理逻辑代码
                        if (result.TableDetailsData[0].Columns.Column != undefined) {
//                            $("#PopupSelectVTable").modal('hide');
                            dialogs._PopupSelectVTable.dialog('close');
                            AddDataSets(SelectedDS, SelectedVTable, true);
                        }
                        else {
                            AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                            return false;
                        }
                    }
                }
            }
            else {
                AgiCommonDialogBox.Alert("错误虚拟表,无数据！请重新选择！", null);
                return false;
            }
        });
    }
});

//给数据源表添加数据
function DSDCShow() {
    var data = [];
    Agi.DCManager.DCGetAllConn(function (_result) {
        if (_result.result) {
            var array = _result.dataSourceData;
            for (var i = 0; i < array.length; i++) {
                var DBName = array[i].dataSourceName,
                    DBType = array[i].dataSourceType,
                    DBDes = array[i].dataSourceAblout;
                if (DBDes == "null") {
                    DBDes = "";
                }
                data.push({
                    dsdcname: DBName + " ",
                    dsdctype: DBType + " ",
                    dsdcdes: DBDes + " "
                });
            }
            InitDSDCGridData(data);
        }
    });

}

function InitDSDCGridData(data) {
    $("#PopupSelectDGrid").html("");
    $("#PopupSelectDGrid").kendoGrid({
        dataSource: {
            data: data
        },
        height: 200,
        selectable: "single row",
        groupable: false,
        filterable: true,
        scrollable: true,
        sortable: true,
        pageable: false,
        columns: [{
            field: "dsdcname",
            width: 100,
            title: "数据源名称"
        }, {
            field: "dsdctype",
            width: 100,
            title: "数据源类型"
        }, {
            field: "dsdcdes",
            width: 100,
            title: "说明"
        }]
    });
}

//给虚拟表表添加数据
function DSVTShow(dsname) {
    var data = [];
    Agi.VTManager.VTGetVirtualTableByDS(SelectedDS, function (result) {
        if (result.result) {
            var AllVT = result.virtualTableData;
            for (var i = 0; i < AllVT.length; i++) {
                var id = AllVT[i].ID;
                data.push({
                    dsvtname: id + " "
                });
            }
        }
        Agi.VTManager.SCVTGetScMethodInfoEx(SelectedDS, function (result) {
            if (result.result == "true") {
                var AllSc = result.data.scDefined;
                if (AllSc.length > 0) {
                    for (var i = 0; i < AllSc.length; i++) {
                        data.push({
                            dsvtname: AllSc[i] + " "
                        });
                    }
                }
            }
            //20130711 倪飘 解决bug，点击标题栏按钮"新建datasets"，选择数据源后，进入选择虚拟表界面，未显示存储过程虚拟表
            //20130711 倪飘 解决bug，主页面点击dataset，新建dataset，选择数据源之后，显示不出来存储过程虚拟表的名称
            Agi.VTManager.SP_GetSptable(SelectedDS, function (result) {
                if (result.result == "true") {
                    PROData = result.vtables;
                    if (PROData.length > 0) {
                        for (var i = 0; i < PROData.length; i++) {
                            data.push({
                                dsvtname: PROData[i] + " "
                            });
                        }
                    }
                }
                InitDSVTGridData(data);
            });
            
        });
    });
}

function InitDSVTGridData(data) {
    $("#PopupSelectVGrid").html("");
    $("#PopupSelectVGrid").kendoGrid({
        dataSource: {
            data: data
        },
        height: 200,
        selectable: "single row",
        groupable: false,
        filterable: true,
        scrollable: true,
        sortable: true,
        pageable: false,
        columns: [{
            field: "dsvtname",
            width: 30,
            title: "虚拟表名称"
        }]
    });
}

//AddTime 2012年8月30日 15:43:53
$("#btnUp").live('click', function () {
    var SelectCount = 0;
    var trList = $("#gridone>table>tbody>tr");
    trList.each(function (index, item) {
        if ($(item).hasClass("k-state-selected")) {
            SelectCount++;
            if (index < 1) {

                AgiCommonDialogBox.Alert("已经是最上面，不能再上移了", null);
                return false;
            }
            trList.eq(index - 1).before($(item));
            //20130517 倪飘 解决bug，新建/编辑datasets时，列信息页出现滚动条，点击"上移""下移"按钮时，建议滚动条应该跟着改变显示操作的那条数据
            $($(trList.eq(index)).find('select')[0]).focus();

        }
    });

    //20130216 nipiao 解决Datasets-新建datasets-列信息页面，直接点击”上移“或”下移“按钮，无提示问题
    if (SelectCount === 0) {
        AgiCommonDialogBox.Alert("请选择上移的列！", null);
    }

    /*清除临时变量*/
    SelectCount = trList = null;
});
$("#btnDown").live('click', function () {
    var SelectCount = 0;
    var trList = $("#gridone>table>tbody>tr");
    trList.each(function (index, item) {
        if ($(item).hasClass("k-state-selected")) {
            SelectCount++;
            if (index == trList.length - 1) {
                
                AgiCommonDialogBox.Alert("已经是最下面，不能再下移了!", null);
                return false;
            }

            trList.eq(index + 1).after($(item));
            //20130517 倪飘 解决bug，新建/编辑datasets时，列信息页出现滚动条，点击"上移""下移"按钮时，建议滚动条应该跟着改变显示操作的那条数据
            $($(trList.eq(index)).find('select')[0]).focus();
        }
    });
    //20130216 nipiao 解决Datasets-新建datasets-列信息页面，直接点击”上移“或”下移“按钮，无提示问题
    if (SelectCount === 0) {
        AgiCommonDialogBox.Alert("请选择下移的列！", null);
    }
    /*清除临时变量*/
    SelectCount = trList = null;
});
//加载弹出层
$("#btnExpression").live('click', function () {
    ExpressionState = "add";
    InitExpression();
    BindDropE();
//    $('#SetExpression').draggable();
//    $('#SetExpression').modal({ backdrop: false, keyboard: false, show: true }); //加载弹出层
    dialogs._SetExpression.dialog('open');
    //20130115 倪飘 修改新建datasets列信息，添加计算列→点击新添加的计算列后的："修改"按钮→点击"取消"按钮→再次点击"添加计算列"→表达式列名称为默认值无法修改问题
    $("#txtCloumnName").attr('readonly', false);
});
//全选//反选
$("#btnCheck").live('click', function () {
    var gridonetbodytrs=$("#gridone").find("tbody>tr");
    if (boolCheck) {
        $("#btnCheck").val("列显示反选");
        for (var i = 0; i < gridonetbodytrs.length; i++) {
            $(gridonetbodytrs[i]).find("#dsshow").attr("Checked", true);
        }
    }
    else {
        $("#btnCheck").val("列显示全选");
        for (var i = 0; i < gridonetbodytrs.length; i++) {
            $(gridonetbodytrs[i]).find("#dsshow").attr("Checked", false);
        }
    }
    boolCheck = !boolCheck;
    gridonetbodytrs=null;//DOM查询优化，临时变量清空
});
//清空表达式和自动产生列名
function InitExpression() {
    $("#txtExpression").val(""); //清空表达式
    $("#txtCloumnName").val("NewCloumn" + ($("#gridone").find("tbody>tr").length + 1)); //自动产生列名
}
//绑定下拉框
function BindDropE() {
    $("#DropExpression").find("option").remove(); //清除列名
    $("#DropExpression").append("<option value=''></option>");
    var Thisgridonetbodytrs=$("#gridone").find("tbody>tr");
    for (var i = 0; i < Thisgridonetbodytrs.length; i++) {
        var _cloumnName = $(Thisgridonetbodytrs[i]).find("td")[0].innerText;
        if ($(Thisgridonetbodytrs[i]).find("#EValue").val() == undefined) {
            $("#DropExpression").append("<option value='" + _cloumnName + "'>" + _cloumnName + "</option>");
        }
    }
    Thisgridonetbodytrs=null;//DOM查询优化，临时变量清空
    $('#DropExpression').change(function () {
        _SetExpression();
    }); //添加值改变事件 
}
//添加表达式
$("#btnAddE").live('click', function () {
    //_SetExpression();
});

/// <summary>添加表达式</summary>
function _SetExpression() {
    var oldExpression = $("#txtExpression").val();
    var addExpression = " { " + $("#DropExpression").val() + " } ";
    if (addExpression != " {  } ") {
        oldExpression += addExpression;
    }
    $("#txtExpression").val(oldExpression);
    $("#DropExpression").find("option")[0].selected = true;

    /*清除临时变量*/
    oldExpression = addExpression = null;
}
/// <summary>保存列和表达式，同时重新绑定grid1和grid2</summary>
$("#btnSaveExpression").live('click', function () {
    //20130216 倪飘 解决异常操作-新建datasets-添加计算列的表达式名称为空，或者为空格时，保存成功，预览查询数据显示错误问题
    var ColumnName = $("#txtCloumnName").val();
    if (ColumnName.trim() == "") {
        AgiCommonDialogBox.Alert("表达式名称不能为空!", null);
        return false;
    }
    //20130216 倪飘 表达式名称首字符不能为数值
    if (!isNaN(ColumnName[0])) {
        AgiCommonDialogBox.Alert("表达式名称首字符不能为数字!", null);
        return false;
    }
    //20130216 倪飘 表达式名称特殊字符判断  
    var RegStr = /^[0-9a-zA-Z]*$/g;
    if (!RegStr.test(ColumnName)) {
        AgiCommonDialogBox.Alert("表达式名称只能包含字母和数字!", null);
        return false;
    }

    var Expression = $("#txtExpression").val();
    if (Expression.trim() == "") {
        AgiCommonDialogBox.Alert("表达式不能为空!", null);
        return false;
    }


    if (ExpressionState == "add") {
        //20130216 倪飘 解决Datasets-新建datasets-添加相同的列名称计算列，再删除后，原有相同名称的列被删除，无法查询问题，名称相同不允许保存
        var trList = $("#gridone>table>tbody>tr");
        for (var i = 0; i < trList.length; i++) {
            if ($(trList[i]).find('td')[0].innerText === ColumnName) {
                AgiCommonDialogBox.Alert("存在相同的表达式名称，请修改!", null);
                return false;
            }
        }
        var _gridOne = $("#gridone").data("kendoGrid");
        //var _gridTwo = $("#gridtwo").data("kendoGrid");
        $(_gridOne.tbody).append('<tr><td>' + ColumnName + '</td><td></td><td><input type="hidden" id="EValue" value="' + Expression + '" ><button id="btnEditE" onclick ="_EditE()"  class="exeditbtn">修改</button><button class="exeditbtn" onclick ="_DelE()" id="btnDelE"  >刪除</button></td><td></td></td></td></tr>');
        //$(_gridTwo.tbody).append('<tr><td>' + ColumnName + '</td><td><input type="checkbox" id="dsgroping" value="" /></td></tr>');
        //$('#SetExpression').modal('hide');
        //        //清除grid1和grid2
        //        $("#gridone").html("");
        //        $("#gridtwo").html("");
        //        //获取列名和表达式
        //        Data1Column.push({ dscolums: ColumnName, dstype: "", dsexpression: Expression });
        //        dataone = Data1Column;
        //        Data2Column.push({ dscolums: ColumnName, dsgroping: false });
        //        datatwo = Data2Column;
        //        //绑定grid1和grid2
        //        BindGrid1();
        //        BindGrid2();
        //InitExpression();
        //BindDropE();
        //        //清空data1和data2，保留Data1Column 和Data2Column
        //        dataone = [];
        //        datatwo = [];
    }
    else {
        //20130216 nipiao 解决Datasets-新建datasets-修改计算列信息，表达式列名称不可编辑问题。
        if (ColumnName == EditCloumnName) {
            $("#gridone").data("kendoGrid").select().find("#EValue").val(Expression);
        }
        else {
            //20130216 倪飘 解决Datasets-新建datasets-添加相同的列名称计算列，再删除后，原有相同名称的列被删除，无法查询问题，名称相同不允许保存
            var trList = $("#gridone>table>tbody>tr");
            for (var i = 0; i < trList.length; i++) {
                if ($(trList[i]).find('td')[0].innerText === ColumnName) {
                    AgiCommonDialogBox.Alert("存在相同的表达式名称，请修改!", null);
                    return false;
                }
            }
            $("#gridone").data("kendoGrid").select().remove();
            var _gridOne = $("#gridone").data("kendoGrid");
            //var _gridTwo = $("#gridtwo").data("kendoGrid");
            $(_gridOne.tbody).append('<tr><td>' + ColumnName + '</td><td></td><td><input type="hidden" id="EValue" value="' + Expression + '" ><button id="btnEditE" onclick ="_EditE()"  class="exeditbtn">修改</button><button class="exeditbtn" onclick ="_DelE()" id="btnDelE"  >刪除</button></td><td></td></td></td></tr>');
        }
        EditCloumnName = "";
    }
//    $('#SetExpression').modal('hide');
    dialogs._SetExpression.dialog('close');
});


$("#btnView").live('click', function () {
    boolVisable = false; //默认所有列都未选中
    var _DataSourceName = $("#dsetdsource").val(); //数据源名称
    var _VTTableName = $("#dsetvtable").val(); //虚拟表名称
    var _Param = []; //SQL参数
    var _para = [];
    Agi.VTManager.VTGetTableDetailsByDS(_DataSourceName, _VTTableName, function (result) {
        if (result.result == "true") {
            if (Agi.WebServiceConfig.Type == ".NET") {
                if (result.TableDetailsData.SingleEntityInfo.SqlDefined != null) {
                    try {  //add by lj 异常处理：如果某个实体没有输入参数时会报错
                        _para = result.TableDetailsData.SingleEntityInfo.SqlDefined.Para;
                    }
                    catch (e) { }
                }
                else if (result.TableDetailsData.SingleEntityInfo.ScDefined != null) {
                    try {  //add by lj 异常处理：如果某个实体没有输入参数时会报错
                        _para = result.TableDetailsData.SingleEntityInfo.ScDefined.Para;
                    }
                    catch (e) { }
                } else if (result.TableDetailsData.SingleEntityInfo.SpDefined != null) {
                    try {  //add by lj 异常处理：如果某个实体没有输入参数时会报错
                        _para = result.TableDetailsData.SingleEntityInfo.SpDefined.Para;
                    }
                    catch (e) { }
                }
            }
            else {
                _para = result.TableDetailsData[0].para;
            }
            if (Object.prototype.toString.call(_para) === "[object Array]") {
                for (var i = 0; i < _para.length; i++) {
                    _Param.push({
                        key: _para[i].ID,
                        value: _para[i].Default
                    });
                }
            }
            if (Object.prototype.toString.call(_para) === "[object Object]") {
                _Param.push({
                    key: _para.ID,
                    value: _para.Default
                });
            }
            /////
            //获取基本信息
            var _DsName = $("#dsetname").val();
            //ID不能为空的判断
            if (_DsName == "") {

                AgiCommonDialogBox.Alert("名称不能为空，请填写DataSet名称！", null);
                return;
            }
            var _Remark = $("#dsetmemeo").val();
            var _DContrl = $("#dsetdcontrol").attr("value");

            //获取表格的所有数据
            var dsgridone = $("#gridone").data("kendoGrid");
            var dsgridtwo = $("#gridtwo").data("kendoGrid");

            //定义要用到的数组
            var DataColumn = []; //自有列
            var CalColumn = []; //新增带有表达式的列
            var ClumnOrder = []; //数据查询方式，按照列先后顺序存放
            var SortingRules = [];

            var ThisGridonetbodytrs=$("#gridone").find("tbody>tr");
            for (var i = 0; i < ThisGridonetbodytrs.length; i++) {
                var boolShow = $(ThisGridonetbodytrs[i]).find("#dsshow").attr("checked");
                if (boolShow == "checked") {
                    boolVisable = true;
                }
            }
            if (!boolVisable) {
                AgiCommonDialogBox.Alert("请选择需要显示的列!", null);
                return;
            }
            else {
                var ThisGridTowtbodytrs=null;
                for (var i = 0; i < ThisGridonetbodytrs.length; i++) {
                    var _columName2 = $(ThisGridonetbodytrs[i]).find("td")[0].innerText; //列名
                    var _expression = $(ThisGridonetbodytrs[i]).find("#EValue").val() == undefined ? "" : $(ThisGridonetbodytrs[i]).find("#EValue").val(); //表达式

                    if (_expression != "") { //add by zhangpeng 2012.12.28
                        CalColumn.push({
                            Name: _columName2,
                            Expression: _expression
                        });
                    }
                    ThisGridTowtbodytrs=$("#gridtwo").find("tbody>tr");
                    for (var j = 0; j < ThisGridTowtbodytrs.length; j++) {
                        var _columName = $(ThisGridTowtbodytrs[j]).find("td")[0].innerText;
                        var boolGroup = $($("#gridtwo").find("tbody").find("#dsgroping")[j]).attr("checked") == "checked" ? "true" : "false"; //排序
                        if (_columName == _columName2) {
                            var _type = $(ThisGridonetbodytrs[i]).find("td")[1].innerText; //数据类型
                            var _Aggregate = $(ThisGridonetbodytrs[i]).find("#dsaggregate").val() == undefined ? "" : $(ThisGridonetbodytrs[i]).find("#dsaggregate").val(); //聚合函数
                            var boolShow = $(ThisGridonetbodytrs[i]).find("#dsshow").attr("checked") == "checked" ? "true" : "false"; //是否显示
                            //var _expression = $(dsgridone.tbody.find("tr")[i]).find("td")[2].innerText;
                            var _expression = $(ThisGridonetbodytrs[i]).find("#EValue").val() == undefined ? "" : $(ThisGridonetbodytrs[i]).find("#EValue").val(); //表达式
                            var _IsGroupBy = $(ThisGridonetbodytrs[i]).find("#dsGroup").attr("checked") == "checked" ? "true" : "false"; //是否分组
                            //循环获取表格里面的数据
                            if (_Aggregate == "请选择") { _Aggregate = "" }
                            //如果表达式不为空，说明是新增列
                            if (_expression == "") {
                                DataColumn.push({
                                    ID: _columName2,
                                    DataType: _type,
                                    Aggregator: _Aggregate,
                                    GroupBy: _IsGroupBy,
                                    Visible: boolShow
                                });
                            }
                                //如果表达式为空，说明是虚拟表自有列
                            else {
                                CalColumn.push({
                                    Name: _columName2,
                                    Expression: _expression
                                });
                            }
                            //数据查询方式，按照列先后顺序存放
                            ClumnOrder.push(_columName2);
                            break;
                        }

                    }
                }
                ThisGridTowtbodytrs=null;//DOM查询优化，临时变量清空
                ThisGridTowtbodytrs=$("#gridtwo").find("tbody>tr");
                for (var k = 0; k < ThisGridTowtbodytrs.length; k++) {
                    var _columName = $(ThisGridTowtbodytrs[k]).find("td")[0].innerText;
                    var boolGroup = $($("#gridtwo").find("tbody").find("#dsgroping")[k]).attr("checked") == "checked" ? "true" : "false"; //排序
                    //order by
                    //                    if (boolGroup == "true") {
                    //                        SortingRules.push(_columName);
                    //                    }

                    var _GroupWay = $(ThisGridTowtbodytrs[k]).find("#SequenceWay").val() == undefined ? "" : $(ThisGridTowtbodytrs[k]).find("#SequenceWay").val(); //排序方式
                    //order by
                    if (boolGroup == "true") {
                        if (_GroupWay == "") {

                            AgiCommonDialogBox.Alert("请选择对应的排序方式！", null);
                            return;
                        }
                        else {
                            SortingRules.push(_columName + "#" + _GroupWay);
                        }
                    }
                }
                $('#progressbar1').show().find('.close').click(function (e) {
                    $('#progressbar1').hide().html('<div class="progressBar">' +
                '<button style="position: absolute;left: 186px;top: -4px;" type="button" class="close" data-dismiss="alert">×</button>' +
                '<div class="progress progress-striped active borderFlash">' +
                '<div class="bar" style="width: 100%;"></div>' +
                '</div>' +
                '<span>正在载入...</span>' +
                '</div>');
                });
                Agi.DatasetsManager.DSTestData(_DsName, _Param, _Remark, _DataSourceName, _VTTableName, _DContrl, 0, "root", DataColumn, CalColumn, ClumnOrder, SortingRules, function (result) {
                    Columns = [];
                    if (result.result == "true") {
                        ViewSql = result.SqlString;
                        var array = result.Data;
                        if (Agi.WebServiceConfig.Type == ".NET") {}else{
                            array = result.Data;
                        }
                        if (array.length > 0) {
                            //特殊字符处理 update by sunming 2014-01-15
                            var hasHeader=false;
                            for(var o in array)
                            {
                                var info="";
                                for(var f in array[o]){
                                    var field= replaceSpecialChar(f);
                                    if(field==undefined||field=="")
                                        field="_";
                                    _DType = "NVARCHAR2";
                                    _Remark = null;
                                    if(!hasHeader){
                                        Columns.push({
                                            field: field,
                                            width:90,
                                            title:f
                                        });
                                    }

                                    var fVal;
                                    if(array[o][f]==undefined)
                                    {
                                        fVal=null;
                                    }
                                    else
                                    {
                                        fVal=array[o][f];
                                    }

                                    info+="\""+field+"\":\""+fVal+"\",";
                                }

                                array[o]=JSON.parse("{"+info.trimEnd(',')+"}");
                                hasHeader=true;
                            }
//                                for (var k in array[0]) {
//                                    Columns.push({
//                                        field: k ,
//                                        title: k,
//                                        width: 90
//                                    });
//                                }
                            ViewSql = result.SqlString;
                            BindViewData(array, Columns);
                            $('#progressbar1').hide();
                        }
                        else {
                            //20130328 解决bug新建datasets，勾选显示列预览页中点击预览弹出提示框："无数据"，确定后界面仍然"正在加载"，预期确定后界面显示正常
                            $('#progressbar1').hide();
                            AgiCommonDialogBox.Alert("无数据!", null);
                        }
                        $("#DataSetSave").attr("disabled", false);
                        $('#DataSetSave').addClass("btnclass");
                    }
                    else {
                        $("#DataSetSave").attr("disabled", true);
                        $('#DataSetSave').removeClass("btnclass");
                        if (result.SqlString != undefined) {
                            ViewSql = result.SqlString;
                            $('#progressbar1').hide();
                        }
                        AgiCommonDialogBox.Alert("错误提示:" + result.message, null);
                        return;
                    }
                });
                ThisGridTowtbodytrs=null;//DOM查询优化，临时变量清空
            }

            ThisGridonetbodytrs=null;//DOM查询优化，临时变量清空
        }
        else {
            AgiCommonDialogBox.Alert("错误提示:" + result.message, null);
            $("#DataSetSave").attr("disabled", true);
            //20130114 倪飘 解决新建混合虚拟表和新建datasets保存以后，保存按钮会变成不可选中状态，但是当鼠标移上去的时候还是可以看到按钮的变化问题
            //$('#DataSetSave').css('background-image', 'none')
            $('#DataSetSave').removeClass("btnclass");
        }
    });
});
//20130216 nipiao 解决Datasets-新建datasets-添加计算列后，预览页面的显示条数标识位置不正确问题，影藏横向滚动条
function BindViewData(detailData, columns) {
    $("#gridView").html("");
    $("#gridView").kendoGrid({
        dataSource: {
            data: detailData,
            pageSize: 6
        },
        height: 270,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        columns: columns
    });
}
//加载弹出层
$("#DataGetSql").live('click', function () {
    $('#txtViewSQl').val(ViewSql);
    $('#GetViewSql').draggable();
    $('#GetViewSql').modal({ backdrop: false, keyboard: false, show: true }); //加载弹出层
});
$("#btnViewOK").live('click', function () {
    $('#GetViewSql').modal('hide');
});