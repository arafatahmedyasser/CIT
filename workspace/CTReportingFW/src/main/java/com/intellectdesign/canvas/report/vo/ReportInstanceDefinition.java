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

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.common.IBaseDefinition;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.util.GroupByColComparator;
import com.intellectdesign.canvas.report.util.ReportConstants;
import com.intellectdesign.canvas.report.util.ReportUtil;
import com.intellectdesign.canvas.report.util.SelColComparator;
import com.intellectdesign.canvas.report.util.SortByColComparator;

/**
 * This class is the report Instance definition object for reports. It contains the all necessary report instance
 * details regarding the report generation. It will be stored in database. It is designed as simple VO, because it would
 * be easier to add/update the output details future.
 * 
 * @version 1.0
 */

public class ReportInstanceDefinition implements IBaseDefinition
{
	private static final long serialVersionUID = 8356854537686062353L;
	/**
	 * Unique id (REPORT_INSTANCE_ID) for the report instance.
	 */
	private String reportInstanceId;
	/**
	 * Unique id for the report.
	 */
	private String reportId;
	/**
	 * Name of the Report
	 */
	private String reportName;
	/**
	 * The logged in user No.
	 */
	private String userNo;
	/**
	 * The Gcif of the customer
	 */
	private String gcif;
	/**
	 * It represents the output format of the report like PDF, XSL, CSV, HTML and etc.
	 */
	private String formatId;
	/**
	 * If it is TRUE, the empty record (There is no records while grouping) will be displayed in the report otherwise
	 * not.
	 */
	private String includeBlankRec;
	/**
	 * It denotes the status of the report.
	 */
	private String status;
	/**
	 * Error code if any error occurred.
	 */
	private String errorCode;
	/**
	 * Error message if any.
	 */
	private String errorMsg;
	/**
	 * The name of the Rate card to be displayed in the report.
	 */
	private String rateCard;
	/**
	 * The reference currency to be displayed in the report.
	 */
	private String referenceCcy;
	/**
	 * Contains the selected column ( Report Instance Column Definition) required for a report.
	 */
	private List<ReportColumnDefinition> columns;
	/**
	 * It contains the List of publishers for the report instance.
	 */
	private List<ReportPublisher> publishers;
	/**
	 * The date at which the report is created.
	 * 
	 * @param ReportPublishers
	 */
	private String createdDate;
	/**
	 * It denotes the list of report notification listeners for the report instance.
	 */
	private List<ReportNotification> notifiers;
	/**
	 * The date at which the report should start executing.
	 * 
	 * @param ReportNotification
	 */
	private String fromDate;
	/**
	 * The date at which the report should stop executing.
	 */
	private String toDate;
	/**
	 * The type of trigger,e.g,Weekly,monthly,daily.
	 */
	private String type;
	/**
	 * The execution frequency of the trigger.
	 */
	private String frequencyValue;
	private LinkedHashMap mapColumns;// Key is the column id and value is the column definition object.
	/**
	 *  This method is for  ReportColumnDefinition
	 *  
	 * @param sColumnId
	 * @return ReportColumnDefinition:colDef
	 */
	public ReportColumnDefinition getColumnDefnForColumn(String sColumnId)
	{
		LOGGER.ctinfo("CTREP00542");
		ReportColumnDefinition colDef = null;
		if (mapColumns != null)
		{
			colDef = (ReportColumnDefinition) mapColumns.get(sColumnId);
		}
		LOGGER.ctinfo("CTREP00543");
		return colDef;
	}
	/**
	 * This  method is for   Str ReportId
	 * 
	 * @return the reportId
	 */
	public String getReportId()
	{
		return reportId;
	}
	/**
	 * This method is for Set ReportId
	 * 
	 * @param reportId the reportId to set
	 */
	public void setReportId(String reportId)
	{
		this.reportId = reportId;
	}
	/**
	 * @return the reportInstanceId
	 */
	public String getReportInstanceId()
	{
		return reportInstanceId;
	}
	/**
	 * This method is for SetReportInstanceId
	 * 
	 * @param reportInstanceId the reportInstanceId to set
	 */
	public void setReportInstanceId(String reportInstanceId)
	{
		this.reportInstanceId = reportInstanceId;
	}
	/**
	 * This method is for  Str ReportName
	 * 
	 * @return the reportName
	 */
	public String getReportName()
	{
		return reportName;
	}
	/**
	 * This method  is for   SetReportName
	 * 
	 * @param reportName the reportName to set
	 */
	public void setReportName(String reportName)
	{
		this.reportName = reportName;
	}
	/**
	 * This method is for Str UserNo
	 * 
	 * @return the userNo
	 */
	public String getUserNo()
	{
		return userNo;
	}
	/**
	 * This method  is for Set StrUserNo
	 * 
	 * @param userNo the userNo to set
	 */
	public void setUserNo(String userNo)
	{
		this.userNo = userNo;
	}
	/**
	 * This method is  for Str GCIF
	 * 
	 * @return the gcif
	 */
	public String getGcif()
	{
		return gcif;
	}
	/**
	 * This method is for  Set GCIF
	 * 
	 * @param gcif the gcif to set
	 */
	public void setGcif(String gcif)
	{
		this.gcif = gcif;
	}
	/**
	 * This method is for  FormatId
	 * 
	 * @return the formatId
	 */
	public String getFormatId()
	{
		return formatId;
	}
	/**
	 * This method is for  Set  FormatId
	 * @param formatId the formatId to set
	 */
	public void setFormatId(String formatId)
	{
		this.formatId = formatId;
	}
	/**
	 * This method is for  IncludeBlankRec
	 * 
	 * @return the includeBlankRec
	 */
	public boolean isIncludeBlankRec()
	{
		return ReportConstants.VAL_BOOL_YES.equals(getIncludeBlankRec());
	}
	/**
	 * This method is for  Get IncludeBlankRec
	 * 
	 * @return the includeBlankRec
	 */
	public String getIncludeBlankRec()
	{
		return includeBlankRec;
	}
	/**
	 * This method is for Set IncludeBlankRec
	 * 
	 * @param includeBlankRec the includeBlankRec to set
	 */
	public void setIncludeBlankRec(String includeBlankRec)
	{
		this.includeBlankRec = includeBlankRec;
	}
	/**
	 * This method is  for  Status
	 * 
	 * @return the status
	 */
	public String getStatus()
	{
		return status;
	}
	/**
	 * This method is for SetStatus
	 * 
	 * @param status the status to set
	 */
	public void setStatus(String status)
	{
		this.status = status;
	}
	/**
	 * This method is for  GetErrorCode
	 * 
	 * @return the errorCode
	 */
	public String getErrorCode()
	{
		return errorCode;
	}
	/**
	 * This method is  for  SetErrorCode
	 *  
	 * @param errorCode the errorCode to set
	 */
	public void setErrorCode(String errorCode)
	{
		this.errorCode = errorCode;
	}
	/**
	 * This method is for GetErrorMsg
	 * 
	 * @return the errorMsg
	 */
	public String getErrorMsg()
	{
		return errorMsg;
	}
	/**
	 * This method is is for  SetErrorMsg
	 * 
	 * @param errorMsg the errorMsg to set
	 */
	public void setErrorMsg(String errorMsg)
	{
		this.errorMsg = errorMsg;
	}
	/**
	 * This method is for GetRateCard
	 * 
	 * @return the rateCard
	 */
	public String getRateCard()
	{
		return rateCard;
	}
	/**
	 * This method is for SetRateCard
	 * 
	 * @param rateCard the rateCard to set
	 */
	public void setRateCard(String rateCard)
	{
		this.rateCard = rateCard;
	}
	/**
	 * This method is for  getReferenceCcy
	 * 
	 * @return the referenceCcy
	 */
	public String getReferenceCcy()
	{
		return referenceCcy;
	}
	/**
	 * This method is for  Set ReferenceCcy
	 * 
	 * @param referenceCcy the referenceCcy to set
	 */
	public void setReferenceCcy(String referenceCcy)
	{
		this.referenceCcy = referenceCcy;
	}
	/**
	 * This method is for List ReportColumnDefinition
	 * 
	 * @return the columns
	 */
	public List<ReportColumnDefinition> getColumns()
	{
		return columns;
	}
	/**
	 * This method is for  Set List Report ColumnDefinition
	 * 
	 * @param columns the columns to set
	 */
	public void setColumns(List<ReportColumnDefinition> columns)
	{
		LOGGER.ctinfo("CTREP00544");
		this.columns = columns;

		if (columns != null && !columns.isEmpty())
		{
			mapColumns = new LinkedHashMap();
			for (ReportColumnDefinition reportColumnDefinition : columns)
			{
				mapColumns.put(reportColumnDefinition.getColumnId(), reportColumnDefinition);
			}
		}
		LOGGER.ctinfo("CTREP00545");
	}
	/**
	 * This method is for  List Publishers
	 * 
	 * @return the publishers
	 */
	public List<ReportPublisher> getPublishers()
	{
		return publishers;
	}
	/**
	 * This method is  for  List Set ReportPublishers
	 * 
	 * @param publishers the publishers to set
	 */
	public void setPublishers(List<ReportPublisher> publishers)
	{
		this.publishers = publishers;
	}
	/**
	 * This method is for  Str GetCreatedDate
	 * 
	 * @return the createdDate
	 */
	public String getCreatedDate()
	{
		return createdDate;
	}
	/**
	 * This is for  Set CreatedDate
	 * 
	 * @param createdDate the createdDate to set
	 */
	public void setCreatedDate(String createdDate)
	{
		this.createdDate = createdDate;
	}
	/**
	 * This method is for  List ReportNotifiers
	 * 
	 * @return the notifiers
	 */
	public List<ReportNotification> getNotifiers()
	{
		return notifiers;
	}
	/**
	 * This  method is for  Set List ReportNotifiers

	 * @param notifiers the notifiers to set
	 */
	public void setNotifiers(List<ReportNotification> notifiers)
	{
		this.notifiers = notifiers;
	}
	/**
	 * This method is for Str FormDate
	 * 
	 * @return the from date
	 */
	public String getFromDate()
	{
		return fromDate;
	}
	/**
	 * Sets the date for the trigger.
	 * 
	 * @param fromDate
	 */
	public void setFromDate(String fromDate)
	{
		this.fromDate = fromDate;
	}
	/**
	 *  Sets the date for the trigger to date
	 *  
	 * @return The to date
	 */
	public String getToDate()
	{
		return toDate;
	}
	/**
	 * Sets the end date of the trigger.
	 * 
	 * @param toDate
	 */
	public void setToDate(String toDate)
	{
		this.toDate = toDate;
	}
	/**
	 * 
	 * @return the type of the trigger.
	 */
	public String getType()
	{
		return type;
	}
	/**
	 * Sets the type of the trigger
	 * 
	 * @param type
	 */
	public void setType(String type)
	{
		this.type = type;
	}
	/**
	 *  This method is for  GetFrequencyValue
	 *  
	 * @return the frequency value
	 */
	public String getFrequencyValue()
	{
		return frequencyValue;
	}
	/**
	 * Sets the frequenc value of the trigger.
	 * 
	 * @param frequencyValue
	 */
	public void setFrequencyValue(String frequencyValue)
	{
		this.frequencyValue = frequencyValue;
	}
	@Override
	/**
	 *  This method is for Str Values to JSONStr
	 * @return String
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	public String toJSONString()
	{
		return null;
	}
	/**
	 *  This method is for  ListOfReportDefColAsMap
	 *  
	 * @return List:reportColsList
	 */
	public List getListOfReportDefColAsMap()
	{
		LOGGER.ctinfo("CTREP00546");
		List reportColsList = new ArrayList();
		ReportColumnDefinition reportColDef = null;
		Map reportColumnDefMap = null;
		for (Object object : columns)
		{
			reportColDef = (ReportColumnDefinition) object;
			reportColumnDefMap = reportColDef.getReportColumnDefinitionAsMap();
			reportColumnDefMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
			reportColsList.add(reportColumnDefMap);
		}
		LOGGER.ctinfo("CTREP00547");
		return reportColsList;
	}
	/**
	 * Returns the map containing the various parameters of the report instance definition.
	 * 
	 * @param rid
	 * @return reportDefinitionMap
	 */
	public Map getReportInstDefinitionAsMap()
	{
		LOGGER.ctinfo("CTREP00548");
		Map reportInstanceDefMap = new HashMap();
		reportInstanceDefMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
		reportInstanceDefMap.put(ReportConstants.REPORT_ID, reportId);
		reportInstanceDefMap.put(ReportConstants.REPORT_NAME, reportName);
		reportInstanceDefMap.put(ReportConstants.OD_USER_NO, userNo);
		reportInstanceDefMap.put(ReportConstants.OD_GCIF, gcif);
		reportInstanceDefMap.put(ReportConstants.FORMAT_ID, formatId);
		reportInstanceDefMap.put(ReportConstants.INCLUDE_BLANK_REC, (isIncludeBlankRec() ? ReportConstants.VAL_BOOL_YES	: ReportConstants.VAL_BOOL_NO));
		reportInstanceDefMap.put(ReportConstants.STATUS, status);
		reportInstanceDefMap.put(ReportConstants.CREATED_DATE, createdDate);
		reportInstanceDefMap.put(ReportConstants.ERROR_CODE, errorCode);
		reportInstanceDefMap.put(ReportConstants.ERROR_MESSAGE, errorMsg);
		reportInstanceDefMap.put(ReportConstants.RATE_CARD, rateCard);
		reportInstanceDefMap.put(ReportConstants.REFERENCE_CCY, referenceCcy);

		if (fromDate != null)
		{
			reportInstanceDefMap.put(ReportConstants.SCHEDULER_FROM_DATE, ReportUtil.dateToTimeStamp(fromDate));
		}
		if (toDate != null)
		{
			reportInstanceDefMap.put(ReportConstants.SCHEDULER_TO_DATE, ReportUtil.dateToTimeStamp(toDate));
		}
		reportInstanceDefMap.put(ReportConstants.SCHEDULER_TYPE, type);
		reportInstanceDefMap.put(ReportConstants.SCHEDULER_FREQUENCY_VALUE, frequencyValue);

		LOGGER.ctinfo("CTREP00549");
		return reportInstanceDefMap;
	}
	/**
	 * Returns the map containing the various parameters of the report filter instance.
	 * 
	 * @param rid
	 * @return reportFilterMap
	 */
	public List getListOfReportInstFiltersAsMap()
	{
		LOGGER.ctinfo("CTREP00550");
		List reportInstfiltersList = new ArrayList();
		ReportColumnDefinition reportColDef = null;
		ReportFilter filters = null;
		for (Object object : columns)
		{
			reportColDef = (ReportColumnDefinition) object;
			for (Object filterobject : reportColDef.getFilters())
			{
				filters = (ReportFilter) filterobject;
				Map reportFilterMap = new HashMap();
				reportFilterMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
				reportFilterMap.put(ReportConstants.COLUMN_ID, reportColDef.getColumnId());
				reportFilterMap.put(ReportConstants.FILTER_ID, filters.getFilterId());
				reportFilterMap.put(ReportConstants.FILTER_DATA_TYPE, filters.getFilterType());
				reportFilterMap.put(ReportConstants.FILTER_NAME, filters.getFilterName());
				reportFilterMap.put(ReportConstants.FILTER_VALUES, filters.getFilterValues());
				reportInstfiltersList.add(reportFilterMap);
			}
		}
		LOGGER.ctinfo("CTREP00551");
		return reportInstfiltersList;
	}
	/**
	 * Returns the map containing the various parameters of the report Publisher instance.
	 * 
	 * @param rid
	 * @return reportPublisherDefinitionMap
	 */
	public List getListOfReportInstPublishersAsMap()
	{
		LOGGER.ctinfo("CTREP00552");
		List publishersList = new ArrayList();
		ReportPublisher publisher = null;
		for (Object object : publishers)
		{
			publisher = (ReportPublisher) object;
			Map reportPublisherDefinitionMap = new HashMap();
			reportPublisherDefinitionMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
			reportPublisherDefinitionMap.put(ReportConstants.PUBLISHER_ID, publisher.getPublisherId());
			reportPublisherDefinitionMap.put(ReportConstants.PUBLISHER_NAME, publisher.getPublisherName());
			reportPublisherDefinitionMap.put(ReportConstants.PUBLISHER_HANDLER_CLASS,	publisher.getPublisherHandlerClass());
			publishersList.add(reportPublisherDefinitionMap);
		}
		LOGGER.ctinfo("CTREP00553");
		return publishersList;

	}
	/**
	 * Returns the map containing the various parameters of the report Notifier instance.
	 * 
	 * @param rid
	 * @return reportNotifierDefinitionMap
	 */
	public List getListOfReportInstNotifiersAsMap()
	{
		LOGGER.ctinfo("CTREP00554");
		List notifiersList = new ArrayList();
		ReportNotification notifier = null;
		for (Object object : notifiers)
		{
			notifier = (ReportNotification) object;
			Map reportNotifierDefinitionMap = new HashMap();
			reportNotifierDefinitionMap.put(ReportConstants.REPORT_INSTANCE_ID, reportInstanceId);
			reportNotifierDefinitionMap.put(ReportConstants.NOTIFICATION_ID, notifier.getNotificationId());
			reportNotifierDefinitionMap.put(ReportConstants.NOTIFICATION_NAME, notifier.getNotificationName());
			reportNotifierDefinitionMap.put(ReportConstants.NOTIFICATION_HANDLER_CLASS,notifier.getNotificationHandlerClass());
			notifiersList.add(reportNotifierDefinitionMap);
		}
		LOGGER.ctinfo("CTREP00555");
		return notifiersList;
	}
	/**
	 * This method will return the selected columns by order of selected position.
	 * 
	 * @return list of selected columns
	 */
	public List getSelectedColumns()
	{
		LOGGER.ctinfo("CTREP00556");
		List selectedColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : columns)
		{
			if (reportColDef.isVisibleInd())
			{
				selectedColumns.add(reportColDef);
			}
		}
		Collections.sort(selectedColumns, new SelColComparator());
		LOGGER.ctinfo("CTREP00557");
		return selectedColumns;
	}
	/**
	 * This method will return the sort by columns by order of sort by position.
	 * 
	 * @return list of sort by columns
	 */
	public List getSortByColumns()
	{
		LOGGER.ctinfo("CTREP00558");
		List sortByColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : columns)
		{
			if (reportColDef.isSortableInd())
			{
				sortByColumns.add(reportColDef);
			}
		}
		Collections.sort(sortByColumns, new SortByColComparator());
		LOGGER.ctinfo("CTREP00559");
		return sortByColumns;
	}
	/**
	 * This method will return the group by columns by order of group by position.
	 * 
	 * @return list of group by columns
	 */
	public List getGroupByColumns()
	{
		LOGGER.ctinfo("CTREP00560");
		List groupByColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : columns)
		{
			if (reportColDef.isGroupableInd())
			{
				groupByColumns.add(reportColDef);
			}
		}
		Collections.sort(groupByColumns, new GroupByColComparator());
		LOGGER.ctinfo("CTREP00561");
		return groupByColumns;
	}
	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportInstanceDefinition.class);
}
