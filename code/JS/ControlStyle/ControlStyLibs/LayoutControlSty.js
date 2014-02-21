/**
 * Created with JetBrains WebStorm.
 * User: markeluo
 * Date: 12-11-3
 * Time: 下午7:16
 * To change this template use File | Settings | File Templates.
 *
 *说明：所有控件的详细样式变量信息，配合相应的css 样式文件来实现控件的详细样式
 */

/*注册 Agi.layout.StyleControl 命名空间*/
Namespace.register("Agi.layout.StyleControl");

/*所有控件的样式列表*/
Agi.layout.StyleControl.ControlStyList = {
    容器框: {
        银色: {
            //            LeftFillet1:0,//左上圆角
            //            RightFillet1:0,//右上圆角
            //            LeftFillet2:0,//左下圆角
            //            RightFillet2:0,//右下圆角
            //            FilterBgColor:"",//panel背景颜色
            //          //  FilterBgImage:"",//背景",//panel背景img
            //            FilterBorderColor:"#cccccc",//边框颜色
            background: "-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))"
            //            FilterFrameWid:"10px",//边框宽度
            //            FilterIndex:"1" //自定义索引
        }
    }, //panel样式信息
    查询按钮: {
        银色: {
            color: '#000000',
            fontSize: '12px',
            borderRadius: '5px',
            /*渐变：从上到下  0%  #ededed ; 100%  # cbcbcb内阴影：（上下左右）# ffffff  1px    75% 不透明度;*/
            background: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#ededed), to(#cbcbcb))',
            border: '1px  solid  #a7a7a7',
            textShadow: ' 0 1px 0 #FFF'    //字体阴影
        }
    },
    下拉列表框: {
        银色: {
            color: '#000000',
            fontSize: '12px',
            borderRadius: '3px',
            /*渐变：从上到下  0%  #ededed ; 100%  # cbcbcb内阴影：（上下左右）# ffffff  1px    75% 不透明度;*/
            background: '-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))',
            /*投影：（下） # ffffff  1px    75%透明度;*/
            border: '1px  solid  #a7a7a7'
            //            -webkit-box-shadow:1px 1px 1px rgba(255, 255, 255, 0.75);
            //            -moz-box-shadow:1px 1px 1px rgba(255, 255, 255, 0.75);
        }
    }, //DropDownList 样式信息
    多选下拉列表框: {
        银色: {
            color: '#000000',
            fontSize: '12px',
            borderRadius: '3px',
            /*渐变：从上到下  0%  #ededed ; 100%  # cbcbcb内阴影：（上下左右）# ffffff  1px    75% 不透明度;*/
            background: '-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))',
            /*投影：（下） # ffffff  1px    75%透明度;*/
            border: '1px  solid  #a7a7a7',
            textIndet: '5px'
            //            -webkit-box-shadow:1px 1px 1px rgba(255, 255, 255, 0.75);
            //            -moz-box-shadow:1px 1px 1px rgba(255, 255, 255, 0.75);
        }
    }, //MultiSelect 样式信息
    标签: {
        银色: {
            //            LeftFillet1: 0,//左上圆角
            //            LeftFillet2: 0,//左下圆角
            //            RightFillet1: 0,//右上圆角
            //            RightFillet2: 0,//有下圆角
            fontSize: "12", //显示字体大小
            //            fontWeight:"",//字体粗细
            fontFamily: "微软雅黑", //字体样式
            //            fontColor:"black",//字体颜色
            //            bgColor:"",//背景颜色
            background: "-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))"
            //            FontText:"test",//文本显示值
            //           isTransparent:null//背景是否透明
        }
    }, //Label 动画控件 样式信息
    单日期选择: {
        银色: {
            color: '#000',       //字体颜色
            //            fontSize: '12px',  //字体大小
            borderRadius: '3px',  //圆角大小
            //渐变：从上到下  0%  #ededed ; 100%  # cbcbcb内阴影：（上下左右）# ffffff  1px    75% 不透明度;*/
            background: '-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))',      //背景
            border: '1px  solid  #a7a7a7',   //边框
            //投影：（下） # ffffff  1px    75%透明度;*/
            //            -webkit-box-shadow:'1px 1px 1px rgba(255, 255, 255, 0.75)',
            //           -moz-box-shadow:'1px 1px 1px rgba(255, 255, 255, 0.75)',
            textShadow: ' 0 1px 0 #FFF',    //字体阴影
            textIndet: '5px'
        },
        白色: {
            color: '#000',       //字体颜色
            //            fontSize: '12px',  //字体大小
            borderRadius: '6px',  //圆角大小
            //渐变：从上到下  0%  #ededed ; 100%  # cbcbcb内阴影：（上下左右）# ffffff  1px    75% 不透明度;*/
            background: '#fff',      //背景
            border: '1px  solid  #a7a7a7',   //边框
            //投影：（下） # ffffff  1px    75%透明度;*/
            //            -webkit-box-shadow:'1px 1px 1px rgba(255, 255, 255, 0.75)',
            //           -moz-box-shadow:'1px 1px 1px rgba(255, 255, 255, 0.75)',
            textShadow: ' 0 1px 0 #FFF',    //字体阴影
            textIndet: '10px'
        }
    }, //DatePicker 样式信息
    /*
    radioButtonBasicProperty.BackgroundColor = _StyConfig.BackgroundColor;
    radioButtonBasicProperty.ButtonColor = _StyConfig.ButtonColor;
    radioButtonBasicProperty.BorderColor = _StyConfig.BorderColor;
    radioButtonBasicProperty.FontColor=_StyConfig.FontColor;
    radioButtonBasicProperty.CheckedBackgroundColor = _StyConfig.CheckedBackgroundColor;
    radioButtonBasicProperty.CheckedButtonColor = _StyConfig.CheckedButtonColor;
    */
    单选按钮: {
        DefaultStyle: {
            BackgroundColor: { value: { background: "#f9f9f9"} },
            FontColor: "#000",
            ButtonColor: "#dadcdb",
            BorderColor: "#9f9f9f",
            CheckedBackgroundColor: { value: { background: "-webkit-gradient(linear,left top,left bottom,color-stop(0, rgb(237,237,237)),color-stop(1, rgb(215,215,215)))"} },
            CheckedButtonColor: "#dedede"

        },
        NewStyle: {
            BackgroundColor: { value: { background: "rgb(39, 244, 7)"} },
            FontColor: "#ff0",
            ButtonColor: "#ff8000",
            BorderColor: "#00f",
            CheckedBackgroundColor: { value: { background: "-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(229, 229, 229)), to(rgb(247, 7, 7)))"} },
            CheckedButtonColor: "#ff0"
        }
    },
    日期范围选择1: {
        DefaultStyle: {
            fontColor: "#000",
            fontSize: 12,
            bgColor: "#fff",
            titleColor: "#eee",
            titlebgColor: "#000000",
            selectedbgColor: "#17384d",
            selectedColor: "#eee",
            selectInmonth: "#000000",
            selectNotInmonth: "#b4b4b4",
            skinValue: "-webkit-gradient(linear,0% 0%, 0% 100%,from(#ffffff),to( #f9f9f9))"
        },
        NewStyle: {
            fontColor: "red",
            fontSize: 12,
            bgColor: "#f60",
            titleColor: "#ff0",
            titlebgColor: "#06f",
            selectedbgColor: "#60f",
            selectedColor: "#0ff",
            selectInmonth: "#00f",
            selectNotInmonth: "#0f0",
            skinValue: "-webkit-gradient(linear,left bottom,left top,color-stop(0,#ffffff),color-stop(100, #f0f))"
        }
    },
    复选框: {
        NormalStyle: {
            Alignment: "纵向", //"horizontal","vertical" 排列方向
            BorderColor: "#9f9f9f",
            ColumnsWidth: 250,
            RowHeight: 25,
            TopLeftFillet: 0,
            TopRightFillet: 0,
            BottomLeftFillet: 0,
            BottomRightFillet: 0,
            BackgroundColor: "#f9f9f9",
            SelectedBackgroundColor: "#dadada",
            CheckBoxColor: "#f9f9f9",
            SelectedCheckBoxColor: "#f9f9f9"
        }
    },

    联想输入框: {
        DefaultStyle: {
            //面板设置
            PanelFontSty: "'微软雅黑',Arial",
            PanelBgColor: "#ffffff",
            PanelBorderColor: "#9f9f9f",
            PanelSelectedColumnColor: "#ffffff",
            AssociativeDisplayRows: 10,
            //输入框设置
            InputFontColor: "#000000",
            InputBorderColor: "#9f9f9f",
            //按钮设置
            ButtonBgColor: "#b9b9b9",
            ButtonBorderColor: "#9f9f9f"

        },
        NewStyle: {
            //面板设置
            PanelFontSty: "'微软雅黑',Arial",
            PanelBgColor: "#0ff",
            PanelBorderColor: "#00f",
            PanelSelectedColumnColor: "#60f",
            AssociativeDisplayRows: 10,
            //输入框设置
            InputFontColor: "#f60",
            InputBorderColor: "#06f",
            //按钮设置
            ButtonBgColor: "#f00",
            ButtonBorderColor: "#ff0"

        }
    },
    日期范围选择2: {
        银色: {
            fontColor: "black",
            //            fontSize: 12,
            borderRadius: '5px',
            border: '1px  solid  #a7a7a7',
            backgroundw: "-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))",
            background: "-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))",
            bgColor: "",
            textIndet: '5px'
        }
    },
    数据表格: {
        银色: {
            //            titleBackgroungColor: '-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))',  //标题背景
            titleBackgroungColor: { "type": 2, "direction": "vertical", "stopMarker": [{ "position": 0, "color": "rgb(0, 0, 0)", "ahex": "edededff" }, { "position": 1, "color": "rgb(66, 48, 201)", "ahex": "cbcbcbff"}], "value": { "background": "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#ededed), to(#cbcbcb))"} },
            FootBackgroungColor: '-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))',  //底部背景
            titleFontColor: '#000000',  //标题字体颜色
            titleFontShadow: 'none',
            //            customRowColor: '#ffffff',  //间隔行背景颜色
            customRowColor: { type: 1, ahex: "ffffffff", hex: "ffffff", rgba: "rgba(255,0,0,1)", value: { background: "#ffffff"} },  //间隔行背景颜色
            //            customRowBgColor: "#e3e3e3",
            customRowBgColor: { type: 1, ahex: "e3e3e3ff", hex: "e3e3e3", rgba: "rgba(255,0,0,1)", value: { background: "#e3e3e3"} },
            hLineColor: '#aaaaaa',      //水平线颜色
            vLineColor: '#aaaaaa',     //垂直线颜色
            trColor: '#000000',
            titleBorderTop: '0px',
            titleBorderBottom: '0px',
            titleBorderRight: '0px',
            titleBorderLeft: '0px'
        },
        黑色: {
            //titleBackgroungColor: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#616c80), to(#2c3953))',  //标题背景
            titleBackgroungColor: { "type": 2, "direction": "vertical", "stopMarker": [{ "position": 0, "color": "rgb(0, 0, 0)", "ahex": "616c80ff" }, { "position": 1, "color": "rgb(66, 48, 201)", "ahex": "2c3953ff"}], "value": { "background": "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#616c80), to(#2c3953))"} },  //标题背景
            FootBackgroungColor: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#616c80), to(#2c3953))',  //标题背景
            titleFontColor: '#b7cdfa',  //标题字体颜色
            titleFontShadow: '0px 2px 2px #000',
            //customRowColor: '#202020',  //间隔行背景颜色
            customRowColor: { type: 1, ahex: "202020ff", hex: "202020", rgba: "rgba(0,0,0,1)", value: { background: "#202020"} },  //间隔行背景颜色
            //customRowBgColor: "#1b1b1b",
            customRowBgColor: { type: 1, ahex: "1b1b1bff", hex: "1b1b1b", rgba: "rgba(0,0,0,1)", value: { background: "#1b1b1b"} },
            hLineColor: '#2f2f2f',      //水平线颜色
            vLineColor: 'transparent',     //垂直线颜色
            trColor: '#ffffff',
            titleBorderTop: '1px solid #3f455b',
            titleBorderBottom: '1px solid #3f455b',
            titleBorderRight: '1px solid #27303f ',
            titleBorderLeft: '1px solid #465160  ',
            pageactiveborder: '1px solid #93bbda',
            pageactivebackground: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#000000), to(#393939))',
            pageactivecolor: '#ffffff',
            pagedefaultborder: '0px',
            pagedefaultbackground: 'transparent',
            pagedefaultcolor: '#ffffff'
        },
        黑白: {
            //titleBackgroungColor: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#323232), to(#0e0e0e))',  //标题背景
            titleBackgroungColor: { "type": 2, "direction": "vertical", "stopMarker": [{ "position": 0, "color": "rgb(0, 0, 0)", "ahex": "323232ff" }, { "position": 1, "color": "rgb(66, 48, 201)", "ahex": "0e0e0eff"}], "value": { "background": "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#323232), to(#0e0e0e))"} },  //标题背景
            FootBackgroungColor: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#323232), to(#0e0e0e))',  //标题背景
            titleFontColor: '#ffffff',  //标题字体颜色
            titleFontShadow: '0px 2px 2px #000',
            //            customRowColor: '#d6d5d5',  //间隔行背景颜色
            customRowColor: { type: 1, ahex: "d6d5d5ff", hex: "d6d5d5", rgba: "rgba(255,0,0,1)", value: { background: "#d6d5d5"} },  //间隔行背景颜色
            //            customRowBgColor: "#d6d5d5",
            customRowBgColor: { type: 1, ahex: "d6d5d5ff", hex: "d6d5d5", rgba: "rgba(255,0,0,1)", value: { background: "#d6d5d5"} },
            hLineColor: '#575757',      //水平线颜色
            vLineColor: '#575757',     //垂直线颜色
            trColor: '#000000',
            titleBorderTop: '1px solid #575757',
            titleBorderBottom: '1px solid #575757',
            titleBorderRight: '0px solid #27303f ',
            titleBorderLeft: '0px solid #465160  ',
            pageactiveborder: '1px solid #93bbda',
            pageactivebackground: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#000000), to(#393939))',
            pageactivecolor: '#ffffff',
            pagedefaultborder: '0px',
            pagedefaultbackground: 'transparent',
            pagedefaultcolor: '#ffffff'
        },
        灰色: {
            //            titleBackgroungColor: '-webkit-gradient(linear,left top,left bottom,color-stop(0, rgb(157,157,157)),color-stop(0.48, rgb(117,117,117)),color-stop(0.51, rgb(92,92,92)),color-stop(1, rgb(103,102,102)))',  //标题背景
            titleBackgroungColor: { "type": 2, "direction": "vertical", "stopMarker": [{ "position": 0, "color": "rgb(0, 0, 0)", "ahex": "9D9D9Dff" }, { "position": 1, "color": "rgb(66, 48, 201)", "ahex": "676666ff"}], "value": { "background": "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#9D9D9D), to(#676666))"} },  //标题背景
            FootBackgroungColor: '#cfcfcf',  //标题背景
            titleFontColor: '#ffffff',  //标题字体颜色
            titleFontShadow: 'none',
            //            customRowColor: '#262626',  //间隔行背景颜色
            customRowColor: { type: 1, ahex: "262626ff", hex: "262626", rgba: "rgba(255,0,0,1)", value: { background: "#262626"} },
            //            customRowBgColor: "#404040", //间隔行背景颜色
            customRowBgColor: { type: 1, ahex: "404040ff", hex: "404040", rgba: "rgba(255,0,0,1)", value: { background: "#404040"} },
            hLineColor: 'transparent',      //水平线颜色
            vLineColor: '#212121',     //垂直线颜色
            trColor: '#ffffff',
            titleBorderTop: '0px solid #212121',
            titleBorderBottom: '1px solid #212121',
            titleBorderRight: '0px solid #212121 ',
            titleBorderLeft: '1px solid #212121  '
        }
    }, //DataGrid 样式信息
    基本图表: {
        //        defaultsilver: {
        //            SeriesColors: ['#0084b6', '#eeae00', '#cb2900', '#228404', '#fdff00', '#522e91', '#0088b2', '#abe1fa', '#000000'], //Chart Series 默认颜色集合
        //            BackGroundfromColor: '#ffffff', //背景开始颜色
        //            BackGroundendColor: '#ffffff', //背景结束颜色
        //           // BorderColor: '000000', //边框颜色
        //            BorderWidth: 50, //边框宽度
        //            BorderRadius: 15, //边框圆角弧度
        //            XAxisLableEnable: true, //X轴，是否显示
        //            XAxisLableRotation: 40, //X轴,字体标签旋转角度
        //            XAxisLableAlign: 'left', //X轴,文字对齐方式
        //            XAxisLableFontFamily: 'arial,微软雅黑', //X轴,字体，可应用多字体，逗号隔开
        //            XAxisLableFontColor: '#000000', //X轴,字体颜色
        //            XAxisLineWidth:1, //X轴,线条宽度
        //            XAxisLineColor: '#d9d9d9', //X轴,线条颜色
        //            YAxisLableEnable: true, //Y轴，是否显示
        //            YAxisLableRotation: 0, //Y轴,文字旋转方向
        //            YAxisLableAlign: 'left', //Y轴,文字对齐方式
        //            YAxisLableFontFamily: 'arial,微软雅黑', //Y轴,文字字体，可应用多字体，逗号隔开
        //            YAxisLableFontColor: '#000000', //Y轴,文字颜色
        //            YAxisLineWidth: 1, //Y轴,线条宽度
        //            YAxislineColor: '#ffffff'//Y轴,线条颜色
        //        },
        //        grid: {
        //            SeriesColors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'], //Chart Series 默认颜色集合
        //            BackGroundfromColor: '#31d9fd', //背景开始颜色
        //            BackGroundendColor: '#16a1bf', //背景结束颜色
        //            BorderColor: '000000', //边框颜色
        //            BorderWidth: 0, //边框宽度
        //            BorderRadius: 15, //边框圆角弧度
        //            XAxisLableEnable: false, //X轴，是否显示
        //            XAxisLableRotation: 40, //X轴,字体标签旋转角度
        //            XAxisLableAlign: 'left', //X轴,文字对齐方式
        //            XAxisLableFontFamily: 'arial,微软雅黑', //X轴,字体，可应用多字体，逗号隔开
        //            XAxisLableFontColor: '#ffffff', //X轴,字体颜色
        //            XAxisLineWidth: 2, //X轴,线条宽度
        //            XAxisLineColor: '#dedcdc', //X轴,线条颜色
        //            YAxisLableEnable: true, //Y轴，是否显示
        //            YAxisLableRotation: 0, //Y轴,文字旋转方向
        //            YAxisLableAlign: 'left', //Y轴,文字对齐方式
        //            YAxisLableFontFamily: 'arial,微软雅黑', //Y轴,文字字体，可应用多字体，逗号隔开
        //            YAxisLableFontColor: '#ffffff', //Y轴,文字颜色
        //            YAxisLineWidth: 2, //Y轴,线条宽度
        //            YAxislineColor: '#dedcdc'//Y轴,线条颜色
        //        },
        //        darkblue: {
        //            SeriesColors: ["#DDDF0D", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"], //Chart Series 默认颜色集合
        //            BackGroundfromColor: 'rgb(48,48,96)', //背景开始颜色
        //            BackGroundendColor: 'rgb(0,0,0)', //背景结束颜色
        //            BorderColor: '000000', //边框颜色
        //            BorderWidth: 0, //边框宽度
        //            BorderRadius: 15, //边框圆角弧度
        //            XAxisLableEnable: true, //X轴，是否显示
        //            XAxisLableRotation: 40, //X轴,字体标签旋转角度
        //            XAxisLableAlign: 'left', //X轴,文字对齐方式
        //            XAxisLableFontFamily: 'arial,微软雅黑', //X轴,字体，可应用多字体，逗号隔开
        //            XAxisLableFontColor: '#A0A0A0', //X轴,字体颜色
        //            XAxisLineWidth: 2, //X轴,线条宽度
        //            XAxisLineColor: '#A0A0A0', //X轴,线条颜色
        //            YAxisLableEnable: true, //Y轴，是否显示
        //            YAxisLableRotation: 0, //Y轴,文字旋转方向
        //            YAxisLableAlign: 'left', //Y轴,文字对齐方式
        //            YAxisLableFontFamily: 'arial,微软雅黑', //Y轴,文字字体，可应用多字体，逗号隔开
        //            YAxisLableFontColor: '#A0A0A0', //Y轴,文字颜色
        //            YAxisLineWidth: 1, //Y轴,线条宽度
        //            YAxislineColor: '#A0A0A0'//Y轴,线条颜色
        //        },
        银色: {
            SeriesColors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'], //Chart Series 默认颜色集合
            BackGroundfromColor: '#ededed', //背景开始颜色
            BackGroundendColor: '#cbcbcb', //背景结束颜色
            BorderColor: '#a7a7a7', //边框颜色
            BorderWidth: 0, //边框宽度
            BorderRadius: 15, //边框圆角弧度
            XAxisLableEnable: true, //X轴，是否显示
            XAxisLableRotation: 40, //X轴,字体标签旋转角度
            XAxisLableAlign: 'left', //X轴,文字对齐方式
            XAxisLableFontFamily: 'arial,微软雅黑', //X轴,字体，可应用多字体，逗号隔开
            XAxisLableFontColor: '#000000', //X轴,字体颜色
            XAxisLineWidth: 1, //X轴,线条宽度
            XAxisLineColor: '#737272', //X轴,线条颜色
            YAxisLableEnable: true, //Y轴，是否显示
            YAxisLableRotation: 0, //Y轴,文字旋转方向
            YAxisLableAlign: 'right', //Y轴,文字对齐方式
            YAxisLableFontFamily: 'arial,微软雅黑', //Y轴,文字字体，可应用多字体，逗号隔开
            YAxisLableFontColor: '#000000', //Y轴,文字颜色
            YAxisLineWidth: 1, //Y轴,线条宽度
            YAxislineColor: '#737272', //Y轴,线条颜色
            YAxisTitleEnable: false, //Y轴，标题是否显示
            YAxisTitleText: '',
            YAxisTitlefontWeight: true,
            YAxisTitleFontFamily: 'arial,微软雅黑',
            YAxisTitlecolor: '#000000',
            YAxisTitleFontSize: '12px',
            YAxistickWidth: 2
        },
        透明: {
            SeriesColors: ["#670164", "#005b11", "#b00404", "#b07d04", "#0257d2", "#a84802", "#b2b000"], //Chart Series 默认颜色集合
            BackGroundfromColor: '', //背景开始颜色
            BackGroundendColor: '', //背景结束颜色
            BorderColor: '', //边框颜色
            BorderWidth: 0, //边框宽度
            BorderRadius: 15, //边框圆角弧度
            XAxisLableEnable: false, //X轴，是否显示
            XAxisLableRotation: 40, //X轴,字体标签旋转角度
            XAxisLableAlign: 'left', //X轴,文字对齐方式
            XAxisLableFontFamily: 'arial,微软雅黑', //X轴,字体，可应用多字体，逗号隔开
            XAxisLableFontColor: '#404040', //X轴,字体颜色
            XAxisLineWidth: 2, //X轴,线条宽度
            XAxisLineColor: '#737272', //X轴,线条颜色
            YAxisLableEnable: true, //Y轴，是否显示
            YAxisLableRotation: 0, //Y轴,文字旋转方向
            YAxisLableAlign: 'right', //Y轴,文字对齐方式
            YAxisLableFontFamily: 'arial,微软雅黑', //Y轴,文字字体，可应用多字体，逗号隔开
            YAxisLableFontColor: '#404040', //Y轴,文字颜色
            YAxisLineWidth: 0, //Y轴,线条宽度
            YAxislineColor: '#737272', //Y轴,线条颜色
            YAxisTitleEnable: false, //Y轴，标题是否显示
            YAxisTitleText: '',
            YAxisTitlefontWeight: true,
            YAxisTitleFontFamily: 'arial,微软雅黑',
            YAxisTitlecolor: '#000000',
            YAxisTitleFontSize: '12px',
            YAxistickWidth: 2
        }
    }, //BasicChart 样式信息
    圆形仪表盘: {
        银色: {
            //刻度圆圈
            colorrange: "000000",
            //填充颜色
            fillcolor: 'fefefe,cecece,b1b1b1',
            tooltipbgcolor: 'ffffff',
            fillratio: '1,90,99',
            //字体颜色
            basefontcolor: '000000',
            //长刻度颜色
            majortmcolor: 'ffffff',
            //短刻度颜色
            minortmcolor: 'ffffff'
        }
    }, //圆形仪表盘
    半圆仪表盘: {
        银色: {
            colorrange: "f4f5f7,dfe1e6,a5a9b6"
        }
    }, //半圆仪表盘
    温度计: {
        银色: {
            fillangle: '0',
            fillpattern: 'linear',
            fillalpha: '0',
            BackGround:{
                ahex: "cbcbcb",
                hex: "cbcbcb",
                rgba: "rgba(203,203,203,1)",
                type: 1,
                value: { background: "rgba(203,203,203,1)" }
            }
        }
    }, //温度计
    实时标签: {
        银色: {
            _LableBgColor: "", //实时label背景色
            _LableFontColor: "Black", //字体颜色
            _LableBorderColor: "#000", //边框色
            //            _LableFontSize: "12", //字体大小
            background: "-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))",
            _FontWeight: "Normal", //字体粗细
            _LabLT: 0, // 左上圆角
            _LabRT: 0, //右上圆角
            _LabLB: 0, //左下圆角
            _LabRB: 0, //右下圆角
            textIndet: '5px'
        }
    }, // 实时Label
    过程能力信息: {
        银色: {
            background: '-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))',    //背景
            border: '1px  solid  #a7a7a7',   //边框
            borderRadius: '3px',  //圆角大小
            bigFontColor: '#343d3d'
        }
    },
    过程能力摘要: {
        银色: {
            border: "1px solid #c2c2c4", //边框
            backgroundColor: "none", //背景颜色
            background: "-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))", //背景
            color: "#000", //字体颜色
            titlebackground: "none",
            fontFamily: "微软雅黑", //字体风格
            fontSize: "14px", //字体大小
            boxShadow: "0 0 1px #7c7c7c", //边框阴影
            borderRadius: "2px", //圆角
            titleBorderBottom: "1px solid #c2c2c4", //标题下方的边框线
            titleFontWeight: "bold", //标题是字体粗细
            titleColor: "black"//标题的字体颜色
        },
        黑色: {
            border: "none", //边框
            borderbottom: "none",
            backgroundColor: "none", //背景颜色
            background: "rgba(244,244,246,0.1)", //背景
            titlebackground: "rgba(244,244,246,0.2)",
            color: "#fff", //字体颜色
            fontFamily: "微软雅黑", //字体风格
            fontSize: "12px", //字体大小
            boxShadow: "0 0 1px #7c7c7c", //边框阴影
            borderRadius: "2px", //圆角
            titleBorderBottom: "1px solid #c2c2c4", //标题下方的边框线
            titleFontWeight: "bold", //标题是字体粗细
            titleColor: "black"//标题的字体颜色
        }

    }, //Spc中的PCLabel
    过程能力摘要1: {
        银色: {
            border: "1px solid #c2c2c4", //边框
            backgroundColor: "none", //背景颜色
            background: "-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))", //背景
            color: "#000", //字体颜色
            titlebackground: "none",
            fontFamily: "微软雅黑", //字体风格
            fontSize: "14px", //字体大小
            boxShadow: "0 0 1px #7c7c7c", //边框阴影
            borderRadius: "2px", //圆角
            titleBorderBottom: "1px solid #c2c2c4", //标题下方的边框线
            titleFontWeight: "bold", //标题是字体粗细
            titleColor: "black"//标题的字体颜色
        },
        黑色: {
            border: "none", //边框
            borderbottom: "none",
            backgroundColor: "none", //背景颜色
            background: "rgba(244,244,246,0.1)", //背景
            titlebackground: "rgba(244,244,246,0.2)",
            color: "#fff", //字体颜色
            fontFamily: "微软雅黑", //字体风格
            fontSize: "12px", //字体大小
            boxShadow: "0 0 1px #7c7c7c", //边框阴影
            borderRadius: "2px", //圆角
            titleBorderBottom: "1px solid #c2c2c4", //标题下方的边框线
            titleFontWeight: "bold", //标题是字体粗细
            titleColor: "black"//标题的字体颜色
        }
    }, //Spc中的PCLabel
    KPI面板: {
        银色: {
            background: "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#F2F2F2), to(#D8D8D8))",
            border: "1px solid #A7A7A7",
            borderRadius: "0px",
            boxShadow: "none",
            OneColor: "#565d66",
            TwoColor: "#050507"
        }
    },
    均值极差图: {
        //    银色{
        //                backgroundColor:"#fff",
        //                plotBackgroundColor"#fff",
        //                seriescolorandlineColorandmarkerfillColor:"#48a84f",
        //                colorstops0:"rgba(72,168,79,0.2)",
        //                 colorstops100:"rgba(72,168,79,0.2)",
        //                crosshaircolor:"#909497",
        //                yAxislineColor:"#95a7b2",
        //                labelcolor:"#909596"
        //            },
        黑色: {
            backgroundColor: "transparent",
            plotBackgroundColor: "transparent",
            seriescolorandlineColorandmarkerfillColor: "#ffba00",
            colorstops0: "rgba(170,188,255,0.3)",
            colorstops100: "rgba(43,48,55,0.3)",
            crosshaircolor: "#909596",
            AlllineColor: "#909596",
            labelcolor: "#909596",
            UCLLinecolor: "#d40237",
            CLLinecolor: "#00a31b",
            LCLLinecolor: "#d40237",
            YAxisTitleColor: "#fff",
            XYFontColor: "#fff"
        }
    },
    新复选框: {
        银色: {
            borderRadius: 5,
            /*渐变：从上到下  0%  #ededed ; 100%  # cbcbcb内阴影：（上下左右）# ffffff  1px    75% 不透明度;*/
            background: '-webkit-gradient(linear, 0% 0%, 0% 75%, from(#ededed), to(#cbcbcb))',
            /*投影：（下） # ffffff  1px    75%透明度;*/
            borderColor: '#a7a7a7',
            FontColor: "#000",
            CheckBoxBackground: "#fff"
        }
    }
};
