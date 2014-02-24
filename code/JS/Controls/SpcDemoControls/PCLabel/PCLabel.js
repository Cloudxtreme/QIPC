/**
* Created with JetBrains WebStorm.
* User: markeluo
* Date: 12-8-20
* Time: 下午5:43
* To change this template use File | Settings | File Templates.
* BasicChart:基础Chart
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/
var PointEditState = false;
Agi.Controls.SpcDemoPCLabel = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
{
    GetEntityData:function(){//获得实体数据
        var entity = this.Get('Entity')[0];
        if(entity !=undefined && entity !=null){
            return entity.Data;
        }else{
            return null;
        }
    },
    Render: function (_Target) {
        var Me = this;
        var obj = null;
        if (typeof (_Target) == "string") {
            obj = $("#" + _Target);
        } else {
            obj = $(_Target);
        }
        var ThisHTMLElement = this.Get("HTMLElement");
        if (ThisHTMLElement != null) {
            $(ThisHTMLElement).appendTo(obj);
        }
        if (Agi.Edit) {
            menuManagement.updateDataSourceDragDropTargets();
            menuManagement.dragablePoint();
        }
    },
    ReadData: function (_EntityInfo) {
        var Me = this;
        var entity = [];
        entity.push(_EntityInfo);
        Me.Set('Entity',entity);
        if(!_EntityInfo.IsShareEntity){
            Agi.Utility.RequestData(_EntityInfo, function (d) {
                var _data = d;
//                    _EntityInfo.Data = d;
//                    entity.push(_EntityInfo);
//                    Me.chageEntity = true;
//                    Me.Set("Entity", entity);
//                    Me.AddEntity(entity[0]); /*添加实体*/
                var MePrority = Me.Get("ProPerty");
                var data = MePrority.BasciObj.data;
                if(_data && _data.length>0){
                    var aData = _data[0];
                    for(name in aData){
                        data[name] =  aData[name];
                    }
                }else{
                    for(key in data){
                        data[key] = "0";
                    }
                }
                Me.BindChart();
            });
        }else{
            var _data = _EntityInfo.Data;
            var MePrority = Me.Get("ProPerty");
            var data = MePrority.BasciObj.data;
            if(_data && _data.length>0){
                var aData = _data[0];
                for(name in aData){
                    data[name] =  aData[name];
                }
            }else{
                for(key in data){
                    data[key] = "0";
                }
            }
            Me.BindChart();
        }
    },
    ReadOtherData: function (Point) {
    },
    ReadRealData: function (MsgObj) {
    },
    BindChart: function () {
        var chart = null;
        var Me = this;
        var MePrority = Me.Get("ProPerty");
        var data = MePrority.BasciObj.data;
        var MeProrityData = MePrority.BasciObj.propertyData;
        var label = $(Me.Get("HTMLElement")).find('div')[0];
        var pctype = MeProrityData.pctype;
        //        $(label).find("h6").remove();
        //        $(label).find("table").remove();
        $(label).empty();
        switch (pctype) {
            case "1": //统计值
                $(label).append($('<div>统计值</div>'))
                    .append(
                        $('<table width="100%">'
                        + '<tr><td class="tdClass0">样本数</td><td class="tdClass1">' + data.ceshishuliang + '</td></tr>'
                        + '<tr><td class="tdClass0">平均值</td><td class="tdClass1">' + data.junzhi + '</td></tr>'
                        + '<tr><td class="tdClass0">最大值</td><td class="tdClass1">' + data.zuidazhi + '</td></tr>'
                        + '<tr><td class="tdClass0">最小值</td><td class="tdClass1">' + data.zuixiaozhi + '</td></tr>'
                        + '</table>'));
                break;
            case "2": //常量
                $(label).append($('<div>常量</div>'))
                    .append(
                        $('<table width="100%">'
                        + '<tr><td class="tdClass0">子组大小</td><td class="tdClass1">' + data.zizudaxiao + '</td></tr>'
                        + '<tr><td class="tdClass0">规格上限</td><td class="tdClass1">' + data.usl + '</td></tr>'
                        + '<tr><td class="tdClass0">目标值</td><td class="tdClass1">' + data.target + '</td></tr>'
                        + '<tr><td class="tdClass0">规格下限</td><td class="tdClass1">' + data.lsl + '</td></tr>'
                        + '</table>'));
                break;
            case "3": //计算值
                $(label).append($('<div>计算值</div>'))
                    .append(
                        $('<table width="100%">'
                        + '<tr><td class="tdClass0">标准差(组内)</td><td class="tdClass1">' + data.Sigma_est + '</td></tr>'
                        + '<tr><td class="tdClass0">标准差(整体)</td><td class="tdClass1">' + data.Sigma + '</td></tr>'
                        + '<tr><td class="tdClass0">正3倍标准差</td><td class="tdClass1">' + data.AV1 + '</td></tr>'
                        + '<tr><td class="tdClass0">负3倍标准差</td><td class="tdClass1">' + data.AV2 + '</td></tr>'
                        + '</table>'));
                break;
            case "4": //实测性能
                $(label).append($('<div>实测性能</div>'))
                    .append(
                        $('<table width="100%">'
                        + '<tr><td class="tdClass0">PMM_LSL</td><td class="tdClass1"></td></tr>'
                        + '<tr><td class="tdClass0">PMM_USL</td><td class="tdClass1"></td></tr>'
                        + '<tr><td class="tdClass0">PPM Total</td><td class="tdClass1"></td></tr>'
                        + '</table>'));
                break;
            case "5": //工序能力(组内)
                $(label).append($('<div>工序能力(组内)</div>'))
                    .append(
                        $('<table width="100%">'
                        + '<tr><td class="tdClass0">Cpk</td><td class="tdClass1">' + data.Cpk + '</td></tr>'
                        + '<tr><td class="tdClass0">Cp</td><td class="tdClass1">' + data.cp + '</td></tr>'
                        + '<tr><td class="tdClass0">CPL</td><td class="tdClass1">' + data.Cpl + '</td></tr>'
                        + '<tr><td class="tdClass0">CPU</td><td class="tdClass1">' + data.Cpu + '</td></tr>'
                        + '</table>'));
                break;
            case "6": //工序能力(整体)
                $(label).append($('<div>工序能力(整体)</div>'))
                    .append(
                        $('<table width="100%">'
                        + '<tr><td class="tdClass0">Ppk</td><td class="tdClass1">' + data.Ppk + '</td></tr>'
                        + '<tr><td class="tdClass0">Pp</td><td class="tdClass1">' + data.pp + '</td></tr>'
                        + '<tr><td class="tdClass0">PPL</td><td class="tdClass1">' + data.Ppl + '</td></tr>'
                        + '<tr><td class="tdClass0">PPU</td><td class="tdClass1">' + data.Ppu + '</td></tr>'
                        + '</table>'));
                break;
            case "7": //预期性能(组内)
                $(label).append($('<div>预期性能(组内)</div>'))
                    .append(
                         $('<table width="100%">'
                        + '<tr><td class="tdClass0">PMM_LSL</td><td class="tdClass1"></td></tr>'
                        + '<tr><td class="tdClass0">PMM_USL</td><td class="tdClass1"></td></tr>'
                        + '<tr><td class="tdClass0">PPM Total</td><td class="tdClass1"></td></tr>'
                        + '</table>'));
                break;
            case "8": //预期性能(整体)
                $(label).append($('<div>预期性能(整体)</div>'))
                    .append(
                         $('<table width="100%">'
                        + '<tr><td class="tdClass0">PMM_LSL</td><td class="tdClass1"></td></tr>'
                        + '<tr><td class="tdClass0">PMM_USL</td><td class="tdClass1"></td></tr>'
                        + '<tr><td class="tdClass0">PPM Total</td><td class="tdClass1"></td></tr>'
                        + '</table>'));
                break;
            case "9": //其他值
                $(label).append($('<div>其他值</div>'))
                    .append(
                         $('<table width="100%">'
                        + '<tr><td class="tdClass0">Ca</td><td class="tdClass1">' + data.bianyixishu + '</td></tr>'
                        + '</table>'));
                break;
        }
    },
    AddEntity: function (_entity) {
        var Me = this;
        if (_entity != null && _entity.Data != null && _entity.Data.length > 0) {
            var ProPerty = M
            e.Get("ProPerty");
            var PCLabelProPerty = ProPerty.BasciObj;

            var dataArray = []; //测试数据集
            var Entitydata = _entity.Data; //dataset
            var Entitycols = _entity.Columns; //列集

            //            //把数据组合成一维数组
            //            $.each(Entitydata, function (i, item) {
            //                $.each(Entitycols, function (i2, col) {
            //                    if (item[col]) {
            //                        dataArray.push(item[col]);
            //                    }
            //                })
            //            });

            //20121122 markeluo SPC图修改  NO:201211220839 start
            var MaxLength = 1000; //限定处理数据最大行数为1000
            $.each(Entitydata, function (i, item) {
                if (item[Entitycols[0]]) {//默认第一列为分组数据
                    if (dataArray.length >= MaxLength) {
                        return false;
                    } else {
                        dataArray.push(eval(item[Entitycols[0]]));
                    }
                }
            });
            //NO:201211220839 end

            //获取PCLable保存的属性
            var data = PCLabelProPerty.data;
            //获取R算法包含的属性
            var Propertydata = PCLabelProPerty.propertyData;
            data.usl = Propertydata.USL; //USL
            data.lsl = Propertydata.LSL; //LSL
            data.target = Propertydata.Target; //Target
            //最大值
            var i = dataArray[0];
            for (n = 0; n < dataArray.length; n++) {
                if (i < dataArray[n]) {
                    i = dataArray[n];
                }
            }
            data.zuidazhi = i; //最大值
            //最小值
            var i = dataArray[0];
            for (n = 0; n < dataArray.length; n++) {
                if (i > dataArray[n]) {
                    i = dataArray[n];
                }
            }
            data.zuixiaozhi = i; //最小值

            data.ceshishuliang = dataArray.length; //测试数量
            data.zizudaxiao = data.ceshishuliang / Propertydata.Nrow; //子组大小
            //获取子组数量
            var json = { 'action': 'RCalHistogram', 'dataArray': dataArray, 'sampleLength': '', 'USL': '', 'LSL': '', 'specValue': '' };
            var jsonString = JSON.stringify(json);
            Agi.DAL.ReadData(
                    {
                        "MethodName": "RCalHistogram",
                        "Paras": jsonString,
                        "CallBackFunction": function (result) {
                            if (result.result == "true") {
                                data.zizushuliang = result.data.groupNumber; //子组数量
                                Me.BindChart();
                            }
                        }
                    }
                );
            //获取均值
            var json = { 'action': 'RCalNormalDis', 'dataArray': dataArray, 'nrow': Propertydata.Nrow };
            var jsonString = JSON.stringify(json);
            Agi.DAL.ReadData(
                {
                    "MethodName": "RCalNormalDis",
                    "Paras": jsonString,
                    "CallBackFunction": function (result) {
                        if (result.result == "true") {
                            data.junzhi = result.data.xBarBar;
                            data.Sigma = result.data.sigma;
                            Me.BindChart();
                        }
                    }
                }
            );
            //获取变异系数、cp、cr、Cpk、Cpu、Cpl
            var json = { 'action': 'RCalProcessCap', 'dataArray': dataArray, 'USL': Propertydata.USL, 'LSL': Propertydata.LSL, 'nrow': Propertydata.Nrow, 'sampleLength': '', 'constantArray': '' };
            var jsonString = JSON.stringify(json);
            Agi.DAL.ReadData(
                {
                    "MethodName": "RCalProcessCap",
                    "Paras": jsonString,
                    "CallBackFunction": function (result) {
                        if (result.result == "true") {
                            data.bianyixishu = result.data.CV;
                            data.cp = result.data.Cp;
                            data.cr = result.data.Cr;
                            data.Cpk = result.data.Cpk;
                            data.Cpu = result.data.Cpu;
                            data.Cpl = result.data.Cpl;
                            data.Sigma_est = result.data.Sigma_est;
                            Me.BindChart();
                        }
                    }
                }
            );
            //获取pp、pr、Ppu、Ppl
            var json = { 'action': 'RCalProcessPer', 'dataArray': dataArray, 'USL': Propertydata.USL, 'LSL': Propertydata.LSL };
            var jsonString = JSON.stringify(json);
            Agi.DAL.ReadData(
                {
                    "MethodName": "RCalProcessPer",
                    "Paras": jsonString,
                    "CallBackFunction": function (result) {
                        if (result.result == "true") {
                            data.pp = result.data.Pp;
                            data.pr = result.data.Pr;
                            data.Ppk = result.data.Ppk;
                            data.Ppu = result.data.Ppu;
                            data.Ppl = result.data.Ppl;
                            data.AV1 = result.data.Av1;
                            data.AV2 = result.data.Av2;
                            Me.BindChart();
                        }
                    }
                }
            );
            return;
        }
        else {
            Me.BindChart();
        }
    },
    ParameterChange: function (_ParameterInfo) {
        var Me = this;
        var entity = this.Get("Entity");
//        var MePrority = Me.Get("ProPerty");
//        var data = MePrority.BasciObj.data;
//        for(key in data){
//            data[key]="0";
//        }
        Me.ReadData(entity[0]);
//        if (true) {
//            data.zuidazhi = 0;
//            data.zuixiaozhi = 0;
//            data.ceshishuliang = 0;
//            data.zizushuliang = 0;
//            data.zizudaxiao = 0;
//            data.bianyixishu = 0;
//            data.junzhi = 0;
//            data.cp = 0;
//            data.cr = 0;
//            data.pp = 0;
//            data.pr = 0;
//            data.Cpk = 0;
//            data.Ppk = 0;
//            data.Cpu = 0;
//            data.Ppu = 0;
//            data.Cpl = 0;
//            data.Ppl = 0;
//            data.usl = 0;
//            data.lsl = 0;
//            data.target = 0;
//            data.Sigma = 0;
//            data.Sigma_est = 0;
//            data.AV1 = 0;
//            data.AV2 = 0;
//        }
//        Me.BindChart();
//        Me.Set("Entity", entity);
//        Agi.Utility.RequestData(entity[0], function (d) {
//            entity[0].Data = d;
//            Me.AddEntity(entity[0]); /*添加实体*/
//        });
    }, //参数联动
    Init: function (_Target, _ShowPosition) {
        var Me = this;
        this.AttributeList = [];
        Me.Set("Entity", []);
        Me.Set("ControlType", "SpcDemoPCLabel");
        var ID = "SpcDemoPCLabel" + Agi.Script.CreateControlGUID();
        var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PCLabelPanelSty'><div id='children_" + ID + "'  class='children'></div></div>");
        HTMLElementPanel.css('padding-bottom', '0px');
        var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
        var obj = null;
        if (typeof (_Target) == "string") {
            obj = $("#" + _Target);
        } else {
            obj = $(_Target);
        }
        var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
        if (layoutManagement.property.type == 1) {
            HTMLElementPanel.width(130);
            HTMLElementPanel.height(130);
            PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
            PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
            PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
            PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
        } else {
            HTMLElementPanel.removeClass("selectPanelSty");
            HTMLElementPanel.addClass("selectAutoFill_PanelSty");
            obj.html("");
        }
        var ThisProPerty = {
            ID: ID,
            BasciObj: null
        };
        ThisProPerty.BasciObj =
        {
            data: {
                zuidazhi: 0, //最大值
                zuixiaozhi: 0, //最小值
                ceshishuliang: 0, //测试数量
                zizushuliang: 0, //子组数量
                zizudaxiao: 0, //子组大小
                bianyixishu: 0,
                junzhi: 0, //均值
                cp: 0,
                cr: 0,
                pp: 0,
                pr: 0,
                Cpk: 0,
                Ppk: 0,
                Cpu: 0,
                Ppu: 0,
                Cpl: 0,
                Ppl: 0,
                usl: 0,
                lsl: 0,
                target: 0,
                Sigma: 0,
                Sigma_est: 0,
                AV1: 0,
                AV2: 0
            },
            propertyData: {
                USL: 0,
                LSL: 0,
                Target: 0,
                Nrow: 0,
                pctype: "1"
            }
        }
        Me.Set("HTMLElement", HTMLElementPanel[0]);
        if (_Target != null) {
            this.Render(_Target);
        }
        var StartPoint = { X: 0, Y: 0 }
        /*事件绑定*/
        HTMLElementPanel.dblclick(function (ev) {
            if (!Agi.Controls.IsControlEdit) {
                if (!Me.IsPageView) {
                    Agi.Controls.ControlEdit(Me); //控件编辑界面
                }
            }
        });
        if (HTMLElementPanel.touchstart) {
            HTMLElementPanel.touchstart(function (ev) {
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });
        } else {
            HTMLElementPanel.mousedown(function (ev) {
                if (!Me.IsPageView) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });
        }
        Me.Set("ProPerty", ThisProPerty);
        this.Set("Position", PostionValue);
        obj = ThisProPerty = PagePars = PostionValue = null;
        Me.BindChart();
        this.Set("ThemeName", null);
        //20130515 倪飘 解决bug，组态环境中拖入过程能力摘要控件以后拖入容器框控件，容器框控件会覆盖过程能力摘要控件（容器框控件添加背景色以后能够看到效果）
        Agi.Controls.BasicPropertyPanel.Show(HTMLElementPanel.attr('id'));
    },
    CustomProPanelShow: function () {
        Agi.Controls.PCLabelProrityInit(this);
    }, //显示自定义属性面板
    Destory: function () {
        var HTMLElement = $("#" + this.Get("HTMLElement").id)[0];
        var proPerty = this.Get("ProPerty");
//        Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//        Agi.Edit.workspace.controlList.remove(this);
//        Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
//        Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

        $(HTMLElement).remove();
        HTMLElement = null;
        this.AttributeList.length = 0;
        proPerty = null;
        delete this;
    },
//    Copy: function () {
//        if (layoutManagement.property.type == 1) {
//            var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
//            var PostionValue = this.Get("Position");
//            var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
//            var NewPCLabel = new Agi.Controls.SpcDemoPCLabel();
//            NewPCLabel.Init(ParentObj, PostionValue);
//            newPanelPositionpars = null;
//            return NewPCLabel;
//        }
//    },
    PostionChange: function (_Postion) {
        if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
            var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            var _ThisPosition = {
                Left: (_Postion.Left / PagePars.Width).toFixed(4),
                Top: (_Postion.Top / PagePars.Height).toFixed(4),
                Right: (_Postion.Right / PagePars.Width).toFixed(4),
                Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
            }
            this.Set("Position", _ThisPosition);
            PagePars = _ThisPosition = null;
        }
        else {
            var ThisHTMLElementobj = $("#" + this.Get("HTMLElement").id);
            var ParentObj = ThisHTMLElementobj.parent();
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };
            var ThisControlPars = { Width: ThisHTMLElementobj.width(), Height: ThisHTMLElementobj.height(), Left: (ThisHTMLElementobj.offset().left - PagePars.Left), Top: (ThisHTMLElementobj.offset().top - PagePars.Top), Right: 0, Bottom: 0 };
            ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
            ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);
            var _ThisPosition = {
                Left: (ThisControlPars.Left / PagePars.Width).toFixed(4),
                Top: (ThisControlPars.Top / PagePars.Height).toFixed(4),
                Right: (ThisControlPars.Right / PagePars.Width).toFixed(4),
                Bottom: (ThisControlPars.Bottom / PagePars.Height).toFixed(4)
            }
            this.Set("Position", _ThisPosition);
            PagePars = _ThisPosition = null;
        }
    },
    HTMLElementSizeChanged: function () {
        var Me = this;
        if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
            Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 });
        } else {
            Me.Refresh();
        }
        if (Agi.Controls.IsControlEdit) {
            Agi.Controls.PCLabelProrityInit(Me);
        }
    }, //外壳大小更改
    Refresh: function () {
        var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
        var ParentObj = ThisHTMLElement.parent();
        if (!ParentObj.length) {
            return;
        }
        var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
        var PostionValue = this.Get("Position");
        PostionValue.Left = parseFloat(PostionValue.Left);
        PostionValue.Right = parseFloat(PostionValue.Right);
        PostionValue.Top = parseFloat(PostionValue.Top);
        PostionValue.Bottom = parseFloat(PostionValue.Bottom);
        var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (PostionValue.Left + PostionValue.Right))),
            Height: parseInt(PagePars.Height - (PagePars.Height * (PostionValue.Top + PostionValue.Bottom)))
        };
        ThisHTMLElement.width(ThisControlPars.Width);
        ThisHTMLElement.height(ThisControlPars.Height);
        ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
        ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
        this.Set("Position", this.Get("Position"))
    },
    Checked: function () {
        $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
            "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
        });
    },
    UnChecked: function () {
        $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
            "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
        });
        /* $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000",
        "-moz-box-shadow": "1px 1px 1px #000, -1px -1px 1px #000"
        });*/
    },
    ControlAttributeChangeEvent: function (_obj, Key, _Value) {
        Agi.Controls.PCLabelAttributeChange(this, Key, _Value);
    },
    GetConfig: function () {
        var Me = this;
        var ProPerty = this.Get("ProPerty");
        var PCLabelControl = {
            Control: {
                ControlType: null, //*控件类型*//
                ControlID: null, //*控件属性*//
                SpcDemoPCLabel: null, //*控件属性*//
                Entity: null, //*控件实体*//
                ControlBaseObj: null, //*控件基础对象*//
                HTMLElement: null, //*控件外壳ID*//
                Position: null, /*控件位置信息*/
                ThemeName: null/*主题名*/
            }
        }
        PCLabelControl.Control.ControlType = Me.Get("ControlType");
        PCLabelControl.Control.ControlID = ProPerty.ID;
        PCLabelControl.Control.SpcDemoPCLabel = ProPerty.BasciObj;
        PCLabelControl.Control.Entity = Me.Get("Entity");
        PCLabelControl.Control.ControlBaseObj = ProPerty.ID;
        PCLabelControl.Control.HTMLElement = Me.Get("HTMLElement").id;
        PCLabelControl.Control.Position = Me.Get("Position");
        PCLabelControl.Control.ThemeName = Me.Get("ThemeName");
        return PCLabelControl.Control;
    }, //获得BasicChart控件的配置信息
    CreateControl: function (_Config, _Target) {
        var Me = this;
        Me.AttributeList = [];
        if (_Config != null) {
            if (_Target != null && _Target != "") {
                var _Targetobj = $(_Target);

                this.Set("ThemeName", _Config.ThemeName);

                Me.Set("ControlType", "SpcDemoPCLabel");
                Me.Set("Entity", _Config.Entity); //实体
                var ID = _Config.ControlID;
                var CloumnName = _Config.CloumnName;
                var RealTimePoint = _Config.RealTimePoint;
                var PCLabelProPerty = _Config.SpcDemoPCLabel;
                var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty PCLabelPanelSty'><div id='children_" + ID + "' class='children'></div></div>");
                HTMLElementPanel.css('padding-bottom', '0px');
                var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
                var obj = null;
                if (typeof (_Target) == "string") {
                    obj = $("#" + _Target);
                } else {
                    obj = $(_Target);
                }
                var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };
                if (layoutManagement.property.type == 1) {
                    PostionValue = _Config.Position;
                } else {
                    HTMLElementPanel.removeClass("selectPanelSty");
                    HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                    obj.html("");
                }
                var ThisProPerty = {
                    ID: ID,
                    BasciObj: PCLabelProPerty,
                    CloumnName: CloumnName,
                    RealTimePoint: RealTimePoint
                };
                this.Set("HTMLElement", HTMLElementPanel[0]);

                if (_Target != null) {
                    Me.Render(_Target);
                }
                var StartPoint = { X: 0, Y: 0 };
                HTMLElementPanel.dblclick(function (ev) {
                    if (!Agi.Controls.IsControlEdit) {
                        if (!Me.IsPageView) {
                            Agi.Controls.ControlEdit(Me); //控件编辑界面
                        }
                    }
                });
                if (HTMLElementPanel.touchstart) {
                    HTMLElementPanel.touchstart(function (ev) {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    });
                } else {
                    HTMLElementPanel.mousedown(function (ev) {
                        if (!Me.IsPageView) {
                            Agi.Controls.BasicPropertyPanel.Show(this.id);
                        }
                    });
                }
                Me.Set("ProPerty", ThisProPerty);
                Me.Set("Position", PostionValue);
                Me.BindChart();
                obj = ThisProPerty = PagePars = PostionValue = null;
            }
            if (_Config.hasOwnProperty("ThemeName")) {
                this.ChangeTheme(_Config.ThemeName);
            }
        }
    },
    InEdit: function () {
    }, //编辑中
    ExtEdit: function () {

    }, //退出编辑
    ChangeTheme: function (_themeName) {
        if(!_themeName){
            return;
        }
        //1.根据当前控件类型和样式名称获取样式信息
        var StyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(this.Get("ControlType"), _themeName);
        //2.保存主题名称
        this.Set("ThemeName", _themeName);
        //3.应用当前控件的信息
        Agi.Controls.SpcDemoPCLabel.OptionsAppSty(StyleValue, this);
    }
});
/*应用样式，将样式应用到控件的相关参数以更新相关显示
* _StyConfig:样式配置信息
* _PCLabel:控件相关参数信息
* */
Agi.Controls.SpcDemoPCLabel.OptionsAppSty = function (_StyConfig, _PCLabel) {
    if (_StyConfig != null) {
        var conObj = _PCLabel.Get("HTMLElement").id;
        $('#' + conObj + ' .children').css('background-color', 'none');
        $('#' + conObj + ' .children').css('border', _StyConfig.border);
        $('#' + conObj + ' .children').css('background', _StyConfig.background);
        $('#' + conObj + ' .children').css('font-size', _StyConfig.fontSize);
        $('#' + conObj + ' .children').css('color', _StyConfig.color);
        $('#' + conObj + ' .children>div').css('background', _StyConfig.titlebackground);
        $('#' + conObj + ' .children>div').css('border-bottom', _StyConfig.borderbottom);
    }
}
/*BasicChart参数更改处理方法*/
Agi.Controls.PCLabelAttributeChange = function (_ControlObj, Key, _Value) {
    var Me = this;
    if (Key == "Position") {
        if (layoutManagement.property.type == 1) {
            var ThisHTMLElementobj = $("#" + _ControlObj.Get("HTMLElement").id);
            var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

            var ParentObj = ThisHTMLElementobj.parent();
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            ThisHTMLElementobj.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
            ThisHTMLElementobj.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");

            var ThisControlPars = { Width: parseInt(PagePars.Width * (1 - _Value.Left - _Value.Right)),
                Height: parseInt(PagePars.Height * (1 - _Value.Top - _Value.Bottom))
            };

            ThisHTMLElementobj.width(ThisControlPars.Width);
            ThisHTMLElementobj.height(ThisControlPars.Height);
            ThisControlObj.setSize(ThisControlPars.Width, ThisControlPars.Height); /*Chart 更改大小*/
            ThisControlObj.Refresh(); /*Chart 更改大小*/
            PagePars = null;
        }
    }
}
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitSpcDemoPCLabel = function () {
    return new Agi.Controls.SpcDemoPCLabel();
}
//BasicChart 自定义属性面板初始化显示
Agi.Controls.PCLabelProrityInit = function (_PCLabel) {
    var Me = _PCLabel;
    var ThisProPerty = Me.Get("ProPerty");
    var PropertyData = ThisProPerty.BasciObj.propertyData;
    var ThisProItems = [];
    //4.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    var ItemContent = new Agi.Script.StringBuilder();
    //属性配置
    ItemContent = $('<div class="BasicChart_Pro_Panel">' +
    '<table  class="prortityPanelTable" border="0" cellspacing="1" cellpadding="0">' +
    '<tr>' +
   '<td class="prortityPanelTabletd0">USL:</td><td  class="prortityPanelTabletd1"><input data-field="USL" id="USL" type="number" min="0" max="1000" class="ControlProNumberSty" value="" /></td>' +
   '<td  class="prortityPanelTabletd0">LSL:</td><td  class="prortityPanelTabletd1"><input data-field="LSL" id="LSL" type="number" min="0" max="1000" class="ControlProNumberSty" value=""/></td>' +
    '</tr>' +
    '<tr>' +
    '<td class="prortityPanelTabletd0">目标:</td><td  class="prortityPanelTabletd1"><input data-field="Target" id="Target" type="number" min="0" max="1000" class="ControlProNumberSty" value=""/></td>' +
    '<td class="prortityPanelTabletd0">组数:</td><td  class="prortityPanelTabletd1"><input data-field="Nrow" id="Nrow" type="number" min="1" max="10" class="ControlProNumberSty" value=""/></td>' +
    '</tr>' +
     '<tr>' +
     '<td class="prortityPanelTabletd0">分类:</td><td  class="prortityPanelTabletd1"><select data-field="pctype" id="pctype"> <option value=""></option><option value="1">统计值</option><option value="2">常量</option><option value="3">计算值</option><option value="4">实测性能</option><option value="5">工序能力(组内)</option><option value="6">工序能力(整体)</option><option value="7">预期性能(组内)</option><option value="8">预期性能(整体)</option><option value="9">其他值</option></select></td>' +
    '<td class="prortityPanelTabletd0"></td><td class="prortityPanelTabletd1"><input type="button" value="保存" id="PCLabelPropertySave"></td>' +
    '</tr>' +
    '</table>' +
    '</div>');
    var BasicObj = ItemContent;
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: BasicObj }));
    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        var itemtitle = _item.Title;
        if (_item.DisabledValue == 0) {
            itemtitle += "禁用";
        } else {
            itemtitle += "启用";
        }
        alert(itemtitle);
    }
    //5.初始化属性项显示
    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
    $("#USL").val(PropertyData.USL);
    $("#LSL").val(PropertyData.LSL);
    $("#Target").val(PropertyData.Target);
    $("#Nrow").val(PropertyData.Nrow);
    $("#pctype").val(PropertyData.pctype);
    $('.prortityPanelTabletd1>input').change(function (obj) {
        var pName = $(this).data('field');
        switch (pName) {
            case "USL":
                PropertyData.USL = $(this).val();
                break;
            case "LSL":
                PropertyData.LSL = $(this).val();
                break;
            case "Target":
                PropertyData.Target = $(this).val();
                break;
            case "Nrow":
                PropertyData.Nrow = $(this).val();
                break;
        }
    });
    $("#PCLabelPropertySave").click(function () {
        ThisProPerty.BasciObj.propertyData = PropertyData;
        Me.Set("ProPerty", ThisProPerty);
        var _entity = Me.Get("Entity");
        Me.AddEntity(_entity[0]);
    });
    $("#pctype").change(function () {
        PropertyData.pctype = $("#pctype").val() == "" ? "1" : $("#pctype").val(); //类别
    });
}