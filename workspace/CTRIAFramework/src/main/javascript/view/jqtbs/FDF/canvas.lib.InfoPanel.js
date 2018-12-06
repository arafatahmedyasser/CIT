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
 * @description This component is responsible for displaying item with its own header and HTML content as body text that displays textual alerts, explanations or information.
 */
canvas.lib.InfoPanel = Class(canvas.lib.FormElements,{
	/**
	 * @class "canvas.lib.InfoPanel"
	 * @description The events on and by the Infopanel field are described below
	 */
	//Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.InfoPanel"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		this.updateScreenViewData(this);
		// Need to Be done
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.InfoPanel"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var val = this.getComponent().find('div[name="'+this.itemId+'"]').html();	
			return val;
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.InfoPanel"
	 * @param value - {String} html DOM to be rendered inside the panel 
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find('div[name="' + this.itemId + '"]').html(value);
		
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.InfoPanel"
	 * @param newValue - {String} html DOM to be rendered inside the panel 
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
	 * @memberof "canvas.lib.InfoPanel"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
		return this.getFieldValue();
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-panel'
}, canvas.lib.InfoPanel);
