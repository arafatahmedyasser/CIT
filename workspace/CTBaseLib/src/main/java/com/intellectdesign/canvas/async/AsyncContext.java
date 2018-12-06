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
package com.intellectdesign.canvas.async;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import com.intellectdesign.canvas.logging.initalizer.Log4jMDCInitializer;
import com.intellectdesign.canvas.utils.CanvasThreadLocal;

/**
 * This is the context that is always passed to a job for it to refer to as part of the execution. The context by
 * default includes the current ThreadLocal data managed by the framework and transitioned to the executing thread. End
 * applications can use the additional API's for including additional attributes that can be transferred into the
 * ThreadLocal of the executing thread.
 * 
 * @Version 15.1
 */
public class AsyncContext implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 4368067251947289036L;
	private Map threadLocalData;
	private String asyncSetupName;

	/**
	 * The default constructor
	 */
	public AsyncContext()
	{
		threadLocalData = new HashMap<String, Object>();
		// Get the current thread's threadlocal data and seed it into the local copy.
		threadLocalData.putAll(new Log4jMDCInitializer().getMDCData());
		threadLocalData.putAll(CanvasThreadLocal.retrieveAllData());
	}

	/**
	 * This method adds the given key / value into the Thread Local data that will be set on the executing thread.
	 * 
	 * @param aKey The key to be put into the ThreadLocal
	 * @param aValue The value for this key.
	 */
	public void addToThreadLocal(String aKey, Serializable aValue)
	{
		threadLocalData.put(aKey, aValue);
	}

	/**
	 * Returns the name of the Async setup that has triggered the job execution
	 * 
	 * @return The name of the async setup
	 */
	public String getAsyncSetupName()
	{
		return asyncSetupName;
	}

	/**
	 * Sets the name of the Async setup that has triggered the job execution.
	 * 
	 * @param aName The name of the async setup.
	 */
	public void setAsyncSetupName(String aName)
	{
		asyncSetupName = aName;
	}

	/**
	 * Updates the thread local data with what ever that has been provided
	 */
	public void updateCurrentThreadLocalData()
	{
		new Log4jMDCInitializer().initLog4jMDC(threadLocalData);
		CanvasThreadLocal.putAll(threadLocalData);
	}

	/**
	 * Resets all Thread local data that has been added by the context
	 */
	public void resetCurrentThreadLocalData()
	{
		new Log4jMDCInitializer().removeFromMDC();
		CanvasThreadLocal.clear();
	}
}
