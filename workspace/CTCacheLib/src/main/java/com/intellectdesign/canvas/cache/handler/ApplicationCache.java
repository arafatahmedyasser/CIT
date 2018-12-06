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

import javax.servlet.http.HttpSession;

/**
 * This represents an application level cache.
 * 
 * @version 1.0
 */
public final class ApplicationCache extends Cache
{

	/**
	 * The default constructor. Sets the scope of the cache by default.
	 */
	public ApplicationCache()
	{
		setScope(CacheConstants.SCOPE_APPLICATION);
	}

	/**
	 * Implementation of abstract method of base class. Always returns true to indicate that pre load is supported for
	 * application cache
	 * 
	 * @return boolean Always true as preload is supported
	 */
	protected boolean isPreLoadSupported()
	{
		return true;
	}

	/**
	 * Implementation of abstract method of base class. Always returns true to indicate that expiry is supported for
	 * application cache
	 * 
	 * @return boolean Always true as expiry is supported
	 */
	protected boolean isExpirySupported()
	{
		return true;
	}

	/**
	 * Gets the internal cache key corresponding to this cache
	 * 
	 * @param session The session object. This is ignored
	 * @return String the key to be used for caching the data corresponding to this cache.
	 */
	protected String getInternalCacheKey(HttpSession session)
	{
		return getId();
	}
}
