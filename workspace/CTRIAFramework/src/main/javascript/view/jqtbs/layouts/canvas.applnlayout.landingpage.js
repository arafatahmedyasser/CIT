/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.applnlayout.landingpage');
/**
 * @namespace "canvas.applnlayout.card"
 * @description This component is currently responsible Jquery Framework to rendered card layout header.
 */
canvas.applnlayout.landingpage = Class({
	/**
	 * @class "canvas.applnlayout.landingpage"
	 * @description The constructor gets the metadata and parent element (#HEADER)
	 */
	parentElem : null,
	constructor : function (config)
	{
		this.parentElem = config.parentElem;
	},
	/**
	 * @method getHeaderDOM
	 * @memberof "canvas.applnlayout.landingpage"
	 * @description This method is responsible for loading the user picture, user info, last login time with the
	 *              template (cardheader.cttpl)
	 */
	getLandingDOM : function ()
	{
		var componentJSON = {};
		var tmpLayer = new ct.lib.tmplLayer('al-landing-page.cttpl', componentJSON);
		tmpLayer.getTemplate(this.applyTemplate, this);
	},
	/**
	 * @method applyTemplate
	 * @memberof "canvas.applnlayout.landingpage"
	 * @description This method gets the template, appends it to the parent element and adds click listener for user
	 *              prefernces and logout.
	 */
	applyTemplate : function (template, tmpClass)
	{		
		if (!cbx.core.isEmpty(this.parentElem))
		{
			$(this.parentElem).append(template);

		}		
	}

});

CLCR.registerCmp({
	"COMPONENT" : "sample-landing-page",
	"APPLICATION_FW" : "JQTBS"
}, canvas.applnlayout.landingpage);
