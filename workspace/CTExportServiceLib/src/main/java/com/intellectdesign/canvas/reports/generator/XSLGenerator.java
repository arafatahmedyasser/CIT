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

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFFooter;
import org.apache.poi.hssf.usermodel.HSSFPatriarch;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.hssf.util.Region;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.datasource.JavaDataSource;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;
import com.intellectdesign.canvas.preference.GlobalPreferencesUtil;
import com.intellectdesign.canvas.reports.ColumnMetaData;
import com.intellectdesign.canvas.reports.SummaryData;

/**
 * Generates XSL Document
 * 
 * @version 1.0
 */
public class XSLGenerator
{
	private static final Logger logger = Logger.getLogger(XSLGenerator.class);

	// variable to hold the position of the data column in the string[] on which grouping needs to be done
	private int groupByColumnPosition = -1;
	// variable to hold the type(S-Subtotal) of the data column on which aggregate is done for group total
	private String groupByColumnType = ColumnMetaData.TYPE_SUB_TOTAL;
	// the label of the grouped column
	private String groupByColumnTitle = "";
	private HashMap groupTotalsContainer = null;
	private static final String ORG_PDF_FILE_PATH = "ORG_PDF_FILE_PATH";

	/**
	 * Keys in the hashmap. 1. DATA_PROVIDER_OBJECT(HashMap) (Params HashMap to be passed to JavaDataSource). 2.
	 * REPORT_HEADER (String) 3. REPORT_FOOTER(String) 4. PAGE_HEADER(String) 5. PAGE_FOOTER(String) 6.
	 * ROWS_PER_CALL(Integer) 7. REPORT_PARAMS (HashMap) 8. CLASS_NAME(String) - Name of the implementation class
	 */

	/**
	 * The method which generates the XSL Document
	 * 
	 * @param data - Hashmap which contains the data
	 * @param metaData - List of Column instances, Each instance will have Column Related Details
	 * 
	 * @param xslFullPath - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @exception Exception - throws Exception if any while report generation
	 */
	public boolean generateXSLDocument(HashMap data, ArrayList metaData, String xslFullPath) throws Exception
	{
		String cmName = "XSLGenerator:generateXSLDocument";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			logger.ctdebug("CTEXP00170", data, metaData, xslFullPath);

			Date currDate = new Date();
			
			GlobalPreferencesUtil gpUtil = new GlobalPreferencesUtil();
			String generatedDate = gpUtil.userPrefFormatDateAndTime(data.get("USER_DATE_FORMAT") + " "+data.get("USER_TIME_FORMAT"),
					data.get("USER_TIMEZONEID").toString(), currDate);
			
			ArrayList colMetaData = ReportUtils.getColumnMetaData(metaData);
			data.put("METADATA", colMetaData);
			data.put("GENERATED_DATE", generatedDate);
			data.put("DATA_PROVIDER_INSTANCE", Class.forName((String) data.get("CLASS_NAME")).newInstance());

			logger.ctdebug("CTEXP00154", xslFullPath);
			if (colMetaData.size() == 1)
			{
				ColumnMetaData cmd = (ColumnMetaData) colMetaData.get(0);
				if (cmd.getColumnTitle().equalsIgnoreCase("DETAIL"))
				{
					return new DetailXSLGenerator().generateXSL(data, xslFullPath);
				}
			}
			generateXSL(data, xslFullPath);
			return true;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw e;
		}
	}

	/**
	 * The method which generates the XSL
	 * 
	 * @param dataMap - Hashmap which contains the data
	 * 
	 * @param path - An absolute path, where report should save after generate
	 * @exception Exception - throws Exception if any while report generation
	 */

	private void generateXSL(HashMap dataMap, String path) throws Exception
	{
		String cmName = "XSLGenerator:generateXSL";
		logger.ctinfo("CTEXP00026", cmName);
		
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String langID = null;
		if (dataMap.get("LANGUAGE_ID") != null)
		{
			langID = (String) dataMap.get("LANGUAGE_ID");

			logger.ctdebug("CTEXP00047", langID);
		}

		String dateCustomAlignment = configMgr.getCompPrefDescriptor().getDateColumnAlignent();
		String amtCustomAlignment = configMgr.getCompPrefDescriptor().getAmountColumnAlignent();
		String datetimeCustomAlignment = configMgr.getCompPrefDescriptor().getDateTimeColumnAlignent();
		if (langID != null && langID.equalsIgnoreCase("ar_SA"))
		{
			dateCustomAlignment = dateCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			amtCustomAlignment = amtCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			datetimeCustomAlignment = datetimeCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
		}
		String reportTitle = null;
		if (dataMap.get("REPORT_HEADER") != null)
		{
			reportTitle = (String) dataMap.get("REPORT_HEADER");

			reportTitle = ReportsMessageManager.replacePredefined(reportTitle);

			logger.ctdebug("CTEXP00049", reportTitle);
		}

		String reportDate = "";
		if (langID != null)
		{
			reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_GEN,
					langID)
					+ " "
					+ (String)dataMap.get("GENERATED_DATE")
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + (String) dataMap.get("USER_NAME");
			logger.ctdebug("CTEXP00155", langID);
			logger.ctdebug("CTEXP00089", reportDate);

		}

		short rownum = 0;

		ArrayList metaDataCol = new ArrayList();
		if (dataMap.get("METADATA") != null)
		{
			metaDataCol = (ArrayList) dataMap.get("METADATA");
		}

		logger.ctdebug("CTEXP00156", metaDataCol.size());

		// create a new file
		FileOutputStream out = null;
		try
		{
			out = new FileOutputStream(new File(path));

			HSSFWorkbook wb = new HSSFWorkbook();
			HSSFSheet s = wb.createSheet();
			HSSFRow r = null;
			HSSFCell c = null;

			logger.ctdebug("CTEXP00157");

			HSSFCellStyle cs2 = wb.createCellStyle();

			// create 2 fonts objects
			HSSFFont title = wb.createFont();
			HSSFFont data = wb.createFont();
			HSSFFont dataBold = wb.createFont();
			HSSFFont header = wb.createFont();

			title.setFontHeightInPoints((short) 10);
			title.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			title.setColor((short) 9);

			data.setFontHeightInPoints((short) 10);
			data.setColor((short) 8);

			dataBold.setFontHeightInPoints((short) 10);
			dataBold.setColor((short) 8);
			dataBold.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);

			header.setFontHeightInPoints((short) 12);
			header.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
			header.setColor((short) 8);

			for (int i = 0; i < metaDataCol.size(); i++)
			{
				s.setColumnWidth((short) (i + 1), (short) 5100);
				logger.ctdebug("CTEXP00188", (i + 1));
			}

			s.setDisplayGridlines(false);

			Region titleReg = new Region((short) 1, (short) 1, (short) 1, (short) metaDataCol.size());
			s.addMergedRegion(titleReg);
			Region corpReg = new Region((short) 2, (short) 1, (short) 2, (short) metaDataCol.size());
			s.addMergedRegion(corpReg);
			Region reprDtRegion = new Region((short) 3, (short) 1, (short) 3, (short) metaDataCol.size());
			s.addMergedRegion(reprDtRegion);
			// set cell stlye

			// set a thin border
			cs2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			// fill w fg fill color
			cs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			// set the cell format to text see HSSFDataFormat for a full list
			cs2.setDataFormat(HSSFDataFormat.getBuiltinFormat("text"));

			// set the font
			cs2.setFont(data);

			if (langID != null)
			{
				wb.setSheetName(0, ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
						ReportingConstants.EZ_DWNL_TITLE, langID));
			}

			HSSFCellStyle headerCell = wb.createCellStyle();
			headerCell.setFont(header);
			headerCell.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			headerCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle titleCell = wb.createCellStyle();
			titleCell.setFont(title);
			titleCell.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			titleCell.setFillForegroundColor(new HSSFColor.DARK_BLUE().getIndex());

			//Column Direction change
			if (langID != null && langID.equalsIgnoreCase("ar_SA"))
			{
				titleCell.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			}
			else
				titleCell.setAlignment(HSSFCellStyle.ALIGN_LEFT);

			titleCell.setBorderLeft(HSSFCellStyle.BORDER_THICK);
			titleCell.setLeftBorderColor((short) 9);
			titleCell.setBorderRight(HSSFCellStyle.BORDER_THICK);
			titleCell.setRightBorderColor((short) 9);
			titleCell.setBorderTop(HSSFCellStyle.BORDER_THICK);
			titleCell.setTopBorderColor((short) 9);
			titleCell.setBorderBottom(HSSFCellStyle.BORDER_THICK);
			titleCell.setBottomBorderColor((short) 9);
			titleCell.setWrapText(true);
			titleCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCellLeft = wb.createCellStyle();
			dataCellLeft.setFont(data);
			dataCellLeft.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setLeftBorderColor((short) 22);
			dataCellLeft.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setRightBorderColor((short) 22);
			dataCellLeft.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setTopBorderColor((short) 22);
			dataCellLeft.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setBottomBorderColor((short) 22);
			dataCellLeft.setWrapText(true);
			dataCellLeft.setAlignment(HSSFCellStyle.ALIGN_LEFT);
			dataCellLeft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCellRight = wb.createCellStyle();
			dataCellRight.setFont(data);
			dataCellRight.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setLeftBorderColor((short) 22);
			dataCellRight.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setRightBorderColor((short) 22);
			dataCellRight.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setTopBorderColor((short) 22);
			dataCellRight.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setBottomBorderColor((short) 22);
			dataCellRight.setWrapText(true);
			dataCellRight.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			dataCellRight.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCellCenter = wb.createCellStyle();
			dataCellCenter.setFont(data);
			dataCellCenter.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setLeftBorderColor((short) 22);
			dataCellCenter.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setRightBorderColor((short) 22);
			dataCellCenter.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setTopBorderColor((short) 22);
			dataCellCenter.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setBottomBorderColor((short) 22);
			dataCellCenter.setWrapText(true);
			dataCellCenter.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			dataCellCenter.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCell = wb.createCellStyle();
			dataCell.setFont(data);
			dataCell.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setLeftBorderColor((short) 22);
			dataCell.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setRightBorderColor((short) 22);
			dataCell.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setTopBorderColor((short) 22);
			dataCell.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setBottomBorderColor((short) 22);
			dataCell.setWrapText(false);
			dataCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle infoCell = wb.createCellStyle();
			infoCell.setFont(data);
			infoCell.setWrapText(false);
			infoCell.setAlignment(HSSFCellStyle.ALIGN_RIGHT);

			HSSFCellStyle infoCellBold = wb.createCellStyle();
			infoCellBold.setFont(dataBold);
			infoCellBold.setWrapText(false);
			infoCellBold.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle infoCellBoldCenter = wb.createCellStyle();
			infoCellBoldCenter.setFont(dataBold);
			infoCellBoldCenter.setWrapText(false);
			infoCellBoldCenter.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			infoCellBoldCenter.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle infoCellR = wb.createCellStyle();
			infoCellR.setFont(data);
			infoCellR.setWrapText(false);
			infoCellR.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			infoCellR.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			logger.ctdebug("CTEXP00165");

			r = s.createRow(rownum);
			r.setHeight((short) 1200);
			rownum++;


			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			c = r.createCell(1);
			c.setCellStyle(headerCell);

			if (dataMap.get("CORPORATE_NAME") != null)
				c.setCellValue((String) dataMap.get("CORPORATE_NAME"));
			
			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			c = r.createCell(1);
			c.setCellStyle(headerCell);

			if (reportTitle != null)
				c.setCellValue(reportTitle);

			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			c = r.createCell(1);
			c.setCellStyle(infoCell);

			c.setCellValue(reportDate);

			logger.ctdebug("CTEXP00158");

			JavaDataSource javaSource = (JavaDataSource) dataMap.get("DATA_PROVIDER_INSTANCE");
			HashMap dataSourceParam = (HashMap) dataMap.get("DATA_PROVIDER_OBJECT");

			int rowsPerCall = 0;
			if (dataMap.get("ROWS_PER_CALL") != null)
			{
				rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
			}

			dataSourceParam.put("StartRowNumber", new Integer(0));
			HashMap dataHash = javaSource.execute(dataSourceParam);

			ArrayList aList = new ArrayList();
			if (dataHash.get("DATA") != null)
			{
				aList = (ArrayList) dataHash.get("DATA");
			}
			String totalCount = null;
			if (dataHash.get("TOTAL_COUNT") != null)
			{
				totalCount = (String) dataHash.get("TOTAL_COUNT");
			}

			// IDENTIFY GROUP BY COLS.
			for (int iCtr = 0; iCtr < metaDataCol.size(); iCtr++)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(iCtr);
				// Note: the assumption is there will be only one data column on which grouping is done.
				// the subsequent data columns are ignored after first occurence
				if (cmd.getIsGroup())
				{
					setGroupByColumnPosition(iCtr);
					setGroupByColumnType(cmd.getColumnType());
					setGroupByColumnTitle(cmd.getColumnTitle());
					break;
				}
			}
			logger.ctdebug("CTEXP00093");

			if (totalCount != null && !"".equals(totalCount))
			{
				r = s.createRow(rownum);
				rownum++;
				r.setHeight((short) 350);
				c = r.createCell(1);
				c.setCellStyle(infoCell);

				if (langID != null)
				{
					c.setCellValue(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
							ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount);
				}

				logger.ctdebug("CTEXP00057", totalCount);
			}

			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);

			// ALL HEADINGS
			logger.ctdebug("CTEXP00095");
			String colTitle = "";
			int colIndex = 0;
			for (int i = 0; i < metaDataCol.size(); i++)
			{
				if (getGroupByColumnPosition() != i)
				{
					ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(i);

					if (langID != null)
					{

						colTitle = ReportsMessageManager.getMessage(
								(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), "LBL_"+cmd.getColumnTitle(), langID);
						
						if(colTitle.equals("LBL_"+cmd.getColumnTitle()))
							colTitle=cmd.getColumnTitle();
					}

					c = r.createCell(++colIndex);
					c.setCellStyle(titleCell);

					c.setCellValue(colTitle);

				}
			}
			logger.ctdebug("CTEXP00096");

			groupTotalsContainer = new HashMap();

			// holds the previous record's data column value
			String prevValue = "";
			// holds the current record data column value
			String currValue = "";

			int rowStartCount = 0;
			boolean nextSet = false;
			boolean moreData = false;
			if (aList.size() == (rowsPerCall + 1))
			{
				moreData = true;
			} else
			{
				if (dataHash.get("SUMMARY") != null)
				{
					dataMap.put("SUMMARY", dataHash.get("SUMMARY"));
				}
			}

			logger.ctdebug("CTEXP00097");
			for (int iCtr = 0; iCtr < aList.size(); iCtr++)
			{
				colIndex = 0;

				String[] rowData = (String[]) aList.get(iCtr);
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					currValue = rowData[getGroupByColumnPosition()];
					// if the previous value and the current value are not same
					// then the end of that group is reached. Dump the group footer and start the new group

					if (langID != null)
					{
						if (!currValue.equals(prevValue))
						{
							if (iCtr == 0 && !nextSet)
							{
								// GROUP HEADER
								r = s.createRow(rownum);
								r.setHeight((short) 350);
								rownum++;
								c = r.createCell(1);
								c.setCellStyle(infoCellBold);

								c.setCellValue(ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY),
										"LBL_"+getGroupByColumnTitle(), langID) + "  :  " + currValue);

							} else
							{
								// GROUP FOOTER
								r = s.createRow(rownum);
								r.setHeight((short) 350);
								rownum++;
								renderGroupFooter(r, dataMap, infoCellBoldCenter, langID);

								// GROUP HEADER
								r = s.createRow(rownum);
								r.setHeight((short) 350);
								rownum++;
								c = r.createCell(1);
								c.setCellStyle(infoCellBold);

								c.setCellValue(ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY),
										"LBL_"+getGroupByColumnTitle(), langID) + "  :  " + currValue);

							}
							prevValue = currValue;
						}

					}
				}
				r = s.createRow(rownum);
		//		r.setHeight((short) 350);
				rownum++;
				for (int iColumnCtr = 0; iColumnCtr < metaDataCol.size(); iColumnCtr++)
				{
					if (getGroupByColumnPosition() != iColumnCtr)
					{

						c = r.createCell(++colIndex);

						ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(iColumnCtr);
						String colType = cmd.getColumnType();
					if (colType.equals(ColumnMetaData.TYPE_NUMERIC))
					{
						if(amtCustomAlignment!=null && "LEFT".equalsIgnoreCase(amtCustomAlignment)){
							c.setCellStyle(dataCellLeft);
						}else if(amtCustomAlignment!=null && "CENTER".equalsIgnoreCase(amtCustomAlignment)){
							c.setCellStyle(dataCellCenter);
						}else{
							c.setCellStyle(dataCellRight);
						}
					}
					else if (colType.equals(ColumnMetaData.TYPE_ALPHANUMERIC_R))
					{
						c.setCellStyle(dataCellRight);
					}
					else if (colType.equals(ColumnMetaData.TYPE_DATE))
					{
						if(dateCustomAlignment!=null && "LEFT".equalsIgnoreCase(dateCustomAlignment)){
							c.setCellStyle(dataCellLeft);
						}else if(dateCustomAlignment!=null && "CENTER".equalsIgnoreCase(dateCustomAlignment)){
							c.setCellStyle(dataCellCenter);
						}else{
							c.setCellStyle(dataCellRight);
						}
					}
					else if (colType.equals(ColumnMetaData.TYPE_DATE_TIME))
					{
						if(datetimeCustomAlignment!=null && "LEFT".equalsIgnoreCase(datetimeCustomAlignment)){
							c.setCellStyle(dataCellLeft);
						}else if(datetimeCustomAlignment!=null && "CENTER".equalsIgnoreCase(datetimeCustomAlignment)){
							c.setCellStyle(dataCellCenter);
						}else{
							c.setCellStyle(dataCellRight);
						}
					}
					else if (colType.equals(ColumnMetaData.TYPE_SUB_TOTAL))
					{
						c.setCellStyle(dataCellRight);
					}
					else
					{
						if (langID != null && langID.equalsIgnoreCase("ar_SA"))
						{
							c.setCellStyle(dataCellRight);
						}
						else
							c.setCellStyle(dataCellLeft);
					}
					

						c.setCellValue(rowData[iColumnCtr]);

					}
				}
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					// Bugfix for wrong sub total.
					if (!(moreData && iCtr == aList.size() - 2))
					{
						// update the datacolumn values to the container so that the group totals
						// can be displayed in the group footer.
						updateGroupTotals(dataMap, rowData);
						if (iCtr == aList.size() - 1)
						{
							r = s.createRow(rownum);
							r.setHeight((short) 350);
							rownum++;

							if (langID != null)
								renderGroupFooter(r, dataMap, infoCellBold, langID);

						}
					}
				}
				if (moreData && iCtr == aList.size() - 2)
				{
					// GET NEXT SET
					rowStartCount += rowsPerCall;
					dataSourceParam.put("StartRowNumber", new Integer(rowStartCount));
					dataHash = javaSource.execute(dataSourceParam);

					if (dataHash.get("DATA") != null)
					{
						if (dataHash.get("DATA") != null)
							aList = (ArrayList) dataHash.get("DATA");
						if (aList.size() == (rowsPerCall + 1))
						{
							moreData = true;
						} else
						{
							if (dataHash.get("SUMMARY") != null)
							{
								dataMap.put("SUMMARY", dataHash.get("SUMMARY"));
							}
							moreData = false;
						}
					}

					// RESET
					iCtr = -1;
					nextSet = true;
				}

			}// END OF FOR
			logger.ctdebug("CTEXP00098");

			r = s.createRow(rownum);
			rownum++;

			if (dataMap.containsKey("SUMMARY"))
			{
				HashMap sumMap = (HashMap) dataMap.get("SUMMARY");
				ArrayList sumList = (ArrayList) sumMap.get("SUMMARY_LIST");
				logger.ctdebug("CTEXP00100");

				if (sumList != null)
				{
					r = s.createRow(rownum);
					r.setHeight((short) 350);
					rownum++;
					c = r.createCell(1);
					c.setCellStyle(infoCellBold);

					if (langID != null)
					{
						c.setCellValue(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
								ReportingConstants.EZ_REP_SUMM, langID));
					}

					logger.ctdebug("CTEXP00101");
					for (int iCtr = 0; iCtr < sumList.size(); iCtr++)
					{
						r = s.createRow(rownum);
						r.setHeight((short) 350);
						rownum++;
						c = r.createCell(1);
						c.setCellStyle(infoCell);

						SummaryData sumData = (SummaryData) sumList.get(iCtr);
						String strData[] = sumData.getData();
						StringBuffer summaryString = new StringBuffer();
						for (int j = 0; j < strData.length; j++)
						{

							if (langID != null)
							{

								summaryString.append(ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), strData[j], langID)
										+ "   ");
							}

						}
						c.setCellValue(summaryString.toString());
					}
					logger.ctdebug("CTEXP00102");
				}

				java.util.HashMap paramsMap = (java.util.HashMap) sumMap.get("PARAMS");

				if (paramsMap != null)
				{
					logger.ctdebug("CTEXP00103");
					java.util.Iterator it = paramsMap.keySet().iterator();
					r = s.createRow(rownum);
					r.setHeight((short) 350);
					rownum++;

					if (it.hasNext())
					{
						r = s.createRow(rownum);
						r.setHeight((short) 350);
						rownum++;
						c = r.createCell(1);
						c.setCellStyle(infoCellBold);

						if (langID != null)
						{
							c.setCellValue(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
									ReportingConstants.EZ_SEL_CRIT, langID));
						}

					}

					while (it.hasNext())
					{
						r = s.createRow(rownum);
						r.setHeight((short) 350);
						rownum++;
						c = r.createCell(1);
						c.setCellStyle(infoCell);

						String pkey = (String) it.next();
						String value = (String) paramsMap.get(pkey);

						if (langID != null)
						{

							pkey = ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), pkey, langID);

						}

						c.setCellValue(pkey + "  :  " + value);
					}
					logger.ctdebug("CTEXP00104");
				}
			}

			logger.ctdebug("CTEXP00159");
			HSSFFooter footer = s.getFooter();

			if (langID != null)
			{
				footer.setRight(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
						ReportingConstants.EZ_PAGE_F, langID)
						+ " "
						+ HSSFFooter.page()
						+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_OF,
								langID) + HSSFFooter.numPages());
			}

			s.setAutobreaks(true);
			wb.write(out);
		} finally
		{
			if (out != null)
				out.close();
		}
		logger.ctdebug("CTEXP00160");
	}

	/**
	 * This method is used check group total count in column meta data and to put the same in
	 * groupTotalsContainer(insatance varibale) hash map.
	 * 
	 * @param hMap - From where list of columns METADATA would get
	 * @param rowData - String array of row data
	 * @exception - throws Exception
	 */

	private void updateGroupTotals(HashMap hMap, String[] rowData) throws Exception
	{
		String cmName = "XSLGenerator:updateGroupTotals";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{

			ArrayList metaDataColl = new ArrayList();
			if (hMap.get("METADATA") != null)
				metaDataColl = (ArrayList) hMap.get("METADATA");

			for (int iCtr = 0; iCtr < metaDataColl.size(); iCtr++)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iCtr);
				if (cmd.getColumnType().equals(ColumnMetaData.TYPE_SUB_TOTAL))
				{
					// if the data column does not exist in the container create one.
					if (groupTotalsContainer.containsKey(cmd.getColumnTitle()) == false)
					{
						groupTotalsContainer.put(cmd.getColumnTitle(), new Double(0));
					}
					groupTotalsContainer.put(
							cmd.getColumnTitle(),
							new Double(((Double) groupTotalsContainer.get(cmd.getColumnTitle())).doubleValue()
									+ Double.parseDouble(rowData[iCtr])));
				}
			}
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * method that sets GroupByColumnPosition
	 * 
	 * @param iVal GroupByColumnPosition to set
	 */

	public void setGroupByColumnPosition(int iVal)
	{
		this.groupByColumnPosition = iVal;
	}

	/**
	 * method that gets GroupByColumnPosition
	 * 
	 * @return Returns the GroupByColumnPosition
	 */

	public int getGroupByColumnPosition()
	{
		return this.groupByColumnPosition;
	}

	/**
	 * method that sets GroupByColumnType
	 * 
	 * @param sValue GroupByColumnType to set
	 */

	public void setGroupByColumnType(String sValue)
	{
		this.groupByColumnType = sValue;
	}

	/**
	 * method that gets GroupByColumnType
	 * 
	 * @return Returns the GroupByColumnType
	 */

	public String getGroupByColumnType()
	{
		return this.groupByColumnType;
	}

	/**
	 * method that sets GroupByColumnTitle
	 * 
	 * @param sValue GroupByColumnTitle to set
	 */

	public void setGroupByColumnTitle(String sValue)
	{
		this.groupByColumnTitle = sValue;
	}

	/**
	 * method that gets GroupByColumnTitle
	 * 
	 * @return Returns the GroupByColumnTitle
	 */

	public String getGroupByColumnTitle()
	{
		return this.groupByColumnTitle;
	}

	/**
	 * API to render the group footer of the document.
	 * 
	 * @param: HashMap hMap: Hash map that contains all the data and the user related imformation.
	 * @param: r
	 * @param: dataCell
	 * @param: langID
	 * @return: None
	 * @throws Exception
	 * */

	private void renderGroupFooter(HSSFRow r, HashMap hMap, HSSFCellStyle dataCell, String langID) throws Exception
	{
		String cmName = "XSLGenerator:renderGroupFooter";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			int colIndex = 0;
			ArrayList metaDataColl = (ArrayList) hMap.get("METADATA");

			for (int iCtr = 0; iCtr < metaDataColl.size(); iCtr++)
			{
				if (getGroupByColumnPosition() != iCtr)
				{
					ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iCtr);
					if (groupTotalsContainer.containsKey(cmd.getColumnTitle()) == true)
					{
						HSSFCell c = r.createCell(++colIndex);
						c.setCellStyle(dataCell);

						c.setCellValue("" + ((Double) groupTotalsContainer.get(cmd.getColumnTitle())).doubleValue());
						// reinitialize the containers to hold the running totals of the next group
						groupTotalsContainer.put(cmd.getColumnTitle(), new Double(0));
					} else
					{
						HSSFCell c = r.createCell(1 + iCtr);
						c.setCellStyle(dataCell);

						c.setCellValue("");
					}
				}
			}
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * API to load the picture in the workbook.
	 * 
	 * @param: imgpath Path from where the image will be taken
	 * @param: wb HSSFWorkbook to which the image will be loaded
	 * @return int pictureIndex
	 * @throws IOException
	 * */

	private int loadPicture(String imgpath, HSSFWorkbook wb) throws IOException
	{
		int pictureIndex;
		FileInputStream fis = null;
		ByteArrayOutputStream bos = null;
		try
		{
			fis = new FileInputStream(imgpath);
			bos = new ByteArrayOutputStream();
			int c;
			while ((c = fis.read()) != -1)
				bos.write(c);
			pictureIndex = wb.addPicture(bos.toByteArray(), HSSFWorkbook.PICTURE_TYPE_JPEG);
		} finally
		{
			if (fis != null)
				fis.close();
			if (bos != null)
				bos.close();
		}
		return pictureIndex;
	}

	/**
	 * The method which generates the XSL Document
	 * 
	 * @param data - Hashmap which contains the data
	 * @param metaData - List of Column instances, Each instance will have Column Related Details
	 * @param hasData - flag which checks whether data is there or not
	 * @param xslFullPath - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @exception Exception - throws Exception if any while report generation
	 */
	public boolean generateXSLDocument(HashMap data, ArrayList metaData, String xslFullPath, boolean hasData)
			throws Exception
	{
		String cmName = "XSLGenerator:generateXSLDocument";
		logger.ctinfo("CTEXP00026", cmName);
		
		Date currDate = new Date();
		
		GlobalPreferencesUtil gpUtil = new GlobalPreferencesUtil();
		String generatedDate = gpUtil.userPrefFormatDateAndTime(data.get("USER_DATE_FORMAT") + " "+data.get("USER_TIME_FORMAT"),
				data.get("USER_TIMEZONEID").toString(), currDate);
		
		if (!hasData)
		{
			return generateXSLDocument(data, metaData, xslFullPath);
		} else
		{
			try
			{
				logger.ctdebug("CTEXP00170", data, metaData, xslFullPath);
				ArrayList colMetaData = ReportUtils.getColumnMetaData(metaData);
				data.put("METADATA", colMetaData);
				data.put("GENERATED_DATE", generatedDate);
				logger.ctdebug("CTEXP00154", xslFullPath);
				if (colMetaData.size() == 1)
				{
					ColumnMetaData cmd = (ColumnMetaData) colMetaData.get(0);
					if (cmd.getColumnTitle().equalsIgnoreCase("DETAIL"))
					{
						return new DetailXSLGenerator().generateXSL(data, xslFullPath);
					}
				}
				generateXL(data, xslFullPath);
				return true;
			} catch (Exception e)
			{
				logger.cterror("CTEXP00038", e);
				throw e;
			}
		}
	}

	/**
	 * The method which generates the XSL
	 * 
	 * @param dataMap - Hashmap which contains the data
	 * 
	 * @param path - An absolute path, where report should save after generate
	 * @exception Exception - throws Exception if any while report generation
	 */

	private void generateXL(HashMap dataMap, String path) throws Exception
	{
		String cmName = "XSLGenerator:generateXL";
		logger.ctinfo("CTEXP00026", cmName);

		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
		String langID = null;
		if (dataMap.get("LANGUAGE_ID") != null)
			langID = (String) dataMap.get("LANGUAGE_ID");

		logger.ctdebug("CTEXP00047", langID);

		ConfigurationManager confMngr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor expDesc = confMngr.getExportDescriptor();
		String xlsImagePath = expDesc.getOrgPDFPath();

		boolean searchResultReqd = expDesc.isSearchResultExportReqd();
		String dateCustomAlignment = configMgr.getCompPrefDescriptor().getDateColumnAlignent();
		String amtCustomAlignment = configMgr.getCompPrefDescriptor().getAmountColumnAlignent();
		String datetimeCustomAlignment = configMgr.getCompPrefDescriptor().getDateTimeColumnAlignent();
		if (langID != null && langID.equalsIgnoreCase("ar_SA"))
		{
			dateCustomAlignment = dateCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			amtCustomAlignment = amtCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			datetimeCustomAlignment = datetimeCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
		}
		String reportTitle = null;
		if (dataMap.get("REPORT_HEADER") != null)
		{
			reportTitle = (String) dataMap.get("REPORT_HEADER");
			reportTitle = ReportsMessageManager.replacePredefined(reportTitle);

			logger.ctdebug("CTEXP00049", reportTitle);
		}

		String reportDate = null;
		if (langID != null)
		{
			reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_GEN,
					langID)
					+ " "
					+ (String)dataMap.get("GENERATED_DATE")
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + (String) dataMap.get("USER_NAME");
			logger.ctdebug("CTEXP00155", langID);
			logger.ctdebug("CTEXP00089", reportDate);
		}

		short rownum = 0;

		ArrayList metaDataCol = new ArrayList();
		if (dataMap.get("METADATA") != null)
			metaDataCol = (ArrayList) dataMap.get("METADATA");

		logger.ctdebug("CTEXP00156", metaDataCol.size());

		String reqID = null;
		if (dataMap.get("REQUEST_ID") != null)
		{
			reqID = (String) dataMap.get("REQUEST_ID");
		}

		FileOutputStream out = null;
		try
		{
			out = new FileOutputStream(new File(path));
			HSSFWorkbook wb = new HSSFWorkbook();
			HSSFSheet s = wb.createSheet();
			HSSFRow r = null;
			HSSFCell c = null;

			/**
			 * For the ar_SA language, the worksheet rendering direction is set to RTL mode by using HSSFSheet class
			 * setRightToLeft(true) method. This changes applicable from poi3.6 jar upgrade
			 */
			if (langID != null && langID.equalsIgnoreCase("ar_SA"))
			{
				// Sets whether the worksheet is displayed from right to left instead of from left to right.
				s.setRightToLeft(true);
				logger.ctdebug("CTEXP00162", s.isRightToLeft());
			}

			HSSFPatriarch patriarch = s.createDrawingPatriarch();
			HSSFClientAnchor anchor = new HSSFClientAnchor(2, 5, 32, 5, (short) 0, 0, (short) 2, 1);

			anchor.setAnchorType(3);
			patriarch.createPicture(anchor, loadPicture(exportDescriptor.getIntellectLogo(), wb)); // Export_Label
																									// Configuration

			// Load the chart image in the excel while exporting.
			if (!"XLS".equals(dataMap.get("EXPORTFORMAT"))
					&& ExportFwsConstants.VECTORXLS.equals(dataMap.get("EXPORTFORMAT")) && reqID != null
					&& !reqID.isEmpty())
			{
				HSSFClientAnchor anchorChart = new HSSFClientAnchor(2, 5, 32, 5, (short) 1, 7, (short) 3, 40);
				anchorChart.setAnchorType(3);
				patriarch.createPicture(anchorChart, loadPicture(xlsImagePath + File.separator + reqID + ".png", wb));
			}

			logger.ctdebug("CTEXP00163");

			HSSFCellStyle cs2 = wb.createCellStyle();

			// create 2 fonts objects
			HSSFFont title = wb.createFont();
			HSSFFont data = wb.createFont();
			HSSFFont dataBold = wb.createFont();
			HSSFFont header = wb.createFont();

			title.setFontHeightInPoints((short) 10);
			title.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			title.setColor((short) 9);

			data.setFontHeightInPoints((short) 10);
			data.setColor((short) 8);

			dataBold.setFontHeightInPoints((short) 10);
			dataBold.setColor((short) 8);
			dataBold.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);

			header.setFontHeightInPoints((short) 12);
			header.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
			header.setColor((short) 8);

			for (int i = 0; i < metaDataCol.size(); i++)
			{
				s.setColumnWidth((short) (i + 1), (short) 8500);
				logger.ctdebug("CTEXP00164", (i + 1));
			}

			s.setDisplayGridlines(false);

			Region titleReg = new Region((short) 1, (short) 1, (short) 1, (short) metaDataCol.size());
			s.addMergedRegion(titleReg);
			Region corpReg = new Region((short) 2, (short) 1, (short) 2, (short) metaDataCol.size());
			s.addMergedRegion(corpReg);
			Region reprDtRegion = new Region((short) 3, (short) 1, (short) 3, (short) metaDataCol.size());
			s.addMergedRegion(reprDtRegion);
			// set cell stlye

			// set a thin border
			cs2.setBorderBottom(cs2.BORDER_THIN);
			// fill w fg fill color
			cs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			// set the cell format to text see HSSFDataFormat for a full list
			cs2.setDataFormat(HSSFDataFormat.getBuiltinFormat("text"));

			// set the font
			cs2.setFont(data);

			// set the sheet name in Unicode
			String sSheetName = (String) dataMap.get("REPORT_HEADER");

			HSSFCellStyle headerCell = wb.createCellStyle();
			headerCell.setFont(header);
			headerCell.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			headerCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle titleCell = wb.createCellStyle();
			titleCell.setFont(title);
			titleCell.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			titleCell.setFillForegroundColor(new HSSFColor.DARK_BLUE().getIndex());

			//Column Direction change
			if (langID != null && langID.equalsIgnoreCase("ar_SA"))
			{
				titleCell.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			}
			else
				titleCell.setAlignment(HSSFCellStyle.ALIGN_LEFT);

			titleCell.setBorderLeft(HSSFCellStyle.BORDER_THICK);
			titleCell.setLeftBorderColor((short) 9);
			titleCell.setBorderRight(HSSFCellStyle.BORDER_THICK);
			titleCell.setRightBorderColor((short) 9);
			titleCell.setBorderTop(HSSFCellStyle.BORDER_THICK);
			titleCell.setTopBorderColor((short) 9);
			titleCell.setBorderBottom(HSSFCellStyle.BORDER_THICK);
			titleCell.setBottomBorderColor((short) 9);
			titleCell.setWrapText(true);
			titleCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCellLeft = wb.createCellStyle();
			dataCellLeft.setFont(data);
			dataCellLeft.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setLeftBorderColor((short) 22);
			dataCellLeft.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setRightBorderColor((short) 22);
			dataCellLeft.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setTopBorderColor((short) 22);
			dataCellLeft.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCellLeft.setBottomBorderColor((short) 22);
			dataCellLeft.setWrapText(true);
			dataCellLeft.setAlignment(HSSFCellStyle.ALIGN_LEFT);
			dataCellLeft.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCellRight = wb.createCellStyle();
			dataCellRight.setFont(data);
			dataCellRight.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setLeftBorderColor((short) 22);
			dataCellRight.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setRightBorderColor((short) 22);
			dataCellRight.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setTopBorderColor((short) 22);
			dataCellRight.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCellRight.setBottomBorderColor((short) 22);
			dataCellRight.setWrapText(true);
			dataCellRight.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			dataCellRight.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCellCenter = wb.createCellStyle();
			dataCellCenter.setFont(data);
			dataCellCenter.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setLeftBorderColor((short) 22);
			dataCellCenter.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setRightBorderColor((short) 22);
			dataCellCenter.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setTopBorderColor((short) 22);
			dataCellCenter.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCellCenter.setBottomBorderColor((short) 22);
			dataCellCenter.setWrapText(true);
			dataCellCenter.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			dataCellCenter.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCell = wb.createCellStyle();
			dataCell.setFont(data);
			dataCell.setBorderLeft(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setLeftBorderColor((short) 22);
			dataCell.setBorderRight(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setRightBorderColor((short) 22);
			dataCell.setBorderTop(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setTopBorderColor((short) 22);
			dataCell.setBorderBottom(HSSFCellStyle.BORDER_MEDIUM);
			dataCell.setBottomBorderColor((short) 22);
			dataCell.setWrapText(false);
			dataCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle infoCell = wb.createCellStyle();
			infoCell.setFont(data);
			infoCell.setWrapText(false);
			infoCell.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			HSSFCellStyle infoCellLeft = wb.createCellStyle();
			infoCellLeft.setFont(data);
			infoCellLeft.setWrapText(false);
			infoCellLeft.setAlignment(HSSFCellStyle.ALIGN_LEFT);

			HSSFCellStyle infoCellBold = wb.createCellStyle();
			infoCellBold.setFont(dataBold);
			infoCellBold.setWrapText(false);
			infoCellBold.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle infoCellBoldCenter = wb.createCellStyle();
			infoCellBoldCenter.setFont(dataBold);
			infoCellBoldCenter.setWrapText(false);
			infoCellBoldCenter.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			infoCellBoldCenter.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle infoCellR = wb.createCellStyle();
			infoCellR.setFont(data);
			infoCellR.setWrapText(false);
			infoCellR.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			infoCellR.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			logger.ctdebug("CTEXP00165");

			r = s.createRow(rownum);
			r.setHeight((short) 1200);
			rownum++;
			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			c = r.createCell((1));
			c.setCellStyle(headerCell);

			if (dataMap.get("CORPORATE_NAME") != null)
				c.setCellValue((String) dataMap.get("CORPORATE_NAME"));
			
			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			c = r.createCell((1));
			c.setCellStyle(headerCell);

			if (reportTitle != null)
				c.setCellValue(reportTitle);

			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			c = r.createCell((1));
			if (langID != null && langID.equalsIgnoreCase("ar_SA"))
			{
				c.setCellStyle(infoCellLeft);
			}
			else{
				c.setCellStyle(infoCell);
			}

			c.setCellValue(reportDate);

			logger.ctdebug("CTEXP00158");

			int rowsPerCall = 0;
			ArrayList aList = new ArrayList();
			String totalCount = null;
			if (dataMap.get("ROWS_PER_CALL") != null)
			{
				rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
			}

			if (dataMap.get("DATA") != null)
			{
				aList = (ArrayList) dataMap.get("DATA");
			}
			if (dataMap.get("TOTAL_COUNT") != null)
			{
				totalCount = (String) dataMap.get("TOTAL_COUNT");
			}

			for (int iCtr = 0; iCtr < metaDataCol.size(); iCtr++)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(iCtr);
				// Note: the assumption is there will be only one data column on which grouping is done.
				// the subsequent data columns are ignored after first occurrance
				if (cmd.getIsGroup())
				{
					setGroupByColumnPosition(iCtr);
					setGroupByColumnType(cmd.getColumnType());
					setGroupByColumnTitle(cmd.getColumnTitle());
					break;
				}
			}
			logger.ctdebug("CTEXP00093");

			if (dataMap.get("EXPORTFORMAT") != null)
			{
				if ("XLS".equals(dataMap.get("EXPORTFORMAT")))
				{
					if (totalCount != null && !"".equals(totalCount))
					{
						if (searchResultReqd)
						{
							r = s.createRow(rownum);
							rownum++;
							r.setHeight((short) 350);
							c = r.createCell((metaDataCol.size()));
							if (langID != null && langID.equalsIgnoreCase("ar_SA"))
							{
								c.setCellStyle(infoCellLeft);
							}
							else{
								c.setCellStyle(infoCell);
							}

							c.setCellValue(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
									ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount);
							logger.ctdebug("CTEXP00057", totalCount);
						}
					}
				}
				if (!"XLS".equals(dataMap.get("EXPORTFORMAT")))
				{
					rownum = (short) 30;
				}
			}

			String colTitle = "";
			int colIndex = 0, childColIndex = 0;

			if (dataMap.get("GROUP_HEADER_REQD") != null)
			{

				if ((Boolean) dataMap.get("GROUP_HEADER_REQD"))
				{
					r = s.createRow(rownum);
					rownum++;
					r.setHeight((short) 500);
					ArrayList arrGroupColList = (ArrayList) dataMap.get("GROUP_COL_HEADER_DATA");
					ArrayList tempChildList = new ArrayList();
					for (int i = 0; i < arrGroupColList.size(); i++)
					{
						if (arrGroupColList.get(i) instanceof Map)
						{
							Map tempGrpHdrMap = (Map) arrGroupColList.get(i);
							Iterator it = tempGrpHdrMap.entrySet().iterator();
							while (it.hasNext())
							{
								Map.Entry grpHeader = (Map.Entry) it.next();
								tempChildList = (ArrayList) grpHeader.getValue();

								colTitle = ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), "LBL_"
												+ (String) grpHeader.getKey(), langID);
								if(colTitle.equals("LBL_"+(String) grpHeader.getKey()))
									colTitle=(String) grpHeader.getKey();
								
								c = r.createCell((++colIndex), 1);
								childColIndex = colIndex - 1;
								c.setCellStyle(titleCell);
								c.setCellValue(colTitle);
								s.addMergedRegion(new CellRangeAddress(rownum - 1, rownum - 1, colIndex, childColIndex
										+ tempChildList.size()));
								colIndex += tempChildList.size();
								colIndex = colIndex - 1;
							}
						} else
						{

							colTitle = ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), "LBL_"
											+ (String) arrGroupColList.get(i), langID);
							
							if(colTitle.equals("LBL_"+(String) arrGroupColList.get(i)))
								colTitle=(String) arrGroupColList.get(i);
							
							c = r.createCell((++colIndex), 1);
							c.setCellStyle(titleCell);
							c.setCellValue(colTitle);
							s.addMergedRegion(new CellRangeAddress(rownum - 1, rownum, colIndex, colIndex));
						}
					}
					r = s.createRow(rownum);
					rownum++;
					r.setHeight((short) 500);
					for (int i = 0; i < tempChildList.size(); i++)
					{

						colTitle = ReportsMessageManager.getMessage(
								(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), "LBL_"
										+ (String) tempChildList.get(i), langID);
						
						if(colTitle.equals("LBL_"+ (String) tempChildList.get(i)))
							colTitle= (String) tempChildList.get(i);
						
						c = r.createCell((++childColIndex), 1);
						c.setCellStyle(titleCell);
						c.setCellValue(colTitle);

					}

				}

				else
				{

					r = s.createRow(rownum);
					rownum++;
					r.setHeight((short) 500);
					// ALL HEADINGS
					logger.ctdebug("CTEXP00095");

					colIndex = 0;
					for (int i = 0; i < metaDataCol.size(); i++)
					{
						if (getGroupByColumnPosition() != i)
						{
							ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(i);

							colTitle = ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), "LBL_"+cmd.getColumnTitle(),
									langID);
							
							if(colTitle.equals("LBL_"+cmd.getColumnTitle()))
								colTitle=cmd.getColumnTitle();

							c = r.createCell((++colIndex));
							c.setCellStyle(titleCell);

							c.setCellValue(colTitle);

						}
					}
				}
				logger.ctdebug("CTEXP00096");
			}

			groupTotalsContainer = new HashMap();
			String prevValue = "";
			String currValue = "";
			int rowStartCount = 0;
			boolean nextSet = false;
			boolean moreData = false;
			if (aList.size() == (rowsPerCall + 1))
			{
				moreData = true;
			}

			logger.ctdebug("CTEXP00097");
			logger.ctdebug("CTEXP00166", aList.size());
			for (int iCtr = 0; iCtr < aList.size(); iCtr++)
			{
				colIndex = 0;

				String[] rowData = (String[]) aList.get(iCtr);
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					currValue = rowData[getGroupByColumnPosition()];
					// if the previous value and the current value are not same
					// then the end of that group is reached. Dump the group footer and start the new group
					if (!currValue.equals(prevValue))
					{
						if (iCtr == 0 && !nextSet)
						{
							// GROUP HEADER
							r = s.createRow(rownum);
							r.setHeight((short) 350);
							rownum++;
							c = r.createCell((1));
							c.setCellStyle(infoCellBold);

							if (langID != null)
							{

								c.setCellValue(ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY),
										"LBL_"+getGroupByColumnTitle(), langID) + "  :  " + currValue);
							}

						} else
						{
							// GROUP FOOTER
							r = s.createRow(rownum);
							r.setHeight((short) 350);
							rownum++;

							if (langID != null)
							{
								renderGroupFooter(r, dataMap, infoCellBoldCenter, langID);
							}

							r = s.createRow(rownum);
							r.setHeight((short) 350);
							rownum++;
							c = r.createCell((1));
							c.setCellStyle(infoCellBold);

							if (langID != null)
							{

								c.setCellValue(ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY),
										"LBL_"+getGroupByColumnTitle(), langID) + "  :  " + currValue);
							}

						}
						prevValue = currValue;
					}
				}
				r = s.createRow(rownum);
			//	r.setHeight((short) 350);
				rownum++;
				for (int iColumnCtr = 0; iColumnCtr < metaDataCol.size(); iColumnCtr++)
				{
					if (getGroupByColumnPosition() != iColumnCtr)
					{

						c = r.createCell((++colIndex));

						ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(iColumnCtr);
						String colType = cmd.getColumnType();
						if(colType.equals(ColumnMetaData.TYPE_NUMERIC)) {
							if(amtCustomAlignment!=null && "LEFT".equalsIgnoreCase(amtCustomAlignment)){
									c.setCellStyle(dataCellLeft);
							}else if(amtCustomAlignment!=null && "CENTER".equalsIgnoreCase(amtCustomAlignment)){
									c.setCellStyle(dataCellCenter);
							}
							else{
									c.setCellStyle(dataCellRight);
							} 
						}
						else if(colType.equals(ColumnMetaData.TYPE_ALPHANUMERIC_R)) {
								c.setCellStyle(dataCellRight);
						}
						else if(colType.equals(ColumnMetaData.TYPE_DATE)) {
							if(dateCustomAlignment!=null && "LEFT".equalsIgnoreCase(dateCustomAlignment)){
									c.setCellStyle(dataCellLeft);
							}else if(dateCustomAlignment!=null && "CENTER".equalsIgnoreCase(dateCustomAlignment)){
									c.setCellStyle(dataCellCenter);
							}
							else{
									c.setCellStyle(dataCellRight);
							} 
						}
						else if(colType.equals(ColumnMetaData.TYPE_DATE_TIME)) {
							if(datetimeCustomAlignment!=null && "LEFT".equalsIgnoreCase(datetimeCustomAlignment)){
									c.setCellStyle(dataCellLeft);
							}else if(datetimeCustomAlignment!=null && "CENTER".equalsIgnoreCase(datetimeCustomAlignment)){
									c.setCellStyle(dataCellCenter);
							}
							else{
									c.setCellStyle(dataCellRight);
							} 
						}
						else if(colType.equals(ColumnMetaData.TYPE_SUB_TOTAL)) {
								c.setCellStyle(dataCellRight);
						}
						else {
							if (langID != null && langID.equalsIgnoreCase("ar_SA"))
							{
								c.setCellStyle(dataCellRight);
							}
							else
							{
							c.setCellStyle(dataCellLeft);
							}
					}

						if ("ec_CH".equals(langID))
						{
							String value = rowData[iColumnCtr];
							value = convertUnicodeString(value);
							c.setCellValue(value);
						} else
						{
							c.setCellValue(rowData[iColumnCtr].toString());
						}

					}
				}
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					// Bugfix for wrong sub total.
					if (!(moreData && iCtr == aList.size() - 2))
					{
						// update the datacolumn values to the container so that the group totals
						// can be displayed in the group footer.
						updateGroupTotals(dataMap, rowData);
						if (iCtr == aList.size() - 1)
						{
							r = s.createRow(rownum);
							r.setHeight((short) 350);
							rownum++;

							if (langID != null)
							{
								renderGroupFooter(r, dataMap, infoCellBold, langID);
							}

						}
					}
				}
				if (moreData && iCtr == aList.size() - 2)
				{
					// GET NEXT SET
					rowStartCount += rowsPerCall;

					if (dataMap.get("DATA") != null)
					{
						aList = (ArrayList) dataMap.get("DATA");
					}

					if (aList.size() == (rowsPerCall + 1))
					{
						moreData = true;
					} else
					{

						moreData = false;
					}
					// RESET
					iCtr = -1;
					nextSet = true;
				}

			}// END OF FOR
			logger.ctdebug("CTEXP00098");

			r = s.createRow(rownum);
			rownum++;

			if (dataMap.containsKey("SUMMARY"))
			{
				HashMap sumMap = (HashMap) dataMap.get("SUMMARY");
				ArrayList sumList = (ArrayList) sumMap.get("SUMMARY_LIST");
				logger.ctdebug("CTEXP00100");

				if (sumList != null)
				{
					r = s.createRow(rownum);
					r.setHeight((short) 350);
					rownum++;
					c = r.createCell((1));
					c.setCellStyle(infoCellBold);

					if (langID != null)
					{
						c.setCellValue(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
								ReportingConstants.EZ_REP_SUMM, langID));
					}

					logger.ctdebug("CTEXP00070");
					for (int iCtr = 0; iCtr < sumList.size(); iCtr++)
					{
						r = s.createRow(rownum);
						r.setHeight((short) 350);
						rownum++;
						c = r.createCell((1));
						c.setCellStyle(infoCell);

						SummaryData sumData = (SummaryData) sumList.get(iCtr);
						String strData[] = sumData.getData();
						StringBuffer summaryString = new StringBuffer();
						for (int j = 0; j < strData.length; j++)
						{

							if (langID != null)
							{

								summaryString.append(ReportsMessageManager.getMessage(
										(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), strData[j], langID)
										+ "   ");
							}

						}
						c.setCellValue(summaryString.toString());
					}
					logger.ctdebug("CTEXP00073");
				}

				java.util.HashMap paramsMap = (java.util.HashMap) sumMap.get("PARAMS");

				if (paramsMap != null)
				{
					logger.ctdebug("CTEXP00167");
					java.util.Iterator it = paramsMap.keySet().iterator();
					r = s.createRow(rownum);
					r.setHeight((short) 350);
					rownum++;

					if (it.hasNext())
					{
						r = s.createRow(rownum);
						r.setHeight((short) 350);
						rownum++;
						c = r.createCell((1));
						c.setCellStyle(infoCellBold);

						if (langID != null)
						{
							c.setCellValue(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
									ReportingConstants.EZ_SEL_CRIT, langID));
						}

					}

					while (it.hasNext())
					{
						r = s.createRow(rownum);
						r.setHeight((short) 350);
						rownum++;
						c = r.createCell((1));
						c.setCellStyle(infoCell);
						String pkey = (String) it.next();
						String value = (String) paramsMap.get(pkey);

						if (langID != null)
						{

							pkey = ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), pkey, langID);
						}

						c.setCellValue(pkey + "  :  " + value);
					}
					logger.ctdebug("CTEXP00168");
				}
			}

			logger.ctdebug("CTEXP00169");
			HSSFFooter footer = s.getFooter();

			if (langID != null)
			{
				footer.setRight(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
						ReportingConstants.EZ_PAGE_F, langID)
						+ " "
						+ HSSFFooter.page()
						+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_OF,
								langID) + HSSFFooter.numPages());
			}

			s.setAutobreaks(true);
			wb.write(out);
		} finally
		{
			if (out != null)
				out.close();
		}
		logger.ctdebug("CTEXP00160");
	}

	/**
	 * The method which converts to UnicodeString
	 * 
	 * @param args - String which is to be converted
	 * @return Returns the unicoded string
	 */
	private static String convertUnicodeString(String args)
	{

		String splitdata = "\\u";
		if (args.indexOf(splitdata) != -1)
		{
			int charIndex = 0;
			StringTokenizer tokenizer = new StringTokenizer(args, splitdata);
			char[] covertCharArry = new char[tokenizer.countTokens()];
			while (tokenizer.hasMoreTokens())
			{
				String tokenString = tokenizer.nextToken().trim();
				covertCharArry[charIndex++] = (char) Integer.parseInt(tokenString, 16);

			}
			return new String(covertCharArry);
		} else
			return args;

	}

}