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
 * @description This component is a group input fields with a check option.
 */
canvas.lib.CheckBoxGroup = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.CheckBoxGroup"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	data : [],
	keys : [],
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.CheckBoxGroup"
	 * @description This method is responsible for massaging the data to be sent to the template
	 */
	massageFieldSpecificMD : function ()
	{
		var that = this;
		
		if(cbx.isEmpty(this.keys)){
		
			var length, length_raw;
			length =length_raw=0
			/*
			 * data[] - stores rawValues from database and rawValues from Additional Data.
			 * keys[] - stores rawKeys from database and rawKeys from Additional Data.
			 */
			if ((this.addData) && (!cbx.isEmpty(this.addData)))
			{
				length = this.addData.length
				for (var i = 0; i < length; i++)
				{
					this.data.push(this.addData[i]['rawValue']);
					this.keys.push(this.addData[i]['rawKey']);
				}
			}
			if ((this.rawKeys) && (!cbx.isEmpty(this.rawKeys)))
			{
				length_raw = this.rawKeys.length
				for (var i = 0; i < length_raw; i++)
				{
					if ((!cbx.isEmpty(this.rawKeys[i])))
					{
						this.keys.push(this.rawKeys[i]);
						this.data.push(this.rawValues[i]);
					}
				}
			}
		}
	},
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.CheckBoxGroup"
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
		this.getComponent().find('input[name="' + this.itemId + '"]').on('focus', $.proxy(function (event)
		{
			that.clearInvalid();
			var value = that.model.getModelData()[that.itemId];
			that.setFieldValue(value);
		}, this));
		this.getComponent().find('input[name="' + this.itemId + '"]').on('blur', $.proxy(function (event)
		{
			var newValue = that.getFieldValue();
			this.updateValue(newValue)
		}, this));
		// Need to Be done
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.CheckBoxGroup"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var allVals = []
		this.getComponent().find('input[name="' + this.itemId + '"]:checked').each(function ()
		{
			allVals.push($(this).val());
		});
		return allVals;
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.CheckBoxGroup"
	 * @description This method is responsible to set the field value.
	 * @param value - {Array} or {String} depending on the values or value to be checked.
	 */
	setFieldValue : function (value)
	{
		for (var i = 0; i < this.keys.length; i++)
	{
		if (cbx.isArray(value))
		{
				if (value.contains(this.keys[i]))
			{
					this.getComponent().find('input[name="' + this.itemId + '"]').filter(
								'[value="' + this.keys[i] + '"]')[0].checked= true;
				}
			} else if (value == this.keys[i])
			{
				this.getComponent().find('input[name="' + this.itemId + '"]').filter('[value="' + this.keys[i] + '"]')[0].checked= true;
			} else
			{
				this.getComponent().find('input[name="' + this.itemId + '"]').filter('[value="' + this.keys[i] + '"]')[0].checked= false;
			}

		}
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.CheckBoxGroup"
	 * @description This method is responsible for updating the modal value with the field value.
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
				//this.setFieldValue(newValue);
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
				this.setValid(false);
				this.markInvalid(CRB.getFWBundleValue('ERROR_ATLEAST_ONE_SELECT'));
			}
	},
	/**
	 * @Method getScreenViewData
	 * @memberof "canvas.lib.CheckBoxGroup"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
		return this.getFieldValue();
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.CheckBoxGroup"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param {Boolean} showFlag True to show, false to hide
	 */
	setEnabledField : function (enableFlag)
	{
		if (jQuery.type(enableFlag) === "boolean")
		{
			if (enableFlag)
			{
				this.getComponent().find("input[name='" + this.itemId + "']").removeAttr('disabled');
			} else
			{
				this.getComponent().find("input[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	},
	/**
	 * @Method updateComboRawStore
	 * @memberof "canvas.lib.CheckBoxGroup"
	 * @description Intended to update the combo with  keys and values supplied.Applicable for dropdown/itemselector/iconcombo/autosuggest/imagePanel.
	 * For image panel the keys will be the ids of the image and the values will be the src for the images.
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
	 * @memberof "canvas.lib.CheckBoxGroup"
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
	 * @Method fieldSpecificValidation
	 * @memberOf "canvas.lib.CheckBoxGroup"
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 * @param  value -value that has to be set to the field
	 */
	fieldSpecificValidation : function (value)
	{
		if ((!cbx.isEmpty(value)) && (this.keys))
		{
			if (cbx.isArray(value))
			{
				for (var i = 0; i < value.length; i++)
				{
					if (this.keys.contains(value[i]))
					{
						return true
					} else
					{
						return false
					}
				}
			} else if (this.keys.contains(value))
			{
				return true
			} else
			{
				return false
			}
		}else{
			return true;
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
	'COMP_NAME' : 'cbx-checkboxgroup'
}, canvas.lib.CheckBoxGroup);
