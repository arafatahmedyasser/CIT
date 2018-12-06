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

package com.intellectdesign.canvas.report.datasource;

import java.util.List;

import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.vo.ReportRequest;

/**
 * this class is used to perform the operations like adding the filters and getting the data.
 * 
 * @version 1.0
 */
public interface IReportDataSource
{
	/**
	 * This api intends to get the data from data sources to generate the report. Data sources may be more than onc
	 * depending on the nature of the report request. This api basically fetch the data from the data sources, aggregate
	 * them and massage them.
	 * 
	 * @param reportRequest The ReportRequest object containing the report data.
	 * @return list of massage data.
	 * @throws ReportingException for any exception caught.
	 */
	public List getData(ReportRequest reportRequest, List entlCriteria) throws ReportingException;

	/**
	 * Api to set the filters of a report.
	 * 
	 * @param filterMap map data folding the filter data.
	 */
	public void addFilters(ReportRequest reportRequest, DatabaseRequest dbRequest);

	/**
	 * api to set additional filter to the report. Additional filter may be the criteria type to be passed in the
	 * entitlement filter. This is one example where this api can be used. Depending on the implementation addtional
	 * filter may differ if required.
	 * 
	 * @param reportRequest The ReportRequest object containing the report data.
	 * @param entCriteria the list of entitlement criteria data. eg List of account number if the entitlement criteria
	 *            is ACC_ENTL.
	 */
	public void addAdditionalFilters(ReportRequest reportRequest, List entCriteria, DatabaseRequest dbRequest);

	/***
	 * sets the data spurce type. It can be DB,Store procedure or the HAL based on the type of the report.
	 * 
	 * @param dataSourceType the string data source name to be set.
	 */
	public void setDataSourceType(String dataSourceType);

	/***
	 * sets the data source key name.It can be the data access map key for data source type DB, or the app id for the
	 * data source type HAL.
	 * 
	 * @param dataSourceKey the data source key to be set to the data source.
	 */
	public void setDataSourceKey(String dataSourceKey);

	/***
	 * returns the data spurce key of the data source.
	 * 
	 * @return data source key of type String.
	 */
	public String getDataSourceKey();

	/***
	 * returns the data source type of the data source.
	 * 
	 * @return data source type of type String.
	 */
	public String getDataSourceType();

}
