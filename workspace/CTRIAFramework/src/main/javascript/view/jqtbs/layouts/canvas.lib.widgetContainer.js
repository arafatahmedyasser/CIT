/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
 
cbx.ns('canvas.lib');
/**
 * @namespace: cbx.ns("canvas.lib")
 * @class: cnavas.lib.widgetContainer
 * @extends: cbx.core.Component
 * @description: This class contains the JQTBS specific widget container component inside the sub-workspace. Called by
 *               the layoutManager.
 */
canvas.lib.widgetContainer = Class(cbx.core.Component, {

	/**
	 * 
	 */
	layoutExists:false,
	
	appMVRegistry : '',
	/**
	 * @method: initialize
	 * @memberof: cnavas.lib.widgetContainer
	 * @description: Initializes the widget container. This adds the widget container to the sub-workspace container.
	 *               This also cleans the app dock for the time when the workspace is loaded
	 */
	initialize : function (){
		var me = this;
		
		this.appMVRegistry = new canvas.core.communication.appMVRegistry();
		
		 
		var elem = $(this.elem).append('<div id="widgetcontainer"></div>');
		if(iportal.workspace.metadata.isWidgetCatalogRequired()){
			var appObj=iportal.workspace.metadata.getAppDock();
		appObj.cleanDock();
		}
		
		
		if(!cbx.core.isEmpty(this.layout) && cbx.core.isObject(this.layoutType)){
			elem=$("#widgetcontainer").append(this.layoutType.getItem(0));
			this.layoutExists=true;
		}
		this.setCmp(elem);
		this.appArr = [];
		elem.on("remove", function (){
			me.destroy();
		});
		this.initializeApps();
	},
	/**
	 * @method: initializeApps
	 * @memberof: cnavas.lib.widgetContainer
	 * @description: Initializes the apps/widgets available for that sub-workspace.This creates an div tag for every
	 *               widget and calls for the creation of the widget in the JQTBSPortlet. The data-widget-id atribute of
	 *               div tag is set to the widgetId which is used to render the widgets that are closed and caled for
	 *               from the app dock
	 */
	initializeApps : function (){
		var config;
		var item='';
		var elem='';
		var apps = cbx.core.ws.metadata.getAppsByLayoutId(this.WORKSPACE_ID, this.LAYOUT_ID);
		for ( var i = 0, len = apps.length; i < len; i++) {
			elem=new cbx.lib.layer({"eleType": "div","id":"div_"+i,"data-widgetId":apps[i].WIDGET_ID, "data-layout-id": this.LAYOUT_ID}).getLayer();
			config = {
				elem : this.layoutExists?$(elem):this.getCmp(),
				uData : this.uData,
				PORTLET_REQ : true
			};
			cbx.core.extend(config, apps[i]);
			if(this.layoutExists){
				item = new canvas.lib.app(config);
				this.layoutType.createColComps(apps[i],elem);
			}else{
				this.appArr.push(new canvas.lib.app(config));
			}
		}
	},
	/**
	 * @method: addApps
	 * @memberof: cnavas.lib.widgetContainer
	 * @description: This is used to rerender the widget that were closed and then called from the app dock back to its
	 *               old position. Based on the appId that is passed this gets the corresponding widgets config and
	 *               makes a call for rendering the widget to its intial position where it was closed.
	 */
	addApps : function (appId)
	{
		var actualAppId = appId.split('---')[appId.split('---').length-1];
		
		var appConfig = cbx.core.ws.metadata.getAppByLayoutId(this.WORKSPACE_ID, this.LAYOUT_ID,actualAppId);
		
		var appData = IMM.getViewDefinition(actualAppId);
		
		var containerFlag = cbx.core.isEmpty(appConfig)?cbx.core.isEmpty(appData)?'Y':appData.CONTAINER_FLAG:appConfig.CONTAINER_FLAG;
		
		var element=$("#widgetcontainer").find('div[data-widgetId='+appId+']');
		
		var wgt_title = cbx.core.isEmpty(appConfig) ? "" : appConfig.WGT_TITLE; 
		wgt_title = cbx.isEmpty(CRB.getBundleValue(appConfig.WIDGET_BUNDLE_KEY, wgt_title)) ? wgt_title : CRB.getBundleValue(appConfig.WIDGET_BUNDLE_KEY, wgt_title);
		var widgetConfig={
					CONTAINER_FLAG :containerFlag,
					'WGT_HEADER_IND':'Y',
					WIDGET_ID : actualAppId,
					WGT_TITLE : wgt_title
		}; 
		
			var config = {
						elem : 	element,
						PORTLET_REQ : true,
						uData : this.uData
					};
			cbx.core.extend(config,widgetConfig);
			new canvas.lib.app(config);
			
	}
});

/**
 * 
 */
CLCR.registerCmp({'CONTAINER_TYPE':'WIDGET'}, canvas.lib.widgetContainer);