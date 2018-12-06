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
 * @description This component is a button for click or trigger actions.
 */
canvas.lib.Button = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.Button"
	 * @description The events on and by the component are described below
	 */
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.Button"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		this.getComponent().find('button[name="' + this.itemId + '"]').on('click', $.proxy(function (event)
		{
			this.handleClickEvent();
			var newValue = this.getFieldValue();
			this.updateValue(newValue)
		}, this));

		// Need to Be done
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.Button"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.getComponent().find('a[name="' + this.itemId + '"]').text();

	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.Button"
	 * @description This method is responsible to set the field value.
	 * @param value - value to be set to button
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("a[name='" + this.itemId + "']").text(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);

	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.Button"
	 * @description This method is responsible for updating the modal value with the field value.
	 * @param newValue - value to be updated.
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
	 * @memberof "canvas.lib.Button"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
	return this.getFieldValue();
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.Button"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param enableFlag - {Boolean} showFlag True to show, false to hide
	 * 
	 */
	setEnabledField: function(enableFlag){
		if(jQuery.type(enableFlag)==="boolean"){
			if(enableFlag){
				this.getComponent().find("a[name='" + this.itemId + "']").removeAttr('disabled');
			}else{
				this.getComponent().find("a[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-button'
}, canvas.lib.Button);
