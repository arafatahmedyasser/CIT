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
 * @description This component is currently responsible for rendering spinner field element.
 */
canvas.lib.SpinnerField = Class(canvas.lib.FormElements, {
        /**
         * @class "canvas.lib.SpinnerField"
         * @description The formatType specifies the formated value type of display, the dataType specifies the type of data
         *              the field acknowledges.
         */
        formatType:'',
        dataType:'AMOUNT',
        /**
         * @method generateFieldSpecificEvents
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for creating the element specific functions.
         */
        generateFieldSpecificEvents : function ()
        {
                
                /**
                 * This is for restoring the formatting value with actual value
                 */
                this.getComponent().find("input[name='" + this.itemId + "']").on('focus', $.proxy(function ()
                {
                        if (this.isValid)
                        {
                                var value = this.model.getModelData()[this.itemId];
                                this.setFieldValue(value);
                        } else
                        {
                                this.clearInvalid();
                                this.setValid(true);
                        }
                },this));
                /**
                 * This is for Validating the value after entering into the element
                 */
                this.getComponent().find("input[name='" + this.itemId + "']").on('blur', $.proxy(function (event)
                {
                        var newValue = this.getFieldValue();
                        this.updateValue(newValue);
                },this));
                /**
                 * This is for Validating the value that are entering into the element
                 */
                this.getComponent().find("input[name='" + this.itemId + "']").on('keypress',
                                        $.proxy(this.keyPressListener, this));
                /**
                 * This is for increment and decrement of field value
                 */
                this.getComponent().find('#spin_up').on('click', $.proxy(function (event)
                {
                        var value = this.getFieldValue();
                        if(value == ""){ value = "0"; } //JQTBS#SPIN
                        var decimal=this.getDecimalPart(value);
                        var number=parseInt(value);
                        if(!isNaN(number))
                        this.updateValue((++number).toString()+decimal);
                        else{
                        this.setValid(false);
                        this.markInvalid();
                        }
                        
                        
                },this));
                this.getComponent().find('#spin_down').on('click', $.proxy(function (event)
                {
                        var value = this.getFieldValue();
                        if(value == ""){ value = "0"; } //JQTBS#SPIN
                        var decimal=this.getDecimalPart(value);
                        var number=parseInt(value);
                        if(!isNaN(number))
                        this.updateValue((--number).toString()+decimal);
                        else{
                        this.setValid(false);
                        this.markInvalid();
                        }
                                
                
                },this));
        },
        /**
         * @method isLimitExceded
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for checking wether the given value is within the rage specified.
         */
        isLimitExceded: function(value){
                this.minLength=this.getminLength();
                var result=false;
                if(this.minLength!=undefined){
                	result=canvas.compareNumber(value,this.maxLength,this.minLength);
                }
                return !(result);
        },
        /**
         * @method setdefaultValue
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for seting the default value for the spinner,
         */
        setdefaultValue: function(value){
                this.defaultValue=value;
        },
        getminLength:function(){
                return this.minLength || 0;
        },
        /**
         * @method setmaxLength
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for seting the maximum value for the spinner.
         */
        setmaxLength: function(value){
                this.maxLength=value;
        },
        /**
         * @method setminLength
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for seting the minimum value for the spinner.
         */
        setminLength: function(value){
                this.minLength=value;        
        },
        /**
         * @method setDecimalPrecision
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for seting the decimal Precision.
         */
        setDecimalPrecision: function(value){
                this.decimalPrecision=value;
        },
        /**
         * @method getDecimalPart
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for geting the decimal part of the number.
         */
        getDecimalPart:function(value){
                var decimal='';
                if(value.indexOf('.')!=-1)
                        {
                        decimal='.'+value.split('.')[1];
                        //need to limit based on precission here
                        }
                return decimal;
        },
        /**
         * @method setFieldValue
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible to set the field value.
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
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible to get the field value.
         */
        getFieldValue : function ()
        {
                return this.getComponent().find("input[name='"+this.itemId+"']").val();
        },
        /**
         * @method focus
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible to set the focus to the spinner.
         */
        focus: function(){
                this.getComponent().find("input[name='" + this.itemId + "']").focus();
        },
        /**
         * @method updateValue
         * @memberof "canvas.lib.SpinnerField"
         * @description This method is responsible for updating the modal value with the field value.
         */
        updateValue : function (newValue)
        {
                if(parseInt(newValue)<parseInt(this.getminLength())){
                        this.setFieldValue(this.formatValue(this.getminLength()));
                        this.model.updateValue(this.itemId, this.getminLength());
                        this.setValid(true);
                        this.clearInvalid();
                        return;
                }
                if (this.validateValue(newValue) && !(this.isLimitExceded(newValue)) ){
                        this.setFieldValue(this.formatValue(newValue));
                        if(newValue != this.value){
                				this.value = newValue
                				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
                				this.updateScreenViewData(this);
                        }
                        this.setValid(true);
                        this.clearInvalid();
                } else{
                        this.setFieldValue(newValue);
                        if(newValue != this.value){
                				this.value = newValue
                				this.model.updateValue(this.itemId, newValue);// Updated from the setValue to updateValue
                				this.updateScreenViewData(this);
                        }
                        this.setValid(false);
                        if(this.isLimitExceded(newValue))
                        	 this.markInvalid(String.format(CRB.getFWBundleValue('ERR_MAX_NUM_EXCEED'),this.elemLabel,this.maxLength));
                        else
                             this.markInvalid(CRB.getFWBundleValue('ERR_INVALID_NUMBER'));
                }                                
        },
        getScreenViewData : function(){
        	return this.getFieldValue();
    	},
        /**
         * @Method setEnabledField
         * @memberOf "canvas.lib.SpinnerField"
         * @description Intended to enable/ disable any component rendered under this Form Manager instance
         * @access public
         * @param {Boolean} showFlag True to show, false to hide
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
    	 * Resets the form field value. This function is called from fm.clearValues(formFields, resetFlag)
    	 */
    	reset : function(){
    		this.updateValue('');
        }

});

CFCR.registerFormCmp({
        'COMP_TYPE' : 'FORM_FIELDS',
        'COMP_NAME' : 'cbx-spinnerfield'
}, canvas.lib.SpinnerField);
