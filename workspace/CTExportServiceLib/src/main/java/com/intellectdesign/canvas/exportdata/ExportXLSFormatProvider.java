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

import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.pref.amount.AmountFormatterManager;
import com.intellectdesign.canvas.pref.date.DateFormatterManager;
import com.intellectdesign.canvas.properties.MessageManager;
import com.intellectdesign.canvas.reports.Column;
import com.intellectdesign.canvas.reports.ColumnMetaData;
import com.intellectdesign.canvas.reports.generator.ReportUtils;
import com.intellectdesign.canvas.reports.generator.XSLGenerator;
import com.intellectdesign.canvas.utility.CTUtility;
import com.intellectdesign.canvas.value.IUserValue;

/**
 * This class is responsible for formatting the data for XSL Generator
 * 
 * @version 1.0
 */
public class ExportXLSFormatProvider implements IExportFormatProvider
{
	/**
	 * This method formats the data as required by the XSLGenerator Returns the path of the generated file
	 * 
	 * 
	 * @param HashMap Contains the formatted data
	 * @param ArrayList MetaData List
	 * @param String Report ID
	 * @param String User ID
	 * @return path of the file
	 * @throws ExportDataException
	 */
	public String generateDocument(HashMap hmResultMap, ArrayList listMetaData, String reportID, String userId)
			throws ExportDataException
	{
		String sFilePath = null;
		logger.ctinfo("CTEXP00012", "ExportXLSFormatProvider.generateDocument", hmResultMap);
		// Call XSL generator to generate the file.
		XSLGenerator xslGenerator = new XSLGenerator();
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			sFilePath = exportDescriptor.getXslFolderPath() + File.separator + reportID + userId + "_"
					+ CTUtility.getDateTime() + ".xls";
			logger.ctdebug("CTEXP00185", "ExportXLSFormatProvider.generateDocument", hmResultMap, sFilePath);
			xslGenerator.generateXSLDocument(hmResultMap, listMetaData, sFilePath, true);
		} catch (Exception exception)
		{
			logger.cterror("CTEXP00184", exception);
			throw new ExportDataException("Exception occured while generating Excel ", exception);
		}
		logger.ctinfo("CTEXP00013");
		return sFilePath;
	}

	/**
	 * This method formats the data as required by the RTFGenerator Returns the path of the generated file
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
		String langID = null;
		langID = (userValue.getLangId() == null || "".equals(userValue.getLangId())) ? "en_US" : userValue.getLangId(); // Defaul

		logger.ctinfo("CTEXP00014", exportDataValueObject);
		listColumnHeaderValueObject = exportDataValueObject.getColumnHeaders();
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
					if (exportDataValueObject.getExportAdditionalData() != null
							&& exportDataValueObject.getExportAdditionalData().get("MODIFIED_COLUMN_NAMES") != null
							&& ((HashMap) exportDataValueObject.getExportAdditionalData().get("MODIFIED_COLUMN_NAMES"))
									.get(columnHeaderValueObject.getHeaderKey()) != null)
					{
						column.setColumnName((String) ((HashMap) exportDataValueObject.getExportAdditionalData().get(
								"MODIFIED_COLUMN_NAMES")).get(columnHeaderValueObject.getHeaderKey()));
					} else if (null == columnHeaderValueObject.getHeaderDescription()
							|| "".equals(columnHeaderValueObject.getHeaderDescription()))
					{
						column.setColumnName("LBL_" + columnHeaderValueObject.getHeaderKey());
					} else
					{
						column.setColumnName(columnHeaderValueObject.getHeaderDescription());
					}
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
		logger.ctdebug("CTEXP00004", listMetaData);

		// Form ArrayList of String array containing details of a row
		listExportData = exportDataValueObject.getExportData();
		logger.ctdebug("CTEXP00021 ", listExportData);

		if (listExportData != null && !listExportData.isEmpty())
		{
			listData = new ArrayList();
			String amountData = null;

			String amountCol = null;
			String currency = null;
			int keyIndex = 0;
			int valIndex = 0;
			HashMap<String, String> linkedCurrMap = exportDataValueObject.getLinkedCurrData();
			ArrayList<Integer> keyList = new ArrayList<Integer>(); // list of keys for linkedCurrMap
			ArrayList<Integer> valList = new ArrayList<Integer>();// list of values for linkedCurrMap

			if (linkedCurrMap != null && !linkedCurrMap.isEmpty())
			{
				Set mapSet = linkedCurrMap.entrySet();
				Iterator mapIterator = mapSet.iterator();

				// Below code is silly, but no choice.
				while (mapIterator.hasNext())
				{
					Map.Entry mapEntry = (Map.Entry) mapIterator.next();
					amountCol = (String) mapEntry.getKey();
					int amtColIndex = listHeaderKey.indexOf(amountCol);
					int currColIndex = listHeaderKey.indexOf(linkedCurrMap.get(amountCol));
					keyList.add(amtColIndex);
					valList.add(currColIndex);
				}
			}

			sTotalCount = String.valueOf(listExportData.size());
			ArrayList colMetaData = ReportUtils.getColumnMetaData(listMetaData);
			for (int i = 0; i < listExportData.size(); i++)
			{

				HashMap hmDataMap = (HashMap) listExportData.get(i);
				exportData = new String[listHeaderKey.size()];

				for (int j = 0; j < listHeaderKey.size(); j++)
				{
					int count = 0;
					String headerKey = (String) listHeaderKey.get(j);
					ColumnMetaData cmd = (ColumnMetaData) colMetaData.get(j);
					String amtFormat[] = headerKey.split("_");
					for (int k = 0; k < amtFormat.length; k++)
					{
						if (cmd.getColumnType().equals(ColumnMetaData.TYPE_NUMERIC))
						{
							count = 1;
						}

					}
					if (count == 1)
					{
						if (keyList.size() > 0 && valList.size() > 0)
						{
							Iterator<Integer> itrKey = keyList.iterator();
							Iterator<Integer> itrValue = valList.iterator();
							while (itrKey.hasNext() && itrValue.hasNext())
							{
								keyIndex = itrKey.next();
								valIndex = itrValue.next();
								// If the currennt column index is the same as the amount column index,
								// meaning this is the amount to be formatted, then get the currency to
								// be used for formatting the amount.
								if (keyIndex == j)
								{
									currency = (String) hmDataMap.get(listHeaderKey.get(valIndex));
									logger.ctdebug("CTEXP00182", currency);
								}
								if (hmDataMap.get(listHeaderKey.get(j)) instanceof BigDecimal
										|| hmDataMap.get(listHeaderKey.get(j)) instanceof Float)
								{
									amountData = hmDataMap.get(listHeaderKey.get(j)).toString();
								} else
								{
									amountData = (String) hmDataMap.get(listHeaderKey.get(j));
								}

								String exportValue = AmountFormatterManager.convertAmountTo(amountData, userValue.getmAmtFormat(),
										currency);
								if (exportValue == null || exportValue.trim().equals(""))
								{
									exportValue = "- -";
								}
								exportData[j] = exportValue;
							}
						} else
						// for amount columns with no linked currency columns.
						{
							if (hmDataMap.get(listHeaderKey.get(j)) instanceof BigDecimal
									|| hmDataMap.get(listHeaderKey.get(j)) instanceof Float)
							{
								amountData = hmDataMap.get(listHeaderKey.get(j)).toString();
							} else
							{
								amountData = (String) hmDataMap.get(listHeaderKey.get(j));
							}

							String exportValue = AmountFormatterManager.convertAmountTo(amountData, userValue.getmAmtFormat(),
									currency);
							if (exportValue == null || exportValue.trim().equals(""))
							{
								exportValue = "- -";
							}
							exportData[j] = exportValue;

						}
						logger.ctdebug("CTEXP00005", listHeaderKey.get(j), exportData[j]);
					} else
					{

						String exportValue = hmDataMap.get(listHeaderKey.get(j)).toString();
						if (exportValue == null || exportValue.trim().equals(""))
						{
							exportValue = "- -";
						}
						exportData[j] = exportValue;
					}
				}
				listData.add(exportData);
			}
		} else
		{
			logger.cterror("CTEXP00006");
		}

		// Get the file path
		sReportID = exportDataValueObject.getReportId();
		sUserId = userValue.getUserNo();
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
		sFilePath = exportDescriptor.getXslFolderPath() + File.separator + sReportID + sUserId + "_"
				+ CTUtility.getDateTime() + ".xls";
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
			// the
			// report id.
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
		}
		// Form the Data HashMap that needs to be sent to XSL Generator
		hmResultMap.put(ReportingConstants.EZREPORTS_DATA, listData);
		hmResultMap.put(ReportingConstants.GROUP_COL_HEADER_DATA, exportDataValueObject.getGroupColumnHeader());
		hmResultMap.put(ReportingConstants.GROUP_HEADER_REQD, exportDataValueObject.isGroupHeaderReqd());
		hmResultMap.put("REPORT_HEADER", sReportHeader);
		hmResultMap.put("ROWS_PER_CALL", Integer.valueOf("0"));
		hmResultMap.put("CORPORATE_NAME", userValue.getPrimaryCorporate());
		hmResultMap.put("USER_NAME", userValue.getFIRST_NAME());
		hmResultMap.put("LANGUAGE_ID", langID);
		hmResultMap.put(ReportingConstants.EZREPORTS_TOTAL_COUNT, sTotalCount);
		hmResultMap.put("ADDL_DATA", exportDataValueObject.getExportAdditionalData());

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
		logger.ctdebug("CTEXP00185", "ExportXLSFormatProvider.getExportFormat", hmResultMap, sFilePath);
		hmResultMap.put(ExportFwsConstants.WID_BUNDLE_KEY, exportDataValueObject.getBundleKey());

		// Call XSL generator to generate the file.
		XSLGenerator xslGenerator = new XSLGenerator();
		try
		{
			xslGenerator.generateXSLDocument(hmResultMap, listMetaData, sFilePath, true);
		} catch (Exception exception)
		{
			logger.cterror("CTEXP00184", exception);
			throw new ExportDataException("Exception occured while generating Excel", exception);
		}
		logger.ctinfo("CTEXP00013");
		return sFilePath;
	}

	private static final int DEFAULT_AMOUNT_FORMAT_FRACTION_MIN_PRECISION = 3;

	private static final String DEFAULT_AMOUNT_FORMAT = "#,###,###.##";
	private static final String DATA_KEYS_FOR_MASKING = "DATA_KEYS_FOR_MASKING";
	/**
	 * An instance of Logger
	 */
	private static final Logger logger = Logger.getLogger(ExportXLSFormatProvider.class);
}
