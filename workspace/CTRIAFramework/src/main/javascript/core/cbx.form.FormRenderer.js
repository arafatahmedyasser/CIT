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
cbx.ns('cbx.form');
/**
 * 
 */
cbx.form.FormRenderer = Class(cbx.Observable, {
	/**
	 * 
	 */
	constructor : function(formManager, callBackHandler, formConfig) {
		this.fm = formManager;
		this.formConfig = formConfig;
		var formId = this.formConfig ? this.formConfig.formId : this.fm.formId;
		this.callBackHandler = callBackHandler;
		formId = formId || this.fm.formId;
		cbx.form.FormRegistery.getFormMetadata(formId, this.registryCallback,this, this.fm);
	},
	/**
	 * 
	 */
	registryCallback : function(formMetadata) {
		var config = {
			mode : this.formConfig ? this.formConfig.mode : this.fm.mode,
			model : this.fm.model,
			screenView : this.fm.screenView,
			metadata : formMetadata,
			manager : this.fm,
			preInitConfig : this.fm.preInitConfig,
			formId : this.formConfig ? this.formConfig.formId : this.fm.formId
		};
		var formCreatr = new cbx.form.FormCreator(config);
		var formProcessedMetadata = {
			formTitle : formMetadata.formTitle,
			formDesc : formMetadata.formDesc,
			bundleKey : formMetadata.bundleKey,
			/**
			 * Processing the path of form logo as form metadata and attaching
			 * it with form config
			 */
			formLogo : formMetadata.formLogo
		};
		formProcessedMetadata.layoutConf = formCreatr.getLayoutConfig();
		formProcessedMetadata.formData = formCreatr.getForm();
		if (this.formConfig) {
			formProcessedMetadata.formConfig = this.formConfig
		}
		this.callBackHandler.apply(this.fm, [ formProcessedMetadata ]);
		delete this.fm;
		delete this.callBackHandler;
		delete this.formConfig;
	}

});