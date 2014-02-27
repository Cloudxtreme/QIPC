/// <reference path="jquery-1.7.2.min.js" />

//记录数据源当前的状态 update/save
var DCManageState = ""
//数据源名称
var DBname = "";
//Tables/Views/Procedures
var Structuretype = "";
//表名
var NameId;
//最大记录数
var _count;
//--------------------------------//
//选择的新建虚拟表的方式            //
var NewVirtualTableWay = "";      //
//选择的新建虚拟表的数据源名称      //
var NewVirtualTableDBName = "";   //
//选择的新建虚拟表的数据源类型      //
var NewVirtualTableDBType = "";   //
//选择的新建虚拟表的数据源描述      //
var NewVirtualTableDBTypeDes = ""; //
//SQL语句                          //
var _strSQL = "";                 //
//SQL语句需要传入的值              //
var arrayKeyValue = [];          //
var PresqlKeyValues = ""; //传入参数
//自动生成的列，保存的时候需要用到 //
var Columns = [];                 //
//查询状态,false为没有查询过       //
var booselect = false;            //
//虚拟表操作状态保存/修改          //
var vtAction = "";               //
//扩展内容。暂是为空              //
var data1 = "";                  //
//公共参数                        //
var PublicParameter = [];
//判断是新建数据源还是编辑数据源
var IsNewOrUpdataData = "new";
//----------------------------------------
//点位是编辑还是修改
var PointInfoManageState = "save";
//-------------------------------------
//关系配置表保存参数
var eventRtdbID = ""; //实时数据源ID
var saveGroupID = ""; //获取的分组ID
var saveTag = ""; //获得的点位信息
//---------------------------------
//新建数据源
function AddNewDataSource() {
    this.DCManageState = "save";
    ShowOperationData();
    var IsNew = "";
    if (IsNewOrUpdataData == "new") {
        $("#BottomRightText").text("新建关系数据源");
        IsNew = "新建关系数据源";
    }
    else if (IsNewOrUpdataData == "update") {
        $("#BottomRightText").text("关系数据源编辑");
        IsNew = "关系数据源编辑";
        IsNewOrUpdataData = "new";
    }
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='NewDataSourcePage'><div class='newdatastitle'>" + IsNew + "</div><div class='OutDivd'><div  class='innerLeft'><label class='labelSty'>名称：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='DBName' maxlength='10' ischeck='true'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'>备注：</label></div><div class='innerRight'><textarea class='textareaSty ControlProTextSty' id='DBDescription' style='resize:none;width:195px;' maxlength='100' ischeck='true'></textarea></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'>数据库类型：</label></div><div class='innerRight'><select class='textSty' id='DBType'></select></div></div>" +
        "<div  id='lineDiv' class='OutDivd'></div>" +
        "<div id='OutDivdDataSourcePage'>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'>服务名称：</label></div><div class='innerRight'><input type='text'  class='textSty ControlProTextSty' id='ServerName' maxlength='30' ischeck='false'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'>登陆信息：</label></div><div class='innerRight'></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'>用户名：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='DBUserName'  maxlength='30' ischeck='false'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'>密码：</label></div><div class='innerRight'><input type='password'  class='textSty ControlProTextSty' id='DBPassword' style='width:195px;height:15px' maxlength='30' ischeck='false'/></div></div>" +
        "<div class='OutDivd' id='database'><div class='innerLeft'><label class='labelSty'>数据库：</label></div><div class='innerRight'><input type='text'  class='textSty ControlProTextSty' id='DB' maxlength='15' ischeck='true'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'>端口：</label></div><div class='innerRight'><input type='text'  class='textSty ControlProTextSty' id='DBPort' maxlength='10' ischeck='true'/></div></div>" +
        "<div><input type='button' id='NewDataSourceSaveBtn' value='保       存' /></div></div>" +

        "<div id='NewExeclPage' style='display: none;'><div id='ExeclLeft'>文件：</div><div id='ShowExcelTable'></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='labelSty'></label></div><div class='innerRight'><input type='button' id='addExcel' class='ExcelOperateBtn' value='添加'/><!--<input type='button' id='updateExcel' class='ExcelOperateBtn' value='更新'/>" +
        "<input type='button' id='DownLoadExcel' class='ExcelOperateBtn' value='下载'/>--><input type='hidden' id='yishangchuanExcelName' /></div></div>" +
        "<div><input type='button' id='NewExcelSaveBtn' value='保       存' /></div></div>" +
        "</div>");
    AddDBTypeList();

    /*清空临时变量*/
    IsNew = null;
}
//给数据源添加数据类型
function AddDBTypeList() {
    $("#DBType").append("<option value='SQLServer'>Micorsoft SQL Server</option>");
    $("#DBType").append("<option value='Oracle'>Oracle</option>");
    $("#DBType").append("<option value='Excel'>Flat Files(Excel)</option>");
    //    $("#DBType").append("<option value='Real-time point'>Real-time point</option>");
    //    $('#DBType').change(function () {
    //        if ($("#DBType").val() == "Oracle") {
    //            $('#database').hide();
    //        }
    //        else {
    //            $('#database').show();
    //        }
    //    });
}


//点击编辑读取数据源详细信息并进行绑定
function EditDataSourceOP(dbname) {
    AddNewDataSource();
    this.DCManageState = "update";
    Agi.DCManager.DCGetConnDByID(dbname, function (result) {
        if (result.dataBaseType == "Excel") {
            //打开进度条
            $("#addExcel").val("编辑");
            $('#progressbar1').show().find('.close').click(function (e) {
                $('#progressbar1').hide().html('<div class="progressBar">' +
                    '<button style="position: absolute; left: 186px; top: -4px;" type="button" class="close" data-dismiss="alert"></button> ' +
                    '<div class="progress progress-striped active borderFlash"> ' +
                    '<div class="bar" style="width: 100%;"></div>' +
                    '</div>' +
                    '<span>正在载入...</span>' +
                    '</div>');
            })
            $("#OutDivdDataSourcePage").hide();
            $("#NewExeclPage").show();
            var OperateExceldata = [];
            var str = result.dataSourceName + '\\' + result.excelFileName;
            var jsonData = { "fileName": str };
            var jsonString = JSON.stringify(jsonData);
            Agi.DCManager.ExcelDataSourceGetAll("DSExcelGetSheetName", jsonString, function (result) {
                if (result.result == "true") {
                    for (var i = 0; i < result.data.length; i++) {
                        var tableName = result.data[i],
                            tableExplain = result.data[i];
                        if (DBName == "") {
                        }
                        ;
                        OperateExceldata.push({
                            tableName: tableName + "",
                            tableExplain: tableExplain + ""
                        })
                    }
                } else {
                    AgiCommonDialogBox.Alert("  EXCEL数据源为空 ！", null);
                }
                ExcelDataSourceShowTable(OperateExceldata);
                $('#progressbar1').hide();
            })
            BindDataSourceOPExcel(result);
        }
        else {
            BindDataSourceOP(result);
        }
    });
}
//测试数据源连接
function DCMangeTest(dataSourceName) {
    Agi.DCManager.DCTest(dataSourceName, function (result) {

        if (result.result == "true") {
            AgiCommonDialogBox.Alert("连接成功!");
        } else {
            AgiCommonDialogBox.Alert(result.message);
        }
    });
}
//修改数据源
function BindDataSourceOP(result) {
    var DBName = result.dataSourceName;
    var DBType = result.dataBaseType;
    var ServerName = result.serverName;
    var DBUserName = result.userName;
    var DBPassword = result.password;
    var DB = result.database;
    var DBPort = result.port;
    $("#DBPort").val(DBPort);
    $("#DBName").val(DBName);
    $("#DBName").attr('readonly', true);
    $("#DBType").val(DBType);
    //    if (DBType =="Oracle") {
    //        $('#database').hide();
    //    }
    $("#DBType").attr('disabled', true);
    $("#ServerName").val(ServerName);
    $("#DBUserName").val(DBUserName);
    $("#DBPassword").val(DBPassword);
    $("#DB").val(DB);
    $("#DBDescription").val(result.dbdescription); //20121224 14:40 markeluo 新增，备注信息读取
    $("#DBPort").val(result.port); //20121224 14:40 markeluo 新增，端口号读取
    //    $('#DBType').change(function () {
    //        if ($("#DBType").val() == "Oracle") {
    //            $('#database').hide();
    //        }
    //        else {
    //            $('#database').show();
    //        }
    //    });

    /*释放临时变量*/
    DBName = DBType = ServerName = DBUserName = DBPassword = DB = DBPort = null;
}
//修改NewExcel数据源
function BindDataSourceOPExcel(result) {
    var DBName = result.dataSourceName;
    var DBType = result.dataBaseType;
    //var ServerName = result.serverName;
    //var DBUserName = result.userName;
    //var DBPassword = result.password;
    //var DB = result.database;
    var yishangchuanExcelName = result.excelFileName;
    $("#yishangchuanExcelName").val(yishangchuanExcelName);
    $("#DBName").val(DBName);
    $("#DBName").attr('readonly', true);
    $("#DBType").val(DBType);
    $("#DBType").attr('disabled', true);
    $("#DBType").attr('readonly', true);
    //20130107 16:05 markeluo 编辑Excel 数据源时显示备注信息
    $("#DBDescription").val(result.dbdescription);
    //$("#ServerName").val(ServerName);
    //$("#DBUserName").val(DBUserName);
    //$("#DBPassword").val(DBPassword);
    //$("#DB").val(DB);

    /*释放临时变量*/
    DBName = DBType = yishangchuanExcelName = null;
}
//保存数据源
$("#NewDataSourceSaveBtn").live('click', function myfunction() {
    var DBName = $("#DBName").val();
    var DBType = $("#DBType").val();
    var ServerName = $("#ServerName").val();
    var DBUserName = $("#DBUserName").val();
    var DBPassword = $("#DBPassword").val();
    var DBPort = $("#DBPort").val();
    var DB = $("#DB").val();
    var Dbdescription = $("#DBDescription").val(); //备注信息 markeluo 20121224 14:08 新增
    //    if (DBType == "Oracle") {
    //        var DB = null;
    //        if (DBName == "" || ServerName == "" || DBUserName == "" || DBPassword == "") {
    //            alert("请输入完整!");
    //            return false;
    //        }
    //    }
    //    else {
    //        var DB = $("#DB").val();
    //        if (DBName == "" || ServerName == "" || DBUserName == "" || DBPassword == "" || DB == "") {
    //            alert("请输入完整!");
    //            return false;
    //        }
    //    }
    if (DBName.trim() == "") {
        AgiCommonDialogBox.Alert("名称不能为空!");
        return;
    }
    if (ServerName.trim() == "") {
        AgiCommonDialogBox.Alert("服务不能为空!");
        return;
    }
    if (DBUserName.trim() == "") {
        AgiCommonDialogBox.Alert("用户名不能为空!");
        return;
    }
    if (DBPassword.trim() == "") {
        AgiCommonDialogBox.Alert("密码不能为空!");
        return;
    }
    if (DB.trim() == "") {
        AgiCommonDialogBox.Alert("数据库不能为空!");
        return;
    }

    //region 特殊字符判断
    /*服务名*/
    if (Agi.Edit.todo.DoCheckText(ServerName)) {
        AgiCommonDialogBox.Alert("服务名不能包含下列字符之一:\n \\ / : * ? \" < > | & , ");
        return;
    }
    /*用户名*/
    if (Agi.Edit.todo.DoCheckText(DBUserName)) {
        AgiCommonDialogBox.Alert("用户名名不能包含下列字符之一:\n \\ / : * ? \" < > | & , ");
        return;
    }
    /*密码*/
    if (Agi.Edit.todo.DoCheckText(DBPassword)) {
        AgiCommonDialogBox.Alert("密码名不能包含下列字符之一:\n \\ / : * ? \" < > | & , ");
        return;
    }
    //endregion

    //    if (DBName.trim() == "" || ServerName == "" || DBUserName == "" || DBPassword == "" || DB == "") {
    //        alert("请输入完整!");
    //        return false;
    //    }
    //    if (DBName == " ") {
    //        alert("请输入正确的数据源名称!");
    //        return false;
    //    }
    //    Agi.DCManager.DCGetConnDByID(DBName, function (result) {
    //        if (result.result != "true") { DCManageState = "save"; } //20121226 14:58 倪飘 修改数据源删除之后还可以编辑的问题
    Agi.DCManager.DCSave(DCManageState, DBName, DBType, DBPort, ServerName, DBUserName, DBPassword, DB, Dbdescription, function (result) {
        if (result.result == "true") {
            if (this.DCManageState == "save") {
                this.DCManageState = "update";
                $("#DBName").attr('readonly', true);
                GetDCMangeList(false);
                AgiCommonDialogBox.Alert("添加成功!");
                //20130114 倪飘 解决新建实时和关系数据源输入信息并点击保存以后，数据库类型还能进行修改，预期为不可修改。问题
                $("#DBType").attr('disabled', true);
                boolIsSave = true;
            }
            else {
                AgiCommonDialogBox.Alert("修改成功!")
                boolIsSave = true;
            }

            /*释放临时变量*/
            DBName = DBType = ServerName = DBUserName = DBPassword = DBPort = DB = Dbdescription = null;
        }
        else {
            AgiCommonDialogBox.Alert(result.message);
            /*释放临时变量*/
            DBName = DBType = ServerName = DBUserName = DBPassword = DBPort = DB = Dbdescription = null;
        }
    });
    //    });
});

//保存NewExcel数据源
$("#NewExcelSaveBtn").live('click', function myfunction() {
    //var action = "save";
    var dataSourceName = $("#DBName").val();
    var excelFileName = $("#yishangchuanExcelName").val();
    var dataBaseType = $("#DBType").val();
    var serverName = "";
    var userName = "";
    var password = "";
    var Dbdescription = $("#DBDescription").val(); //20121224 14:08  markeluo  新增备注信息
    if (dataSourceName.trim() == "" || dataBaseType != "Excel") {

        AgiCommonDialogBox.Alert("名称不能为空!");
        return false;
    }
    if (window.ExcelDsName !== '' && window.ExcelDsName !== dataSourceName) {
        if (!window.reUpload) {
            AgiCommonDialogBox.Alert("请重新上传Excel文件!");
            return false;
        }
    }
    Agi.DCManager.DCSaveExcel(DCManageState, dataSourceName, dataBaseType, excelFileName, serverName, userName, password, "", Dbdescription, function (result) {
        if (result.result == "true") {
            if (DCManageState == "save") {
                DCManageState = "update";
                $("#DBName").attr('readonly', true);
                GetDCMangeList(false);
                //20130107 15:43 markeluo 修改下方的弹出框提示信息，原提示信息为“请输入完整！”
                AgiCommonDialogBox.Alert("保存成功!");
                window.ExcelDsName = '';
                //boolIsSave = true;
            }
            else {

                AgiCommonDialogBox.Alert("修改成功!");
                //boolIsSave = true;
            }
            /*释放临时变量*/
            dataSourceName = excelFileName = dataBaseType = serverName = userName = password = Dbdescription = null;
        }
        else {
            window.ExcelDsName = dataSourceName;
            window.reUpload = false;
            AgiCommonDialogBox.Alert(result.message);
            /*释放临时变量*/
            dataSourceName = excelFileName = dataBaseType = serverName = userName = password = Dbdescription = null;
        }
    });
});

var RtdbName = "";
function AddNwePointInformation(_rtdbID, _IsNewOrUpdataPoint) {
    RtdbName = _rtdbID;
    ShowOperationData();
    $("#BottomRightCenterOthersContentDiv").html(""); //<div id='tagNameDiv'> </div>
    $("#BottomRightCenterOthersContentDiv").html("" +
    //"<div id='tagTabPage'><div id='tagtop'>" +
    // "<div id='tagtop1'>" +
        "<div class='TagBorderClass'>" +
        "<div id='toolboxDiv' style='margin-bottom: 2px'>" +
        "<div id='focus'>" + //<input type='text' class='input_txt' value='请输入点位号'/><input type='button' class='toolBtn1' id='findOnePointBtn' value='查  询'/>
        "<input id='deleteBtn' class='toolBtn1' type='button' value='删  除'/>" +
    // "<input id='CkeckedAllTagBtn' class='toolBtn1' type='button' value='全 选'/>" +
        "<input id='achieveBtn' class='toolBtn' type='button' value='从API获取点位'/></div></div>" +
        "<div class='tagDataTabel' style='width:100%;height:230px '></div>" +
        "<div class='box'>" +
    // "<div class='newConfigtitle'><input style='display: inline;' id='addPointBtn' class='toolBtn1' type='button' value='新  增'/><input type='button' value='' id='showPointBtn'/></div>" +
        "<div class='borderClassDiv1'id='AddpointDivID' style='display:none;'><div class='strToCennter'>" +
        "<div class='newConfigtitle'><label id='showtitletool' >新建点位</label></div>" +
        "<table class='showAddandEidentPointTabelClass'>" +
        "<tr><td  class='innerLeftq'>实时数据:</td><td class='innerRightqb'><input type='text' id='savetextRtdbID' readonly class='inputTextClass'/></td>" +
        "<td class='innerLeftq'>位号名称:</td><td class='innerRightqb'><input type='text' id='savetextTag' class='inputTextClass ControlProTextSty' maxlength='100' ischeck='false'></td>" +
        "<td class='innerLeftq'>数据类型:</td><td class='innerRightqb'><input type='text' id='savetextTagType' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'></td></tr>" +
        "<tr><td class='innerLeftq'>位号描述:</td><td class='innerRightqb'><input type='text'  id='savetextTagDescrption'class='inputTextClass ControlProTextSty'  maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>计量单位:</td><td class='innerRightqb'><input type='text' id='savetextUnitOfMeasure'class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'></td>" +
        "<td class='innerLeftq'>分组:</td><td class='innerRightqb'><input type='text' id='savetextGroup'class='inputTextClass ControlProTextSty'  maxlength='20' ischeck='false'/></td></tr>" +
        "<tr><td class='innerLeftq'>区域:</td><td class='innerRightqb'><input type='text'  id='savetextArea'class='inputTextClass ControlProTextSty'  maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>单元:</td><td class='innerRightqb'><input type='text'  id='savetextUnit'class='inputTextClass ControlProTextSty'  maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>操作台:</td><td class='innerRightqb'><input type='text'  id='savetextConsole' class='inputTextClass ControlProTextSty'  maxlength='20' ischeck='false'/></td></tr>" +
        "<tr><td class='innerLeftq'>操作工:</td><td class='innerRightqb'><input type='text'  id='savetextOperator' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'/></td>" +
        "<td colspan='2' style='text-align: center;'><input type='button' id='NewPointInfoBtn' value='添加' class='ToolConfigbtn' name='addPonitBtn'/>" +
        "<input style='display: inline;' id='CancelPointBtn' class='ToolConfigbtn' type='button' value='取消'/></td></tr>" +
        "</table>" +
        "</div></div>" +
    //   /* *//*    "<div class='box'>"+
        "<div class='borderClassDiv1'id='EdeitpointDivID' style='display:none;'><div class='strToCennter'>" +
        "<div class='newConfigtitle'><label id='showtitletool' >编辑点位</label></div>" +
        "<table class='showAddandEidentPointTabelClass'>" +
        "<tr><td  class='innerLeftq'>实时数据:</td><td class='innerRightqb'><input id='textRtdbID'readonly class='inputTextClass'/></td>" +
        "<td class='innerLeftq'>位号名称:</td><td class='innerRightqb'><input type='text' id='textTag' readonly class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>数据类型:</td><td class='innerRightqb'><input type='text' id='textTagType' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'></td></tr>" +
        "<tr><td class='innerLeftq'>位号描述:</td><td class='innerRightqb'><input type='text'  id='textTagDescrption'class='inputTextClass ControlProTextSty'  maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>计量单位:</td><td class='innerRightqb'><input type='text' id='textUnitOfMeasure' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>分组:</td><td class='innerRightqb'><input type='text' id='textGroup' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'/></td></tr>" +
        "<tr><td class='innerLeftq'>区域:</td><td class='innerRightqb'><input type='text'  id='textArea' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>单元:</td><td class='innerRightqb'><input type='text'  id='textUnit' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'/></td>" +
        "<td class='innerLeftq'>操作台:</td><td class='innerRightqb'><input type='text'  id='textConsole' class='inputTextClass ControlProTextSty'  maxlength='20' ischeck='false'/></td></tr>" +
        "<tr><td class='innerLeftq'>操作工:</td><td class='innerRightqb'><input type='text'  id='textOperator' class='inputTextClass ControlProTextSty' maxlength='20' ischeck='false'/></td>" +
        "<td colspan='2'><input type='button' id='NewPointInfoBtn' value='编       辑' class='Configbtn' /></td><td colspan='2'><input style='display: inline;' id='addPointBtn' class='Configbtn' type='button' value='添加新点位'/></td></tr>" +
        "</table>" +
        "</div>" +
        "</div>" +
        "</div>");
    // $("#EdeitpointDivID").hide() ;
    findTagSource(_rtdbID);
    PointInfoManageState = "save";
    BindPointRtdbIDKey();
    $("#savetextRtdbID").val(_rtdbID)
    $("#showPointBtn").hide(); //隐藏伸缩按钮
    $("#AddpointDivID").show();
} //end新建点位
/*伸缩 */
//$("#showPointBtn").live('',function(){
//    showFlextWindow();
//});
$("#addPointBtn").live('click', function () {
    $("#EdeitpointDivID").hide();
    $("#AddpointDivID").show();
    $("#showtitletool").text("新建点位");
    PointInfoManageState = "save";
    /* var Flextoggle = new _toggle(new Agi.Msg.OpenFlexToggleManage.id("AddpointDivID"),"fast");
    new Agi.Msg.OpenFlexToggleManage.id("showPointBtn").onclick = function(){
    Flextoggle.toggle();
    }*/
    //隐藏伸缩
});
function showFlextWindow() {
    var grid = $(".tagDataTabel").data("kendoGrid");
    var list = grid.select().text();
    if (list != "") {
        /*  $("#EdeitpointDivID").show();
        $("#AddpointDivID").hide();*/
        $("#showtitletool").text("编辑点位");
        PointInfoManageState = "update";
        $("#NewPointInfoBtn").val("修改");
        /*  var Flextoggle = new _toggle(new Agi.Msg.OpenFlexToggleManage.id("EdeitpointDivID"),"fast");
        new Agi.Msg.OpenFlexToggleManage.id("showPointBtn").onclick = function(){
        Flextoggle.toggle();
        }*/
        //隐藏伸缩
        var data = list.split(" ");
        var vartag = data[0];
        // alert(vartag);
        EditPointInfoOP(RtdbName, vartag.trim());
    }
    else {
        /*   $("#EdeitpointDivID").hide();
        $("#AddpointDivID").show();*/
        $("#showtitletool").text("新建点位");
        PointInfoManageState = "save";
        $("#NewPointInfoBtn").val("添加");
        /*  var Flextoggle = new _toggle(new Agi.Msg.OpenFlexToggleManage.id("AddpointDivID"),"fast");
        new Agi.Msg.OpenFlexToggleManage.id("showPointBtn").onclick = function(){
        Flextoggle.toggle();
        }*/
        //隐藏伸缩
    }

    /*释放临时变量*/
    grid = list = null;
}

var AllpointByRtdbID = [];
function findTagSource(_rtdid) {//点位数据整理成含有表头的数组
    var dataColumns = [];
    Agi.DCManager.DCFindPointDate(_rtdid, "", function (result) {
        if (result.result == "true") {
            var array = result.tagName;
            for (var i = 0; i < array.length; i++) {
                var DBrtdb = array[i].RtdbID,
                    DBtag = array[i].Tag,
                    DBtagType = array[i].TagType,
                    DBtagDescrption = array[i].TagDescrption,
                    DBunitOfMeasure = array[i].UnitOfMeasure,
                    DBgroup = array[i].Group,
                    DBarea = array[i].Area,
                    DBunit = array[i].Unit,
                    DBconsole = array[i].Console,
                    DBoperator = array[i].Operator;
                if (DBtag != "null") {
                    DBtag = DBtag;
                } else {
                    DBtag = " ";
                }
                if (DBtagType != "null") {
                    DBtagType = DBtagType;
                } else {
                    DBtagType = " ";
                }

                if (DBtagDescrption != "null") {
                    DBtagDescrption = DBtagDescrption;
                } else {
                    DBtagDescrption = " ";
                }
                if (DBunitOfMeasure != "null") {
                    DBunitOfMeasure = DBunitOfMeasure;
                } else {
                    DBunitOfMeasure = " ";
                }
                if (DBgroup != "null") {
                    DBgroup = DBgroup;
                } else {
                    DBgroup = " ";
                }
                if (DBarea != "null") {
                    DBarea = DBarea;
                } else {
                    DBarea = " ";
                }
                if (DBunit != "null") {
                    DBunit = DBunit;
                } else {
                    DBunit = " ";
                }
                if (DBconsole != "null") {
                    DBconsole = DBconsole;
                } else {
                    DBconsole = " ";
                }
                if (DBoperator != "null") {
                    DBoperator = DBoperator;
                } else {
                    DBoperator = " ";
                }
                AllpointByRtdbID.push(DBtag);
                dataColumns.push({
                    //   dbrtdb:DBrtdb +" ",
                    dbtag: DBtag + " ",
                    dbtagType: DBtagType + " ",
                    dbtagDescrption: DBtagDescrption + " ",
                    dbunitOfMeasure: DBunitOfMeasure + " ",
                    dbgroup: DBgroup + " ",
                    dbarea: DBarea + " ",
                    dbunit: DBunit + " ",
                    dbconsole: DBconsole + " ",
                    dboperator: DBoperator + " "
                });
            }
            FindTagColumnsData(dataColumns);
        } else {
            FindTagColumnsData(dataColumns);

            AgiCommonDialogBox.Alert(result.message, null);
            return;
        }
    });
}
$("#findOnePointBtn").live('click', function () {
    var di = $(".input_txt").val();
    if (di != "") {
        var idf = [];
        for (var x in AllpointByRtdbID) {
            if (AllpointByRtdbID[x] == di) {
                idf.push(di)
            }
        }
        if (idf.length > 0) {
            FindOnePoint(RtdbName, idf);
        } else {
            AgiCommonDialogBox.Alert("没有这个点位号");
            return;
        }
    }
    FindOnePoint(RtdbName, di);
});
function FindOnePoint(_rtdid, _tag) {//查找单条点位信息
    var dataColumns = [];
    Agi.DCManager.DCFindPointDate(_rtdid, _tag, function (result) {
        if (result.result == "true") {
            var array = result.tagName;
            for (var i = 0; i < array.length; i++) {
                var DBrtdb = array[i].RtdbID,
                    DBtag = array[i].Tag,
                    DBtagType = array[i].TagType,
                    DBtagDescrption = array[i].TagDescrption,
                    DBunitOfMeasure = array[i].UnitOfMeasure,
                    DBgroup = array[i].Group,
                    DBarea = array[i].Area,
                    DBunit = array[i].Unit,
                    DBconsole = array[i].Console,
                    DBoperator = array[i].Operator;
                if (DBtag != "null") {
                    DBtag = DBtag;
                } else {
                    DBtag = " ";
                }
                if (DBtagType != "null") {
                    DBtagType = DBtagType;
                } else {
                    DBtagType = " ";
                }

                if (DBtagDescrption != "null") {
                    DBtagDescrption = DBtagDescrption;
                } else {
                    DBtagDescrption = " ";
                }
                if (DBunitOfMeasure != "null") {
                    DBunitOfMeasure = DBunitOfMeasure;
                } else {
                    DBunitOfMeasure = " ";
                }
                if (DBgroup != "null") {
                    DBgroup = DBgroup;
                } else {
                    DBgroup = " ";
                }
                if (DBarea != "null") {
                    DBarea = DBarea;
                } else {
                    DBarea = " ";
                }
                if (DBunit != "null") {
                    DBunit = DBunit;
                } else {
                    DBunit = " ";
                }
                if (DBconsole != "null") {
                    DBconsole = DBconsole;
                } else {
                    DBconsole = " ";
                }
                if (DBoperator != "null") {
                    DBoperator = DBoperator;
                } else {
                    DBoperator = " ";
                }
                dataColumns.push({
                    // dbrtdb: "<input type='checkbox' />"+" ",
                    dbtag: DBtag + " ",
                    dbtagType: DBtagType + " ",
                    dbtagDescrption: DBtagDescrption + " ",
                    dbunitOfMeasure: DBunitOfMeasure + " ",
                    dbgroup: DBgroup + " ",
                    dbarea: DBarea + " ",
                    dbunit: DBunit + " ",
                    dbconsole: DBconsole + " ",
                    dboperator: DBoperator + " "
                });
            }
        } else {

            AgiCommonDialogBox.Alert(result.message);
            return;
        }
        FindTagColumnsData(dataColumns);
    });
}
function FindTagColumnsData(dataColumns) { //用表格的形式展示点位数据
    $(".tagDataTabel").html("");
    $(".tagDataTabel").kendoGrid({
        dataSource: {
            data: dataColumns
            // pageSize: 5
        },
        height: 230,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: false,

        // filterable: false,//筛选
        columns: [
            {
                template: '&nbsp' + '<input type="checkbox" class="isDelete"/>',
                width: 30,

                title: '&nbsp'
                //            field: "dbrtdb",
                //            width: 50,
                //            title: "实时数据"
            },
            {
                field: "dbtag",
                width: 80,

                title: "位号名称"
            },
            {
                field: "dbtagType",

                width: 50,
                title: "数据类型"
            },
            {
                field: "dbtagDescrption",

                width: 50,
                title: "位号描述"
            },
            {
                field: "dbunitOfMeasure",

                width: 50,
                title: "计量单位"
            },
            {
                field: "dbgroup",

                width: 50,
                title: "分组"
            },
            {
                field: "dbarea",

                width: 50,
                title: "区域"
            },
            {
                field: "dbunit",
                width: 50,

                title: "单元"
            },
            {
                field: "dbconsole",

                width: 50,
                title: "操作台"
            },
            {
                field: "dboperator",

                width: 50,
                title: "操作工"
            }
        ]
    });
    var grid = $(".tagDataTabel").data("kendoGrid");
    grid.thead.find("th:first")
        .append($('<input id="IsDeleteAll" type="checkbox"/>'))
    showFlextWindow();
}
$(".tagDataTabel").live('click', function () {
    showFlextWindow();
});

function BindPointRtdbIDKey() {//获取外键，并添加到页面
    Agi.DCManager.DCFindRtdbIDKey('', function (result) {
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            $.each(rtdsdata, function (i, val) {
                $("#savetextRtdbID").append("<option value='" + rtdsdata[i].RtdbID + "'>" + rtdsdata[i].RtdbID + "</option>");
            });
            /*释放临时变量*/
            rtdsdata = null;
        }
    });
}
$("#savetextRtdbID").live('chang', function () {
    $("#savetextRtdbID").val($("#savetextRtdbID").find("option:selected").text);
});
/*
$("#EditTag").live('click',function(){
var grid = $(".tagDataTabel").data("kendoGrid");
var list = grid.select().text();
var data = list.split(" ");
var varrtdbID = data[0];
var vartag = data[1];
EditPointInfoOP(varrtdbID,vartag);
});  */
//点击编辑读取点位详细信息并进行绑定
function EditPointInfoOP(_rtdid, _tag) {
    // this.PointInfoManageState = "update";
    Agi.DCManager.DCFindPointTabel(_rtdid, _tag, function (_result) {
        if (_result.result == "true") {
            var tagNamedate = _result.tagName
            if (tagNamedate != null) {
                // BindPointInfoDateSourceOP();
                var pointRtdbID = tagNamedate[0].RtdbID;
                var pointTag = tagNamedate[0].Tag;
                var pointTagType = tagNamedate[0].TagType;
                var pointTagDescrption = tagNamedate[0].TagDescrption;
                var pointUnitOfMeasure = tagNamedate[0].UnitOfMeasure;
                var pointGroup = tagNamedate[0].Group;
                var pointArea = tagNamedate[0].Area;
                var pointUnit = tagNamedate[0].Unit;
                var pointConsole = tagNamedate[0].Console;
                var pointOperator = tagNamedate[0].Operator;
                if (pointRtdbID != "null") {
                    pointRtdbID = pointRtdbID
                } else {
                    pointRtdbID = "";
                }
                if (pointTag != "null") {
                    pointTag = pointTag
                } else {
                    pointTag = "";
                }
                if (pointTagType != "null") {
                    pointTagType = pointTagType
                } else {
                    pointTagType = "";
                }
                if (pointTagDescrption != "null") {
                    pointTagDescrption = pointTagDescrption
                } else {
                    pointTagDescrption = "";
                }
                if (pointUnitOfMeasure != "null") {
                    pointUnitOfMeasure = pointUnitOfMeasure
                } else {
                    pointUnitOfMeasure = "";
                }
                if (pointGroup != "null") {
                    pointGroup = pointGroup
                } else {
                    pointGroup = "";
                }
                if (pointArea != "null") {
                    pointArea = pointArea
                } else {
                    pointArea = "";
                }
                if (pointUnit != "null") {
                    pointUnit = pointUnit
                } else {
                    pointUnit = "";
                }
                if (pointConsole != "null") {
                    pointConsole = pointConsole
                } else {
                    pointConsole = "";
                }
                if (pointOperator != "null") {
                    pointOperator = pointOperator
                } else {
                    pointOperator = "";
                }
                /*   $("#textRtdbID").val(pointRtdbID);
                $("#textTag").val(pointTag);
                $('#textTagType').val(pointTagType);
                $('#textTagDescrption').val(pointTagDescrption);
                $('#textUnitOfMeasure').val(pointUnitOfMeasure);
                $('#textGroup').val(pointGroup);
                $('#textArea').val(pointArea);
                $('#textUnit').val(pointUnit);
                $('#textConsole').val(pointConsole);
                $('#textOperator').val(pointOperator);*/
                $("#savetextRtdbID").val(pointRtdbID);
                $("#savetextTag").val(pointTag);
                $("#savetextTag").attr("readonly", "readonly");
                $('#savetextTagType').val(pointTagType);
                $('#savetextTagDescrption').val(pointTagDescrption)
                $('#savetextUnitOfMeasure').val(pointUnitOfMeasure);
                $('#savetextGroup').val(pointGroup);
                $('#savetextArea').val(pointArea);
                $('#savetextUnit').val(pointUnit);
                $('#savetextConsole').val(pointConsole);
                $('#savetextOperator').val(pointOperator);
            }
        } else {

            AgiCommonDialogBox.Alert(_result.message);
            return;
        }
    });
}
//点击点位信息保存
$("#NewPointInfoBtn").live('click', function () {
    $("#NewPointInfoBtn").attr("disabled", "true");
    var pointRtdbID;
    var pointTag;
    var pointTagType;
    var pointTagDescrption;
    var pointUnitOfMeasure;
    var pointGroup;
    var pointArea;
    var pointUnit;
    var pointConsole;
    var pointOperator;
    if (PointInfoManageState == "save") {
        pointRtdbID = $("#savetextRtdbID").val();
        pointTag = $("#savetextTag").val();
        pointTagType = $('#savetextTagType').val();
        pointRtdbID = pointRtdbID.replace(/(^\s+)|\s+$/g, "");
        pointTag = pointTag.replace(/(^\s+)|\s+$/g, "");
        pointTagType = pointTagType.replace(/(^\s+)|\s+$/g, "");

        for (var x in AllpointByRtdbID) { //判断输入的点位信息是否已存在
            if (AllpointByRtdbID[x] == pointTag) {
                AgiCommonDialogBox.Alert(AllpointByRtdbID[x] + "该点位信息已存在，请重新输入！", null);
                $("#savetextTag").val("");
                $("#NewPointInfoBtn").removeAttr("disabled");
                return;
            }
        }


        pointTagDescrption = $('#savetextTagDescrption').val()
        pointUnitOfMeasure = $('#savetextUnitOfMeasure').val();
        pointGroup = $('#savetextGroup').val();
        pointArea = $('#savetextArea').val();
        pointUnit = $('#savetextUnit').val();
        pointConsole = $('#savetextConsole').val();
        pointOperator = $('#savetextOperator').val();
        if (pointRtdbID == '' || pointTag == '') { //|| pointTagType == '' || pointTagDescrption==''|| pointUnitOfMeasure=="" || pointGroup==''|| pointArea==''||pointUnit==''||pointConsole==''||pointOperator==''){
            AgiCommonDialogBox.Alert("位号名称不能为空!");
            $("#NewPointInfoBtn").removeAttr("disabled");
            return false;
        }
    }
    else if (PointInfoManageState == "update") {
        /* pointRtdbID = $("#textRtdbID").val();
        pointTag = $("#textTag").val();
        pointTagType = $('#textTagType').val();
        pointTagDescrption = $('#textTagDescrption').val()
        pointUnitOfMeasure = $('#textUnitOfMeasure').val();
        pointGroup = $('#textGroup').val();
        pointArea = $('#textArea').val();
        pointUnit = $('#textUnit').val();
        pointConsole = $('#textConsole').val();
        pointOperator = $('#textOperator').val();*/
        pointRtdbID = $("#savetextRtdbID").val();
        pointTag = $("#savetextTag").val();
        pointTagType = $('#savetextTagType').val();
        pointTagDescrption = $('#savetextTagDescrption').val();
        pointUnitOfMeasure = $('#savetextUnitOfMeasure').val();
        pointGroup = $('#savetextGroup').val();
        pointArea = $('#savetextArea').val();
        pointUnit = $('#savetextUnit').val();
        pointConsole = $('#savetextConsole').val();
        pointOperator = $('#savetextOperator').val();


        //        if (pointTagType == '') {
        //            AgiCommonDialogBox.Alert("点位类型不能为空!");
        //            $("#NewPointInfoBtn").removeAttr("disabled");
        //            return false;
        //        }
    }
    var tagData = [
        {
            'rtdbID': pointRtdbID,
            'Tag': pointTag,
            'TagType': pointTagType,
            'TagDescrption': pointTagDescrption,
            'UnitOfMeasure': pointUnitOfMeasure,
            'Group': pointGroup,
            'Area': pointArea,
            'Unit': pointUnit,
            'Console': pointConsole,
            'Operator': pointOperator
        }
    ]
    Agi.DCManager.DCPointInfoSaveSave(PointInfoManageState, tagData, function (_reslut) {
        if (_reslut.result == "true") {
            $("#NewPointInfoBtn").removeAttr("disabled");
            if (this.PointInfoManageState == "save") {
                findTagSource(pointRtdbID)

                AgiCommonDialogBox.Alert("添加成功!", null);
                boolIsSave = true;
                //清空文本框
                // $("#savetextRtdbID").val("") ; //实时数据源不清空
                $("#savetextTag").val("");
                $('#savetextTagType').val("");
                $('#savetextTagDescrption').val("")
                $('#savetextUnitOfMeasure').val("");
                $('#savetextGroup').val("");
                $('#savetextArea').val("");
                $('#savetextUnit').val("");
                $('#savetextConsole').val("");
                $('#savetextOperator').val("");
            }
            else if (this.PointInfoManageState == "update") {
                findTagSource(pointRtdbID)

                AgiCommonDialogBox.Alert("修改成功!");
                boolIsSave = true;
                $("#savetextTag").attr("readonly", false);
                //清空文本框
                // $("#savetextRtdbID").val("") ; //实时数据源不清空
                $("#savetextTag").val("");
                $('#savetextTagType').val("");
                $('#savetextTagDescrption').val("")
                $('#savetextUnitOfMeasure').val("");
                $('#savetextGroup').val("");
                $('#savetextArea').val("");
                $('#savetextUnit').val("");
                $('#savetextConsole').val("");
                $('#savetextOperator').val("");
            }

            /*释放临时变量*/
            pointRtdbID = pointTag = pointTagType = pointTagDescrption = pointUnitOfMeasure = pointGroup = null;
            pointArea = pointUnit = pointConsole = pointOperator = null;
        }
        else {
            $("#NewPointInfoBtn").removeAttr("disabled");
            AgiCommonDialogBox.Alert(_reslut.message);
            /*释放临时变量*/
            pointRtdbID = pointTag = pointTagType = pointTagDescrption = pointUnitOfMeasure = pointGroup = null;
            pointArea = pointUnit = pointConsole = pointOperator = null;
        }


    });
}); //end点击点位信息保存

$("#CancelPointBtn").live('click', function () {  //点击取消按钮
    //20120123 倪飘 解决数据源-点位管理-连续点击两次取消按钮，添加按钮自动变为修改按钮问题
    if (PointInfoManageState == "save") {
        if ($('#savetextTag').text().trim() != "") {
            $("#showtitletool").text("编辑点位");
            $("#NewPointInfoBtn").val("修改");
        }
    } else if (PointInfoManageState == "update") {
        //20130117 14:30 markeluo 编辑点位时点击取消按钮，取消Grid 中选中点位的选中状态
        var grid = $("#BottomRightCenterOthersContentDiv").find(".tagDataTabel").data("kendoGrid");
        // clear the selection of items in the grid
        grid.clearSelection();

        $("#showtitletool").text("新建点位");
        $("#savetextTag").attr("readonly", false);
        $("#NewPointInfoBtn").val("添加");
        //20130115 倪飘 修改实时数据源点位管理，点击上方位号-->点击"取消"-->下方输入位号名称和数据类型-->点击"添加"-->弹出提示框："修改成功"-->点位号无变化问题
        PointInfoManageState = "save";

    }
    // $("#savetextRtdbID").val("") ; //实时数据源不清空
    $("#savetextTag").val("");
    $('#savetextTagType').val("");
    $('#savetextTagDescrption').val("")
    $('#savetextUnitOfMeasure').val("");
    $('#savetextGroup').val("");
    $('#savetextArea').val("");
    $('#savetextUnit').val("");
    $('#savetextConsole').val("");
    $('#savetextOperator').val("");
});

/*批量数据*************************************************************************************************************/
var AllapiPoint = [];
function GetApiPoints() {//点位数据整理成含有表头的数组
    var _RtdbName = RtdbName;
    var dataColumns = [];
    AllapiPoint = [];
    Agi.DCManager.DCGetApiPoint(_RtdbName, function (result) {
        if (result.result == "true") {
            var array = result.points;
            for (var i = 0; i < array.length; i++) {
                var DBtag = array[i]
                AllapiPoint.push(DBtag);
            }
            for (var x in AllpointByRtdbID) {
                for (var s in AllapiPoint) {
                    if (AllapiPoint[s] == AllpointByRtdbID[x]) {
                        AllapiPoint.splice(s, 1);
                    }
                }
            }
            // alert(AllapiPoint.length)
            for (var n = 0; n < AllapiPoint.length; n++) {
                var pointApi = AllapiPoint[n]
                dataColumns.push({
                    dbtag: pointApi + " "
                });
            }
        }
        $("#showLoad").hide();
        $("#showData").show();
        ApiPointsTotabel(dataColumns);
        $("#batchAdd").removeAttr("disabled"); //启用批量添加按钮
    });
}
function ApiPointsTotabel(dataColumns) { //用表格的形式展示点位数据
    $("#ApiSelectDGrid").empty();
    $("#ApiSelectDGrid").kendoGrid({
        dataSource: {
            data: dataColumns,
            pageSize: 10
        },
        height: 405,
        change: onChange,
        dataBound: onDataBound, //20121225 14:34 zhangpeng 添加
        selectable: "single row",
        // filterable: true,
        groupable: false,
        scrollable: true,
        sortable: true,
        //        scrollable: false,
        //        sortable: false,
        pageable: true,
        //    pageable: false,
        columns: [
            {
                field: "boolAdd",
                sortable: false,
                template: '<input type="checkbox" id="boolAdd" class="editable" />',
                width: 20,
                // filterable: false,
                // title: "多选添加"   var selected = grid.table.find("tr").find("td:first input:checked").closest("tr");
                title: "&nbsp"
            },
            {
                field: "dbtag",
                width: 110,
                title: "位号名称"
            }
        ]
    });
    var grid = $("#ApiSelectDGrid").data("kendoGrid");
    grid.thead.find("th:first").html("");
    grid.thead.find("th:first")
        .append($('<input id="selectAll" type="checkbox"/>'));
}

//获取模糊值的下标方法
var arrGetPointIndex = []; //保存于输入字符匹配的点位index
function GetLikeStringUnderIndex(str, container) {
    var startChar = str.charAt(0); //开始字符
    var strLen = str.length; //查找符串的长度
    var curCon;
    var isFind = false; //是否找到
    for (var i = 0; i < container.length; i++) {
        curCon = container[i];
        //alert(curCon);
        for (var j = 0; j < curCon.length; j++) {
            if (curCon.charAt(j) == startChar)//如果匹配起始字符,开始查找
            {     //alert(curCon.charAt(j));
                if (curCon.substring(j).substring(0, strLen) == str) { //起始值后的几个字符是否与输入的值相等
                    // alert(curCon.substring(j).substring(0,strLen));
                    arrGetPointIndex.push(i);
                }
            }
        }
    }

    /*释放临时变量*/
    startChar = strLen = curCon = isFind = null;
}
//Api点位信息的搜索
$("#textOneApiPointBtn").live('click', function () {
    var TextapiPoint = $("#textApiPoint").val();
    if (TextapiPoint != "") {
        //alert(TextapiPoint+"    " +AllapiPoint.length);
        GetLikeStringUnderIndex(TextapiPoint, AllapiPoint);
        if (arrGetPointIndex.length > 0) {
            var arrPoints = [];
            var arrApiPoints = AllapiPoint;
            for (var i = 0; i < arrGetPointIndex.length; i++) {
                arrPoints.push({
                    dbtag: arrApiPoints[arrGetPointIndex[i]] + " "
                });
            }
            if (arrPoints.length > 0) {
                ApiPointsTotabel(arrPoints);
            }
        } else {
            AgiCommonDialogBox.Alert("没有这个点位号！");
            return;
        }
    } else if (TextapiPoint === "") {
        AgiCommonDialogBox.Alert("输入点位为空，默认查询全部记录！");
        GetApiPoints();
    }
    arrGetPointIndex = [];

    /*释放临时变量*/
    TextapiPoint = null;
});
//显示点位信息批量添加窗口
$("#achieveBtn").live('click', function () {
    //$('#ApiSelectDataSource').draggable();

    //    $('#ApiSelectDataSource').draggable({
    //        handle: ".modal-header", containment: "#MainFrameDiv"
    //    });

    $("#ApiSelectDataSource").modal({ backdrop: false, keyboard: false, show: true });
    $('#ApiSelectDataSource').draggable("disable");
    $("#showLoad").show();
    $("#showData").hide();
    GetApiPoints();
    $("#textApiPoint").val(""); //搜索text清空
});
$("#closeBtn").live('', function () { //X点击关闭
    $("#ApiSelectDataSource").modal('hide');
});

/*全选、反选*/
//$("#AllCheckedBtn").live('click', function () {
$("#selectAll").live('click', function () {
    var ThisApiSelectDGridtbodytrs = $("#ApiSelectDGrid").find("tbody>tr");
    if ($(this).attr("checked") == "checked") {
        //$("#AllCheckedBtn").val("反选");
        for (var i = 0; i < ThisApiSelectDGridtbodytrs.length; i++) {
            $(ThisApiSelectDGridtbodytrs[i]).find("#boolAdd").attr("Checked", true);
        }
    }
    else {
        // $("#AllCheckedBtn").val("全选");
        for (var i = 0; i < ThisApiSelectDGridtbodytrs.length; i++) {
            $(ThisApiSelectDGridtbodytrs[i]).find("#boolAdd").attr("Checked", false);
        }
    }
    ThisApiSelectDGridtbodytrs = null; //DOM查询优化,清空临时变量

});
//批量添加
$("#batchAdd").live('click', function () {
    //禁用按钮
    $("#batchAdd").attr("disabled", "true");
    //checkBox 的选中状态
    var CheckdeApiPoints = []; //存放点位的数组
    var apiPoints = $("#ApiSelectDGrid").data("kendoGrid");
    var list = apiPoints.select().text();
    var boolCkeck = false;
    var ThisApiSelectDGridtrs = $("#ApiSelectDGrid").find("tbody>tr");
    for (var i = 0; i < ThisApiSelectDGridtrs.length; i++) {
        var _columName = $(ThisApiSelectDGridtrs[i]).find("td")[1].innerText; //点位名称
        boolCkeck = $(ThisApiSelectDGridtrs[i]).find("#boolAdd").attr("checked") == "checked" ? "true" : "false"; //是否添加
        //checkBox为选中状态时点位信息添加到数组中
        // alert(boolCkeck+"  "+_columName);
        if (boolCkeck == "true") {
            CheckdeApiPoints.push(_columName);
        }
    }
    ThisApiSelectDGridtrs = null; //DOM查询优化,临时变量清空

    if (CheckdeApiPoints.length == 0) {
        AgiCommonDialogBox.Alert("请选中点位后再批量添加！", null);
        $("#batchAdd").removeAttr("disabled");
        return;
    }
    // alert(CheckdeApiPoints);
    var Taglist = [];
    for (var i = 0; i < CheckdeApiPoints.length; i++) {
        Taglist.push({ 'rtdbID': RtdbName, 'Tag': CheckdeApiPoints[i], 'TagType': '', 'TagDescrption': '', 'UnitOfMeasure': '', 'Group': '', 'Area': '', 'Unit': '', 'Console': '', 'Operator': '' });
    }
    CheckdeApiPoints = [];

    console.log("添加点位:" + JSON.stringify(Taglist));
    Agi.DCManager.DCPointInfoSaveSave("save", Taglist, function (_reslut) {
        if (_reslut.result == "true") {
            AllpointByRtdbID = [];
            findTagSource(RtdbName);
            console.log("弹出对话框！")
            AgiCommonDialogBox.CallBakAlert("添加成功!", null, function () {
                $("#AllCheckedBtn").val("全选");
                GetApiPoints(); //添加成功后刷新表
            });
            /*释放临时变量*/
            CheckdeApiPoints = apiPoints = list = boolCkeck = Taglist = null;
        }
        else {
            AgiCommonDialogBox.CallBakAlert(_reslut.message, null, function () {
                $("#batchAdd").removeAttr("disabled");
                /*释放临时变量*/
                CheckdeApiPoints = apiPoints = list = boolCkeck = Taglist = null;
            });

        }
    });
});
/**********************************************************************************************************************/
/*删除的全选、反选*/
//$("#CkeckedAllTagBtn").live('click', function () {
$("#IsDeleteAll").live('click', function () {
    var ThisTagDataTabeltrs = $(".tagDataTabel").find("tbody>tr");
    if ($(this).attr("checked") == "checked") {
        //$("#CkeckedAllTagBtn").val("反选");
        for (var i = 0; i < ThisTagDataTabeltrs.length; i++) {
            $(ThisTagDataTabeltrs[i]).find(".isDelete").attr("checked", true); //是否添加
        }
    }
    else {
        //$("#CkeckedAllTagBtn").val("全选");
        for (var i = 0; i < ThisTagDataTabeltrs.length; i++) {
            $(ThisTagDataTabeltrs[i]).find(".isDelete").attr("checked", false); //是否添加
        }
    }
    ThisTagDataTabeltrs = null; //DOM查询优化,临时变量清空
});

//点击按钮删除点位
$("#deleteBtn").live('click', function () {
    var vartagList = []
    var tagDataTabelTbodytrArray = $(".tagDataTabel").find("tbody>tr");
    for (var i = 0; i < tagDataTabelTbodytrArray.length; i++) {
        var _columName = $(tagDataTabelTbodytrArray[i]).find("td")[1].innerText; //点位名称
        var isCkeck = $(tagDataTabelTbodytrArray[i]).find(".isDelete").attr("checked") == "checked" ? "true" : "false"; //是否添加
        //checkBox为选中状态时点位信息添加到数组中
        if (isCkeck == "true") {
            vartagList.push(_columName.trim());
        }
    }
    tagDataTabelTbodytrArray = null; //DOM查询优化,临时变量清空

    if (vartagList.length > 0) {
        var content = "确定删除点位：" + vartagList + "?";
        AgiCommonDialogBox.Confirm(content, null, function (result) {
            if (result) {
                Agi.DCManager.DCDeletePoint(RtdbName, vartagList, function (_result) {
                    if (_result.result == "true") {
                        for (var x in vartagList) {
                            for (var s in AllpointByRtdbID) {
                                if (AllpointByRtdbID[s] == vartagList[x]) {
                                    AllpointByRtdbID.splice(s, 1);
                                }
                            }
                        }
                        AllpointByRtdbID = [];
                        AllapiPoint = [];
                        findTagSource(RtdbName)
                        AgiCommonDialogBox.Alert(_result.message);
                        //  $("#textRtdbID").val();
                        $("#textTag").val(""); //删除一条记录后，将编辑框清空
                        $('#textTagType').val("");
                        $('#textTagDescrption').val("");
                        $('#textUnitOfMeasure').val("");
                        $('#textGroup').val("");
                        $('#textArea').val("");
                        $('#textUnit').val("");
                        $('#textConsole').val("");
                        $('#textOperator').val("");

                        $("#savetextTag").val(""); //删除一条记录后，将编辑框清空
                        $('#savetextTagType').val("");
                        $('#savetextTagDescrption').val("");
                        $('#savetextUnitOfMeasure').val("");
                        $('#savetextGroup').val("");
                        $('#savetextArea').val("");
                        $('#savetextUnit').val("");
                        $('#savetextConsole').val("");
                        $('#savetextOperator').val("");
                        $("#savetextTag").attr("readonly", false);

                        $("#CkeckedAllTagBtn").val("全选");
                        menuManagement.loadRealTimeDC($('#RealTimeListContaner'));
                    }
                    else {
                        AgiCommonDialogBox.Alert(_result.message);
                        return;
                    }
                });
            } else {
                return;
            }
        });

        //if (confirm("确定删除点位：" + vartagList + "?")) {
        //    Agi.DCManager.DCDeletePoint(RtdbName, vartagList, function (_result) {
        //        if (_result.result == "true") {
        //            for (var x in vartagList) {
        //                for (var s in AllpointByRtdbID) {
        //                    if (AllpointByRtdbID[s] == vartagList[x]) {
        //                        AllpointByRtdbID.splice(s, 1);
        //                    }
        //                }
        //            }
        //            AllpointByRtdbID = [];
        //            AllapiPoint = [];
        //            findTagSource(RtdbName)
        //            alert(_result.message);
        //            //  $("#textRtdbID").val();
        //            $("#textTag").val(""); //删除一条记录后，将编辑框清空
        //            $('#textTagType').val("");
        //            $('#textTagDescrption').val("");
        //            $('#textUnitOfMeasure').val("");
        //            $('#textGroup').val("");
        //            $('#textArea').val("");
        //            $('#textUnit').val("");
        //            $('#textConsole').val("");
        //            $('#textOperator').val("");
        //            $("#CkeckedAllTagBtn").val("全选");
        //        }
        //        else {
        //            alert(_result.message);
        //            return;
        //        }
        //    });
        //} else { return; }
    } else {
        AgiCommonDialogBox.Alert("请选中您要删除的点位！");
        return;
    }
});

//点位信息end----------------------------------------------------------------------------------------------------------------------------------------------------------------//关系配置=====================================================================================================================

//关系配置=====================================================================================================================
function AddNewTagGroupConfig() {
    ShowOperationData();
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("" +
        "<div class='borderClassDiv'><div class='newConfigtitle'>新建关系配置</div><div class='OutDivd'>" +
        "<div word-wrap : normal ><label class='labelSty'>实时数据连接：</label></div><div id='selectConfigRtdbID' class='RightConfig'></div>" +
        "<div  word-wrap : normal><label class='labelSty'>分组ID：</label></div><div id='textConfigGroupID'  class='RightConfig' ></div>" +
        "<div><label class='labelSty'>位号名称：</label></div><div id='selectAddConfigTag'  class='RightConfig'></div></div>" +
        "<div class='DivforBtnClass'><input type='button' id='NewGroupConfigBtn' value='添      加'class='Configbtn' /></div></div>");
    AddOption();
    cilikLabelFindGroupManagerID();
    // zTreeView();
}
function AddOption() {
    Agi.DCManager.DCFindRtdbIDKey('', function (result) { //实时数据连接
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            $.each(rtdsdata, function (i, val) {
                $("#selectConfigRtdbID").append("<label id=" + rtdsdata[i].RtdbID + ">" + rtdsdata[i].RtdbID + "</label>");
            });
        }
    });
}
$("#selectConfigRtdbID > label").live('click', function (event) {
    eventRtdbID = event.target.id; //获得当前点击对象的ID
    //    cilikLabelFindGroupManagerID(eventRtdbID);
    clickLabelFindtag(eventRtdbID);
    zTreeView();
});
function clickLabelFindtag(_rtdbid) { //根据实时数据源ID查找Tag
    Agi.DCManager.DCFindPointDate(_rtdbid, "", function (result) { //位号名称
        var rtdsdata = result.tagName;
        if (rtdsdata != null) {
            $.each(rtdsdata, function (i, val) {
                $("#selectAddConfigTag").append("<input name='ConfigTagCheckBox' class='ConfigTagCheckBox' type='checkbox' id='point" + rtdsdata[i].Tag + "'>" + rtdsdata[i].Tag + "</input><br/>");
            });
        }
    });
}
//获得根节点
var footNodeGroupID = "";
function cilikLabelFindGroupManagerID() {//根据实时数据源ID查找分组ID
    Agi.GroupManager.RGLoad('', '0', function (result) {
        var isParent = true;
        var AllGroup = result.GroupName;
        if (AllGroup != null) {
            footNodeGroupID = "[";
            $.each(AllGroup, function (i, val) {
                footNodeGroupID += "{id:" + AllGroup[i].GroupID + ",pId:0,name:'" + AllGroup[i].GroupName + "',RtdbID:" + AllGroup[i].RtdbID + ",open:false,isParent:" + isParent + "},";
            });
            footNodeGroupID = footNodeGroupID.substring(0, footNodeGroupID.length - 1);
            footNodeGroupID += "]";
        }
        $("#textConfigGroupID").append("<div class='zTreeDemoBackground'> <ul id='treeDemo' class='tree'></ul></div>");
        // zTreeView();
        // zTreeView();
    });
}
////zTree==================================================================================================
function zTreeView() {
    var zTreeObj;
    var treeNode = eval(footNodeGroupID);
    var setting = {
        isSimpleData: true,
        treeNodeKey: "id",
        treeNodeParentKey: "pId",
        showLine: true,
        expandSpeed: false,
        checkable: true,
        root: {
            isRoot: true,
            nodes: []
        },
        check: {
            //enable: true,
            chkStyle: "checkbox",
            chkboxType: { "Y": "Ps", "N": "Ps"} //checkbox父子关联效果
        },
        callback: {
            click: zTreeOnClick
        }
    };
    zTreeObj = ($("#treeDemo").zTree(setting, treeNode));
    function zTreeOnChange(event, treeId, treeNode) {
    }

    var ClickCount = 0;

    function zTreeOnClick(event, treeId, treeNode) {
        alert(event);
        alert(treeId);
        alert("找到节点信息:id=" + treeNode.id + ", name=" + treeNode.name + ",RtdbID=" + treeNode.RtdbID + ", isParent=" + treeNode.isParent);
        // if(treeNode.open == false){
        if (treeNode.children == null) {
            // if(treeNode.nodes=null){
            Agi.GroupManager.RGLoad(treeNode.RtdbID, treeNode.id, function (result) {
                var GroupLevel = result.GroupName;
                if (GroupLevel != null) {
                    var LevelList = "[";
                    $.each(GroupLevel, function (i, val) {
                        LevelList += "{id:" + GroupLevel[i].GroupID + ",pId:" + treeNode.id + ",name:'" + GroupLevel[i].GroupName + "',RtdbID:" + GroupLevel[i].RtdbID + ",open:false,isParent:" + treeNode.isParent + "},";
                    });
                    LevelList = LevelList.substring(0, LevelList.length - 1);
                    LevelList += "]";
                    alert(LevelList);
                }
                var newNode = eval(LevelList);
                var srcNode = zTreeObj.getSelectedNode();
                zTreeObj.addNodes(srcNode, newNode);
            });
        } else {
            return;
        }

    }
}
////zTree==================================================================================================
$("#textConfigGroupID>input").live('click', function (event) {//分组Id选中
    var varGroupID = "";
    if ($("#" + event.target.id).attr("checked") == "checked") {
        //alert(event.target.id+$("#"+event.target.id).attr("checked"));
        varGroupID += event.target.id;
    }
    //alert(varGroupID);
    saveGroupID = varGroupID;
});
$("#selectAddConfigTag").find(".ConfigTagCheckBox").live('click', function (event) {//分组Id选中
    var varTag = "";
    if ($("#" + event.target.id).attr("checked") == "checked") {
        //alert(event.target.id+$("#"+event.target.id).attr("checked"));
        var str = event.target.id.toString();
        str = str.substring(5, str.length);
        varTag += str;
    }
    saveTag = varTag;
});

$("#NewGroupConfigBtn").live('click', function () {
    //   var arr= document.getElementsByName("ConfigTagCheckBox");
    //    var varTag ="";
    //    for(var i=0; i<arr.length; i++){
    //        alert($("#"+arr[i].id).attr("checked"));
    //        if($("#"+arr[i]).attr("checked")) {
    //            varTag +=arr[i].id
    //        }
    //    }
    //    saveTag =  varTag;
    Agi.DCManager.AddGroupConfig(eventRtdbID, saveGroupID, saveTag, function (reslut) {
        if (reslut.result == "true") {
            //alert(reslut.message);
            AgiCommonDialogBox.Alert(reslut.message);
            cilikLabelFindGroupManagerID();
            clickLabelFindtag();
        }
    });
});
//添加end============================================================================================================
function UpdateTagGroupConfig() {
    ShowOperationData();
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("" +
        "<div class='borderClassDiv'><div class='newConfigtitle'>编辑关系配置</div><div class='OutDivd'>" +
        "<div word-wrap : normal ><label class='labelSty'>实时数据连接：</label></div><div id='UpdateConfigRtdbID' class='RightConfig'></div>" +
        "<div  word-wrap : normal><label class='labelSty'>分组ID：</label></div><div id='UpdateConfigGroupID'  class='RightConfig' ></div>" +
        "<div><label class='labelSty'>位号名称：</label></div><div id='UpdateConfigTag'  class='RightConfig' ></div></div>" +
        "<div class='DivforBtnClass'><input type='button' id='UpdateTagGroupConfigBtn' value='修       改' class='Configbtn'/></div></div>");
    UpdateConfig();
}
function UpdateConfig() {
    Agi.DCManager.DCFindRtdbIDKey('', function (result) { //实时数据连接
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            $.each(rtdsdata, function (i, val) {
                $("#UpdateConfigRtdbID").append("<label id=" + rtdsdata[i].RtdbID + ">" + rtdsdata[i].RtdbID + "</label>");
            });
        }
    });
}
$("#UpdateConfigRtdbID > label").live('click', function (event) {
    eventRtdbID = event.target.id; //获得当前点击对象的ID
    alert(eventRtdbID);
    FindGroupIDByRtdbID(eventRtdbID);
});

function FindGroupIDByRtdbID(_RtdbID) {//根据实时数据源ID查找分组ID
    Agi.DCManager.FindGroupConfig(_RtdbID, "", function (_result) {
        var configData = _result.configData; //GroupID
        if (configData != null) {
            $.each(configData, function (i, val) {
                $("#UpdateConfigGroupID").append("<input type='checkbox' id=" + configData[i].GroupID + ">" + configData[i].GroupID + "</input><br/>");
                $("#UpdateConfigTag").append("<input type='checkbox' id=point" + configData[i].Tag + ">" + configData[i].Tag + "</input><br/>");
                $("#" + configData[i].GroupID).attr("checked", "checked");
                $("#" + configData[i].Tag).attr("checked", "checked");
            });
        }
    });
}

$("#UpdateConfigGroupID>input").live('click', function (event) {//分组Id选中
    var varGroupID = "";
    if ($("#" + event.target.id).attr("checked") == "checked") {
        //alert(event.target.id+$("#"+event.target.id).attr("checked"));
        varGroupID += event.target.id;
    }
    saveGroupID = varGroupID;
});
$("#UpdateConfigTag>input").live('click', function (event) {//分组Id选中
    // alert(event.target.id);
    var varTag = "";
    if ($("#" + event.target.id).attr("checked") == "checked") {
        var str = event.target.id.toString();
        str = str.substring(5, str.length);
        varTag += str;
    }
    saveTag = varTag;
});

$("#UpdateTagGroupConfigBtn").live('click', function () {
    Agi.DCManager.AddGroupConfig(eventRtdbID, saveGroupID, saveTag, function (reslut) {
        if (reslut.result == "true") {
            //alert(reslut.message);
            AgiCommonDialogBox.Alert(reslut.message);
            FindGroupIDByRtdbID(eventRtdbID);
        }
    });
});
//update end ===============================================================================================================================
function DeleteTagGroupConfig() {
    ShowOperationData();
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("" +
        "<div class='borderClassDiv'><div class='newConfigtitle'>删除关系配置</div><div class='OutDivd'>" +
        "<div word-wrap : normal ><label class='labelSty'>实时数据连接：</label></div><div id='deleteConfigRtdbID' class='RightConfig'></div>" +
        "<div  word-wrap : normal><label class='labelSty'>分组ID：</label></div><div id='deleteConfigGroupID'  class='RightConfig' ></div>" +
        "<div word-wrap : normal><label class='labelSty'>位号名称：</label></div><div id='deleteConfigTag'  class='RightConfig' ></div></div>" +
        "<div class='DivforBtnClass'><input type='button' id='DeleteTagGroupConfigBtn' value='删      除' class='Configbtn'/></div></div>");
    DeleteConfig();    // Agi.DCManager.DeleteGroupConfig
}
function DeleteConfig() {
    Agi.DCManager.DCFindRtdbIDKey('', function (result) { //实时数据连接
        var rtdsdata = result.rtdbData;
        if (rtdsdata != null) {
            $.each(rtdsdata, function (i, val) {
                $("#deleteConfigRtdbID").append("<label id=" + rtdsdata[i].RtdbID + ">" + rtdsdata[i].RtdbID + "</label>");
            });
        }
    });
}
$("#deleteConfigRtdbID>label").live('click', function (event) {
    eventRtdbID = event.target.id; //获得当前点击对象的ID
    // alert(eventRtdbID);
    DeleteGroupIDByRtdbID(eventRtdbID);
});
function DeleteGroupIDByRtdbID(_RtdbID) {//根据实时数据源ID查找分组ID
    Agi.DCManager.FindGroupConfig(_RtdbID, "", function (_result) {
        var configData = _result.configData; //GroupID
        if (configData != null) {
            $.each(configData, function (i, val) {
                $("#deleteConfigGroupID").append("<input type='checkbox' id=" + configData[i].GroupID + ">" + configData[i].GroupID + "</input><br/>");
                $("#deleteConfigTag").append("<input type='checkbox' id=point" + configData[i].Tag + ">" + configData[i].Tag + "</input><br/>");
                //                $("#"+configData[i].GroupID).attr("checked","checked");
                //                $("#"+configData[i].Tag).attr("checked","checked");
            });
        }
    });
}
$("#deleteConfigGroupID>input").live('click', function (event) {//分组Id选中
    var varGroupID = "";
    if ($("#" + event.target.id).attr("checked") == "checked") {
        alert(event.target.id + $("#" + event.target.id).attr("checked"));
        varGroupID += event.target.id;
    }
    saveGroupID = varGroupID;
});
$("#deleteConfigTag>input").live('click', function (event) {//分组Id选中
    var varTag = "";
    if ($("#" + event.target.id).attr("checked") == "checked") {
        var str = event.target.id.toString();
        str = str.substring(5, str.length);
        varTag += str;

        AgiCommonDialogBox.Alert(str);
    }
    saveTag = varTag;
});
$("#DeleteTagGroupConfigBtn").live('click', function () {
    //    alert(eventRtdbID);
    //    alert(saveGroupID);
    //    alert(saveTag);
    var content = "确定删除配置关系：" + eventRtdbID + saveGroupID + saveTag + "?";
    AgiCommonDialogBox.Confirm(content, null, function (flag) {

        if (flag) {
            Agi.DCManager.DeleteGroupConfig(eventRtdbID, saveGroupID, saveTag, function (reslut) {
                if (reslut.result == "true") {
                    AgiCommonDialogBox.Alert(reslut.message, null);
                    DeleteGroupIDByRtdbID(eventRtdbID);
                }
            });
        } else {
            return;
        }
    });
});
//关系配置end====================================================================================================================================




//表清单，视图清单，存储过程清单显示页面
function ShowAllListT(dbname, type) {
    this.DBname = dbname;
    this.Structuretype = type;
    ShowOperationData();
    //$("#BottomRightText").text("表清单");
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='AllListDiv'><div class='OverT'><div class='ShowList'><div class='textinput'>" + DBname + "    :    " + Structuretype + "</div><div>" +
        "<div class='clientsDb'><div id='grid1'></div></div></div></div><div class='ShowList'><div class='textinput' id='ColumnsName'>列名</div><div>" +
        "<div class='clientsDb'><div id='grid2'></div></div></div></div></div>");
    //20130715 倪飘 解决bug，存储过程清单中列名展示框不需要显示
    if (type === "Procedures") {
        $("#ColumnsName").css("display", "none");
    }
    GetNamesByID();
}
function GetNamesByID() {
    var dataNames = [];
    var NamesList = "";
    var ColumnsList = "";
    var nameID = "";
    Agi.DCManager.DCGetNamesByID(DBname, function (_result) {
        if (Structuretype == "Tables") {
            NamesList = GetArrayList(_result.tableData);
            nameID = NamesList[0];
        }
        else if (Structuretype == "Views") {
            NamesList = GetArrayList(_result.viewData);
            nameID = NamesList[0];
        }
        else {
            NamesList = GetArrayList(_result.StoredProcedureData);
        }
        for (var i = 0; i < NamesList.length; i++) {
            var _DBType = Structuretype,
                _DBName = NamesList[i],
                _DBOpe = "";
            dataNames.push({
                Structuretype: _DBType + " ",
                TablesName: _DBName + " ",
                Operating: _DBOpe + " "
            });
        }
        BindNameData(dataNames);
        if (nameID != "") {
            GetColumnsByID(nameID, "Grid2");
        }
    });
}
function GetColumnsByID(nameID, PageType) {
    var Columndata = [];
    Agi.DCManager.DCGetColumnsByID(DBname, nameID, function (_result) {
        if (_result.result == "true") {
            var array = _result.columnData;
            for (var i = 0; i < array.length; i++) {
                var _tname = nameID,
                    _lname = array[i].columnName,
                    _dtype = array[i].dataType;
                _remark = null;
                Columndata.push({
                    TName: _tname + " ",
                    LName: _lname + " ",
                    DType: _dtype + " ",
                    Remark: _remark + " "
                });
            }
            //debugger;
            if (PageType == "Grid2") {

                BindColumnsData(Columndata);
            }
            else {
                BindDetailsColumn(Columndata);
            }
        }

    });
}
//新建虚拟表
function AddNewVirtualTable() {
    //    $("#VTSelectDS").modal({ backdrop:false, keyboard:false, show:true });
    ////    $('#VTSelectDS').draggable({
    ////        handle: ".modal-header"
    ////    });
    //    $('#VTSelectDS').draggable("disable");
    if (!dialogs._VTSelectDS.dialog('isOpen')) {
        dialogs._VTSelectDS.dialog('open');
    }
    GetDataSourceToVT("标准");
}

//新建虚拟表的取消操作
$("#CancelVirtualBtn").live('click', function () {
    //    $("#VTSelectDS").modal('hide');
    dialogs._VTSelectDS.dialog('close');
    boolIsSave = true;
    ShowMainFramePage();
});
//新建虚拟表的完成操作
$("#VirtualOK").live('click', function () {
    var grid = $("#DataSourcegrid").data("kendoGrid");
    var list = grid.select().text();
    if (list == "") {

        AgiCommonDialogBox.Alert("请先选择数据源!");
        return false;
    }
    var data = list.split(" ");
    NewVirtualTableDBName = data[0];
    NewVirtualTableDBType = data[1];
    NewVirtualTableDBTypeDes = data[2];
    //    alert(NewVirtualTableDBName + " " + NewVirtualTableDBType + " " + NewVirtualTableDBTypeDes);
    //    $("#VTSelectDS").modal('hide');
    dialogs._VTSelectDS.dialog('close');
    AddVTManage(NewVirtualTableDBName, NewVirtualTableDBType);
});
function AddVTManage(_dataSourceName, _DBType) {
    booselect = false;
    ShowOperationData();
    this.vtAction = "save";
    _count = 20;
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='Detailquery' class='DetailqueryClass'>" +
        "<div class='OverT'" +
        "<div class='box'>" +
        "<div class='tagMenu' id='tagMenuID'><ul class='menu'><li>基本信息</li><li>字段列</li><li>预览</li></ul></div>" +
        "<div class='overTable'>" +
        "<div class='overTable' id='overTableID'>" +
        "<div class='content' id='conID'>" +
        "<div class='layout' id='divFrame'>" +
        "<div class='OutDiv'><div class='innerLeft'><label class='labelSty'>名称:</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='VTName'  maxlength='30' ischeck='true'/></div></div>" +
        "<div class='OutDiv'><div class='innerLeft'><label class='labelSty'>备注:</label></div><div class='innerRight'><textarea class='textareaSty ControlProTextSty' id='VTDescription'  maxlength='100' ischeck='true' style='resize:none;'></textarea></div></div>" +
        "<div class='OutDiv'><div class='innerLeft' id='innerLeftId'><label class='labelSty' id='labelleftID'>数据源信息:</label></div><div class='innerRight'>数据源名称:" + _dataSourceName + "<lable>&nbsp;&nbsp;&nbsp;&nbsp;</lable>" + "   数据源类型:" + _DBType + "</div></div>" +
        "</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div>" +
        "<div class='layout'><div class='textinput'></div><div id='grid5'></div></div>" +
        "<div class='layout'>" +
        "<div class='textinput' id='inputSQl'>输入SQL语句</div><div ><textarea class='textareaSty1' id='VTSQL' style='resize:none;'></textarea></div>" +
        "<div class='textinput' id='textinputS'>最大记录数<input type='number' id ='txtCount' class='cssTxtCount ControlProNumberSty' defaultvalue='20' value ='" + _count + "' min='0' max='1000' style='margin-left:20px;'/><input type='button' class='classSelect' id='VTSelect' value='生成语句并查询' /><input type='button' id='btnSave' class='classSave' value='保存结果' /></div>" +
        "<div id='grid6'></div></div>" +
        "</div></div></div></div>");
    BingDetailQuery();
    //    $("#btnSave").attr('disabled', true);

}

//检查Sql语句是否错误
var SqlIsReturnValue = true;
//生成语句并查询事件
$("#VTSelect").live('click', function () {
    _count = $("#txtCount").val();
    _strSQL = $("#VTSQL").val();
    $("#grid6").html("");
    $("#grid5").html("");

    if (_strSQL == "") {

        AgiCommonDialogBox.Alert("sql语句不能为空!");
        return;
    }
    checkStrSQL();
    //有参数
    if (arrayKeyValue.length > 0) {
        $("#sqlKeyValues").find("option").remove();
        //弹出窗体
        //        $('#keyModal').modal({ backdrop:false, keyboard:false, show:true });
        if (!dialogs._keyModal.dialog('isOpen')) {
            dialogs._keyModal.dialog('open');
        }
        //验证SQL语句是否需要传入值 
        for (var i in arrayKeyValue) {
            $("#sqlKeyValues").append("<option value='" + arrayKeyValue[i].key + "'>" + arrayKeyValue[i].key + "</option>");
        }
        $("#sqlKeyValues").find("option")[0].selected = true;
        PresqlKeyValues = $("#sqlKeyValues").val();
        GetKeyValues();
        $('#sqlKeyValues').change(function () {
            SetKeyValues();
            GetKeyValues();
            PresqlKeyValues = $("#sqlKeyValues").val();
        });
        $("#btnSqlSelect").live('click', function () {
            booselect = true;
            GetVTDataBySQL(true);
        });
    }
    else {
        //没有参数
        booselect = true; //20121227 9:43 倪飘 解决被删除的标准虚拟表仍然可以在编辑页面进行编辑和保存问题
        GetVTDataBySQL(false);
    }
});
$("#btnSave").live('click', function () {
    var _VTName = $("#VTName").val();
    if (_VTName.trim() == "") {

        AgiCommonDialogBox.Alert("请输入实体名称!");
        return;
    }
    if (booselect == false) {

        AgiCommonDialogBox.Alert("请先执行[生成语句并查询],如查询语句带有参数,必须为参数填写默认值!");
        return;
    }
    booselect = false;   //20121226 17:00 倪飘 虚拟表点击生成并查询语句后才可保存

    if (SqlIsReturnValue == false) {
        AgiCommonDialogBox.Alert("查询语句填写错误，不能保存成功!");
        return;
    }
    var vtCreatType = "自定义";
    var para = [];
    if (arrayKeyValue.length > 0) {
        for (var i = 0; i < arrayKeyValue.length; i++) {
            var _paraName = arrayKeyValue[i].key;
            _paraName = _paraName.substring(3, _paraName.length);
            var _paraType = arrayKeyValue[i].type;
            var _paraValue = arrayKeyValue[i].value;
            if (Agi.WebServiceConfig.Type == ".NET") {
                if (NewVirtualTableDBType == "SQLServer") {
                    _paraType = "NVARCHAR";
                } else if (NewVirtualTableDBType == "Excel") {
                    _paraType = "VARCHAR";
                }
                else {
                    _paraType = "NVARCHAR2";
                }
            } else {
                if (NewVirtualTableDBType == "SQLServer") {
                    _paraType = "NVARCHAR";
                } else if (NewVirtualTableDBType == "Excel") {
                    _paraType = "VARCHAR";
                }
                else {
                    switch (_paraType) {
                        case "DATETIME":
                            _paraType = "DATE";
                            break;
                        case "NUMBER":
                            break;
                        case "NVARCHAR2":
                            break;
                        case "CURSOR":
                            _paraType = "NVARCHAR2";
                            break;
                        default:
                            break;
                    }
                }
            }
            //markeluo 20130903 15:18 修改 由于.NET 后台访问实体组件需要"[,,]%DBTYPE格式，而JAVA不需要，所以区分处理"
            if (Agi.WebServiceConfig.Type == ".NET") {
                para.push({
                    paraName: _paraName,
                    paraType: _paraType + "[,,]%DBTYPE",
                    Default: _paraValue
                })
            } else {
                para.push({
                    paraName: _paraName,
                    paraType: _paraType,
                    Default: _paraValue
                })
            }
        }
    }
    var schema = [];
    if (Columns.length > 0) {
        for (var i = 0; i < Columns.length; i++) {
            //schema.push(Columns[i].field);
            //如果要支持特殊字符  这里必须保存列名 update by sunming 2014-01-15
            schema.push(Columns[i].title);
        }
    }
    var Strspecification = $("#VTDescription").val(); //20121224 16:53 markeluo 创建虚拟表时添加备注信息
    if (vtAction == "save") {
        Agi.VTManager.VTGetTableDetailsByDS(NewVirtualTableDBName, _VTName, function (result) {
            if (result.result == "false") {
                $("#btnSave").attr('disabled', true);
                Agi.VTManager.VTSave(vtAction, _VTName, NewVirtualTableDBName, vtCreatType, _strSQL, para, schema, data1, NewVirtualTableDBType, Strspecification, function (result) {
                    if (result.result == "true") {
                        this.vtAction = "update";
                        $("#VTName").attr('readonly', true);
                        Agi.VTManager.VTGetVirtualTableByDS(NewVirtualTableDBName, function (result) {
                            AddVTMenuDetails(result);
                            $("#btnSave").attr('disabled', false);

                            AgiCommonDialogBox.Alert("添加成功!");
                            boolIsSave = true;
                        });
                    }
                    else {
                        $("#btnSave").attr('disabled', false);

                        AgiCommonDialogBox.Alert("添加失败!");
                    }
                });
            }
            else {

                AgiCommonDialogBox.Alert("虚拟表已经存在!");
                return false;
            }
        });

    }
    else {
        Agi.VTManager.VTSave(vtAction, _VTName, NewVirtualTableDBName, vtCreatType, _strSQL, para, schema, data1, NewVirtualTableDBType, Strspecification, function (result) {
            if (result.result == "true") {
                AgiCommonDialogBox.Alert("修改成功!");
                boolIsSave = true;
            }
            else {

                AgiCommonDialogBox.Alert("修改失败!");
            }
        });
    }
});

//==========================存储过程虚拟表==============================//
//存储过程参数列表数组
var AllProParaKeyValue = [];
//新建存储过程虚拟表
function AddNewPROVirtualTable() {

    if (!dialogs._PROVTSelectDS.dialog('isOpen')) {
        dialogs._PROVTSelectDS.dialog('open');
    }
    GetDataSourceToVT("存储过程");
}
//上一步
$("#PROVirtualPre").live('click', function () {

    dialogs._PROVTSelectDS.dialog('close');
    if (!dialogs._SelectWayToCreateVT.dialog('isOpen')) {
        dialogs._SelectWayToCreateVT.dialog('open');
    }
});
//下一步
$("#PROVirtualOK").live('click', function () {
    var grid = $("#ProDataSourcegrid").data("kendoGrid");
    var list = grid.select().text();
    if (list == "") {
        AgiCommonDialogBox.Alert("请先选择数据源!");
        return false;
    }
    var data = list.split(" ");
    NewVirtualTableDBName = data[0];
    NewVirtualTableDBType = data[1];
    NewVirtualTableDBTypeDes = data[2];

    dialogs._PROVTSelectDS.dialog('close');
    ShowAllDSPro(NewVirtualTableDBName, NewVirtualTableDBType);
});
//取消
$("#PROCancelVirtualBtn").live('click', function () {
    dialogs._PROVTSelectDS.dialog('close');
});
//显示当前数据源下所有的存储过程
function ShowAllDSPro(_dataSourceName, _DBType) {
    if (!dialogs._PROVTSelectPRO.dialog('isOpen')) {
        dialogs._PROVTSelectPRO.dialog('open');
    }
    Agi.VTManager.SP_GetDatabaseProcedures(_dataSourceName, function (_result) {
        if (_result.result == "true") {
            var AllPROData = _result.data;
            var ProList = [];
            if (AllPROData != null) {
                for (var i = 0; i < AllPROData.length; i++) {
                    ProList.push({
                        proName: AllPROData[i]
                    });
                }
            }
            $("#ProListgrid").html("");
            $("#ProListgrid").kendoGrid({
                dataSource: {
                    //data: GetDataSourceToVT(),
                    data: ProList
                },
                height: 200,
                selectable: "single row",
                groupable: false,
                scrollable: true,
                sortable: true,
                filterable: true,
                columns: [
            {
                field: "proName",
                width: 80,
                title: "存储过程名称"
            }
        ]
            });

            NewVirtualTableDBName = _dataSourceName;
            NewVirtualTableDBType = _DBType;
        }
    });
}

//存储过程上一步
$("#PROListPre").live('click', function () {
    dialogs._PROVTSelectPRO.dialog('close');
    if (!dialogs._PROVTSelectDS.dialog('isOpen')) {
        dialogs._PROVTSelectDS.dialog('open');
    }
});

//存储过程下一步
$("#PROListOK").live('click', function () {
    var grid = $("#ProListgrid").data("kendoGrid");
    var list = grid.select().text();
    if (list == "") {
        AgiCommonDialogBox.Alert("请先选择存储过程!");
        return false;
    }
    var data = list.split(" ");
    dialogs._PROVTSelectPRO.dialog('close');
    ShowProVTPanel(NewVirtualTableDBName, NewVirtualTableDBType, data[0], "Insert");
    //查找所有的参数
    ProGetAllParaKeyValue(NewVirtualTableDBName, data[0]);
});
//存储过程取消
$("#PROListCancel").live('click', function () {
    dialogs._PROVTSelectPRO.dialog('close');
});
//显示存储过程新建面板
function ShowProVTPanel(DBName, DBType, ProName, Action) {
    ShowOperationData();
    booselect = false;
    _count = 20;
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='Detailquery' class='DetailqueryClass'>" +
        "<div class='OverT'" +
        "<div class='box'>" +
        "<div class='tagMenu' id='tagMenuID'><ul class='menu'><li>基本信息</li><li>字段列</li><li>预览</li></ul></div>" +
        "<div class='overTable'>" +
        "<div class='overTable' id='overTableID'>" +
        "<div class='content' id='conID'>" +
        "<div class='layout' id='divFrame'>" +
        "<div class='OutDiv'><div class='innerLeft'><label class='labelSty'>名称:</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='ProVTName'  maxlength='30' ischeck='true'/></div></div>" +
        "<div class='OutDiv'><div class='innerLeft'><label class='labelSty'>备注:</label></div><div class='innerRight'><textarea class='textareaSty ControlProTextSty' id='ProVTDescription'  maxlength='100' ischeck='true' style='resize:none;'></textarea></div></div>" +
        "<div class='OutDiv'><div class='innerLeft' id='innerLeftId'><label class='labelSty' id='labelleftID'>数据源信息:</label></div><div class='innerRight' id='DSNameDiv' dsName='" + DBName + "'>数据源名称:" + DBName + "<lable>&nbsp;&nbsp;&nbsp;&nbsp;</lable>" + "   数据源类型:" + DBType + "</div></div>" +
        "</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div><div>&nbsp;&nbsp;&nbsp;&nbsp;</div>" +
        "<div class='layout'><div class='textinput'></div><div id='gridProColumnView'></div></div>" +
        "<div class='layout'>" +
        "<div class='textinput' id='inputSQl'>存储过程</div><div><span style='margin-left:20px; font-size:20px; font-family:微软雅黑;' id='ProNameSpan'>" + ProName + "</span></div>" +
        "<div class='textinput' id='textinputS'>最大记录数<input type='number' id ='txtCount' class='cssTxtCount ControlProNumberSty' defaultvalue='20' value ='" + _count + "' min='0' max='1000' style='margin-left:20px;'/><input type='button' class='classSelect' id='ProVTSelect' value='生成语句并查询' /><input type='button' id='ProbtnSave' class='classSave' value='保存结果' action='" + Action + "' /></div>" +
        "<div id='gridProView' style='margin-top: 30px;'></div></div>" +
        "</div></div></div></div>");
    BingDetailQuery();
}

//生成语句并查询按钮点击
$("#ProVTSelect").live('click', function () {
    var _count = $("#txtCount").val();
    var _DSName = $("#DSNameDiv").attr("dsName");
    var _ProName = $("#ProNameSpan").text();
    $("#gridProColumnView").html("");
    $("#gridProView").html("");
    //判断有几个输入参数
    var InputP = [];
    for (var v = 0; v < AllProParaKeyValue.length; v++) {
        if (AllProParaKeyValue[v].inputoutput === "Input") {
            InputP.push({
                paraname: AllProParaKeyValue[v].argument_name,
                type: AllProParaKeyValue[v].data_type,
                inputoutput: AllProParaKeyValue[v].in_out,
                value: AllProParaKeyValue[v].value
            });
        }
    }

    if (InputP.length > 0) {
        if (!dialogs._ProKeyModal.dialog('isOpen')) {
            dialogs._ProKeyModal.dialog('open');
        }
        $("#ProsqlKeyValues").html("");
        var ParaList = "";
        for (var i = 0; i < AllProParaKeyValue.length; i++) {
            if (AllProParaKeyValue[i].inputoutput === "Input") {
                ParaList += "<option>" + AllProParaKeyValue[i].paraname + "</option>";
            }
        }
        //添加下拉框选项
        $(ParaList).appendTo("#ProsqlKeyValues");
        //默认选择第一个显示
        var countKey = 0;
        for (var j = 0; j < AllProParaKeyValue.length; j++) {
            if (AllProParaKeyValue[j].inputoutput === "Input") {
                $("#ProsqlkeyValue").val(AllProParaKeyValue[j].paraname);
                $("#ProsqlKeyType").val(AllProParaKeyValue[j].type.toUpperCase());
                $("#ProtxtKeyValue").val(AllProParaKeyValue[j].value);
                break;
            }
        }

        //给标签添加事件
        //给参数下拉菜单绑定点击事件
        $("#ProsqlKeyValues").change(function () {
            var currvalue = $(this).val();
            $("#ProsqlkeyValue").val(currvalue);

            for (var a = 0; a < AllProParaKeyValue.length; a++) {
                if (currvalue === AllProParaKeyValue[a].paraname && AllProParaKeyValue[a].inputoutput === "Input") {
                    $("#ProsqlKeyType").val(AllProParaKeyValue[a].type.toUpperCase());
                    $("#ProtxtKeyValue").val(AllProParaKeyValue[a].value);
                }
            }
        });

        //保存输入参数值
        $("#ProtxtKeyValue").mouseout(function () {
            for (var b = 0; b < AllProParaKeyValue.length; b++) {
                if ($("#ProsqlkeyValue").val() == AllProParaKeyValue[b].paraname && AllProParaKeyValue[b].inputoutput === "Input") {
                    AllProParaKeyValue[b].type = $("#ProsqlKeyType").val();
                    AllProParaKeyValue[b].value = $("#ProtxtKeyValue").val();
                }
            }
        });

        //保存输入参数类型
        $("#ProsqlKeyType").mouseout(function () {
            for (var c = 0; c < AllProParaKeyValue.length; c++) {
                if ($("#ProsqlkeyValue").val() == AllProParaKeyValue[c].paraname && AllProParaKeyValue[c].inputoutput === "Input") {
                    AllProParaKeyValue[c].type = $("#ProsqlKeyType").val();
                    AllProParaKeyValue[c].value = $("#ProtxtKeyValue").val();
                }
            }
        });
    } else {
        booselect = true;
        $('#progressbar1').show().find('.close').click(function (e) {
            $('#progressbar1').hide().html('<div class="progressBar">' +
            '<button style="position: absolute;left: 186px;top: -4px;" type="button" class="close" data-dismiss="alert">×</button>' +
            '<div class="progress progress-striped active borderFlash">' +
            '<div class="bar" style="width: 100%;"></div>' +
            '</div>' +
            '<span>正在载入...</span>' +
            '</div>');
        });

        Agi.VTManager.SP_QueryProcedureData(_DSName, _ProName, AllProParaKeyValue, _count, function (_result) {
            if (_result.result == "true") {
                var AllData = _result.data;
                if (AllData.length > 0) {
                    var VTColumns = [];
                    var Columns = [];
                    for (var k in AllData[0]) {
                        Columns.push({
                            field: k,
                            width: 90,
                            title: k
                        });
                        var _TName = k;
                        _DType = "NVARCHAR2";
                        VTColumns.push(
                    {
                        TName: _TName + " ",
                        DType: _DType + " "
                    }
                 );
                    }
                    BindProVTColumns(VTColumns);
                    BindProVTData(AllData, Columns);
                    $('#progressbar1').hide();
                }
                else {
                    $('#progressbar1').hide();
                    AgiCommonDialogBox.Alert("无查询数据！");
                    return;
                }
            }
            else {
                $('#progressbar1').hide();
                AgiCommonDialogBox.Alert(_result.message);
                return;
            }
        });
    }
});

$("#ProbtnSqlSelect").live('click', function () {
    //先保存一下参数，然后再查询
    for (var d = 0; d < AllProParaKeyValue.length; d++) {
        if ($("#ProsqlkeyValue").val() == AllProParaKeyValue[d].paraname && AllProParaKeyValue[d].inputoutput === "Input") {
            AllProParaKeyValue[d].type = $("#ProsqlKeyType").val();
            AllProParaKeyValue[d].value = $("#ProtxtKeyValue").val();
        }
    }

    var _count = $("#txtCount").val();
    var _DSName = $("#DSNameDiv").attr("dsName");
    var _ProName = $("#ProNameSpan").text();
    var _Paras = AllProParaKeyValue;

    $('#progressbar1').show().find('.close').click(function (e) {
        $('#progressbar1').hide().html('<div class="progressBar">' +
            '<button style="position: absolute;left: 186px;top: -4px;" type="button" class="close" data-dismiss="alert">×</button>' +
            '<div class="progress progress-striped active borderFlash">' +
            '<div class="bar" style="width: 100%;"></div>' +
            '</div>' +
            '<span>正在载入...</span>' +
            '</div>');
    });
    Agi.VTManager.SP_QueryProcedureData(_DSName, _ProName, _Paras, _count, function (_result) {
        if (_result.result === "true") {
            var AllData = _result.data;
            if (AllData.length > 0) {
                var VTColumns = [];
                var Columns = [];
                for (var k in AllData[0]) {
                    Columns.push({
                        field: k,
                        width: 90,
                        title: k
                    });
                    var _TName = k;
                    _DType = "NVARCHAR2";
                    VTColumns.push(
                    {
                        TName: _TName + " ",
                        DType: _DType + " "
                    }
                 );
                }
                BindProVTColumns(VTColumns);
                BindProVTData(AllData, Columns);
                $('#progressbar1').hide();
            }
            else {
                $('#progressbar1').hide();
                AgiCommonDialogBox.Alert("无查询数据！");
                return;
            }
        } else {
            $('#progressbar1').hide();
            AgiCommonDialogBox.Alert(_result.message);
            return;
        }
    });
    booselect = true;
});

//保存结果按钮点击
$("#ProbtnSave").live('click', function () {
    if (booselect == false) {

        AgiCommonDialogBox.Alert("请先执行[生成语句并查询],如查询语句带有参数,必须为参数填写默认值!");
        return;
    }
    booselect = false;
    var DSName = $("#DSNameDiv").attr("dsName");
    var ProName = $("#ProNameSpan").text();
    var ProVTName = $("#ProVTName").val();
    if (ProVTName.trim() === "") {
        AgiCommonDialogBox.Alert("请输入虚拟表名称!");
        return;
    }
    var Specification = $("#ProVTDescription").val();

    var AllColumns = [];
    var ColumnsData = $("#gridProColumnView").data("kendoGrid").dataSource.data();
    if (ColumnsData.length > 0) {
        for (var e = 0; e < ColumnsData.length; e++) {
            AllColumns.push(ColumnsData[e].TName.trim());
        }
    }
    var Paras = [];

    if (AllProParaKeyValue.length > 0) {
        for (var i = 0; i < AllProParaKeyValue.length; i++) {
            Paras.push({
                parasname: AllProParaKeyValue[i].paraname,
                type: AllProParaKeyValue[i].type,
                direction: AllProParaKeyValue[i].inputoutput,
                defaultvalue: AllProParaKeyValue[i].value
            });
        }
    }


    var Action = $(this).attr("action");

    Agi.VTManager.SP_OperationSpMethodInfo(Action, DSName, ProVTName, Specification, ProName, Paras, AllColumns, function (_result) {
        if (_result.result === "true") {
            Agi.VTManager.SP_GetSptable(DSName, function (_result) {
                BindProVT(_result);
                $("#btnSave").attr('disabled', true);
                AgiCommonDialogBox.Alert("保存成功!");
            });
        } else {
            AgiCommonDialogBox.Alert(_result.message);
            return;
        }
    });

});

//获取所有的参数
function ProGetAllParaKeyValue(_DSName, _ProName) {
    AllProParaKeyValue = [];
    Agi.VTManager.SP_GetProcedureParams(_DSName, _ProName, function (_result) {
        if (_result.result == "true") {
            var AllPara = _result.data;
            if (AllPara.length > 0) {
                for (var i = 0; i < AllPara.length; i++) {
                    AllProParaKeyValue.push({
                        paraname: AllPara[i].argument_name,
                        type: AllPara[i].data_type,
                        inputoutput: AllPara[i].in_out,
                        value: ""
                    });
                }
            }
        }
    });
}

//绑定所有列
function BindProVTColumns(VTColumns) {
    $("#gridProColumnView").html("");
    $("#gridProColumnView").kendoGrid({
        dataSource: {
            data: VTColumns,
            pageSize: 6
        },
        height: 260,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        columns: [
            {
                field: "TName",
                width: 90,
                title: "列名"
            }
        ]
    }); //20121225 15:51 倪飘 修改虚拟表列信息显示问题
}
//绑定虚拟表查询数据
function BindProVTData(detailData, columns) {
    $("#gridProView").html("");
    $("#gridProView").kendoGrid({
        dataSource: {
            data: detailData
        },
        height: 260,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: false,
        columns: columns
    });
}

//编辑存储过程虚拟表
function EditProVirtualTablePage(_DsName, _ProVTName) {
    Agi.DCManager.DCGetConnDByID(_DsName, function (result) {
        if (result.result == "true") {
            var DsName = result.dataSourceName;
            var DsType = result.dataBaseType;
            Agi.VTManager.SP_GetTableDetails(_DsName, _ProVTName, function (_result) {
                if (_result.result === "true") {
                    var ProData = _result.info.SingleEntityInfo;
                    var ProPara = _result.info.SingleEntityInfo.SpDefined.Para;
                    ShowProVTPanel(DsName, DsType, ProData.SpDefined.ID, "Update");
                    this.vtAction = "update";
                    $("#ProVTName").val(ProData.ID);
                    $("#ProVTName").attr('readonly', true);
                    $("#ProVTDescription").val(ProData.Specification);

                    //参数列表
                    AllProParaKeyValue = [];
                    if (ProPara != undefined) {
                        //20130715 倪飘 解决bug，编辑Oracle存储过程虚拟表（带参数），点击生成语句并查询，提示"给定关键字不在字典中"
                        if (!isArray(ProPara)) {
                            AllProParaKeyValue.push({
                                paraname: ProPara.ID,
                                type: ProPara.Type,
                                inputoutput: ProPara.Direction,
                                value: ProPara.Default
                            });
                        } else {
                            if (ProPara.length > 0) {
                                for (var i = 0; i < ProPara.length; i++) {
                                    AllProParaKeyValue.push({
                                        paraname: ProPara[i].ID,
                                        type: ProPara[i].Type,
                                        inputoutput: ProPara[i].Direction,
                                        value: ProPara[i].Default
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
    });
}
//==========================存储过程虚拟表==============================//
//----------------------------------------------------------------------------------------------------------
//混合虚拟表的数据源名称
var NewScVirtualTableDBName;
//混合虚拟表数据源的类型
var NewScVirtualTableDBType;
//判断是添加还是修改混合实体
var IsAddOrUpdateVT = "add";
//选择的实体列表
var SelectedSCVirtualTable = []; //methodInfo
var Relation = []; //Relation
var PData = []; //父实体对应数据列信息
var CData = []; //子实体对应数据列信息
var SCRelationState = "Add";
var SCRowIndex = 0;
var SchemaColumns = []; //列信息
//定义变量存储所有数据源
var AllNeedDataSource = [];
//定义变量保存所有参数列的名字和值
var AllParamsNameAndValue = [];
//列信息
//var SchemaColumns = [];
//判断是否点击了生成语句并查询按钮
var IsDialogSelected = false;

//判断是否点击了建立关系按钮
var IsBulidRelationship = false;

//新建混合虚拟表
function AddNewSCVirtualTable() {
    ShowMainFramePage();
    //    $("#ScVTSelectDS").modal({ backdrop:false, keyboard:false, show:true });
    ////    $('#ScVTSelectDS').draggable({
    ////        handle: ".modal-header"
    ////    });
    //    $('#ScVTSelectDS').draggable("disable");
    if (!dialogs._ScVTSelectDS.dialog('isOpen')) {
        dialogs._ScVTSelectDS.dialog('open');
    }
    GetDataSourceToVT("混合");

}
//选择数据源下一步
$("#ScDsNextBtn").live('click', function () {
    var grid = $("#ScDataSourcegrid").data("kendoGrid");
    var list = grid.select().text();
    if (list == "") {

        AgiCommonDialogBox.Alert("请先选择数据源!");
        return false;
    }
    var data = list.split(" ");
    NewScVirtualTableDBName = data[0];
    NewScVirtualTableDBType = data[1];
    //    $("#ScVTSelectDS").modal('hide');
    dialogs._ScVTSelectDS.dialog('close');
    //加载选择实体的弹出窗口
    SelectAllVT(NewScVirtualTableDBName, NewScVirtualTableDBType);
    /*释放临时变量*/
    grid = list = null;
});
//选择数据源取消
$("#ScDsCancelBtn").live('click', function () {
    $("#ScVTSelectDS").modal('hide');
    dialogs._ScVTSelectDS.dialog('close');
    boolIsSave = true;
    ShowMainFramePage();
});

//加载选择实体的弹出窗口
function SelectAllVT(dsname, dstype) {
    //    $("#ScVTSelectVT").modal({ backdrop:false, keyboard:false, show:true });
    ////    $('#ScVTSelectVT').draggable({
    ////        handle: ".modal-header"
    ////    });
    //    $('#ScVTSelectVT').draggable("disable");
    if (!dialogs._ScVTSelectVT.dialog('isOpen')) {
        dialogs._ScVTSelectVT.dialog('open');
    }
    NewScVirtualTableDBName = dsname;
    NewScVirtualTableDBType = dstype;
    AddAllVTInfo("ScVTSourcegrid", NewScVirtualTableDBName);
}

//选择实体上一步
$("#ScVTPreBtn").live('click', function () {
    $("#ScVTSelectVT").modal('hide');
    dialogs._ScVTSelectVT.dialog('close');
    AddNewSCVirtualTable();
});
//选择实体下一步
$("#ScVTNextBtn").live('click', function () {
    SelectedSCVirtualTable = [];
    var count = 0;
    var ThisScVTSelectVTtrs = $("#ScVTSelectVT").find("tbody>tr");
    var ThisScVTSelectVTtrTd = null;
    for (var i = 0; i < ThisScVTSelectVTtrs.length; i++) {
        ThisScVTSelectVTtrTd = $(ThisScVTSelectVTtrs[i]).find("td");
        var _columdsName = ThisScVTSelectVTtrTd[1].innerText; //数据源名称
        var _columvtName = ThisScVTSelectVTtrTd[2].innerText; //实体名称
        var isCkeck = $(ThisScVTSelectVTtrs[i]).find("#isSelectd").attr("checked") == "checked" ? "true" : "false"; //是否添加
        //checkBox为选中状态时点位信息添加到数组中
        if (isCkeck == "true") {
            SelectedSCVirtualTable.push({
                _GuidName: "DD" + count,
                _DataSource: _columdsName,
                _DSVT: _columvtName,
                _Function: "Default"
            });
            count++;
        }
    }
    ThisScVTSelectVTtrs = ThisScVTSelectVTtrTd = null; //DOM查询优化,临时变量清空

    if (SelectedSCVirtualTable.length > 0) {
        ///        alert(SelectedSCVirtualTable.length);
        $("#ScVTSelectVT").modal('hide');
        dialogs._ScVTSelectVT.dialog('close');
        //实例化操作页面
        AddNewVirtualTablePage();
        IsAddOrUpdateVT = "add";
        $("#SCDSNAME").html(NewScVirtualTableDBName);
        $("#SCDSTYPE").html(NewScVirtualTableDBType);

        //绑定实体Grid数据
        AllSCGrid.SCEntityGrid(SelectedSCVirtualTable);
        //绑定数据结构Grid数据
        AllSCGrid.DStructureGrid(SelectedSCVirtualTable);

        //        var entityinfos = [];
        //        SchemaColumns = [];
        //        for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
        //            entityinfos.push(
        //            {
        //                dataSourceName: SelectedSCVirtualTable[i]["_DataSource"],
        //                entityName: SelectedSCVirtualTable[i]["_DSVT"]
        //            }
        //            );
        //        }
        //        var jsonData = { "entityinfos": entityinfos };
        //        var jsonString = JSON.stringify(jsonData);
        //        Agi.DAL.ReadData({ "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
        //            if (_result.result == "true") {
        //                var SchemaData = _result.data;

        //                for (var i = 0; i < SchemaData.length; i++) {
        //                    var schema = SchemaData[i]["schema"];
        //                    for (var j = 0; j < schema.length; j++) {
        //                        SchemaColumns.push(
        //                            {
        //                                GuidName: SelectedSCVirtualTable[i]["_GuidName"],
        //                                ColumnName: schema[j],
        //                                NewName: schema[j],
        //                                Type: ""
        //                            }
        //                        );
        //                    }
        //                }
        //                //绑定实体列信息
        //                AllSCGrid.FieldColumnGrid(SchemaColumns);
        //            }
        //        }
        //    });

    } else {

        AgiCommonDialogBox.Alert("请选择相关虚拟表！");
        return false;
    }
});
//选择实体取消
$("#ScVTCancelBtn").live('click', function () {
    //    $("#ScVTSelectVT").modal('hide');
    dialogs._ScVTSelectVT.dialog('close');
    boolIsSave = true;
    ShowMainFramePage();
});


/*控制混合虚拟表的tab==================================================================*/
//点击第1个Tab
$("#SCTabBottomOne").live('click', function () {
    $("#SCTabTopThree").hide();
    $("#SCTabTopTwo").hide();
    $("#SCTabTopFour").hide();
    $("#SCTabTopOne").show();
    $("#SCTabBottomOne").css("background-color", "#fff");
    $("#SCTabBottomOne").css("background-image", "none");
    $("#SCTabBottomTwo").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomThree").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomFour").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");

});
//点击第2个Tab
$("#SCTabBottomTwo").live('click', function () {
    $("#SCTabTopThree").hide();
    $("#SCTabTopOne").hide();
    $("#SCTabTopFour").hide();
    $("#SCTabTopTwo").show();
    $("#SCTabBottomTwo").css("background-color", "#fff");
    $("#SCTabBottomTwo").css("background-image", "none");
    $("#SCTabBottomOne").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomThree").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomFour").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
});
//点击第3个Tab
$("#SCTabBottomThree").live('click', function () {
    $("#SCTabTopOne").hide();
    $("#SCTabTopTwo").hide();
    $("#SCTabTopFour").hide();
    $("#SCTabTopThree").show();
    $("#SCTabBottomThree").css("background-color", "#fff");
    $("#SCTabBottomThree").css("background-image", "none");
    $("#SCTabBottomTwo").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomOne").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomFour").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
});
//点击第4个Tab
$("#SCTabBottomFour").live('click', function () {
    $("#SCTabTopOne").hide();
    $("#SCTabTopTwo").hide();
    $("#SCTabTopThree").hide();
    $("#SCTabTopFour").show();
    $("#SCTabBottomFour").css("background-color", "#fff");
    $("#SCTabBottomFour").css("background-image", "none");
    $("#SCTabBottomTwo").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomOne").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
    $("#SCTabBottomThree").css("background-image", "-webkit-gradient(linear,left bottom,left top,color-stop(0, rgb(165,169,182)),color-stop(0.53, rgb(223,225,230)),color-stop(0.98, rgb(244,245,247)),color-stop(1, rgb(0,0,0)))");
});
//默认打开第一个tab
function ShowSCOneTab() {
    $("#SCTabTopTwo").hide();
    $("#SCTabTopThree").hide();
    $("#SCTabTopFour").hide();
    $("#SCTabBottomOne").css("background-color", "#fff");
    $("#SCTabBottomOne").css("background-image", "none");
}

/*控制混合虚拟表的tab  结束==================================================================*/

/*混合虚拟表操作页面==================================================================*/
function AddNewVirtualTablePage() {
    Relation = [];
    ShowOperationData();
    SCRelationState = "Add";
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='SCVTTab'><div id='SCVTTabTopAll'>" +
        "<div id='SCTabTopOne'><div class='newdatastitle'>基本信息</div>" +
        "<div class='one_div'>名称：<div style=' margin-left:50px;'><input type='text'  id='SCVTName' class='ControlProTextSty' maxlength='30' ischeck='true'/></div></div>" +
        "<div class='one_div'>备注：<div style=' margin-left:50px;'><textarea id='SCVTDESC' style=' height:50px; width:200px; resize:none;' class='ControlProTextSty' maxlength='100' ischeck='true'></textarea></div></div>" +
        "<div class='one_div'>数据源信息：<div style=' margin-left:8px;'><div>数据源名称：<span id='SCDSNAME'></span></div><div>数据源类型：<span id='SCDSTYPE'></span></div></div></div></div>" +
        "<div id='SCTabTopTwo'><div class='newdatastitle' style=' margin-bottom:10px;'>数据源</div>" +
        "<div class='DStructure'> 数据结构<div><input type='button' value='添加数据结构' id='AddDStructure'  class='NextVirtualBtn'/></div><div id='SCDatastructureGrid'></div></div>" +
        "<div class='BRelationships'>数据关系<div><input type='button' value='建立关系' id='AddBRelationships' class='NextVirtualBtn'/></div><div id='BuildrelationshipsGrid'></div></div></div>" +
        "<div id='SCTabTopThree'><div class='newdatastitle'>字段列</div><div></div><div id='FieldcolumnGrid'> </div></div>" +
        "<div id='SCTabTopFour'><div class='newdatastitle' style=' margin-bottom:10px;'>预览</div><div>实体<div class='SCEntityGrid'  id='SCEntityGrid'></div></div>" +
        "<div style='margin-top:5px;'> 实体关系<div id='EntityRelationshipGrid'></div></div><div style='margin-top:5px;'>SQL 查询" +
        "<div><input type='button'  value='生成语句并查询' id='DialogSelected' class='NextVirtualBtn'/>最大记录数<input type='number' value='20' id='maxRecordBtn' class='ControlProNumberSty' defaultvalue='20' min='0' max='1000' style=' width:100px; margin-left:5px; margin-right:100px;' /><input type='button'  value='保存' id='SCVTSave' class='NextVirtualBtn'/>" +
        "</div><div id='QueryresultsGrid'></div></div></div></div>" +
        "<div id='SCVTTabBottomAll'><div id='SCTabBottomOne'>基本信息</div><div id='SCTabBottomTwo'>数据源</div>" +
        "<div id='SCTabBottomThree'>字段列</div><div id='SCTabBottomFour'>预览</div></div></div>");
    //默认显示第一个tab页
    ShowSCOneTab();
}
//建立数据结构按钮
$("#AddDStructure").live('click', function () {
    $("#DataStructure").modal({ backdrop: false, keyboard: false, show: true });
    $('#DataStructure').draggable({
        handle: ".modal-header"
    });
    AddAllVTInfo("DataStructureGrid", NewScVirtualTableDBName);

});
//建立数据结构确定
$("#DataStructureOKBtn").live('click', function () {
    var TempSCDatastructureGridtrs = $("#SCDatastructureGrid").find("tbody>tr");
    var count = TempSCDatastructureGridtrs.length;
    var index
    if (count == 0) {
        index = 0;
    }
    else {
        index = $(TempSCDatastructureGridtrs[count - 1]).find("td")[0].innerText;
        index = parseInt(index.substr(2)) + 1;
    }
    TempSCDatastructureGridtrs = null; //DOM查询优化,临时变量清空

    //获取列信息
    SchemaColumns = [];
    var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
    var ThisFieldcolumnGridtrtdtemp = null;
    for (var g = 0; g < ThisFieldcolumnGridtrs.length; g++) {
        ThisFieldcolumnGridtrtdtemp = $(ThisFieldcolumnGridtrs[g]).find("td");
        SchemaColumns.push(
            {
                GuidName: ThisFieldcolumnGridtrtdtemp[0].innerText,
                ColumnName: ThisFieldcolumnGridtrtdtemp[1].innerText,
                NewName: ThisFieldcolumnGridtrtdtemp[2].innerText,
                Type: ""
            }
        );
    }
    ThisFieldcolumnGridtrs = ThisFieldcolumnGridtrtdtemp = null; //DOM查询优化,临时变量清空

    var sum = 0;
    //记录选中的虚拟表
    var AddVTableInfo = [];
    var ThisDataStructureGridtrs = $("#DataStructureGrid").find("tbody>tr");
    var ThisDataStructureGridtrtdtemp = null;
    for (var i = 0; i < ThisDataStructureGridtrs.length; i++) {
        ThisDataStructureGridtrtdtemp = $(ThisDataStructureGridtrs[i]).find("td");
        var _columdsName = ThisDataStructureGridtrtdtemp[1].innerText; //数据源名称
        var _columvtName = ThisDataStructureGridtrtdtemp[2].innerText; //实体名称
        var isCkeck = $(ThisDataStructureGridtrs[i]).find("#isSelectd").attr("checked") == "checked" ? "true" : "false"; //是否添加
        //checkBox为选中状态时点位信息添加到数组中
        if (isCkeck == "true") {
            SelectedSCVirtualTable.push({
                _GuidName: "DD" + index,
                _DataSource: _columdsName,
                _DSVT: _columvtName,
                _Function: "Default"
            });
            AddVTableInfo.push({
                _GuidName: "DD" + index,
                _DataSource: _columdsName,
                _DSVT: _columvtName,
                _Function: "Default"
            });
            index++;
            sum++;
        }
    }
    ThisDataStructureGridtrs = ThisDataStructureGridtrtdtemp = null; //DOM查询优化,临时变量清空

    if (sum > 0) {
        $("#DataStructure").modal('hide');
        //绑定实体Grid数据
        AllSCGrid.SCEntityGrid(SelectedSCVirtualTable);
        //绑定数据结构Grid数据
        AllSCGrid.DStructureGrid(SelectedSCVirtualTable);
    } else {

        AgiCommonDialogBox.Alert("请选择相关虚拟表！");
        return false;
    }

});
//建立数据结构取消
$("#DataStructureCancelBtn").live('click', function () {
    $("#DataStructure").modal('hide');
});
//数据结构删除
$("#DeleteDStructure").live('click', function () {
    var ThisSCDatastructureGridKendotd = $("#SCDatastructureGrid").data("kendoGrid").select().find("td");
    var Guidname = ThisSCDatastructureGridKendotd[0].innerText;
    var _columndsName = ThisSCDatastructureGridKendotd[1].innerText;
    var _columnvtName = ThisSCDatastructureGridKendotd[2].innerText;

    var content = "删除数据结构将删除对应的关系，确定删除数据结构?";
    AgiCommonDialogBox.Confirm(content, null, function (result) {

        if (result) {

            var _gridTwo = $("#SCEntityGrid").data("kendoGrid");
            for (var k = 0; k < $("#SCEntityGrid").find("tbody>tr").length; k++) {
                var _ColumndsName2 = $($("#SCEntityGrid").find("tbody>tr")[k]).find("td")[0].innerText;
                var _ColumnvtName2 = $($("#SCEntityGrid").find("tbody>tr")[k]).find("td")[1].innerText;
                if (_ColumndsName2 == _columndsName && _ColumnvtName2 == _columnvtName) {
                    $($("#SCEntityGrid").data("kendoGrid").tbody.find("tr")[k]).remove();
                    break;
                }
            }
            $("#SCDatastructureGrid").data("kendoGrid").select().remove();
            for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
                if (SelectedSCVirtualTable[i]._GuidName == Guidname) {
                    SelectedSCVirtualTable.splice(i, 1);
                }
            }

            //更新关系表格
            for (var h = Relation.length - 1; h >= 0; h--) {
                if (Relation[h].PGuidName == Guidname || Relation[h].CGuidName == Guidname) {
                    Relation.splice(h, 1);
                }
            }

            //更新关系表格
            AllSCGrid.DRelationshipGrid(Relation);
            AllSCGrid.SCEntityRelationshipGrid(Relation);


            //更新列信息表格
            var entityinfos = [];
            var AllRGuid = [];
            SchemaColumns = [];
            for (var i = 0; i < Relation.length; i++) {
                AllRGuid.push(Relation[i].PGuidName, Relation[i].CGuidName);
            }
            //不重复的关系表
            AllRGuid = unique(AllRGuid);

            for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
                for (var j = 0; j < AllRGuid.length; j++) {
                    if (AllRGuid[j] == SelectedSCVirtualTable[i]._GuidName) {
                        entityinfos.push(
                            {
                                dataSourceName: SelectedSCVirtualTable[i]["_DataSource"],
                                entityName: SelectedSCVirtualTable[i]["_DSVT"]
                            }
                        );
                    }
                }
            }
            var jsonData = { "entityinfos": entityinfos };
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({
                "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result.result == "true") {
                        var SchemaData = _result.data;

                        for (var i = 0; i < SchemaData.length; i++) {
                            var schema = SchemaData[i]["schema"];
                            for (var j = 0; j < schema.length; j++) {
                                SchemaColumns.push(
                                    {
                                        GuidName: AllRGuid[i],
                                        ColumnName: schema[j],
                                        NewName: schema[j],
                                        Type: ""
                                    });
                            }
                        }
                        //记录下当前显示的字段列
                        var CurrShowColumn = [];
                        var ThisFieldcolumnGridtbodytrs = $("#FieldcolumnGrid").find("tbody>tr");
                        var ThisFieldcolumnGridtbodytrtdtemp = null;
                        for (var g = 0; g < ThisFieldcolumnGridtbodytrs.length; g++) {
                            ThisFieldcolumnGridtbodytrtdtemp = $(ThisFieldcolumnGridtbodytrs[g]).find("td");
                            CurrShowColumn.push(
                                {
                                    GuidName: ThisFieldcolumnGridtbodytrtdtemp[0].innerText,
                                    ColumnName: ThisFieldcolumnGridtbodytrtdtemp[1].innerText,
                                    NewName: ThisFieldcolumnGridtbodytrtdtemp[2].innerText,
                                    Type: ""
                                }
                            );
                        }
                        //ThisFieldcolumnGridtbodytrs=ThisFieldcolumnGridtbodytrtdtemp=null;//DOM查询优化,临时变量清空

                        //循环保存已经修改的但是不需要删除的字段列
                        for (var i = 0; i < CurrShowColumn.length; i++) {
                            for (var j = 0; j < SchemaColumns.length; j++) {
                                if (SchemaColumns[j].GuidName == CurrShowColumn[i].GuidName && SchemaColumns[j].ColumnName == CurrShowColumn[i].ColumnName) {
                                    SchemaColumns[j].NewName = CurrShowColumn[i].NewName;
                                }
                            }
                        }

                        //绑定实体列信息
                        AllSCGrid.FieldColumnGrid(SchemaColumns);
                    }
                }
            });


            //更新列信息表格
            //获取列信息
            //        SchemaColumns = [];
            //        for (var g = 0; g < $("#FieldcolumnGrid").find("tbody>tr").length; g++) {
            //            SchemaColumns.push(
            //                            {
            //                                GuidName: $($("#FieldcolumnGrid").find("tbody>tr")[g]).find("td")[0].innerText,
            //                                ColumnName: $($("#FieldcolumnGrid").find("tbody>tr")[g]).find("td")[1].innerText,
            //                                NewName: $($("#FieldcolumnGrid").find("tbody>tr")[g]).find("td")[2].innerText,
            //                                Type: ""
            //                            }
            //                            );
            //        }
            //        for (var i =  SchemaColumns.length-1; i >=0; i--) {
            //            if (SchemaColumns[i].GuidName == Guidname) {
            //                SchemaColumns.splice(i, 1);
            //            }
            //        }
            //        //绑定实体列信息
            //        AllSCGrid.FieldColumnGrid(SchemaColumns);
        }
    });
});
//建立关系按钮
$("#AddBRelationships").live('click', function () {
    //1.移除父表下拉选项 子表下拉选项 引用关系下拉选项 关系名称
    $("#SCEntityNameList1 option").remove();
    $("#SCEntityNameList2 option").remove();
    $("#SCEntityRelation option").remove();
    $(".SCRelation").remove();
    $("#SCRelationName ").val("");
    //清空父表实体列集合 子表实体列集合
    PData = [];
    CData = [];
    //当前操作状态添加
    SCRelationState = "Add";
    //重新加载父虚拟表下拉选项 子虚拟表下拉选项
    var EntityNameList = "<option value=''>NONE</option>";
    for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
        EntityNameList += "<option dataSouce='" + SelectedSCVirtualTable[i]["_DataSource"] + "' GuidName='" + SelectedSCVirtualTable[i]["_GuidName"] + "'  value='" + SelectedSCVirtualTable[i]["_DSVT"] + "'>" + SelectedSCVirtualTable[i]["_DSVT"] + "</option>";
    }
    if (EntityNameList != null) {
        $("#SCEntityNameList1").append(EntityNameList);
        $("#SCEntityNameList2").append(EntityNameList);
    }
    //重新加载引用关系
    var SCEntityRelation = "<option value=''>NONE</option>" +
        "<option value='inner join'>inner join</option>" +
        "<option value='left join'>left join</option>" +
        "<option value='right join'>right join</option>" +
        "<option value='full join'>full join</option>";
    $("#SCEntityRelation").append(SCEntityRelation);
    $("#DataRelationship").modal({ backdrop: false, keyboard: false, show: true });
    $('#DataRelationship').draggable({
        handle: ".modal-header"
    });
    $("#RelationsTitleName").html("添 加 数 据 关 系");
    //通过父表名称和数据源获取当前实体列结合
    $('#SCEntityNameList1').change(function () {
        //1.获取当前父数据源名称父实体名称
        var PDataSouce = $(this).find("option:selected").attr("dataSouce");
        var PTable = $(this).val();
        //2.获取子数据源名称子虚拟表名称
        var CDataSouce = $("#SCEntityNameList2").find("option:selected").attr("dataSouce");
        var CTable = $("#SCEntityNameList2").val();
        if (CTable == PTable && CDataSouce == PDataSouce) {
            $('#SCEntityNameList1').val("");

            AgiCommonDialogBox.Alert("请选择不同的父表和子表");
            return false;
        }
        else {
            //1.清空关系表
            $(".SCRelation").remove();
            //3.获取当前父实体下所有列信息
            var jsonData = { "entityinfos": [
                { "dataSourceName": PDataSouce, "entityName": PTable }
            ]
            };
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({
                "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result.result == "true") {
                        PData = _result.data;
                    }
                }
            });
        }
    });
    //通过子名称和数据源获取当前实体列结合
    $('#SCEntityNameList2').change(function () {
        //1.获取父数据源名称父虚拟表名称
        var PDataSouce = $("#SCEntityNameList1").find("option:selected").attr("dataSouce");
        var PTable = $("#SCEntityNameList1").val();
        //2.获取子数据源名称子虚拟表名称
        var CDataSouce = $(this).find("option:selected").attr("dataSouce");
        var CTable = $(this).val();
        if (CTable == PTable && CDataSouce == PDataSouce) {
            $('#SCEntityNameList2').val("");

            AgiCommonDialogBox.Alert("请选择不同的父表和子表");
            return false;
        }
        else {
            //1.清空关系表
            $(".SCRelation").remove();
            //2.获取当前子实体下所有列信息
            var jsonData = { "entityinfos": [
                { "dataSourceName": CDataSouce, "entityName": CTable }
            ]
            };
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({
                "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result.result == "true") {
                        CData = _result.data;
                    }
                }
            });
        }
    });
});
//添加关系
$("#AddRelation").live("click", function () {
    //20121226 21:59 markeluo 添加关系时判断是是否已选择父表、子表
    var ParentSelValue = $("#SCEntityNameList1").find("option:selected").attr("GuidName");
    var ChildSelValue = $("#SCEntityNameList2").find("option:selected").attr("GuidName");
    if (ParentSelValue == null) {

        AgiCommonDialogBox.Alert("请选择父表后再建立关系！");
        return;
    }
    if (ChildSelValue == null) {

        AgiCommonDialogBox.Alert("请选择子表后再建立关系！");
        return;
    }
    //20121226 22:05 markeluo 添加关系时判断关系名称是否输入
    if ($("#SCRelationName").val() == "" || $("#SCRelationName").val().replace(" ", "") == "") {

        AgiCommonDialogBox.Alert("关系名称不能为空！");
        return;
    }
    //1.把列信息取出来
    //2.把列信息加载出来
    var PColumnStr = '<option value=""></option>';
    var CColumnStr = '<option value=""></option>';
    var PColumnList = null, CColumnList = null;
    if (PData.length > 0) {
        PColumnList = PData[0]["schema"];
        for (var i = 0; i < PColumnList.length; i++) {
            PColumnStr += "<option value=" + PColumnList[i] + ">" + PColumnList[i] + "</option>";
        }
    }
    if (CData.length) {
        CColumnList = CData[0]["schema"];
        for (var i = 0; i < CColumnList.length; i++) {
            CColumnStr += "<option value=" + CColumnList[i] + ">" + CColumnList[i] + "</option>";
        }
    }
    //1.把行添加出来
    var strHTML = '<tr class="SCRelation"><td><select id="PColumn">' + PColumnStr + '</select></td><td><select id="CColumn">' + CColumnStr + '</select></td><td><input type="button" value="删除" id="DeleteRelationBtn"></td></tr>';
    var SCRelationLen = $(".SCRelation").length;
    $("#SCRelationTable tr:eq(" + SCRelationLen + ")").after(strHTML);
    $('#CColumn').change(function () {
    });
});
//删除关系
$("#DeleteRelationBtn").live('click', function () {
    var CurrRow = this.parentElement.parentElement;
    var root = CurrRow.parentNode;
    root.removeChild(CurrRow);

    /*释放临时变量*/
    CurrRow = root = null;
});

//建立关系确定
$("#RDOK").live('click', function () {
    //20130114 倪飘 解决新建混合虚拟表，添加关系以后删除关系名称，点击"确定"关系能够建立成功问题
    if ($("#SCRelationName").val() == "" || $("#SCRelationName").val().replace(" ", "") == "") {

        AgiCommonDialogBox.Alert("关系名称不能为空！");
        return;
    }
    //获取父表别名 子表别名 父虚拟表名称 子虚拟表名称 连接类型 关系名称
    var PGuidName = $("#SCEntityNameList1").find("option:selected").attr("GuidName");
    var CGuidName = $("#SCEntityNameList2").find("option:selected").attr("GuidName");
    var PTable = $("#SCEntityNameList1").val();
    var CTable = $("#SCEntityNameList2").val();
    var JoinType = $("#SCEntityRelation").val();
    var Name = $("#SCRelationName").val();
    //判断条件
    if (PTable == "") {

        AgiCommonDialogBox.Alert("请选择父表");
        return false;
    }
    if (CTable == "") {

        AgiCommonDialogBox.Alert("请选择子表");
        return false;
    }
    if (JoinType == "") {

        AgiCommonDialogBox.Alert("请选择引用关系");
        return false;
    }
    //获取所有配置关系列
    var SCRelation = $(".SCRelation >td").parent();
    //
    var RelationColumns = [];
    //判断关系列，如果没有需要配置
    if (SCRelation.length > 0) {
        for (var i = 0; i < SCRelation.length; i++) {
            var PColumn = $(SCRelation[i]).find("#PColumn").val();
            var CColumn = $(SCRelation[i]).find("#CColumn").val();
            //            if (PColumn == "" || PColumn == "") {//20121226 22:33 markeluo 添加引用关系后确定时，如果只选择了父列而没有选择子列也可以保存成功
            if (PColumn == "" || CColumn == "") {
                RelationColumns = [];

                AgiCommonDialogBox.Alert("请配置连接关系");
                return false;
            }
            else {
                RelationColumns.push(
                    { PColumn: PColumn, CColumn: CColumn }
                );
            }
        }
    }
    else {

        AgiCommonDialogBox.Alert("请配置连接关系");
        return false;
    }
    //判断当前关系状态，如果为Add新增一条关系，如果为Edit，替换之前的关系
    if (SCRelationState == "Add") {
        Relation.push({
            Name: Name,
            PGuidName: PGuidName,
            CGuidName: CGuidName,
            PTable: PTable,
            CTable: CTable,
            JoinType: JoinType,
            RelationColumns: RelationColumns
        });
    }
    else {
        Relation[SCRowIndex] = {
            Name: Name,
            PGuidName: PGuidName,
            CGuidName: CGuidName,
            PTable: PTable,
            CTable: CTable,
            JoinType: JoinType,
            RelationColumns: RelationColumns
        }
    }
    $("#DataRelationship").modal('hide');
    //绑定grid
    IsBulidRelationship = true;
    AllSCGrid.DRelationshipGrid(Relation);
    AllSCGrid.SCEntityRelationshipGrid(Relation);


    //更新列信息表格
    var entityinfos = [];
    var AllRGuid = [];
    SchemaColumns = [];
    for (var i = 0; i < Relation.length; i++) {
        AllRGuid.push(Relation[i].PGuidName, Relation[i].CGuidName);
    }
    //不重复的关系表
    AllRGuid = unique(AllRGuid);
    //绑定的GUID和实际表名保持一致
    function getvtname(name) {
        for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
            if (name == SelectedSCVirtualTable[i]._DSVT) {
                return SelectedSCVirtualTable[i]._GuidName;
            }
        }
    }

    for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
        for (var j = 0; j < AllRGuid.length; j++) {
            if (AllRGuid[j] == SelectedSCVirtualTable[i]._GuidName) {
                entityinfos.push(
                    {
                        dataSourceName: SelectedSCVirtualTable[i]["_DataSource"],
                        entityName: SelectedSCVirtualTable[i]["_DSVT"]
                    }
                );
            }
        }
    }
    var jsonData = { "entityinfos": entityinfos };
    var jsonString = JSON.stringify(jsonData);
    Agi.DAL.ReadData({
        "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
            if (_result.result == "true") {
                var SchemaData = _result.data;

                for (var i = 0; i < SchemaData.length; i++) {
                    var schema = SchemaData[i]["schema"];
                    for (var j = 0; j < schema.length; j++) {
                        SchemaColumns.push(
                            {
                                //GuidName: AllRGuid[i],
                                GuidName: getvtname(SchemaData[i].entityName),
                                ColumnName: schema[j],
                                NewName: schema[j],
                                Type: ""
                            });
                    }


                }

                //记录下当前显示的字段列
                var CurrShowColumn = [];
                var ThisFieldcolumnGridtbodytrs = $("#FieldcolumnGrid").find("tbody>tr");
                var ThisFieldcolumnGridtbodytrtdtemp = null;
                for (var g = 0; g < ThisFieldcolumnGridtbodytrs.length; g++) {
                    ThisFieldcolumnGridtbodytrtdtemp = $(ThisFieldcolumnGridtbodytrs[g]).find("td");
                    CurrShowColumn.push(
                        {
                            GuidName: ThisFieldcolumnGridtbodytrtdtemp[0].innerText,
                            ColumnName: ThisFieldcolumnGridtbodytrtdtemp[1].innerText,
                            NewName: ThisFieldcolumnGridtbodytrtdtemp[2].innerText,
                            Type: ""
                        }
                    );
                }
                ThisFieldcolumnGridtbodytrs = ThisFieldcolumnGridtbodytrtdtemp = null; //DOM查询优化,临时变量清空

                //循环保存已经修改的但是不需要删除的字段列
                for (var i = 0; i < CurrShowColumn.length; i++) {
                    for (var j = 0; j < SchemaColumns.length; j++) {
                        if (SchemaColumns[j].GuidName == CurrShowColumn[i].GuidName && SchemaColumns[j].ColumnName == CurrShowColumn[i].ColumnName) {
                            SchemaColumns[j].NewName = CurrShowColumn[i].NewName;
                        }
                    }
                }

                //绑定实体列信息
                AllSCGrid.FieldColumnGrid(SchemaColumns);
            }
        }
    });

});

//去掉数组中重复元素的方法
function unique(data) {
    data = data || [];
    var a = {};
    for (var i = 0; i < data.length; i++) {
        var v = data[i];
        if (typeof (a[v]) == 'undefined') {
            a[v] = 1;
        }
    }
    ;
    data.length = 0;
    for (var i in a) {
        data[data.length] = i;
    }
    return data;
}

//建立关系取消
$("#RDCancel").live('click', function () {
    $("#DataRelationship").modal('hide');
});
//关系编辑
$("#EditBRelationships").live('click', function () {
    //当前关系状态为修改
    SCRelationState = "Edit";
    //获取当前选中行
    SCRowIndex = $("#BuildrelationshipsGrid").data("kendoGrid").select().index();
    if (SCRowIndex >= 0) {
        var SCRelationEntity = Relation[SCRowIndex];
        //1.移除父表下拉选项 子表下拉选项 引用关系下拉选项 关系名称
        $("#SCEntityNameList1 option").remove();
        $("#SCEntityNameList2 option").remove();
        $("#SCEntityRelation option").remove();
        $(".SCRelation").remove();
        $("#SCRelationName ").val("");
        PData = [];
        CData = [];
        //重新加载父虚拟表下拉选项 子虚拟表下拉选项
        var EntityNameList = "<option value=''>NONE</option>";
        for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
            EntityNameList += "<option dataSouce='" + SelectedSCVirtualTable[i]["_DataSource"] + "' GuidName='" + SelectedSCVirtualTable[i]["_GuidName"] + "'  value='" + SelectedSCVirtualTable[i]["_DSVT"] + "'>" + SelectedSCVirtualTable[i]["_DSVT"] + "</option>";
        }
        if (EntityNameList != null) {
            $("#SCEntityNameList1").append(EntityNameList);
            $("#SCEntityNameList2").append(EntityNameList);
        }
        //重新加载引用关系
        var SCEntityRelation = "<option value=''>NONE</option>" +
            "<option value='inner join'>inner join</option>" +
            "<option value='left join'>left join</option>" +
            "<option value='right join'>right join</option>" +
            "<option value='full join'>full join</option>";
        $("#SCEntityRelation").append(SCEntityRelation);
        $("#DataRelationship").modal({ backdrop: false, keyboard: false, show: true });
        $('#DataRelationship').draggable({
            handle: ".modal-header"
        });
        $("#RelationsTitleName").html("编 辑 数 据 关 系");
        $("#SCEntityNameList1").val(SCRelationEntity["PTable"]);
        $("#SCEntityNameList2").val(SCRelationEntity["CTable"]);
        $("#SCRelationName").val(SCRelationEntity["Name"]);
        $("#SCEntityRelation").val(SCRelationEntity["JoinType"]);
        var PDataSouce = $("#SCEntityNameList1").find("option:selected").attr("dataSouce");
        var CDataSouce = $("#SCEntityNameList2").find("option:selected").attr("dataSouce");
        //3.获取当前父实体下所有列信息
        var jsonData = {
            "entityinfos": [
                { "dataSourceName": PDataSouce, "entityName": SCRelationEntity["PTable"] },
                { "dataSourceName": CDataSouce, "entityName": SCRelationEntity["CTable"] }
            ]
        };
        var jsonString = JSON.stringify(jsonData);
        Agi.DAL.ReadData({
            "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
                if (_result.result == "true") {
                    PData.push(_result.data[0]);
                    CData.push(_result.data[1]);
                    //1.把列信息取出来
                    //2.把列信息加载出来
                    var PColumnStr = '<option value=""></option>';
                    var CColumnStr = '<option value=""></option>';
                    var PColumnList = null, CColumnList = null;
                    if (PData.length > 0) {
                        PColumnList = PData[0]["schema"];
                        for (var i = 0; i < PColumnList.length; i++) {
                            PColumnStr += "<option value=" + PColumnList[i] + ">" + PColumnList[i] + "</option>";
                        }
                    }
                    if (CData.length) {
                        CColumnList = CData[0]["schema"];
                        for (var i = 0; i < CColumnList.length; i++) {
                            CColumnStr += "<option value=" + CColumnList[i] + ">" + CColumnList[i] + "</option>";
                        }
                    }
                    var RelationColumns = Relation[SCRowIndex]["RelationColumns"];
                    for (var i = 0; i < RelationColumns.length; i++) {
                        //1.把行添加出来
                        var strHTML = '<tr class="SCRelation"><td><select id="PColumn">' + PColumnStr + '</select></td><td><select id="CColumn">' + CColumnStr + '</select></td><td><input type="button" value="删除" id="DeleteRelationBtn"></td></tr>';
                        var SCRelationLen = $(".SCRelation").length;
                        $("#SCRelationTable tr:eq(" + SCRelationLen + ")").after(strHTML);
                        $($(".SCRelation")[i]).find("#PColumn").val(RelationColumns[i]["PColumn"]);
                        $($(".SCRelation")[i]).find("#CColumn").val(RelationColumns[i]["CColumn"]);
                    }
                }
            }
        });


        //更新列信息表格
        var entityinfos = [];
        var AllRGuid = [];
        SchemaColumns = [];
        for (var i = 0; i < Relation.length; i++) {
            AllRGuid.push(Relation[i].PGuidName, Relation[i].CGuidName);
        }
        //不重复的关系表
        AllRGuid = unique(AllRGuid);

        for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
            for (var j = 0; j < AllRGuid.length; j++) {
                if (AllRGuid[j] == SelectedSCVirtualTable[i]._GuidName) {
                    entityinfos.push(
                        {
                            dataSourceName: SelectedSCVirtualTable[i]["_DataSource"],
                            entityName: SelectedSCVirtualTable[i]["_DSVT"]
                        }
                    );
                }
            }
        }
        var jsonData = { "entityinfos": entityinfos };
        var jsonString = JSON.stringify(jsonData);
        Agi.DAL.ReadData({
            "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
                if (_result.result == "true") {
                    var SchemaData = _result.data;

                    for (var i = 0; i < SchemaData.length; i++) {
                        var schema = SchemaData[i]["schema"];
                        for (var j = 0; j < schema.length; j++) {
                            SchemaColumns.push(
                                {
                                    GuidName: AllRGuid[i],
                                    ColumnName: schema[j],
                                    NewName: schema[j],
                                    Type: ""
                                });
                        }
                    }

                    //记录下当前显示的字段列
                    var CurrShowColumn = [];
                    var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
                    var ThisFieldcolumnGridtrtdtemp = null;
                    for (var g = 0; g < ThisFieldcolumnGridtrs.length; g++) {
                        ThisFieldcolumnGridtrtdtemp = $(ThisFieldcolumnGridtrs[g]).find("td");
                        CurrShowColumn.push(
                            {
                                GuidName: ThisFieldcolumnGridtrtdtemp[0].innerText,
                                ColumnName: ThisFieldcolumnGridtrtdtemp[1].innerText,
                                NewName: ThisFieldcolumnGridtrtdtemp[2].innerText,
                                Type: ""
                            }
                        );
                    }
                    ThisFieldcolumnGridtrs = ThisFieldcolumnGridtrtdtemp = null; //DOM查询优化,临时变量清空

                    //循环保存已经修改的但是不需要删除的字段列
                    for (var i = 0; i < CurrShowColumn.length; i++) {
                        for (var j = 0; j < SchemaColumns.length; j++) {
                            if (SchemaColumns[j].GuidName == CurrShowColumn[i].GuidName && SchemaColumns[j].ColumnName == CurrShowColumn[i].ColumnName) {
                                SchemaColumns[j].NewName = CurrShowColumn[i].NewName;
                            }
                        }
                    }
                    //绑定实体列信息
                    AllSCGrid.FieldColumnGrid(SchemaColumns);
                }
            }
        });

    }


});
//关系删除
$("#DeleteBRelationships").live('click', function () {
    SCRowIndex = $("#BuildrelationshipsGrid").data("kendoGrid").select().index();

    AgiCommonDialogBox.Confirm("确定删除数据关系?", null, function (flag) {
        if (flag) {
            Relation.splice(SCRowIndex, 1);
            AllSCGrid.DRelationshipGrid(Relation);
            AllSCGrid.SCEntityRelationshipGrid(Relation);


            //更新列信息表格
            var entityinfos = [];
            var AllRGuid = [];
            SchemaColumns = [];
            for (var i = 0; i < Relation.length; i++) {
                AllRGuid.push(Relation[i].PGuidName, Relation[i].CGuidName);
            }
            //不重复的关系表
            AllRGuid = unique(AllRGuid);

            for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
                for (var j = 0; j < AllRGuid.length; j++) {
                    if (AllRGuid[j] == SelectedSCVirtualTable[i]._GuidName) {
                        entityinfos.push(
                            {
                                dataSourceName: SelectedSCVirtualTable[i]["_DataSource"],
                                entityName: SelectedSCVirtualTable[i]["_DSVT"]
                            }
                        );
                    }
                }
            }
            var jsonData = { "entityinfos": entityinfos };
            var jsonString = JSON.stringify(jsonData);
            Agi.DAL.ReadData({
                "MethodName": "VTReadDataTableSchema", "Paras": jsonString, "CallBackFunction": function (_result) {
                    if (_result.result == "true") {
                        var SchemaData = _result.data;

                        for (var i = 0; i < SchemaData.length; i++) {
                            var schema = SchemaData[i]["schema"];
                            for (var j = 0; j < schema.length; j++) {
                                SchemaColumns.push(
                                    {
                                        GuidName: AllRGuid[i],
                                        ColumnName: schema[j],
                                        NewName: schema[j],
                                        Type: ""
                                    });
                            }
                        }
                        //记录下当前显示的字段列
                        var CurrShowColumn = [];
                        var ThisFieldColumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
                        var ThisFieldColumnGridtrtdtemp = null;
                        for (var g = 0; g < ThisFieldColumnGridtrs.length; g++) {
                            ThisFieldColumnGridtrtdtemp = $(ThisFieldColumnGridtrs[g]).find("td");
                            CurrShowColumn.push(
                                {
                                    GuidName: ThisFieldColumnGridtrtdtemp[0].innerText,
                                    ColumnName: ThisFieldColumnGridtrtdtemp[1].innerText,
                                    NewName: ThisFieldColumnGridtrtdtemp[2].innerText,
                                    Type: ""
                                }
                            );
                        }
                        //ThisFieldColumnGridtrs=ThisFieldColumnGridtrtdtemp=null;//DOM查询优化,临时变量清空

                        //循环保存已经修改的但是不需要删除的字段列
                        for (var i = 0; i < CurrShowColumn.length; i++) {
                            for (var j = 0; j < SchemaColumns.length; j++) {
                                if (SchemaColumns[j].GuidName == CurrShowColumn[i].GuidName && SchemaColumns[j].ColumnName == CurrShowColumn[i].ColumnName) {
                                    SchemaColumns[j].NewName = CurrShowColumn[i].NewName;
                                }
                            }
                        }

                        //绑定实体列信息
                        AllSCGrid.FieldColumnGrid(SchemaColumns);
                    }
                }
            });

        } else {
            return;
        }
    });
});
//列过滤
$("#Columnfilter").live('click', function () {
    $("#ColumnfilterFrame").modal({ backdrop: false, keyboard: false, show: true });
    $('#ColumnfilterFrame').draggable({
        handle: ".modal-header"
    });
    $("#SinglePType").html("");
    $("#DoublePType").html("");
    $("#SinglePOperationSymbols").html("");
    $("#DoublePOperationSymbols").html("");
    //初始化加载下拉菜单选项
    $("<option value=''></option><option value='DATETIME'>DATETIME</option><option value='NUMBER'>NUMBER</option><option value='VARCHAR2'>VARCHAR2</option>").appendTo("#SinglePType");
    $("<option value=''></option><option value='DATETIME'>DATETIME</option><option value='NUMBER'>NUMBER</option><option value='VARCHAR2'>VARCHAR2</option>").appendTo("#DoublePType");

    $("<option value=''></option><option>></option><option>>=</option><option>=</option><option><=</option><option><</option><option>!=</option>").appendTo("#SinglePOperationSymbols");
    $("<option value=''></option><option>></option><option>>=</option><option>=</option><option><=</option><option><</option><option>!=</option>").appendTo("#DoublePOperationSymbols");

    //初始化单选按钮事件
    $('input[name="ParamSelectShow"]').click(function () {
        var radio = $('input[name="ParamSelectShow"]:checked').val();
        if (radio == "DoubleP") {
            $("#Columnfilterbottom").css("display", "block");
        } else {
            $("#Columnfilterbottom").css("display", "none");
        }
    });

});
//过滤确定按钮
$("#ColumnfilterOKBtn").live('click', function () {
    var radio = $('input[name="ParamSelectShow"]:checked').val();
    if (radio == "DoubleP") {

    }
    else {

    }

    /*释放临时变量*/
    radio = null;
});
//过滤取消按钮
$("#ColumnfilterCancelBtn").live('click', function () {
    $("#ColumnfilterFrame").modal('hide');
});
//生成语句并查询
$("#DialogSelected").live('click', function () {

    if ((IsBulidRelationship == false && IsAddOrUpdateVT == "add")
        || $("#BuildrelationshipsGrid").find("tbody>tr").length <= 0) {

        AgiCommonDialogBox.Alert("请先建立关系才能生成语句查询！");
        return;
    }

    //如果有列名相同，则提示取别名
    var TempSchemaColumns = [];
    var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
    var ThisFieldcolumnGridtrtdtemp = null;
    for (var t = 0; t < ThisFieldcolumnGridtrs.length; t++) {
        ThisFieldcolumnGridtrtdtemp = $(ThisFieldcolumnGridtrs[t]).find("td");
        TempSchemaColumns.push(
            {
                GuidName: ThisFieldcolumnGridtrtdtemp[0].innerText,
                ColumnName: ThisFieldcolumnGridtrtdtemp[1].innerText,
                NewName: ThisFieldcolumnGridtrtdtemp[2].innerText,
                Type: ""
            });
    }
    ThisFieldcolumnGridtrs = ThisFieldcolumnGridtrtdtemp = null; //DOM查询优化,临时变量清空

    var IsManyColum = false;
    for (var c = 0; c < TempSchemaColumns.length; c++) {
        for (var r = 0; r < TempSchemaColumns.length; r++) {
            if ((TempSchemaColumns[c].GuidName != TempSchemaColumns[r].GuidName) && (TempSchemaColumns[c].ColumnName == TempSchemaColumns[r].ColumnName) && (TempSchemaColumns[c].NewName == TempSchemaColumns[r].NewName)) {
                IsManyColum = true;
            }
        }
    }

    if (IsManyColum) {

        AgiCommonDialogBox.Alert("存在相同列名，请给列名取别名后再操作！");
        return;
    }

    //获取当前选择的所有数据源和虚拟表信息
    var AllDSAndVT = [];
    for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
        AllDSAndVT.push({
            dataSourceName: SelectedSCVirtualTable[i]._DataSource,
            entityName: SelectedSCVirtualTable[i]._DSVT,
            method: "Default"
        });
    }

    //获取所有的数据源
    Agi.DCManager.DCGetAllConn(function (_result) {
        var array = _result.dataSourceData;
        for (var i = 0; i < array.length; i++) {
            var DBName = array[i].dataSourceName,
                DBType = array[i].dataSourceType;

            AllNeedDataSource.push({
                dataSourceName: DBName,
                dataSourceType: DBType
            });
        }
    });

    //绑定所有的虚拟表参数到下拉列表
    var AllParams = [];
    AllParamsNameAndValue = [];
    Agi.VTManager.SCVTReadMethodParams(AllDSAndVT, function (_result) {
        if (_result.result == "true") {
            AllParams = _result.data;
            var AllParamsList = "";
            $("#AllVTParamsSelect").html("");
            for (var j = 0; j < AllParams.length; j++) {
                var nickname;
                var dsname = AllParams[j].dataSourceName;
                var dtname = AllParams[j].entityName;
                var AllVTParams = AllParams[j].paras;
                var dstype, typelogo;
                //获取数据源类型
                for (var g = 0; g < AllNeedDataSource.length; g++) {
                    if (AllNeedDataSource[g].dataSourceName == dsname) {
                        dstype = AllNeedDataSource[g].dataSourceType;
                    }
                }
                //获取别名
                for (var o = 0; o < SelectedSCVirtualTable.length; o++) {
                    if (SelectedSCVirtualTable[o]._DataSource == dsname && SelectedSCVirtualTable[o]._DSVT == dtname) {
                        nickname = SelectedSCVirtualTable[o]._GuidName;
                    }
                }

                if (dstype == "SQLServer") {
                    typelogo = "@p_"
                } else {
                    typelogo = ":p_"
                }

                //添加数据
                if (AllVTParams.length > 0) {
                    if (Agi.WebServiceConfig.Type == ".NET") {
                        for (var k = 0; k < AllVTParams.length; k++) {
                            AllParamsList += "<option value=" + typelogo + nickname + "#" + AllVTParams[k] + "&" + dsname + "&" + dtname + ">@p_" + nickname + "#" + AllVTParams[k] + "</option>";
                            AllParamsNameAndValue.push({
                                ID: typelogo + nickname + "#" + AllVTParams[k],
                                Type: "NVARCHAR2",
                                Value: ""
                            });
                        }
                    } else {
                        for (var k = 0; k < AllVTParams.length; k++) {
                            AllParamsList += "<option value=" + typelogo + nickname + "###" + AllVTParams[k].paraName + "&" + dsname + "&" + dtname + ">@p_" + nickname + "###" + AllVTParams[k].paraName + "</option>";
                            AllParamsNameAndValue.push({
                                //ID: typelogo + nickname + "#" + AllVTParams[k].paraName,
                                //20140226 范金鹏 将虚拟表和参数之间的连接符从一个#变成三个#
                                ID: typelogo + nickname + "###" + AllVTParams[k].paraName,
                                Type: "NVARCHAR2",
                                Value: ""
                            });
                        }
                    }
                }
            }

            if (AllParamsNameAndValue.length > 0) {
                //显示参数弹出框
                $("#ScVTMethodParams").modal({ backdrop: false, keyboard: false, show: true });
                $('#ScVTMethodParams').draggable({
                    handle: ".modal-header"
                });

                //将数据添加到下拉菜单
                $(AllParamsList).appendTo("#AllVTParamsSelect");

                //默认人选择第一个
                $("#PName").val(AllParamsNameAndValue[0].ID);
                $("#TypeSelect").val(AllParamsNameAndValue[0].Type);
                $("#PValue").val("");

                //给参数下拉菜单绑定点击事件
                $("#AllVTParamsSelect").unbind().change(function () {
                    var currvalue = $(this).val();
                    var valuelist = currvalue.split('&');
                    $("#PName").val(valuelist[0]);

                    for (var i = 0; i < AllParamsNameAndValue.length; i++) {
                        if (valuelist[0] == AllParamsNameAndValue[i].ID) {
                            $("#TypeSelect").val(AllParamsNameAndValue[i].Type);
                            $("#PValue").val(AllParamsNameAndValue[i].Value);
                            console.log("切换参数选择:" + valuelist[0] + "&&" + AllParamsNameAndValue[i].Value);
                            break;
                        }
                    }
                });

                //保存输入参数值
                $("#PValue").unbind().change(function () {
                    var PMPName = $("#PName").val();
                    var PTypeSel = $("#TypeSelect").val();
                    var PValueSel = $("#PValue").val();
                    for (var i = 0; i < AllParamsNameAndValue.length; i++) {
                        if (PMPName == AllParamsNameAndValue[i].ID) {
                            AllParamsNameAndValue[i].Type = PTypeSel;
                            AllParamsNameAndValue[i].Value = PValueSel;
                            console.log("输入值丢失焦点:" + PMPName + "&&" + PValueSel);
                            break;
                        }
                    }
                });

                //保存输入参数类型
                $("#TypeSelect").mouseout(function () {
                    for (var i = 0; i < AllParamsNameAndValue.length; i++) {
                        if ($("#PName").val() == AllParamsNameAndValue[i].ID) {
                            AllParamsNameAndValue[i].Type = $("#TypeSelect").val();
                            AllParamsNameAndValue[i].Value = $("#PValue").val();
                        }
                    }
                });
            } else {
                IsDialogSelected = true;
                var Paras = [];
                //        for (var i = 0; i < AllParamsNameAndValue.length; i++) {
                //            var id = (AllParamsNameAndValue[i]["ID"]).substring(3, (AllParamsNameAndValue[i]["ID"]).length);
                //            var Value = AllParamsNameAndValue[i].Value;
                //            Paras.push(id + "=" + Value);
                //        }
                var QueryCount = 0;
                QueryCount = $("#maxRecordBtn").val();
                var MethodInfo = [];
                for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
                    var dataSourceName = SelectedSCVirtualTable[i]["_DataSource"];
                    var EntityName = SelectedSCVirtualTable[i]["_DSVT"];
                    var Fuction = SelectedSCVirtualTable[i]["_Function"];
                    var GuidName = SelectedSCVirtualTable[i]["_GuidName"];
                    MethodInfo.push(
                        {
                            ID: dataSourceName + "." + EntityName + "." + Fuction,
                            Alias: GuidName
                        }
                    );
                }
                var _Relation = [];
                for (var i = 0; i < Relation.length; i++) {
                    _Relation.push(
                        { Name: Relation[i]["Name"], PTable: Relation[i]["PGuidName"], CTable: Relation[i]["CGuidName"], JoinType: Relation[i]["JoinType"], RelationColumns: Relation[i]["RelationColumns"][0] }
                    );
                }
                var Column = [];
                SchemaColumns = [];
                var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
                var ThisFieldcolumnGridtrtdtemp = null;
                for (var g = 0; g < ThisFieldcolumnGridtrs.length; g++) {
                    ThisFieldcolumnGridtrtdtemp = $(ThisFieldcolumnGridtrs[g]).find("td");
                    SchemaColumns.push(
                        {
                            GuidName: ThisFieldcolumnGridtrtdtemp[0].innerText,
                            ColumnName: ThisFieldcolumnGridtrtdtemp[1].innerText,
                            NewName: ThisFieldcolumnGridtrtdtemp[2].innerText,
                            Type: ""
                        }
                    );
                }
                ThisFieldcolumnGridtrs = ThisFieldcolumnGridtrtdtemp = null; //DOM查询优化，临时变量清空

                for (var i = 0; i < SchemaColumns.length; i++) {
                    Column.push(
                        { MethdoID: SchemaColumns[i]["GuidName"], Name: SchemaColumns[i]["ColumnName"], Alias: SchemaColumns[i]["NewName"], AggFunc: "", GroupBy: "true", Visible: "true", Filter: "" }
                    );
                }
                var jsonData = {
                    "Paras": Paras,
                    "QueryCount": QueryCount,
                    "MethodInfos": {
                        "MethodInfo": MethodInfo
                    },
                    "Relations": {
                        "Relation": _Relation
                    },
                    "Columns": {
                        "Column": Column
                    }
                }
                var jsonString = JSON.stringify(jsonData);
                Agi.DAL.ReadData({
                    "MethodName": "VTQueryScMethod", "Paras": jsonString, "CallBackFunction": function (_result) {
                        if (_result.result == "true") {
                            var arrColumns = [];
                            CData = _result.data;
                            if (CData.length > 0) {
                                //动态生成列
                                for (var k in CData[0]) {
                                    arrColumns.push({
                                        field: k,
                                        width: 90,
                                        title: k
                                    });
                                }
                            } else {

                                AgiCommonDialogBox.Alert("无数据!");
                            }
                            AllSCGrid.SCSelectResultGrid(arrColumns, CData);
                        } else {
                            AgiCommonDialogBox.Alert("查询出错,未找到符合条件的数据!");
                        }
                    }
                });
            }
        }
    });
});
//生成语句查询确定
$("#ParamsOKBtn").live('click', function () {
    IsDialogSelected = true;
    var ColumnNames = [];
    var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
    for (var g = 0; g < ThisFieldcolumnGridtrs.length; g++) {

        ColumnNames.push($(ThisFieldcolumnGridtrs[g]).find("td")[2].innerText);
    }
    ThisFieldcolumnGridtrs = null; //DOM查询优化,临时变量清空

    var hash = {};
    for (var i in ColumnNames) {
        if (hash[ColumnNames[i]]) {

            AgiCommonDialogBox.Alert("请给相同列取别名");
            return;
        }
        hash[ColumnNames[i]] = true;
    }
    var Paras = [];
    for (var i = 0; i < AllParamsNameAndValue.length; i++) {
        var id = (AllParamsNameAndValue[i]["ID"]).substring(3, (AllParamsNameAndValue[i]["ID"]).length);
        var Value = AllParamsNameAndValue[i].Value;
        Paras.push(id + "=" + Value);
    }
    var QueryCount = 0;
    QueryCount = $("#maxRecordBtn").val();
    var MethodInfo = [];
    for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
        var dataSourceName = SelectedSCVirtualTable[i]["_DataSource"];
        var EntityName = SelectedSCVirtualTable[i]["_DSVT"];
        var Fuction = SelectedSCVirtualTable[i]["_Function"];
        var GuidName = SelectedSCVirtualTable[i]["_GuidName"];
        MethodInfo.push(
            {
                ID: dataSourceName + "." + EntityName + "." + Fuction,
                Alias: GuidName
            }
        );
    }
    var _Relation = [];
    for (var i = 0; i < Relation.length; i++) {
        _Relation.push(
            { Name: Relation[i]["Name"], PTable: Relation[i]["PGuidName"], CTable: Relation[i]["CGuidName"], JoinType: Relation[i]["JoinType"], RelationColumns: Relation[i]["RelationColumns"][0] }
        );
    }
    var Column = [];
    SchemaColumns = [];
    var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
    var ThisFieldcolumnGridtrtdtemp = null;
    for (var g = 0; g < ThisFieldcolumnGridtrs.length; g++) {
        ThisFieldcolumnGridtrtdtemp = $(ThisFieldcolumnGridtrs[g]).find("td");
        SchemaColumns.push(
            {
                GuidName: ThisFieldcolumnGridtrtdtemp[0].innerText,
                ColumnName: ThisFieldcolumnGridtrtdtemp[1].innerText,
                NewName: ThisFieldcolumnGridtrtdtemp[2].innerText,
                Type: ""
            });
    }
    ThisFieldcolumnGridtrs = ThisFieldcolumnGridtrtdtemp = null; //DOM查询优化，临时变量清空

    for (var i = 0; i < SchemaColumns.length; i++) {
        Column.push(
            { MethdoID: SchemaColumns[i]["GuidName"], Name: SchemaColumns[i]["ColumnName"], Alias: SchemaColumns[i]["NewName"], AggFunc: "", GroupBy: "true", Visible: "true", Filter: "" }
        );
    }
    var jsonData = {
        "Paras": Paras,
        "QueryCount": QueryCount,
        "MethodInfos": {
            "MethodInfo": MethodInfo
        },
        "Relations": {
            "Relation": _Relation
        },
        "Columns": {
            "Column": Column
        }
    }
    var jsonString = JSON.stringify(jsonData);
    Agi.DAL.ReadData({
        "MethodName": "VTQueryScMethod", "Paras": jsonString, "CallBackFunction": function (_result) {
            if (_result.result == "true") {
                var arrColumns = [];
                CData = _result.data;
                if (CData.length > 0) {
                    //动态生成列
                    for (var k in CData[0]) {
                        arrColumns.push({
                            field: k,
                            width: 90,
                            title: k
                        });
                    }
                }
                else {

                    AgiCommonDialogBox.Alert("无数据！");
                }
                AllSCGrid.SCSelectResultGrid(arrColumns, CData);
            }
            else {
                AgiCommonDialogBox.Alert("错误！错误信息：" + _result.message);
            }
        }
    });
    $("#ScVTMethodParams").modal('hide');
});
//生成语句查询取消
$("#ParamsCancelBtn").live('click', function () {
    $("#ScVTMethodParams").modal('hide');
});
//保存按钮
$("#SCVTSave").live('click', function () {
    var pdataSourceName = $("#SCDSNAME").text();
    var SCVTName = $("#SCVTName").val();
    var Specification = $("#SCVTDESC").val();
    if (SCVTName.trim() == "") {

        AgiCommonDialogBox.Alert("请先输入复合实体名称！");
        return;
    }

    var PMethodInfo = [], PRelation = [], PColumn = [], PPara = [], PSchema = [];
    var ColumnNames = [];
    var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
    for (var g = 0; g < ThisFieldcolumnGridtrs.length; g++) {

        ColumnNames.push($(ThisFieldcolumnGridtrs[g]).find("td")[2].innerText);
    }
    ThisFieldcolumnGridtrs = null; //DOM查询优化,临时变量清空
    var hash = {};
    for (var i in ColumnNames) {
        if (hash[ColumnNames[i]]) {

            AgiCommonDialogBox.Alert("请给相同列取别名");
            return;
        }
        hash[ColumnNames[i]] = true;
    }
    //保存数据结构
    for (var i = 0; i < SelectedSCVirtualTable.length; i++) {
        var dataSourceName = SelectedSCVirtualTable[i]["_DataSource"];
        var EntityName = SelectedSCVirtualTable[i]["_DSVT"];
        var Fuction = SelectedSCVirtualTable[i]["_Function"];
        var GuidName = SelectedSCVirtualTable[i]["_GuidName"];
        PMethodInfo.push(
            {
                ID: dataSourceName + "." + EntityName + "." + Fuction,
                Alias: GuidName
            }
        );
    }
    //保存数据关系
    for (var j = 0; j < Relation.length; j++) {
        var Name = Relation[j].Name;
        var PTable = Relation[j].PGuidName;
        var CTable = Relation[j].CGuidName;
        var JoinType = Relation[j].JoinType;
        var RelationColumns = (Relation[j].RelationColumns)[0];
        PRelation.push({
            Name: Name,
            PTable: PTable,
            CTable: CTable,
            JoinType: JoinType,
            RelationColumns: RelationColumns
        });
    }

    //获取列信息
    SchemaColumns = [];
    var ThisFieldcolumnGridtrs = $("#FieldcolumnGrid").find("tbody>tr");
    var ThisFieldcolumnGridtrtdtemp = null;
    for (var g = 0; g < ThisFieldcolumnGridtrs.length; g++) {
        ThisFieldcolumnGridtrtdtemp = $(ThisFieldcolumnGridtrs[g]).find("td");
        SchemaColumns.push(
            {
                GuidName: ThisFieldcolumnGridtrtdtemp[0].innerText,
                ColumnName: ThisFieldcolumnGridtrtdtemp[1].innerText,
                NewName: ThisFieldcolumnGridtrtdtemp[2].innerText,
                Type: ""
            }
        );
    }
    ThisFieldcolumnGridtrs = ThisFieldcolumnGridtrtdtemp = null; //DOM查询优化,临时变量清空

    //保存列信息
    for (var k = 0; k < SchemaColumns.length; k++) {
        var MethdoID = SchemaColumns[k].GuidName;
        var Name = SchemaColumns[k].ColumnName;
        var Alias = SchemaColumns[k].NewName;
        var AggFunc = "";
        var GroupBy = "true";
        var Visible = "true";
        var Filter = "";
        PColumn.push({
            MethdoID: MethdoID,
            Name: Name,
            Alias: Alias,
            AggFunc: AggFunc,
            GroupBy: GroupBy,
            Visible: Visible,
            Filter: Filter
        });
    }
    //保存参数
    for (var n = 0; n < AllParamsNameAndValue.length; n++) {
        var ID = AllParamsNameAndValue[n].ID;
        ID = ID.substr(3);
        var Type = AllParamsNameAndValue[n].Type;
        var Value = AllParamsNameAndValue[n].Value;
        PPara.push({
            ID: ID,
            Type: Type,
            Default: Value
        });
    }

    //保存Schema
    //    for (var n = 0; n < AllParamsNameAndValue.length; n++) {
    //        var ID = AllParamsNameAndValue[n].ID;
    //        ID = ID.substr(ID.indexOf('#') + 1);
    //        PSchema.push(ID);
    //    }

    for (var n = 0; n < SchemaColumns.length; n++) {
        var MethdoID = SchemaColumns[n].GuidName;
        var Name = SchemaColumns[n].ColumnName;
        var SName = MethdoID + "." + Name;
        PSchema.push(SName);
    }

    //保存或修改
    if (IsAddOrUpdateVT == "add") {
        if (IsDialogSelected == true) {
            Agi.VTManager.SCVTSaveScMethodInfo(pdataSourceName, SCVTName, PMethodInfo, PRelation, PColumn, PPara, PSchema, Specification, function (_result) {
                if (_result.result == "true") {
                    Agi.VTManager.SCVTGetScMethodInfoEx(pdataSourceName, function (_result) {
                        BindSCVTData(_result);
                    });

                    AgiCommonDialogBox.Alert("保存成功！");
                    boolIsSave = true;
                    $("#SCVTSave").attr("disabled", "disabled");
                    //20130114 倪飘 解决新建混合虚拟表和新建datasets保存以后，保存按钮会变成不可选中状态，但是当鼠标移上去的时候还是可以看到按钮的变化问题
                    $('#SCVTSave').css('background-image', 'none')
                    IsDialogSelected = false;
                } else {

                    AgiCommonDialogBox.Alert("保存失败！失败信息：" + _result.message);
                    return;
                }
            });
        }
        else {

            AgiCommonDialogBox.Alert("请先生成语句并查询之后再保存！");
            return;
        }
    } else {
        if (IsDialogSelected == true) {
            Agi.VTManager.SCVTUpdateScMethodInfo(pdataSourceName, SCVTName, PMethodInfo, PRelation, PColumn, PPara, PSchema, Specification, function (_result) {
                if (_result.result == "true") {
                    Agi.VTManager.SCVTGetScMethodInfoEx(pdataSourceName, function (_result) {
                        BindSCVTData(_result);
                    });
                    AgiCommonDialogBox.Alert("修改成功！");
                    IsDialogSelected = false;
                }
                else {
                    AgiCommonDialogBox.Alert("修改失败！失败信息：" + _result.message);
                    return;
                }
            });
        }
        else {
            AgiCommonDialogBox.Alert("请先生成语句并查询之后再保存！");
            return;
        }
    }

});

/*混合虚拟表各种Grid==================================================================*/

var AllSCGrid = {
    //数据结构表格
    DStructureGrid: function (data) {
        $("#SCDatastructureGrid").find("tbody").html("");
        $("#SCDatastructureGrid").kendoGrid({
            dataSource: {
                data: data
            },
            height: 120,
            selectable: "single row",
            groupable: false,
            scrollable: false,
            sortable: false,
            pageable: false,
            columns: [
                {
                    field: "_GuidName",
                    width: 80,
                    title: "别名"
                },
                {
                    field: "_DataSource",
                    width: 80,
                    title: "数据源"
                },
                {
                    field: "_DSVT",
                    width: 80,
                    title: "虚拟表"
                },
                {
                    field: "_Function",
                    width: 80,
                    title: "方法"
                },
                {
                    field: "_Operation",
                    width: 80,
                    title: "操作",
                    template: "<button id='DeleteDStructure' class='GridDelBtn'></button>"
                }
            ]
        });
    },
    //数据关系表格
    DRelationshipGrid: function (data) {
        $("#BuildrelationshipsGrid").find("tbody").html("");
        $("#BuildrelationshipsGrid").kendoGrid({
            dataSource: {
                data: data
            },
            height: 120,
            selectable: "single row",
            groupable: false,
            scrollable: false,
            sortable: false,
            pageable: false,
            columns: [
                {
                    field: "Name",
                    width: 80,
                    title: "关系名称"
                },
                {
                    field: "JoinType",
                    width: 80,
                    title: "关系类型"
                },
                {
                    field: "PGuidName",
                    width: 80,
                    title: "父表"
                },
                {
                    field: "CGuidName",
                    width: 80,
                    title: "子表"
                },
                {
                    field: "Edit",
                    width: 80,
                    title: "编辑",
                    template: "<button id='EditBRelationships' class='GridEditBtn'></button>"
                },
                {
                    field: "Delete",
                    width: 80,
                    title: "删除",
                    template: "<button id='DeleteBRelationships' class='GridDelBtn'></button>"
                }
            ]
        });
    },
    //字段列表格
    FieldColumnGrid: function (data) {
        $("#FieldcolumnGrid").find("tbody").html("");
        $("#FieldcolumnGrid").kendoGrid({
            dataSource: {
                data: data,
                schema: {
                    model: {
                        fields: {
                            GuidName: { editable: false, nullable: true },
                            ColumnName: { editable: false, nullable: true },
                            NewName: { validation: { required: true} },
                            Type: { editable: false, nullable: true },
                            Columnfilter: { editable: false, nullable: true }
                        }
                    }
                }
            },
            height: 300,
            selectable: "single row",
            groupable: false,
            scrollable: false,
            sortable: false,
            pageable: false,
            editable: true,
            columns: [
                {
                    field: "GuidName",
                    width: 80,
                    title: "表名"
                },
                {
                    field: "ColumnName",
                    width: 80,
                    title: "列名",
                    filterable: false
                },
                {
                    field: "NewName",
                    width: 80,
                    title: "别名",
                    filterable: false
                }
            //            , {
            //                field: "Type",
            //                width: 80,
            //                title: "数据类型",
            //                filterable: false
            //            }
            //            , {
            //                field: "Columnfilter",
            //                width: 80,
            //                title: "列过滤",
            //                template: "<button id='Columnfilter' class='GridEditBtn'></button>",
            //                filterable: false
            //            }
            ]
        });
    },
    //实体表格
    SCEntityGrid: function (data) {
        $("#SCEntityGrid").find("tbody").html("");
        $("#SCEntityGrid").kendoGrid({
            dataSource: {
                data: data
            },
            height: 120,
            selectable: "single row",
            groupable: false,
            scrollable: false,
            sortable: false,
            pageable: false,
            columns: [
                {
                    field: "_DataSource",
                    width: 80,
                    title: "数据源"
                },
                {
                    field: "_DSVT",
                    width: 80,
                    title: "虚拟表"
                },
                {
                    field: "_Function",
                    width: 80,
                    title: "方法"
                }
            ]
        });
    },
    //实体关系表格
    SCEntityRelationshipGrid: function (data) {
        $("#EntityRelationshipGrid").find("tbody").html("");
        $("#EntityRelationshipGrid").kendoGrid({
            dataSource: {
                data: data
            },
            height: 120,
            selectable: "single row",
            groupable: false,
            scrollable: false,
            sortable: false,
            pageable: false,
            columns: [
                {
                    field: "Name",
                    width: 80,
                    title: "关系名称"
                },
                {
                    field: "JoinType",
                    width: 80,
                    title: "关系类型"
                },
                {
                    field: "PGuidName",
                    width: 80,
                    title: "父表"
                },
                {
                    field: "CGuidName",
                    width: 80,
                    title: "子表"
                }
            ]
        });
    },
    //查询结果表格
    SCSelectResultGrid: function (columns, data) {
        $("#QueryresultsGrid").find("tbody").html("");
        $("#QueryresultsGrid").kendoGrid({
            dataSource: {
                data: data
            },
            height: 120,
            selectable: "single row",
            groupable: false,
            scrollable: false,
            sortable: false,
            pageable: false,
            columns: columns
        });
    }
};

/*混合虚拟表各种Grid  结束===============================================================*/

/*编辑混合虚拟表==================================================================*/

function EditSCVirtualTablePage(DSName, SCVTName) {
    AddNewVirtualTablePage();
    IsAddOrUpdateVT = "update";
    $("#SCVTSave").val("修改");
    var SingleVTInfo;

    //查找所有数据源信息用来查找数据源类型
    Agi.DCManager.DCGetAllConn(function (_result) {
        var array = _result.dataSourceData;
        for (var i = 0; i < array.length; i++) {
            var DBName = array[i].dataSourceName,
                DBType = array[i].dataSourceType;

            AllNeedDataSource.push({
                dataSourceName: DBName,
                dataSourceType: DBType
            });
        }
    });

    //查找复合数据源信息
    Agi.VTManager.SCVTGetScMethodInfo(DSName, SCVTName, function (_result) {
        if (_result.result == "true") {
            SingleVTInfo = _result.data;
            //绑定基本信息页信息
            $("#SCVTName").val(SingleVTInfo.entityName);
            $("#SCVTDESC").val(SingleVTInfo.Specification);
            $("#SCDSNAME").text(SingleVTInfo.dataSourceName);
            for (var g = 0; g < AllNeedDataSource.length; g++) {
                if (AllNeedDataSource[g].dataSourceName == SingleVTInfo.dataSourceName) {
                    $("#SCDSTYPE").text(AllNeedDataSource[g].dataSourceType);
                }
            }
            $("#SCVTName").attr("disabled", "disabled");

            //绑定数据源页信息
            //清空虚拟表信息
            SelectedSCVirtualTable = [];
            var MethodInfos = SingleVTInfo.MethodInfos.MethodInfo;
            for (var j = 0; j < MethodInfos.length; j++) {
                var Alias = MethodInfos[j].Alias;
                var ID = MethodInfos[j].ID;
                ID = ID.split('.');
                SelectedSCVirtualTable.push({
                    _GuidName: Alias,
                    _DataSource: ID[0],
                    _DSVT: ID[1],
                    _Function: ID[2]
                });
            }
            //绑定实体Grid数据
            AllSCGrid.SCEntityGrid(SelectedSCVirtualTable);
            //绑定数据结构Grid数据
            AllSCGrid.DStructureGrid(SelectedSCVirtualTable);


            //绑定关系信息
            var Relations = SingleVTInfo.Relations.Relation;
            for (var k = 0; k < Relations.length; k++) {
                var RelationColumns = [];
                RelationColumns.push(
                    { PColumn: Relations[k].RelationColumns.PColumn, CColumn: Relations[k].RelationColumns.CColumn }
                );
                var PGuidName, CGuidName, PTable, CTable, Name, JoinType;
                PGuidName = Relations[k].PTable;
                CGuidName = Relations[k].CTable;
                Name = Relations[k].Name;
                JoinType = Relations[k].JoinType;
                for (var a = 0; a < MethodInfos.length; a++) {
                    if (MethodInfos[a].Alias == PGuidName) {
                        var pnamelist = MethodInfos[a].ID;
                        pnamelist = pnamelist.split('.');
                        PTable = pnamelist[1];
                    }
                    else if (MethodInfos[a].Alias == CGuidName) {
                        var cnamelist = MethodInfos[a].ID;
                        cnamelist = cnamelist.split('.');
                        CTable = cnamelist[1];
                    }
                }
                Relation.push({
                    Name: Name,
                    PGuidName: PGuidName,
                    CGuidName: CGuidName,
                    PTable: PTable,
                    CTable: CTable,
                    JoinType: JoinType,
                    RelationColumns: RelationColumns
                });
            }
            //绑定数据关系到表格
            AllSCGrid.DRelationshipGrid(Relation);
            AllSCGrid.SCEntityRelationshipGrid(Relation);

            //绑定列信息页信息
            var Columns = SingleVTInfo.Columns.Column;
            SchemaColumns = [];
            for (var n = 0; n < Columns.length; n++) {
                SchemaColumns.push(
                    {
                        GuidName: Columns[n].MethdoID,
                        ColumnName: Columns[n].Name,
                        NewName: Columns[n].Alias,
                        Type: ""
                    }
                );
            }
            //绑定实体列信息
            AllSCGrid.FieldColumnGrid(SchemaColumns);


            //绑定参数
            var Paras = SingleVTInfo.Para;
        }
    });
}

/*编辑混合虚拟表  结束==================================================================*/

//----------------------------------------------------------------------------
//从arrayKeyValue读取数据绑定在弹出层
function GetKeyValues() {
    $("#txtKeyValue").val("");
    $("#sqlkeyValue").val($("#sqlKeyValues").val());
    for (var j in arrayKeyValue) {
        if ($("#sqlKeyValues").val() == arrayKeyValue[j].key) {
            $("#sqlKeyType").val(arrayKeyValue[j].type);
            $("#txtKeyValue").val(arrayKeyValue[j].value);
            //$("#txtKeyValue").val(PublicParameter[11].Default);
            break;
        }
    }
}
//将当前数据保存到arrayKeyValue
function SetKeyValues() {
    for (var k in arrayKeyValue) {
        // if ($("#sqlKeyValues").val() == arrayKeyValue[k].key) {
        if (PresqlKeyValues == arrayKeyValue[k].key) {
            arrayKeyValue[k].type = $("#sqlKeyType").val();
            arrayKeyValue[k].value = $("#txtKeyValue").val();
            break;
        }
    }
}
//字符串替换
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

/// <summary>根据SQL语句获取数据</summary>
/// <param name="_result" type="bool">为true则说明需要传入值为false则说明不需要传入值</param>
function GetVTDataBySQL(_result) {
    SetKeyValues();
    $('#progressbar1').show().find('.close').click(function (e) {
        $('#progressbar1').hide().html('<div class="progressBar">' +
            '<button style="position: absolute;left: 186px;top: -4px;" type="button" class="close" data-dismiss="alert">×</button>' +
            '<div class="progress progress-striped active borderFlash">' +
            '<div class="bar" style="width: 100%;"></div>' +
            '</div>' +
            '<span>正在载入...</span>' +
            '</div>');
    });
    var newSql = _strSQL;
    if (_result) {
        for (var i = 0; i < arrayKeyValue.length; i++) {
            var _oldValue = arrayKeyValue[i].key;
            var _newValue = GetReplaceValue(arrayKeyValue[i].type, arrayKeyValue[i].value);
            newSql = newSql.replaceAll(_oldValue, _newValue);
        }
    }
    Agi.VTManager.VTGetDataBySql(NewVirtualTableDBName, newSql, _count, function (result) {
        var VTColumns = [];
        Columns = [];
        var array = result.Data;
        if (result.result == "true") {
            //自动生成列
            //            for (var k in array[0]) {
            //                Columns.push({
            //                    field:k,
            //                    width:90,
            //                    title:k
            //                });
            //                var _TName = k;
            //                _DType = "NVARCHAR2";
            //                _Remark = null;
            //                VTColumns.push(
            //                    {
            //                        TName:_TName + " ",
            //                        DType:_DType + " ",
            //                        Remark:_Remark + " "
            //                    }
            //                );
            //            }
            //重组数据 让列头支持特殊字符 update by sunming 2014-01-15
            var hasHeader = false;
            for (var o in array) {
                var info = "";
                for (var f in array[o]) {
                    var field = replaceSpecialChar(f);
                    if (field == undefined || field == "")
                        field = "_";
                    _DType = "NVARCHAR2";
                    _Remark = null;
                    if (!hasHeader) {
                        Columns.push({
                            field: field,
                            width: 90,
                            title: f
                        });
                        var _TName = field;

                        VTColumns.push(
                            {
                                TName: field + " ",
                                DType: _DType + " ",
                                Remark: _Remark + " "
                            }
                        );
                    }

                    var fVal;
                    if (array[o][f] == undefined) {
                        fVal = null;
                    }
                    else {
                        fVal = array[o][f];
                    }

                    info += "\"" + field + "\":\"" + fVal + "\",";
                }

                array[o] = JSON.parse("{" + info.trimEnd(',') + "}");
                hasHeader = true;
            }

            BindVTData(array, Columns);
            BindVTColumns(VTColumns);
            SqlIsReturnValue = true;
            $('#progressbar1').hide();
            if (array.length === 0) {
                AgiCommonDialogBox.Alert("未查询到符合条件的数据!");
            }
        }
        else {
            $('#progressbar1').hide();

            AgiCommonDialogBox.Alert("无查询结果,请检查SQL语句是否出错!");
            SqlIsReturnValue = false;
            return;
        }
    });
}

String.prototype.trimEnd = function (trimStr) {
    if (!trimStr) { return this; }
    var temp = this;
    while (true) {
        if (temp.substr(temp.length - trimStr.length, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(0, temp.length - trimStr.length);
    }
    return temp;
};

String.prototype.trimStart = function (trimStr) {
    if (!trimStr) { return this; }
    var temp = this;
    while (true) {
        if (temp.substr(0, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(trimStr.length);
    }
    return temp;
};

function replaceSpecialChar(str) {
    var pattern = new RegExp("[0-9`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—·δΩμ℃\\-+=|{}【】‘；：”“'。，、？\\\\ ]")
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

//绑定所有列
function BindVTColumns(VTColumns) {
    $("#grid5").html("");
    $("#grid5").kendoGrid({
        dataSource: {
            data: VTColumns,
            pageSize: 6
        },
        height: 260,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        columns: [
            {
                field: "TName",
                width: 90,
                title: "列名"
            }
        //        , {
        //            field: "DType",
        //            width: 50,
        //            title: "数据类型"
        //        }, {
        //            field: "Remark",
        //            width: 50,
        //            title: "说明"
        //        }
        ]
    }); //20121225 15:51 倪飘 修改虚拟表列信息显示问题
}
//绑定虚拟表查询数据
function BindVTData(detailData, columns) {
    $("#grid6").html("");
    $("#grid6").kendoGrid({
        dataSource: {
            data: detailData
        },
        height: 260,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: false,
        columns: columns
    });
}
//根据数据类型返回相对应值
function GetReplaceValue(dataType, value) {
    switch (dataType) {
        case "DATETIME":
            if (this.NewVirtualTableDBType == "SQLServer") {
                return "'" + value + "' ";
            }
            else if (this.NewVirtualTableDBType == 'Excel') {
                return "#" + value + "# ";
            } else {
                return "TO_DATE('" + value + "','YYYY-MM-DD hh24:mi:ss') ";
            }
            return;
        case "NUMBER":
            return value + " ";
        case "NVARCHAR2":
            return "'" + value + "' ";
        case "CURSOR":
            return;
    }
    return "";
}
function checkStrSQL() {
    var KeyBool = false;
    /// <summary>验证SQL语句</summary>
    var array = _strSQL.split(' ');
    //20140225 范金鹏 注释arrayKeyValue初始化
    var arrayKeyValueNew = [];
    if(arrayKeyValue!=undefined)
    {
    arrayKeyValueNew = arrayKeyValue;
    }
    arrayKeyValue = [];

    //    if(PublicParameter[11] && NewVirtualTableDBType != "Oracle"){
    //        for(var i = 0; i < PublicParameter[11].length; i++){
    //            var TypeString = PublicParameter[11][i].Type;
    //            var IDString = PublicParameter[11][i].ID;
    //            arrayKeyValue.push({
    //                key: '@p_' + IDString,
    //                type: TypeString.substring(0, TypeString.indexOf("[,,]%DBTYPE")),
    //                value: PublicParameter[11][i].Default
    //            });
    //        }
    //    }
    if (NewVirtualTableDBType == "SQLServer" || NewVirtualTableDBType == "Excel") {
        for (var i = 0; i < array.length; i++) {
            if (array[i].indexOf(":p_") >= 0 || array[i].indexOf(":P_") >= 0) {

                AgiCommonDialogBox.Alert("无查询结果,请检查SQL语句是否出错!");
                break;
            }
            if (array[i].indexOf("@p_") >= 0 || array[i].indexOf("@P_") >= 0) {
                var _KeyValue = array[i].substring(array[i].indexOf("@"), array[i].length);
                for (var j = 0; j < arrayKeyValue.length; j++) {
                    if (arrayKeyValue[j].key == _KeyValue) {
                        KeyBool = true;
                        break;
                    }
                    else {
                        KeyBool = false;
                    }
                }
                if (!KeyBool) {
                    arrayKeyValue.push({
                        key: _KeyValue,
                        type: "NVARCHAR2",
                        value: ""
                    });
                }

            }
        }
    }
    //20140225 范金鹏 判断arrayKeyValue中若是有语句中的key就不添加，否则添加并给空值
    if (NewVirtualTableDBType == "Oracle") {
        for (var i = 0; i < array.length; i++) {
            if (array[i].indexOf("@p_") >= 0 || array[i].indexOf("@P_") >= 0) {

                AgiCommonDialogBox.Alert("无查询结果,请检查SQL语句是否出错!");
                break;
            }
            if (array[i].indexOf(":p_") >= 0 || array[i].indexOf(":P_") >= 0) {
                var _KeyValue = array[i].substring(array[i].indexOf(":"), array[i].length);
                var _Value = "";
                for (var j = 0; j < arrayKeyValueNew.length; j++) {
                    if (arrayKeyValueNew[j].key == _KeyValue) {
                        KeyBool = true;
                        _Value = arrayKeyValueNew[j].value;
                        break;
                    }
                    else {
                        KeyBool = false;
                    }
                }
                if (!KeyBool) {
                    arrayKeyValue.push(
                    {
                        key: array[i].substring(array[i].indexOf(":"), array[i].length),
                        type: "NVARCHAR2",
                        value: ""
                    }
                );
                }
                else {
                    arrayKeyValue.push(
                    {
                        key: array[i].substring(array[i].indexOf(":"), array[i].length),
                        type: "NVARCHAR2",
                        value: _Value
                    });
                }
            }
        }
    }
}
//初始化标准虚拟表数据源列表的表格
function InitDBGrid(dataresult) {
    $("#DataSourcegrid").html("");
    $("#DataSourcegrid").kendoGrid({
        dataSource: {
            //data: GetDataSourceToVT(),
            data: dataresult
        },
        height: 200,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        filterable: true,
        columns: [
            {
                field: "dbName",
                width: 80,
                title: "数据源名称"
            },
            {
                field: "dbType",
                width: 80,
                title: "数据源类型"
            },
            {
                field: "dbDes",
                width: 50,
                title: "说明",
                filterable: false
            }
        ]
    });
}
//初始化混合虚拟表数据源列表
function InitSCDBGrid(dataresult) {
    $("#ScDataSourcegrid").kendoGrid({
        dataSource: {
            //data: GetDataSourceToVT(),
            data: dataresult
        },
        height: 200,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        filterable: true,
        columns: [
            {
                field: "dbName",
                width: 80,
                title: "数据源名称"
            },
            {
                field: "dbType",
                width: 80,
                title: "数据源类型"
            },
            {
                field: "dbDes",
                width: 50,
                title: "说明",
                filterable: false
            }
        ]
    });
}
//初始化存储过程虚拟表数据源列表
function InitPRODBGrid(dataresult) {
    $("#ProDataSourcegrid").kendoGrid({
        dataSource: {
            //data: GetDataSourceToVT(),
            data: dataresult
        },
        height: 200,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        filterable: true,
        columns: [
            {
                field: "dbName",
                width: 80,
                title: "数据源名称"
            },
            {
                field: "dbType",
                width: 80,
                title: "数据源类型"
            },
            {
                field: "dbDes",
                width: 50,
                title: "说明",
                filterable: false
            }
        ]
    });
}

//获取所有数据源
function GetDataSourceToVT(type) {
    var data = [];
    Agi.DCManager.DCGetAllConn(function (_result) {
        var array = _result.dataSourceData;
        for (var i = 0; i < array.length; i++) {
            var DBName = array[i].dataSourceName,
                DBType = array[i].dataSourceType,
                DBDes = array[i].dataSourceAblout;
            if (DBDes == "null") {
                DBDes = "";
            }
            data.push({
                dbName: DBName + " ",
                dbType: DBType + " ",
                dbDes: DBDes + " "
            });
        }
        if (type == "标准") {
            InitDBGrid(data);
        }
        else if (type == "混合") {
            InitSCDBGrid(data);
        }
        else if (type == "存储过程") {
            InitPRODBGrid(data);

        }
        AllNeedDataSource = data;
    });

}

//初始化混合虚拟表所有实体
function InitSCAllVT(dataresult, Gridname) {
    $("#" + Gridname).kendoGrid({
        dataSource: {
            //data: GetDataSourceToVT(),
            data: dataresult
        },
        height: 200,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        filterable: true,
        columns: [
            {
                field: "IsSelected",
                width: 50,
                title: "选择",
                template: "<input type='checkbox' id='isSelectd' value='' />",
                filterable: false
            },
            {
                field: "dbName",
                width: 80,
                title: "数据源"
            },
            {
                field: "Names",
                width: 50,
                title: "名称"
            }
        ]
    });
}


//加载所有实体信息
function AddAllVTInfo(gridname, DSName) {
    var data = [];
    //20130118 倪飘 修改虚拟表-新建混合虚拟表-用两个已有的混合虚拟表新建一个混合虚拟表，SQL语句无法查询，但可以保存成功问题
    Agi.VTManager.SCVTAllEntitys(function (_result) {
        if (_result.result == "true") {
            for (var i = 0; i < _result.data.length; i++) {
                var dsname = _result.data[i].sourceName;
                var AllET = _result.data[i].entitys;
                for (var j = 0; j < AllET.length; j++) {
                    data.push({
                        dbName: dsname + " ",
                        Names: AllET[j] + " "
                    });
                }
            }
            //将数据放到Grid
            InitSCAllVT(data, gridname);
        }
    });
}

//----------------------------------------------------------------------------
//编辑虚拟表详细信息
function EditVT(dataSourceName, vtName) {
    var _dataSourceName = dataSourceName;
    var _vtName = vtName;
    Agi.DCManager.DCGetConnDByID(_dataSourceName, function (result) {
        if (result.result == "true") {
            AddVTManage(result.dataSourceName, result.dataBaseType);
            this.vtAction = "update";
            this.NewVirtualTableDBName = result.dataSourceName;
            this.NewVirtualTableDBType = result.dataBaseType;
            Agi.VTManager.VTGetTableDetailsByDS(_dataSourceName, _vtName, function (result) {
                //PublicParameter[11] = result.TableDetailsData.SingleEntityInfo.SqlDefined.Para;
                if (result.result == "true") {
                    if (Agi.WebServiceConfig.Type == ".NET") {
                        if (result.TableDetailsData.SingleEntityInfo.SqlDefined != undefined) {
                            PublicParameter[11] = result.TableDetailsData.SingleEntityInfo.SqlDefined.Para;
                        }
                        var _VTName = result.TableDetailsData.SingleEntityInfo.ID;
                        var _SQLstring = result.TableDetailsData.SingleEntityInfo.SqlDefined.SqlString;
                        $("#VTName").val(_VTName);
                        $("#VTName").attr('readonly', true);
                        $("#VTSQL").val(_SQLstring);
                        $("#VTDescription").val(result.TableDetailsData.SingleEntityInfo.Specification); //20121224 16:53 markeluo 获取虚拟表详情时，显示备注信息 .NET 处理
                    }
                    else {
                        var _VTName = result.TableDetailsData[0].vtName;
                        var _SQLstring = result.TableDetailsData[0].sqlString;
                        PublicParameter[11] = result.TableDetailsData[0].Para;
                        $("#VTName").val(_VTName);
                        $("#VTName").attr('readonly', true);
                        $("#VTSQL").val(_SQLstring);
                        $("#VTDescription").val(result.TableDetailsData[0].Specification); //20121224 16:53 markeluo 获取虚拟表详情时，显示备注信息 JAVA处理
                    }
                }
            });
        }
    });

}
var IsSaveOrUpdate = "";
function createConfigPanel() {
    var htmlStr = "";
    htmlStr = "<div id='" + self.options.panelID + "' title='布局设计器' class='hide'>" +
        "<form id='" + self.options.designer + "' class='form-horizontal'>" +
        "</form>" +
        "<a id='" + self.options.addRowBottom + "' class='btn'>添加行</a>" +
        "</div>";
    var panel = $(htmlStr);
    rowHtmlForDesigner().appendTo(panel.find('form:first'));
    return panel;
    /*释放临时变量*/
    htmlStr = null;
}

//新建dataset
function AddDataSets(dsname, vtname, state) {

    ShowOperationData();
    IsSaveOrUpdate = "add";
    $("#BottomRightText").text("新建 Dataset");
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='dsTabPage'><div id='dstopall'><div id='dstop1'>" +
        "<div class='newdatastitle'>Dataset 基本信息</div>" +
    //20130730 倪飘 20130723 首自信qpc项目接口参数更改
        "<div class='datasetbasepanel' style='visibility:hidden;height:0px;line-height:0px;'><label style='margin-left: 40px;'>类型：</label><input type='text' id='dsvttype' class='ControlProTextSty'style='width:280px;' maxlength='10' ischeck='true'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 40px;'>名称：</label><input type='text' id='dsetname' class='ControlProTextSty'style='width:280px;' maxlength='30' ischeck='true'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 40px;'>备注：</label><textarea style='height:50px;width:275px;resize:none;' id='dsetmemeo' class='ControlProTextSty' maxlength='100' ischeck='true' ></textarea></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 25px;'> 数据源：</label><input type='text' id='dsetdsource' style='width:280px;'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 25px;'> 虚拟表：</label><input type='text' id='dsetvtable' style='width:280px;'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 15px;'>默认控件：</label><select id='dsetdcontrol' style='width:290px;'></select></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 25px;'>组别：</label>" +
        "<div id='SetDataSetGroup' class='jstree jstree-1 jstree-default jstree-focused' style='height:50px; width: 280px; text-align:left;overflow-y: scroll;'></div>" +
        "<input type='hidden'  id='GroupNameID' value='0'></div>" +
        "</div><div id='dstop2'><div class='newdatastitle'>列 信 息</div><div class='calccloum'><input type='button' id='btnExpression' value='添加计算列' class='btnclass'/><input type='button' id='btnCheck' value='列显示全选' class='btnclass'/><input type='button' id='btnUp' value='上移' class='btnclass'  /><input type='button' id='btnDown' value='下移'  class='btnclass' />" +
        "</div><div id='gridone' class='dsdridsty'></div></div><div id='dstop3'><div class='newdatastitle'>列 排 序 </div><div class='opcloum'>" +
        "</div><div id='gridtwo' class='dsdridsty'>" +
        "</div></div><div id='dstop4'><div class='newdatastitle'>预     览</div><div class='previewcloum'><input type='button' id='btnView' value='预览' class='btnclass'/>" +
        "<input id='DataSetSave'  class='btnclasssty btnclass' type='button' value='保    存'/><input id='DataGetSql'  class='btnclass' type='button' value='SQL语句' style='display:none;'/></div><div id='gridView' class='dsdridsty'></div></div></div>" +
        "<div id='dsbtmall'><div id='dsbtm1'>基本信息</div><div id='dsbtm2'>列信息</div><div id='dsbtm3'>列排序</div><div id='dsbtm4'>预  览</div></div></div>");
    $("#DataSetSave").attr("disabled", true);
    $('#DataSetSave').removeClass("btnclass");
    $.get("xml/ControlConfig.xml", function (data) {
        var js = JSON.parse(Agi.Utility.xml2json($(data).find('Controls')[0], ""));

        var controlType = js.Controls.Group;
        //20121226 22:51 markeluo 新建DataSet 时，默认控件类型下拉列表中重复控件类型去除
        var ControlTypesArray = new Agi.Script.CArrayList(); //控件类型数组
        var StrTypeTempValue = "";

        $.each(controlType, function (i, val) {
            if (val["@Name"] != "实时数据") {
                if (Object.prototype.toString.call(val.Control) === "[object Array]") {
                    $.each(val.Control, function (i, val1) {
                        //                        $("#dsetdcontrol").append("<option value='" + val.Control[i]["@ControlType"] + "'>" + val.Control[i]["@ControlType"] + "</option>");
                        //20121226 22:51 markeluo 新建DataSet 时，默认控件类型下拉列表中重复控件类型去除
                        StrTypeTempValue = val.Control[i]["@ControlType"];
                        if (!ControlTypesArray.contains(StrTypeTempValue)) {
                            //20130118 倪飘 解决Datasets-新建datasets-控件不支持实体数据，建议新建datasets时，在控件下拉列表不要显示问题
                            if (StrTypeTempValue === "DropDownList" || StrTypeTempValue === "MultiSelect" || StrTypeTempValue === "Label" ||
                                StrTypeTempValue === "AssociativeInputBox" ||
                                StrTypeTempValue === "DataGrid" || StrTypeTempValue === "BasicChart" || StrTypeTempValue === "DashboardChart" ||
                                StrTypeTempValue === "DashboardChart1" || StrTypeTempValue === "ThermometerChart" || StrTypeTempValue === "LEDChart" ||
                                StrTypeTempValue === "NewCheckBox" || StrTypeTempValue === "RadioButton" || StrTypeTempValue === "BubbleChart" ||
                                 StrTypeTempValue === "WaterfallChart" || StrTypeTempValue === "PieChart" || StrTypeTempValue === "DataChart" ||
                                 StrTypeTempValue === "HeatMapChart" || StrTypeTempValue === "KPIChart") {
                                $("#dsetdcontrol").append("<option value='" + StrTypeTempValue + "'>" + StrTypeTempValue + "</option>");
                                ControlTypesArray.add(StrTypeTempValue);
                            }
                        }
                    });
                }
                else {
                    //                    $("#dsetdcontrol").append("<option value='" + controlType[i].Control["@ControlType"] + "'>" + controlType[i].Control["@ControlType"] + "</option>");
                    //20121226 22:51 markeluo 新建DataSet 时，默认控件类型下拉列表中重复控件类型去除
                    StrTypeTempValue = controlType[i].Control["@ControlType"];
                    if (!ControlTypesArray.contains(StrTypeTempValue)) {
                        //20130118 倪飘 解决Datasets-新建datasets-控件不支持实体数据，建议新建datasets时，在控件下拉列表不要显示问题
                        if (StrTypeTempValue === "DropDownList" || StrTypeTempValue === "MultiSelect" || StrTypeTempValue === "Label" ||
                            StrTypeTempValue === "AssociativeInputBox" ||
                            StrTypeTempValue === "DataGrid" || StrTypeTempValue === "BasicChart" || StrTypeTempValue === "DashboardChart" ||
                            StrTypeTempValue === "DashboardChart1" || StrTypeTempValue === "ThermometerChart" || StrTypeTempValue === "LEDChart" ||
                            StrTypeTempValue === "NewCheckBox" || StrTypeTempValue === "RadioButton" || StrTypeTempValue === "BubbleChart" ||
                            StrTypeTempValue === "WaterfallChart" || StrTypeTempValue === "PieChart" || StrTypeTempValue === "DataChart" ||
                            StrTypeTempValue === "HeatMapChart" || StrTypeTempValue === "KPIChart") {
                            $("#dsetdcontrol").append("<option value='" + StrTypeTempValue + "'>" + StrTypeTempValue + "</option>");
                            ControlTypesArray.add(StrTypeTempValue);
                        }
                    }
                }
            }
        });
        ControlTypesArray = null; //20121226 22:51 markeluo 新建DataSet 时，默认控件类型下拉列表中重复控件类型去除
    });

    //2014-02-20  COKE 添加节点
    CreateNewNode();

    //标准
    if (state == undefined) {
        GetAllVTData(dsname, vtname);
    }
    //混合
    else if (state == true) {
        GetAllSCData(dsname, vtname);
    }
    //存储过程
    else if (state == false) {
        GetAllProData(dsname, vtname);
    }
    boolCheck = true;
}

/*2014-02-20  COKE
* 添加节点
* */
function CreateNewNode() {
    $("#SetDataSetGroup").empty();
    //添加节点
    var ArryList = $("#DatasetsManage").find('li[isfolder="true"]');
    var dataIn = [];
    var Listdata = null;
    var temp = "";
    for (var s = 0, len = ArryList.length; s < len; s++) {
        var em = {
            "data": { title: $(ArryList[s].children[0]).attr("title") },
            'attr': { title: $(ArryList[s].children[0]).attr("title"), ID: $(ArryList[s]).attr("id") },
            "metadata": { id: $(ArryList[s]).attr("id"), type: 'commonLib' },
            children: []
        }
        dataIn.push(em);
    }
    if (dataIn.length < 0) { return; }
    $("#SetDataSetGroup").jstree({
        json_data: { data: dataIn },
        plugins: ["themes", "json_data", "ui"]
    }).bind("select_node.jstree", function (event, data1) {
        $("#GroupNameID").val(data1.rslt.obj.attr("id")); //存放组别id；
        data1.rslt.obj.children(2).eq(2).remove(); //移除子节点
        if (temp != data1.rslt.obj.attr("id")) {
            temp = data1.rslt.obj.attr("id");
            Agi.DatasetsManager.DSAllDataSet_SG({ perid: temp }, function (result) {
                if (result.result != "true") { return; }
                Listdata = result.Data.groups;
                if (Listdata.length < 1) { return; }
                var position = 'inside';
                var parent = $('#SetDataSetGroup').jstree('get_selected');
                for (var s = 0, len = Listdata.length; s < len; s++) {
                    var em = {
                        "data": { title: Listdata[s].ID },
                        'attr': { title: Listdata[s].id, ID: Listdata[s].path },
                        "metadata": { id: Listdata[s].path, type: 'commonLib' }
                    }
                    data1.inst.create_node(parent, position, em, false, false);
                }
                data1.inst.open_node();
                position = parent = null;
            })
        } else {
            if (Listdata.length < 1) { return; }
            var position = 'inside';
            var parent = $('#SetDataSetGroup').jstree('get_selected');
            for (var s = 0, len = Listdata.length; s < len; s++) {
                var em = {
                    "data": { title: Listdata[s].ID },
                    'attr': { title: Listdata[s].id, ID: Listdata[s].path },
                    "metadata": { id: Listdata[s].path, type: 'commonLib' }
                }
                data1.inst.create_node(parent, position, em, false, false);
            }
            data1.inst.open_node();
            position = parent = null;
        }

    }).delegate("a", "click", function (event, data) {
        event.preventDefault();
    }).bind("loaded.jstree", function (e, data) { })
    ArryList = dataIn = null;
}
//编辑DataSet页面
function EditDataSets(dsname) {
    ShowOperationData();
    IsSaveOrUpdate = "update";
    $("#BottomRightText").text("Dataset 编辑");
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='dsTabPage'><div id='dstopall'><div id='dstop1'>" +
        "<div class='newdatastitle'>Dataset 基本信息</div>" +
    //20130730 倪飘 20130723 首自信qpc项目接口参数更改
        "<div class='datasetbasepanel' style='visibility:hidden;height:0px;line-height:0px;'><label style='margin-left: 40px;'>类型：</label><input type='text' id='dsvttype' class='ControlProTextSty'style='width:280px;' maxlength='10' ischeck='true'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 40px;'>名称：</label><input type='text' id='dsetname' class='ControlProTextSty'style='width:280px;' maxlength='30' ischeck='true'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 40px;'>备注：</label><textarea style='height:50px;width:275px;resize:none;' id='dsetmemeo' class='ControlProTextSty' maxlength='100' ischeck='true'></textarea></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 25px;'> 数据源：</label><input type='text' id='dsetdsource' style='width:280px;'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 25px;'> 虚拟表：</label><input type='text' id='dsetvtable' style='width:280px;'/></div>" +
        "<div class='datasetbasepanel'><label style='margin-left: 15px;'>默认控件：</label><select id='dsetdcontrol' style='width:285px;'></select></div>" +

        "<div class='datasetbasepanel'><label style='margin-left: 25px;'>组别：</label>" +
        "<div id='SetDataSetGroup' class='jstree jstree-1 jstree-default jstree-focused' style='height:50px; width:280px; text-align:left;overflow-y: scroll;'></div>" +
        "<input type='hidden'  id='GroupNameID' value='0'></div>" +

        "</div><div id='dstop2'><div class='newdatastitle'>列 信 息</div><div class='calccloum'><input type='button' id='btnExpression' value='添加计算列' class='btnclass'/><input type='button' id='btnCheck' value='列显示全选' class='btnclass'/><input type='button' id='btnUp' value='上移' class='btnclass'  /><input type='button' id='btnDown' value='下移'  class='btnclass' />" +
        "</div><div id='gridone' class='dsdridsty'></div></div><div id='dstop3'><div class='newdatastitle'>列 排 序 </div><div class='opcloum'>" +
        "</div><div id='gridtwo' class='dsdridsty'>" +
        "</div></div><div id='dstop4'><div class='newdatastitle'>预     览</div><div class='previewcloum'><input type='button' id='btnView' value='预览' class='btnclass'/>" +
        "<input id='DataSetSave'  class='btnclasssty btnclass' type='button' value='保    存'/><input id='DataGetSql'  class='btnclass' type='button' value='SQL语句' style='display:none;'/></div><div id='gridView' class='dsdridsty'></div>" +
        "</div></div><div id='dsbtmall'><div id='dsbtm1'>基本信息</div><div id='dsbtm2'>列信息</div><div id='dsbtm3'>列排序</div>" +
        "<div id='dsbtm4'>预   览</div></div></div>");
    $("#DataSetSave").attr("disabled", true);
    $('#DataSetSave').removeClass("btnclass");
    $.get("xml/ControlConfig.xml", function (data) {
        var js = JSON.parse(Agi.Utility.xml2json($(data).find('Controls')[0], ""));

        var controlType = js.Controls.Group;
        $.each(controlType, function (i, val) {
            if (val["@Name"] != "实时数据") {
                if (Object.prototype.toString.call(val.Control) === "[object Array]") {
                    $.each(val.Control, function (i, val1) {
                        //20130118 倪飘 解决Datasets-新建datasets-控件不支持实体数据，建议新建datasets时，在控件下拉列表不要显示问题
                        if (val.Control[i]["@ControlType"] === "DropDownList" || val.Control[i]["@ControlType"] === "MultiSelect" || val.Control[i]["@ControlType"] === "Label" ||
                            val.Control[i]["@ControlType"] === "AssociativeInputBox" ||
                            val.Control[i]["@ControlType"] === "DataGrid" || val.Control[i]["@ControlType"] === "BasicChart" || val.Control[i]["@ControlType"] === "DashboardChart" ||
                            val.Control[i]["@ControlType"] === "DashboardChart1" || val.Control[i]["@ControlType"] === "ThermometerChart" || val.Control[i]["@ControlType"] === "LEDChart" ||
                            val.Control[i]["@ControlType"] === "NewCheckBox" || val.Control[i]["@ControlType"] === "RadioButton" || val.Control[i]["@ControlType"] === "BubbleChart" ||
                            val.Control[i]["@ControlType"] === "WaterfallChart" || val.Control[i]["@ControlType"] === "PieChart" || val.Control[i]["@ControlType"] === "DataChart" ||
                           val.Control[i]["@ControlType"] === "HeatMapChart" || val.Control[i]["@ControlType"] === "KPIChart") {
                            $("#dsetdcontrol").append("<option value='" + val.Control[i]["@ControlType"] + "'>" + val.Control[i]["@ControlType"] + "</option>");
                        }
                    })
                }
                else {
                    //20130118 倪飘 解决Datasets-新建datasets-控件不支持实体数据，建议新建datasets时，在控件下拉列表不要显示问题
                    if (controlType.Control[i]["@ControlType"] === "DropDownList" || controlType.Control[i]["@ControlType"] === "MultiSelect" || controlType.Control[i]["@ControlType"] === "Label" ||
                        controlType.Control[i]["@ControlType"] === "AssociativeInputBox" ||
                        controlType.Control[i]["@ControlType"] === "DataGrid" || controlType.Control[i]["@ControlType"] === "BasicChart" || controlType.Control[i]["@ControlType"] === "DashboardChart" ||
                        controlType.Control[i]["@ControlType"] === "DashboardChart1" || controlType.Control[i]["@ControlType"] === "ThermometerChart" || controlType.Control[i]["@ControlType"] === "LEDChart" ||
                        controlType.Control[i]["@ControlType"] === "NewCheckBox" || controlType.Control[i]["@ControlType"] === "RadioButton" || controlType.Control[i]["@ControlType"] === "BubbleChart" ||
                        controlType.Control[i]["@ControlType"] === "WaterfallChart" || controlType.Control[i]["@ControlType"] === "PieChart" || controlType.Control[i]["@ControlType"] === "DataChart" ||
                       controlType.Control[i]["@ControlType"] === "HeatMapChart" || controlType.Control[i]["@ControlType"] === "KPIChart") {
                        $("#dsetdcontrol").append("<option value='" + controlType[i].Control["@ControlType"] + "'>" + controlType[i].Control["@ControlType"] + "</option>");
                    }
                }
            }
        });
    });

    //2014-02-20  COKE 添加节点
    CreateNewNode();

    //绑定需要编辑的DataSet的数据
    EditDatasetsFun(dsname);
}

function BindNameData(dataNames) {
    //debugger;
    $("#grid1").kendoGrid({
        dataSource: {
            data: dataNames,
            pageSize: 3
        },
        change: onChange,
        height: 160,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        columns: [
            {
                field: "Structuretype",
                width: 90,
                title: "结构类型"
            },
            {
                field: "TablesName",
                width: 90,
                title: "表名"
            },
            {
                field: "Operating",
                width: 50,
                title: "操作"
            }
        ]
    });
}
function BindColumnsData(dataColumns) {
    $("#grid2").html("");
    $("#grid2").kendoGrid({
        dataSource: {
            data: dataColumns,
            pageSize: 5
        },
        height: 230,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        columns: [
            {
                field: "TName",
                width: 90,
                title: "表名"
            },
            {
                field: "LName",
                width: 90,
                title: "列名"
            },
            {
                field: "DType",
                width: 50,
                title: "数据类型"
            }
        //        , {
        //            field: "Remark",
        //            width: 50,
        //            title: "说明"
        //        }
        ]
    });
}

function onChange(arg) {
    var selected = $.map(this.select(), function (item) {
        return $(item).text();
    });
    var value = selected.join(", ");
    //表名
    NameId = value.split(" ")[1];
    //20130715 倪飘 解决bug，存储过程清单中列名展示框不需要显示
    var Type = value.split(" ")[0];
    if (Type != "Procedures") {
        GetColumnsByID(NameId, "Grid2");
    }
}

//20121225 14:34 zhangpeng 解决了全选/反选 选中状态 残留 问题 （bug： AgiVis综合展示 ZHZS-134）
function onDataBound() {
    var chkSelectAll = $("#selectAll");
    chkSelectAll.attr("Checked", false);
}

function ShowDetailquery(dbname, type, nameID) {
    ShowOperationData();
    this.DBname = dbname;
    this.Structuretype = type;
    this.NameId = nameID;
    _count = 20;
    $("#BottomRightText").text("视图明细：" + nameID);
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='Detailquery'>" +
        "<div class='OverT'>" +
        "<div class='box'>" +
        "<div class='tagMenu'><ul class='menu'><li>基本信息</li><li>预览</li></ul></div>" +
        "<div class='content'>" +
        "<div class='layout'><div id='grid3'></div></div>" +
        "<div class='layout'><div class='textinput' id='lab'>最大记录数： <input type='text' id ='txtCount' value ='" + _count + "'/><input type='button' name='btnSelect' onclick='SelectDetail()' value='查 询'  id='btnSelect' /></div><div id='gridSQl'></div></div></div>" +
        "</div></div></div>");
    GetColumnsByID(nameID, "Grid3");
    BingDetailQuery();


}
//公共方法，选项卡
//-----------------------------------------------------------------------------------------------------------------------------
function BingDetailQuery() {
    $("ul.menu li:first-child").addClass("current");
    $("div.content").find("div.layout:not(:first-child)").hide();
    $("div.content div.layout").attr("id", function () {
        return idNumber("No") + $("div.content div.layout").index(this)
    });
    $("ul.menu li").click(function () {
        var c = $("ul.menu li");
        var index = c.index(this);
        var p = idNumber("No");
        show(c, index, p);
    });
}
function show(controlMenu, num, prefix) {
    var content = prefix + num;
    $('#' + content).siblings().hide();
    $('#' + content).show();
    controlMenu.eq(num).addClass("current").siblings().removeClass("current");
}
function idNumber(prefix) {
    var idNum = prefix;
    return idNum;
}
//----------------------------------------------------------------------------------------------------------------------------
//查询方法
function SelectDetail() {
    var _count = $("#txtCount").val();
    GetDetailDataByID(_count);
}
//根据数据源名称 表名/视图名 行数 查询数据
function GetDetailDataByID(_count) {
    //debugger;
    var Columns = [];
    Agi.DCManager.DCGetDataByID(DBname, NameId, _count, function (_result) {
        if (_result.result == "true") {
            var array = _result.Data;
            if (array.length > 0) {
                //20130105 17:06 markeluo 当列名为数字时，字段名加上"_"
                var bolIsColumnIsNumber = false;
                for (var k in array[0]) {
                    if (!isNaN(k)) {
                        bolIsColumnIsNumber = true;
                        Columns.push({
                            field: "_" + k,
                            width: 90,
                            title: "_" + k
                        });
                    }
                    else {
                        Columns.push({
                            field: k,
                            width: 90,
                            title: k
                        });
                    }
                }
                if (bolIsColumnIsNumber) {
                    var DataArrayStr = JSON.stringify(array);
                    var DataArrayRepliceStr = "";
                    var DataArrayReplicereg = null;
                    for (var i = 0; i < Columns.length; i++) {
                        DataArrayRepliceStr = Columns[i].field.substr(1, Columns[i].field.length - 1);
                        DataArrayReplicereg = new RegExp(DataArrayRepliceStr + "\":", "g"); //创建正则RegExp对象
                        DataArrayStr = DataArrayStr.replace(DataArrayReplicereg, Columns[i].field + "\":");
                    }
                    DataArrayRepliceStr = DataArrayReplicereg = null;
                    array = JSON.parse(DataArrayStr);
                }
                BindSQLData(array, Columns);
            }
            else {
                $("#gridSQl").html("");
                AgiCommonDialogBox.Alert("数据为空！", null);
            }
        } else {
            //  AgiCommonDialogBox.Alert('未查询到任何数据!');
            AgiCommonDialogBox.Alert('数据为空！'); //修改Excel数据弹出框不一致
        }
    });
}
//绑定数据
function BindSQLData(detailData, columns) {
    $("#gridSQl").html("");
    $("#gridSQl").kendoGrid({
        dataSource: {
            data: detailData,
            pageSize: 10
        },
        height: 350,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        columns: columns
    });
}
function BindDetailsColumn(Columndata) {
    $("#grid3").kendoGrid({
        dataSource: {
            data: Columndata,
            pageSize: 10
        },
        height: 350,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: true,
        columns: [
            {
                field: "TName",
                width: 90,
                title: "表名"
            },
            {
                field: "LName",
                width: 90,
                title: "列名"
            },
            {
                field: "DType",
                width: 50,
                title: "数据类型"
            }
        //        , {
        //            field: "Remark",
        //            width: 50,
        //            title: "说明"
        //        }
        ]
    });
}


//实时数据源新建面板
function AddRTDBPanel() {
    ShowOperationData();
    $("#BottomRightText").text("新建实时数据源");
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='NewRTDBPage'><div class='newdatastitle'> 新建实时数据源 </div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>实时数据源名称：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='RTDBName' maxlength='10' ischeck='true'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>实时数据源类型：</label></div><div class='innerRight'><select class='textSty' id='RTDBType'>" +
            "<option>请选择</option><option>IP21</option><option>AGILOR</option><option>RTBASE</option><option>PA</option><option>INSQL</option></select></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>服   务    IP：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='RTDBIP'  maxlength='15' ischeck='false'/></div></div>" +
        "<div id='InSqlDiv' style='display:none;'>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>账号：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='Account'  maxlength='30' ischeck='false'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>密码：</label></div><div class='innerRight'><input type='password' class='textSty ControlProTextSty' id='password'  maxlength='30' ischeck='false'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>数据库名称：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='dbname'  maxlength='15' ischeck='true'/></div></div>" +
        "</div>" +
        "<div id='PortDiv'><div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>端口：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='RTDBPort' maxlength='10' ischeck='false'/></div></div></div>" +
        "<div class='OutDivd'><input type='button' class='RTPopupBtn' id='NewRTDBSaveBtn' value='保       存' /></div></div>");

}

//实时数据源编辑面板
function UpdateRTDBPanel() {
    ShowOperationData();
    $("#BottomRightText").text("编辑实时数据源");
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='NewRTDBPage'><div class='newdatastitle'> 编辑实时数据源 </div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>实时数据源名称：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='RTDBName' maxlength='10' ischeck='true'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>实时数据源类型：</label></div><div class='innerRight'><select class='textSty' id='RTDBType'>" +
         "<option>请选择</option><option>IP21</option><option>AGILOR</option><option>RTBASE</option><option>PA</option><option>INSQL</option></select></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>服   务    IP：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='RTDBIP' maxlength='15' ischeck='false'/></div></div>" +
        "<div id='InSqlDiv' style='display:none;'>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>账号：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='Account' maxlength='30' ischeck='false'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>密码：</label></div><div class='innerRight'><input type='password' class='textSty ControlProTextSty' id='password' maxlength='30' ischeck='false'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>数据库名称：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='dbname' maxlength='15' ischeck='true'/></div></div>" +
        "</div>" +
        "<div id='PortDiv'><div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>端口：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='RTDBPort'  maxlength='10' ischeck='false'/></div></div></div>" +
        "<div class='OutDivd'><input type='button' class='RTPopupBtn' id='EditRTDBSaveBtn' value='修       改' /></div></div>");
}

//Group新建面板
function AddGroupanel() {
    ShowOperationData();

    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='NewRTDBPage'><div class='newdatastitle'> 新建分组 </div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>实时数据源：</label></div><div class='innerRight'><select  class='textSty' id='Grouprtdb'></select></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>分组名：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='GroupName' maxlength='10' ischeck='true'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>父级编号：</label></div><div class='innerRight'><input type='text'  class='textSty ControlProTextSty' id='GroupParent' maxlength='10' ischeck='false'/></div></div>" +
    //            "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>分组类型：</label></div><div class='innerRight'><select class='textSty' id='GroupType' ><option>请选择</option><option>0</option><option>1</option><option>3</option></select></div></div>" +
        "<div class='OutDivd'><input type='button' class='RTPopupBtn' id='NewGroupSaveBtn' value='保       存' /></div></div>");

}

//Group编辑面板
function UpdateGroupPanel() {
    ShowOperationData();

    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div id='NewRTDBPage'><div class='newdatastitle'> 编辑分组 </div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>实时数据源：</label></div><div class='innerRight'><select  class='textSty' id='Grouprtdb'></select></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>分组名：</label></div><div class='innerRight'><input type='text' class='textSty ControlProTextSty' id='GroupName'  maxlength='10' ischeck='true'/></div></div>" +
        "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>父级编号：</label></div><div class='innerRight'><input type='text'  class='textSty ControlProTextSty' id='GroupParent' maxlength='10' ischeck='false'/></div></div>" +
        "<input type='text' id='HiddenGroupID'/>" +
    //            "<div class='OutDivd'><div class='innerLeft'><label class='RTlabelSty'>分组类型：</label></div><div class='innerRight'><select class='textSty' id='GroupType' ><option>请选择</option><option>0</option><option>1</option><option>3</option></select></div></div>" +
        "<div class='OutDivd'><input type='button' class='RTPopupBtn' id='EditGroupSaveBtn' value='修       改' /></div></div>");
    $("#HiddenGroupID").hide();
}


/*版本管理*/
function ShowVersionInfo() {
    ShowOperationData();
    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("" +
        "<div class='VersionInfoManageShell'>" +
        "<div class='OutDivd'>" +
    //        "<div class='ShowTreeDivShell' id='ShowTreeDiv'></div>"+
        "<div class='ShowTableDivShell'><div id='ShowVersionTable'></div>" +
        "<div class='ShowBtnDivShell'><input type='button' id='ConfirmBtn' value='确定' class=''/></div>" +
        "</div>" +
        "</div>" +
        "</div>");
    // VersionTreeFileInfo();//树的数据
    // VersionzTreeView();//展示树
    // VersionPageColumnsData("");//版本页面信息
}

//获取版本编号的文件夹
var footVersion = "";
var isFileParent = false;
function VersionTreeFileInfo() {
    Agi.DCManager.FMGetFileByParent("PageManager", "11", function (_result) {
        if (_result.result == "true") {
            if (_result.data.length > 0) {
                var VersionFile = _result.data;
                if (VersionFile != null) {
                    footVersion = "[";
                    $.each(VersionFile, function (i, val) {
                        if (VersionFile[i].isFile == "false") {   //false为文件夹 true为文件
                            var pangename = VersionFile[i].name;
                            //pangename = pangename.substring(0,pangename.length-4);
                            footVersion += "{id:" + VersionFile[i].ID + ",pId:-1,name:'" + pangename + "',open:false,isParent:" + isFileParent + "},";
                        }
                    });
                    footVersion = footVersion.substring(0, footVersion.length - 1);
                    footVersion += "]";
                }
                // $(".ShowTreeDivShell").append("<div class='zTreeDemoBackground'> <ul id='VersionFileTree' class='tree'></ul></div></ul>");
                $("#ShowTreeDiv").append("<div class='zTreeDemoBackground'> <ul id='treeDemo' class='tree'></ul></div></ul>");
            } else {
                AgiCommonDialogBox.Alert(_result.message, null);
                return;
            }
        }
        VersionzTreeView();
    });
}
function VersionzTreeView() {
    var VersionzTreeObj;
    var treeNode = eval(footVersion);
    var setting = {
        isSimpleData: true,
        treeNodeKey: "id",
        treeNodeParentKey: "pId",
        showLine: true,
        expandSpeed: false,
        /* checkable : true,*/
        root: {
            isRoot: true,
            nodes: []
        },
        /*  check: {
        //enable: true,
        */
        /*chkStyle:"checkbox",*//*
         chkboxType: { "Y": "Ps", "N": "Ps" } //checkbox父子关联效果
         },*/
        callback: {
            click: zTreeOnClick
        }
    };
    //alert(treeNode);
    VersionzTreeObj = ($("#treeDemo").zTree(setting, treeNode));


    // alert(zTreeObj);
    function zTreeOnChange(event, treeId, treeNode) {
    }

    var ClickCount = 0;

    function zTreeOnClick(event, treeId, treeNode) {
        VersionPageName(treeNode.name);

        /* alert(event);
        alert(treeId);
        alert("找到节点信息:id=" + treeNode.id + ", name=" + treeNode.name + ",RtdbID="+treeNode.RtdbID+", isParent=" + treeNode.isParent);
        // if(treeNode.open == false){
        if(treeNode.children==null){
        // if(treeNode.nodes=null){
        Agi.GroupManager.RGLoad(treeNode.RtdbID, treeNode.id,function(result){
        var GroupLevel=result.GroupName;
        if(GroupLevel != null){
        var  LevelList = "[";
        $.each(GroupLevel,function(i,val){
        LevelList+="{id:"+GroupLevel[i].GroupID+",pId:"+ treeNode.id+",name:'"+GroupLevel[i].GroupName+"',RtdbID:"+GroupLevel[i].RtdbID+",open:false,isParent:"+treeNode.isParent+"},";
        });
        LevelList=LevelList.substring(0,LevelList.length-1);
        LevelList+="]";
        alert(LevelList);
        }
        var newNode = eval(LevelList);
        var srcNode = zTreeObj.getSelectedNode();
        zTreeObj.addNodes(srcNode, newNode);
        });
        }  else {
        return;
        }*/

    }
}
function VersionPageName(_pageName) {//查找单条点位信息  Agi.DCManager.VSGetversionsBypageName
    $("#BottomRightText").text("版本管理");
    var VersionPageColumns = [];
    Agi.DCManager.VSGetversionsBypageName(_pageName, IsNewSPCPage, function (_result) {
        if (_result.result == "true") {
            var array = _result.data;
            if (array.length > 0) {
                for (var i = 0; i < array.length; i++) {
                    var vname = array[i].VName,
                        vId = array[i].VID,
                        vdesription = array[i].VDescription,
                        vcreatedata = array[i].VCreateData,
                        vstate = array[i].VState,
                        vpuddate = array[i].VPudDate,
                        vcreateuser = array[i].VCreateUser,
                        vcreateaim = array[i].VCreateAim,
                        vsummary = array[i].VSummary;
                    if (IsNewSPCPage) {
                        VersionPageColumns.push({
                            vname: vname + " ",
                            vId: vId + " ",
                            vdesription: vdesription + " ",
                            vcreatedata: vcreatedata + " ",
                            vstate: vstate + " ",
                            vcreateuser: vcreateuser + " ",
                            vcreateaim: vcreateaim + " ",
                            vsummary: vsummary + " "
                        });
                    } else {
                        VersionPageColumns.push({
                            vname: vname + " ",
                            vId: vId + " ",
                            vdesription: vdesription + " ",
                            vcreatedata: vcreatedata + " ",
                            vstate: vstate + " ",
                            vpuddate: vpuddate + " "
                        });
                    }
                }
            }
        } else {
            //AgiCommonDialogBox.Alert(_result.message, null); //（每次删除版本都需要查询页面版本列表，如果删除完毕则每次会提示版本不存在的错误）
        }
        VersionPageColumnsData(VersionPageColumns);
    });
}
function VersionPageColumnsData(dataColumns) { //用表格的形式展示点位数据
    $("#ShowVersionTable").html("");
    $("#ShowVersionTable").kendoGrid({
        dataSource: {
            data: dataColumns
        },
        height: 440,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: false,
        filterable: false,
        columns: [
            {
                field: "vname",
                width: 80,
                title: "版本名称"
            },
            {
                field: "vId",
                width: 30,
                title: "版本号"
            },
            {
                field: "vdesription",
                width: 80,
                title: "描述"
            },
            {
                field: "vcreatedata",
                width: 100,
                title: "创建时间"
            },
            {
                field: "vstate",
                width: 40,
                title: "状态"
            },
            {
                field: "vpuddate",
                width: 100,
                title: "发布时间"
            },
            {
                field: "isPublishVersion",
                sortable: false, //20130115 倪飘 解决选择一个版本后点击确定发布，再点击别的版本名称，先选中的状态消失了问题
                template: '<input type="radio" name="PublishVersionRadio" class="PublishVersionRadio" value="0" style="text-align: center" />', // id="isPublishVersion"
                width: 40,
                title: "是否发布"

            }
        ]
    });
    var gridobj = $("#ShowVersionTable").data("kendoGrid");
    // gridobj.select( gridobj.tbody.find("tr:")[]);
    var ThisShowVersionTabletrs = $("#ShowVersionTable").find("tbody>tr");
    var ThisShowVersionTabletrtdtemp = null;
    for (var n = 0; n < ThisShowVersionTabletrs.length; n++) {
        ThisShowVersionTabletrtdtemp = $(ThisShowVersionTabletrs[n]).find("td");
        var isTrue = ThisShowVersionTabletrtdtemp[4].innerText.toLowerCase();
        if (isTrue == "true") {
            gridobj.select(gridobj.tbody.find("tr")[n]);
            pangName = ThisShowVersionTabletrtdtemp[0].innerText; //版本名称
            versionnum = ThisShowVersionTabletrtdtemp[1].innerText; //版本号
            $("#ConfirmBtn").attr("disabled", false); //21030222 yangyu  修改确定按钮点击跳转
            $(ThisShowVersionTabletrs[n]).find(".PublishVersionRadio").attr("checked", "checked")
        } else { $("#ConfirmBtn").attr("disabled", true); } //加21030222 yangyu  修改确定按钮点击跳转
        $("#ConfirmBtn").css("background-image", "none")
    }
    // 21030222 yangyu  修改确定按钮点击跳转
    if (ThisShowVersionTabletrs.length === 0) {
        $("#ConfirmBtn").attr("disabled", true);
        $("#ConfirmBtn").css("background-image", "none")
    }
    ThisShowVersionTabletrs = ThisShowVersionTabletrtdtemp = null; //DOM查询优化,临时变量清空
}
/*$("input[name=pay]").change(function(){
alert("13232");
});*/
var pangName = "";
var versionnum = "";
$("#ShowVersionTable").live('click', function (obj) {  //.find(".PublishVersionRadio")
    pangName = "";
    versionnum = "";
    var Versioninfo = $("#ShowVersionTable").data("kendoGrid");

    var ThisShowVersionTabletbodytrs = $("#ShowVersionTable").find("tbody>tr");
    if (ThisShowVersionTabletbodytrs.length > 0) {
        var NocheckedindexValue = [];
        var boolChecked;
        var checkedInsex;
        for (var i = 0; i < ThisShowVersionTabletbodytrs.length; i++) {//获得显示值的index
            NocheckedindexValue.push(i);
        }
        var sSelectTr = Versioninfo.select().text()//获得选中行的信息
        var nFristIndex = sSelectTr.indexOf(" "); //第一个空格的位置
        var a = sSelectTr.substring(0, nFristIndex + 1);
        a = a.replace(" ", "k");
        var b = sSelectTr.substring(nFristIndex, sSelectTr.length).trim();
        var sNewStr = a + b;
        var nSecondIndex = sNewStr.indexOf(" "); //第二个空格的位
        // alert("新字符串"+sNewStr+"第一个空格"+nFristIndex+"第二个空格"+nSecondIndex);
        var sTr = sSelectTr.substring(nFristIndex, nSecondIndex).trim(); //选中的版本编号
        for (var n = 0; n < ThisShowVersionTabletbodytrs.length; n++) {
            boolChecked = $(ThisShowVersionTabletbodytrs[n]).find(".PublishVersionRadio").attr("checked") == "checked" ? "true" : "false";
            //alert(boolChecked +"   "+ n);
            var versionNum = $(ThisShowVersionTabletbodytrs[n]).find("td")[1].innerText.trim();
            if (boolChecked == "true" && sTr == versionNum) {
                checkedInsex = n;
            }
        }
        for (var x in NocheckedindexValue) { //剔除checked的index
            if (NocheckedindexValue[x] == checkedInsex) {
                NocheckedindexValue.splice(x, 1)
            }
        }
        for (var j = 0; j < NocheckedindexValue.length; j++) { //没有被选中的
            var notValue = NocheckedindexValue[j];
            //alert(notValue);
            //20130115 倪飘 解决选择一个版本后点击确定发布，再点击别的版本名称，先选中的状态消失了问题
            //            $(ThisShowVersionTabletbodytrs[notValue]).find(".PublishVersionRadio").attr("checked", false);
        }
        var tdCell = $(ThisShowVersionTabletbodytrs[checkedInsex]).find("td");
        if (tdCell != null && tdCell.length > 0) {
            pangName = $(ThisShowVersionTabletbodytrs[checkedInsex]).find("td")[0].innerText; //版本名称
            versionnum = $(ThisShowVersionTabletbodytrs[checkedInsex]).find("td")[1].innerText; //版本号
            $("#ConfirmBtn").attr("disabled", false); //21030222 yangyu  修改确定按钮点击跳转
        }
        // alert(pangName+"   "+versionnum);
    }
    ThisShowVersionTabletbodytrs = null; //DOM查询优化,临时变量清空

});

function UpdatePubstate(_pangName, _versionnum) {//修改发布状态-
    if (_pangName != "" && _versionnum != "") {
        Agi.DCManager.VSUpdatePubstate(_pangName, _versionnum, function (_result) {
            if (_result.result == "true") {
                AgiCommonDialogBox.Alert(_result.message);
                VersionPageName(pangName);
                pangName = "";
                versionnum = "";
            }
        });
    } else {
        //alert("请选择发布版本！");
        AgiCommonDialogBox.Alert("请选择发布版本！");
        return;
    }

}
$("#ConfirmBtn").live('click', function () {
    UpdatePubstate(pangName, versionnum);
});
var jsonScruption; //存放版本描述
function selectLak(_pageName) {//版本名称显示在下拉框中
    var pagenamestr = _pageName;
    if (Agi.WebServiceConfig.Type != ".NET") {
        //20130722 10:19 markeluo 解决页面新建版本后再保存无法获取版本列表问题
        var NameLastindex = workspace.pageName.lastIndexOf("_");
        if (NameLastindex >= 0) {
            pagenamestr = pagenamestr.substring(0, NameLastindex);
        }
        NameLastindex = null;

    }
    Agi.DCManager.VSGetversionsBypageName(pagenamestr, IsNewSPCPage, function (_result) {
        //alert("下拉框判断"+_result.result)
        if (_result.result == "true") {
            var arry = _result.data;
            //alert(arry.length);
            var sScruption = "[";
            if (arry.length > 0) {
                for (var i = 0; i < arry.length; i++) {
                    $("#VersionSelect").append("<option value='" + arry[i].VID + "'>" + pagenamestr + "_" + arry[i].VID + "</option>");
                    //markeluo 兼容JAVA
                    if (arry[i].VDescription) { } else {
                        arry[i].VDescription = "";
                    }
                    sScruption += "{VID:'" + arry[i].VID + "',VDeScription:'" + arry[i].VDescription + "',VCreateUser:'" + arry[i].VCreateUser + "',VCreateAim:'" + arry[i].VCreateAim + "',VSummary:'" + arry[i].VSummary + "'},";
                }
                sScruption = sScruption.substring(0, sScruption.length - 1);
                sScruption += "]";
                jsonScruption = eval(sScruption);
            }
        }
        var num = _pageName.substring(_pageName.lastIndexOf("_") + 1, _pageName.length); //编辑的版本是第几个版本
        var arrValue = [];
        var f = $("#VersionSelect")[0].options;
        for (var i = 0; i < f.length; i++) {     //$("#VersionSelect").options.length
            arrValue.push(f[i].value);
        }
        for (var n in arrValue) {
            if (arrValue[n] == num) {
                $("#VersionSelect").val(arrValue[n]); //显示版本号
                if (arrValue[n] == jsonScruption[n - 2].VID) {
                    if (IsNewSPCPage) {
                        $("#InputDescription").val(""); //备注&总结
                        $("#CreatePageAuth").val(""); //创建人
                        $("#CreatePageGoal").val(""); //创建目的
                        if (jsonScruption[n - 2].VSummary != null) {
                            $("#InputDescription").val(jsonScruption[n - 2].VSummary); //备注&总结
                        }
                        if (jsonScruption[n - 2].VCreateUser != null) {//
                            $("#CreatePageAuth").val(jsonScruption[n - 2].VCreateUser); //创建人
                        }
                        if (jsonScruption[n - 2].VCreateAim != null) {
                            $("#CreatePageGoal").val(jsonScruption[n - 2].VCreateAim); //创建目的
                        }
                    } else {
                        if (jsonScruption[n - 2].VDeScription != "null") {
                            $("#InputDescription").val(jsonScruption[n - 2].VDeScription); //版本描述
                        } else {
                            $("#InputDescription").val(""); //版本描述
                        }
                    }
                }
            }
        }

    });
}
$("#VersionSelect").live('change', function () {
    var selectoption = $("#VersionSelect").val();
    for (var n = 0; n < jsonScruption.length; n++) {
        if (selectoption == jsonScruption[n].VID) {
            if (jsonScruption[n].VDeScription != "null" && jsonScruption[n].VDeScription != "") {
                $("#InputDescription").val(jsonScruption[n].VDeScription); //版本描述
                $("#InputDescription").attr("Description", $("#InputDescription").val());
            } else {
                $("#InputDescription").val("");
                $("#InputDescription").attr("Description", "");
            }

        }
    }
    if (selectoption === "saveas") {
        $("#InputPageName").attr("readonly", false);
        $("#InputPageName").attr("PageName", $("#InputPageName").val());
        $("#InputDescription").attr("Description", $("#InputDescription").val());
        $("#InputPageName").val("");
        $("#InputDescription").val("");
    }
    //20130521 倪飘 解决bug，新建页面并保存，页面保存窗口说明文本框中输入说明文本，并确定，返回主页面再次编辑该页面，保存页面时选择创建新版本，此时说明文本框中的文本未清空
    else if (selectoption === "") {
        $("#InputDescription").val("");
        $("#InputDescription").attr("Description", "");
        //20130529 倪飘 解决bug，点击页面另存为以后再点击创建新版本，页面名称文本框中文本为空
        //20130531 倪飘 解决bug，新建页面进行保存操作，再次点击保存，此时保存框中页面名称为可编辑状态
        if ($("#InputPageName").val() === "") {
            $("#InputPageName").val($("#InputPageName").attr("PageName"));
        }
        $("#InputPageName").attr("readonly", true);
    }
    else {
        var attrpageName = $("#InputPageName").attr("PageName");
        var attrdescription = $("#InputDescription").attr("Description");
        if (attrpageName != null && attrpageName != "") {
            $("#InputPageName").val(attrpageName);
            $("#InputDescription").val(attrdescription);
        }
        $("#InputPageName").attr('readonly', true);
        attrpageName = attrdescription = null;
    }

    /*释放临时变量*/
    selectoption = null;
});
//页面的复制 粘贴  IIS\JAVAWebService1017\PageManager\小米\小米_1.xml
var sCopyAddress = "";
function pangeCopy(_fileName) {
    var sWebServerAddress = Agi.Edit.workspace.baseServer//webServer地址
    var sFileName = _fileName + ".xml"; //获取点击复制的文件名称
    var sXmlPageManager = "PageManager/"; //webServer中存放Xml文件的文件夹名称
    var sAddress = sWebServerAddress.substring(0, sWebServerAddress.lastIndexOf("/") + 1);
    sCopyAddress = sAddress + sXmlPageManager + sFileName;

    /*释放临时变量*/
    sWebServerAddress = sFileName = sXmlPageManager = sAddress = null;
}
function pangePaste(_fileName) {
    var sWebServerAddress = Agi.Edit.workspace.baseServer//webServer地址
    var sFileName = _fileName + ".xml"; //获取点击复制的文件名称
    var sXmlPageManager = "PageManager/"; //webServer中存放Xml文件的文件夹名称
    var sAddress = sWebServerAddress.substring(0, sWebServerAddress.lastIndexOf("/") + 1);
    sAddress = sAddress + sXmlPageManager + sFileName; //当前文件路径

    //替换文件夹路径
    if (sCopyAddress != "") {
        /*  var f = sCopyAddress.substring(0,sCopyAddress.lastIndexOf("PageManager"))
        var g = f+*/
    }

    /*释放临时变量*/
    sWebServerAddress = sFileName = sXmlPageManager = sAddress = null;
}
//盈科版本合并 图片上传 20121203 16:36 markeluo
//图片上传
function PageSourceUpload() {
    ShowOperationData();
    $("#BottomRightText").text("图片资源");

    $("#BottomRightCenterOthersContentDiv").html("");
    $("#BottomRightCenterOthersContentDiv").html("<div style='width: 100%;height: 100%; background-color:#f0713a;'>图片上传内容</div>");
}
function PageSourceBrowser() {
    ShowOperationData();
    $("#BottomRightText").text("图片资源");

    //$("#BottomRightCenterOthersContentDiv").html("");
    $("#pop_Image_content").height(550);
    $("#pop_Image_content").appendTo($("#BottomRightCenterOthersContentDiv"));
}

//region 20130621 10:44 markeluo DataSet 文件夹管理
//datasets分组添加
function AddDataSetsGroup(_groupInfo, RefreshCallback) {
    var Parentvalue = "";
    if (_groupInfo != null) {
        Parentvalue = _groupInfo.Parent;
    }
    var content = "请输入分组名称！";
    AgiCommonDialogBox.Prompt(content, null, function (flag, newName) {
        if (flag) {

            var txt = /^(\w|[\u4E00-\u9FA5])*$/;
            if (newName == null || newName.length <= 0) {
                AgiCommonDialogBox.Alert("名称不能为空！", null);
            } else if (newName.length > 16) {
                AgiCommonDialogBox.Alert("最多可输入16个字符！", null);
            }
            else if (!txt.test(newName)) {
                AgiCommonDialogBox.Alert("名称不能为特殊字符！", null);
            } else {
                Agi.DatasetsManager.DSNodeAdd({ Name: newName, Parent: Parentvalue }, function (data) {
                    if (data.result == "true") {
                        AgiCommonDialogBox.Alert("添加成功!", null);
                        RefreshCallback();

                    } else {
                        AgiCommonDialogBox.Alert("添加失败!" + data.message, null);
                    }
                });
            }
        } else {
            return;
        }
    });

}
//datasets 分组删除
function DelDataSetsGroup(_groupInfo, RefreshCallback) {
    var content = "确定删除Dataset分组[" + _groupInfo.NodeName + "],及其所有子内容?";
    AgiCommonDialogBox.Confirm(content, null, function (flag) {
        if (flag) {
            Agi.DatasetsManager.DSNodeDel({ "Value": _groupInfo.NodeKey }, function (data) {
                if (data.result == "true") {
                    AgiCommonDialogBox.Alert("删除成功!", null);
                    RefreshCallback();
                } else {
                    AgiCommonDialogBox.Alert("删除失败!" + data.message, null);
                }
            })
        } else {
            return;
        }
    });
}
//编辑分组信息
function EditDataSetsGroup(_groupInfo, RefreshCallback) {
    //_groupInfo.NodeName:分组名称 _groupInfo.NodeKey:分组唯一标识 _groupInfo.Parent:分组父节点标识
    var Parentvalue = "";
    if (_groupInfo != null) {
        Parentvalue = _groupInfo.Parent;
    }
    var content = "请输入新分组名称！";
    AgiCommonDialogBox.Prompt(content, null, function (flag, newName) {
        if (flag) {

            var txt = /^(\w|[\u4E00-\u9FA5])*$/;
            if (newName == null || newName.length <= 0) {
                AgiCommonDialogBox.Alert("名称不能为空！", null);
            } else if (newName.length > 16) {
                AgiCommonDialogBox.Alert("最多可输入16个字符！", null);
            }
            else if (!txt.test(newName)) {
                AgiCommonDialogBox.Alert("名称不能为特殊字符！", null);
            } else if (newName == _groupInfo.Name) {
                AgiCommonDialogBox.Alert("新名称不能和原名称相同！", null);
            } else {
                Agi.DatasetsManager.DSNodeEdit({ OldName: _groupInfo.NodeName, NewName: newName, Parent: Parentvalue, Key: _groupInfo.NodeKey }, function (data) {
                    if (data.result == "true") {
                        AgiCommonDialogBox.Alert("修改成功!", null);
                        RefreshCallback();
                    } else {
                        AgiCommonDialogBox.Alert("修改失败!" + data.message, null);
                    }
                });
            }
        } else {
            return;
        }
    });
}
//endregion
//region 20130622 12:12 markeluo 页面分组文件夹管理
function AddPageGroup(_groupInfo, RefreshCallback) {
    //{NodeName,NodePath,NodeKey}
    var Parentvalue = "";
    if (_groupInfo != null) {
        Parentvalue = _groupInfo.NodeKey;
    }
    var content = "请输入分组名称！";
    AgiCommonDialogBox.Prompt(content, null, function (flag, newName) {
        if (flag) {

            var txt = /^(\w|[\u4E00-\u9FA5])*$/;
            if (newName == null || newName.length <= 0) {
                AgiCommonDialogBox.Alert("名称不能为空！", null);
            } else if (newName.length > 16) {
                AgiCommonDialogBox.Alert("最多可输入16个字符！", null);
            }
            else if (!txt.test(newName)) {
                AgiCommonDialogBox.Alert("名称不能为特殊字符！", null);
            } else {
                Agi.PageGroupManager.AddPageGroup({ Name: newName, Parent: Parentvalue }, function (data) {
                    if (data.result == "true") {
                        AgiCommonDialogBox.Alert("添加成功!", null);
                        RefreshCallback();
                    } else {
                        AgiCommonDialogBox.Alert("添加失败!" + data.message, null);
                    }
                });
            }
        } else {
            return;
        }
    });
}
//编辑页面分组信息
function EditPageGroup(_groupInfo, RefreshCallback) {
    //{NodeName,NodePath,NodeKey}
    var Parentvalue = "";
    if (_groupInfo != null) {
        if (Agi.WebServiceConfig.Type != "JAVA") {
            Parentvalue = _groupInfo.NodePath.substring(0, _groupInfo.NodePath.lastIndexOf("/"));
        }
    }
    var content = "请输入新分组名称！";
    AgiCommonDialogBox.Prompt(content, null, function (flag, newName) {
        if (flag) {

            var txt = /^(\w|[\u4E00-\u9FA5])*$/;
            if (newName == null || newName.length <= 0) {
                AgiCommonDialogBox.Alert("名称不能为空！", null);
            } else if (newName.length > 16) {
                AgiCommonDialogBox.Alert("最多可输入16个字符！", null);
            }
            else if (!txt.test(newName)) {
                AgiCommonDialogBox.Alert("名称不能为特殊字符！", null);
            } else if (newName == _groupInfo.NodeName) {
                AgiCommonDialogBox.Alert("新名称不能和原名称相同！", null);
            } else {
                //OldName:NodeInfo.Name,NewName:NodeInfo.NewName,Parent:NodeInfo.Parent,Key:NodeInfo.Key
                Agi.PageGroupManager.EditPageGroup({ NewName: newName, OldName: _groupInfo.NodeName, Parent: Parentvalue, Key: _groupInfo.NodePath }, function (data) {
                    if (data.result == "true") {
                        AgiCommonDialogBox.Alert("修改成功!", null);
                        RefreshCallback();
                    } else {
                        AgiCommonDialogBox.Alert("添加失败!" + data.message, null);
                    }
                });
            }
        } else {
            return;
        }
    });
}
//删除页面分组信息
function DeletePageGroup(_groupInfo, RefreshCallback) {
    //{NodeName,NodePath,NodeKey}
    var Parentvalue = "";
    if (_groupInfo != null) {
        if (Agi.WebServiceConfig.Type != "JAVA") {
            Parentvalue = _groupInfo.NodePath.substring(0, _groupInfo.NodePath.lastIndexOf("/"));
        }
    }
    var content = "确定删除页面分组[" + _groupInfo.NodeName + "],及其所有子内容?";
    AgiCommonDialogBox.Confirm(content, null, function (flag) {
        if (flag) {
            Agi.PageGroupManager.DeletePageGroup({ "Name": _groupInfo.NodeName, Key: _groupInfo.NodeKey, Parent: Parentvalue }, function (data) {
                if (data.result == "true") {
                    AgiCommonDialogBox.Alert("删除成功!", null);
                    RefreshCallback();
                } else {
                    AgiCommonDialogBox.Alert("删除失败!" + data.message, null);
                }
            })
        } else {
            return;
        }
    });
}
//endregion
