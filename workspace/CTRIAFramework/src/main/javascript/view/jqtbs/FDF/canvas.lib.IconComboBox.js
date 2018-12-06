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
 * @description This component is responsible to allow the user to select any option with an icon from the dropdown
 *              menu.
 */
canvas.lib.IconComboBox = Class(canvas.lib.FormElements, {
	/**
	 * @class "canvas.lib.IconComboBox"
	 * @description The events on and by the component are described below
	 */
	additionalMetadataInd:true,
	/**
	 * @method massageFieldSpecificMD
	 * @memberof "canvas.lib.IconComboBox"
	 * @description This method is responsible for massaging metadata before creating the element.
	 */
	massageFieldSpecificMD : function(){
		this.selectLbl =  CRB.getFWBundleValue('LBL_SELECT');
	},
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.IconComboBox"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		var that = this;
		
		this.getComponent().find('.dropdown-menu li').click(function ()
		{
			that.setValid(true);
			that.clearInvalid();
			var selText = $(this).html();
			$(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
			var newValue = that.getFieldValue();
			that.updateValue(newValue)
		});
		this.getComponent().find('.dropdown-menu').on("focus", $.proxy(function (event)
		{

			that.clearInvalid();
		}, this));
		this.getComponent().find('.dropdown-menu').on("blur", $.proxy(function (event)
		{
			var newValue = that.getFieldValue();
			this.updateValue(newValue)
		}, this));

	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.IconComboBox"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var val = this.getComponent().find('.btn-group .dropdown-toggle span.ct-icon-combo__val').attr('data-item-id');
		return val;
		

	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.IconComboBox"
	 * @param  value -{String} value that has to be set to the field
	 * @description This method is responsible to set the field value.
	 * 
	 */
	setFieldValue : function (value)
	{
		
			var parentId = this.parentId
			var itemId = this.itemId
			var item = this.getComponent().find('li[data-item-id="' + value + '"]').html()
			if(value =='-1'){
				this.getComponent().find('.btn-group .dropdown-toggle').html(item + '<span class="caret"></span>');
			}
			else{
				this.getComponent().find('.btn-group .dropdown-toggle').html(item);
			}
			if(this.compRef.hasClass('has-error')){
				this.markInvalidField();
			}
			this.setEnabledField(this.isEnabled);
		
	},
	/**
	 * @method removeValue
	 * @memberof "canvas.lib.IconComboBox"
	 * @param value - {String} value of the option to be removed
	 * @description This method is responsible for removing a specified value from the field.
	 */
	removeValue : function (value)
	{
		this.getComponent().find('ul.dropdown-menu li[data-item-id="' + value + '"]').remove();

	},
	/**
	 * @method addValue
	 * @memberof "canvas.lib.IconComboBox"
	 * @param value - {String} value of the option selected
	 * @description This method is responsible for adding a new value to the field.
	 */
	addValue : function (value)
	{
		this.getComponent().find('ul.dropdown-menu').append(
					'<li class="ct-icon-combo-each"><a><span class="ct-icon-combo__icon comboIcon-' + this.parentId + '-'
								+ this.itemId + '-' + value + '"></span><span class="ct-icon-combo__val">'
								+ this.data[this.keys.getIndexOf(value)]
								+ '</span><span class="caret"></span></a></li>')
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.IconComboBox"
	 * @param newValue - {String} value of the option selected
	 * @description This method is responsible for updating the modal value with the field value.
	 */
	updateValue : function (newValue)
	{
			if (this.validateValue(newValue))
			{ // if validate is success then allow
				this.value = newValue
				this.setFieldValue(this.formatValue(newValue));
				this.updateScreenViewData(this);
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.setValid(true);
				this.clearInvalid();
			} else
			{
				this.value = newValue
				this.setFieldValue(newValue);
				this.updateScreenViewData(this);
				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
				this.setValid(false);
				this.markInvalid(CRB.getFWBundleValue('ERR_VALID_SELECT'));
			}
	},
	/**
	 * @Method getScreenViewData
	 * @memberof "canvas.lib.IconComboBox"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function(){
		return this.getFieldValue();
	},
	/**
	 * @Method updateComboRawStore
	 * @memberof "canvas.lib.IconComboBox"
	 * @param keyArr - {Array} Array of keys.
	 * @param valueArr - {Array} Array of values for the drop down/Itemselector.
	 * @description Intended to update the combo with fieldname, keys and values supplied.Applicable for dropdown/itemselector/iconcombo/autosuggest/imagePanel.
	 * For image panel the keys will be te ids of the image and the values will be the src for the images.
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
	 * @memberof "canvas.lib.IconComboBox"
	 * @param data - {Object} data to be updated
	 * @description if cacheIndicator is "N" this function gets called to update raw store
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
	 * @memberOf "canvas.lib.IconComboBox"
	 * @param {Boolean} showFlag True to show, false to hide
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * 
	 */
	setEnabledField: function(enableFlag){
		if(jQuery.type(enableFlag)==="boolean"){
			if(enableFlag){
				this.getComponent().find("button[name='" + this.itemId + "']").removeAttr('disabled');
			}else{
				this.getComponent().find("button[name='" + this.itemId + "']").attr('disabled','disabled');
			}
		}
	},
	/**
	 * @Method fieldSpecificValidation
	 * @memberOf "canvas.lib.IconComboBox"
	 * @param  value -{String} value that has to be set to the field
	 * @description Intended to perform field specific validation on the value that is passed to the setFieldValue 
	 * @access public
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
		this.updateValue('');
	}

});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'FORM_FIELDS',
	'COMP_NAME' : 'cbx-iconcombobox'
}, canvas.lib.IconComboBox);
