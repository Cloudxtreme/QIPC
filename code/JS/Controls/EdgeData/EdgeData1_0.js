/*
 project qpc of sgai
 EdgeData controls JS v1.0 (2014-01-13)
 author liuxing
 
 
 dependency:
 	jQuery v1.7 or above
 	jqGrid v4.0 or above
 	ui.jqgrid.css
 	jquery-ui.css
 file list:
 	img/left.png
 	img/right.png
 	EdgeData1_0.css
 	EdgeDataDefault1_0.js
 
 version info:
 	2014-01-19:update to v1.1
 		add grid pager bar to show page information and switch page num
 */
/**
 * 边降控件初始化方法.
 * 
 * @returns {EdgeData}
 */
EdgeData = function() {
	this._init.apply(this, arguments);
	this._paint.apply(this, arguments);
	return this;
};
EdgeData.prototype = {
	/**
	 * 设置空间宽度&高度
	 * 
	 * @param width宽度值(px)
	 * @param height高度值(px)
	 */
	setSize : function(width, height) {
		var maindiv = this._layer.maindiv;

		maindiv.width(width).height(height);// 设置容器框架高度(子div会自适应)
		this._opt.width = width;
		this._opt.height = height;
		this._setGridSize();// 设置jqgrid高宽(宽度可以直接设置为父容器宽度,高度必须计算差值)
		this._setChartSize();// 设置chart高宽
		this._setNavPos();
	},
	setYAxisRange : function(setting) {
		var thisobj = this, chart = thisobj._layer.chart;
		if (setting) {
			thisobj._clearStdLine();
			var opt = {
				'max' : setting.max,
				'min' : setting.min
			};
			chart.yAxis[0].update(opt);
			thisobj._editStdLine();
		}
	},
	setStdLineOption : function(setting) {
		var opt = this._opt;
		var lineids = [ 'top', 'bottom' ];
		$.each(lineids, function(idx, val) {
			opt[val + 'stdval'] = setting[val + 'val'];
			opt[val + 'stdcolor'] = setting[val + 'color'];
			opt[val + 'stdwidth'] = setting[val + 'width'];
			opt[val + 'stdvisible'] = setting[val + 'visible'];
		});

		this._savePointColor(opt.topstdcolor, opt.bottomstdcolor,
				opt.stdregularcolor);
		this._editStdLine();
	},
	// 将接收的颜色设置保存到opt的缓存字段中
	_savePointColor : function(over, below, regular) {
		var opt = this._opt;
		opt.stdovercolor = over;
		opt.stdbelowcolor = below;
		opt.stdregularcolor = regular;
	},
	// 更新了标准线设置后,要更新点的颜色
	_updatePointStdStatus : function() {
		var thisobj = this, chart = thisobj._layer.chart;
		var opt = thisobj._opt;
		var seriesdata = chart.series[0].options.data;
		var topstd = opt['topstdvisible'] ? (typeof opt['topstdval'] == 'number' ? opt['topstdval']
				: parseFloat(opt['topstdval']))
				: Number.POSITIVE_INFINITY, bottomstd = opt['bottomstdvisible'] ? 
						(typeof opt['bottomstdval'] == 'number' ? opt['bottomstdval']
				: parseFloat(opt['bottomstdval']))
				: Number.NEGATIVE_INFINITY;
		for ( var pidx = 0; pidx < seriesdata.length; pidx++) {
			var sdata = typeof seriesdata[pidx]=='number'?seriesdata[pidx]:seriesdata[pidx].y;
			if (sdata > topstd) {// 超出范围的点
				thisobj._updatePointColor(pidx, opt.stdovercolor);
			} else if (sdata < bottomstd) {
				thisobj._updatePointColor(pidx, opt.stdbelowcolor);
			} else {
				thisobj._updatePointColor(pidx, opt.stdregularcolor);
			}
		}
		chart.redraw();
	},
	// highchart更新点颜色API封装
	_updatePointColor : function(idx, color) {
		var thisobj = this, chart = thisobj._layer.chart;
		var data = {
			'marker' : {
				'fillColor' : color,
				'states':{'hover':{'fillColor':color}}
			},
			'color' : color
		};
		chart.series[0].data[idx].update(data, false);
	},
	/**
	 * 设置标准线
	 * 
	 * @param setting
	 *            参数格式约定如下 { "topcolor":"#f5ff00", "topvisible":true,
	 *            "topval":"100", "topwidth":"4", "bottomcolor":"#06f306",
	 *            "bottomvisible":false, "bottomval":"-50", "bottomwidth":"1" }
	 */
	_editStdLine : function() {
		this._clearStdLine();
		this._addStdLine();
	},
	_clearStdLine : function() {
		var thisobj = this, chart = thisobj._layer.chart, opt = thisobj._opt;
		var lineids = [ 'top', 'bottom' ];
		$.each(lineids, function(idx, val) {
			if (opt[val + 'LineExist']) {
				chart.yAxis[0].removePlotLine(opt[val + 'LineId']);
			}
		});
	},
	_addStdLine : function() {
		var thisobj = this, chart = thisobj._layer.chart, opt = thisobj._opt;
		var lineids = [ 'top', 'bottom' ];
		$.each(lineids, function(idx, val) {
			if (opt[val + 'stdvisible']) {
				if (!opt[val + 'LineId']) {
					opt[val + 'LineId'] = thisobj._idGenerator() + '_std_'
							+ val;
				}
				chart.yAxis[0].addPlotLine({
					value : opt[val + 'stdval'],
					color : opt[val + 'stdcolor'],
					width : opt[val + 'stdwidth'],
					id : opt[val + 'LineId'],
					dashStyle : opt[val + 'LineDash'],
					label : {
						text : opt[val + 'stdval'],
						align : 'right',
						x : -10,
						style : {
							color : opt[val + 'stdcolor'],
							fontWeight : 'bold'
						}
					}
				});
				opt[val + 'LineExist'] = true;
			}
		});
		thisobj._updatePointStdStatus();
	},
	/**
	 * 设置highchart图表x周文字显示(x周被业务定义为显示时间,时间是数据集元素的第一列)
	 * 
	 * @param xtitle
	 */
	setChartXAxisTitle : function(xtitle) {
		var chart = this._layer.chart;
		chart.xAxis[0].setTitle({
			'text' : xtitle
		});
	},
	/**
	 * 接受新数据,更新两部分图表的显示
	 * 
	 * @param datas
	 */
	setDatas : function(datas, pager) {
		var thisobj = this;
		thisobj._data = datas || [];// 缓存接口数据
		thisobj._pager = $.extend(thisobj._pager, pager);// 缓存分页信息
		thisobj._formatInterfaceData(thisobj._data);
		thisobj._updateData();
		thisobj._opt.hasDataSet = true;
		thisobj._editStdLine();
	},
	// 参数缓存 { container:'字符串,容器的id', width:npx, height:npx,tableid:grid表格控件id }
	_opt : {},
	_defaultopt : {
		verticalMargin : 5,// 水平方向与控件之间的间隔
		gridHeaderHeight : 54,// jqgrid表头所占的高度
		gridPagerHeight : 27,// jqgrid分页控件所占的高度
		pagelimitlist : [ 10, 20, 50, 100 ],// 每页显示行数下拉菜单默认的选项集合
		hasDataSet : false,// 是否已经绑定了dataset
		topLineExist : false,
		bottomLineExist : false,
		topLineId : null,
		bottomLineId : null,
		topLineDash : 'ShortDash',
		bottomLineDash : 'ShortDash',
		stdovercolor : 'red',// 超出标准线上限的点颜色
		stdbelowcolor : 'yellow',// 低于标准线下线的点颜色
		stdregularcolor : '#2F7ED8'// 在标准线设定范围内的点颜色
	// 表格控件表头所占高度
	},// 默认设置
	_data : [],
	// 分页信息 { totalrow:总行数, pagenum:当前页码, pagelimit:每页行数, totalpage:总页数 }
	_pager : {
		pagenum : 1,
		pagelimit : 10
	},
	// 格式化之后用于显示的数据
	// {
	// highchart:[{name:xxx,data:[1,2,3,4,5]},...],
	// jqgrid:[{col1:1,col2:2,...},...],
	// colnames:[name1,name2,....],
	// gridColModel:[{name:xxx,index:xxx,width:80},...],
	// }
	_viewData : {},
	_layer : {},// 图形对象引用缓存
	_datacol : {// 数据集列名规则(列所在位置)
		time : 1,
		length : 2
	},
	_selectedrow : -1,// 当前选中的行信息
	// 初始化数据,合并用户和默认设置
	_init : function(option) {
		this._opt = $.extend(this._defaultopt, option);
		this._pager = {
			totalrow : 10,
			pagenum : 1,
			pagelimit : 10,
			totalpage : 1
		};
		this._data = edgedata_default_data || [];
		this._formatInterfaceData(this._data);
	},
	// 添加图像
	_paint : function() {
		this._addLayer();
	},
	// 添加div框架
	_addLayer : function() {
		var thisobj = this;
		var container = $('#' + thisobj._opt.container); // 容器

		if (container.length <= 0) {
			if (console && typeof console.log == 'function') {
				console.log('There is no element with ID:['
						+ thisobj._opt.container
						+ '].EdgeData will not render.');
			}
			return;
		}

		// measure the container size,cache it to option variables
		thisobj._opt.width = container.innerWidth();
		thisobj._opt.height = container.innerHeight();

		var maindiv = $('<div>').addClass('edgedata'), // 内层容器
		chartdiv = $('<div>').addClass('edgedatasubContainer').attr('id',
				thisobj._opt.container + '_chartdiv'), // 图表容器
		tablediv = $('<div>').addClass('edgedatasubContainer');// 表格容器

		container.append(maindiv.append(chartdiv).append(tablediv));

		thisobj._layer.chartdiv = chartdiv;
		thisobj._layer.tablediv = tablediv;
		thisobj._layer.maindiv = maindiv;// 缓存容器引用
		thisobj._addHighchart(chartdiv);// 在图表容器中初始化图表
		thisobj._addJqueryGrid();// 在表格容器中初始化表格
		thisobj._addPageNavigator(maindiv);// 在图标左右两侧添加翻页控件
		thisobj._editStdLine();// 添加标准线
	},
	// 在表格容器中添加一个源生table供jqgrid构建grid
	_addTableGrid : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var tableele = $('<table>').prop('id', genid);
		var tablediv = thisobj._layer.tablediv;
		tablediv.append(tableele);

		thisobj._addGridPager(genid);

		return tableele;
	},
	_addGridPager : function(genid) {
		var thisobj = this;

		var pageText = "Page ";
		var idextra = "_pager", pgextra = "_pg";
		var pagerContainerId = genid + idextra;// 分页控件容器ID
		var pagerContainer = $('<div>').prop('id', pagerContainerId).addClass(
				'ui-state-default ui-jqgrid-pager ui-corner-bottom');

		var pagerHolderId = genid + pgextra;// 分页控件子容器,用意不明(无用的层级div),暂保留
		var pagerHolder = $('<div>').prop('id', pagerHolderId).addClass(
				'ui-pager-control');
		pagerContainer.append(pagerHolder);

		var maintable = $('<table cellspacing="0" cellpadding="0" border="0">')
				.addClass('ui-pg-table').css({
					'width' : '100%',
					'table-layout' : 'fixed',
					'height' : '100%'
				});// 主table
		pagerHolder.append(maintable);
		var maintabletr = $('<tr>');// 主table唯一的tr
		maintable.append(maintabletr);

		var maintableLeftTd = $('<td>').prop('id', genid + '_left').css(
				'align', 'left');// 左边的TD
		maintabletr.append(maintableLeftTd);
		var leftTdTable = $('<table cellspacing="0"cellpadding="0" border="0">')
				.addClass('ui-pg-table navtable').css({
					'float' : 'left',
					'table-layout' : 'auto'
				});// 左边TD包含的table
		maintableLeftTd.append(leftTdTable);
		var leftTdTableTr = $('<tr>');// 左边TD包含的table的唯一一个TR
		leftTdTable.append(leftTdTableTr);// 这个地方原来是用来放工具栏的,目前不做处理,保持空白

		var maintableCenterTd = $('<td align="center">').prop('id',
				genid + '_center').css({
			'white-space' : 'pre',
			'width' : '247px',
			'overflow' : 'hidden'
		});// 中间的TD,用来放分页按钮
		maintabletr.append(maintableCenterTd);
		var centerTdTable = $(
				'<table cellspacing="0" cellpadding="0" border="0">').addClass(
				'ui-pg-table').css('table-layout', 'auto');// 中间的TD包含的唯一一个Table
		maintableCenterTd.append(centerTdTable);
		var centerTdTableTr = $('<tr>');
		centerTdTable.append(centerTdTableTr);

		// TODO 点击跳转到第一页的按钮需要判断当前是否是第一页,如果是,添加样式ui-state-disabled
		var centerTableFirstTd = $('<td>').prop('id', 'first_' + genid)
				.addClass('ui-pg-button ui-corner-all')
				.css('cursor', 'default');// 点击跳转到第一页的按钮
		centerTdTableTr.append(centerTableFirstTd);
		var firstTdSpan = $('<span>').addClass('ui-icon ui-icon-seek-first');// 第一页的图标
		centerTableFirstTd.append(firstTdSpan);

		// TODO 点击跳转到前一页的按钮需要判断是否是第一页,如果是,添加样式ui-state-disabled
		var centerTablePrevTd = $('<td>').prop('id', 'prev_' + genid).addClass(
				'ui-pg-button ui-corner-all').css('cursor', 'default');// 跳转到前一页的按钮
		centerTdTableTr.append(centerTablePrevTd);
		var prevTdSpan = $('<span>').addClass('ui-icon ui-icon-seek-prev');// 上一页的图标
		centerTablePrevTd.append(prevTdSpan);

		var centerTableSparTd = $('<td class="ui-pg-button ui-state-disabled"'
				+ 'style="width: 4px; cursor: default;"><span'
				+ 'class="ui-separator"></span></td>');// 分隔各个图标之间的空白td
		centerTdTableTr.append(centerTableSparTd);

		var centerTablePageTd = $('<td>');// 显示当前页数,提供选择显示页码的input的容器TD
		centerTdTableTr.append(centerTablePageTd);
		centerTablePageTd.append(pageText);
		// TODO 选择页码的input,需要缓存引用,提供刷新显示值的方法
		var pageInput = $(
				'<input type="text" size="2" maxlength="7" value="0">')
				.addClass('ui-pg-input').prop('id', 'currpgnum_' + genid);// 提供选择页码的input
		centerTablePageTd.append(pageInput);
		centerTablePageTd.append(' of ');
		// TODO 显示总页数的span,需要初始化数值
		var totalPageSpan = $('<span>').prop('id', 'sp_1_' + genid);
		centerTablePageTd.append(totalPageSpan);
		// totalPageSpan.html('2');

		centerTdTableTr.append(centerTableSparTd);// 分隔各个图标之间的空白td

		// TODO 需要初始化disabled
		var centerTableNextTd = $('<td>').prop('id', 'next_' + genid).addClass(
				'ui-pg-button ui-corner-all').css('cursor', 'default');// 点击翻到下一页的按钮
		centerTdTableTr.append(centerTableNextTd);
		var nextTdSpan = $('<span>').addClass('ui-icon ui-icon-seek-next');// 翻到下一页的图标
		centerTableNextTd.append(nextTdSpan);

		// TODO 需要初始化disabled
		var centerTableLastTd = $('<td>').prop('id', 'last_' + genid).addClass(
				'ui-pg-button ui-corner-all').css('cursor', 'default');// 点击翻到最后一页的按钮
		centerTdTableTr.append(centerTableLastTd);
		var lastTdSpan = $('<span>').addClass('ui-icon ui-icon-seek-end');// 翻到最后一页的图标
		centerTableLastTd.append(lastTdSpan);

		// TODO 需要初始化下拉菜单
		var centerTablePnTd = $('<td>');// 提供选择每页显示条数的td
		centerTdTableTr.append(centerTablePnTd);
		var centerTdPnSelect = $('<select style="width:4em">').addClass(
				'ui-pg-selbox').prop('id', 'pglimit_' + genid);
		centerTablePnTd.append(centerTdPnSelect);

		var maintableRightTd = $('<td align="right">').prop('id',
				genid + '_right');// 最右边用于显示分页信息的td
		maintabletr.append(maintableRightTd);
		var rightTdDiv = $('<div>').css({
			'text-align' : 'right',
			'white-space' : 'nowrap',
			'overflow' : 'hidden'
		}).addClass('ui-paging-info').prop('id', 'pageinfo_' + genid);
		maintableRightTd.append(rightTdDiv);

		var tablediv = thisobj._layer.tablediv;
		thisobj._layer.pagerdiv = pagerContainer;
		tablediv.append(pagerContainer);

		thisobj._setPagerBtnStatus();
		thisobj._setPagerBtnCss();
		thisobj._setPagerText();
		thisobj._setPagerNumVal();
		thisobj._setPagerExtendText();
		thisobj._bindPagerBtnEvent();
		thisobj._bindPagerInputEvent();
		thisobj._addOptToPageLimitSelector();
		thisobj._bindPagerLimitEvent();
	},
	// 绑定每页显示行数的变更事件
	_bindPagerLimitEvent : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pager = thisobj._pager;
		var pglimit = $('#pglimit_' + genid);
		pglimit.change(function() {// 每页显示行数变化时,默认显示第一页
			if (thisobj._opt.hasDataSet) {
				thisobj._opt.parentControl.ReadPage(1, $(this).val(), 1,
						pager.totalpage);
			} else {
				if (AgiCommonDialogBox && AgiCommonDialogBox.Alert) {
					AgiCommonDialogBox.Alert('请先绑定数据集,再设置每页行数值.');
				}
			}
		});
	},
	// 初始化每页行数下拉菜单
	_addOptToPageLimitSelector : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pager = thisobj._pager;
		var pglimit = $('#pglimit_' + genid);
		$.each(thisobj._opt.pagelimitlist, function(idx, val) {
			var opt = $('<option>').val(val).text(val);
			if (val == pager.pagelimit) {
				opt.prop('selected', 'selected');
			}
			pglimit.append(opt);
		});
	},
	// 页码输入框enter事件绑定
	_bindPagerInputEvent : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pager = thisobj._pager;
		var currpgnum = $('#currpgnum_' + genid);
		currpgnum.click(function() {
			this.select();
		});
		currpgnum.keypress(function(evt) {
			if (evt.keyCode == 13) {// enter键被按下
				var pagenumtobe = parseInt($(this).val());
				if (isNaN(pagenumtobe) || pagenumtobe <= 0
						|| pagenumtobe > pager.totalpage) {
					if (AgiCommonDialogBox && AgiCommonDialogBox.Alert) {
						AgiCommonDialogBox.Alert('请输入一个有效数字');
					}
				} else {
					if (pagenumtobe != pager.pagenum) {
						thisobj._opt.parentControl.ReadPage(pager.pagenum,
								pager.pagelimit, pagenumtobe, pager.totalpage);
					}
				}
			}
		});
	},
	// 第一页,前一页,下一页,最后一页 4个按钮的点击事件绑定
	_bindPagerBtnEvent : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pagerContainer = thisobj._layer.pagerdiv, pager = thisobj._pager;
		var btnidPrefixes = [ 'first_', 'prev_', 'next_', 'last_' ];
		$.each(btnidPrefixes, function(idx, prefix) {
			var btn = $('#' + prefix + genid);
			btn.click(function() {
				if (thisobj._isPagerBtnDisabled(this))
					return;// 不可用时不执行任何操作
				var pagenumaddtion = 0;
				if (prefix == 'first_') {
					pagenumtobe = 1;
				} else if (prefix == 'prev_') {
					pagenumtobe = pager.pagenum - 1;
				} else if (prefix == 'next_') {
					pagenumtobe = pager.pagenum + 1;
				} else if (prefix == 'last_') {
					pagenumtobe = pager.totalpage;
				}
				thisobj._opt.parentControl.ReadPage(pager.pagenum,
						pager.pagelimit, pagenumtobe, pager.totalpage);
			});
		});
	},
	_isPagerBtnDisabled : function(btn) {
		return $(btn).hasClass('ui-state-disabled');
	},
	// 设定分页控件文本框后边的固定文字(显示总页数)
	_setPagerExtendText : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pager = thisobj._pager;
		var totalpagetext = $('#sp_1_' + genid);
		totalpagetext.html(pager.totalpage);
	},
	// 设定分页控件显示当前页码的文本框值
	_setPagerNumVal : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pager = thisobj._pager;
		var currpgnum = $('#currpgnum_' + genid);
		currpgnum.val(pager.pagenum);
	},
	// 分页控件最右侧的分页信息文字
	_setPagerText : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pager = thisobj._pager;
		var pagerinfo = $('#pageinfo_' + genid);
		var lastrow = pager.pagelimit * pager.pagenum;
		lastrow = lastrow > pager.totalrow ? pager.totalrow : lastrow;
		var infotext = "View " + (pager.pagelimit * (pager.pagenum - 1) + 1)
				+ " - " + lastrow + " of " + pager.totalrow
				+ " rows&nbsp;&nbsp;&nbsp;";
		pagerinfo.html(infotext);
	},
	// 设置分页控件按钮状态
	_setPagerBtnStatus : function() {
		var thisobj = this;
		var genid = thisobj._idGenerator();
		var pagerContainer = thisobj._layer.pagerdiv, pager = thisobj._pager;
		var firstbtn = pagerContainer.find('#first_' + genid), prevbtn = pagerContainer
				.find('#prev_' + genid), nextbtn = pagerContainer.find('#next_'
				+ genid), lastbtn = pagerContainer.find('#last_' + genid);
		if (pager.pagenum == 1) {// 当前页数是第一页时:跳到首页&前一页的按钮不可用
			firstbtn.addClass('ui-state-disabled');
			prevbtn.addClass('ui-state-disabled');
		}
		if (pager.pagenum == pager.totalpage) {// 当前页数是最后一页时:跳到尾页&下一页的按钮不可用
			nextbtn.addClass('ui-state-disabled');
			lastbtn.addClass('ui-state-disabled');
		}
	},
	// 根据分页控件按钮状态设置他们的css样式
	_setPagerBtnCss : function() {
		var thisobj = this;
		var pagerContainer = thisobj._layer.pagerdiv;
		var genid = thisobj._idGenerator();
		var pgextra = "_pg", pgcnt = genid + pgextra;
		pagerContainer.find(".ui-pg-button", "#" + pgcnt).hover(function() {
			if ($(this).hasClass('ui-state-disabled')) {
				this.style.cursor = 'default';
			} else {
				$(this).addClass('ui-state-hover');
				this.style.cursor = 'pointer';
			}
		}, function() {
			if (!$(this).hasClass('ui-state-disabled')) {
				$(this).removeClass('ui-state-hover');
				this.style.cursor = "default";
			}
		});
	},
	// 生成一個唯一的tableid(或者读取之前生成的)
	_idGenerator : function() {
		if (!this._opt.tableid) {
			this._opt.tableid = ('edgedatatable' + new Date().getTime());
		}
		return this._opt.tableid;
	},
	// 添加highchart图表
	_addHighchart : function(chartdiv) {
		var thisobj = this;
		var chartopt = {
			chart : {
				type : 'line',
				renderTo : chartdiv[0],// 设置绘制图表的父元素(只能是源生对象)
				marginRight : 50,
				marginLeft : 70,
				marginBottom : 25,
				plotBorderWidth:1,//图形边框宽度
				plotBorderColor:'silver'//图形边框颜色
			},
			credits : {// 去掉右下角超链接标签
				enabled : false
			},
			title : {// 去掉标题显示
				text : null,
			},
			/*
			 * plotOptions: { series: { marker: { enabled: true } } },
			 */
			xAxis : {
				labels : {
					enabled : false
				},
				title : {
					enabled : true,
					align : 'high',// x轴将文字显示在x周的最右端
					text : thisobj._viewData.highchart[0].name
				}
			/*
			 * , categories: edgedata_chart_sortedcol
			 */
			},
			yAxis : {
				title : {
					enabled : false
				},
				max : thisobj._opt.range_max,
				min : thisobj._opt.range_min
			},
			tooltip : {
				formatter : function() {// edgedata_chart_sortedcol为预定义的列名顺序
					var s = '<b>' + thisobj._viewData.colnames[this.x + 2]
							+ '</b>' + ': ' + this.y;
					return s;
				}
			},
			legend : {// 关闭图例
				enabled : false
			},
			series : [ {
				data : {}
			/* thisobj._viewData.highchart[0].data */} ]
		};

		var chart = new Highcharts.Chart(chartopt);
		// 缓存图表引用
		this._layer.chart = chart;
	},
	// 添加jqgrid表格
	_addJqueryGrid : function() {
		var thisobj = this;
		var tableele = thisobj._addTableGrid();
		tableele.jqGrid({
			datatype : "local",
			height : tableele.parent().innerHeight(),
			// width : tableele.parent().innerWidth(),
			autowidth : true,
			colNames : thisobj._viewData.colnames,
			colModel : thisobj._viewData.gridColModel,// 写死的列设置
			caption : "数据明细",
			rownumbers : true,// 显示行号
			rowList : [ 10, 20, 50, 100, 500 ],// 分页控件上供选择的每页行数
			// pager:'#'+thisobj._idGenerator()+"_pager",//分页控件容器ID
			cmTemplate : {
				sortable : false
			},// 定义所有表头适用的设置项,sortable:false定义所有表头不支持排序
			shrinkToFit : false,// 列宽是否自适应,设置成false后列宽保持不变,表格宽度大于父框架后能出现横向滚动条
			headertitles : true,// 表头tooltip提示
			hidegrid : false,// 是否显示显示隐藏表格按钮
			onSelectRow : function(id) {
				thisobj._setSelectedRow(parseInt(id));
			}
		});
		tableele.jqGrid('bindKeys', true);// 奇特的语法,设置表格接受按键操作(上下箭头键切换选中行)
		// 缓存表格引用
		thisobj._layer.grid = tableele;
		thisobj._addJqgridRow();// 添加数据行显示
		thisobj._setInitialSelectedRow();
		thisobj._calculateGridHeaderHeight();
		thisobj._setGridSize();
	},
	_setInitialSelectedRow : function() {
		this._layer.grid.setSelection(1, true);
		this._selectedrow = 1;
	},
	// 计算jqgrid表头和分页控件在当前环境下所占的高度
	_calculateGridHeaderHeight : function() {
		var grid = this._layer.grid;
		var gview = $('#gview_' + grid.attr('id'));
		if (gview.length > 0)
			this._opt.gridHeaderHeight = gview.innerHeight()
					- gview.children().eq(2).height();

		var pager = $('#' + this._idGenerator() + '_pager');
		if (pager.length > 0) {
			this._opt.gridPagerHeight = pager.outerHeight(true);
		}
	},
	// 添加左右翻页控件
	_addPageNavigator : function(maindiv) {
		var leftdiv = $('<div>').addClass(
				'edgedata_arrow_div edgedata_left_btn'), rightdiv = $('<div>')
				.addClass('edgedata_arrow_div edgedata_right_btn');
		maindiv.append(leftdiv).append(rightdiv);
		this._layer.leftNav = leftdiv;
		this._layer.rightNav = rightdiv;
		this._setNavPos();
		this._bindNavClickEvt();
		this._addNavigatorFadeEffect();
	},
	// 左右翻页控件淡入淡出
	_addNavigatorFadeEffect : function() {
		this._layer.maindiv.find('.edgedata_arrow_div').bind(
				'mouseenter mouseout', function(evt) {
					var opacity = 0;
					if (evt.type == 'mouseenter')
						opacity = 1;
					else if (evt.type == 'mouseout')
						opacity = 0;
					$(this).stop(true).animate({
						'opacity' : opacity
					}, 1000);
				});
	},
	// 设置翻页控件的绝对位置
	_setNavPos : function() {
		var leftdiv = this._layer.leftNav, rightdiv = this._layer.rightNav;
		var verticalMargin = this._opt.verticalMargin;
		var tWidth = this._opt.width, tHeight = this._opt.height;
		var leftPos = {
			'left' : verticalMargin,
			'top' : (tHeight / 2 - 80) / 2
		}, rightPos = {
			'left' : tWidth - verticalMargin - 30,
			'top' : (tHeight / 2 - 80) / 2
		};
		leftdiv.css(leftPos);
		rightdiv.css(rightPos);
	},
	_bindNavClickEvt : function() {
		var thisobj = this;
		var leftdiv = this._layer.leftNav, rightdiv = this._layer.rightNav;
		leftdiv.click(function() {
			thisobj._navClick('left');
		});
		rightdiv.click(function() {
			thisobj._navClick('right');
		});
	},
	_navClick : function(direction) {
		var thisobj = this, pager = thisobj._pager, pagelimit = pager.pagelimit;
		var selectedRow = thisobj._selectedrow;
		var numaddition = direction == 'left' ? -1 : 1;
		var numTobe = selectedRow + numaddition;

		if (numTobe <= 0
				|| numTobe > pagelimit
				|| (pager.pagenum == pager.totalpage
						&& pager.totalrow % pager.pagelimit != 0 && numTobe > pager.totalrow
						% pager.pagelimit)) {
			// 翻到下一页
			thisobj._opt.parentControl.ReadPage(pager.pagenum, pager.pagelimit,
					pager.pagenum + numaddition, pager.totalpage);
		} else {
			thisobj._setGridSelection(numTobe);
		}
	},
	// 设置控件当前选中的数据行
	_setSelectedRow : function(rowid) {
		var rownum = parseInt(rowid), thisobj = this;
		if (thisobj._selectedrow == rownum)
			return;// 重复选中不做任何操作
		thisobj._selectedrow = rownum;
		thisobj._formatSingleData(thisobj._data[rownum - 1]);
		thisobj._updateChartView();
	},
	// 格式化单行选中的数据供highchart使用
	_formatSingleData : function(singlerow) {
		var thisobj = this;
		if (!singlerow)
			return;
		var keyindex = 1, chartdata = {
			name : '',
			data : []
		};
		for ( var key in singlerow) {
			var datacolCount = this._viewData.colnames.length;
			var srcdataMidPoint = datacolCount / 2 + 2, endpointCalcu = 1.5 * datacolCount - 1;
			var val = singlerow[key];
			if (keyindex == thisobj._datacol.time) {
				chartdata.name += ((chartdata.name == '' ? '' : ' ') + (key
						+ ':' + val));
			} else if (keyindex == thisobj._datacol.length) {
				chartdata.name += ((chartdata.name == '' ? '' : ' ') + (key
						+ ':' + val));
			} else {
				if (typeof val == 'string') {
					val = parseFloat(val);
				}
				if (keyindex >= srcdataMidPoint) {
					chartdata.data[endpointCalcu - keyindex] = val;
				} else {
					chartdata.data[keyindex - 3] = val;
				}
			}
			keyindex++;
		}
		thisobj._viewData.highchart = [ chartdata ];
	},
	// 根据格式化数据添加表格行显示
	_addJqgridRow : function() {
		var griddata = this._viewData.jqgrid, tableele = this._layer.grid;
		// tableele.setGridParam('data',griddata).trigger('reloadGrid');
		for ( var i = 0; i <= griddata.length; i++)
			tableele.jqGrid('addRowData', i + 1, griddata[i]);
	},
	// 设置某行为grid的选中行
	_setGridSelection : function(rowid) {
		var grid = this._layer.grid;
		grid.setSelection(rowid);
	},
	// jqgrid表格部分高度是容器高度减去表头和分页栏的高度
	_getGridNoHeaderHeight : function(height) {
		return height - this._opt.gridHeaderHeight - this._opt.gridPagerHeight
				- 2;
	},
	// 设置表格高&宽
	_setGridSize : function() {
		var thisobj = this;
		var grid = thisobj._layer.grid, tablediv = this._layer.tablediv;
		grid.setGridHeight(thisobj._getGridNoHeaderHeight(tablediv
				.innerHeight()));// 减去固定表头的高度
		grid.setGridWidth(tablediv.innerWidth());
		thisobj._layer.pagerdiv.width(tablediv.innerWidth());
	},
	// 设置图表高&宽
	_setChartSize : function() {
		var chart = this._layer.chart, chartdiv = this._layer.chartdiv;
		chart.setSize(chartdiv.innerWidth(), chartdiv.innerHeight());
	},
	// 格式化数据
	_formatInterfaceData : function(datas, selectedindex) {
		selectedindex = selectedindex || [ 0 ];
		this._viewData = this._formatDataForView(datas, selectedindex);// 缓存格式化数据
	},
	// 将chart需要展示的数据行格式化为highchart能接受的格式
	_formatDataForView : function(datas, selectedindex) {
		var thisobj = this;
		var highchartdata = [], jqgriddata = [];
		var defaultwidth = 80;
		var colnames = [];
		var datacolCount = 0;// 数据集元素包含的列数,这里必须满足头两列是[时间]和[长度],后边是边降数据值的规则
		for ( var key in datas[0]) {
			datacolCount++;
			// if (datacolCount > 2) {
			colnames.push(key);
			// }
		}
		var srcdataMidPoint = datacolCount / 2 + 2, endpointCalcu = 1.5 * datacolCount - 1;

		for ( var i = 0; i < datas.length; i++) {
			var data = datas[i], keyindex = 1, chartdata = {
				name : '',
				data : []
			}, ischartdata = false, griddata = {};
			for ( var key in data) {
				var val = data[key];
				// 如果在highchart需要显示的数据行中,加入到highchart格式化数据中
				if (jQuery.inArray(i, selectedindex) > -1) {
					ischartdata = true;
					if (keyindex == thisobj._datacol.time) {
						chartdata.name += ((chartdata.name == '' ? '' : ' ') + (key
								+ ':' + val));
					} else if (keyindex == thisobj._datacol.length) {
						chartdata.name += ((chartdata.name == '' ? '' : ' ') + (key
								+ ':' + val));
					} else {
						if (typeof val == 'string') {
							val = parseFloat(val);
						}
						// 将后半部分数据倒置后接到前半部分
						if (keyindex >= srcdataMidPoint) {
							chartdata.data[endpointCalcu - keyindex] = val;
						} else {
							chartdata.data[keyindex - 3] = val;
						}
					}
				}
				// 所有数据都添加到grid原始数据中
				griddata[key] = val;
				keyindex++;
			}
			if (ischartdata)
				highchartdata.push(chartdata);
			jqgriddata.push(griddata);
		}

		var gridColModel = [];
		for ( var i = 0; i < colnames.length; i++) {
			var col = colnames[i];
			var model = {
				"name" : col,
				"index" : col,
				"width" : defaultwidth
			};
			gridColModel.push(model);
		}
		return {
			highchart : highchartdata,
			jqgrid : jqgriddata,
			colnames : colnames,
			gridColModel : gridColModel
		};
	},
	// 更新控件的显示数据
	_updateData : function() {
		this._updateGridView();
		this._updateChartView();
	},
	// 更新jqgrid表格控件
	_updateGridView : function() {
		var grid = this._layer.grid;
		grid.GridDestroy();// 清除之前的表格内容
		this._layer.pagerdiv.remove();
		this._addJqueryGrid(this._layer.grid);// 添加行数据
	},
	// 更新hightchart图表控件
	_updateChartView : function() {
		var thisobj = this;
		var chart = thisobj._layer.chart;// ._layer.chartdiv.highcharts();
		thisobj.setChartXAxisTitle(thisobj._viewData.highchart[0].name);// 更新x轴显示
		chart.series[0].setData(thisobj._viewData.highchart[0].data);// 设置新数据(无需清理之前数据,highchart自身已实现过)
		console.log(JSON.stringify(thisobj._viewData.highchart[0].data));
		thisobj._updatePointStdStatus();
	}
};