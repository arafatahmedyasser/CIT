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

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.ss.usermodel.CellStyle;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;

/**
 * Generator class to create XSL documents
 * 
 * @version 1.0
 */
public class XSLNewGenerator
{
	private static final Logger logger = Logger.getLogger(XSLNewGenerator.class);

	/**
	 * The method which generates the XSL Document
	 * 
	 * @param data - Hashmap which contains the data
	 * @param metaData - List of Column instances, Each instance will have Column Related Details
	 * 
	 * @param xslPath - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @exception Exception - throws Exception if any while report generation
	 */

	public boolean generateXSLDocument(HashMap data, ArrayList metaData, String xslPath) throws Exception
	{
		String cmName = "XSLNewGenerator:generateXSLDocument";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			logger.ctdebug("CTEXP00170", data, metaData, xslPath);
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
			String xslFullPath = exportDescriptor.getXslFolderPath() + File.separator + xslPath;
			logger.ctdebug("CTEXP00154", xslFullPath);
			generateXSL(data, metaData, xslFullPath);

			return true;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw e;
		}
	}

	/**
	 * Displays the data obtained from query, report title, username,column names in the excel file.
	 */

	/**
	 * The method which generates the XSL Document
	 * 
	 * @param dataMap - Hashmap which contains the data
	 * @param metaDataColDet - List of Column instances, Each instance will have Column Related Details
	 * 
	 * @param path - An absolute path, where report should save after generate
	 * 
	 * @exception Exception - throws Exception if any while report generation
	 */

	private void generateXSL(HashMap dataMap, ArrayList metaDataColDet, String path) throws Exception
	{
		String cmName = "XSLNewGenerator:generateXSL";
		logger.ctinfo("CTEXP00026", cmName);
		String titleName = null;

		String imagePath = null;
		try
		{
			ConfigurationManager configMgr = ConfigurationManager.getInstance();
			ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

			// Obtains the name of report from the hashmap
			titleName = (String) dataMap.get("REPORT_HEADER");

			imagePath = exportDescriptor.getXslImagePath();
			logger.ctdebug("CTEXP00171", titleName);

		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
		}

		short rownum = 0;

		// create a new file
		FileOutputStream out = null;
		try
		{
			out = new FileOutputStream(new File(path));
			HSSFWorkbook wb = new HSSFWorkbook();
			HSSFSheet s = wb.createSheet();
			HSSFRow r = null;
			HSSFCell c = null;

			logger.ctdebug("CTEXP00172");
			// HSSFCellStyle titleCell = wb.createCellStyle();
			HSSFCellStyle cs2 = wb.createCellStyle();

			// create 2 fonts objects
			HSSFFont title = wb.createFont();
			HSSFFont data = wb.createFont();
			HSSFFont dateHeader = wb.createFont();
			HSSFFont header = wb.createFont();

			dateHeader.setFontHeightInPoints((short) 8);
			dateHeader.setItalic(true);
			dateHeader.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			dateHeader.setColor((short) 8);

			title.setFontHeightInPoints((short) 10);
			title.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			title.setColor((short) 8);

			data.setFontHeightInPoints((short) 10);
			data.setColor((short) 8);

			header.setFontHeightInPoints((short) 12);
			header.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);

			header.setColor((short) 8);

			cs2.setBorderBottom(CellStyle.BORDER_THIN);
			// fill w fg fill color
			cs2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			// set the cell format to text see HSSFDataFormat for a full list
			cs2.setDataFormat(HSSFDataFormat.getBuiltinFormat("text"));

			// set the font
			cs2.setFont(data);

			HSSFCellStyle dateCell = wb.createCellStyle();
			dateCell.setFont(dateHeader);
			dateCell.setAlignment(HSSFCellStyle.ALIGN_LEFT);

			// HSSFCellStyle to create different styles,aligment for the cell
			HSSFCellStyle headerCell = wb.createCellStyle();
			headerCell.setFont(header);
			headerCell.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			headerCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle titleCell = wb.createCellStyle();
			titleCell.setFont(title);

			titleCell.setAlignment(HSSFCellStyle.ALIGN_CENTER);

			titleCell.setBorderLeft(HSSFCellStyle.BORDER_THIN);

			titleCell.setLeftBorderColor((short) 8);
			titleCell.setBorderRight(HSSFCellStyle.BORDER_THIN);
			titleCell.setRightBorderColor((short) 8);
			titleCell.setBorderTop(HSSFCellStyle.BORDER_THIN);
			titleCell.setTopBorderColor((short) 8);
			titleCell.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			titleCell.setBottomBorderColor((short) 8);
			titleCell.setWrapText(true);
			titleCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle dataCell = wb.createCellStyle();
			dataCell.setFont(data);
			dataCell.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			dataCell.setLeftBorderColor((short) 22);
			dataCell.setBorderRight(HSSFCellStyle.BORDER_THIN);
			dataCell.setRightBorderColor((short) 22);
			dataCell.setBorderTop(HSSFCellStyle.BORDER_THIN);
			dataCell.setTopBorderColor((short) 22);
			dataCell.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			dataCell.setBottomBorderColor((short) 22);
			dataCell.setWrapText(true);
			dataCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			HSSFCellStyle infoCell = wb.createCellStyle();
			infoCell.setFont(data);
			infoCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			infoCell.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			infoCell.setLeftBorderColor((short) 8);
			infoCell.setBorderRight(HSSFCellStyle.BORDER_THIN);
			infoCell.setRightBorderColor((short) 8);
			infoCell.setBorderTop(HSSFCellStyle.BORDER_THIN);
			infoCell.setTopBorderColor((short) 8);
			infoCell.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			infoCell.setBottomBorderColor((short) 8);
			infoCell.setWrapText(true);
			infoCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

			// Following arraylist contains the column names
			ArrayList metaDataCol = (ArrayList) metaDataColDet.get(0);

			// Following arraylist contains the column width
			ArrayList colWidth = (ArrayList) metaDataColDet.get(1);

			// Defining the width of the columns by taking it from arraylis that contains the column width
			int counter = 1;
			for (int i = 0; i < colWidth.size(); i++)
			{
				String width1 = (String) colWidth.get(i);
				int widthint = new Integer(width1).intValue();
				s.setColumnWidth((short) (counter), (short) widthint);
				counter = counter + 1;
			}

			s.setDisplayGridlines(false); // Grids in the excel not visible since its made false

			// Below code displays the username and date
			String langID = "en_US";
			String username = (String) dataMap.get("USERNAME");
			String reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_GEN, langID)
					+ " "
					+ ReportsMessageManager.getDate(langID)
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + username;

			Region dateUserName = new Region((short) 1, (short) 1, (short) 1, (short) colWidth.size());
			s.addMergedRegion(dateUserName); // Cells are merged into a single cell to display the username and date

			r = s.createRow(rownum);
			rownum++;
			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500); // Sets the height of each row
			c = r.createCell(1);
			c.setCellStyle(dateCell);
			/**
			 * setEncoding was marked as removed from HSSFCell. POI HSSF automatically handles Unicode without forcing
			 * the encoding.
			 */

			c.setCellValue(reportDate);// To display value in the report

			Region titleReg = new Region((short) 3, (short) 1, (short) 3, (short) metaDataCol.size());
			s.addMergedRegion(titleReg); // merge the cell to display the report title

			// set a thin border

			r = s.createRow(rownum);// create a new row
			rownum++;
			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			c = r.createCell(1); // create a new cell
			c.setCellStyle(headerCell);

			c.setCellValue(titleName);

			r = s.createRow(rownum);
			rownum++;
			r = s.createRow(rownum);
			rownum++;

			logger.ctdebug("CTEXP00173");

			LinkedHashMap searchMap = new LinkedHashMap();
			searchMap = (LinkedHashMap) (dataMap.get("INPUT_PARAMS")); // hashmap contains the header part of the jsp

			java.util.Iterator it = searchMap.keySet().iterator();
			int k = 1;
			int nCounter = 0;
			while (it.hasNext())
			{
				String pkey = (String) it.next();
				String value = (String) searchMap.get(pkey);
				if (value != null && value.length() > 0)
				{

					c = r.createCell(k);
					c.setCellStyle(titleCell);

					c.setCellValue(pkey);

					boolean flag = false;
					// below code checks if the string is amount.
					if (value.length() > 3)
					{
						if ((value.charAt((value.length() - 3))) == '.')
							flag = true; // sets true if the string is amount
					}
					c = r.createCell(k + 1);

					if (flag)
					{
						HSSFCellStyle infoCell1 = wb.createCellStyle();
						infoCell1.setFont(data);
						infoCell1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

						infoCell1.setBorderLeft(HSSFCellStyle.BORDER_THIN);
						infoCell1.setLeftBorderColor((short) 8);
						infoCell1.setBorderRight(HSSFCellStyle.BORDER_THIN);
						infoCell1.setRightBorderColor((short) 8);
						infoCell1.setBorderTop(HSSFCellStyle.BORDER_THIN);
						infoCell1.setTopBorderColor((short) 8);
						infoCell1.setBorderBottom(HSSFCellStyle.BORDER_THIN);
						infoCell1.setBottomBorderColor((short) 8);
						infoCell1.setWrapText(true);
						infoCell1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
						infoCell1.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
						c.setCellStyle(infoCell1);

						c.setCellValue(value);
					} else
					{
						HSSFCellStyle infoCell2 = wb.createCellStyle();
						infoCell2.setFont(data);
						infoCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

						infoCell2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
						infoCell2.setLeftBorderColor((short) 8);
						infoCell2.setBorderRight(HSSFCellStyle.BORDER_THIN);
						infoCell2.setRightBorderColor((short) 8);
						infoCell2.setBorderTop(HSSFCellStyle.BORDER_THIN);
						infoCell2.setTopBorderColor((short) 8);
						infoCell2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
						infoCell2.setBottomBorderColor((short) 8);
						infoCell2.setWrapText(true);
						infoCell2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
						infoCell2.setAlignment(HSSFCellStyle.ALIGN_LEFT);
						c.setCellStyle(infoCell2);

						c.setCellValue(value);
					}

					k = k + 2;

					nCounter = nCounter + 1;

					/**
					 * Counter checked if total 4 columns are displayed in header part. Whenfour columns are displayed
					 * then intialise counter to 0 and create a new rowto display next 4 values.
					 */
					if (nCounter == 2)
					{
						r = s.createRow(rownum);
						rownum++;
						nCounter = 0;
						k = 1;
					}
				}
			}

			logger.ctdebug("CTEXP00174");

			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);
			r = s.createRow(rownum);
			rownum++;
			r.setHeight((short) 500);

			logger.ctdebug("CTEXP00095");
			int colIndex = 0;
			for (int i = 0; i < metaDataCol.size(); i++)
			{
				colIndex = colIndex + 1;
				String colValue = (String) metaDataCol.get(i);
				c = r.createCell(colIndex);
				c.setCellStyle(titleCell);

				c.setCellValue(colValue);

			}

			logger.ctdebug("CTEXP00096");

			logger.ctdebug("CTEXP00175");
			colIndex = 0;
			r = s.createRow(rownum);
			rownum++;
			colIndex = 0;
			ArrayList dataArray = new ArrayList();
			dataArray = (ArrayList) dataMap.get("REPORT_DATA");// Hashmap that contains the result data from query

			for (Iterator i = dataArray.iterator(); i.hasNext();)
			{

				String[] value = (String[]) i.next();

				for (int j = 0; j < value.length; j++)
				{
					c = r.createCell(++colIndex);
					String strValue = value[j];
					boolean flag = false;
					// Checks if the string is amount. If its amount align it to right
					if (strValue.length() >= 3)
					{
						if ((strValue.charAt((strValue.length() - 3))) == '.')
							flag = true;
					}
					if (flag)
					{

						HSSFCellStyle infoCell1 = wb.createCellStyle();
						infoCell1.setFont(data);
						infoCell1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
						infoCell1.setBorderLeft(HSSFCellStyle.BORDER_THIN);
						infoCell1.setLeftBorderColor((short) 8);
						infoCell1.setBorderRight(HSSFCellStyle.BORDER_THIN);
						infoCell1.setRightBorderColor((short) 8);
						infoCell1.setBorderTop(HSSFCellStyle.BORDER_THIN);
						infoCell1.setTopBorderColor((short) 8);
						infoCell1.setBorderBottom(HSSFCellStyle.BORDER_THIN);
						infoCell1.setBottomBorderColor((short) 8);
						infoCell1.setWrapText(true);
						infoCell1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
						infoCell1.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
						c.setCellStyle(infoCell1);

						c.setCellValue(value[j]);
					} else
					{
						HSSFCellStyle infoCell2 = wb.createCellStyle();
						infoCell2.setFont(data);
						infoCell2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

						infoCell2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
						infoCell2.setLeftBorderColor((short) 8);
						infoCell2.setBorderRight(HSSFCellStyle.BORDER_THIN);
						infoCell2.setRightBorderColor((short) 8);
						infoCell2.setBorderTop(HSSFCellStyle.BORDER_THIN);
						infoCell2.setTopBorderColor((short) 8);
						infoCell2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
						infoCell2.setBottomBorderColor((short) 8);
						infoCell2.setWrapText(true);
						infoCell2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
						infoCell2.setAlignment(HSSFCellStyle.ALIGN_LEFT);
						c.setCellStyle(infoCell2);

						c.setCellValue(value[j]);
					}

				}

				r = s.createRow(rownum);
				rownum++;

				colIndex = 0;
			}

			logger.ctdebug("CTEXP00176");

			// Below code display the Total Credit,Total Debit,Total Debit Count,Total Credit Count, Net Amount
			// This is applicable only for Transaction Summary Reports

			r = s.createRow(rownum);
			rownum++;
			dataArray = new ArrayList();
			logger.ctdebug("CTEXP00177");
			dataArray = (ArrayList) dataMap.get("TOT_AMT_DET");

			if (dataArray != null)
			{
				r = s.createRow(rownum);
				rownum++;
				colIndex = 0;
				ArrayList totalAmt = (ArrayList) metaDataColDet.get(2);
				for (Iterator i = dataArray.iterator(); i.hasNext();)
				{
					String[] value = (String[]) i.next();
					for (int j = 0; j < value.length - 1; j++)
					{
						c = r.createCell(++colIndex);
						String label = (String) totalAmt.get(j);
						c.setCellValue(label);
						c.setCellStyle(titleCell);
						// colIndex=0;
					}
				}
				r = s.createRow(rownum);
				rownum++;
				colIndex = 0;
				for (Iterator i = dataArray.iterator(); i.hasNext();)
				{

					String[] value = (String[]) i.next();

					for (int j = 0; j < value.length - 1; j++)
					{
						String strValue = value[j];
						boolean flag = false;
						if (strValue.length() >= 3)
						{
							if ((strValue.charAt((strValue.length() - 3))) == '.')
								flag = true;
						}
						if (flag)
						{

							HSSFCellStyle infoCell1 = wb.createCellStyle();
							infoCell1.setFont(data);
							infoCell1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
							infoCell1.setBorderLeft(HSSFCellStyle.BORDER_THIN);
							infoCell1.setLeftBorderColor((short) 8);
							infoCell1.setBorderRight(HSSFCellStyle.BORDER_THIN);
							infoCell1.setRightBorderColor((short) 8);
							infoCell1.setBorderTop(HSSFCellStyle.BORDER_THIN);
							infoCell1.setTopBorderColor((short) 8);
							infoCell1.setBorderBottom(HSSFCellStyle.BORDER_THIN);
							infoCell1.setBottomBorderColor((short) 8);
							infoCell1.setWrapText(true);
							infoCell1.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
							infoCell1.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
							c = r.createCell(++colIndex);

							c.setCellStyle(infoCell1);
							c.setCellValue(value[j]);
						} else
						{
							HSSFCellStyle infoCell2 = wb.createCellStyle();
							infoCell2.setFont(data);
							infoCell2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

							infoCell2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
							infoCell2.setLeftBorderColor((short) 8);
							infoCell2.setBorderRight(HSSFCellStyle.BORDER_THIN);
							infoCell2.setRightBorderColor((short) 8);
							infoCell2.setBorderTop(HSSFCellStyle.BORDER_THIN);
							infoCell2.setTopBorderColor((short) 8);
							infoCell2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
							infoCell2.setBottomBorderColor((short) 8);
							infoCell2.setWrapText(true);
							infoCell2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
							infoCell2.setAlignment(HSSFCellStyle.ALIGN_CENTER);

							c = r.createCell(++colIndex);

							c.setCellStyle(infoCell2);
							c.setCellValue(value[j]);
						}
					}
				}
			}
			logger.ctdebug("CTEXP00178");
			s.setAutobreaks(true);
			wb.write(out);

		} finally
		{
			if (out != null)
				out.close();
		}
		logger.ctdebug("CTEXP00179");
	}
}