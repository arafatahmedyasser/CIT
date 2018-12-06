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
		
 
 * 		
 * 		@version   1
 */

cbx.ns("cbx.lib");

/**
 * @class cbx.lib.dynamicWidgetRenderer -> Will register the container for the
 *        inner widget rendered by the Ext framework.
 */
cbx.lib.dynamicWidgetAppRenderer = Class(cbx.core.Component, {
	initialize : function() {
		var that = this;
		var wsCreateCallback = function(wsContainer) {
			// wsContainer.getLayoutManagerDOM().portal.container.appendChild(formWrapper);
			var widgetConfig = {
				WIDGET_ID : this.itemId,
				WGT_HEADER_IND : this.widgetHeaderInd ? "Y" : "N",
		        WGT_TITLE :this.label,
				BLOCK_POSITION : "CENTER",
				"CONTAINER_FLAG":this.isContainer
			};

			var config = {
				"widgetConfig" : widgetConfig,
				"extraParamsHandler":this.extraParamsHandler,	
				"extraParams":this.extraParams,
				// "workspaceID": this.workspaceID,
				"widgetContainer" : wsContainer.getWidgetContainer()
			};
			var widgetObj = new cbx.core.Apps(config);
			// $(formWrapper).trigger('create');
			// doIScroll('CONTENT_DIV','add');
		}
		var wsContainer = cbx.lib.workspacehandler.activateWorkspace(
				"ADDITIONAL_REQUEST", null, wsCreateCallback, that,false);
	}
});
CLCR.registerCmp({
	"COMPONENT" : "DYNAMIC_WIDGET_RENDERER",
	"LAYOUT" : "INLINE"
}, cbx.lib.dynamicWidgetAppRenderer);

/**
 * @class cbx.lib.dynamicWidgetRenderer -> Will switch  widget inside the container 
 */
cbx.lib.dynamicWidgetAppRenderer = Class(cbx.core.Component, {
	initialize : function() {
		
		
		var that = this;
		this.commManager = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().commManager;
		this.appMVRegistry = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry;
		var bundleKey= this.bundleKey && !cbx.isEmpty(this.bundleKey) ?this.bundleKey:CRB.getFWBundleKey()
		var widgetConfig = {
			WIDGET_ID : this.itemId,
			WGT_HEADER_IND : this.widgetHeaderInd ? "Y" : "N",
			WGT_TITLE : iportal.jsutil.getTextFromBundle(bundleKey,
					this.label),
			BLOCK_POSITION : "CENTER",
			"extraParamsHandler":this.extraParamsHandler,	
			"extraParams":this.extraParams,			
			"CONTAINER_FLAG":this.isContainer
		};
		
		if(cbx.isEmpty(widgetConfig.WGT_TITLE)){
			widgetConfig.WGT_HEADER_IND='N';
		}
		
		var config = {
			"widgetConfig" : widgetConfig,
			"extraParamsHandler":this.extraParamsHandler,	
			"extraParams":this.extraParams,		
			"widgetContainer" : this
		};
		var widgetObj = new cbx.core.Apps(config);
		
	},
	appendChild:function(item){
		var widgetContainer=cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer();
		var portalContainer=widgetContainer.portal.container;
		if(!cbx.isEmpty(this.widgetIdSwitchFrom) && !cbx.isEmpty(this.widgetIdSwitchTo)){			
		$(portalContainer).find('#'+this.widgetIdSwitchFrom).replaceWith(item.PORTLET.getItem(0).getLayer());	
		item.PORTLET.initiateWidget(item.scope)
		if(this.appMVRegistry){
			this.appMVRegistry.registerWidget(this.widgetIdSwitchTo,item.PORTLET.getViewObj());
		}
		else{
			var appMVReg = new canvas.core.communication.appMVRegistry();
			appMVReg.registerWidget(this.widgetIdSwitchTo,item.PORTLET.getViewObj());
		}
		}
	LOGGER.info('portlet',item.PORTLET)	
	}
});
CLCR.registerCmp({
	"COMPONENT" : "DYNAMIC_WIDGET_RENDERER",
	"LAYOUT" : "CUSTOM"
}, cbx.lib.dynamicWidgetAppRenderer);


cbx.lib.dynamicWidgetWindowRenderer = Class(cbx.core.Component,{
			popupPanel : null,
			commManager : null,
			appMVRegistry : null,
			initialize : function() {
				this.commManager = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().commManager;
				this.appMVRegistry = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry;
				var popupConfig = {
						"eleType" : "div",
						'id' : 'widget_container_panel',
						'data-role' : "popup",
						"data-corners" : "false",
						"data-theme" : "a",
						"data-shadow" : "false",
						"data-tolerance" : "0,0",
						"data-position-to" : "window"
					};

					var popup = new cbx.lib.layer(popupConfig).getLayer();
					$(popup).popup();
					this.popupPanel = popup;
					//popup.appendChild(formWrapper);
					$(popup).on({
						popupafteropen : function() {
							$(this).trigger('create');
							doIScroll('widget_container_panel', "add");
						}
					});
				var that = this;
				// wsContainer.getLayoutManagerDOM().portal.container.appendChild(formWrapper);
				var widgetConfig = {
					WIDGET_ID : this.itemId,
					WGT_HEADER_IND : this.widgetHeaderInd ? "Y" : "N",
					WGT_TITLE : iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),
							this.label),
					BLOCK_POSITION : "CENTER",
					"CONTAINER_FLAG":this.isContainer
				};
				
				var config = {
					"widgetConfig" : widgetConfig,
					// "workspaceID": this.workspaceID,
					"widgetContainer" : this
				};
				var widgetObj = new cbx.core.Apps(config);
				
				// $(formWrapper).trigger('create');
				// doIScroll('CONTENT_DIV','add');
			},
			appendChild:function(item){
				this.popupPanel.appendChild(item.PORTLET.getItem(0).getLayer());
				item.PORTLET.initiateWidget(item.scope)
				$(this.popupPanel).popup("open", {
					"transition" : "fade"
				});
			}
		});
CLCR.registerCmp({
	"COMPONENT" : "DYNAMIC_WIDGET_RENDERER",
	"LAYOUT" : "WINDOW"
}, cbx.lib.dynamicWidgetWindowRenderer);


cbx.lib.dynamicWidgetFormRenderer = Class(cbx.core.Component,{
	initialize : function() {
		// wsContainer.getLayoutManagerDOM().portal.container.appendChild(formWrapper);
		var widgetConfig = {
			WIDGET_ID : this.itemId,
			WGT_HEADER_IND : this.widgetHeaderInd ? "Y" : "N",
			WGT_TITLE :this.label,

			BLOCK_POSITION : "CENTER",
			"CONTAINER_FLAG":this.isContainer
		};
		var widgetContainer = this.containerId?$(this.scope.fm.wrapperPanel).find('#'+this.containerId):null;
		if(widgetContainer){
			var config = {
					"widgetConfig" : widgetConfig,
					// "workspaceID": this.workspaceID,
					"widgetContainer" : widgetContainer[0].parentCt,
					"extraParamsHandler":this.extraParamsHandler,
					"scope":this.scope
			};
			var widgetObj = new cbx.core.Apps(config);
		}
	}
});
CLCR.registerCmp({
"COMPONENT" : "DYNAMIC_WIDGET_RENDERER",
"LAYOUT" : "FORM"
}, cbx.lib.dynamicWidgetFormRenderer);


/**
 * 
 */
cbx.lib.dynamicWidgetWindowRenderer = Class(cbx.core.Component,{
	popupPanel : null,
	commManager : null,
	appMVRegistry : null,
	initialize : function() {
		this.commManager = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().commManager;
		this.appMVRegistry = cbx.core.ws.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry;
		
		var that = this;
		var widgetConfig = {
			WIDGET_ID : this.itemId,
			WGT_HEADER_IND : this.widgetHeaderInd ? "Y" : "N",
			WGT_TITLE : iportal.jsutil.getTextFromBundle(CRB.getFWBundleKey(),
					this.label),
			BLOCK_POSITION : "CENTER",
			"CONTAINER_FLAG":this.isContainer	
		};
		
		var config = {
			"widgetConfig" : widgetConfig,
			"widgetContainer" : this
		};
		var widgetObj = new cbx.core.Apps(config);
	},
	appendChild:function(item){
		$(this.renderEle).append(item.PORTLET.getItem(0).getLayer());
		item.PORTLET.initiateWidget(item.scope);
	}
});
CLCR.registerCmp({"COMPONENT" : "DYNAMIC_WIDGET_RENDERER","LAYOUT" : "INLINE_DIV"}, cbx.lib.dynamicWidgetWindowRenderer);