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
cbx.namespace('canvas.workspace');
/**
 * This Class contains the handlers methods to register, execute and get the custom space menus which needs to be placed in 
 * in MenuPanel. The 'custom space' menus position and its holding menu items will be differed based on the workspace.
 */
canvas.workspace.CustomMenuSpaceHandlerReg = function (){
	var obj = null;
	return {

		getInstance : function (){

			if (obj === null) {
				obj = {
					/**
					 * Intended to register a Hanlder.
					 * @param ob - Handler object needs to be registered
					 */
					registerHandler : function (ob){
						obj = ob;
					},
					/**
					 * Intended to register a Hanlder.
					 */
					getHandler : function (){
						return obj;
					},
					/**
					 * Intended to execute the registered handler
					 */
					executeHandler : function (config){
						var reOb = obj;
						if (reOb != null) {
							if ("function" == typeof reOb) {
								return reOb(config);
							} else {
								return reOb;
							}
						} 
						else {
							return {};
						}
					}
				};
			}
			return obj;
		}
	};
}();

/**
 * This is the Global variable used for registring and executing the handler for Custom menu space action.
 * 
 */
CMSHR = canvas.workspace.CustomMenuSpaceHandlerReg.getInstance();
