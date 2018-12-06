/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

cbx.ns('canvas.metadata');

/**
 * @class canvas.metaDataLoadCallBackTimer
 * @description This is a simple closure function with simple getter/setters which holds metaDataLoadCallBackTimeOut
 *              constants used by canvas.metadata.persist for metadata fetching time delay from multiple metadata
 *              providers especially for enabling meta data caching while for data retreived in asyn process, this can
 *              be overridden by the end application, therefore reconfiguration can be made according to their needs For
 *              more info see
 *              <ul>
 *              <li>{@link #MetadataPersist} of {@link canvas.metadata.persist}</li>
 *              </ul>
 * @note:By default the timeout is 5000ms-5 sec ,idle time for metadata retrieval from providers.
 */
canvas.metaDataLoadCallBackTimer = function ()
{
	var metaDataLoadCallBackTimeOut = 5000;
	return {
		getTimeout : function ()
		{
			return metaDataLoadCallBackTimeOut;
		},
		setTimeout : function (timerInMilliSec)
		{
			if (cbx.isNumber(timerInMilliSec))
				metaDataLoadCallBackTimeOut = timerInMilliSec;
		}
	};
}();

/**
 * @class canvas.metadata.persist This canvas.metadata.persist scope describes metadata maintenance working purely on
 *        the registered metadata providers which is the heart core of the of this class. This Metadata Provider
 *        provides a means of logically combining other Metadata Provider definitions. When the consumer requests
 *        metadata from this type of provider the provider returns the response of the first metadata provider, in the
 *        chain, that provides a response. Indeed those templates/components controllers who wish to consume the
 *        metadata realted info will make use of these methods. The metadata info related queries will be answered by
 *        the registered metadata providers irrespective of any storage mechanism they use hence for this reason this
 *        class designed in asyn manner and API's in this class defined as asynchronous APIs, which mean that they do
 *        not block when an "expensive" computation is performed, but instead provide the call with a function that will
 *        be invoked once the result is known. In the meantime, the browser can perform other duties.These metadata
 *        providers which registered in sequence and this registration will be taken in to account to process the info.
 *        <p>
 *        The Service Provider this class receives metadata from the Identity Provider sends back the Metadata to
 *        consumers.While fetching metadata from the Identity Providers list on careful observance always the first
 *        provider list info will be dispatched if received certailnly if not received moves to next level provider and
 *        rest of the providers info will be neglected.
 *        </p>
 *        <p>
 *        For example If we have three providers registered as Provider A,B and C still not bothering about the storage
 *        mechanism they use and performs quering for the metadata info from these providers with idle time out of
 *        5sec(Configurable) see
 *        <ul>
 *        <li>{@link #metaDataLoadCallBackTimer} of {@link canvas.metaDataLoadCallBackTimer}</li>
 *        </ul>
 *        for each providers, now preferring either Provider A to get the metadata with idle time out of 5 sec if
 *        received this will be dispatched to the consumer and provider sequence looping will be terminated or after an
 *        idle time out of 5 sec moves to next provider Provider B following the cycle. This cycle continues to all the
 *        registered provders until the data is received and in worst case scenario no data received from any one of the
 *        providers then dispatching will send the empty data to the consumer.
 * @note No attempt to merge metadata from various metadata providers is made and storing metadata to various providers
 *       runs in background process without delay.
 *       </p>
 */
canvas.metadata.persist = function ()
{

	var providerClass = [];

	var delayedTask = new canvas.util.DelayedTask(canvas.emptyFn, this);

	return {
		/**
		 * @Method registerProvider
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for registering the provider class
		 * @access public
		 * @param {Class} Class This is the provider class
		 */
		registerProvider : function (Class)
		{
			providerClass.push(Class);

		},
		/**
		 * @Method getMetaData
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for getting the metadata from one of the providers list in async
		 *              manner
		 * @access public
		 * @param {String} type This indicates the metadata type
		 * @param {String} id This indicates the metadata type id
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting the metadata from one of the providers
		 * @param {Object} scope This refers to callback scope
		 */
		getMetaData : function (type, id, callback, scope)
		{

			this.getAsyncDataonDelay(type, id, callback, scope);
		},
		/**
		 * @Method getMetaDataOnPriority
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for getting the metadata from one of the providers list in
		 *              synchronized fashion
		 * @access public
		 * @param {String} type This indicates the metadata type
		 * @param {String} id This indicates the metadata type id
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting the metadata from one of the providers
		 * @param {Object} scope This refers to callback scope
		 */
		getMetaDataOnPriority : function (type, id, callback, scope)
		{
			if (providerClass.length > 0)
			{
				var callBackDone = false;
				var providerQueue = function (val)
				{
					if (!callBackDone)
					{
						if (cbx.isFunction(callback))
						{
							callBackDone = true;
							callback.call(scope || this, val);
						}
					}
				};
				for (var i = 0; i < providerClass.length; i++)
				{
					if (providerClass[i].getMetaData && (!cbx.isEmpty(type) && !cbx.isEmpty(id)))
					{
						try
						{
							if (callBackDone)
								break;

							metaData = providerClass[i].getMetaData(type, id, providerQueue);
						} catch (e)
						{
							LOGGER.error('Error while fetching persisted data', key, e);
						}

					}
				}
			} else
			{
				callback.call(scope || this, '');
			}
		},

		/**
		 * @Method getAsyncDataonDelay
		 * @memberof "canvas.metadata.persist"
		 * @description This method is common class utilty method for calling synclist,synctime and getMetaData methods
		 *              in generic way.This method is designed to be written in asyn fashion to get the metadata info
		 *              from multiple providers with time delay.For example If we have three providers registered as
		 *              Provider A,B and C still not bothering about the storage mechanism they use and performs quering
		 *              for the metadata info from these providers with idle time out of 5sec(Configurable) see
		 *              <ul>
		 *              <li>{@link #metaDataLoadCallBackTimer} of {@link canvas.metaDataLoadCallBackTimer}</li>
		 *              </ul>
		 * @access public
		 * @param {String} type This indicates the metadata type
		 * @param {String} id This indicates the metadata type id
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting the metadata from one of the providers
		 * @param {Object} scope This refers to callback scope
		 * @param {String} fnname This refers to function name in the providers class ,purposly made as string to
		 *            evaluate the function name and then on invoking the same
		 */
		getAsyncDataonDelay : function (type, id, callback, scope, fnname)
		{
			if (!cbx.isFunction(callback))
				return;

			if (providerClass.length == 0)
			{
				callback.call(scope || this, '');
				return;
			}
			var index = 0;
			var done = false;
			var callbacktriggered = false;
			var providerQueue = [];
			/**
			 * @Method asyncProvider
			 * @memberof "canvas.metadata.persist"
			 * @description This method is simple control statement for iterating provider list , which allows to be
			 *              executed repeatedly until the loop terminates with the final success loopcallback function.
			 * @access private
			 * @param {Number} iterations This indicates the Providers list size
			 * @param {Function} func The next provider function to continue the loop after the idle timeout
			 * @param {Function} loopcallback This refers to final callback function triggered finally on execution
			 *            complete of all providers
			 */
			var asyncProvider = function (iterations, func, loopcallback)
			{

				var loop = {
					next : function ()
					{
						if (done)
						{
							return;
						}

						if (index < iterations)
						{
							index++;
							func(loop);

						} else
						{
							done = true;
							loopcallback();
						}
					},

					iteration : function ()
					{
						return index - 1;
					},

					breakloop : function ()
					{
						done = true;
						loopcallback();
					}
				};
				loop.next();
				return loop;
			};

			/**
			 * @Method providerDataCallBack
			 * @memberof "canvas.metadata.persist"
			 * @description This method is to publish the metadata value once it receives the value from providers.
			 * @access private
			 * @param {String} val This is the encoded value received from providers which will be consumed by the
			 *            template/component controller
			 * @param {Object} loop This is the asyncProvider function to avail its attributes for checking the no of
			 *            iterations completed to trigger the controller callback so that no need to wait till the next
			 *            provider if the callback is accomplished
			 * @param {Number} currentIndex This refers to current provider index
			 */
			var providerDataCallBack = function (val, loop, currentIndex)
			{
				try
				{
					if (!callbacktriggered)
					{
						if (!cbx.isEmpty(val) && currentIndex == loop.iteration())
						{
							callbacktriggered = true;
							delayedTask.cancel();
							callback.call(scope || this, val);
							LOGGER.log('callback completed');
							return;
						} else
						{
							providerQueue.push(val);
							/*
							 * If the value is empty and provider list is completed finally trigger the callback with
							 * empty value.
							 */
							if (providerClass.length == providerQueue.length)
							{
								delayedTask.cancel();
								executeCallbackonDelay();
							}
						}
					}
				} catch (err)
				{
					LOGGER.error(err);
				}
				loop.next();

			};
			/**
			 * @Method executeCallbackonDelay
			 * @memberof "canvas.metadata.persist"
			 * @description This is the final success callback method on complete execution of all the provider list
			 *              indicating that the looping is completed and triggers the callback with the value if still
			 *              the callback is not triggered.
			 * @access private
			 */
			var executeCallbackonDelay = function ()
			{
				LOGGER.log('executeCallbackonDelay  providerQueue length', providerQueue.length)
				if (!callbacktriggered)
				{
					if (providerQueue.length > 0)
					{
						var data = '';
						for (var pq = 0; pq < providerQueue.length; pq++)
						{
							if (!cbx.isEmpty(providerQueue[pq]))
							{
								data = providerQueue[pq];
								break;
							}
						}
						callbacktriggered = true;
						delayedTask.cancel();
						callback.call(scope || this, data);

					} else
					{
						callbacktriggered = true;
						delayedTask.cancel();
						callback.call(scope || this, '');

					}
				}
			};
			/**
			 * @Method asyncProvider
			 * @memberof "canvas.metadata.persist"
			 * @description This is reponsible for providing the aysnc data from any one of value received providers
			 *              list with configured time delay. For more info see canvas.metadata.persist class description
			 * @access private
			 * @param {Number} Providers list size
			 * @param {Function} This used as generic method for getSyncList,getSyncTime and getMetaData method which
			 *            makes use of the above private methods to for availaing and publishing the data
			 * @param {Function} This refers to final callback function triggered finally on execution completion of all
			 *            providers
			 */
			asyncProvider(providerClass.length, function (loop)
			{
				delayedTask.cancel();
				var currentIndex = index - 1;
				if (!cbx.isEmpty(fnname))
				{
					var className = providerClass[index - 1];
					var evt = eval('className.' + fnname);
					try
					{
						if (evt)
						{
							evt.apply(this, [ function (val)
							{
								delayedTask.cancel();
								providerDataCallBack(val, loop, currentIndex);
							}, this ]);
						} else
						{
							delayedTask.cancel();
							providerDataCallBack('', loop, currentIndex);
						}
					} catch (err)
					{
						LOGGER.error(err);
						delayedTask.cancel();
						providerDataCallBack('', loop, currentIndex);
					}

				} else
				{
					if (providerClass[currentIndex].getMetaData)
					{
						providerClass[currentIndex].getMetaData(type, id, function (val)
						{
							delayedTask.cancel();
							providerDataCallBack(val, loop, currentIndex);
						});
					} else
					{
						delayedTask.cancel();
						providerDataCallBack('', loop, currentIndex);
					}
				}

				delayedTask.delay(cbx.metaDataLoadCallBackTimer.getTimeout(), function ()
				{
					if (!callbacktriggered)
					{
						loop.next();
					}
				}, this)
			}, function ()
			{
				LOGGER.log('looping cycle ended');
				delayedTask.cancel();
				executeCallbackonDelay();
			});

		},
		/**
		 * @Method getSyncList
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for getting the synclist metadata from one of the providers list in
		 *              async manner
		 * @access public
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting thes metadata synclist
		 * @param {Object} scope This refers to callback scope
		 */
		getSyncList : function (callback, scope)
		{
			this.getAsyncDataonDelay('', '', callback, scope, 'getSyncList');
		},
		/**
		 * @Method getSyncTime
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for getting the synctime from one of the providers list in async
		 *              manner
		 * @access public
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting thes metadata synctime
		 * @param {Object} scope This refers to callback scope
		 */
		getSyncTime : function (callback, scope)
		{
			this.getAsyncDataonDelay('', '', callback, scope, 'getSyncTime');
		},
		/**
		 * @Method updateSyncTime
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for updating the latest synctime from all providers
		 * @access public
		 * @param {String} value This updates the latest synctime to all the providers.
		 */
		updateSyncTime : function (value)
		{
			for (var i = 0; i < providerClass.length; i++)
			{
				if (providerClass[i].updateSyncTime && (!cbx.isEmpty(value)))
					providerClass[i].updateSyncTime(value);

			}
		},
		/**
		 * @Method storeMetaData
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for storing the metadata to all providers
		 * @access public
		 * @param {String} type This indicates the metadata type
		 * @param {Object} id This hold the attributes like id,value and servertime
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting the metadata from one of the providers
		 * @param {Object} scope This refers to callback scope
		 * @param {String} syncTimeUpdate This refers whether to update the synctime on earliest metadata update
		 */
		storeMetaData : function (type, object, callback, scope,syncTimeUpdate)
		{
			var providerDataStoreCallBack = function (statusFlag, val)
			{
				if (!cbx.isEmpty(callback) && cbx.isFunction(callback))
				{
					callback.call(scope || this, statusFlag, val);
				}
			}

			for (var i = 0; i < providerClass.length; i++)
			{
				if (providerClass[i].storeMetaData && (!cbx.isEmpty(type) && !cbx.isEmpty(object)))
					providerClass[i].storeMetaData(type, object, providerDataStoreCallBack, this,syncTimeUpdate);

			}

		},
		/**
		 * @Method removeValue
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for removing the metadata type based on the unique id under all
		 *              providers
		 * @access public
		 * @param {String} type This indicates the metadata type
		 * @param {String} id This indicates the metadata type id
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            getting the metadata from one of the providers
		 * @param {Object} scope This refers to callback scope
		 * @note This callback triggers for all the providers metadata removal.
		 */
		removeValue : function (type, id, callback, scope)
		{
			var providerCallBack = function (statusFlag)
			{
				if (!cbx.isEmpty(callback) && cbx.isFunction(callback))
				{
					callback.call(scope || this, statusFlag);
				}
			}
			for (var i = 0; i < providerClass.length; i++)
			{
				if (providerClass[i].removeValue && (!cbx.isEmpty(type) && !cbx.isEmpty(id)))
					providerClass[i].removeValue(type, id, providerCallBack, this);

			}
		},
		/**
		 * @Method removeAll
		 * @memberof "canvas.metadata.persist"
		 * @description This method is responsible for removing the all the metadata making empty
		 * @access public
		 * @param {Function} callback This is the reference to the actual function that should be called back after
		 *            removing all the metadata from the providers list.
		 * @param {Object} scope This refers to callback scope
		 * @note This callback triggers for all the providers metadata removal.
		 */
		removeAll : function (callback, scope)
		{
			var providerCallBack = function (statusFlag)
			{
				if (!cbx.isEmpty(callback) && cbx.isFunction(callback))
				{
					callback.call(scope || this, statusFlag);
				}
			}
			for (var i = 0; i < providerClass.length; i++)
			{
				if (providerClass[i].removeAll)
					providerClass[i].removeAll(providerCallBack, this);

			}
		}
	};

}

/**
 * @class canvas.metadata.manager This class creates the singleton instance of canvas.metadata.persist and his name
 *        nicked as canvas.metadata for shorter reference.
 */
canvas.metadata.manager = function ()
{
	var _manager = null;
	return {
		getInstance : function ()
		{
			if (_manager === null)
			{
				_manager = new canvas.metadata.persist;
			}
			return _manager;
		}
	};
}();

canvas.metadata = canvas.metadata.manager.getInstance();

/**
 * @class canvas.metadata.canvasStorage This class is one of the storage provider and registered to
 *        canvas.metadata.persist class which uses this class API's to get or store the metadata info etc. Morely this
 *        class acts as router, foremost this validates the parameters before routing to persist class
 *        <p>
 *        This class uses canvas.persist class to get,store etc for metadata related info. see
 *        <ul>
 *        <li>{@link #canvas.persist} of {@link canvas.persist}</li>
 *        </ul>
 *        All the API's are directly tied to canvas.persist class for consuming and metadata processing occurs in the
 *        background and does not affect other browser request processing (i.e. no more pauses due to metadata
 *        reloading).
 *        </p>
 */

canvas.metadata.canvasStorage = Class({
	constructor : function (config)
	{
		cbx.core.extend(this, config);
		this.MetadataDelim = '#';
	},

	/**
	 * @Method getMetaData
	 * @memberof "canvas.metadata.canvasStorage"
	 * @description This method is responsible for getting the metadata(Framework provided Storage).
	 * @access public
	 * @param {String} type This indicates the metadata type
	 * @param {String} id This indicates the metadata type id
	 * @param {Function} callback This is the reference to the actual function that should be called back after getting
	 *            the metadata from one of the providers
	 */
	getMetaData : function (type, id, callback)
	{

		if (id && canvas.persist)
		{
			if (cbx.isString(type))
				return canvas.persist.getValue(type, type + this.MetadataDelim + id, callback);
			else
				return canvas.persist.getValue(type, id, callback);
		} else
		{
			// obsequious condition to complete the block
		}
	},
	/**
	 * @Method getSyncList
	 * @memberof "canvas.metadata.canvasStorage"
	 * @description This method is responsible for getting the synclist(Framework provided Storage).
	 * @access public
	 * @param {Function} callback This is the reference to the actual function that should be called back after getting
	 *            thes metadata synclist
	 * @param {Object} scope This refers to callback scope
	 */
	getSyncList : function (callback, scope)
	{
		if (canvas.persist)
		{
			if (cbx.isFunction(callback))
			{
				return canvas.persist.getSyncList(callback, scope);
			}
		} else
		{
			// obsequious condition to complete the block
		}
	},
	/**
	 * @Method getSyncTime
	 * @memberof "canvas.metadata.canvasStorage"
	 * @description This method is responsible for getting the synctime(Framework provided Storage).
	 * @access public
	 * @param {Function} callback This is the reference to the actual function that should be called back after getting
	 *            thes metadata synctime
	 * @param {Object} scope This refers to callback scope
	 */
	getSyncTime : function (callback, scope)
	{
		if (canvas.persist)
		{
			if (cbx.isFunction(callback))
			{
				return canvas.persist.getSyncTime(callback, scope);
			}
		} else
		{
			// obsequious condition to complete the block
		}
	},
	/**
	 * @Method updateSyncTime
	 * @memberof "canvas.metadata.canvasStorage"
	 * @description This method is responsible for updating the synctime(Framework provided Storage).
	 * @access public
	 * @param {String} value This updates the latest synctime to framework provided Storages.
	 */
	updateSyncTime : function (value)
	{
		if (canvas.persist)
		{
			canvas.persist.updateSyncTime(value);
		} else
		{
			// obsequious condition to complete the block
		}
	},
	/**
	 * @Method removeValue
	 * @memberof "canvas.metadata.canvasStorage"
	 * @description This method is responsible for removing the metadata type based on the unique id from framework
	 *              provided Storages
	 * @access public
	 * @param {String} type This indicates the metadata type
	 * @param {String} id This indicates the metadata type id
	 * @param {Function} callback This is the reference to the actual function that should be called back after getting
	 *            the metadata from one of the providers
	 * @param {Object} scope This refers to callback scope
	 */
	removeValue : function (type, id, providerCallBack, scope)
	{
		if (canvas.persist)
		{
			if (cbx.isString(type))
				canvas.persist.removeValue(type + this.MetadataDelim + id, type, id, providerCallBack, scope);
			else
				canvas.persist.removeValue(id, "", "", providerCallBack, scope);
		} else
		{
			// obsequious condition to complete the block
		}
	},
	/**
	 * @Method removeAll
	 * @memberof "canvas.metadata.canvasStorage"
	 * @description This method is responsible for removing the metadata from framework provided Storages
	 * @access public
	 * @param {Function} callback This is the reference to the actual function that should be called back after removing
	 *            all the metadata
	 * @param {Object} scope This refers to callback scope
	 */
	removeAll : function (providerCallBack, scope)
	{
		if (canvas.persist)
		{
			canvas.persist.removeAll(providerCallBack, scope);
		} else
		{
			// obsequious condition to complete the block
		}
	},
	/**
	 * @Method storeMetaData
	 * @memberof "canvas.metadata.canvasStorage"
	 * @description This method is responsible for storing the metadata to framework provided Storages
	 * @access public
	 * @param {String} type This indicates the metadata type
	 * @param {Object} id This hold the attributes like id,value and servertime
	 * @param {Function} providerDataStoreCallBack This is the reference to the actual function that should be called
	 *            back after setting the metadata
	 * @param {Object} scope This refers to callback scope
	 * @param {String} syncTimeUpdate This refers whether to update the synctime on earliest metadata update
	 */
	storeMetaData : function (type, object, providerDataStoreCallBack, scope,syncTimeUpdate)
	{
		if (cbx.isObject(object) && object.id && object.value && object.serverdatetime && canvas.persist)
		{
			if (cbx.isString(type))
				canvas.persist.setValue(type + this.MetadataDelim + object.id, type, object.value,
							object.serverdatetime, object.id, providerDataStoreCallBack, scope,syncTimeUpdate);
			else
				canvas.persist.setValue(object.id, type, object.value, object.serverdatetime, object.id,
							providerDataStoreCallBack, scope,syncTimeUpdate);
		} else
		{
			// obsequious condition to complete the block
		}

	}
});

canvas.metadata.registerProvider(new canvas.metadata.canvasStorage());
