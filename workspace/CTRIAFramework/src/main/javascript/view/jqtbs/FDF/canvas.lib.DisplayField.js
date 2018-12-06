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
 * @description 
 */
canvas.lib.DisplayField = Class(canvas.lib.FormElements, {
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.DisplayField"
	 * @description This method is responsible for massaging the data to be sent to the template
	 */
	massageFieldSpecificMD : function ()
	{
		var that = this;
		this.data = [];
		this.keys =[];
		var length, length_raw;
		length =length_raw=0
		/*
		 * data[] - stores rawValues from database and rawValues from Additional Data.
		 * keys[] - stores rawKeys from database and rawKeys from Additional Data.
		 */
		if((this.rawKeys)&&(this.rawValues)&&(!cbx.isEmpty(this.rawKeys))&&(!cbx.isEmpty(this.rawValues))){
			length_raw = this.rawKeys.length
			for (var i = 0; i < length_raw; i++)
			{
				if((!cbx.isEmpty(this.rawKeys))&&(!cbx.isEmpty(this.rawValues))){
					this.keys.push(this.rawKeys[i]);
					this.data.push(this.rawValues[i]);
				}
			}
		}
		
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.Label"
	 * @param value - value to be set.
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("span[name='" + this.itemId + "']").text(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
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
	 * @memberof "canvas.lib.DisplayField"
	 * @param newValue - value to be updated.
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
			}
			this.setValid(true);
			this.clearInvalid();
			
		} else
		{
			this.setFieldValue(newValue);
			if(newValue != this.value){
				this.value = newValue
			this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
			}
			this.setValid(false);
			this.markInvalid();
		}				
				
}
	

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-displayfield'
}, canvas.lib.DisplayField);
