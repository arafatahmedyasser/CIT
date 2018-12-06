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
 

cbx.ns("cbx.lib.view");
/*
* This class contains the library specific widget container component inside the workspace. Called by the layoutManager.
*/
cbx.lib.view.app = Class(cbx.core.Component, {
/*
* Initializes the widget container.
*/
	viewMD: '',
	groupViewObject: null,
	widgetID: '',
	workspaceID: '',
	bundleKey : null,
	renderedApps :[],
	constructor: function(config) {
		cbx.lib.view.app.$super.call(this);
		this.viewMD = config.viewMD;
		this.renderedApps=[];
		this.widgetID = config.widgetId;
		this.workspaceID = config.workspaceId;
		var groupViewConfig = {
			"eleType" : "div",
			"id" : this.viewMD.VIEW_ID,
			"class" : "grid_view_icons appcontainer-margin",
			"style" : {
				"display" : "block",
				"width": "100%",
				"overflow": "hidden"
			}
		}
		this.groupViewObject = new cbx.lib.layer(groupViewConfig);
		var metaData = cbx.appContainerMetadata.getAppContainerMetadata(this.widgetID);
		//this.bundleKey = metaData.BUNDLE_KEY;
		if(metaData){
			var childApps= metaData.CHILD_APPS?metaData.CHILD_APPS:[];
			var appIdArray=[];
			if(cbx.isArray(childApps)){
				for(var i=0;i<childApps.length;i++){
					appIdArray.push(childApps[i].APP_ID);
				}
			}
			this.headerListener = appIdArray;
			
			//this.registerListener('iconlistener', this.iconListener, this);
			this.createDashBoardIcons(childApps);
		}
	}, 
	createDashBoardIcons: function(dashBoardIconArray) {
		
		//var rb = IRB.getBundle(IRB.CUSER);
		var rb = CRB.getFWBundle();
		var that = this;
		var len = cbx.isArray(dashBoardIconArray)?dashBoardIconArray.length:0;
		var tempIcon;
		if(dashBoardIconArray.length < 1){
			var msg = '<b>'+rb['LBL_APP_NOT_FOUND']+'</b>';
			$(this.groupViewObject.getLayer()).html(msg);
		}
		else{
			for ( var icon = 0; icon <  dashBoardIconArray.length; icon++) {
				if(this.renderedApps.contains(dashBoardIconArray[icon].APP_ID)){
					LOGGER.error("duplicate configuration for :"+dashBoardIconArray[icon].APP_ID+" in the "
							+"app container: "+this.widgetID	
					);
				}
				else{
					var iconConfig = {
							"parentElem": that,
							"iconlistener": 'iconlistener',
							"icondata": dashBoardIconArray[icon],
							"additionalClass":"favapp-icon"+(icon+1)
					};
					iconConfig.icondata["BUNDLE_KEY"] = cbx.appContainerMetadata.getAppContainerMetadata(this.widgetID).bundleKey;
					iconConfig.icondata["idSuffix"]="-appcontainer"
						tempIcon = this.headerListener[icon]; 
					var iconObject = new cbx.lib.view.icon(iconConfig);
					var t = iconObject.getIconControlDOM();
					$(t).on('click',{"count":icon},function(event) {
						var scope= {
								evt :	event,
								appDetails :dashBoardIconArray[event.data.count] 
						}
						that.iconListener(scope);
					});
					//iconObject.addLayer(iconDiv);
					this.getGroupViewComponent().appendChild(t);
					this.renderedApps.push(dashBoardIconArray[icon].APP_ID);
				}
			}
		}
	},
		
	getGroupViewComponent: function() {
		return this.groupViewObject.getLayer();
	},

	iconListener: function(scope) {
		new cbx.lib.appContainerHandler(scope);
		
	}
	
});
CLCR.registerCmp({'COMP_TYPE':'APP'}, cbx.lib.view.app);
