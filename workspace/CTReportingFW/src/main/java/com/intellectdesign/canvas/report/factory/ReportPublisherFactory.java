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
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.publisher.IReportPublisher;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * The ReportPublisherFactory class provides methods to get the instance of appropriate ReportPublisher. It is a
 * singleton class. To get the instance use ReportPublisherFactory.getInstance().
 * 
 * 
 * @version 1.0
 * 
 */

public class ReportPublisherFactory
{
	/**
	 * This method provides the instance of the ReportPublisherFactory. Classes using this factory class must use this
	 * method to get an instance of the class.
	 * 
	 * @return ReportPublisherFactory
	 */
	public static ReportPublisherFactory getInstance()
	{
		if (instance == null)
		{
			synchronized (ReportPublisherFactory.class)
			{
				if (instance == null)
				{
					instance = new ReportPublisherFactory();
				}
			}
		}
		return instance;
	}

	/***
	 * This method returns the instance of the type IReportPublisher for the given class name.
	 * 
	 * @param reportPublisherClassName - the report publisher class name
	 * @return IReportPublisher
	 */
	public IReportPublisher getReportPublisher(String reportPublisherClassName) throws ReportingException
	{

		logger.ctinfo("CTREP00181");
		IReportPublisher reportPublisher = null;
		try
		{
			reportPublisher = (IReportPublisher) Class.forName(reportPublisherClassName).newInstance();
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTREP00171", instantiationException);
			throw new ReportingException(ReportConstants.ERR_CD_REP_PUBLSHR_FACT_INST_EXEC, instantiationException);

		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTREP00172", illegalAccessException);
			throw new ReportingException(ReportConstants.ERR_CD_REP_PUBLSHR_FACT_ILLI_EXCEP, illegalAccessException);

		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTREP00173", classNotFoundException);
			throw new ReportingException(ReportConstants.ERR_CD_REP_PUBLSHR_FACT_CLASS_NOT_FOUND_EXCEP,
					classNotFoundException);

		} catch (Exception exception)
		{
			logger.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_REP_PUBLSHR_FACT_GENERIC_EXCEP, exception);

		}

		logger.ctinfo("CTREP00182");
		return reportPublisher;
	}

	/***
	 * Private constructor to make the class singleton.
	 */
	private ReportPublisherFactory()
	{
	}

	/**
	 * ReportEngineFactory instance.
	 */
	private static ReportPublisherFactory instance = new ReportPublisherFactory();
	/**
	 * logger object
	 */
	private static Logger logger = Logger.getLogger(ReportPublisherFactory.class);
}
