/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * This class is the Multi-App manager. It is responsible to manage the Multi Apps and get the lib specific Multi App
 * Container.
 */
cbx.ns("canvas.lib");
/**
 * @namespace		"canvas.lib"
 * @class 			canvas.lib.multiapp
 * @extends	 		cbx.Observable
 * @description		This class is responsible for calling the respective multi-apps
 */
canvas.lib.multiapp = Class(cbx.Observable, {
	/**
	 * @class 		"canvas.lib.multiapp"
	 * @memberof	canvas.lib.multiapp
	 * @description	Gets the Id and the Data Widget Id of the parents and sends it to 
	 * 				the respective multi apps. This is done because the child of the
	 * 				multi apps created will have their ids and data widget ids appended
	 * 				with their parents'. Helps when the app is closed and reopened from
	 * 				appdock.
	 */
	parentId : null,
	constructor : function (config)
	{
		this.initialConfig = config;
		/**starts assigning init collapsed value as N for multi widgets **/
		for(var i=0 ; i < this.initialConfig.CHILD_WIDGETS.length ; i++)
		{
		this.initialConfig.CHILD_WIDGETS[i].INIT_COLLAPSED = 'N';
		}
		/**ends assigning init collapsed value as N for multi widgets **/
		this.layout = config.layout;
		/*
		 * 	In case of apps called from app directly, the parent of the app can be obtained
		 * 	from parentelem. (This name can be changed in the config data sent from the 
		 * 	'canvas.lib.app.js' file). 
		 * 	But for the apps that are called from portlet, the parent of the app is present
		 * 	in prevObject of the parentElem. The data that are appended directly to 
		 * 	parentElem are portlet's body data (prevObject has the parent of portlet body).
		 */
		if (!cbx.core.isEmpty(this.initialConfig.parentelem)) {
			this.initialConfig.parentId = this.initialConfig.parentelem[0].id;
		}
		else if (!cbx.core.isEmpty(this.initialConfig.parentElem)){
			this.initialConfig.parentId = this.initialConfig.parentElem.prevObject[0].id; // Need to be replaced with find
		}
		/*
		 * 	'---' is used as the de-limiter in data-widgetid. This de-limiter is used to 
		 * 	seperate the data-widgetid of the current app from its parent app.
		 */ 		
		this.initialConfig.parentDataWidgetId = $('#' + this.initialConfig.parentId).attr('data-widgetid') + '---';
		this.initiateMultiWidgetContainer();
	},

	/**
	 * @class 		"initiateMultiWidgetContainer"
	 * @memberof	canvas.lib.multiapp
	 * @description	The respective multi apps are called using their layout type in this method.
	 */
	initiateMultiWidgetContainer : function ()
	{
		var mwLayClass = CLCR.getCmp({
			"COMP_TYPE" : "MULTI_APP",
			"LAYOUT" : this.layout
		});
		if (mwLayClass)
		{
			this.mwContainer = new mwLayClass(this.initialConfig);
			iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry.registerWidget(this.initialConfig.WIDGET_ID,this.mwContainer);
		}
	}
});
