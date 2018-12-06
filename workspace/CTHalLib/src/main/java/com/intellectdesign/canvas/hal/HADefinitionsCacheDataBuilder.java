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

package com.intellectdesign.canvas.hal;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.constants.infra.InfraConstants;
import com.intellectdesign.canvas.database.GenericDatabaseCacheDataBuilder;

/**
 * This is the cache handler for the various HAL definitions configured in the database. This creates an indexed map
 * where the key is the APP_ID and the value is the configuration from the database.
 * 
 * @version 1.0
 */
public class HADefinitionsCacheDataBuilder extends GenericDatabaseCacheDataBuilder
{
	/**
	 * Default constructor
	 */
	public HADefinitionsCacheDataBuilder()
	{
	}

	/**
	 * Initialize the contents of the cache.
	 * 
	 * @see com.intellectdesign.CacheDataBuilder.cache.CacheHandler#initializeCache(javax.servlet.http.HttpSession)
	 * @param hashMap
	 * @return List
	 */
	@Override
	protected List initializeCache(HashMap hashMap)
	{
		List<Map> returnList = super.initializeCache(hashMap);
		// Index this by the Appid on each record.
		String appId;
		Map indexedMap = new HashMap<String, Map>();
		for (Map aMap : returnList)
		{
			appId = (String) aMap.get(InfraConstants.APPID);
			indexedMap.put(appId, aMap);
		}
		returnList.clear();
		returnList.add(indexedMap);

		return returnList;
	}

}
