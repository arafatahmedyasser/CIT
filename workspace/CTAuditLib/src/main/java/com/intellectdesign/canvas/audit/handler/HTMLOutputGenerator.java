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

package com.intellectdesign.canvas.audit.handler;

/**
 * Helper class that helps convert the content to HTML table template This generates a HTML output that starts with only
 * the table element. Does not include the header and footer.
 * 
 * @version 1.0
 */
public class HTMLOutputGenerator
{
	private StringBuffer htmlBuffer = null;
	private boolean auditOldValues = false;

	/**
	 * Default constructor that takes teh flag indicating whether old values are present
	 * 
	 * @param oldValuesPresent
	 */
	public HTMLOutputGenerator(boolean oldValuesPresent)
	{
		this.auditOldValues = oldValuesPresent;
		htmlBuffer = new StringBuffer();
	}

	/**
	 * Starts the body of the generator
	 */
	public void startBody()
	{
		htmlBuffer.append("<table cellspacing=\"0\" cellpadding=\"0\" width=\"99%\" align=\"center\" border=\"0\">");
		htmlBuffer.append("<tr class=\"header\"><td width=\"30%\">Field</td>");
		int width = 70;
		String newLabel = "Data Values";
		if (auditOldValues)
		{
			width = width / 2;
			htmlBuffer.append("<td width=\"").append(width).append("%\">Old Data Value</td>");
			newLabel = "New Data Value";
		}
		htmlBuffer.append("<td width=\"").append(width).append("%\">").append(newLabel).append("</td></tr>");
	}

	/**
	 * Finishes the body of the generator
	 */
	public void endBody()
	{
		htmlBuffer.append("</table>");
		htmlBuffer
				.append("<div><span class=\"modified\"><span class=\"star\">*</span> indicates values that have been modified as part of this action</span></div>");
	}

	/**
	 * Hook for adding content when a field is getting added
	 */
	public void startField()
	{
	}

	/**
	 * Hook for adding content when a field addition is completed
	 */
	public void endField()
	{
	}

	/**
	 * Hook for adding content when a List is getting added
	 */
	public void startCollectionList()
	{
	}

	/**
	 * Hook for adding content when a List addition is completed
	 */
	public void endCollectionList()
	{
	}

	/**
	 * Hook for adding content when a Map is getting added
	 */
	public void startCollectionMap()
	{
	}

	/**
	 * Hook for adding content when a Map addition is completed
	 */
	public void endCollectionMap()
	{
		int colSpan = 2;
		if (auditOldValues)
			colSpan = 3;
		htmlBuffer.append("<tr class=\"collend\"><td colspan=\"").append(colSpan).append("\">&nbsp;</td></tr>");
	}

	/**
	 * Adds a particular row. The class of the TR element is adjusted to the level provided
	 * 
	 * @param level
	 * @param fieldName
	 * @param oldValue
	 * @param newValue
	 * @param isModified
	 */
	public void addRow(int level, String fieldName, String oldValue, String newValue, boolean isModified)
	{
		String titleClass = "l" + level + "-title";
		String modifiedSuffixText = "";
		String modifiedPrefixText = "";
		if (isModified && newValue != null & !"".equals(newValue))
		{
			modifiedPrefixText = "<span class=\"modified\">";
			modifiedSuffixText = "<span class=\"star\">*</span></span>";
		}
		htmlBuffer.append("<tr class=\"field\"><td class=\"").append(titleClass).append("\">")
				.append(checkEmptyString(fieldName)).append("</td>");
		if (auditOldValues)
			htmlBuffer.append("<td class=\"value\">").append(checkEmptyString(oldValue)).append("</td>");
		htmlBuffer.append("<td class=\"value\">").append(modifiedPrefixText).append(checkEmptyString(newValue))
				.append(modifiedSuffixText).append("</td>");
	}

	/**
	 * Helper method that checks whether a string is empty. If yes, returns a &nbsp; so that HTML can render properly
	 * 
	 * @param aValue
	 * @return String
	 */
	private String checkEmptyString(String aValue)
	{
		if (aValue == null || aValue.trim().equals(""))
			return "&nbsp;";
		else
			return aValue;
	}

	/**
	 * Returns the generated HTML snippet till now.
	 * 
	 * @return String
	 */
	public String toString()
	{
		return htmlBuffer.toString();
	}
}
