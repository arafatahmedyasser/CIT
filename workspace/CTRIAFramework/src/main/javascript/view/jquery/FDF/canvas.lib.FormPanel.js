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
 
/**
 * 
 */
cbx.ns('canvas.lib');
/**
 * 
 */
canvas.lib.FormPanel = Class( cbx.core.Component, {
	/**
	 * 
	 */
	intialConfig: null,
	/**
	 * 
	 */
	formManager: null,
	/**
	 * 
	 */
	formContainer: null,
	/**
	 * 
	 */
	initialize: function() {
		this.intialConfig = this;
		this.formManager = this.scope;
		var formContainerConfig = {
			'eleType': 'form',
			'id': this.getRandomNumber()+"_"+this.intialConfig.formData.formId,
			'class':'ui-body ui-body-e'
		}
		this.formContainer = new cbx.lib.layer(formContainerConfig).getLayer();
		this.addItem(this.formContainer);
		this.createItems();
	},
	/**
	 * 
	 */
	getRandomNumber : function(){
		return Math.floor((Math.random()*1000000)+1);
	},
	/**
	 * 
	 */
	addField: function(obj) {
		if(this.formContainer !==  null){
			this.formContainer.appendChild(obj);
		}
	},
	/**
	 * 
	 */
	getForm: function() {
		return this.getItem().getLayer();
	},
	/**
	 * 
	 */
	createItems: function(formData){
		var formData = formData?formData:this.intialConfig.formData;
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
	/**
	 * 
	 */
	pushForm : function(formData){
		this.createItems(formData);
		$(this.formContainer).trigger("create");
	},
	/**
	 * 
	 */
	initializeForm : function(){
		
	},
	/**
	 * 
	 */
	destroy: function() {
		
	},
	/**
	 * 
	 */
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
	/**
	 * 
	 */
	createFormLogo: function() {
		var logoContainerConfig;
		var logoContainer;
		var logoConfig;
		var logoObj;
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
	/**
	 * 
	 */
	doValidate : function(){
		var status = true;
		var valList = [];
		var fields = $(this.formContainer).find('.cbx-conditional-ind').filter(':visible');
		for(var i=0;i<fields.length;i++){
			var span = $(fields[i]);
			var id = span.parent().attr('for');
			var field = $(this.formContainer).find('#'+id);
			var value;
			var component = field && field[0] && field[0].parentCt?field[0].parentCt:$('#'+id.substring(0,id.indexOf("_field")))[0].parentCt;
			value = component.getValue();
			if(cbx.isEmpty(value.trim())){
				status = false;
				var label = id
				valList.push(field.text());
				this.formManager.markInvalid(id.substring(0,id.indexOf("_field")));
			}
		}
		if(!status){
			var message = CRB.getFWBundleValue('LBL_ERROR_MSG_MAND');
			var win = new iportal.Dialog({
				title:'ERROR',
				dialogType:'MESSAGE',
				message:message,
				scope:this,
				okHandler:function(win){
					win.close();
				}								
			}).show();
		}
		return status;
	}
}); 
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'FORM_PANEL'}, canvas.lib.FormPanel);

/**
 * 
 */
canvas.lib.LibFormWrapper = Class(cbx.core.Component,{
	/**
	 * 
	 */
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
	/**
	 * 
	 */
	appendFormPanel : function(formPanel){
		$(this.getItem(0)).append(formPanel);
		//$.mobile.activePage.trigger('create');
		formPanel.parentCt.formManager.formPanelRendered = true;
		formPanel.parentCt.formManager.initiateModel();
		formPanel.parentCt.formManager.execute_queue();
	},
	/**
	 * 
	 */
	find : function(selector,value){
		return [];
	},
	/**
	 * 
	 */
	findField : function(selector,value){
		var field = $(this.getItem(0)).find();
		if(field.length>0 && field[0].parentCt){
			return [field[0].parentCt];
		} 
		else{
			return null;
		}
	},
	/**
	 * 
	 */
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
	/**
	 * 
	 */
	setValues : function(valArray){
		for(var i=0;i<valArray.length;i++){
			var field = this.findField("id",valArray[i].id);
			if(field !=null && field.length>0){
				field[0].setValue(valArray[i].value);
			}
		}
	},
	/**
	 * 
	 */
	hasChildren : function(){
		return $(this.getItem(0)).children()[0]?true:false;
	},
	/**
	 * 
	 */
	destroy:function(){
		
	},
	/**
	 * 
	 */
	getFormWrapperObject: function() {
		return this.getItem(0);
	},
	/**
	 * 
	 */
	getForm:function(){
		return $(this.getFormWrapperObject()).children();
	},
	/**
	 * 
	 */
	doFormValidation : function(){
		return this.hasChildren()?$(this.getItem(0)).children()[0].parentCt.doValidate():false;
	},
	/**
	 * 
	 */
	handleSubForm : function(config,meta){
		var cons = cbx.form.constants;		
		config.formData.insertDirection = config.formConfig.direction;
		this.getForm()[0].parentCt.pushForm(config.formData);
	}
});
/**
 * 
 */
CLCR.registerCmp({'COMP_TYPE':'FORM_WRAPPER'}, canvas.lib.LibFormWrapper);
