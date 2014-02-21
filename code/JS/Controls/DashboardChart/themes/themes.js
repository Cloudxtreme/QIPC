//20130122 倪飘 解决控件库-圆形仪表盘-页面拖入圆形仪表盘，双击进入属性，主题和样式不显示默认选项问题 
var theme1 = {
    "chart": {
        "animation":"0",
        "bgalpha": "0",//透明
        "manageresize": "1",
        "origw": "240",//宽
        "origh": "240",//高
        "upperlimit": "150",
        "showborder": "0",
        "lowerlimit": "0",
        "lowerlimitdisplay": "",
        "upperlimitdisplay":"",
        "basefontcolor": "FFFFFF",
        "majortmcolor": "FFFFFF",
        "minortmcolor": "FFFFFF",
        "tooltipbordercolor": "FFFFFF", //弹出的那个框
        "tooltipbgcolor": "333333",//弹出的那个框
        "majortmnumber": "8",//分割线
        "majortmheight": "10",
        "minortmnumber": "8",//显示多少刻度
        "minortmheight": "3",//刻度高度
        "gaugeouterradius": "100",//圆圈大小
        "gaugestartangle": "225", //弧度
        "gaugeendangle": "-45", //弧度
        "placevaluesinside": "1",//数字在外面显示还是在里面显示
        "gaugeinnerradius": "90%", //圆线宽度
//        "numbersuffix": "°",//单位
        "annrenderdelay": "0",
        "gaugefillmix": "",
        "pivotradius": "10",
        "showpivotborder": "0",
        "pivotfillmix": "{CCCCCC},{333333}",
        "pivotfillratio": "50,50",
        "showshadow": "0",
        "gaugeoriginx": "120",
        "gaugeoriginy": "120"
    },
    "colorrange": {
        "color": [
                {
                    "minvalue": "0",
                    "maxvalue": "150",
                    "code": "28FF28",
                    "alpha": "100"
                }
            ]
    },
    "dials": {
        "dial": [
                {
                    "value": "20",
                    "bordercolor": "FFFFFF",
                    "bgcolor": "000000,ff2d2d,000000",
                    "borderalpha": "0",
                    "basewidth": "10"
                }
            ]
    },
    "annotations": {
        "groups": [
                {
                    "x": "120",
                    "y": "120",
                    "showbelow": "1",
                    "items": [
                        {
                          "type": "circle",
                          "x": "0",
                          "y": "0",
                          "radius": "110",
                          "showborder": "1",
                          "bordercolor": "cccccc",
                          "fillasgradient": "1",
                          "fillcolor": "ffffff,000000",
                          "fillratio": "1,99"
                        }
                    ]
                }
            ]
    }
};
         