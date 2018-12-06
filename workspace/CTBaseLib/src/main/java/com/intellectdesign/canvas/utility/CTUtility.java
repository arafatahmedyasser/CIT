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
package com.intellectdesign.canvas.utility;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.TimeZone;

import com.intellectdesign.canvas.logger.Logger;

/**
 * This class is for CTUtility
 * 
 * @version 1.0
 */
public class CTUtility
{
	private static final Logger logger = Logger.getLogger(CTUtility.class);
	
	
	/**
	 * method ref to Str Values to Day to Month
	 * 
	 * @return String
	 */
	public static String getDateTime()
	{
		String mon[] =
		{ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
		String day[] =
		{ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18",
				"19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31" };
		TimeZone t = TimeZone.getDefault();
		Calendar calendar = new GregorianCalendar(t);
		Date trialTime = new Date();
		StringBuffer sbufFilename = new StringBuffer();

		calendar.setTime(trialTime);
		sbufFilename.append(day[(calendar.get(Calendar.DATE)) - 1]);
		sbufFilename.append(mon[(calendar.get(Calendar.MONTH))].toUpperCase());
		sbufFilename.append(Integer.toString(calendar.get(Calendar.YEAR)));
		sbufFilename.append("_" + Integer.valueOf(calendar.get(Calendar.HOUR_OF_DAY)).toString());
		sbufFilename.append(Integer.valueOf(calendar.get(Calendar.MINUTE)).toString());
		sbufFilename.append(Integer.valueOf(Calendar.SECOND).toString());
		sbufFilename.append(Integer.valueOf(Calendar.MILLISECOND).toString());

		return sbufFilename.toString();
	}

	/**
	 * A utility method which checks if the paramvalue is -1, if it is then it does not adds it to the map
	 * 
	 * @param paramName
	 * @param paramValue
	 * @param dataMap
	 */
	public static void checkAndAddParamKeyValueToMap(String paramName, Object paramValue, Map dataMap)
	{
		if (paramValue instanceof List)// if value is a list type just add
			dataMap.put(paramName, paramValue);
		else
		// else assuming its a string
		{
			String pValue = (String) paramValue;
			if (pValue != null && !"-1".equals(pValue))
				dataMap.put(paramName, pValue);
		}
		logger.ctdebug("CTBAS00123", "checkAndAddParamKeyValueToMap", paramName, paramValue);
	}

	/**
	 * Gets a set of String as String array given a delimiter separated list - like "100^101^102" gives a array of 3
	 * elements if delimiter is given as ^
	 * 
	 * @param list - The delimited string that has to be divided
	 * @return String[] The array of strings.
	 */
	public static String[] getDelimitedList(String list, String delimiter)
	{
		if (list == null || delimiter == null)
			return null;
		StringTokenizer tok = new StringTokenizer(list, delimiter);
		int count = tok.countTokens();
		String sepList[] = null;
		if (count != 0)
		{
			sepList = new String[count];
			for (int i = 0; i < count; i++)
			{
				sepList[i] = tok.nextToken();
			}
		}
		return sepList;
	}
	/**
	 * Gets a set of String as String array given a comma separated list - like "100,101,102" gives a array of 3
	 * elements
	 * 
	 * @param list - The delimited string that has to be divided
	 * @return String[] The array of strings.
	 */
	public static String[] getCommaSeparatedList(String list)
	{
		return getDelimitedList(list, ",");
	}
	
	/**
	 * Thie API used to find the delimiter value
	 * 
	 * @param dateStr - Date string to find the delimiter
	 * @return Returns delimiter value if incoming date value contains any one of / . - # else returns empty string
	 */
	public static String findDelimiter(String dateStr)
	{
		String cmName = "CTUtility.findDelimiter()";
		logger.ctdebug("CTBAS00121", cmName);
		String delimiter = "";
		if (dateStr.indexOf("/") != -1)
		{
			delimiter = "/";
		} else if (dateStr.indexOf(".") != -1)
		{
			delimiter = ".";
		} else if (dateStr.indexOf("-") != -1)
		{
			delimiter = "-";
		} else if (dateStr.indexOf("#") != -1)
		{
			delimiter = "#";
		}
		logger.ctdebug("CTBAS00122", cmName, delimiter);
		return delimiter;
	}
	/**
	 * method ref to LogdateTime Calender Calender
	 * 
	 * @param messageName
	 * @param calender
	 */
	public static void logDateTime(String messageName, Calendar calender)
	{
		SimpleDateFormat sdf = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss z");
		sdf.setCalendar(calender);
		logger.ctdebug("CTBAS00120", "CTUtility.logDateTime", messageName, sdf.format(calender.getTime()));
	}
	/**
	 * A utility method to convert date/time from one timezone to another
	 * 
	 * @param fromTime - The source /from date time object
	 * @param timeZoneOffset - The timezone offset to convert to.
	 * @return the converted Calendar (date/time) object
	 */
	public static Calendar convertTimeZone(Calendar fromTime, String timeZoneOffset)
	{
		logDateTime("Before Conversion - System Date and Time:", fromTime);
		Calendar toTimezoneCal = new GregorianCalendar(TimeZone.getTimeZone(timeZoneOffset));
		toTimezoneCal.setTimeInMillis(fromTime.getTimeInMillis());
		logDateTime("After Conversion - User Time Zone Data and Time:", toTimezoneCal);
		return toTimezoneCal;
	}
	/**
	 * method ref to Replaces " by &quot;
	 * 
	 * @param value - The string whose " has to be replaced
	 * @return String The replaced string.
	 */
	public static String replaceQuote(String value)
	{
		if (value == null || value.indexOf("\"") == -1)
			return value;
		StringBuffer removed = new StringBuffer();
		int index = value.indexOf("\"");
		while (index != -1)
		{
			removed.append(value.substring(0, index)).append("&quot;");
			value = value.substring(index + 1);
			index = value.indexOf("\"");
		}
		return removed.append(value).toString();
	}
	
}
