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
package com.intellectdesign.canvas.report.vo;

import com.intellectdesign.canvas.report.datasource.IReportDataSource;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.factory.ReportDataSourceFactory;

/**
 * This class is the request VO object for report context. It is designed for simple VO, because it would be easier to
 * add/update the input parameters future.
 * 
 * @version 1.0
 */

public class ReportDataSourceVO
{

	private String dataSourceType;
	private String dataSourceKey;
	private String dsImplementationClass;

	/**
	 * @return the dataSourceType
	 */
	public String getDataSourceType()
	{
		return dataSourceType;
	}

	/**
	 * @param dataSourceType the dataSourceType to set
	 */
	public void setDataSourceType(String dataSourceType)
	{
		this.dataSourceType = dataSourceType;
	}

	/**
	 * @return the dataSourceKey
	 */
	public String getDataSourceKey()
	{
		return dataSourceKey;
	}

	/**
	 * @param dataSourceKey the dataSourceKey to set
	 */
	public void setDataSourceKey(String dataSourceKey)
	{
		this.dataSourceKey = dataSourceKey;
	}

	/**
	 * @return the dsImplementationClass
	 */
	public String getDsImplementationClass()
	{
		return dsImplementationClass;
	}

	/**
	 * @param dsImplementationClass the dsImplementationClass to set
	 */
	public void setDsImplementationClass(String dsImplementationClass)
	{
		this.dsImplementationClass = dsImplementationClass;
	}

	/**
	 * This method will return the instance of IReportDataSource.
	 * 
	 * @return IReportDataSource
	 * @throws ReportingException
	 */
	public final IReportDataSource getReportDataSourceImpl() throws ReportingException
	{
		IReportDataSource reportDataSourceHandler = null;
		if (dsImplementationClass != null)
		{
			ReportDataSourceFactory reportDataSourceFactory = ReportDataSourceFactory.getInstance();
			reportDataSourceHandler = reportDataSourceFactory.getDataSourceClass(dsImplementationClass);
			reportDataSourceHandler.setDataSourceKey(dataSourceKey);
			reportDataSourceHandler.setDataSourceType(dataSourceType);
		}
		return reportDataSourceHandler;

	}

}
