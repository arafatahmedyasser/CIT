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
 * The Class incharge of making the server call with the 
 * FormScreenView Data to print or Export the form
 * The EXPORT_FORMAT goes as FORMPDF for PDF and FORMHTML for printing
 * The productCode and subProductCode is defaulted as CUSER.
 * 
 */
cbx.form.FormExportManager = function() {
	/**
	 * 
	 */
	this.FSV = {};
	/**
	 * 
	 */
	this.exportType ='';
	/**
	 * 
	 */
	this.widgetLength = 0;
	/**
	 * 
	 */
	this.widgetIndex = 0;
	
	/**
	 * The Method widgetExport which gets called recursively from the formExport method
	 * for all the widgets configured within the forms
	 */
	this.widgetExport = function() {
		if ((this.widgetIndex >= this.widgetLength)|| ('PDF' != this.exportType  &&  'HTML' != this.exportType)) {
			this.formExportAjax();
		} 
		else {
			this.widgetIndex = this.widgetIndex + 1;
			var params = this.FSV['widgetIds'][this.widgetIndex - 1]['exportParams'];
			if(!cbx.isEmpty(params) && !cbx.isEmpty(params[0])){
				params[0][iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
				Ext.Ajax.request({
						params : params[0],
						url : iportal.workspace.metadata.getContextRoot()+'/ExportServiceServlet',
						success : function(resp, options) {
							var respOb = Ext.decode(resp.responseText);
							fileName = respOb.FilePath;
							this.FSV['widgetIds'][this.widgetIndex - 1]['exportFileName'] = fileName;
							this.widgetExport.call(this);
						},
						failure : function(resp, options) {
							this.widgetExport.call(this);
						},
						scope : this
					});
			}else{
				this.widgetExport.call(this);
			}
		}
	};
	
	/**
	 * The Method formExport method incharge of exporting in the forms
	 */
	this.formExport = function(exportType, FSV) {
		if (!Ext.isEmpty(FSV)) {
			this.FSV = FSV;
			this.exportType = exportType;
			this.widgetLength = FSV.widgetIds.length;
			this.widgetExport.call(this);
		}
	};

	/**
	 * The Ajax call incharge of form export done by creating the form tag in the JSP
	 * and deleting it.
	 */
	this.formExportAjax = function() {
		var params = {};
		params['PAGE_CODE_TYPE'] = 'EXPORT_FORM_ACTION';
		params['PRODUCT_NAME'] = 'CANVAS';
		params['INPUT_SUB_PRODUCT'] = 'CANVAS';
		params['INPUT_FUNCTION_CODE'] = 'VSBLTY';
		params['INPUT_ACTION'] = 'EXPORT_FORM_ACTION';
		params['EXPORT_FORMAT'] = 'FORM' + this.exportType;
		params['EXPORT_DATA'] = cbx.encode(this.FSV);
		params[iportal.systempreferences.getCSRFKeyName()] = iportal.systempreferences.getCSRFUniqueId();
		var path = iportal.workspace.metadata.getContextRoot()+"/ExportServiceServlet";
		var method = "post";
		var form = document.createElement("form");
		form.setAttribute("method", method);
		form.setAttribute("action", path);
		form.setAttribute("target", "_blank");
		if (!Ext.isEmpty(params)) {
			for ( var i in params) {
				var hiddenField = document.createElement("input");
				hiddenField.setAttribute("type", "hidden");
				hiddenField.setAttribute("name", i);
				hiddenField.setAttribute("value", params[i]);
				form.appendChild(hiddenField);
			}
		}
		document.body.appendChild(form);
		try {
			form.submit();
			form.parentNode.removeChild(form);
		} catch (e) {

		}
	}
};
