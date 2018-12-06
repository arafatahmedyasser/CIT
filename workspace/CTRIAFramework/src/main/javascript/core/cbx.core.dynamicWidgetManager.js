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
cbx.ns('cbx');
/**
 * @class cbx.core.dynamicWidgetManager - will act as the manager for all the 
 * dynamic widget renderers implemented across a variety of frameworks.
 */ 
cbx.core.dynamicWidgetManager = Class(cbx.Observable,{
	/**
	 * Will call the corresponding lib's initiate widget to render the widget
	 * and repaint the passed widget id(if any) with the initiated widget
	 */
	constructor : function(config){
		var cClass = CLCR.getCmp({
			"COMPONENT":"DYNAMIC_WIDGET_RENDERER",
			"LAYOUT":config.renderTo
		});
		/**
		 * Will get the app Widget object and call the view's
		 * activateContainer with the certain options
		 * 
		 * @Note : every framework should expose this api(activateContainer)
		 *  with certain parameters to replace the existing view with the new
		 *  View obj and it will not be done by this class
		 */
		var rePaintAppWidget = function(appWidgetId,cmp){
			var widgetContainer = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer();
			appWidgetId = appWidgetId===false?"":appWidgetId;
			var appWidgetObj = widgetContainer.appMVRegistry.getWidget(appWidgetId);
			if(appWidgetObj){
				/**
				 * getCurrentViewObj -> The API any framework extending the CBX FW
				 * should provide,to get the active view Object
				 */
				var ownerPanel = appWidgetObj.getCurrentViewObj();
				if(ownerPanel){
					var options = {
						isCBXContainer : true,
						type : 'W'
					};
					ownerPanel.activateContainer(cmp,appWidgetObj,options);
				}
			}
			else{
				LOGGER.info("Invalid app Widget");
			}
		};
		if(config.widgetId){
			/**
			 * Making an jax call to get the required parameters to render the widget
			 */
			cbx.ajax({
				params : {
					INPUT_ACTION : "GET_WIDGET_MD",
					INPUT_FUNCTION_CODE : "VSBLTY",
					INPUT_SUB_PRODUCT : "CUSER",
					INPUT_PRODUCT : "CUSER",
					PAGE_CODE_TYPE : "VDF_CODE",
					PRODUCT_NAME : "CUSER",
					WIDGET_ID : config.widgetId 
				},
				success : function(metadata){
					var widgetHeader = metadata.WIDGET_HEADER_IND && metadata.WIDGET_HEADER_IND ==="Y"?true:false;
					var widgetHeight = metadata.WGT_HT_IN_PIXELS && !cbx.isEmpty(metadata.WGT_HT_IN_PIXELS) ?Number(metadata.WGT_HT_IN_PIXELS):null;
					var containerFlag = metadata.CONTAINER_FLAG && !cbx.isEmpty(metadata.CONTAINER_FLAG) ?metadata.CONTAINER_FLAG:'N';
					var text = metadata.WGT_DISPLAY_NM && !cbx.isEmpty(metadata.WGT_DISPLAY_NM) ?metadata.WGT_DISPLAY_NM:'';
					var bundleKey = metadata.BUNDLE_KEY && !cbx.isEmpty(metadata.BUNDLE_KEY) ?metadata.BUNDLE_KEY:'';
					var elem = {
							itemId : config.widgetId,
							widgetHeaderInd : widgetHeader,
							height : widgetHeight,
							containerId : config.containerId?config.containerId:null,
							isContainer : containerFlag,
							label : text,
							extraParamsHandler :  config.extraParamsHandler?config.extraParamsHandler:null,
							extraParams:config.extraParams?config.extraParams:null,
							scope : config.scope?config.scope:null,
							container : config.containerPanel,
							bundleKey:bundleKey,
							renderEle:config.renderEle
					};
					if(cbx.isEmpty(widgetHeight)){
						delete elem['height'];
					}
					if(!cbx.isEmpty(config.widgetIdSwitchFrom)){
						elem['widgetIdSwitchFrom']=config.widgetIdSwitchFrom;
					}
					if(!cbx.isEmpty(config.widgetIdSwitchTo)){
						elem['widgetIdSwitchTo']=config.widgetIdSwitchTo;
					}
					var layoutId = cbx.core.ws.metadata.getCurrentLayoutId();
					var appWidgetId = config.appWidget ?config.appWidget : iportal.workspace.metadata.getContextApp(layoutId);
					var component = new cClass(elem).getItem(0);
					if(component){
						rePaintAppWidget(appWidgetId,component);
					}
				}
			});
		}
	}
});