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
 * Contains Summary metadata
 * 
 * @version 1.0
 */
public class SummaryMetaData
{
	private int colWidth = -1;
	private boolean nowrap = false;
	private boolean bold = true;
	private boolean italic = false;
	private boolean isLabel = false;
	private int colSpan = 1;
	private String align = "left";

	/**
	 * Default Constructor
	 */
	public SummaryMetaData()
	{
	}

	/**
	 * Constructor with params
	 * 
	 * @param colWidth
	 * @param colSpan
	 * @param nowrap
	 * @param bold
	 * @param italic
	 * @param isLabel
	 * @param align
	 */
	public SummaryMetaData(int colWidth, int colSpan, boolean nowrap, boolean bold, boolean italic, boolean isLabel,
			String align)
	{
		this.colWidth = colWidth;
		this.nowrap = nowrap;
		this.bold = bold;
		this.italic = italic;
		this.isLabel = isLabel;
		this.colSpan = colSpan;
		this.align = align;
	}

	/**
	 * Constructor with params
	 * 
	 * @param colWidth
	 * @param isLabel
	 */
	public SummaryMetaData(int colWidth, boolean isLabel)
	{
		this.colWidth = colWidth;
		this.isLabel = isLabel;
	}

	/**
	 * Constructor with params
	 * 
	 * @param colWidth
	 * @param colSpan
	 * @param isLabel
	 */

	public SummaryMetaData(int colWidth, int colSpan, boolean isLabel)
	{
		this.colWidth = colWidth;
		this.colSpan = colSpan;
		this.isLabel = isLabel;
	}

	/**
	 * Constructor with params
	 * 
	 * @param colWidth
	 * @param bold
	 * @param isLabel
	 */

	public SummaryMetaData(int colWidth, boolean bold, boolean isLabel)
	{
		this.colWidth = colWidth;
		this.bold = bold;
		this.isLabel = isLabel;
	}

	/**
	 * method that gets ColWidth
	 * 
	 * @return Returns the ColWidth
	 */

	public int getColWidth()
	{
		return this.colWidth;
	}

	/**
	 * method that gets ColSpan
	 * 
	 * @return Returns the ColSpan
	 */
	public int getColSpan()
	{
		return this.colSpan;
	}

	/**
	 * method that gets Nowrap
	 * 
	 * @return Returns the Nowrap
	 */

	public boolean getNowrap()
	{
		return this.nowrap;
	}

	/**
	 * method that gets Bold
	 * 
	 * @return Returns the Bold
	 */

	public boolean getBold()
	{
		return this.bold;
	}

	/**
	 * method that gets Italic
	 * 
	 * @return Returns the Italic
	 */
	public boolean getItalic()
	{
		return this.italic;
	}

	/**
	 * method that gets IsLabel
	 * 
	 * @return Returns the IsLabel
	 */
	public boolean getIsLabel()
	{
		return this.isLabel;
	}

	/**
	 * method that gets Align
	 * 
	 * @return Returns the Align
	 */
	public String getAlign()
	{
		return this.align;
	}

	/**
	 * This method is used to set the ColWidth
	 * 
	 * @param colWidth to set
	 */

	public void setColWidth(int colWidth)
	{
		this.colWidth = colWidth;
	}

	/**
	 * This method is used to set the ColSpan
	 * 
	 * @param colSpan to set
	 */

	public void setColSpan(int colSpan)
	{
		this.colSpan = colSpan;
	}

	/**
	 * This method is used to set the Nowrap
	 * 
	 * @param nowrap to set
	 */

	public void setNowrap(boolean nowrap)
	{
		this.nowrap = nowrap;
	}

	/**
	 * This method is used to set the bold
	 * 
	 * @param bold to set
	 */
	public void setBold(boolean bold)
	{
		this.bold = bold;
	}

	/**
	 * This method is used to set the italic
	 * 
	 * @param italic to set
	 */
	public void setItalic(boolean italic)
	{
		this.italic = italic;
	}

	/**
	 * This method is used to set the isLabel
	 * 
	 * @param isLabel to set
	 */
	public void setIsLabel(boolean isLabel)
	{
		this.isLabel = isLabel;
	}

	/**
	 * This method is used to set the Align
	 * 
	 * @param align to set
	 */
	public void setAlign(String align)
	{
		this.align = align;
	}

	/**
	 * This method is used to get the TdTag
	 * 
	 * @param value
	 * @return String
	 */

	public String getTdTag(String value)
	{
		StringBuffer tag = new StringBuffer();
		tag.append("<td ").append((colWidth == -1) ? "" : ("width=\"" + colWidth + "%\""))
				.append(" align=\"" + align + "\"").append(" colspan=\"" + colSpan + "\"")
				.append((nowrap) ? " nowrap" : "").append(">").append((bold) ? "<b>" : "")
				.append((italic) ? "<i>" : "").append(value).append((italic) ? "</i>" : "")
				.append((bold) ? "</b>" : "").append("</td>");
		return tag.toString();
	}

	/**
	 * This method is used to get the String Representation of all values
	 * 
	 * @return String
	 */

	public String toString()
	{
		return colWidth + " : " + colSpan + " : " + bold + " : " + italic + " : " + nowrap + " : " + isLabel + " : "
				+ align;
	}

}