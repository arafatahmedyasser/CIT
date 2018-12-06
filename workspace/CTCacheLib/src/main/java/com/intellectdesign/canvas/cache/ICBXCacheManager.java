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

package com.intellectdesign.canvas.cache;

import java.util.HashMap;
import java.util.List;

import net.sf.ehcache.config.Searchable;

/**
 * This interface encapsulates the methods related to fetching data from the cache
 * 
 * @version 1.0
 */
public interface ICBXCacheManager
{

	/**
	 * The method create is to instantiate the ehcache manager. Since this should be implemented class and the method
	 * has to be static it is not available in interfaces. This is the mandatory method to be in theimplemented class.
	 */

	/**
	 * This method is to initialize the cache with its configuration
	 * 
	 * @param String CacheId
	 * @param HashMap Config
	 * @return isCacheAvailable
	 * @throws CBXCacheException
	 */

	public boolean initializeCache(String cacheId, HashMap<?, ?> Config) throws CBXCacheException;

	/**
	 * This method is to initialize the cache with its configuration
	 * 
	 * @param String CacheId
	 * @param HashMap Config
	 * @param Searchable searchable
	 * @return isCacheAvailable
	 * @throws CBXCacheException
	 */

	public boolean initializeCacheEx(String cacheId, HashMap<?, ?> config, Searchable searchable)
			throws CBXCacheException;

	/**
	 * This prepares the Searchable object from the input configuration
	 * 
	 * @param cacheConfig
	 * @return
	 */
	public Searchable prepareEhcacheSearchable(HashMap<?, ?> cacheConfig);

	/**
	 * This method is to recieve the reference of the CacheWrapper
	 * 
	 * @param String CacheId
	 * @return ICBXCacheWrapper
	 * @throws CBXCacheException
	 */

	public ICBXCacheWrapper<?, ?> getcacheWrapper(String cacheId) throws CBXCacheException;

	/**
	 * This method is to verify the whether the corresponding cache exists
	 * 
	 * @param String CacheId
	 * @return boolean isCacheExists
	 * @throws CBXCacheException
	 */

	public boolean isCacheAvailable(String cacheId) throws CBXCacheException;

	/**
	 * This method is to remove the existing cache
	 * 
	 * @param String CacheId
	 * @throws CBXCacheException
	 */

	public void removeCache(String cacheId) throws CBXCacheException;

	/**
	 * This method is to remove the existing cache with prefix
	 * 
	 * @param String cacheIdPrefix
	 * @throws CBXCacheException
	 */

	public void removeCacheStartingWith(String cacheIdPrefix) throws CBXCacheException;

	/**
	 * This method is to fetch data from the cache
	 * 
	 * @param String CacheId
	 * @return List listData
	 * @throws CBXCacheException
	 */

	public List<?> fetchDataFromCache(String cacheId) throws CBXCacheException;

	/**
	 * This method is to set data in the cache
	 * 
	 * @param String CacheId
	 * @param Object data
	 * @throws CBXCacheException
	 */

	public void setDataInCache(String cacheId, Object data) throws CBXCacheException;

	/**
	 * This method is to fetch data from the given cache with the corresponding key
	 * 
	 * @param String CacheId
	 * @param Object key
	 * @return List listData
	 * @throws CBXCacheException
	 */

	public List<?> fetchDataFromCacheForKey(String cacheId, Object key) throws CBXCacheException;

	/**
	 * This method is to remove data from the given cache with the corresponding key
	 * 
	 * @param String CacheId
	 * @param Object key
	 * @throws CBXCacheException
	 */

	public void removeDataFromCacheForKey(String cacheId, Object key) throws CBXCacheException;

	/**
	 * This method is to fetch data from the cache with the corresponding key
	 * 
	 * @param String CacheId
	 * @param Object key
	 * @return List listData
	 * @throws CBXCacheException
	 */

	public List<?> fetchKeys(String cacheId) throws CBXCacheException;

}
