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
 * @description This component is currently responsible for rendering text area element.
 */
canvas.lib.Textarea = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.Textarea"
	 * @description The formatType specifies the formated value type of display, the dataType specifies the type of data
	 *              the field acknowledges.
	 */
	formatType : '',
	dataType : '',
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.Textarea"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		/**
		 * This is for restoring the formatting value with actual value
		 */
		this.getComponent().find("textarea[name='" + this.itemId + "']").on('focus', $.proxy(function ()
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
		this.getComponent().find("textarea[name='" + this.itemId + "']").on('blur', $.proxy(function (event)
		{
			var newValue = this.getFieldValue();
			this.updateValue(newValue);
		}, this));
		/**
		 * This is for Validating the value that are entering into the element
		 */
		this.getComponent().find("textarea[name='" + this.itemId + "']").on('keypress',
					$.proxy(this.keyPressListener, this));
					
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.Textarea"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.checkTextareaValidation();
		this.getComponent().find("textarea[name='" + this.itemId + "']").val(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.Textarea"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.getComponent().find("textarea[name='" + this.itemId + "']").val();
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.setMaxNumLines"
	 * @description This method is responsible to set Maximum lines for Text Area.
	 */
	setMaxNumLines: function (value){
		this.maxNumLines=value;
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.setMaxLength"
	 * @description This method is responsible to set Maximum Length 
	 */
	setMaxLength: function (value){
		this.maxLength=value;
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.setMaxCharsPerLine"
	 * @description This method is responsible to set Maximum Characters for a Line 
	 */
	setMaxCharsPerLine: function (value){
		this.maxCharsPerLine=value;
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.checktextareaValidation"
	 * @description This method is responsible for Validating the Text area 
	 */
	checkTextareaValidation: function(){
		
		var lines=this.getFieldValue().split(/\r*\n/);
		var lncount=true;var count=0;
		if(this.maxCharsPerLine)
		for(var i=0;i<lines.length && lines[i]!='';i++)
			{count+=lines[i].length;
			if(lines[i].length>this.maxCharsPerLine)
				lncount=false
			}
		//var	count=this.getFieldValue().replace(/\r(?!\n)|\n(?!\r)/g,'').length;
		if((lines.length)>this.maxNumLines && this.maxNumLines)
		{
			this.setValid(false);
			this.markInvalid(String.format(CRB.getFWBundleValue('ERR_INVALID_NUMBER_OF_LINES'),this.maxNumLines));
			return false;
		}else if(count>this.maxLength && this.maxLength){
			this.setValid(false);
			this.markInvalid(String.format(CRB.getFWBundleValue('ERR_INVALID_NUMBER_OF_CHARS_PERLINE'),this.maxLength));
			return false;
		}
		else if(!lncount){
			this.markInvalid(String.format(CRB.getFWBundleValue('ERR_INVALID_NUMBER_OF_CHARS_PERLINE'),this.maxCharsPerLine));
			return false;
		}
		else{
		
			this.clearInvalid();
			this.setValid(true);
			return true;
		}
		
	},
	/**
	 * @method focus
	 * @memberof "canvas.lib.Textarea"
	 * @description This method is responsible to set the focus to text area.
	 */
	focus: function(){
		this.getComponent().find("textarea[name='" + this.itemId + "']").focus();
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.Textarea"
	 * @description This method is responsible for updating the modal value with the field value.
	 */
	updateValue : function (newValue)
	{
			if (this.validateValue(newValue.trim()))
			{
				this.setFieldValue(newValue);
				if(newValue != this.value){
					this.value = newValue;
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
					this.updateScreenViewData(this);
				}
				
			} else
			{
				this.setFieldValue(newValue);
				if(newValue != this.value){
					this.value = newValue;
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
	 * @memberOf "canvas.lib.Textarea"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param {Boolean} showFlag True to show, false to hide
	 * 
	 */
	setEnabledField: function(enableFlag){
		if(jQuery.type(enableFlag)==="boolean"){
			if(enableFlag){
				this.getComponent().find("textarea[name='" + this.itemId + "']").removeAttr('disabled');
			}else{
				this.getComponent().find("textarea[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	},
	/**
	 * Resets the form field value. This function is called from fm.clearValues(formFields, resetFlag)
	 */
	reset : function(){
		this.updateValue('');
	}
});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-textarea'
}, canvas.lib.Textarea);
