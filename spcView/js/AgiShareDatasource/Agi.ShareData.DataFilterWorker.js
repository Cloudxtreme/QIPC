/*
编写人：鲁佳
描述：共享数据源数据二次过滤线程
*/
onmessage = function (e) {
    var data = e.data.datainfo.Data;
    for (var i = 0; i < data.length; i++) {
        //var state = eval("data[i].CityValues>'10' && data[i].CrovinceName=='武汉 '");
        var state = eval(e.data.expression);
        if (!state) {
            data.splice(i, 1);
            i--;
            continue;
        }
    }
    postMessage(e.data);
}
