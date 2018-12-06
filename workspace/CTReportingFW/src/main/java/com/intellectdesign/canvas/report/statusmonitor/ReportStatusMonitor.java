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
package com.intellectdesign.canvas.report.statusmonitor;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * This class represents the report status monitoring module.Main intension of this class is to check whether the
 * processes of report executions like getting data from the Data sources by the data aggregator module, the generation
 * of report by the report engine etc. are taking moretime than the time out duration specified by the framework. If
 * time out scenerio occurs, the process is aborted and the process will be marked as failed.Monitoring the status time
 * out will be performed by the api provided inside this class.
 * 
 * @version 1.0
 * 
 */

public class ReportStatusMonitor
{

	/**
	 * API to monitor the time taken by the reporting framework modules to process tasks like retrieving data from the
	 * Data sources and generating reports by the report engine.Timeout timing will be specified in the
	 * ReportingFW.properties file.
	 * 
	 * @param callable instance of the Callable.
	 * @return Object Instance of the type Object.
	 */
	public Object executeTask(Callable callable) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00470");
		ExecutorService executor = Executors.newSingleThreadExecutor();
		Future<String> future = executor.submit(callable);
		Object returnValue = null;
		try
		{
			ConfigurationManager config = ConfigurationManager.getInstance();
			int statusTimeOut = config.getInformationReportingDescriptor().getReportStatusMonitorTimeOut();
			LOGGER.ctdebug("CTREP00471", statusTimeOut);
			returnValue = future.get(statusTimeOut, TimeUnit.SECONDS);

		} catch (TimeoutException ex)
		{
			LOGGER.cterror("CTREP00472", ex);
			future.cancel(true);
			throw new ReportingException(ReportConstants.ERR_CD_REP_STAT_MONTR_TIMEOUT, ex);
		} catch (InterruptedException ex)
		{
			LOGGER.cterror("CTREP00473", ex);
			throw new ReportingException(ReportConstants.ERR_CD_REP_TAT_MONTR_INTR, ex);
		} catch (ExecutionException ex)
		{
			LOGGER.cterror("CTREP00474", ex);
			throw new ReportingException(ReportConstants.ERR_CD_REP_TAT_MONTR_EXEC, ex);
		} catch (Exception ex)
		{
			LOGGER.cterror("CTREP00475", ex);
			throw new ReportingException(ReportConstants.ERR_CD_REP_TAT_MONTR_GEN, ex);
		} finally
		{
			LOGGER.ctdebug("CTREP00476");
			executor.shutdownNow();
		}
		LOGGER.ctinfo("CTREP00477");
		return returnValue;
	}

	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportStatusMonitor.class);
}
