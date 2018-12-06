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

package com.intellectdesign.canvas.exportdata;

import java.util.ArrayList;
import java.util.HashMap;

import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.reports.Column;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * Base class for formatting the export data for all type of export formats. Has an abstract method which will be
 * implemented by the appropriate classes for generating the document in the respective format using the formatted data.
 * 
 * @version 1.0
 */
public abstract class ExportFormatProvider implements IExportFormatProvider
{
	/**
	 * This method formats the data as required by the XSLGenerator Returns the path of the generated file
	 * 
	 * @param exportDataValueObject
	 * @param userValue
	 * @return path of the file
	 * @throws ExportDataException
	 */
	public String getExportFormat(IExportDataValueObject exportDataValueObject, IUserValue userValue)
			throws ExportDataException
	{
		ArrayList listColumnHeaderValueObject = null;// ArrayList of IExportDataColumnHeaderValueObject
		IExportDataColumnHeaderValueObject columnHeaderValueObject = null;
		ArrayList listHeaderKey = null;// ArrayList of Column Header Keys
		ArrayList listExportData = null;// ArrayList of HashMap containing the data to be exported. The HashMap keys
										// should match the Column Header Keys.
		Column column = null;// Contains details of the column like the column title, width etc..
		ArrayList listMetaData = null;// ArrayList of Column. This ArrayList is sent to XSLGenerator
		String[] exportData = null;// String array which contains the details of one row
		ArrayList listData = null;// AraryList of String[]
		HashMap hmResultMap = new HashMap();// This is the data HashMap that is sent to XSLGenerator
		String sFilePath = null;// Path of the file
		String sReportID = null;// Report ID of the generated file
		String sTotalCount = null;
		String sUserId = null;// From the session in UserValue
		String sReportHeader = null;
		String strNoDataMsg = null;

		String langID = null;
		langID = (userValue.getLangId() == null || "".equals(userValue.getLangId())) ? "en_US" : userValue.getLangId(); // Defaul
																														// Language

		logger.ctinfo("CTEXP00014", exportDataValueObject);

		if (!exportDataValueObject.equals(null))
		{
			listColumnHeaderValueObject = exportDataValueObject.getColumnHeaders();
		}
		logger.ctdebug("CTEXP00019", listColumnHeaderValueObject);
		// Form Column meta data
		if (listColumnHeaderValueObject != null && !listColumnHeaderValueObject.isEmpty())
		{
			listHeaderKey = new ArrayList();
			listMetaData = new ArrayList();

			for (int i = 0; i < listColumnHeaderValueObject.size(); i++)
			{
				columnHeaderValueObject = (IExportDataColumnHeaderValueObject) listColumnHeaderValueObject.get(i);
				logger.ctdebug("CTEXP00031", columnHeaderValueObject);
				if (columnHeaderValueObject != null)
				{
					column = new Column();
					listHeaderKey.add(columnHeaderValueObject.getHeaderKey());
					column.setType(columnHeaderValueObject.getHeaderType());
					if ("EQULIN_AMT".equals(columnHeaderValueObject.getHeaderKey()))
					{
						column.setColumnName("LBL_EQULIN_AMT_CCY");
					} else
					{
						if (exportDataValueObject.getExportAdditionalData() != null
								&& exportDataValueObject.getExportAdditionalData().get("MODIFIED_COLUMN_NAMES") != null
								&& ((HashMap) exportDataValueObject.getExportAdditionalData().get(
										"MODIFIED_COLUMN_NAMES")).get(columnHeaderValueObject.getHeaderKey()) != null)
						{
							column.setColumnName((String) ((HashMap) exportDataValueObject.getExportAdditionalData()
									.get("MODIFIED_COLUMN_NAMES")).get(columnHeaderValueObject.getHeaderKey()));
						} else if (null == columnHeaderValueObject.getHeaderDescription()
								|| "".equals(columnHeaderValueObject.getHeaderDescription()))
						{
							column.setColumnName("LBL_" + columnHeaderValueObject.getHeaderKey());
						} else
						{
							column.setColumnName(columnHeaderValueObject.getHeaderDescription());
						}
					}
					// Set all column related parameters here. From where we get those values?
					listMetaData.add(column);
				} else
				{
					logger.cterror("CTEXP00002");
				}
			}
		} else
		{
			logger.cterror("CTEXP00003");
		}
		logger.ctdebug("CTEXP00020", listMetaData);

		// Form ArrayList of String array containing details of a row
		listExportData = exportDataValueObject.getExportData();
		logger.ctdebug("CTEXP00021", listExportData);

		if (listExportData != null && !listExportData.isEmpty())
		{
			listData = new ArrayList();
			sTotalCount = String.valueOf(listExportData.size());
			/**
			 * In Chart type View widgets export, if listHeaderKey is null. skip the following steps. otherwise continue
			 * to get the report data for the visibled columns. Reason : VIEW_COLUMN_DEFINITION table --> VISIBLE_IND
			 * column values is 'N' instead-od 'Y' and HIDDEN_IND column values is 'Y' instead-od 'N' for current
			 * exporting widget's VIEW_ID.
			 */
			if (listHeaderKey != null && listHeaderKey.size() > 0)
			{
				for (int i = 0; i < listExportData.size(); i++)
				{
					HashMap hmDataMap = (HashMap) listExportData.get(i);
					exportData = new String[listHeaderKey.size()];
					for (int j = 0; j < listHeaderKey.size(); j++)
					{
						// Changed to String.ValueOD to convert to string if it comes as other formats like integer.
						exportData[j] = String.valueOf(hmDataMap.get(listHeaderKey.get(j)));
					}
					listData.add(exportData);
				}
			} else
			{
				logger.ctdebug("CTEXP00022");
			}
		} else
		{
			logger.ctdebug("CTEXP00006");
		}
		sReportID = exportDataValueObject.getReportId();
		if (!userValue.equals(null))
		{
			sUserId = userValue.getUserNo();
		}
		// checks exportDataValueObject is of the type InformationReportingExportDataValueObject
		// InformationReportingFwSimpleExportDataValueObject is a empty implementation class that extends the
		// SimpleExportDataValueObject class. This class is used only by the information reporting FW.
		// For information reporting FW, the repor header is not expectd to get from the ez_reportlabels
		// properties file. hence it sets the header with the report name.
		if (exportDataValueObject instanceof InfoRptExportDataVO)
		{
			sReportHeader = sReportID;
		} else
		{
			// Get the report header. The report header should be defined in ez_reportlabels.properties with the key as
			// the report id.
			/**
			 * Set the Report header from the ez_reportlabels property file if the report header is present
			 */
			String reportHeader = exportDataValueObject.getReportHeader();
			if (null != reportHeader && !("").equals(reportHeader))
			{
				sReportHeader = reportHeader;
			} else
			{
				sReportHeader = MessageManager
						.getMessage(exportDataValueObject.getBundleKey(), sReportID, langID, true);
			}
		}
		logger.ctdebug("CTEXP00023", sReportHeader);
		if (listData == null)
		{
			listData = new ArrayList();
			strNoDataMsg = MessageManager.getMessage(ExportFwsConstants.EZ_LABELS,
					ReportingConstants.EZREPORTS_NO_DATA_MSG, langID);
			hmResultMap.put(ReportingConstants.EZREPORTS_NO_DATA_MSG, strNoDataMsg);
		}
		// Form the Data HashMap that needs to be sent to appropriate Export Providers
		hmResultMap.put(ReportingConstants.EZREPORTS_DATA, listData);
		hmResultMap.put(ReportingConstants.GROUP_COL_HEADER_DATA, exportDataValueObject.getGroupColumnHeader());
		hmResultMap.put(ReportingConstants.GROUP_HEADER_REQD, exportDataValueObject.isGroupHeaderReqd());
		hmResultMap.put("REPORT_HEADER", sReportHeader);
		hmResultMap.put("ROWS_PER_CALL", new Integer(0));
		hmResultMap.put("CORPORATE_NAME", userValue.getPrimaryCorporate());
		hmResultMap.put("USER_NAME", userValue.getFIRST_NAME());
		hmResultMap.put("LANGUAGE_ID", langID);
		hmResultMap.put(ReportingConstants.EZREPORTS_TOTAL_COUNT, sTotalCount);
		hmResultMap.put("USER_AMOUNT_FORMAT", userValue.getmAmtFormat());
		hmResultMap.put("DIRECTION", userValue.getDirection()); // For RTL
		// Get the user value and put into the hashmap for exporting PDF .

		hmResultMap.put("EXPORTFORMAT", exportDataValueObject.getexportMode());

		hmResultMap.put("USER_DATE_FORMAT", DateFormatterManager.getJavaDateFormat(userValue.getDateId()));
		hmResultMap.put("USER_TIME_FORMAT", userValue.getTimeFormat());
		hmResultMap.put("USER_TIMEZONEID", userValue.getTimeZoneId());

		String reqId = "";
		reqId = userValue.getRequestID();
		if (reqId == null)
		{
			reqId = "";
		}
		hmResultMap.put("REQUEST_ID", reqId);
		// Added list of linked currencies data to be used for decimal places formatting bases on currency.
		hmResultMap.put("LINKED_CURR_COL", exportDataValueObject.getLinkedCurrData());

		hmResultMap.put(ExportFwsConstants.WID_BUNDLE_KEY, exportDataValueObject.getBundleKey());
		hmResultMap.put("ADDL_DATA", exportDataValueObject.getExportAdditionalData());
		sFilePath = generateDocument(hmResultMap, listMetaData, sReportID, sUserId);
		logger.ctinfo("CTEXP00013");
		return sFilePath;
	}

	/**
	 * This is an abstract method, will be implemented by the classes which extends this class Returns the path of the
	 * generated file
	 * 
	 * @param hmResultMap HashMap Contains the formatted data
	 * @param aListMetaData ArrayList MetaData List
	 * @param reportID String Report ID
	 * @param userId String User ID
	 * @return path of the file
	 * @throws ExportDataException
	 */
	protected abstract String generateDocument(HashMap hmResultMap, ArrayList aListMetaData, String reportID,
			String userId) throws ExportDataException;

	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(ExportFormatProvider.class);

}
