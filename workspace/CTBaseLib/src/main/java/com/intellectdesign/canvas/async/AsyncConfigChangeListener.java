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

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.config.AsyncConfigurationDescriptor;
import com.intellectdesign.canvas.config.ConfigurationException;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.IConfigurationChangeListener;
import com.intellectdesign.canvas.exceptions.common.BaseException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;

/**
 * This is the listener for the Async framework to initialize itself whenever the configuration is changed
 * 
 * @Version 15.1
 */
public class AsyncConfigChangeListener implements IConfigurationChangeListener
{
	/**
	 * The default constructor. Nothing to do here
	 */
	public AsyncConfigChangeListener(ServletContext servletContext)
	{
		// Nothing to do here
	}

	/**
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationInitialized()
	 */
	@Override
	public void configurationInitialized()
	{
		processAsyncConfiguration();
	}

	/**
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationReinitialized()
	 */
	@Override
	public void configurationReinitialized()
	{
		processAsyncConfiguration();
	}

	/**
	 * This is a helper method that processes the Async setup configuration
	 * 
	 * @exception ConfigurationException Thrown if there are any errors while creating the default Async Setup from
	 *                framework
	 */
	private void processAsyncConfiguration()
	{
		AsyncConfigurationDescriptor descriptor = ConfigurationManager.getInstance().getAsyncDescriptor();
		List<String> allSetups = descriptor.getAllSetups();
		Iterator<String> setupIterator = allSetups.iterator();
		String aSetupName;
		HashMap<String, AsyncExecutorSetup> collatedSetups = new HashMap<String, AsyncExecutorSetup>();
		Map<String, String> setupConfig;

		// Step 1: Create and initialize the various async setups configured
		while (setupIterator.hasNext())
		{
			aSetupName = setupIterator.next();
			setupConfig = descriptor.getSetupConfiguration(aSetupName);
			try
			{
				collatedSetups.put(aSetupName, prepareSetup(aSetupName, setupConfig));
				LOGGER.ctdebug("CTBAS00104", aSetupName);
			} catch (AsyncExecutorException e)
			{
				// No point in throwing exception here. We just eat it. and continue to the next setup.
				LOGGER.cterror("CTBAS00105", aSetupName, e);
			}
		}
		// Step 2: Sanity check. Check if the DEFAULT setup is already present. If not, create it from our default
		// configuration
		if (!collatedSetups.containsKey(AsyncDispatcher.DEFAULT_SETUP_NAME))
		{
			try
			{
				collatedSetups.put(AsyncDispatcher.DEFAULT_SETUP_NAME, prepareDefaultSetup());
			} catch (AsyncExecutorException e)
			{
				// This ideally should never occur and involves a major configuration issue. But there is no scope to
				// report exceptions here.
				LOGGER.cterror("CTBAS00105", AsyncDispatcher.DEFAULT_SETUP_NAME, e);
				throw new ConfigurationException("CTBAS00105", "Error occured while creating default Async Setup - "
						+ AsyncDispatcher.DEFAULT_SETUP_NAME, e);
			}
		}

		// Step 3: Update the same into the AsyncDispatcher.
		AsyncDispatcher.updateRegistry(collatedSetups);
	}

	/**
	 * helper method that prepares the target with the initialization configuration.
	 * 
	 * @param setupName The name of the setup
	 * @param setupConfig The configuration of the setup
	 * @return The AsyncExecutorSetup constructed based on the configuration
	 * @throws AsyncExecutorException Thrown if any error occurs while creation / initialization of the setup.
	 */
	private AsyncExecutorSetup prepareSetup(String setupName, Map<String, String> setupConfig)
			throws AsyncExecutorException
	{
		AsyncExecutorSetup target = null;
		String implClass = setupConfig.get(AsyncConfigurationDescriptor.IMPLEMENTATION_CLASS_NAME);

		// Step 1: Create the object.
		try
		{
			target = (AsyncExecutorSetup) ResourceLoaderUtils.createInstance(implClass, setupName);
		} catch (BaseException e)
		{
			throw new AsyncExecutorException(e);
		}

		// Step 2: Transfer all the attributes to the setup. Now every attribute will be prefixed with the setup name.
		// So remove that.
		Iterator<Map.Entry<String, String>> configIterator = setupConfig.entrySet().iterator();
		Map.Entry<String, String> anEntry;
		while (configIterator.hasNext())
		{
			anEntry = configIterator.next();
			target.setAttribute(anEntry.getKey(), anEntry.getValue());
		}

		// Step 3: Ask the setup to initialize itself.
		target.initialize();

		return target;
	}

	/**
	 * helper method that prepares the Default setup
	 * 
	 * @return The AsyncExecutorSetup constructed based on the configuration
	 * @throws AsyncExecutorException Thrown if any error occurs while creation / initialization of the setup.
	 */
	private AsyncExecutorSetup prepareDefaultSetup() throws AsyncExecutorException
	{
		String setupName = AsyncDispatcher.DEFAULT_SETUP_NAME;
		Map<String, String> setupConfig = new HashMap<String, String>();

		ResourceBundle defaultBundle = ResourceBundle.getBundle("canvas-default-async");
		Enumeration<String> keysIterator = defaultBundle.getKeys();
		String aKeyName;
		String compareVal = setupName + ".";

		while (keysIterator.hasMoreElements())
		{
			aKeyName = keysIterator.nextElement();
			if (aKeyName.startsWith(compareVal))
				setupConfig.put(aKeyName.substring(compareVal.length()),
						ResourceBundleUtils.getString(defaultBundle, aKeyName, ""));
		}

		return prepareSetup(setupName, setupConfig);
	}

	/**
	 * The Logger instance for this class
	 */
	private static final Logger LOGGER = Logger.getLogger(AsyncConfigChangeListener.class);

	/**
	 * Invoked when the application is being stopped. Here we stop all the async pool setups
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#shutDown()
	 */
	@Override
	public void shutDown()
	{
		AsyncDispatcher.shutdownAll();
	}
}
