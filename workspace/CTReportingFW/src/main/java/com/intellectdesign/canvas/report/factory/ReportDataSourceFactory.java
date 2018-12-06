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
import com.intellectdesign.canvas.report.datasource.IReportDataSource;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * Singleton class. Factory class that provides api to return the instance of the IReportDataSource type for the data
 * source class name specified.
 * 
 * @version 1.0
 */

public final class ReportDataSourceFactory
{
	/**
	 * static method to get the instance of the class ReportDataSourceClassFactory. Classes using this factory class
	 * must use this method to get an instance of the class ReportDataSourceFactory.
	 * 
	 * @return ReportDataSourceClassFactory
	 */
	public static ReportDataSourceFactory getInstance()
	{
		if (reportDatasourceInstance == null)
		{
			synchronized (ReportDataSourceFactory.class)
			{
				if (reportDatasourceInstance == null)
				{
					reportDatasourceInstance = new ReportDataSourceFactory();
				}
			}
		}
		return reportDatasourceInstance;
	}

	/***
	 * Api to return the instance of the type IReportDataSource for the data source class name passed as parameter.
	 * 
	 * @param dsClassName the implementation class name of the data source.
	 * @return IReportDataSource instance of the class of type IReportDataSource.
	 */
	public IReportDataSource getDataSourceClass(String dsClassName) throws ReportingException
	{
		logger.ctinfo("CTREP00175");
		IReportDataSource dsclass = null;
		try
		{
			dsclass = (IReportDataSource) Class.forName(dsClassName).newInstance();
		} catch (InstantiationException instantiationException)
		{
			logger.cterror("CTREP00171", instantiationException);
			throw new ReportingException(ReportConstants.ERR_CD_DS_FACT_INT_EXCEP, instantiationException);
		} catch (IllegalAccessException illegalAccessException)
		{
			logger.cterror("CTREP00172", illegalAccessException);
			throw new ReportingException(ReportConstants.ERR_CD_DS_FACT_ILLI_EXCEP, illegalAccessException);
		} catch (ClassNotFoundException classNotFoundException)
		{
			logger.cterror("CTREP00173", classNotFoundException);
			throw new ReportingException(ReportConstants.ERR_CD_DS_FACT_CLASS_NOT_FOUND_EXCEP, classNotFoundException);
		} catch (Exception exception)
		{
			logger.cterror("CTREP00057", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DS_FACT_GENERIC_EXCEP, exception);
		}

		logger.ctinfo("CTREP00176");
		return dsclass;
	}

	/***
	 * Private constructor to make the class singleton.
	 */
	private ReportDataSourceFactory()
	{

	}

	/**
	 * Private static variable of the type ReportDataSourceClassFactory. this is the actual instance of the class that
	 * will be returned by the getInstance() of this class.
	 */
	private static ReportDataSourceFactory reportDatasourceInstance = new ReportDataSourceFactory();
	/**
	 * Private logger instance.
	 */
	private static Logger logger = Logger.getLogger(ReportDataSourceFactory.class);
}
