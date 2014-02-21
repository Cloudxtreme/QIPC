/*
*
 * Created with JetBrains WebStorm.
 * User: wulei
 * Date: 12-10-12
 * Time: 下午2:53
 * To change this template use File | Settings | File Templates.
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.OpenFlexToggle = function () {
    this.style=function(node){
        return node.currentStyle || document.defaultView.getComputedStyle(node,null) || node.style;
    },
   this.height=function(node){
        return parseInt(Agi.Msg.OpenFlexToggleManage.style(node).height) || parseInt(node.clientHeight);
    },
    this.id=function(node){
        return document.getElementById(node);
    }
}
Agi.Msg.OpenFlexToggleManage = new Agi.Msg.OpenFlexToggle();

function _toggle(node,speed){
    this.node = node;
    switch(speed){
        case "fast":
            this.speed = 20;
            break;
        case "normal":
            this.speed = 10;
            break;
        case "slow":
            this.speed = 5;
            break;
        default:
            this.speed =10;
    }
    this.run = 1;
    this.max_height = Agi.Msg.OpenFlexToggleManage.height(this.node);
    this.node.style.height = this.max_height;
    this.display = Agi.Msg.OpenFlexToggleManage.style(this.node).display;
   // this.node.style.overflow = "hidden";
    if(this.max_height <=0 || this.display == "none"){
        this.flag = 1;
    }else{
        this.flag = -1;
    }
}
_toggle.prototype.up_down = function(){
    if(this.node.style.display == "none"){
        this.node.style.display = "block";
        this.node.style.height ="0px";
    }
    this.box_height = parseInt(Agi.Msg.OpenFlexToggleManage.style(this.node).height);
    this.box_height -= this.speed * this.flag;
    if(this.box_height > this.max_height){
        window.clearInterval(this.t);
        this.box_height = this.max_height;
        this.run =1;
    }
    if(this.box_height <0){
        window.clearInterval(this.t);
        this.box_height = 0;
        this.node.style.display ="none";
        this.run =1;
    }
    this.node.style.height = this.box_height + "px";
}

_toggle.prototype.toggle = function(){
    var temp = this;
    if(this.run == 1){
        this.flag *= -1;
        this.run =0;
        this.t = window.setInterval(function(){temp.up_down();},10);
    }
}