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
package com.intellectdesign.canvas.report.job;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * this class extends AsyncReportJob implements Job
 * 
 * @version 1.0
 */
public class QuartzReportJob extends AsyncReportJob implements Job
{
	/**
	 * Quartz requires a public empty constructor so that the scheduler can instantiate the class whenever it needs.
	 */
	public QuartzReportJob()
	{
	}

	/**
	 * The method gets executed by quartz everytime the trigger fires.
	 * 
	 * @param context > The context which contains the ReportRequest.
	 * 
	 */
	public void execute(JobExecutionContext context) throws JobExecutionException
	{

		LOGGER.ctinfo("CTREP00310");
		ReportRequest reportRequest = (ReportRequest) context.getJobDetail().getJobDataMap()
				.get(ReportConstants.REPORT_REQUEST);
		LOGGER.ctdebug("CTREP00311", reportRequest.getReportId());
		try
		{
			executeReport(reportRequest);
		} catch (ReportingException reportingException)
		{
			LOGGER.cterror("CTREP00312", reportingException);
		}

		LOGGER.ctinfo("CTREP00313");
	}

	// instantiating the logger object
	private static Logger LOGGER = Logger.getLogger(QuartzReportJob.class);
}