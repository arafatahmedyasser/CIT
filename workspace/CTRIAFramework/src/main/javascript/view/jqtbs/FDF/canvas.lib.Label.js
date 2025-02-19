/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.lib');
/**
 * @namespace "canvas.lib"
 * @description This component is responsible to display a label.
 */
canvas.lib.Label = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.Label"
	 * @description The events on and by the component are described below
	 */
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.Label"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		this.updateScreenViewData(this);
		// Need to Be done
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.Label"
	 * @param value - {String} New value to be set.
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("span[name='" + this.itemId + "']").text(value);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.Label"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.getComponent().find("span[name='" + this.itemId + "']").text();
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.Label"
	 * @param newValue - {String} New value to be updated.
	 * @description This method is responsible for updating the modal value with the field value.
	 */
	updateValue : function (newValue)
	{

			if (this.validateValue(newValue))
			{ // if validate is success then allow
				this.setFieldValue(this.formatValue(newValue));
				if(newValue != this.value){
					this.value = newValue
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
				}
				this.setValid(true);
				this.clearInvalid();
			} else
			{
				this.setFieldValue(newValue);
				if(newValue != this.value){
					this.value = newValue
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
				}
				this.setValid(false);
				this.markInvalid();
			}
		
	
	},
	/**
	 * @Method getScreenViewData
	 * @memberof "canvas.lib.Label"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
		return this.getFieldValue();
	},

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-label'
}, canvas.lib.Label);
