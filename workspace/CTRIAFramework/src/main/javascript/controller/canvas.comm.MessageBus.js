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
 * @class "canvas.comm.MessageBus"
 * @description This class provides the Publish - Subscribe capability that is to be made available as a default
 *              behavior for various Apps (and non-App functionality too) to communicate with each other.
 */
canvas.comm.MessageBus = function ()
{
	var _registry = {};
	return {
		/**
		 * @Method subscribe
		 * @memberof "canvas.comm.MessageBus"
		 * @description
		 *           <p>
		 *           Subscribe to the event with a callback handler.
		 * @access public
		 * @param {String} eventName The name of the event to which the caller is subscribing to.
		 * @param {String} namespace The namespace within which the caller is expected to be unique. So if there is a
		 *            second call to this method where the combination of namespace and scope exists, the earlier one
		 *            will be replaced with the new one.
		 * @param {Object} scope This is the scope within which the callback is to be invoked. This cannot be null.
		 * @param {Function} callback This is the reference to the actual function that should be called back when the
		 *            event is raised. The function will receive two arguments (in the same order),
		 *            <p>
		 *            data : This is the data that was passed for the event, and
		 *            <p>
		 *            eventName : This is the name of the event.
		 */
		subscribe : function (eventName, namespace, scope, callback)
		{
			if (_registry[eventName] == null)
			{
				_registry[eventName] = [];
			}
			var nsRegistered = false;
			for (var i = _registry[eventName].length - 1; i >= 0; i--)
			{
				if (_registry[eventName][i].ns === namespace)
				{
					// Replace the earlier callback reference with the newly provided one.
					_registry[eventName][i] = {
						fn : callback,
						scope : scope,
						ns : namespace
					};
					nsRegistered = true;
				}
			}
			// Name space was not registered yet. Add it to the registry.
			if (nsRegistered === false)
			{
				_registry[eventName].push({
					fn : callback,
					scope : scope,
					ns : namespace
				});
			}
			LOGGER.info("MessageBus subscribe Registry: ",_registry);

		},
		/**
		 * @Method ubsubscribe
		 * @memberof "canvas.comm.MessageBus"
		 * @description
		 *           <p>
		 *           Unsubscribe to the event
		 * @access public
		 * @param {String} eventName The name of the event to which the caller is unsubscribing from.
		 * @param {String} namespace The namespace within which the caller is expected to be unique. The scope provided
		 *            along with the namespace will be used to perform the unsubscribe action
		 * @param {Object} scope This is the scope within which the callback is to be invoked. Refer to the comment on
		 *            namespace for this parameter's relevance
		 */
		unsubscribe : function (eventName, namespace, scope)
		{
			if (eventName && _registry[eventName])
			{
				var handlers = _registry[eventName];
				for (var i = 0, len = handlers.length; i < len; i++)
				{
					if (handlers[i] != null && handlers[i].ns == namespace)
					{
						handlers.splice(i, 1);
						break;
					}
				}
			}
		},
		/**
		 * @Method publish
		 * @memberof "canvas.comm.MessageBus"
		 * @description
		 *           <p>
		 *           Publish / broadcast an event
		 * @access public
		 * @param {String} eventName The name of the event that has to be published.
		 * @param {Object} data This is the event payload that needs to be passed on to all its subscribers
		 */
		publish : function (eventName, data)
		{
			var handlers = _registry[eventName];
			LOGGER.info("MessageBus publish Registry: ",_registry);
			if (handlers != null && canvas.isArray(handlers))
			{
				var callback = null;
				for (var i = 0, len = handlers.length; i < len; i++)
				{
					try
					{
						callback = handlers[i];
						if (callback != null)
						{
							return callback.fn.call(callback.scope, data, eventName);
						}
					} catch (e)
					{
						LOGGER.info("Eating error caught while processing event ", eventName, " for namespace ",
									callback.ns, e);
					}
				}
			}
		}
	};
}();

/**
 * Providing a short hand for quick access to MessageBus instead of having to go through the package structure.
 */
canvas.MessageBus = canvas.comm.MessageBus;

/**
 * For backward compatibility, redefining the cbx.CommManager to use the MessageBus.
 */
cbx.CommManager = function ()
{
	return {
		registerHandler : function (event, ns, scope, callback)
		{
			canvas.MessageBus.subscribe(event, ns, scope, callback);
		},
		raiseEvent : function (event, data)
		{
			canvas.MessageBus.publish(event, data);
		},
		removeHandler : function (event, ns, scope)
		{
			canvas.MessageBus.unsubscribe(event, ns, scope);
		}
	};
}();
