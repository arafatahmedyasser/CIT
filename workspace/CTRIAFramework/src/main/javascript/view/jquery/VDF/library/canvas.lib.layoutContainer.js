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
 
cbx.ns("canvas.lib");
/**
 * This class contains the Ext Js specific Sub-Workspace Container component.
 */
canvas.lib.layoutContainer = Class(cbx.core.Component,{
	/**
	 * Initializes the JS lib sub-workspace container component.
	 * Sub-Workspace container contains the layouts inside it.
	 */
	initialize : function (){
		var me = this;
		this.rb = {};
		var elem = this.elem;
		this.uiDataMap = {};
		elem.append('<span class="layoutWrapper ' + this.WORKSPACE_ID + '"ITEM_ID="LYT_WRAPPER_'
					+ this.WORKSPACE_ID + '"></span>');
		elem = $(elem.find('span:first'));
		this.setCmp(elem);
		elem.on("remove", function (){
			me.destroy();
		});
		this.createItems();
	},
	
	/**
	 * 
	 */
	createItems : function (){
		var wsMD = this.wsMD, me = this, elem = this.getCmp();
		var lytMD = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID)[0];
		var title = this.rb[wsMD.WORKSPACE_DISPLAY_NM] ? this.rb[wsMD.WORKSPACE_DISPLAY_NM]
					: wsMD.WORKSPACE_DISPLAY_NM;
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
	 * 
	 */
	reload : function (){
		var wsMD = this.wsMD, me = this, elem = this.getCmp();
		var lytMD = cbx.core.ws.metadata.getLayoutsForWS(this.WORKSPACE_ID)[0];
		me.switchLayout(lytMD.LAYOUT_ID);
	},
	
	/**
	 * 
	 */
	resetUiData: function(layoutId){
		delete this.uiDataMap[layoutId];
	},
	
	/**
	 * 
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
	 * 
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
	 * tabSelectionHandler is fired when a sub-workspace is selected
	 * by clicking on it. It activates the new sub-workspace
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
	 * tabDeSelectionHandler is fired when a sub-workspace is
	 * selected by clicking on it. It activates the new
	 * sub-workspace
	 */
	tabDeSelectionHandler : function (panel){
		LOGGER.info("tabDeSelectionHandler", arguments);
		panel.removeAll(true);
		var config = {
			elem : panel,
			LAYOUT_ID : panel.itemId
		}
	}

});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'PARENT_LAYOUT_CONTAINER'}, canvas.lib.layoutContainer);