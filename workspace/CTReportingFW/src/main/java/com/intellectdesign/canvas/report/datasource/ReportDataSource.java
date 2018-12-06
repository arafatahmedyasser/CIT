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
 * This is the parent data source abstract class of the all the data sources classes to be used in the reporting
 * framework. Data sources types can be DB, Store procedure or HAL. These data sources types should extend the
 * ReportDataSource class. This class provides abstract apis that has to be implmented by its implementation class. This
 * class provides implementations for the getter and the setters of all the properties of the Data source.
 * 
 * @version 1.0
 */

public abstract class ReportDataSource implements IReportDataSource
{

	/***
	 * This api expects to get the report data from a particular data source type. The data source type may be DB,store
	 * procedure, HAL etc. depending on the implementation.Framework has no control on what type of data source the
	 * report will be using, hence leaving the implementation to the specific data source class.
	 * 
	 * @param reportRequest the report request data.
	 * @param entlCriteria the list of the entitlment criteria. this can be a list of account numbers if the criteria
	 *            type is Account number, based on the implementation this will be changed.
	 * 
	 */
	public abstract List getData(ReportRequest reportRequest, List entlCriteria) throws ReportingException;

	/***
	 * This api expects to add the filter as specified in the report definition. Framework has not control on which type
	 * of data source the filter needs to be applied, hence leaving the implementation to the extending class of the
	 * specific data source classes.
	 * 
	 * @param reportRequest The ReportRequest object containing the report data.
	 */
	public abstract void addFilters(ReportRequest reportRequest, DatabaseRequest dbRequest);

	/***
	 * This api expects to add additonal filters to the report to be generated. One example of this filter is the filter
	 * to be added for account entitlement in the sql query of the Database data source.Depending on the nature of the
	 * data source referred, the additional filter may vary. Framework has no control on the nature of the datasource
	 * hence, leaving the implementation of this method to the extending classes of the specific data source class.
	 * 
	 * @param reportRequest The ReportRequest object containing the report data.
	 * @param entlCriteria the list of entitlement criteria values, eg list of account number for the entitlement type
	 *            ACC_ENTL.
	 * @param dbRequest
	 */
	public abstract void addAdditionalFilters(ReportRequest reportRequest, List entlCriteria, DatabaseRequest dbRequest);

	/**
	 * getter method for the variable dataSourceType.
	 * 
	 * @return the dataSourceType
	 */
	public String getDataSourceType()
	{
		return dataSourceType;
	}

	/**
	 * setter method for the varaible dataSourceType.
	 * 
	 * @param dataSourceType the dataSourceType to set
	 */
	public void setDataSourceType(String dataSourceType)
	{
		this.dataSourceType = dataSourceType;
	}

	/**
	 * getter method for variable dataSourceKey
	 * 
	 * @return the dataSourceKey
	 */
	public String getDataSourceKey()
	{
		return dataSourceKey;
	}

	/**
	 * setter method for the variable dataSourceKey.
	 * 
	 * @param dataSourceKey the dataSourceKey to set
	 */
	public void setDataSourceKey(String dataSourceKey)
	{
		this.dataSourceKey = dataSourceKey;
	}

	/**
	 * The private varaibles/ properties of the ReportDataSource class.
	 */
	private String dataSourceType = null;
	private String dataSourceKey = null;

}
