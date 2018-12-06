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

package com.intellectdesign.canvas.viewdefinition;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.StringTokenizer;

/**
 * This is the Value object which contains the filter data related to a Column
 * 
 * @version 1.0
 */
public class ColumnFilter implements Serializable, Cloneable
{

	/**
	 * Override the Object's implementation to return the cloned copy of this class
	 * 
	 * @return clonedfilter
	 * @see java.lang.Object#clone()
	 */
	public Object clone() throws CloneNotSupportedException
	{
		ColumnFilter clonedFilter = (ColumnFilter) super.clone();
		ArrayList clonedFilterValues = null;
		if (clonedFilter.getFilterValues() != null)
		{
			clonedFilterValues = new ArrayList();
			// Since the contents of the arraylist is nothing from Strings or basic data types, we can just copy the
			// contents into the new list.
			clonedFilterValues.addAll(clonedFilter.getFilterValues());
			clonedFilter.setFilterValues(clonedFilterValues);
		}

		return clonedFilter;
	}

	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 3320159468429939539L;

	/*
	 * 
	 * 
	 * //View doesnt need this so dont put it in Hashmap: sortRequired, filterRequired FILTERS: FLD_COLUMN_ID FILTER_ID
	 * FILTER_TYPE FLD_DATA_TYPE FILTER_VALUES: #VALUES#
	 */
	public HashMap getColumnFilterAsMap()
	{
		HashMap cfdf = new HashMap();

		cfdf.put(ViewDefinitionConstants.FLD_COLUMN_ID, columnID);
		cfdf.put(ViewDefinitionConstants.FLD_FILTER_ID, filterID);
		cfdf.put(ViewDefinitionConstants.FLD_FILTER_TYPE, filterType);
		cfdf.put(ViewDefinitionConstants.FLD_FILTER_VALUES, filterValues);
		cfdf.put(ViewDefinitionConstants.FLD_DATA_TYPE, dataType);

		return cfdf;
	}

	/**
	 * ref to GetFilterId
	 * 
	 * @return filter Id
	 */
	public String getFilterID()
	{
		return filterID;
	}

	/**
	 * ref to SetFilterId
	 * 
	 * @param filterID
	 */
	public void setFilterID(String filterID)
	{
		this.filterID = filterID;
	}

	/**
	 * ref to FilterType
	 * 
	 * @return filter type
	 */
	public String getFilterType()
	{
		return filterType;
	}

	/**
	 * ref to Set FilterType
	 * 
	 * @param filterType
	 */
	public void setFilterType(String filterType)
	{
		this.filterType = filterType;
	}

	/**
	 * ref to datatype
	 * 
	 * @return data type
	 */
	public String getDataType()
	{
		return dataType;
	}

	/**
	 * ref to setDatatype
	 * 
	 * @param dataType
	 */
	public void setDataType(String dataType)
	{
		this.dataType = dataType;
	}

	/**
	 * ref to ArrayList to Filter Values
	 * 
	 * @return filter vales
	 */
	public ArrayList getFilterValues()
	{
		return filterValues;
	}

	/**
	 * ref to Set Filter values
	 * 
	 * @param filterValues
	 */
	public void setFilterValues(ArrayList filterValues)
	{
		this.filterValues = filterValues;
		int count = 0;

		if (filterValues != null && !filterValues.isEmpty())
		{
			StringBuffer strBuffer = new StringBuffer();
			for (int i = 0; i < filterValues.size(); i++)
			{
				if (!"".equals(filterValues.get(i)))
				{
					count++;
					if(count!=1){
						strBuffer.append(",");
					}
					strBuffer.append(filterValues.get(i));
				}

			}
			strFilterValues = strBuffer.toString();
		}

	}

	/**
	 * ref to getFilter Values
	 * 
	 * @return Filter Vlaues
	 */
	public String getStrFilterValues()
	{
		return strFilterValues;
	}

	/**
	 * ref to set Filter values
	 * 
	 * @param strFilterValues
	 */
	public void setStrFilterValues(String strFilterValues)
	{
		this.strFilterValues = strFilterValues;
		if (strFilterValues != null && !"".equals(strFilterValues))
		{
			filterValues = new ArrayList();
			StringTokenizer tokenizer = new StringTokenizer(strFilterValues, ",");
			while (tokenizer.hasMoreTokens())
			{
				filterValues.add(tokenizer.nextToken());
			}
		}
	}

	/**
	 * ref to GetColId
	 * 
	 * @return iD
	 */
	public String getColumnID()
	{
		return columnID;
	}

	/**
	 * ref to set Col Id
	 * 
	 * @param columnID
	 */
	public void setColumnID(String columnID)
	{
		this.columnID = columnID;
	}

	/**
	 * returns the string representation of Column Filter values
	 * 
	 * @return Sb
	 */
	public String toString()
	{

		return new StringBuffer(" Filter ID : ").append(filterID).append(",").append(" Column ID : ").append(columnID)
				.append(", Filter Type : ").append(filterType).append(", Data Type : ").append(dataType)
				.append(", Comma seperated FilterValues : ").append(strFilterValues).append(", List Filter Values : ")
				.append(filterValues).toString();

	}

	private String filterID = null;
	private String columnID = null;
	private String filterType = null;
	private String dataType = null;
	private ArrayList filterValues = null;// These are the values used by this filter to filter the data
	private String strFilterValues = null;// This contains the filter values seperated by commas.
}
