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
cbx.namespace("cbx.contextMenu.contextMenuHandlerReg");

/**
 * This Class contains the default and custom handlers for context menus.
 * 
 */
/**
 * Custom Handler for the user to register handlers for the context menus in the
 * absence of Form Container Ids attached to the menu nodes
 * 
 * @param config - config object contains the record, view Id, menu Id and event
 * details for the particular menu node
 */
cbx.contextMenu.contextMenuHandlerReg = function (){
	var _ob = null;
	return {
		getInstance : function (){

			if (_ob === null) {
				_ob = {
					// Intended to register a Hanlder.
					// @param id - Handler id/name
					// @param ob - Handler object needs to be registered
					registerHandler : function (id, ob){
						_ob[id] = ob;
					},
					// Intended to return Handelr.
					// @param id - Handler id/name
					// @return ob - Handler object
					// Note: if bundle object not already added for given
					// handler id/name.
					// It would return empty object.
					getHandler : function (id){
						var reOb = _ob[id];
						if (reOb != null) {
							return reOb;
						} else {
							return null;
						}
					},
					
					registerCondition : function(id,ob){
						_ob[id] = ob;
					},
					getCondition : function (id){
						var reOb = _ob[id];
						if (reOb != null) {
							return reOb;
						} else {
							return null;
						}
					},
					
					// Intended to execute the registered handler
					executeHandler : function (id, config){
						var reOb = _ob[id];
						if (reOb != null) {
							if ("function" == typeof reOb) {
								return reOb(config);
							} else {
								return reOb;
							}

						} else {
							return {};
						}
					}
				};
			}
			return _ob;
		}
	};
}();
CMHR = cbx.contextMenu.contextMenuHandlerReg.getInstance();
