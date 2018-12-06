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
		
 * 		@version   1
 */

cbx.ns("cbx.lib");

/** @class cbx.lib.dynamicWidgetRenderer -> Will register the container for the
 * inner widget rendered by the Ext framework.
 */
cbx.lib.dynamicWidgetRenderer = Class(cbx.core.Component,{
	initialize : function() {
		var config = {
				'WIDGET_ID' : this.itemId,
				isClosed : false,
				isContainer : this.isContainer
				
			};
		/**
		 * Initiating the widget
		 */
		
		var title = null;
		//var widget = iportal.jsutil.initiateWidget(config);
		var bundle = CRB.getFWBundle();
		if(!cbx.isEmpty(this.label)){
			title = bundle[this.label];
		}
		
		/*widget.mv.isParentPortlet = true;
		widget.mv.isLoadingToolsInside = true;*/
		/**
		 * creating the config for the container panel and then creating the 
		 * Ext.Panel with these config options
		 */
		var containerConfig = {
				name : 'wrapper-owner',
				autoDestroy : true,
				header : this.widgetHeaderInd,
				height : this.height?this.height:null,
				collapsed : true,
				//collapsible : true,
				autoScroll : false,
				//items : [widget.mv],
				title : title,
				layout : 'fit',
				
				autoWidth : true,
				showToolIcon : function(showFlag){
					/**
					 * Giving a delay as the transition takes .5 and hence 550
					 * see : multiviewheader
					 */
					var callback = function(){
						cbx.widgetUtil.showtoolIcon(this,showFlag);
					};
					var task = new Ext.util.DelayedTask(callback, this, [ true ]);
					task.delay(550);
				}
		};
		if(!this.height){
			delete containerConfig.height;
		}
		var container = new Ext.Panel(containerConfig);
		/**
		 * Getting the tools from the widget utility class
		 */
		container.tools = cbx.widgetUtil.getTools.apply(container);
		/**
		 * Adding this to the Core component
		 */
		if(container.rendered){
			var widget = iportal.jsutil.initiateWidget(config);
			container.items=[widget.mv];
		}
		else{
			container.on('afterRender',function(container){
				var widget = iportal.jsutil.initiateWidget(config);
				container.add(widget.mv);
				container.doLayout();
			},config);
		}
		this.addItem(container);
	}
});
CLCR.registerCmp({"COMPONENT":"DYNAMIC_WIDGET_RENDERER","LAYOUT":"INLINE"},cbx.lib.dynamicWidgetRenderer);


cbx.lib.dynamicWidgetFormRenderer = Class(cbx.core.Component,{
initialize : function() {
var config = {
				'WIDGET_ID' : this.itemId,
				isClosed : false,
		
				isContainer : this.isContainer,
		containerPanel : this.container,
		extraParamsHandler : this.extraParamsHandler,
		containerPanel : this.container,
				isParentPortlet : true,
				isLoadingToolsInside : true,extraParamsHandler : this.extraParamsHandler,
				height : cbx.jsutil.getWidgetheight(this.maxNumLines)
			};
/**
 * Initiating the widget
 */

var title = null;
var widget = cbx.jsutil.initiateWidgetForForm(config);/*Events for FormWidgets*/
var bundle = CRB.getFWBundle();
if(!cbx.isEmpty(this.label)){
	title = bundle[this.label];
}

/**
 * creating the config for the container panel and then creating the 
 * Ext.Panel with these config options
 */

		var container = this.container;
		if (widget != null) {
			container.add(widget.mv);
			
			if (container.resizableInd && container.resizableInd === "Y") {
				container.resizer = new Ext.Resizable(container.el, {
					handles : 's',
					pinned : true,
					transparent : true
				});
				container.resizer.on('resize', container.resizerAction, this);
			}
			
		}
		container.ownerCt.doLayout();

/**
 * Getting the tools from the widget utility class
 */
container.tools = cbx.widgetUtil.getTools.apply(container);
}
});
CLCR.registerCmp({"COMPONENT":"DYNAMIC_WIDGET_RENDERER","LAYOUT":"FORM"},cbx.lib.dynamicWidgetFormRenderer);
