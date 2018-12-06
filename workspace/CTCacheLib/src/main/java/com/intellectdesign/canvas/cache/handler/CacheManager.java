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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Timer;

import javax.servlet.http.HttpSession;

import com.intellectdesign.canvas.config.CacheConfigurationDescriptor;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.proxycaller.ProxyCaller;
import com.intellectdesign.canvas.proxycaller.ProxyCallerException;

/**
 * This is the cache manager that allows user to access data that is cached based on pre configured set of caches. This
 * does not support adding a new cache definition on the fly.
 * 
 * @version 1.0
 */
public final class CacheManager
{

	/**
	 * The only constructor of this class. This loads the various caches configured within the system
	 */
	CacheManager()
	{
		setCacheData(new HashMap());
		setCacheCollection(new HashMap());
		setInitialized(false);
	}

	/**
	 * This enumeration has the various proxy modes supported by the CacheFramework.
	 */
	public enum CacheProxyMode
	{
		/**
		 * Indicates the Local mode of invocation for cache data builders
		 */
		LOCAL("local", LocalCacheHandlerProxy.class),
		/**
		 * Indicates the remote mode of invocation through EJB for cache data builders
		 */
		REMOTE("remote", RemoteCacheHanderProxy.class),
		/**
		 * Indicates the remote mode of invocation through HTTP for cache data builders
		 */
		HTTP("http", HttpCacheHandlerProxy.class);

		private String proxyVal;
		private Class<ICacheHandlerProxy> proxyHandler;
		private static Map<String, CacheProxyMode> modeCache = null;

		private CacheProxyMode(String val, Class handlerClass)
		{
			proxyVal = val;
			proxyHandler = handlerClass;
		}

		/**
		 * Factory method to create a new instance of the ICacheHandlerProxy for the given proxy mode.
		 * 
		 * @return
		 */
		public ICacheHandlerProxy createProxy()
		{
			ICacheHandlerProxy proxy = null;
			try
			{
				proxy = ProxyCaller.on(proxyHandler).create().get();
			} catch (ProxyCallerException e)
			{
				// Typically will not happen as we are handling all the classes explicitly
			}
			return proxy;
		}

		public String toString()
		{
			return proxyVal;
		}

		/**
		 * This method does a valueOf lookup based on the mode provided and not based on the constant name declared.
		 * 
		 * @param aMode The mode for which the Enum constant is to be fetched
		 * @return The CacheProxyMode corresponding to the action provided
		 * @exception IllegalArgumentException Thrown if the action provided is not a valid mode defined in
		 *                CacheProxyMode
		 */
		public static CacheProxyMode valueOfMode(String aMode)
		{
			synchronized (CacheProxyMode.class)
			{
				if (modeCache == null)
				{
					modeCache = new HashMap<String, CacheProxyMode>();
					for (CacheProxyMode v : values())
					{
						modeCache.put(v.proxyVal, v);
					}
				}
			}
			CacheProxyMode result = modeCache.get(aMode);
			if (result == null)
			{
				throw new IllegalArgumentException("No enum const " + CacheProxyMode.class + "@mode." + aMode);
			}

			return result;
		}
	}

	/**
	 * This is used for the static initialization sequence for creation of the Cache manager instances
	 */
	private static class CacheManagerInstanceHolder
	{
		static CacheManager FW_INSTANCE = new CacheManager();
		static CacheManager APP_INSTANCE = new CacheManager();
		static
		{
			reinitialize();
		}

		/**
		 * Does the actual initialization of the caches based on the configuration
		 */
		static void reinitialize()
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			CacheConfigurationDescriptor cacheDescriptor = configMgr.getCacheDescriptor();
			// Identify the necessary details from the Configuration descriptor for cache
			// Step 1: Proxy mode
			String mode = cacheDescriptor.getCacheMode();
			CacheProxyMode proxyMode = null;
			try
			{
				proxyMode = CacheProxyMode.valueOfMode(mode);
			} catch (IllegalArgumentException e)
			{
				// If an exception occurs (which should never happen as the descriptor would have taken care of
				// validating the same
				proxyMode = CacheProxyMode.LOCAL;
			}

			FW_INSTANCE.setProxyMode(proxyMode);
			APP_INSTANCE.setProxyMode(proxyMode);

			// Step 2: ask the FW and App instances to initialize themselves.
			// Initialize the FW instance with default configuration.
			FW_INSTANCE.initializeCacheDetails("CTcacheconfig.xml");

			// Initialize the App instance based on provided configuration.
			APP_INSTANCE.initializeCacheDetails(cacheDescriptor.getCacheFileURI());
		}

		/**
		 * This API will shut down the caches created at framework and app level. This should be invoked only if the
		 * intent is to shutdown / cleanup at the time of application being stopped, or when the intent is to reload the
		 * caches from scratch based on modified configuration
		 */
		static void shutDownAll()
		{
			FW_INSTANCE.shutDown();
			APP_INSTANCE.shutDown();
		}
	}

	/**
	 * Gets the data for the cache key provided.
	 * 
	 * @param session the session object
	 * @param cacheKey The id of cache
	 * @return ArrayList The data stored in the cache for the given key. If the key does not exist, an empty list is
	 *         returned
	 */
	public List getDataFromCache(final HttpSession session, final String cacheKey)
	{
		if (isInitialized())
		{
			// Get the cache and ask it to return the data requested.
			Cache aCache = (Cache) getCacheCollection().get(cacheKey);
			if (aCache != null)
			{
				return aCache.getData(session);
			}
		}
		// Scenario should typically never occur. return empty arraylist if the cache key provided
		// has not been configured in the system; or if the initialization failed for what ever reason.
		return new ArrayList();
	}

	/**
	 * This API will clear all the caches that are present with this cache manager.
	 */
	void shutDown()
	{
		if (isInitialized())
		{
			Iterator<Cache> valuesIterator = getCacheCollection().values().iterator();
			Cache aCache;
			while (valuesIterator.hasNext())
			{
				aCache = valuesIterator.next();
				if (CacheConstants.SCOPE_APPLICATION.equals(aCache.getScope()))
					aCache.destroyCache(null);
			}
			getCacheCollection().clear();
			setInitialized(false);
		}
		// Cancel the timer task
		if (getTimer() != null)
			getTimer().cancel();
	}

	/**
	 * This API will clear all the caches that are present with this cache manager.
	 */
	public static void shutDownAll()
	{
		CacheManagerInstanceHolder.shutDownAll();
	}

	/**
	 * This API reinitializes all the caches. This triggers a destory / cleanup of existing caches and forces a
	 * recreation of the caches.
	 */
	public static void reinitializeAll()
	{
		CacheManagerInstanceHolder.shutDownAll();
		CacheManagerInstanceHolder.reinitialize();
	}

	/**
	 * This method provides an option for the caller to explicitly destroy the cache. What this will do is invalidate
	 * the cached contents. The next time the cache is accessed, the data for the cache will be freshly retrieved using
	 * its handler.
	 * 
	 * @param session The session object
	 * @param cacheKey The cache key.
	 */

	public void invalidateCache(HttpSession session, String cacheKey)
	{
		// If the cache is not initialized, then nothing to do.
		if (isInitialized())
		{
			// Get the cache and ask it to destroy itself
			Cache aCache = (Cache) getCacheCollection().get(cacheKey);
			if (aCache != null)
				aCache.destroyCache(session);
		}
	}

	/**
	 * This method provides an option for the caller to explicitly destroy the cache. What this will do is invalidate
	 * the cached contents. The next time the cache is accessed, the data for the cache will be freshly retrieved using
	 * its handler.
	 * 
	 * @param cacheKey The cache key.
	 */

	public void invalidateCache(String cacheKey)
	{
		// If the cache is not initialized, then nothing to do.
		if (isInitialized())
		{
			// Get the cache and ask it to destroy itself
			Cache aCache = (Cache) getCacheCollection().get(cacheKey);
			if (aCache != null)
				aCache.destroyCache(null);
		}
	}

	/**
	 * Gets the singleton instance of this cache manager.
	 * 
	 * @return CacheManager the instance of this class.
	 */
	public static CacheManager getInstance()
	{
		return CacheManagerInstanceHolder.APP_INSTANCE;
	}

	/**
	 * Gets the singleton instance of this cache manager.
	 * 
	 * @return CacheManager the instance of this class.
	 */
	public static CacheManager getFWInstance()
	{
		return CacheManagerInstanceHolder.FW_INSTANCE;
	}

	/**
	 * This API is called within the Cache framework where it has identified a particular cache to be destroyed. In this
	 * scenario, it passes the internal cache key directly (the key that has been provided by the cache meta data
	 * object). This API is for internal cache functioning and is not expected to be called from the end application
	 * directly.
	 * 
	 * @param internalCacheKey The internal cache key against which the data is stored in the cache.
	 */
	protected void destroyCache(final String internalCacheKey)
	{
		if (getCacheData().containsKey(internalCacheKey))
		{
			getCacheData().remove(internalCacheKey);
		}
	}

	/**
	 * Helper method to get the list of all caches that support expiry.
	 * 
	 * @return List the list of all caches that support expiry.
	 */
	protected List getAllCacheSupportingExpiry()
	{
		Cache aCache;
		Map.Entry anEntry;
		List retVal = new ArrayList();
		HashMap allCaches = getCacheCollection();
		Iterator keysIterator = allCaches.entrySet().iterator();

		while (keysIterator.hasNext())
		{
			anEntry = (Map.Entry) keysIterator.next();
			aCache = (Cache) anEntry.getValue();
			// Only if the cache supports expiry, add it to the result.
			if (aCache.isExpirySupported())
			{
				retVal.add(aCache);
			}
		}

		return retVal;
	}

	/**
	 * Helper method to identify the exact list of caches that have expired from the list of caches configured.
	 * 
	 * @return List The list of caches that have expired.
	 */
	protected List getExpiredCacheList()
	{
		Cache aCache;
		List cacheList = getAllCacheSupportingExpiry();
		int numCaches = cacheList.size();
		long currentTime = System.currentTimeMillis();
		List retVal = new ArrayList();

		for (int index = 0; index < numCaches; index++)
		{
			aCache = (Cache) cacheList.get(index);
			if (aCache.getExpiryInterval() == CacheConstants.EXPIRY_NONE)
			{
				// If the cache has set the expiry interval to no expiry, the ignore that cache
				continue;
			}
			// Do the math here.
			if (aCache.hasExpired(currentTime))
			{
				retVal.add(aCache);
			}
		}
		return retVal;
	}

	/**
	 * this is ref to Cache Details toHashMap Initializes the cache based on the configuration in the system.
	 */
	void initializeCacheDetails(String cacheconfig)
	{
		List cacheList = null;
		HashMap aMap = null;
		String preLoad;
		String validatingFlag;
		String handlerClassName;
		String id;
		int numCache;
		Cache aCache;
		HashMap paramsMap;
		HashMap allCaches = getCacheCollection();

		LOGGER.ctinfo("CTCAC00009");

		CacheConfigParser parser = new CacheConfigParser(this.getClass().getClassLoader()
				.getResourceAsStream(cacheconfig));
		cacheList = parser.process();

		numCache = cacheList.size();
		LOGGER.ctdebug("CTCAC00012", cacheList);
		for (int count = 0; count < numCache; count++)
		{
			aMap = (HashMap) cacheList.get(count);
			aCache = getCacheForScope((String) aMap.get(CacheConstants.FIELD_SCOPE));
			if (aCache == null)
			{
				LOGGER.cterror("CTCAC00013", aMap);
				continue;
			}
			id = (String) aMap.get(CacheConstants.FIELD_ID);
			if (allCaches.containsKey(id))
			{
				LOGGER.cterror("CTCAC00014", id, aMap);
				continue;
			}
			aCache.setId(id);
			// Set the preload indicator appropriately.
			preLoad = (String) aMap.get(CacheConstants.FIELD_PRELOAD);
			if (CacheConstants.PRELOAD_YES.equals(preLoad))
			{
				aCache.setPreLoadRequired(true);
			} else
			{
				// For all other values (including non supported ones)
				aCache.setPreLoadRequired(false);
			}

			// Identify the expiry interval for this cache.
			if (aMap.containsKey(CacheConstants.FIELD_EXPIRY_INTERVAL))
			{
				aCache.setExpiryInterval(Long.parseLong((String) aMap.get(CacheConstants.FIELD_EXPIRY_INTERVAL)));
			} else
			{
				aCache.setExpiryInterval(CacheConstants.EXPIRY_NONE);
			}

			// Set the validating cache flag appropriately.
			validatingFlag = (String) aMap.get(CacheConstants.FIELD_VALIDATING);
			if (CacheConstants.VALIDATING_YES.equals(validatingFlag))
			{
				aCache.setValidating(true);
			} else
			{
				// For all other values (including non supported ones)
				aCache.setValidating(false);
			}

			// Get the Cache handler for this cache.
			handlerClassName = (String) aMap.get(CacheConstants.FIELD_HANDLER);
			ICacheHandlerProxy aCacheHandler = getHandler(handlerClassName);
			if (aCacheHandler == null)
			{
				LOGGER.cterror("CTCAC00015", handlerClassName, id, aMap);
				continue;
			}
			aCache.setHandler(aCacheHandler);

			// Get the parameters configured and pass it on to the handler.
			paramsMap = (HashMap) aMap.get(CacheConstants.FIELD_PARAMETERS);
			if (paramsMap != null && paramsMap.size() > 0)
			{
				String errors = aCacheHandler.validateParameters(paramsMap);
				if ((errors != null) && (errors.length() > 0))
				{
					LOGGER.cterror("CTCAC00016", id, errors, aMap);
					continue;
				}
				aCacheHandler.setParameters(paramsMap);
			}

			// Set the cache manager as self into the cache.
			aCache.setCacheManager(this);

			// Store this cache information into the cache collection.
			allCaches.put(aCache.getId(), aCache);
		}

		// For the caches configured for preload, trigger the preload of data.
		preLoadCaches();
		
		// set a fresh timmer.
		setTimer(new Timer());
		// Start the refresh timer task.
		initializeTimerTasks();

		// Set the initialized flag to true.
		setInitialized(true);
	}

	/**
	 * this method identifies the caches that have asked for a preload configured. then triggers them to preload
	 */
	private void preLoadCaches()
	{
		Cache aCache = null;
		int count = 0;
		Map.Entry anEntry;
		HashMap allCaches = getCacheCollection();

		Iterator keysIterator = allCaches.entrySet().iterator();
		while (keysIterator.hasNext())
		{
			anEntry = (Map.Entry) keysIterator.next();
			aCache = (Cache) anEntry.getValue();
			// Only if the cache supports preload, make it get the data.
			if (aCache.isPreLoadSupported() && aCache.getPreLoadRequired())
			{
				// Call the get data. This forces the cache to fetch the data for the cache.
				count++;
				aCache.getData(null);
			}
		}
		LOGGER.ctinfo("CTCAC00017", count);
	}

	/**
	 * Helper method which initializes the timer tasks required by Cache Manager for its functioning.
	 */
	private void initializeTimerTasks()
	{
		// Create the refresh timer task.
		setRefreshTimerTask(new CacheRefreshTimerTask());
		// Schedule the timer task for execution.
		getTimer().schedule(getRefreshTimerTask(), CacheConstants.REFRESH_TIMER_INITIAL_DELAY,
				CacheConstants.REFRESH_TIMER_SCHEDULE_PERIOD);
	}

	/**
	 * A simple factory implementation for getting the cache for the given scope.
	 * 
	 * @param scope The cache scope
	 * @return Cache the cache implementation for the given scope.
	 */
	private Cache getCacheForScope(final String scope)
	{
		Cache retVal = null;
		if (CacheConstants.SCOPE_SESSION.equals(scope))
		{
			retVal = new SessionCache();
		} else if (CacheConstants.SCOPE_APPLICATION.equals(scope))
		{
			retVal = new ApplicationCache();
		}
		return retVal;
	}

	/**
	 * A simple factory implementation for getting the creating the cache handler proxy class.
	 * 
	 * @param handlerClassName The handler class to be created
	 * @return ICacheHandlerProxy the object of cache handler proxy. null if the class could not be loaded or it is not
	 *         a sub class of CacheHandler.
	 */
	private ICacheHandlerProxy getHandler(final String handlerClassName)
	{
		// Create the handler proxy.
		ICacheHandlerProxy proxy = getProxyMode().createProxy();
		// Test whether the handler class is a valid one.
		String errors = proxy.validateHandlerClass(handlerClassName);
		if ((errors == null) || (errors.length() == 0))
		{
			// Means that the handler class is fine. So set the same into the proxy and return the
			// same.
			proxy.setHandlerClass(handlerClassName);
		} else
		{
			// There were some errors. So log the same and return null to indicate issues.
			proxy = null;
		}
		return proxy;
	}

	/**
	 * Gets the cache collection which is the mapping of the cache id to the actual cache object.
	 * 
	 * @return HashMap The cache meta data map
	 */
	protected HashMap getCacheCollection()
	{
		return mCacheCollection;
	}

	/**
	 * Sets the cache collection which is the mapping of the cache id to the actual cache object.
	 * 
	 * @param coll The cache meta data map
	 */
	private void setCacheCollection(final HashMap coll)
	{
		mCacheCollection = coll;
	}

	/**
	 * Gets the map containing the actual data that is cached.
	 * 
	 * @return HashMap The actual cached data map
	 */
	protected HashMap getCacheData()
	{
		return mCacheData;
	}

	/**
	 * Sets the map containing the actual data that is cached.
	 * 
	 * @param coll The actual cached data map
	 */
	private void setCacheData(final HashMap coll)
	{
		mCacheData = coll;
	}

	/**
	 * Gets the flag indicating if the cache has been initialized or not.
	 * 
	 * @return boolean true, if the cache has been initialized; false otherwise
	 */
	private boolean isInitialized()
	{
		return mInitialized;
	}

	/**
	 * Sets the flag indicating if the cache has been initialized or not.
	 * 
	 * @param initFlag true, if the cache has been initialized; false otherwise
	 */
	private void setInitialized(final boolean initFlag)
	{
		mInitialized = initFlag;
	}

	/**
	 * Gets the timer used for launching the threads (refresh and cleanup).
	 * 
	 * @return Timer the timer used for executing the cache related threads.
	 */
	private Timer getTimer()
	{
		return mTimer;
	}

	/**
	 * Sets the timer used for launching the threads (refresh and cleanup).
	 * 
	 * @param parent The timer used for executing the cache related threads.
	 */
	private void setTimer(final Timer parent)
	{
		mTimer = parent;
	}

	/**
	 * Gets the task used for checking the expiry for the cached data.
	 * 
	 * @return CacheRefreshTimerTask The task used for checking the expiry of cached data.
	 */
	private CacheRefreshTimerTask getRefreshTimerTask()
	{
		return mRefreshTimerTask;
	}

	/**
	 * Sets the task used for checking the expiry for the cached data.
	 * 
	 * @param task The task used for checking the expiry of cached data.
	 */
	private void setRefreshTimerTask(final CacheRefreshTimerTask task)
	{
		mRefreshTimerTask = task;
	}

	/**
	 * Gets the Proxy mode for this cache manager.
	 * 
	 * @return the mProxyMode
	 */
	private CacheProxyMode getProxyMode()
	{
		return mProxyMode;
	}

	/**
	 * Sets the proxy mode .
	 * 
	 * @param aMode the mProxyMode to set
	 */
	protected void setProxyMode(CacheProxyMode aMode)
	{
		this.mProxyMode = aMode;
	}

	/**
	 * This is the timer that controls the refresh timer task.
	 */
	private Timer mTimer;
	/**
	 * The Refresh monitoring task.
	 */
	private CacheRefreshTimerTask mRefreshTimerTask;
	/**
	 * The local storage of all the Cache instances.
	 */
	private HashMap mCacheCollection;
	/**
	 * The local storage of all the cache data.
	 */
	private HashMap mCacheData;
	/**
	 * Flag indicating whether the Cache Manager has been initialized or not.
	 */
	private boolean mInitialized;
	/**
	 * Has the holder that indicates the proxy mode enabled for the cache manager.
	 */
	private CacheProxyMode mProxyMode = null;

	/**
	 * The logger instance.
	 */
	private static final Logger LOGGER = Logger.getLogger(CacheManager.class);
}
