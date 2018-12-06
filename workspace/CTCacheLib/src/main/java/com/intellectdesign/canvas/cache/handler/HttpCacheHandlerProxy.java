/**
 * Copyright 2016. Intellect Design Arena Limited. All rights reserved. 
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

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ImplClassDescriptor;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;

/**
 * This is an implementation of the Cache Handler Proxy that uses a simple HTTP based connection for making the remote
 * call. This is useful in cases where the deployment architecture does not use a JEE container but a simple web
 * container like Tomcat.
 * 
 * For this to work, it is expected that the com.intellectdesign.canvas.cache.handler.HttpCacheHandlerServlet is
 * registered as a servlet in the remote web application and the URL pointing till the servlet name is provided in the
 * implementation class descriptor under the key <b>HTTP_CACHE_HANDLER_URL</b>
 */
public class HttpCacheHandlerProxy implements ICacheHandlerProxy
{
	/**
	 * Default constructor. Nothing to do here
	 */
	public HttpCacheHandlerProxy()
	{
		// Nothing to do here
	}

	/**
	 * @param handlerClass
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#setHandlerClass(java.lang.String)
	 */
	@Override
	public void setHandlerClass(String handlerClass)
	{
		mHandlerClass = handlerClass;
	}

	/**
	 * @param handlerClass
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#validateHandlerClass(java.lang.String)
	 */
	@Override
	public String validateHandlerClass(String handlerClass)
	{
		String errors = null;

		try
		{
			HashMap remoteParams = new HashMap();
			prepareRemoteParams(remoteParams);
			// Since the handler will not have been set yet, explicitly add it to the map.
			remoteParams.put(CacheConstants.OBJECT_HANDLER, handlerClass);
			Map response = executeHttpRequest(remoteParams);
			errors = (String) response.get("STATUS");
		} catch (BaseException e)
		{
			errors = "Error during remote communication for validating handler class. Please check the deployment and server logs";
			LOGGER.cterror("CTCAC00035", e, handlerClass);
		}
		return errors;
	}

	/**
	 * @param proxyParams
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#initializeCache(java.util.HashMap)
	 */
	@Override
	public List initializeCache(HashMap proxyParams)
	{
		List retVal = null;
		try
		{
			prepareRemoteParams(proxyParams);
			Map response = executeHttpRequest(proxyParams);
			retVal = (List) response.get(CacheConstants.OBJECT_HANDLER_DATA);
		} catch (BaseException e)
		{
			LOGGER.cterror("CTCAC00036", e, proxyParams);
		}
		return retVal;
	}

	/**
	 * @param params
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#validateParameters(java.util.HashMap)
	 */
	@Override
	public String validateParameters(HashMap params)
	{
		String errors = null;
		try
		{
			HashMap remoteParams = new HashMap();
			prepareRemoteParams(remoteParams);
			// Since the parameters will not have been set yet, explicitly add it to the map.
			remoteParams.put(CacheConstants.OBJECT_HANDLER_PARAMS, params);
			Map response = executeHttpRequest(remoteParams);
			errors = (String) response.get("STATUS");
		} catch (BaseException e)
		{
			errors = "Error during remote communication for validating handler params. Please check the deployment and server logs";
			LOGGER.cterror("CTCAC00037", e, params);
		}
		return errors;
	}

	/**
	 * @param proxyParams
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#checkAndGetUpdatedData(java.util.HashMap)
	 */
	@Override
	public List checkAndGetUpdatedData(HashMap proxyParams)
	{
		List retVal = null;
		try
		{
			prepareRemoteParams(proxyParams);
			Map responseMap = executeHttpRequest(proxyParams);
			retVal = (List) responseMap.get(CacheConstants.OBJECT_HANDLER_DATA);
			if (retVal != null)
			{
				// Only if there has been a change in data, then updated the handler state.
				setHandlerState((HashMap) responseMap.get(CacheConstants.OBJECT_HANDLER_STATE));
			}
		} catch (BaseException e)
		{
			LOGGER.cterror("CTCAC00039", e);
		}
		return retVal;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#getHandlerState()
	 */
	@Override
	public HashMap getHandlerState()
	{
		return mHandlerState;
	}

	/**
	 * @param params
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#setParameters(java.util.HashMap)
	 */
	@Override
	public void setParameters(HashMap params)
	{
		mHandlerParams = params;
	}

	/**
	 * @return
	 * @see com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy#getParameters()
	 */
	@Override
	public HashMap getParameters()
	{
		return mHandlerParams;
	}

	/**
	 * The actual method that makes the Http connection
	 * 
	 * @param proxyParams The params to be passed
	 * @return The response received
	 */
	private Map executeHttpRequest(HashMap proxyParams) throws BaseException
	{
		Map reply = null;
		ImplClassDescriptor descriptor = ConfigurationManager.getInstance().getImplClassDescriptor();
		URL remoteurl = descriptor.getHttpHandlerInvokerUrl();
		try
		{
			URLConnection conn = remoteurl.openConnection();
			conn.setDoInput(true);
			conn.setDoOutput(true);

			// Transfer the entire request data
			ObjectOutputStream oos = new ObjectOutputStream(conn.getOutputStream());
			oos.writeObject(proxyParams);
			oos.close();

			ObjectInputStream ois = new ObjectInputStream(conn.getInputStream());
			reply = (Map) ois.readObject();
			ois.close();
		} catch (ClassNotFoundException e)
		{
			LOGGER.cterror("CTCAC00036", e, proxyParams);
			throw new BaseException(e);
		} catch (IOException e)
		{
			LOGGER.cterror("CTCAC00036", e, proxyParams);
			throw new BaseException(e);
		}

		return reply;
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
