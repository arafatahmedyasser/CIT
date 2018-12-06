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

package com.intellectdesign.canvas.viewdefinition;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.intellectdesign.canvas.cache.CBXCacheException;
import com.intellectdesign.canvas.cache.handler.CacheConstants;
import com.intellectdesign.canvas.ehcache.impl.EhCacheManager;
import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is for eh cache data util
 * 
 * @version 1.0
 */
public class EhCacheDataUtil
{

	/**
	 * This is a method to create a unique id for the cachesystem
	 * 
	 * @param sessionId
	 * @param widgetId
	 * @param viewId
	 * @param userNo
	 * @param gcif
	 * @throws CBXCacheException
	 */
	public synchronized String fetchCacheId(String sessionId, String widgetId, String viewId, String userNo, String gcif)
			throws CBXCacheException
	{

		logger.ctinfo("CTVDF00361", sessionId, widgetId, viewId, gcif, userNo);

		EhCacheManager ehCacheManager;
		HashMap keyMap;
		List result;
		String value = "";
		ehCacheManager = (EhCacheManager) EhCacheManager.createInstance();

		String key = CacheConstants.VDF_CACHE_REGISTRY;

		setEhCacheKey(sessionId, widgetId, viewId, userNo, gcif);

		result = ehCacheManager.fetchDataFromCacheForKey(key, getEhCacheKey());

		if (result != null && null != result.get(0))
		{
			value = (String) result.get(0);
		} else
		{
			value = java.util.UUID.randomUUID().toString().concat(String.valueOf(new Date().getTime()));

			keyMap = new HashMap();

			keyMap.put(getEhCacheKey(), value);

			ehCacheManager.setDataInCache(key, keyMap);

		}

		return value;

	}

	/**
	 * This method is used to clear the cache data
	 * 
	 * @param sessionId
	 * @param viewId
	 * @param userNo
	 * @param gcif
	 * @throws CBXCacheException
	 * 
	 */
	public void resetCache(String sessionId, String widgetId, String viewId, String userNo, String gcif)
			throws CBXCacheException
	{
		logger.ctinfo("CTVDF00362", sessionId, widgetId, viewId, gcif, userNo);

		String key = fetchCacheId(sessionId, widgetId, viewId, userNo, gcif);
		EhCacheManager cacheManager = (EhCacheManager) EhCacheManager.createInstance();
		cacheManager.removeCache(key);
		cacheManager.removeDataFromCacheForKey(CacheConstants.VDF_CACHE_REGISTRY, key);

	}

	/**
	 * Method for configure the EhCache key.
	 * 
	 * @param sessionId
	 * @param widgetId
	 * @param viewId
	 * @param userNo
	 * @param gcif
	 */
	public void setEhCacheKey(String sessionId, String widgetId, String viewId, String userNo, String gcif)
	{
		this.ehCacheKey = sessionId + CacheConstants.VDF_CACHE_KEY_DELIMITER + gcif
				+ CacheConstants.VDF_CACHE_KEY_DELIMITER + userNo + CacheConstants.VDF_CACHE_KEY_DELIMITER + widgetId
				+ CacheConstants.VDF_CACHE_KEY_DELIMITER + viewId;
	}

	/**
	 * Method for getting the EhCache key.
	 * 
	 * @return ehCacheKey
	 */
	public String getEhCacheKey()
	{
		return this.ehCacheKey;
	}

	private String ehCacheKey = null;
	private Logger logger = Logger.getLogger(EhCacheDataUtil.class);
}
