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
 * 				1. Call the method to create the n-columns in a form container.
 * 				2. Render the child items (form components) inside the columns by calling the respective js files.
 */

canvas.lib.FormCmpManager = Class(cbx.core.Component,{
	/**
	 * @class 		"canvas.lib.FormCmpManager"
	 * @extends 	"cbx.core.Component"
	 * @description The constructor function calls its parent (core.Component).
	 */
	
	/*
	 * 	nonFormField contains the x-type of the form components that have seperately registered js files.
	 * 	(The js files are not called through Form Fields.)
	 */
	nonFormField : ['cbx-lazzyformpanel', 'cbx-fieldset', 'cbx-compositefield', 'cbx-tabpanel'],
	/*
	 * 	noRenderRequired contains the x-type of the form components that have already been rendered.
	 */
	noRenderRequired : ['cbx-emptycell', 'cbx-rowclear', 'cbx-line', 'cbx-logo' ],
	constructor : function(config) {
		canvas.lib.FormCmpManager.$super.call(this,config);
	},
	
	/**
	 * @method 		createItems
	 * @memberof 	"canvas.lib.FormCmpManager"
	 * @description This method returns the list of child items.
	 */
	createItems : function() {
		return this.prepareChildItems(this.prepareFormCreatorConfig());
	},
	
	/**
	 * @method 		prepareChildItems
	 * @memberof 	"canvas.lib.FormCmpManager"
	 * @param 		config - {Object} form data
	 * @description This method calls the form creator to get the x-type of 
	 * 				the form compoenents.
	 */
	prepareChildItems: function(config) {
		var formCreator = new cbx.form.FormCreator(config);
		return formCreator.getFormFields();
	},
	
	/**
	 * @method 		prepareFormCreatorConfig
	 * @memberof 	"canvas.lib.FormCmpManager"
	 * @description This method returns config for each child item.
	 */
	prepareFormCreatorConfig: function(){
		var config = {
			formId : this.formData.formId,
			model : this.formData.model,
			mode : this.mode ? this.mode : this.formData.mode,
			manager : this.formData.manager,
			preInitConfig : this.formData.preInitConfig,
			metadata : this.formData,
			screenView : this.formData.screenView,
			labelAlign : this.formData.labelAlign
		};
		return config;
	},
	
	/**
	 * @method 		ncollayout
	 * @memberof 	"canvas.lib.FormCmpManager"
	 * @param		parentObj - {Object} parent class object
	 * @description This method calls the FormLayoutContainer and returns the column/table layout.
	 */
	ncollayout : function(parentObj) {
		
		this.parentObj =parentObj;
		
		this.childItems = this.createItems();
		var container = new canvas.lib.FormLayoutContainer(this);
		var parentelem = container.getParent();				

		/*
		 * 	To switch the layout type between column and table layout, 
		 * 	change the function name here accordingly:
		 * 	1. addComponentsByColumnLayout
		 * 	2. addComponentsByTableLayout
		 */
		container.addComponentsByTableLayout(this.childItems,parentelem);
	},
	
	/**
	 * @method 		renderChildItems
	 * @memberof 	"canvas.lib.FormCmpManager"
	 * @param		parentObj - {Object} parent class object
	 * @param		index - {Number} index of the element(child) in the form
	 * @param		formId - {String} Form Id
	 * @description This method renders the form components in the parent container.
	 */
	renderChildItems: function(parentObj, index, formId){
		if(parentObj){

			var childItems = this.childItems;
			if(!cbx.isEmpty(childItems)){

				var childLength = childItems.length;
								
				for (var item = 0; item < childLength; item++) {
					if(!cbx.isEmpty(childItems[item].xtype))
						this.formElementsCall(childItems[item], parentObj, index, formId);
					else
						LOGGER.error("Unknown form type registered: ", childItems[item]);
				}
			}
		}
	},
	
	/**
	 * @method 		formElementsCall
	 * @memberof 	"canvas.lib.FormCmpManager"
	 * @param		childItems - {Array} list of children under the parent
	 * @param		parentObj - {Object} parent class object
	 * @param		index - {Number} index of the element(child) in the form
	 * @param		formId - {String} Form Id
	 * @description This method calls the registered component for each child item.
	 */
	formElementsCall : function (childItems, parentObj, index, formId)
	{
		var cClass = null;

		if (childItems.xtype == 'cbx-lazzypanel') 
		{
			if (childItems.containerInd == 'Y')
			{
				childItems.xtype = 'cbx-lazzyformpanel';
			}
			else
			{
				//childItems.xtype = 'cbx-panel'
			}
		}
		if ( this.nonFormField.contains(childItems.xtype) )
		{
			cClass = CFCR.getFormCmp({
				'COMP_TYPE' : childItems.xtype
			});
			if (cbx.isEmpty(cClass))
			{
				LOGGER.error("Unknown form type registered: " + childItems.xtype);
				return;
			}
			childItems['formManager'] = this.formManager;
			childItems['formData'] = childItems;
			childItems['parentContainer'] = parentObj.find('div[data-item-id="' + childItems.itemId + '"]');
			childItems['multiFormIndex'] = index;
			new cClass(childItems);
			/*new cClass({
				'parentContainer' : parentObj.find('div[data-item-id="' + childItems.itemId + '"]'),
				'formData' : childItems,
				'formManager' : this.formManager
			});*/

		}
		else if ( !this.noRenderRequired.contains(childItems.xtype) )
		{
			cClass = CFCR.getFormCmp({
				'COMP_TYPE' : 'FORM_FIELDS',
				'COMP_NAME' : childItems.xtype
			});
			if (cbx.isEmpty(cClass))
			{
				LOGGER.error("Unknown form type registered: " + childItems.xtype);
				return;
			}

			childItems['formManager'] = this.formManager;
			childItems['parentContainer'] = parentObj.find('div[data-item-id="' + childItems.itemId + '"]');
			childItems['multiFormIndex'] = index;
			new cClass(childItems);
		}
	}
});
