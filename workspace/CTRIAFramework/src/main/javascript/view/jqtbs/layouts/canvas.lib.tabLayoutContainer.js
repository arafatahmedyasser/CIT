/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

cbx.ns("canvas.lib");

/**
 * @namespace: cbx.ns("canvas.lib")
 * @class: canvas.lib.tabLayoutContainer
 * @extends: cbx.core.Component
 * @description: This class contains the JQTBS specific Sub-Workspace Container component.This is responsibble for
 *               calling the required layout type to be rendered as per configured in the database for the given
 *               subworkspace in the
 */
canvas.lib.tabLayoutContainer = Class(cbx.core.Component,{
	/**
	 * @method: initialize
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: Initializes the JS lib sub-workspace container component.Sub-Workspace container contains the
	 *               layouts inside it.
	 */	
	layArray	   : null,
	workspaceTabLayoutObj : null,

	initialize : function (){
		var me = this;
		this.uiDataMap = {};

		this.createItems();
		
		cbx.core.ws.metadata.setCurrentLayoutObj(this);
	},
	
	/**
	 * @method: createItems
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: This function is used to make the call to the corresponding layouts that has to be rendered within
	 *               the sub workspace container. This first get the component for the required layout ,then creates the
	 *               config for the layout to be rendered and then provides the config for the layout manager for firing
	 *               the layout
	 */
	createItems : function (){

		var workspaceTabLayoutClass= CLCR.getCmp({			//Get tab layout component class
			"COMP_TYPE":"LAYOUT",
			"LAYOUT_TYPE":"TAB"
		});
		
		if(workspaceTabLayoutClass){
			this.layArray = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID);		//Get the list of subworkspaces
			var layFormattedArray=[];	  
			/*Start: Massaging the data for tab layout engine*/
			for ( var index = 0; index < this.layArray.length; index++) {		
					this.layArray[index].LAYOUT_DISPLAY_NM = cbx.isEmpty(CRB.getBundleValue(this.layArray[index].LD_BUNDLE_KEY,this.layArray[index].LAYOUT_DISPLAY_NM))? this.layArray[index].LAYOUT_DISPLAY_NM
														  : CRB.getBundleValue(this.layArray[index].LD_BUNDLE_KEY,this.layArray[index].LAYOUT_DISPLAY_NM);
					var layObj={};
					layObj['ITEM_ID']=this.layArray[index].LAYOUT_ID;
					layObj['ITEM_LABEL']=this.layArray[index].LAYOUT_DISPLAY_NM;
					layFormattedArray.push(layObj);
			}
			/*End: Massaging data*/
			
			var workspaceTabLayoutConfig = {							//JSON to be sent to the tab layout engine
					parent_elem : this.elem,							// the parent elem to which tab layout to be appended
					//defaultActiveTab: 2,										//Default tab to be activated initially
					activationHandler:this.activateSubWorkspace,					//Method to be called to activate a tab(sub workspace)
					implementationSubstring:'subWorkspace_',						//Prefix for the IDs of tab strip  
					presentation:1,												//Configuring the appearance of the tab layout (application of "WELL" class of bootstrap)
					itemList : layFormattedArray,								//Massaged data containing the layout list 
					parentScope:this
			};
			
			this.workspaceTabLayoutObj= new workspaceTabLayoutClass(workspaceTabLayoutConfig);	//Invoke tab layout engine with the config parameter
		}	
	},
	
	
	
	activateSubWorkspace : function(subWorkspaceId,subWkspcContDataItemId,scope,index){
	    scope = scope?scope: this;
	    if(subWkspcContDataItemId!=undefined && subWkspcContDataItemId!=null){
	    	/**Append the Sub workspace container to the tab layout container*/
	    	$('div[data-item-id= '+subWkspcContDataItemId+']').empty();
	    	$('div[data-item-id= '+subWkspcContDataItemId+']').append('<div id = "subworkspaceContainer" class="ct-sws-stack" ITEM_ID="subworkspaceContainer"></div>').find("div:nth-child(2)");							
	    	var lytMD = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID)[index];
			var cClass= CLCR.getCmp({'COMP_TYPE':lytMD.LAYOUT_LAYOUT});
	    	cbx.core.ws.metadata.setCurrentLayoutId(subWorkspaceId);
	    	
			
			var config = {
				elem : $('#subworkspaceContainer'),
				parent:$('#subworkspaceContainer'),
				LAYOUT_ID : subWorkspaceId,
				WORKSPACE_ID : scope.WORKSPACE_ID,
				layout:lytMD.LAYOUT_LAYOUT,
				layoutProportion:lytMD.LAYOUT_PROPORTION
			};
			if(cClass){					
				this.layoutType=new cClass(config);
				config.layoutType=this.layoutType;
			}
			var widgetContainer = scope.layoutManager.widgetSelectionHandler(config);
	    	
	    }
	},
	
	
	
	/**
	 * @method: reload
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: This is used to reload the layout. This gets the current workspace metadata , layout metadata and
	 *               the switches to layout
	 */
	reload : function (){
		var wsMD = this.wsMD, me = this, elem = this.getCmp();
		var lytMD = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID)[0];
		me.switchLayout(lytMD.LAYOUT_ID);
	},
	
	/**
	 * @method: resetUiData
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: This is used to reset the layout
	 */
	resetUiData: function(layoutId){
		delete this.uiDataMap[layoutId];
	},
	
	/**
	 * @method: indexOfLayoutId
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: This is used to return the index of the layoutId passed to it for the curent workspace
	 */
	indexOfLayoutId : function (layoutId){
		var layoutArr = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID);
		for ( var index = 0; index < layoutArr.length; index++) {
			if (layoutArr[index].LAYOUT_ID === layoutId) {
				return index;
			}
		}
		return -1;
	},
	/**
	 * @method: switchLayout
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: This is used to switch the layouts in baded on the layoutid and data pased
	 */
	switchLayout : function (layoutId, uData){
		var me = this, elem = this.getCmp(),wsMD = this.wsMD;
		var lytMD = null;
		uData=uData || me.uiDataMap[layoutId];
		me.uiDataMap[layoutId] = uData;
		var layoutArr = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID);
		var layoutIndex=me.indexOfLayoutId(layoutId);
		lytMD = layoutArr[layoutIndex];
		
		for ( var index = layoutIndex+1, len=layoutArr.length; index < len; index++) {
			delete me.uiDataMap[layoutArr[index].LAYOUT_ID];
		}
		
		if (lytMD != null) {
			elem.empty();
			var title = this.rb[wsMD.WORKSPACE_DISPLAY_NM] ? this.rb[wsMD.WORKSPACE_DISPLAY_NM]
						: wsMD.WORKSPACE_DISPLAY_NM;
			var config = {
				elem : elem,
				LAYOUT_ID : lytMD.LAYOUT_ID,
				WORKSPACE_ID : this.WORKSPACE_ID,
				uData : uData
			};
			LOGGER.info("layoutMD: ", lytMD);
			var widgetContainer = this.layoutManager.widgetSelectionHandler(config);

		} else {
			LOGGER.error("No layout for ID: " + layoutId + " is configured with in workspace ID: "
						+ this.WORKSPACE_ID)
		}

	},
	
	/**
	 * @method: tabSelectionHandler
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: tabSelectionHandler is fired when a sub-workspace is selected by clicking on it. It activates the
	 *               new sub-workspace
	 */
	tabSelectionHandler : function (panel){
		LOGGER.info("tabSelectionHandler", arguments, this);
		var config = {
			elem : panel,
			LAYOUT_ID : panel.itemId,
			WORKSPACE_ID : this.WORKSPACE_ID
		}
		var layoutContainer = this.layoutManager.widgetSelectionHandler(config);
		panel.add(layoutContainer.getCmp(0));
		panel.doLayout();
	},
	/**
	 * @method: tabDeSelectionHandler
	 * @memberof: canvas.lib.tabLayoutContainer
	 * @description: tabDeSelectionHandler is fired when a sub-workspace is selected by clicking on it. It activates the
	 *               new sub-workspace
	 */
	tabDeSelectionHandler : function (panel){
		LOGGER.info("tabDeSelectionHandler", arguments);
		panel.removeAll(true);
		var config = {
			elem : panel,
			LAYOUT_ID : panel.itemId
		}
	},
	find: function(id, value) {
		var field = $(this.elem).find('div[data-widgetId="' + value + '"]')
		if(field.length>0 && field[0].parentCt){
			return [field[0].parentCt];
		}
		if(field.length>0 && field[0]){
			return $(field);
		}
		else{
			return null;
		}
	}

});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'TAB_LAYOUT_CONTAINER'}, canvas.lib.tabLayoutContainer);