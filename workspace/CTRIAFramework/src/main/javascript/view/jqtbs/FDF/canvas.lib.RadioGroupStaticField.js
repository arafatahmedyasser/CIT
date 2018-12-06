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
 * @description This component is responsible to display the selected value from the rawValues of the radiogroup in view
 *              mode.
 */
canvas.lib.RadiogroupStaticField = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.RadiogroupStaticField"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.RadiogroupStaticField"
	 * @description This method is responsible for massaging the data to be sent to the template
	 */
	
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.RadiogroupStaticField"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{

		// Need to Be done
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.RadiogroupStaticField"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var val = this.getComponent().find('span[name="' + this.itemId + '"]').text();
		// console.log(val);
		return this.keys[this.data.getIndexOf(val.trim())];
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.RadiogroupStaticField"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		
				this.setValid(true);
				this.clearInvalid();
				var index = jQuery.inArray(value,this.keys);
				this.getComponent().find("span[name='" + this.itemId + "']").text(this.data[index]);
			
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.RadiogroupStaticField"
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
	getScreenViewData : function(){
		return this.getFieldValue();
	},
	/**
	 * @Method fieldSpecificValidation
	 * @memberOf "canvas.lib.RadiogroupStaticField"
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 * @param  value -value that has to be set to the field
	 */
	fieldSpecificValidation : function (value)
	{
		if ((value) && (this.keys))
		{
			if (this.keys.contains(value))
			{
				return true
			} else
			{
				return false
			}
		} else
		{
			return false
		}
	}
});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-radiogroupstaticfield'
}, canvas.lib.RadiogroupStaticField);
