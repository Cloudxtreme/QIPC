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
        $("#PageParam").draggable();
        $("#PageParam").modal({ backdrop: false, keyboard: false, show: true });
        $('#urlParaItems').empty();
        for (var i = 0; i < this.Paras.length; i++) {
            $('#urlParaItems').append(new Option(this.Paras[i], this.Paras[i], true, true));
        }
    }

    //添加item
    $("#urlAdd").live('click', function () {
        if ($("#urlText").val() != "") {
            $('#urlParaItems').append(new Option($("#urlText").val(), $("#urlText").val(), true, true));

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
            alert("请输入参数名称");
        }
    });

    //删除item
    $("#deleteUrl").live('click', function () {
        if (confirm("确定删除吗？")) {
            Agi.Msg.PageOutPramats.RemoveUrlItems("Url参数", $('#urlParaItems option:selected')[0].innerText);
            Agi.Msg.UrlManageInfo.DeleteItems($('#urlParaItems option:selected')[0].innerText);
            $('#urlParaItems option:selected').remove();
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
                if(this.Paras[i]){
                    this.value.push({ Name: this.Paras[i], Value: decodeURI(this.getParameter(this.Paras[i])) });
                }
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
            if(this.Paras[i]){
                str += this.Paras[i] + ",";
            }
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