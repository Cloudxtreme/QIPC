/**
 * 自定义SVG图形控件
 * 
 * @author liuxing
 */
(function() {
	var win = window, doc = document, SVGNS = 'http://www.w3.org/2000/svg';
	/**
	 * 创建SVG元素
	 * 
	 * @param name
	 *            元素的标准名称TAG name
	 * @param attr
	 *            元素的属性
	 * @param style
	 *            css样式
	 */
	createSVGElement = function(name, attr, style) {
		var ele = document.createElementNS(SVGNS, name);
		if (attr) {
			for ( var attrname in attr) {
				ele.setAttribute(attrname, attr[attrname]);
			}
		}
		if (style) {
			for ( var cssname in style) {
				ele.style[cssname] = style[cssname];
			}
		}
		return ele;
	};
	/**
	 * 为svg元素设置样式集合(添加,单个覆盖或者添加),
	 * 
	 * @param svgele
	 *            svg元素对象
	 * @param style
	 *            样式的JSON对象
	 */
	setSvgStyle = function(svgele, style) {
		if (svgele && style)
			for ( var stylename in style) {
				svgele.style[stylename] = style[stylename];
			}
	};
	/**
	 * 为svg元素设置属性值,
	 * 
	 * @param svgele
	 *            svg元素对象
	 * @param attr
	 *            属性的JSON对象
	 */
	setSvgAttribute = function(svgele, attr) {
		if (svgele && attr)
			for ( var attrname in attr) {
				svgele.setAttribute(attrname, attr[attrname]);
			}
	};
	getSvgAttribute = function(svgele, attr) {
		if (svgele && attr) {
			return svgele.getAttribute(attr);
		}
	};
	/**
	 * 添加一个监听(使用的是jQuery的bind方法而非live)
	 * 
	 * @param el
	 *            要对其添加监听的元素引用
	 * @param event
	 *            监听事件的字符串名称
	 * @param fn
	 *            事件处理函数
	 */
	addEvent = function(el, event, fn) {
		$(el).bind(event, fn);
	};
	/**
	 * s是否是字符串
	 */
	isString = function(s) {
		return typeof s === 'string';
	};
	isUndefined = function(v) {
		return typeof v === 'undefined';
	};
	/**
	 * 判断是否为小写英文字母，是则返回true,否则返回false
	 */
	f_check_lowercase = function(str) {
		return /^[a-z]+$/.test(str);
	};
	/**
	 * 判断是否为大写英文字母，是则返回true,否则返回false
	 */
	f_check_uppercase = function(str) {
		return /^[A-Z]+$/.test(str);
	};
	setScale = function(ele, scale) {
		ele.setAttribute('transform', 'scale(' + scale + ')');
	};
	roundfload = function(f, s) {
		var pow = Math.pow(10, s);
		return Math.round(f * pow) / pow;
	};
	setSVGTransformTranslateX = function(svg, x) {
		var transform = getSvgAttribute(svg, 'transform');
		if (transform) {
			var front = transform.substring(0, transform.indexOf('(') + 1), tail = transform
					.substring(transform.indexOf(','), transform.length);
			var newtransform = front + x + tail;
			setSvgAttribute(svg, {
				transform : newtransform
			});
		}
	};
	(function($) {
		win.FreeShape = win.FreeShape || ($ && {
			/**
			 * 初始化
			 */
			init : function() {
				// 将freeShape方法注册到jQuery中,这个方法调用的是下面的作图方法
				$.fn.freeShape = function() {
					var constr = 'PercentFillShape', // default
					// constructor
					args = arguments, options;
					if (isString(args[0])) {
						constr = args[0];
						args = Array.prototype.slice.call(args, 1);
					}
					options = $.extend(true, args[0], {
						shape : {
							renderTo : null
						}
					});
					options.shape.renderTo = this[0];
					return new FreeShape[constr](options);
				};
			}
		});
		// 注册全局变量,并调用FreeShape的init方法
		var globalAdapter = win.FreeShape;
		if (globalAdapter)
			globalAdapter.init.call();

		/**
		 * 创建以百分比填充空白显示数据的图形
		 */
		PercentFillShape = function() {
			this.init.apply(this, arguments);
		};
		PercentFillShape.prototype = {
			opt : null,
			render : null,
			init : function(opt) {
				this.opt = opt;
				this.paint(opt);
				return this;
			},
			/**
			 * 画图方法
			 * 
			 * @param rendTo
			 * @returns {___anonymous500_1203}
			 */
			paint : function(opt) {
				this.render = new PercentFillRender(opt);
			},
			/**
			 * 重绘,当作图区域大小发生变化时执行.
			 */
			redraw : function() {
				this.render._redraw();
			},
			/**
			 * 设置 当前值,上限,下线值,会触发重绘
			 * 
			 * @param val
			 *            当前值
			 * @param max
			 *            上限
			 * @param min
			 *            下限
			 */
			setValue : function(val, max, min) {
				this.render._setValue(val, max, min);
			},
			/**
			 * 设置填充区域颜色(包含固定和动态填充区域)
			 * 
			 * @param color
			 */
			setFillColor : function(color) {
				this.render._setFillColor(color);
			},
			/**
			 * 设置填充区域背景颜色
			 * 
			 * @param color
			 */
			setFillBgColor : function(color) {
				this.render._setFillBgColor(color);
			},
			setLineColor : function(name, color) {
				this.render._setLineColor(name, color);
			},
			setLineVisible : function(name, visible) {
				this.render._setLineVisible(name, visible);
			},
			setTitleVisible : function(visible) {
				this.render._setTitleVisible(visible);
			},
			setValVisible : function(name, visible) {
				this.render._setValVisible(name, visible);
			},
			setValColor : function(name, color) {
				this.render._setValColor(name, color);
			},
			setTitleSize : function(multi) {
				this.render._setTitleSize(multi);
			}
		};// end of PercentFillShape

		PercentFillRender = function() {
			this._init.apply(this, arguments);
		};
		PercentFillRender.prototype = {
			option : {
				shape : {
					style : {
						rect : {
							'stroke' : 'none'
						},
						// 填充区域之外的填充底色
						path : {
							'stroke' : 'none',
							'fill' : 'url(#freeShapeDefaultBgLinearGradient)',
							'fill-rule' : 'evenodd'
						},
						// 默认的填充区域底色
						fillbg : {
							'stroke' : 'none',
							'fill' : 'lightsteelblue',
							'fill-rule' : 'evenodd'
						}
					}
				}
			},
			graphics : {
				rendTo : null,
				svg : null,
				bgrect : null,
				topPath : null,
				g : null,
				line : {
					maxline : null,
					bottomline : null,
					valline : null
				},
				text : {
					textPadding : 1,
					lineSpacing : 2,
					chineseOffset : 2.5
				},
				size : {
					ctWidth : 0,
					ctHeight : 0,
					gWidth : 0,
					gHeight : 0,
					offsetX : 0,
					offsetY : 0,
					realscale : 0
				}
			},
			_init : function(opt) {
				var thisobj = this;
				$.extend(true, this.option, opt);
				thisobj._rend();
				thisobj._bindEvt();
				return this;
			},
			/**
			 * 添加基本的层到画布上
			 */
			_addBasicLayout : function() {
				var rendTo = this.option.shape.renderTo;
				var svg = createSVGElement('svg', {
					xmlns : 'http://www.w3.org/2000/svg',
					'xmlns:xlink' : 'http://www.w3.org/1999/xlink'
				}), g = createSVGElement('g', {}, this.option.shape.style.g), defs = createSVGElement('defs');
				svg.appendChild(defs);

				// 填充区域底色
				var fillbg = createSVGElement('rect', {},
						this.option.shape.style.fillbg);
				svg.appendChild(fillbg);

				rect = createSVGElement('rect', {},
						this.option.shape.style.rect);
				g.appendChild(rect);
				svg.appendChild(g);
				rendTo.appendChild(svg);

				this.graphics.defs = defs;
				this.graphics.bgrect = rect;
				this.graphics.g = g;
				this.graphics.svg = svg;
				this.graphics.fillbg = fillbg;

				this.graphics.fillSections = [ rect ];// 所有填充区域,包括固定和动态区域

				this._setDefs();
			},
			/**
			 * 设置SVG 预定义(Defs标签)内容
			 */
			_setDefs : function() {
				var linearGradient = createSVGElement('linearGradient', {
					id : 'freeShapeDefaultBgLinearGradient',
					x1 : '0%',
					y1 : '0%',
					x2 : '0%',
					y2 : '100%',
					spreadMethod : 'pad',
					gradientTransform : 'rotate(45)'
				}, null);
				var stop1 = createSVGElement('stop', {
					offset : '0%',
					'stop-color' : 'silver',// silver
					'stop-opacity' : '1'// #00cc00
				}), stop2 = createSVGElement('stop', {
					offset : '100%',
					'stop-color' : 'gray',// gray
					'stop-opacity' : '1'// #006600
				});
				linearGradient.appendChild(stop1);
				linearGradient.appendChild(stop2);
				this.graphics.defs.appendChild(linearGradient);
				// stop
				// linearGradient
			},
			/**
			 * 计算各个层容器的初始大小和位置
			 */
			_measure : function() {
				var widthfix = this.option.shape.xfix || 0, heightfix = this.option.shape.yfix || 0;
				var ctwidth = $(this.option.shape.renderTo).innerWidth()
						+ widthfix, ctheight = $(this.option.shape.renderTo)
						.innerHeight()
						+ heightfix, scaleW = ctwidth
						/ this.option.shape.graphic.width, scaleH = ctheight
						/ this.option.shape.graphic.height, realscale = scaleW < scaleH ? scaleW
						: scaleH, gwidth = realscale
						* this.option.shape.graphic.width, gheight = realscale
						* this.option.shape.graphic.height;
				this.graphics.size.gWidth = gwidth;
				this.graphics.size.gHeight = gheight;
				this.graphics.size.ctWidth = ctwidth;
				this.graphics.size.ctHeight = ctheight;
				this.graphics.size.offsetX = (ctwidth - gwidth) / 2;
				this.graphics.size.offsetY = (ctheight - gheight) / 2;
				this.graphics.size.realscale = realscale;
			},
			/**
			 * 设置各个层容器的初始大小和位置
			 */
			_setSize : function() {
				var ctsizeattr = {
					width : this.graphics.size.ctWidth,
					height : this.graphics.size.ctHeight
				}, gsizeattr = {
					width : this.graphics.size.gWidth,
					height : this.graphics.size.gHeight,
					x : this.graphics.size.offsetX,
					y : this.graphics.size.offsetY
				}, rectsizeattr = {
					width : this.graphics.size.gWidth,
					height : 0,
					x : this.graphics.size.offsetX,
					y : this.graphics.size.gHeight + this.graphics.size.offsetY
				};
				setSvgAttribute(this.graphics.svg, ctsizeattr);
				setSvgAttribute(this.graphics.g, gsizeattr);
				setSvgAttribute(this.graphics.fillbg, gsizeattr);
				setSvgAttribute(this.graphics.bgrect, rectsizeattr);
			},
			/**
			 * 设置标尺,文字部分
			 */
			_addFixedLine : function() {
				// 标题
				var titletextstyle = {};
				$.extend(titletextstyle,
						this.option.shape.graphic.text.title.style);
				titletextstyle['font-size'] = Math
						.floor(titletextstyle['font-size']
								* this.graphics.size.realscale
								* this.option.shape.graphic.text.title.multi);
				titletextstyle.visibility = this.option.shape.graphic.text.title.visible ? 'visible'
						: 'hidden';
				// 将默认字体大小乘以放大比列(舍去小数部分),设置到字体选项中去
				var title = createSVGElement('text', {
					x : this.option.shape.graphic.text.title.offsetX
							* this.graphics.size.realscale
							+ this.graphics.size.offsetX,
					y : this.option.shape.graphic.text.title.offsetY
							* this.graphics.size.realscale
							+ this.graphics.size.offsetY
				}, titletextstyle);
				title.textContent = this.option.shape.graphic.text.title.name;
				this.graphics.g.appendChild(title);
				this.graphics.text.title = title;

				// 水平线和数字的显示策略
				var textPadding = this.graphics.text.textPadding
						* this.graphics.size.realscale;// 文字与线框间的空隙
				var lineSpacing = this.graphics.text.lineSpacing
						* this.graphics.size.realscale;// 线框与水平线间的空隙
				var chineseOffset = this.graphics.text.chineseOffset
						* this.graphics.size.realscale;// 中文锚点和最下线不重合修正

				// 上限线
				var topLineX1 = this.graphics.size.offsetX;
				var topLineX2 = this.graphics.size.offsetX
						+ this.graphics.size.gWidth;
				var topLineY = this.option.shape.graphic.fill.top
						* this.graphics.size.realscale
						+ this.graphics.size.offsetY;
				this.option.shape.graphic.text.topline.style['visibility'] = this.option.shape.graphic.text.topline.visible ? 'visible'
						: 'hidden';
				var topLine = createSVGElement('line', {
					x1 : topLineX1,
					y1 : topLineY,
					x2 : topLineX2,
					y2 : topLineY
				}, this.option.shape.graphic.text.topline.style);
				this.graphics.g.appendChild(topLine);
				this.graphics.line.topline = topLine;

				// 上限文字
				var topbox = this
						._createTextBox(this.option.shape.graphic.text.top.extra
								+ ':' + this.option.data.max);
				// 克隆设置,放置计算过程影响原设置
				var toptextstyle = {};
				$.extend(toptextstyle,
						this.option.shape.graphic.text.top.textstyle);
				toptextstyle['font-size'] = Math
						.floor(toptextstyle['font-size']
								* this.graphics.size.realscale);
				// 将默认字体大小乘以放大比列(舍去小数部分),设置到字体选项中去
				setSvgAttribute(topbox.text, toptextstyle);
				this.graphics.g.appendChild(topbox.g);// 将文本框条件到SVGDom中,不然无法计算文字的真实大小
				var topoutline = topbox.text.getBBox();// 文字部分的真实大小
				// 文本框的x起点是水平线末端减去[文字宽度和文字与边框空隙的两倍之和]
				var topgx = topLineX2 - (topoutline.width + textPadding * 2);
				// 如果文本框在线上边,文本框y起点是线的Y值减去文本高度,文字线框空隙和框与线空隙之和
				var topgy = topLineY
						- (topoutline.height + textPadding + lineSpacing);
				// 如果计算出来的y起点小于0,说明文本框必须放在线的下方
				// 放在下方y的起点就是水平线y值
				var istoptextboxUp = (topgy >= 0);
				topgy = istoptextboxUp ? (topgy) : (topLineY);
				setSvgAttribute(
						topbox.g,
						{
							transform : 'translate(' + topgx + ',' + topgy
									+ ')',
							visibility : this.option.shape.graphic.text.top.visible ? 'visible'
									: 'hidden'
						});
				// 因为文字的起点在文字的左下方,所以文字的y轴便宜需要加上本身的高度
				// 此处的偏移都是针对他的父组件g的,因为g已经做了transform:translate变换
				var toptextx = textPadding;
				var toptexty = textPadding + topoutline.height - chineseOffset;
				setSvgAttribute(topbox.text, {
					x : toptextx,
					y : toptexty
				});
				// 上限文字边框
				if (this.option.shape.graphic.text.top.showborder) {
					var toprectx = 0;
					var toprecty = istoptextboxUp ? 0 : lineSpacing;
					var toprectwidth = topoutline.width + 2 * textPadding;
					var toprectheight = topoutline.height + 2 * textPadding;
					setSvgAttribute(topbox.rect, $.extend(
							this.option.shape.graphic.text.top.borderstyle, {
								x : toprectx,
								y : toprecty,
								width : toprectwidth,
								height : toprectheight
							}));
				}
				this.graphics.topBox = topbox;

				// 下限线
				var bottomLineX1 = this.graphics.size.offsetX;
				var bottomLineX2 = this.graphics.size.offsetX
						+ this.graphics.size.gWidth;
				var bottomLineY = this.option.shape.graphic.fill.bottom
						* this.graphics.size.realscale
						+ this.graphics.size.offsetY;
				this.option.shape.graphic.text.bottomline.style['visibility'] = this.option.shape.graphic.text.bottomline.visible ? 'visible'
						: 'hidden';
				var bottomLine = createSVGElement('line', {
					x1 : bottomLineX1,
					y1 : bottomLineY,
					x2 : bottomLineX2,
					y2 : bottomLineY
				}, this.option.shape.graphic.text.bottomline.style);
				this.graphics.g.appendChild(bottomLine);
				this.graphics.line.bottomline = bottomLine;

				// 下限文字
				var bottombox = this
						._createTextBox(this.option.shape.graphic.text.bottom.extra
								+ ':' + this.option.data.min);
				var bottomtextstyle = {};
				$.extend(bottomtextstyle,
						this.option.shape.graphic.text.bottom.textstyle);
				bottomtextstyle['font-size'] = Math
						.floor(bottomtextstyle['font-size']
								* this.graphics.size.realscale);
				// 将默认字体大小乘以放大比列(舍去小数部分),设置到字体选项中去
				setSvgAttribute(bottombox.text, bottomtextstyle);
				this.graphics.g.appendChild(bottombox.g);
				var bottomoutline = bottombox.text.getBBox();
				var bottomgx = bottomLineX2
						- (bottomoutline.width + textPadding * 2);
				var bottomgy = bottomLineY
						- (bottomoutline.height + textPadding + lineSpacing);
				var isbottomtextboxUp = (bottomgy >= 0);
				bottomgy = isbottomtextboxUp ? bottomgy : bottomLineY;
				setSvgAttribute(bottombox.g, {
					transform : 'translate(' + bottomgx + ',' + bottomgy + ')',
					visibility : 'visible'
				});
				var bottomtextx = textPadding;
				var bottomtexty = textPadding + bottomoutline.height
						- chineseOffset;
				setSvgAttribute(bottombox.text, {
					x : bottomtextx,
					y : bottomtexty
				});
				// 上限文字边框
				if (this.option.shape.graphic.text.bottom.showborder) {
					var bottomrectx = 0;
					var bottomrecty = isbottomtextboxUp ? 0 : lineSpacing;
					var bottomrectwidth = bottomoutline.width + 2 * textPadding;
					var bottomrectheight = bottomoutline.height + 2
							* textPadding;
					setSvgAttribute(bottombox.rect, $.extend(
							this.option.shape.graphic.text.bottom.borderstyle,
							{
								x : bottomrectx,
								y : bottomrecty,
								width : bottomrectwidth,
								height : bottomrectheight
							}));
				}
				this.graphics.bottomBox = bottombox;

				// 值线
				var valueLineX1 = this.graphics.size.offsetX;
				var valueLineX2 = this.graphics.size.offsetX
						+ this.graphics.size.gWidth;
				var valueLineY = 180;
				var valueLine = createSVGElement('line', {
					x1 : valueLineX1,
					y1 : valueLineY,
					x2 : valueLineX2,
					y2 : valueLineY,
					visibility : 'hidden'
				}, this.option.shape.graphic.text.valline.style);
				this.graphics.g.appendChild(valueLine);
				this.graphics.line.valline = valueLine;

				var valuebox = this
						._createTextBox(this.option.shape.graphic.text.val.extra
								+ ':' + this.option.data.min);
				var valuetextstyle = {};
				$.extend(valuetextstyle,
						this.option.shape.graphic.text.val.textstyle);
				valuetextstyle['font-size'] = Math
						.floor(valuetextstyle['font-size']
								* this.graphics.size.realscale);
				// 将默认字体大小乘以放大比列(舍去小数部分),设置到字体选项中去
				setSvgAttribute(valuebox.text, valuetextstyle);
				this.graphics.g.appendChild(valuebox.g);
				var valueoutline = valuebox.text.getBBox();
				var valuegx = valueLineX2
						- (valueoutline.width + textPadding * 2);
				var valuegy = valueLineY
						- (valueoutline.height + textPadding + lineSpacing);
				var isvaluetextboxUp = (valuegy >= 0);
				valuegy = isvaluetextboxUp ? valuegy : valueLineY;
				setSvgAttribute(valuebox.g, {
					transform : 'translate(' + valuegx + ',' + valuegy + ')'
				});
				var valuetextx = textPadding;
				var valuetexty = textPadding + valueoutline.height
						- chineseOffset;
				setSvgAttribute(valuebox.text, {
					x : valuetextx,
					y : valuetexty
				});
				// 值文字边框
				if (this.option.shape.graphic.text.val.showborder) {
					var valuerectx = 0;
					var valuerecty = isvaluetextboxUp ? 0 : lineSpacing;
					var valuerectwidth = valueoutline.width + 2 * textPadding;
					var valuerectheight = valueoutline.height + 2 * textPadding;
					setSvgAttribute(valuebox.rect, $.extend(
							this.option.shape.graphic.text.val.borderstyle, {
								x : valuerectx,
								y : valuerecty,
								width : valuerectwidth,
								height : valuerectheight
							}));
				}
				this.graphics.valBox = valuebox;
			},
			/**
			 * 创建一个矩形区域来包含一段文字,创建时为隐藏状态,并且未添加到页面中去
			 */
			_createTextBox : function(txt) {
				var g = createSVGElement('g', {
					visibility : 'hidden'
				}), rect = createSVGElement('rect'), text = createSVGElement('text');
				text.textContent = txt;
				g.appendChild(rect);
				g.appendChild(text);
				var result = {
					g : g,
					rect : rect,
					text : text
				};
				return result;
			},
			/**
			 * 添加图形的点缀部分(不动的环境设置图形,预定义好的坐标/曲线/填充)
			 */
			_addExtraGraphic : function() {
				var extragraphics = this.option.shape.graphic.extragraphics;
				if (extragraphics) {
					for ( var i = 0; i < extragraphics.length; i++) {
						var graphic = extragraphics[i];
						var attr = graphic.attr || {}, style = graphic.style
								|| {};
						if (graphic.type && graphic.type === 'path') {
							var dstr = '';
							var datas = graphic.datas;
							for ( var j = 0; j < datas.length; j++) {
								var data = datas[j];
								dstr += data.action;
								if (data.point) {
									// 大写字母表示绝对坐标,需要加入偏移值
									if (f_check_uppercase(data.action)) {
										if ('A' === data.action) {
											dstr += this
													._getArcsPathDstr(
															data.point,
															this.graphics.size.realscale,
															this.graphics.size.offsetX,
															this.graphics.size.offsetY);
										} else {
											dstr += ((data.point[0]
													* this.graphics.size.realscale + this.graphics.size.offsetX)
													+ ','
													+ (data.point[1]
															* this.graphics.size.realscale + this.graphics.size.offsetY) + ' ');
										}
									} else {
										if ('a' === data.action) {
											dstr += this
													._getArcsPathDstr(
															data.point,
															this.graphics.size.realscale,
															0, 0);
										} else {
											dstr += (data.point[0]
													* this.graphics.size.realscale
													+ ','
													+ data.point[1]
													* this.graphics.size.realscale + ' ');
										}
									}
								}
							}
							attr.d = dstr;
						}
						if (graphic.isAptoticFill) {
							style['fill'] = this.option.shape.style.rect.fill;
						}
						gele = createSVGElement(graphic.type, attr, style);
						this.graphics.g.appendChild(gele);
						if (graphic.isAptoticFill) {
							this.graphics.fillSections.push(gele);
						}
					}
				}
			},
			_rend : function() {
				var thisobj = this;
				thisobj._measure();
				thisobj._addBasicLayout();
				thisobj._setSize();
				thisobj._paintFillMask();
				thisobj._addExtraGraphic();
				thisobj._addFixedLine();
				thisobj._setValue();
			},
			/**
			 * 绘制填充区域之外的蒙版
			 */
			_paintFillMask : function() {
				// 绘制填充路径图形
				var fillpath = this._getPathDstr();
				var path = createSVGElement('path', {
					d : fillpath,
					x : this.graphics.size.offsetX,
					y : this.graphics.size.offsetY
				}, this.option.shape.style.path);
				this.graphics.g.appendChild(path);
			},
			_getPathDstr : function() {
				var optpath = this.option.shape.graphic.fillpath, pathstr = '';
				for ( var i = 0; i < optpath.length; i++) {
					var pathpoint = optpath[i];
					pathstr += (pathpoint.action);
					for ( var j = 0; j < pathpoint.data.length; j++) {
						if (i == 0) {
							if (pathpoint.data.length == 2) {
								if (j == 0) {
									pathstr += ((pathpoint.data[j]
											* this.graphics.size.realscale + this.graphics.size.offsetX) + " ");
								} else {
									pathstr += ((pathpoint.data[j]
											* this.graphics.size.realscale + this.graphics.size.offsetY) + " ");
								}
							}

						} else {
							pathstr += ((pathpoint.data[j] * this.graphics.size.realscale) + " ");
						}

					}
				}
				return pathstr;
			},
			/**
			 * 圆(椭圆)曲线的d标签拼接(有些部分是不需要放大的,有些需要)
			 * 
			 * @param data
			 * @param scale
			 * @returns {String}
			 */
			_getArcsPathDstr : function(data, scale, offsetX, offsetY) {
				return (data[0] * scale) + ',' + (data[1] * scale) + ' '
						+ data[2] + ' ' + data[3] + ',' + data[4] + ' '
						+ (data[5] * scale + offsetX) + ','
						+ (data[6] * scale + offsetY) + ' ';
			},
			/**
			 * 绑定事件
			 */
			_bindEvt : function() {
			},
			_setBgRect : function() {
				var data = this.option.data, bgrect = this.graphics.bgrect;
				if (data) {
					var top = this.option.shape.graphic.fill.top;// 图形填充区域的上端点
					var bottom = this.option.shape.graphic.fill.bottom;// 图形填充区域的下端点
					var totalheight = this.option.shape.graphic.fill.total;// 总的可用填充区域高度
					var sections = this.option.shape.graphic.fill.section;// 可用填充区域的所有分段
					var oldY = parseInt(getSvgAttribute(bgrect, 'y'));// 当前填充矩形的y轴位移
					var oldHeight = parseInt(getSvgAttribute(bgrect, 'height'));// 当前填充矩形的高度(包括不可用区域,矩形的实际高度)
					var height = totalheight * (data.value - data.min)
							/ (data.max - data.min);// 填充完成后可用区域所占的高度(去除不可用区域后的)
					var realheight = this._getRectRealHeight(height, sections);
					/*
					 * var y = (bottom - top) * (data.max - data.value)
					 * this.graphics.size.realscale / (data.max - data.min);
					 */
					var animate = isUndefined(this.option.shape.animate) ? 1
							: this.option.shape.animate;
					var bottomY = (this.option.shape.graphic.fill.bottom + this.graphics.size.offsetY)
							* this.graphics.size.realscale;// 填充区域的底部Y轴位移
					this._act(oldHeight, realheight, bottomY, animate);
				}
			},
			_getRectRealHeight : function(height, sections) {
				var bottom = this.option.shape.graphic.fill.bottom, endY;
				for ( var i = sections.length - 1; i >= 0; i--) {
					var section = sections[i];
					var sectionHeight = section[1] - section[0];
					if (sectionHeight < height) {
						height -= sectionHeight;
						continue;
					} else {
						endY = section[1] - height;
						break;
					}
				}
				return (bottom - endY) * this.graphics.size.realscale;
			},
			/**
			 * 设置值线的y轴位置
			 * 
			 * @param y
			 */
			_setValueLine : function(y, val) {
				setSvgAttribute(this.graphics.line.valline, {
					y1 : y,
					y2 : y,
					visibility : 'visible'
				});

				var textPadding = this.graphics.text.textPadding
						* this.graphics.size.realscale;// 文字与线框间的空隙
				var lineSpacing = this.graphics.text.lineSpacing
						* this.graphics.size.realscale;// 线框与水平线间的空隙
				var chineseOffset = this.graphics.text.chineseOffset
						* this.graphics.size.realscale;// 中文锚点和最下线不重合修正
				var valuebox = this.graphics.valBox;
				// var
				// valuebox=this._createTextBox(this.option.shape.graphic.text.val.extra
				// + ':' + this.option.data.min);
				valuebox.text.textContent = this.option.shape.graphic.text.val.extra
						+ ':' + val;
				// var valuetextstyle={};
				// $.extend(valuetextstyle,this.option.shape.graphic.text.val.textstyle);
				// valuetextstyle['font-size']=
				// Math.floor(valuetextstyle['font-size']*this.graphics.size.realscale);
				// 将默认字体大小乘以放大比列(舍去小数部分),设置到字体选项中去
				// setSvgAttribute(valuebox.text,valuetextstyle);
				// this.graphics.g.appendChild(valuebox.g);
				var valueLineX1 = this.graphics.size.offsetX;
				var valueLineX2 = this.graphics.size.offsetX
						+ this.graphics.size.gWidth;

				var valueoutline = valuebox.text.getBBox();
				var valuegx = valueLineX2
						- (valueoutline.width + textPadding * 2);
				var valuegy = y
						- (valueoutline.height + textPadding + lineSpacing);
				var isvaluetextboxUp = (valuegy >= 0);
				valuegy = isvaluetextboxUp ? valuegy : y;
				setSvgAttribute(valuebox.g, {
					transform : 'translate(' + valuegx + ',' + valuegy + ')',
					visibility : 'visible'
				});
				var valuetextx = textPadding;
				var valuetexty = textPadding + valueoutline.height
						- chineseOffset;
				setSvgAttribute(valuebox.text, {
					x : valuetextx,
					y : valuetexty
				});
				// 值文字边框
				if (this.option.shape.graphic.text.val.showborder) {
					var valuerectx = 0;
					var valuerecty = isvaluetextboxUp ? 0 : lineSpacing;
					var valuerectwidth = valueoutline.width + 2 * textPadding;
					var valuerectheight = valueoutline.height + 2 * textPadding;
					setSvgAttribute(valuebox.rect, $.extend(
							this.option.shape.graphic.text.val.borderstyle, {
								x : valuerectx,
								y : valuerecty,
								width : valuerectwidth,
								height : valuerectheight
							}));
				}
			},
			_setTextBox : function(textbox, text) {
				var textobj = textbox.text;
				textobj.textContent = text;
				var textBbox = textobj.getBBox();
				var textwidth = textBbox.width;
				var viewRegionRight = this.graphics.size.offsetX
						+ this.graphics.size.gWidth;

				var textPadding = this.graphics.text.textPadding
						* this.graphics.size.realscale;// 文字与线框间的空隙
				var lineSpacing = this.graphics.text.lineSpacing
						* this.graphics.size.realscale;// 线框与水平线间的空隙
				var chineseOffset = this.graphics.text.chineseOffset
						* this.graphics.size.realscale;// 中文锚点和最下线不重合修正

				var textX = viewRegionRight - textPadding;
				var gx = viewRegionRight - (textPadding * 2 + textwidth);
				var rectwidth = textPadding * 2 + textwidth;

				setSVGTransformTranslateX(textbox.g, gx);
				setSvgAttribute(textbox.rect, {
					width : rectwidth
				});
			},
			/**
			 * 设置上下限显示
			 */
			_setLimitView : function() {
				this._setTextBox(this.graphics.topBox,
						this.option.shape.graphic.text.top.extra + ':'
								+ this.option.data.max);
				this._setTextBox(this.graphics.bottomBox,
						this.option.shape.graphic.text.bottom.extra + ':'
								+ this.option.data.min);
			},
			_act : function(start, end, bottomY, animate) {
				var thisobj = this;
				var oldvalue = parseFloat(thisobj.option.data.oldvalue), value = parseFloat(thisobj.option.data.value);
				if (isUndefined(animate)) {
					// todo directly set the height and y
				} else {
					var time = 0, perheight = (end - start) / 100, pervalue = (value - oldvalue) / 100;
					var intervalid = setInterval(
							function() {
								time++;
								var y = bottomY - start - perheight * time;
								setSvgAttribute(thisobj.graphics.bgrect, {
									height : start + perheight * time,
									y : y
								});
								var currval = roundfload(oldvalue + pervalue
										* time, 2);
								thisobj._setValueLine(y, currval);
								if (time >= 100) {
									clearInterval(intervalid);
								}
							}, animate * 10);
				}
			},
			/**
			 * 重新绘制
			 * 
			 * @param width
			 * @param height
			 */
			_redraw : function() {
				this._destroy();
				this._rend();
			},
			_destroy : function() {
				$(this.option.shape.renderTo).empty();
			},
			_setValue : function(val, max, min) {
				this.option.data.oldvalue = this.option.data.value
						|| this.option.data.min;
				this.option.data.value = isUndefined(val) ? this.option.data.value
						: val;
				this.option.data.max = isUndefined(max) ? this.option.data.max
						: max;
				this.option.data.min = isUndefined(min) ? this.option.data.min
						: min;
				this._setBgRect();
				// TODO 设置最大值最小值显示
				this._setLimitView();
			},
			/**
			 * 设置填充区域颜色(包括固定的和动态的填充区域)
			 * 
			 * @param color
			 *            svg能识别的颜色代码字符串
			 */
			_setFillColor : function(color) {
				this.option.shape.style.rect.fill = color;
				if (this.graphics.fillSections
						&& this.graphics.fillSections.length > 0) {
					for ( var i = 0; i < this.graphics.fillSections.length; i++) {
						var fillsection = this.graphics.fillSections[i];
						setSvgStyle(fillsection, {
							'fill' : color
						});
					}
				}
			},
			/**
			 * 设置填充区域背景颜色
			 * 
			 * @param color
			 */
			_setFillBgColor : function(color) {
				this.option.shape.style.fillbg.fill = color;
				setSvgStyle(this.graphics.fillbg, {
					'fill' : color
				});
			},
			_setLineColor : function(name, color) {
				this.option.shape.graphic.text[name + 'line'].style.stroke = color;
				setSvgStyle(this.graphics.line[name + 'line'], {
					'stroke' : color
				});
			},
			_setLineVisible : function(name, isVisible) {
				this.option.shape.graphic.text[name + 'line'].visible = isVisible;
				setSvgStyle(this.graphics.line[name + 'line'], {
					'visibility' : (isVisible ? 'visible' : 'hidden')
				});
			},
			_setTitleVisible : function(visible) {
				this.option.shape.graphic.text.title.visible = visible;
				setSvgStyle(this.graphics.text.title, {
					'visibility' : (visible ? 'visible' : 'hidden')
				});
			},
			_setValVisible : function(name, visible) {
				this.option.shape.graphic.text[name].visible = visible;
				setSvgStyle(this.graphics[name + 'Box'].g, {
					'visibility' : (visible ? 'visible' : 'hidden')
				});
			},
			_setValColor : function(name, color) {
				this.option.shape.graphic.text[name].textstyle.fill = color;
				setSvgStyle(this.graphics[name + 'Box'].text, {
					'fill' : color
				});
			},
			_setTitleSize : function(multi) {
				this.option.shape.graphic.text.title.multi = multi;
				var realsize = this.option.shape.graphic.text.title.style['font-size']
						* this.graphics.size.realscale
						* this.option.shape.graphic.text.title.multi;
				setSvgStyle(this.graphics.text.title, {
					'font-size' : realsize
				});
			}
		};
	}(win.jQuery));

	// 将构造器添加到FreeShape中
	$.extend(FreeShape, {
		PercentFillShape : PercentFillShape
	});
}());