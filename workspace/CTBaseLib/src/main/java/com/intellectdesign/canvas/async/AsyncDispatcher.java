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

import java.util.HashMap;
import java.util.Iterator;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This is a utility class provided for dispatching an Async Job to a target setup
 * 
 * @Version 15.1
 */
public final class AsyncDispatcher
{
	protected static HashMap<String, AsyncExecutorSetup> registry = new HashMap<String, AsyncExecutorSetup>();
	protected static final String DEFAULT_SETUP_NAME = "DEFAULT";

	/**
	 * Marking constructor private to avoid any instantiation of this class.
	 */
	private AsyncDispatcher()
	{
	}

	/**
	 * This method will add the async job to the queue of the setup designated by the setup name. In case there is no
	 * such setup available against the provided name, then the default setup is picked up and the job added to that
	 * setup's queue
	 * 
	 * @param setupName The name of the setup
	 * @param aJob The job to be executed in an async manner
	 * @throws AsyncExecutorException Thrown if there is any error while queueing the job
	 */
	public static void dispatch(String setupName, AsyncJob aJob) throws AsyncExecutorException
	{
		AsyncExecutorSetup asyncSetup = null;

		asyncSetup = getSetupFor(setupName);
		if (asyncSetup != null)
		{
			asyncSetup.addJob(aJob);
			LOGGER.ctdebug("CTBAS00102", aJob.getClass().getName(), asyncSetup.getName());
		} else
		{
			LOGGER.cterror("CTBAS00106", setupName, DEFAULT_SETUP_NAME);
			throw new AsyncExecutorException("CTBAS00106", "Unable to load setup with name " + setupName
					+ " or the DEFAULT setup.");
		}
	}

	/**
	 * This method shuts down all the async setups
	 */
	public static void shutdownAll()
	{
		if (!registry.isEmpty())
		{
			Iterator<AsyncExecutorSetup> valuesIterator = registry.values().iterator();
			AsyncExecutorSetup aSetup;
			while (valuesIterator.hasNext())
			{
				aSetup = valuesIterator.next();
				aSetup.shutdown();
			}
			registry.clear();
		}
	}

	/**
	 * This method is used internally within the framework to update the Registry with the new setups provided. During
	 * this activity, the current setup's if present as asked to shutdown and then the new setups are activated.
	 * 
	 * @param allSetups The set of setup's that need to be added to the registry.
	 */
	protected static synchronized void updateRegistry(HashMap<String, AsyncExecutorSetup> allSetups)
	{
		synchronized (registry)
		{
			shutdownAll();
			registry.putAll(allSetups);
		}
	}

	/**
	 * This is a helper method that gets the setup for the given name. In case the setup cannot be identified, then the
	 * default is returned
	 * 
	 * @param setupName The name of the setup
	 * @return The setup identified for the given name.
	 */
	private static AsyncExecutorSetup getSetupFor(String setupName)
	{
		AsyncExecutorSetup result = registry.get(setupName);
		if (result == null)
		{
			LOGGER.ctwarn("CTBAS00103", setupName, DEFAULT_SETUP_NAME);
			result = registry.get(DEFAULT_SETUP_NAME);
		}

		return result;
	}

	private static final Logger LOGGER = Logger.getLogger(AsyncDispatcher.class);
}
