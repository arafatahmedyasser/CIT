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
package com.intellectdesign.canvas.report.factory;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.dataaggregator.IReportDataAggregator;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * The ReportDataAggregatorFactory class provides methods to get the instance of appropriate ReportDataAggregator. It is
 * a singleton class. To get the instance use ReportDataAggregatorFactory.getInstance().
 * 
 * @version 1.0
 */

public final class ReportDataAggregatorFactory
{
	/**
	 * This method provides the instance of the ReportDataAggregatorFactory. Classes using this factory class must use
	 * this method to get an instance of the class.
	 * 
	 * @return ReportDataAggregatorFactory
	 */
	public static ReportDataAggregatorFactory getInstance()
	{
		if (instance == null)
		{
			synchronized (ReportDataAggregatorFactory.class)
			{
				if (instance == null)
				{
					instance = new ReportDataAggregatorFactory();
				}
			}
		}
		return instance;
	}

	/***
	 * This method returns the instance of the type IReportDataAggregator for the given class name.
	 * 
	 * @param reportDataAggregatorClassName - the report aggregator class name
	 * @return IReportDataAggregator
	 */
	public IReportDataAggregator getReportDataAggregator(String reportDataAggregatorClassName)
			throws ReportingException
	{

		logger.ctinfo("CTREP00170");
		IReportDataAggregator ReportDataAggregator = null;
		try
		{
			ReportDataAggregator = (IReportDataAggregator) Class.forName(reportDataAggregatorClassName).newInstance();
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTREP00171", instantiationException);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGG_FACT_INT_EXCEP, instantiationException);
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTREP00172", illegalAccessException);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGG_FACT_ILLI_EXCEP, illegalAccessException);
		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTREP00173", classNotFoundException);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGG_FACT_CLASS_NOT_FOUND_EXCEP,
					classNotFoundException);
		} catch (Exception exception)
		{
			logger.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DATA_AGG_FACT_GENERIC_EXCEP, exception);
		}

		logger.ctinfo("CTREP00174");
		return ReportDataAggregator;
	}

	/***
	 * Private constructor to make the class singleton.
	 */
	private ReportDataAggregatorFactory()
	{
	}

	/**
	 * ReportDataAggregatorFactory instance.
	 */
	private static ReportDataAggregatorFactory instance = new ReportDataAggregatorFactory();
	/**
	 * logger.
	 */
	private static Logger logger = Logger.getLogger(ReportDataAggregatorFactory.class);
}
