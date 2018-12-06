/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. These materials are confidential and proprietary
 * to Intellect Design Arena Limited and no part of these materials should be reproduced, published, transmitted or
 * distributed in any form or by any means, electronic, mechanical, photocopying, recording or otherwise, or stored in
 * any information storage or retrieval system of any nature nor should the materials be disclosed to third parties or
 * used in any other manner for which this is not authorized, without the prior express written authorization of
 * Intellect Design Arena Limited.
 */

/**
 * @class "canvas"
 * @description This class acts as a stub to the canvas.MessageBus. This is used for communication across iFrames
 *              through the postMessage API. This script is loaded within the iFrame and interacts with its parent using
 *              the postMessage API.
 *              <p>
 *              It is expected that the developer changes the value for canvas.trustedOrigin to the actual URL of the
 *              main application into which they are present as an iFrame. After loading this Javascript, a sample code
 *              snippet to the extent
 *              <p>
 *              canvas.trustedOrigin = "https://www.abcdef.com:8080";
 *              <p>
 *              where https://www.abcdef.com:8080 is the URL of the main Canvas application
 *              <p>
 *              To subscribe to a event, a sample code snippet is -
 *              <p>
 *              canvas.MessageBus.subscribe(eventName, callback, scope)
 *              <p>
 *              where <b>eventName</b> is the string that corresponds to the event name, <b>callback</b> is the
 *              function that should be called when this event is published and <b>scope</b> (optional) is the object
 *              in whose scope the <b>callback</b> should be invoked.
 *              <p>
 *              To unsubscribe to a event, a sample code snippet is -
 *              <p>
 *              canvas.MessageBus.unsubscribe(eventName)
 *              <p>
 *              where <b>eventName</b> is the string that corresponds to the event name.
 *              <p>
 *              To publish an event, a sample code snippet is -
 *              <p>
 *              canvas.MessageBus.publish(eventName, data)
 *              <p>
 *              where <b>eventName</b> is the string that corresponds to the event name, <b>data</b> is the object
 *              that is to be shared to all interested parties.
 */
var canvas = {
	// Indicates the trusted origin. This should be replaced with the right URL by the Third party application.
	trustedOrigin : '*',
	isString : function (obj)
	{
		return Object.prototype.toString.apply(obj) === "[object String]";
	},
	isObject : function (v)
	{
		return !!v && Object.prototype.toString.call(v) === '[object Object]';
	},
	isArray : function (v)
	{
		return Object.prototype.toString.apply(v) === '[object Array]';
	},
	isEmpty : function (v, allowBlank)
	{
		return v === null || v === undefined || (canvas.isObject(v) && !(Object.keys(v).length))
					|| ((canvas.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
	},
	isDefined : function (v)
	{
		return typeof v !== 'undefined';
	},
	isDate : function (v)
	{
		return Object.prototype.toString.apply(v) === '[object Date]';
	},
	isBoolean : function (v)
	{
		return typeof v === 'boolean';
	},
	encoder : new (function ()
	{
		var useHasOwn = !!{}.hasOwnProperty, isNative = function ()
		{
			var useNative = null;
			return function ()
			{
				if (useNative === null)
				{
					useNative = window.JSON && JSON.toString() == '[object JSON]';
				}

				return useNative;
			};
		}(), pad = function (n)
		{
			return n < 10 ? "0" + n : n;
		}, doDecode = function (json)
		{
			if (json && canvas.isString(json))
			{
				return eval("(" + json + ")")
			} else
			{
				return json;
			}
		},
		/**
		 * 
		 */
		doEncode = function (o)
		{
			if (!canvas.isDefined(o) || o === null)
			{
				return "null";
			} else if (canvas.isArray(o))
			{
				return encodeArray(o);
			} else if (canvas.isDate(o))
			{
				return canvas.encoder.encodeDate(o);
			} else if (canvas.isString(o))
			{
				return encodeString(o);
			} else if (typeof o == "number")
			{
				return isFinite(o) ? String(o) : "null";
			} else if (canvas.isBoolean(o))
			{
				return String(o);
			} else
			{
				var a = [ "{" ], b, i, v;
				for (i in o)
				{
					if (!o.getElementsByTagName)
					{
						if (!useHasOwn || o.hasOwnProperty(i))
						{
							v = o[i];
							switch (typeof v)
							{
								case "undefined":
								case "function":
								case "unknown":
									break;
								default:
									if (b)
									{
										a.push(',');
									}
									a.push(doEncode(i), ":", v === null ? "null" : doEncode(v));
									b = true;
							}
						}
					}
				}
				a.push("}");
				return a.join("");
			}
		},
		/**
		 * 
		 */
		m = {
			"\b" : '\\b',
			"\t" : '\\t',
			"\n" : '\\n',
			"\f" : '\\f',
			"\r" : '\\r',
			'"' : '\\"',
			"\\" : '\\\\'
		},
		/**
		 * 
		 */
		encodeString = function (s)
		{
			if (/["\\\x00-\x1f]/.test(s))
			{
				return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b)
				{
					var c = m[b];
					if (c)
					{
						return c;
					}
					c = b.charCodeAt();
					return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
				}) + '"';
			}
			return '"' + s + '"';
		},
		/**
		 * 
		 */
		encodeArray = function (o)
		{
			var a = [ "[" ], b, i, l = o.length, v;
			for (i = 0; i < l; i += 1)
			{
				v = o[i];
				switch (typeof v)
				{
					case "undefined":
					case "function":
					case "unknown":
						break;
					default:
						if (b)
						{
							a.push(',');
						}
						a.push(v === null ? "null" : canvas.encoder.encode(v));
						b = true;
				}
			}
			a.push("]");
			return a.join("");
		};
		this.encodeDate = function (o)
		{
			return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T"
						+ pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';
		};
		this.encode = function ()
		{
			var ec;
			return function (o)
			{
				try
				{
					if (!ec)
					{
						ec = isNative() ? JSON.stringify : doEncode;
					}
					return ec(o);
				} catch (err)
				{
					// LOGGER.error('While cbx.encode', err);
				}
			};
		}();
		this.decode = function ()
		{
			var dc;
			return function (json)
			{
				try
				{
					if (!dc)
					{

						dc = isNative() ? JSON.parse : doDecode;
					}
					return dc(json);
				} catch (err)
				{
					// LOGGER.error('While canvas.decode', err);
				}
			};
		}();
	})(),
	MessageBus : new (function ()
	{
		var _iFrameName = "";
		var _iFrameUid = "";
		var eventRegistry = {};
		var _handshakeDone = false;
		var _msgQueue = [];
		// Another cross browser hack. Let us ensure that the window.location.origin is present.
		if (!window.location.origin)
		{
			window.location.origin = window.location.protocol + "//" + window.location.hostname
						+ (window.location.port ? ':' + window.location.port : '');
		}
		
		var sendMessageToParent = function (data)
		{
			//Check if handshake is done. If not, queue it up, as we can send out the messages only after handshake.
			// Boundary check. If action is handshake, allow to continue!
			if (data.action !== 'handshake' && !_handshakeDone)
			{
				_msgQueue.push(data);
				return;
			}
			
			// Try posting first as a data object. If that does not work, then change it to a string.
			try
			{
				window.parent.postMessage(data, canvas.trustedOrigin);
			} catch (e)
			{
				try
				{
					window.parent.postMessage(canvas.encoder.encode(data), canvas.trustedOrigin);
				} catch (e)
				{
					// LOGGER.error("Caught error while posting message to iFrame :", data, " Exception is ", e);
				}
			}
		};
		var drainMsgQueue = function()
		{
			
			
			//drain out all the messages from the queue.
			_msgQueue.forEach(function(item) {
				item.name = _iFrameName;
				item.uid = _iFrameUid;
				sendMessageToParent(item);
			});
			_msgQueue = [];
		}
		var handshakeReceived = function (payload, event)
		{
			_iFrameName = payload.name;
			_iFrameUid = payload.uid;
			_parentLocation = payload.parentLocation;
			// Change the trusted origin to the location received through the payload.
			canvas.trustedOrigin = payload.parentLocation;
			_handshakeDone = true;
			// In case there are any queued exchanges, close it out.
			drainMsgQueue();
			
		};
		var publishReceived = function (payload, event)
		{
			if (eventRegistry[payload.eventname])
			{
				// So we have a match to the event name. So invoke the handler provided here.
				var callbackConfig = eventRegistry[payload.eventname];
				if (callbackConfig)
				{
					callbackConfig.forEach(function (aCallBack)
					{
						aCallBack.fn.call(aCallBack.scope, payload.data, payload.eventname);
					});
				}
			}
		};
		var messageReceived = function (event)
		{
			var origin = event.origin;
			if (canvas.trustedOrigin === '*' || canvas.trustedOrigin === origin)
			{
				// Cool origin matches. Ensure that the message comes only from the parent.
				if (event.source !== window.parent)
				{
					//Message has come from an different window. ignore the same.
					return;
				}
				//Handle the payload properly.
				var payload = event.data;
				if (canvas.isString(payload))
				{
					// So we received a serialized data. So decode the same.
					payload = canvas.encoder.decode(payload);
				}
				if (!canvas.isObject(payload))
				{
					// Payload received for is not a valid JSON object. So ignoring this message.
					return;
				}
				if (canvas.isEmpty(payload.action))
				{
					// Invalid data packet received. 'action' key not present in data
					return;
				}
				// Switch based on the action.
				switch (payload.action)
				{
					case "handshake":
						handshakeReceived(payload, event);
						break;
					case "publish":
						publishReceived(payload, event);
						break;
					default:
						// "Invalid action ", payload.action, " received. Cannot process message."
				}
			}
		};
		var _initializeFailed = false;
		// Attach to the message event.
		if (window.addEventListener)
		{ // all browsers except IE before version 9
			window.addEventListener("message", messageReceived, false);
		} else
		{
			if (window.attachEvent)
			{ // IE before version 9
				window.attachEvent("onmessage", messageReceived);
			} else
			{
				_initializeFailed = true;
			}
		}
		

		return {
			init : function(){
				if (!_initializeFailed)
				{
					var payload = {
						action : 'handshake'
					};
					sendMessageToParent(payload);
				}
			},
		
			/**
			 * @Method subscribe
			 * @memberof "canvas.MessageBus"
			 * @description
			 *           <p>
			 *           Subscribe to the event with a callback handler.
			 * @access public
			 * @param {String} eventName The name of the event to which the caller is subscribing to.
			 * @param {Function} callback This is the reference to the actual function that should be called back when
			 *            the event is raised. The function will receive two arguments (in the same order),
			 *            <p>
			 *            data : This is the data that was passed for the event, and
			 *            <p>
			 *            eventName : This is the name of the event.
			 * @param {Object} scope This is the scope within which the callback is to be invoked. This cannot be null.
			 */
			subscribe : function (eventName, callback, scope)
			{
				if (_initializeFailed)
					return;
				var payload = {
					action : 'subscribe',
					name : _iFrameName,
					uid : _iFrameUid,
					data : {
						eventname : eventName
					}
				};
				if (!eventRegistry[eventName])
					eventRegistry[eventName] = [];
				eventRegistry[eventName].push({
					fn : callback,
					scope : scope
				});
				sendMessageToParent(payload);
			},
			/**
			 * @Method ubsubscribe
			 * @memberof "canvas.MessageBus"
			 * @description
			 *           <p>
			 *           Unsubscribe to the event
			 * @access public
			 * @param {String} eventName The name of the event to which the caller is unsubscribing from.
			 */
			unsubscribe : function (eventName)
			{
				if (_initializeFailed)
					return;
				var payload = {
					action : 'unsubscribe',
					name : _iFrameName,
					uid : _iFrameUid,
					data : {
						eventname : eventName
					}
				};
				sendMessageToParent(payload);
				if (eventRegistry[eventName])
					delete eventRegistry[eventName];
			},
			/**
			 * @Method publish
			 * @memberof "canvas.MessageBus"
			 * @description
			 *           <p>
			 *           Publish / broadcast an event
			 * @access public
			 * @param {String} eventName The name of the event that has to be published.
			 * @param {Object} data This is the event payload that needs to be passed on to all its subscribers
			 */
			publish : function (eventName, data)
			{
				if (_initializeFailed)
					return;
				var payload = {
					action : 'publish',
					name : _iFrameName,
					uid : _iFrameUid,
					data : {
						eventname : eventName,
						eventdata : data
					}
				};
				sendMessageToParent(payload);
			}
		};

	})()
};
window.onload = canvas.MessageBus.init;
