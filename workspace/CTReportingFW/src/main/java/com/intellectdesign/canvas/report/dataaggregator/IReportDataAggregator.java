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
package com.intellectdesign.canvas.report.dataaggregator;

import java.util.List;

import com.intellectdesign.canvas.report.datasource.IReportDataSource;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * Interfac for the Report data aggregator. This interface provides apis to : 1.get the report data from the data
 * source. 2. aggregate the report data from multiple data sources. This applys only when the report data is retreved
 * from multiple data sources. 3. massage the aggregated report data. 4. formats the aggregated report data into the
 * format as per the user preference. This applys for data with type date, amount etc. It also performs the currency
 * conversion from a source currency type to an enquivalent currency.
 * 
 * @version 1.0
 */

public interface IReportDataAggregator
{
	/***
	 * This api expects to retrieve the data to be used by the report engine from data source.Data sources can be more
	 * than one based on the nature of the report.
	 * 
	 * @param reportRequest object of the class ReportRequest which contains the related data for the request to be
	 *            generated.
	 * @return List of massaged data.
	 * @throws ReportingException for any exception caught.
	 */
	public List getData(ReportRequest reportRequest) throws ReportingException;

	/***
	 * This api expects to aggregate the report data from multiple data sources into a List. This must be used only when
	 * the report data is referred to multiple data sources.
	 * 
	 * @param aggregatedDataItems Map of aggregated report data, having the Datasouce type as key and the data as the
	 *            value.
	 * @param dataSource instance of the data source from where the data was retrieved.
	 * @param dataItems the data item to be added into the Map of aggregated data.
	 */
	public void aggregateData(List aggregatedDataItems, IReportDataSource dataSource, List dataItems);

	/***
	 * This api expects to massage the data in a manner the developer wants to display the data in the user. This must
	 * be the last action to be perform inside the report aggregator class. The implementation of this method must be
	 * provided by the final concrete class.
	 * 
	 * @param aggregatedDataItems represents the Map data that contains the aggregated data to be massage.
	 * @param reportRequest represents the ReportRequest object that contains data related to the report to be
	 *            genarated.
	 * @return List of massage report data.
	 * @throws ReportingException for any exception caught.
	 */
	public List massageData(List aggregatedDataItems, ReportRequest reportRequest) throws ReportingException;

	/***
	 * This api expects to perform the formatting of date and amount formats based on the user preference available for
	 * the user logged in. This also expects to perform the currency conversion for a given source amount with a source
	 * currency into an equivalent currency. This must be executed before the data is massaged.
	 * 
	 * @param aggregatedDataItems represents the aggregated Map data from which the dates,amounts types are to be
	 *            fromatted.
	 * @return List of formatted data.
	 * @throws ReportingException
	 */
	/* public List formatAggregatedData(Map aggregatedDataItems) throws ReportingException; */

}
