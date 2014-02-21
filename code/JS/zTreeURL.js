/**
* Created with JetBrains WebStorm.
* User: wulei
* Date: 12-9-24
* Time: 下午10:41
* To change this template use File | Settings | File Templates.
*/
var isParent = true;
  function getDwChildren(){
     var footNodeGroupID = "";
    Agi.GroupManager.RGLoad('','0',function(result){
        var AllGroup=result.GroupName;
        if(AllGroup != null){
            footNodeGroupID ="[";
            $.each(AllGroup,function(i,val){
                footNodeGroupID+= "{id:"+i+",pId:-1,name:"+"'"+AllGroup[i].GroupID+"'"+",open:true,isParent:"+isParent+"},";
            });
            footNodeGroupID=footNodeGroupID.substring(0,footNodeGroupID.length-1);
            footNodeGroupID+="]";
        }
  });
     return footNodeGroupID

}
