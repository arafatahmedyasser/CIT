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
 * @description This component is responsible to display the selected values of the combo box in the view mode.
 */
canvas.lib.StaticComboBox = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.StaticComboBox"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	// Error Icon Hidden in your i tag not in span
		
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.StaticComboBox"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{

	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.StaticComboBox"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var val = this.getComponent().find('span[name="' + this.itemId + '"]').text();

		var allVals=[] 
		var FieldValues=[]
		allVals = val.split(',');
		if(allVals){
			for(var i=0; i<allVals.length; i++){
				FieldValues[i]=this.keys[this.data.getIndexOf(allVals[i].trim())]
			}
			return FieldValues;
		}else{
			return null;
		}
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.StaticComboBox"
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		if(cbx.isEmpty(value)){value=this.emptyValue;}
		this.getComponent().find("span[name='" + this.itemId + "']").text(this.data[this.keys.getIndexOf(value)]);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.StaticComboBox"
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
				this.setFieldValue(newValue);
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
				this.setValid(false);
				this.markInvalid();
			}
	},
	getScreenViewData : function(){
		return this.getFieldValue();
	},
	/**
	 * @Method updateComboRawStore
	 * @memberof "canvas.lib.StaticComboBox"
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
	 * @memberof "canvas.lib.Staticcombobox"
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
	 * @memberOf "canvas.lib.StaticComboBox"
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 * @param  value -value that has to be set to the field
	 */
	fieldSpecificValidation : function (value)
	{
		if ((value) && (this.keys))
		{
			if ((this.keys.contains(value.trim())) || (value.trim() == '-1'))
			{
				return true
			} else
			{
				return false
			}
		} else
		{
			return false
		}
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-staticcombobox'
}, canvas.lib.StaticComboBox);
