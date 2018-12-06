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
package com.intellectdesign.canvas.config;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.PropertyResourceBundle;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * Async configuration is something that will be needed whenever there is a need for asynchronous processing of tasks.
 * To configure multiple async sinks, the following needs to be done -
 * 
 * To provide the Async related configurations, as part of the Canvas Main Configuration Manager, configure the
 * following key -
 * <ul>
 * <li><b>CT_ASYNC_BUNDLE</b> : This is the bundle that should be loaded from where the async configuration as detailed
 * below will be identified</li>
 * </ul>
 * 
 * This bundle has the configuration for the various async setups that the application needs. The various keys that are
 * identified are
 * <ul>
 * <li><b>ASYNC_SETUP_LIST</b>: This is the comma separated list of setup that is defined. Please note that DEFAULT is a
 * predefined setup considered by the Canvas framework. If DEFAULT is used as a setup name, then the framework assumes
 * that the intent is to replace the default Async setup provided by the framework with the one configured here.</li>
 * <li><b><i>Setup_Name</i>.implementationClass</b>: This is the class that implements the setup. This class should
 * extend com.intellectdesign.canvas.async.AsyncExecutorSetup. Canvas provides 2 default approaches for asynchronous processing.
 * One is through JMS and other through ThreadPoolExecutor. The corresponding classes for the same are provide below -
 * <ul>
 * <li><b>com.intellectdesign.canvas.async.JMSAsyncExecutorSetup</b>: Use this class to have asynchronous processing through JMS
 * </li>
 * <li><b>com.intellectdesign.canvas.async.TPEAsyncExecutorSetup</b>: Use this class to have asynchronous processing through
 * ThreadPoolExecutor</li>
 * </ul>
 * 
 * The remaining configuration for each setup is driven by the dynamic configration supported by the async setup class.
 * Refer to the documentation on each of these classes for the exact list of configuration attributes. For configuring
 * any attribute, the same should be provided using the convention <b><i>Setup_name</i>.<i>Attribute_Name</i></b></li>
 * </ul>
 * 
 * @Version 15.1
 */
public class AsyncConfigurationDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes.
	 */
	private static final long serialVersionUID = 2905795104819406001L;
	public static final String IMPLEMENTATION_CLASS_NAME = "implementationClass";
	
	private List<String> allSetups;
	private HashMap<String, Map> setupConfig;

	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			AsyncConfigurationDescriptor.class);

	/**
	 * @param name The name of this descriptor
	 */
	public AsyncConfigurationDescriptor(String name)
	{
		super(name);
	}

	/**
	 * This method returns the list of all setups configured.
	 * 
	 * @return The list of all setups
	 */
	public List<String> getAllSetups()
	{
		return allSetups;
	}

	/**
	 * Returns the configuration provided against the given setup
	 * 
	 * @param aSetup The setup name
	 * @return The configuration information for the setup.
	 */
	public Map getSetupConfiguration(String aSetup)
	{
		return setupConfig.get(aSetup);
	}

	/**
	 * This method is invoked to load the configuration
	 * 
	 * @param configSource The source of the configuration
	 * @param defultDescriptor The default descriptor
	 * @throws ConfigurationException Thrown if any error occurs while loading configuration
	 * @see com.intellectdesign.canvas.config.PropertyBagConfigurationDescriptor#loadConfiguration(java.lang.String,
	 *      com.intellectdesign.canvas.config.IConfigurationDescriptor)
	 */
	@Override
	public void loadConfiguration(String configSource, IConfigurationDescriptor defultDescriptor)
			throws ConfigurationException
	{
		super.loadConfiguration(configSource, defultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the Async configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();
		// Set the list of setups.
		String setupValues = ResourceBundleUtils.getString(bundle, "ASYNC_SETUP_LIST", "");
		allSetups = StringUtils.convertToList(setupValues, ",");
		Iterator<String> setupIterator = allSetups.iterator();
		String aSetup;
		setupConfig = new HashMap<String, Map>();
		while (setupIterator.hasNext())
		{
			aSetup = setupIterator.next();
			setupConfig.put(aSetup, retrieveSetupConfig(aSetup));
		}
	}

	/**
	 * @param configSource
	 * @param defultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.PropertyBagConfigurationDescriptor#reloadConfiguration(java.lang.String,
	 *      com.intellectdesign.canvas.config.IConfigurationDescriptor)
	 */
	@Override
	public void reloadConfiguration(String configSource, IConfigurationDescriptor defultDescriptor)
			throws ConfigurationException
	{
		loadConfiguration(configSource, defultDescriptor);
	}

	/**
	 * This is a helper method that returns the list of configuration values provided against a given setup name.
	 * 
	 * @param setupName The setup name
	 * @return The map having the configuration keys provided.
	 */
	private Map retrieveSetupConfig(String setupName)
	{
		PropertyResourceBundle bundle = getRawConfigData();
		Enumeration<String> keysIterator = bundle.getKeys();
		String aKeyName;
		String compareVal = setupName + ".";
		HashMap configValues = new HashMap();

		while (keysIterator.hasMoreElements())
		{
			aKeyName = keysIterator.nextElement();
			if (aKeyName.startsWith(compareVal))
				configValues.put(aKeyName.substring(compareVal.length()),
						ResourceBundleUtils.getString(bundle, aKeyName, ""));
		}
		return configValues;
	}

	/**
	 * Only basic validation can be done here. It is then left to the control of each async setup to validate their list
	 * of attrbutes as well as the mandatory, type, etc.
	 * 
	 * @return true if the validation is successful. false otherwise
	 */
	private boolean isValidConfiguration()
	{
		boolean validationStatus = true;
		StringBuilder errorBuilder = new StringBuilder();
		PropertyValidations validator = new PropertyValidations();
		PropertyResourceBundle bundle = getRawConfigData();

		// First validate that the list of setups has been provided.
		errorBuilder.append(validator.validateConfig("ASYNC_SETUP_LIST", bundle));
		if (errorBuilder.length() == 0)
		{
			// Means the setup list has been configured. So get the list and check that the setup class has been
			// configured and that it implements the right base class
			String setupValues = ResourceBundleUtils.getString(bundle, "ASYNC_SETUP_LIST", "");
			List<String> setupList = StringUtils.convertToList(setupValues, ",");
			Iterator<String> setupIterator = setupList.iterator();
			String aSetup;
			String setupClass;
			while (setupIterator.hasNext())
			{
				aSetup = setupIterator.next();
				setupClass = ResourceBundleUtils.getString(bundle, aSetup + "." + IMPLEMENTATION_CLASS_NAME, "");
				errorBuilder.append(validator.validateImplementationClass(setupClass,
						"com.intellectdesign.canvas.async.AsyncExecutorSetup", aSetup + "." + IMPLEMENTATION_CLASS_NAME, true));
			}
		}

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00130");
		else
		{
			LOGGER.cterror("CTCOM00131", errorBuilder.toString());
		}
		return validationStatus;
	}
}
