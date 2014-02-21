/*
编写人：鲁佳
描述：解析页面是否完成处理类
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.PageLoadManageClass = function () {
    Agi.Attribute.Agi_AttributeManager.apply(this, arguments);   //继承属性管理器

    //定义属性
    this.addAttr("PageControlCount", 0);
    this.addAttr("PageControlLoadindex", 0);
    this.addAttr("UrlParas", null);
     
    this.ControlAttributeChangeEvent = function (sender, key, value) {
        if (key == "PageControlLoadindex") {
            if (this.Get("PageControlCount") == this.Get("PageControlLoadindex") && this.Get("PageControlCount") > 0) { //所有控件加载完成
                //(1)url参数处理 
                Agi.Msg.UrlManageInfo.ReadUrlParas(this.Get("UrlParas"));  //处理url模块

                //(2)页面加载完成注册实时点位
                var point = "";
                for (var i = 0; i < Agi.Msg.PointsManageInfo.ControlPoints.length; i++) {
                    point += Agi.Msg.PointsManageInfo.ObjectToString(Agi.Msg.PointsManageInfo.ControlPoints[i].Points);
                }
                //解决编辑环境下,有些控件渲染后位置不对的问题 andy guo
                if(Agi.Edit){
                    $('div.PanelSty','#BottomRightCenterContentDiv').mouseover().find('.selectPanelheadSty').addClass('hide');
                }
                Agi.Msg.PointsManageInfo.RegPoint1(point);

                //(3)脚本事件注册
                Agi.Controls.IsOpenControl = false; //激活页面loaded事件
                canvas.fireScriptCode('loaded');
                canvas.fireScriptCode('timer');

                //(4)共享数据源处理
                Agi.Msg.TriggerManage.ShareDataInLoadComplete();
            }
        }
    }
}
Agi.Msg.PageLoadManage = new Agi.Msg.PageLoadManageClass();