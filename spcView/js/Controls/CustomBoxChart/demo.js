/**
 * Created by Yi on 13-10-16.
 */
//箱线图输入格式
var request = {
    "action": "RCalBoxplot",
    "dataArray": [
        ["-46.9", "-45.1", "-28.71", "-30.85", "-25", "-23"],
        ["20.1", "-53.04", "-46.9", "-45.1", "33", "20"],
        ["0.38", "0.38", "0.38", "0.38", "0.54", "0.50", "0.44", "0.65", "0.73"],
        ["6.17", "3.93", "6.17", "3.93", "4.54", "6.50", "10.3", "2.15", "4.54", "12.5", "4.5", "6.7"]
    ]
}

//---------------箱线图返回格式
//med:中位数,qua_l:上限,qua_u:下限,box_u:上四分位,box_l:下四分位,iqrange:极差值,mean:均值,anomalousarray:异常点(可包含多个)
var response = {
    "result": "true",
    "data": {
        meddata: [
            {"med": 13.52, "qua_l": 11.94, "qua_u": 18.95, "box_u": 17.8175, "box_l": 12.11, "iqrange": 5.7075, "mean": 14.4825, "anomalousarray": []},
            {"med": 13.51, "qua_l": 7.03, "qua_u": 14.66, "box_u": 13.51, "box_l": 7.07, "iqrange": 6.44, "mean": 9.735, "anomalousarray": []},
            {"med": 12.895, "qua_l": 10.92, "qua_u": 14.52, "box_u": 14.21, "box_l": 11.3175, "iqrange": 1.8925, "mean": 12.8075, "anomalousarray": []},
            {"med": 19.75, "qua_l": 10.46, "qua_u": 22.5, "box_u": 22.225, "box_l": 12.37, "iqrange": 9.855, "mean": 18.115, "anomalousarray": []}
        ],//箱线图数据
        mediandata: [
            {"med": 13.52, "qua_l": 11.94, "qua_u": 18.95, "box_u": 18.95, "box_l": 11.94, "iqrange": 13.52, "mean": 14.4825, "anomalousarray": null},
            {"med": 13.51, "qua_l": 7.03, "qua_u": 14.66, "box_u": 14.66, "box_l": 7.03, "iqrange": 7.63, "mean": 9.735, "anomalousarray": null},
            {"med": 12.895, "qua_l": 10.92, "qua_u": 14.52, "box_u": 14.52, "box_l": 10.92, "iqrange": 3.6, "mean": 12.8075, "anomalousarray": null},
            {"med": 19.75, "qua_l": 10.46, "qua_u": 22.5, "box_u": 22.5, "box_l": 10.46, "iqrange": 12.94, "mean": 18.115, "anomalousarray": null}
        ],//中位数置信区间框
        terrible: [
            {"med": 13.52, "qua_l": 11.94, "qua_u": 18.95, "box_u": 18.95, "box_l": 11.94, "iqrange": 13.52, "mean": 14.4825, "anomalousarray": null},
            {"med": 13.51, "qua_l": 7.03, "qua_u": 14.66, "box_u": 14.66, "box_l": 7.03, "iqrange": 7.63, "mean": 9.735, "anomalousarray": null},
            {"med": 12.895, "qua_l": 10.92, "qua_u": 14.52, "box_u": 14.52, "box_l": 10.92, "iqrange": 3.6, "mean": 12.8075, "anomalousarray": null},
            {"med": 19.75, "qua_l": 10.46, "qua_u": 22.5, "box_u": 22.5, "box_l": 10.46, "iqrange": 12.94, "mean": 18.115, "anomalousarray": null}
        ]//极差框
    },
    "message": "返回成功"
}