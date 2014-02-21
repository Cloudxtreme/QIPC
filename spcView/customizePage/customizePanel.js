/**
单值图面板配置
 */
define(function () {
    var panelId = 'customizePropertydialog';
    var tabId = 'customizePropertyTab';
    var self = {};

    var control = null;
    var myCallBack = undefined;
//    var initial = function(){
//
//    };
    var normalLineEvent=function(){
        //加载颜色控件
        $("#topColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#topColor").attr("value",color.toHexString());
            }
        });
        $("#bottomColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#bottomColor").attr("value",color.toHexString());
            }
        });
        //添加和保存标准线
        $("#btnNew").click(function(){
                //清空面板
            $('#name').show();
            $('#groupName').hide();
            $("#topWidth").attr("value","1");
            $("#bottomWidth").attr("value","1");
            $("#topValue1").attr("value","");
            $("#bottomValue1").attr("value","");
            $("#topColor").spectrum("set", '#000');
            $("#bottomColor").spectrum("set", '#000');
        });
        $("#btnSave").click(function(){
            var SelectedItemObj=null;
            if($("#groupName").is(":hidden")){
                //创建对象
                for(var i=0;i<property.standardLine.length;i++){
                    if($("#name").attr('value')==property.standardLine[i].GroupName)
                    {
                        alert('标准线不允许重名！');
                        return;
                    }
                }
            }else{
                var SelValue=$("#groupName").val();
                if(SelValue!=null && SelValue!=""){
                    SelectedItemObj=SelValue;
                }
            }
            $('#name').hide();
            $('#groupName').show();
                var line={
                    GroupName:$("#name").attr('value'),
                    MaxSize:$("#topWidth").attr('value'),
                    MaxColor:$("#topColor").attr('value')==""?"#000":$("#topColor").attr('value'),
                    MaxValueType:$("#topInstall option:selected").val(),
                    MaxValue:$("#topInstall option:selected").text()=="固定值"?$("#topValue1").val():$("#topValue option:selected").text(),
                    MinSize:$("#bottomWidth").attr('value'),
                    MinColor:$("#bottomColor").attr('value')==""?"#000":$("#bottomColor").attr('value'),
                    MinValueType:$("#bottomInstall option:selected").val(),
                    MinValue:$("#bottomInstall option:selected").text()=="固定值"?$("#bottomValue1").val():$("#bottomValue option:selected").text()

                };
            //添加到数组
            if(SelValue!=null){
                line.GroupName=SelValue;
                for(var i=0;i<property.standardLine.length;i++){
                    if(property.standardLine[i].GroupName==SelValue){
                        property.standardLine[i]=line;
                    }
                }
            }else{
                if(property.standardLine.length>=2){
                    property.standardLine.push(line);
                    property.standardLine.shift();
                }
                else{
                    property.standardLine.push(line);
                }
            }
            var name = $("#groupName");
            name.empty();
            for(var i=0;i<property.standardLine.length;i++) {
                var option ="<option value='"+property.standardLine[i].GroupName+"'>"+property.standardLine[i].GroupName+"</option>"
                name.append(option);
            }
            if(property.standardLine[1]!=null){
                $("#groupName").find("option[value='"+property.standardLine[1].GroupName+"']").attr("selected",true);
            }
            alert("保存成功！");
        });
        $('#btnDelete').click(function(){
            if($('#groupName').css('display')!="none"){
                var index=-1;
                for(var i=0;i<property.standardLine.length;i++){
                    if($('#groupName option:selected').text()==property.standardLine[i].GroupName)
                    {
                            index=i;break;
                    }
                }
                 property.standardLine.splice(index,1);
                var name = $("#groupName");
                name.empty();
                for(var i=0;i<property.standardLine.length;i++) {
                    var option ="<option value='"+property.standardLine[i].GroupName+"'>"+property.standardLine[i].GroupName+"</option>"
                    name.append(option);
                }
                if(property.standardLine.length==0)
                {
                    $('#groupName').hide();
                    $('#name').show();
                    $('#name').val('');
                }
                groupNameChange();
            }
            else{
                alert('请先选择要删除的标准线！');
            }
        });
        $("#topInstall").change(function(){
            if( $("#topInstall option:selected").text()=="固定值"){
                $('#topValue1').show();
                $('#topValue').hide();
            }
            else if($("#topInstall option:selected").text()=="数据列"){
                $('#topValue1').hide();
                $('#topValue').show();
            }
        });
        $("#bottomInstall").change(function(){
            if( $("#bottomInstall option:selected").text()=="固定值"){
                $('#bottomValue1').show();
                $('#bottomValue').hide();
            }
            else if($("#bottomInstall option:selected").text()=="数据列"){
                $('#bottomValue1').hide();
                $('#bottomValue').show();
            }
        });
        $("#groupName").change(function(){
            debugger;
            groupNameChange();
        });
    }
    var groupNameChange=function(){
        for(var i=0;i<property.standardLine.length;i++)
        {
            if($("#groupName  option:selected").text()==property.standardLine[i].GroupName){
                $('#topWidth').attr('value',property.standardLine[i].MaxSize);
                $("#topInstall").find("option[value='"+property.standardLine[i].MaxValueType+"']").attr("selected",true);
                $('#topColor').spectrum("set", property.standardLine[i].MaxColor);
                if( $("#topInstall option:selected").text()=="固定值"){
                    $('#topValue1').show();
                    $('#topValue').hide();
                    $('#topValue1').val(property.standardLine[i].MaxValue);
                }
                else if($("#topInstall option:selected").text()=="数据列"){
                    $('#topValue1').hide();
                    $('#topValue').show();
                    $("#topValue").find("option[value='"+property.standardLine[i].MaxValue+"']").attr("selected",true);
                }
                $('#bottomWidth').attr('value',property.standardLine[i].MinSize);
                $("#bottomInstall").find("option[value='"+property.standardLine[i].MinValueType+"']").attr("selected",true);
                $('#bottomColor').spectrum("set", property.standardLine[i].MinColor);
                if( $("#bottomInstall option:selected").text()=="固定值"){
                    $('#bottomValue1').show();
                    $('#bottomValue').hide();
                    $('#bottomValue1').val(property.standardLine[i].MinValue);
                }
                else if($("#bottomInstall option:selected").text()=="数据列"){
                    $('#bottomValue1').hide();
                    $('#bottomValue').show();
                    $("#bottomValue").find("option[value='"+property.standardLine[i].MinValue+"']").attr("selected",true);
                }
            }
        }
    }
    var dataLineEvent=function(){
        $("#dataColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#dataColor").attr("value",color.toHexString());
            }
        });
        $("#markerColor").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#markerColor").attr("value",color.toHexString());
            }
        });

    }
    var ruleEvent=function(){
        $("#color1").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color1").attr("value",color.toHexString());
            }
        });
        $("#color2").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color2").attr("value",color.toHexString());
            }
        });
        $("#color3").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color3").attr("value",color.toHexString());
            }
        });
        $("#color4").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color4").attr("value",color.toHexString());
            }
        });
        $("#color5").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color5").attr("value",color.toHexString());
            }
        });
        $("#color6").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color6").attr("value",color.toHexString());
            }
        });
        $("#color7").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color7").attr("value",color.toHexString());
            }
        });
        $("#color8").spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
                $("#color8").attr("value",color.toHexString());
            }
        });
        $("#compareColumns").change(function(){
            if($(this).children('option:selected').val()==0)
            {
                $("#dataValue").css("display","block");
                $("#dataColumns").css("display","none");
            }
            else if($(this).children('option:selected').val()==1){
                $("#dataValue").css("display","none");
                $("#dataColumns").css("display","block");
            }
        });
        $("#filterSave").click(function(){
                var data={
                    filterColumns:$("#filterColumns").val(),
                    filterRule:$("#filterRule").val(),
                    compareColumns:$("#compareColumns").val(),
                    dataValue:$("#compareColumns").val()==0?$("#dataValue").val():$("#dataColumns").val()
                }
                if(data.compareColumns==0){
                   if(data.dataValue==""){
                       data=null;
                   }
                }
                property.filterData=data;
        });
        $('#filterDelete').click(function(){
            property.filterData=null;
            $('#dataValue').attr('value','');
            $("#compareColumns").find("option[value='0']").attr("selected","selected");
            $("#dataValue").css("display","block");
            $("#dataColumns").css("display","none");

            alert("删除成功！");
        });
    };
    var warnEvent=function(){
            $('#warnSave').click(function(){
                var warn={
                    warnColumn:$('#warnColumn').val(),
                    warnRule:$('#warnRule').val(),
                    warnCompareValue:$('#warnCompareValue').val(),
                    warnColor:$('#tab5Color').val()
                }
                if(warn.warnCompareValue==""){
                    warn=null;
                }
                property.warnRule=warn;
            });
            $('#warnDelete').click(function(){
                property.warnRule=null;
                $('#warnCompareValue').val("");
                alert("删除成功！");
            });
    };
    //initial();

    var property = {
        //标准线
        standardLine:[],
        filterData:null,
        dataLine:{},
        rule:[],
        warnRule:null
    };
    return {
        initial:function(_Entity){
            var _self=this;
            var htmlStr = "";
            htmlStr = '<div id="' + panelId + '" title="单值图配置" class="hide">' +
                '</div>';
            var panel = $(htmlStr);
            panel.load('tabTemplates.html #'+tabId, function () {
                panel.appendTo($('body:first'));
                self.dialogBox = $('#' + panelId).dialog({
                    zIndex:1000000,
                    width:620,
                    height:400,
                    'min-height':488,
                    resizable:false,
                    position:'middle',
                    autoOpen:false,
                    modal:true,
                    buttons:{
                        "确定":function () {
                            $(this).dialog("close");
                            debugger;
                            _self.updateDatafilter();
                            _self.updateRule();
                            myCallBack(property);
                        },
                        "取消":function () {
                            $(this).dialog("close");
                        }
                    }
                });
                self.tabs = $("#" + tabId).tabs();
                //标准线事件
                normalLineEvent();
                //数据曲线事件
                dataLineEvent();
                //数据曲线属性面板默认值
                if(property.dataLine!=null && property.dataLine.dataColor!=null && property.dataLine.groupColumn!=null){}else{
                    $('#dataColor').spectrum("set","#d2d2d2");
                    $('#markerColor').spectrum("set","#4572A7");
                }
                //判异规则事件
                ruleEvent();
                warnEvent();
                if(_Entity!=null){
                    _self.bindColumn(_Entity);
                }
            });
        },
        open:function(property,callBack){
//            if(!self.dialogBox){
//                initial();
//            }
            self.dialogBox.dialog('open');
            myCallBack = callBack;
        },
        close:function(){
            self.dialogBox.dialog('open');
        },
        setControl: function(con){
            control = con;
        },
        setColumn:function(entity){
            this.bindColumn(entity);
        },
        bindColumn:function(entity){
            var filterColumns = $("#filterColumns");
            var dataColumns=$("#dataColumns");
            var topValue=$("#topValue");
            var bottomValue=$('#bottomValue');
            var groupColumn=$('#groupColumn');
            var dataColumn=$('#dataColumn');
            var warnColumn=$('#warnColumn');
            filterColumns.empty();
            dataColumns.empty();
            topValue.empty();
            bottomValue.empty();
            groupColumn.empty();
            dataColumn.empty();
            warnColumn.empty();

            for(var i=0;i<entity.Columns.length;i++) {
                var option ="<option value='"+entity.Columns[i]+"'>"+entity.Columns[i]+"</option>"// $("<option>").text(entity.Columns[i]).val(entity.Columns[i]);
                filterColumns.append(option);
                dataColumns.append(option);
                topValue.append(option);
                bottomValue.append(option);
                groupColumn.append(option);
                dataColumn.append(option);
                warnColumn.append(option);
            }
            $('#groupColumn').find("option[value="+$($("#groupColumn").children()[0]).val()+"]").attr("selected","selected");
            $('#dataColumn').find("option[value="+$($("#dataColumn").children()[1]).val()+"]").attr("selected","selected");
            $("#tab5Color").spectrum({
                    showInput: true,
                    showPalette: true,
                    palette: [
                        ['black', 'white'],
                        ['blanchedalmond', 'rgb(255, 128, 0);'],
                        ['hsv 100 70 50', 'red'],
                        ['yellow', 'green'],
                        ['blue', 'violet']
                    ],
                    cancelText: "取消",
                    chooseText: "选择",
                    change: function (color) {
                        $("#tab5Color").attr("value",color.toHexString());
                    }
                });
        },
        updateDatafilter:function(){
            dataLine={
                dataColor:$('#dataColor').val(),
                markerColor:$('#markerColor').val(),
                groupColumn:$('#groupColumn option:selected').text(),
                dataColumn:$('#dataColumn option:selected').text()
            }

            property.dataLine=dataLine;
        },
        updateRule:function(){
            property.rule=[];
            for(i=1;i<=8;i++)
            {
                rule={
                    NO:i,
                    Kvalue:$('#K'+i).val(),
                    color:$('#color'+i).attr("value")==""?"#000":$('#color'+i).attr('value'),
                    ischecked:$("input[name='ruleNum'][value='"+i+"']").attr('checked')==undefined?false:true
                }
                property.rule.push(rule);
            }

        },
        returnDataLine:function(){
            debugger;
            return property;
        }
    };
});