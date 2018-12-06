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
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.itextpdf.text.Element;
import com.itextpdf.text.Image;
import com.itextpdf.text.Rectangle;
import com.lowagie.text.Cell;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Table;
import com.lowagie.text.html.HtmlWriter;
import com.lowagie.text.rtf.RtfHeaderFooter;
import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.datasource.JavaDataSource;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;
import com.intellectdesign.canvas.reports.ColumnMetaData;
import com.intellectdesign.canvas.reports.SummaryData;

/**
 * This class is used to generate html report by help of iText API.
 * 
 * @version 1.0
 */
public class HTMLGenerator
{

	/**
	 * Sets group by column position @ param groupByColumnPosition - group by column position value
	 * 
	 * @param groupByColumnPosition int
	 */
	public void setGroupByColumnPosition(int groupByColumnPosition)
	{
		this.groupByColumnPosition = groupByColumnPosition;
	}

	/**
	 * Return group by column position value
	 * 
	 * @return Returns group by column position value
	 */
	public int getGroupByColumnPosition()
	{
		return groupByColumnPosition;
	}

	/**
	 * Sets group by column type 
	 * @param groupByColumnType - group by column type value
	 */
	public void setGroupByColumnType(String groupByColumnType)
	{
		this.groupByColumnType = groupByColumnType;
	}

	/**
	 * Returns group by column type value
	 * 
	 * @return Returns the group by column type value
	 */
	public String getGroupByColumnType()
	{
		return groupByColumnType;
	}

	/**
	 * Sets group by column title 
	 * @param groupByColumnTitle - group by column title value
	 */
	public void setGroupByColumnTitle(String groupByColumnTitle)
	{
		this.groupByColumnTitle = groupByColumnTitle;
	}

	/**
	 * Returns group by column title value
	 * 
	 * @return String
	 */
	public String getGroupByColumnTitle()
	{
		return groupByColumnTitle;
	}

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
	 * @param htmlFullPath - An absolute path, where report should save after generate
	 * @param hasData - boolean
	 * @return - the status of report generation, true if report generated success else false
	 * @throws Exception - throws Exception if any while report generation
	 */
	public boolean generateHtmlDocument(HashMap data, ArrayList metaData, String htmlFullPath, boolean hasData)
			throws Exception
	{
		String cmName = "HTMLGenerator:generateHtmlDocument";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			logger.ctdebug("CTEXP00088", data, metaData, htmlFullPath);

			ArrayList colMetaData = ReportUtils.getColumnMetaData(metaData);
			data.put("METADATA", colMetaData);
			data.put("GENERATED_DATE", new Date().toString());
			if (!hasData)
			{
				data.put("DATA_PROVIDER_INSTANCE", Class.forName((String) data.get("CLASS_NAME")).newInstance());
				logger.ctdebug("CTEXP00044", data.get("CLASS_NAME"));
			}
			logger.ctdebug("CTEXP00045", colMetaData.size());

			boolean status = generateHtml(data, htmlFullPath, hasData);
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
	 * @param dataMap - this map contains vital info like 1. DATA_PROVIDER_OBJECT(HashMap) (Params HashMap to be passed to
	 *            JavaDataSource). 2. REPORT_HEADER (String) 3. REPORT_FOOTER(String) 4. PAGE_HEADER(String) 5.
	 *            PAGE_FOOTER(String) 6. ROWS_PER_CALL(Integer) 7. REPORT_PARAMS (HashMap) 8. CLASS_NAME(String) - Name
	 *            of the implementation class 9. METADATA(ArrayList) - ColumnMetaData instances 10.
	 *            GENERATED_DATE(String) 11. DATA_PROVIDER_INSTANCE - An instance of the implementation class
	 * @param path - An absolute path, where report should save after generate
	 * @param hasData - flag which checks whether data is there or not
	 * @return - the status of report generation, true if report generated success else false
	 * @throws Exception - throws Exception if any while report generation
	 */
	private boolean generateHtml(HashMap dataMap, String path, boolean hasData) throws Exception
	{
		String cmName = "HTMLGenerator:generateHtml";
		logger.ctinfo("CTEXP00026", cmName);
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
		int dataListSize = 0;
		int rowsPerCall = 0;
		boolean status = false;
		boolean searchResultReqd = true;
		ArrayList dataList = null;
		HashMap dataHash = null;
		String totalCount = null; // Total Search Results count
		JavaDataSource javaSource = null;
		HashMap dataSourceParam = null;
		FileOutputStream out = null;

		String dateCustomAlignment = configMgr.getCompPrefDescriptor().getDateColumnAlignent();
		String amtCustomAlignment = configMgr.getCompPrefDescriptor().getAmountColumnAlignent();
		String datetimeCustomAlignment = configMgr.getCompPrefDescriptor().getDateTimeColumnAlignent();
		String fontsPath = null;
		try
		{
			fontsPath = exportDescriptor.getFontPath();
			FontFactory.register(fontsPath + File.separator +"trado.ttf", "Traditional Arabic");
		}
		catch(Exception e)
		{
			fontsPath = exportDescriptor.getXmlFolderPath();
			fontsPath = fontsPath + File.separator + "fonts";
			FontFactory.register(fontsPath + File.separator +"trado.ttf", "Traditional Arabic");
		}
		
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
					+ ReportsMessageManager.getDate(langID).toUpperCase()
					+ " "
					+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
							langID) + " " + (String) dataMap.get("USER_NAME");
			logger.ctdebug("CTEXP00089", reportDate);

			com.lowagie.text.Document document = new com.lowagie.text.Document(); // Upgrading_Jars starts
			logger.ctdebug("CTEXP00090", path);
			out = new FileOutputStream(new File(path));
			HtmlWriter.getInstance(document, out);

			if (dataMap.get("ONLY_CONTENT") != null && !(Boolean) dataMap.get("ONLY_CONTENT"))
			{
				document.addTitle(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
						ReportingConstants.EZ_DWNL_TITLE, langID));
			}

			String imgURL = exportDescriptor.getIntellectLogo();
			Image jpeg = Image.getInstance(imgURL);
			logger.ctdebug("CTEXP00091", jpeg.getScaledHeight());
			logger.ctdebug("CTEXP00092", jpeg.getScaledWidth());
			jpeg.scaleAbsolute(jpeg.getScaledWidth(), jpeg.getScaledHeight());

			RtfHeaderFooter footer = new RtfHeaderFooter(new Phrase(ReportsMessageManager.getMessage(
					ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_F, langID)));
			footer.setBorder(Rectangle.NO_BORDER);
			footer.setAlignment(Element.ALIGN_CENTER);

			document.open();

			boolean isRTL = false;
			String langDirection = (String) dataMap.get("DIRECTION");
			if (langDirection != null && langDirection.trim().equals("RTL"))
			{
				isRTL = true;
			}
			if (dataMap.get("ONLY_CONTENT") != null && !(Boolean) dataMap.get("ONLY_CONTENT"))
			{
				document.setFooter(footer);

				// Report header - Title
				document.add((com.lowagie.text.Element) jpeg);
				document.add(new Paragraph(""));
				Paragraph title = new Paragraph(reportTitle, HELVETICA_12_BOLD);
				title.setAlignment(Element.ALIGN_CENTER);
				document.add(title);

				Paragraph corporate = new Paragraph(corpName, HELVETICA_12_BOLD);
				corporate.setAlignment(Element.ALIGN_CENTER);
				document.add(corporate);

				// Report header - Date/Time
				document.add(emptyPara);
				Paragraph date = new Paragraph(reportDate, HELVETICA_8_ITALIC);
				date.setAlignment(Element.ALIGN_RIGHT);
				document.add(date);
				logger.ctdebug("CTEXP00052");
			}

			if (!hasData)
			{
				// Data Source connectivity
				logger.ctdebug("CTEXP00053", dataMap.get("DATA_PROVIDER_INSTANCE"));
				javaSource = (JavaDataSource) dataMap.get("DATA_PROVIDER_INSTANCE");
				logger.ctdebug("CTEXP00054", dataMap.get("DATA_PROVIDER_OBJECT"));
				javaSource = (JavaDataSource) dataMap.get("DATA_PROVIDER_INSTANCE");
				dataSourceParam = (HashMap) dataMap.get("DATA_PROVIDER_OBJECT");
				rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
				dataSourceParam.put("StartRowNumber", new Integer(0));
				dataHash = javaSource.execute(dataSourceParam);
				dataList = (ArrayList) dataHash.get("DATA");
				logger.ctdebug("CTEXP00055", dataList);
				totalCount = (String) dataHash.get("TOTAL_COUNT");
			} else
			{
				dataList = (ArrayList) dataMap.get("DATA");
				totalCount = (String) dataMap.get("TOTAL_COUNT");
			}
			dataListSize = dataList.size();
			rowsPerCall = ((Integer) dataMap.get("ROWS_PER_CALL")).intValue();
			ArrayList metaDataCol = (ArrayList) dataMap.get("METADATA");
			logger.ctdebug(" CTEXP00056", metaDataCol);
			// Total Search Results count
			if (totalCount == null || totalCount.isEmpty())
			{
				totalCount = "0";
			}
			searchResultReqd = Boolean.valueOf(configMgr.getCompPrefDescriptor().getSearchResultExportInd());
			if (searchResultReqd)
			{
				logger.ctdebug("CTEXP00057", totalCount);
				document.add(emptyPara);
				Paragraph searchResult = null;
				if (isRTL)
				{
					searchResult = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
							ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount, arabicTraditionalBold);
					searchResult.setAlignment(Element.ALIGN_LEFT);
				} else
				{
					searchResult = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
							ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount, new Font(Font.HELVETICA, 10,
							Font.BOLD));
					searchResult.setAlignment(Element.ALIGN_RIGHT);
				}
				document.add(searchResult); // Upgrading_Jars starts
			}
			Map additionalData = (Map) dataMap.get("ADDL_DATA");

			if (additionalData != null && (additionalData).containsKey("FILTER_DATE_FIELD"))
			{
				document.add(emptyPara);
				Paragraph searchCriterea = null;
				String field = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
						(String) additionalData.get("FILTER_DATE_FIELD"), langID);
				String valueDate1 = (String) additionalData.get("FILTER_DATE_VALUE_DATE");
				String valueDate2 = (String) additionalData.get("FILTER_DATE_VALUE_DATE2");
				String fromLabel = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, "REP_FROM", langID);
				String toLabel = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, "REP_TO", langID);
				if (isRTL)
				{
					searchCriterea = new Paragraph(field + " " + fromLabel + " " + valueDate1 + " " + toLabel + " "
							+ valueDate2, arabicTraditionalBold);
				} else
				{
					searchCriterea = new Paragraph(field + " " + fromLabel + " " + valueDate1 + " " + toLabel + " "
							+ valueDate2, new Font(Font.HELVETICA, 10, Font.BOLD));
				}
				searchCriterea.setAlignment(Element.ALIGN_CENTER);
				document.add(searchCriterea); // Upgrading_Jars ends
			}
			document.add(emptyPara); // Upgrading_Jars ends
			int colMetaDataSize = metaDataCol.size();
			// Identifying group by columns
			for (int metaDataIndex = 0; metaDataIndex < colMetaDataSize; metaDataIndex++)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(metaDataIndex);
				// Note: the assumption is there will be only one data column on which grouping is done.
				// the subsequent data columns are ignored after first occurence
				if (cmd.getIsGroup())
				{
					logger.ctdebug("CTEXP00094", cmd.getColumnTitle(), metaDataIndex);
					setGroupByColumnPosition(metaDataIndex);
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

			// Creating table for report
			Table table = null;
			// the position will be -1 when no grouping needs to be done on any data column
			if (getGroupByColumnPosition() != -1)
			{
				table = new Table(colMetaDataSize - 1);
			} else
			{
				table = new Table(colMetaDataSize);
			}

			// Disp column headings;
			Paragraph colHead = null;
			logger.ctdebug("CTEXP00095");
			String colTitle = "";
			int colCounter = 0;
			if (isRTL)
			{
				colCounter = metaDataCol.size() - 1;
			}

			while (hasColumn(colCounter, colMetaDataSize, isRTL))
			{
				if (getGroupByColumnPosition() != colCounter)
				{
					ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(colCounter);
					colTitle = ReportsMessageManager.getMessage(
							(String) dataMap.get(ReportingConstants.WID_BUNDLE_KEY), cmd.getColumnTitle(), langID);
					if (isRTL)
					{
						colHead = new Paragraph(colTitle, arabicTraditionalBold);
					} else
					{
						colHead = new Paragraph(colTitle, colHeaderfont);
					}
					table.addCell(ReportUtils.getTableHeaderCell(colHead));
				}
				if (isRTL)
				{
					colCounter--; // For RTL
				} else
				{
					colCounter++; // For LTR
				}
			}

			logger.ctdebug("CTEXP00096");

			Paragraph groupHeader = null;
			Paragraph groupFooter = null;
			logger.ctdebug("CTEXP00097");
			for (int dataIndex = 0; dataIndex < dataListSize; dataIndex++)
			{
				String[] rowData = (String[]) dataList.get(dataIndex);
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					currValue = rowData[getGroupByColumnPosition()];
					// if the previous value and the current value are not same
					// then the end of that group is reached. Dump the group footer and start the new group
					if (!currValue.equals(prevValue))
					{
						if (dataIndex == 0 && !nextSet)
						{
							// Displaying Group header
							groupHeader = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
									getGroupByColumnTitle(), langID) + "  :  " + currValue, colHeaderfont);
							table.addCell(ReportUtils.getGroupHeaderCell(groupHeader, (metaDataCol.size()) - 1));
						} else
						{
							// Displaying Group footer
							renderGroupFooter(table, dataMap, groupFooter);
							// Group header after footer information
							groupHeader = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
									getGroupByColumnTitle(), langID) + "  :  " + currValue, colHeaderfont);
							groupHeader.setAlignment(Element.ALIGN_LEFT); // Upgrading_Jars starts
							table.addCell(ReportUtils.getGroupHeaderCell(groupHeader, (metaDataCol.size()) - 1));
						}
						prevValue = currValue;
					}
				}

				int iColumnCtr = 0;
				if (isRTL)
				{
					iColumnCtr = metaDataCol.size() - 1;
				}
				String strData = null;
				Paragraph dataCell = null;

				while (hasColumn(iColumnCtr, metaDataCol.size(), isRTL))
				{
					if (getGroupByColumnPosition() != iColumnCtr)
					{
						strData = rowData[iColumnCtr];
						if (strData == null || strData.trim().equals(""))
						{
							strData = "- -";
						}
						dataCell = new Paragraph(strData, new Font(Font.HELVETICA, 10, Font.NORMAL));

						ColumnMetaData cmd = (ColumnMetaData) metaDataCol.get(iColumnCtr);
						String colType = cmd.getColumnType();
						// Upgrading_Jars starts
						if (colType.equals(ColumnMetaData.TYPE_NUMERIC))
						{
							if (amtCustomAlignment != null && "LEFT".equalsIgnoreCase(amtCustomAlignment))
							{
								dataCell.setAlignment(Element.ALIGN_LEFT);
							} else if (amtCustomAlignment != null && "CENTER".equalsIgnoreCase(amtCustomAlignment))
							{
								dataCell.setAlignment(Element.ALIGN_CENTER);
							} else
							{
								dataCell.setAlignment(Element.ALIGN_RIGHT);
							}
						} else if (colType.equals(ColumnMetaData.TYPE_ALPHANUMERIC_R))
						{
							dataCell.setAlignment(Element.ALIGN_RIGHT);
						} else if (colType.equals(ColumnMetaData.TYPE_DATE))
						{
							if (dateCustomAlignment != null && "LEFT".equalsIgnoreCase(dateCustomAlignment))
							{
								dataCell.setAlignment(Element.ALIGN_LEFT);
							} else if (dateCustomAlignment != null && "CENTER".equalsIgnoreCase(dateCustomAlignment))
							{
								dataCell.setAlignment(Element.ALIGN_CENTER);
							} else
							{
								dataCell.setAlignment(Element.ALIGN_RIGHT);
							}
						} else if (colType.equals(ColumnMetaData.TYPE_DATE_TIME))
						{
							if (datetimeCustomAlignment != null && "LEFT".equalsIgnoreCase(datetimeCustomAlignment))
							{
								dataCell.setAlignment(Element.ALIGN_LEFT);
							} else if (datetimeCustomAlignment != null
									&& "CENTER".equalsIgnoreCase(datetimeCustomAlignment))
							{
								dataCell.setAlignment(Element.ALIGN_CENTER);
							} else
							{
								dataCell.setAlignment(Element.ALIGN_RIGHT);
							}
						} else if (colType.equals(ColumnMetaData.TYPE_SUB_TOTAL))
						{
							dataCell.setAlignment(Element.ALIGN_RIGHT);
						} else
						{
							dataCell.setAlignment(Element.ALIGN_LEFT);
						}
						table.addCell(ReportUtils.getTableBodyCell(dataCell));
					}
					if (isRTL)
					{
						iColumnCtr--; // For RTL
					} else
					{
						iColumnCtr++; // For LTR
					}
				}
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					if (!(moreData && dataIndex == dataListSize - 2))
					{
						// update the datacolumn values to the container so that the group totals
						// can be displayed in the group footer.
						updateGroupTotals(dataMap, rowData);
						if (dataIndex == dataListSize - 1)
						{
							// Displaying Group footer
							renderGroupFooter(table, dataMap, groupFooter);
						}
					}
				}
				if (moreData && dataIndex == dataListSize - 2)
				{
					// GET NEXT SET
					rowStartCount += rowsPerCall;
					if (!hasData)
					{
						dataSourceParam.put("StartRowNumber", new Integer(rowStartCount));

						dataHash = javaSource.execute(dataSourceParam);
						dataList = (ArrayList) dataHash.get("DATA");
					} else
						dataList = (ArrayList) dataMap.get("DATA");
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
					nextSet = true;
				}
			}// END OF FOR

			int totalRecCount = 0;
			try
			{
				if (totalCount != null && !totalCount.isEmpty())
					totalRecCount = Integer.parseInt(totalCount);
				else
					totalRecCount = 0;
			} catch (NullPointerException nullPointExp)
			{
				totalRecCount = 0;
			} catch (NumberFormatException numberFormatExp)
			{
				totalRecCount = 0;
			}
			if (totalRecCount < 1)
			{
				String strData = (String) dataMap.get(ReportingConstants.EZREPORTS_NO_DATA_MSG);
				Paragraph dataCell = null;
				if (isRTL)
				{
					dataCell = new Paragraph(strData, arabicTraditionalNormal);
					dataCell.setAlignment(Element.ALIGN_RIGHT);
				} else
				{
					dataCell = new Paragraph(strData, new Font(Font.HELVETICA, 10, Font.NORMAL));
					dataCell.setAlignment(Element.ALIGN_LEFT);
				}
				Cell body = ReportUtils.getTableBodyCell(dataCell);
				body.setColspan(metaDataCol.size());
				table.addCell(body);
			}
			document.add(table); // Upgrading_Jars
			logger.ctdebug("CTEXP00098");
			document.add(emptyPara); // Upgrading_Jars
			logger.ctdebug("CTEXP00099");
			Paragraph summDataCell = null;
			summDataCell = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
					ReportingConstants.EZ_REP_SUMM, langID), new Font(Font.HELVETICA, 10, Font.BOLD));

			if (dataMap.containsKey("SUMMARY"))
			{
				document.add(summDataCell); // Upgrading_Jars
				logger.ctdebug("CTEXP00100");
				HashMap sumMap = (HashMap) dataMap.get("SUMMARY");
				ArrayList sumList = (ArrayList) sumMap.get("SUMMARY_LIST");
				logger.ctdebug("CTEXP00069", sumMap, sumList);

				int sumListSize = 0;
				if (sumList != null)
				{
					sumListSize = sumList.size();
					if (sumListSize > 0)
					{
						Table summTable = new Table(2);
						logger.ctdebug("CTEXP00101");
						summDataCell = new Paragraph("", new Font(Font.HELVETICA, 10, Font.NORMAL));
						document.add(summDataCell);

						for (int iCtr = 0; iCtr < sumListSize; iCtr++)
						{
							SummaryData sumData = (SummaryData) sumList.get(iCtr);
							String strData[] = sumData.getData();
							int strDataSize = strData.length;
							summDataCell = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
									strData[0], langID), new Font(Font.HELVETICA, 10, Font.NORMAL));
							summDataCell.setAlignment(Element.ALIGN_LEFT);
							summTable.addCell(ReportUtils.getSummTableCell(summDataCell, ((int) (6.7 * 45)), 1));
							StringBuffer summaryString = new StringBuffer();
							for (int j = 1; j < strDataSize; j++)
							{
								summaryString.append(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
										strData[j], langID) + "      ");
							}
							summDataCell = new Paragraph(summaryString.toString(), new Font(Font.HELVETICA, 10,
									Font.NORMAL));
							summDataCell.setAlignment(Element.ALIGN_LEFT);
							summTable.addCell(ReportUtils.getSummTableCell(summDataCell, ((int) (6.7 * 55)), 1));
						}
						logger.ctdebug("CTEXP00102");
						document.add(summTable); // Upgrading_Jars
					}
				}

				HashMap paramsMap = (HashMap) sumMap.get("PARAMS");
				logger.ctdebug("CTEXP00143", paramsMap);
				document.add(emptyPara);
				document.add(emptyPara);
				if (paramsMap != null)
				{
					logger.ctdebug("CTEXP00103");
					Iterator it = paramsMap.keySet().iterator();

					if (it.hasNext())
					{
						summDataCell = new Paragraph(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
								ReportingConstants.EZ_SEL_CRIT, langID), new Font(Font.HELVETICA, 10, Font.BOLD));
						document.add(summDataCell);
						document.add(emptyPara);
						Table searchCritTable = new Table(2);

						while (it.hasNext())
						{
							String pkey = (String) it.next();
							String value = (String) paramsMap.get(pkey);
							pkey = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, pkey, langID);
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
			logger.ctdebug("CTEXP00105");
			document.close();
			out.close();
			logger.ctdebug("CTEXP00106");
			status = true;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			status = false;
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
		logger.ctdebug("CTEXP00081", status);
		logger.ctinfo("CTEXP00017", cmName);
		return status;
	}

	/**
	 * This method is used check group toatl count in column meta data and to put the same in
	 * groupTotalsContainer(insatance varibale) hash map.
	 * 
	 * @param hMap - From where list of columns METADATA would get
	 * @param rowData - String array of row data
	 * @throws Exception
	 */
	private void updateGroupTotals(HashMap hMap, String[] rowData) throws Exception
	{
		String cmName = "HTMLGenerator:updateGroupTotals";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			ArrayList metaDataColl = (ArrayList) hMap.get("METADATA");
			int metaDataSize = metaDataColl.size();
			logger.ctdebug("CTEXP00192", metaDataSize);
			for (int index = 0; index < metaDataSize; index++)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(index);
				if (cmd.getColumnType().equals(ColumnMetaData.TYPE_SUB_TOTAL))
				{
					// if the data column does not exist in the container create one.
					if (groupTotalsContainer.containsKey(cmd.getColumnTitle()) == false)
					{
						groupTotalsContainer.put(cmd.getColumnTitle(), new Double(0));
					}
					logger.ctdebug("CTEXP00107", cmd.getColumnTitle());
					Double doubleOb = new Double((String) groupTotalsContainer.get(cmd.getColumnTitle()));
					double doubleValue = doubleOb.doubleValue() + Double.parseDouble(rowData[index]);
					logger.ctdebug("CTEXP00108", doubleValue);
					groupTotalsContainer.put(cmd.getColumnTitle(), new Double(doubleValue));
				}
			}
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw e;
		}
		logger.ctinfo("CTEXP00017", cmName);
	}

	/**
	 * This method is used to renders groups footer look and fell and addes the same foort to table @ table - to which
	 * rendered group footer needs to add @ groupFooter - the footer @ hMap - From where list of columns METADATA would
	 * get
	 * 
	 * 
	 * @param table
	 * @param hMap
	 * @param groupFooter
	 * @throws Exception
	 */
	private void renderGroupFooter(Table table, HashMap hMap, Paragraph groupFooter) throws Exception
	{
		String cmName = "HTMLGenerator:renderGroupFooter";
		logger.ctinfo("CTEXP00026", cmName);
		int metaColSize = 0;
		try
		{
			ArrayList metaDataColl = (ArrayList) hMap.get("METADATA");
			if (getGroupByColumnPosition() != -1)
			{
				metaColSize = metaDataColl.size() - 1;
			} else
			{
				metaColSize = metaDataColl.size();
			}

			for (int index = 0; index < metaColSize; index++)
			{
				if (getGroupByColumnPosition() != index)
				{
					ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(index);
					if (groupTotalsContainer.containsKey(cmd.getColumnTitle()) == true)
					{
						groupFooter = new Paragraph(""
								+ ((Double) groupTotalsContainer.get(cmd.getColumnTitle())).doubleValue(),
								colHeaderfont);
						groupFooter.setAlignment(Element.ALIGN_RIGHT);
						table.addCell(ReportUtils.getGroupFooterCell(groupFooter));
						// Reinitialize the containers to hold the running totals of the next group
						groupTotalsContainer.put(cmd.getColumnTitle(), new Double(0));
					} else
					{
						groupFooter = new Paragraph("", colHeaderfont);
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
		logger.ctinfo("CTEXP00017", cmName);
	}
	
	
	/**
	 * 
	 * Checks is it has column
	 * 
	 * @param currentValue
	 * @param colSize
	 * @param isRTL
	 * @return boolean
	 */
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

	private static final Logger logger = Logger.getLogger(HTMLGenerator.class);
	private Font colHeaderfont = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(0, 0, 0));
	private Font HELVETICA_12_BOLD = new Font(Font.HELVETICA, 12, Font.BOLD);
	private Font HELVETICA_8_ITALIC = new Font(Font.HELVETICA, 8, Font.ITALIC);
    private Font arabicTraditionalNormal = new Font();
    private Font arabicTraditionalBold = new Font();
	// variable to hold the position of the data column in the string[] on which grouping needs to be done
	private int groupByColumnPosition = -1;
	// variable to hold the type(S-Subtotal) of the data column on which aggregate is done for group total
	private String groupByColumnType = ColumnMetaData.TYPE_SUB_TOTAL;
	// the label of the grouped column
	private String groupByColumnTitle = "";
	private HashMap groupTotalsContainer = null;
	private Paragraph emptyPara = new Paragraph(" ");// this used to add empty Paragraph to document
}