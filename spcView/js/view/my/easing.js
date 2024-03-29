/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-12-3
 * Time: 上午11:41
 * 说明: 缓动函数
 * 公司: 蓝智科技
 */
agi.namespace(function () {
    return {
        easingDic:{
            /*liuyi
             use:  easingDic["easeOutCubic"]
             * from: matthewlein.com/ceaser
             */
            "easeInCubic ":"cubic-bezier(.550,.055,.675,.190)",
            'easeOutCubic':'cubic-bezier(.215,.61,.355,1)',
            'easeInOutCubic':'cubic-bezier(.645,.045,.355,1)',
            'easeInCirc':'cubic-bezier(.6,.04,.98,.335)',
            'easeOutCirc':'cubic-bezier(.075,.82,.165,1)',
            'easeInOutCirc':'cubic-bezier(.785,.135,.15,.86)',
            'easeInExpo':'cubic-bezier(.95,.05,.795,.035)',
            'easeOutExpo':'cubic-bezier(.19,1,.22,1)',
            'easeInOutExpo':'cubic-bezier(1,0,0,1)',
            'easeInQuad':'cubic-bezier(.55,.085,.68,.53)',
            'easeOutQuad':'cubic-bezier(.25,.46,.45,.94)',
            'easeInOutQuad':'cubic-bezier(.455,.03,.515,.955)',
            'easeInQuart':'cubic-bezier(.895,.03,.685,.22)',
            'easeOutQuart':'cubic-bezier(.165,.84,.44,1)',
            'easeInOutQuart':'cubic-bezier(.77,0,.175,1)',
            'easeInQuint':'cubic-bezier(.755,.05,.855,.06)',
            'easeOutQuint':'cubic-bezier(.23,1,.32,1)',
            'easeInOutQuint':'cubic-bezier(.86,0,.07,1)',
            'easeInSine':'cubic-bezier(.47,0,.745,.715)',
            'easeOutSine':'cubic-bezier(.39,.575,.565,1)',
            'easeInOutSine':'cubic-bezier(.445,.05,.55,.95)',
            'easeInBack':'cubic-bezier(.6,-.28,.735,.045)',
            'easeOutBack':'cubic-bezier(.175, .885,.32,1.275)',
            'easeInOutBack':'cubic-bezier(.68,-.55,.265,1.55)'
        }
    };
});