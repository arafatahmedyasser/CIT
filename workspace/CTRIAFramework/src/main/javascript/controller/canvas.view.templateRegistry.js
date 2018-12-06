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
cbx.ns("canvas.view.templateRegistry");
/**
 * This is the class incharge of the registring the templates for the template components.
 */
canvas.view.templateRegistry= function (){

	var _ob = null;
	return {

		getInstance : function (){
			if (_ob === null) {
				_ob = {

					registerTemplate : function (id, ob){
						_ob[id] = ob;
					},

					getTemplate : function (id){
						var reOb = _ob[id];
						if (reOb != null) {
							return reOb;
						} else {
							return {};
						}
					},
					processTemplate : function (id, config){
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

/**
 * This is the Global variable used for registring and getting,processing the template for the components.
 * 
 */
CVTR = canvas.view.templateRegistry.getInstance();