/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
cbx.ns('canvas.lib');
/**
 * @namespace 	"canvas.lib"
 * @description Commom class for all the form elements that handles all the api in common
 */
// Todo : reset , Focus
// Widget , Lookup, Indepandant lookup, itemselector , htmleditor, upload panel, Subforms
canvas.lib.FormElements = Class(cbx.core.Component, {
    isValid: true,
    isFormField: true,
    ErrMsgDetail: CRB.getFWBundleValue('ERR_INVALID_FIELD'),
    allowBlank: true,
    value: '',
    emptyValue: '--', //for static field if no value is provided.
    constructor: function(config) {
        canvas.lib.FormElements.$super.call(this, config);
        this.addItem(config.parentContainer[0]);
    },
    initialize: function() {
        this.getLabel();
        this.getAnchor();
        this.getLabelAlignType();
        this.updateVtype();
        this.massageFieldSpecificMD();
        this.getAdditionalMetadata();
        this.compRef = $(this.parentContainer);
        if (this.isContainer) {
            this.postTemplateTask();
        } else {
            var libLayer = this.getLibLayer();
            libLayer.getTemplate(this.applyTemplate, this);
        }
    },
    getLibLayer: function() {
        return new ct.lib.tmplLayer("FDF/" + this.xtype + ".cttpl", this);
    },
    applyTemplate: function(template, tmpClass) {
        if (!cbx.core.isEmpty(this.parentContainer)) {
            $(this.parentContainer).append(template);
            this.compRef = $(this.parentContainer).children(0);
            this.postTemplateTask();
            //this.addItem(this.parentContainer[0]);
        }
    },
    postTemplateTask: function() {
        this.setIntialValue();
        this.generateFieldSpecificEvents();
    },
    generateFieldSpecificEvents: function() {
        // Does nothing in the parent class
    },
    massageFieldSpecificMD: function() {
        // Does nothing in the parent class
    },
    getAdditionalMetadata: function() {
        if (this.additionalMetadataInd == true) {
            var that = this;
            this.data = [];
            this.keys = [];
            var length, length_raw;
            length = length_raw = 0
                /*
                 * data[] - stores rawValues from database and rawValues from Additional Data.
                 * keys[] - stores rawKeys from database and rawKeys from Additional Data.
                 */
            if ((this.addData) && (!cbx.isEmpty(this.addData))) {
                length = this.addData.length
                for (var i = 0; i < length; i++) {
                    this.data.push(this.addData[i]['rawValue']);
                    this.keys.push(this.addData[i]['rawKey']);
                }
            }
            if ((this.rawKeys) && (!cbx.isEmpty(this.rawKeys))) {
                length_raw = this.rawKeys.length
                for (var i = 0; i < length_raw; i++) {
                    if (!cbx.isEmpty(this.rawKeys[i])) {
                        this.keys.push(this.rawKeys[i]);
                        this.data.push(this.rawValues[i]);
                    }
                }
            }
        }
    },
    updateValue: function() {
        // Does nothing in the parent class
    },
    getLabelAlignType: function() {
        this.labelAlignType = cbx.isEmpty(this.labelAlignType) ? 'TOP' : this.labelAlignType.toUpperCase();
    },
    getAnchor: function() {
        this.anchorStyle = '';
        if (!cbx.core.isEmpty(this.anchor)) {
            this.setMinWidth();
        }
    },
    setMinWidth: function() {
        if (this.itemType === 'DATE') {
            if (iportal.systempreferences.getDevice() == 'M' && Number(this.anchor.split('%')[0]) < 50) {
                this.anchorStyle = "style=width: 50%";
            } else {
                this.anchorStyle = "style=width:" + this.anchor + "";
            }
        } else {
            this.anchorStyle = "style=width:" + this.anchor + "";
        }
    },
    getLabel: function() {
        if (this.requiredInd == 'Y') {
            this.allowBlank = false;
        }
        this.fieldLabel = this.plainLbl;
        /** Added one more variable  Chandrakala ***/
        this.elemLabel = this.plainLbl;
        if (cbx.core.isEmpty(this.fieldLabel)) {
            this.fieldLabel = CRB.getBundleValue(this.bundleKey, 'LBL_' + this.displayNmKey) ? CRB.getBundleValue(this.bundleKey, 'LBL_' + this.displayNmKey) : this.displayNmKey;
            this.elemLabel = this.fieldLabel; /** Assigning new variable to field Chandrakala ***/
        }
        this.fieldName = this.fieldLabel;
        if (this.requiredInd == 'Y') {
            this.fieldLabel = this.fieldLabel + this.getMandatorySpan();
        } else if (this.conditionalInd == 'Y') {
            this.fieldLabel = this.fieldLabel + this.getConditionalMandatorySpan();
        }
    },
    getMandatorySpan: function() {
        return "<span class='mandatory requiredInd'><sup>*</sup></span>";
    },
    getConditionalMandatorySpan: function() {
        return "<span class='conditional-mandatory conditionalInd'><sup>**</sup></span>";
    },
    getComponent: function() {
        return this.compRef;
    },
    markInvalid: function(msg) {
        if (msg) {
            this.ErrMsgDetail = msg;
        }
        this.compRef.addClass('has-error');
        if (this.compRef.children().length > 0) {
            this.markInvalidField();
        }
    },
    markInvalidField: function() {
        this.compRef.find("span[type=Error_Msg]").removeClass('hidden').addClass('show').tooltip();
        this.compRef.find("span[type=Error_Msg]").attr('data-original-title', this.ErrMsgDetail);
    },
    clearInvalid: function() {
        this.compRef.removeClass('has-error');
        if (this.compRef.children().length > 0) {
            this.clearInvalidField();
        }
    },
    clearInvalidField: function() {
        this.compRef.find("span[type=Error_Msg]").removeClass('show').addClass('hidden');
        this.compRef.find("span[type=Error_Msg]").removeAttr('data-original-title');
    },
    setIntialValue: function() {
        var value = this.model.getModelData()[this.itemId];
        if (!cbx.isEmpty(value)) {
            this.updateValue(value);
        }
    },
    setFieldLabel: function(value) {
        if ((value.trim()) != '') {
            var label = this.compRef.find('span[data-item-type=ct-fieldlabel]');
            if (cbx.isEmpty(label[0])) {
                if (this.requiredInd == 'Y') {
                    this.fieldLabel = value + this.getMandatorySpan();
                } else if (this.conditionalInd == 'Y') {
                    this.fieldLabel = value + this.getConditionalMandatorySpan();
                }
            } else {
            var temp;
            if ((label.children().length) > 0) {
                temp = label.children();
            }
            label.innerHTML = value;
            label.append(temp);
            }
        }
    },
    setVisibleFields: function(showFlag) {
        if (showFlag == true) this.compRef.removeClass('hidden').addClass('show');
        else if (showFlag == false) this.compRef.removeClass('show').addClass('hidden');
    },
    showItem: function() {
        this.setVisibleFields(true);
    },
    hideItem: function() {
        this.setVisibleFields(false);
    },
    removeClass: function(value) {
        var defClass = ['form-group', 'ct-form__group', 'ct-' + this.xtype + '-bs', this.itemId + '-bs'];
        if ((value.trim()) != '' && defClass.indexOf(value) != -1) {
            this.compRef.removeClass(value);
        }
    },
    addClass: function(value) {
        if ((value.trim()) != '') {
            this.compRef.addClass(value);
        }
    },
    formatValue: function(value, config) {
        config = config || {};
        config.value = value;
        var formatedValue = DTF.getHandler(this.dataType, config);
        if (!cbx.isEmpty(formatedValue)) {
            return formatedValue;
        } else {
            return value;
        }
    },
    updateVtype: function() {
        if (this.vType != '') this.dataType = this.vType;
    },
    setValid: function(valid) {
        this.isValid = valid;
    },
    getValid: function() {
        return this.isValid;
    },
    Validate: function() {
        this.validateValue(this.getValue());
    }, // allow blank
    fieldSpecificValidation: function(value) {
        return true;
    },
    validateValue: function(value) {
        var Vtype = CFVR.getVtype(this.dataType);
        this.ErrMsgDetail = '';
        if (this.allowBlank == false && cbx.isEmpty(value)) {
            this.ErrMsgDetail = String.format(CRB.getFWBundleValue('ERR_MANDATORY'), this.elemLabel);
            return false;
        } else if (!cbx.isEmpty(Vtype) && !(Vtype.globalRe.test(value))) {
            this.ErrMsgDetail = Vtype.text;
            return false;
        } else if (!this.fieldSpecificValidation(value)) {
            return false;
        } else if (this.formManager.handlerEvent('cbxvalidate', this.itemId, value) === false) {
            return false;
        }
        return true;
    },
    keyPressListener: function(e) {
        var key = e.which;
        // For Arrow Keys, enter and backspace keys no need checking
        if (key == 0 || key == 8 || key == 13 || key == 32) {
            return true;
        }
        var Vtype = CFVR.getVtype(this.dataType);
        if (!cbx.isEmpty(Vtype) && !(Vtype.mask.test(String.fromCharCode(key)))) {
            return false;
        } else if (this.xtype == 'cbx-amountfield') {
            return this.lengthValidation(key);
        } else if (this.xtype == 'cbx-textarea') {
            return this.checkTextareaValidation();
        }
        return true;
    },
    setValue: function(value) {
        this.updateValue(value);
    },
    getValue: function() {
        return this.model.getModelData()[this.itemId];
    },
    enable: function() {
        this.setEnabledField(true);
        this.isEnabled = true;
    },
    disable: function() {
        this.setEnabledField(false);
        this.isEnabled = false;
    },
    focus: function() {
        // Does nothing in the parent class
    },
    /**
     * @Method getDisplayValue
     * @memberof "canvas.lib.FormElements"
     * @description The method is intended to retun the display value for the corresponding key value of a
     *              dropdown.Applicable only for drop down
     * @access public
     * @param {String} keyValue The key for which the value needs to be returned
     */
    getDisplayValue: function(keyValue) {
        if (keyValue && (this.keys) && (this.data)) {
            if (this.keys.contains(keyValue)) {
                return this.data[this.keys.getIndexOf[keyValue]]
            }
        }
    },
    setTitle: function(title) {
        this.setFieldValue(title);
    },
    handleClickEvent: function() {
        var multiFormInd = this.formManager.findField(this.parentId).multiFormInd;
        if (multiFormInd) {
            this.formManager.handlerEvent('cbxclick', this.itemId, this.getValue(), this.multiFormIndex, this.parentId);
        } else {
            this.formManager.handlerEvent('cbxclick', this.itemId);
        }
    },
    reRender: function() {
        this.parentContainer.empty();
        this.initialize();
    },
    reset: function() {
        // implemented in child classes
    }
});
CFCR.registerFormCmp({
    'COMP_TYPE': 'FORM_FIELDS'
}, canvas.lib.FormElements);