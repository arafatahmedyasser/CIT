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

cbx.ns('cbx.lib.formElement');
/*
 * cbx.lib.formElement.LazzyPanel = Class( cbx.core.Component, { formPanel : '',
 * formManager : null, isFormField : false, formPanelMD : null,
 * lazzyPanelContainer : null, constructor : function(config) {
 * cbx.lib.formElement.LazzyPanel.$super.call(this); this.formPanel =
 * config.formPanel; this.xtype=config.xtype || "";
 * this.compositeField=config.compositeField?config.compositeField:false;
 * this.formManager = config.formManager; this.formPanelMD = config.formData; if
 * (typeof this.formPanelMD !== 'undefined') { Creating the lazzy panel
 * container var lazzyPanelConfig = { 'eleType' : 'div', 'id' :
 * this.formPanelMD.itemId, 'class' : 'lazzypanel-container' };
 * this.lazzyPanelContainer = new cbx.lib.layer( lazzyPanelConfig).getLayer();
 * if (config.mode == "TOP") {
 * $(this.formPanel).prepend(this.lazzyPanelContainer); } else {
 * $(this.formPanel).append(this.lazzyPanelContainer); } var childrens =
 * this.createItems(); if (typeof childrens !== 'undefined' && childrens.length >
 * 0) { if (typeof this.formPanelMD.layout === 'undefined' ||
 * this.formPanelMD.layout.trim() === '' ||
 * this.formPanelMD.layout.trim().toUpperCase() === 'STACK') { for ( var child =
 * 0; child < childrens.length; child++) { LOGGER.info('xtype:' +
 * childrens[child].xtype + '--id:' + childrens[child].itemId); var cClass =
 * CFCR.getFormCmp({ 'COMP_TYPE' : childrens[child].xtype }); if (cClass) { //
 * Setting data for combobox if (childrens[child].xtype == "cbx-combobox") {
 * childrens[child]['additionalData'] =
 * this.formPanelMD.additionalData[childrens[child]['itemId']]; } else if
 * (childrens[child].xtype == "cbx-fieldset") {
 * childrens[child]['additionalData'] = this.formPanelMD.additionalData; }
 * childrens[child]['fm'] = this.formManager; var componentDOM = new cClass(
 * childrens[child]).getComponentDOM(); this.lazzyPanelContainer
 * .appendChild(componentDOM); } } } else if (typeof this.formPanelMD.layout !==
 * 'undefined' || this.formPanelMD.layout.trim().toUpperCase() === 'TABLE' &&
 * typeof this.formPanelMD.totalColumns !== 'undefined' &&
 * this.formPanelMD.totalColumns > 0) { var tableFormLayout = new
 * cbx.lib.layout.TableFormLayout( { 'totalColumns' :
 * this.formPanelMD.totalColumns }); for ( var child = 0; child <
 * childrens.length; child++) { var cClass = CFCR.getFormCmp({ 'COMP_TYPE' :
 * childrens[child].xtype }); if (cClass) { childrens[child]['additionalData'] =
 * this.formPanelMD.additionalData[childrens[child]['itemId']]; var componentDOM =
 * new cClass( childrens[child]).getComponentDOM(); } }
 * this.lazzyPanelContainer.appendChild(componentDOM); } } } }, createItems :
 * function() { var config = { formId : this.formPanelMD.formId, model :
 * this.formManager.model, mode : this.formManager.mode, manager :
 * this.formManager, preInitConfig : this.formManager.preInitConfig, metadata :
 * this.formPanelMD, screenView : this.formManager.screenView }; // Retrieving
 * formfield items var formCreator = new cbx.form.FormCreator(config); return
 * formCreator.getFormFields(); } });
 */
/*
 * CLCR.registerCmp({ 'COMP_TYPE' : 'cbx-lazzypanel' },
 * cbx.lib.formElement.LazzyPanel);
 */

cbx.lib.formElement.cbxFieldSet = Class(
		cbx.core.Component,
		{
			isFormField : false,
			formManager : null,
			canValidate : false,
			constructor : function(config) {
				cbx.lib.formElement.cbxFieldSet.$super.call(this);
				this.formManager = config.fm;
				this.fieldSetData = config;
				this.xtype = config.xtype || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.mode = config.mode;
				this.createFieldSet(config);
				this.addItem(this.fieldSetObject.getLayer());
				this.setEleType("N", config);
				;
			},
			createFieldSet : function(config) {

				var className;
				/*
				 * Converting Fieldset as Collapsible Container
				 */

				
				var fieldSetConfig = {
					"eleType" : "div",
					"id" : config.itemId,
					'class' : 'jqm-form-field-c jqm-collapsible-fieldset',
					'data-role' : 'collapsible',
					'data-collapsed' : this.fieldSetData.collapsibelInd === "Y" ? true
							: false,
					'data-mini' : 'true',
					"style" : {
						"display" : (typeof this.fieldSetData.visibleInd !== 'undefined' && (this.fieldSetData.visibleInd
								.trim().toUpperCase() === 'N' || this.fieldSetData.hidden == true)) ? "none"
								: ""
					}
				};

				if (this.fieldSetData.disabled == true) {
					fieldSetConfig.disabled = true;
				}
				
				/*
				 * Checking whether the displayNmKey data is available or not if
				 * available use otherwise use plainLbl data
				 */
				var displayLabelName = this
						.getDisplayNameKey(this.fieldSetData);
				if (cbx.isEmpty(displayLabelName)) {
					fieldSetConfig['data-disabled'] = 'true';
				}
				
				var legendConfig = {
					"eleType" : "h3",
					/* "class": "ui-widget-header ui-corner-all cbx-legend", */
					"html" : displayLabelName
				};
				var fieldSetConfigData = {
					"eleType" : "div",
					"id" : config.itemId + "-data",
					"class" : "cbx-fieldset-data",
					'style' : {
						'background-color' : 'none'
					}
				};
				this.fieldSetDataObj = new cbx.lib.layer(fieldSetConfigData);
				this.fieldSetObject = new cbx.lib.layer(fieldSetConfig);

				$(this.fieldSetObject.getLayer()).css('margin-bottom', '5px');
				var legendObject;
				if (!cbx.isEmpty(displayLabelName)) {
					legendObject = new cbx.lib.layer(legendConfig);
				}
				
				$(this.fieldSetObject.getLayer()).on('collapse expand',function() {
					doIScroll('CONTENT_DIV', 'refresh');
				});
			
				
				if (legendObject) {
					this.fieldSetObject.addLayer(legendObject.getLayer());
				}
				var formFieldObject;
				
				var that = this;
				var iterateFormElements = function() {
					var fsElements = that.createItems();
					if (typeof fsElements !== 'undefined'
							&& fsElements.length > 0) {
						for ( var i = 0; i < fsElements.length; i++) {
							var childComponentConfig = fsElements[i];
							if (typeof childComponentConfig.xtype !== 'undefined') {
								var cClass = CFCR.getFormCmp({
									'COMP_TYPE' : childComponentConfig.xtype
								});
								if (cClass) {
									if (childComponentConfig.xtype === "cbx-lazzyformpanel") {
										new cClass({
											'formPanel' : that.fieldSetDataObj
													.getLayer(),
											'formData' : childComponentConfig,
											'formManager' : that.formManager
										});
									} /*
										 * else if (childComponentConfig.xtype
										 * === "cbx-lazzypanel") { new cClass({
										 * 'formPanel' : that.fieldSetDataObj
										 * .getLayer(), 'formData' :
										 * childComponentConfig, 'formManager' :
										 * that.formManager }); }
										 */else {
										if (childComponentConfig.xtype === "cbx-combobox" || childComponentConfig.xtype === "cbx-datefield") {
											childComponentConfig['additionalData'] = that.fieldSetData.additionalData[childComponentConfig['itemId']];
										} else if (childComponentConfig.xtype == "cbx-fieldset"
												|| childComponentConfig.xtype == "cbx-lazzypanel") {
											childComponentConfig['additionalData'] = that.fieldSetData.additionalData[childComponentConfig['itemId']];
										}
										childComponentConfig['fm'] = that.formManager;
										var formFieldObject = new cClass(
												childComponentConfig);
										that.fieldSetDataObj
												.addLayer(formFieldObject
														.getComponentDOM());
									}
								}
							}
						}
					}
				};
				iterateFormElements();
				this.fieldSetObject.addLayer(this.fieldSetDataObj.getLayer());
				

			},
			getComponentDOM : function() {
				return this.fieldSetObject.getLayer();
			},
			createItems : function() {
				var config = {
					formId : this.fieldSetData.formId,
					model : this.formManager.model,
					mode : this.mode ? this.mode : this.formManager.mode,
					manager : this.formManager,
					preInitConfig : this.formManager.preInitConfig,
					metadata : this.fieldSetData,
					screenView : this.formManager.screenView
				};
				// Retrieving formfield items
				var formCreator = new cbx.form.FormCreator(config);
				return formCreator.getFormFields();
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-fieldset'
}, cbx.lib.formElement.cbxFieldSet);

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-lazzypanel'
}, cbx.lib.formElement.cbxFieldSet);

cbx.lib.formElement.cbxAmountField = Class(
		cbx.core.Component,
		{
			displayLabelName : null,
			inputCmponentObject : null,
			amountFieldObject : null,
			integrallength : false,
			isFormField : true,
			decimallength : false,
			formManager : null,
			canValidate : true,
			configData : '',
			signdigits : 2,
			config : {},
			
			// These variables are used to hold the linked ccy container and
			// flag value of likned ccy
			linkedCCyContainer : null,
			linkedCCyEnabled : false,
		
			constructor : function(config) {
				this.config = config;
				cbx.lib.formElement.cbxAmountField.$super.call(this);
				cbx.apply(this, config);
				this.configData = config;
				this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
				this.anchor = config.anchor;
				this.xtype = config.xtype || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.formManager = config.fm;
				this.bundleKey = config.bundleKey;
				this.createAmountField(config);
				this.addItem(this.inputCmponentObject.getLayer());
				this.setEleType("N", config);
			},
			createAmountField : function() {
			
				var that = this;
				
				inputConfig = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"id" : this.configData.itemId,
					"class" : "ui-field-contain ui-body jqm-form-field-c jqm-cbxAmountField",
					"style" : {/*
								 * "display" : (typeof
								 * this.configData.visibleInd !== 'undefined' &&
								 * (this.configData.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.configData.hidden==true)) ? "none" : ""
								 */}
				};
				this.plainLabel = "";
				if (this.configData.plainLbl != null
						&& $.trim(this.configData.plainLbl) !== "") {
					this.plainLabel = this.configData.plainLbl;
				} else {
					this.plainLabel = this.getDisplayNameKey(this.configData);
				}

				if (this.compositeField) {
					inputConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.configData.visibleInd !== 'undefined'
						&& (this.configData.visibleInd.trim().toUpperCase() === 'N' || this.configData.hidden == true)) {
					inputConfig["class"] = "ui-field-contain ui-body jqm-display-hide";

				}
				this.inputCmponentObject = new cbx.lib.layer(inputConfig);
				/*
				 * Checking whether the displayNmKey data is available or not if
				 * available use otherwise use plainLbl data
				 */
				/*
				 * if(typeof this.configData.displayNmKey !== 'undefined' &&
				 * this.configData.displayNmKey !== '') { displayLabelName =
				 * this.configData.displayNmKey; } else { displayLabelName =
				 * this.configData.plainLbl; }
				 */
				
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
						this.configData);

				this.inputCmponentObject
						.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');

				var amountConfig = {
					"eleType" : "input",
					"name" : this.configData.itemId,
					"cbx-type" : "formField_" + this.configData.itemType,
					"id" : this.configData.itemId + "_field",
					"class" : "cbx-textbox",
					"type" : "text",
                    "pattern":"[0-9,.]*"
                    	
					/*"type" : "number",
					"step" : "any"*/
				
				/*
				 * "step":"0.01", "pattern":"[0-9]+([\.|,][0-9]+)?"
				 */
			
				};
				if (this.configData.readOnlyInd.trim().toUpperCase() == "Y"
						|| this.configData.readOnly == true) {
					amountConfig.readonly = "true"
				}

				if (this.decimallength === 0) {
					this.decimallength = 0;
				} else {
					this.decimallength = this.decimallength || 5;
				}
				this.integrallength = this.integrallength || 28;

				if (this.integrallength && this.decimallength) {
					this.maxLength = Number(this.decimallength)
							+ Number(this.integrallength) + 1 || 100;
				}
				amountConfig.maxlength = this.maxLength;
				this.amountFieldObject = new cbx.lib.layer(amountConfig);
				
				var tempAmountFieldContainer;
				if (!cbx.isEmpty(this.configData.linkedCurrComp)) {
					var amountFieldContainerConfig = {
						'eleType' : 'div',
						
						'class' : 'amountfieldcontainer',
						
						'id' : this.configData.itemId + '_ccycontainer'
					};
					var amountFieldContainer = new cbx.lib.layer(
							amountFieldContainerConfig);
					var curr = this.getLinkedCurrency();
					var currencyContainerConfig = {
						'eleType' : 'span',
						'id' : this.configData.linkedCurrComp,
						'class' : this.linkedCCyEnabled ? 'currencytype displayinline'
								: 'displayinline',
						'html' : this.linkedCCyEnabled ? curr : ''
					};
					if (this.configData.appendCurrMode === 'PRE_CODE') {
						currencyContainerConfig.style = {
								'padding-right': '10px'
							};
						this.linkedCCyContainer = new cbx.lib.layer(
								currencyContainerConfig).getLayer();
						amountFieldContainer.addLayer(this.linkedCCyContainer);
						amountFieldContainer.addLayer(this.amountFieldObject
								.getLayer());
					} else if (this.configData.appendCurrMode === 'SUF_CODE') {
						currencyContainerConfig.style = {
							'padding-left' : '10px'
						};
						this.linkedCCyContainer = new cbx.lib.layer(
								currencyContainerConfig).getLayer();
						amountFieldContainer.addLayer(this.amountFieldObject
								.getLayer());
						amountFieldContainer.addLayer(this.linkedCCyContainer);
					} else if (this.configData.appendCurrMode === 'PRE_SYM') {
						// Will be added in future enhancement
					} else if (this.configData.appendCurrMode === 'SUF_SYM') {
						// Will be added in future enhancement
					}
					else{
						amountFieldContainer.addLayer(this.amountFieldObject
								.getLayer());
					}
					tempAmountFieldContainer = amountFieldContainer.getLayer();
				} else {
					tempAmountFieldContainer = this.amountFieldObject
							.getLayer();
				}
				// commnted code of adding amount field to container
				// this.inputCmponentObject.addLayer(this.amountFieldObject.getLayer());
				
				this.inputCmponentObject.addLayer(tempAmountFieldContainer);
				setTimeout(function() {
					if (that.linkedCCyEnabled) {
						$(
								'#' + that.configData.itemId
										+ '_ccycontainer .ui-btn-shadow')
								.addClass('ccylinkedamount');
					}
				}, 200);
				if (this.configData.itemType !== "") {
					$(this.inputCmponentObject.getLayer()).on('input',function(e) {
						if(cbx.isEmpty(that.getValue())){
							that.getFormField().val("");
						}
					});
					
					/*$(this.amountFieldObject.getLayer()).on("change",
							function(evt) {
								that.setValue(that.getValue());
								that.syncModelData();
							});*/
					$(this.amountFieldObject.getLayer()).on("focus",
	                            function(evt) {
	                             var valueToSet=that.formManager.getModelData()[that.configData.itemId];
	                             that.getFormField().val(valueToSet);
	                            // this.type='number';
	                            });
	                 $(this.amountFieldObject.getLayer()).on("blur",
	                            function(evt) {
	                	 		//this.type='text';
	                             that.setValue(that.getValue());
	                             that.syncModelData();
	                            });
				}
				this.setFormField($(this.amountFieldObject.getLayer()));
				var amtValue = this.formManager.getModelData()[this.configData.itemId];
				if (!cbx.isEmpty(amtValue)) {
					that.setValue(amtValue);
				}
				if (this.configData.disabled == true) {
					this.disable();
				}
				this.registerDefaultValidation(this);
			},
			getValidationField : function() {
				return this.getFormField().parent();
			},
			syncModelData : function() {
				if (!cbx.isEmpty(this.getFormField().val())) {
					this.formManager.model.updateValue(this.configData.itemId,
							this.getRawValue(this.getFormField().val())); 
				} else {
					this.formManager.model.updateValue(this.configData.itemId,
							"");
				}
			},
			checkAmountInsideMaxLength : function(val) {
				var maxDigits = this.integrallength; 
				var maxDecimals = this.decimallength; 
				var amount_arr = val.split('.');
				if (amount_arr.length == 2) {
					if ((amount_arr[0].length <= maxDigits)
							&& (amount_arr[1].length <= maxDecimals)) {
						return true;
					} else {
						return false;
					}
				} else if (amount_arr.length == 1) {
					if (amount_arr[0].length <= maxDigits) {
						return true;
					} else {
						return false;
					}
				} else {
					this.formManager.markInvalid(this.configData.itemId,CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_FIELD'] ? CRB.getFWBundle()['ERR_INVALID_FIELD']:'ERR_INVALID_FIELD');
					return 'invalid';
				}
			},
			getComponentDOM : function() {
				this.updateSignDigits();
				return this.inputCmponentObject.getLayer();
			},
		
			// Created common logic to check whether the ccy is configured or
			// not for component
			getLinkedCurrency : function() {
				var currcmp = this.configData.linkedCurrComp;
				var curr;
				if (!cbx.isEmpty(currcmp)) {
					curr = this.formManager.model.getValue(currcmp);
				}
				if (cbx.isEmpty(curr)) {
					// get the default curr from preference.
					curr = iportal.systempreferences.getDefaultBankCCY();
					if (cbx.isEmpty(curr)) {
						// get the default curr configured in the
						// orbidirect properties.
						curr= cbx.globalcurrency.metadata.getDefaultCurrency();
					}
				}
				if (!cbx.isEmpty(curr)) {
					this.linkedCCyEnabled = true;
				}
				return curr;
			},
			
			/*
			 * Added a new api to update the signdigits based on the currency. -
			 * get the currency linked with the component through the linked
			 * source curr.
			 */
			updateSignDigits : function(config) {
			
				// commented code and moved the source to getLinkedCurrency() method
				/* 
				var currDecimalPlaceList = cbx.globalcurrency.metadata
				var currcmp = this.configData.linkedCurrComp;
				var curr;
				if (!cbx.isEmpty(currcmp)) {
					curr = this.formManager.model.getValue(currcmp);
				}
				if (cbx.isEmpty(curr)) {
				// 	get the default curr from preference.
					curr = iportal.systempreferences.getDefaultBankCCY();
					if (cbx.isEmpty(curr)) {
						// 	get the default curr configured in the
						// 	orbidirect properties.
						curr = cbx.globalcurrency.metadata.getDefaultCurrency();
					}
				} */
				var currDecimalPlaceList = cbx.globalcurrency.metadata
						.getCurrDecimalPlaceList();
				var curr = this.getLinkedCurrency();
				
				if (!cbx.isEmpty(curr)) {
					var currList = currDecimalPlaceList;
					var currBasedDecimal = currList[curr];
					this.signdigits = currBasedDecimal;
				
					var commonbundle = CRB.getFWBundle();
					
					this.maxLengthText = String.format(
							commonbundle['ERR_MAXLENGTH_EXCEED_AMOUNT'],
							this.label,
							parseInt(this.config.integrallength) + parseInt(1),
							this.config.decimallength);
				
				}
			},
			setValue : function(value) {
			
				if (this.linkedCCyEnabled) {
					var ccy = this.formManager.model
							.getValue(this.configData.linkedCurrComp);
					if (!cbx.isEmpty(ccy)) {
						/*$('#' + this.configData.linkedCurrComp).text(ccy);*/
						$('span#'+this.configData.linkedCurrComp+" .currencytype").text(ccy);
					}
				}
				
				this.updateSignDigits(); // calling the api
				// to update the
				// this.signdigits.
				
				try {
					
					if (value != null && value != '') {
						val = value.trim();
						val = val.replace(/,/g, "");
					} else {
						val = null;
					}
				}
				
				catch (err) {
					val = '';
				}
				
				var that = this;
				var crb = CRB.getFWBundle();
				if (val === null || val === '') {
					that.getFormField().val(val);
					if (that.configData.requiredInd === 'Y') {
						that.formManager
								.markInvalid(
										that.configData.itemId,
										String
												.format(
														(crb['ERR_MANDATORY'] || "cannot be empty"),
														that.plainLabel));
					} else {
						that.clearInvalid();
					}
					that.model.updateField(that.configData.itemId,val);
					return;
				}
				
				var valToSet = val.replace(/,/g, "");
				// to update the
				// model without
				// comma seperator

				var crb = CRB.getFWBundle();
				var res = that.checkAmountInsideMaxLength(val);
				if (res === 'invalid') {
					
					that.getFormField().val(val);
					this.formManager
							.markInvalid(that.configData.itemId,that.configData.itemId,CRB.getFWBundle() && CRB.getFWBundle()['ERR_INVALID_AMOUNT'] ? CRB.getFWBundle()['ERR_INVALID_AMOUNT']:'ERR_INVALID_AMOUNT');
					return;
					
				}
				if (!res) {
					
					that.getFormField().val(val);
					
					that.formManager.markInvalid(that.configData.itemId,
							that.maxLengthText);
					return;
				}
				if (val === '') {
					if (that.config.requiredInd === 'Y')
					
					{
						
						that.getFormField().val(val);
						
						that.formManager
								.markInvalid(
										that.configData.itemId,
										String
												.format(
														(crb['ERR_MANDATORY'] || "cannot be empty"),
														that.plainLabel));
						return;
					} else {
						that.getFormField().val(val);
						return;
					}
					
				} else {
					that.clearInvalid(that.configData.itemId);
					var StringNumber = canvas.amountFormatter.getInstance();
                    val=StringNumber.basicFormatter(valToSet, this.signdigits);
				}
				var valueToSet=this.getRawValue(val);
                that.model.updateField(that.configData.itemId,valueToSet);
                if (that.checkAmountInsideMaxLength(valueToSet)) { 
                    that.clearInvalid(that.configData.itemId);
                }
                if(cbx.isFireFox())
                {
                    that.getFormField().val(valueToSet);
                }
                else
                {
				that.getFormField().val(val);
                }
				
			},
			/**
			 * returns the value without seperators
			 */
			getRawValue : function(formattedVal)
	            {
	                var returnVal;
	                var amtFormatJson = iportal.preferences.getAmountFormatJson();
	                        var groupSep=amtFormatJson.groupSeparator;
	                        if(groupSep=="S")
	                            groupSep=" ";
	                        var decSep=amtFormatJson.decimalSeparator;                       
	                        if(decSep=="S")
	                            decSep=" ";
	                        if(cbx.isEmpty(formattedVal))
	                            returnVal="";
	                        else
	                            returnVal=formattedVal.split(groupSep).join("").split(decSep).join(".");
	                 return returnVal;
	            },
			format : function() {
				var val = that.getFormField.val();
				var StringNumber = canvas.amountFormatter.getInstance();
				this.setValue(StringNumber.basicFormatter(that.getRawValue(val),
						this.signdigits));
			},
			getValue : function() {
				return this.getFormField().val();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-amountfield'
}, cbx.lib.formElement.cbxAmountField);

/*
 * This class is responsible for creating the Browse Button of form
 * 

 */
cbx.lib.formElement.cbxBrowseButton = Class(
		cbx.core.Component,
		{
			browseButtonConfigData : '',
			isFormField : true,
			canValidate : false,
			constructor : function(config) {
				cbx.lib.formElement.cbxBrowseButton.$super.call(this);
				this.browseButtonConfigObject = '';
				this.browseButtonConfigData = config;
				this.label = this.getDisplayNameKey(this.browseButtonConfigData).replace(/\*/g, '');
				this.formConfigObject = '';
				this.createBrowseButton();
				this.setEleType("N", config);
				;
			},
			createBrowseButton : function() {
				var displayLabelName;
				var formConfig = {
					"eleType" : "div",
					"id" : this.browseButtonConfigData.itemId,
					"style" : {
						"display" : (typeof this.browseButtonConfigData.visibleInd !== 'undefined' && this.browseButtonConfigData.visibleInd
								.trim().toUpperCase() === 'N') ? "none" : ""
					}
				};
				if (typeof this.browseButtonConfigData.displayNmKey !== 'undefined'
						&& this.browseButtonConfigData.displayNmKey.trim() !== '') {

					/* Getting the reference of resource bundle and using */
					// var commonbundle = CRB.getFWBundle();
					/*
					 * var bundle; bundle =
					 * IRB.getBundle(cbx.jsutil.getBundleKey(this));
					 * displayLabelName = bundle['LBL_' +
					 * this.browseButtonConfigData.displayNmKey];
					 */

					displayLabelName = this.browseButtonConfigData.displayNmKey;// localization
					// need
					// to
					// be
					// done
				} else {
					displayLabelName = this.browseButtonConfigData.plainLbl;
				}
				browseButtonConfig = {
					"eleType" : "input",
					"html" : displayLabelName,
					"type" : "file",
					"id" : this.browseButtonConfigData.itemId + "_field",
					"class" : "cbx-browsebutton"
				};
				this.formConfigObject = new cbx.lib.layer(formConfig);
				// Instantiates label control
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
						this.browseButtonConfigData);
				this.formConfigObject.addLayer(cbxLabelObj.getLabelDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');
				this.browseButtonConfigObject = new cbx.lib.layer(
						browseButtonConfig);
				this.formConfigObject.addLayer(this.browseButtonConfigObject
						.getLayer());
				if (typeof this.browseButtonConfigData.editableInd !== 'undefined'
						&& this.browseButtonConfigData.editableInd.trim()
								.toUpperCase() === 'N') {
					browseButtonConfig['disabled'] = "true";
				}
				this.addItem(this.formConfigObject.getLayer());
			},
			// Returns the DOM object of browse button
			getComponentDOM : function() {
				return this.formConfigObject.getLayer();
			},
			getValidationField : function() {
				return this.getFormField();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-browsebutton'
}, cbx.lib.formElement.cbxBrowseButton);
/*
 * This class is responsible for creating the Button field of form
 * 
 
 */


cbx.lib.formElement.cbxButton = Class(
		cbx.core.Component,
		{
			buttonConfigData : '',
			isFormField : true,
			disabled : false,
			ctlCls : "cbx-button",
			canValidate : true,
			constructor : function(config) {
				cbx.apply(this, config);
				cbx.lib.formElement.cbxButton.$super.call(this);
				this.xtype = config.xtype || "";
				this.buttonConfigData = config;
				this.anchor = config.anchor;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.itemId = config.itemId;
				this.createButton();
				if (this.buttonConfigData.disabled === true) {
					this.disable();
				}
				this.setEleType("N", config);
				;
			},
			createButton : function() {
				var displayLabelName;
			
				if (this.buttonConfigData.className !== 'undefined'
						&& this.buttonConfigData.className !== '') {
					this.ctlCls = this.buttonConfigData.className;
				}
				if (this.buttonConfigData.disabled) {
					this.ctlCls = this.ctlCls + ' ui-disabled';
				}
				
				var buttonConfig = {
					"eleType" : "a",
					"href" : "",
					"data-role" : "button",
					'class' : 'jqm-form-field-c jqm-cbxButton',
					"html" : this.getDisplayNameKey(this.buttonConfigData),
					"id" : this.buttonConfigData.itemId,
					"style" : {/*
								 * "display" : (typeof
								 * this.buttonConfigData.visibleInd !==
								 * 'undefined' &&
								 * (this.buttonConfigData.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.buttonConfigData.hidden==true)) ? "none" :
								 * "block"
								 */}
				};
				if (this.buttonConfigData.disabled) {
					buttonConfig.disabled = true;
				}

				if (this.compositeField) {
					buttonConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.buttonConfigData.visibleInd !== 'undefined'
						&& (this.buttonConfigData.visibleInd.trim()
								.toUpperCase() === 'N' || this.buttonConfigData.hidden == true)) {
					buttonConfig["class"] = "btnCls jqm-display-hide";

				}

				this.buttonConfigObject = new cbx.lib.layer(buttonConfig);
				var temp = this.buttonConfigObject.getLayer();
				var that = this;
				if (!this.disabled) {
					$(temp).on(
							'click',
							function(event) {
								that.buttonConfigData.fm.handlerEvent(
										'cbxclick',
										that.buttonConfigData.itemId);
							})
				}
				this.buttonConfigObject.setLayer(temp);
				this.addItem(this.buttonConfigObject.getLayer());
				this.setFormField($(temp));
			},
			afterShow : function() {
				$(this.getComponentDOM()).css("display","");				
			},
			getComponentDOM : function() {
				return this.buttonConfigObject.getLayer();
			},
			disable : function() {
				$(this.getComponentDOM()).addClass('ui-disabled');
			},
			enable : function() {
				$(this.getComponentDOM()).removeClass('ui-disabled');
			},
			getValidationField : function() {
				return this.getFormField();
			}
		

			,
			setValue : function(value) {

				$('#' + this.buttonConfigData.itemId + ' .ui-btn-text').text(
						value);

			}
		

		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-button'
}, cbx.lib.formElement.cbxButton);

/*
 * This class is reponsible for creating the Check box group buttons

 */



/*
 * cbx.lib.formElement.cbxCheckBoxGroup = Class( cbx.core.Component, {
 * checkBoxButtons : '', checkBoxConfigObject : '', checkBoxObject : '',
 * isFormField : true, dataType : 'horizontal', rawKeysArray : null,
 * rawValuesArray : null, formManager : null, constructor : function(config) {
 * cbx.lib.formElement.cbxCheckBoxGroup.$super.call(this);
 * this.checkBoxConfigObject = config; this.formManager = config.fm;
 * this.createCheckBoxItems(); this.addItem(this.checkBoxObject.getLayer()); },
 * createCheckBoxItems : function() { var that = this; var checkBoxConfig;
 * checkBoxConfig = { "eleType" : "fieldset", "data-role" : "controlgroup", "id" :
 * this.checkBoxConfigObject.itemId }; this.checkBoxObject = new
 * cbx.lib.layer(checkBoxConfig);
 * 
 * var checkBoxLabel = new
 * cbx.lib.formElement.cbxLabel(this.checkBoxConfigObject).getComponentDOM();
 * this.checkBoxObject.addLayer(checkBoxLabel);
 * 
 * var rawKeys = this.checkBoxConfigObject.rawKeys; var modelRawKeys =
 * this.formManager.model.getModelData()[this.checkBoxConfigObject.itemId]; var
 * modelRawKeysArray = new Array(); if (typeof modelRawKeys !== 'undefined' &&
 * modelRawKeys !== '' && modelRawKeys !== undefined) { modelRawKeysArray =
 * modelRawKeys.split(','); } if (typeof rawKeys !== 'undefined') { if (typeof
 * rawKeys == 'object') { this.rawKeysArray = rawKeys; } else this.rawKeysArray =
 * rawKeys.split(','); for ( var r = 0; r < this.rawKeysArray.length; r++) { var
 * checkBoxButtonConfig; var checkBoxButtonObject; checkBoxButtonConfig = {
 * "eleType" : "input", "type" : "checkbox", "id" :
 * this.checkBoxConfigObject.itemId + '_field', "name" :
 * this.checkBoxConfigObject.itemId + '_field' }; if (modelRawKeysArray.length >
 * 0 && modelRawKeysArray .indexOf(this.rawKeysArray[r]) !== -1) {
 * checkBoxButtonConfig['checked'] = true; } checkBoxButtonObject = new
 * cbx.lib.layer( checkBoxButtonConfig).getLayer(); checkBoxButtonObject.onclick =
 * function(event) { var temp = that.checkBoxConfigObject.itemId;
 * that.handleCheckBoxClick(); };
 * this.checkBoxObject.addLayer(checkBoxButtonObject); if (typeof
 * this.rawKeysArray[r] !== 'undefined' && this.rawKeysArray[r].trim() !== '') {
 * var labelConfig = new cbx.lib.formElement.cbxLabel( { "displayNmKey" :
 * this.rawKeysArray[r], "itemId" : this.checkBoxConfigObject.itemId,
 * "bundleKey" : this.checkBoxConfigObject.bundleKey, "requiredInd" :
 * this.checkBoxConfigObject.requiredInd, "customConditionalOPCls" : "mandatory"
 * }); this.checkBoxObject.addLayer(labelConfig .getComponentDOM()); } } } CH-01
 * ends }, handleCheckBoxClick : function() { var tempCBElements = $('#' +
 * this.checkBoxConfigObject.itemId) .find("input[type='checkbox']"); if (typeof
 * tempCBElements !== 'undefined' && tempCBElements !== undefined &&
 * tempCBElements.length) { var selectedCBArray = new Array(); for ( var cb = 0;
 * cb < tempCBElements.length; cb++) { if (tempCBElements[cb].checked) {
 * selectedCBArray.push(this.rawKeysArray[cb]); } }
 * this.formManager.model.updateValue( this.checkBoxConfigObject.itemId,
 * selectedCBArray .toString(), true); } }, getComponentDOM : function() {
 * return this.checkBoxObject.getLayer(); } });
 */

cbx.lib.formElement.cbxCheckBoxGroup = Class(
		cbx.core.Component,
		{
			isFormField : true,
			canValidate : true,
			constructor : function(config) {
				cbx.lib.formElement.cbxCheckBoxGroup.$super.call(this);
				this.conf = config;
				this.anchor = config.anchor;
				this.xtype = config.xtype || "";
				this.frmManager = config.fm;
				this.setEleType("N", config);
				;
				this.itemId = config.itemId;
				this.label = this.getDisplayNameKey(this.conf).replace(/\*/g, '');
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.model = this.conf.model;
				this.modelData = this.model.getModelData();

				// Attr's
				this.plainLabel = this.conf.plainLbl;
				this.displayName = this.conf.displayNmKey;
				this.isVisible = this.conf.visibleInd === 'Y' ? false : true;
				this.isRequired = this.conf.requiredInd;
				this.isReadOnly = this.conf.readOnlyInd === 'Y' ? true : false;
				this.fieldset = '';
				this.rawKeys = config.rawKeys;
				this.rawValues = config.rawValues;
				this.bundleKey = config.bundleKey || "";
				this.createGroup();
				this.valuesArray = [];
				this.addItem(this.fieldset.getLayer());
				var that = this;
				$('body')
						.delegate(
								'input:checkbox[name="' + this.conf.itemId
										+ '"]',
								'change',
								function(e) {
									// e.stopPropagation();
									
									var selectedCBArray = [];
									$(
											'#' + that.conf.itemId
													+ ' input[type=checkbox]')
											.each(
													function() {
														if ($(this).attr(
																'cbx-type') === "formField_CHECKBOX_GROUP"
																&& ($(this)
																		.prop(
																				'checked') == true || $(
																		this)
																		.attr(
																				'checked') == true)) {
															selectedCBArray
																	.push($(
																			this)
																			.val());
														} else {
															selectedCBArray
																	.push("");
														}
													});
									if (selectedCBArray.length > 0) {
										that.model.updateValue(
												that.conf.itemId,
												selectedCBArray.toString());
								}
							});
				  var checkboxGroupRender=false;
				   $(document).on("formPanelRender",function(){
					   setTimeout(function(){
						   if(!checkboxGroupRender){
							   checkboxGroupRender=true;
							   $('input:checkbox[name="' + that.conf.itemId + '"]').on(
										   'change',
										   function(e) {
												 e.stopPropagation();
												var selectedCBArray = [];
												$(
															'#' + that.conf.itemId
															+ ' input[type=checkbox]')
															.each(
																		function() {
																			if ($(this).attr(
																			'cbx-type') === "formField_CHECKBOX_GROUP"
																				&& ($(this)
																							.prop(
																							'checked') == true || $(
																										this)
																										.attr(
																										'checked') == true)) {
																				selectedCBArray
																				.push($(
																							this)
																							.val());
																			} else {
																				selectedCBArray
																				.push("");
																			}
																		});
												if (selectedCBArray.length > 0) {
													that.model.updateValue(
																that.conf.itemId,
																selectedCBArray.toString());
												}
											});
									}
					   },150);
								});

			},
			createGroup : function() {
				formConfig = {
					'eleType' : 'div',
					'data-role' : 'controlgroup',
					'class' : 'jqm-form-field-c jqm-cbxCheckBoxGroup',
					'id' : this.conf.itemId,
					'style' : {/*
								 * 'display' : (this.isVisible ||
								 * this.conf.hidden==true) ? 'none' : 'block'
								 */}
				};

				if (this.compositeField) {
					formConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.conf.visibleInd !== 'undefined'
						&& (this.conf.visibleInd.trim().toUpperCase() === 'N' || this.conf.hidden == true)) {
					formConfig["class"] = "checkBoxCls jqm-display-hide";

				}
				this.fieldset = new cbx.lib.layer(formConfig);

				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.conf);
				this.fieldset.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');

				var str = '';
				var md = this.conf;
				var readOnlyInd = "";
				var rawValues = this.rawValues;
				var rawKeys = this.rawKeys;
				if (md.readOnlyInd === 'Y' || md.readOnly || md.disabled) {
					readOnlyInd = 'disabled="disabled"';
				}
				if (rawKeys.length == rawValues.length) {

					var rb = CRB.getBundle(cbx.jsutil.getBundleKey(this));
					var valArray = this.parseRawData(
							this.modelData[this.conf.itemId], true);
					for ( var i = 0; i < rawKeys.length; i++) {

						if (valArray.length > 0
								&& valArray.contains(rawValues[i])) {

							str += '<input class="" type="checkbox"  checked=true '
									+ readOnlyInd
									+ ' cbx-type="formField_'
									+ md.itemType
									+ '" name='
									+ md.itemId
									+ ' id='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ ' value='
									+ rawValues[i]
									+ ' />'
									+ '<label for='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ '>'
									+ (rb && rb['LBL_' + rawKeys[i]] ? rb['LBL_'
											+ rawKeys[i]]
											: rawKeys[i]) + '</label>';
						} else {
							str += '<input class="" type="checkbox"   '
									+ readOnlyInd
									+ ' cbx-type="formField_'
									+ md.itemType
									+ '" name='
									+ md.itemId
									+ ' id='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ ' value='
									+ rawValues[i]
									+ ' />'
									+ '<label for='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ '>'
									+ (rb && rb['LBL_' + rawKeys[i]] ? rb['LBL_'
											+ rawKeys[i]]
											: rawKeys[i]) + '</label>';

						}

					}

				} else {
					str = {
						'eleType' : 'span',
						'class' : this.ctlCls
					};
				}

				$(this.fieldset.getLayer()).append(str);
				this.setFormField($(str));

			},

			setValue : function(val) {
				var that = this;
				if (cbx.isArray(val)) {
					this.valuesArray = val;
				} else {
					this.parseRawData(val, false);
				}
				var value = this.getItemValue() || val;
				if (!cbx.isEmpty(value)) {
					for ( var i = 0; i < value.length; i++) {
						$(
								'input:checkbox[name="' + that.conf.itemId
										+ '"][value="' + value[i] + '"]').prop(
								'checked', true);
						$('input:checkbox[name="' + that.conf.itemId + '"]')
								.checkboxradio("refresh");
					}
				}

			},
			getValidationField : function() {
				return $($(this.getComponentDOM()).find('label').get(1));
			},
			parseRawData : function(val, set) {
				var sArray = [];
				if (val != "" && val != null) {
					val = val + '';
					var splitValue = val.split(',');
					for ( var i = 0; i < splitValue.length; i++) {
						sArray.push(splitValue[i]);
					}
				}
				if (set) {
					return sArray;
				}
				this.valuesArray = sArray;
			},
			// Getting the rawValues array
			getValuesArray : function() {
				return this.valuesArray;
			},
			/**
			 * Method checks for the default item value exists.
			 */
			getItemValue : function() {
				var valArray = this.getValuesArray();
				var dataArray = [];
				if (this.rawKeys != null && this.rawValues != null) {
					for ( var i = 0; i < this.rawKeys.length; i++) {
						if (valArray.length > 0
								&& valArray.contains(this.rawValues[i])) {
							dataArray.push(this.rawValues[i]);
						}
					}
				}
				return dataArray;
			},
			getValue : function() {
				return this.getFormField().val();
			},
			getComponentDOM : function() {

				return this.fieldset.getLayer();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-checkboxgroup'
}, cbx.lib.formElement.cbxCheckBoxGroup);

/*
 * This class is reponsible for creating the combo box 
 */



cbx.lib.formElement.cbxComboBox = Class(
		cbx.core.Component,
		{
			comboBoxObject : '',
			comboBoxConfigObject : '',
			comboBoxData : '',
			canValidate : true,
			isFormField : true,
			config : {},
			comboBoxSelectObj : null,
			formManager : null,
			constructor : function(config) {
				cbx.apply(this, config);
				this.config = config;
				this.triggerField = true;
				cbx.lib.formElement.cbxComboBox.$super.call(this);
				this.comboBoxConfigObject = config;
				this.xtype = config.xtype;
				this.anchor = config.anchor;
				this.itemId = config.itemId;
				this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.comboBoxData = config.addData || [];
				this.formManager = config.fm;
				this.required = config.requiredInd;
				this.includeSelect = config.includeSelectInd === 'Y' ? true
						: false;
				this.includeSelectOnSingleValue = this.includeSelect;
				this.bundleKey = config.bundleKey || "";
				this.createComboBox();
				this.setEleType("N", config);
				;
				this.addItem(this.comboBoxObject.getLayer());
				if (this.comboBoxConfigObject.readOnlyInd.trim().toUpperCase() == "Y"
						|| this.comboBoxConfigObject.readOnly == true
						|| this.comboBoxConfigObject.disabled == true) {
					this.disable();
				}
				this
						.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);
			},
			createComboBox : function() {
				var commonBundle = CRB.getFWBundle();
				var comboBoxOptionConfig;
				var comboBoxOptionObj;
				var comboBoxSelectConfig;
				var isDefault;
				var displayLabelName;
				comboBoxConfig = {
					"eleType" : "div",
					"id" : this.comboBoxConfigObject.itemId,
					"data-role" : "fieldcontain",
					"class" : 'jqm-form-field-c jqm-cbxComboBox',
					"style" : {/*
								 * display : (typeof
								 * this.comboBoxConfigObject.visibleInd !==
								 * 'undefined' &&
								 * (this.comboBoxConfigObject.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.comboBoxConfigObject.hidden == true)) ?
								 * "none" : "block"
								 */}
				};
				if (this.compositeField) {
					comboBoxConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.comboBoxConfigObject.visibleInd !== 'undefined'
						&& (this.comboBoxConfigObject.visibleInd.trim()
								.toUpperCase() === 'N' || this.comboBoxConfigObject.hidden == true)) {
					comboBoxConfig["class"] = "comboCls jqm-display-hide";

				}
				this.comboBoxObject = new cbx.lib.layer(comboBoxConfig);
				// Instantiates label control
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
						this.comboBoxConfigObject);
				this.comboBoxObject.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');
				this.blankText = String.format(
						commonBundle['ERR_MANDATORY_SELECT'], this.label);
				// Creates select tag for the combo box
				comboBoxSelectConfig = {
					"eleType" : "select",
					"id" : this.comboBoxConfigObject.itemId + '_field',
					"cbx-type" : "formField_"
							+ this.comboBoxConfigObject.itemType,
					"name" : this.comboBoxConfigObject.itemId,
					"class" : "cbx-combobox"
				};

				this.comboBoxSelectObj = new cbx.lib.layer(comboBoxSelectConfig);
				var that = this;
				// By default select component in mobile focuses to first
				// option,hence making select place holder as default
				// if (typeof this.comboBoxConfigObject.includeSelectInd !==
				// 'undefined' &&
				// this.comboBoxConfigObject.includeSelectInd.trim().toUpperCase()
				// === 'Y'){
				var comboBoxOptionConfig = {
					"eleType" : "option",
					"value" : ' ',
					"html" : commonBundle['LBL_SELECT'],
					"data-placeholder" : "true"
				};
				comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
				this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());

				// Get the value of the combobox from model
				var defaultValue = this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId];
				if (typeof this.comboBoxData !== 'undefined') {
					// Gets the combo box values and appends to the select tag
					for ( var i = 0; i < this.comboBoxData.length; i++) {
						var comboBoxOptionConfig = {
							"eleType" : "option",
							"value" : this.comboBoxData[i].rawKey,
							"html" : this.comboBoxData[i].rawValue
						};
						if (defaultValue === this.comboBoxData[i].rawKey) { /*
																			 * If
																			 * the
																			 * key
																			 * of
																			 * the
																			 * combobox
																			 * is
																			 * equal
																			 * to
																			 * the
																			 * default
																			 * value
																			 * in
																			 * model
																			 * obj,
																			 * setting
																			 * the
																			 * value
																			 * as
																			 * default
																			 * value
																			 */
							comboBoxOptionConfig['selected'] = 'selected';
						}
						else if(this.selectSingleValue && this.comboBoxData.length==1){
							this.formManager.model.updateValue(that.comboBoxConfigObject.itemId, this.comboBoxData[i].rawKey, true);	
						}
						else if(!cbx.isEmpty(this.selectFirstValue) && this.selectFirstValue===true && i==0){
							comboBoxOptionConfig['selected'] = 'selected';
							this.formManager.model.updateValue(that.comboBoxConfigObject.itemId, this.comboBoxData[i].rawKey, true);
						}
						comboBoxOptionObj = new cbx.lib.layer(
								comboBoxOptionConfig);
						this.comboBoxSelectObj.addLayer(comboBoxOptionObj
								.getLayer());
					}
					$('#' + this.comboBoxConfigObject.itemId + '_field')
							.selectmenu("refresh");
				}
				this.comboBoxObject.addLayer(this.comboBoxSelectObj.getLayer());
				$(this.comboBoxSelectObj.getLayer()).on(
						'change',
						this,
						function(event) {
							that.clearInvalid();
							that.formManager.model.updateValue(
									that.comboBoxConfigObject.itemId, that
											.getValue(), true);
						});
				this.setFormField($(this.comboBoxSelectObj.getLayer()));
				this.registerDefaultValidation(this);
			},
			removeComboStore : function() {
				this.getFormField().empty();
				this.getFormField().selectmenu("refresh");

			},
			getValidationField : function() {
				return this.getFormField().parent();
			},

			updateComboRawStore : function(valueArr, keyArr) {
				var combundle = CRB.getFWBundle();
				var dataObj;
				var defaultValue;
				this.removeComboStore();
				if (keyArr.length !== valueArr.length) {
					// keys and values should be arrays of same length
					return;
				}
				/*
				 * var comboBoxOptionConfig = { "eleType" : "option", "value" : ' ',
				 * "html" : 'Select', "data-placeholder" : "true" }; var
				 * comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
				 * this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());
				 */

				if (cbx.core.isArray(keyArr) && cbx.core.isArray(valueArr)) {
					var fieldObj = $('#' + this.comboBoxConfigObject.itemId
							+ '_field');

					if (this.includeSelect
							&& (keyArr.length > 0 || this.includeSelectOnSingleValue)) {
						var dataObj = {
							rawValue : ' ',
							rawKey : combundle['LBL_SELECT']
						
						};
						fieldObj.append(new Option(dataObj['rawKey'],
								dataObj['rawValue']));
						this.comboBoxData.push(dataObj);
					} else {
						var dataObj = {
							rawValue : '',
							rawKey : ''
						};
						var placeHolder = new Option(dataObj['rawKey'],
								dataObj['rawValue']);
						placeHolder.setAttribute("data-placeholder", 'true');
						placeHolder.setAttribute("style", "display:none");
						fieldObj.append(placeHolder);
						
						this.comboBoxData.push(dataObj);
					}
					for ( var i = 0; i < keyArr.length; i++) {
						if (this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId] == valueArr[i]) {
							fieldObj
									.append(new Option(keyArr[i], valueArr[i])/*
																				 * .setAttribute("selected",
																				 * "selected"
																				 */);
							defaultValue = valueArr[i];
						} else {
							fieldObj.append(new Option(keyArr[i], valueArr[i]));
						}
						dataObj = {
							rawKey : valueArr[i],
							rawValue : keyArr[i]
						};
						this.comboBoxData.push(dataObj);
					}
					if (this.includeSelect
							&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
						this.setSelect();
					}
					/*
					 * 
					 * 
					 * 
					 * Included the following condition just to make sure
					 * 
					 * 
					 * 
					 * that 'Select' gets selected by default in the Combo
					 * 
					 * 
					 * 
					 * when the length is 1
					 * 
					 * 
					 * 
					 */
					if (keyArr.length == 1) {
						if (this.includeSelectOnSingleValue) {
							this.setValue(' ');
							/*
							 * 
							 * 
							 * 
							 * if(this.fireEventOnSingleSelect){
							 * 
							 * 
							 * 
							 * this.fireEvent('select',this); }
							 * 
							 * 
							 * 
							 */
						} else {
							/**
							 * Updating the model as per Ext FW Updates only if
							 * init select and length == 1
							 */
							
							this.selectValue(valueArr[0], true); 
							// this.setValue(keyArr[0]);
							if (this.fireEventOnSingleSelect) {
								
								// this.fireEvent('select', this);
								this.syncModelData();
								
							}
						}
					}
				}
				$('#' + this.comboBoxConfigObject.itemId + '_field')
						.selectmenu();
				if (!cbx.isEmpty(defaultValue)) {
					/**
					 * Not updating the model for default value
					 */
					this.selectValue(defaultValue, false); 
				}
 				else
					{
						if (this.selectSingleValue && valueArr.length == 1)
						{
							defaultValue = valueArr[0];
						}
						else if (this.selectFirstValue && this.selectFirstValue === true)
						{
							defaultValue = valueArr[0];
						}
						this.selectValue(defaultValue, false);
						this.syncModelData();

					}
				this.clearInvalid();
			},
			setSelect : function() {
				if (this.includeSelect) {
					this.selectValue(' ', false); 
				} else {
					this.selectValue('', false); 
				}
				this.validateCombo();
			},
			/**
			 * function to validate a combobox
			 */
			validateCombo : function() {
				combundle = CRB.getFWBundle();
				if (this.isSelectSelected() && this.required === 'Y') {
					// Showing the quick tip error indicator if the
					// field is null on mandatory
					this.markInvalid(this.blankText);
				}
			},
			/**
			 * function to check Select option has been selected
			 */
			isSelectSelected : function() {

				var returnFlag = (this.getValue() == ' ' || this.getValue() == 'Select') ? true
						: false;
				return returnFlag;
			},
			
			rePopulateAdditionaldata : function(addData) {
				var commonBundle = CRB.getFWBundle();
				this.comboBoxData = addData;
				this.removeComboStore();
				if(this.includeSelect){
				var comboBoxOptionConfig = {
					"eleType" : "option",
					"value" : ' ',
					"html" : commonBundle['LBL_SELECT'],
					"data-placeholder" : "true"
				};
				comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
				this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());
				}
				$('#' + this.comboBoxConfigObject.itemId + '_field')
						.selectmenu("refresh");
				for ( var i = 0; i < this.comboBoxData.length; i++) {
					var comboBoxOptionConfig = {
						"eleType" : "option",
						"value" : this.comboBoxData[i].rawKey,
						"html" : this.comboBoxData[i].rawValue
					};
					/*
					 * if
					 * (this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]
					 * === this.comboBoxData[i].rawKey) { If the key of the
					 * combobox is equal to the default value in model obj,
					 * setting the value as default value
					 * 
					 * comboBoxOptionConfig['selected'] = 'selected'; }
					 */
					comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
					this.comboBoxSelectObj.addLayer(comboBoxOptionObj
							.getLayer());
				}
				$('#' + this.comboBoxConfigObject.itemId + '_field')
						.selectmenu("refresh");
				this
						.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);

			},
			populateAddData : function(items, rawType) {
				var rawDataArray = [];
				if (items != "" && items != null) {
					for ( var i = 0; i < items.length; i++) {
						rawDataArray.push(items[i][rawType]);
					}
				}
				return rawDataArray;
			},
		
			// Returns the DOM object of combobox
			getComponentDOM : function() {
				return this.comboBoxObject.getLayer();
			},
			selectValue : function(value, evtReq) { 
				var queryselector = "option[value='" + value + "']";
				var option;
				
				this.getFormField().selectmenu();
				if (value == ' ') {
					option = this.getFormField().find('option[value=" "]');
					this.getFormField().val(value);
				} else {
					option = this.getFormField().find(queryselector);
					option.attr('selected', 'selected');
				}
			
				this.getFormField().selectmenu("refresh");
				
				if (evtReq) {
					this.getFormField().trigger('change');
				}
				
			},
			setValue : function(value) {
				if (this.comboBoxData && cbx.isArray(this.comboBoxData)) {
					for ( var i = 0; i < this.comboBoxData.length; i++) {
						if (this.comboBoxData[i].rawKey == value) {
							this.getFormField()
									.val(this.comboBoxData[i].rawKey);
							$('#' + this.comboBoxConfigObject.itemId + '_field')
									.selectmenu("refresh");
							return;
						}
					}
					for ( var i = 0; i < this.comboBoxData.length; i++) {
						if (this.comboBoxData[i].rawValue == value) {
							this.getFormField()
									.val(this.comboBoxData[i].rawKey);
							$('#' + this.comboBoxConfigObject.itemId + '_field')
									.selectmenu("refresh");
							return;
						}
					}
					
				}
				/*
				 * CTMQ315F011
				 */
				/*if (value == " " || value == "") {
					this.selectValue(value, false);
					
				}*/
				this.syncModelData(); 
			},
			getValue : function() {
				return this.getFormField().val();
			},
			getDisplayValue : function(rawKey) {
				var retVal = '';
				if( !cbx.isEmpty(this.comboBoxData) ){
					for ( var i = 0; i < this.comboBoxData.length; i++) {
						if (this.comboBoxData[i].rawKey == rawKey) {
							retVal = this.comboBoxData[i].rawValue;
							break;
						}
					}
				}
				return retVal;
			},
			syncModelData : function() {
				
				if (!cbx.isEmpty(this.config.multiInd)
						&& this.config.multiInd == true
						&& !cbx.isEmpty(this.config.index)) {
					if (this.formManager.handlerEvent('cbxvalidate',
							this.config.itemId, this.getValue(), this.index,
							this.multiFormId) === false) {
						return;
			}
				} else if (this.formManager.handlerEvent('cbxvalidate',
						this.config.itemId, this.getValue()) === false) {
					return;
				}
				if (!cbx.isEmpty(this.config.multiInd)
						&& this.config.multiInd == true
						&& !cbx.isEmpty(this.config.index)) {
					this.formManager.model.updateValue(this.config.itemId, this
							.getValue(), undefined, this.index,
							this.multiFormId);
				
					/*
					 * Textfield updateValue will be called upon actual value
					 * change only
					 */
				} else if (this.formManager.model.getValue(this.config.itemId) !== this
						.getValue()) {
					this.formManager.model.updateValue(this.config.itemId, this
							.getValue());
				}
				this.formManager.clearInvalid(this.itemId);
			
				// this.formManager.updateScreenViewData(this.formManager);
			

			},
			/**
			 * Intended to get the count of store in a combo.
			 */
			getStoreCount:function(){
				return this.comboBoxData.length;
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-combobox'
}, cbx.lib.formElement.cbxComboBox);
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-autoSuggestCombo'
}, cbx.lib.formElement.cbxComboBox);


cbx.lib.formElement.cbxCompositeField = Class(
		cbx.core.Component,
		{
			formManager : null,
			isFormField : false,
			canValidate : false,
			constructor : function(config) {
				cbx.lib.formElement.cbxCompositeField.$super.call(this);
				this.formManager = config.fm;
				this.itemAnchor = 0;
				this.xtype = config.xtype || "";
				this.anchor = config.anchor;
				this.setEleType("S", config);
				this.createCompositFieldSet(config);
				this.addItem(this.compositFieldObject.getLayer());
			},
			createCompositFieldSet : function(config) {
				var displayLabelName;
				this.compositFieldSetData = config;
				var compositConfig = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"id" : this.compositFieldSetData.itemId,
					"class" : "cbx-compositefield"
				};
				var showFlag = true;
				if (typeof this.compositFieldSetData.visibleInd !== 'undefined'
						&& (this.compositFieldSetData.visibleInd.trim()
								.toUpperCase() === 'N' || this.compositFieldSetData.hidden == true)) {
					compositConfig["class"] = compositConfig["class"]
							+ " ui-field-contain ui-body jqm-display-hide";
					showFlag = false;
				}
				this.compositFieldObject = new cbx.lib.layer(compositConfig);
				if (!showFlag) {
					$(this.compositFieldObject.getLayer()).hide()
				}
				var compositWrapConfig = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"id" : this.compositFieldSetData.itemId + "_wrap",
					"class" : "cbx-compositefield_wrap"

				};

				this.compositFieldWrapObject = new cbx.lib.layer(
						compositWrapConfig);
				this.compositFieldSetData.hideLabelInd = "N";// Hardcoded as
				// hidelabel not
				// working in
				// ext version
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
						this.compositFieldSetData);
				/**
				 * Added TO support wrong configuration for  Demo
				 * hideLabel is Y,yet display nm key is being processed in
				 * retail IB
				 */
				if ($(cbxLabelObj.getComponentDOM()).text() == "LBL_"
						+ this.compositFieldSetData.displayNmKey
						|| $(cbxLabelObj.getComponentDOM()).text() == "LBL_"
								+ this.compositFieldSetData.plainLbl) {
					$(cbxLabelObj.getComponentDOM()).hide();
				}
				this.compositFieldObject
						.addLayer(cbxLabelObj.getComponentDOM());
				this.compositFieldObject.addLayer(this.compositFieldWrapObject
						.getLayer());

				
				var compositFormObject;
				var compositeFieldsArray = this.compositFieldSetData.children;
			

				var that = this;
				var iterateFormElements = function() {
					var compositeFieldsArray = that.createItems();
					if (typeof compositeFieldsArray !== 'undefined'
							&& compositeFieldsArray.length > 0) {
						for ( var i = 0; i < compositeFieldsArray.length; i++) {
							// var anchor = 100%;
							var compositFieldChildConfig = compositeFieldsArray[i];
							if (parseInt(that.itemAnchor) != 0) {
								var newAnchor = that.itemAnchor
										+ parseInt(compositFieldChildConfig.anchor);
								if (newAnchor > 100) {
									var negation = newAnchor - 100;
									newAnchor = parseInt(compositFieldChildConfig.anchor)
											- negation;
								}
								compositFieldChildConfig.anchor = newAnchor
										+ "%";

							} else {
								that.itemAnchor = parseInt(compositFieldChildConfig.anchor);

							}
							compositFieldChildConfig.anchor = 100
									/ compositeFieldsArray.length + "%";

							LOGGER.info('compositFieldChildConfig.anchor ',
									compositFieldChildConfig.anchor)
							compositFieldChildConfig.compositeField = true;
							// compositFieldChildConfig.inputFrom = 'composite';
							if (typeof compositFieldChildConfig.xtype !== 'undefined') {
								var cClass = CFCR
										.getFormCmp({
											'COMP_TYPE' : compositFieldChildConfig.xtype
										});
								if (cClass) {
									if (compositFieldChildConfig.xtype === "cbx-lazzyformpanel") {
										new cClass(
												{
													'formPanel' : that.compositFieldObject
															.getLayer(),
													'formData' : compositFieldChildConfig,
													'formManager' : that.formManager
												});
									} /*
										 * else if
										 * (compositFieldChildConfig.xtype ===
										 * "cbx-lazzypanel") { new cClass( {
										 * 'formPanel' :
										 * that.compositFieldObject .getLayer(),
										 * 'formData' :
										 * compositFieldChildConfig,
										 * 'formManager' : that.formManager }); }
										 */else {
										if (compositFieldChildConfig.xtype === "cbx-combobox" || compositFieldChildConfig.xtype === "cbx-datefield") {
											compositFieldChildConfig['additionalData'] = that.compositFieldSetData.additionalData[compositFieldChildConfig['itemId']];
										} else if (compositFieldChildConfig.xtype == "cbx-fieldset"
												|| compositFieldChildConfig.xtype == "cbx-lazzypanel") {
											compositFieldChildConfig['additionalData'] = that.compositFieldSetData.additionalData[compositFieldChildConfig['itemId']];
										}
										compositFieldChildConfig['fm'] = that.formManager;
										var formFieldObject = new cClass(
												compositFieldChildConfig);
										that.compositFieldWrapObject
												.addLayer(formFieldObject
														.getComponentDOM());
									}
								}
							}
						}
					}
				};
				iterateFormElements();
				
			},
			getComponentDOM : function() {
				return this.compositFieldObject.getLayer();
			},
			fieldSetValidateType : function() {
				// TDB
				// the function will always use "this" reference.
				if (this.value == 's') {
					this.value = '';
				}
			},
			createItems : function() {
				var config = {
					formId : this.compositFieldSetData.formId,
					model : this.formManager.model,
					mode : this.formManager.mode,
					manager : this.formManager,
					preInitConfig : this.formManager.preInitConfig,
					metadata : this.compositFieldSetData,
					screenView : this.formManager.screenView
				};
				// Retrieving formfield items
				var formCreator = new cbx.form.FormCreator(config);
				return formCreator.getFormFields();
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-compositefield'
}, cbx.lib.formElement.cbxCompositeField);


/*
 * This class is reponsible for Instantiate the CbxDateField to create the
 * DateField Component.
 * This component will instantiate the jQuery Mobile datebox component to launch the datepicker control
 */
cbx.lib.formElement.cbxDateField = Class(
			cbx.core.Component,
			{
				isFormField : true,
				canValidate : true,
				htmlDateFormat : 'yy-m-d',
				//submitDateFormat : 'dd/mm/yy',
				submitDateFormat : 'd/m/Y',
				constructor : function(config) {
					cbx.apply(this, config);
					cbx.lib.formElement.cbxDateField.$super.call(this);
					this.triggerField = true;
					this.input = null;
					this.config = config;
					this.anchor = config.anchor;
					this.itemId = config.itemId;
					this.disableDates=config.disableDates || '';
					this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
					this.xtype = config.xtype || "";
					this.canValidate = 	this.xtype=="cbx-staticdatefield"?false:true;
					this.bundleKey = config.bundleKey || "";
					this.compositeField = config.compositeField ? config.compositeField
							: false;
					
					if(this.xtype=="cbx-staticdatefield"){
						this.setEleType("S",config);
					}
					else{
						this.setEleType("N", config);
					}
					
					this.formManager = config.fm;
					/*this.preferredDateFormats = {
						'd-m-y' : 'dd-mm-y',
						'd-m-Y' : 'dd-mm-yy',
						'm/d/Y' : 'mm/dd/yy',
						'd/m/Y' : 'dd/mm/yy',
						'm-d-Y' : 'mm-dd-yy',
						'Y-m-d' : 'yy-mm-dd',
						'd-m-y' : 'dd-mm-y',
						'd-m-Y' : 'dd-mm-yy',
						'd/m/Y' : 'dd/mm/yy',
						'm/d/Y' : 'mm/dd/yy',
						'm-d-Y' : 'mm-dd-yy',
						'Y-m-d' : 'yy-mm-dd'
					};
					
					this.dateboxPreferredFormats = {
						'dd-mm-y' : '%d-%m-%g',
						'dd-mm-yy' : '%d-%m-%Y',
						'mm/dd/yy' : '%m/%d/%Y',
						'dd/mm/yy' : '%d/%m/%Y',
						'mm-dd-yy' : '%m-%d-%Y',
						'yy-mm-dd' : '%Y-%m-%d',
						'dd-mm-y' : '%d-%m-%g',
						'dd-mm-yy' : '%d-%m-%Y',
						'dd/mm/yy' : '%d/%m/%Y',
						'mm/dd/yy' : '%m/%d/%Y',
						'mm-dd-yy' : '%m-%d-%Y',
						'yy-mm-dd' : '%Y-%m-%d'	
					};*/
					
					this.initDateField();
					this.addItem(this.formCmponentObject.getLayer());
					if (config.disabled == true) {
						this.disable();
					}
				},
				createDateField : function() {
					var configData = this.config;
					
					if(!cbx.isEmpty(this.disableDates)){
						 if(cbx.isArray(this.disableDates)){
							 var formattedDataArray=[];
							for ( var i = 0; i < this.disableDates.length; i++) {
								// Intended to convert the
								// disabled date value to
								// preferred user format
							formattedDataArray.push(cbx.jsutil.convertDateValueToUserPreferedFmt(this.disableDates[i]));							
									}
							this.disabledDates = formattedDataArray;	 
						 }
					}
					/**
					 * In case additional data is available for the date field
					 * call the rePopulateAdditionalData before the component is
					 * created.
					 */
					if (this.addData != null) {
						this.rePopulateAdditionaldata(this.addData);
					}
					var formConfig = {
						eleType : "div",
						"data-role" : "fieldcontain",
						"id" : configData.itemId,
						
						"class" : this.config.xtype == "cbx-staticdatefield" ? "staticfield ui-field-contain ui-body cbx-date cbx-date-view cbx-staticdate"
								: "ui-field-contain ui-body cbx-date",
						"style" :{
							
						}
					
					};

					if (this.compositeField) {
						formConfig.style["width"] = this.config.xtype == "cbx-staticdatefield" ? this.anchor
								: this.getCompositeWidth(this.anchor);
					}
					if (typeof configData.visibleInd !== 'undefined'
							&& (configData.visibleInd.trim().toUpperCase() === 'N' || configData.hidden == true)) {
						if (this.config.xtype == "cbx-staticdatefield") {
						
							formConfig["class"] = "staticfield ui-field-contain ui-body cbx-date cbx-date-view jqm-display-hide cbx-staticdate";
						
						} else {
							formConfig["class"] = "ui-field-contain ui-body cbx-date jqm-display-hide";
						}

					}
					this.formCmponentObject = new cbx.lib.layer(formConfig);

					var cbxLabelObj = new cbx.lib.formElement.cbxLabel(configData);

					this.formCmponentObject.addLayer(cbxLabelObj.getComponentDOM());
					this.labelText = $(cbxLabelObj.getComponentDOM()).text()
							.replace(/\*/g, '');
					var displayLabelName = "";
					if (this.config.plainLbl != null
							&& $.trim(this.config.plainLbl) !== "") {
						displayLabelName = this.config.plainLbl;
					} else {
						displayLabelName = this.getDisplayNameKey(this.config);
					}
					dateCallBack = function(dt){
						setTimeout(function(){
							doIScroll("CONTENT_DIV",'refresh');
						},0);
					};
					var dataOptions = {
						'mode' : 'flipbox',
						'buttonIcon' : 'calendar',
						'useFocus':false,
						'useClearButton':true,
						"enablePopup":true,
						"popupPosition":"window",
						"useModal":true,
						"blackDates":this.disabledDates,
                "overrideIsRTL": (iportal.preferences.isLangDirectionRTL === "true") ? true : false,
                "overrideSetDateButtonLabel":CRB.getFWBundle()['LBL_OK']
              
			};
			var dateValue = this.config.fm.getModelData()[this.config.itemId];
			if (!cbx.isEmpty(dateValue)) {
				//var tDateValue = cbx.lib.utility.convertDateFormat(this.getParsedDateFormat(),dateValue, 'mm-dd-yy');
				var dateValueArray = cbx.lib.utility.splitDate(dateValue,false);
				dataOptions.defaultValue = dateValueArray;
				dataOptions.showInitialValue = true;
			}
			//this.dateFormat = this.getParsedDateFormat();
			dataOptions.overrideDateFormat =  canvas.datePreferences.getParsedDateFormat();
			var inputConf = {
				'eleType' : 'input',
				'type' : 'text',
				'class' : this.config.xtype == 'cbx-staticdatefield' ? 'cbx-date-view'
						: 'cbx-date',
				'id' : configData.itemId + '_field',
				'cbx-type' : 'formField_' + configData.itemType,
				'name' : configData.itemId,
				'displayMode' : configData.xtype == 'cbx-staticdatefield' ? 'view'
						: 'edit',
				'fieldName' : displayLabelName,
				'readonly' : 'readonly',
				'style' : {
					'border' : (configData.editableInd.trim().toUpperCase() === 'N') ? 'none'
							: 'block'
				}
				
				
			};
			if (this.config.xtype == "cbx-datefield") {
				inputConf['data-role'] = 'datebox';
				inputConf['data-theme'] = 'c';
				inputConf['data-options'] = JSON.stringify(dataOptions);
			}
			else{
				
				var displayDate = cbx.lib.utility.formatDate(dateValue,this.submitDateFormat,canvas.datePreferences.getDateFormat());
				inputConf['value'] = displayDate || "--";
				
			}
			var minValueDate = this.config.minValueDate || this.config.minValue || this.additionalMinValue;
			var maxValueDate = this.config.maxValueDate || this.config.maxValue|| this.additionalMaxValue;
				
			if (!cbx.isEmpty(minValueDate)) {
				//var tempMinValueDate = cbx.lib.utility.convertDateFormat(this.getParsedDateFormat(),minValueDate, this.htmlDateFormat);
				var dateArray = cbx.lib.utility.splitDate(minValueDate);
				inputConf.min = dateArray[0]+ '-' + dateArray[1]+ '-' + dateArray[2];  
			}
			if (!cbx.isEmpty(maxValueDate)) {
				//var tempMaxValueDate = cbx.lib.utility.convertDateFormat(this.getParsedDateFormat(),maxValueDate, this.htmlDateFormat);
				var dateArray = cbx.lib.utility.splitDate(maxValueDate);
				inputConf.max = dateArray[0]+ '-' + dateArray[1]+ '-' + dateArray[2];
			}
			if (typeof this.config.editableInd !== 'undefined'
					&& this.config.editableInd.trim().toUpperCase() === "N") {
				if (typeof fieldConfig != 'undefined')
					fieldConfig.readonly = "true";
			}
 
			var inputObj = new cbx.lib.layer(inputConf);
			this.input = inputObj.getLayer();
			$(this.input).on("focus", function (){
				$(this).blur();
			});
			
			this.formCmponentObject.addLayer(this.input);
			this.addItem(this.formCmponentObject.getLayer());
			this.setFormField($(this.input));

					if (this.config.xtype == 'cbx-datefield' && this.config.disabled == true) {
						this.disable();
					}
					this.registerDefaultValidation(this);
				},
				setDisabledDates : function(valueArr){
					var newValArr=[];
					for(var i=0;i<valueArr.length;i++){
						var dateArray = cbx.lib.utility.splitDate(valueArr[i]); 
						newValArr.push(dateArray[0]+ '-' + dateArray[1]+ '-' + dateArray[2]);
					}
					this.disabledDates = newValArr;
				},
				/**
				 * Methods directly ties up with the additional data format of Form FW and
				 * is responsible for parsing the provided additional data and repopulate
				 * the date field attributes like disabled date, min and max dates.
				 */
				rePopulateAdditionaldata : function (additionalData){
					var valueArr=null;
					 if(this.disabledDates==null){
						valueArr= this.populateAddData(additionalData, 'DISABLED_DATES');
						if (valueArr != null && valueArr.length>0) {
							this.setDisabledDates(valueArr, null, false);
						}
					 }
					 if (this.maxValueDate == null || this.maxValueDate === '') {
						valueArr = this.populateAddData(additionalData, 'MAX_DATE');
						if (valueArr != null && valueArr.length>0) {
							this.additionalMaxValue = valueArr[0];
						}
					 }
					 if (this.minValueDate == null || this.minValueDate === '') {
						valueArr = this.populateAddData(additionalData, 'MIN_DATE');
						if (valueArr != null && valueArr.length>0) {
							this.additionalMinValue = valueArr[0];
						}
					 }
				},
				/**
				 * Method expected to receive the data from additionaldata
				 * attribute and parses the data according to
				 * rawtype(rawkeys and rawValues)
				 */
				/*
				 * CHG_MIN_MAX_DATE Update the method now to not only deal with
				 * disabled dates but other similar date attirbutes
				 */	
				populateAddData : function (items, key){
					var rawDataArray = [];
					if (items != "" && items != null) {
					for ( var i = 0; i < items.length; i++) {
							if (items[i]['rawKey'] === key) {
								// Intended to convert the
								// disabled date value to
								// preferred user format
								rawDataArray.push(items[i]["rawValue"]);
							
							}
						}
					}
					return rawDataArray;
				},
				getValidationField : function() {
					return this.getFormField().parent();
				},
				initDateField : function(config) {
					this.createDateField();
					var that = this;
					var dateValue = this.config.fm.getModelData()[this.config.itemId];
					setTimeout(function() {
				that.getFormField().on('datebox',function(e, p) {
					if(p.method=="open"){
						cbx.lib.datePicker.setActiveDatePicker($(e.target));
						var dateInterval = setInterval(function() {
							var dateBoxContainer = $(".ui-popup-active").children(".ui-datebox-container");
							if(dateBoxContainer[0]){
								var dateBoxTitle = dateBoxContainer.find(".ui-title").html();
								var finalHeaderText = dateBoxTitle.replace(/[*]/g,"");
								dateBoxContainer.find(".ui-title").html(finalHeaderText);
								clearInterval(dateInterval);
							}
							},10);
						that.clearInvalid();
						setTimeout(function(){
							that.refreshDateBox();
							window.dispatchEvent(window.postLoadEvent);
						},400)
						
					}
					if (p.method === 'close') {
						cbx.lib.datePicker.setActiveDatePicker(null);
						var selectedDate = that.getFormField().val();
						if (!cbx.isEmpty(selectedDate)) {
							var submitDate = cbx.lib.utility.formatDate(selectedDate,canvas.datePreferences.getDateFormat(),that.submitDateFormat);
							that.formManager.model.updateValue(that.config.itemId, submitDate);
							that.setValue(submitDate, true);
						
						}
						that.getFormField().blur();
					}
					if(p.method=="clear"){
						that.formManager.model.updateValue(that.config.itemId, "");
						that.formManager.handlerEvent('cbxdateclear', that.itemId,"");
					}
				});
			}, 100);
		},
		validateDate : function(msg) {
			this.formManager.markInvalid(this.config.itemId,
					this.config.itemId + " " + msg);
		},
		convertStringToDateObject : function(stdat) {
			if (!cbx.isEmpty(stdat) && typeof (stdat) == 'string') {
				var vals = stdat.split("/");
				var xdate = null;
				var monthfield = vals[1];
				var dayfield = vals[0];
				var yearfield = vals[2];
				xdate = new Date(yearfield, monthfield - 1, dayfield);
				if ((xdate.getMonth() + 1 != monthfield)
						|| (xdate.getDate() != dayfield)
						|| (xdate.getFullYear() != yearfield)) {
					return "Invalid Date";
				} else {
					xdate = new Date();
					var intvals = [ Number(vals[0]), Number(vals[1]),
							Number(vals[2]) ];
					xdate.setFullYear(intvals[2], intvals[1] - 1,
							intvals[0]);
					return xdate;
				}
			} else
				return stdat;
		},
		convertStringToDateObjectWithoutTime : function(stdat) {

			if (!cbx.isEmpty(stdat) && typeof (stdat) == 'string') {
				var vals = stdat.split("/");
				var xdate = new Date();
				var intvals = [ Number(vals[0]), Number(vals[1]),
						Number(vals[2]) ];
				xdate.setFullYear(intvals[2], intvals[1] - 1, intvals[0]);
				return xdate.clearTime().getTime();
			} else
				return stdat;
		},
		getValue : function() {
			return this.getFormField().val();
		},
		setValue : function(value, eventRequired) {
			eventRequired = eventRequired || false;
			var that = this;
			if (!cbx.isEmpty(value) && !cbx.isEmpty(value.trim())) {
				setTimeout(function() {
					if ( that.config.xtype == 'cbx-staticdatefield' ) {
						var convertedDate = cbx.lib.utility.formatDate(value,that.submitDateFormat,canvas.datePreferences.getDateFormat());
						convertedDate = convertedDate||"--";
						that.getFormField().val(convertedDate);
					}
					else if (that.getFormField().datebox()) {
						var date = iportal.jsutil.convertStringToDateObject(value);
						that.getFormField().datebox('setTheDate',date);
						that.refreshDateBox();
					}
					else if(!cbx.lib.datePicker.getFromArray(that.config.itemId + '_field')){
							//var convertedDate = cbx.lib.utility.convertDateFormat(that.getParsedDateFormat(),value, that.htmlDateFormat);
						that.getFormField().trigger('datebox', {'method':'set', 'value':value});
						}
					if (eventRequired) {
						that.formManager.handlerEvent('cbxafterselect',
								that.config.itemId, value);
					}
					that.fm.clearInvalid(that.itemId);
				}, 100);
			}
			else{
				
				var emptyStr = that.config.xtype == "cbx-datefield"?"":"--";
				this.getFormField().val(emptyStr);
				
				if(that.config.xtype == "cbx-datefield"){
					this.getFormField().datebox("refresh");
				}
			}
		},
		setMinValue : function(value) {
			var that = this;
			if (this.config.xtype == "cbx-datefield" && !cbx.isEmpty(value)) {
				//var tValue = cbx.lib.utility.convertDateFormat(that.getParsedDateFormat(),value, that.htmlDateFormat);
				var dateArray = cbx.lib.utility.splitDate(value);
				that.getFormField().attr('min',dateArray[0]+ '-' + dateArray[1]+ '-' + dateArray[2]);
				setTimeout(function() {
					that.getFormField().datebox();
					that.getFormField().datebox('applyMinMax');
					that.refreshDateBox();
				},100);
				
				
			}
		},
		setMaxValue : function(value) {
			var that = this;
			if (this.config.xtype == "cbx-datefield" && !cbx.isEmpty(value)) {
				//var tValue = cbx.lib.utility.convertDateFormat(that.getParsedDateFormat(),value, that.htmlDateFormat);
				var dateArray = cbx.lib.utility.splitDate(value);
				that.getFormField().attr('max',dateArray[0]+ '-' + dateArray[1]+ '-' + dateArray[2]);
				setTimeout(function() {
					that.getFormField().datebox();
					that.getFormField().datebox('applyMinMax');
					that.refreshDateBox();
				},100);
			}
		},
		getComponentDOM : function() {
			return this.formCmponentObject.getLayer();
		},
		/*getParsedDateFormat : function() {
			if (!cbx.isEmpty(this.preferredDateFormats[iportal.preferences
					.getDateFormat()])) {
				return this.preferredDateFormats[iportal.preferences
						.getDateFormat()];
			}
			return this.preferredDateFormats['Y-m-d'];
		},*/
		dateValidateType : function() {
			// TBD
			if (this.value == 's') {
				this.value = '';
			}
		},
		refreshDateBox: function() {
			this.getFormField().datebox();
			this.getFormField().datebox('refresh');
		}
	});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-datefield'
}, cbx.lib.formElement.cbxDateField);
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-staticdatefield'
}, cbx.lib.formElement.cbxDateField);


cbx.lib.formElement.cbxEmptyCell = Class(cbx.core.Component, {
	ctlCls : 'cbx-emptycell',
	isFormField : true,
	canValidate : false,
	constructor : function(config) {
		cbx.lib.formElement.cbxEmptyCell.$super.call(this);
		this.emptyCellConfigData = config;
		this.xtype = config.xtype || "";
		this.compositeField = config.compositeField ? config.compositeField
				: false;
		this.createEmptyCell();
		this.setEleType("N", config);
		;
	},
	createEmptyCell : function() {
		if (typeof this.emptyCellConfigData.customClass !== 'undefined'
				&& this.emptyCellConfigData.customClass !== '') {
			this.ctlCls = this.emptyCellConfigData.customClass;
		}
		var emptyCellConfig = {
			eleType : "div",
			'id' : this.emptyCellConfigData.itemId,
			'class' : this.ctlCls
		};
		this.cellConfObject = new cbx.lib.layer(emptyCellConfig);
		this.addItem(this.cellConfObject.getLayer());
	},
	getComponentDOM : function() {
		return this.cellConfObject.getLayer();
	}
});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-emptycell'
}, cbx.lib.formElement.cbxEmptyCell);

/*
 * This class is reponsible for creating the FieldSet component.
 * 
 3
 */


/*
 * This class is reponsible for creating the HIDDEN Field
 * 

 */

cbx.lib.formElement.cbxHiddenField = Class(cbx.core.Component, {
	config : null,
	isFormField : true,
	enableKeyEvents : true,
	canValidate : false,
	formManager : null,
	constructor : function(config) {
		cbx.lib.formElement.cbxHiddenField.$super.call(this);
		this.formManager = config.fm;
		this.config = config;
		this.compositeField = config.compositeField ? config.compositeField
				: false;
		this.xtype = config.xtype || "";
		this.createHiddenField();
		this.addItem(this.formCmponentObject.getLayer());
		this.setEleType("N", config);
		;
	},
	createHiddenField : function() {
		this.inputFieldObject = null;
		this.formCmponentObject = null;
		configData = this.config;
		formConfig = {
			"eleType" : "div",
			"id" : configData.itemId
		};
		var that = this;
		this.formCmponentObject = new cbx.lib.layer(formConfig);
		if (configData.itemType.trim() !== "") {
			if (configData.itemType.trim().toUpperCase() === "HIDDEN") {
				// crating the Hiddenfield configuration
				hiddenFieldConfig = {
					eleType : "input",
					"name" : "name",
					"id" : this.config.itemId + "_field",
					"type" : "hidden",
					"class" : "cbx-hiddenfield"

				};
				this.inputFieldObject = new cbx.lib.layer(hiddenFieldConfig);
				this.formCmponentObject.addLayer(this.inputFieldObject
						.getLayer());
			}
		}
		this.setFormField($(this.inputFieldObject.getLayer()));
		var fieldValue = configData.model.getModelData()[configData.itemId];
		if (typeof fieldValue === 'undefined' || fieldValue === '') {
			fieldValue = '--';
		} else {
			this.setValue(fieldValue);
		}
		$(this.inputFieldObject.getLayer()).bind(
				'change',
				this,
				function(event) {
					that.formManager.model.updateValue(that.config.itemId, that
							.getValue());
				});
	},
	getValue : function() {
		return this.getFormField().val();
	},
	setValue : function(value) {
		this.getFormField().val(value);
	},
	getComponentDOM : function() {
		return this.formCmponentObject.getLayer();
	},
	getValidationField : function() {
		return this.getFormField();
	}
});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-hidden'
}, cbx.lib.formElement.cbxHiddenField);

/*
 * This class is reponsible for creating the html editor 
 */
cbx.lib.formElement.cbxHtmlEditor = Class(
		cbx.core.Component,
		{
			buttonConfigData : '',
			isFormField : true,
			formManager : null,
			canValidate : false,
			constructor : function(config) {
				cbx.lib.formElement.cbxHtmlEditor.$super.call(this);
				this.formManager = config.fm;
				this.xtype = config.xtype || "";
				htmlEditorConfigObject = '';
				this.buttonConfigData = config;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.createHtmlEditor(config);
				this.addItem(this.mainDivConfigObject.getLayer());
				this.setEleType("N", config);
				;
			},
			createHtmlEditor : function(config) {
				mainDivConfig = {
					eleType : "div",
					"style" : {
						display : (typeof this.buttonConfigData.visibleInd !== 'undefined' && this.buttonConfigData.visibleInd
								.trim().toUpperCase() === 'N') ? "none" : ""
					}
				};
				this.mainDivConfigObject = new cbx.lib.layer(mainDivConfig);
				// Creates the editable paragh
				htmlEditorConfig = {
					eleType : "div",
					"contenteditable" : true,
					"class" : "cbx-htmleditor"
				/*
				 * style: { "display": "inline-block", "width": "900px",
				 * "min-height": "500px", "vertical-align": "top" }
				 */
				};
				this.htmlEditorConfigObject = new cbx.lib.layer(
						htmlEditorConfig);
				editableConfig = {
					eleType : "p",
					"value" : 'Some text',
					"html" : 'Some text',
					"class" : "cbx-htmleditortext"
				/*
				 * style: { color : '#000000' }
				 */
				};
				this.editableConfigObject = new cbx.lib.layer(editableConfig);
				this.htmlEditorConfigObject.addLayer(this.editableConfigObject
						.getLayer());
				this.mainDivConfigObject.addLayer(this.htmlEditorConfigObject
						.getLayer());
				divConfig = {
					eleType : "div",
					"class" : "cbx-htmleditordiv"
				/*
				 * style: { "display": "inline-block", "width": "20px" }
				 */
				};
				/*
				 * if(typeof this.buttonConfigData.editableInd !== 'undefined' &&
				 * this.buttonConfigData.editableInd.trim().toUpperCase() ===
				 * 'N') { editableConfig['readonly'] = "true";
				 * //editableConfig.disabled = "disabled"; }
				 */
				this.divConfigObject = new cbx.lib.layer(divConfig);
				this.mainDivConfigObject.addLayer(this.divConfigObject
						.getLayer());
				var that = this;
				// Creates a bold button
				var boldbuttonConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "boldbtn_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/text_bold.png')",
				 * "background-repeat": "no-repeat", "background-position":
				 * "center" }
				 */
				};
				var boldbuttonConfigObject = new cbx.lib.layer(boldbuttonConfig)
						.getLayer();
				boldbuttonConfigObject.onclick = function() {
					that.boldClickHandler();
				};
				this.divConfigObject.addLayer(boldbuttonConfigObject);
				// Creates a italic button
				var italicbuttonConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "italicbtn_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/italic.png')", "background-repeat":
				 * "no-repeat", "background-position": "center" }
				 */
				};
				var italicbuttonConfigObject = new cbx.lib.layer(
						italicbuttonConfig).getLayer();
				italicbuttonConfigObject.onclick = function() {
					that.italicClickHandler();
				};
				this.divConfigObject.addLayer(italicbuttonConfigObject);
				// Creates a button for text underline.
				var underlinebuttonConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "underlinebtn_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/font_underline.png')",
				 * "background-repeat": "no-repeat", "background-position":
				 * "center" }
				 */
				};
				var underlinebuttonConfigObject = new cbx.lib.layer(
						underlinebuttonConfig).getLayer();
				underlinebuttonConfigObject.onclick = function() {
					that.underlineClickHandler();
				};
				this.divConfigObject.addLayer(underlinebuttonConfigObject);
				// Creates unordered list
				var unorderedlistbuttonConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "unorderedlistbtn_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/unordered.png')",
				 * "background-repeat": "no-repeat", "background-position":
				 * "center" }
				 */
				};
				var unorderedlistbuttonConfigObject = new cbx.lib.layer(
						unorderedlistbuttonConfig).getLayer();
				unorderedlistbuttonConfigObject.onclick = function() {
					that.unorderedClickHandler();
				};
				this.divConfigObject.addLayer(unorderedlistbuttonConfigObject);
				// Creates ordered list
				var orderedlistbuttonConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "orderedlistbtn_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/numbered.png')", "background-repeat":
				 * "no-repeat", "background-position": "center" }
				 */
				};
				var orderedlistbuttonConfigObject = new cbx.lib.layer(
						orderedlistbuttonConfig).getLayer();
				orderedlistbuttonConfigObject.onclick = function() {
					that.orderedClickHandler();
				};
				this.divConfigObject.addLayer(orderedlistbuttonConfigObject);
				// Creates strikethrough for text
				var strikebuttonConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "strikebtn_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/strike.png')", "background-repeat":
				 * "no-repeat", "background-position": "center" }
				 */
				};
				var strikebuttonConfigObject = new cbx.lib.layer(
						strikebuttonConfig).getLayer();
				strikebuttonConfigObject.onclick = function() {
					that.strikeClickHandler();
				};
				this.divConfigObject.addLayer(strikebuttonConfigObject);
				// Left alignment of text
				var leftAlignConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "leftalign_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/align-left.png')",
				 * "background-repeat": "no-repeat", "background-position":
				 * "center" }
				 */
				};
				var leftAlignConfigObject = new cbx.lib.layer(leftAlignConfig)
						.getLayer();
				leftAlignConfigObject.onclick = function() {
					that.leftAlignClickHandler();
				};
				this.divConfigObject.addLayer(leftAlignConfigObject);
				// Right alignment of text
				var rightAlignConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "rightalign_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/align-right.png')",
				 * "background-repeat": "no-repeat", "background-position":
				 * "center" }
				 */
				};
				var rightAlignConfigObject = new cbx.lib.layer(rightAlignConfig)
						.getLayer();
				rightAlignConfigObject.onclick = function() {
					that.rightAlignClickHandler();
				};
				this.divConfigObject.addLayer(rightAlignConfigObject);
				// Center alignment of text
				var centerAlignConfig = {
					"eleType" : "a",
					"href" : "#",
					"data-role" : "button",
					"data-inline" : "true",
					"class" : "centertalign_htmleditor"
				/*
				 * style: { "background-image":
				 * "url('images/htmleditor/align-center.png')",
				 * "background-repeat": "no-repeat", "background-position":
				 * "center" }
				 */
				};
				var centerAlignConfigObject = new cbx.lib.layer(
						centerAlignConfig).getLayer();
				centerAlignConfigObject.onclick = function() {
					that.centerAlignClickHandler();
				};
				this.divConfigObject.addLayer(centerAlignConfigObject);

				var fieldValue = this.buttonConfigData.model.getModelData()[this.buttonConfigData.itemId];
				if (typeof fieldValue === 'undefined' || fieldValue === '') {
					fieldValue = '--';
				}

			},
			// Returns the DOM for html editor
			getComponentDOM : function() {
				return this.mainDivConfigObject.getLayer();
			},
			boldClickHandler : function() {
				document.execCommand('bold', false, null);
				this.retrieveFormattedText();
			},
			italicClickHandler : function() {
				document.execCommand('italic', false, null);
				this.retrieveFormattedText();
			},
			underlineClickHandler : function() {
				document.execCommand('underline', false, null);
				this.retrieveFormattedText();
			},
			unorderedClickHandler : function() {
				document.execCommand('insertUnorderedList', false, null);
				this.retrieveFormattedText();
			},
			orderedClickHandler : function() {
				document.execCommand('insertOrderedList', false, null);
				this.retrieveFormattedText();
			},
			strikeClickHandler : function() {
				document.execCommand('strikeThrough', false, null);
				this.retrieveFormattedText();
			},
			leftAlignClickHandler : function() {
				document.execCommand('justifyLeft', false, null);
				this.retrieveFormattedText();
			},
			centerAlignClickHandler : function() {
				document.execCommand('justifyCenter', false, null);
				this.retrieveFormattedText();
			},
			rightAlignClickHandler : function() {
				document.execCommand('justifyRight', false, null);
				this.retrieveFormattedText();
			},
			// Returns the Formatted Text
			retrieveFormattedText : function() {
				return this.editableConfigObject.getLayer().outerHTML;
			},
			getValue : function() {

			},
			setValue : function() {

			},
			getValidationField : function() {
				return this.getFormField();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-htmleditor'
}, cbx.lib.formElement.cbxHtmlEditor);

/*
 * This class is responsible for creating the hyperlink in a form
 * 

 */



cbx.lib.formElement.cbxHyperlink = Class(
		cbx.core.Component,
		{
			hyperlinkConfigData : '',
			hyperlinkObject : null,
			isFormField : true,
			disabled : false,
			canValidate : false,
			formManager : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxHyperlink.$super.call(this);
				this.formManager = config.fm;
				this.anchor = config.anchor;
				this.xtype = config.xtype || "";
				this.hyperlinkConfigData = config;
				this.bundleKey = config.bundleKey || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.readOnly = config.readOnlyInd;
				this.createHyperlink();
				this.addItem(this.hyperlinkObject.getLayer());
				this.setEleType("N", config);
				;
			},
			createHyperlink : function() {
				var displayLabelName = this
						.getDisplayNameKey(this.hyperlinkConfigData);

				var container = {
					'eleType' : 'div',
					'data-role' : 'fieldcontain',
					"style" : {

					}
				};

				if (this.compositeField) {
					container.style["width"] = this.anchor;
				}
				if (typeof this.hyperlinkConfigData.visibleInd !== 'undefined'
						&& (this.hyperlinkConfigData.visibleInd.trim()
								.toUpperCase() === 'N' || this.hyperlinkConfigData.hidden == true)) {
					container["class"] = "ui-field-contain ui-body jqm-display-hide";

				}
				this.container = new cbx.lib.layer(container);
				this.cls = "cbx-hyperlink";
				if (this.hyperlinkConfigData.disabled == true) {
					this.cls = this.cls + ' ui-disabled';
				}
				hyperlinkConfig = {
					"eleType" : "a",
					"html" : displayLabelName,
					"href" : '#',
					"id" : this.hyperlinkConfigData.itemId,
					"class" : this.cls,
					"style" : {
						"display" : (typeof this.hyperlinkConfigData.visibleInd !== 'undefined' && (this.hyperlinkConfigData.visibleInd
								.trim().toUpperCase() === 'N' || this.hyperlinkConfigData.hidden == true)) ? "none"
								: "block"
					}
				};
				if (this.hyperlinkConfigData.disabled == true
						|| this.readOnly == 'Y') {
					hyperlinkConfig.disabled = true;
				}

				this.hyperlinkObject = new cbx.lib.layer(hyperlinkConfig);
				var temp = this.hyperlinkObject.getLayer();
				var that = this;

				if (!hyperlinkConfig.disabled) {
					$(temp).on(
							'click',
							function(event) {
								that.formManager.handlerEvent('cbxclick',
										that.hyperlinkConfigData.itemId);
							});
				}
				this.hyperlinkObject.setLayer(temp);
				this.container.addLayer(temp);
				this.setFormField($(temp));

			},
			/* Returns the DOM element of hyperlink */
			getComponentDOM : function() {
				return this.container.getLayer();
			},
			getValidationField : function() {
				return this.getFormField();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-hyperlink'
}, cbx.lib.formElement.cbxHyperlink);

/*
 * This class is responsible for creating the Label field of form
 * 
 
 */


cbx.lib.formElement.cbxLabel = Class(
		cbx.core.Component,
		{
			labelConfigData : '',
			isFormField : true,
			canValidate : false,
			ctlCls : 'cbx-label',
			conditionalOPCls : 'cbx-conditional-ind',
			formManager : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxLabel.$super.call(this);
				this.labelConfigData = config;
				this.xtype = config.xtype || "";
				this.anchor = config.anchor;
				this.fieldComposite = config.compositeField || false;
				this.createLabel();
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.addItem(this.labelConfObject.getLayer());
			},
			createLabel : function() {
				
				var displayLabelName = "";

				if (this.labelConfigData.plainLbl != null
						&& $.trim(this.labelConfigData.plainLbl) !== "") {
					displayLabelName = this.labelConfigData.plainLbl;
				}
				else if(this.xtype === "cbx-label"){
					displayLabelName = this.labelConfigData.fm.getModelData()[this.labelConfigData.itemId];
					if(cbx.isEmpty(displayLabelName)){
						displayLabelName = this.getDisplayNameKey(this.labelConfigData);
					}
				}
				else {
					displayLabelName = this
							.getDisplayNameKey(this.labelConfigData);
				}
				if (this.xtype != "cbx-label"
						&& (this.labelConfigData.hideLabelInd == "Y" || this.labelConfigData.hideLabel)) {
					displayLabelName = " ";
				}
				/**
				 * Checking for static field before applying
				 */
				if (this.labelConfigData.eleType !== "S") {
					if (typeof this.labelConfigData.customClass !== 'undefined') {
						this.ctlCls = this.labelConfigData.customClass;
					}
					if (typeof this.labelConfigData.customConditionalOPCls !== 'undefined') {
						this.conditionalOPCls = this.labelConfigData.customConditionalOPCls;
					}
					if (typeof this.labelConfigData.conditionalInd !== 'undefined'
							&& this.labelConfigData.conditionalInd.trim()
									.toUpperCase() === "Y") {
						displayLabelName = displayLabelName
								+ '<span class=conditional-mandatory>**</span>';
					} else if (typeof this.labelConfigData.requiredInd !== 'undefined'
							&& this.labelConfigData.requiredInd.trim()
									.toUpperCase() === "Y") {
						displayLabelName = displayLabelName
								+ (typeof this.labelConfigData.requiredInd !== 'undefined'
										&& this.labelConfigData.requiredInd
												.trim().toUpperCase() === "Y" ? '<span class="'
										+ this.conditionalOPCls + '">*</span>'
										: '');
					} else {

						if (cbx.isEmpty(displayLabelName)) {
							displayLabelName = '';
						} else {
							displayLabelName = displayLabelName
									+ '<span class = \'non_mandatory\'"></span>';
						}
					}
				}
				/*
				 * var labelConfig=''; if(this.fieldComposite &&
				 * this.labelConfigData.xtype!='cbx-label'){ labelConfig = {
				 * 'eleType' : 'span', 'style':{ 'visibility':'hidden' } };
				 * }else{
				 */
				var labelConfig = {
					'eleType' : 'label',
					'html' : displayLabelName,
					'data-inline' : false,
					'for' : this.labelConfigData.itemId + "_field",
					'class' : this.ctlCls + " ui-input-text",
					'style' : {

					}
				};
				// }
				if (this.fieldComposite
						&& this.labelConfigData.xtype != 'cbx-label') {
					labelConfig['class'] = labelConfig['class']
							+ ' jqm-composite-label';
				} else if (this.labelConfigData.xtype == 'cbx-label') {
					labelConfig["id"] = this.labelConfigData.itemId;
					labelConfig['class'] = labelConfig['class']
					+ ' ct-label-field';
				}
				/*
				 * if(this.fieldComposite){
				 * labelConfig.style["width"]=this.labelConfigData.anchor; }
				 */
				/**
				 * Commented this out as labelConfig is component config and not
				 * actually label config To hide the label only hidelabel Ind
				 * must be used...
				 */
				
				if (typeof this.labelConfigData.visibleInd !== 'undefined'
						&& (this.labelConfigData.visibleInd.trim()
								.toUpperCase() === 'N' || this.labelConfigData.hidden == true)) {
					labelConfig["style"] = {
						"display" : "none"
					};

				}
				
				this.labelConfObject = new cbx.lib.layer(labelConfig);
				this.setFormField($(this.labelConfObject.getLayer()));
				cbx
						.isEmpty($(this.getComponentDOM()).text().replace(
								/\*/g, '')) ? $(this.getComponentDOM())
						.text('') : cbx.emptyFn;
			},
			getComponentDOM : function() {
				return this.labelConfObject.getLayer();
			},
			setValue : function(val) {
				$(this.getComponentDOM()).html(val);
			},
			getValue : function() {
				return $(this.getComponentDOM()).html();
			},
			getValidationField : function() {
				return $(this.labelConfObject.getLayer());
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-label'
}, cbx.lib.formElement.cbxLabel);


cbx.lib.formElement.cbxLine = Class(cbx.core.Component, {
	isFormField : true,
	canValidate : false,
	constructor : function(config) {
		cbx.lib.formElement.cbxLine.$super.call(this);
		this.lineConfigData = config;
		this.compositeField = config.compositeField ? config.compositeField
				: false;
		this.createLine();
		this.addItem(this.lineConfObject.getLayer());
		this.setEleType("N", config);
		;
	},
	createLine : function() {
		lineConfig = {
			"eleType" : "div",
			"id" : this.lineConfigData.itemId,
			"class" : "cbx-line"
		};
		this.lineConfObject = new cbx.lib.layer(lineConfig);
	},
	getComponentDOM : function() {
		return this.lineConfObject.getLayer();
	}
});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-line'
}, cbx.lib.formElement.cbxLine);

/*
 * This class is reponsible for creating the radio group buttons 
 */
/**
 *  Need to validate, is it working as expected in terms of events and
 * callbacks 
 */
cbx.lib.formElement.cbxRadioGroup = Class(
		cbx.core.Component,
		{
			isFormField : true,
			canValidate : true,
			constructor : function(config) {
				cbx.apply(this, config);
				cbx.lib.formElement.cbxRadioGroup.$super.call(this);
				this.conf = config;
				this.config = config;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.frmManager = config.fm;
				this.label = this.getDisplayNameKey(this.conf).replace(/\*/g, '');
				this.anchor = config.anchor;
				this.itemId = config.itemId;
				this.xtype = config.xtype || "";
				this.model = this.conf.model;
				this.modelData = this.model.getModelData();
				this.setEleType("N", config);
				;

				// Attr's
				this.plainLabel = this.conf.plainLbl;
				this.displayName = this.conf.displayNmKey;
				this.isVisible = this.conf.visibleInd === 'Y' ? false : true;
				this.isRequired = this.conf.requiredInd;
				this.isReadOnly = this.conf.readOnlyInd === 'Y' ? true : false;
				this.fieldset = '';
				this.rawKeys = config.rawKeys;
				this.rawValues = config.rawValues;
				this.bundleKey = config.bundleKey;
				this.createGroup();
				this.addItem(this.fieldset.getLayer());
				var that = this;
				
				   var radioGroupRender=false;
				   $(document).on("formPanelRender",function(){
					   setTimeout(function(){
						   if(!radioGroupRender){
							   radioGroupRender=true;
							   $('input:radio[name="' + that.conf.itemId + '"]').on(
						'change',
						function(e) {
							e.stopPropagation();
							that.model.updateValue(that.conf.itemId, $(this)
									.val());
							   });
						   }
					   },150);
						});

			},
			createGroup : function() {
				formConfig = {
					'eleType' : 'div',
					'data-role' : 'controlgroup',
					'id' : this.conf.itemId,
					'class' : 'jqm-form-field-c jqm-cbxRadioGroup',
					'style' : {/*
								 * 'display' : (this.isVisible ||
								 * this.conf.hidden==true) ? 'none' : 'block'
								 */}
				};

				if (this.compositeField) {
					formConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.conf.visibleInd !== 'undefined'
						&& (this.conf.visibleInd.trim().toUpperCase() === 'N' || this.conf.hidden == true)) {
					formConfig["class"] = "checkBoxCls jqm-display-hide";

				}
				this.fieldset = new cbx.lib.layer(formConfig);

				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.conf);
				this.fieldset.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');

				var str = '';
				var md = this.conf;
				var readOnlyInd = "";
				var rawValues = this.rawValues;
				var rawKeys = this.rawKeys;
				if (md.readOnlyInd === 'Y' || md.readOnly || md.disabled) {
					readOnlyInd = 'disabled="disabled"';
				}
				if (rawKeys.length == rawValues.length) {

					var rb = CRB.getBundle(cbx.jsutil.getBundleKey(this));
					for ( var i = 0; i < rawKeys.length; i++) {

						if (this.conf.value == rawValues[i]) {

							this.model.updateValue(this.conf.itemId,
									this.conf.value);// Radio Group Change
							str += '<input class="" type="radio"  checked=true '
									+ readOnlyInd
									+ ' cbx-type="formField_'
									+ md.itemType
									+ '" name='
									+ md.itemId
									+ ' id='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ ' value='
									+ rawValues[i]
									+ ' />'
									+ '<label for='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ '>'
									+ (rb && rb['LBL_' + rawKeys[i]] ? rb['LBL_'
											+ rawKeys[i]]
											: rawKeys[i]) + '</label>';
						} else if (this.modelData[this.conf.itemId]
								&& this.modelData[this.conf.itemId] == rawValues[i]) {

							str += '<input class="" type="radio"  checked=true '
									+ readOnlyInd
									+ ' cbx-type="formField_'
									+ md.itemType
									+ '" name='
									+ md.itemId
									+ ' id='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ ' value='
									+ rawValues[i]
									+ ' />'
									+ '<label for='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ '>'
									+ (rb && rb['LBL_' + rawKeys[i]] ? rb['LBL_'
											+ rawKeys[i]]
											: rawKeys[i]) + '</label>';
						} else {
							str += '<input class="" type="radio"  '
									+ readOnlyInd
									+ ' cbx-type="formField_'
									+ md.itemType
									+ '" name='
									+ md.itemId
									+ ' id='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ ' value='
									+ rawValues[i]
									+ ' />'
									+ '<label for='
									+ md.itemId
									+ '_'
									+ rawValues[i]
									+ '>'
									+ (rb && rb['LBL_' + rawKeys[i]] ? rb['LBL_'
											+ rawKeys[i]]
											: rawKeys[i]) + '</label>';

						}

					}

				} else {
					str = {
						'eleType' : 'span',
						'class' : this.ctlCls
					};
				}

				$(this.fieldset.getLayer()).append(str);
				this.setFormField($(str));

			},

			setValue : function(value) {
				var val = this.getItemValue(value);
				var that = this;
				if (!cbx.isEmpty(val)) {
					$(
							'input:radio[name="' + that.conf.itemId
									+ '"][value="' + val + '"]').prop(
							'checked', true);
					$('input:radio[name="' + that.conf.itemId + '"]')
							.checkboxradio("refresh");
				} else {
					$('input:radio[name="' + that.conf.itemId + '"]').prop(
							'checked', false);
					$('input:radio[name="' + that.conf.itemId + '"]')
							.checkboxradio("refresh");
				}

			},
			getItemValue : function(value) {
				var out = "";
				if (this.rawKeys !== null && this.rawValues !== null) {
					for ( var i = 0; i < this.rawKeys.length; i++) {
						if (this.rawValues[i] === value) {
							return value;
						}
					}
				}
				return out;
			},
			getValue : function() {
				return this.getFormField().val();
			},
			getComponentDOM : function() {
				return this.fieldset.getLayer();
			},
			getValidationField : function() {
				return $($(this.getComponentDOM()).find('label').get(1));
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-radiogroup'
}, cbx.lib.formElement.cbxRadioGroup);




cbx.lib.formElement.cbxSpinnerField = Class(
		cbx.core.Component,
		{
			isFormField : true,
			spinnerFieldData : '',
			canValidate : true,
			spinnerTextField : null,
			constructor : function(config) {
				cbx.apply(this, config);
				cbx.lib.formElement.cbxSpinnerField.$super.call(this);
				this.spinnerFieldData = config;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.xtype = config.xtype;
				this.label = this.getDisplayNameKey(this.spinnerFieldData).replace(/\*/g, '');
				this.anchor = config.anchor;
				this.bundleKey = config.bundleKey || "";
				this.formManager = config.fm;
				if (cbx.isEmpty(config.minValue)) {
					this.spinnerFieldData.minValue = "0";
				}
				this.isReadOnly = config.readOnlyInd === 'Y' ? true : false;
				this.createSpinnerField();
				this.addItem(this.spinnerObject.getLayer());
				this.setEleType("N", config);
				;
			},
			createSpinnerField : function() {
				var displayLabelName;
				spinnerConfig = {
					eleType : "div",
					"class" : "spinnerCls",
					"id" : this.spinnerFieldData.itemId,
					"style" : {/*
								 * "display" : (typeof
								 * this.spinnerFieldData.visibleInd !==
								 * 'undefined' &&
								 * (this.spinnerFieldData.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.spinnerFieldData.hidden == true)) ?
								 * "none" : "block"
								 */}
				};

				if (this.compositeField) {
					spinnerConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.spinnerFieldData.visibleInd !== 'undefined'
						&& (this.spinnerFieldData.visibleInd.trim()
								.toUpperCase() === 'N' || this.spinnerFieldData.hidden == true)) {
					spinnerConfig["class"] = "jqm-display-hide";

				}
				textConfig = {
					eleType : "div",
					"class" : "cbx-spinnerfield"
				/*
				 * style: { display :"inline-block" }
				 */
				};
				textFieldObject = new cbx.lib.layer(textConfig);
				this.spinnerObject = new cbx.lib.layer(spinnerConfig);

				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
						this.spinnerFieldData);
				this.spinnerObject.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');
				var spinnerTextConfig = {
					"eleType" : "input",
					"type" : "text",
					"class" : "cbx-spinnertext",
					"name" : this.spinnerFieldData.itemId,
					"cbx-type" : "formField_" + this.spinnerFieldData.itemType,
					"data-inline" : true,
					"data-mini" : true,
					"readonly" : true
				};

				var downButtonConfig = {
					"eleType" : "button",
					"type" : "button",
					"data-icon" : "arrow-d",
					"data-iconpos" : "left",
					"html" : "down",
					"data-inline" : true,
					"data-mini" : true
				};
				var upButtonConfig = {
					"eleType" : "button",
					"type" : "button",
					"data-icon" : "arrow-u",
					"data-iconpos" : "right",
					"html" : "up",
					"data-inline" : true,
					"data-mini" : true
				};

				if (this.spinnerFieldData.disabled == true) {
					downButtonConfig.disabled = true;
					upButtonConfig.disabled = true;
					spinnerTextConfig.disabled = true;
				}
				this.downButtonObject = new cbx.lib.layer(downButtonConfig);
				this.upButtonObject = new cbx.lib.layer(upButtonConfig);
				if (this.spinnerFieldData.readOnlyInd.trim().toUpperCase() === "Y") {
					spinnerTextConfig.readonly = "true";
				}
				this.spinnerTextField = new cbx.lib.layer(spinnerTextConfig);
				var spinnerWrapConfig = {
							"eleType" : "div",
							"class" : "cbx-spinner_wrap"
						};
						this.spinnerWrap = new cbx.lib.layer(spinnerWrapConfig);
				textFieldObject.addLayer(this.spinnerTextField.getLayer());
				if (!this.isReadOnly) {
							this.spinnerWrap.addLayer(this.downButtonObject
									.getLayer());
				}
						this.spinnerWrap.addLayer(textFieldObject.getLayer());
				if (!this.isReadOnly) {
							this.spinnerWrap.addLayer(this.upButtonObject.getLayer());
				}
						this.spinnerObject.addLayer(this.spinnerWrap.getLayer());

				var that = this;

						this.upButtonObject.getLayer().onclick = function() {
							var bool = true;
							that.formManager
									.clearInvalid(that.spinnerFieldData.itemId);
							var value = that.spinnerTextField.getLayer().value;
							if (cbx.isEmpty(value)
									&& !cbx
											.isEmpty(that.spinnerFieldData.minValue)) {
								value = that.spinnerFieldData.minValue;
							}
							if (!cbx.isEmpty(value)
									&& (!cbx
											.isEmpty(that.spinnerFieldData.minValue))
									&& ((value) < (Number(that.spinnerFieldData.minValue)))) {
								value = Number(that.spinnerFieldData.minValue) - 1;
							}
							if (!cbx.isEmpty(value)
									&& (!cbx
											.isEmpty(that.spinnerFieldData.maxValue))
									&& ((value) > (Number(that.spinnerFieldData.maxValue)))) {
								value = Number(that.spinnerFieldData.maxValue) - 1;
							}
							value = isNaN(value) ? 1 : Number(value);

							if (!cbx.isEmpty(that.spinnerFieldData.minValue)
									&& ((value + 1) < (Number(that.spinnerFieldData.minValue)))) {
								bool = false;
							}
							if (!cbx.isEmpty(that.spinnerFieldData.maxValue)
									&& ((value + 1) > (Number(that.spinnerFieldData.maxValue)))) {
								bool = false;
							}
							if (bool) {
								if (that.formManager.model
										.getValue(that.spinnerFieldData.itemId) >= that.spinnerTextField
										.getLayer().value) {
									that.spinnerTextField.getLayer().value = ++value;
									that.formManager.model.updateValue(
											that.spinnerFieldData.itemId, that
													.getFormField().val());
									++value;
								} else if (that.getFormField().val() == ""
										|| that.getFormField().val() >= 0) {
									that.spinnerTextField.getLayer().value = value;
									that.formManager.model.updateValue(
											that.spinnerFieldData.itemId, that
													.getFormField().val());
									++value;
								}
							}
						},
						this.downButtonObject.getLayer().onclick = function() {
							var bool = true;
							that.formManager
									.clearInvalid(that.spinnerFieldData.itemId);
							var value = that.spinnerTextField.getLayer().value;
							if (cbx.isEmpty(value)
									&& !cbx
											.isEmpty(that.spinnerFieldData.minValue)) {
								value = that.spinnerFieldData.minValue;
							}
							if (!cbx.isEmpty(value)
									&& (!cbx
											.isEmpty(that.spinnerFieldData.minValue))
									&& ((value) < (Number(that.spinnerFieldData.minValue)))) {
								value = Number(that.spinnerFieldData.minValue) - 1;
							}
							if (!cbx.isEmpty(value)
									&& (!cbx
											.isEmpty(that.spinnerFieldData.maxValue))
									&& ((value) > (Number(that.spinnerFieldData.maxValue)))) {
								value = Number(that.spinnerFieldData.maxValue) + 2;

							}
							value = isNaN(value) ? 1 : Number(value);
							if (!cbx.isEmpty(that.spinnerFieldData.minValue)
									&& ((value - 1) < (Number(that.spinnerFieldData.minValue)))) {
								bool = false;
							}
							if (!cbx.isEmpty(that.spinnerFieldData.maxValue)
									&& ((value - 1) > (Number(that.spinnerFieldData.maxValue)))) {
								bool = false;
							}

							if (bool) {
								that.spinnerTextField.getLayer().value = --value;
								that.formManager.model.updateValue(
										that.spinnerFieldData.itemId, that
												.getFormField().val());
							}
						};

				this.setFormField($(this.spinnerTextField.getLayer()));

				var value = this.formManager.model.getModelData()[this.spinnerFieldData.itemId];
				if (!cbx.isEmpty(that.spinnerFieldData.minValue)) {
					that.setMinValue(that.spinnerFieldData.minValue);
				}
				if (!cbx.isEmpty(that.spinnerFieldData.maxValue)) {
					that.setMaxValue(that.spinnerFieldData.maxValue);
				}
				this.setValue(value);

			},
			enable : function() {
				$(this.downButtonObject.getLayer()).prop("disabled", false);
				$(this.upButtonObject.getLayer()).prop("disabled", false);
			},
			disable : function() {
				$(this.downButtonObject.getLayer()).prop("disabled", true);
				$(this.upButtonObject.getLayer()).prop("disabled", true);
			},
			getValue : function() {
				return this.getFormField().val();
			},
			setValue : function(value) {
				if (!isNaN(value)) {
					if (!cbx.isEmpty(this.spinnerFieldData.minValue)
							&& value < Number(this.spinnerFieldData.minValue)) {
						this.formManager.markInvalid(
								this.spinnerFieldData.itemId,
								this.spinnerFieldData.itemId
										+ " value should be greater than "
										+ this.spinnerFieldData.minValue);
					} else if (!cbx.isEmpty(this.spinnerFieldData.maxValue)
							&& value > Number(this.spinnerFieldData.maxValue)) {
						this.formManager.markInvalid(
								this.spinnerFieldData.itemId,
								this.spinnerFieldData.itemId
										+ " value should be greater than "
										+ this.spinnerFieldData.maxValue);
					}
					this.getFormField().val(value);

				}
			},
			setMinValue : function(minValue) {
				if (!cbx.isEmpty(minValue) && isNaN(minValue)) {
					this.spinnerFieldData.minValue = minValue;
				}
			},
			setMaxValue : function(maxValue) {
				if (!cbx.isEmpty(maxValue) && isNaN(maxValue)) {
					this.spinnerFieldData.maxValue = maxValue;
				}
			},
			setdefaultValue : function(defaultValue) {
				if (typeof defaultValue !== 'undefined' && isNaN(defaultValue)) {
					this.spinnerFieldData.defaultValue = defaultValue;
				}
			},
			getComponentDOM : function() {
				return this.spinnerObject.getLayer();
			},
			getValidationField : function() {
				return this.getFormField();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-spinnerfield'
}, cbx.lib.formElement.cbxSpinnerField);
/*
 * This class is reponsible for creating the static checkbox group
 */

cbx.lib.formElement.cbxStaticCheckBoxGroup = Class(
		cbx.core.Component,
		{
			isFormField : true,
			checkBoxGroupContainer : '',
			cbxStaticCheckBoxGroupConfig : '',
			valuesArray : '',
			formManager : null,
			canValidate : false,
			ctlCls : 'cbx-staticcheckboxgroup',
			rawKeys : null,
			rawValues : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticCheckBoxGroup.$super.call(this);
				this.setEleType("S", config);
				;
				this.cbxStaticCheckBoxGroupConfig = config;
				this.anchor = config.anchor;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.formManager = config.fm;
				this.bundleKey = config.bundleKey;
				this.xtype = config.xtype || "";
				this.rawKeys = config.rawKeys;
				this.rawValues = config.rawValues;
				this.createStaticCheckBoxGroup();
				this.valuesArray = [];
				this.addItem(this.checkBoxGroupContainer.getLayer());
			},
			// Instantiates checkbox group class
			createStaticCheckBoxGroup : function(config) {
				var checkBoxConfig;
				checkBoxConfig = {
					"eleType" : "fieldset",
					"class" : "staticChecbox",
					"data-role" : "controlgroup",
					"id" : this.cbxStaticCheckBoxGroupConfig.itemId,
					"style" : {/*
								 * "display" : (typeof
								 * this.cbxStaticCheckBoxGroupConfig.visibleInd
								 * !== 'undefined' &&
								 * (this.cbxStaticCheckBoxGroupConfig.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.cbxStaticCheckBoxGroupConfig.hidden==true)) ?
								 * "none" : "block"
								 */}
				};
				if (this.compositeField) {
					checkBoxConfig.style["width"] = this.anchor;
				}
				if (typeof this.cbxStaticCheckBoxGroupConfig.visibleInd !== 'undefined'
						&& (this.cbxStaticCheckBoxGroupConfig.visibleInd.trim()
								.toUpperCase() === 'N' || this.cbxStaticCheckBoxGroupConfig.hidden == true)) {
					checkBoxConfig["class"] = "ui-field-contain ui-body jqm-display-hide";

				}
				this.checkBoxGroupContainer = new cbx.lib.layer(checkBoxConfig);
				var checkBoxLabel = new cbx.lib.formElement.cbxLabel(
						this.cbxStaticCheckBoxGroupConfig).getComponentDOM();
				this.checkBoxGroupContainer.addLayer(checkBoxLabel);

				var dataEleConfig = {
					'eleType' : 'span',
					'class' : this.ctlCls,
					"name" : this.cbxStaticCheckBoxGroupConfig.itemId,
					"cbx-type" : "formField_"
							+ this.cbxStaticCheckBoxGroupConfig.itemType
				};
				var dataEleContainer = new cbx.lib.layer(dataEleConfig)
						.getLayer();
				this.setFormField($(dataEleContainer));
				this.checkBoxGroupContainer.addLayer(dataEleContainer);
				var value = this.formManager.model.getModelData()[this.cbxStaticCheckBoxGroupConfig.itemId];
				this.setValue(value);
			},
			parseRawData : function(val) {
				var sArray = [];
				if (val != "" && val != null) {
					val = val + '';
					var splitValue = val.split(',');
					for ( var i = 0; i < splitValue.length; i++) {
						sArray.push(splitValue[i]);
					}
				}
				this.valuesArray = sArray;
			},
			getValidationField : function() {
				return $("");
			},
			// Getting the rawValues array
			getValuesArray : function() {
				return this.valuesArray;
			},
			/**
			 * Method checks for the default item value exists.
			 */
			getItemValue : function() {
				var valArray = this.getValuesArray();
				var dataArray = [];
				if (this.rawKeys != null && this.rawValues != null) {
					for ( var i = 0; i < this.rawKeys.length; i++) {
						if (valArray.length > 0
								&& valArray.contains(this.rawValues[i])) {
							dataArray.push(CRB.getBundle(cbx.jsutil
									.getBundleKey(this))['LBL_'
									+ this.rawKeys[i]]
									|| this.rawKeys[i]);
						}
					}
				}
				return dataArray.toString();
			},
			
			setValue : function(val) {
				if (cbx.isArray(val)) {
					this.valuesArray = val;
				} else {
					this.parseRawData(val);
				}
				var value = this.getItemValue();
				if (cbx.isEmpty(value)) {
					value = '--';
				} else {
					this.getFormField().html(value);
				}
			},
			// Returns the DOM element of checkbox group
			getComponentDOM : function() {
				return this.checkBoxGroupContainer.getLayer();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-checkboxgroupstaticfield'
}, cbx.lib.formElement.cbxStaticCheckBoxGroup);

/*
 * This class is reponsible for creating the static combobox
 */

cbx.lib.formElement.cbxStaticComboBox = Class(
		cbx.core.Component,
		{
			isFormField : true,
			comboBoxContainer : '',
			staticCBConfig : '',
			ctlCls : 'cbxstaticfield', 
			canValidate : false,
			addData : null,
			formManager : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticComboBox.$super.call(this);
				this.setEleType("S", config);
				this.triggerField = true;
				this.anchor = config.anchor;
				this.staticCBConfig = config;
				this.bundleKey = config.bundleKey || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.xtype = config.xtype || "";
				this.addData = config.addData;
				this.formManager = config.fm;
				this.cbxStaticComboBox();
				this.addItem(this.comboBoxContainer.getLayer());
			},
			// Instantiates combobox class
			cbxStaticComboBox : function(config) {
				var cbContainerConfig = {
					"eleType" : "div",
					"class" : "staticfield staticcombo",
					"id" : this.staticCBConfig.itemId,
					"data-role" : "fieldcontain",
					"style" : {/*
								 * "display" : (typeof
								 * this.staticCBConfig.visibleInd !==
								 * 'undefined' &&
								 * (this.staticCBConfig.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.staticCBConfig.hidden == true)) ? "none" :
								 * "block"
								 */}
				};
				if (this.compositeField) {
					cbContainerConfig.style["width"] = this.anchor;
				}
				
				if (typeof this.staticCBConfig.visibleInd !== 'undefined'
						&& (this.staticCBConfig.visibleInd.trim().toUpperCase() === 'N' || this.staticCBConfig.hidden == true)) {
					cbContainerConfig["class"] = cbContainerConfig["class"] + "ui-field-contain ui-body jqm-display-hide";

				}
				
				this.comboBoxContainer = new cbx.lib.layer(cbContainerConfig);
				var scLabel = new cbx.lib.formElement.cbxLabel(
						this.staticCBConfig).getComponentDOM();
				this.comboBoxContainer.addLayer(scLabel);

				if (typeof this.staticCBConfig.customClass !== 'undefined'
						&& this.staticCBConfig.customClss !== '') {
					this.ctlCls = this.staticCBConfig.customClass;
				}
				var dataEleConfig = {
					'eleType' : 'span',
					'class' : this.ctlCls,
					"name" : this.staticCBConfig.itemId,
					"cbx-type" : "formField_" + this.staticCBConfig.itemType
				};
				var dataEleContainer = new cbx.lib.layer(dataEleConfig)
						.getLayer();
				this.dataEleContainer = dataEleContainer;
				this.comboBoxContainer.addLayer(dataEleContainer);
				this.addItem(this.comboBoxContainer.getLayer());
				this.setFormField($(dataEleContainer));
				// creating the data element
				var value = this.formManager.model.getModelData()[this.staticCBConfig.itemId];
				value = this.getItemValue(value) || '--';
				this.setValue(value);

			},
			setValue : function(val) {
				var value = this.getItemValue(val) || val;
				this.getFormField().html(value);
			},
			getItemValue : function(value) {
				var out = "";
				if (typeof this.addData !== 'undefined'
						&& this.addData.length > 0) {
					for ( var i = 0; i < this.addData.length; i++) {
						if (this.addData[i]['rawKey'] === value) {
							out = this.addData[i]['rawValue'];
							return out;
						}
					}
					for ( var i = 0; i < this.addData.length; i++) {
						if (this.addData[i]['rawValue'] === value) {
							out = this.addData[i]['rawValue'];
							return out;
						}
					}
				}
				return out;
			},
			updateComboRawStore : function(rawKey,rawValue){
				this.addData=[];
				if (rawKey.length !== rawValue.length) {
					// keys and values should be arrays of same length
					return;
				}
				else{
					if(rawKey.length>0){
						for(var i=0;i<rawKey.length;i++){
							var tmpObj={
									'rawKey':rawKey[i],
									'rawValue':rawValue[i]
							};
							this.addData.push(tmpObj);
						}
					}
				}
				this.setValue(this.formManager.model.getValue(this.staticCBConfig.itemId));
			},
			rePopulateAdditionaldata : function(additionalData) {
				if (typeof additionalData !== 'undefined'
						&& additionalData.length > 0) {
					this.addData = additionalData;
					this.setValue(this.formManager.model
							.getValue(this.staticCBConfig.itemId));
				}
			},
			// Returns the DOM object of combobox
			getComponentDOM : function() {
				return this.comboBoxContainer.getLayer();
			},
			getValidationField : function() {
				return $("");
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-staticcombobox'
}, cbx.lib.formElement.cbxStaticComboBox);

/*
 * This class is reponsible for creating the static radiogroup
 */
cbx.lib.formElement.cbxStaticRadioGroup = Class(
		cbx.core.Component,
		{
			canValidate : false,
			isFormField : true,
			sRGContainerContainer : '',
			staticRGroupConfig : null,
			ctlCls : 'cbx-staticradtiogroup',
			formManager : null,
			rawKeys : null,
			rawValues : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticRadioGroup.$super.call(this);
				this.setEleType("S", config);
				;
				this.staticRGroupConfig = config;
				this.anchor = config.anchor;
				this.formManager = config.fm;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.rawKeys = config.rawKeys;
				this.xtype = config.xtype || "";
				this.rawValues = config.rawValues;
				this.bundleKey = config.bundleKey;
				this.staticRGroupConfig.disabled = true;
				this.createStaticRadioGroup();
				this.addItem(this.sRGContainerContainer.getLayer());
			},
			// Instantiates radiogroup class
			createStaticRadioGroup : function(config) {
				var sRGContainerConfig = {
					'eleType' : 'div',
					"data-role" : "fieldcontain",
					"class" : "staticfield staticradiogroup",
					"id" : this.staticRGroupConfig.itemId,
					"style" : {/*
								 * "display" : (typeof
								 * this.staticRGroupConfig.visibleInd !==
								 * 'undefined' &&
								 * (this.staticRGroupConfig.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.staticRGroupConfig.hidden==true)) ?
								 * "none" : "block"
								 */}
				};
				if (this.compositeField) {
					sRGContainerConfig.style["width"] = this.anchor;
				}
				if (typeof this.staticRGroupConfig.visibleInd !== 'undefined'
						&& (this.staticRGroupConfig.visibleInd.trim()
								.toUpperCase() === 'N' || this.staticRGroupConfig.hidden == true)) {
					sRGContainerConfig["class"] = "ui-field-contain ui-body jqm-display-hide";

				}
				this.sRGContainerContainer = new cbx.lib.layer(
						sRGContainerConfig);
				var sRGLabel = new cbx.lib.formElement.cbxLabel(
						this.staticRGroupConfig).getComponentDOM();
				this.sRGContainerContainer.addLayer(sRGLabel);

				var dataEleConfig = {
					'eleType' : 'span',
					'class' : this.ctlCls,
					"name" : this.staticRGroupConfig.itemId,
					"cbx-type" : "formField_"
							+ this.staticRGroupConfig.itemType
				};
				var dataEleContainer = new cbx.lib.layer(dataEleConfig)
						.getLayer();
				this.setFormField($(dataEleContainer));
				this.sRGContainerContainer.addLayer(dataEleContainer);
				var value = this.formManager.model.getModelData()[this.staticRGroupConfig.itemId];
				this.setValue(value);
			},

			setValue : function(value) {
				var value = this.getItemValue(value);
				if (cbx.isEmpty(value)) {
					this.getFormField().html('--');
				}
				this.getFormField().html(value);
			},
			getItemValue : function(value) {
				var out = "";
				if (this.rawKeys !== null && this.rawValues !== null) {
					for ( var i = 0; i < this.rawKeys.length; i++) {
						if (this.rawValues[i] === value) {
							out = CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_'
									+ this.rawKeys[i]]
									|| this.rawKeys[i];
							return out;
						}
					}
				}
				return out;
			},
			// Returns the DOM object of radiogroup
			getComponentDOM : function() {
				return this.sRGContainerContainer.getLayer();
			},
			getValidationField : function() {
				return $("");
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-radiogroupstaticfield'
}, cbx.lib.formElement.cbxStaticRadioGroup);

/*
 * This class is reponsible for creating the static textarea
 */

cbx.lib.formElement.cbxStaticTextArea = Class(
		cbx.core.Component,
		{
			canValidate : false,
			isFormField : true,
			textAreaContainer : null,
			staticTextAreaConfig : null,
			NO_ROWS : 5,
			formManager : null,
			value : '',
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticTextArea.$super.call(this);
				this.setEleType("S", config);
				;
				this.formManager = config.fm;
				this.anchor = config.anchor;
				this.bundleKey = config.bundleKey || "";
				this.staticTextAreaConfig = config;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.xtype = config.xtype || "";
				this.createStaticTextArea();
				this.addItem(this.textAreaContainer.getLayer());
			},
			createStaticTextArea : function() {
				var staContainerConfig = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"class" : "staticfield statictextarea",
					"id" : this.staticTextAreaConfig.itemId,
					"style" : {/*
								 * "display" : (typeof
								 * this.staticTextAreaConfig.visibleInd !==
								 * 'undefined' &&
								 * (this.staticTextAreaConfig.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.staticTextAreaConfig.hidden==true)) ?
								 * "none" : ""
								 */}
				};
				if (this.compositeField) {
					staContainerConfig.style["width"] = this.anchor;
				}
				if (typeof this.staticTextAreaConfig.visibleInd !== 'undefined'
						&& (this.staticTextAreaConfig.visibleInd.trim()
								.toUpperCase() === 'N' || this.staticTextAreaConfig.hidden == true)) {
				
					staContainerConfig["class"] = staContainerConfig["class"] + "ui-field-contain ui-body statictextarea jqm-display-hide";
				
				}
				this.textAreaContainer = new cbx.lib.layer(staContainerConfig);
				// creating the label by instantiating the cbxLabel class
				var staLabelComponent = new cbx.lib.formElement.cbxLabel(
						this.staticTextAreaConfig).getComponentDOM();
				this.textAreaContainer.addLayer(staLabelComponent);

				// creatig the static text area
				
				var staConfig = {
					"eleType" : "span",
					"class" : "cbxstaticfield statictextarea",
			
					"name" : this.staticTextAreaConfig.itemId,
					"cbx-type" : "formField_"
							+ this.staticTextAreaConfig.itemType,
					'style' : {
						'resize' : 'none'
					},
					"readonly" : "readonly"
				};
				var staComponent = new cbx.lib.layer(staConfig).getLayer();
				this.textAreaContainer.addLayer(staComponent);
				this.setFormField($(staComponent));
				var textAreaValue = this.formManager.model.getModelData()[this.staticTextAreaConfig.itemId];
				if (typeof textAreaValue === 'undefined'
						|| textAreaValue === '') {
					textAreaValue = '--';
				}
				this.setValue(textAreaValue);
			},
			
			getValue : function() {
				return this.getFormField().html();
			},
			setValue : function(value) {
				this.getFormField().html(value);
				setTimeout(function(){                 /*start CTMQ315F15*/
					if( this.childItems.formMode == "VIEW" ){
						doIScroll('CONTENT_DIV');
						doIScroll('CONTENT_DIV','add');
					}else{
						doIScroll('CONTENT_DIV','refresh');
					}
				},200)									/* ends CTMQ315F15 */
			},
			
			// Returns the DOM object of textarea
			getComponentDOM : function() {
				return this.textAreaContainer.getLayer();
			},
			getValidationField : function() {
				return $("");
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-statictextarea'
}, cbx.lib.formElement.cbxStaticTextArea);


cbx.lib.formElement.cbxTextArea = Class(
		cbx.core.Component,
		{
			canValidate : true,
			isFormField : true,
			textAreaContainerObject : null,
			NO_ROWS : 5,
			maxLength : 0,
			textAreaObject : null,
			formManager : null,
			constructor : function(confg) {
				cbx.apply(this, confg);
				cbx.lib.formElement.cbxTextArea.$super.call(this);
				this.config = confg;
				this.anchor = confg.anchor;
				this.formManager = confg.fm;
				
				this.maxLength = confg.maxLength;
				this.minLength = confg.minLength;
				this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
				this.validationType = this.config.vType;
				
				this.bundleKey = confg.bundleKey || "";
				this.compositeField = confg.compositeField ? confg.compositeField
						: false;
				this.createTextArea(confg);
				this.xtype = confg.xtype || "";
				this.addItem(this.textAreaContainerObject.getLayer());
				if (this.config.disabled == true) {
					this.disable();
				}
				this.setEleType("N", confg);
				;
			},
			createTextArea : function() {
				var displayLabelName;
				this.textAreaObject = null;
				var textAreaContainerConfig = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"class" : "ui-field-contain ui-body jqm-form-field-c jqm-cbxTextArea",
					"id" : this.config.itemId,
					"style" : {/*
								 * "display" : (typeof this.config.visibleInd
								 * !== 'undefined' && (this.config.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.config.hidden==true)) ? "none" : ""
								 */}
				};
				if (this.compositeField) {
					textAreaContainerConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.config.visibleInd !== 'undefined'
						&& (this.config.visibleInd.trim().toUpperCase() === 'N' || this.config.hidden == true)) {
					textAreaContainerConfig["class"] = "ui-field-contain ui-body jqm-display-hide";
				}
				if (this.config.plainLbl != null
						&& $.trim(this.config.plainLbl) !== "") {
					this.fieldLabel = this.config.plainLbl;
				} else {
					this.fieldLabel = this.getDisplayNameKey(this.config);
				}
				
				if (!cbx.isEmpty(this.validationType)) {

					var registeredVtypes = cbx.form.vTypeRegistry.getVtypes();

					for ( var i = 0; i < registeredVtypes.length; i++) {

						if (this.validationType == registeredVtypes[i].name) {

							this.config.maskRe = registeredVtypes[i].mask;

							this.config.invalidText = registeredVtypes[i].text;
							
							this.config.globalRe = registeredVtypes[i].globalRe;
						
							break;

						} else if (this.validationType == 'alphaNumeric'
								|| this.validationType == 'numeric'
								|| this.validationType == 'portalSupported') {

						} else {

						}

					}
				}
				this.textAreaContainerObject = new cbx.lib.layer(
						textAreaContainerConfig);

				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.config);
				this.textAreaContainerObject.addLayer(cbxLabelObj
						.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');
				if (cbx.isEmpty(this.config.maxLength)) {
					
					this.config.maxCharsPerLine = cbx
							.isEmpty(this.config.maxCharsPerLine) ? 40
							: Number(this.config.maxCharsPerLine);
					
					if (typeof this.config.maxNumLines !== 'undefined') {
						this.maxLength = Number(this.config.maxCharsPerLine)
								* this.config.maxNumLines;

					}
				}
				textAreaConfig = {
					"eleType" : "textarea",
					"cols" : this.config.maxCharsPerLine || 40,
					"rows" : this.NO_ROWS || 8,
					"id" : this.config.itemId + "_field",
					"name" : this.config.itemId,
					"class" : "cbx-textarea",
					"grow" : "true",
					"wrap" : "virtual",
					
					"cbx-type" : "formField_" + this.config.itemType,
					"style":{
						'display':'inline-block'
					}
					
				};

				if (!cbx.isEmpty(this.maxLength)
						&& (parseInt(this.maxLength) > 0)) {
					textAreaConfig.maxlength = this.maxLength;
				}
				if (typeof this.config.readOnlyInd !== 'undefined'
						&& this.config.readOnlyInd.trim().toUpperCase() === "Y") {
					textAreaConfig.readonly = "true";
				}
				this.textAreaObject = new cbx.lib.layer(textAreaConfig);
				this.textAreaContainerObject.addLayer(this.textAreaObject
						.getLayer());
				this.setFormField($(this.textAreaObject.getLayer()));
				var that = this;
				
				/*this.textAreaObject.getLayer().onkeypress = function(evt) {
					if (that.config.vType.trim().toUpperCase() === "ALPHANUMERIC") {
						var exp = String.fromCharCode(evt.charCode);
						var r = new RegExp("[A-Za-z0-9]", "g");
						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else if (that.config.vType.trim().toUpperCase() === "NUMERIC") {
						var exp = String.fromCharCode(evt.charCode);
						var r = '';
						if (that.config.allowSpaces) {
							r = new RegExp("[0-9 ]", "g");
						} else {
							r = new RegExp("[0-9]", "g");
						}

						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else if (that.config.vType.trim().toUpperCase() === "PORTALSUPPORTED") {
						var exp = String.fromCharCode(evt.charCode);
						if (that.config.allowSpaces) {
							r = new RegExp(
									"^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$", "g");
							// r = new RegExp("[^<>;{}()!=&\'\"]", "g");
						} else {
							r = new RegExp("[0-9]", "g");
						}

						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else {
						if (!cbx.isEmpty(that.config.vtype)
								&& !cbx.isEmpty(that.config.maskRe)) {
							var exp = String.fromCharCode(evt.charCode);
							try {
								var r = new RegExp(that.config.maskRe, "g");
								if (exp.match(r) == null) {
									evt.charCode = 0;
									return false;
								}

							} catch (err) {
							}
						}
					}
					
					if (!cbx.isEmpty(that.config.maxLength)
							&& !cbx.isEmpty(that.config.maxNumLines)) {
						var keycode = evt.keyCode ? evt.keyCode : evt.which;
						if (keycode !== 8 && keycode !== 46) {
							if (that.getValue().match(/\n/g) !== null
									&& Number(that.config.maxNumLines) === Number(that
											.getValue().match(/\n/g).length)) {
								return false;
							} else {
								if (that.getValue() !== 'undefined'
										&& that.getValue().length >= that.config.maxLength) {
									
									return false;
								}
							}
						}

					}
				};*/
			
				this.setFormField($(this.textAreaObject.getLayer()));
				var textAreaValue = this.formManager.model.getModelData()[this.config.itemId];
				if (!cbx.isEmpty(textAreaValue)) {
					this.setValue(textAreaValue);
				}
					// var that = this;
				this.registerDefaultValidation(that);
			
				$(this.textAreaObject.getLayer()).bind(
						'change',
						this,
						function(event) {
							that.formManager.model.updateValue(
									that.config.itemId, that.getValue());
							that.formManager.clearInvalid(that.config.itemId);
						});

			},
			getValidationField : function() {
				return this.getFormField();
			},

			getValue : function() {
				return this.getFormField().val();
			},
			setValue : function(value) {
				this.getFormField().val(value);
				this.validator(value);
			},
			getComponentDOM : function() {
				return this.textAreaContainerObject.getLayer();
			},
			validator : function(value) {
				if (!cbx.isEmpty(value)) {
					if (this.getValue().match(/\n/g) !== null
							&& Number(that.config.maxNumLines) === Number(this
									.getValue().match(/\n/g).length)) {
						this.formManager
								.markInvalid(
										this.config.itemId,
										CRB.getFWBundle().ERR_INVALID_NUMBER_OF_LINES);
					} else {
						if (this.getValue() !== 'undefined'
								&& this.getValue().length >= this.maxLength) {
							var commonbundle = CRB.getFWBundle();
							var maxLengthErrText = String.format(
									commonbundle['ERR_MAXLENGTH_EXCEED'],
									this.label, this.maxLength);
							this.formManager.markInvalid(this.config.itemId,
									maxLengthErrText);
						}
					}
				}
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-textarea'
}, cbx.lib.formElement.cbxTextArea);

/*
 * This class is reponsible for creating the TEXTFIELD,AMOUNTFIELD,DATEFIELD
 * 
 
 */
/**

 cross check the validation messages

 */

cbx.lib.formElement.cbxTextField = Class(
		cbx.core.Component,
		{
			canValidate : true,
			isFormField : true,
			config : null,
			enableKeyEvents : true,
			formManager : null,
			constructor : function(config) {
				cbx.apply(this, config);
				cbx.lib.formElement.cbxTextField.$super.call(this);
				this.config = config;
				this.xtype = config.xtype;
				
				this.maxLength = config.maxLength;
				this.minLength = config.minLength;
				this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
				this.itemId = config.itemId;
				this.validationType = config.vType;
			
				this.anchor = config.anchor;
				// this.minWidth=
				this.formManager = config.fm;
				this.bundleKey = config.bundleKey || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.createTextField();
				this.addItem(this.formCmponentObject.getLayer());
				if (this.config.disabled == true) {
					this.disable();
				}
				this.setEleType("N", config);
				;
			},
			createTextField : function() {
				var displayLabelName;
				this.inputFieldObject = null;
				this.formCmponentObject = null;
				configData = this.config;

				formConfig = {
					eleType : "div",
					"data-role" : "fieldcontain",
					"class" : "ui-field-contain ui-body jqm-form-field-c jqm-cbxTextField",
					"id" : this.config.itemId,
					"style" : {/*
								 * "display" : (typeof configData.visibleInd !==
								 * 'undefined' && (configData.visibleInd 
								 * .trim().toUpperCase() === 'N' ||
								 * configData.hidden == true)) ? "none" :
								 * "block"
								 */}
				};
				if (this.compositeField) {
					formConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof configData.visibleInd !== 'undefined'
						&& (configData.visibleInd.trim().toUpperCase() === 'N' || configData.hidden == true)) {
					formConfig["class"] = "ui-field-contain ui-body jqm-display-hide";

				}
				
				if (!cbx.isEmpty(this.validationType)) {

					var registeredVtypes = cbx.form.vTypeRegistry.getVtypes();

					for ( var i = 0; i < registeredVtypes.length; i++) {

						if (this.validationType == registeredVtypes[i].name) {

							this.config.maskRe = registeredVtypes[i].mask;

							this.config.invalidText = registeredVtypes[i].text;
							
							this.config.globalRe = registeredVtypes[i].globalRe;

							break;
					
						} else if (this.validationType == 'alphaNumeric'
								|| this.validationType == 'numeric'
								|| this.validationType == 'portalSupported') {

						} else {

						}

					}
				}
				this.formCmponentObject = new cbx.lib.layer(formConfig);
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(configData);

				this.formCmponentObject.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');

				if (typeof configData.itemType !== 'undefined'
						&& configData.itemType.trim().toUpperCase() === "TEXT") {
					fieldConfig = this.getFieldConfig(configData.itemId);
					if (!cbx.isEmpty(configData.maxLength)) {
						fieldConfig.maxlength = configData.maxLength;
					}
					this.inputFieldObject = new cbx.lib.layer(fieldConfig);
					this.formCmponentObject.addLayer(this.inputFieldObject
							.getLayer());
				}

				var that = this;
				if (configData.itemType !== ""
						&& !cbx.isEmpty(this.inputFieldObject)) {
					
					/*this.inputFieldObject.getLayer().onkeypress = function(evt) {

						if (that.config.vType.trim().toUpperCase() === "ALPHANUMERIC") {
							var exp = String.fromCharCode(evt.charCode);
							var r = new RegExp("[A-Za-z0-9]", "g");
							if (exp.match(r) == null) {
								evt.charCode = 0;
								return false;
							}
						} else if (that.config.vType.trim().toUpperCase() === "NUMERIC") {
							var exp = String.fromCharCode(evt.charCode);
							var r = '';
							if (that.config.allowSpaces) {
								r = new RegExp("[0-9 ]", "g");
							} else {
								r = new RegExp("[0-9]", "g");
							}

							if (exp.match(r) == null) { 
								evt.charCode = 0;
								return false;
							}
						} else if (that.config.vType.trim().toUpperCase() === "PORTALSUPPORTED") {
							var exp = String.fromCharCode(evt.charCode);
							if (that.config.allowSpaces) {
								r = new RegExp(
										"^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$",
										"g");
							} else {
								r = new RegExp("[0-9]", "g");
							}

							if (exp.match(r) == null) {
								evt.charCode = 0;
								return false;
							}
						} else {
							if (!cbx.isEmpty(that.config.vtype)
									&& !cbx.isEmpty(that.config.maskRe)) {
								var exp = String.fromCharCode(evt.charCode);
								try {
									var r = new RegExp(that.config.maskRe, "g");
									if (exp.match(r) == null) {
										evt.charCode = 0;
										return false;
									}

								} catch (err) {
									
								}
							}
						}
						if (typeof that.config.maxLength !== 'undefined'
								&& that.config.maxLength > 0) {
							if (typeof $('#' + that.config.itemId).val() !== 'undefined'
									&& $('#' + that.config.itemId).val().length >= that.config.maxLength) {
								return false;
							}
						}
					};*/
					
					/*
					 * this.inputFieldObject.getLayer().onkeyup = function() {
					 * if (that.formManager.model.getValue(that.config.itemId)
					 * !== $('#'+that.config.itemId).val()) {
					 * that.formManager.model.updateValue(that.config.itemId,$('#'+that.config.itemId).val(),true); } };
					 */
					this.setFormField($(this.inputFieldObject.getLayer()));
					this.registerDefaultValidation(that);
					$(this.inputFieldObject.getLayer()).bind('change', this,
							function(event) {
								event.data.syncModelData.apply(event.data);
							});
					
					/*
					 * this.getFormField().on('tap', function(event) {
					 * doIScroll('CONTENT_DIV','remove'); });
					 * this.getFormField().on('focusout', function(event) {
					 * that.refreshScroll(); });
					 */
					/*
					 * $(this.inputFieldObject.getLayer()).bind('blur', this,
					 * function(event) { that.refreshScroll(); });
					 */
				
					var fieldValue = this.formManager.model.getModelData()[this.config.itemId];
					if (!cbx.isEmpty(fieldValue)) {
						this.setValue(fieldValue);
					}

				}
			},
			getValidationField : function() {
				return this.getFormField().parent();

			},
			/**
			 * Method updates the modal with fieldname and current value
			 */
			syncModelData : function() {
				
				if (!cbx.isEmpty(this.config.multiInd)
						&& this.config.multiInd == true
						&& !cbx.isEmpty(this.config.index)) {
					if (this.formManager.handlerEvent('cbxvalidate',
							this.config.itemId, this.getValue(), this.index,
							this.multiFormId) === false) {
						return;
					}
				} else if (this.formManager.handlerEvent('cbxvalidate',
						this.config.itemId, this.getValue()) === false) {
					return;
				}
				if (!cbx.isEmpty(this.config.multiInd)
						&& this.config.multiInd == true
						&& !cbx.isEmpty(this.config.index)) {
					this.formManager.model.updateValue(this.config.itemId, this
							.getValue(), undefined, this.index,
							this.multiFormId);
				
					/*
					 * Textfield updateValue will be called upon actual value
					 * change only
					 */
				} else if (this.formManager.model.getValue(this.config.itemId) !== this
						.getValue()) {
					this.formManager.model.updateValue(this.config.itemId, this
							.getValue());
				}
				this.formManager.clearInvalid(this.itemId);
			
				// this.formManager.updateScreenViewData(this.formManager);
			

			},
			getFieldConfig : function() {
				var boxType ="text";
				if( this.validationType.trim().toUpperCase() == "NUMERIC" )
				{
					if( cbx.isChrome() == true ){
						boxType ="number";
					}
				}
				fieldConfigData = {
					"eleType" : "input",
					"name" : this.config.itemId,
					"id" : this.config.itemId + "_field",
					"class" : "cbx-textbox",
					"type" : boxType,
					"cbx-type" : "formField_" + this.config.itemType
				};
				if (this.config.readOnlyInd.trim().toUpperCase() == "Y"
						|| this.config.readOnly == true) {
					fieldConfigData.readonly = "true";
				}
				return fieldConfigData;
			},
			getValue : function() {
				return this.getFormField().val();
			},
			setValue : function(value) {
				this.getFormField().val(value);
			},
			getComponentDOM : function() {
				return this.formCmponentObject.getLayer();
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-textfield'
}, cbx.lib.formElement.cbxTextField);


cbx.lib.formElement.LazzyFormPanel = Class(
		cbx.core.Component,
		{
			canValidate : false,
			isFormField : false,
			formData : '',
			formPanel : null,
			formManager : null,
			childItems : null,
			lazzyFormPanelContainer : null,
			constructor : function(config) {
				cbx.lib.formElement.LazzyFormPanel.$super.call(this);
				this.formData = config.formData;
				this.formPanel = config.formPanel;
				this.formManager = config.formManager;
				this.mode = config.mode;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.strictMode = config.strictMode || false;
				this.xtype = config.xtype || "";
				this.setEleType("N", config);
				;
				/* Creation of lazzyformpeanl container */
				var lazzyFormPanelConfig = {
					'eleType' : 'div',
					'id' : this.formData.formId + '_lazzypanel',
					'class' : 'lazzyformpanel'
				};
				this.lazzyFormPanelContainer = new cbx.lib.layer(
						lazzyFormPanelConfig).getLayer();
				this.addItem(this.lazzyFormPanelContainer);
				if (config.mode == "TOP") {
					$(this.formPanel).prepend(this.lazzyFormPanelContainer);
				} else {
					$(this.formPanel).append(this.lazzyFormPanelContainer);
				}
				
				var that = this;
				var iterateFormElements = function() {
					this.childItems = that.createItems();
					this.childItems.formMode = "VIEW";    /*CTMQ315F15*/
					var childItems = this.childItems;
					if (typeof childItems !== 'undefined'
							&& childItems.length > 0) {
						for ( var chItem = 0; chItem < childItems.length; chItem++) {
							/**
							 * start CTMQ315F15
							 */
							if( childItems[chItem].editableInd == "Y" && childItems[chItem].readOnlyInd == "N" )    
								this.childItems.formMode = "EDIT";	
							
							/**
							 * ends CTMQ315F15
							 */
							
							if (typeof childItems[chItem].xtype !== 'undefined') {
								if (that.strictMode) {
									childItems[chItem].mode = that.mode;
								}
								var cClass = CFCR.getFormCmp({
									'COMP_TYPE' : childItems[chItem].xtype
								});
								if (cClass) {
									if (childItems[chItem].xtype == "cbx-lazzyformpanel") {
										new cClass({
											'formPanel' : that.getItem(0),
											'formData' : childItems[chItem],
											'formManager' : that.formManager
										});
									} /*
										 * else if
										 * (this.childItems[chItem].xtype ==
										 * "cbx-lazzypanel") { new cClass( {
										 * 'formPanel' : that .getItem(0),
										 * 'formData' : this.childItems[chItem],
										 * 'formManager' : that.formManager }); }
										 */else {
										if (childItems[chItem].xtype == "cbx-combobox" || childItems[chItem].xtype == "cbx-datefield") {
											childItems[chItem]['additionalData'] = that.formData.additionalData[childItems[chItem].itemId];
										} else if (childItems[chItem].xtype == "cbx-fieldset"
												|| childItems[chItem].xtype == "cbx-lazzypanel") {
											childItems[chItem]['additionalData'] = that.formData.additionalData[childItems[chItem].itemId];
										}
										childItems[chItem]['fm'] = that.formManager;
										var componentDOM = new cClass(
												childItems[chItem])
												.getComponentDOM();
										that.lazzyFormPanelContainer
												.appendChild(componentDOM);
									}
								}
							}
						}
					}
				};

				iterateFormElements();
				
			},
			createItems : function() {
				var config = {
					formId : this.formData.formId,
					model : this.formManager.model,
					mode : this.mode || this.formManager.mode,
					manager : this.formManager,
					preInitConfig : this.formManager.preInitConfig,
					metadata : this.formData,
					screenView : this.formManager.screenView
				};
				// Retrieving formfield items
				var formCreator = new cbx.form.FormCreator(config);
				return formCreator.getFormFields();
			},
			getFormDOM : function() {
				return this.formPanel.getForm();
			}

		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-lazzyformpanel'
}, cbx.lib.formElement.LazzyFormPanel);
/*
 * This class is reponsible for Instantiate the cbxStaticField.
 * 

 * 
 */
cbx.lib.formElement.cbxStaticField = Class(
		cbx.core.Component,
		{
			canValidate : false,
			isFormField : true,
			staticFieldConfig : null,
			staticField : null,
			staticFieldContainer : null,
			ctlCls : 'cbxstaticfield',
			formManager : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticField.$super.call(this);
				this.setEleType("S", config);
				this.anchor = config.anchor;
				this.formManager = config.fm;
				this.bundleKey = config.bundleKey || "";
				this.staticFieldConfig = config;
				this.staticFieldConfig['ctlCls'] = this.ctlCls;
				this.xtype = config.xtype || "";
				var staticFieldConfig;
				this.compositeField = config.compositeField ? config.compositeField
						: false;

				staticFieldConfig = {
					'eleType' : 'div',
					'id' : this.staticFieldConfig.itemId,
					"data-role" : "fieldcontain",
					'class' : "staticfield",
					"style" : {/*
								 * "display" : (typeof config.visibleInd !==
								 * 'undefined' && (config.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * config.hidden == true)) ? "none" : "block"
								 */}
				};
				if (this.compositeField) {
					staticFieldConfig.style["width"] = this.anchor;
				}
				if (typeof config.visibleInd !== 'undefined'
						&& (config.visibleInd.trim().toUpperCase() === 'N' || config.hidden == true)) {
					staticFieldConfig["class"] = staticFieldConfig["class"]
							+ " ui-field-contain ui-body jqm-display-hide"; 

				}
				this.staticFieldContainer = new cbx.lib.layer(staticFieldConfig);
				if (typeof this.staticFieldConfig.customClass !== 'undefined') {
					this.ctlCls = this.staticFieldConfig.customClass;
				}
				var fieldValue = this.formManager.model.getModelData()[this.staticFieldConfig.itemId];
				var staticFieldConfig = {
					'eleType' : 'span',
					'value' : fieldValue,
					'name' : this.staticFieldConfig.itemId,
					'class' : this.ctlCls,
					'disabled' : 'disabled',
					"cbx-type" : "formField_" + this.staticFieldConfig.itemType
				};
				this.staticField = new cbx.lib.layer(staticFieldConfig);
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
						this.staticFieldConfig).getComponentDOM();
				this.staticFieldContainer.addLayer(cbxLabelObj);
				this.staticFieldContainer.addLayer(this.staticField.getLayer());
				this.addItem(this.staticFieldContainer.getLayer());
				this.setFormField($(this.staticField.getLayer()));
				if (!cbx.isEmpty(fieldValue)) {
					this.setValue(fieldValue);
				} else {
					this.setValue('--');
				}
			},
			getComponentDOM : function() {
				return this.staticFieldContainer.getLayer();
			},
			setValue : function(value) {
				this.getFormField().html(value);
				doIScroll('CONTENT_DIV','refresh');
			},
			getValue : function() {
				return this.getFormField().val();
			},
			getValidationField : function() {
				return $("");
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-staticfield'
}, cbx.lib.formElement.cbxStaticField);

/* This class is used for to create the image */

cbx.lib.formElement.cbxLogo = Class(
		cbx.core.Component,
		{
			canValidate : false,
			isFormField : true,
			logoConfig : null,
			logoContainer : null,
			containerClass : 'cbx-logo-container',
			imageClass : 'cbx-logo',
			constructor : function(config) {
				cbx.lib.formElement.cbxLogo.$super.call(this);
				this.logoConfig = config;
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.xtype = config.xtype || "";
					//if (this.logoConfig.customContainerClass !== 'undefined') {
					if ( !cbx.isEmpty(this.logoConfig.customContainerClass) ) {
						this.containerClass = this.logoConfig.customContainerClass;
					}
					//if (this.logoConfig.customImageClass !== 'undefined') {
					if ( !cbx.isEmpty(this.logoConfig.customImageClass) ) {
						this.imageClass = this.logoConfig.customImageClass;
					}
					this.setEleType("N", config);
					;
					var logoContainerConfig;
					logoContainerConfig = {
						'eleType' : 'div',
						'id' : this.logoConfig.itemId,
						'class' : this.containerClass
					};
					this.logoContainer = new cbx.lib.layer(logoContainerConfig)
							.getLayer();
					if (typeof this.logoConfig.itemId !== 'undefined' || this.logoConfig.itemId === '') {
						if (this.logoConfig.defaultPath && this.logoConfig.defaultPath != ' ') {
							if ( this.isValidImageExtension(this.logoConfig.defaultPath) === true) {
								this.setPath(this.defaultPath);
								var imageConfig;
								imageConfig = {
									'eleType' : 'img',
									'src' : /*'http://localhost:9080/CTModelHouse/CTRIAFramework/UIArena/theme/system/ext/images/headerlogo.png',//*/this.logoConfig.defaultPath,
									'class' : this.imageClass
								};
								var imageContainer = new cbx.lib.layer(imageConfig)
										.getLayer();
								this.logoContainer.appendChild(imageContainer);
							}
						}
						else if(this.addData && this.addData!=''){
								  this.rawKeys = this.populateAddData(this.addData,'rawKey');
								  this.rawValues = this.populateAddData(this.addData,'rawValue');
								if(this.isValidImageExtension(path)==true){
									 this.setPath(path); 
									 
									 var imageConfig;
								imageConfig = {
									'eleType' : 'img',
									'src' : /*'http://localhost:9080/CTModelHouse/CTRIAFramework/UIArena/theme/system/ext/images/headerlogo.png',//*/this.logoConfig.defaultPath,
									'class' : this.imageClass
								};
								var imageContainer = new cbx.lib.layer(imageConfig)
										.getLayer();
								this.logoContainer.appendChild(imageContainer);
								
								 }else{
									 var name=this.name;
									 LOGGER.error('Invalid extension in the image URL.Item Id:'+name+';URL:'+path);
									 this.hide();		    		    
								 }
							  }
						else if(this.logoConfig.rawValues && this.logoConfig.rawValues!=''){
								  var path=this.logoConfig.rawValues.toString();
								 if(this.isValidImageExtension(path)==true){
									 this.setPath(path); 
									 
									 var imageConfig;
								imageConfig = {
									'eleType' : 'img',
									'src' : path,
									'class' : this.imageClass
								};
								var imageContainer = new cbx.lib.layer(imageConfig)
										.getLayer();
								this.logoContainer.appendChild(imageContainer);
								
								 }else{
									 var name=this.name;
									 LOGGER.error('Invalid extension in the image URL.Item Id:'+name+';URL:'+path);
									 		    		    
								 }
							  }
						}else if (typeof this.logoConfig.defaultPath === 'undefnied' || this.logoConfig.defaultPath === '') {
							this.logoContainer.style.display = "none";
						}
					
					this.addItem(this.logoContainer);
				},
				isValidImageExtension : function(path) {
					if ((path.search('jpg') != -1) || (path.search('png') != -1)
							|| (path.search('gif') != -1)
							|| (path.search('bmp') != -1)
							|| (path.search('jsp') != -1)) {
						return true;
					} else {
						return false;
					}
				},
				setPath : function(path) {
					this.imagePath = path;
				},
				getPath : function() {
					return this.imagePath;
				},
				populateAddData : function(items, rawType) {
					var rawDataArray = [];
					if (items != "" && items != null) {
						for ( var i = 0; i < items.length; i++) {
							rawDataArray.push(items[i][rawType]);
						}
					}
					return rawDataArray;
				},
				getComponentDOM : function() {
					return this.logoContainer;
				}
			});
	CFCR.registerFormCmp({
		'COMP_TYPE' : 'cbx-logo'}, cbx.lib.formElement.cbxLogo);
/* This class is used for to create the title */


cbx.lib.formElement.cbxTitle = Class(cbx.core.Component, {
	isFormField : true,
	canValidate : false,
	titleContainer : null,
	ctlCls : 'cbx-title',
	containerClass : 'cbxtitle-container',
	titleConfig : null,
	constructor : function(config) {
		cbx.lib.formElement.cbxTitle.$super.call(this);
		this.titleConfig = config;
		this.xtype = config.xtype || "";
		this.compositeField = config.compositeField ? config.compositeField
				: false;
		if (typeof this.titleConfig.customcontainerClass !== 'undefined') {
			this.containerClass = this.titleConfig.customcontainerClass;
		}
		if (typeof this.titleConfig.customctlCls !== 'undefined') {
			this.ctlCls = this.titleConfig.customctlCls;
		}
		var titleContainerConfig = {
			'eleType' : 'div',
			'id' : this.titleConfig.itemId,
			'class' : this.containerClass
		};
		this.setEleType("N", config);
		;
		this.titleContainer = new cbx.lib.layer(titleContainerConfig);
		var displayLabelName;
		if (typeof this.titleConfig.displayNmKey !== 'undefined'
				&& this.titleConfig.displayNmKey.trim() !== '') {

			/* Getting the reference of resource bundle and using */
			// var commonbundle = CRB.getFWBundle();
			/*
			 * var bundle; bundle =
			 * IRB.getBundle(cbx.jsutil.getBundleKey(this)); displayLabelName =
			 * bundle['LBL_' + this.titleConfig.displayNmKey];
			 */

			displayLabelName = this.titleConfig.displayNmKey;// localization
			// need to be
			// done
		} else {
			displayLabelName = this.titleConfig.plainLbl;
		}
		var titleConfig = {
			'eleType' : 'h1',
			'class' : this.ctlCls,
			'html' : displayLabelName
		};
		var titleObj = new cbx.lib.layer(titleConfig);
		this.titleContainer.addLayer(titleContainer.getLayer());
		thsi.addItem(this.titleContainer.getLayer());
	},
	getComponentDOM : function() {
		return this.titleContainer.getLayer();
	}
});
CLCR.registerCmp({
	'COMP_TYPE' : 'cbx-title'
}, cbx.lib.formElement.cbxTitle);

/* This class is used for to create the widget panel, it can hold the widgets */


cbx.lib.formElement.cbxWidgetPanel = Class(cbx.core.Component, {
	isFormField : true,
	canValidate : false,
	wpanelContainer : null,
	wpConfig : null,
	fm : null,
	widgetInitialized : false,
	commManager : null,
	ctlCls : 'cbx-widgetpanel',
	id : '',
	constructor : function(config) {
		this.commManager = cbx.core.ws.metadata.getCurrentWorkspace()
				.getWidgetContainer().commManager;
		cbx.lib.formElement.cbxWidgetPanel.$super.call(this);
		this.wpConfig = config;
		this.fm = config.fm;
		this.xtype = config.xtype || "";
		if (typeof this.wpConfig.customctlCls !== 'undefined') {
			this.ctlCls = this.wpConfig.customctlCls;
		}
		this.setEleType("N", config);
		;
		var wpContainerConfig = {
			'eleType' : 'div',
			'id' : this.wpConfig.itemId,
			'class' : this.ctlCls

		};
		this.wpanelContainer = new cbx.lib.layer(wpContainerConfig).getLayer();
		this.addItem(this.wpanelContainer);
		if (config.visibleInd === "Y" && !this.widgetInitialized) {
			this.showItem();
		} else {
			$(this.wpanelContainer).hide();
		}

	},
	/*
	 * This method usefule for to start process of instantiating the widget
	 * creation and adding to the widget panel
	 */
	intiateWidget : function(refreshInd) {
		var extraParamsHandler = refreshInd?this.refreshHandler:this.initHandler;
		cbx.core.dynamicWidgetManager({
			containerId : this.wpConfig.itemId,
			renderTo : 'FORM',
			widgetId : this.wpConfig.widgetId,
				extraParamsHandler : extraParamsHandler,
			scope : this
		});
		this.widgetInitialized = true;
	},
	afterShow : function() {
		if (!this.widgetInitialized) {
			this.intiateWidget();
		}
	
		else {
			var table = $(this.getWidget()).find('.footable');
			if (table.length > 0) {
				table.bind('footable_redrawn', function() {
					$('table').hide();
					$('table').trigger('footable_expand_all');
					$('table').trigger('footable_collapse_all');
					$('table').show();
				})
				table.data('footable').redraw();
				var selectedRows = table.find('.diffColor');
				selectedRows.each(function() {
					$(this).removeClass('diffColor');
					$(this).parents('.footable').data('footable')
							.createOrUpdateDetailRow($(this));
				});
			}
		}
		
	},
	appendChild : function(item) {
		if (!this.getWidget()) {
			this.getComponentDOM().appendChild(
					item.PORTLET.getItem(0).getLayer());
			item.PORTLET.initiateWidget(item.scope);
		}
	},
	getComponentDOM : function() {
		return this.getItem(0);
	},
	getWidget : function() {
		var widget = $(this.getComponentDOM()).children();
		return widget[0];
	},
	clearComponentDOM : function() {
		$(this.getComponentDOM()).empty();
	},
	refreshWidgetData : function() {
		this.clearComponentDOM();
		this.intiateWidget(true);
	},
	/**
	 * This is the default wrapper function for handling all the
	 * extraParamHandler registered for the widget. This method will first
	 * execute any handler written for the widget iteself and after that, it
	 * will raise the FormManager's cbxbeforeload for the form developer to
	 * update the request parameters before they are sent to the server for data
	 * fetch
	 */

	initHandler : function(params) {
		var addParams = this.fm.handlerEvent('cbxbeforeload',
				this.wpConfig.itemId, params);
		cbx.apply(params, addParams);
		return params;
	},
	refreshHandler : function(params) {
		var addParams = this.fm.handlerEvent('cbxbeforeload',
				this.wpConfig.itemId, params);
		cbx.apply(params, addParams);
		if(!cbx.isEmpty(params)&& cbx.isObject(params))
		{
		cbx.apply(params, {
					"REFRESH_DATA":"Y"
				});
		}
		else
		{
		params = {"REFRESH_DATA":"Y"};
		}

		return params;
	},
	getValidationField : function() {
		return this.getFormField();
	}
});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-widgetpanel'
}, cbx.lib.formElement.cbxWidgetPanel);

/* This class is used for to create the widget panel, it can hold the widgets */


cbx.lib.formElement.cbxPanel = Class(cbx.core.Component, {
	isFormField : false,
	panelContainer : null,
	canValidate : false,
	pConfig : null,
	ctlCls : 'cbx-widgetpanel',
	constructor : function(config) {
		cbx.lib.formElement.cbxPanel.$super.call(this);
		this.pConfig = config;
		this.xtype = config.xtype || "";
		if (typeof this.pConfig.customctlCls !== 'undefined') {
			this.ctlCls = this.pConfig.customctlCls;
		}
		this.setEleType("N", config);
		;
		var pContainerConfig = {
			'eleType' : 'div',
			'id' : this.pConfig.itemId,
			'class' : this.ctlCls
		};
		this.panelContainer = new cbx.lib.layer(pContainerConfig).getLayer();
		this.addItem(this.panelContainer);
	},
	/*
	 * This method useful for to start process of instantiating the widget
	 * creation and adding to the widget panel
	 */
	intiateWidget : function() {

	},
	getComponentDOM : function() {
		this.getItem(0);
	},
	addComponent : function(element) {
		this.getItem(0).appendChild(element);
	}
});
CLCR.registerCmp({
	'COMP_TYPE' : 'cbx-panel'
}, cbx.lib.formElement.cbxPanel);

/*
 * cbx.lib.formElement.StaticAmountField = function(config) { this.plainLabel =
 * config.plainLbl; this.fieldLabel = config.displayNmKey; this.valueInd =
 * config.model.getModelData()[config.itemId]; // this.value =
 * config.model.getModelData()[config.itemId]; this.name = config.itemId;
 * this.currMode=config.appendCurrMode; // this.required =
 * config.requiredInd; this.conditional = config.conditionalInd; this.hidden =
 * config.visibleInd === 'Y' ? false : true;
 * cbx.formElement.StaticAmountField.superclass.constructor.call(this, config); };
 */

/*
 * This class is reponsible for creating the static amount field 
 */

cbx.lib.formElement.StaticAmountField = Class(
		cbx.core.Component,
		{
			canValidate : false,
			isFormField : true,
			amtFeildConfigData : '',
			amtFieldContainer : null,
			ctlCls : 'cbx-label',
			formManager : null,
			signdigits : 2,
			constructor : function(config) {
				cbx.lib.formElement.StaticAmountField.$super.call(this);
				this.formManager = config.fm;
				this.setEleType("S", config);
				this.anchor = config.anchor;
				this.bundleKey = config.bundleKey || "";
				this.amtFeildConfigData = config;
				this.xtype = config.xtype || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.createStaticAmountField();
			},
			// Instantiates amount field class
			createStaticAmountField : function() {
				var amtFieldContainerConfig = {
					'eleType' : 'div',
					'data-role' : 'fieldcontain',
					'class' : 'staticfield staticamountfield',
					'id' : this.amtFeildConfigData.itemId,
					"style" : {/*
								 * "display" : (typeof
								 * this.amtFeildConfigData.visibleInd !==
								 * 'undefined' &&
								 * (this.amtFeildConfigData.visibleInd
								 * .trim().toUpperCase() === 'N' ||
								 * this.amtFeildConfigData.hidden==true)) ?
								 * "none" : ""
								 */}
				};

				if (this.compositeField) {
					amtFieldContainerConfig.style["width"] = this.anchor;
				}
				if (typeof this.amtFeildConfigData.visibleInd !== 'undefined'
						&& (this.amtFeildConfigData.visibleInd.trim()
								.toUpperCase() === 'N' || this.amtFeildConfigData.hidden == true)) {
				
					amtFieldContainerConfig["class"] = amtFieldContainerConfig["class"] +" ui-field-contain ui-body jqm-display-hide";
				

				}
				this.amtFieldContainer = new cbx.lib.layer(
						amtFieldContainerConfig);
				this.plainLabel = "";
				if (this.amtFeildConfigData.plainLbl != null
						&& $.trim(this.amtFeildConfigData.plainLbl) !== "") {
					this.plainLabel = this.amtFeildConfigData.plainLbl;
				} else {
					this.plainLabel = this
							.getDisplayNameKey(this.amtFeildConfigData);
				}
				// var cbxLabelObj =
				var labelComponent = new cbx.lib.formElement.cbxLabel(
						this.amtFeildConfigData).getComponentDOM();
				this.amtFieldContainer.addLayer(labelComponent);
				var dataContainerConfig = {
					'eleType' : 'span',
					'class' : 'cbxstaticfield amount-container', 
					'name' : this.amtFeildConfigData.itemId,
					"cbx-type" : "formField_"
							+ this.amtFeildConfigData.itemType
				};
				var dataContainer = new cbx.lib.layer(dataContainerConfig);
				/*
				 * var currencyModeConfig = { 'eleType' : 'span', 'class' :
				 * 'currency-class', 'html' :
				 * this.amtFeildConfigData.linkedCurrComp };
				 */
				/*
				 * var currencyModeComponent = new cbx.lib.layer(
				 * currencyModeConfig).getLayer();
				 */
				var amount = this.formManager.model.getModelData()[this.amtFeildConfigData.itemId];

				/*
				 * var currencyValueConfig = { 'eleType' : 'span', 'type' :
				 * 'text', 'class' : 'static-amount-data', 'value' : amount };
				 */
				/*
				 * var currencyContainer = new
				 * cbx.lib.layer(currencyValueConfig) .getLayer();
				 * 
				 * if (this.amtFeildConfigData.currMode === 'PRE_CODE') {
				 * dataContainer.addLayer(currencyModeComponent);
				 * dataContainer.addLayer(currencyContainer); } else { // By
				 * default adding currency type after the amount
				 * dataContainer.addLayer(currencyModeComponent);
				 * dataContainer.addLayer(currencyContainer); }
				 */
				this.amtFieldContainer.addLayer(dataContainer.getLayer());
				this.addItem(this.amtFieldContainer.getLayer());
				this.setFormField($(dataContainer.getLayer()));
				if (!cbx.isEmpty(amount)) {
					this.setValue(amount);
				}
			},
			getValue : function() {
				return this.getFormField().val();
			},
			updateSignDigits : function(config) {
				var currDecimalPlaceList = cbx.globalcurrency.metadata
						.getCurrDecimalPlaceList();
				var currcmp = this.amtFeildConfigData.linkedCurrComp;
				var curr;
				if (!cbx.isEmpty(currcmp)) {
					curr = this.formManager.model.getValue(currcmp);
				}
				if (cbx.isEmpty(curr)) {
					// get the default curr from preference.
					curr = iportal.systempreferences.getDefaultBankCCY();
					if (cbx.isEmpty(curr)) {
						// get the default curr configured in the
						// orbidirect properties.
						curr = cbx.globalcurrency.metadata.getDefaultCurrency();
					}
				}
				if (!cbx.isEmpty(curr)) {
					var currList = cbx.decode(currDecimalPlaceList);
					var currBasedDecimal = currList[curr];
					this.signdigits = currBasedDecimal;
					
					if (!this.currencyAppendSpan) {
						var spanConfig = {
							"eleType" : "span",
							"class" : "currencyAppend",
							"html" : curr
						}
						this.currencyAppendSpan = $(new cbx.lib.layer(
								spanConfig).getLayer());
					}
					
					else{
						this.currencyAppendSpan.html(curr);
					}
					
				}
			},
			
			setValue : function(v) {
				this.updateSignDigits(); //  calling the api to update
				// the
				// this.signdigits
				if (v) {
					var StringNumber=canvas.amountFormatter.getInstance();
	                var val=StringNumber.basicFormatter(v.replace(/,/g, ""), this.signdigits);
	                var valueToSet=this.getRawValue(val);
	                this.formManager.model.updateValue(this.amtFeildConfigData.itemId,valueToSet);
                    if(!cbx.isEmpty(val))
                        {
                            if (this.currencyAppendSpan) {
                                if (this.amtFeildConfigData.appendCurrMode === 'PRE_CODE') {
                                    val = $(this.currencyAppendSpan).html() + " "
                                            + val;
                                } else if (this.amtFeildConfigData.appendCurrMode === 'SUF_CODE') {
                                    val = val + " "
                                            + $(this.currencyAppendSpan).html();
                                } else if (this.amtFeildConfigData.appendCurrMode === 'PRE_SYM') {
                                    // Will be added in future enhancement
                                } else if (this.amtFeildConfigData.appendCurrMode === 'SUF_SYM') {
                                    // Will be added in future enhancement
                                }
                            }
                        this.getFormField().html(val);
                        }
                    else
                        this.getFormField().html('--');
				}

			},
			// Returns the value without seperators.
			getRawValue : function(formattedVal)
            {
				var returnVal;
				var amtFormatJson = iportal.preferences.getAmountFormatJson();
                    var groupSep=amtFormatJson.groupSeparator;
                    if(groupSep=="S")
                        groupSep=" ";
                    var decSep=amtFormatJson.decimalSeparator;                       
                    if(decSep=="S")
                        decSep=" ";
                    if(cbx.isEmpty(formattedVal))
                        returnVal="";
                    else
                        returnVal=formattedVal.split(groupSep).join("").split(decSep).join(".");
                return returnVal;
            },
			// Returns the DOM object of text field
			getComponentDOM : function() {
				return this.amtFieldContainer.getLayer();

			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-staticamountfield'
}, cbx.lib.formElement.StaticAmountField);

/* This class is used to create the password field */



cbx.lib.formElement.cbxPassword = Class(
		cbx.core.Component,
		{
			canValidate : true,
			isFormField : true,
			passwordCmponentObject : null,
			inputPasswordConfigObject : null,
			pwdConfigData : null,
			ctlCls : 'cbx-password',
			constructor : function(config) {
				cbx.apply(this, config);
				cbx.lib.formElement.cbxPassword.$super.call(this);
				this.pwdConfigData = config;
				this.anchor = config.anchor;
				this.config = config;
				this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
				
				this.maxLength = config.maxLength;
				this.minLength = config.minLength;
				this.validationType = config.vType;
				
				this.bundleKey = config.bundleKey || "";
				this.xtype = config.xtype || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.formManager = config.fm;
				this.createPassword();
				this.setEleType("N", config);
				;
				this.addItem(this.passwordCmponentObject.getLayer());
			},
			createPassword : function() {
				var displayLabelName;
				passwordConfig = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"id" : this.pwdConfigData.itemId
				};
				if (this.compositeField) {
					passwordConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof this.pwdConfigData.visibleInd !== 'undefined'
						&& (this.pwdConfigData.visibleInd.trim().toUpperCase() === 'N' || this.pwdConfigData.hidden == true)) {
					passwordConfig["class"] = "ui-field-contain ui-body jqm-display-hide";

				}
				this.passwordCmponentObject = new cbx.lib.layer(passwordConfig);
				if (typeof this.pwdConfigData.customClass !== 'undefined'
						&& this.pwdConfigData.customClass !== '') {
					this.ctlCls = this.pwdConfigData.customClass;
				}
				
				if (!cbx.isEmpty(this.validationType)) {

					var registeredVtypes = cbx.form.vTypeRegistry.getVtypes();

					for ( var i = 0; i < registeredVtypes.length; i++) {

						if (this.validationType == registeredVtypes[i].name) {

							this.config.maskRe = registeredVtypes[i].mask;

							this.config.invalidText = registeredVtypes[i].text;
							
							this.config.globalRe = registeredVtypes[i].globalRe;

							break;
				
						} else if (this.validationType == 'alphaNumeric'
								|| this.validationType == 'numeric'
								|| this.validationType == 'portalSupported') {

						} else {

						}

					}
				}
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
						this.pwdConfigData);
				this.passwordCmponentObject.addLayer(cbxLabelObj
						.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');
				var inputPasswordConfig = {
					"eleType" : "input",
					"type" : "password",
					"id" : this.config.itemId + "_field",
					"name" : this.config.itemId,
					"class" : this.ctlCls,
					"cbx-type" : "formField_" + this.config.itemType
				};
				if (this.config.readOnlyInd.trim().toUpperCase() == "Y"
						|| this.config.readOnly == true) {
					// inputPasswordConfig.readonly=='readonly';
					// inputPasswordConfig["readonly"]=="true";
					inputPasswordConfig.readonly = "true"
				}
				
				if(!cbx.isEmpty(this.maxLength)){
					inputPasswordConfig.maxLength = this.maxLength;
				}
				
				var inputPassWordObj = new cbx.lib.layer(inputPasswordConfig);
				this.inputPassWordObj = inputPassWordObj;
				var that = this;
			
				/*inputPassWordObj.getLayer().onkeypress = function(evt) {
			

					if (that.config.vType.trim().toUpperCase() === "ALPHANUMERIC") {
						var exp = String.fromCharCode(evt.charCode);
						var r = new RegExp("[A-Za-z0-9]", "g");
						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else if (that.config.vType.trim().toUpperCase() === "NUMERIC") {
						var exp = String.fromCharCode(evt.charCode);
						var r = '';
						if (that.config.allowSpaces) {
							r = new RegExp("[0-9]", "g");
						} else {
							r = new RegExp("[0-9]", "g");
						}

						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else if (that.config.vType.trim().toUpperCase() === "PORTALSUPPORTED") {
						var exp = String.fromCharCode(evt.charCode);
						if (that.config.allowSpaces) {
							r = new RegExp(
									"^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$", "g");
						} else {
							r = new RegExp("[0-9]", "g");
						}

						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else {
						if (!cbx.isEmpty(that.config.vtype)
								&& !cbx.isEmpty(that.config.maskRe)) {
							var exp = String.fromCharCode(evt.charCode);
							try {
								var r = new RegExp(that.config.maskRe, "g");
								if (exp.match(r) == null) {
									evt.charCode = 0;
									return false;
								}

							} catch (err) {
							}
						}
					}
					if (typeof that.config.maxLength !== 'undefined'
							&& that.config.maxLength > 0) {
						if (typeof $('#' + that.config.itemId).val() !== 'undefined'
								&& that.getValue().length >= that.config.maxLength) {	
							return false;
						}
					}
				};*/
				
				this.passwordCmponentObject.addLayer(inputPassWordObj
						.getLayer());
				this.setFormField($(inputPassWordObj.getLayer()));

				$(this.inputPassWordObj.getLayer()).bind(
						'change',
						this,
						function(event) {
							that.formManager.model.updateValue(
									that.config.itemId, that.getValue());
							
							that.setValue(that.getValue());
							
						});

				if (this.config.disabled == true) {
					this.disable();
				}
				this.registerDefaultValidation(this);

			},
			getValue : function() {
				return this.getFormField().val();
			},
			setValue : function(value) {
				
				// If value is not empty then call clearInvalid
				if ( typeof value !== 'undefined' && value !== '') {
					this.clearInvalid(this.config.itemId);
				}
				
			},
			getComponentDOM : function() {
				return this.passwordCmponentObject.getLayer();
			},
			getValidationField : function() {
				return this.getFormField();
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-passwordfield'
}, cbx.lib.formElement.cbxPassword);

cbx.lib.formElement.cbxImagePanel = Class(
		cbx.core.Component,
		{
			canValidate : false,
			ctlCls : 'cbx-ImagePanel',
			isFormField : true,
			constructor : function(config) {
				cbx.lib.formElement.cbxImagePanel.$super.call(this);
				this.config = config;
				this.xtype = config.xtype || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
				this.formManager = config.fm;
				this.name = config.itemId;
				this.addData = config.addData;
				
				this.bundleKey = config.bundleKey;
				this.rawKeys = this.populateAddData(this.addData, 'rawKey');
				this.rawValues = this.populateAddData(this.addData, 'rawValue');
				this.createFieldset();
				if (this.isCarouselRequired()) {
					this.createCarousel();
				}
				this.addItem(this.imageObject.getLayer());
				doIScroll('CONTENT_DIV', 'refresh');
				this.setEleType("N", config);
				
			},
		
			createFieldset : function() {
				var imageObject = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"id" : this.config.itemId,
					"style" : {
						"display" : (typeof this.config.visibleInd !== 'undefined' && (this.config.visibleInd
								.trim().toUpperCase() === 'N' || this.config.hidden == true)) ? "none"
								: "block"
					}
				};
				this.imageObject = new cbx.lib.layer(imageObject);
			},
			isCarouselRequired : function() {
				return this.rawKeys.length > 0 && this.rawValues.length > 0;
			},
			isScrollRequired : function() {
				return this.rawKeys.length > 1;
			},
			createCarousel : function() {
				var imageWrapperConfig = {
				
					"eleType" : "div",
					"class" : "cbxjqmCarousel-wrapper"
				};
				this.imageCmponentObject = new cbx.lib.layer(imageWrapperConfig);
				this.imageObject.addLayer(this.imageCmponentObject.getLayer());
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.config);
				this.imageCmponentObject
						.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');
				var carouselConfig = {
					"eleType" : "div",
					"class" : "jcarousel-wrapper"
				};
				this.carouselWrapper = new cbx.lib.layer(carouselConfig);

				var carouselElemConfig = {
					"eleType" : "div",
					"class" : "jcarousel",
					"data-jcarousel" : "true"
				};

				this.carouselElem = new cbx.lib.layer(carouselElemConfig);

				var carouselUnorderedList = {
					"eleType" : "ul",
					"class" : "jcarousel-ul"
				};
				this.carouselUnorderedList = new cbx.lib.layer(
						carouselUnorderedList);

				this.carouselElem.addLayer(this.carouselUnorderedList
						.getLayer());

				var str = "";
				var that = this;
				var combundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));

					
					var hybridContext = iportal.systempreferences.getContextRoot();
					var re = new RegExp('/', 'g');
					hybridContext = hybridContext.replace(re, '');
                         
				for ( var i = 0; i < this.rawValues.length; i++) {
					
                    if(iportal.systempreferences.isHybrid()){// check whether hybrid or not
                            var paths = this.rawValues[i].split(hybridContext);
                            if(paths.length == 1) {// path doesn't contain the context path(here context path is iportalweb)
                                this.rawValues[i] = hybridContext + '/' + this.rawValues[i];
                            }
                            else if(this.rawValues[i].indexOf(iportal.systempreferences.getContextRoot())==0){//check whether the value starts with
                            																					//context path with a '/' in front.
                                this.rawValues[i] = this.rawValues[i].substring(1,this.rawValues[i].length); // remove front slash
                            }
                    }
                    var src = this.rawValues[i];
					
					var item = this.rawKeys[i];
					var label = (this.hideLabelInd == 'Y') ? ''
							: combundle['LBL_' + item];
					var itemSrc = item + '$' + src;
					str += '<li class="listAlign"><img itemId="' + itemSrc
							+ '" src=' + src + ' label>';
					if (!cbx.isEmpty(label)) {
						str += '<span class="labelAlign">' + label + '</span>';
					}
					str += '</li>';
					$('body').delegate(
							'#'+this.name+' img[itemId="' + itemSrc + '"]',
							'click',
							function(e) {
								e.stopPropagation();
								that.formManager.handlerEvent('cbxclick',
										that.name, $(this).attr('itemId'));
							});
				}
				$(this.carouselUnorderedList.getLayer()).append(str);

				this.carouselWrapper.addLayer(this.carouselElem.getLayer());
			

				if (this.isScrollRequired()) {
					var carouselAnchorPrev = {
						"eleType" : "a",
						"href" : "#",
						"class" : "jcarousel-control-prev",
						"html" : "&lsaquo;",
						"data-jcarouselcontrol" : "true"
					};

					this.carouselAnchorPrev = new cbx.lib.layer(
							carouselAnchorPrev);

					var carouselAnchorNext = {
						"eleType" : "a",
						"href" : "#",
						"class" : "jcarousel-control-next",
						"html" : "&rsaquo;",
						"data-jcarouselcontrol" : "true"
					};

					this.carouselAnchorNext = new cbx.lib.layer(
							carouselAnchorNext);
					var carouselPage = {
						"eleType" : "p",
						"class" : "jcarousel-pagination"
					};
					this.carouselPageNav = new cbx.lib.layer(carouselPage);

					this.carouselWrapper.addLayer(this.carouselAnchorPrev
							.getLayer());
					this.carouselWrapper.addLayer(this.carouselAnchorNext
							.getLayer());
					this.carouselWrapper.addLayer(this.carouselPageNav
							.getLayer());
				}

				this.imageCmponentObject.addLayer(this.carouselWrapper
						.getLayer());

				this.setFormField($(this.imageCmponentObject.getLayer()));

				if (this.config.disabled == true) {
					this.disable();
				}
			},
			populateAddData : function(items, rawType) {
				var rawDataArray = [];
				if (items != "" && items != null) {
					for ( var i = 0; i < items.length; i++) {
						rawDataArray.push(items[i][rawType]);
					}
				}
				return rawDataArray;
			},
			disable : function() {
				$(this.getComponentDOM()).addClass('ui-disabled');
			},
			enable : function() {
				$(this.getComponentDOM()).removeClass('ui-disabled');
			},
			getComponentDOM : function() {
				var that = this;
				setTimeout(function() {
					that.generateResponsive();
					doIScroll('CONTENT_DIV', 'refresh');
				}, 500);
				return this.imageObject.getLayer();
			},
			reload : function() {
				$(this.getComponentDOM()).empty();
				this.createCarousel(true);
				doIScroll('CONTENT_DIV', 'refresh');

			},
			/**
			 * Updates the store with the arrays of keys and values.
			 */
			updateComboRawStore : function(keyArr, valueArr) {
				if (!cbx.isEmpty(keyArr) && !cbx.isEmpty(valueArr)) {
					this.rawValues = valueArr;
					this.rawKeys = keyArr;
					this.reload();
				}
				doIScroll('CONTENT_DIV', 'refresh');
			},
			getValidationField : function() {
				return this.getFormField();
			},
			generateResponsive : function() {
				(function($) {
					$(function() {
						var jcarousel = $('.jcarousel');
						
	                      var isRTL = false;
	                      if(iportal.preferences.isRTL === "true") {
	                      isRTL = true;
	                      }
						jcarousel.on(
								'jcarousel:reload jcarousel:create',
								function() {
									var width = jcarousel.innerWidth();

									if (width >= 600) {
										width = width / 3;
									} else if (width >= 350) {
										width = width / 2;
									}

									jcarousel.jcarousel('items').css('width',
											width + 'px');
								}).jcarousel({
									rtl : isRTL, 
							wrap : 'circular'
						});
						
	                      if(isRTL) {
	                        $('.jcarousel').attr('dir','rtl');
	                      }
	                    

						$('.jcarousel-control-prev').jcarouselControl({
							target : '-=1'
						});

						$('.jcarousel-control-next').jcarouselControl({
							target : '+=1'
						});

						$('.jcarousel-pagination').on(
								'jcarouselpagination:active', 'a', function() {
									$(this).addClass('active');
								}).on('jcarouselpagination:inactive', 'a',
								function() {
									$(this).removeClass('active');
								}).on('click', function(e) {
							e.preventDefault();
						}).jcarouselPagination(
								{
									perPage : 1,
									item : function(page) {
										return '<a href="#' + page + '">'
												+ page + '</a>';
									}
								});
					});
				})(jQuery);
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-imagepanel'
}, cbx.lib.formElement.cbxImagePanel);



cbx.lib.formElement.cbxfileuploadpanel = Class(
		cbx.core.Component,
		{
			canValidate : true,
			isFormField : true,
			config : null,
			ctCls : "cbx-fileUploadPanel",
			cls : "fileupload",
			enableKeyEvents : true,
			formManager : null,
			constructor : function(config) {
				cbx.apply(this, config);
				cbx.lib.formElement.cbxfileuploadpanel.$super.call(this);
				this.config = config;
				this.xtype = config.xtype;
				this.uploadCmp=null;
				
				this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
				this.itemId = config.itemId;
			
				this.anchor = config.anchor;
				this.formManager = config.fm;
				this.model=config.fm.model;
				this.bundleKey = config.bundleKey || "";
				this.compositeField = config.compositeField ? config.compositeField
						: false;
			
				this.createUploadPanel();
				this.addItem(this.formCmponentObject.getLayer());
				if (this.config.disabled == true) {
					this.disable();
				}
				this.setEleType("N", config);
				this.defaulttoolTipText=CRB.getFWBundle() && CRB.getFWBundle()['uploadPanelInvalidText'] ?CRB.getFWBundle()['uploadPanelInvalidText']:'Please upload atlest one file';
			},
			createUploadPanel : function() {
				var displayLabelName;
				this.fieldObject = null;
				this.formCmponentObject = null;
				configData = this.config;
				if (!cbx.isEmpty(configData.className)) {
					this.ctCls = configData.className;
				}
				
				formConfig = {
					eleType : "div",
					"data-role" : "fieldcontain",
					"class" : "ui-field-contain ui-body jqm-form-field-c jqm-cbxfileuploadpanel "+this.ctCls+"",
					"id" : this.config.itemId,
					"style" : {}
				};
				if (configData.disabled == true) {
					formConfig.disabled = true;
				}
				if (this.compositeField) {
					formConfig.style["width"] = this
							.getCompositeWidth(this.anchor);
				}
				if (typeof configData.visibleInd !== 'undefined'
						&& (configData.visibleInd.trim().toUpperCase() === 'N' || configData.hidden == true)) {
					formConfig["class"] = "ui-field-contain ui-body jqm-form-field-c jqm-cbxfileuploadpanel jqm-display-hide";
					this.hidden=true;
				}
				if(cbx.isEmpty(this.hidden)){
					this.hidden=false;
				}
				this.formCmponentObject = new cbx.lib.layer(formConfig);
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(configData);

				this.formCmponentObject.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text()
						.replace(/\*/g, '');

				if (typeof configData.itemType !== 'undefined'
						&& configData.itemType.trim().toUpperCase() === "UPLOADPANEL") {
					fieldConfig = this.getFieldConfig(configData);
					this.fieldObject = new cbx.lib.layer(fieldConfig);
					this.formCmponentObject.addLayer(this.fieldObject
							.getLayer());
				}

				var that = this;
				if (configData.itemType !== ""
						&& !cbx.isEmpty(this.fieldObject)) {					
					
					this.setFormField($(this.fieldObject.getLayer()));
					uploadConfig = {
								"eleType" : "div",
								"name" : this.config.itemId+"_uploadObject",
								"id" : this.config.itemId + "_uploadObjectField",
								"class" : "cbx-fileuploadpanel_uploadObject",
								"style" : {
									"display" : "none"
								}
							};
					
					this.uploadObject = new cbx.lib.layer(uploadConfig);
					var uploadObjectLayer=this.uploadObject.getLayer();
					this.fieldObject.addLayer(uploadObjectLayer);
					var bundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
				
					var redirectUrl='?timeout='+new Date().getTime()+'&'+iportal.systempreferences.getCSRFKeyName()+"="+iportal.systempreferences.getCSRFUniqueId()
	            	+'&Item-Id='+configData.itemId+'&Form-Id='+configData.formId+'&INPUT_ACTION=FILE_ATTACH_ACTION&INPUT_FUNCTION_CODE=VSBLTY&INPUT_SUB_PRODUCT=CUSER&PAGE_CODE_TYPE=FILE_UPLOAD&PRODUCT_NAME=CUSER';
					
					var postUrl = iportal.systempreferences.isHybrid() === "true" ? getDomainUrl() + 'pfus' + redirectUrl+"&isHybrid=H" : "./pfus" + redirectUrl;
					
					var uploadConfigData={
								url:postUrl,
								multiple:true,
								filesInputName:configData.itemId,								
								bundle:bundle,
								inlineFormData:{'Form-Id':configData.formId,'Item-Id':configData.itemId},
								addText:bundle && bundle['addText'] ? bundle['addText']:CRB.getFWBundle() && CRB.getFWBundle()['addText']?CRB.getFWBundle()['addText']:'Add',
								removeAllText:bundle && bundle['removeAllText'] ? bundle['removeAllText']:CRB.getFWBundle() && CRB.getFWBundle()['removeAllText']?CRB.getFWBundle()['removeAllText']:'Remove All',
								footerTitle:bundle && bundle['footerTitle'] ? bundle['footerTitle']:CRB.getFWBundle() && CRB.getFWBundle()['footerTitle']?CRB.getFWBundle()['footerTitle']:'Multiple Upload',
								footerText:bundle && bundle['footerText'] ? bundle['footerText']:CRB.getFWBundle() && CRB.getFWBundle()['footerText']?CRB.getFWBundle()['footerText']:'Add files to the upload queue.',
								displayPreview:false,
								abortLabel:bundle && bundle['abortLabel'] ? bundle['abortLabel']:CRB.getFWBundle() && CRB.getFWBundle()['abortLabel']?CRB.getFWBundle()['abortLabel']:'Abort',
								cancelLabel:bundle && bundle['cancelLabel'] ? bundle['cancelLabel']:CRB.getFWBundle() && CRB.getFWBundle()['cancelLabel']?CRB.getFWBundle()['cancelLabel']:'Remove',
								errorLabel:bundle && bundle['errorLabel'] ? bundle['errorLabel']:CRB.getFWBundle() && CRB.getFWBundle()['errorLabel']?CRB.getFWBundle()['errorLabel']:'Error',
								doneLabel:bundle && bundle['doneLabel'] ? bundle['doneLabel']:CRB.getFWBundle() && CRB.getFWBundle()['doneLabel']?CRB.getFWBundle()['doneLabel']:'Remove',
								extensionErrorLabel:bundle && bundle['extensionErrorLabel'] ? bundle['extensionErrorLabel']:CRB.getFWBundle() && CRB.getFWBundle()['extensionErrorLabel']?CRB.getFWBundle()['extensionErrorLabel']:'is not allowed. Allowed extensions:',
								duplicateErrorLabel:bundle && bundle['duplicateErrorLabel'] ? bundle['duplicateErrorLabel']:CRB.getFWBundle() && CRB.getFWBundle()['duplicateErrorLabel']?CRB.getFWBundle()['duplicateErrorLabel']:'is not allowed. File already exists.',
							    errorSizeLabel:bundle && bundle['errorSizeLabel'] ? bundle['errorSizeLabel']:CRB.getFWBundle() && CRB.getFWBundle()['errorSizeLabel']?CRB.getFWBundle()['errorSizeLabel']:'is not allowed. Allowed Max size:',
							    uploadErrorLabel:bundle && bundle['uploadErrorLabel'] ? bundle['uploadErrorLabel']:CRB.getFWBundle() && CRB.getFWBundle()['uploadErrorLabel']?CRB.getFWBundle()['uploadErrorLabel']:'Upload Failed',
							    uploadCountErrorLabel:bundle && bundle['uploadCountErrorLabel'] ? bundle['uploadCountErrorLabel']:CRB.getFWBundle() && CRB.getFWBundle()['uploadCountErrorLabel']?CRB.getFWBundle()['uploadCountErrorLabel']:' is not allowed. Maximum allowed files are:',
							    unknownErrorText:bundle && bundle['unknownErrorText'] ? bundle['unknownErrorText']:CRB.getFWBundle() && CRB.getFWBundle()['unknownErrorText']?CRB.getFWBundle()['unknownErrorText']:'UNKNOWN ERROR',
							    jsonErrorText:bundle && bundle['jsonErrorText'] ? bundle['jsonErrorText']:CRB.getFWBundle() && CRB.getFWBundle()['jsonErrorText']?CRB.getFWBundle()['jsonErrorText']:'Error in Json',
							    errorLogPosition:'top',
								showQueueDiv:true,								
								defaulttoolTipText:bundle && bundle['uploadPanelInvalidText'] ? bundle['uploadPanelInvalidText']:CRB.getFWBundle() && CRB.getFWBundle()['uploadPanelInvalidText']?CRB.getFWBundle()['uploadPanelInvalidText']:'Please upload atlest one file',
								statusBarWidth:'auto',
								displayProgressBarAfterSuccess: false,
								fileUploadSupport:bundle && bundle['fileUploadSupport'] ? bundle['fileUploadSupport']:CRB.getFWBundle() && CRB.getFWBundle()['fileUploadSupport']?CRB.getFWBundle()['fileUploadSupport']:'No FileUploadSupport kindly Upgrade to html5 precisely',
								fileDoneText:bundle && bundle['fileDoneText'] ? bundle['fileDoneText']:CRB.getFWBundle() && CRB.getFWBundle()['fileDoneText']?CRB.getFWBundle()['fileDoneText']:'File <b>{0}</b> has been successfully uploaded',
								uploadContentText:bundle && bundle['uploadContentText'] ? bundle['uploadContentText']:CRB.getFWBundle() && CRB.getFWBundle()['uploadContentText']?CRB.getFWBundle()['uploadContentText']:'Upload File Queue'			
								};
					if(cbx.isEmpty(this.preInitConfig)){
						this.preInitConfig={};
					}
					cbx.apply(uploadConfigData,(this.preInitConfig[this.itemId] || {}));
					uploadConfigData.model=this.formManager.model;
					
					uploadConfigData.fileSizeMax=1024*1024*parseInt(iportal.preferences.getMaximumFileSize());
					
					
					uploadConfigData.beforeFileAdd=function (filename,uploadCount,files,totalBytes,errorlog) {
						 that.clearInvalid();
							if (that.formManager.register['beforefileadd' + "|" + configData.itemId] != null) {
   							var obj = that.formManager.register['beforefileadd' + "|" + configData.itemId];
   							return obj.handler.apply(obj.mScope, [that.formManager,configData.itemId,filename,uploadCount,errorlog,files,totalBytes]);			    							
   						}else{
   		                return true;
   						}
   		         };
   		      uploadConfigData.fileAdd= function (files,totalBytes,errorlog) {
   		        	 that.clearInvalid();
							if (that.formManager.register['fileadd' + "|" + configData.itemId] != null) {
   							var obj = that.formManager.register['fileadd' + "|" + configData.itemId];
   						   obj.handler.apply(obj.mScope, [that.formManager,configData.itemId,errorlog,files,totalBytes]);			    							
   						}
   		         };
   		      uploadConfigData.onCancel= function (fileData, pd,event) {
   		        	 that.validate();
							if (that.formManager.register['beforefileremove' + "|" + configData.itemId] != null) {
   							var obj = that.formManager.register['beforefileremove' + "|" + configData.itemId];
   						   return obj.handler.apply(obj.mScope, [that.formManager,configData.itemId,fileData,event,pd]);			    							
   						}else{
   		                return true;
   						}
   		         
   		         };
   		      uploadConfigData.afterCancel= function (result,event) {
   		        	 that.validate();
							if (that.formManager.register['fileremove' + "|" + configData.itemId] != null) {
   							var obj = that.formManager.register['fileremove' + "|" + configData.itemId];
   						   obj.handler.apply(obj.mScope, [that.formManager,configData.itemId,result,event]);			    							
   						}
   		         
   		         },
   		      uploadConfigData.removeAll=function (resultData,event,uploadQueue,length,existingFileNames,selectedFiles,totalBytesInQueue) {
   		        	 that.validate();
							if (that.formManager.register['beforequeueclear' + "|" + configData.itemId] != null) {
   							var obj = that.formManager.register['beforequeueclear' + "|" + configData.itemId];
   						   return obj.handler.apply(obj.mScope, [that.formManager,configData.itemId,resultData,event,uploadQueue,length,existingFileNames,selectedFiles,totalBytesInQueue]);			    							
   						}else{
   		                return true;
   						}
   		         
   		         };
   		      uploadConfigData.afterRemoveAll=function (resultData,event) {
   		        	 that.validate();
							if (that.formManager.register['queueclear' + "|" + configData.itemId] != null) {
   							var obj = that.formManager.register['queueclear' + "|" + configData.itemId];
   						   obj.handler.apply(obj.mScope, [that.formManager,configData.itemId,resultData,event]);			    							
   						}
   		         
   		         };
   		      uploadConfigData.onUpload= function (queuedcount,totalqueuedcount) {
   		        	 that.clearInvalid();
							if (that.formManager.register['beforeupload' + "|" + configData.itemId] != null) {
   							var obj = that.formManager.register['beforeupload' + "|" + configData.itemId];
   						   return obj.handler.apply(obj.mScope, [that.formManager,configData.itemId,queuedcount,totalqueuedcount]);			    							
   						}else{
   		                return true;
   						}
   		         
   		         };
				
					/*$(document).on('pagechange', function(e, data){  
						e.stopPropagation();
						that.uploadCmp = $(uploadObjectLayer).uploadPanel(uploadConfigData);
						LOGGER.info('this.uploadCmp ',that.uploadCmp);
					});
					
					
					setTimeout(function(){
						that.uploadCmp = $(uploadObjectLayer).uploadPanel(uploadConfigData);
						doIScroll('CONTENT_DIV', 'refresh');
					},150);*/
   		         
   		       /*  this.formManager.registerListener("formPanelRender",function(){
   		        	 setTimeout(function(){
   		        		 that.uploadCmp = $(uploadObjectLayer).uploadPanel(uploadConfigData);
   		        		 doIScroll('CONTENT_DIV', 'refresh');
   		        	 },150);
   		         });*/
   		      var uploadPanelRender=false;
  		       $(document).on("formPanelRender",function(){
		        	 setTimeout(function(){
		        		 if(!uploadPanelRender){
		        		 that.uploadCmp = $(uploadObjectLayer).uploadPanel(uploadConfigData);
		        		uploadPanelRender=true;
		        		 doIScroll('CONTENT_DIV', 'refresh');
		        		 }
		        	 },150);
		         }); 

				}
			},
			getQueue:function(){
				if(!cbx.isEmpty(this.uploadCmp) && this.hidden === false)
				return this.uploadCmp.getQueue();
				else
				return [];					
			},	
			getFileStatus:function(){
				if(!cbx.isEmpty(this.uploadCmp) && this.hidden === false)
				return this.uploadCmp.getFileStatus();
				else
				return [];					
			},
			removeAll:function(){
				if(!cbx.isEmpty(this.uploadCmp) && this.hidden === false)
				this.uploadCmp.removeAll();
			},
			validate:function(){
					if(!cbx.isEmpty(this.uploadCmp)){
					if(this.uploadCmp.getFileStatus().length>0)	{
						this.clearInvalid();
					return true;
					}
					else{
						if(this.config.requiredInd && this.config.requiredInd=='Y' && this.hidden === false){
						this.markInvalid(this.defaulttoolTipText);
						}
					return false;	
					}
					}
			},
			onUpload:function(handler, totalQueueCount){
				this.uploadCmp.startUpload(handler, totalQueueCount);
			},			
			getValidationField : function() {
				return this.getFormField();

			},
			getFieldConfig : function(configData) {
				fieldConfigData = {
					"eleType" : "div",
					"name" : this.config.itemId,
					"id" : this.config.itemId + "_field",
					"class" : "cbx-fileuploadpanel",
					"cbx-type" : "formField_" + this.config.itemType
				};
				if (!cbx.isEmpty(configData.cls)) {
					this.cls = configData.cls;
				}
				fieldConfigData["class"]="cbx-fileuploadpanel "+this.cls;
			
				return fieldConfigData;
			},
			getComponentDOM : function() {
				return this.formCmponentObject.getLayer();
			},
			disable : function() {
				$(this.getComponentDOM()).addClass('ui-disabled');
			},
			enable : function() {
				$(this.getComponentDOM()).removeClass('ui-disabled');
			}
		});

CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-fileuploadpanel'
}, cbx.lib.formElement.cbxfileuploadpanel);


/**
 * @class cbx.lib.formElement.cbxiconcombobox
 * @extends cbx.core.Component
 * <p>A combobox control with icon support for each drop down value</p>
 * <p>A ComboBox works in a similar manner to a traditional HTML &lt;select> field. 
 * The <i>{@link #displayField}</i> is shown in the text field
 * which is named according to the {@link #name} and the most likely events are select and change.
 */
cbx.lib.formElement.cbxiconcombobox = Class(
			cbx.core.Component,
			{
				comboBoxObject : '',
				comboBoxConfigObject : '',
				comboBoxData : '',
				canValidate : true,
				isFormField : true,
				config : {},
				comboBoxSelectObj : null,
				formManager : null,
				updateFlag : false,
				dropdownSelect : '',
				constructor : function (config)
				{
					cbx.apply(this, config);
					this.config = config;
					cbx.lib.formElement.cbxiconcombobox.$super.call(this);
					this.triggerField = true;
					this.comboBoxConfigObject = config;
					this.xtype = config.xtype;
					this.anchor = config.anchor;
					this.itemId = config.itemId;
					this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
					this.compositeField = config.compositeField ? config.compositeField : false;
					this.comboBoxData = config.addData;
					this.formManager = config.fm;
					this.required = config.requiredInd;
					this.includeSelect = config.includeSelectInd === 'Y' ? true : false;
					this.includeSelectOnSingleValue = this.includeSelect;
					this.bundleKey = config.bundleKey || "";
					this.createComboBox();
					this.setEleType("N", config);
					;
					this.addItem(this.comboBoxObject.getLayer());

					if (this.comboBoxConfigObject.readOnlyInd.trim().toUpperCase() == "Y"
								|| this.comboBoxConfigObject.readOnly == true
								|| this.comboBoxConfigObject.disabled == true)
					{
						this.disable();
					}
					this.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);
				},
				/**
				 * Method intended to create the icon combo box
				 */
				createComboBox : function ()
				{
					var commonBundle = CRB.getFWBundle();
					var isDefault;
					var displayLabelName;
					comboBoxConfig = {
						"eleType" : "div",
						"id" : this.comboBoxConfigObject.itemId,
						"data-role" : "fieldcontain",
						"class" : 'jqm-form-field-c jqm-cbxComboBox ui-field-contain'

					};
					if (this.compositeField)
					{
						comboBoxConfig.style["width"] = this.getCompositeWidth(this.anchor);
					}
					if (typeof this.comboBoxConfigObject.visibleInd !== 'undefined'
								&& (this.comboBoxConfigObject.visibleInd.trim().toUpperCase() === 'N' || this.comboBoxConfigObject.hidden == true))
					{
						comboBoxConfig["class"] = "comboCls jqm-display-hide";

					}
					this.comboBoxObject = new cbx.lib.layer(comboBoxConfig);
					// Instantiates label control
					var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.comboBoxConfigObject);
					this.comboBoxObject.addLayer(cbxLabelObj.getComponentDOM());
					this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g, '');
					this.blankText = String.format(commonBundle['ERR_MANDATORY_SELECT'], this.label);
					this.createIconComboSelect(this.comboBoxData);

				},
				/**
				 * This method is responsible for creating the select with the Raw values as options based on the
				 * updateFlag. There are two scenarios based on updateFlag,
				 * 
				 * @1.If the updateFlag==false,this method creates the select element with the corresponding options.
				 * @2.If the updateFlag==true ,then the options will be created with the updated comboData and appended
				 *       to the existing select element.
				 */
				createIconComboSelect : function (rawDataArray)
				{
					var commonBundle = CRB.getFWBundle();
					var comboBoxOptionConfig;
					var comboBoxOptionObj;
					var comboBoxSelectConfig;
					// Creates select tag for the combo box
					if (this.updateFlag == false)
					{
						comboBoxSelectConfig = {
							"eleType" : "select",
							"id" : this.comboBoxConfigObject.itemId + '_field',
							"cbx-type" : "formField_" + this.comboBoxConfigObject.itemType,
							"name" : this.comboBoxConfigObject.itemId,
							"class" : "cbx-combobox ui-select",
							"data-role" : "none"
						};

						this.comboBoxSelectObj = new cbx.lib.layer(comboBoxSelectConfig);
					}
					if(this.includeSelect)
                    {
                    var comboBoxOptionConfig = {
                    "eleType" : "option",
                    "value" : ' ',
                    "html" : commonBundle['LBL_SELECT'],
                    "data-image" : "",
                    "data-imagecss" : "iconcombobox-" + this.itemId + " " + "comboIcon-" + this.formId
                                            + "-" + this.itemId + "-",
                    "data-title" : commonBundle['LBL_SELECT'],
                      };
                     comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
                     this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());
                     }
					var defaultValue = this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId];
					if (typeof rawDataArray !== 'undefined')
					{
						// Gets the combo box values and appends to the select tag
						for (var i = 0; i < rawDataArray.length; i++)
						{
							var comboBoxOptionConfig = {
								"eleType" : "option",
								"value" : rawDataArray[i].rawKey,
								"html" : rawDataArray[i].rawValue,
								"data-image" : "",
								"data-imagecss" : "iconcombobox-" + this.itemId + " " + "comboIcon-" + this.formId
											+ "-" + this.itemId + "-" + rawDataArray[i].rawKey,
								"data-title" : rawDataArray[i].rawValue
							};
							if (defaultValue === rawDataArray[i].rawKey)
							{

								comboBoxOptionConfig['selected'] = 'selected';
							}
							comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
							if (this.updateFlag == false)
							{
								this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());
							} else
							{
								$('#' + this.comboBoxConfigObject.itemId + '_field').append(
											comboBoxOptionObj.getLayer());
							}

						}

					}

					this.comboBoxObject.addLayer(this.comboBoxSelectObj.getLayer());
					
					var that = this;
					// Calling the msDropdown plugin to create the iconComboBox with the available select options.
					setTimeout(function ()
					{
						that.dropdownSelect = $('#' + that.comboBoxConfigObject.itemId + '_field').msDropdown({
							animStyle : 'slideDown',
							visibleRows : 7,
							on : {
								change : function (event)
								{
									doIScroll('CONTENT_DIV', 'enable');
                                    that.clearInvalid();
                                    that.formManager.model.updateValue(that.comboBoxConfigObject.itemId, that
                                            .getValue());
									$(that.dropdownSelect)[0].refresh();
                                    that.validateCombo();
								},
								close : function(event)
                                {
                                    that.validateCombo();
                                },
								click : function (event)
								{
									setTimeout(function ()
									{
										var documentWidth = $(document).width();
										if (documentWidth >= 1200)
										{
											$('#' + that.comboBoxConfigObject.itemId + '_field_child').css({
												'overflow-y' : "scroll"
											});
										} else
										{
											$('#' + that.comboBoxConfigObject.itemId + '_field_child').css({
												'overflow-y' : "hidden"
											});
											doIScroll(that.comboBoxConfigObject.itemId + '_field_child', 'add');
										}

										doIScroll('CONTENT_DIV', 'disable');
										$(that.dropdownSelect)[0].refresh();

									}, 300);

								}
							}
						}).data("dd");
					}, 100);
					this.setFormField($(this.comboBoxSelectObj.getLayer()));
					this.registerDefaultValidation(this);
					$('#CONTENT_DIV').on('click', function ()
					{
						doIScroll('CONTENT_DIV', 'refresh');
					});
					this.updateFlag = true;
					$(document).on("formPanelRender",function(){
	                    setTimeout(function(){
	                         that.manager.wrapperPanel.parentCt.getForm().addClass('dropdown-overflow');
	                     },150);
				});
				},
				
				/**
				 * removes the combo options				 
				 */
				removeComboStore : function ()
				{
					this.dropdownSelect = $('#' + this.comboBoxConfigObject.itemId + '_field').msDropDown().data("dd");
					this.dropdownSelect.destroy();
					$('#' + this.comboBoxConfigObject.itemId + '_field').empty();
					this.comboBoxData = [];
					this.clearInvalid();
                    this.validationHolder="";
                    $("#"+this.itemId).find('span').not(':first').remove();
				},
				// Returns the validation field
				getValidationField : function ()
				{
					return  $('#' + this.comboBoxConfigObject.itemId + '_field_msdd');
				},
				/**
				 * This method is responsible for updating the comboBoxData value and creating the options based on the
				 * data by calling the createIconComboSelect method with comboBoxData as arguments.
				 */
				updateComboRawStore : function (valueArr, keyArr)
				{
					var combundle = CRB.getFWBundle();
					var updateRawDataArray = [];
					var dataObj;
					var defaultValue;
					this.removeComboStore();
					if (keyArr.length !== valueArr.length)
					{
						// keys and values should be arrays of same length
						return;
					}
					if (cbx.core.isArray(keyArr) && cbx.core.isArray(valueArr))
					{

						for (var i = 0; i < keyArr.length; i++)
						{
							dataObj = {
								rawKey : valueArr[i],
								rawValue : keyArr[i]
							};
							this.comboBoxData.push(dataObj);
							updateRawDataArray.push(dataObj);
						}
						this.createIconComboSelect(updateRawDataArray);
					}
				},
				setSelect : function ()
				{
					if (this.includeSelect)
					{
						this.selectValue(' ', false);
					} else
					{
						this.selectValue('', false);
					}
					this.validateCombo();
				},
				/**
				 * method to validate a combobox
				 */
				validateCombo : function ()
				{
					combundle = CRB.getFWBundle();
					if (this.isSelectSelected() && this.required === 'Y')
					{
						// Showing the quick tip error indicator if the
						// field is null on mandatory
						this.markInvalid(this.blankText);
					}
				},
				/**
				 * method  to check Select option has been selected
				 */
				isSelectSelected : function ()
				{

					var returnFlag = (this.getValue() == ' ' || this.getValue() == 'Select') ? true : false;
					return returnFlag;
				},
				/**
				 * Methods directly ties up with the additional data format
				 * of Form FW and is responsible for parsing the provided
				 * additional data and repopulate the combo store.
				 */
				rePopulateAdditionaldata : function (addData)
				{
					var commonBundle = CRB.getFWBundle();
					this.comboBoxData = addData;
					this.removeComboStore();
					var comboBoxOptionConfig = {
						"eleType" : "option",
						"value" : ' ',
						"html" : commonBundle['LBL_SELECT'],
						"data-placeholder" : "true"
					};
					comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
					this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());
					$('#' + this.comboBoxConfigObject.itemId + '_field').selectmenu("refresh");
					for (var i = 0; i < this.comboBoxData.length; i++)
					{
						var comboBoxOptionConfig = {
							"eleType" : "option",
							"value" : this.comboBoxData[i].rawKey,
							"html" : this.comboBoxData[i].rawValue
						};
						/*
						 * if (this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId] ===
						 * this.comboBoxData[i].rawKey) { If the key of the combobox is equal to the default value in
						 * model obj, setting the value as default value
						 * 
						 * comboBoxOptionConfig['selected'] = 'selected'; }
						 */
						comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
						this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());
					}
					$('#' + this.comboBoxConfigObject.itemId + '_field').selectmenu("refresh");
					this.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);

				},
				populateAddData : function (items, rawType)
				{
					var rawDataArray = [];
					if (items != "" && items != null)
					{
						for (var i = 0; i < items.length; i++)
						{
							rawDataArray.push(items[i][rawType]);
						}
					}
					return rawDataArray;
				},

				// Returns the DOM object of combobox
				getComponentDOM : function ()
				{
					return this.comboBoxObject.getLayer();
				},
				selectValue : function (value, evtReq)
				{
					var queryselector = "option[value=" + value + "]";
					var option;

					this.getFormField().selectmenu();
					if (value == ' ')
					{
						option = this.getFormField().find('option[value=" "]');
						this.getFormField().val(value);
					} else
					{
						option = this.getFormField().find(queryselector);
						option.attr('selected', 'selected');
					}

					this.getFormField().selectmenu("refresh");

					if (evtReq)
					{
						this.getFormField().trigger('change');
					}

				},
				setValue : function (value)
				{
					var that = this;
					if (this.comboBoxData && cbx.isArray(this.comboBoxData))
					{

						for (var i = 0; i < this.comboBoxData.length; i++)
						{
							if (this.comboBoxData[i].rawKey == value)
							{
								setTimeout(function ()
								{
									that.dropdownSelect = $('#' + that.comboBoxConfigObject.itemId + '_field')
												.msDropDown().data("dd");
									that.dropdownSelect.setIndexByValue(that.comboBoxData[i].rawKey);
								}, 300);
								var eleDom = $('#' + that.comboBoxConfigObject.itemId + '_field_msdd').find(
											'div.ui-input-text');
								eleDom.remove();
								return;
							}
						}
						for (var i = 0; i < this.comboBoxData.length; i++)
						{
							if (this.comboBoxData[i].rawValue == value)
							{
								setTimeout(function ()
								{
									that.dropdownSelect = $('#' + that.comboBoxConfigObject.itemId + '_field')
												.msDropDown().data("dd");
									that.dropdownSelect.setIndexByValue(that.comboBoxData[i].rawKey);
								}, 300);
								var eleDom = $('#' + that.comboBoxConfigObject.itemId + '_field_msdd').find(
											'div.ui-input-text');
								eleDom.remove();
								return;
							}
						}

					}
					if (value == " " || value == "")
					{
						this.selectValue(value, false);

					}
				},
				getValue : function ()
				{
					return this.getFormField().val();
				},
				//Helper method to get the display value, will be invoked by manager.
				getDisplayValue : function (rawKey)
				{
					var retVal = '';
					for (var i = 0; i < this.comboBoxData.length; i++)
					{
						if (this.comboBoxData[i].rawKey == rawKey)
						{
							retVal = this.comboBoxData[i].rawValue;
							break;
						}
					}
					return retVal;
				}
			});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-iconcombobox'
}, cbx.lib.formElement.cbxiconcombobox);

/**
 * @class cbx.lib.formElement.cbxTabPanel
 * @extends cbx.core.Component
 * <p>A Tab panel rendered as basic container</p>
 * which optimizes normal horizontal or vertical tabs to accordion
 * on multi devices like: web, tablets, Mobile (IPad & IPhone). This plugin adapts the screen size and changes its
 * action accordingly.
 */

cbx.lib.formElement.cbxTabPanel = Class(cbx.core.Component, {
	formManager : null,
	isFormField : false,
	canValidate : false,
	constructor : function (config)
	{
		cbx.lib.formElement.cbxTabPanel.$super.call(this);
		this.formManager = config.fm;
		this.tabPanelConfig = config;
		this.xtype = config.xtype || "";
		this.mode = config.mode;
		this.createTabPanel(config);
		this.addItem(this.tabContainer.getLayer());
		this.setEleType("T", config);
		this.oldFormId = " ";
		// internal flag used to validate the tabform at the time of tab switch.
		this.validOnSwitchInd = config.validOnSwitchInd;
		var that = this;
		/**
		 * Event beforetabchange gets executed during the tab switch which is used to validate the switch between the tabs.This
		 * method will perform the following check in the order given below.
		 * 
		 * @1) In case validOnSwitchInd==='Y' then perform the validation of the sub form using
		 *     manager.isTabFormValid({formId:oldFormId}) and return from the handler in case the form is invalid.
		 * @2) If the returned value is true then the oldFormId will be assigned to the current new FormId. else it does
		 *     nothing.
		 */
		$(this.tabContainer.getLayer()).on(
					"beforetabchange",
					function (event, currentTab)
					{
						if ((currentTab.classList.contains('resp-accordion')) == true)
						{
							var newFormElement = $('#' + this.id).find(
										"[aria-labelledby='" + $(currentTab).attr("aria-controls") + "']")
							var newFormId = newFormElement[0].id.substring(0, newFormElement[0].id
										.indexOf("_INNER_PANEL"));
						} else
						{
							var newFormId = currentTab.id.substring(0, currentTab.id.indexOf("_CHILD_LIST"));
						}
						var firstTabDom = $('#' + this.id).find('.resp-tabs-container').find("div").first();
						if (that.oldFormId == " ")
						{
							that.oldFormId = firstTabDom[0].id.substring(0, firstTabDom[0].id.indexOf("_INNER_PANEL"));
						}
						if (that.validOnSwitchInd === 'Y')
						{
							currentTab.tabSwitch = this.parentCt.formManager.isTabFormValid({
								formId : that.oldFormId
							});
							if (currentTab.tabSwitch == true)
							{
								that.oldFormId = newFormId
							} else
							{
								// do nothing
							}
						}
						return currentTab.tabSwitch
					});
	},
	/**
	 * This method is responsible for creating the tabPanel with its child elements as thier respective tabs.
	 */
	createTabPanel : function (config)
	{
		var containerConf = {
			"eleType" : "div",
			"name" : this.tabPanelConfig.itemId,
			"id" : this.tabPanelConfig.itemId + "_CONTAINER",
			"class" : this.tabPanelConfig.itemId + "_CONTAINER",
			"cbx-type" : "formField_" + this.tabPanelConfig.itemType
		};
		this.tabContainer = new cbx.lib.layer(containerConf);
		var childForms = config.children;
		var childListConfig = {
			"eleType" : "ul",
			"class" : "resp-tabs-list"
		};
		this.listParent = new cbx.lib.layer(childListConfig).getLayer();
		this.tabContainer.addLayer(this.listParent);
		var childContentConfig = {
			"eleType" : "div",
			"id" : this.tabPanelConfig.itemId + "_TAB_PARENT",
			"class" : this.tabPanelConfig.itemId + "_TAB_PARENT resp-tabs-container ct-parent-app"
		};
		this.tabParent = new cbx.lib.layer(childContentConfig).getLayer();
		var that = this;
		if (!cbx.isEmpty(childForms))
		{
			$(childForms).each(
						function (index)
						{
							title = CRB.getBundle(cbx.jsutil.getBundleKey(childForms[index])) ? CRB
										.getBundle(cbx.jsutil.getBundleKey(childForms[index]))['LBL_'
										+ childForms[index].formTitle]
										|| childForms[index].formTitle : childForms[index].formTitle;
							var childClassArray = [ "ct-childList" + " " + childForms[index].formId + "_CHILD_LIST" ];
							if (index == 0)
							{
								childClassArray.push("ct-initActivate");
							}
							var childClassStr = childClassArray.join().replace(/,/g, " ");
							var childListConf = {
								"eleType" : "li",
								"id" : childForms[index].formId + "_CHILD_LIST",
								"class" : childClassStr,
								"html" : title
							};
							var childList = new cbx.lib.layer(childListConf).getLayer();
							that.listParent.appendChild(childList);
						});
		}
		var tabElements = this.createForm();
		/**
		 * Child panels for the tab.
		 */
		if (typeof tabElements !== 'undefined' && tabElements.length > 0)
		{
			for (var i = 0; i < tabElements.length; i++)
			{
				var childFormConf = {
					"eleType" : "div",
					"id" : childForms[i].formId + "_INNER_PANEL",
					"class" : childForms[i].formId + "_INNER_PANEL ct-child-app",
					'tab-index' : i
				};
				this.childFormCont = new cbx.lib.layer(childFormConf);
				var childComponentConfig = tabElements[i];
				if (typeof childComponentConfig.xtype !== 'undefined')
				{
					var cClass = CFCR.getFormCmp({
						'COMP_TYPE' : childComponentConfig.xtype
					});
					if (cClass)
					{
						if (childComponentConfig.xtype === "cbx-lazzyformpanel")
						{
							new cClass({
								'formPanel' : this.childFormCont.getLayer(),
								'formData' : childComponentConfig,
								'formManager' : this.formManager
							});
						}

					}
				}
				this.tabParent.appendChild(this.childFormCont.getLayer());
			}
		}
		this.tabContainer.addLayer(this.tabParent);
		$(this.tabContainer.getLayer()).easyResponsiveTabs({
			type : 'default', // Types: default, vertical, accordion
			width : 'auto', // auto or any width like 600px
			fit : true, // 100% fit in a container
			closed : 'accordion', // init-closed with accordion
			beforeTabSwitch : function ()
			{
				$(this).trigger("beforetabchange", this);
			},
			scope : this
		});
		// Loads the tab which is in the first position.
		var initItem = $(this.tabContainer.getLayer()).find('.ct-initActivate');
		initItem.trigger('click');
	},
	/**
	 * Method is responsible for reading the meta data for creating the tabforms with its child elements.
	 */
	createForm : function ()
	{
		var config = {
			formId : this.tabPanelConfig.formId,
			model : this.formManager.model,
			mode : this.mode ? this.mode : this.formManager.mode,
			manager : this.formManager,
			preInitConfig : this.formManager.preInitConfig,
			metadata : this.tabPanelConfig,
			screenView : this.formManager.screenView
		};
		// Retrieving formfield items
		var formCreator = new cbx.form.FormCreator(config);
		return formCreator.getFormFields();
	},
	/**
	 * Method is responsible for validating the whole tabpanel component during the parent form validation.
	 */
	validate : function ()
	{
		var fields = $(this.items).find('.cbx-conditional-ind');
		var parentformId;
		for (var i = 0; i < fields.length; i++)
		{
			var span = $(fields[i]);
			var id = span.parent().attr('for');
			var field = $(this.items).find('#' + id);
			var value;
			var component = field && field[0] && field[0].parentCt ? field[0].parentCt : $('#'
						+ id.substring(0, id.indexOf("_field")))[0].parentCt;
			value = component.getValue();
			if (cbx.isEmpty(value) || cbx.isEmpty(value.trim()))
			{
				parentformId = component.parentId;
				this.formManager.markInvalid(id.substring(0, id.indexOf("_field")));
				var initItem = $(this.items).find('#' + parentformId + '_CHILD_LIST');
				initItem.trigger('click');
				return false;
			}
		}
	},
	getComponentDOM : function ()
	{
		return this.tabContainer.getLayer();
	}

});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-tabpanel'
}, cbx.lib.formElement.cbxTabPanel);

/**
 * @class cbx.lib.formElement.cbxMultiselectComboBox
 * @extends cbx.core.Component
 * <p>A combobox control with multiselect support</p>
 * <p>A ComboBox works in a similar manner to a traditional HTML &lt;select> field. 
 * The <i>{@link #displayField}</i> is shown in the text field
 * which is named according to the {@link #name} and the most likely events are select and change.
 */
cbx.lib.formElement.cbxMultiselectComboBox = Class(
			cbx.core.Component,
			{
				comboBoxObject : '',
				comboBoxConfigObject : '',
				comboBoxData : '',
				canValidate : true,
				isFormField : true,
				config : {},
				comboBoxSelectObj : null,
				formManager : null,
				constructor : function(config) {
					cbx.apply(this, config);
					this.config = config;
					cbx.lib.formElement.cbxMultiselectComboBox.$super.call(this);
					this.triggerField = true;
					this.comboBoxConfigObject = config;
					this.xtype = config.xtype;
					this.anchor = config.anchor;
					this.itemId = config.itemId;
					this.label = this.getDisplayNameKey(this.config).replace(/\*/g, '');
					this.compositeField = config.compositeField ? config.compositeField
							: false;
					this.comboBoxData = config.addData;
					this.tempVal=[];
					this.formManager = config.fm;
					this.required = config.requiredInd;
					this.includeSelect = config.includeSelectInd === 'Y' ? true
								: false;
					this.includeSelectOnSingleValue = this.includeSelect;
					this.bundleKey = config.bundleKey || "";
					this.createComboBox();
					this.setEleType("N", config);
					;
					this.addItem(this.comboBoxObject.getLayer());
					if (this.comboBoxConfigObject.readOnlyInd.trim().toUpperCase() == "Y"
							|| this.comboBoxConfigObject.readOnly == true
							|| this.comboBoxConfigObject.disabled == true) {
						this.disable();
					}
					this
							.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);
				},
				createComboBox : function() {
					var commonBundle = CRB.getFWBundle();
					var comboBoxOptionConfig;
					var comboBoxOptionObj;
					var comboBoxSelectConfig;
					var isDefault;
					var displayLabelName;
					comboBoxConfig = {
						"eleType" : "div",
						"id" : this.comboBoxConfigObject.itemId,
						"data-role" : "fieldcontain",
						"class" : 'jqm-form-field-c jqm-cbxComboBox'
					};
					if (this.compositeField) {
						comboBoxConfig.style["width"] = this
								.getCompositeWidth(this.anchor);
					}
					if (typeof this.comboBoxConfigObject.visibleInd !== 'undefined'
							&& (this.comboBoxConfigObject.visibleInd.trim()
									.toUpperCase() === 'N' || this.comboBoxConfigObject.hidden == true)) {
						comboBoxConfig["class"] = "comboCls jqm-display-hide";

					}
					this.comboBoxObject = new cbx.lib.layer(comboBoxConfig);
					// Instantiates label control
					var cbxLabelObj = new cbx.lib.formElement.cbxLabel(
							this.comboBoxConfigObject);
					this.comboBoxObject.addLayer(cbxLabelObj.getComponentDOM());
					this.labelText = $(cbxLabelObj.getComponentDOM()).text()
							.replace(/\*/g, '');
					this.blankText = String.format(
							commonBundle['ERR_MANDATORY_SELECT'], this.label);
					
					
					var documentWidth = $(document).width();
					/**
					 * Check is made to display the combobox as jquery provided data native menu due to the default multiselect bahaviour varies
					 * for mobile view in desktop and for ios, Hence the combo box will be viewd as popup for selection.
					 */
					
					if(documentWidth>="1200" || cbx.isNativeIOS()){
						// Creates select tag for the combo box
						comboBoxSelectConfig = {
									"eleType" : "select",
									"id" : this.comboBoxConfigObject.itemId + '_field',
									"cbx-type" : "formField_"
											+ this.comboBoxConfigObject.itemType,
									"name" : this.comboBoxConfigObject.itemId,
									"class" : "cbx-combobox",
									"multiple" : "multiple",
									"data-native-menu":"false",
									"data-theme":"c"
								};
								
								
								this.comboBoxSelectObj = new cbx.lib.layer(comboBoxSelectConfig);
								var that = this;
								
								var comboBoxOptionConfig = {
									"eleType" : "option",
									"value" : ' ',
									"html" : commonBundle['LBL_SELECT'],
									"data-placeholder" : "true"
										
								};
								comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
								this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());

								// Get the value of the combobox from model
								var defaultValue = this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId];
								if (typeof this.comboBoxData !== 'undefined') {
									// Gets the combo box values and appends to the select tag
									for ( var i = 0; i < this.comboBoxData.length; i++) {
										var comboBoxOptionConfig = {
											"eleType" : "option",
											"value" : this.comboBoxData[i].rawKey,
											"html" : this.comboBoxData[i].rawValue
										};
										if (defaultValue === this.comboBoxData[i].rawKey) {
											comboBoxOptionConfig['selected'] = 'selected';
										}
										comboBoxOptionObj = new cbx.lib.layer(
												comboBoxOptionConfig);
										this.comboBoxSelectObj.addLayer(comboBoxOptionObj
												.getLayer());
									}
									$('#' + this.comboBoxConfigObject.itemId + '_field')
											.selectmenu("refresh");
								}
								this.comboBoxObject.addLayer(this.comboBoxSelectObj.getLayer());
								var that=this;		
								$(".ui-mobile-viewport").on('pagebeforeshow', '#'+this.comboBoxConfigObject.itemId +'_field-dialog', function (event) {

									try{
										if(cbx.isEmpty($.mobile.urlHistory.initialDst) && cbx.isEmpty($.mobile.urlHistory.getLast())){
											$.mobile.urlHistory.initialDst = $.mobile.path.parseLocation().hash.replace( "#", "" ).replace($.mobile.dialogHashKey,"");
										}

										if(cbx.isEmpty($.mobile.urlHistory.initialDst) && (!cbx.isEmpty($.mobile.urlHistory.getLast())) && !cbx.isEmpty($.mobile.urlHistory.getLast().hash)){
											$.mobile.urlHistory.initialDst = $.mobile.path.parseLocation().hash.replace( "#", "" ).replace($.mobile.dialogHashKey,"");
										}
									}catch(err){
										LOGGER.error('Exception' +err+ 'occured on initialDst of  urlHistory');
									}	

									$(this).find("div.ui-title").empty().append(that.labelText);

								});
								$(".ui-mobile-viewport").on("pageshow",'#'+this.comboBoxConfigObject.itemId + '_field-dialog',function(e){ 

									doIScroll(that.comboBoxConfigObject.itemId + '_field-dialog','remove');

									var scrllConfig = {
												"ele":	this,
												scrollX : false,
												scrollY : true,										
												preventBeforeScroll : true
									};
									$(this).addClass("dialog-container");
									$('#'+that.comboBoxConfigObject.itemId + '_field-dialog').height(100);
									doIScroll(that.comboBoxConfigObject.itemId + '_field-dialog','add',scrllConfig);
															

								});
								
								
								$(".ui-mobile-viewport").on("pagehide",'#'+this.comboBoxConfigObject.itemId +'_field-dialog',function(){ 									
									var raiseFlag=false;
									if(that.tempVal.length>0 && !cbx.isEmpty(that.getFormField().val())){
										if(that.tempVal.join('')!=that.getFormField().val().join('')){
											raiseFlag=true;
										}
									}else{
										if(!cbx.isEmpty(that.getFormField().val())){
											raiseFlag=true;
										}
									}
									if(raiseFlag){
									that.clearInvalid();								
									that.formManager.model.updateValue(
											that.comboBoxConfigObject.itemId, that
													.getValue(), true);
								
									}		
									setTimeout(function(){
										that.validateCombo();
									},10);
									doIScroll("CONTENT_DIV",'refresh');
									});
								
								$(document).on('popupafterclose', '#'+this.comboBoxConfigObject.itemId +'_field-listbox', function (e) {
									e.stopPropagation();
									setTimeout(function(){
										var raiseFlag=false;
										if(that.tempVal.length>0 && !cbx.isEmpty(that.getFormField().val())){
											if(that.tempVal.join('')!=that.getFormField().val().join('')){
												raiseFlag=true;
											}
										}else{
											if(!cbx.isEmpty(that.getFormField().val())){
												raiseFlag=true;
											}
										}
										if(raiseFlag){
										that.clearInvalid();
										that.formManager.model.updateValue(
												that.comboBoxConfigObject.itemId, that
														.getValue(), true);
									}
										setTimeout(function(){
											that.validateCombo();
										},10);
									},300);
							
								});
								$(document).on('popupbeforeposition', '#'+this.comboBoxConfigObject.itemId +'_field-listbox', function() {
									$(this).addClass("dialog-container");
								});
					}
					else {
						comboBoxSelectConfig = {
									"eleType" : "select",
									"id" : this.comboBoxConfigObject.itemId + '_field',
									"cbx-type" : "formField_"
											+ this.comboBoxConfigObject.itemType,
									"name" : this.comboBoxConfigObject.itemId,
									"class" : "cbx-combobox",
									"multiple" : "multiple"
								};
								
								
								this.comboBoxSelectObj = new cbx.lib.layer(comboBoxSelectConfig);
								var that = this;
							
								// Get the value of the combobox from model
								var defaultValue = this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId];
								if (typeof this.comboBoxData !== 'undefined') {
									// Gets the combo box values and appends to the select tag
									for ( var i = 0; i < this.comboBoxData.length; i++) {
										var comboBoxOptionConfig = {
											"eleType" : "option",
											"value" : this.comboBoxData[i].rawKey,
											"html" : this.comboBoxData[i].rawValue
										};
										if (defaultValue === this.comboBoxData[i].rawKey) { 
											comboBoxOptionConfig['selected'] = 'selected';
										}
										comboBoxOptionObj = new cbx.lib.layer(
												comboBoxOptionConfig);
										this.comboBoxSelectObj.addLayer(comboBoxOptionObj
												.getLayer());
									}
									$('#' + this.comboBoxConfigObject.itemId + '_field')
											.selectmenu("refresh");
								}
								this.comboBoxObject.addLayer(this.comboBoxSelectObj.getLayer());
								
								
					}
						
					$(this.comboBoxSelectObj.getLayer()).on(
								'blur',
								this,
								function(event) {
									var raiseFlag=false;
									if(that.tempVal.length>0 && !cbx.isEmpty(that.getFormField().val())){
										if(that.tempVal.join('')!=that.getFormField().val().join('')){
											raiseFlag=true;
										}
									}else{
										if(!cbx.isEmpty(that.getFormField().val())){
											raiseFlag=true;
										}
									}
									if(raiseFlag){
									that.clearInvalid();
									that.formManager.model.updateValue(
											that.comboBoxConfigObject.itemId, that
													.getValue(), true);									
								}
									setTimeout(function(){
										that.validateCombo();
									},10);
								});
						this.setFormField($(this.comboBoxSelectObj.getLayer()));
						this.registerDefaultValidation(this);
					
				},
				/**
				 * removes the combo options				 
				 */
				removeComboStore : function() {
					$('#' + this.comboBoxConfigObject.itemId + '_field').empty();
					$('#' + this.comboBoxConfigObject.itemId + '_field')
							.selectmenu("refresh");

				},
				//Method to get the field parent element
				getValidationField : function() {
					return this.getFormField().parent();
				},				
				/**
				 * update the store of this combobox with new keys and
				 * values supplied.
				 * 
				 * @param {Array}
				 *            arr containing value keys
				 */
				updateComboRawStore : function(valueArr, keyArr) {
					var combundle = CRB.getFWBundle();
					var dataObj;
					var defaultValue;
					this.removeComboStore();
					if (keyArr.length !== valueArr.length) {
						// keys and values should be arrays of same length
						return;
					}
					this.tempVal=[];
					
				var documentWidth = $(document).width();
				/**
				 * Check is made to display the combobox as jquery provided data native menu due to the default multiselect bahaviour varies
				 * for mobile view in desktop and for ios, Hence the combo box will be viewd as popup for selection.
				 */
					if(documentWidth >="1200" || cbx.isNativeIOS()){
					if (cbx.core.isArray(keyArr) && cbx.core.isArray(valueArr)) {
						var fieldObj = $('#' + this.comboBoxConfigObject.itemId
								+ '_field');
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							var dataObj = {
								rawValue : ' ',
								rawKey : combundle['LBL_SELECT']
							};
							fieldObj.append(new Option(dataObj['rawKey'],
									dataObj['rawValue']));
							this.comboBoxData.push(dataObj);
						} else {
							var dataObj = {
								rawValue : '',
								rawKey : combundle['LBL_SELECT']
							};
							var placeHolder = new Option(dataObj['rawKey'],
									dataObj['rawValue']);
							placeHolder.setAttribute("data-placeholder", 'true');
							placeHolder.setAttribute("style", "display:none");
							fieldObj.append(placeHolder);
							
							this.comboBoxData.push(dataObj);
						}
						for ( var i = 0; i < keyArr.length; i++) {
							if (this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId] == keyArr[i]) {
								fieldObj
										.append(new Option(keyArr[i], valueArr[i]));
								defaultValue = valueArr[i];
							} else {
								fieldObj.append(new Option(keyArr[i], valueArr[i]));
							}
							dataObj = {
								rawKey : valueArr[i],
								rawValue : keyArr[i]
							};
							this.comboBoxData.push(dataObj);
						}
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							this.setSelect();
						}
						
						if (keyArr.length == 1) {
							if (this.includeSelectOnSingleValue) {
								this.setValue(' ');
								
							} else {
								
								
								this.selectValue(valueArr[0], true); 
								
								if (this.fireEventOnSingleSelect) {
									
									this.syncModelData();
									
								}
							}
						}
					}
					$('#' + this.comboBoxConfigObject.itemId + '_field')
							.selectmenu("refresh");
					this
					.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);
					this.clearInvalid();
					}
					else
					{
					if (cbx.core.isArray(keyArr) && cbx.core.isArray(valueArr)) {
						var fieldObj = $('#' + this.comboBoxConfigObject.itemId
								+ '_field');

					
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							var dataObj = {
								rawValue : ' ',
								rawKey : ''
							
							};
							fieldObj.append(new Option(dataObj['rawKey'],
									dataObj['rawValue']));
							this.comboBoxData.push(dataObj);
						} else {
							var dataObj = {
								rawValue : '',
								rawKey : ''
							};
							
							this.comboBoxData.push(dataObj);
						}
						for ( var i = 0; i < keyArr.length; i++) {
							if (this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId] == keyArr[i]) {
								fieldObj
										.append(new Option(keyArr[i], valueArr[i]));
								defaultValue = valueArr[i];
							} else {
								fieldObj.append(new Option(keyArr[i], valueArr[i]));
							}
							dataObj = {
								rawKey : valueArr[i],
								rawValue : keyArr[i]
							};
							this.comboBoxData.push(dataObj);
						}
						if (this.includeSelect
								&& (keyArr.length > 1 || this.includeSelectOnSingleValue)) {
							this.setSelect();
						}
						
						if (keyArr.length == 1) {
							if (this.includeSelectOnSingleValue) {
								this.setValue(' ');
								
							} else {
								
								this.selectValue(valueArr[0], true); 
								
								if (this.fireEventOnSingleSelect) {
									this.syncModelData();
									
								}
							}
						}
					}
					$('#' + this.comboBoxConfigObject.itemId + '_field')
							.selectmenu("refresh");
					this
					.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);
					this.clearInvalid();
					}
				},
				setSelect : function() {
					if (this.includeSelect) {
						this.selectValue(' ', false); 
					} else {
						this.selectValue('', false); 
					}
					this.validateCombo();
				},
				/**
				 * method to validate a combobox
				 */
				validateCombo : function() {
					combundle = CRB.getFWBundle();
					if (this.getValue().length==0 && this.required === 'Y') {
						// Showing the quick tip error indicator if the
						// field is null on mandatory
						this.markInvalid(this.blankText);
					}
				},
				/**
				 * method to check select option has been selected
				 */
				isSelectSelected : function() {

					var returnFlag = (this.getValue() == ' ' || this.getValue() == 'Select') ? true
							: false;
					return returnFlag;
				},
				/**
				 * Methods directly ties up with the additional data format
				 * of Form FW and is responsible for parsing the provided
				 * additional data and repopulate the combo store.
				 */
				rePopulateAdditionaldata : function(addData) {
					var commonBundle = CRB.getFWBundle();
					this.comboBoxData = addData;
					this.removeComboStore();
					var documentWidth = $(document).width();
					this.tempVal=[];
				if(documentWidth>="1200" || cbx.isNativeIOS()){
					var comboBoxOptionConfig = {
						"eleType" : "option",
						"value" : ' ',
						"html" : commonBundle['LBL_SELECT'],
						"data-placeholder" : "true"
					};
					comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
					this.comboBoxSelectObj.addLayer(comboBoxOptionObj.getLayer());
					$('#' + this.comboBoxConfigObject.itemId + '_field')
							.selectmenu("refresh");
					for ( var i = 0; i < this.comboBoxData.length; i++) {
						var comboBoxOptionConfig = {
							"eleType" : "option",
							"value" : this.comboBoxData[i].rawKey,
							"html" : this.comboBoxData[i].rawValue
						};
						
						comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
						this.comboBoxSelectObj.addLayer(comboBoxOptionObj
								.getLayer());
					}
					$('#' + this.comboBoxConfigObject.itemId + '_field')
							.selectmenu("refresh");
							}
				else
					{
							for ( var i = 0; i < this.comboBoxData.length; i++) {
						var comboBoxOptionConfig = {
							"eleType" : "option",
							"value" : this.comboBoxData[i].rawKey,
							"html" : this.comboBoxData[i].rawValue
						};
						
						comboBoxOptionObj = new cbx.lib.layer(comboBoxOptionConfig);
						this.comboBoxSelectObj.addLayer(comboBoxOptionObj
								.getLayer());
					}
					$('#' + this.comboBoxConfigObject.itemId + '_field')
							.selectmenu("refresh");
							}
					this
							.setValue(this.formManager.model.getModelData()[this.comboBoxConfigObject.itemId]);

				},
				populateAddData : function(items, rawType) {
					var rawDataArray = [];
					if (items != "" && items != null) {
						for ( var i = 0; i < items.length; i++) {
							rawDataArray.push(items[i][rawType]);
						}
					}
					return rawDataArray;
				},
			
				// Returns the DOM object of combobox
				getComponentDOM : function() {
					return this.comboBoxObject.getLayer();
				},
				selectValue : function(value, evtReq) { 
					var queryselector = "option[value=" + value + "]";
					var option;
					
					this.getFormField().selectmenu();
					if (value == ' ') {
						option = this.getFormField().find('option[value=" "]');
						this.getFormField().val(value);
					} else {
						option = this.getFormField().find(queryselector);
						option.attr('selected', 'selected');
					}
				
					this.getFormField().selectmenu("refresh");
					
					if (evtReq) {
						this.getFormField().trigger('change');
					}
					
				},
				/**
				 * Sets the specified value for the field. The value can be an Array or a String (optionally with separating commas)
				 * If the value finds a match, the corresponding record text will be displayed in the field.
				 * @param {Mixed} value The value to match
				 */
				setValue : function(v) {
					var vals=[];
					if(!cbx.isEmpty(v)){
						if (!cbx.isArray(v)){ 
							var result = [];
							result=v.split(",");

							vals=result;
						}else if (cbx.isArray(v)){
							vals=v;
						}
					}
					if (this.comboBoxData && cbx.isArray(this.comboBoxData)) {
						if(!cbx.isEmpty(vals)){
						this.getFormField().val(vals);
						try{
						this.getFormField().selectmenu("refresh");
						}catch(err){}
						}
					}
					this.tempVal=vals;
					
					var elementCount=$(this.comboBoxObject.getLayer()).find("div.ui-select").find("span.ui-li-count");
					if(elementCount.is(':visible')){
						var counter=elementCount.val() || elementCount.html();
						if(!cbx.isEmpty(counter) && parseInt(counter)!=this.tempVal.length){
							this.tempVal=this.getValue();
						}
					}
					if (v == " " || v == "") {
						this.selectValue(v, false);
						
					}
				},
				/**
				 * gets the specified value for the field. The value can be only Array in sorted manner.
				 */
				getValue : function() {
					var resultarr = [];
					var val=this.getFormField().val();
					if(!cbx.isEmpty(val))
					{

						if (cbx.isArray(val)){ 
							resultarr=val;					
						}else{				
							resultarr=val.split(",");	
						}				
					}
					this.tempVal=resultarr;
					return resultarr
				},
				//Helper method to get the display value will be invoked by manager.
				getDisplayValue : function(val) {
					var out = [];
					var value=[];
					if(!cbx.isEmpty(val)){
						if (!cbx.isArray(val)){ 
							var result = [];
							result=val.split(",");

							value=result;
						}else if (cbx.isArray(val)){
							value=val;
						}
					}
					if (typeof this.addData !== 'undefined'
						&& this.addData.length > 0) {
						for ( var i = 0; i < this.addData.length; i++) {
							if (value.contains(this.addData[i]['rawKey'])) {
								out.push(this.addData[i]['rawValue']);
							}
						}				
					}
					
					return out;
				}
			
			});
	CFCR.registerFormCmp({
		'COMP_TYPE' : 'cbx-multiselectcombobox'
	}, cbx.lib.formElement.cbxMultiselectComboBox);
	CFCR.registerFormCmp({
		'COMP_TYPE' : 'cbx-itemselector'
	}, cbx.lib.formElement.cbxMultiselectComboBox);
	
	

	/**
	 * @class cbx.lib.formElement.cbxStaticMultiComboBox
	 * @extends cbx.core.Component
	 * Multiline span field.  Can be used as a direct replacement for span elements.
	 */
	cbx.lib.formElement.cbxStaticMultiComboBox = Class(
				cbx.core.Component,
				{
					isFormField : true,
					comboBoxContainer : '',
					staticMSCBConfig : '',
					ctlCls : 'cbxstaticfield', 
					canValidate : false,
					addData : null,
					formManager : null,
					constructor : function(config) {
						cbx.lib.formElement.cbxStaticMultiComboBox.$super.call(this);
						this.setEleType("S", config);
						this.triggerField = true;
						this.anchor = config.anchor;
						this.staticMSCBConfig = config;
						this.bundleKey = config.bundleKey || "";
						this.compositeField = config.compositeField ? config.compositeField
								: false;
						this.xtype = config.xtype || "";
						this.addData = config.addData;
						this.formManager = config.fm;
						this.cbxStaticMultiComboBox();
						this.addItem(this.comboBoxContainer.getLayer());
					},
					// Instantiates multiselect combo-box 
					cbxStaticMultiComboBox : function(config) {
						var mscbContainerConfig = {
							"eleType" : "div",
							"class" : "staticfield staticcombo",
							"id" : this.staticMSCBConfig.itemId,
							"data-role" : "fieldcontain"
						};
						if (this.compositeField) {
							mscbContainerConfig.style["width"] = this.anchor;
						}
						
						if (typeof this.staticMSCBConfig.visibleInd !== 'undefined'
								&& (this.staticMSCBConfig.visibleInd.trim().toUpperCase() === 'N' || this.staticMSCBConfig.hidden == true)) {
							mscbContainerConfig["class"] = mscbContainerConfig["class"] + "ui-field-contain ui-body jqm-display-hide";

						}
						
						this.comboBoxContainer = new cbx.lib.layer(mscbContainerConfig);
						var scLabel = new cbx.lib.formElement.cbxLabel(
								this.staticMSCBConfig).getComponentDOM();
						this.comboBoxContainer.addLayer(scLabel);

						if (typeof this.staticMSCBConfig.customClass !== 'undefined'
								&& this.staticMSCBConfig.customClss !== '') {
							this.ctlCls = this.staticMSCBConfig.customClass;
						}
						var dataEleConfig = {
							'eleType' : 'span',
							'class' : this.ctlCls,
							"name" : this.staticMSCBConfig.itemId,
							"cbx-type" : "formField_" + this.staticMSCBConfig.itemType,
							"readonly":"readonly"
						};
						var dataEleContainer = new cbx.lib.layer(dataEleConfig)
								.getLayer();
						this.dataEleContainer = dataEleContainer;
						this.comboBoxContainer.addLayer(dataEleContainer);
						this.addItem(this.comboBoxContainer.getLayer());
						this.setFormField($(dataEleContainer));
						// creating the data element
						var value = this.formManager.model.getModelData()[this.staticMSCBConfig.itemId];
						value = this.getItemValue(value) || '--';
						this.setValue(value.join(','));

					},
					 /**
				     * Sets a data value into the field  without validation 
				     * @param {Mixed} value The value to set
				     */
					setValue : function(value) {
						var val=this.getItemValue(value);
						if(val.length>0)
							this.getFormField().html(val.join(','));
						else
							this.getFormField().html('--');
					},
					 /**
				     * Returns the items of the "value" attribute
				     * @param {String} list of items
				     * @return {Array
				     */	
					getItemValue : function(val) {
						var out = [];
						var value=[];
						if(!cbx.isEmpty(val)){
							if (!cbx.isArray(val)){ 
								var result = [];
								result=val.split(",");

								value=result;
							}else if (cbx.isArray(val)){
								value=val;
							}
						}
						if (typeof this.addData !== 'undefined'
							&& this.addData.length > 0) {
							for ( var i = 0; i < this.addData.length; i++) {
								if (value.contains(this.addData[i]['rawKey'])) {
									out.push(this.addData[i]['rawValue']);
								}
							}
							if(cbx.isEmpty(out)){
								for ( var i = 0; i < this.addData.length; i++) {
									if (value.contains(this.addData[i]['rawValue'])) {
										out.push(this.addData[i]['rawValue']);
									}
								}							
							}
						}
						return out;
					},
					/**
					 * Methods directly ties up with the additional data format
					 * of Form FW and is responsible for parsing the provided
					 * additional data and repopulate the combo store.
					 */
					rePopulateAdditionaldata : function(additionalData) {
						if (typeof additionalData !== 'undefined'
								&& additionalData.length > 0) {
							this.addData = additionalData;
							this.setValue(this.formManager.model
									.getValue(this.staticMSCBConfig.itemId));
						}
					},
					// Returns the DOM object of combobox
					getComponentDOM : function() {
						return this.comboBoxContainer.getLayer();
					},
					// Returns the validation field
					getValidationField : function() {
						return $("");
					}
				});

		CFCR.registerFormCmp({
			'COMP_TYPE' : 'cbx-staticmultiselectcombobox'
		}, cbx.lib.formElement.cbxStaticMultiComboBox);

		CFCR.registerFormCmp({
			'COMP_TYPE' : 'cbx-staticitemselector'
		}, cbx.lib.formElement.cbxStaticMultiComboBox);
		
		
		/**
		 * Augo Suggest Box
		 * Added as part of CBX 
		 * Author : Swathi Jayaprakash
		 */
		 
		cbx.lib.formElement.cbxAutoSuggest = Class(cbx.core.Component,{
			isFormField : true,
			canValidate : true,
			constructor : function(config) {
				cbx.lib.formElement.cbxAutoSuggest.$super.call(this);
				this.config = config;
				this.xtype = config.xtype || "";
				this.itemId = config.itemId;
				
				this.label = this.getDisplayNameKey(this.config).replace(/\*/g,'');
				var commonBundle = CRB.getFWBundle();
				this.blankText = String.format(commonBundle['ERR_MANDATORY_SELECT'], this.label);
				
				this.compositeField = config.compositeField ? config.compositeField	: false;
				this.autoSuggestBoxData = config.addData || [];
				this.validationType = config.vType;
				this.maxLength = config.maxLength;
				this.minLength = config.minLength;
				
				this.formManager = config.fm;
				this.required = config.requiredInd;
				this.includeSelectOnSingleValue = this.includeSelect;
				this.bundleKey = config.bundleKey || "";
				this.anchor = config.anchor;
				this.createAutoSuggestBox();
				
				this.addItem(this.autoSuggestBoxObject.getLayer());
				
				doIScroll('CONTENT_DIV', 'refresh');
				if (this.config.disabled == true) {
					this.disable();
				}
			},
			
			createAutoSuggestBox: function() {
				var commonBundle = CRB.getFWBundle();
				var autoSuggestBoxConfig = {
					"eleType" : "div",
					"id" : this.itemId+"-container",
					"data-role" : "fieldcontain",
					"class" : 'jqm-form-field-c jqm-cbxautoSuggestBox',
					"style" : {	}
				};
				if (this.compositeField) {
					autoSuggestBoxConfig.style["width"] = this.getCompositeWidth(this.anchor);
				}
				if (typeof this.config.visibleInd !== 'undefined' && 
					(this.config.visibleInd.trim().toUpperCase() === 'N' || 
						this.config.hidden === true)) {
					autoSuggestBoxConfig["class"] = "autoSuggestCls jqm-display-hide";
				}
				this.autoSuggestBoxObject = new cbx.lib.layer(autoSuggestBoxConfig);
				
				var inputConfig = $.extend(true,{},this.config);
				inputConfig.itemType = "TEXT";
				var inputText = new cbx.lib.formElement.cbxTextField(inputConfig);
				
				var inputElementContainer = inputText.getComponentDOM();
				this.autoSuggestBoxObject.addLayer(inputElementContainer);
				
				this.inputEle = $(inputElementContainer).find("input#"+this.config.itemId+"_field");
				
				if (!cbx.isEmpty(this.validationType)) {
					var registeredVtypes = cbx.form.vTypeRegistry.getVtypes();
					for ( var i = 0; i < registeredVtypes.length; i++) {
						if (this.validationType == registeredVtypes[i].name) {
							this.config.maskRe = registeredVtypes[i].mask;
							this.config.invalidText = registeredVtypes[i].text;
							this.config.globalRe = registeredVtypes[i].globalRe;
							break;
						}
					}
				}
				
				
				var fieldValue = this.formManager.model.getModelData()[this.config.itemId];
				if (!cbx.isEmpty(fieldValue)) {
					this.setValue(fieldValue);
				}
				
				var autoSuggestBoxULConfig = {
					"eleType" : "ul",
					"id" : this.config.itemId+ '_searched_field',
					"cbx-type" : "formField_"+ this.config.itemType,
					"name" : this.config.itemId+ '_searched_field',
					"class": "cbx-searchedlist"
				};
				this.autoSuggestBoxULObj = new cbx.lib.layer(autoSuggestBoxULConfig);
				var that = this;
				if (typeof this.autoSuggestBoxData !== 'undefined') {
					this.inputEle.on("keyup",function(e) {
						e.preventDefault();
						var $this = $(this);
						setTimeout(function() {
							var val = $.trim($this.val()).toLowerCase();
							var listview = $(that.autoSuggestBoxULObj.getLayer()).listview({inset : true});
							var tmpArray = [];
							if (val.length > 0) {
								that.clearInvalid();
								listview.empty();
								for (var i = 0; i < that.autoSuggestBoxData.length; i++) {
									if (that.autoSuggestBoxData[i].rawValue.toLowerCase().match(val)) {
										var child = $("<li/>",{'value':that.autoSuggestBoxData[i].rawKey}).append("<a href='#'>"+ that.autoSuggestBoxData[i].rawValue+ "</a>").on("click",function() {
											that.inputEle.val($.trim($(this).text()));
											$(that.autoSuggestBoxULObj.getLayer()).find("li").addClass('ui-screen-hidden');
										});
										listview.not(":contains('"+ that.autoSuggestBoxData[i].rawValue+ "')").append(child);
									   }
								}
							} else
								listview.empty();
							listview.listview("refresh");
						}, 250);
					});
					this.inputEle.on("blur", function(e){
						var crb = CRB.getFWBundle(),
							value = $(this).val();
						if (cbx.isEmpty(value)) {
							that.inputEle.val(value);
							var rb = CRB.getBundle(cbx.jsutil.getBundleKey(that));
							var lblKey = (cbx.isEmpty(rb["LBL_"+that.config.displayNmKey]))? (rb[that.label])?rb[that.label]:that.label: rb["LBL_"+that.config.displayNmKey];
							var blankText = String.format(rb['ERR_MANDATORY_SELECT'], lblKey);
							if (that.config.requiredInd === 'Y') {
								that.formManager.markInvalid(that.config.itemId,blankText);
							} else {
								that.clearInvalid();
							}
						}
						that.syncModelData.apply(that);
						$(that.autoSuggestBoxULObj.getLayer()).find("li").addClass('ui-screen-hidden');
					});
				}
				this.setFormField(this.inputEle);
				this.registerDefaultValidation(this);
			
				this.autoSuggestBoxObject.addLayer(this.autoSuggestBoxULObj.getLayer());
			},
			
			getComponentDOM: function(){
				return this.autoSuggestBoxObject.getLayer();
			},
			
			getValue: function(){
				return this.inputEle.val();
			},
			
			setValue: function(value){
				this.inputEle.val(value);
			},
			
			syncModelData : function() {
				if (!cbx.isEmpty(this.config.multiInd)
						&& this.config.multiInd == true
						&& !cbx.isEmpty(this.config.index)) {
					if (this.formManager.handlerEvent('cbxvalidate',
							this.config.itemId, this.getValue(), this.index,
							this.multiFormId) === false) {
						return;
					}
				} else if (this.formManager.handlerEvent('cbxvalidate',
						this.config.itemId, this.getValue()) === false) {
					return;
				}
				if (!cbx.isEmpty(this.config.multiInd)
						&& this.config.multiInd == true
						&& !cbx.isEmpty(this.config.index)) {
					this.formManager.model.updateValue(this.config.itemId, this
							.getValue(), undefined, this.index,
							this.multiFormId);
				} else if (this.formManager.model.getValue(this.config.itemId) !== this
						.getValue()) {
					this.formManager.model.updateValue(this.config.itemId, this
							.getValue());
				}
				this.formManager.clearInvalid(this.itemId);
			},
			
			getValidationField : function() {
				this.validationHolder = $(this.autoSuggestBoxObject.getLayer()).find(".mandatoryAction");
				return this.inputEle.parent();
			}
				
		});
		CFCR.registerFormCmp({'COMP_TYPE' : 'cbx-autoSuggest'}, cbx.lib.formElement.cbxAutoSuggest);
