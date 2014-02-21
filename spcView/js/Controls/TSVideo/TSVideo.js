/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.TSVideo = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){ //获得实体数据

        },
        initData:function (data) {
            var that = this;
            if (data) {
                var control = this.Get("ProPerty").BasciObj;
                //加载控件
                control.load("JS/Controls/TSVideo/video.html", function () {
                    that.playVideo(control);
                });
            }
        },
        playVideo:function (control) {
            var propertySettings = this.Get("PropertySettings");
            if (control.find("video").parent().css("display") != 'none') {
                control.find("video").attr("src", propertySettings.videoSource)[0].play();
            }
            else {
                var pl=control.find("embed")[0].playlist;
                var vidx=pl.add(propertySettings.videoSource2);
                pl.playItem(vidx);
            }

        },
        Render:function (_Target) {
            //
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
            }
        },
        ResetProperty:function () {
            $('#' + this.shell.ID).resizable({
                minHeight:60,
                minWidth:180
            });
            return this;
        },
        ReadData:function (et) {
            //
            return;
            //
            this.changEntity = true;
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.Set("Entity", entity);
            //
            var that = this;
            //
            Agi.Utility.RequestData(et, function (d) {
                var dataArray = [];
                var data = d;
                var cols = et.Columns;
                $.each(data, function (i, item) {
                    $.each(cols, function (i2, col) {
                        if (item[col]) {
                            dataArray.push(item[col]);
                        }
                    })
                });
                //
                var TSVideoDataProperty = that.Get("TSVideoDataProperty");
                var dataProperty = TSVideoDataProperty.propertyData;
                //
                var data = TSVideoDataProperty.data;
                //
                data.usl = dataProperty.usl;
                data.lsl = dataProperty.lsl;
                data.target = dataProperty.target;
                //最大值
                var i = dataArray[0];
                for (n = 0; n < dataArray.length; n++) {
                    if (i < dataArray[n]) {
                        i = dataArray[n];
                    }
                }
                data.zuidazhi = i;
                //
                var i = dataArray[0];
                for (n = 0; n < dataArray.length; n++) {
                    if (i > dataArray[n]) {
                        i = dataArray[n];
                    }
                }
                data.zuixiaozhi = i;
                //
                data.ceshishuliang = dataArray.length;
                //webservice回调
                var json = {'action':'RCalHistogram', 'dataArray':dataArray, 'sampleLength':'', 'USL':'', 'LSL':'', 'specValue':''};
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName":"RCalHistogram",
                        "Paras":jsonString,
                        "CallBackFunction":function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var histoReturn = result;
                                data.zizushuliang = histoReturn.data.groupNumber;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //
                var json = {'action':'RCalNormalDis', 'dataArray':dataArray, 'nrow':dataProperty.nrow};
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName":"RCalNormalDis",
                        "Paras":jsonString,
                        "CallBackFunction":function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var normalReturn = result;
                                data.junzhi = normalReturn.data.xBarBar;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //
                var json = {'action':'RCalProcessCap', 'dataArray':dataArray, 'USL':dataProperty.usl, 'LSL':dataProperty.lsl, 'nrow':dataProperty.nrow, 'sampleLength':'', 'constantArray':'' };
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName":"RCalProcessCap",
                        "Paras":jsonString,
                        "CallBackFunction":function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var pcReturn = result;
                                data.bianyixishu = pcReturn.data.CV;
                                data.cp = pcReturn.data.Cp;
                                data.cr = pcReturn.data.Cr;
                                data.Cpk = pcReturn.data.Cpk;
                                data.Cpu = pcReturn.data.Cpu;
                                data.Cpl = pcReturn.data.Cpl;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                //
                var json = {'action':'RCalProcessPer', 'dataArray':dataArray, 'USL':dataProperty.usl, 'LSL':dataProperty.lsl};
                var jsonString = JSON.stringify(json);
                //
                Agi.DAL.ReadData(
                    {
                        "MethodName":"RCalProcessPer",
                        "Paras":jsonString,
                        "CallBackFunction":function (result) {
                            //alert(result.result);
                            if (result.result == "true") {
                                var ppReturn = result;
                                data.pp = ppReturn.data.Pp;
                                data.pr = ppReturn.data.Pr;
                                data.Ppk = ppReturn.data.Ppk;
                                data.Ppu = ppReturn.data.Ppu;
                                data.Ppl = ppReturn.data.Ppl;
                                //
                                that.initData(data);
                            }
                        }
                    }
                );
                return;
                var histoReturn = JSON.parse('{"result":"true","data":{"groupNumber":3,"groups":[{"lowerLimit":0.5,"upperLimit":2.5,"groupSize":2},{"lowerLimit":2.5,"upperLimit":4.5,"groupSize":2},{"lowerLimit":4.5,"upperLimit":6.5,"groupSize":2}]},"message":"返回成功"}');
                var pcReturn = JSON.parse('{"result":"true","data":{"CV":0,"Cp":-0.282,"Cpu":-0.282,"Cpl":-0.282,"Cpk":-0.282,"Cr":-3.5460992907801425},"message":"返回成功"}');
                var ppReturn = JSON.parse('{"result":"true","data":{"Pp":-0.0890870806374748,"Ppu":-0.44543540318737396,"Ppl":0.2672612419124244,"Ppk":0.2672612419124244,"Pr":-11.224972160321824},"message":"返回成功"}');
                var normalReturn = JSON.parse('{"result":"true","data":{"xBarBar":3.5,"sigma":1.8708286933869707},"message":"返回成功"}');
                var data = that.Get(data);
                if (!data) {
                    data = {
                        zuidazhi:0,
                        zuixiaozhi:0,
                        ceshishuliang:0,
                        zizushuliang:0,
                        zizudaxiao:0,
                        bianyixishu:0,
                        junzhi:0,
                        cp:0,
                        cr:0,
                        pp:0,
                        pr:0,
                        Cpk:0,
                        Ppk:0,
                        Cpu:0,
                        Ppu:0,
                        Cpl:0,
                        Ppl:0
                        //Cpm:0,
                        //Ppm:0
                    };
                }
                //
                data.bianyixishu = pcReturn.data.CV;
                data.junzhi = normalReturn.data.xBarBar;
                data.cp = pcReturn.data.Cp;
                data.cr = pcReturn.data.Cr;
                data.pp = ppReturn.data.Pp;
                data.pr = ppReturn.data.Pr;
                //
                data.Cpk = pcReturn.data.Cpk;
                data.Cpu = pcReturn.data.Cpu;
                data.Cpl = pcReturn.data.Cpl;
                //data.Cpm = pcReturn.data.Cpm;
                //
                data.Ppk = ppReturn.data.Ppk;
                data.Ppu = ppReturn.data.Ppu;
                data.Ppl = ppReturn.data.Ppl;
                //data.Ppm = pcReturn.data.Cpk;
                //
                that.Set(data);
                //
                that.initData(data);
            });
        },
        ReadOtherData:function (Point) {
            var ThisProPerty = this.Get("ProPerty");
            Agi.Msg.PointsManageInfo.AddPoint({ "ControlID":ThisProPerty.ID, "Points":[Point] });
            ThisProPerty.realtimeTag = Point;
            this.Set("ProPerty", ThisProPerty);
            var PropertySettings = this.Get("PropertySettings");
            PropertySettings.realtimeTag = Point;
            this.Set("PropertySettings", PropertySettings);
        },
        ReadRealData:function (MsgObj) {
            var ThisProPerty = this.Get("ProPerty");
            var DashboardChartProperty = ThisProPerty.BasciObj;
            if (!isNaN(MsgObj.Value)) {
                this.initData(MsgObj);
            }
        },
        ParameterChange:function (_ParameterInfo) {//参数联动
            //this.Set('Entity', this.Get('Entity'));
            this.ReadData(this.Get('Entity')[0]);
        },
        Init:function (_Target, _ShowPosition, trueid) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.AttributeList = [];
            this.Set("Entity", []);
            this.Set("ControlType", "TSVideo");
            //PropertySettings
            var PropertySettings = {
                videoSource:null
            }
            this.Set("PropertySettings", PropertySettings)
            //
            var ID = 0;
            if (trueid) {
                ID = trueid;
            }
            else {
                ID = "TSVideo" + Agi.Script.CreateControlGUID();
            }
            //
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='overflow:hidden ;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID:ID,
                width:300,
                height:400,
                divPanel:HTMLElementPanel
            });
            //
            var TSVideoBasicProperty = {
                TSVideoTextField:undefined,
                TSVideoValueField:undefined,
                LeftFillet1:0,
                LeftFillet2:0,
                RightFillet1:0,
                RightFillet2:0,
                fontSize:"14",
                fontColor:"black",
                bgColor:"white",
                FontText:"test",
                borderWidth:0,
                borderColor:"red",
                hrefAddress:"",
                IsDisabledhrefAddress:"disabled",
                OpenPosition:"",
                IsDisabledOpenPosition:"disabled",
                InsideLinkAddress:"",
                IsDisabledInsideLinkAddress:null,
                IsLink:null,
                IsShadow:null
            };
            this.Set("TSVideoBasicProperty", TSVideoBasicProperty);
            //
            //  Agi.Controls.objTSVideo = ToUrl;
            var getTSVideoProperty = this.Get("TSVideoBasicProperty");
            var BaseControlObj = $('<div id="' + ID + '" class="TSVideoPor" value="">'
                + '<div id="TSVideoObjId">'
                + '</div>'
                + '</div>');
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID:ID,
                BasciObj:BaseControlObj
            };
            var PostionValue = { Left:0, Top:0, Right:0, Bottom:0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width:$(obj).width(), Height:$(obj).height(), Left:0, Top:0 };
            this.Set("ProPerty", ThisProPerty);
            // this.Set("HTMLElement", ThisProPerty.BasciObj[0]);
            this.Set("ThemeInfo", null);
            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(320);
                HTMLElementPanel.height(240);
                //BaseControlObj.height($('.HTMLElementPanel').height() - 14);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("PanelSty");
                HTMLElementPanel.addClass("AutoFill_PanelSty");
                obj.html("");
            }
            if (_Target != null) {
                this.Render(_Target);
            }
            var StartPoint = { X:0, Y:0 }
            var self = this;
            /*事件绑定*/
            if (Agi.Edit) {
                $('#' + self.shell.ID).live('mousedown', function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
                $('#' + self.shell.ID).live('dblclick', function (ev) {
                    if (!Agi.Controls.IsControlEdit) {
                        Agi.Controls.ControlEdit(self);//控件编辑界面
                    }
                });
                if (HTMLElementPanel.touchstart) {
                    HTMLElementPanel.touchstart(function (ev) {
                        Agi.Controls.BasicPropertyPanel.Show(this.id);
                    });
                }
            }
            //
            this.Set("Position", PostionValue);
            //
//            Agi.Msg.PageOutPramats.AddPramats({
//                'Type': Agi.Msg.Enum.Controls,
//                'Key': ID,
//                'ChangeValue': [{ 'Name': 'selectedValue', 'Value': -1 }]
//            });
            //输出参数,无
            obj = ThisProPerty = PagePars = PostionValue = TSVideoFilter = null;
            //缩放最小宽高设置
            if (Agi.Edit) {
                HTMLElementPanel.resizable({
                    minHeight:32,
                    minWidth:32
                });
            }
            var control = this.Get("ProPerty").BasciObj;
            //加载控件
            control.load("JS/Controls/TSVideo/video.html");
        },
        Destory:function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/
            Agi.Edit.workspace.controlList.remove(this);
            //Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/
            $("#" + HTMLElement.id).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        CustomProPanelShow:function () {
            Agi.Controls.TSVideoPropertyInit(this);
        },
        Copy:function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PostionValue = this.Get("Position");
                var newTSVideoPositionpars = { Left:parseFloat(PostionValue.Left), Top:parseFloat(PostionValue.Top) }
                var NewTSVideo = new Agi.Controls.TSVideo();
                NewTSVideo.Init(ParentObj, newPanelPositionpars);
                newTSVideoPositionpars = null;
                return NewTSVideo;
            }
        },
        PostionChange:function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $("#" + this.Get("HTMLElement").id).parent();
                var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
                var _ThisPosition = {
                    Left:(_Postion.Left / PagePars.Width).toFixed(4),
                    Top:(_Postion.Top / PagePars.Height).toFixed(4),
                    Right:(_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom:(_Postion.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                //var ParentObj=$(this.Get("HTMLElement")).parent();
                var ParentObj = $("#BottomRightCenterContentDiv");
                var PagePars = { Width:ParentObj.width(), Height:ParentObj.height(), Left:ParentObj.offset().left, Top:ParentObj.offset().top };
                var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                var ThisControlPars = { Width:ThisHTMLElement.width(), Height:ThisHTMLElement.height(), Left:(ThisHTMLElement.offset().left - PagePars.Left), Top:(ThisHTMLElement.offset().top - PagePars.Top), Right:0, Bottom:0 };
                ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
                ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);
                var _ThisPosition = {
                    Left:(ThisControlPars.Left / PagePars.Width).toFixed(4),
                    Top:(ThisControlPars.Top / PagePars.Height).toFixed(4),
                    Right:(ThisControlPars.Right / PagePars.Width).toFixed(4),
                    Bottom:(ThisControlPars.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }
        },
        FilterChange:function (_Fillter) {
            if (_Fillter != null && _Fillter.LeftFillet1 != null && _Fillter.LeftFillet2 != null && _Fillter.RightFillet1 != null && _Fillter.RightFillet2 != null) {
                this.Set("TSVideoBasicProperty", _Fillter);
                _Fillter = null;
            }
        },
        Refresh:function () {
            var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
            var ParentObj = ThisHTMLElement.parent();
            var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
            var PostionValue = this.Get("Position");
            PostionValue.Left = parseFloat(PostionValue.Left);
            PostionValue.Right = parseFloat(PostionValue.Right);
            PostionValue.Top = parseFloat(PostionValue.Top);
            PostionValue.Bottom = parseFloat(PostionValue.Bottom);
            var ThisControlPars = { Width:parseInt(PagePars.Width - (PagePars.Width * (PostionValue.Left + PostionValue.Right))),
                Height:parseInt(PagePars.Height - (PagePars.Height * (PostionValue.Top + PostionValue.Bottom)))
            };
            ThisHTMLElement.width(ThisControlPars.Width);
            ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
            this.Set("Position", this.Get("Position"))
        },
        Checked:function () {
            $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked:function () {
            $("#" + this.Get("HTMLElement").id).css({"-webkit-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000"});
            /*   $("#" + this.Get("HTMLElement").id).css({ "-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
             "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"
             });*/
        },
        HTMLElementSizeChanged:function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", {Left:0, Right:0, Top:0, Bottom:0});//由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh();//每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        EnterEditState:function (size) {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width:obj.width(),
                height:obj.height()
            }
            if (size) {
                obj.css({ "width":size.width, "height":size.height }).find('li[class*="dropdown"]').removeClass('open');
            }
            //
            var width = $("#ControlEditPageLeft").css("width");
            var height = $("#ControlEditPageLeft").css("height");
            //
            this.shell.Container.width(width);
            this.shell.Container.height(height);
        },
        BackOldSize:function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
                obj.resizable({
                    minHeight:100,
                    minWidth:100
                });
            }
        },
        ControlAttributeChangeEvent:function (_obj, Key, _Value) {
            switch (Key) {
                case"Position":
                    if (layoutManagement.property.type == 1) {
                        var ThisHTMLElement = $("#" + this.Get("HTMLElement").id);
                        var ParentObj = ThisHTMLElement.parent();
                        var PagePars = { Width:ParentObj.width(), Height:ParentObj.height() };
                        ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                        ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                        ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                        ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                    }
                    break;
                case "TSVideoBasicProperty":
                    if (layoutManagement.property.type == 1) {
                        var $UI = $('#' + this.shell.ID).find('.TSVideoPor');
                        $(this.Get('HTMLElement')).css("border-top-left-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-top-right-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-bottom-left-radius", "5px");
                        $(this.Get('HTMLElement')).css("border-bottom-right-radius", "5px");
                        $('#' + this.shell.ID).find('#TSVideoObjId').css({"font-size":"" + _Value.fontSize + "px"});
                        $('#' + this.shell.ID).find('#TSVideoObjId').css({"color":"" + _Value.fontColor + ""});
                        /*if (_Value.FontText) {
                         $('#' + this.shell.ID).find('#TSVideoObjId').text(_Value.FontText);
                         }
                         else if (_Value.TSVideoTextField) {
                         $('#' + this.shell.ID).find('#TSVideoObjId').text(_Value.TSVideoTextField);
                         }*/
                        //$(this.Get('HTMLElement')).css({"background-color":"" + _Value.bgColor + ""});
                        // $("#"+propertyTSVideo.shell.BasicID).css({" text-align":""+fontPosition+""});  TSVideoObjId
                        $UI.css({"border-width":"" + _Value.borderWidth + ""});
                        $UI.css({"border-color":"" + _Value.borderColor + ""});
                        if (_Value.hrefAddress != "" || _Value.InsideLinkAddress != "") {
                            $UI.css({"text-decoration":"underline", "cursor":"pointer"});
                        }
                    }
                    break;
                    var self = _obj;
                case "data"://用户选择了一个项目
                {
                    var data = _ControlObj.Get('data');
                    if (data.selectedValue.value) {
                        //alert('您选择了:'+data.selectedValue.value +'\n'+ data.selectedValue.text);
                        var ThisProPerty = _ControlObj.Get("ProPerty");
                        Agi.Msg.PageOutPramats.PramatsChange({
                            'Type':Agi.Msg.Enum.Controls,
                            'Key':ThisProPerty.ID,
                            'ChangeValue':[
                                { 'Name':'selectedValue', 'Value':data.selectedValue.value }
                            ]
                        });
                        Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_obj, "Type":Agi.Msg.Enum.Controls});
                    }
                }
                    break;
                case "Entity"://实体
                {
                    var entity = _obj.Get('Entity');
                    if (entity && entity.length) {
                        //BindDataByEntity(_obj, entity[0]);
                        //this.ReadData(entity[0]);
                    } else {
                        var $UI = $('#' + self.shell.ID);
                        $UI.find('.TSVideoPor').text('');
                    }
                }
                    break;
            }//end switch
        },
        GetConfig:function () {
            var Property = this.Get("ProPerty");
            //
            var config = {
                ControlType:this.Get("ControlType"),
                ControlID:Property.ID,
                ControlBaseObj:Property.ID,
                HTMLElement:Property.ID,
                Entity:this.Get("Entity"),
                Position:this.Get("Position"),
                TSVideoBasicProperty:this.Get("TSVideoBasicProperty"),
                TSVideoPropertySettings:this.Get("PropertySettings"),
                ThemeInfo:this.Get("ThemeInfo")
            }
            //console.log(config.TSVideoPropertySettings)
            //console.log(JSON.stringify(this.Get("PropertySettings")))
            //
            //return JSON.stringify(config);
            return config;
            //
            /*  var ConfigObj = new Agi.Script.StringBuilder();
             */
            /*配置信息数组对象*/
            /*
             ConfigObj.append("<Control>");
             ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>");
             */
            /*控件类型*/
            /*
             ConfigObj.append("<ControlID>" + ProPerty.ID + "</ControlID>");
             */
            /*控件属性*/
            /*
             ConfigObj.append("<ControlBaseObj>" + ProPerty.ID + "</ControlBaseObj>");
             */
            /*控件基础对象*/
            /*
             ConfigObj.append("<HTMLElement>" + ProPerty.ID + "</HTMLElement>");
             */
            /*控件的外壳HTML元素信息*/
            /*

             ConfigObj.append("<Entity>" + JSON.stringify(this.Get("Entity")) + "</Entity>");
             */
            /*控件的外壳HTML元素信息*/
            /*
             ConfigObj.append("<Position>" + JSON.stringify(this.Get("Position")) + "</Position>");
             */
            /*控件位置信息*/
            /*
             ConfigObj.append("<TSVideoBasicProperty>" + JSON.stringify(this.Get("TSVideoBasicProperty")) + "</TSVideoBasicProperty>");
             //
             var PropertySettings = this.Get("PropertySettings");
             ConfigObj.append("<PropertySettings>" + JSON.stringify(PropertySettings) + "</PropertySettings>");
             //
             */
            /*控件位置信息*/
            /*
             ConfigObj.append("<ThemeInfo>" + JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>");
             */
            /*控件位置信息*/
            /*
             ConfigObj.append("</Control>");
             return ConfigObj.toString(); //返回配置字符串*/
            var TSVideoControl = {
                Control:{
                    ControlType:this.Get("ControlType"), //*控件类型*//
                    ControlID:ProPerty.ID, //*控件属性*//
                    ControlBaseObj:ProPerty.ID, //*控件基础对象*//
                    HTMLElement:ProPerty.ID, //*控件的外壳HTML元素信息*//
                    Entity:this.Get("Entity"), //*实体*//
                    Position:this.Get("Position"), //*控件位置信息*//
                    TSVideoBasicProperty:this.Get("TSVideoDataProperty"), //*控件基本属性*//
                    ThemeInfo:this.Get("ThemeInfo")
                }
            }
            return TSVideoControl.Control;
        }, //获得TSVideo控件的配置信息
        CreateControl:function (_Config, _Target) {
            this.Init(_Target, _Config.Position, _Config.HTMLElement, _Config.ControlID);
            if (_Config != null) {
                var TSVideoBasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.Entity = _Config.Entity;
                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);
                    _Config.ThemeInfo = _Config.ThemeInfo;
                    TSVideoBasicProperty = _Config.TSVideoBasicProperty;
                    this.Set("TSVideoBasicProperty", TSVideoBasicProperty);
                    var PropertySettings = _Config.TSVideoPropertySettings;
                    this.Set("PropertySettings", PropertySettings);
                    var ThisProPerty = this.Get('ProPerty');
                    //ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);
                    $("#" + ThisProPerty.ID).css({"font-size":"" + TSVideoBasicProperty.fontSize + "px"});
                    $("#" + ThisProPerty.ID).css({"color":"" + TSVideoBasicProperty.fontColor + ""});
                    //$("#" + ThisProPerty.ID).css({"background-color":"" + TSVideoBasicProperty.bgColor + ""});
                    $("#" + ThisProPerty.ID).val(TSVideoBasicProperty.FontText);
                    $("#" + ThisProPerty.ID).css({"border-width":"solid " + TSVideoBasicProperty.borderWidth + ""});
                    $("#" + ThisProPerty.ID).css({"border-color":"" + TSVideoBasicProperty.borderColor + ""});
                    if (TSVideoBasicProperty.hrefAddress != "" || TSVideoBasicProperty.InsideLinkAddress != "") {
                        $("#" + ThisProPerty.ID).css({"text-decoration":"underline"});
                    }
                    var PagePars = {Width:_Targetobj.width(), Height:_Targetobj.height()};
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);
                    var ThisControlPars = {Width:parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height:parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))};
                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");
                    this.Set("Entity", _Config.Entity);
                    //this.ReadData(_Config.Entity[0]);
                    //
                    this.initData(PropertySettings.videoSource)
                }
            }
        }//根据配置信息创建控件
    }, true);
//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitTSVideo = function () {
    return new Agi.Controls.TSVideo();
}
//
function SetFilletPC() {
    var LeftFillet1 = parseInt($("#LeftFillet1").val());
    var RightFillet1 = parseInt($("#RightFillet1").val());
    var LeftFillet2 = parseInt($("#LeftFillet2").val());
    var RightFillet2 = parseInt($("#RightFillet2").val());
    if (LeftFillet1 >= 0 && RightFillet1 >= 0 && LeftFillet2 >= 0 && RightFillet2 >= 0) {
        var TSVideoBasicProperty = { LeftFillet1:LeftFillet1, RightFillet1:RightFillet1, LeftFillet2:LeftFillet2, RightFillet2:RightFillet2, FilterBgColor:FilterBgColor };
//        _Panel.Set("PanelFilter", PanelFilter);
        Agi.Edit.workspace.currentControls[0].FilterChange(TSVideoBasicProperty)
    } else {
        if (LeftFillet1 < 0) {
            $("#LeftFillet1").val(0);
            SetFilletPC();
        }
        if (RightFillet1 < 0) {
            $("#RightFillet1").val(0);
            SetFilletPC();
        }
        if (LeftFillet2 < 0) {
            $("#LeftFillet2").val(0);
            SetFilletPC();
        }
        if (RightFillet2 < 0) {
            $("#RightFillet2").val(0);
            SetFilletPC();
        }
    }
}
//
$("head").append($("<script type='text/javascript' src='JS/Controls/TSVideo/TSVideoProperty.js'></script>"));
