/**
* Created with JetBrains WebStorm.
* User: 刘文川
* Date: 12-10-24
* Time: 上午10:17
 *Update:20130812
 *Detail:单值图功能完善与扩展
* To change this template use File | Settings | File Templates.
*/
Namespace.register("Agi.Controls"); /*添加 Agi.Controls命名空间*/

Agi.Controls.SeqChart = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
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
        ResetProperty: function () {
            $('#' + this.shell.ID).resizable({
                minHeight: 100,
                minWidth: 200
            });
            return this;
        },
        ReadData: function (_EntityInfo) {
            if (!_EntityInfo) {
                this.ReadOtherData("");
                return;
            }
            var Me = this;
            var entity = [];
            this.Set("EntityInfo", _EntityInfo);
            Me.Set("PlotLines",[]);

            Agi.Utility.RequestData2(_EntityInfo, function (d) {
                //20130104 14:24 markeluo 修改，调整DataSet 列显示顺序后，进入控件的属性编辑界面，下方的数据表格中列顺序未更改
                _EntityInfo.Data = d.Data;
                _EntityInfo.Columns = d.Columns;
                //默认绑定字段
                var cp = Me.Get('ChartProperty')
                Me.Set('ChartProperty',cp);
                
                entity.push(_EntityInfo);
                Me.Set("Entity", entity);

                Me.AddEntity(entity[0]); /*添加实体*/
                Me.chageEntity = true;
                
                Me.dealEntityData();
                Me.ChartLoadByData();
            });
        },
        ChartLoadByData:function(_Data){
            var Me=this;
            var formatData=Me.Get("formatData");
            var chart=this.paintChartWithFormatData(formatData);
            
            Me.Set("chart",chart);
            Me.chart = chart;
        },//图表加载数据
        ShowDataTable:function(){

        },//显示表格数据
        AddEntity: function (_entity) {
            var Me = this;
            Me.FilterPropertysFromData(_entity.Data);
            Me.showColumnDefine();
            if (Agi.Controls.IsControlEdit) {
                Agi.Controls.ShowControlData(Me);//更新实体数据显示
            }
        },
        /**
         * 从数据中抽取属性名供用户选择出[过程][来源][时间列]
         * @param data 接口数据,数组,预期每个数组元素具有的属性都是一样的(本方法只是用第一个元素的属性,之后不同的将被忽略)
         */
        FilterPropertysFromData:function(data){
        	if(data && data.length>0){
        		var aProplist=[];
        		for(var prop in data[0]){
        			aProplist.push(prop);
        		}
        		this.Set("proplist",aProplist);
        	}
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
        	this.shell = null;
            this.AttributeList = [];
            var ID = savedId ? savedId : "CustomSingleChart" + Agi.Script.CreateControlGUID();
            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty SPCPanelSty'></div>");

            var PostionValue ={ Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };

            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: PagePars.Width,
                height:PagePars.Height,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<div id="' + ID + '" style="width:100%;height:100%;margin: 0 auto;border:solid 1px #dcdcdc;">' + '</div>');
            this.shell.initialControl(BaseControlObj);
            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            this.Set("ProPerty", ThisProPerty);
            this.Set("ThemeInfo", null);
            if (layoutManagement.property.type == 1) {
                HTMLElementPanel.width(450);
                HTMLElementPanel.height(200);
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

            //设置预设图形属性
            this.SetChartProperty(ID);

            var StartPoint = { X: 0, Y: 0 }
            var self = this;
            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                ev.stopPropagation();
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });
            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    Agi.Controls.ControlEdit(self); //控件编辑界面
                }
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);

            if (Agi.Edit) {
                //缩小的最小宽高设置
                HTMLElementPanel.resizable({
                    minHeight:200,
                    minWidth: 350
                });
            }
            //20130515 倪飘 解决bug，组态环境中拖入单值图控件以后拖入容器框控件，容器框控件会覆盖单值图控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        },//end Init
        SetChartProperty: function (_objCanvasAreaID) {//初始化定义图形控件属性结构，并预设值属性，_objCanvasAreaID：画布显示区域ID
            //图形基本结构定义
            var chartProperty = {
                chart_Data_Type: "单独值",
                chart_Data_NRow: 6,
                chart_PointNumber: 20, //当前图形范围所显示的点位
                chart_RenderTo: _objCanvasAreaID, //画布ID
                chart_Type: 'line', //'spline',//显示图形
                chart_MarginTop: 30, //图形距画框右边距距离
                chart_MarginRight: 80, //图形距画框右边距距离
                chart_Reflow: true, //图形是否跟随放大
                chart_Animation: false, //动画平滑滚动
                chart_PlotBorderWidth: 1, //数据图表区域边框宽度
                chart_PlotBorderColor: "#5c5757", //数据图表区域边框颜色
                chart_BackgroundColor:{"linearGradient":{"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#ededed"],[1,"#cbcbcb"]]}, //"#C9E8E2",//数据图表区域颜色
                
                serial_colors: [
        	             '#4572A7', 
        	             '#AA4643', 
        	             '#89A54E', 
        	             '#80699B', 
        	             '#3D96AE', 
        	             '#DB843D', 
        	             '#92A8CD', 
        	             '#A47D7C', 
        	             '#B5CA92'
        	          ]//曲线默认颜色
            };
            this.Set('ChartProperty', chartProperty); //保存属性结构
        },
        InitHighChart: function () {//初始化图形控件
            var Me=this;
            var cp = this.Get('ChartProperty');
            if (cp.chart_RenderTo) {
                Highcharts.setOptions({
                    global: {
                        useUTC: false//不使用夏令时
                    }
                });
                var chart=this.initDefaultStockChart(cp.chart_RenderTo);
                this.Set('chart', chart);
                this.chart = chart;
            }
        },
        CustomProPanelShow: function () {//显示自定义属性面板
        	Agi.Controls.SeqChartColumnDefineInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
//            Agi.Edit.workspace.removeParameter(proPerty.ID); /*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length = 0; /*清除选中控件对象*/
//            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中

            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewSPCSingleChart = Agi.Controls.InitSPCSingleChart();
                NewSPCSingleChart.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewSPCSingleChart;
            }
        },
        PostionChange: function (_Postion) {
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                var _ThisPosition = {
                    Left: (_Postion.Left / PagePars.Width).toFixed(4),
                    Top: (_Postion.Top / PagePars.Height).toFixed(4),
                    Right: (_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
                }

                //                //缩小的最小宽高设置
                //                HTMLElementPanel.resizable({
                //                    minHeight: 200,
                //                    minWidth: 300
                //                });

                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                var ThisHTMLElement = $(this.Get("HTMLElement"));
                var ParentObj = ThisHTMLElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };
                var ThisControlPars = { Width: ThisHTMLElement.width(), Height: ThisHTMLElement.height(), Left: (ThisHTMLElement.offset().left - PagePars.Left), Top: (ThisHTMLElement.offset().top - PagePars.Top), Right: 0, Bottom: 0 };
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
        Refresh: function () {
            var Me=this;
            var ThisHTMLElement = $(this.Get("HTMLElement"));
            var ParentObj = ThisHTMLElement.parent();
            if (!ParentObj.length) {
                return;
            }
            if (!Agi.Edit){
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
                ThisHTMLElement.css("left", (parseInt(PostionValue.Left * PagePars.Width)) + "px");
                ThisHTMLElement.css("top", (parseInt(PostionValue.Top * PagePars.Height)) + "px");
            }else{
               var ThisControlObj= Me.Get('chart');
                ThisControlObj.setSize(ThisHTMLElement.width(),ThisHTMLElement.height());/*Chart 更改大小*/
            }
            $(window).resize();
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        Checked: function () {
            if (!Agi.Edit) return;
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            if (!Agi.Edit) return;
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
        },
        EnterEditState: function () {
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css({ "width": '100%', "height": '100%' });

            //this.ShowDeleteSeries(this);
            //框架重新设置
            $(window).resize();
        },
        BackOldSize: function () {
            if (this.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            //框架重新设置
            $(window).resize();
        },
        InEdit:function(){
            var Me=this;
            Me.UnChecked();
            Me.Refresh(); //重新刷新显示
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.SeqChartAttributeChange(this, Key, _Value);
        },
        GetConfig: function () {
            var ProPerty = this.Get("ProPerty");
            var SPCSingleChartControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基础对象
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    BasicProperty: null, //控件基本属性
                    ChartProperty: null, //chart的属性
                    ChartSeries: null, //chart系列
                    PointsParamerters: null, //位置参数
                    Position: null, //控件位置
                    EntityInfo: null,//实体信息
                    ThemeInfo: null,//主题
                    DataExtractConfig:null//数据钻取配置
                }
            }
            SPCSingleChartControl.Control.ControlType = this.Get("ControlType");
            SPCSingleChartControl.Control.ControlID = ProPerty.ID;
            SPCSingleChartControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            SPCSingleChartControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            SPCSingleChartControl.Control.Entity = Entitys;
            SPCSingleChartControl.Control.BasicProperty = this.Get("BasicProperty");
            SPCSingleChartControl.Control.ChartProperty = this.Get("ChartProperty");
            SPCSingleChartControl.Control.ChartSeries = this.Get("ChartSeries");
            SPCSingleChartControl.Control.PointsParamerters = this.Get("PointsParamerters");
            SPCSingleChartControl.Control.Position = this.Get("Position");
            SPCSingleChartControl.Control.EntityInfo = this.Get("EntityInfo");
            SPCSingleChartControl.Control.ThemeInfo = this.Get("ThemeInfo");

            return SPCSingleChartControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
        	this.Init(_Target, _Config.Position, _Config.HTMLElement);
        	if (_Config != null) {
                var chartProperty = null;
                var chartSeries = null;
                var pointsParamerters = [];
                var entityInfo = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);
                    _Config.Entity = _Config.Entity;
                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);
                    _Config.ThemeInfo = _Config.ThemeInfo;
                    chartProperty = _Config.ChartProperty;
                    this.Set("ChartProperty", chartProperty);
                    chartSeries = _Config.ChartSeries;
                    this.Set("ChartSeries", chartSeries);
                    pointsParamerters = _Config.PointsParamerters;
                    this.Set("PointsParamerters", pointsParamerters);
                    entityInfo = _Config.EntityInfo;
                    this.Set("EntityInfo", entityInfo);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height() };
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);

                    var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height: parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))
                    };

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                    this.Set("Entity", _Config.Entity);
                    this.Set("columnDefine",_Config.ColumnDefine);
                	this.ReadData(entityInfo);
                    //测试数据
                }
            }
        	
        }, //根据配置信息创建控件
        SPCViewMenus: function () {
            var Me = this;
            var viewmenus = [];
            return viewmenus;
        },
        GetSPCViewGridData:function(){
            var Me=this;
            var cp = Me.Get('ChartProperty');
            var GridData={
                ChartData: Me.Get("Entity")[0].Data,
                AlarmCells:[],
                AbnormalRows:[]
            };
            return GridData;
        },
      //[20131112:0904]defined by liuxing:sequence chart customer method.
        /**
         * 默认的时序图StockCharts显示
         * 不显示navigator(图上方的时间范围选择控件),tooltip(鼠标提示),navigator(图下方的时间范围拖拽控件)
         * 本方法包含一组捏造的数据,必要时可以修改
         * @param renderTo 容纳StockCharts的DIV ID
         * @returns 图标对象
         */
        initDefaultStockChart:function(rendTo){
        	return Highcharts.StockChart( {
        		credits:{
        			enabled:false
        		},
        	    chart: {
        	    	renderTo: rendTo,
        	    	backgroundColor: {
    		            linearGradient: {
    	                    x1: 1, 
    	                    y1: 0, 
    	                    x2: 1, 
    	                    y2: 1
    	                },
    	                stops: [
    		                [0, 'rgb(255, 255, 255)'],
    		                [1, 'rgb(200, 200, 255)']
    		            ]
    		        }
        	    },
        	    title : {
    				text : 'SPC控件-时序图[样例:无数据]'
    			},
        	    navigator: {
        	    	enabled: false
        	    },
        	    tooltip: {
        	    	enabled:false
        	    },
        	    rangeSelector: {
        	    	enabled:false
        	    },
        	    yAxis: {
        	    	labels: {
        	    		formatter: function() {
        	    			return (this.value > 0 ? '+' : '') + this.value + '%';
        	    		}
        	    	},
        	    	plotLines: [{
        	    		value: 0,
        	    		width: 2,
        	    		color: 'silver'
        	    	}]
        	    },
        	    plotOptions: {
        	    	series: {
        	    		compare: 'percent'
        	    	}
        	    },
        	    series:aSeqDefaultChartData
        	});
        },
        /**
         * data必须符合以下格式要求
         * 1.是一个规范的json数组
         * 2.数组的每个元素必须有:datetime属性(时刻),src属性(来源),多于0个值属性(过程)
         * @param data 数据源控件提供的数据源,JSON数组
         * @return 一个格式为{"serialList":[],'srcList':[],'stockData':{}}的JSON对象</br>
         * 		   其中serialList是过程集合,srcList是来源集合,stockData为整理好的stockChart serial数据,可直接供图表使用
         */
        dealEntityData:function(){
        	var _entity=this.Get("Entity")[0];
        	if(!_entity){
        		AgiCommonDialogBox.Alert("时序图找不到数据来源");
        		return;
        	}
        	var data=_entity.Data,colDefine=this.Get("columnDefine");
        	var srcName=colDefine.src;//数据源中[来源]的属性名
        		datetimeName=colDefine.datetime//数据源中[时刻]的属性名
        		result={"serialList":[],'srcList':[],'stockData':{}},//整理好的目标对象
        		oSerialTmpData={};//中间(临时)图标数据对象
        	//从data中统计 [过程]和[来源] 的列表,用来生成右侧属性列表
        	//将data的格式换算成stockchart能接受的格式,用来生成图表
        	var viewGridData=[];
        	if(data && data.length>0){
        		for(var i in data){
        			var tmpobj=data[i],
        				srcSpercificName=tmpobj[srcName],//[来源]名
        				datetimeSpercificValue=tmpobj[datetimeName];
        			if(typeof(datetimeSpercificValue)=='string'){
        				datetimeSpercificValue=parseFloat(datetimeSpercificValue);
        			}
        			
        			for(var prop in tmpobj){
        				if($.inArray(prop,colDefine.serial)>-1){
        					var serialSpercificValue=tmpobj[prop];
        					if(typeof(serialSpercificValue)=='string'){
        						serialSpercificValue=parseFloat(serialSpercificValue);
                			}
        					//放入[过程]集合中
        					if($.inArray(prop,result.serialList)==-1){
        						result.serialList.push(prop);
        					}
        					//默认情况下每个[过程]&[来源]单独画一条线
        					var aSerialSrcName=this.chartSerialNameFormater(prop,srcSpercificName),
        						aSerialSrc=oSerialTmpData[aSerialSrcName];
        					if(!aSerialSrc){
        						aSerialSrc={"serial":prop,"src":srcSpercificName,"data":[]};
        						oSerialTmpData[aSerialSrcName]=aSerialSrc;
        					}
        					aSerialSrc.data.push([datetimeSpercificValue,serialSpercificValue]);
        				}
        			}
        			//分组后的chart数据
        			result.stockData=oSerialTmpData;
        			//放入[来源]集合中
        			if(srcSpercificName && $.inArray(srcSpercificName,result.srcList)==-1){
        				result.srcList.push(srcSpercificName);
        			}
        		}
        	}
        	if(result.stockData){
        		for(var prop in result.stockData){
        			var serialData=result.stockData[prop].data;
        			if(serialData && serialData.length>0){
        				serialData=seqcharSortarr(result.stockData[prop].data);//时间排序
        				for(var j=0;j<serialData.length-1;j++){
        					if(serialData[j][0]==serialData[j+1][0]){
        						AgiCommonDialogBox.Alert("时序图同一曲线上不应出现相同时刻的点,图形无法绘制");
        						return;
        					}
        				}
        			}
        		}
        	}
        	this.Set("viewGridData",viewGridData);
        	this.Set("formatData",result);
        	return result;
        },
        chartSerialNameFormater:function(prop,srcSpercificName){
        	return prop+" "+srcSpercificName;
        },
        /**
         * 显示元数据列意义定义区域
         */
        showColumnDefine: function(){
        	Agi.Controls.SeqChartColumnDefineInit(this);
        },
        /**
         * @param data 由dealEntityData方法计算出的对象的stockData部分
         */
        paintChartWithFormatData:function(data){
        	var Me=this;
        	var oFormatData=data.stockData,aSeqChartData=[];
        	var cp = Me.Get('ChartProperty');
        	var defaultColors=cp.serial_colors;
        	var serialColors={};
        	if(oFormatData){
        		var colorIdx=0;
        		for(var serialName in oFormatData){
        			var onelineData=oFormatData[serialName].data;
        			aSeqChartData.push({
    					name: serialName,
    					color:Me.Get("ChartProperty")['defined_serial_color'][serialName],
    					data: onelineData,
    					marker : {
    						enabled : true,
    						radius : 2
    					},
    					shadow : true,
    					tooltip : {
    						valueDecimals : 2
    					}
    				}) ;
        		}
        	}
        	return Highcharts.StockChart( {
        		credits:{
        			enabled:false
        		},
        	    chart: {
        	    	renderTo: cp.chart_RenderTo,
        	    	plotBorderColor: '#346691',
    		        plotBorderWidth: 1,
    		        backgroundColor: {
    		            linearGradient: {
    	                    x1: 1, 
    	                    y1: 0, 
    	                    x2: 1, 
    	                    y2: 1
    	                },
    	                stops: [
    		                [0, 'rgb(255, 255, 255)'],
    		                [1, 'rgb(200, 200, 255)']
    		            ]
    		        }
        	    },
        	    title : {
    				text : 'SPC控件-时序图'
    			},
    			legend: {
    				title:{
    					style: {
    						   fontWeight: 'bold'
    						},
						text:"图例"
    				},
    		    	enabled: true,
    		    	align: 'right',
    	        	backgroundColor: '#FCFFC5',
    	        	borderColor: 'black',
    	        	borderWidth: 2,
    		    	layout: 'vertical',
    		    	verticalAlign: 'top',
    		    	y: 100,
    		    	shadow: true
    		    },
        	    rangeSelector: {
        	    	enabled:false
        	    },
        	    
        	    /*plotOptions: {
        	    	series: {
        	    		events: {
        	    			legendItemClick: function(event) {
        	    			    alert(this.name +' clicked\n'+
                            	    'Alt: '+ event.altKey +'\n'+
                                	'Control: '+ event.ctrlKey +'\n'+
                                  	'Shift: '+ event.shiftKey +'\n');
        	    			}
        	    		}
        	    	}
        	    },*/
        	    series:aSeqChartData
        	});
        }
      //end of method definition by liuxing
    },true);
Agi.Controls.seqChartSerialSelectorInit=function(Me,serialList,srcList){
	
}
/*下拉列表控件参数更改处理方法*/
Agi.Controls.SeqChartAttributeChange = function (_ControlObj, Key, _Value) {
    var self = _ControlObj;
    switch (Key) {
        case "Position":
            {
                if(layoutManagement.property.type==1){
                    var ThisHTMLElementobj=$("#"+_ControlObj.Get("HTMLElement").id);
                    var ThisControlObj = self.chart;

                    var ParentObj=ThisHTMLElementobj.parent();
                    var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                    ThisHTMLElementobj.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                    ThisHTMLElementobj.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");


                    var ThisControlPars={Width:parseInt(PagePars.Width*(1-_Value.Left-_Value.Right)),
                        Height:parseInt(PagePars.Height*(1-_Value.Top-_Value.Bottom))};

                    ThisHTMLElementobj.width(ThisControlPars.Width);
                    ThisHTMLElementobj.height(ThisControlPars.Height);
                    ThisControlObj.setSize(ThisControlPars.Width,ThisControlPars.Height);/*Chart 更改大小*/
                    ThisControlObj.Refresh();/*Chart 更改大小*/


                    PagePars=null;
                }
            } break;
    } //end switch
} //end

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitSeqChart = function () {
    return new Agi.Controls.SeqChart();
}
Agi.Controls.SeqChartColumnDefineInit = function(_thisobj){
	var Me = _thisobj;
	var ItemContent=$("<div id='DataColumnChooserDiv'></div>");
    ItemContent.load('js/Controls/SeqChart/SeqProp.html #seqtab-2', function () {
    	var itemArea=this;
    	var columnList=Me.Get("proplist");
    	if(columnList && columnList.length>0){
    		var datacolumnConfirm=$(itemArea).find('#datacolumnConfirm');
    		datacolumnConfirm.find('tr:not(:first)').remove();
    		for(var idx in columnList){
    			datacolumnConfirm.append(
    					$('<tr><td style="text-align:right"><label>'+columnList[idx]
    					+'</label>:</td><td><select><option value="0">未设置</option><option value="1">时间列</option>'
    					+'<option value="2">过程列</option><option value="3">来源列</option></select></td></tr>')
    			);
    		}
    	}
    	$('#SeqChartColumnDefineSave').unbind().bind("click",
    	  function(){//这里使用live而不是bind,因为在打开编辑界面之前绑定出现了未绑定上的问题
			var hasSrc=false,hasDatetime=false,hasSerial=false;
	    	var opterror=false;
	    	var columnSet={"datetime":null,"src":null,"serial":[]};
	    	$('#datacolumnConfirm tr').each(function(){
	    		var col=$(this).find('td:first>label').text(),
	    			val=$(this).find('select option:selected').val();
	    		if(val==1){//如果选择的是时间列
	    			if(!hasDatetime){
	    				hasDatetime=true;
	    				columnSet.datetime=col;
	    			}else{
	    				AgiCommonDialogBox.Alert("不能选择多列作为时间列!");
	    				opterror=true;
	    			}
	    		}else if(val==2){//如果选择的是过程列
	    			hasSerial=true;
	    			columnSet.serial.push(col);
	    		}else if(val==3){//如果选择的是来源列
	    			if(!hasSrc){
	    				hasSrc=true;
	    				columnSet.src=col;
	    			}else{
	    				AgiCommonDialogBox.Alert("不能选择多列作为来源列!");
	    				opterror=true;
	    			}
	    		}
	    	});
	    	if(opterror)return;
	    	if(!hasDatetime){
	    		AgiCommonDialogBox.Alert("必须指定一列作为时间列");return;
	    	}else if(!hasSrc){
	    		AgiCommonDialogBox.Alert("必须指定一列作为来源列");return;
	    	}else if(!hasSerial){
	    		AgiCommonDialogBox.Alert("必须指定至少一列作为过程列");return;
	    	}
	    	Me.Set("columnDefine",columnSet);
	    	Me.dealEntityData();
	    	Me.ChartLoadByData();
	    	Me.ShowDataTable();
	    	Agi.Controls.SeqChartSerialColorChange(Me);
    	});
    });
    Agi.Controls.Property.PropertyPanelControl.InitPanel([
         new Agi.Controls.Property.PropertyItem(
    		{ Title: "数据列指定", DisabledValue: 1, ContentObj: ItemContent })]);
}
Agi.Controls.SeqChartSerialColorChange=function(_thisobj){
	var Me=_thisobj;
	var foreColorSettingItem=Me.Get('colorSettingItem');
	if(foreColorSettingItem){
		Agi.Controls.Property.PropertyPanelControl.RemoveItem(foreColorSettingItem);
	}
	var ItemContent=$("<div id='SerialColorPickerDiv'></div>");
    ItemContent.load('js/Controls/SeqChart/SeqProp.html #seqtab-1', function () {
    	var itemArea=this;
    	var formatData=Me.Get('formatData'),chart=Me.Get('chart');
    	if(!formatData) return;
    	var stockdata=formatData.stockData;
    	if(stockdata){
    		var serialColorPickerTab=$(itemArea).find('#serialColorPicker');
    		serialColorPickerTab.find('tr:not(:first)').remove();
    		for(var prop in stockdata){
    			$('<tr><td class="CustomprortityPanelTabletd1" style="text-align:right;padding-right:10px;">'
    					+prop+'</td>'
    					+'<td><input type="text" id="seqSerialColor'+prop
    					+'" data-serialname="'+prop+'"/></td>'
    	                +'</tr>').appendTo(serialColorPickerTab);
    		}
    		serialColorPickerTab.find("input[id^='seqSerialColor']").each(function(){
    			var thiscolorpk=$(this);
    			var serialColors=Me.Get('serialColors');
    			var serialname=thiscolorpk.data('serialname');
    			var thiscolor=serialColors[serialname];
    			thiscolorpk.spectrum({
        			color:thiscolor,//Me.Get('serialColors')[$(this).data('serialname')],
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
                    	var series=chart.series;
                    	if(series && series.length>0){
                    		for(var idx=0;idx<series.length;idx++){
                    			if(series[idx].name==serialname){
                    				series[idx].update({
                                        color: color.toHexString()
                                    });
                    				break;
                    			}
                    		}
                    	}
                    }
                });
    		});
    	}
    });
    var colorSettingItem=new Agi.Controls.Property.PropertyItem(
    		{ Title: "曲线颜色", DisabledValue: 1, ContentObj: ItemContent });
    Agi.Controls.Property.PropertyPanelControl.AddItem(
    		colorSettingItem,true);
    Me.Set('colorSettingItem',colorSettingItem);
}

//endregion