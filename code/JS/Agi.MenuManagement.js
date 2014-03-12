/**
 * Created with JetBrains WebStorm.
 * User: andy
 * Date: 12-8-22
 * Time: 上午10:06
 * To change this template use File | Settings | File Templates.
 */
Namespace.register('Agi.MenuManagement');
var boolIsSave = new Boolean(true);
var IsNewSPCPage=false;//20130916 14:24 添加对SPC页面的支持
Agi.MenuManagement = function (option) {
    var self = this;
    self.options = {
        dataSourceServerAddress: WebServiceAddress,
        controlXmlFile: "xml/ControlConfig.xml",
        pageManageNode: null
    };
    for (name in option) {
        self.options[name] = option[name];
    }

    self.dragableDs = [];
    self.DragablePoint = [];
    self.DragableStyles = [];
    //datasource
    {
        //请示webservice,把所有实体绑定到左侧的菜单
        //        self.loadDataSource = function (container) {
        //            var panel = typeof container == 'string' ? $('#' + container) : $(container);
        //            panel.empty();
        //            Agi.DAL.ReadData({
        //                "MethodName": "DSAllDataSet",
        //                "Paras": null, //无参数为null
        //                "CallBackFunction": function (result) {    //回调函数
        //                    $('#progressbar1').hide();
        //                    try {
        //                        if (Agi.WebServiceConfig.Type === "JAVA") {
        //                            ds = [];
        //                            $.each(result.Data, function (i, val) {
        //                                ds.push(val.data.DataSet);
        //                            });
        //                        } else {
        //                            ds = result.Data.DataSets.DataSet.length ? result.Data.DataSets.DataSet : [result.Data.DataSets.DataSet];
        //                        }
        //                        var ui = $('<ul class="sub-menu" style="display: block; ">' +
        //                            '</ul>');
        //                        panel.append(ui);
        //                        $(ds).each(function (i, d) {
        //                            //result.Data.DataSets.DataSet[0].DefaultVisualContrl.split('*')
        //                            //var visControl = d.DefaultVisualContrl.split('*');
        //                            var controltype = d.DefaultVisualContrl;
        //                            //var initialize = visControl[1];
        //                            var li = $('<li data-controltype="' + controltype + '"' +
        //                                'data-id="' + d.ID + '" data-DataSource="' + d.DataSource + '" style="list-style: none;" class="NewShare">' +
        //                                '<a><span><img src="Img/LeftIcon/datasetss.png"></span>' + d.ID + '</a>' +
        //                                '</li>');
        //                            li.appendTo(ui);
        //                        }); //end for
        //
        //                        self.dragableDs = panel.find('li');
        //                        self.updateDataSourceDragDropTargets();
        //
        //                        //添加创建共享数据源的右键菜单
        //                        $(".NewShare").contextMenu('SharedDatasourceRightMenu', {
        //                            bindings: {
        //                                'NewShare': function (t) {
        //                                    var datasourcename = $(t).find('a').parent().attr('data-datasource');
        //                                    var datasetname = $(t).find('a').parent().attr('data-id');
        //                                    ShareDataOperation.ShowOperatonPanel(datasourcename, datasetname);
        //                                }
        //                            }
        //                        });
        //
        //                        /*清空不需要对象，释放内存*/
        //                        ui = li = controltype = null;
        //                    }
        //                    catch (e) {
        //                    }
        //                }
        //            });
        //        }
        self.loadDataSource = function (container, NodeInfo, _layerindex) {
            var panel = typeof container == 'string' ? $('#' + container) : $(container);
            panel.empty();
            var LayerIndex = 1;
            var NewNodeInfo = { perid: "root" };
            var PanelEnement = null;
            if (panel[0].id != null) {
                if (NodeInfo == null) {
                    PanelEnement = $("<ul class=\"sub-menu\" style=\"display:block;\"></ul>");
                    panel.append(PanelEnement);
                } else {
                    LayerIndex = _layerindex;
                    NewNodeInfo = NodeInfo;
                    PanelEnement = $(container);
                }
            }
            Agi.DatasetsManager.DSAllDataSet_SG(NewNodeInfo, function (result) {
                AllDS = result.Data;
                /*罗万里 20120911 添加-----------------开始*/
                if (Agi.WebServiceConfig.Type === "JAVA") {
                    AllDS = {
                        DataSets: {
                            DataSet: [],
                            groups: []
                        }
                    };
                    //                    AllDS.DataSets.DataSet=result.Data.DataSet
                    //                    AllDS.DataSets.groups=result.Data.groups;

                    //20130813 markeluo 没有任何DataSet 时处理错误
                    if (result.Data != null) {
                        AllDS.DataSets.DataSet = result.Data.DataSet
                        AllDS.DataSets.groups = result.Data.groups;
                    }
                }
                /*--------------------------------------结束*/

                if (AllDS != null) {
                    var leftfirstdslist = "";
                    try {
                        if (AllDS.DataSets.DataSet != null) {
                            //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                            var changestateimg = "Img/LeftIcon/datasetss.png";
                            if (isArray(AllDS.DataSets.DataSet)) {
                                var controltype = "";
                                //如果返回的是多个DataSe（是数组），则循环每一个DataSet，获取需要的数据
                                $.each(AllDS.DataSets.DataSet, function (i, d) {
                                    controltype = d.DefaultVisualContrl;

                                    //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                                    if (d.changestate != null && d.changestate == "1") {
                                        changestateimg = "Img/LeftIcon/tables_Changed.png";
                                    } else {
                                        changestateimg = "Img/LeftIcon/datasetss.png";
                                    }
                                    if (d.ID.replace(/[^\x00-\xff]/g, '**').length > 40)
                                    {
                                    leftfirstdslist += '<li data-controltype="' + controltype + '"' +
                                        'data-id="' + d.ID + '" data-DataSource="' + d.DataSource + '" style="list-style: none;" class="NewShare" LayerIndex=' + LayerIndex + '>' +
                                        '<a><span><img src="' + changestateimg + '"></span>' + d.ID.substr(0,19)+"..." + '</a>' +
                                        '</li>';
                                    }
                                    else
                                    {
                                     leftfirstdslist += '<li data-controltype="' + controltype + '"' +
                                        'data-id="' + d.ID + '" data-DataSource="' + d.DataSource + '" style="list-style: none;" class="NewShare" LayerIndex=' + LayerIndex + '>' +
                                        '<a><span><img src="' + changestateimg + '"></span>' + d.ID + '</a>' +
                                        '</li>';
                                    }
                                });
                            }
                            else {

                                //20130902 14:50 markeluo 修改 修改标准虚拟表 关联混合虚拟表和DataSet 标识
                                if (AllDS.DataSets.DataSet.changestate != null && AllDS.DataSets.DataSet.changestate == "1") {
                                    changestateimg = "Img/LeftIcon/tables_Changed.png";
                                } else {
                                    changestateimg = "Img/LeftIcon/datasetss.png";
                                }
                                controltype = d.DefaultVisualContrl;
                                if (AllDS.DataSets.DataSet.ID.replace(/[^\x00-\xff]/g, '**').length > 40)
                                {
                                leftfirstdslist += '<li data-controltype="' + AllDS.DataSets.DataSet.DefaultVisualContrl + '"' +
                                    'data-id="' + AllDS.DataSets.DataSet.ID + '" data-DataSource="' + AllDS.DataSets.DataSet.DataSource + '" style="list-style: none;" class="NewShare" LayerIndex=' + LayerIndex + '>' +
                                    '<a><span><img src=' + changestateimg + '></span>' + AllDS.DataSets.DataSet.ID.substr(0,19)+"..." + '</a>' +
                                    '</li>';
                                 }
                                 else
                                 {
                                  leftfirstdslist += '<li data-controltype="' + AllDS.DataSets.DataSet.DefaultVisualContrl + '"' +
                                    'data-id="' + AllDS.DataSets.DataSet.ID + '" data-DataSource="' + AllDS.DataSets.DataSet.DataSource + '" style="list-style: none;" class="NewShare" LayerIndex=' + LayerIndex + '>' +
                                    '<a><span><img src=' + changestateimg + '></span>' + AllDS.DataSets.DataSet.ID + '</a>' +
                                    '</li>';
                                 }
                            }
                        }
                        if (AllDS.DataSets.groups != null) {
                            if (isArray(AllDS.DataSets.groups)) {
                                //如果返回的是多个group（是数组），则循环每一个group，获取需要的数据
                                $.each(AllDS.DataSets.groups, function (i, val) {
                                    if (AllDS.DataSets.groups[i].ID.replace(/[^\x00-\xff]/g, '**').length > 40)
                                    {
                                    leftfirstdslist += "<li id='" + AllDS.DataSets.groups[i].path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='" + LayerIndex + "'><a title='" + AllDS.DataSets.groups[i].ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" +
                                        AllDS.DataSets.groups[i].ID.substr(0,19)+"..." + "</a><ul class='Sub" + (LayerIndex + 1) + "'></ul></li>";
                                    }
                                     else
                                    {
                                      leftfirstdslist += "<li id='" + AllDS.DataSets.groups[i].path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='" + LayerIndex + "'><a title='" + AllDS.DataSets.groups[i].ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" +
                                      AllDS.DataSets.groups[i].ID + "</a><ul class='Sub" + (LayerIndex + 1) + "'></ul></li>";
                                     }
                                });
                            }
                            else {
                                //如果返回的是单个group，则直接获取其ID
                                if (AllDS.DataSets.groups.ID.replace(/[^\x00-\xff]/g, '**').length > 40) {
                                    leftfirstdslist += "<li id='" + AllDS.DataSets.groups.path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='" + LayerIndex + "'><a  title='" +
                                    AllDS.DataSets.groups.ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups.ID.substr(0,19)+"..." + "</a><ul class='Sub" + (LayerIndex + 1) + "'></ul></li>";
                                }
                                else
                                {
                                leftfirstdslist += "<li id='" + AllDS.DataSets.groups.path + "'  class='MyDataSetGroup' isfolder='true' LayerIndex='" + LayerIndex + "'><a  title='" +
                                    AllDS.DataSets.groups.ID + "'><span><img src='Img/LeftIcon/folder.png'/></span>" + AllDS.DataSets.groups.ID + "</a><ul class='Sub" + (LayerIndex + 1) + "'></ul></li>";
                                 }
                            }
                        }
                        //绑定数据到下拉菜单
                        PanelEnement.html(leftfirstdslist);
                        self.BindDataSetsGroupClickEvent(PanelEnement.find(".MyDataSetGroup"));

                        self.dragableDs = PanelEnement.find(".NewShare");
                        self.updateDataSourceDragDropTargets();

                        //添加创建共享数据源的右键菜单
                        panel.find(".NewShare").contextMenu('SharedDatasourceRightMenu', {
                            bindings: {
                                'NewShare': function (t) {
                                    var datasourcename = $(t).find('a').parent().attr('data-datasource');
                                    var datasetname = $(t).find('a').parent().attr('data-id');
                                    ShareDataOperation.ShowOperatonPanel(datasourcename, datasetname);
                                }
                            }
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                //                if(NodeInfo!=null){
                //                    PanelEnement.parent().find('>a').addClass('active').next().slideToggle('fast');
                //                }
            });

        }
        self.BindDataSetsGroupClickEvent = function (JqueryElementArray) {
            $(JqueryElementArray).unbind().bind("click", function (event) {
                var ParentObj = $(this).parent().parent();
                if (ParentObj != null && ParentObj[0].id != null && ParentObj[0].id != "") {
                    ParentObj.unbind();
                }
                var NodeInfo = { perid: this.id };

                self.loadDataSource($($(this).find(">ul")[0]), NodeInfo, (parseInt($(this).attr("LayerIndex")) + 1));
                //                //打开当前的
                //                if ($(this).data("Expend")!="1") {
                //                    $(this).parent().find('>li>a').removeClass('active').next().slideUp('fast');
                //                    self.loadDataSource($($(this).find(">ul")[0]),NodeInfo,(parseInt($(this).attr("LayerIndex"))+1));
                //                    $(this).data("Expend","1");
                //                }else{
                //                    $(this).find(">a").removeClass('active').next().slideUp('fast');
                //                    $(this).data("Expend","0");
                //                }
            });
        }
        //让左侧的实体可以拖动,拖动完成后将实体的基本信息传给控件的ReadData方法
        self.updateDataSourceDragDropTargets = function () {
            var dragableDs = self.dragableDs.length ? self.dragableDs : [self.dragableDs];
            var dropTargets = $("#BottomRightCenterContentDiv div[recivedata='true'],#BottomRightCenterContentDiv"); //找出画布里面的控件
            dragDataSourceItems = null;
            dragDataSourceItems = [];
            //        //没有找到控件,把画布作为目标
            //        if(!dropTargets){
            //            dropTargets=[];
            //            dropTargets.push($('#BottomRightCenterContentDiv'));
            //        }
            //        //如果有控件,把画布也加进来
            //        if(!dropTargets.length){
            //            dropTargets.push($('#BottomRightCenterContentDiv')[0]);
            //        }
            if (dropTargets.length) {
                $(dragableDs).each(function (i, ds) {
                    var dragDs = new Agi.DragDrop.SimpleDragDrop({
                        dragObject: ds,
                        targetObject: dropTargets, //目标为画布中的控件
                        //拖拽完成回调
                        dragEndCallBack: function (d) {
                            var datasetid = d.object.data('id');
                            var jsonData = { "datasetID": datasetid };
                            var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
                            var controltype = d.object.data('controltype');
                            Agi.DAL.ReadData({
                                "MethodName": "VSGetVirtualTable",
                                "Paras": jsonString, //json字符串
                                "CallBackFunction": function (result) {
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


                                    }
                                    //---------查询拖拽的实体落到了哪一个控件上
                                    //把表信息传给控件,让控件自己根实体信息取数据
                                    var con = Agi.Controls.FindControlByPanel(d.target.attr('id'));
                                    if (con) {//如果拖拽落到控件上
                                        con.ReadData(entityInfo);
                                        try {
                                            /*  add by lj 2012-12-12
                                            添加代码行号：223 - 230
                                            一个控件只能绑定一个相同名称的dataset。
                                            所以在同一控件中，共享数据源与关系数据为互斥关系。*/
                                            Agi.Msg.ShareDataRelation.DeleteSharaItem(con.Get("ProPerty").ID, entityInfo.Key);
                                        }
                                        catch (e) { }
                                        return;
                                    }

                                    //---------根据实体配置的控件类型 新建一个控件,并加载数据
                                    var controlInfo = self.findControlInfo(controltype);
                                    var ContentDivObj = null;
                                    var ThisDragControlType = controltype; //d.object.attr("controlType"); /*实际应该从拖拽元素的自定义属性ControlType中获取*/
                                    var ThissDragControlInitFun = controlInfo._InitFun; //d.object.attr("initialize");/*控件初始化方法*/
                                    if (layoutManagement.property.type == 1) {
                                        ContentDivObj = $('#BottomRightCenterContentDiv');
                                        /*画布对象*/
                                        var thisleft = parseInt(d.position.left.replace("px", "")) - ContentDivObj.offset().left;
                                        var thistop = parseInt(d.position.top.replace("px", "")) - ContentDivObj.offset().top;

                                        //InitControl(ContentDivObj, { Left: thisleft, Top: thistop }, ThisDragControlType); //初始化生成控件
                                        InitControlToCanvas(ContentDivObj, { Left: thisleft, Top: thistop }, Agi.Edit.workspace.GetControlsLibs(ThisDragControlType), ThissDragControlInitFun, entityInfo);
                                    }
                                    else if (layoutManagement.property.type == 2) {
                                        ContentDivObj = $(d.target);
                                        //InitControl(ContentDivObj, null, ThisDragControlType); //初始化生成控件
                                        InitControlToCanvas(ContentDivObj, null, Agi.Edit.workspace.GetControlsLibs(ThisDragControlType), ThissDragControlInitFun, entityInfo);

                                    }
                                    /*清空不需要对象，释放内存*/
                                    ThisDragControlType = thisleft = thistop = null;
                                    entityInfo = parms = null;

                                }
                            });
                        },
                        dargStartCallBack: function () {
                            var tran = this.transcript;
                            tran.css('background-color', 'transparent');
                            var spanStr = tran.find('span')[0].outerHTML;
                            tran.empty().css('width', 'auto');
                            $(spanStr).appendTo(tran);
                            tran.find('img').width(tran.find('img').width() * 3);
                        }
                    });
                    dragDataSourceItems.push(dragDs);
                });
            }

            //添加共享数据源的拖拽事件
            ShareDataOperation.DragSharesObj = $('#ShareDataUL').find('li');
            ShareDataOperation.updateDragableShareTargets();
        }
    }
    {
        self.loadRealTimeDC = function (container) {
            var panel = typeof container == 'string' ? $('#' + container) : $(container);
            panel.empty();
            var jsonData = { "rtdbID": "" };
            var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
            Agi.DAL.ReadData({
                "MethodName": "RtdbLoad", "Paras": jsonString, "CallBackFunction": function (result) {
                    if (result.result == "true") {
                        var RealTimeDS = result.rtdbData;
                        $(RealTimeDS).each(function (i, d) {
                            var id = 'RealTimePoint_' + d['RtdbID'];
                            var DC = '<div class ="accordion-group"><div class="accordion-heading"><a title="' + d['RtdbID'] + '" class="accordion-toggle" data-toggle="collapse" data-parent="#RealTimeListContaner" href="#' + id + '">' +
                                '<span><img src="Img/LeftIcon/database.png"/>' + d['RtdbID'] + '</span></a></div>' +
                                '<div id="' + id + '" class="accordion-body collapse" style="height: 0px; "><div class="accordion-inner"></div></div>' +
                                '</div>';
                            panel.append(DC);
                            id = DC = null;
                        });
                        panel.find(".accordion-heading").click(function () {
                            var _RtdbID = $(this).find('span').html();
                            _RtdbID = _RtdbID.substring(_RtdbID.indexOf(">") + 1);
                            var jsonData = { "rtdbID": _RtdbID, "tagName": "" };
                            var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
                            Agi.DAL.ReadData({
                                "MethodName": "RPLoad", "Paras": jsonString, "CallBackFunction": function (result) {
                                    if (result.result == "true") {
                                        if (result.tagName.length > 0) {
                                            var RealTimePoints = result.tagName;
                                            var subContainer = $("#RealTimePoint_" + _RtdbID).find('.accordion-inner')[0];
                                            $(subContainer).empty();
                                            var RealTimePoints = result.tagName;
                                            $(RealTimePoints).each(function (i, tag) {
                                                var str = '<ui class="sub-menu"><li data-rtdbid="' + _RtdbID + '" data-id="' + tag['Tag'] + '" style="list-style: none;"><a>' +
                                                    '<span><img src="Img/LeftIcon/controls.png" alt="' + tag['Tag'] + '"></span>' +
                                                    '' + tag['Tag'] + '' +
                                                    '</a></li></ui>';
                                                $(subContainer).append(str);
                                            });
                                            self.DragablePoint = $(subContainer).find('li');
                                            self.dragablePoint();

                                            /*清空不需要对象，释放内存*/
                                            RealTimePoints = subContainer = RealTimePoints = null;
                                        }

                                        /*清空不需要对象，释放内存*/
                                        _RtdbID = jsonData = jsonString = null;
                                    }
                                }
                            });

                        });
                        /*清空不需要对象，释放内存*/
                        RealTimeDS = null;
                    }
                }
            });

        }
        self.dragablePoint = function () {
            var _dragablePoint = self.DragablePoint.length ? self.DragablePoint : [self.DragablePoint];
            var dropTargets = $("#BottomRightCenterContentDiv div[recivedata='true'],#ControlEditPageLeft div[recivedata='true']"); //找出画布里面的控件
            dragRealTimePointItems = null;
            dragRealTimePointItems = [];
            if (dropTargets.length) {
                $(_dragablePoint).each(function (i, Point) {
                    var dragDs = new Agi.DragDrop.SimpleDragDrop({
                        dragObject: Point,
                        targetObject: dropTargets, //目标为画布中的控件
                        //拖拽完成回调
                        dragEndCallBack: function (d) {
                            var rtdbid = d.object.data('rtdbid');
                            var pointID = d.object.data('id');
                            var con = Agi.Controls.FindControlByPanel(d.target.attr('id'));
                            if (con && d.target.attr('id').substring(6, 20) == "RealTimeLable_") {
                                con.ReadOtherData(pointID);
                            }
                            if (con && d.target.attr('id').substring(6, 20) == "DashboardChart") {
                                con.ReadOtherData(pointID);
                            }
                            if (con && d.target.attr('id').substring(6, 22) == "ThermometerChart") {
                                con.ReadOtherData(pointID);
                            }
                            if (con && d.target.attr('id').substring(6, 14) == "LEDChart") {
                                con.ReadOtherData(pointID);
                            }
                            if (con && d.target.attr('id').substring(6, 18) == "DynamicChart") {
                                con.ReadData({
                                    rtdbID: rtdbid,
                                    tagName: pointID
                                });
                            }
                            if (con && d.target.attr('id').substring(6, 22) == "AnimationControl") {
                                con.ReadOtherData(pointID);
                            }

                            /*清楚不需要对象，释放内存*/
                            rtdbid = pointID = con = null;
                        }
                    });
                    dragRealTimePointItems.push(dragDs);
                });
            }
        }
    }
    //加载样式下拉列表框
    {
        self.loadStyles = function (container) {
            var panel = typeof container == 'string' ? $('#' + container) : $(container);
            panel.empty();
            var AllStyInfo = Agi.layout.StyleControl.ControlStyList;
            //获取所有图标路径
            var AllControlsEnameAndCname = Agi.Msg.ControlNameExchange.GetControlNameExchangeList();


            //控件类型循环绑定
            if (AllStyInfo != null) {
                for (name in AllStyInfo) {
                    var IconName = "";
                    for (var i = 0; i < AllControlsEnameAndCname.length; i++) {
                        if (AllControlsEnameAndCname[i].Cname.trim() == name) {
                            IconName = AllControlsEnameAndCname[i].IconName;
                        }
                    }

                    var STS = '<div class ="accordion-group"><div class="accordion-heading"><a title="' + name + '" class="accordion-toggle" data-toggle="collapse" data-parent="#stylesListContaner" href="#' + name + '">' +
                            '<span><img style="margin-right:2px;" src="JS/Controls/ControlsImages/' + IconName + '"/>' + name + '</span></a></div>' +
                            '<div id="' + name + '" class="accordion-body collapse" style="height: 0px; "><div class="accordion-inner"></div></div>' +
                            '</div>';
                    panel.append(STS);

                    /*清除不需要对象，释放内存*/
                    IconName = null;
                }
                //当点击类型是，绑定下面的样式信息
                panel.find(".accordion-heading").click(function () {
                    var CType = $(this).find('span').html();
                    CType = CType.substring(CType.indexOf(">") + 1);
                    var subContainer = $("#" + CType).find('.accordion-inner')[0];
                    $(subContainer).empty();
                    for (name in AllStyInfo[CType]) {
                        var str = '<ui class="sub-menu"><li data-id="' + name + '" style="list-style: none;"><a>' +
                                            '<span><img src="Img/LeftIcon/controls.png" alt="' + name + '"></span>' +
                                            '' + name + '' +
                                            '</a></li></ui>';
                        $(subContainer).append(str);
                    }
                    self.DragableStyles = $(subContainer).find('li');
                    self.updateDragableStylesTargets();
                });
            }
        }
        /*清空不需要对象，释放内存*/
        AllStyInfo = AllControlsEnameAndCname = null;
        self.updateDragableStylesTargets = function () {
            var _dragablePoint = self.DragableStyles.length ? self.DragableStyles : [self.DragableStyle];
            var dropTargets = $('div.PanelSty', '#BottomRightCenterContentDiv'); //找出画布里面的控件
            dragControlStyle = null;
            dragControlStyle = [];
            //20130221 倪飘 解决新建页面，在没有向组态环境中拖入控件的情况下拖动容器框控件样式，再向组态环境中拖入容器框控件，此时再向容器框控件中拖入控件样式已经无法拖动问题
            if (dropTargets.length === 0) { dropTargets = $('#BottomRightCenterContentDiv'); }
            if (dropTargets.length) {
                $(_dragablePoint).each(function (i, Point) {
                    var dragStyles = new Agi.DragDrop.SimpleDragDrop({
                        dragObject: Point,
                        targetObject: dropTargets, //目标为画布中的控件
                        //拖拽完成回调
                        dragEndCallBack: function (d) {
                            //获得控件类型
                            var ControlTypeCname = d.object.parent().parent().parent().attr('id');
                            var ContorlTypeEname;
                            var AllControlsEnameAndCname = Agi.Msg.ControlNameExchange.GetControlNameExchangeList();
                            for (var i = 0; i < AllControlsEnameAndCname.length; i++) {
                                if (AllControlsEnameAndCname[i].Cname.trim() == ControlTypeCname.trim()) {
                                    ContorlTypeEname = AllControlsEnameAndCname[i].Ename;
                                    break;
                                }
                            }
                            //获得拖动的主题名字
                            var ThemeID = d.object.data('id');
                            //获得控件ID
                            //var ControlName = d.target.attr('id');
                            //获得控件名称
                            var con = Agi.Controls.FindControlByPanel(d.target.attr('id'));
                            if (con) {
                                var conType = con.Get('ControlType');
                                if (conType === ContorlTypeEname && con.ChangeTheme) {
                                    if (con.snycTheme !== undefined) {
                                        con.snycTheme = false;
                                    }
                                    con.ChangeTheme(ThemeID);
                                } else {
                                    AgiCommonDialogBox.Alert("主题信息与控件不匹配！", null);
                                    return;
                                }
                            }

                            /*清除不需要变量，释放内存*/
                            ControlTypeCname = ContorlTypeEname = AllControlsEnameAndCname = ThemeID = con = null;
                        }
                    });
                    dragControlStyle.push(dragStyles);
                });
            }
        }
    }
    //control
    {
        self.controlConfigFile = null;
        self.loadControls = function (container, workspace) {
            var panel = typeof container == 'string' ? $('#' + container) : $(container);
            var conList = null;
            var conList = [];
            $.get(self.options.controlXmlFile, function (data) {
                self.controlConfigFile = data;
                var js = JSON.parse(Agi.Utility.xml2json($(data).find('Controls')[0], ""));
                panel.empty();
                var groups = js.Controls.Group.length ? js.Controls.Group : [js.Controls.Group];
                $(groups).each(function (i, g) {
                    //create group
                    {
                        var id = 'collapse' + Agi.Script.CreateControlGUID();
                        var aGroup = '<div class="accordion-group">' +
                            '<div class="accordion-heading">' +
                            '<a title="' + g['@Name'] + '" class="accordion-toggle" data-toggle="collapse" data-parent="#controlsListContaner" href="#' + id + '">' +
                            '<span>' +
                        '<img src="' + g['@IcoURL'] + '" alt="' + g['@Name'] + '">' +
                            '</span>' +
                            '' + g['@Name'] + '' +
                            '</a>' +
                            '</div>' +
                            '<div id="' + id + '" class="accordion-body collapse" style="height: 0px; ">' +
                            '<div class="accordion-inner">' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        panel.append(aGroup);
                    }

                    //create control to group
                    {
                        var controls = g.Control.length ? g.Control : [g.Control];
                        var subContainer = $($('#' + id).find('.accordion-inner')[0]);
                        $(controls).each(function (i, con) {
                            //
                            var files = con.Files.File.length ? con.Files.File : [con.Files.File];
                            var ControlLibs = [];
                            $.each(files, function (i, file) {
                                ControlLibs.push(file['@Path']);
                            })
                            if (workspace) {
                                workspace.ControlsLibs.push({ "controlType": con['@ControlType'], "files": ControlLibs, "groupname": con['@GroupName'] });
                            }
                            //ui
                            var str = '<ui class="sub-menu">' +
                                '<li controlType="' + con['@ControlType'] + '" initialize="' + con['@Initialize'] + '" style="list-style: none;"><a>' +
                                '<span><img src="' + con['@IcoURL'] + '" alt="' + con['@ControlName'] + '"></span>' +
                                '' + con['@ControlName'] + '' +
                                '</a></li></ui>';
                            subContainer.append(str);
                            conList.push($(str));
                        }); //end for by create control
                    }
                }); //end for by create group
                dragable(panel.find('li'));
            }); //end $.get
            return;
        };

        function dragable(objArray) {
            var targts = layoutManagement.property.type == 1 ? $('#BottomRightCenterContentDiv div[container="true"],#BottomRightCenterContentDiv') : layoutManagement.getCells();
            $(objArray).each(function (i, con) {
                //为每个左边的控件添加拖动处理
                var dragItem = new Agi.DragDrop.SimpleDragDrop({
                    dragObject: con,
                    targetObject: targts, //目标为中间的画布
                    //拖拽完成回调
                    dragEndCallBack: function (d, tabsTabid) {
                        //d.target :鼠标释放时落在哪一个元素上
                        //d.position :鼠标释放时 拖动对象副本的位置
                        //d.object     //当前拖动对象
                        var ContentDivObj = null;
                        var ThisDragControlType = d.object.attr("controlType");
                        /*实际应该从拖拽元素的自定义属性ControlType中获取*/
                        var ThissDragControlInitFun = d.object.attr("initialize");

                        var ControlGroup = Agi.Edit.workspace.GetControlGroup(ThisDragControlType);
                        if (ControlGroup != null && ControlGroup == "SPC") {
                            if (IsNewSPCPage) { } else {
                                AgiCommonDialogBox.Alert("当前为普通页面不支持SPC业务控件，如需支持请新建SPC业务页面！");
                                return;
                            }
                        }
                        /*控件初始化方法*/
                        if (layoutManagement.property.type == 1) {
                            ContentDivObj = d.target.attr('container') == 'true' ? d.target : $('#BottomRightCenterContentDiv');
                            /*画布对象*/
                            var thisleft = parseInt(d.position.left.replace("px", "")) - ContentDivObj.offset().left;
                            var thistop = parseInt(d.position.top.replace("px", "")) - ContentDivObj.offset().top;

                            //InitControl(ContentDivObj, { Left: thisleft, Top: thistop }, ThisDragControlType); //初始化生成控件
                            /*TabsControl-添加参数Tabid*/
                            InitControlToCanvas(ContentDivObj, { Left: thisleft, Top: thistop }, Agi.Edit.workspace.GetControlsLibs(ThisDragControlType), ThissDragControlInitFun, undefined, tabsTabid);
                        } else if (layoutManagement.property.type == 2) {
                            ContentDivObj = $(d.target);
                            //InitControl(ContentDivObj, null, ThisDragControlType); //初始化生成控件
                            InitControlToCanvas(ContentDivObj, null, Agi.Edit.workspace.GetControlsLibs(ThisDragControlType), ThissDragControlInitFun);

                        }
                        ThisDragControlType = thisleft = thistop = null;
                        /*清空不需要对象，释放内存*/
                    },
                    dargStartCallBack: function () {
                        var tran = this.transcript;
                        tran.css('background-color', 'transparent');
                        var spanStr = tran.find('span')[0].outerHTML;
                        tran.empty().css('width', 'auto');
                        $(spanStr).appendTo(tran);
                        tran.find('img').width(tran.find('img').width() * 3);
                    },
                    /*控件批量拖动 code by Liuyi 2012.11.05*/
                    draggingCallBack: function (obj, event) {
                        // debugger;
                    }
                });
                dragControlItems.push(dragItem);
            });

            /*清除不需要变量，释放内存*/
            targts = null;
        }

        self.findControlInfo = function (type) {
            var control = $('Control[ControlType="' + type + '"]', self.controlConfigFile);
            var info = {
                _controlLibs: [],
                _InitFun: control.attr('Initialize')
            };
            control.find('Files File').each(function (i, f) {
                info._controlLibs.push($(f).attr('Path'));
            });
            return info;
            /*清除不需要变量，释放内存*/
            info = null;
        }
    }

    //page
    {
        //specialNode:为指定节点添加列表,如果没有传递,表示从根目录加载
        //        self.loadPages = function (specialNode) {
        //            var container = specialNode ? specialNode : self.options.pageManageNode;
        //            if (!container) {
        //                return;
        //            }
        //            //一级一级往上 取路径
        //            var direction = "PageManager";
        //            var id = 0;
        //            var dir = new Array();
        //            var level = 1;
        //            if (specialNode) {
        //                var className = specialNode.attr('class');
        //                var parentLi = specialNode.parent();
        //                while (className != 'sub-menu') {
        //                    var fileName = parentLi.data('filename');
        //                    id = parentLi[0].id;
        //                    if (fileName) {
        //                        dir.push(fileName);
        //                        level += 1;
        //                    }
        //                    parentLi = parentLi.parent();
        //                    className = parentLi.attr('class');
        //                } //end while
        //                direction += '/' + dir.reverse().join('/');
        //            }
        //            var jsonData = {
        //                "url": direction, //"PageManager"
        //                "ID": id
        //            };
        //            var jsonString = JSON.stringify(jsonData);
        //
        //            Agi.DAL.ReadData({
        //                "MethodName": "FMGetFileByParent",
        //                "Paras": jsonString, //json字符串
        //                "CallBackFunction": function (result) {     //回调函数
        //                    if (result.result) {
        //                        container.empty();
        //                        $(result.data).each(function (i, f) {
        //                            var id = f.ID;
        //                            var fileName = f.name.replace('.xml', '');
        //
        //                            var icon = f.isFile == 'true' ? $('<span><img src="Img/LeftIcon/duplicate2.png"></span>') : $('<span><img src="Img/LeftIcon/datasetss.png"></span>');
        //                            if (level > 1) {
        //                                var marginLeft = level * 11;
        //                                icon.css('margin-left', marginLeft + 'px');
        //                            }
        //                            var li = $('<li id="' + id + '" title="' + fileName + '" data-filename="' + fileName.toString() + '" data-isfile=' + f.isFile + '><a class="active">' + icon[0].outerHTML + fileName + '</a></li>');
        //
        //                            li.appendTo(container);
        //                            var pl = li.find('span:eq(0)').offset().left + li.find('span:eq(0)').width();
        //                            li.find('a').css('padding-left', pl <= 0 ? 40 : pl + 'px');
        //
        //                            /*清除不需要变量，释放内存*/
        //                            id = fileName = icon = li = pl = null;
        //                        });
        //                        addContextMenuForPages(container.find('li'));
        //                        addClickCallBack(container.find('li[data-isfile="false"]'));
        //                        if (specialNode) {
        //                            container.slideDown('fast');
        //                        }
        //                        else {
        //                            addContextMenuForPages(container.parent());
        //                        }
        //                    }
        //                }
        //            });
        //
        //        }
        //20130622 markeluo 新增，页面分组管理
        self.loadPages = function (specialNode) {
            var container = specialNode ? specialNode : self.options.pageManageNode;
            if (!container) {
                return;
            }
            //一级一级往上 取路径
            var direction = "";
            var Enumtype = "";
            var id = 0;
            var dir = new Array();
            var level = 1;
            if (specialNode) {
                direction = specialNode.parent().data("path");
                var LevelLength = specialNode.parent().data("level");
                Enumtype = specialNode.parent().data("filetype");
                //                if(direction.indexOf("/")>=0){
                //                    level=direction.split("/").length+1;
                //                }
                if (LevelLength != null) {
                    level = eval(LevelLength) + 1;
                }
            }

            var jsonData = {
                "url": direction, //"PageManager"
                "ID": id,
                "enum": Enumtype
            };
            if (Agi.WebServiceConfig.Type == "JAVA" && jsonData.url != "") {
                jsonData.ID = jsonData.url;
            }
            var jsonString = JSON.stringify(jsonData);
            var Methname = "FMGetFileByParent_SG";
            if (Agi.WebServiceConfig.Type == "JAVA") {
                //                Methname="FMGetFileByParent";//20130916 11:03 获取页面分组、页面、版本 对SPC 类型页面支持
                Methname = "SPC_FMGetFileByParent";
            }
            Agi.DAL.ReadData({
                "MethodName": Methname,
                "Paras": jsonString, //json字符串
                "CallBackFunction": function (result) {     //回调函数
                    if (result.result == "true") {
                        container.empty();
                        if (Agi.WebServiceConfig.Type == "JAVA" && result.data.infos == null) {
                            result.data = { infos: { info: result.data} };
                        }
                        if (result.data.infos != null && result.data.infos.info != null) {
                            var fileName = "";
                            $(result.data.infos.info).each(function (i, f) {
                                var id = f.id;
                                var icon = "";
                                var isspcpage = "0";
                                if (Agi.WebServiceConfig.Type == ".NET") {
                                    f.path = f.path.replace('.xml', '');
                                    id = f.id = f.id.replace('.xml', '');
                                    if (f.path.lastIndexOf('/') >= 0) { } else {
                                        f.path = "/" + f.path;
                                    }
                                    if (f.enum == "pagefile") {
                                        fileName = f.path.substr(f.path.lastIndexOf('/') + 1);
                                        if (f.isspc == "true") {
                                            icon = $('<span><img src="Img/LeftIcon/spcduplicate2.png"></span>');
                                            isspcpage = "1";
                                        } else {
                                            icon = $('<span><img src="Img/LeftIcon/duplicate2.png"></span>');
                                        }
                                    } else if (f.enum == "pagefolder") {
                                        fileName = f.path.substr(f.path.lastIndexOf('/') + 1);
                                        icon = $('<span><img src="Img/LeftIcon/datasetss.png"></span>');
                                    } else if (f.enum == "group") {
                                        fileName = f.path.substr(f.path.lastIndexOf('/') + 1);
                                        icon = $('<span><img src="Img/LeftIcon/folder.png"></span>');
                                    }
                                } else {
                                    fileName = f.id;
                                    id = f.path;
                                    if (f.enum == "pagefile") {
                                        if (f.isspc == "true") {
                                            icon = $('<span><img src="Img/LeftIcon/spcduplicate2.png"></span>');
                                            isspcpage = "1";
                                        } else {
                                            icon = $('<span><img src="Img/LeftIcon/duplicate2.png"></span>');
                                        }
                                    } else if (f.enum == "pagefolder") {
                                        icon = $('<span><img src="Img/LeftIcon/datasetss.png"></span>');
                                    } else if (f.enum == "group") {
                                        icon = $('<span><img src="Img/LeftIcon/folder.png"></span>');
                                    }
                                }
                                if (level > 1) {
                                    var marginLeft = level * 11;
                                    icon.css('margin-left', marginLeft + 'px');
                                }
                                //20140224 添加判断页面名称代码当页面名称超过20字符显示省略号
                                var fileNewName = "";
                                if (fileName.replace(/[^\x00-\xff]/g, '**').length > 40) {
                                    fileNewName = fileName.substr(0, 19) + "...";
                                }
                                else {
                                    fileNewName = fileName;
                                }

//                                var li = $('<li id="' + id + '" title="' + fileName + '" data-Path="' + f.path + '" data-filename="' +
//                                    fileName.toString() + '" data-filetype=' + f.enum + ' data-level="' + level + '" data-isspcpage="' + isspcpage + '"><a class="active">' +
//                                    icon[0].outerHTML + fileName + '</a></li>');

                                var li = $('<li id="' + id + '" title="' + fileName + '" data-Path="' + f.path + '" data-filename="' +
                                    fileName.toString() + '" data-filetype=' + f.enum + ' data-level="' + level + '" data-isspcpage="' + isspcpage + '"><a class="active">' +
                                    icon[0].outerHTML + fileNewName + '</a></li>');

                              //end

                                li.appendTo(container);
                                var pl = li.find('span:eq(0)').offset().left + li.find('span:eq(0)').width();
                                li.find('a').css('padding-left', pl <= 0 ? 40 : pl + 'px');

                                /*清除不需要变量，释放内存*/
                                id = fileName = icon = li = pl = null;
                            });
                            addContextMenuForPages(container.find('li'));
                            addClickCallBack(container.find('li[data-filetype="pagefolder"],li[data-filetype="group"]'));
                            if (specialNode) {
                                container.slideDown('fast');
                            }
                            else {
                                addContextMenuForPages(container.parent());
                            }
                            //绑定，支持可拖拽操作
                            Agi.MenuManagement.BindPageGroupDrag(container.find('li[data-filetype="pagefolder"],li[data-filetype="group"]'), $("#PageManage").find('li[data-filetype="group"]'), self.loadPages);
                        }
                    }
                }
            });

        }
        self.getFilePath = function (el) {
            //            var specialNode = $(el);
            //            //一级一级往上 取路径
            //            var direction = "";
            //            var dir = new Array();
            //            var level = 1;
            //            if (specialNode) {
            //                var parentLi = specialNode.parent();
            //                var className = parentLi.attr('class');
            //                while (className != 'sub-menu') {
            //                    var fileName = parentLi.attr('data-filename');
            //                    if (fileName) {
            //                        dir.push(fileName);
            //                        level += 1;
            //                    }
            //                    parentLi = parentLi.parent();
            //                    className = parentLi.attr('class');
            //                    /*清除不需要变量，释放内存*/
            //                    fileName = null;
            //                } //end while
            //                direction += dir.reverse().join('/');
            //            }
            //            var filename = $(el).attr('data-filename').toString();
            //            if (level > 1) {
            //                filename = direction + '/' + filename;
            //            }
            //            return filename;
            //            /*清除不需要变量，释放内存*/
            //            parentLi = className = filename = null;
            if ($(el).data("path") != null) {
                return $(el).data("path");
            } else {
                return "";
            }
        }
        //为页面加上右键菜单
        function addContextMenuForPages(jQObjectArray) {
            //加入右键菜单
            //return;
            jQObjectArray.contextMenu('pageManagement', {
                "bindings": {
                    //编辑页面
                    "pageManagement-edit": function (e) {
                        var filename = "";
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            filename = self.getFilePath(e).replace("PageManager/", "");
                        } else {
                            filename = $(e).data("filename");
                        }
                        var id = e.id;
                        ShowNewMainPage();
                        Agi.Edit.workspace.controlList.clear();
                        //                        Agi.Edit.OpenPage(filename, id);//20121116 10:23 markeluo 修改 (修改钱代码)

                        //20121116 10:23  start Auth:markeluo  说明：JAVA 这边在编辑页面时需要页面所属的ParentID 参数
                        var parentid = 0;
                        if (e.parentElement.parentElement) {
                            parentid = e.parentElement.parentElement.id;
                        }
                        Agi.Edit.OpenPage(filename, id, parentid)
                        //20121116 10:23 end
                        //region 20130916 13:44 markluo 对SPC 页面进行特殊处理
                        var isspcpage = $(e).data("isspcpage");
                        if (isspcpage != null && isspcpage == "1") {
                            IsNewSPCPage = true;
                        } else {
                            IsNewSPCPage = false;
                        }
                        //endregion
                        boolIsSave = false;
                    },
                    "pageManagement-copy": function (e) {//页面的复制功能
                        /* var filename = self.getFilePath(e);
                        pangeCopy(filename);*/
                    },
                    "pageManagement-paste": function () {//页面粘贴

                    },
                    //预览页面
                    "pageManagement-view": function (e) {
                        var filename = "";
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            filename = self.getFilePath(e).replace("PageManager/", "");
                        } else {
                            filename = $(e).data("filename");
                        }
                        var id = e.id;
                        //                        var path = Agi.ViewServiceAddress + filename + "&isView=true&ID=" + id;

                        //region 20130916 13:44 markluo 对SPC 页面进行特殊处理
                        var isspcpage = $(e).data("isspcpage");
                        if (isspcpage != null && isspcpage == "1") {
                            isspcpage = true;
                        } else {
                            isspcpage = false;
                        }
                        var strviewAddress = Agi.ViewServiceAddress;
                        if (isspcpage) {
                            strviewAddress = Agi.SPCViewServiceAddress;
                        }
                        var path = strviewAddress + filename + "&isView=true&ID=" + id;
                        //endregion
                        window.open(path);
                    },
                    //删除页面
                    "pageManagement-delete": function (e) {
                        var filename = "";
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            filename = self.getFilePath(e).replace("PageManager/", "");
                        } else {
                            filename = $(e).data("filename");
                        }
                        var isFile = false
                        var id = e.id;

                        var content = '确定要删除文件:  ' + filename + '  ?';
                        AgiCommonDialogBox.Confirm(content, null, function (flag) {
                            if (!flag) {
                                return;
                            }
                            var jsonData = { "url": filename, "ID": id, "isFile": isFile };
                            var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台

                            Agi.DAL.ReadData({
                                "MethodName": "VSFileDelete",
                                "Paras": jsonString, //json字符串
                                "CallBackFunction": function (result) {     //回调函数
                                    if (result.result) {
                                        //self.loadPages();
                                        $(e).remove();
                                    } else {
                                    }
                                    AgiCommonDialogBox.Alert(result.message, null);

                                    //刷新版本列表
                                    var directionName = filename.split('/')[0];
                                    VersionPageName(directionName); //获取文件夹中页面信息
                                }
                            });
                        });
                    },

                    //版本查看,管理
                    "pageManagement-VersionManage": function (e) {
                        var filename = "";
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            filename = self.getFilePath(e).replace("PageManager/", "");
                        } else {
                            filename = $(e).data("filename");
                        }
                        ShowVersionInfo(); //显示版本管理页面
                        VersionPageName(filename); //获取文件夹中页面信息
                        //selectLak(filename);//获得下拉框的值
                    },
                    //2014-03-03  coke  移动页面值组别
                    "pageManagement-MovesManage":function(e)
                    {
                        MovesPagesData(e);
                    },
                    //文件夹的删除
                    "pageManagement-delete2": function (e) {
                        var filename = "";
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            filename = self.getFilePath(e).replace("PageManager/", "");
                        } else {
                            filename = $(e).data("filename");
                        }
                        var content = '确定要删除目录: ' + filename + ' ? ';
                        AgiCommonDialogBox.Confirm(content, null, function (flag) {

                            if (flag) {
                                var jsonData = { "url": filename, isFile: true, "ID": e.id, isDelete: true };
                                var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台

                                Agi.DAL.ReadData({
                                    "MethodName": "VSFileDelete",
                                    "Paras": jsonString, //json字符串
                                    "CallBackFunction": function (result) {     //回调函数
                                        if (result.result) {
                                            $(e).remove();
                                        } else {
                                        }
                                        AgiCommonDialogBox.Alert(result.message, null);

                                        //刷新版本列表
                                        var directionName = filename.split('/')[0];
                                        VersionPageName(directionName); //获取文件夹中页面信息
                                    }
                                });
                            }
                        });

                    },
                    //刷新单个目录
                    "pageManagement-refresh": function (e) {
                        var filename = "";
                        if (Agi.WebServiceConfig.Type == ".NET") {
                            filename = self.getFilePath(e).replace("PageManager/", "");
                        } else {
                            filename = $(e).data("filename");
                        }
                        AgiCommonDialogBox.Alert(fname, null);
                    },
                    //刷新 整个文件列表
                    "pageManagement-refreshRoot": function (e) {
                        self.loadPages();
                    },
                    //根节点下添加 页面分组文件夹
                    "pageManagement-addGroupFolder": function (e) {
                        var NodeInfo = null;
                        if (e.id != "" && $(e).data("isfile") != "pageRoot") {
                            var filePath = self.getFilePath(e);
                            NodeInfo = { NodeName: $(e).data("filename"), NodePath: filePath, NodeKey: filePath }
                        }
                        AddPageGroup(NodeInfo, function (ev) {
                            self.loadPages();
                        });
                    },
                    //编辑分组名称
                    "pageManagement-EditGroupFolder": function (e) {
                        var filePath = self.getFilePath(e);
                        var NodeInfo = { NodeName: $(e).data("filename"), NodePath: filePath, NodeKey: filePath }
                        EditPageGroup(NodeInfo, function (ev) {
                            self.loadPages();
                        })
                    },
                    //删除分组
                    "pageManagement-DelGroupFolder": function (e) {
                        var filePath = self.getFilePath(e);
                        var NodeInfo = { NodeName: $(e).data("filename"), NodePath: filePath, NodeKey: filePath }
                        DeletePageGroup(NodeInfo, function (ev) {
                            self.loadPages();
                        });
                    }
                },
                onShowMenu: function (e, menu) {
                    $(menu).find('li').hide();
                    //alert('menu');
                    var liNode = $(e.target);
                    var tagName = liNode[0].tagName;
                    while (tagName != 'LI') {
                        liNode = liNode.parent();
                        tagName = liNode[0].tagName;
                    }
                    var filetype = "pageRoot";
                    if (liNode.data('filetype') != null) {
                        filetype = liNode.data('filetype').toString();
                    }
                    //alert(isfile);
                    if (filetype == 'pagefile') {
                        $(menu).find('.page-contextMenu').show();
                    } else if (filetype == 'pagefolder') {
                        $(menu).find('.folder-contextMenu').show();
                    } else if (filetype == 'group') {
                        $(menu).find('.PageGroupMenu').show();
                    } else {
                        $(menu).find('.pageRoot-contextMenu').show();
                    }
                    return menu;
                }
            });
        }

        //为页面加上单击事件
        function addClickCallBack(jqOjbectArray) {
            $(jqOjbectArray).unbind('click', folderClickCallBack);
            $(jqOjbectArray).bind('click', folderClickCallBack);
        }

        function folderClickCallBack(e) {
            var pageType = $(this).data('filetype');
            if (pageType != "pagefile") {
                if (!$(this).find('>ul').length) {
                    var ul = $('<ul style="display:block;">');
                    ul.appendTo($(this));
                    self.loadPages(ul);
                }
            }
        }
    }

/*
* 2014-03-03  coke  移动页面
* */
    function MovesPagesData (e)
    {
        new Agi.Msg.OpenParasSettingWindow().Masklayer();
        $("#BtnOkDiv").off().bind("click",function(){
            var parentID=$("#GroupNameID").val();
            if(parentID=="0")
            {
                $('#SettingMasklayer').modal('hide');
                //没有选择移动组别id
                AgiCommonDialogBox.Alert("您没有选择组别！", null);
                return;
            }
          if($(e).attr("id")==null)
          {
              return;
          }
            //移动页面
            Agi.PageGroupManager.VSPageMove({ Key:$(e).attr("id"),Parent:parentID},function(result){
                if(result.result=="true"){
                    $('#SettingMasklayer').modal('hide');
                     AgiCommonDialogBox.Alert("移动成功！", null);
                    menuManagement.loadPages(); //重新加载页面列表
                }else{
                    $('#SettingMasklayer').modal('hide');
                    AgiCommonDialogBox.Alert(result.message, null);
                }
            });
        });
        $("#ContentDiv").html('<div style="font-size: 15px; float: left; width: 80px; font-weight: bold;"><p style="margin-top: 104px;text-align: center;">组别名称：</p></div><div id="MovesPagesGroup" ' +
            'class="jstree jstree-1 jstree-default jstree-focused jstree-0" style="height:228px; width:356px; ' +
            'text-align:left; float: left;"></div>');
        RequestPageData();
    }

    /*2014-02-20  coke
     * 获取组别名称
     *
     * */
    function RequestPageData(dataContent,BackFunction)
    {
        //var arryList=$("#PageManage").find('li[data-filetype="group"]');
        var direction = "";
        var Enumtype="";
        var id = 0;
        var jsonData = {
            "url": direction, //"PageManager"
            "ID": id,
            "enum":Enumtype
        };

        if(dataContent!=undefined)
        {
            jsonData.url=dataContent.rslt.obj.attr("id");
            jsonData.enum="group";
        }else{
            $("#SetGroupData").empty();
        }

        if(Agi.WebServiceConfig.Type== "JAVA" && jsonData.url!=""){
            jsonData.ID=jsonData.url;
        }
        var jsonString = JSON.stringify(jsonData);
        var Methname="FMGetFileByParent_SG";
        if (Agi.WebServiceConfig.Type== "JAVA") {
            Methname="SPC_FMGetFileByParent";
        }
        Agi.DAL.ReadData({
            "MethodName":Methname,
            "Paras": jsonString, //json字符串
            "CallBackFunction": function (result) {     //回调函数
                if (result.result!="true") {
                    BackFunction([]); //无效返回值
                    return;
                }
                if(result.data.length<0){
                    BackFunction([]); //无效返回值
                    return;
                }
                if(dataContent==undefined){
                    //产生树形节点
                    //第一次加载的时候执行

                    CreateTreeNode(result.data);
                }else{
                    //点击树形节点执行此代码
                    var data=result.data;
                    var position = 'inside';
                    var parent = $('#MovesPagesGroup').jstree('get_selected');
                    for(var s= 0,len=data.length;s<len;s++)
                    {
                        if(data[s].enum=="group")
                        {
                            var em={
                                "data": {title:data[s].id },
                                'attr': {title:data[s].id ,ID:data[s].path},
                                "metadata": { id:data[s].path, type: 'commonLib' }
                            }
                            dataContent.inst.create_node(parent, position, em, false, false);//添加节点
                        }
                    }
                    dataContent.inst.open_node();//打开节点
                    BackFunction(data); //返回实体下次使用
                }

            }
        });
    }
    /*2014-02-20  coke
     * 产生树形节点
     *
     * */
    function CreateTreeNode(dataList)
    {
        var dataIn = [];
        var data=dataList;
        for(var s= 0,len=data.length;s<len;s++)
        {
            if(data[s].enum=="group")
            {
                var em={
                    "data": {title:data[s].id },
                    'attr': {title:data[s].id ,ID:data[s].path},
                    "metadata": { id:data[s].path, type: 'commonLib' },
                    children: []
                }
                dataIn.push(em);
            }
        }
        if(dataIn.length<0){return;}
        var temp="";
        $("#MovesPagesGroup") .jstree({
            json_data: {data: dataIn },
            plugins: ["themes", "json_data", "ui"]
        }).bind("select_node.jstree",function (event, data1) {
                //点击获取组别
                $("#GroupNameID").val(data1.rslt.obj.attr("ID"));
                //删除节点
                data1.rslt.obj.children(2).eq(2).remove();
                if(temp!=data1.rslt.obj.attr("title"))
                {
                    temp=data1.rslt.obj.attr("title");
                    RequestPageData(data1,function(ev){
                        data=ev;
                    });

                }else{
                    var position = 'inside';
                    var parent = $('#MovesPagesGroup').jstree('get_selected');
                    for(var s= 0,len=data.length;s<len;s++)
                    {
                        if(data[s].enum=="group")
                        {
                            var em={
                                "data": {title:data[s].id },
                                'attr': {title:data[s].id ,ID:data[s].path},
                                "metadata": { id:data[s].path, type: 'commonLib' }
                            }
                            data1.inst.create_node(parent, position, em, false, false);
                        }
                    }
                    data1.inst.open_node();
                }

            }).delegate("a", "click", function (event, data) {
                event.preventDefault();
            }).bind("loaded.jstree",function(e,data){ })
    }

    //获取当前所有控件中最大和最小的zindex
    self.getControlMaxzIndex = function (canvas) {
        var indexArr = [1000];
        var max = indexArr[0], min = indexArr[0];
        var controlList = canvas.find('.PanelSty');
        controlList.each(function (i, con) {
            var index = parseInt($(con).css('z-index'));
            if (isNaN(index)) {
                index = 0;
            }
            indexArr.push(index);
        });
        $(indexArr).each(function (i, ind) {
            if (ind > max) {
                max = ind;
            }
            if (ind < min) {
                min = ind;
            }
        });
        return {
            max: max,
            min: min
        };

        /*清除不需要变量，释放内存*/
        indexArr = max = controlList = null;
    }

    self.getPanelControlIndex = function () {
        var canvas = $("#BottomRightCenterContentDiv");
        var min = 0;
        var max = 0;
        var iCount = 0;
        $(".agi-panel", canvas).each(function (i, p) {
            var ind = $(p).css('z-index');
            ind = isNaN(ind) ? 0 : parseInt(ind);
            if (ind > max) {
                max = ind;
            }
            if (ind < min) {
                min = ind;
            }
            iCount++;
        });
        return {
            min: min,
            max: max,
            count: iCount
        };

        /*清除不需要变量，释放内存*/
        canvas = min = max = iCount = null;
    }
};

//region 页面,页面group   DataSets，DataSets 拖拽支持 20130624 markeluo 添加
Agi.MenuManagement.BindDataSetsGroupDrag=function(Items,Targets){
    $(Items).each(function (i, Point) {
        var dragStyles =new Agi.DragDropManager.DragDropBind({
            dragObject: Point,
            targetObject:Targets, //目标为画布中的控件
            //拖拽完成回调
            dragEndCallBack: function (d, tabsTabid) {
                //d.target :鼠标释放时落在哪一个元素上
                //d.position :鼠标释放时 拖动对象副本的位置
                //d.object     //当前拖动对象
                if(d.target.attr("isfolder")=="true"){
                    var ThisobjParentID="";
                    if($(d.object[0]).parent()!=null && $(d.object[0]).parent().parent()!=null && $(d.object[0]).parent().parent().attr("isfolder")=="true"){
                        ThisobjParentID=$(d.object[0]).parent().parent()[0].id;
                    }
                    if(d.target[0].id==ThisobjParentID){
                        AgiCommonDialogBox.Alert("已在当前分组中，不可移动！", null);
                        return;
                    }else{
                        if(d.object.attr("isfolder")=="true"){
                            //文件夹分组移动
                            var ParObj={
                                Key:d.object[0].id,
                                Parent:d.target[0].id
                            }
                            Agi.DatasetsManager.DSGroupMove(ParObj,function(result){
                                if(result.result=="true"){
                                    AgiCommonDialogBox.Alert("移动成功！", null);

                                    var  NodeInfo={perid:"root"};
                                    LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                                }else{
                                    AgiCommonDialogBox.Alert(result.message, null);
                                }
                            });
                        }else{
                            //DataSets移动
                            //DataSetsKey:datasets标识 ParentKey:移动到目标节点标识
                            Agi.DatasetsManager.DSNodeMove({DataSetsKey:d.object[0].id,ParentKey:d.target[0].id},function(result){
                                if(result.result=="true"){
                                    AgiCommonDialogBox.Alert("移动成功！", null);
                                    //刷新列表显示方法,待实现
                                    if(d.object.parent().parent()!=null && d.object.parent().parent().attr("isfolder")=="true"){
                                        var  NodeInfo={perid:d.object.parent().parent()[0].id};
                                        LoadDataSetsAndGrpList(NodeInfo,d.object.parent().parent()[0],(parseInt(d.object.parent().parent().attr("LayerIndex"))+1));
                                    }else{
                                        var  NodeInfo={perid:"root"};
                                        LoadDataSetsAndGrpList(NodeInfo,$("#DatasetsManage").parent(),2);
                                    }
                                }else{
                                    AgiCommonDialogBox.Alert(result.message, null);
                                }
                            });
                        }
                    }
                }
            },
            dargStartCallBack: function () {
                var tran = this.transcript;
                tran.css('background-color', 'transparent');
                var spanStr = tran.find('span')[0].outerHTML;
                tran.empty().css('width', 'auto');
                $(spanStr).appendTo(tran);
                tran.find('img').width(tran.find('img').width() * 3);
            },
            /*控件批量拖动 code by Liuyi 2012.11.05*/
            draggingCallBack: function (obj, event) {
                // debugger;
            }
        });
    });
}
Agi.MenuManagement.BindPageGroupDrag=function(Items,Targets,RefreshAllPagescallbak){
    $(Items).unbind("mousedown").unbind("mousemove").unbind("mouseup");
    $(Items).each(function (i, Point) {
        var dragStyles = new Agi.DragDropManager.DragDropBind({
            dragObject: Point,
            targetObject:Targets, //目标为画布中的控件
            //拖拽完成回调
            dragEndCallBack: function (d, tabsTabid) {
                //d.target :鼠标释放时落在哪一个元素上
                //d.position :鼠标释放时 拖动对象副本的位置
                //d.object     //当前拖动对象
                if(d.target.data("filetype")=="group"){
                    var ThisobjParentID="";
                    if($(d.object[0]).parent()!=null && $(d.object[0]).parent().parent()!=null && $(d.object[0]).parent().parent().data("filetype")=="group"){
                        ThisobjParentID=$(d.object[0]).parent().parent().data("path");
                    }
                    if(d.target.data("path")==ThisobjParentID){
                        AgiCommonDialogBox.Alert("已在当前分组中，不可移动！", null);
                        return;
                    }else if(d.target.data("path")==d.object.data("path")){
                        return;
                    }else{
                        if(d.object.data("filetype")=="group"){
                            //文件夹分组移动
                            var ParObj={
                                Key:d.object.data("path"),
                                Parent:d.target.data("path")
                            }
                            Agi.PageGroupManager.VSGroupMove(ParObj,function(result){
                                if(result.result=="true"){
                                    AgiCommonDialogBox.Alert("移动成功！", null);
                                    //刷新列表显示方法
                                    RefreshAllPagescallbak();
                                }else{
                                    AgiCommonDialogBox.Alert(result.message, null);
                                }
                            });
                        }else{
                            //DataSets移动
                            //DataSetsKey:datasets标识 ParentKey:移动到目标节点标识
                            var ParObj={
                                Key:d.object[0].id,
                                Parent:d.target.data("path")
                            }
                            Agi.PageGroupManager.VSPageMove(ParObj,function(result){
                                if(result.result=="true"){
                                    AgiCommonDialogBox.Alert("移动成功！", null);
                                    //刷新列表显示方法
                                    RefreshAllPagescallbak();
                                }else{
                                    AgiCommonDialogBox.Alert(result.message, null);
                                }
                            });
                        }
                    }
                }
            },
            dargStartCallBack: function () {
                var tran = this.transcript;
                tran.css('background-color', 'transparent');
                var spanStr = tran.find('span')[0].outerHTML;
                tran.empty().css('width', 'auto');
                $(spanStr).appendTo(tran);
                tran.find('img').width(tran.find('img').width() * 3);
            },
            /*控件批量拖动 code by Liuyi 2012.11.05*/
            draggingCallBack: function (obj, event) {
                // debugger;
            }
        });
    });
}

//endregion
