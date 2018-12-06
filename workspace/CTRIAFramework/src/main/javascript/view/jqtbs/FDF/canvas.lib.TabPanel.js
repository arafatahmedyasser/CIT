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
cbx.ns('canvas.lib');
/**
 * @namespace "canvas.lib"
 * @description This component is currently responsible in Jquery_Bootstrap Framework to do the following in form:
 * 				1. Create a tab layout for a tab panel form.
 * 				2. Render the child components of tab on tab switch.
 */
canvas.lib.TabPanel = Class(canvas.lib.FormCmpManager, {
	/**
	 * @class 		"canvas.lib.TabPanel"
	 * @extends 	"canvas.lib.FormLayoutContainer"
	 * @description The initialize function gets the config and calls the 'getMultiAppLayout' method.
	 */
	initialize : function ()
	{

		this.parentObj = $(this.parentContainer);
		this.configData = this;
		if(!cbx.isEmpty(this.formData.children))
		this.getMultiAppLayout();
		else
			LOGGER.info("No tabs are configured in the Tab Form Panel");
	},

	/**
	 * @method 		getMultiAppLayout
	 * @memberof 	"canvas.lib.TabPanel"
	 * @description This method calls the tab layout engine to create tab panel.
	 */
	getMultiAppLayout : function ()
	{
		
		var multiAppTabLayoutClass = CLCR.getCmp({
			"COMP_TYPE" : "LAYOUT",
			"LAYOUT_TYPE" : "TAB"
		});

		if (multiAppTabLayoutClass)
		{
			this.childItems = this.createItems(); 
			var childItemsFormattedArray = [];
			/* Start: Massaging the data for tab layout engine */
			for (var index = 0; index < this.childItems.length; index++)
			{
				var childItemsObj = {};
				childItemsObj['ITEM_ID'] = this.childItems[index].itemId;
				childItemsObj['ITEM_LABEL'] = this.childItems[index].plainLbl || this.childItems[index].formTitle;
				childItemsFormattedArray.push(childItemsObj);
			}
			/* End: Massaging data */

			/*	JSON to be sent to the tab layout engine */
			var multiItemTabLayoutConfig = { 
				parent_elem : this.parentObj, // Data item id of the parent to which tab layout to be appended
				// defaultActiveTab: 2, //Default tab to be activated initially
				activationHandler : this.activateFormChild, // Method to be called to activate a tab(child app)
				implementationSubstring : 'formTab_' + this.configData.formData.itemId, // Prefix for the IDs of tab strip
				presentation : false, 		// Configuring the appearance of the tab layout (application of "WELL" class of bootstrap)
				activeClass : 'active1', // Extra class to be applied on the tab strip
				itemList : childItemsFormattedArray, // Massaged data containing the child app list
				parentScope : this
			};

			this.formTabLayoutObj = new multiAppTabLayoutClass(multiItemTabLayoutConfig); 
																							
		}
	},

	/**
	 * @method 		activateFormChild
	 * @memberof 	"canvas.lib.TabPanel"
	 * @description This method renders the child items on tab switch.
	 */
	activateFormChild : function (itemId, contItemId, scope, index)
	{

		scope.parentObj.find('div[data-item-id= ' + contItemId + ']').empty();

		var elem = new cbx.lib.layer({
			"eleType" : "div",
			"data-item-id" : scope.childItems[index].itemId
		}).getLayer();

		scope.parentObj.find('div[data-item-id= ' + contItemId + ']').append(elem);
		
		if (!cbx.isEmpty(scope.childItems[index].xtype))
			scope.formElementsCall(scope.childItems[index], scope.parentObj);
		else
			LOGGER.error("Unknow form type registered");
	},

	/**
	 * @method 		prepareFormCreatorConfig
	 * @memberof 	"canvas.lib.TabPanel"
	 * @description This method returns config for each child item.
	 */
	prepareFormCreatorConfig : function ()
	{
		var config = {
			formId : this.configData.formData.formId,
			model : this.configData.formData.model,
			mode : this.mode ? this.mode : this.configData.formData.mode,
			manager : this.configData.formData.manager,
			preInitConfig : this.configData.formData.preInitConfig,
			metadata : this.configData.formData,
			screenView : this.configData.formData.screenView
		};
		return config;
	}
	
});

/**
 * 	Registering the component.
 */
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-tabpanel'
}, canvas.lib.TabPanel);
