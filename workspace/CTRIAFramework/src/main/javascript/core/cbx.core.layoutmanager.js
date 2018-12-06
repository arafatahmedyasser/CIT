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
cbx.ns("cbx.core");
/**
* This class is the sub-workspace/layout manager. It is responsible to get the lib specific layout component.
*
*/
cbx.core.LayoutManager = Class(cbx.Observable,{
	/**
	 * Config contains the element id and other required parameters. It calls
	 * the sub-workspace / layout container component class.
	 */
	constructor: function(config){
		this.initialConfig=config;
		config.layoutManager=this;
		cbx.core.ws.metadata.setLayoutManager(this);
		LOGGER.info("config.layoutManager", config.layoutManager);
		var lyContCls=CLCR.getCmp({
			'COMP_TYPE':'PARENT_LAYOUT_CONTAINER'
		});
		if(lyContCls){
			this.layoutContainer=new lyContCls(config);
		}
	},
	/**
	 *  getContainer returns the layout container component.
	 */
	getContainer:function(){
		LOGGER.info(" layoutContainer: ", this.layoutContainer, this.initialConfig);
		return this.layoutContainer;
	},
	/**
	 * widgetSelectionHandler handler is fired when a sub-workspace is selected by clicking
	 * on it. It activates the new sub-workspace
	 */
	widgetSelectionHandler : function (config){
		this.currentConfig = config;	
		var cClass= CLCR.getCmp({
			'CONTAINER_TYPE':'WIDGET'
		});	
		
		if(cClass){
			this.widgetContainer=new cClass(config);
			return this.widgetContainer;
		}
	},
	/**
	 * 
	 */
	switchLayout : function (layoutId, data){
		if (this.layoutContainer.switchLayout) {
			this.layoutContainer.switchLayout(layoutId, data);
		} else {
			LOGGER.error("The current layoutContainer doesn't support switch layout. So doing nothing.");
		}
	},
	/**
	 * 
	 */
	indexOfCurrentContainer : function (){
		if (this.currentConfig != null) {
			return this.layoutContainer.indexOfLayoutId(this.currentConfig.LAYOUT_ID);
		} else {
			return -1;
		}
	},
	/**
	 * 
	 */
	reload : function (){
		if (this.layoutContainer.reload) {
			this.layoutContainer.reload();
		} else {
			LOGGER.error("The current layoutContainer doesn't support switch layout. So doing nothing.");
		}
	},
	/**
	 * 
	 */
	resetUiData: function (layoutId){
		if (this.layoutContainer.resetUiData) {
			this.layoutContainer.resetUiData(layoutId);
		} else {
			LOGGER.error("The current layoutContainer doesn't support reset Ui data. So doing nothing.");
		}		
	},
	/**
	 * wsSelection handler is fired when a sub-workspace is selected by clicking
	 * on it. It activates the new sub-workspace
	 */
	wsDeselectionHandler : function (config){
		
	},

	/**
	 * wsSelection handler is fired when a sub-workspace is selected by clicking on it. 
	 * It activates the new sub-workspace.
	 * */
	getWidgetContainer:function(config){
		config.layoutManager = this;
		var widgetContainer = null;
		var wgtContCls=CLCR.getCmp({
			'COMP_TYPE':'LAYOUT_CONTAINER'
		});
		
		if(wgtContCls){
			this.widgetContainer= new wgtContCls(config);
		}
		return this.widgetContainer;
	},
	/**
	 * The following function will get the Child layout component inside the Layout Container. Supports CBX 3.0 application.
	 */
	getLayoutContainerComponent : function(config){
		var widgetContainer = null;
		var wgtContCls=CLCR.getCmp({
			'COMP_TYPE':'LAYOUT_CONTAINER'
		});
		
		if(wgtContCls){
			this.widgetContainer= new wgtContCls(config);
		}
		return this.widgetContainer;
	},
	/**
	 * 
	 */
	getContextAppPanel : function(config){
		var cClass = CLCR.getCmp({
			'COMP_TYPE':'CONTEXT_APP_PANEL'
		});
		if(cClass){
			config.layoutContainer = this.layoutContainer;
			this.contextApp = new cClass(config);
			return config.layoutContainer.getContextApp();
		}
		return null;
}
});