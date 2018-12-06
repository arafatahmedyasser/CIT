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
cbx.ns('canvas.applnlayout.stack');
/**
 * The Header component currently responsible Jquery Framework rendered header.
 * 
 */
canvas.applnlayout.stack.header = Class({
	headerData : null,
	parentElem : null,
	constructor : function(config) {
		this.headerData = config.md || {};
		this.parentElem = config.parentElem;
	},
	getHeaderDOM : function() {
		var htmlStr =   CLHFR.getContent("jqui","header");
		var headerObj =  new cbx.lib.layer({
			"eleType" : "div",
			"html" :htmlStr
		}).getLayer();
		if (!cbx.core.isEmpty(this.parentElem)) {
			$(this.parentElem).append(htmlStr);
		}
		if (headerObj.getLayer) {
			return headerObj.getLayer();
		} else {
			return headerObj;
		}
	}
});
CLCR.registerCmp({"COMPONENT":"APPLICATION_HEADER","LAYOUT":"STACK"},canvas.applnlayout.stack.header);
