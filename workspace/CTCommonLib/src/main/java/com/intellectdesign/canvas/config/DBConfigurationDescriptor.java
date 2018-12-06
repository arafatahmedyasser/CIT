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

import java.util.HashMap;
import java.util.PropertyResourceBundle;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class contains the DB Configuration
 * @version 1.0
 */
public class DBConfigurationDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 883194691588006063L;

	public static final String MAIN_CONFIG_CT_DB = "CT_DB_BUNDLE";

	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(DBConfigurationDescriptor.class);

	/**
	 * The only constructor for this descriptor. This takes the name associated to this descriptor
	 * 
	 * @param name The name for this descriptor
	 */

	public DBConfigurationDescriptor(String name)
	{
		super(name);
	}

	private String ctFWIBATISDSKey = null;
	private String ctDefaultiBatisDSKey = null;
	private HashMap<String, String> ctImplIBATISDSMap = new HashMap<String, String>();
	private String ctFWIBATISDS = null;
	private String ctFWIBATISDSVendor = null;

	private String ctusertxnjndiname = null;
	private String ctremotetxnjndiname = null;

	private String implDataSourceName = null;

	private String providerUrl = null;

	private String jndiFactory = null;

	/**
	 * ref to Impldatasource
	 * 
	 * @return the fwdatasource
	 */
	public String getImplDataSourceName()
	{
		return implDataSourceName;
	}

	/**
	 * ref to fwdatasource
	 * 
	 * @return the fwdatasource
	 */
	public String getProviderUrl()
	{
		return providerUrl;
	}

	/**
	 * ref to jndiFactory fwdatasource
	 * 
	 * @return the fwdatasource
	 */
	public String getJndiFactory()
	{
		return jndiFactory;
	}

	/**
	 * ref toctFWIBATISDS
	 * 
	 * @return the fwdatasource
	 */
	public String getCtFWIBATISDS()
	{
		return ctFWIBATISDS;
	}

	/**
	 * ref to ctFWIBATISDSVendor
	 * 
	 * @return the fwdatasourcevendor
	 */

	public String getCtFWIBATISDSVendor()
	{
		return ctFWIBATISDSVendor;
	}

	/**
	 * ref to fwdSourceKey
	 * 
	 * @return the fwdatasourcekey
	 */
	public String getCtFWIBATISDSKey()
	{
		return ctFWIBATISDSKey;
	}

	/**
	 * ref to DB deauly key
	 * 
	 * @return the default datasource key
	 */
	public String getCtDefaultiBatisDSKey()
	{
		return ctDefaultiBatisDSKey;
	}

	/**
	 * This corresponds to the key - value of the implementation Datasource key and the corresponding sqlmap file
	 * 
	 * @return the map of implementation DB ibatis config
	 */
	public HashMap<String, String> getCtImplIBATISDSMap()
	{
		return ctImplIBATISDSMap;
	}

	/**
	 * ref to Ctusertxnjndiname
	 * 
	 * @return the default datasource key
	 */

	public String getCtusertxnjndiname()
	{
		return ctusertxnjndiname;
	}

	/**
	 * ref to ctremotetxnjndiname
	 * 
	 * @return the default datasource key
	 */

	public String getCtremotetxnjndiname()
	{
		return ctremotetxnjndiname;
	}

	/**
	 * ref to LoadConfig
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#loadConfiguration(java.lang.String)
	 */
	@Override
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the Database configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();

		ctFWIBATISDSKey = ResourceBundleUtils.getString(bundle, "CT_FW_IBATIS_DATASOURCE_KEY", "");
		ctFWIBATISDS = ResourceBundleUtils.getString(bundle, "CT_FW_DATASOURCE", "");
		implDataSourceName = ResourceBundleUtils.getString(bundle, "DATASOURCE_NAME", "");
		ctFWIBATISDSVendor = ResourceBundleUtils.getString(bundle, "CT_FW_DATABASE_VENDOR", "");
		ctDefaultiBatisDSKey = ResourceBundleUtils.getString(bundle, "CT_DEFAULT_IBATIS_DATASOURCE_KEY", "");
		jndiFactory = ResourceBundleUtils.getString(bundle, "JNDI_FACTORY", "");
		providerUrl = ResourceBundleUtils.getString(bundle, "PROVIDER_URL", "");
		jndiFactory = ResourceBundleUtils.getString(bundle, "JNDI_FACTORY", "");
		String[] allIBATISDBKeys = StringUtils.convertToArray(ResourceBundleUtils.getString(bundle,
				"CT_IBATIS_DATASOURCE_KEYS", ""), ",");

		if (allIBATISDBKeys != null)
		{
			for (String allIBATISDBKey : allIBATISDBKeys)
			{
				ctImplIBATISDSMap.put(allIBATISDBKey, ResourceBundleUtils.getString(bundle, allIBATISDBKey + "_DSXML",
						""));
			}
		}

		ctusertxnjndiname = ResourceBundleUtils.getString(bundle, "USER_TXN_NAME.JNDIName", "");
		ctremotetxnjndiname = ResourceBundleUtils.getString(bundle, "REMOTE_TXN_NAME.JNDIName", "");
	}

	/**
	 * Helper method that validates a configuration before loading the same.
	 * 
	 */
	private boolean isValidConfiguration()
	{
		PerformanceTimer timer = new PerformanceTimer();
		boolean validationStatus = true;
		StringBuilder errorBuilder = new StringBuilder();
		LOGGER.ctdebug("CTCOM00007");
		timer.startTimer(getClass(), "isValidConfiguration");
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validator.validateConfig("CT_FW_IBATIS_DATASOURCE_KEY", bundle));
		errorBuilder.append(validator.validateConfig("CT_FW_DATASOURCE", bundle));
		errorBuilder.append(validator.validateConfig("CT_FW_DATABASE_VENDOR", bundle));
		errorBuilder.append(validator.validateConfig("DATASOURCE_NAME", bundle));
		errorBuilder.append(validator.validateConfig("PROVIDER_URL", bundle));
		errorBuilder.append(validator.validateConfig("JNDI_FACTORY", bundle));
		errorBuilder.append(validator.validateConfig("CT_IBATIS_DATASOURCE_KEYS", bundle));
		// Multiple DataSource Validation Starts
		String[] allIBATISDBKeys = StringUtils.convertToArray(ResourceBundleUtils.getString(bundle,
				"CT_IBATIS_DATASOURCE_KEYS", ""), ",");
		if (allIBATISDBKeys != null)
		{
			for (String allIBATISDBKey : allIBATISDBKeys)
			{
				errorBuilder.append(validator.validateXMLPath(allIBATISDBKey + "_DSXML", bundle));
			}
		}
		// Multiple DataSource Validation Ends
		errorBuilder.append(validator.validateConfig("CT_DEFAULT_IBATIS_DATASOURCE_KEY", bundle));
		errorBuilder.append(validator.validateConfig("USER_TXN_NAME.JNDIName", bundle));
		errorBuilder.append(validator.validateConfig("REMOTE_TXN_NAME.JNDIName", bundle));

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00008");
		else
		{
			LOGGER.cterror("CTCOM00009", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}
}
