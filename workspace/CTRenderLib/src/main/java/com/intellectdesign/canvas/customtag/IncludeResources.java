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
package com.intellectdesign.canvas.customtag;

import java.io.IOException;
import java.util.StringTokenizer;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;

import com.intellectdesign.canvas.config.ConfigurationManager;

/**
 * Reads language entries from orbionedirect.properties and renders appropriate resourcebundle <script> element(s) to
 * include framework/library js files(extjs, plug-in, etc) for HTML/XHTML portals.
 * 
 * @version 1.0
 */
public class IncludeResources extends TagSupport
{

	private String SCRIPT_START = "<script language=\"javascript\" src=\"";
	private String SCRIPT_END = "\"></script>";
	private String DELIMITER = ",";
	private String filePath = "/CTRIAFramework/javascript/view/extjs/common/resourcebundle/iportal.resourcebundle.addbundles_";

	StringBuffer output = new StringBuffer();
	private String language = null;

	/**
	 * this method reads the a string which has values separated by delimiter and returns values as string array
	 * 
	 * @param String -that has values separated by delimiter
	 * @return String[]-array of values
	 * 
	 * */
	private String[] getDelimatedValues(String value)

	{
		StringTokenizer st = new StringTokenizer(value, this.DELIMITER);
		String returnVals[] = new String[st.countTokens()];
		int index = 0;
		while (st.hasMoreElements())
		{
			returnVals[index++] = (String) st.nextElement();
		}
		return returnVals;
	}

	/**
	 * set the langauge
	 * 
	 * @param language
	 */
	public void setLanguage(String language)
	{
		this.language = language;
	}

	/**
	 * get the language
	 * 
	 * @return language
	 */
	public String getLanguage()
	{
		return language;
	}

	/**
	 * This API would get property <code>this.LANG_COUNTRY_CODE</code> value form <code>configPrpt</code> and converts
	 * as String array
	 * 
	 * @return Converted String array contains property file names
	 * @throws Exception if LANG_COUNTRY_CODE key not defined or no value defined for LANG_COUNTRY_CODE key
	 * */
	protected String[] getLanguageCode() throws Exception
	{
		ConfigurationManager configMgr = ConfigurationManager.getInstance();
		String langu = configMgr.getSystemPrefDescriptor().getLanguageCountryCode();
		if (langu != null && !langu.trim().equals(""))
		{
			return getDelimatedValues(langu);
		} else
			throw new Exception(
					"Either LANG_COUNTRY_CODE key not defined or no value defined for LANG_COUNTRY_CODE key ");
	}

	/**
	 * renders appropriate resourcebundle <script> element(s) to include framework/library js files(extjs, plug-in, etc)
	 * for HTML/XHTML portals.
	 * 
	 * @return int
	 * @throws JspException ,IOException,Exception
	 * 
	 * */
	public int doStartTag() throws JspException
	{
		JspWriter out = pageContext.getOut();
		ConfigurationManager confMgr = ConfigurationManager.getInstance();
		String contextPath = confMgr.getSecurityDescriptor().getContextPath();
		String[] languages;
		try
		{
			languages = getLanguageCode();
			output.append(this.SCRIPT_START);
			output.append(contextPath + filePath + getLanguage() + ".js");
			output.append(this.SCRIPT_END);
			output.append("\n");
			out.print(output);
			output.delete(0, output.length());
		}

		catch (IOException e)
		{

			e.printStackTrace();
		} catch (JspException e)
		{

			e.printStackTrace();
		} catch (Exception e)
		{

			e.printStackTrace();
		}
		return SKIP_BODY;

	}
}
