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

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.ResourceBundle;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.lowagie.text.Document;
import com.lowagie.text.Phrase;
import com.lowagie.text.rtf.RtfHeaderFooter;
import com.lowagie.text.rtf.RtfWriter2;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;

/**
 * Generator class to create RTF documents
 * 
 * @version 1.0
 */
public class RTFNewGenerator
{

	private static final Logger logger = Logger.getLogger(RTFNewGenerator.class);

	/**
	 * The method which generates the RTF Document
	 * 
	 * @param hm - Hashmap which contains the data
	 * @param metaData - List of Column instances, Each instance will have Column Related Details
	 * 
	 * @param rtfFullPath - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @exception Exception - throws Exception if any while report generation
	 */
	public boolean generateRTFDocument(java.util.HashMap hm, ArrayList metaData, String rtfFullPath) throws Exception
	{
		String cmName = "RTFGenerator:generateRTFDocument";
		logger.ctinfo("CTEXP00026", cmName);
		Document document = new Document();
		ArrayList arr = new ArrayList();
		ResourceBundle res = null;
		boolean retBollean = false;
		try
		{

			RtfWriter2.getInstance(document, new FileOutputStream(rtfFullPath));
			logger.ctinfo("CTEXP00146");

			document.open();
			String imagePath = null;
			try
			{
				res = ResourceBundle.getBundle("reporting");
				imagePath = res.getString("IMAGE_PATH");
				logger.ctinfo("CTEXP00123", imagePath);

			} catch (Exception e)
			{

			}

			String langID = "en_US";
			String username = (String) hm.get("USERNAME");
			String reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_GEN, langID)
					+ " "
					+ ReportsMessageManager.getDate(langID)
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + username;

			RtfHeaderFooter hf1 = new RtfHeaderFooter(new Phrase(reportDate));
			document.setHeader(hf1);

			String reportHeader = (String) hm.get("REPORT_HEADER");
			ArrayList colData = (ArrayList) metaData.get(0);
			PdfPTable dummyRow1 = new PdfPTable(colData.size());

			PdfPCell cellDummy1 = new PdfPCell(new Paragraph(reportHeader, new Font(FontFamily.TIMES_ROMAN, 12,
					Font.BOLD, BaseColor.BLACK)));
			cellDummy1.setColspan(colData.size());
			cellDummy1.setBorder(0);
			cellDummy1.setHorizontalAlignment(Element.ALIGN_CENTER);

			dummyRow1.addCell(cellDummy1);

			document.add((com.lowagie.text.Element) dummyRow1);

			logger.ctinfo("CTEXP00125");
			PdfPTable tableHeader = createHeaderSection(hm);
			logger.ctinfo("CTEXP00147");
			document.add((com.lowagie.text.Element) tableHeader);

			logger.ctinfo("CTEXP00148");

			ArrayList colWidthData = (ArrayList) metaData.get(1);
			Iterator it2 = colWidthData.iterator();

			float flt[] = new float[colWidthData.size()];
			for (int x = 0; x < colWidthData.size(); x++)
				flt[x] = Float.parseFloat((String) it2.next());

			PdfPTable table = new PdfPTable(colWidthData.size());
			Iterator it = colData.iterator();
			while (it.hasNext())
			{
				PdfPCell cellHeader = new PdfPCell(new Paragraph((String) it.next(), new Font(FontFamily.TIMES_ROMAN,
						12, Font.BOLD, BaseColor.BLACK)));

				cellHeader.setBackgroundColor(BaseColor.LIGHT_GRAY);
				table.addCell(cellHeader);
			}
			arr = (ArrayList) hm.get("REPORT_DATA");
			logger.ctinfo("CTEXP00149", arr.size());
			Iterator itdata = arr.iterator();

			while (itdata.hasNext())
			{
				String strData[] = (String[]) itdata.next();
				for (int j = 0; j < strData.length; j++)
				{
					String dispVal = strData[j];
					boolean flag = false;
					if (dispVal.length() >= 3)
					{
						if ((dispVal.charAt((dispVal.length() - 3))) == '.')
							flag = true;
					}
					if (flag)
					{
						PdfPCell cellRow = new PdfPCell(new Paragraph(strData[j], new Font(FontFamily.TIMES_ROMAN, 10,
								Font.NORMAL, new BaseColor(0, 0, 0))));
						cellRow.setColspan(1);

						cellRow.setHorizontalAlignment(Element.ALIGN_RIGHT);
						table.addCell(cellRow);
					} else
					{
						PdfPCell cellRow = new PdfPCell(new Paragraph(strData[j], new Font(FontFamily.TIMES_ROMAN, 10,
								Font.NORMAL, new BaseColor(0, 0, 0))));
						cellRow.setColspan(1);

						cellRow.setHorizontalAlignment(Element.ALIGN_LEFT);
						table.addCell(cellRow);
					}
				}
			}
			document.add((com.lowagie.text.Element) table); // Upgrading_Jars

			// Below code display the Total Credit,Total Debit,Total Debit Count,Total Credit Count, Net Amount
			// This is applicable only for Transaction Summary Reports

			ArrayList dataArray = new ArrayList();
			dataArray = (ArrayList) hm.get("TOT_AMT_DET");

			if (dataArray != null)
			{
				PdfPTable table3 = new PdfPTable(5); // Upgrading_Jars starts
				ArrayList totalAmt = (ArrayList) metaData.get(2);

				// the only method of iterating over a list
				for (Iterator i = dataArray.iterator(); i.hasNext();)
				{

					String[] value = (String[]) i.next();

					for (int j = 0; j < value.length - 1; j++)
					{

						String label = (String) totalAmt.get(j);
						PdfPCell cellLabel = new PdfPCell(new Paragraph(label, new Font(FontFamily.TIMES_ROMAN, 12,
								Font.BOLD, BaseColor.BLACK)));

						cellLabel.setHorizontalAlignment(Element.ALIGN_CENTER);
						cellLabel.setBackgroundColor(BaseColor.LIGHT_GRAY);
						table3.addCell(cellLabel);
					}

					for (int j = 0; j < value.length - 1; j++)
					{
						String dispVal = value[j];
						boolean flag = false;
						if (dispVal.length() >= 3)
						{
							if ((dispVal.charAt((dispVal.length() - 3))) == '.')
								flag = true;
						}
						if (flag)
						{
							PdfPCell cellData = new PdfPCell(new Paragraph(value[j], new Font(FontFamily.TIMES_ROMAN,
									10, Font.NORMAL, new BaseColor(0, 0, 0))));
							cellData.setHorizontalAlignment(Element.ALIGN_RIGHT);
							table3.addCell(cellData);
						} else
						{
							PdfPCell cellData = new PdfPCell(new Paragraph(value[j], new Font(FontFamily.TIMES_ROMAN,
									10, Font.NORMAL, new BaseColor(0, 0, 0))));
							cellData.setHorizontalAlignment(Element.ALIGN_CENTER);
							table3.addCell(cellData);
						}
					}
				}
				document.add((com.lowagie.text.Element) table3);
			}

			document.setPageCount(10);

			logger.ctinfo("CTEXP00150");
			retBollean = true;
		} catch (IOException ioe)
		{
			logger.cterror("CTEXP00189", ioe);
		}
		document.close();
		return retBollean;

	}

	/**
	 * Displays the header part of the jsp. It takes the hashmap which contains the header part.
	 * 
	 * @param hashmap which contains data
	 * 
	 * @returns Table with data
	 * 
	 * @exception Exception
	 */
	private PdfPTable createHeaderSection(HashMap hmHeader)
	{
		String cmName = "RTFGenerator:createHeaderSection";
		logger.ctinfo("CTEXP00026", cmName);
		PdfPTable table = null;
		try
		{
			table = new PdfPTable(4);
			LinkedHashMap hm = new LinkedHashMap();
			hm = (LinkedHashMap) (hmHeader.get("INPUT_PARAMS"));

			logger.ctinfo("CTEXP00134", hm);
			if ((hm.keySet().size()) % 2 != 0)
				hm.put("Test", " ");

			Iterator it = hm.keySet().iterator();
			String strLabel = null;
			while (it.hasNext())
			{
				strLabel = (String) it.next();
				String dispVal = (String) hm.get(strLabel);
				logger.ctinfo("CTEXP00151", strLabel);
				logger.ctinfo("CTEXP00152", dispVal);
				if (strLabel.equals("Test") && dispVal.equals(" "))
				{
					PdfPCell cellLabel = new PdfPCell(new Paragraph(dispVal, new Font(FontFamily.TIMES_ROMAN, 12,
							Font.BOLD, new BaseColor(0, 0, 0))));

					cellLabel.setColspan(2);

					table.addCell(cellLabel);
				} else
				{
					if (dispVal != null || dispVal.length() != 0 || !(dispVal.equals(" ")))
					{

						boolean flag = false;
						if (dispVal.length() >= 3)
						{
							if ((dispVal.charAt((dispVal.length() - 3))) == '.')
								flag = true;
						}
						logger.ctinfo("CTEXP00135", strLabel);
						PdfPCell cellLabel = new PdfPCell(new Paragraph(strLabel, new Font(FontFamily.TIMES_ROMAN, 12,
								Font.BOLD, new BaseColor(0, 0, 0))));
						cellLabel.setBackgroundColor(BaseColor.LIGHT_GRAY);
						cellLabel.setColspan(1);
						table.addCell(cellLabel);
						if (flag)
						{
							PdfPCell cellData = new PdfPCell(new Paragraph((String) hm.get(strLabel), new Font(
									FontFamily.TIMES_ROMAN, 10, Font.NORMAL, new BaseColor(0, 0, 0))));
							logger.ctinfo("CTEXP00153", hm.get(strLabel));
							cellData.setHorizontalAlignment(Element.ALIGN_RIGHT);
							cellData.setColspan(1);
							table.addCell(cellData);
						} else
						{
							PdfPCell cellData = new PdfPCell(new Paragraph((String) hm.get(strLabel), new Font(
									FontFamily.TIMES_ROMAN, 10, Font.NORMAL, new BaseColor(0, 0, 0))));
							logger.ctinfo("CTEXP00153", hm.get(strLabel));
							cellData.setColspan(1);
							cellData.setHorizontalAlignment(Element.ALIGN_LEFT);
							table.addCell(cellData);
						}
					}
				}
			}
		}

		catch (Exception ex)
		{
			logger.cterror("CTEXP00190", ex);
		}
		return table;
	}
}
