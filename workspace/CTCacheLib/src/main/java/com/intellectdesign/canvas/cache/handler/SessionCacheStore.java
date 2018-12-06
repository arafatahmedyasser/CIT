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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

/**
 * This is the object that is bound to the session that has requested for a session cache to be stored. This keeps track
 * of all the cache keys created for the particular session. When a session gets invalidated, it takes care of
 * triggering the destroy of all the caches linked to that session. There will be one object of this cache store per
 * session.
 * 
 * @version 1.0
 */
public class SessionCacheStore implements Serializable, HttpSessionBindingListener
{

	/**
	 * The default constructor. Sets the keys list to an empty list.
	 */
	public SessionCacheStore()
	{
		setCacheKeyList(new ArrayList());
	}

	/**
	 * this is metod ref to Event raised when the object has been bound to the session. This API is not used.
	 * 
	 * @param event The event object having the session details
	 */
	public void valueBound(HttpSessionBindingEvent event)
	{
	}

	/**
	 * method is ref to Event raised when the object is unbound from session. This will typically occur in following
	 * scenarios - - Session has expired - Session has been invalidated - Explicit call to session.removeAttribute. This
	 * will never happen from within the caching f/w.
	 * 
	 * @param event The event object having the session details
	 */
	public final void valueUnbound(HttpSessionBindingEvent event)
	{
		// Here we just iterate through the list of session cache keys present at the current session level.
		// Since this session itself is no longer going to be present, the session caches created for this
		// session can be destroyed.
		int numElements = getCacheKeyList().size();
		CacheManager manager = CacheManager.getInstance();
		for (int index = 0; index < numElements; index++)
		{
			manager.destroyCache((String) getCacheKeyList().get(index));
		}
	}

	/**
	 * ref to Gets the list containing the list of cache keys stored for this session.
	 * 
	 * @return List the list of cache keys stored for this session.
	 */
	protected final List getCacheKeyList()
	{
		return mCacheKeyList;
	}

	/**
	 * ref to Sets the list containing the list of cache keys stored for this session.
	 * 
	 * @param keysList the list of cache keys stored for this session.
	 */
	private void setCacheKeyList(List keysList)
	{
		mCacheKeyList = keysList;
	}

	/**
	 * ref to Internal constant for serialization purposes.
	 */
	private static final long serialVersionUID = -5133759324281599966L;

	/**
	 * ref to Internal storage of the cache keys.
	 */
	private List mCacheKeyList;
}
