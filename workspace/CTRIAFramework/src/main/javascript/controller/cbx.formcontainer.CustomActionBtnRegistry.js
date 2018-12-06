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
cbx.ns('cbx.formcontainer');
/**
 * This class contains the default and custom registry for Form Action Buttons.
 * 
 * 
 */
cbx.formcontainer.CustomActionBtnRegistry = function (){
	var _ob = null;
	return {
		getInstance : function (){

			if (_ob === null) {
				_ob = {
					/***********************************************************
					 * Intended to register a Hanlder.
					 * 
					 * @param actId -
					 *            Action Button ID
					 * @param contId -
					 *            Container ID
					 * @param ob -
					 *            Handler object needs to be registered
					 */
					registerHandler : function (actId, contId, ob){
						_ob[actId + "_" + contId] = ob;
					},
					/***********************************************************
					 * Intended to return a handler function if registered. If
					 * not, an empty object is returned.
					 * 
					 * @param actId -
					 *            Action Button ID
					 * @param contId -
					 *            Container ID
					 */
					getHandler : function (actId, contId){
						var reOb = _ob[actId + "_" + contId];
						if (reOb != null) {
							return reOb
						} else {
							return {};
						}
					},
					/***********************************************************
					 * Intended to execute the handler.
					 * 
					 * @param actId -
					 *            Action Button ID
					 * @param contId -
					 *            Container ID
					 * @param config -
					 *            Config object of the Action Button
					 */
					executeHandler : function (actId, contId, config){
						var reOb = _ob[actId + "_" + contId];
						if (reOb != null) {
							if ("function" == typeof reOb) {
								return reOb(config)
							} else {
								return reOb
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
CABR = cbx.formcontainer.CustomActionBtnRegistry.getInstance();