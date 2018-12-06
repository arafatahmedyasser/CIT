/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

canvas.ns("canvas.env");

canvas.env.about = {
	version : '1.0',
	versionDetail : {
		major : 0,
		minor : 1,
		patch : 0
	}
};

canvas.ns("canvas.env.handler");

/**
 * This is the class that will provide the details of the network connectivity
 */

(function ()
{
	/**
	 * Private object that holds the network state as of last update
	 */
	var stateObj = {
		'State' : 'ACTIVE',
		'NetworkType' : 'Unknown'
	};
	/**
	 * This is passed as the callback function to the network handler for it to inform the framework that the state has
	 * changed. The stateVal passed is expected to be the current state as detected by the handler
	 */
	var stateChanged = function (stateVal, networkType)
	{
		if (stateObj.State !== stateVal)
		{
			// Means that the state has changed.
			var oldVal = stateObj.State;
			stateObj.State = stateVal;
			stateObj.NetworkType = networkType;
			var stateParams = {
				network : {}
			};
			canvas.apply(stateParams.network, canvas.clone(stateObj))
			stateParams.network.OldState = oldVal;
			canvas.MessageBus.publish('canvas.env.network.stateChanged', stateParams);
		}
	};

	canvas.env.network = canvas.apply({}, canvas.env.about);

	canvas.apply(canvas.env.network, {
		/**
		 * Returns the current state of the network as of most recent update. This is one of 'ACTIVE' or 'INACTIVE'
		 */
		getState : function ()
		{
			return stateObj.State;
		},
		/**
		 * Returns the type of network connection. This is one of
		 * <p>
		 * <ul>
		 * <li> 'Unknown' - Indicates that we are not able to detect the type of network</li>
		 * <li> 'Ethernet' - Indicates a LAN connection </li>
		 * <li> 'WiFi' - Indicates that the connectivity is established using WIFI</li>
		 * <li> 'Cell_2G' - Indicates that the device has only a 2G connectivity</li>
		 * <li> 'Cell_3G' - Indicates that the device has 3G connectivity</li>
		 * <li> 'Cell_4G' - Indicates that the device has 4G connectivity</li>
		 * <li> 'Cell' - Indicates that the device has cellular connectivity, but the nature of connectivity (2G , 3G,
		 * 4G) cannot be determined </li>
		 * <li> 'None' - Indicates that there is no network connectivity available </li>
		 * </ul>
		 */
		getNetworkType : function ()
		{
			return stateObj.NetworkType;
		},
		/**
		 * This sets the network state handler. This has to be an object that has an init() function that accepts the
		 * reference to a callback function that should be invoked whenever the object detects a change to the state of
		 * the network
		 */
		setHandler : function (handlerObj)
		{
			handlerObj.init(stateChanged);
		}
	});
})();

/**
 * @class "canvas.env.handler.DefaultNetworkHandler"
 * @description This is the default handler that determines the network state. This always assumes that the network is
 *              ACTIVE
 */
canvas.env.handler.DefaultNetworkHandler = Class(canvas.Observable, {
	/**
	 * The constructor of this class
	 */
	constructor : function (config)
	{
		canvas.core.extend(this, config);
		this.initialConfig = config;
		LOGGER.debug("Network State Handler set to canvas.env.handler.DefaultNetworkHandler");
	},
	/**
	 * This is invoked when this object is assigned as the network handler.
	 */
	init : function (stateChanged)
	{
		// Nothing to do here. All that we do is to always assume that the network is available. Ensure that it is
		// set to ACTIVE state.
		stateChanged.apply(canvas.env.network, [ 'ACTIVE', 'Unknown' ]);
	}
});

/**
 * Register the Default network handler as the adapter for network monitor
 */
canvas.env.network.setHandler(new canvas.env.handler.DefaultNetworkHandler());

/**
 * This is the class that will provide the details of the connectivity to Calendar. This provides API's for setting up
 * events, etc. into the Calendar
 */
(function ()
{
	/**
	 * Private object that holds the network state as of last update
	 */
	var stateObj = {
		'State' : 'ACTIVE'
	};
	var handler = null;
	/**
	 * This is passed as the callback function to the network handler for it to inform us
	 */
	var stateChanged = function (stateVal)
	{
		if (stateObj.State !== stateVal)
		{
			// Means that the calendar state has changed.
			var oldVal = stateObj.State;
			stateObj.State = stateVal;
			var stateParams = {
				calendar : {}
			};
			canvas.apply(stateParams.calendar, canvas.clone(stateObj))
			stateParams.calendar.OldState = oldVal;
			canvas.MessageBus.publish('canvas.env.calendar.stateChanged', stateParams);
		}
	};

	canvas.env.calendar = canvas.apply({}, canvas.env.about);

	canvas.apply(canvas.env.calendar, {
		/**
		 * @Method openCalendar
		 * @memberof "canvas.env.calendar"
		 * @description Returns the current state of the network as of most recent update. This is one of 'ACTIVE' or
		 *              'INACTIVE'
		 * @return {String} The state of the network. This is one of 'ACTIVE' or 'INACTIVE'
		 * @access public
		 */
		getState : function ()
		{
			return stateObj.State;
		},
		/**
		 * @Method openCalendar
		 * @memberof "canvas.env.calendar"
		 * @description Open's the calendar for the given date (if present)
		 * @access public
		 */
		openCalendar : function (date)
		{
			// Delegate to the handler
			if (handler && handler.openCalendar)
				handler.openCalendar.apply(handler, [ date ]);
		},
		/**
		 * @Method createEvent
		 * @memberof "canvas.env.calendar"
		 * @description Invoking this API adds a new event into the calendar..
		 * @access public
		 * @param {Object} eventData This is a simple map having the data of the event to be added to the calendar. The
		 *            keys expected in the map are -
		 *            <p>
		 *            <ul>
		 *            <li>title : This is the title of the event</li>
		 *            <li>startDate : This is the Start Date for the event</li>
		 *            <li>endDate : This is the End Date for the event</li>
		 *            <li>notes : This contains any additional notes to be attached to the event. Optional</li>
		 *            <li>location : This is the location that needs to be set on the event. Optional</li>
		 *            <li>options : This is a map having additional options that needs to be passed to the calendar.
		 *            Optional</li>
		 *            </ul>
		 * @param {Function} eventCallback This is the reference to the actual function that should be called back when
		 *            the event has been added. The function will receive two arguments (in the same order),
		 *            <p>
		 *            status : This is a boolean flag indicating whether the event was added successfully or was a
		 *            failure
		 *            <p>
		 *            data : This is the data of the event that has was added
		 * @param {Object} eventCallbackScope This refers to eventCallback function scope
		 */
		createEvent : function (eventData, eventCallback, eventCallbackScope)
		{

			/**
			 * This is passed as the callback function to the calendar handler for it to call back once an event has
			 * been successfully added
			 */
			var eventAdded = function (status, response)
			{
				if (status)
				{
					// This was a success. So raise an interapp event.
					canvas.MessageBus.publish('canvas.env.calendar.eventAdded', response);
				}
				if (eventCallback && canvas.isFunction(eventCallback))
					eventCallback.apply(eventCallbackScope || this, [ status, response ])

			};
			if (handler && handler.createEvent)
			{
				// Delegate to the handler and provide the callback to be invoked once the event
				// has been successfully added
				var params = {
					title : eventData.title,
					startDate : eventData.startDate,
					endDate : eventData.endDate,
					notes : eventData.notes,
					location : eventData.location,
					options : eventData.options ? eventData.options : {}
				};
				handler.createEvent.apply(handler, [ params, eventAdded ]);
			} else
			{
				LOGGER.debug("calendar.createEvent skipped : no handler or handler does not support createEvent");
			}
		},
		/**
		 * @Method deleteEvent
		 * @memberof "canvas.env.calendar"
		 * @description Invoking this API deletes an existing event from the calendar..
		 * @access public
		 * @param {Object} eventData This is a simple map having the data of the event to be deleted from the calendar.
		 *            The keys expected in the map are -
		 *            <p>
		 *            <ul>
		 *            <li>title : This is the title of the event</li>
		 *            <li>startDate : This is the Start Date for the event</li>
		 *            <li>endDate : This is the End Date for the event</li>
		 *            <li>notes : This contains any additional notes to be attached to the event. Optional</li>
		 *            <li>location : This is the location that needs to be set on the event. Optional</li>
		 *            <li>options : This is a map having additional options that needs to be passed to the calendar.
		 *            Optional</li>
		 *            </ul>
		 * @param {Function} eventCallback This is the reference to the actual function that should be called back when
		 *            the event has been deleted. The function will receive two arguments (in the same order),
		 *            <p>
		 *            status : This is a boolean flag indicating whether the event was deleted successfully or was a
		 *            failure
		 *            <p>
		 *            data : This is the data of the event that has been deleted
		 * @param {Object} eventCallbackScope This refers to eventCallback function scope
		 */
		deleteEvent : function (eventData, eventCallback, eventCallbackScope)
		{
			/**
			 * This is passed as the callback function to the calendar handler for it to call back once an event has
			 * been successfully deleted
			 */
			var eventDeleted = function (status, response)
			{
				if (status)
				{
					canvas.MessageBus.publish('canvas.env.calendar.eventDeleted', response);
				}
				if (eventCallback && canvas.isFunction(eventCallback))
					eventCallback.apply(eventCallbackScope || this, [ status, response ])

			};
			if (handler && handler.deleteEvent)
			{
				// Delegate to the handler and provide the callback to be invoked once the event
				// has been successfully deleted
				var params = {
					title : eventData.title,
					startDate : eventData.startDate,
					endDate : eventData.endDate,
					notes : eventData.notes,
					location : eventData.location,
					options : eventData.options ? eventData.options : {}
				};

				handler.deleteEvent.apply(handler, [ params, eventDeleted ]);
			} else
			{
				LOGGER.debug("calendar.deleteEvent skipped : no handler or handler does not support deleteEvent");
			}
		},
		/**
		 * @Method findEvent
		 * @memberof "canvas.env.calendar"
		 * @description Invoking this API find an event from the calendar
		 * @access public
		 * @param {Object} eventData This is a simple map having the data of the event to be found in the calendar. The
		 *            keys expected in the map are -
		 *            <p>
		 *            <ul>
		 *            <li>title : This is the title of the event</li>
		 *            <li>startDate : This is the Start Date for the event</li>
		 *            <li>endDate : This is the End Date for the event</li>
		 *            <li>notes : This contains any additional notes to be attached to the event. Optional</li>
		 *            <li>location : This is the location that needs to be set on the event. Optional</li>
		 *            <li>options : This is a map having additional options that needs to be passed to the calendar.
		 *            Optional</li>
		 *            </ul>
		 * @param {Function} eventCallback This is the reference to the actual function that should be called back when
		 *            the event has been found. The function will receive two arguments (in the same order),
		 *            <p>
		 *            status : This is a boolean flag indicating whether the event was found or not
		 *            <p>
		 *            data : This is the data of the event that has been found, or the input parameters
		 * @param {Object} eventCallbackScope This refers to eventCallback function scope
		 */
		findEvent : function (eventData, eventCallback, eventCallbackScope)
		{

			/**
			 * This is passed as the callback function to the calendar handler for it to call back once an event has
			 * been successfully found
			 */
			var eventFound = function (status, response)
			{
				if (eventCallback && canvas.isFunction(eventCallback))
					eventCallback.apply(eventCallbackScope || this, [ status, response ])

			};
			if (handler && handler.findEvent)
			{
				// Delegate to the handler and provide the callback to be invoked once the event
				// has been successfully deleted
				var params = {
					title : eventData.title,
					startDate : eventData.startDate,
					endDate : eventData.endDate,
					notes : eventData.notes,
					location : eventData.location,
					options : eventData.options ? eventData.options : {}
				};
				handler.findEvent.apply(handler, [ params, eventFound ]);
			} else
			{
				LOGGER.debug("calendar.findEvent skipped : no handler or handler does not support deleteEvent");
				// Trigger the callback
				eventFound(false, "Error message");
			}
		},
		/**
		 * @Method setHandler
		 * @memberof "canvas.env.calendar"
		 * @description This sets the state handler. This has to be an object that has an init() function that accepts
		 *              the reference to a callback function that should be invoked whenever the object detects a change
		 *              to the state of availability of calendar.
		 * @access public
		 * @param {Object} handlerObj This is a handler for the calendar interface with the native environment
		 */
		setHandler : function (handlerObj)
		{
			handlerObj.init(stateChanged);
			handler = handlerObj;
		}
	});
})();

/**
 * @class "canvas.env.handler.DefaultCalendarHandler"
 * @description This class is the default handler that is attached by the framework to the canvas.env.calendar object.
 *              This handler assumes that there is no Calendar support and sets the state in the canvas.env.calendar to
 *              INACTIVE. This does not bother to implement the other handler methods as they are not supported anyway
 *              by this class.
 */
canvas.env.handler.DefaultCalendarHandler = Class(canvas.Observable, {
	/**
	 * The constructor of this class
	 */
	constructor : function (config)
	{
		canvas.core.extend(this, config);
		this.initialConfig = config;
		LOGGER.debug("Calendar State Handler set to canvas.env.handler.DefaultCalendarHandler");
	},
	/**
	 * This is invoked when this object is assigned as the network handler.
	 */
	init : function (stateChanged)
	{
		// Nothing to do here. All that we do is to always assume that the network is available. Ensure that it is
		// set to ACTIVE state.
		stateChanged.apply(canvas.env.calendar, [ 'INACTIVE' ]);
	}
});

/**
 * Register the Default calendar handler as the adapter for calendar monitor
 */
canvas.env.calendar.setHandler(new canvas.env.handler.DefaultCalendarHandler());

/**
 * This is the class that will provide the details of the device in which the app is running
 */
(function ()
{
	/**
	 * Private object that holds the device information as of last update
	 */
	var deviceInfo = {};
	/**
	 * This is passed as the callback function to the network handler for it to inform the framework that the state has
	 * changed. The stateVal passed is expected to be the current state as detected by the handler
	 */
	var infoReceived = function (devInfo)
	{
		if (!canvas.isEmpty(devInfo))
		{
			canvas.apply(deviceInfo, devInfo);
		}
	};

	canvas.env.deviceInfo = canvas.apply({}, canvas.env.about);

	canvas.apply(canvas.env.deviceInfo, {
		/**
		 * Returns the current details of the device as of last update
		 */
		getInfo : function ()
		{
			return deviceInfo;
		},
		/**
		 * This sets the Device Info handler. This has to be an object that has an init() function that accepts the
		 * reference to a callback function that should be invoked with the details of the device
		 */
		setHandler : function (handlerObj)
		{
			handlerObj.init(infoReceived);
		}
	});
})();

/**
 * @class "canvas.env.handler.DefaultDeviceInfoHandler"
 * @description This class is the default handler that is attached by the framework to the canvas.env.deviceInfo object.
 *              This handler assumes that there is no information available.
 */
canvas.env.handler.DefaultDeviceInfoHandler = Class(canvas.Observable, {
	/**
	 * The constructor of this class
	 */
	constructor : function (config)
	{
		canvas.core.extend(this, config);
		this.initialConfig = config;
		LOGGER.debug("Device Info State Handler set to canvas.env.handler.DefaultDeviceInfoHandler");
	},
	/**
	 * This is invoked when this object is assigned as the network handler.
	 */
	init : function (stateChanged)
	{
		// Nothing to do here.
		stateChanged.apply(canvas.env.deviceInfo, [ {} ]);
	}
});

/**
 * Register the Default Device Info handler as the adapter for Device Info monitor
 */
canvas.env.deviceInfo.setHandler(new canvas.env.handler.DefaultDeviceInfoHandler());

/**
 * This is the class that will provide the details of the device in which the app is running
 */
(function ()
{
	/**
	 * Private object that holds the status of ACTIVE or INACTIVE to indicate whether the scanner is activated or not.
	 */
	var handler = undefined;
	var stateObj = {
		'State' : 'INACTIVE'
	};

	/**
	 * Updates the state based on the value received
	 */
	var stateChanged = function (state)
	{
		stateObj.State = state;
	}

	canvas.env.scanner = canvas.apply({}, canvas.env.about);

	canvas.apply(canvas.env.scanner, {
		/**
		 * Returns the current state of the Scanner
		 */
		getState : function ()
		{
			return stateObj.State;
		},
		/**
		 * @Method setHandler
		 * @memberof "canvas.env.scanner"
		 * @description This sets the scanner handler. This has to be an object that has an init() function that accepts
		 *              the reference to a callback function that should be invoked whenever the object detects a change
		 *              to the state of availability of scanner.
		 * @access public
		 * @param {Object} handlerObj This is a handler for the scanner interface with the native environment
		 */
		setHandler : function (handlerObj)
		{
			handlerObj.init(stateChanged);
			handler = handlerObj;
		},
		/**
		 * @Method scanBarCode
		 * @memberof "canvas.env.scanner"
		 * @description This does the actual scan of the bar code (if it is enabled) and invokes the callback
		 * @access public
		 * @param {Function} callback This is the reference to the actual function that should be called back when the
		 *            scanning has been done. The function will receive two arguments (in the same order),
		 *            <p>
		 *            status : This is a boolean flag indicating whether the scan was successful
		 *            <p>
		 *            data : This is the data scanned
		 * @param {Object} callbackScope This refers to callback function scope
		 */
		scanBarCode : function (callback, callbackScope)
		{
			/**
			 * This is passed as the callback function to receive the scanned bar code details.
			 */
			var infoReceived = function (successFlag, scanResponse)
			{
				if (callback != null)
				{
					callback.apply(callbackScope || this, [ successFlag, scanResponse ]);
				}
			};
			if (handler && handler.scanBarCode)
			{
				handler.scanBarCode.apply(handler, [ infoReceived ]);
			} else
			{
				LOGGER.debug('scanner.scanBarCode skipped : no handler or handler does not support scanBarCode');
				infoReceived(false, {});
			}
		}
	});
})();

/**
 * @class "canvas.env.handler.DefaultScannerHandler"
 * @description This class is the default handler that is attached by the framework to the canvas.env.scanner object.
 *              This handler assumes that there is no scanner option available.
 */
canvas.env.handler.DefaultScannerHandler = Class(canvas.Observable, {
	/**
	 * The constructor of this class
	 */
	constructor : function (config)
	{
		canvas.core.extend(this, config);
		this.initialConfig = config;
		LOGGER.debug("Scanner State Handler set to canvas.env.handler.DefaultScannerHandler");
	},
	/**
	 * This is invoked when this object is assigned as the scanner handler.
	 */
	init : function (stateChanged)
	{
		// Nothing to do here.
		stateChanged.apply(canvas.env.scanner, [ 'INACTIVE' ]);
	}
});

/**
 * Register the Default Scanner handler as the adapter for Scanner monitor
 */
canvas.env.scanner.setHandler(new canvas.env.handler.DefaultScannerHandler());

/**
 * This is the class that will provide the ability to interact with the contacts database, if allowed
 */
(function ()
{
	/**
	 * Private object that holds the status of ACTIVE or INACTIVE to indicate whether the contacts read ability is
	 * activated or not.
	 */
	var handler = undefined;
	var stateObj = {
		'State' : 'INACTIVE'
	};

	/**
	 * Updates the state based on the value received
	 */
	var stateChanged = function (state)
	{
		stateObj.State = state;
	}

	canvas.env.contacts = canvas.apply({}, canvas.env.about);

	canvas.apply(canvas.env.contacts, {
		/**
		 * Returns the current state of the Contacts service
		 */
		getState : function ()
		{
			return stateObj.State;
		},
		/**
		 * @Method setHandler
		 * @memberof "canvas.env.contacts"
		 * @description This sets the contacts handler. This has to be an object that has an init() function that
		 *              accepts the reference to a callback function that should be invoked whenever the object detects
		 *              a change to the state of availability of contacts.
		 * @access public
		 * @param {Object} handlerObj This is a handler for the contacts interface with the native environment
		 */
		setHandler : function (handlerObj)
		{
			handlerObj.init(stateChanged);
			handler = handlerObj;
		},
		/**
		 * @Method pickContact
		 * @memberof "canvas.env.contacts"
		 * @description This tries to find the contact based on the parameters provided
		 * @access public
		 * @param {Boolean} singleSelect This flag indicates whether to allow for a single or multi selection of
		 *            contacts
		 * @param {Function} callback This is the reference to the actual function that should be called back when the
		 *            contact details has been found. The function will receive two arguments (in the same order),
		 *            <p>
		 *            status : This is a boolean flag indicating whether the contact search was successful
		 *            <p>
		 *            data : This is the array of contacts based on the provided search condition
		 * @param {Object} callbackScope This refers to callback function scope
		 */
		pickContact : function (singleSelect, callback, callbackScope)
		{
			/**
			 * This is passed as the callback function to receive the scanned bar code details.
			 */
			var contactReceived = function (successFlag, contacts)
			{
				if (callback != null)
				{
					callback.apply(callbackScope || this, [ successFlag, contacts ]);
				}
			};

			if (handler && handler.pickContact)
			{
				handler.pickContact.apply(handler, [ singleSelect || true, contactReceived ]);
			} else
			{
				LOGGER.debug('contacts.findContact skipped : no handler or handler does not support findContact');
				contactReceived(false, []);
			}
		}
	});
})();

/**
 * @class "canvas.env.handler.DefaultContactsHandler"
 * @description This class is the default handler that is attached by the framework to the canvas.env.contacts object.
 *              This handler assumes that there is no contacts option available.
 */
canvas.env.handler.DefaultContactsHandler = Class(canvas.Observable, {
	/**
	 * The constructor of this class
	 */
	constructor : function (config)
	{
		canvas.core.extend(this, config);
		this.initialConfig = config;
		LOGGER.debug("Contacts State Handler set to canvas.env.handler.DefaultContactsHandler");
	},
	/**
	 * This is invoked when this object is assigned as the network handler.
	 */
	init : function (stateChanged)
	{
		// Nothing to do here.
		stateChanged.apply(canvas.env.contacts, [ 'INACTIVE' ]);
	}
});

/**
 * Register the Default Contacts handler as the adapter for Contacts monitor
 */
canvas.env.contacts.setHandler(new canvas.env.handler.DefaultContactsHandler());

/**
 * This is the class that will provide the details of the geoLocation(latitude & longitude)
 */
(function ()
{
	/**
	 * Private object that holds the location details
	 */
	var locationObj = {
		'latitude' : '',
		'longitude' : ''
	};
	/**
	 * This is passed as the callback function to the geoLocation handler for it to inform the framework that the
	 * latitude and longitude has been changed
	 */
	var locationChanged = function (latitude, longitude)
	{
		if (locationObj.latitude != latitude && locationObj.latitude != longitude)
		{
			locationObj['latitude'] = latitude;
			locationObj['longitude'] = longitude;
			canvas.MessageBus.publish('canvas.env.location.stateChanged', locationObj);
		}
	};

	var handler = undefined;

	var defaultLocationParams = {
		maximumAge : 3000,
		timeout : 500000,
		enableHighAccuracy : false
	// Default made false to avoid battery draining in mobile devices
	};

	canvas.env.location = canvas.apply({}, canvas.env.about);

	canvas.apply(canvas.env.location, {
		/**
		 * Returns the current location object. This includes latitude & longitude
		 */
		getGeoLocation : function ()
		{
			return locationObj;
		},

		/**
		 * This sets the location handler. This has to be an object that has an init() function that accepts the
		 * reference to a callback function that should be invoked whenever the object detects a change in geoLocation
		 */
		setGeoLocationHandler : function (handlerObj)
		{
			handlerObj.init(locationChanged);
			handler = handlerObj;
		},

		/**
		 * @Method getCurrentLocation
		 * @memberof "canvas.env.location"
		 * @description Invoking this API detects the current location of a user or computing device
		 * @access public
		 * @param {Object} locationDataParams This optional paramters specifies a set of options for retrieving the
		 *            location information. The keys expected in the map are -
		 *            <p>
		 *            <ul>
		 *            <li>maximumAge : Denotes the maximum age of a cached position that the application will be
		 *            willing to accept. In milliseconds, with a default value of 0, which means that an attempt must be
		 *            made to obtain a new position object immediately.</li>
		 *            <li>timeout : indicates the maximum length of time to wait for a response. In milliseconds with a
		 *            default of 0 – infinite</li>
		 *            <li>enableHighAccuracy : provides a hint that the application would like the best possible
		 *            results. This may cause a slower response time and in the case of a mobile device, greater power
		 *            consumption as it may use GPS. Boolean with a setting of false is fair</li>
		 *            </ul>
		 * @param {Function} eventCallback This is the reference to the actual function that should be called back after
		 *            getting the location. The function will receives arguments the location(position
		 *            coordinates/error)
		 * @param {Object} locationCallbackScope This refers to callback scope
		 */

		getCurrentLocation : function (locationDataParams, locationCallback, locationCallbackScope)
		{
			var appliedLocationParams = {};
			if (canvas.isObject(locationDataParams) && !canvas.isEmpty(locationDataParams))
				appliedLocationParams = canvas.apply(canvas.clone(defaultLocationParams), locationDataParams);
			else
				appliedLocationParams = defaultLocationParams;

			if (handler && handler.getCurrentLocation)
			{
				handler.getCurrentLocation(appliedLocationParams, locationCallback, locationCallbackScope);
			}

		}
	});
})();

/**
 * @class "canvas.env.handler.DefaultLocationDetector"
 * @description This class is the default handler that is attached by the framework to the canvas.env.location object.
 *              This generic default location handler written compatible for both browser and hybrid devices.
 *              <p>
 *              This handler responsible to get current location once the dom is rendered or dom content is loaded and
 *              ability to execute additional arbitrary task fetching the location on every subsequent time intervals if
 *              task is enabled.
 *              </p>
 */
canvas.env.handler.DefaultLocationDetector = Class(canvas.Observable, {
	/**
	 * The constructor of this class
	 */
	constructor : function (config)
	{
		canvas.core.extend(this, config);
		this.initialConfig = config;
	},
	/**
	 * This is invoked when this object is assigned as the location handler.
	 */
	/**
	 * @Method init
	 * @memberof "canvas.env.handler.DefaultLocationDetector"
	 * @description This is invoked when this object is assigned as the location handler.
	 * @access public
	 * @param {Function} locationChanged This is the reference to the actual function that should be called back to
	 *            indicate for location change
	 */
	init : function (locationChanged)
	{
		var _self = this;
		var defaultLocationParams = {
			maximumAge : 3000,
			timeout : 500000,
			enableHighAccuracy : false
		};
		cbx.participateInReady(function ()
		{
			var runner = new cbx.util.TaskRunner();
			var geoLocationtask = {};

			var locationTrigger = function ()
			{
				_self.getCurrentLocation({
					maximumAge : cbx.geoLocationParams.getMaximumAge(),
					timeout : cbx.geoLocationParams.getTimeout(),
					enableHighAccuracy : cbx.geoLocationParams.getAccuracy(),
				}, function (result)
				{
					runner.stopAll();
					if (cbx.geoLocationParams.getTaskEnabled())
					{
						geoLocationtask.interval = cbx.geoLocationParams.getInterval();
						runner.start(geoLocationtask);
					}
					_self.setLocationCoordinates(locationChanged, result);
				});

			}

			geoLocationtask = {
				run : function ()
				{
					locationTrigger();
				},
				interval : cbx.geoLocationParams.getInterval()
			}
			setTimeout(function ()
			{
				runner.start(geoLocationtask);
			}, cbx.geoLocationParams.getInterval());

		}, this);

		_self.getCurrentLocation(defaultLocationParams, function (result)
		{
			_self.setLocationCoordinates(locationChanged, result);
		}, this);

	},
	/**
	 * @Method setLocationCoordinates
	 * @memberof "canvas.env.handler.DefaultLocationDetector"
	 * @description This is invoked when this object is assigned as the location handler.
	 * @access public
	 * @param {Function} locationChanged This is the reference to the actual function that should be called back to
	 *            indicate for location change
	 * @param {Object} pos This is the reference to geoLocation position coordinates and timestamp
	 */
	setLocationCoordinates : function (locationChanged, pos)
	{
		var coord = pos.coords || '';
		if (coord.latitude && coord.longitude)
		{
			locationChanged.apply(canvas.env.location, [ coord.latitude, coord.longitude ]);
		} else
		{
			locationChanged.apply(canvas.env.location, [ '', '' ]);
		}
	},
	/**
	 * @Method getCurrentLocation
	 * @memberof "canvas.env.handler.DefaultLocationDetector"
	 * @description Retrieves the current geographic location of the device. The location is expressed as a set of
	 *              geographic coordinates together with information about heading and speed. The location information
	 *              is returned in a Position object.
	 * @access public
	 * @param {Object} appliedLocationParams Paramter specifies a set of options for retrieving the location information
	 * @param {Function} callBack This is the reference to the actual function that should be called back to indicate
	 *            for location change
	 * @param {Object} callBackScope This refers to callback function scope
	 */
	getCurrentLocation : function (appliedLocationParams, callBack, callBackScope)
	{

		var successFn = function (pos)
		{
			if (!canvas.isEmpty(callBack) && canvas.isFunction(callBack))
				callBack.apply(callBackScope || this, [ pos ]);
		}

		var errorFn = function (error)
		{
			if (!canvas.isEmpty(callBack) && canvas.isFunction(callBack))
				callBack.apply(callBackScope || this, [ error ]);
		}

		if (navigator !== undefined && navigator.geolocation !== undefined && navigator.geolocation.getCurrentPosition)
		{
			navigator.geolocation.getCurrentPosition(successFn, errorFn, appliedLocationParams);
		} else
		{
			errorFn('POSITION_UNAVAILABLE');
		}
	}

});

/**
 * Register the Default location detector as the adapter for location monitor
 */
if(document.URL.indexOf('http://') > -1 || document.URL.indexOf('https://') > -1){
	canvas.env.location.setGeoLocationHandler(new canvas.env.handler.DefaultLocationDetector());	
}

