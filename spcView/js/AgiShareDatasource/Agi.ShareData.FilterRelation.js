Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ShareDataFilterRelation = function () {
    this.SaveShareFilter = function (controlID, uiExpression, calculateExpression) {
        if (this.Isexistitems(controlID)) {
            for (var i = 0; i < this.FilterRelation.length; i++) {
                if (this.FilterRelation[i].controlID == controlID) {
                    this.FilterRelation[i].uiExpression = uiExpression;
                    this.FilterRelation[i].calculateExpression = calculateExpression;
                }
            }
        }
        else {
            this.FilterRelation.push({
                controlID: controlID,
                uiExpression: uiExpression,
                calculateExpression: calculateExpression
            });
        }
    }

    this.Isexistitems = function (controlID) {
        var IsExist = false;
        for (var i = 0; i < this.FilterRelation.length; i++) {
            if (this.FilterRelation[i].controlID == controlID) {
                IsExist = true;
            }
        }
        return IsExist;
    }

    //add by lj
    this.getItem = function (controlID) {
        var returnvalue = { "state": false, "item": null };
        for (var i = 0; i < this.FilterRelation.length; i++) {
            if (this.FilterRelation[i].controlID == controlID) {
                returnvalue.state = true;
                returnvalue.item = this.FilterRelation[i];
                break;
            }
        }
        return returnvalue;
    }

    this.FindFilterByControlID = function (controlID) {
        for (var i = 0; i < this.FilterRelation.length; i++) {
            if (this.FilterRelation[i].controlID == controlID) {
                return this.FilterRelation[i];
            }
        }
    }

    this.SaveAllShareToString = function () {
        var ShareString = $.toJSON(this.FilterRelation);
        //        this.PageAllShareDataRelation = [];
        //        this.ParasRelation = [];
        return ShareString;
    }

    //将获取到的字符串转成数组显示
    this.GetShareStringToArray = function (ShareString) {
        if (ShareString != undefined && ShareString != "" && ShareString != []) {
            this.FilterRelation = $.evalJSON(ShareString);
        }
    }


    this.FilterRelation = [];
}

Agi.Msg.ShareDataFilterRelation = new Agi.Msg.ShareDataFilterRelation();