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

/**
 * Column Related Details for a Transcation Code.
 * 
 * @version 1.0
 */
public class Column implements java.io.Serializable
{

	/**
	 * Default value of serialVersionUID
	 */
	private static final long serialVersionUID = 1L;

	// "COLUMN_NAME, FIELD_NAME, COLUMN_TYPE, COLUMN_WIDTH, GROUPING_FLAG";
	// "LINK_FLAG, LINK_REP_TXN_CODE, LINK_PARAM, COLUMN_POSITION";

	/** VARIABLES CONSTRUCTOR */
	protected String strColumnName; // COLUMN_NAME
	protected String strFieldName; // FIELD_NAME
	protected String strType; // COLUMN_TYPE
	protected String strFormat; // COLUMN_FORMAT
	protected String strWidth; // COLUMN_WIDTH
	protected int iPosition; // COLUMN_POSITION
	protected boolean bGroup; // GROUPING_FLAG
	protected String strLink; // LINK_FLAG
	protected String strLinksTxn; // LINK_REP_TXN_CODE
	protected String strLinksParams; // LINK_PARAM
	protected String strColumnWrap; // COLUMN_WRAP
	protected String strTooltipDesc; // TOOL_TIP
	protected String strSortOrder; // sorting cloumn number
	protected boolean bSuppress; // Can Suppress

	/**
	 * Constructor
	 */
	public Column()
	{
		// ...implementation goes here...
	}

	/***
	 * To set the Name of the Column
	 * @param strColumnNameF Column Name.
	 * @return void.
	 */
	public void setColumnName(String strColumnNameF)
	{
		strColumnName = strColumnNameF;
	}

	/***
	 * To Get the Name of the Column
	 * @return Column Name.
	 */
	public String getColumnName()
	{
		return strColumnName;
	}

	/***
	 * To set the Field Name of the Column
	 * @param strFieldNameF Field Name.
	 * @return void.
	 */
	public void setFieldName(String strFieldNameF)
	{
		strFieldName = strFieldNameF;
	}

	/***
	 * To Get the Field Name of the Column
	 * @return Field Name.
	 */
	public String getFieldName()
	{
		return strFieldName;
	}

	/***
	 * To set the Type of the Column
	 * @param strTypeF Type.
	 * @return void.
	 */
	public void setType(String strTypeF)
	{
		strType = strTypeF;
	}

	/***
	 * To Get the Type of the Column
	 * @return strType.
	 */
	public String getType()
	{
		return strType;
	}

	/***
	 * To set the Format of the Column
	 * @param strFormatF Format Type.
	 * @return void.
	 */
	public void setFormat(String strFormatF)
	{
		strFormat = strFormatF;
	}

	/***
	 * To Get the Format of the Column
	 * @return Format Type.
	 */
	public String getFormat()
	{
		return strFormat;
	}

	/***
	 * To set the Width of the Column
	 * @param strWidthF Width.
	 * @return void.
	 */
	public void setWidth(String strWidthF)
	{
		strWidth = strWidthF;
	}

	/***
	 * To Get the Width of the Column
	 * @return Width.
	 */
	public String getWidth()
	{
		return strWidth;
	}

	/***
	 * To set the Position of the Column
	 * @param iPositionF Position.
	 * @return void.
	 */
	public void setPosition(int iPositionF)
	{
		iPosition = iPositionF;
	}

	/***
	 * To Get the Position of the Column
	 * @return Position.
	 */
	public int getPosition()
	{
		return iPosition;
	}

	/***
	 * To set If it can be Grouped
	 * @param boolean
	 * @return void.
	 */
	public void setGroup(boolean bGroupF)
	{
		bGroup = bGroupF;
	}

	/***
	 * To Get If it can be Grouped
	 * 
	 * @return boolean
	 */
	public boolean getGroup()
	{
		return bGroup;
	}

	/***
	 * To set the Transcation Links of the Column
	 * @param strLinkF Transcation Links.
	 * @return void.
	 */
	public void setLink(String strLinkF)
	{
		strLink = strLinkF;
	}

	/***
	 * To Get the Transcation Links of the Column
	 * @return String Links.
	 */
	public String getLink()
	{
		return strLink;
	}

	/***
	 * To set the Transcation Links of the Column
	 * @param Transcation Links.
	 * @return void.
	 */
	public void setLinksTxn(String strLinksTxnF)
	{
		strLinksTxn = strLinksTxnF;
	}

	/***
	 * To Get the Transcation Links of the Column
	 * @return String Transcation Links.
	 */
	public String getLinksTxn()
	{
		return strLinksTxn;
	}

	/***
	 * To set the Links Parameters of the Column
	 * @param strLinksParamsF Links Parameters.
	 * @return void.
	 */
	public void setLinksParams(String strLinksParamsF)
	{
		strLinksParams = strLinksParamsF;
	}

	/***
	 * To Get the Links Parameters of the Column
	 * @return String Links Parameters.
	 */
	public String getLinksParams()
	{
		return strLinksParams;
	}

	/***
	 * To set the Wrap of the Column
	 * @param strColumnWrapF Wrap Parameter.
	 * @return void.
	 */
	public void setWrap(String strColumnWrapF)
	{
		strColumnWrap = strColumnWrapF;
	}

	/***
	 * To Get the Wrap of the Column
	 * @return Wrap Parameter.
	 */
	public String getWrap()
	{
		return strColumnWrap;
	}

	/***
	 * To set Column's Tooltip
	 * @param strTooltipDescF Tooltip's description.
	 * @return void.
	 */
	public void setTooltipEn(String strTooltipDescF)
	{
		strTooltipDesc = strTooltipDescF;
	}

	/***
	 * To Get Column's Tooltip
	 * @return Tooltip's description.
	 */
	public String getTooltipEn()
	{
		return strTooltipDesc;
	}

	/***
	 * To set Column's Sort order Number
	 * @param strSortOrderF sort order number
	 * @return void.
	 */
	public void setSortOrder(String strSortOrderF)
	{
		strSortOrder = strSortOrderF;
	}

	/***
	 * To Get Sort order
	 * @return Returns the Sort order
	 */
	public String getSortOrder()
	{
		return strSortOrder;
	}
	
	/**
	 * To set boolean bSuppress
	 * 
	 */

	public void setNoSuppress(boolean bSuppressF)
	{
		bSuppress = bSuppressF;
	}

	/**
	 * To Get  bSuppress
	 * 
	 * @return Returns the  bSuppress
	 */
	public boolean getNoSuppress()
	{
		return bSuppress;
	}
	
	/**
	 * To Get String Representation of all fields
	 * 
	 * @return Returns the String Representation
	 */

	public String toString()
	{
		return strColumnName + " : " + strFieldName + " : " + strType + " : " + strFormat + " : " + strWidth + " : "
				+ bGroup + " : " + strColumnWrap + " : " + strSortOrder+" : "+bSuppress;
	}

	
}
