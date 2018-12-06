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

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This class contains the property multilingual Label
 * 
 * @version 1.0
 */
public class MultilingualLabelDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = -1L;

	public static final String MAIN_CONFIG_CT_MULTILINGUAL = "CT_MULTILINGUAL_BUNDLE";
	public static final String CT_PROPERTY_LABELS = "CT_PROPERTY_LABELS";
	public static final String CT_LANG_COUNTRY_CODE = "CT_LANG_COUNTRY_CODE";
	public static final String DEFUALT_PATH_FOR_BUNDLE = "DEFUALT_PATH_FOR_BUNDLE";
	public static final String CT_LABELS_OVERRIDE_BUNDLE_NAME = "CT_LABELS_OVERRIDE_BUNDLE_NAME";

	public static final String CT_LABEL_ERRORS = "canvas-default";
	public static final String DEFAULT_LANGUAGE = "en_US";
	private String DELIMITER = ",";
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(MultilingualLabelDescriptor.class);

	private String[] ctPropertyLabels = new String[]
	{};
	private String[] ctLangCountryCode = new String[]
	{};
	private String defaultPathForBundle;

	private String ctOverrrideBundleName;

	/**
	 * @param name
	 */
	public MultilingualLabelDescriptor(String name)
	{
		super(name);
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
					"Issues were found as part of the MutlilingualLabel resource bundle configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();

		/**
		 * Step 1: Getting the supported bundles name from the multilingual property resource bundle
		 */
		String bundleLabels = ResourceBundleUtils.getString(bundle, CT_PROPERTY_LABELS, "");

		if (!bundleLabels.isEmpty())
		{
			int defaultBundlePosition = bundleLabels.indexOf(CT_LABEL_ERRORS);
			if (defaultBundlePosition == -1)
			{
				bundleLabels = CT_LABEL_ERRORS.concat("," + bundleLabels);
			}
		} else
		{
			bundleLabels = CT_LABEL_ERRORS;
		}

		ctPropertyLabels = StringUtils.split(bundleLabels, DELIMITER);

		/**
		 * Step 2: Getting the supported languages for resourcebundle creation.
		 */
		String supportedLangIds = ResourceBundleUtils.getString(bundle, CT_LANG_COUNTRY_CODE, "");

		/*
		 * if(!supportedLangIds.isEmpty()){ int defaultBundlePosition = supportedLangIds.indexOf(DEFAULT_LANGUAGE);
		 * if(defaultBundlePosition == -1){ supportedLangIds=DEFAULT_LANGUAGE.concat(","+supportedLangIds); } }else{
		 * supportedLangIds=DEFAULT_LANGUAGE; }
		 */
		if (!supportedLangIds.isEmpty())
		{
			ctLangCountryCode = StringUtils.split(supportedLangIds, DELIMITER);
		} else
		{
			supportedLangIds = DEFAULT_LANGUAGE;
		}

		/**
		 * Step 3: Getting the path for the resource bundle where we need to create it.
		 */
		defaultPathForBundle = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, DEFUALT_PATH_FOR_BUNDLE, "");

		/**
		 * Step 3: Getting the path for the resource bundle where we need to create it.
		 */
		ctOverrrideBundleName = ResourceBundleUtils.getString(bundle, CT_LABELS_OVERRIDE_BUNDLE_NAME, "");
	}

	/**
	 * ref to CtPropLabels
	 * 
	 * @return the ctPropertyLabels
	 */
	public String[] getCtPropertyLabels()
	{
		return ctPropertyLabels;
	}

	/**
	 * ref to ctLangCountryCode
	 * 
	 * @return the ctLangCountryCode
	 */
	public String[] getCtLangCountryCode()
	{
		return ctLangCountryCode;
	}

	/**
	 * ref to defaultPathForBundle
	 * 
	 * @return the defaultPathForBundle
	 */
	public String getDefaultPathForBundle()
	{
		return defaultPathForBundle;
	}

	/**
	 * ref to ctOverrrideBundleName
	 * 
	 * @return the ctOverrrideBundleName
	 */
	public String getCtOverrrideBundleName()
	{
		return ctOverrrideBundleName;
	}

	/**
	 * ref to ValidConfiguration
	 * 
	 * @return validstatus
	 */
	private boolean isValidConfiguration()
	{
		PerformanceTimer timer = new PerformanceTimer();
		boolean validationStatus = true;
		StringBuilder errorBuilder = new StringBuilder();
		LOGGER.ctdebug("CTCOM00016");
		timer.startTimer(getClass(), "isValidateConfiguration");
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validator.validateLangCode(CT_LANG_COUNTRY_CODE, bundle));
		errorBuilder.append(validator.validateConfig(CT_PROPERTY_LABELS, bundle));
		errorBuilder.append(validator.validateConfig(CT_LABELS_OVERRIDE_BUNDLE_NAME, bundle));
		errorBuilder.append(validator.validatePathConfig(DEFUALT_PATH_FOR_BUNDLE, bundle, getWorkFolderPath()));

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00017");
		else
		{
			LOGGER.cterror("CTCOM00018", errorBuilder.toString());
		}

		timer.endTimer();
		return validationStatus;
	}
}
