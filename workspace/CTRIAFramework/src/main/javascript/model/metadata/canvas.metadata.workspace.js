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
cbx.namespace("iportal.workspace.metadata");
cbx.namespace("cbx.core.ws");
cbx.namespace('iportal.workspace');
/**
 * 
 */
iportal.workspace.metadata = function() {
	var CATALOG_CACHE = [];
	var APPLICATION_NODES_STR = null;
	var APPLICATION_NODE = {};
	var CATALOG_REQUIRED = false;
	var that = this;
	var CONTROLLER_URL = null;
	var CONTEXT_ROOT = null;
	var WS_MANAGER = null;
	var viewPortId = null;
	var WS_CHANGE_ACCEPTABLE = true;
	var LOADED_WS_MAP = new Object();
	var CURRENT_WS_ID="";
	var WS_CUSTOMSPACE_BLOCKPOSITION = new Object();
	var ADDITIONAL_NODES_STR = '{"WORKSPACES":[{"CUSTOMSPACE_BLOCKPOSITION":"RIGHT","OD_GCIF":"-1","OD_PRODUCT":"CUSER","OD_SUB_PRODUCT":"CUSER","OD_USER_NO":"-1","POSITION":"1","SYSTEM_WORKSPACE_IND":"Y","WORKSPACE_ACTIVATE_HANDLER":"","WORKSPACE_DISPLAY_NM":"ADDITIONAL WORKSPACE","WORKSPACE_ID":"ADDITIONAL_REQUEST",	"WORKSPACE_LAYOUT":"STACK","WD_CHANNEL_ID":"M,T","CHILD_LAYOUTS":[{"CHILD_WIDGETS":"","LAYOUT_DISPLAY_NM":"LBL_ADDITIONAL_DISPLAY","LAYOUT_LAYOUT":"STACK","OD_SUB_PRODUCT":"CUSER","LAYOUT_PROPORTION":"33,84","OD_USER_NO":"-1","POSITION":"1","OD_PRODUCT":"CUSER","LAYOUT_ID":"ADDITIONAL_DISPLAY","OD_GCIF":"-1","CONTEXT_APP_WIDGET":"","LD_CHANNEL_ID":"M,T"}]}]}';
	var device = null;
	var CURR_WS_OBJ = null;
	var CURR_LYT_ID = '';
	var CURR_LYT_OBJ = null;
	var LAYOUT_MANAGER=null;
	var WS_CMP = null;
	var APP_DOCK = null;
	var cardMasterScreen = false;
	return ({
		/**
		 * 
		 */
		setApplicationNodeStr : function (applicationNode){
			if (!cbx.isEmpty(applicationNode) && !cbx.isEmpty(applicationNode.WORKSPACES)) {
				var deviceWorkspaces = [];
				for (var i = 0; i < applicationNode.WORKSPACES.length; i++) {
					var actualDevice;
					var configDevice = [];
					var deviceflag = false;
					if (applicationNode.WORKSPACES[i].WD_CHANNEL_ID != null) {
						if (applicationNode.WORKSPACES[i].WD_CHANNEL_ID
								.indexOf(",") != -1) {
							configDevice = applicationNode.WORKSPACES[i].WD_CHANNEL_ID
									.split(",");
						} else {
							actualDevice = applicationNode.WORKSPACES[i].WD_CHANNEL_ID;
						}
						if (configDevice.length > 0) {
							for (var j = 0; j < configDevice.length; j++) {
								if (configDevice[j] == this.getDevice()
										|| actualDevice == this.getDevice())
									deviceflag = true;
							}
						} else if (actualDevice == this.getDevice()) {
							deviceflag = true;
						}
						if (deviceflag
								|| applicationNode.WORKSPACES[i].WD_CHANNEL_ID
										.toString() == 'A') {
							deviceWorkspaces
									.push(applicationNode.WORKSPACES[i]);
						}
					}
				}
				APPLICATION_NODE = {
						WORKSPACES:deviceWorkspaces
				}
				
				/**
				 * Constructing a Global variable(obj) to save the state of the
				 * Workspace,i.e the jsfiles of that particular ws have been loaded or not.
				 */
				for ( var i = 0; i < APPLICATION_NODE.WORKSPACES.length; i++) {
					var wsId = APPLICATION_NODE.WORKSPACES[i].WORKSPACE_ID.toString();
					LOADED_WS_MAP[wsId] = "false";
				}
				/**
				 * Handling the workspace wise --> custom space in menu panel. This will
				 * give the key-value pair object in the form of "WorkspaceId Vs
				 * CUSTOMSPACE_BLOCKPOSITION" Example : {PYMNTS:RIGHT, LQDY:CENTER}
				 */
				if (APPLICATION_NODE.WORKSPACES != null) {
					var appNodes = APPLICATION_NODE.WORKSPACES;
					for ( var i = 0; i < appNodes.length; i++) {
						if (appNodes[i].WORKSPACE_ID != null) {
							WS_CUSTOMSPACE_BLOCKPOSITION[appNodes[i].WORKSPACE_ID] = appNodes[i].CUSTOMSPACE_BLOCKPOSITION;
						}
					}
				}
			}
		},
		setAppDock: function(appDock)
		{
			APP_DOCK = appDock;
		},
		setContextRoot  : function (contextRoot){
			CONTEXT_ROOT = contextRoot;
		},
		getContextRoot  : function (){
			return CONTEXT_ROOT;
		},
		
		/**
		 * 
		 */
		setControllerUrl : function (controllerUrl){
			CONTROLLER_URL = controllerUrl;
		},
		/**
		 * 
		 */
		getAppDock: function(){
			return APP_DOCK;
		},
		getWorkspaces : function() {
			var appNodes = APPLICATION_NODE.WORKSPACES;
			if (appNodes != null) {
				return appNodes;
			} else
				return [];
		},
		setWorkspace : function(wsMd){
			if(wsMd){
				APPLICATION_NODE.WORKSPACES.push(wsMd);
			}
		},
		/**
		 * 
		 */
		deleteCustomWorkspaceById : function(workspaceId) {
			var appNodes = APPLICATION_NODE.WORKSPACES;
			for ( var i = 0; i < appNodes.length; i++) {
				if (appNodes[i].WORKSPACE_ID != null
						&& appNodes[i].WORKSPACE_ID == workspaceId) {
					appNodes.splice(i, 1);
					APPLICATION_NODE.WORKSPACES = appNodes;
					break;
				}
			}
			if(WS_MANAGER.items){
				var wsManagerItems = WS_MANAGER.items.items;
				for ( var i = 0; i < wsManagerItems.length; i++) {
					if (wsManagerItems[i].itemId != null
							&& wsManagerItems[i].itemId == workspaceId) {
						wsManagerItems.splice(i, 1);
						WS_MANAGER.items.items = wsManagerItems;
						WS_MANAGER.items.length = WS_MANAGER.items.items.length;
						break;
					}
				}
			}
		},
		/**
		 * This method returns the custom_menu_space's blockPosition if only if
		 * the given input workspace_id is valid Otherwise returns null
		 * 
		 * @param ws_Id :
		 *            denotes the WORKSPACE_ID returns : custom_menus_space's
		 *            blockPosition for the given input workspace.
		 */
		getCustomMenuSpaceValue : function(ws_Id) {
			if (cbx.isEmpty(ws_Id) || ws_Id === 'null')
				return null;
			else
				return WS_CUSTOMSPACE_BLOCKPOSITION[ws_Id];
		},
		/**
		 * This method returns the boolean value 'true' if only if the given
		 * workspace (workspace_id) have the custom Menu Space. Otherwise
		 * returns 'false'.
		 * 
		 * @param ws_Id -
		 *            denotes the WORKSPACE_ID returns - boolean
		 */
		isCustomMenuSpaceAvailable : function(ws_Id) {
			if (cbx.isEmpty(ws_Id) || ws_Id === 'null')
				return false;
			else {
				if (WS_CUSTOMSPACE_BLOCKPOSITION[ws_Id] != 'null'
						&& !cbx.isEmpty(WS_CUSTOMSPACE_BLOCKPOSITION[ws_Id])) {
					return true;
				} else {
					return false;
				}
			}
		},
		
		/**
		 * 
		 */
		getController : function() {
			return CONTROLLER_URL;
		},
		
		/**
		 * 
		 */
		getApplicationLayout : function() {
			var layout = iportal.preferences.getLayout();
			if (layout != null && layout != 'null') {
				return layout.toUpperCase();
			} else {
				return 'TAB';
			}
		},
		
		/**
		 * 
		 */
		setUpdatedWS : function(widArr) {
			var widgetsArr = widArr[0].Widgets;
			var layoutId = widArr[0].Layout_ID;
			var layoutObj = iportal.workspace.metadata
					.getUpdatedLayoutDef(layoutId);
			var widgetlist = layoutObj.CHILD_WIDGETS;
			for ( var k = 0; k < widgetlist.length; k++) {
				for ( var l = 0; l < widgetsArr.length; l++) {
					if (widgetlist[k].WIDGET_ID == widgetsArr[l].WIDGET_ID) {
						widgetsArr[l].CLOSED_IND = 'N';
						cbx.apply(widgetlist[k], widgetsArr[l]);
					}
				}
			}
		},
		
		/**
		 * 
		 */
		getUpdatedWS : function() {
			var wsID = iportal.workspace.metadata.getCurrentWorkspaceId();
			var appNodes = APPLICATION_NODE.WORKSPACES;
			var wsMetadata;
			for ( var i = 0; i < appNodes.length; i++) {
				if (appNodes[i].WORKSPACE_ID == wsID) {
					wsMetadata = appNodes[i];
				} 
				else if ((appNodes[i].SYSTEM_WORKSPACE_ID !== null)
						&& (appNodes[i].SYSTEM_WORKSPACE_ID !== "")) {
					if (appNodes[i].SYSTEM_WORKSPACE_ID == wsID) {
						wsMetadata = appNodes[i];
					}
				}
			}
			return wsMetadata;
		},
		
		/**
		 * 
		 */
		getUpdatedLayoutDef : function(layoutId,wsId) {
			var wsObj = wsId?this.getWorkSpaceById(wsId):this.getUpdatedWS();
			if (wsObj != null && wsObj.CHILD_LAYOUTS != null) {
				for ( var i = 0; i < wsObj.CHILD_LAYOUTS.length; i++) {
					if (wsObj.CHILD_LAYOUTS[i].LAYOUT_ID == layoutId) {
						return wsObj.CHILD_LAYOUTS[i];
					}
				}
			}
		},

		/**
		 * will be used to apply the configuration to the
		 * widget(corresponding to the widgetId) in the layout specified by the layoutId
		 */
		updateWidgetDef : function(layoutId, widgetId, conf) {
			var layoutObj = iportal.workspace.metadata.getUpdatedLayoutDef(layoutId);
			if (layoutObj != null && layoutObj.CHILD_WIDGETS != null) {
				for ( var i = 0; i < layoutObj.CHILD_WIDGETS.length; i++) {
					if (layoutObj.CHILD_WIDGETS[i].WIDGET_ID == widgetId) {
						cbx.apply(layoutObj.CHILD_WIDGETS[i], conf);
					}
				}
			}
		},
		
		/**
		 * 
		 */
		getWorkSpaceById : function(wsid) {
			var appNodes = APPLICATION_NODE.WORKSPACES;
			if (appNodes != null) {
				for ( var i = 0; i < appNodes.length; i++) {
					if (null != appNodes[i].WORKSPACE_ID
							&& appNodes[i].WORKSPACE_ID == wsid) {
						return appNodes[i];
					}
				}
			} else {
				return {};
			}
		},
		
		/**
		 * 
		 */
		getSystemWorkspaces : function() {
			var appNodes = APPLICATION_NODE.WORKSPACES;
			var wsArr = [];
			if (appNodes != null) {
				for ( var i = 0; i < appNodes.length; i++) {
					if (null != appNodes[i] && appNodes[i].SYSTEM_WORKSPACE_IND === 'Y') {
						wsArr.push(appNodes[i].WORKSPACE_ID);
					}
				}
			}
			return wsArr;
		},
		/**
		 * 
		 */
		getWorkspacesDetail : function() {
			var appNodes = APPLICATION_NODE.WORKSPACES;
			var wsArr = [];
			if (appNodes != null) {
				for ( var i = 0; i < appNodes.length; i++) {
					if (null != appNodes[i]) {
						var wsobj ={};
						var wstitle = cbx.isEmpty(CRB.getBundleValue(appNodes[i].BUNDLE_KEY, appNodes[i].WORKSPACE_DISPLAY_NM)) ? 
									appNodes[i].WORKSPACE_DISPLAY_NM : CRB.getBundleValue(appNodes[i].BUNDLE_KEY, appNodes[i].WORKSPACE_DISPLAY_NM);  
						wsobj['WORKSPACE_ID'] = appNodes[i].WORKSPACE_ID;
						wsobj['WORKSPACE_DISPLAY_NM'] = wstitle;
						wsobj['SYSTEM_WORKSPACE_IND'] = appNodes[i].SYSTEM_WORKSPACE_IND;
						wsArr.push(wsobj);
					}
				}
			}
			return cbx.encode(wsArr);
		},
		
		/**
		 * 
		 */
		setWorkspaceManager : function(obj) {
			WS_MANAGER = obj;
			return obj;
		},
		/**
		 * 
		 */
		getWorkspaceManager : function() {
			cbx.apply(WS_MANAGER, {
				'jsloader' : true
			});
			return WS_MANAGER;
		},

		/**
		 * method will retrieve the id of the current
		 * workspace from the WS_MANAGER object if it exists otherwise retrieves
		 * it from the metadata
		 */
		getCurrentWorkspaceId : function() {
			var wsId = null;
			if(CURRENT_WS_ID!==""){
				wsId=CURRENT_WS_ID;
			}else{
			if (WS_MANAGER != null) {
				
	    			  if(WS_MANAGER.getActiveTab && WS_MANAGER.getActiveTab())
					wsId = WS_MANAGER.getActiveTab().itemId;
	    			  else
					wsId = null;
				
			} else {
				if(cbx.core.ws.metadata.getWorkspaces().length!=0)					
					{
				wsId = cbx.core.ws.metadata
						.getWorkspaces()[0].WORKSPACE_ID;}
				else
					wsId = "";
			} 																		
			}
			if (wsId != null) {
				var wsObj = cbx.core.ws.metadata
						.getWorkSpaceById(wsId);
				if (wsObj != null) {
					if (wsObj.SYSTEM_WORKSPACE_ID != null
							&& wsObj.SYSTEM_WORKSPACE_ID.length > 0) {
						return wsObj.SYSTEM_WORKSPACE_ID;
					} 
					else {
						return wsId;
					}
				} 
				else {
					return null;
				}
			}
		},
		getCurrentWorkspaceLayout : function(){
			return CURR_WS_OBJ.wsMD.WORKSPACE_LAYOUT;
		},
		/**
		 * 
		 */
		getCurrentWorkspaceTitle : function() {
			var wsTitle = null;
			if (WS_MANAGER != null && WS_MANAGER.getActiveTab()) {
				if(cbx.core.ws.metadata.getWorkspaces().length!=0)									
				{
				wsTitle = CRB.getBundleValue(iportal.workspace.metadata.getWorkspaces()[0].BUNDLE_KEY,WS_MANAGER.getActiveTab().title);
				}
				else
					wsTitle = "";
				} else {
					if(cbx.core.ws.metadata.getWorkspaces().length!=0)
					{
				wsTitle = CRB.getBundleValue(iportal.workspace.metadata.getWorkspaces()[0].BUNDLE_KEY,iportal.workspace.metadata.getWorkspaces()[0].WORKSPACE_DISPLAY_NM);
			}
					else
						wsTitle = "";
				}																					
		
			try{
			if(WS_MANAGER.getComponent(0).getItemId()=="MASTER_PANEL"){
				wsTitle='';
			}			
			}catch(e){
				return wsTitle;
			}
			return wsTitle;
		},

		/**
		 * for getting title for widget , by passing widget id and current workspace id
		 */
		getCurrentWidgetTitleByID : function(currWs,wgtId)
		{
			var widgetsInWs = iportal.workspace.metadata.getWidgetsByWorkspaceId(currWs);
			for ( var i = 0; i < widgetsInWs.length; i++){
				if(wgtId==widgetsInWs[i].WIDGET_ID){
					var title = CRB.getBundle(widgetsInWs[i].WIDGET_BUNDLE_KEY)[widgetsInWs[i].WGT_TITLE];
					return cbx.isEmpty(title) ? widgetsInWs[i].WGT_TITLE : title; 
				}
			}
			
		},
		
		/**
		 * 
		 */
		getCurrentWorkspace : function() {
			var wsObj = null; 
		   	  if(WS_MANAGER!=null && cbx.isEmpty(CURR_WS_OBJ)){	
		   		 if(WS_MANAGER.getActiveTab && WS_MANAGER.getActiveTab()){
		   			wsObj = WS_MANAGER.getActiveTab()
				} 
				 else{return null};  
		   	  }else if(!cbx.isEmpty(CURR_WS_OBJ)){
		   			wsObj = CURR_WS_OBJ;
			  } 
				else {
					return null;
				}
		   	  return wsObj
		},
		
		/**
		 * 
		 */
		addToCatalogCache : function(config) {
			CATALOG_CACHE.push(config);
		},
		
		/**
		 * 
		 */
		getCatalogCache : function() {
			return CATALOG_CACHE;
		},
		
		/**
		 * 
		 */
		resetCatalofCache : function() {
			CATALOG_CACHE = [];
		},
		
		/**
		 * 
		 */
		isWidgetCatalogRequired : function() {
		//Removed the explicit application layout type check
			if (canvas.metadata.applicationLayout.isAppDockRequired()) {
				CATALOG_REQUIRED = true; 
			}
			return CATALOG_REQUIRED;
		},
		isCardMasterScreen : function(){
			return cardMasterScreen ; 
		},
		setCardMasterScreen: function(inCardMasterScreen){
			cardMasterScreen = inCardMasterScreen
		},
		/**
		 * flag at application level for enabling and disabling the workspace switching.
		 */
		getWorkspaceChangeAcceptable : function() {
			return WS_CHANGE_ACCEPTABLE;
		},
		
		/**
		 * flag at application level for enabling and disabling the workspace switching
		 */
		setWorkspaceChangeAcceptable : function(value) {
			WS_CHANGE_ACCEPTABLE = value;
			/**
			 * Hiding the load mask if the value has been set to true
			 */
			if (value === true && iportal.workspaceDestroyMask) {
				iportal.workspaceDestroyMask.hide();
			}
		},
		
		/**
		 * 
		 */
		getWorkspaceIndex : function(wrkspcId) {
			var appNodes = APPLICATION_NODE.WORKSPACES;
			if (appNodes != null) {
				var index = 0;
				for ( var i = 0; i < appNodes.length; i++) {
					if (appNodes[i].WORKSPACE_ID == wrkspcId) {
						var layout = iportal.preferences.getLayout();
						//Replacing the explicit application layout type check with the value from the configuration
						var masterScreenRequired = canvas.metadata.applicationLayout.isLandingPageRequired();
						//The following null check is redundant. PropertyValidations has already taken care of ensuring that layout is not null
						if (layout != null && layout != 'null'
								&& masterScreenRequired) {
							return i + 1;
						} 
						else {
							return i;
						}
					}
				}
				return index;
			} 
			else {
				return 0;
			}
		},
		
		/**
		 * 
		 */
		getResizeInd : function(widgetId, layoutId) {
			var layoutObj = iportal.workspace.metadata
					.getUpdatedLayoutDef(layoutId);
			if (!cbx.isEmpty(layoutObj)) {
				var widgetList = layoutObj.CHILD_WIDGETS;
				for ( var i = 0; i < widgetList.length; i++) {
					if (widgetList[i].WIDGET_ID == widgetId) {
						return widgetList[i].RESIZE_IND;
					}
				}
			}
		},
		
		/**
		 * 
		 */
		getWidgetHeaderInd : function(widgetId, layoutId) {
			var layoutObj = iportal.workspace.metadata
					.getUpdatedLayoutDef(layoutId);
			if (!cbx.isEmpty(layoutObj)) {
				var widgetList = layoutObj.CHILD_WIDGETS;
				for ( var i = 0; i < widgetList.length; i++) {
					if (widgetList[i].WIDGET_ID == widgetId) {
						if (widgetList[i].WGT_HEADER_IND === "N") {
							return false;
						} 
						else {
							return true;
						}
					}
				}
			}
			return true;
		},
		
		/**
		 * 
		 */
		getWidgetHtInPixels : function (widgetId, layoutId){
			if(cbx.isEmpty(layoutId)){
				var ws = iportal.workspace.metadata.getWorkspaces();
				for(var i=0; i<ws.length;i++){
					var layouts = ws[i].CHILD_LAYOUTS;
					for(var j=0; j<layouts.length;j++){
						var childWGT = layouts[j].CHILD_WIDGETS;
						for(var k =0; k<childWGT.length;k++){
							if(widgetId == childWGT[k].WIDGET_ID){
								return childWGT[k].WIDGET_PXL_HT;
							}
						}
						//iportal.workspace.metadata.getWidgetHtInPixels(widgetId,layouts[j].LAYOUT_ID);
					}
				}
			}
			else {
				var layoutObj = iportal.workspace.metadata.getUpdatedLayoutDef(layoutId);
				
				
				if(!cbx.isEmpty(layoutObj)){
				
				var widgetList = layoutObj.CHILD_WIDGETS;
					for ( var i = 0; i < widgetList.length; i++) {
						if (widgetList[i].WIDGET_ID == widgetId) {
							return widgetList[i].WIDGET_PXL_HT;
						}
					}
				}			
			}
		},
		
		getWidgetHtOnRows : function (widgetId , layoutId) 
		{
			  var layoutObj = iportal.workspace.metadata.getUpdatedLayoutDef(layoutId);
			  if(!Ext.isEmpty(layoutObj))
			  {
			    var widgetList = layoutObj.CHILD_WIDGETS;
			    for ( var i = 0; i < widgetList.length; i++) 
			    {
			    	if (widgetList[i].WIDGET_ID == widgetId) 
			    	{
			     		return widgetList[i].NO_OF_ROWS;
			    	}
			   }
			  }
		},		
		
		/**
		 * 
		 */
		setContainerChildWgtMD : function(childWgts) {
			CHILD_WGTS = childWgts;
		},
		
		/**
		 * 
		 */
		isContainerChildWgtEntitled : function(widgetId) {
			var entitled = false;
			for ( var i = 0; i < CHILD_WGTS.length; i++) {
				if (CHILD_WGTS[i].WIDGET_ID == widgetId) {
					if (CHILD_WGTS[i].IS_ENTITLED == 'Y') {
						entitled = true;
						break;
					}
				}
			}
			return entitled;
		},
		
		/**
		 * 
		 */
		isContainerChildWgt : function(widgetId) {
			var iscontainerChildWgt = false;
			for ( var i = 0; i < CHILD_WGTS.length; i++) {
				if (CHILD_WGTS[i].WIDGET_ID == widgetId) {
					iscontainerChildWgt = true;
					break;
				}
			}
			return iscontainerChildWgt;
		},

		/**
		 * 
		 */
		getLoadedWsMap : function(wsId) {
			return LOADED_WS_MAP[wsId];
		},
		setLoadedWsMap : function(wsId, value) {
			LOADED_WS_MAP[wsId] = value;
		},
		getContextApp : function(lId,wsId){
			var lDef = cbx.core.ws.metadata.getUpdatedLayoutDef(lId,wsId);
			if (!cbx.isEmpty(lDef)) {
				return lDef.CONTEXT_APP_WIDGET;
			}
			return false;
		},
		getNumberOfApps : function(widgetId, layoutId) {
			var numberOfApps = 3;
			var layoutObj = iportal.workspace.metadata.getUpdatedLayoutDef(layoutId);
			if (!cbx.isEmpty(layoutObj)) {
				var widgetList = layoutObj.CHILD_WIDGETS;
				for ( var i = 0; i < widgetList.length; i++) {
					if (widgetList[i].WIDGET_ID == widgetId) {
						numberOfApps = Number(widgetList[i].APPS_IN_A_ROW);
					}
				}
			}
			return numberOfApps;
		},
		
		/**
		 * 
		 */
		getCurrentLayout : function() {
			return CURR_LYT_OBJ?CURR_LYT_OBJ:iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer()?
											       iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().ownerCt:null;
		},
		
		/**
		 * 
		 */
		getCurrentLayoutId : function() {
			return CURR_LYT_ID?CURR_LYT_ID:this.getCurrentLayout().itemId.substring(0,this.getCurrentLayout().itemId.indexOf("_LAYOUT_CONTAINER"));
		},
		
		/**
		 * 
		 */
		getDefaultWidgetInd : function(widgetId, layoutId) {
			var isDefaultWidget = false;
			var layoutObj = iportal.workspace.metadata.getUpdatedLayoutDef(layoutId);
			if (!cbx.isEmpty(layoutObj)) {
				var widgetList = layoutObj.CHILD_WIDGETS;
				for ( var i = 0; i < widgetList.length; i++) {
					if (widgetList[i].WIDGET_ID == widgetId) {
						isDefaultWidget = widgetList[i].DEFAULT_WIDGET_IND === "Y" ? true
								: false;
					}
				}
			}
			return isDefaultWidget;
		},
		setWorkspaceComponent : function(obj){
			WS_CMP = obj;
			iportal.workspace.metadata.setWorkspaceManager(obj);
		},
		getWorkspaceComponent : function(){
			return WS_CMP;
		},
		getTfdReqInd : function(wsId){
			var wsConf = this.getWorkSpaceById(wsId);
			if(wsConf && !cbx.isEmpty(wsId)){
				return (wsConf.TFD_REQ==="Y")?true:false;
			}
			return true;
		},
		setCurrentWorkspaceId: function(wsId){
			CURRENT_WS_ID=wsId;
		},
		/**
		 * 
		 */
		setLayoutManager:function(obj){
			LAYOUT_MANAGER=obj;
			return obj;
		},
		/**
		 * 
		 */
		getLayoutManager : function() {
			return LAYOUT_MANAGER;
		},
		getLayoutsForWS:function(wsID){
			var  wsId=null;
			var appNodes = APPLICATION_NODE.WORKSPACES;
			if(wsID == undefined){
				wsId = iportal.workspace.metadata.getCurrentWorkspaceId();
			}
			else {
				wsId=wsID;
			}
			if(appNodes!=null){
				var layouts=[];
				
				/*for ( var i = 0; i < appNodes.length; i++) {
					if(appNodes[i].WORKSPACE_ID == wsId){
						layouts=appNodes[i].CHILD_LAYOUTS;
					}
				}*/
				
				for ( var i = 0; i < appNodes.length; i++) {
					if(appNodes[i].WORKSPACE_ID == wsId){
						for (var j=0; j<appNodes[i].CHILD_LAYOUTS.length; j++ ){
							var actualDevice;
							var configDevice=[];
							var deviceflag=false;
							if(appNodes[i].CHILD_LAYOUTS[j].LD_CHANNEL_ID!=null){
							if(appNodes[i].CHILD_LAYOUTS[j].LD_CHANNEL_ID.indexOf(",") != -1){
								configDevice=appNodes[i].CHILD_LAYOUTS[j].LD_CHANNEL_ID.split(",");
							}else{
								actualDevice=appNodes[i].CHILD_LAYOUTS[j].LD_CHANNEL_ID;
				}
							if(configDevice.length>0){
							for(var k=0; k<configDevice.length; k++){
							if(configDevice[k]==device || actualDevice==device)
								deviceflag=true;
			}
							}else if(actualDevice==device){
								deviceflag=true;
							}
							if( deviceflag || appNodes[i].CHILD_LAYOUTS[j].LD_CHANNEL_ID == 'A'){
								layouts.push(appNodes[i].CHILD_LAYOUTS[j]);
							}
							}
						}	
						}
					}
				
				return layouts;
			} else {
				return [];
			}
		},
		upgradeWidgetVersion : function (widgetId, versionNo){
			var appNodes = APPLICATION_NODE.WORKSPACES;
			var layouts,widgets,layout,widget
	 		if(appNodes!=null){
	 	  		for(var i=0; i< appNodes.length; i++){
	 	  			layouts=appNodes[i].CHILD_LAYOUTS
	 	  			if(layouts!=null){
	 	  				for(var j=0,jLen=layouts.length;j<jLen;j++){
	 	  					layout=layouts[j];
	 	  					if(layout!=null){
	 	  						widgets=layout.CHILD_WIDGETS;
	 	  						if(widgets!=null){
	 	  							for(var k=0,kLen=widgets.length;k<kLen;k++){
	 	  								widget=widgets[k];
	 	  								if(widget!=null && widget.WIDGET_ID===widgetId){
	 	  									widget.VER_NO=versionNo;
	 	  									LOGGER.info("Upgrading version of "+widget.WIDGET_ID+" to "+widget.VER_NO+". ", widget);
	 	  								}
	 	  							}
	 	  						}
	 	  					}
	 	  				}
	 	  			}
	 	  		}
	 		}
	 	},	
	 	getWidgetsByWorkspaceId: function(wsId){
			var appNodes = APPLICATION_NODE.WORKSPACES;
			var resultArray =[];
	 		if(appNodes!=null){
	 	  		for(var i=0; i< appNodes.length; i++){
	 	  	  		if(null!= appNodes[i].WORKSPACE_ID && appNodes[i].WORKSPACE_ID==wsId){
	 	  	  			for(var j=0; j< appNodes[i].CHILD_LAYOUTS.length; j++){
	 	  	  				for(var k=0; k< appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS.length; k++){
	 	  	  					resultArray[resultArray.length] = appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k]
	 	  	  				}
	 	  	  			}  	  	  				
	 	  	  			return resultArray; 
	 	  	  		}
	 	  		}
	 		}
	 		else{
	 	  		return {};
	 		}
	 	},	
	 	setViewPortId : function(id){
			viewPortId = id;
		},
		getViewPortId : function(){
			return viewPortId;
		},
		getWorkspaceHeader: function() {	
			Header_String=cbx.decode(headerstr);
			return Header_String;
		},
		
		
		pushAdditionalWorkspace:function(){
			
			if(ADDITIONAL_NODES_STR!=='null'){
			 ADDITIONAL_NODES_STR= ADDITIONAL_NODES_STR;
			}
			this.getWorkspaces().push(JSON.parse(ADDITIONAL_NODES_STR).WORKSPACES[0]);
			
		},
		setCurrentLayoutId : function(lId){
			CURR_LYT_ID = lId
		},
		getDeviceFilter: function(configItems,device){
			var actualDevice;
			var configDevice=[];
			var deviceflag=false;
			if(configItems!=null){
			if(configItems.indexOf(",") != -1){
				configDevice=configItems.split(",");
			}else{
				actualDevice=configItems;
			}
			if(configDevice.length>0){
			for(var j=0; j<configDevice.length; j++){
			if(configDevice[j]==device || actualDevice==device)
				deviceflag=true;
			}
			}else if(actualDevice==device){
				deviceflag=true;
			}
			return deviceflag;
			}
		},
		getAppsByLayoutId: function(wsId, layoutId){
			var appNodes = APPLICATION_NODE.WORKSPACES;
			var resultArray =[];
	 		if(appNodes!=null){
	 	  		for(var i=0; i< appNodes.length; i++){
	 	  	  		if(null!= appNodes[i].WORKSPACE_ID && appNodes[i].WORKSPACE_ID==wsId){
	 	  	  			for(var j=0; j< appNodes[i].CHILD_LAYOUTS.length; j++){
	 	  	  				if(appNodes[i].CHILD_LAYOUTS[j].LAYOUT_ID===layoutId){
	 	  	  				for(var k=0; k< appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS.length; k++){
	 	  	  				
	 	  	  				var actualDevice;
	 	  	  				var configDevice=[];
	 	  	  				var deviceflag=false;
	 	  	  				if(appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID!=null){
	 	  	  				if(appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID.indexOf(",")!=-1){
	 	  	  					configDevice=appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID.split(",");
	 	  	  				}else{
	 	  	  					actualDevice=appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID;
	 	  	  				}
	 	  	  				if(configDevice.length>0){
	 	  	  				for(var l=0; l<configDevice.length; l++){
	 	  	  				if(configDevice[l]==device || actualDevice==device)
	 	  	  					deviceflag=true;
	 	  	  				}
	 	  	  				}else if(actualDevice==device){
	 	  	  					deviceflag=true;
	 	  	  				}
	 	  	  				if( deviceflag || appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID == 'A'){
	 	  	  					resultArray[resultArray.length] = appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k];
	 	  	  				}
	 	  	  				}
	 	  	  			}	
	 	  	  			
							}
	 	  	  			}  	  	  				
	 	  	  			return resultArray; 
	 	  	  		}
	 	  		}
	 		}
	 		else{
	 	  		return {};
	 		}
	 	},
	 	getAppByLayoutId: function(wsId, layoutId,appId){
			var appNodes = APPLICATION_NODE.WORKSPACES;
			var resultApp='';
	 		if(appNodes!=null){
	 	  		for(var i=0; i< appNodes.length; i++){
	 	  	  		if(null!= appNodes[i].WORKSPACE_ID && appNodes[i].WORKSPACE_ID==wsId){
	 	  	  			for(var j=0; j< appNodes[i].CHILD_LAYOUTS.length; j++){
	 	  	  				if(appNodes[i].CHILD_LAYOUTS[j].LAYOUT_ID===layoutId){
	 	  	  				for(var k=0; k< appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS.length; k++){
	 	  	  				
	 	  	  				var actualDevice;
	 	  	  				var configDevice=[];
	 	  	  				var deviceflag=false;
	 	  	  				if(appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID!=null){
	 	  	  				if(appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID.indexOf(",")!=-1){
	 	  	  					configDevice=appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID.split(",");
	 	  	  				}else{
	 	  	  					actualDevice=appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID;
	 	  	  				}
	 	  	  				if(configDevice.length>0){
	 	  	  				for(var l=0; l<configDevice.length; l++){
	 	  	  				if(configDevice[l]==device || actualDevice==device)
	 	  	  					deviceflag=true;
	 	  	  				}
	 	  	  				}else if(actualDevice==device){
	 	  	  					deviceflag=true;
	 	  	  				}
	 	  	  				if( deviceflag || appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WI_CHANNEL_ID == 'A'){
	 	  	  					if(appId == appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k].WIDGET_ID){
			 	  	  				resultApp = appNodes[i].CHILD_LAYOUTS[j].CHILD_WIDGETS[k];
			 	  	  				return resultApp;
	 	  	  					}
	 	  	  				}
	 	  	  				}
	 	  	  			}	
	 	  	  			
							}
	 	  	  			}  	  	  				
	 	  	  			return resultApp; 
	 	  	  		}
	 	  		}
	 		}
	 		else{
	 	  		return {};
	 		}
	 	},
	 	setDevice : function (str){
	 		device = str;
		},
	 	getDevice : function(){
	 		return device;
	 	},
	 	setCurrentWorkspace: function(wsObj){
			CURR_WS_OBJ=wsObj;
		},
		setCurrentLayoutObj :function(lObj){
			CURR_LYT_OBJ = lObj
		}
	});
}();
cbx.core.ws.metadata = iportal.workspace.metadata;