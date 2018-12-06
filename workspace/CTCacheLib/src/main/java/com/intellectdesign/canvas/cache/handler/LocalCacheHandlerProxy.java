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
package com.intellectdesign.canvas.cache.handler;

import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This is an implementation of the Cache handler proxy that enables direct interaction with the handler of the cache.
 * The typical logic would be to just route the call to the cache handler directly.
 * 
 * @version 1.0
 */
public final class LocalCacheHandlerProxy implements ICacheHandlerProxy
{
	/**
	 * this is ref to intitCache
	 * 
	 * @param hashmap proxyparms
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#initializeCache(java.util.HashMap)
	 */
	public List initializeCache(HashMap proxyParams)
	{
		return getHandler().initializeCache(proxyParams);
	}

	/**
	 * this is ref to return LocalcacheHandlerProxy Validparameters
	 * 
	 * @param validparams
	 * @return gethandler
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#validateParameters(java.util.HashMap)
	 */
	public String validateParameters(HashMap params)
	{
		return getHandler().validateParameters(params);
	}

	/**
	 * This method will be invoked by the Cache if it wants the handler to check the validity of the data. If the
	 * handler feels that the data is not valid, it expects the refreshed data to be returned back. If the handler feels
	 * that the data is valid, then expects null to be returned.
	 * 
	 * @param proxyParams The params for the proxy for it to use accordingly
	 * @return List The list of data for the cache
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#checkAndGetUpdatedData(java.util.HashMap)
	 */
	public List checkAndGetUpdatedData(HashMap proxyParams)
	{
		// Check if there is a state provided. If yes, pass it on to the handler.
		if (proxyParams.containsKey(CacheConstants.OBJECT_HANDLER_STATE))
		{
			getHandler().setHandlerState((HashMap) proxyParams.get(CacheConstants.OBJECT_HANDLER_STATE));
		}
		if (!getHandler().isCacheUptoDate())
		{
			return getHandler().initializeCache(proxyParams);
		}
		return null;
	}

	/**
	 * This method will be invoked when the Cache or another proxy wishes to retrieve the handler state. Typically
	 * validating cache handlers are the ones that will have a state. Other handlers typically return null
	 * 
	 * @return HashMap the state of the handler.
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#getHandlerState()
	 */
	public HashMap getHandlerState()
	{
		return getHandler().getHandlerState();
	}

	/**
	 * this is ref to SetParameter to Hashmap
	 * 
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#setParameters(java.util.HashMap)
	 */
	public void setParameters(HashMap params)
	{
		getHandler().setParameters(params);
	}

	/**
	 * this is ref to return GetParameterCacheHandlers
	 * 
	 * @return handler
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#getParameters()
	 */
	public HashMap getParameters()
	{
		return getHandler().getParameters();
	}

	/**
	 * this is ref to SetCacheHandlers Icache
	 * 
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#setHandlerClass(java.lang.String)
	 */
	public void setHandlerClass(String handlerClass)
	{
		try
		{
			Class aClass = Class.forName(handlerClass);
			CacheDataBuilder handler = (CacheDataBuilder) aClass.newInstance();
			setHandler(handler);
		} catch (Exception ex)
		{
			// Ideally this should never occur as the handler class has been validated earlier and found to be proper.
			// So this has been added more from compilation purposes
			LOGGER.cterror("CTCAC00018", ex, handlerClass);
		}
	}

	/**
	 * Test whether the handler class can be loaded and inheritance of the same has been defined properly.
	 * 
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#validateHandlerClass(java.lang.String)
	 */
	public String validateHandlerClass(String handlerClass)
	{
		String errors = null;
		try
		{
			// Test loading of the class
			Class aClass = Class.forName(handlerClass);
			// Test the inheritance hierarchy of the class.
			if (!CacheDataBuilder.class.isAssignableFrom(aClass))
			{
				// Inheritance check failed. State proper error.
				errors = "getHandler The handler class provided - '"
						+ handlerClass
						+ "' is not a sub class of com.intellectdesign.canvas.constants.cache.handler.CacheHandler. Please make the handler class inherit from CacheHandler";
			}
		} catch (ClassNotFoundException cnfe)
		{
			LOGGER.cterror("CTCAC00033", cnfe, handlerClass);
			// Eating the exception here as we do not want this method to throw any exceptions
		} catch (SecurityException se)
		{
			LOGGER.cterror("CTCAC00034", se, handlerClass);
			// Eating the exception here as we do not want this method to throw any exceptions
		}
		return errors;
	}

	/**
	 * Returns the cached instance of the handler
	 * 
	 * @return The handler
	 */
	private CacheDataBuilder getHandler()
	{
		return mHandler;
	}

	/**
	 * Stores the reference to the handler created
	 * 
	 * @param handler The handler object
	 */
	private void setHandler(CacheDataBuilder handler)
	{
		mHandler = handler;
	}

	/**
	 * Local storage of the Cache Handler object.
	 */
	private CacheDataBuilder mHandler;

	/**
	 * The logger used by this class
	 */
	private static final Logger LOGGER = Logger.getLogger(LocalCacheHandlerProxy.class);
}
