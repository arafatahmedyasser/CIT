/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */
canvas.ns('canvas.comm');

/**
 * @class "canvas.comm.MessageBusProxy"
 * @description This class acts as a proxy to the MessageBus. This is used for communication across iFrames through the
 *              postMessage API. This establishes a standard means of communication with the third party content loaded
 *              within the iFrame and ensures that there is a smooth communication between the iFrame and the main
 *              application.
 */
canvas.comm.MessageBusProxy = Class(canvas.Observable,
{
	initConfig : null,
	trustedOrigin : null,
	iFrameWindow : null,
	iFrameName : null,
	iFrameUniqueId : null,
	nameSpace : null,
	eventsList : [],
	_initializeFailed : false,
	/**
	 * @Method constructor
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description The constructor of this class.
	 * @access public
	 * @param {Object} config The initialization parameters needed for the message proxy to function.
	 */
	constructor : function (config)
	{
		// Store a reference to our object.
		LOGGER.info("proxy constructor - that =", that);
		this.initConfig = config;
		// If there is no domain URL provided, then treat it as equivalent of trust everything.
		this.trustedOrigin = this.initConfig.domainUrl || '*';
		this.iFrameWindow = this.initConfig.window || null;
		this.iFrameName = this.initConfig.windowName;
		// Another cross browser hack. Let us ensure that the window.location.origin is present.
		if (!window.location.origin)
		{
			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
		}
			
		// Let's create a unique ID for the iframe. This we will exchange at the beginning with the iFrame.
		// For every
		// load within the iFrame when the MessageBusStub loads, it will send out a message to the parent
		// asking for the
		// id. this Id will be passed back for it to send it as part of every request.
		this.iFrameUniqueId = canvas.id();
		this.nameSpace = this.iFrameName + '.' + this.iFrameUniqueId;
		canvas.comm.MessageBusProxy.$super.call(this);
		this.initEventListener();
	},
	/**
	 * @Method initEventListener
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description Initialize the event listener for the message event.
	 * @access private
	 */
	initEventListener : function ()
	{
		var that = this;
		var messageRecdScopeChanger = function(event)
		{
			// Ensure that the call us passed to the actual implementation
			that.messageReceived.call(that, event);
		}
		this.on('destroy', this.proxyDestroyed, this);
		this._initializeFailed = false;
		// Attach to the message event.
		if (window.addEventListener)
		{ // all browsers except IE before version 9
			window.addEventListener("message", messageRecdScopeChanger, false);
		} else
		{
			if (window.attachEvent)
			{ // IE before version 9
				window.attachEvent("onmessage", messageRecdScopeChanger);
			} else
			{
				this._initializeFailed = true;
				LOGGER.error("Unable to listen to the window.message() event. Could be a case of non supported browser.");
			}
		}
	},
	/**
	 * @Method cleanupEvents
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description Helper method to unsubscribe all the events registerd with Message Bus till now.
	 * @access private
	 */
	cleanupEvents : function()
	{
		for (var i = 0, len = this.eventsList.length; i < len; i++)
		{
			canvas.MessageBus.unsubscribe(this.eventsList[i], this.nameSpace, this);
		}
	},
	/**
	 * @Method proxyDestroyed
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description Called whenever this proxy class is destroyed. Here we do the necessary cleanup
	 * @access private
	 */
	proxyDestroyed : function ()
	{
		if (!this._initializeFailed)
		{
			// Remove to the message event.
			if (window.removeEventListener)
			{ // all browsers except IE before version 9
				window.removeEventListener("message", this.messageReceived);
			} else
			{
				if (window.detachEvent)
				{ // IE before version 9
					window.detachEvent("onmessage", this.messageReceived);
				} else
				{
					LOGGER.error("Unable to remove event handler. Could be a case of non supported browser.");
				}
			}
			this.cleanupEvents();
			delete this.initConfig;
			delete this.trustedOrigin;
			delete this.iFrameWindow;
			delete this.iFrameName;
			delete this.iFrameUniqueId;
			delete this.eventsList;
		}
	},
	/**
	 * @Method messageReceived
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description method that is provided as the handler to the "message" event.
	 * @access private
	 */
	messageReceived : function (event)
	{
		// This is the event handler that is invoked when the message is received by the parent window.
		// First check whether we are even supposed to handle this event.
		var origin = event.origin;
		if (this.trustedOrigin === '*' || this.trustedOrigin === origin)
		{
			// So this could be our message. Check whether the window is our monitoring window.
			this.iFrameWindow = this.iFrameWindow || window.frames[this.iFrameName];
			//Check that the event source window and our window are the same.
			if (event.source !== this.iFrameWindow)
			{
				LOGGER.debug("Event Source window is ", event.source, " while our window is ", this.iFrameWindow);
				return;
			}
			
			// First ensure that this does not propagate further to other handlers that may be present.
			if (event.preventDefault)
				event.preventDefault();
			// Prepare the data. The data is expected to be sent in following pattern -
			// { action : 'string' (one of 'handshake', 'subscribe', 'unsubscribe', 'publish'),
			// name : 'string' (name of the iframe as detected by the third party content)
			// uid : 'string' (the Unique Id assigned to the frame by the canvas container as part of the
			// initial exchange)
			// data : 'json object' (The actual payload corresponding to this event.)
			// }
			
			var payload = event.data;
			// Some versions of IE does not supporting sending data as an object. Instead it expects to 
			// be serialized as String. So check for it.
			if (canvas.core.isString(payload))
			{
				// So we received a serialized data. So decode the same.
				payload = canvas.decode(payload);
			}
			if (!canvas.core.isObject(payload))
			{
				LOGGER.error("Payload received for ", this.iFrameName,
							" is not a valid JSON object. So ignoring this message.", payload);
				return;
			}
			if (canvas.isEmpty(payload.action))
			{
				LOGGER.error("Invalid data packet received. 'action' key not present in data.", payload);
				return;
			}
			if (payload.action !== 'handshake' && this.iFrameName !== payload.name)
			{
				LOGGER.error("Invalid data packet received. 'name' provided ", payload.name, " in data ", payload
							, " does not match properly with iFrameName.", this.iFrameName);
				return;
			}
			if (payload.action !== 'handshake' && this.iFrameUniqueId !== payload.uid)
			{
				LOGGER.error("Invalid data packet received. 'uid' provided ", payload.uid, " in data ", payload
							, " does not match properly with iFrameId.", this.iFrameUniqueId);
				return;
			}
			// Switch based on the action.
			switch (payload.action)
			{
				case "handshake" : 
					this.handshakeReceived(payload, event);
					break;
				case "subscribe" :
					this.subscribeReceived(payload, event);
					break;
				case "unsubscribe" : 
					this.unsubscribeReceived(payload, event);
					break;
				case "publish" :
					this.publishReceived(payload, event);
					break;
				default : 
					LOGGER.error("Invalid action ", payload.action, " received. Cannot process message.", payload);
			}
		} else
		{
			// TODO: This logger is to be removed at a later point in time. Purely added for debugging
			// purposes.
			LOGGER.debug("Origin received is ", origin, " while the trusted origin is ", this.trustedOrigin,
						". So ignoring message.");
		}
	},
	/**
	 * @Method proxySubscribeHandler
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description method that is actually registered with the MessageBus for receiving the event data packet.
	 * @access private
	 * @param {Object} data The data received when the MessageBus invokes this handler
	 * @param {Object} eventName The event name.
	 */
	proxySubscribeHandler: function(data, eventName)
	{
		// The only job here is to package it and send it across to the iframe.
		var payload = {
			action : 'publish',
			name : this.iFrameName,
			uid : this.iFrameUniqueId,
			eventname : eventName,
			data : data
		};
		this.sendMessageToIFrame(payload);
	},
	/**
	 * @Method sendMessageToIFrame
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description method that posts a message to the iFrame.
	 * @access private
	 * @param {Object} data The data to be sent
	 */
	sendMessageToIFrame : function(data)
	{
		// Try posting first as a data object. If that does not work, then change it to a string.
		try
		{
			this.iFrameWindow.postMessage(data, this.trustedOrigin);
		} catch (e)
		{
			try 
			{
				var msg = canvas.encode(data);
				this.iFrameWindow.postMessage(msg, this.trustedOrigin);
			} catch (e)
			{
				LOGGER.error("Caught error while posting message to iFrame :", data, " Exception is ", e);
			}
		}
	},
	/**
	 * @Method handshakeReceived
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description method that handles the handshake request received from the iFrame.
	 * @access private
	 * @param {Object} payload The data received through the event
	 * @param {Object} event The event object received as part of the message notification
	 */
	handshakeReceived : function(payload, event)
	{
		// Handshake is invoked from the iFrame. As part of this, send back the unique Id back to the iFrame
		// so that it can use it for all subsequent interactions. 
		var newpayload = {
			action : 'handshake',
			name : this.iFrameName,
			uid : this.iFrameUniqueId,
			parentLocation : window.location.origin,
			data : {}
		};
		// Retrieve the location received and use that as the trusted origin from here on.
		this.trustedOrigin = event.origin;
		this.sendMessageToIFrame(newpayload);
		// There is a chance that the iframe content could be reloading its content every time. So, keep 
		// removing any earlier interapp handlers that may be attached.
		this.cleanupEvents();
	},
	/**
	 * @Method subscribeReceived
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description method that handles the subscribe request received from the iFrame.
	 * @access private
	 * @param {Object} payload The data received through the event
	 * @param {Object} event The event object received as part of the message notification
	 */
	subscribeReceived : function(payload, event)
	{
		var eventname = payload.data.eventname;
		canvas.MessageBus.subscribe(eventname, this.nameSpace, this, this.proxySubscribeHandler);
		this.eventsList.push(eventname);
	},
	/**
	 * @Method unsubscribeReceived
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description method that handles the unsubscribe request received from the iFrame.
	 * @access private
	 * @param {Object} payload The data received through the event
	 * @param {Object} event The event object received as part of the message notification
	 */
	unsubscribeReceived : function(payload, event)
	{
		var eventname = payload.data.eventname;
		canvas.MessageBus.unsubscribe(eventname, this.nameSpace, this);
		for (var i = 0, len = eventsList.length; i < len; i++)
		{
			if (this.eventsList[i] === eventname)
			{
				this.eventsList.splice(i, 1);
				break;
			}
		}
	},
	/**
	 * @Method publishReceived
	 * @memberof "canvas.comm.MessageBusProxy"
	 * @description method that handles the publish request received from the iFrame. This expects the data
	 *              to have the following structure -
	 *              <p> { data : {
	 *              				eventname : 'string' //name of the event to be published
	 *              				eventdata : 'object' //The data of the event. This is optional
	 *              			 }
	 *              	}
	 * @access private
	 * @param {Object} payload The data received through the event
	 * @param {Object} event The event object received as part of the message notification
	 */
	publishReceived : function(payload, event)
	{
		var eventName = payload.data.eventname;
		var data = payload.data.eventdata || {};
		if (eventName)
		{
			LOGGER.debug('Publishing ', eventName, ' with ', data, ' from Proxy for ', this.iFrameName);
			canvas.MessageBus.publish(eventName, data);
		} else
		{
			LOGGER.error('Publish request recieved from ', this.iFrameName, ' without any event name. Payload is ', data);
		}
	}
});
