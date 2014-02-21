/*
    鲁佳
    共享数据存储集合
*/
Namespace.register("Agi.Msg"); /*添加 Agi.Msg命名空间*/
Agi.Msg.ShareDataMangager = function () {
    this.AddItem = function (Data) {
        if (this.IsExistSharaData(Data.shareID)) {
            this.getItem(Data.shareID).Data = Data;
        }
        else {
            this.sharaDatas.push(Data);
        }
    }

    this.IsExistSharaData = function (shareID) {
        var state = false;
        for (var i = 0; i < this.sharaDatas.length; i++) {
            if (this.sharaDatas[i].shareID == shareID) {
                state = true; break;
            }
        }
        return state;
    }

    this.getItem = function (shareID) {
        for (var i = 0; i < this.sharaDatas.length; i++) {
            if (this.sharaDatas[i].shareID == shareID) {
                return this.sharaDatas[i];
            }
        }
    }

    this.sharaDatas = [];
}
Agi.Msg.ShareDatas = new Agi.Msg.ShareDataMangager();
