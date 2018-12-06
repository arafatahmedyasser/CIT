/**
 * Copyright 2015. Polaris Financial Technology Limited. All rights reserved. 
 * 
 * These materials are confidential and proprietary to Polaris Financial Technology 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Polaris Financial Technology Limited.
 * 
 */
package com.intellectdesign.canvas.config;

import java.util.PropertyResourceBundle;

import com.intellectdesign.canvas.logger.CanvasConfigurationLogger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.utils.PropertyValidations;
import com.intellectdesign.canvas.utils.ResourceBundleUtils;

/**
 * 
 * @Version 1.0
 */
public class InformationReportingDescriptor extends PropertyBagConfigurationDescriptor
{

	private static final long serialVersionUID = 5942368379769666566L;
	private String senderEmailId;
	private int reportInstanceFetchInterval = 1;
	private String reportQueueInitialContextFactory;
	private String reportQueueJNDI_URL;
	private String schedulerGroupname;
	private String schedulerTriggerGroupname;
	private String reportArchievedpath;
	private String reportJmsConnectionFactory;
	private String reportJmsAsycQueue;
	private String reportJmsSycQueue;
	private int reportStatusMonitorTimeOut = 60;
	private static final CanvasConfigurationLogger LOGGER = new CanvasConfigurationLogger(
			InformationReportingDescriptor.class);

	/**
	 * @param refernce to InformationReportingDescriptor
	 */
	public InformationReportingDescriptor(String name)
	{
		super(name);
	}

	/**
	 * @return the senderEmailId
	 */
	public String getSenderEmailId()
	{
		return senderEmailId;
	}

	/**
	 * @return the reportInstanceFetchInterval
	 */
	public int getReportInstanceFetchInterval()
	{
		return reportInstanceFetchInterval;
	}

	/**
	 * @return the reportQueueFactory
	 */
	public String getReportQueueInitialContextFactory()
	{
		return reportQueueInitialContextFactory;
	}

	/**
	 * @return the reportQueueJNDI_URL
	 */
	public String getReportQueueJNDI_URL()
	{
		return reportQueueJNDI_URL;
	}

	/**
	 * @return the schedulerGroupname
	 */
	public String getSchedulerGroupname()
	{
		return schedulerGroupname;
	}

	/**
	 * @return the schedulerTriggerGroupname
	 */
	public String getSchedulerTriggerGroupname()
	{
		return schedulerTriggerGroupname;
	}

	/**
	 * @return the reportArchievedpath
	 */
	public String getReportArchievedPath()
	{
		return reportArchievedpath;
	}

	/**
	 * @return the reportJmsConnectionFactory
	 */
	public String getReportJmsConnectionFactory()
	{
		return reportJmsConnectionFactory;
	}

	/**
	 * @return the reportJmsAsycQueue
	 */
	public String getReportJmsAsycQueue()
	{
		return reportJmsAsycQueue;
	}

	/**
	 * @return the reportJmsSycQueue
	 */
	public String getReportJmsSycQueue()
	{
		return reportJmsSycQueue;
	}

	/**
	 * @return the reportStatusMonitorTimeOut
	 */
	public int getReportStatusMonitorTimeOut()
	{
		return reportStatusMonitorTimeOut;
	}

	/**
	 * The following method loads the configuration file.
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 */
	public void loadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{

		super.loadConfiguration(configSource, defaultDescriptor);

		if (!isValidConfiguration())
		{
			throw new ConfigurationException("CONFIG_ERR",
					"Issues were found as part of the Information Reporting configuration information (resource bundle : "
							+ configSource + "). Please refer to the Logs for more details");
		}

		PropertyResourceBundle bundle = getRawConfigData();
		senderEmailId = ResourceBundleUtils.getString(bundle, "REPORT_SENDER_MAIL_ID", "");
		reportInstanceFetchInterval = Integer.parseInt(ResourceBundleUtils.getString(bundle,
				"REPORT_INST_DEF_FETCH_INTERVEL", "1"));
		reportQueueInitialContextFactory = ResourceBundleUtils.getString(bundle,
				"REPORT_QUEUE_INITIAL_CONTEXT_FACTORY", "");
		reportJmsConnectionFactory = ResourceBundleUtils.getString(bundle, "REPORT_JMS_CONNECTION_FACTORY", "");
		reportQueueJNDI_URL = ResourceBundleUtils.getString(bundle, "REPORT_QUEUE_JNDI_URL", "");
		schedulerGroupname = ResourceBundleUtils.getString(bundle, "REPORT_GROUP_NAME", "canvas_reporting_group");
		schedulerTriggerGroupname = ResourceBundleUtils.getString(bundle, "REPORT_TRIGGER_GROUP_NAME",
				"canvas_reporting_trigger");
		reportJmsAsycQueue = ResourceBundleUtils.getString(bundle, "REPORT_JMS_ASYNC_QUEUE", "");
		reportJmsSycQueue = ResourceBundleUtils.getString(bundle, "REPORT_JMS_SYNC_QUEUE", "");
		reportStatusMonitorTimeOut = Integer.parseInt(ResourceBundleUtils.getString(bundle,
				"REPORT_STATUS_MONITOR_TIME_OUT", "60"));
		reportArchievedpath = getWorkCentralizedFolderPath()
				+ ResourceBundleUtils.getString(bundle, "REPORT_ARCHIEVED_PATH", "");

	}

	/**
	 * ref to ReloadConfig
	 * 
	 * @param configSource
	 * @param defaultDescriptor
	 * @throws ConfigurationException
	 * @see com.intellectdesign.canvas.config.IConfigurationDescriptor#reloadConfiguration(java.lang.String)
	 */
	@Override
	public void reloadConfiguration(String configSource, IConfigurationDescriptor defaultDescriptor)
			throws ConfigurationException
	{
		loadConfiguration(configSource, defaultDescriptor);
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
		LOGGER.ctdebug("CTREP00635");
		timer.startTimer(getClass(), "isValidateConfiguration");
		PropertyResourceBundle bundle = getRawConfigData();
		PropertyValidations validator = new PropertyValidations();

		errorBuilder.append(validator.validateExistence("REPORT_SENDER_MAIL_ID", bundle));
		errorBuilder.append(validator.validateNumbers("REPORT_INST_DEF_FETCH_INTERVEL", bundle));
		errorBuilder.append(validator.validateNumbers("REPORT_STATUS_MONITOR_TIME_OUT", bundle));
		errorBuilder.append(validator.validateExistence("REPORT_QUEUE_INITIAL_CONTEXT_FACTORY", bundle));
		errorBuilder.append(validator.validateExistence("REPORT_JMS_CONNECTION_FACTORY", bundle));
		errorBuilder.append(validator.validateExistence("REPORT_QUEUE_JNDI_URL", bundle));
		errorBuilder.append(validator.validateExistence("REPORT_GROUP_NAME", bundle));
		errorBuilder.append(validator.validateExistence("REPORT_TRIGGER_GROUP_NAME", bundle));
		errorBuilder.append(validator.validateExistence("REPORT_JMS_ASYNC_QUEUE", bundle));
		errorBuilder.append(validator.validateExistence("REPORT_JMS_SYNC_QUEUE", bundle));
		errorBuilder.append(validator.validatePathConfig("REPORT_ARCHIEVED_PATH", bundle,
				getWorkCentralizedFolderPath()));
		validationStatus = errorBuilder.length() == 0;

		if (validationStatus)
			LOGGER.ctdebug("CTREP00636");
		else
		{
			LOGGER.cterror("CTREP00637", errorBuilder.toString());
		}
		timer.endTimer();
		return validationStatus;
	}

}
