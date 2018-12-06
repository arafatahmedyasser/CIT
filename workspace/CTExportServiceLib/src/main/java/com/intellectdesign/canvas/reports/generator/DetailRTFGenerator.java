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
import java.io.OutputStream;
import java.net.URL;
import java.util.HashMap;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.lowagie.text.Document;
import com.lowagie.text.Phrase;
import com.lowagie.text.rtf.RtfHeaderFooter;
import com.lowagie.text.rtf.RtfWriter2;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.datasource.JavaDataSource;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;
import com.intellectdesign.canvas.reports.DetailData;
import com.intellectdesign.canvas.reports.DetailElement;

/**
 * Contains details of RTF Generator
 * 
 * @version 1.0
 */
public class DetailRTFGenerator
{
	private static final Logger logger = Logger.getLogger(DetailRTFGenerator.class);

	/**
	 * This class is used to generate RTF Report
	 * 
	 * @param datamap - HashMap which contains the data
	 * @param path - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @throws Exception if any while report generation
	 */
	public boolean generateRTF(HashMap dataMap, String path) throws Exception
	{
		String cmName = "DetailRTFGenerator:generateRTF";
		logger.ctinfo("CTEXP00026", cmName);
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

		JavaDataSource javaSource = (JavaDataSource) dataMap.get("DATA_PROVIDER_INSTANCE");
		HashMap dataSourceParam = (HashMap) dataMap.get("DATA_PROVIDER_OBJECT");
		int rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
		dataSourceParam.put("StartRowNumber", new Integer(0));
		HashMap dataHash = javaSource.execute(dataSourceParam);
		DetailData detailData = (DetailData) dataHash.get("DETAILS");
		HashMap detailParams = (HashMap) dataHash.get("PARAMS");

		String langID = (String) dataMap.get("LANGUAGE_ID");
		if (langID == null)
			langID = "en_US";
		logger.ctdebug("CTEXP00082", langID);

		boolean odd = true;

		try
		{
			// Create a new document
			Document document = new Document();
			OutputStream out = new FileOutputStream(new File(path));
			com.lowagie.text.Document doc = new com.lowagie.text.Document();
			RtfWriter2.getInstance(doc, out);
			document.addTitle("Report");

			String imgURL = exportDescriptor.getFileDown() + exportDescriptor.getIntellectLogo(); // Export_Label
																									// Configuration
			Image jpeg = Image.getInstance(new URL(imgURL));
			jpeg.scalePercent(300);

			// Report header - Title
			document.open();
			document.add((com.lowagie.text.Element) jpeg);
			document.add((com.lowagie.text.Element) new Paragraph(""));
			document.add((com.lowagie.text.Element) new Paragraph(""));

			String reportTitle = ReportsMessageManager.replacePredefinedDetail(detailData.getReportTitle(),
					detailParams, langID);

			String corpName = (String) dataMap.get("CORPORATE_NAME");

			String serviceTitle = exportDescriptor.getPageTitle();
			if (corpName == null)
				corpName = "";

			logger.ctdebug("CTEXP00083", reportTitle);
			PdfPTable repTitle = new PdfPTable(1);

			repTitle.addCell(getTitleCell(serviceTitle));

			repTitle.addCell(getTitleCell(reportTitle));

			repTitle.addCell(getTitleCell(corpName));

			document.add((com.lowagie.text.Element) repTitle);

			RtfHeaderFooter footer = new RtfHeaderFooter(new Phrase(ReportsMessageManager.getMessage(
					ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_F, langID)));

			footer.setBorder(Rectangle.NO_BORDER);
			footer.setAlignment(Element.ALIGN_CENTER);
			document.setFooter(footer);

			// Report header - Date/Time
			String userName = (String) dataMap.get("USER_NAME");
			if (userName == null)
				userName = "";
			document.add((com.lowagie.text.Element) new Paragraph(" "));

			String reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_GEN, langID)
					+ " "
					+ ReportsMessageManager.getDate(langID)
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + (String) dataMap.get("USER_NAME");

			Paragraph date = new Paragraph(reportDate, new Font(FontFamily.HELVETICA, 8, Font.ITALIC));
			date.setAlignment(Element.ALIGN_RIGHT);
			document.add((com.lowagie.text.Element) date);
			logger.ctdebug("CTEXP00084", reportDate);
			document.add((com.lowagie.text.Element) new Paragraph(" "));

			// Creating table for report
			PdfPTable table = new PdfPTable(4);

			java.util.ArrayList list = detailData.getDetailsList();
			logger.ctdebug("CTEXP00085", list.size());
			int rowCount = 1;
			for (int i = 0; i < list.size(); i++)
			{
				String label1 = "";
				String label2 = "";
				String value1 = "";
				String value2 = "";
				DetailElement elem = (DetailElement) list.get(i);

				label1 = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, elem.getLabel(), langID);

				value1 = elem.getValue();
				if (value1 == null)
					value1 = "";
				if ((i + 1) < list.size())
				{
					elem = (DetailElement) list.get(++i);

					label2 = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, elem.getLabel(), langID);

					value2 = elem.getValue();
					if (value2 == null)
						value2 = "";
				}
				if (rowCount % 2 == 0)
					odd = false;
				else
					odd = true;
				table.addCell(getDetailCell(label1, odd));
				table.addCell(getDetailCell(value1, odd));
				table.addCell(getDetailCell(label2, odd));
				table.addCell(getDetailCell(value2, odd));
				logger.ctdebug("CTEXP00193", label1, value1, label2, value2);
				logger.ctdebug("CTEXP00086", odd);
				rowCount++;
			}
			document.add((com.lowagie.text.Element) table);
			document.close();
			out.close();
			return true;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			return false;
		}

	}

	/**
	 * This class is used to generate DetailCell
	 * 
	 * @param data - String
	 * @param odd - flag which determines body and background colour
	 * @return - Returns the DetailCell
	 * @throws Exception if any
	 */
	private static PdfPCell getDetailCell(String data, boolean odd) throws Exception
	{
		String cmName = "DetailRTFGenerator:getDetailCell";
		logger.ctinfo("CTEXP00026", cmName);
		Paragraph cellData = new Paragraph(data,
				new Font(FontFamily.HELVETICA, 10, Font.NORMAL, new BaseColor(0, 0, 0)));
		PdfPCell body = new PdfPCell(cellData);
		if (odd)
		{
			body.setBorderColor(new BaseColor(352, 352, 352));
			body.setBackgroundColor(new BaseColor(352, 352, 352));
		} else
		{
			body.setBorderColor(new BaseColor(371, 371, 372));
			body.setBackgroundColor(new BaseColor(371, 371, 372));
		}
		body.setHorizontalAlignment(Element.ALIGN_LEFT);
		body.setVerticalAlignment(Element.ALIGN_MIDDLE);
		return body;
	}

	/**
	 * This class is used to generate TitleCell
	 * 
	 * @param data - String
	 * @return - Returns the TitleCell
	 * @throws Exception if any
	 */
	private static PdfPCell getTitleCell(String data) throws Exception
	{
		String cmName = "DetailRTFGenerator:getTitleCell";
		logger.ctinfo("CTEXP00026", cmName);
		Paragraph cellData = new Paragraph(data, new Font(FontFamily.HELVETICA, 12, Font.BOLD, new BaseColor(255, 255,
				255)));
		PdfPCell body = new PdfPCell(cellData);
		body.setBorderColor(new BaseColor(118, 144, 195));

		body.setBackgroundColor(new BaseColor(118, 144, 195));
		body.setHorizontalAlignment(Element.ALIGN_CENTER);
		body.setVerticalAlignment(Element.ALIGN_MIDDLE);
		body.setBorderColorBottom(new BaseColor(118, 144, 195));
		return body;
	}
}
