/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("cbx.core");
/**
 * @class cbx.core.wsmanager
 * @extends "cbx.Observable"
 * @description This class is the workspace manager. It is responsible to get the workspace component. Called by the
 *              Viewport Component class.
 */
cbx.core.WSManager = Class(cbx.Observable, {
	/**
	 * @method constructor
	 * @memberof cbx.core.wsmanager
	 * @description Config contains the element id and other required parameters. It calls the ApplicationContainer
	 *              component class.
	 */
	constructor: function(config){
		this.initialConfig=config;
		iportal.workspace.metadata.setWorkspaceManager(this);	
		var applnContCls=CLCR.getCmp({'COMP_TYPE':'APPLICATION_CONTAINER'});
		if(applnContCls){
			this.ApplicationContainer=new applnContCls(config);
		}
		//Jquery Hash Changes
		cbx.CommManager.registerHandler("hashupdated", 'cbx.core', this,this.handleWsLaunch);
		this.handleWsLaunch();
	},
	/**
	 * @method getContainer
	 * @memberof cbx.core.wsmanager
	 * @description getContainer returns the ApplicationContainer component.
	 */
	getContainer:function(){
		return this.ApplicationContainer;
	},
	/**
	 * @method wsSelectionHandler
	 * @memberof cbx.core.wsmanager
	 * @description wsSelection handler is fired when a workspace is selected by clicking on it. It activates the new
	 *              workspace
	 */
	wsSelectionHandler:function(config,panel,callback,scope){
		var wsDownloadContent = "WSPACE_"+config.WORKSPACE_ID;
		var onDemandJsTag="WSPACE_"+(config.SYSTEM_WORKSPACE_IND=="Y"?config.WORKSPACE_ID:"CUSTOM");
		//var wsDownloadContent = cbx.downloadProvider.getMergedArray([onDemandJsTag]):onDemandJsTag;
		CBXDOWNLOADMGR.requestScripts(/*wsDownloadContent*/onDemandJsTag,function(){
			cbx.core.ws.metadata.setCurrentWorkspaceId(config.WORKSPACE_ID);
			iportal.workspace.metadata.setCurrentWorkspaceId(config.WORKSPACE_ID);
			var wsContCls=CLCR.getCmp({
					'COMP_TYPE':'WORKSPACE_CONTAINER'
			});
			var wsContainer= new wsContCls(config);
			if(panel){
				panel.add(wsContainer.getItem(0));
				panel.doLayout(); 
			}
			cbx.CommManager.raiseEvent('showPushNotification');
			scope = scope?scope:this;
			if(callback && cbx.isFunction(callback)){
				callback.apply(scope,[wsContainer]);
			}
		});
		var layout = iportal.workspace.metadata.getApplicationLayout();
	},
	/**
	 * @method wsDeselectionHandler
	 * @memberof cbx.core.wsmanager
	 * @description when a new workspace is selected, the wsDeselection handles is called to deactivate the old
	 *              workspace
	 */
	wsDeselectionHandler: function(config){
		
	},
	/**
	 * 
	 */
	switchWorkspace : function (wsId, data){
		if (this.ApplicationContainer && this.ApplicationContainer.switchWorkspace) {
			this.ApplicationContainer.switchWorkspace(wsId, data);
		} else {
			LOGGER.error("The current ApplicationContainer doesn't support switch workspace. So doing nothing.");
		}
	},
	/**
	 * 
	 */
	reload:function(itemId,label){
		var wsArr = cbx.core.ws.metadata.getWorkSpaceById(itemId);	
		if(!cbx.core.isEmpty(wsArr)){
			this.handleWsLaunch(wsArr);
		}
	},
	
	/**
	 * 
	 */
	handleWsLaunch : function (data){
		if(cbx.HashManager){
			data = data || cbx.HashManager.getHashData();
		}
		var wsId = '';
		if (data != null && !cbx.core.isEmpty(data) && !cbx.core.isEmpty(data.WORKSPACE_ID)) {
			wsId = data.WORKSPACE_ID;
		} else {
			var wsArr = cbx.core.ws.metadata.getWorkspaces();
			if(cbx.isEmpty(wsArr)){
				LOGGER.error("No Workspaces Configured so far.");
				return;
			}
			wsId = wsArr[0].WORKSPACE_ID;
		}
		LOGGER.info("handleWsLaunch", wsId, data);

		if (this.ApplicationContainer.switchWorkspace) {
			this.ApplicationContainer.switchWorkspace(wsId, data);
		} 
		else {
			LOGGER.error("The current App Container doesn't support switch workspace. So doing nothing.");
		}
	}
});