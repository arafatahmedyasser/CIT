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
 * @description This component is responsible to display the selected values of the checkboxgroup in the view mode.
 */
canvas.lib.CheckboxgroupStaticField = Class(canvas.lib.FormElements,{
	/**
	 * @class "canvas.lib.CheckboxgroupStaticField"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	//Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.CheckboxgroupStaticField"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		
		// Need to Be done
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.CheckboxgroupStaticField"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var val = this.getComponent().find('span[name="'+this.itemId+'"]').text();
		//console.log(val);
		var allVals=[] 
		var FieldValues=[]
		allVals = val.split(',');
		if (allVals)
		{
			for (var i = 0; i < allVals.length; i++)
			{
				FieldValues[i]=this.keys[this.data.getIndexOf(allVals[i].trim())]
			}
			return FieldValues;
		} else
		{
			return null;
		}
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.CheckboxgroupStaticField"
	 * @description This method is responsible to set the field value.
	 * @param value - {String} value that has to be displayed as already selected.
	 */
	setFieldValue : function (value)
	{

		this.getComponent().find("span[name='" + this.itemId + "']").text(this.data[this.keys.getIndexOf(value)]);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.CheckboxgroupStaticField"
	 * @description This method is responsible for updating the modal value with the field value.
	 * @param newValue - {String} new value that has to be updated as selected.
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
			
	},
	/**
	 * @Method fieldSpecificValidation
	 * @memberOf "canvas.lib.CheckboxgroupStaticField"
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 * @param  value -value that has to be set to the field.
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
	'COMP_NAME' : 'cbx-checkboxgroupstaticfield'
}, canvas.lib.CheckboxgroupStaticField);
