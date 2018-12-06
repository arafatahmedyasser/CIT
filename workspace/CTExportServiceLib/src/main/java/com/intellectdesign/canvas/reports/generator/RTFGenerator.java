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

import java.awt.Color;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;

import com.itextpdf.text.Element;
import com.itextpdf.text.Rectangle;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Table;
import com.lowagie.text.rtf.RtfHeaderFooter;
import com.lowagie.text.rtf.RtfWriter2;
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
 * Generates RTF Document
 * 
 * @version 1.0
 */
public class RTFGenerator
{
	private static final Logger logger = Logger.getLogger(RTFGenerator.class);

	// variable to hold the position of the data column in the string[] on which grouping needs to be done
	private int groupByColumnPosition = -1;
	// variable to hold the type(S-Subtotal) of the data column on which aggregate is done for group total
	private String groupByColumnType = ColumnMetaData.TYPE_SUB_TOTAL;
	// the label of the grouped column
	private String groupByColumnTitle = "";
	private HashMap groupTotalsContainer = null;

	/**
	 * Keys in the hashmap. 1. DATA_PROVIDER_OBJECT(HashMap) (Params HashMap to be passed to JavaDataSource). 2.
	 * REPORT_HEADER (String) 3. REPORT_FOOTER(String) 4. PAGE_HEADER(String) 5. PAGE_FOOTER(String) 6.
	 * ROWS_PER_CALL(Integer) 7. REPORT_PARAMS (HashMap) 8. CLASS_NAME(String) - Name of the implementation class
	 */
	/**
	 * The method which generates the RTF Document
	 * 
	 * @param data - Hashmap which contains the data
	 * @param metaData - List of Column instances, Each instance will have Column Related Details
	 * @param hasData - flag which checks whether data is there or not
	 * @param rtfFullPath - An absolute path, where report should save after generate
	 * @return - the status of report generation, true if report generated success else false
	 * @exception Exception - throws Exception if any while report generation
	 */
	public boolean generateRTFDocument(HashMap data, ArrayList metaData, String rtfFullPath, boolean hasData)
			throws Exception
	{
		String cmName = "RTFGenerator:generateRTFDocument";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			logger.ctdebug("CTEXP00142", data, metaData, rtfFullPath);
			
			Date currDate = new Date();
			
			GlobalPreferencesUtil gpUtil = new GlobalPreferencesUtil();
			String generatedDate = gpUtil.userPrefFormatDateAndTime(data.get("USER_DATE_FORMAT") + " "+data.get("USER_TIME_FORMAT"),
					data.get("USER_TIMEZONEID").toString(), currDate);
			
			ArrayList colMetaData = ReportUtils.getColumnMetaData(metaData);
			data.put("METADATA", colMetaData);
			data.put("GENERATED_DATE",generatedDate);
			if (!hasData)
			{
				data.put("DATA_PROVIDER_INSTANCE", Class.forName((String) data.get("CLASS_NAME")).newInstance());
			}

			logger.ctdebug("CTEXP00141", rtfFullPath);
			if (colMetaData.size() == 1)
			{
				ColumnMetaData cmd = (ColumnMetaData) colMetaData.get(0);
				if (cmd.getColumnTitle().equalsIgnoreCase("DETAIL"))
				{
					return new DetailRTFGenerator().generateRTF(data, rtfFullPath);
				}
			}
			generateRTF(data, rtfFullPath, hasData);
			return true;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw e;
		}
	}

	/**
	 * The method which generates the RTF
	 * 
	 * @param dataMap - Hashmap which contains the data
	 * @param hasData - flag which checks whether data is there or not
	 * @param path - An absolute path, where report should save after generate
	 * @exception Exception - throws Exception if any while report generation
	 */

	private void generateRTF(HashMap dataMap, String path, boolean hasData) throws Exception
	{
		String cmName = "RTFGenerator:generateRTF";
		logger.ctinfo("CTEXP00026", cmName);
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

		int rowsPerCall = 0;
		ArrayList aList = null;
		HashMap dataHash = null;
		String totalCount = null; // Total Search Results count
		JavaDataSource javaSource = null;
		boolean searchResultReqd = true;
		HashMap dataSourceParam = null;
		FileOutputStream out = null;
		String langDirection = (String) dataMap.get("DIRECTION");
		String dateCustomAlignment = configMgr.getCompPrefDescriptor().getDateColumnAlignent();
		String amtCustomAlignment = configMgr.getCompPrefDescriptor().getAmountColumnAlignent();
		String datetimeCustomAlignment = configMgr.getCompPrefDescriptor().getDateTimeColumnAlignent();
		boolean isRTL = false;
		if (langDirection != null && langDirection.trim().equals("RTL"))
		{
			isRTL = true;
			dateCustomAlignment = dateCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			amtCustomAlignment = amtCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			datetimeCustomAlignment = datetimeCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
		}
		String fontsPath = null;
		fontsPath = exportDescriptor.getFontPath();
		FontFactory.register(fontsPath + File.separator + "trado.ttf", "Traditional Arabic");
		Font arabicTraditionalNormal = FontFactory.getFont("Traditional Arabic");
		arabicTraditionalNormal.setSize(10);
		FontFactory.register(fontsPath + File.separator + "tradbdo.ttf", "Traditional Arabic Bold");
		Font arabicTraditionalBold = FontFactory.getFont("Traditional Arabic Bold");
		arabicTraditionalBold.setSize(10);
		try
		{

			String langID = (String) dataMap.get("LANGUAGE_ID");
			logger.ctdebug("CTEXP00047", langID);

			String reportTitle = (String) dataMap.get("REPORT_HEADER");
			String corpName = (String) dataMap.get("CORPORATE_NAME");
			if (corpName == null)
				corpName = "";
			String userName = (String) dataMap.get("USER_NAME");
			if (userName == null)
				userName = "";
			reportTitle = ReportsMessageManager.replacePredefined(reportTitle);

			logger.ctdebug("CTEXP00049", reportTitle);

			String reportDate = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_GEN, langID)
					+ " "
					+ (String)dataMap.get("GENERATED_DATE")
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + (String) dataMap.get("USER_NAME");
			logger.ctdebug("CTEXP00089", reportDate);

			// Create a new document
			com.lowagie.text.Document document = new com.lowagie.text.Document(); // Upgrading_Jars
			out = new FileOutputStream(new File(path));
			RtfWriter2 writer = RtfWriter2.getInstance(document, out); // Upgrading_Jars

			document.addTitle(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_DWNL_TITLE, langID));

			String imgURL = exportDescriptor.getFileDown() + exportDescriptor.getIntellectLogo();
			Image jpeg = Image.getInstance(new URL(imgURL));

			jpeg.scalePercent(100);

			RtfHeaderFooter footer = new RtfHeaderFooter(new com.lowagie.text.Phrase(ReportsMessageManager.getMessage(
					ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_F, langID)), true); // Upgrading_Jars

			footer.setBorder(Rectangle.NO_BORDER);
			footer.setAlignment(Element.ALIGN_CENTER);
			document.setFooter(footer);

			// Report header - Title
			document.open();
			document.add(jpeg);
			document.add(new Paragraph(""));
			
			Paragraph corporate = new Paragraph(corpName, new Font(Font.HELVETICA, 12, Font.NORMAL));
			corporate.setAlignment(Element.ALIGN_CENTER);
			document.add(corporate);
			
			document.add(new Paragraph(" "));
			
			Paragraph title = new Paragraph(reportTitle, new Font(Font.HELVETICA, 13, Font.BOLD));
			title.setAlignment(Element.ALIGN_CENTER);
			document.add(title);

			document.add(new Paragraph(" "));
			Paragraph date = new Paragraph(reportDate, new Font(Font.HELVETICA, 9, Font.BOLD));
			if (langDirection != null && langDirection.trim().equals("RTL"))
			{
				date.setAlignment(Element.ALIGN_LEFT);
			}
			else
			date.setAlignment(Element.ALIGN_RIGHT);
			document.add(date);
			logger.ctdebug("CTEXP00052");

			String reqID = null;
			if (dataMap.get("REQUEST_ID") != null)
			{
				reqID = (String) dataMap.get("REQUEST_ID");
			}

			if ("VECTORRTF".equals(dataMap.get("EXPORTFORMAT")) && reqID != null && !reqID.isEmpty())
			{

				String rtfImagePath = exportDescriptor.getOrgPDFPath();
				Image dataImg = Image.getInstance(new URL(exportDescriptor.getFileDown() + rtfImagePath + "/" + reqID
						+ ".png")); // Export_Label Configuration
				dataImg.scalePercent(100);
				dataImg.setAlignment(Element.ALIGN_CENTER);
				document.open();
				document.add(dataImg);
			}

			if (!hasData)
			{
				logger.ctdebug("CTEXP00053", dataMap.get("DATA_PROVIDER_INSTANCE"));
				javaSource = (JavaDataSource) dataMap.get("DATA_PROVIDER_INSTANCE");
				logger.ctdebug("CTEXP00054", dataMap.get("DATA_PROVIDER_OBJECT"));
				dataSourceParam = (HashMap) dataMap.get("DATA_PROVIDER_OBJECT");
				rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
				dataSourceParam.put("StartRowNumber", new Integer(0));
				dataHash = javaSource.execute(dataSourceParam);
				aList = (ArrayList) dataHash.get("DATA");
				totalCount = (String) dataHash.get("TOTAL_COUNT");
			} else
			{
				aList = (ArrayList) dataMap.get("DATA");
				totalCount = (String) dataMap.get("TOTAL_COUNT");
			}
			rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
			ArrayList metaDataCol = (ArrayList) dataMap.get("METADATA");

			if (totalCount == null || totalCount.isEmpty())
			{
				totalCount = "0";
			}


			searchResultReqd = Boolean.valueOf(configMgr.getCompPrefDescriptor().getSearchResultExportInd());
			if (searchResultReqd)
			{
				document.add(new Paragraph(" "));
				Paragraph searchResult = null;
				if (isRTL)
				{
					searchResult = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
							ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount, arabicTraditionalBold);
					searchResult.setAlignment(Element.ALIGN_LEFT);
				} else
				{
					searchResult = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
							ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount, new Font(Font.HELVETICA, 9,
							Font.BOLD));
					searchResult.setAlignment(Element.ALIGN_RIGHT);
				}
				document.add(searchResult);
			}

			logger.ctdebug("CTEXP00057", totalCount);
			document.add(new Paragraph(" "));

			// Identifying group by columns
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

			groupTotalsContainer = new HashMap();
			// Holds the previous record's data column value
			String prevValue = "";
			// Holds the current record data column value
			String currValue = "";

			int rowStartCount = 0;
			boolean nextSet = false;
			boolean moreData = false;
			if (aList.size() == (rowsPerCall + 1))
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

			int iCtr = 0;
			if (isRTL)
			{
				iCtr = metaDataCol.size() - 1;
			}
			// Creating table for report
			Table table = null;
			if (getGroupByColumnPosition() != -1)
			{
				table = new Table((metaDataCol.size()) - 1);
			} else
			{
				table = new Table(metaDataCol.size());
			}

			Paragraph colHead = null;
			logger.ctdebug("CTEXP00095");
			String colTitle = "";
			while (hasColumn(iCtr, metaDataCol.size(), isRTL))
			{

				if (getGroupByColumnPosition() != iCtr)
				{
					ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(iCtr);

					colTitle = ReportsMessageManager.getMessage(
							(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), "LBL_"+cmd.getColumnTitle(), langID);
					if(colTitle.equals("LBL_"+cmd.getColumnTitle()))
						colTitle=cmd.getColumnTitle();
					colHead = new Paragraph(colTitle, new Font(Font.HELVETICA, 10, Font.BOLD, new Color(0, 0, 0)));
					//Column Header direction
					int columnHeadDirection = isRTL?Element.ALIGN_RIGHT:Element.ALIGN_LEFT;
					colHead.setAlignment(columnHeadDirection);
					table.addCell(ReportUtils.getTableHeaderCell(colHead));
				}
				if (isRTL)
				{
					iCtr--; // For RTL
				} else
				{
					iCtr++; // For LTR
				}
			}
			// table.endHeaders(); //Upgrading_Jars
			logger.ctdebug("CTEXP00096");

			Paragraph groupHeader = null;
			Paragraph groupFooter = null;
			logger.ctdebug("CTEXP00097");
			int iDataColCtr = 0;
			if (isRTL)
			{
				iDataColCtr = metaDataCol.size() - 1;
			}

			for (iCtr = 0; iCtr < aList.size(); iCtr++)
			{
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
							// Displaying Group header

							groupHeader = new Paragraph(ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), "LBL_"+getGroupByColumnTitle(),
									langID) + "  :  " + currValue, new Font(Font.HELVETICA, 10, Font.BOLD, new Color(0,
									0, 0)));

							table.addCell(ReportUtils.getGroupHeaderCell(groupHeader, (metaDataCol.size()) - 1));
						} else
						{
							// Displaying Group footer
							renderGroupFooter(table, dataMap, groupFooter);
							// Group header after footer information

							groupHeader = new Paragraph(ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY),"LBL_"+ getGroupByColumnTitle(),
									langID) + "  :  " + currValue, new Font(Font.HELVETICA, 10, Font.BOLD, new Color(0,
									0, 0)));

							groupHeader.setAlignment(Element.ALIGN_LEFT); // Upgrading_Jars starts
							table.addCell(ReportUtils.getGroupHeaderCell(groupHeader, (metaDataCol.size()) - 1));
						}
						prevValue = currValue;
					}
				}

				String strData = null;
				Paragraph dataCell = null;
				int iDataCollCtr = 0;
				if (isRTL)
				{
					iDataCollCtr = metaDataCol.size() - 1;
				}
				while (hasColumn(iDataCollCtr, metaDataCol.size(), isRTL))
				{

					if (getGroupByColumnPosition() != iDataCollCtr)
					{
						strData = rowData[iDataCollCtr];
						dataCell = new Paragraph(strData, new Font(Font.HELVETICA, 10, Font.NORMAL));

						ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(iDataCollCtr);
						String colType = cmd.getColumnType();

						if (colType.equals(ColumnMetaData.TYPE_NUMERIC))
						{
							if (amtCustomAlignment != null && "LEFT".equalsIgnoreCase(amtCustomAlignment))
								dataCell.setAlignment(Element.ALIGN_LEFT);
							else if (amtCustomAlignment != null && "CENTER".equalsIgnoreCase(amtCustomAlignment))
								dataCell.setAlignment(Element.ALIGN_CENTER);
							else
								dataCell.setAlignment(Element.ALIGN_RIGHT);
						} else if (colType.equals(ColumnMetaData.TYPE_ALPHANUMERIC_R))
						{
							dataCell.setAlignment(Element.ALIGN_RIGHT);
						} else if (colType.equals(ColumnMetaData.TYPE_DATE))
						{
							if (dateCustomAlignment != null && "LEFT".equalsIgnoreCase(dateCustomAlignment))
								dataCell.setAlignment(Element.ALIGN_LEFT);
							else if (dateCustomAlignment != null && "CENTER".equalsIgnoreCase(dateCustomAlignment))
								dataCell.setAlignment(Element.ALIGN_CENTER);
							else
								dataCell.setAlignment(Element.ALIGN_RIGHT);
						} else if (colType.equals(ColumnMetaData.TYPE_DATE_TIME))
						{
							if (datetimeCustomAlignment != null && "LEFT".equalsIgnoreCase(datetimeCustomAlignment))
								dataCell.setAlignment(Element.ALIGN_LEFT);
							else if (datetimeCustomAlignment != null
									&& "CENTER".equalsIgnoreCase(datetimeCustomAlignment))
								dataCell.setAlignment(Element.ALIGN_CENTER);
							else
								dataCell.setAlignment(Element.ALIGN_RIGHT);
						} else if (colType.equals(ColumnMetaData.TYPE_SUB_TOTAL))
						{
							dataCell.setAlignment(Element.ALIGN_RIGHT);
						} else
						{
							if(isRTL)
								{
								 dataCell.setAlignment(Element.ALIGN_RIGHT);
								}
							else
							dataCell.setAlignment(Element.ALIGN_LEFT);
						}
						table.addCell(ReportUtils.getTableBodyCell(dataCell));

					}
					if (isRTL)
					{
						iDataCollCtr--; // For RTL
					} else
					{
						iDataCollCtr++; // For LTR
					}
				}
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					// Bugfix for wrong sub total.
					if (!(moreData && iDataColCtr == aList.size() - 2))
					{
						// update the datacolumn values to the container so that the group totals
						// can be displayed in the group footer.
						updateGroupTotals(dataMap, rowData);
						if (iDataColCtr == aList.size() - 1)
						{
							// Displaying Group footer
							renderGroupFooter(table, dataMap, groupFooter);

						}
					}
				}
				if (moreData && iDataColCtr == aList.size() - 2)
				{
					// GET NEXT SET
					rowStartCount += rowsPerCall;
					if (!hasData)
					{
						dataSourceParam.put("StartRowNumber", new Integer(rowStartCount));

						dataHash = javaSource.execute(dataSourceParam);
						aList = (ArrayList) dataHash.get("DATA");
					}
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
					// RESET
					iDataColCtr = -1;
					nextSet = true;
				}
				if (isRTL)
				{
					iDataColCtr--; // For RTL
				} else
				{
					iDataColCtr++; // For LTR
				}
			}// END OF FOR
			logger.ctdebug("CTEXP00098");

			document.add(table); // Upgrading_Jars

			Paragraph summDataCell = null;

			summDataCell = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_SUMM, langID), new Font(Font.HELVETICA, 10, Font.BOLD));

			if (dataMap.containsKey("SUMMARY"))
			{
				document.add(summDataCell);
				logger.ctdebug("CTEXP00100");
				HashMap sumMap = (HashMap) dataMap.get("SUMMARY");
				ArrayList sumList = (ArrayList) sumMap.get("SUMMARY_LIST");
				logger.ctdebug("CTEXP00069", sumMap, sumList);

				if (sumList != null && sumList.size() > 0)
				{
					Table summTable = new Table(2);

					logger.ctdebug("CTEXP00070");
					summDataCell = new Paragraph("", new Font(Font.HELVETICA, 10, Font.NORMAL));
					document.add(summDataCell);

					for (iCtr = 0; iCtr < sumList.size(); iCtr++)
					{
						SummaryData sumData = (SummaryData) sumList.get(iCtr);
						String strData[] = sumData.getData();

						summDataCell = new Paragraph(ReportsMessageManager.getMessage(
								(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), strData[0], langID), new Font(
								Font.HELVETICA, 10, Font.NORMAL));

						summDataCell.setAlignment(Element.ALIGN_LEFT);

						summTable.addCell(ReportUtils.getSummTableCell(summDataCell, ((int) (6.7 * 45)), 1));
						StringBuffer summaryString = new StringBuffer();
						for (int j = 1; j < strData.length; j++)
						{

							summaryString.append(ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), strData[j], langID)
									+ "      ");

						}
						summDataCell = new Paragraph(summaryString.toString(),
								new Font(Font.HELVETICA, 10, Font.NORMAL));
						summDataCell.setAlignment(Element.ALIGN_LEFT);

						summTable.addCell(ReportUtils.getSummTableCell(summDataCell, ((int) (6.7 * 55)), 1));
					}
					logger.ctdebug("CTEXP00102");
					document.add(summTable);
				}

				HashMap paramsMap = (HashMap) sumMap.get("PARAMS");
				logger.ctdebug("CTEXP00143", paramsMap);
				document.add(new Paragraph(" "));
				document.add(new Paragraph(" "));
				if (paramsMap != null)
				{
					logger.ctdebug("CTEXP00103");
					Iterator it = paramsMap.keySet().iterator();

					if (it.hasNext())
					{

						summDataCell = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
								ReportingConstants.EZ_SEL_CRIT, langID), new Font(Font.HELVETICA, 10, Font.BOLD));

						document.add(summDataCell);
						document.add(new Paragraph(" "));
						Table searchCritTable = new Table(2);

						while (it.hasNext())
						{
							String pkey = (String) it.next();
							String value = (String) paramsMap.get(pkey);

							pkey = ReportsMessageManager.getMessage(
									(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), pkey, langID);

							summDataCell = new Paragraph(pkey, new Font(Font.HELVETICA, 10, Font.NORMAL));

							searchCritTable
									.addCell(ReportUtils.getSearchTableCell(summDataCell, ((int) (6.7 * 30)), 1));
							summDataCell = new Paragraph(ReportUtils.nullHandler(value, ""), new Font(Font.HELVETICA,
									10, Font.NORMAL));
							searchCritTable
									.addCell(ReportUtils.getSearchTableCell(summDataCell, ((int) (6.7 * 70)), 1));
						}
						document.add(searchCritTable);
					}
					logger.ctdebug("CTEXP00104");
				}
			}
			logger.ctdebug("CTEXP00144");
			document.close();
			out.close();
			logger.ctdebug("CTEXP00145");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
		} finally
		{
			try
			{
				if (out != null)
					out.close();

			} catch (Exception ee)
			{
				logger.cterror("CTEXP00038", ee);
			}
		}
	}

	/**
	 * This method is used check group total count in column meta data and to put the same in
	 * groupTotalsContainer(insatance varibale) hash map.
	 * 
	 * @param hMap - From where list of columns METADATA would get
	 * @param rowData - String array of row data
	 * @exception - throws java.lnag.Exception
	 */

	private void updateGroupTotals(HashMap hMap, String[] rowData) throws Exception
	{
		String cmName = "RTFGenerator:updateGroupTotals";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			ArrayList metaDataColl = (ArrayList) hMap.get("METADATA");
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
	 * @param GroupByColumnPosition to set
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
	 * @param GroupByColumnType to set
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
	 * @param GroupByColumnTitle to set
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
	 * @param: Table table
	 * @param: Paragraph groupFooter
	 * @return: None
	 * @throws Exception
	 * */
	private void renderGroupFooter(Table table, HashMap hMap, Paragraph groupFooter) throws Exception
	{
		String cmName = "RTFGenerator:renderGroupFooter";
		logger.ctinfo("CTEXP00026", cmName);
		int metaColSize = 0;
		try
		{
			ArrayList metaDataColl = (ArrayList) hMap.get("METADATA");
			if (getGroupByColumnPosition() != -1)
				metaColSize = metaDataColl.size() - 1;
			else
				metaColSize = metaDataColl.size();

			for (int iCtr = 0; iCtr < metaDataColl.size(); iCtr++)
			{
				if (getGroupByColumnPosition() != iCtr)
				{
					ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iCtr);
					if (groupTotalsContainer.containsKey(cmd.getColumnTitle()) == true)
					{
						groupFooter = new Paragraph(""
								+ ((Double) groupTotalsContainer.get(cmd.getColumnTitle())).doubleValue(), new Font(
								Font.HELVETICA, 10, Font.BOLD, new Color(0, 0, 0)));
						groupFooter.setAlignment(Element.ALIGN_RIGHT);
						table.addCell(ReportUtils.getGroupFooterCell(groupFooter));
						// Reinitialize the containers to hold the running totals of the next group
						groupTotalsContainer.put(cmd.getColumnTitle(), new Double(0));
					} else
					{
						groupFooter = new Paragraph("", new Font(Font.HELVETICA, 10, Font.BOLD, new Color(0, 0, 0)));
						groupFooter.setAlignment(Element.ALIGN_RIGHT);
						table.addCell(ReportUtils.getGroupFooterCell(groupFooter));
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
	 * API to check whether it has column
	 * 
	 * @param: currentValue of the column
	 * @param: colSize total column size
	 * @param: isRTL
	 * @return: Returns Boolean true if all columns are covered
	 * 
	 * */
	private boolean hasColumn(int currentValue, int colSize, boolean isRTL)
	{ // For RTL
		boolean check = true;
		if (isRTL)
		{
			check = currentValue > -1; // eg: 5 > -1
		} else
		{
			check = currentValue < colSize; // eg: 0 < 6
		}
		return check;
	}

}