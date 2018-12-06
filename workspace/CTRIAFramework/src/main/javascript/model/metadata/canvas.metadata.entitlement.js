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
cbx.namespace("iportal");
/**
 * 
 */
iportal.entitlement = function(){
	/**
	 * 
	 */
 	var ENT_ACTIONS = null;
 	
	return ({
		
		/**
		 * 
		 */
		setEntitlementMetadata : function(entitlementData){
			ENT_ACTIONS = entitlementData;
		},
		
		/**
		 * 
		 */
	  	isActionEntitled : function( prodCode, context,action){
	  		var entitledActions = ENT_ACTIONS;
			var ContextArray;
			var actionList=[];
			var entlFlag = false;
			if(entitledActions[prodCode]){
	  			ContextArray = 	entitledActions[prodCode];
				if(!cbx.isEmpty(ContextArray)){
					actionList = ContextArray[context];
				}
				if(!cbx.isEmpty(actionList)){
					entlFlag = actionList.contains(action);
				}
			}
	  		return entlFlag;
	  	}, 
	  	
	  	/**
	  	 * 
	  	 */
	  	getListOfEntitledActions : function(prodCode,context){
	  		var entitledActions = cbx.decode(ENT_ACTIONS);
	  		var ContextArray;
			var actionList=[];
			if(entitledActions[prodCode]){
				ContextArray = 	entitledActions[prodCode];
				if(!cbx.isEmpty(ContextArray)){
					actionList = ContextArray[context];
				}
			}
	  		return actionList ;
	  	}
	 });
 }();
