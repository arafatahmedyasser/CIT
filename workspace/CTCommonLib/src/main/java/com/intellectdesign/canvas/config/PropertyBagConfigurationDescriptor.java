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

package com.intellectdesign.canvas.config;

import java.util.PropertyResourceBundle;

import org.apache.commons.lang.StringUtils;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;

/**
 * This represents a simple Property bag based configuration descriptor where it stores the values like a simple key /
 * value pair.
 * 
 * @version 1.0
 */
public class PropertyBagConfigurationDescriptor implements IPropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 4557938855807468986L;

	/**
	 * The logger instance for this class
	 */
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			PropertyBagConfigurationDescriptor.class);

	private String descriptorName;
	private PropertyResourceBundle configData = null;
	private IPropertyBagConfigurationDescriptor defaultDescriptor = null;
	private final String CT_WORK_FOLDER_PATH = "CT_WORK_FOLDER_PATH";
	private final String CT_WORK_CENTRALIZED_FOLDER_PATH = "CT_WORK_CENTRALIZED_FOLDER_PATH";

	/**
	 * The only constructor for this descriptor
	 * 
	 * 
	 * @param name The name of the descriptor
	 */
	public PropertyBagConfigurationDescriptor(String name)
	{
		descriptorName = name;
	}

	/**
	 * ref to CacheName
	 * 
	 * @return The name of this descriptor as provided at the time of construction
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#getName()
	 */
	@Override
	public String getName()
	{
		return descriptorName;
	}

	/**
	 * ref to LoadConfig
	 * 
	 * @param configSource The source from where this should be loaded. By default the source is considered to be a
	 *            properies file that is loaded into the internal store
	 * @param aDescriptor The default descriptor that is initialized
	 * @throws ConfigurationException Thrown if any error occurs whoile loading the configuration
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#loadConfiguration(java.lang.String)
	 */
	@Override
	public void loadConfiguration(String configSource, IConfigurationDescriptor aDescriptor)
			throws ConfigurationException
	{
		if (StringUtils.isEmpty(configSource) || !ResourceBundleUtils.isPropertyBundlePresent(configSource))
		{
			String errorMsg = "Missing or invalid for loading configuration '" + getName() + "'. Source provided is '"
					+ configSource + "'";
			LOGGER.cterror("CTCOM00019", getName(), configSource);
			throw new ConfigurationException("CONFIG_ERR_01", errorMsg);
		}

		configData = (PropertyResourceBundle) PropertyResourceBundle.getBundle(configSource);
		this.defaultDescriptor = (IPropertyBagConfigurationDescriptor) aDescriptor;
	}

	/**
	 * ref to ReloadConfig
	 * 
	 * @param configSource The source from where this should be loaded. By default the source is considered to be a
	 *            properies file that is loaded into the internal store
	 * @param aDescriptor The default descriptor that is initialized
	 * @throws ConfigurationException thrown if any error occurs while reloading the configuration
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#reloadConfiguration(java.lang.String)
	 */
	@Override
	public void reloadConfiguration(String configSource, IConfigurationDescriptor aDescriptor)
			throws ConfigurationException
	{
		if (StringUtils.isEmpty(configSource) || !ResourceBundleUtils.isPropertyBundlePresent(configSource))
		{
			String errorMsg = "Missing or invalid for reloading configuration '" + getName()
					+ "'. Source provided is '" + configSource + "'";
			LOGGER.cterror("CTCOM00020", getName(), configSource);
			throw new ConfigurationException("CONFIG_ERR_01", errorMsg);
		}

		configData = (PropertyResourceBundle) PropertyResourceBundle.getBundle(configSource);
		this.defaultDescriptor = (IPropertyBagConfigurationDescriptor) aDescriptor;
	}

	/**
	 * ref to Str Cache error
	 * 
	 * @param propKey
	 * @return String
	 * @see com.intellectdesign.canvas.config.IPropertyBagConfigurationDescriptor#getString(java.lang.String)
	 */
	@Override
	public String getString(String propKey)
	{
		if (configData == null)
		{
			String errorMsg = "getString can be accessed only after the Configuration has been loaded first time. Please ensure that you call ConfigurationManager.initialize() first before invoking the getString() method";
			LOGGER.cterror("CTCOM00021");
			throw new ConfigurationException("CONFIG_INIT_ERR", errorMsg);
		}

		if (configData.containsKey(propKey))
			return configData.getString(propKey);
		return null;
	}

	/**
	 * ref to Str Cache Propkey Values
	 * 
	 * @param propKey
	 * @param defaultValue
	 * @return String
	 * @see com.intellectdesign.canvas.config.IPropertyBagConfigurationDescriptor#getString(java.lang.String, java.lang.String)
	 */
	@Override
	public String getString(String propKey, String defaultValue)
	{
		if (configData == null)
		{
			String errorMsg = "getString can be accessed only after the Configuration has been loaded first time. Please ensure that you call ConfigurationManager.initialize() first before invoking the getString() method";
			LOGGER.cterror("CTCOM00022");
			throw new ConfigurationException("CONFIG_INIT_ERR", errorMsg);
		}

		if (configData.containsKey(propKey))
			return configData.getString(propKey);
		return defaultValue;
	}

	/**
	 * This method returns the raw configuration data. This allows the sub classes to provide more targeted methods for
	 * configuration retrieval
	 * 
	 * @return The Property bundle that contains the complete configuration data
	 */
	protected PropertyResourceBundle getRawConfigData()
	{
		return configData;
	}

	/**
	 * This method is used to get the work folder path
	 * 
	 * @return value stored for CT_WORK_FOLDER_PATH
	 */
	protected String getWorkFolderPath()
	{
		return this.defaultDescriptor.getString(CT_WORK_FOLDER_PATH);

	}

	/**
	 * This method is used to get the centralized work folder path
	 * 
	 * @return value stored for CT_WORK_CENTRALIZED_FOLDER_PATH
	 */

	protected String getWorkCentralizedFolderPath()
	{
		return this.defaultDescriptor.getString(CT_WORK_CENTRALIZED_FOLDER_PATH);
	}
}
