var imgUrl = "";
function pageExport() {
    //$(".exportDiv").hide();
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
    $(".menu").hide();
    $(".popExport").hide();
    html2canvas(document.body, {
        onrendered: function (canvas) {
            $(".menu").show();
            $(".popExport").show();

            //document.body.appendChild(canvas);
            $("svg").show();
//            $(".exportDiv").show();
            for (var i = 0; i < _canvas.length; i++) {
                $(_canvas[i]).remove();
            }
            window.open(canvas.toDataURL('image/png'), 'mywindow')
        }
    });
}
function getExcel() {
    //$(".exportDiv").hide();
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
    $(".menu").hide();
    $(".popExport").hide();
    html2canvas(document.body, {

        onrendered: function (canvas, a) {
            $(".menu").show();
            $(".popExport").show();

            $("svg").show();
            //$(".exportDiv").show();
            for (var i = 0; i < _canvas.length; i++) {
                $(_canvas[i]).remove();
            }
            imgUrl = canvas.toDataURL('image/png');
            var a = document.title;

            var reg1 = /data:image\/png;base64,(.+)/;
            reg1.test(imgUrl);
            var b = RegExp.$1;
            var jsonData = getEntity(['DataGrid','BasicChart',"CustomSingleChart","PCChartGxp","CustomBoxChart",
                "CustomXMRChart","CustomXSChart","CustomMDRChart","CustomScatterChart","CustomPCTRChart",
                "SeqChart","CustomNPChart","CustomCChart","EdgeDataView","CustomYGZButton"]);
            //jsonData= JSON.stringify(jsonData);
            //20130708 12:55 markeluo 修改，兼容加密解密处理
            //var jsonData={"url":a,"ID":0};
            //jsonData=JSON.stringify(jsonData)

            if (Agi.WebServiceConfig.Type == ".NET") {
                if (Agi.DAL.isEncrypt) {
                    jsonData = base64encode(jsonData);
                }

                $.post(
                    WebServiceAddress + "/CreateExcelFile",
                    { "jsonData": jsonData, "img": b },
                    function (_result) {
                        //20130708 12:55 markeluo 修改，兼容加密解密处理
                        if (Agi.DAL.isEncrypt) {
                            _result = base64decode(_result);
                        }

                        var str = Agi.ImgServiceAddress + "/Export/" + _result;
                        window.open(str, 'mywindow');
                    },
                    "json");
            } else {
                var Dataobj = {
                    methodName: "createExcelFile",
                    parameters: JSON.stringify({ "jsonData": jsonData, "img": b })
                }
                $.ajax({
                    type: "POST",
                    url: WebServiceAddress,
                    dataType: "jsonp",
                    data: Dataobj,
                    success: function (_result) {
//                        var str = Agi.ImgServiceAddress + "/Export/" + _result;
//                        window.open(str, 'mywindow');
                        window.open(_result, 'mywindow');
                    },
                    error: function (_result) {
                    }
                });
            }
        }
    });
}
function getWord() {


    //$(".exportDiv").hide();
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
    $(".menu").hide();
    $(".popExport").hide();

    html2canvas(document.body, {

        onrendered: function (canvas, a) {
            $(".menu").show();
            $(".popExport").show();

            $("svg").show();
            //$(".exportDiv").show();
            for (var i = 0; i < _canvas.length; i++) {
                $(_canvas[i]).remove();
            }
            imgUrl = canvas.toDataURL('image/png');

            //var a =document.title;

            var reg1 = /data:image\/png;base64,(.+)/;
            reg1.test(imgUrl);
            var b = RegExp.$1;

            //20130708 12:55 markeluo 修改，兼容加密解密处理
            var jsonData = getEntity(['DataGrid','BasicChart',"CustomSingleChart","PCChartGxp","CustomBoxChart",
                "CustomXMRChart","CustomXSChart","CustomMDRChart","CustomScatterChart","CustomPCTRChart",
                "SeqChart","CustomNPChart","CustomCChart","EdgeDataView","CustomYGZButton"]);
            //jsonData= JSON.stringify(jsonData);

            if (Agi.WebServiceConfig.Type == ".NET") {
                if (Agi.DAL.isEncrypt) {
                    jsonData = base64encode(jsonData);
                }

                $.post(
                    WebServiceAddress + "/CreateWordFile",
                    { "jsonData": jsonData, "img": b },
                    function (_result) {
                        //20130708 12:55 markeluo 修改，兼容加密解密处理
                        if (Agi.DAL.isEncrypt) {
                            _result = base64decode(_result);
                        }

                        var str = Agi.ImgServiceAddress + "/Export/" + _result;
                        window.open(str, 'mywindow');
                    },
                    "json");
            } else {
                var Dataobj = {
                    methodName: "createWordFile",
                    parameters: JSON.stringify({ "jsonData": jsonData, "img": b })
                }
                $.ajax({
                    type: "POST",
                    url: WebServiceAddress,
                    dataType: "jsonp",
                    data: Dataobj,
                    success: function (_result) {
//                        var str = Agi.ImgServiceAddress + "/Export/" + _result;
//                        window.open(str, 'mywindow');
                        window.open(_result, 'mywindow');
                    },
                    error: function (_result) {
                    }
                });
            }
        }
    });
}

function getPDF() {
    //CreatePDFFile
   // $(".exportDiv").hide();
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
    $(".menu").hide();
    $(".popExport").hide();
    html2canvas(document.body, {

        onrendered: function (canvas, a) {
            $(".menu").show();
            $(".popExport").show();

            $("svg").show();
           // $(".exportDiv").show();
            for (var i = 0; i < _canvas.length; i++) {
                $(_canvas[i]).remove();
            }
            imgUrl = canvas.toDataURL('image/png');

            //var a =document.title;

            var reg1 = /data:image\/png;base64,(.+)/;
            reg1.test(imgUrl);
            var b = RegExp.$1;

            //20130708 12:55 markeluo 修改，兼容加密解密处理
            var jsonData = getEntity(['DataGrid','BasicChart',"CustomSingleChart","PCChartGxp","CustomBoxChart",
                "CustomXMRChart","CustomXSChart","CustomMDRChart","CustomScatterChart","CustomPCTRChart",
                "SeqChart","CustomNPChart","CustomCChart","EdgeDataView","CustomYGZButton"]);
            //jsonData= JSON.stringify(jsonData);

            if (Agi.WebServiceConfig.Type == ".NET") {
                if (Agi.DAL.isEncrypt) {
                    jsonData = base64encode(jsonData);
                }

                $.post(
                    WebServiceAddress + "/CreatePDFFile",
                    { "jsonData": jsonData, "img": b },
                    function (_result) {
                        //20130708 12:55 markeluo 修改，兼容加密解密处理
                        if (Agi.DAL.isEncrypt) {
                            _result = base64decode(_result);
                        }

                        var str = Agi.ImgServiceAddress + "/Export/" + _result;
                        window.open(str, 'mywindow');
                    },
                    "json");
            } else {
                var Dataobj = {
                    methodName: "createPDFFile",
                    parameters: JSON.stringify({ "jsonData": jsonData, "img": b })
                }
                $.ajax({
                    type: "POST",
                    url: WebServiceAddress,
                    dataType: "jsonp",
                    data: Dataobj,
                    success: function (_result) {
//                        var str = Agi.ImgServiceAddress + "/Export/" + _result;
//                        window.open(str, 'mywindow');
                        window.open(_result, 'mywindow');
                    },
                    error: function (_result) {
                    }
                });
            }
        }
    });
}

//将指定控件类型的实体信息提取出来,生成字符串数组
function getEntity(typeArray) {
    var entityStringArray = [];
    var entitys = [];
    var i = 0;
    for (; i < Agi.view.workspace.controlList.array.length; i++) {
        var con = Agi.view.workspace.controlList.array[i];
        var conType = con.Get('ControlType');
        if (typeArray.indexOf(conType) >= 0) {
            var ent = con.Get('Entity');
            if (typeof ent != 'undefined' && ent.length) {
                var j = 0;
                for (; j < ent.length; j++) {
                    var e = ent[j];
                    delete e.Columns;
                    delete e.Data;
                    entitys.push(e);
                }

            }
        }
    }


    i = 0;
    for (; i < entitys.length; i++) {
        var entity = entitys[i];
        var jsonData = {
            "datasetID": "TEST",
            "param": [
                { "key": "begindate", "value": "2012-07-08" },
                { "key": "enddate", "value": "2012-07-15"}
            ]
        };
        jsonData.datasetID = entity.Key;
        jsonData.param = [];
        $(entity.Parameters).each(function (i, p) {
            jsonData.param.push({key: p.Key, value: p.Value});
        });
        if (!entity.Parameters.length) {
            jsonData.param = [];
        }
        entityStringArray.push(JSON.stringify(jsonData));
        //entityStringArray.push(jsonData);
    }
    return entityStringArray.join('|');
}

