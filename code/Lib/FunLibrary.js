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
    {"FunName":"ToMonthFirstDay","FunTitle":"月份第一天"},
    {"FunName":"ToMonthLastDay","FunTitle":"月份最后一天"}
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
                _OldValue+="31";
            }
            else if(Month==4 || Month==6 || Month==9 || Month==11){
                _OldValue+="30";
            }
            else if(Month==2){
                if((Year%4==0 && Year%100!=0) || Year%400==0){
                    _OldValue+="29";
                }
                else{
                    _OldValue+="28";
                }
            }
        }
        return _OldValue;
    }//2.返回月份的最后一天
}