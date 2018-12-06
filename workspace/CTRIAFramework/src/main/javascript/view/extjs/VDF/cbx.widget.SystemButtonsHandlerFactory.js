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

// Define the namespace for the widget
cbx.ns("cbx.widget");

/**
 * 
 
 * @date 10,Apr 2013
 * 
  
 * This factory singleton class intended to handle system buttons
 *  
 * @class cbx.widget.SystemButtonsHandlerFactory
 * @extends Ext.util.Observable
 */


cbx.widget.SystemButtonsHandlerFactory=function(){
	/**
	 * Declare the handerMap to store the cellClickHandlers via registerHandler method 
	 */
	var handlerMap ={}; 
	
	return {
		/**
		 * Intended to get cell click handler for given view/system id.
		 */
		getHandler : function(buttonId){
		
			return handlerMap[buttonId]; 
		},
		/**
		 * registerHandler method created for handle the cellclickHandler registration.
		 * @param id - Used as key to store the handler
		 * @param handler - denotes the handler file 
		 */
		registerHandler: function(buttonId, handler){ 
			handlerMap[buttonId]=handler;
		}
	}
}();
CWSBHF = cbx.widget.SystemButtonsHandlerFactory;



// EXPAND_ALL,COLLAPSE_ALL These are the registered system handlers written for the advancegrouping grid.

CWSBHF.registerHandler("EXPAND_ALL",function(cmpHeader,selectedData){
	
	cmpHeader.getGridCmp().expandAll(cmpHeader.getGridCmp());
	
});

CWSBHF.registerHandler("COLLAPSE_ALL",function(cmpHeader,selectedData){
	
	cmpHeader.getGridCmp().collapseAll(cmpHeader.getGridCmp());
	
});