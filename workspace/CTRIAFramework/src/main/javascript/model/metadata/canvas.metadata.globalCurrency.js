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
cbx.namespace('cbx.globalcurrency');

cbx.globalcurrency.metadata = function(){
  
 	var CURR_DECIMAL_MAP = {};
 	var DEFAULT_CURRENCY = null;
 	
	return ({
	 	getCurrDecimalPlaceList : function(){
	 	    	return CURR_DECIMAL_MAP;
	 	},
	 	setCurrDecimalPlaceList : function(currDecimalMap){
 	    	CURR_DECIMAL_MAP = currDecimalMap;
	 	},
	 	getDefaultCurrency : function(){
		    	return DEFAULT_CURRENCY;
		},
	 	setDefaultCurrency : function(sDefaultCurrency){
	 		DEFAULT_CURRENCY = sDefaultCurrency;
	 	}
	})
  
}();