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

import java.util.List;
import java.util.TimerTask;

/**
 * This is the timer task which monitors the cache for stale data and accordingly raises the notification to the
 * corresponding cache to refresh its data.
 * 
 * @version 1.0
 */
public class CacheRefreshTimerTask extends TimerTask
{

	/**
	 * Implement the abstract method of the base class. actual processing is done here. The list of caches that have to
	 * be expired is identified and these are asked to refresh themselves.
	 */
	public void run()
	{
		Cache aCache;
		List expiredCacheList = CacheManager.getInstance().getExpiredCacheList();
		int numCaches = expiredCacheList.size();

		for (int index = 0; index < numCaches; index++)
		{
			aCache = (Cache) expiredCacheList.get(index);
			// Ask the cache to handle the expiry scenario.
			aCache.handleCacheExpiry();
		}
	}
}
