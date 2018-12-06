
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

canvas.lib.FormPanel = Class( cbx.core.Component, {
	/**
	 * @class 		"canvas.lib.FormPanel"
	 * @extends		"cbx.core.Component"
	 * @description The initialize function creates the DOM structure for Form Panel and 
	 * 				renders the form components by calling the respective form container.
	 */
	intialConfig: null,
	formManager: null,
	formContainer: null,
	addFormQueue : {},
	initialize: function() {
		this.intialConfig = this;
		this.formManager = this.scope;
		var panelType = this.scope.lazzyFormPanel ? 'div' : 'form';
		var formContainerConfig = {
			'eleType': panelType,
			'data-item-id': this.intialConfig.formData.formId,
			'class':'ct-form ct-form-tm',
			'autocomplete':'off'
		}
		this.formContainer = new cbx.lib.layer(formContainerConfig).getLayer();
		this.addItem(this.formContainer);
		/*
		 * 	Checks whether the logo for form is present.
		 */
		if(!cbx.isEmpty(this.formLogo)) {
			this.createFormLogo();			
		}
		this.createItems();
	},
	/**
	 * @method 		createFormLogo
	 * @memberof 	"canvas.lib.FormPanel"
	 * @description This method adds the logo for form panel.
	 */
	createFormLogo: function() {
			var logoPath = this.formLogo;
			var logoContainerConfig =  new cbx.lib.layer({
				'eleType': 'div',
				'class': 'col-lg-12 col-md-12 col-sm-12 col-xs-12 ct-form__logo'
			}).getLayer();
			var logoConfig = new cbx.lib.layer({
				'eleType': 'img',
				'class': 'img-responsive ct-form__logo-img',
				'src': logoPath
			}).getLayer();
			$(logoContainerConfig).append(logoConfig);
			$(this.formContainer).append(logoContainerConfig);
	},
	/**
	 * @method 		createItems
	 * @memberof 	"canvas.lib.FormPanel"
	 * @param		formData - {Object} Form details
	 * @description This method calls the form container component if formdata is present.
	 */
	createItems: function(formData){
		var formData = formData?formData:this.intialConfig.formData;
		if(typeof this.intialConfig.formData !== 'undefined'){
			var cClass = CFCR.getFormCmp({'COMP_TYPE':formData.xtype});
			if (cClass) {
				new cClass({
					'parentContainer':this.formContainer,
					'formData':formData,
					'formManager': this.formManager,
					'mode':formData.mode ? formData.mode:this.formManager.mode
				});
			}
		}
	},

	/**
	 * @method 		pushForm
	 * @memberof 	"canvas.lib.FormPanel"
	 * @param		formData - {Object} Form details
	 * @description This method calls the form container and triggers create for the form items creation
	 */
	pushForm : function(formData){
		
		this.createItems(formData);
		$(this.formContainer).trigger("create");
	}
}); 
/**
 * 	Registering the component.
 */
CLCR.registerCmp({'COMP_TYPE':'FORM_PANEL'}, canvas.lib.FormPanel);