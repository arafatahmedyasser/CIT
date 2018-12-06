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

import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.cache.bean.CacheDelegateHome;
import com.intellectdesign.canvas.cache.bean.CacheDelegateRemote;
import com.intellectdesign.canvas.config.CacheConfigurationDescriptor;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.remotefactory.EJBHomeFactory;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;

/**
 * This class is an implementation of the Cache handler proxy that operates on a remote basis. It does not have the
 * handler reference with it. Instead it makes a bean call every time to evaluate the same.
 * 
 * @version 1.0
 */
public final class RemoteCacheHanderProxy implements ICacheHandlerProxy
{
	/**
	 * Default constructor. Here we ensure that the EJB Factory is initialized properly for the bean lookup that we are
	 * interested in using
	 */
	public RemoteCacheHanderProxy()
	{
		// For this to work, we need to ensure that our Bean is registered with the EJBHomeFactory. Let us do that.
		CacheConfigurationDescriptor descriptor = ConfigurationManager.getInstance().getCacheDescriptor();
		EJBHomeFactory.getInstance().registerHomeDetails(CacheDelegateHome.class.getName(),
				descriptor.getInitialContextMap(), descriptor.getJndiName());
	}

	/**
	 * Store the handler class name provided
	 * 
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#setHandlerClass(java.lang.String)
	 */
	public void setHandlerClass(String handlerClass)
	{
		mHandlerClass = handlerClass;
	}

	/**
	 * Validate that the handler class can be invoked.
	 * 
	 * @param Str HandlerClass
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#validateHandlerClass(java.lang.String)
	 */
	public String validateHandlerClass(String handlerClass)
	{
		String errors = null;
		CacheDelegateRemote cacheRemote = getHandler();
		// In case the remote is null, this could be due to a invalid cached home object. So try to get the same again
		if (cacheRemote == null)
		{
			cacheRemote = getHandler();
		}

		// Sanity check.
		if (cacheRemote != null)
		{
			try
			{
				errors = cacheRemote.validateHandlerClass(handlerClass);
			} catch (RemoteException e)
			{
				errors = "Error during remote communication for validating handler class. Please check the deployment and server logs";
				LOGGER.cterror("CTCAC00035", e, handlerClass);
			}
		} else
		{
			errors = "Unable to create Remote class for validation. Please check the deployment and server logs";
		}
		return errors;
	}

	/**
	 * Gets the data for the cache
	 * 
	 * @return value
	 * @param proxyParams The parameters for fetching the cache data
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#initializeCache(java.util.HashMap)
	 */
	public List initializeCache(HashMap proxyParams)
	{
		List retVal = null;
		// Step 1: Check that we have remote connectivity.
		CacheDelegateRemote cacheRemote = getHandler();
		// In case the remote is null, this could be due to a invalid cached home object. So try to get the same again
		if (cacheRemote == null)
		{
			cacheRemote = getHandler();
		}

		// Sanity check.
		if (cacheRemote != null)
		{
			try
			{
				prepareRemoteParams(proxyParams);
				retVal = cacheRemote.initializeCache(proxyParams);
			} catch (RemoteException e)
			{
				LOGGER.cterror("CTCAC00036", e, proxyParams);
			}
		} else
		{
			LOGGER.cterror("CTCAC00019");
		}
		return retVal;
	}

	/**
	 * Asks the handler to validate the parameters and confirm if there are any errors in the configuration
	 * 
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#validateParameters(java.util.HashMap)
	 */
	public String validateParameters(HashMap params)
	{
		String errors = null;
		CacheDelegateRemote cacheRemote = getHandler();
		// In case the remote is null, this could be due to a invalid cached home object. So try to get the same again
		if (cacheRemote == null)
		{
			cacheRemote = getHandler();
		}

		// Sanity check.
		if (cacheRemote != null)
		{
			try
			{
				HashMap remoteParams = new HashMap();
				prepareRemoteParams(remoteParams);
				// Since the parameters will not have been set yet, explicitly add it to the map.
				remoteParams.put(CacheConstants.OBJECT_HANDLER_PARAMS, params);
				errors = cacheRemote.validateParameters(remoteParams);
			} catch (RemoteException e)
			{
				errors = "Error during remote communication for validating handler params. Please check the deployment and server logs";
				LOGGER.cterror("CTCAC00037", e, params);
			}
		} else
		{
			errors = "Unable to create Remote class for validating handler params. Please check the deployment and server logs";
			LOGGER.cterror("CTCAC00038");
		}
		return errors;
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
		List retVal = null;
		CacheDelegateRemote cacheRemote = getHandler();
		// In case the remote is null, this could be due to a invalid cached home object. So try to get the same again
		if (cacheRemote == null)
		{
			cacheRemote = getHandler();
		}

		// Sanity check.
		if (cacheRemote != null)
		{
			try
			{
				prepareRemoteParams(proxyParams);
				HashMap responseMap = cacheRemote.checkAndGetUpdatedData(proxyParams);
				retVal = (List) responseMap.get(CacheConstants.OBJECT_HANDLER_DATA);
				if (retVal != null)
				{
					// Only if there has been a change in data, then updated the handler state.
					setHandlerState((HashMap) responseMap.get(CacheConstants.OBJECT_HANDLER_STATE));
				}
			} catch (RemoteException e)
			{
				LOGGER.cterror("CTCAC00039", e);
			}
		} else
		{
			LOGGER.cterror("CTCAC00040");
		}
		return retVal;
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
		return mHandlerState;
	}

	/**
	 * this method is called Stores the parameters for the Cache handler
	 * 
	 * @param params the parameters for the Cache handler
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#setParameters(java.util.HashMap)
	 */
	public void setParameters(HashMap params)
	{
		mHandlerParams = params;
	}

	/**
	 * Returns the parameters provided to the Cache handler
	 * 
	 * @return The parameters of the cache handler
	 * @see com.intellectdesign.cib.cache.ICacheHandlerProxy#getParameters()
	 */
	public HashMap getParameters()
	{
		return mHandlerParams;
	}

	/**
	 * Helper method that creates the Remote bean object and returns the same
	 * 
	 * @return The remote object for the Cache delegate bean
	 */
	private CacheDelegateRemote getHandler()
	{
		EJBHomeFactory homeFactory = EJBHomeFactory.getInstance();
		try
		{
			CacheDelegateHome cacheHome = (CacheDelegateHome) homeFactory.getHome(CacheDelegateHome.class);
			CacheDelegateRemote cacheRemote = cacheHome.create();
			return cacheRemote;
		} catch (RemoteException e)
		{
			LOGGER.cterror("CTCAC00020", e);
			// Some kind of communication error. So remove the home cache so that the next attempt may be successful
			homeFactory.removeHome(CacheDelegateHome.class);
		} catch (Exception e)
		{
			LOGGER.cterror("CTCAC00021", e);
		}
		return null;
	}

	/**
	 * Prepares the parameter to be sent for remote invocation
	 * 
	 * @param params The parameters to be passed to the remote call
	 */
	private void prepareRemoteParams(HashMap params)
	{
		Log4jMDCInitializer mdcData = new Log4jMDCInitializer();
		Map requestContext = mdcData.getMDCData();
		// Retrieve from the Canvas Thread Local too.
		requestContext.putAll(CanvasThreadLocal.retrieveAllData());
		params.put(CacheConstants.OBJECT_HANDLER, getHandlerClass());
		params.put(CacheConstants.OBJECT_HANDLER_PARAMS, getParameters());
		params.put(CacheConstants.OBJECT_HANDLER_STATE, getHandlerState());
		params.put(CacheConstants.OBJECT_CONTEXT, requestContext);
	}

	/**
	 * Returns the handler class name set to the proxy
	 * 
	 * @return The handler class name
	 */
	private String getHandlerClass()
	{
		return mHandlerClass;
	}

	/**
	 * Stores the state of the handler received from earlier interactin
	 * 
	 * @param state The state of the handler
	 */
	private void setHandlerState(HashMap state)
	{
		mHandlerState = state;
	}

	/**
	 * Storage for the handler class
	 */
	private String mHandlerClass = null;
	/**
	 * Storage for the handler params
	 */
	private HashMap mHandlerParams = null;
	/**
	 * Storage for the handlerState received
	 */
	private HashMap mHandlerState = null;
	/**
	 * Logger instance
	 */
	private static final Logger LOGGER = Logger.getLogger(RemoteCacheHanderProxy.class);

}
