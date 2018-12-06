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
cbx.ns('canvas.app.formview.Listener');

/**
 * Base class that will be extended for coding form listeners.
 * 
 */
canvas.app.formview.Listener = Class(cbx.Observable, {
	constructor : function (config)
	{
		cbx.core.extend(this, config);
		canvas.app.formview.Listener.$super.call(this);
	},
	registerListener : function (appId, event, listner, scope)
	{
		var event = appId + '_' + event;
		canvas.app.formview.Listener.$superp.registerListener.call(this, event, listner, scope);
	},
	raiseEvent : function (appId, event)
	{
		var event = appId + '_' + event;
		canvas.app.formview.Listener.$superp.raiseEvent.call(this, event, Array.prototype.slice.call(arguments, 2));
	},
	purgeListeners : function (appId, event, scope)
	{
		var event = appId + '_' + event;
		canvas.app.formview.Listener.$superp.purgeListeners.call(this, event, listner, scope);
	},
	on : function (appId, event, listner, scope)
	{
		var event = appId + '_' + event;
		canvas.app.formview.Listener.$superp.registerListener.call(this, event, listner, scope);
	}
});
