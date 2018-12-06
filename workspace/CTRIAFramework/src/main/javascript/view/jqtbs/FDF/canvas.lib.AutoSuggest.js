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
 * @description This component is responsible for giving dynamic suggestions while typing in an input field.
 */
canvas.lib.AutoSuggest = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.AutoSuggest"
	 * @description The events on and by the autosuggest field are described below
	 */
	additionalMetadataInd:true,
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.AutoSuggest"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		var data= this.data
		var inputField = this.getComponent().find('input[name="' + this.itemId + '"]');
		$(inputField).autoComplete({
			minChars : 1,
			source : function (term, suggest)
			{
				term = term.toLowerCase();
				var choices = data;
				var suggestions = [];
				for (i = 0; i < choices.length; i++)
					if (~choices[i].toLowerCase().indexOf(term))
						suggestions.push(choices[i]);
				suggest(suggestions);
			}
		});
		$(inputField).on('focus', $.proxy(function ()
		{
				this.clearInvalid();
				this.setValid(true);
		}, this));

		// Validating the value
		$(inputField).on('blur', $.proxy(function (event)
		{

			var newValue = this.getFieldValue();
			this.updateValue(newValue);
		}, this));
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.AutoSuggest"
	 * @description This method is responsible to set the field value.
	 * @param value - {String} value to be set.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("input[name='" + this.itemId + "']").val(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.AutoSuggest"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		return this.getComponent().find("input[name='" + this.itemId + "']").val();
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.AutoSuggest"
	 * @description This method is responsible for updating the modal value with the field value.
	 * @param	newValue - {String} key of the value to be selected 
	 */
	updateValue : function (newValue)
	{

			if (this.validateValue(newValue))
			{ // if validate is success then allow
				this.value = newValue
				this.setFieldValue(this.formatValue(newValue));
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
				this.setValid(true);
				this.clearInvalid();
			} else
			{
				this.value = newValue
				this.setFieldValue(newValue);
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
				this.setValid(false);
				this.markInvalid(CRB.getFWBundleValue('ERR_VALID_SELECT'));
			}
	},
	/**
	 * @Method getScreenViewData
	 * @memberof "canvas.lib.AutoSuggest"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
		return this.getFieldValue();
	},
	/**
	 * @Method updateComboRawStore
	 * @memberof "canvas.lib.AutoSuggest"
	 * @description Intended to update the combo with  keys and values supplied.Applicable for dropdown/itemselector/iconcombo/autosuggest/imagePanel.
	 * For image panel the keys will be the ids of the image and the values will be the src for the images.
	 * @param keyArr - {Array} keyArray Array of keys.
	 * @param valueArr - {Array} ValueArray Array of values for the drop down/Itemselector.
	 *
	 */
	updateComboRawStore : function(keyArr , valueArr){
		if(keyArr){
			this.data = [];
			this.keys =[];
			for(var i=0; i<keyArr.length ;i++){
				this.keys.push(keyArr[i])
				this.data.push(valueArr[i])
			}
		}
		this.reRender();
	},
	/**
	 * @Method rePopulateAdditionaldata
	 * @memberof "canvas.lib.AutoSuggest"
	 * @description if cacheIndicator is "N" this function gets called to update raw store
	 * @param data - {Object} data to be updated
	 */
	rePopulateAdditionaldata:function(data){
		var keyArr=[],valueArr=[];
        for(var i=0;i<data.length;i++){
        	keyArr.push(data[i].rawKey);
        	valueArr.push(data[i].rawValue);
        }
        this.updateComboRawStore(keyArr , valueArr);
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.AutoSuggest"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param enableFlag - {Boolean} showFlag True to show, false to hide
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
	 * @memberOf "canvas.lib.AutoSuggest"
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 * @param  value -value that has to be set to the field
	 */
	fieldSpecificValidation : function (value)
	{
		var allVals = []
		for(var i=0; i<this.data.length;i++){
			allVals[i] = this.data[i].toLowerCase();
		}
		if ((allVals.contains(value.toLowerCase()))|| (value == '')){
			return true;
		}
		else{
			return false
		}
	},
	reset : function(){
		this.updateValue('');
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-autoSuggest'
}, canvas.lib.AutoSuggest);
