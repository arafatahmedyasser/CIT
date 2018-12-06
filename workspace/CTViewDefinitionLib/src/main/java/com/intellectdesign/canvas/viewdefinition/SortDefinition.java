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

/**
 * This is the Value object which contains the definition of sort for a column
 * 
 * @version 1.0
 */
public class SortDefinition
{
	/**
	 * ref to GetColId
	 * 
	 * @return
	 */
	public String getColumnID()
	{
		return columnID;
	}

	/**
	 * ref to SetCol ID
	 * 
	 * @param columnID
	 */
	public void setColumnID(String columnID)
	{
		this.columnID = columnID;
	}

	/**
	 * ref to GetSortOrder
	 * 
	 * @return
	 */
	public String getSortOrder()
	{
		return sortOrder;
	}

	/**
	 * ref to setSortOrder
	 * 
	 * @param sortOrder
	 */
	public void setSortOrder(String sortOrder)
	{
		this.sortOrder = sortOrder;
	}

	/**
	 * ref to get SortPostion
	 * 
	 * @return
	 */
	public int getSortPosition()
	{
		return sortPosition;
	}

	/**
	 * ref to set sortPosition
	 * 
	 * @param sortPosition
	 */
	public void setSortPosition(int sortPosition)
	{
		this.sortPosition = sortPosition;
	}

	/**
	 * ref to get columnDatatype
	 * 
	 * @return the columnDatatype
	 */
	public String getColumnDatatype()
	{
		return columnDatatype;
	}

	/**
	 * ref to SetcolumnDatatype
	 * 
	 * @param columnDatatype the columnDatatype to set
	 */
	public void setColumnDatatype(String columnDatatype)
	{
		this.columnDatatype = columnDatatype;
	}

	/**
	 * ref to GetActualColID
	 * 
	 * @return the actualColumnID
	 */
	public String getActualColumnID()
	{
		return actualColumnID;
	}

	/**
	 * ref to setActualColumnID
	 * 
	 * @param actualColumnID the actualColumnID to set
	 */
	public void setActualColumnID(String actualColumnID)
	{
		this.actualColumnID = actualColumnID;
	}

	/**
	 * ref to StringBuffer to Str values
	 * 
	 * @return
	 * @see java.lang.Object#toString()
	 */
	public String toString()
	{
		return new StringBuffer("Column ID : ").append(columnID).append(", Sort Order : ").append(sortOrder)
				.append(", sortPosition : ").append(sortPosition).append(", columnDatatype : ").append(columnDatatype)
				.append(", actualColumnID : ").append(actualColumnID).toString();

	}

	private String columnID = null;
	private String sortOrder = null;
	private int sortPosition = ViewDefinitionConstants.MAX_VALUE;
	private String columnDatatype = null;

	private String actualColumnID = null;
}
