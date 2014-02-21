Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ControlNameExchange = function () {

    this.GetControlNameExchangeList = function () {
        this.ControlNameExchangeList = [];
        this.ControlNameExchangeList.push({ Cname: "基本图表", Ename: "BasicChart", IconName: "BasicChart.png" });
        this.ControlNameExchangeList.push({ Cname: "下拉列表框", Ename: "DropDownList", IconName: "DropDownList.png" });
        this.ControlNameExchangeList.push({ Cname: "数据表格", Ename: "DataGrid", IconName: "DataGrid.png" });
        this.ControlNameExchangeList.push({ Cname: "单日期选择", Ename: "DatePicker", IconName: "DatePicker.png" });
        this.ControlNameExchangeList.push({ Cname: "容器框", Ename: "Panel", IconName: "Panel.png" });
        this.ControlNameExchangeList.push({ Cname: "标签", Ename: "Label", IconName: "Label.png" });
        this.ControlNameExchangeList.push({ Cname: "日期范围选择2", Ename: "TimePicker", IconName: "TimePicker.png" });
        this.ControlNameExchangeList.push({ Cname: "过程能力信息", Ename: "ODInfoTable", IconName: "ODInfoTable.png" });
        this.ControlNameExchangeList.push({ Cname: "实时标签", Ename: "RealTimeLable", IconName: "RealTimeLable.png" });
        this.ControlNameExchangeList.push({ Cname: "圆形仪表盘 ", Ename: "DashboardChart", IconName: "DashboardChart.png" });
        this.ControlNameExchangeList.push({ Cname: "半圆仪表盘", Ename: "DashboardChart1", IconName: "DashboardChart1.png" });
        this.ControlNameExchangeList.push({ Cname: "过程能力摘要", Ename: "PCLabel", IconName: "ODInfoTable.png" });
        this.ControlNameExchangeList.push({ Cname: "过程能力摘要1", Ename: "SpcDemoPCLabel", IconName: "ODInfoTable.png" });
        this.ControlNameExchangeList.push({ Cname: "温度计", Ename: "ThermometerChart", IconName: "ThermometerChart.png" });
        this.ControlNameExchangeList.push({ Cname: "箱线图", Ename: "BoxChart1", IconName: "BoxChart1.png" });
        this.ControlNameExchangeList.push({ Cname: "查询按钮", Ename: "InquireButton", IconName: "InquireButton.png" });
        this.ControlNameExchangeList.push({ Cname: "多选下拉列表框", Ename: "MultiSelect", IconName: "DropDownList.png" });
        this.ControlNameExchangeList.push({ Cname: "KPI面板", Ename: "KPIMenu", IconName: "KPIMenu.png" });
        this.ControlNameExchangeList.push({ Cname: "均值极差图", Ename: "SpcDemoODChart", IconName: "BasicChart.png" });

        this.ControlNameExchangeList.push({ Cname: "日期范围选择1", Ename: "TimeSelector", IconName: "TimePicker.png" });
        this.ControlNameExchangeList.push({ Cname: "联想输入框", Ename: "AssociativeInputBox", IconName: "AssociativeInputBox.png" });
        this.ControlNameExchangeList.push({ Cname: "单选按钮", Ename: "RadioButton", IconName: "RadioButton.png" });
        this.ControlNameExchangeList.push({ Cname: "复选框", Ename: "CheckBox", IconName: "CheckBox.png" });
        this.ControlNameExchangeList.push({ Cname: "新复选框", Ename: "NewCheckBox", IconName: "CheckBox.png" });
        this.ControlNameExchangeList.push({ Cname: "热图", Ename: "HeatMapChart", IconName: "DataGrid.png" });
        this.ControlNameExchangeList.push({ Cname: "多KPI图表", Ename: "KPIChart", IconName: "SPCSingleChart.png" });
        return this.ControlNameExchangeList;
    }
    this.ControlNameExchangeList = [];
}

Agi.Msg.ControlNameExchange = new Agi.Msg.ControlNameExchange();