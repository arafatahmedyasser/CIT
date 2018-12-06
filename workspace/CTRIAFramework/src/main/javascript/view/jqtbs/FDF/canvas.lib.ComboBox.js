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
 * @description This component is responsible to allow the user to select any option from the selectpicker.
 */
canvas.lib.ComboBox = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.ComboBox"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.ComboBox"
	 * @description This method is responsible for massaging metadata before creating the element.
	 */
	massageFieldSpecificMD : function(){
		this.selectLbl =  CRB.getFWBundleValue('LBL_SELECT');
	},
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.ComboBox"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		var that = this;
		
		this.getComponent().find('.selectpicker').change(function ()
		{
			that.getFieldValue();
		});
		this.getComponent().find('.selectpicker').on("focus", $.proxy(function (event)
		{
			this.setValid(true);
			this.clearInvalid();
		}, this));
		this.getComponent().find('.selectpicker').on("blur", $.proxy(function (event)
		{
			var newValue = that.getFieldValue();
			this.updateValue(newValue)
		}, this));
		// Need to Be done
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.ComboBox"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var val = this.getComponent().find('.selectpicker option:selected').val();

		return val;

	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.ComboBox"
	 * @description This method is responsible to set the field value.
	 * @param  value - {String} value that has to be set to the field
	 */
	setFieldValue : function (value)
	{
		
			this.getComponent().find('.selectpicker').val(value);
			this.getComponent().find('.selectpicker option[text="'+this.data[this.keys.getIndexOf(value)]+'"]').is(':selected');
			if(this.compRef.hasClass('has-error')){
				this.markInvalidField();
			}
			this.setEnabledField(this.isEnabled);
		
	},
	/**
	 * @method removeValue
	 * @memberof "canvas.lib.ComboBox"
	 * @description This method is responsible for removing a specified value from the field.
	 * @param  value - {String} value that has to be removed from the options.
	 */
	removeValue : function (value)
	{
		this.getComponent().find('.selectpicker option:val("' + value + '")').remove();

	},
	/**
	 * @method addValue
	 * @memberof "canvas.lib.ComboBox"
	 * @description This method is responsible for adding a new value to the field.
	 * @param  value - {String} value that has to be added to the options.
	 */
	addValue : function (value)
	{
		this.getComponent().find('.selectpicker')
					.append(
								'<option value="' + value + '">' + this.data[this.keys.getIndexOf(value)]
											+ '</option>')
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.ComboBox"
	 * @description This method is responsible for updating the modal value with the field value.
	 * @param  newValue -{String} new value that has to be updated.
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
	 * @memberof "canvas.lib.ComboBox"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
		 var value = this.getComponent().find('.selectpicker option:selected').text();
		 return value;
	},
	/**
	 * @Method updateComboRawStore
	 * @memberof "canvas.lib.ComboBox"
	 * @description Intended to update the combo with fieldname, keys and values supplied.Applicable for dropdown/itemselector/iconcombo/autosuggest/imagePanel.
	 * For image panel the keys will be te ids of the image and the values will be the src for the images.
	 * @param {Array} keyArray Array of keys.
	 * @param {Array} ValueArray Array of values for the drop down/Itemselector.
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
	 * @memberof "canvas.lib.ComboBox"
	 * @description if cacheIndicator is "N" this function gets called to update raw store
	 * @param {data} data to be updated
	 *
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
	 * @memberOf "canvas.lib.ComboBox"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param {Boolean} showFlag True to show, false to hide
	 * 
	 */
	setEnabledField: function(enableFlag){
		if(jQuery.type(enableFlag)==="boolean"){
			if(enableFlag){
				this.getComponent().find("select[name='" + this.itemId + "']").removeAttr('disabled');
			}else{
				this.getComponent().find("select[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	},
	/**
	 * @Method fieldSpecificValidation
	 * @memberOf "canvas.lib.ComboBox"
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 * @param  value -value that has to be set to the field
	 */
	fieldSpecificValidation : function (value)
	{
		if((value)&&(this.keys)){
			if ((this.keys.contains(value.trim())) || (value.trim() == '-1'))
			{
				return true
			}else{
				return false
			}
		}else{
			return false
		}
	},
	/**
	 * Resets the form field value. This function is called from fm.clearValues(formFields, resetFlag)
	 */
	reset : function(){
		this.updateValue('-1');
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-combobox'
}, canvas.lib.ComboBox);
