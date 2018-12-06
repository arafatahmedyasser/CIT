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
 * @namespace 	"canvas.lib"
 * @description This component is currently responsible Jquery_Bootstrap Framework to create form composite.
 */
canvas.lib.FormComposite = Class(canvas.lib.FormCmpManager, {

	/**
	 * @class 		"canvas.lib.FormComposite"
	 * @extends		"canvas.lib.FormCmpManager"
	 * @description The initialize function creates the DOM structure for composite form 
	 * 				and renders the form components by calling the respective methods.
	 */
	initialize : function ()
	{
		var container = new canvas.lib.formCompositeDOM(this.formData);
		var containerDOM = container.containerDOM();
		if(this.formData.hideLabel!=true){
		var labelDOM = container.labelDOM();
		$(containerDOM).find('div[data-item-id = "form-composite"]').append(labelDOM);
		}
		var compositeBodyDOM = container.compositeBodyDOM();
		$(containerDOM).find('div[data-item-id = "form-composite"]').append(compositeBodyDOM);
		this.renderChildItems($(compositeBodyDOM));
		var errorMsgDOM = container.errorMsgDOM();
		$(compositeBodyDOM).append(errorMsgDOM);
		$(this.parentContainer).append(containerDOM);
	},
	/**
	 * @method 		renderChildItems
	 * @memberof 	"canvas.lib.FormComposite"
	 * @param		parentObj - {Object} parent class object
	 * @description This method renders the child items in the composite form. The propotion mappings 
	 * 				is used to get the proportions so that all the form elements are displayed in one row.
	 * 				The width percentage for each component (depending upon the number of elements) 
	 * 				is multiplied with the anchor and the respective proportion mapping is found based 
	 * 				on the percentage obtained.
	 */
	renderChildItems : function (parentObj)
	{
		if (parentObj)
		{
			this.parentObj = parentObj;
			var childItems = this.createItems();

			if (!cbx.isEmpty(childItems))
			{
				var childLength = childItems.length;
				var width = 100/childLength;
				var proportionMappings = [{ '8.33':'1'},
			    	                      {'16.67':'2'},
			    	                      {'25.00':'3'},
			    	                      {'33.33':'4'},
			    	                      {'41.66':'5'},
			    	                      {'50.00':'6'},
			    	                      {'58.33':'7'},
			    	                      {'66.66':'8'},
			    	                      {'75.00':'9'},
			    	                      {'83.33':'10'},
			    	                      {'91.66':'11'}, 
			    	                      {'100.00':'12'}];
				var temp =0;
				
				for (var item = 0; item < childLength; item++)
				{
					if (!cbx.isEmpty(childItems[item].xtype))
					{
						var childAnchor = childItems[item].anchor;
						childAnchor = childAnchor.split("%")[0];
						childAnchor = (childAnchor*width)/100;
						for (var i = 0, tot = proportionMappings.length; i < tot; i++) {
							var key = Object.keys(proportionMappings[i])[0];
							if (parseInt(key) == parseInt(childAnchor)) {
								if ( item == childLength - 1) {
									if( parseInt(proportionMappings[i][key]) > (12 - temp))
										childAnchor = 12 - temp;
									else
										childAnchor = parseInt(proportionMappings[i][key]);
								}
								else {
									childAnchor = parseInt(proportionMappings[i][key]);
									temp += childAnchor;
								}
								break;
							}
							else if (parseInt(key) > parseInt(childAnchor)) {
								var j;
								if(i==0){
									key = Object.keys(proportionMappings[i])[0];
									j = i;
								}else{
								key = Object.keys(proportionMappings[i-1])[0];
									j = i-1;
								}
								if ( item == childLength - 1) {
									if( parseInt(proportionMappings[j][key]) > (12 - temp))
										childAnchor = 12 - temp;
									else
										childAnchor = parseInt(proportionMappings[j][key]);
								}
								else {
									childAnchor = parseInt(proportionMappings[j][key]);
									temp += childAnchor;
								}
								break;
							}
						}
						childItems[item].anchor = '100%';
						var tempDiv = new cbx.lib.layer({
							"eleType" : "div",
							"class" : "col-lg-" + childAnchor + " col-md-"  + childAnchor + " col-sm-" + childAnchor + " col-xs-" + childAnchor +" ct-composite-"+childItems[item].itemId,
							"data-item-id" : childItems[item].itemId
						}).getLayer();
						$(parentObj).find('form[data-item-id = "inline"]').append(tempDiv);
						/*
						 * 	The hideLabel is set to true to hide the labels of the form components 
						 * 	inside the composite field.
						 * 	The onlyInput is set to true to get only the required DOM from the 
						 * 	form components to be rendered in composite form.
						 */
						childItems[item].hideLabel = true;
						childItems[item].onlyInput = true; 
						/*
						 * 	Calling the formElementsCall to render the child elements.
						 */
						this.formElementsCall(childItems[item], parentObj);
					} 
					else
						LOGGER.error("Unknown form type registered: ", childItems[item].xtype);
				}
			}
		}
	},
	/**
	 * @method 		getComponentDOM
	 * @memberof 	"canvas.lib.FormComposite"
	 * @description This method returns the DOM structure created in the initialize method. 
	 */
	getComponentDOM : function ()
	{
		return this.getItem(0);
	}

});

/**
 * 	Registering the component.
 */
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-compositefield'
}, canvas.lib.FormComposite);
