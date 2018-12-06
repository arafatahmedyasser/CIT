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
 * @description This component is currently responsible for rendering rate field element.
 */
canvas.lib.RateField = Class(canvas.lib.FormElements,{
	/**
	 * @class "canvas.lib.RateField"
	 * @description The formatType specifies the formated value type of display, the dataType specifies the type of data
	 *              the field acknowledges.
	 */
	dataType : 'AMOUNT',
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.RateField"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		
		/**
		 * This is for restoring the formatting value with actual value
		 */
		this.getComponent().find("input[name='" + this.itemId + "']").on('focus', $.proxy(function ()
		{
			if (this.isValid)
			{
			var value = this.model.getModelData()[this.itemId];
				this.setFieldValue(value);
			} else
			{
				this.clearInvalid();
				this.setValid(true);
			}
		}, this));
		/**
		 * This is for Validating the value after entering into the element
		 */
		this.getComponent().find("input[name='" + this.itemId + "']").on('blur', $.proxy(function (event)
		{

			var newValue = this.getFieldValue();
			this.updateValue(newValue);
		}, this));
		/**
		 * This is for Validating the value that are entering into the element
		 */
		this.getComponent().find("input[name='" + this.itemId + "']").on('keypress',
					$.proxy(this.keyPressListener, this));
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.RateField"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("input[name='"+this.itemId+"']").val(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.RateField"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.getComponent().find("input[name='"+this.itemId+"']").val();
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.RateField"
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
				this.markInvalid(CRB.getFWBundleValue('ERR_INVALID_DECIMAL_NUMBER'));
			}


	},
	getScreenViewData : function(){
		return this.getFieldValue();
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.RateField"
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
	}
});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-ratefield'
}, canvas.lib.RateField);
