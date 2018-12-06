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
import java.util.ArrayList;

import com.itextpdf.text.Element;
import com.lowagie.text.Cell;
import com.lowagie.text.Paragraph;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.reports.Column;
import com.intellectdesign.canvas.reports.ColumnMetaData;

/**
 * Utility methods used for reports
 * 
 * @version 1.0
 */
public class ReportUtils
{
	/**
	 * This method iterates given ArrayList, finds Column information like type, width, etc., and finally creates list
	 * of ColumnMetaData instances using founded column information and then returns list of ColumnMetaData
	 * 
	 * @param metaData - List of Columns
	 * @return - List of ColumnMetaData instances
	 **/
	public static ArrayList getColumnMetaData(ArrayList metaData)
	{
		String cmName = "ReportUtils:getColumnMetaData";
		logger.ctinfo("CTEXP00026", cmName);
		ArrayList columnMetaData = new ArrayList();
		int metaDataSize = metaData.size();
		for (int index = 0; index < metaDataSize; index++)
		{
			Column col = (Column) metaData.get(index);
			logger.ctdebug("CTEXP00137", col);
			String type = "";
			int width = -1;
			if ("N".equals(col.getType()))
			{
				type = ColumnMetaData.TYPE_NUMERIC;
			} else if ("R".equals(col.getType()))
			{
				type = ColumnMetaData.TYPE_ALPHANUMERIC_R;
			} else if ("S".equals(col.getType()))
			{
				type = ColumnMetaData.TYPE_SUB_TOTAL;
			} else if ("D".equals(col.getType()))
			{
				type = ColumnMetaData.TYPE_DATE;
			} else if ("T".equals(col.getType()))
			{
				type = ColumnMetaData.TYPE_DATE_TIME;
			} else if ("I".equals(col.getType()))
			{
				type = ColumnMetaData.TYPE_NUMERIC_INTEGER;
			} else
			{
				type = ColumnMetaData.TYPE_ALPHANUMERIC;
			}
			logger.ctdebug("CTEXP00138", type);
			if (col.getWidth() != null)
			{
				width = Integer.parseInt(col.getWidth());
			}
			logger.ctdebug("CTEXP00139", width);
			boolean wrap = "1".equals(col.getWrap()) ? true : false;
			boolean groupBy = "1".equals(col.getSortOrder()) ? true : false;
			ColumnMetaData colMeta = new ColumnMetaData(type, col.getColumnName(), groupBy, "", width, wrap);
			columnMetaData.add(colMeta);
		}
		logger.ctinfo("CTEXP00017", cmName);
		return columnMetaData;
	}

	/**
	 * Renders a cell with header column look and fell, Typically used to add a column to table header
	 * 
	 * @param data - the data has to be present in cell
	 * @returns - the rendered cell
	 * @exception Exception - If any exception occured while rendering cell
	 */
	protected static Cell getTableHeaderCell(Paragraph data) throws Exception
	{
		String cmName = "ReportUtils:getGroupHeaderCell";
		logger.ctinfo("CTEXP00026", cmName);
		Cell head = new Cell(data);
		head.setBackgroundColor(new Color(0x8D, 0xA2, 0xC7));
		head.setHorizontalAlignment(Element.ALIGN_CENTER);
		head.setVerticalAlignment(Element.ALIGN_MIDDLE);
		head.setHeader(true);
		logger.ctinfo("CTEXP00017", cmName);
		return head;
	}

	/**
	 * Renders a cell with group header look and fell, Typically used to add a merged column to table header
	 * 
	 * @param data - the data has to be present in cell
	 * @param colSpan
	 * @returns - the rendered cell
	 * @exception Exception - If any exception occured while rendering cell
	 */
	protected static Cell getGroupHeaderCell(Paragraph data, int colSpan) throws Exception
	{
		String cmName = "ReportUtils:getGroupHeaderCell";
		logger.ctinfo("CTEXP00026", cmName);
		Cell grpHead = new Cell(data);
		grpHead.setBackgroundColor(new Color(0xE9, 0xEE, 0xF5));
		grpHead.setBorderColor(new Color(0xCC, 0xCC, 0xCC));
		grpHead.setHorizontalAlignment(Element.ALIGN_LEFT);
		grpHead.setVerticalAlignment(Element.ALIGN_MIDDLE);
		grpHead.setColspan(colSpan);
		logger.ctinfo("CTEXP00017", cmName);
		return grpHead;
	}

	/**
	 * Renders a cell with group footer look and fell, Typically used to add a merged column to table footer
	 * 
	 * @param data - the data has to be present in cell
	 * @returns - the rendered cell
	 * @exception Exception - If any exception occured while rendering cell
	 */
	protected static Cell getGroupFooterCell(Paragraph data) throws Exception
	{
		String cmName = "ReportUtils:getGroupFooterCell";
		logger.ctinfo("CTEXP00026", cmName);
		Cell grpFoot = new Cell(data);
		grpFoot.setBackgroundColor(new Color(0xEC, 0xEC, 0xE1));
		grpFoot.setBorderColor(new Color(0xCC, 0xCC, 0xCC));
		grpFoot.setHorizontalAlignment(Element.ALIGN_CENTER);
		grpFoot.setVerticalAlignment(Element.ALIGN_MIDDLE);
		logger.ctinfo("CTEXP00017", cmName);
		return grpFoot;
	}

	/**
	 * Renders a cell with table body column look and fell, Typically used to add a column to row in table body
	 * 
	 * @param data - the data has to be present in cell
	 * @returns - the rendered cell
	 * @exception Exception - If any exception occured while rendering cell
	 */
	protected static Cell getTableBodyCell(Paragraph data) throws Exception
	{
		String cmName = "ReportUtils:getTableBodyCell";
		logger.ctinfo("CTEXP00026", cmName);
		Cell body = new Cell(data);
		body.setBorderColor(new Color(0xCC, 0xCC, 0xCC));
		body.setVerticalAlignment(Element.ALIGN_MIDDLE);
		logger.ctinfo("CTEXP00017", cmName);
		return body;
	}

	/**
	 * Renders a cell with summary table body column look and fell, Typically used to add a column to row in summary
	 * table body
	 * 
	 * @param data - the data has to be present in cell
	 * @param colWidth int
	 * @param colSpan int
	 * @returns - the rendered cell
	 * @exception Exception - If any exception occured while rendering cell
	 */
	protected static Cell getSummTableCell(Paragraph data, int colWidth, int colSpan) throws Exception
	{
		String cmName = "ReportUtils:getSummTableCell";
		logger.ctinfo("CTEXP00026", cmName);
		Cell body = new Cell(data);
		body.setWidth(String.valueOf((int) (6.7 * colWidth)));
		body.setHorizontalAlignment(Element.ALIGN_LEFT);
		body.setBorderColor(new Color(255, 255, 255));
		body.setVerticalAlignment(Element.ALIGN_MIDDLE);
		body.setColspan(colSpan);
		logger.ctinfo("CTEXP00017", cmName);
		return body;
	}

	/**
	 * Renders a cell with search table column look and fell, Typically used to add a column to row in search table body
	 * 
	 * @param data - the data has to be present in cell
	 * @param colWidth int
	 * @param colSpan int
	 * @returns - the rendered cell
	 * @exception Exception - If any exception occured while rendering cell
	 */
	protected static Cell getSearchTableCell(Paragraph data, int colWidth, int colSpan) throws Exception
	{
		String cmName = "ReportUtils:getSearchTableCell";
		logger.ctinfo("CTEXP00026", cmName);
		try
		{
			Cell searchCell = new Cell(data);
			searchCell.setBorderColor(new Color(255, 255, 255));
			searchCell.setHorizontalAlignment(Element.ALIGN_LEFT);
			searchCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
			searchCell.setColspan(colSpan);
			logger.ctinfo("CTEXP00017", cmName);
			return searchCell;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00038", e);
			return new Cell();
		}
	}

	/**
	 * Used to perform null value check. This method check 'data' value is null, if null then returns 'repStr' value
	 * else retuns 'data' value
	 * 
	 * @param data - the input value has to check aganist null
	 * @param repStr - this is alternative value if input value is null
	 * @return - Returns 'repStr' if 'data' is null else retunrs 'data'
	 */
	protected static String nullHandler(String data, String repStr)
	{
		logger.ctdebug("CTEXP00140", data, repStr);
		if (data == null)
			return repStr;
		else
			return data;
	}

	private static final Logger logger = Logger.getLogger(ReportUtils.class);
}