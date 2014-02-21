/**
 * Created with JetBrains WebStorm.
 * User: Sunny
 * Date: 13-8-17
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */
agi.namespace(function () {
    return {
        //异常选择弹出框
        AbnormalpointFrame:function(PointDataList){
            var AbnormalpointSelf=this;
            //数据行先保存起来，保存的时候用
            AbnormalpointSelf.AbnormalpointData=PointDataList;
            var AbnormalpointPopupLayer = new PopupLayer({
                trigger:"",
                popupBlk:"#Abnormalpoint",
                closeBtn:"#closerAP",
                useOverlay:false,
                useFx:true,
                offsets:{
                    x:0,
                    y:-41
                }
            });
            AbnormalpointPopupLayer.popupLayer.css({opacity: 0.3}).show(400, function () {
                AbnormalpointPopupLayer.popupLayer.animate({
                    left: ($(document).width() - AbnormalpointPopupLayer.popupLayer.width()) / 2,
                    top: (document.documentElement.clientHeight -
                        AbnormalpointPopupLayer.popupLayer.height()) / 2 + $(document).scrollTop(),
                    opacity: 0.8
                }, 500, function () {
                    AbnormalpointPopupLayer.popupLayer.css("opacity", 1)
                }.binding(AbnormalpointPopupLayer));
            }.binding(AbnormalpointPopupLayer));
            //绑定数据列
            var datacolumn="";
            for(var k in PointDataList){
                datacolumn+="<option>"+k+"</option>"
            }
            $("#errorColumnSlect").html("");
            $("#errorColumnSlect").html(datacolumn);

                //获取所有的错误信息然后绑定树形列表
                var jsonString=JSON.stringify({"code":""});
                Agi.DAL.ReadData({ "MethodName":"iMrSelectInit", "Paras": jsonString, "CallBackFunction": function (_result) {
                    var allErrorList=_result.data;
                    AbnormalpointSelf.AbnormalpointList=allErrorList;
                    var treedata = [AbnormalpointSelf.createErrorNode(allErrorList)];
                    var o={showcheck:true};
                    o.data=treedata;
                    $(".listone").treeview(o);
                }
                });
                //点击保存选择的错误信息
                $("#SaveError").unbind('click');
                $("#SaveError").bind('click',function(){
                    var s=$(".listone").getCheckedNodes();
                    //去除父节点
                    if(s !=null){
                        s=AbnormalpointSelf.RemoveParentNodeId(AbnormalpointSelf.AbnormalpointList,s);
                    }
                    //错误信息保存
                    AbnormalpointSelf.SelectedErrorInfo=[];
                    for(var i=0;i< s.length;i++){
                        if(s[i] !="0"){
                        AbnormalpointSelf.SelectedErrorInfo.push(s[i]);
                        }
                    }
                    //显示选择了多少条
                    $("#numcount").text(AbnormalpointSelf.SelectedErrorInfo.length);
                    //重新加载tree
                        agi.using(['../../customizePage/Abnormalpoint'],function (Abnormalpoint) {
                            var treedata = [Abnormalpoint.createErrorNode(Abnormalpoint.AbnormalpointList)];
                            var o={showcheck:true};
                            o.data=treedata;
                            $(".listone").treeview(o);
                        });

                });


            //避免重复弹窗
            $("#closerAP").unbind("click");
            $("#closerAP").bind("click", function () {
                AbnormalpointPopupLayer.popupLayer.animate({
                    left: 0,
                    top: 0,
                    opacity: 0.1
                }, {duration: 500, complete: function () {
                    AbnormalpointPopupLayer.popupLayer.css("opacity", 1);
                    AbnormalpointPopupLayer.popupLayer.hide();
                }.binding(AbnormalpointPopupLayer)});
            });
            //保存整个异常点信息
            $("#AbnormalpointSave").unbind('click');
            $("#AbnormalpointSave").bind('click',function(){
                if($("#numcount").text()>0){


                agi.using(['../../customizePage/Abnormalpoint'],function (Abnormalpoint) {
                    var datalist=Abnormalpoint.AbnormalpointData;
                    var errfield=$("#errorColumnSlect").val();
                    var errdata=Abnormalpoint.AbnormalpointData[errfield];
                    var typecode=AbnormalpointSelf.SelectedErrorInfo;
                    //region 20130819 9:55 markeluo 修改(datalist的数据格式 errfield,errdata的大小写问题)
                    if(datalist!=null){
                        var _Columns = [];
                        for (var _param in datalist) {
                            _Columns.push({"fieldName":_param,"fieldValue":datalist[_param]});
                        }
                        datalist=_Columns;
                    }
                    var errorsolution=$("#PointErrorSolution").val();//应对措施
                    var errorpepol=$("PointErrorReport");//填写人
                    var jsonString=JSON.stringify({
                        "action":"iMrErrDataSave",
                        "dataList":datalist,
                        "ErrField":errfield,
                        "ErrData":errdata,
                        "typeCode":typecode,
                        "solution":errorsolution,
                        "report":errorpepol});
                    //endregion

//                    上次选择的错误信息清除
                    Abnormalpoint.SelectedErrorInfo=[];
                       //显示条数归零
                    $("#numcount").text(Abnormalpoint.SelectedErrorInfo.length);

                    // 20130819 9:55 markeluo 修改(启用调用webservice 处理)
                   Agi.DAL.ReadData({ "MethodName":"iMrErrDataSave", "Paras": jsonString, "CallBackFunction": function (_result) {
                            //_result 即为返回值
                            if(_result=="true"){
                                alert("保存成功!")
                                $("#closerAP").click();
                            }else{
                                alert(_result.message);
                            }
                        }
                    });
                });
            }else{alert('至少要确定选择一个错误信息！'); return;};
            }
            );
        },
        createErrorNode:function(ErrorData){
            var AbnormalpointSelf=this;
            var root = {
                "id" : "0",
                "text" : "根节点",
                "value" : "0",
                "showcheck" : true,
                complete : true,
                "isexpand" : true,
                "checkstate" : 0,
                "hasChildren" : true,
                ChildNodes:[]
            };
            if(ErrorData!=null && ErrorData.length>0){
                //{'no':11,'name':'分类11','items':[{'no':111,'name':'分类111','items':[]}]
                var NewNode=null;
                AbnormalpointSelf.AddChildrenNode(root,ErrorData);
            }
            return root;
        },
        AddChildrenNode:function(_ParentNode,_SubItems){
            var AbnormalpointSelf=this;
            var NewNode=null;
            for(var i=0;i<_SubItems.length;i++){
                NewNode={
                    "id" :_SubItems[i].no+"",
                    "text" :_SubItems[i].name,
                    "value" :_SubItems[i].no+"",
                    "showcheck" : true,
                    complete : true,
                    "isexpand" : true,
                    "checkstate" : 0,
                    "hasChildren" : true,
                    ChildNodes:[]
                }
                if(_SubItems[i].items!=null && _SubItems[i].items.length>0){
                    AbnormalpointSelf.AddChildrenNode(NewNode,_SubItems[i].items);
                }else{
                    NewNode.hasChildren=false;
                }
                _ParentNode.ChildNodes.push(NewNode);
            }
        },
        //去除父节点
        RemoveParentNodeId:function(ErrorData,_SelNodes){
            var AbnormalpointSelf=this;
            var ChildrenNodes=[];
            if(ErrorData!=null && _SelNodes!=null && ErrorData.length>0 && _SelNodes.length>0){
                for(var i=0;i<_SelNodes.length;i++){
                    if(!AbnormalpointSelf.ErrorNodeIsParent(_SelNodes[i],ErrorData))
                    {
                        ChildrenNodes.push(_SelNodes[i]);
                    }
                }
            }
            return ChildrenNodes;
        },
        ErrorNodeIsParent:function(_NodeId,ErrorDataItems){
            var AbnormalpointSelf=this;
            var bolIsParent=false;
            for(var j=0;j<ErrorDataItems.length;j++){
                if(_NodeId==ErrorDataItems[j].no && ErrorDataItems[j].items!=null && ErrorDataItems[j].items.length>0){
                    bolIsParent=true;
                    break;
                }
                if(ErrorDataItems[j].items!=null && ErrorDataItems[j].items.length>0){
                    bolIsParent=AbnormalpointSelf.ErrorNodeIsParent(_NodeId,ErrorDataItems[j].items);
                    if(bolIsParent){
                        break;
                    }
                }
            }
            return bolIsParent;
        },
        //错误列表
        AbnormalpointList:[],
        //数据行
        AbnormalpointData:[],
        //保存选择了的错误信息
        SelectedErrorInfo:[]


    };
});