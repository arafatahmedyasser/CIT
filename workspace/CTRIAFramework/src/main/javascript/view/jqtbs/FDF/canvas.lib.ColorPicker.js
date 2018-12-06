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
 * @description This component is currently responsible for rendering text field element.
 */
canvas.lib.ColorPicker = Class(canvas.lib.FormElements,{
	/**
	 * @class "canvas.lib.ColorPicker"
	 * @description The formatType specifies the formated value type of display, the dataType specifies the type of data
	 *              the field acknowledges.
	 */
	formatType:'',
	dataType: '',
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.ColorPicker"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		var that = this;
		
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
		},this));
		
		this.getComponent().find(".input-group-addon-colorpicker-js").on('mouseenter', $.proxy(function ()
		{
			$('[data-item-id=' + this.itemId + ']').colorpicker({
				component: '.input-group-addon-colorpicker-js',
				customClass: this.itemId
			});
			
			$("." + that.itemId + " .colorpicker-saturation").off('click');
			$("." + that.itemId + " .colorpicker-saturation").on('click',function ()
			{
				var newValue = that.getFieldValue();
				that.updateValue(newValue);
				var value = that.model.getModelData()[that.itemId];
				that.setFieldValue(value);
				that.clearInvalid();
				that.setValid(true);
			});
			
		},this));		
		
		/**
		 * This is for Validating the value after entering into the element
		 */
		this.getComponent().find("input[name='" + this.itemId + "']").on('blur', $.proxy(function (event)
		{			
			var newValue = this.getFieldValue();
			this.updateValue(newValue);
		},this));
		
		/**
		 * This is for Validating the value that are entering into the element
		 */
		this.getComponent().find("input[name='" + this.itemId + "']").on('keypress',
					$.proxy(this.keyPressListener, this));

	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.ColorPicker"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("input[name='"+this.itemId+"']").val(value);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.ColorPicker"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.getComponent().find("input[name='"+this.itemId+"']").val();
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.ColorPicker"
	 * @description This method is responsible for updating the modal value with the field value.
	 */
	updateValue : function (newValue)
	{
		
			if (this.validateValue(newValue))
			{ // if validate is success then allow
				this.setFieldValue(this.formatValue(newValue));
				if(newValue != this.value){
					this.value = newValue;
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
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.ColorPicker"
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
	'COMP_NAME' : 'cbx-colorPicker'
}, canvas.lib.ColorPicker);
