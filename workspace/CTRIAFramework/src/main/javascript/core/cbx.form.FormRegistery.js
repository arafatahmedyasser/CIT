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
cbx.form.FormRegistery = function (){


	/**
	 * 
	 */
	var register = {};
	/**
	 * 
	 */
	var requestQueue = {};
	
	return {
		/**
		 * 
		 */
		addFormDef : function (formId, formDef){
			register[formId] = formDef;
		},
		getFormDef : function (formId){
			return register[formId]; 
		},
		
		/**
		 * This method clears the request queue.
		 */
		clearRequestQueue : function()
		{
			requestQueue = {};
		},
		
		/**
		 * Method written to globally replace all the orrucances of a string
		 * pattern and replace it with the provided string value.
		 */
		replaceAll : function replaceAll (find, replace, str){
			return str.replace(new RegExp(find, 'g'), replace);
		},
		
		/**
		 * Update the meta data response received by the server by exploding it
		 * in to more verbose form.
		 */
		explodeMD : function (rawStr){
			var mdMap = cbx.form.MetaDataMap;
			if(typeof rawStr!="string"){
				rawStr=cbx.encode(rawStr);
			}
			for (i in mdMap) {
				rawStr = CFR.replaceAll('"'+i+'":', '"'+mdMap[i]+'":', rawStr);//Combo_Values_set_with_wrong_values
			}
			
			return rawStr;
		},
		/**
		 * 
		 */
		getFormMetadata : function (formId, successHandler, handlerScope, manager){
			if (register[formId] != null) {
				/**
				 * checking if the form contains a additional data driven fields
				 * with chache flag as 'N'
				 */
				var formMeta = register[formId];
				if (formMeta.addDataDrivenItems && formMeta.addDataDrivenItems.length > 0) {
					/**
					 * Making AJAX calls for bringing additional data for all
					 * the fields whose data is not cached
					 */
					var len = formMeta.addDataDrivenItems.length;
					var itemCount = 0;
					var fieldsConfig = {};
					var fieldObj = null;
					for ( var i = 0; i < len; i++) {
						fieldsConfig['FIELD_' + (itemCount)] = formMeta.addDataDrivenItems[i];
						/**
						 * Deleting the additional info data already
						 * cached in the registry to be replaced by the AJAX
						 * response later.
						 */
						delete formMeta.additionalData[formMeta.addDataDrivenItems[i]];
						itemCount++;
					}
					if (itemCount > 0) {
						var params = {
							INPUT_ACTION : 'GET_ADDITIONAL_DATA_ACTION',
							INPUT_FUNCTION_CODE : 'VSBLTY',
							INPUT_SUB_PRODUCT : 'CUSER',
							PAGE_CODE_TYPE : 'FDF_CODE',
							PRODUCT_NAME : 'CUSER',
							FORM_ID : formId,
							ADD_DATA_ITEM_IDS : cbx.encode(fieldsConfig),
							ADD_DATA_ITEM_COUNT : itemCount,
							JSON_TO_HASH_MAP_SUPPORT_FLAG : 'ADD_DATA_ITEM_IDS',
							forceCallbacks : true,
							__FRAMEWORK_REQUEST : true
						};
						if (manager != null && manager.extraParams != null) {
							cbx.apply(params, manager.extraParams); 
						}
						params["__PIGGYBACKREQUEST"]="Y";
						var queueId = cbx.encode(params);
						if (requestQueue[queueId] == null) {
							requestQueue[queueId] = true;
							var cachedFlag=false;
							/**
							 * Reusable data retreival utility function ,Checking the FORM_ADD_DATA metadata type for the
							 * corresponding widgetId param from the local store which prefers SQL-Lite database in case of
							 * hybrid mode else browser supported database if enabled or browser supported local storage or
							 * global storage follows in this sequence for execution.If the local cached data is available then
							 * the metadata is loaded from the local cache .If the local cached data is not
							 * available(Empty/Error/None of the above Storages supported) then the metadata is fetched from
							 * server. This local store metadata fetching is made async due to database transaction result set
							 * retreivals are designed in async manner but need not be for other storages(local/global) but
							 * still following the same for coherence.
							 * 
							 * @param {String} metadata type
							 * @param formId
							 * @param {Function} callback handler for fetching the metadata from local store.
							 */
								canvas.metadata.getMetaData("FORM_ADD_DATA",formId,function(metadatavalue){
									if(!cbx.isEmpty(metadatavalue) && canvas.env.network.getState()!='ACTIVE'){
										try{
											var additionalObj=cbx.decode(metadatavalue);	
											cachedFlag=true;
											var intervalTime=10;
											if(Persist && Persist.type=="whatwg_db"){
												intervalTime=50;
											}
											else if(Persist && Persist.type=="localstorage" || Persist.type=="globalstorage"){
												intervalTime=300;
											}
											setTimeout(function(){
											if (additionalObj.additionalData != null) {
												var len = formMeta.addDataDrivenItems.length;
												var field = null;
												for ( var i = 0; i < len; i++) {
													field = formMeta.addDataDrivenItems[i];
													if (additionalObj.additionalData[field] != null) {
														formMeta.additionalData[field] = additionalObj.additionalData[field];
													}
												}
											}
											delete requestQueue[queueId];
										}, intervalTime);
											}
											catch (e) {
												LOGGER.error('Error while fetching Form cached data', e);
												cachedFlag=false;
											}
									}
									if(!cachedFlag){
							cbx.ajax({
								params : params,
											failureMessage:false,
								success : function(result) {
												var additionalObj=null;
												try{
									var responseText = cbx.form.FormRegistery.explodeMD(result.response);
									var data = cbx.decode(responseText);
												additionalObj = data.value.HEADER_FORM_METADATA;
												}catch(err){
													if(!cbx.isEmpty(metadatavalue)){
														 additionalObj=cbx.decode(metadatavalue);		
													}
												}
												setTimeout(function(){
													try{
														/**
														 * Reusable data retreival utility function for storing the server fetched metadata
														 * in to the local store with a time out of 100 ms, metadata will be stored only if
														 * the local store exists and this will be used later for the retreival process on
														 * necessity. This is more like persisting data to load the application faster on
														 * next visit and too for enabling a web site or web application to function without
														 * a network connection
														 * 
														 * @param {String} FORM_ADD_DATA metadata type
														 * @param {Object} The object which hold formId,received server
														 *            responseValue,server responseTime
														 */
													canvas.metadata.storeMetaData("FORM_ADD_DATA",{id:formId,value:additionalObj,serverdatetime:result.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
													}
													catch (e) {
														LOGGER.error('Error while storing data cache', e);
													}
												},100);
									if (additionalObj.additionalData != null) {
										var len = formMeta.addDataDrivenItems.length;
										var field = null;
										for ( var i = 0; i < len; i++) {
											field = formMeta.addDataDrivenItems[i];
											if (additionalObj.additionalData[field] != null) {
												formMeta.additionalData[field] = additionalObj.additionalData[field];
											}
										}
									}
									successHandler.apply(handlerScope, [  cbx.clone(formMeta)]);
									delete requestQueue[queueId];
								},
								failure : function(result, request) {
									delete requestQueue[queueId];
									LOGGER.error("getFormMetadata :: AJAX Failure");
								}
							});
						}
								},this);
						}
					}
					else {
						LOGGER.info("No data fetch is needed");
					}
				}
				else{
					successHandler.apply(handlerScope, [  cbx.clone(formMeta)]);
				}
			} 
				else{
				var cachedFlag=false;
				/**
				 * Reusable data retreival utility function ,Checking the FORM metadata type for the
				 * corresponding widgetId param from the local store which prefers SQL-Lite database in case of
				 * hybrid mode else browser supported database if enabled or browser supported local storage or
				 * global storage follows in this sequence for execution.If the local cached data is available then
				 * the metadata is loaded from the local cache .If the local cached data is not
				 * available(Empty/Error/None of the above Storages supported) then the metadata is fetched from
				 * server. This local store metadata fetching is made async due to database transaction result set
				 * retreivals are designed in async manner but need not be for other storages(local/global) but
				 * still following the same for coherence.
				 * 
				 * @param {String} metadata type
				 * @param formId
				 * @param {Function} callback handler for fetching the metadata from local store.
				 */
				canvas.metadata.getMetaData("FORM",formId,function(metadatavalue){
					if(!cbx.isEmpty(metadatavalue)){
						try{
							cachedFlag=true;
							var data = cbx.decode(metadatavalue);
							cbx.form.FormRegistery.addFormDef(formId, data);	
							setTimeout(function(){
							successHandler.apply(handlerScope, [  cbx.clone(cbx.form.FormRegistery.getFormDef(formId))]);
							},100);
				}
							catch (e) {
								LOGGER.error('Error while fetching Form cached data', e);
								cachedFlag=false;
							}
			} 
					if(!cachedFlag){
				var params={
					INPUT_ACTION : 'INIT_FORM_HEADER_ACTION',
					INPUT_FUNCTION_CODE : 'VSBLTY',
					INPUT_SUB_PRODUCT : 'CUSER',
					PAGE_CODE_TYPE : 'FDF_CODE',
					PRODUCT_NAME : 'CUSER',
					FORM_ID : formId,
					forceCallbacks : true,
					__FRAMEWORK_REQUEST : true
				};
				if (manager != null && manager.extraParams != null) {
					cbx.apply(params, manager.extraParams);
				}	
				params["__PIGGYBACKREQUEST"]="Y";  
				cbx.ajax({
					params : params,
					success : function(result, request) {
						var responseText = cbx.form.FormRegistery.explodeMD(result.response);
						var data = cbx.decode(responseText);
						var formArr = data.value.HEADER_FORM_METADATA;
						for ( var i = 0; i < formArr.length; i++) {
							if (!cbx.isEmpty(formArr[i])) {
								cbx.form.FormRegistery.addFormDef(formArr[i].formId, formArr[i]);
												try{
													/**
													 * Reusable data retreival utility function for storing the server fetched metadata
													 * in to the local store, metadata will be stored only if
													 * the local store exists and this will be used later for the retreival process on
													 * necessity. This is more like persisting data to load the application faster on
													 * next visit and too for enabling a web site or web application to function without
													 * a network connection
													 * 
													 * @param {String} FORM metadata type
													 * @param {Object} The object which hold formId,received server
													 *            responseValue,server responseTime
													 */
												canvas.metadata.storeMetaData("FORM",{id:formArr[i].formId,value:formArr[i],serverdatetime:result.HEADER_VALUE.TXN_PROCESS_DATE_TIME});
							}
												catch (e) {
													LOGGER.error('Error while storing Form data cache', e);
						}
											}
										}
						successHandler.apply(handlerScope, [  cbx.clone(cbx.form.FormRegistery.getFormDef(formId))]);
					},
					failure : function(result, request) {
						LOGGER.error("getFormMetadata :: AJAX Failure");
					}
				});
					}
				},this);
			}
		}
	};

}();
/**
 * 
 */
CFR = cbx.form.FormRegistery; 
/**
 * This maps is expected to have the one on one mapping for all the attributes
 * of form metadata. In case, a new attribute is added respective entry in this
 * map should be made.
 */
cbx.form.MetaDataMap = {
			"a1" : "anchor",
			"a2" : "appendCurrMode",
			"a3" : "additionalData",
			"a4" : "addDataDrivenItems",
			"b1" : "bundleKey",
			"c1" : "cacheDataInd",
			"c2" : "channelId",
			"c3" : "collapsibelInd",
			"c4" : "colSpan",
			"c5" : "columnType",
			"c6" : "conditionalInd",
			"c7" : "containerInd",
			"c8" : "ctxContainerInd",
			"d1" : "displayNmKey",
			"d2" : "dsKeyColumnId",
			"d3" : "dsValueColumnId",
			"d4" : "dsViewId",
			"e1" : "editableInd",
			"f1" : "formId",
			"f2" : "formDesc",
			"f3" : "formTitle",
			"f4" : "formLogo",
			"f5" : "formInd",
			"h1" : "hideLabel",
			"h2" : "highlightHolidaysInd",
			"i1" : "includeSelectInd",
			"i2" : "itemId",
			"i3" : "itemType",
			"i4" : "initialMultiplicity",
			"l1" : "labelAlignType",
			"l2" : "layout",
			"l3" : "linkedCurrComp",
			"l4" : "lookupInd",
			"m1" : "maxCharsPerLine",
			"m2" : "maxLength",
			"m3" : "maxNumLines",
			"m4" : "minLength",
			"m5" : "multiLangInd",
			"p1" : "parentId",
			"p2" : "plainLbl",
			"p3" : "printReqInd",
			"r1" : "rawKeys",
			"r2" : "rawValues",
			"r3" : "readOnlyInd",
			"r4" : "requiredInd",
			"r5" : "resizableInd",
			"r6" : "rowSpan",
			"s1" : "supportedMimeTypes",
			"t1" : "totalColumns",
			"t2" : "toggleInd",
			"v1" : "validOnSwitchInd",
			"v2" : "visibleInd",
			"v3" : "vType",
			"w1" : "widgetFunctionCode",
			"w2" : "widgetId",
			"w3" : "widgetProductCode",
			"w4" : "widgetSubProductCode",
			"children" : "children",
			"r7":"rawKey",
			"r8":"rawValue",
			"p4":"labelCharCount",
			"c9":"copyPasteInd",
			"c10":"channelId"
			
};
