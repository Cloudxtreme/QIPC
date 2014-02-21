/**
 * Created with JetBrains WebStorm.
 * User: andy-guo
 * Date: 12-11-15
 * Time: 下午3:50
 * 统一功能
 */
Namespace.register('Agi.Script')
//公共方法
Agi.Script.Utility = {
    //实现控件的关系数据源重新绑定
    updateRelationData:function(controls){
        //debugger;
        if (controls && controls instanceof Array){
            $(controls).each(function(i,con){
                if(con.ReBindRelationData){
                    con.ReBindRelationData();
                }
            });
        }else{
            throw 'method updateRelationData parameter must be a array';
        }
    },
    //注册点位号
    registTagNamesForControls:function(controls,tagNames){
        if (controls && controls instanceof Array){
            $(controls).each(function(i,con){
                if(con.AddTagNames){
                    con.AddTagNames(con,tagNames);
                }
            });
        }else{
            throw 'method registTagName parameter must be a array';
        }
    }
};