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

Ext.namespace("iportal.util");



/**
 * iportal.util.ajaxPiggyback
 * 
 * 
 * @copyright (c) 2009, by Intellect Design Arena.
 * 
 * @version 0.1
 * @singleton
 */

iportal.util.ajaxPiggyback=  function(){
	 return Ext.apply(new Ext.util.Observable, {
	 
	 		isPiggyBackInprocess : false,		
		 	/**
			 * Verify whether the request is a piggybackRequest or normal Ajax request
			 * based on the configurations. returns true if the request is a
			 * piggybackRequest else false
			 */
			isPiggybackRequest : function(configOption) {
				if(configOption.params.__PIGGYBACKREQUEST!==null && configOption.params.__PIGGYBACKREQUEST==="Y")
					return true;
				else
					return false;
			},
			/**
			 * Generates the piggybackRequest, It will sets the __PIGGYBACKREQUEST
			 * parameter in the configurations [option parameters], if the piggyback
			 * option is not available in the request and returns the option else
			 * returns the same option object
			 */ 
		    generatePiggybackRequest : function(configOption) {
				configOption["__PIGGYBACKREQUEST"]="Y";
				return configOption;
			},
			
			piggybackCallback : function(response, options) {
				iportal.apps.alertPiggybackListner.processHighUnPoppedupAlerts();
				
				iportal.util.ajaxPiggyback.isPiggyBackInprocess=false;
				var wsID = iportal.workspace.metadata.getCurrentWorkspaceId();
				if (wsID == "INF_REPORT") {
					cbx.apps.generatedReportsPiggybackListner.refreshGeneratedReportWidget();
				}
				
				
			} 
	 })
}();

