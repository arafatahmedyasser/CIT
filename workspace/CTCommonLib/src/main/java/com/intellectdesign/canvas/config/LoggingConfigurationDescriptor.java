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

import java.util.Properties;
import java.util.PropertyResourceBundle;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * This is the configuration descriptor that is used for initializing the logging options for the Canvas platform. Where
 * ever the logging level is to be configured, the possible values are - "debug", "error", "info", "fatal", "warn",
 * "off". Default if not provided is "debug"
 * 
 * The logging configuration is done in 2 steps.
 * 
 * Step 1: Add a link in the controller property file to the logging configuration. This is done using the key -
 * <ul>
 * <li><b>CT_LOGGING_CONFIG_BUNDLE</b>: This is the bundle that provides the configuration details specific to logging
 * to be done by CT Framework</li>
 * </ul>
 * 
 * Step 2: Configure the below keys in the bundle shared above to control the logging done by the Canvas platform.
 * <ul>
 * <li><b>LOGGING_ENABLED_IND</b>: This flag is used to turn on of off logging by CT Framework.Turning this off would
 * mean that even Exceptions faced will not be logged to any log file!!!</li>
 * <li><b>log.path</b>: This configuration holds the path where the log files are to be created.</li>
 * <li><b>log.level</b>: The below configuration is for controlling the logging level as a default across all modules
 * within Canvas.</li>
 * <li><b>log.level.audit</b>: Use this to configure specific logging level for the Audit framework.</li>
 * <li><b>log.level.alert</b>: Use this to configure specific logging level for the Alert framework.</li>
 * <li><b>log.level.session</b>: Use this to configure specific logging level for the Session Management framework.</li>
 * <li><b>log.level.web</b>: Use this to configure specific logging level for the Web layer.</li>
 * <li><b>log.level.config</b>: Use this to configure specific logging level for the Configuration framework.</li>
 * <li><b>log.level.cache</b>: Use this to configure specific logging level for the Cache framework.</li>
 * <li><b>log.level.security</b>: Use this to configure specific logging level for the Security aspects within Canvas.</li>
 * <li><b>log.level.database</b>: Use this to configure specific logging level for the Database framework.</li>
 * <li><b>log.level.entitlement</b>: Use this to configure specific logging level for the Entitlement framework.</li>
 * <li><b>log.level.event</b>: Use this to configure specific logging level for the Event framework.</li>
 * <li><b>log.level.export</b>: Use this to configure specific logging level for the Export framework.</li>
 * <li><b>log.level.vdf</b>: Use this to configure specific logging level for the Metadata framework.</li>
 * <li><b>log.level.hal</b>: Use this to configure specific logging level for the HAL framework.</li>
 * <li><b>log.level.report</b>: Use this to configure specific logging level for the Reporting framework.</li>
 * <li><b>log.level.validator</b>: Use this to configure specific logging level for the Validation framework.</li>
 * <li><b>log.level.scheduler</b>: Use this to configure specific logging level for the Scheduler framework.</li>
 * <li><b>rollovermodel</b>: This configuration allows to choose any of the 2 models supported by Canvas Log appender
 * namely
 * <ul>
 * <li>CREATENEW - Current logging would happen in the file name having the current date pattern and the highest
 * rolling index value. (i.e., logging would happen by creating a new file)</li>
 * <li>BACKUPOLD - Current logging would always happen in file name without date pattern and rolling index, on roll
 * over the current file would be made as a backup with a date pattern and index included in it.</li>
 * </ul>
 * The default used is <b>BACKUPOLD</b></li>
 * <li><b>datepattern</b>: This configuration decides on the following 2 aspects
 * <ul>
 * <li>the period when the rollover should happen (i.e.,) daily, monthly, yearly etc. For Example:
 * <ul>
 * <li>yyyy-MM >> Roll over at the beginning of each month</li>
 * <li>yyyy-ww >> Roll over at the first day of each week. The first day of the week depends on the locale.</li>
 * <li>yyyy-MM-dd >> Roll over at midnight each day.</li>
 * <li>yyyy-MM-dd-a >> Roll over at midnight and midday of each day.</li>
 * <li>yyyy-MM-dd-HH >> Roll over at the top of every hour.</li>
 * <li>yyyy-MM-dd-HH-mm >> Roll over at the beginning of every minute.</li>
 * </ul>
 * </li>
 * <li>The Date format to be displayed in the log file name generated. For Example:
 * <ul>
 * <li>ddMMMyyyy - generates log file name with date stamp in the file name as 20MAR2010</li>
 * <li>yyyy-MM-dd - generates log file name with date stamp in the file name as 2010-03-20</li>
 * </ul>
 * </li>
 * </ul>
 * The default used is <b>yyyy-MM-dd</b></li>
 * <li><b>maxsizelimit</b>: This configuration decides on the maximum file size of a log file considering the rollover
 * period. For a period if the file size exceeds the set value a new file with same period would be generated with
 * rolling index incremented by one. The appender expects size value in "KB", "MB" or "GB". The default used is <b>10MB</b></li>
 * <li><b>suffixorprefix</b>: the appender expects the following 2 options
 * <ul>
 * <li>SUFFIX</li>
 * <li>PREFIX</li>
 * </ul>
 * This controls the manner in which the date gets included in the log file name. The default used is <b>PREFIX</b></li>
 * <li><b>patternseparator</b>:</li>
 * </ul>
 * 
 * Based on the configuration provided the appender the log file name will be created as either -
 * <ul>
 * <li>if the suffixOrPrefix option is 'PREFIX' -
 * {filename}{patternSeparator}{datePattern}{patternSeparator}{rollingIndex}.{extension}. Example file name is -
 * serverLogs-2010-03-26-01.log</li>
 * <li>if the suffixOrPrefix option is 'SUFFIX' -
 * {filename}.{extension}{patternSeparator}{datePattern}{patternSeparator}{rollingIndex}. Example file name is -
 * serverLogs.log-2010-03-26-01</li>
 * </ul>
 * 
 * @version 1.0
 */
public class LoggingConfigurationDescriptor extends PropertyBagConfigurationDescriptor
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 9189025383966079404L;

	/**
	 * The logger instance for this class
	 */
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(LoggingConfigurationDescriptor.class);

	private boolean loggingEnabled = true;
	private String logPath;
	private Properties logConfigurationProperties;
	private String ctLogOverrideFile = null;

	/**
	 * ref to LoggingConfigurationDescriptor
	 * 
	 * @param name The name of this descriptpr
	 */
	public LoggingConfigurationDescriptor(String name)
	{
		super(name);
	}

	/**
	 * ref to LogEnabled
	 * 
	 * @return the loggingEnabled
	 */
	public boolean isLoggingEnabled()
	{
		return loggingEnabled;
	}

	/**
	 * ref to LogPath
	 * 
	 * @return the logPath
	 */
	public String getLogPath()
	{
		return logPath;
	}

	/**
	 * ref to logConfigurationProperties
	 * 
	 * @return the logConfigurationProperties
	 */
	public Properties getLogConfigurationProperties()
	{
		return logConfigurationProperties;
	}

	/**
	 * ref to log4jOverrideFile
	 * 
	 * @return the log4jOverrideFile
	 */
	public String getCtlogOverrideFile()
	{
		return ctLogOverrideFile;
	}
	
	/**
	 * ref to LoadConfig
	 * 
	 * @param configSource
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.PropertyBagConfigurationDescriptor#loadConfiguration(java.lang.String)
	 */
	@Override
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the Logging configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}
		PropertyResourceBundle bundle = getRawConfigData();
		Properties configProps = new Properties();
		loggingEnabled = StringUtils
				.convertToBoolean(ResourceBundleUtils.getString(bundle, "LOGGING_ENABLED_IND", "Y"));
		logPath = getWorkFolderPath() + ResourceBundleUtils.getString(bundle, "log.path", "");
		ctLogOverrideFile = ResourceBundleUtils.getString(bundle, "CT_LOG4J_OVERRIDE_FILE", "canvas-framework-log4j.xml");
		configProps.put("log.path", logPath);
		String aConfigValue;
		String rootLogLevel;

		rootLogLevel = ResourceBundleUtils.getString(bundle, "log.level", "");
		rootLogLevel = StringUtils.isEmpty(rootLogLevel) ? "debug" : rootLogLevel.toLowerCase();
		configProps.put("log.level", rootLogLevel);
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.audit", "");
		configProps.put("log.level.audit", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.alert", "");
		configProps.put("log.level.alert", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.session", "");
		configProps.put("log.level.session", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.web", "");
		configProps.put("log.level.web", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.config", "");
		configProps.put("log.level.config", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.cache", "");
		configProps.put("log.level.cache", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.security", "");
		configProps.put("log.level.security", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.database", "");
		configProps.put("log.level.database", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.entitlement", "");
		configProps.put("log.level.entitlement", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.event", "");
		configProps.put("log.level.event", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.export", "");
		configProps.put("log.level.export", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.vdf", "");
		configProps.put("log.level.vdf", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.hal", "");
		configProps.put("log.level.hal", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.report", "");
		configProps.put("log.level.report", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.validator", "");
		configProps.put("log.level.validator", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "log.level.scheduler", "");
		configProps.put("log.level.scheduler", StringUtils.isEmpty(aConfigValue) ? rootLogLevel : aConfigValue
				.toLowerCase());

		aConfigValue = ResourceBundleUtils.getString(bundle, "rollovermodel", "");
		configProps.put("rollovermodel", StringUtils.isEmpty(aConfigValue) ? "BACKUPOLD" : aConfigValue.toUpperCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "datepattern", "");
		configProps.put("datepattern", StringUtils.isEmpty(aConfigValue) ? "yyyy-MM-dd" : aConfigValue);
		aConfigValue = ResourceBundleUtils.getString(bundle, "maxsizelimit", "");
		configProps.put("maxsizelimit", StringUtils.isEmpty(aConfigValue) ? "10MB" : aConfigValue);
		aConfigValue = ResourceBundleUtils.getString(bundle, "suffixorprefix", "");
		configProps.put("suffixorprefix", StringUtils.isEmpty(aConfigValue) ? "PREFIX" : aConfigValue.toUpperCase());
		aConfigValue = ResourceBundleUtils.getString(bundle, "patternseparator", "");
		configProps.put("patternseparator", StringUtils.isEmpty(aConfigValue) ? "-" : aConfigValue);

		logConfigurationProperties = configProps;
	}

	/**
	 * ref to ReloadConfig
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.PropertyBagConfigurationDescriptor#reloadConfiguration(java.lang.String)
	 */
	@Override
	public void reloadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		loadConfiguration(configSource, defaultDescriptor);
	}

	/**
	 * Here we validate the configuration to ensure that all provided information is valid
	 * 
	 * @return validstatus
	 */
	private boolean isValidConfiguration()
	{
		PerformanceTimer timer = new PerformanceTimer();
		boolean validationStatus = true;
		StringBuilder errorBuilder = new StringBuilder();
		timer.startTimer(getClass(), "isValidConfiguration");
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validator.validateIndicators("LOGGING_ENABLED_IND", bundle));
		errorBuilder.append(validator.validatePathConfig("log.path", bundle, getWorkFolderPath()));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level", bundle, true));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.audit", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.alert", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.session", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.web", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.config", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.cache", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.security", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.database", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.entitlement", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.event", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.export", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.vdf", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.hal", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.report", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.validator", bundle, false));
		errorBuilder.append(validator.validateLogLevelConfiguration("log.level.scheduler", bundle, false));
		errorBuilder.append(validator.validateListConfiguration("rollovermodel", bundle, false, new String[]
		{ "CREATENEW", "BACKUPOLD" }, true, "Rollover Model"));
		errorBuilder.append(validator.validateListConfiguration("suffixorprefix", bundle, false, new String[]
		{ "SUFFIX", "PREFIX" }, true, "Suffix or Prefix"));
		errorBuilder.append(validator.validateDateFormatPattern("datepattern", bundle, false));
		errorBuilder.append(validatePatternSeparator(bundle));
		errorBuilder.append(validateMaxSizeLimit(bundle));

		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTCOM00123");
		else
		{
			LOGGER.cterror("CTCOM00124", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}

	/**
	 * Validates the Pattern separator character
	 * 
	 * @param bundle
	 * @return String
	 */
	private String validatePatternSeparator(PropertyResourceBundle bundle)
	{
		String validationErrorMessage = "";

		String propValue = ResourceBundleUtils.getString(bundle, "patternseparator", "");
		boolean propExists = !StringUtils.isEmpty(propValue);
		if (propExists)
		{
			if (propValue.length() > 1)
			{
				validationErrorMessage = "The value '"
						+ propValue
						+ "' provided for 'patternseparator' cannot be more than 1 character. Please provide a valid value.";
			} else if (propValue.indexOf(":") != -1)
			{
				validationErrorMessage = "The value '"
						+ propValue
						+ "' provided for 'patternseparator' uses the restricted ':' character. Please provide a valid value.";
			}
		}

		return validationErrorMessage;
	}

	/**
	 * Validates the max size limit
	 * 
	 * @param bundle
	 * @return validmessage
	 */
	@SuppressWarnings("unused")
	private String validateMaxSizeLimit(PropertyResourceBundle bundle)
	{
		String validationErrorMessage = "";

		String propValue = ResourceBundleUtils.getString(bundle, "maxsizelimit", "");
		boolean propExists = !StringUtils.isEmpty(propValue);
		if (propExists)
		{
			if (!propValue.endsWith("KB") && !propValue.endsWith("MB") && !propValue.endsWith("GB"))
			{
				validationErrorMessage = "The value '"
						+ propValue
						+ "' provided for 'maxsizelimit' does not provide a valid size unit. Valid value are KB / MB / GB. Please provide a valid value.";
			} else
			{
				String numValue = propValue.substring(0, propValue.length() - 2);
				try
				{
					Double aDouble = Double.valueOf(numValue);
				} catch (NumberFormatException e)
				{
					validationErrorMessage += "The value '"
							+ propValue
							+ "' provided for 'maxsizelimit' is not a valid number (after ignoring size unit). Please provide a valid value.";
				}
			}
		}

		return validationErrorMessage;
	}
}
