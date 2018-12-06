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
cbx.ns('cbx.view');
/**
 * @class "cbx.view.emptyPanel"
 * @extends "cbx.core.Component"
 * @description This class is used for creating emptyPanel View.
 * @author Sivasubramaniam. D
 */
cbx.view.emptyPanel = Class(cbx.core.Component, {

	/**
	 * @method "initialize"
	 * @memberof "cbx.view.emptyPanel"
	 * @description "Initialize the empty view component"
	 */
	constructor: function(config)
	{
		this.widgetId = config.widgetId;
		this.workspaceId = config.workspaceId;
		this.viewMd = config.md;
		this.parentElem = config.appendTO;
		this.createEmptyComponent();
	},
	/**
	 * @method "createEmptyComponent"
	 * @memberof "cbx.view.emptyPanel"
	 * @description "Creating empty view component, Getting the view metadata and compiled it with the template."
	 */
	createEmptyComponent : function ()
	{
		var emptyConfig = {
			eleType : "div",
			html : "",
			"style" : {
						"background-color" : "#FFFFFF"
					}
		}
		this.emptyLayer = new cbx.lib.layer(emptyConfig).getLayer();
		this.userMsg = this.getUserContent();
		this.appendUserContent(this.userMsg);
	},
	/**
	 * @method "getUserContent"
	 * @memberof "cbx.view.emptyPanel"
	 * @description "This module is for getting the user content using CGH. If there is no user content then set the
	 *              default message to the display content"
	 */
	getUserContent : function ()
	{
		this.defaultMsg ="";
		this.elem = $(this.parentElem).empty();
		this.viewId = this.viewMd.VIEW_ID;
		this.userContent = CGH.getHandler(this.viewId, this.viewMd);
		return cbx.isEmpty(this.userContent) ? this.defaultMsg : this.userContent;
	},
	/**
	 * @method "appendUserContent"
	 * @memberof "cbx.view.emptyPanel"
	 * @description "Appending the display content to the Empty view."
	 */
	appendUserContent : function (data)
	{
		$(this.elem).html( $(this.emptyLayer).append(data));
	},
	/**
	 * @method "refreshEmpty"
	 * @memberof "cbx.view.emptyPanel"
	 * @description "Refreshing the display content for Empty view."
	 */
	refresh : function ()
	{
		this.getUserContent();
	}
});
/**
 * Registering the empty view component to the CLCR Library.
 */

CLCR.registerCmp({'COMP_TYPE':'EMPTY'}, cbx.view.emptyPanel);

