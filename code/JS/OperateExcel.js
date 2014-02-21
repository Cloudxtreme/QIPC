//Excel 数据源
function ExcelDataSourceShowTable(dataColumns){//将获得的Excel数据显示在Tabel中
    $("#ShowExcelTable").html("");
    $("#ShowExcelTable").kendoGrid({
        dataSource: {
            data: dataColumns
        },
        height: 160,
        selectable: "single row",
        groupable: false,
        scrollable: true,
        sortable: true,
        pageable: false,
        filterable: false,
        columns: [{
            field: "tableName",
            width: 80,
            title: "表名"
        }, {
            field: "tableExplain",
            width: 30,
            title: "说明"
        }
        ]
    });
}

(function($){
    window.ExcelDsName = '';
    window.reUpload = false;
    var fileIsOk = false;
    var dialog = null;//窗口对象
    var dbName = null;//标题
    var form = null;
    var OperateExceldata = [];//上传EXCEL数据源

    //数据类型改变事件
    $("#DBType").live('change',function(){
        if($("#DBType").val() == "Excel"){
            $("#OutDivdDataSourcePage").hide();
            $("#NewExeclPage").show();
            ExcelDataSourceShowTable([]);
        }else{
            $("#OutDivdDataSourcePage").show();
            $("#NewExeclPage").hide();
        }
    });

    //获得的Excel数据
    function ExcelData(){
        var dataColumns = [];

        ExcelDataSourceShowTable(dataColumns);
    }

    //点击添加Excel,显示弹出窗体
    $("#addExcel").live('click',function(){
        fileIsOk=false;
        var file=document.querySelector("#file input[type='file']");
        file.value="";
        openDialog();
        dialog.find('#textAddress').val('未选择文件');
        OperateExceldata = [];//清空上一次上传Excel数据
        fileIsOk = false;//清空上一次设置fileIsOK的值。
         var text=document.querySelector("#file input[type='text']");
              file.addEventListener("change",assign,false);
                 function assign(){
                     var str = file.value;
                     var isExcelFile = excelValidate(str);
                     fileIsOk = isExcelFile;
                     if(isExcelFile){
                        str = str.substring(str.lastIndexOf("\\")+1,str.length);
                        text.value=str;
                     }else{
                         AgiCommonDialogBox.Alert('只可以上传Excel 97~2003工作表!');
                         return false;
                     }
                 }

    });

    function excelValidate(fileName){
        var result = false;
        if(fileName && fileName !==''){
            var arr = fileName.split('.');
            var ext = arr[arr.length-1];
            if(ext.trim().toUpperCase() === 'XLS'){
                result =true;
            }
        }
        return result;
        /*清空临时变量*/
        result=null;
    }

    function ExistingExcelTable(dataColumns){//已有的表
        $("#ExistingTabel").html("");
        $("#ExistingTabel").kendoGrid({
            dataSource: {
                data: dataColumns
            },
            height: 120,
            selectable: "single row",
            groupable: false,
            scrollable: true,
            sortable: true,
            pageable: false,
            filterable: false,
            columns: [{
                field: "tableName",
                width: 80,
                title: "表名"
            }, {
                field: "tableExplain",
                width: 30,
                title: "说明"
            }
            ]
        });
    }
    //点击浏览Excel文件地址
    $("#excelAddressBtn").live('click',function(){

        // // 建立一個file的control，它會自帶一個瀏覽button，點擊這個button就可以自己開文件對話框了
        //    var fd = new ActiveXObject("MSComDlg.CommonDialog");
        //    fd.Filter = "*.xlsx"; //过滤文件
        //    fd.FilterIndex = 2;
        //    fd.MaxFileSize = 128;
        //    fd.ShowSave();//這個是儲存的對話框，如果是需要打開的話，就要用fd.ShowOpen();
        //   // document.FrmDataAll.txtPath.value=fd.filename;//fd.filename是用戶選擇的路徑噢
    });

    //点击上传
    $("#upExcelBtn").live('click',function(){
        if(fileIsOk){
            //提交表单
            dialog.find('form')[0].submit();
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
        }else{
            AgiCommonDialogBox.Alert('请先选择上传的Excel文件!');
        }
    });

    //点击确定--已注释
    $("#UpdataExcelBtn").live('click',function(){
        var str = $("#fileAddress").val();
        str = str.substring(str.lastIndexOf("\\")+1,str.length);
        $("#yishangchuanExcelName").val(str);

//        $("#OperateExcelDiv").modal('toggle');
        window.dialogs._OperateExcelDiv.dialog('close');

        /*清空临时变量*/
        str=null;
    });
    //上传的表
    function uploadingExcelTable(dataColumns){
        $("#uploadingTable").html("");
        $("#uploadingTable").kendoGrid({
            dataSource: {
                data: dataColumns
            },
            height:250,
            selectable: "single row",
            groupable: false,
            scrollable: true,
            sortable: true,
            pageable: false,
            filterable: false,
            columns: [
            //    {
            //   template: '&nbsp'+'<input type="checkbox" class="isCheckSheet"/>',
            //    width: 20,
            //    filterable: false,
            //    title: "选择"
            //},
                {
                field: "tableName",
                width: 80,
                title: "表名"
            }, {
                field: "tableExplain",
                width: 30,
                title: "说明"
            }
            ]
        });
    }


    var openDialog = function(){
        //输入验证
        dbName = $('#DBName').val();
        if(!dbName || dbName==''){
            AgiCommonDialogBox.Alert('请填写Excel数据源名称!');
            return;
        }
        //弹出窗口
        //dialog = $("#OperateExcelDiv").modal({ backdrop: false, keyboard: false, show: true });
//        dialog = $("#OperateExcelDiv").modal('toggle');
        dialog = window.dialogs._OperateExcelDiv.dialog('open');
        dialog.find('#ExcelName').text("上传Excle文件");
        dialog.find('input[name="ExcelName"]').val(dbName);


//        $('#OperateExcelDiv').draggable({
//            handle: ".modal-header"
//            //,containment:"#MainFrameDiv"
//        });
        ExistingExcelTable([]);
        uploadingExcelTable([]);


    };

    $(document).ready(function(e){
        if(Agi.WebServiceConfig.Type === ".NET"){
            $('#OperateExcelDiv form:eq(0)').attr('action',Agi.ImgServiceAddress + '/ExcelDsHandler.ashx');
        }else{
            $('#OperateExcelDiv form:eq(0)').attr('action',Agi.UploadExcelAddress);
        }
        //$('#OperateExcelDiv form:eq(0)').attr('action','http://localhost:59708/ExcelDsHandler.ashx');

        $('#excelUploadHideFrame').bind('load',function(e){
//            if(this.contentWindow.document){
//                //上传成功
//                console.log(this.contentWindow.document.body.innerText);
//
//            }else{
//                //上传有待验证
//            }

            window.reUpload = true;
            var str = $("#fileAddress").val();
            str = str.substring(str.lastIndexOf("\\")+1,str.length);
            str = $('input[name="ExcelName"]').val() + '\\' +  str;
            var jsonData = { "fileName": str };
            var jsonString = JSON.stringify(jsonData);
            console.log(jsonString);
            //var data = [];
//            debugger;
            Agi.DCManager.ExcelDataSourceGetAll( "DSExcelGetSheetName", jsonString,  function (result) {
                if(result.result == "true"){
                    OperateExceldata = [];
                    for(var i = 0; i < result.data.length; i++ ){
                        var tableName = result.data[i],
                            tableExplain = result.data[i];
                        if(DBName == ""){};
                        OperateExceldata.push({
                            tableName:tableName+"",
                            tableExplain:tableExplain+""
                        })
                    }
                }else{
                    AgiCommonDialogBox.Alert("EXCEL 数据为空或上传错误！");
                }
                uploadingExcelTable(OperateExceldata);
                //关闭进度条
                $('#progressbar1').hide();
                //20130112 倪飘 解决数据源-关系数据源-新建数据库类型为Flat Files的数据源，上传excel表后上传窗口无法自动关闭问题
                ExcelDataSourceShowTable(OperateExceldata);
//                   $("#OperateExcelDiv").modal('hide');
                window.dialogs._OperateExcelDiv.dialog('close');
            });

        });
        //弹出窗口关闭后的处理
//        $("#OperateExcelDiv").on('hidden',function(e){
//            var dialog = $(this);
//            //alert('窗口已经关闭');
//            dialog.find('#textAddress').val('');
//            var str = $("#fileAddress").val();
//            str = str.substring(str.lastIndexOf("\\")+1,str.length);
//            if(str===""){}else{
//                $("#yishangchuanExcelName").val(str);
//            }
//            //$("#OperateExcelDiv").modal('hide');
//            if(OperateExceldata.length){
//                ExcelDataSourceShowTable(OperateExceldata);
//            }
//        });
        $("#OperateExcelDiv").bind('dialogclose',function(event,ui){
            debugger;
            var dialog = $(this);
            //alert('窗口已经关闭');
            dialog.find('#textAddress').val('');
            var str = $("#fileAddress").val();
            str = str.substring(str.lastIndexOf("\\")+1,str.length);
            if(str===""){}else{
                $("#yishangchuanExcelName").val(str);
            }
            //$("#OperateExcelDiv").modal('hide');
            if(OperateExceldata.length){
                ExcelDataSourceShowTable(OperateExceldata);
            }
        });
    });
})($);
