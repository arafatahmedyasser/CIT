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
package com.intellectdesign.canvas.report.util;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.omg.CORBA.SystemException;

import com.intellectdesign.canvas.entitlement.DataEntitlements;
import com.intellectdesign.canvas.entitlement.EntitlementException;
import com.intellectdesign.canvas.entitlement.EntitlementsHelper;
import com.intellectdesign.canvas.exceptions.reports.ReportException;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.properties.reader.ReportingProperties;
import com.intellectdesign.canvas.report.exception.ReportingException;
import com.intellectdesign.canvas.report.instr.ReportInstruction;
import com.intellectdesign.canvas.report.vo.ReportColumnDefinition;
import com.intellectdesign.canvas.report.vo.ReportDefinition;
import com.intellectdesign.canvas.report.vo.ReportFilter;
import com.intellectdesign.canvas.report.vo.ReportInstanceDefinition;
import com.intellectdesign.canvas.report.vo.ReportNotification;
import com.intellectdesign.canvas.report.vo.ReportPublisher;
import com.intellectdesign.canvas.report.vo.ReportRequest;
import com.intellectdesign.canvas.report.vo.ReportResponse;

/**
 * This class contains the utility methods for the reporting framework.
 * 
 * private methods:createReportId,createReportInstanceId,createContextDetails,createReportDefinition,
 * createReportColumnDefinition,performCurrencyConversion,convertToEquiValentCurrency,performDateFormatting,
 * performAmountFormatting,getAmountPrecision,formatMassagedData,getLocale
 * 
 * public methods:buildReportDefinition,buildReportInstanceDefinition
 * 
 * @version 1.0
 */

public class ReportUtil
{
	/**
	 * This method will create a new Unique Random Id for Report
	 * 
	 * @return String as ReportId
	 */
	private String createReportId()
	{
		return generateRandomId();
	}

	/**
	 * This method will create a new Unique Random Id for Report_instance_Definition object.
	 * 
	 * @return String as ReportInstanceId
	 */
	public static String createReportInstanceId()
	{
		return generateRandomId();
	}

	/**
	 * Used to get the RandomId
	 * 
	 * @return string denotes the RandomId
	 */
	private static String generateRandomId()
	{
		return UUID.randomUUID().toString();
	}

	/**
	 * The method is used to build a report definition.The method performs the following If the report request does not
	 * contain the report id create the report id for the particulat report request.Create an instance of
	 * ReportingInstruction Get the report definition for the parent report id using
	 * reportInstruction.getReportDefinition(parentReportId) Create the ReportDefinition for the current report. Create
	 * the report Column definition for the created ReportDefinition . Create the publishers and notifiers for the
	 * created report definition. return the ReportDefinition
	 * 
	 * @param ReportRequest
	 * @param ReportDefinition
	 * 
	 */
	public ReportDefinition buildReportDefinition(ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00478");

		/**
		 * Step1:If the report request does not contain the report id create the report id for the particulat report
		 * request.
		 */

		String reportId = (reportRequest.getReportId() == null) ? createReportId() : reportRequest.getReportId();
		/**
		 * Step2:Create an instance of ReportingInstruction
		 * 
		 */
		ReportInstruction reportInstruction = new ReportInstruction();
		/**
		 * Step 3:Get the report definition for the parent report id.
		 */

		ReportDefinition parentReportDefinition = reportInstruction.getReportDefinition(reportRequest
				.getParentReportId());
		/**
		 * Step 3.1 : If parentReportDefinition is null means the parentReportId is not available in REPORT_DEFINITION
		 * table. For this case, consider the System ReportId as parent reportId and get the ParentReportDefinition for
		 * the System ReportId. Reason-case 1: In UI there is no option for delete the System ReportId. Reseon-case 2:
		 * The system ReportId cann't be deleted as manualy in DB. It will cause problem.
		 */
		if (parentReportDefinition == null)
		{
			parentReportDefinition = reportInstruction.getReportDefinition(reportRequest.getSystemReportId());
		}

		/**
		 * Step 4:Create the ReportDefinition for the current report
		 */
		ReportDefinition reportDefinition = createReportDefinition(reportId, reportRequest, parentReportDefinition);
		/**
		 * Step 5:Create the report Column definition for the created ReportDefinition
		 */
		reportDefinition.setColumns(createReportColumnDefinition(reportId, reportRequest, parentReportDefinition));
		/**
		 * Step 6:Create the publishers and notifiers for the created report definition
		 */

		reportDefinition.setPublishers(reportRequest.getPublishers());
		reportDefinition.setNotifiers(reportRequest.getNotifiers());

		/**
		 * Step 7:Create the formats for the created report definition
		 */
		reportDefinition.setFormatId(reportRequest.getFormatId());
		LOGGER.ctinfo("CTREP00479");
		/**
		 * Step 8:return the reportDefinition
		 */
		return reportDefinition;
	}

	/**
	 * The method is used to build the business objcet for report definition for the current report reuqest. For some of
	 * the parameters like ENTL_TYPE,DATA_AGGREGTOR_CLASS,RATE_CARD,REFERENCE_CCY for the current report we need to
	 * refer the parent report. Report id may be a generated report id or it may be present there in the report request.
	 * Rest all the parameters will be set from the report request itself.
	 * 
	 * @param String reportId, ReportRequest reportRequest, ReportDefinition parentReportDefinition
	 * @return ReportDefinition
	 * @throws ReportingException
	 */

	private static ReportDefinition createReportDefinition(String reportId, ReportRequest reportRequest,
			ReportDefinition parentReportDefinition) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00480");
		/**
		 * Step1:Creating a instance of report definition.
		 */
		ReportDefinition reportDefinition = new ReportDefinition();
		/**
		 * Step1:Setting the report Id
		 */
		reportDefinition.setReportId(reportId);
		/**
		 * Step 2:For seeting the parameters like entlType and dataAggregatorClass,the reportdefinition of the parent
		 * report should be refertred
		 */

		reportDefinition.setEntlType(parentReportDefinition.getEntlType());
		reportDefinition.setDataAggregatorClass(parentReportDefinition.getDataAggregatorClass());

		reportDefinition.setProductCode(parentReportDefinition.getProductCode());
		reportDefinition.setSubProductCode(parentReportDefinition.getSubProductCode());
		reportDefinition.setFuncCode(parentReportDefinition.getFuncCode());
		reportDefinition.setSystemReportId(parentReportDefinition.getSystemReportId());

		/**
		 * Step 3:Setting rest of the parameters from the reportRequest
		 */
		reportDefinition.setRateCard(reportRequest.getRateCard());
		reportDefinition.setReferenceCcy(reportRequest.getReferenceCcy());
		reportDefinition.setReportName(reportRequest.getReportName());

		reportDefinition.setUserNo(reportRequest.getUserNo());
		reportDefinition.setGcif(reportRequest.getGcif());
		reportDefinition.setFormatId(reportRequest.getFormatId());
		reportDefinition.setIncludeBlankRec((reportRequest.isIncludeBlankRec() ? ReportConstants.VAL_BOOL_YES
				: ReportConstants.VAL_BOOL_NO));
		reportDefinition.setParentReportId(reportRequest.getParentReportId());

		reportDefinition.setStatus(null);
		if (reportRequest.isScheduled())
		{
			reportDefinition.setFromDate(reportRequest.getScheduleFromDate());
			reportDefinition.setToDate(reportRequest.getScheduleToDate());
			reportDefinition.setType(reportRequest.getScheduleType());
			reportDefinition.setFrequencyValue(reportRequest.getScheduleFrequencyValue());
		}
		reportDefinition.setBundleKey(parentReportDefinition.getBundleKey());
		LOGGER.ctinfo("CTREP00481");
		/**
		 * Step 4:Returing the ReportDefinition object
		 */
		return reportDefinition;
	}

	/**
	 * 
	 * The method is used to create the report column definition for a particular report request. ReportColumnDefinition
	 * is a business object which has a many to one relationship with the report definition. The method performs the
	 * followings:
	 * 
	 * Get the SelectedColumns,Filters,GroupedColumns,SortingColumns AllColumnGroupBy ,GroupTotal list and add all of
	 * them into a new List.
	 * 
	 * Get the distinct column from the available list. Instantiate the ReportColumnDefinition and ReportFilter.
	 * 
	 * Iterate the distinct column list and do the followings:
	 * 
	 * Get the parent report column definition of the selected column. Make a clone of parentColumnDefinition as
	 * columnDefinition. Set the report id in the report column definition. Checks whether the selected column id is
	 * available in the selected column list or not.
	 * 
	 * If it is available in the list then put the approrpiate position else put position as 0. Checks whether the
	 * selected column id is available in the groupable column list or not. If it is available in the list then put the
	 * approrpiate position and groupind as 1 else put position as 0 and groupind as 0. Checks whether the selected
	 * columnd id is available in the sortable list or not.
	 * 
	 * If it is available in the list put the appropriate parameters. Set the filters for the selected columns. Set the
	 * linkedSrcAmt and linkedSrcCcy for the column definition. For this the report column definition of the parent
	 * report id will be referred. Put the columnDefinition in a list and return the list
	 * 
	 * @param String reportId, ReportRequest reportRequest, ReportDefinition parentReportDefinition
	 * @return List
	 * @throws ReportException
	 */

	private static List createReportColumnDefinition(String reportId, ReportRequest reportRequest,
			ReportDefinition parentReportDefinition) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00482");
		/**
		 * Step1: Get the SelectedColumns,Filters,GroupedColumns,SortingColumns AllColumnGroupBy ,GroupTotal list and
		 * add all of them into a new List
		 */
		List list = new ArrayList();
		List selectedColumns = reportRequest.getSelectedColumns();
		List groupedColumns = reportRequest.getGroupedColumns();
		List sortedColumns = reportRequest.getSortingColumns();
		List allColsGroupBy = reportRequest.getAllColumnGroupBy();
		List getGroupTotal = reportRequest.getGroupTotal();
		List filterColumns = new ArrayList();

		list.addAll(selectedColumns);
		if (reportRequest.getFilters() != null && !reportRequest.getFilters().isEmpty())
		{
			for (ReportFilter reportFilter : reportRequest.getFilters())
			{
				filterColumns.add(reportFilter.getColumnId());
			}
			if (!filterColumns.isEmpty())
			{
				list.addAll(filterColumns);
			}
		}
		if (groupedColumns != null && !groupedColumns.isEmpty())
		{
			list.addAll(groupedColumns);
		}
		if (sortedColumns != null && !sortedColumns.isEmpty())
		{
			list.addAll(sortedColumns);
		}
		if (allColsGroupBy != null && !allColsGroupBy.isEmpty())
		{
			list.add(allColsGroupBy);
		}
		if (getGroupTotal != null && !getGroupTotal.isEmpty())
		{
			list.addAll(getGroupTotal);
		}

		/**
		 * Step 2:Get the distinc column from the available list
		 */
		Set set = new HashSet();
		set.addAll(list);
		List distinctColList = new ArrayList();
		distinctColList.addAll(set);
		/**
		 * Step 3:Instantiate the ReportColumnDefinition and ReportFilter.
		 * 
		 * These are the objects that require access to the data source to obtain and store data
		 */
		ReportColumnDefinition columnDefinition = new ReportColumnDefinition();
		/**
		 * Step 4:Iterate the distinct column list
		 * 
		 */

		/**
		 * Step 5:Put the columnDefinition in a list and return the list
		 */
		List columnList = new ArrayList();

		for (Iterator iterator = distinctColList.iterator(); iterator.hasNext();)
		{
			String selColumnId = iterator.next().toString();
			/**
			 * Step 4.1:Get the parent report column definition of the selected column
			 */
			ReportColumnDefinition parentColumnDefinition = parentReportDefinition
					.getReportColumnDefinition(selColumnId);
			/**
			 * step 4.2:Make a clone of parentColumnDefinition as columnDefinition
			 */
			try
			{
				if (parentColumnDefinition != null)
				{
					columnDefinition = (ReportColumnDefinition) parentColumnDefinition.clone();
				}

			} catch (CloneNotSupportedException cnsException)
			{
				LOGGER.cterror("CTREP00483", cnsException.getCause());
				throw new ReportingException(ReportConstants.ERR_CD_CLONE_NOT_SUPPORT, cnsException);
			}
			/**
			 * Step 4.3:Set the report id in the report column definition
			 */
			columnDefinition.setReportId(reportId);
			/**
			 * Step 4.4:Check whether the selected column id is available in the selected column list or not. If it is
			 * available in the list then put the approrpiate position else put position as 0
			 */
			if (selectedColumns != null && selectedColumns.contains(selColumnId))
			{
				columnDefinition.setPosition(selectedColumns.indexOf(selColumnId) + 1);
			} else
			{
				columnDefinition.setPosition(0);
			}
			/**
			 * Step 4.5:Check whether the selected column id is available in the groupable column list or not. If it is
			 * available in the list then put the approrpiate position and groupind as 1 else put position as 0 and
			 * groupind as 0
			 */
			if (groupedColumns != null && groupedColumns.contains(selColumnId))
			{
				columnDefinition.setGroupableInd(ReportConstants.VAL_BOOL_YES);
				columnDefinition.setGroupPosition(groupedColumns.indexOf(selColumnId) + 1);
			} else
			{
				columnDefinition.setGroupableInd(ReportConstants.VAL_BOOL_NO);
				columnDefinition.setGroupPosition(0);
			}
			/**
			 * Step 4.6:Check whether the selected columnd id is available in the sortable list or not. If it is
			 * available in the list put the appropriate parameters
			 * 
			 */
			if (sortedColumns != null && sortedColumns.contains(selColumnId))
			{
				columnDefinition.setSortableInd(ReportConstants.VAL_BOOL_YES);
				columnDefinition.setSortPosition(reportRequest.getSortingColumns().indexOf(selColumnId) + 1);
				columnDefinition.setSortOrder(ReportConstants.SORT_ASC);
			} else
			{
				columnDefinition.setGroupableInd(ReportConstants.VAL_BOOL_NO);
				columnDefinition.setSortPosition(0);
				columnDefinition.setSortOrder(ReportConstants.SORT_ASC);
			}
			/**
			 * Step 4.7:Check whether the selecetd column id is available in allColsGroupBy list or not.If it is
			 * available in the list put the appropriate parameters
			 */
			if (allColsGroupBy != null && allColsGroupBy.contains(selColumnId))
			{
				columnDefinition.setAllColumnGroupByInd(ReportConstants.VAL_BOOL_YES);
			} else
			{
				columnDefinition.setAllColumnGroupByInd(ReportConstants.VAL_BOOL_NO);
			}
			/**
			 * Step 4.8:Check whether the selecetd column id is available in getGroupTotal list or not.If it is
			 * available in the list put the appropriate parameters
			 */
			if (getGroupTotal != null && getGroupTotal.contains(selColumnId))
			{
				columnDefinition.setAllColumnGroupByInd(ReportConstants.VAL_BOOL_YES);
			} else
			{
				columnDefinition.setAllColumnGroupByInd(ReportConstants.VAL_BOOL_NO);
			}
			/**
			 * Step 4.9:Set the filters for the selected columns
			 * 
			 */
			if (reportRequest.getFilters() != null && filterColumns.contains(columnDefinition.getColumnId()))
			{
				columnDefinition.setFilters(new ArrayList());
				for (ReportFilter reportFilter : reportRequest.getFilters())
				{
					if (reportFilter.getColumnId() != null && reportFilter.getColumnId().trim().length() > 0
							&& reportFilter.getColumnId().equals(columnDefinition.getColumnId()))
					{
						reportFilter.setFilterType(columnDefinition.getDataType());
						columnDefinition.getFilters().add(reportFilter);
					}
				}
			}
			/**
			 * Step 4.10: Set the linkedSrcAmt and linkedSrcCcy for the column definition. For this the report column
			 * definition of the parent report id will be referred.
			 * 
			 */
			if (parentColumnDefinition != null && parentColumnDefinition.getLinkedSrcAmt() != null)
			{
				columnDefinition.setLinkedSrcAmt(parentColumnDefinition.getLinkedSrcAmt());
			}
			if (parentColumnDefinition != null && parentColumnDefinition.getLinkedSrcCcy() != null)
			{
				columnDefinition.setLinkedSrcCcy(parentColumnDefinition.getLinkedSrcCcy());
			}

			if (selectedColumns != null && selectedColumns.contains(columnDefinition.getColumnId()))
			{
				columnDefinition.setVisibilityInd(ReportConstants.VAL_BOOL_YES);
			} else
			{
				columnDefinition.setVisibilityInd(ReportConstants.VAL_BOOL_NO);
			}

			columnList.add(columnDefinition);
		}

		LOGGER.ctinfo("CTREP00484");
		/**
		 * Step 4:Returing the ReportDefinition object
		 * 
		 */
		return columnList;
	}

	/**
	 * 
	 * The method is used to create and build the ReportInstanceDefnition object based on the report Definition object.
	 * 
	 * @param reportDefinition
	 * @return reportInstanceDefinition
	 */
	public ReportInstanceDefinition buildReportInstanceDefinition(ReportDefinition reportDefinition)
	{
		LOGGER.ctinfo("CTREP00485");
		ReportInstanceDefinition reportInstanceDefinition = new ReportInstanceDefinition();
		reportInstanceDefinition.setColumns(reportDefinition.getColumns());
		reportInstanceDefinition.setFormatId(reportDefinition.getFormatId());
		reportInstanceDefinition.setFrequencyValue(reportDefinition.getFrequencyValue());
		reportInstanceDefinition.setFromDate(reportDefinition.getFromDate());
		reportInstanceDefinition.setGcif(reportDefinition.getGcif());
		reportInstanceDefinition.setIncludeBlankRec(reportDefinition.getIncludeBlankRec());
		reportInstanceDefinition.setNotifiers(reportDefinition.getNotifiers());
		reportInstanceDefinition.setPublishers(reportDefinition.getPublishers());
		reportInstanceDefinition.setRateCard(reportDefinition.getRateCard());
		reportInstanceDefinition.setReferenceCcy(reportDefinition.getReferenceCcy());
		reportInstanceDefinition.setReportId(reportDefinition.getReportId());
		reportInstanceDefinition.setReportInstanceId(createReportInstanceId());
		reportInstanceDefinition.setReportName(reportDefinition.getReportName());
		reportInstanceDefinition.setToDate(reportDefinition.getToDate());
		reportInstanceDefinition.setType(reportDefinition.getType());
		reportInstanceDefinition.setUserNo(reportDefinition.getUserNo());
		LOGGER.ctinfo("CTREP00486");
		return reportInstanceDefinition;
	}

	/**
	 * This method used for create the ReportInstanceDefinition object based on the user's Report Request at the time of
	 * Run the Report Defintion.
	 * 
	 * @param reportRequest
	 * @return ReportInstanceDefinition object
	 * @throws ReportingException
	 */
	public static ReportInstanceDefinition buildReportInstanceDefinition(ReportRequest reportRequest)
			throws ReportingException
	{
		LOGGER.ctinfo("CTREP00487");

		/**
		 * Step1:If the report request does not contain the report_InstanceId then create the reportInstanceId for the
		 * particulat reportInstance. request.
		 */
		String reportInstanceId = (reportRequest.getReportInstanceId() == null) ? createReportInstanceId()
				: reportRequest.getReportInstanceId();
		/**
		 * Step 2:Create the ReportInstanceDefinition for the current report_Instance_Id
		 * 
		 */
		ReportInstanceDefinition reportInstanceDefinition = createReportInstanceDefinition(reportInstanceId,
				reportRequest);
		/**
		 * Step3: Create an instance of ReportingInstruction class and get the report definition for the parent report
		 * id for getting the Columns definition.
		 * 
		 */
		ReportInstruction reportInstruction = new ReportInstruction();
		ReportDefinition parentReportDefinition = reportInstruction.getReportDefinition(reportRequest
				.getParentReportId());
		/**
		 * Step 4:Create the report Column definition for the created ReportDefinition
		 * 
		 */
		reportInstanceDefinition.setColumns(createReportColumnDefinition(reportInstanceId, reportRequest,
				parentReportDefinition));
		/**
		 * Step 5:Create the publishers and notifiers for the created report definition
		 * 
		 */

		reportInstanceDefinition.setPublishers(reportRequest.getPublishers());
		reportInstanceDefinition.setNotifiers(reportRequest.getNotifiers());

		/**
		 * Step 7:Create the formats for the created report definition
		 * 
		 */
		reportInstanceDefinition.setFormatId(reportRequest.getFormatId());
		LOGGER.ctinfo("CTREP00488");
		/**
		 * Step 8:return the reportDefinition
		 * 
		 */
		return reportInstanceDefinition;
	}

	/**
	 * This method construct the Report Instance Definition object for the given reportInstanceId based on the user
	 * Report Request Object.
	 * 
	 * @param reportInstanceId denote the Report Instance Id
	 * @param reportRequest - It contains the report instance details like columns, column-filters, notifiers,
	 *            publishers, ratecard, reference Currency and etc...
	 * @return ReportInstanceDefintion object.
	 * @throws ReportingException
	 */
	private static ReportInstanceDefinition createReportInstanceDefinition(String reportInstanceId,
			ReportRequest reportRequest) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00489");
		/**
		 * Step1:Creating a instance of report instance definition.
		 * 
		 */
		ReportInstanceDefinition reportInstanceDefinition = new ReportInstanceDefinition();
		/**
		 * Step2:Setting the report Instance Id
		 * 
		 */
		reportInstanceDefinition.setReportInstanceId(reportInstanceId);

		/**
		 * Step 3:Setting rest of the parameters from the reportRequest
		 * 
		 */
		reportInstanceDefinition.setReportId(reportRequest.getReportId());
		reportInstanceDefinition.setReportName(reportRequest.getReportName());
		reportInstanceDefinition.setUserNo(reportRequest.getUserNo());
		reportInstanceDefinition.setGcif(reportRequest.getGcif());
		reportInstanceDefinition.setFormatId(reportRequest.getFormatId());
		reportInstanceDefinition.setIncludeBlankRec((reportRequest.isIncludeBlankRec() ? ReportConstants.VAL_BOOL_YES
				: ReportConstants.VAL_BOOL_NO));
		reportInstanceDefinition.setStatus(ReportStatus.INIT.toString());
		reportInstanceDefinition.setRateCard(reportRequest.getRateCard());
		reportInstanceDefinition.setReferenceCcy(reportRequest.getReferenceCcy());

		LOGGER.ctinfo("CTREP00490");
		/**
		 * Step 4:Returing the reportInstanceDefinition object
		 * 
		 */
		return reportInstanceDefinition;
	}

	/**
	 * This method used for constract the Error reportReponse.
	 * 
	 * @param reportRequest - contains the report details like Report_Instance_Id, ReportId, ReportName.
	 * @param errorCode - denotes the ErrorCode.
	 * @param errorMsg - denotes the ErrorMessage.
	 * @return ReportResponse
	 */
	public static ReportResponse createErrorResponse(ReportRequest reportRequest, String errorCode, String errorMsg)
	{

		LOGGER.ctinfo("CTREP00491");
		ReportResponse reportResponse = new ReportResponse();
		reportResponse.setReportInstanceId(reportRequest.getReportInstanceId());
		reportResponse.setReportId(reportRequest.getReportId());
		reportResponse.setReportName(reportRequest.getReportName());
		reportResponse.setStatus(ReportConstants.STATUS_FAILURE);
		reportResponse.setErrorCode(errorCode);
		String strErrorMessage = "Error occured.For more information, check the serverlog";
		if (isNotEmpty(errorCode))
		{
			strErrorMessage = getMessage(errorCode);
		}
		reportResponse.setErrorMsg(strErrorMessage);
		LOGGER.ctinfo("CTREP00492");
		return reportResponse;
	}

	/**
	 * This method used for constract the Error reportReponse.
	 * 
	 * @param reportRequest - contains the report details like Report_Instance_Id, ReportId, ReportName.
	 * @param errorCode - denotes the ErrorCode.
	 * @return ReportResponse
	 */
	public static ReportResponse createErrorResponse(ReportRequest reportRequest, String errorCode)
	{

		LOGGER.ctinfo("CTREP00493");
		ReportResponse reportResponse = new ReportResponse();

		reportResponse.setReportInstanceId(reportRequest.getReportInstanceId());
		reportResponse.setReportId(reportRequest.getReportId());
		reportResponse.setReportName(reportRequest.getReportName());
		reportResponse.setStatus(ReportConstants.STATUS_FAILURE);
		reportResponse.setErrorCode(errorCode);
		String strErrorMessage = "Error occured.For more information, check the serverlog";
		if (isNotEmpty(errorCode))
		{
			strErrorMessage = getMessage(errorCode);
		}

		reportResponse.setErrorMsg(strErrorMessage);

		LOGGER.ctinfo("CTREP00494");
		return reportResponse;
	}

	/**
	 * Used to convert the String into list of string using the delimeter as comma.
	 * 
	 * @param str - input string with comma as delemeter
	 * @return list of string
	 */
	public List stringToListConverter(String str)
	{
		if (isNotEmpty(str))
		{
			List<String> list = new ArrayList<String>(Arrays.asList(str.split(",")));
			return list;
		} else
		{
			return null;
		}

	}

	/**
	 * Used to build the Publishers list based on the used selected publisher options.
	 * 
	 * @param reportDetailsMap - contains the user selected publishers information.
	 * @return list of ReportPublisher.
	 */

	public List<ReportPublisher> buildPublisherList(Map reportDetailsMap)
	{
		LOGGER.ctinfo("CTREP00495");
		List<ReportPublisher> publisherList = new ArrayList<ReportPublisher>();
		ReportPublisher reportPublisher = new ReportPublisher();
		reportPublisher.setPublisherId(ReportConstants.DEFAULT_PUBLISHERS);
		publisherList.add(reportPublisher);
		if (ReportConstants.VAL_BOOL_YES.equals(reportDetailsMap.get(ReportConstants.REPORT_MAIL_RPT)))
		{
			reportPublisher = new ReportPublisher();
			reportPublisher.setPublisherId(ReportConstants.MAIL_PUBLISHERS);
			publisherList.add(reportPublisher);
		}
		LOGGER.ctinfo("CTREP00496");
		return publisherList;
	}

	/**
	 * Used to build the notifiers list based on the used selected notifers options.
	 * 
	 * @param reportDetailsMap - contains the user selected notifers information.
	 * @return list of ReportNotification.
	 */
	public List<ReportNotification> buildNotifyList(List notifers)
	{
		LOGGER.ctinfo("CTREP00497");
		// String[] strArray = notifers.split(",");
		String notifierId = null;
		List<ReportNotification> notifierList = new ArrayList<ReportNotification>();
		for (int i = 0; i < notifers.size(); i++)
		{
			notifierId = (String) notifers.get(i);
			if (notifierId.trim().length() > 0)
			{
				ReportNotification reportNotification = new ReportNotification();
				if (notifierId.equals(ReportConstants.INBOX_LABEL))
				{
					notifierId = ReportConstants.INBOX_VALUE;
				} else if (notifierId.equals(ReportConstants.EMAIL_LABEL))
				{
					notifierId = ReportConstants.EMAIL_VALUE;
				} else if (notifierId.equals(ReportConstants.SMS_LABEL))
				{
					notifierId = ReportConstants.SMS_VALUE;
				}
				reportNotification.setNotificationId(notifierId);
				notifierList.add(reportNotification);
			}
		}
		LOGGER.ctinfo("CTREP00498");
		return notifierList;
	}

	/**
	 * This method called the entlEngine and get the status whether the login user have the entitlement to do the action
	 * for basis of Product, SubProduct and Function codes validation.
	 * 
	 * @param reportRequest
	 * @return boolean
	 */
	public static boolean isEntitled(final ReportRequest reportRequest)
	{

		LOGGER.ctinfo("CTREP00499");
		/**
		 * Report entitlement checking for the user.
		 * 
		 */
		String userNo = reportRequest.getUserNo();
		String gcif = reportRequest.getGcif();
		String sProduct = reportRequest.getProductCode();
		String sSubProduct = reportRequest.getSubProductCode();
		String sFunction = reportRequest.getFuncCode();
		String sUserRole = reportRequest.getUserRole();

		EntitlementsHelper entlHelper = new EntitlementsHelper();
		boolean isEntitled = false;
		DataEntitlements entlData = null;
		try
		{
			if (sUserRole == null)
			{
				entlData = entlHelper.getUserDataEntitlements(sProduct, sSubProduct, sFunction, gcif, userNo);
			} else
			{
				entlData = entlHelper.getUserDataEntitlements(sProduct, sSubProduct, sFunction, gcif, userNo, "3",
						sUserRole);
			}
			isEntitled = entlData.isEntitled();
		} catch (EntitlementException entlExcp)
		{
			// Eat this exception and return the entitlement status as false. The invoker can then send back a suitable
			// message
			LOGGER.cterror("CTREP00575", entlExcp);
			isEntitled = false;
		}
		LOGGER.ctinfo("CTREP00500");
		return isEntitled;
	}

	/**
	 * This method give the appiropiriate timestamp value for the given date string.
	 * 
	 * @param strdate - denotes the date.
	 * @return Timestamp
	 */
	public static Timestamp dateToTimeStamp(String strdate)
	{
		LOGGER.ctinfo("CTREP00501");
		Timestamp timeStampedDate = null;
		try
		{
			DateFormat formatter;
			formatter = new SimpleDateFormat(ReportConstants.UI_DATE_TIME_FORMAT);
			Date date = formatter.parse(strdate);
			timeStampedDate = new Timestamp(date.getTime());
		} catch (ParseException e)
		{
		}
		LOGGER.ctinfo("CTREP00502");
		return timeStampedDate;
	}

	/**
	 * Used to build the Report Filter list based on the used selected filters columns.
	 * 
	 * @param reportDetailsMap - contains the filters column details in the form of Map.
	 * @return list of ReportFilter.
	 */
	public List<ReportFilter> buildFilterList(List filters)
	{
		LOGGER.ctinfo("CTREP00503");
		Map filterMap = null;
		List<ReportFilter> filterList = new ArrayList<ReportFilter>();
		for (int i = 0; i < filters.size(); i++)
		{
			// Iterate the list and get the hashMap.
			filterMap = (HashMap) filters.get(i);

			// Iterate the HashMap and create ReportFilter object.

			String columnId = (String) filterMap.get(ReportConstants.FILTERCOLUMN);
			String filterId = (String) filterMap.get(ReportConstants.FILTERCRITERIA);
			String filterValues = (String) filterMap.get(ReportConstants.DATA);
			ReportFilter reportFilter = new ReportFilter();
			reportFilter.setColumnId(columnId);
			reportFilter.setFilterName((String) filterMap.get(ReportConstants.FILTER_CRIT_TO_DISP));
			reportFilter.setFilterId(filterId);
			reportFilter.setFilterValues(filterValues);
			filterList.add(reportFilter);
		}
		LOGGER.ctinfo("CTREP00504");
		return filterList;
	}

	/**
	 * This method used to get the Date object with user given pattern.
	 * 
	 * @param year - denote the year (from 1900 onwards)
	 * @param month - denote the month (0-11)
	 * @param date - denote the date (0-30)
	 * @param pattern
	 * @return Date
	 * @exception ParseException
	 */
	public static Date parseDate(int year, int month, int date, String pattern) throws ParseException,
			ReportingException
	{
		LOGGER.ctinfo("CTREP00505");
		Calendar calendar = new GregorianCalendar(year, month - 1, date);
		Date testDate = calendar.getTime();
		Date formattedDate = null;

		try
		{
			SimpleDateFormat format = new SimpleDateFormat(pattern);
			// pattern = "EEE MMM dd HH:mm:ss zzz yyyy";
			formattedDate = format.parse(testDate.toString());

			LOGGER.ctdebug("CTREP00506", year, month, date, formattedDate.toString());

		} catch (ParseException parseExp)
		{
			LOGGER.cterror("CTREP00507", parseExp);
			throw parseExp;
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00508", exp);
			throw new ReportingException(ReportConstants.ERR_CD_SCHED_JOB, exp);
		}
		LOGGER.ctinfo("CTREP00509");
		return formattedDate;
	}

	/**
	 * This method is used to update failure status of the report instance with errorCode and errorMsg.
	 * 
	 * @param reportInstanceId
	 * @param reportStatus
	 */
	public void updateReportInstanceStatus(String reportInstanceId, ReportStatus reportStatus, String errorCode,
			String errorMsg) throws ReportingException
	{
		LOGGER.ctinfo("CTREP00510");
		try
		{
			ReportInstruction reportInstruction = new ReportInstruction();
			reportInstruction.updateReportInstanceStatus(reportInstanceId, reportStatus, errorCode, errorMsg);
		} catch (ReportingException reportExp)
		{
			LOGGER.cterror("CTREP00511", reportExp.getCause());
			throw new ReportingException(reportExp.getErrorCode(), reportExp.getErrorMessage());
		} catch (SystemException sysExp)
		{
			LOGGER.cterror("CTREP00512", sysExp.getCause());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_INST_UPDATE, sysExp);
		} catch (SecurityException securityExp)
		{
			LOGGER.cterror("CTREP00513", securityExp.getCause());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_INST_UPDATE, securityExp);
		} catch (IllegalStateException illgalExp)
		{
			LOGGER.cterror("CTREP00514 ", illgalExp.getCause());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_INST_UPDATE, illgalExp);
		} catch (Exception exp)
		{
			LOGGER.cterror("CTREP00515", exp.getCause());
			throw new ReportingException(ReportConstants.ERR_CD_RPT_INST_UPDATE, exp);
		}
		LOGGER.ctinfo("CTREP00516");
	}

	/**
	 * This method is used to update successful status of the report instance.
	 * 
	 * @param reportInstanceId
	 * @param reportStatus
	 */
	public void updateReportInstanceStatus(String reportInstanceId, ReportStatus reportStatus)
			throws ReportingException
	{
		updateReportInstanceStatus(reportInstanceId, reportStatus, null, null);
	}

	/**
	 * Used to check the given input String is Not Null and Not Empty
	 * 
	 * @param String - input string
	 * @return boolean - return true if it is Not Null and Not Empty
	 */
	public static boolean isNotEmpty(String str)
	{
		return (str != null && str.trim().length() > 0);
	}

	/**
	 * Get the appiropiriate message for the given code input in default locale.
	 * 
	 * @param Code
	 * @return message.
	 */
	public static String getMessage(String code)
	{
		return MessageManager.getMessage(ReportingProperties.propertyFileName, code, ReportConstants.DEFAULT_LANG_ID);
	}

	/**
	 * Get the appiropiriate message for the given code input in given locale.
	 * 
	 * @param Code
	 * @param strLocale - denotes the locale.
	 * @return message.
	 */
	public static String getMessage(String code, String strLocale)
	{
		if (strLocale == null)
		{
			return MessageManager.getMessage(ReportingProperties.propertyFileName, code,
					ReportConstants.DEFAULT_LANG_ID);
		}

		return MessageManager.getMessage(ReportingProperties.propertyFileName, code, strLocale);
	}

	/**
	 * Get the appiropiriate message for the given code input in given locale.
	 * 
	 * @param Code
	 * @param strLocale - denotes the locale.
	 * @param phraseVariables - Message input params.
	 * @return message.
	 */
	public static String getMessage(String code, String strLocale, List messageData)
	{
		String strErrorMessage = null;
		if (strLocale == null)
		{
			strErrorMessage = MessageManager.getMessage(ReportingProperties.propertyFileName, code,
					ReportConstants.DEFAULT_LANG_ID);
		} else
		{
			strErrorMessage = MessageManager.getMessage(ReportingProperties.propertyFileName, code, strLocale);
		}

		if (messageData != null)
		{
			for (int index = 0; index < messageData.size(); index++)
			{
				strErrorMessage = strErrorMessage.replaceAll("\\{" + index + "\\}", (String) messageData.get(index));
			}
		}

		return strErrorMessage;
	}

	// instantiating logger object.
	private static Logger LOGGER = Logger.getLogger(ReportUtil.class);

}
