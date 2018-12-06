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
import java.util.HashMap;
import java.util.ResourceBundle;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFFooter;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.Region;

import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.datasource.JavaDataSource;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;
import com.intellectdesign.canvas.reports.DetailData;
import com.intellectdesign.canvas.reports.DetailElement;

/**
 * Contains details of XSL Generator
 * 
 * @version 1.0
 */
public class DetailXSLGenerator
{
	private static final Logger logger = Logger.getLogger(DetailXSLGenerator.class);

	/**
	 * This class is used to generate XSL Report
	 * 
	 * @param datamap - HashMap which contains the data
	 * @param path - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @throws Exception if any while report generation
	 */

	public boolean generateXSL(HashMap dataMap, String path) throws Exception
	{
		String cmName = "DetailXSLGenerator:generateXSL";
		logger.ctinfo("CTEXP00026", cmName);
		JavaDataSource javaSource = (JavaDataSource) dataMap.get("DATA_PROVIDER_INSTANCE");
		HashMap dataSourceParam = (HashMap) dataMap.get("DATA_PROVIDER_OBJECT");
		int rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
		dataSourceParam.put("StartRowNumber", new Integer(0));
		HashMap dataHash = javaSource.execute(dataSourceParam);
		DetailData detailData = (DetailData) dataHash.get("DETAILS");
		HashMap detailParams = (HashMap) dataHash.get("PARAMS");

		String langID = (String) dataMap.get("LANGUAGE_ID");
		logger.ctdebug("CTEXP00082", langID);

		short rownum = 0;

		ResourceBundle labelRB = ResourceBundle.getBundle("infra");
		String serviceTitle = labelRB.getString("PAGE_TITLE");

		// create a new file
		FileOutputStream out = new FileOutputStream(new File(path));
		HSSFWorkbook wb = new HSSFWorkbook();
		HSSFSheet s = wb.createSheet();
		HSSFRow r = null;
		HSSFCell c = null;

		HSSFCellStyle cs2 = wb.createCellStyle();

		// create 2 fonts objects
		HSSFFont title = wb.createFont();
		HSSFFont data = wb.createFont();
		HSSFFont date = wb.createFont();
		HSSFFont header = wb.createFont();

		title.setFontHeightInPoints((short) 10);
		title.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		title.setColor((short) 9);

		date.setFontHeightInPoints((short) 8);
		date.setItalic(true);
		date.setColor((short) 8);

		data.setFontHeightInPoints((short) 10);
		data.setColor((short) 8);

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

		header.setFontHeightInPoints((short) 12);
		header.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		header.setColor((short) 8);

		// 4 Cols
		s.setColumnWidth(1, (short) 5000);
		s.setColumnWidth(2, (short) 5000);
		s.setColumnWidth(3, (short) 5000);
		s.setColumnWidth(4, (short) 5000);

		s.setDisplayGridlines(false);

		Region titleReg = new Region((short) 1, (short) 1, (short) 1, (short) 4);
		s.addMergedRegion(titleReg);
		Region corpReg = new Region((short) 2, (short) 1, (short) 2, (short) 4);
		s.addMergedRegion(corpReg);
		// set cell stlye

		// set a thin border
		cs2.setBorderBottom(cs2.BORDER_THIN);
		// fill w fg fill color
		cs2.setFillPattern((short) HSSFCellStyle.SOLID_FOREGROUND);
		// set the cell format to text see HSSFDataFormat for a full list
		cs2.setDataFormat(HSSFDataFormat.getBuiltinFormat("text"));

		// set the font
		cs2.setFont(data);

		// set the sheet name in Unicode

		wb.setSheetName(0, ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
				ReportingConstants.EZ_DWNL_TITLE, langID));

		r = s.createRow(rownum);
		rownum++;

		HSSFCellStyle headerCell = wb.createCellStyle();
		headerCell.setFont(header);
		headerCell.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		headerCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

		r = s.createRow(rownum);
		rownum++;
		r.setHeight((short) 500);
		c = r.createCell(1);
		c.setCellStyle(headerCell);
		/**
		 * setEncoding was marked as removed from HSSFCell. POI HSSF automatically handles Unicode without forcing the
		 * encoding.
		 */

		c.setCellValue(serviceTitle);

		r = s.createRow(rownum);
		rownum++;
		r.setHeight((short) 500);
		c = r.createCell(1);
		c.setCellStyle(headerCell);

		String reportTitle = ReportsMessageManager.replacePredefinedDetail(detailData.getReportTitle(), detailParams,
				langID);

		logger.ctdebug("CTEXP00087", dataHash.get("CORPORATE_NAME"));
		c.setCellValue(reportTitle);

		r = s.createRow(rownum);
		rownum++;
		r.setHeight((short) 500);
		c = r.createCell(1);
		c.setCellStyle(headerCell);

		c.setCellValue((String) dataMap.get("CORPORATE_NAME"));

		HSSFCellStyle dateCell = wb.createCellStyle();
		dateCell.setFont(date);
		dateCell.setAlignment(HSSFCellStyle.ALIGN_LEFT);
		dateCell.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

		r = s.createRow(rownum);
		rownum++;
		r.setHeight((short) 500);
		c = r.createCell(1);
		c.setCellStyle(dateCell);

		String reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
				ReportingConstants.EZ_REP_GEN, langID)
				+ " "
				+ ReportsMessageManager.getDate(langID)
				+ " "
				+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY, langID)
				+ " " + (String) dataMap.get("USER_NAME");

		c.setCellValue(reportDate);

		java.util.ArrayList list = detailData.getDetailsList();
		for (int i = 0; i < list.size(); i++)
		{
			r = s.createRow(rownum);
			r.setHeight((short) 350);
			rownum++;
			String label1 = "";
			String label2 = "";
			String value1 = "";
			String value2 = "";
			DetailElement elem = (DetailElement) list.get(i);

			label1 = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, elem.getLabel(), langID);

			value1 = elem.getValue();
			i++;
			if (i < list.size())
			{
				elem = (DetailElement) list.get(i);

				label2 = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, elem.getLabel(), langID);

				value2 = elem.getValue();
			}
			c = r.createCell(1);
			c.setCellStyle(dataCell);

			c.setCellValue(label1);

			c = r.createCell(2);
			c.setCellStyle(dataCell);

			c.setCellValue(value1);

			c = r.createCell(3);
			c.setCellStyle(dataCell);

			c.setCellValue(label2);

			c = r.createCell(4);
			c.setCellStyle(dataCell);

			c.setCellValue(value2);
		}

		HSSFFooter footer = s.getFooter();

		footer.setRight(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_F,
				langID)
				+ " "
				+ HSSFFooter.page()
				+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_OF, langID)
				+ HSSFFooter.numPages());

		s.setAutobreaks(true);
		wb.write(out);
		out.close();
		return true;
	}

}