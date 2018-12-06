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
 * 
 * 
 */
cbx.ns('cbx.lib');
cbx.lib.FormPanel=Class(cbx.core.Component,{
	initialize:function(){
		var config=this;
		var me=this.scope;
		var labelAlignType='top';
		if(config.labelAlignType){
			labelAlignType=config.labelAlignType;
		}
		var labelWidth=parseInt(iportal.preferences.getDefaultLabelWidth());
		if(config.labelCharCount!="" && parseInt(config.labelCharCount)==config.labelCharCount){
			labelWidth=iportal.preferences.getLabelCharWidth()*parseInt(config.labelCharCount);
			labelWidth=parseInt(labelWidth);
		}



		if(!Ext.isEmpty(config.formLogo) && config.formLogo!=''){
			me.formItems=[ {
				xtype:'panel',
				items:[{
					xtype : 'cbx-logo',
					defaultPath : config.formLogo
				}],
				style:"margin-top:10px; margin-bottom:10px;margin-right:10px;margin-left:10px;"
			}, config.formData]
		}else{
			me.formItems=config.formData;
		}		

		var formObj = {
					xtype : 'cbx-formpanel',
					defaultType : 'cbxTextField',
					bundleKey : config.bundleKey,
					autoScroll : false,

					labelAlign : labelAlignType,
					labelWidth : labelWidth,
					labelProportion:50,

					layout : 'anchor',
					// layoutConfig : config.layoutConf,

					items : me.formItems,

					defaults : {
						layout : 'tableform',
						anchor : '100%'
					},
					listeners : {

						"resize" : function (component, adjWidth, adjHeight, rawWidth, rawHeight){
							//alert("FORMPANEL resize Event");
							if (Ext.isIE6) {
								try {
									if (adjWidth >= (component.ownerCt.ownerCt.width - 30)) {
										component.ownerCt.setWidth(component.ownerCt.ownerCt.width - 10);
									}
								} catch (e) {
								}
							}
							if(this.ownerCt && this.ownerCt.ownerCt && this.ownerCt.ownerCt.ownerCt){
								if (this.ownerCt.ownerCt.ownerCt.getWidth() < this.findParentByType('panel').boxMinWidth) {
									this.ownerCt.ownerCt.ownerCt.setWidth(this.findParentByType('panel').boxMinWidth);
									this.ownerCt.ownerCt.ownerCt.doLayout();
								}
							}
						},
						/**
						 * If the panel's contextAvailable properrty is set to true,
						 * then removing the default padding added for the form panel.
						 * This value will be set by the tab panel through the
						 * FormManager's setContextContainer method. This will make sure
						 * the the context tab panel will take 100% width and height of
						 * the container window.
						 * 
						 * @see setContextContainer, cbx.formElement.TabPanel.beforeAdd
						 */
						"afterrender" : function (){
							//alert("FORMPANEL afterrender Event");
							if (this.ownerCt.ownerCt && this.ownerCt.ownerCt.contextAvailable === true) {
								this.body.setStyle('padding', '0px');
							}
							me.formPanelRendered = true;

							if(this.findParentByType('portlet') && this.findParentByType('portlet').getComponent(0).getEl().isMasked()){
								this.findParentByType('portlet').getComponent(0).getEl().unmask();
							}
							else{
								try{
									var layout = iportal.workspace.metadata.getCurrentLayout();
									var contextApp = iportal.workspace.metadata.getContextApp(layout.itemId.substring(0,layout.itemId.indexOf('_LAYOUT_CONTAINER')));
									var cAppWid = iportal.workspace.metadata.getCurrentWorkspace().getWidgetContainer().appMVRegistry.getWidget(contextApp);
									if(cAppWid && cAppWid.getEl().isMasked()){
										cAppWid.getEl().unmask();
									}
								}
								catch(e){
									LOGGER.info("Not a Workspace");
								}

							}

							/**
							 * The setvalue method which has been called in 'postmodel'
							 * load is not setting the value for the first time,hence
							 * 'formPanelRender' event is fired after rendering the
							 * formpanel.
							 */

							setTimeout(function (){
								me.initiateModel();// for static date field , amount field not update the value while applying value through applyModelData() 
								me.execute_queue();
								me.raisePostFormRender();
								me.doFormLayout();
							}, 100); 	
							me.doFormLayout();
						}
					}
		};

		//Adding form to the wrapperPanel
		me.wrapperPanel.add(formObj);
		me.doFormLayout();
		this.addItem(formObj);

	},
	destroy:function(){

		//alert("FORM Panel Destroy");
	}
});

CLCR.registerCmp({'COMP_TYPE':'FORM_PANEL'}, cbx.lib.FormPanel);

cbx.lib.LibFormWrapper=Class(cbx.core.Component,{
	initialize:function(){

		/**
		 * adding additional resize functionality for IE6 browser as Ext
		 * window is not able to maintain the scrolling properly. So the
		 * Wrapper Panel is made responsible to scroll and auto size itself
		 * as per the window's size.
		 */
		if (Ext.isIE6) {
			var ie6Config = {
						autoScroll : true,
						listeners : {
							"added" : function (container, owner){
								container.setHeight(owner.height - 67);
								container.setWidth(owner.width - 40);
							},
							"resize" : function (){
								try {
								} catch (e) {
								}
							}						
						},
						updateSize : function (win, w, h){
							this.setSize(w - 20, h - 67); 
							// this.setWidth(w - 10); 
							var that = this;
							setTimeout(function (){
								var size = that.getSize();
								that.setSize(size.width, size.height);
								// that.setWidth(size.width);
								if (that.getComponent(0)) {
									that.getComponent(0).doLayout();
								}
							}, 10);

							try {
							} catch (e) {
							}
						},
						doLayout:function(){
							alert("doLayout");
						}
			};
			Ext.apply(this.config, ie6Config);
		}
		this.wrapperPanel = new Ext.Panel(this.config);
		this.addItem(this.wrapperPanel);
	},
	destroy:function(){

		//this.getComponent(0).destroy();
	},

	/**
	 * This API will be invoked  by the form manager to get the entire form values before sending to the server
	 * This API is not a public API.
	 * */
	getForm:function(){
		return this.getItem(0).getComponent(0).getForm()/*getEl().dom*/;
	},

	//API not required as the formpanel is appended while initiliazing
	appendFormPanel:function(){}
	,
	doFormValidation : function(){
		var formObj = this.getForm();
		var firstField = null;
		var tabInnerPanel = null;
		var isValid = true;
		formObj.items.each(function (f){

			if (f.rendered && f.hidden === false && f.el.dom!=undefined) {

				if (!f.validate()) {
					isValid = false;
					if (firstField == null) {
						firstField = true;

						/**
						 * Code for finding if the field is under a tab
						 * panel. In that case the focus is needed be
						 * shifted to the correct panel. So that the field
						 * is available on the screen for the user to act
						 * upon.
						 */
						tabInnerPanel = f.findParentByType('cbx-tabinnerpanel');
						if(!cbx.isEmpty(tabInnerPanel)){
							this.wrapperPanel.fm.bringFieldOnActiveTab(tabInnerPanel);
						}

						f.focus();
						// return false;
						// //exiting
						// from the each
						// looping
					}
				}
			}
		}, this);
		return isValid;
	},
	/**
	 * @Method bringFieldOnActiveTab
	 * @description The method is used to activate a cbx-tabinnerpanel instance regardless of its location in any
	 * nested hierarchy of cbx-tabpanel
	 * @access private
	 * @param {Object} tabInnerPanel The instance of the tabInnerPanel that needs to be active.
	 */
	bringFieldOnActiveTab : function (tabInnerPanel){
		if (tabInnerPanel != null) {
			var tabPanel = tabInnerPanel.findParentByType('cbx-tabpanel');
			if (tabPanel != null) {
				tabPanel.skipValidation = true;
				tabPanel.activate(tabInnerPanel);
				var parentTabInnerPanel = tabPanel.findParentByType('cbx-tabinnerpanel');
				if (parentTabInnerPanel != null) {

					this.bringFieldOnActiveTab(parentTabInnerPanel);
				}
			}
		}
	},
	findField : function (selector,fieldName){
		var compObjArr = this.getItem(0).getComponent(0).find(selector, fieldName);				
		if (compObjArr != null && compObjArr.length > 0) {
			return compObjArr;
		} else {
			return null;
		}
	},
	//this function will be called from FormManager for finding all the components inside the form.
	find : function(formtype,booleanflag){
		var subformArr =  this.wrapperPanel.getComponent(0).find(formtype,booleanflag);
		return subformArr;
	},
	//this function resets the modelData of all the Child Components inside the form.
	reset : function(){
		this.wrapperPanel.getComponent(0).getForm().reset();
	},
	hasChildren:function(){		
		if(this.getItem(0).getComponent(0)){
			return true;
		}else{
			return false;
		}
	},
	setValues : function(valArray){
		this.getItem(0).getComponent(0).getForm().setValues(valArray, true);
	}
	,
	handleSubForm : function(config, formMeta){
		var cons = cbx.form.constants;
		/**
		 * if TabPanel exists in the whole form ,then wrapping the form meta data to a panel 
		 * to align the form properly according to the tabpanel's alignment.
		 */
		if (this.isTabPanelExists()) { 
			var wrapperContainer = {
						xtype : 'panel',
						items : [ config.formData ],
						autoScroll : false,
						border : false,
						frame : false,
						bodyStyle : 'padding:5px 0px 0px 10px;',
						layout : 'anchor',
						listeners : {
							afterRender : function (){
								this.doLayout();
							}
						}
			};
			config.formData = wrapperContainer;
		}
		if (config.formConfig && config.formConfig.direction === cons.DIR_TOP) {
			config.formData.insertDirection = cons.DIR_TOP;
			if (this.wrapperPanel.getComponent(0).getComponent(0) != null
						&& this.wrapperPanel.getComponent(0).getComponent(0).xtype == 'panel'
							&& this.wrapperPanel.getComponent(0).getComponent(0).getComponent(0).defaultPath != ' ') {
				this.wrapperPanel.getComponent(0).insert(1, config.formData);
			} 
			else {
				this.wrapperPanel.getComponent(0).insert(0, config.formData);
			}
		}
		else {
			this.wrapperPanel.getComponent(0).add(config.formData);
		}

		this.config.fm.doFormLayout();
	},

	getFieldDom:function(fieldName){
		var fieldObj = null;
		var fieldObj=this.findField(fieldName);
		if (fieldObj != null && fieldObj.isFormField && fieldObj.el && fieldObj.el.dom){
			return fieldObj.el.dom;
		}
		else{
			return "";
		}

	},
	getFormPanel:function(){
		return this.getItem(0).getComponent(0);
	},
	/**
	 * Intended to Check for tabpanel exists or not in the whole form. This
	 * method is added because while adding the form using addform() method
	 * using formManager instance the form loses its padding when tabpanel is 
	 * rendered already.
	 * 
	 * @returns {boolean}
	 */
	tabPanelExists : function (scope){
		var isExists=false; 
		var compObjArrCount = scope.getFormView().getComponent(0).find("xtype", 'cbx-tabpanel');
		if (compObjArrCount != null && compObjArrCount.length > 0) {
			for ( var i = 0; i < compObjArrCount.length; i++) {
				var item = compObjArrCount[i];
				if (item instanceof cbx.formElement.TabPanel) {
					return true;
				}
			}
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
	 * 	@return true if the form is valid otherwise false.
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
			var firstField = null;
			var tabInnerPanel = null;
			if (scope.wrapperPanel != null && scope.wrapperPanel.getComponent(0) != null)
			{
				var formObj = scope.wrapperPanel.getComponent(0).getForm();
				var tabFormPanel = null;
				var tabInnerPanel = null;
				var firstField = null;
				formObj.items.each(function (f)
				{
					if (f.rendered && f.hidden === false)
					{
						tabFormPanel = f.findParentBy(function (container, scope)
						{
							if (container.itemId === tabFormId)
							{
								return true;
							}
						});
						if (tabFormPanel != null)
						{
							if (!f.validate())
							{
								isValid = false;
								if (firstField == null)
								{
									firstField = true;
									/**
									 * Code for finding if the field is under a tab panel. In that case the focus is
									 * needed be shifted to the correct panel. So that the field is available on the
									 * screen for the user to act upon.
									 */

									tabInnerPanel = f.findParentByType('cbx-tabinnerpanel');
									this.wrapperPanel.parentCt.bringFieldOnActiveTab(tabInnerPanel);
									f.focus();
								}
							}
						}
						tabInnerPanel = null;
					}
				}, scope);
			}
			config.isDefaultValid = isValid;
			if (scope.register['cbxpostvalidate' + "|" + config.formId] != null)
			{
				var obj = scope.register['cbxpostvalidate' + "|" + config.formId];
				postValidateResult = obj.handler.apply(obj.mScope, [ scope, config ]);
				if (postValidateResult != null)
				{
					isValid = postValidateResult;
				}
			}
			if (scope.wrapperPanel && scope.wrapperPanel.getComponent(0))
			{
				scope.doFormLayout(scope.wrapperPanel.getComponent(0));
			}
			return isValid;
		}
	},
	/**
	 * The method will return the reference of the wrapper panel under which the
	 * entire form will be renderer. The app layer would require to insert this
	 * view where it wants to render the form. This inturn will help the Form
	 * Manager to prepare configurations that can help in Lazzy Loading of the
	 * form components.
	 */
	getFormView : function (){

		return this.wrapperPanel;
	},

	doFormLayout:function(cmp){
		if(cmp){
			if (cmp.ownerCt) {
				cmp.ownerCt.doLayout();
			} else {
				cmp.doLayout();
			}			
		}	
		else if (this.ownerCt) {
			this.wrapperPanel.ownerCt.doLayout();
		} else {
			this.wrapperPanel.doLayout();
		}
	},
	
	getUploadPanelCmp:function(){
		
		var compObjArrUpload = this.wrapperPanel.getComponent(0).find("xtype", 'cbx-fileuploadpanel');
		return compObjArrUpload;
	},
	resetUploadPanel:function(compObjArrCount){

		var stateid = [];
		var result = {};
		if (compObjArrCount != null && compObjArrCount.length > 0)
		{
			for (var i = 0; i < compObjArrCount.length; i++)
			{
				var item = compObjArrCount[i];
				if (item instanceof cbx.formElement.UploadPanel)
				{
					if (item.store && item.store.getCount() > 0)
					{
						item.store.queryBy(function (r)
						{
							stateid.push({
								'state' : r.get('state'),
								'filename' : r.get('fileName'),
								'totalcount' : item.store.getCount(),
								'enryptedFileName' : r.get('enryptedFileName') ? r.get('enryptedFileName')
											: '',
								'attachmentRefNumber' : r.get('attachmentRefNumber') ? r
											.get('attachmentRefNumber') : ''
							});
						});
						result[item.name] = stateid;
					} else
					{
						stateid.push({
							'state' : '',
							'filename' : '',
							'totalcount' : '0',
							'enryptedFileName' : '',
							'attachmentRefNumber' : ''
						});
						result[item.name] = stateid;
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
				if (item instanceof cbx.formElement.UploadPanel)
				{
					if (fieldNames != null && cbx.isArray(fieldNames))
					{
						if (fieldNames.contains(item.name))
						{
							if (item.store && item.store.getCount() > 0)
							{
								item.store.queryBy(function (r)
								{
									stateid.push({
										'state' : r.get('state'),
										'filename' : r.get('fileName'),
										'totalcount' : item.store.getCount(),
										'enryptedFileName' : r.get('enryptedFileName') ? r
													.get('enryptedFileName') : '',
										'attachmentRefNumber' : r.get('attachmentRefNumber') ? r
													.get('attachmentRefNumber') : ''
									});
								});
								result[item.name] = stateid;
							} else
							{
								stateid.push({
									'state' : '',
									'filename' : '',
									'totalcount' : '0',
									'enryptedFileName' : '',
									'attachmentRefNumber' : ''
								});
								result[item.name] = stateid;
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
				if (item instanceof cbx.formElement.UploadPanel)
				{
					if (item.rendered && item.hidden === false)
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
	getUploadPanelFileStatus:function(compObjArrCount,fieldNames){
		var stateid = [];
		var result = {};
		if (compObjArrCount != null && compObjArrCount.length > 0)
		{
			for (var i = 0; i < compObjArrCount.length; i++)
			{
				var item = compObjArrCount[i];
				if (item instanceof cbx.formElement.UploadPanel)
				{
		if (fieldNames != null && cbx.isArray(fieldNames)) 
					{
						if (fieldNames.contains(item.name))
						{
							if (item.store && item.store.getCount() > 0)
							{
								item.store.queryBy(function (r)
								{
									stateid.push({
										'state' : r.get('state'),
										'filename' : r.get('fileName'),
										'totalcount' : item.store.getCount()
									});
								});
								result[item.name] = stateid;
							} else
							{
								stateid.push({
									'state' : '',
									'filename' : '',
									'totalcount' : '0'
								});
								result[item.name] = stateid;
							}
						}
					} else
					{
						if (item.store && item.store.getCount() > 0)
						{
							item.store.queryBy(function (r)
							{
								stateid.push({
									'state' : r.get('state'),
									'filename' : r.get('fileName'),
									'totalcount' : item.store.getCount()
								});
							});
							result[item.name] = stateid;
						} else
						{
							stateid.push({
								'state' : '',
								'filename' : '',
								'totalcount' : '0'
							});
							result[item.name] = stateid;
						}
					}
				}
			}
		}
		return result;	
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
				if (item instanceof cbx.formElement.UploadPanel)
				{
					if (item.store)
					{
						item.store.queryBy(function (r)
									{
							if (r.get('state') === 'queued')
							{
								stateid.push(r.get('id'));
								count++;
							}

									});
					}
				}
			}
		}
		result.push({
			'id' : stateid,
			'count' : count
		});
		return result;

	},

	uploadFile:function(state, handler,fileQueues){
		var queuedCount = 0;
		if (fileQueues.length > 0 && fileQueues[0].count > 0)
		{
			var compObjArrUpload = this.getUploadPanelCmp();
			var upLoadConfig = {
						showConf : {}
			};
			var upClass = CLCR.getCmp({
				'COMP_TYPE' : 'UPLOAD_BOX'
			});
			var uploadProgressBar = new upClass(upLoadConfig).getItem(0);
			uploadProgressBar.show({
				msg : CRB.getFWBundle() && CRB.getFWBundle()['ProgressUploadingWaitMsg'] ? CRB
							.getFWBundle()['ProgressUploadingWaitMsg'] : 'Uploading File, please wait...',
							progressText : 'Saving...',
							width : 300,
							wait : true,
							cls : "custom",
							title : CRB.getFWBundle() && CRB.getFWBundle()['ProgressUploading']
							? CRB.getFWBundle()['ProgressUploading'] : 'uploading Files',
										waitConfig : {
											interval : 200
										},
										icon : 'ext-mb-download',
										modal : true
			});

			if (compObjArrUpload != null && compObjArrUpload.length > 0)
			{
				for (var j = 0; j < compObjArrUpload.length; j++)
				{
					var item = compObjArrUpload[j];
					if (item instanceof cbx.formElement.UploadPanel)
					{
						if (item.onUpload)
						{
							if (item.store)
							{
								item.store.queryBy(function (rec)
											{
									if (rec.get('state') === 'queued')
									{
										queuedCount++;
										item.onUpload(handler, queuedCount, fileQueues[0].count,
													uploadProgressBar);
									}

											});
							}
						}
					}
				}
			}
		} else
		{
			handler.apply('state', [ 'uploaded' ]);
		}

	}
});
CLCR.registerCmp({'COMP_TYPE':'FORM_WRAPPER'}, cbx.lib.LibFormWrapper);


cbx.lib.UploadMessageBox=Class(cbx.core.Component,{
	initialize:function(){
		var msgBox=Ext.UploadMessageBox;

		this.showConf={
					msg : CRB.getFWBundle() && CRB.getFWBundle()['ProgressUploadingWaitMsg'] ? 
								CRB.getFWBundle()['ProgressUploadingWaitMsg'] : 'Uploading File, please wait...',
								progressText : 'Saving...',
								width : 300,
								wait : true,
								cls : "custom",
								title : CRB.getFWBundle() && CRB.getFWBundle()['ProgressUploading'] ? 
											CRB.getFWBundle()['ProgressUploading'] : 'uploading Files',
											waitConfig : {
												interval : 200
											},
											icon : 'ext-mb-download', 
											modal : true
		};
		this.addItem(msgBox);
	}
});
CLCR.registerCmp({'COMP_TYPE':'UPLOAD_BOX'}, cbx.lib.UploadMessageBox);