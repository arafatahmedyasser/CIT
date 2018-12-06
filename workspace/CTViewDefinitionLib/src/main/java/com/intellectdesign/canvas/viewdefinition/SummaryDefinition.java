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
 * This Value Object holds the information of columns and thier aggregation type.
 * 
 * @version 1.0
 */
public class SummaryDefinition implements Cloneable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private String columnID = null;
	private String columnDatatype = null;
	private String summarytype = null;

	/**
	 * ref to GetColID
	 * 
	 * @return the columnID
	 */
	public String getColumnID()
	{
		return columnID;
	}

	/**
	 * ref to SetCol Id
	 * 
	 * @param columnID the columnID to set
	 */
	public void setColumnID(String columnID)
	{
		this.columnID = columnID;
	}

	/**
	 * ref to GetColDataType
	 * 
	 * @return the columnDatatype
	 */
	public String getColumnDatatype()
	{
		return columnDatatype;
	}

	/**
	 * ref to Set ColDataType
	 * 
	 * @param columnDatatype the columnDatatype to set
	 */
	public void setColumnDatatype(String columnDatatype)
	{
		this.columnDatatype = columnDatatype;
	}

	/**
	 * ref to SumarrayType
	 * 
	 * @return the summarytype
	 */
	public String getSummarytype()
	{
		return summarytype;
	}

	/**
	 * ref to SetSummary type
	 * 
	 * @param summarytype the summarytype to set
	 */
	public void setSummarytype(String summarytype)
	{
		this.summarytype = summarytype;
	}

	/**
	 * Override the base class implementation to return a proper clone of this object.
	 * 
	 * @return
	 * @exception CloneNotSupportedException
	 * @see java.lang.Object#clone()
	 */
	public Object clone() throws CloneNotSupportedException
	{
		SummaryDefinition clonedSD = (SummaryDefinition) super.clone();

		return clonedSD;
	}
}
