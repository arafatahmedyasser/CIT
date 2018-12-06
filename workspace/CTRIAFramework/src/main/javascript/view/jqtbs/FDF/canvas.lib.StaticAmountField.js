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
 * @description This component is currently responsible for rendering static amount field element.
 */
canvas.lib.StaticAmountField = Class(canvas.lib.FormElements, {
	
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.StaticAmountField"
	 * @description This method is responsible to set the field value.
	 */
	dataType:'AMOUNT',
	setFieldValue : function (value)
	{
		if(cbx.isEmpty(value)){value=this.emptyValue;}
		this.getComponent().find("span[name='"+this.itemId+"']").text(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.StaticAmountField"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var value= this.getComponent().find("span[name='"+this.itemId+"']").text();
		return (value==this.emptyValue) ? '' : value;
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.StaticAmountField"
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
	}


});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-staticamountfield'
}, canvas.lib.StaticAmountField);
