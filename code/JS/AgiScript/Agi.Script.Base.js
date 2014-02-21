/**
 * Created with JetBrains WebStorm.
 * User: andy guo
 * Date: 12-8-14
 * Time: 下午2:15
 * 脚本功能基类
 */
Namespace.register("Agi.Script");
Agi.Script.Base = function(){
    //自定义事件对象
    this._scriptCode  = {};
    this._timerInterval = 5000;

    this._timer = undefined;
};
Agi.Script.Base.prototype = {
    constructor : Agi.Script.Base,
    //激活自定义事件
    fireScriptCode: function(event){
        if(Agi.Edit){
           return;
        }
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }
        if(event.type === 'timer'){
            if(this._scriptCode[event.type]){
                var codeexcuteable = this.validScriptCode(this._scriptCode[event.type].code);
                this._timer = eval("setInterval(function(){" + codeexcuteable + "},"+this._timerInterval+");");
            }
            return;
        }
        if (this._scriptCode[event.type]){
            var codeexcuteable = this.validScriptCode(this._scriptCode[event.type].code);
            eval(codeexcuteable);
        }
    },
    //对脚本的可执行性进行简单处理
    validScriptCode:function(codeIn){
        var excuteableCode = '';
        excuteableCode = codeIn.replace(/[\n]/g,'');//去回车
        return excuteableCode;
    },
    //添加自定义事件
    addScriptCode: function(type, code_in){
        //debugger;
        if(!this._scriptCode){
            this._scriptCode = {};
        }
        if (typeof this._scriptCode[type] == "undefined"){
            this._scriptCode[type] = {
                code:''
            };
        }
        this._scriptCode[type].code = code_in;
    },
    removeScriptCode: function(type){
        if(type==undefined){
            throw 'removeListener param type is null';
        }
        if (this._scriptCode[type]){
            delete this._scriptCode[type];
        }
    },

    //得到控件所有自定义事件的代码-保存时用到
    getScriptCode:function(){
        if(!this._scriptCode){
            return null;
        }
        var lis = [{
            type:'',
            code:''
        }];
        lis.length = 0;
        for(name in this._scriptCode){
            if(name==''){
                continue;
            }
            lis.push({
                type:name,
                code:this._scriptCode[name].code
            })
        }

        return {
            timerInterval:this._timerInterval,
            script:lis
        };
    },
    //设置控件所有自定义事件的代码-读取时用到
    setScriptCode:function(config){
        this._scriptCode = {};
        //debugger;
        if(config){
            this._timerInterval = config.timerInterval;
            var lis = config.script;
            for(var i = 0 ; i < lis.length ; i ++){
                var li = lis[i];
                this.addScriptCode(li.type,li.code);
            }
        }
    },

    stopTimer : function(){
        if(this._timer){
            clearInterval(this._timer)
            this._timer = undefined;
        }
    }
}

