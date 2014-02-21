/**
 * Created with JetBrains WebStorm.
 * User: Liuyi
 * Date: 12-11-12
 * Time: 上午11:00
 * 说明: 动画库
 * 公司: 蓝智科技
 */
agi.namespace(["jquery/transit", "my/easing"], function (transit, easing) {
    return {
        easing:easing.easingDic,
        hideWorkspace:function () {
            $("#workspace").css("opacity", 0);
        },
        showWorkspace:function () {
            $("#workspace").css("opacity", 1);
        },
        get:function (asControl) {
            if (typeof asControl === "string") {
                $("#" + asControl).show();
                return asControl;
            }
            else {
                $("#" + asControl.Get("HTMLElement").id).show();
                return asControl.Get("HTMLElement").id;
            }
        },
        get$:function (asControl) {
            if (typeof asControl === "string") {
                $("#" + asControl).show();
                return  $("#" + asControl);
            }
            else {
                $("#" + asControl.Get("HTMLElement").id).show();
                return  $("#" + asControl.Get("HTMLElement").id);
            }
        },
        flash:function (id, duration, count) {
            id = this.get(id);
            //定义动画
            var animationCSS = "animated flash";
            //实现动画
            $("#" + id)
                .css({
                    "-webkit-animation-duration":parseInt(duration) / 1000 + "s",
                    "-webkit-animation-iteration-count":count.toString()
                })
                .removeClass(animationCSS)
                .addClass(animationCSS);
            this.clear(id, animationCSS, duration, count);
        },
        clear:function (id, animationCSS, duration, count) {
            window.setTimeout(
                function () {
                    $("#" + id).removeClass(animationCSS);
                },
                parseInt(duration) * parseInt(count)
            );
        },
        rotate:function (id, angle, duration, count) {
            id = this.get(id);
            var animation = this;
            agi.using(["jquery/transit"], function (transit) {
                $("#" + id)
                    .transition(
                    {
                        rotate:"+=" + angle + "deg"
                    },
                    duration,
                    function () {
                        count--;
                        if (count > 0) {
                            animation.rotate(id, angle, duration, count);
                        }
                    }
                );
            });
            return this;
        },
        move:function (id, direction, px, isRevert) {
            id = this.get(id);
            var animation = this;
            agi.using(["jquery/transit"], function (transit) {
                switch (direction) {
                    case "left":
                        $("#" + id)
                            .transition(
                            {
                                x:"-=" + px + "px"
                            },
                            function () {
                                if (isRevert) {
                                    animation.move(id, "right", px, false);
                                }
                            }
                        );
                        break;
                    case "right":
                        $("#" + id)
                            .transition(
                            {
                                x:"+=" + px + "px"
                            },
                            function () {
                                if (isRevert) {
                                    animation.move(id, "left", px, false);
                                }
                            }
                        );
                        break;
                    case "up":
                        $("#" + id)
                            .transition(
                            {
                                y:"-=" + px + "px"
                            },
                            function () {
                                if (isRevert) {
                                    animation.move(id, "down", px, false);
                                }
                            }
                        );
                        break;
                    case "down":
                        $("#" + id)
                            .transition(
                            {
                                y:"+=" + px + "px"
                            },
                            function () {
                                if (isRevert) {
                                    animation.move(id, "up", px, false);
                                }
                            }
                        );
                        break;
                }
            });
            return this;
        },
        scale:function (id, zoom, isRevert) {
            id = this.get(id);
            var animation = this;
            agi.using(["jquery/transit"], function (transit) {
                $("#" + id)
                    .transition(
                    {
                        scale:"+=" + zoom
                    },
                    function () {
                        if (isRevert) {
                            animation.scale(id, -zoom, false);
                        }
                    }
                );
            });
            return this;
        },
        visible:function (id, visible, duration) {
            id = this.get(id);
            var animation = this;
            agi.using(["jquery/transit"], function (transit) {
                if (visible) {
                    $("#" + id)
                        .transition(
                        {
                            opacity:1
                        },
                        duration
                    );
                }
                else {
                    $("#" + id)
                        .transition(
                        {
                            opacity:0
                        },
                        duration
                    );
                }
            });
            return this;
        }
    };
});
/*
 * 示例*/
/* agi.using(["animate"], function (animate) {animate.flash("control_Id1234", "3s", 1);})
 */

