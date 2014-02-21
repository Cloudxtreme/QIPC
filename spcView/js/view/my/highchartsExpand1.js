/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-11-21
 * Time: 下午6:08
 * 说明: highcharts扩展
 * 公司: 蓝智科技
 */
agi.namespace(["jquery/svg"], function () {
    return {
        expand:function (chartControl, gridContorl) {
            var chart = chartControl.chart;
            var nRow = chartControl.getSpcNrow();
            //高亮Y轴
            chart.highColor = "red";
            chart.lowColor = "green";
            /*调用*/
            ExpandChart();
            /*扩展HighCharts*/
            function ExpandChart() {
                //初始化Y轴
                var yAxis = $(chart.yAxis[0].axisLine.element).attr({"stroke":"yellow", "stroke-width":"10"})[0];
                //开始事件
                $(yAxis).unbind();
                $(yAxis).click(function (e) {
                    //
                    var yId = new Date().getTime().toString();
                    var yValue = (yAxis.getBBox().height - e.offsetY + 10) / yAxis.getBBox().height * (chart.yAxis[0].getExtremes().max-chart.yAxis[0].getExtremes().min)+chart.yAxis[0].getExtremes().min;
                    //添加基准线
                    addYPlotLine(yId, yValue);
                    //更新数据色彩
                    updateControlColor(yValue);
                    //
                    var image = $(chart.container).find("svg").svg().svg("get").image(yAxis.getBBox().x - 5, e.offsetY - 7.5, 15, 15, "js/view/my/drag.png", {id:yId});
                    //
                    $(image)
                        .draggable({
                            drag:function (e, ui) {
                                //更新基准线的位置
                                yId = ui.helper[0].id;
                                var percentage = ( yAxis.getBBox().height - ui.position.top + 2.5) / yAxis.getBBox().height;
                                if (percentage > 0 && percentage < 1) {
                                    yValue = percentage *
                                      (chart.yAxis[0].getExtremes().max-chart.yAxis[0].getExtremes().min)+chart.yAxis[0].getExtremes().min;
                                    //
                                    removeYPlotLine(yId);
                                    addYPlotLine(yId, yValue);
                                }
                            },
                            start:function () {
                            },
                            stop:function (e, ui) {
                                //删除基准线
                                yId = ui.helper[0].id;
                                var percentage = ( yAxis.getBBox().height - ui.position.top + 2.5) / yAxis.getBBox().height;
                                if (!(percentage > 0 && percentage < 1)) {
                                    yValue = percentage * chart.yAxis[0].getExtremes().max;
                                    //
                                    removeYPlotLine(yId);
                                    addYPlotLine(yId, yValue);
                                }
                                //更新数据色彩
                                updateControlColor(yValue);
                            }
                        })
                        .
                        bind("mousedown", function (event, ui) {
                            // bring target to front
                            $(event.target.parentElement).append(event.target);
                        })
                        .bind("drag", function (event, ui) {
                            // update coordinates manually, since top/left style props don"t work on SVG
                            event.target.setAttribute("y", ui.position.top);
                        });
                });
            }

            /*添加基准线*/
            function addYPlotLine(id, value) {
                chart.yAxis[0].addPlotLine({
                    value:value,
                    color:"red",
                    width:1,
                    id:id
                });
            }

            /*移除基准线*/
            function removeYPlotLine(id) {
                chart.yAxis[0].removePlotLine(id);
            }

            /*更新颜色*/
            function updateControlColor(value) {
                for (var i = 0; i < chart.series.length; i++) {
                    var series = chart.series[i];
                    if (series.color === "black") {
                        return;
                    }
                    for (var j = 0; j < series.data.length; j++) {
                        var data = series.data[j];
                        if (data.y > value) {
                            if (series.type === "column") {
                                data.update({
                                    color:chart.highColor
                                });
                            }
                            else {
                                data.update({
                                    color:chart.highColor,
                                    marker:{
                                        fillColor:chart.highColor
                                    }
                                });
                            }
                            gridContorl.highLightSpcData(j,nRow);
                        } else {
                            if (series.type === "column") {
                                data.update({
                                    color:chart.lowColor
                                });
                            }
                            else {
                                data.update({
                                    color:chart.lowColor,
                                    marker:{
                                        fillColor:chart.lowColor
                                    }
                                });
                            }
                            gridContorl.highLightSpcData(j,nRow,false);
                        }
                    }
                }
            }
        }
    };
});