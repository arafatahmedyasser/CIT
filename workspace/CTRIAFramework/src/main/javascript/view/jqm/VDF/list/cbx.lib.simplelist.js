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
cbx.lib.simplelist = Class(cbx.core.Component, {
	//Global parameters
	md: '',
	bd: '',
	parent: null,
	viewMD: null,
	widgetID: '',
	constructor: function(conf) { 
		this.md = conf.md;
		this.viewMD = this.md.VIEW_MD;
		this.widgetID = conf.widgetId;
		this.parent = conf.appendTO;
		this.getListBusinessData(this.initiateListComponent);
	},
	getListBusinessData: function(callback) {
		var that = this;
		var params = {
				"__LISTVIEW_REQUEST" : "Y",
				"PAGE_CODE_TYPE" : 'VDF_CODE',
				"INPUT_ACTION" : "INIT_DATA_ACTION",
				"INPUT_PRODUCT" : that.md.PRODUCT_CODE,
				"PRODUCT_NAME" : that.md.PRODUCT_CODE,
				"INPUT_FUNCTION_CODE" : that.md.FUNCTION_CODE,
				"INPUT_SUB_PRODUCT" : that.md.SUB_PRODUCT_CODE,
				"WIDGET_ID" : that.widgetID,
				"VIEW_ID" : that.md.SYSTEM_VIEW_ID
		};
		var extraparams = that.extraParamsHandler?that.extraParamsHandler.apply(that.scope,[params]):params
				
		if(!cbx.isEmpty(extraparams)){			
			cbx.apply(params,extraparams);
		}
		
		cbx.ajax({
			params : params,
			success : function(metadata){
				if(metadata.response!=undefined){
					callback.apply(that,[metadata.response.value.ALL_RECORDS]); 	
				}
				else{
					callback.apply(that,[]); 	
				}						
			}
		});
	},
	initiateListComponent: function(data) {
		if( typeof data !== 'undefined' ) {
			var config = {'md' : this.md, 'bd': data, 'parent': this.parent, 'widgetID': this.widgetID};
			new cbx.lib.view.simplelist(config);
		}	
	}	
});	