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

import java.io.Serializable;
import java.util.List;
import com.intellectdesign.canvas.report.util.ReportUtil;

/**
 * This class is the request VO object for reports. It contains the all necessary input for the report generation. It is
 * designed for simple VO, because it would be easier to add/update the input parameters future.
 * 
 * @version 1.0
 */
public class ReportRequest implements Serializable
{

	private static final long serialVersionUID = 7173579250074551039L;
	/**
	 * Report Id denotes the unique id of the report definition. For edit or delete operations, this will be get from
	 * UI, for create it will be generated.
	 * 
	 */
	private String reportId;
	/**
	 * It will be used when execute the report instance.
	 */
	private String reportInstanceId;
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
	 * The logged in user's Role.
	 */
	private String userRole;
	/**
	 * The format id like PDF, XSL, CSV, HTML and etc.
	 */
	private String formatId;
	/**
	 * This flag represent whether the empty record (There is no records while grouping) will be displayed in the report
	 * or not. The default value is true.
	 */
	private boolean includeBlankRec = true;
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
	 * The name of the Rate card to be used for the report generation.
	 */
	private String rateCard;
	/**
	 * The reference currency to be use to currency conversion for the report.
	 */
	private String referenceCcy;
	/**
	 * Selected column ids in the list in appropriate order.
	 */
	private List selectedColumns;
	/**
	 * Grouped column ids in the list in appropriate order.
	 */
	private List groupedColumns;
	/**
	 * Sorting column ids in the list in appropriate order.
	 */
	private List sortingColumns;
	/**
	 * ReportFilters in the list in appropriate order.
	 * 
	 * @param ReportFilters
	 */
	private List<ReportFilter> filters;
	/**
	 * ReportPublisher in the list.
	 * 
	 * @param ReportPublihers
	 */
	private List<ReportPublisher> publishers;
	/**
	 * ReportNotification in the list.
	 * 
	 * @param ReportNotification
	 */
	private List<ReportNotification> notifiers;
	/**
	 * The Group total
	 */
	private List groupTotal;
	/**
	 * Group by column names
	 */
	private List allColumnGroupBy;
	/**
	 * Schedule starts from.
	 */
	private String scheduleFromDate;
	/**
	 * Schedule ends by.
	 */
	private String scheduleToDate;
	/**
	 * Schedule type (Daily / Weekly / Monthly).
	 */
	private String scheduleType;
	/**
	 * Schedule frequency value. (Sun/Mon/...)
	 */
	private String scheduleFrequencyValue;
	/**
	 * The context object contains the ReportConfiguration related details.
	 */
	public ReportContext reportContext;
	/**
	 * Denotes the transaction Simulation Mode. In simulation mode, no transaction will be performed.
	 */
	private boolean simulationMode;
	/**
	 * Indicates the type of communication (ReportRequest.SYNC / ReportRequest.ASYNC).
	 */
	private int communicationType = -1;
	/**
	 * Communication Type Constants.
	 */
	public static final int SYNC = 0;
	public static final int ASYNC = 1;
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
	/**
	 * This method is for  Str GetReportId
	 * 
	 * @return the reportId
	 */
	public String getReportId()
	{
		return reportId;
	}
	/**
	 * This method is for  Set ReportStrId
	 * @param reportId the reportId to set
	 */
	public void setReportId(String reportId)
	{
		this.reportId = reportId;
	}
	/**
	 * This method is for    getReportInstanceId
	 * 
	 * @return the reportInstanceId
	 */
	public String getReportInstanceId()
	{
		return reportInstanceId;
	}
	/**
	 * This method is for  SetReportInstanceId
	 * 
	 * @param reportInstanceId the reportInstanceId to set
	 */
	public void setReportInstanceId(String reportInstanceId)
	{
		this.reportInstanceId = reportInstanceId;
	}
	/**
	 * This method is for  Str  ReportName
	 * 
	 * @return the reportName
	 */
	public String getReportName()
	{
		return reportName;
	}
	/**
	 * This method is for Set ReportName
	 * 
	 * @param reportName the reportName to set
	 */
	public void setReportName(String reportName)
	{
		this.reportName = reportName;
	}
	/**
	 * This method is for Str GetProductCode
	 * 
	 * @return the productCode
	 */
	public String getProductCode()
	{
		return productCode;
	}
	/**
	 * This method is for    SetProductCode
	 * 
	 * @param productCode the productCode to set
	 */
	public void setProductCode(String productCode)
	{
		this.productCode = productCode;
	}
	/**
	 * This method is for   GetProductCode
	 * 
	 * @return the subProductCode
	 */
	public String getSubProductCode()
	{
		return subProductCode;
	}
	/**
	 * This method is for  SubProductCode
	 * 
	 * @param subProductCode the subProductCode to set
	 */
	public void setSubProductCode(String subProductCode)
	{
		this.subProductCode = subProductCode;
	}
	/**
	 * This method  is for  Str FunCode
	 * 
	 * @return the funcCode
	 */
	public String getFuncCode()
	{
		return funcCode;
	}
	/**
	 * This method is for  SetFunCode
	 * 
	 * @param funcCode the funcCode to set
	 */
	public void setFuncCode(String funcCode)
	{
		this.funcCode = funcCode;
	}
	/**
	 * This method is  for  GetUserNo
	 * 
	 * @return the userNo
	 */
	public String getUserNo()
	{
		return userNo;
	}
	/**
	 * This  method is for  SetUserNo
	 * 
	 * @param userNo the userNo to set
	 */
	public void setUserNo(String userNo)
	{
		this.userNo = userNo;
	}
	/**
	 * This method is for  Str GCIF
	 * 
	 * @return the gcif
	 */
	public String getGcif()
	{
		return gcif;
	}
	/**
	 * This  method is for  Set GCIF
	 * 
	 * @param gcif the gcif to set
	 */
	public void setGcif(String gcif)
	{
		this.gcif = gcif;
	}
	/**
	 * This method is for  getFormatId
	 * 
	 * @return the formatId
	 */
	public String getFormatId()
	{
		return formatId;
	}
	/**
	 *  This method is for  SetFormatId
	 *  
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
		return includeBlankRec;
	}
	/**
	 * This method is for Set includeBlankRec
	 * 
	 * @param includeBlankRec the includeBlankRec to set
	 */
	public void setIncludeBlankRec(boolean includeBlankRec)
	{
		this.includeBlankRec = includeBlankRec;
	}
	/**
	 * This method is for Str ParentReportId
	 * 
	 * @return the parentReportId
	 */
	public String getParentReportId()
	{
		return parentReportId;
	}
	/**
	 * This method is for  SetparentReportId
	 * 
	 * @param parentReportId the parentReportId to set
	 */
	public void setParentReportId(String parentReportId)
	{
		this.parentReportId = parentReportId;
	}
	/**
	 * This method is for  Str get SysReportId
	 * 
	 * @return the systemReportId
	 */
	public String getSystemReportId()
	{
		return systemReportId;
	}
	/**
	 * This method is for  SetSysReportId
	 * 
	 * @param systemReportId the systemReportId to set
	 */
	public void setSystemReportId(String systemReportId)
	{
		this.systemReportId = systemReportId;
	}
	/**
	 * This method is for  Str RateCard
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
	 * This method is for ReferenceCcy
	 * 
	 * @return the referenceCcy
	 */
	public String getReferenceCcy()
	{
		return referenceCcy;
	}
	/**
	 * This method is for  Set referenceCcy
	 * 
	 * @param referenceCcy the referenceCcy to set
	 */
	public void setReferenceCcy(String referenceCcy)
	{
		this.referenceCcy = referenceCcy;
	}
	/**
	 * This method is for  List selectedColumns
	 * 
	 * @return the selectedColumns
	 */
	public List getSelectedColumns()
	{
		return selectedColumns;
	}
	/**
	 * This  method is for  Set selectedColumns List
	 * 
	 * @param selectedColumns the selectedColumns to set
	 */
	public void setSelectedColumns(List selectedColumns)
	{
		this.selectedColumns = selectedColumns;
	}
	/**
	 * This method is for  List GetgroupedColumns
	 * 
	 * @return the groupedColumns
	 */
	public List getGroupedColumns()
	{
		return groupedColumns;
	}
	/**
	 * This method is for  Set groupedColumns
	 * 
	 * @param groupedColumns the groupedColumns to set
	 */
	public void setGroupedColumns(List groupedColumns)
	{
		this.groupedColumns = groupedColumns;
	}
	/**
	 * This method is  for List   sortingColumns
	 * 
	 * @return the sortingColumns
	 */
	public List getSortingColumns()
	{
		return sortingColumns;
	}
	/**
	 * This method is for  Set  sortingColumns
	 * 
	 * @param sortingColumns the sortingColumns to set
	 */
	public void setSortingColumns(List sortingColumns)
	{
		this.sortingColumns = sortingColumns;
	}
	/**
	 * This method is for  List ReportFilters
	 * 
	 * @return the filters
	 */
	public List<ReportFilter> getFilters()
	{
		return filters;
	}
	/**
	 * This method is for  Set  List ReportFilters 
	 * @param filters the filters to set
	 */
	public void setFilters(List<ReportFilter> filters)
	{
		this.filters = filters;
	}
	/**
	 *  This method is for  List Group Total
	 *  
	 * @return Total.
	 */
	public List getGroupTotal()
	{
		return groupTotal;
	}
	/**
	 * This method is for  List setGroupTotal
	 * 
	 * @param groupTotal
	 */
	public void setGroupTotal(List groupTotal)
	{
		this.groupTotal = groupTotal;
	}
	/**
	 *  This  method is for  List allColumnGroupBy
	 *  
	 * @return List allColumnGroupBy
	 */
	public List getAllColumnGroupBy()
	{
		return allColumnGroupBy;
	}
/**
 * This method is for  SetAllCol GroupBy
 * 
 * @param allColumnGroupBy
 */
	public void setAllColumnGroupBy(List allColumnGroupBy)
	{
		this.allColumnGroupBy = allColumnGroupBy;
	}
	/**
	 * This method is for  Get scheduleFromDate
	 * 
	 * @return the scheduleFromDate
	 */
	public String getScheduleFromDate()
	{
		return scheduleFromDate;
	}
	/**
	 * This method is for Set scheduleFromDate
	 * 
	 * @param scheduleFromDate the scheduleFromDate to set
	 */
	public void setScheduleFromDate(String scheduleFromDate)
	{
		this.scheduleFromDate = scheduleFromDate;
	}
	/**
	 * This method is for  Str Schedule Date
	 * 
	 * @return the scheduleToDate
	 */
	public String getScheduleToDate()
	{
		return scheduleToDate;
	}
	/**
	 * This  method is  for SetScheduleToDate
	 * @param scheduleToDate the scheduleToDate to set
	 */
	public void setScheduleToDate(String scheduleToDate)
	{
		this.scheduleToDate = scheduleToDate;
	}
	/**
	 * This method is for  SchedudleType
	 * 
	 * @return the scheduleType
	 */
	public String getScheduleType()
	{
		return scheduleType;
	}
	/**
	 * This method is for Set SchedudleType
	 * 
	 * @param scheduleType the scheduleType to set
	 */
	public void setScheduleType(String scheduleType)
	{
		this.scheduleType = scheduleType;
	}
	/**
	 * This method is for   getScheduleFrequencyValue
	 * 
	 * @return the scheduleFrequencyValue
	 */
	public String getScheduleFrequencyValue()
	{
		return scheduleFrequencyValue;
	}
	/**
	 * This method is for   SetScheduleFrequencyValue
	 * 
	 * @param scheduleFrequencyValue the scheduleFrequencyValue to set
	 */
	public void setScheduleFrequencyValue(String scheduleFrequencyValue)
	{
		this.scheduleFrequencyValue = scheduleFrequencyValue;
	}
	/**
	 * This method is for  BooleanScheduled
	 * 
	 * @return the isScheduled
	 */
	public boolean isScheduled()
	{
		if (ReportUtil.isNotEmpty(scheduleFromDate))
			return true;
		else
			return false;
	}
	/**
	 * This  method is for  ReportContext 
	 * 
	 * @return the reportContext
	 */
	public ReportContext getReportContext()
	{
		return reportContext;
	}
	/**
	 * This method  for  SetReportContext
	 *  
	 * @param reportContext the reportContext to set
	 */
	public void setReportContext(ReportContext reportContext)
	{
		this.reportContext = reportContext;
	}
	/**
	 * This method is for communicationType
	 * 
	 * @return the communicationType
	 */
	public int getCommunicationType()
	{
		return communicationType;
	}
	/**
	 * This method for Set  communicationType
	 * 
	 * @param communicationType the communicationType to set
	 */
	public void setCommunicationType(int communicationType)
	{
		this.communicationType = communicationType;
	}
	/**
	 * This method is for  List Publishers
	 * 
	 * @param publishers the publishers to set
	 * */
	public void setPublishers(List<ReportPublisher> publishers)
	{
		this.publishers = publishers;
	}
	/**
	 * This  method is for List ReportPublisher
	 * 
	 * @return the publishers
	 * */
	public List<ReportPublisher> getPublishers()
	{
		return publishers;
	}
	/**
	 * This method is for   List ReportNotification
	 * 
	 * @param notifiers the notifiers to set
	 * */

	public List<ReportNotification> getNotifiers()
	{
		return notifiers;
	}
	/**
	 * This method is for List Notifiers
	 * 
	 * @return the notifiers
	 * */

	public void setNotifiers(List<ReportNotification> notifiers)
	{
		this.notifiers = notifiers;
	}
	/**
	 * This method is for  Boolean  simulationMode
	 * 
	 * @return simulationMode
	 */
	public boolean isSimulationMode()
	{
		return simulationMode;
	}
	/**
	 * This method is for  SetSimulationMode
	 * 
	 * @param simulationMode the transaction simulation mode to set.
	 */
	public void setSimulationMode(boolean simulationMode)
	{
		this.simulationMode = simulationMode;
	}
	/**
	 * This method is for  Get UserRole
	 * 
	 * @return the userRole
	 */
	public String getUserRole()
	{
		return userRole;
	}
	/**
	 * This method is for   setUserRole
	 * 
	 * @param userRole the userRole to set
	 */
	public void setUserRole(String userRole)
	{
		this.userRole = userRole;
	}

}
