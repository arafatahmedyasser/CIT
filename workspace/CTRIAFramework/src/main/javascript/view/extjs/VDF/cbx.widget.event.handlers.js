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
/**
 * Constants object to be used for MENU Initialization and Operation
 * */
cbx_widget_event_constant={
 VIEW_CHANGE 		:'viewchange',
 CELL_CLICK 		:'cellclick',
 CONTEXT_CLICK		:'contextclick',
 DRILL_DOWN			:'drilldown',
 PREF_CHNG			:'preferencechange',
 BBUT_CLICK			:'bbuttonclick',
 TREE_CLICK			:'treeclick',
 NODE_CLICK			:'nodeClick',
 FLOW_CLICK			:'flowClick',
 WGT_EXPAND			:'widgetexpand',
 DATA_MOD			:'dataModified',
 GP_CONT_MENU_CLICK	:'groupcontextmenuclick',
 GP_DBL_CLICK		:'groupdoubleclick',
 EXTRA_PARAMS_HDLR	:'extraParamsHandler'

};

var CWEC=cbx_widget_event_constant;

/**
 * @class	cbx.widget.event.handler	
 * 			Is a Singleton class used for registering widget event handlers by the developer.
 * 			The Framework classes and compoented will be wiring events to this class for recevicing
 * 			appropriate handlers for widgets and executing them.
 * 
 * @usage	The developer will use the following construct to register an handler for a events for the widgets:
 * 			CWEH.registerHandler(<WIDGET_ID>, <CWEC.EVENTS>, function definition/ reference); 
 * 
 * 			CWEH.registerHandler("WGT_INTERCO_LOAN", CWEC.CELL_CLICK, function(config){
 * 
 * 			});
 * * */

cbx_widget_event_handler = function(){
	var _ob=null;
	return {
      getInstance : function(){
					 if(_ob === null){
					    _ob = { 
					    		//Intended to register a Hanlder. 
					    		//@param id - Handler id/name
					    		//@param ob - Handler object needs to be registered
							   registerHandler:function(id, event,ob){
							   	_ob[id+"_"+event] = ob;	
							   },
							    //Intended to return Handelr.
					    		//@param id - Handler id/name 
					    		//@return ob - Handler object
							   	// Note: if bundle object not already added for given handler id/name. 
							   	// It would return empty object.
							   getHandler:function(id, event){
								   	var reOb =_ob[id+"_"+event];
								   	if(reOb!= null){
							   			return reOb
								   	}else{ 
								   		return {};
								   	}
							   }						   
					   };
					 }
					 return _ob;
      				}
		};
}();

CWEH = cbx_widget_event_handler.getInstance();

