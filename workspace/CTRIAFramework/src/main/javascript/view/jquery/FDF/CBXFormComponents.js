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
cbx.lib.formElement.cbxCompositeField = Class(
		cbx.core.Component,
		{
			formManager : null,
			isFormField : false,
			constructor : function(config) {
				cbx.lib.formElement.cbxCompositeField.$super.call(this);
				this.formManager = config.fm;
				this.itemAnchor=0;
				this.xtype=config.xtype || "";
				this.anchor=config.anchor;
				this.createCompositFieldSet(config);
				this.addItem(this.compositFieldObject.getLayer());
				this.setEleType("N",config);
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
				if(typeof this.compositFieldSetData.visibleInd !== 'undefined' && (this.compositFieldSetData.visibleInd
						.trim().toUpperCase() === 'N' || this.compositFieldSetData.hidden == true)){
					compositConfig["class"]=compositConfig["class"]+" ui-field-contain ui-body jqm-display-hide";
					showFlag = false;
				}
				this.compositFieldObject = new cbx.lib.layer(compositConfig);
				if(!showFlag){
					$(this.compositFieldObject.getLayer()).hide()
				}
				var compositWrapConfig = {
						"eleType" : "div",
						"data-role" : "fieldcontain",
						"id" : this.compositFieldSetData.itemId+"_wrap",
						"class" : "cbx-compositefield_wrap"
						
					};
				
				this.compositFieldWrapObject = new cbx.lib.layer(compositWrapConfig);
				this.compositFieldSetData.hideLabelInd ="N";//Hardcoded as hidelabel not working in ext version
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.compositFieldSetData);
				/**
				 * Added TO support wrong configuration for  Demo
				 * hideLabel is Y,yet display nm key is being processed in retail IB
				 */
				if($(cbxLabelObj.getComponentDOM()).text()=="LBL_"+this.compositFieldSetData.displayNmKey ||
									$(cbxLabelObj.getComponentDOM()).text()=="LBL_"+this.compositFieldSetData.plainLbl){
					$(cbxLabelObj.getComponentDOM()).hide();
				}
				this.compositFieldObject.addLayer(cbxLabelObj.getComponentDOM());
				this.compositFieldObject.addLayer(this.compositFieldWrapObject.getLayer());

				
				var compositFormObject;
				var compositeFieldsArray = this.compositFieldSetData.children;
				

				var that = this;
				var iterateFormElements = function() {
					var compositeFieldsArray = that.createItems();
					if (typeof compositeFieldsArray !== 'undefined'
							&& compositeFieldsArray.length > 0) {
						for ( var i = 0; i < compositeFieldsArray.length; i++) {
							//var anchor = 100%;
							var compositFieldChildConfig = compositeFieldsArray[i];
							if(parseInt(that.itemAnchor) !=0){
								var newAnchor = that.itemAnchor+parseInt(compositFieldChildConfig.anchor);
								if(newAnchor>100){
									var negation = newAnchor-100;
									newAnchor = parseInt(compositFieldChildConfig.anchor)-negation;
								}
								compositFieldChildConfig.anchor = newAnchor+"%";
								
							}
							else{
								that.itemAnchor = parseInt(compositFieldChildConfig.anchor);
								
							}

							compositFieldChildConfig.anchor = (100/compositeFieldsArray.length)+"%";
							
							LOGGER.info('compositFieldChildConfig.anchor ',compositFieldChildConfig.anchor)
							compositFieldChildConfig.compositeField=true;
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
									} /*else if (compositFieldChildConfig.xtype === "cbx-lazzypanel") {
										new cClass(
												{
													'formPanel' : that.compositFieldObject
															.getLayer(),
													'formData' : compositFieldChildConfig,
													'formManager' : that.formManager
												});
									} */else {
										if (compositFieldChildConfig.xtype === "cbx-combobox") {
											compositFieldChildConfig['additionalData'] = that.compositFieldSetData.additionalData[compositFieldChildConfig['itemId']];
										} else if (compositFieldChildConfig.xtype == "cbx-fieldset" || compositFieldChildConfig.xtype == "cbx-lazzypanel") {
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
 * 

 */

cbx.lib.formElement.cbxDateField = Class(
		cbx.core.Component,
		{
			isFormField: true,
			constructor : function(config) {
			cbx.apply(this,config);
				cbx.lib.formElement.cbxDateField.$super.call(this);				
				this.input = null;
				this.config = config;
				this.anchor=config.anchor;
				this.itemId=config.itemId;
				this.xtype=config.xtype || "";
				this.bundleKey=config.bundleKey || "";
				this.compositeField=config.compositeField?config.compositeField:false;
				this.formManager = config.fm;
				this.preferredDateFormats = {
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
				this.initDateField();
				this.addItem(this.formCmponentObject.getLayer());
				if(config.disabled==true){
					this.disable();
				}
				this.setEleType("N",config);;
			},
			createDateField : function() {
				configData = this.config;
				formConfig = {
					eleType : "div",
					"data-role" : "fieldcontain",
					"id" : configData.itemId,
					"class" : this.config.xtype == "cbx-staticdatefield" ? "ui-field-contain ui-body cbx-date cbx-date-view"
							: "ui-field-contain ui-body cbx-date",
					"style" : {/*
						"display" : (typeof configData.visibleInd !== 'undefined' && (configData.visibleInd
								.trim().toUpperCase() === 'N' || configData.hidden == true)) ? "none"
								: "block"
					*/}
				};
				
				if(this.compositeField){
					formConfig.style["width"]=this.anchor;
				}
				if(typeof configData.visibleInd !== 'undefined' && (configData.visibleInd
						.trim().toUpperCase() === 'N' || configData.hidden == true)){
					if(this.config.xtype == "cbx-staticdatefield"){
						formConfig["class"]="ui-field-contain ui-body cbx-date cbx-date-view jqm-display-hide";
					}else{
						formConfig["class"]="ui-field-contain ui-body cbx-date jqm-display-hide";
					}
					
					
				}
				this.formCmponentObject = new cbx.lib.layer(formConfig);

				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(configData);

				this.formCmponentObject.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g,'');
				var displayLabelName = "";
				if (this.config.plainLbl != null
						&& $.trim(this.config.plainLbl) !== "") {
					displayLabelName = this.config.plainLbl;
				} else {
					displayLabelName = this
							.getDisplayNameKey(this.config);
				}

				var inputConf = {
					'eleType' : 'input',
					"class" : this.config.xtype == "cbx-staticdatefield" ? "cbx-date-view"
							: "cbx-date",
					"id" : configData.itemId + "_field",
					"type" : "text",
					"cbx-type":"formField_"+configData.itemType,
					'name' : configData.itemId,
					"data-rel" : "",
					"displayMode":configData.xtype == "cbx-staticdatefield" ?"view":"edit",
					"fieldName":displayLabelName,
					'readonly' : 'readonly',					 
					"style" : {
						"border" : (configData.editableInd.trim()
								.toUpperCase() === "N") ? "none" : "block"
					}
				};

				if (typeof this.config.editableInd !== 'undefined'
						&& this.config.editableInd.trim().toUpperCase() === "N") {
					if (typeof fieldConfig != 'undefined')
						fieldConfig.readonly = "true";
				}

				inputObj = new cbx.lib.layer(inputConf);
				this.input = inputObj.getLayer();

				this.formCmponentObject.addLayer(this.input);
				this.addItem(this.formCmponentObject.getLayer());
				this.setFormField($(this.input));
				
				if(this.config.xtype=='cbx-datefield' && this.config.disabled==true){
					this.disable();
				}
				this.registerDefaultValidation(this); 

			},
			getValidationField : function(){
				return this.getFormField().parent();
			},
			initDateField : function(config) {
				this.createDateField();
				var that = this;
				var dateValue = this.config.fm.getModelData()[this.config.itemId];
				this.calendar = new canvas.lib.calendar({
					inputObj : this.config.xtype=="cbx-datefield"?that.input:null,
					showOn : 'focus',
					dateFormat : that.getParsedDateFormat(),
					validateDate:function(msg) {
						that.validateDate(msg);
					},
					select : function(date) {
						
						that.formManager.model.updateValue(that.config.itemId, date);
						that.setValue(date,true);
						
					}
				});
			
				var minValueDate = that.config.minValueDate || that.config.minValue;
				var maxValueDate = that.config.maxValueDate || that.config.maxValue;
				if (!cbx.isEmpty(minValueDate)) {
					that.setMinValue(minValueDate);
				}
				if (!cbx.isEmpty(maxValueDate)) {
					that.setMaxValue(maxValueDate);
				}
				
				if (!cbx.isEmpty(dateValue)) {
					that.setValue(dateValue);
				}
				

			},
			validateDate:function(msg){
				this.formManager.markInvalid(this.config.itemId,this.config.itemId+" "+msg);	
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
			getValue : function() {
				return this.getFormField().val();
			},
			
			setValue : function(value,eventRequired) {
				eventRequired = eventRequired || false;
				var that=this;
				setTimeout(function() {
					that.getFormField().datepicker('setDate',
							that.convertStringToDateObject(value));
					that.getFormField().datepicker("refresh");
					if(eventRequired){
						that.formManager.handlerEvent('cbxafterselect', that.config.itemId, value);
					}
					that.formManager.clearInvalid(that.config.itemId);
				}, 100);
			
			},
			setMinValue : function(value) {
				if(this.config.xtype == "cbx-datefield"){
				this.getFormField().datepicker("option",
						"minDate", this.convertStringToDateObject(value));
				this.getFormField().datepicker("refresh");
				}
			},
			setMaxValue : function(value) {
				if(this.config.xtype == "cbx-datefield"){
				this.getFormField().datepicker("option",
						"maxDate", this.convertStringToDateObject(value));
				this.getFormField().datepicker("refresh");
				}
			},
			getComponentDOM : function() {
				return this.formCmponentObject.getLayer();
			},
			getParsedDateFormat : function() {
				if (!cbx.isEmpty(this.preferredDateFormats[iportal.preferences
						.getDateFormat()])) {
					return this.preferredDateFormats[iportal.preferences
							.getDateFormat()];
				}
				return this.preferredDateFormats['Y-m-d'];
			},
			dateValidateType : function() {
			
				if (this.value == 's') {
					this.value = '';
				}
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
	constructor : function(config) {
		cbx.lib.formElement.cbxEmptyCell.$super.call(this);
		this.emptyCellConfigData = config;
		this.xtype=config.xtype || "";
		this.compositeField=config.compositeField?config.compositeField:false;
		this.createEmptyCell();
		this.setEleType("N",config);;
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


cbx.lib.formElement.cbxHiddenField = Class(cbx.core.Component, {
	config : null,
	isFormField : true,
	enableKeyEvents : true,
	formManager : null,
	constructor : function(config) {
		cbx.lib.formElement.cbxHiddenField.$super.call(this);
		this.formManager = config.fm;
		this.config = config;
		this.compositeField=config.compositeField?config.compositeField:false;
		this.xtype=config.xtype || "";
		this.createHiddenField();
		this.addItem(this.formCmponentObject.getLayer());
		this.setEleType("N",config);;
	},
	createHiddenField : function() {
		this.inputFieldObject = null;
		this.formCmponentObject = null;
		configData = this.config;
		formConfig = {
			"eleType" : "div",
			"id" : configData.itemId
		};
		var that=this;
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
		}else{
			this.setValue(fieldValue);
		}
		$(this.inputFieldObject.getLayer()).bind('change', this,
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
	getValidationField : function(){
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
			constructor : function(config) {
				cbx.lib.formElement.cbxHtmlEditor.$super.call(this);
				this.formManager = config.fm;
				this.xtype=config.xtype || "";
				htmlEditorConfigObject = '';
				this.buttonConfigData = config;
				this.compositeField=config.compositeField?config.compositeField:false;
				this.createHtmlEditor(config);
				this.addItem(this.mainDivConfigObject.getLayer());
				this.setEleType("N",config);;
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
			getValidationField : function(){
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



cbx.lib.formElement.cbxHyperlink = Class(cbx.core.Component, {
	hyperlinkConfigData : '',
	hyperlinkObject : null,
	isFormField : true,
	disabled : false,
	formManager : null,
	constructor : function(config) {
		cbx.lib.formElement.cbxHyperlink.$super.call(this);
		this.formManager = config.fm;
		this.anchor=config.anchor;
		this.xtype=config.xtype || "";
		this.hyperlinkConfigData = config;
		this.bundleKey=config.bundleKey || "";
		this.compositeField=config.compositeField?config.compositeField:false;
		this.readOnly=config.readOnlyInd;
		this.createHyperlink();
		this.addItem(this.hyperlinkObject.getLayer());
		this.setEleType("N",config);;
	},
	createHyperlink : function() {		
		var displayLabelName = this.getDisplayNameKey(this.hyperlinkConfigData);			

		var container = {
			'eleType' : 'div',
			'data-role' : 'fieldcontain',
			"style" : {
				
			}
		};
		
		if(this.compositeField){
			container.style["width"]=this.anchor;
		}
		if(typeof this.hyperlinkConfigData.visibleInd !== 'undefined' && (this.hyperlinkConfigData.visibleInd
						.trim().toUpperCase() === 'N' || this.hyperlinkConfigData.hidden == true)){
			container["class"]="ui-field-contain ui-body jqm-display-hide";
			
		}
		this.container = new cbx.lib.layer(container);
		this.cls="cbx-hyperlink";
		if (this.hyperlinkConfigData.disabled==true) {
			this.cls=this.cls+' ui-disabled';
		}
		hyperlinkConfig = {
			"eleType" : "a",
			"html" : displayLabelName,
			"href" : '#',
			"id" : this.hyperlinkConfigData.itemId,
			"class" :this.cls ,
			"style" : {
				"display" : (typeof this.hyperlinkConfigData.visibleInd !== 'undefined' && (this.hyperlinkConfigData.visibleInd
						.trim().toUpperCase() === 'N' || this.hyperlinkConfigData.hidden==true)) ? "none"
						: "block"
			}
		};
		if (this.hyperlinkConfigData.disabled==true || this.readOnly == 'Y') {
			hyperlinkConfig.disabled=true;
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
	getValidationField : function(){
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
			ctlCls : 'cbx-label',
			conditionalOPCls : 'cbx-conditional-ind',
			formManager : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxLabel.$super.call(this);
				this.labelConfigData = config;
				this.xtype=config.xtype || "";	
				this.anchor=config.anchor;
				this.fieldComposite=config.compositeField || false;
				this.createLabel();				
				this.compositeField=config.compositeField?config.compositeField:false;
				this.addItem(this.labelConfObject.getLayer());
			},
			createLabel : function() {
				
				var displayLabelName = "";
				
				if (this.labelConfigData.plainLbl != null
						&& $.trim(this.labelConfigData.plainLbl) !== "") {
					displayLabelName = this.labelConfigData.plainLbl;
				} else {
					displayLabelName = this
							.getDisplayNameKey(this.labelConfigData);
				}
				if(this.xtype!="cbx-label" && (this.labelConfigData.hideLabelInd=="Y" || this.labelConfigData.hideLabel)){
					displayLabelName=" ";					
				}
				/**
				 * Checking for static field before applying
				 */
				if(this.labelConfigData.eleType!=="S"){
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
					}
					else if (typeof this.labelConfigData.requiredInd !== 'undefined'
						&& this.labelConfigData.requiredInd.trim()
						.toUpperCase() === "Y") {	
						displayLabelName = displayLabelName
						+ (typeof this.labelConfigData.requiredInd !== 'undefined'
							&& this.labelConfigData.requiredInd.trim()
							.toUpperCase() === "Y" ? '<span class="'
									+ this.conditionalOPCls + '">*</span>'
									: '');
					}
					else{
						
						if (cbx.isEmpty(displayLabelName)) {
							displayLabelName = '';
						} else {
							displayLabelName = displayLabelName
							+ '<span class = \'non_mandatory\'"></span>';
						}
					}
				}
				var labelConfig='';
				if(this.fieldComposite){
					labelConfig = {
							'eleType' : 'span',
							'style':{
								'visibility':'hidden'
							}
						};
				}else{
					labelConfig = {
							'eleType' : 'label',
							'html' : displayLabelName,
							'for' : this.labelConfigData.itemId + "_field",
							'class' : this.ctlCls + " ui-input-text",
							'style':{
								
							}
						};	
				}
				 
				
				if(this.compositeField){
					labelConfig.style["width"]=this.anchor;
				}
				/**
				 * Commented this out as labelConfig is component config and not actually label config
				 * To hide the label only hidelabel Ind must be used...
				 */
				
				if(typeof this.labelConfigData.visibleInd !== 'undefined' && (this.labelConfigData.visibleInd
								.trim().toUpperCase() === 'N' || this.labelConfigData.hidden == true)){
					labelConfig["class"]=" jqm-display-hide";
					
				}
				
				this.labelConfObject = new cbx.lib.layer(labelConfig);

			},
			getComponentDOM : function() {
				return this.labelConfObject.getLayer();
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-label'
}, cbx.lib.formElement.cbxLabel);


cbx.lib.formElement.cbxLine = Class(cbx.core.Component, {
	isFormField : true,
	constructor : function(config) {
		cbx.lib.formElement.cbxLine.$super.call(this);
		this.lineConfigData = config;
		this.compositeField=config.compositeField?config.compositeField:false;
		this.createLine();
		this.addItem(this.lineConfObject.getLayer());
		this.setEleType("N",config);;
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
 * 
 *  Need to validate, is it working as expected in terms of events and
 * callbacks 
 *
 */
cbx.lib.formElement.cbxRadioGroup = Class(cbx.core.Component,
		{
			isFormField : true,
			constructor : function(config) {
				cbx.lib.formElement.cbxRadioGroup.$super.call(this);
				this.conf = config;
				this.compositeField=config.compositeField?config.compositeField:false;
				this.frmManager = config.fm;
				this.anchor=config.anchor;
				this.itemId=config.itemId;
				this.xtype=config.xtype || "";
				this.model = this.conf.model;
				this.modelData = this.model.getModelData();
				this.setEleType("N",config);;

				// Attr's
				this.plainLabel = this.conf.plainLbl;
				this.displayName = this.conf.displayNmKey;
				this.isVisible = this.conf.visibleInd === 'Y' ? false : true;
				this.isRequired = this.conf.requiredInd;
				this.isReadOnly = this.conf.readOnlyInd === 'Y' ? true : false;
				this.fieldset = '';
				this.rawKeys = config.rawKeys;
				this.rawValues = config.rawValues;
				this.bundleKey=config.bundleKey;
				this.createGroup();
				this.addItem(this.fieldset.getLayer());
				var that=this;
				$('body').delegate('input:radio[name="'+this.conf.itemId+'"]', 'change',function(e){
					e.stopPropagation();
					that.model.updateValue(that.conf.itemId,$(this).val());
				});
			
				
				
			},
			createGroup : function() {
				formConfig  = {
						'eleType' : 'div',
						'data-role' : 'controlgroup',
					'id' : this.conf.itemId,
					'class':'jqm-form-field-c jqm-cbxRadioGroup',
						'style' : {/*
							'display' : (this.isVisible || this.conf.hidden==true) ? 'none' : 'block'
						*/}
					};
					
					if(this.compositeField){
						formConfig.style["width"]=this.anchor;
					}
					if(typeof this.conf.visibleInd !== 'undefined' && (this.conf.visibleInd
									.trim().toUpperCase() === 'N' || this.conf.hidden == true)){
						formConfig["class"]="checkBoxCls jqm-display-hide";
						
					}
					this.fieldset = new cbx.lib.layer(formConfig);
			
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.conf);
				this.fieldset.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g,'');
				
				var str = '';			
				var md=this.conf;
				var readOnlyInd="";
				var rawValues=this.rawValues;
				var rawKeys=this.rawKeys;
				if (md.readOnlyInd === 'Y' || md.readOnly || md.disabled) {
					readOnlyInd = 'disabled="disabled"';
				}
				if (rawKeys.length == rawValues.length) {
					
				var rb=CRB.getBundle(cbx.jsutil.getBundleKey(this));
				for ( var i = 0; i < rawKeys.length; i++) {
					
					if(this.conf.value==rawValues[i]){
						
						this.model.updateValue(this.conf.itemId,this.conf.value);
						str += '<input class="" type="radio"  checked=true '+readOnlyInd+' cbx-type="formField_' + md.itemType + '" name=' + md.itemId + ' id='
									+ md.itemId + '_' + rawValues[i] + ' value=' + rawValues[i] + ' />' + '<label for='
									+ md.itemId + '_' + rawValues[i] + '>' + (rb && rb['LBL_' + rawKeys[i]]?rb['LBL_' + rawKeys[i]]:rawKeys[i]) + '</label>';
					}
					else if(this.modelData[this.conf.itemId] && this.modelData[this.conf.itemId]==rawValues[i]){
						
						
						str += '<input class="" type="radio"  checked=true '+readOnlyInd+' cbx-type="formField_' + md.itemType + '" name=' + md.itemId + ' id='
									+ md.itemId + '_' + rawValues[i] + ' value=' + rawValues[i] + ' />' + '<label for='
									+ md.itemId + '_' + rawValues[i] + '>' + (rb && rb['LBL_' + rawKeys[i]]?rb['LBL_' + rawKeys[i]]:rawKeys[i]) + '</label>';
					}
					else{
						str += '<input class="" type="radio"  ' +readOnlyInd+' cbx-type="formField_' + md.itemType + '" name=' + md.itemId + ' id='
						+ md.itemId + '_' + rawValues[i] + ' value=' + rawValues[i] + ' />' + '<label for='
						+ md.itemId + '_' + rawValues[i] + '>' + (rb && rb['LBL_' + rawKeys[i]]?rb['LBL_' + rawKeys[i]]:rawKeys[i]) + '</label>';
			
					}
					
				}
				
				}else{
					 str = {
							'eleType': 'span',
							'class': this.ctlCls
						};
				}
				
				$(this.fieldset.getLayer()).append(str);
				this.setFormField($(str));
				
				
			
			},
			
			setValue : function(value) {	
				var val=this.getItemValue(value);
				var that=this;
				if(!cbx.isEmpty(val)){
					$('input:radio[name="'+that.conf.itemId+'"][value="'+val+'"]').prop('checked',true);
					$('input:radio[name="'+that.conf.itemId+'"]').checkboxradio("refresh");	
				}else{
					$('input:radio[name="'+that.conf.itemId+'"]').prop('checked',false);
					$('input:radio[name="'+that.conf.itemId+'"]').checkboxradio("refresh");	
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
			getValidationField : function(){
				return $($(this.getComponentDOM()).find('label').get(1));
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-radiogroup'
}, cbx.lib.formElement.cbxRadioGroup);



cbx.lib.formElement.cbxSpinnerField = Class(cbx.core.Component, {
	isFormField : true,
	spinnerFieldData : '',
	spinnerTextField : null,
	constructor : function(config) {
		cbx.lib.formElement.cbxSpinnerField.$super.call(this);
		this.spinnerFieldData = config;
		this.compositeField=config.compositeField?config.compositeField:false;
		this.xtype=config.xtype;
		this.anchor=config.anchor;
		this.bundleKey=config.bundleKey || "";
		this.formManager = config.fm;
		if(cbx.isEmpty(config.minValue)){
		this.spinnerFieldData.minValue="0";
		}
		this.isReadOnly = config.readOnlyInd === 'Y' ? true : false;
		this.createSpinnerField();
		this.addItem(this.spinnerObject.getLayer());
		this.setEleType("N",config);;
	},
	createSpinnerField : function() {
		var displayLabelName;
		spinnerConfig = {
			eleType : "div",
			"class":"spinnerCls",
			"id" : this.spinnerFieldData.itemId,
			"style" : {/*
				"display" : (typeof this.spinnerFieldData.visibleInd !== 'undefined' && (this.spinnerFieldData.visibleInd
						.trim().toUpperCase() === 'N' || this.spinnerFieldData.hidden == true)) ? "none"
						: "block"
			*/}
		};
		
		if(this.compositeField){
			spinnerConfig.style["width"]=this.anchor;
		}
		if(typeof this.spinnerFieldData.visibleInd !== 'undefined' && (this.spinnerFieldData.visibleInd
				.trim().toUpperCase() === 'N' || this.spinnerFieldData.hidden == true)){
			spinnerConfig["class"]="jqm-display-hide";
			
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
		this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g,'');
		var spinnerTextConfig = {
			"eleType" : "input",
			"type" : "text",
			"class" : "cbx-spinnertext",
			"name":this.spinnerFieldData.itemId,
			"cbx-type":"formField_"+this.spinnerFieldData.itemType,
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
		
		if(this.spinnerFieldData.disabled==true){
			downButtonConfig.disabled=true;
			upButtonConfig.disabled=true;
			spinnerTextConfig.disabled=true;
		}
		this.downButtonObject = new cbx.lib.layer(downButtonConfig);
		this.upButtonObject = new cbx.lib.layer(upButtonConfig);
		if (this.spinnerFieldData.readOnlyInd.trim().toUpperCase() === "Y") {
			spinnerTextConfig.readonly = "true";
		}
		this.spinnerTextField = new cbx.lib.layer(spinnerTextConfig);
		textFieldObject.addLayer(this.spinnerTextField.getLayer());
		if(!this.isReadOnly){
		this.spinnerObject.addLayer(this.upButtonObject.getLayer());
		}
		this.spinnerObject.addLayer(textFieldObject.getLayer());
		if(!this.isReadOnly){
		this.spinnerObject.addLayer(this.downButtonObject.getLayer());
		}
		
		var that = this;
		
		this.upButtonObject.getLayer().onclick = function() {
			var bool=true;
			that.formManager.clearInvalid(that.spinnerFieldData.itemId);
			var value = that.spinnerTextField.getLayer().value;
			if(cbx.isEmpty(value) && !cbx.isEmpty(that.spinnerFieldData.minValue)){
				value=that.spinnerFieldData.minValue;
			}
			if(!cbx.isEmpty(value) && (!cbx.isEmpty(that.spinnerFieldData.minValue)) && ((value) < (Number(that.spinnerFieldData.minValue)))){
				value= Number(that.spinnerFieldData.minValue)-1;
			}
			if(!cbx.isEmpty(value) && (!cbx.isEmpty(that.spinnerFieldData.maxValue)) && ((value) > (Number(that.spinnerFieldData.maxValue)))){
				value= Number(that.spinnerFieldData.maxValue)-1;
			}
			value = isNaN(value) ? 1 : Number(value);
			
			if(!cbx.isEmpty(that.spinnerFieldData.minValue) && ((value+1) < (Number(that.spinnerFieldData.minValue)))){
				bool=false;
			}
			if(!cbx.isEmpty(that.spinnerFieldData.maxValue) && ((value+1)  > (Number(that.spinnerFieldData.maxValue)))){
				bool=false;	
			}
			if (bool){
				 if(that.formManager.model.getValue(that.spinnerFieldData.itemId)>=that.spinnerTextField.getLayer().value){
					that.spinnerTextField.getLayer().value = ++value;
					that.formManager.model.updateValue(that.spinnerFieldData.itemId, that
							.getFormField().val()); 
					 ++value;
				 }			
				 else if(that.getFormField().val()=="" || that.getFormField().val()>=0){
						that.spinnerTextField.getLayer().value = value;
						that.formManager.model.updateValue(that.spinnerFieldData.itemId,  that
									.getFormField().val());
						 ++value;
					}
			}
		}, this.downButtonObject.getLayer().onclick = function() {
			var bool=true;
			that.formManager.clearInvalid(that.spinnerFieldData.itemId);
			var value = that.spinnerTextField.getLayer().value;
			if(cbx.isEmpty(value) && !cbx.isEmpty(that.spinnerFieldData.minValue)){
				value=that.spinnerFieldData.minValue;
			}
			if(!cbx.isEmpty(value) && (!cbx.isEmpty(that.spinnerFieldData.minValue)) && ((value) < (Number(that.spinnerFieldData.minValue)))){
				value= Number(that.spinnerFieldData.minValue)-1;
			}
			if(!cbx.isEmpty(value) &&  (!cbx.isEmpty(that.spinnerFieldData.maxValue)) && ((value) > (Number(that.spinnerFieldData.maxValue)))){
				value= Number(that.spinnerFieldData.maxValue)+2;
				
			}
			value = isNaN(value) ? 1 : Number(value);
				if(!cbx.isEmpty(that.spinnerFieldData.minValue) && ((value-1) < (Number(that.spinnerFieldData.minValue)))){
					bool=false;
				}
				if(!cbx.isEmpty(that.spinnerFieldData.maxValue) && ((value-1)  > (Number(that.spinnerFieldData.maxValue)))){
					bool=false;	
				}
				
				if (bool) {
					that.spinnerTextField.getLayer().value = --value;
					that.formManager.model.updateValue(that.spinnerFieldData.itemId, that
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
	enable:function(){
		$(this.downButtonObject.getLayer()).prop("disabled",false);
		$(this.upButtonObject.getLayer()).prop("disabled",false);
	},
	disable:function(){
		$(this.downButtonObject.getLayer()).prop("disabled",true);
		$(this.upButtonObject.getLayer()).prop("disabled",true);	
	},	
	getValue : function() {
		return this.getFormField().val();
	},
	setValue : function(value) {
		if(!isNaN(value)){
		if(!cbx.isEmpty(this.spinnerFieldData.minValue) && value < Number(this.spinnerFieldData.minValue)){
			this.formManager.markInvalid(this.spinnerFieldData.itemId,this.spinnerFieldData.itemId+ " value should be greater than "+this.spinnerFieldData.minValue);	
		}
		else if(!cbx.isEmpty(this.spinnerFieldData.maxValue) && value > Number(this.spinnerFieldData.maxValue)){
			this.formManager.markInvalid(this.spinnerFieldData.itemId,this.spinnerFieldData.itemId+ " value should be greater than "+this.spinnerFieldData.maxValue);	
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
	getValidationField : function(){
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
			ctlCls : 'cbx-staticcheckboxgroup',
			rawKeys : null,
			rawValues : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticCheckBoxGroup.$super.call(this);
				this.setEleType("S",config);;
				this.cbxStaticCheckBoxGroupConfig = config;
				this.anchor=config.anchor;
				this.compositeField=config.compositeField?config.compositeField:false;
				this.formManager = config.fm;
				this.bundleKey=config.bundleKey;
				this.xtype=config.xtype || "";
				this.rawKeys = config.rawKeys;
				this.rawValues = config.rawValues;	
				this.createStaticCheckBoxGroup();
				this.valuesArray =[];
				this.addItem(this.checkBoxGroupContainer.getLayer());
			},
			// Instantiates checkbox group class
			createStaticCheckBoxGroup : function(config) {
				var checkBoxConfig;
				checkBoxConfig = {
					"eleType" : "fieldset",
					"class":"staticChecbox",
					"data-role" : "controlgroup",
					"id" : this.cbxStaticCheckBoxGroupConfig.itemId,
					"style" : {/*
						"display" : (typeof this.cbxStaticCheckBoxGroupConfig.visibleInd !== 'undefined' && (this.cbxStaticCheckBoxGroupConfig.visibleInd
								.trim().toUpperCase() === 'N' || this.cbxStaticCheckBoxGroupConfig.hidden==true)) ? "none" : "block"
					*/}
				};
				if(this.compositeField){
					checkBoxConfig.style["width"]=this.anchor;
				}
				if(typeof this.cbxStaticCheckBoxGroupConfig.visibleInd !== 'undefined' && (this.cbxStaticCheckBoxGroupConfig.visibleInd
						.trim().toUpperCase() === 'N' || this.cbxStaticCheckBoxGroupConfig.hidden==true)){
					checkBoxConfig["class"]="ui-field-contain ui-body jqm-display-hide";
					
				}
				this.checkBoxGroupContainer = new cbx.lib.layer(checkBoxConfig);
				var checkBoxLabel = new cbx.lib.formElement.cbxLabel(
						this.cbxStaticCheckBoxGroupConfig).getComponentDOM();
				this.checkBoxGroupContainer.addLayer(checkBoxLabel);
		
							
				var dataEleConfig = {
					'eleType' : 'span',
					'class' : this.ctlCls,
					"name" : this.cbxStaticCheckBoxGroupConfig.itemId,
					"cbx-type":"formField_"+this.cbxStaticCheckBoxGroupConfig.itemType
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
			getValidationField: function(){
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
							dataArray.push(CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_' + this.rawKeys[i]] || this.rawKeys[i]);
						}
					}
				}
				return dataArray.toString();
			},
			
			setValue : function(val) {
				if(cbx.isArray(val)){
		    		this.valuesArray = val;
		    	}else{
		    		this.parseRawData(val);	
		    	}
				var value=this.getItemValue();
				if(cbx.isEmpty(value)){
					value='--';
				}else{
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
 * 
 
 */

cbx.lib.formElement.cbxStaticComboBox = Class(
		cbx.core.Component,
		{
			isFormField : true,
			comboBoxContainer : '',
			staticCBConfig : '',
			addData : null,
			formManager : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticComboBox.$super.call(this);
				this.setEleType("S",config);
				this.anchor=config.anchor;
				this.staticCBConfig = config;
				this.bundleKey=config.bundleKey || "";
				this.compositeField=config.compositeField?config.compositeField:false;
				this.xtype=config.xtype || "";
				this.addData = config.addData;
				this.formManager = config.fm;
				this.cbxStaticComboBox();
				this.addItem(this.comboBoxContainer.getLayer());
			},
			// Instantiates combobox class
			cbxStaticComboBox : function(config) {
				var cbContainerConfig = {
					"eleType" : "div",
					"class":"staticComboCls",
					"id" : this.staticCBConfig.itemId,
					"data-role" : "fieldcontain",
					"style" : {/*
						"display" : (typeof this.staticCBConfig.visibleInd !== 'undefined' && (this.staticCBConfig.visibleInd
								.trim().toUpperCase() === 'N' || this.staticCBConfig.hidden == true)) ? "none"
								: "block"
					*/}
				};
				if(this.compositeField){
					cbContainerConfig.style["width"]=this.anchor;
				}
				if(typeof this.staticCBConfig.visibleInd !== 'undefined' && (this.staticCBConfig.visibleInd
						.trim().toUpperCase() === 'N' || this.staticCBConfig.hidden == true)){
					cbContainerConfig["class"]="ui-field-contain ui-body jqm-display-hide";
					
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
					"cbx-type":"formField_"+this.staticCBConfig.itemType
				};
				var dataEleContainer = new cbx.lib.layer(dataEleConfig)
						.getLayer();
				this.dataEleContainer = dataEleContainer;
				this.comboBoxContainer.addLayer(dataEleContainer);
				this.addItem(this.comboBoxContainer.getLayer());
				this.setFormField($(dataEleContainer));
				// creating the data element
				var value = this.formManager.model.getModelData()[this.staticCBConfig.itemId];
				this.setValue(value);

			},
			setValue : function(value) {
				var val = this.getItemValue(value) || '--';
				this.getFormField().html(val);
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
			getValidationField : function(){
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
			isFormField : true,
			sRGContainerContainer : '',
			staticRGroupConfig : null,
			ctlCls : 'cbx-staticradtiogroup',
			formManager : null,
			rawKeys : null,
			rawValues : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticRadioGroup.$super.call(this);
				this.setEleType("S",config);;
				this.staticRGroupConfig = config;
				this.anchor=config.anchor;
				this.formManager = config.fm;
				this.compositeField=config.compositeField?config.compositeField:false;
				this.rawKeys = config.rawKeys;
				this.xtype=config.xtype || "";
				this.rawValues = config.rawValues;	
				this.bundleKey=config.bundleKey;
				this.staticRGroupConfig.disabled = true;
				this.createStaticRadioGroup();
				this.addItem(this.sRGContainerContainer.getLayer());
			},
			// Instantiates radiogroup class
			createStaticRadioGroup : function(config) {
				var sRGContainerConfig = {
					'eleType' : 'div',
					"data-role" : "fieldcontain",
					"class":"staticRadioCls",
					"id" : this.staticRGroupConfig.itemId,
					"style" : {/*
						"display" : (typeof this.staticRGroupConfig.visibleInd !== 'undefined' && (this.staticRGroupConfig.visibleInd
								.trim().toUpperCase() === 'N' || this.staticRGroupConfig.hidden==true)) ? "none" : "block"
					*/}
				};
				if(this.compositeField){
					sRGContainerConfig.style["width"]=this.anchor;
				}
				if(typeof this.staticRGroupConfig.visibleInd !== 'undefined' && (this.staticRGroupConfig.visibleInd
						.trim().toUpperCase() === 'N' || this.staticRGroupConfig.hidden==true)){
					sRGContainerConfig["class"]="ui-field-contain ui-body jqm-display-hide";
					
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
					"cbx-type":"formField_"+this.staticRGroupConfig.itemType
				};
				var dataEleContainer = new cbx.lib.layer(dataEleConfig)
						.getLayer();
				this.setFormField($(dataEleContainer));
				this.sRGContainerContainer.addLayer(dataEleContainer);
				var value = this.formManager.model.getModelData()[this.staticRGroupConfig.itemId];
				this.setValue(value);
			},
			
			setValue : function(value) {
				var value=this.getItemValue(value);
				if(cbx.isEmpty(value)){
					this.getFormField().html('--');
				}
				this.getFormField().html(value);
			},
			getItemValue : function(value) {
				var out = "";
				if (this.rawKeys !== null && this.rawValues !== null) {
					for ( var i = 0; i < this.rawKeys.length; i++) {
						if (this.rawValues[i] === value) {
							out = CRB.getBundle(cbx.jsutil.getBundleKey(this))['LBL_' + this.rawKeys[i]] || this.rawKeys[i];
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
			getValidationField : function(){
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
			isFormField : true,
			textAreaContainer : null,
			staticTextAreaConfig : null,
			NO_ROWS : 5,
			formManager : null,
			value : '',
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticTextArea.$super.call(this);
				this.setEleType("S",config);;
				this.formManager = config.fm;
				this.anchor=config.anchor;
				this.bundleKey=config.bundleKey || "";
				this.staticTextAreaConfig = config;
				this.compositeField=config.compositeField?config.compositeField:false;
				this.xtype=config.xtype || "";
				this.createStaticTextArea();
				this.addItem(this.textAreaContainer.getLayer());
			},
			createStaticTextArea : function() {
				var staContainerConfig = {
					"eleType" : "div",
					"data-role" : "fieldcontain",
					"class":"cbx-statictextarea-view",
					"id" : this.staticTextAreaConfig.itemId,
					"style" : {/*
						"display" : (typeof this.staticTextAreaConfig.visibleInd !== 'undefined' && (this.staticTextAreaConfig.visibleInd
								.trim().toUpperCase() === 'N' || this.staticTextAreaConfig.hidden==true)) ? "none" : ""
					*/}
				};
				if(this.compositeField){
					staContainerConfig.style["width"]=this.anchor;
				}
				if(typeof this.staticTextAreaConfig.visibleInd !== 'undefined' && (this.staticTextAreaConfig.visibleInd
						.trim().toUpperCase() === 'N' || this.staticTextAreaConfig.hidden==true)){
					staContainerConfig["class"]="ui-field-contain ui-body cbx-statictextarea-view jqm-display-hide";
					
				}
				this.textAreaContainer = new cbx.lib.layer(staContainerConfig);
				// creating the label by instantiating the cbxLabel class
				var staLabelComponent = new cbx.lib.formElement.cbxLabel(
						this.staticTextAreaConfig).getComponentDOM();
				this.textAreaContainer.addLayer(staLabelComponent);
			
				// creatig the static text area
				var staConfig = {
					"eleType" : "textarea",
					"cols" : this.staticTextAreaConfig.maxCharsPerLine || 40,
					"rows" : this.NO_ROWS || 8,
					"class" : "cbx-statictextarea",
					"name" : this.staticTextAreaConfig.itemId,
					"cbx-type":"formField_"+this.staticTextAreaConfig.itemType,
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
				return this.getFormField().val();
			},
			setValue : function(value) {
				this.getFormField().val(value);
			},
			// Returns the DOM object of textarea
			getComponentDOM : function() {
				return this.textAreaContainer.getLayer();
			},
			getValidationField : function(){
				return $("");
			}
		});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-statictextarea'
}, cbx.lib.formElement.cbxStaticTextArea);


cbx.lib.formElement.cbxTextArea = Class(
		cbx.core.Component,
		{
			isFormField : true,
			textAreaContainerObject : null,
			NO_ROWS : 5,
			maxLength : 0,
			textAreaObject : null,
			formManager : null,
			constructor : function(confg) {
				cbx.apply(this,confg);
				cbx.lib.formElement.cbxTextArea.$super.call(this);
				this.config = confg;
				this.anchor=confg.anchor;
				this.formManager = confg.fm;
				this.bundleKey=confg.bundleKey || "";
				this.compositeField=confg.compositeField?confg.compositeField:false;
				this.createTextArea(confg);
				this.xtype=confg.xtype || "";
				this.addItem(this.textAreaContainerObject.getLayer());
				if(this.config.disabled==true){
					this.disable();
				}
				this.setEleType("N",confg);;
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
						"display" : (typeof this.config.visibleInd !== 'undefined' && (this.config.visibleInd
								.trim().toUpperCase() === 'N' || this.config.hidden==true)) ? "none" : ""
					*/}
				};
				if(this.compositeField){
					textAreaContainerConfig.style["width"]=this.anchor;
				}
				if(typeof this.config.visibleInd !== 'undefined' && (this.config.visibleInd
						.trim().toUpperCase() === 'N' || this.config.hidden==true)){
					textAreaContainerConfig["class"]="ui-field-contain ui-body jqm-display-hide";
				}
				if (this.config.plainLbl != null
						&& $.trim(this.config.plainLbl) !== "") {
					this.fieldLabel  = this.config.plainLbl;
				} else {
					this.fieldLabel  = this
							.getDisplayNameKey(this.config);
				}
				if(!cbx.isEmpty(this.config.validationType)){

					var registeredVtypes=canvas.form.vTypeRegistry.getVtypes();

					for(var i=0;i<registeredVtypes.length;i++){

						if(this.config.validationType==registeredVtypes[i].name){

							this.config.vtype=this.validationType;

							this.config.maskRe=registeredVtypes[i].mask;

							this.config.invalidText=registeredVtypes[i].text;

							break;

						}else if(this.validationType=='alphaNumeric' || this.validationType=='numeric' || this.validationType=='portalSupported'){

						}else{				

						}

					}
				}
				this.textAreaContainerObject = new cbx.lib.layer(
						textAreaContainerConfig);
			
				
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.config);
				this.textAreaContainerObject.addLayer(cbxLabelObj
						.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g,'');
				if(cbx.isEmpty(this.config.maxLength)){
				
				this.config.maxCharsPerLine = cbx.isEmpty(this.config.maxCharsPerLine) ? 40
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
					"id" : this.config.itemId+"_field",
					"name" : this.config.itemId,
					"class" : "cbx-textarea",
					"grow":"true",
					"wrap":"virtual",
					"cbx-type":"formField_"+this.config.itemType
					
				};

				
				if(!cbx.isEmpty(this.maxLength) && (parseInt(this.maxLength)>0)){
					textAreaConfig.maxlength=this.maxLength;	
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
				this.textAreaObject.getLayer().onkeypress = function(
						evt) {
					if (that.config.vType.trim().toUpperCase() === "ALPHANUMERIC") {
						var exp = String.fromCharCode(evt.charCode);
						var r = new RegExp("[A-Za-z0-9]", "g");
						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else if (that.config.vType.trim().toUpperCase() === "NUMERIC") {
						var exp = String.fromCharCode(evt.charCode);
						var r='';
						if(that.config.allowSpaces){
							r = new RegExp("[0-9 ]", "g");
						}else{
							r = new RegExp("[0-9]", "g");
						}
						
						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else if (that.config.vType.trim().toUpperCase() === "PORTALSUPPORTED") {
						var exp = String.fromCharCode(evt.charCode);
						if(that.config.allowSpaces){
							r = new RegExp("^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$", "g");
							//r = new RegExp("[^<>;{}()!=&\'\"]", "g");
						}else{
							r = new RegExp("[0-9]", "g");
						}
						
						if (exp.match(r) == null) {
							evt.charCode = 0;
							return false;
						}
					} else{
						if(!cbx.isEmpty(that.config.vtype) && !cbx.isEmpty(that.config.maskRe)){
							var exp = String.fromCharCode(evt.charCode);
							try{
							var r = new RegExp(that.config.maskRe, "g");							
							if (exp.match(r) == null) {
								evt.charCode = 0;
								return false;
							}
							
						}catch(err){}
						}
					}
					
					if (!cbx.isEmpty(that.config.maxLength) && !cbx.isEmpty(that.config.maxNumLines)) {
						var keycode =  evt.keyCode ? evt.keyCode : evt.which;
						if(keycode!==8 && keycode!==46){
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
				};
			
				this.setFormField($(this.textAreaObject.getLayer()));
				var textAreaValue = this.formManager.model.getModelData()[this.config.itemId];
				if (!cbx.isEmpty(textAreaValue)) {
					this.setValue(textAreaValue);
				}
				
				//var that = this;
				this.registerDefaultValidation(that);
			
				$(this.textAreaObject.getLayer()).bind('change', this,
						function(event) {
					that.formManager.model.updateValue(that.config.itemId, that
							.getValue());
					that.formManager.clearInvalid(that.config.itemId);
						});
				
				
			},
			getValidationField : function(){
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
			validator:function(value){
				if(!cbx.isEmpty(value)){
				 if (this.getValue().match(/\n/g) !== null
						 && Number(that.config.maxNumLines) === Number(this
						 .getValue().match(/\n/g).length)) {
					 	this.formManager.markInvalid(this.config.itemId,CRB.getFWBundle().ERR_INVALID_NUMBER_OF_LINES);
						 } else {
						 if (this.getValue() !== 'undefined'
						 && this.getValue().length >= this.maxLength) {
						 var commonbundle = CRB.getFWBundle();
						 var maxLengthErrText=String.format(
									commonbundle['ERR_MAXLENGTH_EXCEED'], this.fieldLabel,
									this.maxLength);
						this.formManager.markInvalid(this.config.itemId,maxLengthErrText);
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


cbx.lib.formElement.cbxTextField = Class(
		cbx.core.Component,
		{
			isFormField : true,
			config : null,
			enableKeyEvents : true,
			formManager : null,
			constructor : function(config) {
				cbx.apply(this,config);
				cbx.lib.formElement.cbxTextField.$super.call(this);
				this.config = config;
				this.xtype=config.xtype;
				this.itemId = config.itemId;
				this.anchor=config.anchor;
				//this.minWidth=
				this.formManager = config.fm;
				this.bundleKey=config.bundleKey || "";
				this.compositeField=config.compositeField?config.compositeField:false;
				this.createTextField();
				this.addItem(this.formCmponentObject.getLayer());
				if(this.config.disabled==true){
					this.disable();
				}
				this.setEleType("N",config);;
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
						"display" : (typeof configData.visibleInd !== 'undefined' && (configData.visibleInd
								.trim().toUpperCase() === 'N' || configData.hidden == true)) ? "none"
								: "block"
					*/}
				};
				if(this.compositeField){
					formConfig.style["width"]=this.anchor;
				}
				if(typeof configData.visibleInd !== 'undefined' && (configData.visibleInd
								.trim().toUpperCase() === 'N' || configData.hidden == true)){
					formConfig["class"]="ui-field-contain ui-body jqm-display-hide";
					
				}
				if(!cbx.isEmpty(this.config.validationType)){

					var registeredVtypes=canvas.form.vTypeRegistry.getVtypes();

					for(var i=0;i<registeredVtypes.length;i++){

						if(this.config.validationType==registeredVtypes[i].name){

							this.config.vtype=this.validationType;

							this.config.maskRe=registeredVtypes[i].mask;

							this.config.invalidText=registeredVtypes[i].text;

							break;

						}else if(this.validationType=='alphaNumeric' || this.validationType=='numeric' || this.validationType=='portalSupported'){

						}else{				

						}

					}
				}
				this.formCmponentObject = new cbx.lib.layer(formConfig);
				var cbxLabelObj = new cbx.lib.formElement.cbxLabel(configData);

				this.formCmponentObject.addLayer(cbxLabelObj.getComponentDOM());
				this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g,'');

				if (typeof configData.itemType !== 'undefined'
						&& configData.itemType.trim().toUpperCase() === "TEXT") {
					fieldConfig = this.getFieldConfig(configData.itemId);
					if(!cbx.isEmpty(configData.maxLength)){
						fieldConfig.maxlength=configData.maxLength;
					}
					this.inputFieldObject = new cbx.lib.layer(fieldConfig);
					this.formCmponentObject.addLayer(this.inputFieldObject
							.getLayer());
				}

				var that = this;
				if (configData.itemType !== ""
						&& !cbx.isEmpty(this.inputFieldObject)) {
					this.inputFieldObject.getLayer().onkeypress = function(evt) {

						if (that.config.vType.trim().toUpperCase() === "ALPHANUMERIC") {
							var exp = String.fromCharCode(evt.charCode);
							var r = new RegExp("[A-Za-z0-9]", "g");
							if (exp.match(r) == null) {
								evt.charCode = 0;
								return false;
							}
						} else if (that.config.vType.trim().toUpperCase() === "NUMERIC") {
							var exp = String.fromCharCode(evt.charCode);
							var r='';
							if(that.config.allowSpaces){
								r = new RegExp("[0-9 ]", "g");
							}else{
								r = new RegExp("[0-9]", "g");
							}
							
							if (exp.match(r) == null) {
								evt.charCode = 0;
								return false;
							}
						} else if (that.config.vType.trim().toUpperCase() === "PORTALSUPPORTED") {
							var exp = String.fromCharCode(evt.charCode);
							if(that.config.allowSpaces){
								r = new RegExp("^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$", "g");
							}else{
								r = new RegExp("[0-9]", "g");
							}
							
							if (exp.match(r) == null) {
								evt.charCode = 0;
								return false;
							}
						}
						else{
							if(!cbx.isEmpty(that.config.vtype) && !cbx.isEmpty(that.config.maskRe)){
								var exp = String.fromCharCode(evt.charCode);
								try{
								var r = new RegExp(that.config.maskRe, "g");							
								if (exp.match(r) == null) {
									evt.charCode = 0;
									return false;
								}
								
							}catch(err){}
							}
						}
						if (typeof that.config.maxLength !== 'undefined'
								&& that.config.maxLength > 0) {
							if (typeof $('#' + that.config.itemId).val() !== 'undefined'
									&& $('#' + that.config.itemId).val().length >= that.config.maxLength) {
								return false;
							}
						}
					};
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
					var fieldValue = this.formManager.model.getModelData()[this.config.itemId];
					if (!cbx.isEmpty(fieldValue)) {
						this.setValue(fieldValue);
					}
					
					
				}
			},
			getValidationField :function(){
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
				fieldConfigData = {
					"eleType" : "input",
					"name" : this.config.itemId,
					"id" : this.config.itemId + "_field",
					"class" : "cbx-textbox",
					"type" : "text",
					"cbx-type":"formField_"+this.config.itemType
				};
				if(this.config.readOnlyInd.trim().toUpperCase()=="Y" || this.config.readOnly==true){
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
				this.mode=config.mode;
				this.compositeField=config.compositeField?config.compositeField:false;
				this.strictMode=config.strictMode || false;
				this.xtype=config.xtype || "";
				this.setEleType("N",config);;
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
					if (typeof this.childItems !== 'undefined'
							&& this.childItems.length > 0) {
						for (chItem = 0; chItem < this.childItems.length; chItem++) {
							if (typeof this.childItems[chItem].xtype !== 'undefined') {
								if(that.strictMode){
									this.childItems[chItem].mode=that.mode;
								}
								var cClass = CFCR.getFormCmp({
									'COMP_TYPE' : this.childItems[chItem].xtype
								});
								if (cClass) {
									if (this.childItems[chItem].xtype == "cbx-lazzyformpanel") {
										new cClass(
												{
													'formPanel' : that
															.getItem(0),
													'formData' : this.childItems[chItem],
													'formManager' : that.formManager
												});
									} /*else if (this.childItems[chItem].xtype == "cbx-lazzypanel") {
										new cClass(
												{
													'formPanel' : that
															.getItem(0),
													'formData' : this.childItems[chItem],
													'formManager' : that.formManager
												});
									} */else {
										if (this.childItems[chItem].xtype == "cbx-combobox") {
											this.childItems[chItem]['additionalData'] = that.formData.additionalData[this.childItems[chItem].itemId];
										} else if (this.childItems[chItem].xtype == "cbx-fieldset" || this.childItems[chItem].xtype == "cbx-lazzypanel") {
											this.childItems[chItem]['additionalData'] = that.formData.additionalData[this.childItems[chItem].itemId];
										}
										this.childItems[chItem]['fm'] = that.formManager;
										var componentDOM = new cClass(
												this.childItems[chItem])
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
					mode : this.mode,
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
			isFormField : true,
			staticFieldConfig : null,
			staticField : null,
			staticFieldContainer : null,
			ctlCls : 'cbxstaticfield',
			formManager : null,
			constructor : function(config) {
				cbx.lib.formElement.cbxStaticField.$super.call(this);
				this.setEleType("S",config);
				this.anchor=config.anchor;
				this.formManager = config.fm;
				this.bundleKey=config.bundleKey || "";
				this.staticFieldConfig = config;
				this.xtype=config.xtype || "";
				var staticFieldConfig;
				this.compositeField=config.compositeField?config.compositeField:false;

				staticFieldConfig = {
					'eleType' : 'div',
					'id' : this.staticFieldConfig.itemId,
					"data-role" : "fieldcontain",
					"style" : {/*
						"display" : (typeof config.visibleInd !== 'undefined' && (config.visibleInd
								.trim().toUpperCase() === 'N' || config.hidden == true)) ? "none"
								: "block"
					*/}
				};
				if(this.compositeField){
					staticFieldConfig.style["width"]=this.anchor;
				}
				if(typeof config.visibleInd !== 'undefined' && (config.visibleInd
						.trim().toUpperCase() === 'N' || config.hidden == true)){
					staticFieldConfig["class"]="ui-field-contain ui-body jqm-display-hide";
					
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
					"cbx-type":"formField_"+this.staticFieldConfig.itemType
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
				}else{
					this.setValue('--');
				}
			},
			getComponentDOM : function() {
				return this.staticFieldContainer.getLayer();
			},
			setValue : function(value) {
				this.getFormField().html(value);
			},
			getValue : function() {
				return this.getFormField().val();
			},
			getValidationField: function(){
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
			isFormField : true,
			logoConfig : null,
			logoContainer : null,
			containerClass : 'cbx-logo-container',
			imageClass : 'cbx-logo',
			constructor : function(config) {
				cbx.lib.formElement.cbxLogo.$super.call(this);
				this.logoConfig = config;
				this.compositeField=config.compositeField?config.compositeField:false;
				this.xtype=config.xtype || "";
				if (this.logoConfig.customContainerClass !== 'undefined') {
					this.containerClass = this.logoConfig.customContainerClass;
				}
				if (this.logoConfig.customImageClass !== 'undefined') {
					this.imageClass = this.logoConfig.customImageClass;
				}
				this.setEleType("N",config);;
				var logoContainerConfig;
				logoContainerConfig = {
					'eleType' : 'div',
					'id' : this.logoConfig.itemId,
					'class' : this.containerClass
				};
				this.logoContainer = new cbx.lib.layer(logoContainerConfig)
						.getLayer();
				if (typeof this.logoConfig.itemId !== 'undefined'
						|| this.logoConfig.itemId === '') {
					if (this.logoConfig.defaultPath
							&& this.logoConfig.defaultPath != ' ') {
						if (this
								.isValidImageExtension(this.logoConfig.defaultPath) === true) {
							this.setPath(this.defaultPath);
							var imageConfig;
							imageConfig = {
								'ele' : 'img',
								'src' : this.logoConfig.defaultPath,
								'class' : this.imageClass
							};
							var imageContainer = new cbx.lib.layer(imageConfig)
									.getLayer();
							this.logoContainer.appendChild(imageContainer);
						}
					} else if (typeof this.logoConfig.defaultPath === 'undefnied'
							|| this.logoConfig.defaultPath === '') {
						this.logoContainer.style.display = "none";
					}
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
CLCR.registerCmp({
	'COMP_TYPE' : 'cbx-logo'
}, cbx.lib.formElement.cbxLogo);
/* This class is used for to create the title */


cbx.lib.formElement.cbxTitle = Class(cbx.core.Component, {
	isFormField : true,
	titleContainer : null,
	ctlCls : 'cbx-title',
	containerClass : 'cbxtitle-container',
	titleConfig : null,
	constructor : function(config) {
		cbx.lib.formElement.cbxTitle.$super.call(this);
		this.titleConfig = config;
		this.xtype=config.xtype || "";
		this.compositeField=config.compositeField?config.compositeField:false;
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
		this.setEleType("N",config);;
		this.titleContainer = new cbx.lib.layer(titleContainerConfig);
		var displayLabelName;
		if (typeof this.titleConfig.displayNmKey !== 'undefined'
				&& this.titleConfig.displayNmKey.trim() !== '') {

			/* Getting the reference of resource bundle and using */
			// var commonbundle = CRB.getFWBundle();
			/*
			 * var bundle; bundle =
			 * CRB.getBundle(cbx.jsutil.getBundleKey(this)); displayLabelName =
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
	wpanelContainer : null,
	wpConfig : null,
	fm : null,
	widgetInitialized : false,
	commManager : null,
	appMVRegistry : null,
	ctlCls : 'cbx-widgetpanel',
	id : '',
	constructor : function(config) {
		this.commManager = cbx.core.ws.metadata.getCurrentWorkspace()
				.getWidgetContainer().commManager;
		this.appMVRegistry =  cbx.core.ws.metadata.getCurrentWorkspace()
				.getWidgetContainer().appMVRegistry;
		cbx.lib.formElement.cbxWidgetPanel.$super.call(this);
		this.wpConfig = config;
		this.fm = config.fm;
		this.xtype=config.xtype || "";
		if (typeof this.wpConfig.customctlCls !== 'undefined') {
			this.ctlCls = this.wpConfig.customctlCls;
		}
		this.setEleType("N",config);;
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
	intiateWidget : function() {
		cbx.core.dynamicWidgetManager({
			containerId : this.wpConfig.itemId,
			renderTo : 'FORM',
			widgetId : this.wpConfig.widgetId,
			extraParamsHandler : this.extraParamsHandler,
			scope : this
		});
		this.widgetInitialized = true;
	},
	afterShow : function() {
		if (!this.widgetInitialized) {
			this.intiateWidget();
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
		this.intiateWidget();
	},
	/**
	 * This is the default wrapper function for handling all the
	 * extraParamHandler registered for the widget. This method will first
	 * execute any handler written for the widget iteself and after that, it
	 * will raise the FormManager's cbxbeforeload for the form developer to
	 * update the request parameters before they are sent to the server for data
	 * fetch
	 */
	
	extraParamsHandler : function(params) {
		var addParams = this.fm.handlerEvent('cbxbeforeload',
				this.wpConfig.itemId, params);
		cbx.apply(params, addParams);

		return params;
	},
	getValidationField : function(){
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
	pConfig : null,
	ctlCls : 'cbx-widgetpanel',
	constructor : function(config) {
		cbx.lib.formElement.cbxPanel.$super.call(this);
		this.pConfig = config;
		this.xtype=config.xtype || "";
		if (typeof this.pConfig.customctlCls !== 'undefined') {
			this.ctlCls = this.pConfig.customctlCls;
		}
		this.setEleType("N",config);;
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
 * config.model.getModelData()[config.itemId];  this.value =
 * config.model.getModelData()[config.itemId]; this.name = config.itemId;
 * this.currMode=config.appendCurrMode; this.required =
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
			isFormField : true,
			amtFeildConfigData : '',
			amtFieldContainer : null,
			ctlCls : 'cbx-label',
			formManager : null,
			signdigits : 2,
			constructor : function(config) {
				cbx.lib.formElement.StaticAmountField.$super.call(this);
				this.formManager = config.fm;
				this.setEleType("S",config);
				this.anchor=config.anchor;
				this.bundleKey=config.bundleKey || "";
				this.amtFeildConfigData = config;
				this.xtype=config.xtype || "";
				this.compositeField=config.compositeField?config.compositeField:false;
				this.createStaticAmountField();
			},
			// Instantiates amount field class
			createStaticAmountField : function() {
				var amtFieldContainerConfig = {
					'eleType' : 'div',
					'data-role' : 'fieldcontain',
					'id' : this.amtFeildConfigData.itemId,
					"style" : {/*
						"display" : (typeof this.amtFeildConfigData.visibleInd !== 'undefined' && (this.amtFeildConfigData.visibleInd
								.trim().toUpperCase() === 'N' || this.amtFeildConfigData.hidden==true)) ? "none" : ""
					*/}
				};


				if(this.compositeField){
					amtFieldContainerConfig.style["width"]=this.anchor;
								}
								if(typeof this.amtFeildConfigData.visibleInd !== 'undefined' && (this.amtFeildConfigData.visibleInd
										.trim().toUpperCase() === 'N' || this.amtFeildConfigData.hidden==true)){
									amtFieldContainerConfig["class"]="ui-field-contain ui-body jqm-display-hide";
									
								}
				this.amtFieldContainer = new cbx.lib.layer(amtFieldContainerConfig);
				this.plainLabel = "";
				if (this.amtFeildConfigData.plainLbl != null
						&& $.trim(this.amtFeildConfigData.plainLbl) !== "") {
					this.plainLabel  = this.amtFeildConfigData.plainLbl;
				} else {
					this.plainLabel  = this
							.getDisplayNameKey(this.amtFeildConfigData);
				}
				// var cbxLabelObj =
				var labelComponent = new cbx.lib.formElement.cbxLabel(
						this.amtFeildConfigData).getComponentDOM();
				this.amtFieldContainer.addLayer(labelComponent);
				var dataContainerConfig = {
					'eleType' : 'span',
					'class' : 'amount-container',
					'name' : this.amtFeildConfigData.itemId,
					"cbx-type":"formField_"+this.amtFeildConfigData.itemType
				};
				var dataContainer = new cbx.lib.layer(dataContainerConfig);
				/*var currencyModeConfig = {
					'eleType' : 'span',
					'class' : 'currency-class',
					'html' : this.amtFeildConfigData.linkedCurrComp
				};*/
				/*var currencyModeComponent = new cbx.lib.layer(
						currencyModeConfig).getLayer();*/
				var amount = this.formManager.model.getModelData()[this.amtFeildConfigData.itemId];
				
				/*var currencyValueConfig = {
					'eleType' : 'span',
					'type' : 'text',
					'class' : 'static-amount-data',
					'value' : amount
				};*/
				/*var currencyContainer = new cbx.lib.layer(currencyValueConfig)
						.getLayer();
				
				if (this.amtFeildConfigData.currMode === 'PRE_CODE') {
					dataContainer.addLayer(currencyModeComponent);
					dataContainer.addLayer(currencyContainer);
				} else {
					// By default adding currency type after the amount
					dataContainer.addLayer(currencyModeComponent);
					dataContainer.addLayer(currencyContainer);
				}*/
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
			 updateSignDigits: function(config){
			    	var currDecimalPlaceList = cbx.globalcurrency.metadata.getCurrDecimalPlaceList();
			    	var currcmp = this.linkedCurrComp;
			    	var curr;
			    	if (!cbx.isEmpty(currcmp)) {
			    		curr=this.formManager.model.getValue(currcmp);
			    	}
			    	if(cbx.isEmpty(curr)){
						// get the default curr from preference.
						curr = iportal.systempreferences.getDefaultBankCCY();
						if(cbx.isEmpty(curr)){
							// get the default curr configured in the
							// orbidirect properties.
							curr = cbx.globalcurrency.metadata.getDefaultCurrFromOrbionedirect();
						}
					}
			    	if(!cbx.isEmpty(curr)){
						var currList=cbx.decode(currDecimalPlaceList);
						var currBasedDecimal = currList[curr];
						this.signdigits = currBasedDecimal;
					
					}
				},
			
			setValue : function(v) {
				 this.updateSignDigits(); //  calling the api to update the
											// this.signdigits
				if(v){
					try {
						var StringNumber = cbx.amtutil.stringnumber.getInstance();
						var val=StringNumber.formatterFactory[iportal.preferences
						      								.getAmountFormat()](v.replace(/,/g, ""),
						      										this.signdigits);
						this.getFormField().html(val);
						
					} catch (e) {
						this.getFormField().html('--');
					}
				}
			
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


cbx.lib.formElement.cbxPassword = Class(cbx.core.Component, {
	isFormField : true,
	passwordCmponentObject : null,
	inputPasswordConfigObject : null,
	pwdConfigData : null,
	ctlCls : 'cbx-password',
	constructor : function(config) {
		cbx.lib.formElement.cbxPassword.$super.call(this);
		this.pwdConfigData = config;
		this.anchor=config.anchor;
		this.config=config;
		this.bundleKey=config.bundleKey || "";
		this.xtype=config.xtype || "";
		this.compositeField=config.compositeField?config.compositeField:false;
		this.formManager = config.fm;
		this.createPassword();
		this.setEleType("N",config);;
		this.addItem(this.passwordCmponentObject.getLayer());
	},
	createPassword : function() {
		var displayLabelName;
		passwordConfig = {
			"eleType" : "div",
			"data-role" : "fieldcontain",
			"id" : this.pwdConfigData.itemId
		};
		if(this.compositeField){
			passwordConfig.style["width"]=this.anchor;
		}
		if(typeof this.pwdConfigData.visibleInd !== 'undefined' && (this.pwdConfigData.visibleInd
						.trim().toUpperCase() === 'N' || this.pwdConfigData.hidden == true)){
			passwordConfig["class"]="ui-field-contain ui-body jqm-display-hide";
			
		}
		this.passwordCmponentObject = new cbx.lib.layer(passwordConfig);
		if (typeof this.pwdConfigData.customClass !== 'undefined'
				&& this.pwdConfigData.customClass !== '') {
			this.ctlCls = this.pwdConfigData.customClass;
		}
		if(!cbx.isEmpty(this.config.validationType)){

			var registeredVtypes=canvas.form.vTypeRegistry.getVtypes();

			for(var i=0;i<registeredVtypes.length;i++){

				if(this.config.validationType==registeredVtypes[i].name){

					this.config.vtype=this.validationType;

					this.config.maskRe=registeredVtypes[i].mask;

					this.config.invalidText=registeredVtypes[i].text;

					break;

				}else if(this.validationType=='alphaNumeric' || this.validationType=='numeric' || this.validationType=='portalSupported'){

				}else{				

				}

			}
		}
		var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.pwdConfigData);
		this.passwordCmponentObject.addLayer(cbxLabelObj.getComponentDOM());
		this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g,'');
		var inputPasswordConfig = {
			"eleType" : "input",
			"type" : "password",
			"id" : this.config.itemId + "_field",
			"name" : this.config.itemId,
			"class" : this.ctlCls,
			"cbx-type":"formField_"+this.config.itemType
		};
		if(this.config.readOnlyInd.trim().toUpperCase()=="Y" || this.config.readOnly==true){
			//inputPasswordConfig.readonly=='readonly';
			//inputPasswordConfig["readonly"]=="true";
			inputPasswordConfig.readonly = "true"
		}
		var inputPassWordObj = new cbx.lib.layer(inputPasswordConfig);
		this.inputPassWordObj=inputPassWordObj;
		var that = this;
		inputPassWordObj.getLayer().onkeypress = function(evt) {

			if (that.config.vType.trim().toUpperCase() === "ALPHANUMERIC") {
				var exp = String.fromCharCode(evt.charCode);
				var r = new RegExp("[A-Za-z0-9]", "g");
				if (exp.match(r) == null) {
					evt.charCode = 0;
					return false;
				}
			} else if (that.config.vType.trim().toUpperCase() === "NUMERIC") {
				var exp = String.fromCharCode(evt.charCode);
				var r='';
				if(that.config.allowSpaces){
					r = new RegExp("[0-9 ]", "g");
				}else{
					r = new RegExp("[0-9]", "g");
				}
				
				if (exp.match(r) == null) {
					evt.charCode = 0;
					return false;
				}
			} else if (that.config.vType.trim().toUpperCase() === "PORTALSUPPORTED") {
				var exp = String.fromCharCode(evt.charCode);
				if(that.config.allowSpaces){
					r = new RegExp("^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$", "g");
				}else{
					r = new RegExp("[0-9]", "g");
				}
				
				if (exp.match(r) == null) {
					evt.charCode = 0;
					return false;
				}
			}
			else{
				if(!cbx.isEmpty(that.config.vtype) && !cbx.isEmpty(that.config.maskRe)){
					var exp = String.fromCharCode(evt.charCode);
					try{
					var r = new RegExp(that.config.maskRe, "g");							
					if (exp.match(r) == null) {
						evt.charCode = 0;
						return false;
					}
					
				}catch(err){}
				}
			}
			if (typeof that.config.maxLength !== 'undefined'
					&& that.config.maxLength > 0) {
				if (typeof $('#' + that.config.itemId).val() !== 'undefined'
						&& $('#' + that.config.itemId).val().length >= that.config.maxLength) {
					return false;
				}
			}
		};
		this.passwordCmponentObject.addLayer(inputPassWordObj.getLayer());
		this.setFormField($(inputPassWordObj.getLayer()));
		
		$(this.inputPassWordObj.getLayer()).bind('change', this,
				function(event) {
			that.formManager.model.updateValue(that.config.itemId, that
					.getValue());
				});
		
		if(this.config.disabled==true){
			this.disable();
		}
		
		
	},
	getValue : function() {
		return this.getFormField().val();
	},
	setValue : function(value) {
	},
	getComponentDOM : function() {
		return this.passwordCmponentObject.getLayer();
	},
	getValidationField : function(){
		return this.getFormField();
	}
});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-passwordfield'
}, cbx.lib.formElement.cbxPassword);



cbx.lib.formElement.cbxImagePanel = Class(cbx.core.Component, {
	ctlCls : 'cbx-ImagePanel',
	isFormField : true,
	constructor : function(config) {
		cbx.lib.formElement.cbxImagePanel.$super.call(this);
		this.config=config;
		this.xtype=config.xtype || "";
		this.compositeField=config.compositeField?config.compositeField:false;
		this.formManager = config.fm;
		this.name = config.itemId;
		this.addData = config.addData;
		this.bundleKey=config.bundleKey
		this.createCarousel();
		//doIscroll('CONTENT_DIV','refresh');
		this.setEleType("N",config);		
		this.addItem(this.imageObject.getLayer());	
	},
	createCarousel : function(fieldcontain) {	
		var that=this;
		if(cbx.isEmpty(fieldcontain)){
		this.rawKeys = this.populateAddData(this.addData,'rawKey');
		this.rawValues = this.populateAddData(this.addData,'rawValue');
		imageObject = {
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
		}
		imageWrapperConfig = {
			"eleType" : "div",			
			"class":"cbxjqmCarousel-wrapper"
		};
		this.imageCmponentObject = new cbx.lib.layer(imageWrapperConfig);		
		this.imageObject.addLayer(this.imageCmponentObject.getLayer());
		var cbxLabelObj = new cbx.lib.formElement.cbxLabel(this.config);
		this.imageCmponentObject.addLayer(cbxLabelObj
				.getComponentDOM());
		this.labelText = $(cbxLabelObj.getComponentDOM()).text().replace(/\*/g,'');
		var carouselConfig = {
				"eleType" : "div",
				"class":"jcarousel-wrapper"
		};
		this.carouselWrapper = new cbx.lib.layer(carouselConfig);
		
		var carouselElemConfig = {
				"eleType" : "div",
				"class":"jcarousel",
				"data-jcarousel":"true"
		};
		
		this.carouselElem= new cbx.lib.layer(carouselElemConfig);
		
		var carouselUnorderedList = {
				"eleType" : "ul",
				"class":"jcarousel-ul"
		};
		this.carouselUnorderedList= new cbx.lib.layer(carouselUnorderedList);
		
		this.carouselElem.addLayer(this.carouselUnorderedList.getLayer());
		
		var str="";
		var combundle = CRB.getBundle(cbx.jsutil.getBundleKey(this));
		for ( var i = 0; i < this.rawValues.length; i++) { 
			var src = this.rawValues[i];
			var item=this.rawKeys[i];
			var label =(this.hideLabelInd == 'Y') ? '' :combundle['LBL_'+item];
			var itemSrc=item+'$'+src;
			str += '<li class="listAlign"><img itemId="'+itemSrc+'" src='+src+' label>';
			if(!cbx.isEmpty(label)){
			str +='<span class="labelAlign">'+label+'</span>';
			}
			str +='</li>';
			$('body').delegate('img[itemId="'+itemSrc+'"]', 'click',function(e){
				e.stopPropagation();
				that.formManager.handlerEvent('cbxclick',that.name, $(this).attr('itemId'));
			});
		}		
		$(this.carouselUnorderedList.getLayer()).append(str);
		
		this.carouselWrapper.addLayer(this.carouselElem.getLayer());
		
		var carouselAnchorPrev= {
				"eleType" : "a",
				"href":"#",
				"class":"jcarousel-control-prev",
				"html":"&lsaquo;",
				"data-jcarouselcontrol":"true"
		};
		
		this.carouselAnchorPrev= new cbx.lib.layer(carouselAnchorPrev);
		
		var carouselAnchorNext= {
				"eleType" : "a",
				"href":"#",
				"class":"jcarousel-control-next",
				"html":"&rsaquo;",
				"data-jcarouselcontrol":"true"
		};
		
		this.carouselAnchorNext= new cbx.lib.layer(carouselAnchorNext);
		
		var carouselPage= {
				"eleType" : "p",
				"class":"jcarousel-pagination"
		};
		this.carouselPageNav= new cbx.lib.layer(carouselPage);
		
        this.carouselWrapper.addLayer(this.carouselAnchorPrev.getLayer());
        this.carouselWrapper.addLayer(this.carouselAnchorNext.getLayer());
        this.carouselWrapper.addLayer(this.carouselPageNav.getLayer());
		this.imageCmponentObject.addLayer(this.carouselWrapper.getLayer());	
		
		this.setFormField($(this.imageCmponentObject.getLayer()));
		
		if(this.config.disabled==true){
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
	disable:function(){
		$(this.getComponentDOM()).addClass('ui-disabled');
	},
	enable : function() {
		$(this.getComponentDOM()).removeClass('ui-disabled');
	},
	getComponentDOM : function() {
		var that=this;
		setTimeout(function(){
			that.generateResponsive();
			//doIscroll('CONTENT_DIV','refresh');
		},500);
		return this.imageObject.getLayer();
	},	
	reload: function(){
		$(this.getComponentDOM()).empty();
		this.createCarousel(true);
		//doIscroll('CONTENT_DIV','refresh');
		
	},
	/**
	 * Updates the store with the arrays of keys and values.
	 */
	updateComboRawStore : function(keyArr, valueArr) {
		if(!cbx.isEmpty(keyArr) && !cbx.isEmpty(valueArr)){
			this.rawValues=valueArr;
			this.rawKeys=keyArr;
			this.reload();
		}
		//doIscroll('CONTENT_DIV','refresh');
	},
	getValidationField : function(){
		return this.getFormField();
	},
	generateResponsive:function(){
		(function($) {
		    $(function() {
		        var jcarousel = $('.jcarousel');

		        jcarousel
		            .on('jcarousel:reload jcarousel:create', function () {
		                var width = jcarousel.innerWidth();

		                if (width >= 600) {
		                    width = width / 3;
		                } else if (width >= 350) {
		                    width = width / 2;
		                }

		                jcarousel.jcarousel('items').css('width', width + 'px');
		            })
		            .jcarousel({
		                wrap: 'circular'
		            });

		        $('.jcarousel-control-prev')
		            .jcarouselControl({
		                target: '-=1'
		            });
		       
		        $('.jcarousel-control-next')
		            .jcarouselControl({
		                target: '+=1'
		            });

		        $('.jcarousel-pagination')
		            .on('jcarouselpagination:active', 'a', function() {
		                $(this).addClass('active');
		            })
		            .on('jcarouselpagination:inactive', 'a', function() {
		                $(this).removeClass('active');
		            })
		            .on('click', function(e) {
		                e.preventDefault();
		            })
		            .jcarouselPagination({
		                perPage: 1,
		                item: function(page) {
		                    return '<a href="#' + page + '">' + page + '</a>';
		                }
		            });
		    });
		})(jQuery);	
	}
});
CFCR.registerFormCmp({
	'COMP_TYPE' : 'cbx-imagepanel'
}, cbx.lib.formElement.cbxImagePanel);