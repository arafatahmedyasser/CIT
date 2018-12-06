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

/**
 * @description : The class which will provide the standard API's for the 
 * implementing portlet.The Portlet will expose only this Class to the application.
 */

cbx.ns('cbx.lib');
cbx.lib.multiView = Class(cbx.Observable,{
	viewObj : null,
	mvEvents : null,
	constructor : function(config){
		cbx.lib.multiView.$super.call(this);
		this.viewId = config.viewId;
		this.widgetId = config.widgetId;
		this.dateParams = null;
		this.appEventRegistry = config.appEvents;
		this.mvEvents = config.appEvents.getEventHandlerMap();
		this.customView = config.customViewObj;
		this.registerCustomEvents();
		/**
		 * Added this code to let the implementation handlers have the MV scope for custom events
		 */
		var beforeLoad = this.mvEvents[CWEC.CTAPPBEFOREINITIALIZE]; 
		LOGGER.info(beforeLoad);
		if(!cbx.isEmpty(beforeLoad) && cbx.isFunction(beforeLoad)){
			beforeLoad.apply(this);
		}
		
	},
	
	raiseEvent : function(event,args){
		if(this.listeners[event]){
			var listenerConf = this.listeners[event];
			var scope = this.customView?this.customView.mv : this;
			listenerConf[0].fn.apply(scope,args)
		}
	},
	
	registerCustomEvents : function(){
		var that = this;
		$.each( this.mvEvents, function(event,handler) {
			LOGGER.info("Registering ",event," event for :",that.viewId);
			that.registerListener(event,handler,that);
		});
	},
	setViewObj : function(obj){
		this.viewObj = obj;
	},
	/**
	 * Will return the default view Obj
	 */
	getViewObj : function(){
		return this.viewObj;
	},
	getCurrentViewObj : function(){
		return this.viewObj;
	},
	getAd : function(){
		
	},
	getFormManager : function(){
		return this.viewObj.fmObj;
	},
	refreshWidgetData : function(extraParams){
		var _this = this;
		var extraParamsHandler = function(){
			var params = {};
			try {
				var itemId = _this.viewObj.scope.wpConfig.itemId;
				if(!cbx.isEmpty(itemId)){
					params = _this.viewObj.scope.fm.handlerEvent('cbxbeforeload',itemId, _this.dateParams);
				}
			} catch(e){ LOGGER.log("singular widget"); }
			return params;
		};
		extraParams = (cbx.isEmpty(extraParams))? extraParamsHandler() : extraParams;
		if(!cbx.isEmpty(extraParams)&& cbx.isObject(extraParams))
		{
		cbx.apply(extraParams, {
					"REFRESH_DATA":"Y"
				});
		}
		else
		{
		extraParams = {"REFRESH_DATA":"Y"};
		}
		var options = {
				'widgetID':this.widgetId,
				'workspaceID':this.viewObj.workspaceID,
				'md':this.viewObj.md,
				'appEvents':this.viewObj.appEvents,
				'extraParams':extraParams
		}
		new cbx.lib.widget.widgetTools([options]).widgetRefreshHandler();
	},
	applyDefaultDateParams : function(params){
		this.dateParams = params
	},
	getDefaultDateParams : function(){
		return this.dateParams;
	},
	clearDateFilter : function(reload){
		if(!cbx.isEmpty(this.dateParams)){
			delete this.dateParams["FILTER"+"_DATE"+"_FIELD"];
			delete this.dateParams["FILTER"+"_DATE"+"_CONSTRAINT"];
			delete this.dateParams["FILTER"+"_DATE"+"_VALUE_TXT"];
			delete this.dateParams["FILTER"+"_DATE"+"_VALUE_DATE"];
			delete this.dateParams["FILTER"+"_DATE"+"_VALUE_DATE2"];
			delete this.dateParams["FILTER"+"_DATE"+"_VALUE_TIME"];
			delete this.dateParams["FILTER"+"_DATE"+"_VALUE_TIME2"];
			delete this.dateParams["COLUMN_VALUE"];
			delete this.dateParams["IS_DATE_FILTER_FORM"];
			if(reload){
				this.refreshWidgetData();
			}
		}
	
	},
	applyDateFilter : function(values,reload){
    	var fromDate, toDate;
    	if("Y" === values.FILTER_RADIO1 && values.FILTER_COMBO){
    		var dateDetails = values.FILTER_COMBO.split("|");
    		fromDate = dateDetails[0];
    		toDate =  dateDetails[1];
    	}
    	else if ("Y" === values.FILTER_RADIO2){
    		fromDate = values.FILTER_FROMDATE;
    		toDate = values.FILTER_TODATE;
    	}
    	var params = {};
    	params["FILTER"+"_DATE"+"_FIELD"]=values.COLUMN_ID;
		params["FILTER"+"_DATE"+"_CONSTRAINT"]="range";
       	params["FILTER"+"_DATE"+"_VALUE_TXT"]="";
    	params["FILTER"+"_DATE"+"_VALUE_DATE"]=fromDate;
    	params["FILTER"+"_DATE"+"_VALUE_DATE2"]=toDate;
    	params["FILTER"+"_DATE"+"_VALUE_TIME"]="";	
    	params["FILTER"+"_DATE"+"_VALUE_TIME2"]="Select";
    	params["COLUMN_VALUE"]="_DATE";
    	params["IS_DATE_FILTER_FORM"]=true;	
    	this.dateParams = params;
    	if(reload){
    		this.refreshWidgetData();
    	}
	},
	refreshWidget : function(extraParams){
		if(!cbx.isEmpty(extraParams)&& cbx.isObject(extraParams))
		{
		cbx.apply(extraParams, {
					"REFRESH_DATA":"Y"
				});
		}
		else
		{
		extraParams = {"REFRESH_DATA":"Y"};
		}
		var options = {
				'widgetID':this.widgetId,
				'workspaceID':this.viewObj.workspaceID,
				'md':this.viewObj.md,
				'appEvents':this.viewObj.appEvents,
				'extraParams':extraParams
		};
		new cbx.lib.widget.widgetTools([options]).widgetRefreshHandler();
	},	
	
	switchWidget : function(sourcewidgetId,targetWidgetId,extraParams){
		
		cbx.core.dynamicWidgetManager({
			widgetId:targetWidgetId,
			widgetIdSwitchFrom:sourcewidgetId,
			widgetIdSwitchTo:targetWidgetId,
		    extraParamsHandler : function(Params){
		    	if(!cbx.isEmpty(extraParams)){
		    	cbx.apply(Params,extraParams);
		    	return Params;
		    	}
		    	else{
		    	  return Params;
		    	}
		    },
		    extraParams:extraParams,
			renderTo :'CUSTOM'
			});
	
	},
	updateTitle : function (title)
	{
		var viewObj = $(this.getCurrentViewObj().getViewDomWrapper());
		viewObj = viewObj.find('.tConfigTitle');
		if (title && viewObj.size() > 0)
		{
			viewObj.html(title);
	}
	}
	
})

