/**
* Created with JetBrains WebStorm.
* User: andy guo
* Date: 12-8-3
* Time: 下午4:08
* To change this template use File | Settings | File Templates.
*/
Namespace.register('Agi.LayoutMangement');
Agi.LayoutMangement.layoutDesigner = function (options) {
    {
        function createConfigPanel(){
            var htmlStr = "";
            htmlStr = "<div id='"+self.options.panelID+"' title='布局设计器' class='hide'>"+
                "<form id='"+self.options.designer+"' class='form-horizontal'>"+
                "</form>"+
                "<a id='"+self.options.addRowBottom+"' class='btn'>添加行</a>"+
            "</div>";
            var panel = $(htmlStr);
            rowHtmlForDesigner().appendTo(panel.find('form:first'));
            rowHtmlForDesigner().appendTo(panel.find('form:first'));
            return panel;
        }

        function singleRow (index,value) {
            this.index = index;
            this.value = value;
            this.htmlObj = null;
        }

        function rowHtmlForDesigner() {
            var str = "<div class='control-group'>"+
                "<label class='control-label' style='width: 10px;margin-right:0px;'><i class='icon-remove'></i></label>" +
                "<div class='controls' style='margin-left: 15px'>"+
                "<select class='span2'>"+
                "<option value='1'>1 Column (100)</option>"+
                "<option value='2'>2 Column (50/50)</option>"+
                "<option value='7'>2 Column (66/33)</option>"+
                "<option value='8'>2 Column (33/66)</option>"+
                "<option value='9'>2 Column (75/25)</option>"+
                "<option value='10'>2 Column (25/75)</option>"+
                "<option value='3'>3 Column (33/33/33)</option>"+
                "<option value='5'>3 Column (50/25/25)</option>"+
                "<option value='6'>3 Column (25/25/50)</option>"+
                "<option value='4'>4 Column (25/25/25/25)</option>"+
                "</select>"+
                "</div>"+
                "</div>";
            return $(str);
        }
    }

    var self = this;
    self.options = {
        panelID:"dialog",
        designer: "fDesigner",
        addRowBottom:"btnAddRow",
        canvasID: "",
        layoutChangeCallBack:function(){}
    };
    if (options) {
        for (name in options) {
            self.options[name] = options[name];
        }
    }
    self.dialogBox = null;
    self.property = {
        type:1,//布局类型
        showScale:'100%',//显示比例
        pageSize:'1366 * 768',//页面大小
        backGround:'#fff',//背景颜色
        gridLine:'10',//网络线大小

        rows:[{index:0,value:1},{index:1,value:1}]
    };
    //property
//    self.designer = $(self.options.designer);
//    self.canvasObject = $(self.options.canvasID);
//    self.addRorBtn = $(self.options.addRowBottom);
    self.rows = [];

    //method
    this.addRow = function () {
        //
        var nRow = rowHtmlForDesigner();
        self.designer.append(nRow);
        self.rows.push(new singleRow(nRow.index(),1));
        //

        var row = self.createRowForCanvas({index:nRow.index(),value:'1'});
        self.canvasObject.append(row);

        self.updateCellHeight();
        self.options.layoutChangeCallBack.call(self);
    }



    this.removeRow = function (index) {
        self.rows.splice(index,1);
    }
    this.updateRow = function (index,value){
        self.rows[index].value = value;

        //
        var row = self.createRowForCanvas({index:index,value:value});
        var a = $(self.canvasObject.children()[index]);
        a.html(row.html());
    }

    this.createRowForCanvas = function(Row){
        var rowId = 'row-' + Agi.Script.CreateControlGUID();
        var row = $("<div id='"+rowId+"' class='row-fluid'></div>");

        var cells = [];
        switch(Row.value){
            case "1":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span12 cell' data-allowDrop='true'></div>)") );
                break;
            case "2":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span6 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span6 cell' data-allowDrop='true'></div>)") );
                break;
            case "7":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span8 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span4 cell' data-allowDrop='true'></div>)") );
                break;
            case "8":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span4 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span8 cell' data-allowDrop='true'></div>)") );
                break;
            case "9":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span9 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                break;
            case "10":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span9 cell' data-allowDrop='true'></div>)") );
                break;
            case "3":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span4 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span4 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span4 cell' data-allowDrop='true'></div>)") );
                break;
            case "5":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span6 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                break;
            case "6":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span6 cell' data-allowDrop='true'></div>)") );
                break;
            case "4":
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                cells.push( $("<div id='cell-"+Agi.Script.CreateControlGUID()+"' class='span3 cell' data-allowDrop='true'></div>)") );
                break;
        }
        $(cells).each(function(i,c){
            row.append(c);
        });
        return (row);
    }
    this.updateCellHeight = function(){
        if(self.rows.length){
            var parentHeight = self.canvasObject.height();
            var h = parentHeight / self.rows.length;
            self.canvasObject.find('.row-fluid').height(h-5);
        }
    }

    //initial
    {
        //创建配置面板
        createConfigPanel().appendTo($('body:first'));
        self.designer = $('#'+self.options.designer);
        self.canvasObject = $('#'+self.options.canvasID);
        self.addRowBtn = $('#'+self.options.addRowBottom);


        self.addRowBtn.unbind();
        self.addRowBtn.bind('click',function(e){

            self.addRow();
//            self.rows.length=0;
//            self.designer.find(".control-group .controls select").each(function(i,obj){
//                self.rows.push({})
//            });
        });

        //hide first row
        self.designer.find(".control-group:first-child").find('label:eq(0)').hide();
        //bind click event to remove row bottom
        self.designer.find(".control-group label i").live('click',function(e){
            var row = $(this).parent().parent();
            var index = row.index();
            row.remove();
            self.removeRow(index);

            //
            //self.canvasObject.get(index).remove();
            $(self.canvasObject.children()[index]).remove();
            self.updateCellHeight();
            self.options.layoutChangeCallBack.call(self);
        });
        //bind change event to every select control
        self.designer.find(".control-group .controls select").live('change',function(e){
            //alert('change :'+self.rows.length);
            var rowIndex = $(this).parent().parent().index();
            var sel = $(this);
            self.rows[rowIndex].value = sel.val();

            self.updateRow(rowIndex,sel.val());
            self.options.layoutChangeCallBack.call(self);
        });

        //self.designer.empty();
//        self.rows = [];
//        self.designer.find(".control-group").each(function(i,row){
//            var index = $(row).index();
//            var value = $(row).find('select').val();
//            self.rows.push(new singleRow(index,value));
//        });
//
//        self.canvasObject.empty();
//
//        $(self.rows).each(function(i,r){
//            var row = self.createRowForCanvas(r);
//            self.canvasObject.append(row);
//        });
//        self.updateCellHeight();

        self.dialogBox = $('#'+self.options.panelID).dialog({
            width: 230,
            height: 320,
            resizable: false,
            position:[0,170],
            autoOpen: false
        });
        self.dialogBox.parent().attr('id','layoutManagement_'+ self.options.panelID);
    }//end inital

    //切换布局类型
    self.switch = function(type,controlArray){
        if(type=='2'){
            self.dialogBox.dialog('open');
        }
        if(self.property.type==type){
            return;
        }
        if(type=='1'){
            self.property.type = 1;
            self.canvasObject.empty();
            self.dialogBox.dialog('close');
        }else if (type=='2'){
            self.property.type = 2;

            self.rows = [];
            self.designer.find(".control-group").each(function(i,row){
                var index = $(row).index();
                var value = $(row).find('select').val();
                self.rows.push(new singleRow(index,value));
            });

            self.canvasObject.empty();

            $(self.rows).each(function(i,r){
                var row = self.createRowForCanvas(r);
                self.canvasObject.append(row);
            });
            self.updateCellHeight();

            self.dialogBox.dialog('open');
        }//end type 2
        return true;
    }

    //得到所有格子
    self.getCells = function(rowIndex,cellIndex){
        if(rowIndex>=0 && cellIndex>=0){
            if(self.property.type==2){
                return self.canvasObject.find('.row-fluid:eq('+rowIndex+')').find('div[class*=span]:eq('+cellIndex+')');
            }
        }else{
            return self.canvasObject.find('.row-fluid>div[class*=span]');
        }
    }

    //得到 配置
    self.getConfig = function(){
        self.property.rows = [];
        $(self.rows).each(function(i,r){
            self.property.rows.push({index:r.index,value:r.value.toString()});
        });
        var jsStr = JSON.stringify(self.property);
        return jsStr;
    }


    //初始化配置
    self.initialConfig = function(jsonStr){
        if(!jsonStr){
            return false;
        }
        if(typeof(jsonStr)==="string"){
            self.property = JSON.parse(jsonStr);
        }else{
            self.property=jsonStr;
        }

        if(self.property.type==2){
            self.rows = [];
            $(self.property.rows).each(function(i,r){
                self.rows.push({index:r.index,value:r.value});
            });
            self.canvasObject.empty();

            $(self.rows).each(function(i,r){
                var row = self.createRowForCanvas(r);
                self.canvasObject.append(row);
            });
            self.updateCellHeight();

            //这里还要还原一下设计器
            self.designer.empty();
            $(self.property.rows).each(function(i,r){
                var controlGroup = $('<div class="control-group"><label class="control-label" style="width: 10px"><i class="icon-remove"></i></label><div class="controls" style="margin-left: 15px"><select class="span2"><option value="1">1 Column (100)</option><option value="2">2 Column (50/50)</option><option value="7">2 Column (66/33)</option><option value="8">2 Column (33/66)</option><option value="9">2 Column (75/25)</option><option value="10">2 Column (25/75)</option><option value="3">3 Column (33/33/33)</option><option value="5">3 Column (50/25/25)</option><option value="6">3 Column (25/25/50)</option><option value="4">4 Column (25/25/25/25)</option></select></div></div>');
                controlGroup.find('select').val(r.value);
                controlGroup.appendTo(self.designer);
            });
        }else{
            //self.canvasObject
        }
        return;
    }

    //返回默认配置
    self.revertConfig = function(){
        self.property.type = 1;//布局类型
        self.property.showScale = '100%';//显示比例
        self.property.pageSize = '1366 * 768';//页面大小
        self.property.backGround = '#fff';//背景颜色
        self.property.gridLine = '10';//网络线大小

        self.property.rows = [{index:0,value:1},{index:1,value:1}];

        self.switch(self.property.type);
    }
};
