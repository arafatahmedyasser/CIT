/**
    COPYRIGHT NOTICE

    Copyright 2011 Intellect Design Arena Limited. All rights reserved.

    These materials are confidential and proprietary to 
    Intellect Design Arena Limited and no part of these materials should
    be reproduced, published, transmitted or distributed in any form or
    by any means, electronic, mechanical, photocopying, recording or 
    otherwise, or stored in any information storage or retrieval system
    of any nature nor should the materials be disclosed to third parties
    or used in any other manner for which this is not authorized, without
    the prior express written authorization of Intellect Design Arena Limited.
 */


package com.intellectdesign.canvas.viewdefinition.handler;

/**
 * FW_36_CHACHEFW_ADVGRPGRID
 * 
 * @author harriesh.v
 * 
 */

/**
 * This is the cache (Ehcache) event handler file attahed to the user logout or session out 
 * inorder to clear the cache view data and the corresponding key. 
 */

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.ehcache.impl.EhCacheManager;
import com.intellectdesign.canvas.event.Event;
import com.intellectdesign.canvas.event.handler.EventHandler;
import com.intellectdesign.canvas.event.handler.HandlerException;
import com.intellectdesign.canvas.event.handler.IData;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.viewdefinition.CacheCleanupData;

public class CacheCleanupEventHandler extends EventHandler
{

	private static final String EXPIREDCACHES = "EXPIREDCACHES";
	private static final String VDF_CACHE_REGISTRY = "VDF_CACHE_REGISTRY";
	private static final String SESSION_ID = "SESSION_ID";
	private static final String ALERT_DATA_MAP = "ALERT_DATA_MAP";

	@Override
	protected IData formatEventData(Event event, Map mapData) throws HandlerException
	{
		/**
		 * Step 1: Constructing the reportNotificationData.
		 * */
		CacheCleanupData cacheCleanupData = new CacheCleanupData();

		HashMap alertInfo = (HashMap) mapData.get(ALERT_DATA_MAP);

		String sessionId = (String) alertInfo.get(SESSION_ID);
		ArrayList cacheInfo = null;
		EhCacheManager cacheManager;
		Set expiredCacheKeys = new HashSet();
		Pattern pvPattern = null;
		Matcher pvMatcher = null;
		try
		{

			cacheManager = (EhCacheManager) EhCacheManager.createInstance();

			cacheInfo = (ArrayList) cacheManager.fetchKeys(VDF_CACHE_REGISTRY);

		} catch (CBXCacheException e)
		{
			LOGGER.cterror("CTEHC0001", e.getCause());
			throw new HandlerException(e.getErrorCode(), e.getErrorMessage());
		}

		String key;

		if (!cacheInfo.isEmpty())
		{
			for (int j = 0; j < cacheInfo.size(); j++)
			{

				pvPattern = Pattern.compile(sessionId);
				key = (String) cacheInfo.get(j);
				pvMatcher = pvPattern.matcher(key);
				if (pvMatcher.lookingAt())
				{
					expiredCacheKeys.add(key);
				}
			}

		}

		mapData.put(SESSION_ID, sessionId);
		mapData.put(EXPIREDCACHES, expiredCacheKeys);
		cacheCleanupData.setDataMap(mapData);

		return cacheCleanupData;
	}

	@Override
	protected void handleSynchEvent(Event event, IData eventData) throws HandlerException
	{
		cacheCleanup(eventData);
	}

	@Override
	protected void handleASynchEvent(Event event, IData eventData) throws HandlerException
	{

		cacheCleanup(eventData);

	}

	/**
	 * This method is used to clean the cache key registry and the cache 
	 * that is created for the view
	 * @param eventData
	 * @throws HandlerException
	 */
	private void cacheCleanup(IData eventData) throws HandlerException
	{
		/**
		 * Step 1: Get the cacheCleanupData.
		 * */
		CacheCleanupData cacheCleanupData = (CacheCleanupData) eventData;

		/**
		 * Step 3: Getting the data map from the cacheCleanupData.
		 * */
		Map dataMap = cacheCleanupData.getDataMap();
		HashSet expiredCacheKeys = (HashSet) dataMap.get(EXPIREDCACHES);

		Iterator iter = expiredCacheKeys.iterator();
		String key = "";
		List result = null;
		String cacheId;
		try
		{

			EhCacheManager cacheManager = (EhCacheManager) EhCacheManager.createInstance();
			while (iter.hasNext())
			{
				cacheId = (String) iter.next();
				result = cacheManager.fetchDataFromCacheForKey(VDF_CACHE_REGISTRY, cacheId);
				if (!result.isEmpty())
				{
					key = (String) result.get(0);
				}
				cacheManager.removeCache(key);
				cacheManager.removeDataFromCacheForKey(VDF_CACHE_REGISTRY, key);

			}
		} catch (CBXCacheException e)
		{
			LOGGER.cterror("CTEHC0002", e.getCause());
			throw new HandlerException(e.getErrorCode(), e.getErrorMessage());
		}
	}

	private Logger LOGGER = Logger.getLogger(CacheCleanupEventHandler.class);
}
