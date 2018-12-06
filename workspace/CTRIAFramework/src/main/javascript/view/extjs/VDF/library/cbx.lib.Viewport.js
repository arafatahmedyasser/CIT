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
cbx.ns("cbx.lib");
/**
 * This class contains the Ext Js specific Viewport component.
 */
cbx.lib.Viewport = Class(cbx.core.Component, {

	/**
	 * Initializes the component. This contains the JS library specific
	 * component object.
	 */
	initialize : function() {
		
		Ext.QuickTips.init();
		
		/**
       	* Disabling the browser context menu in application loading itself. 
       	*/ 
        Ext.getBody().on("contextmenu", Ext.emptyFn, null, {
			preventDefault : true
		});
        document.body.classList.add('font-'+(iportal.preferences.getFontSize()).toLowerCase());
		var that = this;
		this.registerListener("titlechange", this.handleTitle);
		var viewPort = {};
		var viewPortConf = {};
		var viewPortCls = CLCR.getCmp({"APPLICATION_FW" : "EXT-JS","LAYOUT_TYPE" : "APPLICATION_LAYOUT"});
		if (viewPortCls) {
			viewPort = new viewPortCls(viewPortConf);
		}
		that.addItem(viewPort);
		var config = {
			elem : viewPort.getComponent(1)
		};
		/**
		 * Calling the core workspace manager to assign it to this.wsManager
		 * with the config object containing the viewport component.
		 */
		that.wsManager = new cbx.core.WSManager(config);
		
		/**
		 * adds the app container as viewport's child. This app container
		 * contains the workspaces.
		 */
		 /**
		 * The following code will read the configurations specified for the application layout component
		 * which will be used to render the header and footer, if configured
		 */
		//var applicationLayout = iportal.preferences.getLayout();
		var applicationLayoutConfig = canvas.metadata.applicationLayout;
		/** Populating the canvas dock model if it is enabled */
		var canvasDockEnabled = applicationLayoutConfig.isCanvasDockRequired();
		if(canvasDockEnabled){
			ct.core.dock.controller.initializeCanvasDock();	
		}
		viewPort.getComponent(0).add(applicationLayoutConfig.getHeaderComponent()); 
		viewPort.getComponent(0).doLayout();
		viewPort.getComponent(2).add(applicationLayoutConfig.getFooterComponent()); 
		viewPort.getComponent(2).doLayout();
		viewPort.getComponent(1).add(
				that.wsManager.getContainer().getItem(0));
		viewPort.getComponent(1).doLayout();
	},
	/**
	 *  This is called when the event "titlechange" is fired
	 */
	handleTitle : function(title) {
		var me = this;
		cbx.ajax({
			params:{ foo: 'bar', baz: 100 },
			success: function (resp) {
				// Ext.get(me.elem.id).insertHtml('beforeBegin',resp);
			},
			beforeLoad: function(){
				
			},
			afterLoad:function(){
				
			},
			error: function(){
				
			}
		});
	}
});
/**
 * 
 */
CLCR.registerCmp({'VIEW_TYPE':'VIEWPORT'}, cbx.lib.Viewport);
