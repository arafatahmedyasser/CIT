/**
 * Copyright 2015. Intellect Design Arena Limited. All rights reserved. 
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
package com.intellectdesign.canvas.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * This is a ThreadLocal container that is used within Canvas for storing any attribute needed at the processing Thread
 * level. This is managed on a per thread basis and the data stored is automatically inherited from parent to child
 * thread.
 * 
 * @Version 15.1
 */
public class CanvasThreadLocal
{
	private static final CanvasThreadLocal _instance = new CanvasThreadLocal();
	private ThreadLocalImpl _impl;

	/**
	 * Constructor is made private to ensure that everyone accesses this only using its static methods
	 */
	private CanvasThreadLocal()
	{
		_impl = new ThreadLocalImpl();
	}

	/**
	 * This method clears all the data stored within the ThreadLocal.
	 */
	public static void clear()
	{
		if (_instance != null)
			_instance.clearImpl();
	}

	/**
	 * This method returns the value present in the thread local for the key provided.
	 * 
	 * @param aKey The key for which data needs to be fetched
	 * @return The value for the key if present. Else returns null.
	 */
	public static Object get(String aKey)
	{
		if (_instance != null)
			return _instance.getImpl(aKey);
		return null;
	}

	/**
	 * This method adds the given key and value into the thread local.
	 * 
	 * @param aKey The key to be added
	 * @param aValue The value for this key.
	 */
	public static void put(String aKey, Object aValue)
	{
		if (_instance != null)
			_instance.putImpl(aKey, aValue);
	}

	/**
	 * This method adds the contents of the sourceData into the thread local
	 * 
	 * @param sourceData The data to be added into the thread local
	 */
	public static void putAll(Map sourceData)
	{
		if (_instance != null)
			_instance.putAllImpl(sourceData);
	}

	/**
	 * This method can be used to retrieve all the data added into thread local
	 * 
	 * @return A copy of the data that has been added to the thread local.
	 */
	public static HashMap retrieveAllData()
	{
		if (_instance != null)
			return _instance.retrieveAllDataImpl();
		return null;
	}

	/**
	 * This method clears out the data from the Map stored in ThreadLocal as well as removes the Map itself from the
	 * ThreadLocal
	 */
	private void clearImpl()
	{
		if (_impl != null)
		{
			HashMap localData = _impl.get();
			if (localData != null)
				localData.clear();
			// Also clear out this map from the Thread.
			_impl.remove();
		}
	}

	/**
	 * This method returns the value present in the thread local for the key provided.
	 * 
	 * @param aKey The key for which data needs to be fetched
	 * @return The value for the key if present. Else returns null.
	 */
	private Object getImpl(String aKey)
	{
		if (_impl != null)
		{
			HashMap localData = _impl.get();
			if (localData != null)
				return localData.get(aKey);
		}
		// If control reaches here, there is no thread local data or this key is absent. Either way, return null.
		return null;
	}

	/**
	 * This method adds the given key and value into the thread local.
	 * 
	 * @param aKey The key to be added
	 * @param aValue The value for this key.
	 */
	private void putImpl(String aKey, Object aValue)
	{
		if (_impl != null)
		{
			HashMap localData = _impl.get();
			if (localData != null)
				localData.put(aKey, aValue);
		}
	}

	/**
	 * This method adds the contents of the sourceData into the thread local
	 * 
	 * @param sourceData The data to be added into the thread local
	 */
	private void putAllImpl(Map sourceData)
	{
		if (_impl != null)
		{
			HashMap localData = _impl.get();
			if (localData != null)
				localData.putAll(sourceData);
		}
	}

	/**
	 * This method can be used to retrieve all the data added into thread local
	 * 
	 * @return A copy of the data that has been added to the thread local.
	 */
	private HashMap retrieveAllDataImpl()
	{
		HashMap allData = null;
		if (_impl != null)
		{
			HashMap localData = _impl.get();
			if (localData != null)
				allData = (HashMap) localData.clone();
		}
		return allData;
	}

	/**
	 * This is a thread local variable that allows for data to be stored into a hashtable.
	 * 
	 * @Version 15.1
	 */
	protected final class ThreadLocalImpl extends InheritableThreadLocal<HashMap>
	{
		/**
		 * Here if the parentValue is not null, then we return a clone of the parent value
		 * 
		 * @param parentValue The value that the parent has
		 * @return The child value
		 * @see java.lang.InheritableThreadLocal#childValue(java.lang.Object)
		 */
		@Override
		protected HashMap childValue(HashMap parentValue)
		{
			if (parentValue != null)
				return (HashMap) parentValue.clone();
			return null;
		}

		/**
		 * This will be invoked if the get() method is invoked for the first time on this ThreadLocal. Here we want to
		 * always return a new Map so that this acts as an empty context placeholder
		 * 
		 * @return A new HashMap() object
		 * @see java.lang.ThreadLocal#initialValue()
		 */
		@Override
		protected HashMap initialValue()
		{
			return new HashMap();
		}
	}
}
