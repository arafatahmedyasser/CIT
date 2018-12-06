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
package com.intellectdesign.canvas.report.scheduler;

import javax.servlet.ServletContext;

import com.intellectdesign.canvas.config.ConfigurationException;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.IConfigurationChangeListener;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.utils.StringUtils;

/**
 * 
 * @Version 1.0
 */
public class SchedulingConfigChangeListener implements IConfigurationChangeListener
{
	private static final Logger LOGGER = Logger.getLogger(SchedulingConfigChangeListener.class);

	/**
	 * The constructor expected for the change listener.
	 * 
	 * @param context
	 */
	public SchedulingConfigChangeListener(ServletContext context)
	{
		// Nothing to do here
	}

	/**
	 * Invoked when the configuration is initialized for the first time
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationInitialized()
	 */
	@Override
	public void configurationInitialized()
	{
		ConfigurationManager config = ConfigurationManager.getInstance();

		if (!StringUtils.isEmpty(config.getDefault().getString(ConfigurationManager.CONFIG_KEY_CT_INFO_REPORT_BUNDLE)))
		{
			try
			{
				ReportSchedulerFactory.getInstance().initializeSceduler();

			} catch (ReportingException ex)
			{
				LOGGER.cterror("CTREP00640", ex);
				ReportSchedulerFactory.getInstance().setInitialized(false);
				throw new ConfigurationException("CTREP00640",
						"Caught error while trying to initialize the Reports Scheduler", ex);
			}
		}
	}

	/**
	 * Invoked when the configuration has been changed subsequently
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#configurationReinitialized()
	 */
	@Override
	public void configurationReinitialized()
	{
		// Shutdown the current scheduler, if running
		ReportSchedulerFactory.getInstance().shutdown();
		// Restart the same.
		configurationInitialized();
	}

	/**
	 * This is invoked when the application is stopped or shutdown
	 * 
	 * @see com.intellectdesign.canvas.config.IConfigurationChangeListener#shutDown()
	 */
	@Override
	public void shutDown()
	{
		ReportSchedulerFactory.getInstance().shutdown();
	}

}
