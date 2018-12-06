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
 
 */
/**
 * This class is intended to register the classes/handlers that will be used to
 * render contents to the header and footer area of the application.
 */
Ext.ns("cbx.applicationlayout.container");
cbx.applicationlayout.container.Register = function (){
	var layoutRegionMap = {};
	return Ext.apply(new Ext.util.Observable, {
		getRegionHandler : function (layout, position){
			return layoutRegionMap[layout + "|" + position];
		},
		registerRegionHandler : function (layout, position, implementation){
			layoutRegionMap[layout + "|" + position] = implementation;
		}
	});
}();
// creating a global variable
var CALCR = cbx.applicationlayout.container.Register;
