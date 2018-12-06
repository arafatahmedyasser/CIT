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

import java.io.Serializable;

/**
 * Column Related MetaData details for a Transcation Code.
 * 
 * @version 1.0
 */
public class ColumnMetaData implements Serializable
{
	/**
	 * Internal constant for serialization purposes
	 */
	private static final long serialVersionUID = 9041237877927674706L;
	public static final String TYPE_ALPHANUMERIC = "TYPE_ALPHANUMERIC";
	public static final String TYPE_NUMERIC = "TYPE_NUMERIC";
	public static final String TYPE_NUMERIC_INTEGER = "TYPE_NUMERIC_INTEGER";
	public static final String TYPE_DATE = "TYPE_DATE";
	public static final String TYPE_SUB_TOTAL = "TYPE_SUB_TOTAL";
	public static final String TYPE_ALPHANUMERIC_R = "TYPE_ALPHANUMERIC_R";
	public static final String TYPE_DATE_TIME = "TYPE_DATE_TIME";

	private String columnType = TYPE_ALPHANUMERIC;
	private String columnTitle = "";
	private String format = "";
	private int width = -1;
	private boolean wrap = false;
	private boolean isGroup = false;

	/**
	 * Default Constructor
	 * 
	 */
	public ColumnMetaData()
	{
	}

	/**
	 * parameterized Constructor
	 * 
	 * @param columnType
	 * @param columnTitle
	 * @param isGroup
	 * @param format
	 * @param width
	 * @param wrap
	 */

	public ColumnMetaData(String columnType, String columnTitle, boolean isGroup, String format, int width, boolean wrap)
	{
		this.columnType = columnType;
		this.columnTitle = columnTitle;
		this.isGroup = isGroup;
		this.format = format;
		this.width = width;
		this.wrap = wrap;
	}

	/**
	 * To get the ColumnType
	 * 
	 * @return Returns the ColumnType
	 */

	public String getColumnType()
	{
		return this.columnType;
	}

	/**
	 * To get the ColumnTitle
	 * 
	 * @return Returns the ColumnTitle
	 */
	public String getColumnTitle()
	{
		return this.columnTitle;
	}

	/**
	 * To get the IsGroup
	 * 
	 * @return Returns the IsGroup
	 */
	public boolean getIsGroup()
	{
		return this.isGroup;
	}

	/**
	 * To get the Wrap
	 * 
	 * @return Returns the wrap
	 */
	public boolean getWrap()
	{
		return this.wrap;
	}

	/**
	 * To get the Format
	 * 
	 * @return Returns the Format
	 */
	public String getFormat()
	{
		return this.format;
	}

	/**
	 * To get the Width
	 * 
	 * @return Returns the Width
	 */
	public int getWidth()
	{
		return this.width;
	}

}
