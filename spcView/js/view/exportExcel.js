/**
 * Created with JetBrains WebStorm.
 * User: yehao
 * Date: 12-12-19
 * Time: 上午11:40
 * To change this template use File | Settings | File Templates.
 */
function getControlData(){
    var tempControls = [];
    var controlDataList = [];
    var controlInfo = {name:"",data:[]};
    if (Agi.view.workspace.controlList) { //获得页面上所有控件的名字
        var ControlsArray = Agi.view.workspace.controlList.toArray();
        if (ControlsArray != null && ControlsArray.length > 0) {
            for (var i = 0; i < ControlsArray.length; i++) {
                tempControls.push(ControlsArray[i].Get("ProPerty").ID);
            }
        }
    }
    if(tempControls !=null && tempControls.length>0){
        for(var n=0;n<tempControls.length;n++){
            var controlObj = Agi.Controls.FindControl(tempControls[n]); //获得控件对象
            //var data = controlObj.GetEntityData(); //获得数据
            //modify by lj 2012-12-29 修复数据导入Excel失败问题
            var data=null;
            try {
                var data = controlObj.Get("Entity")[0].Data;
            } catch (e) { }
            var controlType = controlObj.GetConfig().ControlType;//控件类型
            if(data !=null && data.length>0){
                var typeDescribe = "";
                switch(controlType){ //根据控件类型添加描述
                    case"BasicChart":
                        typeDescribe = "通用chart";
                        break;
                    case"BoxChart":
                        typeDescribe = "箱线chart";
                        break;
                    case"ODChart":
                        typeDescribe = "均值极差图";
                        break;
                    case"ODInfoTable":
                        typeDescribe = "过程能力信息";
                        break;
                    case"DataGrid":
                        typeDescribe = "数据表格";
                        break;
                    case"DropDownList":
                        typeDescribe = "下拉框列表";
                        break;
                    case"Label":
                        typeDescribe = "标签";
                        break;
                    case"MassDataChart":
                        typeDescribe = "大数据chart";
                        break;
                    case"PCChart":
                        typeDescribe = "过程能力图表";
                        break;
                    case"PCLabel":
                        typeDescribe = "过程能力摘要";
                        break;
                    case"SPCSingleChart":
                        typeDescribe = "单值图";
                        break;
                }
                tempControls[n] = tempControls[n]+"  "+typeDescribe;
                controlInfo ={name:tempControls[n],data:data};
                controlDataList.push(controlInfo);
            }
        }
    }
    var jsonToString = JSON.stringify(controlDataList);//将获得数据转换成JSon
    //var jsonToString ="[{'name':'DataGrid2085','data':[{'CrovinceName':'鄂州 ','CityValues':1500,'ParentName':'湖北省'},{'CrovinceName':'恩施','CityValues':200,'ParentName':'湖北省'},{'CrovinceName':'黄冈 ','CityValues':30,'ParentName':'湖北省'},{'CrovinceName':'黄石','CityValues':130,'ParentName':'湖北省'},{'CrovinceName':'荆门 ','CityValues':700,'ParentName':'湖北省'},{'CrovinceName':'荆州 ','CityValues':280,'ParentName':'湖北省'},{'CrovinceName':'十堰 ','CityValues':300,'ParentName':'湖北省'},{'CrovinceName':'随州 ','CityValues':130,'ParentName':'湖北省'},{'CrovinceName':'武汉 ','CityValues':50,'ParentName':'湖北省'},{'CrovinceName':'咸宁 ','CityValues':50,'ParentName':'湖北省'},{'CrovinceName':'襄樊','CityValues':200,'ParentName':'湖北省'},{'CrovinceName':'孝感 ','CityValues':120,'ParentName':'湖北省'},{'CrovinceName':'宜昌 ','CityValues':300,'ParentName':'湖北省'}]},{'name':'DropDownList578320','data':[{'CrovinceName':'浙江省','MaxValue':890,'CityValues':5430,'ParentName':'中国'},{'CrovinceName':'云南省','MaxValue':1300,'CityValues':7030,'ParentName':'中国'},{'CrovinceName':'四川省','MaxValue':1300,'CityValues':8480,'ParentName':'中国'},{'CrovinceName':'陕西省','MaxValue':890,'CityValues':5450,'ParentName':'中国'},{'CrovinceName':'山西省','MaxValue':568,'CityValues':3260,'ParentName':'中国'},{'CrovinceName':'山东省','MaxValue':1002,'CityValues':6360,'ParentName':'中国'},{'CrovinceName':'青海省','MaxValue':568,'CityValues':3910,'ParentName':'中国'},{'CrovinceName':'辽宁省','MaxValue':568,'CityValues':3960,'ParentName':'中国'},{'CrovinceName':'江西省','MaxValue':890,'CityValues':5610,'ParentName':'中国'},{'CrovinceName':'江苏省','MaxValue':450,'CityValues':2740,'ParentName':'中国'},{'CrovinceName':'吉林省','MaxValue':890,'CityValues':5180,'ParentName':'中国'},{'CrovinceName':'湖北省','MaxValue':568,'CityValues':3990,'ParentName':'中国'},{'CrovinceName':'黑龙江省','MaxValue':568,'CityValues':3070,'ParentName':'中国'},{'CrovinceName':'河南省','MaxValue':890,'CityValues':5500,'ParentName':'中国'},{'CrovinceName':'河北省','MaxValue':786,'CityValues':4960,'ParentName':'中国'},{'CrovinceName':'海南省','MaxValue':890,'CityValues':5140,'ParentName':'中国'},{'CrovinceName':'贵州省','MaxValue':369,'CityValues':1840,'ParentName':'中国'},{'CrovinceName':'广东省','MaxValue':1002,'CityValues':6010,'ParentName':'中国'},{'CrovinceName':'甘肃省','MaxValue':568,'CityValues':3640,'ParentName':'中国'},{'CrovinceName':'福建省','MaxValue':369,'CityValues':1840,'ParentName':'中国'},{'CrovinceName':'安徽省','MaxValue':1300,'CityValues':7770,'ParentName':'中国'}]}]" ;
    Agi.DAL.ReadData({ "MethodName": "MagicExport", "Paras": jsonToString, "CallBackFunction": function (_result) { //后台根据传入参数生成Excel
        //window.open(Agi.ExcelServiceAddress + _result.filePath, "页面下载", "hight=30px;width=100px");
        //window.location = _result.filePath;
        $("#tempifarme").remove();
        var elemIF = document.createElement("iframe");
        elemIF.id = "tempifarme";
        elemIF.src = Agi.ImgServiceAddress + "/MagicExport/" + _result.filePath;
        document.body.appendChild(elemIF);
        elemIF.style.display = "none";
    }
    });
}