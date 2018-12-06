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
package com.intellectdesign.canvas.cache.bean;

import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.CreateException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.cache.handler.ICacheHandlerProxy;
import com.intellectdesign.canvas.cache.handler.LocalCacheHandlerProxy;
import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;

/**
 * This is the actual bean class that provides the implementation for the CacheDelegateRemote. This is a stateless bean
 * that acts as a conduit for the Cache framework to interact with the configured handlers at a remote instance
 * 
 * @version 1.0
 */
public class CacheDelegateBean implements SessionBean
{
	/**
	 * Internal constant for serialization purposes.
	 */
	private static final long serialVersionUID = 6630792149874188735L;

	/**
	 * This method will be invoked to fetch the data for the cache.
	 * 
	 * @param params The information for initializing the handler
	 * @return List The list of data for the cache
	 * @throws RemoteException thrown if there was any error during remote communication
	 * @see com.intellectdesign.canvas.cache.bean.cib.bean.cache.CacheDelegateRemote#initializeCache(java.util.HashMap)
	 */
	public List initializeCache(final HashMap params) throws RemoteException
	{
		ICacheHandlerProxy proxy = new LocalCacheHandlerProxy();
		initializeContext((Map) params.get(CacheConstants.OBJECT_CONTEXT));
		try
		{
			// Set the handler class and the parameters. This is a safe thing to do as the handler availability would
			// have
			// already been validated
			proxy.setHandlerClass((String) params.get(CacheConstants.OBJECT_HANDLER));
			proxy.setParameters((HashMap) params.get(CacheConstants.OBJECT_HANDLER_PARAMS));

			return proxy.initializeCache(params);
		} finally
		{
			clearContext();
		}
	}

	/**
	 * This method will be invoked to validate the handler class availability and ability to load the same.
	 * 
	 * @param handlerClass The handler class to be validated
	 * @return String null if there were no errors. Else the error message
	 * @throws RemoteException thrown if there was any error during remote communication
	 * @see com.intellectdesign.canvas.cache.bean.cib.bean.cache.CacheDelegateRemote#validateHandlerClass(java.lang.String)
	 */
	public String validateHandlerClass(final String handlerClass) throws RemoteException
	{
		// Within the bean we can use a local proxy itself!
		ICacheHandlerProxy proxy = new LocalCacheHandlerProxy();
		return proxy.validateHandlerClass(handlerClass);
	}

	/**
	 * This method will be invoked to validate the parameters configured for the handler.
	 * 
	 * @param params The parameters for initializing the handler
	 * @return String null if there were no errors. Else the error message
	 * @throws RemoteException thrown if there was any error during remote communication
	 * @see com.intellectdesign.canvas.cache.bean.cib.bean.cache.CacheDelegateRemote#validateParameters(java.util.HashMap)
	 */
	public String validateParameters(final HashMap params) throws RemoteException
	{
		initializeContext((Map) params.get(CacheConstants.OBJECT_CONTEXT));
		try
		{
			ICacheHandlerProxy proxy = new LocalCacheHandlerProxy();
			// Set the handler class only. This is a safe thing to do as the handler availability would have
			// already been validated
			proxy.setHandlerClass((String) params.get(CacheConstants.OBJECT_HANDLER));

			return proxy.validateParameters((HashMap) params.get(CacheConstants.OBJECT_HANDLER_PARAMS));
		} finally
		{
			clearContext();
		}
	}

	/**
	 * This method will be invoked to ask the handler to check the validity of the data. If the handler feels that the
	 * data is not valid, it expects the refreshed data to be returned back. If the handler feels that the data is
	 * valid, then expects null to be returned.
	 * 
	 * @param params The params for the proxy for it to use accordingly
	 * @return HashMap The updated list of data for the cache along with the updated state of the handler
	 * @throws RemoteException thrown if there was any error during remote communication
	 * @see com.intellectdesign.canvas.cache.bean.cib.bean.cache.CacheDelegateRemote#checkAndGetUpdatedData(java.util.HashMap)
	 */
	public HashMap checkAndGetUpdatedData(final HashMap params) throws RemoteException
	{
		HashMap responseMap = new HashMap();
		ICacheHandlerProxy proxy = new LocalCacheHandlerProxy();
		initializeContext((Map) params.get(CacheConstants.OBJECT_CONTEXT));
		// Set the handler class and the parameters. This is a safe thing to do as the handler availability would have
		// already been validated
		try
		{
			proxy.setHandlerClass((String) params.get(CacheConstants.OBJECT_HANDLER));
			proxy.setParameters((HashMap) params.get(CacheConstants.OBJECT_HANDLER_PARAMS));

			List updatedData = proxy.checkAndGetUpdatedData(params);
			responseMap.put(CacheConstants.OBJECT_HANDLER_DATA, updatedData);
			if (updatedData != null)
			{
				// This means that there is a change in the data source of the cache. So retrieve the updated state to
				// be
				// sent back to the caller.
				HashMap updatedState = proxy.getHandlerState();
				responseMap.put(CacheConstants.OBJECT_HANDLER_STATE, updatedState);
			}
		} finally
		{
			clearContext();
		}
		return responseMap;
	}

	/** ejbCreate method */
	/**
	 * this is ref to EJBCreate
	 * 
	 * @throws CreateException
	 */
	public void ejbCreate() throws CreateException
	{
		// Nothing to do
		// System.out.println("Bean Created.....");
	}

	/** ejbCreate method */
	/**
	 * this is ref to EJBActive
	 * 
	 * @throws CreateException
	 */
	@Override
	public void ejbActivate() throws RemoteException
	{
		// Nothing to do
	}

	/** ejbCreate method */
	/**
	 * this is ref to EJBPassivate
	 * 
	 * @throws CreateException
	 */
	@Override
	public void ejbPassivate() throws RemoteException
	{
		// Nothing to do
	}

	/** ejbCreate method */
	/**
	 * this is ref to EJBRemove
	 * 
	 * @throws CreateException
	 */
	@Override
	public void ejbRemove() throws RemoteException
	{
		// Nothing to do
	}

	/** ejbCreate method */
	/**
	 * this is ref to SetSessipnContext
	 * 
	 * @throws RemoteException
	 */
	@Override
	public void setSessionContext(final SessionContext arg0) throws RemoteException
	{
		// Nothing to do
	}

	/**
	 * Initializes the context to ensure that data provided by the caller continues to be available
	 * 
	 * @param requestContext
	 */
	private void initializeContext(Map requestContext)
	{
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.initLog4jMDC(requestContext);
		CanvasThreadLocal.putAll(requestContext);
	}

	/**
	 * Clears the data stored in the Thread context
	 */
	private void clearContext()
	{
		Log4jMDCInitializer initializer = new Log4jMDCInitializer();
		initializer.removeFromMDC();
		CanvasThreadLocal.clear();
	}
}
