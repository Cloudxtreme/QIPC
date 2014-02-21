/*
    编写人：鲁佳
    编写时间：2012-09-01
    描述：获取URL参数值
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.UrlManage = function () {
    this.getParameter = function (param) {
        var query = window.location.search;
        var iLen = param.length;
        var iStart = query.indexOf(param);
        if (iStart == -1)
            return "";
        iStart += iLen + 1;
        var iEnd = query.indexOf("&", iStart);
        if (iEnd == -1)
            return query.substring(iStart);
        return decodeURI(query.substring(iStart, iEnd));
    }
    //test: var temp = getParameter("aa");

    this.Show = function () {
//        $("#PageParam").draggable();
//        $("#PageParam").modal({ backdrop: false, keyboard: false, show: true });
//        $('#PageParam').css('zIndex', 9999);
        if(!dialogs._pageParamConfig.dialog('isOpen')){
            dialogs._pageParamConfig.dialog('open');
        }
        $('#urlParaItems').empty();
        for (var i = 0; i < this.Paras.length; i++) {
            $('#urlParaItems').append(new Option(this.Paras[i], this.Paras[i], true, true));
        }
        //20130126 倪飘 清空输入文本框
        $('#urlText').val("");
    }

    //添加item
    $("#urlAdd").live('click', function () {
        var StrUrlItem=Agi.Script.StringTrim($("#urlText").val());//去前后空格处理
        if (StrUrlItem != "") {
            $('#urlParaItems').append(new Option(StrUrlItem, StrUrlItem, true, true));

            //应用
            Agi.Msg.UrlManageInfo.Clear();
            var inform = document.getElementById("urlParaItems");

            var option = new Array();
            for (var i = 0; i < inform.options.length; i++) {
                texts = inform.options[i].text//内容值 
                option.push(texts);
            }
            Agi.Msg.UrlManageInfo.AddUrlName(option);

            var value = [];
            for (var i = 0; i < Agi.Msg.UrlManageInfo.Paras.length; i++) {
                value.push({ Name: Agi.Msg.UrlManageInfo.Paras[i], Value: "" });
            }
            Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Url, 'Key': 'Url参数', 'ChangeValue': value });
            $("#urlText").val("");
        }
        else {
            AgiCommonDialogBox.Alert("请输入参数名称", null);
        }
    });

    //删除item
    $("#deleteUrl").live('click', function () {
        //20130115 倪飘 解决页面参数配置中，在添加参数以后点击："删除"按钮，在第二次点击的时候无选中项但是弹出提示框："确定要删除吗"，预期：第一次进行删除操作以后自动选中下一个参数或弹出提示框："未选择需要删除的参数"问题
        if ($('#urlParaItems option:selected')[0] != undefined) {
            if ($('#urlParaItems option:selected')[0].innerText != "") {
                var content = "确定删除吗？";
                AgiCommonDialogBox.Confirm(content, null, function (flag) {
                    if (flag) {
                        Agi.Msg.PageOutPramats.RemoveUrlItems("Url参数", $('#urlParaItems option:selected')[0].innerText);
                        Agi.Msg.UrlManageInfo.DeleteItems($('#urlParaItems option:selected')[0].innerText);
                        $('#urlParaItems option:selected').remove();
                    }
                });
            }
            else {
                AgiCommonDialogBox.Alert("未选择需要删除的参数!");
            }
        } else {
            AgiCommonDialogBox.Alert("未选择需要删除的参数!");
        }

    });

    //删除Item
    this.DeleteItems = function (itemName) {
        for (var i = 0; i < this.Paras.length; i++) {
            if (this.Paras[i] == itemName) {
                this.Paras.splice(i, 1);
                break;
            }
        }
    }

    //读取url参数
    this.ReadUrlParas = function (strArray) {
        if (strArray != null) {
            this.Paras = strArray.split(',');
            this.value = [];
            for (var i = 0; i < this.Paras.length; i++) {
                this.value.push({ Name: this.Paras[i], Value: decodeURI(this.getParameter(this.Paras[i])) });
            }
            Agi.Msg.PageOutPramats.AddPramats({ 'Type': Agi.Msg.Enum.Url, 'Key': 'Url参数', 'ChangeValue': this.value });

            //事件触发
            Agi.Msg.TriggerManage.ParaChangeEvent({ "sender": "Url参数", "Type": Agi.Msg.Enum.Url });
        }
    }

    //保存url参数
    this.SaveUrlParas = function () {
        return this.toString();
    }


    //["name","ID","begintime"]  
    this.AddUrlName = function (jsonObj) {
        if (jsonObj != null || jsonObj != "") {
            for (var i = 0; i < jsonObj.length; i++) {
                this.Paras.push(jsonObj[i]);
            }
        }
    }

    this.toString = function () {
        var str = "";
        for (var i = 0; i < this.Paras.length; i++) {
            str += this.Paras[i] + ",";
        }
        if (str.length > 0) {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }
    this.Paras = [];

    this.Clear = function () {
        this.Paras = [];
    }
}

Agi.Msg.UrlManageInfo = new Agi.Msg.UrlManage();
//Agi.Msg.UrlManageInfo.AddUrlName(["name","max","min"]);