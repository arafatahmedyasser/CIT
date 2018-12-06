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
 */
package com.intellectdesign.canvas.report.scheduler;

import java.io.IOException;
import java.util.Properties;

import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.impl.StdSchedulerFactory;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.utils.ResourceLoaderUtils;

/**
 * The Scheduler Factory is used to get the Report scheduler.
 * 
 * @version 1.0
 */

public class ReportSchedulerFactory
{
	private static Logger LOGGER = Logger.getLogger(ReportSchedulerFactory.class);
	private static Scheduler scheduler;
	// The singleton instance
	private static final ReportSchedulerFactory _instance = new ReportSchedulerFactory();
	private boolean initialized = false;

	private ReportSchedulerFactory()
	{
		// Nothing to do here
	}

	/**
	 * Returns the singleton instance of this class
	 * 
	 * @return
	 */
	public static final ReportSchedulerFactory getInstance()
	{
		return _instance;
	}

	/**
	 * This method returns the Quartz scheduler created
	 * 
	 * @return
	 * @throws ReportingException
	 */
	public Scheduler getQuartzScheduler() throws ReportingException
	{
		if (!initialized)
			throw new ReportingException(ReportConstants.ERR_CD_SCHED_JOB,
					"The scheduler has not been initialized properly. Please check your configuration");
		return scheduler;
	}

	/**
	 * @return the initialized
	 */
	public boolean isInitialized()
	{
		return initialized;
	}

	/**
	 * @param initialized the initialized to set
	 */
	protected void setInitialized(boolean initialized)
	{
		this.initialized = initialized;
	}
	
	protected void shutdown()
	{
		setInitialized(false);
		if(null!=scheduler){
			try
			{
				scheduler.shutdown();
			} catch (SchedulerException ex)
			{
				LOGGER.cterror("CTREP00641", ex);
			}
		}
		scheduler = null;
	}

	/**
	 * This will be triggered as part of the configuration initialization sequence to prepare the scheduler
	 * 
	 * @throws ReportingException
	 */
	protected void initializeSceduler() throws ReportingException
	{
		//Reset the initialized status to false. If processing is successful, this will be set to true.
		setInitialized(false);
		LOGGER.ctinfo("CTREP00438");
		ConfigurationManager config = ConfigurationManager.getInstance();
		// String propsFile = in future if neede we will get the quartz file config from Information reporting config;
		String propsFile = "canvas_reporting_quartz.properties";

		try
		{
			Properties pr = new Properties();
			pr.load(ResourceLoaderUtils.loadResource(propsFile));
			pr.put("org.quartz.dataSource.CANVAS_REPORT_QUARTZ_DATASOUCE.jndiURL", config.getDBDescriptor()
					.getCtFWIBATISDS());
			pr.put("org.quartz.dataSource.CANVAS_REPORT_QUARTZ_DATASOUCE.java.naming.factory.initial", config
					.getInformationReportingDescriptor().getReportQueueInitialContextFactory());
			SchedulerFactory sf = new StdSchedulerFactory(pr);
			// Gets the Scheduler instance from the scheduler factory
			scheduler = sf.getScheduler();
			// Checks if the scheduler has been already started,if not starts it.
			if (!scheduler.isStarted())
			{
				LOGGER.ctinfo("CTREP00439");
				scheduler.start();

			} else
			{
				LOGGER.ctinfo("CTREP00440");
			}

		}

		catch (SchedulerException schedulerException)
		{
			LOGGER.cterror("CTREP00441", schedulerException);
			throw new ReportingException(ReportConstants.SCHED_ERROR_CODE_1, "Could not retreive scheduler instance",
					schedulerException);
		} catch (IOException IOe)
		{
			LOGGER.cterror("CTREP00442", IOe);
			throw new ReportingException(ReportConstants.SCHED_ERROR_CODE_1, "Could not retreive scheduler instance",
					IOe);
		} catch (Exception e)
		{
			LOGGER.cterror("CTREP00639", e);
			throw new ReportingException(ReportConstants.SCHED_ERROR_CODE_1, "Could not retreive scheduler instance", e);
		}
		setInitialized(true);
		LOGGER.ctinfo("CTREP00443");

	}
}
