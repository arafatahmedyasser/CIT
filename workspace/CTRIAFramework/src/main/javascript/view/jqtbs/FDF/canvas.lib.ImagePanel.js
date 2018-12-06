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
 * @description This component is responsible to display an image carousel.
 */
canvas.lib.ImagePanel = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.ImagePanel"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	// Error Icon Hidden in your i tag not in span
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.ImagePanel"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		var that = this;
		this.data = [];
		for (var i = 0; i < this.addData.length; i++)
		{
			this.data[i] = this.addData[i]['rawValue'];
		}

	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.ImagePanel"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var images = this.getComponent().find('div[name="' + this.itemId + '"]').children('img').map(function ()
		{
			return $(this).attr('src')
		}).get()
		return images;
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.ImagePanel"
	 * @param value - {String} image source path
	 * @description This method is responsible to set the field value.
	 */
	setFieldValue : function (value)
	{
		if (this.data.contains(value.trim()))
		{
			this.getComponent().find('div[name="' + this.itemId + '"] .item .active').removeClass(active);
			this.getComponent().find('div[name="' + this.itemId + '"] .item img[src="' + value + '"]').addClass(active)
		}
	},
	/**
	 * @method addValue
	 * @memberof "canvas.lib.ImagePanel"
	 * @param newValue - {String} source path of the image to be addded
	 * @description This method is responsible for adding a new value to the field.
	 */
	addValue : function (newValue)
	{
		this.getComponent().find('div[name="' + this.itemId + '"]').append(
					'<div class="item"><img src="' + newValue + '"></div>')
	},
	/**
	 * @method removeValue
	 * @memberof "canvas.lib.ImagePanel"
	 * @param value - {String} source path of the image to be removed
	 * @description This method is responsible for removing a specified value from the field.
	 */
	removeValue : function (value)
	{
		if (this.data.contains(value.trim()))
		{
			var item = this.getComponent().find('div[name="' + this.itemId + '"] .item img[src="' + value + '"]')
			$(item).parent().remove()
		}
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.ImagePanel"
	 * @param value - {String} image source path
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
	/**
	 * @Method getScreenViewData
	 * @memberof "canvas.lib.ImagePanel"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
		return this.getFieldValue();
	},
	/**
	 * @Method updateComboRawStore
	 * @memberof "canvas.lib.ImagePanel"
	 * @param keyArr - {Array} Array of keys.
	 * @param valueArr - {Array} Array of values for the images.
	 * @description Intended to update the combo with  keys and values supplied.Applicable for dropdown/itemselector/iconcombo/autosuggest/imagePanel.
	 * For image panel the keys will be the ids of the image and the values will be the src for the images.
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
	 * @memberOf "canvas.lib.ImagePanel"
	 * @param  data -{Object} repopulate additional data to the raw store
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
	 */
	rePopulateAdditionaldata:function(data){
		var keyArr=[],valueArr=[];
        for(var i=0;i<data.length;i++){
        	keyArr.push(data[i].rawKey);
        	valueArr.push(data[i].rawValue);
	}
        this.updateComboRawStore(keyArr , valueArr);
    }

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-imagepanel'
}, canvas.lib.ImagePanel);
