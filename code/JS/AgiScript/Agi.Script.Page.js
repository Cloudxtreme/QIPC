/**
 * Created with JetBrains WebStorm.
 * User: andy guo
 * Date: 12-8-14
 * Time: 下午2:15
 * 页面级的脚本功能  继承自脚本功能基类
 */
Namespace.register('Agi.Script')
Agi.Script.Page = function(runModel){
    var self = this;
    Agi.Script.Base.apply(this, arguments);

    self.runModel = runModel;

    self.setTimerInterval = function (interval) {
        if (interval >= 1000) {
            this._timerInterval = interval;
        }
    }

    //下面是测试用的脚本代码
//    self.addScriptCode('timer',"console.log('页面级的定时器已经启动!'+ new Date());");
//    self.addScriptCode('loaded',"alert('这是一个测试窗口,看到这个窗口表示页面上的控件已经加载完成了!');");
//    self.addScriptCode('click',"alert('你点击了画布,画布的点击脚本功能被触发!');")

}
//实现继承关系
Agi.Script.Page.prototype = new Agi.Script.Base();
Agi.Script.Page.prototype.constructor = Agi.Script.Page;

var canvas = new Agi.Script.Page('');