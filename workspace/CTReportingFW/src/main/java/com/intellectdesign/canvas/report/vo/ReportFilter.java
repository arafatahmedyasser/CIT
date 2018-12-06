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
import java.util.Map;

import com.intellectdesign.canvas.common.IBaseDefinition;
import com.intellectdesign.canvas.logger.Logger;
import com.intellectdesign.canvas.report.util.ReportConstants;

/**
 * this is a public class ReportFilter implements IBaseDefinition
 * 
 * @version 1.0
 */
public class ReportFilter implements IBaseDefinition
{
	private static final long serialVersionUID = -5827412572273498362L;
	private String columnId;
	private String filterId;
	private String filterName;
	private String filterType;
	private String filterValues;

	@Override
	/**
	 * 
	 * @return  String:null
	 * @see com.intellectdesign.canvas.common.IBaseDefinition#toJSONString()
	 */
	public String toJSONString()
	{
		return null;
	}

	/**
	 * 
	 * @return String:filterId
	 */
	public String getFilterId()
	{
		return filterId;
	}

	/**
	 * 
	 * @param filterId
	 */
	public void setFilterId(String filterId)
	{
		this.filterId = filterId;
	}

	/**
	 * 
	 * @return String:filterType
	 */
	public String getFilterType()
	{
		return filterType;
	}

	/**
	 * 
	 * @param filterType
	 */
	public void setFilterType(String filterType)
	{
		this.filterType = filterType;
	}

	/**
	 * 
	 * @return filterValues
	 */
	public String getFilterValues()
	{
		return filterValues;
	}

	/**
	 * 
	 * @param filterValues
	 */
	public void setFilterValues(String filterValues)
	{
		this.filterValues = filterValues;
	}

	/**
	 * 
	 * @return columnId
	 */
	public String getColumnId()
	{
		return columnId;
	}

	/**
	 * 
	 * @param columnId
	 */
	public void setColumnId(String columnId)
	{
		this.columnId = columnId;
	}

	/**
	 * This method used to get the Report Filter object properties in the form of Map. The map contains the ColumnId and
	 * filter details like filterId, filterName, filterType, filterValues.
	 * 
	 * @return map which have the ReportFiltet object details
	 */
	public Map getReportFilterAsMap()
	{
		LOGGER.ctinfo("CTREP00540");
		Map reportFilterMap = new HashMap();
		reportFilterMap.put(ReportConstants.COLUMN_ID, columnId);
		reportFilterMap.put(ReportConstants.FILTER_ID, filterId);
		reportFilterMap.put(ReportConstants.FILTER_NAME, filterName);
		reportFilterMap.put(ReportConstants.FILTER_DATA_TYPE, filterType);
		reportFilterMap.put(ReportConstants.FILTER_VALUES, filterValues);
		LOGGER.ctinfo("CTREP00541");
		return reportFilterMap;
	}

	/**
	 * 
	 * @return filterName
	 */
	public String getFilterName()
	{
		return filterName;
	}

	/**
	 * 
	 * @param filterName
	 */
	public void setFilterName(String filterName)
	{
		this.filterName = filterName;
	}

	// instantiating the logger object.
	private static Logger LOGGER = Logger.getLogger(ReportFilter.class);
}
