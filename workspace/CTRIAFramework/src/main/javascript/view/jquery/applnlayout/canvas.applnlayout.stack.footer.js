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
 * The Header component currently responsible Jquery Framework rendered footer.
 * 
 */

canvas.applnlayout.stack.footer = Class({
	headerData : null,
	parentElem : null,
	constructor : function(config) {
		this.footerData = config.md || {};
		this.parentElem = config.parentElem;
	},
	getFooterDOM : function() {
		var htmlStr =   CLHFR.getContent("jqui","footer");
		var footerObj =  new cbx.lib.layer({
			"eleType" : "div",
			"html" :htmlStr
		}).getLayer();
		if (!cbx.core.isEmpty(this.parentElem)) {
			$(this.parentElem).append(htmlStr);
		}
		if (footerObj.getLayer) {
			return footerObj.getLayer();
		} else {
			return footerObj;
		}
	}
});
CLCR.registerCmp({"COMPONENT":"APPLICATION_FOOTER","LAYOUT":"STACK"},canvas.applnlayout.stack.footer);
