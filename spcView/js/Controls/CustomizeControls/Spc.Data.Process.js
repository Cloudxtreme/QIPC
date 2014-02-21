/**
 * Created with JetBrains WebStorm.
 * User: andy
 * Date: 12-9-20
 * Time: 上午10:49
 * To change this template use File | Settings | File Templates.
 */
Namespace.register('Spc.Data');
Spc.Data = {
    options : {
        tempData:null
    },

    DataArray : function(data){
        var arr = [];
        var len = 0;
        if(data && data.length){
            $(data).each(function(i,aData){
                //构造分组
                for(name in aData){
                    if( typeof aData[name] == 'number'){
                        arr.push( aData[name] );
                    }
                }
            });
        }
        return arr;
    },

    //for grid
    DataGroup : function(data){
        //SPC 均差,极差 数据处理
        var self = this;

        //    var result = {
        //        isOK        :false,
        //        groupData   :[],
        //        data        :null
        //    };
        if(data && data.length){
            var aData = data[0];
            var group = [];
            //构造分组
            for(name in aData){
                if( typeof aData[name] == 'number'){
                    var g ={
                        dataKey : name,
                        data    :[]
                    }
                    group.push(g);
                }
            }
            //填充分组的数据
            $(data).each(function(i,d){
                for(name in d){
                    if( typeof d[name] == 'number' ){
                        //find group
                        var findGr = $.grep(group,function(g){
                            return g.dataKey === name;
                        });
                        if(findGr && findGr.length){
                            findGr[0].data.push(d[name]);
                        }
                    }
                }
            });
//            var dataArray = [];
//            $(group).each(function(i,g){
//                dataArray.push(g.data.join('|'));
//            });

            return group;
        }//end if

        //添加均差和极差

        return result;
    },

    RequestSpcData : function(method,jsonData,callback){

        //参数验证
        {
            if(!method){
                throw 'RequestSpcData method is null';
            }
            if(!jsonData){
                throw 'RequestSqcData jsonData is null';
            }
            if(!callback){
                throw 'RequestSqcData callBack is null';
            }
        }
        var self = this;
        var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
        //debugger;
        Agi.DAL.ReadData({
            "MethodName":method,
            "Paras":jsonString, //json字符串
            "CallBackFunction":function (result) {     //回调函数
//                alert(result.result);
                if (result && result.result) {
                    //var data = result.Data ? result.Data : [];
                    callback.call(self,result);
                } else {
                    callback.call(self,result);
                }
            }
        });
    },

    //datagrid data
    GetSpcDataForGrid : function(data,Groupnrow,CallBack1){
        /* 20121121 markeluo SPC图修改  NO:201211211409 start */
        var self = this;
        var dataArray = [];
        if(data.Data && data.Data.length>0){
            if(!isNaN(data.Data[0][data.Columns[0]])){
                for(var i=0;i<data.Data.length;i++){
                    dataArray.push(eval(data.Data[i][data.Columns[0]]));
                }
            }
            var group=[];
            var thisitems=[];
            for(var i=0;i<dataArray.length;i++){
                thisitems.push(dataArray[i]);
                if(thisitems.length==eval(Groupnrow)){
                    group.push(thisitems);
                    thisitems=[];
                }
            }
            if(group[group.length-1].length<Groupnrow){
                group.splice((group.length-1),1);
            }
            dataArray=group;
            thisitems=null;
            group=null;
        }
        var jsonData = {
            'action':'RCalMeanRange',
            'dataArray':dataArray,
            'proflg':'mr_plot'
        };
        /* NO:201211211409 end */
        //参数默认格式
//        var meanObj = Agi.Script.CloneObj(data);
//        meanObj.XNAME = "均值";//SPC_Name
//        var rangeObj = Agi.Script.CloneObj(data);
//        rangeObj.XNAME = "极差";

        var meanObj =[];
        var rangeObj =[];

        self.RequestSpcData('RCalMeanRange',jsonData,function(result){
            var tempCallBack = CallBack1;
            //mean:均值
            //range:极差

//            var arr = [];
//            for(name in meanObj){
//                if(typeof meanObj[name] == 'number'){
//                    arr.push({
//                        key: name
//                    });
//                }
//            }
//            $(result.mr_data).each(function(i,d){
//                meanObj[arr[i].key] = parseFloat(d.mean.toFixed(3));//均值
//                rangeObj[arr[i].key] = parseFloat(d.range.toFixed(3));//极差
//            });
            if(!result){
                return;
            }
            $(result.mr_data).each(function(i,d){
                meanObj.push(parseFloat(d.mean.toFixed(3)));//均值
                rangeObj.push(parseFloat(d.range.toFixed(3)));//极差
            });
            tempCallBack({
                arr  : [meanObj,rangeObj],
                plot_data : result.plot_data//markeluo 20121126 10:31
            });
        });
//
//        var obj ={
//            na:0,
//            nn:1
//        }
//        for(name in obj){
//            alert(name);
//        }
    },

    //infoTable data
    GetSpcDataForInfoTable:function(method,param,CallBack){
        var self = this;
        self.RequestSpcData(method,param,function(result){
            //debugger;
            CallBack.call(this,result);
        });
    }

}//end