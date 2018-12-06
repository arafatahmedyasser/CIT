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
import java.util.Iterator;
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
 * This class is the report definition VO object. It contains all the details about the report definition. It is
 * designed for simple VO, because it would be easier to add/update the output details future.
 * 
 * @version 1.0
 */

public class ReportDefinition implements IBaseDefinition
{
	private static final long serialVersionUID = 7516742524494637408L;
	/**
	 * Unique id for the report.
	 */
	private String reportId;
	/**
	 * Name of the report.
	 */
	private String reportName;
	/**
	 * Product Code.
	 */
	private String productCode;
	/**
	 * Sub product code.
	 */
	private String subProductCode;
	/**
	 * Function Code.
	 */
	private String funcCode;
	/**
	 * The logged in user no.
	 */
	private String userNo;
	/**
	 * The logged in user's GCIF.
	 */
	private String gcif;
	/**
	 * The format id like PDF, XSL, CSV, HTML and etc.
	 */
	private String formatId;
	/**
	 * This flag represent whether the empty record (There is no records while grouping) will be displayed in the report
	 * or not. The default value is true.
	 */
	private String includeBlankRec;
	/**
	 * It represents the immediate parent report Id of the report.
	 */
	private String parentReportId;
	/**
	 * It represents the system report Id of the report. It represents the report which is the root (pre-defined) report
	 * id.
	 */
	private String systemReportId;
	/**
	 * Entitlement type, it will be sent to entitlement engine to identify the entitlementCriteria.
	 */
	private String entlType;
	/**
	 * The name of the Rate card to be used for the report generation.
	 */
	private String rateCard;
	/**
	 * The reference currency to be use to currency conversion for the report.
	 */
	private String referenceCcy;
	/**
	 * It gives the Data Aggregator class with package details for the report.
	 */
	private String dataAggregatorClass;
	/**
	 * Contains the selected column (Report Column Definition) required for a report.
	 */
	private List<ReportColumnDefinition> columns;
	/**
	 * It denotes the list of report policies should be satisfied.
	 */
	private List<ReportPolicy> policies;
	/**
	 * It contains the List of publishers for the report.
	 */
	private List<ReportPublisher> publishers;
	/**
	 * It denotes the list of report notification listeners for the report.
	 */
	private List<ReportNotification> notifiers;
	/**
	 * The Scheduler information related to the report. The date at which the report should start executing.
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
	/**
	 * The status of the report.
	 */
	private String status;

	/**
	 * @return the reportId
	 */
	private String bundleKey;

	/**
	 * @return the bundleKey
	 */
	public String getBundleKey()
	{
		return bundleKey;
	}

	/**
	 * @param bundleKey the bundleKey to set
	 */
	public void setBundleKey(String bundleKey)
	{
		this.bundleKey = bundleKey;
	}

	public String getReportId()
	{
		return reportId;
	}

	/**
	 * @param reportId the reportId to set
	 */
	public void setReportId(String reportId)
	{
		this.reportId = reportId;
	}

	/**
	 * @return the reportName
	 */
	public String getReportName()
	{
		return reportName;
	}

	/**
	 * @param reportName the reportName to set
	 */
	public void setReportName(String reportName)
	{
		this.reportName = reportName;
	}

	/**
	 * @return the productCode
	 */
	public String getProductCode()
	{
		return productCode;
	}

	/**
	 * @param productCode the productCode to set
	 */
	public void setProductCode(String productCode)
	{
		this.productCode = productCode;
	}

	/**
	 * @return the subProductCode
	 */
	public String getSubProductCode()
	{
		return subProductCode;
	}

	/**
	 * @param subProductCode the subProductCode to set
	 */
	public void setSubProductCode(String subProductCode)
	{
		this.subProductCode = subProductCode;
	}

	/**
	 * @return the funcCode
	 */
	public String getFuncCode()
	{
		return funcCode;
	}

	/**
	 * @param funcCode the funcCode to set
	 */
	public void setFuncCode(String funcCode)
	{
		this.funcCode = funcCode;
	}

	/**
	 * @return the userNo
	 */
	public String getUserNo()
	{
		return userNo;
	}

	/**
	 * @param userNo the userNo to set
	 */
	public void setUserNo(String userNo)
	{
		this.userNo = userNo;
	}

	/**
	 * @return the gcif
	 */
	public String getGcif()
	{
		return gcif;
	}

	/**
	 * @param gcif the gcif to set
	 */
	public void setGcif(String gcif)
	{
		this.gcif = gcif;
	}

	/**
	 * @return the formatId
	 */
	public String getFormatId()
	{
		return formatId;
	}

	/**
	 * @param formatId the formatId to set
	 */
	public void setFormatId(String formatId)
	{
		this.formatId = formatId;
	}

	/**
	 * @return the includeBlankRec
	 */
	public boolean isIncludeBlankRec()
	{
		return ReportConstants.VAL_BOOL_YES.equals(getIncludeBlankRec());
	}

	/**
	 * @return the includeBlankRec
	 */
	public String getIncludeBlankRec()
	{
		return includeBlankRec;
	}

	/**
	 * @param includeBlankRec the includeBlankRec to set
	 */
	public void setIncludeBlankRec(String includeBlankRec)
	{
		this.includeBlankRec = includeBlankRec;
	}

	/**
	 * @return the parentReportId
	 */
	public String getParentReportId()
	{
		return parentReportId;
	}

	/**
	 * @param parentReportId the parentReportId to set
	 */
	public void setParentReportId(String parentReportId)
	{
		this.parentReportId = parentReportId;
	}

	/**
	 * @return the systemReportId
	 */
	public String getSystemReportId()
	{
		return systemReportId;
	}

	/**
	 * @param systemReportId the systemReportId to set
	 */
	public void setSystemReportId(String systemReportId)
	{
		this.systemReportId = systemReportId;
	}

	/**
	 * @return the entlType
	 */
	public String getEntlType()
	{
		return entlType;
	}

	/**
	 * @param entlType the entlType to set
	 */
	public void setEntlType(String entlType)
	{
		this.entlType = entlType;
	}

	/**
	 * @return the dataAggregatorClass
	 */
	public String getDataAggregatorClass()
	{
		return dataAggregatorClass;
	}

	/**
	 * @param dataAggregatorClass the dataAggregatorClass to set
	 */
	public void setDataAggregatorClass(String dataAggregatorClass)
	{
		this.dataAggregatorClass = dataAggregatorClass;
	}

	/**
	 * @return the rateCard
	 */
	public String getRateCard()
	{
		return rateCard;
	}

	/**
	 * @param rateCard the rateCard to set
	 */
	public void setRateCard(String rateCard)
	{
		this.rateCard = rateCard;
	}

	/**
	 * @return the referenceCcy
	 */
	public String getReferenceCcy()
	{
		return referenceCcy;
	}

	/**
	 * @param referenceCcy the referenceCcy to set
	 */
	public void setReferenceCcy(String referenceCcy)
	{
		this.referenceCcy = referenceCcy;
	}

	/**
	 * @return the columns
	 */
	public List<ReportColumnDefinition> getColumns()
	{
		return columns;
	}

	/**
	 * @param columns the columns to set
	 */
	public void setColumns(List<ReportColumnDefinition> columns)
	{
		this.columns = columns;
	}

	/**
	 * @return the policies
	 */
	public List<ReportPolicy> getPolicies()
	{
		return policies;
	}

	/**
	 * @param policies the policies to set
	 */
	public void setPolicies(List<ReportPolicy> policies)
	{
		this.policies = policies;
	}

	/**
	 * @return the publishers
	 */
	public List<ReportPublisher> getPublishers()
	{
		return publishers;
	}

	/**
	 * @param publishers the publishers to set
	 */
	public void setPublishers(List<ReportPublisher> publishers)
	{
		this.publishers = publishers;
	}

	/**
	 * @return the notifiers
	 */
	public List<ReportNotification> getNotifiers()
	{
		return notifiers;
	}

	/**
	 * @param notifiers the notifiers to set
	 */
	public void setNotifiers(List<ReportNotification> notifiers)
	{
		this.notifiers = notifiers;
	}

	/**
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

	/**
	 * 
	 * @return the status
	 */
	public String getStatus()
	{
		return status;
	}

	/**
	 * Sets the status of the trigger.
	 * 
	 * @param status
	 */
	public void setStatus(String status)
	{
		this.status = status;
	}

	/***
	 * This method converts the class into JSONString
	 * 
	 * @return null
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	@Override
	public String toJSONString()
	{
		return null;
	}

	/**
	 * This method used to get the ReportColumnDefinition Object for the given columnName.
	 * 
	 * @param columnName
	 * @return ReportColumnDefinition
	 */
	public ReportColumnDefinition getReportColumnDefinition(String columnId)
	{
		LOGGER.ctinfo("CTREP00520");
		List colList = getColumns();
		for (Iterator iterator = colList.iterator(); iterator.hasNext();)
		{
			ReportColumnDefinition reportColumnDefinition = (ReportColumnDefinition) iterator.next();
			if (columnId.equals(reportColumnDefinition.getColumnId()))
			{
				return reportColumnDefinition;
			}

		}
		LOGGER.ctinfo("CTREP00521");
		return null;
	}

	/**
	 * This method used to get the Report Definition object properties and Report Definition's Column, filters,
	 * publishers, nofitication details in the form Map for display in Reporting Framework UI design.
	 * 
	 * @return map which have the ReportDefintion object details
	 */
	/**
	 * @return
	 */
	public Map getReportDefinitionAsMapForUI()
	{
		LOGGER.ctinfo("CTREP00522");
		Map reportDefinitionMap = new HashMap();
		reportDefinitionMap.putAll(getReportDefinitionAsMap());
		List<ReportColumnDefinition> columnList = new ArrayList();
		List<ReportColumnDefinition> groupList = new ArrayList();
		List<ReportColumnDefinition> sortList = new ArrayList();
		List includeTotal = new ArrayList();
		List groupTotalList = new ArrayList();
		List allColGroupByList = new ArrayList();
		String mailReport = ReportConstants.VAL_BOOL_NO;
		List notifierList = new ArrayList();
		for (ReportNotification reportnotifier : notifiers)
		{
			notifierList.add(reportnotifier.getNotificationName());
		}
		reportDefinitionMap.put(ReportConstants.NOTIFICATION_NAME, notifierList);
		for (ReportColumnDefinition reportColDef : columns)
		{
			if (reportColDef.getPosition() > 0)
			{
				columnList.add(reportColDef);
			}
			if (reportColDef.isGroupableInd())
			{
				groupList.add(reportColDef);
			}
			if (reportColDef.isSortableInd())
			{
				sortList.add(reportColDef);
			}
			// TO BE CLARIFIED
			if (ReportConstants.VAL_BOOL_YES.equals(reportColDef.getIncludeTotal()))
			{
				includeTotal.add(reportColDef.getColumnName());
			}
			if (ReportConstants.VAL_BOOL_YES.equals(reportColDef.getGroupTotalInd()))
			{
				groupTotalList.add(reportColDef.getColumnName());
			}
			if (ReportConstants.VAL_BOOL_YES.equals(reportColDef.getAllColumnGroupByInd()))
			{
				allColGroupByList.add(reportColDef.getColumnName());
			}

		}
		for (ReportPublisher publisher : publishers)
		{
			if (ReportConstants.MAIL_PUBLISHERS.equals(publisher.getPublisherId()))
			{
				mailReport = ReportConstants.VAL_BOOL_YES;
			}
		}
		Collections.sort(columnList, new SelColComparator());
		Collections.sort(sortList, new SortByColComparator());
		Collections.sort(groupList, new GroupByColComparator());

		List selectedColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : columnList)
		{
			selectedColumns.add(reportColDef.getColumnId());
		}
		List groupedColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : groupList)
		{
			groupedColumns.add(reportColDef.getColumnId());
		}
		List sortedColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : sortList)
		{
			sortedColumns.add(reportColDef.getColumnId());
		}
		reportDefinitionMap.put(ReportConstants.COLUMN_DEFN, selectedColumns);
		reportDefinitionMap.put(ReportConstants.GROUP_BY, groupedColumns);
		reportDefinitionMap.put(ReportConstants.SORT_BY, sortedColumns);
		reportDefinitionMap.put(ReportConstants.GROUP_BY_LIST, allColGroupByList);
		reportDefinitionMap.put(ReportConstants.GROUP_TOTAL_LIST, groupTotalList);
		reportDefinitionMap.put(ReportConstants.MAIL_REPORT_IND, mailReport);
		reportDefinitionMap.put(ReportConstants.REPORT_FILTER_LIST, getListOfReportDefFiltersAsMap());

		if (fromDate != null && fromDate.trim().length() > 0)
		{
			String[] temp;
			String delimiter = ReportConstants.DELIMITER; /* white space used as delimeter */
			temp = fromDate.split(delimiter);

			reportDefinitionMap.put(ReportConstants.SCHEDULER_FROM_DATE, temp[0]);
		}
		if (toDate != null && toDate.trim().length() > 0)
		{
			String[] temp;
			String delimiter = ReportConstants.DELIMITER; /* white space used as delimeter */
			temp = toDate.split(delimiter);

			reportDefinitionMap.put(ReportConstants.SCHEDULER_TO_DATE, temp[0]);
		}

		// As of now, reporting framework is not handling the alert to functionality.
		reportDefinitionMap.put(ReportConstants.ALERT_TO_IND, ReportConstants.NO_IND);
		// TO BE CLARIFIED
		reportDefinitionMap.put(ReportConstants.INCLUDE_TOTAL, (includeTotal.isEmpty() ? ReportConstants.VAL_BOOL_NO
				: ReportConstants.VAL_BOOL_YES));

		LOGGER.ctinfo("CTREP00523");

		return reportDefinitionMap;
	}

	/**
	 * This method used to get the Report Definition object properties in the form Map. The contains the Report
	 * Definiton details like reportId, reportName, userNo, gcifid, parentReportId, SystemReportId, Status, etc...
	 * 
	 * @return map which have the ReportDefintion object details
	 */
	public Map getReportDefinitionAsMap()
	{
		LOGGER.ctinfo("CTREP00524");
		Map reportDefinitionMap = new HashMap();
		reportDefinitionMap.put(ReportConstants.REPORT_ID, reportId);
		reportDefinitionMap.put(ReportConstants.REPORT_NAME, reportName);
		reportDefinitionMap.put(ReportConstants.OD_PRODUCT, productCode);
		reportDefinitionMap.put(ReportConstants.OD_SUB_PRODUCT, subProductCode);
		reportDefinitionMap.put(ReportConstants.OD_FUNC_CODE, funcCode);
		reportDefinitionMap.put(ReportConstants.OD_USER_NO, userNo);
		reportDefinitionMap.put(ReportConstants.OD_GCIF, gcif);
		reportDefinitionMap.put(ReportConstants.FORMAT_ID, formatId);
		reportDefinitionMap.put(ReportConstants.INCLUDE_BLANK_REC, includeBlankRec);
		reportDefinitionMap.put(ReportConstants.PARENT_REPORT_ID, parentReportId);
		reportDefinitionMap.put(ReportConstants.SYSTEM_REPORT_ID, systemReportId);
		reportDefinitionMap.put(ReportConstants.ENTL_TYPE, entlType);
		reportDefinitionMap.put(ReportConstants.DATA_AGGREGATOR_CLASS, dataAggregatorClass);
		reportDefinitionMap.put(ReportConstants.RATECARD, rateCard);
		reportDefinitionMap.put(ReportConstants.REFERENCE_CCY, referenceCcy);
		reportDefinitionMap.put(ReportConstants.STATUS, status);
		reportDefinitionMap.put(ReportConstants.BUNDLE_KEY, bundleKey);
		if (fromDate != null && fromDate.trim().length() > 0)
		{
			reportDefinitionMap.put(ReportConstants.SCHEDULER_FROM_DATE, ReportUtil.dateToTimeStamp(fromDate));
		}
		if (toDate != null && toDate.trim().length() > 0)
		{
			reportDefinitionMap.put(ReportConstants.SCHEDULER_TO_DATE, ReportUtil.dateToTimeStamp(toDate));
		}
		reportDefinitionMap.put(ReportConstants.SCHEDULER_TYPE, type);
		reportDefinitionMap.put(ReportConstants.SCHEDULER_FREQUENCY_VALUE, frequencyValue);

		LOGGER.ctinfo("CTREP00525");
		return reportDefinitionMap;
	}

	/**
	 * This method used to get the Report Column Definition object properties in the form Map.
	 * 
	 * @return List of map which have the ReportColumnDefintion object details
	 */
	public List getListOfReportDefColAsMap()
	{
		LOGGER.ctinfo("CTREP00526");
		List reportColsList = new ArrayList();
		ReportColumnDefinition reportColDef = null;
		for (Object object : columns)
		{
			reportColDef = (ReportColumnDefinition) object;
			reportColsList.add(reportColDef.getReportColumnDefinitionAsMap());
		}
		LOGGER.ctinfo("CTREP00527");
		return reportColsList;
	}

	/**
	 * This method used to get the Report Filters object properties in the form Map with in the ReportColumnDefinition
	 * object.
	 * 
	 * @return List of map which have the ReportFilter object details.
	 */
	public List getListOfReportDefFiltersAsMap()
	{
		LOGGER.ctinfo("CTREP00528");
		List filtersList = new ArrayList();
		ReportColumnDefinition reportColDef = null;
		ReportFilter filters = null;
		for (Object object : columns)
		{
			reportColDef = (ReportColumnDefinition) object;
			for (Object filterObject : reportColDef.getFilters())
			{
				filters = (ReportFilter) filterObject;
				Map reportFilterMap = new HashMap();
				reportFilterMap.putAll(filters.getReportFilterAsMap());
				reportFilterMap.put(ReportConstants.REPORT_ID, reportId);
				reportFilterMap.put(ReportConstants.COLUMN_ID, reportColDef.getColumnId());
				reportFilterMap.put(ReportConstants.COLUMN_NAME, reportColDef.getColumnName());
				filtersList.add(reportFilterMap);
			}
		}

		LOGGER.ctinfo("CTREP00529");
		return filtersList;
	}

	/**
	 * This method used to get the Report Publisher properties in the form Map for the Report definiton.
	 * 
	 * @return List of maps which have the ReportPublisher object details.
	 */
	public List getListOfReportDefPublisherAsMap()
	{
		LOGGER.ctinfo("CTREP00530");
		List publishersList = new ArrayList();
		ReportPublisher publisher = null;

		for (Object object : publishers)
		{
			publisher = (ReportPublisher) object;

			Map reportPublisherDefinitionMap = new HashMap();
			reportPublisherDefinitionMap.put(ReportConstants.PUBLISHER_ID, publisher.getPublisherId().trim());
			reportPublisherDefinitionMap.put(ReportConstants.REPORT_ID, reportId);
			publishersList.add(reportPublisherDefinitionMap);
		}

		LOGGER.ctinfo("CTREP00531");
		return publishersList;
	}

	/**
	 * This method used to get the Report notifiers properties in the form Map for the Report definiton.
	 * 
	 * @return List of maps which have the ReportNotification object details.
	 */
	public List getListOfReportDefNotifiersAsMap()
	{
		LOGGER.ctinfo("CTREP00532");
		List notifiersList = new ArrayList();
		ReportNotification notifier = null;
		for (Object object : notifiers)
		{
			notifier = (ReportNotification) object;

			Map reportNotifierDefinitionMap = new HashMap();
			reportNotifierDefinitionMap.put(ReportConstants.REPORT_ID, reportId);
			reportNotifierDefinitionMap.put(ReportConstants.NOTIFICATION_ID, notifier.getNotificationId());
			notifiersList.add(reportNotifierDefinitionMap);
		}
		LOGGER.ctinfo("CTREP00533");
		return notifiersList;
	}

	/**
	 * This method will return the selected columns by order of selected position.
	 * 
	 * @return list of selected columns
	 */
	public List getSelectedColumns()
	{
		LOGGER.ctinfo("CTREP00534");
		List selectedColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : columns)
		{
			if (reportColDef.getPosition() > 0)
			{
				selectedColumns.add(reportColDef);
			}
		}
		Collections.sort(selectedColumns, new SelColComparator());

		LOGGER.ctinfo("CTREP00535");
		return selectedColumns;
	}

	/**
	 * This method will return the sort by columns by order of sort by position.
	 * 
	 * @return list of sort by columns
	 */
	public List getSortByColumns()
	{
		LOGGER.ctinfo("CTREP00536");
		List sortByColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : columns)
		{
			if (reportColDef.getSortPosition() > 0)
			{
				sortByColumns.add(reportColDef);
			}
		}
		Collections.sort(sortByColumns, new SortByColComparator());

		LOGGER.ctinfo("CTREP00537");
		return sortByColumns;
	}

	/**
	 * This method will return the group by columns by order of group by position.
	 * 
	 * @return list of group by columns
	 */
	public List getGroupByColumns()
	{
		LOGGER.ctinfo("CTREP00538");
		List groupByColumns = new ArrayList();
		for (ReportColumnDefinition reportColDef : columns)
		{
			if (reportColDef.getGroupPosition() > 0)
			{
				groupByColumns.add(reportColDef);
			}
		}
		Collections.sort(groupByColumns, new GroupByColComparator());

		LOGGER.ctinfo("CTREP00539");
		return groupByColumns;
	}

	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportDefinition.class);

}
