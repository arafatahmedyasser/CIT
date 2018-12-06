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
 * @description This component is an input field with a check option.
 */
canvas.lib.CheckBox = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.CheckBox"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.Button"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		var that = this;
		this.getComponent().find('input[name="' + this.itemId + '"]').change(function ()
		{
			var newValue = that.getFieldValue();
			that.updateValue(newValue)
		});
		this.getComponent().find("input[name='" + this.itemId + "']").on("focus", function ()
		{
			this.setValid(true);
			this.clearInvalid();
			var value = that.model.getModelData()[that.itemId];
			that.setFieldValue(value);
		});

		// Validating the value
		this.getComponent().find("input[name='" + this.itemId + "']").on("blur", function (event)
		{
			var newValue = that.getFieldValue();
			updateValue(newValue)

		});
		// Need to Be done
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.CheckBox"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var val = this.getComponent().find('input[name="' + this.itemId + '"]').is(':checked');
		return val;
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.CheckBox"
	 * @description This method is responsible to set the field value.
	 * @param value - {Boolean} To indicate true or false for the property to br checked or not.
	 */
	setFieldValue : function (value)
	{
		
		this.getComponent().find('input[name="' + this.itemId + '"]').attr('checked', value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);
		
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.CheckBox"
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
	 * @memberof "canvas.lib.CheckBox"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
	 var value = this.getComponent().find('input[name="' + this.itemId + '"]:checked').parent().text();
	 return value;
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.CheckBox"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param {Boolean} showFlag True to show, false to hide
	 * 
	 */
	setEnabledField: function(enableFlag){
		if(jQuery.type(enableFlag)==="boolean"){
			if(enableFlag){
				this.getComponent().find("input[name='" + this.itemId + "']").removeAttr('disabled');
			}else{
				this.getComponent().find("input[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	},
	/**
	 * @Method fieldSpecificValidation
	 * @memberOf "canvas.lib.CheckBox"
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 * @param  value -value that has to be set to the field
	 */
	fieldSpecificValidation : function (value)
	{
		if (jQuery.type(value) === "boolean"){
			return true;
		}
		else{
			return false
		}
	},
	/**
	 * Resets the form field value. This function is called from fm.clearValues(formFields, resetFlag)
	 */
	reset : function(){
		this.updateValue(false);
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-checkbox'
}, canvas.lib.CheckBox);
