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
cbx.ns('cbx.lib');

cbx.lib.FormPanel = Class( cbx.core.Component, {
	intialConfig: null,
	formManager: null,
	formContainer: null, //global variable that holds the required DIV HTML
	initialize: function() {
		this.intialConfig = this;
		this.formManager = this.scope;
		this.formManager.formItems=this.formData;
		var formContainerConfig = {
			'eleType': 'form',
			'id': this.intialConfig.formData.formId, 
			'class':'ui-body ui-body-e'
		};
		this.formContainer = new cbx.lib.layer(formContainerConfig).getLayer();
		$(this.formContainer).attr('novalidate', 'novalidate');
		
		$(this.formContainer).on("remove", function () {
			cbx.lib.datePicker.clearArray();
			window.focusEle = null;
		});
		
		this.addItem(this.formContainer);
		this.createItems();
		doIScroll('CONTENT_DIV','refresh'); 
		$(this.formContainer).addClass('ct-form-component');
		$(this.formContainer).find('*').addClass('ct-form-component');
	},
	addField: function(obj) {
		if(this.formContainer !==  null){
			this.formContainer.appendChild(obj);
		}
	},
	getForm: function() {
		return this.getItem().getLayer();
	},
	/* This method is used for creating the lazzyform panel */
	createItems: function(formData){
		var formData = formData?formData:this.intialConfig.formData;
		/* creating the form title by calling createFormTitle() */
		//this.createFormTitle();
		/* creating the form logo by calling createFormLogo() */
		//this.createFormLogo();
		if(typeof this.intialConfig.formData !== 'undefined'){
			var cClass = CFCR.getFormCmp({'COMP_TYPE':formData.xtype});
			if (cClass) {
				new cClass({
					'formPanel':this.formContainer,
					'formData':formData,
					'formManager': this.formManager,
					'mode':formData.mode ? formData.mode:this.formManager.mode,
					'strictMode':formData.strictMode?formData.strictMode:false
				});
			}
		 }
	},
	pushForm : function(formData){
		this.createItems(formData);
		$(this.formContainer).trigger("create");
	},
	initializeForm : function(){
		
	},
	destroy: function() {
		
	},
	createFormTitle: function(){
		var titlContainerConfig;
		var titlContainer;
		var titleConfig;
		var titleObj;
		titlContainerConfig = {
			'eleType': 'div',
			'class': 'cbxform-title-container'
		};
		var tempFormTitle = '';
		var formDesc;
		if (typeof this.intialConfig.formData.formTitle !== 'undefined' && this.intialConfig.formData.formTitle !== '') {
			tempFormTitle = this.intialConfig.formData.formTitle;
		}
		if (typeof this.intialConfig.formData.formDesc !== 'undefined' && this.intialConfig.formData.formDesc !== '') {
			if(typeof tempFormTitle === 'undefined' && tempFormTitle === '') {
				tempFormTitle = this.intialConfig.formData.formDesc;
			}
			formDesc = this.intialConfig.formData.formDesc;
		}
		if (typeof tempFormTitle !== 'undefined' && tempFormTitle !== '') {
			titleConfig = {
				'eleType': 'div',
				'html': tempFormTitle,
				'class': 'cbxform-title'
			};
			var titleObj = new cbx.lib.layer(titleConfig);
			titlContainer = new cbx.lib.layer(titlContainerConfig);
			titlContainer.addLayer(titleObj.getLayer());
			if (typeof formDesc !== 'undefined' && formDesc !== '') {
				var descConfig = {
					'eleType': 'div',
					'class': 'cbxtitle-desc'
				};
				descObj = new cbx.lib.layer(descConfig);
				titlContainer.addLayer(descObj.getLayer());
				this.formContainer.appendChild(titlContainer.getLayer());
			}
		}
	},
	createFormLogo: function() {
		var logoContainerConfig;
		var logoContainer;
		var logoConfig;
		var logoObj;
		/* var defaultLogoPath = 'images/inactive-status.png'; */
		var logoPath;
		if(typeof this.intialConfig.formData.formLogo !== 'undefined') {
			logoPath = this.intialConfig.formData.formLogo;
		}
		logoConfig = {
			'eleType': 'img',
			'class': 'formlogo',
			'src': logoPath
		};
		logoContainerConfig = {
			'eleType': 'div',
			'class': 'formlogo-container'
		};
		logoObj = new cbx.lib.layer(logoConfig);
		logoContainer = new cbx.lib.layer(logoContainerConfig);
		logoContainer.addLayer(logoObj.getLayer());
		this.formContainer.appendChild(logoContainer.getLayer());
	},
	doValidate : function(){
		var status = true;
		var initFocus;
		var valList = [];

		var visibleFields = $(this.formContainer).find('*').filter(':visible');
		visibleFields.each(function ()
		{
			var parentCt = this.parentCt;
			if (parentCt && parentCt.isValid == false)
			{
				var scrllConfig = {
					"ele" : this,
					"duration" : 500
				};
				doIScroll("CONTENT_DIV", "refresh", scrllConfig);
				status = false;
				return false;
			}
		});

		var compObjArrCount = this.getTabPanelCmp();
		if(!cbx.isEmpty(compObjArrCount))
			{
			this.validateTabPanel(compObjArrCount);
			}
		

		if (status)
		{

			var fields = $(this.formContainer).find('.cbx-conditional-ind').filter(':visible');
			for (var i = 0; i < fields.length; i++)
			{
				var span = $(fields[i]);
				var id = span.parent().attr('for');
				var field = $(this.formContainer).find('#' + id);
				var value;
				var component = field && field[0] && field[0].parentCt ? field[0].parentCt : $('#'+ id.substring(0, id.indexOf("_field")))[0].parentCt;
				/*
				 * if(field && field[0].parentCt){ value = field[0].parentCt.getValue(); } else
				 * if($('#'+id.substring(0,id.indexOf("_field")))[0].parentCt){ value =
				 * $('#'+id.substring(0,id.indexOf("_field")))[0].parentCt.getValue(); }
				 */
				value = component.getValue();

				if (cbx.isEmpty(value) || cbx.isEmpty(value.trim()))
				{
					this.formManager.markInvalid(id.substring(0, id.indexOf("_field")));
				}
				if (!component.isValid)
				{
					if (!initFocus)
					{
						initFocus = field[0];
						var scrollEle = initFocus
						var scrllConfig = {
							"ele" : scrollEle,
							"duration" : 500
						};
						doIScroll("CONTENT_DIV", "refresh", scrllConfig);
					} else
					{
						this.formManager.markInvalid(id.substring(0, id.indexOf("_field")));
					}
					status = false;
					}

				}
			}
			return status;
		},
		/**
		 * Intended to get the count of tabpanel component for 
		 * a particular form to validate the inner forms in the tab.This method returns the tabpanel components
		 * in a particular form else NULL
		 * @returns {array}
		 */
		getTabPanelCmp : function ()
		{
			var that = this;
			var result = [];
			var i = 0;
			var cmp = $($(this.formContainer)[0]).find("[cbx-type^='formField_TABPANEL']");
			var length = cmp.length;
			if (length > 0)
			{
				cmp.each(function ()
				{
					result.push(this.parentCt);
					i++;
				});
				return result;
			} else
			{
				return [];
			}
		},
		/**
		 * Intended to Validate the tabPanel while switching between tabs. This
		 * method is added because when switching between the tabs we have to validate the mandatory fields were 
		 * filled or empty.If any of the mandatory field value is empty it will return false 
		 * else returns true. 
		 * @returns {boolean}
		 */
		validateTabPanel : function (compObjArrCount)
		{
			var resultValid = true;
			if (compObjArrCount != null && compObjArrCount.length > 0)
			{
				for (var i = 0; i < compObjArrCount.length; i++)
				{
					var item = compObjArrCount[i];
					if (item instanceof cbx.lib.formElement.cbxTabPanel)
					{
						if (item.validate)
						{
							resultValid = item.validate();
						}
	
					}
				}
			}
			return resultValid;
		}	
 }); 
CLCR.registerCmp({'COMP_TYPE':'FORM_PANEL'}, cbx.lib.FormPanel);

cbx.lib.LibFormWrapper = Class(cbx.core.Component,{
	initialize: function(){
		var panelConfig;
		var panelObject;
		panelConfig = {
			"eleType": "div",
			"class": "form-wrapper"
		};
		panelObject	= new cbx.lib.layer(panelConfig).getLayer();	
		this.addItem(panelObject);
	},
	appendFormPanel : function(formPanel){
		$(this.getItem(0)).append(formPanel);
		$.mobile.activePage.trigger('create');
		formPanel.parentCt.formManager.formPanelRendered = true;
		$(document).trigger('formPanelRender');
		formPanel.parentCt.formManager.initiateModel();
		formPanel.parentCt.formManager.execute_queue();
		formPanel.parentCt.formManager.raisePostFormRender();
	},
	find : function(selector,value){
		return [];
	},
	findField : function(selector,value){
		var field = $(this.getItem(0)).find('#'+value);
		if(field.length>0 && field[0].parentCt){
			return [field[0].parentCt];
		} 
		else{
			return null;
		}
	},
	reset :function(){
		var that=this;
		var formTag=$(this.getForm()[0]);
		formTag.find("[cbx-type^='formField_']").each(function() {
			var field=that.findField('',$(this).attr('name'));
			if(field !=null && field.length>0 && field[0].reset){
				field[0].reset();
			}
		});
	},
	setValues : function(valArray){
		for(var i=0;i<valArray.length;i++){
			var field = this.findField("id",valArray[i].id);
			if(field !=null && field.length>0){
				field[0].setValue(valArray[i].value);
			}
		}
	},
	hasChildren : function(){
		return $(this.getItem(0)).children()[0]?true:false;
	},
	destroy:function(){
		
	},
	getFormWrapperObject: function() {
		return this.getItem(0);
	},
	getForm:function(){
		return $(this.getFormWrapperObject()).children();
	},
	doFormValidation : function(){
		return this.hasChildren()?$(this.getItem(0)).children()[0].parentCt.doValidate():false;
	},
	handleSubForm : function(config,meta){
		var cons = cbx.form.constants;		
		config.formData.insertDirection = config.formConfig.direction;
		this.getForm()[0].parentCt.pushForm(config.formData);
	},	
	/**
	 * Intended to Check for tabpanel exists or not in the whole form. This
	 * method is added because while adding the form using addform() method
	 * using formManager instance the form loses its padding when tabpanel is 
	 * rendered already.
	 * 
	 * @returns {boolean}
	 */
	tabPanelExists : function (scope)
	{
		var isExists = false;
		var compObjArrCount = $($(scope.getFormView().parentCt.items)[0]).find("[cbx-type^='formField_TABPANEL']");
		if (compObjArrCount != null && compObjArrCount.length > 0)
		{
			for (var i = 0; i < compObjArrCount.length; i++)
			{
				var item = compObjArrCount[i];
				if (item instanceof cbx.lib.formElement.cbxTabPanel)
				{
					return true;
				}
			}
			return true;
		}

		return isExists;
	},
	/**
	 * @Method validateTabForm
	 * Validate all the fields of the formId provided in the config. This method is expected to first lookup
	 * for custom form validation provided by app layer. Execute it for validation in case it is provided
	 * otherwise call the default validation process. And then execute the post default validation process
	 * in case it is registered.
	 * @access private
	 * @param {Object} config Additional information that is needed to be sent to the app layer's custom validation.
	 *         Specially helpful in knowing the action of the validation. For example. DRAFT, SAVE, etc. In
	 *         addition to that config.formId is the required property that should be provided for the
	 *         method to perform validations
	 * @return true if the form is valid otherwise false.
	 */
	validateTabForm : function (config, scope)
	{

		var preValidateResult = null;
		var postValidateResult = null;
		var continueDefaultValidation = false;
		var tabFormId = config.formId;
		if (tabFormId == null)
		{

			return false;
		}
		tabFormId = tabFormId + "_INNER_PANEL";
		config = config || {};
		if (scope.register['cbxprevalidate' + "|" + config.formId] != null)
		{
			var obj = scope.register['cbxprevalidate' + "|" + config.formId];
			preValidateResult = obj.handler.apply(obj.mScope, [ scope, config ]);
		}
		if (preValidateResult != null && cbx.isObject(preValidateResult))
		{
			var isValid = preValidateResult.isPreValid;
			config.isPreValid = isValid;
			if (preValidateResult.defaultValidation === true)
			{
				continueDefaultValidation = true;
			} else
			{
				return isValid;
			}
		}
		/**
		 * if the reurned value is of boolean type than return the value back to the caller and exit from the function.
		 */
		else if (preValidateResult != null && cbx.isBoolean(preValidateResult))
		{
			return preValidateResult;
		}
		/**
		 * Continue with default validation. This effectively means that the app layer is not handling the
		 * cbxprevalidate event for this form.
		 */
		else
		{
			continueDefaultValidation = true;
		}
		if (continueDefaultValidation === true)
		{
			var isValid = true;
			if (scope.wrapperPanel != null && scope.wrapperPanel.parentCt.items != null)
			{
				var that = scope;
				this.formContainer = $(this.items).find('#' + tabFormId)

				var status = true;
				var initFocus;
				var valList = [];
				if (status)
				{
					var fields = $(this.formContainer).find('.cbx-conditional-ind').filter(':visible');
					for (var i = 0; i < fields.length; i++)
					{
						var span = $(fields[i]);
						var id = span.parent().attr('for');
						var field = $(this.formContainer).find('#' + id);
						var value;
						var component = field && field[0] && field[0].parentCt ? field[0].parentCt : $('#'
									+ id.substring(0, id.indexOf("_field")))[0].parentCt;
						value = component.getValue();

						if (cbx.isEmpty(value) || cbx.isEmpty(value.trim()))
						{
							that.markInvalid(id.substring(0, id.indexOf("_field")));

						}
						if (!component.isValid)
						{
							if (!initFocus)
							{
								initFocus = field[0];
								var scrollEle = initFocus
								var scrllConfig = {
									"ele" : scrollEle,
									"duration" : 500
								};
								doIScroll("CONTENT_DIV", "refresh", scrllConfig);
							} else
							{
								that.markInvalid(id.substring(0, id.indexOf("_field")));
							}
							status = false;
							component.isValid = true;
						}

					}
				}

				isValid = status;
			}
			if (scope.register['cbxpostvalidate' + "|" + config.formId] != null)
			{
				var obj = scope.register['cbxpostvalidate' + "|" + config.formId];
				postValidateResult = obj.handler.apply(obj.mScope, [ scope, config ]);
				if (postValidateResult != null)
				{
					isValid = postValidateResult;
				}
			}

			return isValid;
		}
	},
	getUploadPanelCmp:function(){
		var that=this;
		var result=[];
		var i=0;
		var formTag=$(this.getForm()[0]);
		var cmp=formTag.find("[cbx-type^='formField_UPLOADPANEL']");
		var length=cmp.length;
		   if(length>0){
			cmp.each(function() {
			var field=that.findField('',$(this).attr('name'));
			result.push(field.shift());
			i++;
			});
			return result;
			}
			else{		
			return [];
			}
			
		},
		getUploadPanelFileStatus:function(compObjArrCount,fieldNames){
			var stateid = [];
			var result = {};
			if (compObjArrCount != null && compObjArrCount.length > 0)
			{
				for (var i = 0; i < compObjArrCount.length; i++)
				{
					var item = compObjArrCount[i];
					if (item instanceof cbx.lib.formElement.cbxfileuploadpanel)
					{
			if (fieldNames != null && cbx.isArray(fieldNames)) 
						{
							if (fieldNames.contains(item.itemId))
							{
								var fileDetails=item.getFileStatus();
								if(cbx.isArray(fileDetails) && fileDetails.length>0)
								{
									for(var status=0; status<fileDetails.length;status++){
										stateid.push({
										'state' : fileDetails[status].state,
										'filename' : fileDetails[status].filename,
										'totalcount' : fileDetails[status].totalCount
										});	
										result[item.itemId] = stateid;
									}
								}else{
									stateid.push({
										'state' : '',
										'filename' : '',
										'totalcount' : '0'
									});
									result[item.itemId] = stateid;
								}
								
							}
						} else
						{
							
							var fileDetails=item.getFileStatus();
							if(cbx.isArray(fileDetails) && fileDetails.length>0)
							{
								for(var status=0; status<fileDetails.length;status++){
									stateid.push({
										'state' : fileDetails[status].state,
										'filename' : fileDetails[status].filename,
										'totalcount' : fileDetails[status].totalCount
									});	
									result[item.itemId] = stateid;
								}
							}else{
								stateid.push({
									'state' : '',
									'filename' : '',
									'totalcount' : '0'
								});
								result[item.itemId] = stateid;
							}
						}
					}
				}
			}
			return result;	
		},
		
		resetUploadPanel:function(compObjArrCount){

			var stateid = [];
			var result = {};
			if (compObjArrCount != null && compObjArrCount.length > 0)
			{
				for (var i = 0; i < compObjArrCount.length; i++)
				{
					var item = compObjArrCount[i];
					if (item instanceof cbx.lib.formElement.cbxfileuploadpanel)
					{
						var fileDetails=item.getFileStatus();
						if(cbx.isArray(fileDetails) && fileDetails.length>0)
						{
							for(var status=0; status<fileDetails.length;status++){
								stateid.push({
								'state' : fileDetails[status].state,
								'filename' : fileDetails[status].filename,
								'totalcount' : fileDetails[status].totalCount,
								'enryptedFileName' : fileDetails[status].enryptedFileName,
								'attachmentRefNumber' : fileDetails[status].attachmentRefNumber
								});	
								result[item.itemId] = stateid;
							}
						} else
						{
							stateid.push({
								'state' : '',
								'filename' : '',
								'totalcount' : '0',
								'enryptedFileName' : '',
								'attachmentRefNumber' : ''
							});
							result[item.itemId] = stateid;
						}
						if (item.removeAll)
						{
							item.removeAll();
						}
					}
				}
			}
			return result;
		
		},
		clearUploadPanel:function(compObjArrCount,fieldNames){

			var stateid = [];
			var result = {};
			if (compObjArrCount != null && compObjArrCount.length > 0)
			{
				for (var i = 0; i < compObjArrCount.length; i++)
				{
					var item = compObjArrCount[i];
					if (item instanceof cbx.lib.formElement.cbxfileuploadpanel)
					{
						if (fieldNames != null && cbx.isArray(fieldNames))
						{
							if (fieldNames.contains(item.itemId))
							{
								var fileDetails=item.getFileStatus();
								if(cbx.isArray(fileDetails) && fileDetails.length>0)
								{
									for(var status=0; status<fileDetails.length;status++){
										stateid.push({
										'state' : fileDetails[status].state,
										'filename' : fileDetails[status].filename,
										'totalcount' : fileDetails[status].totalCount,
										'enryptedFileName' : fileDetails[status].enryptedFileName,
										'attachmentRefNumber' : fileDetails[status].attachmentRefNumber
										});	
										result[item.itemId] = stateid;
									}
								} else
								{
									stateid.push({
										'state' : '',
										'filename' : '',
										'totalcount' : '0',
										'enryptedFileName' : '',
										'attachmentRefNumber' : ''
									});
									result[item.itemId] = stateid;
								}
								if (item.removeAll)
								{
									item.removeAll();
								}
							}
						}
					}
				}
			}
			return result;
			
		},
		
		validateUploadPanel:function(compObjArrCount){
			var resultValid=true;
			if (compObjArrCount != null && compObjArrCount.length > 0)
			{
				for (var i = 0; i < compObjArrCount.length; i++)
				{
					var item = compObjArrCount[i];
					if (item instanceof cbx.lib.formElement.cbxfileuploadpanel)
					{
						if (item.hidden === false)
						{
							if (item.validate)
							{
								resultValid = item.validate();
							}
							
					}
					}
				}
			}
			return resultValid;
		},
		getUploadPanelQueuedState:function(compObjArrCount){
			var count = 0;
			var stateid = []
			var result = [];
			if (compObjArrCount != null && compObjArrCount.length > 0)
			{
				for (var i = 0; i < compObjArrCount.length; i++)
				{
					var item = compObjArrCount[i];
					if (item instanceof cbx.lib.formElement.cbxfileuploadpanel)
					{
						var queueItems=item.getQueue();
						if(cbx.isArray(queueItems) && queueItems.length>0)
						{
						for(var queue=0; queue<queueItems.length;queue++){
						stateid.push(queueItems[queue].id);
						count++;
						}
						}
				}
			}
			result.push({
				'id' : stateid,
				'count' : count
			});
			return result;
			LOGGER.info('getUploadPanelQueuedState ',result);
		}
		},

	uploadFile:function(state, handler,fileQueues){ 
		
		if (fileQueues.length > 0 && fileQueues[0].count > 0)
		{
			var compObjArrUpload = this.getUploadPanelCmp();
			
			if (compObjArrUpload != null && compObjArrUpload.length > 0)
			{
				for (var j = 0; j < compObjArrUpload.length; j++)
				{
					var item = compObjArrUpload[j];
					if (item instanceof cbx.lib.formElement.cbxfileuploadpanel)
					{
						if (item.hidden === false)
						{
						item.onUpload(handler, fileQueues[0].count);
						}
					}
					
				}
			}
					
		}
	}
});
CLCR.registerCmp({'COMP_TYPE':'FORM_WRAPPER'}, cbx.lib.LibFormWrapper);
