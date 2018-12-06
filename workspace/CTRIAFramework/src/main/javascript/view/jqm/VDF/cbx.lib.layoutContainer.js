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
cbx.lib.layoutContainer = Class(cbx.core.Component,{
	/*Initializes the JS lib sub-workspace container component. Sub-Workspace container contains the layout inside it.*/
	layoutManager:null,
	workspaceID:'',
	/* odProduct:'',
	odSubProduct:'', */
	constructor: function(config){
		/*Assign config object to the layoutManager variable */
		this.layoutManager = config.layoutManager;
		this.workspaceID = config.workspaceID;
		this.layoutId = config.layoutId;
		this.layoutType = config.layoutType
		/* this.odProduct = config.odProduct;
		this.odSubProduct = config.odSubProduct; */
		cbx.lib.layoutContainer.$super.call(this);
		/* Instantiating the layer class by passing the config object.
		 * This is the layer contains the layout and its components the
		 */
		var lcConfig = {
			id:this.layoutId+"_LAYOUT_CONTAINER",
			eleType: "div",
			style: {
				width:"100%"
			}
		};
		var layoutContainerObj = new cbx.lib.layer(lcConfig).getLayer();
		this.addItem(layoutContainerObj);
		cbx.core.ws.metadata.setCurrentLayoutId(this.layoutId);
		var that = this;
		var configuration = {
			"parent": this,
			itemId: "portal",
			//boardItems: this.createItems([]),
			proportion: config.proportion
		};
		/*Instantiating the two column class by passing the configuration object*/
		/**
		 * Made it generic...
		 */
		var portalClass = CLCR.getCmp({"COMP_TYPE":"PORTAL","LAYOUT":"STACK"});//new cbx.lib.twocolumn(configuration);
		this.portal = new portalClass(configuration);
		var controlGroupConf = {
				"eleType":"div",
				"data-role":"controlgroup",
				"data-type":"horizontal"
		}
		var cGroup = new cbx.lib.layer(controlGroupConf);
		var layoutArr = cbx.core.ws.metadata.getLayoutsForWS(this.workspaceID);
		for ( var index = 0; index < layoutArr.length; index++) {
			
			var rb = CRB.getBundle(layoutArr[index].LD_BUNDLE_KEY);
			var controlEleConf = {
					"eleType":"a",
					"href":"#",
					"class":"ui-btn ui-corner-all",
					"html":rb[layoutArr[index].LAYOUT_DISPLAY_NM]
			}
			var cEle = new cbx.lib.layer(controlEleConf);
			cGroup.getLayer().appendChild(cEle.getLayer());
			//$(this.portal.getItem(0)).prepend(cGroup.getLayer());
			/*var widContainer = this.layoutManager.getWidgetContainer(layoutArr[index]);
			var lComp = widContainer.getItem(0);
			
			layoutComp.add(panel.getItem(0));*/
			cbx.core.ws.metadata.setCurrentLayoutObj(this);
		}
		this.getItem(0).appendChild(this.portal.getItem(0));
		//this.createItems([]);
	},
	getLayoutContainer: function() {
		return this.getItem(0);
	}
});
CLCR.registerCmp({'COMP_TYPE':'PARENT_LAYOUT_CONTAINER'}, cbx.lib.layoutContainer);  
/*
* This class contains the library specific widget container component inside the workspace. Called by the layoutManager.
*/


cbx.lib.widgetContainer = Class(cbx.core.Component, {
/*
* Initializes the widget container.
*/	
	layoutID: '',
	workspaceID: '',
	odProduct: '',
	odSubProduct: '',
	widgetsArray: null,
	appMVRegistry : null,
	commManager : null,
	totalApps : 0,
	constructor: function(config) {
		/*
		*  adds the widget container as a child item for the sub-workspace/layout container.
		*/
		cbx.lib.widgetContainer.$super.call(this);
		this.layoutID = config.layoutID;		
		this.workspaceID = config.workspaceID;
		this.commManager =cbx.CommManager;
		this.appMVRegistry = new canvas.core.communication.appMVRegistry();
		this.odProduct = config.odProduct;
		this.odSubProduct = config.odSubProduct;
		this.portal = config.portal;
		this.addRequestQueue = [];
		this.widgetsArray = new Array();
		this.initializeApps();
		var contextApp = iportal.workspace.metadata.getContextApp(this.layoutID);
		var contextAppLauncher = $('#context-app-img');
			contextAppLauncher.hide();
		
	},
	/*
	* Initializes the apps/widgets available for that workspace.
	*/
	initializeApps: function() {
		/* Removing the child elements of DOM */
		/*cbx.lib.utility.removeChildElements(this.portal.rightcol);
		cbx.lib.utility.removeChildElements(this.column.leftcol);*/
		/**
		 * Made this generic
		 */
		var apps = cbx.core.ws.metadata.getAppsByLayoutId( this.workspaceID, this.layoutID);
		this.totalApps = apps.length;
		for( var i = 0, len = apps.length; i < len; i++ ) {
			
			if(cbx.isEmpty(apps[i].BLOCK_POSITION)){
				apps[i].BLOCK_POSITION='CENTER';
			}
			var config;
			config = {
				"widgetConfig": apps[i],
				"workspaceID": this.workspaceID,
				"widgetContainer":this
			};
			var widgetObj = new cbx.core.Apps(config);
			this.widgetsArray[i] = widgetObj;
			//this.addItem(widgetObj.getWidgetContainer());
				
		}
	},
	
	/**
	 * Appending the corresponding app to the left or right column
	 * based on the metadata
	 * 
	 * @param : childConfig
	 * {
	 * CHILD : The actual child element
	 * POSITION : The numbered position e.g 1 or 2
	 * BLOCK_POSITION : "LEFT" or "RIGHT" 
	 * }
	 *  
	 */
	appendChild : function(childConfig){
		if(childConfig.hasOwnProperty('PORTLET')){
			this.addRequestQueue.push(childConfig);
		}
		else{
			this.totalApps = this.totalApps-1;
		}
		if(this.addRequestQueue.length>=this.totalApps){
			this.addRequestQueue.dynamicSort("POSITION");
			this.portal.addApps(this.addRequestQueue);
			doIScroll("CONTENT_DIV","add");
		}
	}
});
CLCR.registerCmp({'COMP_TYPE':'LAYOUT_CONTAINER'}, cbx.lib.widgetContainer);  
