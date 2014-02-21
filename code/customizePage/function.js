agi.namespace(['../customizePage/customizePanel'], function (thePanel) {
    var dsList = [];
    var tempDataControl;  //数据控件，用于导出时获取dataset所用
    var selfObj;
    return {
        bindDataSetList: function (container, controlObject) {
            var panel = typeof container == 'string' ? $('#' + container) : $(container);
            panel.empty();

            var jsonData = { "perid": 'root' };
            var jsonString = JSON.stringify(jsonData);
            var Methodname = "DSAllDataSet_SG";
            if (Agi.WebServiceConfig.Type === "JAVA") {
                Methodname = "DSAllDataSet";
            }
            Agi.DAL.ReadData({ "MethodName": Methodname, "Paras": jsonString, "CallBackFunction": function (_result) {
                debugger;
                if (Agi.WebServiceConfig.Type == ".NET") {
                    if (_result.Data.DataSets != null) {
                        dsList = _result.Data.DataSets.DataSet.length ? _result.Data.DataSets.DataSet : [_result.Data.DataSets.DataSet];
                    }
                } else {
                    dsList = _result.Data.DataSet;
                }

                var list = '<option value="-1">请选择数据源</option>';
                for (var i = 0; i < dsList.length; i++) {
                    var id = dsList[i]["ID"];
                    list += '<option value="' + id + '">' + id + '</option>';
                }
                panel.html(list);
                panel.bind('change', function (e) {
                    var val = $(this).val();
                    //                    var obj = dsList.filter(function (a) {
                    //                        return a.ID == val;
                    //                    });


                    var datasetid = val;
                    var jsonData = { "datasetID": datasetid };
                    var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
                    //var controltype = d.object.data('controltype');
                    Agi.DAL.ReadData({
                        "MethodName": "VSGetVirtualTable",
                        "Paras": jsonString, //json字符串
                        "CallBackFunction": function (result) {
                            debugger;
                            if (result.result == 'false') {
                                AgiCommonDialogBox.Alert('Agi.MenuManagement.updateDataSourceDragDropTargets:\n' + result.message, null);
                                return;
                            }
                            //---------构造实体信息
                            var entityInfo = null;
                            var parms = null;
                            if (Agi.WebServiceConfig.Type === "JAVA") {
                                entityInfo = {
                                    Key: result.datasetData.data.DataSet.ID,
                                    Parameters: [],
                                    Data: null,
                                    Filter: null,
                                    Columns: result.virtualTableData.data.schema
                                };
                                parms = result.virtualTableData.data.para;
                                //罗万里  1012-10-29修改  ID:20121029193200
                                $(parms).each(function (i, p) {
                                    entityInfo.Parameters.push({ Key: p.paraName, Value: p.Default });
                                });
                                entityInfo = entityInfo ? entityInfo : undefined;
                                //-----------------------------罗万里修改结束--------------/

                                controlObject.ReadData(entityInfo);
                                thePanel.setColumn(entityInfo); //绑定数据列
                            } else {
                                entityInfo = {
                                    Key: result.datasetData.DataSet.ID,
                                    Parameters: [],
                                    Data: null,
                                    Filter: null,
                                    Columns: []
                                };
                                //修改人：鲁佳 修改时间：2012-11-21 描述：对混合数据源添加判断
                                if (result.virtualTableData.SingleEntityInfo.SqlDefined != null)//标准虚拟表
                                {
                                    parms = result.virtualTableData.SingleEntityInfo.SqlDefined.Para; //获取虚拟表参数
                                    entityInfo.Columns = result.virtualTableData.SingleEntityInfo.SqlDefined.Schema;
                                }
                                else if (result.virtualTableData.SingleEntityInfo.ScDefined != null) //混合虚拟表
                                {
                                    parms = result.virtualTableData.SingleEntityInfo.ScDefined.Para; //获取混合虚拟表参数
                                    $(result.virtualTableData.SingleEntityInfo.ScDefined.Columns.Column).each(function (i, p) {
                                        entityInfo.Columns.push(p.Alias);
                                    });
                                }
                                else if (result.virtualTableData.SingleEntityInfo.SpDefined != null) //存储过程 lujia  2013/07/04
                                {
                                    parms = result.virtualTableData.SingleEntityInfo.SpDefined.Para; //存储过程虚拟表参数
                                    entityInfo.Columns = result.virtualTableData.SingleEntityInfo.SpDefined.Schema;
                                }

                                if (parms) {
                                    parms = parms.length ? parms : [parms];
                                }
                                $(parms).each(function (i, p) {
                                    entityInfo.Parameters.push({ Key: p.ID, Value: p.Default });
                                });
                                entityInfo = entityInfo ? entityInfo : undefined;

                                controlObject.ReadData(entityInfo);
                                thePanel.setColumn(entityInfo);
                            }
                            //---------查询拖拽的实体落到了哪一个控件上
                            //---------根据实体配置的控件类型 新建一个控件,并加载数据

                            /*清空不需要对象，释放内存*/
                            ThisDragControlType = thisleft = thistop = null;
                            entityInfo = parms = null;

                        }
                    });


                });
            }
            });


        },
        exportPortal: function (exportType, dataControl) {
            switch (exportType) {
                case "0":
                    //alert("请选择导出类型");
                    break;
                case "1":
                    this.exportImg();
                    break;
                case "2":
                    selfObj = this;
                    tempDataControl = dataControl;
                    this.exportExcel();
                    break;
            }
        },
        exportImg: function () {
            var _canvas = [];
            var svgList = $.find("svg");
            for (var i = 0; i < svgList.length; i++) {
                var newcanvas = document.createElement("canvas");
                var parent = $(svgList[i]).parent();
                canvg(newcanvas, parent.html());
                $(parent).append(newcanvas);
                $(svgList[i]).hide();
                _canvas.push(newcanvas);
            }
            html2canvas(document.body, {
                onrendered: function (canvas) {
                    $("svg").show();
                    $(".exportDiv").show();
                    for (var i = 0; i < _canvas.length; i++) {
                        $(_canvas[i]).remove();
                    }
                    window.open(canvas.toDataURL('image/png'), 'mywindow')
                }
            });
        },
        exportExcel: function () {
            var _canvas = [];
            var svgList = $.find("svg");
            for (var i = 0; i < svgList.length; i++) {
                var newcanvas = document.createElement("canvas");
                var parent = $(svgList[i]).parent();
                canvg(newcanvas, parent.html());
                $(parent).append(newcanvas);
                $(svgList[i]).hide();
                _canvas.push(newcanvas);
            }
            html2canvas(document.body, {
                onrendered: function (canvas) {
                    $("svg").show();
                    $(".exportDiv").show();
                    for (var i = 0; i < _canvas.length; i++) {
                        $(_canvas[i]).remove();
                    }
                    var imgData = canvas.toDataURL('image/png');
                    var reg1 = /data:image\/png;base64,(.+)/;
                    reg1.test(imgData);
                    imgData = RegExp.$1;

                    var cloumns;
                    try { cloumns = tempDataControl.Get("Entity")[0].Columns; } catch (e) { cloumns = []; }
                    var data;
                    try {
//                        data = tempDataControl.Get("Entity")[0].Data;
                          //20130819 9:55 markeluo 修改
                         data=tempDataControl.Get("FilterData");//筛选后的数据
                         if(cloumns!=null && cloumns.length>0 && data!=null && data.length>0){
                             var tempdata=[];
                             for(var i=0;i<data.length;i++){
                                for(var j=0;j<cloumns.length;j++){
                                    tempdata.push(data[i][cloumns[j]]);
                                }
                             }
                             data=tempdata;
                         }else{
                             data=[];
                         }
                    }catch (e) {
                        data = [];
                    }
                    var paras = { "listTitle": cloumns, "listData": data, "color": selfObj.getColorData(), "img":imgData };
                    selfObj.exportToServer(paras);
                }
            });
        },
        exportToServer: function (paras) {
            if (Agi.WebServiceConfig.Type === "JAVA") {
                var parasstring=JSON.stringify(paras);
                var Dataobj={
                    methodName:"iMrExcelExport",
                    parameters:parasstring
                }
                $.post(
                    WebServiceAddress ,
                    Dataobj,
                    function (_result) {
                        if(_result.substr(0,9)=="callBack("){
                            _result=JSON.parse(_result.substring(_result.indexOf("callBack('")+10,_result.lastIndexOf("')")));
                        }else{
                            _result=JSON.parse(_result);
                        }
                        if(_result.result=="true"){
                            window.open(_result.filePath, 'mywindow');
                        }else{
                            alert(_result.message);
                        }
                    },"text");
            }else{
                $.post(
                    WebServiceAddress + "/iMrExcelExport",
                    paras,
                    function (_result) {
                        if (Agi.DAL.isEncrypt) {
                            _result = JSON.parse(base64decode(_result));
                        }
                        else {
                            _result = JSON.parse(_result);
                        }
                        var str = Agi.ImgServiceAddress + "/Export/" + _result;
                        window.open(str, 'mywindow');
                    },"json");
            }
        },
        getColorData: function () {
            var colos = [];
            var DataControlDataArray=tempDataControl.Get("dataGridArray");
            if(DataControlDataArray!=null && DataControlDataArray.length>0){
                for (var i = 0; i < DataControlDataArray.length; i++) {
                    colos.push({
                        "row": DataControlDataArray[i].row,
                        "cle": DataControlDataArray[i].cle,
                        "color": DataControlDataArray[i].color
                    });
                }
            }
            return colos;
        }
    }
});