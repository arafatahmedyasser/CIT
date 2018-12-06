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
cbx.ns('canvas.core');
canvas.core.appEventRegistry = Class(cbx.Observable, {
	appId : '',
	viewId:'',
	eventHandlerMap : {},
	mvObj : null,
	constructor: function(config){
		canvas.core.appEventRegistry.$super.call(this);
        this.viewType = config.viewType;
        this.appId = config.widgetId;
        this.viewId = config.viewId;
        this.eventHandlerMap = {};
        var events = this.getEvents();
        this.getHandlers(events);
	},
	getEvents : function(){
		var applicableMVEvents = this.getApplicableEvents(this.viewType); 
		if(!cbx.isEmpty(applicableMVEvents)){
			return applicableMVEvents;
		}
	},
	getHandlers : function(events){
		if(events && cbx.isArray(events)){
			for(var i=0;i<events.length;i++){
				if(CWEH.getHandler(this.appId,events[i])){
					this.eventHandlerMap[events[i]] =CWEH.getHandler(this.appId,events[i]);
				}
			}
		}
	},
	getApplicableEvents : function(viewType){
		return canvas.core.appEventsProvider.getEventMappingForViews(viewType);
	},
	getEventHandlerMap : function(){
		return this.eventHandlerMap;
	},
	raiseEvent : function(event){
		if(this.eventHandlerMap[event]){
			
		}
	},
	setMVObj : function(mvObj){
		this.mvObj = mvObj;
	},
	getMVObj : function(){
		return this.mvObj;
	}
	
});
/**
 * 
 */
canvas.core.appEventsProvider = function(){
	var mvEventObj = {};
	var viewTypes = ["LIST","PAGING","CLASSIC_GRID","ADVGROUP","GROUP","FORM","TREE","EMPTY","MAP","IFRAME","ADS","APP","CHART","ORG","TEMPLATE"];
	/*
	 * List of base events which any view type has to support
	 */
	var baseEvents = [
	                  CWEC.BBUT_CLICK,
	                  CWEC.PREF_CHNG,
	                  CWEC.VIEW_CHANGE,
	                  CWEC.EXTRA_PARAMS_HDLR,
	                  CWEC.WGT_EXPAND,
	                  CWEC.WGT_COLLAPSED,
	                  CWEC.CTAPPBEFOREINITIALIZE,   //Changing Event Name (for Mobile)
	                  CWEC.CTAPPONDESTROY			//Changing Event Name (for Mobile)
	                  ];
	for(var i=0;i<viewTypes.length;i++){
		switch(viewTypes[i]){
			case "LIST":
			case "PAGING":
			case "CLASSIC_GRID":
				mvEventObj[viewTypes[i]] = [CWEC.CELL_CLICK,CWEC.CONTEXT_CLICK,CWEC.SINGLE_CLICK,CWEC.VERIFY_DATE,CWEC.AFTER_TEMPLATE_LOAD,CWEC.BEFORE_TEMPLATE_LOAD];
				break;
			case "ADVGROUP":
			case "GROUP":
				mvEventObj[viewTypes[i]] = [CWEC.CELL_CLICK,CWEC.CONTEXT_CLICK,CWEC.SINGLE_CLICK,CWEC.GP_CONT_MENU_CLICK,CWEC.GP_DBL_CLICK,CWEC.VERIFY_DATE,CWEC.AFTER_TEMPLATE_LOAD];
				break;
			case "FORM":
				mvEventObj[viewTypes[i]] =[CWEC.FORM_INITIALIZE,CWEC.FORM_BEFORE_INITIALIZE];
				break;
			case "EMPTY":
				mvEventObj[viewTypes[i]] =[];
				//TODO : Empty view events
				break;
			case "TREE":
				mvEventObj[viewTypes[i]] = [CWEC.TREE_CLICK,CWEC.NODE_CLICK,CWEC.FLOW_CLICK];
				break;
			case "MAP":
				mvEventObj[viewTypes[i]] =[];
				//TODO : Map view events
				break;
			case "IFRAME":
				mvEventObj[viewTypes[i]] =[];
				//TODO : Iframe view events
				break;
			case "ADS":
				mvEventObj[viewTypes[i]] =[];
				//TODO : ADS view events
				break;
			case "APP":
				mvEventObj[viewTypes[i]] =[];
				//TODO : App view events
				break;
			case "CHART":
				mvEventObj[viewTypes[i]] =[CWEC.GRAPH_DRILL_DOWN];
				//TODO : Chart view events
				break;
			case "ORG":
				mvEventObj[viewTypes[i]] =[];
				break;
			case "TEMPLATE":
				mvEventObj[viewTypes[i]] =[CWEC.AFTER_TEMPLATE_LOAD,CWEC.BEFORE_TEMPLATE_LOAD,CWEC.EXTRA_PARAMS_HDLR,CWEC.CELL_CLICK,CWEC.CELL_DATA_CHANGE,CWEC.SINGLE_CLICK];
				//TODO : Chart view events
				break;
		}
		mvEventObj[viewTypes[i]] = mvEventObj[viewTypes[i]].concat(baseEvents);
	}
	return {
		getEventMappingForViews : function(viewId){
			return mvEventObj[viewId]; 
		}
	}
	
}();