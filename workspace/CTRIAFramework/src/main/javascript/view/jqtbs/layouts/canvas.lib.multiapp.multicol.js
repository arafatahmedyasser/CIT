/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns("canvas.lib.multiapp");
/**
 * @namespace		"canvas.lib.multiapp"
 * @class 			canvas.lib.multiapp.multicol
 * @extends	 		cbx.core.Component
 * @description		This class is responsible for getting the proportions 
 * 					of the multi column layout from the user. In case the user 
 * 					hasn't defined, then default proportions are taken. 
 * 					Also, it creates the parent container where all the multi column
 * 					containers are appended. It then calls the multi column class 
 * 					to create the multi columns for multiapp.
 */
canvas.lib.multiapp.multicol = Class(cbx.core.Component, {
	/**
	 * @method 		canvas.lib.multiapp.multicol
	 * @memberof 	"canvas.lib.multiapp.multicol"
	 * @description This method is used to get the proportions of columns from the 
	 * 				Database. Else sets the default value as proportions.
	 */
	constructor : function (config)
	{
		cbx.core.extend(this, config);
		this.parentDataWidgetId = this.parentDataWidgetId;
		this.parentId = this.parentId;
		LOGGER.log("config.parentId ", this.parentId);
		if (this.layout == 'TWO-COLUMN')
		{
			this.proportion = [ 50, 50 ];
		} else if (this.layout == 'THREE-COL')
		{
			this.proportion = [ 33, 33, 33 ];
		} else if (this.layout == 'STACK')
		{
			this.proportion = [ 100 ];
		}
		if (!cbx.core.isEmpty(this.layoutProportion))
		{
			this.proportion = this.layoutProportion.split(',');
		}
		this.getMultiAppLayout();
	},
	/**
	 * @method 		canvas.lib.multiapp.multicol
	 * @memberof 	"canvas.lib.multiapp.multicol"
	 * @description This method is create the parent container and calls the 
	 * 				multi column layout. 
	 */
	getMultiAppLayout : function ()
	{
		var multiAppClass = CLCR.getCmp({
			"COMP_TYPE" : "MULTI-COLUMN"
		});
		
		var parentDatatypeContainer = new cbx.lib.layer({
			"eleType" : "div",
			"data-app-type" : "MULTI_APP"
		}).getLayer();
		
		var parentContainer = new cbx.lib.layer({
			"eleType" : "div",
			"class" : "row",
			"data-item-id" : this.md.md.MULTI_WIDGET_MD.WIDGET_ID
		}).getLayer();
		
		$(parentDatatypeContainer).append(parentContainer);
		$(this.parentelem).append(parentDatatypeContainer);
		
		if (multiAppClass)
		{
			var multiAppConfig = {
				proportion : this.proportion,
				parentContainer : parentContainer
			};
			this.multiAppObj = new multiAppClass(multiAppConfig);
			this.multiAppObj.renderMultiApps({
				'CHILDAPPS' : this.md.md.CHILD_WIDGETS,
				'PARENTDATAWIDGETID' : this.parentDataWidgetId,
				'PARENTID' : this.parentId
			});
		}
	}
});
CLCR.registerCmp({
	"COMP_TYPE" : "MULTI_APP",
	"LAYOUT" : "STACK"
}, canvas.lib.multiapp.multicol);
CLCR.registerCmp({
	"COMP_TYPE" : "MULTI_APP",
	"LAYOUT" : "TWO-COLUMN"
}, canvas.lib.multiapp.multicol);
CLCR.registerCmp({
	"COMP_TYPE" : "MULTI_APP",
	"LAYOUT" : "THREE-COL"
}, canvas.lib.multiapp.multicol);