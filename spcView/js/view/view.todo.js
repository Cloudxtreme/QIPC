/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-9-4
 * Time: 下午6:00
 * To change this template use File | Settings | File Templates.
 */
Agi.view.todo.CreateNewControl = function (config,parentId) {
    if (!config) {
        return;
    }
    var target = parentId != undefined ? $('#'+parentId,'#workspace') : $('#workspace');
    InitControlToCanvas(config, target, config.Position, Agi.view.workspace.GetControlsLibs(config.ControlType), "Agi.Controls.Init" + config.ControlType, config.Entity,parentId);
};
Namespace.register('Agi.Utility');
Agi.Utility.xml2json = function (xml, tab) {
    var X = {
        toObj:function (xml) {
            var o = {};
            if (xml.nodeType == 1) {   // element node ..
                if (xml.attributes.length)   // element with attributes  ..
                    for (var i = 0; i < xml.attributes.length; i++)
                        o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0, cdataChild = 0, hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)  // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4)  // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) {  // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                }
                                else  // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        }
                        else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    }
                    else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    }
                    else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            }
            else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            }
            else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson:function (o, name, ind) {
            var json = name ? ("\"" + name + "\"") : "";
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++)
                    o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            }
            else if (o == null)
                json += (name && ":") + "null";
            else if (typeof(o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
            }
            else if (typeof(o) == "string")
                json += (name && ":") + "\"" + o.toString() + "\"";
            else
                json += (name && ":") + o.toString();
            return json;
        },
        innerXml:function (node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function (n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        }
                        else
                            s += "/>";
                    }
                    else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape:function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite:function (e) {
            e.normalize();
            for (var n = e.firstChild; n;) {
                if (n.nodeType == 3) {  // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    }
                    else
                        n = n.nextSibling;
                }
                else if (n.nodeType == 1) {  // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                }
                else                      // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}
function InitControlToCanvas(config, _TargetObj, _position, _controlLibs, _InitFun, Entity,_TargetObjID) {
    //
    var NewControl = null;
    Agi.Script.Import.LoadFileList(_controlLibs,
        function () {
            NewControl = eval(_InitFun)();
            NewControl.parentId = _TargetObjID;
            if(_TargetObjID){
                var container = Agi.Controls.FindControlByPanel(_TargetObjID);
                if(container){//建立关系
                    container.childControls.push(NewControl);
                }
            }
            /*读取脚本*/
            NewControl.setScriptCode(config.script);
            var theTarget = _TargetObj;
            if(!_TargetObj.length && _TargetObjID){
                theTarget = $('#' + _TargetObjID);
            }
            NewControl.CreateControl(config, theTarget); //初始化显示
            if(Agi.Controls.Container){
                Agi.Controls.Container.AddSubControl(NewControl);
            }
            //
            if(Agi.view.workspace.isFullAnimationPage){
                $(NewControl.Get("HTMLElement")).hide();
            }
            //
            Agi.view.workspace.controlList.add(NewControl);
            Agi.Msg.PageLoadManage.Set("PageControlLoadindex", Agi.Msg.PageLoadManage.Get("PageControlLoadindex") + 1);
            /*选项卡*/
            if (config.tabsTabid) {
                var oProprty = NewControl.Get('ProPerty');
                oProprty.tabsTabid = config.tabsTabid;
                NewControl.Set('ProPerty', oProprty);
            }
            //
            $("#tabs").tabs("select", 1).tabs("select", 0);

            //激活基本的脚本 gyh
            //NewControl.fireScriptCode('loaded');
            var html = NewControl.Get('HTMLElement');
            //设置层级
            if(config.zIndex){
                html.style.zIndex = config.zIndex;
            }
            $(html).bind('click',function(e){
                NewControl.fireScriptCode('click');
            }).bind('mouseenter',function(e){
                NewControl.fireScriptCode('mouseenter');
            });
        }
    );
}
function findControlInfo(type, data) {
    var control = $('Control[ControlType="' + type + '"]', data);
    var info = {
        _controlLibs:[],
        _InitFun:control.attr('Initialize')
    };
    control.find('Files File').each(function (i, f) {
        info._controlLibs.push($(f).attr('Path'));
    });
    return info;
}
/*加载库*/
(function () {
    //css3动画库
    var animationCSS = document.createElement("link");
    animationCSS.href = "js/view/my/animate.css";
    animationCSS.rel = "stylesheet";
    $("head").append(animationCSS);
})();