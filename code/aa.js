
//region 新增DataSet字段别名之前方法结构
//region 1.方法名:DSSave (DataSet保存)
{
    "action":"update",
    "data":
    {
        "DataSet":
        {
            "ID":"误删lwlDS",
            "Memo":"",
            "DataSource":"QPCDB",
            ......
            "Columns":
            {
                "DataColumns":
                {
                    "DataColumn":
                    [
                    {"ID":"D_VALUE","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                    {"ID":"MID_CLASS","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                    {"ID":"CA0AL2_PASS_HEAT_CNT","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"}
                    ]
                },
                "CalColumns":{"CalColumn":[]}
            },
            "ClumnOrder":
            {
                "ColumnName":["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"]
            },
            "SortingRules":{"ColumnName":[]}
        }
    }
}
//endregion
//region 2.方法名:DSDataSetByID(DataSet信息获取)
{
    "result":"true",
    "message":"获取成功",
    "Data":
    {
        "DataSets":
        {
            "DataSet":
            {
                "ClumnOrder":
                {
                    "ColumnName":["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"]
                },
                "SortingRules":
                {
                    "ColumnName":[]
                },
                "Columns":
                {
                    "DataColumns":
                    {
                        "DataColumn":
                        [
                        {"ID":"D_VALUE","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                        {"ID":"MID_CLASS","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                        {"ID":"CA0AL2_PASS_HEAT_CNT","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"}
                        ]
                    },
                    "CalColumns":{"CalColumn":[]}
                },
                "DataSource":"QPCDB",
                "VirtualTable":"lwlTESTVT",
                "DefaultVisualContrl":"DropDownList",
                "ID":"误删lwlDS"
            }
        }
    }
}
//endregion
//region 3.获取DataSet信息 VSGetVirtualTable(获取DataSet虚拟表信息)
{
    "result":"true",
    "virtualTableData":
    {
        "data":
        {
            "vtName":"lwlTESTVT",
            "dataSourceName":"QPCDB",
            "sqlString":"select * from v_lg_cal_dstg_mid_rh",
            "para":[],
            "schema":["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"],
            "data1":""
        }
    },
    "datasetData":
    {
        "data":
        {
            "DataSet":
            {
                "ID":"误删lwlDS",
                "Memo":"",
                ........
                "Columns":
                {
                    "DataColumns":
                    {
                        "DataColumn":
                        [
                            {"ID":"D_VALUE","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                            {"ID":"MID_CLASS","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                            {"ID":"CA0AL2_PASS_HEAT_CNT","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"}
                        ]
                    },
                    "CalColumns":{"CalColumn":[]}
                },
                "ClumnOrder":
                {
                    "ColumnName":
                    ["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"]
                },
                "SortingRules":{"ColumnName":[]}
            }
        }
    },"message":"获取数据成功"
}
//endregion
//region 4.方法名 DSReadData （加载数据）
{
    "result":"true",
    "Data":
    [
        {"D_VALUE":"2013-01-01","MID_CLASS":"甲班","CA0AL2_PASS_HEAT_CNT":45},
        {"D_VALUE":"2013-01-02","MID_CLASS":"乙班","CA0AL2_PASS_HEAT_CNT":30}
    ],
    "message":"获取数据成功"
}
//endregion
//region 5.方法名 DSReadDataByPage(获取DataSet分页数据)
{
    "result":"true",
    "pageLimit":10,//每页显示记录数
    "pageNum":1,//当前页码
    "totalRows":12,//总记录数
    "totalPages":2,//总页数
    "Data":
    [
        {"D_VALUE":"2013-01-01","MID_CLASS":"甲班","CA0AL2_PASS_HEAT_CNT":45},
        {"D_VALUE":"2013-01-02","MID_CLASS":"乙班","CA0AL2_PASS_HEAT_CNT":30}
    ],
    "message":"获取数据成功"
}
//endregion
//endregion

//region 新增DataSet字段别名之后方法结构
//region 1.方法名:DSSave (DataSet保存)
{
    "action":"update",
    "data":
    {
        "DataSet":
        {
            "ID":"误删lwlDS",
            "Memo":"",
            .....
            "Columns":
            {
                "DataColumns":
                {
                    "DataColumn":
                    [
                        {"ID":"D_VALUE",Aliases:"日期","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                        {"ID":"MID_CLASS",Aliases:"类别#","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                        {"ID":"CA0AL2_PASS_HEAT_CNT",Aliases:"平均值","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"}
                    ]
                },
                "CalColumns":{"CalColumn":[]}
            },
            "ClumnOrder":
            {
                "ColumnName":["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"]
            },
            "SortingRules":{"ColumnName":[]}
        }
    }
}
//endregion
//region 2.方法名:DSDataSetByID(DataSet信息获取)
{
    "result":"true",
    "message":"获取成功",
    "Data":
    {
        "DataSets":
        {
            "DataSet":
            {
                "ClumnOrder":
                {
                    "ColumnName":["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"]
                },
                "SortingRules":
                {
                    "ColumnName":[]
                },
                "Columns":
                {
                    "DataColumns":
                    {
                        "DataColumn":
                        [
                            {"ID":"D_VALUE",Aliases:"日期","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                            {"ID":"MID_CLASS",Aliases:"类别#","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                            {"ID":"CA0AL2_PASS_HEAT_CNT",Aliases:"平均值","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"}
                        ]
                    },
                    "CalColumns":{"CalColumn":[]}
                },
                "DataSource":"QPCDB",
                "VirtualTable":"lwlTESTVT",
                "DefaultVisualContrl":"DropDownList",
                "ID":"误删lwlDS"
            }
        }
    }
}
//endregion
//region 3.获取DataSet信息 VSGetVirtualTable(获取DataSet虚拟表信息)
{
    "result":"true",
    "virtualTableData":
    {
        "data":
        {
            "vtName":"lwlTESTVT",
            "dataSourceName":"QPCDB",
            "sqlString":"select * from v_lg_cal_dstg_mid_rh",
            "para":[],
            "schema":["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"],
            "data1":""
        }
    },
    "datasetData":
    {
        "data":
        {
            "DataSet":
            {
                "ID":"误删lwlDS",
                ......
                "Columns":
                {
                    "DataColumns":
                    {
                        "DataColumn":
                        [
                            {"ID":"D_VALUE",Aliases:"日期","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                            {"ID":"MID_CLASS",Aliases:"类别#","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"},
                            {"ID":"CA0AL2_PASS_HEAT_CNT",Aliases:"平均值","DataType":"VARCHAR","Aggregator":"","GroupBy":"false","Visible":"true"}
                        ]
                    },
                    "CalColumns":{"CalColumn":[]}
                },
                "ClumnOrder":
                {
                    "ColumnName":
                    ["D_VALUE","MID_CLASS","CA0AL2_PASS_HEAT_CNT"]
                },
                "SortingRules":{"ColumnName":[]}
            }
        }
    },"message":"获取数据成功"
}
//endregion
//region 4.方法名 DSReadData （加载数据）
{
    "result":"true",
    "Data":
    [
        {"日期":"2013-01-01","类别#":"甲班","平均值":45},
        {"日期":"2013-01-02","类别#":"乙班","平均值":30}
    ],
        "message":"获取数据成功"
}
//endregion
//region 5.方法名 DSReadDataByPage(获取DataSet分页数据)
{
    "result":"true",
    "pageLimit":10,//每页显示记录数
    "pageNum":1,//当前页码
    "totalRows":12,//总记录数
    "totalPages":2,//总页数
    "Data":
    [
        {"日期":"2013-01-01","类别#":"甲班","平均值":45},
        {"日期":"2013-01-02","类别#":"乙班","平均值":30}
    ],
        "message":"获取数据成功"
}
//endregion
//endregion
