/**
chart grid 交互
*/
define(function(){
    var grid = null;
    return {
        //单击一个点后，这个方法会被触发
        highLightGridCell: function(pointValue,control){
           if(control){
               grid = control.grid;
           }
           if(grid){
//              debugger;
              window.wijgrid = grid;
               //var selection = grid.wijgrid("selection");
               //var pageSize =
               //var $row = $(grid.data('wijgrid')._rows().item(4)),
               //$panel = grid.closest('.wijmo-wijgrid').find('.wijmo-wijsuperpanel');

               //$panel.wijsuperpanel('vScrollTo', $row.position().top);

               //grid.wijgrid('selection').addRange(0, index, 0xFFFFFF, index);

               //定位到哪一页
               var pointIndex = pointValue.x - 1;
               if(pointIndex >= 0){
                   var pageSize = grid.wijgrid('option','pageSize');
                   var pageIndex = parseInt(pointIndex/pageSize);
                   grid.wijgrid('option','pageIndex',pageIndex);//定位



                   //定位到行
                   var rowIndex = pointIndex - (pageIndex* pageSize);
                   grid.find('tbody>tr>td').css({'background-color':''});
                   var $row = $(grid.data('wijgrid')._rows().item(rowIndex));
                    //变化颜色
                   $row.first().find('td').css({'background-color':'yellow'});//
               }
           }
        }
    }
});
