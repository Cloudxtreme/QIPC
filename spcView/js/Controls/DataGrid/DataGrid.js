/**
 * Created with JetBrains WebStorm.
 * User: yanhua guo
 * Date: 12-8-17
 * Time: 上午9:15
 * To change this template use File | Settings | File Templates.
 * * datagrid 控件,关系数据的展示
 */
Namespace.register("Agi.Controls");
/*添加 Agi.Controls命名空间*/
Agi.Controls.DataGrid = Agi.OOP.Class.Create(Agi.Controls.ControlBasic,
    {
        //日期格式验证
        DateValidate: function (value) {
            var result = false;
            if (typeof value !== 'string') {
                return result;
            }
            if (value && value !== '') {
                var dateArray = value.split(' ');
                if (dateArray.length > 1) {
                    var date = dateArray[0];
                    var reDate = /\d{4}-\d{2}-\d{2}/;
                    result = reDate.test(date);
                }
            }
            return result;
        },
        //清除滚动条下最后一行多余的空白
        ClearBlank: function () {
            var self = this;
            if (self.wijgridDefaultConfig.scrollMode !== 'none') {
                var $table = $('#' + self.shell.BasicID);
                var row = $table.find('tbody tr:last');
                if (!row.is(":hidden")) {
                    row.css('display', 'none');
                    self.shell.Container.find('div.wijmo-wijgrid').css('background', 'rgba(0,0,0,0)');
                    $table.wijgrid('setSize', self.shell.Container.width(), self.shell.Container.height());
                }
            }
        },
        //滚动条模式下,隐藏头部的方法
        SwitchHead: function (flag) {
            var self = this;
            if (self.wijgridDefaultConfig.scrollMode !== 'none' && !flag) {
                var head = self.shell.Container.find('thead').parent().parent();
                var headHeigth = head.height();
                head.hide();
                var containerWidth = self.shell.Container.width();
                var containerheight = self.shell.Container.height();
                //                $('#' + self.shell.BasicID).wijgrid('setSize', containerWidth, containerheight - headHeigth);
                //20130327 倪飘 修改武汉bug489 grid控件中设置滚动条以后，反复选择显示头部"是"与"否"，左侧控件会向上缩起来
                $('#' + self.shell.BasicID).wijgrid('setSize', containerWidth, containerheight);
            } else if (self.wijgridDefaultConfig.scrollMode !== 'none' && flag) {
                var head = self.shell.Container.find('thead').parent().parent();
                var isVisible = head.is(':visible');
                var headHeigth = head.height();
                head.show();
                var containerWidth = self.shell.Container.width();
                var containerheight = self.shell.Container.height();
                $('#' + self.shell.BasicID).wijgrid('setSize', containerWidth, containerheight + (isVisible ? 0 : headHeigth));
            }
        },
        ReBindRelationData: function () {
            this.Set('Entity', this.Get('Entity'));
        },
        GetEntityData: function () {//获得实体数据
            var entity = this.Get('Entity')[0];
            if (entity != undefined && entity != null) {
                return entity.Data;
            } else {
                return null;
            }
        },
        SetEntityData:function(data){//设置实体数据
            var entity = this.Get('Entity')[0];
            if (entity != undefined && entity != null) {
                entity.Data=data;
            }
        },
        //测试高亮
        highLight: function (text) {
            var self = this;
            var table = $('#' + self.shell.ID + ' table:eq(0)');
            table.find('tbody>tr div').removeClass('gridTdHighligh');
            table.find('tbody>tr>td>div:contains("' + text + '")').parent().parent().find('div').addClass('gridTdHighligh');
        },
        //高亮指定列 isClear为false 时表示不高亮(不填为true)
        //这个方法会保留之前高亮的列
        highLightColumn: function (iColIndex, isClear) {

            var self = this;
            var tempBool = (isClear == undefined) ? true : isClear;
            var table = $('#' + self.shell.ID + ' table:eq(0)');

            if (iColIndex < 0) {
                table.find('tbody>tr div').removeClass('gridTdHighligh');
                return;
            }

            table.find('tbody>tr').each(function (i, tr) {

                if (tempBool) {
                    $(tr).find('>td:eq(' + iColIndex + ') >div').addClass('gridTdHighligh');
                } else {
                    $(tr).find('>td:eq(' + iColIndex + ') >div').removeClass('gridTdHighligh');
                }

            });
        },
        //高亮指定列
        // 其它的列将清除高亮
        highLightColumn1: function (iColIndex) {

            var self = this;
            var table = $('#' + self.shell.ID + ' table:eq(0)');

            table.find('tbody>tr div').removeClass('gridTdHighligh');

            if (iColIndex < 0) {
                return;
            }

            table.find('tbody>tr').each(function (i, tr) {
                $(tr).find('>td:eq(' + iColIndex + ') >div').addClass('gridTdHighligh');
            });
        },

        //高亮SPC相关的样本数据
        // dataPointIndex  为chart上的点索引(0开始), 当传入 '-1' 时清空所有高亮
        // nRow 为chart控件的nRow属性,由于每个控件的不同,都要实现 getSpcNrow 方法
        // bIsHigh : 指定的数据是否高亮, 不填写 为 true
        highLightSpcData: function (dataPointIndex, nRow, bIsHigh) {
            var sRow = -1, eRow = -1,
                isHighLight = bIsHigh == undefined ? true : bIsHigh;
            eRow = (dataPointIndex + 1) * nRow;
            sRow = eRow - nRow;

            var self = this;
            var table = $('#' + self.shell.ID + ' table:eq(0)');

            if (dataPointIndex < 0) {
                table.find('tbody>tr>td>div').removeClass('gridTdHighligh');
                return;
            }

            for (var iRowIndex = sRow; iRowIndex < eRow; iRowIndex++) {
                if (isHighLight) {
                    table.find('tbody>tr:eq(' + iRowIndex + ')>td>div').addClass('gridTdHighligh');
                } else {
                    table.find('tbody>tr:eq(' + iRowIndex + ')>td>div').removeClass('gridTdHighligh');
                }
            }
        },

        Render: function (_Target) {
            var self = this;
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            this.shell.Container.appendTo(obj);

            this.wijgridDefaultConfig = {
                customShellWidth: 700,
                customShellHeight: 300,
                //自定义的属性1
                customIntervalRowColor: '#000', //间隔行字体色
                customInvervalRowBgColor: '#e3e3e3', //间隔行背景色
                customFreezeColCount: 0, //冻结列个数
                customRowColor: '#000', //行字体色
                customFontSize: 12, //字体大小
                customRowBgColor: '#fff', //行背景色
                customTableLineModel: '', // 表格线显示
                customHlineColor: '#AAA', //水平线颜色
                customRowHeight: 22, //行高度

                customTheme: '', //主题
                customBackgroundColor: '#fff', //背景色
                customHeaderShowModel: 'true', //显示头部
                customHeaderColor: '#000', //标题颜色
                customHeaderBgColor: undefined, //标题背景
                customVlineColor: '#AAA', //垂直线颜色
                customTextAlign: 'center', //数据文本位置

                customAutoColumnWidth: true, //自动列宽
                colsConfig: [],

                spc: false,
                //wijgrid 的属性
                ensureColumnsPxWidth: false,
                showFilter: false,
                allowSorting: true,
                allowPaging: true,
                pageSize: 5,
                totalRows: -1,
                data: [
                    ["ANATR", "Ana Trujillo Emparedados y helados", "Ana Trujillo"],
                    ["ANTON", "Antonio Moreno Taqueria", "Antonio Moreno"],
                    ["AROUT", "Around the Horn", "Thomas Hardy"],
                    ["AROUT", "Around the Horn", "Thomas Hardy"],
                    ["AROUT", "Around the Horn", "Thomas Hardy"]
                ],
                columns: [
                    { headerText: "ID" },
                    { headerText: "Company" },
                    { headerText: "Name" }
                ],
                loadingText: "Loading...",
                scrollMode: "none",
                //事件回调
                loaded: function (e, arg) {

                    var $table = $('#' + self.shell.BasicID);
                    if (self.wijgridDefaultConfig.scrollMode === 'none') {
                        $('#' + self.shell.ID).css('height', 'auto')
                            .find('table').css('width', '100%');
                    } else {
                        $table.wijgrid('setSize', self.wijgridDefaultConfig.customShellWidth,
                            self.wijgridDefaultConfig.customShellHeight);
                    }

                    self.ChangeTheme(self.Get('ThemeInfo'));

                    self.ApplyProperty({
                        applyControlProperty: false
                    });

                    self.ApplyAlarmRule();
                    if (self.IsEditState) {
                        //$('#' + self.shell.BasicID).wijgrid('setSize', self.shell.Container.width(), self.shell.Container.height());
                    }

                    var w = self.shell.Container.width();
                    var h = self.shell.Container.height();
                    if (self.wijgridDefaultConfig.scrollMode !== 'none') {
                        if (!self.IsEditState) {
                            $table.wijgrid('setSize', w, h);
                        }
                        //去掉最后一行
                        //$table.find('tbody tr').last().css('display', 'none');
                        //清除空白
                        //self.shell.Container.find('div.wijmo-wijgrid').css('background','rgba(0,0,0,0)');
                        self.ClearBlank();
                    }
                    //已经在样式表里隐藏了下面两个元素
                    //self.shell.Container.find('div.wijmo-wijgrid-frozener-v,div.wijmo-wijgrid-frozener-h').remove();
                    self.fireScriptCode('loaded');

                    self.ReBindEvents();

                    //设定max-height 防止高度超出,影响到下方的操作
                    if (Agi.Controls.IsControlEdit) {
                        self.shell.Container.find('div.wijmo-wijgrid').css('max-height', self.shell.Container.parent().height() + 'px');
                    } else {
                        self.shell.Container.find('div.wijmo-wijgrid').css('max-height', '');
                    }
                }, //end loaded
                selectionChanged: function (e, arg) {
//                    if (arg.removedCells.length() > 0) {
//                        var rowdata = arg.addedCells.item(0).row().data;
//                        if (self.isBindData && rowdata) {
//                            self.Set('OutPramats', rowdata);
//                        }
//                    }
                    arg.addedCells.item(0).container().parent().parent().find('>td').removeClass('ui-state-highlight');
                },
                pageIndexChanged: function (e, args) {
                    //获取当前页
                    var pageIndex = args.newPageIndex;
                    var entity = self.Get('Entity');
                    if (entity != null) {
                        Agi.Controls.DataGridAttributeChange(self, "Entity", pageIndex);
                    }
                }
            };

            $("#" + this.shell.BasicID).wijgrid(this.wijgridDefaultConfig);

            //缩小的最小宽高设置
            //            this.shell.Container.resizable({
            //                minHeight: this.shell.Container.height(),
            //                minWidth: 200
            //            });
            self.fixResize();
            if (Agi.Edit) {
                menuManagement.updateDataSourceDragDropTargets();
            }
        },
        //重新绑定事件
        ReBindEvents: function () {
            var self = this;
            self.shell.Container.find('tbody>tr').unbind('click').bind('click', function () {
                var cells = $('#' + self.shell.BasicID).wijgrid("columns");
                var rowData = {};
                var tr = $(this);
                for (var i = 0; i < cells.length; i++) {
                    rowData[cells[i].options.dataKey] = tr.find('td:eq(' + i + ')')[0].innerText.trim();
                }
                if (self.isBindData && rowData) {
                    self.Set('OutPramats', rowData);
                }
            });
            return this;
        },
        //重新设置属性
        ResetProperty: function () {
            var self = this;
            $('#' + self.shell.ID + ' .selectPanelBodySty:eq(0)').html('<table style="width: 100%;" id="' + self.shell.BasicID + '"></table>'); //清空body
            $('#' + self.shell.BasicID).wijgrid("destroy");
            if (self.IsEditState) {
                self.shell.Container.css({ 'width': '100%' });
            }
            //强制打开滚动条
            if (self.wijgridDefaultConfig.spc) {
                //self.wijgridDefaultConfig.scrollMode = 'auto';//"horizontal";
                self.wijgridDefaultConfig.ensureColumnsPxWidth = false;
            }
            //update by sunming 2014-01-16
//            if (self.wijgridDefaultConfig.scrollMode !== 'none') {
//                self.wijgridDefaultConfig.allowPaging = false;
//                //                self.shell.Body.find('table').css('height',self.shell.Container.height() + 'px')
//                //                    .css('width',self.shell.Container.width()+'px');
//            }

            var grid = $("#" + this.shell.BasicID).wijgrid(self.wijgridDefaultConfig);
            grid.parent().next().remove(); //移除多余的分页工具
            if (self.wijgridDefaultConfig.scrollMode == 'none') {
                grid.css('width', '100%').parent().css('width', '100%');
            } else {
                //grid.wijgrid("setSize",self.oldSize.width,self.oldSize.height);
            }

            //            $('#'+self.shell.ID).resizable({
            //                minHeight: $('#'+self.shell.ID).height(),
            //                minWidth: 200
            //            });
            self.fixResize();
            return this;
        },
        RemoveEntity: function (_EntityKey) {
            if (!_EntityKey) {
                throw 'DataGrid.RemoveEntity Arg is null';
            }
            var self = this;
            var entitys = self.Get('Entity');
            var index = -1;
            if (entitys && entitys.length) {
                for (var i = 0; i < entitys.length; i++) {
                    if (entitys[i]["Key"] == _EntityKey) {
                        index = i;
                        break;
                    }
                }
            }
            if (index >= 0) {
                entitys.splice(index, 1);
                $('#' + self.shell.BasicID).wijgrid("destroy");
                Agi.Controls.DataGridProrityClear(self);
            }

            //删除数据后删掉共享数据源和控件的关系
            Agi.Msg.ShareDataRelation.DeleteItem(self.shell.BasicID);
            //20130223 倪飘 解决控件库-数据表格，进入属性设置页面删除下方数据，左侧控件变小了，再次拖入数据就无法显示数据问题
            var HTMLElement = $(self.Get("HTMLElement"));
            HTMLElement.height(180);
        },
        ReadData: function (et) {
            if (!et.IsShareEntity) {
                this.wijgridDefaultConfig.colsConfig = [];
            }
            var entity = this.Get("Entity");
            entity = [];
            entity.push(et);
            this.chageEntity = true;
            this.Set("Entity", entity);

            //this.shell.Container.css({ "width": "auto", "height": "auto" });
            this.PostionChange(null);
        },
        ReadRealData: function (_Entity) {
        },
        ParameterChange: function (_ParameterInfo) {//参数联动
            this.Set('Entity', this.Get('Entity'));
        },
        Init: function (_Target, _ShowPosition, savedId) {/*控件初始化，_Target：显示到的容器，_ShowPosition：控件显示到的位置,left,top*/
            var self = this;
            self.shell = null;
            self.AttributeList = [];
            self.Set("Entity", []);
            self.Set("ControlType", "DataGrid");
            self.snycTheme = false;
            var ID = savedId ? savedId : "DataGrid" + Agi.Script.CreateControlGUID();


            var HTMLElementPanel = $("<div recivedata='true' id='Panel_" + ID + "' class='PanelSty selectPanelSty' style='padding-right: 2px;width:350px;'></div>");
            this.shell = new Agi.Controls.Shell({
                ID: ID,
                width: undefined,
                height: 197,
                divPanel: HTMLElementPanel
            });
            var BaseControlObj = $('<table style="width: 100%;" id="' + ID + '"></table>');
            //this.shell.Body.width(581).height(145);
            this.shell.initialControl(BaseControlObj[0]);


            self.isBindData = false;
            self.isInit = true;
            self.isApplyProperty = false;
            self.chageEntity = false;

            this.Set("HTMLElement", this.shell.Container[0]);
            var ThisProPerty = {
                ID: ID,
                BasciObj: BaseControlObj
            };

            var BasicProperty = {

            };
            this.Set('BasicProperty', BasicProperty);

            var PostionValue = { Left: 0, Top: 0, Right: 0, Bottom: 0 };
            var obj = null;
            if (typeof (_Target) == "string") {
                obj = $("#" + _Target);
            } else {
                obj = $(_Target);
            }
            var PagePars = { Width: $(obj).width(), Height: $(obj).height(), Left: 0, Top: 0 };

            this.Set("ProPerty", ThisProPerty);

            this.Set("ThemeInfo", null);

            if (layoutManagement.property.type == 1) {
                //HTMLElementPanel.width(400);
                //HTMLElementPanel.height(300);
                PostionValue.Left = ((_ShowPosition.Left - PagePars.Left) / PagePars.Width).toFixed(4);
                PostionValue.Top = ((_ShowPosition.Top - PagePars.Top) / PagePars.Height).toFixed(4);
                PostionValue.Right = ((PagePars.Width - HTMLElementPanel.width() - (_ShowPosition.Left - PagePars.Left)) / PagePars.Width).toFixed(4);
                PostionValue.Bottom = ((PagePars.Height - HTMLElementPanel.height() - (_ShowPosition.Top - PagePars.Top)) / PagePars.Height).toFixed(4);
            } else {
                HTMLElementPanel.removeClass("selectPanelSty");
                HTMLElementPanel.addClass("selectAutoFill_PanelSty");
                obj.html("");
            }
            if (_Target != null) {
                this.Render(_Target);
            }
            //var StartPoint = { X: 0, Y: 0 };

            /*事件绑定*/
            $('#' + self.shell.ID).mousedown(function (ev) {
                if (Agi.Edit) {
                    ev.stopPropagation();
                    Agi.Controls.BasicPropertyPanel.Show(this.id);
                }
            });

            $('#' + self.shell.ID).dblclick(function (ev) {
                if (!Agi.Controls.IsControlEdit) {
                    if (Agi.Edit) {
                        Agi.Controls.ControlEdit(self); //控件编辑界面
                    }
                }
            });
            if (HTMLElementPanel.touchstart) {
                HTMLElementPanel.touchstart(function (ev) {
                    //Agi.Controls.BasicPropertyPanel.Show(this.id);
                });
            }

            this.Set("Position", PostionValue);
            self.isInit = false;
            //缩小的最小宽高设置
            //            HTMLElementPanel.resizable({
            //                minHeight: 220,
            //                minWidth: 200
            //            });
            //20130515 倪飘 解决bug，组态环境中拖入数据表格控件以后拖入容器框控件，容器框控件会覆盖其他控件（容器框控件添加背景色以后能够看到效果）
            Agi.Controls.BasicPropertyPanel.Show(self.shell.ID);
        }, //end Init
        CustomProPanelShow: function () {//显示自定义属性面板
            Agi.Controls.DataGridProrityInit(this);
        },
        Destory: function () {
            var HTMLElement = this.Get("HTMLElement");
            var proPerty = this.Get("ProPerty");
            //            Agi.Edit.workspace.removeParameter(proPerty.ID);
            /*移除输出参数*/

            //            Agi.Edit.workspace.controlList.remove(this);
            //            Agi.Edit.workspace.currentControls.length = 0;
            //            Agi.Controls.ControlDestoryByList(this);//移除控件,从列表中
            /*清除选中控件对象*/

            $(HTMLElement).remove();
            HTMLElement = null;
            this.AttributeList.length = 0;
            proPerty = null;
            delete this;
        },
        Copy: function () {
            if (layoutManagement.property.type == 1) {
                var ParentObj = this.shell.Container.parent();
                var PostionValue = this.Get("Position");
                var newPanelPositionpars = { Left: parseFloat(PostionValue.Left), Top: parseFloat(PostionValue.Top) }
                var NewDataGrid = new Agi.Controls.DataGrid();
                NewDataGrid.Init(ParentObj, PostionValue);
                newPanelPositionpars = null;
                return NewDataGrid;
            }
        },
        PostionChange: function (_Postion, isResize) {
            var self = this;
            if (_Postion != null && _Postion.Left != null && _Postion.Top != null && _Postion.Right != null && _Postion.Bottom != null) {
                var ParentObj = $(this.Get("HTMLElement")).parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                var _ThisPosition = {
                    Left: (_Postion.Left / PagePars.Width).toFixed(4),
                    Top: (_Postion.Top / PagePars.Height).toFixed(4),
                    Right: (_Postion.Right / PagePars.Width).toFixed(4),
                    Bottom: (_Postion.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            } else {
                var ThisHTMLElement = $(this.Get("HTMLElement"));
                //var ParentObj = $('#BottomRightCenterContentDiv');
                var ParentObj = $(ThisHTMLElement).parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height(), Left: ParentObj.offset().left, Top: ParentObj.offset().top };


                var ThisControlPars = { Width: ThisHTMLElement.width(), Height: ThisHTMLElement.height(), Left: (ThisHTMLElement.offset().left - PagePars.Left), Top: (ThisHTMLElement.offset().top - PagePars.Top), Right: 0, Bottom: 0 };
                ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
                ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);

                var _ThisPosition = {
                    Left: (ThisControlPars.Left / PagePars.Width).toFixed(4),
                    Top: (ThisControlPars.Top / PagePars.Height).toFixed(4),
                    Right: (ThisControlPars.Right / PagePars.Width).toFixed(4),
                    Bottom: (ThisControlPars.Bottom / PagePars.Height).toFixed(4)
                }
                this.Set("Position", _ThisPosition);
                PagePars = _ThisPosition = null;
            }

            var w = self.shell.Container.width();
            var h = self.shell.Container.height();
            if (isResize) {
                //$('#' + self.shell.BasicID).wijgrid('setSize', w, h);
                self.Set('Entity', self.Get('Entity'));
            }
            self.wijgridDefaultConfig.customShellWidth = w;
            self.wijgridDefaultConfig.customShellHeight = h;
            return this;
        },
        ResizeCompleted: function () {
        },
        Refresh: function () {
            var ThisHTMLElement = $(this.Get("HTMLElement"));
            var ParentObj = ThisHTMLElement.parent();
            if (!ParentObj.length) {
                return;
            }
            var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
            var PostionValue = this.Get("Position");
            PostionValue.Left = parseFloat(PostionValue.Left);
            PostionValue.Right = parseFloat(PostionValue.Right);
            PostionValue.Top = parseFloat(PostionValue.Top);
            PostionValue.Bottom = parseFloat(PostionValue.Bottom);
            var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (PostionValue.Left + PostionValue.Right))),
                Height: parseInt(PagePars.Height - (PagePars.Height * (PostionValue.Top + PostionValue.Bottom)))
            };
            ThisHTMLElement.width(ThisControlPars.Width);
            //ThisHTMLElement.height(ThisControlPars.Height);
            ThisHTMLElement.css("left", (ParentObj.offset().left + parseInt(PostionValue.Left * PagePars.Width)) + "px");
            ThisHTMLElement.css("top", (ParentObj.offset().top + parseInt(PostionValue.Top * PagePars.Height)) + "px");
            this.Set("Position", PostionValue);
            //$('#' + this.shell.ID).css('height', 'auto');
        },
        HTMLElementSizeChanged: function () {
            var Me = this;
            if (Agi.Controls.IsControlEdit) {//如果是进入编辑界面，100%适应
                Me.Set("Position", { Left: 0, Right: 0, Top: 0, Bottom: 0 }); //由于有属性每个控件都有自己的属性监听管理，所以当Position更改时会有对应的适应处理方法
                Me.shell.Container.css({ 'width': '100%', 'height': 'auto' });
                //20130220 倪飘 解决Grid属性变价页面小箭头点击后数据列显示不完全问题
                Me.Set("Entity", Me.Get("Entity"));
                if (!Me.wijgridDefaultConfig.allowPaging) {
                    $('#' + Me.shell.BasicID).wijgrid("ensureControl", true);
                }
            } else {
                Me.Refresh(); //每个控件都应该有一个Refresh方法，内部其实也是更新Position属性，但可能根据每个控件有所不同，大家可以参考Chart控件的实现代码，但不要完全模仿
            }
        },
        Checked: function () {
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027",
                "-moz-box-shadow": "1px 1px 1px #ff4027, -1px -1px 1px #ff4027"
            });
        },
        UnChecked: function () {
            $('#' + this.shell.ID).css({ "-webkit-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000",
                "-moz-box-shadow": "0px 0px 0px #000, 0px 0px 0px #000"
            });
            /*  $('#'+this.shell.ID).css({"-webkit-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000",
             "-moz-box-shadow":"1px 1px 1px #000, -1px -1px 1px #000"});*/
        },
        EnterEditState: function () {
            var self = this;
            self.IsEditState = true;
            var obj = $(this.Get('HTMLElement'));
            this.oldSize = {
                width: obj.width(),
                height: obj.height()
            }
            obj.css({ "width": '100%' });
            $("#" + this.shell.BasicID).wijgrid("doRefresh").css('width', '100%');

            //高度重新计算
            var h = this.shell.Title.height() + this.shell.Body.find('>:first-child').height() + this.shell.Footer.height();
            self.ApplyProperty({ applyControlProperty: false });
            self.ApplyAlarmRule();
            if (self.wijgridDefaultConfig.scrollMode != 'none') {
                this.shell.Container.height(h);
                $('#' + self.shell.BasicID).wijgrid('setSize', self.shell.Container.width(), self.shell.Container.height());
            }
            //应用样式
            //如果有滚动条模式,下面可以把多多的空白清除
            self.ClearBlank();
            self.shell.Container.css('max-height', self.shell.Container.parent().height() + 'px');
            self.shell.Container.find('div.wijmo-wijgrid').css('max-height', self.shell.Container.parent().height() + 'px');
        },
        BackOldSize: function () {
            var self = this;
            self.IsEditState = false;
            if (self.oldSize) {
                var obj = $(this.Get('HTMLElement'));
                obj.width(this.oldSize.width).height(this.oldSize.height);

                try {
                    var grid = $("#" + this.shell.BasicID).wijgrid("doRefresh");
                    grid.css('width', '100%').parent().css('width', '100%');
                    //self.ResetProperty();
                    //$('#'+self.shell.ID).css('height','auto');
                    self.ApplyProperty({ applyControlProperty: false });
                    self.ApplyAlarmRule();
                } catch (e) {
                    //console.log(e);
                }
            }

            if (!self.wijgridDefaultConfig.allowPaging) {
                $('#' + self.shell.BasicID).wijgrid("ensureControl", true);
            }
            self.shell.Container.css('max-height', '');
            self.shell.Container.find('div.wijmo-wijgrid').css('max-height', '');
            self.ReBindEvents();
        },
        ControlAttributeChangeEvent: function (_obj, Key, _Value) {
            Agi.Controls.DataGridAttributeChange(this, Key, _Value);

            if (Key === 'Position' && !_obj.isInit) {
                var htmlElement = $('#' + this.shell.ID);
                var ParentObj = htmlElement.parent();
                var PagePars = { Width: ParentObj.width(), Height: ParentObj.height() };
                htmlElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
                htmlElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
            }
        },
        fixResize: function () {
            var self = this;
            var minH = $('#' + self.shell.ID).height();
            var maxH = minH;
            //            $('#'+self.shell.ID).resizable({
            //                minHeight: minH,
            //                maxHeight:maxH,
            //                minWidth: 200
            //            });
        },
        GetConfig: function () {
            var self = this;

            var ProPerty = this.Get("ProPerty");

            var DataGridControl = {
                Control: {
                    ControlType: null, //控件类型
                    ControlID: null, //控件属性
                    ControlBaseObj: null, //控件基础对象
                    HTMLElement: null, //控件外壳ID
                    Entity: null, //控件实体
                    BasicProperty: null, //控件基础属性
                    Position: null, //控件位子
                    ThemeInfo: null,
                    GridDefaultConfig: null, //默认值
                    ColumnConfig: null // 列配置
                }
            }
            DataGridControl.Control.ControlType = this.Get("ControlType");
            DataGridControl.Control.ControlID = ProPerty.ID;
            DataGridControl.Control.ControlBaseObj = ProPerty.BasciObj[0].id;
            DataGridControl.Control.HTMLElement = ProPerty.BasciObj[0].id;
            var Entitys = this.Get("Entity");
            //20121227 11:18 罗万里 页面预览或保存时会导致控件的实体数据被清空问题修改
            //            $(Entitys).each(function (i, e) {
            //                e.Data = null;
            //            });
            DataGridControl.Control.Entity = Entitys;
            DataGridControl.Control.BasicProperty = this.Get("BasicProperty");
            DataGridControl.Control.Position = this.Get("Position");
            DataGridControl.Control.ThemeInfo = this.Get("ThemeInfo");
            var GridDefaultConfig = Agi.Script.CloneObj(self.wijgridDefaultConfig);
            for (name in GridDefaultConfig) {
                if (typeof GridDefaultConfig[name] == 'function') {
                    delete GridDefaultConfig[name];
                }
            }
            GridDefaultConfig.data = [];//数据不能保存的
            DataGridControl.Control.GridDefaultConfig = GridDefaultConfig;
            DataGridControl.Control.ColumnConfig = self.wijgridDefaultConfig.colsConfig;
            DataGridControl.Control.snycTheme = this.snycTheme;
            return DataGridControl.Control;
        }, //获得Panel控件的配置信息
        CreateControl: function (_Config, _Target) {
            //this.setScriptCode(_Config.script);
            this.Init(_Target, _Config.Position, _Config.HTMLElement);
            if (_Config != null) {
                var BasicProperty = null;
                if (_Target != null && _Target != "") {
                    var _Targetobj = $(_Target);

                    _Config.Entity = _Config.Entity;


                    _Config.Position = _Config.Position;
                    this.Set("Position", _Config.Position);
                    this.snycTheme = _Config.snycTheme;

                    _Config.ThemeInfo = _Config.ThemeInfo;
                    this.Set("ThemeInfo", _Config.ThemeInfo);

                    BasicProperty = _Config.BasicProperty;
                    this.Set("BasicProperty", BasicProperty);


                    var GridDefaultConfig = _Config.GridDefaultConfig;
                    //alert(_Config.GridDefaultConfig);
                    for (name in GridDefaultConfig) {
                        this.wijgridDefaultConfig[name] = GridDefaultConfig[name];
                    }


                    this.wijgridDefaultConfig.colsConfig = _Config.ColumnConfig;
                    this.wijgridDefaultConfig.ensureColumnsPxWidth = (this.wijgridDefaultConfig.scrollMode == 'none') ? false : true;
                    this.wijgridDefaultConfig.customAutoColumnWidth = _Config.GridDefaultConfig.customAutoColumnWidth;

                    var ThisProPerty = this.Get('ProPerty');
                    ThisProPerty.ID = _Config.ControlID;
                    ThisProPerty.BasciObj.attr('id', _Config.ControlID);

                    var PagePars = { Width: _Targetobj.width(), Height: _Targetobj.height() };
                    _Config.Position.Left = parseFloat(_Config.Position.Left);
                    _Config.Position.Right = parseFloat(_Config.Position.Right);
                    _Config.Position.Top = parseFloat(_Config.Position.Top);
                    _Config.Position.Bottom = parseFloat(_Config.Position.Bottom);

                    var ThisControlPars = { Width: parseInt(PagePars.Width - (PagePars.Width * (_Config.Position.Left + _Config.Position.Right))),
                        Height: parseInt(PagePars.Height - (PagePars.Height * (_Config.Position.Top + _Config.Position.Bottom)))
                    };
                    //ThisProPerty.BasciObj.parent().width(ThisControlPars.Width);
                    //ThisProPerty.BasciObj.parent().height(ThisControlPars.Height);
                    //ThisProPerty.BasciObj.parent().css("left",(_Targetobj.offset().left+parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(_Targetobj.offset().top+parseInt(_Config.Position.Top*PagePars.Height))+"px");
                    //ThisProPerty.BasciObj.parent().css("left",(parseInt(_Config.Position.Left*PagePars.Width))+"px");
                    //ThisProPerty.BasciObj.parent().css("top",(parseInt(_Config.Position.Top*PagePars.Height))+"px");

                    this.shell.Container.width(ThisControlPars.Width).height(ThisControlPars.Height);
                    this.shell.Container.css('left', (parseInt(_Config.Position.Left * PagePars.Width)) + "px");
                    this.shell.Container.css('top', (parseInt(_Config.Position.Top * PagePars.Height)) + "px");

                    this.Set("Entity", _Config.Entity);


                    this.ApplyProperty({ applyControlProperty: true });


                }
            }
        }, //根据配置信息创建控件
        ApplyProperty: function (option) {
            var options = {
                applyControlProperty: true,
                appluCustomProperty: true
            }
            for (name in option) {
                options[name] = option[name];
            }
            var self = this;
            self.isApplyProperty = true;
            var grid = $("#" + self.shell.BasicID);
            var table = $('#' + self.shell.ID + ' table:eq(0)');
            if (options.applyControlProperty) {
                //排序
                grid.wijgrid("option", "allowSorting", self.wijgridDefaultConfig.allowSorting);
                //"分页":
                grid.wijgrid("option", "allowPaging", self.wijgridDefaultConfig.allowPaging);
                //"过滤":
                grid.wijgrid("option", "showFilter", self.wijgridDefaultConfig.showFilter);
                //"每页显示条数":
                grid.wijgrid("option", "pageSize", self.wijgridDefaultConfig.pageSize);
                //滚动条
                //grid.wijgrid('option','scrollMode',self.wijgridDefaultConfig.scrollMode);
            }
            //"间隔行字体色":
            table.find('tbody .wijmo-wijgrid-row:nth-child(even)>td').css('color', self.wijgridDefaultConfig.customIntervalRowColor);
            //"间隔行背景色":
            var inRbg = table.find('tbody .wijmo-wijgrid-row:nth-child(even)>td').css('background-color', self.wijgridDefaultConfig.customInvervalRowBgColor);
            if (typeof self.wijgridDefaultConfig.customInvervalRowBgColor === 'object') {
                inRbg.css(self.wijgridDefaultConfig.customInvervalRowBgColor.value);
            }
            //"冻结列个数":
            //self.wijgridDefaultConfig.customFreezeColCount = num
            //"行字体色":
            table.find('tbody .wijmo-wijgrid-row:nth-child(odd)>td').css('color', self.wijgridDefaultConfig.customRowColor);
            //"字体大小":
            table.find('tbody .wijmo-wijgrid-row>td').css('font-size', self.wijgridDefaultConfig.customFontSize + 'px');
            //"行背景色":
            var rbg = table.find('tbody .wijmo-wijgrid-row:nth-child(odd)>td').css('background-color', self.wijgridDefaultConfig.customRowBgColor);
            if (typeof self.wijgridDefaultConfig.customRowBgColor === 'object') {
                rbg.css(self.wijgridDefaultConfig.customRowBgColor.value);
            }
            //"表格线显示":
            switch (self.wijgridDefaultConfig.customTableLineModel) {
                case "all":
                    table.find('tbody tr').css('border-width', '');
                    table.find('tbody td').css('border-width', '');
                    break;
                case "rows":
                    table.find('tbody tr').css('border-width', '0px');
                    table.find('tbody td').css('border-width', '0px');

                    table.find('tbody tr').css('border-width', '1px');
                    table.find('tbody td').css('border-top-width', '1px');
                    break;
                case "cols":
                    table.find('tbody tr').css('border-width', '0px');
                    table.find('tbody td').css('border-width', '0px');

                    table.find('tbody td').css('border-right-width', '1px');
                    break;
                case "none":
                    table.find('tbody tr').css('border-width', '0px');
                    table.find('tbody td').css('border-width', '0px');
                    break;
            }
            //"水平线颜色":
            table.find('tbody tr').css('border-top-color', self.wijgridDefaultConfig.customHlineColor);
            //"行高度":
            table.find('tbody>tr').css('height', self.wijgridDefaultConfig.customRowHeight + 'px');
            //"主题":
            //self.wijgridDefaultConfig.customTheme= $(this).val();
            //"背景色":
            //self.wijgridDefaultConfig.customBackgroundColor= $(this).val();
            //alert(self.wijgridDefaultConfig.customBackgroundColor);
            //"显示头部":
            if (self.wijgridDefaultConfig.customHeaderShowModel != 'true') {
                if (self.wijgridDefaultConfig.scrollMode === 'none') {
                    table.find('thead .wijmo-wijgrid-headerrow').hide();
                } else {
                    self.SwitchHead(false);
                }
            } else {
                if (self.wijgridDefaultConfig.scrollMode === 'none') {
                    table.find('thead .wijmo-wijgrid-headerrow').show();
                } else {
                    self.SwitchHead(true);
                }
            }
            //"标题颜色":
            //$('#'+Agi.Controls.FindControl('DataGrid813188').shell.ID).find('thead:eq(0) th>div *')
            var thead = $('#' + self.shell.ID).find('thead:eq(0)');
            thead.find('th>div *').css('color', self.wijgridDefaultConfig.customHeaderColor);
            //table.find('thead th>div *').css('color',self.wijgridDefaultConfig.customHeaderColor);
            ////"标题背景":
            //            var bgimg = ' ';
            //            if(self.IsPageView){
            //                bgimg = ' ';
            //            }
            //table.find('thead th').css('background',self.wijgridDefaultConfig.customHeaderBgColor+ bgimg);
            if (self.wijgridDefaultConfig.customHeaderBgColor) {
                thead.find('th').css('background', self.wijgridDefaultConfig.customHeaderBgColor);
                if (typeof self.wijgridDefaultConfig.customHeaderBgColor === 'object') {
                    $('thead:eq(0) th,.wijmo-wijgrid-footer', '#' + self.shell.ID).css(self.wijgridDefaultConfig.customHeaderBgColor.value);
                }
            }
            //"垂直线颜色":
            table.find('tbody td').css('border-right-color', self.wijgridDefaultConfig.customVlineColor);
            //"数据文本位置":
            table.find('tbody td>div').css('text-align', self.wijgridDefaultConfig.customTextAlign);

            self.isApplyProperty = true;

            var prototypeColums = grid.wijgrid('columns');
            $(self.wijgridDefaultConfig.colsConfig).each(function (i, col) {
                //var s ='<a style="background-color: transparent;'
                //列颜色
                if (col.columnColor != 'transparent') {
                    $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (col.dataIndex + 1) + ')')
                        .css('background-color', col.columnColor);
                }
                if (typeof col.columnColor === 'object') {
                    $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (col.dataIndex + 1) + ')')
                        .css(col.columnColor.value);
                }
                //字号
                $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (col.dataIndex + 1) + ')')
                    .css('font-size', col.fontSize + 'px')
                    .css('font-family', col.fontFamily)
                    .css('font-weight', col.fontWeight);

                //显示名称
                var cIndex = 0;
                for (; cIndex < prototypeColums.length; cIndex += 1) {
                    widgetInstance = prototypeColums[cIndex];
                    if (widgetInstance.options && widgetInstance.options.dataKey == col.dataKey) {
                        widgetInstance.element.c1field('option', 'headerText', col.headerText);
                        break;
                    }
                }
            });
        }, //end applyproperty
        ApplyAlarmRule: function () {
            if (!this.isBindData) {
                return;
            }
            var self = this;
            var ColsConfig = self.wijgridDefaultConfig.colsConfig;
            if (ColsConfig && ColsConfig.length) {
                $(ColsConfig).each(function (i, col) {
                    var ruleConfig = col.alarmRule;
                    if (ruleConfig && ruleConfig.length) {
                        $(ruleConfig).each(function (i, rule) {//for 一个列的规则
                            var compareType = rule.compareTyle;
                            if (col.dataIndex >= 0) {
                                $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (col.dataIndex + 1) + ')').each(function (i, td) {
                                    var data = $(td).text().trim();
                                    switch (col.dataType) {
                                        case "number":
                                            data = parseFloat(data);
                                            break;
                                        case "date":
                                            data = Date.parse(data);
                                            break;
                                        case "string":
                                            break;
                                    }
                                    var mathResult = false;
                                    var v1 = rule.compareValue[0];
                                    var v2 = rule.compareValue[1];
                                    if (compareType == 'column') {
                                        var rIndex = $(td).parent().index();
                                        var cIndex1 = -1,
                                            cIndex2 = -1;
                                        //1
                                        var findCol1 = $.grep(ColsConfig, function (c) {
                                            return (c.dataKey === rule.compareValue[2]);
                                        });
                                        if (findCol1 && findCol1.length) {
                                            cIndex1 = findCol1[0].dataIndex;
                                        }
                                        //2
                                        var findCol2 = $.grep(ColsConfig, function (c) {
                                            return (c.dataKey === rule.compareValue[3]);
                                        });
                                        if (findCol2 && findCol2.length) {
                                            cIndex2 = findCol2[0].dataIndex;
                                        }
                                        if (rIndex >= 0 && cIndex1 >= 0) {
                                            v1 = $('#' + self.shell.BasicID + ' tbody>tr:eq(' + rIndex + ')').find('td:eq(' + cIndex1 + ')').text();
                                        }
                                        if (rIndex >= 0 && cIndex2 >= 0) {
                                            v2 = $('#' + self.shell.BasicID + ' tbody>tr:eq(' + rIndex + ')').find('td:eq(' + cIndex2 + ')').text();
                                        }
                                    } //end if
                                    switch (rule.compareOperate) {
                                        case "等于":
                                            mathResult = eval("( data == v1)");
                                            break;
                                        case "不等于":
                                            mathResult = eval("( data != v1)");
                                            break;
                                        case "大于":
                                            mathResult = eval("( data > v1)");
                                            break;
                                        case "大于或等于":
                                            mathResult = eval("( data >= v1)");
                                            break;
                                        case "小于":
                                            mathResult = eval("( data < v1)");
                                            break;
                                        case "小于或等于":
                                            mathResult = eval("( data <= v1)");
                                            break;
                                        case "介于":
                                            mathResult = eval('( data >= v1 && data <= v2)');
                                            break;
                                    } // end switch
                                    if (mathResult) {
                                        $(td).css('background-color', rule.alarmColor);
                                        if (typeof rule.alarmColor === 'object') {
                                            $(td).css(rule.alarmColor.value);
                                        }
                                    }
                                }); //end each
                            } //end if
                        }); //end each
                    }
                });


            }
        }, //end ApplyAlarmRule
        ChangeTheme: function (_themeName) {
            var Me = this;
            /*2012-11-04 16:30:27 添加样式切换应用 Auth:Markeluo  编号:20121104163027*/
            //1.根据当前控件类型和样式名称获取样式信息
            var ChartStyleValue = Agi.layout.StyleControl.GetStyOptionByControlType(Me.Get("ControlType"), _themeName);
            //保存主题样式
            Me.Set("ThemeInfo", _themeName);
            //3.应用当前控件的Options信息
            Agi.Controls.DataGrid.OptionsAppSty(ChartStyleValue, Me);

        } //更改样式
    }, true);

/*应用样式，将样式应用到控件的相关参数以更新相关显示
 * _StyConfig:样式配置信息
 *  _DataGrid:当前控件对象
 * */
Agi.Controls.DataGrid.OptionsAppSty = function (_StyConfig, _DataGrid) {
    if (_StyConfig != null) {
        var grid = $("#" + _DataGrid.shell.ID);
        var table = $('#' + _DataGrid.shell.ID + ' table:eq(0)');
        var thead = $('#' + _DataGrid.shell.ID).find('thead:eq(0)');
        //标题背景颜色
        thead.find('th').css(_StyConfig.titleBackgroungColor.value);
        thead.find('th').css('border-top', _StyConfig.titleBorderTop);
        thead.find('th').css('border-bottom', _StyConfig.titleBorderBottom);
        thead.find('th').css('border-left', _StyConfig.titleBorderLeft);
        thead.find('th').css('border-right', _StyConfig.titleBorderRight);
        //标题字体颜色
        thead.find('th>div *').css('color', _StyConfig.titleFontColor);
        thead.find('th>div *').css('text-shadow', _StyConfig.titleFontShadow);
        //"行背景色":
        table.find('tbody .wijmo-wijgrid-row:nth-child(odd)>td').css(_StyConfig.customRowColor.value);
        table.find('tbody .wijmo-wijgrid-row:nth-child(odd)>td').css('color', _StyConfig.trColor);
        table.find('tbody .wijmo-wijgrid-row:nth-child(even)>td').css(_StyConfig.customRowBgColor.value);
        table.find('tbody .wijmo-wijgrid-row:nth-child(even)>td').css('color', _StyConfig.trColor);
        //"水平线颜色":
        table.find('tbody tr').css('border-top-color', _StyConfig.hLineColor);
        //"垂直线颜色":
        table.find('tbody td').css('border-right-color', _StyConfig.vLineColor);
        //底部背景
        grid.find('.wijmo-wijsuperpanel-footer').css('background', _StyConfig.FootBackgroungColor);
        if (_StyConfig.pageactiveborder) {
            //分页块样式
            //默认
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-default').css('border', _StyConfig.pagedefaultborder);
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-default').css('background', _StyConfig.pagedefaultbackground);
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-default').css('color', _StyConfig.pagedefaultcolor);
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-default').css('webkit-box-shadow', 'none');
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-default>a').css('color', '#fff');
            //选中
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-active').css('border', _StyConfig.pageactiveborder);
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-active').css('background', _StyConfig.pageactivebackground);
            grid.find('.wijmo-wijsuperpanel-footer').find('.ui-state-active').css('color', _StyConfig.pageactivecolor);
        }
        //table.find('tbody tr').last().css('display', 'none')
        grid.find('.ui-widget-content').css('border', '0px');

        if (!_DataGrid.snycTheme) {
            //间隔行字体色
            _DataGrid.wijgridDefaultConfig.customIntervalRowColor = _StyConfig.trColor;
            //间隔行背景色
            _DataGrid.wijgridDefaultConfig.customInvervalRowBgColor = _StyConfig.customRowColor;
            //行字体色
            _DataGrid.wijgridDefaultConfig.customRowColor = _StyConfig.trColor;
            //行背景色
            _DataGrid.wijgridDefaultConfig.customRowBgColor = _StyConfig.customRowBgColor;
            //水平线颜色
            _DataGrid.wijgridDefaultConfig.customHlineColor = _StyConfig.hLineColor;
            //垂直线颜色
            _DataGrid.wijgridDefaultConfig.customVlineColor = _StyConfig.vLineColor;
            //标题颜色
            _DataGrid.wijgridDefaultConfig.customHeaderColor = _StyConfig.titleFontColor;
            //标题背景
            _DataGrid.wijgridDefaultConfig.customHeaderBgColor = _StyConfig.titleBackgroungColor;
            _DataGrid.snycTheme = true;
        }
    }
};


/*下拉列表控件参数更改处理方法*/
Agi.Controls.DataGridAttributeChange = function (_ControlObj, Key, _Value) {
    var self = _ControlObj;
    switch (Key) {
        case "Position":
        {
            if (layoutManagement.property.type == 1) {
                var ThisHTMLElement = $(_ControlObj.Get("HTMLElement"));
                var ThisControlObj = _ControlObj.Get("ProPerty").BasciObj;

                var ParentObj = ThisHTMLElement.parent();
                var PagePars = {Width: ParentObj.width(), Height: ParentObj.height()};
                //ThisControlObj.height(ThisHTMLElement.height()-20);
//                ThisHTMLElement.width(PagePars.Width - ((parseFloat(_Value.Left) + parseFloat(_Value.Right)) * PagePars.Width));
//                ThisHTMLElement.height(PagePars.Height - ((parseFloat(_Value.Top) + parseFloat(_Value.Bottom)) * PagePars.Height));
                ThisHTMLElement.css("left", parseInt(parseFloat(_Value.Left) * PagePars.Width) + "px");
                ThisHTMLElement.css("top", parseInt(parseFloat(_Value.Top) * PagePars.Height) + "px");
                PagePars = null;

                if (Agi.Edit) {
                    var w = self.shell.Container.width();
                    var h = self.shell.Container.height();
                    self.wijgridDefaultConfig.customShellWidth = w;
                    self.wijgridDefaultConfig.customShellHeight = h;
                }

                //$('#'+self.shell.BasicID).wijgrid("ensureControl", true);
            }
        }
            break;
        case "SelValue":
        {

        }
            break;
        case "OutPramats"://用户选择了一个项目
        {
            if (_Value != 0) {
                //var ThisControlPrority=_ControlObj.Get("ProPerty");
                var ThisOutPars = [];
                if (_Value != null) {
                    for (var item in _Value) {
                        ThisOutPars.push({Name: item, Value: _Value[item]});
                    }
                }
                Agi.Msg.PageOutPramats.PramatsChange({/*Chart 输出参数更改*/
                    "Type": Agi.Msg.Enum.Controls,
                    "Key": _ControlObj.shell.BasicID,
                    "ChangeValue": ThisOutPars
                });
                Agi.Msg.TriggerManage.ParaChangeEvent({"sender": _ControlObj, "Type": Agi.Msg.Enum.Controls});
                ThisOutPars = null;
            }
            //通知消息模块，参数发生更改
        }
            break;
        case "BasicProperty":
        {
        }
            break;
        case "Entity"://实体
        {
            var entity = _ControlObj.Get('Entity');
            if (entity && entity.length) {
                //分页数据设置为共离数据源
                BindDataByEntityPage.call(self, entity[0],_Value,self.wijgridDefaultConfig.pageSize);
            }
        }
            break;
    }//end switch

    //根据实体绑定来绑定数据
    function BindDataByEntity(et) {
        var self = this;
        if (!et.IsShareEntity) {//判断是否是共享数据源,不是就自己请求数据
            var callback=function (d) {
                et.Data = d;
                if (et.Data != null) {
                    //如果数据量达到500,鉴定为大数据
                    if (et.Data.length >= 500) {
                        self.isBigData = true;
                    } else {
                        self.isBigData = false;
                    }

                    if (Spc.Data && self.wijgridDefaultConfig.spc) {
                        console.log('datagrid ' + self.shell.BasicID + ' requested spc data!');
                        var result = Spc.Data.GetSpcDataForGrid(et.Data, function (result) {
                            if (result && result.arr) {
                                data = data.concat(result.arr);
                            }
                            BindDataByJson.call(self, data);
                            return;
                        });

                    } else {
                        BindDataByJson.call(self, et.Data);
                    }

                    if (Agi.Controls.IsControlEdit && self.chageEntity) {
                        if (Agi.Edit.workspace.currentControls[0].Get('ProPerty').ID === self.Get('ProPerty').ID) {
                            Agi.Controls.ShowControlData(self); //更新实体数据显示
                            Agi.Controls.DataGridProrityInit(self);//刷新高级属性
                        }
                    }
                };
            }

            Agi.Utility.RequestDataByPage(et, function(d){
                    et.Columns = d.Columns;
                    callback(d.Data);
                });

//            if (et.Data != null) {
//                callback(et.Data);
//            }
//            else{
//                Agi.Utility.RequestData2(et, function(d){
//                    et.Columns = d.Columns;
//                    callback(d.Data);
//                });
//            }
        } else if (et.Data != null) {
            BindDataByJson.call(self, et.Data);//绑定共享数据源的数据
        }
        return;
    }

    //根据实体绑定来绑定数据
    function BindDataByEntityPage(et,pageIndex,pageSize) {
        var self = this;

        if (!et.IsShareEntity) {//判断是否是共享数据源,不是就自己请求数据
            var callback=function (d) {
                et.Data = d;
                if (et.Data != null) {
                    //如果数据量达到500,鉴定为大数据
                    if (et.Data.length >= 500) {
                        self.isBigData = true;
                    } else {
                        self.isBigData = false;
                    }

                    if (Spc.Data && self.wijgridDefaultConfig.spc) {
                        console.log('datagrid ' + self.shell.BasicID + ' requested spc data!');
                        var result = Spc.Data.GetSpcDataForGrid(et.Data, function (result) {
                            if (result && result.arr) {
                                data = data.concat(result.arr);
                            }
                            BindDataByJson.call(self, data);
                            return;
                        });

                    } else {
                        BindDataByJson.call(self, et.Data);
                    }

                    if (Agi.Controls.IsControlEdit && self.chageEntity) {
                        if (Agi.Edit.workspace.currentControls[0].Get('ProPerty').ID === self.Get('ProPerty').ID) {
                            Agi.Controls.ShowControlData(self); //更新实体数据显示
                            Agi.Controls.DataGridProrityInit(self);//刷新高级属性
                        }
                    }
                };
            }

            var pIndex=1;
            if(typeof(pageIndex)=="object"){
                pIndex=1;
            }
            else{
                if(!isNaN(pageIndex)){
                    pIndex=eval(pageIndex)+1;
                }else{
                    pIndex=1;
                }
            }

            Agi.Utility.RequestDataByPage(et,pIndex,pageSize, function(result){
                if(result.result=="true"){
                    self.wijgridDefaultConfig.pageIndex=(pIndex-1);
                    self.wijgridDefaultConfig.pageSize = pageSize;
                    self.wijgridDefaultConfig.totalRows = result.totalRows;
                    //et.Columns = d.Columns;
                    callback(result.Data);
                }
                else{
                    self.wijgridDefaultConfig.data = null;
                    self.wijgridDefaultConfig.totalRows = 0;
                    self.SetEntityData(null);
                    self.ResetProperty();
                }
            });

//            if (et.Data != null) {
//                callback(et.Data);
//            }
//            else{
//                Agi.Utility.RequestData2(et, function(d){
//                    et.Columns = d.Columns;
//                    callback(d.Data);
//                });
//            }
        } else if (et.Data != null) {
            BindDataByJson.call(self, et.Data);//绑定共享数据源的数据
        }
        return;
    }

    function BindDataByJson(jsData) {
        var self = this;
        var data = jsData;
        if (!data.length) {
            //return;
        }
        var cols = createColumns(data[0]);
        self.wijgridDefaultConfig.ensureColumnsPxWidth = !self.wijgridDefaultConfig.customAutoColumnWidth;
        //修改在打开垂直滚动条的情况下,grid不能自适应宽的问题:2012/10/16
        if ('vertical' == self.wijgridDefaultConfig.scrollMode || !self.wijgridDefaultConfig.ensureColumnsPxWidth) {
            self.wijgridDefaultConfig.ensureColumnsPxWidth = false;
            $(cols).each(function (i, col) {
                delete col.width;
            });
        }

        self.isBindData = true;
        self.isApplyProperty = false;
        //输出参数
        if (Agi.Edit) {
            Agi.Edit.workspace.removeParameter(self.shell.BasicID);
            /*移除输出参数*/
        } else {
            //Agi.view.removeParameter(self.shell.BasicID);/*移除输出参数*/
        }
        var OutPramats = [];
        var oneData = data[0];
        for (name in oneData) {
            OutPramats.push({Name: name, Value: oneData[name]});
        }
        self.Set("OutPramats", OutPramats);
        /*输出参数名称集合*/
        Agi.Msg.PageOutPramats.AddPramats({
            'Type': Agi.Msg.Enum.Controls,
            'Key': self.shell.BasicID,
            'ChangeValue': OutPramats
        });

        if (cols && cols.length) {
            self.wijgridDefaultConfig.columns = cols;
        }
        self.wijgridDefaultConfig.data = data;
        self.ResetProperty();
        //self.wijgridDefaultConfig.customShellHeight = self.shell.Container.height()-2;

        $('#' + self.shell.ID).css('height', 'auto');

//        if(Agi.Edit){
//            self.PostionChange(null);
//        }
        if (Agi.Controls.IsControlEdit && self.chageEntity) {
            if (Agi.Edit.workspace.currentControls[0].Get('ProPerty').ID === self.Get('ProPerty').ID) {
                Agi.Controls.ShowControlData(self); //更新实体数据显示
                Agi.Controls.DataGridProrityInit(self);//刷新高级属性
            }
        }
        return;
    }

    var customBoolParser = {
        // dom -> boolean
        parseDOM: function (value, culture, format, nullString) {
            return this.parse(value, culture, format, nullString);
        },

        // string/ boolean -> boolean
        parse: function (value, culture, format, nullString) {
            if (typeof (value) === "boolean") {
                return value;
            }

            if (typeof (value) === "string") {
                value = $.trim(value);
            }

            if (!value || value === "&nbsp;" || value === nullString) {
                return null;
            }

            switch ($.trim(value.toString())) {
                case "湖北省":
                    return false;
                case "山西省":
                    return true;
            }

            return value;
        },

        // boolan -> string
        toStr: function (value, culture, format, nullString) {
            return value ? "on" : "off";
        }
    };

    function createColumns(aData) {
        var tempColumns = [];
        for (name in aData) {
            tempColumns.push(name);
        }
        var cols = [];
        if (tempColumns) {
            for (var i = 0; i < tempColumns.length; i++) {
                var c = tempColumns[i];

                var configCol = $.grep(self.wijgridDefaultConfig.colsConfig, function (confCol) {
                    return confCol.dataKey === c;
                });
                var theConfCol = null
                if (configCol && configCol.length) {
                    theConfCol = configCol[0];
                }
                cols.push({
                    dataKey: c,
                    dataType: typeof(aData[c]),

                    headerText: theConfCol ? theConfCol.headerText : c,
                    width: theConfCol ? (theConfCol.columnWidth + 'px') : '60px',

                    cellFormatter: function (args) {
                        if (args.row.type & $.wijmo.wijgrid.rowType.data) {
                            var key = this.dataKey;
                            var currentCol = null;
                            var val = "";
                            $(self.wijgridDefaultConfig.colsConfig).each(function (i, confC) {
                                if (confC.dataKey == key) {
                                    currentCol = confC;
                                    return;
                                }
                            });
                            switch (this.dataType) {
                                case "number":
                                {
                                    if (currentCol) {
                                        switch (currentCol.columnFormate) {
                                            case "0":
                                                val = args.row.data[this.dataKey].toFixed(0);
                                                break;
                                            case "0.0":
                                                val = args.row.data[this.dataKey].toFixed(1);
                                                break;
                                            case "0.00":
                                                val = args.row.data[this.dataKey].toFixed(2);
                                                break;
                                            case "0.000":
                                                val = args.row.data[this.dataKey].toFixed(3);
                                                break;
                                            default:
                                                val = args.row.data[this.dataKey];
                                                break;
                                        }
                                    } else {
                                        val = args.row.data[this.dataKey];
                                    }
                                }
                                    break;
                                case "date":
                                    val = args.row.data[this.dataKey];
                                    break;
                                case "string":
                                    val = args.row.data[this.dataKey];
                                    break;
                            }
                            args.$container
                                .css({"text-align": "center"})
                                .empty()
                                .text(val);
                            return true;
                        }
                    },
                    visible: theConfCol ? theConfCol.visible : true
                });
            }
        }
        return cols;
    }

};//end

/*下拉列表参数更改 _DropDownListID:控件ID,_ParsName:参数名称，_ParsValue：参数值*/
Agi.Controls.DataGridParsChange = function (_DropDownListID, _ParsName, _ParsValue) {
    var ThisControl = Agi.Controls.FindControl(_DropDownListID);
    /*查找到相应的控件*/
    if (ThisControl) {
        ThisControl.Set(_ParsName, _ParsValue);
    }
};

//拖拽控件至编辑页面时，初始控件的方法
Agi.Controls.InitDataGrid = function () {
    return new Agi.Controls.DataGrid();
};

//ColumnChart 自定义属性面板初始化显示
Agi.Controls.DataGridProrityInit = function (DataGrid) {
    var self = DataGrid;
    if (!self.Get('Entity').length) {
        Agi.Controls.DataGridProrityClear(self);
        return;
    }
    var grid = $("#" + self.shell.BasicID);
    var oneData = grid.wijgrid('data')[0];
    var columns = grid.wijgrid('columns');
    //列配置
    //    var aColsConfig = {
    //        dataKey:"",
    //        headerText:"",//显示名称
    //        dataType:"",//数据格式
    //        alarmRule:[],////报警规则
    //        columnWidth:20,//列宽
    //        fontSize:12,//字号
    //        columnColor:"",//列颜色
    //        columnFormate:"",//格式化
    //        visiable:true//是否隐藏
    //        //readDataInterval:0//数据抓取间隔时间
    //    };
    var currentEditCol = null;

    //如果没有列规则 进行一个初始化
    if (!self.wijgridDefaultConfig.colsConfig || !self.wijgridDefaultConfig.colsConfig.length
        || self.chageEntity) {
        self.chageEntity = false;
        self.wijgridDefaultConfig.colsConfig = [];
        for (var i = 0; i < columns.length; i++) {
            var wijCol = columns[i].options;
            var tempCol = {
                dataIndex: wijCol.dataIndex,
                dataKey: wijCol.dataKey,
                headerText: wijCol.headerText, //显示名称
                dataType: wijCol.dataType, //数据格式
                alarmRule: [], ////报警规则
                columnWidth: 60, //列宽
                fontSize: 12, //字号
                fontFamily: 'Microsoft YaHei',
                fontWeight: 'normal',
                columnColor: "transparent", //列颜色
                columnFormate: "", //格式化
                visible: wijCol.visible//是否可见
            }
            self.wijgridDefaultConfig.colsConfig.push(tempCol);
        }
    }

    var ThisProItems = [];
    //    //绑定配置的代码
    //    var bindHTML=null;
    //    bindHTML = $('<form class="form-horizontal">'+
    //        '</form>');
    //    //var entity = DataGrid.Get('Entity');
    //    //是否排序；分组；分页；页面显示条数
    //    $(['排序','分页']).each(function(i,label){
    //        bindHTML.append('<div class="control-group">'+
    //            '<label style="display: block;" class="control-label" for="inputEmail">'+label+'</label>'+
    //            '<div class="controls">'+
    //                '<select type="checkbox" class="input" data-field="'+label+'">' +
    //                 '<option value="true">是</option>'+
    //                 '<option value="false">否</option>'+
    //                '</select>'+
    //            '</div>'+
    //            '</div>');
    //    });
    //    bindHTML.find('select[data-field="排序"]').val(self.wijgridDefaultConfig.allowSorting.toString());
    //    bindHTML.find('select[data-field="分页"]').val(self.wijgridDefaultConfig.allowPaging.toString());
    //    bindHTML.find('select').bind('change',function(e){
    //        var field = $(this).data('field');
    //        if(field=='排序'){
    //            self.wijgridDefaultConfig.allowSorting = $(this).val()=='true'?true:false;
    //            grid.wijgrid("option","allowSorting",self.wijgridDefaultConfig.allowSorting)
    //        }else if(field=='分页'){
    //            self.wijgridDefaultConfig.allowPaging = $(this).val()=='true'?true:false;
    //            grid.wijgrid("option","allowPaging",self.wijgridDefaultConfig.allowPaging)
    //        }
    //    });
    //    //self.wijgridDefaultConfig
    //
    //    $(['显示条数']).each(function(i,label){
    //        bindHTML.append('<div class="control-group">'+
    //            '<label style="display: block;" class="control-label" for="inputEmail">'+label+'</label>'+
    //            '<div class="controls">'+
    //            '<input type="number" min="5" max="15" value="5" class="input" data-field="'+label+'" />'+
    //            '</div>'+
    //            '</div>');
    //    });
    //    bindHTML.find('input[data-field="显示条数"]').val(self.wijgridDefaultConfig.pageSize);
    //    bindHTML.find('input').bind('change',function(e){
    //        var field = $(this).data('field');
    //        if(field=='显示条数'){
    //            var num = $(this).val();
    //            self.wijgridDefaultConfig.pageSize = isNaN(num)?5:parseInt(num);
    //            grid.wijgrid("option","pageSize",self.wijgridDefaultConfig.pageSize)
    //        }
    //    });

    var table = $('#' + self.shell.ID + ' table:eq(0)');
    //1
    var basicPro = $('<div></div>');
    basicPro.load('JS/Controls/DataGrid/DataGridSetting.html #DatagridBasicSetting', function () {
        //初始化值;
        basicPro.find('input[title="排序"]').attr('checked', self.wijgridDefaultConfig.allowSorting ? 'checked' : undefined);
        basicPro.find('input[title="分页"]').attr('checked', self.wijgridDefaultConfig.allowPaging ? 'checked' : undefined);
        basicPro.find('input[title="过滤"]').attr('checked', self.wijgridDefaultConfig.showFilter ? 'checked' : undefined);
        basicPro.find('input[title="每页显示条数"]').val(self.wijgridDefaultConfig.pageSize);
        basicPro.find('input[title="间隔行字体色"]').val(self.wijgridDefaultConfig.customIntervalRowColor);
        basicPro.find('input[title="间隔行背景色"]').val(self.wijgridDefaultConfig.customInvervalRowBgColor);
        if (typeof self.wijgridDefaultConfig.customInvervalRowBgColor === 'object') {
            basicPro.find('div[title="间隔行背景色"]').css(self.wijgridDefaultConfig.customInvervalRowBgColor.value)
                .data('colorValue', self.wijgridDefaultConfig.customInvervalRowBgColor);
        }
        basicPro.find('input[title="冻结列个数"]').val(self.wijgridDefaultConfig.customFreezeColCount);
        basicPro.find('input[title="行字体色"]').val(self.wijgridDefaultConfig.customRowColor);
        basicPro.find('input[title="字体大小"]').val(self.wijgridDefaultConfig.customFontSize);
        basicPro.find('input[title="行背景色"]').val(self.wijgridDefaultConfig.customRowBgColor);
        if (typeof self.wijgridDefaultConfig.customRowBgColor === 'object') {
            basicPro.find('div[title="行背景色"]').css(self.wijgridDefaultConfig.customRowBgColor.value)
                .data('colorValue', self.wijgridDefaultConfig.customRowBgColor);
        }
        basicPro.find('[title="表格线显示"]').val(self.wijgridDefaultConfig.customTableLineModel);
        basicPro.find('input[title="水平线颜色"]').val(self.wijgridDefaultConfig.customHlineColor);
        basicPro.find('input[title="行高度"]').val(self.wijgridDefaultConfig.customRowHeight);
        basicPro.find('input[title="SPC"]').attr('checked', self.wijgridDefaultConfig.spc ? 'checked' : undefined);
        basicPro.find('select[title="滚动条"]').val(self.wijgridDefaultConfig.scrollMode);

        basicPro.find('[title="主题"]').val(self.wijgridDefaultConfig.customTheme);
        basicPro.find('input[title="背景色"]').val(self.wijgridDefaultConfig.customBackgroundColor);
        basicPro.find('[title="显示头部"]').val(self.wijgridDefaultConfig.customHeaderShowModel.toString());

        basicPro.find('input[title="标题颜色"]').val(self.wijgridDefaultConfig.customHeaderColor);
        basicPro.find('input[title="标题背景"]').val(self.wijgridDefaultConfig.customHeaderBgColor);
        if (typeof self.wijgridDefaultConfig.customHeaderBgColor === 'object') {
            basicPro.find('div[title="标题背景"]').css(self.wijgridDefaultConfig.customHeaderBgColor.value)
                .data('colorValue', self.wijgridDefaultConfig.customHeaderBgColor);
        }
        basicPro.find('input[title="垂直线颜色"]').val(self.wijgridDefaultConfig.customVlineColor);
        basicPro.find('[title="数据文本位置"]').val(self.wijgridDefaultConfig.customTextAlign);
        //初始化取色器
        basicPro.find('input[color="color"]').spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {
            }
        });
        //绑定事件处理
        basicPro.find('input,select').bind('change', function (e) {
            var title = $(this).attr('title');
            switch (title) {
                case "排序":
                    self.wijgridDefaultConfig.allowSorting = $(this).attr('checked') == undefined ? false : true;
                    //grid.wijgrid("option", "allowSorting", self.wijgridDefaultConfig.allowSorting);
                    self.Set('Entity', self.Get('Entity'));
                    break;
                case "分页":
                    var bl = self.wijgridDefaultConfig.allowPaging = $(this).attr('checked') == undefined ? false : true;
                    //grid.wijgrid("option","allowPaging",self.wijgridDefaultConfig.allowPaging);
                    if (bl) {
                        self.wijgridDefaultConfig.scrollMode = 'none';
                        //20130327 nipiao 修改武汉bug496，数据表格控件，如果选择滚动条，分页应该变为取消勾选的状态；如果勾选分页，滚动条应该变为无
                        basicPro.find('select[title="滚动条"]').val('none');
                    } else {
                        if (self.isBigData) {
                            AgiCommonDialogBox.Alert('当前控件数据量达到500,强烈建议使用分页显示数据!', null);
                            self.wijgridDefaultConfig.allowPaging = true;
                            $(this).attr('checked', 'checked');
                            return;
                        }

                    }
                    self.Set('Entity', self.Get('Entity'));
                    break;
                case "过滤":
                    self.wijgridDefaultConfig.showFilter = $(this).attr('checked') == undefined ? false : true;
                    grid.wijgrid("option", "showFilter", self.wijgridDefaultConfig.showFilter);
                    break;
                case "每页显示条数":
                    var num = $(this).val();
                    if (num < 5 || num > 15) {
                        return false;
                    }
                    self.wijgridDefaultConfig.pageSize = isNaN(num) ? 5 : parseInt(num);
                    $('#' + self.shell.BasicID).wijgrid("option", "pageSize", self.wijgridDefaultConfig.pageSize);
                    break;
                case "间隔行字体色":
                    self.wijgridDefaultConfig.customIntervalRowColor = $(this).val();
                    $('#' + self.shell.BasicID).find('tbody .wijmo-wijgrid-row:nth-child(even)>td').css('color', self.wijgridDefaultConfig.customIntervalRowColor);
                    break;
                case "间隔行背景色":
                    self.wijgridDefaultConfig.customInvervalRowBgColor = $(this).val();
                    $('#' + self.shell.BasicID).find('tbody .wijmo-wijgrid-row:nth-child(even)>td').css('background-color', self.wijgridDefaultConfig.customInvervalRowBgColor);
                    break;
                case "冻结列个数":
                    var num = $(this).val();
                    num = isNaN(num) ? 0 : parseInt(num);
                    self.wijgridDefaultConfig.customFreezeColCount = num
                    break;
                case "行字体色":
                    self.wijgridDefaultConfig.customRowColor = $(this).val();
                    $('#' + self.shell.BasicID).find('tbody .wijmo-wijgrid-row:nth-child(odd)>td').css('color', self.wijgridDefaultConfig.customRowColor);
                    break;
                case "字体大小":
                    var DilogboxTitle = "您输入的数值不在12-30范围内，将恢复默认值12！";
                    var ThisFontSize = $(this).val();
                    if (ThisFontSize >= 12 && ThisFontSize <= 30) {
                    } else {
                        AgiCommonDialogBox.Alert(DilogboxTitle);
                        $(this).val(12);
                    }

                    //                        return false;
                    //                    }
                    var num = $(this).val();
                    num = isNaN(num) ? 12 : parseInt(num);
                    self.wijgridDefaultConfig.customFontSize = $(this).val();
                    $('#' + self.shell.BasicID).find('tbody .wijmo-wijgrid-row>td').css('font-size', self.wijgridDefaultConfig.customFontSize + 'px');
                    for (var i = 0; i < self.wijgridDefaultConfig.colsConfig.length; i++) {
                        self.wijgridDefaultConfig.colsConfig[i].fontSize = num;
                    }
                    break;
                case "行背景色":
                    self.wijgridDefaultConfig.customRowBgColor = $(this).val();
                    $('#' + self.shell.BasicID).find('tbody .wijmo-wijgrid-row:nth-child(odd)>td').css('background-color', self.wijgridDefaultConfig.customRowBgColor);
                    break;
                case "表格线显示":
                    self.wijgridDefaultConfig.customTableLineModel = $(this).val();
                    switch (self.wijgridDefaultConfig.customTableLineModel) {
                        case "all":
                            $('#' + self.shell.BasicID).find('tbody tr').css('border-width', '');
                            $('#' + self.shell.BasicID).find('tbody td').css('border-width', '');
                            break;
                        case "rows":
                            $('#' + self.shell.BasicID).find('tbody tr').css('border-width', '0px');
                            $('#' + self.shell.BasicID).find('tbody td').css('border-width', '0px');

                            $('#' + self.shell.BasicID).find('tbody tr').css('border-width', '1px');
                            $('#' + self.shell.BasicID).find('tbody td').css('border-top-width', '1px');
                            break;
                        case "cols":
                            $('#' + self.shell.BasicID).find('tbody tr').css('border-width', '0px');
                            $('#' + self.shell.BasicID).find('tbody td').css('border-width', '0px');

                            $('#' + self.shell.BasicID).find('tbody td').css('border-right-width', '1px');
                            break;
                        case "none":
                            $('#' + self.shell.BasicID).find('tbody tr').css('border-width', '0px');
                            $('#' + self.shell.BasicID).find('tbody td').css('border-width', '0px');
                            break;
                    }
                    break;
                case "水平线颜色":
                    self.wijgridDefaultConfig.customHlineColor = $(this).val();
                    $('#' + self.shell.BasicID).find('tbody tr').css('border-top-color', self.wijgridDefaultConfig.customHlineColor);
                    break;
                case "行高度":
                    var num = $(this).val();
                    num = isNaN(num) ? 22 : parseInt(num);
                    if (num < 22 || num > 100) {
                        return false;
                    }
                    self.wijgridDefaultConfig.customRowHeight = num;
                    $('#' + self.shell.BasicID).find('tbody>tr').css('height', num + 'px');
                    break;
                case "滚动条":
                    var scroll = self.wijgridDefaultConfig.scrollMode = $(this).val();
                    if (scroll !== 'none') {
                        if (scroll !== 'horizontal') {
                            if (self.isBigData) {
                                AgiCommonDialogBox.Alert('当前控件数据量达到500,强烈建议不使用滚动条!', null);
                                self.wijgridDefaultConfig.scrollMode = 'none';
                                $(this).val('none');
                                return;
                            }
                        }
                        //update by sunming 2014-01-16 水平滚动条与分页并存
//                        self.wijgridDefaultConfig.allowPaging = false;
//                        //20130327 nipiao 修改武汉bug496，数据表格控件，如果选择滚动条，分页应该变为取消勾选的状态；如果勾选分页，滚动条应该变为无
//                        basicPro.find('input[title="分页"]').attr('checked', false);
                    }
                    self.Set('Entity', self.Get('Entity'));
                    break;
                case "主题":
                    self.wijgridDefaultConfig.customTheme = $(this).val();
                    break;
                case "背景色":
                    self.wijgridDefaultConfig.customBackgroundColor = $(this).val();
                    //alert(self.wijgridDefaultConfig.customBackgroundColor);
                    break;
                case "显示头部":
                    var bl = self.wijgridDefaultConfig.customHeaderShowModel = $(this).val();
                    if (bl != 'true') {
                        if (self.wijgridDefaultConfig.scrollMode === 'none') {
                            $('#' + self.shell.BasicID).find('thead .wijmo-wijgrid-headerrow').hide();
                        } else {
                            self.SwitchHead(false);
                        }
                    } else {
                        if (self.wijgridDefaultConfig.scrollMode === 'none') {
                            $('#' + self.shell.BasicID).find('thead .wijmo-wijgrid-headerrow').show();
                        } else {
                            self.SwitchHead(true);
                        }
                    }
                    break;
                case "标题颜色":
                    self.wijgridDefaultConfig.customHeaderColor = $(this).val();
                    //table.find('thead th>div *').css('color',self.wijgridDefaultConfig.customHeaderColor);
                    var thead = $('#' + self.shell.ID).find('thead:eq(0)');
                    thead.find('th>div *').css('color', self.wijgridDefaultConfig.customHeaderColor);
                    break;
                case "标题背景":
                    self.wijgridDefaultConfig.customHeaderBgColor = $(this).val();
                    //table.find('thead th>div').css('background-color',self.wijgridDefaultConfig.customHeaderBgColor);
                    //table.find('thead th').css('background',self.wijgridDefaultConfig.customHeaderBgColor);
                    var thead = $('#' + self.shell.ID).find('thead:eq(0)');
                    thead.find('th').css('background', self.wijgridDefaultConfig.customHeaderBgColor);
                    break;
                case "垂直线颜色":
                    self.wijgridDefaultConfig.customVlineColor = $(this).val();
                    $('#' + self.shell.BasicID).find('tbody td').css('border-right-color', self.wijgridDefaultConfig.customVlineColor);
                    break;
                case "数据文本位置":
                    var TextAlign = $(this).val();
                    self.wijgridDefaultConfig.customTextAlign = TextAlign == 'default' ? '' : TextAlign;
                    $('#' + self.shell.BasicID).find('tbody td>div').css('text-align', self.wijgridDefaultConfig.customTextAlign);
                    break;
                case "SPC":
                    self.wijgridDefaultConfig.spc = $(this).attr('checked') ? 'true' : false;
                    //self.Set('Entity',self.Get('Entity'));
                    break
            } //end switch
        });

        basicPro.find('div.ControlColorSelPanelSty').bind('click', function () {
            var btn = $(this);
            var currentColor = btn.data('colorValue');
            colorPicker.open({
                disableTabIndex: [],
                defaultValue: !currentColor ? null : currentColor, //这个参数是上一次选中的颜色
                saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                    //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                    btn.css(color.value);
                    //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                    btn.data('colorValue', color);

                    var title = btn.attr('title');
                    switch (title) {
                        case '间隔行背景色':
                            self.wijgridDefaultConfig.customInvervalRowBgColor = color;
                            $('#' + self.shell.BasicID).find('tbody .wijmo-wijgrid-row:nth-child(even)>td').css(color.value);
                            break;
                        case '行背景色':
                            self.wijgridDefaultConfig.customRowBgColor = color;
                            $('#' + self.shell.BasicID).find('tbody .wijmo-wijgrid-row:nth-child(odd)>td').css(color.value);
                            break;
                        case '标题背景':
                            self.wijgridDefaultConfig.customHeaderBgColor = color;
                            $('#' + self.shell.ID).find('thead:eq(0) th,.wijmo-wijgrid-footer').css(color.value);
                            //$('#'+self.shell.BasicID).find('.wijmo-wijsuperpanel-footer').css(color.value);
                            break;
                    } //end switch
                }
            });
        });
    });
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: basicPro }));

    //2
    var dataSetting = $('<div></div>');
    dataSetting.load('JS/Controls/DataGrid/DataGridSetting.html #DatagridBasicSetting2', function () {

        var ul = $('#DatagridBasicSetting2 .colsList');
        var tbody = $('#DatagridBasicSetting2 table tbody');
        //初始化取色器
        dataSetting.find('input[color="color"]').spectrum({
            showInput: true,
            showPalette: true,
            palette: [
                ['black', 'white'],
                ['blanchedalmond', 'rgb(255, 128, 0);'],
                ['hsv 100 70 50', 'red'],
                ['yellow', 'green'],
                ['blue', 'violet']
            ],
            cancelText: "取消",
            chooseText: "选择",
            change: function (color) {

            }
        });
        //初始化值 columns;
        ul.html('');
        $(self.wijgridDefaultConfig.colsConfig).each(function (i, c) {
            $('<li><button style="width: 100%;text-align: left;" class="btn btn-info btn-mini">' + c.dataKey + '</button></li>')
                .appendTo(ul);
        });
        //3

        //列单击
        ul.find('>li>button').bind('click', function (e) {
            tbody.find('input').unbind('change');

            var colName = $(this).text().trim();
            ul.find('>li>button').removeClass('active');
            $(this).addClass('active');
            $(self.wijgridDefaultConfig.colsConfig).each(function (i, c) {
                if (c.dataKey === colName) {
                    currentEditCol = c;
                    return;
                }
            });
            currentEditCol.dataIndex = $(this).parent().index();
            //alert(currentEditCol.dataIndex);
            //初始化UI
            tbody.find('input[title="显示名称"]').val(currentEditCol.headerText);
            tbody.find('input[title="数据格式"]').val(currentEditCol.dataType);
            tbody.find('input[title="列宽"]').val(currentEditCol.columnWidth);
            if (self.wijgridDefaultConfig.customAutoColumnWidth) {
                tbody.find('input[title="自动列宽"]').attr('checked', 'checked');
                tbody.find('input[title="列宽"]').attr('readonly', 'readonly');
            } else {
                tbody.find('input[title="自动列宽"]').removeAttr('checked');
                tbody.find('input[title="列宽"]').removeAttr('readonly');
            }

            tbody.find('input[title="字号"]').val(currentEditCol.fontSize);
            tbody.find('[title="字体样式"]').val(currentEditCol.fontFamily);
            tbody.find('[title="字体加粗"]').val(currentEditCol.fontWeight);
//            tbody.find('input[title="列颜色"]').val(currentEditCol.columnColor).spectrum({
//                showInput: true,
//                showPalette: true,
//                palette: [
//                    ['black', 'white'],
//                    ['blanchedalmond', 'rgb(255, 128, 0);'],
//                    ['hsv 100 70 50', 'red'],
//                    ['yellow', 'green'],
//                    ['blue', 'violet']
//                ],
//                cancelText: "取消",
//                chooseText: "选择",
//                change: function (color) {
//                }
//            });
            var colColorBtn = tbody.find('div[title="列颜色"]');
            if (typeof currentEditCol.columnColor === 'object') {
                colColorBtn.css(currentEditCol.columnColor.value);
            } else {
                colColorBtn.css('background', '#ffffff');
            }
            colColorBtn.bind('click', function () {
                var btn = $(this);
                var currentColor = (typeof currentEditCol.columnColor === 'object') ? currentEditCol.columnColor : null;
                colorPicker.open({
                    disableTabIndex: [],
                    defaultValue: !currentColor ? null : currentColor, //这个参数是上一次选中的颜色
                    saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                        //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                        btn.css(color.value);
                        //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                        //btn.data('colorValue', color);

                        currentEditCol.columnColor = color;
                        var column = $.grep($("#" + self.shell.BasicID).wijgrid("option", "columns"), function (widgetInstance) {
                            return widgetInstance.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            var i = column[0].dataIndex;
                            $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (i + 1) + ')').css(color.value);
                        }
                    }
                });
            });

            switch (currentEditCol.dataType) {
                case "string":
                    var sel = tbody.find('select[title="格式化"]');
                    sel.empty();
                    break;
                case "number":
                    var sel = tbody.find('select[title="格式化"]');
                    sel.empty();
                    $('<option value="0">保留整数</option>').appendTo(sel);
                    $('<option value="0.0">一位小数</option>').appendTo(sel);
                    $('<option value="0.00">两位小数</option>').appendTo(sel);
                    $('<option value="0.000">三位小数</option>').appendTo(sel);
                    break;
                case "date":
                    var sel = tbody.find('select[title="格式化"]');
                    sel.empty();
                    $('<option value="long">长日期型</option>').appendTo(sel);
                    $('<option value="short">短日期型</option>').appendTo(sel);
                    break;
            }
            tbody.find('select[title="格式化"]').val(currentEditCol.columnFormate);

            if (currentEditCol.visible) {
                tbody.find('input[title="是否可见"]').attr('checked', 'checked');
            } else {
                tbody.find('input[title="是否可见"]').removeAttr('checked');
            }

            tbody.find('input,select').change(function (e) {
                var title = $(this).attr('title');
                switch (title) {
                    case "自动列宽":
                        var b = $(this).attr('checked') ? true : false;
                        self.wijgridDefaultConfig.customAutoColumnWidth = b;
                        self.wijgridDefaultConfig.ensureColumnsPxWidth = !b;
                        if (b) {
                            tbody.find('input[title="列宽"]').attr('readonly', 'readonly');
                            $("#" + self.shell.BasicID).wijgrid("option", 'ensureColumnsPxWidth', false);
                        } else {
                            tbody.find('input[title="列宽"]').removeAttr('readonly');
                            $("#" + self.shell.BasicID).wijgrid("option", 'ensureColumnsPxWidth', true);
                        }
                        self.Set('Entity', self.Get('Entity'));
                        break;
                    case "是否可见":
                        currentEditCol.visible = $(this).attr('checked') ? true : false;

                        var column = $.grep(grid.wijgrid("option", "columns"), function (widgetInstance) {
                            return widgetInstance.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            //column[0].element.c1field('option', 'visible', currentEditCol.visible);
                            //column[0].options.visible=currentEditCol.visible;
                            column[0].visible = currentEditCol.visible;
                            $("#" + self.shell.BasicID).wijgrid("doRefresh").css('width', '100%');
                            self.ApplyProperty({ applyControlProperty: false });
                        }
                        break;
                    case "字号":
                        var num = $(this).val();
                        num = isNaN(num) ? 12 : parseInt(num);
                        currentEditCol.fontSize = num;

                        var column = $.grep($("#" + self.shell.BasicID).wijgrid("option", "columns"), function (widgetInstance) {
                            return widgetInstance.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            var i = column[0].dataIndex;
                            $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (i + 1) + ')').css('font-size', currentEditCol.fontSize + 'px');
                        }

                        break;
                    case "字体样式":
                        currentEditCol.fontFamily = $(this).val();
                        var column = $.grep($("#" + self.shell.BasicID).wijgrid("option", "columns"), function (widgetInstance) {
                            return widgetInstance.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            var i = column[0].dataIndex;
                            $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (i + 1) + ')').css('font-family', currentEditCol.fontFamily);
                        }
                        break;
                    case "字体加粗":
                        currentEditCol.fontWeight = $(this).val();
                        var column = $.grep($("#" + self.shell.BasicID).wijgrid("option", "columns"), function (widgetInstance) {
                            return widgetInstance.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            var i = column[0].dataIndex;
                            $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (i + 1) + ')').css('font-weight', currentEditCol.fontWeight);
                        }
                        break;
                    case "列颜色":
                        currentEditCol.columnColor = $(this).val();
                        var column = $.grep($("#" + self.shell.BasicID).wijgrid("option", "columns"), function (widgetInstance) {
                            return widgetInstance.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            var i = column[0].dataIndex;
                            $('#' + self.shell.BasicID + ' tbody>tr td:nth-child(' + (i + 1) + ')').css('background-color', currentEditCol.columnColor);
                        }
                        break;
                    case "格式化":
                        currentEditCol.columnFormate = $(this).val();
                        $("#" + self.shell.BasicID).wijgrid("ensureControl", true);
                        break;
                }


            });
            //event handler
            tbody.find('input').bind('blur', function (e) {
                var title = $(this).attr('title');
                switch (title) {
                    case "显示名称":
                        currentEditCol.headerText = $(this).val().trim();
                        var column = $.grep($('#' + self.shell.BasicID).wijgrid('columns'), function (widgetInstance) {
                            return widgetInstance.options.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            column[0].element.c1field('option', 'headerText', currentEditCol.headerText);
                            $(column[0].element).find('a,span').css('color', self.wijgridDefaultConfig.customHeaderColor);
                        }
                        break;
                    case "数据格式":
                        currentEditCol.dataType = $(this).val().trim();
                        break;
                    case "自动列宽":
                        break;
                    case "列宽":
                        var num = $(this).val().trim();
                        num = isNaN(num) ? 120 : parseInt(num);
                        currentEditCol.columnWidth = num;

                        var column = $.grep($('#' + self.shell.BasicID).wijgrid('columns'), function (widgetInstance) {
                            return widgetInstance.options.dataKey === currentEditCol.dataKey;
                        });
                        if (column && column.length) {
                            column[0].element.c1field('option', 'width', currentEditCol.columnWidth + 'px');
                        }
                        //grid.wijgrid("ensureControl", true);
                        self.Set('Entity', self.Get('Entity'));
                        break;
                    case "列颜色":
                        //                        currentEditCol.columnColor = $(this).val();
                        //                        alert(currentEditCol.columnColor);
                        break;
                    case "格式化":
                        //                        currentEditCol.columnFormate = $(this).val().trim();
                        break;
                    case "是否可见":
                        //                        currentEditCol.visible = $(this).attr('checked') ? true : false;
                        //
                        //                        var column = $.grep(grid.wijgrid('columns'), function (widgetInstance) {
                        //                            return widgetInstance.options.dataKey === currentEditCol.dataKey;
                        //                        });
                        //                        if(column && column.length){
                        //                            //column[0].element.c1field('option', 'visible', currentEditCol.visible);
                        //                            column[0].options.visible=currentEditCol.visible;
                        //                        }
                        break;

                } //end switch
            });
        });
        ul.find('>li>button:eq(0)').click();

        //报警规则-绑定事件
        dataSetting.find('button[title="报警规则"]').bind('click', function (e) {
            var dialogHtml = $("<div id='' title='报警规则' class='hide'></div>");
            var tbody = null;
            $('#DataGridAlarmSettingDialog').remove();
            dialogHtml.load('JS/Controls/DataGrid/DataGridSetting.html #DatagridBasicSetting3', function () {
                var rowHtml = dialogHtml.find('table tbody tr:eq(0)').get(0).outerHTML;
                tbody = dialogHtml.find('table tbody').empty();
                dialogHtml.appendTo($('body:first'));
                dialogHtml.dialog({
                    width: 750,
                    //height: 320,
                    resizable: false,
                    //position:[0,170],
                    autoOpen: true,
                    modal: true,
                    buttons: {
                        "确定": function () {
                            //保存规则
                            if (true) {
                                //currentEditCol.alarmRule = [];
                                $(self.wijgridDefaultConfig.colsConfig).each(function (i, c) {
                                    c.alarmRule = [];
                                });
                                var emptyValue = {
                                    rowIndex: -1,
                                    postionIndex: 1
                                }
                                tbody.find('tr').each(function (i, tr) {
                                    //$(tr).find('[title=""]').val();
                                    var rl = {
                                        dataKey: $(tr).find('[title="报警列"]').val(),
                                        compareOperate: $(tr).find('[title="比较符"]').val(),
                                        compareTyle: $(tr).find('[title="比较类型"]').attr('checked') ? 'column' : 'value',
                                        compareValue: [
                                            $(tr).find('[title="比较值"]').val().trim(),
                                            $(tr).find('[title="比较值2"]').val().trim(),
                                            $(tr).find('[title="比较列"]').val(),
                                            $(tr).find('[title="比较列2"]').val()
                                        ],
                                        alarmColor: $(tr).find('[title="报警颜色"]').data('colorValue')
                                    };
                                    //currentEditCol.alarmRule.push(rl);
                                    if ($(tr).find('[title="比较值"]:visible').length && rl.compareValue[0] === '') {
                                        emptyValue.rowIndex = i + 1;
                                        emptyValue.postionIndex = 1;
                                        return;//跳出循环
                                    }
                                    if ($(tr).find('[title="比较值2"]:visible').length && rl.compareValue[1] === '') {
                                        emptyValue.rowIndex = i + 1;
                                        emptyValue.postionIndex = 2;
                                        return;//跳出循环
                                    }
                                    var tempCol = $.grep(self.wijgridDefaultConfig.colsConfig, function (colC) {
                                        return colC.dataKey === rl.dataKey;
                                    });
                                    if (tempCol && tempCol.length) {
                                        tempCol[0].alarmRule.push(rl);
                                    }
                                }); //end each
                                if (emptyValue.rowIndex >= 0) {
                                    AgiCommonDialogBox.CallBakAlert('请输入比较值:行号[' + emptyValue.rowIndex + ']', '提示', function () {
                                    });
                                } else {
                                    $(this).dialog("close");
                                    grid.wijgrid("ensureControl", true);
                                    self.ApplyAlarmRule();
                                }
                            }
                        },
                        "取消": function () {
                            $(this).dialog("close");
                        }
                    }
                });
                $(dialogHtml).parent().find("button").addClass("btn btn-primary").css("font-size", "12px");

                dialogHtml.parent().attr('id', 'DataGridAlarmSettingDialog');

                if (1 > 0) {
                    tbody.html('');
                    $(self.wijgridDefaultConfig.colsConfig).each(function (i, col) {
                        $(col.alarmRule).each(function (i, rule) {
                            rule.dataKey = rule.dataKey;
                            var tr = $(rowHtml);
                            $(self.wijgridDefaultConfig.colsConfig).each(function (i, c) {
                                $('<option value="' + c.dataKey + '">' + c.dataKey + '</option>')
                                    .appendTo(tr.find('[title="报警列"],[title="比较列"],[title="比较列2"]'));
                            });
                            tr.appendTo(tbody);
                            tr.find('[title="报警列"]').val(rule.dataKey);
                            tr.find('[title="比较符"]').val(rule.compareOperate);
                            tr.find('[title="比较值"]').val(rule.compareValue[0]);
                            tr.find('[title="比较值2"]').val(rule.compareValue[1])
                                .css('display', rule.compareOperate == '介于' ? 'inline-block' : 'none');
                            tr.find('[title="比较列"]').val(rule.compareValue[2]);
                            tr.find('[title="比较列2"]').val(rule.compareValue[3])
                                .css('display', rule.compareOperate == '介于' ? 'inline-block' : 'none');
                            tr.find('[title="报警颜色"]').val(rule.alarmColor);
                            if (typeof rule.alarmColor === 'object') {
                                tr.find('div.ControlColorSelPanelSty').css(rule.alarmColor.value)
                                    .data('colorValue', rule.alarmColor);
                            }

                            if (rule.compareTyle == 'column') {
                                tr.find('[title="比较类型"]').attr('checked', 'checked');
                                tr.find('span[title="列的比较"]').show();
                                tr.find('span[title="值的比较"]').hide();
                            } else {
                                tr.find('[title="比较类型"]').removeAttr('checked');
                                tr.find('span[title="值的比较"]').show();
                                tr.find('span[title="列的比较"]').hide();
                            }
                        }); //for a col rule
                    }); // for colConfig
                    tbody.find('input[color="color"]').spectrum({
                        showInput: true,
                        showPalette: true,
                        palette: [
                            ['black', 'white'],
                            ['blanchedalmond', 'rgb(255, 128, 0);'],
                            ['hsv 100 70 50', 'red'],
                            ['yellow', 'green'],
                            ['blue', 'violet']
                        ],
                        cancelText: "取消",
                        chooseText: "选择",
                        change: function (color) {

                        }
                    });
                    tbody.find('div.ControlColorSelPanelSty').bind('click', function () {
                        var btn = $(this);
                        var currentColor = btn.data('colorValue');
                        colorPicker.open({
                            disableTabIndex: [],
                            defaultValue: !currentColor ? null : currentColor, //这个参数是上一次选中的颜色
                            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                                btn.css(color.value);
                                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                                btn.data('colorValue', color);
                            }
                        });
                    });
                }
                //add row
                $('#' + 'DatagridBasicSetting3 a[title="报警添加"]').unbind().bind('click', function (e) {
                    var aRow = $(rowHtml);
                    //aRow.find('[title="报警列"]').val(currentEditCol.dataKey);

                    $(self.wijgridDefaultConfig.colsConfig).each(function (i, c) {
                        $('<option value="' + c.dataKey + '">' + c.dataKey + '</option>')
                            .appendTo(aRow.find('[title="报警列"],[title="比较列"],[title="比较列2"]'));
                    });


                    aRow.appendTo($('#' + 'DatagridBasicSetting3 table>tbody'));
                    //初始化取色器
                    tbody.find('tr input[color="color"]').spectrum({
                        showInput: true,
                        showPalette: true,
                        palette: [
                            ['black', 'white'],
                            ['blanchedalmond', 'rgb(255, 128, 0);'],
                            ['hsv 100 70 50', 'red'],
                            ['yellow', 'green'],
                            ['blue', 'violet']
                        ],
                        cancelText: "取消",
                        chooseText: "选择",
                        change: function (color) {

                        }
                    });
                    tbody.find('div.ControlColorSelPanelSty').unbind('click').bind('click', function () {
                        var btn = $(this);
                        var currentColor = btn.data('colorValue');
                        colorPicker.open({
                            disableTabIndex: [],
                            defaultValue: !currentColor ? null : currentColor, //这个参数是上一次选中的颜色
                            saveCallBack: function (color) {//这是参数一个回调函数,当用户点击确定后,这里会执行
                                //2:您选中的颜色值会包含在color对象里面,直接使用 color.value 即可
                                btn.css(color.value);
                                //3:将当前选中的颜色值保存到一个地方,以便下次打开面板时,重置界面
                                btn.data('colorValue', color);
                            }
                        });
                    });
                    tbody.find('>tr:last [title="报警列"]').change();
                });
                //delete row
                $('#' + 'DatagridBasicSetting3 table a[title="删除"]').live('click', function (e) {
                    $(this).parent().parent().remove();
                });
                //加判断:如果选择的列是字符串列,只能选==比较
                var selAlarmCol = $('#' + 'DatagridBasicSetting3 table [title="报警列"]');
                var selCompareChar = null;
                selAlarmCol.live('change', function (e) {
                    var val = $(this).val().trim();
                    var tr = $(this).parent().parent();
                    selCompareChar = tr.find('[title="比较符"]');
                    $(self.wijgridDefaultConfig.colsConfig).each(function (i, col) {
                        if (val == col.headerText) {
                            var isDate = self.DateValidate(oneData[val]);
                            if (col.dataType == "string" && !isDate) {
                                selCompareChar.empty().append('<option value="等于">==</option>');
                            } else if (col.dataType !== "string" || isDate) {
                                var oldValue = selCompareChar.val();
                                selCompareChar.empty().append('<option value="等于">==</option><option value="不等于">!=</option><option value="大于">></option><option value="大于或等于">>=</option><option value="小于"><</option><option value="小于或等于"><=</option><option value="介于">>=&<=</option>');
                                selCompareChar.val(oldValue);
                            }
                            return;
                        }
                    });
                });
                $('#' + 'DatagridBasicSetting3 table [title="比较符"]').live('change', function (e) {
                    var val = $(this).val();
                    var tr = $(this).parent().parent();
                    if (val == '介于') {
                        tr.find('[title="比较值2"],[title="比较列2"]').show();
                    } else {
                        tr.find('[title="比较值2"],[title="比较列2"]').hide();
                    }
                });
                $('#' + 'DatagridBasicSetting3 table [title="比较类型"]').live('change', function (e) {
                    var b = $(this).attr('checked') ? true : false;
                    if (b) {//col
                        //$(this).next().text('列');
                        $(this).parent().find('[title="列的比较"]').show();
                        $(this).parent().find('[title="值的比较"]').hide();
                    } else {//val
                        //$(this).next().text('值');
                        $(this).parent().find('[title="值的比较"]').show();
                        $(this).parent().find('[title="列的比较"]').hide();
                    }
                });
                //到这里所有之间保存的报警规则已经初始化完成,并且事件已经绑定
                tbody.find('>tr select[title="报警列"]').change(); //触发一下报警列是字符串的情况下,只选择"等于"比较符
            });

        });
    });


    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据设置", DisabledValue: 1, ContentObj: dataSetting }));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);


    //6.属性禁用、启用处理
    Agi.Controls.Property.PropertyPanelControl.DisabledChanged = function (_item) {
        //        var itemtitle=_item.Title;
        //        if(_item.DisabledValue==0){
        //            itemtitle+="禁用";
        //        }else{
        //            itemtitle+="启用";
        //        }
        //        alert(itemtitle);
    }
};

Agi.Controls.DataGridProrityClear = function (DataGrid) {
    var self = DataGrid;
    var ThisProItems = [];
    //1
    var basicPro = $('<div><span>请为控件添加数据!</span></div>');
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "基本设置", DisabledValue: 1, ContentObj: basicPro }));
    //2
    var dataSetting = $('<div><span>请为控件添加数据!</span></div>');
    ThisProItems.push(new Agi.Controls.Property.PropertyItem({ Title: "数据设置", DisabledValue: 1, ContentObj: dataSetting }));

    Agi.Controls.Property.PropertyPanelControl.InitPanel(ThisProItems);
};
