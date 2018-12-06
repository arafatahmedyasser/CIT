/**
 * Copyright 2014. Intellect Design Arena Limited. All rights reserved.  
 * These materials are confidential and proprietary to Intellect Design Arena 
 * Limited and no part of these materials should be reproduced, published, transmitted
 * or distributed in any form or by any means, electronic, mechanical, photocopying, 
 * recording or otherwise, or stored in any information storage or retrieval system 
 * of any nature nor should the materials be disclosed to third parties or used in any 
 * other manner for which this is not authorized, without the prior express written 
 * authorization of Intellect Design Arena Limited.
 * 
 */
package com.intellectdesign.canvas.report.dataaggregator;

import java.util.ArrayList;
import java.util.List;

import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.datasource.IReportDataSource;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * Default implementation of the ReportDataAggregator class.
 * 
 * @version 1.0
 */

public class SimpleReportDataAggregator extends ReportDataAggregator
{

	/***
	 * Default implementation of the aggregateData(). This will simply add the column data into the Aggregated Map data.
	 * 
	 * @param aggregatedDataItems represents the Map data on which the data from different sources are to be added.
	 * @param dataSource represents the data source from which the data has been retrieved.
	 * @param dataItems represents the data to be added into the aggregated map.
	 */
	public void aggregateData(List aggregatedDataItems, IReportDataSource dataSource, List dataItems)
	{
		logger.ctinfo("CTREP00081");
		logger.ctdebug("CTREP00082");
		try
		{
			aggregatedDataItems.add(dataItems);
		} catch (Exception exception)
		{
			logger.cterror("CTREP00083", exception);
		}
		logger.ctinfo("CTREP00084");
	}

	/***
	 * Default implementation of the massageData(). It simply returns the aggregated data passed as parameter as it is.
	 * 
	 * @param aggregatedDataItems represents the data to be massage.
	 * @param reportRequest represents the request object for the report.
	 */
	public List massageData(List aggregatedDataItems, ReportRequest reportRequest)
	{
		logger.ctinfo("CTREP00085");
		List massageData = new ArrayList();
		logger.ctdebug("CTREP00086");
		massageData.add(aggregatedDataItems);
		logger.ctinfo("CTREP00087");
		return massageData;
	}

	// instatiating logger object
	private Logger logger = Logger.getLogger(SimpleReportDataAggregator.class);
}
