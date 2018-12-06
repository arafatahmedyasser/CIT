/**
* Copyright 2015. Intellect Design Arena Limited. All rights reserved. 

 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 

 * @version 1
 */

cbx.ns("ct.core.dock");
/**
 * This singleton is the controller for app dock and canvas dock.
 */
ct.core.dock.controller = function(){
return ({
	/**
	 * This method will initialize the app dock model
	 */
	initializeAppDock : function (wsId,layoutId){
		var appArr = cbx.core.ws.metadata.getAppsByLayoutId(wsId,layoutId);
		var homeIconDisplayed =canvas.metadata.applicationLayout.isLandingPageRequired(); 
		var dockedAppsArr = [];
		if(homeIconDisplayed){
		var appIcon = {
					isHomeIcon : 'Y'		
		};
		dockedAppsArr.push(appIcon);
		}
		
		for(var i=0;i<appArr.length;i++){
		if(appArr[i].CLOSED_IND == 'Y'){
			var rb = CRB.getBundle(appArr[i].WIDGET_BUNDLE_KEY);
			if(rb!=null){
					var label = rb[appArr[i].WIDGET_ID]?rb[appArr[i].WIDGET_ID]:appArr[i].WGT_TITLE;
				}
		var dockedApp = {
					id : appArr[i].WIDGET_ID,
					label : label
		};
		dockedAppsArr.push(dockedApp);
		}
		}
		CCDM.populateAppDockModel(dockedAppsArr);
	},
	/**
	 * This method will initialize the canvas dock model
	 */
	initializeCanvasDock : function (){
			var wsManager = iportal.workspace.metadata.getWorkspaceManager();
			if (wsManager != null && wsManager.items.length!=0) {
				for (var i = 0; i < wsManager.items.length; i++) {
					var canvasDockItemConfig = {
								canvasId : 	wsManager.getComponent(i).itemId,
								canvasLabel : wsManager.getComponent(i).title,
								canvasIndex : i
							};
					CCDM.addToCanvasDockModel(canvasDockItemConfig);
					}	
			}
			if (iportal.systempreferences.getDesignCanvasInd())	{ 
				var designYourCanvasItemConfig = {
							canvasId : 	'addnewworkspace',
							canvasLabel : CRB.getFWBundle()['LBL_DYC']
				};
			CCDM.addToCanvasDockModel(designYourCanvasItemConfig);
			} 
		}
});
}();