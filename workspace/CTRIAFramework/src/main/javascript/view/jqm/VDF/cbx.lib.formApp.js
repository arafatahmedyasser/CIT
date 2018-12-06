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
 * @description The class which is responsible for form view rendition
 * 
 
 */
cbx.lib.formView = Class(cbx.core.Component, {
	formId : null,
	widgetId : null,
	fmObj : null,
	appEvents : null,
	constructor: function(config) {
		this.formId = config.formId;
		this.widgetId = config.widgetId;
		this.fmObj = null;
		this.appEvtRegistry = config.appEvents;
		cbx.lib.formView.$super.call(this);
	},
	renderFormView : function(){
		var that = this;
		this.fmObj = new cbx.form.FormManager({
			formId : that.formId,
			model : {},
			listeners : {
				'initialized' : function (manager){
					var parentMV = that.appEvtRegistry.getMVObj();
					parentMV.raiseEvent('forminitialized', manager);
					
				},
				'formbeforeinitialize' : function (manager){
					var parentMV = that.appEvtRegistry.getMVObj();
					parentMV.raiseEvent('formbeforeinitialize', manager);
				}
				
			}
		});
		return this.fmObj;
	},
	getViewDomWrapper: function(){
	return this.fmObj.wrapperPanel.parentNode.parentNode;
	}
})
CLCR.registerCmp({'COMP_TYPE':'FORM'}, cbx.lib.formView);