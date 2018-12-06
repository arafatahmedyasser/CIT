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
 * @description The utility class which handles the click operations of apps in
 * app containers
 * 

 */
cbx.lib.appContainerHandler = Class(cbx.Observable, {
	appObj : null,
	appMetadata : null,
	constructor : function(config){
		this.appMetadata = config.appDetails;
		var attachHandlers = function(){
			var config ={};
			var md = this.appMetadata
			var selector = ACHR.getHandler(md.APP_ID);
			if(md.APP_TYPE === "FORM" && md.RENDERER_TYPE ==="INLINE"){
				if(selector){
					config.recordSelect = selector();
				}
				//cbx.AppContainerUtil.launchService(md.WORKSPACE_ID,md.LAYOUT_ID,md.WIDGET_ID,md.SERVICE_ID,config); 
				if(md.WIDGET_ID){
					var initDataAjax = function(response){
						viewMd = response.md;
						if(viewMd){
							var params = {
									"__LISTVIEW_REQUEST" : "Y",
									"PAGE_CODE_TYPE" : 'VDF_CODE',
									"INPUT_ACTION" : "INIT_DATA_ACTION",
									"INPUT_PRODUCT" : viewMd.VIEW_MD.PRODUCT_CODE,
									"PRODUCT_NAME" : viewMd.VIEW_MD.PRODUCT_CODE,
									"INPUT_FUNCTION_CODE" : viewMd.VIEW_MD.FUNCTION_CODE,
									"INPUT_SUB_PRODUCT" : viewMd.VIEW_MD.SUB_PRODUCT_CODE,
									"WIDGET_ID" : md.WIDGET_ID,
									"VIEW_ID" : viewMd.VIEW_MD.SYSTEM_VIEW_ID,
									
									"LAYOUT_ID" :iportal.workspace.metadata.getCurrentLayoutId(),
									"WORKSPACE_ID" :iportal.workspace.metadata.getCurrentWorkspaceId()
									
							};
							cbx.ajax({
								params : params,
								misc:{
									scope:this,
									config:config,
									viewMd : viewMd
								},
								success : function(metadata){
									try{
										if(metadata.response.value.ALL_RECORDS && metadata.response.value.ALL_RECORDS.length>0){
											var record;
											if(cbx.isFunction(this.misc.config.recordSelect)){
												var recordArray= $.grep(metadata.response.value.ALL_RECORDS,this.misc.config.recordSelect);
												record= recordArray.length>0?recordArray[0]:recordArray
											}
											record = !cbx.isEmpty(record)?record:metadata.response.value.ALL_RECORDS[0];
											if(md.SERVICE_ID){
												var options ={
														"showContextIcon":false,
														"menuStyle":"icon"
												};
												cbx.contextMenuRenderer.getContextMenu(this.misc.viewMd.VIEW_MD.VIEW_ID,record,null,options)
												var handler = CMHR.getHandler(md.SERVICE_ID);
												if(!cbx.isEmpty(handler)){
													var that = this
													CBXDOWNLOADMGR.requestScripts(this.misc.scope.getScriptsForDownload(md.WORKSPACE_ID),function(){
														
														/**
														 * Added for ext-compatibility
														 */
														var config = {};
														config.menuData = cbx.contextMenuRenderer.generateMenusFor(record,that.misc.viewMd.VIEW_MD.VIEW_ID,
																md.SERVICE_ID,options)
														config.record = {};
														config.viewId = that.misc.viewMd.VIEW_MD.VIEW_ID;
														config.record.data = record;
														CMHR.executeHandler(md.SERVICE_ID,config)
													});
												}
											}
										}
									}
									catch(e)
									{
										LOGGER.error(e);
									}
									//callback.apply(scopeHandler,[metadata.response.value.ALL_RECORDS]);
								}
							});
						}
					}
					cbx.core.app.model.getAppMetadata(md.WIDGET_ID,1,initDataAjax,this);
				}
				
			}
			else if(md.APP_TYPE === "FORM" && md.RENDERER_TYPE ==="WINDOW"){
				CBXDOWNLOADMGR.requestScripts(this.getScriptsForDownload(md.WORKSPACE_ID),function(){
					if(selector && cbx.isFunction(selector)){
						selector();
					}
					
				});
			}
				
			else if(md.APP_TYPE === "WIDGET"){
				cbx.core.dynamicWidgetManager({
					widgetId:md.WIDGET_ID,
					renderTo : md.RENDERER_TYPE
					});
			}
			else if(!cbx.isEmpty(md.WORKSPACE_ID)){
				cbx.lib.workspacehandler.activateWorkspace(md.WORKSPACE_ID)
			}
		
		}
		attachHandlers.apply(this);
	},
	getScriptsForDownload : function(wsId){
		var scripts;
		if(!cbx.isEmpty(wsId)){
			scripts = cbx.downloadProvider.getMergedArray(["TFD","WSPACE_"+wsId]);
		}
		else{
			scripts = cbx.downloadProvider.getConstant("TFD");
		}
		return scripts
	}
});
