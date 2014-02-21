//关于控件自定义事件的配置
Namespace.register("Agi.Script");
Agi.Script.BaseConfig = {
    //所有控件都会有的基本事件
    baseEventsForControls:[
        {
            type:'all', //页面/控件都会有的
            key:'loaded',
            name:'加载完成',
            title:'根据控件不同,这个事件需要在每个控件内部激活'
        },
        {
            type:'all',
            key:'click',
            name:'单击',
            title:'这个事件已经在外部添加了激活点,控件内部无需激活'
        },
        {
            type:'control', //只有控件会有的
            key:'loading',
            name:'控件加载时',
            title:'这个事件已经在外部添加了激活点,控件内部无需激活'
        },
        {
            type:'control', //只有控件会有的
            key:'mouseenter',
            name:'鼠标进入',
            title:'这个事件已经在外部添加了激活点,控件内部无需激活'
        },
        {
            type:'control', //只有控件会有的
            key:'dragend',
            name:'拖动结束',
            title:'这个事件已经在外部添加了激活点,控件内部无需激活'
        }
    ],
    //各个控件的个性化事件
    customEventsForControls:[
        {
            controlType:'canvas',
            events:[
                {
                    key:'timer',
                    name:'画布的定时器',
                    title:'这个是只有画布才会有的事件'
                },
                {
                    key:'pageLoading',
                    name:'页面加载时',
                    title:'在所有控件绘制之前触发'
                }
            ]
        },
        //panel控件
        {
            controlType:'Panel',
            events:[]
        },
        //下拉列表控件
        {
            controlType:'DropDownList',
            events:[
                {
                    key:'selectValueChanged',
                    name:'选择值改变',
                    title:'无'
                }
            ]
        },
        //DataGrid控件
        {
            controlType:'DataGrid',
            events:[
                {
                    key:'rowSelected',
                    name:'行选中事件',
                    title:'无'
                },
                {
                    key:'selectedDataDrag',
                    name:'选中数据拖动事件',
                    title:'无'
                }
            ]
        },
        //ODChart控件
        {
            controlType:'ODChart',
            events:[
                {
                    key:'redraw',
                    name:'重绘事件',
                    title:'这里一般指highchart控件的redraw事件'
                },
                {
                    key:'updateAllSeries',
                    name:'series更新',
                    title:'通过tooltip面板修改serie类型或者颜色后触发'
                }
            ]
        },
        //SpcDemoODChart
        {
            controlType:'SpcDemoODChart',
            events:[
                {
                    key:'redraw',
                    name:'重绘事件',
                    title:'这里一般指highchart控件的redraw事件'
                },
                {
                    key:'updateAllSeries',
                    name:'series更新',
                    title:'通过tooltip面板修改serie类型或者颜色后触发'
                }
            ]
        }
    ],
    //通用方法
    commonLibs:[
        {
            name:'动画库',
            title:'动画库',
            methods:[
                {
                    name:'获取DOM元素',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'var element = animate.get(control);' +
                        '});',
                    title:'获取DOM元素'
                },
                {
                    name:'获取jQuery对象',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'var $obj = animate.get$(control);' +
                        '});',
                    title:'获取jQuery对象'
                },
                {
                    name:'隐藏画布',
                    methodCode:'$("#workspace").css("opacity", 0);',
                    title:'隐藏画布'
                },
                {
                    name:'显示画布',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'animate.showWorkspace();' +
                        '});',
                    title:'显示画布'
                },
                {
                    name:'自定义',
                    methodCode:'agi.using(["my/animate","jquery/transit","jquery/easing"], function (animate,transit,easing) {' +
                        '/*' +
                        '自定义代码' +
                        '*/' +
                        '});',
                    title:'自定义'
                },
                {
                    name:'闪烁',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'animate.flash(control, duration, count);' +
                        '});',
                    title:'闪烁'
                },
                {
                    name:'旋转',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'animate.rotate(control, angle, duration, count);' +
                        '});',
                    title:'旋转'
                }   ,
                {
                    name:'移动',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'animate.move(control, direction, px, isRevert);' +
                        '});',
                    title:'移动'
                },
                {
                    name:'缩放',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'animate.scale(control, zoom, isRevert);' +
                        '});',
                    title:'缩放'
                },
                {
                    name:'可见',
                    methodCode:'agi.using(["my/animate"], function (animate) {' +
                        'animate.visible(control, visible, duration);' +
                        '});',
                    title:'可见'
                }
            ]
        },
        {
            name:'通用库',
            title:'通用的方法都可以在这里添加',
            methods:[
                {
                    name:'更新关系数据源(*)',
                    methodCode:'Agi.Script.Utility.updateRelationData([con1,con2]);\n',
                    title:'更新关系数据源:绑定了关系实体的控件需要实现一个 ReBindRelationData() 方法,并在内部重绑数据!'
                },
                {
                    name:'动态注册点位号(*)',
                    methodCode:'Agi.Script.Utility.registTagNamesForControls([con1...],[pt1...]);\n',
                    title:'注册点位号:所有实体控件需要实现一个 AddTagNames(con,tagNames) 方法,并在内部绑定传入的点位值!'
                },
                {
                    name:'配置图表数据线',
                    methodCode:'Agi.Script.Utility.highChartSeriesConfigable(this);\n',
                    title:'目前只针对 均值/极差控件'
                },
                //
                {
                    name:'控件左右滑动切换(旧版)',
                    methodCode:'Agi.Script.Utility.flowControlsExpand([[con1],[con2]]);\n',
                    title:'可用在所有控件上'
                },
                {
                    name:'控件左右滑动切换(新版)',
                    methodCode:'Agi.Script.Utility.flowControlsExpand2(animate,[[con1],[con2]]);\n',
                    title:'可用在所有控件上 创建了 .swipeGroup 层'
                },
                {
                    name:'控件缩放手势',
                    methodCode:'Agi.Script.Utility.transformingControl(animate, [con1],function(animate){/*放大时的回调*/},function(animate){/*缩小时的回调*/});\n',
                    title:'可用在所有控件上'
                },
                {
                    name:'grid垂直滚动条支持ipad',
                    methodCode:'Agi.Script.Utility.datagridSupplyScroll(this);\n',
                    title:'只能用于数据表格控件上'
                },
                {
                    name:'图表手势圈选数据',
                    methodCode:'Agi.Script.Utility.chartGestureExpand1(chart1,chart2,grid);\n',
                    title:'图表手势圈选数据'
                },
                {
                    name:'为所选的控件加点击切换的效果',
                    methodCode:'Agi.Script.Utility.groupControls(animate, controlArray, buttonArr, defaultShowIndex,otherControls);\n',
                    title:'为所选的控件加点击切换的效果'
                },
                {
                    name:'为所选控件加上水平滑动的效果',
                    methodCode:'Agi.Script.Utility.scrollableForControls(animate, controlArray);\n',
                    title:'为所选控件加上水平滑动的效果'
                }
            ]
        }
    ]
};