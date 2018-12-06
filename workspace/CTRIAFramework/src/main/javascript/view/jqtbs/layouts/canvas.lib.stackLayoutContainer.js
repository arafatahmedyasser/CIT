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
 * @class: canvas.lib.stackLayoutContainer
 * @extends: cbx.core.Component
 * @description: This class contains the JQTBS specific Sub-Workspace Container component.This is responsibble for
 *               calling the required layout type to be rendered as per configured in the database for the given
 *               subworkspace in the
 */
canvas.lib.stackLayoutContainer = Class(cbx.core.Component,{
	/**
	 * @method: initialize
	 * @memberof: canvas.lib.stackLayoutContainer
	 * @description: Initializes the JS lib sub-workspace container component.Sub-Workspace container contains the
	 *               layouts inside it.
	 */
	initialize : function (){
		var me = this;
		this.uiDataMap = {};
		var elem = $(this.elem).append('<div id = "subworkspaceContainer" class="ct-sws-stack" ITEM_ID="subworkspaceContainer"></div>').find("div:nth-child(2)");
		this.setCmp(elem);
		elem.on("remove", function (){
			me.destroy();
		});
		this.createItems();
		
		cbx.core.ws.metadata.setCurrentLayoutObj(this);
	},
	
	/**
	 * @method: createItems
	 * @memberof: canvas.lib.stackLayoutContainer
	 * @description: This function is used to make the call to the corresponding layouts that has to be rendered within
	 *               the sub workspace container. This first get the component for the required layout ,then creates the
	 *               config for the layout to be rendered and then provides the config for the layout manager for firing
	 *               the layout
	 */
	createItems : function (){
		var wsMD = this.wsMD, me = this, elem = this.getCmp();
		var lytMD = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID)[0];
		
		var cClass= CLCR.getCmp({'COMP_TYPE':lytMD.LAYOUT_LAYOUT});
		cbx.core.ws.metadata.setCurrentLayoutId(lytMD.LAYOUT_ID);
		var config = {
				elem : elem,
				parent:$(elem), 
				LAYOUT_ID : lytMD.LAYOUT_ID,
				WORKSPACE_ID : this.WORKSPACE_ID,
				layoutProportion:lytMD.LAYOUT_PROPORTION,
				layout:lytMD.LAYOUT_LAYOUT,
				uData : this.uData
			};
	
		if(cClass){					
			this.layoutType=new cClass(config);
			config.layoutType=this.layoutType;
		}
		LOGGER.info("layoutMD: ", lytMD);
		var widgetContainer = this.layoutManager.widgetSelectionHandler(config);
	},
	/**
	 * @method: reload
	 * @memberof: canvas.lib.stackLayoutContainer
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
	 * @memberof: canvas.lib.stackLayoutContainer
	 * @description: This is used to reset the layout
	 */
	resetUiData: function(layoutId){
		delete this.uiDataMap[layoutId];
	},
	
	/**
	 * @method: indexOfLayoutId
	 * @memberof: canvas.lib.stackLayoutContainer
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
	 * @memberof: canvas.lib.stackLayoutContainer
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
	 * @memberof: canvas.lib.stackLayoutContainer
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
	 * @memberof: canvas.lib.stackLayoutContainer
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
		var field = $(this.getCmp()).find('div[data-widgetId="' + value + '"]')
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

/*
 *	Registering the component. 
 */
CLCR.registerCmp({'COMP_TYPE':'STACK_LAYOUT_CONTAINER'}, canvas.lib.stackLayoutContainer);