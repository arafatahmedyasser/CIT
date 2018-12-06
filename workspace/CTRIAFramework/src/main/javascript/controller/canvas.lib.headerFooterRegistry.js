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
cbx.ns("canvas.lib");
/**
 * This is the registry class is incharge of registrying the header and footer for particular framework with particular contnent.
 *  
 */
canvas.lib.headerFooterRegistry = function (){

	var _ob = null;
	var layoutContent = {};

	var _defaultContent = "The Header or Footer is NOT configured";
	return {
	
		getInstance : function (){
			if (_ob === null) {
				_ob = {
					// Intended to register a contnent for the particular position for particular framework for particular layout.
					// framework -  jqui,jqm,ext
					// position -  header,footer
					// obj	- the object which need to rendered in screen
					
					registerContent : function (framework,position,content){
						layoutContent[framework+"___"+position] = content;
					},
					
					// Intended to return actual content.
					getContent : function (framework,position){
						var reOb = layoutContent[framework+"___"+position];
						if (!cbx.isEmpty(reOb)) {
							return reOb;
						} else {
							return _defaultContent;
						}
					}
				};
			}
			return _ob;
		}
	};
}();

/**
 * This is the Global variable used for registring and rendering the header and footer components in the workspace.
 * 
 */
CLHFR = canvas.lib.headerFooterRegistry.getInstance();

