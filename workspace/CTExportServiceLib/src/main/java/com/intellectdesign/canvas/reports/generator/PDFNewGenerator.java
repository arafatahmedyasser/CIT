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
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.ExceptionConverter;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfGState;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;

/**
 * Generator class to create PDF documents
 * 
 * @version 1.0
 */
public class PDFNewGenerator extends PdfPageEventHelper
{
	public Image headerImage;
	/** The headertable. */
	public PdfPTable table;
	/** The Graphic state */
	public PdfGState gstate;
	/** A template that will hold the total number of pages. */
	public PdfTemplate tpl;
	/** The font that will be used. */
	public BaseFont helv;
	public String reportHeader;
	public ArrayList colData;
	public String username;
	private static final Logger logger = Logger.getLogger(PDFNewGenerator.class);
	private static String userName1;

	/**
	 * Costructor taking userName as input
	 * 
	 * @param userName
	 */

	public PDFNewGenerator(String userName)
	{
		// Sets the logged in user name
		userName1 = userName;
	}

	/**
	 * Method to generate the PDF with the report title,column name,report data obtained from query.It also calls the
	 * method to display the header part.
	 * 
	 * @param metaData - List of Column instances, Each instance will have Column Related Details
	 * 
	 * @param hm - HashMap which contains the data
	 * 
	 * @param pdfFullPath - An absolute path, where report should save after generate
	 * 
	 * @return - the status of report generation, true if report generated success else false
	 * 
	 * @exception Exception - throws Exception if any while report generation
	 */

	public boolean generatePDFDocument(java.util.HashMap hm, ArrayList metaData, String pdfFullPath) throws Exception
	{
		String cmName = "PDFGenerator:generatePDFDocument";
		logger.ctinfo("CTEXP00026", cmName);

		username = (String) hm.get("USERNAME");

		reportHeader = (String) hm.get("REPORT_HEADER"); // Get the report title name from hashmap
		colData = (ArrayList) metaData.get(0);
		Document document = new Document(PageSize.A4.rotate(), 25, 25, 80, 25);
		ArrayList arr = new ArrayList();

		boolean retBollean = false;
		try
		{

			PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFullPath));
			// Page Event for displaying the footer with page numbers
			writer.setPageEvent(new PDFNewGenerator(username));

			logger.ctdebug("CTEXP00119");

			document.open();

			// Displaying the title of the report
			colData = (ArrayList) metaData.get(0);
			PdfPTable dummyRow1 = new PdfPTable(colData.size());
			PdfPCell cellDummy1 = new PdfPCell(new Paragraph(reportHeader, new Font(FontFamily.TIMES_ROMAN, 12,
					Font.BOLD, BaseColor.BLACK)));
			cellDummy1.setColspan(colData.size());
			cellDummy1.setBorder(0);
			cellDummy1.setHorizontalAlignment(Element.ALIGN_CENTER);
			cellDummy1.setVerticalAlignment(Element.ALIGN_CENTER);
			cellDummy1.setMinimumHeight(80);
			dummyRow1.addCell(cellDummy1);
			document.add(dummyRow1);

			// Displaying the header details
			logger.ctinfo("CTEXP00125");

			createHeaderSection(hm, colData.size(), document);

			// Below code is used to set the width of the colums of the report
			ArrayList colWidthData = (ArrayList) metaData.get(1);
			Iterator it2 = colWidthData.iterator();

			float flt[] = new float[colWidthData.size()];
			for (int x = 0; x < colWidthData.size(); x++)
				flt[x] = Float.parseFloat((String) it2.next());
			com.itextpdf.text.pdf.PdfPTable table1 = new com.itextpdf.text.pdf.PdfPTable(flt);

			Iterator it = colData.iterator();

			// Below code displays the column names
			while (it.hasNext())
			{
				PdfPCell cellHeader = new PdfPCell(new Paragraph((String) it.next(), new Font(FontFamily.TIMES_ROMAN,
						12, Font.BOLD, BaseColor.BLACK)));
				cellHeader.setColspan(1);
				cellHeader.setBackgroundColor(BaseColor.LIGHT_GRAY);
				cellHeader.setVerticalAlignment(Element.ALIGN_CENTER);
				cellHeader.setPaddingBottom(10f);
				table1.addCell(cellHeader);
				cellHeader.setPaddingTop(100f);
				table1.setHeaderRows(1);
			}

			// Below code displays the result data obtained from hashmap
			arr = (ArrayList) hm.get("REPORT_DATA"); // Hashmap contains the results obtained from query

			Iterator itdata = arr.iterator();
			while (itdata.hasNext())
			{
				String strData[] = (String[]) itdata.next();
				for (int j = 0; j < strData.length; j++)
				{

					String checkValue = strData[j];
					logger.ctinfo("CTEXP00127", checkValue);
					boolean flag = false;
					// Below logic checks if the string is amount. If amount is found it set the flag as true
					if (checkValue.length() > 3)
					{
						if ((checkValue.charAt((checkValue.length() - 3))) == '.')
							flag = true;
					}
					PdfPCell cellRow = new PdfPCell(new Paragraph(strData[j], new Font(FontFamily.TIMES_ROMAN, 10,
							Font.NORMAL, new BaseColor(0, 0, 0))));

					// If flag is true it aligns the amount data to right
					if (flag)
					{
						cellRow.setHorizontalAlignment(Element.ALIGN_RIGHT);
						logger.ctinfo("CTEXP00128", checkValue);
					} else
					{
						// if flag is false it aligns the string to left
						cellRow.setHorizontalAlignment(Element.ALIGN_LEFT);
					}
					cellRow.setMinimumHeight(20);
					cellRow.setColspan(1);

					table1.addCell(cellRow);

				}
			}
			document.add(table1);

			PdfPTable dummyRow2 = new PdfPTable(1);
			PdfPCell cellDummy2 = new PdfPCell(new Paragraph(" ", new Font(FontFamily.TIMES_ROMAN, 12, Font.BOLD,
					new BaseColor(0, 0, 0))));
			cellDummy2.setVerticalAlignment(Element.ALIGN_CENTER);
			cellDummy2.setColspan(1);
			cellDummy2.setBorder(0);
			dummyRow2.addCell(cellDummy2);
			document.add(dummyRow2);

			ArrayList dataArray = new ArrayList();
			// Prints the Total Credit,Total Debit,Total Credit Count,Total Debit Count,Net Amount
			// in Transaction Details.
			dataArray = (ArrayList) hm.get("TOT_AMT_DET");
			PdfPTable table3 = new PdfPTable(5);
			if (dataArray != null)
			{
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

						cellLabel.setVerticalAlignment(Element.ALIGN_CENTER);
						cellLabel.setBackgroundColor(BaseColor.LIGHT_GRAY);
						table3.addCell(cellLabel);
					}
				}
				for (Iterator i = dataArray.iterator(); i.hasNext();)
				{

					String[] value = (String[]) i.next();
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
									12, Font.NORMAL, new BaseColor(0, 0, 0))));
							cellData.setHorizontalAlignment(Element.ALIGN_RIGHT);

							table3.addCell(cellData);

						} else
						{
							PdfPCell cellData = new PdfPCell(new Paragraph(value[j], new Font(FontFamily.TIMES_ROMAN,
									12, Font.NORMAL, new BaseColor(0, 0, 0))));
							cellData.setHorizontalAlignment(Element.ALIGN_CENTER);

							table3.addCell(cellData);
						}

					}
				}
			}
			document.add(table3);

			logger.ctinfo("CTEXP00129");
			retBollean = true;
		} catch (DocumentException de)
		{
			logger.cterror("CTEXP00190", de);
		} catch (IOException ioe)
		{
			logger.cterror("CTEXP00190", ioe);
		} catch (Throwable e)
		{
			logger.cterror("CTEXP00190", e);
		}
		document.close();
		return retBollean;

	}

	/**
	 * Event called when the document is open.It is used to place the header and footer in the document
	 * 
	 * @param writer
	 * @param document
	 * 
	 * @exception Exception - throws Exception if any while report generation
	 */

	public void onOpenDocument(PdfWriter writer, Document document)
	{
		try
		{

			ResourceBundle res = null;
			String imagePath = null;
			try
			{
				res = ResourceBundle.getBundle("reporting");
				imagePath = res.getString("IMAGE_PATH"); // Get the image path from properties file
				logger.ctinfo("CTEXP00130", imagePath);

			} catch (Exception e)
			{

			}
			String langID = "en_US";

			String reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_GEN, langID)
					+ " "
					+ ReportsMessageManager.getDate(langID)
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + userName1;

			headerImage = Image.getInstance(imagePath);

			table = new PdfPTable(1);
			Phrase p = new Phrase();
			Chunk ck = new Chunk(reportDate, new Font(FontFamily.TIMES_ROMAN, 10, Font.BOLDITALIC, BaseColor.BLACK));
			p.add(ck);

			table.getDefaultCell().setBorderWidth(0);
			table.addCell(p);
			table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_RIGHT);
			table.addCell(new Phrase(new Chunk(headerImage, 0, 0))); // Displays the image in header
			// initialization of the Graphic State
			gstate = new PdfGState();
			gstate.setFillOpacity(0.3f);
			gstate.setStrokeOpacity(0.3f);
			// initialization of the template
			tpl = writer.getDirectContent().createTemplate(100, 100);

			// initialization of the font
			helv = BaseFont.createFont("Helvetica", BaseFont.WINANSI, false);
		} catch (Exception e)
		{
			logger.cterror("CTEXP00190", e);
			throw new ExceptionConverter(e);
		}
	}

	/**
	 * PDFpageevent invoked to display the footer in all pages.
	 * 
	 * @param writer
	 * @param document
	 * 
	 * @exception Exception - throws Exception if any while report generation
	 */
	public void onEndPage(PdfWriter writer, Document document)
	{
		PdfContentByte cb = writer.getDirectContent();
		cb.saveState();

		table.setTotalWidth(document.right() - document.left());

		// compose the footer
		String text = "Page " + writer.getPageNumber() + " of ";
		float textSize = helv.getWidthPoint(text, 12);
		float textBase = document.bottom() - 20;
		cb.beginText();
		cb.setFontAndSize(helv, 12);
		{
			float adjust = helv.getWidthPoint("0", 12);
			cb.setTextMatrix(document.right() - textSize - adjust, textBase);
			cb.showText(text);
			cb.endText();
			cb.addTemplate(tpl, document.right() - adjust, textBase);
		}
		cb.saveState();

	}

	/**
	 * Actions to performed on closing the document
	 * 
	 * @param writer
	 * @param document
	 */

	public void onCloseDocument(PdfWriter writer, Document document)
	{
		tpl.beginText();
		tpl.setFontAndSize(helv, 12);
		tpl.setTextMatrix(0, 0);
		tpl.showText("" + (writer.getPageNumber() - 1));
		tpl.endText();
	}

	/**
	 * Below method displays the header part of jsp. It takes the hashmap which contains the header data.
	 * 
	 * @param hashmap
	 * @param size of arraylist
	 * @param document object to which the table is to be added.
	 * @exception DocumentException
	 */
	private void createHeaderSection(HashMap hmHeader, int size, Document document)
	{
		final String cmName = "PDFGenerator:createHeaderSection";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			LinkedHashMap hm = new LinkedHashMap();
			hm = (LinkedHashMap) (hmHeader.get("INPUT_PARAMS"));
			if ((hm.keySet().size()) % 2 != 0)
				hm.put("Test", "Test1");
			logger.ctinfo("CTEXP00191", hm);
			Iterator it = hm.keySet().iterator();
			String strLabel = null;
			while (it.hasNext())
			{
				strLabel = (String) it.next();
				String dispVal = (String) hm.get(strLabel);

				if (strLabel.equals("Test") && "Test1".equals(dispVal))
				{

					PdfPCell cellLabel = new PdfPCell(new Paragraph(" ", new Font(FontFamily.TIMES_ROMAN, 12,
							Font.BOLD, new BaseColor(0, 0, 0))));
					cellLabel.setColspan(2);
					table.addCell(cellLabel);
				} else
				{
					if (dispVal != null || dispVal.length() != 0 || !(dispVal.equals(" ")))
					{
						boolean flag = false;
						// Logic to check if the string is amount
						if (dispVal.length() >= 3)
						{
							if ((dispVal.charAt((dispVal.length() - 3))) == '.')
								flag = true;
						}
						logger.ctinfo("CTEXP00135", strLabel);
						PdfPCell cellLabel = new PdfPCell(new Paragraph(strLabel, new Font(FontFamily.TIMES_ROMAN, 12,
								Font.BOLD, BaseColor.BLACK)));
						cellLabel.setBackgroundColor(BaseColor.LIGHT_GRAY);
						cellLabel.setHorizontalAlignment(Element.ALIGN_LEFT);
						table.addCell(cellLabel);
						// If the string is amount then display the amount with right alignment
						if (flag)
						{
							logger.ctdebug("CTEXP00121", strLabel);
							PdfPCell cellData = new PdfPCell(new Paragraph((String) hm.get(strLabel), new Font(
									FontFamily.TIMES_ROMAN, 12, Font.NORMAL, new BaseColor(0, 0, 0))));
							cellData.setHorizontalAlignment(Element.ALIGN_RIGHT);
							table.addCell(cellData);
						} else
						{
							PdfPCell cellData = new PdfPCell(new Paragraph((String) hm.get(strLabel), new Font(
									FontFamily.TIMES_ROMAN, 12, Font.NORMAL, new BaseColor(0, 0, 0))));

							cellData.setHorizontalAlignment(Element.ALIGN_LEFT);
							table.addCell(cellData);
						}
					}
				}
			}
			document.add(table);
		} catch (DocumentException de)
		{
			logger.cterror("CTEXP00136", de);
		} catch (Throwable e)
		{
			logger.cterror("CTEXP00136", e);
		}
	}

}
