/**
 * Created with JetBrains WebStorm.
 * User: Yi
 * Date: 13-3-6
 * Time: 上午11:46
 * To change this template use File | Settings | File Templates.
 */
define(["ly/highlight"],function (highlight) {
    return {
        doFill:function (control,grid) {
            var $control = $(control.Get("HTMLElement"));
            var ParentObj = $("#workspace");
            var PagePars = {Width:ParentObj.width(), Height:ParentObj.height(),
                Left:ParentObj.offset().left, Top:ParentObj.offset().top};
            var ThisControlPars = {Width:$control.width(), Height:$control.height(),
                Left:($control.offset().left - PagePars.Left), Top:($control.offset().top - PagePars.Top),
                Right:0, Bottom:0};
            ThisControlPars.Right = (PagePars.Width - ThisControlPars.Width - ThisControlPars.Left);
            ThisControlPars.Bottom = (PagePars.Height - ThisControlPars.Height - ThisControlPars.Top);
            var oldPosition = {
                Left:ThisControlPars.Left,
                Top:ThisControlPars.Top,
                Right:ThisControlPars.Right,
                Bottom:ThisControlPars.Bottom
            };
            var controlPositionState = "old";
            $control.dblclick(function () {
                if (controlPositionState === "old") {
                    /*最大化*/
                    var newPosition = {
                        Left:0,
                        Top:0,
                        Right:0,
                        Bottom:0
                    };
                    control.PostionChange(newPosition);
                    control.Refresh();
                    highlight.doHighlight(control, grid);
                    controlPositionState = "new";
                    for (var i = 0; i < Agi.view.workspace.controlList.array.length; i++) {
                        var tempControl = Agi.view.workspace.controlList.array[i];
                        if (tempControl.Get("HTMLElement").id.indexOf($control[0].id) === -1) {
                            $(tempControl.Get("HTMLElement")).hide();
                        }
                    }
                }
                else {
                    /*还原*/
                    /* $control.css({
                     left:oldPosition.left,
                     right:oldPosition.right,
                     width:oldPosition.width,
                     height:oldPosition.height
                     });*/
                    control.PostionChange(oldPosition);
                    control.Refresh();
                    highlight.doHighlight(control, grid);
                    controlPositionState = "old";
                    for (var i = 0; i < Agi.view.workspace.controlList.array.length; i++) {
                        var tempControl = Agi.view.workspace.controlList.array[i];
                        $(tempControl.Get("HTMLElement")).show();
                    }
                }
            });
        }
    };
});