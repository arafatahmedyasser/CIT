/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

/**
 * @class canvas.dataLoadCallBackTimer
 * @description This is a simple closure function with simple getter/setters which holds dataLoadCallBackTimeOut
 *              constants used by canvas.core.StoreDataController for data time delay especially on enabling data
 *              caching while for data retreived in asyn process, this use this can be overridden by the end
 *              application, therefore reconfiguration can be made according to their needs For more info see
 *              <ul>
 *              <li>{@link #StoreDataController} of {@link canvas.core.StoreDataController}</li>
 *              </ul>
 * @note:By default the timeout is 100ms
 */

canvas.dataLoadCallBackTimer = function ()
{
	// Default value of 100ms
	var dataLoadCallBackTimeOut = 100;
	return {
		getTimeout : function ()
		{
			return dataLoadCallBackTimeOut;
		},
		setTimeout : function (timerInMilliSec)
		{
			if (cbx.isNumber(timerInMilliSec))
				dataLoadCallBackTimeOut = timerInMilliSec;
		}
	};
}();
/**
 * @class canvas.core.StoreDataController
 * @extends canvas.Observable
 *          <p>
 *          This StoreDataController class scope describes data maintenance working on a combination of local (client)
 *          and server related collection data that needs to be displayed in a merged list within your template
 *          </p>
 *          <p>
 *          This caches local data provide by the end application which is used in conjuction with canvas.core.store and
 *          canvas.core.storeReader for massaging the data as expected by the end application.
 *          </p>
 *          <ul>
 *          <li>{@link #store} of {@link canvas.core.store}</li>
 *          <li>{@link #reader} of {@link canvas.core.storeReader}</li>
 *          </ul>
 *          <p>
 *          Enabling a web site or web application to function without a network connection. When you�re working on a
 *          mobile connection and your signal drops, or you just have no connection to the internet for whatever reason,
 *          having some level of access is better than nothing. This is up to end application responsibility to design
 *          on how the application data cache can store resources to be used by the browser when it�s offline, granting
 *          users partial access to your web site or application.
 *          </p>
 *          <p>
 *          This is designed in such a way that the data fetching is made asyn hoping on how the end application
 *          developer has designed to store application data cache which mean that they do not block when an "expensive"
 *          computation is performed, but instead provide the call with a function that will be invoked once the result
 *          is known.
 *          </p>
 *          <p>
 *          For Enabling the data caching framework will fire two events beforeDataLoad and afterDataLoad events.
 *          beforeDataLoad Event-Fired Before loading the data to the template. afterDataLoad Event-Fired after loading
 *          the data to the template. The end application developer should make use of these above events for enabling
 *          the data caching mechanism and vital awareness should be monitored for doing so means if the data is not
 *          pushed within the mentioned dataLoadCallBackTimeOut the local data is of no use For more info see
 *          <ul>
 *          <li>{@link #dataLoadCallBackTimeOut} of {@link canvas.dataLoadCallBackTimer}</li>
 *          </ul>
 *          and data publishing should follow the JS Object Notation standards with the framewok expected format
 *          explained below
 *          </p>
 *          <p>
 *          <u>Enabling Data Caching </u>
 *          </p>
 * 
 * <pre><code>
 * 
 * //CT_ACC_SUMMARY_WGT is the Widget Id for enabling data cache
 * CWEH.registerHandler('CT_ACC_SUMMARY_WGT', 'beforeDataLoad', function (widgetId, params, netState, callbackFn)
 * {
 * 
 * 	//objParams is typically data object in JSON format nothing peculiar and response format should be
 * 
 * 	//'{'response': {'value': {'ALL_RECORDS': { [&lt;B&gt;Data&lt;B&gt;] },'ADDITIONAL_DATA': {&lt;B&gt;Additional Data&lt;B&gt;} } } }'
 * 
 * 	var objParams = {
 * 
 * 		'response' : {
 * 			'value' : {
 * 				'ALL_RECORDS' : [
 * 
 * 				{
 * 					'UNCLEARED_FUND' : '10.0',
 * 					'ACCOUNT_NO' : '9110566174640',
 * 					'CURRENCY' : 'USD',
 * 					'TOTAL_COUNT' : '5',
 * 					'ACCOUNT_NAME' : 'TWO',
 * 					'OVER_DRAFT_LMT' : '0.0',
 * 					'AVAI_BALANCE' : '571140.12',
 * 					'STATUS' : 'ACTIVE',
 * 					ACCOUNT_TYPE : 'VIKI ACCOUNT'
 * 				},
 * 
 * 				{
 * 					'UNCLEARED_FUND' : '10.0',
 * 					'ACCOUNT_NO' : '1111222444',
 * 					'CURRENCY' : 'USD',
 * 					'TOTAL_COUNT' : '5',
 * 					'ACCOUNT_NAME' : 'ONE',
 * 					'OVER_DRAFT_LMT' : '0.0',
 * 					'AVAI_BALANCE' : '571140.12',
 * 					'STATUS' : 'ACTIVE',
 * 					ACCOUNT_TYPE : 'VIKI ACCOUNT1'
 * 				}
 * 
 * 				],
 * 				'ADDITIONAL_DATA' : {
 * 					'MODIFIED_COLUMN_NAMES' : {
 * 						CURRENCY : 'Currency'
 * 					}
 * 				}
 * 			},
 * 			syncMode : false,//Attribute false will not display load mask and true or no attribute defined is vice-versa of the same.
 * 			cancelLoad : false,//Attribute True will display only the local data,  if false or no attribute defined will display both server and local data depending on the below params
 * 			uniqueColumn : 'ACCOUNT_NO',//For data merging
 * 			dataMerge : true,//Will merge both local and remote data based on uniquecolumn ,if false or no attribute defined or no uniquecolumn local data will be overriden with remote data
 * 
 * 		}
 * 	};
 * 	if (params.start == 20)
 * 	{
 * 		objParams.response.cancelLoad = true;
 * 		objParams.response.dataMerge = true;
 * 		objParams.response.data.ALL_RECORDS.push({
 * 			'UNCLEARED_FUND' : '10.0',
 * 			'ACCOUNT_NO' : '007',
 * 			'CURRENCY' : 'USD',
 * 			'TOTAL_COUNT' : '5',
 * 			'ACCOUNT_NAME' : 'ONE',
 * 			'OVER_DRAFT_LMT' : '0.0',
 * 			'AVAI_BALANCE' : '571140.12',
 * 			'STATUS' : 'ACTIVE',
 * 			ACCOUNT_TYPE : 'VIKI ACCOUNT1'
 * 		});
 * 	}
 * 	callbackFn.apply(this, [ objParams ]);
 *  callbackFn.call(this,  objParams );
 * });
 * 
 * //After loading the server data the response param mentioned below is the server response and this will be dispatched only on remote server call 
 * CWEH.registerHandler('CT_ACC_SUMMARY_WGT', 'afterDataLoad', function (widgetId, params, netState, response)
 * {
 * 
 * });
 * </pre></code>
 */
canvas.core.StoreDataController = Class(
			cbx.Observable,
			{
				/**
				 * This is the constructor of the class
				 */
				constructor : function (config)
				{
					canvas.core.extend(this, config);
					this.store = config.store;
					this.reader = this.store.dataReader;
					this.localDataParams = {};
					this.initialConfig = config;
					this.syncMode = true;
					this.containerId = this.store.containerId;
					this.sformat = (function ()
					{
						var pattern = /\{\{|\}\}|\{(\d+)\}/g;
						return function ()
						{
							var parameters = arguments;
							return parameters[0].replace(pattern, function (match, group)
							{
								var value;
								if (match === "{{")
									return "{";
								if (match === "}}")
									return "}";
								value = parameters[parseInt(group, 10) + 1];
								return value ? value.toString() : "";
							});
						};
					})();
					this.responseFormat = '{"response": {"value": {"ALL_RECORDS": {0},"ADDITIONAL_DATA":{1} } } }';
					this.createAccessor = this.reader.createAccessor;
					canvas.core.StoreDataController.$super.call(this);
					cbx.core.extend(this, {

						getLocalData : this.createAccessor('response.value.ALL_RECORDS'),

						getRemoteData : this.createAccessor('response.value.ALL_RECORDS'),

						getSyncMode : this.createAccessor('response.syncMode'),

						getCancelLoad : this.createAccessor('response.cancelLoad'),

						getDataMerge : this.createAccessor('response.dataMerge'),

						getLocalDataUniqueColumn : this.createAccessor('response.uniqueColumn'),

						getLocalAdditionalData : this.createAccessor('response.value.ADDITIONAL_DATA')

					});
				},
				/**
				 * @Method initController
				 * @memberof "canvas.core.StoreDataController"
				 * @description This method just fires the beforeDataLoad event for the store's container id capturing
				 *              the local data caching attributes to enable data caching
				 * @access public
				 * @param {Function} registryCallback .The call back handler to handle before data load event
				 */
				initController : function (registryCallback)
				{
					this.loadEvent(CWEC.BEFORE_DATA_LOAD, '', registryCallback);
				},
				/**
				 * @Method reInitController
				 * @memberof "canvas.core.StoreDataController"
				 * @description Reinitiliazing the beforeDataLoad event
				 * @access public
				 */
				reInitController : function ()
				{
					this.initController();
				},
				/**
				 * @Method loadEvent
				 * @memberof "canvas.core.StoreDataController"
				 * @description Gets the handler function for the registered container id and event name after which
				 *              applies the same to the class level methods for processing
				 * @access public
				 * @param {Object} event Event name(beforeDataLoad/afterDataLoad)
				 * @param {Object} resultData The response data which is applicable only for afterLoadEvent
				 * @param {Function} registryCallback The call back handler
				 */
				loadEvent : function (event, resultData, registryCallback)
				{
					var fn = CWEH.getHandler(this.containerId, event);
					var evt = eval('this.' + event);
					evt.apply(this, [ fn, resultData, registryCallback ]);
				},
				/**
				 * @Method beforeDataLoad
				 * @memberof "canvas.core.StoreDataController"
				 * @description This method triggers the received handler registry function(beforeDataLoad event
				 *              returned handler) see
				 *              <ul>
				 *              <li>{@link #loadEvent} of {@link canvas.core.StoreDataController}</li>
				 *              </ul>
				 *              to get callback response which contains the necessary attributes for enabling local data
				 *              caching For more info about the attributes mapping see the class level comments section
				 * @access public
				 * @param {Function} fn The handler registry function
				 * @param {Object} resultData The response data which is applicable only for afterLoadEvent
				 * @param {Function} registryCallback The call back handler
				 */
				beforeDataLoad : function (fn, resultData, registryCallback)
				{
					var callbackReceived = false;
					var _self = this;
					if (cbx.isFunction(fn))
					{
						var registryCallBackResponse = function (localResponse)
						{
							if (!callbackReceived)
							{
								if (!cbx.isEmpty(localResponse))
								{
									callbackReceived = true;
									LOGGER.info('localResponse', localResponse);
									this.localData = this.getLocalData(localResponse) || {};
									this.dataMerge = false;
									this.cancelLoad = false;
									this.syncMode = true;
									if (this.getSyncMode(localResponse) != undefined
												&& (cbx.isBoolean(this.getSyncMode(localResponse)) && !this
															.getSyncMode(localResponse)))
									{
										this.syncMode = false;
									}
									if (this.getCancelLoad(localResponse) != undefined
												&& (cbx.isBoolean(this.getCancelLoad(localResponse)) && this
															.getCancelLoad(localResponse)))
									{
										this.cancelLoad = true;
									}
									if (this.getDataMerge(localResponse) != undefined
												&& (cbx.isBoolean(this.getDataMerge(localResponse)) && this
															.getDataMerge(localResponse)))
									{
										this.dataMerge = true;
									}
									this.localAdditionalData = this.getLocalAdditionalData(localResponse) || {};
									this.localDataUniqueColumn = this.getLocalDataUniqueColumn(localResponse) || '';

									var params = {
										localData : this.localData,
										syncMode : this.syncMode,
										cancelLoad : this.cancelLoad,
										localAdditionalData : this.localAdditionalData,
										dataMerge : this.dataMerge,
										localDataUniqueColumn : this.localDataUniqueColumn
									};
									this.localDataParams = params;

								} else
								{
									callbackReceived = true;
									this.localDataParams = {};
								}
								if (cbx.isFunction(registryCallback))
								{
									registryCallback.apply(_self, []);
								}
							}

						};

						/*
						 * Receiving the local response on triggering the beforeDataLoad registry function,once this is
						 * not empty will be used for enabling data caching
						 */
						fn.call(this, this.containerId, this.store.getParams(), canvas.env.network.getState(),
									function (localResponse)
									{
										if (!callbackReceived)
										{
											registryCallBackResponse.call(_self, localResponse);
										}
									});

					} else
					{
						registryCallback.apply(_self, []);
					}
				},
				/**
				 * @Method afterDataLoad
				 * @memberof "canvas.core.StoreDataController"
				 * @description This method applies the resultData(response) to the function(afterDataLoad Event
				 *              Returned handler) params
				 * @access public
				 * @param {Function} fn The handler registry function
				 * @param {Object} resultData The response data which is applicable only for afterLoadEvent
				 */
				afterDataLoad : function (fn, resultData)
				{
					if (cbx.core.isFunction(fn))
					{
						var resultData = fn.apply(this, [ this.containerId, this.store.getParams(),
								canvas.env.network.getState(), resultData ]);
					}
				},

				/**
				 * @Method loadData
				 * @memberof "canvas.core.StoreDataController"
				 * @description This method will be invoked from the store to enable the data caching which acts
				 *              accordingly to provide versatile results based on the configured end application
				 *              attributes.
				 * @access public
				 * @param {Object} obj This list of records
				 */
				loadData : function (obj)
				{
					var delayedTask = new canvas.util.DelayedTask(canvas.emptyFn, this);
					this.clearEventRetrievedParams();
					var callbackReceived = false;
					var beforeLoadRegistryCallBackFn = function ()
					{
						if (!callbackReceived)
						{
							callbackReceived = true;
							delayedTask.cancel();
							if (cbx.isObject(obj) && obj.proxyCaller)
							{
								var localDataParams = this.localDataParams;
								if (cbx.isEmpty(localDataParams)
											|| (cbx.isEmpty(localDataParams.localData) && localDataParams.cancelLoad == false))
								{
									this.store.syncMode = this.syncMode;
									obj.proxyCaller.call(this.store, {
										cb : this.dataLoader,
										scope : this
									});

								} else if (cbx.isEmpty(localDataParams.localData) && localDataParams.cancelLoad == true)
								{
									var data = this.sformat.apply(this, [ this.responseFormat, "[]", "{}" ])
									obj.callBack ? obj.callBack.apply(this.store, [ cbx.decode(data) ], true, false)
												: this.store.loadRemoteData();
								} else if (!cbx.isEmpty(localDataParams.localData))
								{
									var data = this.sformat.apply(this, [ this.responseFormat,
											cbx.encode(localDataParams.localData),
											cbx.encode(localDataParams.localAdditionalData) ]);
									if (!obj.paginationTriggered
												|| (obj.paginationTriggered && localDataParams.cancelLoad == true))
									{
										obj.callBack ? obj.callBack
													.apply(this.store, [ cbx.decode(data), true, false ]) : this.store
													.loadRemoteData();
									}

									if (localDataParams.cancelLoad == false)
									{
										this.store.syncMode = this.syncMode;
										obj.proxyCaller.call(this.store, {
											cb : this.dataLoader,
											scope : this
										});
									}

								}

							} else
							{
								this.store.loadRemoteData();
							}
						}

					};
					this.initController(beforeLoadRegistryCallBackFn);

					delayedTask.delay(cbx.dataLoadCallBackTimer.getTimeout(), function ()
					{
						if (!callbackReceived)
						{
							beforeLoadRegistryCallBackFn.apply(this, []);
						}
					}, this)

				},
				/**
				 * @Method clearEventRetrievedParams
				 * @memberof "canvas.core.StoreDataController"
				 * @description clears the localDataParams to accomodate fresh values
				 * @access public
				 */
				clearEventRetrievedParams : function ()
				{
					this.localDataParams = {};
				},
				/**
				 * @Method dataLoader
				 * @memberof "canvas.core.StoreDataController"
				 * @description This trigger the afterDataLoad event of this class to forward the response to the
				 *              registry handler
				 * @access public
				 * @param {Object} result The response data
				 * @param {Function} callback
				 */
				dataLoader : function (result, callback)
				{
					callback.apply(this.store, [ result, false, true ]);
					this.loadEvent(CWEC.AFTER_DATA_LOAD, result, cbx.emptyFn);

				},
				/**
				 * @Method dataMerging
				 * @memberof "canvas.core.StoreDataController"
				 * @description Merges local (client) and server related collection data
				 * @access public
				 * @param {Array} newRecords This list of records to merge
				 * @return {Array} newRecords The processed records
				 */
				dataMerging : function (newRecords)
				{
					var localDataParams = this.localDataParams;
					if ((!cbx.isEmpty(localDataParams) && localDataParams.dataMerge == true)
								&& !cbx.isEmpty(localDataParams.localData))
					{
						var remoteData = {
							data : []
						};
						remoteData.data = newRecords;
						var localData = {
							data : []
						};
						localData.data = localDataParams.localData;
						var uniqueColumn = localDataParams.localDataUniqueColumn
									&& (!cbx.isEmpty(localDataParams.localDataUniqueColumn))
									? localDataParams.localDataUniqueColumn : cbx.id();
						var data = this.merge(remoteData, localData, uniqueColumn);
						return remoteData.data;
					} else
					{
						return newRecords;
					}
				},
				/**
				 * @Method dataMergeLocalOnPriority
				 * @memberof "canvas.core.StoreDataController"
				 * @description Merges local (client) and server related collection data
				 * @access public
				 * @param {Array} consolidatedRecords This list of records
				 * @return {Array} newRecords
				 */
				dataMergeLocalOnPriority : function (consolidatedRecords, newRecords)
				{
					var localDataParams = this.localDataParams;
					var remoteData = {
						data : []
					};
					remoteData.data = consolidatedRecords;
					var localData = {
						data : []
					};
					if ((!cbx.isEmpty(localDataParams) && localDataParams.dataMerge == true && (!cbx
								.isEmpty(localDataParams.localDataUniqueColumn)))
								&& !cbx.isEmpty(localDataParams.localData))
					{
						localData.data = localDataParams.localData;
					} else
					{
						localData.data = newRecords;
					}
					var uniqueColumn = localDataParams.localDataUniqueColumn
								&& (!cbx.isEmpty(localDataParams.localDataUniqueColumn))
								? localDataParams.localDataUniqueColumn : cbx.id();
					var data = this.merge(remoteData, localData, uniqueColumn);
					return remoteData.data;
				},
				/**
				 * @Method merge
				 * @memberof "canvas.core.StoreDataController"
				 * @description Inbuilt utlity method to perform the array merging
				 * @access public
				 * @param {Array} remoteData This list of remote data records
				 * @param {Array} localData This list of local data records
				 * @param {String} uniqueColumn The unique column to perform the merge
				 * @return {Array} finalData Data in form of Array
				 */
				merge : function (remoteData, localData, uniqueColumn)
				{
					if (!remoteData.data)
						return {
							data : localData.data
						};
					if (!localData.data)
						return {
							data : remoteData.data
						};
					var finalData = {
						data : remoteData.data
					};
					for (var i = 0; i < localData.data.length; i++)
					{
						var item = localData.data[i];
						this.insert(item, finalData, uniqueColumn);
					}
					return finalData;
				},
				/**
				 * @Method insert
				 * @memberof "canvas.core.StoreDataController"
				 * @description Performing array merging
				 * @access public
				 * @param {item} item The individual record object
				 * @param {Object} obj This list of records in form of object
				 * @param {String} uniqueColumn The uniqueColumn to find the match
				 */
				insert : function (item, obj, uniqueColumn)
				{
					var data = obj.data;
					var insertIndex = data.length;
					for (var i = 0; i < data.length; i++)
					{
						if (item[uniqueColumn] && data[i][uniqueColumn])
						{
							if (item[uniqueColumn] == data[i][uniqueColumn])
							{
								// ignore duplicates
								insertIndex = -1;
								break;
							}

						}
					}
					if (insertIndex == data.length)
					{
						data.push(item);
					} else if (insertIndex != -1)
					{
						data.splice(insertIndex, 0, item);
					}
				}
			});
