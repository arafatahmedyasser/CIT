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

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;

import com.intellectdesign.canvas.cache.ICBXCacheWrapper;

/**
 * This implementation class create genral wrapper for the ehcache system
 * 
 * @version 1.0
 */
public class CBXEhCacheWrapper<K, V> implements ICBXCacheWrapper<K, V>
{
	private final String cacheName;
	private final CacheManager cacheManager;

	/**
	 * Constructor of the class with the following params
	 * 
	 * @param cacheName
	 * @param cacheManager
	 */
	public CBXEhCacheWrapper(final String cacheName, final CacheManager cacheManager)
	{
		this.cacheName = cacheName;
		this.cacheManager = cacheManager;
	}

	/**
	 * This method is to set the key and the corresponding value. It abstracts the usage of the element object of the
	 * ehcache system
	 * 
	 * @param Key and Value
	 */

	public void put(K key, V value)
	{
		getCache().put(new Element(key, value));

	}

	/**
	 * This method is to get the corresponding value for the given key. It abstracts the usage of the element object of
	 * the ehcache system
	 * 
	 * @param Key
	 */

	public V get(K key)
	{
		Element element = getCache().get(key);
		if (element != null)
		{
			return (V) element.getObjectValue();
		}
		return null;
	}

	/**
	 * This method is to get the refrence of the corresponding cache
	 * 
	 * @return Ehcache the cache
	 */

	public Ehcache getCache()
	{
		return cacheManager.getEhcache(cacheName);
	}

}
