/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-9-4
 * Time: 下午4:35
 * To change this template use File | Settings | File Templates.
 */
/*异步加载必须JS*/
agi.jsloader
    .script("js/view/view.core.js")
    .wait()
    .script("js/view/view.workspace.js")
    .script("js/view/view.function.js")
    .script("js/view/view.todo.js")
    .wait(function () {
        //就绪
        $(function () {
//            Agi.view.functions.loadControlLibs();
//            Agi.view.functions.openPage();
            //20130117 17:08 markeluo 更改为回调处理，解决在部分情况下还未加载控件配置文件列表的情况下去打开页面，导致打开页面无法正常加载显示空白的情况
            Agi.view.functions.loadControlLibs(function(){
                Agi.view.functions.openPage();
            });
        });
    });

