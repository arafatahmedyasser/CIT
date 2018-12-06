/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.lib.multiapp");

/**
 * @class "canvas.lib.multiapp.tab"
 * @extends "cbx.core.Component"
 * @description This class is responsible for rendering tab layout for multi apps. 
 * 				Massages the data before calling the tab layout engine. 
 * 		  		Activation handler to be fired on the activation of any app in the multiapp 
 * @example
 * 			var mwLayClass = CLCR.getCmp({
 *				"COMP_TYPE" : "MULTI_APP",
 *				"LAYOUT" : "TAB"
 *			});
 *			
 */
canvas.lib.multiapp.tab= Class(cbx.core.Component, {
	constructor : function (config){
		/**@member  {Object} this.parentElem
		 * @memberof "canvas.lib.multiapp.tab"
		 * @description Contains the multiapp body DOM to which the tabbed child apps to be rendered
		 */
		this.parentElem = config.parentElem;
		/**@member  {Object} config
		 * @memberof "canvas.lib.multiapp.tab"
		 * @description Contains the child apps config
		 */
		this.configData=config;
		/**@member  {Object} layoutType
		 * @memberof "canvas.lib.multiapp.tab"
		 * @description Contains the layout type
		 */
		this.layoutType=config.layout;
			
		/**call to get the tabbed multiapp */
		this.getMultiAppLayout();
	},
	
	getMultiAppLayout : function(){
		var multiAppTabLayoutClass= CLCR.getCmp({			//Get tab layout component class
			"COMP_TYPE":"LAYOUT",
			"LAYOUT_TYPE":"TAB"
		});
		
		if(multiAppTabLayoutClass){
			var childAppsFormattedArray=[];	  
			this.childApps =this.configData.CHILD_WIDGETS;		//Get the list of child apps
			/*Start: Massaging the data for tab layout engine*/
			for ( var index = 0; index < this.childApps.length; index++) {		
					this.childApps[index].WIDGET_DISPLAY_NM = cbx.isEmpty(CRB.getBundleValue(this.childApps[index].WIDGET_BUNDLE_KEY,this.childApps[index].WIDGET_DISPLAY_NM))? this.childApps[index].WIDGET_DISPLAY_NM
														  : CRB.getBundleValue(this.childApps[index].WIDGET_BUNDLE_KEY,this.childApps[index].WIDGET_DISPLAY_NM);
					var childAppsObj={};
					childAppsObj['ITEM_ID']=this.childApps[index].WIDGET_ID;
					childAppsObj['ITEM_LABEL']=this.childApps[index].WIDGET_DISPLAY_NM;
					childAppsFormattedArray.push(childAppsObj);
			}
			/*End: Massaging data*/
			
			var multiAppTabLayoutConfig = {										//JSON to be sent to the tab layout engine
					parent_elem : this.configData.parentElem,						//Data item id of the parent to which tab layout to be appended
							tabStrip_req : this.layoutType=='CARD'|| this.layoutType=='SWITCH' ? false : true ,
							verticalTab : this.layoutType=='INDEXED' ? true : false ,
						//	defaultActiveTab:0 												//Default tab to be activated initially
					activationHandler:this.activateChildTabWidget,					//Method to be called to activate a tab(child app)
					implementationSubstring:'childApp_'+this.configData.WIDGET_ID,						//Prefix for the IDs of tab strip  
					presentation:false,												//Configuring the appearance of the tab layout (application of "WELL" class of bootstrap)
					activeClass:'active1',										//Extra class to be applied on the tab strip
					itemList : childAppsFormattedArray,								//Massaged data containing the child app list
					parentScope:this
			};
			
			this.multiAppTabLayoutObj= new multiAppTabLayoutClass(multiAppTabLayoutConfig);	//Invoke tab layout engine with the config parameter
		}	
	},
	switchMultiAppTab : function(activeTabIndex){
		this.activateChildTabWidget(this.childApps[activeTabIndex].WIDGET_ID,this.childAppContDataItemId,this,activeTabIndex);
	},
	
	findIndexOfChild : function (itemId){
		for ( var i = 0; i < this.childApps.length; i++) {
			
			if(this.childApps[i].WIDGET_ID==itemId)
				return i;
		}
	},
	
	setTitle : function(title){
		if(!cbx.isEmpty(title)){
			$('.'+this.configData.WIDGET_ID+'_tabItem').find('span').html(title);
			}
	},
	
	activateChildWidget : function(widgetId){
		var activeTabIndex= this.findIndexOfChild(widgetId);
		this.switchMultiAppTab(activeTabIndex);
	},
	
	activateChildTabWidget : function(childAppId,childAppContDataItemId,scope,index){
		scope.childAppContDataItemId = childAppContDataItemId;
		$('div[data-item-id= '+childAppContDataItemId+']').empty();
		var app = scope.childApps[index];
		
		var elem=new cbx.lib.layer({"eleType": "div","id":scope.configData.parentId+index,"data-widgetId":scope.configData.parentDataWidgetId+app.WIDGET_ID}).getLayer();
		 
		$('div[data-item-id= '+childAppContDataItemId+']').append(elem);
		
		var config = {
					elem :$(elem),
					PORTLET_REQ : false,
					parentPortlet : scope.configData.parentPortlet
				};
				cbx.core.extend(config, app);
	
		
		 var appObj= new canvas.lib.app(config);
		 
	}
});

CLCR.registerCmp({
	"COMP_TYPE" : "MULTI_APP",
	"LAYOUT" : "TAB"
}, canvas.lib.multiapp.tab);

CLCR.registerCmp({
	"COMP_TYPE" : "MULTI_APP",
	"LAYOUT" : "CARD"
}, canvas.lib.multiapp.tab);
CLCR.registerCmp({
	"COMP_TYPE" : "MULTI_APP",
	"LAYOUT" : "INDEXED"
}, canvas.lib.multiapp.tab);
CLCR.registerCmp({
	"COMP_TYPE" : "MULTI_APP",
	"LAYOUT" : "SWITCH"
}, canvas.lib.multiapp.tab);

