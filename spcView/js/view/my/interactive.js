/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-11-19
 * Time: 上午10:27
 * 说明: 交互，控件交互，如Chart和Datagrid
 * 公司: 蓝智科技
 */
agi.namespace(function () {
    return {
        highlight:function (chartControl, datagridControl) {
            //
            var chart = chartControl.getInsideControl();
            //
            chart.agiEvents = {
                pointChange:function (pointIndex) {
                    datagridControl.highLightSpcData(pointIndex,1);
                }
            };
        }
    };
});