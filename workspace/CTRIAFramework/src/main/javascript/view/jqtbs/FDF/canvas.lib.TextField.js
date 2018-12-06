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
 * @description This component is currently responsible for rendering text field element.
 */
canvas.lib.TextField = Class(canvas.lib.FormElements, {
    /**
     * @class "canvas.lib.TextField"
     * @description The formatType specifies the formated value type of display, the dataType specifies the type of data
     *              the field acknowledges.
     */
    formatType: '',
    dataType: 'ALPHANUMERIC',
    /**
     * @method generateFieldSpecificEvents
     * @memberof "canvas.lib.TextField"
     * @description This method is responsible for creating the element specific functions.
     */
    generateFieldSpecificEvents: function() {
        /**
         * This is for restoring the formatting value with actual value
         */
        this.getComponent().find("input[name='" + this.itemId + "']").on('focus', $.proxy(function() {
            if (this.isValid) {
                var value = this.model.getModelData()[this.itemId];
                this.setFieldValue(value);
            } else {
                this.clearInvalid();
                this.setValid(true);
            }
        }, this));
        /**
         * This is for Validating the value after entering into the element
         */
        this.getComponent().find("input[name='" + this.itemId + "']").on('blur', $.proxy(function(event) {
            var newValue = this.getFieldValue();
            this.updateValue(newValue);
        }, this));
        /**
         * This is for Validating the value that are entering into the element
         */
        this.getComponent().find("input[name='" + this.itemId + "']").on('keypress', $.proxy(this.keyPressListener, this));
    },
    /**
     * @method setFieldValue
     * @memberof "canvas.lib.TextField"
     * @description This method is responsible to set the field value.
     */
    setFieldValue: function(value) {
        this.getComponent().find("input[name='" + this.itemId + "']").val(value);
        if (this.compRef.hasClass('has-error')) {
            this.markInvalidField();
        }
        this.setEnabledField(this.isEnabled);
    },
    /**
     * @method getFieldValue
     * @memberof "canvas.lib.TextField"
     * @description This method is responsible to get the field value.
     */
    getFieldValue: function() {
        return this.getComponent().find("input[name='" + this.itemId + "']").val();
    },
    /**
     * @method updateValue
     * @memberof "canvas.lib.TextField"
     * @description This method is responsible for updating the modal value with the field value.
     */
    updateValue: function(newValue) {
        if (this.validateValue(newValue.trim())) { // if validate is success then allow
            this.setFieldValue(this.formatValue(newValue));
            if (newValue != this.value) {
                this.value = newValue;
                this.model.updateValue(this.itemId, newValue); // Updated from the setValue to updateValue
                this.updateScreenViewData(this);
            }
            this.setValid(true);
            this.clearInvalid();
        } else {
            this.setFieldValue(newValue);
            if (newValue != this.value) {
                this.value = newValue
                this.model.updateValue(this.itemId, newValue); // Updated from the setValue to updateValue
                this.updateScreenViewData(this);
            }
            this.setValid(false);
            if (newValue.length > this.maxLength) {
                this.markInvalid(String.format(CRB.getFWBundleValue('ERR_MAXLENGTH_EXCEED'), this.elemLabel, this.maxLength));
            } else if (newValue.length < this.minLength) {
                this.markInvalid(String.format(CRB.getFWBundleValue('ERR_MINLENGT_EXCEED'), this.elemLabel, this.minLength));
            } else {
                this.markInvalid(String.format(CRB.getFWBundleValue('ERR_MANDATORY_TEXTFIELD'), this.elemLabel));
            }
        }
    },
    getScreenViewData: function() {
        return this.getFieldValue();
    },
    /**
     * @Method setEnabledField
     * @memberOf "canvas.lib.TextField"
     * @description Intended to enable/ disable any component rendered under this Form Manager instance
     * @access public
     * @param {Boolean} showFlag True to show, false to hide
     * 
     */
    setEnabledField: function(enableFlag) {
        if (jQuery.type(enableFlag) === "boolean") {
            if (enableFlag) {
                this.getComponent().find("input[name='" + this.itemId + "']").removeAttr('disabled');
            } else {
                this.getComponent().find("input[name='" + this.itemId + "']").attr('disabled', 'disabled');
            }
        }
    },
    lengthValidation: function(key) {
        var newValue = this.getFieldValue();
        if (this.maxLength) {
            if (newValue.length > this.maxLength) {
                return false;
            } else {
                return true
            }
        } else {
            return true;
        }
    },
    fieldSpecificValidation: function(value) {
        if (!cbx.isEmpty(this.maxLength) || !cbx.isEmpty(this.minLength)) {
            if ((value.length > this.maxLength) || (value.length < this.minLength)) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    },
    /**
     * Resets the form field value. This function is called from fm.clearValues(formFields, resetFlag)
     */
    reset: function() {
        this.updateValue('');
    }
});
CFCR.registerFormCmp({
    'COMP_TYPE': 'FORM_FIELDS',
    'COMP_NAME': 'cbx-textfield'
}, canvas.lib.TextField);