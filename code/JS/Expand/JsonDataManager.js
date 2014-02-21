/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-8-7
 * Time: 下午3:05
 * To change this template use File | Settings | File Templates.
 */
window.Agi={};
window.Agi.Json={
    types:{
        mixed : {
            name : 'mixed',
                coerce : function(v) {
                return v;
            },
            test : function(v) {
                return true;
            },
            compare : function(s1, s2) {
                if (s1 < s2) { return -1; }
                if (s1 > s2) { return 1;  }
                return 0;
            },
            numeric : function(v) {
                return isNaN(Number(v) ) ? null : Number(v);
            }
        },
        string : {
            name : "string",
                coerce : function(v) {
                return v == null ? null : v.toString();
            },
            test : function(v) {
                return (v === null || typeof v === "undefined" || typeof v === 'string');
            },
            compare : function(s1, s2) {
                if (s1 == null && s2 != null) { return -1; }
                if (s1 != null && s2 == null) { return 1; }
                if (s1 < s2) { return -1; }
                if (s1 > s2) { return 1;  }
                return 0;
            },

            numeric : function(value) {
                if (_.isNaN(+value) || value === null) {
                    return null;
                } else if (_.isNumber(+value)) {
                    return +value;
                } else {
                    return null;
                }
            }
        },
        boolean : {
            name : "boolean",
                regexp : /^(true|false)$/,
                coerce : function(v) {
                if (v === 'false') { return false; }
                return Boolean(v);
            },
            test : function(v) {
                if (v === null || typeof v === "undefined" || typeof v === 'boolean' || this.regexp.test( v ) ) {
                    return true;
                } else {
                    return false;
                }
            },
            compare : function(n1, n2) {
                if (n1 == null && n2 != null) { return -1; }
                if (n1 != null && n2 == null) { return 1; }
                if (n1 == null && n2 == null) { return 0; }
                if (n1 === n2) { return 0; }
                return (n1 < n2 ? -1 : 1);
            },
            numeric : function(value) {
                if (_.isNaN(value)) {
                    return null;
                } else {
                    return (value) ? 1 : 0;
                }
            }
        },
        number : {
            name : "number",
                regexp : /^[\-\.]?[0-9]+([\.][0-9]+)?$/,
                coerce : function(v) {
                if (_.isNull(v)) {
                    return null;
                }
                return _.isNaN(v) ? null : +v;
            },
            test : function(v) {
                if (v === null || typeof v === "undefined" || typeof v === 'number' || this.regexp.test( v ) ) {
                    return true;
                } else {
                    return false;
                }
            },
            compare : function(n1, n2) {
                if (n1 == null && n2 != null) { return -1; }
                if (n1 != null && n2 == null) { return 1; }
                if (n1 == null && n2 == null) { return 0; }
                if (n1 === n2) { return 0; }
                return (n1 < n2 ? -1 : 1);
            },
            numeric : function(value) {
                return value;
            }
        },
        time : {
            name : "time",
                format : "DD/MM/YYYY",
                _formatLookup : [
                ['DD', "\\d{2}"],
                ['D' ,  "\\d{1}|\\d{2}"],
                ['MM', "\\d{2}"],
                ['M' , "\\d{1}|\\d{2}"],
                ['YYYY', "\\d{4}"],
                ['YY', "\\d{2}"],
                ['A', "[AM|PM]"],
                ['hh', "\\d{2}"],
                ['h', "\\d{1}|\\d{2}"],
                ['mm', "\\d{2}"],
                ['m', "\\d{1}|\\d{2}"],
                ['ss', "\\d{2}"],
                ['s', "\\d{1}|\\d{2}"],
                ['ZZ',"[-|+]\\d{4}"],
                ['Z', "[-|+]\\d{2}:\\d{2}"]
            ],
                _regexpTable : {},
            _regexp: function(str) {
                var bolState=false;
                var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

                if(r!=null){
                    var d= new Date(r[1], r[3]-1, r[4]);
                    bolState=(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
                }
                if(!bolState){
                    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
                    var r = str.match(reg);
                    if(r!=null){
                        var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
                        bolState= (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
                    }
                }
                return bolState;
            },
            coerce : function(v, options) {
                options = options || {};
                // if string, then parse as a time
                if (typeof(v)=="string") {
                    var format = options.format || this.format;
                    return moment(v, options.format);
                } else if (typeof(v)=="number") {
                    return moment(v);
                } else {
                    return v;
                }
            },
            test : function(v, options) {
                options = options || {};
                if (v === null || typeof v === "undefined") {
                    return true;
                }
                if (typeof(v)=="string") {
                    return this._regexp(v);
                } else {
                    if(typeof v=="object"){
                        if(v instanceof Date){
                            return true;
                        }
                    }
                    return false;
                }
            },
            compare : function(d1, d2) {
                if (d1 < d2) {return -1;}
                if (d1 > d2) {return 1;}
                return 0;
            },
            numeric : function( value ) {
                return value.valueOf();
            }
        }
    },
    //判断类型
    /*
    * value:判断的值
    * options:判断表达式，一般可省略
    * */
    TypeOf:function(value, options){
        var chosenType ='string';
        for(var obj in Agi.Json.types){
            if(Agi.Json.types[obj].test(value,options)){
                chosenType=Agi.Json.types[obj].name;
            }
        }
        return chosenType;
    },
    //排序
    /*
    * _Data:排序的Json数组，格式为[{obj},{obj},....]
    * _Column:排序属性，Obj._Column
    * _Dir:排序方向，ASC:正序，DESC:倒序
    */
    Sort:function(_Data,_Column,_Dir){
        if(_Data!=null && _Data.length>0){
            for(var j=1;j<_Data.length;j++){
                for(var i=0;i<_Data.length-j;i++){
                    if(_Dir=="ASC"){
                        if(Agi.Json.types[Agi.Json.TypeOf(eval("_Data[i]."+_Column))].compare(eval("_Data[i]."+_Column),eval("_Data[i+1]."+_Column))===1){
                            var temp=_Data[i];
                            _Data[i]=_Data[i+1];
                            _Data[i+1]=temp;
                        }
                    }else{
                        if(Agi.Json.types[Agi.Json.TypeOf(eval("_Data[i]."+_Column))].compare(eval("_Data[i]."+_Column),eval("_Data[i+1]."+_Column))===-1){
                            var temp=_Data[i];
                            _Data[i]=_Data[i+1];
                            _Data[i+1]=temp;
                        }
                    }

                }
            }
        }
    },
    //筛选
    /*
    * _Data:筛选Json数组，格式为：[{obj},{obj},....]
    * _FilterCondition:筛选条件，格式为{Column:_column,Sign:_sign,Value;_value}
    *   Column:筛选栏位
    *   Sign:筛选操作符，包括:=(等于)，&(大于并且小于，范围值),>,>=,<,<=,in(是否包括在其中)
    *   Value:可能类型为：单值，或数组[value],当Sign为&时，数组元素个数为2，且元素1的值小于元素2的值
    * */
    Filter:function(_Data,_FilterCondition){
        var FilterData=[];
        var IsConform=function(_value,_condition){
            var bolTrue=false;
            if(_condition.Sign=="=" || _condition.Sign==">"||_condition.Sign==">=" || _condition.Sign=="\<"||_condition.Sign=="\<="){
                var ColumnValue=eval("_value."+_condition.Column);
                if(_condition.Sign=="=" && ColumnValue==_condition.Value){
                    ColumnValue=null;
                    bolTrue= true;
                    return bolTrue;
                }
                if(_condition.Sign=="\<" && ColumnValue<_condition.Value){
                    ColumnValue=null;
                    bolTrue= true;
                    return bolTrue;
                }
                if(_condition.Sign=="\<=" && ColumnValue<=_condition.Value){
                    ColumnValue=null;
                    bolTrue= true;
                    return bolTrue;
                }
                if(_condition.Sign==">" && ColumnValue>_condition.Value){
                    ColumnValue=null;
                    bolTrue= true;
                    return bolTrue;
                }
                if(_condition.Sign==">=" && ColumnValue>=_condition.Value){
                    ColumnValue=null;
                    bolTrue= true;
                    return bolTrue;
                }
                ColumnValue=null;
            }else if(_condition.Sign=="&"){
                if(eval("_value."+_condition.Column)>=_condition.Value[0] && eval("_value."+_condition.Column)<=_condition.Value[1]){
                    bolTrue= true;
                }
            }
            else if(_condition.Sign=="in"){
                for(var i=0;i<_condition.Value.length;i++){
                    if(eval("_value."+_condition.Column)==_condition.Value[i]){
                        bolTrue= true;
                        break;
                    }
                }
            }
            return bolTrue;
        }
        if(_Data!=null && _FilterCondition!=null && _FilterCondition.Column!=null
            && _FilterCondition.Sign !=null && _FilterCondition.Value !=null){
            for(var i=0;i<_Data.length;i++){
                if(IsConform(_Data[i],_FilterCondition)){/*符合筛选条件*/
                    FilterData.push(_Data[i]);
                }
            }
        }
        IsConform=null;/*清空局部变量，因为处于闭包之内，若不清空会导致内存占用*/
        return FilterData;
    }
}