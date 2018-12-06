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
 * @description This component is currently responsible Jquery_Bootstrap Framework for creating Form Panel.
 * 				Also renders the logo if the Form Panel has one.
 */

canvas.lib.FormWrapper = Class(cbx.core.Component,{

	/**
	 * @class 		"canvas.lib.FormWrapper"
	 * @extends		"cbx.core.Component"
	 * @description The initialize function creates the DOM structure for Form Wrapper.
	 */
	initialize: function(){
		var panelConfig;
		var panelObject;
		panelConfig = {
			"eleType": "div",
			"class": "form-wrapper"
		};
		this.wrapperPanel	= new cbx.lib.layer(panelConfig).getLayer();	
		this.addItem(this.wrapperPanel);
	},
	/**
	 * @method 		createFormLogo
	 * @memberof 	"canvas.lib.FormWrapper"
	 * @description This method appends the DOM obtained from form panel to the DOM 
	 * 				created in the initialize function.
	 */
	appendFormPanel : function(formPanel){
		$(this.getItem(0)).append(formPanel);
		formPanel.parentCt.formManager.formPanelRendered = true;
		formPanel.parentCt.formManager.initiateModel();
		formPanel.parentCt.formManager.execute_queue();
	},
	getFormWrapperObject: function() {
		return this.getItem(0);
	},
	hasChildren : function(){
		return $(this.getItem(0)).children()[0]?true:false;
	},
	findField : function(name,value){
		var field = $(this.getItem(0)).find('div[data-item-id="' + value + '"]');
		if(field.length>0 && field[0].parentCt){
			return [field[0].parentCt];
		}
		if(field.length>0 && field[0]){
			return [field[0]];
		}
		else{
			return null;
		}
	},
	setValues : function(valArray){
		for(var i=0;i<valArray.length;i++){
			var field = $(this.getItem(0)).find('div[data-item-id="' + valArray[i].id + '"]');
			if(field !=null && field.length>0){
				if(field[0] && field[0].parentCt){
					field[0].parentCt.setValue(valArray[i].value);
				} 
			}
		}
	},
	getComponent: function(index){
		return this.items[index];
	},
	findSubForms: function(){
		var compArr = $(this.wrapperPanel).find('[data-item-id]').filter(function(){
			if(this.parentCt){
				if(this.parentCt.multiFormInd){
					return true}}});
		var subforms=[];
		for(var i=0; i<compArr.length;i++){
			subforms[i] = compArr[i].parentCt;
		}
		return subforms;
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
	 * @method 		handleSubForm
	 * @memberof 	"canvas.lib.FormWrapper"
	 * @description This method calls the form container component if formdata is present.
	 */
	handleSubForm : function(config,meta){
		var cons = cbx.form.constants;		
		config.formData.insertDirection = config.formConfig.direction;
		this.getForm()[0].parentCt.pushForm(config.formData);
	}
});

CLCR.registerCmp({'COMP_TYPE':'FORM_WRAPPER'}, canvas.lib.FormWrapper);