var ShareDataFilter = {
    //列信息的拼接字符串
    ColumnStr: "",
    //当前选中的控件的ID
    CurrControlID: "",
    //当前选中的共享数据源的ID
    ShareID: "",
    //加载共享数据源过滤左侧列表
    PShareDataFilterLeftList: function () {
        var str = "";
        var idArray = [];
        var AllShareDataRelation = Agi.Msg.ShareDataRelation.ShareRelation;
        for (var i = 0; i < AllShareDataRelation.length; i++) {
            for (var j = 0; j < AllShareDataRelation[i].controlID.length; j++) {
                var id = Agi.Script.CreateControlGUID();
                var lid = Agi.Script.CreateControlGUID();
                str += "<dl style='width:100%'>" +
                "<dt class=" + id + " title=" + AllShareDataRelation[i].controlID[j] + " onclick=EntityControlTemplate_Showsubmenu1(this)>" + AllShareDataRelation[i].controlID[j] +
                "<dd id=" + id + " >" +
                "<ul><LI id=" + lid + " title=" + AllShareDataRelation[i].shareID + "  onclick=ShareDataFilterLiClick(this)  divid=" + AllShareDataRelation[i].controlID[j] + "." + AllShareDataRelation[i].shareID + ">" + AllShareDataRelation[i].shareID +
                 "</LI></ul></dd></dl>";

                if (j == 0) {
                    var obj = $("<LI id=" + lid + "  onclick=ShareDataFilterLiClick(this)  divid=" + AllShareDataRelation[i].controlID[j] + "." + AllShareDataRelation[i].shareID + ">" + AllShareDataRelation[i].shareID + "</LI>");
                    ShareDataFilterLiClick(obj);
                }
                idArray.push(lid);
            }
        }

        if (str == "")
        { str = "无参数" }

        $("#app_ControlShareDataParamDiv").html("");
        $("#app_ControlShareDataParamDiv").html(str);
        $("#PShareFilterTable tbody").html("");
    },
    //加载共享数据源过滤右侧列表
    PShareDataFilterRightMenu: function (obj) {
        var ControlAndShare = $(obj).attr('divid');
        var CurrShareName = ControlAndShare.substr(ControlAndShare.indexOf('.') + 1)
        this.ShareID = "";
        this.ShareID = CurrShareName;
        this.CurrControlID = "";
        this.CurrControlID = ControlAndShare.substr(0, ControlAndShare.indexOf('.'));
        var AllShareInfo = Agi.Msg.ShareDataRealTimeBindPara.PageAllShareDataRelation;
        var CurrShareToDataset;
        //获取到共享数据源相对应的dataset名称，以找到列信息
        for (var i = 0; i < AllShareInfo.length; i++) {
            if (CurrShareName.trim() == AllShareInfo[i].ShareDataName) {
                CurrShareToDataset = AllShareInfo[i].DatasetName;
            }
        }

        //访问webservice获取所有的列信息
        Agi.DatasetsManager.DSSGetDatasetByID(CurrShareToDataset, function (result) {
            if (result.result == "true") {
                var AllColumns = result.Data.DataSets.DataSet.Columns.DataColumns.DataColumn;
                ShareDataFilter.ColumnStr = "";
                //获取到列信息之后拼接成字符串
                for (var i = 0; i < AllColumns.length; i++) {
                    ShareDataFilter.ColumnStr += "<option value=" + AllColumns[i].ID + ">" + AllColumns[i].ID + "</option>";
                }
                //判断当前控件是否已经配置了过滤关系，如果有则显示配好的关系，如果没有就新添一行
                if (Agi.Msg.ShareDataFilterRelation.Isexistitems(ShareDataFilter.CurrControlID)) {
                    var FilterObj = Agi.Msg.ShareDataFilterRelation.FindFilterByControlID(ShareDataFilter.CurrControlID);
                    ShareDataFilter.ReloadFilterRelation(FilterObj, ShareDataFilter.ColumnStr);
                } else {
                    //默认添加一行
                    $("#PShareFilterTable tbody").html("");
                    var table = $("#PShareFilterTable tbody").append(ShareDataFilter.AddAFilterRow(ShareDataFilter.ColumnStr));
                }
                //添加控件事件
                ShareDataFilter.AddRightMenu();
            }
        });

    },
    //右侧列表添加一行
    AddAFilterRow: function (str) {
        var FilterRow = "";
        FilterRow += " <tr>" +
                                 "<td><select class='PShareColumns'>" + str + "</select></td>" +
                                 "<td><select class='PShareStr'><option value=''></option><option value='>'>></option><option value='>='>>=</option><option value='=='>=</option><option value='!='>!=</option><option value='<'><</option><option value='<='><=</option></select></td>" +
                                 "<td><input type='checkbox' class='PScheckvalue' style=' width:15%; float:left;'/><span style=' width:10%; float:left; text-align:center;vertical-align: middle;margin-right: 4px;margin-top: 5px;'>列</span><input type='text' class='PShareValueText' style='width:60%;float:left;' /><select class='PShareCompareColumn' style='width:60%;display:none; float:left;'>" + str + "</select></td>" +
                                 "<td><select class='PShareLogicStr'><option></option><option value=' && '>并且</option><option value=' || '>或者</option></select></td>" +
                                 "<td><input type='button' value='删除' id='DelSP'/></td></tr>";
        return FilterRow;

        //<input type='button' style='width:40%;' value='添加' class='AddSP'/>
    },
    //添加控件值改变事件
    AddRightMenu: function () {
        //绑定数据逻辑

        //添加删除事件
        $("#DelSP").live('click', function () {
            var CurrRow = this.parentElement.parentElement;
            var root = CurrRow.parentNode;
            if (root != null) {
                $(CurrRow.previousElementSibling).find(".PShareLogicStr").val(""); //20121226 12:00 共享数据源过滤规则删除行清空上一行的逻辑选择值
                root.removeChild(CurrRow);
            }
            ShareDataFilter.AddRightMenu();
        });

        //新增一行
        //        $(".AddSP").live('click', function () {
        //            $("#PShareFilterTable tbody").append(ShareDataFilter.AddAFilterRow(ShareDataFilter.ColumnStr));
        //            ShareDataFilter.AddRightMenu();
        //        });
        //如果有选逻辑，则添加一行
        $(".PShareLogicStr").live('change', function () {
            var CurrRow = this.parentElement.parentElement;
            if ($(CurrRow).find(".PShareLogicStr").first().val() != "") {
                if (CurrRow.nextElementSibling == null) {
                    $("#PShareFilterTable tbody").append(ShareDataFilter.AddAFilterRow(ShareDataFilter.ColumnStr));
                    ShareDataFilter.AddRightMenu();
                }
            }
        });

        //点击单选款判断是显示列还是值
        $(".PScheckvalue").live('click', function () {
            var CurrRow = this.parentElement.parentElement;
            if ($(this).attr('checked') == 'checked') {
                $(CurrRow).find('.PShareValueText').css('display', 'none');
                $(CurrRow).find('.PShareCompareColumn').css('display', 'block');
            } else {
                $(CurrRow).find('.PShareValueText').css('display', 'block');
                $(CurrRow).find('.PShareCompareColumn').css('display', 'none');
            }
        });


    },
    //重新加载保存好的过滤关系
    ReloadFilterRelation: function (FilterObj, str) {
        var FilterRows = "";
        $("#PShareFilterTable tbody").html("");
        var FilterColumns = FilterObj.uiExpression;
        //有几条规则就先加几行
        for (var i = 0; i < FilterColumns.length; i++) {
            FilterRows += ShareDataFilter.AddAFilterRow(str);
        }
        $("#PShareFilterTable tbody").append(FilterRows);

        //每一行分别绑定数据
        var AllTableTr = $('#PShareFilterTable tbody').find('tr');
        for (var i = 0; i < FilterColumns.length; i++) {
            $($(AllTableTr[i]).find('td')[0]).find('.PShareColumns').val(FilterColumns[i].columnName);
            $($(AllTableTr[i]).find('td')[1]).find('.PShareStr').val(FilterColumns[i].operator);
            if (FilterColumns[i].value.indexOf("'") >= 0) {
                $($(AllTableTr[i]).find('td')[2]).find('.PShareValueText').css('display', 'inline-block');
                $($(AllTableTr[i]).find('td')[2]).find('.PShareCompareColumn').css('display', 'none');
                $($(AllTableTr[i]).find('td')[2]).find('.PShareValueText').val(FilterColumns[i].value.substr(1, FilterColumns[i].value.length - 2));
            }
            else {
                $($(AllTableTr[i]).find('td')[2]).find('.PShareValueText').css('display', 'none');
                $($(AllTableTr[i]).find('td')[2]).find('.PShareCompareColumn').css('display', 'inline-block');
                $($(AllTableTr[i]).find('td')[2]).find('.PScheckvalue').attr('checked', true);
                $($(AllTableTr[i]).find('td')[2]).find('.PShareCompareColumn').val(FilterColumns[i].value);
            }

            $($(AllTableTr[i]).find('td')[3]).find('.PShareLogicStr').val(FilterColumns[i].logic);
        }
    },
    //退出页面清除关系数组
    LeaveClear: function () {
        Agi.Msg.ShareDataFilterRelation.FilterRelation = [];
    }
}

//共享数据源的点击事件
function ShareDataFilterLiClick(obj) {
    ShareDataFilter.PShareDataFilterRightMenu(obj);
}

//保存按钮
$("#ShareDataFilterSave").live('click', function () {
    var CurrShareFilter = [];
    var calculateExpression = "";
    var AllTableTr = $('#PShareFilterTable tbody').find('tr');
    //如果有过滤规则行则保存，没有则不进行操作
    if (AllTableTr.length > 0) {
    //获取所有的行，每一行单独取值
        for (var i = 0; i < AllTableTr.length; i++) {
            var columnName = $($(AllTableTr[i]).find('td')[0]).find('.PShareColumns').val();
            var operator = $($(AllTableTr[i]).find('td')[1]).find('.PShareStr').val();
            var value, valuepin;
            if ($($(AllTableTr[i]).find('td')[2]).find('.PShareValueText').css('display') == "inline-block" || $($(AllTableTr[i]).find('td')[2]).find('.PShareValueText').css('display') == "block") {
                value = "'" + $($(AllTableTr[i]).find('td')[2]).find('.PShareValueText').val() + "'";
                valuepin = value;
            }
            else {
                value = $($(AllTableTr[i]).find('td')[2]).find('.PShareCompareColumn').val();
                valuepin = "data[i]." + value;
            }
            var logic = $($(AllTableTr[i]).find('td')[3]).find('.PShareLogicStr').val();

            if ((columnName == "" || operator == "" || value == "") || (i == AllTableTr.length - 1 && logic != "")) {
                AgiCommonDialogBox.Alert("请将过滤规则填写正确！");
                return false;
            }

            calculateExpression += "data[i]." + columnName + operator + valuepin + logic;
            CurrShareFilter.push({
                columnName: columnName,
                operator: operator,
                value: value,
                logic: logic
            });
        }

        //存储到保存过滤关系的全局数组
        Agi.Msg.ShareDataFilterRelation.SaveShareFilter(ShareDataFilter.CurrControlID, CurrShareFilter, calculateExpression);
        var obj = { "shareID": ShareDataFilter.ShareID, "controlID": ShareDataFilter.CurrControlID };
        //调用联动方法，与控件参数联动
        Agi.Msg.TriggerManage.ShareDataFilterSetting(obj);
        //20130125 倪飘 共享数据源过滤规则保存提示
        AgiCommonDialogBox.Alert("保存成功！",null);
    }
    //20121226 12:00 倪飘 共享数据源过滤规则都删除后删除过滤关系数组里面的关系
    else{
        Agi.Msg.ShareDataFilterRelation.DeleteItems(ShareDataFilter.CurrControlID);
        //20130220 倪飘 解决共享数据源过滤保存过滤规则以后，删除过滤规则，控件中无法立刻应用问题
        var obj = { "shareID": ShareDataFilter.ShareID, "controlID": ShareDataFilter.CurrControlID };
        //调用联动方法，与控件参数联动
        Agi.Msg.TriggerManage.ShareDataFilterSetting(obj);
        //20130125 倪飘 共享数据源过滤规则保存提示
        AgiCommonDialogBox.Alert("保存成功！", null);
    }
});