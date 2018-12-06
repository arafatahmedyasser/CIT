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
cbx.ns("cbx");
/**
 * The app selector registry which will allow a variety of serialized keys 
 * against a value.
 * The keys are expected to be 
 * {workspace_id,LayoutId,{multiwidget parent},Singular Widget Id,View_id}
 * The value will depend on what the particular view demands
 * e.g a selection criteria handler in case of List view,to select the records
 * and an APP_ID in case of APP view widgets.
 * 
 */
cbx.core.appSelectorRegistry = function (){
	var register = {};
	/**
	 * 
	 */
	var serialize=function (obj){
		var keys=[];
		for(i in obj){
			if(obj.hasOwnProperty(i)){
				keys.push(i);
			}
		}
		keys.sort();
		var str='';
		var key;
		for(var i=keys.length-1; i>=0; i--){
			key=keys[i]
			str+='|'+key+':'+obj[key]+'|';
		}
		return str;
	}
	return {
		/**
		 * 
		 */
		getViewHandler : function (config){
			if(register[serialize(config)]){
				return register[serialize(config)];
			}else{
				
			}
		},
		/**
		 * 
		 */
		registerHandler: function(config, className){
			register[serialize(config)]=className;
		}
	};
}();
/**
 * 
 */
ASHR = cbx.core.appSelectorRegistry;

cbx.core.appEvaluator = Class(cbx.Observable, {
	currWs : null,
	currLayout : null,
	viewId : null,
	widgetId : null,
	viewType : null,
	appData : null,
	constructor: function(config){
		var evaluateApp = function(){
			var viewData;
			var params = {
					"WORKSPACE_ID":this.currWs,
					"LAYOUT_ID":this.currLayout,
					"WIDGET_ID":this.widgetId,
					"VIEW_ID":this.viewId
			};
			var condition = ASHR.getViewHandler(params);
			switch(this.viewType){
			case "LIST":
				if(condition && cbx.isFunction(condition)){
					viewData = condition;
				}
				break;
			case"APP":
				viewData ="";
				if(cbx.isEmpty(condition)){
					var appMetadata = canvas.metadata.appcontainer.getAppContainerMetadata([params.WIDGET_ID]);
					for(var i=0;i<appMetadata.CHILD_APPS.length;i++){
						if(appMetadata.CHILD_APPS[i].IS_FAV_APP !=='Y' && appMetadata.CHILD_APPS[i].POSITION=="1"){
							viewData = appMetadata.CHILD_APPS[i].APP_ID;
							break;
						}
					}
				}else{
					viewData = condition;
				}
				break;
			}
			this.appData = viewData;
		}
		/**
		 * Have considered only workspaces,sub workspaces and Singular widgets
		 * here.
		 * @Note :This could later be extended for multi-widgets as well where
		 * the same view-widget combination could be a part of n number of 
		 * multi-widgets in the same sub workspace,where in different behaviour
		 *  is expected out of each configuration.
		 */
		this.currWs = iportal.workspace.metadata.getCurrentWorkspaceId();
		this.currLayout = iportal.workspace.metadata.getCurrentLayoutId();
		this.viewId = config.VIEW_ID;
		this.widgetId = config.WIDGET_ID;
		this.viewType = config.VIEW_TYPE;
		evaluateApp.apply(this);
	},
	/**
	 * 
	 */
	getDefaultApp : function(){
		return this.appData;
	},
	/**
	 * 
	 */
	doSelect : function(scope){
		var that = this;
		var fn = function(comp){
			if(comp.itemId && comp.itemId===that.widgetId){ 
				return true;
			}
		};
		var widObj = scope.findParentBy(fn);
		if(widObj && widObj.isDefaultWidget && widObj.isDefaultWidget ==="Y"){
			var serviceId =null,config={};
			switch(this.viewType){
			case "LIST":
				serviceId = iportal.jsutil.getDefaultContextApp(this.viewId);
				if(this.appData){
					config.recordSelect = this.appData;
				}
				break;
			case "APP":
				serviceId = this.appData;
				break;
			}
			cbx.AppContainerUtil.doAppSelection(widObj,serviceId,config);
			return true;
		}
		return false;
	}
});
