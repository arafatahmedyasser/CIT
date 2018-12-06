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

package com.intellectdesign.canvas.message;

import java.text.DateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.StringTokenizer;

import com.intellectdesign.canvas.constants.reports.ReportingConstants;
import com.intellectdesign.canvas.logger.Logger;

/**
 * Contains all functions required for managing ReportMessages.
 * 
 * @version 1.0
 */
public class ReportsMessageManager
{

	private static final Logger logger = Logger.getLogger(ReportsMessageManager.class);

	/**
	 * This method returns a messages given Locale information and Code. If the property file provided is not present
	 * then locale is defaulted to en_US and message retrieved.
	 * 
	 * @param propertyFile - File to fetch label entry for the given data
	 * @param messageCode - Code for which message is to be fetched
	 * @param language - Language Code
	 * @return String Return the message equivalent for the given code.
	 * @exception MissingResourceException
	 * @exception NullPointerException
	 */
	public static String getMessage(String propertyFile, String messageCode, String language)
	{
		try
		{
			ResourceBundle res = null;
			String country = "";
			String tempLang = "";
			if (language == null)
				language = "en_US";
			if (language.indexOf("_") > 0)
			{
				country = language.substring(language.indexOf("_") + 1);
				tempLang = language.substring(0, language.indexOf("_"));
			}

			try
			{
				try
				{
					res = ResourceBundle.getBundle(propertyFile, new Locale(tempLang, country));
				} catch (Exception e)
				{
					res = ResourceBundle.getBundle(propertyFile, new java.util.Locale("en", "US"));
				}
				if (res != null)
				{
					return res.getString(messageCode);
				}
			} catch (MissingResourceException mre)
			{
				return messageCode;
			} catch (NullPointerException npe)
			{
				return messageCode;
			}

			return messageCode;
		} catch (Exception e)
		{
			logger.cterror("CTEXP00035", e, e.getMessage());
			return messageCode;
		}
	}

	/**
	 * This method returns a messages given Code without Locale information. If the property file provided is not
	 * present then locale is defaulted to en_US and message retrieved.
	 * 
	 * @param propertyFile - File to fetch label entry for the given data
	 * @param messageCode - Code for which message is to be fetched
	 * @return String Return the message equivalent for the given code.
	 */
	public static String getMessage(String propertyFile, String messageCode)
	{
		return getMessage(propertyFile, messageCode, "en_US");
	}

	/**
	 * This method return the date in a format specific to Locale information.
	 * 
	 * @param language - Language Code
	 * @return String - Date as a string formatted to specific locale
	 */
	public static String getDate(String language)
	{
		String country = "";
		String tempLang = "";
		if (language.indexOf("_") > 0)
		{
			country = language.substring(language.indexOf("_") + 1);
			tempLang = language.substring(0, language.indexOf("_"));
		}

		String dateL = DateFormat.getDateInstance(DateFormat.MEDIUM, new Locale(tempLang, country)).format(new Date());
		return dateL;
	}

	/**
	 * This method returns the report title after checking for AS_ON_DATE in the title
	 * 
	 * @param strReportIntelHeader - Report title
	 * @return String - strReportIntelHeader
	 */
	public static String replacePredefined(String strReportIntelHeader)
	{
		if (strReportIntelHeader == null)
			return "";
		if (strReportIntelHeader.indexOf("$AS_ON_DATE") >= 0)
		{
			strReportIntelHeader = strReportIntelHeader.substring(0, strReportIntelHeader.indexOf("$AS_ON_DATE"))
					+ java.text.DateFormat.getDateInstance().format(new Date())
					+ strReportIntelHeader.substring(strReportIntelHeader.indexOf("$AS_ON_DATE")
							+ "$AS_ON_DATE".length());
		}
		return strReportIntelHeader;
	}

	/**
	 * This method returns the report after checking the entire detail(detailParams) which is in the form of hash map.
	 * 
	 * @param reportTitle - Existing Report title
	 * @param detailParams - HashMap containing detail report params
	 * @param langID -Language ID
	 * @return String
	 */
	public static String replacePredefinedDetail(String reportTitle, HashMap detailParams, String langID)
	{
		String cmName = "[ReportsMessageManager.replacePredefinedDetail()]";
		logger.ctinfo("CTEXP00026", cmName);
		reportTitle = ReportsMessageManager.getMessage(ReportingConstants.EZ_LABELS, reportTitle, langID);
		StringTokenizer titleTokenizer = new StringTokenizer(reportTitle);
		StringBuffer titleBuffer = new StringBuffer(reportTitle);
		String strToken = null;
		int replStrLength = 0;
		int replStrIndex = 0;
		while (titleTokenizer.hasMoreTokens())
		{
			strToken = titleTokenizer.nextToken();
			if (strToken.indexOf("$") != -1)
			{
				replStrLength = new String(strToken).length();
				strToken = strToken.substring(1, replStrLength);
				if (detailParams.get(strToken) != null)
				{
					replStrIndex = titleBuffer.toString().indexOf("$" + strToken);
					titleBuffer = titleBuffer.replace(replStrIndex, replStrIndex + replStrLength,
							(String) detailParams.get(strToken));
				}
			}
		}
		return (titleBuffer.toString());
	}
}