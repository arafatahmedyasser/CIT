/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
/**
 * This is the class which will perform the metadata sync, being able to work offline is an expected feature of mobile
 * applications. For data-driven applications, it means end application framework will have to store (a subset of)
 * canvas application metadata locally, and implement a data synchronization mechanism that keeps local and server data
 * in sync. The only piece of infrastructure need at the server side is an API that returns the items that have changed
 * (created, updated, or deleted) since a specific moment in time expressed as a timestamp.The metadata sync trigger
 * check happens on per day schedule and this is global configurable for the end application.
 * <p>
 * Step 1:The comparison starts by checking the local time difference and synctime difference in mins and if it exceeds
 * one day the subsequent server request is made with local metadata cached list with the last synctime.
 * </p>
 * <p>
 * Step 2:on receiving the response additional comparison is made with the last sync time and server sync time due to
 * user may change his device data\Time settings prior to current day or ahead of current day and if the result
 * observeres a clear date\time diff of one day which is again configurable in mins.Then on a fresh metadata list
 * changes is requested and will be updated to the client storage.
 * </p>
 * </p>
 * The format of the data returned by the server is part of the contract between the client and the server. In this
 * application, the server returns the changes as an array of JSON objects. The canvas app server use to generate the
 * list of changes implementation manages a session-based data set that provides an isolated and transient playground.
 *
 * @note This solution currently supports unidirectional (server to client) metadata synchronization. It could easily be
 *       expanded to support bidirectional synchronization
 */
(function() {
	cbx.ns('canvas.metadata');

	// Metadata Sync time delay in mins
	canvas.metadata.syncMetadataTimeDiff = 1440; // 24*60 min -- 1 Day

	/**
	 * This maps is expected to have the one on one mapping for all the attributes of form metadata. In case, a new
	 * attribute is added respective entry in this map should be made.
	 */

	var formMetaDataMap = {
				"a1": "anchor",
				"a2": "appendCurrMode",
				"a3": "additionalData",
				"a4": "addDataDrivenItems",
				"b1": "bundleKey",
				"c1": "cacheDataInd",
				"c2": "channelId",
				"c3": "collapsibelInd",
				"c4": "colSpan",
				"c5": "columnType",
				"c6": "conditionalInd",
				"c7": "containerInd",
				"c8": "ctxContainerInd",
				"d1": "displayNmKey",
				"d2": "dsKeyColumnId",
				"d3": "dsValueColumnId",
				"d4": "dsViewId",
				"e1": "editableInd",
				"f1": "formId",
				"f2": "formDesc",
				"f3": "formTitle",
				"f4": "formLogo",
				"f5": "formInd",
				"h1": "hideLabel",
				"h2": "highlightHolidaysInd",
				"i1": "includeSelectInd",
				"i2": "itemId",
				"i3": "itemType",
				"i4": "initialMultiplicity",
				"l1": "labelAlignType",
				"l2": "layout",
				"l3": "linkedCurrComp",
				"l4": "lookupInd",
				"m1": "maxCharsPerLine",
				"m2": "maxLength",
				"m3": "maxNumLines",
				"m4": "minLength",
				"m5": "multiLangInd",
				"p1": "parentId",
				"p2": "plainLbl",
				"p3": "printReqInd",
				"r1": "rawKeys",
				"r2": "rawValues",
				"r3": "readOnlyInd",
				"r4": "requiredInd",
				"r5": "resizableInd",
				"r6": "rowSpan",
				"s1": "supportedMimeTypes",
				"t1": "totalColumns",
				"t2": "toggleInd",
				"v1": "validOnSwitchInd",
				"v2": "visibleInd",
				"v3": "vType",
				"w1": "widgetFunctionCode",
				"w2": "widgetId",
				"w3": "widgetProductCode",
				"w4": "widgetSubProductCode",
				"children": "children",
				"r7": "rawKey",
				"r8": "rawValue",
				"p4": "labelCharCount",
				"c9": "copyPasteInd",
				"c10": "channelId"

	};

	// Class For displaying the modal dialog while loading or updating the metadata in local client storage.
	var cClass = CLCR.getCmp({
		'COMP_TYPE': 'METADATA_DIALOG'
	});

	// Instantialting the dialog class
	if (cClass) {
		var dailogRenderer = new cClass();
	}

	/**
	 * @Method showMessageMask
	 * @description This method displays the dialog window while updating or loading the metadata inside the local
	 *              client storage
	 * @access private
	 */
	var showMessageMask = function() {

		if (dailogRenderer) {
			dailogRenderer.showProgressBar();
		}

	};

	/**
	 * @Method hideMessageMask
	 * @description This method hides the dialog window after the metadata update is finished
	 * @access private
	 */
	var hideMessageMask = function() {

		if (dailogRenderer) {
			dailogRenderer.hideProgressBar();
		}

	};

	/**
	 * @Method validateSyncReady
	 * @description This method is used to invoke the validate the sync ready method in canvas class to continue loading
	 *              the component rendering after the DOMCONTENT loaded succesfully
	 * @access private
	 */
	var validateSyncReady = function() {
		hideMessageMask();
		cbx.validateSyncReady();
	};

	/**
	 * @Method completedMetadataUpdate
	 * @description This method is passed as a callback Fn to while storing the last metadata inside the local client
	 *              storage which inturn to validate the sync ready (validateSyncReady Fn) Also see
	 *              <ul>
	 *              <li>{@link #MetadataPersist} of {@link canvas.metadata.persist}</li>
	 *              </ul>
	 * @access private
	 * @param {Boolean} flag The last metadata update flag success/failure.
	 * @param {String} value THe last updated metadata value.
	 */
	var completedMetadataUpdate = function(flag, val) {
		retriever.setSyncProgress(false);
		validateSyncReady();

	};
	/**
	 * @Method retriever
	 * @description retriever function to communicate with the server to for validating and getting the metadata *
	 * @access private
	 */

	var retriever = function() {

		var syncInProgress = false; // Default value states sync is not yet happened

		/**
		 * @Method metadataSyncSucessFn
		 * @description Success callback function
		 * @access private
		 * @param {Object} scope This refers to callback scope
		 * @param {Function} successcallback This is the reference to the actual function that should be called back
		 * @param {Object} result The server response
		 */

		var metadataSyncSucessFn = function(scope, successcallback, result) {
			syncInProgress = true;

			if (cbx.isFunction(successcallback)) {
				successcallback.apply(scope || this, [result]);
			}

		};

		/**
		 * @Method metadataSyncFailureFn
		 * @description Failure callback function
		 * @access private
		 * @param {Object} scope This refers to callback scope
		 * @param {Function} successcallback This is the reference to the actual function that should be called back
		 * @param {Object} result The server response
		 */

		var metadataSyncFailureFn = function(scope, failurecallback, result) {
			syncInProgress = true;
			if (cbx.isFunction(failurecallback)) {
				failurecallback.apply(scope || this, [result]);
			}

		};

		/**
		 * @Method invokeMetadata
		 * @description Just make using the CBX Ajax function to communicate with the server.
		 *              <p>
		 *              The global Ajax request class that provides a simple way to make Ajax requests with maximum
		 *              flexibility.
		 *              </p>
		 * @access private
		 * @param {Object} metadataParams Params for ajax request
		 * @param {Object} scope This refers to callback scope
		 * @param {Function} successFn This is the reference to the actual function that should be called back
		 * @param {Function} failureFn This is the reference to the actual function that should be called back
		 * @param {Boolean} syncFlag true/false To display loadmask or not..Since we already show metadata dilaog no
		 *            need to show the load mask
		 */
		var invokeMetadata = function(metadataParams, scope, successFn, failureFn, syncFlag) {
			var params = {
						INPUT_LANGUAGE_ID: iportal.preferences.getPrimaryLang() || 'en_US'
			};
			canvas.apply(params, metadataParams);

			cbx.ajax({
				params: params,
				syncMode: cbx.isBoolean(syncFlag)?syncFlag :true,
				failureMessage: false,
				success: function(result) {

					metadataSyncSucessFn(scope, successFn, result);
					LOGGER.info('Success result', [result, cbx.encode(metadataParams)]);
				},
				failure: function(result) {
					metadataSyncFailureFn(scope, failureFn, result);
					LOGGER.error('Failure Error', [result, cbx.encode(metadataParams)]);

				}
			});

		};

		return {
			// MetaData type map
			getContainerMap: function(type) {
				var containerMap = {
							"FORM_CONTAINER": this.getFormContainerMetadata,
							"FORM": this.getFormMetadata,
							"WIDGET_MD": this.getWidgetBaseMetaData,
							"WIDGET": this.getWidgetMetaData,
							"MULTI_WIDGET": this.getMultiWidgetMetadata,
							"JSLOADER": this.getJSLoaderMetadata,
							"WORKSPACES": this.getWorkspacesMetadata,
							"MENU": this.getMenuMetadata,
							"ZOLOG": this.getZologMetadata,
							"APP_": this.getAppContainerMetadata,
							"ENTITLEMENT": this.getEntitlementMetadata,
							"PREFERENCES": this.getPreferencesMetadata,
							"GLOBAL_CURRENCY": this.getGlobalCurrMetadata,
							"JSRBL": this.getResourceBundleMetadata
				};
				return containerMap[type] || undefined;
			},
			// Getting the sync progress
			getSyncProgress: function() {

				return syncInProgress;
			},
			// Setting the sync progress
			setSyncProgress: function(progress) {

				syncInProgress = progress;
			},
			// Getting the sync metadata info(valiadate/getMetadata result)
			getSyncMetaDataInfo: function(params, scope, successFn, failureFn, syncFlag) {
				invokeMetadata(params, scope, successFn, failureFn, syncFlag);
			},

			// Getting the formcontainer metadata info
			getFormContainerMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("FORM_CONTAINER", {
						id: data[i].id,
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the JSLoader metadata info
			getJSLoaderMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("JSLOADER", {
						id: 'JSLOADER',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the Workspaces metadata info
			getWorkspacesMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("WORKSPACES", {
						id: 'WORKSPACES',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},

			// Getting the MENU metadata info
			getMenuMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("MENU", {
						id: 'MENU',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the ZOLOG metadata info
			getZologMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("ZOLOG", {
						id: 'ZOLOG',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the APP_CONTAINER metadata info
			getAppContainerMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("APP_CONTAINER", {
						id: 'APP_CONTAINER',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the ENTITLEMENT metadata info
			getEntitlementMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("ENTITLEMENT", {
						id: 'ENTITLEMENT',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the PREFERENCES metadata info
			getPreferencesMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("PREFERENCES", {
						id: 'PREFERENCES',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the GLOBAL_CURRENCY metadata info
			getGlobalCurrMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("GLOBAL_CURRENCY", {
						id: 'GLOBAL_CURRENCY',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},

			// Getting the JSRBL metadata info
			getResourceBundleMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("JSRBL", {
						id: 'JSRBL',
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}

			},
			// Getting the form metadata info
			getFormMetadata: function(data, servertime, scope, metadataLastUpdate) {

				var callbackFn = "";
				/**
				 * Method written to globally replace all the orrucances of a string pattern and replace it with the
				 * provided string value.
				 */
				var replaceAll = function replaceAll(find, replace, str) {
					return str.replace(new RegExp(find, 'g'), replace);
				};
				/**
				 * Update the meta data response received by the server by exploding it in to more verbose form.
				 */
				var explodeMD = function(rawStr) {
					var mdMap = formMetaDataMap;
					if (typeof rawStr != "string") {
						rawStr = cbx.encode(rawStr);
					}
					for (i in mdMap) {
						rawStr = replaceAll('"' + i + '":', '"' + mdMap[i] + '":', rawStr); // Combo_Values_set_with_wrong_values
					}

					return rawStr;
				};
				for (var fd = 0; fd < data.length; fd++) {

					var formArr = cbx.decode(data[fd].value);

					if (!cbx.isEmpty(data[fd].addData)) {
						var addDataValue = explodeMD(cbx.decode(data[fd].addData));
						canvas.metadata.storeMetaData("FORM_ADD_DATA", {
							id: data[fd].id,
							value: addDataValue,
							serverdatetime: servertime
						});
					}

					if (metadataLastUpdate && fd == data.length - 1 && 0 == formArr.length) {
						completedMetadataUpdate();
					}

					for (var k = 0; k < formArr.length; k++) {
						if (metadataLastUpdate && fd == data.length - 1 && k == formArr.length - 1) {
							callbackFn = completedMetadataUpdate;
						}
						if (!cbx.isEmpty(formArr[k])) {
							var formData = explodeMD(formArr[k]);
							canvas.metadata.storeMetaData("FORM", {
								id: formArr[k].f1,
								value: formData,
								serverdatetime: servertime
							}, callbackFn, scope);
						}
					}

				}

			},
			// Getting the widget container metadata info
			getWidgetBaseMetaData: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					canvas.metadata.storeMetaData("WIDGET_MD", {
						id: data[i].id,
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}
			},
			// Getting the widget metadata info
			getWidgetMetaData: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}
					var checkForCustomView = cbx.decode(data[i].value);
					if(cbx.isEmpty(checkForCustomView.VIEW_MD.FLD_TOOLS_LIST)){
						canvas.metadata.storeMetaData("WIDGET", {
							id: data[i].id,
							value: data[i].value,
							serverdatetime: servertime
						}, callbackFn, scope);	
					}
					else{
						if (checkForCustomView.VIEW_MD.FLD_TOOLS_LIST && !(checkForCustomView.VIEW_MD.FLD_TOOLS_LIST.indexOf('gear') > -1)) {
							canvas.metadata.storeMetaData("WIDGET", {
								id: data[i].id,
								value: data[i].value,
								serverdatetime: servertime
							}, callbackFn, scope);
						} else {
							if (metadataLastUpdate && i == data.length - 1) {
								completedMetadataUpdate();
							}
						}

					}

				}

			},
			// Getting the multi-widget metadata info
			getMultiWidgetMetadata: function(data, servertime, scope, metadataLastUpdate) {
				var callbackFn = "";
				for (var i = 0; i < data.length; i++) {
					if (!cbx.isEmpty(data[i].child_widget) && data[i].child_widget.type && data[i].child_widget.data) {
						var containertype = this.getContainerMap(data[i].child_widget.type);
						if (containertype && (cbx.isArray(data[i].child_widget.data) && data[i].child_widget.data.length > 0))
							containertype.call(this, data[i].child_widget.data, servertime)
					}
					if (!cbx.isEmpty(data[i].child_widget_md) && data[i].child_widget_md.type && data[i].child_widget_md.data) {
						var containertype = this.getContainerMap(data[i].child_widget_md.type);
						if (containertype && (cbx.isArray(data[i].child_widget_md.data) && data[i].child_widget_md.data.length > 0))
							containertype.call(this, data[i].child_widget_md.data, servertime)
					}

					if (metadataLastUpdate && i == data.length - 1) {
						callbackFn = completedMetadataUpdate;
					}

					canvas.metadata.storeMetaData("MULTI_WIDGET", {
						id: data[i].id,
						value: data[i].value,
						serverdatetime: servertime
					}, callbackFn, scope);
				}
			},
			/*
			 * This is the meethod iterates the metadata list and according to the metadata type evaluates the method
			 * types and invokes the appropriate type method with synctime as additional param to update the server time
			 * for each metadata type
			 */
			setMetadataCache: function(metadatalist, synctime) {
				var updateFlag = true;
				if (Persist.type == "localstorage" || Persist.type == "globalstorage" || Persist.type == "sessionstorage"){
					try{
					canvas.persist.getStore().set("QUOTA_SIZE","","AVAILABLE");	
					}catch(err){
					if(err.code==22 || err.code=="22" || err.name=="QUOTA_EXCEEDED_ERR")
					updateFlag=false;
					else
					updateFlag = true;
					}
				}
				if(!updateFlag){
					completedMetadataUpdate();
					return;
				}
				for (var i = 0; i < metadatalist.length; i++) {
					try {
						var metadata = metadatalist[i];
						if (metadata.type && this.getContainerMap(metadata.type) && (cbx.isArray(metadata.data) && metadata.data.length > 0))

							var containertype = this.getContainerMap(metadata.type);
						var updateFlag = false;
						if (i == metadatalist.length - 1) {
							updateFlag = true;
						}
						containertype.call(this, metadata.data, synctime, this, updateFlag);

					} catch (err) {
						updateFlag = false;
						LOGGER.error('Error while updting synmetadata', err)
					}

				}
				// Updating the latest synctime on the succcess of all metadata type update
				if (updateFlag) {
					canvas.metadata.updateSyncTime(synctime);
				}
			}

		};

	}();

	/**
	 * For invalid response from server either for validate sync list or retreiving the metadata info it clears all the
	 * client local storage
	 */
	var clearMetaDataCacheForInvalidResponse = function(response) {

		var invalidResponseFlag = false;
		var resp_object = !cbx.isObject(response) && !response.indexOf('<html>') == -1 ? cbx
					.decode(response.responseText) : response;
					if (resp_object.JSON_MAP && resp_object.JSON_MAP.response && resp_object.JSON_MAP.response.FATAL_ERROR) {
						invalidResponseFlag = true;

					} else if (resp_object.TRANSACTION_ERROR) {

						invalidResponseFlag = true;
					} else if (cbx.isString(response) && response.indexOf('<html>') != -1 || response.Status == "Session invalid") {
						invalidResponseFlag = true;
						if (iportal.systempreferences.isHybrid() == 'true') {
							location.href = "SESSION_EXPIRY.html";
						}
						document.write(response);

					}

					if (invalidResponseFlag){
						//canvas.metadata.removeAll();
					completedMetadataUpdate();
					}
	};
	
	/*
	 * Failure
	 * fn
	 * for
	 * validating
	 * the
	 * metadata
	 * sync
	 * listSuccess
	 * for
	 * validating
	 * the
	 * metadata
	 * sync
	 * list
	 */
	var failureFnForMetadata = function(result) {
		/*
		 * hide
		 * progress
		 * and
		 * tigger
		 * canvas.validateSyncReady
		 */
		completedMetadataUpdate();
	};
	/*
	 * Success
	 * function
	 * on
	 * getting
	 * the
	 * metadata
	 * synced
	 * list
	 */
	var successFnForMetadata = function(result) {
		LOGGER.info('metadataList Sucess Fn---------', result)
		if (!cbx.isEmpty(result.SEVER_SYNCTIME) && cbx.isArray(result.SYNC_METADATA) && result.SYNC_METADATA.length > 0) {
			retriever.setMetadataCache(result.SYNC_METADATA,result.SEVER_SYNCTIME);

		} else {
			clearMetaDataCacheForInvalidResponse(result);
		}
	}
	
	

	// Helper method to convert the date time string(Eg: 10/20/2015 12:12:15) to date
	var formatStringToDate = function(datetime) {
		var dateRegExp = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
		var dateArray = dateRegExp.exec(datetime);
		return new Date((+dateArray[3]), (+dateArray[2]) - 1, (+dateArray[1]), (+dateArray[4]), (+dateArray[5]), (+dateArray[6])).getTime();
	};

	// Actual synmetadat process which performs the syncing the metadata from server to the local client storage
	function syncMetadata() {
		var syncProgress = retriever.getSyncProgress();
		// Checking for network state and sync progress, when sync progress is false and N/W is active then continue
		// to perform sync logic
		if (canvas.env.network.getState() == 'ACTIVE' && !syncProgress) {
			retriever.setSyncProgress(true);
			// Method to get the latest synctime from local client storage
			canvas.metadata.getSyncTime(function(syncTime) {
				if (!cbx.isEmpty(syncTime)) {
					var resultInMinutes = -1
					try {
						var localTime = new Date().getTime();
						var minDiff = localTime - formatStringToDate(syncTime);
						/*
						 * This will get time difference in milliseconds
						 */
						 resultInMinutes = Math.round(minDiff / 60000);
						 LOGGER.info('local sync time diff with synctime', resultInMinutes);
					} catch (err) {
						LOGGER.error('Error While making the time difference ', err)
					}
					if (resultInMinutes < 0 || resultInMinutes > canvas.metadata.syncMetadataTimeDiff) {

						LOGGER.log('synctime  available-', cbx.encode(syncTime));
						if (canvas.env.network.getState() == 'ACTIVE') {
							// Getting the Synclist from local storage if time difference
							// elapses for more than a day right now for syncMetadataTimeDiff
							// configuration
							canvas.metadata.getSyncList(function(containerList) {
								if (!cbx.isEmpty(containerList) && cbx.isArray(containerList)) {

									try {
										// Success for validating the
										// metadata sync list
										var successFnForMetadataList = function(result) {
											try {
												
												LOGGER.info('successFnForMetadataList  ----------- ', result);
												if (!cbx.isEmpty(result.SEVER_SYNCTIME)) {
													resultInMinutes = -1
													try {
														var minDiff = formatStringToDate(result.SEVER_SYNCTIME) - formatStringToDate(syncTime);
														/*
														 * This will get
														 * time
														 * difference in
														 * milliseconds
														 */
														resultInMinutes = Math.round(minDiff / 60000);
														LOGGER.info('server sync time diff with synctime ', resultInMinutes);

													} catch (err) {
														LOGGER.error('Error While making the time difference ', err)
													}
													if (resultInMinutes < 0 || resultInMinutes > canvas.metadata.syncMetadataTimeDiff) {
														containerList = result.SYNC_METADATA || [];
														LOGGER.log('containerList ', containerList)

														if (cbx.isArray(containerList) && containerList.length > 0) {
															/*
															 * No
															 * synctime
															 * is
															 * available
															 * getting
															 * the some
															 * old time
															 * to carry
															 * the
															 * metadata
															 * update
															 */
															var d = new Date,
															dformat = [d.getDate().padLeft(), (d.getMonth() + 1).padLeft(),'1970'].join('/') + ' ' + [
															                                                                                          d.getHours().padLeft(),d.getMinutes().padLeft(),d.getSeconds().padLeft()
															                                                                                          ].join(':');

															dformat+ "";
															var valueArray = [];
															for (var i = 0; i < containerList.length; i++) {
																if (cbx.isArray(containerList[i].data) && containerList[i].data.length > 0) {
																	var tempObj = {};
																	var metadatagrp = containerList[i].data;
																	tempObj.type = containerList[i].type;
																	tempObj.synctime = containerList[i].synctime || dformat;
																	var keys = [];
																	for (var metadata = 0; metadata < metadatagrp.length; metadata++) {

																		keys
																		.push(metadatagrp[metadata].KEY);

																	}
																	tempObj.keys = keys;
																	valueArray
																	.push(tempObj);
																}

															}

															if (valueArray.length > 0) {
																showMessageMask();
																var params = {

																			'PAGE_CODE_TYPE': 'SYNC_METADATA_CODE',
																			'INPUT_PRODUCT': 'CANVAS',
																			'INPUT_ACTION': 'SYNC_METADATA_CONFIRM',
																			'INPUT_FUNCTION_CODE': 'VSBLTY',
																			'INPUT_SUB_PRODUCT': 'CANVAS',
																			'PRODUCT_NAME': 'CANVAS',
																			'JSON_TO_HASH_MAP_SUPPORT_FLAG': 'METADATA',
																			'__LISTVIEW_REQUEST': 'Y',
																			'METADATA': cbx
																			.encode({
																				SYNCMETADATA: valueArray
																			})

																};
																retriever.getSyncMetaDataInfo(params, this, successFnForMetadata, failureFnForMetadata, false);

															} else {
																
																canvas.metadata.updateSyncTime(result.SEVER_SYNCTIME);
																/*
																 * hide
																 * progress
																 * and
																 * tigger
																 * canvas.validateSyncReady
																 */
																completedMetadataUpdate();
															}

														}
														else {
															/*
															 * hide
															 * progress
															 * and
															 * tigger
															 * canvas.validateSyncReady
															 */
															completedMetadataUpdate();
														}

													} else {
														/*
														 * hide progress
														 * and tigger
														 * canvas.validateSyncReady
														 */
														completedMetadataUpdate();
													}
												} else {
													/*
													 * hide progress and
													 * tigger
													 * canvas.validateSyncReady
													 */
													clearMetaDataCacheForInvalidResponse(result);
												}
											} catch (err) {
												/*
												 * hide progress and
												 * tigger
												 * canvas.validateSyncReady
												 */
												completedMetadataUpdate();
											}
										}
										/*
										 * Failure function while
										 * getting the metadata synced
										 * list
										 */
										var failureFnForMetadataList = function(
													result) {
											/*
											 * hide progress and tigger
											 * canvas.validateSyncReady
											 */
											completedMetadataUpdate();
										}
										var params = {
													'PAGE_CODE_TYPE': 'SYNC_METADATA_CODE',
													'INPUT_PRODUCT': 'CANVAS',
													'INPUT_ACTION': 'SYNC_METADATA',
													'INPUT_FUNCTION_CODE': 'VSBLTY',
													'INPUT_SUB_PRODUCT': 'CANVAS',
													'PRODUCT_NAME': 'CANVAS',
													'__LISTVIEW_REQUEST': 'Y',
													'JSON_TO_HASH_MAP_SUPPORT_FLAG': 'METADATA',
													'METADATA': cbx
													.encode({
														SYNCMETADATA: containerList
													})
										};
										retriever.getSyncMetaDataInfo(params, this, successFnForMetadataList, failureFnForMetadataList);

									} catch (err) {
										LOGGER.error('Error While setting MetadatCache', err);
										/*
										 * hide progress and tigger
										 * canvas.validateSyncReady
										 */
										completedMetadataUpdate();
									}

									LOGGER.log('synclist   ', cbx.encode(syncTime));
								} else {
									LOGGER.log('synclist  not avilable');
									completedMetadataUpdate();
								}

							}, this);

						} else {
							// tigger canvas.validateSyncReady
							completedMetadataUpdate();
						}
					} else {
						// tigger canvas.validateSyncReady
						completedMetadataUpdate();
					}
				} else {
					
					if (iportal.systempreferences.isHybrid() === "true"/*iportal.systempreferences.getFramework() == "jqm"*/) {
						var params = {
									'PAGE_CODE_TYPE': 'SYNC_METADATA_CODE',
									'INPUT_PRODUCT': 'CANVAS',
									'INPUT_ACTION': 'INITIAL_METADATA',
									'INPUT_FUNCTION_CODE': 'VSBLTY',
									'INPUT_SUB_PRODUCT': 'CANVAS',
									'PRODUCT_NAME': 'CANVAS',
									'__LISTVIEW_REQUEST': 'Y'
						};
						showMessageMask();
						retriever.getSyncMetaDataInfo(params, this, successFnForMetadata, failureFnForMetadata, false);
					} else {
						// tigger canvas.validateSyncReady
						completedMetadataUpdate();
					}
				}

			}, this);

		} else {
			// tigger canvas.validateSyncReady
			completedMetadataUpdate();
		}
	}
	// Event Listener which will be triggered once the DOMContent is loaded actually from canvas.whenready method
	cbx.Event.registerListener("metadatasync", function() {
		canvas.MessageBus.subscribe("canvas.env.network.stateChanged", 'canvas.env.network' + cbx.id(), this, function(
					data) {
			/*
			 * Call the syncMetadata for every N/W state change ,Doesnt harms Precautions made delicately to handle by
			 * checking local time with last synctime and syncInProgress attribure of retreiver fn which avoid continous
			 * calling
			 */
			syncMetadata();
		});
		syncMetadata();

	});

})();

