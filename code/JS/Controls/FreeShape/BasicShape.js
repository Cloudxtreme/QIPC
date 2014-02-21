/**
 * 自定义图形默认设置
 */
(function() {
	BCCShape = {
		width : 300,
		height : 500,
		text : {
			topline:{
				visible:true,
				style:{
					'stroke':'#0099CC',
					'stroke-width':1,
					'stroke-dasharray':"10,2"
				}
			},
			bottomline:{
				visible:true,
				style:{
					'stroke':'#0099CC',
					'stroke-width':1,
					'stroke-dasharray':"10,2"
				}
			},
			valline:{
				visible:true,
				style:{
					'stroke':'#000000',
					'stroke-width':4/*,
					'stroke-dasharray':"10,2"*/
				}
			},
			title : {
				name : 'BCC',
				style : {
					'font-family' : 'Arial',//Giddyup Std
					'font-size' : 30,
					stroke : 'none',
					fill : 'midnightblue'
				},
				offsetX : 200,
				offsetY : 450,
				visible:true,
				multi:1
			},
			top : {
				extra : 'max',
				textstyle:{
					'font-family' : '微软雅黑,Arial',//Giddyup Std
					'font-size' : 10,
					stroke:'none',
					'stroke-width':2,
					fill : '#0099CC'
				},
				showborder:false,
				borderstyle:{
					stroke:'silver',
					'stroke-width':1,
					rx:2,
					ry:2,
					fill:'none'
				},
				offsetX : 200,
				offsetY : 20,
				visible:true
			},
			bottom : {
				extra : 'min',
				textstyle:{
					'font-family' : '微软雅黑,Arial',//Giddyup Std
					'font-size' : 10,
					stroke:'none',
					fill : '#0099CC'
				},
				showborder:false,
				borderstyle:{
					stroke:'silver',
					'stroke-width':1,
					rx:2,
					ry:2,
					fill:'none'
				},
				offsetX : 200,
				offsetY : 240,
				visible:true
			},
			val : {
				extra : 'value',
				textstyle:{
					'font-family' : '微软雅黑,Arial',//Giddyup Std
					'font-size' : 10,
					stroke:'none',
					fill : '#0099CC'
				},
				showborder:false,
				borderstyle:{
					stroke:'silver',
					'stroke-width':1,
					rx:2,
					ry:2,
					fill:'white'
				},
				offsetX : 200,
				visible:true
			}
		},
		//填充路径(其实是一个蒙板,将数值填充区域之外的画面使用背景颜色填充)
		//此处最外层边框长/宽各加了1个像素是为了防止填充矩形因为蒙板的stroke:none而在边沿溢出了一条线的问题
		fillpath : [ {
			action : 'M',
			data : [ 0, 0 ]
		}, {
			action : 'l',
			data : [ 301, 0 ]
		}, {
			action : 'l',
			data : [ 0, 501 ]
		}, {
			action : 'l',
			data : [ -301, 0 ]
		}, {
			action : 'l',
			data : [ 0, -501 ]
		}, {
			action : 'm',
			data : [ 20, 20 ]
		}, {
			action : 'l',
			data : [ 15, 100 ]
		}, {
			action : 'l',
			data : [ 10, 10 ]
		}, {
			action : 'l',
			data : [ 100, 0 ]
		}, {
			action : 'l',
			data : [ 10, -10 ]
		}, {
			action : 'l',
			data : [ 15, -100 ]
		}, {
			action : 'm',
			data : [ -100, 140 ]
		}, {
			action : 'l',
			data : [ 20, 80 ]
		}, {
			action : 'l',
			data : [ 60, 0 ]
		}, {
			action : 'l',
			data : [ 20, -80 ]
		} ],
		fill : {
			top : 20,
			bottom : 240,
			total : 180,
			section : [ [ 20, 120 ], [ 160, 240 ] ]

		},
		// 必须按顺序排列,顺序越靠前的图形会被顺序靠后的图形覆盖
		extragraphics : [ {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 12, 24 ]
			}, {
				action : "L",
				point : [ 2, 24 ]
			}, {
				action : "L",
				point : [ 2, 26 ]
			}, {
				action : "L",
				point : [ 12, 26 ]
			}, {
				action : "L",
				point : [ 12, 30 ]
			}, {
				action : "L",
				point : [ 17, 30 ]
			}, {
				action : "L",
				point : [ 17, 20 ]
			}, {
				action : "L",
				point : [ 12, 20 ]
			}, {
				action : "L",
				point : [ 12, 26 ]
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 1,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 178, 24 ]
			}, {
				action : "L",
				point : [ 188, 24 ]
			}, {
				action : "L",
				point : [ 188, 26 ]
			}, {
				action : "L",
				point : [ 178, 26 ]
			}, {
				action : "L",
				point : [ 178, 30 ]
			}, {
				action : "L",
				point : [ 173, 30 ]
			}, {
				action : "L",
				point : [ 173, 20 ]
			}, {
				action : "L",
				point : [ 178, 20 ]
			}, {
				action : "L",
				point : [ 178, 26 ]
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 1,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 13.5, 10 ]
			}, {
				action : "L",
				point : [ 30.652, 124.348 ]
			}, {
				action : "L",
				point : [ 40.652, 134.348 ]
			}, {
				action : "L",
				point : [ 149.348, 134.348 ]
			}, {
				action : "L",
				point : [ 159.348, 124.348 ]
			}, {
				action : "L",
				point : [ 176.5, 10 ]
			}, {
				action : "L",
				point : [ 171.5, 10 ]
			}, {
				action : "L",
				point : [ 155, 120 ]
			}, {
				action : "L",
				point : [ 145, 130 ]
			}, {
				action : "L",
				point : [ 45, 130 ]
			}, {
				action : "L",
				point : [ 35, 120 ]
			}, {
				action : "L",
				point : [ 18.5, 10 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 65, 155 ]
			}, {
				action : "L",
				point : [ 85, 245 ]
			}, {
				action : "L",
				point : [ 155, 245 ]
			}, {
				action : "L",
				point : [ 175, 155 ]
			}, {
				action : "z"
			}, {
				action : "M",
				point : [ 70, 160 ]
			}, {
				action : "L",
				point : [ 90, 240 ]
			}, {
				action : "L",
				point : [ 150, 240 ]
			}, {
				action : "L",
				point : [ 170, 160 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 40.625, 134.348 ]
			}, {
				action : "L",
				point : [ 40.625, 144.348 ]
			}, {
				action : "L",
				point : [ 149.348, 144.348 ]
			}, {
				action : "L",
				point : [ 149.348, 134.348 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 3,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 40.625, 144.348 ]
			}, {
				action : "L",
				point : [ 40.625, 149.348 ]
			}, {
				action : "L",
				point : [ 149.348, 149.348 ]
			}, {
				action : "L",
				point : [ 149.348, 144.348 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 115, 128 ]
			}, {
				action : "L",
				point : [ 125, 128 ]
			}, {
				action : "L",
				point : [ 125, 170 ]
			}, {
				action : "L",
				point : [ 115, 170 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 103, 265 ]
			}, {
				action : "L",
				point : [ 137, 265 ]
			}, {
				action : "L",
				point : [ 137, 350 ]
			}, {
				action : "L",
				point : [ 103, 350 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : 'goldenrod',
				'fill-rule' : 'evenodd'
			}
		}, {// 最下方管道上附属的小突起
			type : "path",
			datas : [ /** 左侧 */
			{
				action : "M",
				point : [ 113, 353 ]
			}, {
				action : "L",
				point : [ 108, 353 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 0, 108, 363 ]
			}, {
				action : "L",
				point : [ 113, 363 ]
			}, {
				action : "M",
				point : [ 113, 366 ]
			}, {
				action : "L",
				point : [ 108, 366 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 0, 108, 376 ]
			}, {
				action : "L",
				point : [ 113, 376 ]
			}, {
				action : "M",
				point : [ 113, 379 ]
			}, {
				action : "L",
				point : [ 108, 379 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 0, 108, 389 ]
			}, {
				action : "L",
				point : [ 113, 389 ]
			}, {
				action : "M",
				point : [ 113, 397 ]
			}, {
				action : "L",
				point : [ 108, 397 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 0, 108, 407 ]
			}, {
				action : "L",
				point : [ 113, 407 ]
			}, /** 右侧 */
			{
				action : "M",
				point : [ 127, 353 ]
			}, {
				action : "L",
				point : [ 132, 353 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 1, 132, 363 ]
			}, {
				action : "L",
				point : [ 127, 363 ]
			}, {
				action : "M",
				point : [ 127, 366 ]
			}, {
				action : "L",
				point : [ 132, 366 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 1, 132, 376 ]
			}, {
				action : "L",
				point : [ 127, 376 ]
			}, {
				action : "M",
				point : [ 127, 379 ]
			}, {
				action : "L",
				point : [ 132, 379 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 1, 132, 389 ]
			}, {
				action : "L",
				point : [ 127, 389 ]
			}, {
				action : "M",
				point : [ 127, 397 ]
			}, {
				action : "L",
				point : [ 132, 397 ]
			}, {
				action : "A",
				point : [ 5, 5, 0, 0, 1, 132, 407 ]
			}, {
				action : "L",
				point : [ 127, 407 ]
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : 'white',
				'fill-rule' : 'evenodd'
			}
		}, {// 最下方的弯曲管道
			type : "path",
			isAptoticFill:true,//是否是固定的填充区域(区别于动态填充区域rect)
			datas : [ {
				action : "M",
				point : [ 113, 265 ]
			}, {
				action : "L",
				point : [ 127, 265 ]
			}, {
				action : "L",
				point : [ 127, 415 ]
			}, {
				action : "A",
				point : [ 50, 50, 0, 0, 0, 177, 465 ]
			}, {
				action : "L",
				point : [ 277, 465 ]
			}, {
				action : "L",
				point : [ 277, 479 ]
			}, {
				action : "L",
				point : [ 177, 479 ]
			}, {
				action : "A",
				point : [ 64, 64, 0, 0, 1, 113, 415 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : '#FF6600',
				'fill-rule' : 'evenodd'
			}
		}, {
			type : "path",
			datas : [ {
				action : "M",
				point : [ 115, 238 ]
			}, {
				action : "L",
				point : [ 125, 238 ]
			}, {
				action : "L",
				point : [ 125, 280 ]
			}, {
				action : "L",
				point : [ 115, 280 ]
			}, {
				action : "z"
			} ],
			attr : {},
			style : {
				'stroke' : 'black',
				'stroke-width' : 2,
				'fill' : 'saddlebrown',
				'fill-rule' : 'evenodd'
			}
		} ]
	};// end of BCCShape
}());