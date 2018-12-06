/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
cbx.namespace('canvas.metadata');
/**
 * 
 */
canvas.metadata.zolog=function(){
	var ZOLOG_SEARCH_DATA=new Array();
 	var ZOLOG_ENTL_SEARCH_DATA = new Array();
 	var entlMenus = new Array();
 	var menusArray  = null;
 	
 	function checkChildMenu(iMenus){
 		for(var j=0;j<iMenus.length;j++){
 			var iChildArr=iMenus[j];
 			if(iChildArr.child_nodes.length>0){
 				checkChildMenu(iChildArr.child_nodes);
 			}
 			else{
 				addEntlMenu(iChildArr);
 			}
 		}
 	}

 	function addEntlMenu(iChildMenu){
 		if(entlMenus.indexOf(iChildMenu.item_id)==-1){
 			entlMenus.push(iChildMenu.item_id);	
 		}
 	}

	if(menusArray != null && menusArray != undefined ) {
		for(var i=0;i<menusArray.length;i++){
			var iMenuArr=menusArray[i];
		 	if(iMenuArr.child_nodes.length>0){
		 		checkChildMenu(iMenuArr.child_nodes);
		 	}
		}
	}
	
	
	return {
		/**
		 * 
		 */
		setZologMetaData : function(zologMetaData){
			ZOLOG_SEARCH_DATA = zologMetaData;
			if(ZOLOG_SEARCH_DATA != "" && ZOLOG_SEARCH_DATA != null ){
				for(var k=0;k<ZOLOG_SEARCH_DATA.length;k++){
					if(ZOLOG_SEARCH_DATA[k]!=null){
						if(ZOLOG_SEARCH_DATA[k].ITEM_TYPE=="FORM"){
							if(entlMenus.indexOf(ZOLOG_SEARCH_DATA[k].WS_MENU_ID)!==-1){
								ZOLOG_ENTL_SEARCH_DATA.push(ZOLOG_SEARCH_DATA[k]);  
							}
						}
						else {
							 ZOLOG_ENTL_SEARCH_DATA.push(ZOLOG_SEARCH_DATA[k]);
						}
					}
				}
			}
		},
		/**
		 * 
		 */
		getZologMetadata:function(){
			return ZOLOG_ENTL_SEARCH_DATA;
		}
	 };
	
}();
