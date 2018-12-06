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
 * This class contains the Web utility descriptors
 * 
 * @version 1.0
 */
public class WebUtilDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 5942368370769666566L;

	public static final String MAIN_CONFIG_CT_WEBUTIL = "CT_WEBUTIL_BUNDLE";

	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(WebUtilDescriptor.class);

	private String ondemandFwJSURI = "canvasondemandjs.xml";
	private String ondemandJSURI;

	private boolean compressJS = false;

	private boolean compressCSS = false;

	private String compressPath = null;

	/**
	 * ref to WebUtilDescriptor
	 * 
	 * @param name
	 */
	public WebUtilDescriptor(String name)
	{
		super(name);
	}

	/*******************************************************************************************************************
	 * Method returns the file name of the on demand JS
	 * 
	 * @return String
	 */
	public String getOnDemandJSURI()
	{
		return ondemandJSURI;
	}

	/**
	 * This method returns the filename of the Canvas Ondemand xml
	 * 
	 * @return filename
	 */
	public String getFwOnDemandJSURI()
	{
		return ondemandFwJSURI;
	}

	/**
	 * Method returns the flag to enable or disable JS Compression
	 * 
	 * @return boolean
	 */
	public boolean getCompressJSFlag()
	{
		return compressJS;
	}

	/*******************************************************************************************************************
	 * Method returns the flag to enable or disable CSS compression.
	 * 
	 * @return boolean
	 */
	public boolean getCompressCSSFlag()
	{
		return compressCSS;
	}

	/**
	 * Method returns the flag to enable or disable JS Compression
	 * 
	 * @return boolean
	 */
	public String getCompressPath()
	{
		return compressPath;
	}

	/**
	 * The following method loads the configuration file.
	 * 
	 * @param configSource
	 * @throws ConfigurationException
	 */
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{

		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the WebUtil configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();
		ondemandJSURI = ResourceBundleUtils.getString(bundle, "JSCONFIG_XML", "ondemandjsfiles_lib.xml");
		compressJS = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "COMPRESS_JS_FILES", "Y"));
		compressCSS = StringUtils.convertToBoolean(ResourceBundleUtils.getString(bundle, "COMPRESS_CSS_FILES", "Y"));
		compressPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "COMPRESS_FILE_PATH", "");

	}

	/**
	 * Helper method that validates a configuration before loading the same.
	 * 
	 * @return boolean true if the configuration is valid
	 */
	private boolean isValidConfiguration()
	{
		PerformanceTimer timer = new PerformanceTimer();
		boolean validationStatus = true;
		StringBuilder errorBuilder = new StringBuilder();
		LOGGER.ctdebug("CTCOM00100");
		timer.startTimer(getClass(), "isValidateConfiguration");

		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validator.validateXMLPath("JSCONFIG_XML", bundle));
		errorBuilder.append(validator.validateIndicators("COMPRESS_JS_FILES", bundle));
		errorBuilder.append(validator.validateIndicators("COMPRESS_CSS_FILES", bundle));
		errorBuilder.append(validator.validatePathConfig("COMPRESS_FILE_PATH", bundle, getWorkFolderPath()));

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00101");
		else
		{
			LOGGER.cterror("CTCOM00102", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}
}
