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

package com.intellectdesign.canvas.ehcache.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import net.sf.ehcache.Cache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.config.CacheConfiguration;
import net.sf.ehcache.config.Searchable;
import net.sf.ehcache.search.Query;
import net.sf.ehcache.search.Result;
import net.sf.ehcache.search.Results;
import net.sf.ehcache.util.SetAsList;

import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.cache.ICBXCacheManager;
import com.intellectdesign.canvas.cache.ICBXCacheWrapper;
import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.PhraseVariable;

/**
 * This is basic implementation file of cachemanger of the ehcache. It implements the ICBXCacheManager
 * 
 * @version 1.0
 */
public class EhCacheManager implements ICBXCacheManager
{

	private CacheManager cacheManager = null;

	/**
	 * Written a default constructor to avoid initializing the class. The class should be initiated with the method
	 * create.
	 */
	EhCacheManager()
	{

		String EHCACHE_CONFIG = ConfigurationManager.getInstance().getCacheDescriptor().getEhcacheFileURI();

		if (cacheManager == null)
		{
			InputStream inputStream = null;
			try
			{
				inputStream = this.getClass().getResourceAsStream("/" + EHCACHE_CONFIG);
				cacheManager = CacheManager.create(inputStream);
			} finally
			{
				if (inputStream != null)
				{
					try
					{
						inputStream.close();
					} catch (IOException e)
					{
						LOGGER.cterror("CTCAC00026", e);
					}
				}
			}
		}
	}

	/**
	 * Using the Solution of Bill Pugh for singleton pattern instead of double checked locking pattern
	 */
	private static class EhCacheManagerInstanceHolder
	{
		static final EhCacheManager INSTANCE = new EhCacheManager();
	}

	/**
	 * This method is to instantiate the ehcache manager. Since this is the implementation class and the method has to
	 * be static it is not available in interfaces.
	 * 
	 * @return this singleton class reference
	 * @throws CBXCacheException
	 */

	public static ICBXCacheManager createInstance()
	{
		return EhCacheManagerInstanceHolder.INSTANCE;
	}

	/**
	 * This method is used to initialize the Cache using CacheID
	 * 
	 * @param cacheId
	 * @throws CBXCacheException
	 * 
	 *             {@inheritDoc}
	 */
	public boolean initializeCache(String cacheId, HashMap<?, ?> config) throws CBXCacheException
	{
		return initializeCacheEx(cacheId, config, prepareEhcacheSearchable(config));
	}

	/**
	 * this method is ref to HashMap to initalizeCacheEx
	 * 
	 * @param cacheId
	 * @param config
	 * @return
	 * @throws CBXCacheException
	 */
	public boolean initializeCacheEx(String cacheId, HashMap<?, ?> config, Searchable searchable)
			throws CBXCacheException
	{
		try
		{
			// Step 1: check whether the cacheId exist already if yes return
			// true
			if (isCacheAvailable(cacheId))
			{
				return true;
			}
			// Step 2: else Create a new cache with same cacheId with the
			// configuration recieved and return false
			else
			{
				CacheConfiguration cacheConfig = new CacheConfiguration(cacheId, -1).eternal(true);
				cacheConfig.addSearchable(searchable);
				cacheManager.addCache(new Cache(cacheConfig));
				return false;
			}
		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_002, T, phraseVariablePrimaryList);
		}
	}

	/**
	 * this metod is ref to Perpare EhCacheSearchable HashMap
	 * 
	 * @param hashmap, cacheconfing values {@inheritDoc}
	 * @return searchable
	 */

	public Searchable prepareEhcacheSearchable(HashMap<?, ?> cacheConfig)
	{
		Searchable searchable = new Searchable();
		return searchable;
	}

	/**
	 * this is ref to ICBXcacheWrapper
	 * 
	 * @exception CBXCacheException
	 * @param cacheid
	 * @return CBX wrapper {@inheritDoc}
	 */
	public ICBXCacheWrapper<Object, Object> getcacheWrapper(String cacheId) throws CBXCacheException
	{
		try
		{
			return new CBXEhCacheWrapper<Object, Object>(cacheId, cacheManager);

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_003, T, phraseVariablePrimaryList);
		}
	}

	/**
	 * This method is used to check the status of the cache. Cache is availabke, it returns cache id .other wise it
	 * throws an Cache Exception
	 * 
	 * @param cacheId
	 * @return cacheId
	 * @throws CBXCacheException {@inheritDoc}
	 */
	public boolean isCacheAvailable(String cacheId) throws CBXCacheException
	{
		try
		{
			return cacheManager.cacheExists(cacheId);

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_004, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * This method is used to remove cache object
	 * 
	 * @param cacheId
	 * @return cacheId
	 * @throws CBXCacheException {@inheritDoc}
	 */
	public void removeCache(String cacheId) throws CBXCacheException
	{
		try
		{
			cacheManager.removeCache(cacheId);

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_005, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * this method is used to remove cache object from CacheManager based on the cacheIdPrefix First it checks the
	 * available caches form cache manager then it checks the cacheid start with given CacheIdPrefix It is available
	 * then remove the cache id from cache manager. Other wise it throws an exception
	 * 
	 * @param cacheIdPrefix
	 * @throws CBXCacheException {@inheritDoc}
	 */
	public void removeCacheStartingWith(String cacheIdPrefix) throws CBXCacheException
	{

		try
		{
			// Iterates the available cache names that are starting with
			// cacheIdPrefix and removes it from the cache.
			String[] caches = cacheManager.getCacheNames();
			for (int i = 0; i < caches.length; i++)
			{
				if (caches[i].startsWith(cacheIdPrefix))
					cacheManager.removeCache(caches[i]);

			}

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheIdPrefix);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheIdPrefix));
			throw new CBXCacheException(CacheConstants.EXCEPTION_006, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * This method is used to remove the key from the cache
	 * 
	 * @param cacheId
	 * @throws CBXCacheException {@inheritDoc}
	 */
	public void removeDataFromCacheForKey(String cacheId, Object key) throws CBXCacheException
	{

		// Step 1: get the cache reference of the cacheID. Its outside the try
		// because getcache method itself handles the CBXCacheException
		Ehcache cache = getcache(cacheId);
		try
		{
			cache.remove(key);

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.KEY, (String) key));
			throw new CBXCacheException(CacheConstants.EXCEPTION_007, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * this method is used to get Ehcache ids
	 * 
	 * @param cacheId string value of CacheId
	 * @throws CBXCacheException {@inheritDoc}
	 */
	public Ehcache getcache(String cacheId) throws CBXCacheException
	{

		try
		{
			return new CBXEhCacheWrapper<Object, Object>(cacheId, cacheManager).getCache();

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_008, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * This method is used to retrieve data from Cache
	 * 
	 * @param cacheId
	 * @return response as ArrayList
	 * @throws CBXCacheException {@inheritDoc}
	 */
	public List<Object> fetchDataFromCache(String cacheId) throws CBXCacheException
	{

		// Step 1: get the cache reference of the cacheID. Its outside the try
		// because getcache method itself handles the CBXCacheException
		Ehcache cache = getcache(cacheId);

		try
		{
			// Step 2: create a query and execute the query to get the result

			Query query = cache.createQuery();
			query.includeValues();

			Results results = query.execute();

			List<Object> response = new ArrayList<Object>();

			// Step 3: convert the ehcache object to the format of simple java
			// objects

			for (Result resultv : results.all())
			{
				response.add(resultv.getValue());
			}

			return response;

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_009, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * This method is used to retrieve data from Cache for a key
	 * 
	 * @param cacheId
	 * @param key
	 * @return response as ArrayList
	 * @throws CBXCacheException {@inheritDoc}
	 */

	public List<Object> fetchDataFromCacheForKey(String cacheId, Object key) throws CBXCacheException
	{

		// Step 1: get the cache reference of the cacheID. Its outside the try
		// because getcache method itself handles the CBXCacheException
		CBXEhCacheWrapper cacheWrapper = (CBXEhCacheWrapper) getcacheWrapper(cacheId);

		try
		{

			List<Object> response = new ArrayList<Object>();

			// Step 2: convert the ehcache object to the format of simple java
			// objects

			response.add(cacheWrapper.get(key));

			return response;

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.KEY, (String) key));
			throw new CBXCacheException(CacheConstants.EXCEPTION_010, T, phraseVariablePrimaryList);
		}

	}

	/**
	 * This method is used to retrieve cache reference keys
	 * 
	 * @param cacheId
	 * @return keyList as ArrayList
	 * @throws CBXCacheException {@inheritDoc}
	 */

	public List<Object> fetchKeys(String cacheId) throws CBXCacheException
	{

		// Step 1: get the cache reference of the cacheID. Its outside the try
		// because getcache method itself handles the CBXCacheException
		Ehcache cache = getcache(cacheId);

		ArrayList keyList = new ArrayList();

		if (cache == null)
		{

			return keyList;
		}
		try
		{
			// Step 2: create a query with the criterea of input key and execute
			// the query to get the result.

			SetAsList keySet = (SetAsList) cache.getKeys();

			if (!keySet.isEmpty())
			{
				for (int j = 0; j < keySet.size(); j++)
				{

					keyList.add(keySet.get(j));

				}
			}

		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_011, T, phraseVariablePrimaryList);
		}

		return keyList;

	}

	/**
	 * This method is used to set data in cache
	 * 
	 * @param cacheId
	 * @param datas
	 * @throws CBXCacheException {@inheritDoc}
	 */
	public void setDataInCache(String cacheId, Object datas) throws CBXCacheException
	{
		Ehcache cache = getcache(cacheId);
		cache.removeAll();

		// Step 1: get the cacheWrapper reference of the cacheID. Its outside
		// the try because getcacheWrapper method itself handles the
		// CBXCacheException

		ICBXCacheWrapper<Object, Object> cacheWrapper = getcacheWrapper(cacheId);

		try
		{
			int index = 1;
			// Step 2: check wehther the input data is of type List , If yes
			if (datas instanceof List)
			{
				// Step 3: iterate the list to set the data
				for (Object data : (List<?>) datas)
				{
					cacheWrapper.put(Integer.toString(index), data);
					index++;
				}
			} else if (datas instanceof HashMap)
			{
				HashMap reqData = (HashMap) datas;
				Object key, val;
				for (int i = 0; i < reqData.size(); i++)
				{
					key = reqData.keySet().toArray()[i];
					val = reqData.values().toArray()[i];
					cacheWrapper.put(key, val);
				}
			}
			// Step 4: set the input data directly
			else
			{
				cacheWrapper.put(1, datas);
			}
		} catch (Throwable T)
		{
			LOGGER.cterror("CTCAC00028", T, cacheId);
			List<PhraseVariable> phraseVariablePrimaryList = new ArrayList<PhraseVariable>();
			phraseVariablePrimaryList.add(new PhraseVariable(CacheConstants.CACHEID, cacheId));
			throw new CBXCacheException(CacheConstants.EXCEPTION_012, T, phraseVariablePrimaryList);
		}
	}

	/**
	 * An instance of Logger
	 */
	private static final Logger LOGGER = Logger.getLogger(EhCacheManager.class);
}