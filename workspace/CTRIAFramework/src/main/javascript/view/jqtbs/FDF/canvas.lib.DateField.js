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
 * @description This component is currently responsible for rendering date field element.
 */
canvas.lib.DateField = Class(canvas.lib.FormElements, {
	/**
	 * @method generateFieldSpecificEvents
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible for creating the element specific functions.
	 */
	generateFieldSpecificEvents : function ()
	{
		this.getPrefrdDateFrmt();
		this.getComponent().find("input[name='" + this.itemId +"']").parent().datetimepicker({
			format : "DD/MM/YYYY", //this.datePrefFormat.toUpperCase(),
			disabledDates : this.disabledDates,
		});
		this.getComponent().find("input[name='" + this.itemId + "']").on('change', $.proxy(function (event)
		{
			this.updateValue(this.getFieldValue());
		}, this));
	},
	/**
	 * @method getPrefrdDateFrmt
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible get preffered date format.
	 */
	getPrefrdDateFrmt : function ()
	{
		this.datePrefFormat = canvas.datePreferences.getParsedDateFormat();
		/*if (this.datePrefFormat.search('YY') > -1)
		{
			this.datePrefFormat = this.datePrefFormat.replace("YY", "YYYY");
		} else if (this.datePrefFormat.search('Y') > -1)
		{
			this.datePrefFormat = this.datePrefFormat.replace("Y", "YY");
		}*/
	},
	/**
	 * @method focus
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible to set the focus to date.
	 */
	focus : function ()
	{
		this.getComponent().find("input[name='" + this.itemId + "']").focus();
	},
	/**
	 * @method setDisabledDates
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible to set the disabled dates
	 * @param disabledDates - {Array} disabledDates that are marked in the datefield.
	 * @param disabledDatesText - {Array} disabledDatesText that are marked for disabled days.
	 */
	setDisabledDates : function (disabledDates, disabledDatesText)
	{
		this.disabledDates = []; // By Default We Should Keep on Enty Array
		this.disabledDates = disabledDates;
		this.disabledDatesText = disabledDatesText;
	},
	/**
	 * @method setDisabledDatesText
	 * @memberof "canvas.lib.DateField"
	 * @param  disabledDatesText - {Array} disabledDatesText that are marked for disabled days
	 * @description This method is responsible to set the disabled dates text.
	 */
	setDisabledDatesText : function (disabledDatesText)
	{
		this.disabledDatesText = disabledDatesText;
	},
	/**
	 * @method setHolidayDates
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible to set the holiday dates
	 * @param holidayDates - {Array} holidayDates that are marked in the datefield.
	 * @param holidayText - {Array} holidayText that are marked for holidays.
	 */
	setHolidayDates : function (holidayDates, holidayText)
	{
		this.holidayDates = holidayDates;
		this.holidayText = holidayText;
	},
	/**
	 * @method setFieldValue
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible to set the field value.
	 * @param value to be set.
	 */
	setFieldValue : function (value)
	{
		this.getComponent().find("input[name='"+this.itemId+"']").val(value);
		if(this.compRef.hasClass('has-error')){
			this.markInvalidField();
		}
		this.setEnabledField(this.isEnabled);
	},
	/**
	 * @method getFieldValue
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible to get the field value.
	 */
	getFieldValue : function ()
	{
		var inputDate = this.getComponent().find("input[name='" + this.itemId + "']").val();
		var selecredDate = moment(inputDate, "DD/MM/YYYY");
		return selecredDate.format("DD/MM/YYYY");
	},
	/**
	 * @method formatValue
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible to format from d/m/yy to the user preference format of date.
	 * @param newValue- value to be formatted as user preferrable format.
	 */
	formatValue : function (newValue)
	{
		var selecredDate = moment(newValue, "DD/MM/YYYY");
		this.getPrefrdDateFrmt();
		var frmt = this.datePrefFormat;
		frmt = frmt.toUpperCase();
		return selecredDate.format(frmt);
	},
	/**
	 * @method updateValue
	 * @memberof "canvas.lib.DateField"
	 * @description This method is responsible for updating the modal value with the field value.
	 * @param newValue - value to be updated.
	 */
	updateValue : function (newValue)
	{
		if (this.validateValue(newValue))
		{ // if validate is success then allow
			if(cbx.isEmpty(newValue)){
				var obj=this.formManager.handlerEvent('cbxdateclear', this.itemId,newValue);   
			}
			this.setFieldValue(this.formatValue(newValue));
			if (newValue != this.value)
			{
				this.value = newValue
				this.model.updateValue(this.itemId, this.getFieldValue());// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
			}
			this.clearInvalid();
		} else
		{
			this.setFieldValue(newValue);
			if (newValue != this.value)
			{
				this.value = newValue
				this.model.updateValue(this.itemId, this.getFieldValue());// Updated from the setValue to updateValue
				this.updateScreenViewData(this);
			}
			this.setValid(false);
			this.markInvalid();
		}
	},
	/**
	 * @Method getScreenViewData
	 * @memberof "canvas.lib.DateField"
	 * @description	gets field value which is visible on the screen
	 * 
	 */
	getScreenViewData : function ()
	{
		return this.getFieldValue();
	},
	/**
	 * @Method setEnabledField
	 * @memberOf "canvas.lib.DateField"
	 * @description Intended to enable/ disable any component rendered under this Form Manager instance
	 * @access public
	 * @param enableFlag - {Boolean} showFlag True to show, false to hide
	 */
	setEnabledField : function (enableFlag)
	{
		if (jQuery.type(enableFlag) === "boolean")
		{
			if (enableFlag)
			{
				this.getComponent().find("input[name='" + this.itemId + "']").removeAttr('disabled');
				this.getComponent().find("input[name='" + this.itemId + "']").parent().find(
							'[data-item-id="ct-caladdon"]').removeAttr('disabled');
			} else
			{
				this.getComponent().find("input[name='" + this.itemId + "']").attr('disabled', 'disabled');
				this.getComponent().find("input[name='" + this.itemId + "']").parent().find(
							'[data-item-id="ct-caladdon"]').attr('disabled', 'disabled');
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
	'COMP_NAME' : 'cbx-datefield'
}, canvas.lib.DateField);
