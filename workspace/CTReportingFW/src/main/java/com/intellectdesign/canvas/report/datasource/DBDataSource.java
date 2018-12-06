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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.viewdefinition.ColumnFilter;
import com.intellectdesign.canvas.viewdefinition.SortDefinition;
import com.intellectdesign.canvas.viewdefinition.SortPositionComparator;
import com.intellectdesign.canvas.viewdefinition.ViewDefinitionConstants;

/**
 * Data source Abstract class representing the data source type of "Database". Provides Database specific implementation
 * to get report data from the db data sources. Also provides, abstract methods which the extending classes need to
 * implement.
 * 
 * @version 1.0
 */

public abstract class DBDataSource extends ReportDataSource
{
	/***
	 * Data source type: "Database" specific implementation method to get the data from a data sources.
	 * 
	 * @param reportRequest Instance of the ReportRequest.
	 * @param entlCriteria : the map that contains the entitlement criteria.
	 * @return List of data.
	 */
	public List getData(ReportRequest reportRequest, List entlCriteria) throws ReportingException
	{
		logger.ctinfo("CTREP00088");
		ArrayList reportData = null;
		DatabaseRequest dbRequest = new DatabaseRequest();
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("DBDataSource.getData");
		try
		{
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(getDataSourceKey());
			addFilters(reportRequest, dbRequest);
			addRuntimeFilters(reportRequest, dbRequest);
			addRuntimeSortFields(reportRequest, dbRequest);
			addAdditionalFilters(reportRequest, entlCriteria, dbRequest);
			dbResult = dbRequest.execute();
			reportData = (ArrayList) dbResult.getReturnedList();
		} catch (DatabaseException dbExp)
		{
			logger.cterror("CTREP00089", dbExp);
			throw new ReportingException(ReportConstants.ERR_CD_DB_DS_GETDATA, dbExp);
		}
		performanceTimer.endTimer();
		logger.ctdebug("CTREP00090", reportData);
		logger.ctinfo("CTREP00091");
		return reportData;
	}

	/***
	 * Helper method to set the sorting fields in the database request object.
	 * 
	 * @param reportRequest The instance of the ReportRequest class.
	 * @param dbRequest The instance of the database request.
	 * @throws ReportingException for any exception thrown while trying to set the sorting filter.
	 */
	private void addRuntimeSortFields(ReportRequest reportRequest, DatabaseRequest dbRequest) throws ReportingException
	{
		logger.ctinfo("CTREP00092");
		ArrayList sortColList = null;
		try
		{
			sortColList = (ArrayList) reportRequest.getReportContext().getReportInstanceDefinition().getSortByColumns();
			ArrayList runtimeSortFilters = getRuntimeSortFields(sortColList);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_SORTFIELDS, runtimeSortFilters);
		}

		catch (ReportingException rexp)
		{
			logger.cterror("CTREP00093", rexp);
			throw rexp;
		} catch (Exception exception)
		{
			logger.cterror("CTREP00094", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DB_DS_ADD_RUNTIME_SORTS, exception);
		}
		logger.ctinfo("CTREP00095");
	}

	/**
	 * Helper method to set the sorting parameters to the SortDefinition object.
	 * 
	 * @param listColumns List of sorting columns
	 * @return a list of the type sortDefinition.
	 */
	private ArrayList getRuntimeSortFields(ArrayList listColumns) throws ReportingException
	{
		ArrayList listSortDefinitions = new ArrayList();
		try
		{
			Iterator itr = listColumns.iterator();
			while (itr.hasNext())
			{
				{
					ReportColumnDefinition repColumnDef = (ReportColumnDefinition) itr.next();
					if (repColumnDef.isSortableInd())
					{
						SortDefinition sortDefinition = new SortDefinition();
						sortDefinition.setColumnID(repColumnDef.getColumnId());
						sortDefinition.setSortOrder(repColumnDef.getSortOrder());
						sortDefinition.setSortPosition(repColumnDef.getSortPosition());
						listSortDefinitions.add(sortDefinition);
					}
				}
			}
			logger.ctdebug("CTREP00096 ", listSortDefinitions);
			Collections.sort(listSortDefinitions, new SortPositionComparator());

			logger.ctdebug("CTREP00097", listSortDefinitions);
		} catch (Exception exception)
		{
			logger.cterror("CTREP00098", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DB_DS_SET_RUNTIME_SORTS, exception);
		}
		return listSortDefinitions;
	}

	/***
	 * Helper method to set the runtime filters in the DatabseRequset object.
	 * 
	 * @param reportRequest
	 * @param dbRequest
	 */
	private void addRuntimeFilters(ReportRequest reportRequest, DatabaseRequest dbRequest) throws ReportingException
	{
		logger.ctinfo("CTREP00099");
		ArrayList filterList = null;
		try
		{
			filterList = (ArrayList) reportRequest.getReportContext().getReportInstanceDefinition()
					.getListOfReportInstFiltersAsMap();
			ArrayList runtimeFilters = getRuntimeFilters(filterList);
			dbRequest.addFilter(ViewDefinitionConstants.FLD_FILTERS, runtimeFilters);
		}

		catch (ReportingException rexp)
		{
			logger.cterror("CTREP00100", rexp);
			throw rexp;
		} catch (Exception exception)
		{
			logger.cterror("CTREP00101", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DB_DS_ADD_RUNTIME_FILTERS, exception);
		}
		logger.ctinfo("CTREP00102");
	}

	/***
	 * Helper method to get the runtime filters.
	 * 
	 * @param filterList List of filter.
	 * @return List of runtimefilters of the type ColumnFilter.
	 */
	private ArrayList getRuntimeFilters(ArrayList filterList) throws ReportingException
	{
		logger.ctinfo("CTREP00103");
		ArrayList runtimeFilters = new ArrayList();
		Iterator itr = filterList.iterator();
		HashMap filerMap = null;
		try
		{
			while (itr.hasNext())
			{
				filerMap = (HashMap) itr.next();

				ColumnFilter aFilter = new ColumnFilter();

				aFilter.setDataType((String) filerMap.get(ReportConstants.FILTER_DATA_TYPE));
				aFilter.setStrFilterValues((String) filerMap.get(ReportConstants.FILTER_VALUES));
				aFilter.setFilterType((String) filerMap.get(ReportConstants.FILTER_NAME));
				aFilter.setColumnID((String) filerMap.get(ReportConstants.COLUMN_ID));
				runtimeFilters.add(aFilter);
			}
		} catch (Exception exception)
		{
			logger.cterror("CTREP00104", exception);
			throw new ReportingException(ReportConstants.ERR_CD_DB_DS_GET_RUNTIME_FILTERS, exception);
		}
		logger.ctinfo("CTREP00105");
		return runtimeFilters;
	}

	/***
	 * This api expects to add the filter as specified in the report definition. DBDataSource has no control on what
	 * filters needs to be set, hence leaving the implementation to the extending sub classes.
	 * 
	 * @param reportRequest The ReportRequest object containing the report data.
	 */
	public abstract void addFilters(ReportRequest reportRequest, DatabaseRequest dbRequest);

	/***
	 * This api expects to add additonal filters to the report to be generated. One example of this filter is the filter
	 * to be added for account entitlement in the sql query of the Database data source.Depending on the nature of the
	 * data source referrec, the additional filter may vary. DBDataSource has no control on the nature of the additional
	 * filters to be set hence, leaving the implementation of this method to the extending sub classes.
	 * 
	 * @param reportRequest The ReportRequest object containing the report data.
	 * @param entlCriteria the list of entitlement criteria values, eg list of account number for the entitlement type
	 *            ACC_ENTL.
	 */
	public abstract void addAdditionalFilters(ReportRequest reportRequest, List entCriteria, DatabaseRequest dbRequest);

	// instatiating logger object
	private Logger logger = Logger.getLogger(DBDataSource.class);

}
