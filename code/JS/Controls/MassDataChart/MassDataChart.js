/**
 * Created with JetBrains WebStorm.
 * User: 刘文川
 * Date: 12-10-8
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
Namespace.register("Agi.Controls");/*添加 Agi.Controls命名空间*/
Agi.Controls.MassDataChart=Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        GetEntityData:function(){ //获得实体数据
            var entity = this.Get("EntityInfo")
            if(entity !=undefined && entity !=null){
               return entity.Data;
            } else{
                 return null;
            }
        },
        Render:function(_Target){
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
            if (Agi.Edit){
                menuManagement.updateDataSourceDragDropTargets();
                menuManagement.dragablePoint();
            }
        },
        ResetProperty:function(){
            $('#'+this.shell.ID).resizable({
                minHeight: 200,
                minWidth: 400
            });
            return this;
        },
        ReadData:function(_EntityInfo){//绑定关系数据
            if(_EntityInfo)
            {
                var Me = this;
                Agi.Utility.RequestData(_EntityInfo, function (d) {
                    Me.Set("EntityInfo",_EntityInfo);
                    _EntityInfo.Data = d;
                    Me.SetChartDataProperty(_EntityInfo);
                    Me.InitHighStockChart();
                });
            }
        },
        strDateTime:function(str)
        {
            var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
            var r = str.match(reg);
            if(r==null)return null;
            var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
            //(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
            return d;
        },
        ResizeChart:function(){
            var ProPerty = this.Get("ProPerty");
            if(ProPerty){
                $("#"+ProPerty.ID).html("");
                //追加图形控件至画框
                this.InitHighStockChart();
            }
        },
        Init:function(_Target,_ShowPosition,savedId){/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            this.shell = null;
            this.AttributeList=[];
            this.Set("Entity",[]);
            this.Set("ControlType","MassDataChart");
            this.Set("ChartParameters",{Key:false,Points:[]});//预先保存结构
            this.Set("ChartCurrentData",[]);//设置及时刷新数据显示
            this.Set("PointsParamerters",[]);//注册数据点位号保存，点位号集合，结构["11AE84102","11AE84015","11AE84103"]
            var ID = savedId ? savedId : "MassDataChart"+Agi.Script.CreateControlGUID();
            var HTMLElementPanel=$("<div recivedata='true' id='Panel_"+ID+"' class='PanelSty selectPanelSty'></div>");
            this.shell = new Agi.Controls.Shell({
                ID:ID,
                width:300,
                height:200,
                divPanel:HTMLElementPanel
            });
            var BaseControlObj= $('<div id="'+ID+'" style="width:100%;height:100%;margin: 0 auto">' + '</div>');
            this.shell.initialControl(BaseControlObj[0]);
            this.Set("HTMLElement",this.shell.Container[0]);
            var ThisProPerty={
                ID:ID,
                BasciObj:BaseControlObj
            };
            var PostionValue={Left:0,Top:0,Right:0,Bottom:0};
            var obj=null;
            if(typeof(_Target)=="string"){
                obj=$("#"+_Target);
            }else{
                obj=$(_Target);
            }
            var PagePars={Width:$(obj).width(),Height:$(obj).height(),Left:0,Top:0};
            this.Set("ProPerty",ThisProPerty);
            this.Set("ThemeInfo",null);
            if (layoutManagement.property.type == 1) {
                PostionValue.Left=((_ShowPosition.Left-PagePars.Left)/PagePars.Width).toFixed(4);
                PostionValue.Top=((_ShowPosition.Top-PagePars.Top)/PagePars.Height).toFixed(4);
                PostionValue.Right=((PagePars.Width-HTMLElementPanel.width()-(_ShowPosition.Left-PagePars.Left))/PagePars.Width).toFixed(4);
                PostionValue.Bottom=((PagePars.Height-HTMLElementPanel.height()-(_ShowPosition.Top-PagePars.Top))/PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("PanelSty");
                HTMLElementPanel.addClass("AutoFill_PanelSty");
                obj.html("");
            }

            if(_Target!=null){
                this.Render(_Target);
            }

            //设置预设图形属性
            this.SetChartProperty(ID);
            //追加图形控件至画框
            this.InitHighStockChart();

            var StartPoint={X:0,Y:0}
            var self = this;
            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                Agi.Controls.BasicPropertyPanel.Show(this.id);
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if(!Agi.Controls.IsControlEdit){
                    Agi.Controls.ControlEdit(self);//控件编辑界面
                }
            });
            if(HTMLElementPanel.touchstart){
                HTMLElementPanel.touchstart(function(ev){
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position",PostionValue);

            if (Agi.Edit){
                //缩小的最小宽高设置
                HTMLElementPanel.resizable({
                    minHeight: 100,
                    minWidth: 200
                });
            }
        },//end Init
        GetData:function(_minValue,_maxValue,_dataCount){
            var dtNow = (new Date()).getTime();
            var myData=[];
            for(var i = 0; i < _dataCount;i++){
                var dt = dtNow-(2000-i)*1000;
                //myData.push([dt,this.GetRandomValue(_minValue,_maxValue)]);
                myData.push([dt,null]);
            }
            return myData;
        },
        GetRandomValue:function(_minValue,_maxValue){//随机数取得，_minValue：最小范围值，_maxValue：最大范围值
            return parseInt(_minValue) + parseInt(_maxValue - _minValue) * Math.random();
        },
        SetChartProperty:function(_objCanvasAreaID){//初始化定义图形控件数据结构，并预设值属性，_objCanvasAreaID：画布显示区域ID
            //图形基本结构定义
            var chartProperty={
                chart_PointNumber:20,//当前图形范围所显示的点位
                chart_RenderTo:_objCanvasAreaID,//画布ID
                chart_Type:'spline',//'spline',//显示图形
                chart_MarginRight:20,//图形距画框右边距距离
                chart_Reflow:true,//图形是否跟随放大
                chart_Animation:false,//动画平滑滚动
                series_Color:"#4572A7",//"#4572A7",
                rangeSelector_Enabled:false,
                rangeSelector_Selected:10,
                title_Text:'',//标题文字
                xAxis_Type:'datetime',//X轴数据类型
                xAxis_TickWidth:0,//X轴刻线
                xAxis_TickPixelInterval:0,//X轴数据间隔
                xAxis_Reversed:true,//数据滚动方向
                yAxis_Title_Text:'',//Y轴标题文字
                yAxis_Min:0,//Y轴最小值
                yAxis_Max:280,//Y轴最大值
                yAxis_GridLineWidth:0,//Y轴表格线宽度显示
                yAxis_PlotLines_Y:{//Y轴基本线定义
                    value: 0,
                    width: 2,
                    color: '#808080'
                },
                yAxis_PlotLines_Min:{//Y轴最小境界线定义
                    value: 20,
                    width: 4,
                    color: '#FACCCC',
                    label: {
                        align: 'right',
                        text:"下限:"+20,
                        style: {
                            color: '#4572A7'
                        }
                    }
                },
                yAxis_PlotLines_MinMarkerColor:'blue',
                yAxis_PlotLines_Max:{//Y轴最大境界线定义
                    value: 280,
                    width: 4,
                    color: '#CEAEFE',
                    label: {
                        align: 'right',
                        text:"上限:"+280,
                        style: {
                            color: '#4572A7'
                        }
                    }
                },
                yAxis_PlotLines_MaxMarkerColor:'red',
                tooltip_enabled:true,
                plotOptions_Spline_Marker_enabled:false,//MARKER点位是否显示
                plotOptions_Spline_Marker_Radius:3,//MARKER点位样式大小设置
                plotOptions_Spline_Marker_Symbol:'circle',
                legend_enabled:true,//是否显示名片
                exporting_enabled:false,//是否显示打印和下载图片
                credits_enabled:false,//是否显示出品人
                navigation_menuItemStyle_fontSize:'10px'//NULL
            };
            this.Set('ChartProperty',chartProperty);//保存属性结构
        },
        SetChartDataProperty:function(_EntityInfo){//数据基本结构定义，在警戒范围中生成模拟数据
            var chartProperty = this.Get("ChartProperty");
            var chartSeries=[];
            var xData=[];
            chartSeries.push({
                name :_EntityInfo.Key,
                data : GetData(this),
                color:chartProperty.series_Color,
                tooltip: {
                    valueDecimals: 2
                }
            });
            this.Set('ChartSeries',chartSeries);
            function GetData(Me){
                var data=[];
                var dateTemp = null;
                var k = 0;
                for(var i = 0; i< _EntityInfo.Data.length;i++){//
                    var x;
                    var dateTemp = Me.strDateTime(_EntityInfo.Data[i][_EntityInfo.Columns[0]]);
                    if(!dateTemp){
                        xData.push(_EntityInfo.Data[i][_EntityInfo.Columns[0]].toString());
                        x=i;
                    }
                    else{
                        k++;
                        x=dateTemp.getTime()+k;
                    }
                    var y = _EntityInfo.Data[i][_EntityInfo.Columns[1]];
                    data.push([x,y]);
                }
                if(!dateTemp){
                    Me.Set('xData',xData);
                }
                return data;
            }
        },
        InitHighStockChart:function(){//初始化图形控件
            var chartProperty = this.Get('ChartProperty');
            var chartSeries = this.Get('ChartSeries');
            var xData = this.Get('xData');
            if(chartSeries && chartProperty.chart_RenderTo){
                Highcharts.setOptions({
                    global: {
                        useUTC: false//不使用夏令时
                    }
                });
                var series,chart;
                if(xData){//显示为其他格式的数据
                    chart = new Highcharts.StockChart({
                        chart : {
                            animation:chartProperty.chart_Animation,
                            renderTo :chartProperty.chart_RenderTo,
                            type:chartProperty.chart_Type,
                            marginRight:20,
                            marginRight:chartProperty.chart_MarginRight,
                            reflow:chartProperty.chart_Reflow
                        },
                        colors: [
                            '#4572A7',
                            '#89A54E',
                            '#80699B',
                            '#3D96AE',
                            '#92A8CD',
                            '#A47D7C',
                            '#B5CA92'
                        ],
                        title : {
                            text : chartProperty.title_Text
                        },
                        rangeSelector : {
                            enabled:chartProperty.rangeSelector_Enabled,
                            selected : chartProperty.rangeSelector_Selected
                        },
                        plotOptions:{
                            spline:{
                                marker:{
                                    enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                    radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                    symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                                }
                            },
                            line:{
                                marker:{
                                    enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                    radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                    symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                                }
                            },
                            column:{
                                marker:{
                                    enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                    radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                    symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                                }
                            }
                        },
                        xAxis: {
                            labels: {
                                enabled: true,
                                rotation:70,
                                formatter:function() {
                                    if(xData)
                                        return '<b>'+xData[this.value]+'</b>';
                                    return '';
                                }
                            },
                            tickWidth:chartProperty.xAxis_TickWidth,
                            tickPixelInterval:chartProperty.xAxis_TickPixelInterval
                        },
                        tooltip: {
                            enabled:chartProperty.tooltip_enabled,
                            formatter: function() {
                                var s="";
                                $.each(this.points, function(i, point) {
                                    if(xData){
                                        s += '<b>'+xData[point.x]+'：</b>'+ point.y+'<br/>';
                                    }
                                    else{
                                        s+='<b>'+(new Date(point.x)).toString()+'：</b>'+point.y+'<br/>';
                                    }
                                });
                                return s;
                            }
                        },
                        navigator : {
                            enabled : false
                        },
                        scrollbar:{
                            enabled:false
                        },
                        series :chartSeries,
                        credits:{
                            enabled:chartProperty.credits_enabled
                        }
                    });
                }
                else{//显示为时间格式的数据
                    chart = new Highcharts.StockChart({
                        chart : {
                            animation:chartProperty.chart_Animation,
                            renderTo :chartProperty.chart_RenderTo,
                            type:chartProperty.chart_Type,
                            marginRight:20,
                            marginRight:chartProperty.chart_MarginRight,
                            reflow:chartProperty.chart_Reflow
                        },
                        colors: [
                            '#4572A7',
                            '#89A54E',
                            '#80699B',
                            '#3D96AE',
                            '#92A8CD',
                            '#A47D7C',
                            '#B5CA92'
                        ],
                        title : {
                            text : chartProperty.title_Text
                        },
                        rangeSelector : {
                            enabled:chartProperty.rangeSelector_Enabled,
                            selected : chartProperty.rangeSelector_Selected
                        },
                        plotOptions:{
                            spline:{
                                marker:{
                                    enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                    radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                    symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                                }
                            },
                            line:{
                                marker:{
                                    enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                    radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                    symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                                }
                            },
                            column:{
                                marker:{
                                    enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                    radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                    symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                                }
                            }
                        },
                        tooltip: {
                            enabled:chartProperty.tooltip_enabled,
                            formatter: function() {
                                var s="";
                                $.each(this.points, function(i, point) {
                                    if(xData){
                                        s += '<b>'+xData[point.x]+'：</b>'+ point.y+'<br/>';
                                    }
                                    else{
                                        s+='<b>'+getChinaDate(point.x) +'：</b>'+point.y+'<br/>';
                                    }
                                });
                                return s;
                            }
                        },
                        series :chartSeries,
                        credits:{
                            enabled:chartProperty.credits_enabled
                        }
                    });
                }
                this.Set('chart',chart);
            }
            else{//测试数据
                var chart = new Highcharts.StockChart({
                    chart: {
                        renderTo: chartProperty.chart_RenderTo,
                        type:chartProperty.chart_Type
                    },
                    rangeSelector: {
                        enabled:chartProperty.rangeSelector_Enabled,
                        selected : chartProperty.rangeSelector_Selected
                    },
                    rangeSelector : {
                        enabled:false
                    },
                    tooltip: {
                        enabled:chartProperty.tooltip_enabled
                    },
                    plotOptions:{
                        spline:{
                            marker:{
                                enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                            }
                        },
                        line:{
                            marker:{
                                enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                            }
                        },
                        column:{
                            marker:{
                                enabled:chartProperty.plotOptions_Spline_Marker_enabled,
                                radius:chartProperty.plotOptions_Spline_Marker_Radius,
                                symbol:chartProperty.plotOptions_Spline_Marker_Symbol
                            }
                        }
                    },
                    navigator : {
                        enabled : false
                    },
                    scrollbar:{
                        enabled:false
                    },
                    xAxis: {
                        labels:{
                            enabled:false
                        },
                        tickWidth:0
                    },
                    series: [{
                        name: 'TestMassData',
                        data: this.GetData(0,300,20)
                    }],
                    credits:{
                        enabled:chartProperty.credits_enabled
                    }
                });
            }

            function getChinaDate(mydate){
                var date = new Date(mydate)
                var year = date.getFullYear();
                var month = date.getMonth()+1; //js从0开始取
                var date1 = date.getDate();
                var hour = date.getHours();
                var minutes = date.getMinutes();
                var second = date.getSeconds();
                return year+"年"+month+"月"+date1+"日"+hour+"时"+minutes +"分"+second+"秒" ;
            }
        },
        CustomProPanelShow:function(){//显示自定义属性面板
            Agi.Controls.MassDataChartProrityInit(this);
        },
        Destory:function(){
            var HTMLElement=this.Get("HTMLElement");
            var proPerty=this.Get("ProPerty");
            Agi.Edit.workspace.removeParameter(proPerty.ID);/*移除输出参数*/

//            Agi.Edit.workspace.controlList.remove(this);
//            Agi.Edit.workspace.currentControls.length=0;/*清除选中控件对象*/
            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中
            $(HTMLElement).remove();
            HTMLElement=null;
            this.AttributeList.length=0;
            proPerty=null;
            delete this;
        },
//        Copy:function(){
//            if(layoutManagement.property.type==1){
//                var ParentObj= this.shell.Container.parent();
//                var PostionValue=this.Get("Position");
//                var newPanelPositionpars={Left:parseFloat(PostionValue.Left),Top:parseFloat(PostionValue.Top)}
//                var NewMassDataChart=Agi.Controls.InitMassDataChart();
//                NewMassDataChart.Init(ParentObj,PostionValue);
//                newPanelPositionpars=null;
//                return NewMassDataChart;
//            }
//        },
        PostionChange:function(_Postion){
            if(_Postion!=null &&_Postion.Left!=null && _Postion.Top!=null && _Postion.Right!=null && _Postion.Bottom!=null){
                var ParentObj=$(this.Get("HTMLElement")).parent();
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                var _ThisPosition={
                    Left:(_Postion.Left/PagePars.Width).toFixed(4),
                    Top:(_Postion.Top/PagePars.Height).toFixed(4),
                    Right:(_Postion.Right/PagePars.Width).toFixed(4),
                    Bottom:(_Postion.Bottom/PagePars.Height).toFixed(4)
                }

//                //缩小的最小宽高设置
//                HTMLElementPanel.resizable({
//                    minHeight: 200,
//                    minWidth: 300
//                });

                this.Set("Position",_ThisPosition);
                PagePars=_ThisPosition=null;
            }else{
                var ThisHTMLElement=$(this.Get("HTMLElement"));
                var ParentObj= $('#BottomRightCenterContentDiv');
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height(),Left:ParentObj.offset().left,Top:ParentObj.offset().top};


                var ThisControlPars={Width:ThisHTMLElement.width(),Height:ThisHTMLElement.height(),Left:(ThisHTMLElement.offset().left-PagePars.Left),Top:(ThisHTMLElement.offset().top-PagePars.Top),Right:0,Bottom:0};
                ThisControlPars.Right=(PagePars.Width-ThisControlPars.Width-ThisControlPars.Left);
                ThisControlPars.Bottom=(PagePars.Height-ThisControlPars.Height-ThisControlPars.Top);

                var _ThisPosition={
                    Left:(ThisControlPars.Left/PagePars.Width).toFixed(4),
                    Top:(ThisControlPars.Top/PagePars.Height).toFixed(4),
                    Right:(ThisControlPars.Right/PagePars.Width).toFixed(4),
                    Bottom:(ThisControlPars.Bottom/PagePars.Height).toFixed(4)
                }
                this.Set("Position",_ThisPosition);
                PagePars=_ThisPosition=null;
            }
            //$('#'+this.shell.BasicID).find('.dropdown:eq(0)')
        },
        Refresh:function(){
            var ThisHTMLElement = $(this.Get("HTMLElement"));
            var ParentObj = ThisHTMLElement.parent();
            var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
            var PostionValue=this.Get("Position");
            PostionValue.Left=parseFloat(PostionValue.Left);
            PostionValue.Right=parseFloat(PostionValue.Right);
            PostionValue.Top=parseFloat(PostionValue.Top);
            PostionValue.Bottom=parseFloat(PostionValue.Bottom);
            var ThisControlPars={Width:parseInt(PagePars.Width-(PagePars.Width*(PostionValue.Left+PostionValue.Right))),
                Height:parseInt(PagePars.Height-(PagePars.Height*(PostionValue.Top+PostionValue.Bottom)))};
            ThisHTMLElement.width(ThisControlPars.Width);
            ThisHTMLElement.height(ThisControlPars.Height);
//            ThisHTMLElement.css("left",(ParentObj.offset().left+parseInt(PostionValue.Left*PagePars.Width))+"px");
//            ThisHTMLElement.css("top",(ParentObj.offset().top+parseInt(PostionValue.Top*PagePars.Height))+"px");
            ThisHTMLElement.css("left",(parseInt(PostionValue.Left*PagePars.Width))+"px");
            ThisHTMLElement.css("top",(parseInt(PostionValue.Top*PagePars.Height))+"px");

            $(window).resize();
            this.ResizeChart();
        },
        HTMLElementSizeChanged:function(){
            var Me = this;
            if(Agi.Controls.IsControlEdit){//如果是进入编辑界面，100%适应
                Me.Set("Position",{Left:0,Right:0,Top:0,Bottom:0});//由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
            }else{
                Me.Refresh();//每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        Checked:function(){
            if (!Agi.Edit) return;
            $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow":"1px 1px 1px #ff4027, -1px -1px 1px #ff4027"});
        },
        UnChecked:function(){
            if (!Agi.Edit) return;
            $('#'+this.shell.ID).css({"-webkit-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow":"0px 0px 0px #000, 0px 0px 0px #000"});
           /* $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
                "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        EnterEditState:function(){
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width:obj.width(),
                height:obj.height()
            }
            obj.css({"width":'100%',"height":'100%'});
            //框架重新设置
            $(window).resize();
            this.ResizeChart();
        },
        BackOldSize:function(){
            if(this.oldSize){
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);
            }
            //框架重新设置
            $(window).resize();
            this.ResizeChart();
        },
        ControlAttributeChangeEvent:function(_obj,Key,_Value){
            Agi.Controls.MassDataChartAttributeChange(this,Key,_Value);
        },
        GetConfig:function(){
            var ProPerty=this.Get("ProPerty");
          /*  var ConfigObj = new Agi.Script.StringBuilder(); *//*配置信息数组对象*//*
             ConfigObj.append("<Control>");
             ConfigObj.append("<ControlType>" + this.Get("ControlType") + "</ControlType>"); *//*控件类型*//*
             ConfigObj.append("<ControlID>" +ProPerty.ID + "</ControlID>"); *//*控件属性*//*
             ConfigObj.append("<ControlBaseObj>" +ProPerty.BasciObj[0].id + "</ControlBaseObj>"); *//*控件基础对象*//*
             ConfigObj.append("<HTMLElement>" +ProPerty.BasciObj[0].id + "</HTMLElement>"); *//**//*
             var Entitys = this.Get("Entity");
             $(Entitys).each(function(i,e){
             e.Data = null;
             });
             ConfigObj.append("<Entity>" +JSON.stringify(Entitys) + "</Entity>"); *//**//*

             ConfigObj.append("<ChartProperty>" +JSON.stringify(this.Get("ChartProperty")) + "</ChartProperty>"); *//**//*
             var EntityInfo = this.Get("EntityInfo");
             EntityInfo.Data = null;
             ConfigObj.append("<EntityInfo>" +JSON.stringify(EntityInfo) + "</EntityInfo>"); *//**//*

             ConfigObj.append("<Position>" +JSON.stringify(this.Get("Position")) + "</Position>"); *//**//*
             ConfigObj.append("<ThemeInfo>" +JSON.stringify(this.Get("ThemeInfo")) + "</ThemeInfo>"); *//**//*
             ConfigObj.append("</Control>");
             return ConfigObj.toString(); //返回配置字符串*/
            var MassDataChartControl = {
                Control:{
                    ControlType:null,//控件类型
                    ControlID:null,//控件属性
                    ControlBaseObj:null,//控件基础对象
                    HTMLElement:null,//控件外壳ID
                    Entity:null, //控件实体
                    ChartProperty:null,//chart属性
                    EntityInfo:null,//控件实体 信息
                    Position:null,//控件位置
                    ThemeInfo:null
                }
            }
            MassDataChartControl.Control.ControlType = this.Get("ControlType");
            MassDataChartControl.Control.ControlID = ProPerty.ID;
            MassDataChartControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id ;
            MassDataChartControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
//            $(Entitys).each(function(i,e){
//                e.Data = null;
//            });
            MassDataChartControl.Control.Entity = Entitys;
            MassDataChartControl.Control.ChartProperty = this.Get("ChartProperty");
            MassDataChartControl.Control.EntityInfo = this.Get("EntityInfo");
            MassDataChartControl.Control.Position = this.Get("Position");
            MassDataChartControl.Control.ThemeInfo = this.Get("ThemeInfo");
            return  MassDataChartControl.Control;
        },//获得Panel控件的配置信息
        CreateControl:function(_Config,_Target){
            this.Init(_Target,_Config.Position,_Config.HTMLElement);
            if(_Config!=null){
                var chartProperty = null;
                var entityInfo = null;
                if(_Target!=null && _Target!=""){
                    var _Targetobj=$(_Target);

                        _Config.Entity = _Config.Entity;

                        _Config.Position = _Config.Position;
                        this.Set("Position",_Config.Position);

                        _Config.ThemeInfo = _Config.ThemeInfo;

                        chartProperty = _Config.ChartProperty;
                        this.Set("ChartProperty",chartProperty);

                        entityInfo = _Config.EntityInfo;
                        this.Set("EntityInfo",entityInfo);

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id',_Config.ControlID);

                    var PagePars={Width:_Targetobj.width(),Height:_Targetobj.height()};
                    _Config.Position.Left=parseFloat(_Config.Position.Left);
                    _Config.Position.Right=parseFloat(_Config.Position.Right);
                    _Config.Position.Top=parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom=parseFloat(_Config.Position.Bottom);

                    var ThisControlPars={Width:parseInt(PagePars.Width-(PagePars.Width*(_Config.Position.Left+_Config.Position.Right))),
                        Height:parseInt(PagePars.Height-(PagePars.Height*(_Config.Position.Top+_Config.Position.Bottom)))};

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left',(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    this.shell.Container.css('top',(parseInt(_Config.Position.Top*PagePars.Height))+"px");

                    this.Set("Entity",_Config.Entity);

                    //进行画布的显示
                    this.InitHighStockChart();
                    //重新开始自动滚动数据
                    //this.BeginInterval();
                    //获取注册数据
                    this.ReadData(this.Get("EntityInfo"));
                }
            }
        }//根据配置信息创建控件
    },true);

/*下拉列表控件参数更改处理方法*/
Agi.Controls.MassDataChartAttributeChange=function(_ControlObj,Key,_Value){
    var self = _ControlObj;
    switch(Key){
        case "Position":
        {
            if(layoutManagement.property.type==1){
                var ThisHTMLElement=$(_ControlObj.Get("HTMLElement"));
                var ThisControlObj=_ControlObj.Get("ProPerty").BasciObj;

                var ParentObj=ThisHTMLElement.parent();
                var PagePars={Width:ParentObj.width(),Height:ParentObj.height()};
                //ThisControlObj.height(ThisHTMLElement.height()-20);
                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                ThisHTMLElement.css("left",parseInt(parseFloat(_Value.Left)*PagePars.Width)+"px");
                ThisHTMLElement.css("top",parseInt(parseFloat(_Value.Top)*PagePars.Height)+"px");
                PagePars=null;
                self.ResizeChart();
            }
        }break;
        case "SelValue":
        {
//            var _ParameterInfo={
//                Type:"控件输出参数",
//                Control:_ControlObj,
//                ChangeValue:[{Name:"SelValue",Value:_Value}]
//            }
        }break;
        case "data"://用户选择了一个项目
        {
            var data = _ControlObj.Get('data');
            if(data.selectedValue.value){
                //alert('您选择了:'+data.selectedValue.value +'\n'+ data.selectedValue.text);

                var ThisProPerty = _ControlObj.Get("ProPerty");

                Agi.Msg.PageOutPramats.PramatsChange({
                    'Type': Agi.Msg.Enum.Controls,
                    'Key': ThisProPerty.ID,
                    'ChangeValue': [{ 'Name': 'selectedValue', 'Value': data.selectedValue.value }]
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({"sender":_ControlObj,"Type":Agi.Msg.Enum.Controls});
            }
        }break;
        case "BasicProperty":
        {
            var BasicProperty = _ControlObj.Get('BasicProperty');
            var controlObject = $(_ControlObj.Get('HTMLElement'));
            controlObject.find('.dropdown-toggle').css('color',BasicProperty.fontColor);
            controlObject.find('.dropdownlistControl,.dropdown-toggle').css('background-color',BasicProperty.controlBgColor);
            //controlObject.find('.dropdown-menu').css('background-color',BasicProperty.dropdownMenuBgColor);
            var entity = _ControlObj.Get('Entity');
            if(entity&&entity.length){
                BindDataByEntity(_ControlObj,entity[0]);
            }
        }
            break;
        case "Entity"://实体
        {
            var entity = _ControlObj.Get('Entity');
            if(entity&&entity.length){
                BindDataByEntity(_ControlObj,entity[0]);
            }else{
                var $UI = $('#'+ self.shell.ID);
                var menu = $UI.find('.dropdown-menu');
                $UI.find('.dropdown-toggle').text('');
                menu.empty();
            }
        }break;
    }//end switch

    function BindDataByEntity(controlObj,et){
        Agi.Utility.RequestData(et,function(d){
            var BasicProperty = controlObj.Get("BasicProperty");
            var $UI = $('#'+ controlObj.shell.ID);
            var menu = $UI.find('.dropdown-menu');
            $UI.find('.dropdown-toggle').text('请选择');

            menu.empty();
            var data = d.length ? d:[d];
            var columns = et.Columns.length?et.Columns:[et.Columns];
            et.Data = data;
            var textField = BasicProperty && BasicProperty.selectTextField?BasicProperty.selectTextField:columns[0];
            var valueField = BasicProperty && BasicProperty.selectValueField?BasicProperty.selectValueField:columns[0];
            if(BasicProperty.selectTextField == undefined){
                BasicProperty.selectTextField = textField
            }
            if(BasicProperty.selectValueField == undefined){
                BasicProperty.selectValueField = valueField;
            }

            $(data).each(function(i,dd){
                $('<li data-value="'+dd[valueField]+'"><a tabindex="-1" href="#">'+dd[textField]+'</a></li>').appendTo(menu);
            });
            controlObj.ReBindEvents();
            menu.find('li:eq(0)').click();
        });
        return;
    }

}//end

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitMassDataChart=function(){
    return new Agi.Controls.MassDataChart();
}

Agi.Controls.MassDataChartProrityInit = function (_BasicChart) {
    var Me = _BasicChart;
    var entityInfo = Me.Get("EntityInfo");
    //取得默认属性
    var chartProperty = Me.Get('ChartProperty');

    var ThisProItems = [];
    //1.将属性项加入集合,有多少个属性就需要new对应个数的 Agi.Controls.Property.PropertyItem
    {
        var ItemContent = new Agi.Script.StringBuilder();

        //       基本属性
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='BasicChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>ToolTip：</td><td class='prortityPanelTabletd1'>"+
        "<select id='showTooltip'>" +
            "<option selected='selected' value='2'>关闭</option>" +
            "<option value='1'>开启</option>" +
        "</select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>线条颜色：</td><td class='prortityPanelTabletd2'><input id='LinesColor' type='text'></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>图表类型：</td><td class='prortityPanelTabletd1'>" +
            "<select id='dataShowSty'>" +
            "<option value='spline' selected='selected'>曲线</option>" +
            "<option value='line'>直线</option>" +
            "<option value='column'>柱形</option>" +
            "<option value='area'>区域</option>" +
            "</select></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>筛选栏：</td><td class='prortityPanelTabletd1'>"+
            "<select id='showToolbar'>" +
            "<option selected='selected' value='2'>关闭</option>" +
            "<option value='1'>开启</option>" +
            "</select></td>");
        ItemContent.append("</tr>");
//        ItemContent.append("<tr>");
//        ItemContent.append("<td class='prortityPanelTabletd0'>Y轴显示范围：</td><td colspan='3'  class='prortityPanelTabletd2'><input type='text'/>&nbsp;--&nbsp;<input type='text'></td>");
//        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var BaseInfo = $(ItemContent.toString());

        //        marker属性
        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='BasicChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker：</td><td colspan='3' class='prortityPanelTabletd1'>" +
            "<select id='Marker'>" +
            "<option selected='selected' value='2'>关闭</option>" +
            "<option value='1'>开启</option>" +
            "</select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker大小：</td><td class='prortityPanelTabletd1'><input type='number' id='MarkerSize' class='ControlProNumberSty' defaultvalue='0' value='0' min='0' max='10'/></td>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker样式：</td><td class='prortityPanelTabletd1'><select id='MarkerSty'>" +
            "<option value='circle' selected='selected'>circle</option>" +
            "<option value='square'>square</option>" +
            "<option value='diamond'>diamond</option>" +
            "<option value='triangle'>triangle</option>" +
            "<option value='triangle-down'>triangle-down</option>" +
            "</select></td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var MarkerInfo = $(ItemContent.toString());

        ItemContent = null;
        ItemContent = new Agi.Script.StringBuilder();
        ItemContent.append("<div class='BasicChart_Pro_Panel'>");
        ItemContent.append("<table class='prortityPanelTable' border='0' cellspacing='1' cellpadding='0'>");
        ItemContent.append("<tr>");
        ItemContent.append("<td class='prortityPanelTabletd0'>Marker大小：</td><td class='prortityPanelTabletd1'><input type='number' id='DataServer' class='ControlProNumberSty' defaultvalue='0' value='0' min='0' max='10'/></td>");
        ItemContent.append("</tr>");
        ItemContent.append("</table>");
        ItemContent.append("</div>");
        var DataServer = $(ItemContent.toString())

        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本属性", DisabledValue: 1, ContentObj: BaseInfo }));
        ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "Marker属性", DisabledValue: 1, ContentObj: MarkerInfo }));

        //2.初始化属性项显示
        Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
        //3.属性禁用、启用处理
        Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
            var itemtitle = _item.Title;
            if (_item.DisabledValue == 0) {
                itemtitle += "禁用";
            } else {
                itemtitle += "启用";
            }
            AgiCommonDialogBox.Alert(itemtitle);
        }

        //4.取得页面显示图形默认属性
        {
            //获取是否显示TIP框
            $("#showTooltip").val(chartProperty.tooltip_enabled?"1":"2");
            //设置线条颜色
            //$('#AlarmUpper').val(chartProperty.yAxis_PlotLines_Max.value);
            //设置筛选栏是否开启
            $("#showToolbar").val(chartProperty.rangeSelector_Enabled?"1":"2");
            //设置图标数据显示样式
            $("#dataShowSty").val(chartProperty.chart_Type);
            //获取是否显示数据线形上面的MARKER
            $("#Marker").val(chartProperty.plotOptions_Spline_Marker_enabled?"1":"2");
            //设置MARKER大小
            $("#MarkerSize").val(chartProperty.plotOptions_Spline_Marker_Radius);
            //设置MARKER样式
            $("#MarkerSty").val(chartProperty.plotOptions_Spline_Marker_Symbol);
            //线条颜色
            $("#LinesColor").val(chartProperty.series_Color);
        }


        //5.页面属性改变事件集合
        {
            //线条颜色改变事件
            $("#LinesColor").spectrum({
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
                    $("#LinesColor").val(color.toHexString());
                    chartProperty.series_Color = $("#LinesColor").val();
                    Me.SetChartDataProperty(Me.Get("EntityInfo"));
                    ChangeCharts();
                }
            });

            //是否显示tooltips选择改变事件
            $("#showTooltip").change(function () {
                chartProperty.tooltip_enabled=$("#showTooltip").val() == '1'?true:false;
                ChangeCharts();
            });

            $("#showToolbar").change(function(){
                chartProperty.rangeSelector_Enabled=$("#showToolbar").val() == '1'?true:false;
                ChangeCharts();
            });

            $("#dataShowSty").change(function(){
                chartProperty.chart_Type=$("#dataShowSty").val();
                ChangeCharts();
            });

            //是否显示marker选择改变事件
            $("#Marker").change(function () {
                chartProperty.plotOptions_Spline_Marker_enabled=$("#Marker").val() == '1'?true:false;
                ChangeCharts();
            });
            //marker大小选择改变事件
            $("#MarkerSize").change(function () {
                var minMarker = 2;
                var maxMarker = 10;
                var markerSize = parseInt($("#MarkerSize").val());
                if(markerSize!=minMarker && Math.min(markerSize,minMarker) == markerSize) $("#MarkerSize").val(minMarker);
                if(markerSize!=maxMarker && Math.max(markerSize,maxMarker) == markerSize) $("#MarkerSize").val(maxMarker);
                chartProperty.plotOptions_Spline_Marker_Radius=parseInt($("#MarkerSize").val());
                ChangeCharts();
            });
            //marker样式选择改变事件
            $("#MarkerSty").change(function () {
                chartProperty.plotOptions_Spline_Marker_Symbol=$("#MarkerSty").val();
                ChangeCharts();
            });

        }
        //6.参数变化保存并刷新页面图形显示数据、状态
        function ChangeCharts(){
            //对属性进行保存
            Me.Set('ChartProperty',chartProperty);
            //进行画布的显示
            Me.InitHighStockChart();
            //页面重新刷新
            $(window).resize();
        }
    }
}