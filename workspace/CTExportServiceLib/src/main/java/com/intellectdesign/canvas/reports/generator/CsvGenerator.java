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

package com.intellectdesign.canvas.reports.generator;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;

import com.csvreader.CsvWriter;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.datasource.JavaDataSource;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.reports.ColumnMetaData;
import com.intellectdesign.canvas.reports.SummaryData;

/**
 * This class is used to generate Csv report by help of iText API.
 * 
 * @version 1.0
 */
public class CsvGenerator
{

	/**
	 * This is the entry method to generate HTML report. This method gets columns meta data, then finds detail html
	 * report need to generate or plain report need to generate using columns meta data. Finally calls corresponding
	 * method to get report generation done
	 * 
	 * @param data - this map contains vital info like 1. DATA_PROVIDER_OBJECT(HashMap) (Params HashMap to be passed to
	 *            JavaDataSource). 2. REPORT_HEADER (String) 3. REPORT_FOOTER(String) 4. PAGE_HEADER(String) 5.
	 *            PAGE_FOOTER(String) 6. ROWS_PER_CALL(Integer) 7. REPORT_PARAMS (HashMap) 8. CLASS_NAME(String) - Name
	 *            of the implementation class
	 * @param metaData - List of Column instances, Each instance will have Column Related Details
	 * @param hasData - flag which checks whether data is there or not
	 * @param csvFullPath - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @throws Exception if any while report generation
	 */
	public boolean generateCsvDocument(HashMap data, ArrayList metaData, String csvFullPath, boolean hasData)
			throws Exception
	{
		String cmName = "CsvGenerator:generateCsvDocument";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			logger.ctdebug("CTEXP00043", data, metaData, csvFullPath);
			
			Date currDate = new Date();
			
			GlobalPreferencesUtil gpUtil = new GlobalPreferencesUtil();
			String generatedDate = gpUtil.userPrefFormatDateAndTime(data.get("USER_DATE_FORMAT") + " "+data.get("USER_TIME_FORMAT"),
					data.get("USER_TIMEZONEID").toString(), currDate);
			
			ArrayList colMetaData = ReportUtils.getColumnMetaData(metaData);
			data.put("METADATA", colMetaData);
			data.put("GENERATED_DATE", generatedDate);
			if (!hasData)
			{
				data.put("DATA_PROVIDER_INSTANCE", Class.forName((String) data.get("CLASS_NAME")).newInstance());
				logger.ctdebug("CTEXP00044", data.get("CLASS_NAME"));
			}
			logger.ctdebug("CTEXP00045", colMetaData.size());
			boolean status = generateCsv(data, csvFullPath, hasData);
			logger.ctdebug("CTEXP00046", status);
			return status;
		} catch (Exception exe)
		{
			logger.cterror("CTEXP00038", exe);
			throw exe;
		}
	}

	/**
	 * This method is used to generate html report
	 * 
	 * @param dataMap - this map contains vital info like 1. DATA_PROVIDER_OBJECT(HashMap) (Params HashMap to be passed
	 *            to JavaDataSource). 2. REPORT_HEADER (String) 3. REPORT_FOOTER(String) 4. PAGE_HEADER(String) 5.
	 *            PAGE_FOOTER(String) 6. ROWS_PER_CALL(Integer) 7. REPORT_PARAMS (HashMap) 8. CLASS_NAME(String) - Name
	 *            of the implementation class 9. METADATA(ArrayList) - ColumnMetaData instances 10.
	 *            GENERATED_DATE(String) 11. DATA_PROVIDER_INSTANCE - An instance of the implementation class
	 * @param path - An absolute path, where report should save after generate
	 * @param hasData - flag which checks whether data is there or not
	 * @return - the status of report generation, true if report generated success else false
	 * @throws Exception if any while report generation
	 */
	private boolean generateCsv(HashMap dataMap, String path, boolean hasData) throws Exception
	{
		String cmName = "CsvGenerator:generateCsv";
		logger.ctinfo("CTEXP00026", cmName);

		int dataListSize = 0;
		int rowsPerCall = 0;
		boolean status = false;
		ArrayList dataList = new ArrayList();
		HashMap dataHash = null;
		String totalCount = null;
		JavaDataSource javaSource = null;
		ConfigurationManager confMngr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor expDesc = confMngr.getExportDescriptor();

		boolean searchResultReqd = expDesc.isSearchResultExportReqd();

		HashMap dataSourceParam = null;
		try
		{

			String langID = null;
			if (dataMap.get("LANGUAGE_ID") != null)
			{
				langID = (String) dataMap.get("LANGUAGE_ID");
				logger.ctdebug("CTEXP00047", langID);
			}
			String reportTitle = null;
			if (dataMap.get("REPORT_HEADER") != null)
				reportTitle = (String) dataMap.get("REPORT_HEADER");

			String corpName = null;
			if (dataMap.get("CORPORATE_NAME") != null)
				corpName = (String) dataMap.get("CORPORATE_NAME");
			if (corpName == null)
				corpName = "";
			String userName = null;
			if (dataMap.get("USER_NAME") != null)
				userName = (String) dataMap.get("USER_NAME");

			if (userName == null)
				userName = "";
			reportTitle = ReportsMessageManager.replacePredefined(reportTitle);
			String reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_GEN, langID)
					+ " "
					+ (String)dataMap.get("GENERATED_DATE")
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + (String) dataMap.get("USER_NAME");

			CsvWriter csvwriter = new CsvWriter(path);
			logger.ctdebug("CTEXP00048");
			logger.ctdebug("CTEXP00049", reportTitle);
			csvwriter.write(corpName);
			csvwriter.endRecord();
			logger.ctdebug("CTEXP00050", corpName);
			csvwriter.write(reportTitle);
			csvwriter.endRecord();
			logger.ctdebug("CTEXP00051", reportDate);
			csvwriter.write(reportDate);
			csvwriter.endRecord();
			logger.ctdebug("CTEXP00052");

			if (!hasData)
			{
				// Data Source connectivity
				logger.ctdebug("CTEXP00053", dataMap.get("DATA_PROVIDER_INSTANCE"));
				javaSource = (JavaDataSource) dataMap.get("DATA_PROVIDER_INSTANCE");
				logger.ctdebug("CTEXP00054", dataMap.get("DATA_PROVIDER_OBJECT"));
				dataSourceParam = (HashMap) dataMap.get("DATA_PROVIDER_OBJECT");
				// Rows Per Call

				if (dataMap.get("ROWS_PER_CALL") != null)
					rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();

				dataSourceParam.put("StartRowNumber", new Integer(0));
				dataHash = javaSource.execute(dataSourceParam);

				if (dataHash.get("DATA") != null)
					dataList = (ArrayList) dataHash.get("DATA");

				totalCount = (String) dataHash.get("TOTAL_COUNT");
			} else
			{

				if (dataMap.get("DATA") != null)
					dataList = (ArrayList) dataMap.get("DATA");

				totalCount = (String) dataMap.get("TOTAL_COUNT");
			}
			logger.ctdebug("CTEXP00055", dataList);

			if (dataMap.get("ROWS_PER_CALL") != null)
				rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue(); // Rows Per Call
			if (dataList != null)
				dataListSize = dataList.size();
			else
				dataListSize = 0;

			ArrayList metaDataCol = new ArrayList();
			if (dataMap.get("METADATA") != null)
				metaDataCol = (ArrayList) dataMap.get("METADATA");

			logger.ctdebug("CTEXP00056", metaDataCol);

			String searchResultText = "";
			if (totalCount != null && !totalCount.equals(""))
			{
				logger.ctdebug("CTEXP00057", totalCount);
				if (searchResultReqd)
				{
					searchResultText = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
							ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount;
					logger.ctdebug("CTEXP00058", searchResultText);
					csvwriter.write(searchResultText);
					csvwriter.endRecord();
				}
				logger.ctdebug("CTEXP00194");
			}
			/** Added as part of enhancement For getting next set of records */
			int rowStartCount = 0;
			boolean moreData = false;
			if (dataListSize == (rowsPerCall + 1))
			{
				moreData = true;
			} else
			{
				if (!hasData)
				{
					if (dataHash.get("SUMMARY") != null)
					{
						dataMap.put("SUMMARY", dataHash.get("SUMMARY"));
					}
				}
			}

			int colMetaDataSize = metaDataCol.size();
			// Disp column headings;
			logger.ctdebug("CTEXP00059", colMetaDataSize);
			String[] tableheader = new String[colMetaDataSize];

			logger.ctdebug("CTEXP00060");
			String colTitle = "";
			for (int colCounter = 0; colCounter < colMetaDataSize; colCounter++)
			{
				int i=colCounter;
				if(dataMap.get("DIRECTION").equals("RTL")){
					i=(colMetaDataSize-1)-colCounter;
				}
				ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(i);
				colTitle = ReportsMessageManager.getMessage((String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY),
						"LBL_"+cmd.getColumnTitle(), langID);
				if(colTitle.equals("LBL_"+cmd.getColumnTitle()))
					colTitle=cmd.getColumnTitle();
				tableheader[colCounter] = new String(colTitle);
				logger.ctdebug("CTEXP00061", colTitle);
			}
			logger.ctdebug("CTEXP00062");
			logger.ctdebug("CTEXP00063");
			csvwriter.endRecord();
			csvwriter.writeRecord(tableheader);
			logger.ctdebug("CTEXP00064");
			logger.ctdebug("CTEXP00065");
			for (int dataIndex = 0; dataIndex < dataListSize; dataIndex++)
			{
				String[] rowData = (String[]) dataList.get(dataIndex);
				if(dataMap.get("DIRECTION").equals("RTL")){
					String[] temp = new String[rowData.length];
					int j=0,i;
					for(i=rowData.length-1;i>=0;i--){
						temp[j]=rowData[i];
						j++;
					}
					rowData=temp;
				}
				logger.ctdebug("CTEXP00066", rowData, rowData.length);
				csvwriter.writeRecord(rowData);

				/** Added as part of enhancement For getting next set of records */
				// If moreData is true and dataIndex is dataListSize-2 the get the next set of records
				if (moreData && dataIndex == dataListSize - 2)
				{
					// GET NEXT SET
					rowStartCount += rowsPerCall;

					if (!hasData)
					{
						dataSourceParam.put("StartRowNumber", new Integer(rowStartCount));
						dataHash = javaSource.execute(dataSourceParam);

						if (dataHash.get("DATA") != null)
							dataList = (ArrayList) dataHash.get("DATA");
					}

					// To reset the dataListSize with the new dataList's size
					dataListSize = dataList.size();
					if (dataListSize == (rowsPerCall + 1))
					{
						moreData = true;
					} else
					{
						if (!hasData)
						{
							if (dataHash.get("SUMMARY") != null)
							{
								dataMap.put("SUMMARY", dataHash.get("SUMMARY"));
							}
						}
						moreData = false;
					}
					// RESET
					dataIndex = -1;
				}
			}// END OF FOR
			logger.ctdebug("CTEXP00067");
			csvwriter.endRecord();
			if (!hasData)
			{
				if (dataHash.get("SUMMARY") != null)
				{
					dataMap.put("SUMMARY", dataHash.get("SUMMARY"));
				}
			}

			if (dataMap.containsKey("SUMMARY"))
			{
				logger.ctdebug("CTEXP00068");
				HashMap sumMap = (HashMap) dataMap.get("SUMMARY");
				ArrayList sumList = (ArrayList) sumMap.get("SUMMARY_LIST");
				int sumListLen = 0;
				logger.ctdebug("CTEXP00069", sumMap, sumList);

				if (sumList != null)
				{
					sumListLen = sumList.size();
					if (sumListLen > 0)
					{
						logger.ctdebug("CTEXP00070");
						String summDataTitle = new String(ReportsMessageManager.getMessage(
								ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_SUMM, langID));
						logger.ctdebug("CTEXP00195", summDataTitle);
						csvwriter.write(summDataTitle);
						csvwriter.endRecord();
						for (int iCtr = 0; iCtr < sumListLen; iCtr++)
						{
							SummaryData sumData = (SummaryData) sumList.get(iCtr);
							String strData[] = sumData.getData();
							int strDataSize = strData.length;
							String summDataKey = new String(ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), strData[0], langID));
							logger.ctdebug("CTEXP00071", summDataKey);
							csvwriter.write(summDataKey);
							StringBuffer summary = new StringBuffer();
							for (int j = 1; j < strDataSize; j++)
							{
								summary.append(ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), strData[j], langID)
										+ "      ");
							}
							String summData = new String(summary.toString());
							logger.ctdebug("CTEXP00072", summData);
							csvwriter.write(summData);
							csvwriter.endRecord();
						}
						logger.ctdebug("CTEXP00073");
					}
				}

				HashMap paramsMap = (HashMap) sumMap.get("PARAMS");
				logger.ctdebug("CTEXP00143", paramsMap);
				if (paramsMap != null)
				{
					logger.ctdebug("CTEXP00074");
					Iterator it = paramsMap.keySet().iterator();
					int paramsMapSize = paramsMap.size();
					logger.ctdebug("CTEXP00196", paramsMapSize);
					String summDataCell = "";
					if (it.hasNext())
					{
						summDataCell = new String(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
								ReportingConstants.EZ_SEL_CRIT, langID));
						logger.ctdebug("CTEXP00075", summDataCell);
						csvwriter.write(summDataCell);
						csvwriter.endRecord();
						logger.ctdebug("CTEXP00076");

						logger.ctdebug("CTEXP00077");
						for (int mapIndex = 0; mapIndex < paramsMapSize; mapIndex++)
						{
							String pkey = (String) it.next();
							String value = (String) paramsMap.get(pkey);

							pkey = ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), pkey, langID);
							String prmKey = new String(pkey);
							String prmValue = new String(ReportUtils.nullHandler(value, ""));
							csvwriter.write(prmKey);
							csvwriter.write(prmValue);
							csvwriter.endRecord();
						}
						logger.ctdebug("CTEXP00078");
					}
				}
			}
			logger.ctdebug("CTEXP00079");
			csvwriter.close();
			logger.ctdebug("CTEXP00080");
			status = true;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			status = false;
		}
		logger.ctdebug("CTEXP00081", status);
		logger.ctinfo("CTEXP00027", cmName);
		return status;
	}

	private static final Logger logger = Logger.getLogger(CsvGenerator.class);
}
