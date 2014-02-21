//function createNode(){
//  var root = {
//    "id" : "0",
//    "text" : "root",
//    "value" : "86",
//    "showcheck" : true,
//    complete : true,
//    "isexpand" : true,
//    "checkstate" : 0,
//    "hasChildren" : true
//  };
//  var arr = [];
//  for(var i= 1;i<100; i++){
//    var subarr = [];
//    for(var j=1;j<100;j++){
//      var value = "node-" + i + "-" + j;
//      subarr.push( {
//         "id" : value,
//         "text" : value,
//         "value" : value,
//         "showcheck" : true,
//         complete : true,
//         "isexpand" : false,
//         "checkstate" : 0,
//         "hasChildren" : false
//      });
//    }
//    arr.push( {
//      "id" : "node-" + i,
//      "text" : "node-" + i,
//      "value" : "node-" + i,
//      "showcheck" : true,
//      complete : true,
//      "isexpand" : false,
//      "checkstate" : 0,
//      "hasChildren" : true,
//      "ChildNodes" : subarr
//    });
//  }
//  root["ChildNodes"] = arr;
//  return root;
//}
var ErrorData=[{'no':1,'name':'分类1','items':[  {'no':11,'name':'分类11','items':[{'no':111,'name':'分类111','items':[]}]},
        {'no':12,'name':'分类12','items':[{'no':121,'name':'分类121','items':[]}]}
    ]
},
    {
        'no':2,
        'name':'分类2',
        'items':
            [
                {'no':21,'name':'分类21','items':[{'no':211,'name':'分类211','items':[]}]},
                {'no':22,'name':'分类22','items':[{'no':221,'name':'分类221','items':[]}]}
            ]
    }
]
function createErrorNode(){
    var root = {
        "id" : "0",
        "text" : "根节点",
        "value" : "0",
        "showcheck" : true,
        complete : true,
        "isexpand" : true,
        "checkstate" : 0,
        "hasChildren" : true,
        ChildNodes:[]
    };
    if(ErrorData!=null && ErrorData.length>0){
        //{'no':11,'name':'分类11','items':[{'no':111,'name':'分类111','items':[]}]
        var NewNode=null;
        AddChildrenNode(root,ErrorData);
    }
    return root;
}
function AddChildrenNode(_ParentNode,_SubItems){
    var NewNode=null;
    for(var i=0;i<_SubItems.length;i++){
        NewNode={
            "id" :_SubItems[i].no+"",
            "text" :_SubItems[i].name,
            "value" :_SubItems[i].no+"",
            "showcheck" : true,
            complete : true,
            "isexpand" : true,
            "checkstate" : 0,
            "hasChildren" : true,
            ChildNodes:[]
        }
        if(_SubItems[i].items!=null && _SubItems[i].items.length>0){
            AddChildrenNode(NewNode,_SubItems[i].items);
        }else{
            NewNode.hasChildren=false;
        }
        _ParentNode.ChildNodes.push(NewNode);
    }
}
treedata = [createErrorNode()];
