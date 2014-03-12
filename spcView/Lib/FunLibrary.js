/**
 * Created with JetBrains WebStorm.
 * User: wanli
 * Date: 14-2-20
 * Time: 上午8:37
 * 格式化函数库（为钻取参数值提供格式化所需的各种函数）
 */
Namespace.register("Agi.FunLibrary");
/*添加 Agi.FunLibrary命名空间*/

//函数库名称列表
Agi.FunLibrary.ItemNames =
    [
        {"FunName":"ToMonthFirstDay","FunTitle":"获取月份第一天"},
        {"FunName":"ToMonthLastDay","FunTitle":"获取月份最后一天"}
//        ,{"FunName":"MaxValue","FunTitle":"获取最大值"},
//        {"FunName":"MinValue","FunTitle":"获取最小值"},
//        {"FunName":"MeanValue","FunTitle":"计算均值"},
//        {"FunName":"SDValue","FunTitle":"计算标准差值"},
//        {"FunName":"Deviation","FunTitle":"计算离差值"}
    ];

//函数库子列表
Agi.FunLibrary.Items={
    "ToMonthFirstDay":function(_OldValue){
        if(_OldValue.length==7){
            _OldValue=_OldValue.replace("/","-");
            _OldValue=_OldValue+"-01";
        }
        return _OldValue;
    },//1.返回月份的第一天
    "ToMonthLastDay":function(_OldValue){
        if(_OldValue.length==7){
            _OldValue=_OldValue.replace("/","-");
            var Year=eval(_OldValue.substr(0,_OldValue.lastIndexOf("-")));
            var Month=eval(_OldValue.substr(_OldValue.lastIndexOf("-")+1));
            if(Month==1 || Month==3 || Month==5 || Month==7 || Month==8 || Month==10 || Month==12){
                _OldValue+="-31";
            }
            else if(Month==4 || Month==6 || Month==9 || Month==11){
                _OldValue+="-30";
            }
            else if(Month==2){
                if((Year%4==0 && Year%100!=0) || Year%400==0){
                    _OldValue+="-29";
                }
                else{
                    _OldValue+="-28";
                }
            }
        }
        return _OldValue;
    },//2.返回月份的最后一天
    "MaxValue":function(_ArrayItems){
        return Math.max.apply(Math,_ArrayItems);
    },//3.获取最大值,输入参数需要数组格式
    "MinValue":function(_ArrayItems){
        return Math.min.apply(Math,_ArrayItems);
    },//4.获取最小值,输入参数需要数组格式
    "MeanValue":function(_ArrayItems){
        var meanvalue=null;
        if(_ArrayItems!=null && _ArrayItems.length>0){
            var total=0;
            for(var i=0;i<_ArrayItems.length;i++){
                total+=_ArrayItems[i];
            }
            meanvalue=total/_ArrayItems.length;
        }
        return meanvalue;
    },//3.获取平均值,输入参数需要数组格式
    "SDValue":function(_ArrayItems){
        var sdvalue=null;
        if(_ArrayItems!=null && _ArrayItems.length>0){
            var total=0;
            for(var i=0;i<_ArrayItems.length;i++){
                total+=_ArrayItems[i];
            }
            var meanvalue=total/_ArrayItems.length;
            total = 0;
            for(var i=0;i<_ArrayItems.length;i++){
                var deviation = _ArrayItems[i] -meanvalue;
                total +=deviation * deviation;
            }
            sdvalue= Math.sqrt(total/(_ArrayItems.length-1));
        }
        return sdvalue;
    },//4.获取标准差值,输入参数需要数组格式
    "Deviation":function(_ArrayItems){
        var deviationvalues=null;
        if(_ArrayItems!=null && _ArrayItems.length>0){
            deviationvalues=[];
            var total=0;
            for(var i=0;i<_ArrayItems.length;i++){
                total+=_ArrayItems[i];
            }
            var meanvalue=total/_ArrayItems.length;
            for(var i=0;i<_ArrayItems.length;i++){
                deviationvalues.push((_ArrayItems[i]-meanvalue));
            }
        }
        return deviationvalues;
    }//4.获取离差值,输入参数需要数组格式，返回结果为数组格式
}