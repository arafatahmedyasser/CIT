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
cbx.namespace('canvas.globalhandlers');
/**
 * canvas.globalhandlers
 *
 * Singleton class intended to store mapping of global handlers that can be used through out the application.
 * It has two apis, one is for one is for registering the handlers and other to return the handler.
 */
canvas.globalhandlers = function(){
	var _ob=null;
	return {
		getInstance : function(){
    	  	if(_ob === null){
			    _ob = { 
		    		/**
		    		 * Intended to register a Hanlder. 
		    		 * @param id - Handler id/name
		    		 * @param ob - Handler object needs to be registered
		    		 */
				   registerHandler:function(id,ob){
				   	_ob[id] = ob;	
				   },
				   /**
				    * Intended to return Handelr.
				    * @param id - Handler id/name
				    * @return ob - Handler object
				    * Note: if bundle object not already added for given handler id/name. 
				    * It would return empty object.
				    */
				   getHandler:function(id, config){
					   	var reOb =_ob[id];
					   	if(reOb!= null){
				   			return reOb;
					   	}else{ 
					   		return {};
					   	}
				   },
				   executeHandler:function(id, config){
					   	var reOb =_ob[id];
					   	if(reOb!= null){
					   		if("function"== typeof reOb){
					   			return reOb(config);
					   		}
					   		else{
					   			return reOb;
					   		}
					   		
					   	}
					   	else{ 
					   		return {};
					   	}
				   }
			   };
			}
    	  	return _ob;
		}
	};
}();
/**
 * This is the Global variable used for registring and executing the handler for communication of from all the location.
 * 
 */
CGH = canvas.globalhandlers.getInstance();