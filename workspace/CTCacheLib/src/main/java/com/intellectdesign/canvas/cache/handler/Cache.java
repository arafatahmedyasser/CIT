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

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

/**
 * This is the base class for the Cache implementations for the various caching scopes.
 * 
 * @version 1.0
 */
public abstract class Cache
{
	/**
	 * This method gets the data corresponding to this cache for the given session.
	 * 
	 * @param session the session object
	 * @return ArrayList The cached data.
	 */
	protected List getData(HttpSession session)
	{
		List retVal = null;
		String cacheKey = getInternalCacheKey(session);

		// If the cache manager does not have the cache data, then initialize the cache.
		if (!isCacheDataAvailable(cacheKey, session))
		{
			initCache(session);
		} else if (isValidating())
		{
			// Check with the handler proxy whether it can fetch updated data.
			retVal = getHandler().checkAndGetUpdatedData(getHandlerParams(session));

			// If updated data was received, then refresh the cache manager. Else just fetch from the Cache manager and
			// return.
			if (retVal != null)
			{
				// This means that there has been a change in the data. So refresh it into the Cache Manager
				// Put the data into the cache. This will replace any data already present in the cache.
				getCacheManager().getCacheData().put(cacheKey, retVal);
				// Reset the time of initialization for the cache.
				setInitializedTime(new Date());
			}

		}
		retVal = getDataImpl(cacheKey, session);
		return retVal;
	}

	/**
	 * Performs a check if the provided key as associated data initialized in the cache as its level.
	 * 
	 * @param cacheKey The cache key provided by caller
	 * @param session The session object
	 * @return The true if the cache is loaded
	 * 
	 */
	protected boolean isCacheDataAvailable(String cacheKey, HttpSession session)
	{
		return getCacheManager().getCacheData().containsKey(cacheKey);
	}

	/**
	 * Does the actual get operation. Default implementation is to get it from teh Cache mananger's internal store
	 * 
	 * @param cacheKey The cache key provided by caller
	 * @param session The session object
	 * @return The data for the cache
	 */
	protected List getDataImpl(String cacheKey, HttpSession session)
	{
		return (List) getCacheManager().getCacheData().get(cacheKey);
	}

	/**
	 * Prepares the params for passing to the Cache handler.
	 * 
	 * @param session The session object
	 * @return HashMap The parameters to be passed to the handler proxy
	 */
	protected HashMap getHandlerParams(HttpSession session)
	{
		HashMap params = new HashMap();

		return params;
	}

	/**
	 * This method is triggered when the cache has been identified as having stale data by the cache refresh timer. Here
	 * the data of the cache is reloaded.
	 */
	protected void handleCacheExpiry()
	{
		if (isExpirySupported())
		{
			initCache(null);
		}
	}

	/**
	 * This method is called when the cached data is to be destroyed. This just removes the cached object from the cache
	 * manager.
	 * 
	 * @param session The Session object
	 */
	protected void destroyCache(HttpSession session)
	{
		String cacheKey = getInternalCacheKey(session);
		if (getCacheManager().getCacheData().containsKey(cacheKey))
		{
			getCacheManager().getCacheData().remove(cacheKey);
		}
	}

	/**
	 * This method is called to initialize the cache.
	 * 
	 * @param session The session object.
	 */
	protected void initCache(HttpSession session)
	{
		List data = null;
		String cacheKey = getInternalCacheKey(session);
		// Retrieve the data from the handler
		data = getHandler().initializeCache(getHandlerParams(session));
		// Put the data into the cache. This will replace any data already present in the cache.
		getCacheManager().getCacheData().put(cacheKey, data);
		// Set the time of initialization for the cache.
		setInitializedTime(new Date());
	}

	/**
	 * Compares the cache initialization details against the time provided and returns flag indicating if the data in
	 * the cache is stale.
	 * 
	 * @param compareTime
	 * @return boolean
	 */
	protected boolean hasExpired(long compareTime)
	{
		if (getInitializedTime() != null)
		{
			return ((getInitializedTime().getTime() + getExpiryInterval()) < compareTime);
		} else
		{
			return false;
		}
	}

	/**
	 * Subclasses should implement this method to indicate whether pre load is supported or not. This is used in
	 * conjunction with the user configuration to decide whether data needs to be pre loaded or not.
	 * 
	 * @return boolean true if preload is supported. false otherwise
	 */
	protected abstract boolean isPreLoadSupported();

	/**
	 * Subclasses should implement this method to indicate whether cache data expiry is supported or not. This is used
	 * in conjunction with the user configuration to decide whether stale data check needs to be done or not.
	 * 
	 * @return boolean true if expiry is supported. false otherwise
	 */
	protected abstract boolean isExpirySupported();

	/**
	 * Gets the internal cache key corresponding to this cache
	 * 
	 * @param session The session object
	 * @return String the key to be used for caching the data corresponding to this cache.
	 */
	protected abstract String getInternalCacheKey(HttpSession session);

	/**
	 * Gets the data handler for this cache
	 * 
	 * @return CacheHandler The data handler for this cache
	 */
	protected ICacheHandlerProxy getHandler()
	{
		return mHandler;
	}

	/**
	 * Sets the data handler for this cache
	 * 
	 * @param handler The data handler for this cache
	 */
	protected void setHandler(ICacheHandlerProxy handler)
	{
		mHandler = handler;
	}

	/**
	 * Gets the Scope of this cache.
	 * 
	 * @return String The Scope of this cache
	 */
	protected String getScope()
	{
		return mScope;
	}

	/**
	 * Sets the scope of this cache.
	 * 
	 * @param scope The Scope of this cache
	 */
	protected void setScope(String scope)
	{
		mScope = scope;
	}

	/**
	 * Gets the ExpiryInterval of this cache.
	 * 
	 * @return long The ExpiryInterval of this cache
	 */
	protected long getExpiryInterval()
	{
		return mExpiryInterval;
	}

	/**
	 * Sets the ExpiryInterval of this cache.
	 * 
	 * @param interval The ExpiryInterval of this cache
	 */
	protected void setExpiryInterval(long interval)
	{
		mExpiryInterval = interval;
	}

	/**
	 * Gets the InitializedTime of this cache.
	 * 
	 * @return Date The InitializedTime of this cache
	 */
	protected Date getInitializedTime()
	{
		return mInitializedTime;
	}

	/**
	 * Sets the InitializedTime of this cache.
	 * 
	 * @param time The InitializedTime of this cache
	 */
	protected void setInitializedTime(Date time)
	{
		mInitializedTime = time;
	}

	/**
	 * Gets the PreLoadRequired flag of this cache.
	 * 
	 * @return boolean The PreLoadRequired flag of this cache
	 */
	protected boolean getPreLoadRequired()
	{
		return mPreLoadRequired;
	}

	/**
	 * Sets the PreLoadRequired flag of this cache.
	 * 
	 * @param flag The PreLoadRequired flag of this cache
	 */
	protected void setPreLoadRequired(boolean flag)
	{
		mPreLoadRequired = flag;
	}

	/**
	 * Gets the Id of this cache. This is unique for this cache
	 * 
	 * @return String The Id of this cache
	 */
	protected String getId()
	{
		return mId;
	}

	/**
	 * Sets the id of this cache. This is unique for this cache
	 * 
	 * @param id The Id of this cache
	 */
	protected void setId(String id)
	{
		mId = id;
	}

	/**
	 * @return the mIsValidating
	 */
	protected boolean isValidating()
	{
		return mIsValidating;
	}

	/**
	 * @param isValidating the mIsValidating to set
	 */
	protected void setValidating(boolean isValidating)
	{
		mIsValidating = isValidating;
	}

	/**
	 * Gets the CacheManager to which this cache belongs
	 * 
	 * @return boolean The CacheManager to which this cache belongs
	 */
	protected CacheManager getCacheManager()
	{
		return mCacheManager;
	}

	/**
	 * Sets the CacheManager to which this cache belongs.
	 * 
	 * @param manager The CacheManager to which this cache belongs
	 */
	protected void setCacheManager(CacheManager manager)
	{
		mCacheManager = manager;
	}

	private CacheManager mCacheManager;
	private ICacheHandlerProxy mHandler;
	private String mId;
	private String mScope;
	private long mExpiryInterval;
	private Date mInitializedTime;
	private boolean mPreLoadRequired;
	private boolean mIsValidating;
}
