/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
cbx.ns('canvas.lib.view');
/**
 * 
 */
canvas.lib.view.TemplateViewPanel = Ext.extend(Ext.Panel, {
	productCode : "CANVAS",
	subProductCode : "CUSER",
	functionCode : "VSBLTY",
	emptyViewId : Ext.id,
	resourceBundleKey : null,
	extraParamsHandler : null,
	recordType : [],
	store : null,
	layout : 'fit',
	emptyJson : null,
	emptyTitle : null,
	chartH : 0,
	chartW : 0,
	mvConf : null,
	initCollapsed : false,
	loadHandler : Ext.emptyFn,
	emptyTextMsg : null,
	initComponent : function ()
	{
		this.templateConfig = this.viewConf.VIEW_MD.TEMPLATE_CONFIG
		this.templateConfig = this.templateConfig.replace('{FRAMEWORK}','ext');
		
		var rb = CRB.getFWBundle();		
		this.emptyTextMsg = rb.NO_DATA_MSG;
		var defaultConfig = {
			xtype : 'panel',
			//title: 'Tempalte View',
			border : true,
			layout : 'fit',			
			autoScroll : true,
			autoWidth : true,
			html: "Loading..."		
		};
		this.on("afterRender", this.initElements, this);				
		Ext.apply(this, defaultConfig);
		canvas.lib.view.TemplateViewPanel.superclass.initComponent.apply(this);
	},
	initElements : function(){	
		var appDataParams = {
			//"__LISTVIEW_REQUEST" : "Y",
			"PAGE_CODE_TYPE" : 'VDF_CODE',
			"INPUT_ACTION" : "INIT_DATA_ACTION",
			"INPUT_PRODUCT" : this.productCode,
			"PRODUCT_NAME" : this.productCode,
			"INPUT_FUNCTION_CODE" : this.functionCode,
			"INPUT_SUB_PRODUCT" : this.subProductCode,
			"WIDGET_ID" : this.widgetId,
			"VIEW_ID" : this.viewConf.VIEW_MD.SYSTEM_VIEW_ID,
			"__PIGGYBACKREQUEST" : "Y"
		};
		var that = this;
		Ext.Ajax.request({
			params : appDataParams,
			success : function(metadata){
				metadata = Ext.decode(metadata.responseText);
				var allRecords = !cbx.isEmpty(metadata.response.value.ALL_RECORDS)?metadata.response.value.ALL_RECORDS:[];
				that.allRecords  = cbx.clone(allRecords);
				that.mvConf.fireEvent("beforetemplateload", that,allRecords);
				//that.applyDataToTemplate(that, allRecords);
			},
			failure : function(){
				LOGGER.error("Error while fetching data for template.");
			}
		});		
	},
	applyDataToTemplate : function(scope, data){
		Ext.Ajax.request({
			method : "GET",	
			params : {},
			panelObj : scope,
			responseContentType : 'html',
			url : scope.templateConfig,
			success : function(response,options){
				options.panelObj.templateContent = response.responseText;
				var tpl = new Ext.Template(options.panelObj.templateContent);
				tpl.compile();
				options.panelObj.update(tpl.applyTemplate(data));				
				options.panelObj.mvConf.fireEvent("aftertemplateload", options.panelObj, tpl, data);
				//tpl.overwrite(options.panelObj.body, data);
			},
			failure : function(response,options){
				LOGGER.error("Error while reading a template file");
			}
		});
	},
	updateHeight : function(height){
		this.setHeight(height);
		this.getComponent(0).setHeight(height);
	}
});
// register xtype to allow for lazy initialization
Ext.reg('template-view', canvas.lib.view.TemplateViewPanel);

