/*
 * 权限管理部分涉及的方法
 * 使用到的后台接口
 * 
 */


/**
 * index.html页面打开时加载页面所有button、资源的权限 
 */
 function call_qpcPageLoad(strPers){
 	try{ 
		var jsonData = {"userId":"身份证"};
		var jsonString = JSON.stringify(jsonData); //将json对象转换成字符串，用于提交给后台
		Agi.DAL.ReadData({
		    "MethodName": "qpcPageLoad", "Paras": jsonString, "CallBackFunction": res_qpcPageLoad});
 	} catch(e){
 		console.log("Call_qpcPageLoad : " + e);
 		console.trace();
 	}
 }

 /**
  * Call_qpcPageLoad方法的回调函数
  * */
 function res_qpcPageLoad(result){
  	try{ 
  		//返回值非‘非对象’；返回值存在；返回值正常‘==true’
		if(result!= undefined && result!=null && result.result=="true"){
			//处理Top部分的Button对象“显隐”
			if(result.showTopButton!=undefined && result.showTopButton!=null && result.showTopButton!="" && result.showTopButton.length>0){
				res_qpcPageLoad_00(result.showTopButton);
			}
			//处理Left部分的Button对象“显隐”
			if(result.showLeftButton!=undefined && result.showLeftButton!=null && result.showLeftButton!="" && result.showLeftButton.length>0){
				res_qpcPageLoad_00(result.showLeftButton);
			}
			//处理Left部分的Button对象“显隐”
			if(result.showRightButton!=undefined && result.showRightButton!=null && result.showRightButton!="" && result.showRightButton.length>0){
				res_qpcPageLoad_00(result.showRightButton);
			}
			//处理Edite部分的Button对象“显隐”
			if(result.showEditPagLeftButton!=undefined && result.showEditPagLeftButton!=null && result.showEditPagLeftButton!="" && result.showEditPagLeftButton.length>0){
				res_qpcPageLoad_00(result.showEditPagLeftButton);
			}
		}
 	} catch(e){
 		console.log("res_qpcPageLoad : " + e);
 		console.trace();
 	}
 }
 /**
  * 被res_qpcPageLoad方法调用
  * 处理控件的显隐
  * */
 function res_qpcPageLoad_00(jsons){
 	try{ 
		for(var i=0; i<jsons.length; i++){
			var jsObj = jsons[i];
			var id = jsObj.items;
			var eee = "#" + id;
			$(eee).show();
		}
 	} catch(e){
 		console.log("res_qpcPageLoad_00 : " + e);
 		console.trace();
 	}
 }
 
 /**
  * 页面加载过程中隐藏button
  * */
 function dis_JunHideAll(pers){
 	try{ 
		$("#database_plus").hide();
		$("#virtual").hide();
		$("#dataset").hide();
		$("#dashboardspc").hide();
		$("#DrawerMenu_Group").hide();
		$("#DrawerMenu_ReAndR").hide();
		$("#AddVTManage").hide();
		$("#DrawerMenu_MyDataSets").hide();
		$("#DrawerMenu_PageManage").hide();
		$("#DrawerMenu_ResourceManage").hide();
		$("#MainDatasourceDiv").hide();
		$("#MainVirtualtableDiv").hide();
		$("#MainDatasetsDiv").hide();
		$("#MainSPCPageDiv").hide();
		$("#MainSourceDiv").hide();
		$("#EpDrawerMenu_RealTimeDataSource").hide();
		$("#EpDrawerMenu_Dataset").hide();
 	} catch(e){
 		console.log("dis_JunHideAll : " + e);
 		console.trace();
 	}
 }