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

package com.intellectdesign.canvas.report.instr;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.database.CanvasDatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseConstants;
import com.intellectdesign.canvas.database.DatabaseException;
import com.intellectdesign.canvas.database.DatabaseRequest;
import com.intellectdesign.canvas.database.DatabaseResult;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.logging.PerformanceTimer;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportStatus;
import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;
import com.intellectdesign.canvas.report.vo.ReportContext;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportInstanceDefinition;

/**
 * This class represents the Data access object layer for the reporting framework.
 * 
 * @version 1.0
 */

public class ReportInstruction
{

	/**
	 * Gets the report definition for the corresponding report Id.
	 * 
	 * @param reportId
	 * @return ReportDefinition
	 * @throws ReportingException
	 */
	public ReportDefinition getReportDefinition(String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00208");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		List dataList = null;
		DatabaseResult dbResult = null;
		ReportDefinition reportDefinition = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.getReportDefinition");
		try
		{
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_DEFINITION);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportId);
			dbResult = dbRequest.execute();
			dataList = dbResult.getReturnedList();
			if (dataList != null && !dataList.isEmpty())
			{
				reportDefinition = (ReportDefinition) dataList.get(0);
			}
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00210", dbException, reportId);
			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_DEF, dbException);
		}
		LOGGER.ctinfo("CTREP00209");
		return reportDefinition;
	}

	/**
	 * Stores the Report definition Instance information for the corresponding Report Definition Instance.
	 * 
	 * @param rid
	 * @throws ReportingException
	 */
	public void createReportInstanceDefinition(ReportInstanceDefinition rid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00211");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.getReportDefinition");
		try
		{
			Map parametersMap = rid.getReportInstDefinitionAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_INSTANCE_DEFINITION);
			dbRequest.setData(parametersMap);
			dbResult = dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00212", dbException, rid.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_INST, dbException);
		}
		if (dbResult != null)
		{
			insertReportInstColumnDefinitions(rid);
			insertReportInstFilters(rid);
			insertReportInstPublisherMap(rid);
			insertReportInstNotifierMap(rid);

		}

		LOGGER.ctinfo("CTREP00213");
	}

	/**
	 * Stores the Column definitions for the ReportInstanceDefinition.
	 * 
	 * @param rid
	 * @throws ReportingException
	 */
	private void insertReportInstColumnDefinitions(ReportInstanceDefinition rid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00214");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.insertReportInstColumnDefinitions");
		try
		{
			List colsList = rid.getListOfReportDefColAsMap();

			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_INSTANCE_COLUMN_DEFINTITION);
			dbRequest.setBatchData(colsList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00216", dbException, rid.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_INST_COLS, dbException);
		}
		LOGGER.ctinfo("CTREP00215");
	}

	/**
	 * Stores the Filter definitions for the ReportInstanceDefinition.
	 * 
	 * @param rid
	 * @throws ReportingException
	 */
	private void insertReportInstFilters(ReportInstanceDefinition rid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00217");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.insertReportInstFilters");
		try
		{
			List filtersList = rid.getListOfReportInstFiltersAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_INSTANCE_FILTER_DEFINITION);
			dbRequest.setBatchData(filtersList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00219", dbException, rid.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_INST_FLR, dbException);
		}

		LOGGER.ctinfo("CTREP00218");

	}

	/**
	 * Stores the Publisher definitions for the ReportInstanceDefinition in the REPORT_INST_PUBLISHER_MAPPING initially
	 * and then in the REPORT_PUBLISHER_MASTER table.
	 * 
	 * @param rid
	 * @throws ReportingException
	 */
	private void insertReportInstPublisherMap(ReportInstanceDefinition rid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00220");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.insertReportInstPublisherMap");
		try
		{
			List publisherList = rid.getListOfReportInstPublishersAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_INSTANCE_PUBLISHER_MAP);
			dbRequest.setBatchData(publisherList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00222", dbException, rid.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_INST_PBH, dbException);
		}
		LOGGER.ctinfo("CTREP00221");
	}

	/**
	 * Stores the Notifier definitions for the ReportInstanceDefinition in the REPORT_INST_NOTIFICATION_MAP initially
	 * and then in the REPORT_NOTIFICATION_MASTER table.
	 * 
	 * @param rid
	 * @throws ReportingException
	 */
	private void insertReportInstNotifierMap(ReportInstanceDefinition rid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00223");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.insertReportInstNotifierMap");
		try
		{

			List notifiersList = rid.getListOfReportInstNotifiersAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_INSTANCE_NOTIFIER_MAP);
			dbRequest.setBatchData(notifiersList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00225", dbException, rid.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_INST_NOTFR, dbException);
		}

		LOGGER.ctinfo("CTREP00224");
	}

	/**
	 * This method fetch the generated report instance's properties like with its columns definition, column-filters,
	 * publisher, notification details from database for given REPORT_INSTANCE_ID and given in the form of
	 * ReportInstanceDefinition Object.
	 * 
	 * @param reportInstanceId denotes instance id of which ReportInstanceDefinition Object we need to get as output.
	 * @return ReportInstanceDefinition Object.
	 * @throws ReportingException
	 */
	public ReportInstanceDefinition getReportInstanceDefinition(String reportInstanceId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00226");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		List dataList = null;
		DatabaseResult dbResult = null;
		ReportInstanceDefinition rid = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.getReportInstanceDefinition");
		try
		{
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ReportConstants.OPR_EXT_FETCH_INSTANCE_DEFINITION);
			dbRequest.addFilter(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
			dbResult = dbRequest.execute();
			dataList = dbResult.getReturnedList();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00228", dbException, reportInstanceId);
			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_INST, dbException);
		}

		rid = (ReportInstanceDefinition) dataList.get(0);
		LOGGER.ctinfo("CTREP00227");
		return rid;

	}

	/**
	 * This method fetch the list of format from the database to load in the format combo box of report definition
	 * 
	 * @return formatMap
	 * @throws ReportingException
	 */
	public final List getReportFormat(final String reportid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00229");
		List returnList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ReportConstants.GET_FORMAT_NAME);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ReportConstants.FORMAT_ID_VIEW);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportid);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
			LOGGER.ctdebug("CTREP00230", returnList);
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTREP00232", dbExp, reportid);

			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_FORMAT, dbExp);
		}
		LOGGER.ctinfo("CTREP00231");
		return returnList;
	}

	/**
	 * This method is to return the columns for column definition, group by and sort by
	 * 
	 * @return columnMap
	 * @throws ReportingException
	 */
	/*
	 * public final HashMap getColumnDefinition(final String reportid) throws ReportingException {
	 * LOGGER.ctinfo("CTREP00233"); List columnRsltList = null; List columnName = new ArrayList(); List columnId = new
	 * ArrayList(); DatabaseRequest dbRequest = null; DatabaseResult dbResult = null; HashMap columnMap = new HashMap();
	 * try { dbRequest = new CanvasDatabaseRequest(); dbRequest.setDataAccessMapKey(ReportConstants.GET_COLUMN_NAME);
	 * dbRequest.setOperation(DatabaseConstants.SELECT);
	 * dbRequest.setOperationExtension(ReportConstants.COLUMN_ID_VIEW); dbRequest.addFilter(ReportConstants.REPORT_ID,
	 * reportid); LOGGER.ctdebug("CTREP00234", reportid); dbResult = dbRequest.execute(); columnRsltList =
	 * dbResult.getReturnedList(); LOGGER.ctdebug("CTREP00235", columnRsltList); java.util.Iterator iter =
	 * columnRsltList.iterator(); while (iter.hasNext()) { HashMap resultMap = (HashMap) iter.next();
	 * columnName.add(resultMap.get(ReportConstants.COLUMN_NAME));
	 * columnId.add(resultMap.get(ReportConstants.COLUMN_ID)); } columnMap.put(ReportConstants.COLUMN_NAME, columnName);
	 * columnMap.put(ReportConstants.COLUMN_ID, columnId); LOGGER.ctdebug("CTREP00236", columnMap); } catch
	 * (DatabaseException dbExp) {
	 * 
	 * LOGGER.cterror("CTREP00237", dbExp, reportid);
	 * 
	 * throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_COL, dbExp);
	 * 
	 * } LOGGER.ctinfo("CTREP00238"); return columnMap; }
	 */

	/**
	 * This method is to return the columns for column definition, group by and sort by
	 * 
	 * @return columnMap
	 * @throws ReportingException
	 */
	public List<ReportColumnDefinition> getColumnDefinitions(String reportid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00233");
		List<ReportColumnDefinition> columnRsltList = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		HashMap columnMap = new HashMap();
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ReportConstants.FETCH_REPORT_COLUMN_DEFINITION);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportid);
			LOGGER.ctdebug("CTREP00234", reportid);
			dbResult = dbRequest.execute();
			columnRsltList = dbResult.getReturnedList();
			LOGGER.ctdebug("CTREP00235", columnRsltList);

			LOGGER.ctdebug("CTREP00236", columnMap);
		} catch (DatabaseException dbExp)
		{

			LOGGER.cterror("CTREP00237", dbExp, reportid);

			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_COL, dbExp);

		}
		LOGGER.ctinfo("CTREP00238");
		return columnRsltList;
	}

	/**
	 * This method is to get the parent node of the report being click, on the basis of which the form would load
	 * 
	 * @param product String
	 * @return resultMap
	 * @throws ReportingException
	 */
	public final HashMap getParentNode(final String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00239");
		DatabaseRequest dbReq = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		List returnedList = null;
		HashMap resultMap = new HashMap();
		try
		{
			dbReq.setDataAccessMapKey(ReportConstants.GET_PARENT_NODE);
			dbReq.setOperation(DatabaseConstants.SELECT);
			dbReq.setOperationExtension(ReportConstants.PARENT_ID_VIEW);
			dbReq.addFilter(ReportConstants.REPORT_ID, reportId);
			dbResult = dbReq.execute();
			returnedList = dbResult.getReturnedList();
			LOGGER.ctdebug("CTREP00240", returnedList);
			resultMap.put(ReportConstants.REPORT_ID, returnedList);

		} catch (DatabaseException dbExp)
		{

			LOGGER.cterror("CTREP00241", dbExp, reportId);

			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_PARENT, dbExp);
		}
		LOGGER.ctinfo("CTREP00242");
		return resultMap;
	}

	/**
	 * This method would fetch the filter criteria on the basis of report id & column id
	 * 
	 * @param product String
	 * @return filterMap
	 * @throws ReportingException
	 */
	public final HashMap getFilterCriteria(final String filterColumn, String reportid) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00243");
		DatabaseRequest dbReq = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		List filterName = new ArrayList();
		List filterId = new ArrayList();
		List filterType = new ArrayList();
		List filterRsltList = null;
		HashMap filterMap = new HashMap();
		HashMap resultMap = null;
		try
		{
			dbReq.setDataAccessMapKey(ReportConstants.GET_FILTER_CRITERIA);
			dbReq.setOperation(DatabaseConstants.SELECT);
			dbReq.setOperationExtension(ReportConstants.FILTER_COLUMN_VIEW);
			dbReq.addFilter(ReportConstants.COLUMN_NAME, filterColumn);
			dbReq.addFilter(ReportConstants.REPORT_ID, reportid);
			dbResult = dbReq.execute();
			filterRsltList = dbResult.getReturnedList();
			java.util.Iterator iter = filterRsltList.iterator();
			while (iter.hasNext())
			{
				resultMap = (HashMap) iter.next();
				filterName.add(resultMap.get(ReportConstants.FILTER_NAME));
				filterId.add(resultMap.get(ReportConstants.FILTER_ID));
				filterType.add(resultMap.get("DATA_TYPE"));

			}
			filterMap.put(ReportConstants.FILTER_NAME, filterName);
			filterMap.put(ReportConstants.FILTER_ID, filterId);
			filterMap.put("DATA_TYPE", filterType);

		} catch (DatabaseException dbExp)
		{

			LOGGER.cterror("CTREP00244", dbExp, reportid);

			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_FLR, dbExp);
		}
		LOGGER.ctinfo("CTREP00245");
		return filterMap;
	}

	/**
	 * This method used for reterieve the Scheduler details for the given reportId.
	 * 
	 * @param reportId
	 * @return
	 * @throws ReportingException
	 */
	public final HashMap getScheduleReportValues(final String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00246");

		DatabaseRequest dbReq = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		List returnedList = null;
		HashMap resultMap = new HashMap();
		try
		{
			dbReq.setDataAccessMapKey(ReportConstants.GET_SCHEDULED_VALUES);
			dbReq.setOperation(DatabaseConstants.SELECT);
			dbReq.setOperationExtension(ReportConstants.SCHEDULE_REPORT_VIEW);
			dbReq.addFilter(ReportConstants.REPORT_ID, reportId);
			dbResult = dbReq.execute();
			returnedList = dbResult.getReturnedList();
			resultMap.put(ReportConstants.SCHEDULE, returnedList);
			LOGGER.ctdebug("CTREP00247", resultMap);
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00248", dbException, reportId);
			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_DEFI_SCHEDULE, dbException);
		}
		LOGGER.ctinfo("CTREP00249");
		return resultMap;
	}

	/**
	 * This method used to update the Report Instance Definition Status in various stages Like INIT, QUEUED,
	 * IN_PROGRESS, GENERATED, PUBLISHED, NOTIFIED, FAILED and etc...
	 * 
	 * @param reportInstanceDefinition
	 * @throws ReportingException
	 */
	public void updateReportInstanceStatus(String reportInstanceId, ReportStatus status, String errorCode,
			String errorMsg) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00250");

		LOGGER.ctdebug("CTREP00251", reportInstanceId, status);
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.updateReportInstanceStatus");
		try
		{
			Map parametersMap = getStatusAsMap(reportInstanceId, status, errorCode, errorMsg);
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.UPDATE);
			dbRequest.setOperationExtension(ReportConstants.REPORT_INSTANCE_STATUS);
			dbRequest.setData(parametersMap);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00252", dbException, reportInstanceId);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_INST_UPDATE, dbException);
		}
		LOGGER.ctinfo("CTREP00253");
	}

	/**
	 * @param reportInstanceId
	 * @param status
	 * @param errorCode
	 * @param errorMsg
	 * @return
	 */
	private Map getStatusAsMap(String reportInstanceId, ReportStatus status, String errorCode, String errorMsg)
	{
		Map statusMap = new HashMap();
		statusMap.put(ReportConstants.STATUS, status.toString());
		statusMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
		statusMap.put(ReportConstants.ERROR_CODE, errorCode);
		statusMap.put(ReportConstants.ERROR_MESSAGE, errorMsg);
		return statusMap;
	}

	/**
	 * This method called to DELETE already created Report Definition.
	 * 
	 * @param reportId denotes the Report Definition's Id.
	 * @throws ReportingException
	 */
	public void deleteReportDefinitionDetails(String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00254");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.deleteReportDefinitionDetails");
		try
		{
			deleteReportDefiColumnFilters(reportId);
			deleteReportDefiColumnDefinition(reportId);
			deleteReportDefiNotifications(reportId);
			deleteReportDefiPublishers(reportId);
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ReportConstants.DB_EXT_KEY_DELETE_REPORT_DEFINITION);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportId);
			dbRequest.execute();
			performanceTimer.endTimer();

		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00255", reportId, dbException);

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_DEL, dbException);
		}
		LOGGER.ctinfo("CTREP00256");

	}

	/**
	 * Called for delete the Report Filters for the given reportId while DELETE the Report.
	 * 
	 * @param reportId
	 * @throws ReportingException
	 */
	private void deleteReportDefiColumnFilters(final String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00257");

		DatabaseRequest dbRequest = null;
		LOGGER.ctinfo(new StringBuffer("reportId : ").append(reportId).toString());
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportInstruction.deleteReportDefiColumnFilters");
		try
		{
			// Go to db and delete column filter definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ReportConstants.DB_EXT_KEY_DELETE_COLUMN_FILTER_DEFN);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportId);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTREP00258", reportId, dbExp);

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_DEL, dbExp);
		}
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTREP00259");
	}

	/**
	 * Called for delete the Report Column Definitions for the given reportId while DELETE the Report.
	 * 
	 * @param reportId
	 * @throws ReportingException
	 */
	private void deleteReportDefiColumnDefinition(final String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00260");

		DatabaseRequest dbRequest = null;
		LOGGER.ctinfo(new StringBuffer("reportId : ").append(reportId).toString());
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportInstruction.deleteReportDefiColumnDefinition");
		try
		{
			// Go to db and delete column filter definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ReportConstants.DB_EXT_KEY_DELETE_COLUMN_DEFN);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportId);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTREP00261", dbExp, reportId);

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_DEL, dbExp);
		}
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTREP00262");
	}

	/**
	 * Called for delete the Report notifications for the given reportId while DELETE the Report.
	 * 
	 * @param reportId
	 * @throws ReportingException
	 */
	private void deleteReportDefiNotifications(final String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00263");

		DatabaseRequest dbRequest = null;
		LOGGER.ctinfo("CTREP00573", reportId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportInstruction.deleteReportDefiNotifications");
		try
		{
			// Go to db and delete column filter definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ReportConstants.DB_EXT_KEY_DELETE_REPORT_DEFN_NOTIFICATION);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportId);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTREP00264", dbExp, reportId);

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_DEL, dbExp);
		}
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTREP00265");
	}

	/**
	 * Called for delete the Report Publishiers for the given reportId while DELETE the Report.
	 * 
	 * @param reportId
	 * @throws ReportingException
	 */
	private void deleteReportDefiPublishers(final String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00266");

		DatabaseRequest dbRequest = null;

		LOGGER.ctinfo("CTREP00573", reportId);
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportInstruction.deleteReportDefiPublishers");
		try
		{
			// Go to db and delete column filter definition
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.DELETE);
			dbRequest.setOperationExtension(ReportConstants.DB_EXT_KEY_DELETE_REPORT_DEFN_PUBLISHSER);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportId);
			dbRequest.execute();
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTREP00267", dbExp, reportId);

			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFINITION_DEL, dbExp);
		}
		performanceTimer.endTimer();
		LOGGER.ctinfo("CTREP00268");
	}

	/**
	 * This method is used to fetch the report context details for the given report instance id.
	 * 
	 * @param reportInstanceId
	 * @return
	 * @throws ReportingException
	 */
	public ReportContext getContextDetails(String reportInstanceId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00269");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.getContextDetails");
		ReportContext reportContext = null;
		LOGGER.ctdebug("CTREP00270", reportInstanceId);
		try
		{
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_CONTEXT);
			dbRequest.addFilter(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
			DatabaseResult dbResult = dbRequest.execute();
			List dataList = dbResult.getReturnedList();
			if (dataList != null && !dataList.isEmpty())
			{
				reportContext = (ReportContext) dataList.get(0);
			}
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00271", dbException, reportInstanceId);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_CONTEXT, dbException);
		}
		LOGGER.ctinfo("CTREP00272");
		return reportContext;
	}

	/**
	 * Stores the Report definition information at the time of SAVE Report Definition.
	 * 
	 * @param reportDefinition
	 * @throws ReportingException
	 */
	public void createReportDefinition(ReportDefinition reportDefinition) throws ReportingException
	{

		LOGGER.ctinfo("CTREP00273");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		DatabaseResult dbResult = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.createReportDefinition");
		try
		{
			Map parametersMap = reportDefinition.getReportDefinitionAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_DEFINITION);
			dbRequest.setData(parametersMap);
			dbResult = dbRequest.execute();
			performanceTimer.endTimer();

		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00274", dbException, reportDefinition.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_DEFINITION, dbException);
		}
		if (dbResult != null)
		{
			insertReportDefinitionColumnDefinitions(reportDefinition);
			insertReportDefinitionFilter(reportDefinition);
			insertReportDefinitionPublishers(reportDefinition);
			insertReportDefinitionNotifiers(reportDefinition);

		}
		LOGGER.ctinfo("CTREP00275");
	}

	/**
	 * This method called for insert the Report notifications details while generate the Report.
	 * 
	 * @param reportDefinition
	 * @throws ReportingException
	 */
	private void insertReportDefinitionNotifiers(ReportDefinition reportDefinition) throws ReportingException
	{

		LOGGER.ctinfo("CTREP00276");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportInstruction.insertReportDefinitionNotifiers");
		try
		{
			List notifiersList = reportDefinition.getListOfReportDefNotifiersAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_NOTIFIER_MAP);
			dbRequest.setBatchData(notifiersList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00277", dbException, reportDefinition.getReportId());

			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_DEFI_NOTFR, dbException);
		}
		LOGGER.ctinfo("CTREP00278");

	}

	/**
	 * This method called for insert the Report publishers details while generate the Report.
	 * 
	 * @param reportDefinition
	 * @throws ReportingException
	 */

	private void insertReportDefinitionPublishers(ReportDefinition reportDefinition) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00279");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportInstruction.insertReportDefinitionPublishers");
		try
		{
			List publishersList = reportDefinition.getListOfReportDefPublisherAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_PUBLISHER_MAP);
			dbRequest.setBatchData(publishersList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00281", dbException, reportDefinition.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_DEFI_PBH, dbException);
		}
		LOGGER.ctinfo("CTREP00280");

	}

	/**
	 * This method called for insert the Report Filters details while generate the Report.
	 * 
	 * @param reportDefinition
	 * @throws ReportingException
	 */

	private void insertReportDefinitionFilter(ReportDefinition reportDefinition) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00282");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.insertReportDefinitionFilter");
		try
		{
			List filtersList = reportDefinition.getListOfReportDefFiltersAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_FILTER_DEFINITION);
			dbRequest.setBatchData(filtersList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00284", dbException, reportDefinition.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_DEFI_FLR, dbException);
		}

		LOGGER.ctinfo("CTREP00283");

	}

	/**
	 * This method called for insert the Report Column defintion details while generate the Report.
	 * 
	 * @param reportDefinition
	 * @throws ReportingException
	 */

	private void insertReportDefinitionColumnDefinitions(ReportDefinition reportDefinition) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00285");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportInstruction.insertReportDefinitionColumnDefinitions");
		try
		{
			List colsList = reportDefinition.getListOfReportDefColAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.BATCH_INSERT);
			dbRequest.setOperationExtension(ReportConstants.REPORT_COLUMN_DEFINTITION);
			dbRequest.setBatchData(colsList);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00287", dbException, reportDefinition.getReportId());

			throw new ReportingException(ReportConstants.ERR_CD_INSERT_RPT_DEFI_COLS, dbException);
		}
		LOGGER.ctinfo("CTREP00286");

	}

	/**
	 * This method will called when the user perform the delete action to delete a report from the Report definiton
	 * Tree. The Report Definition table status column updated as "DELETED" for the given input reportId.
	 * 
	 * @param reportId denotes Report Definition's reportId.
	 * @throws ReportingException
	 */
	public void deleteReportDefinition(String reportId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00288");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.deleteReportDefinition");
		LOGGER.ctdebug("CTREP00289", reportId);
		try
		{
			Map parametersMap = getReportDefintionStatusAsMap(reportId);
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.UPDATE);
			dbRequest.setOperationExtension(ReportConstants.REPORT_DEFINITION_DELETE);
			dbRequest.setData(parametersMap);
			dbRequest.execute();
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00291", dbException, reportId);
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFI_UPDATE, dbException);
		}
		LOGGER.ctinfo("CTREP00290");

	}

	/**
	 * Returns a report column definition for a particular report id and the column id.
	 * 
	 * @param reportId the report id.
	 * @param columnId the column id.
	 * @return ReportDefinition object of the type ReportDefinition
	 * @throws ReportingException for any exception occured.
	 */
	public ReportColumnDefinition getReportDefForColumnId(String reportId, String columnId) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00292");
		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		List dataList = null;
		DatabaseResult dbResult = null;
		ReportColumnDefinition reportColumnDefinition = null;
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.getReportDefForColumnId");
		try
		{
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ReportConstants.DB_EXT_KEY_GET_REPORT_DEFINITION_FOR_COLUMNID);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportId);
			dbRequest.addFilter(ReportConstants.COLUMN_ID, columnId);
			dbResult = dbRequest.execute();
			dataList = dbResult.getReturnedList();
			if (dataList != null && !dataList.isEmpty())
			{
				reportColumnDefinition = (ReportColumnDefinition) dataList.get(0);
			}
			performanceTimer.endTimer();
		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00294", dbException, reportId, columnId);
			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_COL, dbException);
		}
		LOGGER.ctinfo("CTREP00293");
		return reportColumnDefinition;
	}

	/**
	 * @param reportId
	 * @return Map: statusMap
	 */
	private Map getReportDefintionStatusAsMap(String reportId)
	{
		Map statusMap = new HashMap();
		statusMap.put(ReportConstants.STATUS, ReportConstants.REPORT_DELETE_STATUS);
		statusMap.put(ReportConstants.REPORT_ID, reportId);
		return statusMap;
	}

	/**
	 * This method update the schedule details to particular reportId.
	 * 
	 * @param reportDefinition - Contains the ReportId and its schedule details like Schedule From_date, To_date, Type,
	 *            FrequencyValue.
	 * @throws ReportingException
	 */
	public void updateReportSchedule(ReportDefinition reportDefinition) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00295");

		DatabaseRequest dbRequest = new CanvasDatabaseRequest();
		PerformanceTimer performanceTimer = new PerformanceTimer();
		performanceTimer.startTimer("ReportingInstruction.updateReportSchedule");
		try
		{
			Map parametersMap = reportDefinition.getReportDefinitionAsMap();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.UPDATE);
			dbRequest.setOperationExtension(ReportConstants.REPORT_SCHEDULE);
			dbRequest.addFilter(ReportConstants.REPORT_ID, reportDefinition.getReportId());
			dbRequest.setData(parametersMap);
			dbRequest.execute();
			performanceTimer.endTimer();

		} catch (DatabaseException dbException)
		{
			LOGGER.cterror("CTREP00297", dbException, reportDefinition.getReportId());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_DEFI_SAVE_SCHEDULE, dbException);
		}
		LOGGER.ctinfo("CTREP00296");
	}

	/**
	 * This method used to check the reportName availability for the given following params.
	 * 
	 * @param gcif - denotes the OD_GCIF_NO
	 * @param userNo - denotes the OD_USER_NO
	 * @param systemReportId - System report Id for the availability checking report.
	 * @param reportName - User typed name for create a new report.
	 * @return Map - which have the IS_REPORT_AVAILABLE key with value as Y or N.
	 * @throws ReportingException
	 */
	public final Map getReportNameAvailability(final String gcif, final String userNo, final String systemReportId,
			final String reportName) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00298");
		List returnList = null;
		HashMap reportNameCheckMap = null;
		DatabaseRequest dbRequest = null;
		DatabaseResult dbResult = null;
		try
		{
			dbRequest = new CanvasDatabaseRequest();
			dbRequest.setDataAccessMapKey(ReportConstants.DB_DAM_KEY_INFO_REPORT);
			dbRequest.setOperation(DatabaseConstants.SELECT);
			dbRequest.setOperationExtension(ReportConstants.GET_REPORT_AVAILABILITY);
			dbRequest.addFilter(ReportConstants.OD_GCIF, gcif);
			dbRequest.addFilter(ReportConstants.OD_USER_NO, userNo);
			dbRequest.addFilter(ReportConstants.SYSTEM_REPORT_ID, systemReportId);
			dbRequest.addFilter(ReportConstants.REPORT_NAME, reportName);
			dbResult = dbRequest.execute();
			returnList = dbResult.getReturnedList();
			LOGGER.ctdebug("CTREP00300", returnList);
			if (returnList != null && !returnList.isEmpty())
			{
				reportNameCheckMap = (HashMap) returnList.get(0);
			}
		} catch (DatabaseException dbExp)
		{
			LOGGER.cterror("CTREP00301", dbExp, gcif, userNo, systemReportId, reportName);

			throw new ReportingException(ReportConstants.ERR_CD_GET_RPT_NAME_AVAILABLITY, dbExp);
		}
		LOGGER.ctinfo("CTREP00299");
		return reportNameCheckMap;
	}

	// instatntiating logger object
	private static Logger LOGGER = Logger.getLogger(ReportInstruction.class);

}
