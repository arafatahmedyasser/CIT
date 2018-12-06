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

/*
* This class contains App container component. The app container contains the workspace container.
*/



cbx.lib.ApplicationContainer = Class(cbx.core.Component, {
	layoutManager: '',
/*
 * Initializes the app container component.
 */
	constructor: function(config){
		this.wsManagerConfig = config;
		cbx.lib.ApplicationContainer.$super.call(this);
		this.createItems();
	},
   /*
	* Creates the workspace container item to be added to the app container component.
	*/
	createItems: function() {
		// Creating the app container object by instantiating the layer class
		var appContainerConfig = {
			"eleType":"div",
			"id":"application-container"
		};
		var appContainerObj = new cbx.lib.layer(appContainerConfig).getLayer();
		this.addItem(appContainerObj);
		delete appContainerConfig;
		/* Start process of creating the workspace and layout */
		var wsContainerConfig;
		var wsArr = cbx.core.ws.metadata.getWorkspaces();
		//var headerInfo = new cbx.lib.header();		
		/*  this.addItem(headerInfo.createHeader()); -- */
		//console.log('b4 callling createWorkspaces in wshandler'+cbx.lib.workspacehandler);
		cbx.lib.workspacehandler.createWorkspaces(wsArr,this);
		//cbx.lib.workspacehandler.activateWorkspace(0); 
	},
	/* Return the object of app container contains the workspcae container object */
	getAppContainer: function() {
		return this.getItem(0);
	},
	getWSHeader: function() {
		return this.getItem(1);
	},
	getWSLayoutManagerDOM : function() {
		return this.layoutManager.getContainer().getLayoutContainer();
	}
});
CLCR.registerCmp({'COMP_TYPE':'APPLICATION_CONTAINER'}, cbx.lib.ApplicationContainer); 
/*
* This class contains the workspace container. Called by the app container
*/



cbx.lib.workspaceContainer = Class(cbx.core.Component, {
/*
*Initializes the workspace container.
*/
	workspaceID: '',
	proportion: '',
	containerObj : null,
	constructor: function(config) {
		//Calling super class constructor
		cbx.lib.workspaceContainer.$super.call(this);
		this.workspaceID = config.WORKSPACE_ID;
		this.proportion = config.proportion;
		this.createContainer();
		/* this.odProduct = config.odProduct;
		this.odSubProduct = config.odSubProduct; */
		/*Creating the workspace config object*/
		/*Append workspace container object to the App container object*/
		//config.appContainerConfig.getItem(0).appendChild(wcContainerObject); // Adding WS container in APP container level itself
		//this.addItem(wcContainerObject);
		var contextAppLauncher = $('#context-app-img');
		contextAppLauncher.hide();
		if($("#"+this.workspaceID)[0]){
			$("#"+this.workspaceID)[0].style.display="block";
			this.createItems();
			$("#"+this.workspaceID).children().remove();
			$("#"+this.workspaceID).append(this.containerObj);
		}
		else{
			LOGGER.error("The workspace trying to be enabled is not a valid "
			+ "workspace for this channel.."
			+ " WORKSPACE ID: "+this.workspaceID);
		}
	},
	/*Returns Workspace container object*/
	getWSContainer: function() {
		return this.getItem(0);
	},
	createContainer : function(){
		var wsContainerConfig ={
				"eleType":"div",
				"id":this.workspaceID+"_WORKSPACE_CONTAINER"
		};
		var container = new cbx.lib.layer(wsContainerConfig).getLayer();
		$(this.workspaceID).append(container);
		this.containerObj = container;
		this.addItem(this.containerObj)
	},
	createItems: function() {
		cbx.core.ws.metadata.setCurrentWorkspaceId(this.workspaceID);
		var layoutArr = cbx.core.ws.metadata.getLayoutsForWS(this.workspaceID);
		for(var i = 0; i < layoutArr.length; i++) {
			var layoutConfig = {
					"elem": "div",
					"workspaceID": this.workspaceID,
					"proportion": layoutArr[i].LAYOUT_PROPORTION,
					"layoutId":layoutArr[i].LAYOUT_ID,
					"layoutType":layoutArr[i].LAYOUT_LAYOUT
					/* ,
					"odProduct": this.odProduct,
					"odSubProduct": this.odSubProduct */
			};
			this.layoutManager = new cbx.core.LayoutManager(layoutConfig);
			//tempActivateWSContainer.getItem(0).appendChild(tempActivateWSContainer.layoutManager.getContainer().getItem(0));
			
			var layoutContainer = this.layoutManager.getContainer();
			this.getItem(0).appendChild(layoutContainer.getItem(0));
			var config = {
				"layoutID": layoutArr[i].LAYOUT_ID,
				"workspaceID": this.workspaceID,
				"odProduct": layoutArr[i].odProduct,
				"odSubProduct": layoutArr[i].odSubProduct,
				"portal":layoutContainer.portal
			};
			this.layoutManager.getWidgetContainer(config);
		}
	},
	getLayoutManagerObject: function() {
		return this.layoutManager;
		
	},
	getLayoutManagerDOM: function() {
		return this.layoutManager.getContainer();
	},
	getWorkspaceWidgets: function() {
		return this.layoutManager.getWidgetContainerComponent();
	},
	getWidgetContainer : function(){
		return this.layoutManager.widgetContainer;
	},
	getLayoutContainer : function(){
		return this.layoutManager.widgetContainer;
	}
});
CLCR.registerCmp({'COMP_TYPE':'WORKSPACE_CONTAINER'}, cbx.lib.workspaceContainer); 