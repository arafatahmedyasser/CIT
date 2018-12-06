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
 */
package com.intellectdesign.canvas.report.vo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.intellectdesign.canvas.common.IBaseDefinition;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * It contains the all necessary details about the Column It is designed for simple VO, because it would be easier to
 * add/update the output details future.
 * 
 * @version 1.0
 */

public class ReportColumnDefinition implements IBaseDefinition
{
	private static final long serialVersionUID = -795097419333492531L;
	/**
	 * Unique id for the report.
	 */
	private String reportId;
	private String reportInstanceId;
	/**
	 * Column Id.
	 */
	private String columnId;
	/**
	 * Column Name
	 */
	private String columnName;
	/**
	 * Column data type.
	 */
	private String dataType;
	/**
	 * It indicates the position of a column in the report.
	 */
	private int position;
	/**
	 * If it is TRUE, this column can be groupable.
	 */
	private String groupableInd;
	/**
	 * It is the position that a column grouping in the report.
	 */
	private int groupPosition;
	/**
	 * If it is TRUE, this column can be sortable.
	 */
	private String sortableInd;
	/**
	 * Column Filtering details for the report.
	 */
	private List<ReportFilter> filters;
	/**
	 * It is the sorting order of the columns in the report.
	 */
	private String sortOrder;
	/**
	 * The position of a column in sorted order.
	 */
	private int sortPosition;

	/**
	 * If true,it ill enable totaling for columns grouped by a criteria.
	 */
	private String groupTotalInd;
	/**
	 * If it is TRUE, all the columns can be grouped by a criteria.
	 */
	private String allColumnGroupByInd;

	/**
	 * It denotes whether the column total has to be added in the report.
	 */
	private String includeTotal;
	/**
	 * It denotes the reference source amount column id. It is used in currency conversion.
	 */
	private String linkedSrcAmt;
	/**
	 * It denotes the reference source currency column id. It is used in currency conversion.
	 */
	private String linkedSrcCcy;
	/**
	 * Denotes whether the column must be visible in the report or not.
	 */
	private String visibilityInd;

	/**
	 * Get the visibility Indicator.
	 * 
	 * @return visibilityInd.
	 */

	public String getVisibilityInd()
	{
		return visibilityInd;
	}

	/**
	 * sets the visibility Indicator.
	 * 
	 * @param visibilityInd : either true or false.
	 */
	public void setVisibilityInd(String visibilityInd)
	{
		this.visibilityInd = visibilityInd;
	}

	/**
	 * @return the reportId
	 */
	public String getReportId()
	{
		return reportId;
	}

	/**
	 * @param reportId the reportId to set
	 */
	public void setReportId(String reportId)
	{
		this.reportId = reportId;
	}

	/**
	 * @return the columnId
	 */
	public String getColumnId()
	{
		return columnId;
	}

	/**
	 * @param columnId the columnId to set
	 */
	public void setColumnId(String columnId)
	{
		this.columnId = columnId;
	}

	/**
	 * @return the columnName
	 */
	public String getColumnName()
	{
		return columnName;
	}

	/**
	 * @param columnName the columnName to set
	 */
	public void setColumnName(String columnName)
	{
		this.columnName = columnName;
	}

	/**
	 * @return the dataType
	 */
	public String getDataType()
	{
		return dataType;
	}

	@Override
	/**
	 * 
	 * @return
	 * @throws CloneNotSupportedException
	 * @see java.lang.Object#clone()
	 */
	public Object clone() throws CloneNotSupportedException
	{
		return super.clone();
	}

	/**
	 * @param dataType the dataType to set
	 */
	public void setDataType(String dataType)
	{
		this.dataType = dataType;
	}

	/**
	 * @return the position
	 */
	public int getPosition()
	{
		return position;
	}

	/**
	 * @param position the position to set
	 */
	public void setPosition(int position)
	{
		this.position = position;
	}

	/**
	 * @return the groupableInd
	 */
	public String getGroupableInd()
	{
		return groupableInd;
	}

	/**
	 * @param groupableInd the groupableInd to set
	 */
	public void setGroupableInd(String groupableInd)
	{
		this.groupableInd = groupableInd;
	}

	/**
	 * @return the groupPosition
	 */
	public int getGroupPosition()
	{
		return groupPosition;
	}

	/**
	 * @param groupPosition the groupPosition to set
	 */
	public void setGroupPosition(int groupPosition)
	{
		this.groupPosition = groupPosition;
	}

	/**
	 * @return the sortableInd
	 */
	public String getSortableInd()
	{
		return sortableInd;
	}

	/**
	 * @param sortableInd the sortableInd to set
	 */
	public void setSortableInd(String sortableInd)
	{
		this.sortableInd = sortableInd;
	}

	/**
	 * @return the filters
	 */
	public List<ReportFilter> getFilters()
	{
		return filters;
	}

	/**
	 * @param filters the filters to set
	 */
	public void setFilters(List<ReportFilter> filters)
	{
		this.filters = filters;
	}

	/**
	 * @return the sortOrder
	 */
	public String getSortOrder()
	{
		return sortOrder;
	}

	/**
	 * @param sortOrder the sortOrder to set
	 */
	public void setSortOrder(String sortOrder)
	{
		this.sortOrder = sortOrder;
	}

	/**
	 * @return the sortPosition
	 */
	public int getSortPosition()
	{
		return sortPosition;
	}

	/**
	 * @param sortPosition the sortPosition to set
	 */
	public void setSortPosition(int sortPosition)
	{
		this.sortPosition = sortPosition;
	}

	/**
	 * @return the groupTotalInd
	 */
	public String getGroupTotalInd()
	{
		return groupTotalInd;
	}

	/**
	 * @param groupTotalInd the groupTotalInd to set
	 */
	public void setGroupTotalInd(String groupTotalInd)
	{
		this.groupTotalInd = groupTotalInd;
	}

	/**
	 * @return the allColumnGroupByInd
	 */
	public String getAllColumnGroupByInd()
	{
		return allColumnGroupByInd;
	}

	/**
	 * @param allColumnGroupByInd the allColumnGroupByInd to set
	 */
	public void setAllColumnGroupByInd(String allColumnGroupByInd)
	{
		this.allColumnGroupByInd = allColumnGroupByInd;
	}

	/**
	 * @return the includeTotal
	 */
	public String getIncludeTotal()
	{
		return includeTotal;
	}

	/**
	 * @param includeTotal the includeTotal to set
	 */
	public void setIncludeTotal(String includeTotal)
	{
		this.includeTotal = includeTotal;
	}

	/**
	 * @return the linkedSrcAmt
	 */
	public String getLinkedSrcAmt()
	{
		return linkedSrcAmt;
	}

	/**
	 * @param linkedSrcAmt the linkedSrcAmt to set
	 */
	public void setLinkedSrcAmt(String linkedSrcAmt)
	{
		this.linkedSrcAmt = linkedSrcAmt;
	}

	/**
	 * @return the linkedSrcCcy
	 */
	public String getLinkedSrcCcy()
	{
		return linkedSrcCcy;
	}

	/**
	 * @param linkedSrcCcy the linkedSrcCcy to set
	 */
	public void setLinkedSrcCcy(String linkedSrcCcy)
	{
		this.linkedSrcCcy = linkedSrcCcy;
	}

	/**
	 * @return the groupableInd
	 */
	public boolean isGroupableInd()
	{

		return ReportConstants.VAL_BOOL_YES.equals(getGroupableInd());
	}

	/***
	 * 
	 * @return whether column must be visible in the report or not.
	 */
	public boolean isVisibleInd()
	{
		return ReportConstants.VAL_BOOL_YES.equals(getVisibilityInd());
	}

	/**
	 * @return the sortableInd
	 */
	public boolean isSortableInd()
	{
		return ReportConstants.VAL_BOOL_YES.equals(getSortableInd());
	}

	/**
	 * @return the groupTotalInd
	 */
	public boolean isGroupTotalInd()
	{
		return ReportConstants.VAL_BOOL_YES.equals(getGroupTotalInd());
	}

	/**
	 * @return the allColumnGroupByInd
	 */
	public boolean isAllColumnGroupByInd()
	{
		return ReportConstants.VAL_BOOL_YES.equals(getAllColumnGroupByInd());
	}

	/**
	 * @return the includeTotal
	 */
	public boolean isIncludeTotal()
	{
		return ReportConstants.VAL_BOOL_YES.equals(getIncludeTotal());
	}

	@Override
	/**
	 * 
	 * @return String:null
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	public String toJSONString()
	{
		return null;
	}

	/**
	 * This method buiild a map with reportId and its column details like reportId, column_Id,column_name, dataType,
	 * position,groupby,sortby and its visible details.
	 * 
	 * @return ReportColumnDefinition Map
	 */
	public Map getReportColumnDefinitionAsMap()
	{
		Map reportColumnDefinitionMap = new HashMap();
		reportColumnDefinitionMap.put(ReportConstants.REPORT_ID, reportId);
		reportColumnDefinitionMap.put(ReportConstants.COLUMN_ID, columnId);
		reportColumnDefinitionMap.put(ReportConstants.COLUMN_NAME, columnName);
		reportColumnDefinitionMap.put(ReportConstants.DATA_TYPE, dataType);
		reportColumnDefinitionMap.put(ReportConstants.POSITION, position);
		reportColumnDefinitionMap.put(ReportConstants.GROUPABLE_IND, (isGroupableInd() ? ReportConstants.VAL_BOOL_YES
				: ReportConstants.VAL_BOOL_NO));
		reportColumnDefinitionMap.put(ReportConstants.GROUP_POSITION, groupPosition);
		reportColumnDefinitionMap.put(ReportConstants.SORTABLE_IND, (isSortableInd() ? ReportConstants.VAL_BOOL_YES
				: ReportConstants.VAL_BOOL_NO));
		reportColumnDefinitionMap.put(ReportConstants.SORT_POSITION, sortPosition);
		reportColumnDefinitionMap.put(ReportConstants.SORT_ORDER, sortOrder);
		reportColumnDefinitionMap.put(ReportConstants.GROUP_TOTAL_IND,
				(isGroupTotalInd() ? ReportConstants.VAL_BOOL_YES : ReportConstants.VAL_BOOL_NO));
		reportColumnDefinitionMap.put(ReportConstants.ALL_COL_GRP_BY_IND,
				(isAllColumnGroupByInd() ? ReportConstants.VAL_BOOL_YES : ReportConstants.VAL_BOOL_NO));
		reportColumnDefinitionMap.put(ReportConstants.INCLUDE_TOTAL, (isIncludeTotal() ? ReportConstants.VAL_BOOL_YES
				: ReportConstants.VAL_BOOL_NO));
		reportColumnDefinitionMap.put(ReportConstants.LINKED_SRC_AMT, linkedSrcAmt);
		reportColumnDefinitionMap.put(ReportConstants.LINKED_SRC_CCY, linkedSrcCcy);
		reportColumnDefinitionMap.put(ReportConstants.VISIBILITY_IND, visibilityInd);
		return reportColumnDefinitionMap;
	}

	/**
	 * Method used for get the ReportInstance Id.
	 * 
	 * @return
	 */
	public String getReportInstanceId()
	{
		return reportInstanceId;
	}

	/**
	 * Method used for set the reportInstanceid.
	 * 
	 * @param reportInstanceId
	 */
	public void setReportInstanceId(String reportInstanceId)
	{
		this.reportInstanceId = reportInstanceId;
	}
}
