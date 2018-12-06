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
import com.intellectdesign.canvas.report.engine.IReportEngineAdaptor;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * The ReportEngineFactory class provides methods to get the instance of appropriate ReportEngineAdaptor. It is a
 * singleton class. To get the instance use ReportEngineAdaptorFactory.getInstance().
 * 
 * @version 1.0
 */

public final class ReportEngineAdaptorFactory
{
	/**
	 * This method provides the instance of the ReportEngineAdaptorFactory. Classes using this factory class must use
	 * this method to get an instance of the class.
	 * 
	 * @return ReportEngineAdaptorFactory
	 */
	public static ReportEngineAdaptorFactory getInstance()
	{
		if (instance == null)
		{
			synchronized (ReportEngineAdaptorFactory.class)
			{
				if (instance == null)
				{
					instance = new ReportEngineAdaptorFactory();
				}
			}
		}
		return instance;
	}

	/***
	 * This method returns the instance of the type IReportEngineAdaptor for the given class name.
	 * 
	 * @param reportEngineClassName - the report engine class name
	 * @return IReportEngineAdaptor
	 */
	public IReportEngineAdaptor getReportEngineAdaptor(String reportEngineClassName) throws ReportingException
	{
		logger.ctinfo("CTREP00177");
		IReportEngineAdaptor reportEngineAdaptor = null;
		try
		{
			reportEngineAdaptor = (IReportEngineAdaptor) Class.forName(reportEngineClassName).newInstance();
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTREP00171", instantiationException);
			throw new ReportingException(ReportConstants.ERR_CD_RE_ADAPTR_FACT_INT_EXCEP, instantiationException);

		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTREP00172", illegalAccessException);
			throw new ReportingException(ReportConstants.ERR_CD_RE_ADAPTR__FACT_ILLI_EXCEP, illegalAccessException);

		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTREP00173", classNotFoundException);
			throw new ReportingException(ReportConstants.ERR_CD_RE_ADAPTR__FACT_CLASS_NOT_FOUND_EXCEP,
					classNotFoundException);

		} catch (Exception exception)
		{
			logger.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_RE_ADAPTR__FACT_GENERIC_EXCEP, exception);

		}

		logger.ctinfo("CTREP00178");
		return reportEngineAdaptor;
	}

	/***
	 * Private constructor to make the class singleton.
	 */
	private ReportEngineAdaptorFactory()
	{
	}

	/**
	 * ReportEngineAdaptorFactory instance.
	 */
	private static ReportEngineAdaptorFactory instance = new ReportEngineAdaptorFactory();
	/**
	 * logger.
	 */
	private static Logger logger = Logger.getLogger(ReportEngineAdaptorFactory.class);
}
