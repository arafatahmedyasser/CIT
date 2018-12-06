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

package com.intellectdesign.canvas.reports;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import com.intellectdesign.canvas.config.ConfigurationManager;
import com.intellectdesign.canvas.config.ExportConfigurationDescriptor;
import com.intellectdesign.canvas.constants.export.ExportFwsConstants;
import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.datasource.JavaDataSource;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.message.ReportsMessageManager;
import com.intellectdesign.canvas.pref.amount.AmountFormatterManager;

/**
 * Contains all functions required for building xml for reports.
 * 
 * @version 1.0
 */
public class ReportXMLBuilder
{
	// variable to hold the position of the data column in the string[] on which grouping needs to be done
	private int groupByColumnPosition = -1;
	// variable to hold the type(S-Subtotal) of the data column on which aggregate is done for group total
	private String groupByColumnType = ColumnMetaData.TYPE_SUB_TOTAL;
	// the label of the grouped column
	private String groupByColumnTitle = "";
	/**
	 * container for holding the running total of data columns on which aggreagate is done key-the column name value-the
	 * running total
	 */
	private HashMap groupTotalsContainer = null;
	private static final String ORG_PDF_FILE_PATH = "ORG_PDF_FILE_PATH";

	private OutputStreamWriter fs = null;

	private String totalCount = null;
	private String mAmountFormat = null;
	private static final Logger logger = Logger.getLogger(ReportXMLBuilder.class);

	/**
	 * Method to validate the input
	 * 
	 * @param hMap Input parameter map
	 * @throws Exception
	 */

	private void validateInput(HashMap hMap) throws Exception
	{
		String cmName = "ReportXmlBuilder:validateInput";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			if (hMap.containsKey("CORPORATE_NAME") == false)
			{
				Exception exObj = new Exception("Missing Key: CORPORATE_NAME");
				throw (exObj);
			}
			if (hMap.containsKey("REPORT_HEADER") == false)
			{
				Exception exObj = new Exception("Missing Key: REPORT_HEADER");
				throw (exObj);
			}
			if (hMap.containsKey("GENERATED_DATE") == false)
			{
				Exception exObj = new Exception("Missing Key: GENERATED_DATE");
				throw (exObj);
			}
			if (hMap.containsKey("METADATA") == false)
			{
				Exception exObj = new Exception("Missing Key: METADATA");
				throw (exObj);
			}
			if (hMap.containsKey("DATA") == false)
			{
				Exception exObj = new Exception("Missing Key: DATA");
				throw (exObj);
			}
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * Method to render reportxml
	 * 
	 * @param hMap hashmap from which ReportXML will be generated
	 * @param fPath Path where the ReportXML will be rendered
	 * @param hasData boolean
	 * @return String
	 * @throws Exception
	 */

	public String renderReportXML(HashMap hMap, String fPath, boolean hasData) throws Exception
	{
		String cmName = "ReportXmlBuilder:renderReportXML";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			// identify the groupby column position and data type

			ArrayList metaDataColl = new ArrayList();
			if (hMap.get("METADATA") != null)
			{
				metaDataColl = (ArrayList) hMap.get("METADATA");
			}

			if (metaDataColl.size() == 1)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(0);
				if (cmd.getColumnTitle().equalsIgnoreCase("DETAIL"))
				{
					return new DetailXMLGenerator().renderReportXML(hMap, fPath);
				}
			}
			for (int iCtr = 0; iCtr < metaDataColl.size(); iCtr++)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iCtr);

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
			groupTotalsContainer = new HashMap();

			File f = new File(fPath);
			FileOutputStream fosObject = new FileOutputStream(f);
			Charset cs = Charset.forName("UTF-8");
			fs = new OutputStreamWriter(fosObject, cs);

			writeContent("<?xml version='1.0' encoding='UTF-8'?>");

			writeContent("<report>");
			renderHeader(hMap);
			renderBody(hMap, hasData);
			renderSummary(hMap);
			renderParams(hMap);
			writeContent("</report>");
			fs.close();
			return "N";
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			try
			{
				// in case of any exception in the generation of the contents for the file
				// then the file is deleted and error propogated to the caller.
				fs.close();
				fs = null;
				File fileObj = new File(fPath);
				fileObj.delete();
			} catch (Exception ex)
			{
				logger.cterror("CTEXP00038", ex);
				throw (ex);
			}
			throw (e);
		} finally
		{
			fs = null;
		}
	}

	/**
	 * Method to render Header
	 * 
	 * @param hMap hashmap from which ReportXMLheader will be generated
	 * @throws Exception
	 */
	private void renderHeader(HashMap hMap) throws Exception
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

		String langID = (String) hMap.get("LANGUAGE_ID");

		String cmName = "ReportXmlBuilder:renderHeader";
		logger.ctinfo("CTEXP00026", cmName);

		String service = exportDescriptor.getPageTitle();

		try
		{
			writeContent("<report-header>");
			writeContent("<logo-url><![CDATA[");
			writeContent(exportDescriptor.getIntellectLogo()); // Export_Label Configuration
			writeContent("]]></logo-url>");

			writeContent("<service-title><![CDATA[");
			writeContent(service);
			writeContent("]]></service-title>");

			writeContent("<report-corporate><![CDATA[");
			writeContent((String) hMap.get("CORPORATE_NAME"));
			writeContent("]]></report-corporate>");
			
			writeContent("<report-title><![CDATA[");
			if (hMap.get("REPORT_HEADER") != null)
				writeContent(ReportsMessageManager.replacePredefined((String) hMap.get("REPORT_HEADER")));
			writeContent("]]></report-title>");
			
			writeContent("<report-date><![CDATA[ ");

			writeContent((String)hMap.get("GENERATED_DATE"));

			writeContent("]]></report-date>");
			writeContent("<report-user><![CDATA[ ");
			writeContent((String) hMap.get("USER_NAME"));
			writeContent("]]></report-user>");
			writeContent("<report-generated><![CDATA[ ");

			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_GEN,
					langID));

			writeContent("]]></report-generated>");
			writeContent("<report-by><![CDATA[ ");

			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_REP_BY,
					langID));

			writeContent(" ]]></report-by>");
			writeContent("<report-pageno><![CDATA[ ");

			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_F,
					langID));

			writeContent(" ]]></report-pageno>");
			writeContent("<report-pageof><![CDATA[ ");

			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_PAGE_OF,
					langID));

			writeContent(" ]]></report-pageof>");
			writeContent("</report-header>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * Method to render Body
	 * 
	 * @param hMap hashmap from which ReportXML body will be generated
	 * @param hasData boolean
	 * @throws Exception
	 */
	private void renderBody(HashMap hMap, boolean hasData) throws Exception
	{
		String cmName = "ReportXmlBuilder:renderBody";
		logger.ctinfo("CTEXP00026", cmName);
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();
		String pdfImagePath = exportDescriptor.getOrgPDFPath();

		String pdfType = null;
		if (hMap.get("EXPORTFORMAT") != null)
			pdfType = hMap.get("EXPORTFORMAT").toString();

		String reqID = null;
		if (hMap.get("REQUEST_ID") != null)
			reqID = (String) hMap.get("REQUEST_ID");

		try
		{

			writeContent("<report-body>");

			if (!"PDF".equals(pdfType) && checkChartExport(pdfType) && reqID != null && !reqID.isEmpty())
			{
				writeContent("<chart-url><![CDATA[");
				writeContent(pdfImagePath + "/" + reqID + ".png");
				writeContent("]]></chart-url>");
				writeContent("<landscape>");
				writeContent("</landscape>");

			} else
			{
				writeContent("<portrait>");
				writeContent("</portrait>");

			}

			renderReportHeadingColumns(hMap);
			renderReportDataColumns(hMap, hasData);
			writeContent("</report-body>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}

	}

	/**
	 * Method to checkChartExport
	 * 
	 * @param exportType
	 * @return Returns true if exportType is either VECTORPDF,TRANSPDF,CHARTPDF else false
	 */
	public boolean checkChartExport(String exportType)
	{
		if (ExportFwsConstants.VECTORPDF.equalsIgnoreCase(exportType)
				|| ExportFwsConstants.TRANSPDF.equalsIgnoreCase(exportType)
				|| ExportFwsConstants.CHARTPDF.equalsIgnoreCase(exportType))
		{
			return true;
		} else
		{
			return false;
		}
	}

	/**
	 * Method to checkhasColumn
	 * 
	 * @param currentValue
	 * @param colSize
	 * @param isRTL
	 * @return Returns boolean depending upon some conditions
	 */
	private boolean hasColumn(int currentValue, int colSize, boolean isRTL)
	{
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

	/**
	 * Method to renderReportHeadingColumns
	 * 
	 * @param hMap hashmap from which heading of the columns for the report will be taken
	 * @throws Exception
	 */
	private void renderReportHeadingColumns(HashMap hMap) throws Exception
	{

		String langID = (String) hMap.get("LANGUAGE_ID");

		String cmName = "ReportXmlBuilder:renderReportHeadingColumns";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			writeContent("<column-headings>");
			ArrayList metaDataColl = (ArrayList) hMap.get("METADATA");

			boolean isGroupHeaderReqd = (Boolean) hMap.get(ReportingConstants.GROUP_HEADER_REQD);

			boolean isRTL = false;
			String langDirection = (String) hMap.get("DIRECTION");
			if (langDirection != null && langDirection.trim().equals("RTL"))
			{
				isRTL = true;
			}

			int iCtr = 0;
			if (isRTL)
			{
				iCtr = metaDataColl.size() - 1;
			}

			if (isGroupHeaderReqd)
			{
				ArrayList grpColList = (ArrayList) hMap.get(ReportingConstants.GROUP_COL_HEADER_DATA);

				for (int i = 0; i < grpColList.size(); i++)
				{
					if (grpColList.get(i) instanceof Map)
					{
						Map tempGrpHdrMap = (Map) grpColList.get(i);
						Iterator it = tempGrpHdrMap.entrySet().iterator();
						while (it.hasNext())
						{
							Map.Entry grpHeader = (Map.Entry) it.next();
							ArrayList tempChildList = (ArrayList) grpHeader.getValue();
							writeContent("<header-one rowspan = '1' colspan='"
									+ tempChildList.size()
									+ "' align='center'><![CDATA["
									+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, "LBL_"
											+ (String) grpHeader.getKey(), langID) + "]]></header-one>");
							for (int j = 0; j < tempChildList.size(); j++)
							{
								writeContent("<heading></heading>");
								writeContent("<header-two rowspan = '1' colspan='1' align='left'><![CDATA["
										+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, "LBL_"
												+ (String) tempChildList.get(j), langID) + "]]></header-two>");
							}
						}
					} else
					{
						writeContent("<heading></heading>");
						writeContent("<header-one rowspan = '2' colspan='1' align='left'><![CDATA["
								+ ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, "LBL_"
										+ (String) grpColList.get(i), langID) + "]]></header-one>");
					}
				}
			} else
			{
				while (hasColumn(iCtr, metaDataColl.size(), isRTL))
				{
					// actual work
					if (getGroupByColumnPosition() != iCtr)
					{
						ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iCtr);

						String lblString = "LBL_";
						String headerdisplayvalue = (ReportsMessageManager.getMessage(
								(String) hMap.get(ReportingConstants.WID_BUNDLE_KEY), lblString +cmd.getColumnTitle(),
								langID)).toString();
							 if(headerdisplayvalue != null && headerdisplayvalue.length()>3 
									 && headerdisplayvalue.substring(0, 4).equals(lblString)){
								 writeContent("<heading><![CDATA["
											+ headerdisplayvalue.substring(4) + "]]></heading>");
								 
								 
							 }
							 else{
								 writeContent("<heading><![CDATA["


											+ headerdisplayvalue + "]]></heading>");
							 }
					}

					if (isRTL)
					{
						iCtr--; // For RTL
					} else
					{
						iCtr++; // For LTR
					}
				}
			}

			writeContent("</column-headings>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * Method to renderReportDataColumns
	 * 
	 * @param hMap hashmap which holds the data
	 * @param hasData boolean
	 * @throws Exception
	 */
	private void renderReportDataColumns(HashMap hMap, boolean hasData) throws Exception
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();

		String dateCustomAlignment = configMgr.getCompPrefDescriptor().getDateColumnAlignent();
		String amtCustomAlignment = configMgr.getCompPrefDescriptor().getAmountColumnAlignent();
		String datetimeCustomAlignment = configMgr.getCompPrefDescriptor().getDateTimeColumnAlignent();
		boolean isRTL = false;
		String langDirection = (String) hMap.get("DIRECTION");
		if (langDirection != null && langDirection.trim().equals("RTL"))
		{
			isRTL = true;
			dateCustomAlignment = dateCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			amtCustomAlignment = amtCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
			datetimeCustomAlignment = datetimeCustomAlignment=="LEFT" ? "RIGHT":"LEFT";
		}
		
		String cmName = "ReportXmlBuilder:renderReportHeadingColumns";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			ArrayList metaDataColl = (ArrayList) hMap.get("METADATA");

			writeContent("<report-data>");
			int rowsPerCall = 0;
			JavaDataSource javaSource = null;
			HashMap dataSourceParam = null;
			HashMap dataHash = null;
			ArrayList aList = new ArrayList();

			HashMap<String, String> linkedCurrMap = null;
			linkedCurrMap = (HashMap) hMap.get("LINKED_CURR_COL");
			if (!hasData)
			{
				javaSource = (JavaDataSource) hMap.get("DATA_PROVIDER_INSTANCE");
				dataSourceParam = (HashMap) hMap.get("DATA_PROVIDER_OBJECT");

				if (hMap.get("ROWS_PER_CALL") != null)
					rowsPerCall = ((Integer) hMap.get("ROWS_PER_CALL")).intValue();
				dataSourceParam.put("StartRowNumber", new Integer(0));
				dataHash = javaSource.execute(dataSourceParam);
				if (dataHash.get("DATA") != null)
					aList = (ArrayList) dataHash.get("DATA");
				totalCount = (String) dataHash.get("TOTAL_COUNT");
			} else
			{
				if ((ArrayList) hMap.get("DATA") != null)
					aList = (ArrayList) hMap.get("DATA");
				totalCount = (String) hMap.get("TOTAL_COUNT");
			}

			if (hMap.get("TOTAL_COUNT") == null)
			{
				totalCount = "0";
			}

			if (hMap.get("ROWS_PER_CALL") != null)
				rowsPerCall = ((Integer) hMap.get("ROWS_PER_CALL")).intValue();
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
				if (!hasData)
				{
					if (dataHash.get("SUMMARY") != null)
					{
						hMap.put("SUMMARY", dataHash.get("SUMMARY"));
					}
				}
			}

			String colNameTitle = null;
			String colName = null;

			String amountCol = null;
			String currCol = null;
			String currency = null;

			for (int iCtr = 0; iCtr < aList.size(); iCtr++)
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
							renderGroupHeader(hMap, currValue);
						} else
						{
							renderGroupFooter(hMap);
							renderGroupHeader(hMap, currValue);
						}
						prevValue = currValue;
					}
				}
				writeContent("<row-data>");


				int iColumnCtr = 0;
				if (isRTL)
				{
					iColumnCtr = metaDataColl.size() - 1;
				}
				while (hasColumn(iColumnCtr, metaDataColl.size(), isRTL))
				{
					// actual work

					if (getGroupByColumnPosition() != iColumnCtr)
					{
						ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iColumnCtr);
						String colType = cmd.getColumnType();
						writeContent("<column-data colspan=\"1\" align=\"");
					if(colType.equals(ColumnMetaData.TYPE_NUMERIC)) {
						if(amtCustomAlignment!=null && "LEFT".equalsIgnoreCase(amtCustomAlignment))
							writeContent("left");
						else if(amtCustomAlignment!=null && "CENTER".equalsIgnoreCase(amtCustomAlignment))
							writeContent("center");
						else
							writeContent("right");
					}
					else if(colType.equals(ColumnMetaData.TYPE_ALPHANUMERIC_R)) {
						writeContent("right");
					}
					else if(colType.equals(ColumnMetaData.TYPE_DATE)) {
						if(dateCustomAlignment!=null && "LEFT".equalsIgnoreCase(dateCustomAlignment))
							writeContent("left");
						else if(dateCustomAlignment!=null && "CENTER".equalsIgnoreCase(dateCustomAlignment))
							writeContent("center");
						else
							writeContent("right");
					}
					else if(colType.equals(ColumnMetaData.TYPE_DATE_TIME)) {
						if(datetimeCustomAlignment!=null && "LEFT".equalsIgnoreCase(datetimeCustomAlignment))
							writeContent("left");
						else if(datetimeCustomAlignment!=null && "CENTER".equalsIgnoreCase(datetimeCustomAlignment))
							writeContent("center");
						else
							writeContent("right");
					}
					else if(colType.equals(ColumnMetaData.TYPE_SUB_TOTAL)) {
						writeContent("right");
					}
					else{
						String direction= isRTL? "right" : "left";
						writeContent(direction);
					}

						writeContent("\"><![CDATA[");
						String amtFormat[] = cmd.getColumnTitle().split("_");
						int count = 0;
						String formattedAmount = "";
						for (int i = 0; i < amtFormat.length; i++)
						{
							if (cmd.getColumnType().equals(ColumnMetaData.TYPE_NUMERIC))
							{
								mAmountFormat = (String) hMap.get("USER_AMOUNT_FORMAT");
								count = 1;
							}
						}
						if (count == 1)
						{

							colNameTitle = cmd.getColumnTitle();
							colName = colNameTitle.substring(4);
							if (linkedCurrMap != null && linkedCurrMap.size() > 0)
							{
								Set mapSet = linkedCurrMap.entrySet();
								Iterator mapIterator = mapSet.iterator();
								Map.Entry mapEntry = (Map.Entry) mapIterator.next();
								amountCol = (String) mapEntry.getKey();
								currCol = null;
								currency = null;
								ArrayList colList = populateColumnsFromColMetadata(metaDataColl);
								if (colName.equals(amountCol))
								{
									currCol = (String) mapEntry.getValue();
									int currColIndex = colList.indexOf(currCol);
									currency = rowData[currColIndex];
									logger.ctdebug("CTEXP00042", currency);
								}
							}

							String rowValue = rowData[iColumnCtr];
							int strLength = rowValue.indexOf(".");
							if (strLength == -1)
							{
								if (rowValue.equals(""))
								{
									writeContent(rowValue + "- -");
								} else
								{

									String finalAmt = rowValue;

									formattedAmount = AmountFormatterManager.convertAmountTo(finalAmt, mAmountFormat, currency);

									writeContent(formattedAmount);
								}
							} else if (strLength == strLength)
							{
								int desimal = 0;
								String rowValues = rowValue.replace(".", "_");
								String rePlace[] = rowValues.split("_");
								for (int j = 0; j < rePlace.length; j++)
								{
									desimal = rePlace[1].length();
									break;
								}
								if (desimal == 1)
								{

									formattedAmount = AmountFormatterManager.convertAmountTo(rowValue, mAmountFormat, currency);

									writeContent(formattedAmount);
								} else
								{
									String decimalValue = rowData[iColumnCtr];
									String amtFormats = decimalValue.substring(0, decimalValue.indexOf(".") + 3);

									formattedAmount = AmountFormatterManager.convertAmountTo(decimalValue, mAmountFormat, currency);

									writeContent(formattedAmount);
								}
							} else
							{
								writeContent(rowData[iColumnCtr]);
							}
						} else
						{
							String exceptAmt = rowData[iColumnCtr];
							if (exceptAmt.equals(""))
							{
								exceptAmt = "- -";
							}
							writeContent(exceptAmt);
						}

						writeContent("]]></column-data>");

					}

					if (isRTL)
					{
						iColumnCtr--; // For RTL
					} else
					{
						iColumnCtr++; // For LTR
					}
				}

				writeContent("</row-data>");
				// the position will be -1 when no grouping needs to be done on any data column
				if (getGroupByColumnPosition() != -1)
				{
					// Bugfix for wrong sub total.
					if (!(moreData && iCtr == aList.size() - 2))
					{
						// update the datacolumn values to the container so that the group totals
						// can be displayed in the group footer.
						updateGroupTotals(hMap, rowData);
						if (iCtr == aList.size() - 1)
						{
							renderGroupFooter(hMap);
						}
					}
				}
				if (moreData && iCtr == aList.size() - 2)
				{
					// GET NEXT SET
					rowStartCount += rowsPerCall;
					if (!hasData)
					{
						dataSourceParam.put("StartRowNumber", new Integer(rowStartCount));
						dataHash = javaSource.execute(dataSourceParam);
						if (dataHash.get("DATA") != null)
							aList = (ArrayList) dataHash.get("DATA");
					}
					if (aList.size() == (rowsPerCall + 1))
					{
						moreData = true;
					} else
					{
						if (!hasData)
						{
							if (dataHash.get("SUMMARY") != null)
							{
								hMap.put("SUMMARY", dataHash.get("SUMMARY"));
							}
							moreData = false;
						}
					}
					// RESET
					iCtr = -1;
					nextSet = true;
				}

			}// END OF FOR
			writeContent("</report-data>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * Method to updateGroupTotals
	 * 
	 * @param hMap hashmap which holds the data
	 * @param rowData
	 * @throws Exception
	 */
	private void updateGroupTotals(HashMap hMap, String[] rowData) throws Exception
	{
		String cmName = "ReportXmlBuilder:updateGroupTotals";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{

			ArrayList metaDataColl = null;
			if (hMap.get("METADATA") != null)
				metaDataColl = (ArrayList) hMap.get("METADATA");

			for (int iCtr = 0; iCtr < metaDataColl.size(); iCtr++)
			{
				ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iCtr);
				if (cmd.getColumnType().equals(ColumnMetaData.TYPE_SUB_TOTAL))
				{

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
	 * Method to renderGroupHeader
	 * 
	 * @param hMap hashmap which holds the data
	 * @param headingValue
	 * @throws Exception
	 */
	private void renderGroupHeader(HashMap hMap, String headingValue) throws Exception
	{
		String cmName = "ReportXmlBuilder:renderGroupHeader";
		logger.ctinfo("CTEXP00026", cmName);
		String langID = (String) hMap.get("LANGUAGE_ID");
		try
		{
			writeContent("<row-data group-start='yes'>");
			writeContent("<column-data colspan='" + ((ArrayList) hMap.get("METADATA")).size() + "'><![CDATA[");

			writeContent(ReportsMessageManager
					.getMessage(ReportingConstants.EZ_LABELS, getGroupByColumnTitle(), langID) + "  :  " + headingValue);

			writeContent("]]></column-data>");
			writeContent("</row-data>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * Method to renderGroupFooter
	 * 
	 * @param hMap hashmap which holds the data
	 * @throws Exception
	 */
	private void renderGroupFooter(HashMap hMap) throws Exception
	{
		String cmName = "ReportXmlBuilder:renderGroupFooter";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			writeContent("<row-data group-end='yes'>");

			ArrayList metaDataColl = null;
			if (hMap.get("METADATA") != null)
				metaDataColl = (ArrayList) hMap.get("METADATA");

			for (int iCtr = 0; iCtr < metaDataColl.size(); iCtr++)
			{
				if (getGroupByColumnPosition() != iCtr)
				{
					ColumnMetaData cmd = (ColumnMetaData) metaDataColl.get(iCtr);
					if (groupTotalsContainer.containsKey(cmd.getColumnTitle()) == true)
					{
						writeContent("<column-data align=\"center\"   colspan=\"1\"><![CDATA["
								+ groupTotalsContainer.get(cmd.getColumnTitle()) + "]]></column-data>");
						// reinitialize the containers to hold the running totals of the next group
						groupTotalsContainer.put(cmd.getColumnTitle(), new Double(0));
					} else
					{
						writeContent("<column-data colspan=\"1\"></column-data>");
					}
				}
			}
			writeContent("</row-data>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * Method to renderSummary
	 * 
	 * @param hMap hashmap which holds the data
	 * @throws Exception
	 */

	private void renderSummary(HashMap hMap) throws Exception
	{
		String cmName = "ReportXmlBuilder:renderSummary";
		logger.ctinfo("CTEXP00026", cmName);
		String langID = (String) hMap.get("LANGUAGE_ID");
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		ExportConfigurationDescriptor exportDescriptor = configMgr.getExportDescriptor();

		boolean searchResultReqd = exportDescriptor.isSearchResultExportReqd();
		String pdfType = null;
		if (hMap.get("EXPORTFORMAT") != null)
			pdfType = hMap.get("EXPORTFORMAT").toString();

		try
		{
			if (totalCount != null && !"".equals(totalCount))
			{
				if ("PDF".equals(pdfType))
				{
					if (searchResultReqd)
					{
						writeContent("<total-count>");

						writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
								ReportingConstants.EZ_TOT_SRCHRES, langID) + " " + totalCount);

						writeContent("</total-count>");
					}
				}
			}
			if (hMap.containsKey("SUMMARY") == false)
				return;
			HashMap sumMap = (HashMap) hMap.get("SUMMARY");
			ArrayList aList = (ArrayList) sumMap.get("SUMMARY_LIST");
			writeContent("<report-summary>");
			if (aList == null)
			{
				writeContent("</report-summary>");
				return;
			}
			for (int iCtr = 0; iCtr < aList.size(); iCtr++)
			{
				SummaryData sumData = (SummaryData) aList.get(iCtr);
				SummaryMetaData metaData[] = sumData.getMetaData();
				String data[] = sumData.getData();
				writeContent("<summary-title><![CDATA[");

				writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS,
						ReportingConstants.EZ_REP_SUMM, langID));

				writeContent("]]></summary-title>");
				writeContent("<summary>");
				for (int j = 0; j < data.length; j++)
				{
					writeContent("<summary-column width=\"" + (metaData[j].getColWidth() * 27 / 100)
							+ "cm\" colspan=\"" + metaData[j].getColSpan() + "\" bold=\""
							+ ((metaData[j].getBold()) ? "Y" : "N") + "\" italic=\""
							+ ((metaData[j].getItalic()) ? "Y" : "N") + "\"><![CDATA[");

					writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, data[j], langID));

					writeContent("]]></summary-column>");
				}
				writeContent("</summary>");
			}
			writeContent("</report-summary>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * Method to renderParams
	 * 
	 * @param hMap hashmap which holds the data
	 * @throws Exception
	 */
	private void renderParams(HashMap hMap) throws Exception
	{
		String langID = (String) hMap.get("LANGUAGE_ID");
		String cmName = "ReportXmlBuilder:renderParams";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			if (hMap.containsKey("SUMMARY") == false)
				return;
			HashMap sumMap = (HashMap) hMap.get("SUMMARY");
			HashMap params = (HashMap) sumMap.get("PARAMS");
			if (params == null)
			{
				return;
			}
			java.util.Iterator it = params.keySet().iterator();
			if (!it.hasNext())
			{
				return;
			}
			writeContent("<param-list>");

			writeContent("<params-title><![CDATA[");
			writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, ReportingConstants.EZ_SEL_CRIT,
					langID));
			writeContent("]]></params-title>");

			while (it.hasNext())
			{
				String pkey = (String) it.next();
				String value = (String) params.get(pkey);
				writeContent("<params>");
				writeContent("<param-name><![CDATA[");

				writeContent(ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, pkey, langID));

				writeContent("]]></param-name>");
				writeContent("<param-value><![CDATA[");
				writeContent(value);
				writeContent("]]></param-value>");
				writeContent("</params>");
			}
			writeContent("</param-list>");
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * This method is used to set the GroupByColumnPosition
	 * 
	 * @param iVal groupByColumnPosition to set
	 */

	public void setGroupByColumnPosition(int iVal)
	{
		this.groupByColumnPosition = iVal;
	}

	/**
	 * This method is used to get the GroupByColumnPosition
	 * 
	 * @return int Returns the GroupByColumnPosition
	 */

	public int getGroupByColumnPosition()
	{
		return this.groupByColumnPosition;
	}

	/**
	 * This method is used to set the GroupByColumnType
	 * 
	 * @param sValue GroupByColumnType to set
	 */

	public void setGroupByColumnType(String sValue)
	{
		this.groupByColumnType = sValue;
	}

	/**
	 * This method is used to get the GroupByColumnType
	 * 
	 * @return Returns the GroupByColumnType
	 */

	public String getGroupByColumnType()
	{
		return this.groupByColumnType;
	}

	/**
	 * This method is used to set the GroupByColumnTitle
	 * 
	 * @param sValue GroupByColumnTitle to set
	 */

	public void setGroupByColumnTitle(String sValue)
	{
		this.groupByColumnTitle = sValue;
	}

	/**
	 * This method is used to get the GroupByColumnTitle
	 * 
	 * @return Returns the GroupByColumnTitle
	 */
	public String getGroupByColumnTitle()
	{
		return this.groupByColumnTitle;
	}

	/**
	 * This method is used to write the value in the file
	 * 
	 * @param sValue value to write
	 * @throws Exception
	 */

	private void writeContent(String sValue) throws Exception
	{
		try
		{
			if (sValue != null)
				fs.write(sValue);
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			throw (e);
		}
	}

	/**
	 * This method is used to populate columns from column meta data
	 * 
	 * @param colMetadata
	 * @return the arraylist of column names
	 */
	private ArrayList populateColumnsFromColMetadata(ArrayList colMetadata)
	{
		Iterator itr = colMetadata.iterator();
		ArrayList colList = new ArrayList();
		while (itr.hasNext())
		{
			ColumnMetaData cmd = (ColumnMetaData) itr.next();
			String colname = cmd.getColumnTitle().substring(4); // removing "LBL_" from the column title.
			colList.add(colname);
		}
		return colList;
	}

}