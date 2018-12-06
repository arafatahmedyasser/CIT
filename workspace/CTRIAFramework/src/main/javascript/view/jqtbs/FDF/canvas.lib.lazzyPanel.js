/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('ct.lib.formElement');
/**
 * @namespace "canvas.lib"
 * @description This component is responsible to display a panel which acts as container for other form elements.
 */
canvas.lib.LazzyPanel = Class(canvas.lib.FormCmpManager,{
	/**
	 * @class "canvas.lib.LazzyPanel"
	 * @extends "canvas.lib.FormCmpManager"
	 * @description The events on and by the component are described below
	 */
	initialize: function() {
		/**
		 * BO:(Enabling "cbxexternalplugin") Enabling externalplugin option
		 */
		this.formData = (cbx.isEmpty(this.formData)) ? this : this.formData;
		var parent = new cbx.lib.layer({"eleType" : "div", "class": "panel panel-default" }).getLayer();
		if(!cbx.isEmpty(this.formData) && !cbx.isEmpty(this.formData.plainLbl)){
			var lazzy_header = $('<div class="panel-heading"><h3 class="panel-title">'+this.formData.plainLbl+'</h3></div>');		
			$(parent).append(lazzy_header);
		}
		var lazzy_body = new cbx.lib.layer({"eleType" : "div", "class": "panel-body", "data-item-id" : "lazzyPanel" }).getLayer();		
		$(parent).append(lazzy_body);
		var externalObj = this.formManager.handlerEvent("cbxexternalplugin", this.itemId) || false;
		if(!externalObj)
			this.renderChildItems($(lazzy_body));
		else {
			$(lazzy_body).empty().append(externalObj);
		}
		var lazzy_footer = new cbx.lib.layer({"eleType" : "div", "class": "panel-footer"}).getLayer();		
		$(parent).append(lazzy_footer);
		var container = (!cbx.isEmpty(this.formData) && !cbx.isEmpty(this.formData.parentObj))? $(this.formData.parentObj) : this.parentContainer;
		container.append(parent);
		/**
		 * BO: EOF External plugin
		 */
	},
	/**
	 * @method 		getComponentDOM
	 * @memberof 	"canvas.lib.LazzyPanel"
	 * @description This method returns the DOM element.
	 */
	getComponentDOM : function() {
			return this.getItem(0);
	}

});


/**
 * BO:  added COMP_TYPE, COMP_NAME
 */
CFCR.registerFormCmp({ 'COMP_TYPE' : 'FORM_FIELDS', 'COMP_NAME':'cbx-lazzypanel'}, canvas.lib.LazzyPanel);